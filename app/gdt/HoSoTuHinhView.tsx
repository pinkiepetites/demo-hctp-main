import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, Eye, ChevronDown, ChevronUp, RotateCcw, FileText, Users, X, Send, Calendar, Trash2, Layers, Upload } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { PdfPreviewSlider } from "./PdfPreviewSlider";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { CapNhatVongTrinhModal } from "./AppHelpers";import { Button, Input } from "antd";


export const HS_LIST = [
  { id: "hs-1", soBA: "125/2023/HS-ST", ngayBA: "15/10/2023", toa: "Tòa án nhân dân tỉnh Long An", giaiDoan: "Sơ thẩm", tenVuAn: "Chu Văn An giết người", maVuAn: "VA26-000035", soBiAn: "01", trangThai: "cho-xu-ly", vuAnBadge: "Đang xét xử GĐT,TT", biAn: "Chu Văn An", cccd: "079088001234" },
  { id: "hs-2", soBA: "42/2024/HS-PT", ngayBA: "20/01/2024", toa: "Tòa án nhân dân cấp cao tại TP.HCM", giaiDoan: "Phúc thẩm", tenVuAn: "Nguyễn Văn B trộm cắp tài sản", maVuAn: "VA26-000042", soBiAn: "02", trangThai: "da-phan-cong", vuAnBadge: "", biAn: "Nguyễn Văn B", cccd: "079090005678" },
  { id: "hs-3", soBA: "15/2022/HS-PT", ngayBA: "12/02/2022", toa: "Tòa án nhân dân cấp cao tại Hà Nội", giaiDoan: "Phúc thẩm", tenVuAn: "Chu Văn An giết người", maVuAn: "VA26-000035", soBiAn: "03", trangThai: "cho-xu-ly", vuAnBadge: "", biAn: "Chu Văn An", cccd: "079088001234" },
  { id: "hs-4", soBA: "99/2025/HS-ST", ngayBA: "12/05/2025", toa: "Tòa án nhân dân tỉnh Quảng Ninh", giaiDoan: "Sơ thẩm", tenVuAn: "Trần Văn Hùng vận chuyển ma túy", maVuAn: "VA26-000088", soBiAn: "04", trangThai: "cho-xu-ly", vuAnBadge: "", biAn: "Trần Văn Hùng", cccd: "022085009911" },
  { id: "hs-5", soBA: "105/2025/HS-PT", ngayBA: "10/08/2025", toa: "TAND cấp cao tại Hà Nội", giaiDoan: "Phúc thẩm", tenVuAn: "Trần Văn Hùng giết người", maVuAn: "VA26-000088", soBiAn: "05", trangThai: "cho-xu-ly", vuAnBadge: "", biAn: "Trần Văn Hùng", cccd: "022085009911" },
];

export const DON_AN_GIAM_LIST = [
  {
    id: "ag-1",
    soDon: "ĐAG-2026/001",
    ngayNhan: "12/05/2026",
    biAn: "Chu Văn An",
    namSinh: "1988",
    cmnd: "079088001234",
    diaChi: "Huyện Đức Hòa, Tỉnh Long An",
    soBA: "125/2023/HS-ST",
    ngayBA: "15/10/2023",
    toiDanh: "Tội giết người và cướp tài sản",
    toaXu: "Tòa án nhân dân tỉnh Long An",
    trangThai: "dang-xem-xet",
    lanGui: "Lần 1",
    ttv: "Nguyễn Thị Thùy Liên",
    lanhDao: "Nguyễn Văn Hiền",
    lyDo: "Bị án có hoàn cảnh gia đình đặc biệt khó khăn, đã bồi thường khắc phục toàn bộ thiệt hại và gia đình có công với cách mạng.",
  },
  {
    id: "ag-2",
    soDon: "ĐAG-2026/002",
    ngayNhan: "20/06/2026",
    biAn: "Nguyễn Văn Tuấn",
    namSinh: "1992",
    cmnd: "001092008876",
    diaChi: "Huyện Mê Linh, TP Hà Nội",
    soBA: "42/2024/HS-PT",
    ngayBA: "20/01/2024",
    toiDanh: "Tội vận chuyển trái phép chất ma túy",
    toaXu: "TAND Cấp cao tại Hà Nội",
    trangThai: "trinh-chu-tich-nuoc",
    lanGui: "Lần 1",
    ttv: "Lý Thái Phúc",
    lanhDao: "Lê Thị Bình Ngọc",
    lyDo: "Bị án thành khẩn khai báo, lập công chuộc tội giúp cơ quan điều tra triệt phá đường dây ma túy lớn.",
  },
  {
    id: "ag-3",
    soDon: "ĐAG-2026/003",
    ngayNhan: "01/07/2026",
    biAn: "Hoàng Văn Bảy",
    namSinh: "1985",
    cmnd: "022085009911",
    diaChi: "TP Hạ Long, Tỉnh Quảng Ninh",
    soBA: "18/2024/HS-ST",
    ngayBA: "08/03/2024",
    toiDanh: "Tội giết người do vượt quá giới hạn phòng vệ chính đáng",
    toaXu: "Tòa án nhân dân tỉnh Quảng Ninh",
    trangThai: "da-co-quyet-dinh",
    lanGui: "Lần 2",
    ttv: "Phạm Thị Bích Ngọc",
    lanhDao: "Nguyễn Như Thắng",
    lyDo: "Có tình tiết mới giảm nhẹ đặc biệt theo quy định tại điểm b khoản 1 Điều 51 Bộ luật Hình sự.",
  },
];

export type TuHinhTabId = "don-xin-an-giam" | "ho-so-tu-hinh";

