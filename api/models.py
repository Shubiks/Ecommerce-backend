from django.db import models
from PIL import Image
from io import BytesIO
from django.core.files import File
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Custom user manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom user model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name

# Category model
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255, unique=True)
    date_of_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name

# Product model
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category_id = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    category_name = models.CharField(max_length=255)
    available_stock = models.IntegerField()
    marked_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Compress image before saving
        if self.image:
            self.image = self.compress_image(self.image)
        super().save(*args, **kwargs)

    @staticmethod
    def compress_image(image):
        img = Image.open(image)
        img = img.convert("RGB")  # Ensure compatibility with JPEG
        img_io = BytesIO()
        img.save(img_io, "JPEG", quality=85)  # Adjust quality as needed
        img_io.seek(0)
        return File(img_io, name=image.name)

    def __str__(self):
        return self.name
