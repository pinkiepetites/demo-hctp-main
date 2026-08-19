import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find scripts
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL | re.IGNORECASE)
script0 = scripts[0]

# Search for function declarations or variables related to vbdh
matches = re.findall(r'(\b(?:function\s+\w+|var\s+\w+|let\s+\w+|\w+\s*=\s*function)\b.*?vbdh.*?\n)', script0, re.IGNORECASE)
print("Matches count:", len(matches))
for match in matches[:50]:
    print("  ", match.strip()[:150])
