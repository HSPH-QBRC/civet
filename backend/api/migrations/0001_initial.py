# Generated by Django 4.2.4 on 2023-08-09 15:16

import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
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
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
