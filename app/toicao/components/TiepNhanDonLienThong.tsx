import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Eye, CornerUpLeft, Send, ChevronUp, ChevronDown } from "lucide-react";
import { Table, Tabs, Modal, Drawer, Select, Input, Button, Tag, Radio, Space, Tooltip, Row, Col, ConfigProvider, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";

type DonNguon = "VBDH" | "DVTT" | "DVC" | "BuuDien" | "TrucTiep" | "ToaKhac";
type DonTrangThai = "cho-phan-cong" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoTiepNhan: string;
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
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hành chính", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true, dieuKienGoiY: { hopLe: true },
    soBaqd: "15/2026/HC-ST", ngayBaqd: "10/01/2026", toaXetXu: "TAND Tp. Hà Nội", noiDungQuanHePhapLuat: "Khiếu nại quyết định hành chính",
    donLienQuan: [
      { maDon: "001025", quanHe: "Trùng số/ngày BA, QĐ" },
      { maDon: "000876", quanHe: "Trùng người đứng đơn" },
    ],
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trần Thị Lan",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false, dieuKienGoiY: { hopLe: false, lyDo: "Thiếu BA/QĐ có hiệu lực" },
    soBaqd: "112/2025/DS-PT", ngayBaqd: "05/11/2025", toaXetXu: "TAND Cấp cao tại Hà Nội", noiDungQuanHePhapLuat: "Tranh chấp đất đai",
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "Lê Minh Tuấn",
    hinhThucDon: "Thông báo phát hiện vi phạm pháp luật", loaiAn: "Hình sự", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "da-phan-cong", nguon: "VBDH", coDonLienQuan: false, dieuKienGoiY: { hopLe: true },
    soBaqd: "88/2026/HS-ST", ngayBaqd: "15/03/2026", toaXetXu: "TAND tỉnh Bắc Ninh", noiDungQuanHePhapLuat: "Tội lừa đảo chiếm đoạt tài sản",
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "Vũ Thu Hà",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true, dieuKienGoiY: { hopLe: true },
    soBaqd: "45/2025/LĐ-PT", ngayBaqd: "20/12/2025", toaXetXu: "TAND Cấp cao tại Đà Nẵng", noiDungQuanHePhapLuat: "Tranh chấp sa thải trái pháp luật",
    donLienQuan: [{ maDon: "000921", quanHe: "Có yêu cầu bổ sung trước đó" }],
  },
  {
    maDon: "001250", ngayTiepNhan: "16/08/2026 10:20", nguoiLamDon: "Công ty TNHH ABC",
    hinhThucDon: "CV kiến nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false, dieuKienGoiY: { hopLe: true },
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Hoàng Văn Nam",
    hinhThucDon: "CV chuyển đơn", loaiAn: "Hành chính", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false, dieuKienGoiY: { hopLe: true },
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "Đặng Bích Ngọc",
    hinhThucDon: "Đơn khác", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false, dieuKienGoiY: { hopLe: false, lyDo: "Thiếu thông tin CCCD" },
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "Võ Quang Huy",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Trần Văn Minh",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false, dieuKienGoiY: { hopLe: true },
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyễn Thị Phương",
    hinhThucDon: "CV chuyển kiến nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Liên quan đến đơn của công ty TNHH ABC" }]
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "Lý Đức Trọng",
    hinhThucDon: "Tài liệu chứng cứ", loaiAn: "Hình sự", canBoTiepNhan: "Lê Thị Hoa",
    trangThai: "da-phan-cong", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "Tài liệu bổ sung cho vụ Lê Minh Tuấn" }]
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; color: string }> = {
  "cho-phan-cong": { label: "Chờ phân công", color: "orange" },
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
  "Đơn đề nghị GĐT/TT", "Công văn kiến nghị GĐT/TT", "Hồ sơ Kháng nghị GĐT/TT",
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
  const isTruongPhong = currentRole === "truong-phong";
  const isCanBoPhanLoai = currentRole === "can-bo-phan-loai";
  type TabKey = "tat-ca" | DonTrangThai;

  const [activeTab, setActiveTab] = useState<string>("tat-ca");
  const [rows, setRows] = useState(DON_SAMPLE);
  const [showDanhSachCanBo, setShowDanhSachCanBo] = useState(false);
  const [selectedCanBoPopup, setSelectedCanBoPopup] = useState(CAN_BO_LIST_LT[0]);

  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkCanBo, setBulkCanBo] = useState<string>('');

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
    "cho-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "cho-phan-cong").length,
    "da-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "da-phan-cong").length,
    "tra-lai": DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
  }), []);

  const tabItems = [
    { key: "tat-ca", label: `Tất cả (${counts["tat-ca"]})` },
    { key: "cho-phan-cong", label: `Chờ phân công (${counts["cho-phan-cong"]})` },
    { key: "da-phan-cong", label: `Đã phân công (${counts["da-phan-cong"]})` },
    { key: "tra-lai", label: `Trả lại (${counts["tra-lai"]})` },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      if (activeTab !== "tat-ca" && d.trangThai !== activeTab) return false;
      if (fNguon && d.nguon !== fNguon) return false;
      if (fHinhThuc && d.hinhThucDon !== fHinhThuc) return false;
      if (fLoaiAn && d.loaiAn !== fLoaiAn) return false;
      if (fCanBo && d.canBoTiepNhan !== fCanBo) return false;
      if (fTrangThai && d.trangThai !== fTrangThai) return false;
      if (fNguoiDon && !d.nguoiLamDon.toLowerCase().includes(fNguoiDon.toLowerCase())) return false;
      if (fDieuKien === "du" && (!d.dieuKienGoiY || !d.dieuKienGoiY.hopLe)) return false;
      if (fDieuKien === "chua-du" && d.dieuKienGoiY?.hopLe !== false) return false;
      if (q && ![d.maDon, d.nguoiLamDon, d.canBoTiepNhan].some(s => s.toLowerCase().includes(q))) return false;
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
      title: 'Phân công',
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
        const hopLe = record.dieuKienGoiY?.hopLe !== false;
        const tag = (
          <div>
            <Tag color={hopLe ? "success" : "error"}>
              {hopLe ? 'Đủ điều kiện' : 'Chưa đủ điều kiện'}
            </Tag>
            {!hopLe && record.dieuKienGoiY?.lyDo && (
              <div className="text-[11px] text-red-500 mt-1">{record.dieuKienGoiY.lyDo}</div>
            )}
          </div>
        );

        return (
          <div className="space-y-2">
            <div>{tag}</div>
            {record.trangThai !== 'tra-lai' && (
              <div>
                <div className="text-[10px] text-gray-500 font-semibold mb-0.5">Phân công cán bộ xử lý</div>
                <Tooltip title={record.canBoTiepNhan || "Chưa phân công"}><div className="truncate max-w-[140px] font-medium">{record.canBoTiepNhan || "Chưa phân công"}</div></Tooltip>
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
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button type="text" icon={<Eye size={16} />} onClick={(e) => { e.stopPropagation(); setChiTietPopup(record); }} />
          </Tooltip>
          {isTruongPhong && (
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
          {(!isCanBoPhanLoai && !isChanhVP) && record.trangThai !== "tra-lai" && (
            <Tooltip title="Trả lại">
              <Button type="text" danger icon={<CornerUpLeft size={16} />} onClick={(e) => { e.stopPropagation(); setTraLaiPopup(record); }} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const handleChuyenDon = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để chuyển"); return; }
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

  const handlePhanCongNgauNhien = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
    setRows(prev => prev.map(r => {
      if (selectedRowKeys.includes(r.maDon)) {
        const randomCanBo = CAN_BO_LIST_LT[Math.floor(Math.random() * CAN_BO_LIST_LT.length)];
        return { ...r, canBoTiepNhan: randomCanBo };
      }
      return r;
    }));
    setSelectedRowKeys([]);
    alert("Đã phân công ngẫu nhiên các đơn đã chọn.");
  };

  const handlePhanCongChiDinh = () => {
    if (selectedRowKeys.length === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
    if (!bulkCanBo) { alert("Vui lòng chọn cán bộ từ danh sách"); return; }
    setRows(prev => prev.map(r => {
      if (selectedRowKeys.includes(r.maDon)) {
        return { ...r, canBoTiepNhan: bulkCanBo };
      }
      return r;
    }));
    setSelectedRowKeys([]);
    alert(`Đã phân công chỉ định các đơn đã chọn cho ${bulkCanBo}.`);
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
        <div className="px-4 pt-2 border-b border-gray-200 shrink-0">
          <Tabs activeKey={activeTab} onChange={(k) => { setActiveTab(k); setSelectedRowKeys([]); }} items={tabItems} />
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto relative flex flex-col" id="t-container-toicao">
          {/* Search & Filter */}
          <div className="px-4 shrink-0 bg-white z-10">
            <div className="p-2 flex flex-col gap-4">

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
                      <div className="text-[13px] font-medium text-gray-700 mb-1.5">Nguồn tiếp nhận</div>
                      <Select className="w-full h-[38px]" value={fNguon} onChange={setFNguon} options={[{ value: '', label: 'Tất cả' }, { value: 'VBDH', label: 'Văn bản điều hành' }, { value: 'DVTT', label: 'Cổng dịch vụ tư pháp' }, { value: 'DVC', label: 'Cổng DVC Quốc gia' }, { value: 'ToaKhac', label: 'Từ Tòa án khác' }]} />
                    </div>
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
                      <Select className="w-full h-[38px]" value={fDieuKien} onChange={setFDieuKien} options={[{ value: 'tat-ca', label: 'Tất cả' }, { value: 'du', label: 'Đủ điều kiện' }, { value: 'chua-du', label: 'Chưa đủ điều kiện' }]} />
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

          {(isTruongPhong && (activeTab === "tat-ca" || activeTab === "cho-phan-cong")) && (
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
              <Button type="primary" icon={<Send size={16} />} onClick={handleChuyenDon} className="ml-2">Chuyển đơn</Button>
            </div>
          )}

          {/* Main Table */}
          <div className="flex-1 bg-white p-2 min-h-0 relative">
            <Table
              sticky={{ offsetHeader: 0, getContainer: () => document.getElementById('t-container-toicao') as HTMLElement }}
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
                <Button onClick={() => {
                  alert("Đã lưu thông tin đơn!");
                  setChiTietPopup(null);
                }}>Lưu</Button>
              )}
              {isTruongPhong && (
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
                }}>Lưu & Chuyển</Button>
              )}
            </Space>
          }
        >
          {chiTietPopup && (
            <div className="flex flex-col h-full bg-gray-50 -m-6">
              <div className="p-4 bg-white border-b border-gray-200">
                <Row gutter={[24, 16]}>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Người làm đơn</div>
                    <div className="font-semibold">{chiTietPopup.nguoiLamDon}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Hình thức đơn</div>
                    <Select value={chiTietPopup.hinhThucDon} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'hinhThucDon', val)} options={HINH_THUC_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" />
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Loại án</div>
                    <Select value={chiTietPopup.loaiAn} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'loaiAn', val)} options={LOAI_AN_OPTIONS.map(o => ({ value: o, label: o }))} className="w-full" size="small" />
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Cán bộ xử lý</div>
                    <Select value={chiTietPopup.canBoTiepNhan === "Chưa phân công" ? undefined : chiTietPopup.canBoTiepNhan} onChange={val => handleUpdateRow(chiTietPopup.maDon, 'canBoTiepNhan', val || "Chưa phân công")} options={CAN_BO_LIST_LT.map(o => ({ value: o, label: o }))} placeholder="-- Chọn cán bộ --" className="w-full" size="small" allowClear />
                  </Col>

                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Ngày tiếp nhận</div>
                    <div className="font-semibold">{chiTietPopup.ngayTiepNhan}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Thông tin Bản án</div>
                    <div className="font-semibold text-blue-600">
                      {chiTietPopup.soBaqd ? ` ${chiTietPopup.soBaqd}${chiTietPopup.ngayBaqd ? ` - ${chiTietPopup.ngayBaqd}` : ''} ${chiTietPopup.toaXetXu ? `- ${chiTietPopup.toaXetXu}` : ''}` : chiTietPopup.maVuAn ? `Vụ án ${chiTietPopup.maVuAn}` : '---'}
                    </div>
                  </Col>
                  <Col span={6}>
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
                      <div><span className="font-bold">Kính gửi:</span> Tòa án nhân dân {chiTietPopup.toaXetXu || "Cấp cao..."}</div>
                      <div><span className="font-bold">Người làm đơn:</span> {chiTietPopup.nguoiLamDon}</div>
                      <div><span className="font-bold">Nguồn nhận:</span> {NGUON_META_LT[chiTietPopup.nguon].label}</div>
                      <div className="mt-4"><span className="font-bold">Nội dung đơn:</span> Đơn yêu cầu xem xét lại Bản án {chiTietPopup.soBaqd ? `số ${chiTietPopup.soBaqd}` : ''} {chiTietPopup.ngayBaqd ? `ngày ${chiTietPopup.ngayBaqd}` : ''} của {chiTietPopup.toaXetXu || 'Tòa án'} về vụ việc {chiTietPopup.noiDungQuanHePhapLuat || chiTietPopup.loaiAn.toLowerCase()}. Người làm đơn cho rằng quyết định của tòa án không khách quan, có nhiều tình tiết chưa được làm rõ, ảnh hưởng nghiêm trọng đến quyền và lợi ích hợp pháp của người làm đơn.</div>
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
