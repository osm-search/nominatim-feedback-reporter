import falcon
import json

class StoreBugs:

    def on_post(self, req, resp):
        """Handles POST requests"""
        print(req.body)
        resp.status = falcon.HTTP_200

        resp.text = json.dumps(req.body, ensure_ascii=False)