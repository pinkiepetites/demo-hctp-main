import React, { useState } from "react";
import { Eye } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import type { VuAnDetailData } from "./App";

export function SectionCard({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
        style={{ display: "flex", alignItems: "center", padding: "11px 16px", borderBottom: open ? `1px solid ${BORDER}` : "none", cursor: collapsible ? "pointer" : "default", userSelect: "none" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
        {collapsible && <span style={{ fontSize: 12, color: MUTED }}>{open ? "▼" : "▶"}</span>}
      </div>
      {open && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

export function InfoGrid({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 32px" }}>
      {rows.map(([lbl, val]) => (
        <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{lbl}</span>
          <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500, lineHeight: 1.5 }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export function TabThongTin({ detail }: { detail: VuAnDetailData }) {
  const [thoiHieu, setThoiHieu] = React.useState("khong-xac-dinh");
  const [denNghiOpen, setDenNghiOpen] = React.useState(false);

  // ── Quá trình giải quyết data ──
  const quatrinhRows = [
    {
      stt: 1,
      vuAn: "VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
      loai: "Bản án", giai: "Sơ thẩm",
      soBA: "CVKN_GDT", ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân cấp cao tại Hà Nội",
      thamPhans: ["Nguyễn Văn A", "Thẩm phán Bậc 1"],
    },
    {
      stt: 2,
      vuAn: "VA26-001649 – ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
      loai: "Bản án", giai: "Phúc thẩm",
      soBA: "236", ngayBA: "03/07/2026",
      toa: "Tòa án nhân dân tỉnh Bắc Ninh",
      thamPhans: [
        "Nguyễn Văn A (Chủ tọa)", "Thẩm phán Bậc 2",
        "Nguyễn Văn A", "Thẩm phán Bậc 2",
        "Nguyễn Văn A", "Thẩm phán Bậc 2",
      ],
    },
  ];

  // ── Bị cáo data ──
  const biCaoRows = [
    {
      stt: 1, hoTen: "ĐẶNG THỊ DƯƠNG", ngaySinh: "2003", cccd: "001206042241",
      diaChi: "2b, Phường Hoàn Kiếm, Thành phố Hà Nội",
      diViPhapLy: "Bị cáo đầu vụ", diViSub: "",
      toiDanh: "Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ của người khác do vượt quá giới hạn phòng vệ chính đáng hoặc do vượt quá mức cần thiết khi bắt giữ người phạm tội (Tội danh chính) Khoản 2 Điểm b",
    },
    {
      stt: 2, hoTen: "NGUYỄN CHÍNH DUY THÀNH", ngaySinh: "22/02/2001", cccd: "009182739",
      diaChi: "",
      diViPhapLy: "Bị cáo", diViSub: "(Trẻ vị thành niên)",
      toiDanh: "Tội gian lận bảo hiểm xã hội, bảo hiểm thất nghiệp (Tội danh chính)",
    },
  ];

  // ── Người khiếu nại data ──
  const khieuNaiRows = [
    { stt: 1, nguoiKN: "Tòa án nhân dân cấp cao", nguoiDKN: "ĐẶNG THỊ DƯƠNG" },
    { stt: 2, nguoiKN: "Tòa án nhân dân cấp cao", nguoiDKN: "NGUYỄN CHÍNH DUY THÀNH" },
  ];

  const subHdr: React.CSSProperties = { display: "flex", alignItems: "center", padding: "10px 0 8px", borderBottom: `1px solid ${BORDER}`, marginBottom: 10 };

  return (
    <div style={{ padding: 20 }}>

      {/* ── THÔNG TIN CHUNG ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN CHUNG CỦA VỤ ÁN</span>
        </div>
        {/* badges */}
        <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
          <Badge color="#92400e" bg="#fef3c7">⭐ Án chỉ đạo</Badge>
          <Badge color="#3730a3" bg="#e0e7ff">🏛 ÁN QH</Badge>
        </div>
        {/* 4-column grid table */}
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: 10 }}>
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
          </colgroup>
          <tbody>
            {/* row 1 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Sơ thẩm</td>
            </tr>
            {/* row 2 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Giám đốc thẩm</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>CVKN_GDT – 20/07/2026</td>
            </tr>
            {/* row 3 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình sự</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Tòa án nhân dân cấp cao tại Hà Nội</td>
            </tr>
            {/* row 4 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Công văn</td>
              <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, borderRight: `1px solid ${BORDER}`, lineHeight: 1.7 }}>
                Số công văn 1 – Ngày công văn<br />
                Đơn vị phát công văn<br />
                <span style={{ color: MUTED, fontStyle: "italic" }}>(Tên loại công văn)</span><br />
                Số công văn 2 – Ngày công văn<br />
                Đơn vị phát công văn<br />
                <span style={{ color: MUTED, fontStyle: "italic" }}>(Tên loại công văn)</span>
              </td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Chỉ đạo</td>
              <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.7, verticalAlign: "top" }}>
                [Họ tên Người chỉ đạo<br />Chức vụ, chức danh]
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── THÔNG TIN ĐỀ NGHỊ GĐT/TT ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div
          onClick={() => setDenNghiOpen(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", cursor: "pointer", userSelect: "none" }}>
          <span style={{ fontSize: 14, color: RED, lineHeight: 1 }}>{denNghiOpen ? "⊟" : "⊞"}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN ĐỀ NGHỊ GIÁM ĐỐC THẨM / TÁI THẨM</span>
        </div>
        {denNghiOpen && (
          <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Chưa có dữ liệu</span>
          </div>
        )}
      </div>

      {/* ── QUÁ TRÌNH GIẢI QUYẾT ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: "#f59e0b", fontSize: 14 }}>⚖</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>QUÁ TRÌNH GIẢI QUYẾT</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              {["STT","VỤ ÁN","LOẠI BA/QĐ","GIAI ĐOẠN","SỐ BẢN ÁN","NGÀY RA BẢN ÁN","TÒA ÁN RA BẢN ÁN","THẨM PHÁN XÉT XỬ"].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quatrinhRows.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: "#2563eb" }}>{r.vuAn}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.loai}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{r.giai}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.soBA}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayBA}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.toa}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                  {r.thamPhans.reduce<React.ReactNode[]>((acc, tp, i) => {
                    if (i % 2 === 0) {
                      acc.push(
                        <div key={i} style={{ marginBottom: i < r.thamPhans.length - 2 ? 6 : 0 }}>
                          <div style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{tp}</div>
                          {r.thamPhans[i + 1] && <div style={{ fontSize: 10, color: MUTED, fontFamily: F, fontStyle: "italic" }}>{r.thamPhans[i + 1]}</div>}
                        </div>
                      );
                    }
                    return acc;
                  }, [])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Thông tin / Thời hiệu */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Thời hiệu giải quyết</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {[
                { val: "khong-xac-dinh", label: "Không xác định thời hiệu giải quyết" },
                { val: "trong-han-1-nam", label: "Trong hạn giải quyết 1 năm" },
                { val: "qua-3-nam", label: "Án quá thời hiệu 3 năm" },
                { val: "qua-5-nam", label: "Án quá thời hiệu 5 năm" },
              ].map(({ val, label }) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="radio" name="thoiHieu" value={val} checked={thoiHieu === val} onChange={() => setThoiHieu(val)}
                    style={{ width: 14, height: 14, accentColor: RED, cursor: "pointer" }} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── THÔNG TIN NGƯỜI LIÊN QUAN ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: RED, marginRight: 6 }}>⊟</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN NGƯỜI LIÊN QUAN</span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>

          {/* Bị cáo */}
          <div style={{ ...subHdr, marginTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>* Bị cáo</span>
            <button style={{ padding: "3px 10px", background: "none", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: 16 }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "31%" }} />
              <col style={{ width: 52 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT","HỌ VÀ TÊN","NGÀY SINH","CCCD","ĐỊA CHỈ","ĐỊA VỊ PHÁP LÝ","THÔNG TIN TỘI DANH, MỨC ÁN","THAO TÁC"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {biCaoRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTen}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngaySinh}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.cccd}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.diaChi}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{r.diViPhapLy}</span>
                      {r.diViSub && <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontStyle: "italic" }}>{r.diViSub}</span>}
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{r.toiDanh}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={13} color={MUTED} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Người khiếu nại */}
          <div style={{ ...subHdr, borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>* Người khiếu nại</span>
            <button style={{ padding: "3px 10px", background: "none", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: 16 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "42%" }} />
              <col style={{ width: "42%" }} />
              <col style={{ width: 60 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT","NGƯỜI KHIẾU NẠI","NGƯỜI ĐƯỢC KHIẾU NẠI","THAO TÁC"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {khieuNaiRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.nguoiKN}</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, fontWeight: 600, color: TEXT }}>{r.nguoiDKN}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                      <Eye size={13} color={MUTED} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bị hại */}
          <div style={{ ...subHdr, borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>Bị hại</span>
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </div>
            <button style={{ padding: "3px 10px", background: "none", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: 60 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT","Họ và tên/Tổ chức","Năm sinh","Địa chỉ","Thao tác"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={5} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 24 }}>Không có dữ liệu</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Nút Sửa thông tin ── */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 32px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
          ✏ Sửa thông tin
        </button>
      </div>
    </div>
  );
}
