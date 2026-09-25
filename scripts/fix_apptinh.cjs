const fs = require('fs');

function fixAppTinh() {
  const filePath = 'app/tinh/AppTinh.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: <Input -> <input for standard styled inputs
  // Line 163
  content = content.replace(
    /const Inp = \(\{ className = "", \.\.\.props \}: React\.InputHTMLAttributes<HTMLInputElement>\) => \(\s*<Input\s*\{\.\.\.props\}/,
    'const Inp = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (\n  <input\n    {...props}'
  );

  // Line 889
  content = content.replace(
    /const NDInp = \(\{ loi, \.\.\.props \}: React\.InputHTMLAttributes<HTMLInputElement> & \{ loi\?: boolean \}\) => \(\s*<Input \{\.\.\.props\}/,
    'const NDInp = ({ loi, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { loi?: boolean }) => (\n  <input {...props}'
  );

  // Line 2119
  content = content.replace(
    /const O = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \(\s*<Input \{\.\.\.props\}/,
    'const O = (props: React.InputHTMLAttributes<HTMLInputElement>) => (\n    <input {...props}'
  );

  // Line 5240
  content = content.replace(
    /const FInp = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \(\s*<Input \{\.\.\.props\}/,
    'const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (\n  <input {...props}'
  );

  // Line 10646
  content = content.replace(
    /const FInp = \(props: React\.InputHTMLAttributes<HTMLInputElement>\) => \(\s*<Input \{\.\.\.props\} className="w-full h-\[28px\]/,
    'const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (\n    <input {...props} className="w-full h-[28px]'
  );

  // Fix 2: NhomNut Button type
  content = content.replace(
    /<Button type=\{type\} onClick=\{onClick\} disabled=\{disabled\}/g,
    '<button type={type} onClick={onClick} disabled={disabled}'
  );
  content = content.replace(
    /<\/Button>\s*\);\s*const Nut =/g,
    '</button>\n);\nconst Nut ='
  );
  // Specifically the closing tag for NhomNut
  content = content.replace(
    /className=\{\`inline-flex([^>]*)\`\}>\s*\{children\}\s*<\/Button>/g,
    'className={`inline-flex$1`}>\n    {children}\n  </button>'
  );

  // Fix 3: dayjs import
  if (!content.includes('import dayjs from "dayjs"')) {
    content = content.replace(
      'import { Input, Button, Modal, Tabs, Select, DatePicker, message, Checkbox } from "antd";',
      'import { Input, Button, Modal, Tabs, Select, DatePicker, message, Checkbox } from "antd";\nimport dayjs from "dayjs";'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Applied fixes to AppTinh.tsx');
}

fixAppTinh();
