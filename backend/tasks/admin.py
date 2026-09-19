from django.contrib import admin
from .models import Task,Project,Profile
# Register your models here.
admin.site.register(Task)
admin.site.register(Project)
admin.site.register(Profile)
