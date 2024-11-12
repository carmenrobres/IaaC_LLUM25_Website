import os
import random
import glob

def random_timestamp():
    # Generate random hour and minute
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    # Randomly select a day between 7-9
    day = random.randint(7, 9)
    
    return f"{hour:02d}-{minute:02d}_{day}"

def rename_images():
    # Get the assets directory path relative to the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(script_dir, 'tests')
    
    # Check if assets directory exists
    if not os.path.exists(assets_dir):
        print("Error: 'assets' folder not found! Creating the folder...")
        os.makedirs(assets_dir)
        print("Please place your images in the 'assets' folder and run the script again.")
        return
    
    # Get list of image files in assets directory
    image_extensions = ('*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp')
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(assets_dir, ext)))
    
    if not image_files:
        print("No image files found in the assets folder.")
        return
    
    # Create a list to keep track of used timestamps
    used_timestamps = set()
    
    print(f"Found {len(image_files)} images. Starting rename process...")
    
    for image_file in image_files:
        # Generate unique timestamp
        while True:
            new_timestamp = random_timestamp()
            if new_timestamp not in used_timestamps:
                used_timestamps.add(new_timestamp)
                break
        
        # Get file extension
        extension = os.path.splitext(image_file)[1]
        
        # Create new filename
        new_filename = f"{new_timestamp}{extension}"
        new_path = os.path.join(assets_dir, new_filename)
        
        try:
            os.rename(image_file, new_path)
            print(f"Renamed: {os.path.basename(image_file)} → {new_filename}")
        except Exception as e:
            print(f"Error renaming {os.path.basename(image_file)}: {str(e)}")

if __name__ == "__main__":
    print("Starting image renaming process in 'assets' folder...")
    rename_images()
    print("Process completed!")