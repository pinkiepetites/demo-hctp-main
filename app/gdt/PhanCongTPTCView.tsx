import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  FileSignature,
  CheckCircle2,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";
import { Button, Input } from "antd";

const DANH_SACH_TPB3 = [
  "Lê Thị Thu Hiền",
  "Nguyễn Văn A",
  "Trần Văn B",
  "Phạm Văn C",
  "Đinh Thị Vân Anh",
];

const DANH_SACH_TOA_AN = [
  "Tòa án nhân dân tối cao",
  "Tòa án nhân dân cấp cao tại Hà Nội",
  "Tòa án nhân dân cấp cao tại Đà Nẵng",
  "Tòa án nhân dân cấp cao tại TP Hồ Chí Minh",
  "Tòa án nhân dân TP Hà Nội",
  "Tòa án nhân dân tỉnh Bắc Ninh",
  "Tòa án nhân dân tỉnh Cần Thơ",
];

interface CaseTPTCRow {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  soDon: string;
  moTaDon: string;
  soBA: string;
  ngayBA: string;
  toaBA: string;
  capXetXu: string;
  ndkn: string;
  ndd: string;
  ttv: string;
  ldv: string;
  tp: string;
  soLanTrinhTPB3: number;
  soLanTrinh: number;
  soToTrinh: string;
  ngayToTrinh: string;
  nguoiTrinh: string;
  trangThaiKy: string;
  daTaoToTrinh: boolean;
}

const INITIAL_CHUA_TAO_TT: CaseTPTCRow[] = [
  {
    id: 1,
    soThuLy: "2329813",
    ngayThuLy: "10/06/2026",
    soDon: "Số đơn 3",
    moTaDon: "(2 đơn TLM)",
    soBA: "CVKN_GĐT",
    ngayBA: "20/07/2026",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm",
    ndkn: "VŨ HUY HOÀNG",
    ndd: "NGUYỄN MINH PHONG",
    ttv: "Đinh Thị Vân Anh",
    ldv: "Lê Thị Thu Hiền",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 0,
    soLanTrinh: 0,
    soToTrinh: "-",
    ngayToTrinh: "-",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Chờ ký",
    daTaoToTrinh: false,
  },
  {
    id: 2,
    soThuLy: "2329813",
    ngayThuLy: "10/06/2026",
    soDon: "Số đơn 3",
    moTaDon: "(2 đơn TLM)",
    soBA: "CVKN_GĐT",
    ngayBA: "20/07/2026",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm",
    ndkn: "VŨ HUY HOÀNG",
    ndd: "NGUYỄN MINH PHONG",
    ttv: "Đinh Thị Vân Anh",
    ldv: "Lê Thị Thu Hiền",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 0,
    soLanTrinh: 0,
    soToTrinh: "-",
    ngayToTrinh: "-",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Chờ ký",
    daTaoToTrinh: false,
  },
];

