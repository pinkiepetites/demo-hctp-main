import React, { useState } from "react";
import { X, FileText, Printer, Download, Eye, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED } from "./shared";
import {
  DANH_SACH_THAM_PHAN,
  DANH_SACH_VIEN_KIEM_SAT,
  capSoQuyetDinh,
  getChucVuThamPhan,
} from "./hdxxConfig";

// ── Kiểu dữ liệu ─────────────────────────────────────────────────────────────

export type ThongTinVuAnMS03 = {
  maVuAn: string;
  tenVuAn: string;
  giaiDoan: string;
  soThuLy: string;
  ngayThuLy: string;
  toaAnGiaiQuyet: string;
  biCanDauVu: string;
  toiDanh: string;
  trangThai: string;
};

export type NguoiTienHanhToTung = {
  /** "Chủ tọa phiên tòa" | "Thẩm phán" | "Thư ký Tòa án" … */
  vaiTro: string;
  ten: string;
};

export type QuyetDinhMoi = {
  soQD: string;
  ngayQD: string;
  tenBM: string;
  nguoiKy: string;
  trangThai: string;
};

const KHONG_THAY_DOI = "– Không thay đổi –";

/** Datepicker trả về yyyy-mm-dd; văn bản dùng dd/mm/yyyy. */
function fmtNgay(v: string): string {
  const [y, m, d] = (v || "").split("-");
  return y && m && d ? `${d}/${m}/${y}` : v || "";
}

