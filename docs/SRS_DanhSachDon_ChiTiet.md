# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## MÀN HÌNH: DANH SÁCH ĐƠN (MH-01)

### 1. Giới thiệu và Mục đích sử dụng
Màn hình Danh sách đơn là trung tâm quản lý và tiếp nhận đơn thư, hồ sơ vụ việc của hệ thống. Chức năng chính bao gồm:
- Tra cứu và lọc đơn đề nghị giám đốc thẩm, tái thẩm (GĐT-TT) theo nhiều tiêu chí nghiệp vụ.
- Theo dõi tiến độ và trạng thái giải quyết của từng hồ sơ đơn.
- Cho phép thực hiện các thao tác lập văn bản hàng loạt hoặc đơn lẻ, in ấn danh sách báo cáo.
- Chuyển tiếp sang các màn hình nghiệp vụ khác như Thêm mới đơn, Sửa đơn, Lập tờ trình.

---

### 2. Cấu trúc Tabs màn hình
Màn hình chia thành các tab để thu hẹp phạm vi đơn hiển thị. Số hiển thị cạnh nhãn tab tương ứng với số lượng đơn khớp với điều kiện lọc hiện tại.

- **Tổng số**: Hiển thị toàn bộ đơn thư khớp với bộ lọc đang áp dụng.
- **Đơn của tôi**: Lọc các đơn thuộc quyền xử lý của tài khoản đang đăng nhập (owner_officer_id trùng với ID tài khoản hiện tại).
- **Đơn Thụ lý**: Lọc các đơn có trạng thái giải quyết là "Đã thụ lý".
- **Chưa đủ điều kiện**: Lọc các đơn có trạng thái giải quyết là "Chưa đủ điều kiện".
- **Hết thời hạn kháng nghị**: Lọc các đơn có thời hiệu là "Quá 3 năm" hoặc "Quá 5 năm".
- **Khác**: Lọc các đơn có trạng thái giải quyết không thuộc các nhóm: Thụ lý mới, Đã thụ lý, Chưa đủ điều kiện.

---

### 3. Bộ lọc tìm kiếm

#### 3.1. Bộ lọc cơ bản (Luôn hiển thị)
- **Từ khóa tìm kiếm chung**: Tìm kiếm gần đúng không phân biệt hoa thường trên các trường: người gửi, địa chỉ, mã đơn, loại hình thức, người nhập, số bản án/quyết định (BA/QĐ), tòa xét xử, thủ tục, hình thức, số công văn, loại công văn, đơn vị gửi, thẩm phán, đơn vị giải quyết, trạng thái, số tờ trình.
- **Số tờ trình / Văn bản**: Tìm kiếm theo số tờ trình thụ lý hoặc số công văn.
- **Mã đơn / Số hiệu đơn**: Tìm kiếm chính xác hoặc gần đúng theo mã định danh của đơn.
- **Hình thức đơn**: Chọn từ danh mục hình thức đơn.
- **Người gửi**: Tìm kiếm gần đúng theo họ tên người gửi đơn.
- **Số bản án/QĐ**: Tìm kiếm theo số hiệu bản án hoặc quyết định liên quan.
- **Tòa ra bản án / quyết định**: Chọn tòa án ban hành từ danh sách tòa án trong hệ thống.
- **Ngày nhập**: Lọc theo khoảng thời gian nhập đơn (Từ ngày - Đến ngày).

#### 3.2. Bộ lọc nâng cao (Đóng/mở dạng Panel Inline)
Nhấn nút **Bộ lọc nâng cao** để mở panel gồm 3 cột thông tin:

