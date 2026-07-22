from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Leave
from .permissions import IsEmployee, IsManager, IsOwner
from .serializers import LeaveSerializer, LeaveActionSerializer


class LeaveViewSet(viewsets.ModelViewSet):
    """
    Employee-facing leave endpoints.

    GET    /api/leaves/            -> list the logged-in employee's leaves
    POST   /api/leaves/            -> apply for leave
    GET    /api/leaves/{id}/       -> retrieve a single leave
    PATCH  /api/leaves/{id}/cancel/ -> cancel a pending leave
    """
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployee, IsOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['reason']
    ordering_fields = ['applied_at', 'start_date']
    http_method_names = ['get', 'post', 'head', 'patch']

    def get_queryset(self):
        return Leave.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        leave = self.get_object()
        if leave.status != Leave.Status.PENDING:
            return Response(
                {'detail': 'Only pending leave requests can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        leave.status = Leave.Status.REJECTED
        leave.reviewed_at = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)


class ManagerLeaveViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Manager-facing leave endpoints.

    GET   /api/leaves/manager/                 -> list all leave requests
    PATCH /api/leaves/manager/{id}/approve/     -> approve a leave request
    PATCH /api/leaves/manager/{id}/reject/      -> reject a leave request
    """
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name', 'reason']
    ordering_fields = ['applied_at', 'start_date']
    queryset = Leave.objects.all()

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        if leave.status != Leave.Status.PENDING:
            return Response(
                {'detail': 'Only pending leave requests can be approved.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        leave.status = Leave.Status.APPROVED
        leave.reviewed_at = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        if leave.status != Leave.Status.PENDING:
            return Response(
                {'detail': 'Only pending leave requests can be rejected.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        leave.status = Leave.Status.REJECTED
        leave.reviewed_at = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)
