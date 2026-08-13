import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  X,
  Users,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";

const DANH_SACH_THAM_PHAN = [
  "Lê Thị Thu Hiền",
  "Nguyễn Văn A",
  "Trần Văn B",
  "Phạm Văn C",
  "Nguyễn Thị Hương",
  "Vũ Đức Thiện",
  "Hoàng Ngọc Chiêu",
];

const LOAI_AN_CHECKBOXES = [
  "Hình sự",
  "Dân sự",
  "Hành chính",
  "Kinh doanh thương mại",
  "Hôn nhân gia đình",
  "Lao động",
  "Sở hữu trí tuệ",
  "Phá sản",
];

interface DonRecord {
  id: number;
  soThuLy: string[];
  moTaDon: string;
  nguoiDungDon: string;
  hinhThuc: string;
  soBA: string;
  ngayBA: string;
  toaBA: string;
  ngayPhanCong: string;
  thamPhan: string;
  ghiChu: string;
  trangThai?: "chua-ngau-nhien" | "chua-chi-dinh" | "da-phan-cong";
}

const INITIAL_RECORDS: DonRecord[] = [
  {
    id: 1,
    soThuLy: ["Số: 4 - 29/06/2026", "Số: 5 - 29/06/2026"],
    moTaDon: "Số đơn 2(2 đơn TLM)",
    nguoiDungDon: "",
    hinhThuc: "Đơn đề nghị GĐT, TT",
    soBA: "123",
    ngayBA: "23/06/2026",
    toaBA: "Tòa án nhân dân khu vực 5 - Hà Nội",
    ngayPhanCong: "23/06/2026",
    thamPhan: "Lê Thị Thu Hiền",
    ghiChu: "",
    trangThai: "chua-chi-dinh",
  },
  {
    id: 2,
    soThuLy: ["Số: 5 - 29/06/2026"],
    moTaDon: "Số đơn 5 (1 đơn TLM)",
    nguoiDungDon: "Chu Văn An",
    hinhThuc: "Đơn đề nghị GĐT, TT",
    soBA: "123",
    ngayBA: "23/06/2026",
    toaBA: "Tòa án nhân dân khu vực 5 - Hà Nội",
    ngayPhanCong: "23/06/2026",
    thamPhan: "Lê Thị Thu Hiền",
    ghiChu: "",
    trangThai: "chua-chi-dinh",
  },
  {
    id: 3,
    soThuLy: ["Số: 12 - 02/07/2026"],
    moTaDon: "Số đơn 1 (1 đơn TLM)",
    nguoiDungDon: "Trần Thị Mai",
    hinhThuc: "Đơn đề nghị GĐT, TT",
    soBA: "88/2026/HS-PT",
    ngayBA: "15/06/2026",
    toaBA: "Tòa án nhân dân khu vực 3 - Hà Nội",
    ngayPhanCong: "-",
    thamPhan: "-",
    ghiChu: "",
    trangThai: "chua-ngau-nhien",
  },
  {
    id: 4,
    soThuLy: ["Số: 18 - 05/07/2026"],
    moTaDon: "Số đơn 3 (2 đơn TLM)",
    nguoiDungDon: "Đỗ Quốc Việt",
    hinhThuc: "Đơn đề nghị GĐT, TT",
    soBA: "102/2026/DS-PT",
    ngayBA: "20/06/2026",
    toaBA: "Tòa án nhân dân TP Hà Nội",
    ngayPhanCong: "-",
    thamPhan: "-",
    ghiChu: "",
    trangThai: "chua-ngau-nhien",
  },
];

