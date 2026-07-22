from datetime import date

from rest_framework import serializers

from .models import Leave

MAX_ANNUAL_LEAVE_DAYS = 20


class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.username', read_only=True)
    number_of_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = Leave
        fields = [
            'id', 'employee', 'employee_name', 'start_date', 'end_date',
            'reason', 'status', 'applied_at', 'reviewed_at', 'number_of_days',
        ]
        read_only_fields = ['id', 'employee', 'status', 'applied_at', 'reviewed_at']

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        # Rule: cannot apply for past dates
        if start_date < date.today():
            raise serializers.ValidationError(
                {'start_date': 'Leave cannot be applied for a past date.'}
            )

        # Rule: end date cannot be before start date
        if end_date < start_date:
            raise serializers.ValidationError(
                {'end_date': 'End date cannot be before start date.'}
            )

        requested_days = (end_date - start_date).days + 1

        request = self.context.get('request')
        employee = request.user

        # Rule: maximum 20 annual leave days (counting already approved + pending leave)
        current_year = start_date.year
        existing_days = Leave.objects.filter(
            employee=employee,
            status__in=[Leave.Status.APPROVED, Leave.Status.PENDING],
            start_date__year=current_year,
        ).exclude(pk=self.instance.pk if self.instance else None)

        total_used_days = sum(leave.number_of_days for leave in existing_days)

        if total_used_days + requested_days > MAX_ANNUAL_LEAVE_DAYS:
            raise serializers.ValidationError(
                {
                    'non_field_errors': (
                        f'This request exceeds the maximum of {MAX_ANNUAL_LEAVE_DAYS} '
                        f'annual leave days. You have {MAX_ANNUAL_LEAVE_DAYS - total_used_days} '
                        f'day(s) remaining for {current_year}.'
                    )
                }
            )

        # Rule: no overlapping approved leave
        overlapping = Leave.objects.filter(
            employee=employee,
            status=Leave.Status.APPROVED,
            start_date__lte=end_date,
            end_date__gte=start_date,
        ).exclude(pk=self.instance.pk if self.instance else None)

        if overlapping.exists():
            raise serializers.ValidationError(
                {'non_field_errors': 'This leave overlaps with an existing approved leave.'}
            )

        return attrs


class LeaveActionSerializer(serializers.Serializer):
    """Used for approve/reject actions - no extra input needed, but kept
    for potential future fields like a manager comment."""
    comment = serializers.CharField(required=False, allow_blank=True)
