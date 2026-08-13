import React, { useState } from "react";
import {
  Search, Eye, ChevronDown, ChevronUp, ChevronRight, RotateCcw, X, Save, Printer,
  FileText, Send, Archive, RefreshCw, Download, Trash2,
} from "lucide-react";
import { type LoaiAn } from "./data";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { getPartyLabels, isVu234, getQuanHePhapLuat } from "./App";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import { TabThongTin } from "./TabThongTin";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoLuuTruView } from "./HoSoLuuTruView";

import { ThemKetQuaModal, ThemQuyetDinhHoanModal } from "./ThemKetQuaModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";

// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface VuAnRow {
  stt: number; lan: string;
  soThuLy: string; ngayThuLy: string;
  soBA: string; ngayBA: string;
  toa: string; capXetXu: string;
  thoiHieu?: string;
  anLoai?: "chi-dao" | "quoc-hoi" | "tvtn" | "tu-hinh" | string;
  loaiAn?: string;
  quanHePhapLuat?: string;
  nkn: string; biCao: string; ndd: string;
  ttv: string; lanhDao: string;
  kqgq: "chua-phan-cong" | "trinh-pho-chanh-an" | "trinh-tham-phan";
  trangThaiHoSo: "chua-co" | "dang-muon" | "da-co" | "da-tra" | "da-chuyen";
  kqGiaiQuyet: "chua-co" | "da-co" | "da-co-con-don";
  trangThaiToTrinh: "chua-co" | "dang-trinh" | "da-duyet" | "bi-tra-lai";
  soToTrinh: number;
  thamPhan?: string;
}

export interface VuAnGroup {
  id: string;
  maSo: string;
  tenVuAn: string;
  soVuAnGiaiQuyet: number;
  loaiAn?: LoaiAn | string;
  rows: VuAnRow[];
}

export function filterVuAnListByRole(groups: VuAnGroup[], userRole?: UserRoleType): VuAnGroup[] {
  if (!userRole || userRole === "toan-bo") return groups;
  if (userRole === "vu-1" || userRole === "hinh-su") {
    return groups.filter(g => g.loaiAn === "Hình sự" || (!g.loaiAn && !g.id.includes("DS") && !g.id.includes("KDTM") && !g.id.includes("HC") && !g.id.includes("LD") && !g.id.includes("HNGD")));
  }
  if (userRole === "vu-2" || userRole === "dan-su") {
    return groups.filter(g => g.loaiAn === "Dân sự" || g.id.includes("DS"));
  }
  if (userRole === "vu-3") {
    return groups.filter(g => g.loaiAn === "Kinh doanh thương mại" || g.loaiAn === "Lao động" || g.loaiAn === "Hôn nhân gia đình" || g.loaiAn === "Phá sản" || g.loaiAn === "Sở hữu trí tuệ" || g.id.includes("KDTM") || g.id.includes("LD") || g.id.includes("HNGD") || g.id.includes("PS"));
  }
  if (userRole === "vu-4" || userRole === "hanh-chinh") {
    return groups.filter(g => g.loaiAn === "Hành chính" || g.id.includes("HC"));
  }
  return groups;
}

export const VU_AN_LIST: VuAnGroup[] = [
  // ── Vụ I: Hình sự (Thời hiệu: 1 năm / Không xác định thời hiệu) ──
  {
    id: "VA26-002621", maSo: "VA26-002621",
    tenVuAn: "Vụ án Đặng Thị Dương – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682424", ngayThuLy: "20/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân khu vực 1 - Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682425", ngayThuLy: "22/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân khu vực 1 - Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002138", maSo: "VA26-002138",
    tenVuAn: "Vụ án Hoàng Hoa Thám – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 3,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 3, lan: "Lần 1: Số đơn 3 (1 đơn TLM)",
        soThuLy: "5:4684H06", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội", capXetXu: "Phúc thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 2,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Nguyễn Thị Bình", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 1,
      },
      {
        stt: 1, lan: "Lần 1: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ II: Dân sự (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001543-DS", maSo: "VA26-001543",
    tenVuAn: "Vụ án Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681543", ngayThuLy: "03/07/2026",
        soBA: "21/2026/DS-ST", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        nkn: "Ngô Mai Trang", biCao: "Công ty TNHH Bất động sản Hoàng Gia", ndd: "Luật sư Trần Văn Nam",
        ttv: "Trần Thị Mai", lanhDao: "Trần Thị Hoa", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002300-DS", maSo: "VA26-002300",
    tenVuAn: "Vụ án Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54682300", ngayThuLy: "28/06/2026",
        soBA: "77/2026/DS-PT", ngayBA: "28/06/2026",
        toa: "Tòa án nhân dân khu vực 3 - Hà Nội", capXetXu: "Phúc thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        nkn: "Lê Văn Hùng", biCao: "Lê Thị Bích", ndd: "Luật sư Phạm Quốc Tuấn",
        ttv: "Vũ Xuân Hiển", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ III: Kinh doanh thương mại (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001890-KDTM", maSo: "VA26-001890",
    tenVuAn: "Vụ án Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681890", ngayThuLy: "19/06/2026",
        soBA: "45/2026/KDTM-ST", ngayBA: "19/06/2026",
        toa: "Tòa án nhân dân khu vực 2 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "chi-dao",
        nkn: "Ngân hàng TMCP Ngoại thương Việt Nam", biCao: "Công ty CP Xây lắp Dầu khí", ndd: "Nguyễn Văn Thắng",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  // ── Vụ IV: Hành chính (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001104-HC", maSo: "VA26-001104",
    tenVuAn: "Vụ án Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681104", ngayThuLy: "25/07/2026",
        soBA: "12/2026/HC-ST", ngayBA: "25/07/2026",
        toa: "Tòa án nhân dân khu vực 6 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        nkn: "Phạm Văn Cường", biCao: "Ủy ban nhân dân huyện Yên Dũng", ndd: "Hoàng Minh Tâm",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "VA26-003005-HS", maSo: "VA26-003005",
    tenVuAn: "Vụ án Lê Anh Tuấn – Tội cướp tài sản có tổ chức theo khoản 4 Điều 168 Bộ luật Hình sự",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54683005", ngayThuLy: "18/07/2026",
        soBA: "57/2026/HS-ST", ngayBA: "16/07/2026",
        toa: "Tòa án nhân dân khu vực 3 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Lê Anh Tuấn", biCao: "Ngô Văn Quyết", ndd: "Luật sư Đặng Minh Tuấn",
        ttv: "Nguyễn Thị Bình", lanhDao: "Nguyễn Như Thắng", thamPhan: "Lê Văn Minh",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

export const KHIEU_NAI_LIST: VuAnGroup[] = [
  {
    id: "KN26-004128", maSo: "KN26-004128",
    tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TAHN của TAND khu vực 5 - Hà Nội",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn khiếu nại)",
        soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân khu vực 5 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (Đơn khiếu nại bổ sung)",
        soThuLy: "KN-2026/00143", ngayThuLy: "20/06/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân khu vực 5 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "quoc-hoi",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-005230-DS", maSo: "KN26-005230",
    tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai tại Hà Nội",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thông báo)",
        soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026",
        soBA: "54681139", ngayBA: "03/05/2026",
        toa: "Tòa án nhân dân khu vực 1 - Hà Nội", capXetXu: "Giám đốc thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại TB giải quyết"],
        nkn: "Phạm Văn Hùng (KN-74291)", biCao: "Ngô Quỳnh Trang", ndd: "Nguyễn Văn Hùng",
        ttv: "Nguyễn Thị Hoa", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-003891-KDTM", maSo: "KN26-003891",
    tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại biện pháp khẩn cấp)",
        soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026",
        soBA: "08/2026/QĐ-KDTM", ngayBA: "18/07/2026",
        toa: "Tòa án nhân dân khu vực 3 - Hà Nội", capXetXu: "Sơ thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        extraTags: ["Khẩn cấp"],
        nkn: "Trần Minh Đức (ĐD Công ty CP Minh Phát)", biCao: "Công ty TNHH Hoàng Gia", ndd: "Đặng Quốc Tuấn",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "KN26-006102-HC", maSo: "KN26-006102",
    tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thời hạn)",
        soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026",
        soBA: "19/2026/HC-PT", ngayBA: "12/04/2026",
        toa: "Tòa án nhân dân thành phố Hà Nội", capXetXu: "Giám đốc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại thời hạn giải quyết"],
        nkn: "Hoàng Thị Thu", biCao: "Ủy ban nhân dân Thành phố Hà Nội", ndd: "Nguyễn Văn Tiến",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

export interface VuAnDetailData {
  maVuAn: string; tenVuAn: string;
  loaiBienAn: string; namGiaiQuyet: string;
  soNgayBanAn: string; loaiAn: string; toaXetXu: string;
  danhSachDon: Array<{
    stt: number; maDon: string; thongTinGQ: string;
    soThuLy: string; ngayThuLy: string; ngayNhan: string;
    nguoiDung: string; phanLoai: string; loaiDon: string; noiDung: string;
  }>;
  muonTraHoSo: Array<{
    stt: number; loaiPhieu: string; soPhieu: string; soBuLuc: string;
    ngayGhiPhieu: string; ngayTao: string; canBo: string; chucVu: string;
    donVi: string; nguoiKyDuyet: string; trangThaiKy: string; ghiChu: string;
  }>;
  thamPhan?: string;
  thamTraVien?: string;
  isKhieuNai?: boolean;
  entityWord?: string;
  moduleLabel?: string;
}

const VU_AN_DETAILS: Record<string, VuAnDetailData> = {
  "KN26-004128": {
    maVuAn: "KN26-004128", tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TAHN của TAND khu vực 5 - Hà Nội",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HS-ST – 10/04/2026", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân khu vực 2 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-88421", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026", ngayNhan: "15/05/2026", nguoiDung: "Nguyễn Thị Lan", phanLoai: "Đơn khiếu nại tố tụng", loaiDon: "DON_CHINH", noiDung: "Khiếu nại hành vi tố tụng và Quyết định trả lại đơn đề nghị giám đốc thẩm đối với bản án hình sự sơ thẩm số 12/2026/HS-ST." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-KN-001", soBuLuc: "08", ngayGhiPhieu: "18/05/2026", ngayTao: "18/05/2026", canBo: "Vũ Diệu Thúy", chucVu: "Công chức", donVi: "Tòa Hình sự - TAND thành phố Hà Nội", nguoiKyDuyet: "Phạm Thị Bích Ngọc", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ khiếu nại" },
    ],
  },
  "KN26-005230-DS": {
    maVuAn: "KN26-005230", tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai tại Hà Nội",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "128/TB-TA – 03/05/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân khu vực 1 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-74291", thongTinGQ: "Đã thụ lý", soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026", ngayNhan: "02/06/2026", nguoiDung: "Phạm Văn Hùng", phanLoai: "Khiếu nại TB giải quyết", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét lại Thông báo không kháng nghị giám đốc thẩm liên quan đến diện tích 350m2 đất thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "KN26-003891-KDTM": {
    maVuAn: "KN26-003891", tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "08/2026/QĐ-KDTM – 18/07/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân khu vực 3 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-90214", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026", ngayNhan: "20/07/2026", nguoiDung: "Trần Minh Đức", phanLoai: "Khiếu nại biện pháp khẩn cấp", loaiDon: "DON_CHINH", noiDung: "Khiếu nại việc áp dụng biện pháp khẩn cấp tạm thời phong tỏa tài khoản ngân hàng không đúng quy định." },
    ],
    muonTraHoSo: [],
  },
  "KN26-006102-HC": {
    maVuAn: "KN26-006102", tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "19/2026/HC-PT – 12/04/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân thành phố Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-61020", thongTinGQ: "Đã có KQ", soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026", ngayNhan: "10/08/2026", nguoiDung: "Hoàng Thị Thu", phanLoai: "Khiếu nại thời hạn giải quyết", loaiDon: "DON_CHINH", noiDung: "Khiếu nại thời hạn giải quyết đơn đề nghị giám đốc thẩm kéo dài quá quy định pháp luật." },
    ],
    muonTraHoSo: [],
  },
  "VA26-002621": {
    maVuAn: "VA26-002039", tenVuAn: "Nguyễn Văn Minh – Tội cướp tài sản",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân khu vực 1 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "6988", thongTinGQ: "Thụ lý mới", soThuLy: "5434565D", ngayThuLy: "21/07/2026", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ và có địa thiếu tố áp dụng theo quy định..." },
      { stt: 2, maDon: "7005", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
      { stt: 3, maDon: "7004", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-2026-001", soBuLuc: "12", ngayGhiPhieu: "20/07/2026", ngayTao: "20/07/2026", canBo: "Lý Thái Phúc", chucVu: "Công chức", donVi: "Viện kiểm sát nhân dân thành phố Hà Nội", nguoiKyDuyet: "Nguyễn Văn A – Trưởng phòng", trangThaiKy: "Đã ký", ghiChu: "Kèm hồ sơ vụ án" },
      { stt: 2, loaiPhieu: "Phiếu trả", soPhieu: "PT-2026-001", soBuLuc: "12", ngayGhiPhieu: "25/07/2026", ngayTao: "25/07/2026", canBo: "Lý Thái Phúc", chucVu: "Công chức", donVi: "Viện kiểm sát nhân dân thành phố Hà Nội", nguoiKyDuyet: "Nguyễn Văn A – Trưởng phòng", trangThaiKy: "Chờ ký", ghiChu: "Trả hồ sơ sau khi nghiên cứu" },
    ],
  },
  "VA26-002138": {
    maVuAn: "VA26-002138", tenVuAn: "Phùng Văn Nam – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ của người khác",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân khu vực 1 - Hà Nội",
    danhSachDon: [],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "–", soBuLuc: "–", ngayGhiPhieu: "–", ngayTao: "24/07/2026", canBo: "Vũ Xuân Hiển", chucVu: "Công chức chính", donVi: "Viện kiểm sát nhân dân khu vực 11", nguoiKyDuyet: "Nguyễn Văn A – Trưởng phòng", trangThaiKy: "Chờ ký", ghiChu: "Ghi chú" },
    ],
  },
  "VA26-001543-DS": {
    maVuAn: "VA26-001543", tenVuAn: "Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "21/2026/DS-ST – 03/07/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân khu vực 4 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "7122", thongTinGQ: "Thụ lý mới", soThuLy: "54681543", ngayThuLy: "03/07/2026", ngayNhan: "03/07/2026", nguoiDung: "Ngô Mai Trang", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án sơ thẩm về tranh chấp quyền sử dụng đất và nhà ở do vi phạm nghiêm trọng thủ tục tố tụng." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-DS-001", soBuLuc: "15", ngayGhiPhieu: "05/07/2026", ngayTao: "05/07/2026", canBo: "Trần Thị Mai", chucVu: "Công chức", donVi: "TAND khu vực 4 - Hà Nội", nguoiKyDuyet: "Trần Thị Hoa", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ gốc vụ án" },
    ],
  },
  "VA26-002300-DS": {
    maVuAn: "VA26-002300", tenVuAn: "Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    loaiBienAn: "Phúc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "77/2026/DS-PT – 28/06/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân khu vực 5 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "7150", thongTinGQ: "Thụ lý mới", soThuLy: "54682300", ngayThuLy: "28/06/2026", ngayNhan: "28/06/2026", nguoiDung: "Lê Văn Hùng", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị kháng nghị Giám đốc thẩm bản án phúc thẩm về phân chia di sản thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001890-KDTM": {
    maVuAn: "VA26-001890", tenVuAn: "Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "45/2026/KDTM-ST – 19/06/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân khu vực 6 - Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "7210", thongTinGQ: "Thụ lý mới", soThuLy: "54681890", ngayThuLy: "19/06/2026", ngayNhan: "19/06/2026", nguoiDung: "Ngân hàng TMCP Ngoại thương", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Yêu cầu Giám đốc thẩm do áp dụng sai quy định về nghĩa vụ bảo lãnh và lãi suất nợ quá hạn." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001104-HC": {
    maVuAn: "VA26-001104", tenVuAn: "Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HC-ST – 25/07/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân thành phố Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "7305", thongTinGQ: "Thụ lý mới", soThuLy: "54681104", ngayThuLy: "25/07/2026", ngayNhan: "25/07/2026", nguoiDung: "Phạm Văn Cường", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Khiếu kiện quyết định thu hồi đất không đúng thẩm quyền và giá bồi thường chưa thỏa đáng." },
    ],
    muonTraHoSo: [],
  },
};

