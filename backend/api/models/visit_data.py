from django.db import models

from api.models.subject import Subject
from api.models.visit import SubjectVisit


class VisitData(models.Model):
    """
    Captures info/measures about a subject at a specific visit.
    
    Note that some of these measurements (again, think of BMI)
    are repeated from the initial visit. In that case, 
    we will have some duplicated data from the Subject table.
    However, unless a full audit is done with the data
    to align the corresponding entries in multiple data sources, this 
    is something we have to live with. For instance, there's no generic
    way to link BMI_V1 with the BMI field in the longitudinal data
    (which includes that same data point for visit 1)
    """
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    age_derv = models.DecimalField(null=True, default=None)
    albuterol = models.CharField(max_length=10, default='')
    bmi = models.DecimalField(null=True, default=None)
    current_smoker = models.DecimalField(null=True, default=None)
    diabetes_derv = models.DecimalField(null=True, default=None)
    facit_socialwellbeing = models.DecimalField(null=True, default=None)
    visit = models.CharField(max_length=10, default='')
    wt_kg = models.DecimalField(null=True, default=None)
