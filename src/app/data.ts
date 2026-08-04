export type TabId =
  | "tat-ca"
  | "cho-y-kien"
  | "chua-co-vu-an"
  | "ho-so-khang-nghi"
  | "da-co-vu-an"
  | "tra-lai";

export type VuAnAction =
  | "chuyen-vu-an"
  | "huy-ghep"
  | "them-vu-an"
  | "ghep-vu-an";

export type TrangThaiVuAn =
  | "chua-co-vu-an"
  | "da-co-vu-an"
  | "thong-bao-giai-quyet"
  | "chua-co-hs";

export interface LeaderOpinion {
  name: string;
  role: string;
  decision: "thuy-moi" | "khong-thu-ly";
  date: string;
}

export interface DonCase {
  id: number;
  type: "don" | "hskn";
  tabs: TabId[];

  // Thông tin đơn (type=don)
  maDon?: string;
  soCV?: string;
  ngayCV?: string;
  thuLyMoi?: string;
  daThuLy?: boolean;

  // Thông tin đơn (type=hskn)
  maVanThuDen?: string;
  ngayVanThuDen?: string;
  soHSKN?: string;
  ngayHSKN?: string;
  thuLyXetXu?: string;

  // Chung
  thamPhan: string;
  capThamPhan: string;
  hinhThuc: string;
  tags: string[]; // "an-dan-de" | "an-tu-hinh"

  // Đương sự
  nguoiKhieuNai?: string;
  biCao?: string;
  ndd?: string;
  nguoiKhangNghi?: string;

  // BA/QĐ
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;

  // Vụ án
  maVuAn?: string;
  tenVuAn?: string;
  ttv?: string;
  trangThai: TrangThaiVuAn;
  trangThai2?: TrangThaiVuAn;
  vuAnActions?: VuAnAction[];

  // Kết quả giải quyết trước đó
  thongBaoBoSung?: string;
  ttvGiaiQuyet?: string;
  tpGiaiQuyet?: string;

  // Ý kiến lãnh đạo
  yKienLD?: LeaderOpinion[];

  // Nhận/Trả
  ngayNhan?: string;
  nguoiThaoTac?: string;
  ngayThaoTac?: string;
  nguoiTra?: string;
  ngayTra?: string;
}

