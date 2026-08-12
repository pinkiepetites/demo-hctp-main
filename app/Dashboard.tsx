import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Users,
  Calendar,
  PieChart,
  ArrowRight,
  FileCheck,
  Hourglass,
  Send,
  Inbox,
  Mail,
  Globe,
  UserCheck,
  Scale,
  FileQuestion,
  ListChecks,
  RotateCcw,
  Clock,
  CheckCircle2,
  FileText,
  Gavel,
  HelpCircle,
} from "lucide-react";
import { dangChoXuLy, nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh, type TabDS } from "./components/QuanLyVanBan";

// Biến thể của KPICard có nút "Xem chi tiết" ở góc phải — dùng cho 2 card
// duyệt tài liệu, dẫn thẳng sang màn Phê duyệt đề xuất.
const KPICardCoLink = ({ title, value, icon, colorClass, bgColorClass, trend, onXemChiTiet }: {
  title: string, value: string, icon: React.ReactNode, colorClass: string, bgColorClass: string, trend: string,
  onXemChiTiet?: () => void,
}) => (
  <div className="bg-white rounded-[8px] border border-[#eee] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <p className="text-[13px] text-[#666] font-medium">{title}</p>
      <button
        onClick={onXemChiTiet}
        className="text-[#3b82f6] text-[11px] font-medium hover:underline flex items-center gap-0.5 flex-shrink-0"
      >
        Xem chi tiết <ArrowRight size={11} />
      </button>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{value}</span>
        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${trend.startsWith('+') || trend.startsWith('Tăng') ? 'text-[#27ae60]' : (trend.startsWith('-') || trend.startsWith('Giảm') ? 'text-[#c0392b]' : 'text-[#f39c12]')}`}>
          {trend}
        </span>
      </div>
      <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 ${bgColorClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  </div>
);

// Card thống kê đơn nhận đơn giản (không có nút "Xem chi tiết") — dùng cho
// khối "Thống kê đơn nhận {kỳ}" của Trưởng phòng, khớp mockup: title bên trái,
// giá trị + xu hướng cùng hàng, icon tròn bên phải.
const KPICardDon = ({ title, value, icon, colorClass, bgColorClass, trend }: {
  title: string, value: string, icon: React.ReactNode, colorClass: string, bgColorClass: string, trend: string,
}) => (
  <div className="bg-white rounded-[8px] border border-[#eee] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
    <div>
      <p className="text-[13px] text-[#666] font-medium mb-1.5">{title}</p>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{value}</span>
        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${trend.startsWith('+') || trend.startsWith('Tăng') ? 'text-[#27ae60]' : (trend.startsWith('-') || trend.startsWith('Giảm') ? 'text-[#c0392b]' : 'text-[#94a3b8]')}`}>
          {trend}
        </span>
      </div>
    </div>
    <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 ${bgColorClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
  </div>
);

export default function Dashboard({ onXemChiTietHieuSuat, onXemPheDuyet, onXemDanhSachDon, onXemDonQuaHan, onXemDanhSachVanBan, vanBanList = [], currentRole = "can-bo" }: {
  onXemChiTietHieuSuat?: () => void;
  onXemPheDuyet?: () => void;
  /** Nhấn đúp vào 1 trạng thái trong panel "Phân loại đơn nhận" — đưa số thứ tự
   *  tab (theo tabs của Danh sách đơn) lên App để chuyển màn + chọn đúng tab. */
  onXemDanhSachDon?: (tab: number) => void;
  /** Bấm vào card/dòng "Đơn quá hạn giải quyết" — sang màn Danh sách đơn, tab
   *  "Tổng số" (0), có bật sẵn bộ lọc "Quá hạn giải quyết". */
  onXemDonQuaHan?: () => void;
  /** Bấm "Xem chi tiết" ở card "Đơn của tôi" (hoặc card "Văn bản trả lại") —
   *  sang thẳng màn Danh sách văn bản, mở sẵn tab tương ứng (mặc định "Chờ duyệt"). */
  onXemDanhSachVanBan?: (tab?: TabDS) => void;
  vanBanList?: VanBanTrinh[];
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
} = {}) {
  // Mọi vai trò quản lý (khác Cán bộ) xem khối "Thống kê đơn nhận {kỳ}" gọn
  // theo Loại án thay cho "Cảnh báo cần xử lý" + "Hiện trạng đơn" của Cán bộ,
  // và cũng là nhóm được xem 2 card "Duyệt tài liệu" (Trưởng phòng / Phó-Chánh
  // Văn phòng / Lãnh đạo Tòa / Chánh án-Phó Chánh án).
  const laVaiTroQuanLy = currentRole !== "can-bo";
  const hienThiTheDuyet = laVaiTroQuanLy;
  const { nguoi: nguoiDung } = nguoiTheoVaiTro(currentRole);
  const taiLieuChoDuyet = vanBanList.filter(v => dangChoXuLy(v.trangThai));
  const soTaiLieuCanDuyet = taiLieuChoDuyet.filter(v => nguoiDangGiu(v)?.nguoi === nguoiDung).length;
  const soTaiLieuDangChoDuyet = taiLieuChoDuyet.length;

  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year" | "custom">("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filterOfficer, setFilterOfficer] = useState("all");

  const getPeriodLabel = () => {
    switch (chartPeriod) {
      case "day": return "hôm nay";
      case "week": return "tuần này";
      case "month": return "tháng này";
      case "year": return "năm nay";
      case "custom": return "kỳ tùy chọn";
    }
  };

  const getCompareLabel = () => {
    switch (chartPeriod) {
      case "day": return "hôm qua";
      case "week": return "tuần trước";
      case "month": return "tháng trước";
      case "year": return "năm trước";
      case "custom": return "kỳ trước";
    }
  };

  // Danh sách Loại án đầy đủ — khớp LOAI_AN_OPTIONS dùng ở màn Phân công thẩm
  // phán / Nhận đơn, dùng riêng cho biểu đồ "So sánh số đơn theo loại án & kết
  // quả" (hiện với mọi vai trò, không phải chỉ 3 nhóm rút gọn của khối KPI bên trên).
  const LOAI_AN_SO_SANH = [
    "Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại",
    "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản",
  ] as const;
  // Loại án rút gọn cho khối "Thống kê đơn nhận {kỳ}" (khớp mockup 4 card).
  const LOAI_AN_DON_NHAN = ["Hình sự", "Dân sự", "Chưa xác định"] as const;
  const KET_QUA_LIST: { key: string; color: string }[] = [
    { key: "Đơn trùng", color: "#e74c3c" },
    { key: "Thụ lý mới", color: "#3b82f6" },
    { key: "Chưa đủ điều kiện", color: "#eab308" },
    { key: "Trả lại", color: "#f97316" },
    { key: "Lưu theo dõi", color: "#06b6d4" },
  ];
  // Kết quả xử lý theo Loại án — ma trận Loại án × Kết quả cho kỳ "Tuần này";
  // các kỳ khác co giãn theo cùng hệ số nhân với officerData bên dưới để nhất
  // quán trong toàn Dashboard.
  const LOAI_AN_KET_QUA_TUAN: Record<typeof LOAI_AN_SO_SANH[number], Record<string, number>> = {
    "Hình sự": { "Đơn trùng": 3, "Thụ lý mới": 2, "Chưa đủ điều kiện": 1, "Trả lại": 1, "Lưu theo dõi": 1 },
    "Dân sự": { "Đơn trùng": 2, "Thụ lý mới": 1, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Lưu theo dõi": 1 },
    "Hành chính": { "Đơn trùng": 1, "Thụ lý mới": 1, "Chưa đủ điều kiện": 1, "Trả lại": 0, "Lưu theo dõi": 0 },
    "Kinh doanh thương mại": { "Đơn trùng": 0, "Thụ lý mới": 1, "Chưa đủ điều kiện": 0, "Trả lại": 1, "Lưu theo dõi": 0 },
    "Hôn nhân gia đình": { "Đơn trùng": 1, "Thụ lý mới": 1, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Lưu theo dõi": 0 },
    "Lao động": { "Đơn trùng": 0, "Thụ lý mới": 0, "Chưa đủ điều kiện": 1, "Trả lại": 0, "Lưu theo dõi": 0 },
    "Sở hữu trí tuệ": { "Đơn trùng": 0, "Thụ lý mới": 0, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Lưu theo dõi": 1 },
    "Phá sản": { "Đơn trùng": 0, "Thụ lý mới": 1, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Lưu theo dõi": 0 },
  };
  const soSanhMult = chartPeriod === "day" ? 0.1 : chartPeriod === "month" ? 4 : chartPeriod === "year" ? 40 : chartPeriod === "custom" ? 0.5 : 1;
  const loaiAnKetQua = LOAI_AN_SO_SANH.map(loaiAn => ({
    loaiAn,
    ketQua: KET_QUA_LIST.map(kq => ({
      ...kq,
      soLuong: Math.round(LOAI_AN_KET_QUA_TUAN[loaiAn][kq.key] * soSanhMult),
    })),
  }));
  const maxSoSanh = Math.max(1, ...loaiAnKetQua.flatMap(l => l.ketQua.map(k => k.soLuong)));
  // Đơn nhận theo Loại án (khớp báo cáo Phòng HCTP: 27 đơn nhận trong tuần) —
  // nguồn cho khối "Thống kê đơn nhận {kỳ}" của các vai trò quản lý.
  const DON_NHAN_LOAI_AN_TUAN: Record<typeof LOAI_AN_DON_NHAN[number], number> = {
    "Hình sự": 14, "Dân sự": 10, "Chưa xác định": 3,
  };
  const DON_NHAN_META: Record<typeof LOAI_AN_DON_NHAN[number], { icon: React.ReactNode; bg: string; color: string }> = {
    "Hình sự": { icon: <Gavel size={24} />, bg: "bg-[#eff6ff]", color: "text-[#3b82f6]" },
    "Dân sự": { icon: <Scale size={24} />, bg: "bg-[#f0fdf4]", color: "text-[#16a34a]" },
    "Chưa xác định": { icon: <HelpCircle size={24} />, bg: "bg-[#f5f3ff]", color: "text-[#8b5cf6]" },
  };
  const donNhanLoaiAn = LOAI_AN_DON_NHAN.map(loaiAn => ({
    loaiAn, soLuong: Math.round(DON_NHAN_LOAI_AN_TUAN[loaiAn] * soSanhMult),
  }));
  const tongDonNhan = donNhanLoaiAn.reduce((s, l) => s + l.soLuong, 0) || 1;
  // Vụ chuyên môn phụ trách từng Loại án — dùng để tô màu theo Vụ trên thanh
  // "Kết quả xử lý đơn", cho biết mỗi kết quả (đơn trùng, thụ lý mới...) được
  // điều chuyển sang những Vụ/đơn vị nào. 4 Vụ GĐKT thật của TANDTC, các loại án
  // còn lại (KD-TM, HN-GĐ, Lao động, SHTT, Phá sản) đều về chung 1 Vụ GĐKT.
  const VU_THEO_LOAI_AN: Record<typeof LOAI_AN_SO_SANH[number], string> = {
    "Hình sự": "Vụ GĐKT Hình sự",
    "Dân sự": "Vụ GĐKT Dân sự",
    "Hành chính": "Vụ GĐKT Hành chính",
    "Kinh doanh thương mại": "Vụ GĐKT KD-TM & khác",
    "Hôn nhân gia đình": "Vụ GĐKT KD-TM & khác",
    "Lao động": "Vụ GĐKT KD-TM & khác",
    "Sở hữu trí tuệ": "Vụ GĐKT KD-TM & khác",
    "Phá sản": "Vụ GĐKT KD-TM & khác",
  };
  const VU_LIST = ["Vụ GĐKT Hình sự", "Vụ GĐKT Dân sự", "Vụ GĐKT Hành chính", "Vụ GĐKT KD-TM & khác"] as const;
  const VU_COLOR: Record<typeof VU_LIST[number], string> = {
    "Vụ GĐKT Hình sự": "#ef4444",
    "Vụ GĐKT Dân sự": "#3b82f6",
    "Vụ GĐKT Hành chính": "#22c55e",
    "Vụ GĐKT KD-TM & khác": "#f59e0b",
  };
  // Tổng theo từng loại kết quả (cộng dồn qua mọi loại án), kèm phân bổ theo
  // Vụ nhận điều chuyển — nguồn cho panel xếp hạng bên phải.
  const ketQuaTong = KET_QUA_LIST.map(kq => {
    const phanBoVu = VU_LIST.map(vu => ({
      vu,
      soLuong: loaiAnKetQua.reduce((s, l) => (
        VU_THEO_LOAI_AN[l.loaiAn] === vu ? s + (l.ketQua.find(k => k.key === kq.key)?.soLuong ?? 0) : s
      ), 0),
    })).filter(p => p.soLuong > 0);
    return { ...kq, soLuong: phanBoVu.reduce((s, p) => s + p.soLuong, 0), phanBoVu };
  }).sort((a, b) => b.soLuong - a.soLuong);
  const tongDonSoSanh = ketQuaTong.reduce((s, k) => s + k.soLuong, 0) || 1;
  const maxKetQuaTong = Math.max(1, ...ketQuaTong.map(k => k.soLuong));

  const getOfficerData = () => {
    let mult = 1;
    if (chartPeriod === 'day') mult = 0.1;
    if (chartPeriod === 'month') mult = 4;
    if (chartPeriod === 'year') mult = 40;
    if (chartPeriod === 'custom') mult = 0.5;

    return [
      { name: "Nguyễn Văn An", role: "Thẩm phán bậc 1", total: Math.max(1, Math.round(55 * mult)), inProgress: Math.max(1, Math.round(15 * mult)), completed: Math.max(0, Math.round(40 * mult)), avatar: "N" },
      { name: "Trần Thị Bình", role: "Thẩm phán bậc 2", total: Math.max(1, Math.round(42 * mult)), inProgress: Math.max(1, Math.round(12 * mult)), completed: Math.max(0, Math.round(30 * mult)), avatar: "T" },
      { name: "Lê Minh Tuấn", role: "Thẩm phán tối cao", total: Math.max(1, Math.round(38 * mult)), inProgress: Math.max(1, Math.round(8 * mult)), completed: Math.max(0, Math.round(30 * mult)), avatar: "L" },
      { name: "Phạm Hải Yến", role: "Thẩm phán bậc 1", total: Math.max(1, Math.round(35 * mult)), inProgress: Math.max(1, Math.round(10 * mult)), completed: Math.max(0, Math.round(25 * mult)), avatar: "P" },
      { name: "Hoàng Công Cường", role: "Thẩm phán bậc 3", total: Math.max(1, Math.round(28 * mult)), inProgress: Math.max(1, Math.round(5 * mult)), completed: Math.max(0, Math.round(23 * mult)), avatar: "H" },
    ];
  };

  const officerData = getOfficerData();
  const displayedOfficers = filterOfficer === "all" ? officerData : officerData.filter(o => o.name === filterOfficer);

  // Data for new "Loại án" widget
  const caseTypes = [
    { label: "Dân sự", percent: 45, color: "bg-[#3498db]" },
    { label: "Hình sự", percent: 30, color: "bg-[#e74c3c]" },
    { label: "Hành chính", percent: 15, color: "bg-[#f39c12]" },
    { label: "Kinh doanh - Thương mại", percent: 10, color: "bg-[#9b59b6]" },
  ];

  // Đơn theo hình thức tiếp nhận — số liệu ảo, cộng đúng bằng "Tổng số đơn nhận"
  // kỳ Tuần này (27) để nhất quán với khối KPI phía trên.
  const hinhThucTiepNhan = [
    { label: "Trực tiếp", value: 12, icon: <UserCheck size={13} />, color: "#3b82f6" },
    { label: "Bưu điện", value: 9, icon: <Mail size={13} />, color: "#f59e0b" },
    { label: "Trực tuyến", value: 6, icon: <Globe size={13} />, color: "#22c55e" },
  ];
  const maxHinhThuc = Math.max(...hinhThucTiepNhan.map(h => h.value));

  // Các nhóm hồ sơ cần chú ý khác — dựa theo đúng các trường của Danh sách đơn
  // (laKhangNghi, choYKienLD, ycbsSo) chưa có mặt ở khối KPI/cảnh báo phía trên.
  const hoSoCanChuYKhac = [
    { label: "Hồ sơ kháng nghị đang xử lý", value: 3, icon: <Scale size={13} />, color: "#8b5cf6" },
    { label: "Chờ ý kiến lãnh đạo", value: 2, icon: <FileQuestion size={13} />, color: "#e67e22" },
    { label: "Yêu cầu bổ sung chưa phản hồi", value: 4, icon: <Send size={13} />, color: "#0ea5e9" },
  ];

  // Đơn quá hạn giải quyết — số liệu ảo, khớp đúng 10 đơn đã gắn cờ quaHanNam
  // trong SAMPLE_ROWS (Danh sách đơn) để khi bấm "Xem tất cả" sang tab Tổng số
  // + bộ lọc "Quá hạn giải quyết" thì đúng bằng 10 dòng này.
  const donQuaHan = [
    { maDon: "7038", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNam: 6.2 },
    { maDon: "7037", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 4.9 },
    { maDon: "7035", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Đã thụ lý", quaHanNam: 3.3 },
    { maDon: "7034", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNam: 2.8 },
    { maDon: "7021", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", quaHanNam: 2.1 },
    { maDon: "7022", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 1.7 },
    { maDon: "7027", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 1.4 },
    { maDon: "7028", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Thụ lý mới", quaHanNam: 1.1 },
    { maDon: "7048", canBoXuLy: "Nguyễn Minh An", trangThai: "Thụ lý mới", quaHanNam: 0.6 },
    { maDon: "7031", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 0.3 },
  ];
  // Đơn sắp đến hạn — chưa quá hạn nên KHÔNG cộng vào donQuaHan.length, chỉ nêu
  // để nhắc xử lý trước khi rơi vào nhóm trên.
  const soDonSapDenHan = 5;

  // "Hiện trạng đơn" — số liệu ảo (đếm trực tiếp trên danh sách đơn tại thời
  // điểm hiện tại theo tinh thần thiết kế, không phải số theo kỳ như khối cũ).
  // daGiaiQuyet + chuaGiaiQuyet luôn = tổng trạng thái thụ lý bên dưới, và
  // quaHan luôn ⊆ chuaGiaiQuyet, để 2 khối số không bao giờ lệch nhau.
  const [phamViHienTrang, setPhamViHienTrang] = useState<"toi" | "phong">("toi");
  const HIEN_TRANG_DON: Record<"toi" | "phong", {
    daGiaiQuyet: number; chuaGiaiQuyet: number; quaHan: number; sapDenHan: number;
    trangThai: { nhan: string; mau: string; tab: number; soLuong: number }[];
  }> = {
    toi: {
      daGiaiQuyet: 5, chuaGiaiQuyet: 7, quaHan: 5, sapDenHan: 1,
      trangThai: [
        { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 7 },
        { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 0 },
        { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 1 },
        { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 2 },
        { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 2 },
        { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 0 },
      ],
    },
    phong: {
      daGiaiQuyet: 20, chuaGiaiQuyet: 28, quaHan: 10, sapDenHan: 5,
      trangThai: [
        { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 26 },
        { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 4 },
        { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 6 },
        { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 5 },
        { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 6 },
        { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 1 },
      ],
    },
  };
  const hienTrang = HIEN_TRANG_DON[phamViHienTrang];
  const tongDonHienTrang = hienTrang.daGiaiQuyet + hienTrang.chuaGiaiQuyet;
  const pctDaGiaiQuyet = Math.round((hienTrang.daGiaiQuyet / tongDonHienTrang) * 100);
  const pctChuaGiaiQuyet = 100 - pctDaGiaiQuyet;
  const pctQuaHan = Math.round((hienTrang.quaHan / hienTrang.chuaGiaiQuyet) * 100);

  // Văn bản BỊ TRẢ LẠI mà chính cán bộ đang đăng nhập là người tạo (nguoiTao)
  // — tức "tôi" là người phải sửa lại. Tính thẳng từ vanBanList thật (không
  // phải số ảo) nên số ngày "Đã chờ sửa" luôn khớp với mốc TraLai gần nhất
  // trong lichSu.
  const vanBanTraLai = useMemo(() => {
    const soNgayTu = (thoiGian?: string) => {
      const m = thoiGian?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      if (!m) return 0;
      const [, d, mo, y] = m;
      const ngayTra = new Date(Number(y), Number(mo) - 1, Number(d));
      return Math.max(0, Math.floor((Date.now() - ngayTra.getTime()) / 86400000));
    };
    return vanBanList
      .filter(v => v.trangThai === "BiTraLai")
      .map(v => {
        const moc = [...v.lichSu].reverse().find(m => m.hanhDong === "TraLai");
        return { vb: v, traLaiBoi: moc?.nguoi ?? "", soNgay: soNgayTu(moc?.thoiGian) };
      })
      .sort((a, b) => b.soNgay - a.soNgay);
  }, [vanBanList]);

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      {/* Cảnh báo cần xử lý — chỉ vai trò Cán bộ; các vai trò quản lý xem khối
          "Thống kê đơn nhận {kỳ}" gọn hơn thay cho khối này (xem bên dưới, sau
          Filters). 2 bảng tách riêng vì đòi hai hành động khác nhau: đơn quá
          hạn cần được XỬ LÝ TIẾP, còn văn bản bị trả lại cần được SỬA LẠI rồi
          trình lại. Gộp chung sẽ nhoè mất sự khác biệt đó. */}
      {!laVaiTroQuanLy && (
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#c0392b]" />
            Cảnh báo cần xử lý
          </h2>
          <span className="text-[11px] text-[#94a3b8]">Hai loại tách riêng vì đòi hai hành động khác nhau</span>
        </div>
        <div className="grid grid-cols-2 gap-5 p-5">
          {/* Đơn quá hạn giải quyết */}
          <div className="border border-[#eee] rounded-[8px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#c0392b]" />
                Đơn quá hạn giải quyết
              </h3>
              <span className="bg-[#fee2e2] text-[#c0392b] text-[11px] font-bold px-2 py-0.5 rounded-full">{donQuaHan.length}</span>
            </div>
            <div className="p-3 space-y-2">
              {donQuaHan.slice(0, 3).map(d => (
                <div key={d.maDon} onClick={() => onXemDonQuaHan?.()}
                  className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#c0392b]/30 hover:bg-[#fef2f2]/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#c0392b] transition-colors">Đơn Mã {d.maDon}</span>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#fee2e2] text-[#c0392b] whitespace-nowrap">
                      Quá {d.quaHanNam.toFixed(1).replace(".", ",")} năm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[#64748b]">Cán bộ xử lý: {d.canBoXuLy} · {d.trangThai}</p>
                    <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                  </div>
                </div>
              ))}
              {soDonSapDenHan > 0 && (
                <div className="px-3 py-2 rounded-[6px] bg-[#fffbeb] border border-[#fde68a] text-[12px] text-[#92400e]">
                  Thêm <b>{soDonSapDenHan}</b> đơn sắp đến hạn — nên xử lý trước khi thành quá hạn.
                </div>
              )}
            </div>
            <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
              <button onClick={() => onXemDonQuaHan?.()} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                Xem tất cả {donQuaHan.length} mục
              </button>
            </div>
          </div>

          {/* Đơn trả lại, chưa thấy sửa */}
          <div className="border border-[#eee] rounded-[8px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                <RotateCcw size={16} className="text-[#e67e22]" />
                Đơn trả lại, chưa thấy sửa
              </h3>
              <span className="bg-[#ffedd5] text-[#c2610a] text-[11px] font-bold px-2 py-0.5 rounded-full">{vanBanTraLai.length}</span>
            </div>
            <div className="p-3 space-y-2 flex-1">
              {vanBanTraLai.length === 0 && (
                <p className="text-[12px] text-[#94a3b8] py-6 text-center">Không có đơn nào đang chờ sửa lại.</p>
              )}
              {vanBanTraLai.slice(0, 3).map(({ vb, traLaiBoi, soNgay }) => (
                <div key={vb.id} onClick={() => onXemDanhSachVanBan?.("BiTraLai")}
                  className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#e67e22]/30 hover:bg-[#fff7ed]/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#e67e22] transition-colors line-clamp-1">{vb.trichYeu}</span>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#ffedd5] text-[#c2610a] whitespace-nowrap">
                      Đã {soNgay} ngày
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] text-[#64748b] truncate">Người phải sửa: {vb.nguoiTao} · Trả lại bởi {traLaiBoi}</p>
                    <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#e67e22] transition-colors flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
              <button onClick={() => onXemDanhSachVanBan?.("BiTraLai")} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                Xem tất cả {vanBanTraLai.length} mục
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 1. Hiện trạng đơn (Cán bộ) / Thống kê đơn nhận (vai trò quản lý) — đếm
          trực tiếp trên danh sách đơn tại thời điểm hiện tại, thay cho khối
          "Tình hình xử lý đơn {kỳ}" trước đây (số theo kỳ ngày/tuần/tháng —
          không hợp với ý "cập nhật theo thời gian thực"). Các vai trò quản lý
          xem bản gọn hơn theo Loại án, khớp mockup "Thống kê đơn nhận tuần này". */}
      {laVaiTroQuanLy ? (
      <div>
        <h2 className="text-[16px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-[#8b1a1a]" />
          Thống kê đơn nhận {getPeriodLabel()}
        </h2>
        <div className="grid grid-cols-4 gap-5">
          <KPICardDon
            title="Tổng đơn nhận"
            value={String(tongDonNhan)}
            trend={`+8% so với ${getCompareLabel()}`}
            icon={<FileText size={24} />}
            bgColorClass="bg-[#eff6ff]"
            colorClass="text-[#3b82f6]"
          />
          {donNhanLoaiAn.map(l => (
            <KPICardDon
              key={l.loaiAn}
              title={l.loaiAn}
              value={String(l.soLuong)}
              trend={`${((l.soLuong / tongDonNhan) * 100).toFixed(1).replace(".", ",")}% tổng số đơn`}
              icon={DON_NHAN_META[l.loaiAn].icon}
              bgColorClass={DON_NHAN_META[l.loaiAn].bg}
              colorClass={DON_NHAN_META[l.loaiAn].color}
            />
          ))}
        </div>
      </div>
      ) : (
      <div>
        <h2 className="text-[16px] font-bold text-[#0f172a] mb-1 flex items-center gap-2">
          <ListChecks size={18} className="text-[#8b1a1a]" />
          Hiện trạng đơn
        </h2>
        <p className="text-[12px] text-[#94a3b8] mb-4">
          Đếm trực tiếp trên danh sách đơn tại thời điểm hiện tại — bấm vào số nào mở đúng danh sách đó.
        </p>

        <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-1.5">
                <Clock size={14} className="text-[#8b1a1a]" />
                Tiến độ giải quyết đơn
              </span>
              <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
                {(["toi", "phong"] as const).map(pham => (
                  <button
                    key={pham}
                    onClick={() => setPhamViHienTrang(pham)}
                    className={`px-3 py-1 text-[12px] font-medium rounded-[4px] transition-all duration-200 ${phamViHienTrang === pham ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]" : "text-[#64748b] hover:text-[#0f172a] border border-transparent"}`}
                  >
                    {pham === "toi" ? "Của tôi" : "Toàn phòng"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#94a3b8]">
                {phamViHienTrang === "toi" ? "Đơn do tôi nhập, chưa giải quyết xong" : "Đơn toàn phòng, chưa giải quyết xong"} · cập nhật theo thời gian thực
              </span>
              <button onClick={onXemChiTietHieuSuat} className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1 whitespace-nowrap">
                Xem hiệu suất chi tiết <ArrowRight size={11} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Tổng số đơn */}
            <div className="border border-[#eee] rounded-[8px] p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[13px] text-[#666] font-medium">Tổng số đơn</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#eff6ff] text-[#3b82f6] flex-shrink-0">
                  <Inbox size={17} />
                </div>
              </div>
              <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{tongDonHienTrang}</span>
              <div className="flex items-center gap-0.5 h-[7px] rounded-full overflow-hidden mt-3 mb-2">
                <div className="h-full bg-[#22c55e]" style={{ width: `${pctDaGiaiQuyet}%` }} />
                <div className="h-full bg-[#f97316]" style={{ width: `${pctChuaGiaiQuyet}%` }} />
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#64748b] mb-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" />Đã giải quyết</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316]" />Chưa giải quyết</span>
              </div>
              <button onClick={() => onXemDanhSachDon?.(phamViHienTrang === "toi" ? 1 : 0)} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
                Xem danh sách <ArrowRight size={11} />
              </button>
            </div>

            {/* Đã giải quyết xong */}
            <div className="border border-[#eee] rounded-[8px] p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[13px] text-[#666] font-medium">Đã giải quyết xong</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f0fdf4] text-[#16a34a] flex-shrink-0">
                  <CheckCircle2 size={17} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{hienTrang.daGiaiQuyet}</span>
                <span className="text-[12px] font-semibold text-[#16a34a]">{pctDaGiaiQuyet}% tổng số đơn</span>
              </div>
              <p className="text-[12px] text-[#64748b] mb-3">Đơn đã trả lại, không thụ lý, hoặc đã phân công và chuyển sang Vụ chuyên môn.</p>
              <button onClick={() => onXemDanhSachDon?.(6)} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
                Xem danh sách <ArrowRight size={11} />
              </button>
            </div>

            {/* Chưa giải quyết */}
            <div className="border border-[#eee] rounded-[8px] p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[13px] text-[#666] font-medium">Chưa giải quyết</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#fff7ed] text-[#f97316] flex-shrink-0">
                  <Clock size={17} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{hienTrang.chuaGiaiQuyet}</span>
                <span className="text-[12px] font-semibold text-[#e67e22]">{pctChuaGiaiQuyet}% tổng số đơn</span>
              </div>
              <div className="rounded-[6px] bg-[#fef2f2] border border-[#fecaca] px-3 py-2 mb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[#c0392b] flex items-center gap-1"><AlertTriangle size={12} /> Quá hạn giải quyết</span>
                  <span className="text-[13px] font-bold text-[#c0392b]">{hienTrang.quaHan}</span>
                </div>
                <p className="text-[11px] text-[#c0392b]/80">
                  Chiếm {pctQuaHan}% số đơn chưa giải quyết · còn {hienTrang.sapDenHan} đơn sắp đến hạn
                </p>
              </div>
              <button onClick={() => onXemDonQuaHan?.()} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
                Xem danh sách <ArrowRight size={11} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 mb-3">
            <span className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide">Đơn theo trạng thái thụ lý</span>
            <span className="text-[11px] text-[#94a3b8]">Bấm vào từng trạng thái để mở danh sách đơn tương ứng</span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {hienTrang.trangThai.map(t => (
              <button
                key={t.nhan}
                onClick={() => onXemDanhSachDon?.(t.tab)}
                className="text-left border border-[#eee] rounded-[8px] p-3 hover:border-[#cbd5e1] hover:bg-[#f8fafc] transition-colors group"
              >
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#475569] mb-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.mau }} />
                  {t.nhan}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[20px] font-bold text-[#1d2e4f] leading-none">{t.soLuong}</span>
                  <ArrowRight size={13} className="text-[#cbd5e1] group-hover:text-[#3b82f6] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Duyệt tài liệu — chỉ Trưởng phòng / Phó Chánh án-Chánh án / Lãnh đạo Tòa */}
      {hienThiTheDuyet && (
        <div>
          <h2 className="text-[16px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-[#8b1a1a]" />
            Duyệt tài liệu
          </h2>
          <div className="grid grid-cols-4 gap-5">
            <KPICardCoLink
              title="Tài liệu cần duyệt"
              value={String(soTaiLieuCanDuyet)}
              trend="Đang chờ bạn xử lý"
              icon={<FileCheck size={24} />}
              bgColorClass="bg-[#fef3e2]"
              colorClass="text-[#f39c12]"
              onXemChiTiet={onXemPheDuyet}
            />
            <KPICardCoLink
              title="Tài liệu đang chờ duyệt"
              value={String(soTaiLieuDangChoDuyet)}
              trend="Đã gửi, đang trong luồng duyệt"
              icon={<Hourglass size={24} />}
              bgColorClass="bg-[#e8f4ff]"
              colorClass="text-[#1a73e8]"
              onXemChiTiet={onXemPheDuyet}
            />
          </div>
        </div>
      )}

      {/* Filters — đặt ngay trên 2 biểu đồ dùng chartPeriod/filterOfficer bên dưới
          (So sánh số đơn theo loại án & kết quả, Kết quả xử lý đơn) thay vì trên
          cùng trang, vì "Hiện trạng đơn" (Cán bộ) không phụ thuộc kỳ lọc này. */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-[8px] border border-[#e2e8f0] shadow-sm mb-5">
        <div className="flex items-center gap-5 flex-wrap w-full">
          <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
            {(["day", "week", "month", "year", "custom"] as const).map((period, idx) => {
              const labels = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay", "Tùy chọn"];
              return (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3.5 py-1.5 text-[12px] font-medium rounded-[4px] transition-all duration-200 ${chartPeriod === period ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]" : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 border border-transparent"}`}
                >
                  {labels[idx]}
                </button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-[#cbd5e1]"></div>

          {chartPeriod === "custom" && (
            <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-300">
              <label className="text-[13px] font-medium text-[#475569]">Từ:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="h-[32px] px-2.5 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-[#1e293b]"
              />
              <span className="text-[#94a3b8]">-</span>
              <label className="text-[13px] font-medium text-[#475569]">Đến:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="h-[32px] px-2.5 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-[#1e293b]"
              />
            </div>
          )}

          <div className="flex-1"></div>

          {/* Lọc theo Cán bộ — chỉ vai trò quản lý; Cán bộ chỉ xem dữ liệu của
              chính mình nên không cần lọc theo người khác. */}
          {laVaiTroQuanLy && (
          <div className="flex items-center gap-2.5">
            <label className="text-[13px] font-medium text-[#475569]">Lọc theo Cán bộ:</label>
            <select
              value={filterOfficer}
              onChange={e => setFilterOfficer(e.target.value)}
              className="h-[32px] px-3 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] bg-white min-w-[220px] text-[#1e293b] cursor-pointer"
            >
              <option value="all">Tất cả cán bộ</option>
              {officerData.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
            </select>
          </div>
          )}
        </div>
      </div>

      {/* ROW 2: So sánh số đơn theo loại án & kết quả — thay biểu đồ Vụ GĐKT theo
          ngày (đã có ở "Hiện trạng đơn"/"Đơn theo cán bộ") bằng góc nhìn loại án ×
          kết quả xử lý; panel bên phải xếp hạng kết quả nay thay "Cần chú ý / Quá
          hạn" — mục đó đã có bản đầy đủ hơn ở card "Đơn quá hạn giải quyết" trên đầu. */}
      <div className="grid grid-cols-3 gap-5">
        {/* So sánh số đơn theo loại án & kết quả */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3b82f6]" />
              So sánh số đơn theo loại án & kết quả
            </h3>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-end min-h-[320px]">
            <div className="flex items-end justify-between h-[230px] gap-2 pt-10 relative">
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[11px] text-[#94a3b8] pb-1 font-medium">
                {[maxSoSanh, Math.round(maxSoSanh * 0.75), Math.round(maxSoSanh * 0.5), Math.round(maxSoSanh * 0.25), 0].map((v, i) => (
                  <span key={i}>{v}</span>
                ))}
              </div>

              <div className="absolute left-10 right-0 top-1 bottom-6 border-l border-b border-[#e2e8f0]">
                <div className="absolute w-full top-1/4 border-t border-dashed border-[#e2e8f0]"></div>
                <div className="absolute w-full top-1/2 border-t border-dashed border-[#e2e8f0]"></div>
                <div className="absolute w-full top-3/4 border-t border-dashed border-[#e2e8f0]"></div>
              </div>

              <div className="ml-10 w-full flex justify-evenly items-end h-full z-10 pb-[34px]">
                {loaiAnKetQua.map(nhom => (
                  <div key={nhom.loaiAn} className="flex flex-col items-center gap-1 relative h-full justify-end px-0.5">
                    <div className="flex items-end gap-[3px] h-full">
                      {nhom.ketQua.map(kq => {
                        const fillPct = (kq.soLuong / maxSoSanh) * 100;
                        return (
                          <div key={kq.key} title={`${kq.key}: ${kq.soLuong}`} className="relative w-[12px] h-full">
                            {kq.soLuong > 0 && (
                              <span
                                className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#0f172a] whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${fillPct}% + 4px)` }}
                              >
                                {kq.soLuong}
                              </span>
                            )}
                            <div
                              className="absolute inset-0 rounded-t-[3px] overflow-hidden"
                            >
                              <div
                                className="absolute bottom-0 w-full transition-all duration-700 hover:brightness-110"
                                style={{ height: `${fillPct}%`, backgroundColor: kq.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[11px] leading-tight font-semibold text-[#334155] absolute bottom-0 translate-y-full mt-2 w-full text-center">{nhom.loaiAn}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-x-5 gap-y-2 mt-10 pt-4 border-t border-[#f1f5f9] flex-wrap">
              {KET_QUA_LIST.map(kq => (
                <div key={kq.key} className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                  <div className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: kq.color }}></div>
                  {kq.key}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kết quả xử lý đơn — mỗi thanh tô theo Vụ GĐKT nhận điều chuyển, cho
            biết trong số đơn trùng/thụ lý mới/... có bao nhiêu chuyển sang Vụ
            nào, kèm % trên tổng của chính kết quả đó (hover xem chi tiết). */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wide">Kết quả xử lý đơn</h3>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Tô màu theo Vụ GĐKT nhận điều chuyển — di chuột xem chi tiết</p>
          </div>
          <div className="flex-1 p-4 space-y-3.5">
            {ketQuaTong.map(kq => (
              <div key={kq.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] font-medium text-[#334155]">{kq.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[16px] bg-[#f1f5f9] rounded-[3px] overflow-hidden flex">
                    {kq.phanBoVu.map(p => (
                      <div
                        key={p.vu}
                        title={`${p.vu}: ${p.soLuong} (${((p.soLuong / (kq.soLuong || 1)) * 100).toFixed(1)}%)`}
                        className="h-full transition-all duration-700 first:rounded-l-[3px] last:rounded-r-[3px]"
                        style={{ width: `${(p.soLuong / maxKetQuaTong) * 100}%`, backgroundColor: VU_COLOR[p.vu] }}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] font-semibold text-[#0f172a] whitespace-nowrap w-[74px] text-right">
                    {kq.soLuong} ({((kq.soLuong / tongDonSoSanh) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-x-3 gap-y-1.5 flex-wrap px-4 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px]">
            {VU_LIST.map(vu => (
              <div key={vu} className="flex items-center gap-1.5 text-[11px] font-medium text-[#475569]">
                <span className="w-2.5 h-2.5 rounded-[2px] flex-shrink-0" style={{ backgroundColor: VU_COLOR[vu] }} />
                {vu}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Hình thức tiếp nhận đơn + Cơ cấu loại hình án + Hiệu suất cán bộ
          — gộp chung 1 hàng lưới 4 cột (thay vì 2 hàng riêng, hàng đầu chỉ có 1
          thẻ 1/3 để trống 2/3 khoảng trắng) — chỉ vai trò quản lý (Trưởng phòng
          trở lên). */}
      {laVaiTroQuanLy && (
      <div className="grid grid-cols-4 gap-5">
        {/* Hình thức tiếp nhận đơn + hồ sơ cần chú ý khác */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <Inbox size={18} className="text-[#8b1a1a]" />
              Hình thức tiếp nhận đơn
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {hinhThucTiepNhan.map(h => (
              <div key={h.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#334155]">{h.icon} {h.label}</span>
                  <span className="text-[13px] font-bold text-[#0f172a]">{h.value}</span>
                </div>
                <div className="w-full h-[7px] bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(h.value / maxHinhThuc) * 100}%`, backgroundColor: h.color }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3.5 bg-[#f8fafc] border-t border-[#f1f5f9] rounded-b-[8px] space-y-2 mt-auto">
            {hoSoCanChuYKhac.map(s => (
              <div key={s.label} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 font-medium text-[#475569]">{s.icon} {s.label}</span>
                <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phân loại án */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <PieChart size={18} className="text-[#8b1a1a]" />
              Cơ cấu loại hình án
            </h3>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center space-y-5">
            {caseTypes.map((type, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#334155]">{type.label}</span>
                  <span className="text-[13px] font-bold text-[#0f172a]">{type.percent}%</span>
                </div>
                <div className="w-full h-[8px] bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${type.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${type.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Đơn theo cán bộ */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <Users size={18} className="text-[#8b1a1a]" />
              Hiệu suất cán bộ {getPeriodLabel()}
            </h3>
            <button onClick={onXemChiTietHieuSuat} className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1">
              Xem chi tiết
            </button>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto">
            {displayedOfficers.map((officer, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-[#f8fafc] rounded-[6px] transition-colors border-b border-[#f1f5f9] last:border-0 group cursor-pointer">
                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1e293b] to-[#334155] text-white flex items-center justify-center font-bold text-[16px] flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  {officer.avatar}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1e293b] text-[14px] truncate">{officer.name}</span>
                    <span className="font-bold text-[#0f172a] text-[14px] bg-[#f1f5f9] px-2 py-0.5 rounded-[4px]">Tổng: {officer.total}</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#64748b] mb-2">{officer.role}</div>
                  
                  <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      className="bg-[#22c55e] h-full transition-all duration-700" 
                      style={{ width: `${(officer.completed / officer.total) * 100}%` }}
                      title={`Đã xử lý: ${officer.completed}`}
                    ></div>
                    <div 
                      className="bg-[#eab308] h-full transition-all duration-700" 
                      style={{ width: `${(officer.inProgress / officer.total) * 100}%` }}
                      title={`Đang giải quyết: ${officer.inProgress}`}
                    ></div>
                  </div>
                </div>
                <div className="w-[80px] text-right">
                  <div className="text-[11px] font-bold text-[#22c55e] mb-1">{Math.round((officer.completed/officer.total)*100)}% H.Thành</div>
                  <div className="text-[10px] text-[#64748b]">{officer.inProgress} đang xử lý</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3.5 bg-[#f8fafc] border-t border-[#f1f5f9] rounded-b-[8px]">
            <div className="flex items-center justify-center gap-6 text-[12px] font-medium text-[#475569]">
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#22c55e]"></div> Đã xử lý</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#eab308]"></div> Đang giải quyết</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
