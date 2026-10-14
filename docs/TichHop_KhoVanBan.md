# TÀI LIỆU TÍCH HỢP KHO VĂN BẢN (DANH SÁCH VĂN BẢN)

**Đối tượng đọc**: đội phát triển các phân hệ cần đưa văn bản của mình vào màn **Danh sách văn bản**.
**Phiên bản**: 1.0 — 28/09/2026
**Bản demo tham chiếu**: `app/tinh/components/QuanLyVanBan.tsx` — kiểu `BanGhiKhoVanBan` (hợp đồng), `loiBanGhiKho` (kiểm tra, tương ứng lỗi 400), `ghiVanBan` (xử lý ghi theo `id`), ví dụ `taoQuyetDinhPhanCong`. Nơi gọi: `dongBoQDPhanCong` trong `app/tinh/AppTinh.tsx`.

---

## 1. Phạm vi trách nhiệm

Kho văn bản **chỉ lưu và hiển thị**. Phân hệ gửi gì, kho hiển thị đúng như thế.

| Kho văn bản làm | Kho văn bản **không** làm — phân hệ tự làm |
|---|---|
| Lưu văn bản theo `id` | Cấp số văn bản (số tạm, số chính thức, sổ số) |
| Hiển thị ở màn Danh sách văn bản: lọc, tìm kiếm, xem, in | Chạy luồng trình / duyệt / ký / bút phê |
| Hiển thị lịch sử và các phiên bản nội dung | Kiểm tra nghiệp vụ (được lập khi nào, ai được ký…) |
| Cho mở danh sách văn bản theo đơn, mở một văn bản theo `id` | Dựng nội dung văn bản từ mẫu biểu |

Kho **không kiểm tra** số văn bản có trùng không, trạng thái có hợp lệ với luồng của phân hệ không. Những việc đó thuộc phân hệ.

---

## 2. Dữ liệu phân hệ gửi sang

Mỗi văn bản là một bản ghi:

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | Có | Mã **do phân hệ đặt, không đổi** suốt đời văn bản. Dạng `{mã phân hệ}-{loại}-{khóa nghiệp vụ}`, ví dụ `pctp-qd-54682804`. Gửi lại cùng `id` thì kho ghi đè bản ghi cũ (mục 3) |
| `maPhanHe` | string | Có | Mã phân hệ gửi, ví dụ `PCTP`, `HCTP`. Dùng để lọc và truy vết |
| `loaiVanBan` | string | Có | Lấy từ **danh mục loại văn bản chung** (mục 5). Không tự đặt tên mới |
| `trichYeu` | string | Có | Hiện ở cột Trích yếu. Ví dụ *"Quyết định phân công thẩm phán – 54682804"* |
| `donViSoanThao` | string | Có | Tên đơn vị soạn thảo |
| `nguoiTao` | `{ hoTen, chucVu }` | Có | Người lập văn bản |
| `trangThai` | enum | Có | Một trong 7 giá trị ở mục 2.1. Phân hệ tự quy đổi trạng thái riêng sang |
| `nhanTrangThai` | string | Không | Nhãn hiển thị thay nhãn mặc định của `trangThai`, khi phân hệ có trạng thái riêng không khớp 7 giá trị. Ví dụ `trangThai = DaBanHanh`, `nhanTrangThai = "Bị thay thế bởi 002/2026/QĐ-TA"`. Lọc theo trạng thái vẫn dùng `trangThai` |
| `soVanBan` | string | Không | Số hiện tại của văn bản. Kho chỉ hiển thị |
| `trangThaiSo` | `tam` \| `chinhThuc` | Nếu có `soVanBan` | Kho tô màu khác nhau cho số tạm và số chính thức |
| `ngayCapSo` | `dd/mm/yyyy` | Không | |
| `ngayBanHanh` | `dd/mm/yyyy` | Không | Chỉ gửi khi đã ban hành |
| `noiDung` | string | Có | Nội dung văn bản hiện tại, **text thuần**, mỗi dòng cách nhau bằng `\n` (để so sánh các phiên bản) |
| `tepDinhKem` | `{ ten, url }` | Không | Bản PDF của văn bản **đã ban hành** |
| `lichSu` | mảng `MocLichSu` | Không | **Toàn bộ** lịch sử tính đến thời điểm gửi (mục 2.2). Phân hệ tự lưu lịch sử nối tiếp (mỗi thao tác một mốc với người, thời điểm thật) rồi gửi cả danh sách; không dựng lại lịch sử từ trạng thái hiện tại |
| `donDinhKem` | mảng | Có nếu văn bản gắn với đơn | `{ maDon, soThuLy, nguoiGui, soBA, hinhThuc }`. **`maDon` là khóa** để lọc văn bản theo đơn (luôn có, không đổi). `soThuLy` chỉ để hiển thị, vì có thể chưa có hoặc đã bị hủy |

