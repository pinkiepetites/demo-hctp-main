import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, ArrowRight, UserPlus, FolderOpen, ArrowDownToLine, MoreHorizontal, Inbox, List, RefreshCw, X, ChevronRight, Share2, CornerUpLeft, Plus, Download, ChevronLeft, Eye, MessageSquare, AlertCircle, FileText, CheckCircle2, FileUp, Send, Loader2, ArrowRightCircle } from "lucide-react";
type DonNguon = "VBDH" | "DVTT" | "DVC" | "BuuDien" | "TrucTiep";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { format, isAfter, isBefore, isSameDay } from "date-fns";
type DonTrangThai = "cho-phan-cong" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoTiepNhan: string;
  trangThai: DonTrangThai;
  nguon: DonNguon;
  coDonLienQuan: boolean;
  donLienQuan?: { maDon: string; quanHe: string }[];
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyễn Văn Bình",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hành chính", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [
      { maDon: "001025", quanHe: "Trùng số/ngày BA, QĐ" },
      { maDon: "000876", quanHe: "Trùng người đứng đơn" },
    ],
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trần Thị Lan",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "Lê Minh Tuấn",
    hinhThucDon: "Thông báo phát hiện vi phạm pháp luật", loaiAn: "Hình sự", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "da-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "Vũ Thu Hà",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "Có yêu cầu bổ sung trước đó" }],
  },
  {
    maDon: "001250", ngayTiepNhan: "16/08/2026 10:20", nguoiLamDon: "Công ty TNHH ABC",
    hinhThucDon: "CV kiến nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Hoàng Văn Nam",
    hinhThucDon: "CV chuyển đơn", loaiAn: "Hành chính", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "Đặng Bích Ngọc",
    hinhThucDon: "Đơn khác", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "Võ Quang Huy",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Trần Văn Minh",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyễn Thị Phương",
    hinhThucDon: "CV chuyển kiến nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Liên quan đến đơn của công ty TNHH ABC" }]
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "Lý Đức Trọng",
    hinhThucDon: "Tài liệu chứng cứ", loaiAn: "Hình sự", canBoTiepNhan: "Lê Thị Hoa",
    trangThai: "da-phan-cong", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "Tài liệu bổ sung cho vụ Lê Minh Tuấn" }]
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; cls: string }> = {
  "cho-phan-cong": { label: "Chờ phân công", cls: "bg-[#fff4db] text-[#8b5e00] border-[#f5c842]" },
  "da-phan-cong":  { label: "Đã phân công",  cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#a9c9f4]" },
  "cho-xu-ly":     { label: "Chờ xử lý",     cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#81c784]" },
  "tra-lai":       { label: "Trả lại",        cls: "bg-[#fdecea] text-[#8b1a1a] border-[#f5a3a3]" },
};

const NGUON_META_LT: Record<DonNguon, { label: string; cls: string }> = {
  VBDH: { label: "Hệ thống văn bản điều hành", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  DVTT: { label: "Cổng dịch vụ tư pháp", cls: "bg-[#fce8e8] text-[#c92a2a] border-[#f8caca]" },
  DVC: { label: "Cổng DVC Quốc gia", cls: "bg-[#e6f4ea] text-[#1e8e3e] border-[#cce8d6]" },
  BuuDien: { label: "Đường bưu điện", cls: "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]" },
  TrucTiep: { label: "Nộp trực tiếp", cls: "bg-[#f3e5f5] text-[#4a148c] border-[#e1bee7]" },
};

const CAN_BO_LIST_LT = ["Phạm Quốc Hưng", "Nguyễn Hải Trâm", "Trần Văn Minh", "Lê Thị Hoa"];

const PanelLienThong = ({ onChiTiet, currentRole = "can-bo" }: { onChiTiet?: (don: DonTiepNhan) => void, currentRole?: string }) => {
  const isTruongPhong = currentRole === "truong-phong";
  type TabKey = "tat-ca" | DonTrangThai;
  const [activeTab, setActiveTab] = useState<TabKey>(currentRole === "truong-phong" ? "tat-ca" : "cho-xu-ly");
  useEffect(() => { if (!isTruongPhong && (activeTab === "tat-ca" || activeTab === "cho-phan-cong" || activeTab === "da-phan-cong")) setActiveTab("cho-xu-ly"); }, [isTruongPhong]);
  const [rows, setRows] = useState(DON_SAMPLE);
  const [showDanhSachCanBo, setShowDanhSachCanBo] = useState(false);
  const [selectedCanBoPopup, setSelectedCanBoPopup] = useState(CAN_BO_LIST_LT[0]);

  const assignmentCounts = rows.reduce((acc, r) => {
    if (r.canBoTiepNhan && r.canBoTiepNhan !== "Chưa phân công" && r.trangThai !== "tra-lai") {
      acc[r.canBoTiepNhan] = (acc[r.canBoTiepNhan] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  // Advanced filter state
  const [fNguon, setFNguon] = useState("");
  const [fNgayTu, setFNgayTu] = useState("");
  const [fNgayDen, setFNgayDen] = useState("");
  const [fNguoiDon, setFNguoiDon] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fCanBo, setFCanBo] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");

  // Popup state
  const [donLienQuanPopup, setDonLienQuanPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongAutoPopup, setPhanCongAutoPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongChiDinhPopup, setPhanCongChiDinhPopup] = useState<DonTiepNhan | null>(null);
  const [thayDoiPopup, setThayDoiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiPopup, setTraLaiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiLyDo, setTraLaiLyDo] = useState("");
  const [traLaiGhiChu, setTraLaiGhiChu] = useState("");
  const [chonCanBo, setChonCanBo] = useState("");
  const [phanCongResult] = useState({ canBo: "Nguyễn Hải Trâm", tyLe: "18%", uuTien: "Có BA/QĐ liên quan đã được cán bộ xử lý" });

  const counts = useMemo(() => ({
    "tat-ca":        DON_SAMPLE.length,
    "cho-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "cho-phan-cong").length,
    "da-phan-cong":  DON_SAMPLE.filter(d => d.trangThai === "da-phan-cong").length,
    "cho-xu-ly":     DON_SAMPLE.filter(d => d.trangThai === "cho-xu-ly").length,
    "tra-lai":       DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
  }), [refreshKey]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "tat-ca",        label: `Tất cả (${counts["tat-ca"]})` },
    { key: "cho-phan-cong", label: `Chờ phân công (${counts["cho-phan-cong"]})` },
    { key: "da-phan-cong",  label: `Đã phân công (${counts["da-phan-cong"]})` },
    { key: "cho-xu-ly",     label: `Chờ xử lý (${counts["cho-xu-ly"]})` },
    { key: "tra-lai",       label: `Trả lại (${counts["tra-lai"]})` },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      if (activeTab !== "tat-ca" && d.trangThai !== activeTab) return false;
      if (fNguon && d.nguon !== fNguon) return false;
      if (fHinhThuc && d.hinhThucDon !== fHinhThuc) return false;
      if (fLoaiAn && d.loaiAn !== fLoaiAn) return false;
      if (fCanBo && d.canBoTiepNhan !== fCanBo) return false;
      if (fTrangThai && d.trangThai !== fTrangThai) return false;
      if (fNguoiDon && !d.nguoiLamDon.toLowerCase().includes(fNguoiDon.toLowerCase())) return false;
      if (q && ![d.maDon, d.nguoiLamDon, d.canBoTiepNhan].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, activeTab, search, fNguon, fHinhThuc, fLoaiAn, fCanBo, fTrangThai, fNguoiDon, refreshKey]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(d => d.maDon)));
  };

  const resetAdvanced = () => {
    setFNguon(""); setFNgayTu(""); setFNgayDen(""); setFNguoiDon("");
    setFHinhThuc(""); setFLoaiAn(""); setFCanBo(""); setFTrangThai("");
  };

  return (
    <div className="bg-white border border-[#ddd] rounded-[3px] overflow-hidden">
      {/* Popup: đơn liên quan */}
      {donLienQuanPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setDonLienQuanPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[480px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Đơn liên quan</div>
              <button onClick={() => setDonLienQuanPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-[#eee]">
                    {["Đơn", "Quan hệ"].map(h => <th key={h} className="text-left px-2 py-2 text-[11px] font-semibold text-[#555] bg-[#fafafa]">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(donLienQuanPopup.donLienQuan ?? []).map(dl => (
                    <tr key={dl.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]">
                      <td className="px-2 py-2 font-semibold text-[#1a5a96] cursor-pointer hover:underline">{dl.maDon}</td>
                      <td className="px-2 py-2 text-[#555]">{dl.quanHe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Popup: phân công tự động */}
      {phanCongAutoPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongAutoPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Kết quả phân công</div>
              <button onClick={() => setPhanCongAutoPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-[#888]">Đơn:</div><div className="font-semibold text-[#1d2e4f]">{phanCongAutoPopup.maDon}</div>
                <div className="text-[#888]">Cán bộ được phân công:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.canBo}</div>
                <div className="text-[#888]">Tỷ lệ phân công hiện tại:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.tyLe}</div>
              </div>
              <div className="px-3 py-2 bg-[#fffbf0] border border-[#f5c842] rounded-[3px] text-[11px] text-[#7a5e00]">
                Ưu tiên: {phanCongResult.uuTien}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongAutoPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => {
                  setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? { ...r, canBoTiepNhan: "Phạm Quốc Hưng", trangThai: "da-phan-cong" } : r));
                  setSelectedIds(new Set());
                  setPhanCongAutoPopup(null);
                }} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận phân công</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: phân công chỉ định */}
      {phanCongChiDinhPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongChiDinhPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Chọn cán bộ tiếp nhận</div>
              <button onClick={() => setPhanCongChiDinhPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Cán bộ HCTP</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn cán bộ HCTP —</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (Đang xử lý: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="px-3 py-2 bg-[#f5f5f5] border border-[#eee] rounded-[3px] text-[11px] text-[#555]">
                Tỷ lệ phân công hiện tại: Phạm Quốc Hưng 22% | Nguyễn Hải Trâm 18% | Trần Văn Minh 32% | Lê Thị Hoa 28%
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: thay đổi phân công */}
      {thayDoiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setThayDoiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Thay đổi phân công</div>
              <button onClick={() => setThayDoiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="text-[#555]">Cán bộ hiện tại: <span className="font-semibold text-[#1d2e4f]">{thayDoiPopup.canBoTiepNhan}</span></div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Cán bộ mới</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn cán bộ HCTP —</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (Đang xử lý: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: trả lại */}
      {traLaiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setTraLaiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[440px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Trả lại đơn</div>
              <button onClick={() => setTraLaiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Lý do trả lại <span className="text-[#8b1a1a]">*</span></div>
                <select value={traLaiLyDo} onChange={e => setTraLaiLyDo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn lý do —</option>
                  <option>Nhiều đơn khác bản án trong cùng bì – yêu cầu Văn thư tách đơn</option>
                  <option>Thiếu hồ sơ, tài liệu đính kèm</option>
                  <option>Không thuộc thẩm quyền giải quyết</option>
                  <option>Lý do khác</option>
                </select>
              </div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Ghi chú</div>
                <textarea value={traLaiGhiChu} onChange={e => setTraLaiGhiChu(e.target.value)}
                  placeholder="Nhập nội dung..."
                  className="w-full text-[12px] px-2 py-1.5 border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a] resize-none h-[64px]" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận trả lại</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div>
          <div className="text-[11px] text-[#888] mb-0.5">Quản lý đơn / <span className="font-medium text-[#555]">Tiếp nhận & phân công đơn</span></div>
          <div className="text-[15px] font-bold text-[#1d2e4f]">Tiếp nhận & phân công đơn</div>
        </div>
        <div className="flex items-center gap-2">
          {isTruongPhong && (
            <button onClick={() => setShowDanhSachCanBo(true)}
              className="h-[28px] px-3 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium hover:bg-[#f0f6ff] transition-colors">
              Danh sách cán bộ
            </button>
          )}

          <button onClick={() => setRefreshKey(k => k + 1)}
            className="h-[28px] px-3 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1.5">
            <RefreshCw size={11} /> Làm mới
          </button>
        </div>
      </div>

      {showDanhSachCanBo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowDanhSachCanBo(false)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[900px] h-[600px] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between bg-[#fcfcfc] shrink-0">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Kiểm soát tải lượng cán bộ tiếp nhận</div>
              <button onClick={() => setShowDanhSachCanBo(false)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            
            <div className="flex-1 flex min-h-0">
              {/* Left pane: Danh sách cán bộ */}
              <div className="w-[280px] border-r border-[#ddd] flex flex-col bg-[#fafafa]">
                <div className="px-3 py-2 border-b border-[#ddd] font-semibold text-[12px] text-[#555]">Danh sách cán bộ</div>
                <div className="flex-1 overflow-y-auto">
                  {CAN_BO_LIST_LT.map(cb => {
                    const count = assignmentCounts[cb] || 0;
                    const isSelected = selectedCanBoPopup === cb;
                    return (
                      <div key={cb} 
                        onClick={() => setSelectedCanBoPopup(cb)}
                        className={`px-3 py-2.5 border-b border-[#eee] cursor-pointer flex justify-between items-center transition-colors
                          ${isSelected ? 'bg-[#e8f0fe] border-l-4 border-l-[#1a5a96]' : 'hover:bg-white border-l-4 border-l-transparent'}`}>
                        <div className="font-medium text-[12px] text-[#333]">{cb}</div>
                        <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[3px] ${count > 0 ? 'bg-[#1a5a96] text-white' : 'bg-[#e0e0e0] text-[#555]'}`}>
                          {count} đơn
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right pane: Chi tiết đơn */}
              <div className="flex-1 flex flex-col bg-white min-w-0">
                <div className="px-4 py-2 border-b border-[#ddd] font-semibold text-[12px] text-[#555] bg-white z-10 shadow-sm shrink-0 flex items-center justify-between">
                  <span>Chi tiết đơn đang giải quyết</span>
                  <span className="text-[#1a5a96] font-bold bg-[#f0f6ff] px-2 py-0.5 rounded-[4px]">{selectedCanBoPopup}</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-white">
                  {(() => {
                    const cbRows = rows.filter(r => r.canBoTiepNhan === selectedCanBoPopup && r.trangThai !== "tra-lai");
                    if (cbRows.length === 0) {
                      return <div className="text-[#888] italic text-[12px] text-center mt-10">Cán bộ hiện không giải quyết đơn nào.</div>;
                    }
                    return (
                      <table className="w-full text-[11.5px] border-collapse">
                        <thead>
                          <tr className="bg-[#fcfcfc] sticky top-0 z-10 border-b border-[#eee]">
                            <th className="px-3 py-2 text-left font-semibold text-[#555] w-[40px]">STT</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Người làm đơn</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Mã đơn</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Hình thức đơn</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Loại án</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cbRows.map((r, i) => (
                            <tr key={r.maDon} className="border-b border-[#f5f5f5] hover:bg-[#f9f9f9]">
                              <td className="px-3 py-2 text-center text-[#888]">{i + 1}</td>
                              <td className="px-3 py-2 font-bold text-[#333]">{r.nguoiLamDon}</td>
                              <td className="px-3 py-2 text-[#1a5a96] font-medium">{r.maDon}</td>
                              <td className="px-3 py-2">
                                <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#f5f5f5] text-[#555] border border-[#ddd]">
                                  {r.hinhThucDon}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">
                                  {r.loaiAn}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Tabs */}
      <div className="flex items-end border-b border-[#ddd] px-4 pt-0.5 gap-0 bg-white">
        {tabs.filter(t => isTruongPhong || (t.key !== "tat-ca" && t.key !== "cho-phan-cong" && t.key !== "da-phan-cong")).map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedIds(new Set()); }}
            className={`px-3.5 py-[8px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
              activeTab === t.key
                ? "border-[#8b1a1a] text-[#8b1a1a]"
                : "border-transparent text-[#555] hover:text-[#222]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo số đến, mã đơn, người làm đơn..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a]" />
          </div>
          <button onClick={() => setShowAdvanced(v => !v)}
            className={`h-[30px] px-3 border rounded-[3px] text-[11.5px] transition-colors ${showAdvanced ? "border-[#8b1a1a] text-[#8b1a1a] bg-[#fdeaea]" : "border-[#ddd] text-[#555] bg-white hover:bg-[#f5f5f5]"}`}>
            Nâng cao
          </button>
          <button className="h-[30px] px-3 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616] transition-colors">
            Tìm kiếm
          </button>
          <button onClick={() => { setSearch(""); resetAdvanced(); }}
            className="h-[30px] px-3 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5] transition-colors">
            Đặt lại
          </button>
        </div>

        {/* Advanced filter */}
        {showAdvanced && (
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {[
              { label: "Nguồn tiếp nhận", el: <select value={fNguon} onChange={e => setFNguon(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tất cả</option><option>VBDH</option><option>DVTT</option><option>DVC</option></select> },
              { label: "Người đứng đơn", el: <input value={fNguoiDon} onChange={e => setFNguoiDon(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" placeholder="Nhập tên..." /> },
              { label: "Ngày tiếp nhận từ", el: <input type="date" value={fNgayTu} onChange={e => setFNgayTu(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" /> },
              { label: "Đến ngày", el: <input type="date" value={fNgayDen} onChange={e => setFNgayDen(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" /> },
              { label: "Hình thức đơn", el: <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tất cả</option><optgroup label="— Đơn"><option value="Đơn đề nghị GĐT-TT">1. Đơn đề nghị GĐT-TT</option><option value="Đơn khiếu nại tố cáo trong tố tụng">2. Đơn khiếu nại tố cáo trong tố tụng</option><option value="Thông báo phát hiện vi phạm pháp luật">3. Thông báo phát hiện vi phạm pháp luật</option><option value="Đơn khác">4. Đơn khác</option></optgroup><optgroup label="— Công văn"><option value="CV kiến nghị GĐT-TT">1. CV kiến nghị GĐT-TT</option><option value="CV chuyển đơn">2. CV chuyển đơn</option><option value="CV chuyển kiến nghị GĐT-TT">3. CV chuyển kiến nghị GĐT-TT</option><option value="CV khác">4. CV khác</option></optgroup><optgroup label="— Tài liệu"><option value="Tài liệu chứng cứ">Tài liệu chứng cứ</option></optgroup></select> },
              { label: "Loại án", el: <select value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tất cả</option><option>Hành chính</option><option>Dân sự</option><option>Hình sự</option><option>Lao động</option><option>Kinh doanh thương mại</option></select> },
              { label: "Cán bộ tiếp nhận", el: <select value={fCanBo} onChange={e => setFCanBo(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tất cả</option>{CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb}</option>)}</select> },
              { label: "Trạng thái", el: <select value={fTrangThai} onChange={e => setFTrangThai(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tất cả</option><option value="cho-phan-cong">Chờ phân công</option><option value="da-phan-cong">Đã phân công</option><option value="cho-xu-ly">Chờ xử lý</option><option value="tra-lai">Trả lại</option></select> },
            ].map(({ label, el }) => (
              <div key={label}>
                <div className="text-[10px] text-[#888] mb-0.5">{label}</div>
                {el}
              </div>
            ))}
          </div>
        )}
      </div>

            {isTruongPhong && (activeTab === "cho-phan-cong" || activeTab === "da-phan-cong") && (
        <div className="flex items-center justify-end gap-2 px-3 pb-2 pt-2 border-b border-[#ddd] bg-white">
          <button onClick={() => {
            if (selectedIds.size === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
            setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? { ...r, canBoTiepNhan: "Phạm Quốc Hưng", trangThai: "da-phan-cong" } : r));
            setSelectedIds(new Set());
          }}
            className="h-[28px] px-3 bg-[#1a5a96] text-white rounded-[3px] text-[11.5px] font-medium hover:bg-[#154b7e] transition-colors">
            Phân công tự động
          </button>
          
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              if (selectedIds.size === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
              setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? {
                ...r,
                canBoTiepNhan: val,
                trangThai: "da-phan-cong"
              } : r));
              setSelectedIds(new Set());
            }}
            className="w-[180px] h-[28px] px-2 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium focus:outline-none cursor-pointer"
          >
            <option value="" disabled hidden>Phân công chỉ định...</option>
            {CAN_BO_LIST_LT.map(cb => {
                const count = assignmentCounts[cb] || 0;
                return <option key={cb} value={cb}>{cb} (Đang xử lý: {count})</option>
            })}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
              <th className="px-2.5 py-2 w-[32px]">
                <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} className="cursor-pointer" />
              </th>
              {["STT", "Nguồn", "Mã đơn", "Ngày tiếp nhận", "Người làm đơn", "Hình thức đơn", "Loại án", "Cán bộ tiếp nhận", "Trạng thái", "Thao tác"].map(h => (
                <th key={h} className="text-left px-2.5 py-2 text-[11px] font-semibold text-[#555] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-[#aaa] italic text-[12px]">Không có đơn nào phù hợp.</td></tr>
            ) : filtered.map((don, idx) => {
              const sm = TRANG_THAI_META[don.trangThai];
              const nm = NGUON_META_LT[don.nguon];
              return (
                <tr key={don.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]" onDoubleClick={() => onChiTiet?.(don)} title="Kích đúp để xem chi tiết">
                  <td className="px-2.5 py-2.5 text-center">
                    <input type="checkbox" checked={selectedIds.has(don.maDon)} onChange={() => toggleSelect(don.maDon)} className="cursor-pointer" />
                  </td>
                  <td className="px-2.5 py-2.5 text-center font-medium text-[#555]">{idx + 1}</td>
                  <td className="px-2.5 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-[1px] rounded border text-[10.5px] font-medium ${nm.cls}`}>{nm.label}</span>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="font-semibold text-[#1a5a96]">{don.maDon}</div>
                    {don.coDonLienQuan && (
                      <button onClick={() => setDonLienQuanPopup(don)}
                        className="block mt-0.5 text-[9.5px] font-medium text-[#8b5e00] bg-[#fffbf0] border border-[#f5c842] rounded px-1.5 py-[1px] hover:bg-[#fff0bc] transition-colors cursor-pointer">
                        Có đơn liên quan
                      </button>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap text-[#555]">{don.ngayTiepNhan}</td>
                  <td className="px-2.5 py-2.5 text-[#333]">{don.nguoiLamDon}</td>
                  <td className="px-2.5 py-2.5 text-[#555]">{don.hinhThucDon}</td>
                  <td className="px-2.5 py-2.5 text-[#555]">{don.loaiAn}</td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap">
                    {isTruongPhong && (don.trangThai === "cho-phan-cong" || don.trangThai === "da-phan-cong" || don.trangThai === "cho-xu-ly") ? (
                      <select
                        value={don.canBoTiepNhan === "Chưa phân công" ? "" : don.canBoTiepNhan}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRows(prev => prev.map(r => r.maDon === don.maDon ? {
                            ...r,
                            canBoTiepNhan: val || "Chưa phân công",
                            trangThai: val ? "da-phan-cong" : "cho-phan-cong"
                          } : r));
                        }}
                        className="w-[140px] h-[26px] px-1 border border-[#ddd] rounded-[3px] text-[11px] focus:outline-none focus:border-[#8b1a1a]"
                      >
                        <option value="">-- Chưa phân công --</option>
                        {CAN_BO_LIST_LT.map(cb => {
                           const count = assignmentCounts[cb] || 0;
                           return <option key={cb} value={cb}>{cb} ({count})</option>
                        })}
                      </select>
                    ) : (
                      <span className={don.canBoTiepNhan === "Chưa phân công" ? "text-[#aaa] italic text-[11.5px]" : "text-[#333]"}>
                        {don.canBoTiepNhan}
                      </span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5">
                    <span className={`inline-flex items-center px-2 py-[2px] rounded-[10px] border text-[10.5px] font-semibold whitespace-nowrap ${sm.cls}`}>
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="flex items-center gap-1.5 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onChiTiet?.(don); }}
                        title="Chi tiết"
                        className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#555] hover:text-[#1a5a96] hover:border-[#1a5a96] hover:bg-[#f0f6ff] rounded-[3px] transition-colors">
                        <Eye size={13} />
                      </button>
                      {don.trangThai !== "tra-lai" && (
                        <button onClick={(e) => { e.stopPropagation(); setTraLaiPopup(don); }}
                          title="Trả lại"
                          className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#8b1a1a] hover:bg-[#fdeaea] rounded-[3px] transition-colors">
                          <CornerUpLeft size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#eee] bg-[#fafafa]">
        <span className="text-[11.5px] text-[#888]">
          Hiển thị <b className="text-[#333]">{filtered.length}</b> / {rows.length} đơn
          {selectedIds.size > 0 && <span className="ml-2 text-[#8b1a1a]">— Đã chọn {selectedIds.size}</span>}
        </span>
      </div>
    </div>
  );
};
export default PanelLienThong;
