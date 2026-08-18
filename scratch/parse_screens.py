import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find screens
screens = re.findall(r'id=["\'](screen-[^\'"]+)["\']', text)
print('Screens found in HTML:', screens)
