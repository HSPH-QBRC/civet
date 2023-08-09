import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv

from .settings_helpers import get_env

# allows us to pull from a .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# regardless of dev or production, we need a DB:
try:
    db_name = os.environ['DB_NAME']
except KeyError:
    db_name = 'civetdb'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': db_name,
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

ROOT_URLCONF = 'civet.urls'

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

WSGI_APPLICATION = 'civet.wsgi.application'


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
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination'
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
    'USER_ID_FIELD': 'user_uuid',
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
