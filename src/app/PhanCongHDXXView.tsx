import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, MoreVertical, ChevronDown, ChevronUp, X, Eye, Users, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";

// ── Data ──────────────────────────────────────────────────────────────────────

type HDXXRow = {
  id: number;
  soDS: string;
  ngayDS: string;
  thuLyList: { so: string; ngay: string }[];
  soVuLink: number;
  hdxx: string;
  hdxxSub: string;
  trangThaiXX: "chua-xx" | "da-xx" | "chua-phan-cong";
  trangThaiSub: string;
  trangThaiExtra?: string;
};

const ROWS: HDXXRow[] = [
  {
    id: 1, soDS: "54681978", ngayDS: "10/07/2026",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
      { so: "54682426", ngay: "20/07/2026" },
    ],
    soVuLink: 3, hdxx: "Hội đồng 5 thẩm phán", hdxxSub: "Chờ ký",
    trangThaiXX: "chua-xx", trangThaiSub: "Chưa lên lịch xét xử",
  },
  {
    id: 2, soDS: "54681923", ngayDS: "09/07/2026",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
    ],
    soVuLink: 2, hdxx: "Hội đồng 5 thẩm phán", hdxxSub: "Đã có hiệu lực",
    trangThaiXX: "chua-xx", trangThaiSub: "Đã lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 19 ngày",
  },
  {
    id: 3, soDS: "54681922", ngayDS: "08/07/2026",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
      { so: "54682426", ngay: "20/07/2026" },
    ],
    soVuLink: 3, hdxx: "–", hdxxSub: "",
    trangThaiXX: "chua-phan-cong", trangThaiSub: "",
  },
  {
    id: 4, soDS: "54681813", ngayDS: "09/07/2026",
    thuLyList: [{ so: "54682424", ngay: "20/07/2026" }],
    soVuLink: 1, hdxx: "Hội đồng toàn thể thẩm phán", hdxxSub: "Đã có hiệu lực",
    trangThaiXX: "da-xx", trangThaiSub: "Đã rút kháng nghị",
    trangThaiExtra: "Số GĐ: 54681878/2026/QĐ-CA\nNgày QĐ: 09/07/2026",
  },
  {
    id: 5, soDS: "54681978", ngayDS: "10/07/2026",
    thuLyList: [{ so: "54682424", ngay: "20/07/2026" }],
    soVuLink: 1, hdxx: "Hội đồng 5 thẩm phán", hdxxSub: "Chưa có hiệu lực",
    trangThaiXX: "chua-xx", trangThaiSub: "Hoàn xét xử",
  },
];

const HDXX_MEMBERS: Record<number, { vai: string; ho: string; chucVu: string }[]> = {
  1: [
    { vai: "Chủ tọa",       ho: "Nguyễn Văn Minh",  chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán",     ho: "Trần Thị Lan",      chucVu: "Thẩm phán" },
    { vai: "Thẩm phán",     ho: "Lê Hoàng Nam",      chucVu: "Thẩm phán" },
    { vai: "Thẩm phán",     ho: "Phạm Thị Hoa",      chucVu: "Thẩm phán" },
    { vai: "Thẩm phán",     ho: "Đỗ Quang Hùng",     chucVu: "Thẩm phán" },
    { vai: "Thư ký",        ho: "Nguyễn Thu Hằng",   chucVu: "Thư ký tòa án" },
  ],
  2: [
    { vai: "Chủ tọa",   ho: "Vũ Đình Tuấn",    chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán", ho: "Bùi Thị Mai",     chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Cao Văn Thắng",   chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Đinh Hữu Đức",    chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Hoàng Thị Yến",   chucVu: "Thẩm phán" },
    { vai: "Thư ký",    ho: "Lý Văn An",       chucVu: "Thư ký tòa án" },
  ],
  4: [
    { vai: "Chủ tọa",   ho: "Nguyễn Đức Long",   chucVu: "Thẩm phán TAND Tối cao" },
    { vai: "Thẩm phán", ho: "Trần Văn Bình",      chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Lê Thị Cúc",         chucVu: "Thẩm phán" },
  ],
  5: [
    { vai: "Chủ tọa",   ho: "Phạm Quốc Anh",   chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán", ho: "Ngô Thị Dung",     chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Lưu Văn Hải",      chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Trịnh Hữu Lộc",    chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Bùi Ngọc Hà",      chucVu: "Thẩm phán" },
    { vai: "Thư ký",    ho: "Hoàng Văn Toàn",   chucVu: "Thư ký tòa án" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function TrangThaiBadge({ type }: { type: HDXXRow["trangThaiXX"] }) {
  if (type === "chua-phan-cong")
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, background: "#fee2e2", color: RED, border: `1px solid ${RED}` }}>Chưa phân công HĐXX</span>;
  if (type === "da-xx")
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, background: "#f3f4f6", color: "#374151" }}>Đã xét xử</span>;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, background: "#dcfce7", color: "#15803d" }}>Chưa xét xử</span>;
}

// ── Số vụ xét xử modal ────────────────────────────────────────────────────────