##### Cột 1:
- **Địa chỉ gửi đơn**: Chọn Tỉnh/Thành phố gửi đơn.
- **Hình thức nhận**: Chọn phương thức tiếp nhận (Bưu điện, Điện tử, Trực tiếp, Trực tuyến, Nội bộ, Tiếp công dân).
- **Ngày thụ lý từ**: Bộ lọc mốc ngày bắt đầu thụ lý.
- **Phạm vi tìm kiếm**: Chọn phạm vi dữ liệu (Đơn vị của tôi, Toàn hệ thống).
- **Tên cơ quan chuyển đơn**: Nhập tên cơ quan gửi chuyển tiếp đơn.
- **Thẩm phán**: Chọn bậc thẩm phán và họ tên thẩm phán.
- **Nơi chuyển**: Lọc theo nơi chuyển đơn (Nội bộ, Tòa khác, Ngoài tòa án).
- **Chuyển tới CA/TA**: Lọc đơn đã chuyển tới Công an hoặc Tòa án (Có/Không).
- **Ngày chuyển từ**: Lọc mốc ngày chuyển đi.
- **Án tử hình**: Lọc đơn có tính chất án tử hình (Có/Không).
- **Trạng thái chuyển**: Chọn trạng thái chuyển đơn (Chưa chuyển, Đã chuyển, Đã nhận).

##### Cột 2:
- **Địa chỉ chi tiết**: Tìm kiếm theo địa chỉ chi tiết của đương sự.
- **Số CMND/CCCD**: Tìm kiếm theo số định danh cá nhân đương sự.
- **Nhận đơn từ**: Lọc khoảng ngày nhận đơn (bắt đầu).
- **Số CV/PC đến**: Lọc theo số công văn hoặc phiếu chuyển đến.
- **Lãnh đạo chỉ đạo**: Lọc đơn có ý kiến chỉ đạo của Lãnh đạo (Có/Không).
- **Loại công văn**: Lọc theo nhóm công văn và số hiệu công văn.
- **Chuyển đến**: Chọn Vụ chuyên môn thụ lý tiếp theo (Vụ chuyên môn 1, 2, 3, 4).
- **Loại án**: Chọn loại án (Hình sự, Dân sự, Hành chính, Kinh doanh thương mại, Hôn nhân gia đình, Lao động).
- **Ngày BA/QĐ từ - Đến ngày**: Lọc khoảng thời gian ban hành bản án hoặc quyết định.
- **Người nhập**: Chọn cán bộ nhập liệu đơn.

##### Cột 3:
- **Trả lời đơn**: Lọc trạng thái trả lời đương sự (Đã trả lời, Chưa trả lời).
- **Ngày CV/PC**: Lọc theo ngày công văn hoặc phiếu chuyển.
- **Ngày thụ lý đến**: Lọc mốc ngày kết thúc thụ lý.
- **Nhận đơn đến**: Lọc khoảng ngày nhận đơn (kết thúc).
- **Ngày chuyển đến**: Lọc ngày cơ quan nhận nhận được đơn chuyển.
- **Trại giam**: Lọc đơn gửi từ phạm nhân trong trại giam (Có/Không).
- **Trạng thái đơn**: Lọc đơn đủ điều kiện hoặc không đủ điều kiện (đơn không đủ điều kiện tương ứng với trạng thái giải quyết là "Chưa đủ điều kiện", đơn đủ điều kiện tương ứng với các trạng thái còn lại).
- **Thụ lý đơn**: Lọc theo phân loại thụ lý (Thụ lý mới, Đã thụ lý, Chờ ý kiến Lãnh đạo, Không).
- **Thủ tục giải quyết**: Lọc theo thủ tục (Giám đốc thẩm, Tái thẩm).
- **Số QĐKN**: Lọc theo số quyết định kháng nghị.
- **Người kháng nghị**: Tìm kiếm theo họ tên người ban hành quyết định kháng nghị.
- **Ngày QĐKN**: Lọc theo ngày ban hành quyết định kháng nghị.

#### 3.3. Các nút thao tác bộ lọc
- **Tìm kiếm**: Áp dụng các điều kiện lọc đang chọn lên bảng dữ liệu và đóng panel lọc nâng cao.
- **Làm mới**: Xóa toàn bộ điều kiện lọc đang chọn (bao gồm cả bộ lọc cơ bản và nâng cao) về trạng thái mặc định. Hiển thị số lượng điều kiện đang áp dụng trên nhãn nút.

