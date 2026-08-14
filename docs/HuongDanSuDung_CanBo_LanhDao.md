# HƯỚNG DẪN SỬ DỤNG CHI TIẾT HỆ THỐNG QUẢN LÝ ĐƠN THƯ HCTP
## Dành cho Cán bộ Xử lý, Trưởng phòng và Lãnh đạo Văn phòng HCTP

Tài liệu này cung cấp cái nhìn trực quan về các màn hình chức năng chính và quy trình vận hành hệ thống quản lý đơn thư hành chính tư pháp (HCTP).

---

### PHẦN I: DANH MỤC CÁC MÀN HÌNH VÀ BỐ CỤC CHỨC NĂNG

Trước khi thực hiện các thao tác, người dùng cần nắm rõ vai trò và bố cục của từng màn hình chính trong hệ thống.

#### 1. Màn hình: Danh sách đơn (MH-01)
- **Mục đích**: Đây là màn hình trung tâm của hệ thống, nơi hiển thị toàn bộ đơn thư đã tiếp nhận. Cán bộ dùng màn hình này để tra cứu, theo dõi trạng thái đơn và bắt đầu các luồng xử lý chính.
- **Bố cục trực quan gồm 5 khu vực**:
  - **Hàng Tab trên cùng**: Chia đơn thư theo nhóm trạng thái (Tổng số, Đơn của tôi, Đơn thụ lý, Chưa đủ điều kiện, Hết thời hạn kháng nghị, Trạng thái khác).
  - **Khu vực Bộ lọc**: Gồm bộ lọc cơ bản hiển thị sẵn và panel tìm kiếm nâng cao mở rộng để lọc sâu thông tin đơn thư.
  - **Thanh công cụ (Action Bar)**: Nằm ngay trên bảng dữ liệu, chứa các nút tác vụ nhanh như In danh sách đơn, Lưu số văn bản và in báo cáo, Thêm mới đơn.
  - **Bảng dữ liệu (Data Table)**: Hiển thị danh sách các dòng đơn thư. Mỗi dòng chứa các thông tin tóm tắt về đương sự, bản án, trạng thái giải quyết hiện tại.
  - **Menu Thao tác chi tiết**: Nằm ở cuối mỗi dòng đơn (nút ba chấm), chứa các chức năng tác vụ riêng lẻ cho đơn đó (Sửa, Chuyển đơn, Ghép đơn, Bổ sung tài liệu, Hủy số thụ lý, Thêm kết quả giải quyết).

#### 2. Màn hình: Thêm mới / Sửa đổi đơn thư (MH-02)
- **Mục đích**: Dùng để nhập dữ liệu hồ sơ mới nhận vào hệ thống hoặc chỉnh sửa thông tin chi tiết của đơn thư đang xử lý.
- **Bố cục trực quan chia làm 2 Panel song song**:
  - **Panel trái (Form nhập liệu)**: Chứa thanh tiêu đề tác vụ (nút Lưu nháp, Lưu, Đóng) và các tab nhập liệu nghiệp vụ (Thông tin bản án, Thông tin đơn, Đơn thụ lý kèm, Xử lý đơn, Người tham gia tố tụng).
  - **Panel phải (PDF Viewer)**: Hiển thị tệp PDF hồ sơ đã tải lên để cán bộ vừa nhìn văn bản gốc vừa điền thông tin vào form bên trái mà không cần chuyển đổi cửa sổ. Cán bộ có thể đóng panel này bằng nút mũi tên thu gọn.

#### 3. Popup: Lưu số văn bản và Trình duyệt (DocumentNumberingModal)
- **Mục đích**: Dùng để lập tờ trình phân công thẩm phán, công văn chuyển đơn hoặc giấy xác nhận dựa trên thông tin đơn đã chọn ngoài danh sách, sau đó gửi trình lên cấp quản lý duyệt ký.
- **Bố cục trực quan chia làm 2 Panel song song**:
  - **Panel trái (Cấu hình)**: Chứa các trường thông tin phục vụ quy trình duyệt (Loại văn bản cần lập, Người duyệt, Người ký, Mức độ ưu tiên, Lời nhắn trình duyệt) và sơ đồ cây các tài liệu đi kèm bên dưới để người dùng lựa chọn đính kèm.
  - **Panel phải (Biểu mẫu xem trước)**: Hiển thị trang văn bản A4 hoàn chỉnh được tự động điền các thông tin đương sự, số bản án để người dùng kiểm tra trực quan trước khi gửi đi.

