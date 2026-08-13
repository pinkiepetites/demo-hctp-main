import React, { useState } from "react";
import { Search, RotateCcw, Calendar, ChevronDown, ChevronUp, X } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";
import { UserRoleType } from "./App";

export const DANH_SACH_TOA_AN_FILTER = [
  "Tòa án nhân dân thành phố Hà Nội",
  "Tòa án nhân dân khu vực 1 - Hà Nội",
  "Tòa án nhân dân khu vực 3 - Hà Nội",
  "Tòa án nhân dân khu vực 1 - Hà Nội tại TP Hồ Chí Minh",
  "Tòa án nhân dân thành phố Hà Nội",
  "Tòa án nhân dân khu vực 2 - Hà Nội",
  "Tòa án nhân dân khu vực 6 - Hà Nội",
  "Tòa án nhân dân khu vực 3 - Hà Nội",
  "Tòa án nhân dân khu vực 5 - Hà Nội",
  "Tòa án nhân dân khu vực 4 - Hà Nội",
  "Tòa án nhân dân khu vực 2 - Hà Nội",
  "Tòa án nhân dân khu vực 2 - Hà Nội",
  "Tòa án nhân dân khu vực 5 - Hà Nội",
];

export const DANH_SACH_LANH_DAO_FILTER = [
  "Phạm Thị Bích Ngọc - Phó Trưởng phòng",
  "Lê Thị Thu Hiền - Phó Trưởng phòng",
  "Nguyễn Như Thắng - Trưởng phòng",
  "Nguyễn Biên Thùy - Phó Trưởng phòng",
  "Trần Hồng Hà - Trưởng phòng",
  "Nguyễn Văn Cường - Phó Trưởng phòng",
];

export const DANH_SACH_TTV_FILTER = [
  "Nguyễn Thị Thúy Hường",
  "Vũ Xuân Hiền",
  "Nguyễn Thị Hường",
  "Nguyễn Đức Thiện",
  "Vũ Diệu Thúy",
  "Đặng Thị Mai",
  "Trần Văn Hưng",
  "Lê Thị Lan",
  "Hoàng Ngọc Chiêu",
  "Đinh Thị Vân Anh",
];

export const DANH_SACH_THAM_PHAN_FILTER = [
  "Lê Thị Thu Hiền",
  "Nguyễn Văn A",
  "Trần Văn B",
  "Phạm Văn C",
  "Nguyễn Thị Hương",
  "Vũ Đức Thiện",
  "Hoàng Ngọc Chiêu",
];

export interface VuAnFilterValues {
  // 12 tiêu chí cơ bản (Grid 4 cột)
  loaiAn: string;
  toaRaBA: string;
  soBA: string;
  ngayBA: string;
  biCao: string;
  soThuLy: string;
  lanhDaoVu: string;
  thamTraVien: string;
  thamPhan: string;
  thuocAn: string;
  thoiHieu: string;
  hoanTHA: string;

  // Tiêu chí mở rộng (Grid phẳng 4 cột)
  trangThaiHoSo: string;
  thuLyTuNgay: string;
  thuLyDenNgay: string;

  toTrinhLanhDao: string;
  toTrinhTuNgay: string;
  toTrinhDenNgay: string;
  yeuCauTrinhTiep: string;
  yKienToTrinh: string;

  ketQuaGiaiQuyet: string;
  hinhThucDon: string;
  phanLoaiDon: string;

  capXetXu: string;
  ketQuaXetXu: string;
  ngayTuyenAn: string;

  rutKhangNghi: string;
  ngayRutKhangNghi: string;
}

export const INITIAL_FILTER_VALUES: VuAnFilterValues = {
  loaiAn: "",
  toaRaBA: "",
  soBA: "",
  ngayBA: "",
  biCao: "",
  soThuLy: "",
  lanhDaoVu: "",
  thamTraVien: "",
  thamPhan: "",
  thuocAn: "",
  thoiHieu: "",
  hoanTHA: "",
  trangThaiHoSo: "",
  thuLyTuNgay: "",
  thuLyDenNgay: "",
  toTrinhLanhDao: "",
  toTrinhTuNgay: "",
  toTrinhDenNgay: "",
  yeuCauTrinhTiep: "",
  yKienToTrinh: "",
  ketQuaGiaiQuyet: "",
  hinhThucDon: "",
  phanLoaiDon: "",
  capXetXu: "",
  ketQuaXetXu: "",
  ngayTuyenAn: "",
  rutKhangNghi: "",
  ngayRutKhangNghi: "",
};

