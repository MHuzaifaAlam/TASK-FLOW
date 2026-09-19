from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = [
            "title",
            "description",
            "project",
            "assigned_to",
        ]
    def clean_title(self):
     title=self.cleaned_data["title"]
     if len(title)<5:
        raise forms.ValidationError(
           "TITILE MUST BE LEAST 5 CHARACTER LONG"
        )   
     return title