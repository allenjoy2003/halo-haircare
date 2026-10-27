from django.contrib import admin
from .models import Category, HairConcern, HairType, Product, RoutineBundle, CustomerReview, ChatSession, ChatMessage

admin.site.site_header = "halo — Admin Portal"
admin.site.site_title = "halo Portal"
admin.site.index_title = "Catalog & Formulation Management"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'routine_step', 'is_bestseller', 'stock')
    list_filter = ('category', 'routine_step', 'is_bestseller')
    search_fields = ('title', 'subtitle', 'key_ingredients')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(RoutineBundle)
class RoutineBundleAdmin(admin.ModelAdmin):
    list_display = ('title', 'bundle_price', 'savings_percentage', 'badge_text')

@admin.register(CustomerReview)
class CustomerReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer_name', 'rating', 'location', 'verified_purchase')

admin.site.register(HairConcern)
admin.site.register(HairType)
admin.site.register(ChatSession)
admin.site.register(ChatMessage)
