import { ArrowLeft, Lock } from "lucide-react";
import { nguoiTheoVaiTro } from "./components/QuanLyVanBan";

type TrangThaiCanBo = {
  name: string;
  role: string;
  homNay: number;
  thangNay: number;
  kyNay: number;
  daThuLy: number;
  thuLyMoi: number;
  thuLyMoiTrungTP: number;
  traLoiDonLuuTheoDoi: number;
  chuaDuDieuKien: number;
  xinYKienLanhDao: number;
};

// Số ngày làm việc trong kỳ hiện tại, dùng để tính "trung bình đơn/ngày".
const SO_NGAY_LAM_VIEC_TRONG_KY = 13;

// Dữ liệu mẫu — mỗi hàng đã khớp tổng: đã thụ lý + thụ lý mới + thụ lý mới
// trùng TP + trả lời đơn & lưu theo dõi + chưa đủ điều kiện + xin ý kiến LĐ
// = Tổng số đơn xử lý theo kỳ, để hai bảng luôn nhất quán với nhau.
const DU_LIEU_CAN_BO: TrangThaiCanBo[] = [
  { name: "Vũ Văn Yên", role: "Cán bộ", homNay: 1, thangNay: 3, kyNay: 3, daThuLy: 1, thuLyMoi: 1, thuLyMoiTrungTP: 0, traLoiDonLuuTheoDoi: 1, chuaDuDieuKien: 0, xinYKienLanhDao: 0 },
  { name: "Hoàng Lê Chương", role: "Thư ký Tòa án", homNay: 1, thangNay: 5, kyNay: 5, daThuLy: 2, thuLyMoi: 1, thuLyMoiTrungTP: 0, traLoiDonLuuTheoDoi: 1, chuaDuDieuKien: 1, xinYKienLanhDao: 0 },
  { name: "Nguyễn Thị Thu Hương", role: "Phó Trưởng phòng", homNay: 2, thangNay: 12, kyNay: 12, daThuLy: 5, thuLyMoi: 3, thuLyMoiTrungTP: 1, traLoiDonLuuTheoDoi: 2, chuaDuDieuKien: 1, xinYKienLanhDao: 0 },
  { name: "Đinh Mai Long", role: "Chuyên viên cao cấp", homNay: 1, thangNay: 5, kyNay: 5, daThuLy: 2, thuLyMoi: 1, thuLyMoiTrungTP: 0, traLoiDonLuuTheoDoi: 1, chuaDuDieuKien: 0, xinYKienLanhDao: 1 },
];

const tong = (rows: TrangThaiCanBo[], key: keyof Omit<TrangThaiCanBo, "name" | "role">) =>
  rows.reduce((s, r) => s + r[key], 0);

const fmtTB = (soDon: number) => (soDon / SO_NGAY_LAM_VIEC_TRONG_KY).toFixed(2);

