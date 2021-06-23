import os
import falcon
import json
from utils.create_json import create_json

class StoreBugs:

    def on_post(self, req, resp):
        """Handles POST requests"""
        resp.status = falcon.HTTP_200
        create_json(req.body, os.environ.get('FEEDBACK_JSON_FILE'))
        resp.text = json.dumps(req.body, ensure_ascii=False)