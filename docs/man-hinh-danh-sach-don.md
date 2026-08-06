# Màn hình: Danh sách đơn

> Module **Quản lý đơn** · Đường dẫn `Trang chủ › Quản lý đơn › Danh sách đơn`
> Mã màn hình: **MH-01**
> Nguồn: `app/App.tsx` — component `DanhSachDon`

---

## 1. Mục đích

Màn hình trung tâm của nghiệp vụ tiếp nhận đơn. Cán bộ dùng màn này để:

- Tra cứu đơn đề nghị GĐT/TT theo nhiều tiêu chí
- Theo dõi trạng thái giải quyết của từng đơn
- Chọn nhiều đơn để lập văn bản (tờ trình, công văn, giấy xác nhận…)
- In danh sách đơn theo bộ lọc đang áp
- Đi tiếp sang màn Thêm mới / Sửa đơn

Màn này còn được **dùng lại** cho trang **Hồ sơ kháng nghị** (`khangNghi = true`) với khác biệt nêu ở mục 7.

---

## 2. Bố cục tổng thể

```
┌──────────────────────────────────────────────────────────────┐
│ Danh sách đơn                                                │
├──────────────────────────────────────────────────────────────┤
│ [Tổng số 23] [Đơn của tôi 6] [Đơn Thụ lý 3] [Chưa đủ ĐK 5]   │  ← Tabs
│ [Hết thời hạn kháng nghị 12] [Khác 8]                        │
├──────────────────────────────────────────────────────────────┤
│ Bộ lọc cơ bản (2 hàng, luôn hiện)                            │
│   [Bộ lọc nâng cao ▾] [Tìm kiếm] [Làm mới ③]                 │
│   └─ Panel Tìm kiếm nâng cao (3 cột, đóng/mở)                │
├──────────────────────────────────────────────────────────────┤
│ Loại văn bản: [___]   … [In danh sách (N đơn)] [+ Thêm mới]  │  ← Action bar
├──────────────────────────────────────────────────────────────┤
│ Bảng dữ liệu (8 cột)                                         │
├──────────────────────────────────────────────────────────────┤
│ Hiển thị 1-N trong tổng N văn bản                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Tabs

Số trên mỗi tab là **số đơn khớp bộ lọc đang áp**, không phải tổng toàn hệ thống.
Nghĩa là: lọc trước → số trên tab đổi theo → chọn tab để thu hẹp thêm.

| # | Tab | Điều kiện lọc |
|---|---|---|
| 0 | **Tổng số** | Không lọc thêm |
| 1 | **Đơn của tôi** | `cuaToi = true` — đơn thuộc tài khoản đang đăng nhập |
| 2 | **Đơn Thụ lý** | Trạng thái giải quyết = `Đã thụ lý` |
| 3 | **Chưa đủ điều kiện** | Trạng thái giải quyết = `Chưa đủ điều kiện` |
| 4 | **Hết thời hạn kháng nghị** | Thời hiệu = `Quá 3 năm` hoặc `Quá 5 năm` |
| 5 | **Khác** | Trạng thái **không** thuộc {Thụ lý mới, Đã thụ lý, Chưa đủ điều kiện} |

> **Lưu ý đặt tên:** nhãn tab là *"Đơn Thụ lý"* nhưng giá trị dữ liệu bên dưới là *"Đã thụ lý"*. Đây là chủ đích — chỉ đổi nhãn hiển thị, không đổi dữ liệu.

> Ô **Loại văn bản** ở action bar chỉ hiện khi đang ở tab khác tab 0. Về tab **Tổng số** thì giá trị bị xóa để không còn bộ lọc chạy ngầm mà người dùng không nhìn thấy.

---

## 4. Bộ lọc

### 4.1 Nguyên tắc chung

- Mọi điều kiện **cộng dồn (AND)**. Ô để trống = bỏ qua điều kiện đó.
- Ô chữ (`Từ khóa`, `Mã đơn`, `Người gửi`…) khớp **gần đúng, không phân biệt hoa thường**.
- Ô chọn khớp **chính xác**.
- Ô ngày là **khoảng**: chỉ nhập "từ" thì lọc từ ngày đó trở đi; chỉ nhập "đến" thì ngược lại.
- Bộ đếm trên nút **Làm mới** cho biết đang áp bao nhiêu điều kiện.
- Mọi ô chọn đều có nút **✕** để xóa nhanh giá trị đã chọn.

### 4.2 Bộ lọc cơ bản — luôn hiện

**Hàng 1**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| **Từ khóa tìm kiếm chung** | Text (rộng 2 cột) | Quét đồng thời: người gửi, địa chỉ, mã đơn, loại hình thức, người nhập, số BA/QĐ, tòa xét xử, thủ tục, hình thức, số CV, loại CV, đơn vị gửi, thẩm phán, đơn vị giải quyết, trạng thái, số tờ trình |
| **Số tờ trình / Văn bản** | Text | Khớp với số tờ trình (`stl`) **hoặc** số công văn |
| **Mã đơn / Số hiệu đơn** | Text | |
| **Hình thức đơn** | Select | Danh mục hình thức đơn dùng chung toàn hệ thống |
| **Người gửi** | Text | |

**Hàng 2**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| **Số bản án/QĐ** | Text | |
| **Tòa ra bản án / quyết định** | Select | Danh sách sinh từ dữ liệu thực tế. Hiển thị viết tắt **TAND** |
| **Ngày nhập** | Khoảng ngày (từ → đến) | |

**Nhóm nút** (cùng hàng 2, canh phải)

| Nút | Hành vi |
|---|---|
| **Bộ lọc nâng cao ▾** | Mở/đóng panel nâng cao. Đang mở thì nút đổi sang nền đỏ nhạt |
| **Tìm kiếm** | Áp bộ lọc và thu gọn panel nâng cao |
| **Làm mới ③** | Xóa **toàn bộ** điều kiện, kể cả panel nâng cao. Badge = số điều kiện đang áp |

### 4.3 Bộ lọc nâng cao — panel inline 3 cột

Panel bung ra ngay dưới bộ lọc cơ bản (không phải drawer). Header panel có nút `[ Thu gọn ]` và checkbox **Đơn đã giải quyết xong từ tòa Cấp cao**.

Các trường **đã có ở bộ lọc cơ bản không lặp lại** trong panel này (Người gửi, Tòa ra BA/QĐ, Hình thức đơn, Số BA/QĐ, khoảng Ngày nhập, Mã đơn, Số tờ trình).

**Cột 1**

| Trường | Kiểu | Trạng thái |
|---|---|---|
| Địa chỉ gửi đơn | Select Tỉnh/TP | Giao diện |
| Hình thức nhận | Select: Bưu điện · Điện tử · Trực tiếp · Trực tuyến · Nội bộ · Tiếp công dân | **Có lọc** |
| Ngày thụ lý từ | Ngày | Giao diện |
| Phạm vi tìm kiếm | Select: Đơn vị của tôi · Toàn hệ thống | Giao diện |
| Tên cơ quan chuyển đơn | Text | Giao diện |
| Thẩm phán | 2 select: bậc + tên | Giao diện |
| **Nơi chuyển** | Select: Nội bộ · Tòa khác · Ngoài tòa án | **Có lọc** |
| Chuyển tới CA/TA? | Select Có/Không | Giao diện |
| Ngày chuyển từ | Ngày | Giao diện |
| Án tử hình | Select Có/Không | Giao diện |
| Trạng thái chuyển | Select: Chưa chuyển · Đã chuyển · Đã nhận | Giao diện |

**Cột 2**

| Trường | Kiểu | Trạng thái |
|---|---|---|
| Địa chỉ chi tiết | Text | Giao diện |
| Số CMND/CCCD | Text | Giao diện |
| Nhận đơn từ | Ngày | Giao diện |
| Số CV/PC đến | Text | Giao diện |
| Lãnh đạo chỉ đạo? | Select Có/Không | Giao diện |
| Loại công văn | Select nhóm + ô số | Giao diện |
| **Chuyển đến** | Select 4 Vụ chuyên môn | Giao diện |
| **Loại án** | Select: Hình sự · Dân sự · Hành chính · KDTM · HN-GĐ · Lao động | **Có lọc** |
| **Ngày BA/QĐ từ** → **Đến ngày** | Ngày | **Có lọc** |
| **Người nhập** | Select sinh từ dữ liệu | **Có lọc** |

**Cột 3**

| Trường | Kiểu | Trạng thái |
|---|---|---|
| Trả lời đơn | Select: Đã trả lời · Chưa trả lời | Giao diện |
| Ngày CV/PC | Ngày | Giao diện |
| Ngày thụ lý đến | Ngày | Giao diện |
| Nhận đơn đến | Ngày | Giao diện |
| Ngày chuyển đến | Ngày | Giao diện |
| Trại giam? | Select Có/Không | Giao diện |
| **Trạng thái đơn** | Select: Đơn đủ điều kiện · Đơn không đủ điều kiện | **Có lọc** (suy diễn, xem 4.5) |
| **Thụ lý đơn** | Select: Thụ lý mới · Đã thụ lý · Chờ ý kiến Lãnh đạo · Không | **Có lọc** |
| Thủ tục giải quyết | Select: Giám đốc thẩm · Tái thẩm | Giao diện |
| Số QĐKN | Text | Giao diện |
| Người kháng nghị | Text | Giao diện |
| Ngày QĐKN | Ngày | Giao diện |

> **"Giao diện"** = ô đã dựng đúng bố cục hệ thống thật nhưng **chưa nối vào engine lọc**, do dữ liệu mẫu chưa có trường tương ứng. Cần bổ sung khi có dữ liệu thật.

### 4.4 Bộ lọc Loại văn bản (action bar)

Nằm ở thanh thao tác, **chỉ hiện khi không ở tab Tổng số**. Danh mục:

```
Giấy xác nhận · Giấy xác nhận cơ quan chuyển đơn
Công văn chuyển đơn · Công văn chuyển nội bộ · Công văn chuyển tòa khác · Công văn chuyển ngoài
Trả lại đơn
Tờ trình phân công Thẩm phán · Tờ trình khác
Thông báo phân công TP
Yêu cầu bổ sung
```

Chọn **Công văn chuyển đơn** thì hiện thêm nhóm radio **Loại đơn** (bắt buộc): Đơn đề nghị GĐT/TT · Đơn khiếu nại tố cáo trong tố tụng · Thông báo phát hiện vi phạm pháp luật.

### 4.5 Luật nghiệp vụ trong bộ lọc

**a. Loại văn bản giới hạn trạng thái đơn**

Mỗi loại văn bản chỉ áp được cho đơn ở một số trạng thái nhất định. Bảng luật hiện tại:

| Loại văn bản | Chỉ hiển thị đơn có trạng thái |
|---|---|
| **Yêu cầu bổ sung** | `Chưa đủ điều kiện` |

Loại nào **không** có trong bảng thì không ràng buộc trạng thái.
→ Thêm luật mới = thêm một dòng vào bảng cấu hình, **không sửa logic lọc**.

**b. Trạng thái đơn là giá trị suy diễn**

Không có trường dữ liệu riêng. Quy tắc:

- `Đơn không đủ điều kiện` ⇔ trạng thái giải quyết = `Chưa đủ điều kiện`
- `Đơn đủ điều kiện` ⇔ mọi trạng thái còn lại

**c. Chuẩn hóa Hình thức đơn khi so khớp**

Danh mục ghi `GĐT-TT`, dữ liệu ghi `GĐT, TT` — cùng một hình thức. Khi lọc, hệ thống **bỏ dấu câu và khoảng trắng, chuyển thường** rồi mới so, nên hai cách viết vẫn khớp nhau.

**d. Đơn chờ ý kiến Lãnh đạo**

Đơn đang nằm ở tab *Chờ ý kiến LĐ* của màn **Nhận đơn và TL vụ án** được hiển thị tại đây với trạng thái `Chờ ý kiến Lãnh đạo`. Khi Lãnh đạo kết luận, trạng thái đổi thành `Thụ lý mới` hoặc `Không thụ lý` — xem mục 5, cột Thông tin giải quyết.

Nhóm đơn này **được loại khỏi luật ghép đơn tự động**, để nhãn "Đã ghép với…" không đè lên trạng thái do Lãnh đạo quyết định.

---

## 5. Bảng dữ liệu

| # | Cột | Nội dung |
|---|---|---|
| 1 | **STT** | Checkbox chọn dòng + số thứ tự. Checkbox ở header chọn/bỏ **tất cả dòng đang hiển thị** (không phải toàn bộ dữ liệu) |
| 2 | **Thông tin người gửi / đơn vị gửi** | Người gửi (hoặc Người đứng đơn) · Địa chỉ · Ngày trên đơn · Ngày nhận · Mã đơn · Số hiệu · Nhãn thời hiệu |
| 3 | **Thông tin đơn** | Số BA/QĐ – Ngày – Tòa xét xử · Thủ tục giải quyết · Hình thức · Số CV – Ngày CV · Loại CV · Đơn vị gửi¹ · Thẩm phán · Đã chuyển / Chưa chuyển + đơn vị giải quyết · Ngày chuyển · Ghi chú |
| 4 | **Số đơn** | Số lượng đơn trong hồ sơ |
| 5 | **Hình thức tiếp nhận** | Badge màu: Trực tiếp (xanh) · Bưu điện (cam) · còn lại (xanh dương) |
| 6 | **Thông tin giải quyết** | Xem 5.2 |
| 7 | **Người nhập / Sửa** | Tên · ngày · giờ |
| 8 | **Thao tác** | Menu `···` |

¹ *Đơn vị gửi chỉ hiện khi khác Người gửi ở cột 2 — trùng thì ẩn để không lặp thông tin.*

### 5.1 Nhãn thời hiệu (cột 2)

| Nhãn | Màu |
|---|---|
| Không xác định thời hiệu giải quyết | Xám |
| Trong thời hạn giải quyết 1 năm | Xanh lá |
| Quá thời hiệu giải quyết trên 3 năm | Cam |
| Quá thời hiệu giải quyết trên 5 năm | Đỏ |

### 5.2 Cột Thông tin giải quyết

Nội dung hiển thị theo **thứ tự ưu tiên**, gặp điều kiện nào trước thì dùng điều kiện đó:

1. **Đã trả lại** → `Trả lại - chờ TP duyệt` (vàng) hoặc `Đã trả lại HCTP` (xanh)
2. **Ghép đơn tự động** → `Đã ghép với <mã đơn>` (xanh). Luật: cùng *số bản án* + cùng *ngày nhập*. **Bỏ qua** đơn đang chờ ý kiến Lãnh đạo
3. **Chờ xử lý** → badge xanh dương, bấm vào mở màn Sửa đơn
4. **Trạng thái giải quyết** → badge nền màu theo trạng thái

| Trạng thái | Màu |
|---|---|
| Thụ lý mới | Xanh lá `#27ae60` |
| Đã thụ lý | Xanh dương `#1a5a96` |
| Chưa đủ điều kiện | Cam `#e67e22` |
| Trả lại đơn | Xanh `#2980b9` |
| **Chờ ý kiến Lãnh đạo** | Cam `#e67e22` |
| **Không thụ lý** | Đỏ `#c0392b` |
| (rỗng) | `Chưa có` — nền xám |