export const FILTER_LABELS: Record<keyof VuAnFilterValues, string> = {
  loaiAn: "Loại án",
  toaRaBA: "Tòa ra BA/QĐ",
  soBA: "Số BA/QĐ",
  ngayBA: "Ngày BA/QĐ",
  biCao: "Bị cáo/Đương sự",
  soThuLy: "Số thụ lý",
  lanhDaoVu: "Lãnh đạo phụ trách",
  thamTraVien: "Cán bộ giải quyết",
  thamPhan: "Thẩm phán",
  thuocAn: "Thuộc án",
  thoiHieu: "Án thời hiệu",
  hoanTHA: "Hoãn thi hành án",
  trangThaiHoSo: "Trạng thái hồ sơ",
  thuLyTuNgay: "Thụ lý từ ngày",
  thuLyDenNgay: "Thụ lý đến ngày",
  toTrinhLanhDao: "Tờ trình lãnh đạo",
  toTrinhTuNgay: "Tờ trình từ ngày",
  toTrinhDenNgay: "Tờ trình đến ngày",
  yeuCauTrinhTiep: "Yêu cầu trình tiếp",
  yKienToTrinh: "Ý kiến tờ trình",
  ketQuaGiaiQuyet: "Kết quả giải quyết",
  hinhThucDon: "Hình thức đơn",
  phanLoaiDon: "Phân loại đơn",
  capXetXu: "Cấp xét xử",
  ketQuaXetXu: "Kết quả xét xử",
  ngayTuyenAn: "Ngày tuyên án",
  rutKhangNghi: "Rút kháng nghị",
  ngayRutKhangNghi: "Ngày rút KN",
};

