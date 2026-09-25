const fs = require("fs");
const path = require("path");

function refactorTComponents(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace TRow
  content = content.replace(
    /const TRow = \(\{ label, bold, children \}: \{ label\?: string; bold\?: boolean; children\?: React\.ReactNode \}\) => \([\s\S]*?<div className="w-full">\{children\}<\/div>\s*<\/div>\s*\);/,
    `const TRow = ({ label, bold, children }: { label?: string; bold?: boolean; children?: React.ReactNode }) => (
  <div className="flex flex-col mb-3">
    {label && (
      <label className={\`text-[13px] mb-1.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis \${bold ? "font-semibold text-[#222]" : "text-[#444]"}\`} title={label}>
        {label}
      </label>
    )}
    <div className="w-full">{children}</div>
  </div>
);`
  );

  // Replace TInp
  content = content.replace(
    /const TInp = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \([\s\S]*?<\/div>\s*\);|const TInp = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \([\s\S]*?\/>\s*\);/,
    `const TInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <Input {...(props as any)} className={\`w-full \${props.className ?? ""}\`} />
);`
  );

  // Replace TSel
  content = content.replace(
    /const TSel = \(\{ children, \.\.\.props \}: React\.SelectHTMLAttributes<HTMLSelectElement>\) => \{[\s\S]*?<\/div>\s*\);\s*\};/,
    `const TSel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <Select 
      value={props.value as string} 
      onChange={(val) => props.onChange?.({ target: { value: val ?? "" } } as any)}
      className={\`w-full \${props.className ?? ""}\`}
      allowClear
    >
      {children}
    </Select>
  );
};`
  );

  // Replace TDate
  content = content.replace(
    /const TDate = \(\{ value, onChange \}: \{ value\?: string; onChange\?: \(v: string\) => void \}\) => \([\s\S]*?\/>\s*\);/,
    `const TDate = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
  <Input type="date" value={value ?? ""} onChange={e => onChange?.(e.target.value)}
    className={\`w-full \${oLoc(value)}\`} />
);`
  );

  // Fix Checkboxes inside AppToiCao
  content = content.replace(
    /<Input type="checkbox" className="w-\[12px\] h-\[12px\] accent-\[#8b1a1a\] flex-shrink-0"([\s\S]*?)\/>\s*<span className="truncate">(.*?)<\/span>\s*<\/label>/g,
    `<Checkbox$1><span className="truncate">$2</span></Checkbox>`
  );

  content = content.replace(
    /<Input type="checkbox" className="w-\[12px\] h-\[12px\] accent-\[#8b1a1a\] flex-shrink-0"([\s\S]*?)\/>\s*Chỉ danh sách đơn <span className="text-\[#888\]">\(không tính Hồ sơ kháng nghị\)<\/span>\s*<\/label>/g,
    `<Checkbox$1>Chỉ danh sách đơn <span className="text-[#888]">(không tính Hồ sơ kháng nghị)</span></Checkbox>`
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Refactored", filePath);
}

refactorTComponents(path.join(__dirname, "..", "app", "toicao", "AppToiCao.tsx"));
refactorTComponents(path.join(__dirname, "..", "app", "tinh", "AppTinh.tsx"));
