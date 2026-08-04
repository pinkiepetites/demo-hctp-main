import React, { useState } from "react";
import { FileText } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";

export function TaoDuThaoModal({ onClose }: { onClose: () => void }) {
  type KetQua = "tra-loi" | "khang-nghi";
  const [ketQua, setKetQua] = useState<KetQua>("tra-loi");

  // Đơn liên quan picker
  const DON_LIST = [
    {
      id: "don-1",
      label: "Hoàng Anh, số TL: 123457, ngày TL: 04/05/2026",
      nguoi: ["Hoàng Anh"],
    },
    {
      id: "don-2",
      label: "Hoàng Anh, số TL: 123458, ngày TL: 04/05/2026",
      nguoi: ["Hoàng Anh", "Trần Văn Hùng"],
    },
    {
      id: "don-3",
      label: "Phạm Minh Tuấn, số TL: 123459, ngày TL: 05/05/2026",
      nguoi: ["Phạm Minh Tuấn"],
    },
  ];
  const [donOpen, setDonOpen] = useState(false);
  const [donExpanded, setDonExpanded] = useState<Record<string, boolean>>({});
  // true = cả đơn được chọn; per-nguoi: "don-1::Hoàng Anh" = true
  const [donChecked, setDonChecked] = useState<Record<string, boolean>>({ "don-1": true, "don-2": true });

  const toggleDon = (id: string) => {
    setDonChecked(prev => {
      const next = { ...prev };
      const donNguoi = DON_LIST.find(d => d.id === id)!.nguoi;
      const newVal = !prev[id];
      next[id] = newVal;
      // clear individual nguoi selections when toggling whole don
      donNguoi.forEach(n => { delete next[`${id}::${n}`]; });
      return next;
    });
  };
  const toggleNguoi = (donId: string, nguoi: string) => {
    setDonChecked(prev => {
      const next = { ...prev };
      const key = `${donId}::${nguoi}`;
      next[key] = !prev[key];
      // if whole don was checked, uncheck it and check all except this one
      if (prev[donId]) {
        const don = DON_LIST.find(d => d.id === donId)!;
        next[donId] = false;
        don.nguoi.forEach(n => { if (n !== nguoi) next[`${donId}::${n}`] = true; });
        next[key] = false;
      }
      return next;
    });
  };
  const getSelectedLabel = () => {
    const parts: string[] = [];
    DON_LIST.forEach(d => {
      if (donChecked[d.id]) {
        parts.push(d.label);
      } else {
        d.nguoi.forEach(n => {
          if (donChecked[`${d.id}::${n}`]) parts.push(`${n} (${d.label})`);
        });
      }
    });
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return `${parts.length} đơn/người được chọn`;
  };

  // Nơi nhận – trả lời đơn defaults
  const [nnTraLoi, setNnTraLoi] = useState([
    { id: 1, noiNhan: "Khác", chiTiet: "Như kính gửi", ghiChu: "–" },
    { id: 2, noiNhan: "Tòa án nhân dân", chiTiet: "Đ/c Chánh án TANDTC", ghiChu: "để báo cáo" },
  ]);
  // Nơi nhận – kháng nghị defaults
  const [nnKhangNghi, setNnKhangNghi] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án" },
  ]);

  const [addingRow, setAddingRow] = useState(false);
  const [newGhiChu, setNewGhiChu] = useState("");

  const isTraLoi = ketQua === "tra-loi";
  const noiNhanRows = isTraLoi ? nnTraLoi : nnKhangNghi;
  const setNoiNhanRows = isTraLoi ? setNnTraLoi : setNnKhangNghi;

  const inSt: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const lblSt: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 };

  const RADIO_OPTIONS: { value: KetQua; label: string }[] = [
    { value: "tra-loi", label: "Trả lời đơn" },
    { value: "khang-nghi", label: "Kháng nghị" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "min(900px, 96vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: F, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <FileText size={16} color={RED} style={{ marginRight: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Tạo Dự thảo</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: MUTED, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#f0fdf4", border: `1px solid #bbf7d0`, borderRadius: 6, padding: "10px 16px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px", fontSize: 11 }}>
            <div><span style={{ color: MUTED }}>Mã vụ án: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>VA26-00321</span></div>
            <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>050526_CTH02</span></div>
            <div><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
            <div><span style={{ color: MUTED }}>Tên vụ án: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Vụ án Phan Văn Thành – bức cung</span></div>
            <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>05/05/2026</span></div>
            <div><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Tòa án nhân dân tối cao</span></div>
            <div><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Phan Văn Thành</span></div>
            <div><span style={{ color: MUTED }}>Tòa xét xử: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Tòa án nhân dân tỉnh Hải Phòng</span></div>
            <div><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#dc2626", fontWeight: 600 }}>Chưa có kết quả xét xử</span></div>
            <div><span style={{ color: MUTED }}>Tội danh chính: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Bức cung</span></div>
          </div>

          {/* Thông tin đơn */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F }}>Thông tin đơn</span>
          </div>
          <div style={{ marginBottom: 12, position: "relative" }}>
            <label style={lblSt}><span style={{ color: RED }}>*</span> Đơn liên quan</label>
            {/* Trigger */}
            <div
              onClick={() => setDonOpen(o => !o)}
              style={{ ...inSt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: getSelectedLabel() ? TEXT : MUTED }}>
                {getSelectedLabel() || "Chọn đơn liên quan..."}
              </span>
              <span style={{ fontSize: 10, color: MUTED, marginLeft: 6 }}>▼</span>
            </div>
            {/* Dropdown panel */}
            {donOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 260, overflowY: "auto" }}>
                {DON_LIST.map(don => {
                  const isWholeDonChecked = !!donChecked[don.id];
                  const isExpanded = !!donExpanded[don.id];
                  const anyNguoiChecked = don.nguoi.some(n => donChecked[`${don.id}::${n}`]);
                  return (
                    <div key={don.id}>
                      {/* Đơn row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${BORDER}`, background: isWholeDonChecked || anyNguoiChecked ? "#fef9f9" : "#fff" }}>
                        <input
                          type="checkbox"
                          checked={isWholeDonChecked}
                          ref={el => { if (el) el.indeterminate = !isWholeDonChecked && anyNguoiChecked; }}
                          onChange={() => toggleDon(don.id)}
                          style={{ accentColor: RED, cursor: "pointer", flexShrink: 0 }}
                        />
                        <span style={{ flex: 1, fontSize: 12, color: TEXT, fontFamily: F, wordBreak: "break-word" }}>{don.label}</span>
                        {/* Expand toggle to pick individual nguoi */}
                        <button
                          onClick={e => { e.stopPropagation(); setDonExpanded(p => ({ ...p, [don.id]: !p[don.id] })); }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, padding: "2px 4px", flexShrink: 0 }}
                          title="Chọn từng người đứng đơn">
                          {isExpanded ? "▲ Thu gọn" : "▼ Chọn người"}
                        </button>
                      </div>
                      {/* Người đứng đơn sub-rows */}
                      {isExpanded && don.nguoi.map(nguoi => (
                        <div key={nguoi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 32px", borderBottom: `1px solid ${BORDER}`, background: donChecked[`${don.id}::${nguoi}`] ? "#fff5f5" : "#fafafa" }}>
                          <input
                            type="checkbox"
                            checked={!!donChecked[`${don.id}::${nguoi}`] || isWholeDonChecked}
                            onChange={() => toggleNguoi(don.id, nguoi)}
                            style={{ accentColor: RED, cursor: "pointer", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>👤 {nguoi}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px", borderTop: `1px solid ${BORDER}` }}>
                  <button onClick={() => setDonOpen(false)} style={{ padding: "5px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>Xác nhận</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lblSt}><span style={{ color: RED }}>*</span> Kết quả giải quyết đơn</label>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              {RADIO_OPTIONS.map(o => (
                <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="radio" name="ketqua" checked={ketQua === o.value} onChange={() => { setKetQua(o.value); setAddingRow(false); }} style={{ accentColor: RED }} />
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          {/* Thông tin quyết định – layout thay đổi theo loại */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F }}>Thông tin quyết định</span>
          </div>

          {isTraLoi ? (
            <>
              {/* Trả lời đơn: 4 fields in one row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lblSt}>Ngày quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input type="text" placeholder="Chọn ngày quyết định" style={{ ...inSt, paddingRight: 30 }} />
                    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: MUTED, pointerEvents: "none" }}>📅</span>
                  </div>
                </div>
                <div>
                  <label style={lblSt}>Số quyết định</label>
                  <input type="text" placeholder="Nhập số quyết định" style={inSt} />
                </div>
                <div>
                  <label style={lblSt}><span style={{ color: RED }}>*</span> Người ký ban hành</label>
                  <select style={inSt}><option value="">Chọn người ký</option><option>Nguyễn Hòa Bình – Chánh án</option><option>Lê Minh Trí – Phó Chánh án</option></select>
                </div>
                <div>
                  <label style={lblSt}>Ngày phát hành</label>
                  <div style={{ position: "relative" }}>
                    <input type="text" placeholder="Chọn ngày quyết định" style={{ ...inSt, paddingRight: 30 }} />
                    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: MUTED, pointerEvents: "none" }}>📅</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lblSt}><span style={{ color: RED }}>*</span> Nội dung trả lời</label>
                <textarea placeholder="Nhập nội dung trả lời" style={{ ...inSt, minHeight: 80, resize: "vertical" }} />
              </div>
            </>
          ) : (
            <>
              {/* Kháng nghị: layout 3 cột gốc */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lblSt}><span style={{ color: RED }}>*</span> Ngày quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input type="text" placeholder="Chọn ngày quyết định" style={{ ...inSt, paddingRight: 30 }} />
                    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: MUTED, pointerEvents: "none" }}>📅</span>
                  </div>
                </div>
                <div>
                  <label style={lblSt}>Số quyết định</label>
                  <input type="text" placeholder="Nhập số quyết định" style={inSt} />
                </div>
                <div>
                  <label style={lblSt}><span style={{ color: RED }}>*</span> Người ký ban hành</label>
                  <select style={inSt}><option value="">Chọn người ký</option><option>Nguyễn Hòa Bình – Chánh án</option><option>Lê Minh Trí – Phó Chánh án</option></select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lblSt}><span style={{ color: RED }}>*</span> Thẩm quyền xét xử</label>
                  <select style={inSt}><option value="">Chọn thẩm quyền xét xử</option><option>Giám đốc thẩm</option><option>Tái thẩm</option></select>
                </div>
                <div>
                  <label style={lblSt}>Ngày phát hành</label>
                  <input type="text" placeholder="--/--/----" style={inSt} />
                </div>
                <div>
                  <label style={lblSt}>Nội dung vụ án</label>
                  <input type="text" placeholder="Nhập nội dung" style={inSt} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lblSt}><span style={{ color: RED }}>*</span> Xét thấy</label>
                <textarea placeholder="Nhập nhận xét, phân tích" style={{ ...inSt, minHeight: 90, resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lblSt}><span style={{ color: RED }}>*</span> Quyết định</label>
                <select style={{ ...inSt, maxWidth: 320 }}>
                  <option>Hủy bản án/quyết định hình sự đã có hiệu lực</option>
                  <option>Giữ nguyên bản án</option>
                  <option>Sửa bản án</option>
                </select>
              </div>
            </>
          )}

          {/* Nơi nhận */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <label style={{ ...lblSt, marginBottom: 0 }}><span style={{ color: RED }}>*</span> Nơi nhận</label>
            <button onClick={() => setAddingRow(true)} style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>Thêm nơi nhận</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: 4 }}>
            <colgroup>
              <col style={{ width: 48 }} /><col style={{ width: "25%" }} /><col style={{ width: "28%" }} /><col style={{ width: "28%" }} /><col style={{ width: "19%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT","NƠI NHẬN","NƠI NHẬN CHI TIẾT","GHI CHÚ","THAO TÁC"].map(h => (
                  <th key={h} style={{ ...TH_STYLE, fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noiNhanRows.map((r, idx) => (
                <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 11 }}>{idx + 1}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11 }}>{r.noiNhan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11 }}>{r.chiTiet}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11 }}>{r.ghiChu}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", fontSize: 11 }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontFamily: F, fontSize: 11 }}>✏ Sửa</button>
                      <button onClick={() => setNoiNhanRows((p: typeof noiNhanRows) => p.filter((x: typeof r) => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontFamily: F, fontSize: 11 }}>🗑 Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {addingRow && (
                <tr>
                  <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 11 }}>{noiNhanRows.length + 1}</td>
                  <td style={TD_STYLE}><select style={{ ...inSt, fontSize: 11 }}><option value="">Chọn nơi nhận</option><option>Khác</option><option>Tòa án nhân dân</option><option>Viện kiểm sát</option><option>Đương sự</option></select></td>
                  <td style={TD_STYLE}><select style={{ ...inSt, fontSize: 11 }}><option value="">Chọn</option><option>VKSNDTC</option><option>TANDTC</option><option>Như kính gửi</option></select></td>
                  <td style={TD_STYLE}><input type="text" placeholder="Nhập ghi chú" style={{ ...inSt, fontSize: 11 }} value={newGhiChu} onChange={e => setNewGhiChu(e.target.value)} /></td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", fontSize: 11 }}>
                      <button onClick={() => { setNoiNhanRows((p: typeof noiNhanRows) => [...p, { id: Date.now(), noiNhan: "Nơi nhận", chiTiet: "Chi tiết", ghiChu: newGhiChu }]); setAddingRow(false); setNewGhiChu(""); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#16a34a", fontFamily: F, fontSize: 11 }}>Lưu</button>
                      <button onClick={() => setAddingRow(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontFamily: F, fontSize: 11 }}>Hủy</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer – dynamic based on loại */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          <button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          {isTraLoi && (
            <button style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lấy số</button>
          )}
          {isTraLoi && (
            <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          )}
          <button style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
        </div>
      </div>
    </div>
  );
}
