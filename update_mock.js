const fs = require('fs');

function updateFile(path, pattern, newContent) {
    let code = fs.readFileSync(path, 'utf8');
    code = code.replace(pattern, newContent);
    fs.writeFileSync(path, code);
}

const newTTV = 'const INITIAL_CHUA_PHAN_CONG: CaseRow[] = [\n' +
  '{ id: 1, soThuLy: "101/2026/TLM-HS", ngayThuLy: "01/08/2026", soBA: "15/2025/HS-ST", ngayBA: "10/05/2025", toaAn: "TAND Tp Hà Nội", giaiDoan: "Sơ thẩm", qhpl: "Tội lừa đảo chiếm đoạt tài sản", ndkn: "Đề nghị xem xét lại hình phạt", nbk: "Nguyễn Văn A", ngayNhanTHS: "05/08/2026", giaiDoanPC: "GĐ Giải quyết đơn", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 2, soThuLy: "102/2026/TLM-DS", ngayThuLy: "02/08/2026", soBA: "22/2025/DS-PT", ngayBA: "12/06/2025", toaAn: "TAND tỉnh Bắc Ninh", giaiDoan: "Phúc thẩm", qhpl: "Tranh chấp hợp đồng vay tài sản", ndkn: "Yêu cầu tính lại lãi suất", nbk: "Trần Thị B", ngayNhanTHS: "06/08/2026", giaiDoanPC: "GĐ Giải quyết đơn", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 3, soThuLy: "103/2026/TLM-HC", ngayThuLy: "03/08/2026", soBA: "05/2025/HC-ST", ngayBA: "20/07/2025", toaAn: "TAND tỉnh Hưng Yên", giaiDoan: "Sơ thẩm", qhpl: "Khiếu kiện quyết định hành chính", ndkn: "Yêu cầu hủy quyết định thu hồi đất", nbk: "Lê Văn C", ngayNhanTHS: "07/08/2026", giaiDoanPC: "GĐ Giải quyết đơn", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 4, soThuLy: "104/2026/TLM-KDTM", ngayThuLy: "04/08/2026", soBA: "30/2025/KDTM-PT", ngayBA: "15/08/2025", toaAn: "TAND Tp Hải Phòng", giaiDoan: "Phúc thẩm", qhpl: "Tranh chấp hợp đồng mua bán hàng hóa", ndkn: "Yêu cầu bồi thường thiệt hại", nbk: "Công ty TNHH ABC", ngayNhanTHS: "08/08/2026", giaiDoanPC: "GĐ Giải quyết đơn", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 5, soThuLy: "105/2026/TLM-LD", ngayThuLy: "05/08/2026", soBA: "12/2025/LD-ST", ngayBA: "01/09/2025", toaAn: "TAND tỉnh Hải Dương", giaiDoan: "Sơ thẩm", qhpl: "Tranh chấp về đơn phương chấm dứt hợp đồng lao động", ndkn: "Yêu cầu bồi thường do sa thải trái luật", nbk: "Phạm Văn D", ngayNhanTHS: "09/08/2026", giaiDoanPC: "GĐ Giải quyết đơn", ngayPCTTV: "-", ttv: "-" }\n' +
'];';
updateFile('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/gdt/PhanCongTTVView.tsx', /const INITIAL_CHUA_PHAN_CONG: CaseRow\[\] = \[[\s\S]*?\];/, newTTV);

