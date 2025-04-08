import os
from PIL import Image, ImageDraw, ImageFont
import cairosvg

# Create directories if they don't exist
os.makedirs("frontend/public", exist_ok=True)

# Generate SVG icon
svg_content = '''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="512" height="512" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="230" fill="#6200ea" />
  <circle cx="256" cy="256" r="180" fill="#3700b3" />
  <circle cx="256" cy="256" r="130" fill="#ffffff" />
  <rect x="226" y="150" width="60" height="212" rx="10" fill="#6200ea" />
  <rect x="150" y="226" width="212" height="60" rx="10" fill="#6200ea" />
</svg>'''

with open("frontend/public/masked-icon.svg", "w") as f:
    f.write(svg_content)

# Convert SVG to PNG for different sizes
sizes = [192, 512]
for size in sizes:
    png_filename = f"frontend/public/pwa-{size}x{size}.png"
    cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), write_to=png_filename, output_width=size, output_height=size)

# Create apple-touch-icon.png (180x180)
cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), write_to="frontend/public/apple-touch-icon.png", output_width=180, output_height=180)

# Create favicon.ico (32x32)
cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), write_to="frontend/public/favicon.png", output_width=32, output_height=32)

print("PWA icons generated successfully!")
