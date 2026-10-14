import React, { useState } from "react";
import {
  Search, Eye, ChevronDown, RotateCcw, X, Save,
  FileText, CheckCircle2, Send, FileSpreadsheet, FolderCheck,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { Button, Input, Table, Tabs, Tag, Space, Card, Row, Col, Statistic, Dropdown, ConfigProvider, Typography, Select } from "antd";
const { Title, Text } = Typography;


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
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Trả lại hồ sơ kháng nghị đến
          </span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <Input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <Input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <Button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hủy</Button>
          <Button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </Button>
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
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: F }}>
            Nhập thông tin trình ký
          </span>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 14, fontFamily: F }}>
            close
          </Button>
        </div>

        {/* Form Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 14, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Người ký văn bản
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={nguoiKy}
                onChange={e => setNguoiKy(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cbd5e1", borderRadius: 6,
                  fontFamily: F, color: "#0f172a", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Chu Thị Thu Hiền">Chu Thị Thu Hiền</option>
                <option value="Nguyễn Văn Dũng">Nguyễn Văn Dũng</option>
                <option value="Phạm Văn Hải - Chánh án TANDTC">Phạm Văn Hải - Chánh án TANDTC</option>
                <option value="Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự">Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự</option>
                <option value="Lê Hoàng Nam - Vụ trưởng Vụ 1">Lê Hoàng Nam - Vụ trưởng Vụ 1</option>
              </select>
              <ChevronDown size={18} color="#64748b" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 14, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Mức độ ưu tiên
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={mucDoUuTien}
                onChange={e => setMucDoUuTien(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cbd5e1", borderRadius: 6,
                  fontFamily: F, color: "#0f172a", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Thấp">Thấp</option>
              </select>
              <ChevronDown size={18} color="#64748b" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 14, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
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
                  border: "1px solid #cbd5e1", borderRadius: 6, fontFamily: F,
                  minHeight: 120, boxSizing: "border-box", outline: "none", resize: "vertical"
                }}
              />
              <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 14, color: "#94a3b8", fontFamily: F }}>
                {noiDungKy.length} / 4000
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
          <Button
            onClick={handleSubmit}
            style={{
              padding: "10px 28px", background: darkRed, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Trình ký
          </Button>

          <Button
            onClick={onClose}
            style={{
              padding: "10px 28px", background: "#fff", color: "#0f172a",
              border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Đóng
          </Button>
        </div>

      </div>
    </div>
  );
}

// ── Modal Tạo biểu mẫu công văn ───────────────────────────────────────────────
function ModalTaoCongVan({ record, onClose, onConfirm }: { record?: any; onClose: () => void; onConfirm: (config: any) => void }) {
  const getInitialDonViNhan = () => {
    if (!record) return "Viện kiểm sát nhân dân tối cao";
    const toaRA = record.toaRaBanAn || "";
    const dvNhan = record.donViNhan || "";
    if (toaRA.toLowerCase().includes("tỉnh") || dvNhan.toLowerCase().includes("tỉnh")) {
      return dvNhan.toLowerCase().includes("tỉnh") ? dvNhan : "Tòa án nhân dân tỉnh Hà Nam";
    }
    return "Viện kiểm sát nhân dân tối cao";
  };

  const [loaiVanBan, setLoaiVanBan] = useState("Phiếu chuyển đơn");
  const [donViNhan, setDonViNhan] = useState(getInitialDonViNhan());
  const [toaGiuHoSo, setToaGiuHoSo] = useState(record?.toaGiuHoSo || "Tòa án nhân dân tối cao");
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
  const hậuTốVuModal = `TANDTC - ${vuSuffixCurrent}`;
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
              <span style={{ fontSize: 14, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                ✓ Đã lưu biểu mẫu
              </span>
            )}
            {hasNumber && (
              <span style={{ fontSize: 14, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                🔢 Số: 05/TANDTC - Vụ 1
              </span>
            )}
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tên loại văn bản / biểu mẫu *</label>
            <select value={loaiVanBan} onChange={e => setLoaiVanBan(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fff", color: TEXT, boxSizing: "border-box" }}>
              <option value="Phiếu chuyển đơn">Phiếu chuyển (Công văn chuyển)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 14, color: TEXT, fontFamily: F, fontWeight: 600 }}>Đơn vị nhận *</label>
              <span style={{ fontSize: 14, color: "#2563eb", fontFamily: F, fontStyle: "italic" }}>(Tự động lấy từ Quyết định kháng nghị)</span>
            </div>
            <select
              value={donViNhan}
              onChange={e => setDonViNhan(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#f8fafc", color: TEXT, boxSizing: "border-box" }}>
              <option value="Viện kiểm sát nhân dân tối cao">Viện kiểm sát nhân dân tối cao</option>
              <option value="Tòa án nhân dân tỉnh Hà Nam">Tòa án nhân dân tỉnh Hà Nam</option>
              <option value="Tòa án nhân dân TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
              <option value="Tòa án nhân dân tỉnh Vĩnh Phúc">Tòa án nhân dân tỉnh Vĩnh Phúc</option>
              <option value="Tòa án nhân dân tỉnh Bắc Ninh">Tòa án nhân dân tỉnh Bắc Ninh</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tòa án giữ hồ sơ</label>
              <Input value={toaGiuHoSo} onChange={e => setToaGiuHoSo(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Đương sự</label>
              <Input value={duongSu} onChange={e => setDuongSu(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 14, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Nội dung đơn</label>
            <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={3} style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Footer Buttons Workflow */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          {!isSaved ? (
            <>
              <Button
                onClick={handleSave}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#16a34a", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Save size={15} /> Lưu biểu mẫu
              </Button>
              <Button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#0284c7", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Eye size={15} /> Xem biểu mẫu
              </Button>
              <Button
                onClick={onClose}
                style={{
                  padding: "8px 16px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontFamily: F,
                }}>
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setShowTrinhKy(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#0284c7", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Trình ký
              </Button>

              <Button
                onClick={handleToggleCapSo}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  background: hasNumber ? "#dc2626" : "#7c3aed",
                  color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                {hasNumber ? "Hủy cấp số" : "Lấy số"}
              </Button>

              <Button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#475569", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Xem biểu mẫu
              </Button>

              <Button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 14, fontFamily: F,
                }}>
                ✖ Đóng
              </Button>
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
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Bắc Ninh",
    soBA: "236/2026/HS-PT",
    ngayBA: "03/07/2026",
    toaRaBanAn: "TAND tỉnh Bắc Ninh",
    loaiAn: "Hình sự",
    nguoiKhieuNai: "Nguyễn Văn Bình",
    donViGui: "Viện kiểm sát nhân dân tỉnh Bắc Ninh",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={18} color="#0f766e" />
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin hồ sơ kháng nghị đến</span>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={18} />
          </Button>
        </div>

        {/* Content - Chia 2 cột */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* CỘT TRÁI: Thông tin chính hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", height: "fit-content" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: RED, textTransform: "uppercase", fontFamily: F }}>
                📌 Thông tin hồ sơ kháng nghị
              </span>
              <Badge color={rec.trangThai?.includes("Đã") ? "#065f46" : "#92400e"} bg={rec.trangThai?.includes("Đã") ? "#d1fae5" : "#fef3c7"}>
                {rec.trangThai || "Chờ nhận"}
              </Badge>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "38%" }}>Số – Ngày QĐ kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: RED, fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soKhangNghi || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayKhangNghi || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Người kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: TEXT, fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhangNghi || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: "#2563eb", fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soBA || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayBA || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.toaRaBanAn || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại án</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.loaiAn || "Hình sự"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đương sự / Người KN</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhieuNai || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 14, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Đơn vị gửi</td>
                  <td style={{ padding: "9px 12px", fontSize: 14, color: TEXT }}>{rec.donViGui || "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CỘT PHẢI: Bảng danh sách tài liệu của hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
                📑 Danh sách tài liệu kèm theo ({taiLieuList.length})
              </span>
            </div>
            <div style={{ overflowX: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: BG }}>
                    {["STT", "TÊN TÀI LIỆU", "LOẠI", "TRANG", "THAO TÁC"].map((h, i) => (
                      <th key={h} style={{ ...TH_STYLE, fontSize: 14, padding: "8px 10px", width: i === 0 ? 36 : i === 1 ? "45%" : undefined }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taiLieuList.map((d, i) => (
                    <tr key={d.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 14 }}>{d.stt}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, color: "#2563eb", fontWeight: 500 }}>📄 {d.ten}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14 }}>
                        <span style={{ padding: "2px 6px", borderRadius: 10, background: "#f3f4f6", color: "#374151", fontWeight: 500 }}>{d.loai}</span>
                      </td>
                      <td style={{ ...TD_STYLE, fontSize: 14, color: MUTED, textAlign: "center" }}>{d.soTrang}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, color: MUTED, textAlign: "center" }}>
                        <Button style={{ background: "none", border: "none", cursor: "pointer", color: "#0e7490", display: "inline-flex", alignItems: "center", gap: 2, fontSize: 14 }} title="Xem tài liệu">
                          <Eye size={12} /> Xem
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button
            onClick={onClose}
            style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            style={{ padding: "7px 24px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <CheckCircle2 size={14} /> Xác nhận nhận hồ sơ
          </Button>
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

  const toaGiuHoSo = record?.toaGiuHoSo || "Tòa án nhân dân tối cao";
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
  const hậuTốVu = `TANDTC - ${vuSuffix}`;
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

  const donViNhan = record?.donViNhan || "Viện kiểm sát nhân dân tối cao";
  const tenDuongSu = record?.nguoiKhieuNai || "bà Đặng Thị Dương";
  const diaChiDuongSu = record?.diaChiDuongSu || "(SĐT: 0944.808.080) 190 Nguyễn Văn Hưởng, phường An Khánh, Thành phố Hồ Chí Minh";
  const ngayDeDon = record?.ngayDeDon || "17/10/2025";
  const noiDungDon = record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại. Đề nghị Viện trưởng Viện kiểm sát nhân dân tối cao có ý kiến chỉ đạo, giải quyết đơn khiếu nại của ông.";
  const vietTatDonVi = "TANDTC";

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
    padding: "5px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 5
  };

  const selectSt: React.CSSProperties = {
    padding: "5px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 20, background: BORDER, margin: "0 4px"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "hidden", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị › <b style={{ color: TEXT }}>
              Biểu mẫu {activeDocType === "cong-van-chuyen" ? "PHIẾU CHUYỂN ĐƠN" : "QUYẾT ĐỊNH KHÁNG NGHỊ"} (Word Editor)
            </b>
          </div>
          {isSaved && (
            <span style={{ fontSize: 14, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              ✓ Đã lưu biểu mẫu
            </span>
          )}
          {hasNumber && (
            <span style={{ fontSize: 14, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              🔢 Số: {activeDocType === "cong-van-chuyen" ? `05/${hậuTốVu}` : soQDKNFormatted}
            </span>
          )}
          {isSubmitted && (
            <span style={{ fontSize: 14, background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              📩 Đã trình ký
            </span>
          )}
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>
            ← Quay lại
          </Button>

          {!isSaved ? (
            <Button onClick={handleSaveForm} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
              <Save size={14} /> Lưu biểu mẫu
            </Button>
          ) : (
            <>
              <Button onClick={handleTrinhKy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#0284c7", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <Send size={14} /> Trình ký
              </Button>
              <Button onClick={handleToggleCapSo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: hasNumber ? "#dc2626" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {hasNumber ? "❌ Hủy cấp số" : "🔢 Lấy số"}
              </Button>
              <Button onClick={() => setShowPreviewModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#475569", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                <Eye size={14} /> Xem biểu mẫu
              </Button>
              <Button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                ✖ Đóng
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Word Ribbon Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap", fontSize: 14 }}>
        <Button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác (Ctrl+Z)">↩ Hoàn tác</Button>
        <Button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại (Ctrl+Y)">↪ Làm lại</Button>
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

        <Button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm (Ctrl+B)"><b>B</b></Button>
        <Button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng (Ctrl+I)"><i>I</i></Button>
        <Button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân (Ctrl+U)"><u>U</u></Button>
        <Button onClick={() => execCmd("strikeThrough")} style={tbBtnSt} title="Gạch ngang"><s>S</s></Button>
        <div style={sepSt} />

        <Button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅ Căn trái</Button>
        <Button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔ Căn giữa</Button>
        <Button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡ Căn phải</Button>
        <Button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều 2 bên">☰ Căn đều</Button>
        <div style={sepSt} />

        <Button onClick={() => execCmd("insertUnorderedList")} style={tbBtnSt} title="Danh sách chấm">• Danh sách</Button>
        <Button onClick={() => execCmd("insertOrderedList")} style={tbBtnSt} title="Danh sách số">1. Danh sách</Button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 14, color: MUTED }}>
          <span>Tỷ lệ xem:</span>
          <Button onClick={() => setZoom(z => Math.max(70, z - 10))} style={tbBtnSt}>-</Button>
          <span style={{ fontWeight: 700, color: TEXT }}>{zoom}%</span>
          <Button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</Button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#cbd5e1" }}>
        <div style={{ width: 260, background: "#f8fafc", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: TEXT, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={RED} /> DANH SÁCH VĂN BẢN
          </div>

          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {record?.isBaoCao && (
              <div
                onClick={() => setActiveDocType("bao-cao-danh-sach")}
                style={{
                  padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                  background: activeDocType === "bao-cao-danh-sach" ? "#e0f2fe" : "#fff",
                  border: activeDocType === "bao-cao-danh-sach" ? "1px solid #0284c7" : `1px solid ${BORDER}`,
                  boxShadow: activeDocType === "bao-cao-danh-sach" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s"
                }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: activeDocType === "bao-cao-danh-sach" ? "#0369a1" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                  📊 Báo cáo danh sách
                </div>
                <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
                  {record?.tabLabel || "Danh sách vụ án / đơn"}
                </div>
              </div>
            )}

            <div
              onClick={() => setActiveDocType("quyet-dinh-khang-nghi")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "quyet-dinh-khang-nghi" ? "#e0f2fe" : "#fff",
                border: activeDocType === "quyet-dinh-khang-nghi" ? "1px solid #0284c7" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "quyet-dinh-khang-nghi" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeDocType === "quyet-dinh-khang-nghi" ? "#0369a1" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Quyết định kháng nghị
              </div>
              <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
                Biểu mẫu QĐ Kháng nghị GĐT
              </div>
            </div>

            <div
              onClick={() => setActiveDocType("cong-van-chuyen")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "cong-van-chuyen" ? "#e0f2fe" : "#fff",
                border: activeDocType === "cong-van-chuyen" ? "1px solid #0284c7" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "cong-van-chuyen" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeDocType === "cong-van-chuyen" ? "#0369a1" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Công văn chuyển
              </div>
              <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
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
                  <div style={{ fontWeight: 700, fontSize: 14 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                  <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                </div>

                <div style={{ textAlign: "center", width: "52%" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 14, marginTop: 4 }}>
                    Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, margin: "24px 0 6px 0", letterSpacing: 0.5 }}>
                BÁO CÁO DANH SÁCH {record?.tabLabel?.toUpperCase() || "ĐƠN VÀ THỤ LÝ VỤ ÁN"}
              </div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 14, marginBottom: 20 }}>
                (Thời gian xuất báo cáo: {new Date().toLocaleDateString("vi-VN")})
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 16 }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", width: 36, textAlign: "center" }}>STT</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Thông tin đơn / Thụ lý</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Đương sự</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Bản án / Quyết định</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Thẩm phán / TTV</th>
                    <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Ghi chú / Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {(record?.cases && record.cases.length > 0 ? record.cases : [
                    { maDon: "6966", nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hảo", soBA: "CVKN_GDT", ngayBA: "20/07/2026", toa: "TAND CC Hà Nội", thamPhan: "Nguyễn Biên Thùy", ttv: "Lý Thái Phúc" },
                    { maDon: "6967", nguoiKhieuNai: "Trần Văn Hòa", biCao: "Nguyễn Thị Lan", soBA: "123/2026/DS-ST", ngayBA: "21/07/2026", toa: "TAND tỉnh Hà Nam", thamPhan: "Trần Minh Đức", ttv: "Vũ Diệu Thúy" }
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
                        {c.ttv && <div><b>TTV:</b> {c.ttv}</div>}
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
                  <div style={{ fontStyle: "italic", fontSize: 14 }}>(Ký, ghi rõ họ tên)</div>
                  <div style={{ height: 60 }} />
                </div>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ fontWeight: 700 }}>LÃNH ĐẠO VỤ PHÊ DUYỆT</div>
                  <div style={{ fontStyle: "italic", fontSize: 14 }}>(Ký, đóng dấu)</div>
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
                  <div style={{ fontWeight: 700, fontSize: 14 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                  <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontSize: 14, marginTop: 4 }}>
                    Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soCongVan}</span>
                  </div>
                </div>

                <div style={{ textAlign: "center", width: "52%" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 14, marginTop: 4 }}>
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
                <div style={{ fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                  <div>- Như kính gửi;</div>
                  <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                  <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                  <div>- {tenDuongSu} (để biết);</div>
                  <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                </div>

                <div style={{ textAlign: "center", width: "48%", fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                  <div>TL. CHÁNH ÁN</div>
                  <div>KT. CHÁNH VĂN PHÒNG</div>
                  <div>PHÓ CHÁNH VĂN PHÒNG</div>
                  <div style={{ height: 75 }} />
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 14, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
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
                    <div style={{ fontWeight: 700, fontSize: 14 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 14, marginTop: 4 }}>
                      Số: <span style={{ background: "#e0e7ff", padding: "1px 4px", fontWeight: 700 }}>{soQDKNFormatted}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 14, marginTop: 4 }}>
                      Hà Nội, ngày 07 tháng 4 năm 2026
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", margin: "18px 0 14px 0" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>QUYẾT ĐỊNH</div>
                  <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>KHÁNG NGHỊ GIÁM ĐỐC THẨM</div>
                  <div style={{ fontSize: 14, fontStyle: "italic", marginTop: 4 }}>
                    Đối với Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023<br />của Tòa án nhân dân tỉnh Kiên Giang
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>
                    CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO
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
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>1. Bà Lâm Thị Đèo, sinh năm 1955; cư trú tại: Ấp Bãi Chướng, đặc khu Phú Quốc, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>2. Ông Lâm Thành Thủ, sinh năm 1969; cư trú tại: Ấp Minh Phong, xã Bình An, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>3. Ông Lâm Thành Thủy, sinh năm 1976; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>4. Ông Lâm Thành Sự, sinh năm 1978; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>5. Bà Nguyễn Thị Mỹ, sinh năm 1961; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>6. Bà Lâm Thị Kim Ngọc, sinh năm 1990; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>7. Ông Lâm Minh Ngoan, sinh năm 1995; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                </div>

                <div style={{ marginBottom: 10, paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700 }}>- Bị đơn:</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>Ông Vũ Thành Đô, sinh năm 1958; cư trú tại: Ấp An Phú, đặc khu Kiên Hải, tỉnh An Giang.</div>
                </div>

                <div style={{ position: "absolute", bottom: 18, right: 30, fontSize: 14, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #cbd5e1", paddingBottom: 6, marginBottom: 16, fontSize: 14, color: "#64748b" }}>
                  <span>TÒA ÁN NHÂN DÂN TỐI CAO</span>
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

                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 14, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 20, fontSize: 14, color: "#64748b" }}>
                  <span>TÒA ÁN NHÂN DÂN TỐI CAO</span>
                  <span>Số: {soQDKNFormatted}</span>
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "10px 0 16px 0" }}>
                  QUYẾT ĐỊNH:
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>1.</b> Kháng nghị Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang về vụ án “Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất và đòi lại đất” giữa nguyên đơn là bà Lâm Thị Đèo, ông Lâm Thành Thủ, ông Lâm Thành Thủy... với bị đơn ông Vũ Thành Đô và 05 người có quyền lợi, nghĩa vụ liên quan.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>2.</b> Đề nghị Hội đồng Thẩm phán Tòa án nhân dân tối cao xét xử giám đốc thẩm, hủy Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang và hủy Bản án dân sự sơ thẩm số 10/2022/DSST ngày 15/6/2022 của Tòa án nhân dân huyện Kiên Hải, tỉnh Kiên Giang; giao hồ sơ vụ án cho Tòa án nhân dân khu vực 1 - An Giang giải quyết lại theo thủ tục sơ thẩm đúng quy định của pháp luật.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 44 }}>
                  <b>3.</b> Tạm đình chỉ thi hành Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang cho đến khi có Quyết định giám đốc thẩm.
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                  <div style={{ fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                    <div>- Chánh án TANDTC (để báo cáo);</div>
                    <div>- Vụ 9 - VKSNDTC (kèm hồ sơ vụ án);</div>
                    <div>- TAND tỉnh An Giang;</div>
                    <div>- TAND khu vực 1 - An Giang;</div>
                    <div>- Phòng THADS khu vực 1 - An Giang;</div>
                    <div>- Các đương sự (theo địa chỉ);</div>
                    <div>- Thẩm phán TANDTC Đào Thị Minh Thủy;</div>
                    <div>- Lưu: TK Phó Chánh án, VT, Vụ II - TANDTC (03 bản).</div>
                  </div>

                  <div style={{ textAlign: "center", width: "48%", fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                    <div>KT. CHÁNH ÁN</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 75 }} />
                    <div style={{ textDecoration: "underline" }}>Nguyễn Văn Tiến</div>
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 14, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
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
              <Button onClick={() => setShowPreviewModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={MUTED} /></Button>
            </div>

            <div style={{ flex: 1, padding: 30, background: "#cbd5e1", overflowY: "auto", display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#fff", width: "100%", maxWidth: 680, padding: "40px 50px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontFamily: "'Times New Roman', Times, serif", fontSize: 14, color: "#000", lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "46%" }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                    <div style={{ width: 80, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 14, marginTop: 4 }}>Số: <b>{soCongVan}</b></div>
                  </div>
                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 140, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 14, marginTop: 4 }}>{diaDanh}, {ngayChuyenText}</div>
                  </div>
                </div>

                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, margin: "24px 0 18px 0" }}>PHIẾU CHUYỂN ĐƠN</div>
                <div style={{ textIndent: 30, marginBottom: 12 }}>Kính gửi: <b>{donViNhan}</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 12 }}><b>{toaGiuHoSo}</b> nhận được đơn của <b>{tenDuongSu}</b> {diaChiDuongSu} đề ngày {ngayDeDon} {noiDungDon}</div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 28 }}>Sau khi nghiên cứu đơn, <b>{toaGiuHoSo}</b> chuyển đơn nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền./.</div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
                  <div style={{ fontSize: 14.5, fontStyle: "italic", lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 2 }}>Nơi nhận:</div>
                    <div>- Như kính gửi;</div>
                    <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                    <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                    <div>- {tenDuongSu} (để biết);</div>
                    <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                  </div>
                  <div style={{ textAlign: "center", width: "48%", fontSize: 14, fontWeight: 700 }}>
                    <div>TL. CHÁNH ÁN</div>
                    <div>KT. CHÁNH VĂN PHÒNG</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 60 }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
              <Button onClick={() => setShowPreviewModal(false)} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
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
      <div style={{ padding: "8px 16px", background: "#800000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>📁 Quản lý & Chọn tài liệu hồ sơ số hóa vụ án</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            htmlType="button"
            onClick={() => {
              const selectedIds = listHoSo.length > 0 ? [listHoSo[0].id] : [101];
              onSelect(selectedIds);
              onClose();
            }}
            style={{ padding: "5px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}
          >
            ✓ Xác nhận chọn hồ sơ
          </Button>
          <Button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600, fontFamily: F }}>
            <X size={16} /> Đóng
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <TaiLieuHoSoView vuAnId="VA26-002621" tenVuAn="Hồ sơ kháng nghị vụ án" onBack={onClose} />
      </div>
    </div>
  );
}

// ── Modal: Từ chối tiếp nhận ─────────────────────────────────────────────────
function ModalTuChoiTiepNhan({ onClose, onConfirm }: { onClose: () => void; onConfirm: (lyDo: string) => void }) {
  const [lyDo, setLyDo] = React.useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1800, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 460, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fef2f2", borderRadius: "8px 8px 0 0" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#991b1b" }}>Từ chối tiếp nhận hồ sơ</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>Vui lòng nhập lý do từ chối để lưu vào hệ thống.</div>
        </div>
        <div style={{ padding: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6, fontFamily: F }}>
            Lý do từ chối <span style={{ color: RED }}>*</span>
          </label>
          <textarea
            value={lyDo}
            onChange={e => setLyDo(e.target.value)}
            placeholder="Nhập lý do từ chối tiếp nhận..."
            rows={4}
            style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, resize: "vertical", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "0 0 8px 8px" }}>
          <Button onClick={onClose} style={{ padding: "7px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hủy</Button>
          <Button
            onClick={() => { if (!lyDo.trim()) { alert("Vui lòng nhập lý do từ chối!"); return; } onConfirm(lyDo.trim()); }}
            style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}
          >Xác nhận từ chối</Button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Nhập tay hồ sơ đến ─────────────────────────────────────────────────
function ModalNhapTayHoSoDen({ loaiHoSo, onClose, onSave }: { loaiHoSo: "tu-hinh" | "khang-nghi"; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = React.useState({ loaiDonVi: "VKS", tenDonVi: "", soCongVan: "", ngayGui: "", nguoiGui: "" });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1800, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "8px 8px 0 0" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{loaiHoSo === "tu-hinh" ? "Nhập tay hồ sơ tử hình đến" : "Nhập tay hồ sơ kháng nghị đến"}</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>Dùng cho hồ sơ nhận từ VKS hoặc cơ quan ngoài hệ thống QLA.</div>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5, fontFamily: F }}>Loại đơn vị gửi <span style={{ color: RED }}>*</span></label>
            <select value={form.loaiDonVi} onChange={e => set("loaiDonVi", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F }}>
              <option value="VKS">Viện kiểm sát</option>
              <option value="TOA_DUOI">Tòa án cấp dưới</option>
              <option value="KHAC">Khác</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5, fontFamily: F }}>Tên đơn vị gửi <span style={{ color: RED }}>*</span></label>
            <Input value={form.tenDonVi} onChange={e => set("tenDonVi", e.target.value)} placeholder="Nhập tên đơn vị gửi hồ sơ..." style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5, fontFamily: F }}>Số công văn <span style={{ color: RED }}>*</span></label>
              <Input value={form.soCongVan} onChange={e => set("soCongVan", e.target.value)} placeholder="VD: CV-2026/123" style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5, fontFamily: F }}>Ngày gửi</label>
              <Input type="date" value={form.ngayGui} onChange={e => set("ngayGui", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5, fontFamily: F }}>Người gửi</label>
            <Input value={form.nguoiGui} onChange={e => set("nguoiGui", e.target.value)} placeholder="Tên người gửi hồ sơ" style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14, fontFamily: F, boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc", borderRadius: "0 0 8px 8px" }}>
          <Button onClick={onClose} style={{ padding: "7px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Hủy</Button>
          <Button
            onClick={() => {
              if (!form.tenDonVi.trim() || !form.soCongVan.trim()) { alert("Vui lòng nhập đầy đủ Tên đơn vị gửi và Số công văn!"); return; }
              onSave({ ...form, id: Date.now(), trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" });
            }}
            style={{ padding: "7px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}
          >Lưu hồ sơ</Button>
        </div>
      </div>
    </div>
  );
}

function getTagColor(tt: string) {
  const map: Record<string, string> = {
    "Chưa tiếp nhận": "error",
    "Đã tiếp nhận": "success",
    "Từ chối tiếp nhận": "purple",
    "Chờ chuyển": "warning",
    "Đã chuyển": "success",
    "Đã tiếp nhận (PT/ST)": "success",
    "Từ chối (PT/ST)": "error",
    "Chờ nhận": "warning",
    "Đã nhận": "success",
    "Chưa chuyển": "error",
  };
  return map[tt] || "default";
}

function TrangThaiBadge({ tt }: { tt: string }) {
  return <Tag color={getTagColor(tt)} style={{ fontWeight: 600 }}>{tt}</Tag>;
}

export function HoSoKhangNghiView({ userRole, onTaoCongVan }: { userRole?: UserRoleType; onTaoCongVan?: (config?: any) => void }) {
  type MainTab = "tong-hop" | "tu-hinh" | "khang-nghi" | "xet-xu-lai";
  const [activeMain, setActiveMain] = React.useState<MainTab>("tong-hop");
  const [kNSubTab, setKNSubTab] = React.useState<"di" | "den">("den");
  const [showTuChoi, setShowTuChoi] = React.useState(false);
  const [showNhapTay, setShowNhapTay] = React.useState<"tu-hinh" | "khang-nghi" | null>(null);
  const [showTraHoSo, setShowTraHoSo] = React.useState(false);
  const [showTrinhKy, setShowTrinhKy] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  const [listTuHinhDen, setListTuHinhDen] = React.useState([
    { id: 901, maDon: "TH-DEN-001", soCongVan: "CV-2026/THA-099", ngayGui: "13/08/2026", donViGui: "TAND TP Hà Nội", loaiDonVi: "Tòa án cấp dưới", nguoiGui: "Nguyễn Văn An", soBA: "12/2026/HS-PT", toaRaBanAn: "TAND Cấp cao tại Hà Nội", tenBiAn: "Lê Văn Tù", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
    { id: 902, maDon: "TH-DEN-002", soCongVan: "CV-2026/THA-112", ngayGui: "05/08/2026", donViGui: "VKS tỉnh Bắc Ninh", loaiDonVi: "VKS", nguoiGui: "Trần Thị Hoa", soBA: "45/2026/HS-ST", toaRaBanAn: "TAND tỉnh Bắc Ninh", tenBiAn: "Phạm Văn Cường", trangThai: "Đã tiếp nhận", ngayNhan: "07/08/2026", nguoiNhan: "Lý Thái Phúc" },
    { id: 903, maDon: "TH-DEN-003", soCongVan: "CV-2026/THA-088", ngayGui: "20/07/2026", donViGui: "TAND tỉnh Long An", loaiDonVi: "Tòa án cấp dưới", nguoiGui: "Hoàng Minh Tuấn", soBA: "11/2026/HS-ST", toaRaBanAn: "TAND tỉnh Long An", tenBiAn: "Nguyễn Thanh Liêm", trangThai: "Từ chối tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
    { id: 904, maDon: "TH-DEN-004", soCongVan: "CV-2026/THA-134", ngayGui: "15/09/2026", donViGui: "VKSNDTC", loaiDonVi: "VKS", nguoiGui: "Lê Thị Bình", soBA: "78/2026/HS-PT", toaRaBanAn: "TAND Cấp cao tại TP.HCM", tenBiAn: "Võ Văn Đại", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" },
  ]);

  const [listKNDi, setListKNDi] = React.useState([
    { id: 1, soHieuKN: "10/2026/QĐKN", ngayKN: "25/07/2026", nguoiKN: "Chánh án TAND Tối cao", soBA: "124/2026/HS-ST", toaRaBanAn: "TAND tỉnh Hà Nam", donViNhan: "VKSNDTC", soCVChuyen: "CV-2026/088", ngayChuyen: "22/07/2026", trangThai: "Đã chuyển" },
    { id: 2, soHieuKN: "12/2026/QĐKN", ngayKN: "18/06/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "102/2026/DS-ST", toaRaBanAn: "TAND quận Hoàn Kiếm", donViNhan: "TAND TP Hà Nội", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chờ chuyển" },
    { id: 3, soHieuKN: "15/2026/QĐKN-HC", ngayKN: "10/05/2026", nguoiKN: "Chánh án TAND Tối cao", soBA: "45/2026/HC-PT", toaRaBanAn: "TAND tỉnh Vĩnh Phúc", donViNhan: "TAND tỉnh Vĩnh Phúc", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chưa chuyển" },
    { id: 4, soHieuKN: "19/2026/QĐKN", ngayKN: "05/08/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "78/2026/HS-PT", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViNhan: "TAND Cấp cao tại Hà Nội", soCVChuyen: "", ngayChuyen: "--", trangThai: "Chưa chuyển" },
  ]);

  const [listKNDen, setListKNDen] = React.useState([
    { id: 101, soHieuKN: "08/2026/QĐKN", ngayKN: "03/07/2026", nguoiKN: "Viện trưởng VKS tỉnh Bắc Ninh", soBA: "236/2026/HS-PT", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViGui: "VKS tỉnh Bắc Ninh", ngayNhan: "24/07/2026", nguoiNhan: "Lý Thái Phúc", trangThai: "Đã nhận" },
    { id: 102, soHieuKN: "14/2026/QĐKN", ngayKN: "25/04/2026", nguoiKN: "Chánh án TAND tỉnh Bắc Ninh", soBA: "18/2026/KDTM-ST", toaRaBanAn: "TAND tỉnh Bắc Ninh", donViGui: "TAND tỉnh Bắc Ninh", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 103, soHieuKN: "21/2026/QĐKN", ngayKN: "12/03/2026", nguoiKN: "Chánh án TAND quận Đống Đa", soBA: "88/2026/HNGĐ-PT", toaRaBanAn: "TAND quận Đống Đa", donViGui: "Văn phòng LS Trí Đức", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 104, soHieuKN: "27/2026/QĐKN", ngayKN: "01/08/2026", nguoiKN: "Viện trưởng VKSNDTC", soBA: "174/2026/HS-ST", toaRaBanAn: "TAND tỉnh Hưng Yên", donViGui: "VKSNDTC", ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" },
    { id: 109, soHieuKN: "41/2026/QĐKN-HC", ngayKN: "06/08/2026", nguoiKN: "Chánh án TAND tỉnh Lâm Đồng", soBA: "29/2026/HC-PT", toaRaBanAn: "TAND tỉnh Lâm Đồng", donViGui: "TAND tỉnh Lâm Đồng", ngayNhan: "07/08/2026", nguoiNhan: "Nguyễn Tiến Mạnh", trangThai: "Đã nhận" },
  ]);

  const [listXetXuLai, setListXetXuLai] = React.useState([
    { id: 201, maVuAn: "VA26-000035", tenVuAn: "Chu Văn An giết người", ketQuaGDT: "Hủy bản án PT, xét xử lại ST", capXuLai: "Sơ thẩm", donViNhan: "TAND tỉnh Long An", soQDGDT: "01/2026/QĐ-GĐT", ngayBanHanh: "15/08/2026", trangThai: "Chờ chuyển" },
    { id: 202, maVuAn: "VA26-000042", tenVuAn: "Nguyễn Văn B trộm cắp", ketQuaGDT: "Hủy bản án ST, xét xử lại PT", capXuLai: "Phúc thẩm", donViNhan: "TAND Cấp cao tại Hà Nội", soQDGDT: "02/2026/QĐ-GĐT", ngayBanHanh: "20/08/2026", trangThai: "Đã chuyển" },
    { id: 203, maVuAn: "VA26-000051", tenVuAn: "Trần Thị C lừa đảo", ketQuaGDT: "Hủy quyết định GĐT, xét xử lại ST", capXuLai: "Sơ thẩm", donViNhan: "TAND TP Hà Nội", soQDGDT: "03/2026/QĐ-GĐT", ngayBanHanh: "01/09/2026", trangThai: "Đã tiếp nhận (PT/ST)" },
  ]);

  const thuHinhChua = listTuHinhDen.filter(x => x.trangThai === "Chưa tiếp nhận").length;
  const knDenCho = listKNDen.filter(x => x.trangThai === "Chờ nhận").length;
  const xxlChoXuLy = listXetXuLai.filter(x => x.trangThai === "Chờ chuyển").length;
  const allRows = [
    ...listTuHinhDen.map(r => ({ ...r, loaiHoSo: "Hồ sơ tử hình", chieu: "Đến", targetTab: "tu-hinh" as MainTab })),
    ...listKNDi.map(r => ({ ...r, loaiHoSo: "Hồ sơ kháng nghị", chieu: "Đi", targetTab: "khang-nghi" as MainTab })),
    ...listKNDen.map(r => ({ ...r, loaiHoSo: "Hồ sơ kháng nghị", chieu: "Đến", targetTab: "khang-nghi" as MainTab })),
    ...listXetXuLai.map(r => ({ ...r, loaiHoSo: "Hồ sơ xét xử lại", chieu: "Đi", targetTab: "xet-xu-lai" as MainTab })),
  ];

  const handleTiepNhanTuHinh = (id: number) => setListTuHinhDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã tiếp nhận", ngayNhan: new Date().toLocaleDateString("vi-VN"), nguoiNhan: "Lý Thái Phúc" } : r));
  const handleTuChoiTuHinh = (id: number, lyDo: string) => { setListTuHinhDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Từ chối tiếp nhận" } : r)); setShowTuChoi(false); alert("Đã từ chối tiếp nhận.\nLý do: " + lyDo); };
  const handleNhanKNDen = (id: number) => setListKNDen(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã nhận", ngayNhan: new Date().toLocaleDateString("vi-VN"), nguoiNhan: "Lý Thái Phúc" } : r));
  const handleXacNhanChuyen = (id: number) => { setListXetXuLai(prev => prev.map(r => r.id === id ? { ...r, trangThai: "Đã chuyển" } : r)); alert("Đã xác nhận chuyển hồ sơ!"); };

  const tongHopCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "LOẠI HỒ SƠ", dataIndex: "loaiHoSo", key: "loaiHoSo", render: (v: string) => <Tag color={v.includes("tử hình") ? "volcano" : v.includes("kháng nghị") ? "blue" : "purple"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "CHIỀU", dataIndex: "chieu", key: "chieu", align: "center" as const, width: 100, render: (v: string) => <Tag color={v === "Đến" ? "green" : "orange"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "ĐƠN VỊ GỬI / NHẬN", key: "donVi", render: (r: any) => <Text strong>{r.donViGui || r.donViNhan || "—"}</Text> },
    { title: "SỐ HIỆU / CÔNG VĂN", key: "soHieu", render: (r: any) => <span style={{ color: "#0f766e", fontWeight: 600 }}>{r.soCongVan || r.soHieuKN || r.soQDGDT || "—"}</span> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "CHI TIẾT", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => <Button type="link" onClick={() => { setActiveMain(r.targetTab); if (r.targetTab === "khang-nghi") setKNSubTab(r.chieu === "Đi" ? "di" : "den"); }}>Xem</Button> }
  ];

  const tuHinhCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "SỐ CÔNG VĂN / NGÀY GỬI", key: "soCongVan", render: (r: any) => <div><div style={{ color: "#0f766e", fontWeight: 600 }}>{r.soCongVan}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày gửi: {r.ngayGui}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Người gửi: {r.nguoiGui}</div></div> },
    { title: "ĐƠN VỊ GỬI", key: "donViGui", render: (r: any) => <div><div style={{ fontWeight: 600 }}>{r.donViGui}</div><div style={{ marginTop: 4 }}><Tag color="blue">{r.loaiDonVi}</Tag></div></div> },
    { title: "HỒ SƠ VỤ ÁN", key: "hoSo", render: (r: any) => <div><div style={{ fontWeight: 600 }}>Bị án: {r.tenBiAn}</div><div style={{ color: "#2563eb", fontSize: 13 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 200, render: (_: any, r: any) => (
      r.trangThai === "Chưa tiếp nhận" ? (
        <Space>
          <Button type="primary" size="small" onClick={() => handleTiepNhanTuHinh(r.id)}>Tiếp nhận</Button>
          <Button danger size="small" onClick={() => { setSelectedRecord(r); setShowTuChoi(true); }}>Từ chối</Button>
        </Space>
      ) : r.trangThai === "Đã tiếp nhận" ? (
        <div style={{ fontSize: 13, color: "#6b7280" }}>Người nhận: {r.nguoiNhan}<br/>{r.ngayNhan}</div>
      ) : <span style={{ color: "#7c3aed", fontStyle: "italic", fontSize: 13 }}>Đã từ chối</span>
    )}
  ];

  const knDenCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "THÔNG TIN KHÁNG NGHỊ", key: "thongTin", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.soHieuKN}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày: {r.ngayKN}</div><div style={{ fontSize: 13 }}>{r.nguoiKN}</div></div> },
    { title: "SỐ BẢN ÁN", key: "soBA", render: (r: any) => <div><div style={{ color: "#2563eb", fontWeight: 600 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "ĐƠN VỊ GỬI / NGƯỜI NHẬN", key: "donVi", render: (r: any) => <div><div><b>Gửi:</b> {r.donViGui}</div><div style={{ fontSize: 13, color: "#6b7280" }}><b>Nhận:</b> {r.nguoiNhan} ({r.ngayNhan})</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 140, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => r.trangThai === "Chờ nhận" && <Button type="primary" size="small" onClick={() => handleNhanKNDen(r.id)}>Nhận</Button> }
  ];

  const knDiCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "THÔNG TIN KHÁNG NGHỊ", key: "thongTin", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.soHieuKN}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ngày: {r.ngayKN}</div><div style={{ fontSize: 13 }}>{r.nguoiKN}</div></div> },
    { title: "SỐ BẢN ÁN", key: "soBA", render: (r: any) => <div><div style={{ color: "#2563eb", fontWeight: 600 }}>{r.soBA}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.toaRaBanAn}</div></div> },
    { title: "ĐƠN VỊ NHẬN / CÔNG VĂN", key: "donVi", render: (r: any) => <div><div><b>Nhận:</b> {r.donViNhan}</div><div style={{ fontSize: 13, marginTop: 4 }}>{r.soCVChuyen ? <span style={{ color: "#0284c7", fontWeight: 600 }}>{r.soCVChuyen} ({r.ngayChuyen})</span> : <span style={{ color: "#d97706", fontStyle: "italic" }}>Chưa có công văn</span>}</div></div> },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 140, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 100, render: (_: any, r: any) => <Button type="link" danger size="small" onClick={() => { setSelectedRecord(r); setShowTrinhKy(true); }}>Trình ký</Button> }
  ];

  const xxlCols = [
    { title: "STT", key: "stt", width: 60, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: "VỤ ÁN", key: "vuAn", render: (r: any) => <div><div style={{ fontWeight: 600 }}>{r.maVuAn}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{r.tenVuAn}</div></div> },
    { title: "KẾT QUẢ GĐT / QUYẾT ĐỊNH", key: "kq", render: (r: any) => <div><div style={{ color: RED, fontWeight: 600 }}>{r.ketQuaGDT}</div><div style={{ fontSize: 13, color: "#6b7280" }}>QĐ: {r.soQDGDT}</div><div style={{ fontSize: 13, color: "#6b7280" }}>Ban hành: {r.ngayBanHanh}</div></div> },
    { title: "CẤP XỬ LẠI", dataIndex: "capXuLai", key: "capXuLai", align: "center" as const, width: 120, render: (v: string) => <Tag color={v === "Sơ thẩm" ? "gold" : "blue"} style={{ fontWeight: 600 }}>{v}</Tag> },
    { title: "ĐƠN VỊ NHẬN", dataIndex: "donViNhan", key: "donViNhan" },
    { title: "TRẠNG THÁI", dataIndex: "trangThai", key: "trangThai", align: "center" as const, width: 160, render: (v: string) => <TrangThaiBadge tt={v} /> },
    { title: "THAO TÁC", key: "action", align: "center" as const, width: 140, render: (_: any, r: any) => r.trangThai === "Chờ chuyển" ? <Button type="primary" size="small" onClick={() => handleXacNhanChuyen(r.id)}>Xác nhận</Button> : <span style={{ color: "#6b7280", fontSize: 13 }}>{r.trangThai}</span> }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, fontFamily: F, borderRadius: 6 } }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0f2f5", flex: 1, fontFamily: F }}>
        <div style={{ padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={4} style={{ margin: 0, color: RED, fontWeight: 700 }}>Quản lý hồ sơ tiếp nhận</Title>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Trang chủ / Quản lý án GĐT/TT / Quản lý hồ sơ tiếp nhận</div>
          </div>
          <Space>
            <Input.Search placeholder="Tìm kiếm hồ sơ, số hiệu..." style={{ width: 250 }} />
            <Button type="primary">Tải lại dữ liệu</Button>
          </Space>
        </div>
        
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Card 
            bordered={false} 
            style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            styles={{ body: { padding: "16px 24px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } }}
          >
            <Tabs 
              activeKey={activeMain} 
              onChange={(k: any) => setActiveMain(k as MainTab)}
              type="card"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
              items={[
                {
                  key: "tong-hop",
                  label: `Tổng hợp (${allRows.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                        <Col span={6}>
                          <Card bordered={false} style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8 }}>
                            <Statistic title={<span style={{ color: "#991b1b", fontWeight: 600 }}>Tử hình chờ tiếp nhận</span>} value={thuHinhChua} valueStyle={{ color: "#dc2626", fontWeight: 700, fontSize: 28 }} />
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card bordered={false} style={{ background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 8 }}>
                            <Statistic title={<span style={{ color: "#92400e", fontWeight: 600 }}>Kháng nghị chờ nhận</span>} value={knDenCho} valueStyle={{ color: "#d97706", fontWeight: 700, fontSize: 28 }} />
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card bordered={false} style={{ background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 8 }}>
                            <Statistic title={<span style={{ color: "#1e40af", fontWeight: 600 }}>KN chờ chuyển</span>} value={listKNDi.filter(x => x.trangThai !== "Đã chuyển").length} valueStyle={{ color: "#2563eb", fontWeight: 700, fontSize: 28 }} />
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card bordered={false} style={{ background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 8 }}>
                            <Statistic title={<span style={{ color: "#5b21b6", fontWeight: 600 }}>Xét xử lại chờ chuyển</span>} value={xxlChoXuLy} valueStyle={{ color: "#7c3aed", fontWeight: 700, fontSize: 28 }} />
                          </Card>
                        </Col>
                      </Row>
                      <Table 
                        columns={tongHopCols} 
                        dataSource={allRows} 
                        rowKey={(r: any) => r.loaiHoSo + r.id} 
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        size="middle"
                        scroll={{ y: "calc(100vh - 420px)" }}
                        bordered
                      />
                    </div>
                  )
                },
                {
                  key: "tu-hinh",
                  label: `Hồ sơ tử hình (${listTuHinhDen.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
                        <Space>
                          <Title level={5} style={{ margin: 0 }}>Hồ sơ tử hình đến</Title>
                          <Tag color="error" style={{ margin: 0 }}>{thuHinhChua} chờ tiếp nhận</Tag>
                        </Space>
                        <Space>
                          <Select defaultValue="all" style={{ width: 150 }}>
                            <Select.Option value="all">Tất cả trạng thái</Select.Option>
                            <Select.Option value="chuatiepnhan">Chưa tiếp nhận</Select.Option>
                            <Select.Option value="datiepnhan">Đã tiếp nhận</Select.Option>
                          </Select>
                          <Button type="primary" onClick={() => setShowNhapTay("tu-hinh")}>+ Nhập tay hồ sơ (VKS / Khác)</Button>
                        </Space>
                      </div>
                      <Table 
                        columns={tuHinhCols} 
                        dataSource={listTuHinhDen} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        scroll={{ y: "calc(100vh - 360px)" }}
                        bordered
                      />
                    </div>
                  )
                },
                {
                  key: "khang-nghi",
                  label: `Hồ sơ kháng nghị (${listKNDi.length + listKNDen.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
                        <Space size="middle">
                          <Button 
                            type={kNSubTab === "den" ? "primary" : "default"} 
                            danger={kNSubTab === "den"} 
                            onClick={() => setKNSubTab("den")}
                            style={{ fontWeight: 600 }}
                          >
                            Hồ sơ đến <Tag color={kNSubTab === "den" ? "#fff" : "default"} style={{ color: kNSubTab === "den" ? RED : undefined, marginLeft: 8, border: 0 }}>{listKNDen.length}</Tag>
                          </Button>
                          <Button 
                            type={kNSubTab === "di" ? "primary" : "default"} 
                            danger={kNSubTab === "di"} 
                            onClick={() => setKNSubTab("di")}
                            style={{ fontWeight: 600 }}
                          >
                            Hồ sơ đi <Tag color={kNSubTab === "di" ? "#fff" : "default"} style={{ color: kNSubTab === "di" ? RED : undefined, marginLeft: 8, border: 0 }}>{listKNDi.length}</Tag>
                          </Button>
                        </Space>
                        <Space>
                          {kNSubTab === "den" && <Button onClick={() => setShowNhapTay("khang-nghi")}>Nhập tay (VKS/Khác)</Button>}
                          {kNSubTab === "den" && <Button type="primary" onClick={() => { const f = listKNDen.find(x => x.trangThai === "Chờ nhận"); if (f) handleNhanKNDen(f.id); }}>Nhận hồ sơ</Button>}
                          {kNSubTab === "den" && <Button danger onClick={() => setShowTraHoSo(true)}>Trả hồ sơ</Button>}
                          
                          {kNSubTab === "di" && <Button onClick={() => onTaoCongVan?.()}>Tạo công văn chuyển</Button>}
                          {kNSubTab === "di" && <Button type="primary" danger onClick={() => alert("Chuyển hồ sơ kháng nghị...")}>Chuyển hồ sơ</Button>}
                        </Space>
                      </div>
                      <Table 
                        rowSelection={{ type: "checkbox" }}
                        columns={kNSubTab === "den" ? knDenCols : knDiCols} 
                        dataSource={kNSubTab === "den" ? listKNDen : listKNDi} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        scroll={{ y: "calc(100vh - 360px)" }}
                        bordered
                      />
                    </div>
                  )
                },
                {
                  key: "xet-xu-lai",
                  label: `Hồ sơ xét xử lại (GĐT) (${listXetXuLai.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
                        <Space>
                          <Title level={5} style={{ margin: 0 }}>Hồ sơ GĐT chuyển xuống PT/ST xét xử lại</Title>
                          <Tag color="purple" style={{ margin: 0 }}>{xxlChoXuLy} chờ chuyển</Tag>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 13 }}>Tự động khởi tạo khi quyết định GĐT hủy án được ban hành chính thức.</Text>
                      </div>
                      <Table 
                        columns={xxlCols} 
                        dataSource={listXetXuLai} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        scroll={{ y: "calc(100vh - 360px)" }}
                        bordered
                      />
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </div>

        {showTuChoi && selectedRecord && <ModalTuChoiTiepNhan onClose={() => setShowTuChoi(false)} onConfirm={lyDo => handleTuChoiTuHinh(selectedRecord.id, lyDo)} />}
        {showNhapTay && <ModalNhapTayHoSoDen loaiHoSo={showNhapTay} onClose={() => setShowNhapTay(null)} onSave={data => {
          if (showNhapTay === "tu-hinh") {
            setListTuHinhDen(prev => [...prev, { id: data.id, maDon: `TH-${Date.now()}`, soCongVan: data.soCongVan, ngayGui: data.ngayGui || "—", donViGui: data.tenDonVi, loaiDonVi: data.loaiDonVi, nguoiGui: data.nguoiGui, soBA: "—", toaRaBanAn: "—", tenBiAn: "—", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" }]);
          } else {
            setListKNDen(prev => [...prev, { id: data.id, soHieuKN: data.soCongVan, ngayKN: data.ngayGui || "—", nguoiKN: data.nguoiGui, soBA: "—", toaRaBanAn: "—", donViGui: data.tenDonVi, ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" }]);
          }
          setShowNhapTay(null);
          alert("Đã lưu hồ sơ nhập tay!");
        }} />}
        {showTraHoSo && <ModalTraHoSo onClose={() => setShowTraHoSo(false)} onConfirm={lyDo => { setShowTraHoSo(false); alert("Đã trả lại hồ sơ.\nLý do: " + lyDo); }} />}
        {showTrinhKy && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKy(false)} />}
      </div>
    </ConfigProvider>
  );
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) { console.error(error, errorInfo); }
  render() { 
    if (this.state.hasError) { 
      return <div style={{padding:50, color:'red', background:'white', zIndex: 9999, position: 'absolute', inset: 0}}><h1>ERROR</h1><pre>{this.state.error.toString()}</pre><pre>{this.state.error.stack}</pre></div>; 
    } 
    return this.props.children; 
  }
}

export default function SafeHoSoKhangNghiView(props: any) {
  return <ErrorBoundary><HoSoKhangNghiView {...props} /></ErrorBoundary>;
}
