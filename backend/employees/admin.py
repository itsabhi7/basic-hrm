from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'position', 'department', 'date_joined']
    list_filter = ['department', 'date_joined']
    search_fields = ['name', 'email', 'position']
    ordering = ['name']