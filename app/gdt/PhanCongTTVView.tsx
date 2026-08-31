import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  X,
  UserCheck,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";

const DANH_SACH_TTV = [
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

interface CaseRow {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  giaiDoan: string;
  qhpl: string;
  ndkn: string;
  nbk: string;
  ngayNhanTHS: string;
  giaiDoanPC: string;
  ngayPCTTV: string;
  ttv: string;
}

const INITIAL_CHUA_PHAN_CONG: CaseRow[] = [
  {
    id: 1,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp về thừa kế tài sản",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
  {
    id: 2,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
  {
    id: 3,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "thu",
    ngayBA: "07/08/2026",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "Xử phạt vi phạm hành chính",
    ndkn: "f",
    nbk: "sdfdsf",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
  {
    id: 4,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
  {
    id: 5,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "108/2026/HS-ST",
    ngayBA: "12/06/2026",
    toaAn: "Tòa án nhân dân khu vực 5 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tội cố ý gây thương tích",
    ndkn: "Nguyễn Văn Tuấn",
    nbk: "Vũ Thị Hương",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
  {
    id: 6,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "42/2026/HC-ST",
    ngayBA: "19/05/2026",
    toaAn: "Tòa án nhân dân khu vực 3 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện quyết định thu hồi đất",
    ndkn: "Lê Văn Hùng",
    nbk: "UBND quận Hải Châu",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
  },
];

const INITIAL_DA_PHAN_CONG: CaseRow[] = [
  {
    id: 101,
    soThuLy: "3539",
    ngayThuLy: "25/05/2026",
    soBA: "3504",
    ngayBA: "25/05/2026",
    toaAn: "Tòa án nhân dân khu vực 2 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Nguyễn Văn Rô",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Thị Thúy Hường",
  },
  {
    id: 102,
    soThuLy: "2328917",
    ngayThuLy: "02/06/2026",
    soBA: "32",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân khu vực 5 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Vũ Xuân Hiền",
  },
  {
    id: 103,
    soThuLy: "239872",
    ngayThuLy: "27/05/2026",
    soBA: "2809",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân khu vực 1 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Hoàng Anh Test",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Thị Hường",
  },
  {
    id: 104,
    soThuLy: "23715",
    ngayThuLy: "27/05/2026",
    soBA: "GĐT-2026-0158",
    ngayBA: "23/05/2026",
    toaAn: "Tòa án nhân dân thành phố Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Nguyễn Văn Bình",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Đức Thiện",
  },
  {
    id: 105,
    soThuLy: "5468112",
    ngayThuLy: "08/06/2026",
    soBA: "78/2026/DS-ST",
    ngayBA: "01/06/2026",
    toaAn: "Tòa án nhân dân khu vực 2 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp đất đai",
    ndkn: "Đỗ Văn Hải",
    nbk: "Trần Thị Nga",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "28/06/2026",
    ttv: "Vũ Diệu Thúy",
  },
  {
    id: 106,
    soThuLy: "5468190",
    ngayThuLy: "15/06/2026",
    soBA: "112/2026/HC-ST",
    ngayBA: "10/06/2026",
    toaAn: "Tòa án nhân dân khu vực 5 - Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện bồi thường",
    ndkn: "Lê Thị Tuyết",
    nbk: "UBND Thành phố Hà Nội",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "30/06/2026",
    ttv: "Đặng Thị Mai",
  },
];

export function PhanCongTTVView() {
  const [activeTab, setActiveTab] = useState<"chua-phan-cong" | "da-phan-cong">("chua-phan-cong");
  // Chỉ còn MỘT hình thức phân công: chỉ định. Bỏ phân công ngẫu nhiên vì
  // người có thẩm quyền phải chọn đích danh TTV, không bốc thăm.
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Form Filter states
  const [fNgayTLTu, setFNgayTLTu] = useState("");
  const [fNgayTLDen, setFNgayTLDen] = useState("");
  const [fSoTL, setFSoTL] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fGiaiDoan, setFGiaiDoan] = useState("");
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fNguoiKN, setFNguoiKN] = useState("");
  const [fBiDon, setFBiDon] = useState("");
  const [fTTV, setFTTV] = useState("");

  // Table row data
  const [chuaPCRows, setChuaPCRows] = useState<CaseRow[]>(INITIAL_CHUA_PHAN_CONG);
  const [daPCRows, setDaPCRows] = useState<CaseRow[]>(INITIAL_DA_PHAN_CONG);

  // Selected row checkbox IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Popups
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CaseRow | null>(null);

  // Modal assign inputs
  const [assignTTV, setAssignTTV] = useState(DANH_SACH_TTV[0]);

  const handleResetFilters = () => {
    setFNgayTLTu("");
    setFNgayTLDen("");
    setFSoTL("");
    setFLoaiAn("");
    setFGiaiDoan("");
    setFToaRaBA("");
    setFSoBA("");
    setFNgayBA("");
    setFNguoiKN("");
    setFBiDon("");
    setFTTV("");
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, list: CaseRow[]) => {
    if (e.target.checked) {
      setSelectedIds(list.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecutePhanCong = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 vụ án để phân công TTV!");
      return;
    }

    setShowAssignModal(true);
  };

  const handleConfirmChiDinh = () => {
    const assignedRows: CaseRow[] = [];
    const remainingRows: CaseRow[] = [];

    chuaPCRows.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        assignedRows.push({
          ...r,
          giaiDoanPC: "GĐ Xét xử GĐT, TT",
          ngayPCTTV: "26/06/2026",
          ttv: assignTTV,
        });
      } else {
        remainingRows.push(r);
      }
    });

    setChuaPCRows(remainingRows);
    setDaPCRows((prev) => [...assignedRows, ...prev]);
    setSelectedIds([]);
    setShowAssignModal(false);
    alert(`Đã phân công chỉ định thành công cho TTV: ${assignTTV}!`);
    setActiveTab("da-phan-cong");
  };

  const currentRows = activeTab === "chua-phan-cong" ? chuaPCRows : daPCRows;

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

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  const TH_CUSTOM: React.CSSProperties = {
    ...TH_STYLE,
    padding: "9px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#333333",
    background: "#fafafa",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    whiteSpace: "nowrap",
  };

  const TD_CUSTOM: React.CSSProperties = {
    ...TD_STYLE,
    padding: "10px 12px",
    fontSize: 12,
    color: TEXT,
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    verticalAlign: "top",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#fafafa", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;/&nbsp; <span style={{ color: TEXT, fontWeight: 600 }}>Phân công TTV</span>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Phân công TTV
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${BORDER}`, background: "transparent" }}>
          <button
            onClick={() => {
              setActiveTab("chua-phan-cong");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chua-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chua-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "chua-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Chưa phân công TTV
          </button>
          <button
            onClick={() => {
              setActiveTab("da-phan-cong");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "da-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "da-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "da-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Đã phân công TTV
          </button>
        </div>

        {/* Đã bỏ cặp radio "ngẫu nhiên / chỉ định": chỉ còn phân công chỉ định
            nên không còn gì để chọn. */}

        {/* Search Filter Box */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Ngày thụ lý</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      placeholder="Từ ngày"
                      value={fNgayTLTu}
                      onChange={(e) => setFNgayTLTu(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        placeholder="Đến ngày"
                        value={fNgayTLDen}
                        onChange={(e) => setFNgayTLDen(e.target.value)}
                        style={inputStyle}
                      />
                      <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Số thụ lý</label>
                  <input
                    placeholder="Số thụ lý"
                    value={fSoTL}
                    onChange={(e) => setFSoTL(e.target.value)}
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
                    <option value="">Vui lòng chọn</option>
                    {LOAI_AN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Giai đoạn</label>
                  <select
                    value={fGiaiDoan}
                    onChange={(e) => setFGiaiDoan(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Sơ thẩm">Sơ thẩm</option>
                    <option value="Phúc thẩm">Phúc thẩm</option>
                    <option value="Giám đốc thẩm">Giám đốc thẩm</option>
                    <option value="Tái thẩm">Tái thẩm</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Tòa ra bản án/quyết định</label>
                  <select
                    value={fToaRaBA}
                    onChange={(e) => setFToaRaBA(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn tòa ra bản án/quyết định</option>
                    <option value="TAND thành phố Hà Nội">Tòa án nhân dân thành phố Hà Nội</option>
                    <option value="TAND khu vực 1 - Hà Nội">Tòa án nhân dân khu vực 1 - Hà Nội</option>
                    <option value="TAND TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
                    <option value="TAND khu vực 4 - Hà Nội">Tòa án nhân dân khu vực 4 - Hà Nội</option>
                    <option value="TAND khu vực 2 - Hà Nội">Tòa án nhân dân khu vực 2 - Hà Nội</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Số bản án/quyết định</label>
                  <input
                    placeholder="Nhập số bản án/quyết định"
                    value={fSoBA}
                    onChange={(e) => setFSoBA(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày bản án/quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Vui lòng chọn"
                      value={fNgayBA}
                      onChange={(e) => setFNgayBA(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Nguyên đơn/Người khiếu nại</label>
                  <input
                    placeholder="Nhập tên"
                    value={fNguoiKN}
                    onChange={(e) => setFNguoiKN(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Bị đơn/Bị cáo</label>
                  <input
                    placeholder="Nhập tên"
                    value={fBiDon}
                    onChange={(e) => setFBiDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>TTV</label>
                  <select
                    value={fTTV}
                    onChange={(e) => setFTTV(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn TTV</option>
                    {DANH_SACH_TTV.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div />
                <div />
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: filterExpanded ? 14 : 0 }}>
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
                padding: 0,
                fontWeight: 500,
              }}
            >
              {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {filterExpanded ? "Thu gọn" : "Mở rộng"}
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => alert("Đang lọc danh sách phân công TTV...")}
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

        {/* Table Action Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          {activeTab === "chua-phan-cong" ? (
            <button
              onClick={handleExecutePhanCong}
              style={{
                padding: "7px 18px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              Phân công
            </button>
          ) : (
            <button
              onClick={() => alert("Đã lưu thông tin phân công thành công!")}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              Lưu phân công
            </button>
          )}

          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
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
            <Printer size={13} /> In báo cáo
          </button>

          <button
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
          </button>
        </div>

        {/* Main Data Table */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr>
                  <th style={{ ...TH_CUSTOM, width: 36, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === currentRows.length && currentRows.length > 0}
                      onChange={(e) => handleSelectAll(e, currentRows)}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ ...TH_CUSTOM, width: 44, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_CUSTOM, width: "12%" }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_CUSTOM, width: "23%" }}>Thông tin bản án/quyết định và QHPL</th>
                  <th style={{ ...TH_CUSTOM, width: "14%" }}>Đương sự</th>
                  <th style={{ ...TH_CUSTOM, width: "10%" }}>Ngày TTV nhận THS</th>
                  <th style={{ ...TH_CUSTOM, width: "11%" }}>Ngày phân công TTV</th>
                  <th style={{ ...TH_CUSTOM, width: "13%" }}>TTV</th>
                  <th style={{ ...TH_CUSTOM, width: 60, textAlign: "center", borderRight: "none" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ ...TD_CUSTOM, textAlign: "center", padding: 36, color: MUTED }}>
                      Không có bản ghi nào
                    </td>
                  </tr>
                ) : (
                  currentRows.map((r, index) => {
                    const isSelected = selectedIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        style={{
                          background: isSelected ? "#f0f7ff" : index % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ ...TD_CUSTOM, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(r.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ ...TD_CUSTOM, textAlign: "center", fontWeight: 600, color: MUTED }}>
                          {index + 1}
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.soThuLy !== "-" ? (
                            <div>
                              <div><b>Số:</b> {r.soThuLy}</div>
                              <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Ngày TL:</b> {r.ngayThuLy}</div>
                            </div>
                          ) : (
                            <span style={{ color: MUTED }}>-</span>
                          )}
                        </td>
                        <td style={TD_CUSTOM}>
                          <div>
                            <div><b>Số BA:</b> {r.soBA} &nbsp; <b>Ngày:</b> {r.ngayBA}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Tại:</b> {r.toaAn}</div>
                            {r.giaiDoan && (
                              <div style={{ marginTop: 4 }}>
                                <span style={{ background: "#fff8e1", color: "#e67e22", border: "1px solid #f0d98a", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
                                  Giai đoạn: {r.giaiDoan}
                                </span>
                              </div>
                            )}
                            {r.qhpl && (
                              <div style={{ color: "#1a73e8", marginTop: 4, fontSize: 11, fontWeight: 500 }}>
                                <b>QHPL:</b> {r.qhpl}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.ndkn || r.nbk ? (
                            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                              {r.ndkn && <div><b>NĐ/NKK:</b> {r.ndkn}</div>}
                              {r.nbk && <div><b>BĐ/NBK:</b> {r.nbk}</div>}
                            </div>
                          ) : (
                            <span style={{ color: MUTED }}>-</span>
                          )}
                        </td>
                        <td style={TD_CUSTOM}>
                          <span style={{ color: MUTED }}>{r.ngayNhanTHS}</span>
                        </td>
                        <td style={TD_CUSTOM}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#1a5a96" }}>{r.giaiDoanPC}</div>
                            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayPCTTV}</div>
                          </div>
                        </td>
                        <td style={TD_CUSTOM}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#1a5a96" }}>{r.giaiDoanPC}</div>
                            <div style={{ fontSize: 11, fontWeight: r.ttv !== "-" ? 600 : 400, color: r.ttv !== "-" ? TEXT : MUTED, marginTop: 2 }}>
                              {r.ttv}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...TD_CUSTOM, textAlign: "center", borderRight: "none" }}>
                          <button
                            onClick={() => setShowDetailModal(r)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#1a73e8",
                              padding: 4,
                              borderRadius: 4,
                            }}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
            <div>
              Hiển thị 1-{currentRows.length} trong tổng {activeTab === "chua-phan-cong" ? "9" : "641"} bản ghi
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>‹</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${RED}`, background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>1</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>2</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>3</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>4</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>5</button>
              <span>...</span>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>65</button>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>›</button>
              <select style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", outline: "none", marginLeft: 8 }}>
                <option>10 / trang</option>
                <option>20 / trang</option>
                <option>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phân công chỉ định */}
      {showAssignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 560, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: RED }}>
                <UserCheck size={18} /> Phân công chỉ định TTV
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#f0f7ff", border: "1px solid #c3d5ef", padding: "10px 14px", borderRadius: 6, fontSize: 12, color: "#1a5a96" }}>
                Đang phân công cho <b>{selectedIds.length}</b> vụ án đã chọn.
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Chọn TTV giải quyết (*)
                </label>
                <select
                  value={assignTTV}
                  onChange={(e) => setAssignTTV(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                >
                  {DANH_SACH_TTV.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

            </div>

            <div style={{ padding: "12px 20px", background: "#fafafa", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmChiDinh}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                ✓ Xác nhận phân công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết vụ án */}
      {showDetailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: RED }}>
                📄 Thông tin chi tiết vụ án
              </div>
              <button onClick={() => setShowDetailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày thụ lý:</span>
                <span>{showDetailModal.soThuLy} – {showDetailModal.ngayThuLy}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày bản án:</span>
                <span>{showDetailModal.soBA} – {showDetailModal.ngayBA}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Tòa án ra bản án:</span>
                <span>{showDetailModal.toaAn}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Quan hệ pháp luật:</span>
                <span>{showDetailModal.qhpl || "Chưa cập nhật"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Đương sự:</span>
                <span>{showDetailModal.ndkn ? `NĐ/NKK: ${showDetailModal.ndkn} - BĐ/NBK: ${showDetailModal.nbk}` : "Chưa cập nhật"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0" }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>TTV:</span>
                <span style={{ fontWeight: 600, color: "#1a5a96" }}>{showDetailModal.ttv}</span>
              </div>
            </div>
            <div style={{ padding: "12px 20px", background: "#fafafa", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDetailModal(null)}
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

export default PhanCongTTVView;
