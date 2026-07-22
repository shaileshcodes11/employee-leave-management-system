from rest_framework.routers import DefaultRouter

from .views import LeaveViewSet, ManagerLeaveViewSet

router = DefaultRouter()
router.register('manager', ManagerLeaveViewSet, basename='manager-leaves')
router.register('', LeaveViewSet, basename='leaves')

urlpatterns = router.urls
