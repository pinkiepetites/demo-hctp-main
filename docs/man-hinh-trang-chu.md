# Màn hình: Trang chủ (Dashboard)

> Đường dẫn `Trang chủ` (`view === "home"`)
> Mã màn hình: **MH-10**
> Nguồn: `app/Dashboard.tsx` (996 dòng) · mount tại `app/App.tsx:13156-13161`

> File trùng tên `ui-hctp-demo-main/app/Dashboard.tsx` là bản cũ, không còn được dùng (dừng ở commit `e94329a`, chưa có dữ liệu thật, chưa có logic role) — bỏ qua khi đối chiếu.

---

## 1. Vai trò (role) trong hệ thống

Định nghĩa tại `App.tsx:1711-1719`:

```ts
NHAN_VAI_TRO = {
  "can-bo": "Cán bộ",
  "truong-phong": "Trưởng phòng",
  "pho-vp": "Phó / Chánh Văn phòng",
  "lanh-dao": "Lãnh đạo Tòa",
  "chanh-an": "Chánh án / Phó Chánh án",
}
DS_VAI_TRO = ["can-bo", "truong-phong", "pho-vp", "lanh-dao", "chanh-an"]
```

- `currentRole` là state của `App` (`App.tsx:12467`), đổi qua widget "Chuyển vai trò" trong `KhoiTaiKhoan`.
- Ứng với mỗi role có một "người dùng đại diện", suy ra qua `nguoiTheoVaiTro(role)` (`app/components/QuanLyVanBan.tsx:131-141`):

| Role | Người | Chức vụ |
|---|---|---|
| `truong-phong` | Nguyễn Văn Hùng | Trưởng phòng |
| `pho-vp` | Đỗ Thu Trang | Phó Chánh văn phòng |
| `lanh-dao` | Nguyễn Thị Bình | Vụ trưởng |
| `chanh-an` | Nguyễn Hòa Bình | Phó Chánh án |
| `can-bo` / mặc định | Vũ Văn Yên | Cán bộ |

> `van-thu` (Phạm Thị Lan) có định nghĩa trong `nguoiTheoVaiTro` nhưng **không** nằm trong `DS_VAI_TRO`/bộ chuyển vai trò — không xuất hiện trong Dashboard trên thực tế.

---

## 2. Nhánh logic cốt lõi

Toàn bộ Dashboard chỉ rẽ theo **một boolean duy nhất** — không có `switch(role)` chi tiết cho từng role quản lý:

```ts
// Dashboard.tsx:107-116
const laVaiTroQuanLy = currentRole !== "can-bo";
const hienThiTheDuyet = laVaiTroQuanLy;
const { nguoi: nguoiDung } = nguoiTheoVaiTro(currentRole);

const taiLieuChoDuyet = vanBanList.filter(v => dangChoXuLy(v.trangThai)); // ChoDuyet | ChoKy | ChoButPhe
const soTaiLieuCanDuyet = taiLieuChoDuyet.filter(v => nguoiDangGiu(v)?.nguoi === nguoiDung).length;
const soTaiLieuDangChoDuyet = taiLieuChoDuyet.length;
```

→ Chỉ 2 chế độ hiển thị thực sự: **Cán bộ** (`can-bo`) và **Quản lý** (4 role còn lại, gộp chung — cùng bố cục, cùng số liệu, chỉ khác "người đang giữ tài liệu" khi tính KPI Duyệt tài liệu).

---

## 3. Role "Cán bộ" (`can-bo`)

| Khối | Nguồn dữ liệu / logic | File:dòng |
|---|---|---|
| **Cảnh báo cần xử lý** — "Đơn quá hạn giải quyết" | Mảng cứng `donQuaHan`, 10 bản ghi mock (mã đơn, cán bộ, trạng thái, số năm quá hạn). Comment ghi rõ là số liệu ảo, đối chiếu thủ công với các dòng có cờ `quaHanNam` trong `SAMPLE_ROWS` (Danh sách đơn) | `Dashboard.tsx:287-301, 369-454` |
| **Cảnh báo cần xử lý** — "Văn bản tôi đã trả lại, chưa thấy sửa" | **Dữ liệu thật**: `vanBanList.filter(v => v.trangThai === "BiTraLai")`. Số ngày chờ sửa tính từ mốc `TraLai` gần nhất trong `lichSu` | `Dashboard.tsx:345-360` |
| **Hiện trạng đơn** (toggle "Của tôi" / "Toàn phòng") | Hằng số `HIEN_TRANG_DON` (mock) | `Dashboard.tsx:307-339, 546-675` |
| ↳ 3 KPI: Tổng số đơn / Đã giải quyết xong / Chưa giải quyết | Tính % và bar tỉ lệ từ `hienTrang` | `Dashboard.tsx:584-650` |
| ↳ Lưới 6 trạng thái thụ lý (Thụ lý mới, Đã thụ lý, Chưa đủ điều kiện, Chờ ý kiến LĐ, Trả lại đơn, Không thụ lý) | Bấm vào ô gọi `onXemDanhSachDon(tab)` → điều hướng sang Danh sách đơn đúng tab | `Dashboard.tsx:656-673` |
| **Không hiện**: card "Duyệt tài liệu" | `hienThiTheDuyet = false` | `Dashboard.tsx:679` |
| **Không hiện**: panel "Hình thức tiếp nhận đơn" + "Hồ sơ cần chú ý khác" | chỉ hiện khi `laVaiTroQuanLy` | `Dashboard.tsx:877` |
| **Không hiện**: ROW 3 (Cơ cấu loại hình án + Hiệu suất cán bộ) | bọc trong `{laVaiTroQuanLy && (...)}` | `Dashboard.tsx:911-993` |

