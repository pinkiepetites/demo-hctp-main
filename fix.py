import codecs

with codecs.open('recovered_panel.tsx', 'r', 'utf-8') as f:
    lines = f.readlines()

out = []
skip = False
for i, line in enumerate(lines):
    if line.strip() == 'const PanelLienThong = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {':
        out.append('const PanelLienThong = () => {\n')
    elif 'onClick={onToggle}' in line:
        # we know the button is lines 82-88 in recovered_panel.tsx
        pass
    elif line.strip() == '<button':
        # skip this and next 6 lines if it is the toggle button
        if lines[i+1].strip() == 'onClick={onToggle}':
            skip = 7
        else:
            out.append(line)
    elif skip:
        skip -= 1
        continue
    elif line.strip() == '{!collapsed && (':
        out.append('<>\n')
    elif line.strip() == ')}' and ('</div>' in lines[i-1] or '</>' in lines[i-1]):
        pass
    elif line.strip() == '// ─── DanhSachDon screen ───────────────────────────────────────────────────────':
        pass
    else:
        out.append(line)

with codecs.open('recovered_panel_edited.tsx', 'w', 'utf-8') as f:
    f.writelines(out)
