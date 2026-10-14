const fs = require('fs');
let code = fs.readFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/tinh/AppTinh.tsx', 'utf8');

code = code.replace(/\"can-bo-tiep-cong-dan\": \"Cán bộ tiếp công dân\",\r?\n/g, '');
code = code.replace(/\"can-bo-tiep-cong-dan\",\r?\n/g, '');
code = code.replace(/currentRole === \"can-bo-tiep-cong-dan\"/g, 'false');
code = code.replace(/currentRole !== \"can-bo-tiep-cong-dan\" && /g, '');

fs.writeFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/tinh/AppTinh.tsx', code);

let appCode = fs.readFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/App.tsx', 'utf8');
appCode = appCode.replace(/\"tinh-can-bo-tiep-cong-dan\"/g, '\"tinh-can-bo-thu-ly\"');
fs.writeFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/App.tsx', appCode);

console.log('Cleaned');
