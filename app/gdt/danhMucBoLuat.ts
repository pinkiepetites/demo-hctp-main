// Danh mục Bộ luật và Tội danh chuẩn hóa phục vụ quản lý và rà soát chuyển đổi hình phạt
// TANDTC - Vụ Giám đốc kiểm tra

export interface KhoanItem {
  khoan: string;
  soKhoan: number;
  khungHinhPhat: string;
  mucDo: "tu-hinh" | "chung-than" | "co-thoi-han";
  noiDungTomTat?: string;
  diemList?: { diem: string; noiDung: string }[];
}

export interface DieuLuatItem {
  id: string;
  maDieu: string;
  soDieu: number;
  tenToiDanh: string;
  tenDayDu: string;
  chuong: string;
  tenChuong: string;
  boLuat: string;
  boLuatFull: string;
  coAnTuHinh: boolean;
  coAnChungThan: boolean;
  danhSachKhoan: KhoanItem[];
}

export interface BoLuatOption {
  id: string;
  code: string;
  name: string;
  shortName: string;
  namBanHanh: number;
  hieuLuc: string;
}

export const DANH_MUC_BO_LUAT: BoLuatOption[] = [
  {
    id: "blhs-2015",
    code: "BLHS 2015",
    name: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    shortName: "BLHS 2015",
    namBanHanh: 2015,
    hieuLuc: "Đang có hiệu lực",
  },
  {
    id: "blhs-1999",
    code: "BLHS 1999",
    name: "Bộ luật Hình sự 1999 (sửa đổi, bổ sung 2009)",
    shortName: "BLHS 1999",
    namBanHanh: 1999,
    hieuLuc: "Hết hiệu lực (Áp dụng theo nguyên tắc có lợi)",
  },
  {
    id: "blhs-1985",
    code: "BLHS 1985",
    name: "Bộ luật Hình sự 1985",
    shortName: "BLHS 1985",
    namBanHanh: 1985,
    hieuLuc: "Hết hiệu lực",
  },
  {
    id: "nq-01-2016",
    code: "NQ 01/2016/NQ-HĐTP",
    name: "Nghị quyết 01/2016/NQ-HĐTP hướng dẫn áp dụng BLHS",
    shortName: "NQ 01/2016",
    namBanHanh: 2016,
    hieuLuc: "Đang có hiệu lực",
  },
];

export const DANH_MUC_CHUONG = [
  { id: "all", name: "Tất cả các chương / nhóm tội" },
  { id: "chuong-14", name: "Chương XIV: Tội xâm phạm tính mạng, sức khỏe, nhân phẩm, danh dự" },
  { id: "chuong-16", name: "Chương XVI: Tội xâm phạm sở hữu" },
  { id: "chuong-18", name: "Chương XVIII: Tội phạm về kinh tế" },
  { id: "chuong-20", name: "Chương XX: Tội phạm về ma túy" },
  { id: "chuong-21", name: "Chương XXI: Tội xâm phạm an toàn công cộng, trật tự công cộng" },
  { id: "chuong-23", name: "Chương XXIII: Tội phạm về chức vụ, tham nhũng" },
  { id: "chuong-13", name: "Chương XIII: Tội xâm phạm an ninh quốc gia" },
  { id: "chuong-chung", name: "Phần chung: Quy định chung về hình phạt & chấp hành án" },
];