---

### 4. Bảng dữ liệu danh sách đơn
Bảng dữ liệu hiển thị danh sách đơn khớp với bộ lọc. Các cột thông tin gồm:

1. **STT**: Checkbox lựa chọn dòng và số thứ tự hiển thị. Checkbox tại tiêu đề cột cho phép chọn hoặc bỏ chọn toàn bộ các dòng đơn đang hiển thị trên trang hiện tại.
2. **Thông tin người gửi / đơn vị gửi**:
   - Họ tên người gửi hoặc người đứng đơn.
   - Địa chỉ liên hệ.
   - Ngày trên đơn và ngày nhận đơn.
   - Mã đơn và số hiệu đơn.
   - Nhãn thời hiệu giải quyết (Không xác định thời hiệu giải quyết, Trong thời hạn giải quyết 1 năm, Quá thời hiệu giải quyết trên 3 năm, Quá thời hiệu giải quyết trên 5 năm).
3. **Thông tin đơn**:
   - Thông tin bản án gồm: Số BA/QĐ, ngày ban hành và Tòa án xét xử (chuẩn hóa hiển thị "Tòa án nhân dân" thành "TAND").
   - Thủ tục giải quyết và hình thức đơn.
   - Số công văn, ngày công văn, loại công văn và đơn vị gửi (chỉ hiển thị đơn vị gửi nếu thông tin này khác với Người gửi).
   - Thẩm phán được phân công.
   - Trạng thái chuyển đơn (Đã chuyển/Chưa chuyển) kèm đơn vị giải quyết và ngày chuyển.
   - Ghi chú bổ sung.
4. **Số đơn**: Số lượng đơn được gộp trong hồ sơ đơn.
5. **Hình thức tiếp nhận**: Hiển thị phương thức tiếp nhận đơn (Trực tiếp, Bưu điện, hoặc các hình thức khác).
6. **Thông tin giải quyết**:
   - Trạng thái giải quyết hiện tại của đơn (Thụ lý mới, Đã thụ lý, Chưa đủ điều kiện, Trả lại đơn, Chờ ý kiến Lãnh đạo, Không thụ lý, hoặc Chưa có nếu chưa cập nhật).
   - Trạng thái đặc biệt hiển thị ưu tiên:
     - Nếu đã được duyệt trả lại: Hiển thị "Trả lại - chờ TP duyệt" hoặc "Đã trả lại HCTP".
     - Nếu thuộc nhóm ghép đơn tự động (cùng số bản án và cùng ngày nhập, không áp dụng cho đơn Chờ ý kiến Lãnh đạo): Hiển thị thông tin "Đã ghép với [Mã đơn]".
   - Dưới thông tin trạng thái hiển thị thêm: Số tờ trình (STL) nếu có, liên kết **Lịch sử xử lý HCTP** và liên kết **Danh sách văn bản** (xem mục 5).
7. **Người nhập / Sửa**: Họ tên cán bộ thực hiện thao tác nhập hoặc sửa đổi thông tin đơn kèm mốc thời gian (ngày, giờ).
8. **Thao tác**: Nút mở menu hành động chi tiết (Action Menu) cho từng dòng đơn.

---

### 5. Các liên kết nghiệp vụ trực tiếp trên bảng dữ liệu

#### 5.1. Liên kết Lịch sử xử lý HCTP
Khi nhấn vào liên kết này tại cột **Thông tin giải quyết**, hệ thống mở một Popup hiển thị lịch sử các bước xử lý của đơn thư:
- **Nội dung hiển thị**: Danh sách các mốc thời gian xử lý xếp theo thứ tự thời gian. Mỗi mốc ghi nhận:
  - Hành động thực hiện (Ví dụ: Nhập mới đơn, Phân công thẩm phán, Trình duyệt tờ trình, Phê duyệt, Hủy số thụ lý, Bổ sung tài liệu).
  - Tên cán bộ thực hiện thao tác.
  - Thời gian thực hiện (giờ, ngày/tháng/nam).
  - Nội dung chi tiết hoặc ghi chú của thao tác (ví dụ: lý do chuyển đơn, lý do trả lại đơn).
