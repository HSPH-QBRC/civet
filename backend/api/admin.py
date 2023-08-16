from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from api.models.subject import Subject
from api.models.user import User


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class CivetUserAdmin(UserAdmin):
    pass