export function PhanCongThamPhanView() {
  const [activeTab, setActiveTab] = useState<"ngau-nhien" | "chi-dinh" | "ket-qua">("chi-dinh");
  const [filterJudgeType, setFilterJudgeType] = useState<"tat-ca" | "bac-3" | "toi-cao">("toi-cao");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Search Filter Form states
  const [fTenToaAn, setFTenToaAn] = useState("Tòa án nhân dân thành phố Hà Nội");
  const [fNhapDonTuNgay, setFNhapDonTuNgay] = useState("");
  const [fNhapDonDenNgay, setFNhapDonDenNgay] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("don-tpb3-gq");
  const [fSoThuLy, setFSoThuLy] = useState("");
  const [fNgayTLTuNgay, setFNgayTLTuNgay] = useState("");
  const [fNgayTLDenNgay, setFNgayTLDenNgay] = useState("");
  const [fNguoiNhapDon, setFNguoiNhapDon] = useState("");
  const [selectedLoaiAn, setSelectedLoaiAn] = useState<string[]>([]);

  // Toolbar & selections
  const [bulkJudge, setBulkJudge] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([1]);

  // Data lists
  const [records, setRecords] = useState<DonRecord[]>(INITIAL_RECORDS);

  // Modal danh sách thẩm phán
  const [showJudgeListModal, setShowJudgeListModal] = useState(false);

  const toggleLoaiAn = (item: string) => {
    setSelectedLoaiAn((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleResetFilters = () => {
    setFTenToaAn("Tòa án nhân dân thành phố Hà Nội");
    setFNhapDonTuNgay("");
    setFNhapDonDenNgay("");
    setFSoBA("");
    setFHinhThuc("don-tpb3-gq");
    setFSoThuLy("");
    setFNgayTLTuNgay("");
    setFNgayTLDenNgay("");
    setFNguoiNhapDon("");
    setSelectedLoaiAn([]);
  };

  const currentRecords =
    activeTab === "ngau-nhien"
      ? records.filter((r) => r.trangThai === "chua-ngau-nhien")
      : activeTab === "chi-dinh"
      ? records.filter((r) => r.trangThai === "chua-chi-dinh")
      : records.filter((r) => r.trangThai === "da-phan-cong");

  const toggleSelectRow = (id: number) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    if (selectedRowIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 đơn để phân công!");
      return;
    }
    if (!bulkJudge && activeTab === "chi-dinh") {
      alert("Vui lòng chọn Thẩm phán để phân công!");
      return;
    }

    const assignedJudge =
      bulkJudge || DANH_SACH_THAM_PHAN[Math.floor(Math.random() * DANH_SACH_THAM_PHAN.length)];

    setRecords((prev) =>
      prev.map((r) =>
        selectedRowIds.includes(r.id)
          ? {
              ...r,
              thamPhan: assignedJudge,
              ngayPhanCong: "23/06/2026",
              trangThai: "da-phan-cong",
            }
          : r
      )
    );

    setSelectedRowIds([]);
    alert(`Đã phân công thành công ${selectedRowIds.length} đơn cho Thẩm phán ${assignedJudge}!`);
    setActiveTab("ket-qua");
  };

  const handleDeleteSelected = () => {
    if (selectedRowIds.length === 0) {
      alert("Chưa chọn dòng nào để xóa!");
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedRowIds.length} đơn đã chọn khỏi danh sách?`)) {
      setRecords((prev) => prev.filter((r) => !selectedRowIds.includes(r.id)));
      setSelectedRowIds([]);
    }
  };

  const countNgauNhien = records.filter((r) => r.trangThai === "chua-ngau-nhien").length;
  const countChiDinh = records.filter((r) => r.trangThai === "chua-chi-dinh").length;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 11px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#fafafa", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý đơn</span> &nbsp;/&nbsp; <b style={{ color: TEXT }}>Phân công thẩm phán</b>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Phân công thẩm phán
        </h1>

        {/* Main Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: "transparent", gap: 32 }}>
          <button
            onClick={() => {
              setActiveTab("ngau-nhien");
              setSelectedRowIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "ngau-nhien" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "ngau-nhien" ? RED : MUTED,
              fontWeight: activeTab === "ngau-nhien" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS chưa phân công ngẫu nhiên ({countNgauNhien})
          </button>

          <button
            onClick={() => {
              setActiveTab("chi-dinh");
              setSelectedRowIds([1]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chi-dinh" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chi-dinh" ? RED : MUTED,
              fontWeight: activeTab === "chi-dinh" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS chưa phân công chỉ định ({countChiDinh})
          </button>

          <button
            onClick={() => {
              setActiveTab("ket-qua");
              setSelectedRowIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "ket-qua" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "ket-qua" ? RED : MUTED,
              fontWeight: activeTab === "ket-qua" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Quản lý kết quả phân công
          </button>
        </div>

        {/* Search Filter Panel */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {/* Radio filter judge level */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="filter-judge-level"
                checked={filterJudgeType === "tat-ca"}
                onChange={() => setFilterJudgeType("tat-ca")}
                style={{ accentColor: RED, cursor: "pointer", width: 16, height: 16 }}
              />
              Tất cả
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="filter-judge-level"
                checked={filterJudgeType === "bac-3"}
                onChange={() => setFilterJudgeType("bac-3")}
                style={{ accentColor: RED, cursor: "pointer", width: 16, height: 16 }}
              />
              Thẩm phán
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="filter-judge-level"
                checked={filterJudgeType === "toi-cao"}
                onChange={() => setFilterJudgeType("toi-cao")}
                style={{ accentColor: RED, cursor: "pointer", width: 16, height: 16 }}
              />
              Thẩm phán
            </label>
          </div>

          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1: Tên tòa án | Nhập đơn từ ngày đến ngày | Số BA/QĐ */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1fr", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Tên tòa án</label>
                  <input
                    value={fTenToaAn}
                    onChange={(e) => setFTenToaAn(e.target.value)}
                    style={{ ...inputStyle, background: "#fafafa" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nhập đơn từ ngày đến ngày</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Vui lòng chọn"
                      value={fNhapDonTuNgay}
                      onChange={(e) => setFNhapDonTuNgay(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Số BA/QĐ</label>
                  <input
                    placeholder="Nhập dữ liệu"
                    value={fSoBA}
                    onChange={(e) => setFSoBA(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 2: Hình thức | Số thụ lý | Ngày thụ lý từ ngày đến ngày | Người nhập đơn */}
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.2fr 1fr", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Hình thức</label>
                  <select
                    value={fHinhThuc}
                    onChange={(e) => setFHinhThuc(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="don-tpb3-gq">Đơn TPB3 GQ cần phân công TPTC</option>
                    <option value="don-de-nghi-gdt">Đơn đề nghị GĐT, TT</option>
                    <option value="cong-van-trao-doi">Công văn trao đổi</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Số thụ lý</label>
                  <input
                    placeholder="nhập dữ liệu"
                    value={fSoThuLy}
                    onChange={(e) => setFSoThuLy(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày thụ lý từ ngày đến ngày</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Vui lòng chọn"
                      value={fNgayTLTuNgay}
                      onChange={(e) => setFNgayTLTuNgay(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Người nhập đơn</label>
                  <select
                    value={fNguoiNhapDon}
                    onChange={(e) => setFNguoiNhapDon(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Nguyễn Văn Tiến">Nguyễn Văn Tiến</option>
                    <option value="Lê Thị Thu Hiền">Lê Thị Thu Hiền</option>
                    <option value="Trần Văn B">Trần Văn B</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Loại án Checkboxes */}
              <div>
                <label style={labelStyle}>Loại án</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  {/* Row 1 checkboxes */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                    {LOAI_AN_CHECKBOXES.slice(0, 5).map((item) => (
                      <label key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedLoaiAn.includes(item)}
                          onChange={() => toggleLoaiAn(item)}
                          style={{ cursor: "pointer" }}
                        />
                        {item}
                      </label>
                    ))}
                  </div>

                  {/* Row 2 checkboxes */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                    {LOAI_AN_CHECKBOXES.slice(5).map((item) => (
                      <label key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedLoaiAn.includes(item)}
                          onChange={() => toggleLoaiAn(item)}
                          style={{ cursor: "pointer" }}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 4 }}>
            <button
              onClick={() => setShowJudgeListModal(true)}
              style={{
                background: "none",
                border: "none",
                color: "#1a73e8",
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
                fontFamily: F,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Danh sách thẩm phán
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setFilterExpanded(!filterExpanded)}
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
                  padding: "6px 8px",
                  fontWeight: 500,
                }}
              >
                {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {filterExpanded ? "Thu gọn" : "Mở rộng"}
              </button>

              <button
                onClick={() => alert("Đang tìm kiếm đơn theo bộ lọc...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </button>

              <button
                onClick={handleResetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#fff",
                  color: TEXT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Table Header Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: F }}>
            Đã chọn {selectedRowIds.length} mục
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {activeTab === "chi-dinh" && (
              <select
                value={bulkJudge}
                onChange={(e) => setBulkJudge(e.target.value)}
                style={{ ...inputStyle, width: 170, padding: "6px 10px" }}
              >
                <option value="">-- Chọn thẩm phán --</option>
                {DANH_SACH_THAM_PHAN.map((tp) => (
                  <option key={tp} value={tp}>{tp}</option>
                ))}
              </select>
            )}

            {activeTab === "chi-dinh" ? (
              <button
                onClick={handleBulkAssign}
                style={{
                  padding: "7px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                }}
              >
                Phân công chỉ định ({selectedRowIds.length} đơn)
              </button>
            ) : activeTab === "ngau-nhien" ? (
              <button
                onClick={handleBulkAssign}
                style={{
                  padding: "7px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                }}
              >
                Phân công ngẫu nhiên ({selectedRowIds.length} đơn)
              </button>
            ) : null}

            <button
              onClick={() => window.print()}
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
                fontWeight: 500,
              }}
            >
              <Printer size={14} /> In danh sách
            </button>

            <button
              onClick={handleDeleteSelected}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: "#fff",
                color: "#1a73e8",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
              }}
            >
              <RotateCcw size={13} /> Xóa
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1050 }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  <th style={{ ...TH_STYLE, width: 50, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>STT</th>
                  <th style={{ ...TH_STYLE, width: 170, borderRight: `1px solid ${BORDER}` }}>Số – Ngày thụ lý</th>
                  <th style={{ ...TH_STYLE, width: 240, borderRight: `1px solid ${BORDER}` }}>Thông tin người đứng đơn</th>
                  <th style={{ ...TH_STYLE, width: 250, borderRight: `1px solid ${BORDER}` }}>Thông tin BA/QĐ đề nghị GĐT,TT</th>
                  <th style={{ ...TH_STYLE, width: 130, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>Ngày phân công</th>
                  <th style={{ ...TH_STYLE, width: 170, borderRight: `1px solid ${BORDER}` }}>Thẩm phán</th>
                  <th style={{ ...TH_STYLE, width: 180, borderRight: "none" }}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...TD_STYLE, textAlign: "center", padding: 36, color: MUTED }}>
                      Không có bản ghi nào trong danh sách
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((r, idx) => {
                    const isSelected = selectedRowIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => toggleSelectRow(r.id)}
                        style={{
                          background: isSelected ? "#fdf3f2" : idx % 2 === 0 ? "#fff" : "#fafafa",
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 12, fontWeight: 500, color: TEXT, borderRight: `1px solid ${BORDER}` }}>
                          {idx + 1}
                        </td>

                        {/* Số – Ngày thụ lý */}
                        <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          {r.soThuLy.map((s, i) => (
                            <div key={i} style={{ color: TEXT, marginBottom: 2 }}>{s}</div>
                          ))}
                          <div style={{ color: TEXT, marginTop: 2 }}>{r.moTaDon}</div>
                        </td>

                        {/* Thông tin người đứng đơn */}
                        <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div>
                            <b>Người đứng đơn:</b> {r.nguoiDungDon}
                          </div>
                          <div style={{ marginTop: 3 }}>
                            <b>Hình thức:</b> {r.hinhThuc}
                          </div>
                        </td>

                        {/* Thông tin BA/QĐ */}
                        <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div><b>Số BA:</b> {r.soBA}</div>
                          <div style={{ marginTop: 2 }}>
                            <b>Ngày:</b> {r.ngayBA}
                          </div>
                          <div style={{ marginTop: 2 }}>
                            <b>Tại:</b> {r.toaBA}
                          </div>
                        </td>

                        {/* Ngày phân công */}
                        <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 12, color: TEXT, fontFamily: F, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          {r.ngayPhanCong}
                        </td>

                        {/* Thẩm phán */}
                        <td
                          onClick={(e) => e.stopPropagation()}
                          style={{ ...TD_STYLE, fontFamily: F, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}
                        >
                          <select
                            value={r.thamPhan}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRecords((prev) =>
                                prev.map((item) =>
                                  item.id === r.id ? { ...item, thamPhan: val } : item
                                )
                              );
                            }}
                            style={{ ...inputStyle, padding: "5px 8px" }}
                          >
                            {DANH_SACH_THAM_PHAN.map((tp) => (
                              <option key={tp} value={tp}>{tp}</option>
                            ))}
                          </select>
                        </td>

                        {/* Ghi chú */}
                        <td
                          onClick={(e) => e.stopPropagation()}
                          style={{ ...TD_STYLE, fontFamily: F, borderRight: "none", verticalAlign: "top" }}
                        >
                          <input
                            placeholder="Nhập ghi chú"
                            value={r.ghiChu}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRecords((prev) =>
                                prev.map((item) =>
                                  item.id === r.id ? { ...item, ghiChu: val } : item
                                )
                              );
                            }}
                            style={{ ...inputStyle, padding: "5px 8px" }}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Danh sách thẩm phán */}
      {showJudgeListModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: RED }}>
                <Users size={18} /> Danh sách Thẩm phán TAND thành phố Hà Nội
              </div>
              <button onClick={() => setShowJudgeListModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, maxHeight: 400, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    <th style={{ ...TH_STYLE, width: 50, textAlign: "center" }}>STT</th>
                    <th style={TH_STYLE}>Họ và tên</th>
                    <th style={TH_STYLE}>Chức danh</th>
                    <th style={TH_STYLE}>Số vụ đang giải quyết</th>
                  </tr>
                </thead>
                <tbody>
                  {DANH_SACH_THAM_PHAN.map((tp, i) => (
                    <tr key={tp} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{i + 1}</td>
                      <td style={{ ...TD_STYLE, fontWeight: 600, color: TEXT }}>{tp}</td>
                      <td style={{ ...TD_STYLE, color: MUTED }}>Thẩm phán Tòa án nhân dân thành phố Hà Nội</td>
                      <td style={{ ...TD_STYLE, color: "#1a5a96", fontWeight: 600 }}>{Math.floor(Math.random() * 8) + 2} vụ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "12px 20px", background: "#fafafa", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowJudgeListModal(false)}
                style={{ padding: "7px 20px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhanCongThamPhanView;
