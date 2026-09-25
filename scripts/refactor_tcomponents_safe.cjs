const fs = require("fs");
const path = require("path");

function refactorTComponents(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // 1. TRow
  const tRowRegex = /const TRow = \(\{ label, bold, children \}: \{ label\?: string; bold\?: boolean; children\?: React\.ReactNode \}\) => \([\s\S]*?<div className="w-full">\{children\}<\/div>\s*<\/div>\s*\);/;
  const tRowNew = `const TRow = ({ label, bold, children }: { label?: string; bold?: boolean; children?: React.ReactNode }) => (
  <div className="flex flex-col mb-[12px]">
    {label && (
      <label className={\`text-[13.5px] mb-[6px] leading-[1.5714285714285714] whitespace-nowrap overflow-hidden text-ellipsis \${bold ? "font-semibold text-[#1f2937]" : "text-[rgba(0,0,0,0.88)]"}\`} title={label}>
        {label}
      </label>
    )}
    <div className="w-full">{children}</div>
  </div>
);`;
  content = content.replace(tRowRegex, tRowNew);

  // 2. TInp
  const tInpRegex = /const TInp = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \([\s\S]*?\/>\s*\);/;
  const tInpNew = `const TInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { size, ...rest } = props;
  return <Input {...(rest as any)} allowClear className={\`w-full \${props.className ?? ""}\`} />;
};`;
  content = content.replace(tInpRegex, tInpNew);

  // 3. TSel
  const tSelRegex = /const TSel = \(\{ children, \.\.\.props \}: React\.SelectHTMLAttributes<HTMLSelectElement>\) => \{[\s\S]*?<\/div>\s*\);\s*\};/;
  const tSelNew = `const TSel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
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
};`;
  content = content.replace(tSelRegex, tSelNew);

  // 4. TDate
  const tDateRegex = /const TDate = \(\{ value, onChange \}: \{ value\?: string; onChange\?: \(v: string\) => void \}\) => \([\s\S]*?\/>\s*\);/;
  const tDateNew = `const TDate = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
  <DatePicker 
    value={value ? dayjs(value) : null} 
    onChange={(d, dString) => onChange?.(typeof dString === "string" ? dString : (dString as string[])[0] || "")}
    format="YYYY-MM-DD"
    className="w-full"
    allowClear
  />
);`;
  content = content.replace(tDateRegex, tDateNew);

  // 5. Checkboxes (AppToiCao)
  content = content.replace(
    /<input type="checkbox" className="w-\[12px\] h-\[12px\] accent-\[#8b1a1a\] flex-shrink-0"\s*checked=\{ui\("daGiaiQuyetCapCao"\) === "1"\}\s*onChange=\{e => setUi\("daGiaiQuyetCapCao"\)\(e\.target\.checked \? "1" : ""\)\} \/>/g,
    `<Checkbox checked={ui("daGiaiQuyetCapCao") === "1"} onChange={e => setUi("daGiaiQuyetCapCao")(e.target.checked ? "1" : "")} />`
  );

  content = content.replace(
    /<input type="checkbox" className="w-\[12px\] h-\[12px\] accent-\[#8b1a1a\] flex-shrink-0"\s*checked=\{chiDon\} onChange=\{e => setChiDon\(e\.target\.checked\)\} \/>/g,
    `<Checkbox checked={chiDon} onChange={e => setChiDon(e.target.checked)} />`
  );

  // Also replace `<label>` around Checkbox to just use `<Checkbox>text</Checkbox>`
  content = content.replace(
    /<label className="flex items-center gap-1\.5 text-\[11px\] text-\[#333\] cursor-pointer whitespace-nowrap" title="Đơn đã giải quyết xong từ tòa Cấp cao">\s*<Checkbox([\s\S]*?)\/>\s*<span className="truncate">Đơn đã giải quyết xong từ tòa Cấp cao<\/span>\s*<\/label>/g,
    `<Checkbox$1><span className="truncate">Đơn đã giải quyết xong từ tòa Cấp cao</span></Checkbox>`
  );

  content = content.replace(
    /<label className="flex items-center gap-1\.5 text-\[11px\] text-\[#333\] cursor-pointer whitespace-nowrap">\s*<Checkbox([\s\S]*?)\/>\s*Chỉ danh sách đơn <span className="text-\[#888\]">\(không tính Hồ sơ kháng nghị\)<\/span>\s*<\/label>/g,
    `<Checkbox$1>Chỉ danh sách đơn <span className="text-[#888]">(không tính Hồ sơ kháng nghị)</span></Checkbox>`
  );

  // Also import DatePicker, Checkbox
  if (!content.includes('import { Checkbox, DatePicker }')) {
    content = content.replace(
      /import \{ Input, Select, DatePicker, ConfigProvider, Radio, Checkbox, Space \} from "antd";/g,
      `import { Input, Select, DatePicker, ConfigProvider, Radio, Checkbox, Space } from "antd";`
    );
  }

  // The mass script `scripts/refactor_antd.cjs` was replacing `<input` and `<button`.
  // I must run it AFTER this script, OR I can just run it now via require? No, I will run it separately.

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Refactored", filePath);
}

refactorTComponents(path.join(__dirname, "..", "app", "toicao", "AppToiCao.tsx"));
refactorTComponents(path.join(__dirname, "..", "app", "tinh", "AppTinh.tsx"));
