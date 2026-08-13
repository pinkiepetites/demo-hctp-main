import React from "react";
import { Users, Clock, X, Plus, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { DANH_SACH_THAM_PHAN } from "./hdxxConfig";
import type { LoaiHoiDong } from "./hdxxStore";

// ── Dòng vụ án của bảng tham mưu (mục 3.3b) ──────────────────────────────────

export type VuAnThamMuuRow = {
  id: string | number;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  nguoiKhieuNai: string;
  biCao: string;
  soKN?: string;
  ngayKN?: string;
  nguoiKN?: string;
  /** Chủ tọa lấy theo phân công của từng vụ án, không sửa tại đây. */
  chuToa: string;
  chuToaChucVu?: string;
};

// ── Khối "Ủy ban Thẩm phán" — áp dụng chung cho cả danh sách (mục 3.3a) ───────

export function HoiDongXetXuBlock({
  loai,
  onChangeLoai,
  members,
  onRemoveMember,
  onAddMember,
  editable = false,
  soVuAn,
  lichSu,
}: {
  loai: LoaiHoiDong;
  onChangeLoai: (l: LoaiHoiDong) => void;
  members: string[];
  onRemoveMember?: (ten: string) => void;
  onAddMember?: (ten: string) => void;
  editable?: boolean;
  soVuAn: number;
  lichSu?: { soThayDoi: number; onOpen: () => void };
}) {
  const [dangThem, setDangThem] = React.useState(false);
  const suaThanhVien = editable && loai === "tham-phan";
  const conLai = DANH_SACH_THAM_PHAN.filter(tp => !members.includes(tp.ten));

  const segBtn = (active: boolean): React.CSSProperties => ({
    padding: "7px 16px",
    fontSize: 12,
    fontFamily: F,
    fontWeight: active ? 700 : 500,
    border: "none",
    background: active ? (editable ? RED : "#e0e0e0") : "transparent",
    color: active ? (editable ? "#fff" : TEXT) : MUTED,
    cursor: editable ? "pointer" : "default",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
      {/* Hàng tiêu đề */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <Users size={16} color={MUTED} />
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>Ủy ban Thẩm phán</span>
        <span style={{ padding: "2px 10px", borderRadius: 20, background: "#fdecea", color: RED, fontSize: 11, fontWeight: 700, fontFamily: F }}>
          {members.length} thẩm phán
        </span>
        {lichSu && (
          <button
            onClick={lichSu.onOpen}
            title="Lịch sử chỉnh sửa"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              background: "#fff",
              border: `1px solid ${lichSu.soThayDoi > 0 ? RED : BORDER}`,
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: F,
              color: lichSu.soThayDoi > 0 ? RED : MUTED,
              fontWeight: lichSu.soThayDoi > 0 ? 700 : 500,
            }}
          >
            <Clock size={13} />
            {lichSu.soThayDoi > 0 ? `${lichSu.soThayDoi} thay đổi` : "Lịch sử sửa"}
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
          Áp dụng chung cho <b style={{ color: TEXT }}>{soVuAn}</b> vụ án trong danh sách
        </span>
      </div>

      {/* Loại hội đồng + Thành viên */}
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 6 }}>Loại hội đồng</div>
          <div style={{ display: "inline-flex", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", background: "#fff" }}>
            <button disabled={!editable} onClick={() => onChangeLoai("tham-phan")} style={segBtn(loai === "tham-phan")}>
              Ủy ban Thẩm phán gồm {members.length} Thẩm phán
            </button>
            <button disabled={!editable} onClick={() => onChangeLoai("toan-the")} style={segBtn(loai === "toan-the")}>
              Toàn thể Ủy ban Thẩm phán
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 6 }}>Thành viên Ủy ban Thẩm phán</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {members.map(ten => (
              <span
                key={ten}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 11px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: F,
                  border: `1px solid ${suaThanhVien ? "#f3c0bb" : BORDER}`,
                  background: "#fff",
                  color: suaThanhVien ? RED : TEXT,
                  fontWeight: 500,
                }}
              >
                {ten}
                {suaThanhVien && (
                  <button
                    onClick={() => onRemoveMember?.(ten)}
                    title={`Bỏ ${ten} khỏi hội đồng`}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: RED }}
                  >
                    <X size={13} />
                  </button>
                )}
              </span>
            ))}

            {members.length === 0 && (
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F, fontStyle: "italic" }}>Chưa có thành viên nào.</span>
            )}

            {suaThanhVien && !dangThem && (
              <button
                onClick={() => setDangThem(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px", background: "#fff", border: `1px solid ${RED}`, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, color: RED }}
              >
                <Plus size={13} /> Thêm thẩm phán
              </button>
            )}

            {suaThanhVien && dangThem && (
              <select
                autoFocus
                defaultValue=""
                onChange={e => {
                  if (e.target.value) onAddMember?.(e.target.value);
                  setDangThem(false);
                }}
                onBlur={() => setDangThem(false)}
                style={{ padding: "6px 10px", border: `1px solid ${RED}`, borderRadius: 6, fontSize: 12, fontFamily: F, color: TEXT, background: "#fff", cursor: "pointer", outline: "none", minWidth: 260 }}
              >
                <option value="">– Chọn thẩm phán –</option>
                {conLai.map(tp => (
                  <option key={tp.id} value={tp.ten}>{tp.ten} — {tp.chucVu}</option>
                ))}
              </select>
            )}
          </div>

          {loai === "toan-the" && (
            <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginTop: 8, fontStyle: "italic" }}>
              Toàn thể Ủy ban Thẩm phán lấy theo cấu hình, không thêm/bớt thành viên.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bảng vụ án của danh sách tham mưu (mục 3.3b) ─────────────────────────────

export function BangVuAnThamMuu({
  rows,
  editable = false,
  onRemove,
}: {
  rows: VuAnThamMuuRow[];
  editable?: boolean;
  onRemove?: (id: string | number) => void;
}) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "10px 12px", fontFamily: F, color: "#333333", verticalAlign: "top", textAlign: "left" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "12px", fontFamily: F, color: TEXT, verticalAlign: "top" };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: 48 }} />
        <col style={{ width: "21%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "19%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: 74 }} />
      </colgroup>
      <thead>
        <tr>
          <th style={{ ...TH, textAlign: "center" }}>STT</th>
          <th style={TH}>Thông tin bản án/ Tòa án xét xử</th>
          <th style={TH}>Người khiếu nại</th>
          <th style={TH}>Bị cáo</th>
          <th style={TH}>Kháng nghị</th>
          <th style={TH}>
            Thẩm phán chủ tọa phiên tòa
            <div style={{ fontWeight: 400, fontSize: 10, color: MUTED, fontStyle: "italic", marginTop: 3, whiteSpace: "normal" }}>
              Tự động theo phân công của vụ án — không sửa tại đây
            </div>
          </th>
          <th style={{ ...TH, textAlign: "center" }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ ...TD, textAlign: "center", color: MUTED, padding: "28px 12px" }}>
              Không còn vụ án nào trong danh sách.
            </td>
          </tr>
        ) : (
          rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>{i + 1}</td>
              <td style={TD}>
                <div style={{ lineHeight: 1.6 }}>
                  <div>Số BA: <b>{r.soBA ? formatSoBA(r.soBA) : "–"}</b></div>
                  <div style={{ color: MUTED }}>Ngày: {r.ngayBA || "–"}</div>
                  <div style={{ color: MUTED }}>Tại: {r.toaAn || "–"}</div>
                </div>
              </td>
              <td style={{ ...TD, fontWeight: 600 }}>{r.nguoiKhieuNai || "–"}</td>
              <td style={TD}>{r.biCao || "–"}</td>
              <td style={TD}>
                {r.soKN || r.ngayKN || r.nguoiKN ? (
                  <div style={{ lineHeight: 1.6, color: MUTED }}>
                    <div>Số KN: <b style={{ color: TEXT }}>{r.soKN || "–"}</b></div>
                    <div>Ngày kháng nghị: <span style={{ color: TEXT }}>{r.ngayKN || "–"}</span></div>
                    <div>Người kháng nghị: <span style={{ color: TEXT }}>{r.nguoiKN || "–"}</span></div>
                  </div>
                ) : (
                  "–"
                )}
              </td>
              <td style={TD}>
                <div
                  style={{
                    padding: "8px 10px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    background: "#f5f5f5",
                    color: MUTED,
                    fontSize: 12,
                    fontFamily: F,
                    lineHeight: 1.4,
                  }}
                >
                  {r.chuToa || "–"}
                  {r.chuToaChucVu ? ` – ${r.chuToaChucVu}` : ""}
                </div>
              </td>
              <td style={{ ...TD, textAlign: "center" }}>
                <button
                  disabled={!editable}
                  onClick={() => onRemove?.(r.id)}
                  title={editable ? "Bỏ vụ án khỏi danh sách" : "Bấm “Sửa thông tin” để bỏ vụ án"}
                  style={{
                    background: editable ? "#fdf3f2" : "#fafafa",
                    color: editable ? RED : "#cccccc",
                    border: `1px solid ${editable ? "#f3c0bb" : "#e0e0e0"}`,
                    borderRadius: 5,
                    padding: "5px 9px",
                    cursor: editable ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
