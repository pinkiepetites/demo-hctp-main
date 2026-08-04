import React, { useState } from "react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";

export function HoSoToTrinhModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState("hoa-pdf");
  const folders = [
    { key: "tai-lieu", label: "Tài liệu đánh dấu", count: 0, icon: "📁" },
    { key: "tieu-ho-so", label: "Tiểu hồ sơ", count: 1, icon: "📁" },
    { key: "ths1", label: "THS1", count: 0, icon: "📁" },
  ];
  const files = [
    { key: "hoa-pdf", label: "Hoa", type: "PDF", size: "391 KB", icon: "📄" },
    { key: "hoa-word", label: "Hoa", type: "Word", size: "400 KB", icon: "📝" },
    { key: "cong-van", label: "Công văn gửi nội bộ", type: "PDF", size: "714 KB", icon: "📄" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1100, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: TEXT, fontFamily: F }}>
          ← Hồ sơ tờ trình
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 280, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* toolbar */}
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderBottom: `1px solid ${BORDER}` }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>⬆</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>☰</button>
            <span style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>📄 Hoa</span>
          </div>
          {/* sort tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, fontWeight: 600, padding: "8px 12px", borderBottom: `2px solid ${RED}`, cursor: "pointer" }}>Giai đoạn hiện tại</span>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, padding: "8px 12px", cursor: "pointer" }}>Các giai đoạn còn lại</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {folders.map(f => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                <span>▶</span><span>{f.icon}</span>
                <span style={{ flex: 1 }}>{f.label}</span>
                <span style={{ fontSize: 11, color: MUTED }}>{f.count}</span>
                <span style={{ fontSize: 11, color: MUTED }}>⋮</span>
              </div>
            ))}
            {/* Open folder */}
            <div style={{ padding: "7px 12px", fontSize: 12, color: TEXT, fontFamily: F }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer" }}>
                <span>▼</span><span>📁</span><span>03/06/2026</span>
                <span style={{ marginLeft: "auto", background: "#374151", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px" }}>3</span>
              </div>
              {files.map(f => (
                <div key={f.key}
                  onClick={() => setSelected(f.key)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px 6px 24px", borderRadius: 4, cursor: "pointer", background: selected === f.key ? "#fce7e7" : "none", marginBottom: 2 }}
                  onMouseEnter={e => { if (selected !== f.key) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (selected !== f.key) e.currentTarget.style.background = "none"; }}>
                  <input type="checkbox" readOnly checked={selected === f.key} style={{ cursor: "pointer" }} />
                  <span>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: selected === f.key ? 600 : 400, color: TEXT }}>{f.label}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{f.type} · {f.size}</div>
                  </div>
                  <span style={{ fontSize: 11, color: MUTED }}>☆</span>
                  <span style={{ fontSize: 11, color: MUTED }}>⋮</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px", borderTop: `1px solid ${BORDER}` }}>
            <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          </div>
        </div>
        {/* Right – PDF preview */}
        <div style={{ flex: 1, background: "#e5e7eb", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>🔍+</button>
            <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>190%</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>🔍-</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>1 / 15</span>
            <div style={{ flex: 1 }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>⬇</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>🖨</button>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 32 }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 680, padding: "40px 60px", boxShadow: "0 2px 16px rgba(0,0,0,0.12)", fontFamily: "serif", lineHeight: 1.8 }}>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>PHỤ LỤC I</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>TỜ TRÌNH THẨM TRA VỤ ÁN HÌNH SỰ</div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, marginBottom: 24 }}>(Kèm theo Quyết định số 75/QĐ-CA ngày 06 tháng 4 năm 2026 của Chánh án Tòa án nhân dân tối cao)</div>
              <hr style={{ border: "none", borderTop: "1px solid #000", marginBottom: 24 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>TÒA ÁN NHÂN DÂN TỐI CAO<br />VỤ GIÁM ĐỐC, KIỂM TRA ....</div>
                <div style={{ textAlign: "right", fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div>Độc lập - Tự do - Hạnh phúc</div>
                  <hr style={{ border: "none", borderTop: "1px solid #000", margin: "4px 0" }} />
                  <div style={{ fontStyle: "italic" }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
                </div>
              </div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>TỜ TRÌNH</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ fontStyle: "italic", fontSize: 12 }}>Về vụ án Nguyễn Văn A bị kết án về tội "......"¹ ở tỉnh, thành phố.....<br />Bản án ... số .... ngày .... của<br />Tòa án nhân dân ....²</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>1. Người bị kết án</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Trình ký – Tab Thông tin tờ trình ─────────────────────────────────────────
export function TrinhKyThongTinTab() {
  const [selected, setSelected] = useState("tong-hop");
  const docs = [
    {
      key: "tong-hop",
      label: "Tờ trình thẩm tra vụ việc",
      date: null,
      isDefault: true,
    },
    {
      key: "phieu-chanh-an",
      label: "Phiếu ký – Chánh án Nguyễn Hòa Bình",
      date: "15/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-ca-mai",
      label: "Phiếu ký – Phó Chánh án Nguyễn Thị Mai",
      date: "13/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-vu-truong",
      label: "Phiếu ký – Vụ trưởng Lê Quang Minh",
      date: "11/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-vt-hoa",
      label: "Phiếu ký – Phó Vụ trưởng Trần Thị Hoa",
      date: "09/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-tp-hiep",
      label: "Phiếu ký – Thẩm phán Nguyễn Tiến Hiệp",
      date: "08/07/2026",
      isDefault: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: -6 }}>
      {docs.map((d, idx) => (
        <div key={d.key}
          onClick={() => setSelected(d.key)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
            cursor: "pointer", borderBottom: `1px solid ${BORDER}`,
            background: selected === d.key ? "#fef2f2" : idx === 0 ? "#f9fafb" : "#fff",
            borderLeft: selected === d.key ? `3px solid ${RED}` : "3px solid transparent",
          }}>
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {d.isDefault
              ? <span style={{ fontSize: 15 }}>📋</span>
              : <span style={{ fontSize: 14 }}>🖊</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: selected === d.key ? 700 : 500, color: d.isDefault ? RED : TEXT, fontFamily: F, wordBreak: "break-word" }}>{d.label}</div>
            {d.isDefault && (
              <span style={{ display: "inline-block", fontSize: 10, background: "#fee2e2", color: RED, borderRadius: 10, padding: "1px 7px", marginTop: 2, fontFamily: F }}>Mặc định</span>
            )}
          </div>
          {d.date && <div style={{ fontSize: 10, color: MUTED, fontFamily: F, flexShrink: 0, marginTop: 2 }}>{d.date}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Trình ký – Tab Hồ sơ tờ trình ─────────────────────────────────────────────
export function TrinhKyHoSoTab() {
  const [selectedFile, setSelectedFile] = useState("hoa-pdf");
  const folders = [
    { key: "tai-lieu", label: "Tài liệu đánh dấu", count: 0 },
    { key: "tieu-ho-so", label: "Tiểu hồ sơ", count: 1 },
    { key: "ths1", label: "THS1", count: 0 },
  ];
  const files = [
    { key: "hoa-pdf", label: "Hoa", type: "PDF", size: "391 KB" },
    { key: "hoa-word", label: "Hoa", type: "Word", size: "400 KB" },
    { key: "cong-van", label: "Công văn gửi nội bộ", type: "PDF", size: "714 KB" },
  ];

  return (
    <div style={{ marginTop: -6, marginLeft: -16, marginRight: -16, display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, fontWeight: 600, padding: "8px 12px", borderBottom: `2px solid ${RED}`, cursor: "pointer" }}>Giai đoạn hiện tại</span>
        <span style={{ fontSize: 11, color: MUTED, fontFamily: F, padding: "8px 12px", cursor: "pointer" }}>Các giai đoạn còn lại</span>
      </div>
      {/* Folders */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {folders.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <span style={{ fontSize: 10, color: MUTED }}>▶</span>
            <span>📁</span>
            <span style={{ flex: 1 }}>{f.label}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{f.count}</span>
          </div>
        ))}
        {/* Open folder */}
        <div style={{ padding: "7px 12px", fontSize: 12, fontFamily: F }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: MUTED }}>▼</span>
            <span>📁</span>
            <span style={{ color: TEXT }}>03/06/2026</span>
            <span style={{ marginLeft: "auto", background: "#374151", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px" }}>3</span>
          </div>
          {files.map(f => (
            <div key={f.key}
              onClick={() => setSelectedFile(f.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px 5px 20px", borderRadius: 4, cursor: "pointer", background: selectedFile === f.key ? "#fce7e7" : "none", marginBottom: 2 }}
              onMouseEnter={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "none"; }}>
              <input type="checkbox" readOnly checked={selectedFile === f.key} style={{ cursor: "pointer", accentColor: RED }} />
              <span>{f.type === "PDF" ? "📄" : "📝"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: selectedFile === f.key ? 600 : 400, color: TEXT }}>{f.label}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{f.type} · {f.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trình ký modal ─────────────────────────────────────────────────────────────
export function TrinhKyModal({ onClose }: { onClose: () => void }) {
  const [leftTab, setLeftTab] = useState<"noi-dung" | "thong-tin" | "ho-so">("noi-dung");
  const [capTrinh, setCapTrinh] = useState("Trình Phó vụ trưởng");
  const [uuTien, setUuTien] = useState("Binh-thuong");
  // For single-select cap trinh
  const [nguoiDon, setNguoiDon] = useState("");
  // For multi-select (To TP / HDTP / Du thao)
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({});
  const [danhSach, setDanhSach] = useState([
    { id: 1, cap: "Trình Phó vụ trưởng", lanh: "Trần Thị Hoa – Phó Vụ trưởng", uu: "Bình thường", uuKey: "Binh-thuong" },
  ]);

  const selSt: React.CSSProperties = { padding: "6px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", background: "#fff", width: "100%", cursor: "pointer" };

  const CAP_TRINH_OPTIONS = [
    "Trình Phó vụ trưởng",
    "Trình Vụ trưởng",
    "Trình thẩm phán",
    "Trình phó chánh án",
    "Trình chánh án",
    "Báo cáo tổ Thẩm phán",
    "Báo cáo Hội đồng thẩm phán",
    "Nghiên cứu lại, xác minh, bổ sung",
    "Trình dự thảo trả lời đơn",
    "Trình dự thảo kháng nghị",
  ];

  const UU_TIEN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    "Cao": { label: "Cao", color: "#7f1d1d", bg: "#fee2e2" },
    "Binh-thuong": { label: "Bình thường", color: "#374151", bg: "#f3f4f6" },
    "Thap": { label: "Thấp", color: "#065f46", bg: "#d1fae5" },
  };

  // People lists per cấp trình type
  const TO_TP_LIST = [
    "Nguyễn Văn An – Thẩm phán", "Trần Thị Bình – Thẩm phán", "Lê Minh Cường – Thẩm phán",
    "Phạm Thị Dung – Thẩm phán", "Hoàng Văn Em – Thẩm phán", "Ngô Thị Phượng – Thẩm phán",
    "Bùi Quang Giang – Thẩm phán", "Đỗ Thị Hương – Thẩm phán", "Vũ Minh Khoa – Thẩm phán",
    "Đinh Thị Lan – Thẩm phán",
  ];
  const HDTP_LIST = [
    "Nguyễn Hòa Bình – Chánh án TANDTC", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án",
    "Trần Văn Độ – Phó Chánh án", "Lê Hồng Quang – Thẩm phán TANDTC", "Nguyễn Duy Giảng – Thẩm phán TANDTC",
    "Trương Việt Toàn – Thẩm phán TANDTC", "Phạm Quốc Anh – Thẩm phán TANDTC",
    "Bùi Ngọc Hòa – Thẩm phán TANDTC", "Đặng Văn Khanh – Thẩm phán TANDTC",
    "Mai Thị Minh – Thẩm phán TANDTC", "Hồ Tấn Tài – Thẩm phán TANDTC",
    "Phan Thị Bình Thuận – Thẩm phán TANDTC", "Dương Tấn Thanh – Thẩm phán TANDTC",
  ];
  const DU_THAO_LIST = [
    "Nguyễn Tiến Hiệp – Thẩm phán phân công",
    "Trần Thị Hoa – Phó Vụ trưởng",
    "Lê Quang Minh – Vụ trưởng",
    "Nguyễn Thị Mai – Phó Chánh án",
    "Nguyễn Hòa Bình – Chánh án",
  ];

  const isCheckboxType = ["Báo cáo tổ Thẩm phán", "Báo cáo Hội đồng thẩm phán", "Trình dự thảo trả lời đơn", "Trình dự thảo kháng nghị"].includes(capTrinh);
  const checkboxList = capTrinh === "Báo cáo tổ Thẩm phán" ? TO_TP_LIST : capTrinh === "Báo cáo Hội đồng thẩm phán" ? HDTP_LIST : DU_THAO_LIST;

  const getSingleOptions = () => {
    if (capTrinh === "Trình Phó vụ trưởng") return ["Trần Thị Hoa – Phó Vụ trưởng", "Nguyễn Thị Lan – Phó Vụ trưởng"];
    if (capTrinh === "Trình Vụ trưởng") return ["Lê Quang Minh – Vụ trưởng"];
    if (capTrinh === "Trình thẩm phán") return ["Nguyễn Tiến Hiệp – Thẩm phán phân công", "Lê Văn Tùng – Thẩm phán tái phân công"];
    if (capTrinh === "Trình phó chánh án") return ["Nguyễn Thị Mai – Phó Chánh án", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án"];
    if (capTrinh === "Trình chánh án") return ["Nguyễn Hòa Bình – Chánh án TANDTC"];
    if (capTrinh === "Nghiên cứu lại, xác minh, bổ sung") return ["Lý Thái Phúc – Thẩm tra viên", "Nguyễn Minh Tú – Thẩm tra viên"];
    return [];
  };

  const getDefaultNguoiDon = (cap: string) => getSingleOptions()[0] ?? "";

  const handleCapTrinhChange = (val: string) => {
    setCapTrinh(val);
    setNguoiDon("");
    if (val === "Báo cáo Hội đồng thẩm phán") {
      const init: Record<string, boolean> = {};
      HDTP_LIST.forEach(p => { init[p] = true; });
      setCheckedPeople(init);
    } else {
      setCheckedPeople({});
    }
  };

  const togglePerson = (name: string) => {
    setCheckedPeople(p => ({ ...p, [name]: !p[name] }));
  };

  const handleAddDanhSach = () => {
    const uu = UU_TIEN_CONFIG[uuTien] || UU_TIEN_CONFIG["Binh-thuong"];
    const base = Date.now();
    if (isCheckboxType) {
      const selected = checkboxList.filter(p => checkedPeople[p]);
      if (selected.length === 0) return;
      setDanhSach(prev => [
        ...prev,
        ...selected.map((name, i) => ({ id: base + i, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien })),
      ]);
    } else {
      const name = nguoiDon || getDefaultNguoiDon(capTrinh);
      if (!name) return;
      setDanhSach(prev => [...prev, { id: base, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien }]);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", flexDirection: "column" }}>
      {/* Dark red header */}
      <div style={{ background: "#7f1d1d", padding: "12px 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: F }}>Trình ký</span>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 360, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Sub-tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {([["noi-dung","Nội dung xin ý kiến"],["thong-tin","Thông tin tờ trình"],["ho-so","Hồ sơ tờ trình"]] as const).map(([k,lbl]) => (
              <button key={k} onClick={() => setLeftTab(k)}
                style={{ flex: 1, padding: "9px 4px", fontSize: 11, fontFamily: F, fontWeight: leftTab === k ? 700 : 400, background: "none", border: "none", cursor: "pointer", color: leftTab === k ? RED : MUTED, borderBottom: leftTab === k ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1 }}>
                {lbl}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
            {leftTab === "noi-dung" && (
              <>
                {/* Cấp trình + Ưu tiên */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}><span style={{ color: RED }}>*</span> Cấp trình</span>
                    <select value={capTrinh} onChange={e => handleCapTrinhChange(e.target.value)} style={selSt}>
                      {CAP_TRINH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}>Mức độ ưu tiên</span>
                    <select value={uuTien} onChange={e => setUuTien(e.target.value)} style={selSt}>
                      <option value="Cao">Cao</option>
                      <option value="Binh-thuong">Bình thường</option>
                      <option value="Thap">Thấp</option>
                    </select>
                  </div>
                </div>
                {/* Người được trình – dynamic UI */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: RED }}>*</span> Người được trình</span>
                  {!isCheckboxType ? (
                    <select value={nguoiDon || getDefaultNguoiDon(capTrinh)} onChange={e => setNguoiDon(e.target.value)} style={selSt}>
                      {getSingleOptions().map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, maxHeight: 180, overflowY: "auto", background: "#fafafa" }}>
                      {checkboxList.map(person => (
                        <label key={person} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", fontSize: 11, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}>
                          <input
                            type="checkbox"
                            checked={!!checkedPeople[person]}
                            onChange={() => togglePerson(person)}
                            style={{ accentColor: RED, cursor: "pointer", flexShrink: 0 }}
                          />
                          <span style={{ wordBreak: "break-word" }}>{person}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddDanhSach}
                  style={{ width: "100%", padding: "7px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600, marginBottom: 14 }}>
                  Thêm người được trình
                </button>
                {/* Danh sách đã thêm */}
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 11 }}>
                  <colgroup><col style={{ width: "32%" }} /><col style={{ width: "33%" }} /><col style={{ width: "22%" }} /><col style={{ width: 36 }} /></colgroup>
                  <thead>
                    <tr>
                      {["Cấp trình","Người được trình","Ưu tiên",""].map((h, i) => (
                        <th key={i} style={{ ...TH_STYLE, fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {danhSach.map((r, idx) => {
                      const uuCfg = UU_TIEN_CONFIG[r.uuKey] || UU_TIEN_CONFIG["Binh-thuong"];
                      return (
                        <tr key={`ds-${r.id}`} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={{ ...TD_STYLE, fontSize: 10 }}>{r.cap}</td>
                          <td style={{ ...TD_STYLE, fontSize: 10, fontWeight: 600 }}>{r.lanh}</td>
                          <td style={{ ...TD_STYLE }}>
                            <Badge color={uuCfg.color} bg={uuCfg.bg}>{uuCfg.label}</Badge>
                          </td>
                          <td style={{ ...TD_STYLE, textAlign: "center" }}>
                            <button onClick={() => setDanhSach(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "#ef4444" }}>🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
            {leftTab === "thong-tin" && (
              <TrinhKyThongTinTab />
            )}
            {leftTab === "ho-so" && (
              <TrinhKyHoSoTab />
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          </div>
        </div>

        {/* Right – PDF preview */}
        <div style={{ flex: 1, background: "#6b7280", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "#4b5563", flexShrink: 0 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>🔄</button>
            <span style={{ fontSize: 12, color: "#d1d5db", fontFamily: F }}>100%</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>⛶</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: "#d1d5db", fontFamily: F }}>‹ 1 / 2 ›</span>
            <div style={{ flex: 1 }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>⬇</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>🖨</button>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 32, overflowY: "auto" }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 640, padding: "48px 64px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", fontFamily: "serif", lineHeight: 1.9, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <hr style={{ border: "none", borderTop: "1px solid #000", margin: "4px 0" }} />
                </div>
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}>Số: 12/TTr-TTV</div>
              <div style={{ textAlign: "right", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Hà Nội, ngày 08 tháng 04 năm 2026</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>TỜ TRÌNH</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>THẨM TRA VỤ VIỆC</div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Kính trình: Lãnh đ o Tòa án nhân dân t i cao</div>
              <p style={{ textAlign: "justify", marginBottom: 16, fontSize: 12 }}>Căn cứ đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm và các tài liệu có trong hồ sơ vụ việc; Thẩm tra viên báo cáo kết quả nghiên cứu hồ sơ như sau:</p>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>I. THÔNG TIN CHUNG</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Số bản án: 137120/2026/HSST-QĐ</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Tòa án xét xử: Tòa án nhân dân tối cao</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Người đề nghị: Nguyễn Văn A</div>
              <div style={{ fontSize: 12, marginBottom: 16, paddingLeft: 16 }}>Nội dung đề nghị: Xem xét lại bản án theo thủ tục giám đốc thẩm, tái thẩm.</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>II. NHẬN XÉT, ĐỀ XUẤT</div>
              <p style={{ textAlign: "justify", fontSize: 12, marginBottom: 40 }}>Qua kiểm tra, hồ sơ có nội dung cần xin ý kiến lãnh đạo để thống nhất hướng xử lý. Thẩm tra viên kính đề nghị lãnh đạo xem xét, cho ý kiến chỉ đạo làm căn cứ thực hiện các bước tiếp theo theo đúng quy định.</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <div style={{ fontStyle: "italic" }}>N i nh n:</div>
                  <div>- Như trên;</div>
                  <div>- Lưu hồ sơ.</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, marginBottom: 40 }}>THẨM TRA VIÊN</div>
                  <div style={{ fontWeight: 700 }}>Nguyễn Tiến Hiệp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
