import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Eye, CornerUpLeft, Send, ChevronUp, ChevronDown, Filter, FileText, UserPlus, Save, Edit } from "lucide-react";
import { Table, Tabs, Modal, Drawer, Select, Input, Button, Tag, Radio, Space, Tooltip, Row, Col, ConfigProvider, Checkbox, DatePicker, Form, Card, Divider, Popover } from "antd";
import type { ColumnsType } from "antd/es/table";

type DonNguon = "VBDH" | "DVTT" | "DVC" | "BuuDien" | "TrucTiep" | "ToaKhac";
type DonTrangThai = "cho-xu-ly" | "da-xu-ly" | "tra-lai" | "luu-kho";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoPhanLoai: string;
  donViTiepNhanGoiY?: string;
  trangThai: DonTrangThai;
  nguon: DonNguon;
  coDonLienQuan: boolean;
  donLienQuan?: { maDon: string; quanHe: string }[];
  dieuKienGoiY?: { hopLe: boolean; lyDo?: string };
  soBaqd?: string;
  ngayBaqd?: string;
  toaXetXu?: string;
  thongTinVuAn?: string;
  maVuAn?: string;
  tenVuAn?: string;
  tenBiDon?: string;
  thamPhan?: string;
  thuKy?: string;
  toaChuyenTrach?: string;
  noiDungQuanHePhapLuat?: string;
  ghiChu?: string;
  tenToaChuyenDen?: string;
  diaChi?: string;
  cccd?: string;
  canBoPhanCong?: string;
  nguoiXuLy?: string;
  ngayXuLy?: string;
  lyDoTraLai?: string;
  ngayTraLai?: string;
  nguoiTraLai?: string;
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyễn Văn Bình",
    diaChi: "Số 15, Ngõ 20, Đường Cầu Giấy, Hà Nội", cccd: "001089123456",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hành chính", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Tòa Hành chính",
    trangThai: "cho-xu-ly", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [
      { maDon: "001025", quanHe: "Trùng số/ngày BA, QĐ" },
      { maDon: "000876", quanHe: "Trùng người đứng đơn" },
    ],
    dieuKienGoiY: { hopLe: true },
    maVuAn: "15/2026/TLST-HC", tenVuAn: "Khiếu kiện quyết định hành chính",
    tenBiDon: "UBND Tỉnh X", noiDungQuanHePhapLuat: "Khiếu kiện quyết định thu hồi đất tại dự án ABC"
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trần Thị Lan",
    diaChi: "Khu phố 1, Phường Suối Hoa, TP Bắc Ninh",
    hinhThucDon: "Đơn đề nghị Giám đốc thẩm / Tái thẩm", loaiAn: "Dân sự", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Văn phòng",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: false, lyDo: "Thiếu BA/QĐ có hiệu lực" },
    soBaqd: "45/2025/DS-ST", ngayBaqd: "10/10/2025", toaXetXu: "TAND Tỉnh Bắc Ninh",
    noiDungQuanHePhapLuat: "Tranh chấp quyền sở hữu tài sản và yêu cầu bồi thường thiệt hại"
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "Lê Minh Tuấn",
    cccd: "034091000123",
    hinhThucDon: "Thông báo phát hiện vi phạm pháp luật", loaiAn: "Hình sự", canBoPhanLoai: "Phạm Quốc Hưng",
    donViTiepNhanGoiY: "Tòa Hình sự",
    trangThai: "cho-xu-ly", nguon: "VBDH", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Phát hiện vi phạm quy định về quản lý bảo vệ rừng"
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "Vũ Thu Hà",
    diaChi: "Quận 1, TP Hồ Chí Minh", cccd: "079198000456",
    hinhThucDon: "Đơn khởi kiện / yêu cầu dân sự", loaiAn: "Dân sự", canBoPhanLoai: "Nguyễn Hải Trâm",
    donViTiepNhanGoiY: "Tòa Dân sự",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "Đơn yêu cầu phản tố/độc lập" }],
    dieuKienGoiY: { hopLe: true },
    maVuAn: "12/2026/TLST-DS", tenVuAn: "Tranh chấp hợp đồng vay tài sản",
    tenBiDon: "Nguyễn Văn A", noiDungQuanHePhapLuat: "Yêu cầu hoàn trả tiền vay và lãi suất quá hạn"
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Hoàng Văn Nam",
    hinhThucDon: "Công văn chuyển đơn", loaiAn: "Hành chính", canBoPhanLoai: "Nguyễn Hải Trâm",
    donViTiepNhanGoiY: "Tòa Hành chính",
    trangThai: "tra-lai", nguon: "ToaKhac", tenToaChuyenDen: "TAND Cấp cao tại Hà Nội", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: false, lyDo: "Thiếu thông tin CCCD" },
    noiDungQuanHePhapLuat: "Khiếu kiện quyết định xử phạt vi phạm hành chính lĩnh vực giao thông",
    lyDoTraLai: "Không thuộc thẩm quyền giải quyết"
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "Đặng Bích Ngọc",
    cccd: "031195000789",
    hinhThucDon: "Đơn hôn nhân và gia đình", loaiAn: "Hôn nhân và gia đình", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Tòa Dân sự",
    trangThai: "cho-xu-ly", nguon: "VBDH", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Ly hôn, tranh chấp nuôi con và chia tài sản chung"
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "Võ Quang Huy",
    hinhThucDon: "Đơn đề nghị Giám đốc thẩm / Tái thẩm", loaiAn: "Kinh doanh thương mại", canBoPhanLoai: "Trần Văn Minh",
    donViTiepNhanGoiY: "Văn phòng",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    soBaqd: "15/2025/KDTM-ST", ngayBaqd: "12/05/2025", toaXetXu: "TAND Quận Cầu Giấy",
    noiDungQuanHePhapLuat: "Kháng nghị quyết định sơ thẩm vụ án tranh chấp hợp đồng cho thuê mặt bằng"
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyễn Thị Phương",
    hinhThucDon: "Công văn chuyển kiến nghị", loaiAn: "Lao động", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Văn phòng",
    trangThai: "cho-xu-ly", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Liên quan đến đơn của công ty TNHH ABC" }],
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Kiến nghị về việc công ty chậm trả lương và bảo hiểm xã hội"
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "Lý Đức Trọng",
    hinhThucDon: "Tài liệu, chứng cứ", loaiAn: "Hình sự", canBoPhanLoai: "Lê Thị Hoa",
    donViTiepNhanGoiY: "Tòa Hình sự",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "Tài liệu bổ sung cho vụ Lê Minh Tuấn" }],
    dieuKienGoiY: { hopLe: true },
    thongTinVuAn: "---",
    noiDungQuanHePhapLuat: "Bổ sung tài liệu chứng cứ về nhân thân người bị hại"
  },
  // --- 2 Mock Data cho các case Trả lại ---
  {
    maDon: "001270", ngayTiepNhan: "22/08/2026 09:15", nguoiLamDon: "Công ty Cổ phần ABC",
    hinhThucDon: "Công văn chuyển đơn", loaiAn: "Kinh doanh thương mại", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Tòa Kinh tế",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false,
    noiDungQuanHePhapLuat: "Tranh chấp hợp đồng mua bán hàng hóa",
    lyDoTraLai: "Văn bản đính kèm bị lỗi font, không đọc được nội dung. Đề nghị Văn thư gửi lại bản cứng.",
    ngayTraLai: "23/08/2026 10:30", nguoiTraLai: "Phạm Quốc Hưng"
  },
  {
    maDon: "001272", ngayTiepNhan: "22/08/2026 14:00", nguoiLamDon: "Lê Văn Tám",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hình sự", canBoPhanLoai: "Trần Văn Minh",
    donViTiepNhanGoiY: "Tòa Hình sự",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
    noiDungQuanHePhapLuat: "Khiếu nại hành vi của Điều tra viên trong quá trình lấy lời khai",
    lyDoTraLai: "Đơn khiếu nại này thuộc thẩm quyền giải quyết của Viện kiểm sát, đề nghị HCTP phân loại lại.",
    ngayTraLai: "24/08/2026 08:45", nguoiTraLai: "Trần Văn Minh"
  },
  {
    maDon: "001280", ngayTiepNhan: "23/08/2026 10:00", nguoiLamDon: "Trịnh Khắc Hưng",
    hinhThucDon: "Đơn khiếu nại", loaiAn: "Hình sự", canBoPhanLoai: "Chưa phân công",
    trangThai: "luu-kho", nguon: "VBDH", coDonLienQuan: false,
    noiDungQuanHePhapLuat: "Đơn khiếu nại không map được vụ án",
  }
];

