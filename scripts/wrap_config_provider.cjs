const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../app/gdt/HoSoKhangNghiView.tsx");
let content = fs.readFileSync(filePath, "utf-8");

// 1. Add ConfigProvider to imports
content = content.replace(
  'import { Button, Input, Table, Tabs, Tag, Space, Card, Row, Col, Statistic, Dropdown } from "antd";',
  'import { Button, Input, Table, Tabs, Tag, Space, Card, Row, Col, Statistic, Dropdown, ConfigProvider } from "antd";'
);

// 2. Wrap the return statement with ConfigProvider
const targetReturn = `return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, fontFamily: F }}>`;

const newReturn = `return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, fontFamily: F } }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, fontFamily: F }}>`;

content = content.replace(targetReturn, newReturn);

// We need to close the ConfigProvider at the end of the component
// The component ends with:
//     </div>
//   );
// }
// export default HoSoKhangNghiView;

const targetEnd = `      {showTrinhKy && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKy(false)} />}
    </div>
  );
}`;

const newEnd = `      {showTrinhKy && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKy(false)} />}
    </div>
    </ConfigProvider>
  );
}`;

content = content.replace(targetEnd, newEnd);

// Optional: remove the inline RED styles since ConfigProvider takes care of it?
// We can just leave them or change `style={{ background: RED, borderColor: RED }}` to just nothing if type="primary".
// Let's remove them to keep code clean:
content = content.replace(/style=\{\{\s*background:\s*RED,\s*borderColor:\s*RED\s*\}\}/g, '');

fs.writeFileSync(filePath, content, "utf-8");
console.log("Wrapped with ConfigProvider and cleaned up styles");