// ── Popup Xem nhanh danh sách đơn kèm Thông tin trình (Trình đến ai) ───────────
export function QuickViewDanhSachDonModal({
  group,
  onClose,
  onSelectVuAn,
  userRole,
  isKhieuNai = false,
}: {
  group: VuAnGroup;
  onClose: () => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
  userRole?: UserRoleType;
  isKhieuNai?: boolean;
}) {
  const detail = VU_AN_DETAILS[group.id] || VU_AN_DETAILS["VA26-002621"];

  const donList = (detail?.danhSachDon && detail.danhSachDon.length > 0)
    ? detail.danhSachDon.map((d, i) => {
      const row = group.rows[i] || group.rows[0];
      const isTrinhPhoCA = row?.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row?.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row?.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TAND thành phố Hà Nội (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TAND thành phố Hà Nội (${row?.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row?.lanhDao || "Nguyễn Thị Bình - Trưởng phòng"})`;

      const trangThaiTrinh = (d as any).trangThaiTrinh || (row?.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row?.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : row?.soToTrinh ? "Đã duyệt" : "Chưa trình");
      const ngayTrinh = (d as any).ngayTrinh || row?.ngayThuLy || "20/07/2026";

      return {
        ...d,
        trinhDenAi,
        trangThaiTrinh,
        ngayTrinh,
      };
    })
    : group.rows.map((row, idx) => {
      const isTrinhPhoCA = row.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TAND thành phố Hà Nội (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TAND thành phố Hà Nội (${row.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row.lanhDao || "Nguyễn Thị Bình - Trưởng phòng"})`;

      return {
        stt: idx + 1,
        maDon: (6988 + idx) + "",
        thongTinGQ: idx === 0 ? "Thụ lý mới" : "Đã thụ lý",
        soThuLy: row.soThuLy,
        ngayThuLy: row.ngayThuLy,
        ngayNhan: row.ngayThuLy,
        nguoiDung: row.ndd || row.nkn,
        phanLoai: isKhieuNai ? "Đơn khiếu nại tố tụng" : "Đơn đề nghị GĐT, TT",
        loaiDon: idx === 0 ? "DON_CHINH" : "DON_TRUNG",
        trinhDenAi,
        trangThaiTrinh: row.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : "Chưa trình",
        ngayTrinh: row.ngayThuLy,
        noiDung: `Đề nghị xem xét bản án số ${row.soBA} theo thủ tục Giám đốc thẩm do có vi phạm tố tụng và tình tiết mới.`,
      };
    });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: F,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "100%",
          maxWidth: 1080,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} color="#8b1a1a" />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#222222", fontFamily: F }}>
              Danh sách đơn – {group.tenVuAn || group.maSo}
            </span>
            <Badge color="#1a5a96" bg="#e8f4ff">{donList.length} đơn</Badge>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: MUTED,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Strip */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "10px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div>
            <span style={{ color: MUTED }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span>
            <b style={{ color: "#8b1a1a" }}>{group.maSo}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Loại án: </span>
            <b style={{ color: TEXT }}>{group.loaiAn || "Hình sự"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Công chức: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.ttv || "Lý Thái Phúc"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Thẩm phán: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.thamPhan || "Nguyễn Biên Thuỳ"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số BA/QĐ: </span>
            <b style={{ color: "#1a73e8" }}>{formatSoBA(group.rows[0]?.soBA, group.loaiAn) || "12/2026/HS-PT"}</b>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 35 }} />
              <col style={{ width: 85 }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>MÃ ĐƠN</th>
                <th style={TH_STYLE}>THÔNG TIN THỤ LÝ</th>
                <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>PHÂN LOẠI</th>
                <th style={TH_STYLE}>THÔNG TIN TRÌNH (TRÌNH ĐẾN AI)</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>KẾT QUẢ GIẢI QUYẾT</th>
              </tr>
            </thead>
            <tbody>
              {donList.map((d, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: `1px solid #f5f5f5`,
                  }}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={{ ...TD_STYLE, color: "#1a73e8", fontWeight: 700 }}>{d.maDon}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#1b5e20" : TEXT }}>
                        {d.thongTinGQ}
                      </span>
                      {d.soThuLy && <span style={{ fontSize: 11, color: TEXT }}>Số: {d.soThuLy}</span>}
                      {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED }}>Ngày TL: {d.ngayThuLy}</span>}
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontWeight: 600, color: "#222222" }}>{d.nguoiDung}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: TEXT }}>{d.phanLoai}</span>
                      <Badge color={d.loaiDon === "DON_CHINH" ? "#1a5a96" : "#6e1414"} bg={d.loaiDon === "DON_CHINH" ? "#e8f4ff" : "#fdecea"}>
                        {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                      </Badge>
                    </div>
                  </td>
                  {/* Cột Thông tin trình (Trình đến ai) */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#222222", lineHeight: 1.3 }}>
                          👤 {d.trinhDenAi}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <Badge
                          color={d.trangThaiTrinh === "Đã duyệt" ? "#1b5e20" : d.trangThaiTrinh === "Đang trình" ? "#8a6d00" : "#555555"}
                          bg={d.trangThaiTrinh === "Đã duyệt" ? "#e8f5e9" : d.trangThaiTrinh === "Đang trình" ? "#fff8e1" : "#f5f5f5"}
                        >
                          {d.trangThaiTrinh}
                        </Badge>
                        {d.ngayTrinh && (
                          <span style={{ fontSize: 10, color: MUTED }}>
                            Ngày: {d.ngayTrinh}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Cột Kết quả giải quyết */}
                  <td style={TD_STYLE}>
                    {(() => {
                      const kqType = (d as any).ketQuaGiaiQuyetType || (idx % 4 === 0 ? "khang-nghi" : idx % 4 === 1 ? "tra-loi-don" : idx % 4 === 2 ? "vks-giai-quyet" : "xep-don");

                      if (kqType === "khang-nghi") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#1b5e20" bg="#e8f5e9">⚖ Kháng nghị</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#222222" }}>Số: {(d as any).khangNghiSo || `${102 + idx}/2026/QĐ-KN-HS`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày QĐ: {(d as any).khangNghiNgay || "15/07/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "tra-loi-don") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#1a5a96" bg="#e8f4ff">📩 Trả lời đơn</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#222222" }}>Số: {(d as any).traLoiSo || `${45 + idx}/TB-TAHN`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày BH: {(d as any).traLoiNgay || "20/06/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "vks-giai-quyet") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#8a6d00" bg="#fff8e1">🏛 VKS đang giải quyết</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#222222" }}>Số CV: {(d as any).vksSo || `${210 + idx}/CV-VKSTC`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày CV: {(d as any).vksNgay || "08/08/2026"}</span>
                          </div>
                        );
                      }
                      // xep-don
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Badge color="#333333" bg="#f5f5f5">📁 Xếp đơn</Badge>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#222222" }}>QĐ số: {(d as any).xepDonSo || `${12 + idx}/QĐ-XD`}</span>
                          <span style={{ fontSize: 10, color: MUTED }}>Ngày xếp: {(d as any).xepDonNgay || "02/05/2026"}</span>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${BORDER}`,
            background: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: MUTED }}>
            Tổng cộng: <b style={{ color: TEXT }}>{donList.length} đơn</b> thuộc {isKhieuNai ? "vụ việc khiếu nại" : "vụ án"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                onClose();
                onSelectVuAn(group.id, "danh-sach-don");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 18px",
                background: "#8b1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Xem toàn bộ chi tiết {isKhieuNai ? "khiếu nại" : "vụ án"} →
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quản lý vụ án – Main View Component ───────────────────────────────────────
export type VuAnTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet";
export type ChiTietTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "muon-tra-ho-so" | "to-trinh" | "giai-quyet-vb" | "tai-lieu" | "ho-so-luu-tru";

export default function QuanLyVuAnView({
  userRole,
  setUserRole,
  onSelectVuAn,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<VuAnTabId>("dang-giai-quyet");
  const [quickViewDonGroup, setQuickViewDonGroup] = useState<VuAnGroup | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isHinhSu = !userRole || userRole === "vu-1" || userRole === "hinh-su" || userRole === "toan-bo";

  const roleGroups = filterVuAnListByRole(VU_AN_LIST, userRole);
  const filteredGroups = roleGroups
    .map((group) => {
      if (activeTab === "tat-ca") return group;
      if (activeTab === "dang-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "chua-co" || r.kqGiaiQuyet === "da-co-con-don" || !r.kqGiaiQuyet);
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      if (activeTab === "da-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "da-co");
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      return group;
    })
    .filter(Boolean) as VuAnGroup[];

  const tabs = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
  ];

  const paginBtn: React.CSSProperties = {
    padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
  };

  return (
    // Cả trang cùng cuộn: trước đây khung này `overflow: hidden` và chỉ vùng bảng
    // bên dưới mới cuộn, nên breadcrumb + tiêu đề + tabs + khối tìm kiếm + thanh
    // nút bị ghim cứng, chiếm gần nửa màn hình mà không đẩy đi được. Nay khung
    // ngoài là vùng cuộn duy nhất, khối tìm kiếm cuộn khuất khi kéo xuống bảng.
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Quản lý vụ án
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Quản lý vụ án</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as VuAnTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Panel */}
      <VuAnSearchFilterPanel
        userRole={userRole}
        onSearch={() => alert("Đang tìm kiếm danh sách vụ án...")}
      />

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }} />
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Thêm mới
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
          <Printer size={13} /> In biểu đồ
        </button>
      </div>

      {/* Table — chỉ giữ cuộn NGANG cho bảng rộng; cuộn dọc trả về khung ngoài,
          nếu để `overflow: auto` ở đây thì bảng lại thành vùng cuộn riêng và
          khối tìm kiếm bị ghim y như cũ. */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>THÔNG TIN ĐƠN & THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
              <th style={TH_STYLE}>ĐƯƠNG SỰ & NGƯỜI ĐỀ NGHỊ</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {isHinhSu
              ? filteredGroups.map((group, groupIdx) => {
                const isCollapsed = collapsedGroups[group.id];
                return (
                  <React.Fragment key={group.id}>
                    {/* Header Vụ án (Level 1: Dòng Mã Vụ Án hồng nhạt tinh gọn) */}
                    <tr
                      style={{
                        background: "#fdf3f2",
                        borderTop: `1px solid #f3c0bb`,
                        borderBottom: `1px solid #f3c0bb`,
                      }}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center", background: "#fdf3f2", padding: "4px 8px" }}>
                        <input type="checkbox" style={{ cursor: "pointer" }} />
                      </td>
                      <td colSpan={6} style={{ ...TD_STYLE, background: "#fdf3f2", padding: "5px 10px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
                          onClick={() => toggleGroupCollapse(group.id)}
                        >
                          {isCollapsed ? <ChevronRight size={14} color="#1a73e8" /> : <ChevronDown size={14} color="#1a73e8" />}
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#222222", fontFamily: F }}>
                            {groupIdx + 1}.
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1a73e8", fontFamily: F }}>
                            {group.maSo || group.id}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#222222", fontFamily: F }}>
                            – {group.tenVuAn}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Danh sách các đơn thuộc Vụ án (1 dòng = 1 đơn) */}
                    {!isCollapsed &&
                      group.rows.map((row, idx) => {
                        const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Hình sự";
                        const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                        const rowKey = `${group.id}-${row.stt}-${idx}`;
                        const isFirst = idx === 0;
                        const totalRows = group.rows.length;

                        return (
                          <tr
                            key={rowKey}
                            style={{ background: "#ffffff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                          >
                            <td style={{ ...TD_STYLE, textAlign: "center", padding: "4px 8px" }}>
                              <input type="checkbox" style={{ cursor: "pointer" }} />
                            </td>

                            {/* Cột gộp chung: STT, THÔNG TIN ĐƠN & THỤ LÝ */}
                            <td style={{ ...TD_STYLE, padding: "5px 8px", lineHeight: 1.35 }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                {/* <span style={{ color: "#888888", fontSize: 11, fontFamily: F, marginTop: 1 }}>↳</span> */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                    Số TL: <b style={{ color: "#222222" }}>{row.soThuLy}</b>
                                  </span>
                                  <span style={{ fontSize: 10.5, color: MUTED, fontFamily: F }}>
                                    Ngày TL: {row.ngayThuLy}
                                  </span>
                                  <span style={{ fontSize: 10.5, color: "#666666", fontFamily: F }}>
                                    Ngày đơn: {row.ngayThuLy}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 3 Cột chung (Thông tin bản án, Đương sự, Phân công) gộp ô theo rowSpan */}
                            {isFirst && (
                              <>
                                {/* Cột 2: Thông tin Bản án / QĐ & QHPL */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: TEXT }}>Số BA: </span>
                                      <span style={{ color: "#1a73e8", fontWeight: 600 }}>{formatSoBA(row.soBA, effectiveLoaiAn)}</span>
                                      {row.ngayBA && (
                                        <>
                                          <span style={{ color: TEXT }}> Ngày: </span>
                                          <span style={{ color: "#1a73e8" }}>{row.ngayBA}</span>
                                        </>
                                      )}
                                    </span>
                                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                      <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                                    </span>
                                    {/* <div style={{ display: "inline-block", background: "#fef9c3", border: "1px solid #fef08a", borderRadius: 3, padding: "0px 6px", width: "fit-content", fontSize: 10.5, color: "#8a6d00", fontWeight: 600 }}>
                                      Cấp xét xử: {row.capXetXu || "Tái thẩm"}
                                    </div> */}
                                  </div>
                                </td>

                                {/* Cột 3: Đương sự & Người đứng đơn */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {row.nkn && (
                                      <span style={{ fontSize: 11, fontFamily: F }}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>{label1}:</span>{" "}
                                        <span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span>
                                      </span>
                                    )}
                                    {row.biCao && (
                                      <span style={{ fontSize: 11, fontFamily: F }}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>{label2}:</span>{" "}
                                        <span style={{ fontWeight: 600, color: TEXT }}>{row.biCao}</span>
                                      </span>
                                    )}
                                    {row.ndd && (
                                      <span style={{ fontSize: 11, fontFamily: F }}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>NĐĐ:</span>{" "}
                                        <span style={{ color: TEXT }}>{row.ndd}</span>
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Cột 4: Phân công */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: MUTED }}>Công chức: </span>
                                      <span style={{ fontWeight: 600, color: TEXT }}>{row.ttv}</span>
                                    </span>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: MUTED }}>LĐ: </span>
                                      <span style={{ color: TEXT }}>{row.lanhDao}</span>
                                    </span>
                                  </div>
                                </td>
                              </>
                            )}

                            {/* Cột 5: Trạng thái (Tờ trình) */}
                            <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewDonGroup(group);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  fontSize: 11,
                                  color: "#1a73e8",
                                  fontFamily: F,
                                  textDecoration: "underline",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  fontWeight: 600,
                                }}
                              >
                                📄 {row.soToTrinh || 1} tờ trình
                              </button>
                            </td>

                            {/* Cột 6: Thao tác */}
                            <td style={{ ...TD_STYLE, textAlign: "center", padding: "5px 8px" }}>
                              <button
                                onClick={() => onSelectVuAn(group.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4 }}
                                title="Xem chi tiết"
                              >
                                <Eye size={14} color="#666666" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
              : filteredGroups.flatMap((group) =>
                group.rows.map((row, idx) => {
                  const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Dân sự";
                  const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                  const rowKey = `${group.id}-${row.stt}-${idx}`;
                  const globalIdx = filteredGroups.indexOf(group) * group.rows.length + idx;
                  return (
                    <tr
                      key={rowKey}
                      style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                        {globalIdx + 1}
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            Số: <b>{row.soThuLy}</b>
                          </span>
                          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewDonGroup(group);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 11,
                              color: "#1a73e8",
                              fontFamily: F,
                              textDecoration: "underline",
                              textAlign: "left",
                              fontWeight: 600,
                            }}
                            title="Xem nhanh danh sách đơn và thông tin trình"
                          >
                            Số đơn {group.rows.length}
                          </button>
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Số BA: </span>
                            <span style={{ color: "#1a73e8", fontWeight: 600 }}>{formatSoBA(row.soBA, effectiveLoaiAn)}</span>
                            {row.ngayBA && (
                              <>
                                <span style={{ color: TEXT }}> Ngày: </span>
                                <span style={{ color: "#1a73e8" }}>{row.ngayBA}</span>
                              </>
                            )}
                          </span>
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                          </span>
                          {row.thoiHieu && (
                            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                              <span style={{ color: TEXT }}>Thời hiệu: </span>
                              <span style={{ color: row.thoiHieu === "Không xác định thời hiệu" || row.thoiHieu === "Không có thời hiệu giải quyết" ? "#1b5e20" : "#c2410c", fontWeight: 600 }}>
                                {row.thoiHieu}
                              </span>
                            </span>
                          )}
                          {isVu234(userRole, row.loaiAn) && (
                            <span style={{ fontSize: 11, color: "#1b5e20", fontFamily: F, fontWeight: 500 }}>
                              <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{getQuanHePhapLuat(row)}
                            </span>
                          )}
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                            {row.anLoai === "chi-dao" && <Badge color="#8a6d00" bg="#fff8e1">Án chỉ đạo</Badge>}
                            {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án Quốc hội</Badge>}
                            {row.anLoai === "tvtn" && <Badge color="#1b5e20" bg="#e8f5e9">Án TVTN</Badge>}
                            </div>
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT, fontWeight: 600 }}>{label1}:</span>{" "}
                            <span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span>
                          </span>
                          {row.biCao && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: TEXT, fontWeight: 600 }}>{label2}:</span>{" "}
                              <span style={{ fontWeight: 600, color: TEXT }}>{row.biCao}</span>
                            </span>
                          )}
                          {row.ndd && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: TEXT, fontWeight: 600 }}>NĐĐ:</span>{" "}
                              <span style={{ color: TEXT }}>{row.ndd}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>Công chức: </span>{row.ttv}
                            </span>
                          )}
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: MUTED }}>TP: </span>
                            {row.thamPhan || "–"}
                          </span>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {row.kqgq === "chua-phan-cong"
                            ? <Badge color="#333333" bg="#f5f5f5">Chưa phân công Công chức</Badge>
                            : row.kqgq === "trinh-tham-phan"
                              ? <Badge color="#1a5a96" bg="#ccfbf1">Trình Thẩm phán</Badge>
                              : <Badge color="#1a5a96" bg="#e8f4ff">Trình Phó Chánh án</Badge>}

                          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e0e0e0`, paddingTop: 4 }}>
                            <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Hồ sơ</span>
                            {row.trangThaiHoSo === "chua-co" && (
                              <span style={{ fontSize: 11, color: "#666666", fontFamily: F }}>Chưa có hồ sơ</span>
                            )}
                            {row.trangThaiHoSo === "dang-muon" && (
                              <Badge color="#8a6d00" bg="#fff8e1">Đang mượn hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-co" && (
                              <Badge color="#1b5e20" bg="#e8f5e9">Đã có hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-tra" && (
                              <Badge color="#1a5a96" bg="#e8f4ff">Đã trả hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-chuyen" && (
                              <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e0e0e0`, paddingTop: 4 }}>
                            <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kết quả GQ</span>
                            {row.kqGiaiQuyet === "chua-co" && (
                              <span style={{ fontSize: 11, color: "#666666", fontFamily: F }}>Chưa có kết quả</span>
                            )}
                            {row.kqGiaiQuyet === "da-co" && (
                              <Badge color="#1b5e20" bg="#e8f5e9">Đã có kết quả</Badge>
                            )}
                            {row.kqGiaiQuyet === "da-co-con-don" && (
                              <Badge color="#8a6d00" bg="#fff8e1">Đã có KQ – còn đơn TLM</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <button
                          onClick={() => onSelectVuAn(group.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, fontSize: 18, color: MUTED, lineHeight: 1 }}
                          title="Tùy chọn"
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.reduce((s, g) => s + g.rows.length, 0)} trong tổng {filteredGroups.reduce((s, g) => s + g.rows.length, 0)} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>

      {quickViewDonGroup && (
        <QuickViewDanhSachDonModal
          group={quickViewDonGroup}
          onClose={() => setQuickViewDonGroup(null)}
          onSelectVuAn={onSelectVuAn}
          userRole={userRole}
        />
      )}
    </div>
  );
}

