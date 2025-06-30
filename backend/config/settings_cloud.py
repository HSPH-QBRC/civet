from .base_settings import * 

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env('DJANGO_SECRET_KEY')

DEBUG = False

###############################################################################
# START logging settings
###############################################################################

# By default (in base_settings.py), we set up console logging via
# the `LOGGING` dictionary. Modify below:


###############################################################################
# END logging settings
###############################################################################
