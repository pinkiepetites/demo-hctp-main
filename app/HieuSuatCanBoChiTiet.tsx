import React, { useMemo } from "react";
import {
  Inbox, CheckCircle2, Clock, AlertTriangle, ArrowLeft, Lock,
} from "lucide-react";
import { nguoiTheoVaiTro } from "./components/QuanLyVanBan";
import {
  daGiaiQuyetXong, laQuaHan, TRANG_THAI_THU_LY, type DonChiSo,
} from "./ChiSoTrangChu";

/** Danh bạ chức vụ. Trước đây file này còn giữ cả một BẢNG SỐ LIỆU mẫu riêng, tách
 *  rời danh sách đơn — hậu quả: Trang chủ nói cán bộ A giữ 7 đơn, bấm "Xem chi tiết"
 *  thì màn này nói 3, và hai bên còn liệt kê hai nhóm người khác hẳn nhau. Nay mọi
 *  con số đều đếm từ chính danh sách đơn, ở đây chỉ còn tra chức vụ theo tên. */
export const DU_LIEU_CAN_BO: { name: string; role: string }[] = [
  { name: "Vũ Văn Yên", role: "Cán bộ" },
  { name: "Phùng Trâm Anh", role: "Cán bộ" },
  { name: "Nguyễn Thị Lan", role: "Thư ký Tòa án" },
  { name: "Nguyễn Minh An", role: "Chuyên viên" },
  { name: "Nguyễn Thị Thu Hương", role: "Phó Trưởng phòng" },
  { name: "Hoàng Lê Chương", role: "Thư ký Tòa án" },
  { name: "Đinh Mai Long", role: "Chuyên viên cao cấp" },
];

const CHUC_VU_THEO_TEN = new Map(DU_LIEU_CAN_BO.map(c => [c.name, c.role]));

type DongHieuSuat = {
  name: string;
  role: string;
  tong: number;
  daXong: number;
  chuaXong: number;
  quaHan: number;
  /** Số đơn theo từng trạng thái thụ lý, khóa là `nhan` của TRANG_THAI_THU_LY. */
  theoTrangThai: Record<string, number>;
};

/** Dựng bảng hiệu suất từ danh sách đơn — cùng một nguồn, cùng một luật phân loại
 *  với Trang chủ, nên con số ở hai màn không thể lệch nhau. */
const dungBang = (rows: DonChiSo[], homNay: Date): DongHieuSuat[] => {
  const theoNguoi = new Map<string, DongHieuSuat>();

  rows.forEach(r => {
    const ten = (r.nguoiNhap ?? "").trim();
    if (!ten) return;   // đơn chưa có người nhập thì không quy được cho ai
    const dong = theoNguoi.get(ten) ?? {
      name: ten,
      role: CHUC_VU_THEO_TEN.get(ten) ?? "Cán bộ",
      tong: 0, daXong: 0, chuaXong: 0, quaHan: 0,
      theoTrangThai: Object.fromEntries(TRANG_THAI_THU_LY.map(t => [t.nhan, 0])),
    };

    dong.tong += 1;
    if (daGiaiQuyetXong(r)) dong.daXong += 1; else dong.chuaXong += 1;
    if (laQuaHan(r, homNay)) dong.quaHan += 1;

    const tt = r.giaiQuyet?.nhan ?? "";
    if (tt in dong.theoTrangThai) dong.theoTrangThai[tt] += 1;

    theoNguoi.set(ten, dong);
  });

  return [...theoNguoi.values()].sort((a, b) => b.tong - a.tong);
};

const phanTram = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;

const KPICard = ({ title, value, unit, phuChu, icon, colorClass, bgColorClass }: {
  title: string; value: string; unit: string; phuChu?: string;
  icon: React.ReactNode; colorClass: string; bgColorClass: string;
}) => (
  <div className="bg-white rounded-[8px] border border-[#eee] p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 ${bgColorClass} ${colorClass}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[13px] text-[#666] font-medium mb-1.5 leading-snug">{title}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight tabular-nums">{value}</span>
        <span className="text-[12px] text-[#888] font-medium">{unit}</span>
      </div>
      <div className="text-[12px] text-[#94a3b8] mt-1.5 leading-snug">{phuChu}</div>
    </div>
  </div>
);