export default function HieuSuatCanBoChiTiet({ currentRole = "can-bo", onBack }: {
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  onBack?: () => void;
}) {
  // Phân quyền: Cán bộ chỉ xem được dữ liệu của chính mình; Trưởng phòng /
  // Phó Chánh án / Lãnh đạo Tòa xem được toàn bộ cán bộ trong bảng.
  const xemDuocTatCa = currentRole !== "can-bo";
  const tenDangNhap = nguoiTheoVaiTro(currentRole).nguoi;
  const displayedRows = xemDuocTatCa
    ? DU_LIEU_CAN_BO
    : DU_LIEU_CAN_BO.filter(r => r.name === tenDangNhap);

  const tHomNay = tong(displayedRows, "homNay");
  const tThangNay = tong(displayedRows, "thangNay");
  const tKyNay = tong(displayedRows, "kyNay");
  const tDaThuLy = tong(displayedRows, "daThuLy");
  const tThuLyMoi = tong(displayedRows, "thuLyMoi");
  const tThuLyMoiTrungTP = tong(displayedRows, "thuLyMoiTrungTP");
  const tTraLoiDon = tong(displayedRows, "traLoiDonLuuTheoDoi");
  const tChuaDuDieuKien = tong(displayedRows, "chuaDuDieuKien");
  const tXinYKien = tong(displayedRows, "xinYKienLanhDao");

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại Trang chủ
        </button>
        {!xemDuocTatCa && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#92400e] bg-[#fffbeb] border border-[#f59e0b]/40 px-2.5 py-1 rounded-[4px]">
            <Lock size={12} /> Bạn chỉ xem được dữ liệu xử lý đơn của chính mình
          </div>
        )}
      </div>

      {/* Bảng 1: theo thời gian */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-[14px] font-bold text-[#0f172a]">Số đơn xử lý theo thời gian, theo cán bộ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[#475569] text-[12px] font-semibold">
                <th className="text-left px-5 py-3">Cán bộ</th>
                <th className="text-center px-3 py-3">Tổng số đơn xử lý<br />trong ngày hôm nay</th>
                <th className="text-center px-3 py-3">Tổng số đơn xử lý<br />trong tháng hiện tại</th>
                <th className="text-center px-3 py-3">Tổng số đơn xử lý<br />theo kỳ</th>
                <th className="text-center px-3 py-3">Trung bình số đơn xử lý<br />mỗi ngày (làm việc) trong kỳ</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map(r => (
                <tr key={r.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 text-[#1e293b]">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[#64748b]"> - {r.role}</span>
                  </td>
                  <td className="text-center px-3 py-3 font-bold text-[#3b82f6]">{r.homNay}</td>
                  <td className="text-center px-3 py-3 font-bold text-[#3b82f6]">{r.thangNay}</td>
                  <td className="text-center px-3 py-3 font-bold text-[#3b82f6]">{r.kyNay}</td>
                  <td className="text-center px-3 py-3 font-bold text-[#3b82f6]">{fmtTB(r.kyNay)}</td>
                </tr>
              ))}
              <tr className="border-t border-[#e2e8f0] bg-[#f8fafc] font-bold text-[#0f172a]">
                <td className="px-5 py-3">TỔNG CỘNG</td>
                <td className="text-center px-3 py-3">{tHomNay}</td>
                <td className="text-center px-3 py-3">{tThangNay}</td>
                <td className="text-center px-3 py-3">{tKyNay}</td>
                <td className="text-center px-3 py-3">{fmtTB(tKyNay)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng 2: theo trạng thái xử lý */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-[14px] font-bold text-[#0f172a]">Trạng thái đơn xử lý theo cán bộ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[#475569] text-[12px] font-semibold">
                <th className="text-left px-5 py-3">Cán bộ</th>
                <th className="text-center px-3 py-3">Đã thụ lý</th>
                <th className="text-center px-3 py-3">Thụ lý mới</th>
                <th className="text-center px-3 py-3">Thụ lý mới<br />trùng thẩm phán</th>
                <th className="text-center px-3 py-3">Trả lời đơn và<br />lưu theo dõi</th>
                <th className="text-center px-3 py-3">Chưa đủ<br />điều kiện</th>
                <th className="text-center px-3 py-3">Xin ý kiến<br />lãnh đạo</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map(r => (
                <tr key={r.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 text-[#1e293b]">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[#64748b]"> - {r.role}</span>
                  </td>
                  <td className="text-center px-3 py-3 font-semibold text-[#27ae60]">{r.daThuLy}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#2980b9]">{r.thuLyMoi}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#8e44ad]">{r.thuLyMoiTrungTP}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#16a085]">{r.traLoiDonLuuTheoDoi}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#e67e22]">{r.chuaDuDieuKien}</td>
                  <td className="text-center px-3 py-3 font-semibold text-[#c0392b]">{r.xinYKienLanhDao}</td>
                </tr>
              ))}
              <tr className="border-t border-[#e2e8f0] bg-[#f8fafc] font-bold text-[#0f172a]">
                <td className="px-5 py-3">TỔNG CỘNG</td>
                <td className="text-center px-3 py-3">{tDaThuLy}</td>
                <td className="text-center px-3 py-3">{tThuLyMoi}</td>
                <td className="text-center px-3 py-3">{tThuLyMoiTrungTP}</td>
                <td className="text-center px-3 py-3">{tTraLoiDon}</td>
                <td className="text-center px-3 py-3">{tChuaDuDieuKien}</td>
                <td className="text-center px-3 py-3">{tXinYKien}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
