import React from "react";
import { Search, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, getAnDacThuOptions, getThoiHieuOptions, type UserRoleType } from "./shared";
import { LOAI_AN_OPTIONS, THAM_PHAN_TOA, THAM_TRA_VIEN_PHONG } from "./data";

type FieldType = "input" | "select" | "date" | "dateRange";

interface FieldDef {
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

type RowCell = FieldDef | "diaChi" | "anDacThu" | "thoiHieu" | "trangThai" | null;

const SEARCH_ROWS: RowCell[][] = [
  [
    { label: "Người gửi đơn", type: "input", placeholder: "Người gửi đơn" },
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },
    { label: "Ngày BA/QĐ", type: "date" },
  ],
  [
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "--- Chọn ---" },
    { label: "Thời gian nhận đơn", type: "dateRange" },
    { label: "Thẩm phán", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    "diaChi",
    { label: "Chi tiết", type: "input", placeholder: "Chi tiết" },
    { label: "Phân loại đơn", type: "select", placeholder: "--- Tất cả ---", options: ["Đơn khiếu nại sau khi đã giải quyết", "Đơn đề nghị GĐT/TT", "Công văn kiến nghị GĐT/TT", "Đơn khiếu nại quyết định"] },
  ],
  [
    { label: "Số CMND", type: "input", placeholder: "Số CMND / CCCD" },
    { label: "Mã đơn", type: "input", placeholder: "Mã đơn" },
    { label: "Hình thức đơn", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    { label: "Thời gian chuyển", type: "dateRange" },
    { label: "Thời gian thụ lý", type: "dateRange" },
    { label: "Số thụ lý", type: "input", placeholder: "Số thụ lý" },
  ],
  [
    { label: "Thụ lý đơn", type: "select", placeholder: "--Tất cả--" },
    { label: "Số CV chuyển", type: "input", placeholder: "Số CV chuyển" },
    { label: "Ngày CV chuyển", type: "date" },
  ],
  [
    { label: "Cán bộ giải quyết đơn", type: "select", placeholder: "--- Tất cả ---" },
    { label: "Loại án", type: "select", placeholder: "--- Tất cả ---", options: [...LOAI_AN_OPTIONS] },
    { label: "Giao THS", type: "select", placeholder: "--Tất cả--" },
  ],
  [
    "trangThai",
    "anDacThu",
    { label: "Nơi chuyển", type: "select", placeholder: "--Tất cả--" },
  ],
  [
    "thoiHieu",
    null,
    null,
  ],
];

const SEARCH_ROWS_KHANG_NGHI: RowCell[][] = [
  [
    { label: "Mã văn thư đến", type: "input", placeholder: "Mã văn thư đến" },
    { label: "Số kháng nghị", type: "input", placeholder: "Số kháng nghị" },
    { label: "Ngày kháng nghị", type: "dateRange" },
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },
  ],
  [
    { label: "Ngày BA/QĐ", type: "date" },
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "-- Chọn --" },
    { label: "Khoảng thời gian văn thư đến", type: "dateRange", placeholder: "Chọn khoảng ngày" },
    { label: "Thẩm phán", type: "select", placeholder: "-- Tất cả --", options: [...THAM_PHAN_TOA] },
  ],
  [
    "anDacThu",
    { label: "Người gửi đơn", type: "input", placeholder: "Người gửi đơn" },
    { label: "Số thụ lý xét xử", type: "input", placeholder: "Số thụ lý xét xử" },
    { label: "Khoảng thời gian thụ lý xét xử", type: "dateRange" },
  ],
  [
    { label: "Số CV chuyển", type: "input", placeholder: "Số CV chuyển" },
    { label: "Ngày CV chuyển", type: "date" },
    { label: "Công chức nghiên cứu giải quyết", type: "select", placeholder: "-- Tất cả --", options: [...THAM_TRA_VIEN_PHONG] },
    { label: "Loại án", type: "select", placeholder: "-- Tất cả --", options: [...LOAI_AN_OPTIONS] },
  ],
  [
    { label: "Nơi chuyển", type: "select", placeholder: "-- Tất cả --" },
    "thoiHieu",
    null,
    null,
  ],
];

export function SearchFilterPanel({
  expanded,
  onToggle,
  userRole,
  isHoSoKhangNghi,
}: {
  expanded: boolean;
  onToggle: () => void;
  userRole?: UserRoleType;
  isHoSoKhangNghi?: boolean;
}) {
  const [selectedLoaiAn, setSelectedLoaiAn] = React.useState<string>("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    cursor: "pointer",
    color: MUTED,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: MUTED,
    fontFamily: F,
    marginBottom: 4,
    display: "block",
  };

  const renderField = ({ label, type, placeholder, options }: FieldDef) => (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>{label}</span>

      {type === "select" ? (
        <select
          style={selectStyle}
          defaultValue=""
          value={label === "Loại án" ? selectedLoaiAn : undefined}
          onChange={label === "Loại án" ? (e) => setSelectedLoaiAn(e.target.value) : undefined}
        >
          <option value="">{placeholder ?? "--- Tất cả ---"}</option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "dateRange" ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="date"
            style={{ ...inputStyle, flex: 1 }}
          />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>đến</span>
          <input
            type="date"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      ) : (
        <input
          type={type === "date" ? "date" : "text"}
          placeholder={placeholder ?? label}
          style={inputStyle}
        />
      )}
    </div>
  );

  const diaChiGui = (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>Địa chỉ gửi</span>
      <div style={{ display: "flex", gap: 8 }}>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue="">
          <option value="">--- Tỉnh/Thành ---</option>
        </select>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue="">
          <option value="">--- Quận/Huyện ---</option>
        </select>
      </div>
    </div>
  );

  const targetRows = isHoSoKhangNghi ? SEARCH_ROWS_KHANG_NGHI : SEARCH_ROWS;
  const visibleRows = expanded ? targetRows : targetRows.slice(0, isHoSoKhangNghi ? 1 : 2);

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isHoSoKhangNghi ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: "10px 16px",
          marginBottom: 12,
        }}
      >
        {visibleRows.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            if (cell === null) return <div key={key} />;
            if (cell === "diaChi") return <React.Fragment key={key}>{diaChiGui}</React.Fragment>;
            if (cell === "trangThai") {
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={labelStyle}>Trạng thái</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    <option value="chua-nhan">Chưa nhận</option>
                    <option value="da-nhan">Đã nhận</option>
                    <option value="tra-lai">Trả lại</option>
                  </select>
                </div>
              );
            }
            if (cell === "anDacThu") {
              const options = getAnDacThuOptions(userRole, selectedLoaiAn);
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={labelStyle}>Thuộc án</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    {options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (cell === "thoiHieu") {
              const options = getThoiHieuOptions(userRole, selectedLoaiAn);
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={labelStyle}>Thời hiệu</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    {options.map((o) => (
                      <option key={o.val} value={o.val}>{o.label}</option>
                    ))}
                  </select>
                </div>
              );
            }
            return <React.Fragment key={key}>{renderField(cell)}</React.Fragment>;
          }),
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <button
          onClick={onToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: "#1a73e8",
            fontFamily: F,
            padding: 0,
            fontWeight: 500,
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Thu gọn" : "Mở rộng"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 18px",
              background: "#6e1414",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            <Search size={13} />
            Tìm kiếm
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              background: "#fff",
              color: TEXT,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: F,
            }}
          >
            <RotateCcw size={13} />
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
