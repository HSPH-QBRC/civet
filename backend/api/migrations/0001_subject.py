# Generated by Django 4.2.4 on 2023-08-09 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('subjid', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('advair_dose_v1', models.CharField(default='', max_length=10, null=True)),
                ('advair_v1', models.CharField(default='', max_length=10, null=True)),
                ('albuterol_neb_v1', models.CharField(default='', max_length=10, null=True)),
                ('albuterol_v1', models.CharField(default='', max_length=10, null=True)),
                ('beta_blocker_v1', models.CharField(default='', max_length=10, null=True)),
                ('bmh08b_v1', models.CharField(default='', max_length=10, null=True)),
                ('bmh08h_v1', models.CharField(default='', max_length=10, null=True)),
                ('bmh08i_v1', models.CharField(default='', max_length=10, null=True)),
                ('dem02_v1', models.CharField(default='', max_length=10, null=True)),
                ('dem03_v1', models.CharField(default='', max_length=10, null=True)),
                ('dem04_v1', models.CharField(default='', max_length=10, null=True)),
                ('site', models.CharField(default='', max_length=10, null=True)),
                ('asthma_child_v1', models.IntegerField(default=None, null=True)),
                ('asthma_dx_v1', models.IntegerField(default=None, null=True)),
                ('current_smoker_v1', models.IntegerField(default=None, null=True)),
                ('diabetes_derv_v1', models.IntegerField(default=None, null=True)),
                ('ethnicity', models.IntegerField(default=None, null=True)),
                ('gender', models.IntegerField(default=None, null=True)),
                ('race', models.IntegerField(default=None, null=True)),
                ('stratum_enrolled', models.IntegerField(default=None, null=True)),
                ('age_derv_v1', models.IntegerField(default=None, null=True)),
                ('bmi_cm_v1', models.DecimalField(decimal_places=2, default=None, max_digits=4, null=True)),
                ('bmi_cm_v2', models.DecimalField(decimal_places=2, default=None, max_digits=4, null=True)),
                ('cbc_eosinophil_pct_v1', models.DecimalField(decimal_places=2, default=None, max_digits=4, null=True)),
                ('cbc_lymphocyte_pct_v1', models.DecimalField(decimal_places=2, default=None, max_digits=4, null=True)),
                ('cbc_neutrophil_pct_v1', models.DecimalField(decimal_places=2, default=None, max_digits=4, null=True)),
                ('facit_socialwellbeing_v1', models.DecimalField(decimal_places=1, default=None, max_digits=3, null=True)),
                ('wt_kg_v1', models.DecimalField(decimal_places=2, default=None, max_digits=5, null=True)),
                ('advair_puffsday_v1', models.DecimalField(decimal_places=2, default=None, max_digits=5, null=True)),
                ('albuterol_puffsday_v1', models.DecimalField(decimal_places=2, default=None, max_digits=5, null=True)),
            ],
        ),
    ]
