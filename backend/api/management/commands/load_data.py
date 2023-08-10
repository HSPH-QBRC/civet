from django.core.management.base import BaseCommand
import pandas as pd
import numpy as np
import json
import sys

from api.models.subject import Subject
from api.models.visit import SubjectVisit


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
        elif table_type == 'visit':
            self._load_visits(filepath)
        else:
            raise NotImplementedError(f'NOPE! Loading the {table_type} table'
                                      ' is not a valid option yet.')

    def _load_visits(self, filepath):
        """
        Load a CSV file containing visit information (per subject)
        into the api.models.visit.SubjectVisit database model.

        Note that the CSV file containing the visit details has
        additional info about the visit. This method, however,
        ignores that and simply populates the visit info
        """
        # columns in the dataframe we need
        selected_columns = ['SUBJID', 'VISIT', 'DATE_VISIT']
        df = pd.read_csv(filepath, usecols=selected_columns)

        for i, row in df.iterrows():
            try:
                subject = Subject.objects.get(subjid=row['SUBJID'])
            except Subject.DoesNotExist:
                print('You need to load the subjects first, before'
                      ' you can create their associated visits.')
                sys.exit(1)

            if pd.isna(row['DATE_VISIT']):
                continue

            try:
                SubjectVisit.objects.create(
                    subject=subject,
                    visit_id=row['VISIT'],
                    date_visit=row['DATE_VISIT']
                )
            except Exception as ex:
                print(f'Issue with row: {row.to_dict()}')
                print(ex)
                sys.exit(1)

    def _load_subject_table(self, filepath):
        """
        Load a CSV file containing initial subject
        data into the api.models.subject.Subject database model.
        """
        df = pd.read_csv(filepath)
        df.replace(np.nan, None, inplace=True)
        model_fields = [x.name for x in Subject._meta.get_fields()]

        # `to_dict('records')` arranges the dataframe as a list of key-value
        # pairs. Could do a bulk_create, but just do iteratively for now.
        for record in df.to_dict('records'):
            # `record` is a dictionary
            # note that the dataframe column names (and hence the keys of `record`)
            # are uppercase and the field names are lowercase.
            d = {}
            for k in model_fields:
                # Note the try/except here is due to the model META API
                # which returns foreign key relations in addition to the 
                # explicitly defined fields. 
                try:
                    d[k] = record[k.upper()]
                except KeyError:
                    pass

            try:
                Subject.objects.create(**d)
            except Exception as ex:
                print(f'Failed for record:\n{json.dumps(record)}')
                print(ex)
                sys.exit(1)