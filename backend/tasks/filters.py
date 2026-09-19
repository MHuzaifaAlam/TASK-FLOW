import django_filters
from .models import Task

class TaskFilter(django_filters.FilterSet):
    min_hours=django_filters.NumberFilter(
        field_name="estimated_hours",
        lookup_expr="gte"
    )
    max_hours=django_filters.NumberFilter(
        field_name="estimated_hours",
        lookup_expr="lte"
    )

    class Meta:
        model=Task
        fields=["project"]