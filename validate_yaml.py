import yaml
import sys

def validate_yaml(file_path):
    try:
        with open(file_path, 'r') as file:
            yaml_content = yaml.safe_load(file)
            print(f"✅ YAML file '{file_path}' is valid.")
            print("\nStructure:")
            print(yaml.dump(yaml_content, default_flow_style=False))
            return True
    except yaml.YAMLError as e:
        print(f"❌ Error in YAML file '{file_path}':")
        print(e)
        return False
    except Exception as e:
        print(f"❌ Error reading file '{file_path}':")
        print(e)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate_yaml.py <yaml_file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    if not validate_yaml(file_path):
        sys.exit(1)
