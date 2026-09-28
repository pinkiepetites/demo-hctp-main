import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  Printer,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

/**
 * Màn phân công thẩm phán — dùng chung cho TANDTC và TAND cấp tỉnh.
 *
 * Lý do có một component duy nhất: trước đây mỗi cấp có một bản riêng nên tab,
 * nút, cột bảng và luồng phân công lệch nhau theo thời gian. Cấp chỉ khác nhau ở
 * `cap`: TANDTC có thêm tab phân công ngẫu nhiên và bộ lọc thẩm quyền, còn cấp
 * tỉnh chỉ chỉ định. Mọi thứ khác — bảng, bộ lọc, popup lý do, sửa phân công —
 * là một mã duy nhất nên không thể lệch.
 */

export type CapPhanCong = "toicao" | "tinh";

export interface DonPhanCong {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  /** Ngày cán bộ nhập đơn — khác ngày thụ lý. Bộ lọc "Ngày nhập đơn" dùng trường này. */
  ngayNhapDon?: string;
  nguoiDungDon: string;
  diaChi: string;
  soBA: string;
  ngayBA: string;
  toaBA: string;
  loaiAn: string;
  hinhThuc: string;
  /** Người nhập đơn — dùng cho bộ lọc và cột thông tin. */
  nguoiNhapDon?: string;
  /** TANDTC: cấp giải quyết của đơn, dùng cho bộ lọc thẩm quyền. */
  capGiaiQuyet?: "toicao" | "bac3";
  /** TANDTC: số tờ trình phân công đã lập — có giá trị thì khóa đổi thẩm phán. */
  toTrinh?: string;
  /** Cấp tỉnh: số Thông báo phân công đã lập. */
  thongBao?: string;
  /** Thẩm phán đã gán sẵn (demo dữ liệu đầu vào). */
  thamPhan?: string;
  /** Ngày phân công đã gán sẵn (demo dữ liệu đầu vào). */
  ngayPhanCong?: string;
  /** Lý do đã ghi khi phân công — màn tạo quyết định dùng để in nội dung. */
  lyDoPhanCong?: string;
  /** Phân công có kèm lý do đặc biệt hay không. */
  lyDoDacBiet?: boolean;
}

export interface ThamPhanItem {
  hoTen: string;
  bac: string;
  donVi?: string;
  /** Loại án được phân công. Rỗng = nhận mọi loại án. */
  loaiAn?: string[];
  /** Chỉ dùng cho TANDTC. */
  cap?: "toicao" | "bac3";
  soVuDangGiaiQuyet?: number;
}

interface Item extends DonPhanCong {
  thamPhan: string;
  ngayPhanCong: string;
  lyDoPhanCong: string;
  lyDoDacBiet: boolean;
  /** Đã chốt phân công thì không sửa được nữa. */
  khoa: boolean;
  /** Lý do báo hệ thống không gán được khi phân công ngẫu nhiên. */
  loi?: string;
}

export interface PhanCongThamPhanScreenProps {
  cap: CapPhanCong;
  rows: DonPhanCong[];
  thamPhan: ThamPhanItem[];
  loaiAnOptions: string[];
  /** Nhóm hình thức đơn để dựng optgroup. Không có thì dùng danh sách phẳng. */
  hinhThucNhom?: { label: string; items: string[] }[];
  initialTab?: 0 | 1 | 2;
  currentRole?: string;
  onOpenThamPhanPopup?: () => void;
  onPhanCong?: (
    donIds: number[],
    ganTheoDon: Record<number, string>,
    lyDo: string,
    lyDoDacBiet: boolean,
  ) => void;
  onSuaPhanCong?: (donId: number, thamPhan: string, ngaySua: string, lyDo: string, lyDoDacBiet: boolean) => void;
  /**
   * Mở màn tạo quyết định phân công. Chỉ cấp tỉnh dùng nên để trống ở TANDTC —
   * nút chỉ hiện khi có callback, giữ phần tạo quyết định ở nơi sở hữu luồng ký.
   */
  onTaoQuyetDinh?: (don: DonPhanCong[]) => void;
}

const MAX_LY_DO = 500;
const MIN_LY_DO_SUA = 10;
const PAGE_SIZE = 10;
const LY_DO_SUA_MAC_DINH = "Thay đổi phân công thẩm phán";
const LY_DO_DAC_BIET_HAN = " — lý do đặc biệt: vụ án đặc biệt phức tạp, cần thẩm phân có kinh nghiệm phù hợp";

const ddmmyyyy = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const chonNgayHomNay = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  /** `<input type="date">` trả về `yyyy-mm-dd` còn bảng hiển thị `dd/mm/yyyy`. */
  const ymd2ddmy = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
  };

