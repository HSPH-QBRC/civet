from enum import unique
from django.db import models

from api.models.subject import Subject


class SubjectVisit(models.Model):
    '''
    Captures metadata about the visit.
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    # the original tables have VISIT_1, VISIT_2, etc.
    class VisitIdentifier(models.TextChoices):
        VISIT_1 = 'VISIT_1', 'Visit 1'
        VISIT_2 = 'VISIT_2', 'Visit 2'
        VISIT_3 = 'VISIT_3', 'Visit 3'
        VISIT_4 = 'VISIT_4', 'Visit 4'

    visit_id = models.CharField(null=False,
                                max_length=7,
                                choices=VisitIdentifier.choices)
    date_visit = models.DateField(default=None)

    class Meta:
        # enforces that we can only have single
        # instances when considering the combination
        # of the subject and their visit
        unique_together = ['subject', 'visit_id']
