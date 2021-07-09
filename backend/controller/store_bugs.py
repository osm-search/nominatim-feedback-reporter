""" Controller for storing feedback/bugs to JSON file """

import os
import json
import falcon
from utils.create_yaml import create_yaml

class StoreBugs:
    """ Handles various types of request to /api/bug endpoint """

    def on_post(self, req, resp):
        """Handles POST requests"""
        create_yaml(req.body, os.environ.get('FEEDBACK_YAML_FILE'))
        resp.status = falcon.HTTP_200
        resp.text = json.dumps({'message': 'Successfully submitted bug report'}, ensure_ascii=False)