const newTP = 'const INITIAL_RECORDS: DonRecord[] = [\n' +
  '{ id: 1, soThuLy: ["Số: 101/2026/TLM-HS"], moTaDon: "1 đơn TLM", nguoiDungDon: "Nguyễn Văn A", hinhThuc: "Đơn đề nghị GĐT, TT", soBA: "15/2025/HS-ST", ngayBA: "10/05/2025", toaBA: "TAND Tp Hà Nội", ngayPhanCong: "05/08/2026", thamPhan: "-", ghiChu: "", trangThai: "chua-chi-dinh" },\n' +
  '{ id: 2, soThuLy: ["Số: 102/2026/TLM-DS"], moTaDon: "1 đơn TLM", nguoiDungDon: "Trần Thị B", hinhThuc: "Đơn đề nghị GĐT, TT", soBA: "22/2025/DS-PT", ngayBA: "12/06/2025", toaBA: "TAND tỉnh Bắc Ninh", ngayPhanCong: "06/08/2026", thamPhan: "-", ghiChu: "", trangThai: "chua-ngau-nhien" },\n' +
  '{ id: 3, soThuLy: ["Số: 103/2026/TLM-HC"], moTaDon: "1 đơn TLM", nguoiDungDon: "Lê Văn C", hinhThuc: "Đơn đề nghị GĐT, TT", soBA: "05/2025/HC-ST", ngayBA: "20/07/2025", toaBA: "TAND tỉnh Hưng Yên", ngayPhanCong: "07/08/2026", thamPhan: "-", ghiChu: "", trangThai: "chua-chi-dinh" },\n' +
  '{ id: 4, soThuLy: ["Số: 104/2026/TLM-KDTM"], moTaDon: "1 đơn TLM", nguoiDungDon: "Công ty TNHH ABC", hinhThuc: "Đơn đề nghị GĐT, TT", soBA: "30/2025/KDTM-PT", ngayBA: "15/08/2025", toaBA: "TAND Tp Hải Phòng", ngayPhanCong: "08/08/2026", thamPhan: "-", ghiChu: "", trangThai: "chua-ngau-nhien" },\n' +
  '{ id: 5, soThuLy: ["Số: 105/2026/TLM-LD"], moTaDon: "1 đơn TLM", nguoiDungDon: "Phạm Văn D", hinhThuc: "Đơn đề nghị GĐT, TT", soBA: "12/2025/LD-ST", ngayBA: "01/09/2025", toaBA: "TAND tỉnh Hải Dương", ngayPhanCong: "09/08/2026", thamPhan: "-", ghiChu: "", trangThai: "chua-chi-dinh" }\n' +
'];';
updateFile('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/gdt/PhanCongThamPhanView.tsx', /const INITIAL_RECORDS: DonRecord\[\] = \[[\s\S]*?\];/, newTP);

const newTPTC = 'const INITIAL_CHUA_PHAN_CONG: CaseRow[] = [\n' +
  '{ id: 1, soThuLy: "101/2026/TLM-HS", ngayThuLy: "01/08/2026", soBA: "15/2025/HS-ST", ngayBA: "10/05/2025", toaAn: "TAND Tp Hà Nội", giaiDoan: "Sơ thẩm", qhpl: "Tội lừa đảo chiếm đoạt tài sản", ndkn: "Đề nghị xem xét lại hình phạt", nbk: "Nguyễn Văn A", ngayNhanTHS: "05/08/2026", giaiDoanPC: "GĐ Xét xử", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 2, soThuLy: "102/2026/TLM-DS", ngayThuLy: "02/08/2026", soBA: "22/2025/DS-PT", ngayBA: "12/06/2025", toaAn: "TAND tỉnh Bắc Ninh", giaiDoan: "Phúc thẩm", qhpl: "Tranh chấp hợp đồng vay tài sản", ndkn: "Yêu cầu tính lại lãi suất", nbk: "Trần Thị B", ngayNhanTHS: "06/08/2026", giaiDoanPC: "GĐ Xét xử", ngayPCTTV: "-", ttv: "-" },\n' +
  '{ id: 3, soThuLy: "103/2026/TLM-HC", ngayThuLy: "03/08/2026", soBA: "05/2025/HC-ST", ngayBA: "20/07/2025", toaAn: "TAND tỉnh Hưng Yên", giaiDoan: "Sơ thẩm", qhpl: "Khiếu kiện quyết định hành chính", ndkn: "Yêu cầu hủy quyết định thu hồi đất", nbk: "Lê Văn C", ngayNhanTHS: "07/08/2026", giaiDoanPC: "GĐ Xét xử", ngayPCTTV: "-", ttv: "-" }\n' +
'];';
updateFile('c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/gdt/PhanCongTPTCView.tsx', /const INITIAL_CHUA_PHAN_CONG: CaseRow\[\] = \[[\s\S]*?\];/, newTPTC);

console.log('Success');
