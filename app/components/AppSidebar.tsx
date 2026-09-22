import React from "react";
import { Layout, Menu, Badge, ConfigProvider } from "antd";
import { CapSwitcherPill } from "./CapSwitcherPill";
import { KhoiTaiKhoanChung } from "./KhoiTaiKhoanChung";
import {
  Inbox, FolderOpen, Gavel, Users, Scale, MessageSquare, Clock, Mail, Settings,
  LayoutList, FileText, List, Send, RefreshCw, Check
} from "lucide-react";
import type { MenuProps } from "antd";

const { Sider } = Layout;

export interface AppSidebarProps {
  currentCap: "tinh" | "toicao";
  activePage: string;
  onNav: (page: string) => void;
  currentRole: string;
  globalRoleKey?: string;
  onDoiVaiTro?: (v: string) => void;
  onChuyenCap?: (cap: "toicao" | "tinh") => void;
  vanBanList?: any[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentCap,
  activePage,
  onNav,
  currentRole,
  globalRoleKey,
  onDoiVaiTro,
  onChuyenCap,
  vanBanList = []
}) => {
  const dangChoXuLy = (tt: string) => ["ChoDuyet", "ChoKy", "ChoButPhe"].includes(tt);
  const soBiTraLai = vanBanList.filter((v: any) => v.trangThai === "BiTraLai").length;
  const soChoDuyet = vanBanList.filter((v: any) => dangChoXuLy(v.trangThai)).length;
  
  const coQuyenPheDuyet = currentRole === "truong-phong" || currentRole === "pho-vp"
    || currentRole === "lanh-dao" || currentRole === "chanh-an";

  const renderBadge = (count: number) => {
    return count > 0 ? (
      <Badge 
        count={count} 
        style={{ backgroundColor: '#ff4d4f', color: '#fff', fontSize: '10px', minWidth: '16px', height: '16px', lineHeight: '16px', padding: '0 4px', boxShadow: 'none' }} 
      />
    ) : null;
  };

  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    items.push({
      key: "home",
      icon: <LayoutList size={16} />,
      label: "Trang chủ"
    });

    if (currentRole !== "can-bo-nghiep-vu" && currentRole !== "lanh-dao-phong") {
      const qlDonChildren: MenuProps['items'] = [];
      if (currentRole !== "can-bo-tiep-cong-dan" && currentRole !== "can-bo-thu-ly") {
        qlDonChildren.push({ key: "tiepnhan_don_lienthong", icon: <Inbox size={15} />, label: "Tiếp nhận đơn liên thông" });
      }
      qlDonChildren.push({ key: "list", icon: <List size={15} />, label: "Danh sách đơn" });
      qlDonChildren.push({ 
        key: "van_ban_trinh_ky", 
        icon: <Send size={15} />, 
        label: <div className="flex justify-between items-center w-full"><span>Danh sách văn bản</span>{renderBadge(soBiTraLai)}</div> 
      });

      if (!["pho-vp", "can-bo-phan-loai", "can-bo-thu-ly", "can-bo-tiep-cong-dan"].includes(currentRole)) {
        qlDonChildren.push({ key: "phancong", icon: <Users size={15} />, label: "Phân công thẩm phán" });
        qlDonChildren.push({ key: "cauhinh_pctp", icon: <Scale size={15} />, label: "Cấu hình phân công TP" });
      }

      items.push({
        key: "ql_don",
        icon: <FileText size={16} />,
        label: "Quản lý đơn",
        children: qlDonChildren
      });
    }

    if (!["pho-vp", "can-bo-phan-loai", "can-bo-thu-ly", "can-bo-tiep-cong-dan"].includes(currentRole)) {
      items.push({
        key: "ql_gdt",
        icon: <Scale size={16} />,
        label: "Quản lý án GĐT/TT",
        children: [
          { key: "gdt:don-cho-phe-duyet", label: "Nhận đơn và TL vụ án", icon: <Inbox size={15} /> },
          { key: "gdt:ho-so-khang-nghi", label: "Hồ sơ kháng nghị", icon: <FolderOpen size={15} /> },
          { key: "gdt:quan-ly-vu-an", label: "Quản lý vụ án", icon: <Gavel size={15} /> },
          { key: "gdt:phan-cong-ttv", label: "Phân công Công chức nghiên cứu", icon: <Users size={15} /> },
          { key: "gdt:quan-ly-vu-xet-xu", label: "Quản lý vụ xét xử GĐT", icon: <Scale size={15} /> },
          { key: "gdt:quan-ly-khieu-nai", label: "Quản lý khiếu nại", icon: <MessageSquare size={15} /> },
          { key: "gdt:an-quoc-hoi", label: "Án quốc hội", icon: <Scale size={15} /> },
          { key: "gdt:an-thoi-hieu", label: "Án thời hiệu", icon: <Clock size={15} /> },
          { key: "gdt:cong-van-trao-doi", label: "Công văn trao đổi", icon: <Mail size={15} /> },
          { key: "gdt:cau-hinh-ttv", label: "Cấu hình Công chức nghiên cứu báo cáo", icon: <Settings size={15} /> },
        ]
      });
    }

    if (coQuyenPheDuyet) {
      items.push({
        key: "ct_lanhdao",
        icon: <Users size={16} />,
        label: "Công tác lãnh đạo",
        children: [
          { key: "phe_duyet", icon: <Check size={15} />, label: <div className="flex justify-between items-center w-full"><span>Phê duyệt đề xuất</span>{renderBadge(soChoDuyet)}</div> }
        ]
      });
    }

    items.push({
      key: "cau_hinh",
      icon: <Settings size={16} />,
      label: "Cấu hình chung",
      children: [
        { key: "to_tham_phan", icon: <Users size={15} />, label: "Danh sách Ủy ban Thẩm phán" }
      ]
    });

    items.push({
      key: "tich_hop",
      icon: <RefreshCw size={16} />,
      label: "Tích hợp - Đồng bộ"
    });

    return items;
  };

  const getOpenKeys = () => {
    const keys = [];
    if (activePage === "tiepnhan_don_lienthong" || activePage === "list" || activePage === "form" || activePage === "prototype" || activePage === "van_ban_trinh_ky" || activePage === "phancong" || activePage === "cauhinh_pctp") {
      keys.push("ql_don");
    }
    if (activePage.startsWith("gdt:")) {
      keys.push("ql_gdt");
    }
    if (activePage === "phe_duyet") {
      keys.push("ct_lanhdao");
    }
    if (activePage === "to_tham_phan") {
      keys.push("cau_hinh");
    }
    return keys;
  };

  const normalizedActivePage = activePage === "form" || activePage === "prototype" ? "list" : activePage;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8b1a1a',
          colorBgContainer: '#ffffff',
        },
        components: {
          Menu: {
            itemBg: '#ffffff',
            itemSelectedBg: '#fdeaea',
            itemSelectedColor: '#e53935',
            itemActiveBg: '#fdeaea',
            itemHoverBg: '#f9f9f9',
            subMenuItemBg: '#ffffff',
            colorText: '#444444',
            itemHeight: 36,
          }
        }
      }}
    >
      <Sider width={240} style={{ background: '#fff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="w-[38px] h-[38px] flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#8b1a1a" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c518" strokeWidth="3" />
              <text x="50" y="56" textAnchor="middle" fill="#f5c518" fontSize="28" fontWeight="bold">⚖</text>
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] text-gray-500 font-medium">{currentCap === "toicao" ? "PHÒNG GIÁM ĐỐC KIỂM TRA" : "PHÒNG TIẾP NHẬN VÀ XỬ LÝ"}</div>
            <div className="text-[13px] font-bold text-gray-800">HỆ THỐNG QUẢN LÝ ÁN</div>
          </div>
        </div>

        <CapSwitcherPill currentCap={currentCap} onChuyenCap={onChuyenCap || (() => { })} />

        <div className="flex-1 overflow-y-auto mt-1" style={{ overflowX: 'hidden' }}>
          <Menu
            mode="inline"
            selectedKeys={[normalizedActivePage]}
            defaultOpenKeys={getOpenKeys()}
            style={{ borderRight: 'none', fontWeight: 500 }}
            items={getMenuItems()}
            onSelect={(e) => onNav(e.key)}
          />
        </div>

        <div className="flex-shrink-0 border-t border-gray-200">
          <KhoiTaiKhoanChung 
            currentCap={currentCap} 
            currentRoleKey={globalRoleKey || (currentCap + "-" + currentRole)} 
            onDoiVaiTro={onDoiVaiTro} 
          />
        </div>
      </Sider>
    </ConfigProvider>
  );
};
