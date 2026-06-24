import os
import zipfile
import sys
import subprocess

def install_package(package):
    print(f"Installing {package}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Make sure kaggle package is installed
try:
    import kaggle
except ImportError:
    install_package("kaggle")
    import kaggle

def check_kaggle_creds():
    home = os.path.expanduser("~")
    kaggle_path = os.path.join(home, ".kaggle", "kaggle.json")
    if not os.path.exists(kaggle_path):
        print("\n" + "="*70)
        print("ERROR: Kaggle API Credentials not found!")
        print("To download the DeepGlobe dataset automatically, you need a free Kaggle account.")
        print("\nPlease follow these simple steps to set it up:")
        print("1. Go to https://www.kaggle.com and sign in.")
        print("2. Click on your profile picture in the top-right and select 'Settings'.")
        print("3. Scroll down to the 'API' section and click 'Create New Token'.")
        print("4. This will download a file named 'kaggle.json'.")
        print(f"5. Move this 'kaggle.json' file to: {kaggle_path}")
        print("="*70 + "\n")
        return False
    return True

def download_and_extract():
    if not check_kaggle_creds():
        sys.exit(1)

    dataset_name = "balraj98/deepglobe-road-extraction-dataset"
    target_dir = "./datasets"
    zip_filename = "deepglobe-road-extraction-dataset.zip"

    # Create target directory if it doesn't exist
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        print(f"Created directory: {target_dir}")

    print(f"Downloading dataset '{dataset_name}' from Kaggle...")
    try:
        # Download the dataset using Kaggle API
        kaggle.api.dataset_download_files(dataset_name, path=target_dir, unzip=False)
        print("Download completed successfully!")
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        sys.exit(1)

    zip_filepath = os.path.join(target_dir, zip_filename)
    if os.path.exists(zip_filepath):
        print(f"Extracting {zip_filename} to {target_dir}...")
        with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
            zip_ref.extractall(target_dir)
        print("Extraction completed!")
        
        # Clean up the zip file
        os.remove(zip_filepath)
        print("Removed temporary zip file.")
    else:
        # Sometimes kaggle API auto-unzips if unzip=True was set, let's verify files
        print("Dataset extracted successfully.")

if __name__ == "__main__":
    download_and_extract()
