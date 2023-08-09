from django.core.management.base import BaseCommand
import pandas as pd
import numpy as np
import json
import sys

from api.models.subject import Subject


class Command(BaseCommand):
    help = 'Loads data'

    def add_arguments(self, parser):
        
        parser.add_argument(
            '-t',
            required=True,
            dest='table_type',
            help='The type of data/table to load'
        )

        parser.add_argument(
            '-f',
            required=True,
            dest='filepath',
            help='The path to the CSV-format file.'
        )

    def handle(self, *args, **options):
        table_type = options['table_type']
        filepath = options['filepath']
        if table_type == 'subject':
            self._load_subject_table(filepath)
        else:
            raise NotImplementedError(f'NOPE! Loading the {table_type} table'
                                      ' is not a valid option yet.')

    def _load_subject_table(self, filepath):

        df = pd.read_csv(filepath)
        df.replace(np.nan, None, inplace=True)
        model_fields = [x.name for x in Subject._meta.get_fields()]

        # `to_dict('records')` arranges the dataframe as a list of key-value
        # pairs. Could do a bulk_create, but just do iteratively for now.
        for record in df.to_dict('records'):
            # `record` is a dictionary
            # note that the dataframe column names (and hence the keys of `record`)
            # are uppercase and the field names are lowercase.
            d = {k: record[k.upper()] for k in model_fields}

            try:
                Subject.objects.create(**d)
            except Exception as ex:
                print(f'Failed for record:\n{json.dumps(record)}')
                print(ex)
                sys.exit(1)