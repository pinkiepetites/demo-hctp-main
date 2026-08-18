import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find scripts
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL | re.IGNORECASE)
print("Number of script tags:", len(scripts))
for i, script in enumerate(scripts):
    print(f"Script {i} length:", len(script))
    # print first few lines of each script
    lines = script.strip().splitlines()
    print(f"Script {i} start:")
    for line in lines[:20]:
        print("  ", line[:120])
