import React, { useState, useRef, useEffect } from "react";
import { Search, RotateCcw, ChevronDown, ChevronUp, MoreVertical, X, Eye, Pencil, Printer, FileText, Trash2, Calendar, Save, Send } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import { TaoDuThaoModal } from "./TaoDuThaoModal";

// ── Types ─────────────────────────────────────────────────────────────────────

type TrangThai =
  | "chua-xx-chua-ds"       // Chưa xét xử – chưa có danh sách
  | "chua-xx-da-ds"         // Chưa xét xử – đã có danh sách
  | "chua-thu-ly"           // Chưa thụ lý xét xử
  | "rut-khang-nghi"        // Rút kháng nghị
  | "da-xx"                 // Đã xét xử
  | "chuyen-tham-quyen";    // Chuyển thẩm quyền xét xử

type DetailTab = "thong-tin" | "thu-ly" | "phan-cong" | "to-trinh" | "qd-bi-cao" | "qd-vu-an" | "ket-qua";

type VuXetXuRow = {
  id: number;
  maVuAn: string;
  tenVuAn: string;
  // List display fields (image-12)
  soThuLy: string;              // e.g. "54681978"
  ngayThuLy: string;            // e.g. "09/07/2026"
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;             // e.g. "Sơ thẩm"
  thoiHieu: string;             // e.g. "5 năm"
  tag?: "an-qh" | "an-tu-hinh" | "an-chi-dao";
  ndkn: string;
  ndd: string;
  ttv: string;
  ldv: string;
  tp: string;
  trangThai: TrangThai;
  thoiHanXX?: string;
  soQD?: string;
  ngayQD?: string;
  // Detail view fields (kept for backward compat)
  soNgayBAQD: string;
  toaRABAQD: string;
  soNgayKhangNghi: string;
  soNgayThuLy: string;
  vienKiemSat: string;
  toaAnGiaiQuyet: string;
  biCao: string;
  loaiAn: string;
  chuToa: string;
  hdxx: string;
  ngayXX: string;
  phongXX: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const ROWS: VuXetXuRow[] = [
  {
    id: 1,
    maVuAn: "VA26-002148", tenVuAn: "ĐẶNG THIÊN DƯƠNG – Tội cố ý gây thương tích",
    soThuLy: "54681978", ngayThuLy: "09/07/2026",
    soBA: "5469", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "5 năm", tag: "an-qh",
    ndkn: "Trần Văn Hải", ndd: "Nguyễn Đơn Hải",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "5469 – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_2707 – 27/07/2026", soNgayThuLy: "54681978 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Văn Hải", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 2,
    maVuAn: "VA26-002012", tenVuAn: "ĐẶNG THÌN DƯƠNG – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ",
    soThuLy: "54681923", ngayThuLy: "09/07/2026",
    soBA: "54681139", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm", tag: "an-tu-hinh",
    ndkn: "ooo", ndd: "Ô tô kê",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-xx-da-ds", thoiHanXX: "19 ngày",
    soNgayBAQD: "54681139 – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "Số kháng nghị – 11/11/2024", soNgayThuLy: "54681923 – 09/07/2026",
    vienKiemSat: "VKS xét xử GĐT, TT", toaAnGiaiQuyet: "Tòa án xét xử GĐT, TT",
    biCao: "ooo", loaiAn: "Hình sự", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 3 thẩm phán", ngayXX: "28/07/2026", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 3,
    maVuAn: "VA26-001543", tenVuAn: "Tranh chấp hợp đồng mua bán nhà ở",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "HS-ST021", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Ngô Mai Trang", ndd: "Phạm Văn Thành, Lê Thị Nhải",
    ttv: "Hoàng Quỳnh Trang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "HS-ST021 – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_1543 – 15/06/2026", soNgayThuLy: "– ",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ngô Mai Trang", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 4,
    maVuAn: "VA26-001201", tenVuAn: "Tham ô tài sản nhà nước",
    soThuLy: "54681813", ngayThuLy: "09/07/2026",
    soBA: "HS-ST018", ngayBA: "08/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm", tag: "an-chi-dao",
    ndkn: "Đỗ Thành Công", ndd: "Phan Kim Ngân",
    ttv: "Nguyễn Thị Hương", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "rut-khang-nghi", soQD: "54/2026/QĐ-CA", ngayQD: "09/07/2026",
    soNgayBAQD: "HS-ST018 – 08/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_1201 – 01/05/2026", soNgayThuLy: "54681813 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Đỗ Thành Công", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },
  {
    id: 5,
    maVuAn: "VA26-000987", tenVuAn: "Vi phạm quy định về quản lý đất đai",
    soThuLy: "54681748", ngayThuLy: "08/07/2026",
    soBA: "HS-ST08", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Nguyễn Quốc Huy", ndd: "Lâm Gia Bảo",
    ttv: "Vũ Diệu Thúy", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Như Thắng",
    trangThai: "da-xx", soQD: "–", ngayQD: "08/07/2026",
    soNgayBAQD: "HS-ST08 – 08/07/2025", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_0987 – 10/04/2026", soNgayThuLy: "54681748 – 08/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Nguyễn Quốc Huy", loaiAn: "Hình sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng 3 thẩm phán", ngayXX: "18/06/2026", phongXX: "Phòng xét xử số 3",
  },
  {
    id: 6,
    maVuAn: "VA26-000654", tenVuAn: "Lừa đảo chiếm đoạt tài sản",
    soThuLy: "54681800", ngayThuLy: "08/07/2026",
    soBA: "HKTT_0807", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân quận Ninh Kiều",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "NGHIÊM THỊ XUÂN", ndd: "HỒ THỊ NGỌC HẬU, TRẦN THỊ TRANG, NGUYỄN...",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Như Thắng",
    trangThai: "chuyen-tham-quyen",
    soNgayBAQD: "HKTT_0807 – 08/07/2025", toaRABAQD: "Tòa án nhân dân quận Ninh Kiều",
    soNgayKhangNghi: "QDKN_0654 – 20/03/2026", soNgayThuLy: "54681800 – 08/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "NGHIÊM THỊ XUÂN", loaiAn: "Hình sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng toàn thể", ngayXX: "–", phongXX: "–",
  },
];

const paginBtn: React.CSSProperties = { padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT };

const LIST_TABS = [
  { id: "tat-ca",           label: "Tất cả",                count: ROWS.length },
  { id: "chua-xx-chua-ds",  label: "Chưa có DS xét xử",    count: ROWS.filter(r => r.trangThai === "chua-xx-chua-ds").length },
];

const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "thong-tin", label: "Thông tin vụ án" },
  { key: "thu-ly",    label: "Thụ lý" },
  { key: "phan-cong", label: "Phân công" },
  { key: "to-trinh",  label: "Tờ trình" },
  { key: "qd-bi-cao", label: "Quyết định bị cáo" },
  { key: "qd-vu-an",  label: "Quyết định vụ án" },
  { key: "ket-qua",   label: "Kết quả xét xử" },
];

// ── Trạng thái cell (rich – matches image-5) ─────────────────────────────────

