import csv
import os
import yaml
from dotenv import load_dotenv
from logger import logger

load_dotenv()

# field names
fieldsObj = {'wrong_simple_search_result': ['query', 'expected_osm_id', 'expected_osm_type'],
             'wrong_reverse_result': ['lat', 'lon', 'detail', 'expected_osm_id', 'expected_osm_type'],
             'wrong_order': ['query', 'expected_osm_id', 'expected_osm_type'],
             'WI': []
             }

zoom = {'country': '3', 'state': '5', 'county': '8',
        'city': '10', 'district': '14', 'street': '17',
        'house': '18'}


def get_osm_type(osm_object):
    if osm_object[0] == 'N':
        return 'node'
    elif osm_object[0] == 'W':
        return 'way'
    elif osm_object[0] == 'R':
        return 'relation'
    return


def get_zoom_detail(val):
    for key, value in zoom.items():
        if val == value:
            return key

    return '18'


def export_wrong_simple_search_result(arr, filename):
    if not arr:
        return

    with open(filename, 'a') as csvfile:
        # creating a csv dict writer object
        writer = csv.DictWriter(csvfile, fieldnames=fieldsObj['wrong_simple_search_result'], delimiter=";")

        # writing headers (field names)
        if csvfile.tell() == 0:
            writer.writeheader()

        wsr_dict = []
        for item in arr:
            obj = {'query': item['query'],
                   'expected_osm_id': item['correct_osm_object'][1:],
                   'expected_osm_type': get_osm_type(item['correct_osm_object'])
                   }
            wsr_dict.append(obj)

        # writing data rows
        writer.writerows(wsr_dict)


# Current geocode tester does not support nominatim structured search
def export_wrong_structured_search_result(arr, filename):
    logger.warning('Wrong structured search feedback is not supported by geocode-tester')
    pass


def export_wrong_reverse_result(arr, filename):
    if not arr:
        return

    with open(filename, 'a') as csvfile:
        # creating a csv dict writer object
        writer = csv.DictWriter(csvfile, fieldnames=fieldsObj['wrong_reverse_result'], delimiter=";")

        # writing headers (field names)
        if csvfile.tell() == 0:
            writer.writeheader()

        wrr_dict = []
        for item in arr:
            obj = {
                'lat': item['lat'],
                'lon': item['lon'],
                'detail': get_zoom_detail(item['zoom']),
                'expected_osm_id': item['correct_osm_object'][1:],
                'expected_osm_type': get_osm_type(item['correct_osm_object'])
            }

            wrr_dict.append(obj)

        # writing data rows
        writer.writerows(wrr_dict)


def export_wrong_order(arr, filename):
    if not arr:
        return

    with open(filename, 'a') as csvfile:
        # creating a csv dict writer object
        writer = csv.DictWriter(csvfile, fieldnames=fieldsObj['wrong_order'], delimiter=";")

        # writing headers (field names)
        if csvfile.tell() == 0:
            writer.writeheader()

        wo_dict = []
        for item in arr:
            # Currently geocode-tester only supports simple search
            if item['query_type'] == 'simple_search':
                obj = {'query': item['query'],
                       'expected_osm_id': item['correct_osm_object'][1:],
                       'expected_osm_type': get_osm_type(item['correct_osm_object'])
                       }
                wo_dict.append(obj)

        # writing data rows 
        writer.writerows(wo_dict)


# Currently geocode tester does not support lookup api of nominatim
def export_wrong_information(arr, filename):
    logger.warning('Wrong information feedback is not supported by geocode-tester')
    pass


def start_exporting():
    with open(os.environ.get('FEEDBACK_YAML_FILE'), "r") as file:
        raw = yaml.safe_load(file)
        wrong_simple_search_arr = []
        wrong_structured_search_arr = []
        wrong_reverse_result_arr = []
        wrong_order_arr = []
        wrong_information_arr = []
        for item in raw:
            if item['feedback_type'] == 'WR':
                if item['query_type'] == 'reverse_search':
                    wrong_reverse_result_arr.append(item)
                elif item['query_type'] == 'simple_search':
                    wrong_simple_search_arr.append(item)
                elif item['query_type'] == 'structured_search':
                    wrong_structured_search_arr.append(item)
            elif item['feedback_type'] == 'WO':
                wrong_order_arr.append(item)
            elif item['feedback_type'] == 'WI':
                wrong_information_arr.append(item)

        export_wrong_simple_search_result(wrong_simple_search_arr, 'test_WSR.csv')
        export_wrong_structured_search_result(wrong_simple_search_arr, 'test_WSSR.csv')
        export_wrong_reverse_result(wrong_reverse_result_arr, 'test_WRR.csv')
        export_wrong_order(wrong_order_arr, 'test_WO.csv')
        export_wrong_information(wrong_information_arr, 'test_WI.csv')


start_exporting()
