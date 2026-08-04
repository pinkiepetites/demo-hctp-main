import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";

// ── Tạo tờ trình modal ────────────────────────────────────────────────────────
export function TaoToTrinhModal({ onClose }: { onClose: () => void }) {
  const [ngayLap, setNgayLap] = useState("");
  const [tomTat, setTomTat] = useState("");
  const [dienBien, setDienBien] = useState("");
  const [deXuatRows, setDeXuatRows] = useState([
    { id: 1, don: "Trần Văn Hùng\nTLM: 10 – 22/05/2026", loai: "Tra-loi-don", noiDung: "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC. Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh." },
    { id: 2, don: "Trần Văn Hùng\nTLM: 10 – 22/05/2026", loai: "Xep-don", noiDung: "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC. Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC." },
  ]);

  const inSt: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 820, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 24px" }}>
              <div style={{ fontSize: 11, fontFamily: F, display: "flex", flexDirection: "column", gap: 4 }}>
                <span><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-002039</b></span>
                <span><span style={{ color: MUTED }}>Tên vụ án: </span>Vụ án Nguyễn Văn Minh – Tội cướp tài sản</span>
                <span><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Nguyễn Văn Minh</span>
                <span><span style={{ color: MUTED }}>Tội danh chính: </span>Tội cướp tài sản</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: F, display: "flex", flexDirection: "column", gap: 4, color: "#0f766e" }}>
                <span><span style={{ color: MUTED }}>Số BA/QĐ: </span>124/2025/HSPT</span>
                <span><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>20/12/2025</span>
                <span><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân cấp cao tại Hà Nội</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: F, display: "flex", flexDirection: "column", gap: 4, color: "#0f766e" }}>
                <span><span style={{ color: MUTED }}>Giai đoạn: </span>Giám đốc thẩm</span>
                <span><span style={{ color: MUTED }}>Tòa án giải quyết: </span>Tòa án nhân dân tối cao</span>
                <span><span style={{ color: "#374151" }}>Trạng thái: </span><span style={{ fontWeight: 600 }}>Chưa có kết quả giải quyết đơn</span></span>
              </div>
            </div>
          </div>

          {/* Ngày lập */}
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}><span style={{ color: RED }}>*</span> Ngày lập tờ trình</span>
            <div style={{ position: "relative", maxWidth: 180 }}>
              <input value={ngayLap} onChange={e => setNgayLap(e.target.value)} placeholder="dd/mm/yyyy" style={inSt} />
            </div>
          </div>

          {/* I. Nội dung vụ án */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>I. NỘI DUNG VỤ ÁN</div>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 }}><span style={{ color: RED }}>*</span> Tóm tắt nội dung</span>
            <textarea value={tomTat} onChange={e => setTomTat(e.target.value)} placeholder="Nhập tóm tắt nội dung vụ án"
              style={{ ...inSt, minHeight: 88, resize: "vertical" }} />
          </div>

          {/* II. Quá trình giải quyết */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>II. QUÁ TRÌNH GIẢI QUYẾT</div>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 4 }}><span style={{ color: RED }}>*</span> Diễn biến quá trình giải quyết</span>
            <textarea value={dienBien} onChange={e => setDienBien(e.target.value)} placeholder="Nhập quá trình giải quyết vụ án"
              style={{ ...inSt, minHeight: 88, resize: "vertical" }} />
          </div>

          {/* III. Đề xuất giải quyết */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${BORDER}`, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>III. ĐỀ XUẤT GIẢI QUYẾT CỦA THẨM TRA VIÊN</span>
              <button
                onClick={() => setDeXuatRows(p => [...p, { id: Date.now(), don: "Trần Văn Hùng\nTLM: 10 – 22/05/2026", loai: "Tra-loi-don", noiDung: "" }])}
                style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>
                Thêm đơn xử lý
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "60%" }} />
                <col style={{ width: 52 }} />
              </colgroup>
              <thead>
                <tr>
                  {["STT","Đơn","Đề xuất giải quyết Thẩm tra viên","Thao tác"].map(h => (
                    <th key={h} style={TH_STYLE}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deXuatRows.map((r, idx) => (
                  <tr key={`dx-${r.id}`} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ fontSize: 13 }}>📄</span>
                        <div style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.5 }}>
                          {r.don.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                      </div>
                    </td>
                    <td style={TD_STYLE}>
                      <select defaultValue={r.loai} style={{ ...inSt, marginBottom: 6, fontSize: 11 }}>
                        <option value="Tra-loi-don">Trả lời đơn</option>
                        <option value="Xep-don">Xếp đơn</option>
                        <option value="Chuyen-don">Chuyển đơn</option>
                      </select>
                      <textarea defaultValue={r.noiDung} style={{ ...inSt, fontSize: 11, minHeight: 72, resize: "vertical" }} />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: MUTED }}>◇</button>
                        <button onClick={() => setDeXuatRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#ef4444" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
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
      <FileText size={40} color="#d1d5db" />
      <span style={{ fontSize: 14 }}>{label} – Chưa có dữ liệu</span>
    </div>
  );
}
