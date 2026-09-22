import React, { useMemo, useState } from "react";
import {
  Search, Plus, RotateCw, Pencil, Users, Trash2, X, Check, AlertCircle,
  ChevronDown, ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft, UserPlus,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * DANH SÁCH ỦY BAN THẨM PHÁN — Cấu hình chung
 *
 * Ba thao tác trên mỗi dòng:
 *   ✏️  Sửa      → popup Chỉnh sửa thông tin Ủy ban Thẩm phán
 *   👥  Thành viên → popup Gán người dùng (hai cột chưa gán / đã gán)
 *   🗑️  Xóa      → hộp xác nhận
 * ────────────────────────────────────────────────────────────────────────────*/

const LOAI_AN = [
  "Tất cả loại án", "Hình sự", "Dân sự", "Hành chính",
  "Kinh doanh thương mại", "Hôn nhân gia đình", "Lao động", "Phá sản",
];

/** Ở cấp tỉnh, cơ quan xét xử GĐT/TT là Ủy ban Thẩm phán của chính tòa — mỗi
 *  tòa có đúng MỘT, không có Hội đồng Thẩm phán như mô hình TANDTC và cũng không
 *  chia thành tổ thẩm phán / tổ nghiệp vụ theo loại án. */
const LOAI_TO_NHOM = ["Ủy ban Thẩm phán"];

const MAU_LOAI_AN: Record<string, string> = {
  "Hình sự": "#c0392b",
  "Dân sự": "#1a5a96",
  "Hành chính": "#1a5a96",
  "Kinh doanh thương mại": "#1a5a96",
  "Hôn nhân gia đình": "#8e44ad",
  "Lao động": "#16a085",
  "Phá sản": "#1a5a96",
  "Tất cả loại án": "#555555",
};

// ─── Người dùng có thể gán vào Ủy ban ────────────────────────────────────────────

type NguoiDung = { id: number; ten: string; taiKhoan: string; donVi: string };

const DON_VI = [
  "TAND thành phố Hà Nội",
  "TAND khu vực 1 - Hà Nội",
  "TAND khu vực 2 - Hà Nội",
  "TAND khu vực 3 - Hà Nội",
  "TAND khu vực 4 - Hà Nội",
  "TAND khu vực 5 - Hà Nội",
  "TAND khu vực 6 - Hà Nội",
];

const HO_TEN = [
  "Nguyễn Thị Lan", "Trần Văn Hùng", "Lê Thị Mai", "Phạm Văn Đức", "Hoàng Thị Thu",
  "Đỗ Thị Kim Oanh", "Nguyễn Như Thắng", "Vũ Thị Hạnh", "Nguyễn Văn Hiền", "Đỗ Tất Thống",
  "Lê Minh Tuấn", "Trần Thị Hương", "Bùi Quang Giang", "Ngô Thị Phượng", "Đinh Thị Lan",
  "Vũ Minh Khoa", "Đỗ Thị Hương", "Hoàng Văn Em", "Phan Thị Bình", "Dương Tấn Thanh",
  "Mai Thị Minh", "Hồ Tấn Tài", "Trương Việt Toàn", "Phạm Quốc Anh", "Bùi Ngọc Hòa",
  "Đặng Văn Khanh", "Lê Hồng Quang", "Nguyễn Duy Giảng", "Trần Văn Độ", "Nguyễn Văn Du",
];

/** Danh bạ người dùng — sinh cố định (không random) để mỗi lần mở ra vẫn thấy
 *  đúng danh sách cũ, không nhảy lung tung giữa các lần render. */
const NGUOI_DUNG: NguoiDung[] = HO_TEN.map((ten, i) => ({
  id: i + 1,
  ten,
  taiKhoan: String(sinhSo(i)),
  donVi: DON_VI[i % DON_VI.length],
}));

function sinhSo(i: number) {
  // 12 chữ số kiểu số định danh, dựng theo chỉ số nên luôn ổn định
  return 62000000000 + i * 137717 + 4675;
}

// ─── Ủy ban Thẩm phán ───────────────────────────────────────────────────────────────

type ToThamPhanRow = {
  id: number;
  maTo: string;
  ten: string;
  loaiAn: string;
  loaiToNhom: string;
  moTa: string;
  bat: boolean;
  capNhat: string;   // dd/mm/yyyy
  gio: string;       // hh:mm:ss
  thanhVien: number[];
};

/** TAND cấp tỉnh chỉ có MỘT Ủy ban Thẩm phán, không tổ chức thành các tổ thẩm
 *  phán theo loại án — 5 bản ghi "Tổ thẩm phán phá sản / KDTM / dân sự / hình
 *  sự / hành chính" trước đây đã bỏ. */
const DU_LIEU_MAU: ToThamPhanRow[] = [
  { id: 1, maTo: "UBTP_HN", ten: "Ủy ban Thẩm phán TAND thành phố Hà Nội", loaiAn: "Tất cả loại án", loaiToNhom: "Ủy ban Thẩm phán", moTa: "Cơ quan xét xử giám đốc thẩm, tái thẩm của TAND thành phố Hà Nội", bat: true, capNhat: "12/08/2026", gio: "17:26:51", thanhVien: [1, 2, 3] },
];

const bayGio = () => {
  const d = new Date();
  const p2 = (n: number) => String(n).padStart(2, "0");
  return {
    capNhat: `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`,
    gio: `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`,
  };
};

// ─── Thành phần nhỏ ──────────────────────────────────────────────────────────

/** Công tắc bật/tắt. Có nhãn chữ bên trong, không chỉ dựa vào màu — ảnh chụp
 *  đen trắng hoặc người khó phân biệt màu vẫn đọc được trạng thái. */
const CongTac = ({ bat, onToggle }: { bat: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle} role="switch" aria-checked={bat}
    title={bat ? "Đang dùng — bấm để tạm dừng" : "Đang tắt — bấm để bật"}
    className={`relative inline-flex items-center h-[22px] w-[48px] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      ${bat ? "bg-error" : "bg-[#d5d9de]"}`}>
    <span className={`absolute text-[10px] font-bold text-white transition-all ${bat ? "left-[7px] opacity-100" : "opacity-0"}`}>Bật</span>
    <span className={`absolute text-[10px] font-bold text-[#6b7280] transition-all ${bat ? "opacity-0" : "right-[6px] opacity-100"}`}>Tắt</span>
    <span className={`absolute w-[16px] h-[16px] rounded-full bg-white shadow transition-all ${bat ? "left-[29px]" : "left-[3px]"}`} />
  </button>
);

const Nhan = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-[13px] font-medium text-on-surface mb-1">
    {req && <span className="text-error mr-0.5">*</span>}{children}
  </label>
);