- **Thao tác người dùng**: Nhấn nút "Đóng" để tắt popup.

#### 5.2. Liên kết Danh sách văn bản
Khi nhấn vào liên kết này tại cột **Thông tin giải quyết**, hệ thống mở một Popup hiển thị danh sách các văn bản, giấy tờ đã được lập hoặc liên kết với đơn hiện tại:
- **Nội dung hiển thị**: Bảng danh sách các văn bản gồm các thông tin:
  - Tên loại văn bản (Ví dụ: Tờ trình phân công thẩm phán, Giấy xác nhận tiếp nhận đơn, Công văn chuyển đơn).
  - Số văn bản và ngày ban hành văn bản.
  - Trạng thái ký duyệt của văn bản (Chưa trình, Đang trình duyệt, Đã duyệt ký, Bị trả lại).
  - File đính kèm (cho phép nhấn vào để tải về hoặc xem trực tiếp).
- **Thao tác người dùng**:
  - Nhấn vào tên văn bản để xem chi tiết nội dung văn bản.
  - Nhấn nút "Đóng" để tắt popup.

---

### 6. Thanh công cụ và các Popup chức năng hệ thống

#### 6.1. Popup Lưu số văn bản và trình duyệt (PopupLuuSoVanBan / DocumentNumberingModal)
Kích hoạt khi người dùng nhấn nút **Lưu số văn bản và in báo cáo** trên thanh công cụ.

##### A. Tiền điều kiện hiển thị đơn trong popup
- Đơn được tick chọn trên danh sách, hoặc nếu không chọn đơn nào thì hệ thống tự động lấy toàn bộ đơn đang hiển thị theo bộ lọc và tab hiện hành.
- Hệ thống kiểm tra tính hợp lệ của đơn. Nếu có đơn không hợp lệ (ví dụ: thiếu thông tin bắt buộc đối với loại văn bản muốn lập), hệ thống hiển thị popup cảnh báo chặn trình duyệt `PopupChanTrinhDuyet`:
  - **Nội dung**: Hiển thị số lượng đơn không hợp lệ và danh sách chi tiết lý do không hợp lệ của từng đơn.
  - **Nút hành động**:
    - **Đóng**: Tắt popup cảnh báo quay lại giao diện thiết lập.
    - **Bỏ đơn không hợp lệ**: Loại bỏ các đơn lỗi ra khỏi danh sách đang chọn lập văn bản và tiếp tục tiến trình.

##### B. Cấu trúc giao diện Popup (Chia làm 2 Panel)
- **Panel trái (Cấu hình và danh sách tài liệu đính kèm)**:
  - **Loại văn bản**: Dropdown lựa chọn loại văn bản chính cần lập (Tờ trình phân công thẩm phán, Giấy xác nhận, Giấy xác nhận cơ quan chuyển đơn, Công văn chuyển nội bộ, Công văn chuyển tòa khác, Công văn chuyển ngoài, Trả lại đơn, Tờ trình khác, Thông báo phân công TP, Yêu cầu bổ sung).
  - **Người duyệt**: Dropdown chọn cán bộ duyệt cấp 1 (Trưởng phòng/Phó phòng).
  - **Người ký**: Dropdown chọn lãnh đạo ký ban hành (Chánh văn phòng/Phó chánh văn phòng).
  - **Mức độ ưu tiên**: Chọn mức độ (Bình thường, Thấp, Cao).
  - **Người thực hiện**: Hiển thị tên cán bộ đang thao tác.
  - **Ý kiến trình duyệt**: Ô nhập nội dung ghi chú gửi người duyệt.
  - **Cây danh sách văn bản đi kèm**: Hiển thị sơ đồ phân cấp văn bản chính và các tài liệu đính kèm bên dưới. Cho phép người dùng tick chọn các loại văn bản đi kèm tương ứng với văn bản chính đang lập (bị giới hạn theo quy tắc nghiệp vụ của từng loại văn bản chính).
  - **Thao tác Lấy số**: Đối với các văn bản đi kèm cho phép lấy số trước (như Công văn chuyển nội bộ), hiển thị nút **Lấy số** để cấp số và ngày tạm thời.
