import React, { useState } from "react";
import { Search, Eye, X, Printer, FileText, Pencil, Send, Paperclip, Trash2, RotateCw } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { TaoToTrinhModal, ThuHoiConfirmDialog } from "./AppHelpers";
import { TrinhKyModal, HoSoToTrinhModal } from "./TrinhKyModal";
import { TaoDuThaoModal, TaoDuThaoCongVanModal } from "./TaoDuThaoModal";

// ── Types & Data ─────────────────────────────────────────────────────────────

export type CongVanTab = "tat-ca" | "den" | "di";

type CVRow = {
  stt: string;
  soCV: string;
  ngayCV: string;
  loai: "den" | "di";
  soBA: string;
  ngayBA: string;
  toaRaBA: string;
  soThuLy: string;
  ngayThuLy: string;
  donViGui: string;
  donViNhan: string;
  phanHoi: string;
  phanCong: string;
  coKQGG: boolean;
};

export const CV_ROWS: CVRow[] = [
  {
    stt: "01",
    soCV: "Số CV: 07",
    ngayCV: "24/06/2026",
    loai: "den",
    soBA: "74/2023/DS-PT",
    ngayBA: "10/04/2023",
    toaRaBA: "TAND tỉnh Kiên Giang",
    soThuLy: "123",
    ngayThuLy: "27/07/2026",
    donViGui: "Tòa án nhân dân tỉnh Tuyên Quang",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "Số CV: CV-TR-01\nNgày: 08/07/2026",
    phanCong: "TTV: Nguyễn Văn An",
    coKQGG: true,
  },
  {
    stt: "02",
    soCV: "Số CV: 12/CV-VP",
    ngayCV: "16/07/2026",
    loai: "di",
    soBA: "124/2026/HS-ST",
    ngayBA: "20/07/2026",
    toaRaBA: "TAND khu vực 5 - Hà Nội",
    soThuLy: "456",
    ngayThuLy: "20/07/2026",
    donViGui: "Tòa án nhân dân thành phố Hà Nội",
    donViNhan: "VKSND Tối cao",
    phanHoi: "–",
    phanCong: "TTV: Lê Thị Bình",
    coKQGG: false,
  },
  {
    stt: "03",
    soCV: "Số CV: 88/TB-TAND",
    ngayCV: "02/08/2026",
    loai: "den",
    soBA: "88/2026/HNGĐ-PT",
    ngayBA: "12/03/2026",
    toaRaBA: "TAND TP. Hà Nội",
    soThuLy: "789",
    ngayThuLy: "05/08/2026",
    donViGui: "TAND TP. Hà Nội",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "Số CV: CV-TR-05\nNgày: 10/08/2026",
    phanCong: "TTV: Trần Minh Đức",
    coKQGG: true,
  },
  {
    stt: "04",
    soCV: "Số CV: 102/CV-BTP",
    ngayCV: "10/08/2026",
    loai: "di",
    soBA: "18/2026/KDTM-ST",
    ngayBA: "25/04/2026",
    toaRaBA: "TAND khu vực 4 - Hà Nội",
    soThuLy: "101",
    ngayThuLy: "12/08/2026",
    donViGui: "Tòa án nhân dân thành phố Hà Nội",
    donViNhan: "Bộ Tư Pháp",
    phanHoi: "Số CV: 215/BTP-V1\nNgày: 18/08/2026",
    phanCong: "TTV: Nguyễn Văn An",
    coKQGG: true,
  },
  {
    stt: "05",
    soCV: "Số CV: 45/CV-HC",
    ngayCV: "15/08/2026",
    loai: "den",
    soBA: "45/2026/HC-PT",
    ngayBA: "10/05/2026",
    toaRaBA: "TAND khu vực 2 - Hà Nội",
    soThuLy: "105",
    ngayThuLy: "16/08/2026",
    donViGui: "TAND khu vực 2 - Hà Nội",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "–",
    phanCong: "TTV: Hoàng Quỳnh Trang",
    coKQGG: true,
  },
  {
    stt: "06",
    soCV: "Số CV: 156/CV-VKS",
    ngayCV: "18/08/2026",
    loai: "den",
    soBA: "12/2026/HS-PT",
    ngayBA: "20/07/2026",
    toaRaBA: "TAND thành phố Hà Nội",
    soThuLy: "204",
    ngayThuLy: "20/08/2026",
    donViGui: "VKSND Tối cao",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "Số CV: CV-TR-08\nNgày: 25/08/2026",
    phanCong: "TTV: Vũ Biêu Thư",
    coKQGG: true,
  },
  {
    stt: "07",
    soCV: "Số CV: 210/CV-TAHN",
    ngayCV: "22/08/2026",
    loai: "di",
    soBA: "56/2026/HS-ST",
    ngayBA: "14/06/2026",
    toaRaBA: "TAND khu vực 6 - Hà Nội",
    soThuLy: "212",
    ngayThuLy: "23/08/2026",
    donViGui: "Tòa án nhân dân thành phố Hà Nội",
    donViNhan: "Bộ Công An",
    phanHoi: "–",
    phanCong: "TTV: Lý Thái Phúc",
    coKQGG: false,
  },
  {
    stt: "08",
    soCV: "Số CV: 89/CV-TAND",
    ngayCV: "25/08/2026",
    loai: "den",
    soBA: "34/2026/LĐ-PT",
    ngayBA: "18/05/2026",
    toaRaBA: "TAND khu vực 6 - Hà Nội",
    soThuLy: "220",
    ngayThuLy: "26/08/2026",
    donViGui: "TAND khu vực 6 - Hà Nội",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "–",
    phanCong: "TTV: Nguyễn Văn An",
    coKQGG: true,
  },
  {
    stt: "09",
    soCV: "Số CV: 312/CV-V1",
    ngayCV: "28/08/2026",
    loai: "di",
    soBA: "78/2026/DS-ST",
    ngayBA: "05/04/2026",
    toaRaBA: "TAND thành phố Hà Nội",
    soThuLy: "235",
    ngayThuLy: "29/08/2026",
    donViGui: "Tòa án nhân dân thành phố Hà Nội",
    donViNhan: "TAND thành phố Hà Nội",
    phanHoi: "Số CV: 410/ĐN\nNgày: 02/09/2026",
    phanCong: "TTV: Trần Minh Đức",
    coKQGG: true,
  },
  {
    stt: "10",
    soCV: "Số CV: 99/CV-VKS-DN",
    ngayCV: "01/09/2026",
    loai: "den",
    soBA: "99/2026/HS-PT",
    ngayBA: "12/07/2026",
    toaRaBA: "TAND khu vực 6 - Hà Nội",
    soThuLy: "248",
    ngayThuLy: "03/09/2026",
    donViGui: "VKSND Thành phố Hà Nội",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "–",
    phanCong: "TTV: Lê Thị Bình",
    coKQGG: false,
  },
  {
    stt: "11",
    soCV: "Số CV: 405/CV-TAHN",
    ngayCV: "05/09/2026",
    loai: "di",
    soBA: "112/2026/HC-ST",
    ngayBA: "22/06/2026",
    toaRaBA: "TAND khu vực 2 - Hà Nội",
    soThuLy: "260",
    ngayThuLy: "06/09/2026",
    donViGui: "Tòa án nhân dân thành phố Hà Nội",
    donViNhan: "Ủy ban Nhân dân TP.HCM",
    phanHoi: "–",
    phanCong: "TTV: Hoàng Quỳnh Trang",
    coKQGG: true,
  },
  {
    stt: "12",
    soCV: "Số CV: 67/CV-TAND-BD",
    ngayCV: "08/09/2026",
    loai: "den",
    soBA: "23/2026/KDTM-PT",
    ngayBA: "30/05/2026",
    toaRaBA: "TAND khu vực 3 - Hà Nội",
    soThuLy: "275",
    ngayThuLy: "09/09/2026",
    donViGui: "TAND khu vực 3 - Hà Nội",
    donViNhan: "Tòa án nhân dân thành phố Hà Nội",
    phanHoi: "Số CV: CV-TR-12\nNgày: 12/09/2026",
    phanCong: "TTV: Vũ Biêu Thư",
    coKQGG: true,
  },
];

// ── XemBieuMauCongVanModal ───────────────────────────────────────────────────

