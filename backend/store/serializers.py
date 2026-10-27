from rest_framework import serializers
from .models import (
    Category,
    HairConcern,
    HairType,
    Product,
    RoutineBundle,
    CustomerReview,
    ChatSession,
    ChatMessage
)


class HairConcernSerializer(serializers.ModelSerializer):
    class Meta:
        model = HairConcern
        fields = ['id', 'name', 'slug', 'description', 'icon_name']


class HairTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HairType
        fields = ['id', 'name', 'code', 'slug', 'description']


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'order', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    hair_types = HairTypeSerializer(many=True, read_only=True)
    concerns = HairConcernSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'subtitle',
            'slug',
            'category',
            'category_name',
            'price',
            'discount_price',
            'effective_price',
            'discount_percent',
            'hair_types',
            'concerns',
            'routine_step',
            'size',
            'key_ingredients',
            'botanical_actives',
            'clinical_actives',
            'benefits',
            'usage_instructions',
            'texture_description',
            'aroma_notes',
            'ph_level',
            'image_url',
            'secondary_image_url',
            'rating',
            'review_count',
            'is_bestseller',
            'is_new',
            'stock',
        ]


class RoutineBundleSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    target_hair_types = HairTypeSerializer(many=True, read_only=True)
    target_concerns = HairConcernSerializer(many=True, read_only=True)

    class Meta:
        model = RoutineBundle
        fields = [
            'id',
            'title',
            'slug',
            'tagline',
            'description',
            'target_hair_types',
            'target_concerns',
            'products',
            'routine_steps',
            'original_price',
            'bundle_price',
            'savings_percentage',
            'badge_text',
            'clinical_results',
            'image_url',
            'is_featured',
            'created_at',
        ]


class CustomerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerReview
        fields = [
            'id',
            'reviewer_name',
            'age',
            'hair_type_tag',
            'location',
            'concern_addressed',
            'routine_used',
            'rating',
            'review_title',
            'review_text',
            'before_after_image',
            'verified_purchase',
            'created_at',
        ]


class ChatMessageSerializer(serializers.ModelSerializer):
    recommended_products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'sender',
            'message',
            'recommended_products',
            'metadata',
            'created_at',
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = [
            'session_id',
            'user_name',
            'hair_profile',
            'messages',
            'created_at',
            'updated_at',
        ]
