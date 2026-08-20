type DonTrangThai = "cho-phan-cong" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoTiepNhan: string;
  trangThai: DonTrangThai;
  nguon: DonNguon;
  coDonLienQuan: boolean;
  donLienQuan?: { maDon: string; quanHe: string }[];
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyß╗àn V─ân B├¼nh",
    hinhThucDon: "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng", loaiAn: "H├ánh ch├¡nh", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [
      { maDon: "001025", quanHe: "Tr├╣ng sß╗æ/ng├áy BA, Q─É" },
      { maDon: "000876", quanHe: "Tr├╣ng ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín" },
    ],
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trß║ºn Thß╗ï Lan",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "D├ón sß╗▒", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "L├¬ Minh Tuß║Ñn",
    hinhThucDon: "Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t", loaiAn: "H├¼nh sß╗▒", canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng",
    trangThai: "da-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "V┼⌐ Thu H├á",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "Lao ─æß╗Öng", canBoTiepNhan: "Nguyß╗àn Hß║úi Tr├óm",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "C├│ y├¬u cß║ºu bß╗ò sung tr╞░ß╗¢c ─æ├│" }],
  },
  {
    maDon: "001250", ngayTiepNhan: "16/08/2026 10:20", nguoiLamDon: "C├┤ng ty TNHH ABC",
    hinhThucDon: "CV kiß║┐n nghß╗ï G─ÉT-TT", loaiAn: "Kinh doanh th╞░╞íng mß║íi", canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Ho├áng V─ân Nam",
    hinhThucDon: "CV chuyß╗ân ─æ╞ín", loaiAn: "H├ánh ch├¡nh", canBoTiepNhan: "Nguyß╗àn Hß║úi Tr├óm",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "─Éß║╖ng B├¡ch Ngß╗ìc",
    hinhThucDon: "─É╞ín kh├íc", loaiAn: "D├ón sß╗▒", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "V├╡ Quang Huy",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "Kinh doanh th╞░╞íng mß║íi", canBoTiepNhan: "Trß║ºn V─ân Minh",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyß╗àn Thß╗ï Ph╞░╞íng",
    hinhThucDon: "CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT", loaiAn: "Lao ─æß╗Öng", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Li├¬n quan ─æß║┐n ─æ╞ín cß╗ºa c├┤ng ty TNHH ABC" }]
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "L├╜ ─Éß╗⌐c Trß╗ìng",
    hinhThucDon: "T├ái liß╗çu chß╗⌐ng cß╗⌐", loaiAn: "H├¼nh sß╗▒", canBoTiepNhan: "L├¬ Thß╗ï Hoa",
    trangThai: "da-phan-cong", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "T├ái liß╗çu bß╗ò sung cho vß╗Ñ L├¬ Minh Tuß║Ñn" }]
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; cls: string }> = {
  "cho-phan-cong": { label: "Chß╗¥ ph├ón c├┤ng", cls: "bg-[#fff4db] text-[#8b5e00] border-[#f5c842]" },
  "da-phan-cong":  { label: "─É├ú ph├ón c├┤ng",  cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#a9c9f4]" },
  "cho-xu-ly":     { label: "Chß╗¥ xß╗¡ l├╜",     cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#81c784]" },
  "tra-lai":       { label: "Trß║ú lß║íi",        cls: "bg-[#fdecea] text-[#8b1a1a] border-[#f5a3a3]" },
};

const NGUON_META_LT: Record<DonNguon, { label: string; cls: string }> = {
  VBDH: { label: "Hß╗ç thß╗æng v─ân bß║ún ─æiß╗üu h├ánh", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  DVTT: { label: "Cß╗òng dß╗ïch vß╗Ñ t╞░ ph├íp", cls: "bg-[#fce8e8] text-[#c92a2a] border-[#f8caca]" },
  DVC: { label: "Cß╗òng DVC Quß╗æc gia", cls: "bg-[#e6f4ea] text-[#1e8e3e] border-[#cce8d6]" },
  BuuDien: { label: "─É╞░ß╗¥ng b╞░u ─æiß╗çn", cls: "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]" },
  TrucTiep: { label: "Nß╗Öp trß╗▒c tiß║┐p", cls: "bg-[#f3e5f5] text-[#4a148c] border-[#e1bee7]" },
};

const CAN_BO_LIST_LT = ["Phß║ím Quß╗æc H╞░ng", "Nguyß╗àn Hß║úi Tr├óm", "Trß║ºn V─ân Minh", "L├¬ Thß╗ï Hoa"];