// ── Sub-components for ChiTietVuAn ──────────────────────────────────────────

function ThongTinChungVuAnCard({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN CHUNG CỦA VỤ ÁN</span>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
        <Badge color="#8a6d00" bg="#fff8e1">⭐ Án chỉ đạo</Badge>
        <Badge color="#6b21a8" bg="#f3e8ff">🏛️ ÁN QH</Badge>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: 10 }}>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
              {detail?.maVuAn ? `${detail.maVuAn}: ${detail.tenVuAn}` : "VA26-002039: Nguyễn Văn Minh – Tội cướp tài sản"}
            </td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại bản án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{detail?.loaiBienAn || "Sơ thẩm"}</td>
          </tr>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{detail?.namGiaiQuyet || "Giám đốc thẩm"}</td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{detail?.soNgayBanAn || "12/4/2026/HSPT – 30/12/2025"}</td>
          </tr>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Loại án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}` }}>{detail?.loaiAn || "Hình sự"}</td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{detail?.toaXetXu || "Tòa án nhân dân khu vực 1 - Hà Nội"}</td>
          </tr>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Công văn</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, borderRight: `1px solid ${BORDER}`, lineHeight: 1.7 }}>
              <b>Số 124/CV-VKSTC – 15/07/2026</b><br />
              Viện kiểm sát nhân dân thành phố Hà Nội<br />
              <span style={{ color: MUTED, fontStyle: "italic" }}>(Công văn kiến nghị GĐT)</span>
            </td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Chỉ đạo</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, lineHeight: 1.7, verticalAlign: "top" }}>
              <b>Nguyễn Văn A</b><br />
              Phó Chánh án TAND thành phố Hà Nội<br />
              <span style={{ color: MUTED }}>Xem xét kỹ hồ sơ đánh giá thương tích và yếu tố phòng vệ chính đáng</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TabDanhSachDon({ detail }: { detail: VuAnDetailData }) {
  const danhSachDon = detail?.danhSachDon || [];
  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách đơn</h3>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Tách vụ kiện
          </button>
          <button style={{ marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: 60 }} />
            <col style={{ width: "18%" }} /><col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "30%" }} /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Mã đơn", "Thông tin giải quyết đơn", "Ngày nhận đơn", "Người dùng đơn", "Phân loại", "Nội dung", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {danhSachDon.length === 0 && (
              <tr><td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {danhSachDon.map((d, idx) => (
              <tr key={d.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: "#1a73e8", fontSize: 12, fontWeight: 600 }}>{d.maDon}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#1b5e20" : MUTED, fontFamily: F }}>{d.thongTinGQ}</span>
                    {d.soThuLy && <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: {d.soThuLy}</span>}
                    {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{d.ngayThuLy}</span>}
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.ngayNhan}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.nguoiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{d.phanLoai}</span>
                    <Badge color={d.loaiDon === "DON_CHINH" ? "#1a5a96" : "#6e1414"} bg={d.loaiDon === "DON_CHINH" ? "#e8f4ff" : "#fdecea"}>
                      {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                    </Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{d.noiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem"><Eye size={14} color={MUTED} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── XemBieuMauScreen – Word editor popup for phieu templates ────────────────
function XemBieuMauScreen({ loaiPhieu, onClose }: { loaiPhieu: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13pt");
  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const execCmd = (cmd: string, val?: string) => document.execCommand(cmd, false, val);
  const today = new Date();
  const todayStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const tbBtnSt: React.CSSProperties = { padding: "4px 9px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 4 };
  const sepSt: React.CSSProperties = { width: 1, height: 18, background: BORDER, margin: "0 3px" };

  const isPhieuTra = loaiPhieu === "Phiếu trả";
  const isPhieuMuon = loaiPhieu === "Phiếu mượn" || loaiPhieu === "Phiếu chuyển";
  const isCongVan = loaiPhieu === "Công văn XM, BS" || loaiPhieu === "Công văn khác" || loaiPhieu === "Công văn xác minh";
  const title = isPhieuTra ? "PHIẾU TRẢ HỒ SƠ" : isPhieuMuon ? (loaiPhieu === "Phiếu chuyển" ? "PHIẾU CHUYỂN HỒ SƠ" : "PHIẾU MƯỢN HỒ SƠ") : "CÔNG VĂN XÁC MINH";
  const soHieu = hasNumber ? (isPhieuTra ? "18/2026/PT-TAHN" : isPhieuMuon ? "12/2026/PM-TAHN" : "527/2026/CV-TAHN") : `.../${isPhieuTra ? "PT" : isPhieuMuon ? "PM" : "CV"}-TAHN`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 12px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 980, boxShadow: "0 24px 70px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <FileText size={16} color={RED} />
          <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>Xem biểu mẫu – {loaiPhieu}</span>
          {isSaved && <span style={{ fontSize: 11, background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>✓ Đã lưu</span>}
          {hasNumber && <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>🔢 Số: {soHieu}</span>}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setIsSaved(true); }} style={{ padding: "5px 14px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>💾 Lưu</button>
            <button onClick={() => setHasNumber(v => !v)} style={{ padding: "5px 14px", background: hasNumber ? "#c0392b" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>{hasNumber ? "✕ Hủy số" : "🔢 Lấy số"}</button>
            <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>📩 Trình ký</button>
            <button onClick={onClose} style={{ padding: "5px 14px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>✕ Đóng</button>
          </div>
        </div>

        {/* Ribbon toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "#fafafa", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={() => execCmd("undo")} style={tbBtnSt}>↩ Hoàn tác</button>
          <button onClick={() => execCmd("redo")} style={tbBtnSt}>↪ Làm lại</button>
          <div style={sepSt} />
          <select onChange={e => execCmd("fontName", e.target.value)} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
          </select>
          <select onChange={e => setFontSize(e.target.value)} value={fontSize} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            {["11pt", "12pt", "13pt", "14pt"].map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={sepSt} />
          <button onClick={() => execCmd("bold")} style={tbBtnSt}><b>B</b></button>
          <button onClick={() => execCmd("italic")} style={tbBtnSt}><i>I</i></button>
          <button onClick={() => execCmd("underline")} style={tbBtnSt}><u>U</u></button>
          <div style={sepSt} />
          <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt}>⬅</button>
          <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt}>↔</button>
          <button onClick={() => execCmd("justifyRight")} style={tbBtnSt}>➡</button>
          <button onClick={() => execCmd("justifyFull")} style={tbBtnSt}>☰</button>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Zoom:</span>
            <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflowY: "auto", background: "#888888", padding: "24px 16px", display: "flex", justifyContent: "center" }}>
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              background: "#fff", width: "100%", maxWidth: 750,
              minHeight: 1050, padding: "60px 72px 70px 72px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: fontSize, color: "#000", lineHeight: 1.65,
              outline: "none", boxSizing: "border-box",
              transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            }}
          >
            {/* Quốc hiệu */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ textAlign: "center", width: "46%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontSize: 12, marginTop: 4 }}>Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soHieu}</span></div>
              </div>
              <div style={{ textAlign: "center", width: "52%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập – Tự do – Hạnh phúc</div>
                <div style={{ width: 160, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>Hà Nội, {todayStr}</div>
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17, margin: "28px 0 20px", letterSpacing: 0.5 }}>{title}</div>

            {/* Content */}
            {isPhieuTra && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân thành phố Hà Nội</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân thành phố Hà Nội trả lại hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> về Viện kiểm sát nhân dân thành phố Hà Nội theo quy định của pháp luật.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân khu vực 6 - Hà Nội"],
                      ["Giai đoạn", "Giám đốc thẩm, tái thẩm"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Thành phần hồ sơ trả về:</b> Hồ sơ vụ án (bao gồm biên bản, quyết định, bản án và các tài liệu liên quan).
                </div>
              </>
            )}
            {isPhieuMuon && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân thành phố Hà Nội</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân thành phố Hà Nội đề nghị mượn hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> để phục vụ công tác nghiên cứu, giải quyết theo thủ tục giám đốc thẩm.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân khu vực 6 - Hà Nội"],
                      ["Thời hạn mượn", "30 ngày kể từ ngày nhận hồ sơ"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Mục đích mượn:</b> Nghiên cứu hồ sơ phục vụ xét xử giám đốc thẩm theo quy định pháp luật tố tụng hình sự.
                </div>
              </>
            )}
            {isCongVan && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân Thành phố Hà Nội</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân thành phố Hà Nội nhận được đề nghị giám đốc thẩm vụ án <b>Phan Văn Thành – Bức cung</b>. Để có cơ sở xem xét, giải quyết, Tòa án nhân dân thành phố Hà Nội đề nghị Viện kiểm sát nhân dân Thành phố Hà Nội xác minh, bổ sung một số thông tin sau:
                </div>
                <div style={{ paddingLeft: 30, marginBottom: 14, lineHeight: 1.8 }}>
                  <div>1. Xác minh quá trình điều tra, truy tố, xét xử vụ án;</div>
                  <div>2. Bổ sung tài liệu, chứng cứ liên quan đến tội danh bức cung;</div>
                  <div>3. Cung cấp biên bản các phiên tòa sơ thẩm và phúc thẩm.</div>
                </div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Đề nghị Viện kiểm sát nhân dân Thành phố Hà Nội trả lời bằng văn bản trong thời hạn <b>30 ngày</b> kể từ ngày nhận công văn này./.
                </div>
              </>
            )}

            {/* Signature */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
              <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.7, width: "45%" }}>
                <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                <div>– Như kính gửi;</div>
                <div>– Đ/c Chánh án TAND thành phố Hà Nội (để b/c);</div>
                <div>– Lưu: VT, Vụ GĐ,KT.</div>
              </div>
              <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
                <div>TL. CHÁNH ÁN</div>
                <div>KT. CHÁNH VĂN PHÒNG</div>
                <div>PHÓ CHÁNH VĂN PHÒNG</div>
                <div style={{ height: 70 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaoPhieuModal({ onClose }: { onClose: () => void }) {
  const [loaiPhieu, setLoaiPhieu] = useState("");
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [diinhKem, setDinhKem] = useState(false);
  const [soPhieu, setSoPhieu] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSND thành phố Hà Nội", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const generatedNo = loaiPhieu === "Công văn xác minh"
        ? "527/2026/CV-TAHN"
        : loaiPhieu === "Phiếu trả"
          ? "18/2026/PT-TAHN"
          : "1/2026/CV-TAHN";
      setSoPhieu(generatedNo);
      setDaLaySo(true);
    } else {
      setSoPhieu("");
      setDaLaySo(false);
    }
  };

  const inSt: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };
  const lbl = (text: string, required = false) => (
    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3, display: "block" }}>
      {required && <span style={{ color: RED }}>* </span>}{text}
    </span>
  );

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14 }}>✏</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>
              {loaiPhieu === "Công văn XM, BS" ? "Tạo công văn xác minh, bổ sung" : loaiPhieu === "Công văn khác" ? "Tạo công văn" : loaiPhieu ? `Tạo ${loaiPhieu.toLowerCase()}` : "Tạo phiếu"}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><X size={18} color={MUTED} /></button>
          </div>

          <div style={{ padding: "16px 20px", overflowY: "auto" }}>
            <div style={{ background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-00321</b></span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên vụ án: </span>Vụ án Phan Văn Thành – bức cung</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Phan Văn Thành</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tội danh chính: </span>Bức cung</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>050526_CTH02</b></span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>05/05/2026</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân khu vực 6 - Hà Nội</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Giai đoạn: </span>Giám đốc thẩm, tái thẩm</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Tòa án giải quyết: </span>Tòa án nhân dân thành phố Hà Nội</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>Chưa có kết quả giải quyết đơn</span></span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Loại phiếu</span>
              </div>
              <div style={{ maxWidth: 300 }}>
                {lbl("Loại phiếu", true)}
                <select value={loaiPhieu} onChange={e => setLoaiPhieu(e.target.value)} style={selSt}>
                  <option value="">Chọn loại phiếu</option>
                  <option value="Phiếu mượn">Phiếu mượn</option>
                  <option value="Phiếu trả">Phiếu trả</option>
                  <option value="Phiếu chuyển">Phiếu chuyển</option>
                  <option value="Nhận hồ sơ">Nhận hồ sơ</option>
                  <option value="Công văn XM, BS">Công văn xác minh, bổ sung</option>
                  <option value="Công văn khác">Công văn khác</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl("Ngày lập phiếu", true)}
                  <input placeholder="Chọn ngày quyết định" style={inSt} />
                </div>
                <div>
                  {lbl("Số phiếu")}
                  <input value={soPhieu} onChange={e => setSoPhieu(e.target.value)} placeholder="Nhập số quyết định" style={inSt} />
                </div>
                <div>
                  {lbl("Người ký ban hành", true)}
                  <select style={selSt}><option value="">Chọn người ký</option><option>Nguyễn Văn A</option></select>
                </div>
                {loaiPhieu !== "Công văn XM, BS" && loaiPhieu !== "Công văn khác" && (
                  <div>
                    {lbl("Số bút lục")}
                    <input placeholder="Nhập số bút lục" style={inSt} />
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl("Đơn vị giữ hồ sơ", true)}
                  <select style={selSt}><option value="">Chọn Đơn vị giữ hồ sơ</option><option>VKSND thành phố Hà Nội</option></select>
                </div>
                <div>
                  {lbl("Tên đơn vị")}
                  <input placeholder="Nhập tên đơn vị" style={inSt} />
                </div>
                <div>
                  {lbl("Cán bộ", true)}
                  <select style={selSt}><option value="">Chọn cán bộ</option><option>Lý Thái Phúc</option></select>
                </div>
                <div>
                  {lbl("Tên cán bộ", true)}
                  <input placeholder="Nhập tên cán bộ" style={inSt} />
                </div>
              </div>
              <div>
                {lbl(loaiPhieu === "Công văn xác minh" ? "Nội dung" : "Ghi chú")}
                <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú"
                  style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>
                  <span style={{ color: RED }}>* </span>Nơi nhận
                </span>
                <button
                  onClick={() => setAddingRow(true)}
                  style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                  Thêm nơi nhận
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: 110 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
                      <th key={h} style={TH_STYLE}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noiNhanRows.map((r, idx) => (
                    <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.noiNhan}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.chiTiet}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a73e8", fontFamily: F }}>✏ Sửa</button>
                          <button onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#c0392b", fontFamily: F }}>🗑 Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {addingRow && (
                    <tr style={{ background: "#f0f7ff" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{noiNhanRows.length + 1}</td>
                      <td style={TD_STYLE}>
                        <select value={newRow.noiNhan} onChange={e => setNewRow(p => ({ ...p, noiNhan: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn nơi nhận</option>
                          <option>Viện kiểm sát</option>
                          <option>Tòa án</option>
                          <option>Cơ quan điều tra</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select value={newRow.chiTiet} onChange={e => setNewRow(p => ({ ...p, chiTiet: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn</option>
                          <option>VKSND thành phố Hà Nội</option>
                          <option>VKSND thành phố Hà Nội</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <input value={newRow.ghiChu} onChange={e => setNewRow(p => ({ ...p, ghiChu: e.target.value }))} placeholder="Nhập ghi chú" style={{ ...inSt, fontSize: 11 }} />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button onClick={() => { if (newRow.noiNhan) { setNoiNhanRows(p => [...p, { id: Date.now(), ...newRow, editing: false }]); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); setAddingRow(false); } }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a5a96", fontFamily: F, fontWeight: 600 }}>Lưu</button>
                          <button onClick={() => { setAddingRow(false); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: F }}>Hủy</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div onClick={() => setDinhKem(v => !v)} style={{ width: 36, height: 20, borderRadius: 10, background: diinhKem ? "#1a5a96" : "#cccccc", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: diinhKem ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Đính kèm tài liệu, hồ sơ</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
              <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
              <button style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lưu</button>
              <button onClick={handleToggleLaySo} style={{ padding: "7px 20px", background: daLaySo ? "#fdf3f2" : "#fff", color: daLaySo ? "#c0392b" : "#333333", border: `1px solid ${daLaySo ? "#f3c0bb" : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                {daLaySo ? "✕ Hủy cấp số" : "Lấy số"}
              </button>
              <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
              <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
            </div>
          </div>
        </div>
      </div>
      {showBieuMau && <XemBieuMauScreen loaiPhieu={loaiPhieu} onClose={() => setShowBieuMau(false)} />}
    </>
  );
}

