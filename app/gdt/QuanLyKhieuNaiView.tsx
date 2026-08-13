import React, { useState } from "react";
import {
  Printer,
  FileText,
  Plus,
} from "lucide-react";
import {
  F,
  RED,
  BORDER,
  TEXT,
  MUTED,
  TH_STYLE,
  TD_STYLE,
  Badge,
  CapXetXu,
} from "./shared";
import { formatSoBA } from "./AppHelpers";
import type { UserRoleType } from "./shared";
import {
  isVu234,
  getQuanHePhapLuat,
  getPartyLabels,
} from "./App";
import {
  KHIEU_NAI_LIST,
  filterVuAnListByRole,
  type ChiTietTab,
  type VuAnGroup,
  QuickViewDanhSachDonModal,
} from "./QuanLyVuAnView";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";

const paginBtn: React.CSSProperties = {
  padding: "4px 10px",
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontFamily: F,
  color: TEXT,
};

export type KhieuNaiTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet" | "qua-han";

export function QuanLyKhieuNaiView({
  userRole,
  setUserRole,
  onSelectKhieuNai,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectKhieuNai: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<KhieuNaiTabId>("dang-giai-quyet");
  const [quickViewDonGroup, setQuickViewDonGroup] = useState<VuAnGroup | null>(null);

  const roleGroups = filterVuAnListByRole(KHIEU_NAI_LIST, userRole);
  const filteredGroups = roleGroups
    .map((group) => {
      if (activeTab === "tat-ca") return group;
      if (activeTab === "dang-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "chua-co" || r.kqGiaiQuyet === "da-co-con-don" || !r.kqGiaiQuyet);
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      if (activeTab === "da-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "da-co");
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      return group;
    })
    .filter(Boolean) as VuAnGroup[];

  const tabs: { id: KhieuNaiTabId; label: string }[] = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
    { id: "qua-han", label: "Quá hạn giải quyết" },
  ];

  return (
    // Cả trang cùng cuộn — xem ghi chú ở QuanLyVuAnView: khối tìm kiếm không được
    // ghim cứng, nếu không nó chiếm chỗ cố định và không đẩy đi được.
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto", background: "#fafafa", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        <span>Trang chủ</span> &nbsp;›&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;›&nbsp; <b style={{ color: TEXT }}>Quản lý khiếu nại</b>
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Quản lý khiếu nại
          </h1>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 16px",
                  fontSize: 13,
                  fontFamily: F,
                  fontWeight: active ? 600 : 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? RED : MUTED,
                  borderBottom: active ? `2.5px solid ${RED}` : "2.5px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 19-Field Comprehensive Filter Panel */}
      <VuAnSearchFilterPanel
        userRole={userRole}
        onSearch={() => alert("Đang tìm kiếm danh sách khiếu nại...")}
      />

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 20px",
          background: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }} />
        <button
          onClick={() => alert("Mở form thêm mới khiếu nại")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: RED,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: F,
          }}
        >
          <Plus size={13} /> Thêm mới
        </button>

        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "#fff",
            color: "#333333",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <Printer size={13} /> In biểu đồ
        </button>
      </div>

      {/* Table Section */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
              <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.flatMap((group, groupIdx) =>
              group.rows.map((row, idx) => {
                const rowKey = `${group.id}-${row.stt}`;
                const globalIdx = groupIdx * group.rows.length + idx;
                return (
                  <tr
                    key={rowKey}
                    style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                  >
                    {/* Checkbox */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <input type="checkbox" />
                    </td>

                    {/* STT */}
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                      {globalIdx + 1}
                    </td>

                    {/* Số & Ngày thụ lý */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Số: <b>{row.soThuLy}</b>
                        </span>
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewDonGroup(group);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: 11,
                            color: "#1a73e8",
                            fontFamily: F,
                            textDecoration: "underline",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                          title="Xem nhanh danh sách đơn và thông tin trình"
                        >
                          Số đơn {group.rows.length}
                        </button>
                      </div>
                    </td>

                    {/* Thông tin BA/QĐ & QHPL */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Số BA: </span>
                          <span style={{ color: "#1a73e8", fontWeight: 600 }}>{formatSoBA(row.soBA, row.loaiAn)}</span>
                          {row.ngayBA && (
                            <>
                              <span style={{ color: TEXT }}> Ngày: </span>
                              <span style={{ color: "#1a73e8" }}>{row.ngayBA}</span>
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                        </span>
                        {/* <CapXetXu label={row.capXetXu} /> */}
                        {row.thoiHieu && (
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Thời hiệu: </span>
                            <span style={{ color: row.thoiHieu === "Không xác định thời hiệu" || row.thoiHieu === "Không có thời hiệu giải quyết" ? "#1b5e20" : "#c2410c", fontWeight: 600 }}>
                              {row.thoiHieu}
                            </span>
                          </span>
                        )}
                        {isVu234(userRole, row.loaiAn) && (
                          <span style={{ fontSize: 11, color: "#1b5e20", fontFamily: F, fontWeight: 500 }}>
                            <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{getQuanHePhapLuat(row)}
                          </span>
                        )}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                          {row.anLoai === "chi-dao" && <Badge color="#8a6d00" bg="#fff8e1">Án chỉ đạo</Badge>}
                          {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án Quốc hội</Badge>}
                          {row.anLoai === "tvtn" && <Badge color="#1b5e20" bg="#e8f5e9">Án TVTN</Badge>}
                        </div>
                      </div>
                    </td>

                    {/* Người khiếu nại & NĐĐ */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {row.ndd && (
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT, fontWeight: 600 }}>Người đứng đơn:</span>{" "}
                            <span style={{ color: TEXT }}>{row.ndd}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phân công */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>Công chức: </span>{row.ttv}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>TP: </span>
                          {row.thamPhan || "–"}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* — Trình ký — */}
                        {row.kqgq === "chua-phan-cong"
                          ? <Badge color="#333333" bg="#f5f5f5">Chưa phân công Công chức</Badge>
                          : row.kqgq === "trinh-tham-phan"
                            ? <Badge color="#1a5a96" bg="#ccfbf1">Trình Thẩm phán</Badge>
                            : <Badge color="#1a5a96" bg="#e8f4ff">Trình Phó Chánh án</Badge>}

                        {/* — Trạng thái hồ sơ — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e0e0e0`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Hồ sơ</span>
                          {row.trangThaiHoSo === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#666666", fontFamily: F }}>Chưa có hồ sơ</span>
                          )}
                          {row.trangThaiHoSo === "dang-muon" && (
                            <Badge color="#8a6d00" bg="#fff8e1">Đang mượn hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-co" && (
                            <Badge color="#1b5e20" bg="#e8f5e9">Đã có hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-tra" && (
                            <Badge color="#1a5a96" bg="#e8f4ff">Đã trả hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-chuyen" && (
                            <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>
                          )}
                        </div>

                        {/* — Kết quả giải quyết khiếu nại — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e0e0e0`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kết quả giải quyết</span>
                          {row.kqGiaiQuyet === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#666666", fontFamily: F }}>Chưa có kết quả</span>
                          )}
                          {(row.kqGiaiQuyet === "da-co" || row.kqGiaiQuyet === "chap-nhan") && (
                            <Badge color="#1b5e20" bg="#e8f5e9">Chấp nhận khiếu nại</Badge>
                          )}
                          {(row.kqGiaiQuyet === "da-co-con-don" || row.kqGiaiQuyet === "khong-chap-nhan") && (
                            <Badge color="#6e1414" bg="#fdecea">Không chấp nhận khiếu nại</Badge>
                          )}
                          {row.kqGiaiQuyet === "xep-don" && (
                            <Badge color="#555555" bg="#f5f5f5">Xếp đơn</Badge>
                          )}

                        </div>


                      </div>
                    </td>

                    {/* Thao tác */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <button
                        onClick={() => onSelectKhieuNai(group.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 4,
                          fontSize: 18,
                          color: MUTED,
                          lineHeight: 1,
                        }}
                        title="Tùy chọn chi tiết"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.reduce((s, g) => s + g.rows.length, 0)} trong tổng {filteredGroups.reduce((s, g) => s + g.rows.length, 0)} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>

      {quickViewDonGroup && (
        <QuickViewDanhSachDonModal
          group={quickViewDonGroup}
          onClose={() => setQuickViewDonGroup(null)}
          onSelectVuAn={(id, tab) => onSelectKhieuNai(id, tab)}
          userRole={userRole}
          isKhieuNai={true}
        />
      )}
    </div>
  );
}

export default QuanLyKhieuNaiView;
