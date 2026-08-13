import React, { useState } from "react";
import {
  FileText, Folder, FolderOpen, Star, MoreVertical, Plus, Upload,
  RefreshCw, Archive, Download, Printer, Maximize2, ZoomIn, ZoomOut,
  ChevronDown, ChevronRight, X, MessageSquare, ListFilter, Check,
  ExternalLink, Layers, Search, Sparkles
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, Badge } from "./shared";

export type TaiLieuItem = {
  id: string;
  name: string;
  type: "pdf" | "docx" | "zip" | "image";
  size: string;
  date: string;
  category: "all" | "personal" | "shared";
  isFavorite?: boolean;
  folderDate: string;
  pageCount?: number;
  contentTitle?: string;
  contentSub?: string;
  paragraphs?: string[];
};

const SAMPLE_DOCS: TaiLieuItem[] = [
  {
    id: "sample",
    name: "sample",
    type: "pdf",
    size: "18.4 KB",
    date: "28/07/2026",
    folderDate: "28/07/2026",
    category: "all",
    isFavorite: false,
    pageCount: 1,
    contentTitle: "Sample PDF",
    contentSub: "This is a simple PDF file. Fun fun fun.",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus facilisis odio sed mi. Curabitur suscipit. Nullam vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat eget pharetra commodo, eros mi condimentum quam, sed commodo justo quam ut velit. Integer a erat. Cras laoreet ligula cursus enim. Aenean scelerisque velit et tellus. Vestibulum dictum aliquet sem. Nulla facilisi. Vestibulum accumsan ante vitae elit. Nulla erat dolor, blandit in, rutrum quis, semper pulvinar, enim. Nullam varius congue risus. Vivamus sollicitudin, metus ut interdum eleifend, nisi tellus pellentesque elit, tristique accumsan eros quam et risus. Suspendisse libero odio, mattis sit amet, aliquet eget, hendrerit vel, nulla. Sed vitae augue. Aliquam erat volutpat. Aliquam feugiat vulputate nisl. Suspendisse quis nulla pretium ante pretium mollis. Proin velit ligula, sagittis at, egestas a, pulvinar quis, nisl.",
      "Pellentesque sit amet lectus. Praesent pulvinar, nunc quis iaculis sagittis, justo quam lobortis tortor, sed vestibulum dui metus venenatis est. Nunc cursus ligula. Nulla facilisi. Phasellus ullamcorper consectetuer ante. Duis tincidunt, urna id condimentum luctus, nibh ante vulputate sapien, id sagittis massa orci ut enim. Pellentesque vestibulum convallis"
    ]
  },
  {
    id: "ban-an-st",
    name: "Ban_an_hinh_su_so_tham_124_HSST",
    type: "pdf",
    size: "4.2 MB",
    date: "20/07/2026",
    folderDate: "20/07/2026",
    category: "all",
    isFavorite: true,
    pageCount: 14,
    contentTitle: "BẢN ÁN HÌNH SỰ SƠ THẨM",
    contentSub: "Số: 124/2026/HS-ST - Ngày 20/07/2026 - TAND Tỉnh",
    paragraphs: [
      "TÒA ÁN NHÂN DÂN TỈNH ĐỒNG NAI\nNHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n\nỦy ban Thẩm phán sơ thẩm gồm có: Thẩm phán - Chủ tọa phiên tòa cùng các Hội thẩm nhân dân.",
      "Căn cứ điểm a khoản 1 Điều 353, Điều 357 Bộ luật Tố tụng hình sự; tuyên phạt bị cáo mức án theo đúng tội danh và khung hình phạt quy định tại Bộ luật Hình sự."
    ]
  },
  {
    id: "don-gdt",
    name: "Don_de_nghi_giam_doc_tham_nguyen_don",
    type: "pdf",
    size: "1.8 MB",
    date: "20/07/2026",
    folderDate: "20/07/2026",
    category: "personal",
    isFavorite: false,
    pageCount: 3,
    contentTitle: "ĐƠN ĐỀ NGHỊ XEM XÉT THEO THỦ TỤC GIÁM ĐỐC THẨM",
    contentSub: "Kính gửi: Chánh án TAND Tối cao - Viện trưởng VKSND Tối cao",
    paragraphs: [
      "Tôi là người đại diện hợp pháp của người bị hại làm đơn này đề nghị xem xét lại toàn bộ bản án phúc thẩm đã có hiệu lực pháp luật do có tình tiết mới làm thay đổi bản chất vụ án.",
      "Kính đề nghị Quý cấp xem xét kháng nghị theo thẩm quyền đúng quy định pháp luật."
    ]
  },
  {
    id: "kham-nghiem",
    name: "Bien_ban_kham_nghiem_hien_truong_bo_sung",
    type: "pdf",
    size: "3.1 MB",
    date: "15/07/2026",
    folderDate: "15/07/2026",
    category: "shared",
    isFavorite: false,
    pageCount: 5,
    contentTitle: "BIÊN BẢN KHÁM NGHIỆM HIỆN TRƯỜNG",
    contentSub: "Cơ quan CSĐT Công an Tỉnh phối hợp Viện kiểm sát nhân dân",
    paragraphs: [
      "Hồi 08 giờ 30 phút ngày 15/07/2026 tiến hành khám nghiệm hiện trường tại khu vực xảy ra vụ việc.",
      "Có sự chứng kiến của người làm chứng và các bên liên quan, sơ đồ hiện trường và các dấu vết vật chứng được ghi nhận đầy đủ theo phụ lục đính kèm."
    ]
  }
];