function TabMuonTraHoSo({ detail }: { detail: VuAnDetailData }) {
  const [showModal, setShowModal] = useState(false);
  const muonTraHoSo = detail?.muonTraHoSo || [];
  return (
    <div style={{ padding: 20 }}>
      {showModal && <TaoPhieuModal onClose={() => setShowModal(false)} />}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F }}>Tổng số phiếu: {muonTraHoSo.length}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            + Tạo phiếu
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In danh sách
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "9%" }} /><col style={{ width: "7%" }} />
            <col style={{ width: "7%" }} /><col style={{ width: "9%" }} /><col style={{ width: "8%" }} />
            <col style={{ width: "13%" }} /><col style={{ width: "16%" }} /><col style={{ width: "14%" }} />
            <col style={{ width: "8%" }} /><col style={{ width: 56 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Loại phiếu", "Số phiếu", "Số bút lục", "Ngày ghi trên phiếu", "Ngày tạo", "Cán bộ", "Đơn vị giữ/chuyển hồ sơ", "Người ký duyệt", "Ghi chú", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {muonTraHoSo.length === 0 && (
              <tr><td colSpan={11} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {muonTraHoSo.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.loaiPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.soPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.soBuLuc}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.ngayGhiPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.ngayTao}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>{r.canBo}</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{r.chucVu}</span>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.donVi}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{r.nguoiKyDuyet}</span>
                    <Badge color="#8a6d00" bg="#fff8e1">{r.trangThaiKy}</Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Sửa"><Eye size={13} color={MUTED} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="In"><Printer size={13} color={MUTED} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><X size={13} color="#c0392b" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabPhanCong({ detail }: { detail: VuAnDetailData }) {
  const thamPhanRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Chiêu", chucDanh: "TPTC", ngayPC: "21/07/2026", nguoiTT: "Nguyễn Văn Hiển – Phó CA", thoiGianTT: "14:30 – 21/07/2026", ghiChu: "Phân công lại do TPB3 đề xuất kháng nghị" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Ngã", chucDanh: "TPB3", ngayPC: "01/07/2026", nguoiTT: "Nguyễn Văn Hòa – Phó CA", thoiGianTT: "14:30 – 01/07/2026", ghiChu: "TP về hưu" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Hoa", chucDanh: "TPB3", ngayPC: "21/06/2026", nguoiTT: "Nguyễn Văn Hiển – Trưởng phòng VP HCTP", thoiGianTT: "14:30 – 21/06/2026", ghiChu: "–" },
  ];

  const ttvRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Chiêu", chucDanhTTV: "Công chức", ngayPCTTV: "21/07/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Trưởng phòng", ngayPCLD: "21/07/2026" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Ngã", chucDanhTTV: "Công chức", ngayPCTTV: "01/07/2026", hoTenLD: "Nguyễn Văn Hòa", chucVuLD: "Phó Trưởng phòng", ngayPCLD: "01/07/2026" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Hoa", chucDanhTTV: "Công chức", ngayPCTTV: "21/06/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Trưởng phòng", ngayPCLD: "21/06/2026" },
  ];

  const sectionHdr = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
      <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ marginBottom: 24 }}>
        {sectionHdr("Lịch sử phân công Thẩm phán")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "GIAI ĐOẠN", "HỌ VÀ TÊN THẨM PHÁN", "CHỨC DANH", "NGÀY PHÂN CÔNG", "NGƯỜI THAO TÁC", "GHI CHÚ"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {thamPhanRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTen}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>
                    <Badge color="#1a5a96" bg="#e8f4ff">{r.chucDanh}</Badge>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPC}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                    <div>{r.nguoiTT}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.thoiGianTT}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED }}>{r.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        {sectionHdr("Lịch sử phân công Công chức và LĐV")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "GIAI ĐOẠN", "HỌ VÀ TÊN CÔNG CHỨC", "CHỨC DANH CÔNG CHỨC", "NGÀY PHÂN CÔNG CÔNG CHỨC", "HỌ VÀ TÊN LĐ", "TÊN CHỨC VỤ LĐ", "NGÀY PHÂN CÔNG LĐ"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ttvRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTenTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucDanhTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.hoTenLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucVuLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCLD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function XemBieuMauToTrinhVuAnModal({
  onClose,
  detail,
  soToTrinh,
  ngayLap,
  loaiToTrinh,
  daKySo,
}: {
  onClose: () => void;
  detail?: VuAnDetailData;
  soToTrinh?: string;
  ngayLap?: string;
  loaiToTrinh?: string;
  daKySo?: boolean;
}) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const getDoiTuongText = () => {
    const loai = ((detail?.loaiAn || (detail as any)?.linhVuc || (detail as any)?.tenVuAn || detail?.maVuAn || "") + "").toLowerCase();
    if (loai.includes("hành chính") || loai.includes("hc")) {
      const nkk = (detail as any)?.nguoiKhoiKien || (detail as any)?.nkk || (detail as any)?.ndkn || "Nguyễn Văn A";
      const nbk = (detail as any)?.nguoiBiKien || (detail as any)?.nbk || (detail as any)?.ndd || "Ủy ban nhân dân tỉnh X";
      return `Người khởi kiện (NKK): ${nkk} – Người bị kiện (NBK): ${nbk}`;
    } else if (loai.includes("dân sự") || loai.includes("ds") || loai.includes("hôn nhân") || loai.includes("lao động") || loai.includes("kinh doanh") || loai.includes("kdtm")) {
      const nguyenDon = (detail as any)?.nguyenDon || (detail as any)?.ndkn || "Trần Thị B";
      const biDon = (detail as any)?.biDon || (detail as any)?.ndd || "Nguyễn Văn C";
      return `Nguyên đơn: ${nguyenDon} – Bị đơn: ${biDon}`;
    } else if (loai.includes("khiếu nại") || loai.includes("kn")) {
      const nkn = (detail as any)?.nguoiKhieuNai || (detail as any)?.nkn || (detail as any)?.ndkn || "Lê Văn D";
      const nbkn = (detail as any)?.nguoiBiKhieuNai || "Tòa án nhân dân khu vực 1 - Hà Nội";
      return `Người khiếu nại: ${nkn} – Người bị khiếu nại: ${nbkn}`;
    } else {
      const biCan = (detail as any)?.tenBiCan || (detail as any)?.biCan || (detail as any)?.biCao || (detail as any)?.ndd || "Phan Văn Thành";
      return `Bị can/Bị cáo: ${biCan}`;
    }
  };

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT, display: "inline-flex", alignItems: "center", gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", cursor: "pointer",
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 18, background: BORDER, margin: "0 2px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f5f5f5", zIndex: 3500, display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: F }}>
      <div style={{ background: "#2b579a", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Tờ trình thẩm tra vụ án đề xuất kháng nghị Giám đốc thẩm.docx</span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>Chế độ chỉnh sửa Word trực tiếp</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => alert("Đã lưu nội dung Tờ trình Word thành công!")} style={{ padding: "7px 20px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <X size={22} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", fontSize: 12, fontFamily: F }}>
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại">↪ Làm lại</button>
        <div style={sepSt} />

        <select onChange={e => { setFontFamily(e.target.value); execCmd("fontName", e.target.value); }} value={fontFamily} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
        </select>

        <select onChange={e => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="13.5pt">13.5 pt</option>
          <option value="14pt">14 pt</option>
          <option value="16pt">16 pt</option>
        </select>
        <div style={sepSt} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân"><u>U</u></button>
        <div style={sepSt} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều">☰</button>
        <div style={sepSt} />

        <button onClick={() => window.print()} style={tbBtnSt}><Printer size={13} /> In</button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#e8f5e9", color: "#1b5e20", borderColor: "#a5d6a7", fontWeight: 600 }}>
          <Download size={13} /> Tải file Word
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cccccc" }}>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794, minHeight: 1123, background: "#fff", boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
            padding: "54px 64px", boxSizing: "border-box", transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            fontFamily: fontFamily, color: "#000", lineHeight: 1.6, fontSize: fontSize, outline: "none", cursor: "text",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>VỤ GIÁM ĐỐC, KIỂM TRA I</div>
                  <div style={{ fontSize: "12pt", marginTop: 4 }}>
                    Số: {soToTrinh || "...... /TTr-TAHN-V1"}
                  </div>
                </td>
                <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>Độc lập – Tự do – Hạnh phúc</div>
                  <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                    Hà Nội, ngày {ngayLap ? ngayLap.split("/")[0] || "..." : "..."} tháng {ngayLap ? ngayLap.split("/")[1] || "..." : "..."} năm 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center", margin: "24px 0 14px" }}>
            <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>
              {isKhieuNai ? "TỜ TRÌNH THẨM TRA VỤ VIỆC KHIẾU NẠI" : "TỜ TRÌNH THẨM TRA VỤ ÁN"}
            </div>
            <div style={{ fontSize: "13pt", fontWeight: "bold", marginTop: 4 }}>
              {isKhieuNai
                ? `Về việc giải quyết đơn khiếu nại của đương sự đối với ${detail?.tenVuAn || "Vụ việc"}`
                : `Về việc giải quyết đơn đề nghị giám đốc thẩm đối với ${detail?.tenVuAn || "Vụ án"}`}
            </div>
            <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 2, color: "#333333" }}>
              ({getDoiTuongText()})
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", marginBottom: 20 }}>
            Kính gửi: Đồng chí Phó Chánh án Tòa án nhân dân thành phố Hà Nội
          </div>

          <div style={{ textAlign: "justify", lineHeight: 1.65 }}>
            <p style={{ fontWeight: "bold", margin: "10px 0 4px" }}>
              {isKhieuNai ? "I. TÓM TẮT NỘI DUNG ĐƠN KHIẾU NẠI VÀ QUÁ TRÌNH XỬ LÝ:" : "I. TÓM TẮT NỘI DUNG VỤ ÁN VÀ QUÁ TRÌNH TỐ TỤNG:"}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Đương sự / Đối tượng trong vụ việc:</b> {getDoiTuongText()}</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Thụ lý đơn khiếu nại của đương sự đối với quyết định/hành vi tố tụng của Tòa án nhân dân cấp dưới."
                : "- Thụ lý đơn đề nghị giám đốc thẩm số 09D732899 của đương sự đối với Bản án phúc thẩm số 89/2026/PT của Tòa án nhân dân khu vực 1 - Hà Nội."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Tóm tắt nội dung khiếu nại và các tài liệu, chứng cứ có liên quan do người khiếu nại cung cấp."
                : "- Tóm tắt hành vi phạm tội và các chứng cứ đã được thu thập trong quá trình điều tra, truy tố, xét xử sơ thẩm và phúc thẩm."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>II. QUAN ĐIỂM THẨM TRA CỦA THẨM TRA VIÊN:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>Qua nghiên cứu toàn diện hồ sơ và các tài liệu chứng cứ có liên quan, Công chức nhận thấy:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "1. Căn cứ quy định của pháp luật về khiếu nại trong hoạt động tố tụng, việc khiếu nại của đương sự là có cơ sở xem xét."
                : "1. Tòa án cấp sơ thẩm và phúc thẩm có vi phạm nghiêm trọng thủ tục tố tụng trong việc đánh giá chứng cứ và không triệu tập đầy đủ người có quyền lợi, nghĩa vụ liên quan."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "2. Các tài liệu xác minh cho thấy nội dung yêu cầu khiếu nại phù hợp với các quy định pháp luật hiện hành."
                : "2. Kết luận trong bản án không phù hợp với những tình tiết khách quan của vụ án, gây thiệt hại nghiêm trọng đến quyền và lợi ích hợp pháp của đương sự."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>III. KIẾN NGHỊ VÀ ĐỀ XUẤT XỬ LÝ:</p>
            {isKhieuNai ? (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Luật Khiếu nại và các quy định pháp luật về tố tụng, kính trình Đồng chí Lãnh đạo xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Phương án đề xuất:</b> Chấp nhận khiếu nại của đương sự.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Ban hành quyết định giải quyết khiếu nại theo đúng trình tự thủ tục quy định của pháp luật.</p>
              </>
            ) : (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Điều 371 và Điều 373 Bộ luật Tố tụng hình sự năm 2015, kính trình Đồng chí Phó Chánh án Tòa án nhân dân thành phố Hà Nội xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Ban hành Quyết định kháng nghị giám đốc thẩm</b> đối với Bản án hình sự phúc thẩm số 89/2026/HS-PT.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Đề nghị Ủy ban Thẩm phán Tòa án nhân dân thành phố Hà Nội xét xử hủy bản án phúc thẩm để điều tra, xét xử lại theo đúng quy định của pháp luật.</p>
              </>
            )}

            <p style={{ fontStyle: "italic", margin: "14px 0 24px" }}>
              (Đính kèm: Dự thảo văn bản giải quyết và toàn bộ tài liệu hồ sơ có liên quan).
            </p>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>Ý KIẾN CỦA THẨM PHÁN</div>
                  <div style={{ height: 70 }} />
                  <div style={{ fontWeight: "bold" }}>{detail?.thamPhan || "Nguyễn Biên Thuỳ"}</div>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>THẨM TRA VIÊN BÁO CÁO</div>
                  <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {daKySo && (
                      <div style={{ border: "2px solid #c0392b", color: "#c0392b", padding: "3px 10px", borderRadius: 4, fontSize: "10pt", fontWeight: "bold", transform: "rotate(-5deg)" }}>
                        ✓ KÝ SỐ: Lý Thái Phúc
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: "bold" }}>{detail?.thamTraVien || "Lý Thái Phúc"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TaoToTrinhModal({
  onClose,
  onSave,
  detail,
  userRole,
}: {
  onClose: () => void;
  onSave?: (data: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => void;
  onKySo?: () => void;
  detail?: VuAnDetailData;
  userRole?: UserRoleType;
}) {
  const isVu234Role = isVu234(userRole, detail?.loaiAn);
  const isKhieuNai =
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"));

  const [ngayLap, setNgayLap] = useState("09/08/2026");
  const [tomTatNoiDung, setTomTatNoiDung] = useState("");
  const [dienBienQuaTrinh, setDienBienQuaTrinh] = useState("");

  const [donXuLyList, setDonXuLyList] = useState([
    {
      id: 1,
      nguoiGui: (detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng",
      tlm: "TLM: 10 – 22/05/2026",
      deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
      noiDung: isKhieuNai
        ? "Đề xuất Lãnh đạo Vụ xem xét, trình Chánh án TAND thành phố Hà Nội chấp nhận nội dung khiếu nại của đương sự, ban hành quyết định giải quyết khiếu nại theo quy định."
        : "Đồng ý. Giao Công chức hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TAND thành phố Hà Nội.",
    },
  ]);

  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleAddDonXuLy = () => {
    const newId = Date.now();
    setDonXuLyList(prev => [
      ...prev,
      {
        id: newId,
        nguoiGui: "Nguyễn Văn Minh (Đương sự)",
        tlm: `TLM: 11 – ${new Date().toLocaleDateString("vi-VN")}`,
        deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
        noiDung: isKhieuNai
          ? "Đề xuất chấp nhận khiếu nại của đương sự."
          : "Đồng ý. Giao Công chức hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TAND thành phố Hà Nội.",
      },
    ]);
  };

  const handleDeleteDon = (id: number) => {
    if (donXuLyList.length <= 1) {
      alert("Phải có ít nhất 1 đơn xử lý trong tờ trình!");
      return;
    }
    setDonXuLyList(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateDon = (id: number, field: string, value: string) => {
    setDonXuLyList(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ daDinhKemHoSo: true, countHoSo: donXuLyList.length, soTT: "12/TTr-TAHN-V1" });
    }
    alert("Đã lưu tờ trình thành công!");
    onClose();
  };

  const maVuAn = detail?.maVuAn || (isKhieuNai ? "KN26-002039" : "VA26-002039");
  const tenVuAn = detail?.tenVuAn || (isKhieuNai ? "Vụ việc khiếu nại của ông/bà Nguyễn Văn Minh" : "Vụ án Nguyễn Văn Minh – Tội cướp tài sản");
  const tenBiCan = "Nguyễn Văn Minh";
  const toiDanh = "Tội cướp tài sản";
  const soBA = "124/2025/HSPT";
  const ngayBA = "20/12/2025";
  const toaXetXu = "Tòa án nhân dân khu vực 1 - Hà Nội";
  const toaAnGiaiQuyet = "Tòa án nhân dân thành phố Hà Nội";
  const trangThai = isKhieuNai ? "Chưa có kết quả giải quyết khiếu nại" : "Chưa có kết quả giải quyết đơn";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1400, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      {showBieuMau && (
        <XemBieuMauToTrinhVuAnModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          soToTrinh="12/2026/TTr-TAHN-V1"
          ngayLap={ngayLap}
          loaiToTrinh={isKhieuNai ? "Tờ trình thẩm tra đề xuất giải quyết khiếu nại" : "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm"}
          daKySo={true}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 780, boxShadow: "0 10px 40px rgba(0,0,0,0.25)", marginBottom: 24, overflow: "hidden", fontFamily: F }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px 14px", borderBottom: "1px solid #e0e0e0" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#222222", fontFamily: F, flex: 1 }}>
            {isKhieuNai ? "Thêm mới tờ trình khiếu nại" : "Thêm mới tờ trình vụ án"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", padding: 4, display: "flex", alignItems: "center" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "82vh", overflowY: "auto" }}>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: "14px 18px", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.95fr", gap: "10px 18px", fontSize: 12, fontFamily: F, lineHeight: 1.5 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#333333" }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ fontWeight: 700, color: "#222222" }}>{maVuAn}</span></div>
                <div><span style={{ color: "#333333" }}>Tên {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{tenVuAn}</span></div>
                {isKhieuNai ? (
                  <>
                    <div><span style={{ color: "#333333" }}>Người khiếu nại: </span><span style={{ fontWeight: 600, color: "#222222" }}>{(detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng"}</span></div>
                    <div><span style={{ color: "#333333" }}>Nội dung KN: </span><span style={{ fontWeight: 600, color: "#222222" }}>Khiếu nại quyết định giải quyết</span></div>
                  </>
                ) : !isVu234Role ? (
                  <>
                    <div><span style={{ color: "#333333" }}>Tên bị can đầu vụ: </span><span style={{ fontWeight: 600, color: "#222222" }}>{tenBiCan}</span></div>
                    <div><span style={{ color: "#333333" }}>Tội danh chính: </span><span style={{ fontWeight: 600, color: "#222222" }}>{toiDanh}</span></div>
                  </>
                ) : (
                  <>
                    <div><span style={{ color: "#333333" }}>Nguyên đơn: </span><span style={{ fontWeight: 600, color: "#222222" }}>{detail?.nguyenDon || "Nguyễn Văn A"}</span></div>
                    <div><span style={{ color: "#333333" }}>Bị đơn: </span><span style={{ fontWeight: 600, color: "#222222" }}>{detail?.biDon || "Trần Thị B"}</span></div>
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#333333" }}>Số BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{soBA}</span></div>
                <div><span style={{ color: "#333333" }}>Ngày ra BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{ngayBA}</span></div>
                <div><span style={{ color: "#333333" }}>Tòa xét xử: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaXetXu}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#333333" }}>Tòa án giải quyết: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaAnGiaiQuyet}</span></div>
                <div><span style={{ color: "#333333" }}>Trạng thái: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{trangThai}</span></div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Ngày lập tờ trình</label>
            <input type="text" value={ngayLap} onChange={e => setNgayLap(e.target.value)} placeholder="dd/mm/yyyy" style={{ padding: "8px 12px", fontSize: 13, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, width: 200, outline: "none", background: "#fff", boxSizing: "border-box", color: "#222222" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F, borderBottom: "1px solid #e0e0e0", paddingBottom: 6, marginBottom: 10 }}>
              {isKhieuNai ? "I. NỘI DUNG ĐƠN KHIẾU NẠI" : "I. NỘI DUNG VỤ ÁN"}
            </div>
            <label style={{ fontSize: 12, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}>
              <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Tóm tắt nội dung
            </label>
            <textarea value={tomTatNoiDung} onChange={e => setTomTatNoiDung(e.target.value)} placeholder={isKhieuNai ? "Nhập tóm tắt nội dung đơn khiếu nại và yêu cầu của người khiếu nại" : "Nhập tóm tắt nội dung vụ án"} rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F, borderBottom: "1px solid #e0e0e0", paddingBottom: 6, marginBottom: 10 }}>II. QUÁ TRÌNH GIẢI QUYẾT</div>
            <label style={{ fontSize: 12, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Diễn biến quá trình giải quyết</label>
            <textarea value={dienBienQuaTrinh} onChange={e => setDienBienQuaTrinh(e.target.value)} placeholder="Nhập quá trình giải quyết vụ án" rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          {isKhieuNai ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid #e0e0e0", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, background: RED, borderRadius: 2 }} />
                  III. ĐỀ XUẤT GIẢI QUYẾT KHIẾU NẠI
                </span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#333333", fontFamily: F, display: "block", marginBottom: 8 }}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                    {[
                      "Chấp nhận khiếu nại",
                      "Không chấp nhận khiếu nại",
                      "Xếp đơn",
                      "Nghiên cứu, xác minh, bổ sung",
                    ].map(opt => {
                      const isChecked = (donXuLyList[0]?.deXuat || "Chấp nhận khiếu nại") === opt;
                      return (
                        <label
                          key={opt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                            fontSize: 13,
                            fontFamily: F,
                            color: "#222222",
                          }}
                        >
                          <input
                            type="radio"
                            name="de-xuat-khieu-nai"
                            checked={isChecked}
                            onChange={() => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", opt)}
                            style={{ accentColor: "#1a5a96", width: 16, height: 16, cursor: "pointer" }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết / Căn cứ giải quyết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung phân tích căn cứ và đề xuất chi tiết giải quyết khiếu nại..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#222222" }}
                  />
                </div>
              </div>
            </div>
          ) : isVu234Role ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px solid #e0e0e0", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <select
                    value={donXuLyList[0]?.deXuat || "Kháng nghị"}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #cccccc", borderRadius: 4, fontSize: 13, fontFamily: F, background: "#fff", color: "#222222", outline: "none", cursor: "pointer", width: 340 }}
                  >
                    <option value="Kháng nghị">Kháng nghị</option>
                    <option value="Không kháng nghị">Không kháng nghị (Thông báo không kháng nghị)</option>
                    <option value="Yêu cầu xác minh">Yêu cầu xác minh / Bổ sung hồ sơ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#333333", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung đề xuất giải quyết vụ án..."
                    rows={4}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#222222" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button type="button" onClick={handleAddDonXuLy} style={{ background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>Thêm đơn xử lý</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "8px 10px", width: 50, textAlign: "center", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>STT</th>
                    <th style={{ padding: "8px 12px", width: 180, textAlign: "left", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>Đơn</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#333333", borderRight: "1px solid #e0e0e0" }}>Đề xuất giải quyết</th>
                    <th style={{ padding: "8px 10px", width: 80, textAlign: "center", fontWeight: 600, color: "#333333" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {donXuLyList.map((item, idx) => (
                    <tr key={item.id} style={{ background: "#fff", borderBottom: idx < donXuLyList.length - 1 ? "1px solid #e0e0e0" : "none", verticalAlign: "top" }}>
                      <td style={{ padding: "12px 10px", textAlign: "center", color: "#333333", borderRight: "1px solid #e0e0e0", fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e0e0e0" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#555555", marginTop: -1 }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 600, color: "#222222", fontSize: 12 }}>{item.nguoiGui}</div>
                            <div style={{ fontSize: 11, color: "#666666", marginTop: 2 }}>{item.tlm}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e0e0e0" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <select value={item.deXuat} onChange={e => handleUpdateDon(item.id, "deXuat", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cccccc", borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", color: "#222222", outline: "none", cursor: "pointer", width: "100%" }}>
                            <option value="Kháng nghị">Kháng nghị</option>
                            <option value="Không kháng nghị">Không kháng nghị (Trả lời đơn)</option>
                            <option value="Yêu cầu xác minh">Yêu cầu xác minh / Bổ sung</option>
                            <option value="Khác">Khác</option>
                          </select>

                          <textarea value={item.noiDung} onChange={e => handleUpdateDon(item.id, "noiDung", e.target.value)} rows={3} style={{ width: "100%", padding: "6px 10px", fontSize: 12, border: "1px solid #cccccc", borderRadius: 4, fontFamily: F, outline: "none", lineHeight: 1.5, boxSizing: "border-box", resize: "vertical", color: "#222222" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                          <button type="button" onClick={() => setShowBieuMau(true)} title="Xem biểu mẫu" style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", fontSize: 13, padding: 2 }}>◇</button>
                          <button type="button" onClick={() => handleDeleteDon(item.id)} title="Xóa đơn" style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 13, padding: 2 }}><Trash2 size={14} color="#c0392b" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "14px 20px", borderTop: "1px solid #e0e0e0", background: "#fff" }}>
          <button type="button" onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: "#333333", border: "1px solid #cccccc", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>Đóng</button>
          <button type="button" onClick={handleSave} style={{ padding: "7px 32px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

function ThuHoiConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</button>
        </div>
      </div>
    </div>
  );
}

function TabToTrinh({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);

  const [lichSuData, setLichSuData] = useState([
    {
      ngayTrinh: "09/08/2026", lanh: detail?.thamPhan || "Nguyễn Biên Thuỳ", capTrinh: "Thẩm phán phụ trách", vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị GĐT", yKien: "Đồng ý với đề xuất của Công chức. Chuyển Lãnh đạo Vụ xem xét trình Chánh án.", ngayDuyet: "09/08/2026", trangThai: "da-duyet", subRows: [] as { label: string; ngayDuyet: string }[],
    },
    {
      ngayTrinh: "05/08/2026", lanh: "Lãnh đạo Tòa Hình sự", capTrinh: "Phó Trưởng phòng", vanBan: "Tờ trình xin ý kiến hướng giải quyết", yKien: "Yêu cầu Công chức thẩm tra kỹ tình tiết lời khai nhân chứng tại BL 45-50 trước khi báo cáo lại.", ngayDuyet: "06/08/2026", trangThai: "tu-choi", subRows: [],
    },
  ]);

  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const [vanBanList, setVanBanList] = useState([
    { stt: 1, loai: "to-trinh", vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm", don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)", trangThai: "–", daDinhKemHoSo: true, soHoSo: 5 },
    { stt: 2, loai: "du-thao", vanBan: "Dự thảo Quyết định kháng nghị giám đốc thẩm", don: `${detail?.maVuAn || "VA26-002621"} - Đơn 09D732899`, ngayTao: "09/08/2026", nguoiKy: "–", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 },
    { stt: 3, loai: "du-thao", vanBan: "Dự thảo Thông báo trả lời đơn đề nghị", don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "08/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)", trangThai: "Đã ký số", daDinhKemHoSo: true, soHoSo: 1 },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => {
    const toTrinhCount = vanBanList.filter(x => x.vanBan.includes("Tờ trình")).length + 1;
    const count = data?.countHoSo ?? 5;
    const isAttached = data?.daDinhKemHoSo ?? true;

    const newRow = { stt: 1, loai: "to-trinh", vanBan: `Tờ trình thẩm tra vụ án số ${toTrinhCount}`, don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)", trangThai: "–", daDinhKemHoSo: isAttached, soHoSo: count };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
    }
  };

  const handleTrinhVanBanClick = () => {
    const hasMissingHoSo = vanBanList.some(r => r.vanBan.includes("Tờ trình") && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình văn bản! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }
    const hasUnsigned = vanBanList.some(
      r => !r.vanBan.toLowerCase().includes("tờ trình") && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số")
    );
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Các văn bản Dự thảo phải được KÝ SỐ trước khi ấn Trình văn bản!");
      return;
    }
    setShowTrinhKy(true);
  };

  const allDonOptions = Array.from(new Set(lichSuData.flatMap(r => (r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean)))));
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => {
    const matchDon = !filterDon || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#333333", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  const handleSaveDuThao = (data?: any) => {
    let tenDuThao = "Dự thảo Thông báo trả lời đơn đề nghị";
    if (data?.ketQuaGQ === "khang-nghi") {
      tenDuThao = "Dự thảo Quyết định kháng nghị giám đốc thẩm";
    } else if (data?.ketQuaGQ === "xep-don") {
      tenDuThao = "Dự thảo Thông báo xếp đơn đề nghị";
    } else if (data?.ketQuaGQ === "vks-dang-giai-quyet") {
      tenDuThao = "Dự thảo Thông báo Viện kiểm sát đang giải quyết";
    }
    const newRow = { stt: 1, loai: "du-thao", vanBan: tenDuThao, don: `${detail?.maVuAn || "VA26-00321"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: data?.ngayQuyetDinh || "09/08/2026", nguoiKy: data?.nguoiKy || "Nguyễn Biên Thuỳ", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} detail={detail} userRole={userRole} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} detail={detail} onSave={handleSaveDuThao} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản & Tờ trình</span>
          <button onClick={handleTrinhVanBanClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Send size={13} /> Trình văn bản
          </button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            + Tạo dự thảo
          </button>
          <button onClick={() => setShowTaoTT(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <RefreshCw size={13} /> Tạo tờ trình
          </button>
          <button onClick={() => setShowHoSo(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Archive size={13} /> Hồ sơ tờ trình
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 600 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "TÊN VĂN BẢN", !isVu234(userRole, detail?.loaiAn) ? "ĐƠN / VỤ ÁN" : "VỤ ÁN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanBanList.map((r, idx) => {
                const isToTrinh = r.loai === "to-trinh" || r.vanBan.toLowerCase().includes("tờ trình");
                return (
                  <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                    <td style={{ ...TD, color: "#1a73e8", fontWeight: 600 }}>
                      📄 {r.vanBan}
                      {r.soHoSo ? (
                        <div style={{ fontSize: 11, color: MUTED, fontWeight: 400, marginTop: 2 }}>
                          📎 Đính kèm {r.soHoSo} hồ sơ tài liệu
                        </div>
                      ) : null}
                    </td>
                    <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.don}</td>
                    <td style={TD}>{r.ngayTao}</td>
                    <td style={TD}>{r.nguoiKy}</td>
                    <td style={TD}>
                      {isToTrinh ? (
                        <span style={{ color: MUTED }}>–</span>
                      ) : r.trangThai === "Chưa ký số" ? (
                        <Badge color="#6e1414" bg="#fdecea">Chưa ký số</Badge>
                      ) : (
                        <Badge
                          color={r.trangThai === "Đã phát hành" ? "#1b5e20" : r.trangThai === "Đã ký số" ? "#1a5a96" : "#8a6d00"}
                          bg={r.trangThai === "Đã phát hành" ? "#e8f5e9" : r.trangThai === "Đã ký số" ? "#e8f4ff" : "#fff8e1"}
                        >
                          {r.trangThai}
                        </Badge>
                      )}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isToTrinh && (
                          <button onClick={() => setShowTrinhKy(true)} title="Trình lại tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}>
                            <RotateCcw size={14} color="#1a5a96" />
                          </button>
                        )}
                        {isToTrinh && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                            <Trash2 size={14} color="#c0392b" />
                          </button>
                        )}
                        {!isToTrinh && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số") && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa dự thảo" style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                            <Trash2 size={14} color="#c0392b" />
                          </button>
                        )}
                        <button onClick={() => { if (isToTrinh) setShowTaoTT(true); else setShowTaoDuThao(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title={isToTrinh ? "Xem chi tiết tờ trình" : "Xem chi tiết dự thảo"}>
                          <Eye size={14} color="#1a5a96" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {!isVu234(userRole, detail?.loaiAn) && (
            <select value={filterDon} onChange={e => setFilterDon(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
              <option value="">Lọc theo đơn</option>
              {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN/ĐƠN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r) => {
                const realIdx = lichSuData.indexOf(r);
                return (
                  <React.Fragment key={"main-" + realIdx}>
                    <tr style={{ background: "#fff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                      <td style={TD}>{r.ngayTrinh}</td>
                      <td style={TD}>{r.lanh}</td>
                      <td style={TD}>{r.capTrinh}</td>
                      <td style={{ ...TD, color: "#1a73e8" }}>{r.vanBan}</td>
                      <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" }}>{r.yKien}</td>
                      <td style={TD}>{r.ngayDuyet}</td>
                      <td style={TD}>
                        {r.trangThai === "cho-duyet"
                          ? <Badge color="#8a6d00" bg="#fff8e1">Chờ duyệt</Badge>
                          : r.trangThai === "tu-choi"
                            ? <Badge color="#6e1414" bg="#fdecea">Từ chối</Badge>
                            : <Badge color="#1b5e20" bg="#e8f5e9">Đã duyệt</Badge>}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                            <Eye size={13} color="#1a5a96" />
                          </button>
                          {r.trangThai === "cho-duyet" && (
                            <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                          {r.trangThai === "tu-choi" ? (
                            <button title="Trình lại tờ trình" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                              <RotateCcw size={13} color="#1a5a96" />
                            </button>
                          ) : (
                            <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                              <Send size={13} color={RED} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabGiaiQuyetVB({ detail }: { detail?: VuAnDetailData }) {
  const [showThemKetQua, setShowThemKetQua] = useState(false);
  const [showThemHoan, setShowThemHoan] = useState(false);
  const [showTaiLieuHoSoModal, setShowTaiLieuHoSoModal] = useState(false);
  const [searchHoan, setSearchHoan] = useState("");
  const [isHoanChecked, setIsHoanChecked] = useState(true);
  const [quyetDinhHoanList, setQuyetDinhHoanList] = useState<Array<{
    stt: number;
    biCao: string;
    tenQuyetDinh: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    nguoiKy: string;
    nguoiTao: string;
  }>>([]);

  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleAddQuyetDinhHoan = (newItem: any) => {
    setQuyetDinhHoanList(prev => [
      ...prev,
      {
        stt: prev.length + 1,
        ...newItem,
      },
    ]);
  };

  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const groups = isKhieuNai ? [
    {
      id: "chap-nhan-khieu-nai", title: "Chấp nhận khiếu nại",
      items: [
        {
          stt: 1, maDon: "1531", soQuyetDinh: "179/2026/QĐ-GQKN", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
      ],
    },
    {
      id: "khong-chap-nhan-khieu-nai", title: "Không chấp nhận khiếu nại",
      items: [
        {
          stt: 1, maDon: "1532, 1432", soQuyetDinh: "180/2026/QĐ-GQKN", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ] : [
    {
      id: "tra-loi-don", title: "Trả lời đơn",
      items: [
        {
          stt: 1, maDon: "1531", soQuyetDinh: "179/2026/TB-TA", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
        {
          stt: 2, maDon: "1234", soQuyetDinh: "179/2026/TB-TA", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:00:38" },
        },
      ],
    },
    {
      id: "khang-nghi", title: "Kháng nghị",
      items: [
        {
          stt: 1, maDon: "1532, 1432", soQuyetDinh: "179/2026/KN-HS", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPTC", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ];

  const thSt: React.CSSProperties = { padding: "10px 8px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#333333", fontFamily: F, whiteSpace: "nowrap" };
  const tdSt: React.CSSProperties = { padding: "10px 8px", fontSize: 12, fontFamily: F, verticalAlign: "top" };

  return (
    <div style={{ padding: 20, fontFamily: F }}>
      {!isKhieuNai && showThemHoan && (
        <ThemQuyetDinhHoanModal
          onClose={() => setShowThemHoan(false)}
          detail={detail}
          onSave={handleAddQuyetDinhHoan}
        />
      )}

      {/* Modal Xem / Quản lý tài liệu hồ sơ số hóa */}
      {showTaiLieuHoSoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 16px", background: "#8b1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>📁 Quản lý tài liệu hồ sơ số hóa - Vụ án {detail?.maVuAn || "VA26-00321"}</span>
            <button onClick={() => setShowTaiLieuHoSoModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: F }}>
              <X size={16} /> Đóng xem hồ sơ
            </button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TaiLieuHoSoView vuAnId={detail?.maVuAn || "VA26-00321"} tenVuAn={detail?.tenVuAn || "Vụ án"} onBack={() => setShowTaiLieuHoSoModal(false)} />
          </div>
        </div>
      )}

      {/* Thông tin quyết định hoãn thi hành án – Chỉ hiển thị cho Vụ án, không hiển thị cho Khiếu nại */}
      {!isKhieuNai && (
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#222222", fontFamily: F }}>
              Thông tin quyết định hoãn thi hành án
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: F }}>
                <input
                  type="checkbox"
                  checked={isHoanChecked}
                  onChange={e => setIsHoanChecked(e.target.checked)}
                  style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                />
                <span>Quyết định hoãn thi hành án</span>
              </label>
              <div style={{ position: "relative", width: 220 }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchHoan}
                  onChange={e => setSearchHoan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 28px",
                    fontSize: 12,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontFamily: F,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Search size={13} color={MUTED} style={{ position: "absolute", left: 8, top: 7, pointerEvents: "none" }} />
              </div>
            </div>

            <button
              onClick={() => setShowThemHoan(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#8b1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              + Thêm mới
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
                  <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                  <th style={{ ...thSt, width: 140 }}>Tên Bị cáo</th>
                  <th style={{ ...thSt }}>Tên quyết định</th>
                  <th style={{ ...thSt, width: 120 }}>Số QĐ</th>
                  <th style={{ ...thSt, width: 110 }}>Ngày ra QĐ</th>
                  <th style={{ ...thSt, width: 160 }}>Người ký</th>
                  <th style={{ ...thSt, width: 140 }}>Người tạo</th>
                  <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quyetDinhHoanList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "28px 16px", color: MUTED, fontSize: 13, fontStyle: "italic", borderBottom: "1px solid #f5f5f5" }}>
                      Chưa có quyết định hoãn thi hành án
                    </td>
                  </tr>
                ) : (
                  quyetDinhHoanList
                    .filter(r => !searchHoan || r.tenQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()) || r.biCao.toLowerCase().includes(searchHoan.toLowerCase()) || r.soQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5", background: "#fff" }}>
                        <td style={{ ...tdSt, textAlign: "center", color: "#666666" }}>{r.stt}</td>
                        <td style={{ ...tdSt, color: "#222222", fontWeight: 600 }}>{r.biCao}</td>
                        <td style={{ ...tdSt, color: "#1a73e8", fontWeight: 500 }}>{r.tenQuyetDinh}</td>
                        <td style={{ ...tdSt, fontWeight: 500 }}>{r.soQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#333333" }}>{r.ngayQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#333333" }}>{r.nguoiKy}</td>
                        <td style={{ ...tdSt, color: "#666666" }}>{r.nguoiTao}</td>
                        <td style={{ ...tdSt, textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem chi tiết">
                              <Eye size={14} color="#1a5a96" />
                            </button>
                            <button onClick={() => setQuyetDinhHoanList(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa">
                              <Trash2 size={14} color="#c0392b" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showThemKetQua && (
        <ThemKetQuaModal
          onClose={() => { setShowThemKetQua(false); setSelectedDetail(null); }}
          detail={selectedDetail || detail}
        />
      )}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: isKhieuNai ? 0 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#222222", fontFamily: F }}>
            {isKhieuNai ? "Kết quả giải quyết khiếu nại" : "Kết quả giải quyết đơn"}
          </span>
          <button onClick={() => { setSelectedDetail(detail); setShowThemKetQua(true); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>
            + Thêm kết quả giải quyết
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groups.map(g => {
            const isCollapsed = !!collapsedGroups[g.id];
            return (
              <div key={g.id} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                  <div onClick={() => toggleGroup(g.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F }}>{g.title}</span>
                    <span style={{ fontSize: 12, color: "#666666" }}>{isCollapsed ? "▼" : "▲"}</span>
                  </div>
                  {(g.id === "khang-nghi" || g.title.toLowerCase().includes("kháng nghị")) && (
                    <button
                      type="button"
                      onClick={() => setShowTaiLieuHoSoModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8b1a1a",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: F,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      + Thêm hồ sơ
                    </button>
                  )}
                </div>

                {!isCollapsed && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                      <thead>
                        <tr style={{ background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
                          <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                          <th style={{ ...thSt, width: 100 }}>Mã đơn</th>
                          <th style={{ ...thSt, width: 140 }}>Số quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày phát hành</th>
                          <th style={{ ...thSt, width: 220 }}>Người duyệt</th>
                          <th style={{ ...thSt, width: 200 }}>Người ký</th>
                          <th style={{ ...thSt, width: 180 }}>Người tạo</th>
                          <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5", background: "#fff" }}>
                            <td style={{ ...tdSt, textAlign: "center", color: "#666666" }}>{r.stt}</td>
                            <td style={{ ...tdSt, color: "#222222" }}>{r.maDon}</td>
                            <td style={{ ...tdSt }}>
                              <span onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ color: "#1a5a96", fontWeight: 500, cursor: "pointer" }}>
                                {r.soQuyetDinh}
                              </span>
                            </td>
                            <td style={{ ...tdSt, color: "#333333" }}>{r.ngayQuyetDinh}</td>
                            <td style={{ ...tdSt, color: "#666666" }}>{r.ngayPhatHanh}</td>
                            <td style={{ ...tdSt }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {r.nguoiDuyet.map((nd, i) => (
                                  <div key={i} style={{ lineHeight: 1.3 }}>
                                    <div style={{ color: "#222222", fontWeight: 500 }}>{nd.ten}</div>
                                    <div style={{ color: "#27ae60", fontSize: 11 }}>{nd.status}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#222222", fontWeight: 500 }}>{r.nguoiKy.ten}</div>
                                <div style={{ color: r.nguoiKy.isDone ? "#27ae60" : "#666666", fontSize: 11 }}>{r.nguoiKy.status}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#222222", fontWeight: 500 }}>{r.nguoiTao.ten}</div>
                                <div style={{ color: "#666666", fontSize: 11 }}>{r.nguoiTao.thoiGian}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt, textAlign: "center" }}>
                              <button onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem chi tiết">
                                <Eye size={15} color="#666666" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function TabTaiLieu({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <TaiLieuHoSoView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

function TabHoSoLuuTru({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <HoSoLuuTruView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

// ── Chi tiết vụ án View Component ───────────────────────────────────────────
export function ChiTietVuAnView({
  vuAnId,
  userRole,
  onBack,
  initialTab = "danh-sach-don",
  moduleLabel = "Quản lý vụ án",
  detailLabel = "Chi tiết vụ án",
  entityWord = "Vụ án"
}: {
  vuAnId: string;
  userRole?: UserRoleType;
  onBack: () => void;
  initialTab?: ChiTietTab;
  moduleLabel?: string;
  detailLabel?: string;
  entityWord?: string;
}) {
  const [activeTab, setActiveTab] = useState<ChiTietTab>(initialTab);
  const safeVuAnId = vuAnId || "VA26-002621";
  const rawDetail = VU_AN_DETAILS[safeVuAnId] || VU_AN_DETAILS["VA26-002621"];
  const detail = {
    ...rawDetail,
    maVuAn: (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")) ? safeVuAnId : (rawDetail?.maVuAn || safeVuAnId),
    moduleLabel,
    detailLabel,
    entityWord,
    isKhieuNai: moduleLabel === "Quản lý khiếu nại" || entityWord === "Khiếu nại" || (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")),
  };

  const tabs: Array<{ id: ChiTietTab; label: string; count?: number }> = [
    { id: "thong-tin", label: "Thông tin chung" },
    { id: "danh-sach-don", label: "Danh sách đơn", count: detail?.danhSachDon?.length || 3 },
    { id: "phan-cong", label: "Phân công" },
    { id: "muon-tra-ho-so", label: "Mượn/trả hồ sơ", count: detail?.muonTraHoSo?.length || 2 },
    { id: "to-trinh", label: "Tờ trình", count: 3 },
    { id: "giai-quyet-vb", label: "Giải quyết văn bản", count: 3 },
    { id: "tai-lieu", label: "Tài liệu vụ án", count: 4 },
    { id: "ho-so-luu-tru", label: "Hồ sơ lưu trữ" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fafafa", overflow: "hidden", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Quay lại
          </button>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › {moduleLabel} › <b style={{ color: TEXT }}>{detailLabel}: {detail.maVuAn}</b>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Tên {entityWord.toLowerCase()}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a5a96", fontFamily: F }}>{detail.tenVuAn}</span>
          <Badge color="#1b5e20" bg="#e8f5e9">Đang giải quyết</Badge>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0, overflowX: "auto" }}>
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 18px", fontSize: 13, fontFamily: F,
                fontWeight: isActive ? 700 : 500,
                background: "none", border: "none", cursor: "pointer",
                color: isActive ? RED : MUTED,
                borderBottom: isActive ? `2px solid ${RED}` : "2px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "thong-tin" && <TabThongTin detail={detail} userRole={userRole} />}
        {activeTab === "danh-sach-don" && <TabDanhSachDon detail={detail} />}
        {activeTab === "phan-cong" && <TabPhanCong detail={detail} />}
        {activeTab === "muon-tra-ho-so" && <TabMuonTraHoSo detail={detail} />}
        {activeTab === "to-trinh" && <TabToTrinh detail={detail} userRole={userRole} />}
        {activeTab === "giai-quyet-vb" && <TabGiaiQuyetVB detail={detail} />}
        {activeTab === "tai-lieu" && <TabTaiLieu detail={detail} />}
        {activeTab === "ho-so-luu-tru" && <TabHoSoLuuTru detail={detail} />}
      </div>
    </div>
  );
}