function AnGiamTrangThaiChip({ status }: { status: string }) {
  const map: Record<string, { label: string; dot: string; bg: string; color: string }> = {
    "dang-xem-xet": { label: "Đang xem xét", dot: "#3b82f6", bg: "#eff6ff", color: "#1d4ed8" },
    "trinh-chu-tich-nuoc": { label: "Đã trình CTN", dot: "#f59e0b", bg: "#fffbeb", color: "#92400e" },
    "da-co-quyet-dinh": { label: "Đã có QĐ ân giảm", dot: "#16a34a", bg: "#f0fdf4", color: "#065f46" },
  };
  const s = map[status] ?? { label: "Đang xử lý", dot: "#9ca3af", bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 14, fontWeight: 500, fontFamily: F, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

const PHAN_CONG_HS = { ttv: "Nguyễn Thị Thùy Liên", tp: "Phạm Thị Bích Ngọc", ld: "Nguyễn Văn Hiền" };

function HSTrangThaiChip({ status }: { status: string }) {
  const map: Record<string, { label: string; dot: string; bg: string; color: string }> = {
    "cho-xu-ly": { label: "Chờ xử lý", dot: "#9ca3af", bg: "#f3f4f6", color: "#374151" },
    "da-phan-cong": { label: "Đã phân công", dot: "#3b82f6", bg: "#eff6ff", color: "#1d4ed8" },
    "da-co-to-trinh": { label: "Đã có tờ trình", dot: "#f59e0b", bg: "#fffbeb", color: "#92400e" },
    "da-co-kqgq": { label: "Đã có KQGQ", dot: "#16a34a", bg: "#f0fdf4", color: "#065f46" },
  };
  const s = map[status] ?? map["cho-xu-ly"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 14, fontWeight: 500, fontFamily: F, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

type HSDetailTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "to-trinh" | "ket-qua" | "tai-lieu-vu-an" | "ho-so-tu-hinh";
type KetQuaSubTab = "toa-an" | "vks" | "ctn" | "xac-minh";

export function HoSoInfoGrid() {
  const cell: React.CSSProperties = { padding: "10px 14px", fontSize: 14, borderBottom: `1px solid ${BORDER}`, fontFamily: F, color: TEXT, verticalAlign: "top" };
  const lbl: React.CSSProperties = { ...cell, color: MUTED, width: "20%", fontWeight: 600, background: BG, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" };
  const val: React.CSSProperties = { ...cell, width: "80%" };

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <tbody>
          <tr>
            <td style={lbl}>Số – Ngày bản án</td>
            <td style={val}>125/2023/HS-ST – 15/10/2023</td>
          </tr>
          <tr>
            <td style={{ ...lbl, borderBottom: "none" }}>Tòa ra bản án</td>
            <td style={{ ...val, borderBottom: "none" }}>Tòa án nhân dân tỉnh Long An</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function HSPagination({ total }: { total: number }) {
  return (
    <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 14, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      <span>Hiển thị 1–{total} trong tổng số {total} bản ghi</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{"<"}</Button>
        <Button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}>1</Button>
        <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{">"}</Button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F }}><option>10 / trang</option></select>
        <span>Đến</span>
        <Input type="text" defaultValue="1" style={{ width: 36, padding: "3px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, textAlign: "center" }} />
        <span>Trang</span>
      </div>
    </div>
  );
}

function HSTHTaoToTrinhModal({ onClose }: { onClose: () => void }) {
  const [ngayLap, setNgayLap] = useState("");
  const [soToTrinh, setSoToTrinh] = useState("");

  const BI_AN_LIST = ["Chu Văn An", "Trần Văn Hùng", "Lê Văn Tám"];
  const [selectedBiAnList, setSelectedBiAnList] = useState<string[]>(["Chu Văn An", "Trần Văn Hùng"]);
  const [biAnDropdownOpen, setBiAnDropdownOpen] = useState(false);

  const [tomTatNoiDung, setTomTatNoiDung] = useState("");
  const [noiDungVuAn, setNoiDungVuAn] = useState("");
  const [quaTrinhGiaiQuyet, setQuaTrinhGiaiQuyet] = useState("");

  const [yKienRows, setYKienRows] = useState([
    {
      id: 1,
      biAn: "Chu Văn An",
      deXuat: "Kháng nghị",
      yKienChiTiet: "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC. Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC.",
    },
    {
      id: 2,
      biAn: "Trần Văn Hùng",
      deXuat: "Kháng nghị",
      yKienChiTiet: "",
    },
  ]);

  const toggleBiAnSelection = (name: string) => {
    setSelectedBiAnList(prev => {
      let next: string[];
      if (prev.includes(name)) {
        next = prev.filter(n => n !== name);
      } else {
        next = [...prev, name];
      }
      setYKienRows(prevRows => {
        const existingNames = prevRows.map(r => r.biAn);
        const newRows = [...prevRows];
        next.forEach((bName, idx) => {
          if (!existingNames.includes(bName)) {
            newRows.push({
              id: Date.now() + idx,
              biAn: bName,
              deXuat: "Ân giảm án tử hình",
              yKienChiTiet: "",
            });
          }
        });
        return newRows.filter(r => next.includes(r.biAn));
      });
      return next;
    });
  };

  const toggleSelectAllBiAn = () => {
    if (selectedBiAnList.length === BI_AN_LIST.length) {
      setSelectedBiAnList([]);
      setYKienRows([]);
    } else {
      setSelectedBiAnList([...BI_AN_LIST]);
      setYKienRows(BI_AN_LIST.map((bName, idx) => ({
        id: idx + 1,
        biAn: bName,
        deXuat: idx === 0 ? "Kháng nghị" : "Ân giảm án tử hình",
        yKienChiTiet: idx === 0 ? "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản..." : "",
      })));
    }
  };

  const inpStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", fontSize: 14,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, color: TEXT, outline: "none", background: "#fff",
    boxSizing: "border-box",
  };

  const lblStyle: React.CSSProperties = {
    fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 4, fontWeight: 500,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 4, marginTop: 14, textTransform: "uppercase",
  };

  const hrStyle: React.CSSProperties = {
    height: 1, background: "#e5e7eb", border: "none", margin: "4px 0 10px 0",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.45)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, fontFamily: F,
    }}>
      <div style={{
        background: "#fff", borderRadius: 8, width: 880, maxWidth: "95vw",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 12px 36px rgba(0,0,0,0.18)", overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff",
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Thêm mới tờ trình
          </h3>
          <Button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: TEXT }}
          >
            ✕
          </Button>
        </div>

        {/* Modal Body Scrollable */}
        <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Summary Box */}
          <div style={{
            background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 6,
            padding: "12px 16px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12,
            fontSize: 14, fontFamily: F,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div><span style={{ color: "#1d4ed8", fontWeight: 700 }}>Mã vụ án : </span><span style={{ color: TEXT }}>VA26-002039</span></div>
              <div><span style={{ color: "#1d4ed8", fontWeight: 700 }}>Tên vụ án : </span><span style={{ color: TEXT }}>Vụ án Nguyễn Văn Minh - Tội cướp tài sản</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div><span style={{ color: "#1d4ed8", fontWeight: 700 }}>Số BA : </span><span style={{ color: TEXT }}>Nguyễn Văn Minh</span></div>
              <div><span style={{ color: "#1d4ed8", fontWeight: 700 }}>Ngày BA : </span><span style={{ color: TEXT }}>Tội cướp tài sản</span></div>
              <div><span style={{ color: "#1d4ed8", fontWeight: 700 }}>Tòa xét xử : </span><span style={{ color: TEXT }}>Tội cướp tài sản</span></div>
            </div>
          </div>

          {/* Form Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={lblStyle}><span style={{ color: RED }}>* </span>Ngày lập tờ trình</label>
              <div style={{ position: "relative" }}>
                <Input
                  type="text"
                  value={ngayLap}
                  onChange={e => setNgayLap(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  style={inpStyle}
                />
                <Calendar size={14} color="#6b7280" style={{ position: "absolute", right: 10, top: 10, pointerEvents: "none" }} />
              </div>
            </div>

            <div>
              <label style={lblStyle}><span style={{ color: RED }}>* </span>Số tờ trình</label>
              <Input
                placeholder="Nhập số tờ trình"
                value={soToTrinh}
                onChange={e => setSoToTrinh(e.target.value)}
                style={inpStyle}
              />
            </div>

            <div style={{ position: "relative" }}>
              <label style={lblStyle}><span style={{ color: RED }}>* </span>BỊ ÁN</label>
              <div
                onClick={() => setBiAnDropdownOpen(o => !o)}
                style={{
                  ...inpStyle,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  userSelect: "none",
                  minHeight: 34,
                }}
              >
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: selectedBiAnList.length > 0 ? TEXT : MUTED, fontWeight: selectedBiAnList.length > 0 ? 600 : 400 }}>
                  {selectedBiAnList.length > 0
                    ? `${selectedBiAnList.length} bị án được chọn (${selectedBiAnList.join(", ")})`
                    : "Chọn các bị án..."}
                </span>
                <span style={{ fontSize: 10, color: MUTED, marginLeft: 6 }}>{biAnDropdownOpen ? "▲" : "▼"}</span>
              </div>

              {biAnDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 300, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginTop: 4, overflow: "hidden" }}>
                  <div style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}`, background: "#f9fafb", display: "flex", alignItems: "center", gap: 8 }}>
                    <Input
                      type="checkbox"
                      checked={selectedBiAnList.length === BI_AN_LIST.length}
                      ref={el => { if (el) el.indeterminate = selectedBiAnList.length > 0 && selectedBiAnList.length < BI_AN_LIST.length; }}
                      onChange={toggleSelectAllBiAn}
                      style={{ accentColor: RED, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Tất cả bị án ({BI_AN_LIST.length})</span>
                  </div>
                  <div style={{ maxHeight: 180, overflowY: "auto", padding: "4px 0" }}>
                    {BI_AN_LIST.map(name => {
                      const checked = selectedBiAnList.includes(name);
                      return (
                        <div
                          key={name}
                          onClick={() => toggleBiAnSelection(name)}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", background: checked ? "#fff5f5" : "#fff" }}
                        >
                          <Input
                            type="checkbox"
                            checked={checked}
                            onChange={() => { }}
                            style={{ accentColor: RED, cursor: "pointer" }}
                          />
                          <span style={{ fontSize: 14, color: TEXT, fontWeight: checked ? 600 : 400 }}>👤 {name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 12px", borderTop: `1px solid ${BORDER}`, background: "#f9fafb" }}>
                    <Button
                      onClick={() => setBiAnDropdownOpen(false)}
                      style={{ padding: "4px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section I */}
          <div>
            <div style={sectionTitleStyle}>I. THÔNG TIN BỊ ÁN</div>
            <div style={hrStyle} />
            <label style={lblStyle}><span style={{ color: RED }}>* </span>Thông tin bị án</label>
            <textarea
              placeholder="Nhập tóm tắt nội dung vụ án"
              value={tomTatNoiDung}
              onChange={e => setTomTatNoiDung(e.target.value)}
              rows={3}
              style={{ ...inpStyle, resize: "vertical", minHeight: 75 }}
            />
          </div>

          {/* Section II */}
          <div>
            <div style={sectionTitleStyle}>II. NỘI DUNG VỤ ÁN/HÀNH VI PHẠM TỘI</div>
            <div style={hrStyle} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={lblStyle}><span style={{ color: RED }}>* </span>Nội dung vụ án</label>
                <textarea
                  placeholder="Nhập quá trình giải quyết vụ án"
                  value={noiDungVuAn}
                  onChange={e => setNoiDungVuAn(e.target.value)}
                  rows={3}
                  style={{ ...inpStyle, resize: "vertical", minHeight: 75 }}
                />
              </div>

              <div>
                <label style={lblStyle}><span style={{ color: RED }}>* </span>Quá trình giải quyết</label>
                <textarea
                  placeholder="Nhập quá trình giải quyết vụ án"
                  value={quaTrinhGiaiQuyet}
                  onChange={e => setQuaTrinhGiaiQuyet(e.target.value)}
                  rows={3}
                  style={{ ...inpStyle, resize: "vertical", minHeight: 75 }}
                />
              </div>
            </div>
          </div>

          {/* Section III */}
          <div>
            <div style={sectionTitleStyle}>III. NỘI DUNG Ý KIẾN</div>
            <div style={{ border: `1px solid #fecaca`, borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ background: "#fff5f5", borderBottom: `1px solid #fecaca` }}>
                    <th style={{ ...TH_STYLE, width: 45, textAlign: "center", color: TEXT }}>STT</th>
                    <th style={{ ...TH_STYLE, width: 160, color: TEXT }}>Bị án tử hình</th>
                    <th style={{ ...TH_STYLE, color: TEXT }}>Đề xuất giải quyết Thẩm tra viên</th>
                    <th style={{ ...TH_STYLE, width: 90, textAlign: "center", color: TEXT }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {yKienRows.map((row, idx) => (
                    <tr key={row.id} style={{ borderBottom: idx < yKienRows.length - 1 ? `1px solid ${BORDER}` : "none", background: "#fff" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 14, verticalAlign: "top", paddingTop: 12 }}>{idx + 1}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, fontWeight: 700, color: TEXT, verticalAlign: "top", paddingTop: 12 }}>{row.biAn}</td>
                      <td style={{ ...TD_STYLE, padding: "8px 10px" }}>
                        <select
                          value={row.deXuat}
                          onChange={e => {
                            const val = e.target.value;
                            setYKienRows(prev => prev.map(r => r.id === row.id ? { ...r, deXuat: val } : r));
                          }}
                          style={{ ...inpStyle, width: "100%", marginBottom: 6 }}
                        >
                          <option value="Ân giảm án tử hình">Ân giảm án tử hình</option>
                          <option value="Không ân giảm án tử hình">Không ân giảm án tử hình</option>
                          <option value="Kháng nghị">Kháng nghị</option>
                          <option value="Không kháng nghị">Không kháng nghị</option>
                          <option value="Thi hành án sớm">Thi hành án sớm</option>
                          <option value="Chuyển hình phạt">Chuyển hình phạt</option>
                        </select>

                        <textarea
                          placeholder="Nhập ý kiến chi tiết..."
                          value={row.yKienChiTiet}
                          onChange={e => {
                            const val = e.target.value;
                            setYKienRows(prev => prev.map(r => r.id === row.id ? { ...r, yKienChiTiet: val } : r));
                          }}
                          rows={3}
                          style={{ ...inpStyle, border: "1px solid #fecaca", resize: "vertical", background: "#fff" }}
                        />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center", verticalAlign: "top", paddingTop: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {row.id === 2 && (
                            <Button
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb" }}
                              title="Đổi mẫu"
                            >
                              <Layers size={16} color="#2563eb" />
                            </Button>
                          )}
                          <Button
                            onClick={() => setYKienRows(prev => prev.filter(r => r.id !== row.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: RED }}
                            title="Xóa"
                          >
                            <Trash2 size={16} color={RED} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#f3f4f6",
          display: "flex", justifyContent: "center", gap: 12,
        }}>
          <Button
            onClick={onClose}
            style={{
              padding: "8px 28px", background: "#e5e7eb", color: TEXT,
              border: "none", borderRadius: 4, cursor: "pointer",
              fontSize: 14, fontFamily: F, fontWeight: 600,
            }}>
            Đóng
          </Button>
          <Button
            onClick={() => {
              alert("Đã lưu thông tin tờ trình thành công!");
              onClose();
            }}
            style={{
              padding: "8px 32px", background: "#800000", color: "#fff",
              border: "none", borderRadius: 4, cursor: "pointer",
              fontSize: 14, fontFamily: F, fontWeight: 700,
            }}>
            Lưu
          </Button>
        </div>

      </div>
    </div>
  );
}

// ── Modal Hồ sơ tờ trình (Hồ sơ kháng nghị / Hồ sơ tử hình) ──────────────────
function HoSoTuHinhFileModal({ onClose, loaiHoSo = "to-trinh" }: { onClose: () => void; loaiHoSo?: "khang-nghi" | "tu-hinh" | "to-trinh" }) {
  return <HoSoToTrinhModal onClose={onClose} />;
}


function HSTHThuHoiDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED }}>×</Button>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 14, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hủy</Button>
          <Button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</Button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Phân công (HSTH) ──────────────────────────────────────────────────────
