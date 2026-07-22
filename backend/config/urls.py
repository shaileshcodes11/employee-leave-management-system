from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth (JWT)
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Apps
    path('api/accounts/', include('accounts.urls')),
    path('api/leaves/', include('leaves.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