---

## 4. 4 role quản lý — `truong-phong` · `pho-vp` · `lanh-dao` · `chanh-an` (dùng chung logic)

| Khối | Nguồn dữ liệu / logic | File:dòng |
|---|---|---|
| **Thống kê đơn nhận {kỳ}** (4 KPI: Tổng + Hình sự + Dân sự + Chưa xác định) | Hằng `DON_NHAN_LOAI_AN_TUAN` (14/10/3, số liệu "tuần này") × hệ số nhân theo kỳ đang chọn (`soSanhMult`) | `Dashboard.tsx:184-195, 517-544` |
| **Duyệt tài liệu** (2 card: "Cần duyệt" / "Đang chờ duyệt", có nút "Xem chi tiết") | **Dữ liệu thật** từ `vanBanList`. "Cần duyệt" = văn bản đang ở trạng thái chờ (`ChoDuyet`/`ChoKy`/`ChoButPhe`) **và** người đang giữ (`nguoiDangGiu(v).nguoi`) khớp người ứng với `currentRole` hiện tại. "Đang chờ duyệt" = tổng toàn bộ văn bản đang ở trạng thái chờ, bất kể ai giữ | `Dashboard.tsx:114-116, 679-706` |
| **Hình thức tiếp nhận đơn** | Hằng cứng: Trực tiếp 12 / Bưu điện 9 / Trực tuyến 6 (tổng = 27 = tổng đơn nhận tuần) | `Dashboard.tsx:269-282, 876-907` |
| **Hồ sơ cần chú ý khác** | Hằng cứng: Hồ sơ kháng nghị đang xử lý 3 · Chờ ý kiến lãnh đạo 2 · YCBS chưa phản hồi 4 | `Dashboard.tsx:269-282, 876-907` |
| **ROW 3 — Cơ cấu loại hình án** (% theo loại án) | Hằng cứng `caseTypes`: Dân sự 45% · Hình sự 30% · Hành chính 15% · KD-TM 10% | `Dashboard.tsx:251-256, 912-937` |
| **ROW 3 — Hiệu suất cán bộ {kỳ}** (danh sách + thanh tiến độ) | `getOfficerData()` — 5 thẩm phán mock (An/Bình/Tuấn/Yến/Cường), `total/inProgress/completed` nhân theo hệ số kỳ; có filter theo cán bộ (`filterOfficer`) | `Dashboard.tsx:231-248, 940-991` |
| **Không hiện**: "Cảnh báo cần xử lý" | `!laVaiTroQuanLy` = false | `Dashboard.tsx:369` |

> Trong nhóm 4 role này, giao diện/số liệu **giống hệt nhau**. Khác biệt duy nhất là KPI "Cần duyệt" tính theo người-giữ-tài-liệu ứng với từng role (qua `nguoiTheoVaiTro`).

---

## 5. Khối chung cho mọi role

| Khối | Nguồn dữ liệu / logic | File:dòng |
|---|---|---|
| Thanh filter kỳ (Hôm nay / Tuần này / Tháng này / Năm nay / Tùy chọn) + lọc theo cán bộ | State `chartPeriod` → hệ số nhân `soSanhMult`/`mult` dùng cho phần lớn số liệu mock trong trang (day ×0.1, week ×1, month ×4, year ×40, custom ×0.5) | `Dashboard.tsx:118-131, 456-510` |
| Biểu đồ cột "So sánh số đơn theo loại án & kết quả" (nhóm cột, 8 loại án × 6 kết quả) | Ma trận cứng `LOAI_AN_KET_QUA_TUAN` (số liệu tuần này) × hệ số kỳ | `Dashboard.tsx:146-181, 712-779` |
| Panel "Kết quả xử lý đơn" (stacked bar ngang theo Vụ GĐKT) | Tính lại từ `loaiAnKetQua` ở trên, ánh xạ Loại án → Vụ qua `VU_THEO_LOAI_AN`, gộp theo `VU_LIST` (4 Vụ GĐKT) | `Dashboard.tsx:196-229, 784-821` |
| "Văn bản trình ký" (thanh trạng thái + danh sách "Gần đây") | **Dữ liệu thật**: đếm `vanBanList` theo 7 trạng thái (`VB_STATUS_ORDER`), màu theo `VB_STATUS_COLOR`/`TRANG_THAI_META`; "Gần đây" = `vanBanList.slice(0, 5)`, hiển thị người đang giữ qua `nguoiDangGiu(vb)` | `Dashboard.tsx:258-265, 824-874` |

---

