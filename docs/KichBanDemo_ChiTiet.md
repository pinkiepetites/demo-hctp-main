# KỊCH BẢN DEMO CHI TIẾT HỆ THỐNG QUẢN LÝ ĐƠN THƯ HCTP
## Luồng Nghiệp Vụ Liên Thông Đầu Cuối (End-to-End Workflow) Trên Giao Diện Thực Tế

Kịch bản demo dưới đây mô tả chi tiết từng bước thao tác trực quan trên giao diện phần mềm, đi theo một luồng nghiệp vụ duy nhất từ khâu cán bộ tiếp nhận hồ sơ, qua các cấp phê duyệt, đến bổ sung, chuyển quyền xử lý, ghép trùng và xử lý sai sót.

---

### TÓM TẮT TIẾN TRÌNH LUỒNG DEMO (MỘT LUỒNG DUY NHẤT)
Câu chuyện nghiệp vụ: Tiếp nhận và xử lý hồ sơ đơn đề nghị của đương sự **Trần Văn Bình** liên quan đến Bản án hình sự của Tòa án nhân dân tỉnh.
- **Bước 1 (Vai trò: Cán bộ xử lý cũ)**: Tạo hồ sơ mới bằng PDF OCR ở trạng thái Chưa đủ điều kiện.
- **Bước 2 (Vai trò: Cán bộ xử lý cũ)**: Lập Yêu cầu bổ sung tài liệu trình duyệt.
- **Bước 3 (Vai trò: Trưởng phòng)**: Phê duyệt đề xuất yêu cầu bổ sung.
- **Bước 4 (Vai trò: Phó / Chánh Văn phòng)**: Ký ban hành văn bản, hệ thống cấp số tự động.
- **Bước 5 (Vai trò: Cán bộ xử lý cũ)**: Bổ sung tài liệu gốc và cập nhật trạng thái đơn thành Thụ lý mới.
- **Bước 6 (Vai trò: Cán bộ xử lý cũ)**: Thực hiện Chuyển đơn (bàn giao đơn thư của Trần Văn Bình sang Cán bộ xử lý mới).
- **Bước 7 (Vai trò: Cán bộ xử lý mới)**: Thực hiện Ghép đơn.
- **Bước 8 (Vai trò: Cán bộ xử lý mới)**: Lập Tờ trình phân công Thẩm phán và Trình duyệt.
- **Bước 9 (Vai trò: Trưởng phòng & Lãnh đạo)**: Phê duyệt và Ký ban hành tờ trình phân công.
- **Bước 10 (Vai trò: Cán bộ xử lý mới)**: Thực hiện Hủy số thụ lý cấp nhầm để thu hồi số trong ngày.

---

### CHI TIẾT CÁC BƯỚC THAO TÁC TRÊN GIAO DIỆN

#### Bước 1: Tiếp nhận đơn thư mới
- **Vai trò hiện tại**: Đăng nhập tài khoản cán bộ xử lý cũ. Vùng hiển thị vai trò ở góc dưới cùng bên trái của Sidebar hiển thị **Cán bộ** (`can-bo`).
- **Thao tác trên giao diện**:
  1. Tại Sidebar, chọn menu **Quản lý đơn** > **Danh sách đơn**.
  2. Tại thanh công cụ phía trên bảng dữ liệu, nhấn nút **+ Thêm mới**.
  3. Màn hình chuyển sang giao diện Thêm mới gồm 2 Panel. Tại Panel bên phải, nhấn nút **Tải lên file PDF** và chọn tệp đơn đề nghị của đương sự **Trần Văn Bình**.
  4. Hệ thống chạy OCR, điền tự động tên người gửi là "Trần Văn Bình" vào form Panel bên trái.
  5. Cán bộ chuyển sang tab **Xử lý đơn** (Tab 4) ở form bên trái, chọn trường **Trạng thái đơn** là "Đơn không đủ điều kiện", chọn **Lý do không đủ điều kiện** là "Thiếu bản án/quyết định".
  6. Nhấn nút **Lưu** ở thanh tiêu đề trên cùng. Giao diện quay trở lại màn hình Danh sách đơn.