function TrangThaiCell({ row }: { row: VuXetXuRow }) {
  switch (row.trangThai) {
    case "chua-xx-chua-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Chưa có danh sách vụ xét xử</span>
        </div>
      );
    case "chua-xx-da-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Đã có danh sách vụ xét xử</span>
          {row.thoiHanXX && (
            <span style={{ fontSize: 11, color: RED, fontFamily: F, fontStyle: "italic" }}>Thời hạn xét xử: {row.thoiHanXX}</span>
          )}
        </div>
      );
    case "chua-thu-ly":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid ${RED}`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: RED, background: "#fff" }}>Chưa thụ lý xét xử</span>
        </div>
      );
    case "rut-khang-nghi":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #0891b2", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#0891b2", background: "#ecfeff" }}>Rút kháng nghị</span>
          {row.soQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số QĐ: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "da-xx":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #6b7280", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#374151", background: "#f3f4f6" }}>Đã xét xử</span>
          {row.soQD !== undefined && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "chuyen-tham-quyen":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #2563eb", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#2563eb", background: "#eff6ff" }}>Chuyển thẩm quyền xét xử</span>
        </div>
      );
  }
}

// ── Info grid ─────────────────────────────────────────────────────────────────

function InfoGrid({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {rows.map(([l1, v1, l2, v2], i) => (
          <tr key={i}>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}`, width: "32%" }}>{v1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l2}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}` }}>{v2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ThongTinChungBlock({ row }: { row: VuXetXuRow }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
        <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin chung của vụ án</span>
      </div>
      {open && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
          </div>
          <InfoGrid rows={[
            ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
            ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
            ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
            ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
          ]} />
        </div>
      )}
    </div>
  );
}

// ── Tab: Thông tin vụ án ─────────────────────────────────────────────────────

function TabThongTin({ row }: { row: VuXetXuRow }) {
  const [sec1Open, setSec1Open] = useState(true);
  const [sec2Open, setSec2Open] = useState(true);
  const [kSuaOpen, setKSuaOpen] = useState(false);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px" };
  const inp: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 4, padding: "7px 10px", fontSize: 12, fontFamily: F, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" as const };

  const actBtns = <div style={{ display: "flex", gap: 4 }}><button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button><button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button></div>;

  const PTab = ({ cols, rows, noData }: { cols: string[]; rows: React.ReactNode[][]; noData?: boolean }) => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{cols.map(c => <th key={c} style={TH}>{c}</th>)}</tr></thead>
      <tbody>
        {(noData || rows.length === 0)
          ? <tr><td colSpan={cols.length} style={{ padding: 16, textAlign: "center" as const, fontSize: 12, color: MUTED, fontFamily: F }}>Không có dữ liệu</td></tr>
          : rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>{r.map((c, j) => <td key={j} style={TD}>{c}</td>)}</tr>)
        }
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Section 1 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec1Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin đề nghị Giám đốc thẩm / Tái thẩm</span>
        </div>
        {sec1Open && (
          <>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
              </div>
              <InfoGrid rows={[
                ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
                ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
                ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
                ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
              ]} />
            </div>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin Hồ sơ Kháng nghị</span>
                <button onClick={() => setKSuaOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: kSuaOpen ? "#fee2e2" : "#fff", border: `1px solid ${kSuaOpen ? RED : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: kSuaOpen ? RED : TEXT }}>
                  <Pencil size={12} /> Sửa
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ngày VKS trả/chuyển hồ sơ:</label><input style={inp} defaultValue="27/07/2026" readOnly={!kSuaOpen} /></div>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Số bút lục VKS trả/chuyển HS:</label><input style={inp} placeholder="Nhập số" readOnly={!kSuaOpen} /></div>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Người kháng nghị:</label><input style={inp} defaultValue="Viện trưởng viện kiểm sát nhân dân tối cao" readOnly={!kSuaOpen} /></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Section 2 */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec2Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin người liên quan</span>
        </div>
        {sec2Open && (
          <>
            {[
              { title: "* Người khiếu nại", req: true, cols: ["STT","Họ và tên/Tổ chức","Năm sinh","Địa chỉ","Thao tác"], rows: [["1","Phan Mai Hoa","","Tổ 3, phường Yên Nghĩa, TP Hà Nội", actBtns]] },
              { title: "* Bị cáo", req: true, cols: ["STT","Họ và tên/Tổ chức","Địa vị pháp lý","Thông tin tội danh, Mức án","Năm sinh","Địa chỉ","Thao tác"],
                rows: [["1", row.biCao, "Bị cáo đầu vụ", <div key="td" style={{ fontSize: 11, lineHeight: 1.5, fontFamily: F }}><div><b>Tội che giấu tội phạm (Tội danh chính)</b> Khoản 1 Điểm a</div><div style={{ color: MUTED }}>Tù có thời hạn – 15 năm, 6 tháng; Phạt tiền, khi không áp dụng hình phạt là phạt chính</div></div>, "2000", "Tổ 7, Xã Yên Định, Tỉnh Bắc Ninh", actBtns]]
              },
              { title: "Bị hại", req: false, cols: ["STT","Họ và tên/Tổ chức","Năm sinh","Địa chỉ","Thao tác"], rows: [] as React.ReactNode[][] },
            ].map(sec => (
              <div key={sec.title} style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
                    {!sec.req && <input type="checkbox" style={{ cursor: "pointer" }} />}
                    {sec.title}
                  </label>
                  <button style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>+ Thêm mới</button>
                </div>
                <PTab cols={sec.cols} rows={sec.rows as React.ReactNode[][]} noData={sec.rows.length === 0} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Tab: Thụ lý ───────────────────────────────────────────────────────────────

function TabThuLy({ row }: { row: VuXetXuRow }) {
  const [ketQuaOpen, setKetQuaOpen] = useState(true);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  return (
    <div>
      <ThongTinChungBlock row={row} />
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Thông tin thụ lý vụ án GĐT, TT</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}><Pencil size={12} /> Sửa thông tin</button>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const, fontSize: 12, fontFamily: F }}>
            <span><b style={{ color: MUTED }}>* Số thụ lý GĐT, TT:</b> <b style={{ color: TEXT }}>54682698</b></span>
            <span><b style={{ color: MUTED }}>* Ngày thụ lý:</b> <b style={{ color: TEXT }}>27/07/2026</b></span>
            <span><b style={{ color: MUTED }}>Người kháng nghị:</b> <span style={{ color: TEXT }}>Viện trưởng viện kiểm sát nhân dân tối cao</span></span>
            <span><b style={{ color: MUTED }}>Chuyển thẩm quyền xét xử:</b> <span style={{ color: TEXT }}>Không</span></span>
          </div>
        </div>
      </div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setKetQuaOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, color: TEXT }}>—</button>
          <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Kết quả theo giai đoạn</span>
        </div>
        {ketQuaOpen && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["STT","Giai đoạn","Thông tin thụ lý","Bị cáo/Bị cáo & Tội danh","Tòa án & Thẩm phán","Kết quả"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              <tr style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>1</td>
                <td style={TD}><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, background: "#dbeafe", color: "#1e40af" }}>Giám đốc thẩm</span></td>
                <td style={TD}><div>Số thụ lý: <b>54682698</b></div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Ngày: 27/07/2026</div></td>
                <td style={{ ...TD, fontWeight: 600 }}>{row.biCao}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{row.toaAnGiaiQuyet}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{row.chuToa}</div></td>
                <td style={TD}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Tab: Phân công ────────────────────────────────────────────────────────────

function TabPhanCong({ row }: { row: VuXetXuRow }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  const PC_ROWS = [
    { vai: "Thẩm phán",    ngay: "10/04/2026\n06/04/2026", ten: "Trịnh Đức Minh", phu: "Lê Đức Hòa", chuc: "Phó chánh án", nguoi: "Nguyễn Xuân Thành\n10/04/2026 – 10:20:10", hasDoc: true, hasLuu: false },
    { vai: "Lãnh đạo vụ",  ngay: "14/04/2026",              ten: "Hoàng Văn Hòa",  phu: "",           chuc: "Phó Vụ trưởng", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: false, hasLuu: false },
    { vai: "Thẩm tra viên",ngay: "16/04/2026",              ten: "Nguyễn Ngọc Ngan",phu: "",          chuc: "Thẩm tra viên chính", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: false, hasLuu: false },
    { vai: "Thư ký",       ngay: "",                        ten: "",               phu: "",           chuc: "",              nguoi: "",                                     hasDoc: false, hasLuu: true },
  ];
  const HDXX_ROWS = [
    { vai: "Thẩm phán chủ tọa",                   nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Phó chánh án – Thẩm phán tối cao", ngay: "12/02/2028" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Thẩm phán bậc 3",                  ngay: "12/02/2028" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Thẩm phán bậc 3",                  ngay: "12/02/2028" },
  ];
  const QD_ROWS = [
    { so: "12345681/2026/QĐ-TA", ngay: "31/03/2026", ten: "Quyết định thành lập hội đồng xét xử", nguoiKy: "Trần Văn Hành", chucVu: "Chánh tòa", tt: "Đã cấp số" },
  ];

  const Sec = ({ title }: { title: string }) => (
    <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>{title}</span>
    </div>
  );

  return (
    <div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <InfoGrid rows={[
          ["Mã vụ án", row.maVuAn, "Số – Ngày thụ lý xét xử", row.soNgayThuLy],
          ["Số – Ngày BA/QĐ", row.soNgayBAQD, "Trạng thái", "Chưa xét xử"],
          ["Tòa ra bản án", row.toaRABAQD, "Viện kiểm sát giải quyết", row.vienKiemSat],
          ["Số – Ngày kháng nghị", row.soNgayKhangNghi, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Phân công giải quyết" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT","Vai trò","Ngày phân công","Họ và tên","Chức danh/Chức vụ","Người phân công/sửa","Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {PC_ROWS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.vai}</td>
                <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11, color: MUTED }}>{r.ngay}</td>
                <td style={TD}>{r.ten && <div style={{ fontWeight: 600 }}>{r.ten}</div>}{r.phu && <div style={{ fontSize: 11, color: MUTED }}>{r.phu}</div>}</td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11 }}>{r.nguoi}</td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  {r.hasDoc && <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>}
                  {r.hasLuu && <button style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>Lưu</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Thành phần hội đồng xét xử" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT","Vai trò","Người được phân công","Chức vụ – Chức danh tư pháp","Ngày phân công"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {HDXX_ROWS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.vai}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{r.nguoi}</td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <Sec title="Quyết định phân công" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT","Số quyết định","Ngày quyết định","Tên biểu mẫu","Người ký","Trạng thái cấp số","Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {QD_ROWS.map((r, i) => (
              <tr key={i} style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.so}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
                <td style={TD}>{r.ten}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{r.nguoiKy}</div><div style={{ fontSize: 11, color: MUTED }}>{r.chucVu}</div></td>
                <td style={TD}><Badge color="#15803d" bg="#dcfce7">{r.tt}</Badge></td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Tờ trình (copy vụ án, bỏ thông tin đơn) ────────────────────────────

function TabToTrinhXX({ row: _row }: { row: VuXetXuRow }) {
  const [showTaoTT, setShowTaoTT]       = useState(false);
  const [showTrinhKy, setShowTrinhKy]   = useState(false);
  const [showHoSo, setShowHoSo]         = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình xét xử vụ án số 2", yKien: "–",                                             ngayDuyet: "–",          trangThai: "cho-duyet", subRows: [] as {label:string;ngayDuyet:string}[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán",    vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–",                                             ngayDuyet: "07/07/2026", trangThai: "da-duyet",  subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán",    vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–",                                             ngayDuyet: "08/07/2026", trangThai: "da-duyet",  subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án",     vanBan: "Tờ trình xét xử vụ án số 1", yKien: "Hồ sơ chưa đầy đủ, đề nghị bổ sung tài liệu", ngayDuyet: "06/07/2026", trangThai: "tu-choi",   subRows: [] },
  ]);
  const [filterVanBan, setFilterVanBan] = useState("");
  const [checkedVanBan, setCheckedVanBan] = useState<Set<number>>(new Set());

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình xét xử vụ án số 1",  loai: "Tờ trình",          ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A",  trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo xét xử số 1",         loai: "Thông báo",          ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B",  trangThai: "Đã phát hành" },
    { stt: 3, vanBan: "Thông báo xét xử số 2",         loai: "Thông báo",          ngayTao: "09/07/2026", nguoiKy: "–",             trangThai: "Chờ ký số" },
  ];

  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => !filterVanBan || r.vanBan === filterVanBan);

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" as const };

  /* ── mini modal stubs ── */
  const Modal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12, color: MUTED, fontFamily: F, marginBottom: 16 }}>Chức năng đang phát triển...</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {showTaoTT     && <Modal title="Tạo tờ trình" onClose={() => setShowTaoTT(false)} />}
      {showTrinhKy   && <Modal title="Trình ký" onClose={() => setShowTrinhKy(false)} />}
      {showHoSo      && <Modal title="Hồ sơ tờ trình" onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 380, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: 14, fontFamily: F, marginBottom: 20 }}>Bạn có chắc muốn thu hồi tờ trình này?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setThuHoiIdx(null)} style={{ padding: "6px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
              <button onClick={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }} style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 36 }}>
                <input type="checkbox"
                  checked={checkedVanBan.size === vanBanRows.length && vanBanRows.length > 0}
                  onChange={e => setCheckedVanBan(e.target.checked ? new Set(vanBanRows.map(r => r.stt)) : new Set())}
                />
              </th>
              {["STT","TÊN VĂN BẢN","LOẠI","NGÀY TẠO","NGƯỜI KÝ","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {vanBanRows.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <input type="checkbox"
                    checked={checkedVanBan.has(r.stt)}
                    onChange={e => setCheckedVanBan(prev => { const s = new Set(prev); e.target.checked ? s.add(r.stt) : s.delete(r.stt); return s; })}
                  />
                </td>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                <td style={TD}>{r.loai}</td>
                <td style={TD}>{r.ngayTao}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                         bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}>
                    {r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={14} color="#0e7490" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff" }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr>{["STT","NGÀY TRÌNH","LÃNH ĐẠO ĐƯỢC TRÌNH","CẤP TRÌNH","VĂN BẢN","Ý KIẾN","NGÀY DUYỆT","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filteredLichSu.map((r, realIdx) => (
                <React.Fragment key={realIdx}>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{realIdx + 1}</td>
                    <td style={TD}>{r.ngayTrinh}</td>
                    <td style={TD}>{r.lanh}</td>
                    <td style={TD}>{r.capTrinh}</td>
                    <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                    <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" as const }}>{r.yKien}</td>
                    <td style={TD}>{r.ngayDuyet}</td>
                    <td style={TD}>
                      {r.trangThai === "cho-duyet"
                        ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                        : r.trangThai === "tu-choi"
                        ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                        : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                    </td>
                    <td style={{ ...TD, textAlign: "center" as const }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }} title="Xem"><Eye size={13} color="#0e7490" /></button>
                        {r.trangThai === "cho-duyet" && (
                          <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <RotateCcw size={13} color="#dc2626" />
                          </button>
                        )}
                        <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Send size={13} color={RED} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {r.subRows.map((sub, si) => (
                    <tr key={si} style={{ background: "#fafafa" }}>
                      <td style={{ ...TD, textAlign: "center" as const, color: MUTED }} />
                      <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td>
                      <td colSpan={3} style={{ ...TD, fontSize: 11, color: MUTED }}>Ngày: {sub.ngayDuyet}</td>
                      <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                      <td style={{ ...TD, textAlign: "center" as const }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={13} color="#0e7490" /></button>
                          <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <Send size={13} color={RED} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Shared: NoiNhanTable ─────────────────────────────────────────────────────

type NoiNhanRow = { id: number; noi: string; noiCT: string; ghiChu: string; editing: boolean };

const NOI_NHAN_OPTS = ["Viện kiểm sát", "Tòa án", "Cơ quan thi hành án", "Lưu hồ sơ", "Đương sự", "Luật sư"];
const NOI_CT_OPTS: Record<string, string[]> = {
  "Viện kiểm sát": ["VKSNDTC", "VKS cấp tỉnh", "VKS cấp huyện"],
  "Tòa án": ["TAND Tối cao", "TAND cấp tỉnh", "TAND cấp huyện"],
};

const nnSelSt: React.CSSProperties = { padding: "5px 28px 5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff", appearance: "none" as const, cursor: "pointer" };
const nnInpSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
const nnTH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 12px", textAlign: "left" as const };
const nnTD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "8px 10px", verticalAlign: "middle" as const };

function NoiNhanTable({ rows, setRows }: { rows: NoiNhanRow[]; setRows: React.Dispatch<React.SetStateAction<NoiNhanRow[]>> }) {
  const add = () => setRows(p => [...p, { id: Date.now(), noi: "", noiCT: "", ghiChu: "", editing: true }]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <span style={{ color: RED }}>*</span> Nơi nhận
        </label>
        <button onClick={add} style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
          Thêm nơi nhận
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
        <thead>
          <tr style={{ background: BG }}>
            {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
              <th key={h} style={{ ...nnTH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: "#fff" }}>
              <td style={{ ...nnTD, width: 40, textAlign: "center" as const, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{i + 1}</td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noi}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noi: e.target.value, noiCT: "" } : x))}>
                      <option value="">Chọn nơi nhận</option>
                      {NOI_NHAN_OPTS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noi}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noiCT}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noiCT: e.target.value } : x))}>
                      <option value="">Chọn</option>
                      {(NOI_CT_OPTS[r.noi] ?? []).map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noiCT}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing
                  ? <input placeholder="Nhập ghi chú" style={nnInpSt} value={r.ghiChu}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, ghiChu: e.target.value } : x))} />
                  : r.ghiChu}
              </td>
              <td style={{ ...nnTD, textAlign: "center" as const, whiteSpace: "nowrap" as const, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: false } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F }}>Lưu</button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontFamily: F }}>Hủy</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: true } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Pencil size={12} /> Sửa
                    </button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal: Quyết định hoãn thi hành án ───────────────────────────────────────

