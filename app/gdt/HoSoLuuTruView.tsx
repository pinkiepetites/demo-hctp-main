import React, { useState } from "react";
import {
  Archive, Folder, FileText, Download, Clock, History,
  ArrowLeft, ChevronRight, ChevronDown, List, Eye,
  RefreshCw, CheckCircle2, AlertCircle, X, Layers, Box
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, Badge } from "./shared";

export type ButLucItem = {
  id: string;
  soButLuc: string;
  tenTaiLieu: string;
  tap: string;
  giaiDoan: "hien-tai" | "tat-ca";
  ngayLuu: string;
  soTrang: number;
};

const SAMPLE_BUT_LUC: ButLucItem[] = [
  { id: "bl-01", soButLuc: "01 - 15", tenTaiLieu: "Đơn đề nghị xem xét theo thủ tục Giám đốc thẩm và các phụ lục", tap: "Tập 1", giaiDoan: "hien-tai", ngayLuu: "20/07/2026", soTrang: 15 },
  { id: "bl-02", soButLuc: "16 - 45", tenTaiLieu: "Bản án hình sự sơ thẩm số 124/2026/HS-ST", tap: "Tập 1", giaiDoan: "hien-tai", ngayLuu: "20/07/2026", soTrang: 30 },
  { id: "bl-03", soButLuc: "46 - 80", tenTaiLieu: "Bản án hình sự phúc thẩm số 89/2026/HS-PT", tap: "Tập 1", giaiDoan: "hien-tai", ngayLuu: "20/07/2026", soTrang: 35 },
  { id: "bl-04", soButLuc: "81 - 150", tenTaiLieu: "Biên bản hỏi cung bị can, biên bản lấy lời khai người làm chứng", tap: "Tập 2", giaiDoan: "tat-ca", ngayLuu: "22/07/2026", soTrang: 70 },
  { id: "bl-05", soButLuc: "151 - 220", tenTaiLieu: "Kết luận giám định pháp y và tài liệu chứng cứ hiện trường", tap: "Tập 2", giaiDoan: "tat-ca", ngayLuu: "22/07/2026", soTrang: 70 },
];

