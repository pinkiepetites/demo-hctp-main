import React, { useState } from "react";
import { Dropdown, MenuProps, Avatar, Divider, Space } from "antd";
import { Users, Settings, RefreshCw, ChevronDown, ChevronUp, Check, ArrowLeft } from "lucide-react";
import { NHOM_VAI_TRO_TOICAO, NHOM_VAI_TRO_TINH, type CapToaAn, findRoleDef } from "../roleConfig";

interface Props {
  currentCap: CapToaAn;
  currentRoleKey: string;
  onDoiVaiTro?: (roleKey: string) => void;
}

export const KhoiTaiKhoanChung: React.FC<Props> = ({
  currentCap,
  currentRoleKey,
  onDoiVaiTro,
}) => {
  const [open, setOpen] = useState(false);
  const [moVaiTro, setMoVaiTro] = useState(true);

  const activeDef = findRoleDef(currentRoleKey);
  const hoTen = "Nguyễn Văn A";
  const email = "nguyenvana@toaan.gov.vn";
  const donVi = activeDef.donVi;

  const chuVietTat = (name: string) => {
    const t = name.trim().split(/\s+/);
    return ((t[0]?.[0] ?? "") + (t[t.length - 1]?.[0] ?? "")).toUpperCase();
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      type: "group",
      label: (
        <div className="px-1 py-1">
          <div className="text-[13px] font-semibold text-[#1d2e4f]">{hoTen}</div>
          <div className="text-[11px] text-[#666] mt-0.5">{email}</div>
          <div className="text-[11px] text-[#888]">{donVi}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "account-info",
      icon: <Users size={13} className="text-[#666]" />,
      label: <span className="text-[12px] text-[#333]">Thông tin tài khoản</span>,
    },
    {
      key: "change-password",
      icon: <Settings size={13} className="text-[#666]" />,
      label: <span className="text-[12px] text-[#333]">Đổi mật khẩu</span>,
    },
  ];

  if (onDoiVaiTro) {
    menuItems.push({ type: "divider" });
    menuItems.push({
      key: "switch-role",
      label: (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMoVaiTro((v) => !v);
          }}
          className="flex items-center gap-2.5 text-[12px] font-medium text-[#1d2e4f] -mx-3 px-3 py-1"
        >
          <span className="text-[#8b1a1a]">
            <RefreshCw size={13} />
          </span>
          <span>Chuyển vai trò</span>
          <ChevronDown
            size={12}
            className={`ml-auto text-[#888] transition-transform ${moVaiTro ? "rotate-180" : ""}`}
          />
        </div>
      ),
    });

    if (moVaiTro) {
      menuItems.push({
        key: "role-toicao-group",
        type: "group",
        label: (
          <div className="text-[10px] font-bold tracking-wider text-[#8b1a1a] uppercase flex items-center justify-between -mx-3 px-3 py-1 bg-[#fdeaea]/50 mt-1">
            <span>Nhóm vai trò Tối cao</span>
            <span className="text-[9px] font-normal text-[#666]">TAND Tối cao</span>
          </div>
        ),
      });

      // Group Tối cao by donVi
      const groupedToiCao = NHOM_VAI_TRO_TOICAO.reduce((acc, r) => {
        if (!acc[r.donVi]) acc[r.donVi] = [];
        acc[r.donVi].push(r);
        return acc;
      }, {} as Record<string, typeof NHOM_VAI_TRO_TOICAO>);

      Object.entries(groupedToiCao).forEach(([tenDonVi, roles]) => {
        menuItems.push({
          key: `toicao-donvi-${tenDonVi}`,
          type: "group",
          label: (
            <div className="text-[11px] font-semibold text-[#666] -mx-1 px-1 pt-1.5 pb-0.5 border-b border-[#f0f0f0] mb-0.5 uppercase tracking-wide">
              {tenDonVi}
            </div>
          ),
        });

        roles.forEach((r) => {
          const isActive =
            currentCap === "toicao" && (currentRoleKey === r.key || currentRoleKey === r.innerRole);
          menuItems.push({
            key: `role-${r.key}`,
            onClick: () => {
              onDoiVaiTro(r.key);
              setOpen(false);
            },
            label: (
              <div
                className={`flex items-center gap-2 text-[12px] pl-1 ${
                  isActive ? "text-[#8b1a1a] font-semibold" : "text-[#444]"
                }`}
              >
                {isActive ? (
                  <Check size={12} className="flex-shrink-0 text-[#8b1a1a]" />
                ) : (
                  <span className="w-[12px] flex-shrink-0" />
                )}
                <span>{r.label}</span>
              </div>
            ),
            style: isActive ? { backgroundColor: "#fdeaea" } : {},
          });
        });
      });

      menuItems.push({
        key: "role-tinh-group",
        type: "group",
        label: (
          <div className="text-[10px] font-bold tracking-wider text-[#1a5a96] uppercase flex items-center justify-between -mx-3 px-3 py-1 bg-[#e8f4ff]/50 border-t border-[#eee] mt-2">
            <span>Nhóm vai trò Tỉnh</span>
            <span className="text-[9px] font-normal text-[#666]">TAND TP Hà Nội</span>
          </div>
        ),
      });

      // Group Tỉnh by donVi
      const groupedTinh = NHOM_VAI_TRO_TINH.reduce((acc, r) => {
        if (!acc[r.donVi]) acc[r.donVi] = [];
        acc[r.donVi].push(r);
        return acc;
      }, {} as Record<string, typeof NHOM_VAI_TRO_TINH>);

      Object.entries(groupedTinh).forEach(([tenDonVi, roles]) => {
        menuItems.push({
          key: `tinh-donvi-${tenDonVi}`,
          type: "group",
          label: (
            <div className="text-[11px] font-semibold text-[#666] -mx-1 px-1 pt-1.5 pb-0.5 border-b border-[#f0f0f0] mb-0.5 uppercase tracking-wide">
              {tenDonVi}
            </div>
          ),
        });

        roles.forEach((r) => {
          const isActive =
            currentCap === "tinh" && (currentRoleKey === r.key || currentRoleKey === r.innerRole);
          menuItems.push({
            key: `role-${r.key}`,
            onClick: () => {
              onDoiVaiTro(r.key);
              setOpen(false);
            },
            label: (
              <div
                className={`flex items-center gap-2 text-[12px] pl-1 ${
                  isActive ? "text-[#1a5a96] font-semibold" : "text-[#444]"
                }`}
              >
                {isActive ? (
                  <Check size={12} className="flex-shrink-0 text-[#1a5a96]" />
                ) : (
                  <span className="w-[12px] flex-shrink-0" />
                )}
                <span>{r.label}</span>
              </div>
            ),
            style: isActive ? { backgroundColor: "#e8f4ff" } : {},
          });
        });
      });
    }
  }

  menuItems.push({ type: "divider" });
  menuItems.push({
    key: "logout",
    icon: <ArrowLeft size={13} className="text-[#c0392b]" />,
    label: <span className="text-[12px] text-[#c0392b]">Đăng xuất</span>,
    danger: true,
  });

  return (
    <div className="border-t border-[#e0e0e0] flex-shrink-0 bg-white">
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="topRight"
        open={open}
        onOpenChange={setOpen}
        overlayStyle={{ minWidth: 280, maxHeight: 600, overflow: 'auto' }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#f5f5f5] transition-colors">
          <Avatar
            style={{
              backgroundColor: currentCap === "toicao" ? "#8b1a1a" : "#1a5a96",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
            }}
            size={32}
          >
            {chuVietTat(hoTen)}
          </Avatar>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#1d2e4f] truncate">{hoTen}</div>
            <div className="text-[11px] text-[#666] truncate flex items-center gap-1 mt-0.5">
              <span
                className={`inline-block px-1 py-0.5 rounded text-[9px] font-medium leading-none ${
                  currentCap === "toicao"
                    ? "bg-[#fdeaea] text-[#8b1a1a]"
                    : "bg-[#e8f4ff] text-[#1a5a96]"
                }`}
              >
                {currentCap === "toicao" ? "Tối cao" : "Cấp tỉnh"}
              </span>
              <span className="truncate">{activeDef.label}</span>
            </div>
          </div>
          <ChevronUp
            size={13}
            className={`text-[#888] flex-shrink-0 transition-transform ${open ? "" : "rotate-180"}`}
          />
        </div>
      </Dropdown>
    </div>
  );
};
