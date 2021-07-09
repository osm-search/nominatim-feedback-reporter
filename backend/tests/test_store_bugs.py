import json
import sys, os
import falcon
from falcon import testing
import pytest
import yaml

python_path = os.path.dirname(os.path.abspath(__file__)) + '/../'
sys.path.insert(0, python_path)

from run import app

@pytest.fixture
def client():
    return testing.TestClient(app)


# pytest will inject the object returned by the "client" function
# as an additional parameter.
def test_store_bugs_yaml(client, tmpdir):
    os.environ['FEEDBACK_YAML_FILE'] = str(tmpdir / "sample.yaml")
    
    request = {
        "correct_osm_object": "W333521774"
    }
    
    response = client.simulate_post('/api/bug', 
                                    body=json.dumps(request),
                                    headers={'content-type': 'application/json'})

    with open(str(tmpdir / "sample.yaml"), "r") as file:
        json_data = json.loads(json.dumps(yaml.load(file, Loader=yaml.FullLoader)))
        assert json_data == [request]
    assert response.text == json.dumps({
                                "message": "Successfully submitted bug report"
                              })

    assert response.status == falcon.HTTP_OK


def test_store_bugs_text(client, tmpdir):
    os.environ['FEEDBACK_YAML_FILE'] = str(tmpdir / "sample.yaml")
    
    request = 'Random text'
    
    response = client.simulate_post('/api/bug', 
                                    body=request,
                                    headers={'content-type': 'application/text'})

    assert response.status == falcon.HTTP_415
