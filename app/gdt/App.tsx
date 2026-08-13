import React, { useState, useEffect } from "react";
import {
  Search, RefreshCw, Eye,
  ChevronDown, ChevronUp, RotateCcw, X, Save, Printer,
  FileText, List, Users, FolderOpen, CheckCircle2, Files, Archive, Send, Calendar,
  ArrowLeftRight, FileSpreadsheet, Paperclip, FolderPlus, Trash2,
} from "lucide-react";
import { type View } from "./views";
import {
  TAB_CONFIG, getCasesByTab, countByTab,
  type DonCase, type TabId, type VuAnAction,
  THAM_PHAN_TOA, THAM_TRA_VIEN_PHONG,
} from "./data";
import ThemHoSoScreen from "./imports/ThemHoSoKnChiTiet";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, StatusBadge, VuAnBtn, Tag, CapXetXu, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { SectionCard, InfoGrid, TabThongTin } from "./TabThongTin";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { ThemKetQuaModal, ThemQuyetDinhHoanModal } from "./ThemKetQuaModal";
import CongVanTraoDoiView, { XemBieuMauCongVanModal } from "./CongVanTraoDoiView";
import QuanLyVuXetXuView from "./QuanLyVuXetXuView";
import PheDuyetDeXuatView, { XemBieuMauScreen } from "./PheDuyetDeXuatView";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { PhanCongTTVView } from "./PhanCongTTVView";
import { PhanCongThamPhanView } from "./PhanCongThamPhanView";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoLuuTruView } from "./HoSoLuuTruView";
import { AnThoiHieuView, AnQuocHoiView } from "./AnBaoCaoViews";
import { QuanLyKhieuNaiView } from "./QuanLyKhieuNaiView";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import HoSoKhangNghiView, { WordEditorView } from "./HoSoKhangNghiView";
import QuanLyVuAnView, { ChiTietVuAnView, filterVuAnListByRole, type ChiTietTab } from "./QuanLyVuAnView";
import NhanDonTLVuAnView from "./NhanDonTLVuAnView";

// ── Thông tin đơn cell ───────────────────────────────────────────────────────

function CellThongTinDon({ c, tab }: { c: DonCase; tab?: TabId }) {
  const isDaCoVuAn = tab === "da-co-vu-an" || c.tabs?.includes("da-co-vu-an") || c.daThuLy;
  const showDuKien = !isDaCoVuAn;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.type === "don" ? (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã đơn: {c.maDon}
          </span>
          {c.daThuLy ? (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Đã thụ lý</span>
          ) : (
            <>
              {c.soCV && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  CV chuyển: {c.soCV} - {c.ngayCV}
                </span>
              )}
              {c.thuLyMoi && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  Thụ lý mới: {c.thuLyMoi}
                </span>
              )}
            </>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {c.thamPhan} ({c.capThamPhan})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {c.hinhThuc}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã văn thư đến: {c.maVanThuDen} - {c.ngayVanThuDen}
          </span>
          {c.soHSKN && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Số HSKN: {c.soHSKN} - {c.ngayHSKN}
            </span>
          )}
          {c.thuLyXetXu && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Thụ lý xét xử: {c.thuLyXetXu}
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {c.thamPhan} ({c.capThamPhan})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {c.hinhThuc}
          </span>
        </>
      )}
      {c.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2, alignItems: "flex-start" }}>
          {c.tags.map((t) => <Tag key={t} type={t} />)}
        </div>
      )}
    </div>
  );
}

// ── Helper functions for role-based labels and QHPL ──────────────────────────

export function getPartyLabels(loaiAnStr?: string, role?: UserRoleType) {
  const loai = (loaiAnStr || "").toLowerCase();
  const isHinhSu = loai.includes("hình sự") || role === "vu-1" || role === "hinh-su";
  const isHanhChinh = loai.includes("hành chính") || role === "vu-4" || role === "hanh-chinh";

  if (isHinhSu) {
    return { label1: "Người khiếu nại", label2: "Bị cáo" };
  } else if (isHanhChinh) {
    return { label1: "Người khởi kiện", label2: "Người bị kiện" };
  } else {
    return { label1: "Nguyên đơn", label2: "Bị đơn" };
  }
}

export function isVu234(role?: UserRoleType, loaiAnStr?: string) {
  if (role === "vu-2" || role === "dan-su" || role === "vu-3" || role === "vu-4" || role === "hanh-chinh") {
    return true;
  }
  if (role === "vu-1" || role === "hinh-su") {
    return false;
  }
  if (loaiAnStr && loaiAnStr.toLowerCase().includes("hình sự")) {
    return false;
  }
  return true;
}

export function getQuanHePhapLuat(c: { quanHePhapLuat?: string; tenVuAn?: string; loaiAn?: string }) {
  if (c.quanHePhapLuat) return c.quanHePhapLuat;
  if (c.tenVuAn && c.tenVuAn.includes(" - ")) {
    return c.tenVuAn.split(" - ")[1];
  }
  switch (c.loaiAn) {
    case "Dân sự":
      return "Tranh chấp hợp đồng chuyển nhượng đất đai";
    case "Hành chính":
      return "Khiếu kiện quyết định hành chính về thu hồi đất";
    case "Kinh doanh thương mại":
      return "Tranh chấp hợp đồng mua bán hàng hóa";
    case "Hôn nhân gia đình":
      return "Tranh chấp chia tài sản khi ly hôn";
    case "Lao động":
      return "Tranh chấp đơn phương chấm dứt HĐLĐ";
    case "Sở hữu trí tuệ":
      return "Tranh chấp bản quyền nhãn hiệu";
    case "Phá sản":
      return "Yêu cầu mở thủ tục phá sản";
    default:
      return "Tranh chấp hợp đồng dân sự / kinh doanh";
  }
}

// ── Đương sự cell ────────────────────────────────────────────────────────────

function CellDuongSu({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  const { label1, label2 } = getPartyLabels(c.loaiAn, userRole);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.nguoiKhieuNai && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label1}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhieuNai}</span>
        </span>
      )}
      {c.biCao && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label2}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.biCao}</span>
        </span>
      )}
      {c.ndd && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>NĐD: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.ndd}</span>
        </span>
      )}
      {c.nguoiKhangNghi && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Người kháng nghị: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhangNghi}</span>
        </span>
      )}
    </div>
  );
}

// ── BA/QĐ cell ───────────────────────────────────────────────────────────────

function CellBA({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  if (!c.soBA && !c.toa) return <span style={{ color: TEXT, fontSize: 11, fontFamily: F }}>-</span>;
  const showQHPL = isVu234(userRole, c.loaiAn);
  const qhplText = getQuanHePhapLuat(c);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.soBA && (
        <span style={{ fontSize: 11, fontFamily: F }}>
          <span style={{ color: TEXT }}>Số BA: </span>
          <span style={{ color: "#1a73e8", fontWeight: 600 }}>{formatSoBA(c.soBA, c.loaiAn)}</span>
          {c.ngayBA && (
            <>
              <span style={{ color: TEXT }}> Ngày: </span>
              <span style={{ color: "#1a73e8" }}>{c.ngayBA}</span>
            </>
          )}
        </span>
      )}
      {c.toa && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Tại: </span>{c.toa}
        </span>
      )}
      {c.thoiHieu && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Thời hiệu: </span>
          <span style={{ color: c.thoiHieu === "Không xác định thời hiệu" ? "#1b5e20" : "#c2410c", fontWeight: 600 }}>{c.thoiHieu}</span>
        </span>
      )}
      {showQHPL && (
        <span style={{ fontSize: 11, color: "#1b5e20", fontFamily: F, fontWeight: 500 }}>
          <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{qhplText}
        </span>
      )}
      {c.hoiDongThamPhanPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>HĐTP cấp phúc thẩm: </span>{c.hoiDongThamPhanPhucTham}
        </span>
      )}
      {c.thamPhanChuToaPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Thẩm phán chủ tọa cấp phúc thẩm: </span>{c.thamPhanChuToaPhucTham}
        </span>
      )}
    </div>
  );
}

// ── Thông tin vụ án cell ─────────────────────────────────────────────────────

function CellVuAn({ c, onThemHoSo }: { c: DonCase; onThemHoSo?: () => void }) {
  const hasGiaiQuyet = !!(c.thongBaoBoSung || c.ttvGiaiQuyet || c.tpGiaiQuyet);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {(c.tenVuAn || c.ttv) && (
        <div style={{ textAlign: "left" }}>
          {c.tenVuAn && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4, display: "block" }}>
              Tên vụ án: {c.tenVuAn}
            </span>
          )}
          {c.ttv && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              Công chức: {c.ttv}
            </span>
          )}
        </div>
      )}
      {hasGiaiQuyet && (
        <div style={{
          marginTop: 2, padding: "6px 8px",
          background: "#e8f5e9", border: "1px solid #a5d6a7",
          borderRadius: 5, display: "flex", flexDirection: "column", gap: 3,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1b5e20", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Đã có TBGQ: TBTLĐ số 1
          </span>
          {c.ttvGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              Công chức giải quyết: <strong>{c.ttvGiaiQuyet}</strong>
            </span>
          )}
          {c.tpGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TP giải quyết: <strong>{c.tpGiaiQuyet}</strong>
            </span>
          )}
        </div>
      )}
      {c.vuAnActions && c.vuAnActions.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {c.vuAnActions.map((a) => (
            <VuAnBtn
              key={a}
              action={a}
              onClick={a === "them-vu-an" ? onThemHoSo : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Ý kiến lãnh đạo cell ─────────────────────────────────────────────────────

function CellYKienLD({ c }: { c: DonCase }) {
  if (!c.yKienLD?.length)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      {c.yKienLD.map((y, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Badge
            color={y.decision === "thu-moi" ? "#1b5e20" : "#6e1414"}
            bg={y.decision === "thu-moi" ? "#e8f5e9" : "#fdecea"}
          >
            {y.decision === "thu-moi" ? "Thụ lý mới" : "Không thụ lý"}
          </Badge>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            {y.name} – {y.role}
          </span>
          <span style={{ fontSize: 11, color: "#27ae60", fontFamily: F }}>
            Đã duyệt - {y.date}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Nhận/Trả cell ────────────────────────────────────────────────────────────

function CellNhanTra({ c, tab }: { c: DonCase; tab?: TabId }) {
  if (tab === "da-co-vu-an") {
    const ngayDuyet =
      (c as any).ngayDuyetToTrinh ||
      c.yKienLD?.[0]?.date ||
      c.ngayThaoTac ||
      c.ngayNhan ||
      "24/07/2026";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500 }}>
          {ngayDuyet}
        </span>
      </div>
    );
  }

  const hasData = c.ngayNhan || c.nguoiThaoTac || c.nguoiTra;
  if (!hasData)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {c.ngayNhan && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày nhận: {c.ngayNhan}
        </span>
      )}
      {c.nguoiThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người thao tác: {c.nguoiThaoTac}
        </span>
      )}
      {c.ngayThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày thao tác: {c.ngayThaoTac}
        </span>
      )}
      {c.nguoiTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người trả: {c.nguoiTra}
        </span>
      )}
      {c.ngayTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày trả: {c.ngayTra}
        </span>
      )}
    </div>
  );
}