Dưới badge có thể có thêm: **STL** (số tờ trình), link **Lịch sử xử lý HCTP**, link **Danh sách văn bản**.

### 5.3 Viết tắt

Toàn bộ chuỗi **"Tòa án nhân dân"** hiển thị thành **"TAND"** ở màn này (tên người gửi, địa chỉ, tòa xét xử, đơn vị gửi, thẩm phán, đơn vị giải quyết) và cả trong bản in. **Dữ liệu gốc giữ nguyên chữ đầy đủ** — chỉ đổi khi hiển thị.

### 5.4 Khi không có kết quả

Hiện thông báo *"Không có đơn nào khớp bộ lọc."* kèm link **Làm mới** (chỉ hiện khi đang có điều kiện lọc).

---

## 6. Thanh thao tác

| Nút | Điều kiện hiện | Hành vi |
|---|---|---|
| **Lưu số văn bản và in báo cáo** | Tab "Đơn của tôi" | Mở modal đánh số văn bản. Không tick dòng nào thì lấy **toàn bộ đơn đang hiển thị theo bộ lọc** |
| **Trả lại** | Tab > 1 | Mở form trả lại đơn |
| **Chọn cán bộ** + **Xác nhận** | Đang ở chế độ phân công chỉ định và có dòng được chọn | Phân công cán bộ cho các đơn đã chọn |
| **In danh sách (N đơn)** | Luôn hiện | Xem mục 6.1 |
| **+ Thêm mới** | Luôn hiện | Sang màn Thêm mới, bắt đầu bằng luồng nhập PDF → OCR |

