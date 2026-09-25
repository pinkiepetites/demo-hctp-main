const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../app/gdt/HoSoKhangNghiView.tsx");
let content = fs.readFileSync(filePath, "utf-8");

// 1. Update imports
const importTarget = `import { TaiLieuHoSoView } from "./TaiLieuHoSoView";import { Button, Input } from "antd";`;
const importReplacement = `import { TaiLieuHoSoView } from "./TaiLieuHoSoView";\nimport { Button, Input, Table, Tabs, Tag, Space, Card, Row, Col, Statistic, Dropdown } from "antd";`;
content = content.replace(importTarget, importReplacement);

// 2. Replace the HoSoKhangNghiView block
const startStr = `function TrangThaiBadge({ tt }: { tt: string }) {`;
const endStr = `export default HoSoKhangNghiView;`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end bounds!");
  process.exit(1);
}

const replacement = `function getTagColor(tt: string) {
  const map: Record<string, string> = {
    "Chưa tiếp nhận": "error",
    "Đã tiếp nhận": "success",
    "Từ chối tiếp nhận": "purple",
    "Chờ chuyển": "warning",
    "Đã chuyển": "success",
    "Đã tiếp nhận (PT/ST)": "success",
    "Từ chối (PT/ST)": "error",
    "Chờ nhận": "warning",
    "Đã nhận": "success",
    "Chưa chuyển": "error",
  };
  return map[tt] || "default";
}

function TrangThaiBadge({ tt }: { tt: string }) {
  return <Tag color={getTagColor(tt)} style={{ fontWeight: 600 }}>{tt}</Tag>;
}

export function HoSoKhangNghiView({ userRole, onTaoCongVan }: { userRole?: UserRoleType; onTaoCongVan?: (config?: any) => void }) {
  type MainTab = "tong-hop" | "tu-hinh" | "khang-nghi" | "xet-xu-lai";
  const [activeMain, setActiveMain] = React.useState<MainTab>("tong-hop");
  const [kNSubTab, setKNSubTab] = React.useState<"di" | "den">("den");
  const [showTuChoi, setShowTuChoi] = React.useState(false);
  const [showNhapTay, setShowNhapTay] = React.useState<"tu-hinh" | "khang-nghi" | null>(null);
  const [showTraHoSo, setShowTraHoSo] = React.useState(false);
  const [showTrinhKy, setShowTrinhKy] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  const [listTuHinhDen, setListTuHinhDen] = React.useState([
    { id: 901, maDon: "TH-DEN-001", soCongVan: "CV-2026/THA-099", ngayGui: "13/08/2026", donViGui: "TAND TP Hà Nội", loaiDonVi: "Tòa án cấp dưới", nguoiGui: "Nguyễn Văn An", soBA: "12/2026/HS-PT", toaRaBanAn: "TAND Cấp cao tại Hà Nội", tenBiAn: "Lê Văn Tù", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
    { id: 902, maDon: "TH-DEN-002", soCongVan: "CV-2026/THA-112", ngayGui: "05/08/2026", donViGui: "VKS tỉnh Bắc Ninh", loaiDonVi: "VKS", nguoiGui: "Trần Thị Hoa", soBA: "45/2026/HS-ST", toaRaBanAn: "TAND tỉnh Bắc Ninh", tenBiAn: "Phạm Văn Cường", trangThai: "Đã tiếp nhận", ngayNhan: "07/08/2026", nguoiNhan: "Lý Thái Phúc" },
    { id: 903, maDon: "TH-DEN-003", soCongVan: "CV-2026/THA-088", ngayGui: "20/07/2026", donViGui: "TAND tỉnh Long An", loaiDonVi: "Tòa án cấp dưới", nguoiGui: "Hoàng Minh Tuấn", soBA: "11/2026/HS-ST", toaRaBanAn: "TAND tỉnh Long An", tenBiAn: "Nguyễn Thanh Liêm", trangThai: "Từ chối tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
    { id: 904, maDon: "TH-DEN-004", soCongVan: "CV-2026/THA-134", ngayGui: "15/09/2026", donViGui: "VKSNDTC", loaiDonVi: "VKS", nguoiGui: "Lê Thị Bình", soBA: "78/2026/HS-PT", toaRaBanAn: "TAND Cấp cao tại TP.HCM", tenBiAn: "Võ Văn Đại", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
  ]);

  const [listKNDi, setListKNDi] = React.useState([
    { id: 1, soHieuKN: "10/2026/QĐKN", ngayKN: "25/07/2026", nguoiKN: "Chánh án TAND Tối cao", soBA: "124/2026/HS-ST", toaRaBanAn: "TAND tỉnh Hà Nam", donViNhan: "VKSNDTC", soCVChuyen: "CV-2026/088", ngayChuyen: "22/07/2026", trangThai: "Đã chuyển" },
    { id: 2, soHieuKN: "12/2026/QĐKN", ngayKN: "18/06/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "102/2026/DS-ST", toaRaBanAn: "TAND quận Hoàn Kiếm", donViNhan: "TAND TP Hà Nội", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chờ chuyển" },
    { id: 3, soHieuKN: "15/2026/QĐKN-HC", ngayKN: "10/05/2026", nguoiKN: "Chánh án TAND Tối cao", soBA: "45/2026/HC-PT", toaRaBanAn: "TAND tỉnh Vĩnh Phúc", donViNhan: "TAND tỉnh Vĩnh Phúc", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chưa chuyển" },
    { id: 4, soHieuKN: "19/2026/QĐKN", ngayKN: "05/08/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "78/2026/HS-PT", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViNhan: "TAND Cấp cao tại Hà Nội", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chưa chuyển" },
  ]);

  const [listKNDen, setListKNDen] = React.useState([
    { id: 101, soHieuKN: "08/2026/QĐKN", ngayKN: "03/07/2026", nguoiKN: "Viện trưởng VKS tỉnh Bắc Ninh", soBA: "236/2026/HS-PT", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViGui: "VKS tỉnh Bắc Ninh", ngayNhan: "24/07/2026", nguoiNhan: "Lý Thái Phúc", trangThai: "Đã nhận" },
    { id: 102, soHieuKN: "14/2026/QĐKN", ngayKN: "25/04/2026", nguoiKN: "Chánh án TAND tỉnh Bắc Ninh", soBA: "18/2026/KDTM-ST", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViGui: "TAND tỉnh Bắc Ninh", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 103, soHieuKN: "21/2026/QĐKN", ngayKN: "12/03/2026", nguoiKN: "Chánh án TAND quận Đống Đa", soBA: "88/2026/HNGĐ-PT", toaRaBanAn: "TAND quận Đống Đa", donViGui: "Văn phòng LS Trí Đức", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 104, soHieuKN: "27/2026/QĐKN", ngayKN: "01/08/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "174/2026/HS-ST", toaRaBanAn: "TAND tỉnh Hưng Yên", donViGui: "VKSNDTC", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 109, soHieuKN: "41/2026/QĐKN-HC", ngayKN: "06/08/2026", nguoiKN: "Chánh án TAND tỉnh Lâm Đồng", soBA: "29/2026/HC-PT", toaRaBanAn: "TAND tỉnh Lâm Đồng", donViGui: "TAND tỉnh Lâm Đồng", ngayNhan: "07/08/2026", nguoiNhan: "Nguyễn Tiến Mạnh", trangThai: "Đã nhận" },
  ]);

  const [listXetXuLai, setListXetXuLai] = React.useState([
    { id: 201, maVuAn: "VA26-000035", tenVuAn: "Chu Văn An giết người", ketQuaGDT: "Hủy bản án PT, xét xử lại ST", capXuLai: "Sơ thẩm", donViNhan: "TAND tỉnh Long An", soQDGDT: "01/2026/QĐ-GĐT", ngayBanHanh: "15/08/2026", trangThai: "Chờ chuyển" },
    { id: 202, maVuAn: "VA26-000042", tenVuAn: "Nguyễn Văn B trộm cắp", ketQuaGDT: "Hủy bản án ST, xét xử lại PT", capXuLai: "Phúc thẩm", donViNhan: "TAND Cấp cao tại Hà Nội", soQDGDT: "02/2026/QĐ-GĐT", ngayBanHanh: "20/08/2026", trangThai: "Đã chuyển" },
    { id: 203, maVuAn: "VA26-000051", tenVuAn: "Trần Thị C lừa đảo", ketQuaGDT: "Hủy quyết định GĐT, xét xử lại ST", capXuLai: "Sơ thẩm", donViNhan: "TAND TP Hà Nội", soQDGDT: "03/2026/QĐ-GĐT", ngayBanHanh: "01/09/2026", trangThai: "Đã tiếp nhận (PT/ST)" },
  ]);

  const thuHinhChua = listTuHinhDen.filter(x => x.trangThai === "Chưa tiếp nhận").length;
  const knDenCho = listKNDen.filter(x => x.trangThai === "Chờ nhận").length;
  const xxlChoXuLy = listXetXuLai.filter(x => x.trangThai === "Chờ chuyển").length;
  const allRows = [
    ...listTuHinhDen.map(r => ({ ...r, loaiHoSo: "Hồ sơ tử hình", chieu: "Đến", targetTab: "tu-hinh" as MainTab })),
    ...listKNDi.map(r => ({ ...r, loaiHoSo: "Hồ sơ kháng nghị", chieu: "Đi", targetTab: "khang-nghi" as MainTab })),
    ...listKNDen.map(r => ({ ...r, loaiHoSo: "Hồ sơ kháng nghị", chieu: "Đến", targetTab: "khang-nghi" as MainTab })),
    ...listXetXuLai.map(r => ({ ...r, loaiHoSo: "Hồ sơ xét xử lại", chieu: "Đi", targetTab: "xet-xu-lai" as MainTab })),
  ];

  const handleTiepNhanTuHinh = (id: number) => setListTuHinhDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã tiếp nhận", ngayNhan: new Date().toLocaleDateString("vi-VN"), nguoiNhan: "Lý Thái Phúc" } : r));
  const handleTuChoiTuHinh = (id: number, lyDo: string) => { setListTuHinhDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Từ chối tiếp nhận" } : r)); setShowTuChoi(false); alert("Đã từ chối tiếp nhận.\\nLý do: " + lyDo); };
  const handleNhanKNDen = (id: number) => setListKNDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã nhận", ngayNhan: new Date().toLocaleDateString("vi-VN"), nguoiNhan: "Lý Thái Phúc" } : r));
  const handleXacNhanChuyen = (id: number) => { setListXetXuLai(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã chuyển" } : r)); alert("Đã xác nhận chuyển hồ sơ!"); };

  // --- Table Columns ---
  const tongHopCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "LOẠI HỒ SƠ", dataIndex: "loaiHoSo", key: "loaiHoSo", render: (v: string) => <Tag color={v.includes("tử hình") ? "volcano" : v.includes("kháng nghị") ? "blue" : "purple"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "CHIỀU", dataIndex: "chieu", key: "chieu", align: "center" as const, width: 100, render: (v: string) => <Tag color={v === "Đến" ? "green" : "orange"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "ĐƠN VỊ GỬI / NHẬN", key: "donVi", render: (r: any) => r.donViGui || r.donViNhan || "—" },
    { title: "SỐ HIỆU / CÔNG VĂN", key: "soHieu", render: (r: any) => <span style={{ color: "#0f766e", fontWeight: 600 }}>{r.soCongVan || r.soHieuKN || r.soQDGDT || "—"}</span> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "CHI TIẾT", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => <Button type="link" onClick={() => { setActiveMain(r.targetTab); if (r.targetTab === "khang-nghi") setKNSubTab(r.chieu === "Đi" ? "di" : "den"); }}>Xem</Button> }
  ];

  const tuHinhCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "SỐ CÔNG VĂN / NGÀY GỬI", key: "soCongVan", render: (r: any) => <div><div style={{ color: "#0f766e", fontWeight: 600 }}>{r.soCongVan}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày gửi: {r.ngayGui}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Người gửi: {r.nguoiGui}</div></div> },
    { title: "ĐƠN VỊ GỬI", key: "donViGui", render: (r: any) => <div><div style={{ fontWeight: 600 }}>{r.donViGui}</div><div style={{ marginTop: 4 }}><Tag color="blue">{r.loaiDonVi}</Tag></div></div> },
    { title: "HỒ SƠ VỤ ÁN", key: "hoSo", render: (r: any) => <div><div style={{ fontWeight: 600 }}>Bị án: {r.tenBiAn}</div><div style={{ color: "#2563eb", fontSize: 13 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 200, render: (_: any, r: any) => (
      r.trangThai === "Chưa tiếp nhận" ? (
        <Space>
          <Button type="primary" style={{ background: "#16a34a" }} onClick={() => handleTiepNhanTuHinh(r.id)}>Tiếp nhận</Button>
          <Button danger onClick={() => { setSelectedRecord(r); setShowTuChoi(true); }}>Từ chối</Button>
        </Space>
      ) : r.trangThai === "Đã tiếp nhận" ? (
        <div style={{ fontSize: 13, color: "#6b7280" }}>Người nhận: {r.nguoiNhan}<br/>{r.ngayNhan}</div>
      ) : <span style={{ color: "#7c3aed", fontStyle: "italic" }}>Đã từ chối</span>
    )}
  ];

  const knDenCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "THÔNG TIN KHÁNG NGHỊ", key: "thongTin", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.soHieuKN}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày: {r.ngayKN}</div><div style={{ fontSize: 13 }}>{r.nguoiKN}</div></div> },
    { title: "SỐ BẢN ÁN", key: "soBA", render: (r: any) => <div><div style={{ color: "#2563eb", fontWeight: 600 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "ĐƠN VỊ GỬI / NGƯỜI NHẬN", key: "donVi", render: (r: any) => <div><div><b>Gửi:</b> {r.donViGui}</div><div style={{ fontSize: 13, color: "#6b7280" }}><b>Nhận:</b> {r.nguoiNhan} ({r.ngayNhan})</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 140, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => r.trangThai === "Chờ nhận" && <Button type="primary" style={{ background: "#0f766e" }} onClick={() => handleNhanKNDen(r.id)}>Nhận</Button> }
  ];

  const knDiCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "THÔNG TIN KHÁNG NGHỊ", key: "thongTin", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.soHieuKN}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày: {r.ngayKN}</div><div style={{ fontSize: 13 }}>{r.nguoiKN}</div></div> },
    { title: "SỐ BẢN ÁN", key: "soBA", render: (r: any) => <div><div style={{ color: "#2563eb", fontWeight: 600 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "ĐƠN VỊ NHẬN / CÔNG VĂN", key: "donVi", render: (r: any) => <div><div><b>Nhận:</b> {r.donViNhan}</div><div style={{ fontSize: 13, marginTop: 4 }}>{r.soCVChuyen ? <span style={{ color: "#0284c7", fontWeight: 600 }}>{r.soCVChuyen} ({r.ngayChuyen})</span> : <span style={{ color: "#d97706", fontStyle: "italic" }}>Chưa có công văn</span>}</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 140, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => <Button type="link" danger onClick={() => { setSelectedRecord(r); setShowTrinhKy(true); }}>Trình ký</Button> }
  ];

  const xxlCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "VỤ ÁN", key: "vuAn", render: (r: any) => <div><div style={{ fontWeight: 600 }}>{r.maVuAn}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.tenVuAn}</div></div> },
    { title: "KẾT QUẢ GĐT / QUYẾT ĐỊNH", key: "kq", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.ketQuaGDT}</div><div style={{ fontSize: 13, color: "#6b7280" }}>QĐ: {r.soQDGDT}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ban hành: {r.ngayBanHanh}</div></div> },
    { title: "CẤP XỬ LẠI", dataIndex: "capXuLai", key: "capXuLai", align: "center" as const, width: 120, render: (v: string) => <Tag color={v === "Sơ thẩm" ? "gold" : "blue"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "ĐƠN VỊ NHẬN", dataIndex: "donViNhan", key: "donViNhan" },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 140, render: (_: any, r: any) => r.trangThai === "Chờ chuyển" ? <Button type="primary" style={{ background: "#7c3aed" }} onClick={() => handleXacNhanChuyen(r.id)}>Xác nhận</Button> : <span style={{ color: "#6b7280", fontSize: 13 }}>{r.trangThai}</span> }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, fontFamily: F }}>
      <div style={{ padding: "10px 20px", borderBottom: \`1px solid \${BORDER}\`, fontSize: 14, color: MUTED }}>
        Trang chủ &rsaquo; Quản lý án GĐT/TT &rsaquo; Quản lý giao nhận hồ sơ
      </div>
      
      <div style={{ padding: "16px 20px 0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Tabs 
          activeKey={activeMain} 
          onChange={(k) => setActiveMain(k as MainTab)}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          items={[
            {
              key: "tong-hop",
              label: \`Tổng hợp (\${allRows.length})\`,
              children: (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                      <Card bordered={false} style={{ background: "#fef2f2", border: "1px solid #fee2e2" }}>
                        <Statistic title="Tử hình chờ tiếp nhận" value={thuHinhChua} valueStyle={{ color: "#dc2626", fontWeight: 700 }} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card bordered={false} style={{ background: "#fffbeb", border: "1px solid #fef3c7" }}>
                        <Statistic title="Kháng nghị chờ nhận" value={knDenCho} valueStyle={{ color: "#d97706", fontWeight: 700 }} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card bordered={false} style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
                        <Statistic title="KN chờ chuyển" value={listKNDi.filter(x => x.trangThai !== "Đã chuyển").length} valueStyle={{ color: "#2563eb", fontWeight: 700 }} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card bordered={false} style={{ background: "#f5f3ff", border: "1px solid #ede9fe" }}>
                        <Statistic title="Xét xử lại chờ chuyển" value={xxlChoXuLy} valueStyle={{ color: "#7c3aed", fontWeight: 700 }} />
                      </Card>
                    </Col>
                  </Row>
                  <Table 
                    columns={tongHopCols} 
                    dataSource={allRows} 
                    rowKey={r => r.loaiHoSo + r.id} 
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    size="middle"
                    scroll={{ y: "calc(100vh - 350px)" }}
                    bordered
                  />
                </div>
              )
            },
            {
              key: "tu-hinh",
              label: \`Hồ sơ tử hình (\${listTuHinhDen.length})\`,
              children: (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Space>
                      <strong style={{ fontSize: 16 }}>Hồ sơ tử hình đến</strong>
                      <Tag color="error">{thuHinhChua} chờ tiếp nhận</Tag>
                    </Space>
                    <Button type="primary" style={{ background: "#0f766e" }} onClick={() => setShowNhapTay("tu-hinh")}>Nhập tay hồ sơ (VKS / Khác)</Button>
                  </div>
                  <Table 
                    columns={tuHinhCols} 
                    dataSource={listTuHinhDen} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ y: "calc(100vh - 300px)" }}
                    bordered
                  />
                </div>
              )
            },
            {
              key: "khang-nghi",
              label: \`Hồ sơ kháng nghị (\${listKNDi.length + listKNDen.length})\`,
              children: (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Space>
                      <Button type={kNSubTab === "den" ? "primary" : "default"} danger={kNSubTab === "den"} onClick={() => setKNSubTab("den")}>
                        Hồ sơ đến <Badge bg={kNSubTab === "den" ? "#fff" : "#e5e7eb"} color={kNSubTab === "den" ? RED : MUTED}>{listKNDen.length}</Badge>
                      </Button>
                      <Button type={kNSubTab === "di" ? "primary" : "default"} danger={kNSubTab === "di"} onClick={() => setKNSubTab("di")}>
                        Hồ sơ đi <Badge bg={kNSubTab === "di" ? "#fff" : "#e5e7eb"} color={kNSubTab === "di" ? RED : MUTED}>{listKNDi.length}</Badge>
                      </Button>
                    </Space>
                    <Space>
                      {kNSubTab === "den" && <Button type="primary" style={{ background: "#0f766e" }} onClick={() => setShowNhapTay("khang-nghi")}>Nhập tay (VKS/Khác)</Button>}
                      {kNSubTab === "den" && <Button type="primary" style={{ background: "#0f766e" }} onClick={() => { const f = listKNDen.find(x => x.trangThai === "Chờ nhận"); if (f) handleNhanKNDen(f.id); }}>Nhận hồ sơ</Button>}
                      {kNSubTab === "den" && <Button danger onClick={() => setShowTraHoSo(true)}>Trả hồ sơ</Button>}
                      {kNSubTab === "di" && <Button type="primary" style={{ background: "#0284c7" }} onClick={() => onTaoCongVan?.()}>Tạo công văn chuyển</Button>}
                      {kNSubTab === "di" && <Button type="primary" danger onClick={() => alert("Chuyển hồ sơ kháng nghị...")}>Chuyển hồ sơ</Button>}
                    </Space>
                  </div>
                  <Table 
                    rowSelection={{ type: "checkbox" }}
                    columns={kNSubTab === "den" ? knDenCols : knDiCols} 
                    dataSource={kNSubTab === "den" ? listKNDen : listKNDi} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ y: "calc(100vh - 300px)" }}
                    bordered
                  />
                </div>
              )
            },
            {
              key: "xet-xu-lai",
              label: \`Hồ sơ xét xử lại (GĐT) (\${listXetXuLai.length})\`,
              children: (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Space>
                      <strong style={{ fontSize: 16 }}>Hồ sơ GĐT chuyển xuống PT/ST xét xử lại</strong>
                      <Tag color="purple">{xxlChoXuLy} chờ chuyển</Tag>
                    </Space>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Tự động khởi tạo khi quyết định GĐT hủy án được ban hành chính thức.</span>
                  </div>
                  <Table 
                    columns={xxlCols} 
                    dataSource={listXetXuLai} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ y: "calc(100vh - 300px)" }}
                    bordered
                  />
                </div>
              )
            }
          ]}
        />
      </div>

      {showTuChoi && selectedRecord && <ModalTuChoiTiepNhan onClose={() => setShowTuChoi(false)} onConfirm={lyDo => handleTuChoiTuHinh(selectedRecord.id, lyDo)} />}
      {showNhapTay && <ModalNhapTayHoSoDen loaiHoSo={showNhapTay} onClose={() => setShowNhapTay(null)} onSave={data => {
        if (showNhapTay === "tu-hinh") {
          setListTuHinhDen(prev => [...prev, { id: data.id, maDon: \`TH-\${Date.now()}\`, soCongVan: data.soCongVan, ngayGui: data.ngayGui || "—", donViGui: data.tenDonVi, loaiDonVi: data.loaiDonVi, nguoiGui: data.nguoiGui, soBA: "—", toaRaBanAn: "—", tenBiAn: "—", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" }]);
        } else {
          setListKNDen(prev => [...prev, { id: data.id, soHieuKN: data.soCongVan, ngayKN: data.ngayGui || "—", nguoiKN: data.nguoiGui, soBA: "—", toaRaBanAn: "—", donViGui: data.tenDonVi, ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" }]);
        }
        setShowNhapTay(null);
        alert("Đã lưu hồ sơ nhập tay!");
      }} />}
      {showTraHoSo && <ModalTraHoSo onClose={() => setShowTraHoSo(false)} onConfirm={lyDo => { setShowTraHoSo(false); alert("Đã trả lại hồ sơ.\\nLý do: " + lyDo); }} />}
      {showTrinhKy && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKy(false)} />}
    </div>
  );
}

export default HoSoKhangNghiView;`;

const newContent = content.slice(0, startIndex) + replacement + "\n" + content.slice(endIndex + endStr.length);
fs.writeFileSync(filePath, newContent, "utf-8");
console.log("Updated HoSoKhangNghiView.tsx!");
