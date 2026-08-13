import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Users,
  Calendar,
  PieChart,
  ArrowRight,
  FileCheck,
  Inbox,
  Mail,
  Globe,
  UserCheck,
  Building2,
  Scale,
  ListChecks,
  RotateCcw,
  Clock,
  CheckCircle2,
  FileText,
  Gavel,
  Layers,
  XCircle,
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
  /** Bấm "Xem chi tiết" ở card "Tài liệu cần duyệt" / "Tài liệu đã duyệt" —
   *  sang màn Phê duyệt và đề xuất, mở sẵn tab tương ứng. */
  onXemPheDuyet?: (tab?: "cho_duyet" | "da_duyet") => void;
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
  const soTaiLieuDaDuyet = vanBanList.filter(v => v.trangThai === "DaBanHanh").length;

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
  // phán / Nhận đơn, dùng riêng cho bảng "So sánh số đơn theo loại án & kết
  // quả xử lý" (hiện với mọi vai trò, không phải chỉ 3 nhóm rút gọn của khối KPI bên trên).
  const LOAI_AN_SO_SANH = [
    "Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại",
    "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản",
  ] as const;
  // Loại án rút gọn cho khối "Thống kê đơn nhận {kỳ}" (khớp mockup 4 card).
  // Card thứ 3 gộp mọi loại án còn lại (Hành chính, KD-TM, HN-GĐ, Lao động,
  // SHTT, Phá sản...) nên đặt tên "Loại án khác" thay vì "Chưa xác định".
  const LOAI_AN_DON_NHAN = ["Hình sự", "Dân sự", "Loại án khác"] as const;
  // "Kết quả xử lý đơn" — đủ 9 trạng thái xử lý thật của đơn: 5 cột đầu là kết
  // quả khi "Nơi chuyển đến" = Nội bộ (Thụ lý mới, Thụ lý mới trùng thẩm phán,
  // Xin ý kiến lãnh đạo, Không thụ lý, Đơn không đủ điều kiện); 4 cột còn lại
  // là các giá trị "Nơi chuyển đến" khác (Tòa khác, Ngoài tòa án, Trả lại đơn,
  // Lưu theo dõi). 1 hàng tiêu đề duy nhất, mỗi cột kèm icon riêng — khớp
  // format bảng báo cáo "So sánh số đơn theo loại án và kết quả xử lý".
  const KET_QUA_LIST = [
    "Thụ lý mới", "Thụ lý mới trùng thẩm phán", "Xin ý kiến lãnh đạo", "Không thụ lý", "Đơn không đủ điều kiện",
    "Tòa khác", "Ngoài tòa án", "Trả lại đơn", "Lưu theo dõi",
  ] as const;
  const KET_QUA_ICON: Record<typeof KET_QUA_LIST[number], React.ReactNode> = {
    "Thụ lý mới": <FileText size={13} />,
    "Thụ lý mới trùng thẩm phán": <Layers size={13} />,
    "Xin ý kiến lãnh đạo": <Users size={13} />,
    "Không thụ lý": <XCircle size={13} />,
    "Đơn không đủ điều kiện": <AlertTriangle size={13} />,
    "Tòa khác": <Building2 size={13} />,
    "Ngoài tòa án": <Globe size={13} />,
    "Trả lại đơn": <RotateCcw size={13} />,
    "Lưu theo dõi": <Clock size={13} />,
  };
  // Kết quả xử lý theo Loại án — ma trận Loại án × Kết quả cho kỳ "Tuần này";
  // các kỳ khác co giãn theo cùng hệ số nhân với officerData bên dưới để nhất
  // quán trong toàn Dashboard.
  const LOAI_AN_KET_QUA_TUAN: Record<typeof LOAI_AN_SO_SANH[number], Record<string, number>> = {
    "Hình sự": { "Thụ lý mới": 3, "Thụ lý mới trùng thẩm phán": 1, "Xin ý kiến lãnh đạo": 1, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 1, "Ngoài tòa án": 0, "Trả lại đơn": 1, "Lưu theo dõi": 1 },
    "Dân sự": { "Thụ lý mới": 2, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 1, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 1, "Trả lại đơn": 0, "Lưu theo dõi": 1 },
    "Hành chính": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 1, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
    "Kinh doanh thương mại": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 1, "Lưu theo dõi": 0 },
    "Hôn nhân gia đình": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
    "Lao động": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
    "Sở hữu trí tuệ": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 1 },
    "Phá sản": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 1, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
  };
  const soSanhMult = chartPeriod === "day" ? 0.1 : chartPeriod === "month" ? 4 : chartPeriod === "year" ? 40 : chartPeriod === "custom" ? 0.5 : 1;
  // 1 dòng / Loại án, kèm tổng dòng — nguồn cho bảng nhiệt bên dưới. Không gộp
  // theo "Vụ chuyên môn" nữa: 1 Loại án (vd. Hình sự) vẫn có thể phát sinh
  // phần việc thuộc Loại án khác (vd. phần dân sự trong vụ án hình sự) nên gán
  // cố định 1 Loại án ↔ 1 Vụ là không đúng thực tế nghiệp vụ.
  const banLoaiAnRows = LOAI_AN_SO_SANH.map(loaiAn => {
    const ketQua = KET_QUA_LIST.map(kq => ({
      key: kq,
      soLuong: Math.round(LOAI_AN_KET_QUA_TUAN[loaiAn][kq] * soSanhMult),
    }));
    return { loaiAn, ketQua, tong: ketQua.reduce((s, k) => s + k.soLuong, 0) };
  });
  // Tổng theo cột (mỗi Kết quả, cộng dồn mọi Loại án) — thay cho panel xếp
  // hạng "Kết quả xử lý đơn" cũ, nay là hàng "Tổng" cuối bảng.
  const tongTheoKetQua = KET_QUA_LIST.map(kq => ({
    key: kq,
    soLuong: banLoaiAnRows.reduce((s, r) => s + (r.ketQua.find(k => k.key === kq)?.soLuong ?? 0), 0),
  }));
  const tongTatCa = tongTheoKetQua.reduce((s, k) => s + k.soLuong, 0) || 1;
  // Giá trị lớn nhất trong toàn ma trận — chuẩn hoá độ đậm ô nhiệt (heatmap)
  // theo 1 thang màu xanh duy nhất (sequential), giúp so sánh độ lớn giữa các
  // ô trực quan hơn bảng số thuần tuý.
  const maxKetQuaOSanh = Math.max(1, ...banLoaiAnRows.flatMap(r => r.ketQua.map(k => k.soLuong)));
  const heatmapStyle = (soLuong: number): React.CSSProperties => {
    if (soLuong <= 0) return {};
    const cuongDo = 0.12 + (soLuong / maxKetQuaOSanh) * 0.48;
    return { backgroundColor: `rgba(59, 130, 246, ${cuongDo})`, color: cuongDo > 0.42 ? "#fff" : "#1e3a8a", fontWeight: 600 };
  };
  // Đơn chuyển Nội bộ theo Vụ/Đơn vị tiếp nhận thực tế — trục độc lập với Loại
  // án (khớp trường "Đơn vị chuyển đến" ở màn Chuyển đơn khi Nơi chuyển đến =
  // Nội bộ, App.tsx ~2718). Đây mới là dữ liệu "đơn chuyển qua Vụ" thật, không
  // suy diễn cứng 1 Loại án = 1 Vụ như bảng nhiệt bên trên.
  // Chỉ tính đơn ĐỦ ĐIỀU KIỆN (Trạng thái đơn = "Đơn đủ điều kiện", App.tsx
  // ~2744-2750) — đơn không đủ điều kiện đi theo nhánh "Lý do không đủ điều
  // kiện" khác, không có 1 trong 3 trạng thái xử lý này. 3 trạng thái đúng
  // bằng lựa chọn thật của trường "Thụ lý đơn" khi đủ điều kiện (App.tsx
  // ~2754-2760: Thụ lý mới / Đã thụ lý / Xin ý kiến lãnh đạo / Không — bỏ
  // "Không" vì đó là chưa quyết định, chưa phải kết quả). Màu dùng thống nhất
  // với khối "Hiện trạng đơn" phía trên (HIEN_TRANG_DON) cho cùng 1 trạng thái
  // luôn cùng 1 màu trong toàn Dashboard.
  const THU_LY_NOI_BO_LIST = ["Thụ lý mới", "Đã thụ lý", "Xin ý kiến lãnh đạo"] as const;
  const THU_LY_NOI_BO_MAU: Record<string, string> = {
    "Thụ lý mới": "#22c55e",
    "Đã thụ lý": "#3b82f6",
    "Xin ý kiến lãnh đạo": "#f97316",
  };
  // Tổng mỗi Vụ giữ nguyên (6, 4, 2, 3 → 15), chỉ đổi cách chia theo 3 trạng
  // thái thật thay vì 5 trạng thái cũ.
  const VU_THU_LY_NOI_BO_TUAN: Record<string, Record<string, number>> = {
    "Vụ GĐKT Hình sự": { "Thụ lý mới": 3, "Đã thụ lý": 2, "Xin ý kiến lãnh đạo": 1 },
    "Vụ GĐKT Dân sự": { "Thụ lý mới": 2, "Đã thụ lý": 1, "Xin ý kiến lãnh đạo": 1 },
    "Vụ GĐKT Hành chính": { "Thụ lý mới": 1, "Đã thụ lý": 1, "Xin ý kiến lãnh đạo": 0 },
    "Vụ GĐKT KD-TM & khác": { "Thụ lý mới": 2, "Đã thụ lý": 0, "Xin ý kiến lãnh đạo": 1 },
  };
  const donChuyenVu = Object.entries(VU_THU_LY_NOI_BO_TUAN).map(([vu, ketQuaTuan]) => {
    const ketQua = THU_LY_NOI_BO_LIST.map(kq => ({ key: kq, soLuong: Math.round(ketQuaTuan[kq] * soSanhMult) }));
    return { vu, ketQua, soLuong: ketQua.reduce((s, k) => s + k.soLuong, 0) };
  });
  const maxDonChuyenVu = Math.max(1, ...donChuyenVu.map(v => v.soLuong));
  const tongDonChuyenVu = donChuyenVu.reduce((s, v) => s + v.soLuong, 0);
  // Vụ nhiều đơn nhất lên đầu — dễ so sánh hơn giữ nguyên thứ tự cố định.
  const donChuyenVuSapXep = [...donChuyenVu].sort((a, b) => b.soLuong - a.soLuong);
  // Trục hoành cho 2 biểu đồ thanh ngang bên dưới — làm tròn lên bước 2 đơn vị
  // để có mốc chẵn (0, 2, 4…), luôn chừa dư so với giá trị lớn nhất.
  const niceAxisMax = (maxVal: number) => Math.ceil((maxVal + 1) / 2) * 2;
  const axisTicks = (max: number) => {
    const ticks: number[] = [];
    for (let t = 0; t <= max; t += 2) ticks.push(t);
    return ticks;
  };
  // Màu theo trạng thái xử lý — dùng riêng cho biểu đồ "Phân bố đơn theo trạng
  // thái xử lý" (đủ 9 trạng thái của KET_QUA_LIST, khác miền 3 trạng thái
  // "Thụ lý đơn" ở biểu đồ theo Vụ bên trên).
  const TRANG_THAI_MAU: Record<string, string> = {
    "Thụ lý mới": "#22c55e",
    "Thụ lý mới trùng thẩm phán": "#06b6d4",
    "Xin ý kiến lãnh đạo": "#f97316",
    "Không thụ lý": "#ef4444",
    "Đơn không đủ điều kiện": "#f59e0b",
    "Tòa khác": "#a855f7",
    "Ngoài tòa án": "#ec4899",
    "Trả lại đơn": "#f472b6",
    "Lưu theo dõi": "#64748b",
  };
  const maxTrangThai = Math.max(1, ...tongTheoKetQua.map(k => k.soLuong));
  const axisMaxTrangThai = niceAxisMax(maxTrangThai);
  const ticksTrangThai = axisTicks(axisMaxTrangThai);
  const axisMaxVu = niceAxisMax(maxDonChuyenVu);
  const ticksVu = axisTicks(axisMaxVu);
  // Đơn nhận theo Loại án (khớp báo cáo Phòng HCTP: 27 đơn nhận trong tuần) —
  // nguồn cho khối "Thống kê đơn nhận {kỳ}" của các vai trò quản lý.
  const DON_NHAN_LOAI_AN_TUAN: Record<typeof LOAI_AN_DON_NHAN[number], number> = {
    "Hình sự": 14, "Dân sự": 10, "Loại án khác": 3,
  };
  const DON_NHAN_META: Record<typeof LOAI_AN_DON_NHAN[number], { icon: React.ReactNode; bg: string; color: string }> = {
    "Hình sự": { icon: <Gavel size={24} />, bg: "bg-[#eff6ff]", color: "text-[#3b82f6]" },
    "Dân sự": { icon: <Scale size={24} />, bg: "bg-[#f0fdf4]", color: "text-[#16a34a]" },
    "Loại án khác": { icon: <Layers size={24} />, bg: "bg-[#f5f3ff]", color: "text-[#8b5cf6]" },
  };
  const donNhanLoaiAn = LOAI_AN_DON_NHAN.map(loaiAn => ({
    loaiAn, soLuong: Math.round(DON_NHAN_LOAI_AN_TUAN[loaiAn] * soSanhMult),
  }));
  const tongDonNhan = donNhanLoaiAn.reduce((s, l) => s + l.soLuong, 0) || 1;

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

  // Cơ cấu loại hình án — đủ 8 loại án, cùng thứ tự với LOAI_AN_SO_SANH để
  // nhất quán với biểu đồ "So sánh số đơn theo loại án & kết quả" bên dưới.
  const caseTypes = [
    { label: "Hình sự", percent: 30, color: "bg-[#e74c3c]" },
    { label: "Dân sự", percent: 25, color: "bg-[#3498db]" },
    { label: "Hành chính", percent: 15, color: "bg-[#f39c12]" },
    { label: "Kinh doanh thương mại", percent: 10, color: "bg-[#9b59b6]" },
    { label: "Hôn nhân gia đình", percent: 8, color: "bg-[#16a34a]" },
    { label: "Lao động", percent: 6, color: "bg-[#06b6d4]" },
    { label: "Sở hữu trí tuệ", percent: 4, color: "bg-[#ec4899]" },
    { label: "Phá sản", percent: 2, color: "bg-[#64748b]" },
  ];

  // Đơn theo hình thức tiếp nhận — đủ 5 hình thức khớp dropdown "Hình thức
  // nhận" ở màn Thêm mới đơn (App.tsx ~13330). Số liệu ảo, cộng đúng bằng
  // "Tổng số đơn nhận" kỳ Tuần này (27) để nhất quán với khối KPI phía trên.
  const hinhThucTiepNhan = [
    { label: "Bưu điện", value: 7, icon: <Mail size={13} />, color: "#f59e0b" },
    { label: "Điện tử", value: 6, icon: <Globe size={13} />, color: "#22c55e" },
    { label: "Trực tiếp", value: 8, icon: <UserCheck size={13} />, color: "#3b82f6" },
    { label: "Nội bộ", value: 2, icon: <Building2 size={13} />, color: "#8b5cf6" },
    { label: "Tiếp công dân", value: 4, icon: <Users size={13} />, color: "#06b6d4" },
  ];
  const maxHinhThuc = Math.max(...hinhThucTiepNhan.map(h => h.value));

  // Đơn quá hạn giải quyết — hạn xử lý là 3 ngày kể từ ngày Tòa nhận đơn.
  // Ngày xử lý = hôm nay - ngày Tòa nhận:
  //  - < 2 ngày: chưa đáng lo, không đưa vào danh sách cảnh báo này
  //  - 2-3 ngày: sắp quá hạn (chỉ đếm số lượng, nhắc xử lý sớm)
  //  - > 3 ngày: quá hạn, hiển thị trong bảng bên dưới, badge = số ngày quá hạn
  //    (ngày xử lý - 3), sắp xếp quá hạn nhiều nhất lên đầu.
  const HAN_XU_LY_NGAY = 3;
  const NGUONG_SAP_QUA_HAN_NGAY = 2;
  const soNgayXuLy = (ngayToaNhan: string) => {
    const [d, m, y] = ngayToaNhan.split("/").map(Number);
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);
    return Math.floor((homNay.getTime() - new Date(y, m - 1, d).getTime()) / 86400000);
  };
  const donTheoNgayNhan = [
    { maDon: "7038", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", ngayToaNhan: "29/07/2026" },
    { maDon: "7037", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", ngayToaNhan: "01/08/2026" },
    { maDon: "7035", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Đã thụ lý", ngayToaNhan: "04/08/2026" },
    { maDon: "7034", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", ngayToaNhan: "05/08/2026" },
    { maDon: "7021", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", ngayToaNhan: "06/08/2026" },
    { maDon: "7022", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", ngayToaNhan: "07/08/2026" },
    { maDon: "7027", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", ngayToaNhan: "07/08/2026" },
    { maDon: "7028", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Thụ lý mới", ngayToaNhan: "08/08/2026" },
    { maDon: "7048", canBoXuLy: "Nguyễn Minh An", trangThai: "Thụ lý mới", ngayToaNhan: "09/08/2026" },
    { maDon: "7031", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", ngayToaNhan: "09/08/2026" },
    { maDon: "7052", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Thụ lý mới", ngayToaNhan: "10/08/2026" },
    { maDon: "7053", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", ngayToaNhan: "10/08/2026" },
    { maDon: "7054", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", ngayToaNhan: "11/08/2026" },
    { maDon: "7055", canBoXuLy: "Nguyễn Minh An", trangThai: "Thụ lý mới", ngayToaNhan: "11/08/2026" },
    { maDon: "7056", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Thụ lý mới", ngayToaNhan: "11/08/2026" },
  ].map(d => ({ ...d, soNgayXuLy: soNgayXuLy(d.ngayToaNhan) }))
    .filter(d => d.soNgayXuLy >= NGUONG_SAP_QUA_HAN_NGAY);
  const donQuaHan = donTheoNgayNhan
    .filter(d => d.soNgayXuLy > HAN_XU_LY_NGAY)
    .sort((a, b) => b.soNgayXuLy - a.soNgayXuLy);
  // Đơn sắp đến hạn — chưa quá hạn nên KHÔNG cộng vào donQuaHan.length, chỉ nêu
  // để nhắc xử lý trước khi rơi vào nhóm trên.
  const soDonSapDenHan = donTheoNgayNhan.filter(d => d.soNgayXuLy <= HAN_XU_LY_NGAY).length;

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
                      Quá {d.soNgayXuLy - HAN_XU_LY_NGAY} ngày
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

          {/* Văn bản trả lại */}
          <div className="border border-[#eee] rounded-[8px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                <RotateCcw size={16} className="text-[#e67e22]" />
                Văn bản trả lại
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
              onXemChiTiet={() => onXemPheDuyet?.("cho_duyet")}
            />
            <KPICardCoLink
              title="Tài liệu đã duyệt"
              value={String(soTaiLieuDaDuyet)}
              trend="Đã hoàn tất luồng duyệt"
              icon={<CheckCircle2 size={24} />}
              bgColorClass="bg-[#e8f7ee]"
              colorClass="text-[#1a7a45]"
              onXemChiTiet={() => onXemPheDuyet?.("da_duyet")}
            />
          </div>
        </div>
      )}

      {/* Filters — đặt ngay trên các khối dùng chartPeriod/filterOfficer bên dưới
          (bảng So sánh số đơn theo loại án & kết quả xử lý, Đơn theo cán bộ) thay
          vì trên cùng trang, vì "Hiện trạng đơn" (Cán bộ) không phụ thuộc kỳ lọc này. */}
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

      {/* ROW 2a: 2 biểu đồ thanh ngang tổng quan — đặt trước bảng so sánh chi
          tiết theo Loại án để xem toàn cảnh trước khi đi vào từng dòng. */}
      <div className="grid grid-cols-2 gap-5">
        {/* Phân bố đơn theo trạng thái xử lý — đủ 9 trạng thái, khớp Tổng cộng
            của bảng so sánh bên dưới (tongTatCa). */}
        <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#8b1a1a]" />
              Phân bố đơn theo trạng thái xử lý
            </h3>
            <span className="text-[12.5px] text-[#64748b]">Tổng: <span className="font-bold text-[#0f172a]">{tongTatCa}</span> đơn</span>
          </div>
          <div className="p-5">
            <div className="space-y-2.5">
              {tongTheoKetQua.map(k => (
                <div key={k.key} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "160px 1fr 84px" }}>
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#334155] truncate">
                    {KET_QUA_ICON[k.key]} {k.key}
                  </span>
                  <div className="h-[16px] bg-[#f1f5f9] rounded-[3px] overflow-hidden">
                    <div className="h-full rounded-[3px] transition-all duration-700" style={{ width: `${(k.soLuong / axisMaxTrangThai) * 100}%`, backgroundColor: TRANG_THAI_MAU[k.key] }}></div>
                  </div>
                  <span className="text-[12px] font-semibold text-[#334155] text-right whitespace-nowrap">
                    {k.soLuong} <span className="text-[#94a3b8] font-normal">({((k.soLuong / tongTatCa) * 100).toFixed(2)}%)</span>
                  </span>
                </div>
              ))}
            </div>
            {/* Trục hoành */}
            <div className="grid items-center gap-2.5 mt-2 pt-1.5 border-t border-[#f1f5f9]" style={{ gridTemplateColumns: "160px 1fr 84px" }}>
              <span></span>
              <div className="relative h-[14px] text-[10.5px] text-[#94a3b8]">
                {ticksTrangThai.map(t => (
                  <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / axisMaxTrangThai) * 100}%` }}>{t}</span>
                ))}
              </div>
              <span></span>
            </div>
          </div>
        </div>

        {/* Đơn đủ điều kiện chuyển Nội bộ theo Vụ chuyên môn — trục "chuyển đi Vụ
            nào" tách riêng khỏi bảng so sánh Loại án × Kết quả, vì đây là dữ liệu
            thật của trường "Đơn vị chuyển đến" (App.tsx, mục Nội bộ), không suy
            ra từ Loại án; mỗi thanh xếp chồng theo 3 trạng thái "Thụ lý đơn" thật
            (chỉ đơn đủ điều kiện mới có trạng thái này). */}
        <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <Building2 size={18} className="text-[#8b1a1a]" />
              Đơn đủ điều kiện chuyển Nội bộ theo Vụ chuyên môn
            </h3>
            <span className="text-[12.5px] text-[#64748b]">Tổng: <span className="font-bold text-[#0f172a]">{tongDonChuyenVu}</span> đơn</span>
          </div>
          {/* Legend trạng thái — màu mã hoá trạng thái (không phải Vụ) nên cần
              chú giải để không đọc nhầm màu là định danh Vụ. */}
          <div className="px-5 pt-4 flex flex-wrap gap-x-4 gap-y-1.5">
            {THU_LY_NOI_BO_LIST.map(kq => (
              <span key={kq} className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569]">
                <span className="w-2.5 h-2.5 rounded-[2px] flex-shrink-0" style={{ backgroundColor: THU_LY_NOI_BO_MAU[kq] }}></span>
                {kq}
              </span>
            ))}
          </div>
          <div className="p-5 pt-4">
            <div className="space-y-3">
              {donChuyenVuSapXep.map(v => (
                <div key={v.vu} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "150px 1fr 30px" }}>
                  <span className="text-[12.5px] font-semibold text-[#334155] truncate">{v.vu}</span>
                  <div className="h-[16px] bg-[#f1f5f9] rounded-[3px] overflow-hidden">
                    <div className="h-full flex gap-[2px]" style={{ width: `${(v.soLuong / axisMaxVu) * 100}%` }}>
                      {v.ketQua.filter(k => k.soLuong > 0).map(k => (
                        <div
                          key={k.key}
                          title={`${v.vu} · ${k.key}: ${k.soLuong}`}
                          className="h-full"
                          style={{ width: `${(k.soLuong / v.soLuong) * 100}%`, backgroundColor: THU_LY_NOI_BO_MAU[k.key] }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[12.5px] font-bold text-[#0f172a]">{v.soLuong}</span>
                </div>
              ))}
            </div>
            {/* Trục hoành */}
            <div className="grid items-center gap-2.5 mt-2 pt-1.5 border-t border-[#f1f5f9]" style={{ gridTemplateColumns: "150px 1fr 30px" }}>
              <span></span>
              <div className="relative h-[14px] text-[10.5px] text-[#94a3b8]">
                {ticksVu.map(t => (
                  <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / axisMaxVu) * 100}%` }}>{t}</span>
                ))}
              </div>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2b: So sánh số đơn theo loại án & kết quả xử lý — bảng nhiệt (heatmap)
          Loại án × Kết quả xử lý, độ đậm ô = số lượng (thang xanh liên tục, chuẩn
          hoá theo giá trị lớn nhất toàn bảng) để mắt bắt được điểm nóng ngay mà
          không cần nhóm thêm trục nào khác. Bỏ cột "Vụ chuyên môn" nhóm theo Loại
          án trước đây: 1 Loại án không gắn cố định 1 Vụ trong thực tế (vd. vụ án
          hình sự vẫn có thể phát sinh phần dân sự), nhóm cứng như vậy gây hiểu
          nhầm nên bỏ, giữ đúng 2 trục thật sự độc lập với nhau. */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
          <BarChart3 size={18} className="text-[#8b1a1a]" />
          <h3 className="text-[14px] font-bold text-[#0f172a]">So sánh số đơn theo loại án & kết quả xử lý</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[#eff6ff]">
                <th className="px-3 py-2.5 font-bold text-[#3b82f6] text-left whitespace-nowrap">Loại án</th>
                {KET_QUA_LIST.map(kq => (
                  <th key={kq} className="px-2 py-2.5 font-semibold text-[#3b82f6] text-center min-w-[100px] leading-tight whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {KET_QUA_ICON[kq]}
                      {kq}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2.5 font-bold text-[#3b82f6] text-center whitespace-nowrap">∑ Tổng</th>
              </tr>
            </thead>
            <tbody>
              {banLoaiAnRows.map(r => (
                <tr key={r.loaiAn} className="bg-white border-b border-[#f1f5f9] last:border-b-0">
                  <td className="px-3 py-2 text-[#334155] font-medium whitespace-nowrap">{r.loaiAn}</td>
                  {r.ketQua.map(k => (
                    <td
                      key={k.key}
                      title={`${r.loaiAn} · ${k.key}: ${k.soLuong}`}
                      style={heatmapStyle(k.soLuong)}
                      className="px-2 py-2 text-center text-[#334155] transition-colors"
                    >
                      {k.soLuong > 0 ? k.soLuong : <span className="text-[#cbd5e1]">-</span>}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-bold text-[#3b82f6]">{r.tong}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#f8fafc] font-bold border-t-2 border-[#dbeafe]">
                <td className="px-3 py-2.5 text-[#3b82f6] whitespace-nowrap">Tổng cộng</td>
                {tongTheoKetQua.map(k => (
                  <td key={k.key} className="px-2 py-2.5 text-center text-[#3b82f6]">{k.soLuong}</td>
                ))}
                <td className="px-3 py-2.5 text-center text-[#3b82f6]">{tongTatCa}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ROW 3: Hình thức tiếp nhận đơn + Cơ cấu loại hình án + Hiệu suất cán bộ
          — gộp chung 1 hàng lưới 4 cột (thay vì 2 hàng riêng, hàng đầu chỉ có 1
          thẻ 1/3 để trống 2/3 khoảng trắng) — chỉ vai trò quản lý (Trưởng phòng
          trở lên). */}
      {laVaiTroQuanLy && (
      <div className="grid grid-cols-4 gap-5">
        {/* Hình thức tiếp nhận đơn */}
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
        </div>

        {/* Phân loại án */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <PieChart size={18} className="text-[#8b1a1a]" />
              Cơ cấu loại hình án
            </h3>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center space-y-3">
            {caseTypes.map((type, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] font-semibold text-[#334155]">{type.label}</span>
                  <span className="text-[12.5px] font-bold text-[#0f172a]">{type.percent}%</span>
                </div>
                <div className="w-full h-[7px] bg-[#f1f5f9] rounded-full overflow-hidden">
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#1e293b] text-[14px] truncate">{officer.name}</span>
                    <span className="font-bold text-[#0f172a] text-[14px] bg-[#f1f5f9] px-2 py-0.5 rounded-[4px]">Tổng: {officer.total}</span>
                  </div>

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
