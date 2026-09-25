import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, MoreVertical, ChevronDown, ChevronUp, X, Eye, Users, FileText, ChevronLeft, ChevronRight, Search, Calendar, Check, Printer, Download, Edit2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";import { Button, Input } from "antd";


// ── Data ──────────────────────────────────────────────────────────────────────

export type VuAnDetail = {
  id: number;
  soTL: string;
  ngayTL: string;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  capXX: "Sơ thẩm" | "Phúc thẩm";
  loaiAn: string;
  biCao?: string;
  toiDanh?: string;
  biHai?: string;
  nguoiKhieuNai?: string;
  nguyenDon?: string;
  biDon?: string;
  qhpl?: string;
  ndd?: string;
  ttv: string;
  ldv: string;
  tp: string;
  trangThai: string;
  sub: string;
  extra?: string;
};

export type HDXXRow = {
  id: number;
  soDS: string;
  ngayDS: string;
  donViGui: string;
  loaiAn: "Hình sự" | "Dân sự" | "Kinh doanh thương mại" | "Hành chính";
  loaiBanAn?: string;
  capXX?: "Sơ thẩm" | "Phúc thẩm";
  soBA?: string;
  ngayBA?: string;
  toaAnBA?: string;
  thuLyList: { so: string; ngay: string }[];
  soVuLink: number;
  hdxx: string;
  chuToa: string;
  thanhPhanHDXX: string[];
  hdxxSub: string;
  trangThaiXX: "chua-xx" | "da-xx" | "chua-phan-cong" | "cho-ky-duyet";
  trangThaiSub: string;
  trangThaiExtra?: string;
  danhSachVuAn?: VuAnDetail[];
};

type PCTab = "tat-ca" | "cho-ky-duyet";

const ROWS: HDXXRow[] = [
  {
    id: 1,
    soDS: "54681978",
    ngayDS: "10/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra II (TANDTC)",
    loaiAn: "Dân sự",
    loaiBanAn: "Bản án dân sự",
    capXX: "Sơ thẩm",
    soBA: "38/2026/DS-ST",
    ngayBA: "01/07/2026",
    toaAnBA: "Tòa án nhân dân huyện Phong Điền",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
      { so: "54682426", ngay: "20/07/2026" },
    ],
    soVuLink: 3,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Nguyễn Trí Tuệ",
    thanhPhanHDXX: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxSub: "Chờ ký",
    trangThaiXX: "chua-xx",
    trangThaiSub: "Đã lên lịch xét xử",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682424",
        ngayTL: "20/07/2026",
        soBA: "38/2026/DS-ST",
        ngayBA: "01/07/2026",
        toaAn: "TAND huyện Phong Điền",
        capXX: "Sơ thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Trần Văn Hải",
        qhpl: "Tranh chấp hợp đồng vay tài sản",
        biDon: "Nguyễn Văn Hùng",
        ndd: "Nguyễn Đơn Hải",
        ttv: "Trịnh Thị Minh Trang",
        ldv: "Lê Thị Thu Hiền",
        tp: "Phạm Thị Bích Ngọc",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
      {
        id: 2,
        soTL: "54682425",
        ngayTL: "20/07/2026",
        soBA: "41/2026/DS-ST",
        ngayBA: "03/07/2026",
        toaAn: "TAND quận Ninh Kiều",
        capXX: "Sơ thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Lê Thị Mai",
        qhpl: "Tranh chấp quyền sử dụng đất",
        biDon: "Phạm Quốc Tuấn",
        ndd: "UBND quận Ninh Kiều",
        ttv: "Võ Thị Thùy Giang",
        ldv: "Nguyễn Như Thắng",
        tp: "Lê Thị Thu Hiền",
        trangThai: "Chưa xét xử",
        sub: "Hoãn lên lịch xét xử",
      },
      {
        id: 3,
        soTL: "54682426",
        ngayTL: "20/07/2026",
        soBA: "19/2026/HNGĐ-ST",
        ngayBA: "05/07/2026",
        toaAn: "TAND huyện Cờ Đỏ",
        capXX: "Sơ thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Nguyễn Quốc Huy",
        qhpl: "Tranh chấp chia tài sản sau ly hôn",
        biDon: "Hoàng Thị Thảo",
        ndd: "Lâm Gia Bảo",
        ttv: "Vũ Diệu Thúy",
        ldv: "Phạm Thị Bích Ngọc",
        tp: "Nguyễn Như Thắng",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
    ],
  },
  {
    id: 2,
    soDS: "54681923",
    ngayDS: "09/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra I (TANDTC)",
    loaiAn: "Hình sự",
    loaiBanAn: "Bản án hình sự",
    capXX: "Phúc thẩm",
    soBA: "112/2026/HS-PT",
    ngayBA: "20/06/2026",
    toaAnBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
    ],
    soVuLink: 2,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Lê Thị Thu Hiển",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxSub: "Đã có hiệu lực",
    trangThaiXX: "chua-xx",
    trangThaiSub: "Đã lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 19 ngày",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682424",
        ngayTL: "20/07/2026",
        soBA: "112/2026/HS-PT",
        ngayBA: "20/06/2026",
        toaAn: "TAND cấp cao tại Hà Nội",
        capXX: "Phúc thẩm",
        loaiAn: "Hình sự",
        biCao: "Hoàng Minh Đức",
        toiDanh: "Buôn lậu (Điều 188 BLHS)",
        biHai: "Cục Hải quan TP. Hải Phòng",
        nguoiKhieuNai: "Hoàng Minh Đức (Bị cáo đề nghị GĐT)",
        ttv: "Nguyễn Thu Hằng",
        ldv: "Lê Thị Thu Hiển",
        tp: "Nguyễn Biên Thùy",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
        extra: "Thời hạn xét xử: 19 ngày",
      },
      {
        id: 2,
        soTL: "54682425",
        ngayTL: "20/07/2026",
        soBA: "85/2026/HS-PT",
        ngayBA: "15/06/2026",
        toaAn: "TAND cấp cao tại Hà Nội",
        capXX: "Phúc thẩm",
        loaiAn: "Hình sự",
        biCao: "Đỗ Đình Trọng",
        toiDanh: "Cố ý gây thương tích (Điều 134 BLHS)",
        biHai: "Nguyễn Văn Nam",
        nguoiKhieuNai: "Nguyễn Văn Nam (Bị hại có đơn khiếu nại)",
        ttv: "Trần Thị Lan",
        ldv: "Lê Thị Thu Hiển",
        tp: "Trần Hồng Hà",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
    ],
  },
  {
    id: 3,
    soDS: "54681922",
    ngayDS: "08/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra III (TANDTC)",
    loaiAn: "Kinh doanh thương mại",
    loaiBanAn: "Bản án kinh doanh thương mại",
    capXX: "Sơ thẩm",
    soBA: "22/2026/KDTM-ST",
    ngayBA: "25/06/2026",
    toaAnBA: "Tòa án nhân dân TP. Đà Nẵng",
    thuLyList: [
      { so: "54682424", ngay: "20/07/2026" },
      { so: "54682425", ngay: "20/07/2026" },
      { so: "54682426", ngay: "20/07/2026" },
    ],
    soVuLink: 3,
    hdxx: "–",
    chuToa: "–",
    thanhPhanHDXX: [],
    hdxxSub: "",
    trangThaiXX: "chua-phan-cong",
    trangThaiSub: "",
  },
  {
    id: 4,
    soDS: "54681813",
    ngayDS: "09/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra II (TANDTC)",
    loaiAn: "Dân sự",
    loaiBanAn: "Bản án dân sự",
    capXX: "Sơ thẩm",
    soBA: "56/2026/DS-ST",
    ngayBA: "18/06/2026",
    toaAnBA: "Tòa án nhân dân tỉnh Đồng Nai",
    thuLyList: [{ so: "54682424", ngay: "20/07/2026" }],
    soVuLink: 1,
    hdxx: "Hội đồng toàn thể thẩm phán",
    chuToa: "Phạm Thị Bích Ngọc",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh"],
    hdxxSub: "Đã có hiệu lực",
    trangThaiXX: "da-xx",
    trangThaiSub: "Đã rút kháng nghị",
    trangThaiExtra: "Số GĐ: 54681878/2026/QĐ-CA\nNgày QĐ: 09/07/2026",
  },
  {
    id: 5,
    soDS: "54681978",
    ngayDS: "10/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra I (TANDTC)",
    loaiAn: "Hình sự",
    loaiBanAn: "Bản án hình sự",
    capXX: "Sơ thẩm",
    soBA: "45/2026/HS-ST",
    ngayBA: "28/06/2026",
    toaAnBA: "Tòa án nhân dân tỉnh Nghệ An",
    thuLyList: [{ so: "54682424", ngay: "20/07/2026" }],
    soVuLink: 1,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Nguyễn Như Thắng",
    thanhPhanHDXX: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxSub: "Chưa có hiệu lực",
    trangThaiXX: "chua-xx",
    trangThaiSub: "Hoãn xét xử",
  },
  {
    id: 6,
    soDS: "54682613",
    ngayDS: "12/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra IV (TANDTC)",
    loaiAn: "Hành chính",
    loaiBanAn: "Bản án hành chính",
    capXX: "Sơ thẩm",
    soBA: "09/2026/HC-ST",
    ngayBA: "02/07/2026",
    toaAnBA: "Tòa án nhân dân tỉnh Quảng Ninh",
    thuLyList: [
      { so: "54682614", ngay: "22/07/2026" },
      { so: "54682615", ngay: "22/07/2026" },
    ],
    soVuLink: 2,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Lê Thị Thu Hiển",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxSub: "Đã có hiệu lực",
    trangThaiXX: "chua-xx",
    trangThaiSub: "Đã lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 15 ngày",
  },
  {
    id: 7,
    soDS: "54682701",
    ngayDS: "14/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra I (TANDTC)",
    loaiAn: "Hình sự",
    loaiBanAn: "Bản án hình sự",
    capXX: "Sơ thẩm",
    soBA: "020/2026/HS-ST",
    ngayBA: "09/07/2026",
    toaAnBA: "Tòa án nhân dân huyện Phong Điền, TP. Cần Thơ",
    thuLyList: [
      { so: "54682801", ngay: "24/07/2026" },
      { so: "54682802", ngay: "24/07/2026" },
    ],
    soVuLink: 2,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Nguyễn Như Thắng",
    thanhPhanHDXX: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxSub: "Chờ ký duyệt",
    trangThaiXX: "cho-ky-duyet",
    trangThaiSub: "Chưa lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 22 ngày",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682801",
        ngayTL: "24/07/2026",
        soBA: "020/2026/HS-ST",
        ngayBA: "09/07/2026",
        toaAn: "TAND huyện Phong Điền, TP. Cần Thơ",
        capXX: "Sơ thẩm",
        loaiAn: "Hình sự",
        biCao: "Trần Văn Hải",
        toiDanh: "Trộm cắp tài sản (Khoản 2 Điều 173 BLHS)",
        biHai: "Công ty TNHH MTV Vận tải Nam Hà",
        nguoiKhieuNai: "Trần Văn Hải (Bị cáo đề nghị GĐT)",
        ttv: "Trịnh Thị Minh Trang",
        ldv: "Lê Thị Thu Hiền",
        tp: "Nguyễn Như Thắng",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
        extra: "",
      },
      {
        id: 2,
        soTL: "54682802",
        ngayTL: "24/07/2026",
        soBA: "016/2026/HS-ST",
        ngayBA: "08/07/2026",
        toaAn: "TAND huyện Cờ Đỏ, TP. Cần Thơ",
        capXX: "Sơ thẩm",
        loaiAn: "Hình sự",
        biCao: "Nguyễn Quốc Huy",
        toiDanh: "Lừa đảo chiếm đoạt tài sản (Điều 174 BLHS)",
        biHai: "Lâm Gia Bảo",
        nguoiKhieuNai: "Lâm Gia Bảo (Bị hại có đơn khiếu nại)",
        ttv: "Võ Thị Thùy Giang",
        ldv: "Nguyễn Như Thắng",
        tp: "Lê Thị Thu Hiền",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
        extra: "Thời hạn xét xử: 22 ngày",
      },
    ],
  },
  {
    id: 8,
    soDS: "54682755",
    ngayDS: "15/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra II (TANDTC)",
    loaiAn: "Dân sự",
    loaiBanAn: "Bản án dân sự",
    capXX: "Sơ thẩm",
    soBA: "45/2026/DS-ST",
    ngayBA: "11/07/2026",
    toaAnBA: "Tòa án nhân dân quận Cầu Giấy, TP. Hà Nội",
    thuLyList: [
      { so: "54682810", ngay: "25/07/2026" },
      { so: "54682811", ngay: "25/07/2026" },
      { so: "54682812", ngay: "25/07/2026" },
    ],
    soVuLink: 3,
    hdxx: "Hội đồng toàn thể thẩm phán",
    chuToa: "Phạm Thị Bích Ngọc",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Lê Văn Minh"],
    hdxxSub: "Chờ ký duyệt",
    trangThaiXX: "cho-ky-duyet",
    trangThaiSub: "Chưa lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 10 ngày",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682810",
        ngayTL: "25/07/2026",
        soBA: "45/2026/DS-ST",
        ngayBA: "11/07/2026",
        toaAn: "TAND quận Cầu Giấy, TP. Hà Nội",
        capXX: "Sơ thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Phạm Văn Cường",
        qhpl: "Tranh chấp quyền sử dụng đất",
        biDon: "Nguyễn Thị Thanh Hà",
        ndd: "UBND quận Cầu Giấy",
        ttv: "Nguyễn Thu Hằng",
        ldv: "Phạm Thị Bích Ngọc",
        tp: "Nguyễn Biên Thùy",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
        extra: "Thời hạn xét xử: 10 ngày",
      },
      {
        id: 2,
        soTL: "54682811",
        ngayTL: "25/07/2026",
        soBA: "18/2026/HNGĐ-ST",
        ngayBA: "05/07/2026",
        toaAn: "TAND thành phố Vinh, tỉnh Nghệ An",
        capXX: "Sơ thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Lê Hoàng Long",
        qhpl: "Tranh chấp chia tài sản chung khi ly hôn",
        biDon: "Trần Thị Mỹ Linh",
        ndd: "Ngân hàng Vietcombank - CN Nghệ An",
        ttv: "Trần Thị Lan",
        ldv: "Lê Hoàng Nam",
        tp: "Trần Hồng Hà",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
      {
        id: 3,
        soTL: "54682812",
        ngayTL: "25/07/2026",
        soBA: "32/2026/DS-PT",
        ngayBA: "02/07/2026",
        toaAn: "TAND cấp cao tại Hà Nội",
        capXX: "Phúc thẩm",
        loaiAn: "Dân sự",
        nguyenDon: "Công ty CP Địa ốc Sông Hồng",
        qhpl: "Tranh chấp hợp đồng mua bán căn hộ",
        biDon: "Hoàng Văn Tuấn",
        ndd: "VP Công chứng Thăng Long",
        ttv: "Lý Văn An",
        ldv: "Phạm Thị Bích Ngọc",
        tp: "Lê Văn Minh",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
    ],
  },
  {
    id: 9,
    soDS: "54682890",
    ngayDS: "18/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra III (TANDTC)",
    loaiAn: "Kinh doanh thương mại",
    loaiBanAn: "Bản án kinh doanh thương mại",
    capXX: "Sơ thẩm",
    soBA: "18/2026/KDTM-ST",
    ngayBA: "12/07/2026",
    toaAnBA: "Tòa án nhân dân TP. Thủ Đức, TP. Hồ Chí Minh",
    thuLyList: [
      { so: "54682901", ngay: "26/07/2026" },
      { so: "54682902", ngay: "26/07/2026" },
    ],
    soVuLink: 2,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Lê Thị Thu Hiển",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxSub: "Chờ ký duyệt",
    trangThaiXX: "cho-ky-duyet",
    trangThaiSub: "Chưa lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 18 ngày",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682901",
        ngayTL: "26/07/2026",
        soBA: "18/2026/KDTM-ST",
        ngayBA: "12/07/2026",
        toaAn: "TAND TP. Thủ Đức, TP.HCM",
        capXX: "Sơ thẩm",
        loaiAn: "Kinh doanh thương mại",
        nguyenDon: "Công ty CP Đầu tư Á Châu",
        qhpl: "Tranh chấp hợp đồng cung ứng dịch vụ logistics",
        biDon: "Công ty TNHH Vận tải Nam Long",
        ndd: "LS. Đặng Hoàng Long",
        ttv: "Nguyễn Thu Hằng",
        ldv: "Lê Thị Thu Hiển",
        tp: "Nguyễn Biên Thùy",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
      {
        id: 2,
        soTL: "54682902",
        ngayTL: "26/07/2026",
        soBA: "06/2026/LĐ-ST",
        ngayBA: "06/07/2026",
        toaAn: "TAND quận Hải Châu, TP. Đà Nẵng",
        capXX: "Sơ thẩm",
        loaiAn: "Kinh doanh thương mại",
        nguyenDon: "Trần Minh Quân",
        qhpl: "Tranh chấp đơn phương chấm dứt HĐ lao động",
        biDon: "Công ty TNHH May mặc Tân Phú",
        ndd: "Công đoàn các KCN Đà Nẵng",
        ttv: "Trịnh Hữu Lộc",
        ldv: "Lê Thị Thu Hiển",
        tp: "Trần Hồng Hà",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
    ],
  },
  {
    id: 10,
    soDS: "54682944",
    ngayDS: "20/07/2026",
    donViGui: "Vụ Giám đốc, kiểm tra IV (TANDTC)",
    loaiAn: "Hành chính",
    loaiBanAn: "Bản án hành chính",
    capXX: "Sơ thẩm",
    soBA: "12/2026/HC-ST",
    ngayBA: "14/07/2026",
    toaAnBA: "Tòa án nhân dân tỉnh Bắc Ninh",
    thuLyList: [
      { so: "54682961", ngay: "28/07/2026" },
      { so: "54682962", ngay: "28/07/2026" },
    ],
    soVuLink: 2,
    hdxx: "Hội đồng 5 thẩm phán",
    chuToa: "Phạm Quốc Anh",
    thanhPhanHDXX: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxSub: "Chờ ký duyệt",
    trangThaiXX: "cho-ky-duyet",
    trangThaiSub: "Chưa lên lịch xét xử",
    trangThaiExtra: "Thời hạn xét xử: 14 ngày",
    danhSachVuAn: [
      {
        id: 1,
        soTL: "54682961",
        ngayTL: "28/07/2026",
        soBA: "12/2026/HC-ST",
        ngayBA: "14/07/2026",
        toaAn: "TAND tỉnh Bắc Ninh",
        capXX: "Sơ thẩm",
        loaiAn: "Hành chính",
        nguyenDon: "Công ty TNHH Phát triển Đô thị Kinh Bắc",
        qhpl: "Khiếu kiện Quyết định thu hồi đất và bồi thường",
        biDon: "Chủ tịch UBND tỉnh Bắc Ninh",
        ndd: "Sở TN&MT tỉnh Bắc Ninh",
        ttv: "Lý Văn An",
        ldv: "Phạm Quốc Anh",
        tp: "Lê Thị Thu Hiển",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
      {
        id: 2,
        soTL: "54682962",
        ngayTL: "28/07/2026",
        soBA: "24/2026/HC-PT",
        ngayBA: "10/07/2026",
        toaAn: "TAND cấp cao tại Hà Nội",
        capXX: "Phúc thẩm",
        loaiAn: "Hành chính",
        nguyenDon: "Lê Đình Thắng",
        qhpl: "Khiếu kiện Quyết định xử phạt vi phạm hành chính",
        biDon: "Cục trưởng Cục Hải quan TP. Hải Phòng",
        ndd: "LS. Vũ Thị Mai",
        ttv: "Hoàng Văn Toàn",
        ldv: "Phạm Quốc Anh",
        tp: "Nguyễn Biên Thùy",
        trangThai: "Chưa xét xử",
        sub: "Đã lên lịch xét xử",
      },
    ],
  },
];

