from django.urls import path
from .views import *

urlpatterns=[
    path("",TaskListView.as_view(),name="task_list"),
    path("<int:id>/",TaskDeleteView.as_view(),name="task_detail"),
    path("create/",TaskCreateView.as_view(),name="task_create"),
    path("update/<int:id>",TaskUpdateView.as_view(),name="task_update"),
    path("delete/<int:id>",TaskDeleteView.as_view(),name="delete_task"),
    path("filter/<str:filter_type>/",TaskFilterView.as_view(),name="task_filter"),
    # path('api/tasks/',TaskListAPIView.as_view(),name="api_task_list"),
    path('api/tasks/<int:pk>',TaskDetailAPIView.as_view(),name="api_task_detail"),
 
]