### 6.1 In danh sách

Nút hiển thị sẵn số đơn sẽ in:

- **Có tick dòng** → in các dòng đã tick
- **Không tick dòng nào** → in toàn bộ đơn đang hiển thị theo bộ lọc/tab

Popup xem trước hiển thị:

```
        TÒA ÁN NHÂN DÂN TỐI CAO
           DANH SÁCH ĐƠN
          Ngày in: dd/mm/yyyy

Điều kiện lọc: Người gửi: Lê Thị Mai · Tab: Chưa đủ điều kiện
Tổng cộng: 2 đơn

┌────┬────────┬──────────────┬──────────────┬─────┐
│STT │Mã đơn  │Người gửi     │Hình thức đơn │ ... │
└────┴────────┴──────────────┴──────────────┴─────┘

                        Hà Nội, ngày dd/mm/yyyy
                        NGƯỜI LẬP DANH SÁCH
                          (Ký, ghi rõ họ tên)
```

**12 cột:** STT · Mã đơn · Người gửi/đơn vị gửi (kèm địa chỉ) · Hình thức đơn · Số BA/QĐ · Ngày BA/QĐ · Tòa xét xử · Hình thức tiếp nhận · Thẩm phán · Trạng thái giải quyết · Người nhập · Ngày nhập.

