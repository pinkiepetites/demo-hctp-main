import React from "react";
import { Layout, Badge, Button, Dropdown } from "antd";
import { Bell, Menu, FileText, X, RotateCcw, AlertCircle } from "lucide-react";
import type { MenuProps } from "antd";

const { Header } = Layout;

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

export interface AppHeaderProps {
  currentCap: "tinh" | "toicao";
  donChiTietTabMoi?: any;
  view: string;
  editingRow?: any;
  editingRowId?: any;
  ocrStatus?: string;
  ocrFieldsSize?: number;
  onClearOcrFields?: () => void;
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: number) => void;
  onShowTraLaiForm?: () => void;
  onCancelForm?: () => void;
  onSaveForm?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentCap,
  donChiTietTabMoi,
  view,
  editingRow,
  editingRowId,
  ocrStatus,
  ocrFieldsSize = 0,
  onClearOcrFields,
  notifications = [],
  onMarkAllRead,
  onMarkRead,
  onShowTraLaiForm,
  onCancelForm,
  onSaveForm
}) => {
  const getPageTitle = () => {
    if (donChiTietTabMoi) return `Chi tiết đơn ${donChiTietTabMoi.maDon}`;
    if (view === "list") return "Danh sách đơn";
    if (view === "prototype") return "Prototype: Luồng Ghép đơn";
    if (view === "bieumau") return "Danh sách biểu mẫu đơn";
    if (view === "wordeditor") return "Chỉnh sửa biểu mẫu";
    if (editingRow) return `Sửa đơn ${editingRow.maDon}`;
    return "Thêm mới Đơn đề nghị GĐT/TT";
  };

  const renderOcrBadge = () => {
    if (editingRowId !== null) return null;
    if (ocrStatus === "dang") return <span className="bg-[#fffbeb] text-[#92400e] border-[#f59e0b] border px-2 py-0.5 rounded-[3px] text-[11px] flex items-center gap-1"><AlertCircle size={12}/> Đang nhận diện...</span>;
    if (ocrStatus === "thatbai") return <span className="bg-[#fdecea] text-error border-[#e57373] border px-2 py-0.5 rounded-[3px] text-[11px] flex items-center gap-1"><X size={12}/> Nhận diện thất bại</span>;
    if (ocrStatus === "thanhcong") return <span className="bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb] border px-2 py-0.5 rounded-[3px] text-[11px] flex items-center gap-1">Đã nhận diện OCR</span>;
    return <span className="bg-[#f5f7fa] text-[#4a5568] border-[#ccd3dd] border px-2 py-0.5 rounded-[3px] text-[11px]">Chưa OCR</span>;
  };

  const notificationMenu = (
    <div className="w-[320px] bg-white rounded-[4px] shadow-lg border border-gray-200 z-50 text-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="font-semibold text-[13px]">Thông báo</span>
        <Button onClick={onMarkAllRead} className="text-[11px] text-[#8b1a1a] hover:underline">Đánh dấu đã đọc</Button>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-[12px]">Không có thông báo nào</div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => onMarkRead?.(n.id)} className={`p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50' : ''}`}>
            <p className="text-[12px] leading-snug">{n.text}</p>
            <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Header style={{ background: '#8b1a1a', height: '46px', lineHeight: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="flex items-center gap-2 mr-4 text-white">
        <div className="w-[30px] h-[30px] bg-white/20 rounded flex items-center justify-center">
          <Menu size={16} />
        </div>
        <div className="leading-tight mt-1">
          <div className="text-[10px] text-white/70">{currentCap === 'toicao' ? 'TÒA ÁN NHÂN DÂN TỐI CAO' : 'TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI'}</div>
          <div className="text-[12px] font-bold">HỆ THỐNG QUẢN LÝ ÁN</div>
        </div>
      </div>
      
      <div className="h-5 w-px bg-white/30 mr-3" />
      
      <span className="text-[13px] font-semibold text-white/90 flex items-center gap-1.5">
        <FileText size={14} />
        {getPageTitle()}
      </span>
      
      <div className="ml-auto flex items-center gap-4">
        <Dropdown dropdownRender={() => notificationMenu} trigger={['click']} placement="bottomRight">
          <Badge dot={notifications.some(n => !n.read)} offset={[-4, 4]}>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer">
              <Bell size={16} />
            </div>
          </Badge>
        </Dropdown>
        
        {donChiTietTabMoi ? (
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <Button htmlType="button" onClick={() => window.close()}
              className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
              <X size={13} /> Đóng tab
            </Button>
          </div>
        ) : view === "form" ? (
          <div className="flex items-center gap-2 border-l border-white/20 pl-4 h-full py-2">
            {renderOcrBadge()}
            {ocrFieldsSize > 0 && (
              <Button onClick={onClearOcrFields}
                className="flex items-center gap-1 h-[28px] px-2 rounded-[3px] border border-white/20 text-white/80 hover:bg-white/10 text-[11px] transition-colors">
                <X size={10} /> Xóa highlight
              </Button>
            )}
            <Button htmlType="button" onClick={onShowTraLaiForm}
              className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
              <RotateCcw size={13} /> Trả lại
            </Button>
            <Button htmlType="button" onClick={onCancelForm}
              className="inline-flex items-center h-[28px] px-4 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
              Hủy
            </Button>
            <Button htmlType="button" onClick={onSaveForm}
              className="inline-flex items-center h-[28px] px-4 rounded-[3px] bg-white text-[#8b1a1a] text-[12px] font-bold hover:bg-gray-100 transition-colors">
              Lưu
            </Button>
          </div>
        ) : null}
      </div>
    </Header>
  );
};
