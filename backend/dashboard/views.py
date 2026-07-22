from datetime import date

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from leaves.models import Leave
from leaves.permissions import IsEmployee, IsManager
from leaves.serializers import MAX_ANNUAL_LEAVE_DAYS


class EmployeeDashboardView(APIView):
    """GET /api/dashboard/employee/"""
    permission_classes = [IsAuthenticated, IsEmployee]

    def get(self, request):
        employee = request.user
        current_year = date.today().year

        leaves_this_year = Leave.objects.filter(
            employee=employee,
            start_date__year=current_year,
        )

        approved_leaves = leaves_this_year.filter(status=Leave.Status.APPROVED)
        pending_leaves = leaves_this_year.filter(status=Leave.Status.PENDING)

        used_days = sum(l.number_of_days for l in approved_leaves) + sum(
            l.number_of_days for l in pending_leaves
        )
        remaining_leave = max(MAX_ANNUAL_LEAVE_DAYS - used_days, 0)

        return Response({
            'remaining_leave': remaining_leave,
            'approved_leaves': approved_leaves.count(),
            'pending_leaves': pending_leaves.count(),
        })


class ManagerDashboardView(APIView):
    """GET /api/dashboard/manager/"""
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        today = timezone.localdate()

        pending_requests = Leave.objects.filter(status=Leave.Status.PENDING).count()
        approved_today = Leave.objects.filter(
            status=Leave.Status.APPROVED,
            reviewed_at__date=today,
        ).count()
        total_employees = User.objects.filter(role=User.Role.EMPLOYEE).count()

        return Response({
            'pending_requests': pending_requests,
            'approved_today': approved_today,
            'total_employees': total_employees,
        })
