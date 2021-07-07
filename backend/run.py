"""
REST API for the nominatim-feedback-reporter for storing
feedback to JSON file.
"""

from wsgiref import simple_server
import falcon
from dotenv import load_dotenv

from middlewares.json_validator import RequireJSON
from routes import routes as _routes

# initialize the falcon application

load_dotenv()

middlewares = [RequireJSON()]

app = application = falcon.App(middleware=middlewares, cors_enable=True)

# Initialize all api routes.
for apiRoute, apiClass in _routes.items():
    app.add_route(apiRoute, apiClass)

if __name__ == '__main__':
    httpd = simple_server.make_server('127.0.0.1', 8000, app)
    httpd.serve_forever()