const HDXX_MEMBERS: Record<number, { vai: string; ho: string; chucVu: string }[]> = {
  1: [
    { vai: "Chủ tọa", ho: "Nguyễn Văn Minh", chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán", ho: "Trần Thị Lan", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Lê Hoàng Nam", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Phạm Thị Hoa", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Đỗ Quang Hùng", chucVu: "Thẩm phán" },
    { vai: "Thư ký", ho: "Nguyễn Thu Hằng", chucVu: "Thư ký tòa án" },
  ],
  2: [
    { vai: "Chủ tọa", ho: "Vũ Đình Tuấn", chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán", ho: "Bùi Thị Mai", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Cao Văn Thắng", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Đinh Hữu Đức", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Hoàng Thị Yến", chucVu: "Thẩm phán" },
    { vai: "Thư ký", ho: "Lý Văn An", chucVu: "Thư ký tòa án" },
  ],
  4: [
    { vai: "Chủ tọa", ho: "Nguyễn Đức Long", chucVu: "Thẩm phán TAND Tối cao" },
    { vai: "Thẩm phán", ho: "Trần Văn Bình", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Lê Thị Cúc", chucVu: "Thẩm phán" },
  ],
  5: [
    { vai: "Chủ tọa", ho: "Phạm Quốc Anh", chucVu: "Thẩm phán cao cấp" },
    { vai: "Thẩm phán", ho: "Ngô Thị Dung", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Lưu Văn Hải", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Trịnh Hữu Lộc", chucVu: "Thẩm phán" },
    { vai: "Thẩm phán", ho: "Bùi Ngọc Hà", chucVu: "Thẩm phán" },
    { vai: "Thư ký", ho: "Hoàng Văn Toàn", chucVu: "Thư ký tòa án" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function TrangThaiBadge({ type }: { type: HDXXRow["trangThaiXX"] }) {
  if (type === "chua-phan-cong")
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#fee2e2", color: RED, border: `1px solid ${RED}` }}>Chưa phân công HĐXX</span>;
  if (type === "da-xx")
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#f3f4f6", color: TEXT }}>Đã xét xử</span>;
  if (type === "cho-ky-duyet")
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#fef3c7", color: "#92400e", border: "1px solid #f59e0b" }}>Chờ ký duyệt</span>;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 14, fontWeight: 700, fontFamily: F, background: "#dcfce7", color: "#15803d" }}>Chưa xét xử</span>;
}

// ── Số vụ xét xử modal ────────────────────────────────────────────────────────

function SoVuModal({ row, onClose }: { row: HDXXRow; onClose: () => void }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "9px 12px", fontFamily: F, color: "#374151" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "10px 12px", fontFamily: F, color: TEXT };
  const vuList = row.danhSachVuAn || row.thuLyList.map((tl, i) => ({
    id: i + 1,
    soTL: tl.so,
    ngayTL: tl.ngay,
    biCao: row.loaiAn === "Hình sự" ? (i === 0 ? "Trần Văn Hải" : "Nguyễn Quốc Huy") : undefined,
    nguoiKhieuNai: row.loaiAn === "Hình sự" ? (i === 0 ? "Trần Văn Hải (Bị cáo đề nghị GĐT)" : "Lâm Gia Bảo (Bị hại có đơn khiếu nại)") : undefined,
    nguyenDon: row.loaiAn !== "Hình sự" ? (i === 0 ? "Phạm Văn Cường" : "Lê Hoàng Long") : undefined,
    biDon: row.loaiAn !== "Hình sự" ? (i === 0 ? "Nguyễn Thị Thanh Hà" : "Trần Thị Mỹ Linh") : undefined,
    loaiAn: row.loaiAn,
    trangThai: "Chưa xét xử",
  }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 720, maxWidth: "95vw", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: F, color: TEXT }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách vụ xét xử – DS số {row.soDS}</span>
            <div style={{ fontSize: 14, color: MUTED, fontFamily: F, marginTop: 2 }}>{row.donViGui} • {row.loaiAn}</div>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></Button>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["STT", "Số thụ lý", "Ngày thụ lý", row.loaiAn === "Hình sự" ? "Bị cáo / Người khiếu nại" : row.loaiAn === "Hành chính" ? "Người khởi kiện / Người bị kiện" : "Nguyên đơn / Bị đơn", "Loại án", "Trạng thái"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vuList.map((tl, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{i + 1}</td>
                  <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{tl.soTL}</td>
                  <td style={TD}>{tl.ngayTL}</td>
                  <td style={TD}>
                    {row.loaiAn === "Hình sự" ? (
                      <div>
                        <div><b style={{ color: RED }}>Bị cáo:</b> {tl.biCao || "Trần Văn Hải"}</div>
                        {tl.nguoiKhieuNai && (
                          <div style={{ color: TEXT, fontSize: 14, marginTop: 2, fontFamily: F }}>
                            <b style={{ color: MUTED }}>NKN:</b> {tl.nguoiKhieuNai}
                          </div>
                        )}
                      </div>
                    ) : row.loaiAn === "Hành chính" ? (
                      <div>
                        <div><b>NKK:</b> {tl.nguyenDon || "Công ty Kinh Bắc"}</div>
                        <div style={{ color: MUTED, marginTop: 2 }}><b>NBK:</b> {tl.biDon || "Chủ tịch UBND tỉnh"}</div>
                      </div>
                    ) : (
                      <div>
                        <div><b>NĐ:</b> {tl.nguyenDon || "Phạm Văn Cường"}</div>
                        <div style={{ color: MUTED, marginTop: 2 }}><b>BĐ:</b> {tl.biDon || "Nguyễn Thị Thanh Hà"}</div>
                      </div>
                    )}
                  </td>
                  <td style={TD}>{tl.loaiAn}</td>
                  <td style={TD}><Badge color="#1e40af" bg="#dbeafe">{tl.trangThai || "Chưa xét xử"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
        </div>
      </div>
    </div>
  );
}

// ── 3-dot context menu ────────────────────────────────────────────────────────

function ContextMenu({ row, onClose, onXem, onPhanCong, onLichXX }: {
  row: HDXXRow;
  onClose: () => void;
  onXem: () => void;
  onPhanCong: () => void;
  onLichXX: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const item = (label: string, color: string, onClick: () => void) => (
    <Button onClick={() => { onClick(); onClose(); }}
      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: F, color, whiteSpace: "nowrap" }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
    >{label}</Button>
  );

  return (
    <div ref={ref} style={{ position: "absolute", right: 0, top: "100%", zIndex: 200, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 190, overflow: "hidden" }}>
      {item("👁 Xem chi tiết", TEXT, onXem)}
      {row.trangThaiXX === "chua-phan-cong" && item("👥 Phân công HĐXX", TEXT, onPhanCong)}
      {row.trangThaiXX !== "chua-phan-cong" && item("📋 Thông tin phân công HĐXX", TEXT, onPhanCong)}
      {item("📅 Lịch xét xử", TEXT, onLichXX)}
      {row.trangThaiXX !== "da-xx" && item("✏ Chỉnh sửa", TEXT, onXem)}
      {row.trangThaiXX !== "da-xx" && item("🗑 Xóa", "#ef4444", onClose)}
    </div>
  );
}

// ── HĐXX Detail view ──────────────────────────────────────────────────────────

const ALL_JUDGES = [
  { name: "Nguyễn Văn Quảng", chuc: "Chánh án" },
  { name: "Nguyễn Biên Thùy", chuc: "Phó Chánh án" },
  { name: "Nguyễn Hải Trâm", chuc: "Phó Chánh án" },
  { name: "Lê Tiến", chuc: "Phó Chánh án" },
  { name: "Phạm Quốc Hưng", chuc: "Phó Chánh án" },
  { name: "Nguyễn Văn Tiến", chuc: "Phó Chánh án" },
];

const QD_ROWS = [
  { id: 1, soQD: "2442/2026/QĐ-TANDTC", ngayQD: "16/07/2026", tenBM: "Quyết định thành lập Hội đồng xét xử", nguoiKy: "Nguyễn Biên Thùy", trangThai: "Đã có hiệu lực" },
  { id: 2, soQD: "2441/2026/QĐ-TANDTC", ngayQD: "16/07/2026", tenBM: "Quyết định thành lập Hội đồng xét xử", nguoiKy: "Nguyễn Biên Thùy", trangThai: "Đã hủy" },
];

// ── Lịch xét xử modal ────────────────────────────────────────────────────────

type CalEvent = { label: string; color: string; bg: string; loai: "GĐT/TT" | "ST" | "PT" };
const LOAI_STYLE: Record<"GĐT/TT" | "ST" | "PT", { color: string; bg: string }> = {
  "GĐT/TT": { color: "#991b1b", bg: "#fee2e2" },
  "ST": { color: "#1e40af", bg: "#dbeafe" },
  "PT": { color: "#92400e", bg: "#fef3c7" },
};
const INIT_EVENTS: Record<string, CalEvent[]> = {
  "2026-04-01": [{ label: "Xét xử vụ án gi...", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Lịch hồ sơ khác...", color: "#92400e", bg: "#fef3c7", loai: "PT" }],
  "2026-04-05": [{ label: "Xét xử vụ án gi...", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Lịch hồ sơ khác...", color: "#92400e", bg: "#fef3c7", loai: "PT" }],
  "2026-04-09": [{ label: "Lịch xét xử ch...", color: "#1e40af", bg: "#dbeafe", loai: "ST" }],
  "2026-04-14": [{ label: "SGS", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }],
  "2026-04-15": [{ label: "test", color: "#166534", bg: "#dcfce7", loai: "ST" }],
  "2026-04-17": [{ label: "Phiên của vụ k...", color: "#166534", bg: "#dcfce7", loai: "ST" }],
  "2026-04-20": [{ label: "test", color: "#9d174d", bg: "#fce7f3", loai: "PT" }],
  "2026-04-22": [{ label: "OO1TT", color: "#1e40af", bg: "#dbeafe", loai: "GĐT/TT" }],
  "2026-04-24": [{ label: "12591", color: "#166534", bg: "#dcfce7", loai: "GĐT/TT" }, { label: "Hồ sơ khác...", color: "#9d174d", bg: "#fce7f3", loai: "PT" }],
  "2026-04-30": [{ label: "OO1TT", color: "#1e40af", bg: "#dbeafe", loai: "GĐT/TT" }, { label: "Chang test", color: "#166534", bg: "#dcfce7", loai: "ST" }],
};

const MINI_CAL_DAYS = (() => {
  // April 2026: starts Thursday (day 4), 30 days
  const days: (number | null)[] = [];
  for (let i = 0; i < 3; i++) days.push(null); // Mon=0, Tue=1, Wed=2 empty, Thu=3 is Apr1
  for (let d = 1; d <= 30; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
})();

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Build full calendar grid for April 2026
const FULL_CAL_ROWS = (() => {
  const rows: (number | null)[][] = [];
  let row: (number | null)[] = [null, null, null]; // Mon-Wed empty before Apr 1 (Thu)
  for (let d = 1; d <= 30; d++) {
    row.push(d);
    if (row.length === 7) { rows.push(row); row = []; }
  }
  while (row.length < 7) row.push(null);
  if (row.some(x => x !== null)) rows.push(row);
  return rows;
})();

export function LichXetXuModal({ onClose, onSelectDate }: { onClose: () => void; onSelectDate?: (dateStr: string) => void }) {
  const [calView, setCalView] = useState<"thang" | "tuan" | "ngay">("thang");
  const [events, setEvents] = useState<Record<string, CalEvent[]>>(INIT_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [successDay, setSuccessDay] = useState<number | null>(null);

  // popup form state
  const [fTitle, setFTitle] = useState("");
  const [fGioFrom, setFGioFrom] = useState("00:00");
  const [fGioTo, setFGioTo] = useState("01:00");
  const [fCalNgay, setFCalNgay] = useState(false);
  const [fSoDS, setFSoDS] = useState("");
  const [fNgayTao, setFNgayTao] = useState("18/03/2026");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fNguoiNhan, setFNguoiNhan] = useState("");

  const today = 17;
  const dateKey = (d: number | null) => d ? `2026-04-${String(d).padStart(2, "0")}` : "";

  const buildEvent = (): CalEvent | null => {
    if (!selectedDay) return null;
    const loai: CalEvent["loai"] =
      fHinhThuc === "Sơ thẩm" ? "ST" : fHinhThuc === "Phúc thẩm" ? "PT" : "GĐT/TT";
    const st = LOAI_STYLE[loai];
    return { label: fTitle || `Lịch ${loai}`, color: st.color, bg: st.bg, loai };
  };

  const handleTaoMoi = () => {
    const ev = buildEvent();
    if (!ev || !selectedDay) return;
    const key = dateKey(selectedDay);
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), ev] }));
    // reset form nhưng giữ popup mở
    setFTitle(""); setFSoDS(""); setFHinhThuc(""); setFNguoiNhan(""); setFGioFrom("00:00"); setFGioTo("01:00");
  };

  const handleLuu = () => {
    const ev = buildEvent();
    if (!ev || !selectedDay) return;
    const key = dateKey(selectedDay);
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), ev] }));
    setSuccessDay(selectedDay);
    if (onSelectDate) {
      onSelectDate(`${String(selectedDay).padStart(2, "0")}/04/2026`);
    }
    setSelectedDay(null);
    setFTitle(""); setFSoDS(""); setFHinhThuc(""); setFNguoiNhan("");
  };

  // render a single calendar cell
  const renderCell = (d: number | null, ci: number, dimmed = false) => {
    const key = dateKey(d);
    const dayEvs = d ? (events[key] || []) : [];
    const isToday = d === today;
    const isSuccess = d === successDay;
    const isSun = ci === 6;
    return (
      <td key={`${ci}-${d ?? "x"}`}
        onClick={() => { if (d) { setSelectedDay(d); setSuccessDay(null); } }}
        style={{
          padding: "6px 8px",
          borderRight: ci < 6 ? `1px solid ${BORDER}` : "none",
          borderBottom: `1px solid ${BORDER}`,
          verticalAlign: "top" as const,
          background: dimmed ? "#f9fafb" : isSuccess ? "#f0fdf4" : isSun && d ? "#fef9f9" : d ? "#fff" : "#f9fafb",
          cursor: d ? "pointer" : "default",
          minHeight: 90,
        }}>
        {d && (
          <>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: "50%",
              background: isToday ? RED : "none",
              color: dimmed ? "#d1d5db" : isToday ? "#fff" : TEXT,
              fontSize: 14, fontWeight: isToday ? 700 : 400,
            }}>{String(d).padStart(2, "0")}</span>
            {isSuccess && (
              <div style={{ fontSize: 9, color: "#16a34a", fontWeight: 700, marginBottom: 1 }}>✓ Đã thêm lịch</div>
            )}
            {dayEvs.map((ev, ei) => (
              <div key={ei} style={{
                marginTop: 2, padding: "2px 5px", borderRadius: 3,
                background: ev.bg, color: ev.color,
                fontSize: 10, fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 800, flexShrink: 0,
                  background: LOAI_STYLE[ev.loai].color, color: "#fff",
                  borderRadius: 2, padding: "0 3px", lineHeight: "14px",
                }}>{ev.loai}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{ev.label}</span>
              </div>
            ))}
          </>
        )}
      </td>
    );
  };

  const inp: React.CSSProperties = { width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box" as const, background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 };
  const req = <span style={{ color: RED }}> *</span>;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 1060, maxHeight: "92vh", display: "flex", flexDirection: "column" as const, boxShadow: "0 12px 48px rgba(0,0,0,0.2)", overflow: "hidden", fontFamily: F }}>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Left sidebar ── */}
          <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${BORDER}`, padding: "16px 14px", display: "flex", flexDirection: "column" as const, gap: 14, overflowY: "auto" as const }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Lịch xét xử</div>
              <span style={{ display: "inline-block", marginTop: 4, background: "#dbeafe", color: "#1d4ed8", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 8px" }}>
                {Object.values(events).flat().length} lịch
              </span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: "uppercase" as const }}>Bộ lọc lịch</div>
              <p style={{ fontSize: 14, color: MUTED, marginBottom: 10, lineHeight: 1.5 }}>Chọn năm, tháng để rà soát các phiên đã tạo</p>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: MUTED, display: "block", marginBottom: 3 }}>Năm</label>
                  <Input defaultValue="2026" style={{ width: "100%", padding: "4px 6px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: MUTED, display: "block", marginBottom: 3 }}>Tháng</label>
                  <Input defaultValue="Tháng 4" style={{ width: "100%", padding: "4px 6px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F }} />
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Tháng 4/2026</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
                    <th key={d} style={{ fontSize: 9, color: MUTED, fontWeight: 600, textAlign: "center" as const, padding: "2px 0" }}>{d}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(MINI_CAL_DAYS.length / 7) }, (_, ri) => (
                    <tr key={ri}>
                      {MINI_CAL_DAYS.slice(ri * 7, ri * 7 + 7).map((d, ci) => (
                        <td key={ci} style={{ textAlign: "center" as const, padding: "2px 0" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 20, height: 20, borderRadius: "50%", fontSize: 10,
                            fontWeight: d === today ? 700 : 400,
                            background: d === today ? RED : "none",
                            color: d === today ? "#fff" : d ? TEXT : "transparent",
                            cursor: d ? "pointer" : "default",
                          }}>{d ?? ""}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Tổng số lịch xét xử</div>
              {([["GĐT/TT", "Giám đốc thẩm / Tái thẩm"], ["ST", "Sơ thẩm"], ["PT", "Phúc thẩm"]] as const).map(([k, label]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 14, color: TEXT }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: LOAI_STYLE[k].color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Calendar ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
              <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                {["Hôm nay", "Trước", "Tiếp"].map((lbl2, i) => (
                  <Button key={lbl2} style={{ padding: "5px 12px", background: "#fff", border: "none", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}>{lbl2}</Button>
                ))}
              </div>
              <div style={{ flex: 1, textAlign: "center" as const, fontSize: 14, fontWeight: 700, color: TEXT }}>Tháng 4 Năm 2026</div>
              <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                {(["thang", "tuan", "ngay"] as const).map((v, i) => {
                  const vlbl = v === "thang" ? "Tháng" : v === "tuan" ? "Tuần" : "Ngày";
                  return (
                    <Button key={v} onClick={() => setCalView(v)} style={{ padding: "5px 14px", background: calView === v ? RED : "#fff", color: calView === v ? "#fff" : TEXT, border: "none", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 14, fontFamily: F, fontWeight: calView === v ? 700 : 400 }}>{vlbl}</Button>
                  );
                })}
              </div>
              <span style={{ fontSize: 14, color: MUTED }}>Click ô trống để thêm lịch</span>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: "auto" as const }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" as const }}>
                <thead>
                  <tr>
                    {WEEK_DAYS.map(d => (
                      <th key={d} style={{ padding: "8px 0", fontSize: 14, fontWeight: 600, color: MUTED, textAlign: "center" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, background: BG }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Leading row: Mar 30, 31 + Apr 1–5 */}
                  <tr style={{ height: 90 }}>
                    {renderCell(30, 0, true)}
                    {renderCell(31, 1, true)}
                    {renderCell(1, 2)}
                    {renderCell(2, 3)}
                    {renderCell(3, 4)}
                    {renderCell(4, 5)}
                    {renderCell(5, 6)}
                  </tr>
                  {FULL_CAL_ROWS.map((row, ri) => (
                    <tr key={ri} style={{ height: 90 }}>
                      {row.map((d, ci) => renderCell(d, ci))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>Đóng</Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Thêm lịch xét xử popup (matching image-11) ── */}
      {selectedDay !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setSelectedDay(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 8, width: 520, boxShadow: "0 8px 48px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: F }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Thêm lịch xét xử</span>
              <Button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}><X size={18} /></Button>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
              {/* Tiêu đề */}
              <div>
                <label style={lbl}>Tiêu đề{req}</label>
                <Input value={fTitle} onChange={e => setFTitle(e.target.value)}
                  placeholder="Nhập tiêu đề lịch xét xử" style={inp} />
              </div>

              {/* Ngày + Giờ + Cả ngày */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                <div style={{ flex: "0 0 160px" }}>
                  <label style={lbl}>Ngày xét xử{req}</label>
                  <Input readOnly value={`${String(selectedDay).padStart(2, "0")}/04/2026`}
                    style={{ ...inp, background: "#f9fafb", color: TEXT }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Giờ xét xử{req}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Input value={fGioFrom} onChange={e => setFGioFrom(e.target.value)}
                      style={{ ...inp, width: 72 }} />
                    <span style={{ color: MUTED, fontSize: 14 }}>→</span>
                    <Input value={fGioTo} onChange={e => setFGioTo(e.target.value)}
                      style={{ ...inp, width: 72 }} />
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: TEXT, cursor: "pointer", paddingBottom: 8, whiteSpace: "nowrap" as const }}>
                  <Input type="checkbox" checked={fCalNgay} onChange={e => setFCalNgay(e.target.checked)} style={{ width: 14, height: 14 }} />
                  Cả ngày
                </label>
              </div>

              {/* Hình thức + Người nhận thông báo */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Hình thức xét xử{req}</label>
                  <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)}
                    style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                    <option value="">Chọn hình thức</option>
                    <option value="Trực tiếp">Trực tiếp</option>
                    <option value="Trực tuyến">Trực tuyến</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Người nhận thông báo</label>
                  <select value={fNguoiNhan} onChange={e => setFNguoiNhan(e.target.value)}
                    style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                    <option value="">Chọn người nhận</option>
                    <option value="Toàn bộ HĐXX">👥 Toàn bộ Hội đồng xét xử</option>
                    <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển (Chánh án - Chủ tọa)</option>
                    <option value="Nguyễn Trí Tuệ">Nguyễn Trí Tuệ (Phó Chánh án - Chủ tọa)</option>
                    <option value="Phạm Quốc Hưng">Phạm Quốc Hưng (Phó Chánh án - Chủ tọa)</option>
                    <option value="Trịnh Thị Minh Trang">Trịnh Thị Minh Trang (Thẩm phán thành viên)</option>
                    <option value="Nguyễn Như Thắng">Nguyễn Như Thắng (Thẩm phán thành viên)</option>
                    <option value="Phạm Thị Bích Ngọc">Phạm Thị Bích Ngọc (Thẩm phán thành viên)</option>
                    <option value="Võ Thị Thùy Giang">Võ Thị Thùy Giang (Thẩm phán thành viên)</option>
                    <option value="Hoàng Văn Toàn">Hoàng Văn Toàn (Thư ký phiên tòa)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button onClick={() => setSelectedDay(null)}
                style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}>
                Đóng
              </Button>
              <Button onClick={handleTaoMoi}
                style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}>
                Tạo mới
              </Button>
              <Button onClick={handleLuu}
                style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type NoiNhanItem = {
  id: number;
  loaiNoiNhan: string;
  chiTiet: string;
  ghiChu: string;
};

function ThemBieuMauModal({
  row,
  onClose,
  onAdd,
}: {
  row: HDXXRow;
  onClose: () => void;
  onAdd: (bm: { soQD: string; ngayQD: string; tenBM: string; nguoiKy: string; trangThai: string }) => void;
}) {
  const isHinhSu = row.loaiAn === "Hình sự";
  const isHanhChinh = row.loaiAn === "Hành chính";
  const isKDTM = row.loaiAn === "Kinh doanh thương mại" || (row.loaiAn as any) === "Lao động";

  // Danh sách các vụ án trong DS xét xử
  const cases: VuAnDetail[] = row.danhSachVuAn || (
    isHinhSu
      ? [
        {
          id: 1,
          soTL: row.thuLyList?.[0]?.so || "54682424",
          ngayTL: row.thuLyList?.[0]?.ngay || "20/07/2026",
          soBA: row.soBA || "112/2026/HS-PT",
          ngayBA: row.ngayBA || "20/06/2026",
          toaAn: row.toaAnBA || "TAND cấp cao tại Hà Nội",
          capXX: row.capXX || "Phúc thẩm",
          loaiAn: "Hình sự",
          biCao: "Hoàng Minh Đức",
          toiDanh: "Tội buôn lậu (Điều 188 BLHS)",
          biHai: "Cục Hải quan TP. Hải Phòng",
          nguoiKhieuNai: "Hoàng Minh Đức (Bị cáo đề nghị GĐT)",
          ttv: "Nguyễn Thu Hằng",
          ldv: "Lê Thị Thu Hiển",
          tp: "Nguyễn Biên Thùy",
          trangThai: "Chưa xét xử",
          sub: "Đã lên lịch xét xử",
        },
        {
          id: 2,
          soTL: row.thuLyList?.[1]?.so || "54682425",
          ngayTL: row.thuLyList?.[1]?.ngay || "20/07/2026",
          soBA: "85/2026/HS-PT",
          ngayBA: "15/06/2026",
          toaAn: "TAND cấp cao tại Hà Nội",
          capXX: "Phúc thẩm",
          loaiAn: "Hình sự",
          biCao: "Đỗ Đình Trọng",
          toiDanh: "Tội cố ý gây thương tích (Điều 134 BLHS)",
          biHai: "Nguyễn Văn Nam",
          nguoiKhieuNai: "Nguyễn Văn Nam (Bị hại có đơn khiếu nại)",
          ttv: "Trần Thị Lan",
          ldv: "Lê Thị Thu Hiển",
          tp: "Trần Hồng Hà",
          trangThai: "Chưa xét xử",
          sub: "Đã lên lịch xét xử",
        },
        {
          id: 3,
          soTL: row.thuLyList?.[2]?.so || "54682801",
          ngayTL: "24/07/2026",
          soBA: "020/2026/HS-ST",
          ngayBA: "09/07/2026",
          toaAn: "TAND huyện Phong Điền, TP. Cần Thơ",
          capXX: "Sơ thẩm",
          loaiAn: "Hình sự",
          biCao: "Trần Văn Hải",
          toiDanh: "Tội trộm cắp tài sản (Khoản 2 Điều 173 BLHS)",
          biHai: "Công ty TNHH MTV Vận tải Nam Hà",
          nguoiKhieuNai: "Trần Văn Hải (Bị cáo có đơn đề nghị GĐT)",
          ttv: "Trịnh Thị Minh Trang",
          ldv: "Lê Thị Thu Hiền",
          tp: "Nguyễn Như Thắng",
          trangThai: "Chưa xét xử",
          sub: "Hoãn xét xử",
        },
      ]
      : isHanhChinh
        ? [
          {
            id: 1,
            soTL: row.thuLyList?.[0]?.so || "54682961",
            ngayTL: row.thuLyList?.[0]?.ngay || "28/07/2026",
            soBA: row.soBA || "12/2026/HC-ST",
            ngayBA: row.ngayBA || "14/07/2026",
            toaAn: row.toaAnBA || "TAND tỉnh Bắc Ninh",
            capXX: row.capXX || "Sơ thẩm",
            loaiAn: "Hành chính",
            nguyenDon: "Công ty TNHH Phát triển Đô thị Kinh Bắc",
            qhpl: "Khiếu kiện Quyết định thu hồi đất và phương án bồi thường, hỗ trợ tái định cư",
            biDon: "Chủ tịch UBND tỉnh Bắc Ninh",
            ndd: "Sở TN&MT tỉnh Bắc Ninh",
            ttv: "Lý Văn An",
            ldv: "Phạm Quốc Anh",
            tp: "Lê Thị Thu Hiển",
            trangThai: "Chưa xét xử",
            sub: "Đã lên lịch xét xử",
          },
          {
            id: 2,
            soTL: row.thuLyList?.[1]?.so || "54682962",
            ngayTL: row.thuLyList?.[1]?.ngay || "28/07/2026",
            soBA: "28/2026/HC-PT",
            ngayBA: "18/07/2026",
            toaAn: "TAND cấp cao tại Hà Nội",
            capXX: "Phúc thẩm",
            loaiAn: "Hành chính",
            nguyenDon: "Ông Nguyễn Văn Hùng",
            qhpl: "Khiếu kiện Quyết định xử phạt vi phạm hành chính trong lĩnh vực trật tự xây dựng",
            biDon: "Chủ tịch UBND quận Cầu Giấy, TP. Hà Nội",
            ndd: "Đội QLTT đô thị quận Cầu Giấy",
            ttv: "Vũ Diệu Thúy",
            ldv: "Phạm Quốc Anh",
            tp: "Phạm Thị Bích Ngọc",
            trangThai: "Chưa xét xử",
            sub: "Đã lên lịch xét xử",
          },
        ]
        : isKDTM
          ? [
            {
              id: 1,
              soTL: row.thuLyList?.[0]?.so || "54682501",
              ngayTL: row.thuLyList?.[0]?.ngay || "22/07/2026",
              soBA: row.soBA || "15/2026/KDTM-ST",
              ngayBA: row.ngayBA || "08/07/2026",
              toaAn: row.toaAnBA || "TAND TP. Hà Nội",
              capXX: row.capXX || "Sơ thẩm",
              loaiAn: "KDTM",
              nguyenDon: "Công ty Cổ phần Đầu tư & Xây dựng Sông Đà 9",
              qhpl: "Tranh chấp hợp đồng bảo hiểm công trình xây dựng",
              biDon: "Tổng Công ty Cổ phần Bảo hiểm Bảo Việt",
              ndd: "Chi nhánh Bảo hiểm Bảo Việt Hà Nội",
              ttv: "Nguyễn Văn Tuấn",
              ldv: "Nguyễn Như Thắng",
              tp: "Trần Hồng Hà",
              trangThai: "Chưa xét xử",
              sub: "Đã lên lịch xét xử",
            },
            {
              id: 2,
              soTL: row.thuLyList?.[1]?.so || "54682502",
              ngayTL: row.thuLyList?.[1]?.ngay || "22/07/2026",
              soBA: "22/2026/KDTM-PT",
              ngayBA: "12/07/2026",
              toaAn: "TAND cấp cao tại Hà Nội",
              capXX: "Phúc thẩm",
              loaiAn: "KDTM",
              nguyenDon: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
              qhpl: "Tranh chấp hợp đồng tín dụng trung hạn và xử lý tài sản thế chấp",
              biDon: "Công ty TNHH Xuất nhập khẩu Nam Hải",
              ndd: "Văn phòng Đăng ký Đất đai TP. Hà Nội",
              ttv: "Trịnh Thị Minh Trang",
              ldv: "Nguyễn Như Thắng",
              tp: "Nguyễn Biên Thùy",
              trangThai: "Chưa xét xử",
              sub: "Đã lên lịch xét xử",
            },
          ]
          : [
            {
              id: 1,
              soTL: row.thuLyList?.[0]?.so || "54682424",
              ngayTL: row.thuLyList?.[0]?.ngay || "20/07/2026",
              soBA: row.soBA || "38/2026/DS-ST",
              ngayBA: row.ngayBA || "01/07/2026",
              toaAn: row.toaAnBA || "TAND huyện Phong Điền",
              capXX: row.capXX || "Sơ thẩm",
              loaiAn: "Dân sự",
              nguyenDon: "Trần Văn Hải",
              qhpl: "Tranh chấp hợp đồng vay tài sản và quyền sử dụng đất",
              biDon: "Nguyễn Văn Hùng",
              ndd: "Nguyễn Đơn Hải",
              ttv: "Trịnh Thị Minh Trang",
              ldv: "Lê Thị Thu Hiền",
              tp: "Phạm Thị Bích Ngọc",
              trangThai: "Chưa xét xử",
              sub: "Hoãn xét xử",
            },
            {
              id: 2,
              soTL: row.thuLyList?.[1]?.so || "54682425",
              ngayTL: row.thuLyList?.[1]?.ngay || "20/07/2026",
              soBA: "41/2026/DS-ST",
              ngayBA: "03/07/2026",
              toaAn: "TAND quận Ninh Kiều",
              capXX: "Sơ thẩm",
              loaiAn: "Dân sự",
              nguyenDon: "Lê Thị Mai",
              qhpl: "Tranh chấp chia di sản thừa kế theo pháp luật",
              biDon: "Phạm Quốc Tuấn",
              ndd: "UBND quận Ninh Kiều",
              ttv: "Võ Thị Thùy Giang",
              ldv: "Nguyễn Như Thắng",
              tp: "Lê Thị Thu Hiền",
              trangThai: "Chưa xét xử",
              sub: "Đã lên lịch xét xử",
            },
            {
              id: 3,
              soTL: row.thuLyList?.[2]?.so || "54682426",
              ngayTL: row.thuLyList?.[2]?.ngay || "20/07/2026",
              soBA: "19/2026/HNGĐ-ST",
              ngayBA: "05/07/2026",
              toaAn: "TAND huyện Cờ Đỏ",
              capXX: "Sơ thẩm",
              loaiAn: "Dân sự",
              nguyenDon: "Nguyễn Quốc Huy",
              qhpl: "Tranh chấp phân chia tài sản chung sau khi ly hôn",
              biDon: "Hoàng Thị Thảo",
              ndd: "Lâm Gia Bảo",
              ttv: "Vũ Diệu Thúy",
              ldv: "Phạm Thị Bích Ngọc",
              tp: "Nguyễn Như Thắng",
              trangThai: "Chưa xét xử",
              sub: "Hoãn xét xử",
            },
          ]
  );

  const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set(cases.map(c => c.id)));
  const toggleCase = (id: number) => {
    setSelectedCaseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAllCases = () => {
    if (selectedCaseIds.size === cases.length) setSelectedCaseIds(new Set());
    else setSelectedCaseIds(new Set(cases.map(c => c.id)));
  };

  const JUDGE_INFO: Record<string, { chucVu: string; ngaySinh: string }> = {
    "Nguyễn Biên Thùy": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "12/04/1970" },
    "Lê Thị Thu Hiển": { chucVu: "Phó Vụ trưởng Vụ I", ngaySinh: "25/09/1974" },
    "Phạm Thị Bích Ngọc": { chucVu: "Thẩm tra viên chính", ngaySinh: "18/11/1982" },
    "Nguyễn Như Thắng": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "05/06/1968" },
    "Trần Hồng Hà": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "10/01/1966" },
    "Phạm Quốc Anh": { chucVu: "Phó Vụ trưởng Vụ IV", ngaySinh: "14/03/1975" },
  };

  // Form quyết định
  const [tenBM, setTenBM] = useState("Quyết định thành lập Hội đồng xét xử");
  const [soQD, setSoQD] = useState("");
  const [hauTo, setHauTo] = useState("QĐ-TANDTC");
  const [ngayQD, setNgayQD] = useState("16/07/2026");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("17/07/2026");
  const defaultNguoiKy = row.chuToa && row.chuToa !== "—" ? row.chuToa : "Nguyễn Biên Thùy";
  const [nguoiKy, setNguoiKy] = useState(defaultNguoiKy);
  const [chucVuNguoiKy, setChucVuNguoiKy] = useState(JUDGE_INFO[defaultNguoiKy]?.chucVu || "Thẩm phán TAND Tối cao");
  const [ngaySinhNguoiKy, setNgaySinhNguoiKy] = useState(JUDGE_INFO[defaultNguoiKy]?.ngaySinh || "12/04/1970");
  const [trangThai, setTrangThai] = useState("Dự thảo");
  const [canCu, setCanCu] = useState(
    isHinhSu
      ? `Căn cứ Điều 49 và Điều 77 Luật Tổ chức Tòa án nhân dân năm 2024 đã được sửa đổi, bổ sung một số điều theo Luật số 81/2025/QH15;\nCăn cứ Điều 45, Điều 382 Bộ luật Tố tụng hình sự năm 2015 đã được sửa đổi, bổ sung một số điều;\nXét đề xuất của ${row.donViGui || "Vụ Giám đốc, kiểm tra I"},`
      : isHanhChinh || row.donViGui.includes("IV")
        ? `Căn cứ Điều 49 và Điều 77 Luật Tổ chức Tòa án nhân dân năm 2024 đã được sửa đổi, bổ sung một số điều theo Luật số 81/2025/QH15;\nCăn cứ các điểm a,b khoản 1 Điều 37; các khoản 2 và 4 Điều 266 Luật Tố tụng hành chính năm 2015 đã được sửa đổi, bổ sung một số điều theo Luật số 85/2025/QH15;\nXét đề xuất của ${row.donViGui || "Vụ Giám đốc, kiểm tra IV"},`
        : `Căn cứ Điều 49 và Điều 77 Luật Tổ chức Tòa án nhân dân năm 2024 đã được sửa đổi, bổ sung một số điều theo Luật số 81/2025/QH15;\nCăn cứ Điều 39, Điều 325 Bộ luật Tố tụng dân sự năm 2015 đã được sửa đổi, bổ sung một số điều;\nXét đề xuất của ${row.donViGui || "Vụ Giám đốc, kiểm tra II"},`
  );

  const fullSoQD = soQD ? `${soQD}/${ngayQD ? ngayQD.split("/")[2] || "2026" : "2026"}/${hauTo || "QĐ-TANDTC"}` : "";

  // Các trạng thái tương tác sau khi Lưu quyết định
  const [isSaved, setIsSaved] = useState(false);
  const [isNumberAssigned, setIsNumberAssigned] = useState(false);
  const [isTrinhKy, setIsTrinhKy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cấu hình nơi nhận
  const DEFAULT_NOI_NHAN: NoiNhanItem[] = isHinhSu
    ? [
      { id: 1, loaiNoiNhan: "Viện kiểm sát", chiTiet: "Viện kiểm sát nhân dân tối cao (Vụ 1)", ghiChu: "để tham gia phiên tòa" },
      { id: 2, loaiNoiNhan: "Tòa án nhân dân", chiTiet: "Đ/c Chánh án TANDTC, Phó Chánh án phụ trách", ghiChu: "để báo cáo" },
      { id: 3, loaiNoiNhan: "Tòa án cấp dưới", chiTiet: row.toaAnBA || "TAND cấp cao / TAND nơi ra bản án", ghiChu: "để theo dõi" },
      { id: 4, loaiNoiNhan: "Đương sự / Bị cáo", chiTiet: "Bị cáo, Bị hại có tên trong danh sách xét xử", ghiChu: "để thi hành & triệu tập" },
      { id: 5, loaiNoiNhan: "Lưu trữ", chiTiet: `Lưu: VT, Hồ sơ vụ án (${cases.length} vụ)`, ghiChu: "lưu hồ sơ" },
    ]
    : [
      { id: 1, loaiNoiNhan: "Viện kiểm sát", chiTiet: "Viện kiểm sát nhân dân tối cao", ghiChu: "để phối hợp & tham gia" },
      { id: 2, loaiNoiNhan: "Tòa án nhân dân", chiTiet: "Đ/c Chánh án TANDTC, Phó Chánh án phụ trách", ghiChu: "để báo cáo" },
      { id: 3, loaiNoiNhan: "Tòa án cấp dưới", chiTiet: row.toaAnBA || "Tòa án nơi xét xử sơ thẩm/phúc thẩm", ghiChu: "để biết" },
      { id: 4, loaiNoiNhan: "Đương sự", chiTiet: "Các đương sự có tên trong danh sách", ghiChu: "để thực hiện" },
      { id: 5, loaiNoiNhan: "Lưu trữ", chiTiet: "Lưu: VT, Hồ sơ vụ án", ghiChu: "lưu hồ sơ" },
    ];

  const [noiNhanList, setNoiNhanList] = useState<NoiNhanItem[]>(DEFAULT_NOI_NHAN);
  const [addingNoiNhan, setAddingNoiNhan] = useState(false);
  const [newLoaiNN, setNewLoaiNN] = useState("Viện kiểm sát");
  const [newChiTiet, setNewChiTiet] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [wordZoom, setWordZoom] = useState(100);
  const [wordFontSize, setWordFontSize] = useState("13.5pt");
  const [wordFontFamily, setWordFontFamily] = useState("Times New Roman");

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px",
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: F,
    color: TEXT,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: F,
    background: "#fff",
    cursor: "pointer",
  };

  const sepSt: React.CSSProperties = {
    width: 1,
    height: 18,
    background: BORDER,
    margin: "0 2px",
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    fontSize: 14,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    outline: "none",
    fontFamily: F,
    boxSizing: "border-box" as const,
    background: "#fff",
    color: TEXT,
  };
  const lbl: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: MUTED, display: "block", marginBottom: 3, fontFamily: F };
  const req = <span style={{ color: RED }}>*</span>;

  const handleLaySo = () => {
    const randomNum = Math.floor(Math.random() * 900 + 100);
    setSoQD(String(randomNum));
  };

  const handleAddNoiNhan = () => {
    if (!newChiTiet.trim()) return;
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        loaiNoiNhan: newLoaiNN,
        chiTiet: newChiTiet.trim(),
        ghiChu: newGhiChu.trim() || "–",
      },
    ]);
    setAddingNoiNhan(false);
    setNewChiTiet("");
    setNewGhiChu("");
  };

  const handleDeleteNoiNhan = (id: number) => {
    setNoiNhanList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.48)",
        zIndex: 2100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          width: "min(1040px, 98vw)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 16px 56px rgba(0,0,0,0.25)",
          overflow: "hidden",
          fontFamily: F,
          color: TEXT,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} color={RED} />
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
                Tạo quyết định phân công Hội đồng xét xử
              </span>

            </div>
          </div>
          <Button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              padding: 4,
              display: "flex",
            }}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ── 1. THÔNG TIN CHUNG (CARD GỘP CHUẨN) ── */}
          <div
            style={{
              background: "#f0fdf4",
              border: `1px solid #bbf7d0`,
              borderRadius: 6,
              padding: "10px 16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "6px 16px",
              fontSize: 14,
              fontFamily: F,
            }}
          >
            <div>
              <span style={{ color: MUTED }}>Loại án: </span>
              <span style={{ color: "#0f766e", fontWeight: 700 }}>{row.loaiAn}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Số – Ngày lập DS: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>Số {row.soDS} – {row.ngayDS}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Đơn vị trình: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>{row.donViGui}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Hội đồng xét xử: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>{row.hdxx}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Chủ tọa phiên tòa: </span>
              <span style={{ color: "#0f766e", fontWeight: 700 }}>{row.chuToa || "—"}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Tổng số vụ án: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>{cases.length} vụ án</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Số BA/QĐ: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>
                {row.soBA || "020/2026/HS-ST"} ({row.capXX || "Sơ thẩm"})
              </span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>{row.ngayBA || "09/07/2026"}</span>
            </div>
            <div>
              <span style={{ color: MUTED }}>Tòa án giải quyết: </span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>Tòa án nhân dân tối cao</span>
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <span style={{ color: MUTED }}>Thành phần HĐXX: </span>
              <span style={{ color: "#0f766e", fontWeight: 500 }}>
                {row.thanhPhanHDXX && row.thanhPhanHDXX.length > 0 ? row.thanhPhanHDXX.join(", ") : "—"}
              </span>
            </div>
          </div>

          {/* ── 2. DANH SÁCH XÉT XỬ ĐÃ TẠO TRƯỚC ĐÓ (CÁC VỤ ÁN ÁP DỤNG) ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>
                Danh sách vụ án trong đợt xét xử ({cases.length} vụ)
              </span>
            </div>
            <div style={{ fontSize: 14, color: MUTED }}>
              Đã chọn: <b style={{ color: RED }}>{selectedCaseIds.size}</b>/{cases.length} vụ án áp dụng
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: 36 }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "17%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px", textAlign: "center" }}>
                    <Input
                      type="checkbox"
                      checked={selectedCaseIds.size === cases.length && cases.length > 0}
                      onChange={toggleAllCases}
                      style={{ accentColor: RED, cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px", textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Thông tin Bản án / QĐ</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>
                    {isHinhSu
                      ? "Bị cáo / Bị hại / Người khiếu nại"
                      : isHanhChinh
                        ? "Người khởi kiện / Người bị kiện / Khiếu kiện"
                        : isKDTM
                          ? "Nguyên đơn / Bị đơn / Tranh chấp KDTM"
                          : "Nguyên đơn / Bị đơn / QHPL tranh chấp"}
                  </th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Cán bộ giải quyết</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c, idx) => (
                  <tr
                    key={c.id || idx}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <Input
                        type="checkbox"
                        checked={selectedCaseIds.has(c.id)}
                        onChange={() => toggleCase(c.id)}
                        style={{ accentColor: RED, cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", textAlign: "center", color: MUTED }}>
                      {idx + 1}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px" }}>
                      <div style={{ fontWeight: 700, color: TEXT }}>Số: {c.soTL}</div>
                      <div style={{ color: MUTED, marginTop: 1 }}>Ngày: {c.ngayTL}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px" }}>
                      <div style={{ fontWeight: 600, color: TEXT }}>Số: {formatSoBA(c.soBA)}</div>
                      <div style={{ color: MUTED }}>Ngày: {c.ngayBA} ({c.capXX})</div>
                      <div style={{ color: "#4b5563", fontSize: 10, marginTop: 1 }}>Tại: {c.toaAn}</div>
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px" }}>
                      {isHinhSu || c.loaiAn === "Hình sự" ? (
                        <div>
                          <div>
                            <span style={{ color: MUTED, fontWeight: 600 }}>Bị cáo:</span>{" "}
                            <span style={{ color: RED, fontWeight: 700 }}>{c.biCao || "Hoàng Minh Đức"}</span>
                          </div>
                          {c.toiDanh && (
                            <div style={{ color: "#374151", fontSize: 14, marginTop: 2 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>Tội danh:</span> {c.toiDanh}
                            </div>
                          )}
                          {c.biHai && (
                            <div style={{ color: "#4b5563", fontSize: 14, marginTop: 1 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>Bị hại:</span> {c.biHai}
                            </div>
                          )}
                          {c.nguoiKhieuNai && (
                            <div style={{ color: "#1e40af", fontSize: 14, marginTop: 1 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>Người khiếu nại:</span> {c.nguoiKhieuNai}
                            </div>
                          )}
                        </div>
                      ) : isHanhChinh || c.loaiAn === "Hành chính" ? (
                        <div>
                          <div>
                            <span style={{ color: MUTED, fontWeight: 600 }}>Người khởi kiện:</span>{" "}
                            <span style={{ fontWeight: 700, color: TEXT }}>{c.nguyenDon}</span>
                          </div>
                          <div style={{ marginTop: 2 }}>
                            <span style={{ color: MUTED, fontWeight: 600 }}>Người bị kiện:</span>{" "}
                            <span style={{ fontWeight: 600, color: TEXT }}>{c.biDon}</span>
                          </div>
                          {c.qhpl && (
                            <div style={{ color: "#374151", fontSize: 14, marginTop: 2 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>Nội dung khiếu kiện:</span> {c.qhpl}
                            </div>
                          )}
                          {c.ndd && (
                            <div style={{ color: MUTED, fontSize: 10, marginTop: 1 }}>
                              <span>Người có QLNVLQ: {c.ndd}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div>
                            <span style={{ color: MUTED, fontWeight: 600 }}>Nguyên đơn:</span>{" "}
                            <span style={{ fontWeight: 700, color: TEXT }}>{c.nguyenDon}</span>
                          </div>
                          <div style={{ marginTop: 2 }}>
                            <span style={{ color: MUTED, fontWeight: 600 }}>Bị đơn:</span>{" "}
                            <span style={{ fontWeight: 600, color: TEXT }}>{c.biDon}</span>
                          </div>
                          {c.qhpl && (
                            <div style={{ color: "#374151", fontSize: 14, marginTop: 2 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>QHPL:</span> {c.qhpl}
                            </div>
                          )}
                          {c.ndd && (
                            <div style={{ color: MUTED, fontSize: 10, marginTop: 1 }}>
                              <span>Người có QLNVLQ: {c.ndd}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px" }}>
                      <div><span style={{ color: MUTED }}>TP:</span> {c.tp}</div>
                      <div><span style={{ color: MUTED }}>TTV:</span> {c.ttv}</div>
                      <div><span style={{ color: MUTED }}>LĐV:</span> {c.ldv}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 3. THÔNG TIN QUYẾT ĐỊNH / BIỂU MẪU ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>Thông tin quyết định</span>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Tên biểu mẫu {req}</label>
                <select value={tenBM} onChange={e => setTenBM(e.target.value)} style={inp}>
                  <option>Quyết định thành lập Hội đồng xét xử</option>
                  <option>Quyết định đưa vụ án ra xét xử</option>
                  <option>Quyết định thay đổi thành viên Hội đồng xét xử</option>
                  <option>Thông báo mở phiên tòa xét xử</option>
                </select>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={lbl}>Số quyết định {req}</label>
                </div>
                <Input value={soQD} onChange={e => setSoQD(e.target.value)} placeholder="Nhập số QĐ" style={inp} />
              </div>

              <div>
                <label style={lbl}>Hậu tố {req}</label>
                <Input value={hauTo} onChange={e => setHauTo(e.target.value.toUpperCase())} placeholder="Ví dụ: QĐ-TANDTC" style={inp} />
              </div>

              <div>
                <label style={lbl}>Ngày quyết định {req}</label>
                <Input value={ngayQD} onChange={e => setNgayQD(e.target.value)} placeholder="dd/mm/yyyy" style={inp} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Người ký ban hành {req}</label>
                <select
                  value={nguoiKy}
                  onChange={e => {
                    const val = e.target.value;
                    setNguoiKy(val);
                    if (JUDGE_INFO[val]) {
                      setChucVuNguoiKy(JUDGE_INFO[val].chucVu);
                      setNgaySinhNguoiKy(JUDGE_INFO[val].ngaySinh);
                    }
                  }}
                  style={inp}
                >
                  <option>Nguyễn Biên Thùy</option>
                  <option>Lê Thị Thu Hiển</option>
                  <option>Phạm Thị Bích Ngọc</option>
                  <option>Nguyễn Như Thắng</option>
                  <option>Trần Hồng Hà</option>
                  <option>Phạm Quốc Anh</option>
                </select>
              </div>

              <div>
                <label style={lbl}>Ngày phát hành</label>
                <Input value={ngayPhatHanh} onChange={e => setNgayPhatHanh(e.target.value)} placeholder="dd/mm/yyyy" style={inp} />
              </div>
            </div>

            <div>
              <label style={lbl}>Căn cứ ban hành & Nội dung quyết định</label>
              <textarea
                value={canCu}
                onChange={e => setCanCu(e.target.value)}
                rows={3}
                style={{ ...inp, resize: "vertical" as const, lineHeight: 1.5 }}
                placeholder="Nhập căn cứ pháp lý và nội dung quyết định..."
              />
            </div>
          </div>

          {/* ── 4. CẤU HÌNH NƠI NHẬN ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>Cấu hình nơi nhận</span>
            </div>
            <Button
              htmlType="button"
              onClick={() => setAddingNoiNhan(true)}
              style={{
                padding: "5px 14px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              + Thêm nơi nhận
            </Button>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >

            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 44 }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "38%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: 70 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px", textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Phân loại nơi nhận</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Nơi nhận chi tiết</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px" }}>Ghi chú</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, padding: "8px", textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {noiNhanList.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", textAlign: "center", color: MUTED }}>
                      {idx + 1}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", fontWeight: 600, color: TEXT }}>
                      {item.loaiNoiNhan}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", color: TEXT }}>
                      {item.chiTiet}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", color: MUTED }}>
                      {item.ghiChu}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", textAlign: "center" }}>
                      <Button
                        htmlType="button"
                        onClick={() => handleDeleteNoiNhan(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontFamily: F,
                          fontSize: 14,
                          padding: 2,
                        }}
                      >
                        🗑 Xóa
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* Form thêm mới nơi nhận inline */}
                {addingNoiNhan && (
                  <tr style={{ background: "#fef2f2", borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD_STYLE, fontSize: 14, padding: "8px", textAlign: "center", color: MUTED }}>
                      {noiNhanList.length + 1}
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <select
                        value={newLoaiNN}
                        onChange={e => setNewLoaiNN(e.target.value)}
                        style={{ ...inp, fontSize: 14, padding: "5px 8px" }}
                      >
                        <option>Viện kiểm sát</option>
                        <option>Tòa án nhân dân</option>
                        <option>Tòa án cấp dưới</option>
                        <option>Đương sự / Bị cáo</option>
                        <option>Trại tạm giam / CQĐT</option>
                        <option>Lưu trữ</option>
                        <option>Khác</option>
                      </select>
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <Input
                        value={newChiTiet}
                        onChange={e => setNewChiTiet(e.target.value)}
                        placeholder="Nhập tên cơ quan / đơn vị / cá nhân..."
                        style={{ ...inp, fontSize: 14, padding: "5px 8px" }}
                      />
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <Input
                        value={newGhiChu}
                        onChange={e => setNewGhiChu(e.target.value)}
                        placeholder="Ghi chú (để biết, để thi hành...)"
                        style={{ ...inp, fontSize: 14, padding: "5px 8px" }}
                      />
                    </td>
                    <td style={{ padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <Button
                          htmlType="button"
                          onClick={handleAddNoiNhan}
                          style={{
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 3,
                            padding: "3px 8px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: F,
                          }}
                        >
                          Lưu
                        </Button>
                        <Button
                          htmlType="button"
                          onClick={() => setAddingNoiNhan(false)}
                          style={{
                            background: "#fff",
                            color: MUTED,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 3,
                            padding: "3px 8px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontFamily: F,
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: "12px 22px",
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              htmlType="button"
              onClick={() => setShowPreview(true)}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: "#1e40af",
                border: "1px solid #93c5fd",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              👁 {isSaved ? "Xem biểu mẫu" : "Xem trước dự thảo"}
            </Button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {!isSaved ? (
              <>
                <Button
                  htmlType="button"
                  onClick={onClose}
                  style={{
                    padding: "7px 18px",
                    background: "#fff",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: F,
                    color: TEXT,
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    setIsSaved(true);
                    onAdd({ soQD: fullSoQD, ngayQD, tenBM, nguoiKy, trangThai });
                    showToast("Đã lưu quyết định thành công! Bạn có thể thực hiện Trình ký, Lấy số hoặc Xem biểu mẫu.");
                  }}
                  style={{
                    padding: "7px 24px",
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: F,
                    boxShadow: "0 2px 8px rgba(139,0,0,0.25)",
                  }}
                >
                  Lưu quyết định
                </Button>
              </>
            ) : (
              <>
                {/* Khi đã nhấn Lưu quyết định: Hiển thị Trình ký, Lấy số / Hủy ký số, Xem biểu mẫu, Đóng */}
                <Button
                  htmlType="button"
                  onClick={() => {
                    setIsTrinhKy(true);
                    setTrangThai("Chờ ký duyệt");
                    showToast("Đã gửi trình ký quyết định phân công Hội đồng xét xử thành công!");
                  }}
                  disabled={isTrinhKy}
                  style={{
                    padding: "7px 18px",
                    background: isTrinhKy ? "#cbd5e1" : "#1e40af",
                    color: isTrinhKy ? "#475569" : "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: isTrinhKy ? "default" : "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: F,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  📤 {isTrinhKy ? "Đã trình ký" : "Trình ký"}
                </Button>

                {!isNumberAssigned ? (
                  <Button
                    htmlType="button"
                    onClick={() => {
                      const randomNum = String(Math.floor(Math.random() * 900 + 100));
                      setSoQD(randomNum);
                      setIsNumberAssigned(true);
                      showToast(`Đã lấy số quyết định thành công: ${randomNum}/${ngayQD ? (ngayQD.split("/")[2] || "2026") : "2026"}/${hauTo}`);
                    }}
                    style={{
                      padding: "7px 18px",
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: F,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    🔢 Lấy số
                  </Button>
                ) : (
                  <Button
                    htmlType="button"
                    onClick={() => {
                      setSoQD("");
                      setIsNumberAssigned(false);
                      showToast("Đã hủy ký số quyết định");
                    }}
                    style={{
                      padding: "7px 18px",
                      background: "#fff",
                      color: "#dc2626",
                      border: "1px solid #dc2626",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: F,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    ✕ Hủy ký số
                  </Button>
                )}

                <Button
                  htmlType="button"
                  onClick={() => setShowPreview(true)}
                  style={{
                    padding: "7px 18px",
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: F,
                  }}
                >
                  Xem biểu mẫu
                </Button>

                <Button
                  htmlType="button"
                  onClick={onClose}
                  style={{
                    padding: "7px 18px",
                    background: "#fff",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: F,
                    color: TEXT,
                  }}
                >
                  Đóng
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast thông báo */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#065f46",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: F,
          }}
        >
          <span style={{ fontSize: 16 }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Popup Xem biểu mẫu dạng Word có thể chỉnh sửa trực tiếp */}
      {showPreview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#f1f5f9",
            zIndex: 3500,
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            fontFamily: F,
          }}
        >
          {/* Header Ribbon bar Word Style */}
          <div
            style={{
              background: "#2b579a",
              color: "#fff",
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                onClick={() => setShowPreview(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                ← Quay lại
              </Button>
              <FileText size={20} color="#fff" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Quyết định phân công Hội đồng xét xử.docx</span>
                  <span style={{ fontSize: 14, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>
                    Trang Word có thể chỉnh sửa trực tiếp
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button
                onClick={() => showToast("Đã lưu nội dung văn bản Word thành công!")}
                style={{
                  padding: "7px 20px",
                  background: "#15803d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: F,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                💾 Lưu thay đổi
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}
              >
                <X size={22} />
              </Button>
            </div>
          </div>

          {/* Word Ribbon Formatting Toolbar */}
          <div
            style={{
              background: "#fff",
              borderBottom: `1px solid ${BORDER}`,
              padding: "7px 16px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              flexWrap: "wrap",
              fontSize: 14,
              fontFamily: F,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Undo / Redo */}
            <Button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác (Ctrl+Z)">
              ↩ Hoàn tác
            </Button>
            <Button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại (Ctrl+Y)">
              ↪ Làm lại
            </Button>
            <div style={sepSt} />

            {/* Font Family & Size */}
            <select
              onChange={e => {
                setWordFontFamily(e.target.value);
                execCmd("fontName", e.target.value);
              }}
              value={wordFontFamily}
              style={selectSt}
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Courier New">Courier New</option>
            </select>

            <select
              onChange={e => {
                setWordFontSize(e.target.value);
                execCmd("fontSize", e.target.value === "16pt" ? "4" : e.target.value === "14pt" ? "3" : "3");
              }}
              value={wordFontSize}
              style={selectSt}
            >
              <option value="12pt">12 pt</option>
              <option value="13pt">13 pt</option>
              <option value="13.5pt">13.5 pt</option>
              <option value="14pt">14 pt</option>
              <option value="16pt">16 pt</option>
            </select>
            <div style={sepSt} />

            {/* Text formatting */}
            <Button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm (Ctrl+B)">
              <b>B</b>
            </Button>
            <Button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng (Ctrl+I)">
              <i>I</i>
            </Button>
            <Button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân (Ctrl+U)">
              <u>U</u>
            </Button>
            <Button onClick={() => execCmd("strikeThrough")} style={tbBtnSt} title="Gạch ngang">
              <s>S</s>
            </Button>
            <div style={sepSt} />

            {/* Text alignments */}
            <Button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">
              ⬅
            </Button>
            <Button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">
              ↔
            </Button>
            <Button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">
              ➡
            </Button>
            <Button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều 2 bên">
              ☰
            </Button>
            <div style={sepSt} />

            {/* Lists */}
            <Button onClick={() => execCmd("insertUnorderedList")} style={tbBtnSt} title="Danh sách chấm">
              • Danh sách
            </Button>
            <Button onClick={() => execCmd("insertOrderedList")} style={tbBtnSt} title="Danh sách số">
              1. Danh sách
            </Button>
            <div style={sepSt} />

            {/* In & Tải về */}
            <Button onClick={() => window.print()} style={tbBtnSt}>
              <Printer size={13} /> In
            </Button>
            <Button
              onClick={() => showToast("Đang tải file Word (.docx) về máy tính...")}
              style={{
                ...tbBtnSt,
                background: "#f0fdf4",
                color: "#166534",
                borderColor: "#bbf7d0",
                fontWeight: 600,
              }}
            >
              <Download size={13} /> Tải file Word (.docx)
            </Button>

            {/* Zoom controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 14, color: MUTED }}>
              <span>Thu phóng:</span>
              <Button onClick={() => setWordZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>
                -
              </Button>
              <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>
                {wordZoom}%
              </span>
              <Button onClick={() => setWordZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>
                +
              </Button>
            </div>
          </div>

          {/* Word Document Canvas Container (Scrollable) */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "30px 20px 60px 20px",
              display: "flex",
              justifyContent: "center",
              background: "#cbd5e1",
            }}
          >
            {/* Editable A4 Page Layout */}
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                width: 794,
                minHeight: 1123,
                background: "#fff",
                boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
                padding: "54px 64px",
                boxSizing: "border-box",
                transform: `scale(${wordZoom / 100})`,
                transformOrigin: "top center",
                fontFamily: wordFontFamily,
                color: "#000",
                lineHeight: 1.6,
                fontSize: wordFontSize,
                outline: "none",
                cursor: "text",
              }}
            >
              {/* Header Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontFamily: wordFontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "42%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "13pt" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                      <div style={{ fontSize: "12pt", marginTop: 4 }}>
                        Số: {soQD ? `${soQD}/${ngayQD ? (ngayQD.split("/")[2] || "2026") : "2026"}/${hauTo || "QĐ-TANDTC"}` : "        /QĐ-TANDTC"}
                      </div>
                    </td>
                    <td style={{ width: "58%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "bold", fontSize: "13pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>
                        Độc lập – Tự do – Hạnh phúc
                      </div>
                      <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                        Hà Nội, ngày {ngayQD ? ngayQD.split("/")[0] : "     "} tháng {ngayQD ? ngayQD.split("/")[1] : "   "} năm {ngayQD ? (ngayQD.split("/")[2] || "2026") : "2026"}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Title */}
              <div style={{ textAlign: "center", margin: "24px 0 18px" }}>
                <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>QUYẾT ĐỊNH</div>
                <div style={{ fontSize: "14pt", fontWeight: "bold", marginTop: 4 }}>
                  Phân công Hội đồng xét xử gồm năm Thẩm phán
                </div>
              </div>

              {/* Chánh án */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "13.5pt", marginBottom: 14 }}>
                CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO
              </div>

              {/* Legal bases */}
              <div style={{ textAlign: "justify", lineHeight: 1.6, marginBottom: 14 }}>
                <p style={{ margin: "4px 0", textIndent: "1cm", fontStyle: "italic" }}>
                  Căn cứ Điều 49 và Điều 77 Luật Tổ chức Tòa án nhân dân năm 2024 đã được sửa đổi, bổ sung một số điều theo Luật số 81/2025/QH15;
                </p>
                <p style={{ margin: "4px 0", textIndent: "1cm", fontStyle: "italic" }}>
                  {isHinhSu
                    ? "Căn cứ Điều 45, Điều 382 Bộ luật Tố tụng hình sự năm 2015 đã được sửa đổi, bổ sung một số điều;"
                    : isHanhChinh || row.donViGui.includes("IV")
                      ? "Căn cứ các điểm a,b khoản 1 Điều 37; các khoản 2 và 4 Điều 266 Luật Tố tụng hành chính năm 2015 đã được sửa đổi, bổ sung một số điều theo Luật số 85/2025/QH15;"
                      : "Căn cứ các Điều 39, Điều 325 Bộ luật Tố tụng dân sự năm 2015 đã được sửa đổi, bổ sung một số điều;"}
                </p>
                <p style={{ margin: "4px 0", textIndent: "1cm", fontStyle: "italic" }}>
                  Xét đề xuất của {row.donViGui || "Vụ Giám đốc, kiểm tra IV"},
                </p>
              </div>

              {/* QUYẾT ĐỊNH */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "14pt", margin: "16px 0 10px" }}>
                QUYẾT ĐỊNH
              </div>

              {/* Articles */}
              <div style={{ textAlign: "justify", lineHeight: 1.6 }}>
                <p style={{ margin: "6px 0", textIndent: "1cm" }}>
                  <b>Điều 1.</b> Phân công Hội đồng xét xử gồm các Thẩm phán có tên sau đây:
                </p>
                <div style={{ paddingLeft: "1.2cm", margin: "6px 0" }}>
                  <div>1. Ông/Bà <b>{row.chuToa || "Nguyễn Biên Thùy"}</b>, Thẩm phán Tòa án nhân dân tối cao;</div>
                  <div>2. Ông/Bà <b>{row.thanhPhanHDXX?.[0] || "Ngô Tiến Hùng"}</b>, Thẩm phán Tòa án nhân dân tối cao;</div>
                  <div>3. Ông/Bà <b>{row.thanhPhanHDXX?.[1] || "Ngô Hồng Phúc"}</b>, Thẩm phán Tòa án nhân dân tối cao;</div>
                  <div>4. Ông/Bà <b>{row.thanhPhanHDXX?.[2] || "Lê Thanh Phong"}</b>, Thẩm phán Tòa án nhân dân tối cao;</div>
                  <div>5. Ông/Bà <b>{row.thanhPhanHDXX?.[3] || "Nguyễn Văn Cường"}</b>, Thẩm phán Tòa án nhân dân tối cao.</div>
                </div>
                <p style={{ margin: "6px 0", textIndent: "1cm" }}>
                  Tiến hành xét xử giám đốc thẩm đối với các vụ án theo Chương trình làm việc của Hội đồng xét xử gồm năm Thẩm phán ngày {row.ngayDS || "28/5/2026"}.
                </p>
                <p style={{ margin: "6px 0", textIndent: "1cm" }}>
                  <b>Điều 2.</b> Việc phân công Hội đồng xét xử và phân công Thẩm phán làm Chủ tọa phiên tòa đối với mỗi vụ án được thực hiện theo Chương trình làm việc của Hội đồng xét xử gồm năm Thẩm phán ngày {row.ngayDS || "28/5/2026"} kèm theo Quyết định này./.
                </p>
              </div>

              {/* Recipients & Signature Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 28, fontFamily: wordFontFamily }}>
                <tbody>
                  <tr>
                    <td style={{ width: "52%", verticalAlign: "top", fontSize: "11pt", lineHeight: 1.5 }}>
                      <div style={{ fontWeight: "bold", fontStyle: "italic" }}>Nơi nhận:</div>
                      <div>- Chánh án TANDTC (để b/c);</div>
                      <div>- Viện trưởng VKSNDTC;</div>
                      <div>- VKSNDTC - {isHinhSu ? "Vụ 7" : isHanhChinh || row.donViGui.includes("IV") ? "Vụ 10" : "Vụ 9"};</div>
                      <div>- Các Thẩm phán TANDTC có tên tại Điều 1 Quyết định;</div>
                      <div>- {row.donViGui || "Vụ GĐKT IV"} (để thực hiện);</div>
                      <div>- Lưu: VPTANDTC.</div>
                    </td>
                    <td style={{ width: "48%", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ fontSize: "12pt", fontWeight: "bold" }}>KT. CHÁNH ÁN</div>
                      <div style={{ fontSize: "13pt", fontWeight: "bold" }}>PHÓ CHÁNH ÁN</div>
                      <div style={{ height: 65, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isNumberAssigned && (
                          <div
                            style={{
                              border: "2px solid #dc2626",
                              color: "#dc2626",
                              padding: "4px 12px",
                              borderRadius: 4,
                              fontSize: "10pt",
                              fontWeight: "bold",
                              transform: "rotate(-5deg)",
                              opacity: 0.9,
                            }}
                          >
                            ✓ KÝ BỞI: {nguoiKy || "Nguyễn Biên Thuỳ"}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "13pt", fontWeight: "bold" }}>{nguoiKy || "Nguyễn Biên Thuỳ"}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KyDuyetSuccessModal({
  soDS,
  onClose,
  onTaoQuyetDinh,
}: {
  soDS: string;
  onClose: () => void;
  onTaoQuyetDinh: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: 440,
          maxWidth: "95vw",
          boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
          overflow: "hidden",
          fontFamily: F,
          textAlign: "center",
        }}
      >
        <div style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", padding: "30px 24px 20px" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: 28,
              color: "#fff",
              fontFamily: F,
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: F }}>Ký duyệt thành công!</div>
        </div>
        <div style={{ padding: "22px 24px" }}>
          <p style={{ fontSize: 14, color: TEXT, margin: "0 0 6px", fontFamily: F }}>
            Danh sách xét xử số <b style={{ color: TEXT }}>{soDS}</b>
          </p>
          <p style={{ fontSize: 14, color: MUTED, margin: "0 0 20px", lineHeight: 1.5, fontFamily: F }}>
            đã được ký duyệt và chuyển sang trạng thái <b style={{ color: "#15803d" }}>Đã có hiệu lực</b>. Bạn có thể tiến hành tạo quyết định phân công Hội đồng xét xử.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Button
              onClick={onClose}
              style={{
                padding: "9px 18px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Quay lại danh sách
            </Button>
            <Button
              onClick={onTaoQuyetDinh}
              style={{
                padding: "9px 22px",
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
                boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
              }}
            >
              + Tạo quyết định ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuaDanhSachModal({
  row,
  onClose,
  onSave,
}: {
  row: HDXXRow;
  onClose: () => void;
  onSave: (updatedData: Partial<HDXXRow>) => void;
}) {
  const [showLichPicker, setShowLichPicker] = useState(false);
  const [caseList, setCaseList] = useState([
    {
      id: 1,
      soBA: "5469/2026/HS-ST",
      ngayBA: "03/07/2026",
      toaAn: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
      qhpl: "Tội cố ý gây thương tích (BLHS)",
      nguoiKhoiKien: "Trần Văn Hải",
      nguoiBiKien: "Nguyễn Đơn Hải",
      soKN: "28/QĐ-VKSTC-V1",
      ngayKN: "27/07/2026",
      nguoiKN: "Viện trưởng VKSNDTC",
      chuToa: "Lê Thị Thu Hiển – Chánh án",
      hdxx: "Hội đồng 5 thẩm phán",
      members: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    },
    {
      id: 2,
      soBA: "54681139/2026/HS-PT",
      ngayBA: "03/07/2026",
      toaAn: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
      qhpl: "Tội cố ý gây thương tích hoặc gây tổn hại cho sức khỏe",
      nguoiKhoiKien: "Phan Văn Hùng",
      nguoiBiKien: "Nguyễn Văn Đạt",
      soKN: "11/QĐ-VKSTC-V1",
      ngayKN: "11/11/2024",
      nguoiKN: "Viện trưởng VKSNDTC",
      chuToa: "Nguyễn Trí Tuệ - Phó Chánh án",
      hdxx: "Hội đồng 5 thẩm phán",
      members: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    },
    {
      id: 3,
      soBA: "18/2026/HS-ST",
      ngayBA: "08/07/2026",
      toaAn: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
      qhpl: "Tham ô tài sản nhà nước đặc biệt nghiêm trọng",
      nguoiKhoiKien: "Đỗ Thành Công",
      nguoiBiKien: "Phan Kim Ngân",
      soKN: "05/QĐ-VKSTC-V1",
      ngayKN: "01/05/2026",
      nguoiKN: "Viện trưởng VKSNDTC",
      chuToa: "Lê Thị Thu Hiển – Chánh án",
      hdxx: "Hội đồng toàn thể",
      members: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh", "Phạm Văn Nam"],
    },
    {
      id: 4,
      soBA: "21/2026/DS-ST",
      ngayBA: "03/07/2026",
      toaAn: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
      qhpl: "Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất",
      nguoiKhoiKien: "Ngô Mai Trang",
      nguoiBiKien: "Phạm Văn Thành, Lê Thị Nhài",
      soKN: "15/QĐ-VKSTC-V2",
      ngayKN: "15/06/2026",
      nguoiKN: "Viện trưởng VKSNDTC",
      chuToa: "Phạm Quốc Hưng - Phó Chánh án",
      hdxx: "Hội đồng 5 thẩm phán",
      members: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Phạm Thị Bích Ngọc"],
    },
  ]);

  const handleUpdateChuToa = (id: number, val: string) => {
    setCaseList(prev => prev.map(c => c.id === id ? { ...c, chuToa: val } : c));
  };

  const handleRemoveMember = (id: number, memberName: string) => {
    setCaseList(prev => prev.map(c => c.id === id ? { ...c, members: c.members.filter(m => m !== memberName) } : c));
  };

  const handleDeleteRow = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vụ án này khỏi danh sách xét xử?")) {
      setCaseList(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    onSave({
      chuToa: caseList[0]?.chuToa || row.chuToa,
      thanhPhanHDXX: caseList[0]?.members || row.thanhPhanHDXX,
    });
    alert("Đã lưu cập nhật danh sách vụ xét xử thành công!");
    onClose();
  };

  const TH_POPUP: React.CSSProperties = {
    padding: "10px 12px",
    background: "#f8fafc",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    fontSize: 14,
    fontWeight: 700,
    color: "#374151",
    fontFamily: F,
    textAlign: "left",
  };

  const TD_POPUP: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    fontSize: 14,
    color: TEXT,
    fontFamily: F,
    verticalAlign: "top",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 3500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {showLichPicker && <LichXetXuModal onClose={() => setShowLichPicker(false)} />}
      <div style={{ background: "#fff", width: "95vw", maxWidth: 1280, borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh", fontFamily: F }}>
        {/* Header */}
        <div style={{ padding: "14px 24px", background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#b91c1c", fontWeight: 700, fontSize: 16 }}>⚠️ Danh sách vụ xét xử đã chọn</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              onClick={() => setShowLichPicker(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #93c5fd",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              <Calendar size={14} /> Chọn lịch xét xử
            </Button>
            <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
              <X size={22} />
            </Button>
          </div>
        </div>

        {/* Table Body Container */}
        <div style={{ flex: 1, overflow: "auto", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: 50 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...TH_POPUP, textAlign: "center" }}>STT</th>
                <th style={TH_POPUP}>Thông tin bản án/ Tòa án xét xử</th>
                <th style={TH_POPUP}>Quan hệ pháp luật</th>
                <th style={TH_POPUP}>Người khởi kiện</th>
                <th style={TH_POPUP}>Người bị kiện</th>
                <th style={TH_POPUP}>Kháng nghị</th>
                <th style={TH_POPUP}>Thẩm phán chủ tọa phiên tòa</th>
                <th style={TH_POPUP}>Thẩm phán Hội đồng xét xử</th>
                <th style={{ ...TH_POPUP, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {caseList.map((r, index) => (
                <tr key={r.id} style={{ background: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_POPUP, textAlign: "center", fontWeight: 700, color: MUTED }}>{index + 1}</td>
                  <td style={TD_POPUP}>
                    <div style={{ fontWeight: 700, color: TEXT }}>Số BA: {r.soBA}</div>
                    <div style={{ color: MUTED, marginTop: 2, fontSize: 14 }}>Ngày: {r.ngayBA}</div>
                    <div style={{ color: MUTED, marginTop: 2, fontSize: 14 }}>Tại: {r.toaAn}</div>
                  </td>
                  <td style={TD_POPUP}>
                    <a style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500, cursor: "pointer" }}>
                      {r.qhpl}
                    </a>
                  </td>
                  <td style={TD_POPUP}>
                    <div style={{ fontWeight: 700, color: TEXT }}>{r.nguoiKhoiKien}</div>
                  </td>
                  <td style={TD_POPUP}>
                    <div style={{ color: TEXT }}>{r.nguoiBiKien}</div>
                  </td>
                  <td style={TD_POPUP}>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: MUTED }}>Số KN:</span> <b>{r.soKN}</b>
                    </div>
                    <div style={{ fontSize: 14, color: MUTED, marginTop: 2 }}>Ngày kháng nghị: {r.ngayKN}</div>
                    <div style={{ fontSize: 14, color: MUTED, marginTop: 2 }}>Người kháng nghị: {r.nguoiKN}</div>
                  </td>
                  <td style={TD_POPUP}>
                    <select
                      value={r.chuToa}
                      onChange={e => handleUpdateChuToa(r.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #93c5fd",
                        borderRadius: 6,
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: F,
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Lê Thị Thu Hiển – Chánh án">Lê Thị Thu Hiển – Chánh án</option>
                      <option value="Nguyễn Trí Tuệ - Phó Chánh án">Nguyễn Trí Tuệ - Phó Chánh án</option>
                      <option value="Phạm Quốc Hưng - Phó Chánh án">Phạm Quốc Hưng - Phó Chánh án</option>
                      <option value="Nguyễn Văn Tiến - Phó Chánh án">Nguyễn Văn Tiến - Phó Chánh án</option>
                    </select>
                    <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
                      Chánh án / Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)
                    </div>
                  </td>
                  <td style={TD_POPUP}>
                    <div style={{ border: "1px solid #93c5fd", background: "#f0f9ff", borderRadius: 6, padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e40af" }}>🏛️ {r.hdxx}</span>
                      <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "1px 7px", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
                        {r.members.length} TV ∨
                      </span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      {r.members.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 4,
                            padding: "3px 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: 14,
                            color: "#334155",
                          }}
                        >
                          <span>• {m}</span>
                          <Button
                            onClick={() => handleRemoveMember(r.id, m)}
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 700, padding: 0 }}
                            title="Xóa thành viên"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ ...TD_POPUP, textAlign: "center" }}>
                    <Button
                      onClick={() => handleDeleteRow(r.id)}
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fca5a5",
                        color: "#dc2626",
                        borderRadius: 6,
                        width: 32,
                        height: 32,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Xóa vụ án"
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", background: "#fff", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
            Đã chọn <b>{caseList.length}</b> vụ án xét xử cho danh sách trình ký.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                border: `1px solid ${BORDER}`,
                background: "#fff",
                color: TEXT,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Đóng
            </Button>
            <Button
              onClick={handleSave}
              style={{
                padding: "8px 22px",
                border: "none",
                background: "#800000",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Lưu
            </Button>
            <Button
              onClick={() => alert("Đã lấy số danh sách xét xử thành công!")}
              style={{
                padding: "8px 18px",
                border: `1px solid ${BORDER}`,
                background: "#fff",
                color: TEXT,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Lấy số
            </Button>
            <Button
              onClick={() => alert("Đã trình ký danh sách xét xử thành công!")}
              style={{
                padding: "8px 22px",
                border: "none",
                background: "#800000",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Trình ký
            </Button>
            <Button
              onClick={() => alert("Mở biểu mẫu dự thảo danh sách xét xử...")}
              style={{
                padding: "8px 18px",
                border: `1px solid ${BORDER}`,
                background: "#fff",
                color: TEXT,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Xem biểu mẫu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component Modal Thay đổi Thẩm phán, Hội thẩm, Thư ký trước khi mở phiên tòa ──────────

export function ThayTheThamPhanModal({
  row,
  onClose,
  onSave,
}: {
  row?: any;
  onClose: () => void;
  onSave?: (data: any) => void;
}) {
  const [ngayQD, setNgayQD] = useState("");
  const [soQD, setSoQD] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [xetThay, setXetThay] = useState("");
  const [vksNhan, setVksNhan] = useState("Viện kiểm sát nhân dân tối cao - Hà Nội");
  const [noiNhanKhac, setNoiNhanKhac] = useState("");
  const [thayTheTheoQD, setThayTheTheoQD] = useState("");
  const [thayTheCho, setThayTheCho] = useState("");
  const [vaiTro, setVaiTro] = useState("");
  const [nguoiDuocPhanCong, setNguoiDuocPhanCong] = useState("");

  const [assignmentList, setAssignmentList] = useState<
    Array<{ id: number; vaiTro: string; nguoiPhanCong: string; nguoiThayThe: string }>
  >([]);

  const handleAddAssignment = () => {
    if (!vaiTro && !nguoiDuocPhanCong) return;
    setAssignmentList(prev => [
      ...prev,
      {
        id: Date.now(),
        vaiTro: vaiTro || "Thẩm phán",
        nguoiPhanCong: nguoiDuocPhanCong || "Nguyễn Văn C",
        nguoiThayThe: thayTheCho || "Nguyễn Văn A",
      },
    ]);
    setVaiTro("");
    setNguoiDuocPhanCong("");
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ngayQD,
        soQD,
        nguoiKy,
        xetThay,
        vksNhan,
        noiNhanKhac,
        thayTheTheoQD,
        thayTheCho,
        assignmentList,
      });
    }
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 900, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const, fontFamily: F }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚖️</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Thay đổi Thẩm phán, Hội thẩm, Thư ký trước khi mở phiên tòa
            </span>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></Button>
        </div>

        {/* Info Card */}
        <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: F }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr", gap: "6px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div><span style={{ color: MUTED }}>Mã vụ án : </span><b style={{ color: "#16a34a" }}>{row?.maVuAn || "VA26-001388"}</b></div>
              <div><span style={{ color: MUTED }}>Tên vụ án : </span><b style={{ color: "#16a34a" }}>{row?.tenVuAn || "Vụ án Nguyễn Minh Châu - giết người"}</b></div>
              <div><span style={{ color: MUTED }}>Tên bị can đầu vụ : </span><b style={{ color: "#16a34a" }}>{row?.biCao || "Nguyễn Minh Châu"}</b></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div><span style={{ color: MUTED }}>Giai đoạn : </span><span style={{ color: "#059669" }}>{row?.giaiDoan || "Sơ thẩm"}</span></div>
              <div><span style={{ color: MUTED }}>Số thụ lý : </span><b>{row?.soThuLy || "54680390/2026/TLST-HS ngày 06/01/2026"}</b></div>
              <div><span style={{ color: MUTED }}>Tòa án giải quyết : </span><span style={{ color: "#059669" }}>{row?.toaAnGiaiQuyet || "Tòa án nhân dân tối cao"}</span></div>
              <div><span style={{ color: MUTED }}>Tội danh : </span><span>{row?.toiDanh || "Tội giết người (123-BLHS)"}</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div><span style={{ color: MUTED }}>Trạng thái : </span><span style={{ color: "#2563eb", fontWeight: 600 }}>{row?.trangThai || "Chưa giải quyết xong"}</span></div>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {/* Row 1: Ngày QD, Số QD, Người ký */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Ngày quyết định</label>
              <Input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} placeholder="Chọn ngày" style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Số quyết định</label>
              <Input placeholder="Nhập số quyết định" value={soQD} onChange={e => setSoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                <span style={{ color: RED }}>* </span>Người ký ban hành
              </label>
              <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Người ký</option>
                <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển - Chánh án</option>
                <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy - Thẩm phán</option>
                <option value="Trần Hồng Hà">Trần Hồng Hà - Thẩm phán</option>
              </select>
            </div>
          </div>

          {/* Row 2: Xét thấy */}
          <div>
            <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Xét thấy</label>
            <textarea
              placeholder="Xét thấy"
              value={xetThay}
              onChange={e => setXetThay(e.target.value)}
              style={{ width: "100%", minHeight: 70, padding: "8px 12px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          {/* Row 3: Viện kiểm sát nhận, Nơi nhận khác */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Viện kiểm sát nhận</label>
              <select value={vksNhan} onChange={e => setVksNhan(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="Viện kiểm sát nhân dân tối cao - Hà Nội">Viện kiểm sát nhân dân tối cao - Hà Nội</option>
                <option value="VKSND tỉnh Long An">VKSND tỉnh Long An</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Nơi nhận khác</label>
              <Input placeholder="Nhập nơi nhận khác" value={noiNhanKhac} onChange={e => setNoiNhanKhac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Row 4: Thay thế theo quyết định, Thay thế cho Ông/Bà */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                <span style={{ color: RED }}>* </span>Thay thế theo quyết định
              </label>
              <select value={thayTheTheoQD} onChange={e => setThayTheTheoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Thay thế theo quyết định</option>
                <option value="QĐ 01/2026/QĐ-HDXX">QĐ 01/2026/QĐ-HDXX - Phân công HĐXX</option>
                <option value="QĐ 02/2026/QĐ-TTTP">QĐ 02/2026/QĐ-TTTP - Thay thế Thẩm phán</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Thay thế cho Ông/Bà</label>
              <select value={thayTheCho} onChange={e => setThayTheCho(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Thay thế cho Ông/Bà</option>
                <option value="Nguyễn Văn A">Nguyễn Văn A - Thẩm phán chủ tọa</option>
                <option value="Trần Thị B">Trần Thị B - Hội thẩm nhân dân</option>
              </select>
            </div>
          </div>

          {/* Row 5: Vai trò, Tên người được phân công + Button thêm */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: "35%" }}>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Vai trò</label>
              <select value={vaiTro} onChange={e => setVaiTro(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Vai trò</option>
                <option value="Thẩm phán - Chủ tọa phiên tòa">Thẩm phán - Chủ tọa phiên tòa</option>
                <option value="Thẩm phán">Thẩm phán</option>
                <option value="Hội thẩm nhân dân">Hội thẩm nhân dân</option>
                <option value="Thư ký phiên tòa">Thư ký phiên tòa</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 14, color: MUTED, marginBottom: 4 }}>Tên người được phân công</label>
              <select value={nguoiDuocPhanCong} onChange={e => setNguoiDuocPhanCong(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Chọn người được phân công</option>
                <option value="Nguyễn Văn C">Nguyễn Văn C</option>
                <option value="Lê Văn D">Lê Văn D</option>
                <option value="Trần Thị E">Trần Thị E</option>
              </select>
            </div>
            <Button
              htmlType="button"
              onClick={handleAddAssignment}
              style={{
                width: 34,
                height: 34,
                background: "#800000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ↓
            </Button>
          </div>

          {/* Table: Danh sách phân công thay thế */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginTop: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 50 }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: 80 }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ ...TH_STYLE, fontSize: 14, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_STYLE, fontSize: 14 }}>Vai trò</th>
                  <th style={{ ...TH_STYLE, fontSize: 14 }}>Người được phân công</th>
                  <th style={{ ...TH_STYLE, fontSize: 14 }}>Người được thay thế</th>
                  <th style={{ ...TH_STYLE, fontSize: 14, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {assignmentList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "20px 0", textAlign: "center", color: MUTED, fontSize: 14 }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  assignmentList.map((item, idx) => (
                    <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                      <td style={{ ...TD_STYLE, fontWeight: 500 }}>{item.vaiTro}</td>
                      <td style={{ ...TD_STYLE, color: TEXT }}>{item.nguoiPhanCong}</td>
                      <td style={{ ...TD_STYLE, color: MUTED }}>{item.nguoiThayThe}</td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <Button
                          htmlType="button"
                          onClick={() => setAssignmentList(prev => prev.filter(x => x.id !== item.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14 }}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", gap: 12, background: "#fff" }}>
          <Button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F, color: TEXT }}>
            Đóng
          </Button>
          <Button onClick={handleSave} style={{ padding: "7px 24px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
}

function HDXXDetailView({
  row,
  onBack,
  isChoKyDuyet = false,
  onKyDuyet,
}: {
  row: HDXXRow;
  onBack: () => void;
  isChoKyDuyet?: boolean;
  onKyDuyet?: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"thong-tin" | "phan-cong">("thong-tin");
  const [showLichXX, setShowLichXX] = useState(false);
  const [showKySuccess, setShowKySuccess] = useState(false);
  const [showThemBM, setShowThemBM] = useState(false);
  const [showThemBMMenu, setShowThemBMMenu] = useState(false);
  const [showThongBaoVKSModal, setShowThongBaoVKSModal] = useState(false);
  const [showThayTheThamPhanModal, setShowThayTheThamPhanModal] = useState(false);
  const [selectedQuyetDinhType, setSelectedQuyetDinhType] = useState("thanh-lap-hdxx");
  const [showSuaDSModal, setShowSuaDSModal] = useState(false);
  const [isSigned, setIsSigned] = useState(row.hdxxSub === "Đã có hiệu lực");
  const [editChuToa, setEditChuToa] = useState(row.chuToa);
  const [editHDXX, setEditHDXX] = useState(row.hdxx);
  const [editMembers, setEditMembers] = useState(row.thanhPhanHDXX ? row.thanhPhanHDXX.join(", ") : "");
  const [ghiChu, setGhiChu] = useState("");
  const [qdRows, setQdRows] = useState(QD_ROWS);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "9px 12px", fontFamily: F, color: "#374151" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "10px 12px", verticalAlign: "middle", fontFamily: F, color: TEXT };

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    padding: "9px 20px",
    fontSize: 14,
    fontFamily: F,
    fontWeight: active ? 700 : 400,
    color: active ? RED : MUTED,
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 0.15s",
  });

  const inpEdit: React.CSSProperties = {
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    padding: "7px 10px",
    fontSize: 14,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    background: "#fff",
  };

  const isSigningMode = isChoKyDuyet && !isSigned;

  return (
    <div style={{ flex: 1, overflow: "auto", background: BG, fontFamily: F, color: TEXT, paddingBottom: isSigningMode ? 80 : 0 }}>
      {showSuaDSModal && (
        <SuaDanhSachModal
          row={row}
          onClose={() => setShowSuaDSModal(false)}
          onSave={updatedData => {
            if (updatedData.chuToa) setEditChuToa(updatedData.chuToa);
            if (updatedData.hdxx) setEditHDXX(updatedData.hdxx);
            if (updatedData.thanhPhanHDXX) setEditMembers(updatedData.thanhPhanHDXX.join(", "));
          }}
        />
      )}
      {showLichXX && <LichXetXuModal onClose={() => setShowLichXX(false)} />}
      {showThayTheThamPhanModal && (
        <ThayTheThamPhanModal
          row={row}
          onClose={() => setShowThayTheThamPhanModal(false)}
          onSave={newBm =>
            setQdRows(prev => [
              {
                id: prev.length + 1,
                tenBM: "Quyết định thay thế thẩm phán",
                soQD: newBm.soQD || "QĐ-02/2026",
                ngayQD: newBm.ngayQD || "10/08/2026",
                nguoiKy: newBm.nguoiKy || "Lê Thị Thu Hiển",
                trangThai: "Khởi tạo",
              },
              ...prev,
            ])
          }
        />
      )}
      {showThemBM && (
        <ThemBieuMauModal
          row={row}
          onClose={() => setShowThemBM(false)}
          onAdd={bm => setQdRows(prev => [{ id: prev.length + 1, ...bm }, ...prev])}
        />
      )}
      {showKySuccess && (
        <KyDuyetSuccessModal
          soDS={row.soDS}
          onClose={() => {
            setShowKySuccess(false);
            onKyDuyet?.(row.id);
            onBack();
          }}
          onTaoQuyetDinh={() => {
            setShowKySuccess(false);
            setIsSigned(true);
            onKyDuyet?.(row.id);
            setShowThemBM(true);
          }}
        />
      )}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 8 }}>
          Trang chủ / Quản lý án GĐT/TT / Phân công HĐXX / <span style={{ color: TEXT }}>Chi tiết phân công</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isSigningMode ? 12 : 16 }}>
          <Button
            onClick={onBack}
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ←
          </Button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Phân công hội đồng xét xử
          </h1>
        </div>

        {/* ── Banner trạng thái ── */}
        {isSigningMode ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, marginTop: 1 }}>⏳</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", fontFamily: F }}>
                Hồ sơ đang chờ ký duyệt
              </div>
              <div style={{ fontSize: 14, color: "#78350f", fontFamily: F, marginTop: 2 }}>
                Danh sách xét xử số <b>{row.soDS}</b> đã được trình lên. Bạn có thể kiểm tra, chỉnh sửa thông tin HĐXX và
                ký duyệt. Quyết định phân công HĐXX sẽ được tạo sau khi ký duyệt thành công.
              </div>
            </div>
            <span
              style={{
                padding: "3px 10px",
                background: "#fef3c7",
                color: "#92400e",
                border: "1px solid #f59e0b",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
                flexShrink: 0,
              }}
            >
              Chờ ký duyệt
            </span>
          </div>
        ) : isSigned ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 8,
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 16, color: "#16a34a", fontWeight: 700 }}>✓</span>
            <div style={{ fontSize: 14, color: "#15803d", fontFamily: F, flex: 1 }}>
              Danh sách xét xử số <b>{row.soDS}</b> đã được ký duyệt <b>(Đã có hiệu lực)</b>. Bạn có thể thêm hoặc quản lý
              các quyết định phân công Hội đồng xét xử phía dưới.
            </div>
            <span
              style={{
                padding: "3px 10px",
                background: "#dcfce7",
                color: "#15803d",
                border: "1px solid #86efac",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Đã có hiệu lực
            </span>
          </div>
        ) : null}

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, gap: 4 }}>
          <Button style={TAB_STYLE(activeTab === "thong-tin")} onClick={() => setActiveTab("thong-tin")}>
            Thông tin Danh sách xét xử
          </Button>
        </div>
      </div>

      <div style={{ padding: "20px 28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ── Tab 1: Thông tin Danh sách xét xử ── */}
        {activeTab === "thong-tin" && (
          <>
            <div
              style={{
                padding: "10px 16px",
                background: "#f8fafc",
                borderBottom: `1px solid ${BORDER}`,
                fontWeight: 700,
                fontSize: 14,
                color: RED,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >

              <Button
                onClick={() => setShowSuaDSModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  background: "#fff",
                  color: RED,
                  border: `1px solid ${RED}`,
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                ✏️ Sửa thông tin
              </Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* CỘT 1: Thông tin danh sách xét xử */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >


                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderBottom: `1px solid ${BORDER}`,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Số – Ngày lập danh sách
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: TEXT,
                          fontFamily: F,
                          borderBottom: `1px solid ${BORDER}`,
                          fontWeight: 600,
                        }}
                      >
                        Số {row.soDS} – {row.ngayDS}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderBottom: `1px solid ${BORDER}`,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Tòa án giải quyết
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: TEXT,
                          fontFamily: F,
                          borderBottom: `1px solid ${BORDER}`,
                          fontWeight: 600,
                        }}
                      >
                        Tòa án nhân dân tối cao
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Đơn vị trình ký
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: TEXT,
                          fontFamily: F,
                          fontWeight: 600,
                        }}
                      >
                        {row.donViGui}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* CỘT 2: Thông tin Lịch xét xử */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >


                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>

                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderBottom: `1px solid ${BORDER}`,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Thời gian xét xử
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: isSigned ? "#166534" : MUTED,
                          fontFamily: F,
                          borderBottom: `1px solid ${BORDER}`,
                          fontWeight: isSigned ? 700 : 400,
                        }}
                      >
                        {isSigned ? "📅 08:30 – Ngày 15/08/2026" : "—"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderBottom: `1px solid ${BORDER}`,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Địa điểm / Phòng xử
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: isSigned ? TEXT : MUTED,
                          fontFamily: F,
                          borderBottom: `1px solid ${BORDER}`,
                          fontWeight: isSigned ? 600 : 400,
                        }}
                      >
                        {isSigned ? "Phòng xử án số 02 – Tòa án nhân dân tối cao" : "—"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: MUTED,
                          fontFamily: F,
                          background: BG,
                          borderRight: `1px solid ${BORDER}`,
                          width: "35%",
                          fontWeight: 500,
                        }}
                      >
                        Hình thức xét xử
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          color: isSigned ? TEXT : MUTED,
                          fontFamily: F,
                          fontWeight: isSigned ? 500 : 400,
                        }}
                      >
                        {isSigned ? "Trực tiếp tại trụ sở TANDTC" : "—"}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

            </div>

            {/* Danh sách vụ xét xử table */}
            {(() => {
              const isHinhSu = row.loaiAn === "Hình sự" || row.donViGui.includes("I (") || row.donViGui.includes("Hình sự");
              const isHanhChinh = row.loaiAn === "Hành chính" || row.donViGui.includes("IV (") || row.donViGui.includes("Hành chính");
              const loaiAnDisplay = isHinhSu ? "Hình sự" : isHanhChinh ? "Hành chính" : row.loaiAn || "Dân sự";

              const cases = row.danhSachVuAn || (
                isHinhSu
                  ? [
                    {
                      id: 1,
                      soTL: row.thuLyList?.[0]?.so || "54682801",
                      ngayTL: row.thuLyList?.[0]?.ngay || "24/07/2026",
                      soBA: row.soBA || "020/2026/HS-ST",
                      ngayBA: row.ngayBA || "09/07/2026",
                      toaAn: row.toaAnBA || "TAND huyện Phong Điền, TP. Cần Thơ",
                      capXX: row.capXX || "Sơ thẩm",
                      loaiAn: "Hình sự",
                      biCao: "Trần Văn Hải",
                      toiDanh: "Trộm cắp tài sản (Khoản 2 Điều 173 BLHS)",
                      biHai: "Công ty TNHH MTV Vận tải Nam Hà",
                      nguoiKhieuNai: "Trần Văn Hải (Bị cáo có đơn đề nghị GĐT)",
                      ttv: "Trịnh Thị Minh Trang",
                      ldv: "Lê Thị Thu Hiền",
                      tp: "Nguyễn Như Thắng",
                      trangThai: "Chưa xét xử",
                      sub: "Đã lên lịch xét xử",
                    },
                  ]
                  : isHanhChinh
                    ? [
                      {
                        id: 1,
                        soTL: row.thuLyList?.[0]?.so || "54682961",
                        ngayTL: row.thuLyList?.[0]?.ngay || "28/07/2026",
                        soBA: row.soBA || "12/2026/HC-ST",
                        ngayBA: row.ngayBA || "14/07/2026",
                        toaAn: row.toaAnBA || "TAND tỉnh Bắc Ninh",
                        capXX: row.capXX || "Sơ thẩm",
                        loaiAn: "Hành chính",
                        nguyenDon: "Công ty TNHH Phát triển Đô thị Kinh Bắc",
                        qhpl: "Khiếu kiện Quyết định thu hồi đất và bồi thường",
                        biDon: "Chủ tịch UBND tỉnh Bắc Ninh",
                        ndd: "Sở TN&MT tỉnh Bắc Ninh",
                        ttv: "Lý Văn An",
                        ldv: "Phạm Quốc Anh",
                        tp: "Lê Thị Thu Hiển",
                        trangThai: "Chưa xét xử",
                        sub: "Đã lên lịch xét xử",
                      },
                    ]
                    : [
                      {
                        id: 1,
                        soTL: row.thuLyList?.[0]?.so || "54682810",
                        ngayTL: row.thuLyList?.[0]?.ngay || "25/07/2026",
                        soBA: row.soBA || "45/2026/DS-ST",
                        ngayBA: row.ngayBA || "11/07/2026",
                        toaAn: row.toaAnBA || "TAND quận Cầu Giấy, TP. Hà Nội",
                        capXX: row.capXX || "Sơ thẩm",
                        loaiAn: row.loaiAn || "Dân sự",
                        nguyenDon: "Phạm Văn Cường",
                        qhpl: "Tranh chấp quyền sử dụng đất",
                        biDon: "Nguyễn Thị Thanh Hà",
                        ndd: "UBND quận Cầu Giấy",
                        ttv: "Nguyễn Thu Hằng",
                        ldv: "Phạm Thị Bích Ngọc",
                        tp: "Nguyễn Biên Thùy",
                        trangThai: "Chưa xét xử",
                        sub: "Đã lên lịch xét xử",
                      },
                    ]
              );

              const thThongTin = isHinhSu
                ? "Thông tin bản án / Quyết định"
                : isHanhChinh
                  ? "Thông tin bản án / QĐ & Khiếu kiện"
                  : "Thông tin bản án/ QĐ & QHPL";

              const thDuongSu = isHinhSu
                ? "Bị cáo / Bị hại / Người khiếu nại"
                : isHanhChinh
                  ? "Người khởi kiện / Người bị kiện"
                  : "Nguyên đơn / Bị đơn / QHPL";

              return (
                <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
                      ⚖ Danh sách các vụ án trình phê duyệt
                    </span>
                    <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
                      Loại án: <b style={{ color: RED }}>{loaiAnDisplay}</b>
                    </span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                      <col style={{ width: 32 }} />
                      <col style={{ width: 36 }} />
                      <col style={{ width: "11%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "11%" }} />
                      <col style={{ width: 44 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={TH}>
                          <Input type="checkbox" style={{ accentColor: RED }} />
                        </th>
                        {["STT", "Số & Ngày thụ lý XX", thThongTin, thDuongSu, "Phân công TTV/TP", "Chủ tọa & HĐXX", "Trạng thái", "Thao tác"].map(
                          h => (
                            <th key={h} style={{ ...TH_STYLE, fontSize: 14, padding: "9px 12px" }}>
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((r, i) => (
                        <tr key={r.id || i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", verticalAlign: "top" }}>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <Input type="checkbox" style={{ accentColor: RED }} />
                          </td>
                          <td
                            style={{
                              ...TD_STYLE,
                              fontSize: 14,
                              padding: "12px",
                              textAlign: "center",
                              color: MUTED,
                              verticalAlign: "top",
                            }}
                          >
                            {i + 1}
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>Số: {r.soTL}</div>
                            <div style={{ color: MUTED, fontFamily: F, marginTop: 2 }}>Ngày: {r.ngayTL}</div>
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            <div style={{ fontFamily: F, color: TEXT }}>Số BA: {formatSoBA(r.soBA)}</div>
                            <div style={{ fontFamily: F, color: TEXT }}>Ngày: {r.ngayBA}</div>
                            <div style={{ fontFamily: F, color: MUTED, marginTop: 2 }}>Tại: {r.toaAn}</div>
                            <div style={{ fontFamily: F, fontSize: 14, color: "#1e40af", marginTop: 2 }}>Cấp: {r.capXX}</div>
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            {isHinhSu || r.loaiAn === "Hình sự" ? (
                              <>
                                <div style={{ fontFamily: F, fontSize: 14 }}>
                                  <span style={{ color: MUTED, fontWeight: 600 }}>Bị cáo:</span>{" "}
                                  <span style={{ color: RED, fontWeight: 700 }}>{r.biCao || "Trần Văn Hải"}</span>
                                </div>
                                {r.toiDanh && (
                                  <div style={{ fontFamily: F, fontSize: 14, color: "#374151", marginTop: 3 }}>
                                    <span style={{ color: MUTED, fontWeight: 600 }}>Tội danh:</span> {r.toiDanh}
                                  </div>
                                )}
                                {r.biHai && (
                                  <div style={{ fontFamily: F, fontSize: 14, marginTop: 3 }}>
                                    <span style={{ color: MUTED, fontWeight: 600 }}>Bị hại:</span>{" "}
                                    <span style={{ color: TEXT }}>{r.biHai}</span>
                                  </div>
                                )}
                                {r.nguoiKhieuNai && (
                                  <div style={{ fontFamily: F, fontSize: 14, marginTop: 3 }}>
                                    <span style={{ color: MUTED, fontWeight: 600 }}>Người khiếu nại:</span>{" "}
                                    <span style={{ color: "#1e40af", fontWeight: 600 }}>{r.nguoiKhieuNai}</span>
                                  </div>
                                )}
                              </>
                            ) : isHanhChinh || r.loaiAn === "Hành chính" ? (
                              <>
                                <div style={{ fontFamily: F, fontSize: 14 }}>
                                  <span style={{ color: MUTED, fontWeight: 600 }}>Người khởi kiện:</span>{" "}
                                  <span style={{ color: TEXT, fontWeight: 700 }}>{r.nguyenDon}</span>
                                </div>
                                {r.qhpl && (
                                  <div style={{ fontFamily: F, fontSize: 14, color: MUTED, marginTop: 2 }}>
                                    <b>Khiếu kiện:</b> {r.qhpl}
                                  </div>
                                )}
                                <div style={{ fontFamily: F, fontSize: 14, marginTop: 2 }}>
                                  <span style={{ color: MUTED, fontWeight: 600 }}>Người bị kiện:</span>{" "}
                                  <span style={{ color: TEXT }}>{r.biDon}</span>
                                </div>
                                {r.ndd && (
                                  <div style={{ fontFamily: F, fontSize: 14, marginTop: 2, color: "#4b5563" }}>
                                    <span style={{ color: MUTED, fontWeight: 600 }}>NQLNVLQ:</span> {r.ndd}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div style={{ fontFamily: F, fontSize: 14 }}>
                                  <span style={{ color: MUTED, fontWeight: 600 }}>Nguyên đơn:</span>{" "}
                                  <span style={{ color: TEXT, fontWeight: 700 }}>{r.nguyenDon}</span>
                                </div>
                                {r.qhpl && (
                                  <div style={{ fontFamily: F, fontSize: 14, color: MUTED, marginTop: 2 }}>
                                    <b>QHPL:</b> {r.qhpl}
                                  </div>
                                )}
                                <div style={{ fontFamily: F, fontSize: 14, marginTop: 2 }}>
                                  <span style={{ color: MUTED, fontWeight: 600 }}>Bị đơn:</span>{" "}
                                  <span style={{ color: TEXT }}>{r.biDon}</span>
                                </div>
                                {r.ndd && (
                                  <div style={{ fontFamily: F, fontSize: 14, marginTop: 2, color: "#4b5563" }}>
                                    <span style={{ color: MUTED, fontWeight: 600 }}>NQLNVLQ/NĐĐ:</span> {r.ndd}
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            <div style={{ fontFamily: F, fontSize: 14 }}>
                              <span style={{ color: MUTED }}>TTV:</span> <span style={{ color: TEXT }}>{r.ttv}</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 14, marginTop: 2 }}>
                              <span style={{ color: MUTED }}>LĐV:</span> <span style={{ color: TEXT }}>{r.ldv}</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 14, marginTop: 2 }}>
                              <span style={{ color: MUTED }}>TPTC:</span> <span style={{ color: TEXT }}>{r.tp}</span>
                            </div>
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            <div style={{ fontFamily: F, fontSize: 14 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>Chủ tọa:</span>{" "}
                              <span style={{ color: "#92400e", fontWeight: 700 }}>{(r as any).chuToa || editChuToa || "Nguyễn Biên Thùy"}</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 14, color: TEXT, marginTop: 3 }}>
                              <span style={{ color: MUTED, fontWeight: 600 }}>HĐXX:</span>{" "}
                              <span style={{ fontWeight: 600 }}>{(r as any).hdxx || editHDXX || "Hội đồng 5 thẩm phán"}</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 14, color: "#4b5563", marginTop: 2, lineHeight: 1.3 }}>
                              <span style={{ color: MUTED }}>Thành viên:</span> {(r as any).thanhVien || editMembers || "Lê Thị Thu Hiển, Phạm Thị Bích Ngọc"}
                            </div>
                          </td>
                          <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", verticalAlign: "top" }}>
                            <Badge color="#065f46" bg="#d1fae5">
                              {r.trangThai}
                            </Badge>
                            <div style={{ fontFamily: F, color: MUTED, marginTop: 4, fontSize: 14 }}>{r.sub}</div>
                            {r.extra && <div style={{ fontFamily: F, color: RED, fontSize: 14, marginTop: 2 }}>{r.extra}</div>}
                          </td>
                          <td
                            style={{
                              ...TD_STYLE,
                              fontSize: 14,
                              padding: "12px",
                              textAlign: "center",
                              verticalAlign: "top",
                            }}
                          >
                            <Button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}>
                              <MoreVertical size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* ── Quyết định/Thông báo ── */}
            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
                  Quyết định/Thông báo
                </span>
                <div style={{ position: "relative" }}>
                  <Button
                    onClick={() => setShowThemBMMenu(!showThemBMMenu)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: RED,
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: F,
                    }}
                  >
                    + Thêm biểu mẫu
                  </Button>
                  {showThemBMMenu && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 9 }}
                        onClick={() => setShowThemBMMenu(false)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: 4,
                          background: "#fff",
                          border: `1px solid ${BORDER}`,
                          borderRadius: 4,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          zIndex: 10,
                          minWidth: 260,
                          padding: "4px 0",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          onClick={() => {
                            setShowThemBM(true);
                            setShowThemBMMenu(false);
                          }}
                          style={{
                            padding: "10px 16px",
                            cursor: "pointer",
                            fontSize: 14,
                            color: TEXT,
                            fontFamily: F,
                            borderBottom: `1px solid ${BORDER}`,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                          Quyết định phân công HĐXX
                        </div>
                        <div
                          onClick={() => {
                            setShowThongBaoVKSModal(true);
                            setShowThemBMMenu(false);
                          }}
                          style={{
                            padding: "10px 16px",
                            cursor: "pointer",
                            fontSize: 14,
                            color: TEXT,
                            fontFamily: F,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                          Thông báo VKS tham gia phiên tòa
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 44 }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "14%" }} />
                    <col />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: 80 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      {["STT", "Số quyết định", "Ngày quyết định", "Tên biểu mẫu", "Người ký", "Trạng thái văn bản", "Thao tác"].map(
                        h => (
                          <th key={h} style={TH}>
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {qdRows.map((r, i) => (
                      <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED }}>{i + 1}</td>
                        <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.soQD}</td>
                        <td style={TD}>{r.ngayQD}</td>
                        <td style={TD}>{r.tenBM}</td>
                        <td style={TD}>{r.nguoiKy}</td>
                        <td style={{ ...TD, color: TEXT, fontWeight: 500 }}>
                          {r.trangThai === "Đã có hiệu lực" ? "Đã ký" : "Dự thảo"}
                        </td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
                            <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <Eye size={15} color="#2563eb" />
                            </Button>
                            <Button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <Edit2 size={14} color="#2563eb" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderTop: `1px solid ${BORDER}`,
                  }}
                >
                  <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
                    1-{qdRows.length} trên {qdRows.length} mặt hàng
                  </span>
                  <Button
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: MUTED,
                      fontSize: 14,
                      fontFamily: F,
                    }}
                  >
                    ‹
                  </Button>
                  <Button
                    style={{
                      border: `1px solid ${RED}`,
                      borderRadius: 12,
                      background: "#fff",
                      color: RED,
                      padding: "2px 8px",
                      cursor: "pointer",
                      fontSize: 14,
                      fontFamily: F,
                      fontWeight: 700,
                    }}
                  >
                    1
                  </Button>
                  <Button
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: MUTED,
                      fontSize: 14,
                      fontFamily: F,
                    }}
                  >
                    ›
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky footer action bar (chỉ hiển thị khi đang chờ ký duyệt) ── */}
      {
        isSigningMode && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#fff",
              borderTop: "2px solid #f59e0b",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
              zIndex: 100,
              fontFamily: F,
              color: TEXT,
            }}
          >
            <div style={{ fontSize: 14, color: "#78350f", fontFamily: F }}>
              <span style={{ fontWeight: 700 }}>⚠ Lưu ý:</span> Sau khi ký duyệt, hồ sơ sẽ chuyển sang trạng thái{" "}
              <b>Đã có hiệu lực</b> và hệ thống sẽ mở tính năng tạo quyết định phân công HĐXX.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={onBack}
                style={{
                  padding: "9px 24px",
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: F,
                  color: TEXT,
                  fontWeight: 500,
                }}
              >
                ↩ Trả lại
              </Button>
              <Button
                onClick={() => setShowKySuccess(true)}
                style={{
                  padding: "9px 28px",
                  background: "linear-gradient(135deg,#16a34a,#15803d)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: F,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
                }}
              >
                <Check size={15} /> Ký duyệt
              </Button>
            </div>
          </div>
        )
      }
      {showThongBaoVKSModal && <ThongBaoVKSModal row={row} onClose={() => setShowThongBaoVKSModal(false)} />}
    </div >
  );
}

// ── Filter panel ──────────────────────────────────────────────────────────────

function FilterPanel({ open, onToggle, userRole }: { open: boolean; onToggle: () => void; userRole?: UserRoleType }) {
  const isVu1 = userRole === "vu-1" || userRole === "hinh-su";
  const isVu4 = userRole === "vu-4" || userRole === "hanh-chinh";
  const inSt: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 5, padding: "6px 10px", fontSize: 14, fontFamily: F, outline: "none", background: "#fff", color: TEXT, width: "100%", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 4 };
  const col = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column" }}><label style={lbl}>{label}</label>{children}</div>
  );
  const rangeRow = (label: string) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Input type="date" style={{ ...inSt, flex: 1 }} />
        <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>–</span>
        <Input type="date" style={{ ...inSt, flex: 1 }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Hàng 1 (luôn hiển thị) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {col("Tòa ra BA/QĐ", <select style={inSt}><option value="">Chọn tòa án</option><option>TAND Tối cao</option><option>TAND Cấp cao HN</option><option>TAND Cấp cao TP.HCM</option></select>)}
          {col("Số BA/QĐ", <Input placeholder="Nhập số BA/QĐ" style={inSt} />)}
          {rangeRow("Ngày BA/QĐ")}
          {col("Loại án", <select style={inSt}><option value="">{isVu1 ? "Hình sự" : isVu4 ? "Hành chính" : "Chọn loại án"}</option><option>Hình sự</option><option>Dân sự</option><option>Kinh tế</option><option>Hành chính</option></select>)}
          {col("Thuộc án", <select style={inSt}><option value="">Chọn loại</option><option>GĐT</option><option>TT</option></select>)}
          {col(isVu1 ? "Người kháng nghị / Đề nghị" : isVu4 ? "Người khởi kiện" : "Người có đơn / Khiếu nại", <Input placeholder="Nhập tên..." style={inSt} />)}
        </div>

        {/* Hàng 2 & 3 (chỉ hiển thị khi mở rộng) */}
        {open && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {col(isVu1 ? "Bị cáo / Bị hại" : isVu4 ? "Người khởi kiện / Bị kiện" : "Nguyên đơn / Bị đơn", <Input placeholder={isVu1 ? "Nhập tên bị cáo..." : "Nhập tên đương sự..."} style={inSt} />)}
              {col("Số thụ lý XX", <Input placeholder="Số thụ lý" style={inSt} />)}
              {rangeRow("Thụ lý XX")}
              {rangeRow("Xét xử")}
              {col("Trạng thái xét xử", <select style={inSt}><option value="">– Tất cả –</option><option>Chưa xét xử</option><option>Đã xét xử</option></select>)}
              {col("Thẩm tra viên/Thư ký", <select style={inSt}><option value="">– Tất cả –</option><option>Nguyễn Thu Hằng</option><option>Lý Văn An</option></select>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {col("Lãnh đạo phụ trách", <select style={inSt}><option value="">Vui lòng chọn</option><option>Nguyễn Văn Minh</option><option>Vũ Đình Tuấn</option></select>)}
              {col("Thẩm phán", <select style={inSt}><option value="">Vui lòng chọn</option><option>Trần Thị Lan</option><option>Lê Hoàng Nam</option></select>)}
              {col("Quá hạn xét xử", <select style={inSt}><option value="">– Tất cả –</option><option>Có</option><option>Không</option></select>)}
              {col("Hoãn thi hành án", <select style={inSt}><option value="">– Tất cả –</option><option>Có</option><option>Không</option></select>)}
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <Button
          onClick={onToggle}
          style={{
            display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
            cursor: "pointer", fontSize: 14, color: "#2563eb", fontFamily: F, padding: 0, fontWeight: 500,
          }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? "Thu gọn" : "Mở rộng"}
        </Button>

        <div style={{ display: "flex", gap: 8 }}>
          <Button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </Button>
          <Button style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontFamily: F }}>
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function PhanCongHDXXView({
  userRole: propUserRole,
  setUserRole: propSetUserRole,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
} = {}) {
  const [internalRole, setInternalRole] = useState<UserRoleType>("vu-1");
  const userRole = propUserRole ?? internalRole;
  const setUserRole = propSetUserRole ?? setInternalRole;
  const [tab, setTab] = useState<PCTab>("tat-ca");
  const [filterOpen, setFilterOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [rowsData, setRowsData] = useState<HDXXRow[]>(ROWS);
  const [detail, setDetail] = useState<HDXXRow | null>(null);
  const [detailMode, setDetailMode] = useState<"view" | "ky-duyet">("view");
  const [soVuModal, setSoVuModal] = useState<HDXXRow | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleKyDuyet = (id: number) => {
    setRowsData(prev =>
      prev.map(r => (r.id === id ? { ...r, hdxxSub: "Đã có hiệu lực", trangThaiXX: "chua-xx" } : r))
    );
    if (detail && detail.id === id) {
      setDetail(prev => (prev ? { ...prev, hdxxSub: "Đã có hiệu lực", trangThaiXX: "chua-xx" } : null));
    }
  };

  const openDetail = (r: HDXXRow) => {
    setDetail(r);
    setDetailMode(tab === "cho-ky-duyet" || r.trangThaiXX === "cho-ky-duyet" ? "ky-duyet" : "view");
  };

  if (detail)
    return (
      <HDXXDetailView
        row={detail}
        onBack={() => setDetail(null)}
        isChoKyDuyet={detailMode === "ky-duyet"}
        onKyDuyet={handleKyDuyet}
      />
    );

  const filteredByRole = rowsData.filter(r => {
    if (userRole === "vu-1" || userRole === "hinh-su") return r.donViGui.includes("I (") || r.donViGui.includes("Hình sự") || r.loaiAn === "Hình sự";
    if (userRole === "vu-2" || userRole === "dan-su") return r.donViGui.includes("II (") || r.donViGui.includes("Dân sự") || r.loaiAn === "Dân sự";
    if (userRole === "vu-3") return r.donViGui.includes("III (") || r.donViGui.includes("Kinh doanh") || r.donViGui.includes("Lao động") || r.loaiAn === "Kinh doanh thương mại";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return r.donViGui.includes("IV (") || r.donViGui.includes("Hành chính") || r.loaiAn === "Hành chính";
    return true;
  });

  const rows = tab === "cho-ky-duyet" ? filteredByRole.filter(r => r.trangThaiXX === "cho-ky-duyet") : filteredByRole;
  const allChecked = rows.length > 0 && rows.every(r => checked.has(r.id));
  const toggleAll = () => setChecked(allChecked ? new Set() : new Set(rows.map(r => r.id)));
  const toggle = (id: number) => setChecked(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 14, padding: "10px 10px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 14, padding: "10px 10px", verticalAlign: "top" };

  const tabs: { id: PCTab; label: string; count: number }[] = [
    { id: "tat-ca", label: "Tất cả", count: filteredByRole.length },
    { id: "cho-ky-duyet", label: "Chờ ký duyệt", count: filteredByRole.filter(r => r.trangThaiXX === "cho-ky-duyet").length },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", background: BG, fontFamily: F, color: TEXT }}>
      {soVuModal && <SoVuModal row={soVuModal} onClose={() => setSoVuModal(null)} />}

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 14, color: MUTED, fontFamily: F, marginBottom: 8 }}>
          Trang chủ / Quản lý án GĐT/TT / <span style={{ color: RED, fontWeight: 600 }}>Phân công HĐXX</span> / Danh sách vụ xét xử
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Phân công Hội đồng xét xử</h1>

        </div>

        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
          {tabs.map(t => (
            <Button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent", color: tab === t.id ? RED : MUTED, fontFamily: F, fontSize: 14, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", marginBottom: -1 }}>
              {t.label} ({t.count})
            </Button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <FilterPanel open={filterOpen} onToggle={() => setFilterOpen(v => !v)} userRole={userRole} />

        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
            <Button style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <RotateCcw size={14} color={MUTED} />
            </Button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} /><col style={{ width: 36 }} /><col style={{ width: "15%" }} /><col style={{ width: "22%" }} /><col style={{ width: "35%" }} /><col style={{ width: "16%" }} /><col style={{ width: 44 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: "center" }}>
                  <Input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor: RED, cursor: "pointer" }} />
                </th>
                {["STT", "Số & Ngày lập DS", "Đơn vị gửi", "Thông tin hội đồng xét xử", "Trạng thái", "Thao tác"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                  onClick={() => openDetail(r)}
                >
                  <td style={{ ...TD, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                    <Input type="checkbox" checked={checked.has(r.id)} onChange={() => toggle(r.id)} style={{ accentColor: RED, cursor: "pointer" }} />
                  </td>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={TD}>
                    <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>Số: {r.soDS}</div>
                    <div style={{ color: MUTED, fontFamily: F }}>Ngày: {r.ngayDS}</div>
                  </td>
                  <td style={TD} onClick={e => e.stopPropagation()}>
                    <div style={{ fontWeight: 600, color: TEXT, fontFamily: F }}>{r.donViGui}</div>
                    <div style={{ fontSize: 14, color: MUTED, fontFamily: F, marginTop: 2 }}>Trình Phó Chánh án phê duyệt</div>
                  </td>
                  <td style={TD} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, fontFamily: F }}>{r.hdxx}</div>
                      <div style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
                        <span style={{ fontWeight: 600 }}>Chủ tọa:</span> <span style={{ color: TEXT }}>{r.chuToa}</span>
                      </div>
                      {r.thanhPhanHDXX && r.thanhPhanHDXX.length > 0 && (
                        <div style={{ fontSize: 14, color: TEXT, fontFamily: F, lineHeight: 1.45 }}>
                          <b style={{ color: MUTED }}>Thành phần:</b> {r.thanhPhanHDXX.join(", ")}
                        </div>
                      )}
                      <Button onClick={() => openDetail(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontFamily: F, fontSize: 14, padding: 0, textAlign: "left", textDecoration: "underline", marginTop: 2 }}>
                        Thông tin phân công HĐXX
                      </Button>
                    </div>
                  </td>
                  <td style={TD}>
                    <div style={{ marginBottom: 5 }}><TrangThaiBadge type={r.trangThaiXX} /></div>
                    {r.trangThaiSub && <div style={{ color: MUTED, fontFamily: F, fontSize: 14, marginBottom: 2 }}>{r.trangThaiSub}</div>}
                    {r.trangThaiExtra && (
                      <div style={{ fontFamily: F, fontSize: 14, color: r.trangThaiExtra.startsWith("Thời hạn") ? RED : MUTED, whiteSpace: "pre-line" }}>
                        {r.trangThaiExtra}
                      </div>
                    )}
                  </td>
                  <td style={{ ...TD, textAlign: "center", position: "relative" }} onClick={e => e.stopPropagation()}>
                    <Button onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}>
                      <MoreVertical size={16} color={MUTED} />
                    </Button>
                    {menuOpen === r.id && (
                      <ContextMenu
                        row={r}
                        onClose={() => setMenuOpen(null)}
                        onXem={() => openDetail(r)}
                        onPhanCong={() => openDetail(r)}
                        onLichXX={() => openDetail(r)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>
              Hiển thị <b>{rows.length}</b> của <b>{tab === "tat-ca" ? 163 : 58}</b> bản ghi
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, color: MUTED, fontFamily: F }}>HIỂN THỊ:</span>
              <select style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", fontSize: 14, fontFamily: F, color: TEXT, background: "#fff", outline: "none" }}>
                <option>10 dòng</option><option>20 dòng</option><option>50 dòng</option>
              </select>
              <div style={{ display: "flex", gap: 2 }}>
                {["‹‹", "‹", "1", "›", "››"].map((p, i) => (
                  <Button key={i} style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: p === "1" ? RED : "#fff", color: p === "1" ? "#fff" : TEXT, fontSize: 14, cursor: "pointer", fontFamily: F, fontWeight: p === "1" ? 700 : 400 }}>{p}</Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ── Thông báo VKS Modal ────────────────────────────────────────────────────────

function ThongBaoVKSModal({
  row,
  onClose,
}: {
  row: HDXXRow;
  onClose: () => void;
}) {
  const isHinhSu = row.loaiAn === "Hình sự";
  const isHanhChinh = row.loaiAn === "Hành chính";
  const isKDTM = row.loaiAn === "Kinh doanh thương mại" || (row.loaiAn as any) === "Lao động";

  const cases: VuAnDetail[] = row.danhSachVuAn || [];
  const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set(cases.map(c => c.id)));

  const toggleCase = (id: number) => {
    setSelectedCaseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllCases = () => {
    if (selectedCaseIds.size === cases.length) setSelectedCaseIds(new Set());
    else setSelectedCaseIds(new Set(cases.map(c => c.id)));
  };

  const JUDGE_INFO: Record<string, { chucVu: string; ngaySinh: string }> = {
    "Nguyễn Biên Thùy": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "12/04/1970" },
    "Lê Thị Thu Hiển": { chucVu: "Phó Vụ trưởng Vụ I", ngaySinh: "25/09/1974" },
    "Phạm Thị Bích Ngọc": { chucVu: "Thẩm tra viên chính", ngaySinh: "18/11/1982" },
    "Nguyễn Như Thắng": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "05/06/1968" },
    "Trần Hồng Hà": { chucVu: "Thẩm phán TAND Tối cao", ngaySinh: "10/01/1966" },
    "Phạm Quốc Anh": { chucVu: "Phó Vụ trưởng Vụ IV", ngaySinh: "14/03/1975" },
  };

  // Form thông báo
  const [soCV, setSoCV] = useState("");
  const [ngayBanHanh, setNgayBanHanh] = useState("");

  const defaultNguoiKy = row.chuToa && row.chuToa !== "—" ? row.chuToa : "Nguyễn Biên Thùy";
  const [nguoiKy, setNguoiKy] = useState(defaultNguoiKy);
  const [noiDung, setNoiDung] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [noiNhanList, setNoiNhanList] = useState<NoiNhanItem[]>([
    { id: 1, loaiNoiNhan: "Khác", chiTiet: "Như kính gửi", ghiChu: "" },
    { id: 2, loaiNoiNhan: "Tòa án nhân dân", chiTiet: "Chánh án TANDTC", ghiChu: "để b/c" },
    { id: 3, loaiNoiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC-Vụ 10", ghiChu: "" },
    { id: 4, loaiNoiNhan: "Lưu trữ", chiTiet: "Lưu: VT, Vụ GĐKTIV.", ghiChu: "" }
  ]);
  const [addingNoiNhan, setAddingNoiNhan] = useState(false);
  const [newLoaiNN, setNewLoaiNN] = useState("Viện kiểm sát");
  const [newChiTiet, setNewChiTiet] = useState("");
  const [newGhiChuNN, setNewGhiChuNN] = useState("");

  const handleAddNoiNhan = () => {
    if (!newChiTiet.trim()) return;
    setNoiNhanList(prev => [...prev, { id: Date.now(), loaiNoiNhan: newLoaiNN, chiTiet: newChiTiet, ghiChu: newGhiChuNN }]);
    setNewChiTiet("");
    setNewGhiChuNN("");
    setAddingNoiNhan(false);
  };
  const handleDeleteNoiNhan = (id: number) => setNoiNhanList(prev => prev.filter(item => item.id !== id));

  const lbl = { fontSize: 14, fontWeight: 500, color: MUTED, fontFamily: F, marginBottom: 6, display: "block" };
  const req = <span style={{ color: RED }}>*</span>;
  const inp = { width: "100%", padding: "10px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: F, color: TEXT, boxSizing: "border-box" as any, background: "#fff", outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 2100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "min(1200px, 98vw)", maxHeight: "96vh", display: "flex", flexDirection: "column", boxShadow: "0 16px 56px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F, color: TEXT }}>
        {/* Modal Header */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={20} color="#1f2937" />
            <span style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>Tạo thông báo VKS tham gia phiên tòa</span>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex" }}>
            <X size={22} />
          </Button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* ── 1. THÔNG TIN CHUNG (CARD GỘP CHUẨN) ── */}
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: "16px 24px", fontSize: 14, fontFamily: F }}>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Loại án : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.loaiAn}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Số – Ngày lập DS : </span><span style={{ color: TEXT, fontWeight: 700 }}>Số {row.soDS} – {row.ngayDS}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Đơn vị trình : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.donViGui}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Hội đồng xét xử : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.hdxx}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Chủ tọa phiên tòa : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.chuToa || "—"}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Tổng số vụ án : </span><span style={{ color: TEXT, fontWeight: 700 }}>{cases.length} vụ án</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Số BA/QĐ : </span><span style={{ color: TEXT, fontWeight: 700 }}>{formatSoBA(row.soBA)}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Ngày ra BA/QĐ : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.ngayBA}</span></div>
              <div><span style={{ color: "#0d9488", fontWeight: 700 }}>Tòa án giải quyết : </span><span style={{ color: TEXT, fontWeight: 700 }}>Tòa án nhân dân tối cao</span></div>
              <div style={{ gridColumn: "span 3" }}><span style={{ color: "#0d9488", fontWeight: 700 }}>Thành phần HĐXX : </span><span style={{ color: TEXT, fontWeight: 700 }}>{row.thanhPhanHDXX && row.thanhPhanHDXX.length > 0 ? row.thanhPhanHDXX.join(", ") : "—"}</span></div>
            </div>

            {/* ── 2. DANH SÁCH XÉT XỬ ĐÃ TẠO TRƯỚC ĐÓ (CÁC VỤ ÁN ÁP DỤNG) ── */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Danh sách vụ án trong đợt xét xử ({cases.length} vụ)</span>
                <div style={{ fontSize: 14, color: MUTED }}>Đã chọn: <span style={{ color: TEXT }}>{selectedCaseIds.size}/{cases.length} vụ án áp dụng</span></div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 50 }} /><col style={{ width: 50 }} /><col style={{ width: "20%" }} /><col style={{ width: "30%" }} /><col style={{ width: "30%" }} /><col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}><Input type="checkbox" checked={selectedCaseIds.size === cases.length && cases.length > 0} onChange={toggleAllCases} style={{ accentColor: RED, cursor: "pointer", width: 16, height: 16 }} /></th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>STT</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}` }}>Số & Ngày thụ lý</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}` }}>Thông tin Bản án / QĐ</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}` }}>Bị cáo / Bị hại / Người khiếu nại</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}` }}>Cán bộ giải quyết</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c, idx) => (
                    <tr key={c.id || idx} style={{ background: selectedCaseIds.has(c.id) ? "#fdf2f8" : "#fff", borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "12px", textAlign: "center" }}><Input type="checkbox" checked={selectedCaseIds.has(c.id)} onChange={() => toggleCase(c.id)} style={{ accentColor: RED, cursor: "pointer", width: 16, height: 16 }} /></td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", textAlign: "center", color: TEXT }}>{idx + 1}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}><div style={{ marginBottom: 4 }}>Số: {c.soTL}</div><div>Ngày: {c.ngayTL}</div></td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}><div style={{ marginBottom: 4 }}>Số: {formatSoBA(c.soBA)}</div><div style={{ marginBottom: 4 }}>Ngày: {c.ngayBA}</div><div>Tại: Tòa án nhân dân cấp cao</div></td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}>
                        <span>{c.biCao || c.nguyenDon}</span>
                      </td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}>
                        <div>TP: {c.tp}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── 3. THÔNG TIN THÔNG BÁO / BIỂU MẪU ── */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "20px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Thông tin thông báo</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={lbl}>Ngày thông báo</label>
                  <Input type="date" value={ngayBanHanh} onChange={e => setNgayBanHanh(e.target.value)} style={inp} placeholder="Chọn ngày" />
                </div>
                <div>
                  <label style={lbl}>Số thông báo</label>
                  <Input value={soCV} onChange={e => setSoCV(e.target.value)} style={inp} placeholder="Chưa được cấp số" />
                </div>
                <div>
                  <label style={{ ...lbl, color: RED }}>Người ký/người phân công {req}</label>
                  <select value={nguoiKy} onChange={e => { setNguoiKy(e.target.value); }} style={inp}>
                    <option>Nguyễn Biên Thùy</option><option>Lê Thị Thu Hiển</option><option>Nguyễn Như Thắng</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={lbl}>Nội dung thông báo</label>
                <textarea
                  value={noiDung}
                  onChange={e => setNoiDung(e.target.value)}
                  style={{ ...inp, height: 120, resize: "vertical" }}
                  placeholder="nhập dữ liệu"
                />
                <div style={{ textAlign: "right", fontSize: 14, color: MUTED, marginTop: 4 }}>{noiDung.length} / 4000</div>
              </div>
            </div>

            {/* ── 4. CẤU HÌNH NƠI NHẬN ── */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Cấu hình nơi nhận</span>
                <Button htmlType="button" onClick={() => setAddingNoiNhan(true)} style={{ padding: "8px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                  + Thêm nơi nhận
                </Button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup><col style={{ width: 60 }} /><col style={{ width: "25%" }} /><col style={{ width: "35%" }} /><col style={{ width: "25%" }} /><col style={{ width: 100 }} /></colgroup>
                <thead>
                  <tr>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", textAlign: "center", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>STT</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>Phân loại nơi nhận</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>Nơi nhận chi tiết</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>Ghi chú</th>
                    <th style={{ ...TH_STYLE, fontSize: 14, padding: "12px", textAlign: "center", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {noiNhanList.length === 0 && !addingNoiNhan && (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: MUTED }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                        <div style={{ fontSize: 14 }}>Trống</div>
                      </td>
                    </tr>
                  )}
                  {noiNhanList.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", textAlign: "center", color: TEXT }}>{idx + 1}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}>{item.loaiNoiNhan}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}>{item.chiTiet}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", color: TEXT }}>{item.ghiChu}</td>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", textAlign: "center" }}><Button htmlType="button" onClick={() => handleDeleteNoiNhan(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontFamily: F, fontSize: 14, fontWeight: 500 }}>Xóa</Button></td>
                    </tr>
                  ))}
                  {addingNoiNhan && (
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD_STYLE, fontSize: 14, padding: "12px", textAlign: "center", color: MUTED }}>{noiNhanList.length + 1}</td>
                      <td style={{ padding: "8px 12px" }}><select value={newLoaiNN} onChange={e => setNewLoaiNN(e.target.value)} style={{ ...inp, fontSize: 14, padding: "8px" }}><option>Viện kiểm sát</option><option>Tòa án nhân dân</option><option>Khác</option></select></td>
                      <td style={{ padding: "8px 12px" }}><Input value={newChiTiet} onChange={e => setNewChiTiet(e.target.value)} placeholder="Nhập tên..." style={{ ...inp, fontSize: 14, padding: "8px" }} /></td>
                      <td style={{ padding: "8px 12px" }}><Input value={newGhiChuNN} onChange={e => setNewGhiChuNN(e.target.value)} placeholder="Ghi chú..." style={{ ...inp, fontSize: 14, padding: "8px" }} /></td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <Button htmlType="button" onClick={handleAddNoiNhan} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, padding: "6px 12px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Lưu</Button>
                          <Button htmlType="button" onClick={() => setAddingNoiNhan(false)} style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "6px 12px", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Hủy</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
          <Button htmlType="button" onClick={onClose} style={{ padding: "9px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F }}>
            Lưu
          </Button>
          <Button htmlType="button" onClick={onClose} style={{ padding: "9px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F }}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

