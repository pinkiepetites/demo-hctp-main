import os

path = 'app/toicao/components/TiepNhanDonLienThong.tsx'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    new_text = text.replace('from "./ui/', 'from "../../components/ui/').replace("from './ui/", "from '../../components/ui/")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Updated app/toicao/components/TiepNhanDonLienThong.tsx')