export default function HieuSuatCanBoChiTiet({ currentRole = "can-bo", donList = [], onBack }: {
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  /** Đúng tập dữ liệu mà Trang chủ và màn Danh sách đơn đang dùng. */
  donList?: DonChiSo[];
  onBack?: () => void;
}) {
  const homNay = useMemo(() => new Date(), []);

  // Phân quyền: Cán bộ chỉ xem được dữ liệu của chính mình; Trưởng phòng /
  // Phó Chánh án / Lãnh đạo Tòa xem được toàn bộ cán bộ trong bảng.
  const xemDuocTatCa = currentRole !== "can-bo";
  const tenDangNhap = nguoiTheoVaiTro(currentRole).nguoi;

  const tatCaDong = useMemo(() => dungBang(donList, homNay), [donList, homNay]);
  const rows = xemDuocTatCa ? tatCaDong : tatCaDong.filter(r => r.name === tenDangNhap);

  const t = useMemo(() => {
    const cong = (lay: (r: DongHieuSuat) => number) => rows.reduce((s, r) => s + lay(r), 0);
    const tong = cong(r => r.tong);
    const daXong = cong(r => r.daXong);
    const chuaXong = cong(r => r.chuaXong);
    const quaHan = cong(r => r.quaHan);
    return {
      tong, daXong, chuaXong, quaHan,
      tyLeXong: tong ? (daXong / tong) * 100 : 0,
      tyLeQuaHan: chuaXong ? (quaHan / chuaXong) * 100 : 0,
      theoTrangThai: Object.fromEntries(
        TRANG_THAI_THU_LY.map(tt => [tt.nhan, cong(r => r.theoTrangThai[tt.nhan] ?? 0)])),
    };
  }, [rows]);

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại Trang chủ
        </button>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Nói rõ nguồn ngay trên màn: đây là lý do con số ở đây bằng đúng con số
              ở Trang chủ, và cũng là thứ phải sửa nếu sau này lệch. */}
          <span className="text-[12px] text-[#8a94a6]">
            Đếm trực tiếp trên danh sách đơn · cùng nguồn với Trang chủ
          </span>
          {!xemDuocTatCa && (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#92400e] bg-[#fffbeb] border border-[#f59e0b]/40 px-2.5 py-1 rounded-[4px]">
              <Lock size={12} /> Bạn chỉ xem được dữ liệu xử lý đơn của chính mình
            </div>
          )}
        </div>
      </div>

      {/* 4 chỉ số — cùng bộ với khối "Tiến độ giải quyết đơn" ở Trang chủ */}
      <div className="grid grid-cols-4 gap-5">
        <KPICard
          title="Tổng số đơn đã nhận"
          value={String(t.tong)} unit="đơn"
          phuChu={xemDuocTatCa ? `${rows.length} cán bộ` : tenDangNhap}
          icon={<Inbox size={24} />}
          bgColorClass="bg-[#eff6ff]" colorClass="text-[#3b82f6]"
        />
        <KPICard
          title="Đã giải quyết xong"
          value={String(t.daXong)} unit="đơn"
          phuChu={`${phanTram(t.tyLeXong)} tổng số đơn`}
          icon={<CheckCircle2 size={24} />}
          bgColorClass="bg-[#f0fdf4]" colorClass="text-[#22c55e]"
        />
        <KPICard
          title="Chưa giải quyết"
          value={String(t.chuaXong)} unit="đơn"
          phuChu="Đang giữ, chưa chuyển Vụ chuyên môn"
          icon={<Clock size={24} />}
          bgColorClass="bg-[#fff7ed]" colorClass="text-[#f97316]"
        />
        <KPICard
          title="Quá hạn giải quyết"
          value={String(t.quaHan)} unit="đơn"
          phuChu={`${phanTram(t.tyLeQuaHan)} số đơn chưa giải quyết`}
          icon={<AlertTriangle size={24} />}
          bgColorClass="bg-[#fef2f2]" colorClass="text-[#c0392b]"
        />
      </div>

      {/* Bảng 1: tiến độ theo cán bộ */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-[14px] font-bold text-[#0f172a]">Tiến độ giải quyết đơn theo cán bộ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[#475569] text-[12px] font-semibold">
                <th className="text-left px-5 py-3">Cán bộ</th>
                <th className="text-center px-3 py-3">Tổng số đơn</th>
                <th className="text-center px-3 py-3">Đã giải quyết xong</th>
                <th className="text-center px-3 py-3">Chưa giải quyết</th>
                <th className="text-center px-3 py-3">Quá hạn</th>
                <th className="text-center px-3 py-3">Tỷ lệ giải quyết</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#94a3b8]">
                  Chưa có đơn nào được ghi nhận cho {xemDuocTatCa ? "cán bộ nào" : tenDangNhap}.
                </td></tr>
              )}
              {rows.map(r => (
                <tr key={r.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 text-[#1e293b]">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[#64748b]"> - {r.role}</span>
                  </td>
                  <td className="text-center px-3 py-3 font-bold text-[#1d2e4f] tabular-nums">{r.tong}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#27ae60] tabular-nums">{r.daXong}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#e67e22] tabular-nums">{r.chuaXong}</td>
                  {/* Số 0 để mờ: mắt phải bắt được ngay dòng nào thực sự có quá hạn */}
                  <td className={`text-center px-3 py-3 font-semibold tabular-nums ${r.quaHan ? "text-[#c0392b]" : "text-[#cbd5e1]"}`}>
                    {r.quaHan}
                  </td>
                  <td className="text-center px-3 py-3 text-[#475569] tabular-nums">
                    {phanTram(r.tong ? (r.daXong / r.tong) * 100 : 0)}
                  </td>
                </tr>
              ))}
              {rows.length > 0 && (
                <tr className="border-t border-[#e2e8f0] bg-[#f8fafc] font-bold text-[#0f172a]">
                  <td className="px-5 py-3">TỔNG CỘNG</td>
                  <td className="text-center px-3 py-3 tabular-nums">{t.tong}</td>
                  <td className="text-center px-3 py-3 tabular-nums">{t.daXong}</td>
                  <td className="text-center px-3 py-3 tabular-nums">{t.chuaXong}</td>
                  <td className="text-center px-3 py-3 tabular-nums">{t.quaHan}</td>
                  <td className="text-center px-3 py-3 tabular-nums">{phanTram(t.tyLeXong)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng 2: theo trạng thái thụ lý — đúng 6 trạng thái mà Trang chủ và màn
          Danh sách đơn đang dùng, không phải một bộ cột riêng của màn này */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-[14px] font-bold text-[#0f172a]">Trạng thái thụ lý theo cán bộ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[#475569] text-[12px] font-semibold">
                <th className="text-left px-5 py-3">Cán bộ</th>
                {TRANG_THAI_THU_LY.map(tt => (
                  <th key={tt.nhan} className="text-center px-3 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tt.mau }} />
                      {tt.nhan}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={TRANG_THAI_THU_LY.length + 1} className="px-5 py-10 text-center text-[#94a3b8]">
                  Chưa có dữ liệu.
                </td></tr>
              )}
              {rows.map(r => (
                <tr key={r.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 text-[#1e293b]">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[#64748b]"> - {r.role}</span>
                  </td>
                  {TRANG_THAI_THU_LY.map(tt => {
                    const v = r.theoTrangThai[tt.nhan] ?? 0;
                    return (
                      <td key={tt.nhan} className="text-center px-3 py-3 font-semibold tabular-nums"
                        style={{ color: v ? tt.mau : "#cbd5e1" }}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {rows.length > 0 && (
                <tr className="border-t border-[#e2e8f0] bg-[#f8fafc] font-bold text-[#0f172a]">
                  <td className="px-5 py-3">TỔNG CỘNG</td>
                  {TRANG_THAI_THU_LY.map(tt => (
                    <td key={tt.nhan} className="text-center px-3 py-3 tabular-nums">{t.theoTrangThai[tt.nhan]}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
