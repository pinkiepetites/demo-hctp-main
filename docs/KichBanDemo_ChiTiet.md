# KỊCH BẢN DEMO CHI TIẾT HỆ THỐNG QUẢN LÝ ĐƠN HCTP

Kịch bản demo dưới đây được chia thành các luồng nghiệp vụ độc lập nhằm trình diễn đầy đủ các tính năng trọng tâm của hệ thống. Kịch bản ưu tiên đi từ luồng trơn tru nhất (Happy Case) để khách hàng thấy sự tiện lợi, sau đó mới đến các luồng xử lý ngoại lệ và tiện ích nâng cao. 

---

## PHẦN 1: DỮ LIỆU CẦN CHUẨN BỊ TRƯỚC DEMO

**1. Chuẩn bị chung (Tài khoản & Trình duyệt):**
- Mở sẵn 3-4 tab trình duyệt ẩn danh/cấu hình đăng nhập sẵn các vai trò:
  - Tab 1: **Cán bộ 1** (Tiếp nhận đơn).
  - Tab 2: **Cán bộ 2** (Nhận chuyển đơn & ghép đơn).
  - Tab 3: **Trưởng phòng** (Duyệt văn bản).
  - Tab 4: **Phó/Chánh Án** và **Phó/Chánh VP** (Ký duyệt văn bản).

**2. Dữ liệu chuẩn bị chi tiết theo từng luồng:**

* **Luồng 1 (Happy Case - Tiếp nhận & Phân công):**
  - **Thông tin hồ sơ**: Chuẩn bị sẵn 1 bộ thông tin đương sự (Tên, Địa chỉ, Số bản án/Quyết định dân sự/hình sự hoàn chỉnh, Tội danh...).
  - **Tài liệu đính kèm**: Cần 1 file PDF mẫu (Bản án/Quyết định) để biểu diễn trực quan tính năng xem trước tài liệu trên web.

* **Luồng 2 (Xử lý ngoại lệ - Yêu cầu bổ sung):**
  - **Thông tin hồ sơ**: 1 đơn chưa đủ điều kiện. Đơn này có thể tạo trước hoặc **tạo mới trực tiếp trong lúc demo** (ví dụ đương sự Lê Văn C) để biểu diễn thao tác chọn "Không đủ điều kiện".
  - **Tài liệu nộp bù**: Cần sẵn 1 file PDF mẫu để đóng vai trò là "Bản án đương sự nộp bổ sung" ở bước 2.2.

* **Luồng 3 (Chuyển đơn & Ghép đơn):**
  - **Đơn mồi (Đơn gốc chờ ghép)**: Cần **tạo trước** trên hệ thống một đơn có tên đương sự trùng khớp với đương sự ở Luồng 2 (vd: Lê Văn C).
  - **Điều kiện đơn mồi**: Trạng thái đơn phải là *Thụ lý mới* và đang được **phân công giải quyết cho Cán bộ 2**. (Mục đích: dùng làm đơn gốc để demo tính năng hệ thống tự động gộp đơn khi phát hiện trùng lặp).

---

## PHẦN 2: CÁC LUỒNG DEMO CHI TIẾT

### LUỒNG 1: HAPPY CASE - TIẾP NHẬN HỢP LỆ & PHÂN CÔNG THẨM PHÁN
*(Bao gồm: Tiếp nhận đủ điều kiện -> Thụ lý mới -> Lập Tờ trình phân công -> Lãnh đạo duyệt/ký -> Tạo thông báo phân công)*

#### Bước 1.1: Tiếp nhận đơn đủ điều kiện
- **Vai trò**: Cán bộ (`can-bo`).
- **Trình tự thao tác**:
  1. Vào **Quản lý đơn** > **Danh sách đơn** > Bấm nút **+ Thêm mới**.
  2. Nhập thông tin đương sự (ví dụ: Nguyễn Văn A), đính kèm file PDF bản án ở cột bên phải.
  3. Sang tab **Xử lý đơn**, phần Kết quả chọn "Đơn đủ điều kiện" > "Thụ lý mới". Nhập số thụ lý tạm (nếu cần). Nhấn nút **Lưu**.

#### Bước 1.2: Lập Tờ trình phân công Thẩm phán
- **Vai trò**: Cán bộ (`can-bo`).
- **Trình tự thao tác**:
  1. Ở Danh sách đơn, tích chọn vào ô vuông trước đơn Nguyễn Văn A vừa thụ lý. Bấm nút **Lưu số văn bản...** (hoặc icon tạo văn bản) trên thanh công cụ.
  2. Chọn loại văn bản là "Tờ trình phân công Thẩm phán". Chọn Người duyệt (Trưởng phòng) và Người ký (Lãnh đạo).
  3. Ở panel xem trước bên phải, bấm nút **Sửa**, gõ tên Thẩm phán dự kiến vào văn bản > **Lưu** > Bấm **Trình duyệt**.