#### Bước 2: Lập Yêu cầu bổ sung tài liệu
- **Vai trò hiện tại**: Cán bộ (`can-bo`).
- **Thao tác trên giao diện**:
  1. Tại Sidebar, chọn menu **Quản lý đơn** > **Danh sách đơn**. Nhấp chọn tab **Đơn của tôi**.
  2. Nhập "Trần Văn Bình" vào ô **Từ khóa tìm kiếm chung** ở bộ lọc cơ bản để tìm nhanh dòng đơn vừa tạo.
  3. Nhấn vào nút thao tác ba chấm ở cuối dòng đơn Trần Văn Bình, chọn **Tạo yêu cầu bổ sung**.
  4. Giao diện mở ra Popup **Lưu số văn bản và trình duyệt**.
  5. Tại Panel trái của Popup, chọn trường **Người duyệt** là "Trần Văn B - Trưởng phòng", chọn **Người ký** là "Hoàng Kim Long - CVP".
  6. Tại cây danh mục văn bản đính kèm phía dưới, tích chọn biểu mẫu **Thông báo YCBS gửi đương sự**.
  7. Tại ô nhập lý do bổ sung, tick chọn lý do "Thiếu bản án có hiệu lực pháp luật".
  8. Quan sát nội dung dự thảo Văn bản A4 cập nhật tự động ở Panel xem trước bên phải. Nhấn nút **Trình duyệt**.

#### Bước 3: Trưởng phòng phê duyệt đề xuất
- **Thao tác chuyển vai trò**: Click vào Khối tài khoản ở góc dưới cùng bên trái của Sidebar, chọn **Chuyển vai trò** > **Trưởng phòng** (`truong-phong`).
- **Thao tác trên giao diện**:
  1. Tại Sidebar, chọn menu **Công tác lãnh đạo** > **Phê duyệt đề xuất**.
  2. Tìm kiếm dòng văn bản đề xuất có tên đương sự **Trần Văn Bình** ở trạng thái Chờ duyệt. Nhấn chọn dòng đó để mở chi tiết.
  3. Kiểm tra nội dung văn bản và ý kiến trình của cán bộ. Nhấn nút **Phê duyệt**.

#### Bước 4: Lãnh đạo Văn phòng ký ban hành văn bản đi
- **Thao tác chuyển vai trò**: Click vào Khối tài khoản ở góc dưới cùng bên trái, chọn **Chuyển vai trò** > **Phó / Chánh Văn phòng** (`pho-vp`).
- **Thao tác trên giao diện**:
  1. Tại Sidebar, chọn menu **Quản lý đơn** > **Danh sách văn bản**.
  2. Tìm kiếm và nhấp chọn văn bản Thông báo yêu cầu bổ sung của đương sự **Trần Văn Bình** (đang có trạng thái Chờ ký).
  3. Nhấn nút **Ký ban hành**.
  4. Hệ thống hiển thị thông báo ký ban hành thành công và cập nhật số văn bản đi chính thức.

#### Bước 5: Cập nhật tài liệu nộp bổ sung trực tiếp
- **Thao tác chuyển vai trò**: Click vào Khối tài khoản ở góc dưới cùng bên trái, chọn **Chuyển vai trò** > **Cán bộ** (`can-bo`).
- **Thao tác trên giao diện**:
  1. Khi đương sự mang bản án hình sự gốc đến nộp, cán bộ mở màn hình **Danh sách đơn**, nhấn chọn tab **Chưa đủ điều kiện**.
  2. Nhập từ khóa "Trần Văn Bình" để tìm kiếm nhanh đơn.
  3. Nhấn nút ba chấm ở cuối dòng đơn, chọn **Bổ sung tài liệu**.
  4. Popup hiện ra, nhập ngày bổ sung, chọn loại tài liệu và tải lên file quét bản án gốc. Nhấn nút **Thêm vào danh sách**.
  5. Tại phần Kết quả giải quyết phía dưới popup, chọn **Đơn đủ điều kiện**. Tại ô **Thụ lý đơn** chọn "Thụ lý mới". Nhập Số thụ lý tạm thời. Nhấn nút **Lưu**.
  6. Đơn biến mất khỏi tab Chưa đủ điều kiện và chuyển sang trạng thái Thụ lý mới ngoài danh sách.