## 6. Nguồn dữ liệu

Đây là mockup frontend thuần — **không có API/backend thật** (đã kiểm tra: không có `fetch`/`axios`/`/api/` trong `App.tsx`, `Dashboard.tsx`, `QuanLyVanBan.tsx`, `HieuSuatCanBoChiTiet.tsx`). Có 2 nguồn:

1. **`vanBanList: VanBanTrinh[]`** — state thật của app (`App.tsx:12422`, khởi tạo từ `DU_LIEU_MAU` tại `app/components/QuanLyVanBan.tsx:450`). Dùng thật cho: KPI "Duyệt tài liệu", panel "Văn bản tôi đã trả lại chưa thấy sửa", panel "Văn bản trình ký".
   - `VanBanTrinh` (`QuanLyVanBan.tsx:85-103`): `id, trichYeu, loaiVanBan, donViSoanThao, soVanBan, trangThai, nguoiTao, luongKy, buocHienTai, vongTrinh, phienBanHienTai, phienBan, lichSu, donDinhKem`
   - `TrangThaiVB` = `Nhap | ChoDuyet | ChoKy | ChoButPhe | BiTraLai | DaBanHanh | DaHuy` (`QuanLyVanBan.tsx:35-36`)
2. **Hằng số cứng trong `Dashboard.tsx`** — dùng cho mọi số liệu liên quan tới **Đơn**: Thống kê đơn nhận theo kỳ, Hiện trạng đơn, So sánh loại án & kết quả, Kết quả xử lý theo Vụ, Hình thức tiếp nhận đơn, Hồ sơ cần chú ý khác, Đơn quá hạn giải quyết, Cơ cấu loại hình án, Hiệu suất cán bộ. Các số liệu này đã được đối chiếu thủ công với `SAMPLE_ROWS` của module Danh sách đơn (phần việc của commit "Update dashboard, ds đơn") nhưng **chưa đọc trực tiếp** từ state Danh sách đơn thật — khác với `vanBanList` đã nối thật.

---

## 7. Điều hướng từ Dashboard

Không phụ thuộc riêng theo role (trừ 2 dòng cuối có truyền `currentRole` để màn đích tự xử lý theo role):

| Callback | Đích | File:dòng |
|---|---|---|
| `onXemDanhSachDon(tab)` | Danh sách đơn, tab tương ứng | `App.tsx:13158` |
| `onXemDonQuaHan()` | Danh sách đơn, tab 0 + `initialQuaHanOnly=true` | `App.tsx:13159` |
| `onXemDanhSachVanBan(tab?)` | Màn `VanBanTrinhKyCuaToi` | `App.tsx:13160, 13180-13184` |
| `onXemPheDuyet` | Màn `PheDuyetDeXuat` (nhận `currentRole`) | `App.tsx:13173-13175` |
| `onXemChiTietHieuSuat` | Màn `HieuSuatCanBoChiTiet` (nhận `currentRole`) | `App.tsx:13166-13169` |

> Quyền phê duyệt ở `Sidebar` (menu, ngoài Dashboard) dùng cùng nhóm 4 role quản lý: `coQuyenPheDuyet = currentRole === "truong-phong" || "pho-vp" || "lanh-dao" || "chanh-an"` (`App.tsx:1826-1827`) — khớp với `laVaiTroQuanLy` trong Dashboard.

---

## 8. Vấn đề đã biết

| # | Nội dung | Mức độ |
|---|---|---|
| 1 | Phần lớn số liệu về **Đơn** trên Dashboard là mock, chưa nối vào dữ liệu thật của module Danh sách đơn (`SAMPLE_ROWS`/state thật) — chỉ đối chiếu thủ công một lần | Trung bình |
| 2 | 4 role quản lý dùng chung một layout/số liệu — nếu nghiệp vụ thật cần phân biệt góc nhìn riêng cho từng role (VD: Chánh án thấy phạm vi toàn Tòa, Trưởng phòng chỉ thấy phạm vi phòng) thì logic hiện tại chưa đáp ứng | Trung bình |

---

## 9. Tham chiếu mã nguồn

| Thành phần | Vị trí |
|---|---|
| Component chính | `app/Dashboard.tsx` |
| Mount điểm vào | `app/App.tsx:13156-13161` (`view === "home"`) |
| Định nghĩa role | `NHAN_VAI_TRO`, `DS_VAI_TRO` — `App.tsx:1711-1719` |
| Người đại diện theo role | `nguoiTheoVaiTro()` — `app/components/QuanLyVanBan.tsx:131-141` |
| Boolean rẽ nhánh chính | `laVaiTroQuanLy` — `Dashboard.tsx:107` |
| Dữ liệu văn bản thật | `vanBanList` (state `App.tsx:12422`), kiểu `VanBanTrinh` (`QuanLyVanBan.tsx:85-103`) |
| Dữ liệu đơn (mock) | `donQuaHan`, `HIEN_TRANG_DON`, `DON_NHAN_LOAI_AN_TUAN`, `LOAI_AN_KET_QUA_TUAN`, `caseTypes`, `getOfficerData()` — trong `Dashboard.tsx` |