- **Panel phải (Giao diện xem trước biểu mẫu văn bản)**:
  - Hiển thị trực quan nội dung văn bản sẽ được xuất bản dựa trên biểu mẫu tương ứng với loại văn bản đang chọn ở panel trái.
  - Các biểu mẫu hỗ trợ hiển thị gồm:
    - **Công văn chuyển nội bộ**: Dựng thông tin số công văn, ngày tháng, nội dung chuyển đơn vụ chuyên môn và bảng danh sách đơn chuyển đính kèm.
    - **Giấy xác nhận cơ quan chuyển đơn**: Hiển thị thông báo gửi cơ quan chuyển đơn về việc đã chuyển tiếp đơn đến đơn vị giải quyết.
    - **Giấy xác nhận**: Biên nhận tiếp nhận đơn gửi đương sự.
    - **Thông báo yêu cầu sửa đổi, bổ sung (gửi đương sự)**: Liệt kê các tài liệu, thông tin cần bổ sung trong thời hạn 30 ngày.
    - **Hướng dẫn sửa đổi, bổ sung đơn thư (gửi trại giam)**: Văn bản hướng dẫn ban quản lý trại giam hỗ trợ phạm nhân bổ sung tài liệu bản án.
    - **Danh sách thụ lý mới**: Bảng danh sách tổng hợp các đơn thụ lý mới chuyển vụ chuyên môn (gồm thông tin số thụ lý, đương sự, bản án, thẩm phán).
    - **Tờ trình phân công thẩm phán**: Tờ trình gửi Chánh án đề xuất phân công thẩm phán giải quyết. Cho phép nhấn nút **Sửa** trực tiếp trên biểu mẫu để sửa đổi văn bản tờ trình hoặc danh sách thẩm phán dự kiến.

##### C. Xác nhận Trình duyệt
Khi người dùng hoàn tất cấu hình và nhấn nút **Trình duyệt**, hệ thống xử lý lưu thông tin và hiển thị popup thành công `PopupTrinhDuyetXong`:
- **Nội dung hiển thị**: Xác nhận gửi hồ sơ trình duyệt thành công, hiển thị tên người duyệt, loại văn bản, số lượng văn bản đã tạo, số lượng văn bản đã cấp số trực tiếp và mức độ ưu tiên.
- **Nút hành động**:
  - **Xem văn bản đã trình**: Chuyển hướng người dùng sang màn hình Danh sách văn bản trình ký để theo dõi tiếp.
  - **Đóng**: Tắt popup và quay lại màn hình danh sách đơn.

#### 6.2. Popup In danh sách đơn (PopupInDanhSachDon)
Kích hoạt khi người dùng nhấn nút **In danh sách (N đơn)** trên thanh công cụ.

##### A. Logic lấy dữ liệu in
- Nếu người dùng có tick chọn các dòng trên bảng dữ liệu: Chỉ thực hiện in các dòng được tick.
- Nếu không tick chọn dòng nào: Hệ thống lấy toàn bộ các đơn đang hiển thị theo bộ lọc và tab hiện tại để thực hiện in.

##### B. Nội dung hiển thị trên trang xem trước in
- Tiêu đề cơ quan ban hành: TÒA ÁN NHÂN DÂN TỐI CAO.
- Tiêu đề báo cáo: DANH SÁCH ĐƠN.
- Ngày in báo cáo (định dạng dd/mm/yyyy).
- Mô tả điều kiện lọc đang áp dụng (Ví dụ: Người gửi: Lê Thị Mai, Tab: Chưa đủ điều kiện).
- Tổng số lượng đơn trong danh sách in.
- Bảng dữ liệu in gồm 12 cột thông tin: STT, Mã đơn, Người gửi/đơn vị gửi (kèm địa chỉ hiển thị ngay phía dưới tên người gửi trong cùng một ô), Hình thức đơn, Số BA/QĐ, Ngày BA/QĐ, Tòa xét xử, Hình thức tiếp nhận, Thẩm phán (chỉ hiển thị họ tên thẩm phán), Trạng thái giải quyết, Người nhập, Ngày nhập.
- Khối ký xác nhận ở chân trang gồm địa danh, ngày tháng năm in, tiêu đề người lập danh sách.