#### 4. Màn hình: Quản lý văn bản trình ký
- **Mục đích**: Nơi Trưởng phòng thực hiện duyệt các tờ trình/công văn của cán bộ gửi lên, và Lãnh đạo Văn phòng thực hiện ký số, ban hành chính thức văn bản đi.
- **Bố cục trực quan**: Bảng danh sách phân cấp hiển thị các hồ sơ văn bản đang chờ duyệt, đã duyệt hoặc bị trả lại kèm theo tệp đính kèm và ý kiến phản hồi của các cấp.

---

### PHẦN II: THAO TÁC SỬ DỤNG CHO CÁN BỘ XỬ LÝ ĐƠN THƯ

#### 1. Các bước nhập mới đơn thư
- **Bước 1**: Tại màn hình Danh sách đơn, nhấn nút "+ Thêm mới" trên thanh công cụ.
- **Bước 2**: Nhấn nút tải lên file PDF tại Panel phải. Hệ thống sẽ chạy công cụ OCR để tự động điền các trường cơ bản vào form bên trái.
- **Bước 3**: Kiểm tra lại thông tin được trích xuất tự động. Điền đầy đủ các thông tin bắt buộc tại các Tab ở Panel trái.
- **Bước 4**: Tại tab "Xử lý đơn", chọn đề xuất kết quả xử lý và trạng thái đơn.
- **Bước 5**: Nhấn nút "Lưu" để hoàn tất nhập liệu hoặc "Lưu nháp" nếu muốn sửa đổi thêm về sau.

#### 2. Các bước lập văn bản giải quyết và Trình duyệt
- **Bước 1**: Tích chọn một hoặc nhiều đơn thư cần giải quyết từ bảng dữ liệu ngoài màn hình Danh sách đơn.
- **Bước 2**: Nhấn nút "Lưu số văn bản và in báo cáo" trên thanh công cụ.
- **Bước 3**: Trên giao diện Popup mở ra, chọn Loại văn bản muốn lập tại Panel trái, sau đó chọn người duyệt (Trưởng phòng) và người ký (Lãnh đạo VP).
- **Bước 4**: Đọc soát nội dung văn bản hiển thị tại Panel xem trước bên phải.
- **Bước 5**: Nhấn "Trình duyệt". Hệ thống sẽ kiểm tra hợp lệ, nếu phát hiện đơn lỗi sẽ hiển thị danh sách cảnh báo chặn, cán bộ thực hiện loại bỏ đơn lỗi rồi trình lại.

#### 3. Các bước lập Yêu cầu bổ sung tài liệu
- **Bước 1**: Từ tab "Chưa đủ điều kiện", tích chọn đơn thư cần yêu cầu bổ sung tài liệu.
- **Bước 2**: Tại thanh tác vụ (Action bar), tại mục "Loại văn bản" chọn giá trị "Yêu cầu bổ sung".
- **Bước 3**: Nhấn nút "Lưu số văn bản và in báo cáo" trên thanh công cụ.
- **Bước 4**: Popup mở ra, hệ thống tự động khóa Loại văn bản là "Yêu cầu bổ sung". Người dùng chọn biểu mẫu tương ứng dưới cây danh mục đính kèm (Thông báo YCBS gửi đương sự hoặc Hướng dẫn YCBS gửi trại giam).
- **Bước 5**: Chọn Người duyệt, Người ký và chọn các lý do cần bổ sung (Thiếu bản án, thiếu căn cước công dân hoặc lý do khác).
- **Bước 6**: Kiểm tra nội dung văn bản ở panel phải và nhấn "Trình duyệt".

#### 4. Các bước bổ sung tài liệu cho đơn Chưa đủ điều kiện
- **Bước 1**: Tại bảng dữ liệu màn hình Danh sách đơn, tìm đơn có trạng thái "Chưa đủ điều kiện".
- **Bước 2**: Nhấn vào nút thao tác ba chấm ở cuối dòng đơn và chọn "Bổ sung tài liệu".
- **Bước 3**: Trên popup hiện ra, nhập ngày bổ sung, chọn loại tài liệu và kéo thả tệp đính kèm vào ô tải lên.
- **Bước 4**: Xác định tình trạng đơn sau bổ sung (chọn "Đơn đủ điều kiện" nếu tài liệu bổ sung đã đạt yêu cầu hoặc chọn "Đơn không đủ điều kiện" nếu vẫn thiếu thông tin).
- **Bước 5**: Nhấn "Lưu" để cập nhật dữ liệu mà không làm phát sinh đơn mới trên danh sách.

