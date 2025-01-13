from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import SignupView, SigninView, CategoryListView, ProductListView

app_name = "api"

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),  # URL for user signup
    path('signin/', SigninView.as_view(), name='signin'),  # URL for user signin
    path('categories/', CategoryListView.as_view(), name='categories'),  # URL for fetching categories
    path('products/', ProductListView.as_view(), name='products'),  # URL for fetching products
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
