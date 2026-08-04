import React from "react";
import type { DonCase, VuAnAction } from "./data";

export const F = "'Be Vietnam Pro', sans-serif";
export const RED = "#8b0000";
export const BORDER = "#e5e7eb";
export const TEXT = "#111827";
export const MUTED = "#6b7280";
export const BG = "#f9fafb";

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
    "chua-co-vu-an":        { label: "Chưa có vụ án",          color: "#92400e", bg: "#fef3c7" },
    "da-co-vu-an":          { label: "Đã có vụ án",             color: "#065f46", bg: "#d1fae5" },
    "thong-bao-giai-quyet": { label: "Đã có Thông báo giải quyết", color: "#065f46", bg: "#d1fae5" },
    "chua-co-hs":           { label: "Chưa có hồ sơ liên hành", color: "#92400e", bg: "#fef3c7" },
  };
  const s = map[status];
  if (!s) return null;
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

export function VuAnBtn({ action, onClick }: { action: VuAnAction; onClick?: () => void }) {
  const map: Record<VuAnAction, { label: string; color: string; bg: string; border: string }> = {
    "chuyen-vu-an": { label: "Chuyển vụ án",    color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
    "huy-ghep":     { label: "Hủy ghép vụ án",  color: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
    "them-vu-an":   { label: "Thêm vụ án",      color: "#ffffff", bg: RED,       border: RED       },
    "ghep-vu-an":   { label: "Ghép vụ án",      color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
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
  if (type === "an-dan-de")
    return (
      <Badge color="#78350f" bg="#fef9c3">
        ⭐ Án chỉ đạo
      </Badge>
    );
  if (type === "an-tu-hinh")
    return <Badge color="#ffffff" bg="#991b1b">🔴 Án tử hình</Badge>;
  return null;
}

export function CapXetXu({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 500,
        color: "#92400e", background: "#fef3c7",
        fontFamily: F,
      }}
    >
      Cấp xét xử: {label}
    </span>
  );
}

// ── Table header / row ───────────────────────────────────────────────────────

export const TH_STYLE: React.CSSProperties = {
  padding: "8px 8px",
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  background: "#f9fafb",
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
