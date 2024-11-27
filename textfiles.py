import os
from pathlib import Path

def create_numbered_text_files():
    # Define paths
    img_dir = Path('assets/img')
    txt_dir = Path('assets/txt')
    
    # Create txt directory if it doesn't exist
    txt_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Get all jpeg files from the img directory
        jpeg_files = sorted([f for f in img_dir.glob('*.jpeg')])
        
        # Create corresponding text files with three incrementing numbers
        for index, jpeg_path in enumerate(jpeg_files):
            # Get the base name of the jpeg file without extension
            base_name = jpeg_path.stem
            
            # Create the text file path
            txt_path = txt_dir / f"{base_name}.txt"
            
            # Write three sequential numbers to the text file
            with open(txt_path, 'w') as f:
                f.write(f"{index}\n")      # First number
                f.write(f"{index + 1}\n")  # Second number
                f.write(f"{index + 2}")    # Third number
                
        print(f"Successfully created {len(jpeg_files)} text files in {txt_dir}")
        
    except FileNotFoundError:
        print(f"Error: The directory {img_dir} was not found")
    except PermissionError:
        print("Error: Permission denied when trying to create or write files")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    create_numbered_text_files() 