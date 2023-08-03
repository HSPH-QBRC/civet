import logging.config

from .settings_helpers import get_env

from .base_settings import *

SECRET_KEY = get_env('DJANGO_SECRET_KEY')

DEBUG = True

###############################################################################
# START logging settings for dev
###############################################################################
# If desired, modify `LOGGING` to customize beyond the basic console logging 
# created in base_settings.py

# Register the logging config:
logging.config.dictConfig(LOGGING)

###############################################################################
# END logging settings
###############################################################################
