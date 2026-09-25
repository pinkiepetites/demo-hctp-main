const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../app/gdt/HoSoKhangNghiView.tsx");
let content = fs.readFileSync(filePath, "utf-8");

content = content.replace(
  'import { Button, Input } from "antd";',
  'import { Button, Input, Table, Tabs, Tag, Space, Card, Row, Col, Statistic, Dropdown } from "antd";'
);

content = content.replace(
  'onChange={(k) => setActiveMain(k as MainTab)}',
  'onChange={(k: any) => setActiveMain(k as MainTab)}'
);

content = content.replace(
  'rowKey={r => r.loaiHoSo + r.id}',
  'rowKey={(r: any) => r.loaiHoSo + r.id}'
);

fs.writeFileSync(filePath, content, "utf-8");
console.log("Fixed imports and types in HoSoKhangNghiView.tsx");