export function TaiLieuHoSoView({
  vuAnId = "VA26-002621",
  tenVuAn = "Vụ giải quyết đơn 7135",
  onBack,
}: {
  vuAnId?: string;
  tenVuAn?: string;
  onBack?: () => void;
}) {
  // Filters & State
  const [phamVi, setPhamVi] = useState<"all" | "personal" | "shared">("all");
  const [sapXep, setSapXep] = useState<"date" | "type">("date");
  const [selectedDocId, setSelectedDocId] = useState<string>("sample");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "28/07/2026": true,
    "20/07/2026": true,
    "15/07/2026": false,
  });

  // Viewer Controls
  const [zoom, setZoom] = useState<number>(210);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [notes, setNotes] = useState<Array<{ id: number; page: number; text: string; time: string; author: string }>>([
    { id: 1, page: 1, text: "Kiểm tra lại đối chiếu bút lục số 14 và lời khai nhân chứng", time: "28/07/2026 14:20", author: "Lý Thái Phúc (Công chức)" }
  ]);
  const [newNoteText, setNewNoteText] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "ban-an-st": true });

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const toggleFavorite = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const filteredDocs = SAMPLE_DOCS.filter(d => {
    if (phamVi === "all") return true;
    return d.category === phamVi;
  });

  // Group docs by date
  const groupedByDate: Record<string, TaiLieuItem[]> = {};
  filteredDocs.forEach(d => {
    if (!groupedByDate[d.folderDate]) groupedByDate[d.folderDate] = [];
    groupedByDate[d.folderDate].push(d);
  });

  const selectedDoc = SAMPLE_DOCS.find(d => d.id === selectedDocId) || SAMPLE_DOCS[0];
  const favoriteCount = Object.values(favorites).filter(Boolean).length;

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        text: newNoteText.trim(),
        time: "Hôm nay 15:10",
        author: "Công chức"
      }
    ]);
    setNewNoteText("");
    showToast("Đã thêm ghi chú mới vào tài liệu!");
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", background: "#fafafa", overflow: "hidden", fontFamily: F, position: "relative" }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1b5e20",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 4000,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── LEFT PANEL (Tài liệu hồ sơ sidebar) ─────────────────────────── */}
      <div
        style={{
          width: 320,
          minWidth: 300,
          maxWidth: 360,
          background: "#fff",
          borderRight: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            padding: "12px 14px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Tài liệu hồ sơ
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUTED }}>
            <button
              title="Đổi bố cục hiển thị"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
            >
              <Maximize2 size={13} />
            </button>
            <button
              title="Bộ lọc nâng cao"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
            >
              <ListFilter size={14} />
            </button>
          </div>
        </div>

        {/* Filter Section: Phạm vi */}
        <div style={{ padding: "10px 14px 6px" }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 5 }}>Phạm vi</div>
          <div
            style={{
              display: "flex",
              background: "#f5f5f5",
              borderRadius: 6,
              padding: 2,
              gap: 2,
            }}
          >
            {(
              [
                { id: "all", label: "Tất cả" },
                { id: "personal", label: "Cá nhân" },
                { id: "shared", label: "Được chia sẻ" },
              ] as const
            ).map(tab => {
              const active = phamVi === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPhamVi(tab.id)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    color: active ? TEXT : MUTED,
                    background: active ? "#fff" : "transparent",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    fontFamily: F,
                    transition: "all 0.15s",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Section: Sắp xếp theo */}
        <div style={{ padding: "6px 14px 10px" }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 5 }}>Sắp xếp theo</div>
          <div
            style={{
              display: "flex",
              background: "#f5f5f5",
              borderRadius: 6,
              padding: 2,
              gap: 2,
            }}
          >
            {(
              [
                { id: "date", label: "Ngày" },
                { id: "type", label: "Loại tài liệu" },
              ] as const
            ).map(tab => {
              const active = sapXep === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSapXep(tab.id)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    color: active ? TEXT : MUTED,
                    background: active ? "#fff" : "transparent",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    fontFamily: F,
                    transition: "all 0.15s",
                    textAlign: "center",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tree & Document List (Scrollable) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 12px" }}>
          {/* Item: Tài liệu đánh dấu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              borderRadius: 5,
              fontSize: 12,
              color: TEXT,
              cursor: "pointer",
              marginBottom: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <ChevronRight size={13} color={MUTED} />
              <Folder size={15} color="#eab308" />
              <span style={{ fontWeight: 500 }}>Tài liệu đánh dấu</span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: MUTED,
                background: "#f5f5f5",
                padding: "1px 6px",
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              {favoriteCount}
            </span>
          </div>

          {/* Item: Tiểu hồ sơ */}
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              borderRadius: 5,
              fontSize: 12,
              color: TEXT,
              cursor: "pointer",
              marginBottom: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <ChevronRight size={13} color={MUTED} />
              <Folder size={15} color="#eab308" />
              <span style={{ fontWeight: 500 }}>Tiểu hồ sơ</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  color: MUTED,
                  background: "#f5f5f5",
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                0
              </span>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 1 }}
              >
                <MoreVertical size={13} />
              </button>
            </div>
          </div> */}

          {/* Date Folders list */}
          {Object.entries(groupedByDate).map(([folderDate, docs]) => {
            const isExpanded = expandedFolders[folderDate] ?? true;
            return (
              <div key={folderDate} style={{ marginBottom: 4 }}>
                {/* Folder Header */}
                <div
                  onClick={() => toggleFolder(folderDate)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: 5,
                    fontSize: 12,
                    color: TEXT,
                    cursor: "pointer",
                    background: isExpanded ? "#fafafa" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {isExpanded ? (
                      <ChevronDown size={13} color={MUTED} />
                    ) : (
                      <ChevronRight size={13} color={MUTED} />
                    )}
                    {isExpanded ? (
                      <FolderOpen size={15} color="#eab308" />
                    ) : (
                      <Folder size={15} color="#eab308" />
                    )}
                    <span style={{ fontWeight: 600 }}>{folderDate}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: MUTED,
                      background: "#f5f5f5",
                      padding: "1px 6px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    {docs.length}
                  </span>
                </div>

                {/* Sub items inside folder */}
                {isExpanded && (
                  <div style={{ paddingLeft: 22, marginTop: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {docs.map(doc => {
                      const isSelected = selectedDocId === doc.id;
                      const isFav = favorites[doc.id];
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocId(doc.id)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                            background: isSelected ? "#fdf3f2" : "#fff",
                            border: isSelected ? `1px solid #f3c0bb` : "1px solid transparent",
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? RED : TEXT,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {doc.name}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <button
                                onClick={e => toggleFavorite(doc.id, e)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 1,
                                  color: isFav ? "#eab308" : "#888888",
                                }}
                              >
                                <Star size={13} fill={isFav ? "#eab308" : "none"} />
                              </button>
                              <button
                                onClick={e => e.stopPropagation()}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: MUTED }}
                              >
                                <MoreVertical size={13} />
                              </button>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: MUTED }}>
                            <span
                              style={{
                                background: "#fdecea",
                                color: "#6e1414",
                                padding: "0 4px",
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: 9,
                              }}
                            >
                              PDF
                            </span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions Fixed Footer */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                flex: 1,
                padding: "7px 10px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Upload size={12} /> Tải lên tài liệu
            </button>
            <button
              onClick={() => {
                showToast("Đang đồng bộ hồ sơ số hóa từ hệ thống quản lý...");
                setTimeout(() => showToast("Đã đồng bộ hồ sơ số hóa thành công!"), 1500);
              }}
              style={{
                flex: 1,
                padding: "7px 10px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                whiteSpace: "nowrap",
              }}
            >
              <RefreshCw size={12} /> Đồng bộ hồ sơ số hóa
            </button>
          </div>

          <button
            onClick={() => {
              showToast("Đã lưu trữ tài liệu vào kho hồ sơ số hóa.");
            }}
            style={{
              width: "100%",
              padding: "7px 10px",
              background: "#fff",
              color: TEXT,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: F,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Archive size={12} /> Lưu trữ
          </button>
        </div>
      </div>

      {/* ── RIGHT MAIN PANEL (PDF Viewer Canvas) ─────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
        {/* PDF Top Toolbar */}
        <div
          style={{
            height: 44,
            background: "#fff",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* File Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={15} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
              {selectedDoc.name}
            </span>
          </div>

          {/* Viewer Controls: Zoom + Page nav + Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Zoom selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                style={{
                  background: "none",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontSize: 12,
                  color: TEXT,
                }}
              >
                -
              </button>
              <select
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{
                  padding: "3px 8px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  fontSize: 12,
                  fontFamily: F,
                  background: "#fff",
                  color: TEXT,
                  cursor: "pointer",
                }}
              >
                <option value={100}>100%</option>
                <option value={150}>150%</option>
                <option value={180}>180%</option>
                <option value={200}>200%</option>
                <option value={210}>210%</option>
                <option value={250}>250%</option>
              </select>
              <button
                onClick={() => setZoom(z => Math.min(300, z + 10))}
                style={{
                  background: "none",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontSize: 12,
                  color: TEXT,
                }}
              >
                +
              </button>
            </div>

            <div style={{ width: 1, height: 18, background: BORDER }} />

            {/* Page navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
              >
                ▲
              </button>
              <span style={{ fontWeight: 600, color: TEXT }}>{currentPage}</span>
              <span>/ {selectedDoc.pageCount || 1}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(selectedDoc.pageCount || 1, p + 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
              >
                ▼
              </button>
            </div>

            <div style={{ width: 1, height: 18, background: BORDER }} />

            {/* Print & Download */}
            <button
              onClick={() => showToast("Đang tải file PDF xuống máy...")}
              title="Tải xuống"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <Download size={15} />
            </button>
            <button
              onClick={() => window.print()}
              title="In tài liệu"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <Printer size={15} />
            </button>
            <button
              onClick={() => showToast("Đã mở rộng chế độ xem toàn màn hình")}
              title="Mở rộng"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <ExternalLink size={15} />
            </button>
          </div>
        </div>

        {/* Main Document Body & Right Notes Collapsible */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Scrollable PDF Canvas */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              background: "#cccccc",
              padding: "28px 20px 48px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* White A4 Page */}
            <div
              style={{
                width: 760,
                minHeight: 1040,
                background: "#fff",
                boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                padding: "54px 64px",
                boxSizing: "border-box",
                transform: `scale(${zoom / 210})`,
                transformOrigin: "top center",
                fontFamily: "'Times New Roman', serif",
                color: "#222222",
                lineHeight: 1.6,
                fontSize: "13.5pt",
              }}
            >
              {/* Document Title Header */}
              <div style={{ fontSize: "28pt", fontWeight: "300", color: "#222222", marginBottom: 8, letterSpacing: "-0.5px" }}>
                {selectedDoc.contentTitle || "Sample PDF"}
              </div>
              <div style={{ fontSize: "16pt", fontStyle: "italic", color: "#555555", marginBottom: 32 }}>
                {selectedDoc.contentSub || "This is a simple PDF file. Fun fun fun."}
              </div>

              {/* Document Paragraphs */}
              {selectedDoc.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  style={{
                    textAlign: "justify",
                    marginBottom: 20,
                    lineHeight: 1.65,
                    color: "#333333",
                    fontSize: "12pt",
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Far Right Vertical Tab for Ghi chú */}
          <div
            onClick={() => setShowNotes(!showNotes)}
            style={{
              width: 28,
              background: "#fff",
              borderLeft: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "16px 0",
              color: showNotes ? RED : MUTED,
              gap: 8,
              userSelect: "none",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.03)",
            }}
          >
            <MessageSquare size={13} />
            <div
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                letterSpacing: 1,
              }}
            >
              Ghi chú
            </div>
          </div>

          {/* Collapsible Notes Drawer */}
          {showNotes && (
            <div
              style={{
                width: 280,
                background: "#fff",
                borderLeft: `1px solid ${BORDER}`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-4px 0 16px rgba(0,0,0,0.08)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
                  Ghi chú tài liệu ({notes.length})
                </span>
                <button
                  onClick={() => setShowNotes(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Notes List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                {notes.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: "#fafafa",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 11,
                      fontFamily: F,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: MUTED, marginBottom: 4, fontSize: 10 }}>
                      <span style={{ fontWeight: 600, color: RED }}>Trang {n.page}</span>
                      <span>{n.time}</span>
                    </div>
                    <div style={{ color: TEXT, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 4, fontStyle: "italic" }}>
                      Bởi: {n.author}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
                <textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Nhập ghi chú cho trang hiện tại..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    fontSize: 11,
                    fontFamily: F,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                  }}
                />
                <button
                  onClick={handleAddNote}
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "5px 0",
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: F,
                  }}
                >
                  + Thêm ghi chú
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Tải lên tài liệu mới ──────────────────────────────────── */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 3500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 8,
              width: 520,
              padding: "20px 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              fontFamily: F,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Tải lên tài liệu hồ sơ mới</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                  Tên tài liệu / Văn bản <span style={{ color: RED }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bản án sơ thẩm, Đơn đề nghị, Biên bản..."
                  style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                    Loại tài liệu
                  </label>
                  <select style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}>
                    <option>Tài liệu chứng cứ</option>
                    <option>Bản án / Quyết định</option>
                    <option>Đơn thư đề nghị</option>
                    <option>Tờ trình / Dự thảo</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                    Phân loại phạm vi
                  </label>
                  <select style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}>
                    <option>Tất cả thành viên</option>
                    <option>Cá nhân Công chức</option>
                    <option>Được chia sẻ</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                style={{
                  border: `2px dashed ${BORDER}`,
                  borderRadius: 8,
                  padding: "24px 16px",
                  textAlign: "center",
                  background: "#fafafa",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                <Upload size={28} color={RED} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Kéo thả file vào đây hoặc bấm để chọn tệp</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Hỗ trợ định dạng PDF, DOCX, PNG, JPG (Tối đa 50MB)</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ padding: "7px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  showToast("Đã tải lên tài liệu mới thành công!");
                }}
                style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
              >
                Xác nhận tải lên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