export const DANH_MUC_DIEU_LUAT: DieuLuatItem[] = [
  // ── Chương XXIII: Chức vụ, tham nhũng ─────────────────────────────────────────
  {
    id: "dieu-353",
    maDieu: "Điều 353",
    soDieu: 353,
    tenToiDanh: "Tham ô tài sản",
    tenDayDu: "Tội tham ô tài sản",
    chuong: "chuong-23",
    tenChuong: "Chương XXIII: Tội phạm về chức vụ, tham nhũng",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      {
        khoan: "Khoản 1",
        soKhoan: 1,
        khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Chiếm đoạt từ 2.000.000đ đến dưới 100.000.000đ",
      },
      {
        khoan: "Khoản 2",
        soKhoan: 2,
        khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Có tổ chức, thủ đoạn xảo quyệt, chiếm đoạt từ 100.000.000đ đến dưới 500.000.000đ",
      },
      {
        khoan: "Khoản 3",
        soKhoan: 3,
        khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Chiếm đoạt tài sản từ 500.000.000đ đến dưới 1.000.000.000đ",
      },
      {
        khoan: "Khoản 4",
        soKhoan: 4,
        khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
        noiDungTomTat: "Chiếm đoạt tài sản từ 1.000.000.000đ trở lên hoặc gây thiệt hại đặc biệt nghiêm trọng",
      },
    ],
  },
  {
    id: "dieu-354",
    maDieu: "Điều 354",
    soDieu: 354,
    tenToiDanh: "Nhận hối lộ",
    tenDayDu: "Tội nhận hối lộ",
    chuong: "chuong-23",
    tenChuong: "Chương XXIII: Tội phạm về chức vụ, tham nhũng",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      {
        khoan: "Khoản 1",
        soKhoan: 1,
        khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Của hối lộ từ 2.000.000đ đến dưới 100.000.000đ",
      },
      {
        khoan: "Khoản 2",
        soKhoan: 2,
        khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Của hối lộ từ 100.000.000đ đến dưới 500.000.000đ",
      },
      {
        khoan: "Khoản 3",
        soKhoan: 3,
        khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Của hối lộ từ 500.000.000đ đến dưới 1.000.000.000đ",
      },
      {
        khoan: "Khoản 4",
        soKhoan: 4,
        khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
        noiDungTomTat: "Của hối lộ từ 1.000.000.000đ trở lên hoặc gây thiệt hại từ 5.000.000.000đ trở lên",
      },
    ],
  },
  {
    id: "dieu-355",
    maDieu: "Điều 355",
    soDieu: 355,
    tenToiDanh: "Lạm dụng chức vụ, quyền hạn chiếm đoạt tài sản",
    tenDayDu: "Tội lạm dụng chức vụ, quyền hạn chiếm đoạt tài sản",
    chuong: "chuong-23",
    tenChuong: "Chương XXIII: Tội phạm về chức vụ, tham nhũng",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 01 năm đến 06 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 06 năm đến 13 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 13 năm đến 20 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù 20 năm hoặc tù chung thân", mucDo: "chung-than" },
    ],
  },
  {
    id: "dieu-356",
    maDieu: "Điều 356",
    soDieu: 356,
    tenToiDanh: "Lợi dụng chức vụ, quyền hạn trong khi thi hành công vụ",
    tenDayDu: "Tội lợi dụng chức vụ, quyền hạn trong khi thi hành công vụ",
    chuong: "chuong-23",
    tenChuong: "Chương XXIII: Tội phạm về chức vụ, tham nhũng",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: false,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 01 - 05 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 05 năm đến 10 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 10 năm đến 15 năm", mucDo: "co-thoi-han" },
    ],
  },

  // ── Chương XX: Tội phạm về ma túy ────────────────────────────────────────────
  {
    id: "dieu-251",
    maDieu: "Điều 251",
    soDieu: 251,
    tenToiDanh: "Mua bán trái phép chất ma túy",
    tenDayDu: "Tội mua bán trái phép chất ma túy",
    chuong: "chuong-20",
    tenChuong: "Chương XX: Tội phạm về ma túy",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm", mucDo: "co-thoi-han" },
      {
        khoan: "Khoản 4",
        soKhoan: 4,
        khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
        noiDungTomTat: "Heroine, Cocaine >= 100g; Methamphetamine, Amphetamine >= 300g",
      },
    ],
  },
  {
    id: "dieu-250",
    maDieu: "Điều 250",
    soDieu: 250,
    tenToiDanh: "Vận chuyển trái phép chất ma túy",
    tenDayDu: "Tội vận chuyển trái phép chất ma túy",
    chuong: "chuong-20",
    tenChuong: "Chương XX: Tội phạm về ma túy",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm", mucDo: "co-thoi-han" },
      {
        khoan: "Khoản 4",
        soKhoan: 4,
        khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
        noiDungTomTat: "Heroine, Cocaine >= 100g; Các chất ma túy khác thể rắn >= 300g",
      },
    ],
  },
  {
    id: "dieu-248",
    maDieu: "Điều 248",
    soDieu: 248,
    tenToiDanh: "Sản xuất trái phép chất ma túy",
    tenDayDu: "Tội sản xuất trái phép chất ma túy",
    chuong: "chuong-20",
    tenChuong: "Chương XX: Tội phạm về ma túy",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm", mucDo: "co-thoi-han" },
      {
        khoan: "Khoản 4",
        soKhoan: 4,
        khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
      },
    ],
  },
  {
    id: "dieu-249",
    maDieu: "Điều 249",
    soDieu: 249,
    tenToiDanh: "Tàng trữ trái phép chất ma túy",
    tenDayDu: "Tội tàng trữ trái phép chất ma túy",
    chuong: "chuong-20",
    tenChuong: "Chương XX: Tội phạm về ma túy",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 01 năm đến 05 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 05 năm đến 10 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 10 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 15 năm đến 20 năm hoặc tù chung thân", mucDo: "chung-than" },
    ],
  },

  // ── Chương XIV: Xâm phạm tính mạng, sức khỏe ─────────────────────────────────
  {
    id: "dieu-123",
    maDieu: "Điều 123",
    soDieu: 123,
    tenToiDanh: "Giết người",
    tenDayDu: "Tội giết người",
    chuong: "chuong-14",
    tenChuong: "Chương XIV: Tội xâm phạm tính mạng, sức khỏe, nhân phẩm, danh dự",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      {
        khoan: "Khoản 1",
        soKhoan: 1,
        khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình",
        mucDo: "tu-hinh",
        noiDungTomTat: "Giết 02 người trở lên; Giết người dưới 16 tuổi; Để thực hiện tội phạm khác; Có tính chất côn đồ...",
      },
      {
        khoan: "Khoản 2",
        soKhoan: 2,
        khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm",
        mucDo: "co-thoi-han",
        noiDungTomTat: "Phạm tội không thuộc các trường hợp quy định tại Khoản 1",
      },
    ],
  },
  {
    id: "dieu-134",
    maDieu: "Điều 134",
    soDieu: 134,
    tenToiDanh: "Cố ý gây thương tích",
    tenDayDu: "Tội cố ý gây thương tích hoặc gây tổn hại cho sức khỏe của người khác",
    chuong: "chuong-14",
    tenChuong: "Chương XIV: Tội xâm phạm tính mạng, sức khỏe, nhân phẩm, danh dự",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng - 03 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 02 năm đến 06 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 05 năm đến 10 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 07 năm đến 14 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 5", soKhoan: 5, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm hoặc tù chung thân", mucDo: "chung-than" },
    ],
  },

  // ── Chương XVI: Xâm phạm sở hữu ──────────────────────────────────────────────
  {
    id: "dieu-168",
    maDieu: "Điều 168",
    soDieu: 168,
    tenToiDanh: "Cướp tài sản",
    tenDayDu: "Tội cướp tài sản",
    chuong: "chuong-16",
    tenChuong: "Chương XVI: Tội xâm phạm sở hữu",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 03 năm đến 10 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 18 năm đến 20 năm hoặc tù chung thân", mucDo: "chung-than" },
    ],
  },
  {
    id: "dieu-173",
    maDieu: "Điều 173",
    soDieu: 173,
    tenToiDanh: "Trộm cắp tài sản",
    tenDayDu: "Tội trộm cắp tài sản",
    chuong: "chuong-16",
    tenChuong: "Chương XVI: Tội xâm phạm sở hữu",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: false,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng - 03 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm", mucDo: "co-thoi-han" },
    ],
  },
  {
    id: "dieu-174",
    maDieu: "Điều 174",
    soDieu: 174,
    tenToiDanh: "Lừa đảo chiếm đoạt tài sản",
    tenDayDu: "Tội lừa đảo chiếm đoạt tài sản",
    chuong: "chuong-16",
    tenChuong: "Chương XVI: Tội xâm phạm sở hữu",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng - 03 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 02 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm hoặc tù chung thân", mucDo: "chung-than" },
    ],
  },

  // ── Chương XIII: An ninh quốc gia ────────────────────────────────────────────
  {
    id: "dieu-109",
    maDieu: "Điều 109",
    soDieu: 109,
    tenToiDanh: "Hoạt động nhằm lật đổ chính quyền nhân dân",
    tenDayDu: "Tội hoạt động nhằm lật đổ chính quyền nhân dân",
    chuong: "chuong-13",
    tenChuong: "Chương XIII: Tội xâm phạm an ninh quốc gia",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình", mucDo: "tu-hinh" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 05 năm đến 12 năm", mucDo: "co-thoi-han" },
    ],
  },
  {
    id: "dieu-110",
    maDieu: "Điều 110",
    soDieu: 110,
    tenToiDanh: "Gián điệp",
    tenDayDu: "Tội gián điệp",
    chuong: "chuong-13",
    tenChuong: "Chương XIII: Tội xâm phạm an ninh quốc gia",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình", mucDo: "tu-hinh" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 05 năm đến 15 năm", mucDo: "co-thoi-han" },
    ],
  },
  {
    id: "dieu-112",
    maDieu: "Điều 112",
    soDieu: 112,
    tenToiDanh: "Bạo loạn",
    tenDayDu: "Tội bạo loạn",
    chuong: "chuong-13",
    tenChuong: "Chương XIII: Tội xâm phạm an ninh quốc gia",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình", mucDo: "tu-hinh" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 05 năm đến 15 năm", mucDo: "co-thoi-han" },
    ],
  },
  {
    id: "dieu-113",
    maDieu: "Điều 113",
    soDieu: 113,
    tenToiDanh: "Khủng bố nhằm chống chính quyền nhân dân",
    tenDayDu: "Tội khủng bố nhằm chống chính quyền nhân dân",
    chuong: "chuong-13",
    tenChuong: "Chương XIII: Tội xâm phạm an ninh quốc gia",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: true,
    coAnChungThan: true,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình", mucDo: "tu-hinh" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 10 năm đến 15 năm", mucDo: "co-thoi-han" },
    ],
  },

  // ── Chương XVIII: Kinh tế ────────────────────────────────────────────────────
  {
    id: "dieu-188",
    maDieu: "Điều 188",
    soDieu: 188,
    tenToiDanh: "Buôn lậu",
    tenDayDu: "Tội buôn lậu",
    chuong: "chuong-18",
    tenChuong: "Chương XVIII: Tội phạm về kinh tế",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: false,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Phạt tiền từ 50tr - 300tr hoặc phạt tù từ 06 tháng - 03 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Phạt tù từ 03 năm đến 07 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 3", soKhoan: 3, khungHinhPhat: "Phạt tù từ 07 năm đến 15 năm", mucDo: "co-thoi-han" },
      { khoan: "Khoản 4", soKhoan: 4, khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm", mucDo: "co-thoi-han" },
    ],
  },

  // ── Phần chung: Các điều luật nền tảng chuyển đổi hình phạt ──────────────────
  {
    id: "dieu-40",
    maDieu: "Điều 40",
    soDieu: 40,
    tenToiDanh: "Tử hình & Không áp dụng, không thi hành án tử hình",
    tenDayDu: "Điều 40: Hình phạt tử hình và các trường hợp không thi hành",
    chuong: "chuong-chung",
    tenChuong: "Phần chung: Quy định chung về hình phạt & chấp hành án",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: true,
    danhSachKhoan: [
      {
        khoan: "Khoản 2",
        soKhoan: 2,
        khungHinhPhat: "Không áp dụng tử hình đối với người dưới 18 tuổi, phụ nữ có thai hoặc nuôi con nhỏ < 36 tháng, người đủ 75 tuổi trở lên",
        mucDo: "chung-than",
      },
      {
        khoan: "Khoản 3 Điểm a",
        soKhoan: 3,
        khungHinhPhat: "Chuyển thành tù chung thân: Phụ nữ có thai hoặc nuôi con dưới 36 tháng tuổi",
        mucDo: "chung-than",
      },
      {
        khoan: "Khoản 3 Điểm b",
        soKhoan: 3,
        khungHinhPhat: "Chuyển thành tù chung thân: Người đủ 75 tuổi trở lên",
        mucDo: "chung-than",
      },
      {
        khoan: "Khoản 3 Điểm c",
        soKhoan: 3,
        khungHinhPhat: "Chuyển thành tù chung thân: Người bị kết án tử hình về tội tham ô, nhận hối lộ chủ động nộp lại ít nhất 3/4 tài sản và hợp tác tích cực",
        mucDo: "chung-than",
      },
    ],
  },
  {
    id: "dieu-51",
    maDieu: "Điều 51",
    soDieu: 51,
    tenToiDanh: "Các tình tiết giảm nhẹ trách nhiệm hình sự",
    tenDayDu: "Điều 51: Các tình tiết giảm nhẹ trách nhiệm hình sự",
    chuong: "chuong-chung",
    tenChuong: "Phần chung: Quy định chung về hình phạt & chấp hành án",
    boLuat: "BLHS 2015",
    boLuatFull: "Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017)",
    coAnTuHinh: false,
    coAnChungThan: false,
    danhSachKhoan: [
      { khoan: "Khoản 1", soKhoan: 1, khungHinhPhat: "Các tình tiết giảm nhẹ luật định (Điểm a đến v)", mucDo: "co-thoi-han" },
      { khoan: "Khoản 2", soKhoan: 2, khungHinhPhat: "Các tình tiết giảm nhẹ khác do Tòa án ghi nhận", mucDo: "co-thoi-han" },
    ],
  },
];