function ModalHoanThiHanhAn({ row, onClose }: { row: VuXetXuRow; onClose: () => void }) {
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([]);
  const INP: React.CSSProperties = { padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
  const LBL: React.CSSProperties = { fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, marginBottom: 4, display: "flex", alignItems: "center", gap: 2 };
  const REQ = <span style={{ color: RED }}>*</span>;
  const Fld = ({ label, req: r = true, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
      <label style={LBL}>{r && REQ} {label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 900, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" as const }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F }}>Quyết định hoãn thi hành án (MS02) - THA</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>

        {/* Info block */}
        <div style={{ margin: "14px 20px 0", padding: "12px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: F }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 24px" }}>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Mã vụ án : <span style={{ color: TEXT, fontWeight: 400 }}>VA26-00321</span></span>
            <span>Số BA/QĐ : <span style={{ fontWeight: 600 }}>050526_CTH02</span></span>
            <span style={{ color: "#16a34a" }}>Giai đoạn : <span style={{ color: TEXT }}>Giám đốc thẩm, tái thẩm</span></span>
            <span style={{ color: "#16a34a" }}>Tên vụ án : <span style={{ color: TEXT }}>Vụ án Phan Văn Thành – bức cung</span></span>
            <span>Ngày ra BA/QĐ : <span style={{ fontWeight: 600 }}>05/05/2026</span></span>
            <span style={{ color: "#16a34a" }}>Tòa án giải quyết : <span style={{ color: TEXT }}>Tòa án nhân dân tối cao</span></span>
            <span style={{ color: "#16a34a" }}>Tên bị can đầu vụ : <span style={{ color: TEXT }}>Phan Văn Thành</span></span>
            <span>Tòa xét xử : <span style={{ fontWeight: 600 }}>Tòa án nhân dân tỉnh Hải Phòng</span></span>
            <span style={{ color: "#16a34a" }}>Trạng thái : <span style={{ color: "#ef4444" }}>Chưa có kết quả xét xử</span></span>
            <span style={{ color: "#16a34a" }}>Tội danh chính : <span style={{ color: TEXT }}>Bức cung</span></span>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
          <Fld label="Bị án">
            <input placeholder="Chọn bị án" style={INP} />
          </Fld>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Fld label="Ngày quyết định">
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Chọn ngày" style={{ ...INP, border: "none", borderRadius: 0, flex: 1 }} />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8 }} />
              </div>
            </Fld>
            <Fld label="Số quyết định" req={false}>
              <input placeholder="Nhập số quyết định" style={INP} />
            </Fld>
            <Fld label="Người ký ban hành">
              <input placeholder="Người ký" style={INP} />
            </Fld>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Fld label="Lý do hoãn">
              <input placeholder="Nhập lý do" style={INP} />
            </Fld>
            <Fld label="Số tháng" req={false}>
              <input placeholder="Nhập số tháng" style={INP} />
            </Fld>
            <Fld label="Hiệu lực từ ngày">
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Chọn ngày" style={{ ...INP, border: "none", borderRadius: 0, flex: 1 }} />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8 }} />
              </div>
            </Fld>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <Fld label="Đơn vị quản lý">
              <div style={{ position: "relative" as const }}>
                <select style={{ ...INP, appearance: "none" as const, cursor: "pointer" }}><option value="">Nhập địa chỉ</option></select>
                <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </Fld>
            <Fld label="Xã/Phường" req={false}><input placeholder="Xã/Phường" style={INP} /></Fld>
            <Fld label="Tỉnh/Thành phố" req={false}><input placeholder="Tỉnh/Thành phố" style={INP} /></Fld>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Fld label="Căn cứ">
              <textarea placeholder="Căn cứ pháp luật" rows={4}
                style={{ ...INP, resize: "vertical" as const }} />
            </Fld>
            <Fld label="Nhận định Tòa án">
              <textarea placeholder="Nhập nội dung của tòa án" rows={4}
                style={{ ...INP, resize: "vertical" as const }} />
            </Fld>
          </div>
          <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
          <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Quyết định rút kháng nghị ─────────────────────────────────────────

function ModalRutKhangNghi({ row, onClose }: { row: VuXetXuRow; onClose: () => void }) {
  const [loaiThayDoi, setLoaiThayDoi] = useState<"bo-sung" | "rut-khang-nghi">("rut-khang-nghi");
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([]);
  const INP: React.CSSProperties = { padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
  const LBL: React.CSSProperties = { fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, marginBottom: 4, display: "flex", alignItems: "center", gap: 2 };
  const REQ = <span style={{ color: RED }}>*</span>;
  const Fld = ({ label, req: r = true, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
      <label style={LBL}>{r && REQ} {label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 860, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" as const }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>⚡ Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT (MS57) – GĐT</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>

        {/* Info block */}
        <div style={{ margin: "14px 20px 0", padding: "12px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: F }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 24px" }}>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Mã vụ án : <span style={{ color: TEXT, fontWeight: 400 }}>VA26-00321</span></span>
            <span>Số BA/QĐ : <span style={{ fontWeight: 600 }}>050526_CTH02</span></span>
            <span style={{ color: "#16a34a" }}>Giai đoạn : <span style={{ color: TEXT }}>Giám đốc thẩm, tái thẩm</span></span>
            <span style={{ color: "#16a34a" }}>Tên vụ án : <span style={{ color: TEXT }}>Vụ án Phan Văn Thành – bức cung</span></span>
            <span>Ngày ra BA/QĐ : <span style={{ fontWeight: 600 }}>05/05/2026</span></span>
            <span style={{ color: "#16a34a" }}>Tòa án giải quyết : <span style={{ color: TEXT }}>Tòa án nhân dân tối cao</span></span>
            <span style={{ color: "#16a34a" }}>Tên bị can đầu vụ : <span style={{ color: TEXT }}>Phan Văn Thành</span></span>
            <span>Tòa xét xử : <span style={{ fontWeight: 600 }}>Tòa án nhân dân tỉnh Hải Phòng</span></span>
            <span style={{ color: "#16a34a" }}>Trạng thái : <span style={{ color: "#ef4444" }}>Chưa có kết quả xét xử</span></span>
            <span style={{ color: "#16a34a" }}>Tội danh chính : <span style={{ color: TEXT }}>Bức cung</span></span>
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {/* Section: Thông tin quyết định */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>Thông tin quyết định</span>
            </div>
            <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              <Fld label="Ngày quyết định">
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                  <input placeholder="Chọn ngày" style={{ ...INP, border: "none", borderRadius: 0, flex: 1 }} />
                  <Calendar size={14} color={MUTED} style={{ marginRight: 8 }} />
                </div>
              </Fld>
              <Fld label="Số quyết định" req={false}>
                <input placeholder="Nhập số quyết định" style={INP} />
              </Fld>
              <Fld label="Hậu tố" req={false}>
                <input defaultValue="QĐ-TANDTC" style={INP} />
              </Fld>
              <Fld label="Người ký ban hành">
                <div style={{ position: "relative" as const }}>
                  <select style={{ ...INP, appearance: "none" as const, cursor: "pointer" }}><option value="">Chọn người ký ban hành</option></select>
                  <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </Fld>
            </div>
          </div>

          {/* Section: Nội dung quyết định */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>Nội dung quyết định</span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <div>
                <label style={{ ...LBL, marginBottom: 8 }}>{REQ} Loại thay đổi</label>
                <div style={{ display: "flex", gap: 24 }}>
                  {(["bo-sung", "rut-khang-nghi"] as const).map(v => (
                    <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F }}>
                      <input type="radio" name="loai-thay-doi" checked={loaiThayDoi === v} onChange={() => setLoaiThayDoi(v)}
                        style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                      {v === "bo-sung" ? "Bổ sung" : "Rút kháng nghị"}
                    </label>
                  ))}
                </div>
              </div>
              <Fld label="Nhận thấy">
                <textarea placeholder="Nhập nội dung nhận thấy..." rows={5}
                  style={{ ...INP, resize: "vertical" as const }} />
              </Fld>
              <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
          <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Quyết định bị cáo ────────────────────────────────────────────────────

function TabQuyetDinhBiCao({ row }: { row: VuXetXuRow }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const QD_ROWS = [
    {
      id: 1, tenBC: `${row.biCao} – 2000 – Tội che giấu tội phạm`,
      tenQD: "Quyết định tiếp tục tạm giam", soQD: "–", ngayQD: "–",
      nguoiKy: "Phạm Quốc Hưng – Phó CA", hieuLuc: "Chưa có hiệu lực", hieuLucColor: RED,
      nguoiTao: "Vũ Diệu Thùy", ngayTao: "27/07/2026 15:58:11", hasTrash: false,
    },
    {
      id: 2, tenBC: `${row.biCao} – 2000 – Tội che giấu tội phạm`,
      tenQD: "Quyết định hoãn thi hành án", soQD: "54682703/2026/THAHS-QĐ", ngayQD: "27/07/2026",
      nguoiKy: "Phạm Quốc Hưng – Phó CA", hieuLuc: "Đã có hiệu lực", hieuLucColor: "#16a34a",
      nguoiTao: "Vũ Diệu Thùy", ngayTao: "27/07/2026 14:40:06", hasTrash: false,
    },
    {
      id: 3, tenBC: `${row.biCao} – 2000 – Tội che giấu tội phạm`,
      tenQD: "Quyết định hoãn thi hành án", soQD: "54682694/2026/THAHS-QĐ", ngayQD: "27/07/2026",
      nguoiKy: "Phạm Quốc Hưng – Phó CA", hieuLuc: "Chờ ký", hieuLucColor: MUTED,
      nguoiTao: "Hoàng Ngọc Chiều", ngayTao: "27/07/2026 14:35:36", hasTrash: true,
    },
  ];

  const filtered = QD_ROWS.filter(r =>
    !search || r.tenBC.toLowerCase().includes(search.toLowerCase()) || r.tenQD.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {showModal && <ModalHoanThiHanhAn row={row} onClose={() => setShowModal(false)} />}
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <InfoGrid rows={[
          ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
          ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Table section */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F }}>▼ Quyết định bị cáo</span>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden", marginLeft: 4 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập từ khóa tìm kiếm"
              style={{ padding: "5px 10px", fontSize: 12, fontFamily: F, border: "none", outline: "none", width: 200 }} />
            <button style={{ padding: "5px 10px", background: RED, border: "none", cursor: "pointer" }}><Search size={13} color="#fff" /></button>
          </div>
          <div style={{ flex: 1 }} />
          <div ref={ddRef} style={{ position: "relative" as const }}>
            <button onClick={() => setShowDropdown(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>
              + Thêm quyết định <ChevronDown size={13} color="#fff" />
            </button>
            {showDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", zIndex: 300, minWidth: 240, overflow: "hidden" }}>
                <button onClick={() => { setShowDropdown(false); setShowModal(true); }}
                  style={{ width: "100%", textAlign: "left" as const, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                  Quyết định hoãn thi hành án
                </button>
                <button onClick={() => { setShowDropdown(false); setShowModal(true); }}
                  style={{ width: "100%", textAlign: "left" as const, padding: "10px 16px", background: "none", border: `1px solid ${BORDER}`, borderWidth: "1px 0 0 0", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                  Quyết định tiếp tục tạm giam
                </button>
              </div>
            )}
          </div>
          <button style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", color: MUTED }}>
            <RotateCcw size={14} />
          </button>
        </div>
        {/* Table */}
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr>{["STT","TÊN BỊ CÁO","TÊN QUYẾT ĐỊNH","SỐ QĐ","NGÀY RA QĐ","NGƯỜI KÝ","NGƯỜI TẠO","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                  <td style={{ ...TD, fontWeight: 600 }}>{r.tenBC}</td>
                  <td style={TD}>{r.tenQD}</td>
                  <td style={{ ...TD, color: r.soQD === "–" ? MUTED : TEXT }}>{r.soQD}</td>
                  <td style={{ ...TD, color: r.ngayQD === "–" ? MUTED : TEXT }}>{r.ngayQD}</td>
                  <td style={TD}>
                    <div style={{ fontFamily: F }}>{r.nguoiKy}</div>
                    <div style={{ fontSize: 11, color: r.hieuLucColor, marginTop: 2, fontWeight: 500 }}>{r.hieuLuc}</div>
                  </td>
                  <td style={TD}>
                    <div style={{ fontWeight: 600, fontFamily: F }}>{r.nguoiTao}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayTao}</div>
                  </td>
                  <td style={{ ...TD, textAlign: "center" as const }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
                      {r.hasTrash && <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1-{filtered.length} / {filtered.length}</span>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED, fontSize: 12, fontFamily: F }}>‹</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${RED}`, borderRadius: 4, background: RED, color: "#fff", fontSize: 12, fontFamily: F, fontWeight: 700, cursor: "pointer" }}>1</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED, fontSize: 12, fontFamily: F }}>›</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Quyết định vụ án ─────────────────────────────────────────────────────

function TabQuyetDinhVuAn({ row }: { row: VuXetXuRow }) {
  const [search, setSearch] = useState("");
  const [loaiBM, setLoaiBM] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const ddRef2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef2.current && !ddRef2.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const QD_ROWS = [
    {
      id: 1, tenQD: "Quyết định rút kháng nghị", soQD: "54682704/2026/QĐ-CA",
      ngayQD: "27/07/2026", nguoiKy: "Lê Thị Thu Hiền",
      nguoiTao: "Nguyễn Văn Tiến", ngayTao: "27/07/2026 18:15:46",
    },
  ];

  const filtered = QD_ROWS.filter(r =>
    !search || r.tenQD.toLowerCase().includes(search.toLowerCase()) || r.soQD.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {showModal && <ModalRutKhangNghi row={row} onClose={() => setShowModal(false)} />}
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
          ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Table section */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>▬</span> Quyết định vụ án
          </span>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập từ khóa tìm kiếm"
              style={{ padding: "5px 10px", fontSize: 12, fontFamily: F, border: "none", outline: "none", width: 220 }} />
            <button style={{ padding: "5px 10px", background: RED, border: "none", cursor: "pointer" }}><Search size={13} color="#fff" /></button>
          </div>
          <div style={{ flex: 1 }} />
          <div ref={ddRef2} style={{ position: "relative" as const }}>
            <button onClick={() => setShowDropdown(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>
              + Thêm quyết định <ChevronDown size={13} color="#fff" />
            </button>
            {showDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", zIndex: 300, minWidth: 300, overflow: "hidden" }}>
                {[
                  "Quyết định rút kháng nghị",
                  "Quyết định hoãn phiên tòa (dùng cho HĐXX)",
                  "Quyết định hoãn phiên tòa (dùng cho Chánh án Tòa án)",
                  "Biên bản phiên tòa Hình sự GĐT",
                ].map((label, i) => (
                  <button key={label}
                    onClick={() => { setShowDropdown(false); setShowModal(true); }}
                    style={{ width: "100%", textAlign: "left" as const, padding: "10px 16px", background: "none", border: "none", borderTop: i > 0 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
            <select value={loaiBM} onChange={e => setLoaiBM(e.target.value)}
              style={{ padding: "5px 12px", fontSize: 12, fontFamily: F, border: "none", outline: "none", background: "#fff", cursor: "pointer", appearance: "none" as const }}>
              <option value="">Loại biểu mẫu</option>
              <option>Quyết định rút kháng nghị</option>
              <option>Quyết định hoãn thi hành án</option>
            </select>
            <ChevronDown size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
          </div>
          <button style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", color: MUTED }}>
            <RotateCcw size={14} />
          </button>
        </div>
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["STT","TÊN QUYẾT ĐỊNH","SỐ QĐ","NGÀY RA QĐ","NGƯỜI KÝ","NGƯỜI TẠO","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.tenQD}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.soQD}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngayQD}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <div style={{ fontWeight: 600, fontFamily: F }}>{r.nguoiTao}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayTao}</div>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1-{filtered.length} / {filtered.length}</span>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>‹</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${RED}`, borderRadius: 4, background: RED, color: "#fff", fontWeight: 700, cursor: "pointer" }}>1</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>›</button>
        </div>
      </div>
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function ChiTietVuXetXuView({ row, onBack }: { row: VuXetXuRow; onBack: () => void }) {
  const [tab, setTab] = useState<DetailTab>("thong-tin");

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0 }}>
        Trang chủ › Quản lý GĐT/TT › Quản lý vụ xét xử GĐT › Chi tiết vụ xét xử
      </div>
      <div style={{ background: "#fff", padding: "14px 20px 0", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, padding: 0, marginBottom: 12 }}>
          ← Chi tiết án xét xử – {row.maVuAn}
        </button>
        <div style={{ display: "flex", flexWrap: "nowrap" as const, overflowX: "auto" as const }}>
          {DETAIL_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: F, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? RED : "#4b5563",
              borderBottom: tab === t.key ? `2px solid ${RED}` : "2px solid transparent",
              whiteSpace: "nowrap" as const, marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {tab === "thong-tin" && <TabThongTin row={row} />}
        {tab === "thu-ly"    && <TabThuLy row={row} />}
        {tab === "phan-cong" && <TabPhanCong row={row} />}
        {tab === "to-trinh"  && <TabToTrinhXX row={row} />}
        {tab === "qd-bi-cao" && <TabQuyetDinhBiCao row={row} />}
        {tab === "qd-vu-an"  && <TabQuyetDinhVuAn row={row} />}
        {tab === "ket-qua" && <TabKetQua row={row} />}
      </div>
    </div>
  );
}

// ── Tab: Kết quả xét xử ──────────────────────────────────────────────────────

// ── TabKetQua helpers (module-level to avoid React re-mount issues) ───────────

const kqInpSt: React.CSSProperties = {
  padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`,
  borderRadius: 4, outline: "none", width: "100%", background: "#fff",
};
const kqSelSt: React.CSSProperties = { ...kqInpSt, appearance: "none" as const, cursor: "pointer" };
const kqLblSt: React.CSSProperties = { fontSize: 12, fontFamily: F, fontWeight: 600, color: TEXT, display: "flex", alignItems: "center", gap: 2 };

function KqField({ label, required: r = true, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, minWidth: 0 }}>
      <label style={kqLblSt}>{r && <span style={{ color: RED }}>*</span>} {label}</label>
      {children}
    </div>
  );
}

function KqSelect({ placeholder: ph }: { placeholder: string }) {
  return (
    <div style={{ position: "relative" as const, width: "100%" }}>
      <select style={kqSelSt}><option value="">{ph}</option></select>
      <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

function TabKetQua({ row }: { row: VuXetXuRow }) {
  const [apAnLe, setApAnLe] = useState<"khong" | "co">("khong");
  const [congBoBA, setCongBoBA] = useState<"co" | "khong">("co");
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([
    { id: 1, noi: "Viện kiểm sát", noiCT: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [vatChung] = useState<{ id: number; ten: string }[]>([]);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px", textAlign: "center" as const };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 10px", verticalAlign: "middle" as const };

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Mã vụ án", row.maVuAn, "Số – Ngày thụ lý xét xử", row.soNgayThuLy],
          ["Liên quan bản án sơ thẩm", row.soNgayBAQD, "Trạng thái", "Chưa xét xử"],
          ["Tòa ra bản án sơ thẩm", row.toaRABAQD, "Viện kiểm sát giải quyết", row.vienKiemSat],
          ["Thủ tục giải quyết", "Giám đốc thẩm", "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Kết quả giám đốc thẩm / tái thẩm */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Kết quả giám đốc thẩm, tái thẩm</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Ngày mở phiên tòa">
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Địa điểm">
              <KqSelect placeholder="Chọn địa điểm" />
            </KqField>
            <KqField label="Ngày quyết định" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input defaultValue="22/07/2026" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Số quyết định" required={false}>
              <input placeholder="nhập dữ liệu" style={kqInpSt} />
            </KqField>
          </div>
          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Người ký">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Ngày phát hành" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Điều luật">
              <KqSelect placeholder="Chọn căn cứ điều luật" />
            </KqField>
            <KqField label="Khoản">
              <KqSelect placeholder="Chọn điều khoản" />
            </KqField>
          </div>
          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Kết quả GĐT,TT">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Nguyên nhân">
              <KqSelect placeholder="Chọn nguyên nhân" />
            </KqField>
            <KqField label="Áp dụng án lệ" required={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["khong", "co"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="ap-an-le" checked={apAnLe === v} onChange={() => setApAnLe(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "khong" ? "Không" : "Có"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>
          {/* Row 4 – Có công bố bản án */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 12 }}>
            <KqField label="Có công bố bản án">
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["co", "khong"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="cong-bo" checked={congBoBA === v} onChange={() => setCongBoBA(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "co" ? "Có" : "Không"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>

          {/* Nơi nhận */}
          <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
        </div>
      </div>

      {/* Thông tin liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Thông tin liên quan</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nội dung vụ án</label>
            <textarea placeholder="Nhập nội dung vụ án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nhận định tòa án</label>
            <textarea placeholder="Nhập nhận định của tòa án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
        </div>
      </div>

      {/* Danh sách quyết định liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách quyết định liên quan</span>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: BG }}>
                <th rowSpan={3} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: 40 }}>STT</th>
                <th colSpan={2} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bị cáo/bị cáo</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>BA/QĐ sơ thẩm (PT/GĐT,TT)</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Quyết định GĐT,TT</th>
                <th rowSpan={3} style={{ ...TH, borderBottom: `1px solid ${BORDER}` }}>Thao tác</th>
              </tr>
              <tr style={{ background: BG }}>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Xét xử lại</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đối với hình phạt</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tên</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>1</td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Trần Phi Hùng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, textAlign: "center" as const, borderBottom: `1px solid ${BORDER}` }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}><Pencil size={12} /> Sửa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Xử lý vật chứng */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Xử lý vật chứng</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm mới</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["STT","Tên vật chứng, đồ vật, tài liệu","Số lượng","Tình trạng","Thuộc sở hữu của","Mô tả","Nơi lưu giữ","Hình thức xử lý","Trả lại cho","Thao tác"].map(h => (
                <th key={h} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vatChung.length === 0 && (
              <tr><td colSpan={10} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có vật chứng</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trách nhiệm dân sự */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Trách nhiệm dân sự</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm quan hệ bồi thường</button>
        </div>
        <div style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F, lineHeight: 1.8 }}>
          Chưa có mối quan hệ bồi thường nào. Nhấn "Thêm quan hệ bồi thường" để bắt đầu.
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, paddingBottom: 8 }}>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
        <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
      </div>
    </div>
  );
}

// ── Context menu ──────────────────────────────────────────────────────────────

function ContextMenu({ row, onClose, onXem }: { row: VuXetXuRow; onClose: () => void; onXem: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const item = (label: string, color: string, cb: () => void) => (
    <button key={label} onClick={() => { cb(); onClose(); }}
      style={{ display: "block", width: "100%", textAlign: "left" as const, padding: "8px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: F, color }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
    >{label}</button>
  );

  return (
    <div ref={ref} style={{ position: "absolute", right: 0, top: "100%", zIndex: 300, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 200, overflow: "hidden" }}>
      {item("👁 Xem chi tiết", TEXT, onXem)}
      {item("📅 Lịch xét xử", TEXT, () => {})}
      {item("📋 Biên bản xét xử", TEXT, () => {})}
      {item("📄 Bản án", TEXT, () => {})}
      {(row.trangThai === "chua-xx-chua-ds" || row.trangThai === "chua-xx-da-ds" || row.trangThai === "chua-thu-ly") && item("✏️ Chỉnh sửa", TEXT, onXem)}
      {(row.trangThai === "chua-xx-chua-ds" || row.trangThai === "chua-thu-ly") && item("🗑️ Xóa", "#ef4444", () => {})}
    </div>
  );
}

// ── Thêm vụ xét xử modal ─────────────────────────────────────────────────────

const MODAL_ROWS = [
  {
    stt: "01", soNgay: "Số: 54681378\nNgày: 10/07/2024",
    giaiDoan: "GIAI ĐOẠN: SƠ THẨM",
    soBA: "HS-ST020", ngayBA: "09/07/2024", tai: "Tòa án nhân dân huyện Phong Điền",
    ndkn: "Trần Văn Hải", ndd: "Nguyễn Đan Hải",
    ttv: "Trịnh Thị Minh Trang", ldv: "Lê Thị Thu Hiền", chuToa: true, tp: "Phạm Thị Bích Ngọc",
    ttBadge: "chua-xx", ttSub: "Chưa lên lịch xét xử", ttSubColor: MUTED,
  },
  {
    stt: "02", soNgay: "Số: 54681923\nNgày: 09/07/2024",
    giaiDoan: "GIAI ĐOẠN: SƠ THẨM",
    soBA: "214213HH", ngayBA: "08/07/2024", tai: "Tòa án nhân dân cấp cao",
    ndkn: "Đặng Thành Công", ndd: "Ô tô Kệ",
    ttv: "Võ Thị Thùy Giang", ldv: "Nguyễn Như Thắng", chuToa: false, tp: "Lê Thị Thu Hiền",
    ttBadge: "da-xx", ttSub: "Thời hạn xét xử: 19 ngày", ttSubColor: RED,
  },
  {
    stt: "03", soNgay: "Số: 54681813\nNgày: 08/07/2024",
    giaiDoan: "GIAI ĐOẠN: SƠ THẨM",
    soBA: "HS-ST018", ngayBA: "07/07/2024", tai: "Tòa án nhân dân TP. Cần Thơ",
    ndkn: "Ngô Mai Trang", ndd: "Phan Kim Ngân",
    ttv: "Vũ Diệu Thùy", ldv: "Phạm Thị Bích Ngọc", chuToa: false, tp: "Nguyễn Như Thắng",
    ttBadge: "rut-khang-nghi", ttSub: "Số QĐ: 5468/QĐ-CA\nNgày QĐ: 09/07/2026", ttSubColor: MUTED,
  },
];

function ThemVuXetXuModal({ onClose }: { onClose: () => void }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 14px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 14px", verticalAlign: "top" as const };

  const trangThaiBadge = (key: string) => {
    if (key === "chua-xx") return <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff" }}>CHƯA XÉT XỬ</span>;
    if (key === "da-xx")   return <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff" }}>ĐÃ XÉT XỬ</span>;
    return <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #2563eb`, borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: F, color: "#2563eb", background: "#eff6ff" }}>RÚT KHÁNG NGHỊ</span>;
  };

  const btn = (label: string, bg: string, color: string, border: string, onClick?: () => void) => (
    <button onClick={onClick ?? onClose} style={{ padding: "7px 18px", background: bg, color, border: `1px solid ${border}`, borderRadius: 4, fontSize: 13, fontFamily: F, fontWeight: 500, cursor: "pointer" }}>
      {label}
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "92vw", maxWidth: 1060, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18, color: RED }}>⚠</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách vụ xét xử đã chọn</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["STT", "SỐ & NGÀY THỤ LÝ", "THÔNG TIN BẢN ÁN / QUYẾT ĐỊNH", "ĐƯƠNG SỰ / NGƯỜI THAM GIA", "PHÂN CÔNG", "TRẠNG THÁI"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODAL_ROWS.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                  {/* STT */}
                  <td style={{ ...TD, textAlign: "center" as const, fontWeight: 700, color: TEXT, fontSize: 13 }}>{r.stt}</td>

                  {/* Số & Ngày thụ lý */}
                  <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.soNgay}</td>

                  {/* Thông tin BA/QĐ */}
                  <td style={TD}>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ display: "inline-block", padding: "2px 8px", background: RED, color: "#fff", borderRadius: 3, fontSize: 10, fontWeight: 700, fontFamily: F }}>{r.giaiDoan}</span>
                    </div>
                    <div style={{ fontSize: 12, fontFamily: F, lineHeight: 1.6 }}>
                      <div>Số BA: <b>{r.soBA}</b></div>
                      <div style={{ color: MUTED }}>Ngày {r.ngayBA}</div>
                      <div style={{ color: MUTED }}>Tại: {r.tai}</div>
                    </div>
                  </td>

                  {/* Đương sự */}
                  <td style={TD}>
                    <div style={{ fontSize: 12, fontFamily: F, lineHeight: 1.8 }}>
                      <div><span style={{ color: MUTED }}>NĐKN: </span>{r.ndkn}</div>
                      <div><span style={{ color: MUTED }}>NĐĐ: </span>{r.ndd}</div>
                    </div>
                  </td>

                  {/* Phân công */}
                  <td style={TD}>
                    <div style={{ fontSize: 12, fontFamily: F, lineHeight: 1.8 }}>
                      <div><span style={{ color: MUTED }}>TTV: </span>{r.ttv}</div>
                      <div><span style={{ color: MUTED }}>LĐV: </span>{r.ldv}</div>
                      {r.chuToa && (
                        <div style={{ margin: "3px 0" }}>
                          <span style={{ display: "inline-block", padding: "2px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 3, fontSize: 10, fontWeight: 700, fontFamily: F }}>CHỦ TỌA</span>
                        </div>
                      )}
                      <div><span style={{ color: MUTED }}>TP: </span>{r.tp}</div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td style={TD}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {trangThaiBadge(r.ttBadge)}
                      {r.ttSub && (
                        <span style={{ fontSize: 11, fontFamily: F, color: r.ttSubColor, fontStyle: r.ttSubColor === RED ? "italic" : "normal", whiteSpace: "pre-line" as const }}>{r.ttSub}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F, flex: 1 }}>
            Đã chọn <b style={{ color: TEXT }}>{MODAL_ROWS.length}</b> vụ án xét xử cho danh sách trình ký.
          </span>
          {btn("Đóng",       "#fff",  TEXT,   BORDER, onClose)}
          {btn("Lưu",        RED,     "#fff",  RED)}
          {btn("Lấy số",     "#fff",  TEXT,   BORDER)}
          {btn("Trình ký",   RED,     "#fff",  RED)}
          {btn("Xem biểu mẫu","#fff", TEXT,   BORDER)}
        </div>
      </div>
    </div>
  );
}

// ── Main list view ────────────────────────────────────────────────────────────

export default function QuanLyVuXetXuView() {
  const [activeTab, setActiveTab] = useState("tat-ca");
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [detail, setDetail] = useState<VuXetXuRow | null>(null);
  const [showThemModal, setShowThemModal] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const inSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" as const };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const fld = (lbl: string, type: "input" | "select" = "input", ph = "") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 120 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      {type === "select"
        ? <select style={selSt}><option>– Tất cả –</option></select>
        : <input placeholder={ph || lbl} style={inSt} />}
    </div>
  );

  const dateRange = (lbl: string) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 170 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input placeholder="Từ ngày" style={{ ...inSt, flex: 1 }} />
        <span style={{ fontSize: 10, color: MUTED }}>→</span>
        <input placeholder="Đến ngày" style={{ ...inSt, flex: 1 }} />
      </div>
    </div>
  );

  const filtered = ROWS.filter(r => {
    if (activeTab !== "tat-ca" && r.trangThai !== activeTab) return false;
    if (search && !r.tenVuAn.toLowerCase().includes(search.toLowerCase()) && !r.maVuAn.toLowerCase().includes(search.toLowerCase()) && !r.biCao.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (detail) return <ChiTietVuXetXuView row={detail} onBack={() => setDetail(null)} />;

  return (
    <>
    {showThemModal && <ThemVuXetXuModal onClose={() => setShowThemModal(false)} />}
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý GĐT/TT › Quản lý vụ xét xử GĐT › Danh sách
      </div>

      {/* Title + tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 10px" }}>Danh sách vụ xét xử GĐT</h2>
        <div style={{ display: "flex", flexWrap: "wrap" as const, overflowX: "auto" as const }}>
          {LIST_TABS.map(t => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setPage(1); }}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" as const }}>
                {t.label}{" "}
                <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 10 }}>
          {fld("Số thụ lý", "input", "Nhập số thụ lý")}
          {fld("Mã vụ án / Tên vụ án", "input", "Nhập mã hoặc tên")}
          {fld("Bị cáo / Đương sự", "input", "Nhập tên")}
          {dateRange("Ngày thụ lý")}

          {fld("Hội đồng xét xử", "select")}
        </div>
        {filterExpanded && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 10 }}>
            {dateRange("Ngày xét xử")}
            {fld("Phòng xét xử", "select")}
            {fld("Chủ tọa", "input", "Nhập tên chủ tọa")}
            {fld("Trạng thái", "select")}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setFilterExpanded(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}>
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <RotateCcw size={13} /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowThemModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Tạo danh sách vụ xét xử
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
          <Printer size={13} /> Xuất Excel
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" as const }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ XX</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/ QUYẾT ĐỊNH & QHPL</th>
              <th style={TH_STYLE}>ĐƯƠNG SỰ/ NGƯỜI THAM GIA TỐ TỤNG</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" as const }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
            )}
            {paginated.map((row, idx) => (
              <tr key={row.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                onClick={() => setDetail(row)}
              >
                <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" style={{ cursor: "pointer" }} />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" as const, color: MUTED, fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                {/* Số & Ngày thụ lý XX */}
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F, fontWeight: 600 }}>Số: {row.soThuLy}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Ngày: {row.ngayThuLy}</span>
                  </div>
                </td>

                {/* Thông tin BA/QĐ & QHPL */}
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 600, color: TEXT }}>Số BA: {row.soBA}</span>
                      <span style={{ color: MUTED }}> Ngày: {row.ngayBA}</span>
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Tại: {row.toa}</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                      <span style={{ display: "inline-block", padding: "1px 7px", background: "#fde8b0", color: "#7c5a00", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                        Cấp xét xử: {row.capXetXu}
                      </span>
                      <span style={{ display: "inline-block", padding: "1px 7px", background: "#dcfce7", color: "#15803d", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                        Thời hiệu: {row.thoiHieu}
                      </span>
                      {row.tag === "an-qh" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                          🏠 ÁN QH
                        </span>
                      )}
                      {row.tag === "an-tu-hinh" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fef2f2", color: RED, border: `1px solid ${RED}`, borderRadius: 10, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                          ● Án tử hình
                        </span>
                      )}
                      {row.tag === "an-chi-dao" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                          ★ Án chỉ đạo
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Đương sự */}
                <td style={TD_STYLE}>
                  <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.8 }}>
                    <div><span style={{ color: MUTED }}>NĐKN: </span>{row.ndkn}</div>
                    <div><span style={{ color: MUTED }}>NĐĐ: </span>{row.ndd}</div>
                  </div>
                </td>

                {/* Phân công */}
                <td style={TD_STYLE}>
                  <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.8 }}>
                    <div><span style={{ color: MUTED }}>TTV: </span>{row.ttv}</div>
                    <div><span style={{ color: MUTED }}>LĐV: </span>{row.ldv}</div>
                    <div><span style={{ color: MUTED }}>TP: </span>{row.tp}</div>
                  </div>
                </td>

                <td style={TD_STYLE}>
                  <TrangThaiCell row={row} />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setDetail(row)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, borderRadius: 4 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trong tổng {filtered.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...paginBtn, color: page === 1 ? MUTED : TEXT, cursor: page === 1 ? "default" : "pointer" }}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ ...paginBtn, background: p === page ? RED : "#fff", color: p === page ? "#fff" : TEXT, border: `1px solid ${p === page ? RED : BORDER}`, fontWeight: p === page ? 700 : 400 }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...paginBtn, color: page === totalPages ? MUTED : TEXT, cursor: page === totalPages ? "default" : "pointer" }}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>
    </div>
    </>
  );
}
