import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find script
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL | re.IGNORECASE)
script0 = scripts[0]

# Write script0 to a file so it's readable and inspectable
with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\scratch\script0.js', 'w', encoding='utf-8') as f:
    f.write(script0)

print("Saved script0.js with size:", len(script0))