// ── Action bar ───────────────────────────────────────────────────────────────

function ActionBar({
  tab,
  onGiaoTieuHoSo,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
}) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 20px", background: "#fff",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ flex: 1 }} />
      <button
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: RED,
          border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        ↩ Trả đơn
      </button>
      {tab === "da-co-vu-an" && (
        <button
          onClick={onGiaoTieuHoSo}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: "#27ae60", color: "#fff",
            border: "none", borderRadius: 4, cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: F,
          }}
        >
          ✓ Giao tiểu hồ sơ
        </button>
      )}
      <button
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, background: "#fff",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
        }}
      >
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );
}

// ── Main list table ───────────────────────────────────────────────────────────

function CaseTable({
  tab,
  onGiaoTieuHoSo,
  onThemHoSo,
  overrideCases,
  userRole,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  overrideCases?: DonCase[];
  userRole?: UserRoleType;
}) {
  const cases = overrideCases ?? getCasesByTab(tab, userRole);

  const lastColHeader =
    tab === "cho-y-kien" ? "Ý KIẾN LÃNH ĐẠO" : "THÔNG TIN VỤ ÁN";

  const duongSuHeader =
    userRole === "vu-1" || userRole === "hinh-su"
      ? "NGƯỜI KHIẾU NẠI & BỊ CÁO"
      : userRole === "vu-4" || userRole === "hanh-chinh"
        ? "NGƯỜI KHỞI KIỆN & NGƯỜI BỊ KIỆN"
        : userRole === "vu-2" || userRole === "vu-3" || userRole === "dan-su"
          ? "NGUYÊN ĐƠN & BỊ ĐƠN"
          : "ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN";

  const baHeader = isVu234(userRole)
    ? "THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT & QHPL"
    : "THÔNG TIN BA/QĐ ĐỂ NGHỊ GĐT,TT";

  const nhanTraHeader =
    tab === "tra-lai"
      ? "LÝ DO TRẢ LẠI"
      : tab === "da-co-vu-an"
        ? "NGÀY DUYỆT TỜ TRÌNH"
        : "THÔNG TIN NHẬN/TRẢ";

  const hasNhanTraCol = tab !== "cho-y-kien" && tab !== "don-cho-phe-duyet";

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        {hasNhanTraCol ? (
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: 52 }} />
          </colgroup>
        ) : (
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: 52 }} />
          </colgroup>
        )}
        <thead>
          <tr>
            <th style={TH_STYLE}>
              <input type="checkbox" />
            </th>
            <th style={TH_STYLE}>STT</th>
            <th style={TH_STYLE}>THÔNG TIN ĐƠN</th>
            <th style={TH_STYLE}>{duongSuHeader}</th>
            <th style={TH_STYLE}>{baHeader}</th>
            <th style={TH_STYLE}>{lastColHeader}</th>
            {hasNhanTraCol && <th style={TH_STYLE}>{nhanTraHeader}</th>}
            <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={hasNhanTraCol ? 8 : 7} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
          {cases.map((c, idx) => (
            <tr
              key={c.id}
              style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#fafafa")
              }
            >
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <input type="checkbox" />
              </td>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 13, fontFamily: F }}>
                {idx + 1}
              </td>
              <td style={TD_STYLE}><CellThongTinDon c={c} tab={tab} /></td>
              <td style={TD_STYLE}><CellDuongSu c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}><CellBA c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}>
                {tab === "cho-y-kien" ? (
                  <CellYKienLD c={c} />
                ) : (
                  <CellVuAn c={c} onThemHoSo={onThemHoSo} />
                )}
              </td>
              {hasNhanTraCol && (
                <td style={TD_STYLE}>
                  {tab === "tra-lai" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: RED, fontFamily: F }}>
                        Lý do trả:
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4 }}>
                        {c.lyDoTraLai || "Đơn không thuộc thẩm quyền giải quyết theo thủ tục giám đốc thẩm, tái thẩm"}
                      </span>
                      {c.ngayTra && (
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}>
                          Ngày trả: {c.ngayTra}
                        </span>
                      )}
                    </div>
                  ) : (
                    <CellNhanTra c={c} tab={tab} />
                  )}
                </td>
              )}
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, borderRadius: 4,
                  }}
                  title="Xem chi tiết"
                >
                  <Eye size={15} color="#666666" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderTop: `1px solid ${BORDER}`,
          background: "#fff", fontSize: 12, color: MUTED, fontFamily: F,
        }}
      >
        <span>Hiển thị 1–{Math.min(cases.length, 10)} trong tổng {cases.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>
    </div>
  );
}

const paginBtn: React.CSSProperties = {
  padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
  background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
};

// ── Giao tiểu hồ sơ view ─────────────────────────────────────────────────────

