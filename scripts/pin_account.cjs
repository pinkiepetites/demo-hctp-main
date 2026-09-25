const fs = require("fs");
let content = fs.readFileSync("app/tinh/AppTinh.tsx", "utf8");
content = content.replace(
  '<KhoiTaiKhoanChung currentCap="tinh"',
  '<div className="mt-auto"><KhoiTaiKhoanChung currentCap="tinh"'
);
content = content.replace(
  'onDoiVaiTro={onDoiVaiTro} />',
  'onDoiVaiTro={onDoiVaiTro} /></div>'
);
fs.writeFileSync("app/tinh/AppTinh.tsx", content);