/** Ô nhập có nút ✕ xóa nhanh — đúng như bản mẫu. */
const ONhap = ({ value, onChange, placeholder, autoFocus }: {
  value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean;
}) => (
  <div className="relative">
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
      className="w-full h-[32px] pl-2.5 pr-7 text-[13px] border border-surface-container-highest rounded-[3px] focus:outline-none focus:border-primary" />
    {value && (
      <button type="button" onClick={() => onChange("")} title="Xóa nội dung"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-error">
        <X size={13} />
      </button>
    )}
  </div>
);

const OChon = ({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full h-[32px] pl-2.5 pr-7 text-[13px] border border-surface-container-highest rounded-[3px] bg-white appearance-none focus:outline-none focus:border-primary">
      {children}
    </select>
    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// MÀN CHÍNH
// ═════════════════════════════════════════════════════════════════════════════

export default function ToThamPhan() {
  const [rows, setRows] = useState<ToThamPhanRow[]>(DU_LIEU_MAU);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locLoaiAn, setLocLoaiAn] = useState("");
  // Ô tìm kiếm chỉ lọc khi bấm nút — gõ tới đâu lọc tới đó sẽ nhảy bảng liên tục.
  const [dangTim, setDangTim] = useState("");

  const [dangSua, setDangSua] = useState<ToThamPhanRow | null>(null);
  const [themMoi, setThemMoi] = useState(false);
  const [ganThanhVien, setGanThanhVien] = useState<ToThamPhanRow | null>(null);
  const [xoaRow, setXoaRow] = useState<ToThamPhanRow | null>(null);
  const [thongBao, setThongBao] = useState("");

  const hienThi = useMemo(() => rows.filter(r => {
    if (locLoaiAn && r.loaiAn !== locLoaiAn) return false;
    if (!dangTim.trim()) return true;
    const k = dangTim.trim().toLowerCase();
    return r.ten.toLowerCase().includes(k) || r.maTo.toLowerCase().includes(k);
  }), [rows, locLoaiAn, dangTim]);

  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao(""), 4000); };

  const doiTrangThai = (id: number) => setRows(p => p.map(r =>
    r.id === id ? { ...r, bat: !r.bat, ...bayGio() } : r));

  const luuTo = (du: Omit<ToThamPhanRow, "id" | "capNhat" | "gio" | "thanhVien">) => {
    if (dangSua) {
      setRows(p => p.map(r => r.id === dangSua.id ? { ...r, ...du, ...bayGio() } : r));
      bao(`Đã cập nhật tổ "${du.ten}".`);
    } else {
      setRows(p => [{ id: Date.now(), ...du, thanhVien: [], ...bayGio() }, ...p]);
      bao(`Đã thêm tổ "${du.ten}". Gán thành viên rồi bật công tắc để đưa vào dùng.`);
    }
    setDangSua(null); setThemMoi(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#eef1f5]">
      <div className="p-4">
        <div className="bg-white border border-surface-container rounded-[4px]">
          {/* Tiêu đề + thanh công cụ */}
          <div className="px-4 pt-3.5 pb-3 border-b border-surface-container-high">
            <h1 className="text-[17px] font-bold text-tertiary mb-3">Danh sách Ủy ban Thẩm phán</h1>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-stretch">
                <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") setDangTim(tuKhoa); }}
                  placeholder="Nhập từ khóa tìm kiếm…"
                  className="w-[230px] h-[32px] px-2.5 text-[13px] border border-surface-container-highest rounded-l-[3px] focus:outline-none focus:border-primary" />
                <button type="button" onClick={() => setDangTim(tuKhoa)} title="Tìm kiếm"
                  className="h-[32px] px-3 bg-error hover:bg-error-container text-white rounded-r-[3px] transition-colors">
                  <Search size={14} />
                </button>
              </div>

              <div className="flex-1" />

              <div className="w-[180px]">
                <OChon value={locLoaiAn} onChange={setLocLoaiAn}>
                  <option value="">– Loại án –</option>
                  {LOAI_AN.map(l => <option key={l} value={l}>{l}</option>)}
                </OChon>
              </div>

              <button type="button" onClick={() => { setThemMoi(true); setDangSua(null); }}
                className="flex items-center gap-1.5 h-[32px] px-4 bg-error hover:bg-error-container text-white rounded-[3px] text-[13px] font-medium transition-colors">
                <Plus size={14} /> Thêm mới
              </button>

              <button type="button" title="Bỏ lọc, tải lại danh sách"
                onClick={() => { setTuKhoa(""); setDangTim(""); setLocLoaiAn(""); }}
                className="h-[32px] w-[32px] flex items-center justify-center border border-surface-container-highest rounded-[3px] bg-white hover:bg-surface-container-low text-on-surface-variant transition-colors">
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          {thongBao && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#eaf7ee] border-b border-[#a9debb] text-[12px] text-[#1a7a45]">
              <Check size={14} className="flex-shrink-0" />
              <span className="flex-1">{thongBao}</span>
              <button type="button" onClick={() => setThongBao("")} className="px-1 hover:text-[#0d5c31]">×</button>
            </div>
          )}

          {/* Bảng */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <th className="px-3 py-2.5 text-center font-semibold text-on-surface w-[60px]">STT</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-on-surface">Tên Ủy ban</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-on-surface w-[230px]">Loại án</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-on-surface w-[120px]">Trạng thái</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-on-surface w-[150px]">Cập nhật cuối</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-on-surface w-[120px]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {hienThi.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-[#94a3b8]">
                    Không có Ủy ban nào khớp điều kiện.
                  </td></tr>
                ) : hienThi.map((r, i) => (
                  <tr key={r.id} className="border-b border-surface-container-high hover:bg-[#f8fafc] transition-colors">
                    <td className="px-3 py-3 text-center text-on-surface-variant">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-on-surface">{r.ten}</div>
                      {/* Số thành viên quyết định tổ có dùng được không — tổ rỗng
                          mà bật lên thì lúc phân công sẽ không ra ai. */}
                      <div className="text-[11px] mt-0.5 flex items-center gap-2">
                        <span className="text-[#94a3b8]">{r.maTo}</span>
                        {r.thanhVien.length > 0
                          ? <span className="text-[#94a3b8]">· {r.thanhVien.length} thành viên</span>
                          : <span className="text-[#b45309]">· Chưa có thành viên</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ color: MAU_LOAI_AN[r.loaiAn] ?? "#555" }} className="font-medium">
                        {r.loaiAn}
                      </span>
                    </td>
                    <td className="px-3 py-3"><CongTac bat={r.bat} onToggle={() => doiTrangThai(r.id)} /></td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-on-surface tabular-nums">{r.capNhat}</div>
                      <div className="text-[11px] text-[#94a3b8] tabular-nums">{r.gio}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" title="Chỉnh sửa thông tin Ủy ban Thẩm phán"
                          onClick={() => { setDangSua(r); setThemMoi(false); }}
                          className="text-primary hover:text-[#0f4fa8] transition-colors"><Pencil size={15} /></button>
                        <button type="button" title="Gán người dùng vào Ủy ban"
                          onClick={() => setGanThanhVien(r)}
                          className="text-primary hover:text-[#0f4fa8] transition-colors"><UserPlus size={15} /></button>
                        <button type="button" title="Xóa Ủy ban"
                          onClick={() => setXoaRow(r)}
                          className="text-error hover:text-error transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 border-t border-surface-container-high text-[12px] text-[#8a94a6]">
            {hienThi.length} Ủy ban · {rows.filter(r => r.bat).length} đang được dùng khi phân công
          </div>
        </div>
      </div>

      {(themMoi || dangSua) && (
        <PopupSuaTo banGhi={dangSua}
          onDong={() => { setThemMoi(false); setDangSua(null); }}
          onLuu={luuTo} />
      )}

      {ganThanhVien && (
        <PopupGanNguoiDung
          to={ganThanhVien}
          onDong={() => setGanThanhVien(null)}
          onLuu={ids => {
            setRows(p => p.map(r => r.id === ganThanhVien.id ? { ...r, thanhVien: ids, ...bayGio() } : r));
            bao(`Đã cập nhật thành viên tổ "${ganThanhVien.ten}" — ${ids.length} người.`);
            setGanThanhVien(null);
          }} />
      )}

      {xoaRow && (
        <PopupXacNhanXoa
          ten={xoaRow.ten}
          soThanhVien={xoaRow.thanhVien.length}
          onDong={() => setXoaRow(null)}
          onXoa={() => {
            setRows(p => p.filter(x => x.id !== xoaRow.id));
            bao(`Đã xóa tổ "${xoaRow.ten}".`);
            setXoaRow(null);
          }} />
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// POPUP 1 — Chỉnh sửa thông tin Ủy ban Thẩm phán
// ═════════════════════════════════════════════════════════════════════════════

const GIOI_HAN_MO_TA = 500;

function PopupSuaTo({ banGhi, onDong, onLuu }: {
  banGhi: ToThamPhanRow | null;
  onDong: () => void;
  onLuu: (du: Omit<ToThamPhanRow, "id" | "capNhat" | "gio" | "thanhVien">) => void;
}) {
  const [maTo, setMaTo] = useState(banGhi?.maTo ?? "");
  const [ten, setTen] = useState(banGhi?.ten ?? "");
  const [loaiAn, setLoaiAn] = useState(banGhi?.loaiAn ?? "");
  const [loaiToNhom, setLoaiToNhom] = useState(banGhi?.loaiToNhom ?? "");
  const [moTa, setMoTa] = useState(banGhi?.moTa ?? "");
  const [bat, setBat] = useState(banGhi?.bat ?? false);

  const thieu = [
    !maTo.trim() && "Mã Ủy ban",
    !ten.trim() && "Tên Ủy ban",
    !loaiToNhom && "Loại Ủy ban",
  ].filter(Boolean) as string[];
  const luuDuoc = thieu.length === 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50" onClick={onDong}>
      <div className="bg-white rounded-[6px] w-[540px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-surface-container-high flex items-center justify-between">
          <div className="text-[15px] font-bold text-tertiary">
            {banGhi ? "Chỉnh sửa thông tin Ủy ban Thẩm phán" : "Thêm Ủy ban Thẩm phán"}
          </div>
          <button type="button" onClick={onDong} className="text-on-surface-variant hover:text-on-surface"><X size={17} /></button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <Nhan req>Mã Ủy ban</Nhan>
            <ONhap value={maTo} onChange={setMaTo} placeholder="VD: TTP_HS" autoFocus />
          </div>
          <div>
            <Nhan req>Tên Ủy ban</Nhan>
            <ONhap value={ten} onChange={setTen} placeholder="VD: Ủy ban Thẩm phán TAND thành phố Hà Nội" />
          </div>

          <div>
            <Nhan>Loại án</Nhan>
            <OChon value={loaiAn} onChange={setLoaiAn}>
              <option value="">-- Chọn loại án --</option>
              {LOAI_AN.map(l => <option key={l} value={l}>{l}</option>)}
            </OChon>
          </div>
          <div>
            <Nhan>Trạng thái</Nhan>
            <div className="h-[32px] flex items-center">
              <CongTac bat={bat} onToggle={() => setBat(b => !b)} />
            </div>
            <p className="text-[12px] text-[#8a94a6] mt-1">
              {bat ? "Đang sử dụng để phân công án" : "Đang tắt — không dùng khi phân công"}
            </p>
          </div>

          <div className="col-span-2">
            <Nhan req>Loại Ủy ban</Nhan>
            <div className="w-1/2 pr-2">
              <OChon value={loaiToNhom} onChange={setLoaiToNhom}>
                <option value="">-- Chọn loại Ủy ban --</option>
                {LOAI_TO_NHOM.map(l => <option key={l} value={l}>{l}</option>)}
              </OChon>
            </div>
          </div>

          <div className="col-span-2">
            <Nhan>Mô tả</Nhan>
            <textarea value={moTa} maxLength={GIOI_HAN_MO_TA}
              onChange={e => setMoTa(e.target.value)} rows={4}
              className="w-full px-2.5 py-2 text-[13px] border border-surface-container-highest rounded-[3px] resize-y focus:outline-none focus:border-primary" />
            <div className="text-[11px] text-[#94a3b8] text-right mt-0.5 tabular-nums">
              {moTa.length} / {GIOI_HAN_MO_TA}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-container-highest px-4 py-3 flex items-center justify-between gap-3">
          {/* Nút mờ mà không nói vì sao là chỗ hay tắc nhất ở biểu mẫu có * */}
          <span className="text-[12px] text-[#b45309] min-w-0 truncate">
            {luuDuoc ? "" : `Còn thiếu: ${thieu.join(" · ")}`}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button type="button" onClick={onDong}
              className="h-[30px] px-4 rounded-[3px] border border-surface-container-highest text-[13px] font-medium text-on-surface hover:bg-surface-container-low">Hủy</button>
            <button type="button" disabled={!luuDuoc}
              onClick={() => onLuu({ maTo: maTo.trim(), ten: ten.trim(), loaiAn, loaiToNhom, moTa, bat })}
              className={`h-[30px] px-4 rounded-[3px] text-[13px] font-medium text-white transition-colors
                ${luuDuoc ? "bg-error hover:bg-error-container" : "bg-[#d9c4c4] cursor-not-allowed"}`}>
              {banGhi ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// POPUP 2 — Gán người dùng vào Ủy ban (hai cột)
// ═════════════════════════════════════════════════════════════════════════════

const KICH_THUOC_TRANG = [10, 20, 50];

/** Một cột danh sách người dùng: tiêu đề + tích chọn + phân trang riêng. */
function CotNguoiDung({ tieuDe, ds, chon, setChon }: {
  tieuDe: string;
  ds: NguoiDung[];
  chon: number[];
  setChon: (ids: number[]) => void;
}) {
  const [trang, setTrang] = useState(1);
  const [moiTrang, setMoiTrang] = useState(10);

  const soTrang = Math.max(1, Math.ceil(ds.length / moiTrang));
  const trangHienTai = Math.min(trang, soTrang);
  const phanHienThi = ds.slice((trangHienTai - 1) * moiTrang, trangHienTai * moiTrang);
  const tatCaDuocChon = phanHienThi.length > 0 && phanHienThi.every(u => chon.includes(u.id));

  return (
    <div className="flex-1 min-w-0 border border-surface-container-highest rounded-[4px] flex flex-col overflow-hidden">
      <div className="px-3 py-2 bg-[#f8fafc] border-b border-surface-container-highest text-[13px] font-semibold text-tertiary">
        {tieuDe} ({ds.length})
      </div>

      <label className="px-3 py-2 border-b border-surface-container-high flex items-center gap-2 text-[12px] font-medium text-on-surface-variant cursor-pointer">
        <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
          checked={tatCaDuocChon}
          onChange={() => setChon(tatCaDuocChon
            ? chon.filter(id => !phanHienThi.some(u => u.id === id))
            : [...new Set([...chon, ...phanHienThi.map(u => u.id)])])} />
        Người dùng
      </label>

      <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[260px]">
        {phanHienThi.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[12px] text-[#94a3b8] px-4 text-center">
            Không có người dùng nào.
          </div>
        ) : phanHienThi.map(u => (
          <label key={u.id} className="px-3 py-2 border-b border-[#f2f2f2] flex items-start gap-2 cursor-pointer hover:bg-[#f8fafc] transition-colors">
            <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a] mt-[3px] flex-shrink-0"
              checked={chon.includes(u.id)}
              onChange={() => setChon(chon.includes(u.id) ? chon.filter(x => x !== u.id) : [...chon, u.id])} />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-on-surface truncate">{u.ten}</div>
              <div className="text-[11px] text-[#94a3b8] tabular-nums">{u.taiKhoan}</div>
              <div className="text-[11px] text-[#94a3b8] truncate">{u.donVi}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="px-3 py-2 border-t border-surface-container-highest bg-surface-bright flex items-center gap-2 text-[11px] text-on-surface-variant">
        <span className="flex-1 truncate">{ds.length} người dùng</span>
        <button type="button" disabled={trangHienTai <= 1} onClick={() => setTrang(trangHienTai - 1)}
          className="w-[22px] h-[22px] flex items-center justify-center border border-surface-container-highest rounded-[3px] bg-white disabled:opacity-40">
          <ChevronLeft size={12} />
        </button>
        <span className="px-2 h-[22px] leading-[20px] border border-surface-container-highest rounded-[3px] bg-white tabular-nums">{trangHienTai}</span>
        <span className="tabular-nums">/ {soTrang}</span>
        <button type="button" disabled={trangHienTai >= soTrang} onClick={() => setTrang(trangHienTai + 1)}
          className="w-[22px] h-[22px] flex items-center justify-center border border-surface-container-highest rounded-[3px] bg-white disabled:opacity-40">
          <ChevronRight size={12} />
        </button>
        <select value={moiTrang} onChange={e => { setMoiTrang(Number(e.target.value)); setTrang(1); }}
          className="h-[22px] px-1 border border-surface-container-highest rounded-[3px] bg-white text-[11px]">
          {KICH_THUOC_TRANG.map(n => <option key={n} value={n}>{n} / trang</option>)}
        </select>
      </div>
    </div>
  );
}

function PopupGanNguoiDung({ to, onDong, onLuu }: {
  to: ToThamPhanRow; onDong: () => void; onLuu: (ids: number[]) => void;
}) {
  const [daGan, setDaGan] = useState<number[]>(to.thanhVien);
  const [chonTrai, setChonTrai] = useState<number[]>([]);
  const [chonPhai, setChonPhai] = useState<number[]>([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [donVi, setDonVi] = useState("");
  const [locTuKhoa, setLocTuKhoa] = useState("");
  const [locDonVi, setLocDonVi] = useState("");

  const khop = (u: NguoiDung) => {
    if (locDonVi && u.donVi !== locDonVi) return false;
    if (!locTuKhoa.trim()) return true;
    const k = locTuKhoa.trim().toLowerCase();
    return u.ten.toLowerCase().includes(k) || u.taiKhoan.includes(k);
  };

  // Bộ lọc áp cho CẢ HAI cột — lọc một bên thôi thì hai cột nói về hai tập người
  // khác nhau, chuyển qua lại sẽ thấy người biến mất không rõ lý do.
  const chuaGan = useMemo(() => NGUOI_DUNG.filter(u => !daGan.includes(u.id) && khop(u)), [daGan, locTuKhoa, locDonVi]);
  const dsDaGan = useMemo(() => NGUOI_DUNG.filter(u => daGan.includes(u.id) && khop(u)), [daGan, locTuKhoa, locDonVi]);

  const sangPhai = () => {
    if (chonTrai.length === 0) return;
    setDaGan(p => [...new Set([...p, ...chonTrai])]);
    setChonTrai([]);
  };
  const sangTrai = () => {
    if (chonPhai.length === 0) return;
    setDaGan(p => p.filter(id => !chonPhai.includes(id)));
    setChonPhai([]);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4" onClick={onDong}>
      <div className="bg-white rounded-[6px] w-[900px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-surface-container-high flex items-center justify-between gap-3">
          <div className="text-[15px] font-bold text-tertiary truncate">
            Gán người dùng vào {to.ten}
          </div>
          <button type="button" onClick={onDong} className="text-on-surface-variant hover:text-on-surface flex-shrink-0"><X size={17} /></button>
        </div>

        {/* Thanh lọc */}
        <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-b border-surface-container">
          <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setLocTuKhoa(tuKhoa); setLocDonVi(donVi); } }}
            placeholder="Tìm tên, tài khoản, số định danh…"
            className="w-[250px] h-[32px] px-2.5 text-[13px] border border-surface-container-highest rounded-[3px] focus:outline-none focus:border-primary" />
          <div className="w-[210px]">
            <OChon value={donVi} onChange={setDonVi}>
              <option value="">Lọc theo đơn vị</option>
              {DON_VI.map(d => <option key={d} value={d}>{d}</option>)}
            </OChon>
          </div>
          <button type="button" onClick={() => { setLocTuKhoa(tuKhoa); setLocDonVi(donVi); }}
            className="flex items-center gap-1.5 h-[32px] px-4 bg-error hover:bg-error-container text-white rounded-[3px] text-[13px] font-medium transition-colors">
            <Search size={13} /> Lọc
          </button>
          <button type="button"
            onClick={() => { setTuKhoa(""); setDonVi(""); setLocTuKhoa(""); setLocDonVi(""); }}
            className="flex items-center gap-1.5 h-[32px] px-3 border border-surface-container-highest rounded-[3px] bg-white hover:bg-surface-container-low text-[13px] text-on-surface-variant transition-colors">
            <RotateCw size={13} /> Xóa lọc
          </button>

          <div className="flex-1" />

          {/* "Gán tất cả" chỉ gán những người ĐANG hiện theo bộ lọc — nếu gán cả
              danh bạ thì một cú bấm nhầm kéo theo hàng chục người vào tổ. */}
          <button type="button"
            onClick={() => { setDaGan(p => [...new Set([...p, ...chuaGan.map(u => u.id)])]); setChonTrai([]); }}
            disabled={chuaGan.length === 0}
            title={chuaGan.length === 0 ? "Không còn ai để gán" : `Gán ${chuaGan.length} người đang hiển thị`}
            className="flex items-center gap-1.5 h-[32px] px-3 border border-error text-error rounded-[3px] bg-white hover:bg-[#fcf5f5] text-[13px] font-medium transition-colors disabled:opacity-40 disabled:hover:bg-white">
            <Users size={13} /> Gán tất cả ({chuaGan.length})
          </button>
        </div>

        {/* Hai cột */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-stretch gap-3">
            <CotNguoiDung tieuDe="Người dùng chưa được gán" ds={chuaGan} chon={chonTrai} setChon={setChonTrai} />

            <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0">
              <button type="button" onClick={sangPhai} disabled={chonTrai.length === 0}
                title="Gán người đã chọn vào tổ"
                className="w-[34px] h-[30px] flex items-center justify-center border border-surface-container-highest rounded-[3px] bg-white hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:hover:bg-white transition-colors">
                <ChevronsRight size={15} />
              </button>
              <button type="button" onClick={sangTrai} disabled={chonPhai.length === 0}
                title="Bỏ người đã chọn khỏi tổ"
                className="w-[34px] h-[30px] flex items-center justify-center border border-surface-container-highest rounded-[3px] bg-white hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:hover:bg-white transition-colors">
                <ChevronsLeft size={15} />
              </button>
            </div>

            <CotNguoiDung tieuDe="Người dùng đã được gán" ds={dsDaGan} chon={chonPhai} setChon={setChonPhai} />
          </div>

          {/* Bộ lọc đang giấu bớt người đã gán thì phải nói ra, nếu không con số
              trên tiêu đề cột và số thành viên thật lệch nhau mà không rõ vì sao. */}
          {(locTuKhoa || locDonVi) && dsDaGan.length !== daGan.length && (
            <p className="mt-2.5 flex items-start gap-1.5 text-[12px] text-[#b45309]">
              <AlertCircle size={13} className="flex-shrink-0 mt-[2px]" />
              Tổ đang có <b className="font-semibold mx-1">{daGan.length}</b> thành viên,
              bộ lọc chỉ hiện <b className="font-semibold mx-1">{dsDaGan.length}</b>.
            </p>
          )}
        </div>

        <div className="border-t border-surface-container-highest px-4 py-3 flex justify-end gap-2 flex-shrink-0">
          <button type="button" onClick={onDong}
            className="h-[30px] px-4 rounded-[3px] border border-surface-container-highest text-[13px] font-medium text-on-surface hover:bg-surface-container-low">Đóng</button>
          <button type="button" onClick={() => onLuu(daGan)}
            className="h-[30px] px-4 rounded-[3px] bg-error hover:bg-error-container text-white text-[13px] font-medium transition-colors">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// POPUP 3 — Xác nhận xóa
// ═════════════════════════════════════════════════════════════════════════════

function PopupXacNhanXoa({ ten, soThanhVien, onDong, onXoa }: {
  ten: string; soThanhVien: number; onDong: () => void; onXoa: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40" onClick={onDong}>
      <div className="bg-white rounded-[6px] w-[400px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 flex items-start gap-3">
          <span className="w-[26px] h-[26px] rounded-full bg-[#f59e0b] text-white flex items-center justify-center flex-shrink-0 mt-[1px]">
            <AlertCircle size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-on-surface mb-1.5">Xác nhận xóa</div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Bạn có chắc chắn muốn xóa Ủy ban “{ten}”?
            </p>
            {/* Tổ còn thành viên thì nhắc lối thoát mềm hơn — công tắc đã có sẵn
                để tạm dừng, xóa là mất luôn danh sách thành viên. */}
            {soThanhVien > 0 && (
              <p className="mt-2 text-[12px] text-[#b45309] leading-relaxed">
                Tổ đang có <b className="font-semibold">{soThanhVien}</b> thành viên.
                Nếu chỉ muốn tạm dừng, hãy <b className="font-semibold">tắt công tắc</b> thay vì xóa.
              </p>
            )}
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-end gap-2">
          <button type="button" onClick={onDong}
            className="h-[30px] px-4 rounded-[3px] border border-surface-container-highest text-[13px] font-medium text-on-surface hover:bg-surface-container-low">Hủy</button>
          <button type="button" onClick={onXoa}
            className="h-[30px] px-4 rounded-[3px] bg-[#e5484d] hover:bg-error text-white text-[13px] font-medium transition-colors">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