export function VuAnSearchFilterPanel({
  userRole,
  onSearch,
  onReset,
}: {
  userRole?: UserRoleType;
  onSearch?: (filters: VuAnFilterValues) => void;
  onReset?: () => void;
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filters, setFilters] = useState<VuAnFilterValues>(INITIAL_FILTER_VALUES);

  const handleChange = (key: keyof VuAnFilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveTag = (key: keyof VuAnFilterValues) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: "" };
      if (onSearch) onSearch(next);
      return next;
    });
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTER_VALUES);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const activeTags = Object.entries(filters).filter(([_, val]) => Boolean(val));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "5px 8px",
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
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#555555",
    marginBottom: 3,
    fontFamily: F,
    display: "block",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderBottom: `1px solid ${BORDER}`,
        padding: "12px 20px",
        flexShrink: 0,
        fontFamily: F,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* ── BỘ LỌC CƠ BẢN: GRID 4 CỘT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 14px" }}>
          {/* 1. Loại án */}
          <div>
            <label style={labelStyle}>Loại án</label>
            <select value={filters.loaiAn} onChange={(e) => handleChange("loaiAn", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {LOAI_AN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 2. Tòa ra BA/QĐ */}
          <div>
            <label style={labelStyle}>Tòa ra BA/QĐ</label>
            <select value={filters.toaRaBA} onChange={(e) => handleChange("toaRaBA", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_TOA_AN_FILTER.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 3. Số BA/QĐ */}
          <div>
            <label style={labelStyle}>Số BA/QĐ</label>
            <input placeholder="Nhập số BA/QĐ" value={filters.soBA} onChange={(e) => handleChange("soBA", e.target.value)} style={inputStyle} />
          </div>

          {/* 4. Ngày BA/QĐ */}
          <div>
            <label style={labelStyle}>Ngày BA/QĐ</label>
            <div style={{ position: "relative" }}>
              <input placeholder="dd/mm/yyyy" value={filters.ngayBA} onChange={(e) => handleChange("ngayBA", e.target.value)} style={inputStyle} />
              <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 5. Bị cáo / Đương sự */}
          <div>
            <label style={labelStyle}>Bị cáo / Đương sự</label>
            <input placeholder="Nhập tên bị cáo/đương sự" value={filters.biCao} onChange={(e) => handleChange("biCao", e.target.value)} style={inputStyle} />
          </div>

          {/* 6. Số thụ lý */}
          <div>
            <label style={labelStyle}>Số thụ lý</label>
            <input placeholder="Nhập số thụ lý" value={filters.soThuLy} onChange={(e) => handleChange("soThuLy", e.target.value)} style={inputStyle} />
          </div>

          {/* 7. Lãnh đạo phụ trách */}
          <div>
            <label style={labelStyle}>Lãnh đạo phụ trách</label>
            <select value={filters.lanhDaoVu} onChange={(e) => handleChange("lanhDaoVu", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_LANH_DAO_FILTER.map((ld) => (
                <option key={ld} value={ld}>{ld}</option>
              ))}
            </select>
          </div>

          {/* 8. Cán bộ giải quyết */}
          <div>
            <label style={labelStyle}>Cán bộ giải quyết</label>
            <select value={filters.thamTraVien} onChange={(e) => handleChange("thamTraVien", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_TTV_FILTER.map((ttv) => (
                <option key={ttv} value={ttv}>{ttv}</option>
              ))}
            </select>
          </div>

          {/* 9. Thẩm phán */}
          <div>
            <label style={labelStyle}>Thẩm phán</label>
            <select value={filters.thamPhan} onChange={(e) => handleChange("thamPhan", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_THAM_PHAN_FILTER.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* 10. Thuộc án */}
          <div>
            <label style={labelStyle}>Thuộc án</label>
            <select value={filters.thuocAn} onChange={(e) => handleChange("thuocAn", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              <option value="Án Quốc hội">Án Quốc hội</option>
              <option value="Án chỉ đạo">Án chỉ đạo</option>
              <option value="Án TVTN">Án TVTN</option>
            </select>
          </div>

          {/* 11. Án thời hiệu */}
          <div>
            <label style={labelStyle}>Án thời hiệu</label>
            <select value={filters.thoiHieu} onChange={(e) => handleChange("thoiHieu", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              <option value="Không có thời hiệu giải quyết">Không có thời hiệu giải quyết</option>
              <option value="Còn thời hiệu">Còn thời hiệu</option>
              <option value="Hết thời hiệu">Hết thời hiệu</option>
            </select>
          </div>

          {/* 12. Hoãn thi hành án */}
          <div>
            <label style={labelStyle}>Hoãn thi hành án</label>
            <select value={filters.hoanTHA} onChange={(e) => handleChange("hoanTHA", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              <option value="Có">Có</option>
              <option value="Không">Không</option>
            </select>
          </div>
        </div>

        {/* ── MỞ RỘNG BỘ LỌC: PHẲNG DẠNG GRID 4 CỘT TRỰC QUAN (KHÔNG CHIA TAB/BOX BAR) ── */}
        {filterExpanded && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 14px", borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
            {/* Hồ sơ & Thụ lý */}
            <div>
              <label style={labelStyle}>Trạng thái hồ sơ</label>
              <select value={filters.trangThaiHoSo} onChange={(e) => handleChange("trangThaiHoSo", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Chưa có hồ sơ">Chưa có hồ sơ</option>
                <option value="Đang mượn hồ sơ">Đang mượn hồ sơ</option>
                <option value="Đã có hồ sơ">Đã có hồ sơ</option>
                <option value="Đã trả hồ sơ">Đã trả hồ sơ</option>
                <option value="Đã chuyển hồ sơ">Đã chuyển hồ sơ</option>
              </select>
            </div>
            {/* Thụ lý từ ngày – Đến ngày (Gộp 2 cột thành 1 ô khoảng thời gian) */}
            <div>
              <label style={labelStyle}>Thụ lý từ ngày – Đến ngày</label>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  placeholder="Từ ngày"
                  value={filters.thuLyTuNgay}
                  onChange={(e) => handleChange("thuLyTuNgay", e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    placeholder="Đến ngày"
                    value={filters.thuLyDenNgay}
                    onChange={(e) => handleChange("thuLyDenNgay", e.target.value)}
                    style={inputStyle}
                  />
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Tờ trình */}
            <div>
              <label style={labelStyle}>Tờ trình lãnh đạo</label>
              <select value={filters.toTrinhLanhDao} onChange={(e) => handleChange("toTrinhLanhDao", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                <option value="Trình trưởng phòng">Trình trưởng phòng</option>
                <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                <option value="Trình Chánh án">Trình Chánh án</option>
                <option value="Trình HĐTP">Trình HĐTP</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tờ trình từ ngày – Đến ngày</label>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  placeholder="Từ ngày"
                  value={filters.toTrinhTuNgay}
                  onChange={(e) => handleChange("toTrinhTuNgay", e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    placeholder="Đến ngày"
                    value={filters.toTrinhDenNgay}
                    onChange={(e) => handleChange("toTrinhDenNgay", e.target.value)}
                    style={inputStyle}
                  />
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Ý kiến tờ trình</label>
              <select value={filters.yKienToTrinh} onChange={(e) => handleChange("yKienToTrinh", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trả lời đơn">Trả lời đơn</option>
                <option value="Kháng nghị">Kháng nghị</option>
                <option value="Xếp đơn">Xếp đơn</option>
                <option value="VKS đang giải quyết">VKS đang giải quyết</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Yêu cầu trình tiếp</label>
              <select value={filters.yeuCauTrinhTiep} onChange={(e) => handleChange("yeuCauTrinhTiep", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                <option value="Trình trưởng phòng">Trình trưởng phòng</option>
                <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                <option value="Trình Chánh án">Trình Chánh án</option>
              </select>
            </div>

            {/* Giải quyết đơn */}
            <div>
              <label style={labelStyle}>Kết quả giải quyết</label>
              <select value={filters.ketQuaGiaiQuyet} onChange={(e) => handleChange("ketQuaGiaiQuyet", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trả lời đơn">Trả lời đơn</option>
                <option value="Kháng nghị">Kháng nghị</option>
                <option value="Xếp đơn">Xếp đơn</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Hình thức đơn</label>
              <select value={filters.hinhThucDon} onChange={(e) => handleChange("hinhThucDon", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="GDT">GĐT</option>
                <option value="CV">Công văn</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phân loại đơn</label>
              <select value={filters.phanLoaiDon} onChange={(e) => handleChange("phanLoaiDon", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Đơn đề nghị">Đơn đề nghị</option>
                <option value="Công văn kiến nghị">Công văn kiến nghị</option>
              </select>
            </div>

            {/* Xét xử */}
            <div>
              <label style={labelStyle}>Cấp xét xử</label>
              <select value={filters.capXetXu} onChange={(e) => handleChange("capXetXu", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Giám đốc thẩm">Giám đốc thẩm</option>
                <option value="Tái thẩm">Tái thẩm</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Kết quả xét xử</label>
              <input placeholder="Nhập kết quả xét xử" value={filters.ketQuaXetXu} onChange={(e) => handleChange("ketQuaXetXu", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ngày tuyên án</label>
              <input placeholder="dd/mm/yyyy" value={filters.ngayTuyenAn} onChange={(e) => handleChange("ngayTuyenAn", e.target.value)} style={inputStyle} />
            </div>

            {/* Rút kháng nghị */}
            <div>
              <label style={labelStyle}>Rút kháng nghị</label>
              <select value={filters.rutKhangNghi} onChange={(e) => handleChange("rutKhangNghi", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Có">Có</option>
                <option value="Không">Không</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ngày rút kháng nghị</label>
              <input placeholder="dd/mm/yyyy" value={filters.ngayRutKhangNghi} onChange={(e) => handleChange("ngayRutKhangNghi", e.target.value)} style={inputStyle} />
            </div>
          </div>
        )}

        {/* ── ACTIVE FILTER TAGS VỚI NÚT XÓA TỪNG TAG ── */}
        {activeTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, paddingTop: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#666666" }}>Đang lọc:</span>
            {activeTags.map(([key, val]) => (
              <span
                key={key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#f0f7ff",
                  border: "1px solid #c3d5ef",
                  color: "#1a5a96",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: F,
                }}
              >
                <span style={{ fontWeight: 600 }}>{FILTER_LABELS[key as keyof VuAnFilterValues]}:</span> {val}
                <X
                  size={12}
                  style={{ cursor: "pointer", color: "#1a73e8" }}
                  onClick={() => handleRemoveTag(key as keyof VuAnFilterValues)}
                />
              </span>
            ))}
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                color: RED,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                padding: "2px 4px",
              }}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* ── NÚT THAO TÁC (TÌM KIẾM MÀU ĐỎ & XÓA BỘ LỌC) ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <button
            onClick={() => setFilterExpanded((v) => !v)}
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
              fontWeight: 600,
            }}
          >
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn bộ lọc nâng cao" : "Mở rộng bộ lọc nâng cao"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 20px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: F,
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <Search size={14} /> Tìm kiếm
            </button>

            <button
              onClick={handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
              }}
            >
              <RotateCcw size={13} /> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VuAnSearchFilterPanel;
