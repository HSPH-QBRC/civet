import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv

from .settings_helpers import get_env

# allows us to pull from a .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_env('DB_NAME'),
        'USER': get_env('DB_USER'),
        'PASSWORD': get_env('DB_PASSWD'),
        'HOST': get_env('DB_HOST'),
        'PORT': 5432,
    }
}

ALLOWED_HOSTS = [x for x in
                 os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')
                 if len(x) > 0]

# Necessary for use of the DRF pages and django 4.0+
CSRF_TRUSTED_ORIGINS = ['https://' + x for x in ALLOWED_HOSTS]

# REMOVE THESE HARDCODED VALUES AFTER DONE TESTING
CSRF_TRUSTED_ORIGINS.append('http://dev-civet.tm4.org.s3-website.us-east-2.amazonaws.com')
CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = [
    x for x in os.environ.get('DJANGO_CORS_ORIGINS', '').split(',')
    if len(x) > 0
]
CORS_EXPOSE_HEADERS = ['Content-Disposition']

# Application definition

INSTALLED_APPS = [
    'api.apps.ApiConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_rest_passwordreset',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# custom User model:
AUTH_USER_MODEL = 'api.User'

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = get_env('STATIC_ROOT')

# This suppresses warnings for models where an explicit
# primary key is not defined.
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    # This blocks unauthenciated access unless the view
    # specifies otherwise
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'PAGE_SIZE': 50,
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'COERCE_DECIMAL_TO_STRING': False
}
# This silences the page_size and default_pagination_class warning
# that happens on startup.
# We only paginate api requests if someone explicitly uses a
# ?page=X query param (e.g. from api/resources which can be quite large).
# However, we want to set some page_size default.
# If we set DEFAULT_PAGINATION_CLASS to something other than
# None, then the api defaults to responding with paginated payloads,
# which is cumbersome for the frontend framework since the data is
# nested
SILENCED_SYSTEM_CHECKS = ["rest_framework.W001"]

# settings for the DRF JWT app:
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15)
}

###############################################################################
# Parameters for domains and front-end URLs
###############################################################################

FRONTEND_DOMAIN = get_env('FRONTEND_DOMAIN')
BACKEND_DOMAIN = get_env('BACKEND_DOMAIN')
SITE_NAME = 'CIVET'

###############################################################################
# END Parameters for domains and front-end URLs
###############################################################################


###############################################################################
# START Parameters for configuring resource storage
###############################################################################

DEFAULT_FILE_STORAGE = 'api.storage.S3ResourceStorage'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_S3_REGION_NAME = get_env('AWS_REGION')

# This setting is used by the storage class implementation to effectively
# set the media root
MEDIA_ROOT = get_env('STORAGE_BUCKET_NAME')

###############################################################################
# END Parameters for configuring resource storage
###############################################################################

###############################################################################
# START Parameters for configuring authentication/registration
###############################################################################

AUTHENTICATION_BACKENDS = [
    # required for usual username/password authentication
    'django.contrib.auth.backends.ModelBackend',
]

###############################################################################
# END Parameters for configuring authentication/registration
###############################################################################

# Change the LOGLEVEL env variable if you want logging
# different than INFO:
LOGLEVEL = os.environ.get('LOGLEVEL', 'INFO').upper()

# By default, use a console logger. Override/modify/etc.
# in settings_dev or settings_production modules
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module}: {message}',
            'style': '{',
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'root': {
        'handlers': ['console'],
        'level':  LOGLEVEL,
    },
}

###############################################################################
# START Parameters for solr
###############################################################################
SOLR_BIN_DIR = '/opt/solr/bin'

SOLR_POST_CMD = '{bin_dir}/post'.format(bin_dir=SOLR_BIN_DIR)
SOLR_CMD = '{bin_dir}/solr'.format(bin_dir=SOLR_BIN_DIR)

# TODO: extract this to settings or otherwise
SOLR_SERVER = 'http://localhost:8983/solr'
###############################################################################
# END Parameters for solr
###############################################################################


###############################################################################
# START Parameters for metadata files
###############################################################################

# where the data will be located. From a S3 mount
DATA_DIR = Path('/data')

# describes the fields available in the subject table
CLINICAL_DATA_DICT = DATA_DIR / 'clinical_data_dictionary.xlsx'

###############################################################################
# END Parameters for metadata files
###############################################################################



###############################################################################
# START Email configuration for password reset (using Amazon SES)
###############################################################################

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'email-smtp.us-east-2.amazonaws.com'  # use your correct AWS SES region
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = ''  
EMAIL_HOST_PASSWORD = ''
DEFAULT_FROM_EMAIL = 'snhong@hsph.harvard.edu'

###############################################################################
# END Email configuration for password reset (using Amazon SES)
###############################################################################




###############################################################################
# START Email configuration for password reset (using Amazon SES)
###############################################################################

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = False #Change to True for https

###############################################################################
# END Email configuration for password reset (using Amazon SES)
###############################################################################