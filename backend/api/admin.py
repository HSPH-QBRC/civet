from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model


from api.models.subject import Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass


@admin.register(get_user_model())
class CivetUserAdmin(UserAdmin):
    pass
