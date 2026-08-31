import React, { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Search,
  Download,
  Printer,
  FileText,
  File,
  X,
  Folder,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";

// ── Modal / Màn hình Hồ sơ tờ trình (Đồng bộ chuẩn giao diện theo mẫu ảnh) ─────────────
export function HoSoToTrinhModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (doc: { ten: string; loai: string; size: string; ngay: string }) => void;
}) {
  // Danh sách 5 văn bản mặc định như ảnh mẫu
  const [docList, setDocList] = useState<Array<{ id: string; ten: string; loai: string; ngay: string; size?: string }>>([
    { id: "tt-1", ten: "Tờ trình thẩm tra vụ án hình sự - Nguyễn Văn A", loai: "PDF", ngay: "25/06/2026", size: "1.2 MB" },
    { id: "tt-2", ten: "Bản án sơ thẩm số 12/2023/HS-ST", loai: "PDF", ngay: "25/06/2026", size: "850 KB" },
    { id: "tt-3", ten: "Quyết định kháng nghị giám đốc thẩm", loai: "PDF", ngay: "25/06/2026", size: "510 KB" },
    { id: "tt-4", ten: "Biên bản lấy lời khai nhân chứng", loai: "FILE", ngay: "25/06/2026", size: "420 KB" },
    { id: "tt-5", ten: "Kết luận giám định pháp y", loai: "PDF", ngay: "25/06/2026", size: "640 KB" },
  ]);

  const [selectedDocId, setSelectedDocId] = useState("tt-1");
  const [checkedDocIds, setCheckedDocIds] = useState<Record<string, boolean>>({});
  const [showChonTaiLieuModal, setShowChonTaiLieuModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(190);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  // Toggle checkbox 1 văn bản
  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedDocIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Xóa văn bản đơn lẻ
  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocList(prev => prev.filter(d => d.id !== id));
    if (selectedDocId === id) {
      const remaining = docList.filter(d => d.id !== id);
      if (remaining.length > 0) setSelectedDocId(remaining[0].id);
    }
  };

  // Xóa hàng loạt văn bản đã tích chọn
  const handleBatchDelete = () => {
    const idsToDelete = Object.keys(checkedDocIds).filter(id => checkedDocIds[id]);
    if (idsToDelete.length === 0) {
      alert("Vui lòng chọn ít nhất một văn bản để xóa.");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${idsToDelete.length} văn bản khỏi Hồ sơ tờ trình?`)) {
      setDocList(prev => prev.filter(d => !checkedDocIds[d.id]));
      setCheckedDocIds({});
      const remaining = docList.filter(d => !checkedDocIds[d.id]);
      if (remaining.length > 0) setSelectedDocId(remaining[0].id);
    }
  };

  // Tài liệu đang được chọn xem preview
  const currentDoc = docList.find(d => d.id === selectedDocId) || docList[0];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1600, display: "flex", flexDirection: "column", fontFamily: F }}>
      {/* ── Modal Bổ sung tài liệu vào hồ sơ tờ trình (Màn để chọn tài liệu như cũ) ── */}
      {showChonTaiLieuModal && (
        <ChonTaiLieuBoSungModal
          onClose={() => setShowChonTaiLieuModal(false)}
          onAddDocs={(selectedDocs) => {
            setDocList(prev => {
              const next = [...prev];
              selectedDocs.forEach(newDoc => {
                if (!next.some(x => x.ten === newDoc.ten)) {
                  next.push(newDoc);
                }
              });
              return next;
            });
            setShowChonTaiLieuModal(false);
          }}
        />
      )}

      {/* ── Top Header Bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, background: "#fff" }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#222222",
            fontFamily: F,
          }}
        >
          <ArrowLeft size={16} /> Hồ sơ tờ trình
        </button>
      </div>

      {/* ── Main Layout Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Left Panel: Danh sách văn bản ── */}
        <div style={{ width: 440, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Header Danh sách văn bản & Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#222222", fontFamily: F }}>
              Danh sách văn bản ({docList.length})
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handleBatchDelete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  background: "#fff",
                  color: "#333333",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: F,
                }}
              >
                <Trash2 size={13} /> Xóa
              </button>
              <button
                onClick={() => setShowChonTaiLieuModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  background: "#8b1a1a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                + Thêm tài liệu
              </button>
            </div>
          </div>

          {/* List of Document Cards */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {docList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: MUTED, fontSize: 13 }}>
                Chưa có văn bản nào trong Hồ sơ tờ trình.<br />
                Nhấn <b>+ Thêm tài liệu</b> để bổ sung tài liệu.
              </div>
            ) : (
              docList.map(doc => {
                const isSelected = doc.id === selectedDocId;
                const isChecked = !!checkedDocIds[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: isSelected ? `1px solid #6e1414` : `1px solid #e0e0e0`,
                      background: isSelected ? "#fffdfd" : "#fff",
                      marginBottom: 8,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 1px 4px rgba(153, 27, 27, 0.1)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = "#fafafa";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = "#fff";
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      onClick={e => toggleCheck(doc.id, e)}
                      style={{ cursor: "pointer", accentColor: RED, width: 15, height: 15 }}
                    />

                    {/* PDF / File Icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={20} color="#c0392b" />
                    </div>

                    {/* Document Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#6e1414" : "#222222",
                          fontFamily: F,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                        }}
                        title={doc.ten}
                      >
                        {doc.ten}
                      </div>
                      <div style={{ fontSize: 11, color: "#666666", fontFamily: F, marginTop: 2 }}>
                        {doc.loai} - {doc.ngay}
                      </div>
                    </div>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={e => handleDeleteDoc(doc.id, e)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        color: "#888888",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Xóa tài liệu"
                      onMouseEnter={e => (e.currentTarget.style.color = "#c0392b")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888888")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Panel: PDF Viewer / Document Preview ── */}
        <div style={{ flex: 1, background: "#666666", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Viewer Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 16px",
              background: "#fff",
              borderBottom: `1px solid ${BORDER}`,
              flexShrink: 0,
              fontFamily: F,
            }}
          >
            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="Thu nhỏ"
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#333333", minWidth: 45, textAlign: "center" }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(300, prev + 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="Phóng to"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Page Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="Trang trước"
              >
                ‹
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "#333333",
                }}
              >
                <input
                  type="text"
                  value={currentPage}
                  onChange={() => {}}
                  style={{
                    width: 28,
                    textAlign: "center",
                    padding: "2px 0",
                    border: "1px solid #cccccc",
                    borderRadius: 3,
                    fontSize: 12,
                    fontFamily: F,
                  }}
                />
                <span>/ {totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="Trang sau"
              >
                ›
              </button>
            </div>

            {/* Action Tools */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => alert("Đang tải xuống tài liệu: " + currentDoc?.ten)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="Tải xuống PDF"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#333333" }}
                title="In tài liệu"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>

          {/* Document Content Viewport */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "24px 16px" }}>
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 680,
                minHeight: 960,
                padding: "44px 56px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                fontFamily: "'Times New Roman', Times, serif",
                color: "#000",
                lineHeight: 1.7,
                boxSizing: "border-box",
                transform: `scale(${zoomLevel / 190})`,
                transformOrigin: "top center",
                marginBottom: 40,
              }}
            >
              {/* Header Phụ lục */}
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>
                PHỤ LỤC I
              </div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 4 }}>
                TỜ TRÌNH THẨM TRA VỤ ÁN HÌNH SỰ
              </div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 11, marginBottom: 20 }}>
                (Kèm theo Quyết định số 75/QĐ-CA ngày 06 tháng 4 năm 2026 của Chánh án Tòa án nhân dân thành phố Hà Nội)
              </div>

              {/* Hai cột cơ quan ban hành & Quốc hiệu */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>VỤ GIÁM ĐỐC, KIỂM TRA ....</div>
                  <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
                </div>
                <div style={{ textAlign: "center", width: "50%" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
                  <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
                </div>
              </div>

              {/* Tiêu đề Tờ trình */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 4 }}>TỜ TRÌNH</div>
                <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 6 }}>CHÁNH ÁN TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                <div style={{ fontStyle: "italic", fontSize: 11.5, lineHeight: 1.5 }}>
                  Về vụ án Nguyễn Văn A bị kết án về tội "......"¹ ở tỉnh, thành phố.....<br />
                  Bản án ... số .... ngày .... của Tòa án nhân dân ....²
                </div>
              </div>

              {/* Nội dung chi tiết */}
              <div style={{ fontSize: 12, textAlign: "justify" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>1. Người bị kết án</div>
                <p style={{ margin: "0 0 10px", textIndent: 24 }}>
                  Họ và tên: <b>Nguyễn Văn A</b>; Sinh năm: 1988 tại TP. Hà Nội; Nơi ĐKHKTT: Số 12, phố Phan Đình Phùng, phường Quán Thánh, quận Ba Đình, TP. Hà Nội; Nghề nghiệp: Lao động tự do; Tiền án, tiền sự: Không.
                </p>

                <div style={{ fontWeight: 700, marginBottom: 6 }}>2. Tóm tắt nội dung vụ án và quá trình giải quyết</div>
                <p style={{ margin: "0 0 10px", textIndent: 24 }}>
                  Theo các tài liệu có trong hồ sơ vụ án, khoảng 21h30 ngày 15/01/2023, tại khu vực đường Nguyễn Trãi, quận Thanh Xuân, Nguyễn Văn A đã có hành vi điều khiển phương tiện giao thông đường bộ vi phạm quy định, gây thiệt hại nghiêm trọng.
                </p>
                <p style={{ margin: "0 0 10px", textIndent: 24 }}>
                  Tại Bản án hình sự sơ thẩm số 12/2023/HS-ST ngày 25/06/2023 của TAND quận Thanh Xuân và Bản án phúc thẩm số 45/2023/HS-PT ngày 28/11/2023 của TAND TP. Hà Nội đã quyết định tuyên phạt Nguyễn Văn A mức án 03 năm tù giam.
                </p>

                <div style={{ fontWeight: 700, marginBottom: 6 }}>3. Nhận định và đề xuất của Công chức nghiên cứu</div>
                <p style={{ margin: "0 0 10px", textIndent: 24 }}>
                  Qua nghiên cứu toàn bộ hồ sơ vụ án, lời khai của các bên liên quan và kết luận giám định pháp y số 28/GĐ-PY, Công chức nghiên cứu nhận thấy có tình tiết mới làm thay đổi cơ bản nội dung vụ án mà Tòa án cấp sơ thẩm và phúc thẩm chưa xem xét đầy đủ.
                </p>
                <p style={{ margin: "0 0 10px", textIndent: 24 }}>
                  Kính trình Chánh án Tòa án nhân dân thành phố Hà Nội xem xét kháng nghị theo thủ tục Giám đốc thẩm đối với Bản án phúc thẩm nêu trên theo hướng hủy bản án để điều tra lại theo đúng quy định của Bộ luật Tố tụng hình sự.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Chọn tài liệu bổ sung (Giao diện Hồ sơ lưu trữ chuẩn theo ảnh mẫu) ─────────────────
function ChonTaiLieuBoSungModal({
  onClose,
  onAddDocs,
  tenVuAn = "Nguyễn Văn Minh – Tội cướp tài sản",
}: {
  onClose: () => void;
  onAddDocs: (docs: Array<{ id: string; ten: string; loai: string; ngay: string; size?: string }>) => void;
  tenVuAn?: string;
}) {
  const [phamViTai, setPhamViTai] = useState<"hien-tai" | "tat-ca">("hien-tai");
  const [hienThiTheo, setHienThiTheo] = useState<"but-luc" | "tai-lieu">("but-luc");
  const [hasData, setHasData] = useState<boolean>(true); // Có sẵn dữ liệu hồ sơ để chọn
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>("bl-01");
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({
    "bl-01": true,
    "bl-02": true,
  });
  const [showHistory, setShowHistory] = useState(false);

  const sampleItems = [
    {
      id: "bl-01",
      soButLuc: "01 - 15",
      ten: "Đơn đề nghị xem xét theo thủ tục Giám đốc thẩm và các phụ lục",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 15,
      size: "1.2 MB",
      giaiDoan: "hien-tai",
    },
    {
      id: "bl-02",
      soButLuc: "16 - 45",
      ten: "Bản án hình sự sơ thẩm số 124/2026/HS-ST",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 30,
      size: "2.4 MB",
      giaiDoan: "hien-tai",
    },
    {
      id: "bl-03",
      soButLuc: "46 - 80",
      ten: "Bản án hình sự phúc thẩm số 89/2026/HS-PT",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 35,
      size: "2.8 MB",
      giaiDoan: "hien-tai",
    },
    {
      id: "bl-04",
      soButLuc: "81 - 150",
      ten: "Biên bản hỏi cung bị can, biên bản lấy lời khai người làm chứng",
      loai: "FILE",
      ngay: "22/07/2026",
      soTrang: 70,
      size: "4.5 MB",
      giaiDoan: "tat-ca",
    },
    {
      id: "bl-05",
      soButLuc: "151 - 220",
      ten: "Kết luận giám định pháp y và tài liệu chứng cứ hiện trường",
      loai: "PDF",
      ngay: "22/07/2026",
      soTrang: 70,
      size: "5.1 MB",
      giaiDoan: "tat-ca",
    },
  ];

  const filteredItems = sampleItems.filter(item => {
    if (phamViTai === "hien-tai") return item.giaiDoan === "hien-tai";
    return true;
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirm = () => {
    const selected = sampleItems
      .filter(f => selectedKeys[f.id])
      .map(f => ({
        id: "doc-" + Math.random().toString(36).substr(2, 9),
        ten: f.ten,
        loai: f.loai,
        ngay: f.ngay,
        size: f.size,
      }));

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu.");
      return;
    }

    onAddDocs(selected);
  };

  const activeDoc = sampleItems.find(x => x.id === selectedDocKey);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1700,
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Top Header Bar (Hồ sơ lưu trữ - Vụ án: Nguyễn Văn Minh - Tội cướp tài sản) ── */}
        <div
          style={{
            height: 48,
            background: "#fff",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: TEXT,
                display: "flex",
                alignItems: "center",
              }}
              title="Quay lại"
            >
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Hồ sơ lưu trữ - Vụ án: {tenVuAn}
            </span>
          </div>

          {/* Quick state switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => {
                setHasData(!hasData);
                setSelectedDocKey(null);
              }}
              style={{
                padding: "4px 10px",
                background: hasData ? "#e8f5e9" : "#f5f5f5",
                color: hasData ? "#1b5e20" : MUTED,
                border: `1px solid ${hasData ? "#a5d6a7" : BORDER}`,
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              {hasData ? "● Đang xem: Dữ liệu hồ sơ mẫu" : "○ Đang xem: Trạng thái chưa có hồ sơ"}
            </button>
          </div>
        </div>

        {/* ── Sub-Header Bar (Hồ sơ lưu trữ / Chưa chọn tài liệu / Lịch sử) ── */}
        <div
          style={{
            height: 38,
            background: "#fafafa",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: TEXT, width: 280 }}>
              <span style={{ fontSize: 14 }}>≡</span> Hồ sơ lưu trữ
            </div>
            <div style={{ color: activeDoc ? "#1a5a96" : MUTED, fontWeight: activeDoc ? 600 : 400 }}>
              {activeDoc ? activeDoc.ten : "Chưa chọn tài liệu"}
            </div>
          </div>

          {/* Right History Tab */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: MUTED,
              fontFamily: F,
              padding: "4px 8px",
            }}
          >
            <span>🕒</span> Lịch sử
          </button>
        </div>

        {/* ── Main Split Body ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* ── Left Sidebar Panel ── */}
          <div
            style={{
              width: 320,
              minWidth: 300,
              maxWidth: 340,
              background: "#fff",
              borderRight: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {/* Filter 1: Phạm vi tải */}
            <div style={{ padding: "12px 14px 6px" }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 5 }}>Phạm vi tải</div>
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
                    { id: "hien-tai", label: "Giai đoạn hiện tại" },
                    { id: "tat-ca", label: "Tất cả giai đoạn" },
                  ] as const
                ).map(tab => {
                  const active = phamViTai === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPhamViTai(tab.id)}
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

            {/* Filter 2: Hiển thị theo */}
            <div style={{ padding: "6px 14px 10px" }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 5 }}>Hiển thị theo</div>
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
                    { id: "but-luc", label: "Bút lục" },
                    { id: "tai-lieu", label: "Tài liệu" },
                  ] as const
                ).map(tab => {
                  const active = hienThiTheo === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setHienThiTheo(tab.id)}
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

            {/* Content Area: Empty State OR Document List with Checkboxes */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
              {!hasData ? (
                /* Empty State matching Screenshot */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: 220,
                    color: "#888888",
                    textAlign: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#fafafa",
                      border: `1px dashed #cccccc`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Folder size={26} color="#888888" />
                  </div>
                  <span style={{ fontSize: 12, color: "#666666", fontFamily: F }}>
                    Chưa có hồ sơ lưu trữ
                  </span>
                </div>
              ) : (
                /* Populated List */
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", marginBottom: 4 }}>
                    Danh sách tài liệu ({filteredItems.length})
                  </div>
                  {filteredItems.map(item => {
                    const isSelected = item.id === selectedDocKey;
                    const isChecked = !!selectedKeys[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedDocKey(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 6,
                          border: isSelected ? "1px solid #6e1414" : "1px solid #e0e0e0",
                          background: isSelected ? "#fff5f5" : "#fff",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          onClick={e => toggleSelect(item.id, e)}
                          style={{ marginTop: 2, cursor: "pointer", accentColor: RED }}
                        />
                        <FileText size={15} color="#c0392b" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? "#6e1414" : "#222222",
                              lineHeight: 1.3,
                            }}
                          >
                            {hienThiTheo === "but-luc" ? `[BL ${item.soButLuc}] ` : ""}
                            {item.ten}
                          </div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                            {item.loai} · {item.soTrang} trang · {item.size}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${BORDER}`, background: "#fafafa" }}>
              <button
                onClick={() => alert("Chức năng tải hồ sơ xuống máy")}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "7px 12px",
                  background: "#fff",
                  color: "#333333",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                <Download size={14} /> Tải hồ sơ xuống
              </button>
            </div>
          </div>

          {/* ── Right Document Viewer ── */}
          <div
            style={{
              flex: 1,
              background: "#fafafa",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {!hasData || !activeDoc ? (
              /* Empty State matching Screenshot */
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888888",
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#f5f5f5",
                    border: `1px dashed #cccccc`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={30} color="#888888" />
                </div>
                <span style={{ fontSize: 13, color: "#666666", fontFamily: F }}>
                  Chưa có hồ sơ lưu trữ
                </span>
              </div>
            ) : (
              /* Populated Document Preview */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#fff",
                    borderBottom: `1px solid ${BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, color: TEXT }}>
                    📄 {activeDoc.ten}
                  </div>
                  <div style={{ display: "flex", gap: 10, color: MUTED }}>
                    <span>Số trang: {activeDoc.soTrang}</span>
                    <span>·</span>
                    <span>Dung lượng: {activeDoc.size}</span>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: 24, background: "#666666" }}>
                  <div
                    style={{
                      background: "#fff",
                      width: "100%",
                      maxWidth: 680,
                      minHeight: 900,
                      padding: "44px 56px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                      fontFamily: "'Times New Roman', Times, serif",
                      color: "#000",
                      lineHeight: 1.7,
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>
                      TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI
                    </div>
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 20 }}>
                      {activeDoc.ten}
                    </div>
                    <p style={{ textAlign: "justify", textIndent: 24, fontSize: 12 }}>
                      Căn cứ hồ sơ vụ án hình sự đối với bị cáo <b>Nguyễn Văn Minh</b> về tội "Cướp tài sản" theo quy định tại Điều 168 Bộ luật Hình sự. Toàn bộ tài liệu, chứng cứ, biên bản lấy lời khai và kết luận giám định đã được lưu trữ đầy đủ trong hệ thống lưu trữ điện tử.
                    </p>
                    <p style={{ textAlign: "justify", textIndent: 24, fontSize: 12 }}>
                      Tài liệu này được trích xuất từ Hồ sơ lưu trữ điện tử nhằm phục vụ công tác nghiên cứu, thẩm tra và lập Hồ sơ tờ trình xem xét theo thủ tục Giám đốc thẩm.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer Bar (Đóng & Xác nhận bổ sung) ── */}
        <div
          style={{
            height: 52,
            background: "#fff",
            borderTop: `1px solid ${BORDER}`,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#333333",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
            }}
          >
            Đóng
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "7px 22px",
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            Xác nhận bổ sung tài liệu
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Trình ký – Tab Thông tin tờ trình ─────────────────────────────────────────
export function TrinhKyThongTinTab() {
  const [selected, setSelected] = useState("tong-hop");
  const docs = [
    {
      key: "tong-hop",
      label: "Tờ trình thẩm tra vụ việc",
      date: null,
      isDefault: true,
    },
    {
      key: "phieu-chanh-an",
      label: "Phiếu ký – Chánh án Đặng Quốc Trung",
      date: "15/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-ca-mai",
      label: "Phiếu ký – Phó Chánh án Nguyễn Thị Mai",
      date: "13/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-vu-truong",
      label: "Phiếu ký – Trưởng phòng Lê Quang Minh",
      date: "11/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-vt-hoa",
      label: "Phiếu ký – Phó Trưởng phòng Trần Thị Hoa",
      date: "09/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-tp-hiep",
      label: "Phiếu ký – Thẩm phán Nguyễn Tiến Hiệp",
      date: "08/07/2026",
      isDefault: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: -6 }}>
      {docs.map((d, idx) => (
        <div key={d.key}
          onClick={() => setSelected(d.key)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
            cursor: "pointer", borderBottom: `1px solid ${BORDER}`,
            background: selected === d.key ? "#fdf3f2" : idx === 0 ? "#fafafa" : "#fff",
            borderLeft: selected === d.key ? `3px solid ${RED}` : "3px solid transparent",
          }}>
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {d.isDefault
              ? <span style={{ fontSize: 15 }}>📋</span>
              : <span style={{ fontSize: 14 }}>🖊</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: selected === d.key ? 700 : 500, color: d.isDefault ? RED : TEXT, fontFamily: F, wordBreak: "break-word" }}>{d.label}</div>
            {d.isDefault && (
              <span style={{ display: "inline-block", fontSize: 10, background: "#fdecea", color: RED, borderRadius: 10, padding: "1px 7px", marginTop: 2, fontFamily: F }}>Mặc định</span>
            )}
          </div>
          {d.date && <div style={{ fontSize: 10, color: MUTED, fontFamily: F, flexShrink: 0, marginTop: 2 }}>{d.date}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Trình ký – Tab Hồ sơ tờ trình ─────────────────────────────────────────────
export function TrinhKyHoSoTab() {
  const [selectedFile, setSelectedFile] = useState("hoa-pdf");
  const folders = [
    { key: "tai-lieu", label: "Tài liệu đánh dấu", count: 0 },
    { key: "tieu-ho-so", label: "Tiểu hồ sơ", count: 1 },
    { key: "ths1", label: "THS1", count: 0 },
  ];
  const files = [
    { key: "hoa-pdf", label: "Hoa", type: "PDF", size: "391 KB" },
    { key: "hoa-word", label: "Hoa", type: "Word", size: "400 KB" },
    { key: "cong-van", label: "Công văn gửi nội bộ", type: "PDF", size: "714 KB" },
  ];

  return (
    <div style={{ marginTop: -6, marginLeft: -16, marginRight: -16, display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, fontWeight: 600, padding: "8px 12px", borderBottom: `2px solid ${RED}`, cursor: "pointer" }}>Giai đoạn hiện tại</span>
        <span style={{ fontSize: 11, color: MUTED, fontFamily: F, padding: "8px 12px", cursor: "pointer" }}>Các giai đoạn còn lại</span>
      </div>
      {/* Folders */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {folders.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <span style={{ fontSize: 10, color: MUTED }}>▶</span>
            <span>📁</span>
            <span style={{ flex: 1 }}>{f.label}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{f.count}</span>
          </div>
        ))}
        {/* Open folder */}
        <div style={{ padding: "7px 12px", fontSize: 12, fontFamily: F }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: MUTED }}>▼</span>
            <span>📁</span>
            <span style={{ color: TEXT }}>03/06/2026</span>
            <span style={{ marginLeft: "auto", background: "#333333", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px" }}>3</span>
          </div>
          {files.map(f => (
            <div key={f.key}
              onClick={() => setSelectedFile(f.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px 5px 20px", borderRadius: 4, cursor: "pointer", background: selectedFile === f.key ? "#fce7e7" : "none", marginBottom: 2 }}
              onMouseEnter={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "none"; }}>
              <input type="checkbox" readOnly checked={selectedFile === f.key} style={{ cursor: "pointer", accentColor: RED }} />
              <span>{f.type === "PDF" ? "📄" : "📝"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: selectedFile === f.key ? 600 : 400, color: TEXT }}>{f.label}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{f.type} · {f.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trình ký modal ─────────────────────────────────────────────────────────────
export function TrinhKyModal({ onClose }: { onClose: () => void }) {
  const [leftTab, setLeftTab] = useState<"noi-dung" | "thong-tin" | "ho-so">("noi-dung");
  const [capTrinh, setCapTrinh] = useState("Trình Phó trưởng phòng");
  const [uuTien, setUuTien] = useState("Binh-thuong");
  // For single-select cap trinh
  const [nguoiDon, setNguoiDon] = useState("");
  // For multi-select (To TP / HDTP / Du thao)
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({});
  const [danhSach, setDanhSach] = useState([
    { id: 1, cap: "Trình Phó trưởng phòng", lanh: "Trần Thị Hoa – Phó Trưởng phòng", uu: "Bình thường", uuKey: "Binh-thuong" },
  ]);

  const selSt: React.CSSProperties = { padding: "6px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", background: "#fff", width: "100%", cursor: "pointer" };

  const CAP_TRINH_OPTIONS = [
    "Trình Phó trưởng phòng",
    "Trình trưởng phòng",
    "Trình thẩm phán",
    "Trình phó chánh án",
    "Trình chánh án",
    "Báo cáo tổ Thẩm phán",
    "Báo cáo Ủy ban Thẩm phán",
    "Nghiên cứu lại, xác minh, bổ sung",
    "Trình dự thảo trả lời đơn",
    "Trình dự thảo kháng nghị",
  ];

  const UU_TIEN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    "Cao": { label: "Cao", color: "#6e1414", bg: "#fdecea" },
    "Binh-thuong": { label: "Bình thường", color: "#333333", bg: "#f5f5f5" },
    "Thap": { label: "Thấp", color: "#1b5e20", bg: "#e8f5e9" },
  };

  // People lists per cấp trình type
  const TO_TP_LIST = [
    "Nguyễn Văn An – Thẩm phán", "Trần Thị Bình – Thẩm phán", "Lê Minh Cường – Thẩm phán",
    "Phạm Thị Dung – Thẩm phán", "Hoàng Văn Em – Thẩm phán", "Ngô Thị Phượng – Thẩm phán",
    "Bùi Quang Giang – Thẩm phán", "Đỗ Thị Hương – Thẩm phán", "Vũ Minh Khoa – Thẩm phán",
    "Đinh Thị Lan – Thẩm phán",
  ];
  const HDTP_LIST = [
    "Đặng Quốc Trung – Chánh án TAND thành phố Hà Nội", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án",
    "Trần Văn Độ – Phó Chánh án", "Lê Hồng Quang – Thẩm phán TAND thành phố Hà Nội", "Nguyễn Duy Giảng – Thẩm phán TAND thành phố Hà Nội",
    "Trương Việt Toàn – Thẩm phán TAND thành phố Hà Nội", "Phạm Quốc Anh – Thẩm phán TAND thành phố Hà Nội",
    "Bùi Ngọc Hòa – Thẩm phán TAND thành phố Hà Nội", "Đặng Văn Khanh – Thẩm phán TAND thành phố Hà Nội",
    "Mai Thị Minh – Thẩm phán TAND thành phố Hà Nội", "Hồ Tấn Tài – Thẩm phán TAND thành phố Hà Nội",
    "Phan Thị Bình Thuận – Thẩm phán TAND thành phố Hà Nội", "Dương Tấn Thanh – Thẩm phán TAND thành phố Hà Nội",
  ];
  const DU_THAO_LIST = [
    "Nguyễn Tiến Hiệp – Thẩm phán phân công",
    "Trần Thị Hoa – Phó Trưởng phòng",
    "Lê Quang Minh – Trưởng phòng",
    "Nguyễn Thị Mai – Phó Chánh án",
    "Đặng Quốc Trung – Chánh án",
  ];

  const isCheckboxType = ["Báo cáo tổ Thẩm phán", "Báo cáo Ủy ban Thẩm phán", "Trình dự thảo trả lời đơn", "Trình dự thảo kháng nghị"].includes(capTrinh);
  const checkboxList = capTrinh === "Báo cáo tổ Thẩm phán" ? TO_TP_LIST : capTrinh === "Báo cáo Ủy ban Thẩm phán" ? HDTP_LIST : DU_THAO_LIST;

  const getSingleOptions = () => {
    if (capTrinh === "Trình Phó trưởng phòng") return ["Trần Thị Hoa – Phó Trưởng phòng", "Nguyễn Thị Lan – Phó Trưởng phòng"];
    if (capTrinh === "Trình trưởng phòng") return ["Lê Quang Minh – Trưởng phòng"];
    if (capTrinh === "Trình thẩm phán") return ["Nguyễn Tiến Hiệp – Thẩm phán phân công", "Lê Văn Tùng – Thẩm phán tái phân công"];
    if (capTrinh === "Trình phó chánh án") return ["Nguyễn Thị Mai – Phó Chánh án", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án"];
    if (capTrinh === "Trình chánh án") return ["Đặng Quốc Trung – Chánh án TAND thành phố Hà Nội"];
    if (capTrinh === "Nghiên cứu lại, xác minh, bổ sung") return ["Lý Thái Phúc – Công chức nghiên cứu", "Nguyễn Minh Tú – Công chức nghiên cứu"];
    return [];
  };

  const getDefaultNguoiDon = (cap: string) => getSingleOptions()[0] ?? "";

  const handleCapTrinhChange = (val: string) => {
    setCapTrinh(val);
    setNguoiDon("");
    if (val === "Báo cáo Ủy ban Thẩm phán") {
      const init: Record<string, boolean> = {};
      HDTP_LIST.forEach(p => { init[p] = true; });
      setCheckedPeople(init);
    } else {
      setCheckedPeople({});
    }
  };

  const togglePerson = (name: string) => {
    setCheckedPeople(p => ({ ...p, [name]: !p[name] }));
  };

  const handleAddDanhSach = () => {
    const uu = UU_TIEN_CONFIG[uuTien] || UU_TIEN_CONFIG["Binh-thuong"];
    const base = Date.now();
    if (isCheckboxType) {
      const selected = checkboxList.filter(p => checkedPeople[p]);
      if (selected.length === 0) return;
      setDanhSach(prev => [
        ...prev,
        ...selected.map((name, i) => ({ id: base + i, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien })),
      ]);
    } else {
      const name = nguoiDon || getDefaultNguoiDon(capTrinh);
      if (!name) return;
      setDanhSach(prev => [...prev, { id: base, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien }]);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", flexDirection: "column" }}>
      {/* Dark red header */}
      <div style={{ background: "#6e1414", padding: "12px 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: F }}>Trình ký</span>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 360, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Sub-tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {([["noi-dung", "Nội dung xin ý kiến"], ["thong-tin", "Thông tin tờ trình"], ["ho-so", "Hồ sơ tờ trình"]] as const).map(([k, lbl]) => (
              <button key={k} onClick={() => setLeftTab(k)}
                style={{ flex: 1, padding: "9px 4px", fontSize: 11, fontFamily: F, fontWeight: leftTab === k ? 700 : 400, background: "none", border: "none", cursor: "pointer", color: leftTab === k ? RED : MUTED, borderBottom: leftTab === k ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1 }}>
                {lbl}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
            {leftTab === "noi-dung" && (
              <>
                {/* Cấp trình + Ưu tiên */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}><span style={{ color: RED }}>*</span> Cấp trình</span>
                    <select value={capTrinh} onChange={e => handleCapTrinhChange(e.target.value)} style={selSt}>
                      {CAP_TRINH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}>Mức độ ưu tiên</span>
                    <select value={uuTien} onChange={e => setUuTien(e.target.value)} style={selSt}>
                      <option value="Cao">Cao</option>
                      <option value="Binh-thuong">Bình thường</option>
                      <option value="Thap">Thấp</option>
                    </select>
                  </div>
                </div>
                {/* Người được trình – dynamic UI */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: RED }}>*</span> Người được trình</span>
                  {!isCheckboxType ? (
                    <select value={nguoiDon || getDefaultNguoiDon(capTrinh)} onChange={e => setNguoiDon(e.target.value)} style={selSt}>
                      {getSingleOptions().map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, maxHeight: 180, overflowY: "auto", background: "#fafafa" }}>
                      {checkboxList.map(person => (
                        <label key={person} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", fontSize: 11, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}>
                          <input
                            type="checkbox"
                            checked={!!checkedPeople[person]}
                            onChange={() => togglePerson(person)}
                            style={{ accentColor: RED, cursor: "pointer", flexShrink: 0 }}
                          />
                          <span style={{ wordBreak: "break-word" }}>{person}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddDanhSach}
                  style={{ width: "100%", padding: "7px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600, marginBottom: 14 }}>
                  Thêm người được trình
                </button>
                {/* Danh sách đã thêm */}
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 11 }}>
                  <colgroup><col style={{ width: "32%" }} /><col style={{ width: "33%" }} /><col style={{ width: "22%" }} /><col style={{ width: 36 }} /></colgroup>
                  <thead>
                    <tr>
                      {["Cấp trình", "Người được trình", "Ưu tiên", ""].map((h, i) => (
                        <th key={i} style={{ ...TH_STYLE, fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {danhSach.map((r, idx) => {
                      const uuCfg = UU_TIEN_CONFIG[r.uuKey] || UU_TIEN_CONFIG["Binh-thuong"];
                      return (
                        <tr key={`ds-${r.id}`} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={{ ...TD_STYLE, fontSize: 10 }}>{r.cap}</td>
                          <td style={{ ...TD_STYLE, fontSize: 10, fontWeight: 600 }}>{r.lanh}</td>
                          <td style={{ ...TD_STYLE }}>
                            <Badge color={uuCfg.color} bg={uuCfg.bg}>{uuCfg.label}</Badge>
                          </td>
                          <td style={{ ...TD_STYLE, textAlign: "center" }}>
                            <button onClick={() => setDanhSach(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "#c0392b" }}>🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
            {leftTab === "thong-tin" && (
              <TrinhKyThongTinTab />
            )}
            {leftTab === "ho-so" && (
              <TrinhKyHoSoTab />
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          </div>
        </div>

        {/* Right – PDF preview */}
        <div style={{ flex: 1, background: "#666666", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "#555555", flexShrink: 0 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#cccccc", fontSize: 13 }}>🔄</button>
            <span style={{ fontSize: 12, color: "#cccccc", fontFamily: F }}>100%</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#cccccc", fontSize: 13 }}>⛶</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: "#cccccc", fontFamily: F }}>‹ 1 / 2 ›</span>
            <div style={{ flex: 1 }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#cccccc", fontSize: 13 }}>⬇</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#cccccc", fontSize: 13 }}>🖨</button>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 32, overflowY: "auto" }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 640, padding: "48px 64px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", fontFamily: "serif", lineHeight: 1.9, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>TÒA ÁN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <hr style={{ border: "none", borderTop: "1px solid #000", margin: "4px 0" }} />
                </div>
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}>Số: 12/TTr-Công chức nghiên cứu</div>
              <div style={{ textAlign: "right", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Hà Nội, ngày 08 tháng 04 năm 2026</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>TỜ TRÌNH</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>THẨM TRA VỤ VIỆC</div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Kính trình: Lãnh đ o Tòa án nhân dân t i cao</div>
              <p style={{ textAlign: "justify", marginBottom: 16, fontSize: 12 }}>Căn cứ đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm và các tài liệu có trong hồ sơ vụ việc; Công chức nghiên cứu báo cáo kết quả nghiên cứu hồ sơ như sau:</p>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>I. THÔNG TIN CHUNG</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Số bản án: 137120/2026/HSST-QĐ</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Tòa án xét xử: Tòa án nhân dân thành phố Hà Nội</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Người đề nghị: Nguyễn Văn A</div>
              <div style={{ fontSize: 12, marginBottom: 16, paddingLeft: 16 }}>Nội dung đề nghị: Xem xét lại bản án theo thủ tục giám đốc thẩm, tái thẩm.</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>II. NHẬN XÉT, ĐỀ XUẤT</div>
              <p style={{ textAlign: "justify", fontSize: 12, marginBottom: 40 }}>Qua kiểm tra, hồ sơ có nội dung cần xin ý kiến lãnh đạo để thống nhất hướng xử lý. Công chức nghiên cứu kính đề nghị lãnh đạo xem xét, cho ý kiến chỉ đạo làm căn cứ thực hiện các bước tiếp theo theo đúng quy định.</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <div style={{ fontStyle: "italic" }}>N i nh n:</div>
                  <div>- Như trên;</div>
                  <div>- Lưu hồ sơ.</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, marginBottom: 40 }}>THẨM TRA VIÊN</div>
                  <div style={{ fontWeight: 700 }}>Nguyễn Tiến Hiệp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
