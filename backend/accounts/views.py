from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomTokenObtainPairSerializer, UserProfileSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """POST /api/token/ - login and get access/refresh tokens + user info."""
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveAPIView):
    """GET /api/accounts/profile/ - returns the logged-in user's details."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
