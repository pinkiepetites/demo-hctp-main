import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, Eye, ChevronDown, FileText, Users, X, Send } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";

const HS_LIST = [
  { id: "hs-1", soBA: "125/2023/HS-ST", ngayBA: "15/10/2023", toa: "Tòa án nhân dân tỉnh Long An",        giaiDoan: "Sơ thẩm",   tenVuAn: "Chu Văn An giết người",          maVuAn: "VA26-000035", soBiAn: "01", trangThai: "cho-xu-ly",     vuAnBadge: "Đang xét xử GĐT,TT" },
  { id: "hs-2", soBA: "42/2024/HS-PT",  ngayBA: "20/01/2024", toa: "Tòa án nhân dân cấp cao tại TP.HCM", giaiDoan: "Phúc thẩm", tenVuAn: "Nguyễn Văn B trộm cắp tài sản", maVuAn: "VA26-000042", soBiAn: "02", trangThai: "da-phan-cong",  vuAnBadge: "" },
  { id: "hs-3", soBA: "12/2024/HS-PT",  ngayBA: "12/02/2024", toa: "Tòa án nhân dân cấp cao tại Hà Nội", giaiDoan: "Phúc thẩm", tenVuAn: "Chu Văn An giết người",          maVuAn: "VA26-000035", soBiAn: "03", trangThai: "da-co-to-trinh", vuAnBadge: "" },
  { id: "hs-4", soBA: "12/2024/HS-PT",  ngayBA: "12/02/2024", toa: "Tòa án nhân dân cấp cao tại Hà Nội", giaiDoan: "Phúc thẩm", tenVuAn: "Chu Văn An giết người",          maVuAn: "VA26-000035", soBiAn: "04", trangThai: "da-co-kqgq",    vuAnBadge: "" },
];

const PHAN_CONG_HS = { ttv: "Nguyễn Thị Thùy Liên", tp: "Phạm Thị Bích Ngọc", ld: "Nguyễn Văn Hiền" };

function HSTrangThaiChip({ status }: { status: string }) {
  const map: Record<string, { label: string; dot: string; bg: string; color: string }> = {
    "cho-xu-ly":      { label: "Chờ xử lý",     dot: "#9ca3af", bg: "#f3f4f6", color: "#374151" },
    "da-phan-cong":   { label: "Đã phân công",   dot: "#3b82f6", bg: "#eff6ff", color: "#1d4ed8" },
    "da-co-to-trinh": { label: "Đã có tờ trình", dot: "#f59e0b", bg: "#fffbeb", color: "#92400e" },
    "da-co-kqgq":     { label: "Đã có KQGQ",    dot: "#16a34a", bg: "#f0fdf4", color: "#065f46" },
  };
  const s = map[status] ?? map["cho-xu-ly"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 11, fontWeight: 500, fontFamily: F, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

type HSDetailTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "to-trinh" | "ket-qua" | "ho-so-tu-hinh";
type KetQuaSubTab = "toa-an" | "vks" | "ctn" | "xac-minh";

function HoSoInfoGrid() {
  const infoTD: React.CSSProperties = { padding: "10px 14px", fontSize: 12, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, fontFamily: F, color: TEXT, verticalAlign: "top" };
  const labelTD: React.CSSProperties = { ...infoTD, color: MUTED, width: "20%", fontWeight: 500, background: BG };
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: RED, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, background: "#fff8f8" }}>
        THÔNG TIN CHUNG VỤ ÁN
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={labelTD}>Mã vụ án</td>
            <td style={infoTD}>VA26-002012: ĐẶNG THÌN DƯƠNG - Tội cố ý gây thương tích...</td>
            <td style={labelTD}>Loại bản án</td>
            <td style={{ ...infoTD, borderRight: "none" }}>Sơ thẩm</td>
          </tr>
          <tr>
            <td style={labelTD}>Thủ tục giải quyết</td>
            <td style={infoTD}>Giám đốc thẩm</td>
            <td style={labelTD}>Số – Ngày bản án</td>
            <td style={{ ...infoTD, borderRight: "none" }}>CVKN_GDT – 20/07/2026</td>
          </tr>
          <tr>
            <td style={{ ...labelTD, borderBottom: "none" }}>Loại án</td>
            <td style={{ ...infoTD, borderBottom: "none" }}>Hình sự</td>
            <td style={{ ...labelTD, borderBottom: "none" }}>Tòa ra bản án</td>
            <td style={{ ...infoTD, borderBottom: "none", borderRight: "none" }}>Tòa án nhân dân cấp cao tại Hà Nội</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function HSPagination({ total }: { total: number }) {
  return (
    <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      <span>Hiển thị 1–{total} trong tổng số {total} bản ghi</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{"<"}</button>
        <button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 12 }}>1</button>
        <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{">"}</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F }}><option>10 / trang</option></select>
        <span>Đến</span>
        <input type="text" defaultValue="1" style={{ width: 36, padding: "3px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, textAlign: "center" }} />
        <span>Trang</span>
      </div>
    </div>
  );
}

// ── local modal for creating tờ trình (HSTH variant) ─────────────────────────
function HSTHTaoToTrinhModal({ onClose }: { onClose: () => void }) {
  const inSt: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 720, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}><span style={{ color: RED }}>*</span> Ngày lập tờ trình</span>
            <input placeholder="dd/mm/yyyy" style={{ ...inSt, maxWidth: 180 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>I. NỘI DUNG VỤ ÁN</div>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 }}><span style={{ color: RED }}>*</span> Tóm tắt nội dung</span>
            <textarea placeholder="Nhập tóm tắt nội dung vụ án" style={{ ...inSt, minHeight: 80, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>II. QUÁ TRÌNH GIẢI QUYẾT</div>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 }}><span style={{ color: RED }}>*</span> Diễn biến quá trình giải quyết</span>
            <textarea placeholder="Nhập quá trình giải quyết" style={{ ...inSt, minHeight: 80, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HSTHThuHoiDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED }}>×</button>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Phân công (HSTH) ──────────────────────────────────────────────────────
