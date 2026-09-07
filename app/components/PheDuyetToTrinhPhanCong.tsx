import React, { useState } from "react";
import { X, Pencil, Ban, Check, MessageSquare, Save } from "lucide-react";

// GHI CHÚ CHO DEV:
// Modal này bật lên khi Trưởng phòng/Chánh án ấn "Kiểm tra danh sách đơn" trong màn hình chi tiết Tờ trình.
//
// LOGIC ĐẶC BIỆT - TỜ TRÌNH CHỈ CÒN 1 ĐƠN:
// - Nếu tờ trình chỉ có 1 đơn, và Trưởng phòng/Phó CVP bấm "Trả lại" đơn đó,
//   thì thao tác này tương đương từ chối toàn bộ Tờ trình.
//   Khi lưu: Tờ trình chuyển sang trạng thái "Bị trả lại" (BiTraLai), không còn ở ChoDuyet.
//   Backend cần xử lý: nếu danhSachDon sau khi lọc == 0 đơn → tờ trình.trangThai = "BiTraLai".
// - Với Chánh án: nếu chỉ có 1 đơn và bị cho ý kiến (chỉ đạo trả lại),
//   đơn đó quay về cán bộ nhưng Tờ trình vẫn giữ nguyên (tờ trình đã ký rồi).
// - Sau khi lưu, cần dispatch event "SYNC_VAN_BAN" kèm ID tờ trình để các màn khác reload.

interface DonThu {
  id: string;
  nguoiGui: string;
  soBA: string;
  hinhThuc: string;
  toaAn?: string;
  ngayBA?: string;
  thuTuc?: string;
  diaChi?: string;
  ghiChu?: string;
  trangThaiXuly?: "tra_lai" | "binh_thuong";
}

interface PheDuyetToTrinhModalProps {
  onClose: () => void;
  role: "truong_phong" | "chanh_an"; // "truong_phong" đại diện cho cả Phó CVP
  danhSachDonBanDau?: DonThu[];
  vanBanId?: string; // ID tờ trình — dùng để dispatch SYNC_VAN_BAN sau khi lưu
}

const DULIEU_MAU: DonThu[] = [
  {
    id: "Mã 7031",
    nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh",
    soBA: "BA_2107",
    hinhThuc: "CV Kiến nghị GĐT, TT",
    toaAn: "Tòa án nhân dân tỉnh Bắc Ninh",
    ngayBA: "21/07/2026",
    thuTuc: "Giám đốc thẩm",
    diaChi: "Phường Phương Sơn, Tỉnh Bắc Ninh",
  },
  {
    id: "Mã 7022",
    nguoiGui: "Hoàng Minh Tú",
    soBA: "112/2026/DS-GDT",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    toaAn: "TAND tỉnh Vĩnh Phúc",
    ngayBA: "20/06/2022",
    thuTuc: "Giám đốc thẩm",
    diaChi: "Phường Hòa Bình, Tỉnh Vĩnh Phúc",
  },
  {
    id: "Mã 7032",
    nguoiGui: "Trần Văn Bình",
    soBA: "33/2024/KDTM-PT",
    hinhThuc: "Đơn đề nghị GĐT/TT",
    toaAn: "TAND tỉnh Hà Nam",
    ngayBA: "15/11/2024",
    thuTuc: "Tái thẩm",
    diaChi: "Xã Minh Tân, Tỉnh Hà Nam",
  },
];

