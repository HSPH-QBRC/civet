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
    subject_id = models.CharField(max_length=10, primary_key=True)

    # categorical + char
    advair_dose_v1 = models.CharField(max_length=10, default='')
    advair_v1 = models.CharField(max_length=10, default='')
    albuterol_neb_v1 = models.CharField(max_length=10, default='')
    albuterol_v1 = models.CharField(max_length=10, default='')
    beta_blocker_v1 = models.CharField(max_length=10, default='')
    bmh08b_v1 = models.CharField(max_length=10, default='')
    bmh08h_v1 = models.CharField(max_length=10, default='')
    bmh08i_v1 = models.CharField(max_length=10, default='')
    dem02_v1 = models.CharField(max_length=10, default='')
    dem03_v1 = models.CharField(max_length=10, default='')
    dem04_v1 = models.CharField(max_length=10, default='')
    site = models.CharField(max_length=10, default='')
   
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
    age_derv_v1 = models.DecimalField(null=True, default=None)
    bmi_cm_v1 = models.DecimalField(null=True, default=None)
    bmi_cm_v2 = models.DecimalField(null=True, default=None)
    cbc_eosinophil_pct_v1 = models.DecimalField(null=True, default=None)
    cbc_lymphocyte_pct_v1 = models.DecimalField(null=True, default=None)
    cbc_neutrophil_pct_v1 = models.DecimalField(null=True, default=None)
    facit_socialwellbeing_v1 = models.DecimalField(null=True, default=None)
    wt_kg_v1 = models.DecimalField(null=True, default=None)

    # continuous + char (whatever that means...)
    advair_puffsday_v1 = models.DecimalField(null=True, default=None)
    albuterol_puffsday_v1 = models.DecimalField(null=True, default=None)
