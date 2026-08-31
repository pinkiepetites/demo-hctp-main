import React, { useState } from "react";
import { X, FileText, Calendar } from "lucide-react";
import { F, BORDER, TEXT, MUTED } from "./shared";
import { TrinhKyModal } from "./TrinhKyModal";

// ── Word preview / editor modal cho Dự thảo văn bản giải quyết ─────────────────
export function XemBieuMauDuThaoModal({
  onClose,
  detail,
  ketQua,
  soQuyetDinh,
  ngayQuyetDinh,
  nguoiKy,
  noiDung,
}: {
  onClose: () => void;
  detail?: any;
  ketQua: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  nguoiKy: string;
  noiDung: string;
}) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const isKhangNghi = ketQua === "khang-nghi";
  const isTamHoan = ketQua === "tam-hoan";
  const isChapNhan = ketQua === "chap-nhan";
  const isKhongChapNhan = ketQua === "khong-chap-nhan";
  const isXepDon = ketQua === "xep-don";

  const titleDoc = isKhieuNai
    ? isChapNhan
      ? "QUYẾT ĐỊNH GIẢI QUYẾT KHIẾU NẠI (CHẤP NHẬN KHIẾU NẠI)"
      : isKhongChapNhan
      ? "QUYẾT ĐỊNH GIẢI QUYẾT KHIẾU NẠI (KHÔNG CHẤP NHẬN KHIẾU NẠI)"
      : isXepDon
      ? "THÔNG BÁO XẾP ĐƠN KHIẾU NẠI"
      : "QUYẾT ĐỊNH GIẢI QUYẾT KHIẾU NẠI"
    : isKhangNghi
    ? "QUYẾT ĐỊNH KHÁNG NGHỊ GIÁM ĐỐC THẨM"
    : isTamHoan
    ? "QUYẾT ĐỊNH TẠM HOÃN THI HÀNH ÁN"
    : isXepDon
    ? "THÔNG BÁO XẾP ĐƠN"
    : "THÔNG BÁO VỀ VIỆC GIẢI QUYẾT ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM";

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px",
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: F,
    color: TEXT,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: F,
    background: "#fff",
    cursor: "pointer",
  };

  const getDoiTuongText = () => {
    const loai = ((detail?.loaiAn || detail?.linhVuc || detail?.tenVuAn || detail?.maVuAn || "") + "").toLowerCase();
    if (loai.includes("hành chính") || loai.includes("hc")) {
      const nkk = detail?.nguoiKhoiKien || detail?.nkk || "Nguyễn Văn A";
      const nbk = detail?.nguoiBiKien || detail?.nbk || "Ủy ban nhân dân tỉnh X";
      return `Người khởi kiện (NKK): ${nkk} – Người bị kiện (NBK): ${nbk}`;
    } else if (loai.includes("dân sự") || loai.includes("ds") || loai.includes("hôn nhân") || loai.includes("lao động") || loai.includes("kinh doanh")) {
      const nguyenDon = detail?.nguyenDon || "Trần Thị B";
      const biDon = detail?.biDon || "Nguyễn Văn C";
      return `Nguyên đơn: ${nguyenDon} – Bị đơn: ${biDon}`;
    } else if (loai.includes("khiếu nại") || loai.includes("kn")) {
      const nkn = detail?.nguoiKhieuNai || detail?.nkn || "Lê Văn D";
      const nbkn = detail?.nguoiBiKhieuNai || "Tòa án nhân dân khu vực 1 - Hà Nội";
      return `Người khiếu nại: ${nkn} – Người bị khiếu nại: ${nbkn}`;
    } else {
      const biCan = detail?.tenBiCan || detail?.biCan || detail?.biCao || "Phan Văn Thành";
      return `Bị can/Bị cáo: ${biCan}`;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f5f5f5",
        zIndex: 3500,
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: F,
      }}
    >
      {/* Header Ribbon bar Word Style */}
      <div
        style={{
          background: "#2b579a",
          color: "#fff",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{titleDoc}.docx</span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>
                Chế độ chỉnh sửa Word trực tiếp
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => alert("Đã lưu nội dung Dự thảo Word thành công!")}
            style={{
              padding: "7px 20px",
              background: "#1b5e20",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Word Toolbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          flexWrap: "wrap",
          fontSize: 12,
          fontFamily: F,
        }}
      >
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại">↪ Làm lại</button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <select onChange={e => { setFontFamily(e.target.value); execCmd("fontName", e.target.value); }} value={fontFamily} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
        </select>

        <select onChange={e => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="13.5pt">13.5 pt</option>
          <option value="14pt">14 pt</option>
        </select>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân"><u>U</u></button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều">☰</button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => window.print()} style={tbBtnSt}>🖨 In</button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#e8f5e9", color: "#1b5e20", borderColor: "#a5d6a7", fontWeight: 600 }}>
          📥 Tải file Word
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      {/* Editable Canvas */}
      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cccccc" }}>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794,
            minHeight: 1123,
            background: "#fff",
            boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
            padding: "54px 64px",
            boxSizing: "border-box",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            fontFamily: fontFamily,
            color: "#000",
            lineHeight: 1.6,
            fontSize: fontSize,
            outline: "none",
            cursor: "text",
          }}
        >
          {/* Header */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                  <div style={{ fontSize: "12pt", marginTop: 4 }}>
                    Số: {soQuyetDinh || "...... /QĐ-TAHN"}
                  </div>
                </td>
                <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>
                    Độc lập – Tự do – Hạnh phúc
                  </div>
                  <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                    Hà Nội, ngày {ngayQuyetDinh ? ngayQuyetDinh.split("/")[0] || "..." : "..."} tháng {ngayQuyetDinh ? ngayQuyetDinh.split("/")[1] || "..." : "..."} năm 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: "center", margin: "24px 0 16px" }}>
            <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>{titleDoc}</div>
            <div style={{ fontSize: "13pt", fontWeight: "bold", marginTop: 4 }}>
              Đối với: {detail?.tenVuAn || "Vụ án Phan Văn Thành"}
            </div>
            <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 2, color: "#333333" }}>
              ({getDoiTuongText()})
            </div>
          </div>

          {/* Content */}
          <div style={{ textAlign: "justify", lineHeight: 1.65 }}>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              Căn cứ Bộ luật Tố tụng hình sự / Tố tụng dân sự / Tố tụng hành chính hiện hành; Luật Tổ chức Tòa án nhân dân năm 2024;
            </p>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              Sau khi xem xét đơn đề nghị giám đốc thẩm và hồ sơ vụ án liên quan đến Bản án số 050526_CTH02 ngày 05/05/2026 của Tòa án nhân dân khu vực 6 - Hà Nội;
            </p>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              <b>Thành phần đương sự / Đối tượng:</b> {getDoiTuongText()}
            </p>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              {noiDung ||
                (isKhangNghi
                  ? "Quyết định kháng nghị toàn bộ bản án phúc thẩm để xét xử lại theo thủ tục giám đốc thẩm theo đúng quy định của pháp luật."
                  : "Xét thấy không có căn cứ để kháng nghị theo thủ tục giám đốc thẩm đối với bản án nêu trên. Tòa án nhân dân thành phố Hà Nội thông báo để đương sự được biết.")}
            </p>
          </div>

          {/* Signatures */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 40 }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "left", verticalAlign: "top", fontSize: "11pt" }}>
                  <div style={{ fontWeight: "bold", fontStyle: "italic" }}>Nơi nhận:</div>
                  <div>- Như kính gửi;</div>
                  <div>- VKSND thành phố Hà Nội;</div>
                  <div>- Lưu: Hồ sơ vụ án, Vụ 1.</div>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>NGƯỜI KÝ BAN HÀNH</div>
                  <div style={{ height: 80 }} />
                  <div style={{ fontWeight: "bold" }}>{nguoiKy || "Nguyễn Biên Thuỳ"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Modal Tạo Dự thảo chuẩn theo thiết kế thực tế của Quản lý vụ án ────────────
export function TaoDuThaoModal({
  onClose,
  detail,
  onSave,
}: {
  onClose: () => void;
  detail?: any;
  onSave?: (data: any) => void;
}) {
  if (detail?.isCongVan || detail?.loai === "cong-van") {
    return <TaoDuThaoCongVanModal onClose={onClose} onSave={onSave} />;
  }
  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && detail.maVuAn.includes("KN")) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const maVuAn = detail?.maVuAn || (isKhieuNai ? "KN26-004128" : "VA26-00321");
  const tenVuAn = detail?.tenVuAn || (isKhieuNai ? "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TAHN" : "Vụ án Phan Văn Thành – bức cung");
  const tenBiCan = isKhieuNai ? "Nguyễn Thị Lan" : "Phan Văn Thành";
  const toiDanh = isKhieuNai ? "Khiếu nại tố tụng" : "Bức cung";
  const soBA = "050526_CTH02";
  const ngayBA = "05/05/2026";
  const toaXetXu = "Tòa án nhân dân khu vực 6 - Hà Nội";
  const giaiDoan = "Giám đốc thẩm, tái thẩm";
  const toaAnGiaiQuyet = "Tòa án nhân dân thành phố Hà Nội";
  const trangThai = "Chưa có kết quả xét xử";

  // Section 1: Thông tin đơn
  const [donLienQuan, setDonLienQuan] = useState("2 đơn/người được chọn");
  const [ketQuaGQ, setKetQuaGQ] = useState<"tra-loi" | "khang-nghi" | "chap-nhan" | "khong-chap-nhan" | "xep-don">("tra-loi");

  // Multi-select & Thêm người đứng đơn
  const [donDataList, setDonDataList] = useState([
    {
      id: "don-1",
      label: "1. Đơn 09D732899 - Phạm Minh Tuấn",
      nguoi: ["Phạm Minh Tuấn", "Phạm Văn Nam"],
    },
    {
      id: "don-2",
      label: "2. Đơn 10D732900 - Trần Văn Hùng",
      nguoi: ["Trần Văn Hùng"],
    },
  ]);
  const [donCheckedList, setDonCheckedList] = useState<Record<string, boolean>>({
    "don-1": true,
    "don-1::Phạm Minh Tuấn": true,
    "don-2": true,
    "don-2::Trần Văn Hùng": true,
  });
  const [donExpanded, setDonExpanded] = useState<Record<string, boolean>>({});
  const [donOpen, setDonOpen] = useState(false);
  const [showAddNguoiModal, setShowAddNguoiModal] = useState(false);
  const [newNguoiTen, setNewNguoiTen] = useState("");
  const [newNguoiDonId, setNewNguoiDonId] = useState("don-1");

  const toggleDonCheck = (donId: string) => {
    setDonCheckedList(prev => {
      const next = { ...prev };
      const donObj = donDataList.find(d => d.id === donId);
      const currVal = !prev[donId];
      next[donId] = currVal;
      if (donObj) {
        donObj.nguoi.forEach(n => {
          next[`${donId}::${n}`] = currVal;
        });
      }
      return next;
    });
  };

  const toggleNguoiCheck = (donId: string, nguoiTen: string) => {
    setDonCheckedList(prev => {
      const next = { ...prev };
      const key = `${donId}::${nguoiTen}`;
      next[key] = !prev[key];
      const donObj = donDataList.find(d => d.id === donId);
      if (donObj) {
        const allChecked = donObj.nguoi.every(n => next[`${donId}::${n}`]);
        next[donId] = allChecked;
      }
      return next;
    });
  };

  const getSelectedDonSummary = () => {
    let countDon = 0;
    let countNguoi = 0;
    const selectedItems: string[] = [];

    donDataList.forEach(d => {
      const checkedNguoi = d.nguoi.filter(n => donCheckedList[`${d.id}::${n}`]);
      if (donCheckedList[d.id] || checkedNguoi.length > 0) {
        countDon++;
        checkedNguoi.forEach(n => {
          countNguoi++;
          selectedItems.push(`${n} (${d.label.split(" - ")[0]})`);
        });
      }
    });

    if (countDon === 0 && countNguoi === 0) return "Chọn đơn / người đứng đơn liên quan...";
    return `${countDon} đơn / ${countNguoi} người đứng đơn được chọn (${selectedItems.join(", ")})`;
  };

  const handleAddNewNguoiDungDon = () => {
    if (!newNguoiTen.trim()) {
      alert("Vui lòng nhập tên người đứng đơn!");
      return;
    }
    const name = newNguoiTen.trim();
    setDonDataList(prev => prev.map(d => {
      if (d.id === newNguoiDonId) {
        return { ...d, nguoi: [...d.nguoi, name] };
      }
      return d;
    }));
    setDonCheckedList(prev => ({
      ...prev,
      [`${newNguoiDonId}::${name}`]: true,
    }));
    setNewNguoiTen("");
    setShowAddNguoiModal(false);
  };

  // Section 2: Thông tin quyết định
  const biCaoOptions = Array.from(
    new Set([
      detail?.biCao,
      detail?.tenBiCan,
      "Phan Văn Thành (Bị cáo đầu vụ)",
      "Nguyễn Văn Minh (Bị cáo)",
      "Trần Đình Trọng (Bị cáo)",
      "Lê Văn Hùng (Bị cáo)",
    ].filter(Boolean))
  ) as string[];
  const [selectedBiCao, setSelectedBiCao] = useState(biCaoOptions[0] || "Phan Văn Thành (Bị cáo đầu vụ)");

  const [ngayQuyetDinh, setNgayQuyetDinh] = useState("09/08/2026");
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [nguoiKy, setNguoiKy] = useState("Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("");
  const [noiDung, setNoiDung] = useState("");

  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  // Section 3: Nơi nhận table
  const [noiNhanList, setNoiNhanList] = useState([
    { id: 1, noiNhan: "Khác", noiNhanChiTiet: "Như kính gửi", ghiChu: "–" },
    { id: 2, noiNhan: "Tòa án nhân dân", noiNhanChiTiet: "Đ/c Chánh án TAND thành phố Hà Nội", ghiChu: "để báo cáo" },
  ]);

  const [isAddingNoiNhan, setIsAddingNoiNhan] = useState(false);
  const [newNoiNhan, setNewNoiNhan] = useState("Khác");
  const [newChiTiet, setNewChiTiet] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNoiNhan, setEditNoiNhan] = useState("");
  const [editChiTiet, setEditChiTiet] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const handleStartEdit = (r: { id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }) => {
    setEditingId(r.id);
    setEditNoiNhan(r.noiNhan);
    setEditChiTiet(r.noiNhanChiTiet);
    setEditGhiChu(r.ghiChu);
  };

  const handleSaveEdit = (id: number) => {
    if (!editChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, noiNhan: editNoiNhan, noiNhanChiTiet: editChiTiet.trim(), ghiChu: editGhiChu.trim() || "–" }
          : item
      )
    );
    setEditingId(null);
  };

  const handleSaveNewNoiNhan = () => {
    if (!newChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        noiNhan: newNoiNhan,
        noiNhanChiTiet: newChiTiet.trim(),
        ghiChu: newGhiChu.trim() || "–",
      },
    ]);
    setIsAddingNoiNhan(false);
    setNewChiTiet("");
    setNewGhiChu("");
  };

  const handleDeleteNoiNhan = (id: number) => {
    setNoiNhanList(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const num = Math.floor(Math.random() * 900 + 100);
      const generated = `${num}/2026/${ketQuaGQ === "khang-nghi" ? "QĐ-TAHN" : "TB-TAHN"}`;
      setSoQuyetDinh(generated);
      setDaLaySo(true);
      alert(`Đã cấp số quyết định/dự thảo thành công: ${generated}`);
    } else {
      setSoQuyetDinh("");
      setDaLaySo(false);
      alert("Đã hủy cấp số!");
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        soQuyetDinh,
        ngayQuyetDinh,
        nguoiKy,
        ketQuaGQ,
        noiDung,
        noiNhanList,
      });
    }
    alert("Đã lưu thông tin dự thảo thành công!");
    onClose();
  };

  const inSt: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 12,
    border: "1px solid #cccccc",
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
    color: "#222222",
  };

  const lblSt: React.CSSProperties = {
    fontSize: 12,
    color: "#333333",
    fontFamily: F,
    display: "block",
    marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1400,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "20px 16px",
      }}
    >
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && (
        <XemBieuMauDuThaoModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          ketQua={ketQuaGQ}
          soQuyetDinh={soQuyetDinh}
          ngayQuyetDinh={ngayQuyetDinh}
          nguoiKy={nguoiKy}
          noiDung={noiDung}
        />
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "100%",
          maxWidth: 780,
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          marginBottom: 24,
          overflow: "hidden",
          fontFamily: F,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 16, color: "#6e1414" }}>📄</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#222222", fontFamily: F }}>
              Tạo Dự thảo
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666666",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "16px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: "82vh",
            overflowY: "auto",
          }}
        >
          {/* Top Case Information Box (Mint Green background & border) */}
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: 6,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr",
                gap: "8px 16px",
                fontSize: 12,
                fontFamily: F,
                lineHeight: 1.5,
              }}
            >
              {/* Col 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#333333" }}>Mã vụ án: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 700 }}>{maVuAn}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Tên vụ án: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{tenVuAn}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Tên bị can đầu vụ: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{tenBiCan}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Tội danh chính: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toiDanh}</span>
                </div>
              </div>

              {/* Col 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#333333" }}>Số BA/QĐ: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{soBA}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Ngày ra BA/QĐ: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{ngayBA}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Tòa xét xử: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toaXetXu}</span>
                </div>
              </div>

              {/* Col 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#333333" }}>Giai đoạn: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{giaiDoan}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Tòa án giải quyết: </span>
                  <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toaAnGiaiQuyet}</span>
                </div>
                <div>
                  <span style={{ color: "#333333" }}>Trạng thái: </span>
                  <span style={{ color: "#c0392b", fontWeight: 700 }}>{trangThai}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Thông tin đơn */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!isKhieuNai && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <label style={lblSt}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Đơn liên quan / Người đứng đơn
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddNguoiModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8b1a1a",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: F,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    + Thêm người đứng đơn
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setDonOpen(o => !o)}
                    style={{
                      ...inSt,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      userSelect: "none",
                      minHeight: 34,
                      background: "#fff",
                    }}
                  >
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#222222", fontWeight: 500 }}>
                      {getSelectedDonSummary()}
                    </span>
                    <span style={{ fontSize: 10, color: "#666666", marginLeft: 6 }}>{donOpen ? "▲" : "▼"}</span>
                  </div>

                  {donOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 300,
                        background: "#fff",
                        border: "1px solid #cccccc",
                        borderRadius: 4,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        maxHeight: 280,
                        overflowY: "auto",
                        marginTop: 4,
                      }}
                    >
                      {donDataList.map(don => {
                        const isWholeDonChecked = !!donCheckedList[don.id];
                        const isExpanded = !!donExpanded[don.id];
                        const anyNguoiChecked = don.nguoi.some(n => donCheckedList[`${don.id}::${n}`]);
                        return (
                          <div key={don.id}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                borderBottom: "1px solid #e0e0e0",
                                background: isWholeDonChecked || anyNguoiChecked ? "#fdf3f2" : "#fff",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isWholeDonChecked}
                                ref={el => { if (el) el.indeterminate = !isWholeDonChecked && anyNguoiChecked; }}
                                onChange={() => toggleDonCheck(don.id)}
                                style={{ accentColor: "#8b1a1a", cursor: "pointer", flexShrink: 0 }}
                              />
                              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#222222" }}>
                                {don.label}
                              </span>
                              <button
                                type="button"
                                onClick={e => { e.stopPropagation(); setDonExpanded(p => ({ ...p, [don.id]: !p[don.id] })); }}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a73e8", padding: "2px 4px" }}
                              >
                                {isExpanded ? "▲ Thu gọn người đứng đơn" : `▼ Xem ${don.nguoi.length} người đứng đơn`}
                              </button>
                            </div>
                            {isExpanded && don.nguoi.map(nguoi => (
                              <div
                                key={nguoi}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "6px 12px 6px 32px",
                                  borderBottom: "1px solid #f5f5f5",
                                  background: donCheckedList[`${don.id}::${nguoi}`] ? "#fff5f5" : "#fafafa",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!donCheckedList[`${don.id}::${nguoi}`] || isWholeDonChecked}
                                  onChange={() => toggleNguoiCheck(don.id, nguoi)}
                                  style={{ accentColor: "#8b1a1a", cursor: "pointer", flexShrink: 0 }}
                                />
                                <span style={{ fontSize: 12, color: "#222222" }}>👤 {nguoi}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid #e0e0e0", background: "#fafafa" }}>
                        <button
                          type="button"
                          onClick={() => { setShowAddNguoiModal(true); setDonOpen(false); }}
                          style={{ fontSize: 11, color: "#8b1a1a", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                        >
                          + Thêm mới người đứng đơn
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonOpen(false)}
                          style={{ padding: "5px 16px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label style={lblSt}>
                <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Kết quả giải quyết đơn
              </label>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                {isKhieuNai ? (
                  <>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "chap-nhan" || ketQuaGQ === "tra-loi"}
                        onChange={() => setKetQuaGQ("chap-nhan")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: (ketQuaGQ === "chap-nhan" || ketQuaGQ === "tra-loi") ? 700 : 400 }}>Chấp nhận khiếu nại</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "khong-chap-nhan"}
                        onChange={() => setKetQuaGQ("khong-chap-nhan")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQuaGQ === "khong-chap-nhan" ? 700 : 400 }}>Không chấp nhận khiếu nại</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "xep-don"}
                        onChange={() => setKetQuaGQ("xep-don")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQuaGQ === "xep-don" ? 700 : 400 }}>Xếp đơn</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "khang-nghi"}
                        onChange={() => setKetQuaGQ("khang-nghi")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQuaGQ === "khang-nghi" ? 700 : 400 }}>Kháng nghị</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "tra-loi"}
                        onChange={() => setKetQuaGQ("tra-loi")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQuaGQ === "tra-loi" ? 700 : 400 }}>Trả lời đơn</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketQuaGQ"
                        checked={ketQuaGQ === "xep-don"}
                        onChange={() => setKetQuaGQ("xep-don")}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQuaGQ === "xep-don" ? 700 : 400 }}>Xếp đơn</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {ketQuaGQ === "khang-nghi" && (
              <div style={{ marginTop: 4 }}>
                <label style={lblSt}>
                  <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>
                  Chọn Bị cáo
                </label>
                <select
                  value={selectedBiCao}
                  onChange={e => setSelectedBiCao(e.target.value)}
                  style={{ ...inSt, cursor: "pointer", maxWidth: 380 }}
                >
                  <option value="">-- Chọn bị cáo --</option>
                  {biCaoOptions.map(bc => (
                    <option key={bc} value={bc}>{bc}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 2: Thông tin quyết định */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8b1a1a", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
              <span>■ Thông tin quyết định</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={lblSt}>Ngày quyết định</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={ngayQuyetDinh}
                    onChange={e => setNgayQuyetDinh(e.target.value)}
                    placeholder="Chọn ngày quyết định"
                    style={{ ...inSt, paddingRight: 28 }}
                  />
                  <Calendar size={14} color="#888888" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                </div>
              </div>

              <div>
                <label style={lblSt}>Số quyết định</label>
                <input
                  type="text"
                  value={soQuyetDinh}
                  onChange={e => setSoQuyetDinh(e.target.value)}
                  placeholder="Nhập số quyết định"
                  style={inSt}
                />
              </div>

              <div>
                <label style={lblSt}>
                  <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Người ký ban hành
                </label>
                <select
                  value={nguoiKy}
                  onChange={e => setNguoiKy(e.target.value)}
                  style={{ ...inSt, cursor: "pointer" }}
                >
                  <option value="Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội">Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội</option>
                  <option value="Phan Văn Nam - Phó Chánh án TAND thành phố Hà Nội">Phan Văn Nam - Phó Chánh án TAND thành phố Hà Nội</option>
                  <option value="Lê Hoàng Nam - Trưởng phòng">Lê Hoàng Nam - Trưởng phòng</option>
                  <option value="Lý Thái Phúc - Công chức nghiên cứu">Lý Thái Phúc - Công chức nghiên cứu</option>
                </select>
              </div>

              <div>
                <label style={lblSt}>Ngày phát hành</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={ngayPhatHanh}
                    onChange={e => setNgayPhatHanh(e.target.value)}
                    placeholder="Chọn ngày quyết định"
                    style={{ ...inSt, paddingRight: 28 }}
                  />
                  <Calendar size={14} color="#888888" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            <div>
              <label style={lblSt}>
                <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>
                {ketQuaGQ === "khang-nghi"
                  ? "Nội dung quyết định kháng nghị"
                  : "Nội dung trả lời"}
              </label>
              <textarea
                value={noiDung}
                onChange={e => setNoiDung(e.target.value)}
                placeholder="Nhập nội dung trả lời"
                rows={3}
                style={{ ...inSt, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
          </div>

          {/* Section 3: Nơi nhận */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ ...lblSt, marginBottom: 0, fontWeight: 600 }}>
                <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Nơi nhận
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNoiNhan(true)}
                style={{
                  background: "#8b1a1a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                  cursor: "pointer",
                }}
              >
                Thêm nơi nhận
              </button>
            </div>

            <div style={{ border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "8px 10px", width: 50, textAlign: "center", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>
                      STT
                    </th>
                    <th style={{ padding: "8px 12px", width: 160, textAlign: "left", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>
                      NƠI NHẬN
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>
                      NƠI NHẬN CHI TIẾT
                    </th>
                    <th style={{ padding: "8px 12px", width: 140, textAlign: "left", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>
                      GHI CHÚ
                    </th>
                    <th style={{ padding: "8px 10px", width: 130, textAlign: "center", fontWeight: 600, color: "#333333" }}>
                      THAO TÁC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {noiNhanList.map((item, idx) =>
                    editingId === item.id ? (
                      <tr key={item.id} style={{ background: "#f0f7ff", borderBottom: "1px solid #e0e0e0" }}>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                          <select
                            value={editNoiNhan}
                            onChange={e => setEditNoiNhan(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                          >
                            <option value="Khác">Khác</option>
                            <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                            <option value="Viện kiểm sát nhân dân">Viện kiểm sát nhân dân</option>
                            <option value="Công an">Công an</option>
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                          <input
                            value={editChiTiet}
                            onChange={e => setEditChiTiet(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                            placeholder="Nhập nơi nhận chi tiết"
                          />
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                          <input
                            value={editGhiChu}
                            onChange={e => setEditGhiChu(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                            placeholder="Nhập ghi chú"
                          />
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(item.id)}
                              style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                            >
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              style={{ background: "#fff", color: "#333333", border: "1px solid #cccccc", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={item.id}
                        style={{
                          background: "#fff",
                          borderBottom: idx < noiNhanList.length - 1 ? "1px solid #e0e0e0" : "none",
                        }}
                      >
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#333333", borderRight: "1px solid #e0e0e0" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#222222", borderRight: "1px solid #e0e0e0" }}>
                          {item.noiNhan}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#222222", borderRight: "1px solid #e0e0e0" }}>
                          {item.noiNhanChiTiet}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#666666", borderRight: "1px solid #e0e0e0" }}>
                          {item.ghiChu}
                        </td>
                        <td style={{ padding: "9px 10px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#1a73e8", fontSize: 12, fontWeight: 500, padding: 0 }}
                            >
                              — Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNoiNhan(item.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 12, fontWeight: 500, padding: 0 }}
                            >
                              🗑 Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {/* Inline adding row */}
                  {isAddingNoiNhan && (
                    <tr style={{ background: "#fffdf5", borderTop: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                        {noiNhanList.length + 1}
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                        <select
                          value={newNoiNhan}
                          onChange={e => setNewNoiNhan(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                        >
                          <option value="Khác">Khác</option>
                          <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                          <option value="Viện kiểm sát nhân dân">Viện kiểm sát nhân dân</option>
                          <option value="Công an">Công an</option>
                        </select>
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                        <input
                          value={newChiTiet}
                          onChange={e => setNewChiTiet(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                          placeholder="Nhập nơi nhận chi tiết"
                        />
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e0e0e0" }}>
                        <input
                          value={newGhiChu}
                          onChange={e => setNewGhiChu(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                          placeholder="Nhập ghi chú"
                        />
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            type="button"
                            onClick={handleSaveNewNoiNhan}
                            style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingNoiNhan(false)}
                            style={{ background: "#fff", color: "#333333", border: "1px solid #cccccc", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}
                          >
                            Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderTop: "1px solid #e0e0e0",
            background: "#fff",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 22px",
              background: "#fff",
              color: "#333333",
              border: "1px solid #cccccc",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "7px 26px",
              background: "#8b1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={handleToggleLaySo}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#333333",
              border: "1px solid #cccccc",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            {daLaySo ? "Hủy lấy số" : "Lấy số"}
          </button>
          <button
            type="button"
            onClick={() => setShowTrinhKy(true)}
            style={{
              padding: "7px 26px",
              background: "#8b1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            Trình ký
          </button>
          <button
            type="button"
            onClick={() => setShowBieuMau(true)}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#333333",
              border: "1px solid #cccccc",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            Xem biểu mẫu
          </button>
        </div>
      </div>

      {showAddNguoiModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 420, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", fontFamily: F }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#8b1a1a", marginBottom: 14 }}>Thêm người đứng đơn mới</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={lblSt}>Đơn liên quan</label>
                <select
                  value={newNguoiDonId}
                  onChange={e => setNewNguoiDonId(e.target.value)}
                  style={inSt}
                >
                  {donDataList.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lblSt}><span style={{ color: "#c0392b" }}>*</span> Tên người đứng đơn</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên người đứng đơn..."
                  value={newNguoiTen}
                  onChange={e => setNewNguoiTen(e.target.value)}
                  style={inSt}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setShowAddNguoiModal(false)}
                style={{ padding: "6px 16px", background: "#fff", border: "1px solid #cccccc", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddNewNguoiDungDon}
                style={{ padding: "6px 16px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
              >
                Thêm người đứng đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal Tạo Dự thảo Công văn trao đổi (Theo đúng thiết kế mẫu ảnh) ─────────────────
export function TaoDuThaoCongVanModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (data: any) => void;
}) {
  const [cachGiaiQuyet, setCachGiaiQuyet] = useState<"qua-cong-van">("qua-cong-van");
  const [ngayTaoCV, setNgayTaoCV] = useState("");
  const [soCV, setSoCV] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [noiNhan, setNoiNhan] = useState("");
  const [donViNhan, setDonViNhan] = useState("");
  const [ngayTraoDoi, setNgayTraoDoi] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  const [showTrinhKy, setShowTrinhKy] = useState(false);

  const [noiNhanList, setNoiNhanList] = useState([
    {
      id: 1,
      loaiNoiNhan: "Viện kiểm sát",
      tenDonViNhan: "Viện kiểm sát nhân dân thành phố Hà Nội",
      ghiChu: "Kèm hồ sơ vụ án",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLoai, setEditLoai] = useState("");
  const [editDonVi, setEditDonVi] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const [newLoai, setNewLoai] = useState("Viện kiểm sát");
  const [newDonVi, setNewDonVi] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");

  const handleAddNoiNhan = () => {
    if (!newDonVi.trim()) {
      alert("Vui lòng nhập tên đơn vị nhận!");
      return;
    }
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        loaiNoiNhan: newLoai,
        tenDonViNhan: newDonVi.trim(),
        ghiChu: newGhiChu.trim() || "–",
      },
    ]);
    setIsAdding(false);
    setNewDonVi("");
    setNewGhiChu("");
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditLoai(item.loaiNoiNhan);
    setEditDonVi(item.tenDonViNhan);
    setEditGhiChu(item.ghiChu);
  };

  const handleSaveEdit = (id: number) => {
    if (!editDonVi.trim()) {
      alert("Vui lòng nhập tên đơn vị nhận!");
      return;
    }
    setNoiNhanList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, loaiNoiNhan: editLoai, tenDonViNhan: editDonVi.trim(), ghiChu: editGhiChu.trim() || "–" }
          : item
      )
    );
    setEditingId(null);
  };

  const handleDeleteNoiNhan = (id: number) => {
    setNoiNhanList(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        cachGiaiQuyet,
        ngayTaoCV,
        soCV,
        nguoiKy,
        noiNhan,
        donViNhan,
        ngayTraoDoi,
        noiDung,
        ghiChu,
        noiNhanList,
      });
    }
    alert("Đã lưu dự thảo công văn trao đổi thành công!");
    onClose();
  };

  const inSt: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 12,
    border: "1px solid #cccccc",
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
    color: "#222222",
  };

  const lblSt: React.CSSProperties = {
    fontSize: 12,
    color: "#333333",
    fontFamily: F,
    display: "block",
    marginBottom: 5,
    fontWeight: 600,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "min(840px, 95vw)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          fontFamily: F,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #e0e0e0",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "#222222", fontFamily: F }}>
            Tạo dự thảo
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666666",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Cách giải quyết */}
          <div>
            <label style={lblSt}>Cách giải quyết</label>
            <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 4 }}>
              {/* <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#222222" }}>
                <input
                  type="radio"
                  name="cachGiaiQuyet"
                  checked={cachGiaiQuyet === "truc-tiep"}
                  onChange={() => setCachGiaiQuyet("truc-tiep")}
                  style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                />
                Trao đổi trực tiếp
              </label> */}
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#222222" }}>
                <input
                  type="radio"
                  name="cachGiaiQuyet"
                  checked={cachGiaiQuyet === "qua-cong-van"}
                  onChange={() => setCachGiaiQuyet("qua-cong-van")}
                  style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                />
                Qua công văn
              </label>
            </div>
          </div>

          {/* Khi chọn Qua công văn */}
          {cachGiaiQuyet === "qua-cong-van" && (
            <>
              {/* Row 1: Ngày tạo CV, Số CV, Người ký */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <label style={lblSt}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Ngày tạo CV
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={ngayTaoCV}
                      onChange={e => setNgayTaoCV(e.target.value)}
                      style={{ ...inSt, paddingRight: 32 }}
                    />
                    <Calendar size={15} color="#666666" style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={lblSt}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Số CV
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập số công văn"
                    value={soCV}
                    onChange={e => setSoCV(e.target.value)}
                    style={inSt}
                  />
                </div>

                <div>
                  <label style={lblSt}>Người ký</label>
                  <input
                    type="text"
                    placeholder="Nhập tên người ký"
                    value={nguoiKy}
                    onChange={e => setNguoiKy(e.target.value)}
                    style={inSt}
                  />
                </div>
              </div>

              {/* Row 2: Nơi nhận, Đơn vị nhận */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={lblSt}>Nơi nhận</label>
                  <select
                    value={noiNhan}
                    onChange={e => setNoiNhan(e.target.value)}
                    style={{ ...inSt, cursor: "pointer" }}
                  >
                    <option value="">– Vui lòng chọn –</option>
                    <option value="Viện kiểm sát">Viện kiểm sát</option>
                    <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                    <option value="Cơ quan điều tra">Cơ quan điều tra</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label style={lblSt}>Đơn vị nhận</label>
                  <input
                    type="text"
                    placeholder="Chọn nơi nhận trước"
                    value={donViNhan}
                    onChange={e => setDonViNhan(e.target.value)}
                    style={inSt}
                  />
                </div>
              </div>
            </>
          )}

          {/* Ngày trao đổi */}
          <div>
            <label style={lblSt}>
              <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Ngày trao đổi
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={ngayTraoDoi}
                onChange={e => setNgayTraoDoi(e.target.value)}
                style={{ ...inSt, paddingRight: 32 }}
              />
              <Calendar size={15} color="#666666" style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Textarea: Nội dung */}
          <div>
            <label style={lblSt}>Nội dung</label>
            <textarea
              placeholder="Nhập nội dung ý kiến"
              value={noiDung}
              onChange={e => setNoiDung(e.target.value.slice(0, 1000))}
              style={{ ...inSt, minHeight: 90, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: "#666666", marginTop: 3 }}>
              {noiDung.length} / 1000
            </div>
          </div>

          {/* Textarea: Ghi chú */}
          <div>
            <label style={lblSt}>Ghi chú</label>
            <textarea
              placeholder="Nhập ghi chú"
              value={ghiChu}
              onChange={e => setGhiChu(e.target.value.slice(0, 1000))}
              style={{ ...inSt, minHeight: 90, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: "#666666", marginTop: 3 }}>
              {ghiChu.length} / 1000
            </div>
          </div>

          {/* Table Section: Nơi nhận (chỉ hiển thị khi qua công văn) */}
          {cachGiaiQuyet === "qua-cong-van" && (
            <div>
              <label style={lblSt}>Nơi nhận</label>
              <div style={{ border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                  <thead>
                    <tr style={{ background: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
                      <th style={{ padding: "8px", width: 45, textAlign: "center", fontWeight: 700, color: "#333333" }}>STT</th>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 700, color: "#333333", width: 160 }}>LOẠI NƠI NHẬN</th>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 700, color: "#333333" }}>TÊN ĐƠN VỊ NHẬN</th>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 700, color: "#333333", width: 180 }}>GHI CHÚ</th>
                      <th style={{ padding: "8px", textAlign: "center", fontWeight: 700, color: "#333333", width: 110 }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((item, idx) => {
                      const isEditing = editingId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #f5f5f5", background: "#fff" }}>
                          <td style={{ padding: "8px", textAlign: "center", color: "#666666" }}>{idx + 1}</td>
                          <td style={{ padding: "8px", color: "#222222" }}>
                            {isEditing ? (
                              <select value={editLoai} onChange={e => setEditLoai(e.target.value)} style={{ ...inSt, padding: "3px 6px" }}>
                                <option value="Viện kiểm sát">Viện kiểm sát</option>
                                <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                                <option value="Cơ quan điều tra">Cơ quan điều tra</option>
                                <option value="Khác">Khác</option>
                              </select>
                            ) : item.loaiNoiNhan}
                          </td>
                          <td style={{ padding: "8px", color: "#222222" }}>
                            {isEditing ? (
                              <input value={editDonVi} onChange={e => setEditDonVi(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                            ) : item.tenDonViNhan}
                          </td>
                          <td style={{ padding: "8px", color: "#666666" }}>
                            {isEditing ? (
                              <input value={editGhiChu} onChange={e => setEditGhiChu(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                            ) : item.ghiChu}
                          </td>
                          <td style={{ padding: "8px", textAlign: "center" }}>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button onClick={() => handleSaveEdit(item.id)} style={{ color: "#27ae60", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Lưu</button>
                                <button onClick={() => setEditingId(null)} style={{ color: "#666666", background: "none", border: "none", cursor: "pointer" }}>Hủy</button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: 8, justifyContent: "center", fontSize: 12 }}>
                                <button onClick={() => handleStartEdit(item)} style={{ color: "#1a73e8", background: "none", border: "none", cursor: "pointer" }}>✎ Sửa</button>
                                <button onClick={() => handleDeleteNoiNhan(item.id)} style={{ color: "#c0392b", background: "none", border: "none", cursor: "pointer" }}>Xóa</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {isAdding && (
                      <tr style={{ background: "#fff8e1", borderBottom: "1px solid #fef08a" }}>
                        <td style={{ padding: "8px", textAlign: "center", color: "#666666" }}>+</td>
                        <td style={{ padding: "6px" }}>
                          <select value={newLoai} onChange={e => setNewLoai(e.target.value)} style={{ ...inSt, padding: "3px 6px" }}>
                            <option value="Viện kiểm sát">Viện kiểm sát</option>
                            <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                            <option value="Cơ quan điều tra">Cơ quan điều tra</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </td>
                        <td style={{ padding: "6px" }}>
                          <input placeholder="Tên đơn vị nhận" value={newDonVi} onChange={e => setNewDonVi(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                        </td>
                        <td style={{ padding: "6px" }}>
                          <input placeholder="Ghi chú" value={newGhiChu} onChange={e => setNewGhiChu(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                        </td>
                        <td style={{ padding: "6px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button onClick={handleAddNoiNhan} style={{ color: "#27ae60", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Thêm</button>
                            <button onClick={() => setIsAdding(false)} style={{ color: "#666666", background: "none", border: "none", cursor: "pointer" }}>Hủy</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {!isAdding && (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  style={{
                    border: "1px dashed #cccccc",
                    background: "#fff",
                    color: "#555555",
                    padding: "6px 14px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontFamily: F,
                    cursor: "pointer",
                  }}
                >
                  + Thêm nơi nhận
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            borderTop: "1px solid #e0e0e0",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "7px 18px",
                background: "#fff",
                border: "1px solid #cccccc",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: F,
                color: "#333333",
              }}
            >
              Đóng
            </button>
            <button
              onClick={() => {
                setNgayTaoCV("");
                setSoCV("");
                setNguoiKy("");
                setNoiNhan("");
                setDonViNhan("");
                setNgayTraoDoi("");
                setNoiDung("");
                setGhiChu("");
              }}
              style={{
                padding: "7px 18px",
                background: "#fff",
                border: "1px solid #cccccc",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: F,
                color: "#333333",
              }}
            >
              Làm mới
            </button>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {cachGiaiQuyet === "qua-cong-van" && (
              <>
                <button
                  onClick={() => alert("Đang xem biểu mẫu...")}
                  style={{
                    padding: "7px 18px",
                    background: "#fff",
                    border: "1px solid #cccccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: F,
                    color: "#333333",
                  }}
                >
                  Xem biểu mẫu
                </button>
                <button
                  onClick={() => setShowTrinhKy(true)}
                  style={{
                    padding: "7px 18px",
                    background: "#8b1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: F,
                  }}
                >
                  Trình ký
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              style={{
                padding: "7px 18px",
                background: "#8b1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
