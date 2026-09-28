import React, { useState } from "react";
import { PhanCongThamPhanScreen, type DonPhanCong, type ThamPhanItem } from "../components/PhanCongThamPhanScreen";
import QuyetDinhPhanCong, { type QD } from "./QuyetDinhPhanCong";
import { ToTrinhPhanCongPreview } from "./components/DocumentNumberingModal";

/**
 * Màn phân công thẩm phán cấp tỉnh.
 *
 * Không có UI riêng: màn này render đúng component dùng chung với TANDTC
 * (`PhanCongThamPhanScreen`) nên mọi nút, tab, cột bảng và bộ lọc luôn giống
 * nhau — kể cả tab "DS chưa phân công ngẫu nhiên".
 *
 * `cap="tinh"` chỉ còn ảnh hưởng đúng một chỗ: bộ lọc/bảng lọc thẩm quyền
 * (Tối cao / bậc 3.2) vì cấp tỉnh chỉ có một loại thẩm phán. Ngoài ra cấp tỉnh
 * giữ nút tạo quyết định phân công, còn TANDTC thì không.
 *
 * Dữ liệu bên dưới là mẫu demo cho TAND thành phố Hà Nội: cấp tỉnh giám đốc
 * thẩm/tái thẩm bản án, quyết định đã có hiệu lực của TAND khu vực nên ký hiệu
 * bản án là -ST và `toaBA` luôn là TAND khu vực trực thuộc.
 */

const THAM_PHAN: ThamPhanItem[] = [
  { hoTen: "Lê Thị Thu Hiền", bac: "Thẩm phán", donVi: "TAND khu vực 1 - Hà Nội" },
  { hoTen: "Nguyễn Văn A", bac: "Thẩm phán", donVi: "TAND khu vực 2 - Hà Nội" },
  { hoTen: "Trần Văn B", bac: "Thẩm phán", donVi: "TAND khu vực 3 - Hà Nội" },
  { hoTen: "Phạm Văn C", bac: "Thẩm phán", donVi: "TAND khu vực 3 - Hà Nội" },
  { hoTen: "Nguyễn Thị Hương", bac: "Thẩm phán", donVi: "TAND khu vực 4 - Hà Nội" },
  { hoTen: "Vũ Đức Thiện", bac: "Phó thẩm phán", donVi: "TAND khu vực 5 - Hà Nội" },
  { hoTen: "Hoàng Ngọc Chiêu", bac: "Thẩm phán", donVi: "TAND khu vực 6 - Hà Nội" },
];

const LOAI_AN_OPTIONS = [
  "Hình sự",
  "Dân sự",
  "Hành chính",
  "Kinh doanh thương mại",
  "Hôn nhân gia đình",
  "Lao động",
  "Sở hữu trí tuệ",
  "Phá sản",
];

const HINH_THUC_NHOM = [
  { label: "Đơn", items: ["Đề nghị GĐT", "Đề nghị TT", "Đề nghị GĐT, TT"] },
  { label: "Công văn", items: ["Công văn chuyển", "Công văn đề nghị", "Công văn nhắc lại"] },
  { label: "Tài liệu", items: ["Tài liệu bổ sung", "Bản sao, bản chính"] },
];

const NGUOI_NHAP_DON = ["Vũ Văn Yên", "Lê Thị Hà", "Phùng Trâm Anh"];