#### 5. Các bước liên kết Đơn trùng khi nhập mới
- **Bước 1**: Trong màn hình Thêm mới đơn, tại tab "Thông tin bản án" (Tab 1), sau khi nhập đủ Số BA/QĐ, Ngày BA/QĐ và Tòa án, nhấn nút "Tra cứu".
- **Bước 2**: Cuộn xuống bảng Danh sách đơn liên quan ở phía dưới. Tìm đơn có trạng thái "Thụ lý mới" và nhấn nút "Chọn làm đơn trùng".
- **Bước 3**: Hệ thống sẽ tự động sao chép toàn bộ thông tin người đứng đơn sang Tab 2 và ghi nhận mối quan hệ liên kết đơn trùng giữa hai hồ sơ.

#### 6. Các bước Ghép đơn (Gom nhóm đơn)
- **Bước 1**: Trên màn hình Danh sách đơn, tích chọn các đơn cần ghép (phải có ít nhất 2 đơn và tất cả phải thuộc quyền xử lý của bạn).
- **Bước 2**: Nhấn nút "Ghép đơn" trên thanh công cụ.
- **Bước 3**: Trên popup hiện ra, chọn 1 đơn duy nhất làm Đơn chính (bằng cách tích nút tròn), các đơn còn lại sẽ tự động trở thành Đơn kèm.
- **Bước 4**: Nhấn "Xác nhận ghép". Hệ thống sẽ gộp các đơn và gán quyền quản lý toàn bộ các đơn kèm về cho cán bộ sở hữu đơn chính.

#### 7. Các bước Chuyển đơn (Bàn giao quyền xử lý)
- **Bước 1**: Tại menu thao tác ba chấm ở cuối dòng đơn cần chuyển, chọn "Chuyển đơn".
- **Bước 2**: Hệ thống kiểm tra tính hợp lệ:
  - Nếu đơn được chọn là Đơn kèm trong nhóm ghép, hệ thống sẽ chặn và yêu cầu phải thực hiện chuyển từ Đơn chính hoặc hủy ghép đơn này trước.
  - Nếu đơn là Đơn chính của nhóm ghép, hệ thống hiển thị cảnh báo sẽ chuyển toàn bộ nhóm đơn (bao gồm cả các đơn kèm).
- **Bước 3**: Chọn cán bộ nhận từ danh sách và nhập lý do chuyển đơn.
- **Bước 4**: Nhấn nút "Xác nhận chuyển".

---

### PHẦN III: THAO TÁC SỬ DỤNG CHO TRƯỞNG PHÒNG VÀ PHÓ TRƯỞNG PHÒNG

#### 1. Phân công cán bộ xử lý đơn thư mới nhận
- **Bước 1**: Tại màn hình Danh sách đơn, tích chọn các đơn chưa được phân công xử lý.
- **Bước 2**: Tại thanh công cụ, chọn tên cán bộ xử lý trong hộp danh sách "Chọn cán bộ".
- **Bước 3**: Nhấn nút "Xác nhận" để bàn giao quyền xử lý đơn cho cán bộ đó.

#### 2. Thao tác duyệt văn bản
- **Bước 1**: Truy cập màn hình Quản lý văn bản trình ký.
- **Bước 2**: Nhấn vào văn bản có trạng thái "Đang trình duyệt" được gửi đến tài khoản của mình.
- **Bước 3**: Xem xét dự thảo văn bản và hồ sơ đơn đính kèm.
- **Bước 4**: Thực hiện phê duyệt:
  - Nếu đồng ý: Nhấn nút "Phê duyệt" để chuyển tiếp hồ sơ lên Lãnh đạo Văn phòng ký ban hành.
  - Nếu không đồng ý: Nhấn nút "Trả lại", nhập lý do trả lại để cán bộ xử lý sửa đổi.

---

### PHẦN IV: THAO TÁC SỬ DỤNG CHO CHÁNH VĂN PHÒNG VÀ PHÓ CHÁNH VĂN PHÒNG

#### 1. Ký ban hành văn bản đi
- **Bước 1**: Truy cập mục văn bản chờ ký tại module Quản lý văn bản.
- **Bước 2**: Mở xem nội dung chi tiết của văn bản đã được Trưởng phòng phê duyệt chuyển lên.
- **Bước 3**: Nhấn nút "Ký ban hành" để thực hiện ký số. Hệ thống sẽ tự động cấp số văn bản đi chính thức vào thời điểm ký duyệt thành công.

#### 2. Giám sát Báo cáo Thống kê
- Truy cập màn hình Báo cáo và Thống kê từ thanh menu chính.
- Xem số liệu thống kê tổng hợp về lượng đơn tiếp nhận, tỷ lệ đơn giải quyết đúng hạn và danh sách các đơn thư đang bị trễ hạn xử lý hoặc trễ hạn kháng nghị để đưa ra các chỉ đạo đôn đốc cán bộ xử lý.
