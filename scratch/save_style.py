import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find script
style_match = re.search(r'<style[^>]*>(.*?)</style>', text, re.DOTALL | re.IGNORECASE)
style_content = style_match.group(1) if style_match else ''

# Write style to a file
with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\scratch\style.css', 'w', encoding='utf-8') as f:
    f.write(style_content)

print("Saved style.css with size:", len(style_content))
