import React, { useState } from "react";
import { Search, RefreshCw, Eye, ChevronDown, ChevronUp, FileText, Users, X, CheckCircle, AlertCircle, Calendar, Upload, FileSignature } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, StatusBadge, type UserRoleType } from "./shared";
import { TabThongTin } from "./TabThongTin";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoToTrinhModal } from "./TrinhKyModal";
import { HoSoInfoGrid, HSPagination, HSTHTabPhanCong, HSTHTabToTrinh, VKSSubTab, CTNSubTab, XacMinhSubTab, HSTHTabHoSoTuHinh, ModalQDKhangNghi, ModalQDKhongKhangNghi } from "./HoSoTuHinhView";
import { Button, Input } from "antd";

const CHUYEN_HP_LIST = [
  { id: "chp-1", soBA: "125/2023/HS-ST", ngayBA: "15/10/2023", biAn: "Chu Văn An", toiDanh: "Tội giết người, cướp tài sản", trangThai: "chua-xet-duyet", ttv: "Nguyễn Thị Thùy Liên", lanhDao: "Nguyễn Văn Hiền", thamPhan: "Phạm Thị Bích Ngọc" },
  { id: "chp-2", soBA: "42/2024/HS-PT", ngayBA: "20/01/2024", biAn: "Nguyễn Văn B", toiDanh: "Tội tham ô tài sản", trangThai: "da-trinh-duyet", ttv: "Lý Thái Phúc", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Nguyễn Văn A" },
  { id: "chp-3", soBA: "18/2024/HS-ST", ngayBA: "08/03/2024", biAn: "Hoàng Văn Bảy", toiDanh: "Tội vận chuyển trái phép chất ma túy", trangThai: "chua-xet-duyet", ttv: "Trần Văn C", lanhDao: "Nguyễn Như Thắng", thamPhan: "Lê Thị D" },
];

type DetailTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "to-trinh" | "ket-qua" | "tai-lieu-vu-an" | "ho-so-tu-hinh";

export default function ChuyenHinhPhatView({ userRole }: { userRole?: UserRoleType }) {
  const [selectedHS, setSelectedHS] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("thong-tin");
  const [showToTrinh, setShowToTrinh] = useState(false);
  const [kqSubTab, setKqSubTab] = useState<"toa-an" | "vks" | "ctn" | "xac-minh">("toa-an");
  const [showQDDrop, setShowQDDrop] = useState(false);
  const [showQDKhangNghi, setShowQDKhangNghi] = useState(false);
  const [showQDKhongKhangNghi, setShowQDKhongKhangNghi] = useState(false);
  const qdDropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (qdDropRef.current && !qdDropRef.current.contains(e.target as Node)) setShowQDDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);


  // Waterfall logic state
  const [ngayTuyenAn, setNgayTuyenAn] = useState("2023-10-15");
  const [vaiTro, setVaiTro] = useState("Thực hành");
  const [tinhTietTangNang, setTinhTietTangNang] = useState(0);
  const [dacCach, setDacCach] = useState("Khong");
  const [nhomToi, setNhomToi] = useState("Khac");
  const [tiLeBoiThuong, setTiLeBoiThuong] = useState(0);
  const [hopTac, setHopTac] = useState(false);
  
  
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "9px 12px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "11px 12px", verticalAlign: "top" };

  const [kq, setKq] = useState<{status: 'idle' | 'pass' | 'fail', message: string}>({status: 'idle', message: ''});

  const checkLogic = () => {
    // 1. Vòng loại trừ cứng
    if (new Date(ngayTuyenAn) > new Date("2025-07-01")) {
      setKq({ status: 'fail', message: "Vòng loại trừ: Bản án tuyên sau 01/07/2025." });
      return;
    }
    if (vaiTro === "Chủ mưu" || vaiTro === "Cầm đầu") {
      setKq({ status: 'fail', message: "Vòng loại trừ: Vai trò chủ mưu, cầm đầu." });
      return;
    }
    if (tinhTietTangNang >= 2) {
      setKq({ status: 'fail', message: "Vòng loại trừ: Có từ 2 tình tiết tăng nặng trở lên." });
      return;
    }

    // 2. Vòng đặc cách
    if (dacCach !== "Khong") {
      setKq({ status: 'pass', message: `Đủ điều kiện (Đặc cách): ${dacCach}` });
      return;
    }

    // 3. Vòng đối chiếu theo nhóm tội
    if (nhomToi === "KinhTe") {
      if (tiLeBoiThuong >= 75 && hopTac) {
        setKq({ status: 'pass', message: "Đủ điều kiện: Đã khắc phục >= 75% và Hợp tác tích cực." });
      } else {
        setKq({ status: 'fail', message: "Không đủ điều kiện (Kinh tế): Chưa nộp đủ 75% hoặc không hợp tác." });
      }
      return;
    }
    if (nhomToi === "MaTuy") {
      setKq({ status: 'pass', message: "Đủ điều kiện (Ma túy): Định lượng dưới mức quy định mới." });
      return;
    }
    if (nhomToi === "BaiBo") {
      setKq({ status: 'pass', message: "Đủ điều kiện: Tội danh đã bãi bỏ án tử hình." });
      return;
    }

    setKq({ status: 'fail', message: "Không thuộc diện chuyển đổi hình phạt." });
  };

  if (selectedHS) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f9fafb" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Button onClick={() => setSelectedHS(null)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, padding: 0 }}>← Quay lại</Button>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0, fontFamily: F }}>Hồ sơ: {selectedHS.soBA} - {selectedHS.biAn}</h2>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: MUTED, fontFamily: F }}>Tội danh: {selectedHS.toiDanh}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {kq.status === 'pass' && (
              <Button style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontFamily: F }}>
                <FileText size={16} /> Trình duyệt
              </Button>
            )}
            <Button style={{ padding: "8px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontFamily: F }}>
              <FileSignature size={16} /> Phê duyệt (Chánh án)
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: "0 24px", background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 20 }}>
          {[
            { id: "thong-tin", label: "Thông tin chung" },
            { id: "danh-sach-don", label: "Danh sách đơn" },
            { id: "phan-cong", label: "Phân công" },
            { id: "to-trinh", label: "Tờ trình" },
            { id: "ket-qua", label: "Kết quả giải quyết" },
            { id: "tai-lieu-vu-an", label: "Tài liệu vụ án" },
            { id: "ho-so-tu-hinh", label: "Hồ sơ tử hình" },
          ].map(t => (
            <Button
              key={t.id}
              onClick={() => setActiveTab(t.id as DetailTab)}
              style={{
                padding: "12px 0", border: "none", background: "none", cursor: "pointer", fontFamily: F, fontSize: 14,
                fontWeight: activeTab === t.id ? 600 : 400,
                color: activeTab === t.id ? RED : MUTED,
                borderBottom: activeTab === t.id ? `2px solid ${RED}` : "2px solid transparent"
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 24, overflow: "auto" }}>
          
          {activeTab === "to-trinh" && <HSTHTabToTrinh />}

          {activeTab === "tai-lieu-vu-an" && (
            <TaiLieuHoSoView />
          )}
          
          
          {activeTab === "phan-cong" && (
            <div style={{ background: "#fff", padding: 24, borderRadius: 8, border: `1px solid ${BORDER}` }}>
               <h3 style={{ margin: "0 0 20px 0", fontSize: 16, fontFamily: F, color: "#1f2937" }}>Phân công giải quyết Chuyển Hình Phạt</h3>
               <p style={{ fontSize: 14, color: MUTED, marginBottom: 20 }}>Lãnh đạo vụ tiến hành phân công Thẩm tra viên và Lãnh đạo vụ phụ trách cho hồ sơ chuyển hình phạt này.</p>
               
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                 <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Thẩm phán (Kế thừa từ Hồ sơ tử hình)</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <Input value={selectedHS.thamPhan || ""} disabled style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, background: "#f3f4f6", color: MUTED }} />
                    </div>
                    {!selectedHS.thamPhan && (
                      <div style={{ marginTop: 8, fontSize: 14, color: "#b45309", background: "#fef3c7", padding: "6px 10px", borderRadius: 4, border: "1px solid #fcd34d" }}>
                        Hồ sơ gốc chưa phân công Thẩm phán. Vui lòng quay lại màn Hồ sơ tử hình để phân công!
                      </div>
                    )}
                 </div>
                 <div style={{ gridColumn: "1 / -1", height: 1, background: BORDER, margin: "10px 0" }}></div>
                 
                 <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Thẩm tra viên</label>
                    <select style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }}>
                      <option value="">-- Chọn Thẩm tra viên --</option>
                      <option value="Nguyễn Thị Thùy Liên" selected={selectedHS.ttv === "Nguyễn Thị Thùy Liên"}>Nguyễn Thị Thùy Liên</option>
                      <option value="Lý Thái Phúc" selected={selectedHS.ttv === "Lý Thái Phúc"}>Lý Thái Phúc</option>
                    </select>
                 </div>
                 
                 <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Lãnh đạo vụ phụ trách</label>
                    <select style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }}>
                      <option value="">-- Chọn Lãnh đạo vụ --</option>
                      <option value="Nguyễn Văn Hiền" selected={selectedHS.lanhDao === "Nguyễn Văn Hiền"}>Nguyễn Văn Hiền</option>
                      <option value="Lê Thị Bình Ngọc" selected={selectedHS.lanhDao === "Lê Thị Bình Ngọc"}>Lê Thị Bình Ngọc</option>
                    </select>
                 </div>
               </div>
               
               <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                 <Button onClick={() => alert("Đã lưu phân công!")} style={{ padding: "10px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>
                   Lưu phân công
                 </Button>
               </div>
            </div>
          )}

          {activeTab === "ho-so-tu-hinh" && <HSTHTabHoSoTuHinh maVuAn={selectedHS?.soBA} tenVuAn={selectedHS?.biAn} />}
          
          {activeTab === "thong-tin" && (
          <>
            <HoSoInfoGrid />
            <div style={{ fontWeight: 700, fontSize: 14, color: RED, marginBottom: 10, marginTop: 24 }}>RÀ SOÁT ĐIỀU KIỆN CHUYỂN ĐỔI (LOGIC THÁC NƯỚC)</div>
            <div style={{ background: "#fff", padding: 24, borderRadius: 8, border: `1px solid ${BORDER}`, width: "100%", boxSizing: "border-box" }}>
              
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Ngày tuyên án</label>
                  <Input type="date" value={ngayTuyenAn} onChange={e => setNgayTuyenAn(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Vai trò trong vụ án</label>
                  <select value={vaiTro} onChange={e => setVaiTro(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }}>
                    <option value="Thực hành">Thực hành</option>
                    <option value="Đồng phạm">Đồng phạm</option>
                    <option value="Chủ mưu">Chủ mưu</option>
                    <option value="Cầm đầu">Cầm đầu</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Số tình tiết tăng nặng</label>
                  <Input type="number" value={tinhTietTangNang} onChange={e => setTinhTietTangNang(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Yếu tố đặc cách</label>
                  <select value={dacCach} onChange={e => setDacCach(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }}>
                    <option value="Khong">Không có</option>
                    <option value="Phụ nữ có thai">Phụ nữ có thai / nuôi con &lt; 36 tháng</option>
                    <option value="Người &gt;= 75 tuổi">Người &gt;= 75 tuổi</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Nhóm tội danh xét duyệt</label>
                  <select value={nhomToi} onChange={e => setNhomToi(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14 }}>
                    <option value="Khac">Khác</option>
                    <option value="KinhTe">Kinh tế / Tham nhũng</option>
                    <option value="MaTuy">Ma túy</option>
                    <option value="BaiBo">Tội danh đã bãi bỏ án tử hình</option>
                  </select>
                </div>
              </div>

              {nhomToi === "KinhTe" && (
                <div style={{ background: BG, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: 14, fontFamily: F }}>Điều kiện Kinh tế / Tham nhũng</h4>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Tỉ lệ khắc phục (%)</label>
                      <Input type="number" value={tiLeBoiThuong} onChange={e => setTiLeBoiThuong(Number(e.target.value))} style={{ width: "100%", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: 4 }} />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginTop: 18 }}>
                      <Input type="checkbox" checked={hopTac} onChange={e => setHopTac(e.target.checked)} />
                      Có hợp tác tích cực / lập công
                    </label>
                  </div>
                </div>
              )}

              <Button onClick={checkLogic} style={{ padding: "10px 24px", background: "#1f2937", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F, width: "100%" }}>
                Kiểm tra & Đối chiếu
              </Button>

              {kq.status !== 'idle' && (
                <div style={{ marginTop: 20, padding: 16, borderRadius: 8, border: `1px solid ${kq.status === 'pass' ? '#86efac' : '#fca5a5'}`, background: kq.status === 'pass' ? '#f0fdf4' : '#fef2f2', display: "flex", alignItems: "center", gap: 12 }}>
                  {kq.status === 'pass' ? <CheckCircle color="#16a34a" /> : <AlertCircle color="#dc2626" />}
                  <span style={{ fontSize: 14, fontWeight: 500, color: kq.status === 'pass' ? '#16a34a' : '#dc2626', fontFamily: F }}>
                    {kq.message}
                  </span>
                </div>
              )}
            </div>
            
            <div style={{ fontWeight: 700, fontSize: 14, color: RED, marginBottom: 10 }}>BẢNG DANH SÁCH BỊ CÁO</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                  <colgroup>
                    <col style={{ width: 45 }} /><col style={{ width: 180 }} /><col style={{ width: 120 }} /><col style={{ width: 100 }} /><col style={{ width: 160 }} /><col style={{ width: 150 }} /><col style={{ width: 80 }} />
                  </colgroup>
                  <thead>
                    <tr>{["STT", "HỌ VÀ TÊN", "NGÀY SINH", "GIỚI TÍNH", "TỘI DANH", "HÌNH PHẠT", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      { stt: "01", ten: "Chu Văn An", ngaySinh: "15/08/1982", gioiTinh: "Nam", toiDanh: "Giết người", hinhPhat: "Tử hình", tuHinh: true },
                      { stt: "02", ten: "Trần Văn B", ngaySinh: "20/05/1990", gioiTinh: "Nam", toiDanh: "Cướp tài sản", hinhPhat: "20 năm tù", tuHinh: false },
                      { stt: "03", ten: "Lê Thị C", ngaySinh: "10/11/1985", gioiTinh: "Nữ", toiDanh: "Đồng phạm", hinhPhat: "15 năm tù", tuHinh: false },
                    ].filter(r => r.tuHinh).map((r, i) => (
                      <tr key={r.stt} style={{
                        background: r.tuHinh ? "#fff5f5" : (i % 2 === 0 ? "#fff" : "#fafafa"),
                        borderTop: i > 0 ? `1px solid ${r.tuHinh ? "#fecaca" : BORDER}` : "none",
                        borderLeft: r.tuHinh ? "3px solid #dc2626" : "3px solid transparent",
                      }}>
                        <td style={{ ...TD, textAlign: "center", color: r.tuHinh ? "#dc2626" : MUTED, fontWeight: r.tuHinh ? 700 : 400, whiteSpace: "nowrap" }}>{r.stt}</td>
                        <td style={{ ...TD, fontWeight: 700, whiteSpace: "nowrap", color: r.tuHinh ? "#991b1b" : TEXT }}>
                          {r.tuHinh && <span style={{ marginRight: 5, fontSize: 14 }}>⚠</span>}
                          {r.ten}
                        </td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.ngaySinh}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.gioiTinh}</td>
                        <td style={{ ...TD, color: r.tuHinh ? "#dc2626" : TEXT, whiteSpace: "nowrap", fontWeight: r.tuHinh ? 600 : 400 }}>{r.toiDanh}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>
                          {r.tuHinh ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#dc2626", color: "#fff", whiteSpace: "nowrap" }}>
                              🔴 {r.hinhPhat}
                            </span>
                          ) : (
                            <span style={{ color: TEXT }}>{r.hinhPhat}</span>
                          )}
                        </td>
                        <td style={{ ...TD, textAlign: "center", whiteSpace: "nowrap" }}>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", color: "#0e7490", fontSize: 14, fontFamily: F, display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
                            <Eye size={13} /> Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <HSPagination total={1} />
            </div>

            {/* BẢNG KẾT QUẢ GIẢI QUYẾT ĐƠN */}
            <div style={{ fontWeight: 700, fontSize: 14, color: RED, marginTop: 24, marginBottom: 10 }}>BẢNG KẾT QUẢ GIẢI QUYẾT ĐƠN</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 180 }} />
                    <col style={{ width: 220 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 180 }} />
                    <col style={{ width: 80 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      {["STT", "SỐ & NGÀY ĐƠN", "NGƯỜI NỘP ĐƠN / BỊ ÁN", "THÔNG TIN KẾT QUẢ", "NGƯỜI KÝ / NƠI BAN HÀNH", "THAO TÁC"].map(h => (
                        <th key={h} style={TH}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        stt: "01",
                        soDon: "01/ĐN-AG",
                        ngayDon: "10/01/2026",
                        loaiDon: "Đơn xin ân giảm án tử hình",
                        nguoiNop: "Chu Văn An (Bị án tử hình)",
                        ketQua: "Kháng nghị",
                        trangThaiBadge: <Badge color="#991b1b" bg="#fee2e2">Kháng nghị</Badge>,
                        soVB: "15/QĐ-TANDTC",
                        ngayVB: "15/02/2026",
                        nguoiKy: "Chánh án Tòa án nhân dân tối cao",
                        coQuan: "Tòa án nhân dân tối cao",
                      },
                      {
                        stt: "02",
                        soDon: "02/ĐN-GĐT",
                        ngayDon: "20/01/2026",
                        loaiDon: "Đơn đề nghị giám đốc thẩm",
                        nguoiNop: "Chu Văn An (Bị án)",
                        ketQua: "Trả lời đơn",
                        trangThaiBadge: <Badge color="#1e40af" bg="#dbeafe">Trả lời đơn</Badge>,
                        soVB: "45/TB-TANDTC",
                        ngayVB: "28/02/2026",
                        nguoiKy: "Thẩm phán - Chánh án",
                        coQuan: "Tòa án nhân dân tối cao",
                      },
                    ].map((r, i) => (
                      <tr key={r.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED, whiteSpace: "nowrap" }}>{r.stt}</td>
                        <td style={TD}>
                          <div style={{ fontWeight: 600, color: TEXT }}>{r.soDon}</div>
                          <div style={{ fontSize: 14, color: MUTED }}>Ngày: {r.ngayDon}</div>
                          <div style={{ fontSize: 14, color: "#2563eb", marginTop: 2 }}>{r.loaiDon}</div>
                        </td>
                        <td style={TD}>
                          <div style={{ fontWeight: 600, color: TEXT }}>{r.nguoiNop}</div>
                        </td>
                        <td style={TD}>
                          <div style={{ marginBottom: 4 }}>{r.trangThaiBadge}</div>
                          {/* <div style={{ fontSize: 14, color: TEXT }}>{r.ketQua}</div> */}
                          <div style={{ fontWeight: 600, color: "#15803d" }}>{r.soVB}</div>
                          <div style={{ fontSize: 14, color: MUTED }}>Ngày: {r.ngayVB}</div>
                        </td>

                        <td style={TD}>
                          <div style={{ fontWeight: 600, color: TEXT }}>{r.nguoiKy}</div>
                          <div style={{ fontSize: 14, color: MUTED }}>{r.coQuan}</div>
                        </td>
                        <td style={{ ...TD, textAlign: "center", whiteSpace: "nowrap" }}>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", color: "#0e7490", fontSize: 14, fontFamily: F, display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
                            <Eye size={13} /> Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <HSPagination total={1} />
            </div>

            {/* BẢNG KẾT QUẢ XÉT XỬ */}
            <div style={{ fontWeight: 700, fontSize: 14, color: RED, marginTop: 24, marginBottom: 10 }}>BẢNG KẾT QUẢ XÉT XỬ</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 200 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 180 }} />
                    <col style={{ width: 140 }} />
                    <col style={{ width: 80 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      {["STT", "CẤP XÉT XỬ", "SỐ & NGÀY BA/QĐ", "TÒA ÁN XÉT XỬ", "BỊ CÁO / TỘI DANH", "KẾT QUẢ XÉT XỬ", "HIỆU LỰC", "THAO TÁC"].map(h => (
                        <th key={h} style={TH}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        stt: "01",
                        capXetXu: <Badge color="#1e40af" bg="#dbeafe">Sơ thẩm</Badge>,
                        soBA: "125/2023/HS-ST",
                        ngayBA: "15/10/2023",
                        toaAn: "Tòa án nhân dân tỉnh Long An",
                        biCao: "Chu Văn An",
                        toiDanh: "Giết người",
                        hinhPhat: "🔴 Tử hình",
                        hieuLuc: <Badge color="#065f46" bg="#d1fae5">Đã có hiệu lực</Badge>,
                      },
                      {
                        stt: "02",
                        capXetXu: <Badge color="#7c3aed" bg="#f3e8ff">Phúc thẩm</Badge>,
                        soBA: "48/2024/HS-PT",
                        ngayBA: "20/03/2024",
                        toaAn: "TAND cấp cao tại TP.Hồ Chí Minh",
                        biCao: "Chu Văn An",
                        toiDanh: "Giết người",
                        hinhPhat: "🔴 Giữ nguyên Tử hình",
                        hieuLuc: <Badge color="#065f46" bg="#d1fae5">Đã có hiệu lực</Badge>,
                      },
                    ].map((r, i) => (
                      <tr key={r.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED, whiteSpace: "nowrap" }}>{r.stt}</td>
                        <td style={TD}>{r.capXetXu}</td>
                        <td style={TD}>
                          <div style={{ fontWeight: 600, color: "#2563eb" }}>{r.soBA}</div>
                          <div style={{ fontSize: 14, color: MUTED }}>Ngày: {r.ngayBA}</div>
                        </td>
                        <td style={TD}>
                          <div style={{ color: TEXT }}>{r.toaAn}</div>
                        </td>
                        <td style={TD}>
                          <div style={{ fontWeight: 600, color: TEXT }}>{r.biCao}</div>
                          <div style={{ fontSize: 14, color: "#dc2626" }}>{r.toiDanh}</div>
                        </td>
                        <td style={TD}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#dc2626", color: "#fff", whiteSpace: "nowrap" }}>
                            {r.hinhPhat}
                          </span>
                        </td>
                        <td style={TD}>{r.hieuLuc}</td>
                        <td style={{ ...TD, textAlign: "center", whiteSpace: "nowrap" }}>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", color: "#0e7490", fontSize: 14, fontFamily: F, display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
                            <Eye size={13} /> Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <HSPagination total={1} />
            </div>
          </>
        )}

        
          {activeTab === "danh-sach-don" && (
          <>
            <HoSoInfoGrid />
            <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 10 }}>Danh sách đơn</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: 100 }} />
                    <col style={{ width: 150 }} />
                    <col style={{ width: 250 }} />
                    <col style={{ width: 170 }} />
                    <col style={{ width: 220 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 80 }} />
                  </colgroup>
                  <thead>
                    <tr>{["STT", "MÃ ĐƠN", "NGÀY NHẬN ĐƠN", "NGƯỜI ĐỨNG ĐƠN", "PHÂN LOẠI", "NỘI DUNG", "BỊ ÁN", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      { stt: 1, maDon: "6549", ngayNhan: "09/07/2026", nguoi: "Đứng đơn chín, Đứng đơn chín hai", phanLoai: "Đơn đề nghị GĐT, TT", noiDung: "Đơn xin ân giảm + kêu oan", biAn: "Đặng Thìn Dương" },
                      { stt: 2, maDon: "6564", ngayNhan: "09/07/2026", nguoi: "Đứng đơn chín hai", phanLoai: "Đơn đề nghị GĐT, TT", noiDung: "Xin thi hành án", biAn: "Chu Văn An" },
                    ].map((r, i) => (
                      <tr key={r.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED, whiteSpace: "nowrap" }}>{r.stt}</td>
                        <td style={{ ...TD, fontWeight: 700, color: "#1e40af", whiteSpace: "nowrap" }}>{r.maDon}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.ngayNhan}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.nguoi}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.phanLoai}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.noiDung}</td>
                        <td style={{ ...TD, fontWeight: 600, whiteSpace: "nowrap" }}>{r.biAn}</td>
                        <td style={{ ...TD, textAlign: "center", whiteSpace: "nowrap" }}>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                            <Eye size={14} color="#0e7490" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <HSPagination total={2} />
            </div>
          </>
        )}

        
          {activeTab === "ket-qua" && (
          <>
            <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 4, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden", flexWrap: "wrap" }}>
              {(["toa-an", "vks", "ctn", "xac-minh"] as KetQuaSubTab[]).map((st, i) => {
                const labels: Record<KetQuaSubTab, string> = { "toa-an": "Thông tin Tòa án", "vks": "Thông tin VKS", "ctn": "Thông tin trình CTN", "xac-minh": "Thông tin xác minh" };
                const active = kqSubTab === st;
                return (
                  <Button key={st} onClick={() => setKqSubTab(st)} style={{ padding: "9px 18px", fontSize: 14, fontFamily: F, fontWeight: active ? 600 : 400, background: active ? "#fff8f8" : "#fff", border: "none", borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", borderRight: i < 3 ? `1px solid ${BORDER}` : "none", cursor: "pointer", color: active ? RED : TEXT, whiteSpace: "nowrap" }}>
                    {labels[st]}
                  </Button>
                );
              })}
            </div>

            {kqSubTab === "toa-an" && (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <FileText size={15} color={RED} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Quyết định của chánh án</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                      <Input placeholder="Nhập từ khóa tìm kiếm..." style={{ padding: "6px 10px", fontSize: 14, border: "none", outline: "none", fontFamily: F, width: 200 }} />
                      <Button style={{ padding: "6px 10px", background: RED, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Search size={13} color="#fff" />
                      </Button>
                    </div>
                    <div ref={qdDropRef} style={{ position: "relative" }}>
                      <Button
                        onClick={() => setShowQDDrop(v => !v)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, whiteSpace: "nowrap" }}
                      >
                        <Users size={13} /> Tạo quyết định <ChevronDown size={12} />
                      </Button>
                      {showQDDrop && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 220, overflow: "hidden" }}>
                          <Button
                            onClick={() => { setShowQDDrop(false); setShowQDKhangNghi(true); }}
                            style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            Quyết định kháng nghị
                          </Button>
                          <Button
                            onClick={() => { setShowQDDrop(false); setShowQDKhongKhangNghi(true); }}
                            style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            Quyết định không kháng nghị
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <RefreshCw size={13} color={MUTED} />
                    </Button>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 36 }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: "16%" }} /><col style={{ width: 72 }} />
                  </colgroup>
                  <thead>
                    <tr>{["TT", "TÊN QUYẾT ĐỊNH", "SỐ QĐ", "NGÀY RA QĐ", "NGƯỜI KÝ", "TRẠNG THÁI", "NGƯỜI TẠO", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "#fff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
                      <td style={TD}>Quyết định kháng nghị</td>
                      <td style={TD}>44/2026/QDXXST-HS</td>
                      <td style={TD}>22/07/2026</td>
                      <td style={TD}>Dương Văn Hải</td>
                      <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã ký</Badge></td>
                      <td style={TD}>
                        <div style={{ fontSize: 14, color: TEXT }}>Dương Văn Hải</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>28/07/2026 09:29:14</div>
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={14} color="#0e7490" /></Button>
                          <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Tải xuống">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.333 1.333 0 0 1 2 12.667V10M5.333 6.667 8 9.333m0 0 2.667-2.666M8 9.333V2" stroke="#9CA3AF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 14, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Tổng 1 quyết định vụ án</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{"<"}</Button>
                    <Button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}>1</Button>
                    <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{">"}</Button>
                  </div>
                </div>
              </div>
            )}

            {kqSubTab === "vks" && <VKSSubTab />}
            {kqSubTab === "ctn" && <CTNSubTab />}
            {kqSubTab === "xac-minh" && <XacMinhSubTab />}
          </>
        )}

        
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: F, height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 4px 0" }}>Quản lý chuyển hình phạt</h2>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Danh sách hồ sơ tử hình chưa được xét duyệt / chưa có quyết định ân giảm</p>
        </div>
      </div>

      <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 12, borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 10, background: BG }}>
          <div style={{ position: "relative", width: 300 }}>
            <Search size={14} color={MUTED} style={{ position: "absolute", left: 10, top: 9 }} />
            <Input type="text" placeholder="Tìm kiếm theo Số bản án, Tên bị án..." style={{ width: "100%", padding: "8px 10px 8px 30px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th style={TH_STYLE}>Số - Ngày bản án</th>
                <th style={TH_STYLE}>Bị án</th>
                <th style={TH_STYLE}>Tội danh</th>
                <th style={TH_STYLE}>Trạng thái</th>
                <th style={{ ...TH_STYLE, width: 120, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {CHUYEN_HP_LIST.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}` }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <td style={TD_STYLE}>
                    <div style={{ fontWeight: 600, color: RED }}>{c.soBA}</div>
                    <div style={{ fontSize: 14, color: MUTED }}>{c.ngayBA}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontWeight: 600 }}>{c.biAn}</td>
                  <td style={TD_STYLE}>{c.toiDanh}</td>
                  <td style={TD_STYLE}>
                    <Badge bg={c.trangThai === "da-trinh-duyet" ? "#dcfce7" : "#f3f4f6"} color={c.trangThai === "da-trinh-duyet" ? "#166534" : "#374151"}>
                      {c.trangThai === "da-trinh-duyet" ? "Đã trình duyệt" : "Chưa xét duyệt"}
                    </Badge>
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <Button onClick={() => setSelectedHS(c)} style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: "#3b82f6", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Eye size={14} /> Xem / Rà soát
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showToTrinh && <HoSoToTrinhModal onClose={() => setShowToTrinh(false)} />}
    </div>
  );
}