export function HSTHTabPhanCong() {
  const thamPhanRows = [
    { stt: 3, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Chiêu", chucDanh: "TPTC", ngayPC: "21/07/2026", nguoiTT: "Nguyễn Văn Hiển – Phó CA", thoiGian: "14:30 – 21/07/2026", ghiChu: "Phân công lại" },
    { stt: 2, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Ngã", chucDanh: "TPB3", ngayPC: "01/07/2026", nguoiTT: "Nguyễn Văn Hòa – Phó CA", thoiGian: "14:30 – 01/07/2026", ghiChu: "TP về hưu" },
    { stt: 1, giaiDoan: "Thẩm tra hồ sơ", hoTen: "Hoàng Ngọc Hoa", chucDanh: "TPB3", ngayPC: "21/06/2026", nguoiTT: "Nguyễn Văn Hiển – Trưởng phòng VP HCTP", thoiGian: "14:30 – 21/06/2026", ghiChu: "–" },
  ];
  const ttvRows = [
    { stt: 3, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Chiêu", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/07/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/07/2026" },
    { stt: 2, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Ngã", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "01/07/2026", hoTenLD: "Nguyễn Văn Hòa", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "01/07/2026" },
    { stt: 1, giaiDoan: "Thẩm tra hồ sơ", hoTenTTV: "Hoàng Ngọc Hoa", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/06/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/06/2026" },
  ];
  const secHdr = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
      <Button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
        <RefreshCw size={13} color={MUTED} />
      </Button>
    </div>
  );
  return (
    <div style={{ padding: 20 }}>
      {/* Thông tin chung */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px 14px", fontSize: 14, borderBottom: `1px solid ${BORDER}`, fontFamily: F, color: MUTED, width: "20%", fontWeight: 600, background: BG, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>Số – Ngày bản án</td>
              <td style={{ padding: "10px 14px", fontSize: 14, borderBottom: `1px solid ${BORDER}`, fontFamily: F, color: TEXT, width: "80%" }}>125/2023/HS-ST – 15/10/2023</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 14px", fontSize: 14, fontFamily: F, color: MUTED, width: "20%", fontWeight: 600, background: BG, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>Tòa ra bản án</td>
              <td style={{ padding: "10px 14px", fontSize: 14, fontFamily: F, color: TEXT, width: "80%" }}>Tòa án nhân dân tỉnh Long An</td>
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
              <tr>{["STT", "HỌ VÀ TÊN THẨM PHÁN", "CHỨC DANH", "NGÀY PHÂN CÔNG", "NGƯỜI THAO TÁC", "GHI CHÚ"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {thamPhanRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 14 }}>{r.stt}</td>
                  {/* <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT }}>{r.giaiDoan}</td> */}
                  <td style={{ ...TD_STYLE, fontSize: 14, fontWeight: 600, color: TEXT }}>{r.hoTen}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, textAlign: "center" }}><Badge color="#1e40af" bg="#dbeafe">{r.chucDanh}</Badge></td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT, textAlign: "center" }}>{r.ngayPC}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT }}>
                    <div>{r.nguoiTT}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.thoiGian}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: MUTED }}>{r.ghiChu}</td>
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
              <tr>{["STT", "HỌ VÀ TÊN TTV", "CHỨC DANH TTV", "NGÀY PHÂN CÔNG TTV", "HỌ VÀ TÊN LĐ", "TÊN CHỨC VỤ LĐ", "NGÀY PHÂN CÔNG LĐ"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ttvRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 14 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, fontWeight: 600, color: TEXT }}>{r.hoTenTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT }}>{r.chucDanhTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT, textAlign: "center" }}>{r.ngayPCTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT }}>{r.hoTenLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT }}>{r.chucVuLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, color: TEXT, textAlign: "center" }}>{r.ngayPCLD}</td>
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
export function HSTHTabToTrinh() {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showCTNToTrinh, setShowCTNToTrinh] = useState(false);
  const [showQDKhangNghi, setShowQDKhangNghi] = useState(false);
  const [showQDKhongKhangNghi, setShowQDKhongKhangNghi] = useState(false);
  const [showTaoDuThaoDrop, setShowTaoDuThaoDrop] = useState(false);
  const [showTaoTTDrop, setShowTaoTTDrop] = useState(false);

  const [showGopHoSoPrompt, setShowGopHoSoPrompt] = useState(false);


  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [collapsedDocs, setCollapsedDocs] = useState<number[]>([]);

  const [lichSuData, setLichSuData] = useState([
    {
      ngayTrinh: "12/07/2026",
      lanh: "Dương Văn Hải",
      capTrinh: "Phó Chánh án",
      vanBan: "Tờ trình trình Chủ tịch nước số 1",
      biAn: "Chu Văn An, Trần Văn Hùng",
      yKien: "Ân giảm án tử hình: Chu Văn An\nKhông ân giảm án tử hình: Trần Văn Hùng",
      ngayDuyet: "12/07/2026",
      trangThai: "da-duyet",
      subRows: [{ label: "Dự thảo Tờ trình CTN 01", ngayDuyet: "12/07/2026" }],
    },
    {
      ngayTrinh: "10/07/2026",
      lanh: "Nguyễn Văn C",
      capTrinh: "Phó Chánh án",
      vanBan: "Tờ trình thẩm tra hồ sơ số 2",
      biAn: "Chu Văn An, Trần Văn Hùng",
      yKien: "Ân giảm: Chu Văn An\nKhông ân giảm: Trần Văn Hùng",
      ngayDuyet: "–",
      trangThai: "cho-duyet",
      subRows: [] as { label: string; ngayDuyet: string }[],
    },
    {
      ngayTrinh: "08/07/2026",
      lanh: "Nguyễn Văn B",
      capTrinh: "Thẩm phán",
      vanBan: "Tờ trình thẩm tra hồ sơ số 1",
      biAn: "Trần Văn Hùng",
      yKien: "Không ân giảm án tử hình: Trần Văn Hùng\nKháng nghị: Chu Văn An",
      ngayDuyet: "08/07/2026",
      trangThai: "da-duyet",
      subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }],
    },
    {
      ngayTrinh: "07/07/2026",
      lanh: "Nguyễn Văn A",
      capTrinh: "Thẩm phán",
      vanBan: "Tờ trình thẩm tra hồ sơ số 1",
      biAn: "Chu Văn An",
      yKien: "Kháng nghị: Chu Văn An\nKhông kháng nghị: Phạm Minh Tuấn",
      ngayDuyet: "07/07/2026",
      trangThai: "da-duyet",
      subRows: [],
    },
    {
      ngayTrinh: "06/07/2026",
      lanh: "Nguyễn Văn D",
      capTrinh: "Chánh án",
      vanBan: "Tờ trình thẩm tra hồ sơ số 1",
      biAn: "Lê Văn Tám",
      yKien: "Không ân giảm án tử hình: Lê Văn Tám (Hồ sơ thiếu biên bản thẩm tra, đề nghị bổ sung)",
      ngayDuyet: "06/07/2026",
      trangThai: "tu-choi",
      subRows: [],
    },
    {
      ngayTrinh: "04/07/2026",
      lanh: "Nguyễn Văn A",
      capTrinh: "Thẩm phán",
      vanBan: "Tờ trình xem xét ân giảm số 1",
      biAn: "Nguyễn Văn An",
      yKien: "Ân giảm án tử hình: Nguyễn Văn An (Có nhiều tình tiết giảm nhẹ mới)",
      ngayDuyet: "05/07/2026",
      trangThai: "da-duyet",
      subRows: [],
    },
  ]);

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình thẩm tra hồ sơ số 1", biAn: "Phạm Minh Tuấn", ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo trả lời đơn 0902345 số 1", biAn: "Nguyễn Văn An", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành" },
    { stt: 3, vanBan: "Thông báo trả lời đơn 0902344 số 2", biAn: "Trần Thị Hương", ngayTao: "09/07/2026", nguoiKy: "–", trangThai: "Chờ ký số" },
  ];

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 14, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 14, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <HSTHTaoToTrinhModal onClose={() => setShowTaoTT(false)} />}
      {showCTNToTrinh && <CTNTaoToTrinhModal onClose={() => setShowCTNToTrinh(false)} />}
      {showQDKhangNghi && <ModalQDKhangNghi onClose={() => setShowQDKhangNghi(false)} />}
      {showQDKhongKhangNghi && <ModalQDKhongKhangNghi onClose={() => setShowQDKhongKhangNghi(false)} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoTuHinhFileModal onClose={() => setShowHoSo(false)} loaiHoSo="to-trinh" />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
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
          <Button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Trình ký</Button>

          {/* Dropdown Tạo dự thảo */}
          <div style={{ position: "relative" }}>
            <Button
              onClick={() => { setShowTaoDuThaoDrop(v => !v); setShowTaoTTDrop(false); }}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}
            >
              Tạo dự thảo <ChevronDown size={12} />
            </Button>
            {showTaoDuThaoDrop && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", zIndex: 300, minWidth: 240, overflow: "hidden" }}>
                <Button
                  onClick={() => { setShowTaoDuThaoDrop(false); setShowTaoTT(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Tờ trình
                </Button>
                <Button
                  onClick={() => { setShowTaoDuThaoDrop(false); setShowCTNToTrinh(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Tờ trình trình Chủ tịch nước
                </Button>
                <Button
                  onClick={() => { setShowTaoDuThaoDrop(false); setShowQDKhangNghi(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Quyết định kháng nghị
                </Button>
                <Button
                  onClick={() => { setShowTaoDuThaoDrop(false); setShowQDKhongKhangNghi(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Quyết định không kháng nghị
                </Button>
              </div>
            )}
          </div>

          {/* Dropdown + Tạo tờ trình */}
          <div style={{ position: "relative" }}>
            <Button
              onClick={() => { setShowTaoTTDrop(v => !v); setShowTaoDuThaoDrop(false); }}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}
            >
              + Tạo tờ trình <ChevronDown size={12} color="#fff" />
            </Button>
            {showTaoTTDrop && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", zIndex: 300, minWidth: 220, overflow: "hidden" }}>
                <Button
                  onClick={() => { setShowTaoTTDrop(false); setShowTaoTT(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Tờ trình
                </Button>
                <Button
                  onClick={() => { setShowTaoTTDrop(false); setShowCTNToTrinh(true); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  Tờ trình trình Chủ tịch nước
                </Button>
              </div>
            )}
          </div>

          <Button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hồ sơ tờ trình</Button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 50 }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "TÊN VĂN BẢN", "BỊ ÁN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {vanBanRows.map((r, idx) => (
                <React.Fragment key={r.stt}>
                  <tr style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                    <td style={{ ...TD, color: "#2563eb", paddingLeft: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Button onClick={() => setCollapsedDocs(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx])} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center", borderRadius: 4, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                          {!collapsedDocs.includes(idx) ? <ChevronUp size={16} color="#0f172a" /> : <ChevronDown size={16} color="#64748b" />}
                        </Button>
                        <span style={{ fontWeight: 600 }}>{r.vanBan}</span>
                      </div>
                    </td>
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                          <Eye size={14} color="#0e7490" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {!collapsedDocs.includes(idx) && (
                    <tr style={{ background: "#f8fafc" }}>
                      <td colSpan={7} style={{ padding: "0 16px 16px 42px", borderBottom: `1px solid ${BORDER}` }}>
                        <div style={{ marginTop: 12, marginBottom: 8, fontWeight: 700, color: "#475569", fontSize: 14, fontFamily: F }}>
                          ↳ Lịch sử trình ký
                        </div>
                        <div style={{ borderRadius: 6, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700, background: "#fff" }}>
                            <thead style={{ background: "#f1f5f9" }}>
                              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "Ý KIẾN / BỊ ÁN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={{ padding: "8px 10px", fontWeight: 600, fontSize: 14, color: "#334155", textAlign: "left", borderBottom: `1px solid ${BORDER}` }}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                              {lichSuData.filter(ls => ls.vanBan === r.vanBan).length > 0 ? (
                                lichSuData.filter(ls => ls.vanBan === r.vanBan).map((ls, lsIdx) => {
                                  const realIdx = lichSuData.indexOf(ls);
                                  return (
                                    <React.Fragment key={"sub-" + realIdx}>
                                      <tr style={{ borderBottom: `1px solid #f1f5f9` }}>
                                      <td style={{ ...TD, textAlign: "center" as const, color: MUTED, width: 40 }}>{lsIdx + 1}</td>
                                      <td style={TD}>{ls.ngayTrinh}</td>
                                      <td style={TD}>{ls.lanh}</td>
                                      <td style={TD}>{ls.capTrinh}</td>
                                      <td style={{ ...TD, fontSize: 14 }}>
                                        <div style={{ color: MUTED, whiteSpace: "pre-line" }}>{ls.yKien}</div>
                                      </td>
                                      <td style={TD}>{ls.ngayDuyet}</td>
                                      <td style={TD}>
                                        {ls.trangThai === "cho-duyet"
                                          ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                                          : ls.trangThai === "tu-choi"
                                            ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                                            : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                                      </td>
                                      <td style={{ ...TD, textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                          <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                                            <Eye size={13} color="#0e7490" />
                                          </Button>
                                          {ls.trangThai === "cho-duyet" && (
                                            <Button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                              <RotateCcw size={13} color="#dc2626" />
                                            </Button>
                                          )}
                                          <Button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                            <Send size={13} color={RED} />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                    {ls.subRows && ls.subRows.map((sub, si) => (
                                      <tr key={"subrow-" + si} style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                                        <td style={{ ...TD, textAlign: "center", color: MUTED }} />
                                        <td colSpan={2} style={{ ...TD, paddingLeft: 28, fontSize: 14, color: MUTED }}>↳ {sub.label}</td>
                                        <td style={{ ...TD, fontSize: 14, color: MUTED }} colSpan={2}>Ngày: {sub.ngayDuyet}</td>
                                        <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                                        <td style={{ ...TD, textAlign: "center" }}>
                                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={13} color="#0e7490" /></Button>
                                            <Button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                              <Send size={13} color={RED} />
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={8} style={{ ...TD, textAlign: "center", color: MUTED, padding: 16 }}>
                                  Chưa có lịch sử trình ký
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type QDNoiNhanRow = { id: number; noiNhan: string; chiTiet: string; ghiChu: string; editing: boolean };

function QDNoiNhanTable({ rows, setRows }: { rows: QDNoiNhanRow[]; setRows: React.Dispatch<React.SetStateAction<QDNoiNhanRow[]>> }) {
  const inp: React.CSSProperties = { padding: "5px 8px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 3, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: F, flex: 1 }}>Nơi nhận</span>
        <Button onClick={() => setRows(p => [...p, { id: Date.now(), noiNhan: "", chiTiet: "", ghiChu: "", editing: true }])} style={{ padding: "5px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>Thêm nơi nhận</Button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: `1px solid ${BORDER}` }}>
        <colgroup>
          <col style={{ width: 40 }} /><col style={{ width: "22%" }} /><col style={{ width: "22%" }} /><col style={{ width: "30%" }} /><col style={{ width: 100 }} />
        </colgroup>
        <thead>
          <tr>{["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => <th key={h} style={{ ...TH_STYLE, borderRight: `1px solid ${BORDER}`, padding: "7px 10px" }}>{h}</th>)}</tr>
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
                    <Input value={r.ghiChu} onChange={e => setRows(p => p.map(x => x.id === r.id ? { ...x, ghiChu: e.target.value } : x))} placeholder="Nội dung ghi chú" style={inp} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <Button onClick={() => setRows(p => p.map(x => x.id === r.id ? { ...x, editing: false } : x))} style={{ fontSize: 14, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: F, marginRight: 6 }}>Lưu</Button>
                    <Button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ fontSize: 14, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: F }}>Hủy</Button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ ...TD_STYLE, fontSize: 14, borderRight: `1px solid ${BORDER}` }}>{r.noiNhan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, borderRight: `1px solid ${BORDER}` }}>{r.chiTiet}</td>
                  <td style={{ ...TD_STYLE, fontSize: 14, borderRight: `1px solid ${BORDER}` }}>{r.ghiChu}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <Button onClick={() => setRows(p => p.map(x => x.id === r.id ? { ...x, editing: true } : x))} style={{ fontSize: 14, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: F, marginRight: 6 }}>Sửa</Button>
                    <Button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ fontSize: 14, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: F }}>Xóa</Button>
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
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);

  const inp: React.CSSProperties = { padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };
  const req = <span style={{ color: RED }}>* </span>;

  const handleLaySo = () => {
    if (daLaySo) {
      setDaLaySo(false);
      setSoQuyetDinh("");
    } else {
      setDaLaySo(true);
      setSoQuyetDinh("128/2026/QĐ-TANDTC");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>{title}</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px", fontSize: 14, fontFamily: F }}>
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
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
          </div>

          {/* Row 1: 4 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>{req}Ngày quyết định</label>
              <Input placeholder="Chọn ngày quyết định" style={inp} />
            </div>
            <div>
              <label style={lbl}>Số quyết định</label>
              <Input
                placeholder="Nhập số quyết định"
                style={{
                  ...inp,
                  fontWeight: daLaySo ? 700 : 400,
                  color: daLaySo ? "#1e40af" : TEXT,
                }}
                value={soQuyetDinh}
                onChange={(e) => {
                  setSoQuyetDinh(e.target.value);
                  if (!e.target.value) setDaLaySo(false);
                }}
              />
            </div>
            <div>
              <label style={lbl}>{req}Người ký ban hành</label>
              <select style={inp}><option value="">Chọn người ký</option><option>Dương Văn Hải</option><option>Nguyễn Văn Hiển</option></select>
            </div>
            <div>
              <label style={lbl}>Ngày phát hành</label>
              <Input placeholder="dd/mm/yyyy" style={inp} />
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
              <Input placeholder="Nhập nội dung" style={inp} />
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
            <Button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px dashed ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
            <Button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Lưu</Button>
            <Button
              onClick={handleLaySo}
              style={{
                padding: "6px 18px",
                background: daLaySo ? "#fee2e2" : "#fff",
                color: RED,
                border: `2px dashed ${RED}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              {daLaySo ? "Hủy lấy số" : "Lấy số"}
            </Button>
            <Button
              onClick={() => setShowTrinhKyModal(true)}
              style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}
            >
              Trình ký
            </Button>
            <Button style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Xem biểu mẫu</Button>
          </div>
        </div>
      </div>
      {showTrinhKyModal && (
        <TrinhKyModal onClose={() => setShowTrinhKyModal(false)} />
      )}
    </div>
  );
}

export function ModalQDKhangNghi({ onClose }: { onClose: () => void }) {
  return <QDModal title="Quyết định kháng nghị" onClose={onClose} />;
}

export function ModalQDKhongKhangNghi({ onClose }: { onClose: () => void }) {
  return <QDModal title="Quyết định không kháng nghị" onClose={onClose} />;
}

// ── VKS-specific modals (simple form matching the design) ─────────────────────
function VKSQDModal({ title, onClose }: { title: string; onClose: () => void }) {
  const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box" as const, padding: "9px 12px", fontSize: 14, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", background: "#fff", color: TEXT };
  const lbl: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 500, color: TEXT, fontFamily: F, marginBottom: 6 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
          <div>
            <label style={lbl}>Số quyết định</label>
            <Input style={inp} placeholder="Nhập số quyết định" />
          </div>
          <div>
            <label style={lbl}>Ngày quyết định</label>
            <Input type="date" style={inp} />
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>Chọn tệp hoặc kéo thả vào đây</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={onClose} style={{ padding: "8px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}>Đóng</Button>
          <Button style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 700 }}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Thông tin VKS ─────────────────────────────────────────────────────────
export function VKSSubTab() {
  const [showDrop, setShowDrop] = useState(false);
  const [showKhangNghi, setShowKhangNghi] = useState(false);
  const [showKhong, setShowKhong] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "11px 12px", verticalAlign: "top" };

  return (
    <>
      {showKhangNghi && <VKSQDModal title="Tạo quyết định kháng nghị của Viện kiểm sát" onClose={() => setShowKhangNghi(false)} />}
      {showKhong && <VKSQDModal title="Tạo quyết định không kháng nghị của Viện kiểm sát" onClose={() => setShowKhong(false)} />}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <FileText size={15} color={RED} />
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Quyết định của Viện trưởng Viện kiểm sát</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <Input placeholder="Nhập từ khóa tìm kiếm..." style={{ padding: "6px 10px", fontSize: 14, border: "none", outline: "none", fontFamily: F, width: 200 }} />
              <Button style={{ padding: "6px 10px", background: RED, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Search size={13} color="#fff" />
              </Button>
            </div>
            <div ref={dropRef} style={{ position: "relative" }}>
              <Button onClick={() => setShowDrop(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, whiteSpace: "nowrap" }}>
                <Users size={13} /> Tạo quyết định <ChevronDown size={12} />
              </Button>
              {showDrop && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 220, overflow: "hidden" }}>
                  <Button onClick={() => { setShowDrop(false); setShowKhangNghi(true); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }} onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>Quyết định kháng nghị</Button>
                  <Button onClick={() => { setShowDrop(false); setShowKhong(true); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, borderTop: `1px solid ${BORDER}` }} onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>Quyết định không kháng nghị</Button>
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
              <td style={TD}>12/2026/VKS-KN</td>
              <td style={TD}>20/07/2026</td>
              <td style={TD}>Nguyễn Văn Hiển</td>
              <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã ký</Badge></td>
              <td style={TD}>
                <div style={{ fontSize: 14, color: TEXT }}>Nguyễn Văn Hiển</div>
                <div style={{ fontSize: 10, color: MUTED }}>20/07/2026 10:15:00</div>
              </td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={14} color="#0e7490" /></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 14, color: MUTED, fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Tổng 1 quyết định</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{"<"}</Button>
            <Button style={{ width: 26, height: 26, borderRadius: 9999, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}>1</Button>
            <Button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>{">"}</Button>
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
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };
  const req = <span style={{ color: RED }}>* </span>;
  const secHdr = (n: string, title: string, btn?: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{n}. {title}</span>
      {btn}
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình Chủ tịch nước</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px", fontSize: 14, fontFamily: F }}>
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
              <Input type="date" placeholder="dd/mm/yyyy" style={inp} />
            </div>
            <div>
              <label style={lbl}>{req}Số tờ trình</label>
              <Input placeholder="Nhập số tờ trình" style={inp} />
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
              <Button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Thêm đơn xử lý</Button>
            )}
            <label style={lbl}>{req}Nhận thấy của Tòa án nhân dân tối cao</label>
            <textarea value={nhanThay} onChange={e => setNhanThay(e.target.value)} placeholder="Nhập nội dung nhận thấy của Tòa án nhân dân tối cao" maxLength={4000} style={{ ...inp, minHeight: 100, resize: "vertical" }} />
            <div style={{ textAlign: "right", fontSize: 14, color: MUTED, fontFamily: F, marginTop: 2 }}>{nhanThay.length}/4000</div>
          </div>

          {/* IV. Nơi nhận */}
          <div style={{ marginBottom: 16 }}>
            {secHdr("IV", "NƠI NHẬN")}
            <QDNoiNhanTable rows={noiNhanRows} setRows={setNoiNhanRows} />
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <Button onClick={onClose} style={{ padding: "7px 28px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
            <Button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Lưu</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Cập nhật quyết định của Chủ tịch nước ─────────────────────────────
function CTNCapNhatQDModal({ onClose }: { onClose: () => void }) {
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 500 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Cập nhật quyết định của Chủ tịch nước</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Số quyết định</label>
            <Input placeholder="Nhập số quyết định" style={inp} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Ngày quyết định</label>
            <Input type="date" style={inp} />
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>Chọn tệp hoặc kéo thả vào đây</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
            <Button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Lưu</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CTNSubTab() {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showThemQD, setShowThemQD] = useState(false);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "8px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "10px 12px", verticalAlign: "top" };
  return (
    <>
      {showTaoTT && <CTNTaoToTrinhModal onClose={() => setShowTaoTT(false)} />}
      {showThemQD && <CTNCapNhatQDModal onClose={() => setShowThemQD(false)} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Danh sách tờ trình CTN */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách tờ trình Chủ tịch nước</span>
            <Button style={{ padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 600 }}>+ Tạo CV thu hồi</Button>
            <Button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 700 }}>+ Tạo tờ trình</Button>
            <label style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Upload size={14} /> Tải lên tờ trình đã có hiệu lực

              <Input type="file" style={{ display: "none" }} onChange={(e) => { if(e.target.files?.length) { setUploadFile(e.target.files[0].name); e.target.value = ''; } }} />
            </label>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} /><col style={{ width: "13%" }} /><col style={{ width: "14%" }} /><col style={{ width: "14%" }} /><col style={{ width: "13%" }} /><col style={{ width: "16%" }} /><col style={{ width: "16%" }} /><col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "SỐ QUYẾT ĐỊNH", "NGÀY QUYẾT ĐỊNH", "NGÀY PHÁT HÀNH", "NGƯỜI KÝ", "NGƯỜI TẠO", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              <tr style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
                <td style={TD}>.../TB-TA</td>
                <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
                <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
                <td style={TD}>Nguyễn Thị Bình</td>
                <td style={TD}>
                  <div style={{ fontSize: 14, color: TEXT }}>Nguyễn Tường Linh</div>
                  <div style={{ fontSize: 10, color: MUTED }}>23/07/2026 09:30:09</div>
                </td>
                <td style={TD}>
                  <div style={{ fontSize: 14, color: TEXT }}>Đang tạo</div>
                  <div style={{ fontSize: 10, color: MUTED }}>Chưa có hiệu lực</div>
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></Button>
                    <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.667 13 2 14l1-3.667L11.333 2z" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Button>
                    <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0-.667 9.333A1.333 1.333 0 0 1 10.667 14.667H5.333A1.333 1.333 0 0 1 4 13.333L3.333 4" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kết quả giải quyết CTN */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Kết quả giải quyết của Chủ tịch nước</span>
            <Button onClick={() => setShowThemQD(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 700 }}>+ Thêm quyết định</Button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} /><col style={{ width: "20%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} /><col style={{ width: "26%" }} /><col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "SỐ QUYẾT ĐỊNH CTN", "NGÀY QUYẾT ĐỊNH", "KẾT LUẬN CTN", "TÀI LIỆU ĐÍNH KÈM", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              <tr style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
                <td style={TD}>.../QĐ-CTN</td>
                <td style={{ ...TD, color: MUTED }}>Chưa cập nhật</td>
                <td style={TD}>Ân giảm</td>
                <td style={TD}>
                  <span style={{ fontSize: 14, color: "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
                    <span>📎</span> Chưa có tệp
                  </span>
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></Button>
                    <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.667 13 2 14l1-3.667L11.333 2z" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {uploadFile && (
        <CapNhatVongTrinhModal 
          fileName={uploadFile} 
          onClose={() => setUploadFile(null)} 
          onSave={() => { setUploadFile(null); alert("Cập nhật vòng trình thành công!"); }} 
        />
      )}
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
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 780, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24, overflow: "hidden" }}>
        {/* Header – dark red */}
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", background: "#7f1d1d" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: F, flex: 1 }}>Tạo công văn xác minh</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#fff" /></Button>
        </div>

        <div style={{ padding: "20px" }}>
          {/* THÔNG TIN CÔNG VĂN */}
          <div style={{ color: RED, fontWeight: 700, fontSize: 14, fontFamily: F, marginBottom: 14 }}>THÔNG TIN CÔNG VĂN</div>

          {/* Row 1: 4 fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 12px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>Ngày tạo CV</label>
              <div style={{ position: "relative" }}>
                <Input type="date" placeholder="Chọn ngày" style={{ ...inp, paddingRight: 32 }} />
              </div>
            </div>
            <div>
              <label style={lbl}>Số CV</label>
              <Input placeholder="Nhập số CV" style={inp} />
            </div>
            <div>
              <label style={lbl}>Người ký</label>
              <Input placeholder="Nhập người ký" style={inp} />
            </div>
            <div>
              <label style={lbl}>Tên công văn</label>
              <Input placeholder="Nhập tên công văn" style={inp} />
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
              <Input placeholder="Nhập đơn vị nhận" style={inp} />
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
          <div style={{ color: RED, fontWeight: 700, fontSize: 14, fontFamily: F, margin: "20px 0 14px" }}>KẾT QUẢ CÔNG VĂN</div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Ngày có kết quả</label>
            <div style={{ maxWidth: 220 }}>
              <Input type="date" placeholder="Chọn ngày" style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Tải file đính kèm</label>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fafafa" }}>
              <span style={{ fontSize: 20, marginRight: 8 }}>📄</span>
              <span style={{ fontSize: 14, color: TEXT, fontFamily: F, flex: 1 }}>cong_van_xac_minh_01.pdf</span>
              <Button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: RED, fontFamily: F, fontWeight: 600 }}>Xem chi tiết</Button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hủy</Button>
            <Button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>Lưu</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function XacMinhSubTab() {
  const [showTaoCV, setShowTaoCV] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "8px 10px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "10px 10px", verticalAlign: "top" };
  const inp: React.CSSProperties = { padding: "8px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };

  const cvRows = [
    { tt: 1, soCV: "124/CV-XM", tenCV: "Công văn xác minh lý lịch", ngayCV: "15/07/2026", donViNhan: "Công an Tỉnh", biAn: "Đặng Thìn Dương", ketQua: "Đã có", ngayKQ: "20/07/2026" },
    { tt: 2, soCV: "125/CV-XM", tenCV: "Công văn xác minh nhân thân", ngayCV: "16/07/2026", donViNhan: "Viện kiểm sát Tỉnh", biAn: "Nguyễn Văn A", ketQua: "Chưa có", ngayKQ: "21/07/2026" },
  ];
  const thaRows = [
    { stt: 1, biAn: "Đặng Thìn Dương", ketQua: "DA_THI_HANH", ngay: "25/07/2026", diaDiem: "Trại tạm giam Tỉnh" },
    { stt: 2, biAn: "Nguyễn Văn A", ketQua: "DA_THI_HANH", ngay: "26/07/2026", diaDiem: "Trại tạm giam Tỉnh" },
    { stt: 3, biAn: "Trần Thị B", ketQua: "CHUA_THI_HANH", ngay: "–", diaDiem: "–" },
  ];

  return (
    <>
      {showTaoCV && <TaoCongVanModal onClose={() => setShowTaoCV(false)} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Bảng công văn xác minh */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Bảng công văn xác minh</span>
            <Button onClick={() => setShowTaoCV(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 700 }}>+ Tạo công văn</Button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 640 }}>
              <colgroup>
                <col style={{ width: 36 }} /><col style={{ width: "10%" }} /><col style={{ width: "20%" }} /><col style={{ width: "11%" }} /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "9%" }} /><col style={{ width: "12%" }} /><col style={{ width: 60 }} />
              </colgroup>
              <thead>
                <tr>{["TT", "SỐ CÔNG VĂN", "TÊN CÔNG VĂN", "NGÀY CÔNG VĂN", "ĐƠN VỊ NHẬN", "BỊ ÁN", "KẾT QUẢ", "NGÀY CÓ KẾT QUẢ", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
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
                      <span style={{ color: r.ketQua === "Đã có" ? "#065f46" : "#dc2626", fontWeight: 600, fontSize: 14 }}>{r.ketQua}</span>
                    </td>
                    <td style={TD}>{r.ngayKQ}</td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color="#0e7490" /></Button>
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
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Kết quả Thi hành án</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} /><col style={{ width: "22%" }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col />
            </colgroup>
            <thead>
              <tr>{["STT", "BỊ ÁN", "KẾT QUẢ THI HÀNH ÁN", "NGÀY THI HÀNH ÁN", "ĐỊA ĐIỂM THI HÀNH ÁN"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
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
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 14 }}>Thông tin lưu hồ sơ án tử hình</div>
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
              <Input placeholder="Nhập tên người nhận" style={inp} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px", marginBottom: 12 }}>
            <div>
              <label style={lbl}>Đơn vị nhận</label>
              <Input placeholder="Nhập đơn vị nhận" style={inp} />
            </div>
            <div>
              <label style={lbl}><span style={{ color: RED }}>* </span>Ngày chuyển hồ sơ</label>
              <Input placeholder="Chọn ngày" style={inp} type="date" />
            </div>
            <div />
          </div>
          <div>
            <label style={lbl}>Ghi chú</label>
            <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú" maxLength={500} style={{ ...inp, minHeight: 80, resize: "vertical" }} />
            <div style={{ textAlign: "right", fontSize: 14, color: MUTED, fontFamily: F, marginTop: 2 }}>{ghiChu.length} / 500</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ModalThemMoiToTrinh({ onClose }: { onClose: () => void }) {
  return <HSTHTaoToTrinhModal onClose={onClose} />;
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

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "9px 12px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "11px 12px", verticalAlign: "top" };

  const DETAIL_TABS: Array<{ id: HSDetailTab; label: string }> = [
    { id: "thong-tin", label: "Thông tin hồ sơ" },
    { id: "danh-sach-don", label: "Danh sách đơn" },
    { id: "phan-cong", label: "Phân công" },
    { id: "to-trinh", label: "Tờ trình" },
    { id: "ket-qua", label: "Kết quả giải quyết" },
    { id: "tai-lieu-vu-an", label: "Tài liệu vụ án" },
    { id: "ho-so-tu-hinh", label: "Hồ sơ tử hình" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {showQDKhangNghi && <ModalQDKhangNghi onClose={() => setShowQDKhangNghi(false)} />}
      {showQDKhongKhangNghi && <ModalQDKhongKhangNghi onClose={() => setShowQDKhongKhangNghi(false)} />}
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontFamily: F }}>
          <span style={{ color: "#2563eb", cursor: "pointer" }}>Trang chủ</span>
          <span style={{ color: MUTED }}> / Quản lý án tử hình / Hồ sơ tử hình / </span>
          <strong style={{ color: TEXT }}>Chi tiết hồ sơ</strong>
        </span>
      </div>

      {/* Title */}
      <div style={{ padding: "12px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <Button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: TEXT, lineHeight: 1, padding: "0 4px 0 0" }}>←</Button>
        <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
          Hồ sơ tử hình – {hs.maVuAn} – ĐẶNG THÌN DƯƠNG
        </span>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, overflowX: "auto" }}>
        <div style={{ display: "flex", minWidth: "max-content" }}>
          {DETAIL_TABS.map(t => {
            const active = t.id === tab;
            return (
              <Button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "11px 18px", fontSize: 14, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </Button>
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

        {/* Tab: Danh sách đơn */}
        {tab === "danh-sach-don" && (
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

        {/* Tab: Kết quả giải quyết */}
        {tab === "ket-qua" && (
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

        {tab === "phan-cong" && <HSTHTabPhanCong />}
        {tab === "to-trinh" && <HSTHTabToTrinh />}
        {tab === "tai-lieu-vu-an" && (
          <div style={{ height: "calc(100vh - 210px)", minHeight: 560, width: "100%", overflow: "hidden" }}>
            <TaiLieuHoSoView vuAnId={hs.maVuAn} tenVuAn={hs.tenVuAn} />
          </div>
        )}
        {tab === "ho-so-tu-hinh" && <HSTHTabHoSoTuHinh maVuAn={hs.maVuAn} tenVuAn={hs.tenVuAn} />}
      </div>
    </div>
  );
}

export function HSTHTabHoSoTuHinh({ maVuAn, tenVuAn }: { maVuAn?: string; tenVuAn?: string }) {
  const [phamVi, setPhamVi] = useState<"hien-tai" | "tat-ca">("hien-tai");
  const [hienThiTheo, setHienThiTheo] = useState<"but-luc" | "tai-lieu">("but-luc");
  const [selectedDocId, setSelectedDocId] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const docs = [
    { id: 1, ten: "Bút lục 01: Bản án sơ thẩm 125/2023/HS-ST", trang: "01-15", ngay: "15/10/2023", tongTrang: 15, loai: "Bản án", donVi: "TAND tỉnh Long An" },
    { id: 2, ten: "Bút lục 02: Bản án phúc thẩm 48/2024/HS-PT", trang: "16-30", ngay: "20/03/2024", tongTrang: 15, loai: "Bản án", donVi: "TAND cấp cao tại TP.HCM" },
    { id: 3, ten: "Bút lục 03: Đơn xin ân giảm án tử hình", trang: "31-35", ngay: "10/01/2026", tongTrang: 5, loai: "Đơn xin ân giảm", donVi: "Bị án Chu Văn An" },
    { id: 4, ten: "Bút lục 04: Quyết định bác đơn ân giảm 15/QĐ-CTN", trang: "36-40", ngay: "15/02/2026", tongTrang: 5, loai: "Quyết định", donVi: "Chủ tịch nước" },
    { id: 5, ten: "Bút lục 05: Thông báo kết quả giải quyết đơn 45/TB-TANDTC", trang: "41-45", ngay: "28/02/2026", tongTrang: 5, loai: "Thông báo", donVi: "TAND tối cao" },
  ];

  const selectedDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, display: "flex", flexDirection: "column", height: "calc(100vh - 210px)", minHeight: 560, overflow: "hidden", fontFamily: F }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* PANEL TRÁI: Hồ sơ lưu trữ */}
        <div style={{ width: 280, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Header trái */}
          <div style={{ height: 42, padding: "0 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Hồ sơ lưu trữ tử hình</span>
            <Button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex", alignItems: "center" }} title="Tùy chọn">
              <Layers size={15} color={MUTED} />
            </Button>
          </div>

          {/* Controls filtering */}
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
            {/* 1. Phạm vi tải */}
            <div>
              <div style={{ fontSize: 14, color: MUTED, marginBottom: 5 }}>Phạm vi tải</div>
              <div style={{ background: "#f3f4f6", borderRadius: 6, padding: 3, display: "flex", gap: 2 }}>
                <Button
                  onClick={() => setPhamVi("hien-tai")}
                  style={{
                    flex: 1, padding: "5px 4px", fontSize: 14, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: phamVi === "hien-tai" ? "#fff" : "transparent",
                    color: phamVi === "hien-tai" ? TEXT : MUTED,
                    fontWeight: phamVi === "hien-tai" ? 600 : 400,
                    boxShadow: phamVi === "hien-tai" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Giai đoạn hiện tại
                </Button>
                <Button
                  onClick={() => setPhamVi("tat-ca")}
                  style={{
                    flex: 1, padding: "5px 4px", fontSize: 14, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: phamVi === "tat-ca" ? "#fff" : "transparent",
                    color: phamVi === "tat-ca" ? TEXT : MUTED,
                    fontWeight: phamVi === "tat-ca" ? 600 : 400,
                    boxShadow: phamVi === "tat-ca" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Tất cả giai đoạn
                </Button>
              </div>
            </div>

            {/* 2. Hiển thị theo */}
            <div>
              <div style={{ fontSize: 14, color: MUTED, marginBottom: 5 }}>Hiển thị theo</div>
              <div style={{ background: "#f3f4f6", borderRadius: 6, padding: 3, display: "flex", gap: 2 }}>
                <Button
                  onClick={() => setHienThiTheo("but-luc")}
                  style={{
                    flex: 1, padding: "5px 4px", fontSize: 14, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: hienThiTheo === "but-luc" ? "#fff" : "transparent",
                    color: hienThiTheo === "but-luc" ? TEXT : MUTED,
                    fontWeight: hienThiTheo === "but-luc" ? 600 : 400,
                    boxShadow: hienThiTheo === "but-luc" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Bút lục
                </Button>
                <Button
                  onClick={() => setHienThiTheo("tai-lieu")}
                  style={{
                    flex: 1, padding: "5px 4px", fontSize: 14, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: hienThiTheo === "tai-lieu" ? "#fff" : "transparent",
                    color: hienThiTheo === "tai-lieu" ? TEXT : MUTED,
                    fontWeight: hienThiTheo === "tai-lieu" ? 600 : 400,
                    boxShadow: hienThiTheo === "tai-lieu" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Tài liệu
                </Button>
              </div>
            </div>
          </div>

          {/* Danh sách văn bản/bút lục trong panel trái */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {docs.map(doc => {
              const active = selectedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => { setSelectedDocId(doc.id); setCurrentPage(1); }}
                  style={{
                    padding: "9px 10px", borderRadius: 6, cursor: "pointer",
                    background: active ? "#fff5f5" : "#fafafa",
                    border: `1px solid ${active ? "#fecaca" : BORDER}`,
                    borderLeft: active ? `3px solid ${RED}` : `1px solid ${BORDER}`,
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? RED : TEXT, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <FileText size={14} color={active ? RED : MUTED} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ flex: 1, lineHeight: 1.3 }}>{doc.ten}</span>
                  </div>
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 4, paddingLeft: 20, display: "flex", justifyContent: "space-between" }}>
                    <span>Trang: {doc.trang}</span>
                    <span>{doc.ngay}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Button */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, flexShrink: 0, background: "#fff" }}>
            <Button
              onClick={() => alert(`Đang tải xuống ${selectedDoc.ten}...`)}
              style={{
                width: "100%", padding: "7px 12px", background: "#fff", color: RED,
                border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 14,
                fontFamily: F, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <span>⤓</span> Tải hồ sơ lưu trữ xuống
            </Button>
          </div>
        </div>

        {/* PANEL PHẢI: Viewer xem tài liệu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", overflow: "hidden" }}>
          {/* Header panel phải - Toolbar */}
          <div style={{ height: 42, padding: "0 16px", borderBottom: `1px solid ${BORDER}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 350 }}>
              📄 {selectedDoc.ten}
            </span>

            {/* Viewer Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Trang */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: MUTED }}>
                <Button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: currentPage > 1 ? "pointer" : "not-allowed", opacity: currentPage > 1 ? 1 : 0.5 }}
                >
                  ‹
                </Button>
                <span>Trang <strong style={{ color: TEXT }}>{currentPage}</strong> / {selectedDoc.tongTrang}</span>
                <Button
                  disabled={currentPage >= selectedDoc.tongTrang}
                  onClick={() => setCurrentPage(p => Math.min(selectedDoc.tongTrang, p + 1))}
                  style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: currentPage < selectedDoc.tongTrang ? "pointer" : "not-allowed", opacity: currentPage < selectedDoc.tongTrang ? 1 : 0.5 }}
                >
                  ›
                </Button>
              </div>

              {/* Zoom */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, borderLeft: `1px solid ${BORDER}`, paddingLeft: 12 }}>
                <Button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14 }}>-</Button>
                <span style={{ fontSize: 14, color: TEXT, width: 45, textAlign: "center" }}>{zoom}%</span>
                <Button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14 }}>+</Button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, borderLeft: `1px solid ${BORDER}`, paddingLeft: 12 }}>
                <Button onClick={() => alert("Đang in văn bản...")} style={{ padding: "5px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, color: TEXT }}>
                  🖨 In
                </Button>
                <Button onClick={() => alert("Đang tải văn bản...")} style={{ padding: "5px 10px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                  ⤓ Tải file
                </Button>
              </div>
            </div>
          </div>

          {/* Body Preview Canvas Area */}
          <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <div style={{
              width: `${(680 * zoom) / 100}px`,
              minHeight: `${(880 * zoom) / 100}px`,
              background: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: `1px solid ${BORDER}`,
              padding: `${(40 * zoom) / 100}px`,
              fontFamily: "Times New Roman, serif",
              position: "relative",
              transition: "all 0.2s ease"
            }}>
              {/* Document Header */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: `${(13 * zoom) / 100}px` }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700 }}>{selectedDoc.donVi.toUpperCase()}</div>
                  <div style={{ borderBottom: "1px solid #000", paddingBottom: 2, display: "inline-block" }}>SỐ: {selectedDoc.trang.split("-")[0]}/2026/QĐ-TH</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2, display: "inline-block" }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ fontStyle: "italic", marginTop: 4 }}>Hà Nội, ngày {selectedDoc.ngay}</div>
                </div>
              </div>

              {/* Document Title */}
              <div style={{ textAlign: "center", margin: `${(30 * zoom) / 100}px 0`, fontSize: `${(16 * zoom) / 100}px`, fontWeight: 700, color: "#800000" }}>
                {selectedDoc.ten.toUpperCase()}
              </div>

              {/* Document Body */}
              <div style={{ fontSize: `${(14 * zoom) / 100}px`, lineHeight: 1.8, textAlign: "justify", textIndent: 24, color: "#111" }}>
                <p>Căn cứ Bộ luật Tố tụng Hình sự nước Cộng hòa xã hội chủ nghĩa Việt Nam;</p>
                <p>Căn cứ Bản án hình sự sơ thẩm số 125/2023/HS-ST ngày 15/10/2023 của Tòa án nhân dân tỉnh Long An đối với bị án Chu Văn An về tội Giết người;</p>
                <p>Căn cứ Bản án hình sự phúc thẩm số 48/2024/HS-PT ngày 20/03/2024 của Tòa án nhân dân cấp cao tại TP.Hồ Chí Minh giữ nguyên hình phạt Tử hình;</p>
                <p>Căn cứ Quyết định bác đơn xin ân giảm án tử hình số 15/QĐ-CTN ngày 15/02/2026 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam;</p>
                <p style={{ fontWeight: 700, marginTop: 12 }}>XÉT THẤY:</p>
                <p>Hồ sơ vụ án án tử hình đối với bị án Chu Văn An đã được rà soát đầy đủ, đảm bảo tính pháp lý, tuân thủ đúng quy định của pháp luật hình sự và tố tụng hình sự.</p>
              </div>

              {/* Red Stamp Seal Placeholder */}
              <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ fontSize: `${(11 * zoom) / 100}px`, color: "#555" }}>
                  <div><strong>Nơi nhận:</strong></div>
                  <div>- VKSNDTC;</div>
                  <div>- UBND Tỉnh;</div>
                  <div>- Lưu hồ sơ án tử hình.</div>
                </div>
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ fontWeight: 700, fontSize: `${(13 * zoom) / 100}px` }}>CHÁNH ÁN / TRƯỞNG BAN</div>
                  <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", fontWeight: 700, fontSize: 14, fontStyle: "italic" }}>
                    (Đã ký & Đóng dấu đỏ)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: `${(13 * zoom) / 100}px` }}>Nguyễn Văn Hiền</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Dữ liệu mẫu danh sách Hồ sơ tử hình theo quy tắc nghiệp vụ
const HO_SO_TU_HINH_TABLE_ROWS = [
  {
    stt: 1,
    maVTD: "VTD-2026-00356",
    ngayVTD: "10/02/2024",
    donViGui: "TAND cấp cao tại Hà Nội",
    badgeType: "dang-giai-quyet",
    soBA: "12/2024/HS-PT",
    ngayBA: "12/02/2024",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    biAnList: [
      { ten: "Chu Văn An", toiDanh: "Giết người", hinhPhatGDT: "" },
      { ten: "Lê Thị C", toiDanh: "Đồng phạm", hinhPhatGDT: "" },
      { ten: "Trần Văn B", toiDanh: "Cướp tài sản", hinhPhatGDT: "" },
    ],
    ttv: "Nguyễn Thị Thùy Liên",
    tp: "Phạm Thị Bích Ngọc",
    ld: "Nguyễn Văn Hiền",
    trangThai: "cho-xu-ly",
  },
  {
    stt: 2,
    maVTD: "VTD-2026-00357",
    ngayVTD: "10/02/2024",
    donViGui: "TAND cấp cao tại Hà Nội",
    badgeType: "da-giai-quyet",
    kqgq: "Trả lời đơn",
    soBA: "12/2024/HS-PT",
    ngayBA: "12/02/2024",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    biAnList: [
      { ten: "Chu Văn An", toiDanh: "Giết người", hinhPhatGDT: "" },
    ],
    ttv: "Nguyễn Thị Thùy Liên",
    tp: "Phạm Thị Bích Ngọc",
    ld: "Nguyễn Văn Hiền",
    trangThai: "cho-xu-ly",
  },
  {
    stt: 3,
    maVTD: "VTD-2026-00589",
    ngayVTD: "15/04/2024",
    donViGui: "VKSND tỉnh Đồng Nai",
    badgeType: "kqxx",
    kqxxText: "Đã có kết quả xét xử GĐT,TT",
    ketQua: "Giữ nguyên bản án",
    soBA: "55/2024/HS-ST",
    ngayBA: "18/04/2024",
    toaBA: "Tòa án nhân dân tỉnh Đồng Nai",
    biAnList: [
      { ten: "Trần Văn Đức", toiDanh: "Mua bán trái phép chất ma túy", hinhPhatGDT: "Tử hình" },
    ],
    ttv: "Nguyễn Thị Thùy Liên",
    tp: "Phạm Thị Bích Ngọc",
    ld: "Nguyễn Văn Hiền",
    trangThai: "da-phan-cong",
  },
  {
    stt: 4,
    maVTD: "VTD-2026-00612",
    ngayVTD: "28/06/2023",
    donViGui: "TAND cấp cao tại TP.HCM",
    badgeType: "kqxx",
    kqxxText: "Đã có kết quả xét xử GĐT,TT",
    ketQua: "Sửa bản án",
    soBA: "77/2023/HS-PT",
    ngayBA: "30/06/2023",
    toaBA: "Tòa án nhân dân cấp cao tại TP.HCM",
    biAnList: [
      { ten: "Võ Thị Hà", toiDanh: "Giết người", hinhPhatGDT: "Chung thân" },
      { ten: "Nguyễn Minh Tuấn", toiDanh: "Đồng phạm", hinhPhatGDT: "20 năm tù" },
    ],
    ttv: "Nguyễn Thị Thùy Liên",
    tp: "Phạm Thị Bích Ngọc",
    ld: "Nguyễn Văn Hiền",
    trangThai: "da-co-to-trinh",
  },
  {
    stt: 5,
    maVTD: "VTD-2026-00701",
    ngayVTD: "10/09/2024",
    donViGui: "VKSND tỉnh Nghệ An",
    badgeType: "kqxx",
    kqxxText: "Đã có kết quả xét xử GĐT,TT",
    ketQua: "Giữ nguyên bản án",
    soBA: "103/2024/HS-ST",
    ngayBA: "14/09/2024",
    toaBA: "Tòa án nhân dân tỉnh Nghệ An",
    biAnList: [
      { ten: "Phan Văn Khánh", toiDanh: "Cướp tài sản", hinhPhatGDT: "Tử hình" },
    ],
    ttv: "Nguyễn Thị Thùy Liên",
    tp: "Phạm Thị Bích Ngọc",
    ld: "Nguyễn Văn Hiền",
    trangThai: "da-co-kqgq",
  },
];

const DON_XIN_AN_GIAM_ROWS = [
  {
    stt: 1,
    maDon: "4984",
    cvChuyen: "31 - 05/06/2026",
    thuLyMoi: "2329241",
    hinhThuc: "Đơn đề nghị GĐT,TT",
    loaiDon: "Đơn xin ân giảm + kêu oan",
    nkn: "Đỗ Tất Đạt",
    biCao: "Vũ Hòa Hảo",
    ndd: "Võ Hoài Trâm",
    soBA: "HKTT_0506_05",
    ngayBA: "04/6/2026",
    toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    nguoiThaoTac: "Chu An",
    ngayThaoTac: "12/06/2026",
  },
  {
    stt: 2,
    maDon: "4985",
    cvChuyen: "31 - 05/06/2026",
    thuLyMoi: "2329241",
    hinhThuc: "Đơn đề nghị GĐT,TT",
    loaiDon: "Đơn xin ân giảm",
    nkn: "",
    biCao: "",
    ndd: "Võ Hoài Trâm",
    soBA: "HKTT_0506_05",
    ngayBA: "04/6/2026",
    toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    nguoiThaoTac: "-",
    ngayThaoTac: "",
  },
  {
    stt: 3,
    maDon: "4956",
    cvChuyen: "18 - 05/06/2026",
    thuLyMoi: "",
    hinhThuc: "Khác",
    loaiDon: "Đơn xin thi hành án sớm",
    nkn: "",
    biCao: "",
    ndd: "DANH THỊ SÀ RON",
    soBA: "HKTT_0506_05",
    ngayBA: "01/06/2026",
    toaBA: "Tòa án nhân dân khu vực 1 - Cần Thơ",
    nguoiThaoTac: "-",
    ngayThaoTac: "",
  },
  {
    stt: 4,
    maDon: "4971",
    cvChuyen: "22 - 07/06/2026",
    thuLyMoi: "",
    hinhThuc: "Khác",
    loaiDon: "Đơn xin ân giảm",
    nkn: "",
    biCao: "",
    ndd: "Phạm Văn Hải",
    soBA: "HKTT_0706_09",
    ngayBA: "07/6/2026",
    toaBA: "Tòa án nhân dân tỉnh Bình Phước",
    nguoiThaoTac: "-",
    ngayThaoTac: "",
  },
];


function ModalPhanCongTP({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 600, padding: 24, boxShadow: "0 12px 36px rgba(0,0,0,0.18)" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 18, color: "#1f2937" }}>Phân công Thẩm phán & Thẩm tra viên</h2>
        
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", padding: 12, borderRadius: 6, marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "#92400e", fontSize: 14 }}>Cảnh báo: Bị án đã có hồ sơ tử hình khác</div>
            <div style={{ fontSize: 14, color: "#b45309", marginTop: 4 }}>Bị án <strong>Chu Văn An</strong> hiện đang có Hồ sơ tử hình <strong>15/2022/HS-PT</strong>. Hệ thống gợi ý kế thừa phân công:</div>
            <ul style={{ fontSize: 14, color: "#b45309", marginTop: 4, paddingLeft: 20, marginBottom: 0 }}>
              <li>Thẩm phán: <strong>Phạm Thị Bích Ngọc</strong></li>
              <li>Thẩm tra viên: <strong>Nguyễn Thị Thùy Liên</strong></li>
              <li>Lãnh đạo vụ: <strong>Nguyễn Văn Hiền</strong></li>
            </ul>
          </div>
        </div>
        
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Thẩm phán</label>
            <Input defaultValue="Phạm Thị Bích Ngọc" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Thẩm tra viên</label>
            <Input defaultValue="Nguyễn Thị Thùy Liên" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Lãnh đạo vụ phụ trách</label>
            <Input defaultValue="Nguyễn Văn Hiền" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <Button onClick={onClose} style={{ padding: "8px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontFamily: F }}>Hủy</Button>
          <Button onClick={() => { alert("Phân công thành công!"); onClose(); }} style={{ padding: "8px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: F, fontWeight: 600 }}>Lưu phân công</Button>
        </div>
      </div>
    </div>
  );
}

export default function HoSoTuHinhView({
  initialTab = "ho-so-tu-hinh",
  userRole,
  setUserRole,
}: {
  initialTab?: TuHinhTabId;
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
} = {}) {
  const [activeTab, setActiveTab] = useState<TuHinhTabId>(initialTab);
  const [detail, setDetail] = useState<string | null>(null);
  const [previewDon, setPreviewDon] = useState<any>(null);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [showPhanCong, setShowPhanCong] = useState(false);

  const [nguoiDungDon, setNguoiDungDon] = useState("");
  const [soBanAn, setSoBanAn] = useState("");
  const [ngayBanAn, setNgayBanAn] = useState("");
  const [toaRaBanAn, setToaRaBanAn] = useState("");
  const [soCVChuyen, setSoCVChuyen] = useState("");
  const [ngayCVChuyen, setNgayCVChuyen] = useState("");
  const [loaiDon, setLoaiDon] = useState("");
  const [hinhThucDon, setHinhThucDon] = useState("");
  const [tinhTrangGDT, setTinhTrangGDT] = useState("");
  const [thuLyDon, setThuLyDon] = useState("");

  const [hsSoBA, setHsSoBA] = useState("");
  const [hsNgayBA, setHsNgayBA] = useState("");
  const [hsToaBA, setHsToaBA] = useState("");
  const [hsTinhTrang, setHsTinhTrang] = useState("");
  const [hsBiAn, setHsBiAn] = useState("");
  const [hsCCCD, setHsCCCD] = useState("");
  const [hsTTV, setHsTTV] = useState("");
  const [hsTP, setHsTP] = useState("");
  const [hsLD, setHsLD] = useState("");
  const [hsTrangThaiThuLy, setHsTrangThaiThuLy] = useState("");

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  if (detail) return <HoSoTuHinhDetailView id={detail} onBack={() => setDetail(null)} />;

  const TH_COL: React.CSSProperties = {
    padding: "9px 12px",
    background: "#f9fafb",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid #f3f4f6`,
    fontSize: 14,
    fontWeight: 700,
    color: "#4b5563",
    fontFamily: F,
    textAlign: "left",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
  };
  const TD_COL: React.CSSProperties = {
    padding: "10px 12px",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid #f3f4f6`,
    fontSize: 14,
    fontFamily: F,
    color: TEXT,
    verticalAlign: "top",
  };

  const inSt: React.CSSProperties = { padding: "6px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", color: TEXT, height: 32, boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer", color: MUTED };

  const fldInput = (lbl: string, val: string, setVal: (v: string) => void, ph: string) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 160 }}>
      <span style={{ fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder={ph} style={inSt} />
    </div>
  );

  const fldDate = (lbl: string, val: string, setVal: (v: string) => void, ph: string = "dd/mm/yyyy") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 160 }}>
      <span style={{ fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder={ph} style={{ ...inSt, paddingRight: 28 }} />
        <span style={{ position: "absolute", right: 8, color: MUTED, pointerEvents: "none", fontSize: 14 }}>📅</span>
      </div>
    </div>
  );

  const fldSelect = (lbl: string, val: string, setVal: (v: string) => void, ph: string = "Vui lòng chọn") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 160 }}>
      <span style={{ fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      <select value={val} onChange={(e) => setVal(e.target.value)} style={{ ...selSt, color: val ? TEXT : MUTED }}>
        <option value="">{ph}</option>
        <option value="1">Lựa chọn 1</option>
        <option value="2">Lựa chọn 2</option>
      </select>
    </div>
  );

  const handleResetFilter = () => {
    setNguoiDungDon(""); setSoBanAn(""); setNgayBanAn(""); setToaRaBanAn(""); setSoCVChuyen("");
    setNgayCVChuyen(""); setLoaiDon(""); setHinhThucDon(""); setTinhTrangGDT(""); setThuLyDon("");
    setHsSoBA(""); setHsNgayBA(""); setHsToaBA(""); setHsTinhTrang(""); setHsBiAn("");
    setHsTTV(""); setHsTP(""); setHsLD(""); setHsTrangThaiThuLy("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#fff" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontFamily: F, color: MUTED }}>
          Trang chủ › Quản lý hồ sơ tử hình › <strong style={{ color: TEXT }}>{activeTab === "don-xin-an-giam" ? "Đơn xin ân giảm" : "Hồ sơ tử hình"}</strong>
        </span>
      </div>

      {/* ── BỘ LỌC TÌM KIẾM ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        {filterExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {showPhanCong && <ModalPhanCongTP onClose={() => setShowPhanCong(false)} />}
          {activeTab === "don-xin-an-giam" ? (
              <>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {fldInput("Người đứng đơn", nguoiDungDon, setNguoiDungDon, "Người đứng đơn")}
                  {fldInput("Số bản án/quyết định", soBanAn, setSoBanAn, "Số bản án/quyết định")}
                  {fldDate("Ngày bản án/quyết định", ngayBanAn, setNgayBanAn, "Vui lòng chọn")}
                  {fldSelect("Tòa ra bản án/quyết định", toaRaBanAn, setToaRaBanAn, "Vui lòng chọn")}
                  {fldInput("Số công văn chuyển", soCVChuyen, setSoCVChuyen, "Số công văn chuyển")}
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {fldDate("Ngày công văn chuyển", ngayCVChuyen, setNgayCVChuyen, "Ngày công văn chuyển")}
                  {fldSelect("Loại đơn", loaiDon, setLoaiDon, "Vui lòng chọn")}
                  {fldSelect("Hình thức đơn", hinhThucDon, setHinhThucDon, "Vui lòng chọn")}
                  {fldSelect("Tình trạng giải quyết GĐT,TT", tinhTrangGDT, setTinhTrangGDT, "Vui lòng chọn")}
                  {fldSelect("Thụ lý đơn", thuLyDon, setThuLyDon, "Thụ lý đơn")}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {fldInput("Số BA/QĐ", hsSoBA, setHsSoBA, "Nhập số BA/QĐ")}
                  {fldDate("Ngày BA/QĐ", hsNgayBA, setHsNgayBA, "dd/mm/yyyy")}
                  {fldSelect("Tòa ra BA/QĐ", hsToaBA, setHsToaBA, "Vui lòng chọn")}
                  {fldSelect("Tình trạng giải quyết GĐT,TT", hsTinhTrang, setHsTinhTrang, "Vui lòng chọn")}
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {fldInput("Bị án", hsBiAn, setHsBiAn, "Họ tên bị án")}
                  {fldInput("CCCD Bị án", hsCCCD, setHsCCCD, "Nhập CCCD Bị án")}
                  {fldInput("Thẩm tra viên", hsTTV, setHsTTV, "Chọn thẩm tra viên")}
                  {fldInput("Thẩm phán", hsTP, setHsTP, "Chọn thẩm phán")}
                  {fldInput("Lãnh đạo", hsLD, setHsLD, "Chọn lãnh đạo")}
                  {fldSelect("Trạng thái thụ lý", hsTrangThaiThuLy, setHsTrangThaiThuLy, "Vui lòng chọn")}
                </div>
              </>
            )}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button onClick={() => setFilterExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#2563eb", fontFamily: F, padding: 0 }}>
            {filterExpanded ? <ChevronDown size={14} style={{ transform: "rotate(180deg)" }} /> : <ChevronDown size={14} />} {filterExpanded ? "Thu gọn" : "Mở rộng"}
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>
              <Search size={13} /> Tìm kiếm
            </Button>
            
            <Button onClick={() => alert("Đã quét và chuyển 2 hồ sơ đủ điều kiện sang màn Chuyển hình phạt!")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 600 }}>
              <Layers size={13} /> Rà soát ĐK Chuyển HP
            </Button>
            <Button onClick={handleResetFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>
              <RefreshCw size={12} color={MUTED} /> Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 20px 4px", background: "#fff", flexShrink: 0 }}>
        <Button style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }} title="Tải lại danh sách"><RefreshCw size={13} color={MUTED} /></Button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px 12px" }}>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden", background: "#fff" }}>
          {activeTab === "don-xin-an-giam" ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1150 }}>
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: 60 }} />
                  <col style={{ width: 230 }} />
                  <col style={{ width: 190 }} />
                  <col style={{ width: 220 }} />
                  <col style={{ width: 260 }} />
                  <col style={{ width: 180 }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ ...TH_COL, textAlign: "center" }}><Input type="checkbox" /></th>
                    <th style={{ ...TH_COL, textAlign: "center" }}>STT</th>
                    <th style={TH_COL}>THÔNG TIN ĐƠN</th>
                    <th style={TH_COL}>LOẠI ĐƠN</th>
                    <th style={TH_COL}>ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN</th>
                    <th style={TH_COL}>THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT</th>
                    <th style={TH_COL}>NGƯỜI THAO TÁC</th>
                    <th style={{ ...TH_COL, textAlign: "center" }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {DON_XIN_AN_GIAM_ROWS.map((row, idx) => (
                    <tr key={row.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderTop: idx > 0 ? `1px solid ${BORDER}` : "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")} onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}>
                      <td style={{ ...TD_COL, textAlign: "center" }}><Input type="checkbox" /></td>
                      <td style={{ ...TD_COL, textAlign: "center", color: MUTED }}>{row.stt}</td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          <div><span style={{ color: MUTED }}>Mã đơn: </span><strong style={{ color: "#1e40af" }}>{row.maDon}</strong></div>
                          <div><span style={{ color: MUTED }}>CV chuyển: </span>{row.cvChuyen}</div>
                          {row.thuLyMoi && (<div><span style={{ color: MUTED }}>Thụ lý mới: </span>{row.thuLyMoi}</div>)}
                          <div><span style={{ color: MUTED }}>Hình thức: </span>{row.hinhThuc}</div>
                        </div>
                      </td>
                      <td style={TD_COL}><div style={{ lineHeight: 1.5 }}>{row.loaiDon}</div></td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          {row.nkn && (<div><span style={{ color: MUTED }}>NKN: </span>{row.nkn}</div>)}
                          {row.biCao && (<div><span style={{ color: MUTED }}>Bị cáo: </span>{row.biCao}</div>)}
                          {row.ndd && (<div><span style={{ color: MUTED }}>NĐĐ: </span>{row.ndd}</div>)}
                        </div>
                      </td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          <div><span style={{ color: MUTED }}>Số BA: </span><strong>{row.soBA}</strong></div>
                          <div><span style={{ color: MUTED }}>Ngày: </span>{row.ngayBA}</div>
                          <div><span style={{ color: MUTED }}>Tại: </span>{row.toaBA}</div>
                        </div>
                      </td>
                      <td style={TD_COL}>{row.nguoiThaoTac !== "-" ? (<div style={{ lineHeight: 1.5, fontSize: 14 }}><div><span style={{ color: MUTED }}>Người thao tác: </span>{row.nguoiThaoTac}</div><div style={{ color: MUTED }}>{row.ngayThaoTac}</div></div>) : (<div style={{ color: MUTED }}>-</div>)}</td>
                      <td style={{ ...TD_COL, textAlign: "center" }}><Button onClick={() => setPreviewDon?.(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem chi tiết đơn"><Eye size={15} color="#059669" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  borderTop: `1px solid ${BORDER}`,
                  background: "#fff",
                  fontSize: 14,
                  color: MUTED,
                  fontFamily: F,
                }}
              >
                <span>Hiển thị 1-4 trong tổng 4 bản ghi</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#f9fafb", cursor: "not-allowed", fontSize: 14, color: "#9ca3af" }} disabled>‹</Button>
                  <Button style={{ width: 26, height: 26, borderRadius: 4, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>1</Button>
                  <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#f9fafb", cursor: "pointer", fontSize: 14, color: "#374151" }}>›</Button>
                  <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, background: "#fff", cursor: "pointer", marginLeft: 8 }}>
                    <option>10 / trang</option>
                    <option>20 / trang</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
                <colgroup>
                  <col style={{ width: 60 }} />
                  <col style={{ width: 280 }} />
                  <col style={{ width: 250 }} />
                  <col style={{ width: 260 }} />
                  <col style={{ width: 200 }} />
                  <col style={{ width: 160 }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ ...TH_COL, textAlign: "center" }}>STT</th>
                    <th style={TH_COL}>THÔNG TIN HỒ SƠ</th>
                    <th style={TH_COL}>THÔNG TIN BA/QĐ</th>
                    <th style={TH_COL}>BỊ ÁN & TỘI DANH</th>
                    <th style={TH_COL}>PHÂN CÔNG</th>
                    <th style={{ ...TH_COL, textAlign: "center" }}>TRẠNG THÁI</th>
                    <th style={{ ...TH_COL, textAlign: "center" }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {HO_SO_TU_HINH_TABLE_ROWS.map((row, idx) => (
                    <tr
                      key={row.stt}
                      style={{
                        background: idx % 2 === 0 ? "#fff" : "#fafafa",
                        borderTop: idx > 0 ? `1px solid ${BORDER}` : "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                    >
                      <td style={{ ...TD_COL, textAlign: "center", color: MUTED, fontWeight: 500, whiteSpace: "nowrap" }}>
                        {row.stt}
                      </td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          <div>
                            <span style={{ color: MUTED }}>Mã VTĐ: </span>
                            <span style={{ color: "#1e40af", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} onClick={() => setDetail("hs-1")}>
                              {row.maVTD}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: MUTED }}>Ngày VTĐ: </span>
                            <span>{row.ngayVTD}</span>
                          </div>
                          <div>
                            <span style={{ color: MUTED }}>Đơn vị gửi: </span>
                            <span>{row.donViGui}</span>
                          </div>

                        </div>
                      </td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><strong>{row.soBA}</strong></div>
                          <div><span style={{ color: MUTED }}>Ngày BA/QĐ: </span><span>{row.ngayBA}</span></div>
                          <div><span style={{ color: MUTED }}>Tại: </span><span>{row.toaBA}</span></div>
                        </div>

                        {row.badgeType === "kqxx" && (
                          <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#6b21a8" bg="#f3e8ff">{row.kqxxText}</Badge>
                            <div style={{ fontSize: 14, color: "#3b82f6", marginTop: 2 }}>
                              <span style={{ color: MUTED }}>Kết quả: </span>
                              <strong>{row.ketQua}</strong>
                            </div>
                          </div>
                        )}

                        {row.badgeType === "da-giai-quyet" && (
                          <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ fontSize: 14, color: "#b91c1c", fontWeight: 700 }}>
                              Đã giải quyết đơn
                            </div>
                            <div style={{ fontSize: 14, color: "#059669" }}>
                              <span style={{ color: MUTED }}>KQGQ: </span>
                              <strong>{row.kqgq}</strong>
                            </div>
                          </div>
                        )}

                        {row.badgeType === "dang-giai-quyet" && (
                          <div style={{ marginTop: 4 }}>
                            <div style={{ fontSize: 14, color: "#d97706", fontWeight: 700 }}>
                              Đang giải quyết đơn
                            </div>
                          </div>
                        )}

                      </td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6 }}>
                          {row.biAnList.map((biAn, bIdx) => (
                            <div key={bIdx} style={{ marginBottom: bIdx < row.biAnList.length - 1 ? 6 : 0, paddingBottom: bIdx < row.biAnList.length - 1 ? 4 : 0, borderBottom: bIdx < row.biAnList.length - 1 ? "1px dashed #f3f4f6" : "none" }}>
                              <div>
                                <span style={{ fontWeight: 600, color: TEXT }}>{biAn.ten}</span>
                                <span style={{ color: MUTED }}> – </span>
                                <span style={{ color: RED, fontWeight: 500 }}>{biAn.toiDanh}</span>
                              </div>
                              {biAn.hinhPhatGDT && (
                                <div style={{ fontSize: 14, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ color: MUTED }}>Hình phạt sau GĐT: </span>
                                  <span style={{ color: biAn.hinhPhatGDT === "Tử hình" ? "#dc2626" : "#2563eb", fontWeight: 700, background: biAn.hinhPhatGDT === "Tử hình" ? "#fef2f2" : "#eff6ff", padding: "1px 6px", borderRadius: 4 }}>
                                    {biAn.hinhPhatGDT}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={TD_COL}>
                        <div style={{ lineHeight: 1.6, fontSize: 14 }}>
                          <div><span style={{ color: MUTED }}>TTV: </span><span>{row.ttv}</span></div>
                          <div><span style={{ color: MUTED }}>TP: </span><span>{row.tp}</span></div>
                          <div><span style={{ color: MUTED }}>LĐ: </span><span>{row.ld}</span></div>
                        </div>
                      </td>
                      <td style={{ ...TD_COL, textAlign: "center", whiteSpace: "nowrap" }}>
                        <HSTrangThaiChip status={row.trangThai} />
                      </td>
                      <td style={{ ...TD_COL, textAlign: "center", whiteSpace: "nowrap" }}>
                        <Button onClick={() => setDetail("hs-1")} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem chi tiết hồ sơ tử hình"><Eye size={15} color="#059669" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 14, color: MUTED, fontFamily: F }}>
                <span>Hiển thị 1-5 trong tổng 5 bản ghi</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#f9fafb", cursor: "not-allowed", fontSize: 14, color: "#9ca3af" }} disabled>‹</Button>
                  <Button style={{ width: 26, height: 26, borderRadius: 4, background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>1</Button>
                  <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#f9fafb", cursor: "pointer", fontSize: 14, color: "#374151" }}>›</Button>
                  <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 14, background: "#fff", cursor: "pointer", marginLeft: 8 }}>
                    <option>10 / trang</option>
                    <option>20 / trang</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <PdfPreviewSlider don={previewDon} onClose={() => setPreviewDon(null)} />
    </div>
  );
}