##### C. Cấu hình định dạng in
- Định dạng trang giấy in: A4 chiều ngang (A4 Landscape), căn lề 12mm.
- Khi người dùng thực hiện thao tác in, hệ thống ẩn toàn bộ các thành phần giao diện xung quanh màn hình và chỉ hiển thị vùng nội dung danh sách in.

---

### 7. Liên kết chéo các tài liệu nghiệp vụ chi tiết
Đối với các thao tác nghiệp vụ khác xuất phát từ màn hình Danh sách đơn đã được đặc tả chi tiết tại các tài liệu nghiệp vụ riêng biệt, hệ thống áp dụng các quy trình và quy tắc nghiệp vụ theo các tài liệu dẫn chiếu dưới đây:

- **Thao tác Thêm mới đơn** (Nút "+ Thêm mới" trên thanh công cụ): Thực hiện theo tài liệu đặc tả [SRS_ThemMoiDon.md](file:///c:/Users/Gtel-Ict/Downloads/SRS_ThemMoiDon.md).
- **Thao tác Ghép đơn** (Chọn nhiều đơn từ danh sách đơn và nhấn nút "Ghép đơn"): Thực hiện theo quy trình tại mục *UC01: Ghép đơn (Gom nhóm đơn)* của tài liệu [Ghép đơn Chuyển đơn.md](file:///c:/Users/Gtel-Ict/Downloads/Gh%C3%A9p%20%C4%91%C6%A1n%20Chuy%E1%BB%83n%20%C4%91%C6%A1n.md).
- **Thao tác Chuyển đơn** (Chọn đơn và nhấn nút "Chuyển đơn" tại Action Menu): Thực hiện theo quy trình tại mục *UC02: Chuyển đơn giữa các cán bộ* của tài liệu [Ghép đơn Chuyển đơn.md](file:///c:/Users/Gtel-Ict/Downloads/Gh%C3%A9p%20%C4%91%C6%A1n%20Chuy%E1%BB%83n%20%C4%91%C6%A1n.md).
- **Thao tác Bổ sung tài liệu** (Chọn đơn và nhấn nút "Bổ sung tài liệu" tại Action Menu hoặc nút "Trả lại" / "Bổ sung" trên thanh công cụ): Thực hiện theo quy trình upload tài liệu và cập nhật tình trạng tại mục *UC03: Bổ sung tài liệu* của tài liệu [Ghép đơn Chuyển đơn.md](file:///c:/Users/Gtel-Ict/Downloads/Gh%C3%A9p%20%C4%91%C6%A1n%20Chuy%E1%BB%83n%20%C4%91%C6%A1n.md).
- **Thao tác Hủy số thụ lý** (Chọn đơn ở trạng thái Thụ lý mới và nhấn "Hủy số thụ lý" tại Action Menu): Thực hiện theo quy trình tại mục *UC01: Hủy số thụ lý* của tài liệu [SRS_HuySoThuLy_ThemKetQua.md](file:///c:/Users/Gtel-Ict/Downloads/SRS_HuySoThuLy_ThemKetQua.md).
- **Thao tác Thêm kết quả giải quyết** (Chọn đơn không ở trạng thái Thụ lý mới và nhấn "Thêm kết quả giải quyết" tại Action Menu): Thực hiện theo quy trình tại mục *UC02: Thêm kết quả giải quyết* của tài liệu [SRS_HuySoThuLy_ThemKetQua.md](file:///c:/Users/Gtel-Ict/Downloads/SRS_HuySoThuLy_ThemKetQua.md).
