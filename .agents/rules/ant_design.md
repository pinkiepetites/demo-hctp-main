---
name: "Sử dụng Ant Design"
description: "Luật bắt buộc sử dụng thư viện Ant Design (antd) khi thiết kế, xây dựng và chỉnh sửa giao diện UI trong dự án."
---

# UI/UX Generation Rule: Ant Design

- **Bắt buộc sử dụng Ant Design:** Từ nay về sau, khi tạo mới hoặc cập nhật các màn hình, component giao diện (UI), phải ưu tiên tuyệt đối sử dụng các component của hệ sinh thái `antd` (như `Table`, `Tabs`, `Button`, `Select`, `Input`, `Row`, `Col`, `Card`, `Typography`, v.v.).
- **Không tự code lại UI:** Tránh việc tự viết lại các cấu trúc HTML/CSS cơ bản (như dropdown, modal, tab, table) nếu Ant Design đã hỗ trợ sẵn.
- **Tích hợp màu hệ thống:** Khi sử dụng Ant Design, cần kết hợp khéo léo với bộ màu hệ thống của dự án (ví dụ biến `RED` hoặc các hằng số màu trong file `shared.tsx`) thông qua thuộc tính `style`, `styles`, hoặc cấu hình Theme của `ConfigProvider`.
- **Import đầy đủ:** Luôn kiểm tra kỹ các thẻ JSX (như `<Title>`, `<Text>`) và đảm bảo đã import đầy đủ từ thư viện `antd` (hoặc destructure từ component cha, ví dụ: `const { Title, Text } = Typography`) để tránh lỗi Reference Error tại thời điểm runtime.
