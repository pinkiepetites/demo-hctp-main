// ── Cấu hình dùng chung cho Ủy ban Thẩm phán ──────────────────────────────────
// Tách ra khỏi các file view để hai màn "Quản lý vụ xét xử GĐT" và
// "Phân công UBTP" dùng chung một nguồn, tránh import vòng giữa hai view.

export type ThamPhan = {
  id: string;
  ten: string;
  chucVu: string;
  donVi: string;
};

/** Số Thẩm phán của Ủy ban Thẩm phán khi không họp toàn thể. Cấp tối cao trước
 *  đây là 5; cấp tỉnh dùng 3. Sửa ở đây là đổi mọi nơi. */
export const SO_THAM_PHAN_UBTP = 3;

/** Thẩm phán TAND thành phố Hà Nội. Cấp tỉnh chỉ còn MỘT chức danh "Thẩm phán",
 *  không phân bậc — đúng quyết định đã chốt ở project chính. Đơn vị là Tòa chuyên
 *  trách, không phải Vụ Giám đốc kiểm tra I/II/III (cơ cấu của TANDTC). */
export const DANH_SACH_THAM_PHAN: ThamPhan[] = [
  { id: "tp1", ten: "Lê Thị Thu Hiển", chucVu: "Chánh án", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp2", ten: "Nguyễn Như Thắng", chucVu: "Phó Chánh án", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp3", ten: "Nguyễn Biên Thùy", chucVu: "Phó Chánh án", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp4", ten: "Trần Hồng Hà", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp5", ten: "Ngô Hồng Phúc", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp6", ten: "Lê Thanh Phong", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp7", ten: "Nguyễn Văn Cường", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp8", ten: "Lê Văn Minh", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp9", ten: "Phạm Văn Nam", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp10", ten: "Trịnh Thị Minh Trang", chucVu: "Thẩm phán", donVi: "Tòa Hình sự" },
  { id: "tp11", ten: "Phạm Thị Bích Ngọc", chucVu: "Thẩm phán", donVi: "Tòa Kinh tế" },
  { id: "tp12", ten: "Võ Thị Thùy Giang", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp13", ten: "Trịnh Đức Minh", chucVu: "Thẩm phán", donVi: "Tòa Dân sự" },
  { id: "tp14", ten: "Vũ Diệu Thùy", chucVu: "Thẩm phán", donVi: "Tòa Hình sự" },
  { id: "tp15", ten: "Hoàng Quỳnh Trang", chucVu: "Thẩm phán", donVi: "Tòa Kinh tế" },
  { id: "tp16", ten: "Lê Hồng Quang", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp17", ten: "Nguyễn Duy Giảng", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp18", ten: "Trương Việt Toàn", chucVu: "Thẩm phán", donVi: "Ủy ban Thẩm phán TAND thành phố Hà Nội" },
  { id: "tp19", ten: "Phạm Quốc Anh", chucVu: "Thẩm phán", donVi: "Tòa Hành chính" },
];

export const DON_VI_HOI_DONG_THAM_PHAN = "Ủy ban Thẩm phán TAND thành phố Hà Nội";

/**
 * Toàn thể Ủy ban Thẩm phán: danh sách cố định, suy ra từ cấu hình thẩm phán
 * theo đơn vị "Ủy ban Thẩm phán TAND thành phố Hà Nội". Không cho thêm/bớt.
 */
export const HOI_DONG_TOAN_THE: string[] = DANH_SACH_THAM_PHAN
  .filter(tp => tp.donVi === DON_VI_HOI_DONG_THAM_PHAN)
  .map(tp => tp.ten);

export function getChucVuThamPhan(ten: string): string {
  return DANH_SACH_THAM_PHAN.find(tp => tp.ten === ten)?.chucVu || "Thẩm phán";
}

/** Ba loại biểu mẫu của khối "Quyết định phân công hội đồng xét xử" (mục 3.6). */
export const LOAI_BIEU_MAU_HDXX = [
  { id: "thanh-lap-hdxx", label: "Quyết định thành lập Ủy ban Thẩm phán xét xử" },
  { id: "thay-doi-hdxx", label: "Thay đổi Ủy ban Thẩm phán xét xử" },
  { id: "to-trinh-tham-muu", label: "Tờ trình tham mưu phân công Ủy ban Thẩm phán" },
] as const;

/** Trạng thái văn bản của bảng quyết định (mục 3.6). */
export const TRANG_THAI_VAN_BAN = {
  "Đã có hiệu lực": { color: "#1b5e20", bg: "#e8f5e9" },
  "Đã ký số": { color: "#1a5a96", bg: "#e8f4ff" },
  "Đã hủy": { color: "#a5281c", bg: "#fdecea" },
} as const;

export type TrangThaiVanBan = keyof typeof TRANG_THAI_VAN_BAN;

/** Nơi nhận là Viện kiểm sát — dùng cho biểu mẫu MS 03 (mục 3.7). */
export const DANH_SACH_VIEN_KIEM_SAT = [
  "Viện kiểm sát nhân dân thành phố Hà Nội",
  "Viện kiểm sát nhân dân thành phố Hà Nội",
];

/**
 * Cấp số quyết định theo dạng [số]/[năm]/QĐ-TAHN.
 * Repo chưa có dịch vụ cấp số của hệ thống nên số được suy ra từ số lớn nhất
 * đang có trong bảng quyết định. Khi có API cấp số, chỉ cần thay thân hàm này.
 */
export function capSoQuyetDinh(soQDDaCo: string[], nam = new Date().getFullYear()): string {
  const max = soQDDaCo.reduce((acc, so) => {
    const n = parseInt(String(so).split("/")[0], 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `${max + 1}/${nam}/QĐ-TAHN`;
}
