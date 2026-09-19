from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from tasks.models import Project,Task

User = get_user_model()
class TaskAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="huzaifa",
            password="Test123"
        )

        self.project = Project.objects.create(
            title="Test Project",
            owner=self.user
        )

        self.client.force_authenticate(user=self.user)

    def test_task_list(self):
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, 200)

    def test_post_data(self):
        data = {
            "title": "Test Task",
            "description": "Testing task creation",
            "project_id": self.project.id,
            "assigned_to_ids": [self.user.id],
            "estimated_hours": 5,
            "actual_hours": 2
        }

        response = self.client.post(
            "/api/tasks/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, 201)

    def test_post_invalid_data(self):
        data = {
            "title": "Invalid Task",
            "description": "Testing validation",
            "project_id": self.project.id,
            "assigned_to_ids": [self.user.id],
            "estimated_hours": 0,
            "actual_hours": 0
        }

        response = self.client.post(
            "/api/tasks/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_patch_task(self):
        task = Task.objects.create(
            title="Old Title",
            description="Old description",
            project=self.project,
            estimated_hours=5,
            actual_hours=2
        )

        data = {
            "title": "Updated Title"
        }

        response = self.client.patch(
            f"/api/tasks/{task.id}/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, 200)

    def test_delete_task(self):
        task = Task.objects.create(
            title="Task to Delete",
            description="This will be deleted",
            project=self.project,
            estimated_hours=5,
            actual_hours=2
        )

        response = self.client.delete(
            f"/api/tasks/{task.id}/"
        )

        self.assertEqual(response.status_code, 204)

    def test_user_cannot_update_other_user_task(self):
        other_user = User.objects.create_user(
            username="otheruser",
            password="Test123"
        )

        task = Task.objects.create(
            title="User A Task",
            description="Private Task",
            project=self.project,
            estimated_hours=5,
            actual_hours=2
        )

        task.assigned_to.add(self.user)

        self.client.force_authenticate(user=other_user)

        data = {
            "title": "Hacked title"
        }

        response = self.client.patch(
            f"/api/tasks/{task.id}/",
            data,
            format="json"
        )

       
       