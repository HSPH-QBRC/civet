from django.db import models

from api.models.subject import Subject
from api.models.visit import SubjectVisit


class ModifiedAirwaysData(models.Model):
    '''
    Corresponds to data described in the "Modified Airways" sheet
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    analyst = models.CharField(max_length=100, default='')
    analysis_status = models.CharField(max_length=100, default='')
    anatomicalname = models.CharField(max_length=100, default='')
    lobe = models.CharField(max_length=5, default='')
    sublobe = models.CharField(max_length=5, default='')
    avginnerarea = models.DecimalField(null=True, default=None)
    wall_area = models.DecimalField(null=True, default=None)
    stddevinnerarea = models.DecimalField(null=True, default=None)


class MasterData(models.Model):
    '''
    Corresponds to data described in the "Master" sheet
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    analyst = models.CharField(max_length=100, default='')
    qa_passed = models.CharField(max_length=100, default='')
    num_images = models.IntegerField(null=False, default=0)
    ll_mean_hu = models.DecimalField(null=True, default=None)
    ll_air_volume_cm3 = models.DecimalField(null=True, default=None)
    rl_mean_hu = models.DecimalField(null=True, default=None)
    rl_air_volume_cm3 = models.DecimalField(null=True, default=None)
    master_csv_version = models.CharField(max_length=100, default='')


class TextureData(models.Model):
    '''
    Corresponds to data described in the "TextureAnalysis" sheet
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    both_emphysema = models.DecimalField(null=True, default=None)
    both_ground_glass = models.DecimalField(null=True, default=None)
    left_emphysema = models.DecimalField(null=True, default=None)
    left_ground_glass = models.DecimalField(null=True, default=None)
    right_emphysema = models.DecimalField(null=True, default=None)
    right_ground_glass = models.DecimalField(null=True, default=None)


class TPVVData(models.Model):
    '''
    Corresponds to data described in the "TPVV" sheet
    '''
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    visit = models.ForeignKey(SubjectVisit, on_delete=models.CASCADE)

    bc_v_percent = models.DecimalField(null=True, default=None)
    lc_v_percent = models.DecimalField(null=True, default=None)
    rc_v_percent = models.DecimalField(null=True, default=None)