Các trường `luongKy`, `buocHienTai`, `vongTrinh` trong demo là dữ liệu của luồng ký. Chúng **không** thuộc hợp đồng này và phân hệ không cần gửi.

### 2.1. Trạng thái

| Giá trị | Nhãn hiển thị | Dùng khi |
|---|---|---|
| `Nhap` | Nháp | Đã lập, chưa trình |
| `ChoDuyet` | Chờ duyệt | Đang chờ một bước duyệt |
| `ChoKy` | Chờ ký | Đang chờ ký |
| `ChoButPhe` | Chờ bút phê | Đang chờ bút phê |
| `BiTraLai` | Bị trả lại | Bị trả lại trong luồng của phân hệ |
| `DaBanHanh` | Đã ban hành | Đã ký, có hiệu lực |
| `DaHuy` | Đã huỷ | Đã huỷ / dừng. **Hủy văn bản thì gửi trạng thái này, không xóa bản ghi** |

### 2.2. Mốc lịch sử (`MocLichSu`)

| Trường | Bắt buộc | Mô tả |
|---|---|---|
| `thoiGian` | Có | `dd/mm/yyyy HH:mm`, giờ Việt Nam |
| `nguoi`, `chucVu` | Có | Họ tên và chức danh thật của người thao tác |
| `hanhDong` | Có | Một trong: `Tao`, `LaySoTam`, `Trinh`, `Duyet`, `SuaVaDuyet`, `TraLai`, `Ky`, `ButPhe`, `BanHanh`, `Khac` |
| `nhanHanhDong` | Nếu `hanhDong = Khac` | Nhãn hiển thị cho hành động riêng của phân hệ, ví dụ *"Dừng quyết định"* |
| `yKien` | Không | Ý kiến / lý do (bắt buộc với `TraLai` nếu luồng của phân hệ có lý do) |

---

## 3. Cách gọi

**Một thao tác duy nhất: ghi theo `id`** — chưa có thì tạo, đã có thì cập nhật.

```
PUT /api/v1/kho-van-ban/van-ban/{id}      (đường dẫn đề xuất, chốt khi làm backend)
Content-Type: application/json
Authorization: Bearer <token của phân hệ>
```

Quy tắc:
1. Phân hệ gọi **mỗi khi văn bản đổi trạng thái, đổi số hoặc đổi nội dung**.
2. Mỗi lần gọi gửi **đầy đủ bản ghi hiện tại** (không gửi riêng phần thay đổi). Kho thay toàn bộ bản ghi cũ bằng bản mới, **trừ phiên bản nội dung**: nếu `noiDung` khác phiên bản hiện tại, kho tự thêm một phiên bản mới (người sửa lấy từ mốc lịch sử cuối cùng) và giữ các phiên bản cũ để so sánh. `noiDung` không đổi thì không sinh phiên bản.
3. Gọi lại nhiều lần với cùng dữ liệu cho cùng một kết quả, **không sinh thêm dòng**. Phân hệ được phép gọi lại khi lỗi mạng.
4. `id` không được đổi. Nếu phân hệ lỡ đổi, kho sẽ coi là một văn bản mới và danh sách bị trùng.
5. Kết quả trả về:
   - `200`: đã ghi. Body trả lại bản ghi đã lưu.
   - `400`: thiếu trường bắt buộc hoặc sai giá trị enum. Body nêu tên trường lỗi.
   - `401` / `403`: sai token, hoặc phân hệ ghi vào `id` có tiền tố của phân hệ khác.

Ví dụ:

```json
{
  "id": "pctp-qd-QD-2026-000123",
  "maPhanHe": "PCTP",
  "loaiVanBan": "Quyết định phân công thẩm phán",
  "trichYeu": "Quyết định phân công thẩm phán – 54682804",
  "donViSoanThao": "Toà án nhân dân tỉnh Hà Nội",
  "nguoiTao": { "hoTen": "Đặng Quốc Trung", "chucVu": "Chánh án" },
  "trangThai": "DaBanHanh",
  "soVanBan": "001/2026/QĐ-TA",
  "trangThaiSo": "chinhThuc",
  "ngayCapSo": "28/09/2026",
  "ngayBanHanh": "28/09/2026",
  "noiDung": "QUYẾT ĐỊNH\nVề việc phân công thẩm phán giải quyết vụ án\n...",
  "tepDinhKem": { "ten": "QD-001-2026.pdf", "url": "https://.../QD-001-2026.pdf" },
  "lichSu": [
    { "thoiGian": "28/09/2026 09:10", "nguoi": "Đặng Quốc Trung", "chucVu": "Chánh án", "hanhDong": "Tao" },
    { "thoiGian": "28/09/2026 09:12", "nguoi": "Đặng Quốc Trung", "chucVu": "Chánh án", "hanhDong": "Ky", "yKien": "Số 001/2026/QĐ-TA · Ký số" }
  ],
  "donDinhKem": [
    { "maDon": "D-2026-00123", "soThuLy": "54682804", "nguoiGui": "Trần Thị B", "soBA": "12/2026/DS-PT", "hinhThuc": "Đơn đề nghị giám đốc thẩm" }
  ]
}
```

