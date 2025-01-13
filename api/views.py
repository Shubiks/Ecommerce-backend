from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import CustomUser, Category, Product
from .serializers import CategorySerializer, ProductSerializer

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SignupView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = request.data
        email = data.get('email')
        name = data.get('name')
        password = data.get('password')

        if not email or not name or not password:
            return Response({"message": "All fields are required (name, email, password)."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"message": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)
        try:
            CustomUser.objects.create(name=name, email=email, password=hashed_password)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": f"Error creating user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SigninView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = request.data
        name = data.get('name')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(name=name)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Signin successful.",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class CategoryListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProductListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the category IDs from the query parameters
        category_ids = request.query_params.get('category_id', None)
        
        if category_ids:
            # Split the category_ids string into a list of integers
            category_ids = category_ids.split(',')
            products = Product.objects.filter(category_id__in=category_ids)
        else:
            products = Product.objects.all()

        # Paginate the filtered products
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_products, many=True)

        return paginator.get_paginated_response(serializer.data)


class ProtectedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"Authenticated user: {request.user}")
        return Response({"message": "This is a protected view."})
