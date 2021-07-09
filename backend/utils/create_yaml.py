import yaml

def create_yaml(data, file_location):
    """Handles creating or appending YAML file"""

    with open(file_location, "a") as file:
        yaml.dump([data], file, allow_unicode=True)
        file.write('\n')