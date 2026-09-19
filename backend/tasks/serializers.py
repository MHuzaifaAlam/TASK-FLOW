from rest_framework import serializers
from .models import Profile, Task,Project,User
from django.contrib.auth import get_user_model


User=get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields=["id","username"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model=Project
        fields=[
            "id",
            "title",
            "description",
            "owner",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields=["owner", "created_at", "updated_at"]


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["username", "bio", "phone_number"]



class TaskSerializer(serializers.ModelSerializer):
    project=ProjectSerializer(read_only=True)
    project_id=serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source="project",
        write_only=True,
    )
    assigned_to=UserSerializer(many=True,read_only=True)
    assigned_to_ids=serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        source="assigned_to"
    )
    def validate_title(self,value):
        if len(value)<5:
            raise serializers.ValidationError("" \
            "TITLE MUST BE AT LEAST 5 CHARACTERS LONG")
        return value

    def validate(self, data):
        estimated=data.get("estimated_hours")
        actual=data.get("actual_hours")

        if actual>estimated:
            raise serializers.ValidationError(
                "Actual hours cannot be greater then estimated hours"
            )
        return data
    def validate_estimated_hours(self,value):
        if value <= 0:
            raise serializers.ValidationError("The estimated hours can not be Zero or Less then Zero")
        return value

        
    class Meta:
        model = Task
        fields = "__all__"

