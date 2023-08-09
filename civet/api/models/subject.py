from django.db import models


class Subject(models.Model):
    '''
    Captures static info about a subject enrolled in the study.

    This includes items like race, gender, demographics AS WELL AS
    initial measurements (such as BMI).
    
    Note that some of these measurements (again, think of BMI)
    are repeated at later time points. In this case, we will have some 
    duplicated data. However, unless a full audit is done with the data
    to align the corresponding entries in multiple data sources, this 
    is something we have to live with. For instance, there's no generic
    way to link BMI_V1 with the BMI field in the longitudinal data
    (which includes that same data point for visit 1)
    '''

    # Unique subject ID (looks like 'CU100010', etc.)
    subjid = models.CharField(max_length=10, primary_key=True)

    # categorical + char
    advair_dose_v1 = models.CharField(max_length=10, default='', null=True)
    advair_v1 = models.CharField(max_length=10, default='', null=True)
    albuterol_neb_v1 = models.CharField(max_length=10, default='', null=True)
    albuterol_v1 = models.CharField(max_length=10, default='', null=True)
    beta_blocker_v1 = models.CharField(max_length=10, default='', null=True)
    bmh08b_v1 = models.CharField(max_length=10, default='', null=True)
    bmh08h_v1 = models.CharField(max_length=10, default='', null=True)
    bmh08i_v1 = models.CharField(max_length=10, default='', null=True)
    dem02_v1 = models.CharField(max_length=10, default='', null=True)
    dem03_v1 = models.CharField(max_length=10, default='', null=True)
    dem04_v1 = models.CharField(max_length=10, default='', null=True)
    site = models.CharField(max_length=10, default='', null=True)
   
    # categorical + numeric:
    asthma_child_v1 = models.IntegerField(null=True, default=None)
    asthma_dx_v1 = models.IntegerField(null=True, default=None)
    current_smoker_v1 = models.IntegerField(null=True, default=None)
    diabetes_derv_v1 = models.IntegerField(null=True, default=None)
    ethnicity = models.IntegerField(null=True, default=None)
    gender = models.IntegerField(null=True, default=None)
    race = models.IntegerField(null=True, default=None)
    stratum_enrolled = models.IntegerField(null=True, default=None)

    # continuous + numeric
    age_derv_v1 = models.IntegerField(null=True, default=None)
    bmi_cm_v1 = models.DecimalField(null=True, default=None, max_digits=4, decimal_places=2)
    bmi_cm_v2 = models.DecimalField(null=True, default=None, max_digits=4, decimal_places=2)
    cbc_eosinophil_pct_v1 = models.DecimalField(null=True, default=None, max_digits=4, decimal_places=2)
    cbc_lymphocyte_pct_v1 = models.DecimalField(null=True, default=None, max_digits=4, decimal_places=2)
    cbc_neutrophil_pct_v1 = models.DecimalField(null=True, default=None, max_digits=4, decimal_places=2)
    facit_socialwellbeing_v1 = models.DecimalField(null=True, default=None, max_digits=3, decimal_places=1)
    wt_kg_v1 = models.DecimalField(null=True, default=None, max_digits=5, decimal_places=2)

    # continuous + char (whatever that means...)
    advair_puffsday_v1 = models.DecimalField(null=True, default=None, max_digits=5, decimal_places=2)
    albuterol_puffsday_v1 = models.DecimalField(null=True, default=None, max_digits=5, decimal_places=2)