function GiaoTieuHoSoView({ onClose, userRole }: { onClose: () => void; userRole?: UserRoleType }) {
  const [activeTab, setActiveTab] = useState<"nhan-vphctp" | "giao-ttv">("giao-ttv");
  const [expanded, setExpanded] = useState(true);

  const mainTabs = [
    { id: "nhan-vphctp", label: "Nhận THS từ VPHCTP" },
    { id: "giao-ttv", label: "Giao THS đến Công chức" },
  ] as const;

  const giaoCases = [
    {
      maDon: "6966",
      soCV: "514 - 20/07/2026",
      thuLyMoi: "54682424",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt",
      biCao: "Vũ Hòa Hảo",
      ndd: "NGUYỄN TRUNG HÒA",
      soBA: "12/2026/HS-PT",
      ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
      thoiHieu: "1 năm",
      loaiAn: "Hình sự",
    },
    {
      maDon: "6965",
      soCV: "513 - 20/07/2026",
      thuLyMoi: "54682424",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt",
      biCao: "Vũ Hòa Hảo",
      ndd: "NGUYỄN TRUNG HÒA",
      soBA: "12/2026/HS-PT",
      ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân khu vực 1 - Hà Nội",
      thoiHieu: "2 năm",
      loaiAn: "Hình sự",
    },
  ];

  const filterInputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    padding: "0 8px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  const cellInputStyle: React.CSSProperties = {
    width: "100%",
    height: 30,
    padding: "0 8px",
    fontSize: 11,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  const DateInputBox = ({ placeholder }: { placeholder: string }) => (
    <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          ...filterInputStyle,
          paddingRight: 28,
        }}
      />
      <Calendar size={13} color="#888888" style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
    </div>
  );

  const SelectBox = ({ placeholder, options = [] }: { placeholder: string; options?: string[] }) => (
    <select
      defaultValue=""
      style={filterInputStyle}
    >
      <option value="" disabled>{placeholder}</option>
      <option value="all">Tất cả</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fafafa", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0 }}>
        Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án › <b style={{ color: TEXT }}>Giao tiểu hồ sơ</b>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, padding: "0 20px", background: "#fff", flexShrink: 0 }}>
        {mainTabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontFamily: F,
                fontWeight: active ? 700 : 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: active ? "#8b1a1a" : "#666666",
                borderBottom: active ? `2px solid #8b1a1a` : "2px solid transparent",
                marginBottom: -1,
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Filter Panel Box */}
      <div style={{ padding: "14px 20px", flexShrink: 0 }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "14px 16px" }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: expanded ? 10 : 0 }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Người đứng đơn</div>
              <input placeholder="Người gửi đơn" style={filterInputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Số bản án/quyết định</div>
              <input placeholder="Số bản án/quyết định" style={filterInputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày bản án/quyết định</div>
              <DateInputBox placeholder="Vui lòng chọn" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Tòa ra bản án/quyết định</div>
              <SelectBox placeholder="Vui lòng chọn" options={["TAND thành phố Hà Nội", "TAND thành phố Hà Nội", "TAND thành phố Hà Nội", "TAND khu vực 4 - Hà Nội", "TAND khu vực 5 - Hà Nội"]} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày nhận đơn</div>
              <DateInputBox placeholder="Vui lòng chọn" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Thụ lý đơn</div>
              <SelectBox placeholder="Thụ lý đơn" options={["Thụ lý mới", "Đã thụ lý", "Chưa thụ lý"]} />
            </div>
          </div>

          {/* Row 2 (Collapsible) */}
          {expanded && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Số công văn chuyển</div>
                <input placeholder="Số công văn chuyển" style={filterInputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày công văn chuyển</div>
                <DateInputBox placeholder="Ngày công văn chuyển" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Thẩm phán</div>
                <SelectBox placeholder="-- Tất cả --" options={THAM_PHAN_TOA} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Loại án</div>
                <SelectBox placeholder="Loại án" options={["Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại", "Hôn nhân gia đình", "Lao động"]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Giao tiểu hồ sơ</div>
                <SelectBox placeholder="Giao tiểu hồ sơ" options={["Chưa giao tiểu hồ sơ", "Đã giao tiểu hồ sơ"]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Công chức giải quyết</div>
                <SelectBox placeholder="-- Tất cả --" options={THAM_TRA_VIEN_PHONG} />
              </div>
            </div>
          )}

          {/* Filter Footer Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "#1a73e8",
                fontFamily: F,
                padding: 0,
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {expanded ? "Thu gọn" : "Mở rộng"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
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
                <Search size={13} /> Tìm kiếm
              </button>
              <button
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
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar Above Table */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "0 20px 10px", flexShrink: 0 }}>
        <button
          style={{
            padding: "7px 22px",
            background: "#8b1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F,
          }}
        >
          Lưu
        </button>
        <button
          style={{
            padding: "7px 18px",
            background: "#0088a9",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F,
          }}
        >
          In danh sách
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "7px 20px",
            background: "#fff",
            color: "#333333",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          Đóng
        </button>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "20%" }} />
              {activeTab === "giao-ttv" ? (
                <>
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "12%" }} />
                </>
              ) : (
                <>
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                </>
              )}
            </colgroup>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>Thông tin đơn</th>
                <th style={TH_STYLE}>Đương sự và người đứng đơn</th>
                <th style={TH_STYLE}>Thông tin BA/QĐ đề nghị GĐT,TT</th>
                {activeTab === "giao-ttv" ? (
                  <>
                    <th style={TH_STYLE}>Người giao Vụ GĐ,KT</th>
                    <th style={TH_STYLE}>Ngày Vụ nhận</th>
                    <th style={TH_STYLE}>Công chức nhận</th>
                    <th style={TH_STYLE}>Ngày Công chức nhận</th>
                    <th style={TH_STYLE}>Ghi chú</th>
                  </>
                ) : (
                  <>
                    <th style={TH_STYLE}>Người giao VPHCTP</th>
                    <th style={TH_STYLE}>Người nhận Vụ GĐ,KT</th>
                    <th style={TH_STYLE}>Ngày Vụ nhận</th>
                    <th style={TH_STYLE}>Ghi chú</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {giaoCases.map((gc, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: `1px solid #f5f5f5`,
                  }}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{idx + 1}</td>

                  {/* Cột 1: Thông tin đơn */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, borderLeft: "3px solid #27ae60", paddingLeft: 6 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Mã đơn: <b>{gc.maDon}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        CV chuyển: {gc.soCV}
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Thụ lý mới: <b>{gc.thuLyMoi}</b>
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>
                        Hình thức: {gc.hinhThuc}
                      </span>
                    </div>
                  </td>

                  {/* Cột 2: Đương sự và người đứng đơn */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Người khiếu nại: <b>{gc.nguoiKhieuNai}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Bị cáo: <b>{gc.biCao}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        NĐD: <b>{gc.ndd}</b>
                      </span>
                    </div>
                  </td>

                  {/* Cột 3: Thông tin BA/QĐ */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Số BA: <span style={{ color: "#1a73e8", fontWeight: 600 }}>{formatSoBA(gc.soBA, gc.loaiAn)}</span>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Ngày: <span style={{ color: "#1a73e8" }}>{gc.ngayBA}</span>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Tại: {gc.toa}
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Thời hiệu: <b style={{ color: "#1b5e20" }}>{gc.thoiHieu}</b>
                      </span>
                    </div>
                  </td>

                  {/* Các cột tương tác */}
                  {activeTab === "giao-ttv" ? (
                    <>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Vũ Diệu Thúy</option>
                          <option value="2">Phạm Thị Bích Ngọc</option>
                          <option value="3">Nguyễn Văn A</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#888888" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Lý Thái Phúc</option>
                          <option value="2">Vũ Biêu Thư</option>
                          <option value="3">Trần Minh Đức</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#888888" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <input placeholder="Nhập ghi chú" style={cellInputStyle} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người giao</option>
                          <option value="1">Cán bộ VPHCTP 1</option>
                          <option value="2">Cán bộ VPHCTP 2</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Vũ Diệu Thúy</option>
                          <option value="2">Phạm Thị Bích Ngọc</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#888888" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <input placeholder="Nhập ghi chú" style={cellInputStyle} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED }}>
            <span>Hiển thị 1–{giaoCases.length} trong tổng {giaoCases.length} bản ghi</span>
            <div style={{ flex: 1 }} />
            <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>‹</button>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: "1px solid #8b1a1a", color: "#8b1a1a", fontSize: 12, fontWeight: 700 }}>
              1
            </span>
            <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>›</button>
            <select style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 11, outline: "none" }}>
              <option>10 / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Thanh TopBar của module đã bỏ. Sau khi gỡ ô chọn tài khoản phân quyền, nó chỉ
// còn 48px trắng với vài icon trang trí — mà bên trên đã có sẵn thanh breadcrumb
// của ứng dụng. Cụm icon nay nằm ở cuối thanh breadcrumb đó (xem app/App.tsx).

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
  userRole,
}: {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  userRole?: UserRoleType;
}) {
  return (
    <div
      style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`,
        background: "#fff", padding: "0 20px", flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      {TAB_CONFIG.map((t) => {
        const active = t.id === activeTab;
        const count = countByTab(t.id as TabId, userRole);
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id as TabId)}
            style={{
              padding: "12px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400,
              background: "none", border: "none", cursor: "pointer",
              color: active ? RED : MUTED,
              borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
              marginBottom: -1, whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ extra }: { extra?: string }) {
  return (
    <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
      Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án{extra ? ` › ${extra}` : ""} › Danh sách
    </div>
  );
}

// ── Cấu hình Công chức báo cáo ─────────────────────────────────────────────────────

const CAU_HINH_DATA = [
  { id: 1, hoTen: "Bùi Nguyễn Khánh (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Tiến Mạnh - Phó Trưởng phòng" },
  { id: 2, hoTen: "Bùi Quang Huy (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 3, hoTen: "Bùi Thị Vân Anh (TP)", chucDanh: "Thẩm phán bậc 1", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 4, hoTen: "Bùi Việt Anh (TP)", chucDanh: "Thẩm phán bậc 2", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 5, hoTen: "Chi Thị Đức (TK)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 6, hoTen: "Chu Thị Thoam (TP)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 7, hoTen: "Chị Thị Nhụng (Công chức)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 8, hoTen: "Dương Thảo Phương (Công chức)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "" },
  { id: 9, hoTen: "Giáng Tiêu Thọ (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
  { id: 10, hoTen: "Hoàng Ngô An (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 11, hoTen: "Hoàng Ngọc Điệu (Công chức)", chucDanh: "Công chức chính", nghiepVu: "Giải quyết án", lanhDao: "Trần Quốc Hành - Phó Trưởng phòng" },
  { id: 12, hoTen: "Hoàng Thanh Thủy (TK)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 13, hoTen: "Hoàng Thị Nhã Phương (Công chức)", chucDanh: "Công chức", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 14, hoTen: "Lê Thanh Tùng (Công chức)", chucDanh: "Công chức", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
];

const CHUC_DANH_OPTIONS = ["Thư ký Tòa án", "Thẩm phán bậc 1", "Thẩm phán bậc 2", "Công chức", "Công chức chính", "Công chức cao cấp"];
const NGHIEP_VU_OPTIONS = ["Giải quyết án", "Xử lý nghiệp vụ", "Báo cáo thống kê"];
const LANH_DAO_OPTIONS = [
  "Nguyễn Tiến Mạnh - Phó Trưởng phòng",
  "Nguyễn Văn Hiền - Phó Trưởng phòng",
  "Trần Quốc Hành - Phó Trưởng phòng",
  "GD Xét xử GĐT",
];

function CauHinhTTVView() {
  const [showBanner, setShowBanner] = useState(true);
  const [rows, setRows] = useState(CAU_HINH_DATA.map((r) => ({ ...r })));

  const selSt: React.CSSProperties = {
    width: "100%", padding: "5px 6px", fontSize: 11,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, outline: "none", background: "#fff", cursor: "pointer",
  };

  const update = (id: number, key: keyof typeof CAU_HINH_DATA[0], val: string) =>
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [key]: val } : r));

  return (
    // Cả trang cùng cuộn — xem ghi chú ở QuanLyVuAnView: khối tìm kiếm không được
    // ghim cứng, nếu không nó chiếm chỗ cố định và không đẩy đi được.
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Cấu hình Công chức báo cáo
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Lãnh đạo phụ trách</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Công chức</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {CAU_HINH_DATA.map((r) => <option key={r.id}>{r.hoTen}</option>)}
            </select>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In biểu mẫu
          </button>
        </div>
      </div>

      {/* Banner + Lưu cấu hình */}
      <div style={{ padding: "8px 20px", background: BG, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        {showBanner && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 6, fontSize: 12, color: "#1b5e20", fontFamily: F, fontWeight: 500 }}>
            <span style={{ fontSize: 16 }}>✓</span>
            Cập nhật dữ liệu thành công!
            <button onClick={() => setShowBanner(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#1b5e20", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}
        {!showBanner && <div style={{ flex: 1 }} />}
        <button
          onClick={() => setShowBanner(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, flexShrink: 0 }}
        >
          <Save size={13} /> Lưu cấu hình
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>Họ và tên</th>
              <th style={TH_STYLE}>Chức danh</th>
              <th style={TH_STYLE}>Nghiệp vụ Công chức</th>
              <th style={TH_STYLE}>Lãnh đạo phụ trách</th>
              <th style={TH_STYLE}>Người thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, fontWeight: 500 }}>{r.hoTen}</td>
                <td style={TD_STYLE}>
                  <select value={r.chucDanh} onChange={(e) => update(r.id, "chucDanh", e.target.value)} style={selSt}>
                    {CHUC_DANH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.nghiepVu} onChange={(e) => update(r.id, "nghiepVu", e.target.value)} style={selSt}>
                    {NGHIEP_VU_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.lanhDao} onChange={(e) => update(r.id, "lanhDao", e.target.value)} style={selSt}>
                    <option value="">- Tất cả -</option>
                    {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Nguyễn Văn A</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>11/06/2026</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{rows.length} trong tổng {rows.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function TabDanhSachDon({ detail }: { detail: VuAnDetailData }) {
  const danhSachDon = detail?.danhSachDon || [];
  return (
    <div style={{ padding: 20 }}>
      {/* ── THÔNG TIN CHUNG ── */}
      <ThongTinChungVuAnCard detail={detail} />

      {/* Danh sách đơn table */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách đơn</h3>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Tách vụ kiện
          </button>
          <button style={{ marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: 60 }} />
            <col style={{ width: "18%" }} /><col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "30%" }} /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Mã đơn", "Thông tin giải quyết đơn", "Ngày nhận đơn", "Người dùng đơn", "Phân loại", "Nội dung", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {danhSachDon.length === 0 && (
              <tr><td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {danhSachDon.map((d, idx) => (
              <tr key={d.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: "#1a73e8", fontSize: 12, fontWeight: 600 }}>{d.maDon}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#1b5e20" : MUTED, fontFamily: F }}>{d.thongTinGQ}</span>
                    {d.soThuLy && <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: {d.soThuLy}</span>}
                    {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{d.ngayThuLy}</span>}
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.ngayNhan}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.nguoiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{d.phanLoai}</span>
                    <Badge color={d.loaiDon === "DON_CHINH" ? "#1a5a96" : "#6e1414"} bg={d.loaiDon === "DON_CHINH" ? "#e8f4ff" : "#fdecea"}>
                      {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                    </Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{d.noiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem"><Eye size={14} color={MUTED} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaoPhieuModal({ onClose }: { onClose: () => void }) {
  const [loaiPhieu, setLoaiPhieu] = useState("phiếu");
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [diinhKem, setDinhKem] = useState(false);
  const [soPhieu, setSoPhieu] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSND thành phố Hà Nội", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const generatedNo = loaiPhieu === "Công văn xác minh"
        ? "527/2026/CV-TAHN"
        : loaiPhieu === "Phiếu trả"
          ? "18/2026/PT-TAHN"
          : "1/2026/CV-TAHN";
      setSoPhieu(generatedNo);
      setDaLaySo(true);
    } else {
      setSoPhieu("");
      setDaLaySo(false);
    }
  };

  const inSt: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };
  const lbl = (text: string, required = false) => (
    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3, display: "block" }}>
      {required && <span style={{ color: RED }}>* </span>}{text}
    </span>
  );

  if (showBieuMau) {
    return <XemBieuMauScreen loaiPhieu={loaiPhieu} onClose={() => setShowBieuMau(false)} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 14 }}>✏</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>
            {loaiPhieu === "Công văn xác minh" ? "Tạo công văn xác minh" : `Tạo ${loaiPhieu.toLowerCase()}`}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto" }}>
          {/* Info card */}
          <div style={{ background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên vụ án: </span>Vụ án Phan Văn Thành – bức cung</span>
                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Phan Văn Thành</span>
                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tội danh chính: </span>Bức cung</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>050526_CTH02</b></span>
                <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>05/05/2026</span>
                <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân khu vực 6 - Hà Nội</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Giai đoạn: </span>Giám đốc thẩm, tái thẩm</span>
                <span style={{ fontSize: 11, fontFamily: F, color: "#1a5a96" }}><span style={{ color: MUTED }}>Tòa án giải quyết: </span>Tòa án nhân dân thành phố Hà Nội</span>
                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>Chưa có kết quả giải quyết đơn</span></span>
              </div>
            </div>
          </div>

          {/* Loại phiếu */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ color: RED, fontSize: 14 }}>⊟</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Loại phiếu</span>
            </div>
            <div style={{ maxWidth: 300 }}>
              {lbl("Loại phiếu", true)}
              <select value={loaiPhieu} onChange={e => setLoaiPhieu(e.target.value)} style={selSt}>
                <option value="">Chọn loại phiếu</option>
                <option value="Phiếu mượn">Phiếu mượn</option>
                <option value="Phiếu trả">Phiếu trả</option>
                <option value="Phiếu chuyển">Phiếu chuyển</option>
                <option value="Nhận hồ sơ">Nhận hồ sơ</option>
                <option value="Công văn XM, BS">Công văn xác minh, bổ sung, tənh thủ sự, thông báo</option>
                <option value="Công văn khác">Công văn khác</option>
              </select>
            </div>
          </div>

          {/* Thông tin quyết định */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ color: RED, fontSize: 14 }}>⊟</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
              <div>
                {lbl("Ngày lập phiếu", true)}
                <div style={{ position: "relative" }}>
                  <input placeholder="Chọn ngày quyết định" style={inSt} />
                </div>
              </div>
              <div>
                {lbl("Số phiếu")}
                <input value={soPhieu} onChange={e => setSoPhieu(e.target.value)} placeholder="Nhập số quyết định" style={inSt} />
              </div>
              <div>
                {lbl("Người ký ban hành", true)}
                <select style={selSt}><option value="">Chọn người ký</option><option>Nguyễn Văn A</option></select>
              </div>
              <div>
                {lbl("Số bút lục")}
                <input placeholder="Nhập số bút lục" style={inSt} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
              <div>
                {lbl("Đơn vị giữ hồ sơ", true)}
                <select style={selSt}><option value="">Chọn Đơn vị giữ hồ sơ</option><option>VKSND thành phố Hà Nội</option></select>
              </div>
              <div>
                {lbl("Tên đơn vị")}
                <input placeholder="Nhập tên đơn vị" style={inSt} />
              </div>
              <div>
                {lbl("Cán bộ", true)}
                <select style={selSt}><option value="">Chọn cán bộ</option><option>Lý Thái Phúc</option></select>
              </div>
              <div>
                {lbl("Tên cán bộ", true)}
                <input placeholder="Nhập tên cán bộ" style={inSt} />
              </div>
            </div>
            <div>
              {lbl(loaiPhieu === "Công văn xác minh" ? "Nội dung" : "Ghi chú")}
              <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú"
                style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
            </div>
          </div>

          {/* Nơi nhận */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>
                <span style={{ color: RED }}>* </span>Nơi nhận
              </span>
              <button
                onClick={() => setAddingRow(true)}
                style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                Thêm nơi nhận
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "32%" }} />
                <col style={{ width: 110 }} />
              </colgroup>
              <thead>
                <tr>
                  {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
                    <th key={h} style={TH_STYLE}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {noiNhanRows.map((r, idx) => (
                  <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.noiNhan}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.chiTiet}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a73e8", fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                          ✏ Sửa
                        </button>
                        <button
                          onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#c0392b", fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                          🗑 Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {addingRow && (
                  <tr style={{ background: "#f0f7ff" }}>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{noiNhanRows.length + 1}</td>
                    <td style={TD_STYLE}>
                      <select value={newRow.noiNhan} onChange={e => setNewRow(p => ({ ...p, noiNhan: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                        <option value="">Chọn nơi nhận</option>
                        <option>Viện kiểm sát</option>
                        <option>Tòa án</option>
                        <option>Cơ quan điều tra</option>
                      </select>
                    </td>
                    <td style={TD_STYLE}>
                      <select value={newRow.chiTiet} onChange={e => setNewRow(p => ({ ...p, chiTiet: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                        <option value="">Chọn</option>
                        <option>VKSND thành phố Hà Nội</option>
                        <option>VKSND thành phố Hà Nội</option>
                      </select>
                    </td>
                    <td style={TD_STYLE}>
                      <input value={newRow.ghiChu} onChange={e => setNewRow(p => ({ ...p, ghiChu: e.target.value }))} placeholder="Nhập ghi chú" style={{ ...inSt, fontSize: 11 }} />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button
                          onClick={() => {
                            if (newRow.noiNhan) {
                              setNoiNhanRows(p => [...p, { id: Date.now(), ...newRow, editing: false }]);
                              setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" });
                              setAddingRow(false);
                            }
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a5a96", fontFamily: F, fontWeight: 600 }}>Lưu</button>
                        <button
                          onClick={() => { setAddingRow(false); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: F }}>Hủy</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Toggle đính kèm */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              onClick={() => setDinhKem(v => !v)}
              style={{ width: 36, height: 20, borderRadius: 10, background: diinhKem ? "#1a5a96" : "#cccccc", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: diinhKem ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Đính kèm tài liệu, hồ sơ</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lưu</button>
            {daLaySo ? (
              <button
                onClick={handleToggleLaySo}
                style={{
                  padding: "7px 20px",
                  background: "#fdf3f2",
                  color: "#c0392b",
                  border: "1px solid #f3c0bb",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                ✕ Hủy cấp số
              </button>
            ) : (
              <button
                onClick={handleToggleLaySo}
                style={{
                  padding: "7px 20px",
                  background: "#fff",
                  color: "#333333",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: F,
                }}
              >
                Lấy số
              </button>
            )}
            <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
            <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 20px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
          </div>
        </div>
      </div>
    </div>
  );
}




// ── Confirm thu hồi dialog ─────────────────────────────────────────────────────


// ── Tab Tờ trình trong Chi tiết vụ án ──────────────────────────────────────────
function TabToTrinh({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);

  const [lichSuData, setLichSuData] = useState([
    {
      ngayTrinh: "09/08/2026",
      lanh: detail?.thamPhan || "Nguyễn Biên Thuỳ",
      capTrinh: "Thẩm phán phụ trách",
      vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị GĐT",
      yKien: "Đồng ý với đề xuất của Công chức. Chuyển Lãnh đạo Vụ xem xét trình Chánh án.",
      ngayDuyet: "09/08/2026",
      trangThai: "da-duyet",
      subRows: [] as { label: string; ngayDuyet: string }[],
    },
    {
      ngayTrinh: "05/08/2026",
      lanh: "Lãnh đạo Tòa Hình sự",
      capTrinh: "Phó Trưởng phòng",
      vanBan: "Tờ trình xin ý kiến hướng giải quyết",
      yKien: "Yêu cầu Công chức thẩm tra kỹ tình tiết lời khai nhân chứng tại BL 45-50 trước khi báo cáo lại.",
      ngayDuyet: "06/08/2026",
      trangThai: "tu-choi",
      subRows: [],
    },
  ]);

  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const [vanBanList, setVanBanList] = useState([
    {
      stt: 1,
      loai: "to-trinh",
      vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm",
      don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`,
      ngayTao: "09/08/2026",
      nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)",
      trangThai: "–",
      daDinhKemHoSo: true,
      soHoSo: 5,
    },
    {
      stt: 2,
      loai: "du-thao",
      vanBan: "Dự thảo Quyết định kháng nghị giám đốc thẩm",
      don: `${detail?.maVuAn || "VA26-002621"} - Đơn 09D732899`,
      ngayTao: "09/08/2026",
      nguoiKy: "–",
      trangThai: "Chờ ký số",
      daDinhKemHoSo: true,
      soHoSo: 3,
    },
    {
      stt: 3,
      loai: "du-thao",
      vanBan: "Dự thảo Thông báo trả lời đơn đề nghị",
      don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`,
      ngayTao: "08/08/2026",
      nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)",
      trangThai: "Đã ký số",
      daDinhKemHoSo: true,
      soHoSo: 1,
    },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => {
    const toTrinhCount = vanBanList.filter(x => x.vanBan.includes("Tờ trình")).length + 1;
    const count = data?.countHoSo ?? 5;
    const isAttached = data?.daDinhKemHoSo ?? true;

    const newRow = {
      stt: 1,
      loai: "to-trinh",
      vanBan: `Tờ trình thẩm tra vụ án số ${toTrinhCount}`,
      don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`,
      ngayTao: "09/08/2026",
      nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)",
      trangThai: "–",
      daDinhKemHoSo: isAttached,
      soHoSo: count,
    };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  const handleKySo = (stt: number) => {
    setVanBanList(prev =>
      prev.map(r => (r.stt === stt ? { ...r, trangThai: "Đã ký số", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (Công chức)" } : r))
    );
    alert("Đã ký số văn bản thành công!");
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
    }
  };

  const handleTrinhVanBanClick = () => {
    const hasMissingHoSo = vanBanList.some(r => r.vanBan.includes("Tờ trình") && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình văn bản! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }
    const hasUnsigned = vanBanList.some(
      r => !r.vanBan.toLowerCase().includes("tờ trình") && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số")
    );
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Các văn bản Dự thảo phải được KÝ SỐ trước khi ấn Trình văn bản!");
      return;
    }
    setShowTrinhKy(true);
  };

  const allDonOptions = Array.from(
    new Set(lichSuData.flatMap(r => (r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean))))
  );
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => {
    const matchDon = !filterDon || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = {
    padding: "8px 10px",
    background: BG,
    fontWeight: 700,
    fontSize: 11,
    color: "#333333",
    fontFamily: F,
    textAlign: "left",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    wordBreak: "break-word",
  };
  const TD: React.CSSProperties = {
    padding: "9px 10px",
    fontSize: 12,
    color: TEXT,
    fontFamily: F,
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    wordBreak: "break-word",
    overflowWrap: "break-word",
    verticalAlign: "top",
  };

  const handleSaveDuThao = (data?: any) => {
    let tenDuThao = "Dự thảo Thông báo trả lời đơn đề nghị";
    if (data?.ketQuaGQ === "khang-nghi") {
      tenDuThao = "Dự thảo Quyết định kháng nghị giám đốc thẩm";
    } else if (data?.ketQuaGQ === "xep-don") {
      tenDuThao = "Dự thảo Thông báo xếp đơn đề nghị";
    } else if (data?.ketQuaGQ === "vks-dang-giai-quyet") {
      tenDuThao = "Dự thảo Thông báo Viện kiểm sát đang giải quyết";
    }
    const newRow = {
      stt: 1,
      loai: "du-thao",
      vanBan: tenDuThao,
      don: `${detail?.maVuAn || "VA26-00321"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`,
      ngayTao: data?.ngayQuyetDinh || "09/08/2026",
      nguoiKy: data?.nguoiKy || "Nguyễn Biên Thuỳ",
      trangThai: "Chờ ký số",
      daDinhKemHoSo: true,
      soHoSo: 3,
    };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} detail={detail} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} detail={detail} onSave={handleSaveDuThao} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => {
            setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx));
            setThuHoiIdx(null);
          }}
        />
      )}

      {/* ── Bảng Danh sách văn bản ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>
            Danh sách văn bản & Tờ trình
          </span>
          <button onClick={handleTrinhVanBanClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Send size={13} /> Trình văn bản
          </button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            + Tạo dự thảo
          </button>
          <button onClick={() => setShowTaoTT(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <RefreshCw size={13} /> Tạo tờ trình
          </button>
          <button onClick={() => setShowHoSo(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Archive size={13} /> Hồ sơ tờ trình
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 600 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "TÊN VĂN BẢN", "ĐƠN / VỤ ÁN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanBanList.map((r, idx) => {
                const isToTrinh = r.loai === "to-trinh" || r.vanBan.toLowerCase().includes("tờ trình");
                return (
                  <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                    <td style={{ ...TD, color: "#1a73e8", fontWeight: 600 }}>
                      📄 {r.vanBan}
                      {r.soHoSo ? (
                        <div style={{ fontSize: 11, color: MUTED, fontWeight: 400, marginTop: 2 }}>
                          📎 Đính kèm {r.soHoSo} hồ sơ tài liệu
                        </div>
                      ) : null}
                    </td>
                    <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.don}</td>
                    <td style={TD}>{r.ngayTao}</td>
                    <td style={TD}>{r.nguoiKy}</td>
                    <td style={TD}>
                      {isToTrinh ? (
                        <span style={{ color: MUTED }}>–</span>
                      ) : r.trangThai === "Chưa ký số" ? (
                        <Badge color="#6e1414" bg="#fdecea">Chưa ký số</Badge>
                      ) : (
                        <Badge
                          color={r.trangThai === "Đã phát hành" ? "#1b5e20" : r.trangThai === "Đã ký số" ? "#1a5a96" : "#8a6d00"}
                          bg={r.trangThai === "Đã phát hành" ? "#e8f5e9" : r.trangThai === "Đã ký số" ? "#e8f4ff" : "#fff8e1"}
                        >
                          {r.trangThai}
                        </Badge>
                      )}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isToTrinh && (
                          <button
                            onClick={() => setShowTrinhKy(true)}
                            title="Trình lại tờ trình"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}
                          >
                            <RotateCcw size={14} color="#1a5a96" />
                          </button>
                        )}
                        {isToTrinh && (
                          <button
                            onClick={() => handleDeleteVanBan(r.stt)}
                            title="Xóa tờ trình"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}
                          >
                            <Trash2 size={14} color="#c0392b" />
                          </button>
                        )}
                        {!isToTrinh && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số") && (
                          <button
                            onClick={() => handleDeleteVanBan(r.stt)}
                            title="Xóa dự thảo"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}
                          >
                            <Trash2 size={14} color="#c0392b" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (isToTrinh) setShowTaoTT(true);
                            else setShowTaoDuThao(true);
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}
                          title={isToTrinh ? "Xem chi tiết tờ trình" : "Xem chi tiết dự thảo"}
                        >
                          <Eye size={14} color="#1a5a96" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Lịch sử trình ký ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {/* Filter by đơn */}
          {!isVu234(userRole, detail?.loaiAn) && (
            <select value={filterDon} onChange={e => setFilterDon(e.target.value)}
              style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
              <option value="">Lọc theo đơn</option>
              {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {/* Filter by văn bản */}
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN/ĐƠN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r) => {
                const realIdx = lichSuData.indexOf(r);
                return (
                  <React.Fragment key={"main-" + realIdx}>
                    <tr style={{ background: "#fff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                      <td style={TD}>{r.ngayTrinh}</td>
                      <td style={TD}>{r.lanh}</td>
                      <td style={TD}>{r.capTrinh}</td>
                      <td style={{ ...TD, color: "#1a73e8" }}>{r.vanBan}</td>
                      <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" }}>{r.yKien}</td>
                      <td style={TD}>{r.ngayDuyet}</td>
                      <td style={TD}>
                        {r.trangThai === "cho-duyet"
                          ? <Badge color="#8a6d00" bg="#fff8e1">Chờ duyệt</Badge>
                          : r.trangThai === "tu-choi"
                            ? <Badge color="#6e1414" bg="#fdecea">Từ chối</Badge>
                            : <Badge color="#1b5e20" bg="#e8f5e9">Đã duyệt</Badge>}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                            <Eye size={13} color="#1a5a96" />
                          </button>
                          {r.trangThai === "cho-duyet" && (
                            <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                          {r.trangThai === "tu-choi" ? (
                            <button
                              title="Trình lại tờ trình"
                              onClick={() => setShowTrinhKy(true)}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}
                            >
                              <RotateCcw size={13} color="#1a5a96" />
                            </button>
                          ) : (
                            <button
                              title="Trình ký"
                              onClick={() => setShowTrinhKy(true)}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}
                            >
                              <Send size={13} color={RED} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {r.subRows.map((sub, si) => (
                      <tr key={"sub-" + realIdx + "-" + si} style={{ background: "#fafafa" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED }} />
                        {/* <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td> */}
                        <td style={{ ...TD, fontSize: 11, color: MUTED }} colSpan={3}>Ngày: {sub.ngayDuyet}</td>
                        <td style={TD}><Badge color="#1b5e20" bg="#e8f5e9">Đã duyệt</Badge></td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                              <Eye size={13} color="#1a5a96" />
                            </button>
                            <button title="Trình lại" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <RotateCcw size={13} color="#1a5a96" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab Giải quyết văn bản đề nghị (Kết quả giải quyết đơn theo mẫu ảnh) ─────────────
function TabGiaiQuyetVB({ detail }: { detail?: VuAnDetailData }) {
  const [showThemKetQua, setShowThemKetQua] = useState(false);
  const [showThemHoan, setShowThemHoan] = useState(false);
  const [searchHoan, setSearchHoan] = useState("");
  const [isHoanChecked, setIsHoanChecked] = useState(true);
  const [quyetDinhHoanList, setQuyetDinhHoanList] = useState<Array<{
    stt: number;
    biCao: string;
    tenQuyetDinh: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    nguoiKy: string;
    nguoiTao: string;
  }>>([]);

  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleAddQuyetDinhHoan = (newItem: any) => {
    setQuyetDinhHoanList(prev => [
      ...prev,
      {
        stt: prev.length + 1,
        ...newItem,
      },
    ]);
  };

  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const groups = isKhieuNai ? [
    {
      id: "chap-nhan-khieu-nai",
      title: "Chấp nhận khiếu nại",
      items: [
        {
          stt: 1,
          maDon: "1531",
          soQuyetDinh: "179/2026/QĐ-GQKN",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [
            { ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" },
            { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" },
          ],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
      ],
    },
    {
      id: "khong-chap-nhan-khieu-nai",
      title: "Không chấp nhận khiếu nại",
      items: [
        {
          stt: 1,
          maDon: "1532, 1432",
          soQuyetDinh: "180/2026/QĐ-GQKN",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [
            { ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" },
          ],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ] : [
    {
      id: "tra-loi-don",
      title: "Trả lời đơn",
      items: [
        {
          stt: 1,
          maDon: "1531",
          soQuyetDinh: "179/2026/TB-TA",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [
            { ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" },
            { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" },
          ],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
        {
          stt: 2,
          maDon: "1234",
          soQuyetDinh: "179/2026/TB-TA",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [
            { ten: "Nguyễn Thị Bình", status: "Đã duyệt - 10/07/2026" },
          ],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:00:38" },
        },
      ],
    },
    {
      id: "khang-nghi",
      title: "Kháng nghị",
      items: [
        {
          stt: 1,
          maDon: "1532, 1432",
          soQuyetDinh: "179/2026/KN-HS",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [
            { ten: "Nguyễn Thị Bình - Trưởng phòng", status: "Đã duyệt - 10/07/2026" },
            { ten: "Nguyễn Thị Hoa - TPTC", status: "Đã duyệt - 09/07/2026" },
          ],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ];

  const thSt: React.CSSProperties = {
    padding: "10px 8px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#333333",
    fontFamily: F,
    whiteSpace: "nowrap",
  };

  const tdSt: React.CSSProperties = {
    padding: "10px 8px",
    fontSize: 12,
    fontFamily: F,
    verticalAlign: "top",
  };

  return (
    <div style={{ padding: 20, fontFamily: F }}>
      {showThemKetQua && (
        <ThemKetQuaModal
          onClose={() => {
            setShowThemKetQua(false);
            setSelectedDetail(null);
          }}
          detail={selectedDetail || detail}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#222222", fontFamily: F }}>
            {isKhieuNai ? "Kết quả giải quyết khiếu nại" : "Kết quả giải quyết đơn"}
          </span>
          <button
            onClick={() => {
              setSelectedDetail(detail);
              setShowThemKetQua(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              background: "#8b1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            + Thêm kết quả giải quyết
          </button>
        </div>

        {/* Groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groups.map(g => {
            const isCollapsed = !!collapsedGroups[g.id];
            return (
              <div key={g.id} style={{ display: "flex", flexDirection: "column" }}>
                {/* Group Section Header */}
                <div
                  onClick={() => toggleGroup(g.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#222222", fontFamily: F }}>
                    {g.title}
                  </span>
                  <span style={{ fontSize: 12, color: "#666666" }}>
                    {isCollapsed ? "▼" : "▲"}
                  </span>
                </div>

                {/* Group Table */}
                {!isCollapsed && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                      <thead>
                        <tr style={{ background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
                          <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                          <th style={{ ...thSt, width: 100 }}>Mã đơn</th>
                          <th style={{ ...thSt, width: 140 }}>Số quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày phát hành</th>
                          <th style={{ ...thSt, width: 220 }}>Người duyệt</th>
                          <th style={{ ...thSt, width: 200 }}>Người ký</th>
                          <th style={{ ...thSt, width: 180 }}>Người tạo</th>
                          <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5", background: "#fff" }}>
                            <td style={{ ...tdSt, textAlign: "center", color: "#666666" }}>{r.stt}</td>
                            <td style={{ ...tdSt, color: "#222222" }}>{r.maDon}</td>
                            <td style={{ ...tdSt }}>
                              <span
                                onClick={() => {
                                  setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh });
                                  setShowThemKetQua(true);
                                }}
                                style={{ color: "#1a5a96", fontWeight: 500, cursor: "pointer" }}
                              >
                                {r.soQuyetDinh}
                              </span>
                            </td>
                            <td style={{ ...tdSt, color: "#333333" }}>{r.ngayQuyetDinh}</td>
                            <td style={{ ...tdSt, color: "#666666" }}>{r.ngayPhatHanh}</td>
                            <td style={{ ...tdSt }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {r.nguoiDuyet.map((nd, i) => (
                                  <div key={i} style={{ lineHeight: 1.3 }}>
                                    <div style={{ color: "#222222", fontWeight: 500 }}>{nd.ten}</div>
                                    <div style={{ color: "#27ae60", fontSize: 11 }}>{nd.status}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#222222", fontWeight: 500 }}>{r.nguoiKy.ten}</div>
                                <div style={{ color: r.nguoiKy.isDone ? "#27ae60" : "#666666", fontSize: 11 }}>
                                  {r.nguoiKy.status}
                                </div>
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#222222", fontWeight: 500 }}>{r.nguoiTao.ten}</div>
                                <div style={{ color: "#666666", fontSize: 11 }}>{r.nguoiTao.thoiGian}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt, textAlign: "center" }}>
                              <button
                                onClick={() => {
                                  setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh });
                                  setShowThemKetQua(true);
                                }}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                                title="Xem chi tiết"
                              >
                                <Eye size={15} color="#666666" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
            paddingTop: 12,
            fontSize: 12,
            color: "#666666",
            fontFamily: F,
          }}
        >
          <span>Hiển thị 1-2 trong tổng 2 bản ghi</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              disabled
              style={{
                background: "none",
                border: "none",
                color: "#cccccc",
                cursor: "not-allowed",
                padding: "2px 6px",
              }}
            >
              &lt;
            </button>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#8b1a1a",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              1
            </span>
            <button
              disabled
              style={{
                background: "none",
                border: "none",
                color: "#cccccc",
                cursor: "not-allowed",
                padding: "2px 6px",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {!isKhieuNai && showThemHoan && (
        <ThemQuyetDinhHoanModal
          onClose={() => setShowThemHoan(false)}
          detail={detail}
          onSave={handleAddQuyetDinhHoan}
        />
      )}

      {/* Thông tin quyết định hoãn thi hành án */}
      {!isKhieuNai && (
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#222222", fontFamily: F }}>
              Thông tin quyết định hoãn thi hành án
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: F }}>
                <input
                  type="checkbox"
                  checked={isHoanChecked}
                  onChange={e => setIsHoanChecked(e.target.checked)}
                  style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                />
                <span>Quyết định hoãn thi hành án</span>
              </label>
              <div style={{ position: "relative", width: 220 }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchHoan}
                  onChange={e => setSearchHoan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 28px",
                    fontSize: 12,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontFamily: F,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Search size={13} color={MUTED} style={{ position: "absolute", left: 8, top: 7, pointerEvents: "none" }} />
              </div>
            </div>

            <button
              onClick={() => setShowThemHoan(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#8b1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              + Thêm mới
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
                  <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                  <th style={{ ...thSt, width: 140 }}>Tên Bị cáo</th>
                  <th style={{ ...thSt }}>Tên quyết định</th>
                  <th style={{ ...thSt, width: 120 }}>Số QĐ</th>
                  <th style={{ ...thSt, width: 110 }}>Ngày ra QĐ</th>
                  <th style={{ ...thSt, width: 160 }}>Người ký</th>
                  <th style={{ ...thSt, width: 140 }}>Người tạo</th>
                  <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quyetDinhHoanList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "28px 16px", color: MUTED, fontSize: 13, fontStyle: "italic", borderBottom: "1px solid #f5f5f5" }}>
                      Chưa có quyết định hoãn thi hành án
                    </td>
                  </tr>
                ) : (
                  quyetDinhHoanList
                    .filter(r => !searchHoan || r.tenQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()) || r.biCao.toLowerCase().includes(searchHoan.toLowerCase()) || r.soQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5", background: "#fff" }}>
                        <td style={{ ...tdSt, textAlign: "center", color: "#666666" }}>{r.stt}</td>
                        <td style={{ ...tdSt, color: "#222222", fontWeight: 600 }}>{r.biCao}</td>
                        <td style={{ ...tdSt, color: "#1a73e8", fontWeight: 500 }}>{r.tenQuyetDinh}</td>
                        <td style={{ ...tdSt, fontWeight: 500 }}>{r.soQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#333333" }}>{r.ngayQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#333333" }}>{r.nguoiKy}</td>
                        <td style={{ ...tdSt, color: "#666666" }}>{r.nguoiTao}</td>
                        <td style={{ ...tdSt, textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem chi tiết">
                              <Eye size={14} color="#1a5a96" />
                            </button>
                            <button onClick={() => setQuyetDinhHoanList(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa">
                              <Trash2 size={14} color="#c0392b" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}




function ModalTrinhKy({ record, onClose }: { record?: any; onClose: () => void }) {
  const [nguoiKy, setNguoiKy] = useState("Chu Thị Thu Hiền");
  const [mucDoUuTien, setMucDoUuTien] = useState("Bình thường");
  const [noiDungKy, setNoiDungKy] = useState("");

  const handleSubmit = () => {
    alert(`Đã gửi trình duyệt ký thành công cho ${nguoiKy}!`);
    onClose();
  };

  const darkRed = "#700000";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 620, maxWidth: "92vw", padding: 28, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#222222", fontFamily: F }}>
            Nhập thông tin trình ký
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", fontSize: 13, fontFamily: F }}>
            close
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* 1. Người ký văn bản */}
          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Người ký văn bản
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={nguoiKy}
                onChange={e => setNguoiKy(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6,
                  fontFamily: F, color: "#222222", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Chu Thị Thu Hiền">Chu Thị Thu Hiền</option>
                <option value="Nguyễn Văn Dũng">Nguyễn Văn Dũng</option>
                <option value="Phạm Văn Hải - Chánh án TAND thành phố Hà Nội">Phạm Văn Hải - Chánh án TAND thành phố Hà Nội</option>
                <option value="Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự">Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự</option>
                <option value="Lê Hoàng Nam - Trưởng phòng">Lê Hoàng Nam - Trưởng phòng</option>
              </select>
              <ChevronDown size={18} color="#666666" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          {/* 2. Mức độ ưu tiên */}
          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Mức độ ưu tiên
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={mucDoUuTien}
                onChange={e => setMucDoUuTien(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6,
                  fontFamily: F, color: "#222222", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Thấp">Thấp</option>
              </select>
              <ChevronDown size={18} color="#666666" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          {/* 3. Nội dung trình duyệt ký */}
          <div>
            <label style={{ fontSize: 13, color: "#666666", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Nội dung trình duyệt ký
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                value={noiDungKy}
                onChange={e => setNoiDungKy(e.target.value)}
                placeholder="Nhập nội dung trình duyệt ký"
                maxLength={4000}
                style={{
                  width: "100%", padding: "12px 14px", paddingBottom: 32, fontSize: 14,
                  border: "1px solid #cccccc", borderRadius: 6, fontFamily: F,
                  minHeight: 120, boxSizing: "border-box", outline: "none", resize: "vertical"
                }}
              />
              <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 12, color: "#888888", fontFamily: F }}>
                {noiDungKy.length} / 4000
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 28px", background: darkRed, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Trình ký
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 28px", background: "#fff", color: "#222222",
              border: "1px solid #cccccc", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}

function ModalTraHoSo({ onClose, onConfirm }: { onClose: () => void; onConfirm: (lyDo: string) => void }) {
  const [ngayThaoTac, setNgayThaoTac] = useState("07/08/2026");
  const [canBo, setCanBo] = useState("Lý Thái Phúc");
  const [lyDo, setLyDo] = useState("");

  const handleConfirmTra = () => {
    if (!lyDo.trim()) {
      alert("Vui lòng nhập lý do trả hồ sơ!");
      return;
    }
    onConfirm(lyDo);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontFamily: F }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Trả lại hồ sơ kháng nghị đến
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
          <button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalTaoCongVan({ record, onClose, onConfirm }: { record?: any; onClose: () => void; onConfirm: (config: any) => void }) {
  const getInitialDonViNhan = () => {
    if (!record) return "Viện kiểm sát nhân dân thành phố Hà Nội";
    const toaRA = record.toaRaBanAn || "";
    const dvNhan = record.donViNhan || "";
    if (toaRA.toLowerCase().includes("tỉnh") || dvNhan.toLowerCase().includes("tỉnh")) {
      return dvNhan.toLowerCase().includes("tỉnh") ? dvNhan : "Tòa án nhân dân khu vực 5 - Hà Nội";
    }
    return "Viện kiểm sát nhân dân thành phố Hà Nội";
  };

  const [loaiVanBan, setLoaiVanBan] = useState("Phiếu chuyển đơn");
  const [donViNhan, setDonViNhan] = useState(getInitialDonViNhan());
  const [toaGiuHoSo, setToaGiuHoSo] = useState(record?.toaGiuHoSo || "Tòa án nhân dân thành phố Hà Nội");
  const [duongSu, setDuongSu] = useState(record?.nguoiKhieuNai ? `${record.nguoiKhieuNai}` : "bà Đặng Thị Dương");
  const [noiDung, setNoiDung] = useState(record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại.");

  const getVuSuffix = () => {
    const l = (record?.loaiAn || "").toLowerCase();
    const dv = (donViNhan || "").toLowerCase();
    const ba = (record?.soBA || "").toLowerCase();

    if (dv.includes("vụ 1") || dv.includes("vụ i") || l.includes("hình sự") || ba.includes("hs")) return "Vụ 1";
    if (dv.includes("vụ 2") || dv.includes("vụ ii") || l.includes("dân sự") || ba.includes("ds")) return "Vụ 2";
    if (dv.includes("vụ 3") || dv.includes("vụ iii") || l.includes("thương mại") || l.includes("kdtm") || l.includes("hôn nhân") || l.includes("gia đình") || l.includes("lao động") || ba.includes("kdtm") || ba.includes("hngđ") || ba.includes("lđ")) return "Vụ 3";
    if (dv.includes("vụ 4") || dv.includes("vụ iv") || l.includes("hành chính") || ba.includes("hc")) return "Vụ 4";

    return "Vụ 1";
  };

  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);

  const vuSuffixCurrent = getVuSuffix();
  const hậuTốVuModal = `TAND thành phố Hà Nội - ${vuSuffixCurrent}`;
  const soCongVanModal = hasNumber ? `05/${hậuTốVuModal}` : `.../${hậuTốVuModal}`;

  const handleSave = () => {
    setIsSaved(true);
    alert("Đã lưu biểu mẫu công văn thành công! Bạn có thể thực hiện Trình ký, Lấy số hoặc Xem biểu mẫu.");
  };

  const handleToggleCapSo = () => {
    if (hasNumber) {
      setHasNumber(false);
      alert("Đã hủy cấp số công văn.");
    } else {
      setHasNumber(true);
      alert(`Đã tự động cấp số công văn: ${soCongVanModal}`);
    }
  };

  const handleXemBiêuMau = () => {
    onConfirm({
      loaiVanBan,
      donViNhan,
      toaGiuHoSo,
      nguoiKhieuNai: duongSu,
      noiDungDon: noiDung,
      hasNumber,
      soCongVan: soCongVanModal,
      ...record
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 580, maxWidth: "92vw", padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Tạo biểu mẫu công văn
            </span>
            {isSaved && (
              <span style={{ fontSize: 11, background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                ✓ Đã lưu biểu mẫu
              </span>
            )}
            {hasNumber && (
              <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                🔢 Số: 05/TAHN - Tòa Hình sự
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tên loại văn bản / biểu mẫu *</label>
            <select value={loaiVanBan} onChange={e => setLoaiVanBan(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fff", color: TEXT, boxSizing: "border-box" }}>
              <option value="Phiếu chuyển đơn">Phiếu chuyển (Công văn chuyển)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 600 }}>Đơn vị nhận *</label>
              <span style={{ fontSize: 11, color: "#1a73e8", fontFamily: F, fontStyle: "italic" }}>(Tự động lấy từ Quyết định kháng nghị)</span>
            </div>
            <select
              value={donViNhan}
              onChange={e => setDonViNhan(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fafafa", color: TEXT, boxSizing: "border-box" }}>
              <option value="Viện kiểm sát nhân dân thành phố Hà Nội">Viện kiểm sát nhân dân thành phố Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 5 - Hà Nội">Tòa án nhân dân khu vực 5 - Hà Nội</option>
              <option value="Tòa án nhân dân TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 2 - Hà Nội">Tòa án nhân dân khu vực 2 - Hà Nội</option>
              <option value="Tòa án nhân dân khu vực 4 - Hà Nội">Tòa án nhân dân khu vực 4 - Hà Nội</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tòa án giữ hồ sơ</label>
              <input value={toaGiuHoSo} onChange={e => setToaGiuHoSo(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Đương sự</label>
              <input value={duongSu} onChange={e => setDuongSu(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Nội dung đơn</label>
            <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={3} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Footer Buttons Workflow */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          {!isSaved ? (
            /* Ban đầu chưa lưu: Nút "Lưu biểu mẫu", "Xem biểu mẫu" và "Đóng" */
            <>
              <button
                onClick={handleSave}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#27ae60", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Save size={15} /> Lưu biểu mẫu
              </button>
              <button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Eye size={15} /> Xem biểu mẫu
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 16px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                Đóng
              </button>
            </>
          ) : (
            /* ĐÃ LƯU BIỂU MẪU -> Hiển thị COMBO nút: Trình ký, Lấy số, Xem biểu mẫu, Đóng */
            <>
              <button
                onClick={() => setShowTrinhKy(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Trình ký
              </button>

              <button
                onClick={handleToggleCapSo}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  background: hasNumber ? "#c0392b" : "#7c3aed",
                  color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                {hasNumber ? "Hủy cấp số" : "Lấy số"}
              </button>

              <button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#555555", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Xem biểu mẫu
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                ✖ Đóng
              </button>
            </>
          )}
        </div>

        {/* Modal Trình ký Lãnh đạo */}
        {showTrinhKy && <ModalTrinhKy record={record} onClose={() => setShowTrinhKy(false)} />}
      </div>
    </div>
  );
}

// ── Modal Nhận hồ sơ kháng nghị ───────────────────────────────────────────────
function ModalNhanHoSoKhangNghi({
  record,
  onClose,
  onConfirm,
}: {
  record: any;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const rec = record || {
    maDon: "KN-DEN-001",
    soKhangNghi: "08/2026/QĐKN",
    ngayKhangNghi: "03/07/2026",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân Thành phố Hà Nội",
    soBA: "236/2026/HS-PT",
    ngayBA: "03/07/2026",
    toaRaBanAn: "TAND khu vực 4 - Hà Nội",
    loaiAn: "Hình sự",
    nguoiKhieuNai: "Nguyễn Văn Bình",
    donViGui: "Viện kiểm sát nhân dân Thành phố Hà Nội",
    trangThai: "Chờ nhận",
  };

  const taiLieuList = [
    { stt: 1, ten: `Quyết định kháng nghị số ${rec.soKhangNghi || "08/2026/QĐKN"}`, loai: "Quyết định", ngay: rec.ngayKhangNghi || "03/07/2026", soTrang: 6, ghiChu: "Đã đóng dấu ký số" },
    { stt: 2, ten: `Bản án sơ thẩm/phúc thẩm số ${rec.soBA || "236/2026/HS-PT"}`, loai: "Bản án", ngay: rec.ngayBA || "03/07/2026", soTrang: 28, ghiChu: "Bản chính" },
    { stt: 3, ten: "Tờ trình đề nghị kháng nghị giám đốc thẩm", loai: "Tờ trình", ngay: "01/07/2026", soTrang: 8, ghiChu: "Bản gốc" },
    { stt: 4, ten: "Biên bản kiểm tra hồ sơ vụ án hình sự", loai: "Biên bản", ngay: "02/07/2026", soTrang: 4, ghiChu: "Kèm theo" },
    { stt: 5, ten: "Hồ sơ, chứng cứ đính kèm quyết định kháng nghị", loai: "Chứng cứ", ngay: "03/07/2026", soTrang: 52, ghiChu: "Tệp đính kèm" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 860, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", overflow: "hidden", fontFamily: F }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={18} color="#1a5a96" />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin hồ sơ kháng nghị đến</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={18} />
          </button>
        </div>

        {/* Content - Chia 2 cột */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* CỘT TRÁI: Thông tin chính hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", height: "fit-content" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase", fontFamily: F }}>
                📌 Thông tin hồ sơ kháng nghị
              </span>
              <Badge color={rec.trangThai?.includes("Đã") ? "#1b5e20" : "#8a6d00"} bg={rec.trangThai?.includes("Đã") ? "#e8f5e9" : "#fff8e1"}>
                {rec.trangThai || "Chờ nhận"}
              </Badge>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "38%" }}>Số – Ngày QĐ kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: RED, fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soKhangNghi || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayKhangNghi || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Người kháng nghị</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhangNghi || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#1a73e8", fontWeight: 600, borderBottom: `1px solid ${BORDER}` }}>
                    {rec.soBA || "---"} <span style={{ color: MUTED, fontWeight: 400 }}>(Ngày {rec.ngayBA || "---"})</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.toaRaBanAn || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại án</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.loaiAn || "Hình sự"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đương sự / Người KN</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{rec.nguoiKhieuNai || "---"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "9px 12px", background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Đơn vị gửi</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: TEXT }}>{rec.donViGui || "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CỘT PHẢI: Bảng danh sách tài liệu của hồ sơ kháng nghị */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "9px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>
                📑 Danh sách tài liệu kèm theo ({taiLieuList.length})
              </span>
            </div>
            <div style={{ overflowX: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: BG }}>
                    {["STT", "TÊN TÀI LIỆU", "LOẠI", "TRANG", "THAO TÁC"].map((h, i) => (
                      <th key={h} style={{ ...TH_STYLE, fontSize: 11, padding: "8px 10px", width: i === 0 ? 36 : i === 1 ? "45%" : undefined }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taiLieuList.map((d, i) => (
                    <tr key={d.stt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: "#1a73e8", fontWeight: 500 }}>📄 {d.ten}</td>
                      <td style={{ ...TD_STYLE, fontSize: 11 }}>
                        <span style={{ padding: "2px 6px", borderRadius: 10, background: "#f5f5f5", color: "#333333", fontWeight: 500 }}>{d.loai}</span>
                      </td>
                      <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, textAlign: "center" }}>{d.soTrang}</td>
                      <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, textAlign: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5a96", display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11 }} title="Xem tài liệu">
                          <Eye size={12} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fafafa", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "7px 24px", background: "#1a5a96", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <CheckCircle2 size={14} /> Xác nhận nhận hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}




// ── Main App ──────────────────────────────────────────────────────────────────


type AppView = "list" | "giao-tieu-ho-so" | "them-ho-so" | "phan-cong-ttv" | "phan-cong-tham-phan" | "cau-hinh-ttv" | "quan-ly-vu-an" | "chi-tiet-vu-an" | "cong-van-trao-doi" | "quan-ly-vu-xet-xu" | "phe-duyet-de-xuat" | "quan-ly-khieu-nai" | "chi-tiet-khieu-nai" | "ho-so-khang-nghi" | "tao-cong-van" | "an-quoc-hoi" | "an-thoi-hieu";

/**
 * Module "Quản lý án GĐT/TT" — port nguyên trạng từ bản demo ui-gdt-tt.
 *
 * Khác bản gốc đúng ba điểm, ngoài ra logic giữ nguyên 100%:
 *  1. Không tự dựng Sidebar nữa — menu do project chính cung cấp, nhận qua prop
 *     `view` và báo ngược ra bằng `onNavigate` để sidebar tô đúng mục đang mở.
 *  2. Bỏ khung `100vw × 100vh` vì module giờ nằm trong vùng nội dung của app chính.
 *  3. `App` đổi tên thành `QuanLyAnGDTTT` để không đụng `App` của project chính.
 */
export default function QuanLyAnGDTTT({ view, navSeq = 0, onNavigate }: {
  /** Mục menu đang chọn ở sidebar của project chính. */
  view?: View;
  /** Tăng thêm 1 mỗi lần người dùng BẤM sidebar. Module chỉ nhảy màn khi số này
   *  đổi, không nhảy khi `view` đổi — vì `view` còn bị chính module dội ngược ra
   *  qua `onNavigate`. Nếu bắt theo `view`, mở chi tiết vụ án sẽ bị đá về danh
   *  sách ngay lập tức: sidebar sáng "Quản lý vụ án" → dội vào → reset màn. */
  navSeq?: number;
  /** Điều hướng nội bộ của module (mở chi tiết, quay lại…) báo ngược ra sidebar. */
  onNavigate?: (v: View) => void;
} = {}) {
  const [globalUserRole, setGlobalUserRole] = useState<UserRoleType>("hinh-su");
  const [appView, setAppView] = useState<AppView>("list");
  const [activeTab, setActiveTab] = useState<TabId>("don-cho-phe-duyet");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [selectedVuAnId, setSelectedVuAnId] = useState<string>("VA26-002621");

  const sidebarView: View =
    appView === "giao-tieu-ho-so" ? "giao-tieu-ho-so"
      : appView === "them-ho-so" ? "them-ho-so"
        : appView === "phan-cong-tham-phan" ? "phan-cong-tham-phan"
          : appView === "phan-cong-ttv" ? "phan-cong-ttv"
              : appView === "cau-hinh-ttv" ? "cau-hinh-ttv"
                : appView === "quan-ly-vu-an" || appView === "chi-tiet-vu-an" ? "quan-ly-vu-an"
                  : appView === "quan-ly-khieu-nai" || appView === "chi-tiet-khieu-nai" ? "quan-ly-khieu-nai"
                    : appView === "cong-van-trao-doi" ? "cong-van-trao-doi"
                      : appView === "quan-ly-vu-xet-xu" ? "quan-ly-vu-xet-xu"
                          : appView === "phe-duyet-de-xuat" ? "phe-duyet-de-xuat"
                                  : appView === "an-quoc-hoi" ? "an-quoc-hoi"
                                  : appView === "an-thoi-hieu" ? "an-thoi-hieu"
                                    : appView === "ho-so-khang-nghi" || appView === "tao-cong-van" ? "ho-so-khang-nghi"
                                      : activeTab === "cho-y-kien" ? "cho-y-kien"
                                        : activeTab === "da-co-vu-an" ? "da-co-vu-an"
                                          : "don-cho-phe-duyet";

  const handleSidebarNav = (v: View) => {
    if (v === "phan-cong-tham-phan") { setAppView("phan-cong-tham-phan"); return; }
    if (v === "phan-cong-ttv") { setAppView("phan-cong-ttv"); return; }
    if (v === "cau-hinh-ttv") { setAppView("cau-hinh-ttv"); return; }
    if (v === "quan-ly-vu-an") { setAppView("quan-ly-vu-an"); return; }
    if (v === "quan-ly-khieu-nai") { setAppView("quan-ly-khieu-nai"); return; }
    if (v === "giao-tieu-ho-so") { setAppView("giao-tieu-ho-so"); return; }
    if (v === "them-ho-so") { setAppView("them-ho-so"); return; }
    if (v === "cong-van-trao-doi") { setAppView("cong-van-trao-doi"); return; }
    if (v === "quan-ly-vu-xet-xu") { setAppView("quan-ly-vu-xet-xu"); return; }
    if (v === "phe-duyet-de-xuat") { setAppView("phe-duyet-de-xuat"); return; }
    if (v === "ho-so-khang-nghi") { setAppView("ho-so-khang-nghi"); return; }
    if (v === "an-quoc-hoi") { setAppView("an-quoc-hoi"); return; }
    if (v === "an-thoi-hieu") { setAppView("an-thoi-hieu"); return; }
    setAppView("list");
    const tabMap: Record<string, TabId> = {
      "don-cho-phe-duyet": "don-cho-phe-duyet",
      "cho-y-kien": "cho-y-kien",
      "da-co-vu-an": "da-co-vu-an",
    };
    if (tabMap[v]) setActiveTab(tabMap[v]);
  };

  const [selectedVuAnTab, setSelectedVuAnTab] = useState<ChiTietTab>("danh-sach-don");

  const handleSelectVuAn = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedVuAnId(id);
    setSelectedVuAnTab(tab);
    setAppView("chi-tiet-vu-an");
  };

  const [selectedKhieuNaiId, setSelectedKhieuNaiId] = useState<string>("VA26-002621");
  const [selectedKhieuNaiTab, setSelectedKhieuNaiTab] = useState<ChiTietTab>("danh-sach-don");
  const [activeCongVanConfig, setActiveCongVanConfig] = useState<any>(null);

  const handleSelectKhieuNai = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedKhieuNaiId(id);
    setSelectedKhieuNaiTab(tab);
    setAppView("chi-tiet-khieu-nai");
  };

  // Sidebar của project chính bấm mục nào thì module mở đúng màn đó — dùng lại
  // nguyên `handleSidebarNav` cũ nên luật điều hướng không đổi một dòng nào.
  useEffect(() => {
    if (view) handleSidebarNav(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSeq]);

  // Điều hướng nội bộ (mở chi tiết, quay lại danh sách…) báo ngược ra để sidebar
  // tô sáng đúng mục — nếu không, mở chi tiết vụ án xong sidebar vẫn sáng mục cũ.
  useEffect(() => {
    onNavigate?.(sidebarView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarView]);

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: F, overflow: "hidden", background: "#fafafa" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
        {appView === "phan-cong-tham-phan" ? (
          <PhanCongThamPhanView />
        ) : appView === "phan-cong-ttv" ? (
          <PhanCongTTVView />
        ) : appView === "cau-hinh-ttv" ? (
          <CauHinhTTVView />
        ) : appView === "quan-ly-vu-an" ? (
          <QuanLyVuAnView userRole={globalUserRole} setUserRole={setGlobalUserRole} onSelectVuAn={handleSelectVuAn} />
        ) : appView === "chi-tiet-vu-an" ? (
          <ChiTietVuAnView key={selectedVuAnId + selectedVuAnTab} vuAnId={selectedVuAnId} userRole={globalUserRole} onBack={() => setAppView("quan-ly-vu-an")} initialTab={selectedVuAnTab} />
        ) : appView === "quan-ly-khieu-nai" ? (
          <QuanLyKhieuNaiView userRole={globalUserRole} setUserRole={setGlobalUserRole} onSelectKhieuNai={handleSelectKhieuNai} />
        ) : appView === "chi-tiet-khieu-nai" ? (
          <ChiTietVuAnView
            key={selectedKhieuNaiId + selectedKhieuNaiTab}
            vuAnId={selectedKhieuNaiId}
            userRole={globalUserRole}
            onBack={() => setAppView("quan-ly-khieu-nai")}
            initialTab={selectedKhieuNaiTab}
            moduleLabel="Quản lý khiếu nại"
            detailLabel="Chi tiết khiếu nại"
            entityWord="Khiếu nại"
          />
        ) : appView === "quan-ly-vu-xet-xu" ? (
          <QuanLyVuXetXuView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "phe-duyet-de-xuat" ? (
          <PheDuyetDeXuatView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "cong-van-trao-doi" ? (
          <CongVanTraoDoiView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "ho-so-khang-nghi" ? (
          <HoSoKhangNghiView userRole={globalUserRole} onTaoCongVan={(cfg) => { setActiveCongVanConfig(cfg); setAppView("tao-cong-van"); }} />
        ) : appView === "an-quoc-hoi" ? (
          <AnQuocHoiView />
        ) : appView === "an-thoi-hieu" ? (
          <AnThoiHieuView />
        ) : appView === "tao-cong-van" ? (
          <WordEditorView record={activeCongVanConfig} onBack={() => setAppView(activeCongVanConfig?.returnView || "ho-so-khang-nghi")} />
        ) : appView === "giao-tieu-ho-so" ? (
          <GiaoTieuHoSoView onClose={() => setAppView("list")} userRole={globalUserRole} />
        ) : appView === "them-ho-so" ? (
          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            <button
              onClick={() => setAppView("list")}
              style={{
                position: "absolute", top: 12, left: 12, zIndex: 10,
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", background: "#fff", color: RED,
                border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: F,
              }}
            >
              ← Quay lại
            </button>
            <ThemHoSoScreen />
          </div>
        ) : (
          <NhanDonTLVuAnView
            userRole={globalUserRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filterExpanded={filterExpanded}
            setFilterExpanded={setFilterExpanded}
            onGiaoTieuHoSo={() => setAppView("giao-tieu-ho-so")}
            onThemHoSo={() => setAppView("them-ho-so")}
            onInBaoCao={(tabId) => {
              const tabObj = TAB_CONFIG.find((t) => t.id === tabId);
              setActiveCongVanConfig({
                isBaoCao: true,
                tabId: tabId,
                tabLabel: tabObj?.label || "Báo cáo danh sách đơn",
                cases: getCasesByTab(tabId, globalUserRole),
                userRole: globalUserRole,
                returnView: "list",
              });
              setAppView("tao-cong-van");
            }}
          />
        )}
      </div>
    </div>
  );
}
