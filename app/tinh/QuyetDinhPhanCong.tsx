import { useState } from "react";
import { Input, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import {
  X, FileText, Check, Send, Hash, Ban, Eye, Loader2,
  ChevronRight, AlertCircle, List,
} from "lucide-react";
import type { DonPhanCong } from "../components/PhanCongThamPhanScreen";

/** Mỗi quyết định bám đúng một đơn, nên khoá theo `donId`. */
export type TrangThaiQD = "mo" | "daLuu" | "choKy" | "daKy" | "huyKy" | "dung";

export interface QD {
  soVanBan: string;
  /** Giữ số tạm để huỷ ký số thì trả về được trạng thái ban đầu. */
  soTam: string;
  ngayBanHanh: string;
  donViSoanThao: string;
  ghiChu: string;
  trangThai: TrangThaiQD;
  soDaLay: boolean;
  soKiemSo: number;
}

interface Props {
  don: DonPhanCong[];
  onClose: () => void;
  /**
   * Mở biểu mẫu bằng màn xem sẵn có của hệ thống — popup này không tự dựng
   * lại trang A4.
   */
  onXemBieuMau?: (don: DonPhanCong, qd: QD) => void;
  /** Báo trạng thái quyết định ra ngoài để kho văn bản chung cập nhật theo. */
  onDoiTrangThai?: (don: DonPhanCong, qd: QD) => void;
  /** Mở màn Danh sách văn bản, lọc theo mã đơn của quyết định đang xem. */
  onSangDanhSachVanBan?: (maDon: string) => void;
}

const toYmD = () => dayjs().format("YYYY-MM-DD");

/** Số tạm của quyết định chưa lấy số chính thức. */
const soTam = (n: number) => `QDTĐ${String(n).padStart(3, "0")}/2026`;

export default function QuyetDinhPhanCong({ don, onClose, onXemBieuMau, onDoiTrangThai, onSangDanhSachVanBan }: Props) {
  const donDaLập = don.filter(d => d.thamPhan);
  const [qd, setQd] = useState<Record<number, QD>>(
    Object.fromEntries(
      donDaLập.map((d, i) => {
        const tam = soTam(i + 1);
        return [
          d.id,
          {
            soVanBan: tam,
            soTam: tam,
            ngayBanHanh: toYmD(),
            donViSoanThao: "Toà án nhân dân tỉnh Hà Nội",
            ghiChu: "",
            trangThai: "mo" as TrangThaiQD,
            soDaLay: false,
            soKiemSo: 0,
          },
        ];
      }),
    ),
  );
  const [idDangXem, setIdDangXem] = useState<number>(donDaLập[0]?.id ?? 0);
  const [thongBao, setThongBao] = useState<{ noiDung: string; loi?: boolean } | null>(null);
  const [dangLaySo, setDangLaySo] = useState(false);

  const capNhat = (id: number, k: keyof QD, v: QD[keyof QD]) =>
    setQd(p => ({ ...p, [id]: { ...p[id], [k]: v } }));

  const donHienTai = donDaLập.find(d => d.id === idDangXem);
  const qdHienTai = qd[idDangXem];
  // Biểu mẫu chính thức chỉ mở được sau khi quyết định đã lưu. "Đã dừng" đưa
  // bản nháp về trạng thái chưa lưu nên cũng phải lưu lại trước khi xem.
  const daLuuQD =
    !!qdHienTai && ["daLuu", "choKy", "daKy", "huyKy"].includes(qdHienTai.trangThai);
  // ── Vòng đời: Lưu -> Gửi trình ký -> Lấy số / Hủy ký số -> Dừng ──────────
  /** Báo ra ngoài mỗi khi trạng thái quyết định đổi, để kho văn bản chung
   *  cập nhật theo — nếu không, mở màn Danh sách văn bản sẽ không thấy nó. */
  const dongBo = (id: number, trangThai: QD["trangThai"]) => {
    const d = donDaLập.find(x => x.id === id);
    const q = qd[id];
    if (d && q) onDoiTrangThai?.(d, { ...q, trangThai });
  };

  const luuQD = () => {
    if (!qdHienTai) return;
    capNhat(idDangXem, "trangThai", "daLuu");
    dongBo(idDangXem, "daLuu");
    setThongBao({ noiDung: `Đã lưu quyết định ${qdHienTai.soVanBan} cho đơn ${donHienTai?.soThuLy}.` });
  };

  const guiTrinhKy = () => {
    if (!qdHienTai || qdHienTai.trangThai !== "daLuu") return;
    capNhat(idDangXem, "trangThai", "choKy");
    dongBo(idDangXem, "choKy");
    setThongBao({ noiDung: "Đã gửi trình ký quyết định phân công thành công!" });
  };

  const laySo = (id: number) => {
    setDangLaySo(true);
    // Lấy số là thao tác chờ thiết bị/kho số nên mô phỏng độ trễ ngắn.
    setTimeout(() => {
      const so = qd[id].soKiemSo + 1;
      setQd(p => ({
        ...p,
        [id]: {
          ...p[id],
          soVanBan: `${String(so).padStart(3, "0")}/2026/QD-TAND-HN`,
          soKiemSo: so,
          soDaLay: true,
          trangThai: "daKy",
        },
      }));
      dongBo(id, "daKy");
      setDangLaySo(false);
      setThongBao({ noiDung: `Đã lấy số quyết định và ký số thành công.` });
    }, 600);
  };

  const huyKySo = (id: number) => {
    setQd(p => ({
      ...p,
      [id]: { ...p[id], trangThai: "huyKy", soVanBan: p[id].soTam, soDaLay: false },
    }));
    dongBo(id, "huyKy");
    setThongBao({ noiDung: "Đã huỷ ký số quyết định.", loi: true });
  };

  const dungQD = (id: number) => {
    // Dừng thì trả về số tạm: quyết định bị huỷ, không giữ số đã lấy.
    setQd(p => ({ ...p, [id]: { ...p[id], trangThai: "dung", soVanBan: p[id].soTam, soDaLay: false } }));
    dongBo(id, "dung");
    setThongBao({ noiDung: "Đã dừng quyết định, có thể chỉnh sửa lại." });
  };

  const nhanTrangThai = (t: TrangThaiQD) => {
    if (t === "mo") return { chu: "Chưa lập", cls: "bg-[#f1f3f5] text-[#555] border-[#dee2e6]" };
    if (t === "daLuu") return { chu: "Đã lưu", cls: "bg-[#e7f0fd] text-[#1a5a96] border-[#bcd4f2]" };
    if (t === "choKy") return { chu: "Chờ ký", cls: "bg-[#fff4d6] text-[#8a6d1a] border-[#f0dfa8]" };
    if (t === "daKy") return { chu: "Đã ký", cls: "bg-[#e6f7ec] text-[#1e7a45] border-[#b6e3c8]" };
    if (t === "huyKy") return { chu: "Huỷ ký số", cls: "bg-[#fdecec] text-[#9a2020] border-[#f3c6c6]" };
    return { chu: "Đã dừng", cls: "bg-[#f1f3f5] text-[#555] border-[#dee2e6]" };
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#8b1a1a", borderRadius: 3, fontSize: 13 },
        components: { Input: { controlHeight: 30 }, DatePicker: { controlHeight: 30 } },
      }}
    >
      <div
        className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[8px] shadow-2xl overflow-hidden flex flex-col w-[880px] max-w-full max-h-[88vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#8b1a1a] text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <FileText size={17} className="text-white/85" />
              <div>
                <div className="text-[15px] font-bold">Tạo quyết định phân công thẩm phán</div>
                <div className="text-[11px] text-white/75">
                  Mỗi quyết định gắn với một đơn · {donDaLập.length} đơn đã phân công
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white rounded p-1"
              aria-label="Đóng">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* ── Danh sách đơn ───────────────────────────────────────────── */}
            <div className="w-[270px] shrink-0 border-r border-[#e5e7eb] flex flex-col bg-[#fafafa]">
              <div className="px-3 py-2 text-[11px] font-semibold text-[#555] border-b border-[#e5e7eb]">
                DANH SÁCH ĐƠN ({donDaLập.length})
              </div>
              <div className="flex-1 overflow-auto">
                {donDaLập.map(d => {
                  const t = nhanTrangThai(qd[d.id]?.trangThai ?? "mo");
                  const dangXem = d.id === idDangXem;
                  return (
                    <button key={d.id}
                      onClick={() => setIdDangXem(d.id)}
                      className={`w-full text-left px-3 py-2 border-b border-[#eee] transition-colors
                        ${dangXem ? "bg-[#e7f0fd] border-l-[3px] border-l-[#1a5a96]" : "hover:bg-[#f0f4f8] border-l-[3px] border-l-transparent"}`}>
                      <div className="text-[12px] font-semibold text-[#1d2e4f] flex items-center gap-1">
                        <ChevronRight size={11} className="shrink-0 text-[#9aa4b1]" />
                        <span className="truncate">{d.soThuLy}</span>
                      </div>
                      <div className="text-[11px] text-[#6b7280] truncate pl-4 mt-0.5">{d.nguoiDungDon}</div>
                      <div className="pl-4 mt-1"><span className={`text-[10px] px-1.5 py-[1px] rounded border ${t.cls}`}>{t.chu}</span></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Form + biểu mẫu A4 ─────────────────────────────────────── */}
            {donHienTai && qdHienTai ? (
              <div className="flex-1 flex overflow-hidden">
                <div className="w-[400px] shrink-0 border-r border-[#e5e7eb] overflow-auto p-4 space-y-3">
                  {thongBao && (
                    <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-[3px] border
                      ${thongBao.loi ? "bg-[#fdecec] text-[#9a2020] border-[#f3c6c6]"
                        : "bg-[#e7f0fd] text-[#1a5a96] border-[#bcd4f2]"}`}>
                      <AlertCircle size={13} className="mt-[1px] shrink-0" />
                      <span>{thongBao.noiDung}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">Số quyết định</label>
                    <Input value={qdHienTai.soVanBan} readOnly
                      className="text-[12px] bg-[#f7f7f7]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">Ngày ban hành</label>
                    <DatePicker value={dayjs(qdHienTai.ngayBanHanh)} onChange={d => d && capNhat(donHienTai.id, "ngayBanHanh", d.format("YYYY-MM-DD"))}
                      className="w-full text-[12px]" format="DD/MM/YYYY" allowClear={false} />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">Đơn vị soạn thảo</label>
                    <Input value={qdHienTai.donViSoanThao} onChange={e => capNhat(donHienTai.id, "donViSoanThao", e.target.value)}
                      className="text-[12px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#555] mb-1">Số thụ lý</label>
                      <Input value={donHienTai.soThuLy} readOnly className="text-[12px] bg-[#f7f7f7]" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#555] mb-1">Loại án</label>
                      <Input value={donHienTai.loaiAn} readOnly className="text-[12px] bg-[#f7f7f7]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">
                      Thẩm phân được phân công <span className="text-[#8b1a1a]">*</span>
                    </label>
                    <Input value={donHienTai.thamPhan ?? ""} readOnly className="text-[12px] font-semibold bg-[#f7f7f7]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">Lý do phân công</label>
                    <textarea value={donHienTai.lyDoPhanCong ?? ""} readOnly rows={3}
                      className="w-full px-2 py-1.5 text-[12px] border border-[#e5e7eb] rounded-[3px] bg-[#f7f7f7] resize-none" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1">Ghi chú</label>
                    <textarea value={qdHienTai.ghiChu} rows={2} placeholder="Ghi chú thêm (không bắt buộc)"
                      onChange={e => capNhat(donHienTai.id, "ghiChu", e.target.value)}
                      className="w-full px-2 py-1.5 text-[12px] border border-[#d9d9d9] rounded-[3px] focus:outline-none focus:border-[#8b1a1a] resize-none" />
                  </div>

                  {/* ── Nút thao tác: đúng nhịp Lưu → Trình ký → Lấy số ──── */}
                  <div className="pt-2 border-t border-[#eee] space-y-1.5">
                    {qdHienTai.trangThai === "mo" || qdHienTai.trangThai === "dung" ? (
                      <button onClick={luuQD}
                        className="w-full flex items-center justify-center gap-1.5 h-[30px] bg-[#1e40af] hover:bg-[#1c3a9c] text-white rounded-[3px] text-[12px] font-medium">
                        <Check size={13} /> Lưu quyết định
                      </button>
                    ) : qdHienTai.trangThai === "daLuu" ? (
                      <button onClick={guiTrinhKy}
                        className="w-full flex items-center justify-center gap-1.5 h-[30px] bg-[#1e40af] hover:bg-[#1c3a9c] text-white rounded-[3px] text-[12px] font-medium">
                        <Send size={13} /> Gửi trình ký
                      </button>
                    ) : qdHienTai.trangThai === "choKy" ? (
                      <>
                        <button onClick={() => laySo(donHienTai.id)} disabled={dangLaySo}
                          className="w-full flex items-center justify-center gap-1.5 h-[30px] bg-[#27ae60] hover:bg-[#1e8449] disabled:opacity-60 text-white rounded-[3px] text-[12px] font-medium">
                          {dangLaySo ? <Loader2 size={13} className="animate-spin" /> : <Hash size={13} />}
                          {dangLaySo ? "Đang lấy số..." : "Lấy số / Ký số"}
                        </button>
                        <button onClick={() => huyKySo(donHienTai.id)}
                          className="w-full flex items-center justify-center gap-1.5 h-[30px] border border-[#d9d9d9] bg-white hover:border-[#8b1a1a] hover:text-[#8b1a1a] rounded-[3px] text-[12px]">
                          <Ban size={13} /> Huỷ ký số
                        </button>
                      </>
                    ) : qdHienTai.trangThai === "daKy" ? (
                      <button onClick={() => dungQD(donHienTai.id)}
                        className="w-full flex items-center justify-center gap-1.5 h-[30px] border border-[#d9d9d9] bg-white hover:border-[#8b1a1a] hover:text-[#8b1a1a] rounded-[3px] text-[12px]">
                        <Ban size={13} /> Dừng
                      </button>
                    ) : null}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => donHienTai && qdHienTai && onXemBieuMau?.(donHienTai, qdHienTai)}
                        disabled={!daLuuQD || !onXemBieuMau}
                        title={daLuuQD ? undefined : "Phải lưu quyết định trước khi xem biểu mẫu"}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-[30px] border rounded-[3px] text-[12px] transition-colors
                          ${daLuuQD && onXemBieuMau
                            ? "border-[#d9d9d9] bg-white hover:border-[#8b1a1a] hover:text-[#8b1a1a]"
                            : "border-[#e5e7eb] bg-[#f5f5f5] text-[#b0b0b0] cursor-not-allowed"}`}>
                        <Eye size={13} /> Xem biểu mẫu
                      </button>
                      <button
                        onClick={() => donHienTai && onSangDanhSachVanBan?.(donHienTai.soThuLy)}
                        disabled={!daLuuQD || !onSangDanhSachVanBan}
                        title={daLuuQD ? undefined : "Phải lưu quyết định trước khi xem trong danh sách văn bản"}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-[30px] border rounded-[3px] text-[12px] transition-colors
                          ${daLuuQD && onSangDanhSachVanBan
                            ? "border-[#d9d9d9] bg-white hover:border-[#8b1a1a] hover:text-[#8b1a1a]"
                            : "border-[#e5e7eb] bg-[#f5f5f5] text-[#b0b0b0] cursor-not-allowed"}`}>
                        <List size={13} /> Danh sách văn bản
                      </button>
                    </div>
                    {!daLuuQD && (
                      <div className="text-[10px] text-[#8b1a1a] text-center leading-snug">
                        Phải lưu quyết định trước khi xem biểu mẫu.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[#6b7280]">
                Không có đơn nào đã được phân công thẩm phán.
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