export function XemBieuMauCongVanModal({ onClose }: { onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [selectedDoc, setSelectedDoc] = useState<"to-trinh" | "cong-van">("to-trinh");

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px", background: "#fff", border: `1px solid ${BORDER}`,
    borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT,
    display: "inline-flex", alignItems: "center", gap: 4
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px", border: `1px solid ${BORDER}`, borderRadius: 4,
    fontSize: 12, fontFamily: F, background: "#fff", cursor: "pointer"
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 18, background: BORDER, margin: "0 2px"
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f5f5f5", zIndex: 2000, display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Header Ribbon bar Word Style */}
      <div style={{ background: "#2b579a", color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <span style={{ fontWeight: 700, fontSize: 16, fontFamily: F }}>
            Trình chỉnh sửa bản Word - {selectedDoc === "to-trinh" ? "Tờ trình công văn trao đổi (.docx)" : "Dự thảo Công văn trao đổi (.docx)"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => alert("Đã lưu nội dung bản Word thành công!")} style={{ padding: "7px 18px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Word Ribbon Formatting Toolbar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", fontSize: 12, fontFamily: F }}>
        {/* Document Selector Dropdown */}
        <span style={{ fontWeight: 600, color: TEXT }}>Biểu mẫu:</span>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value as "to-trinh" | "cong-van")}
          style={{ ...selectSt, fontWeight: 700, borderColor: RED, color: RED, background: "#fdf3f2" }}
        >
          <option value="to-trinh">1. Tờ trình ban hành Công văn trao đổi nghiệp vụ</option>
          <option value="cong-van">2. Dự thảo Công văn trao đổi nghiệp vụ</option>
        </select>
        <div style={sepSt} />

        {/* Undo / Redo */}
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác (Ctrl+Z)">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại (Ctrl+Y)">↪ Làm lại</button>
        <div style={sepSt} />

        {/* Font Family & Size */}
        <select onChange={(e) => { setFontFamily(e.target.value); execCmd("fontName", e.target.value); }} value={fontFamily} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select onChange={(e) => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13.5pt">13.5 pt</option>
          <option value="14pt">14 pt</option>
          <option value="16pt">16 pt</option>
        </select>
        <div style={sepSt} />

        {/* Text formatting */}
        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm (Ctrl+B)"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng (Ctrl+I)"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân (Ctrl+U)"><u>U</u></button>
        <button onClick={() => execCmd("strikeThrough")} style={tbBtnSt} title="Gạch ngang"><s>S</s></button>
        <div style={sepSt} />

        {/* Text alignments */}
        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều 2 bên">☰</button>
        <div style={sepSt} />

        {/* Lists */}
        <button onClick={() => execCmd("insertUnorderedList")} style={tbBtnSt} title="Danh sách chấm">• Danh sách</button>
        <button onClick={() => execCmd("insertOrderedList")} style={tbBtnSt} title="Danh sách số">1. Danh sách</button>
        <div style={sepSt} />

        {/* In & Tải về */}
        <button onClick={() => window.print()} style={tbBtnSt}>
          <Printer size={13} /> In
        </button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#e8f5e9", color: "#1b5e20", borderColor: "#a5d6a7", fontWeight: 600 }}>
          📥 Tải file Word
        </button>

        {/* Zoom controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      {/* Word Document Canvas Container (Scrollable) */}
      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cccccc" }}>
        {/* Editable A4 Page Layout */}
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794,
            minHeight: 1123,
            background: "#fff",
            boxShadow: "0 6px 30px rgba(0,0,0,0.2)",
            padding: "54px 64px",
            boxSizing: "border-box",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            fontFamily: fontFamily,
            color: "#000",
            lineHeight: 1.5,
            fontSize: fontSize,
            outline: "none",
            cursor: "text"
          }}
        >
          {selectedDoc === "to-trinh" ? (
            /* Biểu mẫu Tờ trình công văn trao đổi */
            <>
              {/* Header Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontFamily: fontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "48%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN [TÊN CƠ QUAN]</div>
                      <div style={{ fontSize: "12pt", marginTop: 4 }}>Số: ...... /TTr-TA</div>
                    </td>
                    <td style={{ width: "52%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>Độc lập - Tự do - Hạnh phúc</div>
                      <div style={{ margin: "4px auto 8px", width: 140, borderBottom: "1px solid #000" }} />
                      <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 6 }}>[Địa danh], ngày ... tháng ... năm 2026</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Title */}
              <div style={{ textAlign: "center", fontSize: "14pt", fontWeight: "bold", margin: "24px 0 6px" }}>
                TỜ TRÌNH
              </div>
              <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", marginBottom: 24 }}>
                Về việc ban hành Công văn trao đổi nghiệp vụ với [Tên cơ quan]
              </div>

              {/* Kính gửi */}
              <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", marginBottom: 28 }}>
                Kính gửi: Chánh án Tòa án nhân dân [Tên cơ quan]
              </div>

              {/* Nội dung */}
              <div style={{ fontWeight: "bold", fontSize: "13.5pt", marginBottom: 6 }}>
                1. LÝ DO TRÌNH:
              </div>
              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 18 }}>
                Nêu rõ vướng mắc trong vụ án cụ thể hoặc quy định pháp luật chưa rõ ràng cần phối hợp giải quyết.
              </div>

              <div style={{ fontWeight: "bold", fontSize: "13.5pt", marginBottom: 6 }}>
                2. NỘI DUNG ĐỀ XUẤT CẦN TRAO ĐỔI:
              </div>
              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 18 }}>
                Tóm tắt các điều khoản pháp luật áp dụng còn có ý kiến khác nhau và quan điểm giải quyết của Tòa án.
              </div>

              <div style={{ fontWeight: "bold", fontSize: "13.5pt", marginBottom: 6 }}>
                3. KIẾN NGHỊ:
              </div>
              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 20 }}>
                Kính trình Chánh án xem xét, phê duyệt nội dung dự thảo Công văn trao đổi nghiệp vụ gửi [Tên cơ quan đối tác] đính kèm theo tờ trình này.
              </div>

              <div style={{ fontStyle: "italic", fontSize: "13pt", marginBottom: 44 }}>
                (Đính kèm: Dự thảo Công văn trao đổi nghiệp vụ)
              </div>

              {/* Signature */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontFamily: fontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "50%" }}></td>
                    <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                      <div style={{ fontWeight: "bold" }}>NGƯỜI LẬP TỜ TRÌNH</div>
                      <div style={{ fontStyle: "italic", fontSize: "11pt", marginTop: 2 }}>(Ký, ghi rõ họ tên)</div>
                      <div style={{ height: 90 }} />
                      <div style={{ fontWeight: "bold" }}>[Họ và tên]</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            /* Biểu mẫu Công văn trao đổi */
            <>
              {/* Header Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontFamily: fontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                      <div style={{ fontSize: "12pt", marginTop: 4 }}>Số: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/TAHN-THS</div>
                      <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>V/v trao đổi công tác</div>
                    </td>
                    <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div style={{ fontWeight: "bold", fontSize: "12pt" }}>Độc lập - Tự do - Hạnh phúc</div>
                      <div style={{ margin: "4px auto 8px", width: 140, borderBottom: "1px solid #000" }} />
                      <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 6 }}>Hà Nội, ngày &nbsp;&nbsp;&nbsp;&nbsp; tháng &nbsp;&nbsp;&nbsp;&nbsp; năm &nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Kính gửi */}
              <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", margin: "30px 0 20px" }}>
                Kính gửi: […]
              </div>

              {/* Nội dung công văn */}
              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 14 }}>
                Tòa Hình sự Tòa án nhân dân thành phố Hà Nội nhận được Công văn số […] ngày […/…/…] của [cơ quan xin ý kiến] về việc [trích yếu nội dung công văn xin ý kiến].
              </div>

              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 14 }}>
                Qua nghiên cứu Công văn nêu trên và các tài liệu kèm theo, Tòa Hình sự Tòa án nhân dân thành phố Hà Nội có ý kiến như sau:
              </div>

              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 14, fontStyle: "italic" }}>
                [Trình bày ngắn gọn quan điểm đã được lãnh đạo phê duyệt]
              </div>

              <div style={{ textAlign: "justify", fontSize: "13.5pt", lineHeight: 1.6, textIndent: "1cm", marginBottom: 40 }}>
                Trên đây là ý kiến của Tòa Hình sự Tòa án nhân dân thành phố Hà Nội để [cơ quan xin ý kiến] tham khảo trong quá trình giải quyết vụ án theo đúng quy định của pháp luật./.
              </div>

              {/* Chữ ký & Nơi nhận */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontFamily: fontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "50%", textAlign: "left", verticalAlign: "top", fontSize: "11pt" }}>
                      <div style={{ fontWeight: "bold", fontStyle: "italic", marginBottom: 4 }}>Nơi nhận:</div>
                      <div>- Như kính gửi;</div>
                      <div>- Đ/c [họ và tên] - Phó Chánh án TAND thành phố Hà Nội (để b/c);</div>
                      <div>- Lưu: VP, Vụ GĐKT I (02b).</div>
                    </td>
                    <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                      <div style={{ fontWeight: "bold" }}>TL. CHÁNH ÁN</div>
                      <div style={{ fontWeight: "bold" }}>VỤ TRƯỞNG VỤ GIÁM ĐỐC, KIỂM TRA I</div>
                      <div style={{ height: 90 }} />
                      <div style={{ fontWeight: "bold" }}>[Họ và tên]</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Chế độ: Chỉnh sửa trực tiếp (Word Editor) &nbsp;•&nbsp; Trang 1 / 1 &nbsp;•&nbsp; Font: {fontFamily} {fontSize} &nbsp;•&nbsp; Đã bật tự động căn lề</span>
        <button onClick={onClose} style={{ padding: "6px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
          Đóng màn hình Word
        </button>
      </div>
    </div>
  );
}