export function HoSoLuuTruView({
  vuAnId = "VA26-002621",
  tenVuAn = "Vụ giải quyết đơn 7135",
  onBack,
}: {
  vuAnId?: string;
  tenVuAn?: string;
  onBack?: () => void;
}) {
  const [phamViTai, setPhamViTai] = useState<"hien-tai" | "tat-ca">("hien-tai");
  const [hienThiTheo, setHienThiTheo] = useState<"but-luc" | "tai-lieu">("but-luc");
  const [selectedItem, setSelectedItem] = useState<ButLucItem | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false); // Starts in empty state as requested in screenshot Image 2
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = SAMPLE_BUT_LUC.filter(item => {
    if (phamViTai === "hien-tai") return item.giaiDoan === "hien-tai";
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "#fafafa", overflow: "hidden", fontFamily: F }}>
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

      {/* Top Header Bar matching Screenshot Image 2 */}
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
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: TEXT,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={17} />
            </button>
          )}
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Hồ sơ lưu trữ - Vụ án: {tenVuAn}
          </span>
        </div>

        {/* Quick state switcher for demonstration */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              setHasData(!hasData);
              setSelectedItem(null);
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

      {/* Main Split Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* ── LEFT PANEL (Hồ sơ lưu trữ sidebar) ─────────────────────────── */}
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
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Hồ sơ lưu trữ
            </span>
            <button
              title="Danh sách"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
            >
              <List size={15} />
            </button>
          </div>

          {/* Filter 1: Phạm vi tải */}
          <div style={{ padding: "10px 14px 6px" }}>
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

          {/* Content Area: Empty State or Populated List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
            {!hasData ? (
              /* Empty State matching Screenshot Image 2 */
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
                  <Box size={26} color="#888888" />
                </div>
                <span style={{ fontSize: 12, color: "#666666", fontFamily: F }}>
                  Chưa có hồ sơ lưu trữ
                </span>
              </div>
            ) : (
              /* Populated list */
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filteredItems.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: `1px solid ${isSelected ? "#f3c0bb" : BORDER}`,
                        background: isSelected ? "#fdf3f2" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>
                          Bút lục {item.soButLuc}
                        </span>
                        <span style={{ fontSize: 10, color: MUTED }}>{item.tap}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, color: TEXT, lineHeight: 1.3 }}>
                        {item.tenTaiLieu}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginTop: 2 }}>
                        <span>Ngày: {item.ngayLuu}</span>
                        <span>{item.soTrang} trang</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Fixed Button matching Screenshot Image 2 */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${BORDER}`,
              background: "#fff",
            }}
          >
            <button
              onClick={() => {
                showToast("Đang chuẩn bị gói tải xuống hồ sơ lưu trữ...");
                setTimeout(() => showToast("Đã tải trọn bộ hồ sơ lưu trữ về máy tính!"), 1500);
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Download size={13} /> Tải hồ sơ xuống
            </button>
          </div>
        </div>

        {/* ── RIGHT MAIN PANEL ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
          {/* Top Bar matching Screenshot Image 2 */}
          <div
            style={{
              height: 44,
              background: "#fff",
              borderBottom: `1px solid ${BORDER}`,
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: selectedItem ? TEXT : MUTED, fontFamily: F }}>
              {selectedItem ? `Bút lục ${selectedItem.soButLuc}: ${selectedItem.tenTaiLieu}` : "Chưa chọn tài liệu"}
            </span>

            {selectedItem && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => showToast("Đang tải bút lục đã chọn...")}
                  style={{
                    padding: "4px 10px",
                    background: "#fff",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: TEXT,
                  }}
                >
                  <Download size={12} /> Tải tài liệu này
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
            <div
              style={{
                flex: 1,
                overflow: "auto",
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              {!selectedItem ? (
                /* Empty state matching Screenshot Image 2 */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888888",
                    gap: 12,
                  }}
                >
                  <FileText size={48} color="#cccccc" strokeWidth={1.5} />
                  <span style={{ fontSize: 13, color: "#888888", fontFamily: F }}>
                    Chưa có hồ sơ lưu trữ
                  </span>
                </div>
              ) : (
                /* Document Preview & Metadata */
                <div
                  style={{
                    width: "100%",
                    maxWidth: 720,
                    background: "#fff",
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    padding: "28px 36px",
                    fontFamily: F,
                  }}
                >
                  <div style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 16, marginBottom: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: "uppercase" }}>
                      Hồ sơ lưu trữ điện tử – {selectedItem.tap}
                    </span>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "6px 0 0" }}>
                      Bút lục {selectedItem.soButLuc}: {selectedItem.tenTaiLieu}
                    </h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginBottom: 24 }}>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Mã định danh lưu trữ</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>LT-2026-VA002621</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Kho lưu trữ</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Kho lưu trữ án GĐT – TAND thành phố Hà Nội, Tầng 3</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Dãy / Kệ lưu trữ</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Kệ số 12 – Ngăn B3</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Hộp số / Cặp số</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Hộp HS-2026/045</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Cán bộ quản lý kho</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Nguyễn Văn Hưng – Văn thư Lưu trữ</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: MUTED, display: "block" }}>Tình trạng tài liệu</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1b5e20" }}>✓ Đã số hóa và lưu trữ nguyên vẹn</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fafafa",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "16px 20px",
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "#333333",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: TEXT, marginBottom: 6 }}>Tóm lược nội dung bút lục:</div>
                    Tài liệu lưu trữ được quét và niêm phong điện tử theo Quy chế công tác lưu trữ của Tòa án nhân dân thành phố Hà Nội.
                    Bao gồm {selectedItem.soTrang} trang văn bản gốc kèm chữ ký xác nhận của Công chức nghiên cứu thụ lý.
                  </div>
                </div>
              )}
            </div>

            {/* Far Right Vertical Tab for Lịch sử matching Screenshot Image 2 */}
            <div
              onClick={() => setShowHistory(!showHistory)}
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
                color: showHistory ? RED : MUTED,
                gap: 8,
                userSelect: "none",
                boxShadow: "-1px 0 3px rgba(0,0,0,0.03)",
              }}
            >
              <Clock size={13} />
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
                Lịch sử
              </div>
            </div>

            {/* Collapsible History Drawer */}
            {showHistory && (
              <div
                style={{
                  width: 300,
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
                    Lịch sử hồ sơ lưu trữ
                  </span>
                  <button
                    onClick={() => setShowHistory(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    {
                      time: "20/07/2026 09:00",
                      title: "Nhập kho hồ sơ ban đầu",
                      desc: "Tiếp nhận 03 tập hồ sơ (480 bút lục) từ TAND cấp dưới",
                      user: "Nguyễn Văn Hưng (Văn thư)",
                    },
                    {
                      time: "22/07/2026 14:15",
                      title: "Bàn giao hồ sơ nghiên cứu",
                      desc: "Công chức nghiên cứu Lý Thái Phúc mượn Tập 1 & Tập 2 theo phiếu PM-2026-001",
                      user: "Nguyễn Văn Hưng (Văn thư)",
                    },
                    {
                      time: "26/07/2026 16:30",
                      title: "Bổ sung tài liệu chứng cứ",
                      desc: "Bổ sung 15 bút lục tài liệu giám định mới vào Tập 2",
                      user: "Lý Thái Phúc (Công chức nghiên cứu)",
                    },
                  ].map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, position: "relative" }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: i === 0 ? RED : "#888888",
                          marginTop: 3,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11, fontFamily: F }}>
                        <span style={{ fontSize: 10, color: MUTED }}>{h.time}</span>
                        <span style={{ fontWeight: 700, color: TEXT }}>{h.title}</span>
                        <span style={{ color: "#555555", lineHeight: 1.4 }}>{h.desc}</span>
                        <span style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginTop: 2 }}>{h.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
