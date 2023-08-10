from django.contrib import admin


from api.models.subject import Subject

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass
