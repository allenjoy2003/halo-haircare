import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class HairConcern(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='Sparkles', help_text="Lucide icon name")

    def __str__(self):
        return self.name


class HairType(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, help_text="e.g. 1A-1C, 2A-2C, 3A-3C, 4A-4C")
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Product(models.Model):
    STEP_CHOICES = [
        ('prep', 'Step 0: Scalp & Pre-wash'),
        ('cleanse', 'Step 1: Cleanse'),
        ('condition', 'Step 2: Condition & Repair'),
        ('treat', 'Step 3: Deep Treatment & Mask'),
        ('define', 'Step 4: Style & Define'),
        ('protect', 'Step 5: Finish & Heat/UV Protect'),
    ]

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=250, blank=True)
    slug = models.SlugField(max_length=220, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    hair_types = models.ManyToManyField(HairType, related_name='products', blank=True)
    concerns = models.ManyToManyField(HairConcern, related_name='products', blank=True)
    
    routine_step = models.CharField(max_length=20, choices=STEP_CHOICES, default='cleanse')
    size = models.CharField(max_length=50, default="250 ml / 8.45 fl. oz.")
    
    # Ayurvedic + Clinical Ingredients
    key_ingredients = models.TextField(help_text="Primary star ingredients formatted nicely")
    botanical_actives = models.CharField(max_length=300, help_text="e.g. Bhringraj, Amla, Methi, Hibiscus Extract")
    clinical_actives = models.CharField(max_length=300, help_text="e.g. 2% Salicylic Acid, Biomimetic Peptides, Niacinamide")
    
    benefits = models.TextField(help_text="Key benefits breakdown")
    usage_instructions = models.TextField(help_text="How to apply, frequency, tips")
    texture_description = models.CharField(max_length=200, default="Silky botanical nectar")
    aroma_notes = models.CharField(max_length=200, default="Indian Jasmine, Cedarwood, Green Tea")
    ph_level = models.CharField(max_length=50, default="pH 5.2 - 5.5 (Acidic Cuticle Seal)")
    
    image_url = models.URLField(max_length=600)
    secondary_image_url = models.URLField(max_length=600, blank=True)
    
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.85)
    review_count = models.IntegerField(default=128)
    
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    stock = models.IntegerField(default=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_bestseller', '-rating']

    def __str__(self):
        return self.title

    @property
    def effective_price(self):
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percent(self):
        if self.discount_price and self.price > 0:
            savings = self.price - self.discount_price
            return int((savings / self.price) * 100)
        return 0


class RoutineBundle(models.Model):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    tagline = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    
    target_hair_types = models.ManyToManyField(HairType, blank=True, related_name='bundles')
    target_concerns = models.ManyToManyField(HairConcern, blank=True, related_name='bundles')
    
    products = models.ManyToManyField(Product, related_name='routine_bundles')
    
    # Structured JSON for the step breakdown:
    # [{"step": 1, "phase": "Cleanse", "product_id": 1, "custom_tip": "Lather on wet scalp for 60s"}]
    routine_steps = models.JSONField(default=list, blank=True)
    
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    bundle_price = models.DecimalField(max_digits=10, decimal_places=2)
    savings_percentage = models.IntegerField(default=20)
    
    badge_text = models.CharField(max_length=80, default="Special Regimen Pricing")
    clinical_results = models.CharField(max_length=300, default="96% reported visibly healthier hair in 14 days")
    
    image_url = models.URLField(max_length=600)
    is_featured = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class CustomerReview(models.Model):
    reviewer_name = models.CharField(max_length=100)
    age = models.CharField(max_length=10, default="28")
    hair_type_tag = models.CharField(max_length=100, default="2B Wavy Hair")
    location = models.CharField(max_length=150, default="Mumbai (High Humidity & Hard Water)")
    concern_addressed = models.CharField(max_length=150, default="Dandruff, Monsoon Frizz")
    routine_used = models.CharField(max_length=200, default="The 3-Step Frizz & Humidity Shield Ritual")
    rating = models.IntegerField(default=5)
    review_title = models.CharField(max_length=200, default="My hair has never felt this calm!")
    review_text = models.TextField()
    before_after_image = models.URLField(max_length=600, blank=True)
    verified_purchase = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer_name} - {self.hair_type_tag}"


class ChatSession(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_sessions')
    user_name = models.CharField(max_length=100, blank=True, default="Guest")
    hair_profile = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ChatSession {self.session_id}"


class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('doctor', 'Dr. Kesh (Trichologist)'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    recommended_products = models.ManyToManyField(Product, blank=True, related_name='chat_recommendations')
    metadata = models.JSONField(default=dict, blank=True, help_text="Holds diagnostics, root causes, diet tips, etc.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.sender}] {self.message[:40]}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('verified', 'Phone Verified'),
        ('paid', 'Paid'),
        ('failed', 'Payment Failed'),
    ]

    order_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=150, blank=True)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True)
    shipping_address = models.TextField(blank=True)

    items = models.JSONField(default=list, help_text="Snapshot of cart items")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")

    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    phone_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.order_id} ({self.status}) - ₹{self.amount}"