---

## 4. Kho cung cấp lại cho phân hệ

| Nhu cầu | Cách dùng |
|---|---|
| Mở Danh sách văn bản đã lọc theo đơn | Điều hướng tới màn Danh sách văn bản với tham số `maDon` (hoặc `soThuLy`) |
| Mở xem / in một văn bản | Điều hướng tới màn Danh sách văn bản với tham số `id` — mở thẳng chi tiết văn bản đó |

Phân hệ gắn hai liên kết này vào nút **Danh sách văn bản** / **Xem trong danh sách văn bản** của mình.

---

## 5. Danh mục loại văn bản

`loaiVanBan` phải là một giá trị có trong danh mục chung. Phân hệ cần loại mới thì đăng ký với kho văn bản trước khi gửi, không tự đặt tên. Danh mục hiện có (theo MH-01 mục Loại văn bản):

Tờ trình phân công thẩm phán · Quyết định phân công thẩm phán · Giấy xác nhận · Giấy xác nhận cơ quan chuyển đơn · Công văn chuyển nội bộ · Công văn chuyển tòa khác · Công văn chuyển ngoài · Trả lại đơn · Tờ trình khác · Thông báo phân công TP · Yêu cầu bổ sung.

---

## 6. Checklist mỗi phân hệ phải điền

Mỗi phân hệ nộp cho kho văn bản một bảng như sau (đưa vào SRS của chức năng, mục "Tích hợp kho văn bản"):

| # | Nội dung | Phân hệ điền |
|---|---|---|
| 1 | Loại văn bản (theo danh mục mục 5) | |
| 2 | Quy tắc đặt `id` | |
| 3 | Bảng quy đổi trạng thái của phân hệ → 7 trạng thái của kho | |
| 4 | Các sự kiện sẽ gọi sang kho | |
| 5 | Cách dựng `trichYeu` và `noiDung` | |
| 6 | Khóa đơn đưa vào `donDinhKem` | |
| 7 | Các hành động lịch sử dùng `Khac` và nhãn tương ứng | |

### 6.1. Ví dụ đã điền — Quyết định phân công thẩm phán

Chi tiết nghiệp vụ: [SRS_TaoQuyetDinhPhanCongThamPhan.md](./SRS_TaoQuyetDinhPhanCongThamPhan.md) mục 7.

| # | Nội dung | Giá trị |
|---|---|---|
| 1 | Loại văn bản | Quyết định phân công thẩm phán |
| 2 | `id` | `pctp-qd-{mã quyết định}` — **mỗi quyết định một id**; một đơn có thể có nhiều quyết định qua các lần lập mới. Lưu lại cùng quyết định thì ghi đè. `maPhanHe = "PCTP"` |
| 3 | Quy đổi trạng thái | Đã lưu → `Nhap` · Đã ký → `DaBanHanh` · Đã huỷ → `DaHuy` · Bị thay thế → `DaBanHanh` + `nhanTrangThai = "Bị thay thế bởi {số mới}"`. Chưa lập: chưa gửi sang kho |
| 4 | Sự kiện gọi sang kho | Lưu, Ký số, Huỷ. Khi quyết định mới của cùng đơn được ký: gửi thêm bản ghi của quyết định cũ với trạng thái Bị thay thế |
| 5 | `trichYeu` / `noiDung` / `tepDinhKem` | *"Quyết định phân công thẩm phán – {số thụ lý}"* / dựng từ mẫu quyết định (SRS mục 6, mẫu đang chờ), cố định từ lúc ký / file đã ký số |
| 6 | Khóa đơn | `maDon` của đơn được phân công; `soThuLy` để hiển thị |
| 7 | Hành động | `Tao`, `Ky` (`yKien` ghi số và phương thức ký), `Khac` với nhãn "Lưu", "Huỷ" (`yKien` = lý do, số thu hồi), "Bị thay thế" (`yKien` = số quyết định mới) |

Bản demo hiện vẫn theo popup cũ (một quyết định mỗi đơn, id `pctp-qd-{số thụ lý}`, có trạng thái Chờ ký / Huỷ ký số / Dừng) — xem SRS Quyết định phân công mục 9. Khi popup làm theo SRS 1.4 thì sửa `taoQuyetDinhPhanCong` theo bảng trên.

---

## 7. Các quyết định đã chốt

| # | Vấn đề | Quyết định |
|---|---|---|
| 1 | Định dạng `noiDung` | Text thuần, mỗi dòng cách nhau bằng `\n`. Văn bản đã ban hành gửi thêm bản PDF qua `tepDinhKem` |
| 2 | Khóa liên kết với đơn | `maDon`. Số thụ lý chỉ để hiển thị |
| 3 | Phiên bản nội dung | Kho tự tạo phiên bản mới khi `noiDung` khác phiên bản hiện tại (mục 3, quy tắc 2) |