function HSTHTabPhanCong() {
  const thamPhanRows = [
    { stt: 3, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Chiêu", chucDanh: "TPTC",  ngayPC: "21/07/2026", nguoiTT: "Nguyễn Văn Hiển – Phó CA",                          thoiGian: "14:30 – 21/07/2026", ghiChu: "Phân công lại" },
    { stt: 2, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Ngã",   chucDanh: "TPB3",  ngayPC: "01/07/2026", nguoiTT: "Nguyễn Văn Hòa – Phó CA",                            thoiGian: "14:30 – 01/07/2026", ghiChu: "TP về hưu" },
    { stt: 1, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Hoa",   chucDanh: "TPB3",  ngayPC: "21/06/2026", nguoiTT: "Nguyễn Văn Hiển – Trưởng phòng VP HCTP",             thoiGian: "14:30 – 21/06/2026", ghiChu: "–" },
  ];
  const ttvRows = [
    { stt: 3, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Chiêu", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/07/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/07/2026" },
    { stt: 2, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Ngã",   chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "01/07/2026", hoTenLD: "Nguyễn Văn Hòa",  chucVuLD: "Phó Vụ trưởng", ngayPCLD: "01/07/2026" },
    { stt: 1, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Hoa",   chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/06/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/06/2026" },
  ];
  const secHdr = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
      <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );
  return (
    <div style={{ padding: 20 }}>
      {/* Thông tin chung */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin chung của hồ sơ tử hình</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "16%" }} /><col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} /><col style={{ width: "34%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>VA26-000035: Chu Văn An giết người</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Sơ thẩm</td>
            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Giám đốc thẩm</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>125/2023/HS-ST – 15/10/2023</td>
            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Loại án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}` }}>Hình sự</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>Tòa án nhân dân tỉnh Long An</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lịch sử phân công Thẩm phán */}
      <div style={{ marginBottom: 24 }}>
        {secHdr("Lịch sử phân công Thẩm phán")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr>{["STT","GIAI ĐOẠN","HỌ VÀ TÊN THẨM PHÁN","CHỨC DANH","NGÀY PHÂN CÔNG","NGƯỜI THAO TÁC","GHI CHÚ"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {thamPhanRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTen}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}><Badge color="#1e40af" bg="#dbeafe">{r.chucDanh}</Badge></td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPC}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                    <div>{r.nguoiTT}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.thoiGian}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED }}>{r.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử phân công TTV và LĐV */}
      <div style={{ marginBottom: 20 }}>
        {secHdr("Lịch sử phân công TTV và LĐV")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>{["STT","GIAI ĐOẠN","HỌ VÀ TÊN TTV","CHỨC DANH TTV","NGÀY PHÂN CÔNG TTV","HỌ VÀ TÊN LĐ","TÊN CHỨC VỤ LĐ","NGÀY PHÂN CÔNG LĐ"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ttvRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTenTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucDanhTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.hoTenLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucVuLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCLD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab Tờ trình (HSTH) ───────────────────────────────────────────────────────
function HSTHTabToTrinh() {
  const [showTaoTT,     setShowTaoTT]     = useState(false);
  const [showTrinhKy,   setShowTrinhKy]   = useState(false);
  const [showHoSo,      setShowHoSo]      = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx,     setThuHoiIdx]     = useState<number | null>(null);
  const [filterDon,     setFilterDon]     = useState("");
  const [filterVanBan,  setFilterVanBan]  = useState("");
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình thẩm tra hồ sơ số 2", yKien: "–",                                                            ngayDuyet: "–",          trangThai: "cho-duyet", subRows: [] as {label:string;ngayDuyet:string}[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán",    vanBan: "Tờ trình thẩm tra hồ sơ số 1", yKien: "Kháng nghị: Nguyễn Văn An/Không kháng nghị: Phạm Minh Tuấn", ngayDuyet: "07/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán",    vanBan: "Tờ trình thẩm tra hồ sơ số 1", yKien: "Kháng nghị: Nguyễn Văn An/Không kháng nghị: Phạm Minh Tuấn", ngayDuyet: "08/07/2026", trangThai: "da-duyet", subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án",     vanBan: "Tờ trình thẩm tra hồ sơ số 1", yKien: "Hồ sơ thiếu biên bản thẩm tra, đề nghị bổ sung trước khi trình", ngayDuyet: "06/07/2026", trangThai: "tu-choi",   subRows: [] },
  ]);

  const [checkedVanBan, setCheckedVanBan] = useState<Set<number>>(new Set());

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình thẩm tra hồ sơ số 1",      biAn: "Phạm Minh Tuấn",  ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo trả lời đơn 0902345 số 1", biAn: "Nguyễn Văn An",   ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành" },
    { stt: 3, vanBan: "Thông báo trả lời đơn 0902344 số 2", biAn: "Trần Thị Hương",  ngayTao: "09/07/2026", nguoiKy: "–",            trangThai: "Chờ ký số" },
  ];

  const allDonOptions   = Array.from(new Set(lichSuData.flatMap(r => r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean))));
  const allVanBanOpts   = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu  = lichSuData.filter(r => {
    const okDon    = !filterDon    || r.yKien.includes(filterDon);
    const okVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return okDon && okVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT     && <HSTHTaoToTrinhModal onClose={() => setShowTaoTT(false)} />}
      {showTrinhKy   && <TrinhKyModal        onClose={() => setShowTrinhKy(false)} />}
      {showHoSo      && <HoSoToTrinhModal    onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal      onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <HSTHThuHoiDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      {/* Danh sách văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 520 }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 40 }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH}>
                  <input type="checkbox"
                    checked={checkedVanBan.size === vanBanRows.length && vanBanRows.length > 0}
                    onChange={e => setCheckedVanBan(e.target.checked ? new Set(vanBanRows.map(r => r.stt)) : new Set())}
                  />
                </th>
                {["STT","TÊN VĂN BẢN","BỊ ÁN","NGÀY TẠO","NGƯỜI KÝ","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {vanBanRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <input type="checkbox"
                      checked={checkedVanBan.has(r.stt)}
                      onChange={e => setCheckedVanBan(prev => { const s = new Set(prev); e.target.checked ? s.add(r.stt) : s.delete(r.stt); return s; })}
                    />
                  </td>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                  <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                  <td style={TD}>{r.biAn}</td>
                  <td style={TD}>{r.ngayTao}</td>
                  <td style={TD}>{r.nguoiKy}</td>
                  <td style={TD}>
                    <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                           bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}>
                      {r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}
                    </Badge>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "center" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                        <Eye size={14} color="#0e7490" />
                      </button>
                      <button style={{ padding: "3px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT, whiteSpace: "nowrap" as const }}>Trình lại</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          <select value={filterDon} onChange={e => setFilterDon(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo đơn</option>
            {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT","NGÀY TRÌNH","LÃNH ĐẠO ĐƯỢC TRÌNH","CẤP TRÌNH","VĂN BẢN","Ý KIẾN/ĐƠN","NGÀY DUYỆT","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r) => {
                const realIdx = lichSuData.indexOf(r);
                return (
                  <React.Fragment key={"main-" + realIdx}>
                    <tr style={{ background: "#fff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                      <td style={TD}>{r.ngayTrinh}</td>
                      <td style={TD}>{r.lanh}</td>
                      <td style={TD}>{r.capTrinh}</td>
                      <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                      <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" }}>{r.yKien}</td>
                      <td style={TD}>{r.ngayDuyet}</td>
                      <td style={TD}>
                        {r.trangThai === "cho-duyet"
                          ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                          : r.trangThai === "tu-choi"
                          ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                          : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                            <Eye size={13} color="#0e7490" />
                          </button>
                          {r.trangThai === "cho-duyet" && (
                            <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 4v4h4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                          <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                            <Send size={13} color={RED} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {r.subRows.map((sub, si) => (
                      <tr key={"sub-" + realIdx + "-" + si} style={{ background: "#fafafa" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED }} />
                        <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td>
                        <td style={{ ...TD, fontSize: 11, color: MUTED }} colSpan={3}>Ngày: {sub.ngayDuyet}</td>
                        <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                              <Eye size={13} color="#0e7490" />
                            </button>
                            <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <Send size={13} color={RED} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Nơi nhận table for quyết định modals ──────────────────────────────────────
type QDNoiNhanRow = { id: number; noiNhan: string; chiTiet: string; ghiChu: string; editing: boolean };

function QDNoiNhanTable({ rows, setRows }: { rows: QDNoiNhanRow[]; setRows: React.Dispatch<React.SetStateAction<QDNoiNhanRow[]>> }) {
  const inp: React.CSSProperties = { padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 3, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, flex: 1 }}>Nơi nhận</span>
        <button onClick={() => setRows(p => [...p, { id: Date.now(), noiNhan: "", chiTiet: "", ghiChu: "", editing: true }])} style={{ padding: "5px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>Thêm nơi nhận</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: `1px solid ${BORDER}` }}>
        <colgroup>
          <col style={{ width: 40 }} /><col style={{ width: "22%" }} /><col style={{ width: "22%" }} /><col style={{ width: "30%" }} /><col style={{ width: 100 }} />
        </colgroup>
        <thead>
          <tr>{["STT","NƠI NHẬN","NƠI NHẬN CHI TIẾT","GHI CHÚ","THAO TÁC"].map(h => <th key={h} style={{ ...TH_STYLE, borderRight: `1px solid ${BORDER}`, padding: "7px 10px" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, borderRight: `1px solid ${BORDER}` }}>{idx + 1}</td>
              {r.editing ? (
                <>
                  <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, padding: "6px 8px" }}>
                    <select value={r.noiNhan} onChange={e => setRows(p => p.map(x => x.id === r.id ? { ...x, noiNhan: e.target.value } : x))} style={inp}>
                      <option value="">Chọn nơi nhận</option>
                      <option>Viện kiểm sát</option><option>Tòa án</option><option>Bộ Tư pháp</option>
                    </select>
                  </td>
                  <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, padding: "6px 8px" }}>
                    <select value={r.chiTiet} onChange={e => setRows(p => p.map(x => x.id === r.id ? { ...x, chiTiet: e.target.value } : x))} style={inp}>
                      <option value="">Chọn</option>
                      <option>VKSNDTC</option><option>TAND tối cao</option>
                    </select>
                  </td>
                  <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, padding: "6px 8px" }}>
                    <input value={r.ghiChu} onChange={e => setRows(p => p.map(x => x.id === r.id ? { ...x, ghiChu: e.target.value } : x))} placeholder="Nội dung ghi chú" style={inp} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <button onClick={() => setRows(p => p.map(x => x.id === r.id ? { ...x, editing: false } : x))} style={{ fontSize: 11, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: F, marginRight: 6 }}>Lưu</button>
                    <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ fontSize: 11, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: F }}>Hủy</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ ...TD_STYLE, fontSize: 11, borderRight: `1px solid ${BORDER}` }}>{r.noiNhan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, borderRight: `1px solid ${BORDER}` }}>{r.chiTiet}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, borderRight: `1px solid ${BORDER}` }}>{r.ghiChu}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <button onClick={() => setRows(p => p.map(x => x.id === r.id ? { ...x, editing: true } : x))} style={{ fontSize: 11, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: F, marginRight: 6 }}>Sửa</button>
                    <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ fontSize: 11, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: F }}>Xóa</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QDModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [noiNhanRows, setNoiNhanRows] = useState<QDNoiNhanRow[]>([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const inp: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };
  const req = <span style={{ color: RED }}>* </span>;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px", fontSize: 11, fontFamily: F }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-000035</b></span>
                <span><span style={{ color: MUTED }}>Tên vụ án: </span>Chu Văn An giết người</span>
                <span><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Chu Văn An</span>
                <span><span style={{ color: MUTED }}>Tại đơn vị chính: </span>Bắc cung</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Số BA/QĐ: </span>125/2023/HS-ST</span>
                <span><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>15/10/2023</span>
                <span><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân tỉnh Long An</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#0f766e" }}>Giám đốc thẩm, tái thẩm</span></span>
                <span><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#0f766e" }}>Tòa án nhân dân tối cao</span></span>
                <span><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#b45309", fontWeight: 600 }}>Chưa có kết quả xét xử</span></span>
              </div>
            </div>
          </div>

          {/* Section header */}
          <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
          </div>

          {/* Row 1: 4 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>{req}Ngày quyết định</label>
              <input placeholder="Chọn ngày quyết định" style={inp} />
            </div>
            <div>
              <label style={lbl}>Số quyết định</label>
              <input placeholder="Nhập số quyết định" style={inp} />
            </div>
            <div>
              <label style={lbl}>{req}Người ký ban hành</label>
              <select style={inp}><option value="">Chọn người ký</option><option>Dương Văn Hải</option><option>Nguyễn Văn Hiển</option></select>
            </div>
            <div>
              <label style={lbl}>Ngày phát hành</label>
              <input placeholder="dd/mm/yyyy" style={inp} />
            </div>
          </div>

          {/* Row 2: 3 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>{req}Thẩm quyền xét xử</label>
              <select style={inp}><option value="">Chọn thẩm quyền xét xử</option><option>Giám đốc thẩm</option><option>Tái thẩm</option></select>
            </div>
            <div>
              <label style={lbl}>{req}Bị án</label>
              <select style={inp}><option value="">Chọn bị án</option><option>Chu Văn An</option></select>
            </div>
            <div>
              <label style={lbl}>{req}Nội dung ý án</label>
              <input placeholder="Nhập nội dung" style={inp} />
            </div>
          </div>

          {/* Xem thứ tự */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>{req}Xem thứ tự</label>
            <textarea placeholder="Nhập nhận xét, phân tích" style={{ ...inp, minHeight: 72, resize: "vertical" }} />
          </div>

          {/* Quyết định */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>{req}Quyết định</label>
            <select style={inp}>
              <option value="">Lựa chọn quyết định hành từ vụ án để thay thế</option>
              <option>Kháng nghị theo thủ tục giám đốc thẩm</option>
              <option>Không kháng nghị</option>
            </select>
          </div>

          {/* Nơi nhận */}
          <QDNoiNhanTable rows={noiNhanRows} setRows={setNoiNhanRows} />

          {/* Footer */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14, flexWrap: "wrap" }}>
            <button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px dashed ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            <button style={{ padding: "6px 18px", background: "#fff", color: RED, border: `2px dashed ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lập số</button>
            <button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình duyệt</button>
            <button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
            <button style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalQDKhangNghi({ onClose }: { onClose: () => void }) {
  return <QDModal title="Quyết định kháng nghị" onClose={onClose} />;
}

function ModalQDKhongKhangNghi({ onClose }: { onClose: () => void }) {
  return <QDModal title="Quyết định không kháng nghị" onClose={onClose} />;
}

// ── VKS-specific modals (simple form matching the design) ─────────────────────
function VKSQDModal({ title, onClose }: { title: string; onClose: () => void }) {
  const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box" as const, padding: "9px 12px", fontSize: 13, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", background: "#fff", color: TEXT };
  const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: TEXT, fontFamily: F, marginBottom: 6 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
          <div>
            <label style={lbl}>Số quyết định</label>
            <input style={inp} placeholder="Nhập số quyết định" />
          </div>
          <div>
            <label style={lbl}>Ngày quyết định</label>
            <input type="date" style={inp} />
          </div>
          <div>
            <label style={lbl}>Viện trưởng Viện kiểm sát</label>
            <select style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}>
              <option value="">Chọn Viện kiểm sát</option>
              <option>Viện KSND Tối cao</option>
              <option>Viện KSND cấp tỉnh</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Tải file</label>
            <div style={{ border: `1.5px dashed ${BORDER}`, borderRadius: 6, padding: "24px 16px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, cursor: "pointer", background: "#fafafa" }}
              onDragOver={e => e.preventDefault()}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <span style={{ fontSize: 13, color: MUTED, fontFamily: F }}>Chọn tệp hoặc kéo thả vào đây</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "8px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>Đóng</button>
          <button style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 700 }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Thông tin VKS ─────────────────────────────────────────────────────────
function VKSSubTab() {
  const [showDrop, setShowDrop]           = useState(false);
  const [showKhangNghi, setShowKhangNghi] = useState(false);
  const [showKhong, setShowKhong]         = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "11px 12px", verticalAlign: "top" };

  return (
    <>
      {showKhangNghi && <VKSQDModal title="Tạo quyết định kháng nghị của Viện kiểm sát"     onClose={() => setShowKhangNghi(false)} />}
      {showKhong     && <VKSQDModal title="Tạo quyết định không kháng nghị của Viện kiểm sát" onClose={() => setShowKhong(false)} />}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <FileText size={15} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Quyết định của Viện trưởng Viện kiểm sát</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <input placeholder="Nhập từ khóa tìm kiếm..." style={{ padding: "6px 10px", fontSize: 12, border: "none", outline: "none", fontFamily: F, width: 200 }} />
              <button style={{ padding: "6px 10px", background: RED, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Search size={13} color="#fff" />
              </button>
            </div>
            <div ref={dropRef} style={{ position: "relative" }}>
              <button onClick={() => setShowDrop(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, whiteSpace: "nowrap" }}>
                <Users size={13} /> Tạo quyết định <ChevronDown size={12} />
              </button>
              {showDrop && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 220, overflow: "hidden" }}>
                  <button onClick={() => { setShowDrop(false); setShowKhangNghi(true); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }} onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>Quyết định kháng nghị</button>
                  <button onClick={() => { setShowDrop(false); setShowKhong(true); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }} onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>Quyết định không kháng nghị</button>
                </div>
              )}
            </div>
            <button style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <RefreshCw size={13} color={MUTED} />
            </button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: "16%" }} /><col style={{ width: 72 }} />
          </colgroup>
          <thead>
            <tr>{["TT","TÊN QUYẾT ĐỊNH","SỐ QĐ","NGÀY RA QĐ","NGƯỜI KÝ","TRẠNG THÁI","NGƯỜI TẠO","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fff" }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
              <td style={TD}>Quyết định kháng nghị</td>
              <td style={TD}>12/2026/VKS-KN</td>
              <td style={TD}>20/07/2026</td>
              <td style={TD}>Nguyễn Văn Hiển</td>
              <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã ký</Badge></td>
              <td style={TD}>
                <div style={{ fontSize: 12, color: TEXT }}>Nguyễn Văn Hiển</div>
                <div style={{ fontSize: 10, color: MUTED }}>20/07/2026 10:15:00</div>
              </td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={14} color="#0e7490" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Tổng 1 quyết định</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{"<"}</button>
            <button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 12 }}>1</button>
            <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{">"}</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Tab Thông tin trình CTN ────────────────────────────────────────────────────
// ── Modal: Thêm mới tờ trình Chủ tịch nước ───────────────────────────────────
function CTNTaoToTrinhModal({ onClose }: { onClose: () => void }) {
  const [nhanThay, setNhanThay] = useState("");
  const [noiNhanRows, setNoiNhanRows] = useState<QDNoiNhanRow[]>([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
    { id: 2, noiNhan: "", chiTiet: "", ghiChu: "", editing: true },
  ]);
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };
  const req = <span style={{ color: RED }}>* </span>;
  const secHdr = (n: string, title: string, btn?: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{n}. {title}</span>
      {btn}
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình Chủ tịch nước</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px", fontSize: 11, fontFamily: F }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-000035</b></span>
                <span><span style={{ color: MUTED }}>Tên vụ án: </span>Chu Văn An giết người</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Số BA: </span>125/2023/HS-ST</span>
                <span><span style={{ color: MUTED }}>Ngày BA: </span>15/10/2023</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân tỉnh Long An</span>
                <span><span style={{ color: MUTED }}>Họ và tên: </span>Chu Văn An</span>
                <span><span style={{ color: MUTED }}>Tội danh: </span>Giết người</span>
              </div>
            </div>
          </div>

          {/* Top fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>{req}Ngày lập tờ trình</label>
              <input type="date" placeholder="dd/mm/yyyy" style={inp} />
            </div>
            <div>
              <label style={lbl}>{req}Số tờ trình</label>
              <input placeholder="Nhập số tờ trình" style={inp} />
            </div>
            <div>
              <label style={lbl}>{req}Người ký</label>
              <select style={inp}><option value="">Chọn người ký</option><option>Nguyễn Thị Bình</option><option>Nguyễn Văn Hiển</option></select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>{req}Bị án</label>
            <select style={inp}><option value="">Chọn bị án</option><option>Chu Văn An</option><option>Nguyễn Văn A</option></select>
          </div>

          {/* I. Thông tin bị án */}
          <div style={{ marginBottom: 16 }}>
            {secHdr("I", "THÔNG TIN BỊ ÁN")}
            <label style={lbl}>{req}Tóm tắt thông tin bị án</label>
            <textarea placeholder="Nhập tóm tắt nội dung vụ án" style={{ ...inp, minHeight: 88, resize: "vertical" }} />
          </div>

          {/* II. Nội dung vụ án */}
          <div style={{ marginBottom: 16 }}>
            {secHdr("II", "NỘI DUNG VỤ ÁN/HÀNH VI PHẠM TỘI")}
            <label style={lbl}>{req}Diễn biến hành vi phạm tội</label>
            <textarea placeholder="Nhập quá trình giải quyết vụ án" style={{ ...inp, minHeight: 88, resize: "vertical" }} />
          </div>

          {/* III. Nhận thấy */}
          <div style={{ marginBottom: 16 }}>
            {secHdr("III", "NHẬN THẤY CỦA TÒA ÁN NHÂN DÂN TỐI CAO",
              <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: F }}>Thêm đơn xử lý</button>
            )}
            <label style={lbl}>{req}Nhận thấy của Tòa án nhân dân tối cao</label>
            <textarea value={nhanThay} onChange={e => setNhanThay(e.target.value)} placeholder="Nhập nội dung nhận thấy của Tòa án nhân dân tối cao" maxLength={4000} style={{ ...inp, minHeight: 100, resize: "vertical" }} />
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F, marginTop: 2 }}>{nhanThay.length}/4000</div>
          </div>

          {/* IV. Nơi nhận */}
          <div style={{ marginBottom: 16 }}>
            {secHdr("IV", "NƠI NHẬN")}
            <QDNoiNhanTable rows={noiNhanRows} setRows={setNoiNhanRows} />
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <button onClick={onClose} style={{ padding: "7px 28px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Cập nhật quyết định của Chủ tịch nước ─────────────────────────────
function CTNCapNhatQDModal({ onClose }: { onClose: () => void }) {
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 500 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Cập nhật quyết định của Chủ tịch nước</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Số quyết định</label>
            <input placeholder="Nhập số quyết định" style={inp} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Ngày quyết định</label>
            <input type="date" style={inp} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Kết luận của Chủ tịch nước</label>
            <select style={inp}>
              <option value="">Chọn kết luận</option>
              <option>Ân giảm</option>
              <option>Bác đơn</option>
              <option>Chưa có kết luận</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Tải file</label>
            <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 6, padding: "28px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", background: "#fafafa" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Chọn tệp hoặc kéo thả vào đây</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CTNSubTab() {
  const [showTaoTT, setShowTaoTT]       = useState(false);
  const [showThemQD, setShowThemQD]     = useState(false);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" };
  return (
    <>
      {showTaoTT  && <CTNTaoToTrinhModal onClose={() => setShowTaoTT(false)} />}
      {showThemQD && <CTNCapNhatQDModal  onClose={() => setShowThemQD(false)} />}
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Danh sách tờ trình CTN */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách tờ trình Chủ tịch nước</span>
          <button style={{ padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>+ Tạo CV thu hồi</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 700 }}>+ Tạo tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "13%" }} /><col style={{ width: "14%" }} /><col style={{ width: "14%" }} /><col style={{ width: "13%" }} /><col style={{ width: "16%" }} /><col style={{ width: "16%" }} /><col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr>{["STT","SỐ QUYẾT ĐỊNH","NGÀY QUYẾT ĐỊNH","NGÀY PHÁT HÀNH","NGƯỜI KÝ","NGƯỜI TẠO","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fff" }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
              <td style={TD}>.../TB-TA</td>
              <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
              <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
              <td style={TD}>Nguyễn Thị Bình</td>
              <td style={TD}>
                <div style={{ fontSize: 12, color: TEXT }}>Nguyễn Tường Linh</div>
                <div style={{ fontSize: 10, color: MUTED }}>23/07/2026 09:30:09</div>
              </td>
              <td style={TD}>
                <div style={{ fontSize: 12, color: TEXT }}>Đang tạo</div>
                <div style={{ fontSize: 10, color: MUTED }}>Chưa có hiệu lực</div>
              </td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.667 13 2 14l1-3.667L11.333 2z" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0-.667 9.333A1.333 1.333 0 0 1 10.667 14.667H5.333A1.333 1.333 0 0 1 4 13.333L3.333 4" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Kết quả giải quyết CTN */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Kết quả giải quyết của Chủ tịch nước</span>
          <button onClick={() => setShowThemQD(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 700 }}>+ Thêm quyết định</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "20%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} /><col style={{ width: "26%" }} /><col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr>{["STT","SỐ QUYẾT ĐỊNH CTN","NGÀY QUYẾT ĐỊNH","KẾT LUẬN CTN","TÀI LIỆU ĐÍNH KÈM","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fff" }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
              <td style={TD}>.../QĐ-CTN</td>
              <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
              <td style={TD}>Ân giảm</td>
              <td style={TD}>
                <span style={{ fontSize: 12, color: "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>📎</span> Chưa có tệp
                </span>
              </td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.667 13 2 14l1-3.667L11.333 2z" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

// ── Tab Thông tin xác minh ────────────────────────────────────────────────────
// ── Modal: Tạo công văn xác minh ─────────────────────────────────────────────
function TaoCongVanModal({ onClose }: { onClose: () => void }) {
  const [noiNhanRows, setNoiNhanRows] = useState<QDNoiNhanRow[]>([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
    { id: 2, noiNhan: "", chiTiet: "", ghiChu: "", editing: true },
  ]);
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 780, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24, overflow: "hidden" }}>
        {/* Header – dark red */}
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", background: "#7f1d1d" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: F, flex: 1 }}>Tạo công văn xác minh</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#fff" /></button>
        </div>

        <div style={{ padding: "20px" }}>
          {/* THÔNG TIN CÔNG VĂN */}
          <div style={{ color: RED, fontWeight: 700, fontSize: 12, fontFamily: F, marginBottom: 14 }}>THÔNG TIN CÔNG VĂN</div>

          {/* Row 1: 4 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 12px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>Ngày tạo CV</label>
              <div style={{ position: "relative" }}>
                <input type="date" placeholder="Chọn ngày" style={{ ...inp, paddingRight: 32 }} />
              </div>
            </div>
            <div>
              <label style={lbl}>Số CV</label>
              <input placeholder="Nhập số CV" style={inp} />
            </div>
            <div>
              <label style={lbl}>Người ký</label>
              <input placeholder="Nhập người ký" style={inp} />
            </div>
            <div>
              <label style={lbl}>Tên công văn</label>
              <input placeholder="Nhập tên công văn" style={inp} />
            </div>
          </div>

          {/* Row 2: 2 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>Bị án</label>
              <select style={inp}>
                <option value="">Chọn bị án</option>
                <option>Chu Văn An</option>
                <option>Nguyễn Văn A</option>
                <option>Trần Thị B</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Đơn vị nhận</label>
              <input placeholder="Nhập đơn vị nhận" style={inp} />
            </div>
          </div>

          {/* Nội dung công văn */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Nội dung công văn</label>
            <textarea placeholder="Nhập nội dung công văn" style={{ ...inp, minHeight: 88, resize: "vertical" }} />
          </div>

          {/* Nơi nhận table */}
          <QDNoiNhanTable rows={noiNhanRows} setRows={setNoiNhanRows} />

          {/* KẾT QUẢ CÔNG VĂN */}
          <div style={{ color: RED, fontWeight: 700, fontSize: 12, fontFamily: F, margin: "20px 0 14px" }}>KẾT QUẢ CÔNG VĂN</div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Ngày có kết quả</label>
            <div style={{ maxWidth: 220 }}>
              <input type="date" placeholder="Chọn ngày" style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Tải file đính kèm</label>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fafafa" }}>
              <span style={{ fontSize: 20, marginRight: 8 }}>📄</span>
              <span style={{ fontSize: 12, color: TEXT, fontFamily: F, flex: 1 }}>cong_van_xac_minh_01.pdf</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: RED, fontFamily: F, fontWeight: 600 }}>Xem chi tiết</button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
            <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function XacMinhSubTab() {
  const [showTaoCV, setShowTaoCV] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 10px", verticalAlign: "top" };
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };

  const cvRows = [
    { tt: 1, soCV: "124/CV-XM", tenCV: "Công văn xác minh lý lịch",   ngayCV: "15/07/2026", donViNhan: "Công an Tỉnh",       biAn: "Đặng Thìn Dương", ketQua: "Đã có",   ngayKQ: "20/07/2026" },
    { tt: 2, soCV: "125/CV-XM", tenCV: "Công văn xác minh nhân thân", ngayCV: "16/07/2026", donViNhan: "Viện kiểm sát Tỉnh", biAn: "Nguyễn Văn A",   ketQua: "Chưa có", ngayKQ: "21/07/2026" },
  ];
  const thaRows = [
    { stt: 1, biAn: "Đặng Thìn Dương", ketQua: "DA_THI_HANH",   ngay: "25/07/2026", diaDiem: "Trại tạm giam Tỉnh" },
    { stt: 2, biAn: "Nguyễn Văn A",    ketQua: "DA_THI_HANH",   ngay: "26/07/2026", diaDiem: "Trại tạm giam Tỉnh" },
    { stt: 3, biAn: "Trần Thị B",      ketQua: "CHUA_THI_HANH", ngay: "–",          diaDiem: "–" },
  ];

  return (
    <>
      {showTaoCV && <TaoCongVanModal onClose={() => setShowTaoCV(false)} />}
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Bảng công văn xác minh */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Bảng công văn xác minh</span>
          <button onClick={() => setShowTaoCV(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 700 }}>+ Tạo công văn</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 640 }}>
            <colgroup>
              <col style={{ width: 36 }} /><col style={{ width: "10%" }} /><col style={{ width: "20%" }} /><col style={{ width: "11%" }} /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "9%" }} /><col style={{ width: "12%" }} /><col style={{ width: 60 }} />
            </colgroup>
            <thead>
              <tr>{["TT","SỐ CÔNG VĂN","TÊN CÔNG VĂN","NGÀY CÔNG VĂN","ĐƠN VỊ NHẬN","BỊ ÁN","KẾT QUẢ","NGÀY CÓ KẾT QUẢ","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {cvRows.map((r, idx) => (
                <tr key={r.tt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.tt}</td>
                  <td style={TD}>{r.soCV}</td>
                  <td style={TD}>{r.tenCV}</td>
                  <td style={TD}>{r.ngayCV}</td>
                  <td style={TD}>{r.donViNhan}</td>
                  <td style={TD}>{r.biAn}</td>
                  <td style={TD}>
                    <span style={{ color: r.ketQua === "Đã có" ? "#065f46" : "#dc2626", fontWeight: 600, fontSize: 11 }}>{r.ketQua}</span>
                  </td>
                  <td style={TD}>{r.ngayKQ}</td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kết quả Thi hành án */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Kết quả Thi hành án</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "22%" }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col />
          </colgroup>
          <thead>
            <tr>{["STT","BỊ ÁN","KẾT QUẢ THI HÀNH ÁN","NGÀY THI HÀNH ÁN","ĐỊA ĐIỂM THI HÀNH ÁN"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {thaRows.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                <td style={TD}>{r.biAn}</td>
                <td style={{ ...TD, textAlign: "center" }}>
                  {r.ketQua === "DA_THI_HANH"
                    ? <Badge color="#fff" bg={RED}>ĐÃ THI HÀNH</Badge>
                    : <Badge color="#374151" bg="#e5e7eb">CHƯA THI HÀNH</Badge>}
                </td>
                <td style={TD}>{r.ngay}</td>
                <td style={TD}>{r.diaDiem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thông tin lưu hồ sơ án tử hình */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 14 }}>Thông tin lưu hồ sơ án tử hình</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
          <div>
            <label style={lbl}><span style={{ color: RED }}>* </span>Tình trạng hồ sơ</label>
            <select style={inp}><option value="">Chọn tình trạng</option><option>Đang lưu trữ</option><option>Đã chuyển</option></select>
          </div>
          <div>
            <label style={lbl}><span style={{ color: RED }}>* </span>Người chuyển hồ sơ</label>
            <select style={inp}><option value="">Chọn người chuyển</option><option>Nguyễn Văn Hiển</option></select>
          </div>
          <div>
            <label style={lbl}>Người nhận hồ sơ</label>
            <input placeholder="Nhập tên người nhận" style={inp} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
          <div>
            <label style={lbl}>Đơn vị nhận</label>
            <input placeholder="Nhập đơn vị nhận" style={inp} />
          </div>
          <div>
            <label style={lbl}><span style={{ color: RED }}>* </span>Ngày chuyển hồ sơ</label>
            <input placeholder="Chọn ngày" style={inp} type="date" />
          </div>
          <div />
        </div>
        <div>
          <label style={lbl}>Ghi chú</label>
          <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú" maxLength={500} style={{ ...inp, minHeight: 80, resize: "vertical" }} />
          <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F, marginTop: 2 }}>{ghiChu.length} / 500</div>
        </div>
      </div>
    </div>
    </>
  );
}

function HoSoTuHinhDetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const [tab, setTab] = useState<HSDetailTab>("thong-tin");
  const [kqSubTab, setKqSubTab] = useState<KetQuaSubTab>("toa-an");
  const [showQDDrop, setShowQDDrop] = useState(false);
  const [showQDKhangNghi, setShowQDKhangNghi] = useState(false);
  const [showQDKhongKhangNghi, setShowQDKhongKhangNghi] = useState(false);
  const qdDropRef = useRef<HTMLDivElement>(null);
  const hs = HS_LIST.find(h => h.id === id) ?? HS_LIST[0];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (qdDropRef.current && !qdDropRef.current.contains(e.target as Node)) setShowQDDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "11px 12px", verticalAlign: "top" };

  const DETAIL_TABS: Array<{ id: HSDetailTab; label: string }> = [
    { id: "thong-tin",     label: "Thông tin hồ sơ" },
    { id: "danh-sach-don", label: "Danh sách đơn" },
    { id: "phan-cong",     label: "Phân công" },
    { id: "to-trinh",      label: "Tờ trình" },
    { id: "ket-qua",       label: "Kết quả giải quyết" },
    { id: "ho-so-tu-hinh", label: "Hồ sơ tử hình" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {showQDKhangNghi      && <ModalQDKhangNghi      onClose={() => setShowQDKhangNghi(false)} />}
      {showQDKhongKhangNghi && <ModalQDKhongKhangNghi onClose={() => setShowQDKhongKhangNghi(false)} />}
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontFamily: F }}>
          <span style={{ color: "#2563eb", cursor: "pointer" }}>Trang chủ</span>
          <span style={{ color: MUTED }}> / Quản lý án tử hình / Hồ sơ tử hình / </span>
          <strong style={{ color: TEXT }}>Chi tiết hồ sơ</strong>
        </span>
      </div>

      {/* Title */}
      <div style={{ padding: "12px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: TEXT, lineHeight: 1, padding: "0 4px 0 0" }}>←</button>
        <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
          Hồ sơ tử hình – {hs.maVuAn} – ĐẶNG THÌN DƯƠNG
        </span>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, overflowX: "auto" }}>
        <div style={{ display: "flex", minWidth: "max-content" }}>
          {DETAIL_TABS.map(t => {
            const active = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "11px 18px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px", background: BG }}>

        {/* Tab: Thông tin hồ sơ */}
        {tab === "thong-tin" && (
          <>
            <HoSoInfoGrid />
            <div style={{ fontWeight: 700, fontSize: 13, color: RED, marginBottom: 10 }}>BẢNG DANH SÁCH BỊ CÁO</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 40 }} /><col style={{ width: "20%" }} /><col style={{ width: "13%" }} /><col style={{ width: "10%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} /><col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>{["STT","HỌ VÀ TÊN","NGÀY SINH","GIỚI TÍNH","TỘI DANH","HÌNH PHẠT","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    { stt: "01", ten: "Chu Văn An", ngaySinh: "15/08/1982", gioiTinh: "Nam", toiDanh: "Giết người",   hinhPhat: "Tử hình",   tuHinh: true },
                    { stt: "02", ten: "Trần Văn B", ngaySinh: "20/05/1990", gioiTinh: "Nam", toiDanh: "Cướp tài sản", hinhPhat: "20 năm tù", tuHinh: false },
                    { stt: "03", ten: "Lê Thị C",   ngaySinh: "10/11/1985", gioiTinh: "Nữ",  toiDanh: "Đồng phạm",   hinhPhat: "15 năm tù", tuHinh: false },
                  ].map((r, i) => (
                    <tr key={r.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                      <td style={TD}>{r.ten}</td>
                      <td style={TD}>{r.ngaySinh}</td>
                      <td style={TD}>{r.gioiTinh}</td>
                      <td style={{ ...TD, color: r.tuHinh ? "#dc2626" : TEXT }}>{r.toiDanh}</td>
                      <td style={{ ...TD, color: r.tuHinh ? "#dc2626" : TEXT, fontWeight: r.tuHinh ? 600 : 400 }}>{r.hinhPhat}</td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0e7490", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
                          <Eye size={13} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <HSPagination total={3} />
            </div>
          </>
        )}

        {/* Tab: Danh sách đơn */}
        {tab === "danh-sach-don" && (
          <>
            <HoSoInfoGrid />
            <div style={{ fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 10 }}>Danh sách đơn</div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 40 }} /><col style={{ width: "8%" }} /><col style={{ width: "13%" }} /><col style={{ width: "18%" }} /><col style={{ width: "14%" }} /><col style={{ width: "20%" }} /><col style={{ width: "15%" }} /><col style={{ width: 60 }} />
                </colgroup>
                <thead>
                  <tr>{["STT","MÃ ĐƠN","NGÀY NHẬN ĐƠN","NGƯỜI ĐỨNG ĐƠN","PHÂN LOẠI","NỘI DUNG","BỊ ÁN","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    { stt: 1, maDon: "6549", ngayNhan: "09/07/2026", nguoi: "Đứng đơn chín, Đứng đơn chín hai", phanLoai: "Đơn đề nghị GĐT, TT", noiDung: "Đơn xin ân giảm + kêu oan", biAn: "Đặng Thìn Dương" },
                    { stt: 2, maDon: "6564", ngayNhan: "09/07/2026", nguoi: "Đứng đơn chín hai",                phanLoai: "Đơn đề nghị GĐT, TT", noiDung: "Xin thi hành án",             biAn: "Chu Văn An" },
                  ].map((r, i) => (
                    <tr key={r.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                      <td style={TD}>{r.maDon}</td>
                      <td style={TD}>{r.ngayNhan}</td>
                      <td style={TD}>{r.nguoi}</td>
                      <td style={TD}>{r.phanLoai}</td>
                      <td style={TD}>{r.noiDung}</td>
                      <td style={TD}>{r.biAn}</td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                          <Eye size={14} color="#0e7490" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <HSPagination total={2} />
            </div>
          </>
        )}

        {/* Tab: Kết quả giải quyết */}
        {tab === "ket-qua" && (
          <>
            <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 4, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden", flexWrap: "wrap" }}>
              {(["toa-an","vks","ctn","xac-minh"] as KetQuaSubTab[]).map((st, i) => {
                const labels: Record<KetQuaSubTab, string> = { "toa-an": "Thông tin Tòa án", "vks": "Thông tin VKS", "ctn": "Thông tin trình CTN", "xac-minh": "Thông tin xác minh" };
                const active = kqSubTab === st;
                return (
                  <button key={st} onClick={() => setKqSubTab(st)} style={{ padding: "9px 18px", fontSize: 12, fontFamily: F, fontWeight: active ? 600 : 400, background: active ? "#fff8f8" : "#fff", border: "none", borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", borderRight: i < 3 ? `1px solid ${BORDER}` : "none", cursor: "pointer", color: active ? RED : TEXT, whiteSpace: "nowrap" }}>
                    {labels[st]}
                  </button>
                );
              })}
            </div>

            {kqSubTab === "toa-an" && (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <FileText size={15} color={RED} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Quyết định của chánh án</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                      <input placeholder="Nhập từ khóa tìm kiếm..." style={{ padding: "6px 10px", fontSize: 12, border: "none", outline: "none", fontFamily: F, width: 200 }} />
                      <button style={{ padding: "6px 10px", background: RED, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Search size={13} color="#fff" />
                      </button>
                    </div>
                    <div ref={qdDropRef} style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowQDDrop(v => !v)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, whiteSpace: "nowrap" }}
                      >
                        <Users size={13} /> Tạo quyết định <ChevronDown size={12} />
                      </button>
                      {showQDDrop && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 220, overflow: "hidden" }}>
                          <button
                            onClick={() => { setShowQDDrop(false); setShowQDKhangNghi(true); }}
                            style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            Quyết định kháng nghị
                          </button>
                          <button
                            onClick={() => { setShowQDDrop(false); setShowQDKhongKhangNghi(true); }}
                            style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            Quyết định không kháng nghị
                          </button>
                        </div>
                      )}
                    </div>
                    <button style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <RefreshCw size={13} color={MUTED} />
                    </button>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 36 }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: "16%" }} /><col style={{ width: 72 }} />
                  </colgroup>
                  <thead>
                    <tr>{["TT","TÊN QUYẾT ĐỊNH","SỐ QĐ","NGÀY RA QĐ","NGƯỜI KÝ","TRẠNG THÁI","NGƯỜI TẠO","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
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
                        <div style={{ fontSize: 12, color: TEXT }}>Dương Văn Hải</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>28/07/2026 09:29:14</div>
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={14} color="#0e7490" /></button>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Tải xuống">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.333 1.333 0 0 1 2 12.667V10M5.333 6.667 8 9.333m0 0 2.667-2.666M8 9.333V2" stroke="#9CA3AF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Tổng 1 quyết định vụ án</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{"<"}</button>
                    <button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 12 }}>1</button>
                    <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, opacity: 0.5 }}>{">"}</button>
                  </div>
                </div>
              </div>
            )}

            {kqSubTab === "vks"       && <VKSSubTab />}
            {kqSubTab === "ctn"       && <CTNSubTab />}
            {kqSubTab === "xac-minh" && <XacMinhSubTab />}
          </>
        )}

        {tab === "phan-cong" && <HSTHTabPhanCong />}
        {tab === "to-trinh"  && <HSTHTabToTrinh />}
        {tab === "ho-so-tu-hinh" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: MUTED, fontSize: 14, fontFamily: F }}>
            <FileText size={36} color="#e5e7eb" style={{ marginRight: 12 }} />
            Hồ sơ tử hình – Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
}

