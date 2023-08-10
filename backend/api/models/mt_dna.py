from django.db import models

from api.models.visit import SubjectVisit


class MitoDNAMeasurement(models.Model):
    """Corresponds to data collected on urine or plasma at a visit"""
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    # the measured value (some number)
    measurement = models.DecimalField(null=True,
                                      default=None,
                                      max_digits=15,
                                      decimal_places=3)

    # from which biofluid was the measurement taken?
    class BiofluidSource(models.TextChoices):
        PLASMA = 'pl', 'plasma'
        URINE = 'ur', 'urine'
    source = models.CharField(null=False,
                              max_length=2,
                              choices=BiofluidSource.choices)