#### Bước 1.3: Quy trình ký/duyệt của Lãnh đạo
- **Vai trò**: Trưởng phòng & Lãnh đạo VP.
- **Trình tự thao tác**:
  1. Đổi sang tab trình duyệt của vai **Trưởng phòng** > Vào **Phê duyệt đề xuất** > Chọn tờ trình của Nguyễn Văn A > Chọn người duyệt tiếp > Bấm **Phê duyệt**.
  2. Đổi sang tab trình duyệt của vai **Phó / Chánh Văn phòng** > Vào **Phê duyệt đề xuất**> Chọn người duyệt tiếp > Bấm **Phê duyệt**.
  3. Đổi sang tab trình duyệt của vai **Phó / Chánh Án** > Vào **Phê duyệt đề xuất**> Bấm **Phê duyệt**.
  4. Đổi sang tab trình duyệt của vai **Phó / Chánh Văn phòng** > Vào **Danh sách văn bản** > Mở Tờ trình > Bấm **Ký logic**.

#### Bước 1.4: Tạo thông báo phân công Thẩm phán tự động (Tính năng nổi bật)
- **Vai trò**: Cán bộ (`can-bo`).
- **Trình tự thao tác**:
  1. Chuyển lại vai trò **Cán bộ** > Vào **Danh sách văn bản** > Click mở chi tiết Tờ trình phân công vừa được lãnh đạo ký.
  2. Cuộn xuống dưới cùng bên phải panel chi tiết, bấm nút **Tạo thông báo phân công**.
  3. Cửa sổ "Lưu và trình ký" bật lên, Loại văn bản được điền sẵn là "Thông báo phân công TP" và danh sách Đơn liên quan đã có sẵn đơn Nguyễn Văn A. Bấm **Lưu nháp** hoặc **Trình duyệt**. Sau đó thực hiện luồng ký số như 1.3

---

### LUỒNG 2: XỬ LÝ NGOẠI LỆ - ĐƠN KHÔNG HỢP LỆ
*(Bao gồm: Tiếp nhận thiếu hồ sơ -> Tạo YCBS -> Lãnh đạo ký -> Bổ sung tài liệu)*

#### Bước 2.1: Tiếp nhận đơn thiếu tài liệu & Tạo Yêu cầu bổ sung
- **Vai trò**: Cán bộ (`can-bo`).
- **Trình tự thao tác**:
  1. Thêm mới 1 đơn (ví dụ: Lê Văn C), sang tab **Xử lý đơn** chọn "Đơn không đủ điều kiện", lý do "Thiếu bản án" > **Lưu**.
  2. Ở Danh sách đơn, bấm nút ba chấm ở dòng đơn Lê Văn C > Chọn **Tạo yêu cầu bổ sung**.
  3. Chọn người duyệt/ký, tick biểu mẫu "Thông báo YCBS gửi đương sự" & tick lý do. Bấm **Trình duyệt**.

#### Bước 2.2: Lãnh đạo ký YCBS và Cán bộ bổ sung tài liệu
- **Vai trò**: Lãnh đạo (Duyệt/Ký) -> Cán bộ (Bổ sung).
- **Trình tự thao tác**:
  1. (Thao tác nhanh) Trưởng phòng duyệt, Lãnh đạo VP ký YCBS.
  2. Về lại tab **Cán bộ** > Vào **Danh sách đơn** > tab **Chưa đủ điều kiện** > Nút ba chấm ở đơn Lê Văn C > **Bổ sung tài liệu**.
  3. Tải file bản án lên. Kéo xuống phần Kết quả, chọn "Đơn đủ điều kiện" > "Thụ lý mới" > **Lưu**.

---

### LUỒNG 3: LUÂN CHUYỂN VÀ XỬ LÝ TRÙNG LẶP
*(Bao gồm: Chuyển đơn -> Ghép đơn)*

#### Bước 3.1: Quy trình chuyển đơn
- **Vai trò**: Cán bộ 1.
- **Trình tự thao tác**:
  1. Tại Danh sách đơn, bấm nút ba chấm cuối dòng đơn Lê Văn C vừa thụ lý xong > **Chuyển đơn**.
  2. Chọn người nhận là Cán bộ 2, nhập lý do "Phân công lại" > **Xác nhận**.

#### Bước 3.2: Quy trình ghép đơn
- **Vai trò**: Cán bộ 2.
- **Trình tự thao tác**:
  1. Đổi sang tab trình duyệt của **Cán bộ 2** > Vào **Danh sách đơn**.
  2. Tích chọn vào ô vuông trước đơn Lê Văn C (vừa chuyển tới) và Đơn B1 (đơn mồi đã chuẩn bị từ trước). Bấm nút **Ghép đơn** hình mắt xích ở thanh công cụ phía trên.
  3. Cửa sổ hiện ra, tích chọn radio button tại Đơn B1 để làm đơn chính > Bấm **Xác nhận ghép**.
