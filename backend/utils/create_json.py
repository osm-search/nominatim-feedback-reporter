import json
from os import path

def create_json(data, file_location):
    """Handles creating or appending JSON file"""
    if not path.exists(file_location):
        with open(file_location, "w") as file:
            json.dump([], file, indent=4)

    with open(file_location, "r+") as file:
        json_data = json.load(file)
        json_data.append(data)
        file.seek(0)
        json.dump(json_data, file, indent=2)
