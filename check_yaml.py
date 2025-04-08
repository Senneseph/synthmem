import yaml
import sys

try:
    with open(sys.argv[1], 'r') as file:
        data = yaml.safe_load(file)
        print("YAML is valid!")
        print(data)
except Exception as e:
    print(f"Error: {e}")
