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
import HoSoTuHinhView from "./HoSoTuHinhView";
import ChuyenHinhPhatView from "./ChuyenHinhPhatView";
import CauHinhChuyenHinhPhatView from "./CauHinhChuyenHinhPhatView";
import PhanCongHDXXView from "./PhanCongHDXXView";
import PhanCongTPTCView from "./PhanCongTPTCView";
import { PhanCongThamPhanView } from "./PhanCongThamPhanView";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoLuuTruView } from "./HoSoLuuTruView";
import { AnThoiHieuView, AnQuocHoiView } from "./AnBaoCaoViews";
import { QuanLyKhieuNaiView } from "./QuanLyKhieuNaiView";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import { WordEditorView } from "./HoSoKhangNghiView";
import QuanLyHoSoGiaoNhanView from "./QuanLyHoSoGiaoNhanView";
import QuanLyVuAnView, { ChiTietVuAnView, filterVuAnListByRole, type ChiTietTab } from "./QuanLyVuAnView";
import NhanDonTLVuAnView from "./NhanDonTLVuAnView";import { Button, Input } from "antd";


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
              Công chức nghiên cứu: {c.ttv}
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
              Công chức nghiên cứu giải quyết: <strong>{c.ttvGiaiQuyet}</strong>
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
            color={y.decision === "thuy-moi" ? "#1b5e20" : "#6e1414"}
            bg={y.decision === "thuy-moi" ? "#e8f5e9" : "#fdecea"}
          >
            {y.decision === "thuy-moi" ? "Thụ lý mới" : "Không thụ lý"}
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
      <Button
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: RED,
          border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        ↩ Trả đơn
      </Button>
      {tab === "da-co-vu-an" && (
        <Button
          onClick={onGiaoTieuHoSo}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: "#27ae60", color: "#fff",
            border: "none", borderRadius: 4, cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: F,
          }}
        >
          ✓ Giao tiểu hồ sơ
        </Button>
      )}
      <Button
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, background: "#fff",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
        }}
      >
        <RefreshCw size={13} color={MUTED} />
      </Button>
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
              <Input type="checkbox" />
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
                <Input type="checkbox" />
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
                <Button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, borderRadius: 4,
                  }}
                  title="Xem chi tiết"
                >
                  <Eye size={15} color="#666666" />
                </Button>
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
        <Button style={paginBtn} disabled>‹</Button>
        <Button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</Button>
        <Button style={paginBtn}>›</Button>
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
    { id: "giao-ttv", label: "Giao THS đến Công chức nghiên cứu" },
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
      <Input
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
            <Button
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
            </Button>
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
              <Input placeholder="Người gửi đơn" style={filterInputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Số bản án/quyết định</div>
              <Input placeholder="Số bản án/quyết định" style={filterInputStyle} />
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
                <Input placeholder="Số công văn chuyển" style={filterInputStyle} />
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
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Công chức nghiên cứu giải quyết</div>
                <SelectBox placeholder="-- Tất cả --" options={THAM_TRA_VIEN_PHONG} />
              </div>
            </div>
          )}

          {/* Filter Footer Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
            <Button
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
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button
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
              </Button>
              <Button
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
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar Above Table */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "0 20px 10px", flexShrink: 0 }}>
        <Button
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
        </Button>
        <Button
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
        </Button>
        <Button
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
        </Button>
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
                    <th style={TH_STYLE}>Công chức nghiên cứu nhận</th>
                    <th style={TH_STYLE}>Ngày Công chức nghiên cứu nhận</th>
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
                          <Input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
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
                          <Input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#888888" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <Input placeholder="Nhập ghi chú" style={cellInputStyle} />
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
                          <Input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#888888" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <Input placeholder="Nhập ghi chú" style={cellInputStyle} />
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
            <Button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>‹</Button>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: "1px solid #8b1a1a", color: "#8b1a1a", fontSize: 12, fontWeight: 700 }}>
              1
            </span>
            <Button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>›</Button>
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
          <Button
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
          </Button>
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

// ── Cấu hình Công chức nghiên cứu báo cáo ─────────────────────────────────────────────────────

