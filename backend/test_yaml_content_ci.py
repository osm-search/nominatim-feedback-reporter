import json
import sys, os
from dotenv import load_dotenv
import yaml
load_dotenv()

python_path = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, python_path)

def test_store_bugs_yaml_ci():

    with open(os.environ['FEEDBACK_YAML_FILE'], "r") as file:
        json_data = json.loads(json.dumps(yaml.load(file, Loader=yaml.FullLoader)))
        assert len(json_data) == 14