export const CASES: DonCase[] = [
  // ── Chờ ý kiến LĐ + Chưa có vụ án ─────────────────────────────────
  {
    id: 1,
    type: "don",
    tabs: ["tat-ca", "cho-y-kien", "chua-co-vu-an"],
    maDon: "4984",
    soCV: "31",
    ngayCV: "05/06/2026",
    thuLyMoi: "2329241",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de", "an-tu-hinh"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "Võ Hoài Trầm",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-002012",
    tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích hoặc gây hại cho sức khoẻ người khác",
    ttv: "Nguyễn Văn A",
    trangThai: "chua-co-vu-an",
    yKienLD: [
      { name: "Nguyễn Thị Bình", role: "Vụ trưởng", decision: "khong-thu-ly", date: "10/07/2026" },
      { name: "Nguyễn Văn Tiến", role: "Phó CA", decision: "khong-thu-ly", date: "10/07/2026" },
    ],
  },
  {
    id: 2,
    type: "don",
    tabs: ["tat-ca", "cho-y-kien", "chua-co-vu-an"],
    maDon: "4985",
    soCV: "31",
    ngayCV: "05/06/2026",
    thuLyMoi: "2329241",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn báo phát hiện vi phạm PL",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "Võ Hoài Trầm",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-002012",
    tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích",
    ttv: "Nguyễn Ngọc B",
    trangThai: "chua-co-vu-an",
    trangThai2: "thong-bao-giai-quyet",
    yKienLD: [
      { name: "Nguyễn Thị Bình", role: "Vụ trưởng", decision: "thuy-moi", date: "10/07/2026" },
      { name: "Nguyễn Văn Tiến", role: "Phó CA", decision: "khong-thu-ly", date: "10/07/2026" },
    ],
  },
  {
    id: 3,
    type: "don",
    tabs: ["tat-ca", "chua-co-vu-an"],
    maDon: "4984",
    soCV: "31",
    ngayCV: "05/06/2026",
    daThuLy: true,
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de", "an-tu-hinh"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "Võ Hoài Trầm",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    trangThai: "chua-co-vu-an",
  },
  {
    id: 4,
    type: "don",
    tabs: ["tat-ca", "chua-co-vu-an"],
    maDon: "4956",
    soCV: "18",
    ngayCV: "05/06/2026",
    thuLyMoi: "2329180",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPTC",
    hinhThuc: "Đơn khiếu nại tư pháp tố tụng",
    tags: [],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "DANH THỊ SÁ RON",
    soBA: "HKTT_0506_05",
    ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân khu vực 1 - Cần Thơ",
    capXetXu: "Sơ thẩm",
    trangThai: "chua-co-vu-an",
    vuAnActions: ["ghep-vu-an", "them-vu-an"],
  },
  {
    id: 5,
    type: "don",
    tabs: ["tat-ca", "chua-co-vu-an"],
    maDon: "4943",
    soCV: "12",
    ngayCV: "04/06/2026",
    thuLyMoi: "2329144",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: [],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "DANH THỊ SÁ RON",
    soBA: "99",
    ngayBA: "",
    toa: "Tòa án nhân dân tỉnh Bắc Ninh",
    capXetXu: "Sơ thẩm",
    trangThai: "chua-co-vu-an",
    vuAnActions: ["ghep-vu-an", "them-vu-an"],
  },

  // ── Đã có vụ án ──────────────────────────────────────────────────────
  {
    id: 6,
    type: "don",
    tabs: ["tat-ca", "da-co-vu-an"],
    maDon: "4984",
    soCV: "31",
    ngayCV: "05/06/2026",
    thuLyMoi: "2329241",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "NGUYỄN TRUNG HOÀ",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-000681",
    tenVuAn: "Vụ án Đỗ Bị can một - Tội cố ý gây thương tích",
    ttv: "Nguyễn Văn A",
    trangThai: "da-co-vu-an",
    vuAnActions: ["chuyen-vu-an", "huy-ghep"],
    ngayNhan: "10/6/2026",
  },
  {
    id: 7,
    type: "don",
    tabs: ["tat-ca", "da-co-vu-an"],
    maDon: "4984",
    soCV: "31",
    ngayCV: "05/06/2026",
    daThuLy: true,
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    ndd: "VKSNDTC",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-000681",
    tenVuAn: "Vụ án Đỗ Bị can một - Tội cố ý gây thương tích",
    trangThai: "da-co-vu-an",
    vuAnActions: ["chuyen-vu-an", "huy-ghep"],
    ngayNhan: "10/6/2026",
  },
  {
    id: 8,
    type: "don",
    tabs: ["tat-ca", "da-co-vu-an"],
    maDon: "4943",
    soCV: "12",
    ngayCV: "04/06/2026",
    thuLyMoi: "2329144",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPTC",
    hinhThuc: "Đơn khiếu nại tư pháp tố tụng",
    tags: ["an-dan-de"],
    biCao: "Vũ Hoa Hảo",
    ndd: "Phạm Hoàng Anh",
    soBA: "99",
    ngayBA: "02/06/2026",
    toa: "Tòa án nhân dân tỉnh Bắc Ninh",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-000681",
    tenVuAn: "Vụ án Đỗ Bị can một - Tội cố ý gây thương tích",
    trangThai: "da-co-vu-an",
    vuAnActions: ["chuyen-vu-an", "huy-ghep"],
    nguoiTra: "Trần Quốc Hảnh",
    ngayTra: "08/6/2026",
  },

  // ── Hồ sơ kháng nghị ─────────────────────────────────────────────────
  {
    id: 9,
    type: "hskn",
    tabs: ["tat-ca", "ho-so-khang-nghi", "da-co-vu-an"],
    maVanThuDen: "4943",
    ngayVanThuDen: "04/06/2026",
    soHSKN: "4984",
    ngayHSKN: "04/06/2026",
    thuLyXetXu: "2329241",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Hồ sơ kháng nghị",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    nguoiKhangNghi: "VKSNDTC",
    soBA: "HKTT_0506_05",
    ngayBA: "04/06/2026",
    toa: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-000681",
    tenVuAn: "Vụ án Đỗ Bị can một - Tội cố ý gây thương tích",
    trangThai: "da-co-vu-an",
    vuAnActions: ["huy-ghep"],
    nguoiThaoTac: "Nguyễn Hảo",
    ngayThaoTac: "10/6/2026",
  },
  {
    id: 10,
    type: "hskn",
    tabs: ["tat-ca", "ho-so-khang-nghi"],
    maVanThuDen: "4943",
    ngayVanThuDen: "04/06/2026",
    soHSKN: "4984",
    ngayHSKN: "04/06/2026",
    thuLyXetXu: "2329144",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    hinhThuc: "Hồ sơ kháng nghị",
    tags: [],
    nguoiKhieuNai: "Đỗ Tất Đạt",
    biCao: "Vũ Hoa Hảo",
    nguoiKhangNghi: "TANDTC",
    soBA: "99",
    ngayBA: "",
    toa: "Tòa án nhân dân tỉnh Bắc Ninh",
    capXetXu: "Sơ thẩm",
    trangThai: "chua-co-vu-an",
    vuAnActions: ["them-vu-an"],
    nguoiThaoTac: "Nguyễn Hảo",
    ngayThaoTac: "10/6/2026",
  },
  {
    id: 11,
    type: "hskn",
    tabs: ["tat-ca", "ho-so-khang-nghi"],
    maVanThuDen: "4943",
    ngayVanThuDen: "12 - 04/06/2026",
    hinhThuc: "Hồ sơ kháng nghị",
    tags: [],
    nguoiKhangNghi: "VKSNDTC",
    thamPhan: "Đỗ Tất Thống",
    capThamPhan: "TPB3",
    soBA: "",
    ngayBA: "",
    toa: "",
    capXetXu: "Sơ thẩm",
    trangThai: "chua-co-vu-an",
    vuAnActions: ["them-vu-an"],
    ngayNhan: "10/6/2026",
  },

  // ── Đơn thuộc vụ án đã có kết quả giải quyết trước đó ───────────────────────
  {
    id: 12,
    type: "don",
    tabs: ["tat-ca", "cho-y-kien"],
    maDon: "5012",
    soCV: "44",
    ngayCV: "10/06/2026",
    thuLyMoi: "2330012",
    thamPhan: "Lê Thị Hoa",
    capThamPhan: "TPB2",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Phạm Văn Tú",
    biCao: "Hoàng Thị Minh",
    ndd: "Nguyễn Quốc Bảo",
    soBA: "HKTT_1006_01",
    ngayBA: "08/06/2026",
    toa: "Tòa án nhân dân tỉnh Hà Nam",
    capXetXu: "Phúc thẩm",
    maVuAn: "VA26-003101",
    tenVuAn: "Vụ án HOÀNG THỊ MINH - Tội lạm dụng tín nhiệm chiếm đoạt tài sản",
    trangThai: "da-co-vu-an",
    thongBaoBoSung: "Thông báo trả lời đơn số 1",
    ttvGiaiQuyet: "Nguyễn Văn An",
    tpGiaiQuyet: "Đào Văn Nam",
    yKienLD: [
      { name: "Nguyễn Thị Bình", role: "Vụ trưởng", decision: "khong-thu-ly", date: "12/07/2026" },
    ],
    ngayNhan: "10/6/2026",
  },
  {
    id: 13,
    type: "don",
    tabs: ["tat-ca", "chua-co-vu-an"],
    maDon: "5013",
    soCV: "45",
    ngayCV: "11/06/2026",
    thuLyMoi: "2330013",
    thamPhan: "Trần Minh Hải",
    capThamPhan: "TPTC",
    hinhThuc: "Đơn khiếu nại tư pháp tố tụng",
    tags: [],
    nguoiKhieuNai: "Lê Văn Dũng",
    biCao: "Bùi Thị Thu",
    ndd: "Võ Thành Nhân",
    soBA: "HKTT_1106_02",
    ngayBA: "09/06/2026",
    toa: "Tòa án nhân dân tỉnh Đồng Nai",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-003102",
    tenVuAn: "Vụ án BÙI THỊ THU - Tội lừa đảo chiếm đoạt tài sản",
    trangThai: "chua-co-vu-an",
    thongBaoBoSung: "Thông báo trả lời đơn số 1",
    ttvGiaiQuyet: "Nguyễn Văn An",
    tpGiaiQuyet: "Đào Văn Nam",
    vuAnActions: ["ghep-vu-an", "them-vu-an"],
  },
  {
    id: 15,
    type: "don",
    tabs: ["tat-ca", "da-co-vu-an"],
    maDon: "5015",
    soCV: "46",
    ngayCV: "13/06/2026",
    thuLyMoi: "2330015",
    thamPhan: "Nguyễn Thị Lan",
    capThamPhan: "TPB3",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    tags: ["an-dan-de"],
    nguoiKhieuNai: "Trần Văn Khoa",
    biCao: "Lý Thị Hồng",
    ndd: "Đặng Hoàng Nam",
    soBA: "HKTT_1306_04",
    ngayBA: "11/06/2026",
    toa: "Tòa án nhân dân tỉnh Bình Dương",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-003104",
    tenVuAn: "Vụ án LÝ THỊ HỒNG - Tội tham ô tài sản",
    ttv: "Nguyễn Văn An",
    trangThai: "da-co-vu-an",
    thongBaoBoSung: "Thông báo trả lời đơn số 1",
    ttvGiaiQuyet: "Nguyễn Văn An",
    tpGiaiQuyet: "Đào Văn Nam",
    vuAnActions: ["chuyen-vu-an", "huy-ghep"],
    ngayNhan: "14/6/2026",
  },
  {
    id: 16,
    type: "don",
    tabs: ["tat-ca", "tra-lai"],
    maDon: "5016",
    soCV: "47",
    ngayCV: "14/06/2026",
    thuLyMoi: "2330016",
    thamPhan: "Cao Thị Mai",
    capThamPhan: "TPB2",
    hinhThuc: "Đơn báo phát hiện vi phạm PL",
    tags: [],
    nguoiKhieuNai: "Vũ Thanh Tùng",
    biCao: "Đỗ Hữu Bình",
    ndd: "Hoàng Mỹ Linh",
    soBA: "HKTT_1406_05",
    ngayBA: "12/06/2026",
    toa: "Tòa án nhân dân tỉnh Vĩnh Long",
    capXetXu: "Sơ thẩm",
    maVuAn: "VA26-003105",
    tenVuAn: "Vụ án ĐỖ HỮU BÌNH - Tội vi phạm quy định về điều khiển phương tiện",
    trangThai: "da-co-vu-an",
    thongBaoBoSung: "Thông báo trả lời đơn số 1",
    ttvGiaiQuyet: "Nguyễn Văn An",
    tpGiaiQuyet: "Đào Văn Nam",
    nguoiTra: "Trần Quốc Hảnh",
    ngayTra: "16/6/2026",
  },
];

export const TAB_CONFIG = [
  { id: "tat-ca",           label: "Tất cả",           count: "49"  },
  { id: "cho-y-kien",       label: "Chờ ý kiến LĐ",    count: "4"   },
  { id: "chua-co-vu-an",    label: "Chưa có vụ án",    count: "5"   },
  { id: "ho-so-khang-nghi", label: "Hồ sơ kháng nghị", count: "+3"  },
  { id: "da-co-vu-an",      label: "Đã có vụ án",      count: "+37" },
  { id: "tra-lai",          label: "Trả lại",           count: "2"   },
] as const;

export function getCasesByTab(tab: TabId): DonCase[] {
  return CASES.filter((c) => c.tabs.includes(tab));
}
