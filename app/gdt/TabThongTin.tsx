import React, { useState, useEffect } from "react";
import { Eye, Trash2, Sliders } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, getThoiHieuOptions, type UserRoleType } from "./shared";
import type { VuAnDetailData } from "./App";
import { LOAI_AN_OPTIONS, LoaiAn } from "./data";

export function SectionCard({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
        style={{ display: "flex", alignItems: "center", padding: "11px 16px", borderBottom: open ? `1px solid ${BORDER}` : "none", cursor: collapsible ? "pointer" : "default", userSelect: "none" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
        {collapsible && <span style={{ fontSize: 12, color: MUTED }}>{open ? "▼" : "▶"}</span>}
      </div>
      {open && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

export function InfoGrid({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 32px" }}>
      {rows.map(([lbl, val]) => (
        <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{lbl}</span>
          <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500, lineHeight: 1.5 }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export type NguoiLienQuanRow = { stt: number; hoTen: string; ngaySinh: string; cccd: string; diaChi: string; toiDanh?: string };

export interface QuaTrinhGiaiQuyetRow {
  stt: number;
  vuAn: string;
  loai: string;
  giai: string;
  soBA: string;
  ngayBA: string;
  toa: string;
  thamPhans: string[];
}

export interface TabThongTinMockData {
  thongTinChung: {
    maVuAn: string;
    loaiBanAn: string;
    thuTucGiaiQuyet: string;
    soNgayBanAn: string;
    loaiAn: LoaiAn;
    toaRaBanAn: string;
    congVan: {
      soNgay: string;
      donVi: string;
      loaiCongVan: string;
    };
    chiDao: {
      nguoiChiDao: string;
      chucVu: string;
      noiDung: string;
    };
    badges?: Array<{ label: string; color: string; bg: string }>;
  };
  denNghiGDT: {
    hasData: boolean;
    noiDung?: string;
  };
  quaTrinhGiaiQuyet: QuaTrinhGiaiQuyetRow[];
  thongTinThem: {
    thoiHieuDefault: string;
    quanHePL: string;
    quanHePLThongKe: string;
    quanHePLThongKeOptions: string[];
  };
  nguoiThamGiaToTung: {
    nhom1: { title: string; required?: boolean; rows: NguoiLienQuanRow[] };
    nhom2: { title: string; required?: boolean; rows: NguoiLienQuanRow[] };
    nhom3: { title: string; required?: boolean; hasCheckbox?: boolean; rows: NguoiLienQuanRow[] };
  };
}

// ── CẤU HÌNH FAKE DATA CHO 8 LOẠI ÁN DỄ SỬA ĐỔI / TÙY BIẾN ───────────────────
export const MOCK_DATA_BY_LOAI_AN: Record<LoaiAn, TabThongTinMockData> = {
  "Hình sự": {
    thongTinChung: {
      maVuAn: "VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "124/2026/HS-ST – 20/07/2026",
      loaiAn: "Hình sự",
      toaRaBanAn: "Tòa án nhân dân khu vực 5 - Hà Nội",
      congVan: {
        soNgay: "Số 124/CV-VKSTC – 15/07/2026",
        donVi: "Viện kiểm sát nhân dân thành phố Hà Nội",
        loaiCongVan: "(Công văn kiến nghị GĐT)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TAND thành phố Hà Nội",
        noiDung: "Xem xét kỹ hồ sơ đánh giá thương tích và yếu tố phòng vệ chính đáng",
      },
      badges: [
        { label: "⭐ Án chỉ đạo", color: "#8a6d00", bg: "#fff8e1" },
        { label: "🏛 ÁN QH", color: "#3730a3", bg: "#e0e7ff" },
      ],
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "124/2026/HS-ST", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân khu vực 5 - Hà Nội",
        thamPhans: ["Nguyễn Văn A", "Thẩm phán Bậc 1"],
      },
      {
        stt: 2,
        vuAn: "VA26-001649 – ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "236/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội",
        thamPhans: [
          "Nguyễn Văn A (Chủ tọa)", "Thẩm phán Bậc 2",
          "Trần Văn B", "Thẩm phán Bậc 2",
          "Lê Thị C", "Thẩm phán Bậc 2",
        ],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "khong-xac-dinh",
      quanHePL: "Tội cố ý gây thương tích (Điều 134 BLHS)",
      quanHePLThongKe: "Các tội xâm phạm tính mạng, sức khỏe",
      quanHePLThongKeOptions: [
        "Các tội xâm phạm tính mạng, sức khỏe",
        "Các tội xâm phạm sở hữu",
        "Các tội phạm về chức vụ",
        "Các tội xâm phạm trật tự quản lý kinh tế",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Bị cáo",
        required: true,
        rows: [{ stt: 1, hoTen: "Đặng Thị Dương", ngaySinh: "1995", cccd: "036302091038", toiDanh: "Cố ý gây thương tích (Khoản 2 Điều 134 BLHS)", diaChi: "Số nhà 7, Xã Gia Lâm, Thành phố Hà Nội" }],
      },
      nhom2: {
        title: "* Bị hại",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Văn Bình", ngaySinh: "1992", cccd: "091310391131", diaChi: "Số nhà 10, Phường Hoàn Kiếm, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người khiếu nại",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Trần Anh Tuấn", ngaySinh: "1988", cccd: "018210921313", diaChi: "Xã Sóc Sơn, Thành phố Hà Nội" }],
      },
    },
  },

  "Dân sự": {
    thongTinChung: {
      maVuAn: "VA26-003102: DƯƠNG THU HẰNG – Tranh chấp hợp đồng vay tài sản",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "102/2026/DS-ST – 18/06/2026",
      loaiAn: "Dân sự",
      toaRaBanAn: "Tòa án nhân dân khu vực 4 - Hà Nội",
      congVan: {
        soNgay: "Số 45/CV-TA – 22/06/2026",
        donVi: "TAND khu vực 4 - Hà Nội",
        loaiCongVan: "(Công văn chuyển đơn)",
      },
      chiDao: {
        nguoiChiDao: "Trần Văn B",
        chucVu: "Thẩm phán TAND thành phố Hà Nội",
        noiDung: "Thẩm tra kỹ hợp đồng thế chấp tài sản và nghĩa vụ bảo lãnh",
      },
      badges: [{ label: "⭐ Án chỉ đạo", color: "#8a6d00", bg: "#fff8e1" }],
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-003102: DƯƠNG THU HẰNG – Tranh chấp vay tài sản",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "102/2026/DS-ST", ngayBA: "18/06/2026",
        toa: "Tòa án nhân dân huyện Tiên Du",
        thamPhans: ["Phạm Văn D", "Thẩm phán Bậc 1"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp hợp đồng vay tài sản",
      quanHePLThongKe: "Tranh chấp hợp đồng dân sự",
      quanHePLThongKeOptions: [
        "Tranh chấp hợp đồng dân sự",
        "Tranh chấp quyền sở hữu tài sản",
        "Tranh chấp bồi thường thiệt hại ngoài hợp đồng",
        "Tranh chấp về thừa kế tài sản",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Dương Thu Hằng", ngaySinh: "2002", cccd: "036302091038", diaChi: "Số nhà 7, Xã Gia Lâm, Thành phố Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Thành Đô", ngaySinh: "1997", cccd: "091310391131", diaChi: "Số nhà 10, Phường Hoàn Kiếm, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Trần Anh Tuấn", ngaySinh: "1988", cccd: "018210921313", diaChi: "Xã Sóc Sơn, Thành phố Hà Nội" }],
      },
    },
  },

  "Hành chính": {
    thongTinChung: {
      maVuAn: "VA26-004150: PHẠM VĂN CƯỜNG – Khiếu kiện quyết định thu hồi đất",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "45/2026/HC-PT – 10/05/2026",
      loaiAn: "Hành chính",
      toaRaBanAn: "Tòa án nhân dân khu vực 1 - Hà Nội",
      congVan: {
        soNgay: "Số 88/CV-UBND – 12/05/2026",
        donVi: "UBND Thành phố Hà Nội",
        loaiCongVan: "(Công văn kiến nghị xem xét lại)",
      },
      chiDao: {
        nguoiChiDao: "Lê Văn C",
        chucVu: "Trưởng phòng Vụ 3",
        noiDung: "Rà soát căn cứ thu hồi đất và trình tự bồi thường giải phóng mặt bằng",
      },
      badges: [{ label: "🏛 ÁN QH", color: "#3730a3", bg: "#e0e7ff" }],
    },
    denNghiGDT: {
      hasData: true,
      noiDung: "Đề nghị xem xét bản án phúc thẩm do cho rằng quy trình bồi thường thu hồi đất chưa đúng thẩm quyền.",
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-004150: PHẠM VĂN CƯỜNG – Khiếu kiện QĐHC",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "45/2026/HC-PT", ngayBA: "10/05/2026",
        toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
        thamPhans: ["Hoàng Văn E (Chủ tọa)", "Thẩm phán Bậc 3"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "1-nam",
      quanHePL: "Khiếu kiện quyết định hành chính về bồi thường, hỗ trợ tái định cư",
      quanHePLThongKe: "Khiếu kiện QĐHC trong quản lý đất đai",
      quanHePLThongKeOptions: [
        "Khiếu kiện QĐHC trong quản lý đất đai",
        "Khiếu kiện QĐHC về xử phạt VPHC",
        "Khiếu kiện hành vi hành chính",
        "Khiếu kiện QĐHC về quản lý thị trường",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Người khởi kiện",
        required: true,
        rows: [{ stt: 1, hoTen: "Phạm Văn Cường", ngaySinh: "1975", cccd: "024075001234", diaChi: "Phường Đống Đa, Thành phố Hà Nội" }],
      },
      nhom2: {
        title: "* Người bị kiện",
        required: true,
        rows: [{ stt: 1, hoTen: "Ủy ban nhân dân huyện Yên Dũng", ngaySinh: "-", cccd: "-", diaChi: "Thị trấn Nham Biền, Huyện Yên Dũng, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Sở Tài nguyên và Môi trường Thành phố Hà Nội", ngaySinh: "-", cccd: "-", diaChi: "Thành phố Hà Nội" }],
      },
    },
  },

  "Kinh doanh thương mại": {
    thongTinChung: {
      maVuAn: "VA26-005201: CÔNG TY Á CHÂU – Tranh chấp hợp đồng mua bán hàng hóa",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "18/2026/KDTM-ST – 25/04/2026",
      loaiAn: "Kinh doanh thương mại",
      toaRaBanAn: "Tòa án nhân dân khu vực 4 - Hà Nội",
      congVan: {
        soNgay: "Số 05/CV-AC – 30/04/2026",
        donVi: "Công ty Á Châu",
        loaiCongVan: "(Đơn đề nghị kháng nghị GĐT)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TAND thành phố Hà Nội",
        noiDung: "Kiểm tra điều khoản phạt vi phạm và bồi thường thiệt hại hợp đồng",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-005201: CÔNG TY Á CHÂU – Tranh chấp hợp đồng mua bán",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "18/2026/KDTM-ST", ngayBA: "25/04/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội",
        thamPhans: ["Đỗ Văn F", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp hợp đồng mua bán hàng hóa quốc tế",
      quanHePLThongKe: "Tranh chấp hợp đồng mua bán hàng hóa",
      quanHePLThongKeOptions: [
        "Tranh chấp hợp đồng mua bán hàng hóa",
        "Tranh chấp giữa công ty với các thành viên công ty",
        "Tranh chấp hợp đồng tín dụng, ngân hàng",
        "Tranh chấp hợp đồng thi công xây dựng",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Thương mại Á Châu", ngaySinh: "-", cccd: "MSDN: 0101234567", diaChi: "Số 15 Lê Duẩn, Quận Hoàn Kiếm, Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Đầu Khí & Vật tư Kỹ thuật", ngaySinh: "-", cccd: "MSDN: 0309876543", diaChi: "KCN Tiên Sơn, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Ngân hàng TMCP Ngoại thương Việt Nam - CN Hà Nội", ngaySinh: "-", cccd: "-", diaChi: "Thành phố Hà Nội" }],
      },
    },
  },

  "Hôn nhân gia đình": {
    thongTinChung: {
      maVuAn: "VA26-006305: LÊ THỊ MAI – Tranh chấp chia tài sản chung vợ chồng",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "88/2026/HNGĐ-PT – 12/03/2026",
      loaiAn: "Hôn nhân gia đình",
      toaRaBanAn: "Tòa án nhân dân khu vực 4 - Hà Nội",
      congVan: {
        soNgay: "Số 12/CV-ĐN – 15/03/2026",
        donVi: "Văn phòng Luật sư Trí Đức",
        loaiCongVan: "(Công văn đề nghị kháng nghị)",
      },
      chiDao: {
        nguoiChiDao: "Phạm Thị D",
        chucVu: "Trưởng phòng GDT",
        noiDung: "Xác minh công sức đóng góp tạo lập khối tài sản nhà đất của vợ chồng",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-006305: LÊ THỊ MAI – Chia tài sản chung",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "88/2026/HNGĐ-PT", ngayBA: "12/03/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội",
        thamPhans: ["Bùi Thị G", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp tài sản chung vợ chồng sau ly hôn",
      quanHePLThongKe: "Chia tài sản chung vợ chồng",
      quanHePLThongKeOptions: [
        "Chia tài sản chung vợ chồng",
        "Tranh chấp thay đổi người trực tiếp nuôi con",
        "Tranh chấp xác định cha, mẹ cho con",
        "Tranh chấp về cấp dưỡng",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Lê Thị Mai", ngaySinh: "1989", cccd: "027189005678", diaChi: "Phường Ba Đình, Thành phố Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Hoàng Văn Nam", ngaySinh: "1986", cccd: "027186001234", diaChi: "Phường Cửa Nam, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Thị Phương (Mẹ ruột ông Nam)", ngaySinh: "1960", cccd: "027160009876", diaChi: "Phường Cửa Nam, Thành phố Hà Nội" }],
      },
    },
  },

  "Lao động": {
    thongTinChung: {
      maVuAn: "VA26-007412: NGUYỄN VĂN HÙNG – Tranh chấp đơn phương chấm dứt HĐLĐ",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "09/2026/LĐ-ST – 05/02/2026",
      loaiAn: "Lao động",
      toaRaBanAn: "Tòa án nhân dân khu vực 4 - Hà Nội",
      congVan: {
        soNgay: "Số 33/CV-LĐ – 10/02/2026",
        donVi: "Liên đoàn Lao động Thành phố Hà Nội",
        loaiCongVan: "(Công văn đề nghị bảo vệ quyền lợi người lao động)",
      },
      chiDao: {
        nguoiChiDao: "Trần Văn B",
        chucVu: "Thẩm phán TAND thành phố Hà Nội",
        noiDung: "Thẩm tra quy trình sa thải và nghĩa vụ trợ cấp mất việc làm",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-007412: NGUYỄN VĂN HÙNG – Tranh chấp HĐLĐ",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "09/2026/LĐ-ST", ngayBA: "05/02/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội",
        thamPhans: ["Ngô Văn H", "Thẩm phán Bậc 1"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "1-nam",
      quanHePL: "Tranh chấp về xử lý kỷ luật lao động theo hình thức sa thải",
      quanHePLThongKe: "Tranh chấp về đơn phương chấm dứt HĐLĐ",
      quanHePLThongKeOptions: [
        "Tranh chấp về đơn phương chấm dứt HĐLĐ",
        "Tranh chấp về bồi thường chi phí đào tạo",
        "Tranh chấp về bảo hiểm xã hội",
        "Tranh chấp bồi thường tai nạn lao động",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Văn Hùng", ngaySinh: "1985", cccd: "012185004321", diaChi: "Phường Thị Cầu, Thành phố Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Electronics Việt Nam", ngaySinh: "-", cccd: "MSDN: 2300123456", diaChi: "KCN Yên Phong, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Ban Quản lý các KCN Thành phố Hà Nội", ngaySinh: "-", cccd: "-", diaChi: "Thành phố Hà Nội" }],
      },
    },
  },

  "Sở hữu trí tuệ": {
    thongTinChung: {
      maVuAn: "VA26-008520: CÔNG TY DƯỢC PHẨM X – Tranh chấp quyền sở hữu công nghiệp",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "14/2026/SHTT-PT – 19/01/2026",
      loaiAn: "Sở hữu trí tuệ",
      toaRaBanAn: "Tòa án nhân dân khu vực 1 - Hà Nội",
      congVan: {
        soNgay: "Số 102/SHTT – 22/01/2026",
        donVi: "Cục Sở hữu trí tuệ",
        loaiCongVan: "(Công văn ý kiến chuyên môn nhãn hiệu)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TAND thành phố Hà Nội",
        noiDung: "Đánh giá khả năng gây nhầm lẫn của nhãn hiệu sản phẩm dược",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-008520: CÔNG TY DƯỢC X – Tranh chấp SHTT",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "14/2026/SHTT-PT", ngayBA: "19/01/2026",
        toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
        thamPhans: ["Trịnh Văn K (Chủ tọa)", "Thẩm phán Bậc 3"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "trong-han-1-nam",
      quanHePL: "Tranh chấp về bản quyền tác giả và quyền liên quan đối với nhãn hiệu",
      quanHePLThongKe: "Tranh chấp về bản quyền tác giả",
      quanHePLThongKeOptions: [
        "Tranh chấp về bản quyền tác giả",
        "Tranh chấp về nhãn hiệu và chỉ dẫn địa lý",
        "Tranh chấp về sáng chế và kiểu dáng công nghiệp",
        "Tranh chấp quyền đối với tên miền",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Dược phẩm X", ngaySinh: "-", cccd: "MSDN: 0102345678", diaChi: "Số 88 Phố Huế, Q. Hai Bà Trưng, Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Sản xuất Hóa mỹ phẩm Y", ngaySinh: "-", cccd: "MSDN: 0308765432", diaChi: "Thị xã Từ Sơn, Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Cục Sở hữu trí tuệ - Bộ KH&CN", ngaySinh: "-", cccd: "-", diaChi: "386 Nguyễn Trãi, Thanh Xuân, Hà Nội" }],
      },
    },
  },

  "Phá sản": {
    thongTinChung: {
      maVuAn: "VA26-009633: CÔNG TY XÂY DỰNG Z – Yêu cầu mở thủ tục phá sản",
      loaiBanAn: "Quyết định",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soNgayBanAn: "03/2026/QĐ-PS – 15/01/2026",
      loaiAn: "Phá sản",
      toaRaBanAn: "Tòa án nhân dân khu vực 4 - Hà Nội",
      congVan: {
        soNgay: "Số 08/CV-PS – 20/01/2026",
        donVi: "TAND khu vực 4 - Hà Nội",
        loaiCongVan: "(Quyết định chỉ định Quản tài viên)",
      },
      chiDao: {
        nguoiChiDao: "Vũ Văn L",
        chucVu: "Phó Trưởng phòng Vụ 4",
        noiDung: "Thẩm tra danh sách chủ nợ và bảng kê khai tài sản doanh nghiệp",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-009633: CÔNG TY XÂY DỰNG Z – Thủ tục phá sản",
        loai: "Quyết định", giai: "Sơ thẩm",
        soBA: "03/2026/QĐ-PS", ngayBA: "15/01/2026",
        toa: "Tòa án nhân dân khu vực 4 - Hà Nội",
        thamPhans: ["Lương Văn M", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "trong-han-1-nam",
      quanHePL: "Yêu cầu mở thủ tục phá sản doanh nghiệp",
      quanHePLThongKe: "Yêu cầu mở thủ tục phá sản",
      quanHePLThongKeOptions: [
        "Yêu cầu mở thủ tục phá sản",
        "Tuyên bố doanh nghiệp phá sản",
        "Tranh chấp liên quan đến thanh lý tài sản phá sản",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Người yêu cầu",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Vật liệu Xây dựng Miền Bắc", ngaySinh: "-", cccd: "MSDN: 0103456789", diaChi: "Quận Cầu Giấy, Hà Nội" }],
      },
      nhom2: {
        title: "* Doanh nghiệp bị yêu cầu",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Xây dựng & Hạ tầng Z", ngaySinh: "-", cccd: "MSDN: 2300987654", diaChi: "Thành phố Hà Nội" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Quản tài viên Nguyễn Văn D (Doanh nghiệp QLTS)", ngaySinh: "1980", cccd: "010180007890", diaChi: "TP. Hà Nội" }],
      },
    },
  },
};

function NguoiLienQuanTable({ rows, noMarginBottom = false, showToiDanh = false }: { rows: NguoiLienQuanRow[]; noMarginBottom?: boolean; showToiDanh?: boolean }) {
  const headers = showToiDanh
    ? ["STT", "Họ và tên / Đơn vị", "Ngày sinh / MSDN", "Tội danh", "Địa chỉ", "Thao tác"]
    : ["STT", "Họ và tên / Đơn vị", "Ngày sinh / MSDN", "Địa chỉ", "Thao tác"];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: noMarginBottom ? 0 : 16 }}>
      {showToiDanh ? (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "31%" }} />
          <col style={{ width: 70 }} />
        </colgroup>
      ) : (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "45%" }} />
          <col style={{ width: 70 }} />
        </colgroup>
      )}
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={TH_STYLE}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
            <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.hoTen}</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.ngaySinh}</td>
            {showToiDanh && (
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.toiDanh || "-"}</td>
            )}
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.diaChi}</td>
            <td style={{ ...TD_STYLE, textAlign: "center" }}>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={13} color={MUTED} /></button>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><Trash2 size={13} color={MUTED} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TabThongTin({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  // Lấy Loại án mặc định từ detail (nếu có) hoặc dựa trên userRole
  const getInitialLoaiAn = (): LoaiAn => {
    if (detail?.loaiAn && LOAI_AN_OPTIONS.includes(detail.loaiAn as LoaiAn)) {
      return detail.loaiAn as LoaiAn;
    }
    if (userRole === "vu-1" || userRole === "hinh-su") return "Hình sự";
    if (userRole === "vu-2" || userRole === "dan-su") return "Dân sự";
    if (userRole === "vu-3") return "Kinh doanh thương mại";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return "Hành chính";
    return "Hình sự";
  };

  const [selectedLoaiAn, setSelectedLoaiAn] = useState<LoaiAn>(getInitialLoaiAn());
  const subHdr: React.CSSProperties = { display: "flex", alignItems: "center", padding: "10px 0 8px", borderBottom: `1px solid ${BORDER}`, marginBottom: 10 };

  // Cập nhật selectedLoaiAn khi userRole thay đổi
  useEffect(() => {
    if (userRole === "vu-1" || userRole === "hinh-su") setSelectedLoaiAn("Hình sự");
    else if (userRole === "vu-2" || userRole === "dan-su") setSelectedLoaiAn("Dân sự");
    else if (userRole === "vu-3") setSelectedLoaiAn("Kinh doanh thương mại");
    else if (userRole === "vu-4" || userRole === "hanh-chinh") setSelectedLoaiAn("Hành chính");
  }, [userRole]);

  // Cập nhật selectedLoaiAn khi prop detail thay đổi
  useEffect(() => {
    if (detail?.loaiAn && LOAI_AN_OPTIONS.includes(detail.loaiAn as LoaiAn)) {
      setSelectedLoaiAn(detail.loaiAn as LoaiAn);
    }
  }, [detail?.loaiAn]);

  // Lấy dữ liệu mock phù hợp cho Loại án hiện tại
  const mock = MOCK_DATA_BY_LOAI_AN[selectedLoaiAn] || MOCK_DATA_BY_LOAI_AN["Hình sự"];
  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || selectedLoaiAn === "Hình sự";

  // States hỗ trợ xem / chỉnh sửa thông tin thêm
  const [thoiHieu, setThoiHieu] = useState(mock.thongTinThem.thoiHieuDefault);
  const [denNghiOpen, setDenNghiOpen] = useState(mock.denNghiGDT.hasData);
  const [quanHePL, setQuanHePL] = useState(mock.thongTinThem.quanHePL);
  const [quanHePLThongKe, setQuanHePLThongKe] = useState(mock.thongTinThem.quanHePLThongKe);

  // Khi chọn Loại án khác, đồng bộ lại state theo mock tương ứng
  useEffect(() => {
    setThoiHieu(mock.thongTinThem.thoiHieuDefault);
    setDenNghiOpen(mock.denNghiGDT.hasData);
    setQuanHePL(mock.thongTinThem.quanHePL);
    setQuanHePLThongKe(mock.thongTinThem.quanHePLThongKe);
  }, [selectedLoaiAn]);

  // Merge dữ liệu thực từ detail nếu có
  const displayMaVuAn = detail ? `${detail.maVuAn}: ${detail.tenVuAn}` : mock.thongTinChung.maVuAn;
  const displayLoaiBanAn = detail?.loaiBienAn || mock.thongTinChung.loaiBanAn;
  const displayThuTuc = detail?.namGiaiQuyet || mock.thongTinChung.thuTucGiaiQuyet;
  const displaySoNgayBA = detail?.soNgayBanAn || mock.thongTinChung.soNgayBanAn;
  const displayToa = detail?.toaXetXu || mock.thongTinChung.toaRaBanAn;

  const isKhieuNai = Boolean(
    (detail as any)?.isKhieuNai ||
    (detail as any)?.entityWord === "Khiếu nại" ||
    (detail as any)?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof (detail as any)?.maVuAn === "string" && ((detail as any).maVuAn.startsWith("KN") || (detail as any).maVuAn.includes("KN"))) ||
    (typeof (detail as any)?.id === "string" && (detail as any).id.includes("KN")) ||
    (typeof (detail as any)?.tenVuAn === "string" && (detail as any).tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  return (
    <div style={{ padding: 20 }}>

      {/* ── THÔNG TIN CHUNG ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>{isKhieuNai ? "THÔNG TIN CHUNG CỦA VỤ VIỆC KHIẾU NẠI" : "THÔNG TIN CHUNG CỦA VỤ ÁN"}</span>
        </div>
        {/* badges */}
        {mock.thongTinChung.badges && mock.thongTinChung.badges.length > 0 && (
          <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
            {mock.thongTinChung.badges.map((b, i) => (
              <Badge key={i} color={b.color} bg={b.bg}>{b.label}</Badge>
            ))}
          </div>
        )}
        {/* 4-column grid table */}
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: 10 }}>
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
          </colgroup>
          <tbody>
            {/* row 1 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{displayMaVuAn}</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displayLoaiBanAn}</td>
            </tr>
            {/* row 2 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{displayThuTuc}</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displaySoNgayBA}</td>
            </tr>
            {/* row 3 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{selectedLoaiAn}</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displayToa}</td>
            </tr>
            {/* row 4 */}
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Công văn</td>
              <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, borderRight: `1px solid ${BORDER}`, lineHeight: 1.7 }}>
                {mock.thongTinChung.congVan.soNgay}<br />
                {mock.thongTinChung.congVan.donVi}<br />
                <span style={{ color: MUTED, fontStyle: "italic" }}>{mock.thongTinChung.congVan.loaiCongVan}</span>
              </td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Chỉ đạo</td>
              <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.7, verticalAlign: "top" }}>
                {mock.thongTinChung.chiDao.nguoiChiDao}<br />
                {mock.thongTinChung.chiDao.chucVu}<br />
                {mock.thongTinChung.chiDao.noiDung}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* ── QUÁ TRÌNH GIẢI QUYẾT ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: "#e67e22", fontSize: 14 }}>⚖</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>QUÁ TRÌNH GIẢI QUYẾT</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "VỤ ÁN", "LOẠI BA/QĐ", "GIAI ĐOẠN", "SỐ BẢN ÁN", "NGÀY RA BẢN ÁN", "TÒA ÁN RA BẢN ÁN", "THẨM PHÁN XÉT XỬ"].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mock.quaTrinhGiaiQuyet.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: "#1a73e8" }}>{r.vuAn}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.loai}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{r.giai}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.soBA}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayBA}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.toa}</td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                  {r.thamPhans.reduce<React.ReactNode[]>((acc, tp, i) => {
                    if (i % 2 === 0) {
                      acc.push(
                        <div key={i} style={{ marginBottom: i < r.thamPhans.length - 2 ? 6 : 0 }}>
                          <div style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{tp}</div>
                          {r.thamPhans[i + 1] && <div style={{ fontSize: 10, color: MUTED, fontFamily: F, fontStyle: "italic" }}>{r.thamPhans[i + 1]}</div>}
                        </div>
                      );
                    }
                    return acc;
                  }, [])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Thông tin / Thời hiệu */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Thời hiệu giải quyết</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {getThoiHieuOptions(userRole, selectedLoaiAn).map(({ val, label }) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="radio" name="thoiHieu" value={val} checked={thoiHieu === val || (thoiHieu !== "1-nam" && thoiHieu !== "ko-xac-dinh" && thoiHieu !== "3-nam" && thoiHieu !== "5-nam" && val === "1-nam")} onChange={() => setThoiHieu(val)}
                    style={{ width: 14, height: 14, accentColor: RED, cursor: "pointer" }} />
                  {label}
                </label>
              ))}
            </div>
            {!isVu1 && (
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: RED }}>*</span> Quan hệ pháp luật</label>
                  <input
                    value={quanHePL}
                    onChange={e => setQuanHePL(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: RED }}>*</span> Quan hệ pháp luật thống kê</label>
                  <select
                    value={quanHePLThongKe}
                    onChange={e => setQuanHePLThongKe(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box", cursor: "pointer" }}>
                    {mock.thongTinThem.quanHePLThongKeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── THÔNG TIN NGƯỜI LIÊN QUAN ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: RED, marginRight: 6 }}>⊟</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
            {isKhieuNai ? "NGƯỜI ĐỨNG ĐƠN" : "NGƯỜI THAM GIA TỐ TỤNG"}
          </span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>

          {/* Nhóm 1: Người khiếu nại / Bị cáo (Hình sự) / Nguyên đơn / Người khởi kiện */}
          <div style={{ ...subHdr, marginTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>
              {isKhieuNai ? "* Người đứng đơn" : mock.nguoiThamGiaToTung.nhom1.title}
            </span>
            <button style={{ padding: "3px 10px", background: "none", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
          </div>
          <NguoiLienQuanTable rows={mock.nguoiThamGiaToTung.nhom1.rows} noMarginBottom={isKhieuNai} showToiDanh={isVu1} />

          {!isKhieuNai && (
            <>
              {/* Nhóm 2: Bị hại (Hình sự) / Bị đơn (Dân sự/KDTM) / Người bị kiện (Hành chính) */}
              <div style={{ ...subHdr, borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>{mock.nguoiThamGiaToTung.nhom2.title}</span>
                <button style={{ padding: "3px 10px", background: "none", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
              </div>
              <NguoiLienQuanTable rows={mock.nguoiThamGiaToTung.nhom2.rows} showToiDanh={!isVu1} />

              {/* Nhóm 3: Người có quyền lợi, nghĩa vụ liên quan */}
              <div style={{ ...subHdr, borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>{mock.nguoiThamGiaToTung.nhom3.title}</span>
                  {mock.nguoiThamGiaToTung.nhom3.hasCheckbox && <input type="checkbox" style={{ cursor: "pointer" }} defaultChecked />}
                </div>
                <button style={{ padding: "3px 10px", background: "none", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>+ Thêm mới</button>
              </div>
              <NguoiLienQuanTable rows={mock.nguoiThamGiaToTung.nhom3.rows} noMarginBottom showToiDanh={false} />
            </>
          )}
        </div>
      </div>

      {/* ── Nút Sửa thông tin ── */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 32px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
          ✏ Sửa thông tin
        </button>
      </div>
    </div>
  );
}