function SoVuModal({ row, onClose }: { row: HDXXRow; onClose: () => void }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 680, maxWidth: "95vw", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách vụ xét xử – DS số {row.soDS}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["STT", "Số thụ lý", "Ngày thụ lý", "Bị cáo/Đương sự", "Loại án", "Trạng thái"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.thuLyList.map((tl, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{i + 1}</td>
                  <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{tl.so}</td>
                  <td style={TD}>{tl.ngay}</td>
                  <td style={TD}>{["Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Nam"][i % 3]}</td>
                  <td style={TD}>{["Hình sự", "Dân sự", "Hình sự"][i % 3]}</td>
                  <td style={TD}><Badge color="#1e40af" bg="#dbeafe">Đang xét xử</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

// ── 3-dot context menu ────────────────────────────────────────────────────────

function ContextMenu({ row, onClose, onXem, onPhanCong, onLichXX }: {
  row: HDXXRow;
  onClose: () => void;
  onXem: () => void;
  onPhanCong: () => void;
  onLichXX: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const item = (label: string, color: string, onClick: () => void) => (
    <button onClick={() => { onClick(); onClose(); }}
      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: F, color, whiteSpace: "nowrap" }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
    >{label}</button>
  );

  return (
    <div ref={ref} style={{ position: "absolute", right: 0, top: "100%", zIndex: 200, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 190, overflow: "hidden" }}>
      {item("👁 Xem chi tiết", TEXT, onXem)}
      {row.trangThaiXX === "chua-phan-cong" && item("👥 Phân công HĐXX", TEXT, onPhanCong)}
      {row.trangThaiXX !== "chua-phan-cong" && item("📋 Thông tin phân công HĐXX", TEXT, onPhanCong)}
      {item("📅 Lịch xét xử", TEXT, onLichXX)}
      {row.trangThaiXX !== "da-xx" && item("✏ Chỉnh sửa", TEXT, onXem)}
      {row.trangThaiXX !== "da-xx" && item("🗑 Xóa", "#ef4444", onClose)}
    </div>
  );
}

// ── HĐXX Detail view ──────────────────────────────────────────────────────────

const ALL_JUDGES = [
  { name: "Nguyễn Văn Quảng",  chuc: "Chánh án" },
  { name: "Nguyễn Biên Thùy",  chuc: "Phó Chánh án" },
  { name: "Nguyễn Hải Trâm",   chuc: "Phó Chánh án" },
  { name: "Lê Tiến",           chuc: "Phó Chánh án" },
  { name: "Phạm Quốc Hưng",    chuc: "Phó Chánh án" },
  { name: "Nguyễn Văn Tiến",   chuc: "Phó Chánh án" },
];

const QD_ROWS = [
  { id: 1, soQD: "2442/2026/QĐ-TANDTC", ngayQD: "16/07/2026", tenBM: "Quyết định thành lập Hội đồng xét xử", nguoiKy: "Nguyễn Biên Thùy", trangThai: "Đã có hiệu lực" },
  { id: 2, soQD: "2441/2026/QĐ-TANDTC", ngayQD: "16/07/2026", tenBM: "Quyết định thành lập Hội đồng xét xử", nguoiKy: "Nguyễn Biên Thùy", trangThai: "Đã hủy" },
];

// ── Lịch xét xử modal ────────────────────────────────────────────────────────

type CalEvent = { label: string; color: string; bg: string; loai: "GĐT/TT" | "ST" | "PT" };
const LOAI_STYLE: Record<"GĐT/TT" | "ST" | "PT", { color: string; bg: string }> = {
  "GĐT/TT": { color: "#991b1b", bg: "#fee2e2" },
  "ST":      { color: "#1e40af", bg: "#dbeafe" },
  "PT":      { color: "#92400e", bg: "#fef3c7" },
};
const INIT_EVENTS: Record<string, CalEvent[]> = {
  "2026-04-01": [{ label: "Xét xử vụ án gi...", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Lịch hồ sơ khác...", color: "#92400e", bg: "#fef3c7", loai: "PT" }],
  "2026-04-05": [{ label: "Xét xử vụ án gi...", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Lịch hồ sơ khác...", color: "#92400e", bg: "#fef3c7", loai: "PT" }],
  "2026-04-09": [{ label: "Lịch xét xử ch...", color: "#1e40af", bg: "#dbeafe", loai: "ST" }],
  "2026-04-14": [{ label: "SGS", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }],
  "2026-04-15": [{ label: "test", color: "#166534", bg: "#dcfce7", loai: "ST" }],
  "2026-04-17": [{ label: "Phiên của vụ k...", color: "#166534", bg: "#dcfce7", loai: "ST" }],
  "2026-04-20": [{ label: "test", color: "#9d174d", bg: "#fce7f3", loai: "PT" }],
  "2026-04-22": [{ label: "OO1TT", color: "#1e40af", bg: "#dbeafe", loai: "GĐT/TT" }],
  "2026-04-24": [{ label: "12591", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Hồ sơ khác...", color: "#9d174d", bg: "#fce7f3", loai: "PT" }],
  "2026-04-30": [{ label: "OO1TT", color: "#1e40af", bg: "#dbeafe", loai: "GĐT/TT" }, { label: "Chang test", color: "#166534", bg: "#dcfce7", loai: "ST" }],
};

const MINI_CAL_DAYS = (() => {
  // April 2026: starts Thursday (day 4), 30 days
  const days: (number | null)[] = [];
  for (let i = 0; i < 3; i++) days.push(null); // Mon=0, Tue=1, Wed=2 empty, Thu=3 is Apr1
  for (let d = 1; d <= 30; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
})();

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Build full calendar grid for April 2026
const FULL_CAL_ROWS = (() => {
  const rows: (number | null)[][] = [];
  let row: (number | null)[] = [null, null, null]; // Mon-Wed empty before Apr 1 (Thu)
  for (let d = 1; d <= 30; d++) {
    row.push(d);
    if (row.length === 7) { rows.push(row); row = []; }
  }
  while (row.length < 7) row.push(null);
  if (row.some(x => x !== null)) rows.push(row);
  return rows;
})();

function LichXetXuModal({ onClose }: { onClose: () => void }) {
  const [calView, setCalView] = useState<"thang" | "tuan" | "ngay">("thang");
  const [events, setEvents] = useState<Record<string, CalEvent[]>>(INIT_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [successDay, setSuccessDay] = useState<number | null>(null);

  // popup form state
  const [fTitle, setFTitle] = useState("");
  const [fGioFrom, setFGioFrom] = useState("00:00");
  const [fGioTo, setFGioTo] = useState("01:00");
  const [fCalNgay, setFCalNgay] = useState(false);
  const [fSoDS, setFSoDS] = useState("");
  const [fNgayTao, setFNgayTao] = useState("18/03/2026");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fNguoiNhan, setFNguoiNhan] = useState("");

  const today = 17;
  const dateKey = (d: number | null) => d ? `2026-04-${String(d).padStart(2, "0")}` : "";

  const buildEvent = (): CalEvent | null => {
    if (!selectedDay) return null;
    const loai: CalEvent["loai"] =
      fHinhThuc === "Sơ thẩm" ? "ST" : fHinhThuc === "Phúc thẩm" ? "PT" : "GĐT/TT";
    const st = LOAI_STYLE[loai];
    return { label: fTitle || `Lịch ${loai}`, color: st.color, bg: st.bg, loai };
  };

  const handleTaoMoi = () => {
    const ev = buildEvent();
    if (!ev || !selectedDay) return;
    const key = dateKey(selectedDay);
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), ev] }));
    // reset form but keep popup open for another entry
    setFTitle(""); setFSoDS(""); setFHinhThuc(""); setFNguoiNhan(""); setFGioFrom("00:00"); setFGioTo("01:00");
  };

  const handleLuu = () => {
    const ev = buildEvent();
    if (!ev || !selectedDay) return;
    const key = dateKey(selectedDay);
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), ev] }));
    setSuccessDay(selectedDay);
    setSelectedDay(null);
    setFTitle(""); setFSoDS(""); setFHinhThuc(""); setFNguoiNhan("");
  };

  // render a single calendar cell
  const renderCell = (d: number | null, ci: number, dimmed = false) => {
    const key = dateKey(d);
    const dayEvs = d ? (events[key] || []) : [];
    const isToday = d === today;
    const isEmpty = dayEvs.length === 0;
    const isSuccess = d === successDay;
    const isSun = ci === 6;
    return (
      <td key={`${ci}-${d ?? "x"}`}
        onClick={() => { if (d && isEmpty) { setSelectedDay(d); setSuccessDay(null); } }}
        style={{
          padding: "6px 8px",
          borderRight: ci < 6 ? `1px solid ${BORDER}` : "none",
          borderBottom: `1px solid ${BORDER}`,
          verticalAlign: "top" as const,
          background: dimmed ? "#f9fafb" : isSuccess ? "#f0fdf4" : isSun && d ? "#fef9f9" : d ? "#fff" : "#f9fafb",
          cursor: d && isEmpty ? "pointer" : "default",
          minHeight: 90,
        }}>
        {d && (
          <>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: "50%",
              background: isToday ? RED : "none",
              color: dimmed ? "#d1d5db" : isToday ? "#fff" : TEXT,
              fontSize: 12, fontWeight: isToday ? 700 : 400,
            }}>{String(d).padStart(2, "0")}</span>
            {isSuccess && (
              <div style={{ fontSize: 9, color: "#16a34a", fontWeight: 700, marginBottom: 1 }}>✓ Đã thêm lịch</div>
            )}
            {dayEvs.map((ev, ei) => (
              <div key={ei} style={{
                marginTop: 2, padding: "2px 5px", borderRadius: 3,
                background: ev.bg, color: ev.color,
                fontSize: 10, fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 800, flexShrink: 0,
                  background: LOAI_STYLE[ev.loai].color, color: "#fff",
                  borderRadius: 2, padding: "0 3px", lineHeight: "14px",
                }}>{ev.loai}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{ev.label}</span>
              </div>
            ))}
          </>
        )}
      </td>
    );
  };

  const inp: React.CSSProperties = { width: "100%", padding: "7px 10px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box" as const, background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 };
  const req = <span style={{ color: RED }}> *</span>;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 1060, maxHeight: "92vh", display: "flex", flexDirection: "column" as const, boxShadow: "0 12px 48px rgba(0,0,0,0.2)", overflow: "hidden", fontFamily: F }}>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Left sidebar ── */}
          <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${BORDER}`, padding: "16px 14px", display: "flex", flexDirection: "column" as const, gap: 14, overflowY: "auto" as const }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Lịch xét xử</div>
              <span style={{ display: "inline-block", marginTop: 4, background: "#dbeafe", color: "#1d4ed8", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 8px" }}>
                {Object.values(events).flat().length} lịch
              </span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: "uppercase" as const }}>Bộ lọc lịch</div>
              <p style={{ fontSize: 11, color: MUTED, marginBottom: 10, lineHeight: 1.5 }}>Chọn năm, tháng để rà soát các phiên đã tạo</p>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: MUTED, display: "block", marginBottom: 3 }}>Năm</label>
                  <input defaultValue="2026" style={{ width: "100%", padding: "4px 6px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: MUTED, display: "block", marginBottom: 3 }}>Tháng</label>
                  <input defaultValue="Tháng 4" style={{ width: "100%", padding: "4px 6px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F }} />
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Tháng 4/2026</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>{["T2","T3","T4","T5","T6","T7","CN"].map(d => (
                    <th key={d} style={{ fontSize: 9, color: MUTED, fontWeight: 600, textAlign: "center" as const, padding: "2px 0" }}>{d}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(MINI_CAL_DAYS.length / 7) }, (_, ri) => (
                    <tr key={ri}>
                      {MINI_CAL_DAYS.slice(ri * 7, ri * 7 + 7).map((d, ci) => (
                        <td key={ci} style={{ textAlign: "center" as const, padding: "2px 0" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 20, height: 20, borderRadius: "50%", fontSize: 10,
                            fontWeight: d === today ? 700 : 400,
                            background: d === today ? RED : "none",
                            color: d === today ? "#fff" : d ? TEXT : "transparent",
                            cursor: d ? "pointer" : "default",
                          }}>{d ?? ""}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Tổng số lịch xét xử</div>
              {([["GĐT/TT", "Giám đốc thẩm / Tái thẩm"], ["ST", "Sơ thẩm"], ["PT", "Phúc thẩm"]] as const).map(([k, label]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11, color: TEXT }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: LOAI_STYLE[k].color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Calendar ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
              <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                {["Hôm nay", "Trước", "Tiếp"].map((lbl2, i) => (
                  <button key={lbl2} style={{ padding: "5px 12px", background: "#fff", border: "none", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>{lbl2}</button>
                ))}
              </div>
              <div style={{ flex: 1, textAlign: "center" as const, fontSize: 14, fontWeight: 700, color: TEXT }}>Tháng 4 Năm 2026</div>
              <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                {(["thang", "tuan", "ngay"] as const).map((v, i) => {
                  const vlbl = v === "thang" ? "Tháng" : v === "tuan" ? "Tuần" : "Ngày";
                  return (
                    <button key={v} onClick={() => setCalView(v)} style={{ padding: "5px 14px", background: calView === v ? RED : "#fff", color: calView === v ? "#fff" : TEXT, border: "none", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: calView === v ? 700 : 400 }}>{vlbl}</button>
                  );
                })}
              </div>
              <span style={{ fontSize: 11, color: MUTED }}>Click ô trống để thêm lịch</span>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: "auto" as const }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" as const }}>
                <thead>
                  <tr>
                    {WEEK_DAYS.map(d => (
                      <th key={d} style={{ padding: "8px 0", fontSize: 12, fontWeight: 600, color: MUTED, textAlign: "center" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, background: BG }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Leading row: Mar 30, 31 + Apr 1–5 */}
                  <tr style={{ height: 90 }}>
                    {renderCell(30, 0, true)}
                    {renderCell(31, 1, true)}
                    {renderCell(1, 2)}
                    {renderCell(2, 3)}
                    {renderCell(3, 4)}
                    {renderCell(4, 5)}
                    {renderCell(5, 6)}
                  </tr>
                  {FULL_CAL_ROWS.map((row, ri) => (
                    <tr key={ri} style={{ height: 90 }}>
                      {row.map((d, ci) => renderCell(d, ci))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Thêm lịch xét xử popup (matching image-11) ── */}
      {selectedDay !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setSelectedDay(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 8, width: 520, boxShadow: "0 8px 48px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: F }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Thêm lịch xét xử</span>
              <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}><X size={18} /></button>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
              {/* Tiêu đề */}
              <div>
                <label style={lbl}>Tiêu đề{req}</label>
                <input value={fTitle} onChange={e => setFTitle(e.target.value)}
                  placeholder="Nhập tiêu đề lịch xét xử" style={inp} />
              </div>

              {/* Ngày + Giờ + Cả ngày */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                <div style={{ flex: "0 0 160px" }}>
                  <label style={lbl}>Ngày xét xử{req}</label>
                  <input readOnly value={`${String(selectedDay).padStart(2,"0")}/04/2026`}
                    style={{ ...inp, background: "#f9fafb", color: TEXT }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Giờ xét xử{req}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input value={fGioFrom} onChange={e => setFGioFrom(e.target.value)}
                      style={{ ...inp, width: 72 }} />
                    <span style={{ color: MUTED, fontSize: 13 }}>→</span>
                    <input value={fGioTo} onChange={e => setFGioTo(e.target.value)}
                      style={{ ...inp, width: 72 }} />
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: TEXT, cursor: "pointer", paddingBottom: 8, whiteSpace: "nowrap" as const }}>
                  <input type="checkbox" checked={fCalNgay} onChange={e => setFCalNgay(e.target.checked)} style={{ width: 14, height: 14 }} />
                  Cả ngày
                </label>
              </div>

              {/* Section header */}
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginTop: 2 }}>Thông tin vụ án</div>

              {/* Số DS + Ngày tạo */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Số danh sách{req}</label>
                  <input value={fSoDS} onChange={e => setFSoDS(e.target.value)}
                    placeholder="Số danh sách (Số tạo danh sách vụ xét xử GĐT)"
                    style={inp} />
                </div>
                <div style={{ flex: "0 0 160px" }}>
                  <label style={lbl}>Ngày tạo danh sách{req}</label>
                  <input value={fNgayTao} onChange={e => setFNgayTao(e.target.value)}
                    style={inp} />
                </div>
              </div>

              {/* Hình thức + Người nhận */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Hình thức xét xử{req}</label>
                  <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)}
                    style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                    <option value="">Chọn hình thức</option>
                    <option value="Giám đốc thẩm/Tái thẩm">Giám đốc thẩm/Tái thẩm (GĐT/TT)</option>
                    <option value="Sơ thẩm">Sơ thẩm (ST)</option>
                    <option value="Phúc thẩm">Phúc thẩm (PT)</option>
                    <option value="Trực tiếp">Trực tiếp</option>
                    <option value="Trực tuyến">Trực tuyến</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Người nhận thông báo</label>
                  <select value={fNguoiNhan} onChange={e => setFNguoiNhan(e.target.value)}
                    style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                    <option value="">Chọn người nhận</option>
                    <option>Nguyễn Văn Minh</option>
                    <option>Trần Thị Lan</option>
                    <option>Lê Hoàng Nam</option>
                    <option>Toàn bộ HĐXX</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setSelectedDay(null)}
                style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                Đóng
              </button>
              <button onClick={handleTaoMoi}
                style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                Tạo mới
              </button>
              <button onClick={handleLuu}
                style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HDXXDetailView({ row, onBack }: { row: HDXXRow; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"thong-tin" | "phan-cong">("thong-tin");
  const [showLichXX, setShowLichXX] = useState(false);
  const [hoiDong, setHoiDong] = useState<"tt" | "5">("tt");
  const [chuToa, setChuToa]   = useState("Phạm Thị Bích Ngọc");
  const [judgeSearch, setJudgeSearch]    = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(["Phạm Thị Bích Ngọc"]);

  const filteredAll      = ALL_JUDGES.filter(j => j.name.toLowerCase().includes(judgeSearch.toLowerCase()) && !selected.includes(j.name));
  const filteredSelected = ALL_JUDGES.filter(j => selected.includes(j.name) && j.name.toLowerCase().includes(selectedSearch.toLowerCase()));

  const addJudge    = (name: string) => setSelected(p => [...p, name]);
  const removeJudge = (name: string) => setSelected(p => p.filter(n => n !== name));

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "middle" };
  const inSt: React.CSSProperties = { width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box", background: "#fff" };
  const infoCell = (label: string, value: string) => (
    <>
      <td style={{ padding: "12px 16px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, whiteSpace: "nowrap", width: "18%" }}>{label}</td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}`, fontWeight: 500 }}>{value}</td>
    </>
  );

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    padding: "9px 20px",
    fontSize: 13,
    fontFamily: F,
    fontWeight: active ? 700 : 400,
    color: active ? RED : MUTED,
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 0.15s",
  });

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb" }}>
      {showLichXX && <LichXetXuModal onClose={() => setShowLichXX(false)} />}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 8 }}>
          Trang chủ / Quản lý án GĐT/TT / Phân công HĐXX / <span style={{ color: TEXT }}>Chi tiết phân công</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontSize: 14 }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Phân công hội đồng xét xử</h1>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, gap: 4 }}>
          <button style={TAB_STYLE(activeTab === "thong-tin")} onClick={() => setActiveTab("thong-tin")}>
            Thông tin Danh sách xét xử
          </button>
          <button style={TAB_STYLE(activeTab === "phan-cong")} onClick={() => setActiveTab("phan-cong")}>
            Phân công Hội đồng xét xử
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Tab 1: Thông tin Danh sách xét xử ── */}
        {activeTab === "thong-tin" && <>
          {/* Info summary */}
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}` }}>
            <tbody>
              <tr>
                {infoCell("Số – Ngày lập danh sách", `Số – ${row.ngayDS}`)}
                {infoCell("Trạng thái", row.trangThaiXX === "da-xx" ? "Đã xét xử" : "Chưa xét xử")}
              </tr>
              <tr>
                {infoCell("Tòa án giải quyết", "Tòa án xét xử GĐT, TT")}
                {infoCell("Viện kiểm sát giải quyết", "VKS xét xử GĐT, TT")}
              </tr>
              <tr>
                {infoCell("Thành phần HĐXX", selected.join(", "))}
                {infoCell("Chủ tọa", chuToa)}
              </tr>
            </tbody>
          </table>

          {/* Danh sách xét xử table */}
          <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: 36 }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: 48 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}><input type="checkbox" style={{ accentColor: RED }} /></th>
                  {["STT","Số & Ngày thụ lý XX","Thông tin bản án/ quyết định & QHPL","Đương sự/ Người tham gia tố tụng","Phân công","Trạng thái","Thao tác"].map(h => (
                    <th key={h} style={{ ...TH_STYLE, fontSize: 11, padding: "9px 12px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 1,
                    so: "54681978", ngay: "10/07/2026",
                    capXX: "Sơ thẩm", soBA: "HS-ST020", ngayBA: "09/07/2026", toaAn: "Tòa án nhân dân huyện Phong Điền",
                    nguoiKN: "Trần Văn Hải", biCao: "Trần Văn Hải", ndd: "Nguyễn Đơn Hải",
                    ttv: "Trịnh Thị Minh Trang", ldv: "Lê Thị Thu Hiền", tp: "Phạm Thị Bích Ngọc",
                    trangThai: "Chưa xét xử", sub: "Chưa lên lịch xét xử", extra: "",
                  },
                  {
                    id: 2,
                    so: "54681923", ngay: "09/07/2026",
                    capXX: "Sơ thẩm", soBA: "214213HH", ngayBA: "09/07/2026", toaAn: "Tòa án nhân dân cấp cao",
                    nguoiKN: "ooo", biCao: "bbb", ndd: "Ô tô kê",
                    ttv: "Võ Thị Thùy Giang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiền",
                    trangThai: "Chưa xét xử", sub: "Chưa lên lịch xét xử", extra: "Thời hạn xét xử: 19 ngày",
                  },
                  {
                    id: 3,
                    so: "54681748", ngay: "08/07/2026",
                    capXX: "Sơ thẩm", soBA: "HS-ST016", ngayBA: "08/07/2026", toaAn: "Tòa án nhân dân huyện Cờ Đỏ",
                    nguoiKN: "Nguyễn Quốc Huy", biCao: "Nguyễn Quốc Huy", ndd: "Lâm Gia Bảo",
                    ttv: "Vũ Diệu Thúy", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Như Thắng",
                    trangThai: "Chưa xét xử", sub: "Chưa lên lịch xét xử", extra: "",
                  },
                ].map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", verticalAlign: "top" }}>
                    <td style={{ padding: "12px", textAlign: "center" }}><input type="checkbox" style={{ accentColor: RED }} /></td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", textAlign: "center", color: MUTED, verticalAlign: "top" }}>{r.id}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>Số: {r.so}</div>
                      <div style={{ color: MUTED, fontFamily: F, marginTop: 2 }}>Ngày: {r.ngay}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", verticalAlign: "top" }}>
                      <div style={{ color: RED, fontFamily: F, fontWeight: 600, marginBottom: 3 }}>Cấp xét xử: <span style={{ fontWeight: 400 }}>{r.capXX}</span></div>
                      <div style={{ fontFamily: F, color: TEXT }}>Số BA: {r.soBA}</div>
                      <div style={{ fontFamily: F, color: TEXT }}>Ngày: {r.ngayBA}</div>
                      <div style={{ fontFamily: F, color: MUTED, marginTop: 2 }}>Tại: {r.toaAn}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", verticalAlign: "top" }}>
                      <div style={{ fontFamily: F }}><strong>Người khiếu nại:</strong> {r.nguoiKN}</div>
                      <div style={{ fontFamily: F }}><strong>Bị cáo:</strong> {r.biCao}</div>
                      <div style={{ fontFamily: F }}><strong>NĐD:</strong> {r.ndd}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", verticalAlign: "top" }}>
                      <div style={{ fontFamily: F }}>TTV: {r.ttv}</div>
                      <div style={{ fontFamily: F }}>LĐV: {r.ldv}</div>
                      <div style={{ fontFamily: F }}>TP: {r.tp}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", verticalAlign: "top" }}>
                      <Badge color="#065f46" bg="#d1fae5">{r.trangThai}</Badge>
                      <div style={{ fontFamily: F, color: MUTED, marginTop: 4, fontSize: 11 }}>{r.sub}</div>
                      {r.extra && <div style={{ fontFamily: F, color: RED, fontSize: 11, marginTop: 2 }}>{r.extra}</div>}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, padding: "12px", textAlign: "center", verticalAlign: "top" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── Tab 2: Phân công Hội đồng xét xử ── */}
        {activeTab === "phan-cong" && <>

        {/* ── Phân công HĐXX panel ── */}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 20 }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: RED, borderRadius: 4 }}>
              <Users size={13} color="#fff" />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F }}>Phân công hội đồng xét xử</span>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontFamily: F, color: MUTED }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                {row.trangThaiSub === "Đã lên lịch xét xử" ? "Đã có lịch xét xử" : "Chưa có lịch xét xử"}
              </span>
            </div>
          </div>

          {/* Chủ tọa + Chọn hội đồng */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 6 }}>
                <span style={{ color: RED }}>* </span>Chủ tọa
              </label>
              <select value={chuToa} onChange={e => setChuToa(e.target.value)} style={{ ...inSt }}>
                {ALL_JUDGES.map(j => <option key={j.name} value={j.name}>{j.name}</option>)}
                <option value="Phạm Thị Bích Ngọc">Phạm Thị Bích Ngọc</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 8 }}>Chọn hội đồng</label>
              <div style={{ display: "flex", gap: 20 }}>
                {(["tt", "5"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                    <input type="radio" checked={hoiDong === v} onChange={() => setHoiDong(v)} style={{ accentColor: RED, width: 15, height: 15 }} />
                    {v === "tt" ? "Hội đồng TT" : "Hội đồng 5"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Two-panel judge selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            {/* Left – available judges */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, marginBottom: 8 }}>Danh sách thẩm phán:</div>
              <input value={judgeSearch} onChange={e => setJudgeSearch(e.target.value)} placeholder="Tìm kiếm thẩm phán" style={{ ...inSt, marginBottom: 8 }} />
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                {filteredAll.length === 0 && (
                  <div style={{ padding: 16, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>Không có thẩm phán</div>
                )}
                {filteredAll.map(j => (
                  <div key={j.name} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#fafafa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
                  >
                    <span style={{ flex: 1, fontSize: 13, fontFamily: F, color: TEXT }}>{j.name} <span style={{ color: MUTED }}>– {j.chuc}</span></span>
                    <button onClick={() => addJudge(j.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 18, lineHeight: 1, padding: "0 4px" }} title="Thêm">»</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – selected judges */}
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>Danh sách thẩm phán giải quyết:</span>
                <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số lượng: {selected.length}</span>
              </div>
              <input value={selectedSearch} onChange={e => setSelectedSearch(e.target.value)} placeholder="Tìm kiếm thẩm phán" style={{ ...inSt, marginBottom: 8 }} />
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", minHeight: 80 }}>
                {filteredSelected.length === 0 && (
                  <div style={{ padding: 16, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>Chưa chọn thẩm phán</div>
                )}
                {filteredSelected.map(j => (
                  <div key={j.name} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
                    <button onClick={() => removeJudge(j.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, marginRight: 8, lineHeight: 1 }} title="Xóa">‹</button>
                    <span style={{ flex: 1, fontSize: 13, fontFamily: F, color: TEXT }}>
                      {j.name} <span style={{ color: MUTED }}>– {j.chuc}</span>
                    </span>
                    {j.name === chuToa && (
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700, fontFamily: F, padding: "2px 8px", borderRadius: 4, marginLeft: 6 }}>Chủ tọa</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setShowLichXX(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              + Tạo lịch xét xử
            </button>
            <button style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            <button onClick={onBack} style={{ padding: "8px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Hủy</button>
          </div>
        </div>

        {/* ── Quyết định phân công HĐXX ── */}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: `1.5px solid ${RED}`, borderRadius: 3, color: RED, fontSize: 14, fontWeight: 700, marginRight: 8, lineHeight: 1 }}>+</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Quyết định phân công hội đồng xét xử</span>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
              + Thêm biểu mẫu
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 44 }} /><col style={{ width: "20%" }} /><col style={{ width: "14%" }} /><col /><col style={{ width: "16%" }} /><col style={{ width: "16%" }} /><col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>{["STT","Số quyết định","Ngày quyết định","Tên biểu mẫu","Người ký","Trạng thái văn bản","Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {QD_ROWS.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.id}</td>
                  <td style={{ ...TD, color: "#2563eb" }}>{r.soQD}</td>
                  <td style={TD}>{r.ngayQD}</td>
                  <td style={TD}>{r.tenBM}</td>
                  <td style={TD}>{r.nguoiKy}</td>
                  <td style={TD}>
                    <Badge
                      color={r.trangThai === "Đã có hiệu lực" ? "#065f46" : "#ef4444"}
                      bg={r.trangThai === "Đã có hiệu lực" ? "#d1fae5" : "#fee2e2"}
                    >{r.trangThai}</Badge>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                      {r.trangThai === "Đã có hiệu lực" && (
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={15} color={RED} /></button>
                      )}
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <FileText size={14} color={RED} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "10px 16px", borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>1-{QD_ROWS.length} trên {QD_ROWS.length} mặt hàng</span>
            <button style={{ border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", padding: "3px 8px", cursor: "pointer", color: MUTED, fontSize: 12 }}>‹</button>
            <button style={{ border: `1px solid ${BORDER}`, borderRadius: 3, background: RED, color: "#fff", padding: "3px 8px", cursor: "pointer", fontSize: 12 }}>1</button>
            <button style={{ border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", padding: "3px 8px", cursor: "pointer", color: MUTED, fontSize: 12 }}>›</button>
          </div>
        </div>

        </>}

      </div>
    </div>
  );
}

// ── Filter panel ──────────────────────────────────────────────────────────────

function FilterPanel({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const inSt: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 5, padding: "6px 10px", fontSize: 12, fontFamily: F, outline: "none", background: "#fff", color: TEXT, width: "100%", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 4 };
  const col = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column" }}><label style={lbl}>{label}</label>{children}</div>
  );
  const rangeRow = (label: string) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input type="date" style={{ ...inSt, flex: 1 }} />
        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>–</span>
        <input type="date" style={{ ...inSt, flex: 1 }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: open ? "16px 20px" : "0 20px", marginBottom: 16, overflow: "hidden" }}>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {col("Tòa ra BA/QĐ", <select style={inSt}><option value="">Chọn tòa án</option><option>TAND Tối cao</option><option>TAND Cấp cao HN</option><option>TAND Cấp cao TP.HCM</option></select>)}
            {col("Số BA/QĐ", <input placeholder="Nhập số BA/QĐ" style={inSt} />)}
            {rangeRow("Ngày BA/QĐ")}
            {col("Loại án", <select style={inSt}><option value="">Chọn loại án</option><option>Hình sự</option><option>Dân sự</option><option>Kinh tế</option></select>)}
            {col("Thuộc án", <select style={inSt}><option value="">Chọn loại</option><option>GĐT</option><option>TT</option></select>)}
            {col("NKN/Người khiếu nại", <input placeholder="NKN" style={inSt} />)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {col("Bị cao/Bị cáo", <input placeholder="Bị cáo" style={inSt} />)}
            {col("Số thụ lý xx", <input placeholder="Số thụ lý" style={inSt} />)}
            {rangeRow("Thụ lý XX")}
            {rangeRow("Xét xử")}
            {col("Trạng thái xét xử", <select style={inSt}><option value="">– Tất cả –</option><option>Chưa xét xử</option><option>Đã xét xử</option><option>Chưa phân công HĐXX</option></select>)}
            {col("Thẩm tra viên/Thư ký", <select style={inSt}><option value="">– Tất cả –</option><option>Nguyễn Thu Hằng</option><option>Lý Văn An</option></select>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {col("Lãnh đạo phụ trách", <select style={inSt}><option value="">Vui lòng chọn</option><option>Nguyễn Văn Minh</option><option>Vũ Đình Tuấn</option></select>)}
            {col("Thẩm phán", <select style={inSt}><option value="">Vui lòng chọn</option><option>Trần Thị Lan</option><option>Lê Hoàng Nam</option></select>)}
            {col("Quá hạn xét xử", <select style={inSt}><option value="">– Tất cả –</option><option>Có</option><option>Không</option></select>)}
            {col("Hoàn thi hành án", <select style={inSt}><option value="">– Tất cả –</option><option>Có</option><option>Không</option></select>)}
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: open ? 14 : 12, paddingBottom: open ? 0 : 12 }}>
        <button onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{open ? "Thu gọn" : "Mở rộng"}
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
          🔍 Tìm kiếm
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
          ✕ Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

type PCTab = "tat-ca" | "chua-phan-cong";

export default function PhanCongHDXXView() {
  const [tab, setTab]           = useState<PCTab>("tat-ca");
  const [filterOpen, setFilterOpen] = useState(true);
  const [checked, setChecked]   = useState<Set<number>>(new Set());
  const [detail, setDetail]     = useState<HDXXRow | null>(null);
  const [soVuModal, setSoVuModal] = useState<HDXXRow | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  if (detail) return <HDXXDetailView row={detail} onBack={() => setDetail(null)} />;

  const rows = tab === "chua-phan-cong" ? ROWS.filter(r => r.trangThaiXX === "chua-phan-cong") : ROWS;
  const allChecked = rows.length > 0 && rows.every(r => checked.has(r.id));
  const toggleAll  = () => setChecked(allChecked ? new Set() : new Set(rows.map(r => r.id)));
  const toggle     = (id: number) => setChecked(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "10px 10px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 10px", verticalAlign: "top" };

  const tabs: { id: PCTab; label: string; count: number }[] = [
    { id: "tat-ca",         label: "Tất cả",         count: 163 },
    { id: "chua-phan-cong", label: "Chưa phân công", count: 58  },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb" }}>
      {soVuModal && <SoVuModal row={soVuModal} onClose={() => setSoVuModal(null)} />}

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 8 }}>
          Trang chủ / Quản lý án GĐT/TT / <span style={{ color: RED, fontWeight: 600 }}>Phân công HĐXX</span> / Danh sách vụ xét xử
        </div>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 16px" }}>Phân công Hội đồng xét xử</h1>

        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent", color: tab === t.id ? RED : "#6b7280", fontFamily: F, fontSize: 13, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", marginBottom: -1 }}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <FilterPanel open={filterOpen} onToggle={() => setFilterOpen(v => !v)} />

        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
            <button style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: 5, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <RotateCcw size={14} color={MUTED} />
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} /><col style={{ width: 36 }} /><col style={{ width: "15%" }} /><col style={{ width: "26%" }} /><col style={{ width: "22%" }} /><col style={{ width: "20%" }} /><col style={{ width: 44 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: "center" }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor: RED, cursor: "pointer" }} />
                </th>
                {["STT","Số & Ngày lập DS","Số và ngày thụ lý xét xử","Hội đồng xét xử","Trạng thái","Thao tác"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                  onClick={() => setDetail(r)}
                >
                  <td style={{ ...TD, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={checked.has(r.id)} onChange={() => toggle(r.id)} style={{ accentColor: RED, cursor: "pointer" }} />
                  </td>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={TD}>
                    <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>Số: {r.soDS}</div>
                    <div style={{ color: MUTED, fontFamily: F }}>Ngày: {r.ngayDS}</div>
                  </td>
                  <td style={TD} onClick={e => e.stopPropagation()}>
                    {r.thuLyList.map((tl, i) => (
                      <div key={i} style={{ color: TEXT, fontFamily: F, marginBottom: 2 }}><b>Số:</b> {tl.so} – {tl.ngay}</div>
                    ))}
                    <button onClick={() => setSoVuModal(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontFamily: F, fontSize: 11, padding: 0, textDecoration: "underline" }}>
                      Số vụ xét xử: {r.soVuLink}
                    </button>
                  </td>
                  <td style={TD} onClick={e => e.stopPropagation()}>
                    {r.hdxx === "–" ? (
                      <span style={{ color: MUTED }}>–</span>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 2 }}>{r.hdxx}</div>
                        {r.hdxxSub && <div style={{ color: MUTED, fontFamily: F, fontSize: 11, marginBottom: 4 }}>{r.hdxxSub}</div>}
                        <button onClick={() => setDetail(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontFamily: F, fontSize: 11, padding: 0, textDecoration: "underline" }}>
                          Thông tin phân công HĐXX
                        </button>
                      </>
                    )}
                  </td>
                  <td style={TD}>
                    <div style={{ marginBottom: 5 }}><TrangThaiBadge type={r.trangThaiXX} /></div>
                    {r.trangThaiSub && <div style={{ color: MUTED, fontFamily: F, fontSize: 11, marginBottom: 2 }}>{r.trangThaiSub}</div>}
                    {r.trangThaiExtra && (
                      <div style={{ fontFamily: F, fontSize: 11, color: r.trangThaiExtra.startsWith("Thời hạn") ? RED : MUTED, whiteSpace: "pre-line" }}>
                        {r.trangThaiExtra}
                      </div>
                    )}
                  </td>
                  <td style={{ ...TD, textAlign: "center", position: "relative" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}>
                      <MoreVertical size={16} color={MUTED} />
                    </button>
                    {menuOpen === r.id && (
                      <ContextMenu
                        row={r}
                        onClose={() => setMenuOpen(null)}
                        onXem={() => setDetail(r)}
                        onPhanCong={() => setDetail(r)}
                        onLichXX={() => { setDetail(r); }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
              Hiển thị <b>{rows.length}</b> của <b>{tab === "tat-ca" ? 163 : 58}</b> bản ghi
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>HIỂN THỊ:</span>
              <select style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontFamily: F }}>
                <option>10 dòng</option><option>20 dòng</option><option>50 dòng</option>
              </select>
              <div style={{ display: "flex", gap: 2 }}>
                {["‹‹","‹","1","›","››"].map((p, i) => (
                  <button key={i} style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: p === "1" ? RED : "#fff", color: p === "1" ? "#fff" : MUTED, fontSize: 12, cursor: "pointer", fontFamily: F }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