const DON_SAMPLE: DonPhanCong[] = [
  { id: 1, soThuLy: "01/2026/GĐT-HS", ngayThuLy: "05/07/2026", ngayNhapDon: "01/07/2026", nguoiDungDon: "Nguyễn Văn An", diaChi: "Số 12 Lê Duẩn, phường Cửa Nam, TP Hà Nội", soBA: "15/2023/HS-ST", ngayBA: "12/03/2023", toaBA: "TAND khu vực 1 - Hà Nội", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Vũ Văn Yên" },
  { id: 2, soThuLy: "02/2026/GĐT-DS", ngayThuLy: "08/07/2026", ngayNhapDon: "03/07/2026", nguoiDungDon: "Trần Thị Bình", diaChi: "Số 45 Trần Hưng Đạo, phường Hoàn Kiếm, TP Hà Nội", soBA: "08/2022/DS-ST", ngayBA: "20/06/2022", toaBA: "TAND khu vực 1 - Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Lê Thị Hà", thamPhan: "Nguyễn Thị Hương", ngayPhanCong: "09/07/2026", thongBao: "TB-118/2026" },
  { id: 3, soThuLy: "03/2026/GĐT-KDTM", ngayThuLy: "10/07/2026", ngayNhapDon: "05/07/2026", nguoiDungDon: "Công ty TNHH Minh Đức", diaChi: "Số 18 Duy Tân, phường Cầu Giấy, TP Hà Nội", soBA: "33/2024/KDTM-ST", ngayBA: "15/11/2024", toaBA: "TAND khu vực 3 - Hà Nội", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Phùng Trâm Anh", thamPhan: "Trần Văn B", ngayPhanCong: "11/07/2026", thongBao: "TB-119/2026" },
  { id: 4, soThuLy: "04/2026/TT-HC", ngayThuLy: "14/07/2026", ngayNhapDon: "09/07/2026", nguoiDungDon: "Lê Văn Cường", diaChi: "Số 72 Quang Trung, phường Hà Đông, TP Hà Nội", soBA: "21/2021/HC-ST", ngayBA: "05/09/2021", toaBA: "TAND khu vực 5 - Hà Nội", loaiAn: "Hành chính", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Vũ Văn Yên", thamPhan: "Vũ Đức Thiện", ngayPhanCong: "15/07/2026" },
  { id: 5, soThuLy: "05/2026/GĐT-LĐ", ngayThuLy: "16/07/2026", ngayNhapDon: "11/07/2026", nguoiDungDon: "Phạm Thị Dung", diaChi: "Số 33 Bà Triệu, phường Hai Bà Trưng, TP Hà Nội", soBA: "07/2023/LĐ-ST", ngayBA: "18/04/2023", toaBA: "TAND khu vực 2 - Hà Nội", loaiAn: "Lao động", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Lê Thị Hà", thamPhan: "Nguyễn Văn A", ngayPhanCong: "17/07/2026" },
  { id: 6, soThuLy: "06/2026/GĐT-DS", ngayThuLy: "18/07/2026", ngayNhapDon: "13/07/2026", nguoiDungDon: "Hoàng Văn Thái", diaChi: "Số 20 Trần Thái Tông, phường Cầu Giấy, TP Hà Nội", soBA: "45/2024/DS-ST", ngayBA: "10/01/2025", toaBA: "TAND khu vực 3 - Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Phùng Trâm Anh" },
  { id: 7, soThuLy: "07/2026/TT-HS", ngayThuLy: "19/07/2026", ngayNhapDon: "14/07/2026", nguoiDungDon: "Lê Thị Hồng", diaChi: "Số 150 Nguyễn Trãi, phường Thanh Xuân, TP Hà Nội", soBA: "12/2023/HS-ST", ngayBA: "22/08/2023", toaBA: "TAND khu vực 4 - Hà Nội", loaiAn: "Hình sự", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Vũ Văn Yên" },
  { id: 8, soThuLy: "08/2026/GĐT-HNGĐ", ngayThuLy: "21/07/2026", ngayNhapDon: "16/07/2026", nguoiDungDon: "Đinh Tuấn Tài", diaChi: "Số 55 Láng Hạ, phường Láng, TP Hà Nội", soBA: "09/2023/HNGĐ-ST", ngayBA: "05/05/2023", toaBA: "TAND khu vực 2 - Hà Nội", loaiAn: "Hôn nhân gia đình", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Lê Thị Hà", thamPhan: "Hoàng Ngọc Chiêu", ngayPhanCong: "22/07/2026", thongBao: "TB-124/2026" },
  { id: 9, soThuLy: "09/2026/TT-KDTM", ngayThuLy: "22/07/2026", ngayNhapDon: "17/07/2026", nguoiDungDon: "Công ty Cổ phần Alpha", diaChi: "Tòa nhà Discovery, phường Cầu Giấy, TP Hà Nội", soBA: "56/2024/KDTM-ST", ngayBA: "11/12/2024", toaBA: "TAND khu vực 3 - Hà Nội", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Phùng Trâm Anh" },
  { id: 10, soThuLy: "10/2026/GĐT-HC", ngayThuLy: "23/07/2026", ngayNhapDon: "18/07/2026", nguoiDungDon: "Vũ Trọng Phụng", diaChi: "Số 8 Tràng Thi, phường Hoàn Kiếm, TP Hà Nội", soBA: "19/2021/HC-ST", ngayBA: "15/07/2021", toaBA: "TAND khu vực 1 - Hà Nội", loaiAn: "Hành chính", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Vũ Văn Yên", thamPhan: "Phạm Văn C", ngayPhanCong: "24/07/2026" },
  { id: 11, soThuLy: "11/2026/GĐT-DS", ngayThuLy: "24/07/2026", ngayNhapDon: "19/07/2026", nguoiDungDon: "Bùi Thị Yến", diaChi: "KĐT Times City, phường Vĩnh Tuy, TP Hà Nội", soBA: "22/2022/DS-ST", ngayBA: "09/09/2022", toaBA: "TAND khu vực 4 - Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Lê Thị Hà" },
  { id: 12, soThuLy: "12/2026/TT-LĐ", ngayThuLy: "25/07/2026", ngayNhapDon: "20/07/2026", nguoiDungDon: "Trương Quang Sáng", diaChi: "KCN Quang Minh, xã Quang Minh, TP Hà Nội", soBA: "04/2024/LĐ-ST", ngayBA: "20/02/2024", toaBA: "TAND khu vực 6 - Hà Nội", loaiAn: "Lao động", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Phùng Trâm Anh", thamPhan: "Lê Thị Thu Hiền", ngayPhanCong: "26/07/2026" },
  { id: 13, soThuLy: "13/2026/GĐT-HS", ngayThuLy: "26/07/2026", ngayNhapDon: "21/07/2026", nguoiDungDon: "Nguyễn Hải Long", diaChi: "Thôn Đoài, xã Đông Anh, TP Hà Nội", soBA: "31/2023/HS-ST", ngayBA: "17/10/2023", toaBA: "TAND khu vực 6 - Hà Nội", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Vũ Văn Yên" },
  { id: 14, soThuLy: "14/2026/TT-DS", ngayThuLy: "27/07/2026", ngayNhapDon: "22/07/2026", nguoiDungDon: "Lý Mỹ Châu", diaChi: "Số 27 Ngô Quyền, phường Sơn Tây, TP Hà Nội", soBA: "11/2021/DS-ST", ngayBA: "03/04/2021", toaBA: "TAND khu vực 5 - Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Lê Thị Hà", thamPhan: "Nguyễn Thị Hương", ngayPhanCong: "28/07/2026" },
  { id: 15, soThuLy: "15/2026/GĐT-KDTM", ngayThuLy: "28/07/2026", ngayNhapDon: "23/07/2026", nguoiDungDon: "Ngân hàng Thương mại ABC", diaChi: "Số 194 Trần Quang Khải, phường Hoàn Kiếm, TP Hà Nội", soBA: "77/2024/KDTM-ST", ngayBA: "05/01/2025", toaBA: "TAND khu vực 2 - Hà Nội", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Phùng Trâm Anh" },
  { id: 16, soThuLy: "16/2026/GĐT-HS", ngayThuLy: "29/07/2026", ngayNhapDon: "24/07/2026", nguoiDungDon: "Đỗ Văn Thắng", diaChi: "Số 5 Hàng Bông, phường Cát Linh, TP Hà Nội", soBA: "12/2024/HS-ST", ngayBA: "07/02/2025", toaBA: "TAND khu vực 1 - Hà Nội", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", nguoiNhapDon: "Vũ Văn Yên" },
  { id: 17, soThuLy: "17/2026/TT-DS", ngayThuLy: "30/07/2026", ngayNhapDon: "25/07/2026", nguoiDungDon: "Ngô Thị Hồng Vân", diaChi: "Số 88 Nguyễn Du, phường Hoàn Kiếm, TP Hà Nội", soBA: "23/2021/DS-ST", ngayBA: "14/04/2021", toaBA: "TAND khu vực 4 - Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Lê Thị Hà" },
  { id: 18, soThuLy: "18/2026/GĐT-PS", ngayThuLy: "31/07/2026", ngayNhapDon: "26/07/2026", nguoiDungDon: "Công ty TNHH Phá sảy Á Châu", diaChi: "Số 12 Tôn Đức Thắng, phường Đống Đa, TP Hà Nội", soBA: "09/2025/PS-ST", ngayBA: "30/01/2025", toaBA: "TAND khu vực 3 - Hà Nội", loaiAn: "Phá sản", hinhThuc: "Đề nghị TT", nguoiNhapDon: "Phùng Trâm Anh" },
];

export function PhanCongThamPhanView({
  currentRole,
  onDoiTrangThaiQuyetDinh,
  onSangDanhSachVanBan,
}: {
  currentRole?: string;
  /** Kho văn bản chung cập nhật bản ghi theo trạng thái quyết định. */
  onDoiTrangThaiQuyetDinh?: (don: DonPhanCong, qd: QD) => void;
  /** Mở màn Danh sách văn bản, lọc theo mã đơn. */
  onSangDanhSachVanBan?: (maDon: string) => void;
}) {
  const [donTaoQD, setDonTaoQD] = useState<DonPhanCong[] | null>(null);
  const [xemBieuMau, setXemBieuMau] = useState<{ don: DonPhanCong; qd: QD } | null>(null);

  /** yyyy-MM-dd -> dd/MM/yyyy, đúng định dạng ngày các biểu mẫu đang in. */
  const ddmmyyyy = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
  };

  return (
    <>
      <PhanCongThamPhanScreen
        cap="tinh"
        rows={DON_SAMPLE}
        thamPhan={THAM_PHAN}
        loaiAnOptions={LOAI_AN_OPTIONS}
        hinhThucNhom={HINH_THUC_NHOM}
        currentRole={currentRole}
        onTaoQuyetDinh={setDonTaoQD}
      />
      {donTaoQD && (
        <QuyetDinhPhanCong
          don={donTaoQD}
          onClose={() => setDonTaoQD(null)}
          onXemBieuMau={(don, qd) => setXemBieuMau({ don, qd })}
          onDoiTrangThai={onDoiTrangThaiQuyetDinh}
          onSangDanhSachVanBan={(maDon) => {
            setDonTaoQD(null);
            onSangDanhSachVanBan?.(maDon);
          }}
        />
      )}
      {xemBieuMau && (
        <ToTrinhPhanCongPreview
          rows={[]}
          loaiVanBan="Quyết định phân công thẩm phán"
          quyetDinh={{
            donViSoanThao: xemBieuMau.qd.donViSoanThao,
            soVanBan: xemBieuMau.qd.soVanBan,
            ngayBanHanh: ddmmyyyy(xemBieuMau.qd.ngayBanHanh),
            soThuLy: xemBieuMau.don.soThuLy,
            ngayThuLy: ddmmyyyy(xemBieuMau.don.ngayThuLy),
            thamPhan: xemBieuMau.don.thamPhan ?? "—",
            ghiChu: xemBieuMau.qd.ghiChu,
            daKy: xemBieuMau.qd.trangThai === "daKy",
          }}
          onClose={() => setXemBieuMau(null)}
          onSangDanhSach={() => {
            const maDon = xemBieuMau.don.soThuLy;
            setXemBieuMau(null);
            setDonTaoQD(null);
            onSangDanhSachVanBan?.(maDon);
          }}
        />
      )}
    </>
  );
}

export default PhanCongThamPhanView;