const CAU_HINH_DATA = [
  { id: 1, hoTen: "Bùi Nguyễn Khánh (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Tiến Mạnh - Phó Trưởng phòng" },
  { id: 2, hoTen: "Bùi Quang Huy (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 3, hoTen: "Bùi Thị Vân Anh (TP)", chucDanh: "Thẩm phán bậc 1", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 4, hoTen: "Bùi Việt Anh (TP)", chucDanh: "Thẩm phán bậc 2", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 5, hoTen: "Chi Thị Đức (TK)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 6, hoTen: "Chu Thị Thoam (TP)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 7, hoTen: "Chị Thị Nhụng (Công chức nghiên cứu)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 8, hoTen: "Dương Thảo Phương (Công chức nghiên cứu)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "" },
  { id: 9, hoTen: "Giáng Tiêu Thọ (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
  { id: 10, hoTen: "Hoàng Ngô An (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 11, hoTen: "Hoàng Ngọc Điệu (Công chức nghiên cứu)", chucDanh: "Công chức nghiên cứu chính", nghiepVu: "Giải quyết án", lanhDao: "Trần Quốc Hành - Phó Trưởng phòng" },
  { id: 12, hoTen: "Hoàng Thanh Thủy (TK)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 13, hoTen: "Hoàng Thị Nhã Phương (Công chức nghiên cứu)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Trưởng phòng" },
  { id: 14, hoTen: "Lê Thanh Tùng (Công chức nghiên cứu)", chucDanh: "Công chức nghiên cứu", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
];

const CHUC_DANH_OPTIONS = ["Thư ký Tòa án", "Thẩm phán bậc 1", "Thẩm phán bậc 2", "Công chức nghiên cứu", "Công chức nghiên cứu chính", "Công chức nghiên cứu cao cấp"];
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
        Trang chủ › Quản lý án GĐT/TT › Cấu hình Công chức nghiên cứu báo cáo
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
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Công chức nghiên cứu</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {CAU_HINH_DATA.map((r) => <option key={r.id}>{r.hoTen}</option>)}
            </select>
          </div>
          <Button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </Button>
          <Button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#333333", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In biểu mẫu
          </Button>
        </div>
      </div>

      {/* Banner + Lưu cấu hình */}
      <div style={{ padding: "8px 20px", background: BG, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        {showBanner && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 6, fontSize: 12, color: "#1b5e20", fontFamily: F, fontWeight: 500 }}>
            <span style={{ fontSize: 16 }}>✓</span>
            Cập nhật dữ liệu thành công!
            <Button onClick={() => setShowBanner(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#1b5e20", fontSize: 16, lineHeight: 1 }}>×</Button>
          </div>
        )}
        {!showBanner && <div style={{ flex: 1 }} />}
        <Button
          onClick={() => setShowBanner(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, flexShrink: 0 }}
        >
          <Save size={13} /> Lưu cấu hình
        </Button>
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
              <th style={TH_STYLE}>Nghiệp vụ Công chức nghiên cứu</th>
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
          <Button style={paginBtn} disabled>‹</Button>
          <Button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</Button>
          <Button style={paginBtn}>›</Button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
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
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", fontSize: 13, fontFamily: F }}>
            close
          </Button>
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
          <Button
            onClick={handleSubmit}
            style={{
              padding: "10px 28px", background: darkRed, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Trình ký
          </Button>

          <Button
            onClick={onClose}
            style={{
              padding: "10px 28px", background: "#fff", color: "#222222",
              border: "1px solid #cccccc", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Đóng
          </Button>
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
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <Input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <Input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <Button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</Button>
          <Button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </Button>
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
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></Button>
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
              <Input value={toaGiuHoSo} onChange={e => setToaGiuHoSo(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Đương sự</label>
              <Input value={duongSu} onChange={e => setDuongSu(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
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
              <Button
                onClick={handleSave}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#27ae60", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Save size={15} /> Lưu biểu mẫu
              </Button>
              <Button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Eye size={15} /> Xem biểu mẫu
              </Button>
              <Button
                onClick={onClose}
                style={{
                  padding: "8px 16px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                Đóng
              </Button>
            </>
          ) : (
            /* ĐÃ LƯU BIỂU MẪU -> Hiển thị COMBO nút: Trình ký, Lấy số, Xem biểu mẫu, Đóng */
            <>
              <Button
                onClick={() => setShowTrinhKy(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#1a73e8", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Trình ký
              </Button>

              <Button
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
              </Button>

              <Button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#555555", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Xem biểu mẫu
              </Button>

              <Button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                ✖ Đóng
              </Button>
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
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={18} />
          </Button>
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
                        <Button style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5a96", display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11 }} title="Xem tài liệu">
                          <Eye size={12} /> Xem
                        </Button>
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
          <Button
            onClick={onClose}
            style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            style={{ padding: "7px 24px", background: "#1a5a96", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <CheckCircle2 size={14} /> Xác nhận nhận hồ sơ
          </Button>
        </div>
      </div>
    </div>
  );
}




// ── Main App ──────────────────────────────────────────────────────────────────




/**
 * Module "Quản lý án GĐT/TT" — port nguyên trạng từ bản demo ui-gdt-tt.
 *
 * Khác bản gốc đúng ba điểm, ngoài ra logic giữ nguyên 100%:
 *  1. Không tự dựng Sidebar nữa — menu do project chính cung cấp, nhận qua prop
 *     `view` và báo ngược ra bằng `onNavigate` để sidebar tô đúng mục đang mở.
 *  2. Bỏ khung `100vw × 100vh` vì module giờ nằm trong vùng nội dung của app chính.
 *  3. `App` đổi tên thành `QuanLyAnGDTTT` để không đụng `App` của project chính.
 */
type AppView = "list" | "giao-tieu-ho-so" | "them-ho-so" | "phan-cong-ttv" | "phan-cong-tham-phan" | "phan-cong-tptc" | "cau-hinh-ttv" | "quan-ly-vu-an" | "chi-tiet-vu-an" | "cong-van-trao-doi" | "phan-cong-hdxx" | "quan-ly-vu-xet-xu" | "phe-duyet-de-xuat" | "quan-ly-khieu-nai" | "chi-tiet-khieu-nai" | "ho-so-khang-nghi" | "ho-so-tu-hinh" | "don-xin-an-giam" | "tao-cong-van" | "an-quoc-hoi" | "an-thoi-hieu" | "chuyen-hinh-phat" | "cau-hinh-chuyen-hinh-phat";

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
                                  : appView === "don-xin-an-giam" ? "don-xin-an-giam"
                                : appView === "ho-so-tu-hinh" ? "ho-so-tu-hinh"
                                  : appView === "chuyen-hinh-phat" ? "chuyen-hinh-phat"
                                  : appView === "cau-hinh-chuyen-hinh-phat" ? "cau-hinh-chuyen-hinh-phat"
                                  : appView === "phan-cong-hdxx" ? "phan-cong-hdxx"
                                  : appView === "phan-cong-tptc" ? "phan-cong-tptc"
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
    if (v === "don-xin-an-giam") { setAppView("don-xin-an-giam"); return; }
    if (v === "ho-so-tu-hinh") { setAppView("ho-so-tu-hinh"); return; }
    if (v === "chuyen-hinh-phat") { setAppView("chuyen-hinh-phat"); return; }
    if (v === "cau-hinh-chuyen-hinh-phat") { setAppView("cau-hinh-chuyen-hinh-phat"); return; }
    if (v === "phan-cong-hdxx") { setAppView("phan-cong-hdxx"); return; }
    if (v === "phan-cong-tptc") { setAppView("phan-cong-tptc"); return; }
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
          <QuanLyHoSoGiaoNhanView userRole={globalUserRole} onThemHoSo={() => setAppView("them-ho-so")} onTaoCongVan={(cfg: any) => { setActiveCongVanConfig(cfg); setAppView("tao-cong-van"); }} />
        ) : appView === "don-xin-an-giam" ? (
          <HoSoTuHinhView initialTab="don-xin-an-giam" userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "ho-so-tu-hinh" ? (
          <HoSoTuHinhView initialTab="ho-so-tu-hinh" userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "chuyen-hinh-phat" ? (
          <ChuyenHinhPhatView />
        ) : appView === "cau-hinh-chuyen-hinh-phat" ? (
          <CauHinhChuyenHinhPhatView />
        ) : appView === "phan-cong-hdxx" ? (
          <PhanCongHDXXView userRole={globalUserRole} />
        ) : appView === "phan-cong-tptc" ? (
          <PhanCongTPTCView />
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
            <Button
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
            </Button>
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

