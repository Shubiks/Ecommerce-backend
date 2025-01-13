from django.contrib.auth.models import CustomUser
print(CustomUser.objects.filter(email="shubiksha23@gmail.com").exists())