const VU_AN_MOCK = [
  {
    maVuAn: "15/2026/TLST-HC", tenVuAn: "Khiếu kiện quyết định hành chính", toaXetXu: "TAND TP. Hà Nội", trangThai: "Đang giải quyết", loaiAn: "Hành chính", soThuLy: "15/2026", ngayThuLy: "10/01/2026", thamPhan: "Phạm Văn A", thuKy: "Lê Thị B", toaChuyenTrach: "Tòa Hành chính",
    duongSu: [
      { tuCach: "Người khởi kiện", hoTen: "Nguyễn Văn X", diaChi: "Ba Đình, Hà Nội" },
      { tuCach: "Người bị kiện", hoTen: "UBND Tỉnh Y", diaChi: "Tỉnh Y" }
    ]
  },
  {
    maVuAn: "12/2026/TLST-DS", tenVuAn: "Tranh chấp hợp đồng vay tài sản", toaXetXu: "TAND TP. Hà Nội", trangThai: "Đã xét xử", loaiAn: "Dân sự", soThuLy: "12/2026", ngayThuLy: "15/02/2026", thamPhan: "Trần Minh C", thuKy: "Nguyễn Thu D", toaChuyenTrach: "Tòa Dân sự",
    duongSu: [
      { tuCach: "Nguyên đơn", hoTen: "Trần Thị Lan", diaChi: "Cầu Giấy, Hà Nội" },
      { tuCach: "Bị đơn", hoTen: "Nguyễn Văn A", diaChi: "Đống Đa, Hà Nội" },
      { tuCach: "Người có quyền lợi, nghĩa vụ liên quan", hoTen: "Lê Minh Tuấn", diaChi: "Thanh Xuân, Hà Nội" }
    ],
    banAn: { so: "45/2026/DS-ST", ngay: "10/05/2026", toa: "TAND TP. Hà Nội" }
  },
  {
    maVuAn: "88/2025/TLST-HS", tenVuAn: "Vi phạm quy định về quản lý bảo vệ rừng", toaXetXu: "TAND TP. Hà Nội", trangThai: "Đang giải quyết", loaiAn: "Hình sự", soThuLy: "88/2025", ngayThuLy: "20/05/2025", thamPhan: "Hoàng Ngọc E", thuKy: "Vũ Hải F", toaChuyenTrach: "Tòa Hình sự",
    duongSu: [
      { tuCach: "Bị cáo", hoTen: "Hoàng Văn Nam", diaChi: "Sóc Sơn, Hà Nội" },
      { tuCach: "Bị hại", hoTen: "Hạt kiểm lâm Z", diaChi: "Sóc Sơn, Hà Nội" }
    ]
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; color: string }> = {
  "cho-xu-ly": { label: "Chờ xử lý", color: "orange" },
  "da-xu-ly": { label: "Đã xử lý", color: "green" },
  "tra-lai": { label: "Trả lại", color: "red" },
  "luu-kho": { label: "Kho nội bộ", color: "purple" }
};
// Add alias for da-xu-ly mapped to "Đã xử lý" for display since it's asked by the user, but we will use "cho-xu-ly" or "da-phan-cong" for internal state, let's just make sure "da-xu-ly" is handled if we expand types.
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  ...TRANG_THAI_META,
};

const NGUON_META_LT: Record<DonNguon, { label: string; color: string }> = {
  VBDH: { label: "Hệ thống văn bản điều hành", color: "blue" },
  DVTT: { label: "Cổng dịch vụ tư pháp", color: "volcano" },
  DVC: { label: "Cổng DVC Quốc gia", color: "green" },
  BuuDien: { label: "Đường bưu điện", color: "orange" },
  TrucTiep: { label: "Nộp trực tiếp", color: "purple" },
  ToaKhac: { label: "Từ Tòa án khác", color: "cyan" },
};

const CAN_BO_LIST_LT = ["Phạm Quốc Hưng", "Nguyễn Hải Trâm", "Trần Văn Minh", "Lê Thị Hoa"];
const MOCK_CAN_BO_LIST = [
  { id: 'CB01', ten: 'Phạm Quốc Hưng', chucVu: 'Cán bộ xử lý', soDonDangXuLy: 12, trangThai: 'Đang làm việc' },
  { id: 'CB02', ten: 'Nguyễn Hải Trâm', chucVu: 'Cán bộ xử lý', soDonDangXuLy: 8, trangThai: 'Đang làm việc' },
  { id: 'CB03', ten: 'Trần Văn Minh', chucVu: 'Cán bộ xử lý', soDonDangXuLy: 15, trangThai: 'Nghỉ phép' },
  { id: 'CB04', ten: 'Lê Thị Hoa', chucVu: 'Cán bộ phân loại', soDonDangXuLy: 5, trangThai: 'Đang làm việc' },
];
const LOAI_AN_OPTIONS = ["Dân sự", "Hình sự", "Hành chính", "Lao động", "Kinh doanh thương mại", "Hôn nhân và gia đình", "Phá sản", "Sở hữu trí tuệ", "Xử lý hành chính"];
const HINH_THUC_OPTIONS = [
  "Đơn đề nghị GĐT/TT", "Công văn kiến nghị GĐT/TT", "Hồ sơ Kháng nghị GĐT/TT",
  "Thông báo phát hiện vi phạm pháp luật", "Đơn khiếu nại tố cáo trong tố tụng", "Công văn chuyển đơn",
  "Công văn chuyển kiến nghị", "Tài liệu, chứng cứ", "Đơn khác", "Đơn khởi kiện/yêu cầu dân sự",
  "Đơn hôn nhân và gia đình", "Đơn kinh doanh thương mại", "Đơn lao động", "Đơn khởi kiện hành chính",
  "Đơn sở hữu trí tuệ", "Đơn yêu cầu mở thủ tục phá sản", "Đơn phục hồi", "Đơn áp dụng biện pháp xử lý hành chính",
  "Đơn phản tố", "Đơn độc lập"
];
const DON_VI_OPTIONS = [
  "Văn phòng", "Tòa Hình sự", "Tòa Dân sự", "Tòa Hành chính", "Tòa Kinh tế", "Tòa Lao động", "Tòa Gia đình & Người chưa thành niên"
];