function homNay(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Vai trò Thư ký áp dụng Điều 54, còn lại là Điều 53 (mục 3.7). */
function canCuDieuLuat(thayThe: { vaiTro: string; moi: string }[]): string {
  const coThuKy = thayThe.some(t => /thư ký/i.test(t.vaiTro));
  const coThamPhan = thayThe.some(t => !/thư ký/i.test(t.vaiTro));
  if (coThuKy && coThamPhan) return "Điều 53, Điều 54 BLTTHS";
  if (coThuKy) return "Điều 54 BLTTHS";
  return "Điều 53 BLTTHS";
}

// ── Trình xem biểu mẫu toàn màn hình — mẫu số 03-HS (mục 3.8) ────────────────

export function XemBieuMauMS03({
  tenBieuMau = "Quyết định thay đổi thành viên Ủy ban Thẩm phán (Mẫu số 03-HS)",
  soQD,
  ngayQD,
  vuAn,
  canCu,
  xetThay,
  nguoiKy,
  thayThe,
  vienKiemSat,
  noiNhanKhac,
  thayTheTheoQD = "",
  onClose,
}: {
  tenBieuMau?: string;
  soQD: string;
  ngayQD: string;
  vuAn: ThongTinVuAnMS03;
  canCu: string;
  xetThay: string;
  nguoiKy: string;
  thayThe: { vaiTro: string; cu: string; moi: string }[];
  vienKiemSat: string;
  noiNhanKhac: string;
  /** Số quyết định bị thay thế, dùng ở Điều 3. */
  thayTheTheoQD?: string;
  onClose: () => void;
}) {
  const serif = "'Times New Roman', Times, serif";
  const ngay = ngayQD || ".../.../......";
  // "Điều 53 BLTTHS" → "53" để ghép vào câu "Căn cứ các điều 44, 49 và 53…"
  const canCuSo = (canCu.match(/\d+/g) || ["53"]).join(", ");
  const doan: React.CSSProperties = { textIndent: 28, margin: 0, lineHeight: 1.55, textAlign: "justify" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 4000, display: "flex", flexDirection: "column", background: "#eef2f6", fontFamily: F }}>
      {/* Thanh trên nền tối */}
      <div style={{ background: "#222222", color: "#fff", padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            onClick={onClose}
            title="Đóng"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
          >
            <X size={18} />
          </button>
          <FileText size={17} />
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Biểu mẫu: {tenBieuMau}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => window.alert("Chức năng xuất file Word chưa được đấu nối trong repo này.")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            <Download size={14} /> Tải file Word (.docx)
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#fff", color: TEXT, border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            <Printer size={14} /> In văn bản
          </button>
          <button
            onClick={onClose}
            style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Thanh phụ */}
      <div style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}`, padding: "7px 22px", display: "flex", alignItems: "center", gap: 18, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
        <span>Times New Roman</span>
        <span>Cỡ chữ: 13pt</span>
        <span style={{ color: "#1b5e20", fontWeight: 600 }}>✓ Định dạng chuẩn văn bản TAND thành phố Hà Nội</span>
      </div>

      {/* Tờ A4 */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 0" }}>
        <div style={{ width: 794, maxWidth: "94vw", margin: "0 auto", background: "#fff", boxShadow: "0 6px 26px rgba(15,23,42,0.16)", padding: "56px 64px", fontFamily: serif, fontSize: 13, color: "#000", lineHeight: 1.5 }}>
          {/* Quốc hiệu 2 cột */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
            <div style={{ width: "44%", textAlign: "center" }}>
              <div style={{ fontWeight: 700, textTransform: "uppercase" }}>Tòa án nhân dân thành phố Hà Nội</div>
              <div style={{ borderTop: "1px solid #000", width: 130, margin: "3px auto 8px" }} />
              <div>Số: {soQD || "……/…../QĐ-TAHN"}</div>
            </div>
            <div style={{ width: "52%", textAlign: "center" }}>
              <div style={{ fontWeight: 700, textTransform: "uppercase" }}>Cộng hòa xã hội chủ nghĩa Việt Nam</div>
              <div style={{ fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ borderTop: "1px solid #000", width: 210, margin: "3px auto 8px" }} />
              <div style={{ fontStyle: "italic" }}>Hà Nội, ngày {ngay}</div>
            </div>
          </div>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>QUYẾT ĐỊNH</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>Thay đổi thành viên Ủy ban Thẩm phán</div>
          </div>

          <div style={{ textAlign: "center", fontWeight: 700, marginTop: 22, textTransform: "uppercase" }}>
            Chánh án Tòa án nhân dân thành phố Hà Nội
          </div>

          {/* Căn cứ + Xét thấy đi liền nhau, không cách dòng */}
          <div style={{ marginTop: 16 }}>
            <p style={doan}>Căn cứ các điều 44, 49 và {canCuSo} của Bộ luật Tố tụng hình sự;</p>
            <p style={doan}>Xét thấy {xetThay || "............................................."}</p>
          </div>

          <div style={{ textAlign: "center", fontWeight: 700, marginTop: 18 }}>QUYẾT ĐỊNH:</div>

          {/* Điều 1 */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700 }}>Điều 1</div>
            {thayThe.length === 0 ? (
              <p style={doan}>
                Phân công: Ông (Bà) ..................... Chức vụ (chức danh) ................ thay Ông (Bà)
                ..................... Chức vụ (chức danh) ................
              </p>
            ) : (
              thayThe.map((t, i) => (
                <p key={i} style={doan}>
                  Phân công: Ông (Bà) <b>{t.moi}</b> Chức vụ (chức danh) {getChucVuThamPhan(t.moi)} thay Ông (Bà){" "}
                  <b>{t.cu}</b> Chức vụ (chức danh) {getChucVuThamPhan(t.cu)}
                </p>
              ))
            )}
            <p style={doan}>
              Tiến hành giải quyết, xem xét vụ án hình sự {vuAn.giaiDoan.toLowerCase()} thụ lý số:{" "}
              <span style={{ color: "#b45309" }}>{vuAn.soThuLy || "……"} ngày {vuAn.ngayThuLy || "……"}</span> đối với bị
              can (bị cáo) <b>{vuAn.biCanDauVu || "……"}</b> bị truy tố (xét xử) về tội <b>{vuAn.toiDanh || "……"}</b>
            </p>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700 }}>Điều 2</div>
            <p style={doan}>
              Ông (Bà) có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này để bảo đảm việc tiến hành giải quyết,
              xem xét vụ án đúng quy định của pháp luật.
            </p>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700 }}>Điều 3</div>
            <p style={doan}>
              Quyết định này có hiệu lực kể từ ngày ký{thayTheTheoQD ? ` và thay thế cho Quyết định ${thayTheTheoQD}` : ""}.
            </p>
          </div>

          {/* Nơi nhận + ký tên */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 34 }}>
            <div style={{ width: "50%", fontSize: 11 }}>
              <div style={{ fontWeight: 700, fontStyle: "italic" }}>Nơi nhận:</div>
              <div>- Như Điều 2;</div>
              <div>- {vienKiemSat || "Viện kiểm sát nhân dân thành phố Hà Nội"};</div>
              {noiNhanKhac
                .split(/[\n;]/)
                .map(s => s.trim())
                .filter(Boolean)
                .map((n, i) => (
                  <div key={i}>- {n};</div>
                ))}
              <div>- Lưu hồ sơ vụ án.</div>
            </div>
            <div style={{ width: "42%", textAlign: "center" }}>
              <div style={{ fontWeight: 700, textTransform: "uppercase" }}>Chánh án</div>
              <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký tên, ghi rõ họ tên, đóng dấu)</div>
              <div style={{ height: 60 }} />
              <div style={{ fontWeight: 700 }}>{nguoiKy || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form MS 03 (mục 3.7) ─────────────────────────────────────────────────────

export function QDThayDoiHDXXModal({
  vuAn,
  nguoiTienHanh,
  soQDDaCo,
  soQDHieuLuc,
  onClose,
  onSave,
}: {
  vuAn: ThongTinVuAnMS03;
  nguoiTienHanh: NguoiTienHanhToTung[];
  /** Các số quyết định đã có trong bảng ở mục 3.6 — dùng để cấp số mới. */
  soQDDaCo: string[];
  /** Số quyết định đang ở trạng thái "Đã có hiệu lực". */
  soQDHieuLuc: string;
  onClose: () => void;
  onSave: (qd: QuyetDinhMoi) => void;
}) {
  const [ngayQD, setNgayQD] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [xetThay, setXetThay] = useState("");
  const [vks, setVks] = useState(DANH_SACH_VIEN_KIEM_SAT[0]);
  const [noiNhanKhac, setNoiNhanKhac] = useState("");
  const [thayThe, setThayThe] = useState<Record<number, string>>({});
  const [xemBieuMau, setXemBieuMau] = useState(false);

  // Số quyết định tự sinh, ô disable.
  const [soQD] = useState(() => capSoQuyetDinh(soQDDaCo));

  const danhSachThayThe = nguoiTienHanh
    .map((n, i) => ({ vaiTro: n.vaiTro, cu: n.ten, moi: thayThe[i] || "" }))
    .filter(t => t.moi && t.moi !== KHONG_THAY_DOI);

  const canCu = canCuDieuLuat(danhSachThayThe.map(t => ({ vaiTro: t.vaiTro, moi: t.moi })));

  const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, display: "block", marginBottom: 6 };
  const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "8px 11px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontFamily: F, color: TEXT, outline: "none", background: "#fff" };
  const inpDis: React.CSSProperties = { ...inp, background: "#f5f5f5", color: MUTED, cursor: "not-allowed" };
  const TH: React.CSSProperties = { padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "#333333", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, textAlign: "left", fontFamily: F };
  const TD: React.CSSProperties = { padding: "10px 12px", fontSize: 12, borderBottom: `1px solid ${BORDER}`, fontFamily: F, color: TEXT, verticalAlign: "middle" };

  const sao = <span style={{ color: RED }}> *</span>;

  const mucTieuDe = (text: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 11, height: 11, background: RED, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>{text}</span>
    </div>
  );

  const info = (label: string, value: string, mau = "#1a5a96") => (
    <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.55 }}>
      <span style={{ color: MUTED }}>{label}: </span>
      <span style={{ color: mau, fontWeight: 700 }}>{value || "–"}</span>
    </div>
  );

  const luu = () => {
    onSave({
      soQD,
      ngayQD: fmtNgay(ngayQD) || homNay(),
      tenBM: "Quyết định thay đổi thành viên hội đồng xét xử",
      nguoiKy: nguoiKy || "–",
      trangThai: "Đã ký số",
    });
    onClose();
  };

  if (xemBieuMau)
    return (
      <XemBieuMauMS03
        soQD={soQD}
        ngayQD={fmtNgay(ngayQD)}
        vuAn={vuAn}
        canCu={canCu}
        xetThay={xetThay}
        nguoiKy={nguoiKy}
        thayThe={danhSachThayThe}
        vienKiemSat={vks}
        noiNhanKhac={noiNhanKhac}
        thayTheTheoQD={soQDHieuLuc}
        onClose={() => setXemBieuMau(false)}
      />
    );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 1000, maxWidth: "96vw", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 44px rgba(0,0,0,0.22)", fontFamily: F, color: TEXT }}>
        {/* Header */}
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: F }}>
            Thay đổi Thẩm phán, Hội thẩm, Thư ký trước khi mở phiên tòa (MS 03)
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <X size={18} color={MUTED} />
          </button>
        </div>

        <div style={{ overflow: "auto", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Khối thông tin vụ án — chỉ đọc */}
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: 8,
              padding: "12px 16px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px 20px",
            }}
          >
            {info("Mã vụ án", vuAn.maVuAn)}
            {info("Số thụ lý", [vuAn.soThuLy, vuAn.ngayThuLy && `ngày ${vuAn.ngayThuLy}`].filter(Boolean).join(" "))}
            {info("Trạng thái", vuAn.trangThai)}
            {info("Tên vụ án", vuAn.tenVuAn)}
            {info("Giai đoạn", vuAn.giaiDoan)}
            {info("Tòa án giải quyết", vuAn.toaAnGiaiQuyet)}
            {info("Tên bị can đầu vụ", vuAn.biCanDauVu)}
            {info("Tội danh", vuAn.toiDanh, RED)}
          </div>

          {/* Thông tin quyết định */}
          <div>
            {mucTieuDe("Thông tin quyết định")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 16px" }}>
              <div>
                <label style={lbl}>Thay đổi biểu mẫu{sao}</label>
                <select style={inp} value="qd-thay-doi-tv" onChange={() => undefined}>
                  <option value="qd-thay-doi-tv">Quyết định thay đổi thành viên hội đồng xét xử</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Ngày quyết định</label>
                <input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} placeholder="dd/mm/yyyy" style={inp} />
              </div>
              <div>
                <label style={lbl}>Số quyết định <span style={{ fontWeight: 400, color: MUTED }}>(tự sinh)</span></label>
                <input disabled value={soQD} style={inpDis} />
              </div>
              <div>
                <label style={lbl}>Căn cứ điều luật</label>
                <input disabled value={canCu} style={inpDis} />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Người ký ban hành{sao}</label>
                <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={inp}>
                  <option value="">Chọn người ký ban hành</option>
                  {DANH_SACH_THAM_PHAN.map(tp => (
                    <option key={tp.id} value={tp.ten}>{tp.ten} — {tp.chucVu}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Thay thế theo quyết định <span style={{ fontWeight: 400, color: MUTED }}>(tự hiển thị)</span></label>
                <input disabled value={soQDHieuLuc || "–"} style={inpDis} />
              </div>

              <div style={{ gridColumn: "span 4" }}>
                <label style={lbl}>Xét thấy</label>
                <textarea
                  value={xetThay}
                  onChange={e => setXetThay(e.target.value)}
                  rows={3}
                  placeholder="Ghi rõ lý do thay đổi người tiến hành tố tụng theo Điều 53 hoặc Điều 54 BLTTHS"
                  style={{ ...inp, resize: "vertical" as const }}
                />
              </div>
            </div>
          </div>

          {/* Nơi nhận */}
          <div>
            {mucTieuDe("Nơi nhận")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
              <div>
                <label style={lbl}>Viện kiểm sát nhận</label>
                <select value={vks} onChange={e => setVks(e.target.value)} style={inp}>
                  {DANH_SACH_VIEN_KIEM_SAT.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Nơi nhận khác</label>
                <input value={noiNhanKhac} onChange={e => setNoiNhanKhac(e.target.value)} placeholder="Nhập nơi nhận khác" style={inp} />
              </div>
            </div>
          </div>

          {/* Người tiến hành tố tụng được thay thế */}
          <div>
            {mucTieuDe("Người tiến hành tố tụng được thay thế")}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <colgroup>
                  <col style={{ width: 56 }} />
                  <col style={{ width: "20%" }} />
                  <col />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: 90 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: "center" }}>STT</th>
                    <th style={TH}>Vai trò</th>
                    <th style={TH}>Người được phân công</th>
                    <th style={TH}>Người được thay thế</th>
                    <th style={{ ...TH, textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {nguoiTienHanh.map((n, i) => {
                    const daChon = thayThe[i] && thayThe[i] !== KHONG_THAY_DOI;
                    return (
                      <tr key={`${n.ten}-${i}`}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED }}>{i + 1}</td>
                        <td style={TD}>{n.vaiTro}</td>
                        <td style={TD}>
                          <div style={{ fontWeight: 700 }}>{n.ten}</div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{getChucVuThamPhan(n.ten)}</div>
                        </td>
                        <td style={TD}>
                          <select
                            value={thayThe[i] || KHONG_THAY_DOI}
                            onChange={e => setThayThe(prev => ({ ...prev, [i]: e.target.value }))}
                            style={inp}
                          >
                            <option value={KHONG_THAY_DOI}>{KHONG_THAY_DOI}</option>
                            {DANH_SACH_THAM_PHAN.filter(tp => tp.ten !== n.ten).map(tp => (
                              <option key={tp.id} value={tp.ten}>{tp.ten} — {tp.chucVu}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <button
                            disabled={!daChon}
                            onClick={() => setThayThe(prev => ({ ...prev, [i]: KHONG_THAY_DOI }))}
                            title={daChon ? "Bỏ chọn người thay thế" : "Chưa chọn người thay thế"}
                            style={{
                              background: daChon ? "#fdf3f2" : "#fafafa",
                              color: daChon ? RED : "#cccccc",
                              border: `1px solid ${daChon ? "#f3c0bb" : "#e0e0e0"}`,
                              borderRadius: 5,
                              padding: "5px 9px",
                              cursor: daChon ? "pointer" : "not-allowed",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {nguoiTienHanh.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ ...TD, textAlign: "center", color: MUTED, padding: "24px 12px" }}>
                        Chưa có người tiến hành tố tụng nào được phân công.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginTop: 8, fontStyle: "italic" }}>
              Dòng để trống là giữ nguyên, không đưa vào quyết định.
            </div>
          </div>
        </div>

        {/* Nút */}
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setXemBieuMau(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#fff", color: "#1a5a96", border: "1px solid #a8cdf0", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            <Eye size={14} /> Xem biểu mẫu
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{ padding: "8px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={luu}
            style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            Lưu quyết định
          </button>
        </div>
      </div>
    </div>
  );
}