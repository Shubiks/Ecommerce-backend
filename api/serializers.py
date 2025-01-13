from rest_framework import serializers
from .models import Category
from .models import Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name', 'date_of_creation']


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False) 
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'image', 'category_name', 'available_stock', 'marked_price', 'discount_price']
        # The fields you want to expose to the API