const PanelLienThong = ({ onChiTiet, onPhanLoaiGDT, currentRole = "can-bo" }: { onChiTiet?: (don: DonTiepNhan) => void, onPhanLoaiGDT?: (d: any) => void, currentRole?: string }) => {
  const isChanhVP = currentRole === "pho-vp";
  const isTruongPhong = currentRole === "truong-phong" || isChanhVP;
  const isCanBoPhanLoai = currentRole === "can-bo-phan-loai" || isChanhVP;
  type TabKey = "tat-ca" | DonTrangThai;

  const [activeTab, setActiveTab] = useState<string>("tat-ca");
  const [rows, setRows] = useState(DON_SAMPLE);
  const [showDanhSachCanBo, setShowDanhSachCanBo] = useState(false);
  const [selectedCanBoPopup, setSelectedCanBoPopup] = useState(CAN_BO_LIST_LT[0]);

  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Advanced filter state
  const [fNguon, setFNguon] = useState("");
  const [fNgayTu, setFNgayTu] = useState("");
  const [fNgayDen, setFNgayDen] = useState("");
  const [fNguoiDon, setFNguoiDon] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fCanBo, setFCanBo] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");
  const [fDieuKien, setFDieuKien] = useState("tat-ca");

  // Popup state
  const [chiTietPopup, setChiTietPopup] = useState<DonTiepNhan | null>(null);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [donLienQuanPopup, setDonLienQuanPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiPopup, setTraLaiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiLyDo, setTraLaiLyDo] = useState("");
  const [traLaiGhiChu, setTraLaiGhiChu] = useState("");
  const [phanCongBatchPopup, setPhanCongBatchPopup] = useState(false);
  const [batchAssignCanBo, setBatchAssignCanBo] = useState<string>("");
  const [bulkCanBo, setBulkCanBo] = useState<string | null>(null);
  const [ketQuaPopup, setKetQuaPopup] = useState<DonTiepNhan | null>(null);

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [is3Cap, setIs3Cap] = useState(false);
  const [searchVuAnResult, setSearchVuAnResult] = useState<any[] | null>(null);
  const [searchForm] = Form.useForm();

  const openSearchModal = () => {
    setSearchModalVisible(true);
    setSearchVuAnResult(null);
    setIs3Cap(false);
    searchForm.setFieldsValue({ tenDuongSu: chiTietPopup?.nguoiLamDon });
  };

  const counts = useMemo(() => ({
    "tat-ca": DON_SAMPLE.length,
    "cho-xu-ly": DON_SAMPLE.filter(d => d.trangThai === "cho-xu-ly").length,
    "da-xu-ly": DON_SAMPLE.filter(d => d.trangThai === "da-xu-ly").length,
    "tra-lai": DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
    "luu-kho": DON_SAMPLE.filter(d => d.trangThai === "luu-kho").length,
  }), []);

  const tabItems = [
    { key: "tat-ca", label: `Tất cả` },
    { key: "cho-xu-ly", label: `Chờ xử lý (${counts["cho-xu-ly"]})` },
    { key: "da-xu-ly", label: `Đã xử lý` },
    { key: "tra-lai", label: `Trả lại (${counts["tra-lai"]})` },
    { key: "luu-kho", label: `Kho nội bộ (${counts["luu-kho"]})` },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      if (activeTab !== "tat-ca" && d.trangThai !== activeTab) return false;
      if (fNguon && d.nguon !== fNguon) return false;
      if (fHinhThuc && d.hinhThucDon !== fHinhThuc) return false;
      if (fLoaiAn && d.loaiAn !== fLoaiAn) return false;
      if (fCanBo && d.canBoPhanLoai !== fCanBo) return false;
      if (fTrangThai && d.trangThai !== fTrangThai) return false;
      if (fNguoiDon && !d.nguoiLamDon.toLowerCase().includes(fNguoiDon.toLowerCase())) return false;
      if (fDieuKien === "du" && (!d.dieuKienGoiY || !d.dieuKienGoiY.hopLe)) return false;
      if (fDieuKien === "chua-du" && d.dieuKienGoiY?.hopLe !== false) return false;
      if (q && ![d.maDon, d.nguoiLamDon, d.canBoPhanLoai].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, activeTab, search, fNguon, fHinhThuc, fLoaiAn, fCanBo, fTrangThai, fNguoiDon, fDieuKien]);

  const resetAdvanced = () => {
    setFNguon(""); setFNgayTu(""); setFNgayDen(""); setFNguoiDon("");
    setFHinhThuc(""); setFLoaiAn(""); setFCanBo(""); setFTrangThai("");
  };

  const handleUpdateRow = (maDon: string, field: keyof DonTiepNhan, val: string) => {
    setRows(prev => prev.map(r => r.maDon === maDon ? { ...r, [field]: val } : r));
    if (chiTietPopup?.maDon === maDon) {
      setChiTietPopup(prev => prev ? { ...prev, [field]: val } : null);
    }
  };

  const handleMapVuAn = (vuAn: typeof VU_AN_MOCK[0]) => {
    if (!chiTietPopup) return;
    setRows(prev => prev.map(r => r.maDon === chiTietPopup.maDon ? {
      ...r,
      maVuAn: vuAn.maVuAn,
      tenVuAn: vuAn.tenVuAn,
      toaXetXu: vuAn.toaXetXu,
      loaiAn: vuAn.loaiAn,
      thamPhan: vuAn.thamPhan,
      thuKy: vuAn.thuKy,
      toaChuyenTrach: vuAn.toaChuyenTrach,
      thongTinVuAn: `Vụ án số ${vuAn.maVuAn}`
    } : r));
    setChiTietPopup(prev => prev ? {
      ...prev,
      maVuAn: vuAn.maVuAn,
      tenVuAn: vuAn.tenVuAn,
      toaXetXu: vuAn.toaXetXu,
      loaiAn: vuAn.loaiAn,
      thamPhan: vuAn.thamPhan,
      thuKy: vuAn.thuKy,
      toaChuyenTrach: vuAn.toaChuyenTrach,
      thongTinVuAn: `Vụ án số ${vuAn.maVuAn}`
    } : null);
    alert(`Đã map thành công Vụ án ${vuAn.maVuAn} vào đơn!`);
    setSearchModalVisible(false);
  };

  const columns: ColumnsType<DonTiepNhan> = [
    {
      title: 'Thông tin đơn',
      key: 'thongTinDon',
      width: 200,
      render: (_, record) => {
        const nm = NGUON_META_LT[record.nguon];
        return (
          <div className="space-y-1.5">
            <div>
              <span className="font-semibold text-blue-600">{record.maDon}</span>
            </div>
            <div>
              <Tag color={nm.color}>{nm.label}</Tag>
              {record.nguon === 'ToaKhac' && record.tenToaChuyenDen && (
                <div className="text-[11px] text-gray-500 mt-0.5">{record.tenToaChuyenDen}</div>
              )}
            </div>
            <div className="text-[11px] text-gray-500">{record.ngayTiepNhan}</div>
          </div>
        );
      }
    },
    {
      title: 'Người làm đơn',
      key: 'nguoiLamDon',
      render: (_, record) => (
        <div className="space-y-0.5">
          <div className="font-semibold">{record.nguoiLamDon}</div>
          {record.cccd && <div className="text-[11px] text-gray-500">CCCD: {record.cccd}</div>}
          {record.diaChi && <Tooltip title={record.diaChi}><div className="text-[11px] text-gray-500 truncate max-w-[200px]">{record.diaChi}</div></Tooltip>}
        </div>
      )
    },
    {
      title: 'Nội dung đơn',
      key: 'noiDungDon',
      render: (_, record) => (
        <div className="text-[12px] text-on-surface-variant italic">
          {record.noiDungQuanHePhapLuat || "---"}
        </div>
      )
    },
    {
      title: 'Phân loại',
      key: 'phanLoai',
      width: 260,
      render: (_, record) => (
        <div className="space-y-2">
          <div>
            <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Hình thức đơn</div>
            <Tooltip title={record.hinhThucDon}>
              <div className="truncate max-w-[240px] font-medium">{record.hinhThucDon}</div>
            </Tooltip>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Loại án</div>
            <div className="font-medium text-blue-800">{record.loaiAn}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Thông tin vụ án',
      key: 'thongTin',
      width: 200,
      render: (_, record) => {
        if (record.soBaqd) {
          return (
            <div className="space-y-1">
              <div className="text-[11px] text-gray-600 truncate">
                <span className="text-[10px] text-gray-500 font-semibold mr-1">Số BA/QĐ:</span>
                <span className="font-semibold text-blue-700">{record.soBaqd}</span>
              </div>
              <div className="text-[11px] text-gray-600 truncate">
                <span className="text-[10px] text-gray-500 font-semibold mr-1">Ngày BA/QĐ:</span> {record.ngayBaqd || '---'}
              </div>
              <Tooltip title={record.toaXetXu}>
                <div className="text-[11px] text-gray-600 truncate">
                  <span className="text-[10px] text-gray-500 font-semibold mr-1">Tòa ra BA/QĐ:</span> {record.toaXetXu || '---'}
                </div>
              </Tooltip>
            </div>
          );
        }
        if (record.maVuAn) {
          return (
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 font-semibold">Vụ án:</div>
              <Tooltip title={record.tenVuAn}>
                <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                  <span className="font-semibold text-blue-700">{record.maVuAn}</span> - {record.tenVuAn || '---'}
                </div>
              </Tooltip>
              {record.thamPhan && (
                <div className="text-[10px] text-gray-500 mt-1">
                  Thẩm phán: <span className="font-medium text-gray-700">{record.thamPhan}</span>
                </div>
              )}
              {record.thuKy && (
                <div className="text-[10px] text-gray-500">
                  Thư ký: <span className="font-medium text-gray-700">{record.thuKy}</span>
                </div>
              )}
              {record.toaChuyenTrach && (
                <div className="text-[10px] text-gray-500">
                  Tòa CT: <span className="font-medium text-gray-700">{record.toaChuyenTrach}</span>
                </div>
              )}
            </div>
          );
        }
        return <span className="text-gray-400 italic block">{record.thongTinVuAn || '---'}</span>;
      }
    },
    {
      title: 'Trạng thái & Phân công (gợi ý)',
      key: 'trangThaiPhanCong',
      width: 250,
      render: (_, record) => {
        const sm = STATUS_DISPLAY[record.trangThai] || { label: "Chờ xử lý", color: "gold" };
        let tag = (
          <div>
            <Tag color={sm.color}>{sm.label}</Tag>
            {record.trangThai === "tra-lai" && (
              <div className="text-[11px] text-red-500 mt-1 italic">
                Lý do trả lại: {record.lyDoTraLai || 'Không có lý do'}<br />
                Ngày trả: {record.ngayTraLai || '---'}<br />
                Người trả: {record.nguoiTraLai || '---'}
              </div>
            )}
            {record.trangThai === "cho-xu-ly" && record.lyDoTraLai && (
              <div className="text-[11px] text-red-500 mt-1 italic">
                Bị trả lại: {record.lyDoTraLai}<br />
                Ngày trả: {record.ngayTraLai || '---'}<br />
                Người trả: {record.nguoiTraLai || '---'}
              </div>
            )}
          </div>
        );

        return (
          <div className="space-y-2">
            <div>
              {tag}
              {record.trangThai === 'da-xu-ly' && record.nguoiXuLy && (
                <div className="text-[10px] text-gray-500 mt-1">
                  Người xử lý: <span className="font-medium text-gray-700">{record.nguoiXuLy}</span><br />
                  Ngày phân công: {record.ngayXuLy || '---'}
                </div>
              )}
            </div>
            {record.trangThai !== 'da-xu-ly' && (
              <div>
                <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Phân công cán bộ xử lý</div>
                <Tooltip title={record.canBoPhanCong || "Chưa phân công"}><div className="truncate max-w-[180px] font-medium">{record.canBoPhanCong || "Chưa phân công"}</div></Tooltip>
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center gap-0.5">
          <Tooltip title="Chi tiết">
            <Button size="small" type="text" className="px-1" icon={<Edit size={16} />} onClick={(e) => { e.stopPropagation(); setChiTietPopup(record); }} />
          </Tooltip>
          {isCanBoPhanLoai && (
            <>
              <Tooltip title="Lưu phân công">
                <Button size="small" type="text" className="px-1 text-blue-600" icon={<Save size={16} />} onClick={(e) => {
                  e.stopPropagation();
                  if (!record.canBoPhanCong || record.canBoPhanCong === "Chưa phân công") {
                    alert("Vui lòng chọn cán bộ để phân công!");
                    return;
                  }
                  handleUpdateRow(record.maDon, 'trangThai', 'da-xu-ly' as any);
                  handleUpdateRow(record.maDon, 'nguoiXuLy', record.canBoPhanCong);
                  handleUpdateRow(record.maDon, 'ngayXuLy', new Date().toLocaleDateString("vi-VN"));
                  alert(`Đã phân công đơn ${record.maDon} cho ${record.canBoPhanCong}.`);
                }} />
              </Tooltip>
              <Tooltip title="Chuyển đơn">
                <Button size="small" type="text" className="px-1 text-green-600" icon={<Send size={16} />} onClick={(e) => {
                  e.stopPropagation();
                  alert(`Đã chuyển đơn ${record.maDon} sang giai đoạn tiếp theo.`);
                }} />
              </Tooltip>
            </>
          )}
          {record.trangThai === 'luu-kho' && (
            <Tooltip title="Xử lý đơn (Kho nội bộ)">
              <Button size="small" type="text" className="px-1 text-purple-600" icon={<Edit size={16} />} onClick={(e) => { e.stopPropagation(); setKetQuaPopup(record); }} />
            </Tooltip>
          )}
          {(!isCanBoPhanLoai || isChanhVP) && record.trangThai !== "tra-lai" && record.trangThai !== "luu-kho" && (record.nguon === "ToaKhac" || record.nguon === "VBDH") && (
            <Tooltip title="Trả lại">
              <Button size="small" type="text" danger className="px-1" icon={<CornerUpLeft size={16} />} onClick={(e) => { e.stopPropagation(); setTraLaiPopup(record); }} />
            </Tooltip>
          )}
        </div>
      )
    }
  ];

  const handleChuyenDon = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
    const selectedRows = rows.filter(r => selectedRowKeys.includes(r.maDon));
    const missingCB = selectedRows.filter(r => !r.canBoPhanCong);
    if (missingCB.length > 0) {
      alert("Một số đơn chưa chọn cán bộ phân công, vui lòng kiểm tra lại.");
      return;
    }

    setRows(prev => prev.map(r => selectedRowKeys.includes(r.maDon) ? {
      ...r,
      trangThai: 'da-xu-ly' as DonTrangThai,
      nguoiXuLy: r.canBoPhanCong,
      ngayXuLy: new Date().toLocaleDateString("vi-VN")
    } : r));

    setSelectedRowKeys([]);
    alert("Đã phân công cán bộ cho các đơn đã chọn.");
  };

  const checkAssignable = (hinhThuc: string) => {
    const lower = hinhThuc.toLowerCase();
    // Các loại bắt buộc phải đi ghép vụ án (không được phân công thẳng)
    const unassignable = ["phản tố", "độc lập", "tài liệu, chứng cứ", "đơn khác"];
    return !unassignable.some(kw => lower.includes(kw));
  };

  const handlePhanCongNgauNhien = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }

    let assignCount = 0;
    setRows(prev => prev.map(r => {
      if (selectedRowKeys.includes(r.maDon)) {
        if (!checkAssignable(r.hinhThucDon)) return r;
        const randomCanBo = CAN_BO_LIST_LT[Math.floor(Math.random() * CAN_BO_LIST_LT.length)];
        assignCount++;
        return { ...r, canBoPhanCong: randomCanBo };
      }
      return r;
    }));

    if (assignCount < selectedRowKeys.length) {
      alert(`Đã phân công ngẫu nhiên ${assignCount} đơn.\nBỏ qua các loại đơn bắt buộc phải ghép vụ án (như Phản tố, Độc lập, Tài liệu/Chứng cứ, Đơn khác...).`);
    } else {
      alert("Đã phân công ngẫu nhiên các đơn đã chọn.");
    }
  };

  const handlePhanCongChiDinh = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
    if (!bulkCanBo) { alert("Vui lòng chọn cán bộ từ danh sách"); return; }

    let assignCount = 0;
    setRows(prev => prev.map(r => {
      if (selectedRowKeys.includes(r.maDon)) {
        if (!checkAssignable(r.hinhThucDon)) return r;
        assignCount++;
        return { ...r, canBoPhanCong: bulkCanBo };
      }
      return r;
    }));
    setSelectedRowKeys([]);

    if (assignCount < selectedRowKeys.length) {
      alert(`Đã phân công chỉ định ${assignCount} đơn.\nBỏ qua các loại đơn bắt buộc phải ghép vụ án (như Phản tố, Độc lập, Tài liệu/Chứng cứ, Đơn khác...).`);
    } else {
      alert(`Đã phân công chỉ định các đơn đã chọn cho ${bulkCanBo}.`);
    }
  };


  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#8b1a1a' } }}>
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div>
            <div className="text-xs text-gray-500 mb-1">Quản lý đơn / <span className="font-medium">Tiếp nhận & phân công đơn</span></div>
            <div className="text-base font-bold text-gray-800">Tiếp nhận & phân công đơn</div>
          </div>
          <Space>
            {isTruongPhong && <Button onClick={() => setShowDanhSachCanBo(true)}>Danh sách cán bộ</Button>}
            <Button icon={<RefreshCw size={14} />}>Làm mới</Button>
          </Space>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-2 border-b border-gray-200 shrink-0 bg-white">
          <Tabs activeKey={activeTab} onChange={(k) => { setActiveTab(k); setSelectedRowKeys([]); }} items={tabItems} />
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto relative flex flex-col" id="t-container-tinh">
          {/* Search & Filter */}
          <div className="px-4 shrink-0 bg-white z-10">
            <div className="p-2 flex flex-col gap-4">

              {/* Top row: Radios */}
              <div className="flex items-center gap-4 flex-wrap">
                <Radio.Group value={fNguon} onChange={e => setFNguon(e.target.value)}>
                  <Radio value=''>Tất cả</Radio>
                  <Radio value="VBDH">Văn bản điều hành</Radio>
                  <Radio value="DVTT">Cổng dịch vụ tư pháp</Radio>
                  <Radio value="DVC">Cổng DVC Quốc gia</Radio>
                  <Radio value="ToaKhac">Từ Tòa án khác</Radio>
                </Radio.Group>
              </div>

              {/* Grid row: Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">

                {/* Search Keyword - Wide */}
                <div className="md:col-span-2">
                  <div className="text-[13px] font-medium text-gray-700 mb-1.5">Từ khóa tìm kiếm</div>
                  <Input
                    prefix={<Search size={16} className="text-gray-400" />}
                    placeholder="Tìm theo số đến, mã đơn, người làm đơn..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="h-[38px] text-[14px]"
                  />
                </div>

                {showAdvanced && (
                  <>
                    <div className="col-span-1">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Người đứng đơn</div>
                      <Input className="w-full h-[38px] text-[14px]" value={fNguoiDon} onChange={e => setFNguoiDon(e.target.value)} placeholder="Nhập tên..." />
                    </div>
                    <div className="col-span-1">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Loại án</div>
                      <Select className="w-full h-[38px]" value={fLoaiAn} onChange={setFLoaiAn} options={[{ value: '', label: 'Tất cả' }, ...LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))]} />
                    </div>
                    <div className="col-span-1">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Hình thức đơn</div>
                      <Select className="w-full h-[38px]" value={fHinhThuc} onChange={setFHinhThuc} options={[{ value: '', label: 'Tất cả' }, ...HINH_THUC_OPTIONS.map(o => ({ value: o, label: o }))]} />
                    </div>
                    <div className="col-span-1">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Trạng thái</div>
                      <Select className="w-full h-[38px]" value={fTrangThai} onChange={setFTrangThai} options={[{ value: '', label: 'Tất cả' }, { value: 'cho-xu-ly', label: 'Chờ xử lý' }, { value: 'da-xu-ly', label: 'Đã xử lý' }, { value: 'tra-lai', label: 'Trả lại' }]} />
                    </div>
                    <div className="col-span-1">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Cán bộ xử lý</div>
                      <Select className="w-full h-[38px]" value={fCanBo} onChange={setFCanBo} options={[{ value: '', label: 'Tất cả' }, ...CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))]} />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Thời gian tiếp nhận</div>
                      <DatePicker.RangePicker
                        className="w-full h-[38px]"
                        format="DD/MM/YYYY"
                        onChange={(dates, dateStrings) => {
                          if (dateStrings) {
                            setFNgayTu(dateStrings[0]);
                            setFNgayDen(dateStrings[1]);
                          }
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Actions - Align Right */}
                <div className={`flex items-center justify-end gap-3 col-span-1 md:col-span-2 ${showAdvanced ? 'xl:col-span-5' : 'xl:col-span-3'}`}>
                  <Button type="link" className="text-gray-500 hover:text-gray-700 font-medium px-0" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <span className="flex items-center gap-1">
                      {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {showAdvanced ? "Thu gọn" : "Nâng cao"}
                    </span>
                  </Button>
                  <Button type="primary" className="h-[38px] font-medium px-6" icon={<Search size={14} />}>Tìm kiếm</Button>
                  <Button className="h-[38px] font-medium px-5" onClick={() => { setSearch(""); resetAdvanced(); }}>Xóa bộ lọc</Button>

                </div>

              </div>
            </div>
          </div>

          {isCanBoPhanLoai && (activeTab === "tat-ca" || activeTab === "cho-xu-ly") && (
            <div className="p-3 border-b border-gray-200 flex justify-end gap-3 items-center shrink-0 bg-white z-10">
              {selectedRowKeys.length > 0 && (
                <span className="text-sm text-gray-600 mr-2">Đã chọn <b>{selectedRowKeys.length}</b> đơn</span>
              )}
              <Button onClick={handlePhanCongNgauNhien}>Phân công tự động</Button>
              <div className="flex items-center gap-2 ml-2 border-l pl-4 border-gray-300">
                <Select
                  placeholder="-- Chọn cán bộ --"
                  value={bulkCanBo || undefined}
                  onChange={setBulkCanBo}
                  options={CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))}
                  style={{ width: 180 }}
                  allowClear
                />
                <Button type="primary" onClick={handlePhanCongChiDinh}>Phân công chỉ định</Button>
              </div>
              {isCanBoPhanLoai && (
                <Button type="primary" icon={<Send size={16} />} onClick={handleChuyenDon} className="ml-2">Chuyển đơn</Button>
              )}
            </div>
          )}

          {/* Main Table */}
          <div className="flex-1 bg-white p-2 min-h-0 relative">
            <Table
              sticky={{ offsetHeader: 0, getContainer: () => document.getElementById('t-container-tinh') as HTMLElement }}
              columns={columns}
              dataSource={filtered}
              rowKey="maDon"
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys
              }}
              onRow={(record) => ({
                onDoubleClick: () => setChiTietPopup(record)
              })}
              pagination={{
                showSizeChanger: true,
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} đơn`,
                defaultPageSize: 10
              }}
              size="middle"
            />
          </div>
        </div>

        {/* Drawer Chi Tiết */}
        <Drawer
          title={<div className="font-bold text-lg flex items-center gap-4"><span>Chi tiết đơn: {chiTietPopup?.nguoiLamDon}</span></div>}
          placement="right"
          width={1100}
          onClose={() => setChiTietPopup(null)}
          open={!!chiTietPopup}
          extra={
            <Space>
              {chiTietPopup?.trangThai === 'luu-kho' ? (
                <>
                  <Button type="primary" icon={<Edit size={14} />} onClick={() => { setKetQuaPopup(chiTietPopup); setChiTietPopup(null); }}>Xử lý đơn</Button>
                  <Button danger icon={<CornerUpLeft size={14} />} onClick={() => {
                    handleUpdateRow(chiTietPopup.maDon, 'trangThai', 'cho-xu-ly');
                    alert("Đã trả đơn về màn tiếp nhận để xử lý lại.");
                    setChiTietPopup(null);
                  }}>Trả lại tiếp nhận đơn</Button>
                </>
              ) : (
                <>
                  <Button type="primary" icon={<Search size={14} />} onClick={openSearchModal}>Tìm kiếm hồ sơ</Button>
                  {chiTietPopup?.nguon === "VBDH" && chiTietPopup?.trangThai !== "tra-lai" && (
                    <Button danger icon={<CornerUpLeft size={14} />} onClick={() => { setTraLaiPopup(chiTietPopup); setChiTietPopup(null); }}>Trả lại</Button>
                  )}

                  {isCanBoPhanLoai && (
                    <>
                      <Button onClick={() => {
                        alert("Đã lưu thông tin đơn!");
                        setChiTietPopup(null);
                      }}>Lưu</Button>
                      <Button type="primary" icon={<Send size={14} />} onClick={() => {
                        if (!chiTietPopup?.canBoPhanCong) {
                          alert("Vui lòng chọn cán bộ phân công!");
                          return;
                        }
                        handleUpdateRow(chiTietPopup.maDon, 'trangThai', 'da-xu-ly' as any);
                        handleUpdateRow(chiTietPopup.maDon, 'nguoiXuLy', chiTietPopup.canBoPhanCong);
                        handleUpdateRow(chiTietPopup.maDon, 'ngayXuLy', new Date().toLocaleDateString("vi-VN"));
                        alert(`Đã phân công đơn ${chiTietPopup?.maDon} cho ${chiTietPopup?.canBoPhanCong}.`);
                        setChiTietPopup(null);
                      }}>Lưu & Phân công</Button>
                    </>
                  )}
                </>
              )}
            </Space>
          }
        >
          {chiTietPopup && (
            <div className="flex flex-col h-full bg-gray-50 -m-6">
              <div className="p-4 bg-white border-b border-gray-200">
                <Row gutter={[24, 16]}>
                  <Col span={4}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Người làm đơn</div>
                    <div className="font-semibold">{chiTietPopup.nguoiLamDon}</div>
                  </Col>
                  <Col span={9}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Hình thức đơn</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.hinhThucDon} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'hinhThucDon', val)} options={HINH_THUC_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" popupMatchSelectWidth={false} />
                    ) : <div className="font-semibold">{chiTietPopup.hinhThucDon}</div>}
                  </Col>
                  <Col span={5}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Loại án</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.loaiAn} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'loaiAn', val)} options={LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" popupMatchSelectWidth={false} />
                    ) : <div className="font-semibold">{chiTietPopup.loaiAn}</div>}
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Cán bộ xử lý</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.canBoPhanCong || undefined} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'canBoPhanCong', val)} options={CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))} placeholder="-- Chọn cán bộ --" className="w-full" size="small" popupMatchSelectWidth={false} />
                    ) : <div className="font-semibold">{chiTietPopup.canBoPhanCong || "Chưa phân công"}</div>}
                  </Col>

                  <Col span={4}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Ngày tiếp nhận</div>
                    <div className="font-semibold">{chiTietPopup.ngayTiepNhan}</div>
                  </Col>
                  <Col span={9}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Thông tin Bản án / Vụ án</div>
                    <div className="font-semibold text-blue-600">
                      {chiTietPopup.soBaqd ? `Bản án ${chiTietPopup.soBaqd}${chiTietPopup.ngayBaqd ? ` ngày ${chiTietPopup.ngayBaqd}` : ''} ${chiTietPopup.toaXetXu ? `- ${chiTietPopup.toaXetXu}` : ''}` : chiTietPopup.maVuAn ? `Vụ án ${chiTietPopup.maVuAn}` : '---'}
                    </div>
                    {chiTietPopup.maVuAn && (chiTietPopup.thamPhan || chiTietPopup.thuKy) && (
                      <div className="text-[11px] text-gray-600 mt-1">
                        {chiTietPopup.thamPhan && <span className="mr-3">Thẩm phán: <strong>{chiTietPopup.thamPhan}</strong></span>}
                        {chiTietPopup.thuKy && <span className="mr-3">Thư ký: <strong>{chiTietPopup.thuKy}</strong></span>}
                        {chiTietPopup.toaChuyenTrach && <span>Tòa: <strong>{chiTietPopup.toaChuyenTrach}</strong></span>}
                      </div>
                    )}
                  </Col>
                  <Col span={11}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Nội dung quan hệ pháp luật</div>
                    <div className="font-medium">{chiTietPopup.noiDungQuanHePhapLuat || chiTietPopup.tenVuAn || '---'}</div>
                  </Col>
                </Row>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
                  <div className="p-3 font-semibold border-b border-gray-200 bg-gray-50">Danh sách tài liệu</div>
                  <div className="flex-1 overflow-auto">
                    {["Đơn đề nghị GĐT.pdf", "Bản án/Quyết định sơ thẩm.pdf", "Tài liệu chứng cứ kèm theo.pdf"].map((doc, idx) => (
                      <div key={idx} onClick={() => setSelectedDoc(idx)} className={`p-3 border-b cursor-pointer transition-colors ${selectedDoc === idx ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
                        <Tag color="error">PDF</Tag>
                        <div className="text-sm font-medium text-blue-800 mt-1 truncate">{doc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-auto flex justify-center bg-gray-200">
                  <div className="bg-white w-full max-w-3xl min-h-[800px] shadow p-12 border border-gray-200">
                    <div className="text-center mb-8">
                      <div className="font-bold text-lg">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div className="font-bold text-base underline mb-8">Độc lập - Tự do - Hạnh phúc</div>
                      <div className="font-bold text-xl uppercase mb-8">{chiTietPopup.hinhThucDon}</div>
                    </div>
                    <div className="space-y-3">
                      <div><span className="font-bold">Kính gửi:</span> Tòa án nhân dân {chiTietPopup.toaXetXu || "..."}</div>
                      <div><span className="font-bold">Người làm đơn:</span> {chiTietPopup.nguoiLamDon}</div>
                      <div><span className="font-bold">Nguồn nhận:</span> {NGUON_META_LT[chiTietPopup.nguon].label}</div>
                      <div className="mt-4"><span className="font-bold">Nội dung tóm tắt:</span> Đơn yêu cầu giải quyết vụ việc liên quan đến loại án {chiTietPopup.loaiAn?.toLowerCase()} theo quy định.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Drawer>

        {/* Modal Tra Cuu & Map Vu An */}
        <Modal
          title={<div className="font-bold text-lg text-blue-900 border-b pb-3 mb-2">Tìm kiếm vụ án</div>}
          open={searchModalVisible}
          onCancel={() => setSearchModalVisible(false)}
          footer={null}
          width={950}
          centered
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    size="large"
                    id="txtSearchHoso"
                    placeholder="Nhập '0' để test case không tìm thấy..."
                    className="flex-1"
                    onPressEnter={() => {
                      const val = (document.getElementById('txtSearchHoso') as HTMLInputElement).value;
                      setSearchVuAnResult(val === '0' ? [] : VU_AN_MOCK);
                    }}
                  />
                  <Button size="large" type="primary" onClick={() => {
                    const val = (document.getElementById('txtSearchHoso') as HTMLInputElement).value;
                    setSearchVuAnResult(val === '0' ? [] : VU_AN_MOCK);
                  }}>Tìm kiếm</Button>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-4 space-y-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">Tìm kiếm nâng cao</span>
                    <Button type="link" size="small" onClick={() => searchForm.resetFields()}>Đặt lại</Button>
                  </div>

                  <Row gutter={16} className="mb-4">
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Tên đương sự</div>
                      <Input placeholder="Nhập tên..." />
                    </Col>
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">CCCD/CMND</div>
                      <Input placeholder="Nhập số định danh..." />
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Địa chỉ đương sự</div>
                    <Row gutter={8}>
                      <Col span={8}><Select className="w-full" placeholder="Tỉnh/Thành phố" options={[{ value: 'Hà Nội', label: 'Hà Nội' }, { value: 'HCM', label: 'Hồ Chí Minh' }]} /></Col>
                      <Col span={8}><Select className="w-full" placeholder="Quận/Huyện" /></Col>
                      <Col span={8}><Select className="w-full" placeholder="Phường/Xã" /></Col>
                    </Row>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Loại án</div>
                    <div className="flex gap-2 flex-wrap">
                      {['DS', 'HS', 'HC', 'KDTM', 'LĐ', 'HNGĐ', 'PS', 'TTHG', 'XLHC', 'THA'].map(t => (
                        <div key={t} className="px-3 h-[32px] flex items-center justify-center border border-gray-200 hover:border-blue-400 rounded text-sm text-gray-700 cursor-pointer">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Trạng thái giải quyết</div>
                      <Select className="w-full" placeholder="Chọn trạng thái" options={[
                        { value: 'Đang giải quyết', label: 'Đang giải quyết' },
                        { value: 'Đã xét xử', label: 'Đã xét xử' },
                        { value: 'Đình chỉ', label: 'Đình chỉ' }
                      ]} />
                    </Col>
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Ngày thụ lý</div>
                      <DatePicker.RangePicker className="w-full" format="DD/MM/YYYY" placeholder={['Từ ngày', 'Đến ngày']} />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Thẩm phán</div>
                      <Input placeholder="Nhập tên thẩm phán..." />
                    </Col>
                    <Col span={12}>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Thư ký</div>
                      <Input placeholder="Nhập tên thư ký..." />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[350px] flex flex-col border-l pl-6 border-gray-100">
              <div className="font-bold text-base mb-3 border-b pb-2 text-gray-800">
                Kết quả tìm kiếm {searchVuAnResult ? <span className="text-blue-600">({searchVuAnResult.length})</span> : ''}
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {!searchVuAnResult ? (
                  <div className="text-gray-400 text-center py-12 italic text-sm bg-gray-50 rounded-md border border-dashed">Nhập thông tin và bấm Tìm kiếm</div>
                ) : searchVuAnResult.length === 0 ? (
                  <div className="flex flex-col gap-3 py-6 px-4 bg-gray-50 rounded-md border border-dashed text-sm">
                    <div className="text-gray-500 text-center italic mb-2">Không tìm thấy vụ án phù hợp trên hệ thống</div>
                    {chiTietPopup && !chiTietPopup.hinhThucDon.toLowerCase().includes("gđt") && !chiTietPopup.hinhThucDon.toLowerCase().includes("khởi kiện") && (
                      <div className="border-t pt-3 mt-1 flex flex-col gap-2">
                        <div className="text-xs text-gray-500 mb-1">Xử lý ngoại lệ (Đơn không có vụ án ghép):</div>
                        <div className="flex gap-2">
                          {(chiTietPopup.nguon === "ToaKhac" || chiTietPopup.nguon === "VBDH") && (
                            <Button danger className="flex-1" onClick={() => { setSearchModalVisible(false); setTraLaiPopup(chiTietPopup); }}>Trả lại đơn</Button>
                          )}
                          <Button className="flex-1 text-blue-600 border-blue-600" onClick={() => {
                            handleUpdateRow(chiTietPopup.maDon, 'trangThai', 'luu-kho' as any);
                            alert("Đã lưu đơn vào Kho nội bộ chờ thêm kết quả giải quyết.");
                            setSearchModalVisible(false);
                            setChiTietPopup(null);
                          }}>Lưu kho nội bộ</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchVuAnResult.map((v, i) => (
                      <Card key={i} size="small" className="border-blue-100 bg-white hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <Popover
                            title={<span className="font-bold text-gray-700">Thông tin đương sự</span>}
                            trigger="click"
                            content={
                              <div className="max-h-[300px] overflow-y-auto w-[350px]">
                                {v.duongSu?.map((ds: any, idx: number) => (
                                  <div key={idx} className="border-b border-gray-100 last:border-0 py-2">
                                    <div className="text-xs font-semibold text-blue-600 mb-0.5">{ds.tuCach}</div>
                                    <div className="text-[13px] font-bold text-gray-800">{ds.hoTen}</div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">{ds.diaChi}</div>
                                  </div>
                                ))}
                                {(!v.duongSu || v.duongSu.length === 0) && (
                                  <div className="text-gray-500 italic text-sm py-2">Chưa có thông tin đương sự.</div>
                                )}
                              </div>
                            }
                          >
                            <a className="font-bold text-blue-800 text-sm hover:underline cursor-pointer">{v.maVuAn}</a>
                          </Popover>
                          <Tag color="blue" className="mr-0 border-0">{v.loaiAn}</Tag>
                        </div>
                        <div className="text-xs font-medium text-gray-800 line-clamp-2 mt-1">{v.tenVuAn}</div>

                        {v.banAn && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-[11px] text-yellow-800 font-medium">
                            Đã có bản án/quyết định: {v.banAn.so} - {v.banAn.ngay} - {v.banAn.toa}
                          </div>
                        )}

                        <div className="my-2" />
                        <div className="text-[11px] text-gray-500 mb-2">
                          <div>Thẩm phán: <span className="font-medium text-gray-800">{v.thamPhan}</span> - Thư ký: <span className="font-medium text-gray-800">{v.thuKy}</span></div>
                          <div className="mt-1">Tòa: <span className="font-medium text-gray-800">{v.toaChuyenTrach}</span> - <span className="font-medium">{v.toaXetXu}</span></div>
                        </div>
                        <Button size="small" type="primary" className="w-full font-medium mt-1" onClick={() => handleMapVuAn(v)}>Chọn vụ án</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* Modal Đơn Liên Quan */}
        <Modal title="Đơn liên quan" open={!!donLienQuanPopup} onCancel={() => setDonLienQuanPopup(null)} footer={null} width={500}>
          <Table
            dataSource={donLienQuanPopup?.donLienQuan || []}
            rowKey="maDon"
            pagination={false}
            size="small"
            columns={[
              { title: 'Đơn', dataIndex: 'maDon', key: 'maDon', render: text => <a className="font-semibold text-blue-600">{text}</a> },
              { title: 'Quan hệ', dataIndex: 'quanHe', key: 'quanHe' }
            ]}
          />
        </Modal>

        {/* Modal Phân công hàng loạt */}
        <Modal
          title="Phân công cán bộ xử lý"
          open={phanCongBatchPopup}
          onCancel={() => {
            setPhanCongBatchPopup(false);
            setBatchAssignCanBo("");
          }}
          onOk={() => {
            if (!batchAssignCanBo) {
              alert("Vui lòng chọn cán bộ phân công!");
              return;
            }
            setRows(prev => prev.map(row =>
              selectedRowKeys.includes(row.maDon)
                ? { ...row, trangThai: 'da-xu-ly' as any, nguoiXuLy: batchAssignCanBo, canBoPhanCong: batchAssignCanBo, ngayXuLy: new Date().toLocaleDateString("vi-VN") }
                : row
            ));
            alert(`Đã phân công ${selectedRowKeys.length} đơn cho ${batchAssignCanBo}.`);
            setPhanCongBatchPopup(false);
            setSelectedRowKeys([]);
            setBatchAssignCanBo("");
          }}
          okText="Lưu & Phân công"
          cancelText="Hủy"
          width={450}
        >
          <div className="mb-4 text-[13px]">
            Bạn đang phân công cho <strong className="text-blue-600">{selectedRowKeys.length}</strong> đơn vị.
          </div>
          <div className="text-xs text-gray-500 font-semibold mb-1">Chọn cán bộ xử lý</div>
          <Select
            value={batchAssignCanBo || undefined}
            onChange={setBatchAssignCanBo}
            options={CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))}
            placeholder="-- Chọn cán bộ --"
            className="w-full"
          />
        </Modal>

        {/* Modal Trả lại */}
        <Modal
          title="Trả lại đơn"
          open={!!traLaiPopup}
          onCancel={() => setTraLaiPopup(null)}
          onOk={() => {
            if (traLaiPopup) {
              if (!traLaiLyDo) { alert("Vui lòng chọn lý do trả lại!"); return; }
              const combinedLyDo = traLaiGhiChu ? `${traLaiLyDo} - ${traLaiGhiChu}` : traLaiLyDo;
              const now = new Date();
              const ngayTra = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

              setRows(prev => prev.map(r => r.maDon === traLaiPopup.maDon ? {
                ...r,
                trangThai: 'tra-lai' as any,
                lyDoTraLai: combinedLyDo,
                ngayTraLai: ngayTra,
                nguoiTraLai: "Cán bộ HCTP"
              } : r));
            }
            setTraLaiPopup(null);
            setTraLaiLyDo("");
            setTraLaiGhiChu("");
          }}
          okText="Xác nhận trả lại"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <div className="space-y-4 py-2">
            <div>
              <div className="mb-1 text-sm font-medium">Lý do trả lại <span className="text-red-500">*</span></div>
              <Select
                className="w-full"
                value={traLaiLyDo || undefined}
                onChange={setTraLaiLyDo}
                placeholder="— Chọn lý do —"
                options={[
                  { value: "Nhiều đơn khác bản án", label: "Nhiều đơn khác bản án trong cùng bì" },
                  { value: "Thiếu hồ sơ", label: "Thiếu hồ sơ, tài liệu đính kèm" },
                  { value: "Không thuộc thẩm quyền", label: "Không thuộc thẩm quyền giải quyết" },
                  { value: "Lý do khác", label: "Lý do khác" }
                ]}
              />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Ghi chú</div>
              <Input.TextArea rows={3} value={traLaiGhiChu} onChange={e => setTraLaiGhiChu(e.target.value)} placeholder="Nhập nội dung..." />
            </div>
          </div>
        </Modal>

        {/* Modal Nhập kết quả giải quyết (Kho nội bộ) */}
        <Modal
          title="Xử lý đơn (Kho nội bộ)"
          open={!!ketQuaPopup}
          onCancel={() => setKetQuaPopup(null)}
          onOk={() => {
            if (ketQuaPopup) {
              handleUpdateRow(ketQuaPopup.maDon, 'trangThai', 'da-xu-ly' as any);
              alert("Đã cập nhật kết quả giải quyết.");
              setKetQuaPopup(null);
            }
          }}
          okText="Lưu kết quả"
          cancelText="Hủy"
        >
          <Tabs defaultActiveKey="1" items={[
            {
              key: '1', label: 'Cập nhật kết quả', children: (
                <Form layout="vertical" className="mt-2">
                  <Form.Item label="Kết quả xử lý" required>
                    <Input.TextArea rows={4} placeholder="Nhập nội dung kết quả giải quyết..." />
                  </Form.Item>
                  <Form.Item label="Tài liệu đính kèm (nếu có)">
                    <Input type="file" />
                  </Form.Item>
                </Form>
              )
            },
            {
              key: '2', label: 'Ghép vụ án hồi tố', children: (
                <div className="mt-2 space-y-4">
                  <div className="text-sm text-gray-600 mb-2">Nhập thông tin vụ án hồi tố để ghép với đơn này nếu tìm thấy trên hệ thống cũ.</div>
                  <div className="font-semibold text-gray-700 mb-1">Mã vụ án / Số thụ lý:</div>
                  <div className="flex gap-2">
                    <Input placeholder="Mã vụ án/Số thụ lý..." id="txtMaVuAnHoiTo_Kho" className="flex-1" />
                    <Button type="primary" onClick={() => {
                      const val = (document.getElementById('txtMaVuAnHoiTo_Kho') as HTMLInputElement).value;
                      if (val && ketQuaPopup) {
                        handleUpdateRow(ketQuaPopup.maDon, 'maVuAn', val);
                        handleUpdateRow(ketQuaPopup.maDon, 'tenVuAn', 'Vụ án hồi tố (Nhập tay)');
                        handleUpdateRow(ketQuaPopup.maDon, 'thongTinVuAn', `Vụ án số ${val}`);
                        handleUpdateRow(ketQuaPopup.maDon, 'trangThai', 'da-xu-ly' as any);
                        alert(`Đã ghép thành công Vụ án ${val} vào đơn!`);
                        setKetQuaPopup(null);
                      }
                    }}>Ghép vụ án</Button>
                  </div>
                </div>
              )
            }
          ]} />
        </Modal>
        {/* Modal Danh sách cán bộ */}
        <Modal
          title="Danh sách cán bộ đơn vị"
          onCancel={() => setShowDanhSachCanBo(false)}
          open={showDanhSachCanBo}
          width={600}
          footer={null}
        >
          <Table
            dataSource={MOCK_CAN_BO_LIST}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Cán bộ',
                key: 'canBo',
                render: (_, record) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {record.ten.split(' ').pop()?.[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-[13px]">{record.ten}</div>
                      <div className="text-[11px] text-gray-500">{record.chucVu}</div>
                    </div>
                  </div>
                )
              },
              {
                title: 'Đang xử lý',
                dataIndex: 'soDonDangXuLy',
                key: 'soDon',
                align: 'center',
                render: (val) => <Tag color="blue">{val} đơn</Tag>
              },
              {
                title: 'Trạng thái',
                dataIndex: 'trangThai',
                key: 'trangThai',
                align: 'center',
                render: (val) => (
                  <Tag color={val === 'Đang làm việc' ? 'success' : 'default'} bordered={false}>
                    {val}
                  </Tag>
                )
              }
            ]}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};
export default PanelLienThong;
