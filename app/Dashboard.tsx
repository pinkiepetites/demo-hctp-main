import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
} from "lucide-react";
import { type VanBanTrinh, type LocVanBanTuTrangChu } from "./components/QuanLyVanBan";
import ChiSoTrangChu, { type DonChiSo, type BoLocTuTrangChu } from "./ChiSoTrangChu";
import TrangChuTruongPhong, { TieuDeMuc, NhomCon, nguoiXemTrangChu } from "./TrangChuTruongPhong";
import { DU_LIEU_CAN_BO } from "./HieuSuatCanBoChiTiet";

// "Kết quả xử lý đơn" — bar ngang xếp hạng theo giá trị giảm dần, mỗi hạng mục một màu riêng
// (nominal categorical, không phải chuỗi theo Vụ GĐKT), nhãn giá trị + % đặt ngay đầu mút bar.
const KetQuaXuLyDonChart = ({ items, maxValue }: {
  items: { label: string; value: number; percent: number; color: string }[];
  maxValue: number;
}) => {
  const ticks = Array.from({ length: maxValue + 1 }, (_, i) => i);
  return (
    <div className="pt-1 flex-1 flex flex-col">
      {/* flex-1 + justify-around: các thanh trải đều theo chiều cao card thay vì
          dồn lên đỉnh, để khối này cao bằng biểu đồ cột bên cạnh mà không phải
          bơm độ dày thanh lên cho đầy chỗ. */}
      <div className="relative flex-1 min-h-[180px]">
        <div className="absolute left-[168px] right-2 top-0 bottom-0 pointer-events-none">
          {ticks.map(t => (
            <div key={t} className="absolute top-0 bottom-0 border-l border-dashed border-[#f1f5f9]" style={{ left: `${(t / maxValue) * 100}%` }} />
          ))}
        </div>
        <div className="h-full flex flex-col justify-around relative">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-2 h-[20px]">
              <span className="w-[160px] flex-shrink-0 text-[12px] text-[#475569] text-right truncate">{item.label}</span>
              <div className="flex-1 relative h-full mr-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-r-[4px] transition-all duration-700"
                  style={{ width: `${Math.max((item.value / maxValue) * 100, item.value ? 2 : 0)}%`, backgroundColor: item.color }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#0f172a] whitespace-nowrap"
                  style={{ left: `calc(${(item.value / maxValue) * 100}% + 8px)` }}
                >
                  {item.value} ({item.percent.toFixed(1).replace(".", ",")}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#e2e8f0]">
        <span className="w-[160px] flex-shrink-0" />
        <div className="flex-1 flex justify-between text-[11px] text-[#94a3b8] mr-2">
          {ticks.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
      <div className="text-center text-[11px] text-[#94a3b8] mt-1">Số đơn</div>
    </div>
  );
};

// "So sánh số đơn theo loại án & kết quả" — mỗi loại án là một nhóm cột, trong nhóm là
// 6 cột nhỏ theo hạng mục kết quả (cùng màu với KetQuaXuLyDonChart), giúp so trực quan
// loại án nào phát sinh nhiều đơn trùng/thụ lý mới/v.v. nhất trong kỳ.
const SoSanhLoaiAnChart = ({ groups, categories, maxValue }: {
  groups: { loaiAn: string; values: Record<string, number> }[];
  categories: readonly { key: string; label: string; color: string }[];
  maxValue: number;
}) => {
  const ticks = Array.from({ length: maxValue + 1 }, (_, i) => i);
  return (
    <div>
      <div className="flex items-end h-[300px] gap-1 pt-0.5 relative">
        <div className="absolute left-0 top-0 bottom-5 w-6 flex flex-col justify-between text-[11px] text-[#94a3b8] font-medium">
          {[...ticks].reverse().map(t => <span key={t}>{t}</span>)}
        </div>
        <div className="absolute left-8 right-0 top-0 bottom-5 border-l border-b border-[#e2e8f0]">
          {ticks.slice(1).map(t => (
            <div key={t} className="absolute w-full border-t border-dashed border-[#f1f5f9]" style={{ bottom: `${(t / maxValue) * 100}%` }} />
          ))}
        </div>
        <div className="ml-8 w-full flex justify-around items-end h-full z-10 pb-5">
          {groups.map(g => (
            <div key={g.loaiAn} className="flex flex-col items-center gap-1 relative h-full justify-end">
              <div className="flex items-end gap-[6px] h-full">
                {categories.map(cat => {
                  const v = g.values[cat.key] ?? 0;
                  const pct = (v / maxValue) * 100;
                  return (
                    <div key={cat.key} className="relative w-[32px] h-full flex flex-col justify-end" title={`${cat.label}: ${v}`}>
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#0f172a] whitespace-nowrap pointer-events-none"
                        style={{ bottom: `calc(${pct}% + 4px)` }}
                      >
                        {v}
                      </span>
                      <div
                        className="w-full rounded-t-[4px] transition-all duration-700 hover:brightness-110"
                        style={{ height: `${pct}%`, minHeight: v ? "2px" : 0, backgroundColor: cat.color }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-[13px] font-semibold text-[#334155] absolute bottom-0 translate-y-full mt-2 w-full text-center whitespace-nowrap">{g.loaiAn}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-[#f1f5f9] flex-wrap">
        {categories.map(cat => (
          <div key={cat.key} className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569]">
            <div className="w-3 h-3 rounded-[3px] shadow-sm" style={{ backgroundColor: cat.color }}></div>
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard({ onXemChiTietHieuSuat, onXemPheDuyet, vanBanList = [], currentRole = "can-bo", donList = [], onMoDanhSachDon, onMoDanhSachVanBan }: {
  onXemChiTietHieuSuat?: () => void;
  onXemPheDuyet?: () => void;
  vanBanList?: VanBanTrinh[];
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  /** Đúng tập dữ liệu mà màn Danh sách đơn đang dùng — để số trên Trang chủ và số
   *  dòng mở ra sau khi bấm không bao giờ lệch nhau. */
  donList?: DonChiSo[];
  /** Bấm một chỉ số → sang Danh sách đơn đã lọc sẵn theo chỉ số đó. */
  onMoDanhSachDon?: (loc: BoLocTuTrangChu) => void;
  /** Sang màn Danh sách văn bản, kèm bộ lọc của khối vừa bấm — dùng cho cảnh báo
   *  văn bản bị trả lại. */
  onMoDanhSachVanBan?: (loc?: LocVanBanTuTrangChu) => void;
} = {}) {
  // Chỉ Trưởng phòng / Phó-Chánh Văn phòng / Lãnh đạo Tòa / Chánh án-Phó Chánh án
  // mới thấy tầng "Việc của tôi" (duyệt/ký) và bảng tải việc của CẢ PHÒNG — đây
  // là những vai trò nằm trong luồng ký duyệt văn bản và có quyền phân công.
  // Cán bộ thấy bản rút gọn "Tải việc & hiệu suất của tôi" thay vì khối trắng.
  const hienThiTheDuyet = currentRole === "truong-phong" || currentRole === "pho-vp" || currentRole === "chanh-an" || currentRole === "lanh-dao";

  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year" | "custom">("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Số liệu gốc lấy từ báo cáo "Phòng Hành chính Tư pháp" (dòng Tổng cộng, kỳ 01/03/2026 - 18/03/2026)
  // — đây là nguồn duy nhất để tính 4 số của card KPI, thay vì gõ tay từng số như trước.
  const hctpReportTuanNay = {
    tongDonNhan: 27,           // "Tổng số đơn đã xử lý HCTP"
    traLaiDon: 1,               // "Trả lại đơn"
    khongThuocThamQuyen: 1,     // "Đơn không thuộc thẩm quyền"
    chuaDuDieuKien: 1,          // "Đơn chưa đủ điều kiện"
    gdkt1: { trung: 5, thuLyMoi: 3 },
    gdkt2: { trung: 0, thuLyMoi: 0 },
    gdkt3: { trung: 0, thuLyMoi: 0 },
    conLaiChuaXuLy: 0,          // "Đơn còn lại chưa xử lý"
    chuyenToaAnKhac: 1,         // "Chuyển Toà án khác"
  };

  // "Kết quả xử lý đơn" — xếp hạng 6 hạng mục xử lý của kỳ báo cáo theo số lượng giảm dần,
  // % tính trên tổng số đơn đã nhận (tongDonNhan), đúng như cách báo cáo Phòng HCTP trình bày.
  const ketQuaXuLyDonItems = [
    { label: "Đơn trùng", value: hctpReportTuanNay.gdkt1.trung + hctpReportTuanNay.gdkt2.trung + hctpReportTuanNay.gdkt3.trung, color: "#ef4444" },
    { label: "Đơn thụ lý mới", value: hctpReportTuanNay.gdkt1.thuLyMoi + hctpReportTuanNay.gdkt2.thuLyMoi + hctpReportTuanNay.gdkt3.thuLyMoi, color: "#3b82f6" },
    { label: "Chưa đủ điều kiện", value: hctpReportTuanNay.chuaDuDieuKien, color: "#eab308" },
    { label: "Trả lại đơn", value: hctpReportTuanNay.traLaiDon, color: "#f97316" },
    { label: "Không thuộc thẩm quyền", value: hctpReportTuanNay.khongThuocThamQuyen, color: "#06b6d4" },
    { label: "Chuyển Toà án khác", value: hctpReportTuanNay.chuyenToaAnKhac, color: "#8b5cf6" },
  ]
    .map(item => ({ ...item, percent: hctpReportTuanNay.tongDonNhan ? (item.value / hctpReportTuanNay.tongDonNhan) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
  const ketQuaXuLyDonMax = Math.max(...ketQuaXuLyDonItems.map(i => i.value), 1) + 1;


  // 6 hạng mục kết quả xử lý — dùng chung màu cho cả bảng xếp hạng "Kết quả xử lý đơn"
  // và biểu đồ so sánh theo loại án bên dưới, để cùng một hạng mục luôn cùng một màu.
  const KET_QUA_CATEGORIES = [
    { key: "donTrung", label: "Đơn trùng", color: "#ef4444" },
    { key: "thuLyMoi", label: "Thụ lý mới", color: "#3b82f6" },
    { key: "chuaDuDieuKien", label: "Chưa đủ điều kiện", color: "#eab308" },
    { key: "traLai", label: "Trả lại", color: "#f97316" },
    { key: "khongThamQuyen", label: "Không thẩm quyền", color: "#06b6d4" },
    { key: "chuyenToaKhac", label: "Chuyển Toà án khác", color: "#8b5cf6" },
  ] as const;

  // Phân rã 6 hạng mục kết quả (đã có tổng ở hctpReportTuanNay/ketQuaXuLyDonItems) theo
  // loại án (Hình sự / Dân sự / Chưa xác định) — cộng theo cột phải khớp đúng tổng hạng mục:
  // Đơn trùng 5 (3+2+0), Thụ lý mới 3 (2+1+0), Chưa đủ điều kiện 1 (1+0+0), Trả lại 1 (1+0+0),
  // Không thẩm quyền 1 (1+0+0), Chuyển Toà án khác 1 (0+1+0). Chưa xác định chưa xử lý (=0 cả 6).
  const soSanhLoaiAnData = [
    { loaiAn: "Hình sự", values: { donTrung: 3, thuLyMoi: 2, chuaDuDieuKien: 1, traLai: 1, khongThamQuyen: 1, chuyenToaKhac: 0 } },
    { loaiAn: "Dân sự", values: { donTrung: 2, thuLyMoi: 1, chuaDuDieuKien: 0, traLai: 0, khongThamQuyen: 0, chuyenToaKhac: 1 } },
    { loaiAn: "Chưa xác định", values: { donTrung: 0, thuLyMoi: 0, chuaDuDieuKien: 0, traLai: 0, khongThamQuyen: 0, chuyenToaKhac: 0 } },
  ];
  const soSanhLoaiAnMax = Math.max(
    ...soSanhLoaiAnData.flatMap(g => KET_QUA_CATEGORIES.map(cat => g.values[cat.key]))
  ) + 2;



  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      {/* ══ TẦNG 1-3: việc của tôi → cảnh báo → tải việc của phòng ══
          Xếp trên cùng theo thứ tự đòi hành động: càng lên trên càng cần xử lý
          ngay. Số liệu kỳ (tầng 4) nằm dưới vì đó là phần để đọc và trích xuất
          báo cáo, không phải phần để hành động. */}
      <TrangChuTruongPhong
        donList={donList}
        vanBanList={vanBanList}
        canBoList={DU_LIEU_CAN_BO}
        currentRole={currentRole}
        laVaiTroQuanLy={hienThiTheDuyet}
        onMoDanhSachDon={onMoDanhSachDon}
        onMoPheDuyet={onXemPheDuyet}
        onMoDanhSachVanBan={onMoDanhSachVanBan}
        onXemHieuSuat={onXemChiTietHieuSuat}
      />

      {/* ══ TẦNG 4a: hiện trạng đơn — đếm trực tiếp từ danh sách đơn ══
          "Hiện trạng đơn" là MỤC CHA, hai khối bên trong là con. Dùng TieuDeMuc +
          NhomCon để quan hệ đó nhìn ra được — trước đây cả ba cùng một kiểu chữ
          nên đọc như ba mục ngang hàng. */}
      <div className="space-y-4">
        <TieuDeMuc
          icon={<BarChart3 size={19} />}
          tieuDe="Hiện trạng đơn"
          moTa="Đếm trực tiếp trên danh sách đơn tại thời điểm hiện tại — bấm vào số nào mở đúng danh sách đó."
        />
        {/* Phạm vi "Của tôi / Toàn phòng" nằm ngay trong khối này, không tách thành
            khối riêng ở trên — hai khối cùng đếm đơn đặt cạnh nhau thì người đọc
            phải tự đối chiếu hai con số. Vai không quản lý mở mặc định ở "Của tôi",
            nên cán bộ luôn có số liệu của mình mà không cần khối riêng. */}
        <NhomCon>
          <ChiSoTrangChu rows={donList} onMoDanhSach={onMoDanhSachDon}
            // Cùng một "tôi" với Tầng 1-3 ở trên: bốn vai trò quản lý xem chip
            // "Của tôi" cũng phải ra cùng một tập đơn, nếu không thì trên cùng
            // một màn có hai định nghĩa "tôi" khác nhau.
            toiLaAi={nguoiXemTrangChu(currentRole)}
            macDinhCuaToi={!hienThiTheDuyet}
            onXemHieuSuat={onXemChiTietHieuSuat} />
        </NhomCon>
      </div>

      {/* ══ TẦNG 4b: báo cáo kỳ ══
          Khối này KHÔNG lấy từ danh sách đơn mà từ báo cáo chốt kỳ của Phòng HCTP,
          nên tổng của nó không trùng với "Hiện trạng đơn" phía trên — hai khối trả
          lời hai câu hỏi khác nhau: "bây giờ đang có gì" và "kỳ vừa rồi làm được gì".
          Vì vậy tiêu đề và bộ lọc kỳ phải nằm TRONG khối, ghi rõ nguồn, để không ai
          hiểu nhầm là hai con số phải khớp nhau. */}
      <div className="space-y-4">
        <TieuDeMuc
          icon={<Calendar size={19} />}
          tieuDe="Báo cáo kết quả xử lý theo kỳ"
          moTa={<>Nguồn: báo cáo chốt kỳ của Phòng Hành chính Tư pháp. Số liệu chốt theo kỳ nên
            không trùng với phần "Hiện trạng đơn" ở trên.</>}
        />
        <NhomCon>

      {/* Bộ lọc kỳ — chỉ tác động lên các biểu đồ ngay bên dưới */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-[8px] border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-5 flex-wrap w-full">
          <span className="text-[13px] font-medium text-[#475569]">Kỳ báo cáo:</span>
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

          {/* Ô "Lọc theo Cán bộ" cũ đã gỡ cùng widget hiệu suất — nó chỉ lọc đúng
              widget đó, để lại thì thành một ô chọn bấm vào không đổi gì trên màn. */}
        </div>
      </div>

      {/* Cụm 4 card "Thống kê đơn nhận" cũ đã gỡ vì hai lý do:
          · "Tổng đơn nhận" (27) trùng vai trò với "Tổng số đơn" ở khối Hiện trạng
            nhưng ra số khác — hai tổng khác nhau trên cùng một màn là lỗi nặng nhất
            một dashboard có thể mắc;
          · Hình sự / Dân sự / Chưa xác định không phải số đếm mà là số suy ra từ
            tổng theo tỉ lệ cố định 14/10/3, nên không dùng để ra quyết định được.
          Phân rã theo loại án vẫn còn ở biểu đồ "So sánh số đơn theo loại án" bên dưới.

          Cụm "Duyệt tài liệu" cũ cũng đã gỡ — Tầng 1 ("Việc của tôi hôm nay") thay thế,
          tách rõ duyệt / ký là hai hành động khác nhau và có thêm cảnh báo chờ quá lâu. */}

      {/* ROW 2: Chart & Alerts */}
      <div className="grid grid-cols-3 gap-5">
        {/* Lượng đơn Chart */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3b82f6]" />
              So sánh số đơn theo loại án & kết quả
            </h3>
          </div>

          <div className="flex-1 p-3 flex flex-col justify-center">
            <SoSanhLoaiAnChart groups={soSanhLoaiAnData} categories={KET_QUA_CATEGORIES} maxValue={soSanhLoaiAnMax} />
          </div>
        </div>

        {/* Kết quả xử lý đơn + Alerts / To-do
            flex-1 để card cao bằng biểu đồ so sánh bên trái — hai khối đứng cạnh
            nhau mà lệch chiều cao thì khoảng trắng thừa trông như thiếu nội dung. */}
        <div className="col-span-1 flex flex-col gap-5">
          <div className="flex-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <h3 className="text-[13px] font-bold text-[#8b1a1a] uppercase tracking-wide">Kết quả xử lý đơn</h3>
            </div>
            <div className="flex-1 p-5 flex flex-col">
              <KetQuaXuLyDonChart items={ketQuaXuLyDonItems} maxValue={ketQuaXuLyDonMax} />
            </div>
          </div>

          {/* Đã gỡ khỏi chỗ này 2 khối:
              · Hộp "Cần chú ý / Quá hạn" — nội dung là dữ liệu cứng (`[1,2].map` với
                mã đơn và tên cán bộ viết tay). Tầng 2 thay thế bằng cảnh báo thật.
              · Donut "Cơ cấu xử lý đơn" — cùng một câu chuyện với dải 6 chip
                "Đơn theo trạng thái thụ lý" ở khối Hiện trạng, nhưng lấy nguồn khác
                nên ra số khác. Giữ cả hai thì người đọc phải tự đoán bên nào đúng. */}
        </div>
      </div>

        </NhomCon>
      </div>

      {/* Widget "Hiệu suất cán bộ" cũ đã gỡ: Tầng 3 ("Tải việc của phòng") thay
          thế, và giữ cả hai thì trên cùng một màn có hai danh sách cán bộ khác
          nhau — đúng thứ lỗi mà tầng đó sinh ra để dẹp. */}
    </div>
  );
}
