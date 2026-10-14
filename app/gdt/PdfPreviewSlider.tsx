import React, { useState } from "react";
import { X } from "lucide-react";
import { F, BORDER, TEXT, MUTED, RED } from "./shared";
import { Button } from "antd";

export function PdfPreviewSlider({ don, onClose }: { don: any | null; onClose: () => void }) {
  const [selectedFile, setSelectedFile] = useState<string>("don");
  if (!don) return null;

  const files = [
    { id: "don", name: "Đơn đề nghị GĐT.pdf", type: "PDF" },
    { id: "ban_an", name: "Bản án/Quyết định sơ thẩm.pdf", type: "PDF" },
    { id: "chung_cu", name: "Tài liệu chứng cứ kèm theo.pdf", type: "PDF" },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 999
        }}
      />
      {/* Slider */}
      <div 
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 850, background: "#f3f4f6",
          zIndex: 1000, boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease-out"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontFamily: F, color: TEXT }}>
              Chi tiết đơn: {don.maDon || don.soBA || "Đơn"}
            </h3>
            <span style={{ fontSize: 14, color: MUTED }}>Hình thức: {don.hinhThuc || "Đơn đề nghị GĐT/TT"}</span>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color={MUTED} />
          </Button>
        </div>

        {/* Content Body: Sidebar + Main Viewer */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: 260, background: "#fff", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: TEXT, borderBottom: `1px solid ${BORDER}`, fontFamily: F }}>
              Danh sách tài liệu ({files.length})
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {files.map(f => {
                const isActive = selectedFile === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFile(f.id)}
                    style={{
                      padding: "10px 16px", cursor: "pointer",
                      background: isActive ? "#eff6ff" : "transparent",
                      borderLeft: isActive ? `3px solid ${RED}` : "3px solid transparent",
                      display: "flex", alignItems: "flex-start", gap: 8,
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f9fafb" }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 4, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F }}>PDF</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14, color: isActive ? "#1e40af" : TEXT, fontWeight: isActive ? 600 : 400, fontFamily: F, lineHeight: 1.3 }}>
                        {f.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Viewer */}
          <div style={{ flex: 1, padding: 20, overflow: "auto", display: "flex", justifyContent: "center", background: "#f3f4f6" }}>
            <div style={{ width: "100%", maxWidth: 600, height: "max-content", minHeight: 700, background: "#fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", padding: "40px 30px", fontFamily: F }}>
              {selectedFile === "don" ? (
                <>
                  <h2 style={{ textAlign: "center", fontSize: 16, marginBottom: 5, fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                  <h3 style={{ textAlign: "center", fontSize: 14, marginBottom: 40, fontWeight: 600, textDecoration: "underline" }}>Độc lập - Tự do - Hạnh phúc</h3>
                  <h1 style={{ textAlign: "center", fontSize: 20, marginBottom: 30, fontWeight: 700 }}>ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM</h1>
                  <div style={{ fontSize: 14, lineHeight: 1.8, color: "#111827" }}>
                    <p><strong>Kính gửi:</strong> Tòa án nhân dân tối cao</p>
                    <p><strong>Tôi tên là:</strong> {don.nguoiKhieuNai || don.ndd || "Nguyễn Văn A"}</p>
                    <p><strong>Là:</strong> Người khởi kiện / Bị cáo trong vụ án {don.tenVuAn || don.loaiAn || "Hình sự"}</p>
                    <p><strong>Nội dung:</strong> Nay tôi làm đơn này đề nghị xem xét lại Bản án/Quyết định số <strong>{don.soBA || "12/2026/HS-PT"}</strong> ngày <strong>{don.ngayBA || "20/07/2026"}</strong> của <strong>{don.toa || "Tòa án nhân dân cấp cao tại Hà Nội"}</strong> theo thủ tục Giám đốc thẩm.</p>
                    <p><strong>Lý do:</strong> Qua bản án trên, tôi nhận thấy có nhiều điểm bất hợp lý và vi phạm nghiêm trọng thủ tục tố tụng, làm ảnh hưởng nghiêm trọng đến quyền và lợi ích hợp pháp của tôi.</p>
                    <br/><br/>
                    <p style={{ textAlign: "right", paddingRight: 40 }}>Người làm đơn<br/><br/><br/>(Ký ghi rõ họ tên)<br/><strong>{don.nguoiKhieuNai || don.ndd || "Nguyễn Văn A"}</strong></p>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: MUTED }}>
                  <p style={{ fontSize: 14, marginBottom: 10 }}>Nội dung văn bản mô phỏng:</p>
                  <h2 style={{ color: TEXT }}>{files.find(f => f.id === selectedFile)?.name}</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
