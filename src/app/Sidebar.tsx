import { useState } from "react";
import { Home, FileText, Scale, Users, ChevronDown, ChevronRight } from "lucide-react";

export type View =
  | "chua-co-vu-an"
  | "cho-y-kien"
  | "da-co-vu-an"
  | "ho-so-khang-nghi"
  | "giao-tieu-ho-so"
  | "them-ho-so"
  | "phan-cong-ttv"
  | "cau-hinh-ttv"
  | "quan-ly-vu-an"
  | "don-an-giam"
  | "ho-so-tu-hinh"
  | "cong-van-trao-doi"
  | "phan-cong-hdxx"
  | "quan-ly-vu-xet-xu"
  | "phe-duyet-de-xuat";

interface SidebarProps {
  currentView: View;
  onNavigate: (v: View) => void;
}

const ICON_SIZE = 16;
const ICON_COLOR = "#9ca3af";
const ACTIVE_COLOR = "#8b0000";

const F = "'Be Vietnam Pro', sans-serif";

function NavGroup({
  icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "10px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: F,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 14, color: "#374151", lineHeight: 1.4 }}>{label}</span>
        {open ? (
          <ChevronDown size={12} color="#9ca3af" />
        ) : (
          <ChevronRight size={12} color="#9ca3af" />
        )}
      </button>
      {open && (
        <div style={{ background: "rgba(249,250,251,0.6)" }}>{children}</div>
      )}
    </div>
  );
}

