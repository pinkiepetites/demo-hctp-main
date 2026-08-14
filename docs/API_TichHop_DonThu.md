# Tài liệu Đặc tả API Tích hợp Đơn thư & Điều kiện Tích hợp

Tài liệu này đặc tả kỹ thuật và điều kiện nghiệp vụ để tích hợp dữ liệu đơn thư từ các nguồn bên ngoài (Cổng dịch vụ công Tư pháp, Cổng dịch vụ công Quốc gia, Hệ thống văn bản điều hành) vào hệ thống Quản lý Hành chính Tư pháp (HCTP).

---

## I. Điều kiện Tích hợp & Nghiệp vụ

### 1. Nguồn nhận đơn (nguon_nhan_don)
Đơn thư chuyển tới hệ thống phải được phân loại rõ nguồn gốc để thuận tiện cho việc theo dõi, bao gồm các nguồn:
*   `CONG_TU_PHAP`: Đơn gửi từ Cổng thông tin Tư pháp.
*   `DICH_VU_CONG`: Đơn gửi từ Cổng dịch vụ công.
*   `VAN_BAN_DIEU_HANH`: Đơn chuyển đến qua Hệ thống văn bản điều hành.

### 2. Phân công xử lý & Logic "Đơn của tôi"
*   **Trạng thái ban đầu:** Mọi đơn thư tích hợp thành công từ bên ngoài vào sẽ được gắn trạng thái mặc định là `Chờ phân công` (chưa thụ lý).
*   **Cơ chế gán cán bộ:** Trưởng phòng hoặc hệ thống tự động sẽ gán mã định danh tài khoản cán bộ chịu trách nhiệm vào trường `owner_officer_id`.
*   **Bộ lọc hiển thị:** Khi cán bộ đăng nhập vào hệ thống HCTP, tab **Đơn của tôi** sẽ chỉ lọc ra những đơn thư có `owner_officer_id` trùng khớp với ID tài khoản đang đăng nhập để xử lý.

---

## II. Đặc tả Kỹ thuật API (API Specification)

*   **Phương thức:** `POST`
*   **Đường dẫn:** `/api/v1/integration/don-thu`
*   **Content-Type:** `multipart/form-data` (cho phép truyền đồng thời dữ liệu văn bản JSON và file đính kèm thực tế)
*   **Xác thực:** Bearer Token trong Header (`Authorization: Bearer <API_KEY_CUA_NGUON_NHAN>`).

### 1. Dữ liệu văn bản (metadata)
Dữ liệu dạng JSON chứa thông tin chi tiết về đơn và bản án liên quan.

```json
{
  "nguon_nhan_don": "CONG_TU_PHAP",
  "loai_hinh_thuc_don": "Đơn đề nghị giám đốc thẩm",
  "ngay_nop_don": "2026-08-13T09:00:00Z",
  "danh_sach_nguoi_gui": [
    {
      "ho_ten": "Nguyễn Văn A",
      "so_cccd": "012345678901",
      "dia_chi_chi_tiet": "Số 10, Đường Hoàng Hoa Thám, Quận Tây Hồ, Hà Nội",
      "so_dien_thoai": "0987654321",
      "email": "nguyenvana@gmail.com",
      "quan_he_bi_an": "Bản thân"
    }
  ],
  "noi_dung_don": "Đề nghị xem xét theo thủ tục giám đốc thẩm đối với Bản án hình sự phúc thẩm số 12/2026/HS-PT.",
  "thong_tin_ban_an": {
    "so_ban_an_quyet_dinh": "12/2026/HS-PT",
    "ngay_ra_ban_an_quyet_dinh": "2026-05-10",
    "toa_an_ban_hanh": "TAND Cấp cao tại Hà Nội",
    "loai_an": "Hình sự",
    "thu_tuc_giai_quyet": "Giám đốc thẩm",
    "ten_duong_su_bi_an": "Trần Văn B"
  }
}
```

#### Chi tiết các trường dữ liệu:

| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mô tả / Định dạng |
| :--- | :--- | :---: | :--- |
| `nguon_nhan_don` | String | Có | Nguồn gửi đơn: `CONG_TU_PHAP`, `DICH_VU_CONG`, `VAN_BAN_DIEU_HANH` |
| `loai_hinh_thuc_don` | String | Không | Hình thức đơn (Đơn khiếu nại, Đơn tố cáo...) |
| `ngay_nop_don` | String | Có | Ngày nộp đơn trên hệ thống nguồn (ISO-8601) |
| `danh_sach_nguoi_gui` | Array | Có | Danh sách những người đứng đơn (Tối thiểu 1 người) |
| `danh_sach_nguoi_gui[].ho_ten` | String | Có | Họ tên người gửi đơn |
| `danh_sach_nguoi_gui[].so_cccd` | String | Có | Số CMND/CCCD/Hộ chiếu |
| `danh_sach_nguoi_gui[].dia_chi_chi_tiet`| String | Có | Địa chỉ liên hệ chi tiết |
| `danh_sach_nguoi_gui[].so_dien_thoai` | String | Có | Số điện thoại |
| `danh_sach_nguoi_gui[].email` | String | Không | Thư điện tử |
| `danh_sach_nguoi_gui[].quan_he_bi_an` | String | Không | Quan hệ với bị án (Bản thân, Đại diện, Thân nhân...) |
| `noi_dung_don` | String | Có | Nội dung tóm tắt khiếu nại/kiến nghị |
| `thong_tin_ban_an` | Object | Có | Thông tin về Bản án/Quyết định cần xem xét |
| `thong_tin_ban_an.so_ban_an_quyet_dinh`| String | Có | Số hiệu bản án hoặc quyết định |
| `thong_tin_ban_an.ngay_ra_ban_an_quyet_dinh`| String | Không | Ngày ban hành bản án/quyết định (YYYY-MM-DD) |
| `thong_tin_ban_an.toa_an_ban_hanh` | String | Có | Tên Tòa án ban hành bản án/quyết định |
| `thong_tin_ban_an.loai_an` | String | Có | Phân loại án (Hình sự, Dân sự, Hành chính...) |
| `thong_tin_ban_an.thu_tuc_giai_quyet` | String | Có | Thủ tục giải quyết đề nghị (Giám đốc thẩm, Tái thẩm) |
| `thong_tin_ban_an.ten_duong_su_bi_an` | String | Có | Tên bị án/đương sự trong bản án liên quan |

### 2. Dữ liệu tệp đính kèm (files)
Các file đính kèm được truyền dưới dạng tệp tin nhị phân trong request:

*   `file_don_ky_so`: File đơn chính thức (định dạng PDF) - *Bắt buộc*
*   `file_ban_an_quyet_dinh`: File bản án hoặc quyết định tòa án cần xem xét (định dạng PDF) - *Bắt buộc*
*   `tai_lieu_dinh_kem[]`: Danh sách các tệp tin tài liệu chứng cứ khác đính kèm (có thể gửi nhiều file).

---

## III. Định dạng Phản hồi (Response)

### 1. Thành công (HTTP Status 201 Created)
Hệ thống tiếp nhận thành công và trả về mã định danh đơn trên hệ thống HCTP để bên nguồn theo dõi trạng thái.

```json
{
  "success": true,
  "message": "Tiếp nhận đơn thư thành công",
  "data": {
    "ma_don_hctp": "HCTP-2026-89410",
    "ngay_tiep_nhan": "2026-08-13T14:18:00Z",
    "trang_thai_ban_dau": "Chờ phân công"
  }
}
```

### 2. Thất bại (HTTP Status 400 Bad Request / 401 Unauthorized)
```json
{
  "success": false,
  "error_code": "INVALID_PARAMETERS",
  "message": "Thiếu thông tin bắt buộc: thong_tin_ban_an.so_ban_an_quyet_dinh"
}
```
