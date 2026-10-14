const fs = require('fs');
let code = fs.readFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/tinh/AppTinh.tsx', 'utf8');

// 1. Remove the header "Phân công" button block for pho-vp
const block1Start = code.indexOf('{activeTab === 1 && currentRole === "pho-vp" && (');
if (block1Start > -1) {
    const block1EndStr = `                  </BtnPrimary>\n                )\n              )}`;
    const block1End = code.indexOf(block1EndStr, block1Start) + block1EndStr.length;
    code = code.substring(0, block1Start) + code.substring(block1End);
}

// 2. Change column header
code = code.replace(
    /\{currentRole === "pho-vp" && activeTab === 1 \? "Người được phân công" : "Người nhập \/ Sửa"\}/g,
    'Người nhập / Sửa'
);

// 3. Remove select for assignment
const selectStart = code.indexOf('{currentRole === "pho-vp" && activeTab === 1 && (row.nguoiNhap === "Chưa phân công" || row.nguoiNhap === "Chờ xử lý") ? (');
if (selectStart > -1) {
    const selectEndStr = `                                    ) : (\n                                      <TenCB ten={row.nguoiNhap} ghiDe={row.nguoiNhapNgaySinh} />\n                                    )}`;
    const selectEnd = code.indexOf(selectEndStr, selectStart) + selectEndStr.length;
    code = code.substring(0, selectStart) + `<TenCB ten={row.nguoiNhap} ghiDe={row.nguoiNhapNgaySinh} />` + code.substring(selectEnd);
}

// Also remove `{!(currentRole === "pho-vp" && activeTab === 1) && (` block around "Nhập:"
const nhapStart = code.indexOf('{!(currentRole === "pho-vp" && activeTab === 1) && (');
if (nhapStart > -1) {
    const nhapEndStr = `                                    )}`;
    const nhapEnd = code.indexOf(nhapEndStr, nhapStart) + nhapEndStr.length;
    code = code.substring(0, nhapStart) + `<span className="text-on-surface-variant">Nhập: </span>` + code.substring(nhapEnd);
}


fs.writeFileSync('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/tinh/AppTinh.tsx', code);
console.log("Done");
