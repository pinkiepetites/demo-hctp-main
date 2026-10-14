import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Eye, CornerUpLeft, Send } from "lucide-react";
import { Table, Tabs, Modal, Drawer, Select, Input, Button, Tag, Radio, Space, Tooltip, Row, Col, ConfigProvider } from "antd";
import type { ColumnsType } from "antd/es/table";

type DonNguon = "VBDH" | "DVTT" | "DVC" | "BuuDien" | "TrucTiep" | "ToaKhac";
type DonTrangThai = "cho-phan-loai" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

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
  noiDungQuanHePhapLuat?: string;
  ghiChu?: string;
  tenToaChuyenDen?: string;
  diaChi?: string;
  cccd?: string;
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyễn Văn Bình",
    diaChi: "Số 15, Ngõ 20, Đường Cầu Giấy, Hà Nội", cccd: "001089123456",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hành chính", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Tòa Hành chính",
    trangThai: "cho-phan-loai", nguon: "VBDH", coDonLienQuan: true,
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
    trangThai: "cho-phan-loai", nguon: "DVTT", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: false, lyDo: "Thiếu BA/QĐ có hiệu lực" },
    soBaqd: "45/2025/DS-ST", ngayBaqd: "10/10/2025", toaXetXu: "TAND Tỉnh Bắc Ninh",
    noiDungQuanHePhapLuat: "Tranh chấp quyền sở hữu tài sản và yêu cầu bồi thường thiệt hại"
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "Lê Minh Tuấn",
    cccd: "034091000123",
    hinhThucDon: "Thông báo phát hiện vi phạm pháp luật", loaiAn: "Hình sự", canBoPhanLoai: "Phạm Quốc Hưng",
    donViTiepNhanGoiY: "Tòa Hình sự",
    trangThai: "cho-phan-loai", nguon: "VBDH", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Phát hiện vi phạm quy định về quản lý bảo vệ rừng"
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "Vũ Thu Hà",
    diaChi: "Quận 1, TP Hồ Chí Minh", cccd: "079198000456",
    hinhThucDon: "Đơn khởi kiện / yêu cầu dân sự", loaiAn: "Dân sự", canBoPhanLoai: "Nguyễn Hải Trâm",
    donViTiepNhanGoiY: "Tòa Dân sự",
    trangThai: "cho-phan-loai", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "Đơn yêu cầu phản tố/độc lập" }],
    dieuKienGoiY: { hopLe: true },
    maVuAn: "12/2026/TLST-DS", tenVuAn: "Tranh chấp hợp đồng vay tài sản",
    tenBiDon: "Nguyễn Văn A", noiDungQuanHePhapLuat: "Yêu cầu hoàn trả tiền vay và lãi suất quá hạn"
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Hoàng Văn Nam",
    hinhThucDon: "Công văn chuyển đơn", loaiAn: "Hành chính", canBoPhanLoai: "Nguyễn Hải Trâm",
    donViTiepNhanGoiY: "Tòa Hành chính",
    trangThai: "cho-phan-loai", nguon: "ToaKhac", tenToaChuyenDen: "TAND Cấp cao tại Hà Nội", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: false, lyDo: "Thiếu thông tin CCCD" },
    noiDungQuanHePhapLuat: "Khiếu kiện quyết định xử phạt vi phạm hành chính lĩnh vực giao thông"
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "Đặng Bích Ngọc",
    cccd: "031195000789",
    hinhThucDon: "Đơn hôn nhân và gia đình", loaiAn: "Hôn nhân và gia đình", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Tòa Dân sự",
    trangThai: "cho-phan-loai", nguon: "VBDH", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Ly hôn, tranh chấp nuôi con và chia tài sản chung"
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "Võ Quang Huy",
    hinhThucDon: "Đơn đề nghị Giám đốc thẩm / Tái thẩm", loaiAn: "Kinh doanh thương mại", canBoPhanLoai: "Trần Văn Minh",
    donViTiepNhanGoiY: "Văn phòng",
    trangThai: "cho-phan-loai", nguon: "DVC", coDonLienQuan: false,
    dieuKienGoiY: { hopLe: true },
    soBaqd: "15/2025/KDTM-ST", ngayBaqd: "12/05/2025", toaXetXu: "TAND Quận Cầu Giấy",
    noiDungQuanHePhapLuat: "Kháng nghị quyết định sơ thẩm vụ án tranh chấp hợp đồng cho thuê mặt bằng"
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyễn Thị Phương",
    hinhThucDon: "Công văn chuyển kiến nghị", loaiAn: "Lao động", canBoPhanLoai: "Chưa phân công",
    donViTiepNhanGoiY: "Văn phòng",
    trangThai: "cho-phan-loai", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Liên quan đến đơn của công ty TNHH ABC" }],
    dieuKienGoiY: { hopLe: true },
    noiDungQuanHePhapLuat: "Kiến nghị về việc công ty chậm trả lương và bảo hiểm xã hội"
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "Lý Đức Trọng",
    hinhThucDon: "Tài liệu, chứng cứ", loaiAn: "Hình sự", canBoPhanLoai: "Lê Thị Hoa",
    donViTiepNhanGoiY: "Tòa Hình sự",
    trangThai: "cho-phan-loai", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "Tài liệu bổ sung cho vụ Lê Minh Tuấn" }],
    dieuKienGoiY: { hopLe: true },
    thongTinVuAn: "Vụ án số 88/2025/TLST-HS",
    noiDungQuanHePhapLuat: "Bổ sung tài liệu chứng cứ về nhân thân người bị hại"
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; color: string }> = {
  "cho-phan-loai": { label: "Chờ phân công", color: "orange" },
  "da-phan-cong": { label: "Đã phân công", color: "blue" },
  "cho-xu-ly": { label: "Chờ xử lý", color: "green" },
  "tra-lai": { label: "Trả lại", color: "red" },
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
const LOAI_AN_OPTIONS = ["Dân sự", "Hình sự", "Hành chính", "Lao động", "Kinh doanh thương mại", "Hôn nhân và gia đình", "Phá sản", "Sở hữu trí tuệ", "Xử lý hành chính"];
const HINH_THUC_OPTIONS = [
  "Đơn đề nghị Giám đốc thẩm / Tái thẩm", "Công văn kiến nghị GĐT / TT", "Hồ sơ Kháng nghị GĐT, TT",
  "Thông báo phát hiện vi phạm pháp luật", "Đơn khiếu nại tố cáo trong tố tụng", "Công văn chuyển đơn",
  "Công văn chuyển kiến nghị", "Tài liệu, chứng cứ", "Đơn khác", "Đơn khởi kiện / yêu cầu dân sự",
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

  const counts = useMemo(() => ({
    "tat-ca": DON_SAMPLE.length,
    "cho-phan-loai": DON_SAMPLE.filter(d => d.trangThai === "cho-phan-loai").length,
    "tra-lai": DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
  }), []);

  const tabItems = [
    { key: "tat-ca", label: `Tất cả (${counts["tat-ca"]})` },
    { key: "cho-phan-loai", label: `Chờ phân loại (${counts["cho-phan-loai"]})` },
    { key: "tra-lai", label: `Trả lại (${counts["tra-lai"]})` },
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
              {record.coDonLienQuan && (
                <Tag color="orange" className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setDonLienQuanPopup(record); }}>
                  Có đơn liên quan
                </Tag>
              )}
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
            {isCanBoPhanLoai ? (
              <Select
                value={record.hinhThucDon}
                onChange={val => handleUpdateRow(record.maDon, 'hinhThucDon', val)}
                options={HINH_THUC_OPTIONS.map(o => ({ value: o, label: o }))}
                style={{ width: '100%', minWidth: 200 }}
                size="small"
                popupMatchSelectWidth={false}
                onClick={e => e.stopPropagation()}
              />
            ) : <Tooltip title={record.hinhThucDon}><div className="truncate max-w-[240px] font-medium">{record.hinhThucDon}</div></Tooltip>}
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Loại án</div>
            {isCanBoPhanLoai ? (
              <Select
                value={record.loaiAn}
                onChange={val => handleUpdateRow(record.maDon, 'loaiAn', val)}
                options={LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))}
                style={{ width: '100%', minWidth: 120 }}
                size="small"
                popupMatchSelectWidth={false}
                onClick={e => e.stopPropagation()}
              />
            ) : <div className="font-medium text-blue-800">{record.loaiAn}</div>}
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
        let tag = null;
        if (record.trangThai === "cho-phan-loai" && record.dieuKienGoiY) {
          tag = (
            <div>
              <Tag color={record.dieuKienGoiY.hopLe ? "success" : "error"}>
                {record.dieuKienGoiY.hopLe ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
              </Tag>
              {!record.dieuKienGoiY.hopLe && record.dieuKienGoiY.lyDo && (
                <div className="text-[11px] text-red-500 mt-1">{record.dieuKienGoiY.lyDo}</div>
              )}
            </div>
          );
        } else {
          const sm = TRANG_THAI_META[record.trangThai];
          tag = <Tag color={sm.color}>{sm.label}</Tag>;
        }

        return (
          <div className="space-y-2">
            <div>{tag}</div>
            <div>
              <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Đơn vị tiếp nhận</div>
              {isCanBoPhanLoai ? (
                <Select
                  value={record.donViTiepNhanGoiY || undefined}
                  onChange={val => handleUpdateRow(record.maDon, 'donViTiepNhanGoiY', val)}
                  options={DON_VI_OPTIONS.map(o => ({ value: o, label: o }))}
                  placeholder="-- Chọn đơn vị --"
                  style={{ width: '100%', minWidth: 140 }}
                  size="small"
                  popupMatchSelectWidth={false}
                  onClick={e => e.stopPropagation()}
                />
              ) : <Tooltip title={record.donViTiepNhanGoiY || "Chưa xác định"}><div className="truncate max-w-[180px] font-medium">{record.donViTiepNhanGoiY || "Chưa xác định"}</div></Tooltip>}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button type="text" icon={<Eye size={16} />} onClick={(e) => { e.stopPropagation(); setChiTietPopup(record); }} />
          </Tooltip>
          {isCanBoPhanLoai && (
            <Tooltip title="Xác nhận & Chuyển">
              <Button type="text" className="text-blue-600" icon={<Send size={14} />} onClick={(e) => {
                e.stopPropagation();
                if (record.donViTiepNhanGoiY === "Văn phòng") {
                  onPhanLoaiGDT?.({
                    nguoiGui: record.nguoiLamDon, diaChi: "Chưa rõ", trichYeu: record.hinhThucDon,
                    loaiVanBan: record.loaiAn, ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
                    canBoTiepNhan: "Chờ xử lý", hinhThucTiepNhan: record.nguon
                  });
                }
                setRows(prev => prev.filter(r => r.maDon !== record.maDon));
                alert(`Đã chuyển đơn ${record.maDon} tới ${record.donViTiepNhanGoiY || "đơn vị khác"}.`);
              }} />
            </Tooltip>
          )}
          {(!isCanBoPhanLoai || isChanhVP) && record.trangThai !== "tra-lai" && (
            <Tooltip title="Trả lại">
              <Button type="text" danger icon={<CornerUpLeft size={16} />} onClick={(e) => { e.stopPropagation(); setTraLaiPopup(record); }} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const handleChuyenDon = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân loại"); return; }
    const selectedRows = rows.filter(r => selectedRowKeys.includes(r.maDon));
    selectedRows.forEach(r => {
      if (r.donViTiepNhanGoiY === "Văn phòng") {
        onPhanLoaiGDT?.({
          nguoiGui: r.nguoiLamDon, diaChi: "Chưa rõ", trichYeu: r.hinhThucDon,
          loaiVanBan: r.loaiAn, ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
          canBoTiepNhan: "Chờ xử lý", hinhThucTiepNhan: r.nguon,
          soBaqd: r.soBaqd, ngayBaqd: r.ngayBaqd, toaXetXu: r.toaXetXu
        });
      }
    });
    setRows(prev => prev.filter(r => !selectedRowKeys.includes(r.maDon)));
    setSelectedRowKeys([]);
    alert("Đã chuyển các đơn đã chọn đến các đơn vị tiếp nhận tương ứng.");
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
            {isTruongPhong && <Button>Danh sách cán bộ</Button>}
            <Button icon={<RefreshCw size={14} />}>Làm mới</Button>
          </Space>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-2 border-b border-gray-200">
          <Tabs activeKey={activeTab} onChange={(k) => { setActiveTab(k); setSelectedRowKeys([]); }} items={tabItems} />
        </div>

        {/* Search & Filter */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-3">
            <Radio.Group value={fDieuKien} onChange={e => setFDieuKien(e.target.value)}>
              <Radio value="tat-ca">Tất cả</Radio>
              <Radio value="chua-du">Đơn chưa đủ điều kiện</Radio>
              <Radio value="du">Đơn đủ điều kiện</Radio>
            </Radio.Group>
          </div>
          <Space className="w-full" style={{ display: 'flex' }}>
            <Input
              prefix={<Search size={14} className="text-gray-400" />}
              placeholder="Tìm theo số đến, mã đơn, người làm đơn..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: 400 }}
            />
            <Button onClick={() => setShowAdvanced(!showAdvanced)} type={showAdvanced ? "primary" : "default"}>Nâng cao</Button>
            <Button type="primary">Tìm kiếm</Button>
            <Button onClick={() => { setSearch(""); resetAdvanced(); }}>Đặt lại</Button>
          </Space>

          {showAdvanced && (
            <Row gutter={[16, 16]} className="mt-4">
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">Nguồn tiếp nhận</div>
                <Select className="w-full" value={fNguon} onChange={setFNguon} options={[{ value: '', label: 'Tất cả' }, { value: 'VBDH', label: 'VBDH' }, { value: 'DVTT', label: 'DVTT' }, { value: 'DVC', label: 'DVC' }]} />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">Người đứng đơn</div>
                <Input className="w-full" value={fNguoiDon} onChange={e => setFNguoiDon(e.target.value)} placeholder="Nhập tên..." />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">Loại án</div>
                <Select className="w-full" value={fLoaiAn} onChange={setFLoaiAn} options={[{ value: '', label: 'Tất cả' }, ...LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))]} />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">Cán bộ tiếp nhận</div>
                <Select className="w-full" value={fCanBo} onChange={setFCanBo} options={[{ value: '', label: 'Tất cả' }, ...CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))]} />
              </Col>
            </Row>
          )}
        </div>

        {isCanBoPhanLoai && (activeTab === "tat-ca" || activeTab === "cho-phan-loai") && (
          <div className="p-3 border-b border-gray-200 flex justify-end">
            <Button type="primary" onClick={handleChuyenDon}>Chuyển đơn</Button>
          </div>
        )}

        {/* Main Table */}
        <div className="flex-1 overflow-auto bg-white p-2">
          <Table
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

        {/* Drawer Chi Tiết */}
        <Drawer
          title={<div className="font-bold text-lg">Chi tiết đơn: {chiTietPopup?.maDon}</div>}
          placement="right"
          width={1100}
          onClose={() => setChiTietPopup(null)}
          open={!!chiTietPopup}
          extra={
            <Space>
              {chiTietPopup?.nguon === "VBDH" && chiTietPopup?.trangThai !== "tra-lai" && (
                <Button danger icon={<CornerUpLeft size={14} />} onClick={() => { setTraLaiPopup(chiTietPopup); setChiTietPopup(null); }}>Trả lại</Button>
              )}
              {isCanBoPhanLoai && (
                <Button type="primary" icon={<Send size={14} />} onClick={() => {
                  if (chiTietPopup?.donViTiepNhanGoiY === "Văn phòng") {
                    onPhanLoaiGDT?.({
                      nguoiGui: chiTietPopup.nguoiLamDon, diaChi: "Chưa rõ", trichYeu: chiTietPopup.hinhThucDon,
                      loaiVanBan: chiTietPopup.loaiAn, ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
                      canBoTiepNhan: "Chờ xử lý", hinhThucTiepNhan: chiTietPopup.nguon
                    });
                  }
                  setRows(prev => prev.filter(r => r.maDon !== chiTietPopup?.maDon));
                  alert(`Đã chuyển đơn ${chiTietPopup?.maDon} tới ${chiTietPopup?.donViTiepNhanGoiY || "đơn vị khác"}.`);
                  setChiTietPopup(null);
                }}>Xác nhận & Chuyển</Button>
              )}
            </Space>
          }
        >
          {chiTietPopup && (
            <div className="flex flex-col h-full bg-gray-50 -m-6">
              <div className="p-4 bg-white border-b border-gray-200">
                <Row gutter={[24, 16]}>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Người làm đơn</div>
                    <div className="font-semibold">{chiTietPopup.nguoiLamDon}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Hình thức đơn</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.hinhThucDon} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'hinhThucDon', val)} options={HINH_THUC_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" />
                    ) : <div className="font-semibold">{chiTietPopup.hinhThucDon}</div>}
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Loại án</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.loaiAn} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'loaiAn', val)} options={LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" />
                    ) : <div className="font-semibold">{chiTietPopup.loaiAn}</div>}
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Đơn vị tiếp nhận</div>
                    {isCanBoPhanLoai ? (
                      <Select value={chiTietPopup.donViTiepNhanGoiY || undefined} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'donViTiepNhanGoiY', val)} options={DON_VI_OPTIONS.map(o => ({ value: o, label: o }))} placeholder="-- Chọn đơn vị --" className="w-full" size="small" />
                    ) : <div className="font-semibold">{chiTietPopup.donViTiepNhanGoiY || "Chưa xác định"}</div>}
                  </Col>

                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Ngày tiếp nhận</div>
                    <div className="font-semibold">{chiTietPopup.ngayTiepNhan}</div>
                  </Col>
                  <Col span={9}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Thông tin Bản án / Vụ án</div>
                    <div className="font-semibold text-blue-600">
                      {chiTietPopup.soBaqd ? `Bản án ${chiTietPopup.soBaqd}${chiTietPopup.ngayBaqd ? ` ngày ${chiTietPopup.ngayBaqd}` : ''} ${chiTietPopup.toaXetXu ? `- ${chiTietPopup.toaXetXu}` : ''}` : chiTietPopup.maVuAn ? `Vụ án ${chiTietPopup.maVuAn}` : '---'}
                    </div>
                  </Col>
                  <Col span={9}>
                    <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Nội dung quan hệ pháp luật</div>
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
                      <div className="mt-4"><span className="font-bold">Nội dung tóm tắt:</span> Đơn yêu cầu giải quyết vụ việc liên quan đến loại án {chiTietPopup.loaiAn.toLowerCase()} theo quy định.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Drawer>

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

        {/* Modal Trả lại */}
        <Modal
          title="Trả lại đơn"
          open={!!traLaiPopup}
          onCancel={() => setTraLaiPopup(null)}
          onOk={() => setTraLaiPopup(null)}
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
      </div>
    </ConfigProvider>
  );
};
export default PanelLienThong;