export default function PheDuyetToTrinhModal({ onClose, role, danhSachDonBanDau, vanBanId }: PheDuyetToTrinhModalProps) {
  const [danhSachDon, setDanhSachDon] = useState<DonThu[]>(danhSachDonBanDau || DULIEU_MAU);

  // State cho Modal "Trả lại" (TP/CVP) hoặc "Cho ý kiến" (Chánh án)
  const [modalLyDo, setModalLyDo] = useState<{ idDon: string; type: "tra_lai" | "cho_y_kien" } | null>(null);
  const [lyDoText, setLyDoText] = useState("");

  const handleXacNhanLyDo = () => {
    if (!modalLyDo) return;
    setDanhSachDon(prev => prev.map(don => {
      if (don.id === modalLyDo.idDon) {
        if (modalLyDo.type === "tra_lai") {
          return { ...don, trangThaiXuly: "tra_lai", ghiChu: lyDoText };
        } else {
          return { ...don, ghiChu: lyDoText };
        }
      }
      return don;
    }));
    setModalLyDo(null);
    setLyDoText("");
  };

  const handleLuuToTrinh = () => {
    if (role === "truong_phong") {
      const danhSachMoi = danhSachDon.filter(d => d.trangThaiXuly !== "tra_lai");
      const soTraLai = danhSachDon.length - danhSachMoi.length;
      // EDGE CASE: nếu trả lại hết → tờ trình coi như bị từ chối
      // Backend cần đổi trangThai của Tờ trình từ ChoDuyet sang BiTraLai
      const toTrinhBiTuChoi = danhSachMoi.length === 0;
      if (toTrinhBiTuChoi) {
        alert(`Tờ trình bị từ chối vì toàn bộ ${soTraLai} đơn đã bị trả lại.\nTờ trình sẽ chuyển trạng thái sang "Bị trả lại" và trả về cho cán bộ tạo.`);
      } else {
        alert(`Đã lưu! Tờ trình còn ${danhSachMoi.length} đơn (đã trả lại ${soTraLai} đơn).\nCác đơn trả lại cập nhật ngược về danh sách chờ của cán bộ.`);
      }
      // Dispatch để các màn khác (danh sách VB, PanelChiTiet) sync lại
      window.dispatchEvent(new CustomEvent("SYNC_VAN_BAN", {
        detail: { vanBanId, toTrinhBiTuChoi, soConLai: danhSachMoi.length, danhSachDon: danhSachMoi },
      }));
    } else {
      alert(`Đã lưu ý kiến Chánh án! Các ý kiến chỉ đạo đã được ghi nhận vào cột ghi chú.\nTrạng thái đơn sẽ được trả lại cán bộ nhưng Tờ trình vẫn giữ nguyên.`);
      window.dispatchEvent(new CustomEvent("SYNC_VAN_BAN", {
        detail: { vanBanId, toTrinhBiTuChoi: false, danhSachDon },
      }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl flex flex-col w-[1000px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1d2e4f] text-white px-4 py-3 rounded-t-[4px] flex justify-between items-center shrink-0">
          <h2 className="text-[15px] font-bold">
            Kiểm tra & Phê duyệt Danh sách Đơn (Tờ trình phân công)
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-3 text-[13px] text-[#333] flex justify-between items-end">
            <span>Danh sách đơn đính kèm Tờ trình <b>({danhSachDon.length} đơn)</b></span>
            <span className="text-[12px] text-[#888] bg-[#f5f5f5] px-2 py-1 border border-[#e0e0e0] rounded">
              Vai trò thao tác: <b>{role === "truong_phong" ? "Trưởng phòng / Phó CVP" : "Chánh án"}</b>
            </span>
          </div>

          <table className="w-full text-[13px] border-collapse border border-[#ddd]">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="border border-[#ddd] px-3 py-2 text-left w-[180px]">Mã đơn</th>
                <th className="border border-[#ddd] px-3 py-2 text-left">Thông tin đơn</th>
                <th className="border border-[#ddd] px-3 py-2 text-left w-[180px]">BA/QĐ</th>
                <th className="border border-[#ddd] px-3 py-2 text-left w-[250px]">Ghi chú / Ý kiến</th>
                <th className="border border-[#ddd] px-3 py-2 text-center w-[180px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDon.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#888] italic">Tờ trình hiện không còn đơn nào.</td>
                </tr>
              )}
              {danhSachDon.map(don => {
                const biTraLai = don.trangThaiXuly === "tra_lai";
                return (
                  <tr key={don.id} className={biTraLai ? "bg-[#fde8e8] opacity-70" : "hover:bg-[#f9f9f9]"}>
                    <td className="border border-[#ddd] px-3 py-2 align-top">
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent("MO_CHI_TIET_DON", { detail: don.id }));
                            onClose();
                          }}
                          className="text-[#1a73e8] hover:text-[#1152a3] hover:underline font-medium text-[13px] transition-colors"
                        >
                          {don.id}
                        </button>
                        <div className="text-[12px] text-[#333] leading-5">
                          <div><span className="text-[#666]">Tòa án: </span><span className="font-medium text-[#222]">{don.toaAn || don.nguoiGui}</span></div>
                          <div><span className="text-[#666]">Số BA/QĐ: </span><span>{don.soBA}</span></div>
                          <div><span className="text-[#666]">Ngày BA/QĐ: </span><span>{don.ngayBA || "—"}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="border border-[#ddd] px-3 py-2 align-top font-medium text-[#1a5a96]">
                      <div className="space-y-1.5 text-[12px] text-[#333] leading-5">
                        <div>{don.nguoiGui}</div>
                        {don.diaChi && (
                          <div className="text-[#666]">{don.diaChi}</div>
                        )}
                        <div><span className="text-[#666]">Hình thức: </span>{don.hinhThuc}</div>
                        {don.thuTuc && (
                          <div><span className="text-[#666]">Thủ tục: </span>{don.thuTuc}</div>
                        )}
                      </div>
                    </td>
                    <td className="border border-[#ddd] px-3 py-2 align-top text-[12px] text-[#333]">
                      <div className="space-y-1.5 leading-5">
                        <div><span className="text-[#666]">Số BA/QĐ:</span> {don.soBA}</div>
                        <div><span className="text-[#666]">Ngày BA/QĐ:</span> {don.ngayBA || "—"}</div>
                        <div><span className="text-[#666]">Tòa xét xử:</span> {don.toaAn || "—"}</div>
                      </div>
                    </td>
                    <td className="border border-[#ddd] px-3 py-2 align-top">
                      {don.ghiChu && (
                        <div className="text-[#8b1a1a] font-medium text-[12px] bg-[#fde8e8] px-2 py-1 rounded border border-[#f5b7b7] inline-block w-full whitespace-pre-wrap">
                          {don.ghiChu}
                        </div>
                      )}
                      {!don.ghiChu && !biTraLai && (
                        <div className="text-[12px] text-[#666] italic">Chưa có ý kiến</div>
                      )}
                      {biTraLai && <div className="text-[#8b1a1a] text-[11px] mt-1 font-bold">(Đánh dấu sẽ bị trả lại)</div>}
                    </td>
                    <td className="border border-[#ddd] px-3 py-2 text-center align-top">
                      {!biTraLai && role === "truong_phong" && (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("MO_CHI_TIET_DON", { detail: don.id }));
                              onClose();
                            }}
                            title="Đến màn sửa đơn"
                            className="text-[#1a5a96] hover:text-[#0d3d6b] flex items-center gap-1 text-[12px] border border-[#a9c9f4] px-2 py-1.5 rounded-[3px] bg-white transition-colors hover:bg-[#e8f4ff]"
                          >
                            Sửa
                          </button>
                          <button 
                            onClick={() => setModalLyDo({ idDon: don.id, type: "tra_lai" })}
                            title="Trả lại riêng đơn này"
                            className="text-[#8b1a1a] hover:text-[#6e1414] flex items-center gap-1 text-[12px] border border-[#f5b7b7] px-2 py-1.5 rounded-[3px] bg-white transition-colors hover:bg-[#fde8e8]"
                          >
                            <Ban size={13} /> Trả lại
                          </button>
                        </div>
                      )}
                      {role === "chanh_an" && (
                        <button 
                          onClick={() => setModalLyDo({ idDon: don.id, type: "cho_y_kien" })}
                          className="text-[#6d28d9] hover:text-[#4c1d95] flex items-center gap-1.5 text-[12px] border border-[#d8b4fe] px-3 py-1.5 rounded-[3px] bg-white mx-auto transition-colors hover:bg-[#f3e8ff]"
                        >
                          <MessageSquare size={13} /> Cho ý kiến
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-[#ddd] px-4 py-3 bg-[#f9f9f9] flex justify-end gap-3 rounded-b-[4px] shrink-0">
          <button onClick={onClose} className="px-4 py-[6px] border border-[#ccc] rounded-[3px] text-[13px] bg-white hover:bg-[#f5f5f5] transition-colors font-medium text-[#333]">
            Đóng
          </button>
          <button 
            onClick={handleLuuToTrinh}
            className="px-4 py-[6px] bg-[#8b1a1a] text-white rounded-[3px] text-[13px] hover:bg-[#6e1414] transition-colors flex items-center gap-1.5 font-medium border border-[#6e1414]"
          >
            <Save size={14} /> 
            {role === "truong_phong" ? "Lưu & Cập nhật Tờ trình" : "Lưu ý kiến"}
          </button>
        </div>
      </div>

      {/* LỚP MODAL CON: TRẢ LẠI / CHO Ý KIẾN */}
      {modalLyDo && (
        <div className="fixed inset-0 bg-black/40 z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] w-[500px] shadow-2xl border border-[#bbb]">
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex justify-between items-center rounded-t-[4px]">
              <span className="text-[14px] font-semibold">
                {modalLyDo.type === "tra_lai" ? `Trả lại đơn ${modalLyDo.idDon}` : `Cho ý kiến đối với đơn ${modalLyDo.idDon}`}
              </span>
              <button onClick={() => setModalLyDo(null)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4">
              <label className="block text-[13px] font-medium text-[#333] mb-2">
                {modalLyDo.type === "tra_lai" ? "Lý do trả lại (bắt buộc)" : "Nội dung ý kiến chỉ đạo"}
              </label>
              <textarea 
                className="w-full border border-[#ccc] rounded-[3px] p-2.5 text-[13px] focus:outline-none focus:border-[#1a73e8] resize-none" 
                rows={4}
                value={lyDoText}
                onChange={e => setLyDoText(e.target.value)}
                placeholder="Nhập nội dung..."
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#eee]">
                <button onClick={() => setModalLyDo(null)} className="px-4 py-[5px] border border-[#ccc] rounded-[3px] text-[13px] bg-white hover:bg-[#f5f5f5] font-medium">Hủy</button>
                <button onClick={handleXacNhanLyDo} className="px-4 py-[5px] bg-[#8b1a1a] text-white rounded-[3px] text-[13px] font-medium hover:bg-[#6e1414]">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
