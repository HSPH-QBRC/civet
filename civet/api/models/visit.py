from enum import unique
from django.db import models

from api.models.subject import Subject


class SubjectVisit(models.Model):
    '''
    Captures metadata about the visit.
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    # the original tables have VISIT_1, VISIT_2, etc.
    visit_id = models.CharField(null=False)
    date_visit = models.DateField(default=None)

    class Meta:
        # enforces that we can only have single
        # instances when considering the combination
        # of the subject and their visit
        unique_together = ['subject', 'visit_id']