Rút gọn khi in: địa chỉ nằm dưới tên người gửi trong cùng ô; cột Thẩm phán chỉ lấy tên, bỏ phần chức danh/số văn bản trong ngoặc.

**Định dạng in:** A4 **ngang**, lề 12mm, mỗi dòng không bị cắt ngang trang. Khi in, toàn bộ giao diện bị ẩn, chỉ còn vùng danh sách.

---

## 7. Khác biệt khi dùng cho Hồ sơ kháng nghị

Cùng một component, bật cờ `khangNghi`:

| | Danh sách đơn | Hồ sơ kháng nghị |
|---|---|---|
| Tiêu đề | Danh sách đơn | Hồ sơ kháng nghị |
| Tabs | 6 tab | **Không có tab** |
| Cột *Số đơn*, *Hình thức tiếp nhận* | Có | **Ẩn** |
| Cột *Đơn vị giải quyết* | Không | **Có** (thêm dòng "Nơi nhận kèm") |
| Cột *Thông tin giải quyết* | Trạng thái đơn | **Kết quả kháng nghị**: badge `Đã xét xử` / chờ + dòng "Kết quả: …" |

---

## 8. Vấn đề đã biết

| # | Nội dung | Mức độ |
|---|---|---|
| 1 | Phân trang ở footer là **giả** — luôn hiện "1-N trong tổng N", chưa cắt trang thật | Trung bình |
| 2 | Phần lớn ô ở panel nâng cao **chưa nối vào engine lọc** (xem 4.3) | Trung bình |
| 3 | Số văn bản trong dữ liệu mẫu bị trùng giữa các đơn (nhiều đơn dùng chung một `stl`) | Thấp — dữ liệu mẫu |
| 4 | Nút *Trả lại* / *Hủy* trên thanh trên cùng của màn Thêm mới đang trắng trên nền trắng | Thấp — ngoài phạm vi màn này |

---

## 9. Tham chiếu mã nguồn

| Thành phần | Vị trí |
|---|---|
| Component chính | `app/App.tsx` — `DanhSachDon` |
| Kiểu dữ liệu dòng | `DanhSachDonRow` |
| Dữ liệu mẫu | `SAMPLE_ROWS` (23 bản ghi) |
| Điều kiện tab | `TAB_MATCH[]` |
| Engine lọc | `rowsByFilters` → `filteredRows` |
| Luật loại văn bản ↔ trạng thái | `LOAI_VB_TRANG_THAI` |
| Hàm so khớp | `norm` · `contains` · `parseVNDate` · `inDateRange` · `chuanHoaHinhThuc` |
| Viết tắt TAND | `vietTatTAND` |
| Popup in | `PopupInDanhSachDon` |
| Trạng thái ý kiến Lãnh đạo | `layKetLuanLD` · `datKetLuanLD` · `CHO_Y_KIEN_LD` |
