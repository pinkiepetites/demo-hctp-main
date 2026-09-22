import React, { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Layers,
  Users,
  XCircle,
  AlertTriangle,
  Building2,
  Globe,
  RotateCcw,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Dữ liệu dùng chung với Dashboard (biểu đồ "Phân bố đơn theo trạng thái xử
// lý" cũng đọc từ đây) — để 2 màn không bao giờ lệch số nhau.
// ---------------------------------------------------------------------------

// Danh sách Loại án đầy đủ — khớp LOAI_AN_OPTIONS dùng ở màn Phân công thẩm
// phán / Nhận đơn.
export const LOAI_AN_SO_SANH = [
  "Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại",
  "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản",
] as const;

// "Kết quả xử lý đơn" — đủ 9 trạng thái xử lý thật của đơn: 5 cột đầu là kết
// quả khi "Nơi chuyển đến" = Nội bộ (Thụ lý mới, Thụ lý mới trùng thẩm phán,
// Xin ý kiến lãnh đạo, Không thụ lý, Đơn không đủ điều kiện); 4 cột còn lại là
// các giá trị "Nơi chuyển đến" khác (Tòa khác, Ngoài tòa án, Trả lại đơn, Lưu
// theo dõi).
export const KET_QUA_LIST = [
  "Thụ lý mới", "Thụ lý mới trùng thẩm phán", "Xin ý kiến lãnh đạo", "Không thụ lý", "Đơn không đủ điều kiện",
  "Tòa khác", "Ngoài tòa án", "Trả lại đơn", "Lưu theo dõi",
] as const;

export type KetQuaXuLy = typeof KET_QUA_LIST[number];

export const KET_QUA_ICON: Record<KetQuaXuLy, React.ReactNode> = {
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

// Nhãn rút gọn cho chỗ hẹp (biểu đồ thanh ở Dashboard) — khoá dữ liệu vẫn giữ
// tên đầy đủ.
export const KET_QUA_NHAN_NGAN: Partial<Record<KetQuaXuLy, string>> = {
  "Thụ lý mới trùng thẩm phán": "Thụ lý mới trùng TP",
};

// Kết quả xử lý theo Loại án — ma trận Loại án × Kết quả cho kỳ "Tuần này";
// các kỳ khác co giãn theo cùng hệ số nhân với officerData ở Dashboard để nhất
// quán trong toàn hệ thống báo cáo.
export const LOAI_AN_KET_QUA_TUAN: Record<typeof LOAI_AN_SO_SANH[number], Record<string, number>> = {
  "Hình sự": { "Thụ lý mới": 3, "Thụ lý mới trùng thẩm phán": 1, "Xin ý kiến lãnh đạo": 1, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 1, "Ngoài tòa án": 0, "Trả lại đơn": 1, "Lưu theo dõi": 1 },
  "Dân sự": { "Thụ lý mới": 2, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 1, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 1, "Trả lại đơn": 0, "Lưu theo dõi": 1 },
  "Hành chính": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 1, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
  "Kinh doanh thương mại": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 1, "Lưu theo dõi": 0 },
  "Hôn nhân gia đình": { "Thụ lý mới": 1, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
  "Lao động": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 1, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
  "Sở hữu trí tuệ": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 0, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 1 },
  "Phá sản": { "Thụ lý mới": 0, "Thụ lý mới trùng thẩm phán": 0, "Xin ý kiến lãnh đạo": 0, "Không thụ lý": 1, "Đơn không đủ điều kiện": 0, "Tòa khác": 0, "Ngoài tòa án": 0, "Trả lại đơn": 0, "Lưu theo dõi": 0 },
};

export type KyBaoCao = "day" | "week" | "month" | "year" | "custom";

/** Hệ số co giãn số liệu theo kỳ — mốc gốc là "Tuần này" (hệ số 1). */
export const heSoNhanKy = (ky: KyBaoCao) =>
  ky === "day" ? 0.1 : ky === "month" ? 4 : ky === "year" ? 40 : ky === "custom" ? 0.5 : 1;

/** 1 dòng / Loại án, kèm tổng dòng — nguồn cho bảng nhiệt. */
export const tinhBanLoaiAnRows = (ky: KyBaoCao) => {
  const mult = heSoNhanKy(ky);
  return LOAI_AN_SO_SANH.map(loaiAn => {
    const ketQua = KET_QUA_LIST.map(kq => ({
      key: kq,
      soLuong: Math.round(LOAI_AN_KET_QUA_TUAN[loaiAn][kq] * mult),
    }));
    return { loaiAn, ketQua, tong: ketQua.reduce((s, k) => s + k.soLuong, 0) };
  });
};

/** Tổng theo cột (mỗi Kết quả, cộng dồn mọi Loại án) — hàng "Tổng cộng". */
export const tinhTongTheoKetQua = (rows: ReturnType<typeof tinhBanLoaiAnRows>) =>
  KET_QUA_LIST.map(kq => ({
    key: kq,
    soLuong: rows.reduce((s, r) => s + (r.ketQua.find(k => k.key === kq)?.soLuong ?? 0), 0),
  }));

// ---------------------------------------------------------------------------
// Màn "So sánh số đơn theo loại án & kết quả xử lý"
// ---------------------------------------------------------------------------

export default function SoSanhLoaiAnChiTiet({ initialPeriod = "week", onBack }: {
  /** Kỳ đang chọn ở Dashboard lúc bấm "Chi tiết" — mở màn này với đúng kỳ đó. */
  initialPeriod?: KyBaoCao;
  onBack?: () => void;
}) {
  const [ky, setKy] = useState<KyBaoCao>(initialPeriod);

  const rows = tinhBanLoaiAnRows(ky);
  const tongTheoKetQua = tinhTongTheoKetQua(rows);
  const tongTatCa = tongTheoKetQua.reduce((s, k) => s + k.soLuong, 0);

  // Giá trị lớn nhất trong toàn ma trận — chuẩn hoá độ đậm ô nhiệt (heatmap)
  // theo 1 thang màu xanh duy nhất (sequential), giúp so sánh độ lớn giữa các
  // ô trực quan hơn bảng số thuần tuý.
  const maxO = Math.max(1, ...rows.flatMap(r => r.ketQua.map(k => k.soLuong)));
  const heatmapStyle = (soLuong: number): React.CSSProperties => {
    if (soLuong <= 0) return {};
    const cuongDo = 0.12 + (soLuong / maxO) * 0.48;
    return { backgroundColor: `rgba(59, 130, 246, ${cuongDo})`, color: cuongDo > 0.42 ? "#fff" : "#1e3a8a", fontWeight: 600 };
  };

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại Trang chủ
        </button>
        {/* Bộ lọc kỳ riêng của màn này — mở ra đã đúng kỳ đang chọn ở Trang chủ,
            đổi tiếp ở đây không ảnh hưởng Trang chủ. */}
        <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
          {(["day", "week", "month", "year"] as const).map((p, idx) => {
            const labels = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay"];
            return (
              <button
                key={p}
                onClick={() => setKy(p)}
                className={`px-3.5 py-1.5 text-[12px] font-medium rounded-[4px] transition-all duration-200 ${ky === p ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]" : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 border border-transparent"}`}
              >
                {labels[idx]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng nhiệt (heatmap) Loại án × Kết quả xử lý, độ đậm ô = số lượng
          (thang xanh liên tục, chuẩn hoá theo giá trị lớn nhất toàn bảng) để mắt
          bắt được điểm nóng ngay mà không cần nhóm thêm trục nào khác. Không
          nhóm theo "Vụ chuyên môn": 1 Loại án không gắn cố định 1 Vụ trong thực
          tế (vd. vụ án hình sự vẫn có thể phát sinh phần dân sự). */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-3">
          <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
            <BarChart3 size={18} className="text-[#8b1a1a]" />
            So sánh số đơn theo loại án & kết quả xử lý
          </h3>
          <span className="text-[12.5px] text-[#64748b] whitespace-nowrap">
            Tổng: <span className="font-bold text-[#0f172a]">{tongTatCa}</span> đơn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[#eff6ff]">
                <th className="px-3 py-2.5 font-bold text-[#3b82f6] text-left whitespace-nowrap">Loại án</th>
                {KET_QUA_LIST.map(kq => (
                  <th key={kq} className="px-2 py-2.5 font-semibold text-[#3b82f6] text-center min-w-[100px] leading-tight whitespace-nowrap">
                    {kq}
                  </th>
                ))}
                <th className="px-3 py-2.5 font-bold text-[#3b82f6] text-center whitespace-nowrap">∑ Tổng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
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
    </div>
  );
}
