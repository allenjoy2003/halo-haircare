import uuid
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Category,
    HairConcern,
    HairType,
    Product,
    RoutineBundle,
    CustomerReview,
    ChatSession,
    ChatMessage,
    Order
)
from .serializers import (
    CategorySerializer,
    HairConcernSerializer,
    HairTypeSerializer,
    ProductSerializer,
    RoutineBundleSerializer,
    CustomerReviewSerializer,
    ChatSessionSerializer,
    ChatMessageSerializer
)
import re
import hmac
import hashlib
import logging
from django.conf import settings
from twilio.rest import Client as TwilioClient
import razorpay
from .services.ai_doctor import ask_dr_kesh

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('order', 'name')
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class HairConcernViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HairConcern.objects.all().order_by('name')
    serializer_class = HairConcernSerializer
    lookup_field = 'slug'


class HairTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HairType.objects.all().order_by('id')
    serializer_class = HairTypeSerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Product.objects.all().select_related('category').prefetch_related('hair_types', 'concerns')

        # Filters
        concern = self.request.query_params.get('concern')
        if concern:
            queryset = queryset.filter(Q(concerns__slug=concern) | Q(concerns__name__icontains=concern)).distinct()

        hair_type = self.request.query_params.get('hair_type')
        if hair_type:
            queryset = queryset.filter(
                Q(hair_types__slug=hair_type) | 
                Q(hair_types__name__icontains=hair_type) | 
                Q(hair_types__code__icontains=hair_type)
            ).distinct()

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)

        routine_step = self.request.query_params.get('routine_step')
        if routine_step:
            queryset = queryset.filter(routine_step=routine_step)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(subtitle__icontains=search) |
                Q(key_ingredients__icontains=search) |
                Q(botanical_actives__icontains=search) |
                Q(clinical_actives__icontains=search) |
                Q(benefits__icontains=search)
            ).distinct()

        ordering = self.request.query_params.get('ordering')
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        bestsellers = Product.objects.filter(is_bestseller=True)[:8]
        serializer = self.get_serializer(bestsellers, many=True)
        return Response(serializer.data)


class RoutineBundleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RoutineBundleSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = RoutineBundle.objects.all().prefetch_related('products', 'target_hair_types', 'target_concerns')
        
        concern = self.request.query_params.get('concern')
        if concern:
            queryset = queryset.filter(Q(target_concerns__slug=concern) | Q(target_concerns__name__icontains=concern)).distinct()

        hair_type = self.request.query_params.get('hair_type')
        if hair_type:
            queryset = queryset.filter(
                Q(target_hair_types__slug=hair_type) |
                Q(target_hair_types__name__icontains=hair_type)
            ).distinct()

        return queryset


class CustomerReviewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomerReview.objects.all().order_by('-rating', '-created_at')
    serializer_class = CustomerReviewSerializer


from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

