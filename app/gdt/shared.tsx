import React from "react";
import type { DonCase, VuAnAction } from "./data";

// ── Bộ màu dùng chung ────────────────────────────────────────────────────────
// Đây là điểm nối giữa module này và design system của project chính: 6 hằng số
// dưới đây được dùng ~4.200 chỗ trong module, nên đổi ở đây là đổi gần nửa giao
// diện. Giá trị lấy đúng bảng màu project chính đang dùng ở màn Danh sách đơn:
//   · #8b1a1a  đỏ đô chủ đạo (tiêu đề, tab đang chọn, nút chính)
//   · #e0e0e0  viền bảng/thẻ      · #222 chữ chính     · #666 chữ phụ
//   · #eef1f5  nền trang
// Font giữ nguyên vì hai bên vốn đã dùng chung Be Vietnam Pro (styles/fonts.css).
export const F = "'Be Vietnam Pro', sans-serif";
export const RED = "#8b1a1a";
export const BORDER = "#e0e0e0";
export const TEXT = "#222222";
export const MUTED = "#666666";
export const BG = "#eef1f5";

// ── small helpers ────────────────────────────────────────────────────────────

export function Badge({
  color,
  bg,
  children,
}: {
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 500, fontFamily: F,
        color, background: bg, whiteSpace: "nowrap",
        alignSelf: "flex-start",
      }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: DonCase["trangThai"] | undefined }) {
  if (!status) return null;
  const map = {
    "don-cho-phe-duyet": { label: "Đơn chờ phê duyệt", color: "#8a6d00", bg: "#fff8e1" },
    "da-co-vu-an": { label: "Đã có vụ án", color: "#1b5e20", bg: "#e8f5e9" },
    "thong-bao-giai-quyet": { label: "Đã có Thông báo giải quyết", color: "#1b5e20", bg: "#e8f5e9" },
    "chua-co-hs": { label: "Chưa có hồ sơ liên hành", color: "#8a6d00", bg: "#fff8e1" },
  };
  const s = map[status];
  if (!s) return null;
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

export function VuAnBtn({ action, onClick }: { action: VuAnAction; onClick?: () => void }) {
  const map: Record<VuAnAction, { label: string; color: string; bg: string; border: string }> = {
    "chuyen-vu-an": { label: "Chuyển vụ án", color: "#1a5a96", bg: "#e8f4ff", border: "#a8cdf0" },
    "huy-ghep": { label: "Hủy ghép vụ án", color: "#8a6d00", bg: "#fff8e1", border: "#f0d98a" },
    "them-vu-an": { label: "Thêm vụ án", color: "#ffffff", bg: RED, border: RED },
    "ghep-vu-an": { label: "Ghép vụ án", color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7" },
  };
  const s = map[action];
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500,
        color: s.color, background: s.bg, border: `1px solid ${s.border}`,
        cursor: "pointer", fontFamily: F, whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </button>
  );
}

export function Tag({ type }: { type: string }) {
  if (type === "an-dan-de" || type === "an-chi-dao" || type === "Án chỉ đạo")
    return (
      <Badge color="#8a6d00" bg="#fff8e1">
        ★ Án chỉ đạo
      </Badge>
    );
  if (type === "an-quoc-hoi" || type === "an-qh" || type === "Án quốc hội")
    return (
      <Badge color="#3730a3" bg="#e0e7ff">
        🏛️ Án quốc hội
      </Badge>
    );
  if (type === "an-tvtn" || type === "Án TVTN")
    return (
      <Badge color="#1b5e20" bg="#e8f5e9">
        📋 Án TVTN
      </Badge>
    );
  // Án tử hình không thuộc phạm vi module Quản lý án GĐT/TT — dữ liệu cũ còn
  // mang nhãn này thì không hiển thị gì.
  return null;
}

export function getAnDacThuOptions(userRole?: UserRoleType, loaiAnStr?: string) {
  const loai = (loaiAnStr || "").toLowerCase();
  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || loai.includes("hình sự");
  const isOtherVu = userRole === "vu-2" || userRole === "vu-3" || userRole === "vu-4" || userRole === "dan-su" || userRole === "hanh-chinh";

  if (isVu1) {
    return ["Án quốc hội", "Án chỉ đạo", "Án TVTN"];
  } else if (isOtherVu) {
    return ["Án quốc hội", "Án chỉ đạo"];
  } else {
    return ["Án quốc hội", "Án chỉ đạo", "Án TVTN"];
  }
}

export function getThoiHieuOptions(userRole?: UserRoleType, loaiAnStr?: string) {
  const loai = (loaiAnStr || "").toLowerCase();

  if (loai.includes("hình sự")) {
    return [
      { val: "1 năm", label: "1 năm" },
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
      { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    ];
  }

  if (loai && !loai.includes("hình sự")) {
    return [
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
    ];
  }

  // Nếu chưa chọn loại án cụ thể, xét theo tài khoản phân quyền userRole
  const isHinhSuRole = userRole === "vu-1" || userRole === "hinh-su";
  const isOtherRole = userRole === "vu-2" || userRole === "vu-3" || userRole === "vu-4" || userRole === "dan-su" || userRole === "hanh-chinh";

  if (isHinhSuRole) {
    return [
      { val: "1 năm", label: "1 năm" },
      { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    ];
  }

  if (isOtherRole) {
    return [
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
    ];
  }

  return [
    { val: "1 năm", label: "1 năm" },
    { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    { val: "3 năm", label: "3 năm" },
    { val: "5 năm", label: "5 năm" },
  ];
}

export function CapXetXu({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 500,
        color: "#8a6d00", background: "#fff8e1",
        fontFamily: F, alignSelf: "flex-start",
      }}
    >
      {/* Cấp xét xử: {label} */}
    </span>
  );
}

// ── Table header / row ───────────────────────────────────────────────────────

export const TH_STYLE: React.CSSProperties = {
  padding: "8px 8px",
  fontSize: 11,
  fontWeight: 700,
  color: "#333333",
  background: "#fafafa",
  borderBottom: `1px solid ${BORDER}`,
  textAlign: "left" as const,
  fontFamily: F,
  borderRight: `1px solid ${BORDER}`,
  wordBreak: "break-word",
  lineHeight: 1.3,
};

export const TD_STYLE: React.CSSProperties = {
  padding: "10px 8px",
  verticalAlign: "top",
  borderBottom: `1px solid ${BORDER}`,
  borderRight: `1px solid ${BORDER}`,
  fontFamily: F,
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

export type UserRoleType = "vu-1" | "vu-2" | "vu-3" | "vu-4" | "toan-bo" | "hinh-su" | "dan-su" | "hanh-chinh";

export interface DepartmentInfo {
  code: string;
  maDonVi: string;
  tenDayDu: string;
  tenRutGon: string;
  loaiAnChinh: string;
  loaiAnList: string[];
  donViNhanMacDinh: string;
  nguoiLienQuanLabels: {
    ben1: string;
    ben2: string;
    ben3: string;
  };
}

export function getDepartmentInfo(role: UserRoleType): DepartmentInfo {
  if (role === "vu-1" || role === "hinh-su") {
    return {
      code: "D01.106",
      maDonVi: "D01",
      tenDayDu: "Tòa Hình sự",
      tenRutGon: "Tòa Hình sự",
      loaiAnChinh: "Hình sự",
      loaiAnList: ["Hình sự"],
      donViNhanMacDinh: "Tòa Hình sự",
      nguoiLienQuanLabels: {
        ben1: "Bị cáo",
        ben2: "Bị hại",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-2" || role === "dan-su") {
    return {
      code: "D01.107",
      maDonVi: "D01",
      tenDayDu: "Tòa Dân sự",
      tenRutGon: "Tòa Dân sự",
      loaiAnChinh: "Dân sự",
      loaiAnList: ["Dân sự"],
      donViNhanMacDinh: "Tòa Dân sự",
      nguoiLienQuanLabels: {
        ben1: "Nguyên đơn",
        ben2: "Bị đơn",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-3") {
    return {
      code: "D01.108",
      maDonVi: "D01",
      tenDayDu: "Tòa Kinh tế, gia đình và người chưa thành niên",
      tenRutGon: "Tòa Hành chính",
      loaiAnChinh: "Kinh doanh thương mại",
      loaiAnList: ["Kinh doanh thương mại", "Phá sản", "Lao động", "Hôn nhân gia đình", "Sở hữu trí tuệ"],
      donViNhanMacDinh: "Tòa Hành chính",
      nguoiLienQuanLabels: {
        ben1: "Nguyên đơn",
        ben2: "Bị đơn",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-4" || role === "hanh-chinh") {
    return {
      code: "D01.109",
      maDonVi: "D01",
      tenDayDu: "Tòa Hành chính",
      tenRutGon: "Tòa Kinh tế",
      loaiAnChinh: "Hành chính",
      loaiAnList: ["Hành chính"],
      donViNhanMacDinh: "Tòa Kinh tế",
      nguoiLienQuanLabels: {
        ben1: "Người khởi kiện",
        ben2: "Người bị kiện",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  return {
    code: "TAND thành phố Hà Nội",
    maDonVi: "D01",
    tenDayDu: "Lãnh đạo TAND thành phố Hà Nội / Quản trị viên hệ thống",
    tenRutGon: "Toàn bộ Vụ án (4 Vụ)",
    loaiAnChinh: "Toàn bộ các loại án",
    loaiAnList: ["Hình sự", "Dân sự", "Kinh doanh thương mại", "Hành chính", "Lao động", "Hôn nhân gia đình"],
    donViNhanMacDinh: "Tòa án nhân dân thành phố Hà Nội",
    nguoiLienQuanLabels: {
      ben1: "Nguyên đơn / Bị cáo / Người khởi kiện",
      ben2: "Bị đơn / Bị hại / Người bị kiện",
      ben3: "Người có quyền lợi và nghĩa vụ liên quan",
    },
  };
}

// Thanh "Tài khoản phân quyền" đã bỏ khỏi module Quản lý án GĐT/TT: cán bộ xử lý
// đơn GĐT/TT dùng chính tài khoản đang đăng nhập, nên không còn chỗ nào cho người
// dùng tự đổi vai trò giữa các Tòa chuyên trách ngay trên giao diện.
// `UserRoleType` và tham số `userRole` vẫn giữ — các màn còn lọc dữ liệu theo Tòa
// phụ trách, chỉ khác là giá trị nay đến từ tài khoản chứ không từ ô chọn.