// ── TaoCongVanModal ───────────────────────────────────────────────────────────

const NOI_NHAN_OPTIONS: Record<"toa-an" | "vien-kiem-sat", string[]> = {
  "toa-an": ["Tòa án nhân dân thành phố Hà Nội", "Tòa án nhân dân khu vực 1 - Hà Nội", "Tòa án nhân dân khu vực 3 - Hà Nội", "Tòa án nhân dân khu vực 2 - Hà Nội", "Tòa án nhân dân tỉnh Tuyên Quang", "Tòa án nhân dân TP. Hà Nội"],
  "vien-kiem-sat": ["Viện kiểm sát nhân dân thành phố Hà Nội", "Viện kiểm sát nhân dân khu vực 1 - Hà Nội", "Viện kiểm sát nhân dân khu vực 2 - Hà Nội", "Viện kiểm sát nhân dân tối cao"],
};

export function TaoCongVanModal({ onClose }: { onClose: () => void }) {
  const [loaiCV, setLoaiCV] = useState<"den" | "di">("den");
  const [noiGuiLoai, setNoiGuiLoai] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [noiNhanList, setNoiNhanList] = useState<Array<{ id: number; phanLoai: string; donVi: string; kinhGui: string; soBan: string }>>([
    { id: 1, phanLoai: "vien-kiem-sat", donVi: "Viện kiểm sát nhân dân thành phố Hà Nội", kinhGui: "Kính gửi Lãnh đạo VKSND thành phố Hà Nội", soBan: "02" },
    { id: 2, phanLoai: "toa-an", donVi: "Tòa án nhân dân khu vực 5 - Hà Nội", kinhGui: "Như kính gửi; Lưu VP", soBan: "01" },
  ]);
  const [traLoiSoCV, setTraLoiSoCV] = useState("");
  const [traLoiNgayCV, setTraLoiNgayCV] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [daCapSo, setDaCapSo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const inSt: React.CSSProperties = {
    width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5,
    padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box", background: "#fff"
  };
  const lblSt: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 5
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && <XemBieuMauCongVanModal onClose={() => setShowBieuMau(false)} />}
      <div style={{ background: "#fff", borderRadius: 8, width: 840, maxWidth: "95vw", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ background: RED, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: F }}>Tạo công văn</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}><X size={18} /></button>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Radio button Chọn loại công văn */}
          <div>
            <label style={lblSt}>Loại công văn</label>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                <input
                  type="radio"
                  name="loaiCV"
                  value="den"
                  checked={loaiCV === "den"}
                  onChange={() => setLoaiCV("den")}
                  style={{ accentColor: RED, width: 16, height: 16, cursor: "pointer" }}
                />
                Công văn đến
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                <input
                  type="radio"
                  name="loaiCV"
                  value="di"
                  checked={loaiCV === "di"}
                  onChange={() => setLoaiCV("di")}
                  style={{ accentColor: RED, width: 16, height: 16, cursor: "pointer" }}
                />
                Công văn đi
              </label>
            </div>
          </div>

          {/* Hàng 1: Ngày tạo CV, Số CV, Người ký */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={lblSt}>Ngày CV</label>
              <input type="date" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Số CV</label>
              <input placeholder="Nhập số CV" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Người ký</label>
              <input placeholder="Chọn người ký" style={inSt} />
            </div>
          </div>

          {/* Hiển thị Nơi gửi / Nơi tạo CV & Đơn vị gửi theo Loại công văn */}
          {loaiCV === "den" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lblSt}>Nơi gửi</label>
                <select value={noiGuiLoai} onChange={e => setNoiGuiLoai(e.target.value)} style={{ ...inSt, cursor: "pointer" }}>
                  <option value="">– Vui lòng chọn –</option>
                  <option value="toa-an">Tòa án</option>
                  <option value="vien-kiem-sat">Viện kiểm sát</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div>
                <label style={lblSt}>Tên đơn vị gửi</label>
                <input placeholder="Chọn nơi gửi trước" style={inSt} />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Hàng Nơi nhận & Tên đơn vị nhận */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lblSt}>Nơi nhận</label>
                  <select value={noiGuiLoai} onChange={e => setNoiGuiLoai(e.target.value)} style={{ ...inSt, cursor: "pointer" }}>
                    <option value="">– Vui lòng chọn –</option>
                    <option value="toa-an">Tòa án</option>
                    <option value="vien-kiem-sat">Viện kiểm sát</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Tên đơn vị nhận</label>
                  <input placeholder="Chọn nơi nhận trước" style={inSt} />
                </div>
              </div>
            </div>
          )}

          {/* Hàng 3: Nội dung công văn */}
          <div>
            <label style={lblSt}>Nội dung công văn</label>
            <textarea placeholder="Nhập nội dung công văn" style={{ ...inSt, minHeight: 80, resize: "vertical" }} />
          </div>

          {/* Hàng 4: Ghi chú */}
          <div>
            <label style={lblSt}>Ghi chú</label>
            <textarea placeholder="Nhập ghi chú" style={{ ...inSt, minHeight: 70, resize: "vertical" }} />
          </div>

          {/* Khung: Trả lời cho công văn */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, background: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12 }}>Trả lời cho công văn</div>
            <div style={{ display: "grid", gridTemplateColumns: loaiCV === "di" ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lblSt}>Số CV</label>
                <input value={traLoiSoCV} onChange={e => setTraLoiSoCV(e.target.value)} placeholder="Nhập số CV" style={inSt} />
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 16px",
                    background: "#6e1414", color: "#fff", border: "none", borderRadius: 4,
                    cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, marginTop: 10,
                  }}>
                  <Search size={13} /> Tìm kiếm
                </button>
              </div>
              <div>
                <label style={lblSt}>Ngày CV</label>
                <input type="date" value={traLoiNgayCV} onChange={e => setTraLoiNgayCV(e.target.value)} style={inSt} />
              </div>

              {loaiCV === "di" && (
                <>
                  <div>
                    <label style={lblSt}>Nơi tạo CV</label>
                    <select defaultValue="toa-an" style={{ ...inSt, cursor: "pointer" }}>
                      <option value="">– Vui lòng chọn –</option>
                      <option value="toa-an">Tòa án</option>
                      <option value="vien-kiem-sat">Viện kiểm sát</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label style={lblSt}>Đơn vị gửi công văn</label>
                    <input defaultValue="Tòa án nhân dân thành phố Hà Nội" style={inSt} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Phần Đính kèm tệp (Công văn đến) hoặc Cấu hình nơi nhận (Công văn đi) */}
          {loaiCV === "di" ? (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
                  Cấu hình nơi nhận công văn đi
                </div>
                <button
                  onClick={() => setNoiNhanList(prev => [...prev, { id: Date.now(), phanLoai: "toa-an", donVi: "", kinhGui: "", soBan: "01" }])}
                  style={{
                    padding: "6px 14px",
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: F,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  + Thêm nơi nhận
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: `1px solid ${BORDER}` }}>
                  <colgroup>
                    <col style={{ width: 40 }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "32%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: 45 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#fafafa" }}>
                      {["STT", "Phân loại nơi nhận", "Đơn vị nhận chi tiết", "Trích yếu / Kính gửi", "Số bản", ""].map((h, i) => (
                        <th key={i} style={{ ...TH_STYLE, fontSize: 11, padding: "8px 10px", borderRight: `1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((row, idx) => (
                      <tr key={row.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 12, color: MUTED, borderRight: `1px solid ${BORDER}` }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, padding: "6px 8px", borderRight: `1px solid ${BORDER}` }}>
                          <select
                            value={row.phanLoai}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === row.id ? { ...x, phanLoai: e.target.value } : x))}
                            style={{ ...inSt, padding: "4px 6px", fontSize: 11 }}
                          >
                            <option value="toa-an">Tòa án</option>
                            <option value="vien-kiem-sat">Viện kiểm sát</option>
                            <option value="cong-an">Cơ quan Công an</option>
                            <option value="bo-tu-phap">Bộ Tư Pháp</option>
                            <option value="khac">Khác</option>
                          </select>
                        </td>
                        <td style={{ ...TD_STYLE, padding: "6px 8px", borderRight: `1px solid ${BORDER}` }}>
                          <input
                            placeholder="Nhập tên đơn vị nhận"
                            value={row.donVi}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === row.id ? { ...x, donVi: e.target.value } : x))}
                            style={{ ...inSt, padding: "4px 6px", fontSize: 11 }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, padding: "6px 8px", borderRight: `1px solid ${BORDER}` }}>
                          <input
                            placeholder="Kính gửi / Nội dung lưu"
                            value={row.kinhGui}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === row.id ? { ...x, kinhGui: e.target.value } : x))}
                            style={{ ...inSt, padding: "4px 6px", fontSize: 11 }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, padding: "6px 8px", borderRight: `1px solid ${BORDER}` }}>
                          <input
                            type="number"
                            min={1}
                            value={row.soBan}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === row.id ? { ...x, soBan: e.target.value } : x))}
                            style={{ ...inSt, padding: "4px 6px", fontSize: 11, textAlign: "center" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center" }}>
                          <button
                            onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== row.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 2 }}
                            title="Xóa nơi nhận"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 8 }}>Đính kèm tệp</div>
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: `1px dashed ${BORDER}`, borderRadius: 6, padding: "24px 10px", cursor: "pointer", background: "#fff" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <div style={{ fontSize: 12, fontFamily: F, color: MUTED }}>
                  Kéo thả tệp vào đây hoặc <span style={{ color: "#6e1414", fontWeight: 600 }}>chọn tệp</span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) setAttachments(p => [...p, ...files]);
                    e.target.value = "";
                  }}
                  style={{ display: "none" }}
                />
              </label>
              {attachments.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {attachments.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 5, padding: "6px 10px" }}>
                      <FileText size={14} color={MUTED} />
                      <span style={{ flex: 1, fontSize: 12, color: TEXT, fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                      <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{(file.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setAttachments(p => p.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", display: "flex" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, borderTop: `1px solid ${BORDER}`, padding: "14px 20px", flexWrap: "wrap" }}>
          <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Đóng</button>

          {!isSaved ? (
            <button
              onClick={() => setIsSaved(true)}
              style={{
                padding: "7px 22px", background: "#6e1414", color: "#fff", border: "none",
                borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F
              }}
            >
              Lưu
            </button>
          ) : (
            <>
              <button
                onClick={() => setDaCapSo(!daCapSo)}
                style={{
                  padding: "7px 20px",
                  background: daCapSo ? "#c0392b" : "#fff",
                  color: daCapSo ? "#fff" : TEXT,
                  border: daCapSo ? "none" : `1px solid ${BORDER}`,
                  borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: daCapSo ? 700 : 400, fontFamily: F
                }}>
                {daCapSo ? "Hủy cấp số" : "Lấy số"}
              </button>

              <button
                onClick={() => setShowTrinhKy(true)}
                style={{ padding: "7px 20px", background: "#6e1414", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                Trình ký
              </button>

              <button
                onClick={() => setShowBieuMau(true)}
                style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
                Xem biểu mẫu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── XemChiTietCongVanModal ────────────────────────────────────────────────────

export function XemChiTietCongVanModal({ row, onClose }: { row: CVRow; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1350, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 780, maxWidth: "95vw", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 36px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ background: RED, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: F }}>
            Chi tiết công văn: {row.soCV}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}><X size={18} /></button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Block 1: Thông tin cơ bản công văn */}
          <div style={{ background: "#fafafa", borderRadius: 6, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              THÔNG TIN CÔNG VĂN
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12, fontFamily: F }}>
              <div><span style={{ color: MUTED }}>Loại công văn:</span> <strong>{row.loai === "den" ? "Công văn đến" : "Công văn đi"}</strong></div>
              <div><span style={{ color: MUTED }}>Số công văn:</span> <strong>{row.soCV}</strong></div>
              <div><span style={{ color: MUTED }}>Ngày công văn:</span> {row.ngayCV}</div>
              <div><span style={{ color: MUTED }}>Người ký / Người duyệt:</span> Nguyễn Văn Bình</div>
              <div><span style={{ color: MUTED }}>Đơn vị gửi:</span> <strong>{row.donViGui || row.donVi}</strong></div>
              <div><span style={{ color: MUTED }}>Đơn vị nhận:</span> <strong>{row.donViNhan || "Tòa án nhân dân thành phố Hà Nội"}</strong></div>
            </div>
          </div>

          {/* Block 2: Thông tin Bản án / Quyết định đề nghị */}
          <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              THÔNG TIN BẢN ÁN / QUYẾT ĐỊNH ĐỀ NGHỊ
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12, fontFamily: F }}>
              <div><span style={{ color: MUTED }}>Số BA/QĐ:</span> <strong>{row.soBA || "18/2026/KDTM-ST"}</strong></div>
              <div><span style={{ color: MUTED }}>Ngày BA:</span> {row.ngayBA || "25/04/2026"}</div>
              <div><span style={{ color: MUTED }}>Tòa ra BA:</span> {row.toaRaBA || "TAND khu vực 4 - Hà Nội"}</div>
            </div>
          </div>

          {/* Block 3: Nội dung công văn */}
          <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 8 }}>
              NỘI DUNG CÔNG VĂN
            </div>
            <div style={{ fontSize: 12, color: TEXT, fontFamily: F, lineHeight: 1.6, background: "#fafafa", padding: 12, borderRadius: 5, border: `1px solid ${BORDER}` }}>
              Công văn xin ý kiến giải quyết vướng mắc án kinh doanh thương mại liên quan đến hợp đồng tín dụng và xử lý tài sản thế chấp giữa Ngân hàng và Doanh nghiệp. Đề nghị Tòa Hình sự hướng dẫn áp dụng thống nhất pháp luật.
            </div>
          </div>

          {/* Block 4: Tệp đính kèm */}
          <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 10 }}>
              TỆP ĐÍNH KÈM
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", padding: "8px 12px", borderRadius: 5, border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: F }}>
                  <FileText size={16} color={RED} />
                  <span>{row.soCV || "Cong_van_13"}_dinh_kem.pdf</span>
                </div>
                <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>
                  Tải về
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: `1px solid ${BORDER}`, padding: "14px 20px", background: "#fafafa" }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
            Đóng
          </button>
          <button onClick={() => window.print()} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            In công văn
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChiTietCongVanView ────────────────────────────────────────────────────────

type CVDetailTab = "thong-tin" | "phan-cong" | "to-trinh" | "ket-qua";

// ── Tờ trình tab ──────────────────────────────────────────────────────────────

function TabToTrinhCV() {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [selectedVB, setSelectedVB] = useState<number[]>([]);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình công văn số 1", yKien: "–", ngayDuyet: "–", trangThai: "cho-duyet", subRows: [] as { label: string; ngayDuyet: string }[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán", vanBan: "Tờ trình công văn số 1", yKien: "Trả lời đơn: 009876", ngayDuyet: "07/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán", vanBan: "Tờ trình công văn số 1", yKien: "Trả lời đơn: 009876", ngayDuyet: "08/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án", vanBan: "Tờ trình công văn số 1", yKien: "Nội dung chưa đáp ứng yêu cầu, đề nghị chỉnh sửa", ngayDuyet: "06/07/2026", trangThai: "tu-choi", subRows: [] },
  ]);
  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const [vanBanList, setVanBanList] = useState([
    { stt: 1, vanBan: "Tờ trình công văn số 1", loai: "Tờ trình", ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số", daDinhKemHoSo: true, soHoSo: 3 },
    { stt: 2, vanBan: "Thông báo trả lời công văn số 1", loai: "Thông báo trả lời", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành", daDinhKemHoSo: true, soHoSo: 1 },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number }) => {
    const toTrinhCount = vanBanList.filter(x => x.loai === "Tờ trình").length + 1;
    const newStt = vanBanList.length + 1;
    const count = data?.countHoSo ?? 3;
    const isAttached = data?.daDinhKemHoSo ?? (count > 0);

    const newRow = {
      stt: newStt,
      vanBan: `Tờ trình công văn số ${toTrinhCount}`,
      loai: "Tờ trình",
      ngayTao: "07/08/2026",
      nguoiKy: "–",
      trangThai: "Chưa ký số",
      daDinhKemHoSo: isAttached,
      soHoSo: count
    };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
    setSelectedVB([1]);
    // Giữ nguyên popup mở sau khi lưu để hiển thị các nút Trình ký, Lấy số, Xem biểu mẫu

    if (!isAttached) {
      alert("Đã tạo tờ trình mới thành công! Lưu ý: Tờ trình hiện chưa đính kèm hồ sơ. Bạn phải Đính kèm hồ sơ và Ký số trước khi thực hiện Trình ký.");
    } else {
      alert(`Đã tạo tờ trình mới thành công! Tờ trình đã được đính kèm ${count} hồ sơ/tài liệu. Vui lòng Ký số trước khi Trình ký.`);
    }
  };

  const handleKySo = (stt: number) => {
    setVanBanList(prev => prev.map(r => r.stt === stt ? { ...r, trangThai: "Đã ký số", nguoiKy: "Nguyễn Văn A (Người lập)" } : r));
    alert("Đã ký số văn bản thành công!");
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tờ trình chưa ký số này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
      setSelectedVB(prev => prev.filter(id => id !== stt));
    }
  };

  const handleDinhKemHoSo = (stt: number) => {
    setVanBanList(prev => prev.map(r => r.stt === stt ? { ...r, daDinhKemHoSo: true, soHoSo: 3 } : r));
    alert("Đã đính kèm 3 file hồ sơ/tài liệu cho Tờ trình thành công!");
  };

  const handleTrinhKyClick = () => {
    const targetRows = selectedVB.length > 0
      ? vanBanList.filter(r => selectedVB.includes(r.stt))
      : vanBanList.filter(r => r.loai === "Tờ trình");

    // Check 1: Tờ trình phải đính kèm hồ sơ trước khi trình ký
    const hasMissingHoSo = targetRows.some(r => r.loai === "Tờ trình" && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình ký! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }

    // Check 2: Người tạo phải ký số trước khi trình ký
    const hasUnsigned = targetRows.some(r => r.trangThai === "Chưa ký số");
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Người tạo văn bản phải thực hiện KÝ SỐ trước khi ấn Trình ký!");
      return;
    }

    setShowTrinhKy(true);
  };

  const toggleVB = (id: number) => {
    setSelectedVB(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAllVB = () => {
    if (selectedVB.length === vanBanList.length) {
      setSelectedVB([]);
    } else {
      setSelectedVB(vanBanList.map(r => r.stt));
    }
  };

  const allDonOptions = Array.from(new Set(lichSuData.flatMap(r => r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean))));
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => {
    const matchDon = !filterDon || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#333333", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoCongVanModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      {/* Danh sách văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={handleTrinhKyClick} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} /><col style={{ width: 40 }} /><col /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "14%" }} /><col style={{ width: 110 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ ...TH, textAlign: "center", width: 36 }}>
                <input
                  type="checkbox"
                  checked={selectedVB.length === vanBanList.length && vanBanList.length > 0}
                  onChange={toggleAllVB}
                  style={{ accentColor: RED, cursor: "pointer", width: 14, height: 14 }}
                />
              </th>
              {["STT", "TÊN VĂN BẢN", "LOẠI", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {vanBanList.map((r, idx) => (
              <tr key={r.stt} style={{ background: selectedVB.includes(r.stt) ? "#fff5f5" : idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedVB.includes(r.stt)}
                    onChange={() => toggleVB(r.stt)}
                    style={{ accentColor: RED, cursor: "pointer", width: 14, height: 14 }}
                  />
                </td>
                <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                <td style={{ ...TD, color: "#1a73e8", fontWeight: 600 }}>{r.vanBan}</td>
                <td style={TD}>{r.loai}</td>
                <td style={TD}>{r.ngayTao}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  {r.trangThai === "Chưa ký số" ? (
                    <Badge color="#6e1414" bg="#fdecea">Chưa ký số</Badge>
                  ) : (
                    <Badge color={r.trangThai === "Đã phát hành" ? "#1b5e20" : "#1a5a96"} bg={r.trangThai === "Đã phát hành" ? "#e8f5e9" : "#e8f4ff"}>
                      {r.trangThai}
                    </Badge>
                  )}
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {r.trangThai === "Chưa ký số" && (
                      <button
                        onClick={() => handleDeleteVanBan(r.stt)}
                        title="Xóa tờ trình chưa ký số"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}>
                        <Trash2 size={14} color="#c0392b" />
                      </button>
                    )}
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem văn bản"><Eye size={14} color="#1a5a96" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {/* <select value={filterDon} onChange={e => setFilterDon(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo đơn</option>
            {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select> */}
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} /><col style={{ width: "10%" }} /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "22%" }} /><col style={{ width: "16%" }} /><col style={{ width: "10%" }} /><col style={{ width: "11%" }} /><col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r, realIdx) => (
                <React.Fragment key={"ls-" + realIdx}>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                    <td style={TD}>{r.ngayTrinh}</td>
                    <td style={TD}>{r.lanh}</td>
                    <td style={TD}>{r.capTrinh}</td>
                    <td style={{ ...TD, color: "#1a73e8" }}>{r.vanBan}</td>
                    <td style={{ ...TD, padding: "4px 6px" }}>
                      <textarea
                        value={r.yKien === "–" ? "" : r.yKien}
                        onChange={e => {
                          const val = e.target.value;
                          setLichSuData(prev => prev.map((item, i) => i === realIdx ? { ...item, yKien: val } : item));
                        }}
                        placeholder="Nhập ý kiến..."
                        rows={2}
                        style={{
                          width: "100%",
                          fontSize: 11,
                          fontFamily: F,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 4,
                          padding: "4px 6px",
                          outline: "none",
                          resize: "vertical" as const,
                          background: "#fff",
                          boxSizing: "border-box" as const,
                          color: TEXT,
                        }}
                      />
                    </td>
                    <td style={TD}>{r.ngayDuyet}</td>
                    <td style={TD}>
                      {r.trangThai === "cho-duyet"
                        ? <Badge color="#8a6d00" bg="#fff8e1">Chờ duyệt</Badge>
                        : r.trangThai === "tu-choi"
                          ? <Badge color="#6e1414" bg="#fdecea">Từ chối</Badge>
                          : <Badge color="#1b5e20" bg="#e8f5e9">Đã duyệt</Badge>}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={13} color="#1a5a96" /></button>
                        {r.trangThai === "cho-duyet" && (
                          <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 4v4h4" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        )}
                        <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                          <Send size={13} color={RED} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Kết quả giải quyết tab ────────────────────────────────────────────────────

const KQGQ_ROWS = [
  { stt: "01", cachGQ: "Qua công văn", ngayTao: "08/07/2026", soCV: "CV-TR-01", noiDung: "Đã hoàn thành trả lời công văn theo yêu cầu", ghiChu: "Chuyển phát nhanh" },
  { stt: "02", cachGQ: "Trao đổi trực tiếp", ngayTao: "–", soCV: "–", noiDung: "Đã trao đổi trực tiếp và thống nhất phương hướng", ghiChu: "Tại phòng họp số 2" },
];

function ThemKetQuaGQModal({ onClose }: { onClose: () => void }) {
  const [cachGiaiQuyet, setCachGiaiQuyet] = useState<"truc-tiep" | "qua-cong-van">("qua-cong-van");
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

  const handleLamMoi = () => {
    setNgayTaoCV("");
    setSoCV("");
    setNguoiKy("");
    setNoiNhan("");
    setDonViNhan("");
    setNgayTraoDoi("");
    setNoiDung("");
    setGhiChu("");
  };

  const handleSave = () => {
    alert("Đã lưu kết quả giải quyết công văn thành công!");
    onClose();
  };

  const inSt: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
    color: TEXT,
  };

  const lblSt: React.CSSProperties = {
    fontSize: 12,
    color: TEXT,
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
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Thêm kết quả giải quyết công văn
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
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
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: TEXT }}>
                <input
                  type="radio"
                  name="kqCachGiaiQuyet"
                  checked={cachGiaiQuyet === "truc-tiep"}
                  onChange={() => setCachGiaiQuyet("truc-tiep")}
                  style={{ accentColor: RED, cursor: "pointer" }}
                />
                Trao đổi trực tiếp
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: TEXT }}>
                <input
                  type="radio"
                  name="kqCachGiaiQuyet"
                  checked={cachGiaiQuyet === "qua-cong-van"}
                  onChange={() => setCachGiaiQuyet("qua-cong-van")}
                  style={{ accentColor: RED, cursor: "pointer" }}
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
                    <span style={{ color: RED, marginRight: 3 }}>*</span>Ngày tạo CV
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={ngayTaoCV}
                      onChange={e => setNgayTaoCV(e.target.value)}
                      style={{ ...inSt, paddingRight: 32 }}
                    />
                    <span style={{ position: "absolute", right: 10, pointerEvents: "none", fontSize: 13 }}>📅</span>
                  </div>
                </div>

                <div>
                  <label style={lblSt}>
                    <span style={{ color: RED, marginRight: 3 }}>*</span>Số CV
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
              <span style={{ color: RED, marginRight: 3 }}>*</span>Ngày trao đổi
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={ngayTraoDoi}
                onChange={e => setNgayTraoDoi(e.target.value)}
                style={{ ...inSt, paddingRight: 32 }}
              />
              <span style={{ position: "absolute", right: 10, pointerEvents: "none", fontSize: 13 }}>📅</span>
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
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, marginTop: 3 }}>
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
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, marginTop: 3 }}>
              {ghiChu.length} / 1000
            </div>
          </div>

          {/* Table Section: Nơi nhận (chỉ hiển thị khi qua công văn) */}
          {cachGiaiQuyet === "qua-cong-van" && (
            <div>
              <label style={lblSt}>Nơi nhận</label>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                  <thead>
                    <tr style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
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
                          <td style={{ padding: "8px", textAlign: "center", color: MUTED }}>{idx + 1}</td>
                          <td style={{ padding: "8px", color: TEXT }}>
                            {isEditing ? (
                              <select value={editLoai} onChange={e => setEditLoai(e.target.value)} style={{ ...inSt, padding: "3px 6px" }}>
                                <option value="Viện kiểm sát">Viện kiểm sát</option>
                                <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                                <option value="Cơ quan điều tra">Cơ quan điều tra</option>
                                <option value="Khác">Khác</option>
                              </select>
                            ) : item.loaiNoiNhan}
                          </td>
                          <td style={{ padding: "8px", color: TEXT }}>
                            {isEditing ? (
                              <input value={editDonVi} onChange={e => setEditDonVi(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                            ) : item.tenDonViNhan}
                          </td>
                          <td style={{ padding: "8px", color: MUTED }}>
                            {isEditing ? (
                              <input value={editGhiChu} onChange={e => setEditGhiChu(e.target.value)} style={{ ...inSt, padding: "3px 6px" }} />
                            ) : item.ghiChu}
                          </td>
                          <td style={{ padding: "8px", textAlign: "center" }}>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button onClick={() => handleSaveEdit(item.id)} style={{ color: "#27ae60", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Lưu</button>
                                <button onClick={() => setEditingId(null)} style={{ color: MUTED, background: "none", border: "none", cursor: "pointer" }}>Hủy</button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: 8, justifyContent: "center", fontSize: 12 }}>
                                <button onClick={() => handleStartEdit(item)} style={{ color: "#1a73e8", background: "none", border: "none", cursor: "pointer" }}>✎ Sửa</button>
                                <button onClick={() => handleDeleteNoiNhan(item.id)} style={{ color: RED, background: "none", border: "none", cursor: "pointer" }}>Xóa</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {isAdding && (
                      <tr style={{ background: "#fff8e1", borderBottom: "1px solid #fef08a" }}>
                        <td style={{ padding: "8px", textAlign: "center", color: MUTED }}>+</td>
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
                            <button onClick={() => setIsAdding(false)} style={{ color: MUTED, background: "none", border: "none", cursor: "pointer" }}>Hủy</button>
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
                    border: `1px dashed ${BORDER}`,
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
            borderTop: `1px solid ${BORDER}`,
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
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: F,
                color: TEXT,
              }}
            >
              Đóng
            </button>
            <button
              onClick={handleLamMoi}
              style={{
                padding: "7px 18px",
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: F,
                color: TEXT,
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
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: F,
                    color: TEXT,
                  }}
                >
                  Xem biểu mẫu
                </button>
                <button
                  onClick={() => setShowTrinhKy(true)}
                  style={{
                    padding: "7px 18px",
                    background: RED,
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
                background: RED,
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

function TabKetQuaCV() {
  const [showModal, setShowModal] = useState(false);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 10px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 10px", verticalAlign: "top" };

  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
      {showModal && <ThemKetQuaGQModal onClose={() => setShowModal(false)} />}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Kết quả giải quyết công văn</span>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Thêm kết quả giải quyết
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 44 }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "12%" }} />
          <col />
          <col style={{ width: "16%" }} />
          <col style={{ width: 72 }} />
        </colgroup>
        <thead>
          <tr>{["STT", "CÁCH GIẢI QUYẾT", "NGÀY TẠO CV", "SỐ CV", "NỘI DUNG", "GHI CHÚ", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {KQGQ_ROWS.map((r, idx) => (
            <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
              <td style={TD}>{r.cachGQ}</td>
              <td style={TD}>{r.ngayTao}</td>
              <td style={TD}>{r.soCV}</td>
              <td style={TD}>{r.noiDung}</td>
              <td style={TD}>{r.ghiChu}</td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color={RED} /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Pencil size={13} color={RED} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChiTietCongVanView({ row, onBack }: { row: CVRow; onBack: () => void }) {
  const [tab, setTab] = useState<CVDetailTab>("thong-tin");

  const tabs: { id: CVDetailTab; label: string }[] = [
    { id: "thong-tin", label: "Thông tin công văn" },
    { id: "phan-cong", label: "Phân công" },
    { id: "to-trinh", label: "Tờ trình" },
    { id: "ket-qua", label: "Kết quả giải quyết công văn" },
  ];

  const [showChiTietPopup, setShowChiTietPopup] = useState(false);

  const inSt: React.CSSProperties = { width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box", background: "#fff" };
  const lblSt: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#666666", fontFamily: F, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.04em" };
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 12px", verticalAlign: "top" };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#fafafa" }}>
      {showChiTietPopup && <XemChiTietCongVanModal row={row} onClose={() => setShowChiTietPopup(false)} />}
      <div style={{ padding: "20px 28px 0" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 10 }}>
          Trang chủ &rsaquo; Quản lý án &rsaquo; Công văn trao đổi &rsaquo; <span style={{ color: TEXT }}>Chi tiết công văn</span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <button onClick={onBack} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center" }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Chi tiết công văn số 13, Ngày 20/07/2026
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 20px", background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent",
                color: tab === t.id ? RED : "#666666",
                fontFamily: F, fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer", marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        {tab === "thong-tin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Card: Thông tin công văn */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 14 }}>Thông tin công văn</div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: 110 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "THÔNG TIN CÔNG VĂN", "THÔNG TIN BẢN ÁN/QUYẾT ĐỊNH ĐỀ NGHỊ", "ĐƠN VỊ GỬI", "NGƯỜI DUYỆT/NGƯỜI KÝ", "GHI CHÚ", "THAO TÁC"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>01</td>
                    <td style={TD}>
                      <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>{row.soCV}</div>
                      <div style={{ color: MUTED, fontFamily: F, fontSize: 11 }}>Ngày CV: {row.ngayCV}</div>
                    </td>
                    <td style={TD}>
                      <div style={{ fontSize: 12, fontFamily: F, color: TEXT }}>
                        <span style={{ color: MUTED }}>Số BA/QĐ:</span> <strong>{row.soBA || "18/2026/KDTM-ST"}</strong>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: F, color: MUTED, marginTop: 2 }}>
                        Ngày BA: {row.ngayBA || "25/04/2026"}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: F, color: MUTED, marginTop: 2 }}>
                        Tòa ra BA: {row.toaRaBA || "TAND khu vực 4 - Hà Nội"}
                      </div>
                    </td>
                    <td style={TD}>{row.donVi}</td>
                    <td style={TD}>Nguyễn Văn Bình</td>
                    <td style={{ ...TD, color: MUTED, fontSize: 11, fontFamily: F }}>
                      Công văn xin ý kiến giải quyết vướng mắc án kinh doanh thương mại
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button
                        onClick={() => setShowChiTietPopup(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, color: RED, fontSize: 12, fontFamily: F, fontWeight: 600 }}>
                        <Eye size={13} color={RED} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card: Thông tin thụ lý và phân công */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 16 }}>Thông tin thụ lý và phân công</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lblSt}>SỐ THỤ LÝ</label>
                  <input defaultValue="123/TL-TA" style={inSt} />
                </div>
                <div>
                  <label style={lblSt}>NGÀY THỤ LÝ</label>
                  <input type="date" defaultValue="2026-07-08" style={inSt} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {tab === "phan-cong" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 1. Card: Thông tin công văn */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 14 }}>Thông tin công văn</div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: 110 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "THÔNG TIN CÔNG VĂN", "ĐƠN VỊ GỬI", "NGƯỜI DUYỆT/NGƯỜI KÝ", "GHI CHÚ", "THAO TÁC"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>01</td>
                    <td style={TD}>
                      <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>{row.soCV}</div>
                      <div style={{ color: MUTED, fontFamily: F, fontSize: 11 }}>Ngày CV: {row.ngayCV}</div>
                    </td>
                    <td style={TD}>{row.donViGui || (row as any).donVi || "TAND TP. Hà Nội"}</td>
                    <td style={TD}>Nguyễn Văn Bình</td>
                    <td style={{ ...TD, color: MUTED }}>–</td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button
                        onClick={() => setShowChiTietPopup(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, color: RED, fontSize: 12, fontFamily: F, fontWeight: 600 }}>
                        <Eye size={13} color={RED} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Card: Lịch sử phân công Thẩm phán */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Lịch sử phân công Thẩm phán</div>
                <button title="Làm mới" style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center" }}>
                  <RotateCw size={13} />
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "HỌ VÀ TÊN THẨM PHÁN", "CHỨC DANH", "NGÀY PHÂN CÔNG", "NGƯỜI THAO TÁC", "GHI CHÚ"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
                    <td style={{ ...TD, fontWeight: 700 }}>Hoàng Ngọc Chiều</td>
                    <td style={TD}>
                      <span style={{ background: "#e8f4ff", color: "#1a5a96", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: F }}>
                        TPTC
                      </span>
                    </td>
                    <td style={TD}>21/07/2026</td>
                    <td style={TD}>
                      <div style={{ fontWeight: 600, color: TEXT }}>Nguyễn Văn Hiền – Phó CA</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>14:30 - 21/07/2026</div>
                    </td>
                    <td style={{ ...TD, color: MUTED }}>Phân công lại do TPB3 đề xuất kháng nghị</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Card: Lịch sử phân công TTV và LĐV */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Lịch sử phân công TTV và LĐV</div>
                <button title="Làm mới" style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center" }}>
                  <RotateCw size={13} />
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "HỌ VÀ TÊN CÔNG CHỨC", "CHỨC DANH CÔNG CHỨC", "NGÀY PHÂN CÔNG CÔNG CHỨC", "HỌ VÀ TÊN LĐ", "TÊN CHỨC VỤ LĐ", "NGÀY PHÂN CÔNG LĐ"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>1</td>
                    <td style={{ ...TD, fontWeight: 700 }}>Hoàng Ngọc Chiều</td>
                    <td style={TD}>TTV</td>
                    <td style={TD}>21/07/2026</td>
                    <td style={{ ...TD, fontWeight: 600 }}>Nguyễn Văn Hiền</td>
                    <td style={TD}>Phó Trưởng phòng</td>
                    <td style={TD}>21/07/2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "to-trinh" && <TabToTrinhCV />}

        {tab === "ket-qua" && <TabKetQuaCV />}
      </div>
    </div>
  );
}

// ── CongVanTraoDoiView (list + detail) ───────────────────────────────────────

export default function CongVanTraoDoiView({
  userRole: propUserRole,
  setUserRole: propSetUserRole,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
} = {}) {
  const [internalRole, setInternalRole] = useState<UserRoleType>("vu-1");
  const userRole = propUserRole ?? internalRole;
  const setUserRole = propSetUserRole ?? setInternalRole;
  const [tab, setTab] = useState<CongVanTab>("tat-ca");
  const [search, setSearch] = useState("");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showTaoCV, setShowTaoCV] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CVRow | null>(null);

  // States bộ lọc 11 trường
  const [soCVFilter, setSoCVFilter] = useState("");
  const [ngayCVFilter, setNgayCVFilter] = useState("");
  const [ngayGuiFilter, setNgayGuiFilter] = useState("");
  const [ngayNhanFilter, setNgayNhanFilter] = useState("");
  const [ttvFilter, setTtvFilter] = useState("");
  const [noiNhanFilter, setNoiNhanFilter] = useState("");
  const [donViNhanFilter, setDonViNhanFilter] = useState("");
  const [noiGuiFilter, setNoiGuiFilter] = useState("");
  const [donViGuiFilter, setDonViGuiFilter] = useState("");
  const [thamPhanFilter, setThamPhanFilter] = useState("");
  const [lanhDaoFilter, setLanhDaoFilter] = useState("");

  const handleResetFilter = () => {
    setSoCVFilter("");
    setNgayCVFilter("");
    setNgayGuiFilter("");
    setNgayNhanFilter("");
    setTtvFilter("");
    setNoiNhanFilter("");
    setDonViNhanFilter("");
    setNoiGuiFilter("");
    setDonViGuiFilter("");
    setThamPhanFilter("");
    setLanhDaoFilter("");
    setSearch("");
  };

  if (selectedCV) {
    return <ChiTietCongVanView row={selectedCV} onBack={() => setSelectedCV(null)} />;
  }

  const filtered = CV_ROWS.filter(r => {
    if ((userRole === "vu-1" || userRole === "hinh-su") && !r.soBA.includes("HS")) return false;
    if ((userRole === "vu-2" || userRole === "dan-su") && !r.soBA.includes("DS")) return false;
    if (userRole === "vu-3" && !r.soBA.includes("KDTM") && !r.soBA.includes("HNGĐ") && !r.soBA.includes("LĐ") && !r.soBA.includes("SHTT") && !r.soBA.includes("PS")) return false;
    if ((userRole === "vu-4" || userRole === "hanh-chinh") && !r.soBA.includes("HC")) return false;
    if (tab === "den" && r.loai !== "den") return false;
    if (tab === "di" && r.loai !== "di") return false;
    if (soCVFilter && !r.soCV.toLowerCase().includes(soCVFilter.toLowerCase())) return false;
    if (donViNhanFilter && !r.donVi.toLowerCase().includes(donViNhanFilter.toLowerCase())) return false;
    if (donViGuiFilter && !r.donVi.toLowerCase().includes(donViGuiFilter.toLowerCase())) return false;
    if (ttvFilter && !r.phanCong.toLowerCase().includes(ttvFilter.toLowerCase())) return false;
    if (search && !r.soCV.toLowerCase().includes(search.toLowerCase()) &&
      !r.donVi.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { id: CongVanTab; label: string }[] = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "den", label: "Công văn đến" },
    { id: "di", label: "Công văn đi" },
  ];

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "10px 8px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 8px", verticalAlign: "top" };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "6px 10px", fontSize: 12, border: `1px solid ${BORDER}`,
    borderRadius: 4, fontFamily: F, color: TEXT, outline: "none", background: "#fff", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: "#555555", fontFamily: F, marginBottom: 4, display: "block", fontWeight: 500,
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#fafafa" }}>
      {showTaoCV && <TaoCongVanModal onClose={() => setShowTaoCV(false)} />}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: F, marginBottom: 6 }}>
          Quản lý án &rsaquo; <span style={{ color: RED, fontWeight: 600 }}>Công văn trao đổi</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Công văn trao đổi</h1>
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 18px", background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent",
                color: tab === t.id ? RED : "#666666",
                fontFamily: F, fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer", marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        {/* Bộ tìm kiếm chuẩn mockup hình ảnh */}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 20, marginBottom: 20 }}>
          {/* Hàng 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: filterExpanded ? 14 : 0 }}>
            <div>
              <span style={labelStyle}>Số CV</span>
              <input value={soCVFilter} onChange={e => setSoCVFilter(e.target.value)} placeholder="Nhập số CV" style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>Ngày CV</span>
              <input type="date" value={ngayCVFilter} onChange={e => setNgayCVFilter(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>Ngày gửi CV</span>
              <input type="date" value={ngayGuiFilter} onChange={e => setNgayGuiFilter(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>Ngày nhận CV</span>
              <input type="date" value={ngayNhanFilter} onChange={e => setNgayNhanFilter(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>TTV</span>
              <input value={ttvFilter} onChange={e => setTtvFilter(e.target.value)} placeholder="Nhập TTV" style={inputStyle} />
            </div>
          </div>

          {/* Các hàng ẩn khi thu gọn (Hàng 2 & 3) */}
          {filterExpanded && (
            <>
              {/* Hàng 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 14 }}>
                <div>
                  <span style={labelStyle}>Nơi nhận</span>
                  <select value={noiNhanFilter} onChange={e => setNoiNhanFilter(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Vui lòng chọn</option>
                    <option value="Tòa án">Tòa án</option>
                    <option value="Viện kiểm sát">Viện kiểm sát</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <span style={labelStyle}>Đơn vị nhận</span>
                  <input value={donViNhanFilter} onChange={e => setDonViNhanFilter(e.target.value)} placeholder="Nhập đơn vị nhận" style={inputStyle} />
                </div>
                <div>
                  <span style={labelStyle}>Nơi gửi</span>
                  <select value={noiGuiFilter} onChange={e => setNoiGuiFilter(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Vui lòng chọn</option>
                    <option value="Tòa án">Tòa án</option>
                    <option value="Viện kiểm sát">Viện kiểm sát</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <span style={labelStyle}>Đơn vị gửi</span>
                  <input value={donViGuiFilter} onChange={e => setDonViGuiFilter(e.target.value)} placeholder="Nhập đơn vị gửi" style={inputStyle} />
                </div>
                <div>
                  <span style={labelStyle}>Thẩm phán</span>
                  <input value={thamPhanFilter} onChange={e => setThamPhanFilter(e.target.value)} placeholder="Nhập thẩm phán" style={inputStyle} />
                </div>
              </div>

              {/* Hàng 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 14 }}>
                <div>
                  <span style={labelStyle}>Lãnh đạo phụ trách</span>
                  <input value={lanhDaoFilter} onChange={e => setLanhDaoFilter(e.target.value)} placeholder="Nhập lãnh đạo" style={inputStyle} />
                </div>
              </div>
            </>
          )}

          {/* Nút toggle Thu gọn/Mở rộng bên trái & Nút Tìm kiếm/Xóa bộ lọc bên phải */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <button
              onClick={() => setFilterExpanded(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                cursor: "pointer", fontSize: 12, color: "#1a73e8", fontFamily: F, padding: 0, fontWeight: 500,
              }}>
              {filterExpanded ? "▲ Thu gọn" : "▼ Mở rộng"}
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setSearch(soCVFilter || donViNhanFilter || donViGuiFilter)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 18px",
                  background: "#6e1414", color: "#fff", border: "none", borderRadius: 4,
                  cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                <Search size={13} /> Tìm kiếm
              </button>
              <button
                onClick={handleResetFilter}
                style={{
                  padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`,
                  borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F,
                }}>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách Công văn */}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", justifyContent: "flex-end" }}>
            <button onClick={() => setShowTaoCV(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: RED, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>
              + Thêm công văn
            </button>
            <button style={{ padding: 8, background: "none", border: `1px solid ${BORDER}`, borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Printer size={15} color={MUTED} />
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: 66 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "THÔNG TIN CÔNG VĂN", "THÔNG TIN BA/QĐ", "THÔNG TIN THỤ LÝ", "ĐƠN VỊ GỬI", "ĐƠN VỊ NHẬN", "CÔNG VĂN PHẢN HỒI", "PHÂN CÔNG", "TRẠNG THÁI", "THAO TÁC"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                  <td style={TD}>
                    <div style={{ fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 3 }}>{r.soCV}</div>
                    <div style={{ color: MUTED, fontFamily: F, marginBottom: 5 }}>Ngày CV: {r.ngayCV}</div>
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, fontFamily: F,
                      background: r.loai === "den" ? "#e8f4ff" : "#fff7ed",
                      color: r.loai === "den" ? "#1a5a96" : "#c2410c",
                    }}>
                      {r.loai === "den" ? "CÔNG VĂN ĐẾN" : "CÔNG VĂN ĐI"}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{ fontSize: 11, fontFamily: F, color: TEXT }}>
                      <span style={{ color: MUTED }}>Số BA/QĐ: </span>
                      <span style={{ color: "#1a73e8", fontWeight: 600 }}>{r.soBA}</span>
                    </div>
                    <div style={{ fontSize: 11, fontFamily: F, color: TEXT, marginTop: 2 }}>
                      <span style={{ color: MUTED }}>Ngày BA: </span>
                      <span>{r.ngayBA}</span>
                    </div>
                    <div style={{ fontSize: 11, fontFamily: F, color: TEXT, marginTop: 2 }}>
                      <span style={{ color: MUTED }}>Tòa ra BA: </span>
                      <span>{r.toaRaBA}</span>
                    </div>
                  </td>
                  <td style={TD}>
                    <div style={{ color: TEXT, fontFamily: F }}>Số thụ lý: {r.soThuLy}</div>
                    <div style={{ color: MUTED, fontFamily: F }}>Ngày thụ lý: {r.ngayThuLy}</div>
                  </td>
                  <td style={TD}><span style={{ color: TEXT, fontFamily: F }}>{r.loai === "di" ? "Tòa án nhân dân thành phố Hà Nội" : r.donViGui}</span></td>
                  <td style={TD}><span style={{ color: TEXT, fontFamily: F }}>{r.loai === "den" ? "Tòa án nhân dân thành phố Hà Nội" : r.donViNhan}</span></td>
                  <td style={TD}>
                    {r.phanHoi === "–" ? (
                      <span style={{ color: MUTED }}>–</span>
                    ) : (
                      r.phanHoi.split("\n").map((ln, i) => <div key={i} style={{ color: TEXT, fontFamily: F }}>{ln}</div>)
                    )}
                  </td>
                  <td style={TD}><span style={{ color: TEXT, fontFamily: F }}>{r.phanCong}</span></td>
                  <td style={TD}>
                    <span style={{
                      display: "inline-block", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F,
                      background: r.coKQGG ? "#e8f5e9" : "#f5f5f5",
                      color: r.coKQGG ? "#1b5e20" : "#666666",
                    }}>
                      {r.coKQGG ? "CÓ KQGG" : "CHƯA CÓ KQGG"}
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                      <button onClick={() => setSelectedCV(r)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                        <Eye size={15} color="#666666" />
                      </button>
                      {!r.coKQGG && (
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xóa">
                          <span style={{ fontSize: 15, color: "#c0392b" }}>🗑</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
              Hiển thị <b>{filtered.length}</b> của <b>{filtered.length}</b> bản ghi
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>HIỂN THỊ:</span>
              <select style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontFamily: F }}>
                <option>10 dòng</option>
                <option>20 dòng</option>
                <option>50 dòng</option>
              </select>
              <div style={{ display: "flex", gap: 2 }}>
                {["‹‹", "‹", "1", "›", "››"].map((p, i) => (
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