function NavLink({
  label,
  active,
  onClick,
  sub = false,
  indent = 1,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  sub?: boolean;
  indent?: number;
}) {
  const paddingLeft = sub ? (indent === 2 ? 64 : 48) : 20;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: sub ? `7px 20px 7px ${paddingLeft}px` : "10px 20px",
        background: active ? "#fef2f2" : "none",
        border: "none",
        borderLeft: active ? `3px solid ${ACTIVE_COLOR}` : "3px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: F,
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "none";
      }}
    >
      {active && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: ACTIVE_COLOR,
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: 13,
          color: active ? ACTIVE_COLOR : "#4b5563",
          fontWeight: active ? 600 : 400,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const [qldOpen, setQldOpen] = useState(true);
  const [qlaOpen, setQlaOpen] = useState(true);
  const [ctldOpen, setCtldOpen] = useState(true);
  const [athOpen, setAthOpen] = useState(false);

  const inList = [
    "chua-co-vu-an",
    "cho-y-kien",
    "da-co-vu-an",
    "ho-so-khang-nghi",
    "giao-tieu-ho-so",
    "them-ho-so",
  ].includes(currentView);

  return (
    <div
      style={{
        width: 220,
        height: "100%",
        background: "#ffffff",
        borderRight: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          height: 56,
          borderBottom: "1px solid #f3f4f6",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: ACTIVE_COLOR,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Scale size={16} color="white" />
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1f2937",
            letterSpacing: "-0.3px",
            textTransform: "uppercase",
            lineHeight: 1.2,
          }}
        >
          Hệ Thống Án
        </span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 6, paddingBottom: 16 }}>
        {/* Trang chủ */}
        <button
          style={{
            display: "flex", alignItems: "center", gap: 10,
            width: "100%", padding: "10px 20px",
            background: "none", border: "none", cursor: "pointer",
            textAlign: "left", fontFamily: F,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Home size={ICON_SIZE} color={ICON_COLOR} />
          <span style={{ fontSize: 14, color: "#374151" }}>Trang chủ</span>
        </button>

        {/* Quản lý đơn */}
        <NavGroup
          icon={<FileText size={ICON_SIZE} color={ICON_COLOR} />}
          label="Quản lý đơn"
          open={qldOpen}
          onToggle={() => setQldOpen((v) => !v)}
        >
          <NavLink label="Tiếp nhận đơn" sub />
          <NavLink label="Danh sách đơn" sub />
          <NavLink label="Phân công thẩm phán" sub />
        </NavGroup>

        {/* Quản lý án GĐT/TT */}
        <NavGroup
          icon={<Scale size={ICON_SIZE} color={ICON_COLOR} />}
          label="Quản lý án GĐT/TT"
          open={qlaOpen}
          onToggle={() => setQlaOpen((v) => !v)}
        >
          <NavLink
            label="Nhận đơn và TL vụ án"
            active={inList}
            onClick={() => onNavigate("chua-co-vu-an")}
            sub
          />
          <NavLink
            label="Quản lý vụ án"
            active={currentView === "quan-ly-vu-an"}
            onClick={() => onNavigate("quan-ly-vu-an")}
            sub
          />
          <NavLink
            label="Danh sách phân công TTV"
            active={currentView === "phan-cong-ttv"}
            onClick={() => onNavigate("phan-cong-ttv")}
            sub
          />
          <NavLink
            label="Phân công Hội đồng xét xử"
            active={currentView === "phan-cong-hdxx"}
            onClick={() => onNavigate("phan-cong-hdxx")}
            sub
          />
          <NavLink
            label="Quản lý vụ xét xử GĐT"
            active={currentView === "quan-ly-vu-xet-xu"}
            onClick={() => onNavigate("quan-ly-vu-xet-xu")}
            sub
          />
          <NavLink label="Quản lý khiếu nại" sub />
          <NavLink label="Danh sách vụ án phân côn..." sub />
          <NavLink label="Án quốc hội" sub />
          <NavLink label="Án thời hiệu" sub />
          <NavLink
            label="Công văn trao đổi"
            active={currentView === "cong-van-trao-doi"}
            onClick={() => onNavigate("cong-van-trao-doi")}
            sub
          />
          {/* Quản lý án tử hình – expandable */}
          <div>
            <button
              onClick={() => setAthOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "7px 20px 7px 48px",
                background: (currentView === "don-an-giam" || currentView === "ho-so-tu-hinh") ? "#fef2f2" : "none",
                border: "none",
                borderLeft: (currentView === "don-an-giam" || currentView === "ho-so-tu-hinh") ? `3px solid ${ACTIVE_COLOR}` : "3px solid transparent",
                cursor: "pointer", textAlign: "left", fontFamily: F,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = (currentView === "don-an-giam" || currentView === "ho-so-tu-hinh") ? "#fef2f2" : "none"; }}
            >
              <span style={{ fontSize: 13, color: "#4b5563", flex: 1, lineHeight: 1.4 }}>Quản lý án tử hình</span>
              {athOpen ? <ChevronDown size={11} color="#9ca3af" /> : <ChevronRight size={11} color="#9ca3af" />}
            </button>
            {athOpen && (
              <div style={{ background: "rgba(249,250,251,0.8)" }}>
                <NavLink
                  label="Đơn ân giảm"
                  active={currentView === "don-an-giam"}
                  onClick={() => onNavigate("don-an-giam")}
                  sub
                  indent={2}
                />
                <NavLink
                  label="Hồ sơ tử hình"
                  active={currentView === "ho-so-tu-hinh"}
                  onClick={() => onNavigate("ho-so-tu-hinh")}
                  sub
                  indent={2}
                />
              </div>
            )}
          </div>
          <NavLink
            label="Cấu hình TTV báo cáo"
            active={currentView === "cau-hinh-ttv"}
            onClick={() => onNavigate("cau-hinh-ttv")}
            sub
          />
        </NavGroup>

        {/* Công tác lãnh đạo */}
        <NavGroup
          icon={<Users size={ICON_SIZE} color={ICON_COLOR} />}
          label="Công tác lãnh đạo"
          open={ctldOpen}
          onToggle={() => setCtldOpen((v) => !v)}
        >
          <NavLink label="Phân công vụ án" sub />
          <NavLink label="Phê duyệt đề xuất" active={currentView === "phe-duyet-de-xuat"} onClick={() => onNavigate("phe-duyet-de-xuat")} sub />
        </NavGroup>
      </div>
    </div>
  );
}