export default function HoSoTuHinhView() {
  const [detail, setDetail] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(true);

  if (detail) {
    return <HoSoTuHinhDetailView id={detail} onBack={() => setDetail(null)} />;
  }

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "11px 12px", verticalAlign: "top" };
  const inSt: React.CSSProperties = {
    width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`,
    borderRadius: 4, fontFamily: F, outline: "none", background: "#fff", boxSizing: "border-box", color: TEXT,
  };
  const lblSt: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontFamily: F }}>
          <span style={{ color: "#2563eb", cursor: "pointer" }}>Trang chủ</span>
          <span style={{ color: MUTED }}> / Quản lý án tử hình / </span>
          <strong style={{ color: TEXT }}>Hồ sơ tử hình</strong>
        </span>
      </div>

      {/* Filter panel */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, padding: "14px 20px 10px" }}>
        {filterOpen && (
          <>
            {/* Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 14px", marginBottom: 10 }}>
              <div>
                <label style={lblSt}>Số BA/QĐ</label>
                <input placeholder="Nhập số BA/QĐ" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Ngày BA/QĐ</label>
                <div style={{ position: "relative" }}>
                  <input placeholder="dd/mm/yyyy" style={{ ...inSt, paddingRight: 28 }} />
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: MUTED, fontSize: 13, pointerEvents: "none" }}>📅</span>
                </div>
              </div>
              <div>
                <label style={lblSt}>Tòa ra BA/QĐ</label>
                <select style={inSt}>
                  <option value="">Vui lòng chọn</option>
                  <option>Tòa án nhân dân tỉnh Long An</option>
                  <option>Tòa án nhân dân cấp cao tại TP.HCM</option>
                  <option>Tòa án nhân dân cấp cao tại Hà Nội</option>
                  <option>Tòa án nhân dân tối cao</option>
                </select>
              </div>
              <div>
                <label style={lblSt}>Tình trạng giải quyết GĐT,TT</label>
                <select style={inSt}>
                  <option value="">Vui lòng chọn</option>
                  <option value="dang-giai-quyet">Đang giải quyết GĐT/TT</option>
                  <option value="dang-xet-xu">Đang xét xử GĐT,TT</option>
                  <option value="da-giai-quyet">Đã giải quyết xong GĐT/TT</option>
                </select>
              </div>
            </div>
            {/* Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px 14px", marginBottom: 10 }}>
              <div>
                <label style={lblSt}>Bị án</label>
                <input placeholder="Họ tên bị án" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Thẩm tra viên</label>
                <input placeholder="Chọn thẩm tra viên" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Thẩm phán</label>
                <input placeholder="Chọn thẩm phán" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Lãnh đạo</label>
                <input placeholder="Chọn lãnh đạo" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Trạng thái thụ lý</label>
                <select style={inSt}>
                  <option value="">Vui lòng chọn</option>
                  <option value="da-thu-ly">Đã thụ lý</option>
                  <option value="chua-thu-ly">Chưa thụ lý</option>
                </select>
              </div>
            </div>
          </>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setFilterOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
            {filterOpen ? "∧ Thu gọn" : "∨ Mở rộng"}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
              <Search size={13} /> Tìm kiếm
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", background: BG, padding: "12px 16px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 800 }}>
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: 64 }} />
              </colgroup>
              <thead>
                <tr>{["STT","THÔNG TIN BA/QĐ","THÔNG TIN VỤ ÁN","SỐ LƯỢNG BỊ ÁN TỬ HÌNH","PHÂN CÔNG","TÌNH TRẠNG GIẢI QUYẾT","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {HS_LIST.map((r, idx) => (
                  <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderTop: idx > 0 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                    <td style={TD}>
                      <div style={{ lineHeight: 1.7 }}>
                        <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><strong>{r.soBA}</strong></div>
                        <div><span style={{ color: MUTED }}>Ngày BA/QĐ: </span>{r.ngayBA}</div>
                        <div><span style={{ color: MUTED }}>Tòa ra BA/QĐ: </span>{r.toa}</div>
                        <div><span style={{ color: MUTED }}>Giai đoạn: </span>{r.giaiDoan}</div>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ lineHeight: 1.7 }}>
                        <div><span style={{ color: MUTED }}>Tên vụ án: </span>{r.tenVuAn}</div>
                        <div><span style={{ color: MUTED }}>Mã vụ án: </span><span style={{ color: "#2563eb" }}>{r.maVuAn}</span></div>
                        {r.vuAnBadge && (
                          <div style={{ marginTop: 4 }}>
                            <Badge color="#fff" bg="#dc2626">{r.vuAnBadge}</Badge>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign: "center", fontWeight: 600 }}>{r.soBiAn}</td>
                    <td style={TD}>
                      <div style={{ lineHeight: 1.7, fontSize: 12 }}>
                        <div><span style={{ color: MUTED }}>TTV: </span>{PHAN_CONG_HS.ttv}</div>
                        <div><span style={{ color: MUTED }}>TP: </span>{PHAN_CONG_HS.tp}</div>
                        <div><span style={{ color: MUTED }}>LĐ: </span>{PHAN_CONG_HS.ld}</div>
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <HSTrangThaiChip status={r.trangThai} />
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button onClick={() => setDetail(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                        <Eye size={15} color="#0e7490" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <HSPagination total={4} />
        </div>
      </div>
    </div>
  );
}
