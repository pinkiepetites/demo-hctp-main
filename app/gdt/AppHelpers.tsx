import React, { useState } from "react";
import { X, FileText, Calendar, Paperclip, FolderPlus, Eye, Send } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";
import { TrinhKyModal } from "./TrinhKyModal";
import { XemBieuMauCongVanModal } from "./CongVanTraoDoiView";

export function formatSoBA(raw?: string | null, loaiAn?: string): string {
  if (!raw) return "";

  // Bảng viết tắt 8 loại án chuẩn tố tụng
  const SHORT_MAP: Record<string, string> = {
    "Hình sự": "HS",
    "hinh-su": "HS",
    "vu-1": "HS",
    "Dân sự": "DS",
    "dan-su": "DS",
    "vu-2": "DS",
    "Hành chính": "HC",
    "hanh-chinh": "HC",
    "vu-4": "HC",
    "Kinh doanh thương mại": "KDTM",
    "kdtm": "KDTM",
    "vu-3": "KDTM",
    "Hôn nhân gia đình": "HNGĐ",
    "Lao động": "LĐ",
    "Sở hữu trí tuệ": "SHTT",
    "Phá sản": "PS",
  };

  // Nếu chuỗi đã được định dạng sẵn với dấu / và hậu tố án, giữ nguyên
  if (raw.includes("/") && (
    raw.includes("HS") || raw.includes("DS") || raw.includes("HC") ||
    raw.includes("KDTM") || raw.includes("HNGĐ") || raw.includes("LĐ") ||
    raw.includes("SHTT") || raw.includes("PS") || raw.includes("QĐ")
  )) {
    return raw;
  }

  let code = loaiAn && SHORT_MAP[loaiAn] ? SHORT_MAP[loaiAn] : "";

  if (!code) {
    if (raw.includes("HS") || raw.includes("_01") || raw.includes("_1") || raw.toLowerCase().includes("hình sự")) code = "HS";
    else if (raw.includes("KDTM") || raw.includes("_04") || raw.includes("_4")) code = "KDTM";
    else if (raw.includes("HNGĐ") || raw.includes("_05") || raw.includes("_5")) code = "HNGĐ";
    else if (raw.includes("SHTT") || raw.includes("_07") || raw.includes("_7")) code = "SHTT";
    else if (raw.includes("HC") || raw.includes("_03") || raw.includes("_3")) code = "HC";
    else if (raw.includes("LĐ") || raw.includes("_06") || raw.includes("_6")) code = "LĐ";
    else if (raw.includes("PS") || raw.includes("_08") || raw.includes("_8")) code = "PS";
    else if (raw.includes("DS") || raw.includes("_02") || raw.includes("_2")) code = "DS";
    else code = "HS"; // Mặc định là HS cho Vụ 1 - Án hình sự
  }

  const digits = raw.match(/\d+/g);
  const num = digits ? digits[0] : (raw.replace(/\D/g, '') || "12");
  const cap = raw.includes("PT") || raw.includes("Phúc thẩm") ? "PT" : "ST";

  return `${num}/2026/${code}-${cap}`;
}
export function TaoToTrinhModal({
  onClose,
  onSave,
  onKySo
}: {
  onClose: () => void;
  onSave?: (data: { daDinhKemHoSo: boolean; countHoSo: number }) => void;
  onKySo?: () => void;
}) {
  const [ngayLap, setNgayLap] = useState("");
  const [dienBien, setDienBien] = useState("");
  const [noiDungDeXuat, setNoiDungDeXuat] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [daKySo, setDaKySo] = useState(false);
  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const [selectedHoSo, setSelectedHoSo] = useState([
    { id: 1, ten: "Hồ sơ công văn số 32/CV-TAND (Bản quét gốc PDF)", dungLuong: "2.4 MB", checked: true },
    { id: 2, ten: "Dự thảo Công văn trao đổi nghiệp vụ gửi TAND khu vực 3 - Hà Nội (.docx)", dungLuong: "145 KB", checked: true },
    { id: 3, ten: "Biên bản tổng hợp ý kiến vướng mắc áp dụng pháp luật", dungLuong: "520 KB", checked: true },
    { id: 4, ten: "Tài liệu đính kèm vụ án thụ lý số 32", dungLuong: "1.8 MB", checked: false },
  ]);

  const toggleHoSo = (id: number) => {
    setSelectedHoSo(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddCustomFile = () => {
    const fileName = prompt("Nhập tên file tài liệu/hồ sơ đính kèm mới:");
    if (fileName && fileName.trim()) {
      setSelectedHoSo(prev => [
        ...prev,
        { id: Date.now(), ten: fileName.trim(), dungLuong: "Vừa tải lên", checked: true }
      ]);
    }
  };

  const RBORDER = "#f3c9c9";
  const inSt: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: 13,
    border: `1px solid ${RBORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box"
  };
  const fieldLbl: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "#333333",
    fontFamily: F,
    display: "block",
    marginBottom: 6
  };

  const handleSave = () => {
    const countHoSo = selectedHoSo.filter(h => h.checked).length;
    const daDinhKemHoSo = countHoSo > 0;
    setIsSaved(true);
    if (onSave) {
      onSave({ daDinhKemHoSo, countHoSo });
    }
    alert("Đã lưu thông tin tờ trình thành công!");
  };

  const handleKySoModal = () => {
    setDaKySo(true);
    if (onKySo) {
      onKySo();
    }
    alert("Đã ký số tờ trình thành công!");
  };

  const handleTrinhKyModalClick = () => {
    if (!daKySo) {
      alert("⚠️ Cảnh báo: Người tạo văn bản phải thực hiện KÝ SỐ trước khi ấn Trình ký!");
      return;
    }
    setShowTrinhKy(true);
  };

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      setDaLaySo(true);
      alert("Đã cấp số tờ trình thành công: 05/TTr-TAND!");
    } else {
      setDaLaySo(false);
      alert("Đã hủy cấp số tờ trình!");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1400, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && <XemBieuMauCongVanModal onClose={() => setShowBieuMau(false)} />}

      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 880, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", marginBottom: 24, overflow: "hidden" }}>
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top Info Banner Card */}
          <div style={{ background: "#fcf5f5", border: `1px solid ${RBORDER}`, borderRadius: 4, padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 24px", fontSize: 13, fontFamily: F }}>
              <div>
                <span style={{ color: "#1a73e8", fontWeight: 700 }}>Số CV / Tờ trình : </span>
                <span style={{ color: daLaySo ? "#1b5e20" : TEXT, fontWeight: daLaySo ? 700 : 400 }}>{daLaySo ? "05/TTr-TAND" : "32/CV-TAND"}</span>
              </div>
              <div>
                <span style={{ color: "#1a73e8", fontWeight: 700 }}>Số thụ lý : </span>
                <span style={{ color: TEXT }}>32</span>
              </div>
              <div>
                <span style={{ color: "#1a73e8", fontWeight: 700 }}>Đơn vị gửi : </span>
                <span style={{ color: TEXT }}>Tòa án nhân dân khu vực 3 - Hà Nội</span>
              </div>
              <div>
                <span style={{ color: "#1a73e8", fontWeight: 700 }}>Ngày CV : </span>
                <span style={{ color: TEXT }}>02/07/2026</span>
              </div>
              <div>
                <span style={{ color: "#1a73e8", fontWeight: 700 }}>Ngày thụ lý : </span>
                <span style={{ color: TEXT }}>02/07/2026</span>
              </div>
            </div>
          </div>

          {/* Ngày lập tờ trình */}
          <div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Ngày lập tờ trình
            </label>
            <div style={{ position: "relative", maxWidth: 260 }}>
              <input
                type="date"
                value={ngayLap}
                onChange={e => setNgayLap(e.target.value)}
                style={{ ...inSt, paddingRight: 36 }}
              />
              <Calendar size={18} color="#666666" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* II. THÔNG TIN CÔNG VĂN */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, borderBottom: `1px solid ${RBORDER}`, paddingBottom: 6 }}>
              II. THÔNG TIN CÔNG VĂN
            </div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Diễn biến quá trình giải quyết
            </label>
            <textarea
              value={dienBien}
              onChange={e => setDienBien(e.target.value)}
              placeholder="Nhập quá trình giải quyết vụ án"
              style={{ ...inSt, minHeight: 100, resize: "vertical" }}
            />
          </div>

          {/* III. ĐỀ XUẤT XỬ LÝ */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, borderBottom: `1px solid ${RBORDER}`, paddingBottom: 6 }}>
              III. ĐỀ XUẤT XỬ LÝ
            </div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Nội dung
            </label>
            <textarea
              value={noiDungDeXuat}
              onChange={e => setNoiDungDeXuat(e.target.value)}
              placeholder="Nhập đề xuất xử lý"
              style={{ ...inSt, minHeight: 100, resize: "vertical" }}
            />
          </div>

          {/* Modal Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>
              Đóng
            </button>

            {!isSaved ? (
              <button
                onClick={handleSave}
                style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
                Lưu
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowBieuMau(true)}
                  style={{ padding: "7px 16px", background: "#fff", color: "#1a73e8", border: "1px solid #1a73e8", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 600 }}>
                  Xem biểu mẫu
                </button>

                <button
                  onClick={handleKySoModal}
                  disabled={daKySo}
                  style={{
                    padding: "7px 16px",
                    background: daKySo ? "#e8f5e9" : "#1b5e20",
                    color: daKySo ? "#1b5e20" : "#fff",
                    border: daKySo ? "1px solid #a5d6a7" : "none",
                    borderRadius: 4,
                    cursor: daKySo ? "default" : "pointer",
                    fontSize: 13,
                    fontFamily: F,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                  {daKySo ? "✓ Đã ký số" : "Ký số"}
                </button>

                <button
                  onClick={handleToggleLaySo}
                  style={{ padding: "7px 16px", background: daLaySo ? "#fff" : "#1a5a96", color: daLaySo ? "#c0392b" : "#fff", border: daLaySo ? "1px solid #f3c0bb" : "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 600 }}>
                  {daLaySo ? "Hủy lấy số" : "Lấy số"}
                </button>

                {/* <button
                  onClick={handleTrinhKyModalClick}
                  style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
                  Trình ký
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm thu hồi dialog ─────────────────────────────────────────────────────
export function ThuHoiConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</button>
        </div>
      </div>
    </div>
  );
}

export function TabPlaceholder({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: MUTED, fontFamily: F }}>
      <FileText size={40} color="#cccccc" />
      <span style={{ fontSize: 14 }}>{label} – Chưa có dữ liệu</span>
    </div>
  );
}
