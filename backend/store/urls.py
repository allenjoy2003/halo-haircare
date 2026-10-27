from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    HairConcernViewSet,
    HairTypeViewSet,
    ProductViewSet,
    RoutineBundleViewSet,
    CustomerReviewViewSet,
    HairConsultationView,
    ChatSessionDetailView,
    send_otp,
    verify_otp,
    create_razorpay_order,
    verify_razorpay_payment,
    auth_register,
    auth_login,
    auth_me,
    my_orders
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'routines', RoutineBundleViewSet, basename='routine')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'concerns', HairConcernViewSet, basename='concern')
router.register(r'hair-types', HairTypeViewSet, basename='hair-type')
router.register(r'reviews', CustomerReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/hair-consultation/', HairConsultationView.as_view(), name='hair-consultation'),
    path('chat/session/<uuid:session_id>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
    
    # Twilio OTP SMS Authentication
    path('auth/send-otp/', send_otp, name='auth-send-otp'),
    path('auth/verify-otp/', verify_otp, name='auth-verify-otp'),
    
    # User Account & JWT
    path('auth/register/', auth_register, name='auth-register'),
    path('auth/login/', auth_login, name='auth-login'),
    path('auth/me/', auth_me, name='auth-me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('orders/my-orders/', my_orders, name='orders-my-orders'),
    
    # Razorpay Payment Gateway
    path('payment/create-order/', create_razorpay_order, name='payment-create-order'),
    path('payment/verify-payment/', verify_razorpay_payment, name='payment-verify-payment'),
]
