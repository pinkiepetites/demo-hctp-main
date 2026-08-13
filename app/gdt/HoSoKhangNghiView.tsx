import React, { useState } from "react";
import {
  Search, Eye, ChevronDown, RotateCcw, X, Save,
  FileText, CheckCircle2, Send, FileSpreadsheet, FolderCheck,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";

// ── Modal Trả hồ sơ ───────────────────────────────────────────────────────────
function ModalTraHoSo({ onClose, onConfirm }: { onClose: () => void; onConfirm: (lyDo: string) => void }) {
  const [ngayThaoTac, setNgayThaoTac] = useState("07/08/2026");
  const [canBo, setCanBo] = useState("Lý Thái Phúc");
  const [lyDo, setLyDo] = useState("");

  const handleConfirmTra = () => {
    if (!lyDo.trim()) {
      alert("Vui lòng nhập lý do trả hồ sơ!");
      return;
    }
    onConfirm(lyDo);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontFamily: F }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Trả lại hồ sơ kháng nghị đến
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
          <button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Trình ký Lãnh đạo ───────────────────────────────────────────────────
function ModalTrinhKy({ record, onClose }: { record?: any; onClose: () => void }) {
  const [nguoiKy, setNguoiKy] = useState("Chu Thị Thu Hiền");
  const [mucDoUuTien, setMucDoUuTien] = useState("Bình thường");
  const [noiDungKy, setNoiDungKy] = useState("");

  const handleSubmit = () => {
    alert(`Đã gửi trình duyệt ký thành công cho ${nguoiKy}!`);
    onClose();
  };

  const darkRed = "#700000";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 620, maxWidth: "92vw", padding: 28, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#222222", fontFamily: F }}>
            Nhập thông tin trình ký
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", fontSize: 13, fontFamily: F }}>
            close
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Người ký văn bản
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={nguoiKy}
                onChange={e => setNguoiKy(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6,
                  fontFamily: F, color: "#222222", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Chu Thị Thu Hiền">Chu Thị Thu Hiền</option>
                <option value="Nguyễn Văn Dũng">Nguyễn Văn Dũng</option>
                <option value="Phạm Văn Hải - Chánh án TAND thành phố Hà Nội">Phạm Văn Hải - Chánh án TAND thành phố Hà Nội</option>
                <option value="Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự">Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự</option>
                <option value="Lê Hoàng Nam - Trưởng phòng">Lê Hoàng Nam - Trưởng phòng</option>
              </select>
              <ChevronDown size={18} color="#666666" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Mức độ ưu tiên
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={mucDoUuTien}
                onChange={e => setMucDoUuTien(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6,
                  fontFamily: F, color: "#222222", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Thấp">Thấp</option>
              </select>
              <ChevronDown size={18} color="#666666" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Nội dung trình duyệt ký
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                value={noiDungKy}
                onChange={e => setNoiDungKy(e.target.value)}
                placeholder="Nhập nội dung trình duyệt ký"
                maxLength={4000}
                style={{
                  width: "100%", padding: "12px 14px", paddingBottom: 32, fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6, fontFamily: F,
                  minHeight: 120, boxSizing: "border-box", outline: "none", resize: "vertical"
                }}
              />
              <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 12, color: "#888888", fontFamily: F }}>
                {noiDungKy.length} / 4000
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 28px", background: darkRed, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Trình ký
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 28px", background: "#fff", color: "#222222",
              border: "1px solid #cccccc", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Modal Tạo biểu mẫu công văn ───────────────────────────────────────────────
function ModalTaoCongVan({ record, onClose, onConfirm }: { record?: any; onClose: () => void; onConfirm: (config: any) => void }) {
  const getInitialDonViNhan = () => {
    if (!record) return "Viện kiểm sát nhân dân thành phố Hà Nội";
    const toaRA = record.toaRaBanAn || "";
    const dvNhan = record.donViNhan || "";
    if (toaRA.toLowerCase().includes("tỉnh") || dvNhan.toLowerCase().includes("tỉnh")) {
      return dvNhan.toLowerCase().includes("tỉnh") ? dvNhan : "Tòa án nhân dân khu vực 5 - Hà Nội";
    }
    return "Viện kiểm sát nhân dân thành phố Hà Nội";
  };

  const [loaiVanBan, setLoaiVanBan] = useState("Phiếu chuyển đơn");
  const [donViNhan, setDonViNhan] = useState(getInitialDonViNhan());
  const [toaGiuHoSo, setToaGiuHoSo] = useState(record?.toaGiuHoSo || "Tòa án nhân dân thành phố Hà Nội");
  const [duongSu, setDuongSu] = useState(record?.nguoiKhieuNai ? `${record.nguoiKhieuNai}` : "bà Đặng Thị Dương");
  const [noiDung, setNoiDung] = useState(record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại.");

  const getVuSuffix = () => {
    const l = (record?.loaiAn || "").toLowerCase();
    const dv = (donViNhan || "").toLowerCase();
    const ba = (record?.soBA || "").toLowerCase();

    if (dv.includes("vụ 1") || dv.includes("vụ i") || l.includes("hình sự") || ba.includes("hs")) return "Vụ 1";
    if (dv.includes("vụ 2") || dv.includes("vụ ii") || l.includes("dân sự") || ba.includes("ds")) return "Vụ 2";
    if (dv.includes("vụ 3") || dv.includes("vụ iii") || l.includes("thương mại") || l.includes("kdtm") || l.includes("hôn nhân") || l.includes("gia đình") || l.includes("lao động") || ba.includes("kdtm") || ba.includes("hngđ") || ba.includes("lđ")) return "Vụ 3";
    if (dv.includes("vụ 4") || dv.includes("vụ iv") || l.includes("hành chính") || ba.includes("hc")) return "Vụ 4";

    return "Vụ 1";
  };

  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);

  const vuSuffixCurrent = getVuSuffix();
  const hậuTốVuModal = `TAND thành phố Hà Nội - ${vuSuffixCurrent}`;
  const soCongVanModal = hasNumber ? `05/${hậuTốVuModal}` : `.../${hậuTốVuModal}`;

  const handleSave = () => {
    setIsSaved(true);
    alert("Đã lưu biểu mẫu công văn thành công! Bạn có thể thực hiện Trình ký, Lấy số hoặc Xem biểu mẫu.");
  };

  const handleToggleCapSo = () => {
    if (hasNumber) {
      setHasNumber(false);
      alert("Đã hủy cấp số công văn.");
    } else {
      setHasNumber(true);
      alert(`Đã tự động cấp số công văn: ${soCongVanModal}`);
    }
  };

  const handleXemBiêuMau = () => {
    onConfirm({
      loaiVanBan,
      donViNhan,
      toaGiuHoSo,
      nguoiKhieuNai: duongSu,
      noiDungDon: noiDung,
      hasNumber,
      soCongVan: soCongVanModal,
      ...record
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 580, maxWidth: "92vw", padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Tạo biểu mẫu công văn
            </span>
            {isSaved && (
              <span style={{ fontSize: 11, background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                ✓ Đã lưu biểu mẫu
              </span>
            )}
            {hasNumber && (
              <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                🔢 Số: 05/TAHN - Tòa Hình sự
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tên loại văn bản / biểu mẫu *</label>
            <select value={loaiVanBan} onChange={e => setLoaiVanBan(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fff", color: TEXT, boxSizing: "border-box" }}>
              <option value="Phiếu chuyển đơn">Phiếu chuyển (Công văn chuyển)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 600 }}>Đơn vị nhận *</label>
              <span style={{ fontSize: 11, color: "#1a73e8", fontFamily: F, fontStyle: "italic" }}>(Tự động lấy từ Quyết định kháng nghị)</span>
            </div>
            <select
              value={donViNhan}
              onChange={e => setDonViNhan(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fafafa", color: TEXT, boxSizing: "border-box" }}>
              <option value="Viện kiểm sát nhân dân thành phố Hà Nội">Viện kiểm sát nhân dân thành phố Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 5 - Hà Nội">Tòa án nhân dân khu vực 5 - Hà Nội</option>
              <option value="Tòa án nhân dân TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 2 - Hà Nội">Tòa án nhân dân khu vực 2 - Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 4 - Hà Nội">Tòa án nhân dân khu vực 4 - Hà Nội</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tòa án giữ hồ sơ</label>
              <input value={toaGiuHoSo} onChange={e => setToaGiuHoSo(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Đương sự</label>
              <input value={duongSu} onChange={e => setDuongSu(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Nội dung đơn</label>
            <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={3} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Footer Buttons Workflow */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          {!isSaved ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#27ae60", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Save size={15} /> Lưu biểu mẫu
              </button>
              <button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Eye size={15} /> Xem biểu mẫu
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 16px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                Đóng
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowTrinhKy(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Trình ký
              </button>

              <button
                onClick={handleToggleCapSo}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  background: hasNumber ? "#c0392b" : "#7c3aed",
                  color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                {hasNumber ? "Hủy cấp số" : "Lấy số"}
              </button>

              <button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#555555", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Xem biểu mẫu
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                ✖ Đóng
              </button>
            </>
          )}
        </div>

        {/* Modal Trình ký Lãnh đạo */}
        {showTrinhKy && <ModalTrinhKy record={record} onClose={() => setShowTrinhKy(false)} />}
      </div>
    </div>
  );
}

// ── Modal Nhận hồ sơ kháng nghị ───────────────────────────────────────────────
function ModalNhanHoSoKhangNghi({
  record,
  onClose,
  onConfirm,
}: {
  record: any;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const rec = record || {
    maDon: "KN-DEN-001",
    soKhangNghi: "08/2026/QĐKN",
    ngayKhangNghi: "03/07/2026",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
    soBA: "236/2026/HS-PT",
    ngayBA: "03/07/2026",
    toaRaBanAn: "TAND khu vực 4 - Hà Nội",
    loaiAn: "Hình sự",
    nguoiKhieuNai: "Nguyễn Văn Bình",
    donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
    trangThai: "Chờ nhận",
  };

  const taiLieuList = [
    { stt: 1, ten: `Quyết định kháng nghị số ${rec.soKhangNghi || "08/2026/QĐKN"}`, loai: "Quyết định", ngay: rec.ngayKhangNghi || "03/07/2026", soTrang: 6, ghiChu: "Đã đóng dấu ký số" },
    { stt: 2, ten: `Bản án sơ thẩm/phúc thẩm số ${rec.soBA || "236/2026/HS-PT"}`, loai: "Bản án", ngay: rec.ngayBA || "03/07/2026", soTrang: 28, ghiChu: "Bản chính" },
    { stt: 3, ten: "Tờ trình đề nghị kháng nghị giám đốc thẩm", loai: "Tờ trình", ngay: "01/07/2026", soTrang: 8, ghiChu: "Bản gốc" },
    { stt: 4, ten: "Biên bản kiểm tra hồ sơ vụ án hình sự", loai: "Biên bản", ngay: "02/07/2026", soTrang: 4, ghiChu: "Kèm theo" },
    { stt: 5, ten: "Hồ sơ, chứng cứ đính kèm quyết định kháng nghị", loai: "Chứng cứ", ngay: "03/07/2026", soTrang: 52, ghiChu: "Tệp đính kèm" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 860, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", overflow: "hidden", fontFamily: F }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={18} color="#1a5a96" />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin hồ sơ kháng nghị đến</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={18} />
          </button>
        </div>

        {/* Content - Chia 2 cột */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* CỘT TRÁI: Thông tin chính hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", height: "fit-content" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase", fontFamily: F }}>
                📌 Thông tin hồ sơ kháng nghị
              </span>
              <Badge color={rec.trangThai?.includes("Đã") ? "#1b5e20" : "#8a6d00"} bg={rec.trangThai?.includes("Đã") ? "#e8f5e9" : "#fff8e1"}>
                {rec.trangThai || "Chờ nhận"}
              </Badge>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "38%" }}>Số – Ngày QĐ kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: RED, fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soKhangNghi || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayKhangNghi || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Người kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhangNghi || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#1a73e8", fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soBA || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayBA || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.toaRaBanAn || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.loaiAn || "Hình sự"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đương sự / Người KN</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhieuNai || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Đơn vị gửi</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT }}>{rec.donViGui || "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CỘT PHẢI: Bảng danh sách tài liệu của hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>
                📑 Danh sách tài liệu kèm theo ({taiLieuList.length})
              </span>
            </div>
            <div style={{ overflowX: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: BG }}>
                    {["STT", "TÊN TÀI LIỆU", "LOẠI", "TRANG", "THAO TÁC"].map((h, i) => (
                      <th key={h} style={{ ...TH_STYLE, fontSize: 11, padding: "8px 10px", width: i === 0 ? 36 : i === 1 ? "45%" : undefined }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taiLieuList.map((d, i) => (
                    <tr key={d.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: "#1a73e8", fontWeight: 500 }}>📄 {d.ten}</td>
                      <td style={{ ...TD_STYLE, fontSize: 11 }}>
                        <span style={{ padding: "2px 6px", borderRadius: 10, background: "#f5f5f5", color: "#333333", fontWeight: 500 }}>{d.loai}</span>
                      </td>
                      <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, textAlign: "center" }}>{d.soTrang}</td>
                      <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, textAlign: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5a96", display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11 }} title="Xem tài liệu">
                          <Eye size={12} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fafafa", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "7px 24px", background: "#1a5a96", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <CheckCircle2 size={14} /> Xác nhận nhận hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── WordEditorView (Biểu mẫu Word Editor) ────────────────────────────────────
export function WordEditorView({ onBack, record }: { onBack: () => void; record?: any }) {
  const [fontSize, setFontSize] = useState("13pt");
  const [zoom, setZoom] = useState(100);
  const [activeDocType, setActiveDocType] = useState<"bao-cao-danh-sach" | "quyet-dinh-khang-nghi" | "cong-van-chuyen">(record?.isBaoCao ? "bao-cao-danh-sach" : "cong-van-chuyen");

  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);

  const toaGiuHoSo = record?.toaGiuHoSo || "Tòa án nhân dân thành phố Hà Nội";
  const donViToaAnCap = record?.capToaAn || "TỐI CAO";

  const getVuSuffixByRecord = (loaiAn?: string, soBA?: string, donViNhan?: string) => {
    const l = (loaiAn || "").toLowerCase();
    const dv = (donViNhan || "").toLowerCase();
    const ba = (soBA || "").toLowerCase();

    if (dv.includes("vụ 1") || dv.includes("vụ i") || l.includes("hình sự") || ba.includes("hs")) return "Vụ 1";
    if (dv.includes("vụ 2") || dv.includes("vụ ii") || l.includes("dân sự") || ba.includes("ds")) return "Vụ 2";
    if (dv.includes("vụ 3") || dv.includes("vụ iii") || l.includes("thương mại") || l.includes("kdtm") || l.includes("hôn nhân") || l.includes("gia đình") || l.includes("lao động") || ba.includes("kdtm") || ba.includes("hngđ") || ba.includes("lđ")) return "Vụ 3";
    if (dv.includes("vụ 4") || dv.includes("vụ iv") || l.includes("hành chính") || ba.includes("hc")) return "Vụ 4";

    return "Vụ 1";
  };

  const vuSuffix = getVuSuffixByRecord(record?.loaiAn, record?.soBA, record?.donViNhan);
  const hậuTốVu = `TAND thành phố Hà Nội - ${vuSuffix}`;
  const soCongVan = hasNumber ? `05/${hậuTốVu}` : `.../${hậuTốVu}`;

  const getDecisionSuffix = (loaiAn?: string, soBA?: string) => {
    const l = (loaiAn || "").toLowerCase();
    const ba = (soBA || "").toLowerCase();

    if (l.includes("hình sự") || ba.includes("hs")) return "KN-HS";
    if (l.includes("hành chính") || ba.includes("hc")) return "KN-HC";
    if (l.includes("thương mại") || l.includes("kdtm") || ba.includes("kdtm") || l.includes("kinh doanh")) return "KN-KDTM";
    if (l.includes("hôn nhân") || l.includes("hngđ") || ba.includes("hngđ") || l.includes("gia đình")) return "KN-HNGĐ";
    if (l.includes("lao động") || ba.includes("lđ")) return "KN-LĐ";
    if (l.includes("dân sự") || ba.includes("ds")) return "KN-DS";

    return "KN-DS";
  };

  const suffixKN = getDecisionSuffix(record?.loaiAn, record?.soBA);
  const rawSoKN = record?.soKhangNghi || "28/2026/KN-DS";
  const soQDKNFormatted = rawSoKN.includes("KN-")
    ? rawSoKN.replace(/KN-[A-ZĐGH]+/, suffixKN)
    : rawSoKN.includes("/")
      ? `${rawSoKN.split('/')[0]}/${rawSoKN.split('/')[1] || "2026"}/${suffixKN}`
      : `28/2026/${suffixKN}`;

  const diaDanh = "Hà Nội";
  const ngayChuyenText = record?.ngayChuyenText || "ngày 26 tháng 01 năm 2026";

  const donViNhan = record?.donViNhan || "Viện kiểm sát nhân dân thành phố Hà Nội";
  const tenDuongSu = record?.nguoiKhieuNai || "bà Đặng Thị Dương";
  const diaChiDuongSu = record?.diaChiDuongSu || "(SĐT: 0944.808.080) 190 Nguyễn Văn Hưởng, phường An Khánh, Thành phố Hồ Chí Minh";
  const ngayDeDon = record?.ngayDeDon || "17/10/2025";
  const noiDungDon = record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại. Đề nghị Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội có ý kiến chỉ đạo, giải quyết đơn khiếu nại của ông.";
  const vietTatDonVi = "TAND thành phố Hà Nội";

  const handleSaveForm = () => {
    setIsSaved(true);
    alert(`Đã lưu biểu mẫu ${activeDocType === "cong-van-chuyen" ? "Công văn chuyển" : "Quyết định kháng nghị"} thành công! Bạn có thể thực hiện Trình ký hoặc Lấy số.`);
  };

  const handleToggleCapSo = () => {
    if (hasNumber) {
      setHasNumber(false);
      alert("Đã hủy cấp số công văn.");
    } else {
      setHasNumber(true);
      alert(`Đã tự động lấy số công văn thành công!\nSố công văn được cấp: 05/${hậuTốVu}`);
    }
  };

  const handleTrinhKy = () => {
    setShowTrinhKyModal(true);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "5px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 5
  };

  const selectSt: React.CSSProperties = {
    padding: "5px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 20, background: BORDER, margin: "0 4px"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "hidden", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị › <b style={{ color: TEXT }}>
              Biểu mẫu {activeDocType === "cong-van-chuyen" ? "PHIẾU CHUYỂN ĐƠN" : "QUYẾT ĐỊNH KHÁNG NGHỊ"} (Word Editor)
            </b>
          </div>
          {isSaved && (
            <span style={{ fontSize: 11, background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              ✓ Đã lưu biểu mẫu
            </span>
          )}
          {hasNumber && (
            <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              🔢 Số: {activeDocType === "cong-van-chuyen" ? `05/${hậuTốVu}` : soQDKNFormatted}
            </span>
          )}
          {isSubmitted && (
            <span style={{ fontSize: 11, background: "#e8f4ff", color: "#1a5a96", border: "1px solid #a8cdf0", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              📩 Đã trình ký
            </span>
          )}
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Quay lại
          </button>

          {!isSaved ? (
            <button onClick={handleSaveForm} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 20px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
              <Save size={14} /> Lưu biểu mẫu
            </button>
          ) : (
            <>
              <button onClick={handleTrinhKy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <Send size={14} /> Trình ký
              </button>
              <button onClick={handleToggleCapSo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: hasNumber ? "#c0392b" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {hasNumber ? "❌ Hủy cấp số" : "🔢 Lấy số"}
              </button>
              <button onClick={() => setShowPreviewModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#555555", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                <Eye size={14} /> Xem biểu mẫu
              </button>
              <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                ✖ Đóng
              </button>
            </>
          )}
        </div>
      </div>

      {/* Word Ribbon Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap", fontSize: 12 }}>
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác (Ctrl+Z)">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại (Ctrl+Y)">↪ Làm lại</button>
        <div style={sepSt} />

        <select onChange={(e) => execCmd("fontName", e.target.value)} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select onChange={(e) => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="14pt">14 pt</option>
          <option value="16pt">16 pt</option>
          <option value="18pt">18 pt</option>
        </select>
        <div style={sepSt} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm (Ctrl+B)"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng (Ctrl+I)"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân (Ctrl+U)"><u>U</u></button>
        <button onClick={() => execCmd("strikeThrough")} style={tbBtnSt} title="Gạch ngang"><s>S</s></button>
        <div style={sepSt} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅ Căn trái</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔ Căn giữa</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡ Căn phải</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều 2 bên">☰ Căn đều</button>
        <div style={sepSt} />

        <button onClick={() => execCmd("insertUnorderedList")} style={tbBtnSt} title="Danh sách chấm">• Danh sách</button>
        <button onClick={() => execCmd("insertOrderedList")} style={tbBtnSt} title="Danh sách số">1. Danh sách</button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Tỷ lệ xem:</span>
          <button onClick={() => setZoom(z => Math.max(70, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 700, color: TEXT }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#cccccc" }}>
        <div style={{ width: 260, background: "#fafafa", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: TEXT, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={RED} /> DANH SÁCH VĂN BẢN
          </div>

          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {record?.isBaoCao && (
              <div
                onClick={() => setActiveDocType("bao-cao-danh-sach")}
                style={{
                  padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                  background: activeDocType === "bao-cao-danh-sach" ? "#e8f4ff" : "#fff",
                  border: activeDocType === "bao-cao-danh-sach" ? "1px solid #1a73e8" : `1px solid ${BORDER}`,
                  boxShadow: activeDocType === "bao-cao-danh-sach" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s"
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: activeDocType === "bao-cao-danh-sach" ? "#1a5a96" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                  📊 Báo cáo danh sách
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                  {record?.tabLabel || "Danh sách vụ án / đơn"}
                </div>
              </div>
            )}

            <div
              onClick={() => setActiveDocType("quyet-dinh-khang-nghi")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "quyet-dinh-khang-nghi" ? "#e8f4ff" : "#fff",
                border: activeDocType === "quyet-dinh-khang-nghi" ? "1px solid #1a73e8" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "quyet-dinh-khang-nghi" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: activeDocType === "quyet-dinh-khang-nghi" ? "#1a5a96" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Quyết định kháng nghị
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                Biểu mẫu QĐ Kháng nghị GĐT
              </div>
            </div>

            <div
              onClick={() => setActiveDocType("cong-van-chuyen")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "cong-van-chuyen" ? "#e8f4ff" : "#fff",
                border: activeDocType === "cong-van-chuyen" ? "1px solid #1a73e8" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "cong-van-chuyen" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: activeDocType === "cong-van-chuyen" ? "#1a5a96" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Công văn chuyển
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                Biểu mẫu Phiếu chuyển đơn
              </div>
            </div>
          </div>
        </div>

        {/* Right Editable Word Canvas Container */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px 60px 20px", gap: 32 }}>

          {activeDocType === "bao-cao-danh-sach" ? (
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 820,
                minHeight: 1100,
                padding: "50px 60px 60px 60px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: fontSize,
                color: "#000",
                lineHeight: 1.5,
                outline: "none",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                position: "relative",
                boxSizing: "border-box",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ textAlign: "center", width: "46%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                  <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                </div>

                <div style={{ textAlign: "center", width: "52%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                    Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, margin: "24px 0 6px 0", letterSpacing: 0.5 }}>
                BÁO CÁO DANH SÁCH {record?.tabLabel?.toUpperCase() || "ĐƠN VÀ THỤ LÝ VỤ ÁN"}
              </div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>
                (Thời gian xuất báo cáo: {new Date().toLocaleDateString("vi-VN")})
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 16 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", width: 36, textAlign: "center" }}>STT</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Thông tin đơn / Thụ lý</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Đương sự</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Bản án / Quyết định</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Thẩm phán / Công chức</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Ghi chú / Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {(record?.cases && record.cases.length > 0 ? record.cases : [
                    { maDon: "6966", nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hảo", soBA: "CVKN_GDT", ngayBA: "20/07/2026", toa: "TAND CC Hà Nội", thamPhan: "Nguyễn Biên Thùy", ttv: "Lý Thái Phúc" },
                    { maDon: "6967", nguoiKhieuNai: "Trần Văn Hòa", biCao: "Nguyễn Thị Lan", soBA: "123/2026/DS-ST", ngayBA: "21/07/2026", toa: "TAND khu vực 5 - Hà Nội", thamPhan: "Trần Minh Đức", ttv: "Vũ Diệu Thúy" }
                  ]).map((c: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "center" }}>{idx + 1}</td>
                      <td style={{ border: "1px solid #000", padding: "6px 8px" }}>
                        <b>Mã đơn:</b> {c.maDon || c.maVanThuDen || c.id}<br />
                        {c.soCV && <span>CV: {c.soCV}<br /></span>}
                        {c.thuLyMoi && <span>TL mới: {c.thuLyMoi}</span>}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px 8px" }}>
                        {c.nguoiKhieuNai && <div><b>NKN/NĐ:</b> {c.nguoiKhieuNai}</div>}
                        {c.biCao && <div><b>Bị cáo/BĐ:</b> {c.biCao}</div>}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px 8px" }}>
                        {c.soBA && <div><b>Số BA:</b> {c.soBA}</div>}
                        {c.ngayBA && <div><b>Ngày:</b> {c.ngayBA}</div>}
                        {c.toa && <div><b>Tòa:</b> {c.toa}</div>}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px 8px" }}>
                        {c.thamPhan && <div><b>TP:</b> {c.thamPhan}</div>}
                        {c.ttv && <div><b>Công chức:</b> {c.ttv}</div>}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px 8px" }}>
                        {c.lyDoTraLai || c.yKienLD?.[0]?.name || "Đã lưu hồ sơ"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, pageBreakInside: "avoid" }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ fontWeight: 700 }}>NGƯỜI LẬP BÁO CÁO</div>
                  <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký, ghi rõ họ tên)</div>
                  <div style={{ height: 60 }} />
                </div>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ fontWeight: 700 }}>LÃNH ĐẠO VỤ PHÊ DUYỆT</div>
                  <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký, đóng dấu)</div>
                  <div style={{ height: 60 }} />
                </div>
              </div>
            </div>
          ) : activeDocType === "cong-van-chuyen" ? (
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 780,
                minHeight: 1050,
                padding: "60px 72px 70px 72px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: fontSize,
                color: "#000",
                lineHeight: 1.6,
                outline: "none",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                position: "relative",
                boxSizing: "border-box",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                <div style={{ textAlign: "center", width: "46%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                  <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soCongVan}</span>
                  </div>
                </div>

                <div style={{ textAlign: "center", width: "52%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                    {diaDanh}, {ngayChuyenText}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, margin: "32px 0 24px 0", letterSpacing: 0.5 }}>
                PHIẾU CHUYỂN ĐƠN
              </div>

              <div style={{ textIndent: 30, marginBottom: 16 }}>
                Kính gửi: <b>{donViNhan}</b>
              </div>

              <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 16 }}>
                <b>{toaGiuHoSo}</b> nhận được đơn của <b>{tenDuongSu}</b> {diaChiDuongSu} đề ngày {ngayDeDon} {noiDungDon}
              </div>

              <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 40 }}>
                Sau khi nghiên cứu đơn, <b>{toaGiuHoSo}</b> chuyển đơn nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền./.
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
                <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                  <div>- Như kính gửi;</div>
                  <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                  <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                  <div>- {tenDuongSu} (để biết);</div>
                  <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                </div>

                <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                  <div>TL. CHÁNH ÁN</div>
                  <div>KT. CHÁNH VĂN PHÒNG</div>
                  <div>PHÓ CHÁNH VĂN PHÒNG</div>
                  <div style={{ height: 75 }} />
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#666666", fontFamily: F, fontWeight: 600 }}>
                Trang 1 / 1
              </div>
            </div>
          ) : (
            <>
              {/* ── TRANG 1 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1050,
                  padding: "54px 72px 60px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.55,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "46%" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                    <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      Số: <span style={{ background: "#e0e7ff", padding: "1px 4px", fontWeight: 700 }}>{soQDKNFormatted}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                      Hà Nội, ngày 07 tháng 4 năm 2026
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", margin: "18px 0 14px 0" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>QUYẾT ĐỊNH</div>
                  <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>KHÁNG NGHỊ GIÁM ĐỐC THẨM</div>
                  <div style={{ fontSize: 13, fontStyle: "italic", marginTop: 4 }}>
                    Đối với Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023<br />của Tòa án nhân dân tỉnh Kiên Giang
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>
                    CHÁNH ÁN TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI
                  </div>
                </div>

                <div style={{ textAlign: "justify", marginBottom: 6 }}>
                  Căn cứ Điều 326, khoản 1 Điều 331, khoản 2 Điều 332 Bộ luật Tố tụng dân sự năm 2015 (sửa đổi, bổ sung theo Luật số 85/2025/QH15);
                </div>
                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  Căn cứ khoản 1 Điều 3 Nghị quyết số 225/2025/QH15;
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  Sau khi nghiên cứu hồ sơ vụ án dân sự “Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất và đòi lại đất” giữa các đương sự:
                </div>

                <div style={{ marginBottom: 10, paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700 }}>- Nguyên đơn:</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>1. Bà Lâm Thị Đèo, sinh năm 1955; cư trú tại: Ấp Bãi Chướng, đặc khu Phú Quốc, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>2. Ông Lâm Thành Thủ, sinh năm 1969; cư trú tại: Ấp Minh Phong, xã Bình An, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>3. Ông Lâm Thành Thủy, sinh năm 1976; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>4. Ông Lâm Thành Sự, sinh năm 1978; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>5. Bà Nguyễn Thị Mỹ, sinh năm 1961; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>6. Bà Lâm Thị Kim Ngọc, sinh năm 1990; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, Thành phố Hà Nội.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>7. Ông Lâm Minh Ngoan, sinh năm 1995; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, Thành phố Hà Nội.</div>
                </div>

                <div style={{ marginBottom: 10, paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700 }}>- Bị đơn:</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>Ông Vũ Thành Đô, sinh năm 1958; cư trú tại: Ấp An Phú, đặc khu Kiên Hải, Thành phố Hà Nội.</div>
                </div>

                <div style={{ position: "absolute", bottom: 18, right: 30, fontSize: 11, color: "#666666", fontFamily: F, fontWeight: 600 }}>
                  Trang 1 / 3
                </div>
              </div>

              {/* ── TRANG 2 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1050,
                  padding: "54px 72px 60px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.55,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #cccccc", paddingBottom: 6, marginBottom: 16, fontSize: 11, color: "#666666" }}>
                  <span>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</span>
                  <span>Số: {soQDKNFormatted}</span>
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "8px 0 10px 0" }}>
                  NHẬN THẤY:
                </div>

                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tại Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023, Tòa án nhân dân tỉnh Kiên Giang quyết định chấp nhận yêu cầu khởi kiện của các nguyên đơn, tuyên bố hợp đồng chuyển nhượng quyền sử dụng đất lập ngày 30/8/1998 giữa cụ Nguyễn Thị Năm với ông Vũ Thành Đô là vô hiệu, buộc ông Vũ Thành Đô trả lại 1.500m² đất và bồi hoàn thành quả lao động...
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "12px 0 10px 0" }}>
                  XÉT THẤY:
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[1].</b> Phần đất đang tranh chấp theo đo đạc thực tế có diện tích 2.159,4m² (gồm 03 thửa: thửa số 01 là 700,8m², thửa số 02 là 713m² và thửa số 03 là 745,6m²) tại ấp An Cư, xã An Sơn, huyện Kiên Hải. Nguồn gốc đất do cụ Lâm Văn Tư và cụ Nguyễn Thị Năm khai khẩn, trồng cây từ năm 1990 nhưng chưa kê khai đăng ký cấp Giấy chứng nhận quyền sử dụng đất. Do đó có cơ sở xác định bản chất của giao dịch ngày 30/8/1998 giữa cụ Năm và ông Đô là chuyển nhượng quyền sử dụng đất nhưng chưa đủ điều kiện chuyển nhượng theo quy định Luật Đất đai 1993, giao dịch vô hiệu.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[2].</b> Việc ông Đô chuyển nhượng diện tích đất cho ông Trần Minh Lợi ngày 15/9/2016 khi chưa được cấp Giấy chứng nhận quyền sử dụng đất đã vi phạm khoản 1 Điều 168 Luật Đất đai 2013 nên vô hiệu theo quy định tại Điều 117, Điều 123 Bộ luật Dân sự 2015.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[3].</b> Theo các văn bản xác minh của UBND huyện Kiên Hải, phần đất tranh chấp thuộc phạm vi quy hoạch rừng phòng hộ theo Quyết định số 4041/QĐ-UB ngày 31/12/1998; đến năm 2012 được đưa ra khỏi quy hoạch nhưng chưa được Nhà nước giao, cho thuê hoặc công nhận quyền sử dụng cho bất kỳ tổ chức, cá nhân nào. Do đó, phần đất tranh chấp thuộc quỹ đất do Nhà nước thống nhất quản lý theo Điều 4, Điều 5, Điều 59 Luật Đất đai 2013.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 16 }}>
                  <b>[4].</b> Tòa án cấp sơ thẩm và cấp phúc thẩm xác định giao dịch vô hiệu nhưng chưa có ý kiến của cơ quan nhà nước có thẩm quyền về quản lý đất đai là không đúng pháp luật. Cần thiết phải hủy Bản án phúc thẩm và sơ thẩm để giải quyết lại vụ án theo đúng quy định.
                </div>

                <div style={{ fontStyle: "italic", textAlign: "right", marginBottom: 12 }}>
                  Vì các lẽ trên;
                </div>

                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#666666", fontFamily: F, fontWeight: 600 }}>
                  Trang 2 / 3
                </div>
              </div>

              {/* ── TRANG 3 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1020,
                  padding: "60px 72px 70px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.6,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", paddingBottom: 8, marginBottom: 20, fontSize: 11, color: "#666666" }}>
                  <span>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</span>
                  <span>Số: {soQDKNFormatted}</span>
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "10px 0 16px 0" }}>
                  QUYẾT ĐỊNH:
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>1.</b> Kháng nghị Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang về vụ án “Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất và đòi lại đất” giữa nguyên đơn là bà Lâm Thị Đèo, ông Lâm Thành Thủ, ông Lâm Thành Thủy... với bị đơn ông Vũ Thành Đô và 05 người có quyền lợi, nghĩa vụ liên quan.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>2.</b> Đề nghị Ủy ban Thẩm phán Tòa án nhân dân thành phố Hà Nội xét xử giám đốc thẩm, hủy Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang và hủy Bản án dân sự sơ thẩm số 10/2022/DSST ngày 15/6/2022 của Tòa án nhân dân huyện Kiên Hải, tỉnh Kiên Giang; giao hồ sơ vụ án cho Tòa án nhân dân khu vực 1 - Hà Nộilại theo thủ tục sơ thẩm đúng quy định của pháp luật.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 44 }}>
                  <b>3.</b> Tạm đình chỉ thi hành Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang cho đến khi có Quyết định giám đốc thẩm.
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                  <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                    <div>- Chánh án TAND thành phố Hà Nội (để báo cáo);</div>
                    <div>- Vụ 9 - VKSND thành phố Hà Nội (kèm hồ sơ vụ án);</div>
                    <div>- TAND khu vực 2 - Hà Nội;</div>
                    <div>- TAND khu vực 1 - Hà Nội</div>
                    <div>- Phòng THADS khu vực 1 - Hà Nội;</div>
                    <div>- Các đương sự (theo địa chỉ);</div>
                    <div>- Thẩm phán TAND thành phố Hà Nội Đào Thị Minh Thủy;</div>
                    <div>- Lưu: TK Phó Chánh án, VT, Tòa Dân sự (03 bản).</div>
                  </div>

                  <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                    <div>KT. CHÁNH ÁN</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 75 }} />
                    <div style={{ textDecoration: "underline" }}>Nguyễn Văn Tiến</div>
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#666666", fontFamily: F, fontWeight: 600 }}>
                  Trang 3 / 3
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showPreviewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 800, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", fontFamily: F, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
                👁️ Xem trước văn bản PHIẾU CHUYỂN ĐƠN
              </span>
              <button onClick={() => setShowPreviewModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={MUTED} /></button>
            </div>

            <div style={{ flex: 1, padding: 30, background: "#cccccc", overflowY: "auto", display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#fff", width: "100%", maxWidth: 680, padding: "40px 50px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontFamily: "'Times New Roman', Times, serif", fontSize: 13, color: "#000", lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "46%" }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                    <div style={{ width: 80, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>Số: <b>{soCongVan}</b></div>
                  </div>
                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 140, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>{diaDanh}, {ngayChuyenText}</div>
                  </div>
                </div>

                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, margin: "24px 0 18px 0" }}>PHIẾU CHUYỂN ĐƠN</div>
                <div style={{ textIndent: 30, marginBottom: 12 }}>Kính gửi: <b>{donViNhan}</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 12 }}><b>{toaGiuHoSo}</b> nhận được đơn của <b>{tenDuongSu}</b> {diaChiDuongSu} đề ngày {ngayDeDon} {noiDungDon}</div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 28 }}>Sau khi nghiên cứu đơn, <b>{toaGiuHoSo}</b> chuyển đơn nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền./.</div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
                  <div style={{ fontSize: 11.5, fontStyle: "italic", lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 2 }}>Nơi nhận:</div>
                    <div>- Như kính gửi;</div>
                    <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                    <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                    <div>- {tenDuongSu} (để biết);</div>
                    <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                  </div>
                  <div style={{ textAlign: "center", width: "48%", fontSize: 12, fontWeight: 700 }}>
                    <div>TL. CHÁNH ÁN</div>
                    <div>KT. CHÁNH VĂN PHÒNG</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 60 }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
              <button onClick={() => setShowPreviewModal(false)} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {showTrinhKyModal && (
        <ModalTrinhKy record={record} onClose={() => { setShowTrinhKyModal(false); setIsSubmitted(true); }} />
      )}
    </div>
  );
}

// ── Modal Chọn hồ sơ kháng nghị để chuyển đi ─────────────────────────────
export function ChonHoSoModal({
  onClose,
  onSelect,
  listHoSo,
}: {
  onClose: () => void;
  onSelect: (selectedIds: number[]) => void;
  listHoSo: any[];
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 16px", background: "#8b1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>📁 Quản lý & Chọn tài liệu hồ sơ số hóa vụ án</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => {
              const selectedIds = listHoSo.length > 0 ? [listHoSo[0].id] : [101];
              onSelect(selectedIds);
              onClose();
            }}
            style={{ padding: "5px 16px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F }}
          >
            ✓ Xác nhận chọn hồ sơ
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <X size={16} /> Đóng
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <TaiLieuHoSoView vuAnId="VA26-002621" tenVuAn="Hồ sơ kháng nghị vụ án" onBack={onClose} />
      </div>
    </div>
  );
}

// ── Component Hồ sơ kháng nghị View ──────────────────────────────────────────
export function HoSoKhangNghiView({ userRole, onTaoCongVan }: { userRole?: UserRoleType; onTaoCongVan?: (config?: any) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<"di" | "den">("di");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [showTraHoSoModal, setShowTraHoSoModal] = useState(false);
  const [showNhanHoSoModal, setShowNhanHoSoModal] = useState(false);
  const [showTaoCongVanModal, setShowTaoCongVanModal] = useState(false);
  const [showChonHoSoModal, setShowChonHoSoModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [listDi, setListDi] = useState([
    {
      id: 1,
      maDon: "KN-DI-001",
      soKhangNghi: "10/2026/QĐKN",
      ngayKhangNghi: "25/07/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0590",
      ngayVanThuDen: "21/07/2026",
      soBA: "124/2026/HS-ST",
      ngayBA: "20/07/2026",
      toaRaBanAn: "TAND khu vực 5 - Hà Nội",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Đặng Thị Dương",
      donViNhan: "Viện kiểm sát nhân dân thành phố Hà Nội",
      ngayChuyen: "22/07/2026",
      soCVChuyen: "CV-2026/088",
      trangThai: "Đã chuyển",
    },
    {
      id: 2,
      maDon: "KN-DI-002",
      soKhangNghi: "12/2026/QĐKN",
      ngayKhangNghi: "18/06/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0412",
      ngayVanThuDen: "17/06/2026",
      soBA: "102/2026/DS-ST",
      ngayBA: "18/06/2026",
      toaRaBanAn: "TAND quận Hoàn Kiếm, Hà Nội",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Dương Thu Hằng",
      donViNhan: "Tòa án nhân dân TP Hà Nội",
      ngayChuyen: "25/07/2026",
      soCVChuyen: "CV-2026/092",
      trangThai: "Chờ chuyển",
    },
    {
      id: 3,
      maDon: "KN-DI-003",
      soKhangNghi: "15/2026/QĐKN-HC",
      ngayKhangNghi: "10/05/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND khu vực 2 - Hà Nội",
      maVanThuDen: "VT-2026/0298",
      ngayVanThuDen: "09/05/2026",
      soBA: "45/2026/HC-PT",
      ngayBA: "10/05/2026",
      toaRaBanAn: "TAND khu vực 2 - Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Phạm Văn Cường",
      donViNhan: "Tòa án nhân dân khu vực 2 - Hà Nội",
      ngayChuyen: "--",
      soCVChuyen: "",
      trangThai: "Chưa chuyển",
    },
    {
      id: 4,
      maDon: "KN-DI-004",
      soKhangNghi: "19/2026/QĐKN",
      ngayKhangNghi: "05/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0655",
      ngayVanThuDen: "02/08/2026",
      soBA: "78/2026/HS-PT",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND khu vực 4 - Hà Nội",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Nguyễn Văn Tuấn",
      donViNhan: "Tòa án nhân dân thành phố Hà Nội",
      ngayChuyen: "--",
      soCVChuyen: "",
      trangThai: "Chưa chuyển",
    },
    {
      id: 5,
      maDon: "KN-DI-005",
      soKhangNghi: "22/2026/QĐKN",
      ngayKhangNghi: "06/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0680",
      ngayVanThuDen: "04/08/2026",
      soBA: "115/2026/DS-ST",
      ngayBA: "30/07/2026",
      toaRaBanAn: "TAND khu vực 3 - Hà Nội",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Công ty Cổ phần Thương mại Sài Gòn",
      donViNhan: "Viện kiểm sát nhân dân thành phố Hà Nội",
      ngayChuyen: "--",
      soCVChuyen: "",
      trangThai: "Chưa chuyển",
    },
    {
      id: 6,
      maDon: "KN-DI-006",
      soKhangNghi: "25/2026/QĐKN",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0710",
      ngayVanThuDen: "05/08/2026",
      soBA: "33/2026/KDTM-PT",
      ngayBA: "01/08/2026",
      toaRaBanAn: "TAND khu vực 2 - Hà Nội",
      loaiAn: "Kinh doanh thương mại",
      nguoiKhieuNai: "Tập đoàn Đầu tư & Phát triển Đông Dương",
      donViNhan: "Tòa án nhân dân thành phố Hà Nội",
      ngayChuyen: "--",
      soCVChuyen: "",
      trangThai: "Chưa chuyển",
    },
    {
      id: 7,
      maDon: "KN-DI-007",
      soKhangNghi: "28/2026/QĐKN-HC",
      ngayKhangNghi: "02/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0730",
      ngayVanThuDen: "30/07/2026",
      soBA: "62/2026/HC-ST",
      ngayBA: "25/07/2026",
      toaRaBanAn: "TAND tỉnh Khánh Hòa",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Hoàng Văn Minh",
      donViNhan: "Tòa án nhân dân tỉnh Khánh Hòa",
      ngayChuyen: "05/08/2026",
      soCVChuyen: "CV-2026/104",
      trangThai: "Chờ chuyển",
    },
    {
      id: 8,
      maDon: "KN-DI-008",
      soKhangNghi: "32/2026/QĐKN-HC",
      ngayKhangNghi: "04/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0755",
      ngayVanThuDen: "01/08/2026",
      soBA: "18/2026/HC-PT",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND TP Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Đinh Xuân Bách",
      donViNhan: "Viện kiểm sát nhân dân thành phố Hà Nội",
      ngayChuyen: "06/08/2026",
      soCVChuyen: "CV-2026/110",
      trangThai: "Đã chuyển",
    },
  ]);

  const handleChuyenHoSoDi = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 hồ sơ kháng nghị để thực hiện chuyển!");
      return;
    }

    const selectedRecords = listDi.filter(item => selectedItems.includes(item.id));
    const missingCVRecord = selectedRecords.find(item => !item.soCVChuyen || item.soCVChuyen === "---" || item.soCVChuyen.trim() === "");

    if (missingCVRecord) {
      alert(`Hồ sơ "${missingCVRecord.soKhangNghi || missingCVRecord.maDon}" chưa có công văn chuyển. Vui lòng tạo công văn chuyển trước khi chuyển hồ sơ!`);
      return;
    }

    setListDi(prev =>
      prev.map(item =>
        selectedItems.includes(item.id)
          ? { ...item, trangThai: "Đã chuyển" }
          : item
      )
    );

    alert(`Đã chuyển hồ sơ kháng nghị thành công! Trạng thái cập nhật sang "Đã chuyển".`);
  };

  const handleOpenTaoCongVan = (rowTarget?: any) => {
    let target = rowTarget;

    if (!target) {
      if (selectedItems.length > 0) {
        target = listDi.find(item => selectedItems.includes(item.id));
      } else {
        target = listDi.find(item => !item.soCVChuyen || item.soCVChuyen.trim() === "") || listDi[0];
      }
    }

    setSelectedRecord(target || listDi[0]);
    setShowTaoCongVanModal(true);
  };

  const [listDen, setListDen] = useState([
    {
      id: 101,
      maDon: "KN-DEN-001",
      soKhangNghi: "08/2026/QĐKN",
      ngayKhangNghi: "03/07/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0582",
      ngayVanThuDen: "20/07/2026",
      soBA: "236/2026/HS-PT",
      ngayBA: "03/07/2026",
      toaRaBanAn: "TAND khu vực 4 - Hà Nội",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Nguyễn Văn Bình",
      donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
      ngayNhan: "24/07/2026",
      nguoiNhan: "Lý Thái Phúc",
      trangThai: "Đã nhận",
    },
    {
      id: 102,
      maDon: "KN-DEN-002",
      soKhangNghi: "14/2026/QĐKN",
      ngayKhangNghi: "25/04/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân khu vực 4 - Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0614",
      ngayVanThuDen: "24/04/2026",
      soBA: "18/2026/KDTM-ST",
      ngayBA: "25/04/2026",
      toaRaBanAn: "TAND khu vực 4 - Hà Nội",
      loaiAn: "Kinh doanh thương mại",
      nguoiKhieuNai: "Công ty Cổ phần Thương mại Á Châu",
      donViGui: "TAND khu vực 4 - Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 103,
      maDon: "KN-DEN-003",
      soKhangNghi: "21/2026/QĐKN",
      ngayKhangNghi: "12/03/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân quận Đống Đa",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0341",
      ngayVanThuDen: "11/03/2026",
      soBA: "88/2026/HNGĐ-PT",
      ngayBA: "12/03/2026",
      toaRaBanAn: "TAND quận Đống Đa, Hà Nội",
      loaiAn: "Hôn nhân gia đình",
      nguoiKhieuNai: "Lê Thị Mai",
      donViGui: "Văn phòng Luật sư Trí Đức",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 104,
      maDon: "KN-DEN-004",
      soKhangNghi: "27/2026/QĐKN",
      ngayKhangNghi: "01/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0698",
      ngayVanThuDen: "31/07/2026",
      soBA: "174/2026/HS-ST",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND tỉnh Hưng Yên",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Trần Đình Phước",
      donViGui: "Viện kiểm sát nhân dân thành phố Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 105,
      maDon: "KN-DEN-005",
      soKhangNghi: "31/2026/QĐKN",
      ngayKhangNghi: "04/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân khu vực 3 - Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0724",
      ngayVanThuDen: "03/08/2026",
      soBA: "55/2026/DS-PT",
      ngayBA: "02/08/2026",
      toaRaBanAn: "TAND khu vực 3 - Hà Nội",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Công ty TNHH Xây dựng Thịnh Phát",
      donViGui: "TAND khu vực 3 - Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 106,
      maDon: "KN-DEN-006",
      soKhangNghi: "33/2026/QĐKN-HC",
      ngayKhangNghi: "05/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0741",
      ngayVanThuDen: "04/08/2026",
      soBA: "62/2026/HC-ST",
      ngayBA: "01/08/2026",
      toaRaBanAn: "TAND khu vực 3 - Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Phạm Ngọc Ánh",
      donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 107,
      maDon: "KN-DEN-007",
      soKhangNghi: "36/2026/QĐKN",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân khu vực 6 - Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0762",
      ngayVanThuDen: "06/08/2026",
      soBA: "22/2026/LĐ-PT",
      ngayBA: "05/08/2026",
      toaRaBanAn: "TAND khu vực 6 - Hà Nội",
      loaiAn: "Lao động",
      nguoiKhieuNai: "Nguyễn Thanh Tùng",
      donViGui: "TAND khu vực 6 - Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 108,
      maDon: "KN-DEN-008",
      soKhangNghi: "38/2026/QĐKN",
      ngayKhangNghi: "08/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
      thamquyenxx: "TAND Tối cao",
      maVanThuDen: "VT-2026/0785",
      ngayVanThuDen: "07/08/2026",
      soBA: "91/2026/HS-ST",
      ngayBA: "04/08/2026",
      toaRaBanAn: "TAND khu vực 3 - Hà Nội",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Lê Minh Khải",
      donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 109,
      maDon: "KN-DEN-009",
      soKhangNghi: "41/2026/QĐKN-HC",
      ngayKhangNghi: "06/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân khu vực 2 - Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0792",
      ngayVanThuDen: "05/08/2026",
      soBA: "29/2026/HC-PT",
      ngayBA: "02/08/2026",
      toaRaBanAn: "TAND khu vực 2 - Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Công ty TNHH Phương Đông",
      donViGui: "TAND khu vực 2 - Hà Nội",
      ngayNhan: "07/08/2026",
      nguoiNhan: "Nguyễn Tiến Mạnh",
      trangThai: "Đã nhận",
    },
    {
      id: 110,
      maDon: "KN-DEN-010",
      soKhangNghi: "45/2026/QĐKN-HC",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
      thamquyenxx: "TAND thành phố Hà Nội",
      maVanThuDen: "VT-2026/0815",
      ngayVanThuDen: "06/08/2026",
      soBA: "38/2026/HC-ST",
      ngayBA: "03/08/2026",
      toaRaBanAn: "TAND khu vực 1 - Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Nguyễn Tiến Dũng",
      donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
      ngayNhan: "08/08/2026",
      nguoiNhan: "Trần Quốc Hành",
      trangThai: "Đã nhận",
    },
  ]);

  const handleOpenNhanHoSo = (rowTarget?: any) => {
    let targetIds: number[] = [];

    if (rowTarget && rowTarget.id) {
      targetIds = [rowTarget.id];
    } else if (selectedItems.length > 0) {
      targetIds = selectedItems;
    } else {
      const choNhan = listDen.find(item => item.trangThai === "Chờ nhận");
      if (choNhan) {
        targetIds = [choNhan.id];
      } else {
        alert("Tất cả các hồ sơ kháng nghị đến đều đã được nhận!");
        return;
      }
    }

    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã nhận",
            nguoiNhan: item.nguoiNhan === "--" || !item.nguoiNhan ? "Lý Thái Phúc" : item.nguoiNhan,
            ngayNhan: item.ngayNhan === "--" || !item.ngayNhan ? "07/08/2026" : item.ngayNhan,
          }
          : item
      )
    );

    alert("Đã nhận hồ sơ kháng nghị thành công!");
  };

  const handleConfirmTraHoSo = (lyDo: string) => {
    const targetIds = selectedRecord ? [selectedRecord.id] : (selectedItems.length > 0 ? selectedItems : [102]);
    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã trả",
          }
          : item
      )
    );
    setShowTraHoSoModal(false);
    alert(`Đã trả lại ${targetIds.length} hồ sơ kháng nghị đến thành công!\nLý do: ${lyDo}\nTrạng thái cập nhật sang "Đã trả".`);
  };

  const filteredDi = listDi.filter(r => {
    if (userRole === "vu-1" || userRole === "hinh-su") return r.loaiAn === "Hình sự";
    if (userRole === "vu-2" || userRole === "dan-su") return r.loaiAn === "Dân sự";
    if (userRole === "vu-3") return r.loaiAn === "Kinh doanh thương mại" || r.loaiAn === "Hôn nhân gia đình" || r.loaiAn === "Lao động";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return r.loaiAn === "Hành chính";
    return true;
  });

  const filteredDen = listDen.filter(r => {
    if (userRole === "vu-1" || userRole === "hinh-su") return r.loaiAn === "Hình sự";
    if (userRole === "vu-2" || userRole === "dan-su") return r.loaiAn === "Dân sự";
    if (userRole === "vu-3") return r.loaiAn === "Kinh doanh thương mại" || r.loaiAn === "Hôn nhân gia đình" || r.loaiAn === "Lao động";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return r.loaiAn === "Hành chính";
    return true;
  });

  const currentList = activeSubTab === "di" ? filteredDi : filteredDen;

  const paginBtn: React.CSSProperties = {
    padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "auto", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F }}>
        Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị
      </div>

      {/* 2 Sub-Tabs Header */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0 }}>
        <button
          onClick={() => setActiveSubTab("di")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "di" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "di" ? RED : MUTED,
            borderBottom: activeSubTab === "di" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đi
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "di" ? RED : "#e0e0e0",
            color: activeSubTab === "di" ? "#fff" : MUTED, fontWeight: 600,
          }}>{filteredDi.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("den")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "den" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "den" ? RED : MUTED,
            borderBottom: activeSubTab === "den" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đến
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "den" ? RED : "#e0e0e0",
            color: activeSubTab === "den" ? "#fff" : MUTED, fontWeight: 600,
          }}>{filteredDen.length}</span>
        </button>
      </div>

      {/* Search filter panel */}
      <SearchFilterPanel expanded={filterExpanded} isHoSoKhangNghi={true} onToggle={() => setFilterExpanded(v => !v)} />

      {/* Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
            {activeSubTab === "di" ? "Danh sách Hồ sơ kháng nghị" : "Danh sách Hồ sơ kháng nghị"}
          </span>
          <Badge color="#1a5a96" bg="#e8f4ff">{currentList.length} hồ sơ</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activeSubTab === "di" && (
            <>
              <button
                onClick={() => setShowChonHoSoModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#27ae60", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                <FolderCheck size={14} /> Chọn hồ sơ
              </button>

              <button
                onClick={() => handleOpenTaoCongVan()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Tạo công văn
              </button>

              <button
                onClick={handleChuyenHoSoDi}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Chuyển hồ sơ
              </button>
            </>
          )}

          {activeSubTab === "den" && (
            <>
              <button
                onClick={() => handleOpenNhanHoSo()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#1a5a96", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                <CheckCircle2 size={14} /> Nhận hồ sơ
              </button>

              <button
                onClick={() => { setSelectedRecord(null); setShowTraHoSoModal(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#fff", color: RED,
                  border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                <RotateCcw size={14} /> Trả hồ sơ
              </button>
            </>
          )}

          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <FileSpreadsheet size={14} color="#27ae60" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, padding: "12px 20px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ ...TH_STYLE, width: 40, textAlign: "center" }}>
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) setSelectedItems(currentList.map(item => item.id));
                  else setSelectedItems([]);
                }} />
              </th>
              <th style={{ ...TH_STYLE, width: 45, textAlign: "center" }}>STT</th>
              <th style={{ ...TH_STYLE, width: 145 }}>MÃ VĂN THƯ ĐẾN</th>
              <th style={{ ...TH_STYLE, width: 160 }}>THÔNG TIN KHÁNG NGHỊ</th>
              <th style={{ ...TH_STYLE, width: 145 }}>SỐ BẢN ÁN / QĐ</th>
              <th style={{ ...TH_STYLE, width: 210 }}>{activeSubTab === "di" ? "ĐƠN VỊ NHẬN / CÔNG VĂN CHUYỂN" : "ĐƠN VỊ GỬI / NGƯỜI NHẬN"}</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((row, idx) => (
              <tr
                key={row.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(p => [...p, row.id]);
                      else setSelectedItems(p => p.filter(i => i !== row.id));
                    }}
                  />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>{idx + 1}</td>

                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: "#1a5a96", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Mã VT: </span>{(row as any).maVanThuDen || "VT-2026/0582"}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày VT: </span>{(row as any).ngayVanThuDen || "20/07/2026"}</div>
                </td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: RED, fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số KN: </span>{(row as any).soKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày KN: </span>{(row as any).ngayKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Người KN: </span>{(row as any).nguoiKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Thẩm quyền xét xử: </span>{(row as any).thamquyenxx}</div>
                </td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: "#1a73e8", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số BA/QĐ: </span>{row.soBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày bản án: </span>{row.ngayBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Tòa ra bản án: </span>{(row as any).toaRaBanAn}</div>
                </td>
                <td style={{ ...TD_STYLE, color: TEXT, fontSize: 11, fontFamily: F }}>
                  {activeSubTab === "di" ? (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị nhận:</b> {(row as any).donViNhan}</div>
                      <div>
                        <b style={{ fontFamily: F }}>CV chuyển:</b>{" "}
                        {(row as any).soCVChuyen ? (
                          <span style={{ color: "#1a73e8", fontWeight: 600 }}>
                            {(row as any).soCVChuyen} ({(row as any).ngayChuyen})
                          </span>
                        ) : (
                          <span style={{ color: "#e67e22", fontStyle: "italic" }}>Chưa có công văn</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị gửi:</b> {(row as any).donViGui}</div>
                      <div><b style={{ fontFamily: F }}>Người nhận:</b> {(row as any).nguoiNhan} ({(row as any).ngayNhan})</div>
                    </>
                  )}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <Badge
                    color={
                      row.trangThai.includes("Đã")
                        ? "#1b5e20"
                        : row.trangThai === "Chưa chuyển"
                          ? "#6e1414"
                          : "#8a6d00"
                    }
                    bg={
                      row.trangThai.includes("Đã")
                        ? "#e8f5e9"
                        : row.trangThai === "Chưa chuyển"
                          ? "#fdecea"
                          : "#fff8e1"
                    }
                  >
                    {row.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {activeSubTab === "di" ? (
                      <>
                        <button onClick={() => onTaoCongVan?.(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem biểu mẫu"><FileText size={14} color="#1a73e8" /></button>
                        <button onClick={() => { setSelectedRecord(row); setShowTrinhKyModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Đi trình ký Lãnh đạo"><Send size={14} color={RED} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleOpenNhanHoSo(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Tiếp nhận hồ sơ"><CheckCircle2 size={14} color="#1a5a96" /></button>
                        <button onClick={() => { setSelectedRecord(row); setShowTraHoSoModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Trả lại hồ sơ"><RotateCcw size={14} color={RED} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
        <span>Hiển thị 1–{currentList.length} trong tổng {currentList.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>

      {/* Modal Tạo biểu mẫu công văn */}
      {showTaoCongVanModal && (
        <ModalTaoCongVan
          record={selectedRecord}
          onClose={() => setShowTaoCongVanModal(false)}
          onConfirm={(cfg) => {
            setShowTaoCongVanModal(false);
            if (selectedRecord) {
              const assignedCV = cfg.soCongVan || "CV-2026/108";
              const assignedDonVi = cfg.donViNhan || selectedRecord.donViNhan || "Viện kiểm sát nhân dân thành phố Hà Nội";
              setListDi(prev =>
                prev.map(item =>
                  item.id === selectedRecord.id
                    ? {
                      ...item,
                      donViNhan: assignedDonVi,
                      soCVChuyen: assignedCV,
                      ngayChuyen: "07/08/2026",
                      trangThai: item.trangThai === "Chưa chuyển" ? "Chờ chuyển" : item.trangThai
                    }
                    : item
                )
              );
            }
            onTaoCongVan?.(cfg);
          }}
        />
      )}

      {/* Modal Trình ký Lãnh đạo */}
      {showTrinhKyModal && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKyModal(false)} />}

      {/* Modal Trả lại hồ sơ */}
      {showTraHoSoModal && <ModalTraHoSo onClose={() => setShowTraHoSoModal(false)} onConfirm={handleConfirmTraHoSo} />}

      {/* Modal Chọn hồ sơ kháng nghị để chuyển đi */}
      {showChonHoSoModal && (
        <ChonHoSoModal
          listHoSo={filteredDi}
          onClose={() => setShowChonHoSoModal(false)}
          onSelect={ids => {
            setSelectedItems(ids);
            alert(`Đã chọn thành công ${ids.length} hồ sơ kháng nghị để xử lý/chuyển!`);
          }}
        />
      )}
    </div>
  );
}

export default HoSoKhangNghiView;
