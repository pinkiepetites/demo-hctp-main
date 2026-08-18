import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\Gtel-Ict\Downloads\Prototype_TiepNhanDonLienThong (1).html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find screens
body_match = re.search(r'<body[^>]*>(.*?)</body>', text, re.DOTALL | re.IGNORECASE)
body_html = body_match.group(1) if body_match else ''

# Let's extract each screen block
screen_list = ['screen-vbdh', 'screen-vbdh-detail', 'screen-vbdh-duplicate', 'screen-vbdh-split', 'screen-vbdh-sync']
for screen_id in screen_list:
    # Find the section with id=screen_id
    pattern = r'(<section[^>]*id=["\']' + re.escape(screen_id) + r'["\'][^>]*>.*?</section>)'
    matches = re.findall(pattern, body_html, re.DOTALL)
    print(f"Screen {screen_id} match count:", len(matches))
