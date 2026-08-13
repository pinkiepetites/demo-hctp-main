/**
 * Danh mục màn của module Quản lý án GĐT/TT.
 *
 * Trước đây file này là `Sidebar.tsx` — vừa khai kiểu vừa dựng menu riêng của
 * bản demo. Menu nay do project chính cung cấp (xem `MENU_GDT` trong app/App.tsx)
 * nên phần dựng menu đã bỏ, chỉ giữ lại danh mục màn.
 *
 * Đã bỏ 4 màn không thuộc thẩm quyền TAND cấp tỉnh (các tên cơ quan cấp trung
 * ương dưới đây là mô tả nghiệp vụ, cố ý giữ nguyên — không đổi về cấp tỉnh):
 *   · "ho-so-tu-hinh" + "don-xin-an-giam" — đơn xin ân giảm án tử hình do Chánh án
 *     Tòa án nhân dân tối cao / Viện trưởng Viện kiểm sát nhân dân tối cao xem xét
 *     rồi trình Chủ tịch nước quyết định; TAND cấp tỉnh không nằm trong luồng này;
 *   · "phan-cong-tptc" — phân công Thẩm phán Tòa án nhân dân tối cao giải quyết
 *     vụ án, cấp tỉnh không có chức danh này.
 *
 * Riêng "an-quoc-hoi" từng nằm trong nhóm bỏ nói trên với lý do đầu mối nhận đơn
 * do cơ quan của Quốc hội chuyển là TAND tối cao. Nay đã đưa trở lại menu theo
 * yêu cầu của đơn vị nghiệp vụ — cần xác nhận lại thẩm quyền trước khi chốt.
 */
export type View =
  | "don-cho-phe-duyet"
  | "cho-y-kien"
  | "da-co-vu-an"
  | "ho-so-khang-nghi"
  | "giao-tieu-ho-so"
  | "them-ho-so"
  | "phan-cong-ttv"
  | "phan-cong-tham-phan"
  | "cau-hinh-ttv"
  | "quan-ly-vu-an"
  | "quan-ly-khieu-nai"
  | "cong-van-trao-doi"
  | "quan-ly-vu-xet-xu"
  | "phe-duyet-de-xuat"
  | "an-quoc-hoi"
  | "an-thoi-hieu";
