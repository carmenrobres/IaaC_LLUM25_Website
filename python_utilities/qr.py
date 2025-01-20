import segno
import os

def generate_qr_svg(url, output_file='qrcode.svg'):
    """
    Generate a QR code for the given URL and save it as an SVG file.
    
    Args:
        url (str): The URL to encode in the QR code
        output_file (str): The name of the output SVG file (default: 'qrcode.svg')
    """
    try:
        # Create QR code with error correction level Q (25%)
        qr = segno.make(url, error='Q')
        
        # Save as SVG with some styling
        qr.save(
            output_file,
            scale=10,  # Scale the QR code
            dark="black",  # Color of the QR code
            light="white",  # Background color
            border=4  # Add some padding around the QR code
        )
        print(f"QR code successfully generated and saved as {output_file}")
        
    except Exception as e:
        print(f"Error generating QR code: {e}")

def generate_qr_png(url, output_file='qrcode.png', scale=10):
    """
    Generate a QR code for the given URL and save it as a PNG file.
    
    Args:
        url (str): The URL to encode in the QR code
        output_file (str): The name of the output PNG file (default: 'qrcode.png')
        scale (int): Size of the QR code (default: 10)
    """
    try:
        # Create QR code with error correction level Q (25%)
        qr = segno.make(url, error='Q')
        
        # Save as PNG with some styling
        qr.save(
            output_file,
            scale=scale,  # Scale the QR code
            dark="black",  # Color of the QR code
            light="white",  # Background color
            border=4  # Add some padding around the QR code
        )
        print(f"QR code successfully generated and saved as {output_file}")
        
    except Exception as e:
        print(f"Error generating QR code: {e}")

def generate_qr_both_formats(url, base_name='qrcode'):
    """
    Generate QR codes in both SVG and PNG formats.
    
    Args:
        url (str): The URL to encode in the QR code
        base_name (str): The base name for the output files (default: 'qrcode')
    """
    svg_file = f"{base_name}.svg"
    png_file = f"{base_name}.png"
    
    generate_qr_svg(url, svg_file)
    generate_qr_png(url, png_file)
    
    print(f"QR codes generated in both formats:")
    print(f"SVG: {svg_file}")
    print(f"PNG: {png_file}")

# Generate QR code for the specified URL in both formats
url = "https://jmuozan.github.io/IaaC_LLUM25_Website/"
generate_qr_both_formats(url, "website_qr")