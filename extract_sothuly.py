import re

with open(r'c:\Users\Gtel-Ict\Downloads\QLA\mockup-so-thu-ly.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the javascript block (first script tag with data)
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if script_match:
    js_code = script_match.group(1).strip()
    # Remove IIFE wrapper
    js_code = re.sub(r'^\(function\(\)\{\s*\'use strict\';', '', js_code)
    js_code = re.sub(r'window\.MOCK=\{.*?\};\s*\}\)\(\);$', '', js_code, flags=re.DOTALL)
    
    # Prepend export to SO, DATA, UNITS, norm, fmt
    js_code += "\nexport { SO, DATA, UNITS, norm, fmt };\n"
    
    with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\components\mockDataSoThuLy.ts', 'w', encoding='utf-8') as f2:
        f2.write(js_code)

# Extract the React block
react_match = re.search(r'<script type="text/babel" data-presets="react">(.*?)</script>', content, re.DOTALL)
if react_match:
    react_code = react_match.group(1).strip()
    
    # We need to replace destructuring from window.MOCK with imports
    react_code = react_code.replace("const { SO, DATA, UNITS, norm, fmt } = window.MOCK;", "import { SO, DATA, UNITS, norm, fmt } from './mockDataSoThuLy';")
    
    # Replace destructuring from antd and React
    react_code = react_code.replace("const { useState, useMemo, useEffect } = React;", "import React, { useState, useMemo, useEffect } from 'react';")
    # antd imports
    antd_destructure = re.search(r'const \{([^\}]+)\} = antd;', react_code)
    if antd_destructure:
        items = antd_destructure.group(1).replace('App: AntApp', 'App as AntApp')
        react_code = react_code.replace(antd_destructure.group(0), f"import {{ {items.strip()} }} from 'antd';\nimport * as icons from '@ant-design/icons';\nimport dayjs from 'dayjs';\nimport 'dayjs/locale/vi';")

    # Replace ReactDOM.render
    react_code = re.sub(r'ReactDOM\.createRoot.*?render\(<Root />\);', '', react_code, flags=re.DOTALL)
    
    # Replace Root and Shell
    # We just want to export SoThuLyPage as default, or SoThuLyComponent that manages state
    # Wait, the SoThuLyPage takes `loai`, `soId`, `setSoId`, `dark`.
    
    wrapper = """
export default function SoThuLy() {
  const [dark, setDark] = useState(false);
  const fromHash = () => { const h = window.location.hash.slice(1); return findLoai(h) ? h : 'HS_ST'; };
  const [soId, setSoIdState] = useState(fromHash);
  useEffect(() => { const f = () => setSoIdState(fromHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const setSoId = (k: string) => { window.history.replaceState(null, '', '#' + k); setSoIdState(k); };
  const loai = findLoai(soId);

  return (
    <div className={dark ? 'dark' : ''}>
        <SoThuLyPage key={loai.key} loai={loai} soId={soId} setSoId={setSoId} dark={dark} />
    </div>
  );
}
"""
    react_code += wrapper
    
    with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\components\SoThuLyPage.tsx', 'w', encoding='utf-8') as f2:
        f2.write(react_code)

print("Done")