const INITIAL_DA_TAO_TT: CaseTPTCRow[] = [
  {
    id: 101,
    soThuLy: "2330114",
    ngayThuLy: "15/06/2026",
    soDon: "Số đơn 1",
    moTaDon: "(1 đơn TLM)",
    soBA: "112/2026/HS-ST",
    ngayBA: "10/06/2026",
    toaBA: "Tòa án nhân dân TP Đà Nẵng",
    capXetXu: "Sơ thẩm",
    ndkn: "TRẦN VĂN ĐỒNG",
    ndd: "LÊ VĂN THUẬN",
    ttv: "Nguyễn Thị Hường",
    ldv: "Phạm Thị Bích Ngọc",
    tp: "Nguyễn Văn Cường",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "15/TT-TA",
    ngayToTrinh: "25/06/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 102,
    soThuLy: "2330452",
    ngayThuLy: "18/06/2026",
    soDon: "Số đơn 2",
    moTaDon: "(2 đơn TLM)",
    soBA: "78/2026/DS-PT",
    ngayBA: "12/06/2026",
    toaBA: "Tòa án nhân dân TP Hải Phòng",
    capXetXu: "Phúc thẩm",
    ndkn: "HOÀNG THỊ THỦY",
    ndd: "VŨ ĐÌNH TRỌNG",
    ttv: "Vũ Xuân Hiền",
    ldv: "Lê Thị Thu Hiền",
    tp: "Trần Hồng Hà",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "18/TT-TA",
    ngayToTrinh: "28/06/2026",
    nguoiTrinh: "Nguyễn Như Thắng - Vụ trưởng",
    trangThaiKy: "Đã trình ký",
    daTaoToTrinh: true,
  },
  {
    id: 103,
    soThuLy: "2330890",
    ngayThuLy: "20/06/2026",
    soDon: "Số đơn 4",
    moTaDon: "(3 đơn TLM)",
    soBA: "45/2026/HC-ST",
    ngayBA: "14/06/2026",
    toaBA: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Sơ thẩm",
    ndkn: "ĐỖ VĂN NAM",
    ndd: "UBND TỈNH VĨNH PHÚC",
    ttv: "Nguyễn Đức Thiện",
    ldv: "Nguyễn Biên Thùy",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 2,
    soLanTrinh: 2,
    soToTrinh: "22/TT-TA",
    ngayToTrinh: "02/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 104,
    soThuLy: "2331200",
    ngayThuLy: "22/06/2026",
    soDon: "Số đơn 1",
    moTaDon: "(1 đơn TLM)",
    soBA: "90/2026/KDTM-ST",
    ngayBA: "18/06/2026",
    toaBA: "Tòa án nhân dân TP Hồ Chí Minh",
    capXetXu: "Sơ thẩm",
    ndkn: "CÔNG TY CP TÂN PHÁT",
    ndd: "NGUYỄN VĂN THÀNH",
    ttv: "Vũ Diệu Thúy",
    ldv: "Phạm Thị Bích Ngọc",
    tp: "Nguyễn Văn Cường",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "26/TT-TA",
    ngayToTrinh: "05/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 105,
    soThuLy: "2331560",
    ngayThuLy: "25/06/2026",
    soDon: "Số đơn 2",
    moTaDon: "(1 đơn TLM)",
    soBA: "105/2026/HS-PT",
    ngayBA: "20/06/2026",
    toaBA: "TAND cấp cao tại Đà Nẵng",
    capXetXu: "Phúc thẩm",
    ndkn: "LÊ HOÀNG YẾN",
    ndd: "TRẦN MINH TÂM",
    ttv: "Đặng Thị Mai",
    ldv: "Nguyễn Như Thắng",
    tp: "Trần Hồng Hà",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "30/TT-TA",
    ngayToTrinh: "10/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
];

export function PhanCongTPTCView() {
  const [activeTab, setActiveTab] = useState<"chua-tao" | "da-tao">("chua-tao");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Search Filter form states
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fTPB3, setFTPB3] = useState("");
  const [fNguyenDon, setFNguyenDon] = useState("");
  const [fBiDon, setFBiDon] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");

  // Table selections
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [chuaTaoRows, setChuaTaoRows] = useState<CaseTPTCRow[]>(INITIAL_CHUA_TAO_TT);
  const [daTaoRows, setDaTaoRows] = useState<CaseTPTCRow[]>(INITIAL_DA_TAO_TT);

  // Modals
  const [showThemToTrinhModal, setShowThemToTrinhModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [showViewToTrinhModal, setShowViewToTrinhModal] = useState<CaseTPTCRow | null>(null);

  // Form input for Them To Trinh
  const [inputSoTT, setInputSoTT] = useState("35/TT-TA");
  const [inputNgayTT, setInputNgayTT] = useState("09/08/2026");
  const [inputNguoiTrinh, setInputNguoiTrinh] = useState("Nguyễn Văn A - Phó CA");
  const [inputGhiChuTT, setInputGhiChuTT] = useState("Kính trình Phó Chánh án TAND tối cao xem xét phân công Thẩm phán Tối cao giải quyết vụ án theo thẩm quyền.");

  const currentRows = activeTab === "chua-tao" ? chuaTaoRows : daTaoRows;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentRows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setFSoBA("");
    setFNgayBA("");
    setFToaRaBA("");
    setFTPB3("");
    setFNguyenDon("");
    setFBiDon("");
    setFLoaiAn("");
  };

  const handleConfirmThemToTrinh = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 vụ án để tạo tờ trình!");
      return;
    }

    const createdRows: CaseTPTCRow[] = [];
    const remainingRows: CaseTPTCRow[] = [];

    chuaTaoRows.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        createdRows.push({
          ...r,
          soToTrinh: inputSoTT,
          ngayToTrinh: inputNgayTT,
          nguoiTrinh: inputNguoiTrinh,
          trangThaiKy: "Đã tạo tờ trình",
          daTaoToTrinh: true,
          soLanTrinh: r.soLanTrinh + 1,
        });
      } else {
        remainingRows.push(r);
      }
    });

    setChuaTaoRows(remainingRows);
    setDaTaoRows((prev) => [...createdRows, ...prev]);
    setSelectedIds([]);
    setShowThemToTrinhModal(false);
    alert(`Đã thêm tờ trình phân công TPTC thành công cho ${createdRows.length} vụ án!`);
    setActiveTab("da-tao");
  };

  const handleConfirmTrinhKy = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 vụ án để trình ký!");
      return;
    }

    setDaTaoRows((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, trangThaiKy: "Đã trình ký" } : r
      )
    );

    setChuaTaoRows((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, trangThaiKy: "Đã trình ký" } : r
      )
    );

    setSelectedIds([]);
    setShowTrinhKyModal(false);
    alert("Đã gửi trình ký tờ trình lên Lãnh đạo thành công!");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 11px",
    fontSize: 14,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 14, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;/&nbsp; <b style={{ color: TEXT }}>Danh sách vụ án phân công TPTC</b>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Danh sách vụ án phân công TPTC
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 32, borderBottom: `1px solid ${BORDER}`, background: "transparent" }}>
          <Button
            onClick={() => {
              setActiveTab("chua-tao");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chua-tao" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chua-tao" ? RED : MUTED,
              fontWeight: activeTab === "chua-tao" ? 700 : 500,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS chưa tạo tờ trình ({chuaTaoRows.length})
          </Button>

          <Button
            onClick={() => {
              setActiveTab("da-tao");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "da-tao" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "da-tao" ? RED : MUTED,
              fontWeight: activeTab === "da-tao" ? 700 : 500,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS đã tạo tờ trình ({daTaoRows.length})
          </Button>
        </div>

        {/* Search Filter Box */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1: Số BA | Ngày BA | Tòa ra BA | Thẩm phán bậc 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Số bản án/quyết định</label>
                  <Input
                    placeholder="Số bản án/quyết định"
                    value={fSoBA}
                    onChange={(e) => setFSoBA(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày bản án/quyết định</label>
                  <div style={{ position: "relative" }}>
                    <Input
                      placeholder="Ngày bản án/quyết định"
                      value={fNgayBA}
                      onChange={(e) => setFNgayBA(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tòa ra bản án/quyết định</label>
                  <select
                    value={fToaRaBA}
                    onChange={(e) => setFToaRaBA(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    {DANH_SACH_TOA_AN.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Thẩm phán bậc 3</label>
                  <select
                    value={fTPB3}
                    onChange={(e) => setFTPB3(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    {DANH_SACH_TPB3.map((tp) => (
                      <option key={tp} value={tp}>{tp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Nguyên đơn | Bị đơn | Loại án | Empty */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Nguyên đơn/người khởi kiện</label>
                  <Input
                    placeholder="Nguyên đơn/người khởi kiện"
                    value={fNguyenDon}
                    onChange={(e) => setFNguyenDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Bị đơn/người bị kiện</label>
                  <Input
                    placeholder="Bị đơn/người bị kiện"
                    value={fBiDon}
                    onChange={(e) => setFBiDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Loại án</label>
                  <select
                    value={fLoaiAn}
                    onChange={(e) => setFLoaiAn(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn</option>
                    {LOAI_AN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div />
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: filterExpanded ? 14 : 0 }}>
            <Button
              onClick={() => setFilterExpanded(!filterExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#2563eb",
                fontFamily: F,
                padding: 0,
                fontWeight: 500,
              }}
            >
              {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {filterExpanded ? "Thu gọn" : "Mở rộng"}
            </Button>

            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={() => alert("Đang tìm kiếm danh sách vụ án phân công TPTC...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </Button>

              <Button
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
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Table Action Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <Button
            onClick={() => {
              if (selectedIds.length === 0) {
                alert("Vui lòng chọn ít nhất 1 vụ án để thêm tờ trình!");
                return;
              }
              setShowThemToTrinhModal(true);
            }}
            style={{
              padding: "7px 18px",
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Thêm tờ trình
          </Button>

          <Button
            onClick={() => {
              if (selectedIds.length === 0) {
                alert("Vui lòng chọn ít nhất 1 vụ án để trình ký!");
                return;
              }
              setShowTrinhKyModal(true);
            }}
            style={{
              padding: "7px 18px",
              background: "#800000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Trình ký
          </Button>

          <Button
            onClick={() => alert("Đã làm mới danh sách!")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              color: TEXT,
            }}
            title="Làm mới"
          >
            <RotateCcw size={14} color={MUTED} />
          </Button>
        </div>

        {/* Main Data Table */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ ...TH_STYLE, width: 36, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>
                    <Input
                      type="checkbox"
                      checked={currentRows.length > 0 && selectedIds.length === currentRows.length}
                      onChange={handleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ ...TH_STYLE, width: 44, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>STT</th>
                  <th style={{ ...TH_STYLE, width: "13%", borderRight: `1px solid ${BORDER}` }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_STYLE, width: "23%", borderRight: `1px solid ${BORDER}` }}>Thông tin bản án/quyết định và QHPL</th>
                  <th style={{ ...TH_STYLE, width: "16%", borderRight: `1px solid ${BORDER}` }}>Đương sự & Người đề nghị</th>
                  <th style={{ ...TH_STYLE, width: "18%", borderRight: `1px solid ${BORDER}` }}>Phân công & Thông tin trình TP</th>
                  <th style={{ ...TH_STYLE, width: "18%", borderRight: `1px solid ${BORDER}` }}>Thông tin tờ trình phân công</th>
                  <th style={{ ...TH_STYLE, width: 60, textAlign: "center", borderRight: "none" }}>Tờ trình</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", padding: 36, color: MUTED }}>
                      Không có bản ghi nào trong danh sách
                    </td>
                  </tr>
                ) : (
                  currentRows.map((r, index) => {
                    const isSelected = selectedIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        style={{
                          background: isSelected ? "#eff6ff" : index % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ ...TD_STYLE, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>
                          <Input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(r.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center", fontWeight: 600, color: MUTED, borderRight: `1px solid ${BORDER}` }}>
                          {index + 1}
                        </td>

                        {/* Số & Ngày thụ lý */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div>
                            <div><b>Số:</b> {r.soThuLy}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 14 }}><b>Ngày TL:</b> {r.ngayThuLy}</div>
                            <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                                {r.soDon}
                              </span>
                              <span style={{ color: "#2563eb", fontSize: 14 }}>
                                {r.moTaDon}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Thông tin bản án / quyết định */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div>
                            <div><b>Số BA:</b> {r.soBA} &nbsp; <b>Ngày:</b> {r.ngayBA}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 14 }}><b>Tại:</b> {r.toaBA}</div>
                            {r.capXetXu && (
                              <div style={{ marginTop: 4 }}>
                                <span style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
                                  Cấp xét xử: {r.capXetXu}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Đương sự & Người đề nghị */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            <div><b>NĐKN:</b> {r.ndkn}</div>
                            <div style={{ marginTop: 2 }}><b>NĐD:</b> {r.ndd}</div>
                          </div>
                        </td>

                        {/* Phân công & Thông tin trình TP */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            <div><b>TTV:</b> {r.ttv}</div>
                            <div><b>LĐV:</b> {r.ldv}</div>
                            <div><b>TP:</b> {r.tp}</div>
                            <div style={{ color: MUTED, marginTop: 2 }}>Số lần trình TPB3: <b>{r.soLanTrinhTPB3}</b></div>
                            <div style={{ color: MUTED }}>Số lần trình: <b>{r.soLanTrinh}</b></div>
                          </div>
                        </td>

                        {/* Thông tin tờ trình phân công */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            <div><b>Số tờ trình:</b> {r.soToTrinh}</div>
                            <div><b>Ngày tờ trình:</b> {r.ngayToTrinh}</div>
                            <div style={{ fontWeight: 600, color: TEXT, marginTop: 2 }}>{r.nguoiTrinh}</div>
                            <div style={{ marginTop: 4 }}>
                              <span
                                style={{
                                  background: r.trangThaiKy === "Đã duyệt ký" ? "#d1fae5" : "#f3f4f6",
                                  color: r.trangThaiKy === "Đã duyệt ký" ? "#065f46" : "#4b5563",
                                  border: `1px solid ${r.trangThaiKy === "Đã duyệt ký" ? "#6ee7b7" : "#e5e7eb"}`,
                                  padding: "1px 8px",
                                  borderRadius: 12,
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {r.trangThaiKy}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Tờ trình icon */}
                        <td style={{ ...TD_STYLE, textAlign: "center", borderRight: "none", verticalAlign: "middle" }}>
                          <Button
                            onClick={() => setShowViewToTrinhModal(r)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#374151",
                              padding: 6,
                              borderRadius: 4,
                            }}
                            title="Xem tờ trình"
                          >
                            <FileText size={18} color="#4b5563" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 14, color: MUTED, fontFamily: F }}>
            <div>
              Hiển thị 1-{currentRows.length} trong tổng {currentRows.length} bản ghi
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14 }}>‹</Button>
              <Button style={{ padding: "4px 10px", border: `1px solid ${RED}`, background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>1</Button>
              <Button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14 }}>›</Button>
              <select style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, background: "#fff", outline: "none", marginLeft: 8 }}>
                <option>10 / trang</option>
                <option>20 / trang</option>
                <option>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm tờ trình */}
      {showThemToTrinhModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 620, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16, color: RED }}>
                <FileSignature size={18} /> Thêm tờ trình phân công Thẩm phán Tối cao
              </div>
              <Button onClick={() => setShowThemToTrinhModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </Button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 14px", borderRadius: 6, fontSize: 14, color: "#1e40af" }}>
                Đang tạo tờ trình cho <b>{selectedIds.length}</b> vụ án đã chọn.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                    Số tờ trình (*)
                  </label>
                  <Input
                    value={inputSoTT}
                    onChange={(e) => setInputSoTT(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                    Ngày tờ trình (*)
                  </label>
                  <Input
                    value={inputNgayTT}
                    onChange={(e) => setInputNgayTT(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Người trình ký (*)
                </label>
                <select
                  value={inputNguoiTrinh}
                  onChange={(e) => setInputNguoiTrinh(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Nguyễn Văn A - Phó CA">Nguyễn Văn A - Phó Chánh án</option>
                  <option value="Lê Thị Thu Hiền - Thẩm phán">Lê Thị Thu Hiền - Thẩm phán</option>
                  <option value="Nguyễn Như Thắng - Vụ trưởng">Nguyễn Như Thắng - Vụ trưởng</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Nội dung tờ trình
                </label>
                <textarea
                  rows={4}
                  value={inputGhiChuTT}
                  onChange={(e) => setInputGhiChuTT(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                />
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button
                onClick={() => setShowThemToTrinhModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 500 }}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmThemToTrinh}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
              >
                ✓ Lưu tờ trình
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trình ký */}
      {showTrinhKyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 500, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16, color: "#800000" }}>
                <CheckCircle2 size={18} /> Xác nhận trình ký tờ trình
              </div>
              <Button onClick={() => setShowTrinhKyModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </Button>
            </div>

            <div style={{ padding: 20, fontSize: 14, color: TEXT, lineHeight: 1.6 }}>
              Bạn có chắc chắn muốn gửi <b>trình ký</b> tờ trình phân công Thẩm phán Tối cao cho <b>{selectedIds.length}</b> vụ án đã chọn lên Lãnh đạo Tòa án nhân dân tối cao duyệt ký?
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button
                onClick={() => setShowTrinhKyModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 500 }}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmTrinhKy}
                style={{ padding: "7px 20px", border: "none", background: "#800000", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
              >
                ✓ Xác nhận trình ký
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Tờ Trình */}
      {showViewToTrinhModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: RED }}>
                📄 Tờ trình phân công Thẩm phán Tòa án nhân dân tối cao
              </div>
              <Button onClick={() => setShowViewToTrinhModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </Button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, fontSize: 14, lineHeight: 1.7, background: "#fff" }}>
              <div style={{ textAlign: "center", borderBottom: `1px dashed ${BORDER}`, paddingBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ fontWeight: 600, color: RED, marginTop: 4, fontSize: 14 }}>TỜ TRÌNH PHÂN CÔNG THẨM PHÁN TỐI CAO</div>
                <div style={{ color: MUTED, fontSize: 14, marginTop: 2 }}>Số: {showViewToTrinhModal.soToTrinh !== "-" ? showViewToTrinhModal.soToTrinh : "35/TT-TA"} &nbsp;•&nbsp; Ngày: {showViewToTrinhModal.ngayToTrinh !== "-" ? showViewToTrinhModal.ngayToTrinh : "09/08/2026"}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Vụ án thụ lý số:</span>
                <span><b>{showViewToTrinhModal.soThuLy}</b> (Ngày {showViewToTrinhModal.ngayThuLy})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Bản án đề nghị:</span>
                <span>{showViewToTrinhModal.soBA} – Ngày {showViewToTrinhModal.ngayBA} ({showViewToTrinhModal.toaBA})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Đương sự:</span>
                <span>NĐKN: {showViewToTrinhModal.ndkn} &nbsp;•&nbsp; NĐD: {showViewToTrinhModal.ndd}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm phán Bậc 3:</span>
                <span>{showViewToTrinhModal.tp}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm tra viên:</span>
                <span>{showViewToTrinhModal.ttv}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Người trình ký:</span>
                <span><b>{showViewToTrinhModal.nguoiTrinh}</b></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Trạng thái ký duyệt:</span>
                <span style={{ color: "#065f46", fontWeight: 700 }}>{showViewToTrinhModal.trangThaiKy}</span>
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button
                onClick={() => window.print()}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 500 }}
              >
                In tờ trình
              </Button>
              <Button
                onClick={() => setShowViewToTrinhModal(null)}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhanCongTPTCView;
