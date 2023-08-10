from django.db import models

from api.models.subject import Subject
from api.models.visit import SubjectVisit


class MitoDNAMeasurement(models.Model):
    """Corresponds to data collected on urine or plasma at a visit"""
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    # the measured value (some number)
    measurement = models.DecimalField(null=True, default=None)

    # from which biofluid was the measurement taken?
    source_choices = [
        ('PL', 'plasma'),
        ('UR', 'urine')
    ]
    source = models.CharField(null=False, max_length=2, choices=source_choices)