#### Bước 6: Thực hiện Chuyển quyền xử lý (Chuyển đơn)
- **Thao tác trên giao diện**:
  1. Tại màn hình **Danh sách đơn**, tìm dòng đơn của đương sự **Trần Văn Bình** vừa được thụ lý mới.
  2. Nhấn nút ba chấm ở cuối dòng đơn Trần Văn Bình, chọn **Chuyển đơn**.
  3. Giao diện mở ra Popup Chuyển đơn. Tại ô chọn cán bộ nhận, chọn tên cán bộ xử lý mới (ví dụ: cán bộ Trần Văn C). Nhập lý do chuyển đơn và nhấn nút **Xác nhận**.
  4. Đơn biến mất khỏi danh sách quản lý của cán bộ cũ.

#### Bước 7: Tra cứu đơn trùng và Ghép đơn
- **Thao tác giả định**: Cán bộ xử lý mới đăng nhập hệ thống, mở màn hình **Danh sách đơn** > **Đơn của tôi**.
- **Thao tác trên giao diện**:
  1. Tại ô **Từ khóa tìm kiếm chung**, cán bộ mới nhập số bản án của đương sự Trần Văn Bình vừa nhận bàn giao để kiểm tra.
  2. Hệ thống hiển thị 2 dòng đơn có cùng số bản án (gồm 1 đơn trùng cũ đã có sẵn từ trước do cán bộ mới phụ trách và đơn mới vừa được chuyển giao).
  3. Tích chọn vào checkbox đầu dòng của cả 2 đơn Trần Văn Bình.
  4. Tại thanh công cụ phía trên bảng, nhấn nút **Ghép đơn**.
  5. Trên popup xác nhận, chọn đơn trùng cũ làm Đơn chính, đơn mới nhận bàn giao làm Đơn kèm. Nhấn nút **Xác nhận ghép**.
  6. Hệ thống liên kết 2 đơn thành một nhóm, đơn mới nhận bàn giao hiển thị nhãn "Đã ghép với [Mã đơn chính]".

#### Bước 8: Lập Tờ trình phân công Thẩm phán
- **Thao tác trên giao diện**:
  1. Tích chọn dòng đơn chính (đơn cũ của cán bộ mới) của Trần Văn Bình trên bảng danh sách đơn.
  2. Nhấn nút **Lưu số văn bản và in báo cáo** trên thanh công cụ.
  3. Trên popup hiện ra, chọn Loại văn bản là "Tờ trình phân công thẩm phán". Chọn Người duyệt và Người ký.
  4. Tại Panel xem trước bên phải, nhấn nút **Sửa** trực tiếp trên văn bản tờ trình, tiến hành chỉ định Thẩm phán dự kiến phân công giải quyết, nhấn hoàn thành sửa.
  5. Nhấn nút **Trình duyệt** để chuyển đề xuất lên phòng ban.

#### Bước 9: Phê duyệt và Ban hành tờ trình phân công
- **Thao tác trên giao diện**:
  1. Chuyển vai trò sang **Trưởng phòng** (`truong-phong`), vào menu **Phê duyệt đề xuất** duyệt tờ trình phân công thẩm phán của đương sự Trần Văn Bình.
  2. Chuyển vai trò sang **Phó / Chánh Văn phòng** (`pho-vp`), vào mục **Danh sách văn bản** mở tờ trình đã được phê duyệt và nhấn nút **Ký ban hành** để hoàn tất ban hành quyết định giải quyết thụ lý đơn.

#### Bước 10: Hủy số thụ lý cấp sai
- **Thao tác chuyển vai trò**: Chọn **Chuyển vai trò** > **Cán bộ** (`can-bo`).
- **Thao tác trên giao diện**:
  1. Phát hiện nhập sai số thụ lý tạm thời của đơn Trần Văn Bình trong ngày. Mở màn hình **Danh sách đơn** của cán bộ mới.
  2. Tìm đơn của đương sự **Trần Văn Bình** (đang ở trạng thái Thụ lý mới).
  3. Nhấn vào nút ba chấm ở cuối dòng, chọn **Hủy số thụ lý**.
  4. Popup cảnh báo hiện ra, xác nhận thông tin và nhấn nút **Xác nhận**.
  5. Số thụ lý bị xóa bỏ, đơn tự động cập nhật trạng thái thành "Không thụ lý" và ghi nhận lịch sử thao tác.
