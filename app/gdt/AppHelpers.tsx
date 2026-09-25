import React, { useState } from "react";
import { X, FileText, Calendar, Paperclip, FolderPlus, Eye, Send, Plus, Trash2, Upload } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";
import { TrinhKyModal } from "./TrinhKyModal";
import { XemBieuMauCongVanModal } from "./CongVanTraoDoiView";
import { Button, Input } from "antd";

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
    { id: 2, ten: "Dự thảo Công văn trao đổi nghiệp vụ gửi TAND tỉnh Thanh Hóa (.docx)", dungLuong: "145 KB", checked: true },
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
    fontSize: 14,
    border: `1px solid ${RBORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box"
  };
  const fieldLbl: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
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
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </Button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top Info Banner Card */}
          <div style={{ background: "#fcf5f5", border: `1px solid ${RBORDER}`, borderRadius: 4, padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 24px", fontSize: 14, fontFamily: F }}>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Số CV / Tờ trình : </span>
                <span style={{ color: daLaySo ? "#166534" : TEXT, fontWeight: daLaySo ? 700 : 400 }}>{daLaySo ? "05/TTr-TAND" : "32/CV-TAND"}</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Số thụ lý : </span>
                <span style={{ color: TEXT }}>32</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Đơn vị gửi : </span>
                <span style={{ color: TEXT }}>Tòa án nhân dân tỉnh Thanh Hóa</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Ngày CV : </span>
                <span style={{ color: TEXT }}>02/07/2026</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Ngày thụ lý : </span>
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
              <Input
                type="date"
                value={ngayLap}
                onChange={e => setNgayLap(e.target.value)}
                style={{ ...inSt, paddingRight: 36 }}
              />
              <Calendar size={18} color="#6b7280" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
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
            <Button
              onClick={onClose}
              style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 500 }}>
              Đóng
            </Button>

            {!isSaved ? (
              <Button
                onClick={handleSave}
                style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                Lưu
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setShowBieuMau(true)}
                  style={{ padding: "7px 16px", background: "#fff", color: "#0284c7", border: "1px solid #0284c7", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 600 }}>
                  Xem biểu mẫu
                </Button>

                <Button
                  onClick={handleKySoModal}
                  disabled={daKySo}
                  style={{
                    padding: "7px 16px",
                    background: daKySo ? "#d1fae5" : "#166534",
                    color: daKySo ? "#065f46" : "#fff",
                    border: daKySo ? "1px solid #6ee7b7" : "none",
                    borderRadius: 4,
                    cursor: daKySo ? "default" : "pointer",
                    fontSize: 14,
                    fontFamily: F,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                  {daKySo ? "✓ Đã ký số" : "Ký số"}
                </Button>

                <Button
                  onClick={handleToggleLaySo}
                  style={{ padding: "7px 16px", background: daLaySo ? "#fff" : "#1d4ed8", color: daLaySo ? "#dc2626" : "#fff", border: daLaySo ? "1px solid #fca5a5" : "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: 600 }}>
                  {daLaySo ? "Hủy lấy số" : "Lấy số"}
                </Button>

                {/* <Button
                  onClick={handleTrinhKyModalClick}
                  style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                  Trình ký
                </Button> */}
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
          <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, lineHeight: 1 }}>×</Button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
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

export function TabPlaceholder({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: MUTED, fontFamily: F }}>
      <FileText size={40} color="#d1d5db" />
      <span style={{ fontSize: 14 }}>{label} – Chưa có dữ liệu</span>
    </div>
  );
}

export function TaiLenToTrinhModal({ onClose, onUpload }: { onClose: () => void, onUpload: (fileName: string, petitions: string[]) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [petitions] = useState([
    { id: 1, name: "Đơn của Trần Văn A" },
    { id: 2, name: "Đơn của Lê Thị B" }
  ]);
  const [selectedPetitions, setSelectedPetitions] = useState<number[]>([]);

  const handleUpload = () => {
    if (!file) {
      alert("Vui lòng chọn file tờ trình!");
      return;
    }
    if (selectedPetitions.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn để đưa vào tờ trình!");
      return;
    }
    onUpload(file.name, petitions.filter(p => selectedPetitions.includes(p.id)).map(p => p.name));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1700, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 500, maxWidth: "95vw", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "8px 8px 0 0" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Tải lên Tờ trình</div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></Button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 8 }}>1. Chọn file tờ trình <span style={{color: RED}}>*</span></div>
            <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ width: "100%", padding: "8px", border: `1px dashed ${MUTED}`, borderRadius: 4, fontFamily: F, fontSize: 14 }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 8 }}>2. Chọn đơn đưa vào tờ trình <span style={{color: RED}}>*</span></div>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: 12, display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto" }}>
              {petitions.map(p => (
                <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: TEXT, cursor: "pointer" }}>
                  <Input
                    type="checkbox"
                    checked={selectedPetitions.includes(p.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedPetitions(prev => [...prev, p.id]);
                      else setSelectedPetitions(prev => prev.filter(id => id !== p.id));
                    }}
                    style={{ accentColor: "#2563eb", width: 16, height: 16, cursor: "pointer" }}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "14px 20px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "0 0 8px 8px" }}>
          <Button onClick={onClose} style={{ padding: "8px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>Hủy</Button>
          <Button onClick={handleUpload} style={{ padding: "8px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}><Upload size={14} /> Tải lên</Button>
        </div>
      </div>
    </div>
  );
}

export function CapNhatVongTrinhModal({
  fileName,
  onClose,
  onSave
}: {
  fileName: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [rounds, setRounds] = useState<Array<{ id: number; capTrinh: string; nguoiNhan: string }>>([]);
  const [petitions] = useState([
    { id: 1, name: "Đơn của Trần Văn A" },
    { id: 2, name: "Đơn của Lê Thị B" }
  ]);
  const [opinions, setOpinions] = useState<Record<string, string>>({});
  
  const [showThemVong, setShowThemVong] = useState(false);
  const [newCapTrinh, setNewCapTrinh] = useState("");
  const [newNguoiNhan, setNewNguoiNhan] = useState("");
  const [rutGon, setRutGon] = useState(false);

  const handleAddRound = () => {
    if (newCapTrinh && newNguoiNhan) {
      setRounds(prev => [...prev, { id: Date.now(), capTrinh: newCapTrinh, nguoiNhan: newNguoiNhan }]);
      setNewCapTrinh("");
      setNewNguoiNhan("");
      setShowThemVong(false);
    } else {
      alert("Vui lòng chọn Cấp trình và nhập Người được trình!");
    }
  };

  const setOpinion = (petitionId: number, roundId: number, val: string) => {
    setOpinions(prev => ({ ...prev, [`${petitionId}-${roundId}`]: val }));
  };

  const Y_KIEN_OPTIONS = ["", "Trả lời đơn", "Kháng nghị", "Không kháng nghị", "Rút kinh nghiệm", "Huỷ quyết định", "Xếp đơn", "VKS đang giải quyết", "Khác"];
  const CAP_TRINH_OPTIONS = ["", "Chánh án", "Phó Chánh án", "Vụ trưởng", "Phó Vụ trưởng", "Thẩm phán phụ trách", "Thẩm tra viên"];
  const NGUOI_NHAN_OPTIONS = ["", "Lê Văn Tòa", "Nguyễn Thị Án", "Trần Văn Luật", "Phạm Thị Pháp", "Lý Thái Phúc", "Nguyễn Biên Thuỳ"];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1700, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 850, maxWidth: "95vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "8px 8px 0 0" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Cập nhật vòng trình & ý kiến</div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
              Tài liệu: <span style={{ color: "#2563eb", fontWeight: 500 }}>{fileName}</span>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 14, color: "#0f172a", cursor: "pointer", userSelect: "none" }}>
              <Input type="checkbox" checked={rutGon} onChange={e => setRutGon(e.target.checked)} style={{ width: 15, height: 15, cursor: "pointer", accentColor: "#2563eb" }} />
              Giải quyết theo thủ tục rút gọn
            </label>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></Button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: BG }}>
                  <th style={{ ...TH_STYLE, width: 220, textAlign: "left", padding: "12px 16px", borderRight: `1px solid ${BORDER}` }}>
                    Tên Đơn
                  </th>
                  {rounds.map(r => (
                    <th key={r.id} style={{ ...TH_STYLE, textAlign: "left", padding: "12px 16px", borderRight: `1px solid ${BORDER}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: 2, fontSize: 14 }}>{r.capTrinh}</div>
                          <div style={{ fontWeight: 400, color: MUTED, fontSize: 14 }}>Người được trình: {r.nguoiNhan}</div>
                        </div>
                        <Button onClick={() => setRounds(prev => prev.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", color: RED, cursor: "pointer", padding: 2, display: "flex" }} title="Xóa vòng trình">
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </th>
                  ))}
                  <th style={{ ...TH_STYLE, width: 140, textAlign: "center", padding: "12px" }}>
                    {!showThemVong ? (
                      <Button onClick={() => setShowThemVong(true)} style={{ padding: "8px 12px", background: "#fff", color: "#2563eb", border: `1px dashed #2563eb`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%" }}>
                        <Plus size={14} /> Thêm vòng
                      </Button>
                    ) : (
                      <div style={{ textAlign: "left" }}>
                        <select value={newCapTrinh} onChange={e => setNewCapTrinh(e.target.value)} style={{ width: "100%", padding: "6px 8px", fontSize: 14, marginBottom: 4, borderRadius: 4, border: `1px solid ${BORDER}`, fontFamily: F }}>
                          <option value="" disabled>-- Cấp trình --</option>
                          {CAP_TRINH_OPTIONS.filter(Boolean).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <select value={newNguoiNhan} onChange={e => setNewNguoiNhan(e.target.value)} style={{ width: "100%", padding: "6px 8px", fontSize: 14, marginBottom: 6, borderRadius: 4, border: `1px solid ${BORDER}`, fontFamily: F, boxSizing: "border-box" }}>
                          <option value="" disabled>-- Người được trình --</option>
                          {NGUOI_NHAN_OPTIONS.filter(Boolean).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Button onClick={() => setShowThemVong(false)} style={{ flex: 1, padding: "6px", fontSize: 14, background: "#f1f5f9", border: "none", borderRadius: 4, cursor: "pointer" }}>Hủy</Button>
                          <Button onClick={handleAddRound} style={{ flex: 1, padding: "6px", fontSize: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Lưu</Button>
                        </div>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {petitions.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: idx < petitions.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top", padding: "16px", background: "#f8fafc", fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                      {p.name}
                    </td>
                    {rounds.map(r => (
                      <td key={r.id} style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top", padding: "12px" }}>
                        <select
                          value={opinions[`${p.id}-${r.id}`] || ""}
                          onChange={(e) => setOpinion(p.id, r.id, e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: F, outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
                        >
                          <option value="" disabled>-- Chọn ý kiến --</option>
                          {Y_KIEN_OPTIONS.filter(Boolean).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td style={{ ...TD_STYLE, verticalAlign: "top", padding: "12px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "14px 20px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "0 0 8px 8px" }}>
          <Button onClick={onClose} style={{ padding: "8px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>Hủy</Button>
          <Button onClick={onSave} style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>Hoàn tất</Button>
        </div>
      </div>
    </div>
  );
}
