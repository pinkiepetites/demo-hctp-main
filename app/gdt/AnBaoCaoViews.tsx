import React, { useState } from "react";
import {
  FileText,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Search,
  Printer,
  Download,
  Hand,
  Grid,
  Edit3,
  Save,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG } from "./shared";

// Common Form Controls Styling
const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 34,
  padding: "0 10px",
  fontSize: 12,
  fontFamily: F,
  color: TEXT,
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
  paddingRight: 26,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 500,
  color: MUTED,
  marginBottom: 4,
};

function FormSelect({ label, placeholder, value, onChange, options = [] }: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  options?: string[];
}) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">{placeholder || "Vui lòng chọn"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function FormInput({ label, value, defaultValue, placeholder, onChange }: {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function FormDate({ label, placeholder = "Chọn ngày" }: { label: string; placeholder?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: 28 }}
        />
        <Calendar size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ── Word Ribbon Toolbar Component ─────────────────────────────────────────────
function WordToolbar({
  isEditing,
  onToggleEdit,
  onAddRow,
  onSave,
  totalPages = 2,
}: {
  isEditing: boolean;
  onToggleEdit: () => void;
  onAddRow?: () => void;
  onSave?: () => void;
  totalPages?: number;
}) {
  const formatDoc = (cmd: string, value: string | undefined = undefined) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: "4px 4px 0 0", background: "#fafafa", overflow: "hidden", fontFamily: F }}>
      {/* Top Bar Controls & Mode Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#f5f5f5", borderBottom: `1px solid ${BORDER}`, fontSize: 12, flexWrap: "wrap" }}>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }} title="Side panel">
          <Grid size={14} color={MUTED} />
        </button>
        <div style={{ width: 1, height: 16, background: BORDER, margin: "0 2px" }} />
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <ChevronUp size={14} color={MUTED} />
        </button>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <ChevronDown size={14} color={MUTED} />
        </button>
        <input
          type="text"
          defaultValue="1"
          style={{ width: 28, height: 22, textAlign: "center", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 2 }}
        />
        <span style={{ color: MUTED }}>/{totalPages}</span>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <ChevronDown size={12} color={MUTED} />
        </button>

        <div style={{ width: 1, height: 16, background: BORDER, margin: "0 4px" }} />
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <ZoomOut size={14} color={MUTED} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <span>100%</span>
          <ChevronDown size={12} color={MUTED} />
        </div>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <ZoomIn size={14} color={MUTED} />
        </button>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <Search size={14} color={MUTED} />
        </button>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
          <Hand size={14} color={MUTED} />
        </button>

        <div style={{ width: 1, height: 16, background: BORDER, margin: "0 4px" }} />
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }} title="Tải xuống">
          <Download size={14} color={MUTED} />
        </button>
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }} title="In báo cáo">
          <Printer size={14} color={MUTED} />
        </button>

        {/* Word Mode Toggle Button */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {isEditing ? (
            <>
              {onAddRow && (
                <button
                  onClick={onAddRow}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", background: "#e8f4ff", color: "#1a5a96",
                    border: "1px solid #a8cdf0", borderRadius: 4, cursor: "pointer",
                    fontSize: 11, fontWeight: 600, fontFamily: F,
                  }}
                >
                  <Plus size={13} /> Thêm hàng
                </button>
              )}
              <button
                onClick={onSave || onToggleEdit}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 12px", background: "#27ae60", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 11, fontWeight: 600, fontFamily: F,
                }}
              >
                <Save size={13} /> Lưu văn bản
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 12px", background: "#1a73e8", color: "#fff",
                border: "none", borderRadius: 4, cursor: "pointer",
                fontSize: 11, fontWeight: 600, fontFamily: F,
              }}
            >
              <Edit3 size={13} /> Chỉnh sửa như Word
            </button>
          )}
        </div>
      </div>

      {/* Word Format Bar (Visible when in Edit Mode) */}
      {isEditing && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#fff", borderBottom: `1px solid ${BORDER}`, fontSize: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: RED, marginRight: 6 }}>Biên tập Word:</span>
          
          <select
            onChange={(e) => formatDoc("fontName", e.target.value)}
            style={{ fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "2px 4px", fontFamily: F }}
            defaultValue="Times New Roman"
          >
            <option value="Times New Roman">Times New Roman</option>
            <option value="Be Vietnam Pro">Be Vietnam Pro</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
          </select>

          <select
            onChange={(e) => formatDoc("fontSize", e.target.value)}
            style={{ fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "2px 4px", width: 48 }}
            defaultValue="3"
          >
            <option value="2">11pt</option>
            <option value="3">12pt</option>
            <option value="4">14pt</option>
            <option value="5">16pt</option>
          </select>

          <div style={{ width: 1, height: 16, background: BORDER, margin: "0 2px" }} />

          <button onClick={() => formatDoc("bold")} style={{ padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", fontWeight: 700, cursor: "pointer" }} title="In đậm (Ctrl+B)">
            B
          </button>
          <button onClick={() => formatDoc("italic")} style={{ padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", fontStyle: "italic", cursor: "pointer" }} title="In nghiêng (Ctrl+I)">
            I
          </button>
          <button onClick={() => formatDoc("underline")} style={{ padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", textDecoration: "underline", cursor: "pointer" }} title="Gạch chân (Ctrl+U)">
            U
          </button>
          <button onClick={() => formatDoc("strikeThrough")} style={{ padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", textDecoration: "line-through", cursor: "pointer" }} title="Gạch ngang">
            S
          </button>

          <div style={{ width: 1, height: 16, background: BORDER, margin: "0 2px" }} />

          <button onClick={() => formatDoc("justifyLeft")} style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", cursor: "pointer" }} title="Căn trái">
            ≡
          </button>
          <button onClick={() => formatDoc("justifyCenter")} style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", cursor: "pointer" }} title="Căn giữa">
            equiv;
          </button>
          <button onClick={() => formatDoc("justifyRight")} style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fff", cursor: "pointer" }} title="Căn phải">
            ≡
          </button>

          <div style={{ width: 1, height: 16, background: BORDER, margin: "0 2px" }} />

          <span style={{ fontSize: 11, color: "#27ae60", fontStyle: "italic" }}>
            ✓ Đang bật chế độ chỉnh sửa trực tiếp (Word editable mode)
          </span>
        </div>
      )}
    </div>
  );
}

// ── 1. MÀN ÁN QUỐC HỘI ────────────────────────────────────────────────────────
export function AnQuocHoiView() {
  const [tieuDe, setTieuDe] = useState("Danh sách các vụ án quốc hội");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [rows, setRows] = useState([
    {
      tt: 1,
      soBA: "HKTT_HS_2307_01\n23/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân huyện Phong Điền",
      nguyenDon: "",
      biDon: "LÊ NGUYỄN KHÁNH",
      ttvLd: "Võ Thị Thùy Giang (TTV)\nNguyễn Như Thắng (PVT)",
      tinhTrang: "Đã phân công TTV",
      tenCoQuan: "",
    },
    {
      tt: 2,
      soBA: "",
      qhpl: "",
      toa: "",
      nguyenDon: "",
      biDon: "NGUYỄN NHẬT QUANG",
      ttvLd: "Võ Thị Thùy Giang (TTV)\nNguyễn Như Thắng (PVT)",
      tinhTrang: "Đã phân công TTV",
      tenCoQuan: "",
    },
    {
      tt: 3,
      soBA: "54681139\n03/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "",
      biDon: "Phạm Ngọc Hoa",
      ttvLd: "Vũ Diệu Thúy (TTV)\nPhạm Thị Bích Ngọc (PVT)",
      tinhTrang: "Đã phân công TTV",
      tenCoQuan: "Nguyễn Ngọc",
    },
    {
      tt: 4,
      soBA: "HKTT_1607_HS_03\n16/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
      nguyenDon: "",
      biDon: "ĐỖ PHƯƠNG UYÊN",
      ttvLd: "Vũ Diệu Thúy (TTV)\nPhạm Thị Bích Ngọc (PVT)",
      tinhTrang: "Kháng nghị\nSố: 207\nNgày: 17/07/2026",
      tenCoQuan: "",
    },
    {
      tt: 5,
      soBA: "HKTT_0807_HS_01\n08/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "",
      biDon: "NGHIÊM THỊ THANH XUÂN",
      ttvLd: "Võ Thị Thùy Giang (TTV)\nNguyễn Như Thắng (PVT)",
      tinhTrang: "Trả lời đơn",
      tenCoQuan: "",
    },
    {
      tt: 6,
      soBA: "HKTT_3006_HS_01\n30/06/2026",
      qhpl: "",
      toa: "Tòa án nhân dân quận Ô Môn",
      nguyenDon: "",
      biDon: "NGÔ QUỲNH TRANG",
      ttvLd: "Vũ Diệu Thúy (TTV)\nPhạm Thị Bích Ngọc (PVT)",
      tinhTrang: "Trả lời đơn\nSố: 126\nNgày: 30/06/2026",
      tenCoQuan: "",
    },
    {
      tt: 7,
      soBA: "HKTT_1706_06\n18/06/2026",
      qhpl: "1609",
      toa: "Tòa án nhân dân khu vực 7 - Hà Nội",
      nguyenDon: "NGUYỄN THỊ KIM NGÂN",
      biDon: "CHU TRẦN KHÁNH VINH",
      ttvLd: "Đỗ Thị Thúy Hằng (TTV)\nNguyễn Tiến Mạnh (PVT)",
      tinhTrang: "Đã phân công TTV",
      tenCoQuan: "",
    },
    {
      tt: 8,
      soBA: "HKTT_2206_HS_01\n22/06/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 8 - Hà Nội",
      nguyenDon: "",
      biDon: "LỒ THỊ TRANG NHUNG",
      ttvLd: "Đỗ Thị Thu Hằng (TTV)\nNguyễn Thị Bích Ngọc (PVT)",
      tinhTrang: "Trả lời đơn\nSố: 76\nNgày: 22/06/2026",
      tenCoQuan: "",
    },
    {
      tt: 9,
      soBA: "BA-PT-009\n18/06/2026",
      qhpl: "",
      toa: "Tòa án nhân dân thành phố Hà Nội",
      nguyenDon: "",
      biDon: "Đỗ Thành Hưng",
      ttvLd: "Nguyen Thi Huong (TTV)\nPham Thi Bich Ngoc (PVT)",
      tinhTrang: "Kháng nghị\nSố: 57\nNgày: 18/06/2026",
      tenCoQuan: "",
    },
  ]);

  const handleAddRow = () => {
    const newId = rows.length + 1;
    setRows([
      ...rows,
      {
        tt: newId,
        soBA: "Mới / 2026",
        qhpl: "",
        toa: "Tòa án nhân dân thành phố Hà Nội",
        nguyenDon: "",
        biDon: "Người bị khiếu nại mới",
        ttvLd: "TTV",
        tinhTrang: "Chưa phân công",
        tenCoQuan: "",
      },
    ]);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F, background: "#fafafa", overflowY: "auto" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "12px 20px 4px 20px", fontSize: 12, color: MUTED }}>
        <span>Trang chủ</span> / <span>Quản lý án GĐT/TT</span> / <span style={{ color: TEXT, fontWeight: 500 }}>Án quốc hội</span>
      </div>

      {/* Header */}
      <div style={{ padding: "0 20px 12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0 }}>Án quốc hội</h1>
        {savedSuccess && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#27ae60", fontSize: 12, fontWeight: 600, background: "#e8f5e9", padding: "4px 12px", borderRadius: 4 }}>
            <Check size={14} /> Đã lưu thay đổi văn bản thành công!
          </div>
        )}
      </div>

      {/* Filters Area */}
      <div style={{ padding: "0 20px 16px 20px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <FormInput label="Tiêu đề báo cáo" value={tieuDe} onChange={setTieuDe} />
            <FormDate label="Giải quyết từ ngày" />
            <FormDate label="Giải quyết đến ngày" />
            <FormSelect label="Lãnh đạo phụ trách" />
            <FormSelect label="TTV giải quyết đơn" />
            <FormSelect label="Loại công văn" />
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <FormSelect label="Kết quả thụ lý" />
            <FormSelect label="Loại án" />
            <FormSelect label="Thẩm phán" />
            <FormInput label="Thông tin cơ quan chuyển đơn" placeholder="Nhập thông tin cơ quan chuyển đơn" />
            <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0, marginTop: 4 }}>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 16px", height: 34, background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
                }}
              >
                <FileText size={14} /> Xem Báo cáo
              </button>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 16px", height: 34, background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F,
                }}
              >
                <RotateCcw size={14} color={MUTED} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Document / Word Editor Viewer Container */}
      <div style={{ padding: "0 20px 24px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <WordToolbar
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onAddRow={handleAddRow}
          onSave={handleSave}
          totalPages={2}
        />

        {/* Paper Sheet Preview Area */}
        <div style={{ background: "#666666", padding: "24px 16px", flex: 1, overflowX: "auto", display: "flex", justifyContent: "center", borderRadius: "0 0 4px 4px" }}>
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: 1000,
              padding: 32,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
              fontFamily: F,
              fontSize: 11,
              outline: isEditing ? `2px dashed ${RED}` : "none",
              cursor: isEditing ? "text" : "default",
            }}
          >
            {/* Header document */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: TEXT }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: TEXT, marginBottom: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA VỀ HÌNH SỰ</div>

              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, textTransform: "uppercase" }}>DANH SÁCH CÁC VỤ ÁN QUỐC HỘI</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: TEXT, marginTop: 2 }}>(Tính đến ngày 09/08/2026)</div>

              <div style={{ textAlign: "left", fontWeight: 700, marginTop: 14, fontSize: 11 }}>Tổng: {rows.length} vụ án</div>
            </div>

            {/* Document Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ border: "1px solid #000", padding: "6px 4px", textAlign: "center", width: 30 }}>TT</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 100 }}>Bản án Số & Ngày</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 90 }}>Quan hệ pháp luật</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 120 }}>Tòa xét xử</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>Nguyên đơn/Người khiếu nại</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>Bị đơn/Người được khiếu nại</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>TTV/LĐ Vụ</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 100 }}>Tình trạng</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 90 }}>Tên cơ quan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #000", padding: "6px 4px", textAlign: "center" }}>{r.tt}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line", textAlign: "center" }}>{r.soBA}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center" }}>{r.qhpl}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.toa}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.nguyenDon}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", fontWeight: 600 }}>{r.biDon}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line" }}>{r.ttvLd}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line" }}>{r.tinhTrang}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.tenCoQuan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. MÀN ÁN THỜI HIỆU ───────────────────────────────────────────────────────
export function AnThoiHieuView() {
  const [tieuDe, setTieuDe] = useState("Danh sách các vụ án thời hiệu");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [rows, setRows] = useState([
    {
      tt: 1,
      soBA: "13\n07/08/2026",
      qhpl: "x",
      toa: "",
      nguyenDon: "f",
      biDon: "sdfsfsf",
      ttvLd: "",
      tinhTrang: "Chưa phân công TTV",
      ghiChu: "",
    },
    {
      tt: 2,
      soBA: "123AAZZ\n22/06/2026",
      qhpl: "ádasdasddasad",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "dsadaad, wswrwr",
      biDon: "áwr",
      ttvLd: "Vũ Diệu Thúy (TTV)\nNguyễn Thị Bình (VT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 3,
      soBA: "onskin\n28/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
      nguyenDon: "",
      biDon: "",
      ttvLd: "Vũ Thị Sâm (TTV)\nDương Văn Hải (CV_01)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 4,
      soBA: "Test_2407\n24/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "",
      biDon: "Phùng Văn Nam",
      ttvLd: "Vũ Diệu Thúy (TTV)\nLê Thị Thu Hiền (PVT)",
      tinhTrang: "Kháng nghị",
      ghiChu: "",
    },
    {
      tt: 5,
      soBA: "HKTT_HS_2307_01\n23/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân huyện Phong Điền",
      nguyenDon: "",
      biDon: "LÊ NGUYỄN KHÁNH",
      ttvLd: "Võ Thị Thùy Giang (TTV)\nNguyễn Như Thắng (PVT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 6,
      soBA: "BA_2107\n21/07/2026",
      qhpl: "QHPL",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "Dương Thu Hằng",
      biDon: "Nguyễn Thành Đô",
      ttvLd: "Hoàng Ngọc Chiều (TTV)\nNguyễn Văn Hiển (PVT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 7,
      soBA: "124/2025/HSPT\n20/12/2025",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
      nguyenDon: "",
      biDon: "Nguyễn Văn Minh",
      ttvLd: "Vũ Diệu Thúy (TTV)\nLê Thị Thu Hiền (PVT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 8,
      soBA: "54681139\n03/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "",
      biDon: "Phạm Ngọc Hoa",
      ttvLd: "Vũ Diệu Thúy (TTV)\nPhạm Thị Bích Ngọc (PVT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 9,
      soBA: "54681139\n03/07/2026",
      qhpl: "",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "",
      biDon: "Phạm Ngọc Hoa",
      ttvLd: "Vũ Diệu Thúy (TTV)\nLê Thị Thu Hiền (PVT)",
      tinhTrang: "Đã phân công TTV",
      ghiChu: "",
    },
    {
      tt: 10,
      soBA: "BA_2107\n21/07/2026",
      qhpl: "qhpl",
      toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
      nguyenDon: "Dương Thu Hằng",
      biDon: "Nguyễn Thành Đô",
      ttvLd: "Hoàng Ngọc Chiều (TTV)\nNguyễn Văn Hiển (PVT)",
      tinhTrang: "Kháng nghị",
      ghiChu: "",
    },
  ]);

  const handleAddRow = () => {
    const newId = rows.length + 1;
    setRows([
      ...rows,
      {
        tt: newId,
        soBA: "Mới / 2026",
        qhpl: "",
        toa: "Tòa án nhân dân thành phố Hà Nội",
        nguyenDon: "",
        biDon: "Bị đơn mới",
        ttvLd: "TTV",
        tinhTrang: "Chưa phân công",
        ghiChu: "",
      },
    ]);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F, background: "#fafafa", overflowY: "auto" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "12px 20px 4px 20px", fontSize: 12, color: MUTED }}>
        <span>Trang chủ</span> / <span>Quản lý án GĐT/TT</span> / <span style={{ color: TEXT, fontWeight: 500 }}>Án thời hiệu</span>
      </div>

      {/* Header */}
      <div style={{ padding: "0 20px 12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0 }}>Án thời hiệu</h1>
        {savedSuccess && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#27ae60", fontSize: 12, fontWeight: 600, background: "#e8f5e9", padding: "4px 12px", borderRadius: 4 }}>
            <Check size={14} /> Đã lưu thay đổi văn bản thành công!
          </div>
        )}
      </div>

      {/* Filters Area */}
      <div style={{ padding: "0 20px 16px 20px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <FormInput label="Tiêu đề báo cáo" value={tieuDe} onChange={setTieuDe} />
            <FormSelect label="Loại án" />
            <FormDate label="Đến ngày" />
            <FormSelect label="Thời hạn giải quyết" />
            <FormSelect label="Lãnh đạo phụ trách" />
            <FormSelect label="TTV giải quyết đơn" />
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <FormSelect label="Thẩm phán" />
            <FormSelect label="Tình trạng giải quyết" />
            <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0, marginTop: 4 }}>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 16px", height: 34, background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
                }}
              >
                <FileText size={14} /> Xem Báo cáo
              </button>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 16px", height: 34, background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F,
                }}
              >
                <RotateCcw size={14} color={MUTED} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Document / Word Editor Viewer Container */}
      <div style={{ padding: "0 20px 24px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <WordToolbar
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onAddRow={handleAddRow}
          onSave={handleSave}
          totalPages={35}
        />

        {/* Paper Sheet Preview Area */}
        <div style={{ background: "#666666", padding: "24px 16px", flex: 1, overflowX: "auto", display: "flex", justifyContent: "center", borderRadius: "0 0 4px 4px" }}>
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: 1000,
              padding: 32,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
              fontFamily: F,
              fontSize: 11,
              outline: isEditing ? `2px dashed ${RED}` : "none",
              cursor: isEditing ? "text" : "default",
            }}
          >
            {/* Header document */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: TEXT }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: TEXT, marginBottom: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA VỀ HÌNH SỰ</div>

              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, textTransform: "uppercase" }}>DANH SÁCH CÁC VỤ ÁN THỜI HIỆU</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: TEXT, marginTop: 2 }}>(Tính đến ngày 09/08/2026)</div>

              <div style={{ textAlign: "left", fontWeight: 700, marginTop: 14, fontSize: 11 }}>Tổng: 449 vụ án</div>
            </div>

            {/* Document Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ border: "1px solid #000", padding: "6px 4px", textAlign: "center", width: 30 }}>TT</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 100 }}>Bản án Số & Ngày</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 90 }}>Quan hệ pháp luật</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 120 }}>Tòa xét xử</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>Nguyên đơn/Người khiếu nại</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>Bị đơn/Người được khiếu nại</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 110 }}>TTV/LĐ Vụ</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 100 }}>Tình trạng</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: 90 }}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #000", padding: "6px 4px", textAlign: "center" }}>{r.tt}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line", textAlign: "center" }}>{r.soBA}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center" }}>{r.qhpl}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.toa}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.nguyenDon}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", fontWeight: r.biDon && r.biDon.toUpperCase() === r.biDon ? 600 : 400 }}>{r.biDon}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line" }}>{r.ttvLd}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px", whiteSpace: "pre-line" }}>{r.tinhTrang}</td>
                    <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.ghiChu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

