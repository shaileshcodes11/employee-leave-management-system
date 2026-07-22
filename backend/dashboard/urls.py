from django.urls import path

from .views import EmployeeDashboardView, ManagerDashboardView

urlpatterns = [
    path('employee/', EmployeeDashboardView.as_view(), name='employee-dashboard'),
    path('manager/', ManagerDashboardView.as_view(), name='manager-dashboard'),
]
