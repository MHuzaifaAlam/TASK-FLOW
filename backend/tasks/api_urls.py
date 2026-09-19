from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProfileAPIView, RegisterAPIView, TaskViewSet, UserListAPIView

router=DefaultRouter()

router.register("tasks",TaskViewSet,basename="task")
router.register("projects",ProjectViewSet,basename="project")
urlpatterns=router.urls
urlpatterns += [
	path("register/", RegisterAPIView.as_view(), name="register"),
	path("profile/", ProfileAPIView.as_view(), name="profile"),
	path("users/", UserListAPIView.as_view(), name="users"),
]