const chuHoa = (v: unknown) =>
  String(v ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const chua = (haystack: string, needle: string) =>
  chuHoa(haystack).includes(chuHoa(needle));

export function PhanCongThamPhanScreen({
  cap,
  rows,
  thamPhan,
  loaiAnOptions,
  hinhThucNhom,
  initialTab,
  currentRole = "can-bo",
  onOpenThamPhanPopup,
  onPhanCong,
  onSuaPhanCong,
  onTaoQuyetDinh,
}: PhanCongThamPhanScreenProps) {
  const laToiCao = cap === "toicao";
  // Cả hai cấp đều có đủ ba tab: ngẫu nhiên, chỉ định và kết quả.
  const tabMacDinh = (): 0 | 1 | 2 => (initialTab === undefined ? 0 : initialTab);

  const [tab, setTab] = useState<0 | 1 | 2>(tabMacDinh);
  const [capTP, setCapTP] = useState<"tatca" | "toicao" | "bac3">("tatca");
  const [items, setItems] = useState<Item[]>(() =>
    rows.map(r => ({
      ...r,
      thamPhan: r.thamPhan ?? "",
      ngayPhanCong: r.ngayPhanCong ?? "",
      lyDoPhanCong: "",
      lyDoDacBiet: false,
      khoa: !!r.toTrinh || !!r.thongBao,
    })),
  );

  // Bộ lọc nâng cao — gập lại mặc định để màn chỉ lộ radio thẩm quyền và bảng.
  const [moTimKiem, setMoTimKiem] = useState(false);
  const [fToaAn, setFToaAn] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fSoThuLy, setFSoThuLy] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fTuNgay, setFTuNgay] = useState("");
  const [fDenNgay, setFDenNgay] = useState("");
  const [fNhapDonTuNgay, setFNhapDonTuNgay] = useState("");
  const [fNhapDonDenNgay, setFNhapDonDenNgay] = useState("");
  const [fNguoiNhapDon, setFNguoiNhapDon] = useState<string[]>([]);
  const [fLoaiAn, setFLoaiAn] = useState<string[]>([]);
  const [fLyDoDacBiet, setFLyDoDacBiet] = useState<"" | "co" | "khong">("");
  const [timKiem, setTimKiem] = useState("");

  const [selected, setSelected] = useState<number[]>([]);
  const [rowJudge, setRowJudge] = useState<Record<number, string>>({});
  const [commonJudge, setCommonJudge] = useState("");
  const [commonLyDo, setCommonLyDo] = useState("");
  const [page, setPage] = useState(1);

  const [showLyDo, setShowLyDo] = useState(false);
  const [lyDo, setLyDo] = useState("");
  const [lyDoDacBiet, setLyDoDacBiet] = useState(false);
  const [xacNhan, setXacNhan] = useState<null | { tieuDe: string; noiDung: string; chay: () => void }>(null);

  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Record<number, { thamPhan: string; ngaySua: string; lyDo: string; dacBiet: boolean }>>({});

  const [showDsThamPhan, setShowDsThamPhan] = useState(false);
  const [tpDonVi, setTpDonVi] = useState("");
  const [tpLoaiAn, setTpLoaiAn] = useState("");
  const [tpThamQuyen, setTpThamQuyen] = useState("");

  const doiThuong = currentRole === "chanh-an" || currentRole === "truong-phong";
  const coQuyenPhanCong = laToiCao ? currentRole !== "can-bo" || doiThuong : doiThuong;
  // TANDTC cho Cán bộ phân công ngẫu nhiên (chỉ không được chỉ định); cấp tỉnh
  // thì cả hai cách đều chỉ Chánh án / Trưởng phòng.
  const duocPhepNgauNhien = laToiCao || coQuyenPhanCong;

  const toaOptions = useMemo(
    () => Array.from(new Set(items.map(r => r.toaBA))).sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );
  const nguoiNhapOptions = useMemo(
    () => Array.from(new Set(items.map(r => r.nguoiNhapDon).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );
  const donViOptions = useMemo(
    () => Array.from(new Set(thamPhan.map(t => t.donVi).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "vi")),
    [thamPhan],
  );

  /** Thẩm phán hợp lệ cho một đơn: đúng đơn vị, đúng loại án, đúng thẩm quyền. */
  const thamPhanHopLe = useMemo(
    () => (r: Item) =>
      thamPhan.filter(tp => {
        if (tp.donVi && r.toaBA && tp.donVi !== r.toaBA) return false;
        if (tp.loaiAn?.length && !tp.loaiAn.includes(r.loaiAn)) return false;
        if (laToiCao && capTP !== "tatca" && tp.cap && tp.cap !== capTP) return false;
        return true;
      }),
    [thamPhan, laToiCao, capTP],
  );

  const daPhanCong = (r: Item) => !!r.thamPhan;
  const choPhanCongChua = (r: Item) => !daPhanCong(r);

  /** Nói rõ vì sao không chọn được thẩm phán — "thiếu cán bộ" và "thiếu đơn vị
   *  chuyển đến" là hai lỗi khác nhau, gộp chung thì cán bộ không biết cần
   *  xin ai. */
  const goiYThieuThamPhan = (r: Item) => {
    const theoLoaiAn = thamPhan.filter(tp => !tp.loaiAn?.length || tp.loaiAn.includes(r.loaiAn));
    if (theoLoaiAn.length === 0) return "Không có thẩm phán phù hợp loại án";
    const theoDonVi = theoLoaiAn.filter(tp => !tp.donVi || tp.donVi === r.toaBA);
    if (theoDonVi.length === 0) return `Thiếu thẩm phán tại ${r.toaBA}`;
    return "Chưa có thẩm phán được phân công";
  };

  const filtered = useMemo(() => {
    const dd = (v?: string) => {
      if (!v) return "";
      const [a, b, c] = v.split("/").map(Number);
      return Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)
        ? `${c}-${String(b).padStart(2, "0")}-${String(a).padStart(2, "0")}`
        : "";
    };
    return items.filter(r => {
      if (laToiCao && capTP !== "tatca" && r.capGiaiQuyet !== capTP) return false;
      if (fToaAn && r.toaBA !== fToaAn) return false;
      if (fSoBA && !chuHoa(r.soBA).includes(chuHoa(fSoBA))) return false;
      if (fSoThuLy && !chuHoa(r.soThuLy).includes(chuHoa(fSoThuLy))) return false;
      if (fHinhThuc && r.hinhThuc !== fHinhThuc) return false;
      if (fLoaiAn.length && !fLoaiAn.includes(r.loaiAn)) return false;
      if (fNguoiNhapDon.length && !fNguoiNhapDon.includes(r.nguoiNhapDon ?? "")) return false;
      if (fLyDoDacBiet === "co" && !r.lyDoDacBiet) return false;
      if (fLyDoDacBiet === "khong" && r.lyDoDacBiet) return false;
      const ngayTL = dd(r.ngayThuLy);
      if (fTuNgay && (!ngayTL || ngayTL < fTuNgay)) return false;
      if (fDenNgay && (!ngayTL || ngayTL > fDenNgay)) return false;
      const ngayND = dd(r.ngayNhapDon ?? r.ngayThuLy);
      if (fNhapDonTuNgay && (!ngayND || ngayND < fNhapDonTuNgay)) return false;
      if (fNhapDonDenNgay && (!ngayND || ngayND > fNhapDonDenNgay)) return false;
      if (timKiem) {
        const k = chuHoa(timKiem);
        const trung =
          chuHoa(r.soThuLy).includes(k) || chuHoa(r.nguoiDungDon).includes(k) ||
          chuHoa(r.soBA).includes(k) || chuHoa(r.toaBA).includes(k) ||
          chuHoa(r.thamPhan).includes(k) || chuHoa(r.ngayThuLy).includes(k);
        if (!trung) return false;
      }
      if (tab === 2) return daPhanCong(r);
      return choPhanCongChua(r);
    });
  }, [items, tab, laToiCao, capTP, fToaAn, fSoBA, fSoThuLy, fHinhThuc, fLoaiAn,
      fNguoiNhapDon, fLyDoDacBiet, fTuNgay, fDenNgay, fNhapDonTuNgay, fNhapDonDenNgay, timKiem]);

  const soChuaPhanCong = items.filter(choPhanCongChua).length;
  const soDaPhanCong = items.length - soChuaPhanCong;

  const tabs = useMemo(() => [
    { key: 0 as const, label: "DS chưa phân công ngẫu nhiên", count: soChuaPhanCong },
    { key: 1 as const, label: "DS chưa phân công chỉ định", count: soChuaPhanCong },
    { key: 2 as const, label: "Quản lý kết quả phân công", count: soDaPhanCong },
  ], [soChuaPhanCong, soDaPhanCong]);

  const doLuu = useMemo(() => {
    const acc: Record<string, number> = {};
    items.forEach(r => { if (r.thamPhan) acc[r.thamPhan] = (acc[r.thamPhan] ?? 0) + 1; });
    return acc;
  }, [items]);
  const nhanThamPhan = (tp: string) => tp + (doLuu[tp] ? ` (${doLuu[tp]} đơn)` : "");

  const doiTab = (key: 0 | 1 | 2) => { setTab(key); setSelected([]); setEditingRow(null); setPage(1); };

  const toggleRow = (id: number) =>
    setSelected(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]));

  // Ở tab Quản lý kết quả vẫn tick được, nhưng bỏ qua đơn đã có tờ trình /
  // thông báo: đơn đó phân công đã chốt, tick vào chỉ để sửa/xóa là vô nghĩa.
  // Ở hai tab còn lại, đơn chưa phân công thì còn có thể chỉ định thẩm phán.
  const selectable = filtered.filter(r => (tab === 2 ? !r.khoa : thamPhanHopLe(r).length > 0));
  const allSelected = selectable.length > 0 && selectable.every(r => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : selectable.map(r => r.id));

  const clearFilters = () => {
    setFToaAn(""); setFSoBA(""); setFSoThuLy(""); setFHinhThuc("");
    setFTuNgay(""); setFDenNgay(""); setFNhapDonTuNgay(""); setFNhapDonDenNgay("");
    setFNguoiNhapDon([]); setFLoaiAn([]); setFLyDoDacBiet(""); setTimKiem("");
  };

  // ── Phân công ngẫu nhiên ────────────────────────────────────────────────
  const runRandom = () => {
    const ngay = ddmmyyyy(new Date());
    setItems(p => p.map(r => {
      if (!choPhanCongChua(r) || !filtered.some(f => f.id === r.id)) return r;
      const ds = thamPhanHopLe(r);
      if (ds.length === 0) return { ...r, loi: "Không đủ cán bộ" };
      return { ...r, thamPhan: ds[Math.floor(Math.random() * ds.length)].hoTen, ngayPhanCong: ngay, loi: undefined };
    }));
  };

  // ── Phân công chỉ định ──────────────────────────────────────────────────
  const moLyDoPopup = () => {
    if (!coQuyenPhanCong) { setXacNhan({ tieuDe: "Không đủ thẩm quyền", noiDung: "Chỉ Chánh án mới phân công được thẩm phán.", chay: () => { } }); return; }
    if (selected.length === 0) { setXacNhan({ tieuDe: "Chưa chọn đơn", noiDung: "Vui lòng tích chọn ít nhất một đơn trong bảng.", chay: () => { } }); return; }
    setLyDo(commonLyDo);
    setLyDoDacBiet(false);
    setShowLyDo(true);
  };

  const runChiDinh = () => {
    const ids = [...selected];
    const nhom = new Map<number, string>();
    const khongHopLe: number[] = [];
    ids.forEach(id => {
      const r = items.find(x => x.id === id);
      if (!r) return;
      const tp = rowJudge[id] || commonJudge;
      if (!tp) return;
      // Danh sách thẩm phán chung gộp nhiều đơn lại, nên thẩm phán hợp lệ với
      // đơn A có thể không thụ lý được loại án của đơn B. Chặn ở đây để không
      // ghi sai vào hồ sơ thay vì chỉ tin dropdown.
      if (!thamPhanHopLe(r).some(x => x.hoTen === tp)) { khongHopLe.push(id); return; }
      nhom.set(id, tp);
    });
    if (khongHopLe.length > 0) {
      setXacNhan({
        tieuDe: "Thẩm phán không phù hợp",
        noiDung: `Có ${khongHopLe.length} đơn đang được gán thẩm phán không thụ lý được loại án hoặc không thuộc đơn vị chuyển đến. Vui lòng chọn lại thẩm phán cho các đơn này.`,
        chay: () => { },
      });
      return;
    }
    if (nhom.size === 0) {
      setXacNhan({ tieuDe: "Chưa chọn thẩm phán", noiDung: "Vui lòng chọn thẩm phán cho đơn hoặc chọn thẩm phán chung.", chay: () => { } });
      return;
    }
    const ngay = ddmmyyyy(new Date());
    const lyDoDayDu = lyDo.trim() + (lyDoDacBiet ? LY_DO_DAC_BIET_HAN : "");
    setItems(p => p.map(r => {
      const tp = nhom.get(r.id);
      if (!tp) return r;
      return { ...r, thamPhan: tp, ngayPhanCong: r.ngayPhanCong || ngay, lyDoPhanCong: lyDoDayDu, lyDoDacBiet: lyDoDacBiet, khoa: true, loi: undefined };
    }));
    onPhanCong?.([...nhom.keys()], Object.fromEntries(nhom), lyDoDayDu, lyDoDacBiet);
    setShowLyDo(false);
    setLyDo("");
    setRowJudge({});
    setCommonJudge("");
    setSelected([]);
  };

  // ── Sửa phân công ────────────────────────────────────────────────────────
  const startEdit = (r: Item) => {
    setEditingRow(r.id);
    setEditForm(p => ({
      ...p,
      [r.id]: {
        thamPhan: r.thamPhan,
        ngaySua: chonNgayHomNay(),
        lyDo: LY_DO_SUA_MAC_DINH,
        dacBiet: r.lyDoDacBiet,
      },
    }));
  };

  const saveEdit = (id: number) => {
    const f = editForm[id];
    if (!f || f.lyDo.trim().length < MIN_LY_DO_SUA) return;
    const ngay = ymd2ddmy(f.ngaySua) || ddmmyyyy(new Date());
    const lyDoDayDu = f.lyDo.trim() + (f.dacBiet ? LY_DO_DAC_BIET_HAN : "");
    // Sửa phân công phải ghi đè cả ngày lẫn lý do, nếu không bảng kết quả sẽ
    // hiện thông tin cũ trong khi hồ sơ đã đổi.
    setItems(p => p.map(r => (
      r.id === id
        ? { ...r, thamPhan: f.thamPhan, ngayPhanCong: ngay, lyDoPhanCong: lyDoDayDu, lyDoDacBiet: f.dacBiet }
        : r
    )));
    onSuaPhanCong?.(id, f.thamPhan, ngay, f.lyDo.trim(), f.dacBiet);
    setEditingRow(null);
  };

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const trang = Math.min(page, pageCount);
  const pageRows = filtered.slice((trang - 1) * PAGE_SIZE, trang * PAGE_SIZE);

  const dsThamPhanHienThi = thamPhan.filter(tp => {
    if (tpDonVi && tp.donVi !== tpDonVi) return false;
    if (tpLoaiAn && tp.loaiAn?.length && !tp.loaiAn.includes(tpLoaiAn)) return false;
    if (tpThamQuyen && tp.cap && tp.cap !== tpThamQuyen) return false;
    if (tpThamQuyen && !tp.cap) return false;
    return true;
  });

  const optgroupHinhThuc = () => {
    if (hinhThucNhom?.length) {
      return hinhThucNhom.map(g => (
        <optgroup key={g.label} label={g.label}>
          {g.items.map(o => <option key={o} value={o}>{o}</option>)}
        </optgroup>
      ));
    }
    return Array.from(new Set(items.map(r => r.hinhThuc))).map(o => <option key={o} value={o}>{o}</option>);
  };

  const cotLich = tab === 1;

  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 pt-4 pb-6">
      <h1 className="text-[20px] font-bold text-[#1d2e4f] mb-3">Phân công thẩm phán</h1>

      {/* Tabs — kiểu gạch chân, kèm số đơn chờ của từng bước */}
      <div className="flex gap-7 border-b border-[#eee]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => doiTab(t.key)}
            className={`flex items-center gap-1.5 pt-1 pb-2.5 text-[13px] border-b-2 -mb-px transition-colors
              ${tab === t.key ? "border-[#8b1a1a] text-[#8b1a1a] font-medium" : "border-transparent text-[#333] hover:text-[#8b1a1a]"}`}>
            {t.label}
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[17px] px-1 rounded-full text-[10px] font-semibold
              ${tab === t.key ? "bg-[#8b1a1a] text-white" : "bg-[#e5e5e5] text-[#666]"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Còn đơn chưa phân công — đếm trên toàn bộ danh sách, không theo bộ lọc */}
      {soChuaPhanCong > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[12px] font-medium bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">
          <AlertTriangle size={13} /> Còn {soChuaPhanCong} vụ án chưa được phân công
        </div>
      )}

      {/* Cấp thẩm phán — chỉ TANDTC mới có hai loại thẩm phán */}
      {laToiCao && (
        <div className="flex items-center gap-5 py-4">
          {[["tatca", "Tất cả"], ["toicao", "Thẩm phán Tối cao"], ["bac3", "Thẩm phán bậc 3.2"]].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
              <input type="radio" name="capTP" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                checked={capTP === val} onChange={() => setCapTP(val as "tatca" | "toicao" | "bac3")} />
              {label}
            </label>
          ))}
        </div>
      )}

      {/* Tiêu đề danh sách + thao tác */}
      <div className={`flex items-center justify-between gap-3 ${laToiCao ? "" : "pt-4"} pb-3`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[14px] font-medium text-[#1d2e4f]">Danh sách phân công</span>
          {(cotLich || tab === 2) && selected.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-[2px] rounded-[3px] text-[11px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">
              Đã chọn {selected.length} đơn
              <button onClick={() => setSelected([])} title="Bỏ chọn tất cả" className="text-[#1a5a96]/70 hover:text-[#1a5a96]">
                <X size={11} />
              </button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setMoTimKiem(v => !v)} aria-expanded={moTimKiem}
            className="flex items-center gap-1.5 h-[30px] px-2 text-[12px] text-[#1a73e8] hover:text-[#1557b0]">
            <ChevronDown size={14} className={`transition-transform ${moTimKiem ? "rotate-180" : ""}`} />
            Tìm kiếm nâng cao
          </button>
          <button
            onClick={() => (onOpenThamPhanPopup ? onOpenThamPhanPopup() : setShowDsThamPhan(true))}
            className="flex items-center gap-1.5 h-[30px] px-3 border border-[#d9d9d9] bg-white text-[#333] hover:border-[#8b1a1a] hover:text-[#8b1a1a] rounded-[4px] text-[12px] transition-colors"
          >
            <Users size={13} /> Danh sách thẩm phán
          </button>
          {tab === 0 && (
            <button
              onClick={() => {
                if (!duocPhepNgauNhien) {
                  setXacNhan({
                    tieuDe: "Không đủ thẩm quyền",
                    noiDung: "Chỉ Chánh án mới phân công được thẩm phán.",
                    chay: () => { },
                  });
                  return;
                }
                setXacNhan({
                  tieuDe: "Xác nhận phân công ngẫu nhiên",
                  noiDung: `Phân công ngẫu nhiên ${filtered.length} đơn đang hiển thị? Đơn nào không đủ cán bộ hợp lệ sẽ được đánh dấu chưa phân công.`,
                  chay: runRandom,
                });
              }}
              className="flex items-center gap-1.5 h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors">
              Phân công ngẫu nhiên
            </button>
          )}
          {cotLich && (
            <>
              <span className="text-[12px] font-medium text-[#555]">Chỉ định cho:</span>
              <div className="relative w-[190px]">
                <select
                  value={commonJudge}
                  onChange={e => setCommonJudge(e.target.value)}
                  title="Chọn thẩm phán chung cho các đơn đang chọn"
                  className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#d9d9d9] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]"
                >
                  <option value="">-- Chọn thẩm phán --</option>
                  {Array.from(new Set(selectable.flatMap(r => thamPhanHopLe(r).map(t => t.hoTen)))).map(tp => (
                    <option key={tp} value={tp}>{nhanThamPhan(tp)}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
              <input
                value={commonLyDo}
                onChange={e => setCommonLyDo(e.target.value)}
                placeholder="Lý do phân công (chung)"
                title="Lý do sẽ áp dụng cho mọi đơn đang chọn"
                className="h-[30px] w-[200px] px-2 text-[12px] border border-[#d9d9d9] rounded-[4px] focus:outline-none focus:border-[#1a73e8]"
              />
              <button
                onClick={moLyDoPopup}
                className="flex items-center gap-1.5 h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors">
                Phân công chỉ định ({selected.length} đơn)
              </button>
            </>
          )}
          {tab === 2 && (
            <>
              {onTaoQuyetDinh && (
                <button
                  onClick={() => {
                    // Đã tick thì chỉ tạo quyết định cho các đơn tick, chưa tick
                    // thì lấy toàn bộ kết quả đang hiển thị như cũ.
                    const daPhanCongDs = filtered.filter(r => daPhanCong(r));
                    const ds = selected.length
                      ? daPhanCongDs.filter(r => selected.includes(r.id))
                      : daPhanCongDs;
                    if (ds.length === 0) {
                      setXacNhan({
                        tieuDe: "Chưa có kết quả phân công",
                        noiDung: selected.length
                          ? "Các đơn đang tick chưa có thẩm phán được phân công nên chưa thể tạo quyết định."
                          : "Chưa có đơn nào được phân công thẩm phán nên chưa thể tạo quyết định.",
                        chay: () => { },
                      });
                      return;
                    }
                    onTaoQuyetDinh(ds);
                  }}
                  className="flex items-center gap-1.5 h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors">
                  <FileText size={13} /> Tạo Quyết định phân công
                  {selected.length > 0 && ` (${selected.length} đơn đã chọn)`}
                </button>
              )}
              <button
                onClick={() => setXacNhan({
                  tieuDe: "In danh sách kết quả phân công",
                  noiDung: `In ${filtered.length} kết quả phân công đang hiển thị?`,
                  chay: () => window.print(),
                })}
                className="flex items-center gap-1.5 h-[30px] px-3 border border-[#d9d9d9] bg-white text-[#333] hover:border-[#8b1a1a] hover:text-[#8b1a1a] rounded-[4px] text-[12px] transition-colors">
                <Printer size={13} /> In danh sách
              </button>
              <button className="flex items-center gap-1.5 h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors">
                <Search size={13} /> Tìm kiếm
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tìm kiếm nâng cao — dùng chung cho mọi tab */}
      {moTimKiem && (
        <div className="mb-4 p-4 bg-[#fafafa] border border-[#eee] rounded-[4px] space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Tên tòa án</label>
              <div className="relative">
                <select value={fToaAn} onChange={e => setFToaAn(e.target.value)}
                  className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option value="">Tất cả tòa án</option>
                  {toaOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Số BA/QĐ</label>
              <input value={fSoBA} onChange={e => setFSoBA(e.target.value)} placeholder="Nhập số BA/QĐ"
                className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Ngày thụ lý</label>
              <div className="flex items-center gap-1">
                <input type="date" value={fTuNgay} onChange={e => setFTuNgay(e.target.value)}
                  className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                <span className="text-[#888] text-[11px]">—</span>
                <input type="date" value={fDenNgay} onChange={e => setFDenNgay(e.target.value)}
                  className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Ngày nhập đơn</label>
              <div className="flex items-center gap-1">
                <input type="date" value={fNhapDonTuNgay} onChange={e => setFNhapDonTuNgay(e.target.value)}
                  className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                <span className="text-[#888] text-[11px]">—</span>
                <input type="date" value={fNhapDonDenNgay} onChange={e => setFNhapDonDenNgay(e.target.value)}
                  className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Hình thức</label>
              <div className="relative">
                <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)}
                  className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option value="">Tất cả hình thức</option>
                  {optgroupHinhThuc()}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Số thụ lý</label>
              <input value={fSoThuLy} onChange={e => setFSoThuLy(e.target.value)} placeholder="Nhập số thụ lý"
                className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Người nhập đơn</label>
              <div className="relative">
                <select multiple value={fNguoiNhapDon} onChange={e => setFNguoiNhapDon(Array.from(e.target.selectedOptions).map(o => o.value))}
                  className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]">
                  {nguoiNhapOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Lý do đặc biệt</label>
              <div className="relative">
                <select value={fLyDoDacBiet} onChange={e => setFLyDoDacBiet(e.target.value as "" | "co" | "khong")}
                  className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option value="">Tất cả</option>
                  <option value="co">Có</option>
                  <option value="khong">Không</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#555] mb-1.5">Loại án</label>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {loaiAnOptions.map(la => (
                <label key={la} className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#333]">
                  <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                    checked={fLoaiAn.includes(la)}
                    onChange={() => setFLoaiAn(p => (p.includes(la) ? p.filter(x => x !== la) : [...p, la]))} />
                  {la}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button onClick={clearFilters}
              className="h-[28px] px-3 rounded-[3px] border border-[#ccc] bg-white text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Ô tìm kiếm nhanh + phân trang */}
      <div className="flex items-center justify-between gap-3 pb-2">
        <div className="relative w-[280px]">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
          <input value={timKiem} onChange={e => { setTimKiem(e.target.value); setPage(1); }}
            placeholder="Tìm theo số thụ lý, người đứng đơn, số BA/QĐ…"
            className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
        </div>
        <span className="text-[12px] text-[#666]">Tổng {filtered.length} đơn</span>
      </div>

      {/* Table */}
      <div className="border-t border-[#eee]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#fafafa]">
                <th className="border-b border-[#eee] px-2 py-3 text-center w-[30px]">
                  <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                    checked={allSelected}
                    disabled={selectable.length === 0}
                    onChange={toggleAll}
                    title="Chọn tất cả đơn đang hiển thị" />
                </th>
                <th className="border-b border-[#eee] px-2 py-3 text-center font-semibold text-[#1d2e4f] w-[36px]">STT</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[130px]">Số thụ lý</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[95px]">Ngày thụ lý</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f]">Thông tin người đứng đơn</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f]">Thông tin BA/QĐ đề nghị GĐT, TT</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[120px]">Loại án</th>
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[110px]">Hình thức đơn</th>
                {tab === 2 && (
                  <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[100px]">Ngày phân công</th>
                )}
                <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[180px]">Thẩm phán</th>
                {cotLich && (
                  <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[160px]">Lý do phân công</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="border-b border-[#eee] px-4 py-10 text-center text-[#999]">
                    {tab === 2 ? "Chưa có đơn nào được phân công" : "Không còn đơn nào chờ phân công"}
                  </td>
                </tr>
              ) : pageRows.map((row, i) => {
                const hopLe = thamPhanHopLe(row);
                const khoa = row.khoa;
                const f = editForm[row.id];
                return (
                  <tr key={row.id} className={`align-middle ${selected.includes(row.id) ? "bg-[#eef4fd]" : "bg-white hover:bg-[#fafafa]"}`}>
                    <td className="border-b border-[#eee] px-2 py-3 text-center">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={selected.includes(row.id)}
                        disabled={tab === 2 ? khoa : khoa || hopLe.length === 0}
                        title={tab === 2
                          ? (khoa ? "Đơn đã có tờ trình/thông báo — phân công đã chốt" : "Chọn đơn này")
                          : khoa ? "Đơn đã phân công" : hopLe.length === 0 ? "Không có thẩm phán phù hợp" : undefined}
                        onChange={() => toggleRow(row.id)} />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-3 text-center text-[#666]">{(trang - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="border-b border-[#eee] px-3 py-3 font-semibold text-[#1a5a96]">{row.soThuLy}</td>
                    <td className="border-b border-[#eee] px-3 py-3 text-[#555]">{row.ngayThuLy}</td>
                    <td className="border-b border-[#eee] px-3 py-3">
                      <div className="space-y-[2px] leading-snug">
                        <div><span className="font-semibold text-[#1d2e4f]">Người đứng đơn: </span>{row.nguoiDungDon}</div>
                        <div><span className="font-semibold text-[#1d2e4f]">Địa chỉ: </span>{row.diaChi}</div>
                        <div><span className="font-semibold text-[#1d2e4f]">Hình thức: </span>{row.hinhThuc}</div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-3 py-3">
                      <div className="space-y-[2px] leading-snug">
                        <div><span className="font-semibold text-[#1d2e4f]">Số BA/QĐ: </span>{row.soBA}</div>
                        <div><span className="font-semibold text-[#1d2e4f]">Ngày: </span>{row.ngayBA}</div>
                        <div><span className="font-semibold text-[#1d2e4f]">Tòa xét xử: </span>{row.toaBA}</div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-3 py-3">
                      <span className="inline-block px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">{row.loaiAn}</span>
                    </td>
                    <td className="border-b border-[#eee] px-3 py-3 text-[#1a5a96]">{row.hinhThuc}</td>

                    {tab === 2 && (
                      <td className="border-b border-[#eee] px-3 py-3 text-[#555]">
                        {row.ngayPhanCong || <span className="text-[#999]">—</span>}
                      </td>
                    )}

                    {/* Thẩm phán */}
                    <td className="border-b border-[#eee] px-3 py-3">
                      {tab !== 2 ? (
                        cotLich ? (
                          <div className="relative">
                            <select value={rowJudge[row.id] ?? ""} disabled={khoa || hopLe.length === 0}
                              onChange={e => setRowJudge(p => ({ ...p, [row.id]: e.target.value }))}
                              className={`w-full h-[26px] px-2 pr-6 text-[11px] border rounded-[3px] appearance-none focus:outline-none
                                ${khoa || hopLe.length === 0 ? "border-[#e0e0e0] bg-[#fafafa] text-[#999]" : "border-[#ccc] bg-white focus:border-[#1a73e8]"}`}>
                              <option value="">-- Chọn thẩm phán --</option>
                              {hopLe.map(tp => <option key={tp.hoTen} value={tp.hoTen}>{nhanThamPhan(tp.hoTen)}</option>)}
                            </select>
                            <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                            {hopLe.length === 0 && (
                              <div className="text-[10px] text-[#b45309] mt-0.5 leading-snug">
                                {goiYThieuThamPhan(row)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#999]">{row.loi ?? "Chưa phân công"}</span>
                        )
                      ) : khoa ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-[#27ae60]">{row.thamPhan}</span>
                            <Ban size={11} className="text-[#b45309] flex-shrink-0" />
                          </div>
                          {row.toTrinh && (
                            <div className="text-[10px] text-[#b45309] leading-snug"
                              title="Đã lập tờ trình — phân công đã chốt, không sửa được ở đây.">
                              <b className="font-semibold">{row.toTrinh.replace(/^TTr-/, "Số tờ trình - ")}</b>
                            </div>
                          )}
                          {row.thongBao && (
                            <div className="text-[10px] text-[#b45309] leading-snug">
                              <b className="font-semibold">{row.thongBao.replace(/^TB-/, "Số thông báo - ")}</b>
                            </div>
                          )}
                        </div>
                      ) : editingRow === row.id && f ? (
                        <div className="space-y-2 min-w-[220px]">
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Thẩm phán mới</label>
                            <div className="relative">
                              <select value={f.thamPhan}
                                onChange={e => setEditForm(p => ({ ...p, [row.id]: { ...p[row.id], thamPhan: e.target.value } }))}
                                className="w-full h-[26px] px-2 pr-6 text-[11px] border border-[#1a73e8] rounded-[3px] bg-white appearance-none focus:outline-none">
                                <option value="">-- Chọn thẩm phán --</option>
                                {hopLe.map(tp => <option key={tp.hoTen} value={tp.hoTen}>{nhanThamPhan(tp.hoTen)}</option>)}
                              </select>
                              <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Ngày sửa</label>
                            <input type="date" value={f.ngaySua}
                              onChange={e => setEditForm(p => ({ ...p, [row.id]: { ...p[row.id], ngaySua: e.target.value } }))}
                              className="w-full h-[26px] px-2 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">
                              Lý do sửa phân công <span className="text-[#8b1a1a]">*</span>
                            </label>
                            <textarea value={f.lyDo} rows={2} maxLength={MAX_LY_DO} placeholder="Nhập lý do..."
                              onChange={e => setEditForm(p => ({ ...p, [row.id]: { ...p[row.id], lyDo: e.target.value } }))}
                              className={`w-full px-2 py-1 text-[11px] border rounded-[3px] focus:outline-none resize-none
                                ${f.lyDo.trim().length >= MIN_LY_DO_SUA ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
                            {f.lyDo.trim().length < MIN_LY_DO_SUA && (
                              <div className="text-[10px] text-[#8b1a1a] mt-0.5 leading-snug">
                                Nhập lý do để lưu (tối thiểu {MIN_LY_DO_SUA} ký tự).
                              </div>
                            )}
                          </div>
                          {laToiCao && (
                            <label className="flex items-center gap-1.5 text-[11px] text-[#555] cursor-pointer">
                              <input type="checkbox" checked={f.dacBiet} className="w-[13px] h-[13px] accent-[#8b1a1a]"
                                onChange={e => setEditForm(p => ({ ...p, [row.id]: { ...p[row.id], dacBiet: e.target.checked } }))} />
                              Có lý do đặc biệt
                            </label>
                          )}
                          <div className="flex items-center gap-1 pt-0.5">
                            <button
                              disabled={f.lyDo.trim().length < MIN_LY_DO_SUA}
                              title={f.lyDo.trim().length < MIN_LY_DO_SUA ? "Nhập lý do sửa phân công để lưu" : undefined}
                              onClick={() => saveEdit(row.id)}
                              className={`flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-white transition-colors
                                ${f.lyDo.trim().length < MIN_LY_DO_SUA ? "bg-[#b7d3c0] cursor-not-allowed" : "bg-[#27ae60] hover:bg-[#1e8449]"}`}>
                              <Check size={10} /> Lưu
                            </button>
                            <button onClick={() => setEditingRow(null)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#666] hover:bg-[#f0f0f0] transition-colors">
                              <X size={10} /> Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-[#27ae60]">{row.thamPhan}</span>
                            <button onClick={() => startEdit(row)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#1a5a96] hover:bg-[#e8f0fe] transition-colors whitespace-nowrap">
                              <Pencil size={10} /> Sửa
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {cotLich && (
                      <td className="border-b border-[#eee] px-3 py-3 text-[#555]">
                        {row.lyDoPhanCong
                          ? <span className="leading-snug">{row.lyDoPhanCong}</span>
                          : <span className="text-[#999]">—</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-end gap-1.5 pt-3 text-[12px] text-[#555]">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={trang === 1}
            className="h-[26px] w-[26px] flex items-center justify-center border border-[#d9d9d9] rounded-[3px] bg-white disabled:opacity-40">
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: pageCount }, (_, k) => k + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`h-[26px] min-w-[26px] px-1 border rounded-[3px] ${p === trang ? "bg-[#8b1a1a] text-white border-[#8b1a1a]" : "bg-white border-[#d9d9d9] hover:border-[#8b1a1a]"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={trang === pageCount}
            className="h-[26px] w-[26px] flex items-center justify-center border border-[#d9d9d9] rounded-[3px] bg-white disabled:opacity-40">
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Lý do phân công chỉ định — bắt buộc, vì chỉ định không qua bốc thăm. */}
      {showLyDo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50"
          onClick={() => { setShowLyDo(false); setLyDo(""); }}>
          <div className="bg-white rounded-[6px] w-[520px] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold">Lý do phân công chỉ định</div>
              <button onClick={() => { setShowLyDo(false); setLyDo(""); }} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="text-[12px] leading-relaxed mb-3.5">
                <span className="text-[#666]">Chỉ định cho: </span>
                <b className="text-[#333]">
                  {Array.from(new Set(selected.map(id => rowJudge[id] || commonJudge).filter(Boolean))).join(", ") || "—"}
                </b>
                <br />
                <span className="text-[#666]">Áp dụng cho: </span>
                <b className="text-[#333]">{selected.length} vụ án đã chọn</b>
              </div>

              <label className="block text-[11px] font-medium mb-1.5">
                Lý do phân công <span className="text-[#8b1a1a]">*</span>
              </label>
              <textarea value={lyDo} maxLength={MAX_LY_DO} onChange={e => setLyDo(e.target.value)} rows={4} autoFocus
                placeholder="Ví dụ: Thẩm phán đã thụ lý vụ án liên quan, bảo đảm tính liên tục trong giải quyết…"
                aria-describedby="loi-ly-do-chi-dinh"
                className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
                  ${lyDo.trim() ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
              <div className="flex items-center justify-between mt-1">
                {!lyDo.trim() ? (
                  <div id="loi-ly-do-chi-dinh" className="text-[11px] text-[#8b1a1a]">
                    Nhập lý do phân công để tiếp tục.
                  </div>
                ) : <span />}
                <span className="text-[11px] text-[#888]">
                  {lyDo.length}/{MAX_LY_DO}
                </span>
              </div>

              {laToiCao && (
                <label className="mt-2 flex items-center gap-2 text-[12px] text-[#333] cursor-pointer">
                  <input type="checkbox" checked={lyDoDacBiet} onChange={e => setLyDoDacBiet(e.target.checked)}
                    className="w-[13px] h-[13px] accent-[#8b1a1a]" />
                  Có lý do đặc biệt
                </label>
              )}

              <div className="mt-3.5 bg-[#fef3e2] border border-[#fcd48a] text-[#b45309] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>Phân công chỉ định không qua bốc thăm ngẫu nhiên — lý do sẽ được lưu vào hồ sơ vụ án.</div>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2">
              <button onClick={() => { setShowLyDo(false); setLyDo(""); }}
                className="h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Huỷ
              </button>
              <button
                disabled={!lyDo.trim() || selected.length === 0}
                title={selected.length === 0 ? "Chọn ít nhất một vụ án trong bảng" : undefined}
                onClick={() => setXacNhan({
                  tieuDe: "Xác nhận phân công chỉ định",
                  noiDung: `Phân công ${selected.length} đơn theo lý do đã nhập? Các đơn này sẽ được khóa, sửa tại tab Quản lý kết quả phân công.`,
                  chay: runChiDinh,
                })}
                className={`h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
                  ${!lyDo.trim() || selected.length === 0 ? "bg-[#d9c4c4] cursor-not-allowed" : "bg-[#8b1a1a] hover:bg-[#6e1414]"}`}>
                Xác nhận phân công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận chung */}
      {xacNhan && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50"
          onClick={() => setXacNhan(null)}>
          <div className="bg-white rounded-[6px] w-[440px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center gap-2">
              <ShieldCheck size={16} /> {xacNhan.tieuDe}
            </div>
            <div className="p-4 text-[12px] leading-relaxed text-[#333]">{xacNhan.noiDung}</div>
            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2">
              <button onClick={() => setXacNhan(null)}
                className="h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Huỷ
              </button>
              <button
                onClick={() => { const c = xacNhan.chay; setXacNhan(null); c(); }}
                className="h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white bg-[#8b1a1a] hover:bg-[#6e1414]">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách thẩm phán */}
      {showDsThamPhan && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDsThamPhan(false)}>
          <div className="bg-white rounded-[6px] w-[720px] max-h-[86vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center gap-2">
              <Users size={16} /> Danh sách thẩm phán
              <button onClick={() => setShowDsThamPhan(false)} className="ml-auto text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3 border-b border-[#eee]">
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">Đơn vị</label>
                <div className="relative">
                  <select value={tpDonVi} onChange={e => setTpDonVi(e.target.value)}
                    className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option value="">Tất cả đơn vị</option>
                    {donViOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">Loại án</label>
                <div className="relative">
                  <select value={tpLoaiAn} onChange={e => setTpLoaiAn(e.target.value)}
                    className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option value="">Tất cả loại án</option>
                    {loaiAnOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">Thẩm quyền</label>
                <div className="relative">
                  <select value={tpThamQuyen} onChange={e => setTpThamQuyen(e.target.value)}
                    className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option value="">Tất cả</option>
                    <option value="toicao">Thẩm phán Tối cao</option>
                    <option value="bac3">Thẩm phán bậc 3.2</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="border-b border-[#eee] px-2 py-3 text-center font-semibold text-[#1d2e4f] w-[50px]">STT</th>
                    <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f]">Họ và tên</th>
                    <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f]">Chức danh tư pháp</th>
                    <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f]">Đơn vị</th>
                    <th className="border-b border-[#eee] px-3 py-3 text-left font-semibold text-[#1d2e4f] w-[120px]">Số đơn đang giữ</th>
                  </tr>
                </thead>
                <tbody>
                  {dsThamPhanHienThi.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-[#999]">Không có thẩm phân phù hợp</td></tr>
                  ) : dsThamPhanHienThi.map((tp, i) => (
                    <tr key={tp.hoTen} className="bg-white hover:bg-[#fafafa]">
                      <td className="border-b border-[#eee] px-2 py-3 text-center text-[#666]">{i + 1}</td>
                      <td className="border-b border-[#eee] px-3 py-3 font-medium text-[#1d2e4f]">{tp.hoTen}</td>
                      <td className="border-b border-[#eee] px-3 py-3 text-[#555]">{tp.bac}</td>
                      <td className="border-b border-[#eee] px-3 py-3 text-[#555]">{tp.donVi ?? "—"}</td>
                      <td className="border-b border-[#eee] px-3 py-3 text-[#1a5a96] font-semibold">{doLuu[tp.hoTen] ?? 0} đơn</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end">
              <button onClick={() => setShowDsThamPhan(false)}
                className="h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhanCongThamPhanScreen;
