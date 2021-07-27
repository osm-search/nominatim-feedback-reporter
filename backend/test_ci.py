import json
import sys, os
from dotenv import load_dotenv
import yaml
import csv
load_dotenv()

python_path = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, python_path)


def test_store_bugs_yaml_ci():

    with open(os.environ['FEEDBACK_YAML_FILE'], "r") as file:
        json_data = json.loads(json.dumps(yaml.load(file, Loader=yaml.FullLoader)))
        assert len(json_data) == 14

def test_export_to_csv():
    assert os.path.isfile('test_WO.csv') == True
    assert os.path.isfile('test_WRR.csv') == True
    assert os.path.isfile('test_WSR.csv') == True

    with open('test_WO.csv', "r") as file:
        csv_f = csv.reader(file)
        row_count = sum(1 for row in csv_f)

        assert (row_count) == 3
    
    with open('test_WRR.csv', "r") as file:
        csv_f = csv.reader(file)
        row_count = sum(1 for row in csv_f)

        assert (row_count) == 3
    
    with open('test_WSR.csv', "r") as file:
        csv_f = csv.reader(file)
        row_count = sum(1 for row in csv_f)
        assert (row_count) == 3