class OptionalJWTAuthentication(JWTAuthentication):
    """
    Attempts to authenticate with SimpleJWT.
    If token is invalid or expired, gracefully falls back to AnonymousUser instead of raising 401.
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except Exception:
            return None


class HairConsultationView(APIView):
    """
    POST /api/chat/hair-consultation/
    Interactively diagnoses the user's hair and scalp issues with root causes,
    holistic habit and nutritional therapies, and dynamic product recommendations.
    Accepts both authenticated users and guests seamlessly.
    """
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_message = request.data.get('message', '').strip()
        session_id_str = request.data.get('session_id')
        hair_profile = request.data.get('hair_profile', {})

        # Derive user and sanitized server-side name
        auth_user = request.user if getattr(request, 'user', None) and request.user.is_authenticated else None
        first_name = ""
        if auth_user:
            first_name = auth_user.first_name or auth_user.username or "Customer"
        
        user_display_name = first_name if first_name else "Guest"

        if not user_message:
            return Response(
                {"error": "Please provide a consultation message or question."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve or create session
        session = None
        if session_id_str:
            try:
                session = ChatSession.objects.filter(session_id=session_id_str).first()
            except Exception:
                session = None

        if not session:
            session = ChatSession.objects.create(
                user=auth_user,
                user_name=user_display_name,
                hair_profile=hair_profile
            )
        else:
            # Associate user if logged in and not previously linked
            if auth_user and not session.user:
                session.user = auth_user
                session.user_name = user_display_name
            # Update profile if newly provided
            if hair_profile:
                session.hair_profile = {**session.hair_profile, **hair_profile}
            session.save()

        # Save user message
        ChatMessage.objects.create(
            session=session,
            sender='user',
            message=user_message
        )

        # Build conversation history for LLM context
        past_messages = session.messages.order_by('created_at')[:8]
        history = [{"sender": m.sender, "message": m.message} for m in past_messages]

        # Call AI Guide with server-verified first_name
        consultation_result = ask_dr_kesh(
            user_message=user_message,
            user_profile=session.hair_profile,
            conversation_history=history,
            first_name=first_name
        )

        reply_text = consultation_result.get("reply", "")
        recommended_products = consultation_result.get("recommended_products", [])

        # Save Doctor reply
        doctor_msg = ChatMessage.objects.create(
            session=session,
            sender='doctor',
            message=reply_text,
            metadata={"recommended_count": len(recommended_products)}
        )
        if recommended_products:
            doctor_msg.recommended_products.set(recommended_products)

        # Serialize recommended products
        product_serializer = ProductSerializer(recommended_products, many=True)

        return Response({
            "session_id": str(session.session_id),
            "reply": reply_text,
            "recommended_products": product_serializer.data,
            "hair_profile": session.hair_profile,
            "created_at": doctor_msg.created_at
        }, status=status.HTTP_200_OK)


class ChatSessionDetailView(APIView):
    """
    GET /api/chat/session/<session_id>/
    Retrieves full chat history and recommendations for a given session.
    """
    def get(self, request, session_id):
        try:
            session = ChatSession.objects.prefetch_related('messages__recommended_products').get(session_id=session_id)
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)


from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# ====================================================================
# User Authentication Endpoints (Simple, College-Project Friendly)
# ====================================================================

@api_view(['POST'])
def auth_register(request):
    """
    POST /api/auth/register/
    Body: {"name": "Priya", "phone_number": "+919876543210", "password": "...", "email": "..."}
    Creates user and dispatches initial Twilio verification OTP.
    """
    name = (request.data.get('name') or '').strip()
    phone = (request.data.get('phone_number') or '').strip()
    password = (request.data.get('password') or '').strip()
    email = (request.data.get('email') or '').strip()

    if not phone or not password:
        return Response({"error": "Phone number and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    clean_digits = re.sub(r'[^\d+]', '', phone)
    formatted_phone = f"+91{clean_digits[-10:]}" if len(clean_digits) >= 10 else clean_digits

    User = get_user_model()
    # Use phone as username
    if User.objects.filter(username=formatted_phone).exists():
        return Response({"error": "An account with this phone number already exists."}, status=status.HTTP_400_BAD_REQUEST)

    first_name = name.split()[0] if name else "Customer"
    user = User.objects.create_user(
        username=formatted_phone,
        email=email,
        password=password,
        first_name=first_name,
        last_name=' '.join(name.split()[1:]) if ' ' in name else ''
    )

    # Dispatch OTP via Twilio
    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
    service_sid = getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', '')

    if account_sid and auth_token and service_sid:
        try:
            client = TwilioClient(account_sid, auth_token)
            client.verify.v2.services(service_sid).verifications.create(
                to=formatted_phone,
                channel='sms'
            )
        except Exception as e:
            logger.warning(f"Twilio register SMS failed: {e}")

    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "Account created. Verification code dispatched via SMS.",
        "user": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "email": user.email,
            "phone_number": formatted_phone,
        },
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def auth_login(request):
    """
    POST /api/auth/login/
    Body: {"phone_or_username": "...", "password": "..."}
    """
    identifier = (request.data.get('phone_or_username') or request.data.get('phone_number') or request.data.get('username') or '').strip()
    password = (request.data.get('password') or '').strip()

    if not identifier or not password:
        return Response({"error": "Please provide phone/username and password."}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize phone number if digits
    clean_digits = re.sub(r'[^\d+]', '', identifier)
    candidate_usernames = [identifier]
    if len(clean_digits) >= 10:
        candidate_usernames.append(f"+91{clean_digits[-10:]}")
        candidate_usernames.append(clean_digits[-10:])

    user = None
    for uname in candidate_usernames:
        user = authenticate(username=uname, password=password)
        if user:
            break

    if not user:
        return Response({"error": "Invalid phone number or password."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        "user": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name or user.username,
            "email": user.email,
            "phone_number": user.username,
        },
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def auth_me(request):
    """
    GET /api/auth/me/
    Returns current authenticated user details.
    """
    if not request.user or not request.user.is_authenticated:
        return Response({"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name or user.username,
        "email": user.email,
        "phone_number": user.username,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def my_orders(request):
    """
    GET /api/orders/my-orders/
    Protected endpoint: returns past orders for logged in user.
    """
    if not request.user or not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    orders = Order.objects.filter(
        Q(user=request.user) | Q(customer_phone=request.user.username)
    ).order_by('-created_at')

    data = []
    for o in orders:
        data.append({
            "order_id": str(o.order_id),
            "amount": float(o.amount),
            "currency": o.currency,
            "status": o.status,
            "phone_verified": o.phone_verified,
            "created_at": o.created_at,
            "items": o.items,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_otp(request):
    """
    POST /api/auth/send-otp/
    Body: {"phone_number": "+919876543210"}
    Dispatches a 6-digit verification code via Twilio Verify Service.
    """
    phone = (request.data.get('phone_number') or '').strip()
    if not phone:
        return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Standardize international format: prepend +91 for 10-digit Indian numbers if missing
    clean_digits = re.sub(r'[^\d+]', '', phone)
    if clean_digits.startswith('+'):
        formatted_phone = clean_digits
    elif len(clean_digits) == 10:
        formatted_phone = f"+91{clean_digits}"
    elif len(clean_digits) == 12 and clean_digits.startswith('91'):
        formatted_phone = f"+{clean_digits}"
    else:
        formatted_phone = clean_digits

    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
    service_sid = getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', '')

    if not (account_sid and auth_token and service_sid):
        return Response({"error": "Twilio Verify service is not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        client = TwilioClient(account_sid, auth_token)
        verification = client.verify.v2.services(service_sid).verifications.create(
            to=formatted_phone,
            channel='sms'
        )
        return Response({
            "status": verification.status,
            "to": formatted_phone,
            "message": "Verification code dispatched via SMS."
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_otp(request):
    """
    POST /api/auth/verify-otp/
    Body: {"phone_number": "+919876543210", "code": "123456", "order_id": optional}
    Validates the 6-digit OTP code with Twilio Verify.
    """
    phone = (request.data.get('phone_number') or '').strip()
    code = (request.data.get('code') or '').strip()
    order_id_str = request.data.get('order_id')

    if not phone or not code:
        return Response({"error": "Both phone_number and code are required"}, status=status.HTTP_400_BAD_REQUEST)

    clean_digits = re.sub(r'[^\d+]', '', phone)
    if clean_digits.startswith('+'):
        formatted_phone = clean_digits
    elif len(clean_digits) == 10:
        formatted_phone = f"+91{clean_digits}"
    elif len(clean_digits) == 12 and clean_digits.startswith('91'):
        formatted_phone = f"+{clean_digits}"
    else:
        formatted_phone = clean_digits

    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
    service_sid = getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', '')

    try:
        client = TwilioClient(account_sid, auth_token)
        check = client.verify.v2.services(service_sid).verification_checks.create(
            to=formatted_phone,
            code=code
        )
        if check.status == 'approved':
            # Mark order as verified if order_id was provided
            if order_id_str:
                try:
                    order = Order.objects.get(order_id=order_id_str)
                    order.phone_verified = True
                    order.status = 'verified'
                    order.save()
                except Order.DoesNotExist:
                    pass

            return Response({
                "status": "approved",
                "phone_number": formatted_phone,
                "verified": True,
                "message": "Phone number successfully verified."
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": check.status,
                "verified": False,
                "error": "Invalid or expired verification code."
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ====================================================================
# Razorpay Payment Gateway Endpoints
# ====================================================================

@api_view(['POST'])
def create_razorpay_order(request):
    """
    POST /api/payment/create-order/
    Body: {
      "amount": 1499.00,
      "customer_phone": "+919876543210",
      "customer_name": "Priya",
      "customer_email": "priya@example.com",
      "shipping_address": "...",
      "items": [...]
    }
    """
    amount = request.data.get('amount')
    phone = (request.data.get('customer_phone') or '').strip()
    name = (request.data.get('customer_name') or '').strip()
    email = (request.data.get('customer_email') or '').strip()
    address = (request.data.get('shipping_address') or '').strip()
    items = request.data.get('items', [])

    if not amount:
        return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

    key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
    key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')

    if not (key_id and key_secret):
        return Response({"error": "Razorpay keys are not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    amount_in_paise = int(float(amount) * 100)

    try:
        # Create local Order record first
        local_order = Order.objects.create(
            customer_name=name,
            customer_phone=phone,
            customer_email=email,
            shipping_address=address,
            items=items,
            amount=amount,
            currency="INR"
        )

        client = razorpay.Client(auth=(key_id, key_secret))
        razorpay_order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"halo_rcpt_{str(local_order.order_id)[:8]}",
            "notes": {
                "order_id": str(local_order.order_id),
                "brand": "halo"
            }
        })

        local_order.razorpay_order_id = razorpay_order['id']
        local_order.save()

        return Response({
            "order_id": str(local_order.order_id),
            "razorpay_order_id": razorpay_order['id'],
            "amount": amount_in_paise,
            "currency": "INR",
            "key_id": key_id,
            "customer": {
                "name": name,
                "phone": phone,
                "email": email
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_razorpay_payment(request):
    """
    POST /api/payment/verify-payment/
    Body: {
      "razorpay_order_id": "...",
      "razorpay_payment_id": "...",
      "razorpay_signature": "...",
      "order_id": "..."
    }
    Performs HMAC-SHA256 signature verification.
    """
    rzp_order_id = request.data.get('razorpay_order_id')
    rzp_payment_id = request.data.get('razorpay_payment_id')
    rzp_signature = request.data.get('razorpay_signature')
    order_id_str = request.data.get('order_id')

    if not (rzp_order_id and rzp_payment_id and rzp_signature):
        return Response({"error": "Payment verification attributes are missing"}, status=status.HTTP_400_BAD_REQUEST)

    key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
    if not key_secret:
        return Response({"error": "Razorpay secret key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Compute expected signature: HMAC-SHA256(rzp_order_id + "|" + rzp_payment_id, secret)
    message = f"{rzp_order_id}|{rzp_payment_id}"
    expected_signature = hmac.new(
        key_secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    if hmac.compare_digest(expected_signature, rzp_signature):
        # Update local order status
        if order_id_str:
            try:
                order = Order.objects.get(order_id=order_id_str)
                order.razorpay_payment_id = rzp_payment_id
                order.razorpay_signature = rzp_signature
                order.status = 'paid'
                order.save()
            except Order.DoesNotExist:
                pass

        return Response({
            "verified": True,
            "status": "paid",
            "razorpay_payment_id": rzp_payment_id,
            "message": "Payment confirmed and order captured successfully."
        }, status=status.HTTP_200_OK)
    else:
        if order_id_str:
            try:
                order = Order.objects.get(order_id=order_id_str)
                order.status = 'failed'
                order.save()
            except Order.DoesNotExist:
                pass
        return Response({"verified": False, "error": "Signature mismatch. Verification failed."}, status=status.HTTP_400_BAD_REQUEST)

