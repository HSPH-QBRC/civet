import requests

from django.conf import settings


def query_solr(index_name, query_str):
    """
    Calls the solr server with the provided query.

    `index_name` identifies the solr collection/core we are querying
    `query_string` is the query string appended to the url.
    """
    query_url = f'{settings.SOLR_SERVER}/{index_name}/select?{query_str}'
   
    r = requests.get(query_url)
    if r.status_code == 200:
        return r.json()
    else:
        payload = r.json()
        error_msg = payload['error']['msg']
        raise Exception(error_msg)
