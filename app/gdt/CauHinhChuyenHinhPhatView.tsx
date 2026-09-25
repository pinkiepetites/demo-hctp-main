import React, { useState, useMemo } from "react";
import { Plus, X, Edit2, Trash2, ToggleLeft, ToggleRight, CheckCircle2, Search, BookOpen, Scale, ShieldAlert, Check, ChevronDown } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import { Button, Input } from "antd";
import {
  DANH_MUC_BO_LUAT,
  DANH_MUC_CHUONG,
  DANH_MUC_DIEU_LUAT,
  type DieuLuatItem,
  type KhoanItem,
  type BoLuatOption,
} from "./danhMucBoLuat";

export type CrimeRule = {
  id: string;
  name: string;
  article: string;
  clause: string;
  point?: string;
  law: string;
  khungHinhPhat?: string;
  chuong?: string;
  dienChuyenDoi?: string;
  active?: boolean;
};

type ManualRule = {
  id: string;
  title: string;
  point?: string;
  clause?: string;
  article: string;
  law: string;
  desc: string;
  active: boolean;
};

export default function CauHinhChuyenHinhPhatView() {
  const [crimes, setCrimes] = useState<CrimeRule[]>([
    {
      id: "c1",
      name: "Tham ô tài sản",
      article: "Điều 353",
      clause: "Khoản 4",
      point: "",
      law: "BLHS 2015",
      khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
      dienChuyenDoi: "Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại 3/4 tài sản)",
      active: true,
    },
    {
      id: "c2",
      name: "Nhận hối lộ",
      article: "Điều 354",
      clause: "Khoản 4",
      point: "",
      law: "BLHS 2015",
      khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
      dienChuyenDoi: "Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại 3/4 tài sản)",
      active: true,
    },
    {
      id: "c3",
      name: "Mua bán trái phép chất ma túy",
      article: "Điều 251",
      clause: "Khoản 4",
      point: "",
      law: "BLHS 2015",
      khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
      dienChuyenDoi: "Rà soát định lượng ma túy & chuyển đổi hình phạt",
      active: true,
    },
    {
      id: "c4",
      name: "Vận chuyển trái phép chất ma túy",
      article: "Điều 250",
      clause: "Khoản 4",
      point: "",
      law: "BLHS 2015",
      khungHinhPhat: "Phạt tù 20 năm, tù chung thân hoặc tử hình",
      dienChuyenDoi: "Rà soát định lượng ma túy & vai trò đồng phạm",
      active: true,
    },
    {
      id: "c5",
      name: "Giết người",
      article: "Điều 123",
      clause: "Khoản 1",
      point: "",
      law: "BLHS 2015",
      khungHinhPhat: "Phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình",
      dienChuyenDoi: "Rà soát điều kiện nhân thân đặc biệt (Điểm a, b Khoản 3 Điều 40)",
      active: true,
    },
  ]);

  const [personRules, setPersonRules] = useState<ManualRule[]>([
    {
      id: "p1",
      title: "Phụ nữ có thai hoặc nuôi con nhỏ dưới 36 tháng",
      point: "Điểm a",
      clause: "Khoản 3",
      article: "Điều 40",
      law: "BLHS 2015",
      desc: "Bị án là phụ nữ có thai hoặc đang nuôi con dưới 36 tháng tuổi tại thời điểm phạm tội hoặc xét xử, thi hành án.",
      active: true,
    },
    {
      id: "p2",
      title: "Người từ đủ 75 tuổi trở lên",
      point: "Điểm b",
      clause: "Khoản 3",
      article: "Điều 40",
      law: "BLHS 2015",
      desc: "Bị án là người từ đủ 75 tuổi trở lên tại thời điểm tuyên án hoặc xét duyệt chuyển hình phạt.",
      active: true,
    },
  ]);

  const [ecoRules, setEcoRules] = useState<ManualRule[]>([
    {
      id: "e1",
      title: "Chủ động nộp lại ít nhất 3/4 tài sản tham ô, nhận hối lộ",
      point: "Điểm c",
      clause: "Khoản 3",
      article: "Điều 40",
      law: "BLHS 2015",
      desc: "Áp dụng đối với tội Tham ô tài sản (Điều 353), Nhận hối lộ (Điều 354). Bị án chủ động nộp lại ít nhất 3/4 tài sản và hợp tác tích cực với cơ quan chức năng trong việc phát hiện, điều tra, xử lý tội phạm hoặc lập công lớn.",
      active: true,
    },
  ]);

  const [crimeSearch, setCrimeSearch] = useState("");
  const [showCrimeModal, setShowCrimeModal] = useState(false);
  const [editingCrime, setEditingCrime] = useState<CrimeRule | null>(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualType, setManualType] = useState<"person" | "eco">("person");
  const [editingManual, setEditingManual] = useState<ManualRule | null>(null);

  const toggleCrimeActive = (id: string) => {
    setCrimes(prev => prev.map(c => c.id === id ? { ...c, active: c.active === false ? true : false } : c));
  };

  const toggleManualRule = (type: "person" | "eco", id: string) => {
    if (type === "person") {
      setPersonRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    } else {
      setEcoRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    }
  };

  const deleteCrime = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tội danh này khỏi danh mục rà soát chuyển đổi?")) {
      setCrimes(crimes.filter(c => c.id !== id));
    }
  };

  const deleteManual = (type: "person" | "eco", id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa quy định này?")) {
      if (type === "person") setPersonRules(personRules.filter(r => r.id !== id));
      else setEcoRules(ecoRules.filter(r => r.id !== id));
    }
  };

  const filteredCrimes = useMemo(() => {
    if (!crimeSearch.trim()) return crimes;
    const q = crimeSearch.toLowerCase();
    return crimes.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.article.toLowerCase().includes(q) ||
      c.clause.toLowerCase().includes(q) ||
      c.law.toLowerCase().includes(q)
    );
  }, [crimes, crimeSearch]);

  const SectionTitle = ({ title, desc, onAdd }: { title: string; desc: string; onAdd: () => void }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: 16, color: "#1f2937", fontFamily: F, fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>{desc}</p>
      </div>
      <Button
        onClick={onAdd}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 16px",
          background: RED,
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: F,
        }}
      >
        <Plus size={15} /> Thêm từ danh mục
      </Button>
    </div>
  );

  return (
    <div style={{ padding: "24px 32px", fontFamily: F, height: "100%", overflowY: "auto", background: "#f8fafc" }}>
      {/* Modal Thêm/Sửa Tội danh từ Danh mục Bộ luật */}
      {showCrimeModal && (
        <CrimeModal
          initialData={editingCrime}
          onClose={() => {
            setShowCrimeModal(false);
            setEditingCrime(null);
          }}
          onSave={(data) => {
            if (editingCrime) {
              setCrimes(crimes.map(c => c.id === data.id ? data : c));
            } else {
              setCrimes([...crimes, { ...data, id: "c" + Date.now(), active: true }]);
            }
            setShowCrimeModal(false);
            setEditingCrime(null);
          }}
        />
      )}

      {/* Modal Quy định Nhân thân / Kinh tế */}
      {showManualModal && (
        <ManualRuleModal
          initialData={editingManual}
          manualType={manualType}
          onClose={() => {
            setShowManualModal(false);
            setEditingManual(null);
          }}
          onSave={(data) => {
            if (editingManual) {
              if (manualType === "person") setPersonRules(personRules.map(r => r.id === data.id ? data : r));
              else setEcoRules(ecoRules.map(r => r.id === data.id ? data : r));
            } else {
              const newRule = { ...data, id: "m" + Date.now(), active: true };
              if (manualType === "person") setPersonRules([...personRules, newRule]);
              else setEcoRules([...ecoRules, newRule]);
            }
            setShowManualModal(false);
            setEditingManual(null);
          }}
        />
      )}

      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, border: "1px solid #bfdbfe" }}>
                Vụ Giám đốc kiểm tra về hình sự (Vụ I)
              </span>
              <span style={{ fontSize: 12, color: MUTED }}>• Danh mục pháp lý Bộ luật Hình sự</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
              Cấu Hình Danh Mục Tội Danh & Điều Kiện Chuyển Đổi Hình Phạt
            </h2>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
              Quản lý chuẩn hóa danh mục Bộ luật, Điều luật, Khoản, Điểm và Khung hình phạt phục vụ đối chiếu tự động trong quy trình xem xét ân giảm / chuyển hình phạt.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              onClick={() => {
                alert("Hệ thống đã tự động lưu cấu hình danh mục điều luật và tội danh vào cơ sở dữ liệu.");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 20px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              <CheckCircle2 size={16} /> Lưu cấu hình
            </Button>
          </div>
        </div>

        {/* 1. BẢNG TỘI DANH PHÁP LÝ */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 6, border: `1px solid ${BORDER}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 24 }}>
          <SectionTitle
            title="1. Danh mục Tội danh & Điều luật được Chuyển Hình Phạt"
            desc="Hệ thống tự động liên kết với danh mục Bộ luật Hình sự. Khi thẩm định hồ sơ bản án, hệ thống đối chiếu chính xác Tên tội danh, Điều luật và Khoản khung hình phạt để đưa vào luồng rà soát."
            onAdd={() => {
              setEditingCrime(null);
              setShowCrimeModal(true);
            }}
          />

          {/* Thanh tìm kiếm nhanh */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
            <div style={{ position: "relative", width: 340 }}>
              <Input
                value={crimeSearch}
                onChange={e => setCrimeSearch(e.target.value)}
                placeholder="Tìm kiếm tội danh, số điều, bộ luật..."
                style={{
                  width: "100%",
                  padding: "7px 12px 7px 32px",
                  fontSize: 13,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  outline: "none",
                  fontFamily: F,
                  boxSizing: "border-box",
                }}
              />
              <Search size={15} color={MUTED} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              {crimeSearch && (
                <Button
                  onClick={() => setCrimeSearch("")}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 0 }}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>
              Đang hiển thị <b>{filteredCrimes.length}</b> / {crimes.length} tội danh trong diện rà soát
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13, fontFamily: F }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `2px solid ${BORDER}` }}>
                  <th style={{ ...TH_STYLE, width: 45, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_STYLE, width: "24%" }}>Tên Tội Danh</th>
                  <th style={{ ...TH_STYLE, width: "12%" }}>Điều Luật</th>
                  <th style={{ ...TH_STYLE, width: "12%" }}>Khoản / Điểm</th>
                  <th style={{ ...TH_STYLE, width: "14%" }}>Bộ Luật Áp Dụng</th>
                  <th style={{ ...TH_STYLE, width: "26%" }}>Khung Hình Phạt Luật Định</th>
                  <th style={{ ...TH_STYLE, width: "8%", textAlign: "center" }}>Hiệu Lực</th>
                  <th style={{ ...TH_STYLE, width: "8%", textAlign: "center" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrimes.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 24, textAlign: "center", color: MUTED, fontSize: 13 }}>
                      Không tìm thấy tội danh nào khớp với từ khóa tìm kiếm.
                    </td>
                  </tr>
                )}
                {filteredCrimes.map((c, i) => {
                  const isTuHinh = (c.khungHinhPhat || "").includes("tử hình");
                  const isActive = c.active !== false;
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        background: !isActive ? "#fcfcfc" : i % 2 === 0 ? "#fff" : "#fafafa",
                        opacity: !isActive ? 0.6 : 1,
                      }}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{i + 1}</td>
                      <td style={{ ...TD_STYLE, fontWeight: 700, color: "#1e293b" }}>
                        <div>{c.name}</div>
                        {c.dienChuyenDoi && (
                          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginTop: 2 }}>
                            {c.dienChuyenDoi}
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD_STYLE, fontWeight: 700, color: RED }}>
                        {c.article}
                      </td>
                      <td style={{ ...TD_STYLE, fontWeight: 600 }}>
                        {c.clause || "Tất cả các khoản"}
                        {c.point && <span> ({c.point})</span>}
                      </td>
                      <td style={{ ...TD_STYLE }}>
                        <span style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "2px 6px",
                          borderRadius: 3,
                          fontSize: 11,
                          fontWeight: 700,
                          border: "1px solid #bfdbfe",
                        }}>
                          {c.law}
                        </span>
                      </td>
                      <td style={{ ...TD_STYLE }}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 3,
                          fontSize: 12,
                          fontWeight: 600,
                          background: isTuHinh ? "#fef2f2" : "#f0fdf4",
                          color: isTuHinh ? RED : "#166534",
                          border: `1px solid ${isTuHinh ? "#fecaca" : "#bbf7d0"}`,
                        }}>
                          {c.khungHinhPhat || "Theo quy định Bộ luật Hình sự"}
                        </span>
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <Button
                          onClick={() => toggleCrimeActive(c.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          title={isActive ? "Đang áp dụng (Bấm để tạm dừng)" : "Đang tạm dừng (Bấm để kích hoạt)"}
                        >
                          {isActive ? (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "2px 6px", borderRadius: 3 }}>
                              Bật
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, background: "#f1f5f9", padding: "2px 6px", borderRadius: 3 }}>
                              Tắt
                            </span>
                          )}
                        </Button>
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                          <Button
                            onClick={() => {
                              setEditingCrime(c);
                              setShowCrimeModal(true);
                            }}
                            style={{ border: "none", background: "none", cursor: "pointer", color: "#2563eb", padding: 0 }}
                            title="Sửa điều luật / tội danh"
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button
                            onClick={() => deleteCrime(c.id)}
                            style={{ border: "none", background: "none", cursor: "pointer", color: RED, padding: 0 }}
                            title="Xóa tội danh"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. QUY ĐỊNH NHÂN THÂN & SỨC KHỎE */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 6, border: `1px solid ${BORDER}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 24 }}>
          <SectionTitle
            title="2. Quy định về Nhân thân & Sức khỏe (Định tính)"
            desc="Căn cứ theo Điều 40 Bộ luật Hình sự: Trường hợp không thi hành án tử hình đối với phụ nữ có thai, phụ nữ nuôi con nhỏ dưới 36 tháng tuổi và người từ đủ 75 tuổi trở lên."
            onAdd={() => {
              setManualType("person");
              setEditingManual(null);
              setShowManualModal(true);
            }}
          />
          {personRules.length === 0 && <div style={{ color: MUTED, fontSize: 13, fontStyle: "italic" }}>Chưa có quy định nào.</div>}
          {personRules.map(r => (
            <ManualRuleCard
              key={r.id}
              rule={r}
              onToggle={() => toggleManualRule("person", r.id)}
              onEdit={() => {
                setManualType("person");
                setEditingManual(r);
                setShowManualModal(true);
              }}
              onDelete={() => deleteManual("person", r.id)}
            />
          ))}
        </div>

        {/* 3. QUY ĐỊNH KHẮC PHỤC HẬU QUẢ KINH TẾ */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 6, border: `1px solid ${BORDER}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <SectionTitle
            title="3. Quy định về Khắc phục hậu quả (Kinh tế & Tham nhũng)"
            desc="Căn cứ theo Điểm c Khoản 3 Điều 40 Bộ luật Hình sự: Điều kiện nộp lại ít nhất 3/4 tài sản tham ô, nhận hối lộ và hợp tác tích cực với cơ quan chức năng hoặc lập công lớn."
            onAdd={() => {
              setManualType("eco");
              setEditingManual(null);
              setShowManualModal(true);
            }}
          />
          {ecoRules.length === 0 && <div style={{ color: MUTED, fontSize: 13, fontStyle: "italic" }}>Chưa có quy định nào.</div>}
          {ecoRules.map(r => (
            <ManualRuleCard
              key={r.id}
              rule={r}
              onToggle={() => toggleManualRule("eco", r.id)}
              onEdit={() => {
                setManualType("eco");
                setEditingManual(r);
                setShowManualModal(true);
              }}
              onDelete={() => deleteManual("eco", r.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Card hiển thị quy định định tính ─────────────────────────────────────────
function ManualRuleCard({ rule, onToggle, onEdit, onDelete }: { rule: ManualRule; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const lawString = [rule.point, rule.clause, rule.article, rule.law].filter(Boolean).join(" ");
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: 14,
      background: rule.active ? "#fff" : "#f8fafc",
      border: `1px solid ${rule.active ? "#bfdbfe" : BORDER}`,
      borderRadius: 6,
      marginBottom: 10,
      transition: "all 0.15s"
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: rule.active ? "#1e40af" : MUTED, fontFamily: F }}>
            {rule.title}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "2px 8px",
            background: rule.active ? "#eff6ff" : BG,
            color: rule.active ? "#1d4ed8" : MUTED,
            borderRadius: 3,
            border: `1px solid ${rule.active ? "#bfdbfe" : BORDER}`
          }}>
            {lawString}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: rule.active ? TEXT : MUTED, lineHeight: 1.5 }}>{rule.desc}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginLeft: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={onEdit} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#2563eb" }} title="Sửa">
            <Edit2 size={15} />
          </Button>
          <Button onClick={onDelete} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: RED }} title="Xóa">
            <Trash2 size={15} />
          </Button>
        </div>
        <div style={{ width: 1, height: 20, background: BORDER }}></div>
        <Button onClick={onToggle} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: rule.active ? "#16a34a" : MUTED }}>
          {rule.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </Button>
      </div>
    </div>
  );
}

// ── Modal Thêm / Sửa Tội Danh Chạy Theo Danh Mục Bộ Luật / Tội Danh ───────────
function CrimeModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: CrimeRule | null;
  onClose: () => void;
  onSave: (data: CrimeRule) => void;
}) {
  // Bộ luật đang chọn
  const [selectedBoLuat, setSelectedBoLuat] = useState<string>(initialData?.law || "BLHS 2015");
  // Chương đang chọn
  const [selectedChuong, setSelectedChuong] = useState<string>("all");
  // Tìm kiếm tội danh
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Điều luật đang chọn (id)
  const [selectedDieuId, setSelectedDieuId] = useState<string>(() => {
    if (initialData?.article) {
      const found = DANH_MUC_DIEU_LUAT.find(d => d.maDieu === initialData.article);
      if (found) return found.id;
    }
    return "dieu-353";
  });

  // Thông tin form
  const [name, setName] = useState<string>(initialData?.name || "Tham ô tài sản");
  const [article, setArticle] = useState<string>(initialData?.article || "Điều 353");
  const [clause, setClause] = useState<string>(initialData?.clause || "Khoản 4");
  const [point, setPoint] = useState<string>(initialData?.point || "");
  const [khungHinhPhat, setKhungHinhPhat] = useState<string>(initialData?.khungHinhPhat || "Phạt tù 20 năm, tù chung thân hoặc tử hình");
  const [dienChuyenDoi, setDienChuyenDoi] = useState<string>(initialData?.dienChuyenDoi || "Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại 3/4 tài sản)");

  // Chế độ nhập thủ công ngoài danh mục
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Danh sách điều luật thuộc Bộ luật & Chương đang chọn
  const filteredCatalog = useMemo(() => {
    return DANH_MUC_DIEU_LUAT.filter(item => {
      if (selectedChuong !== "all" && item.chuong !== selectedChuong) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.tenToiDanh.toLowerCase().includes(q) ||
        item.tenDayDu.toLowerCase().includes(q) ||
        item.maDieu.toLowerCase().includes(q) ||
        String(item.soDieu).includes(q)
      );
    });
  }, [selectedChuong, searchTerm]);

  // Điều luật hiện tại được chọn trong danh mục
  const currentDieuObj = useMemo(() => {
    return DANH_MUC_DIEU_LUAT.find(d => d.id === selectedDieuId);
  }, [selectedDieuId]);

  // Xử lý khi chọn một điều luật trong danh mục
  const handleSelectDieuLuat = (dieu: DieuLuatItem) => {
    setSelectedDieuId(dieu.id);
    setName(dieu.tenToiDanh);
    setArticle(dieu.maDieu);
    setSelectedBoLuat(dieu.boLuat);

    // Tự động tìm khoản có khung hình phạt nặng nhất (hoặc tử hình)
    const tuHinhKhoan = dieu.danhSachKhoan.find(k => k.mucDo === "tu-hinh") || dieu.danhSachKhoan[dieu.danhSachKhoan.length - 1];
    if (tuHinhKhoan) {
      setClause(tuHinhKhoan.khoan);
      setKhungHinhPhat(tuHinhKhoan.khungHinhPhat);
    } else if (dieu.danhSachKhoan.length > 0) {
      setClause(dieu.danhSachKhoan[0].khoan);
      setKhungHinhPhat(dieu.danhSachKhoan[0].khungHinhPhat);
    }

    // Gợi ý diện chuyển đổi tương ứng
    if (dieu.id === "dieu-353" || dieu.id === "dieu-354") {
      setDienChuyenDoi("Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại 3/4 tài sản)");
    } else if (dieu.chuong === "chuong-20") {
      setDienChuyenDoi("Rà soát định lượng ma túy & chuyển đổi hình phạt");
    } else if (dieu.id === "dieu-123") {
      setDienChuyenDoi("Rà soát điều kiện nhân thân đặc biệt (Điểm a, b Khoản 3 Điều 40)");
    } else {
      setDienChuyenDoi("Rà soát chuyển đổi hình phạt theo quy định mới");
    }
  };

  // Xử lý khi đổi Khoản
  const handleSelectKhoan = (khoanName: string) => {
    setClause(khoanName);
    if (khoanName === "all") {
      setKhungHinhPhat("Áp dụng cho toàn bộ các khung hình phạt của điều luật");
      return;
    }
    const foundKhoan = currentDieuObj?.danhSachKhoan.find(k => k.khoan === khoanName);
    if (foundKhoan) {
      setKhungHinhPhat(foundKhoan.khungHinhPhat);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Vui lòng chọn hoặc nhập tên tội danh!");
      return;
    }
    if (!article.trim()) {
      alert("Vui lòng nhập hoặc chọn điều luật!");
      return;
    }
    onSave({
      id: initialData?.id || "",
      name: name.trim(),
      article: article.trim(),
      clause: clause.trim(),
      point: point.trim(),
      law: selectedBoLuat,
      khungHinhPhat,
      dienChuyenDoi,
      active: initialData?.active !== false,
    });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: F
    }}>
      <div style={{
        background: "#fff", borderRadius: 8, width: 880, maxWidth: "96vw",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: `1px solid ${BORDER}`, overflow: "hidden"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8fafc"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: RED, color: "#fff" }}>
                DANH MỤC PHÁP LÝ
              </span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                {initialData ? "Sửa Tội Danh Pháp Lý (Từ Danh Mục Bộ Luật)" : "Chọn & Thêm Tội Danh Pháp Lý Từ Danh Mục"}
              </h3>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
              Dữ liệu được đồng bộ trực tiếp từ Danh mục Bộ luật Hình sự phục vụ rà soát chuyển đổi hình phạt
            </div>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 0 }}>
            <X size={20} />
          </Button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {/* Hàng chọn Bộ luật & Nhóm chương */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                1. Bộ luật / Văn bản quy phạm pháp luật
              </label>
              <select
                value={selectedBoLuat}
                onChange={e => setSelectedBoLuat(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1.5px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: F,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                {DANH_MUC_BO_LUAT.map(b => (
                  <option key={b.id} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                2. Chương / Nhóm tội danh
              </label>
              <select
                value={selectedChuong}
                onChange={e => setSelectedChuong(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1.5px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: F,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                {DANH_MUC_CHUONG.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ô Tìm kiếm nhanh trong danh mục */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ position: "relative" }}>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Gõ tìm kiếm tội danh hoặc số điều (VD: 'ma túy', 'tham ô', 'giết người', '353', '251'...)"
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 34px",
                  fontSize: 13,
                  border: `1.5px solid #93c5fd`,
                  borderRadius: 4,
                  outline: "none",
                  fontFamily: F,
                  boxSizing: "border-box",
                  background: "#f8fafc",
                }}
              />
              <Search size={16} color="#3b82f6" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 0 }}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Danh sách thẻ tội danh trong Danh mục Bộ luật */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                3. Chọn Tội danh & Điều luật từ Danh mục ({filteredCatalog.length} điều luật phù hợp)
              </span>
              <Button
                onClick={() => setIsCustomMode(!isCustomMode)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                {isCustomMode ? "← Trở lại chọn từ Danh mục chuẩn" : "Chuyển sang chế độ nhập tay tự do"}
              </Button>
            </div>

            {!isCustomMode ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 8,
                maxHeight: 180,
                overflowY: "auto",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: 8,
                background: "#f8fafc",
              }}>
                {filteredCatalog.map(item => {
                  const isSelected = selectedDieuId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectDieuLuat(item)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 4,
                        border: isSelected ? `2px solid ${RED}` : "1px solid #e2e8f0",
                        background: isSelected ? "#fff1f2" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: 12, color: isSelected ? RED : "#1e293b" }}>
                          {item.maDieu}
                        </span>
                        {item.coAnTuHinh && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: RED, background: "#fee2e2", padding: "1px 5px", borderRadius: 2 }}>
                            Tử hình
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? RED : "#334155", marginTop: 2 }}>
                        {item.tenToiDanh}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.tenChuong.split(":")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: "#fffbeb", padding: 10, borderRadius: 4, border: "1px solid #fde68a", fontSize: 12, color: "#92400e" }}>
                Chế độ nhập tay đang bật. Bạn có thể sửa trực tiếp Tên tội danh và Điều luật ở bên dưới.
              </div>
            )}
          </div>

          {/* Chi tiết thông tin Điều luật & Cấu hình Khoản, Điểm */}
          <div style={{ background: "#f8fafc", border: `1.5px solid #cbd5e1`, borderRadius: 6, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: RED, marginBottom: 10, textTransform: "uppercase" }}>
              4. Cấu hình chi tiết tội danh & khung hình phạt áp dụng
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Tên Tội danh
                </label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="VD: Tham ô tài sản"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: F,
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Điều luật
                </label>
                <Input
                  value={article}
                  onChange={e => setArticle(e.target.value)}
                  placeholder="VD: Điều 353"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    color: RED,
                    fontFamily: F,
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>
            </div>

            {/* Chọn Khoản & Điểm từ danh mục */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Khoản áp dụng rà soát
                </label>
                <select
                  value={clause}
                  onChange={e => handleSelectKhoan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: F,
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="all">Áp dụng toàn bộ các khoản</option>
                  {currentDieuObj?.danhSachKhoan.map(k => (
                    <option key={k.khoan} value={k.khoan}>
                      {k.khoan} ({k.khungHinhPhat})
                    </option>
                  ))}
                  {!currentDieuObj && (
                    <>
                      <option value="Khoản 1">Khoản 1</option>
                      <option value="Khoản 2">Khoản 2</option>
                      <option value="Khoản 3">Khoản 3</option>
                      <option value="Khoản 4">Khoản 4</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Điểm (Tùy chọn cấu thành)
                </label>
                <Input
                  value={point}
                  onChange={e => setPoint(e.target.value)}
                  placeholder="VD: Điểm a, b (nếu có)"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: F,
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>
            </div>

            {/* Khung hình phạt luật định */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                Khung hình phạt luật định theo Bộ luật Hình sự
              </label>
              <Input
                value={khungHinhPhat}
                onChange={e => setKhungHinhPhat(e.target.value)}
                placeholder="VD: Phạt tù 20 năm, tù chung thân hoặc tử hình"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  color: khungHinhPhat.includes("tử hình") ? RED : "#166534",
                  background: khungHinhPhat.includes("tử hình") ? "#fff1f2" : "#f0fdf4",
                  fontFamily: F,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Diện rà soát chuyển đổi */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                Diện rà soát chuyển đổi hình phạt
              </label>
              <select
                value={dienChuyenDoi}
                onChange={e => setDienChuyenDoi(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: F,
                  background: "#fff",
                  boxSizing: "border-box",
                }}
              >
                <option value="Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại 3/4 tài sản)">
                  Ân giảm theo Điểm c Khoản 3 Điều 40 BLHS (Nộp lại ít nhất 3/4 tài sản tham ô, nhận hối lộ)
                </option>
                <option value="Rà soát điều kiện nhân thân đặc biệt (Điểm a, b Khoản 3 Điều 40)">
                  Rà soát điều kiện nhân thân đặc biệt (Phụ nữ có thai/nuôi con nhỏ hoặc từ đủ 75 tuổi trở lên)
                </option>
                <option value="Rà soát định lượng ma túy & chuyển đổi hình phạt">
                  Rà soát định lượng ma túy theo luật mới & chuyển đổi hình phạt
                </option>
                <option value="Chuyển hình phạt theo tội danh đã bãi bỏ hình phạt tử hình">
                  Chuyển đổi theo quy định tội danh đã bãi bỏ hình phạt tử hình
                </option>
                <option value="Rà soát chuyển đổi hình phạt theo quy định mới">
                  Rà soát chung theo các quy định mới có lợi cho người phạm tội
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 24px",
          borderTop: `1px solid ${BORDER}`,
          background: "#f8fafc",
        }}>
          <div style={{ fontSize: 12, color: MUTED }}>
            {currentDieuObj ? (
              <span>Đang áp dụng: <b>{currentDieuObj.maDieu}</b> - {currentDieuObj.tenDayDu}</span>
            ) : (
              <span>Tội danh tùy chỉnh</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: F,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSave}
              style={{
                padding: "8px 24px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: F,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Lưu vào danh mục rà soát
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Quy Định Định Tính (Nhân thân / Kinh tế) ───────────────────────────
function ManualRuleModal({
  initialData,
  manualType,
  onClose,
  onSave,
}: {
  initialData: ManualRule | null;
  manualType: "person" | "eco";
  onClose: () => void;
  onSave: (data: ManualRule) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || (manualType === "person" ? "Phụ nữ nuôi con nhỏ dưới 36 tháng tuổi" : "Chủ động khắc phục bồi thường tài sản"));
  const [point, setPoint] = useState(initialData?.point || (manualType === "person" ? "Điểm a" : "Điểm c"));
  const [clause, setClause] = useState(initialData?.clause || "Khoản 3");
  const [article, setArticle] = useState(initialData?.article || "Điều 40");
  const [law, setLaw] = useState(initialData?.law || "BLHS 2015");
  const [desc, setDesc] = useState(initialData?.desc || "");

  // Mẫu căn cứ có sẵn theo Bộ luật Hình sự
  const presetOptions = manualType === "person" ? [
    { label: "Điều 40 Khoản 3 Điểm a (Phụ nữ có thai hoặc nuôi con nhỏ)", point: "Điểm a", clause: "Khoản 3", article: "Điều 40", law: "BLHS 2015", desc: "Không thi hành án tử hình đối với phụ nữ có thai hoặc phụ nữ đang nuôi con dưới 36 tháng tuổi." },
    { label: "Điều 40 Khoản 3 Điểm b (Người từ đủ 75 tuổi trở lên)", point: "Điểm b", clause: "Khoản 3", article: "Điều 40", law: "BLHS 2015", desc: "Không thi hành án tử hình đối với người từ đủ 75 tuổi trở lên khi phạm tội hoặc khi xét xử, thi hành án." },
    { label: "Điều 40 Khoản 2 (Người dưới 18 tuổi)", point: "", clause: "Khoản 2", article: "Điều 40", law: "BLHS 2015", desc: "Không áp dụng hình phạt tử hình đối với người dưới 18 tuổi khi phạm tội." },
  ] : [
    { label: "Điều 40 Khoản 3 Điểm c (Nộp lại 3/4 tài sản tham ô, nhận hối lộ)", point: "Điểm c", clause: "Khoản 3", article: "Điều 40", law: "BLHS 2015", desc: "Người bị kết án tử hình về tội tham ô tài sản, tội nhận hối lộ mà sau khi bị kết án đã chủ động nộp lại ít nhất ba phần tư tài sản tham ô, nhận hối lộ và hợp tác tích cực với cơ quan chức năng hoặc lập công lớn." },
    { label: "Điều 51 Khoản 1 Điểm b (Tự nguyện bồi thường, khắc phục)", point: "Điểm b", clause: "Khoản 1", article: "Điều 51", law: "BLHS 2015", desc: "Người phạm tội tự nguyện sửa chữa, bồi thường thiệt hại hoặc khắc phục hậu quả." },
  ];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: F
    }}>
      <div style={{
        background: "#fff", borderRadius: 8, width: 620, maxWidth: "95vw",
        display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)", border: `1px solid ${BORDER}`
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, background: "#f8fafc"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1f2937" }}>
              {initialData ? "Sửa Quy Định Căn Cứ Pháp Lý" : `Thêm Quy Định Căn Cứ ${manualType === "person" ? "Nhân Thân" : "Khắc Phục Kinh Tế"}`}
            </h3>
            <div style={{ fontSize: 12, color: MUTED }}>Chọn theo điều luật chuẩn trong Bộ luật Hình sự</div>
          </div>
          <Button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={20} />
          </Button>
        </div>

        <div style={{ padding: 24, display: "grid", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
              Chọn nhanh căn cứ pháp lý từ Bộ luật Hình sự
            </label>
            <select
              onChange={e => {
                const opt = presetOptions.find(o => o.label === e.target.value);
                if (opt) {
                  setPoint(opt.point);
                  setClause(opt.clause);
                  setArticle(opt.article);
                  setLaw(opt.law);
                  setDesc(opt.desc);
                }
              }}
              style={{
                width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`,
                borderRadius: 4, fontFamily: F, fontSize: 13, background: "#f8fafc"
              }}
            >
              <option value="">-- Chọn điều luật áp dụng chuẩn --</option>
              {presetOptions.map(o => (
                <option key={o.label} value={o.label}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
              Tên quy định / điều kiện
            </label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Phụ nữ có thai hoặc nuôi con nhỏ..."
              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
              Căn cứ điều luật chi tiết
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.5fr", gap: 8 }}>
              <Input
                value={point}
                onChange={e => setPoint(e.target.value)}
                placeholder="Điểm (VD: Điểm c)"
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box" }}
              />
              <Input
                value={clause}
                onChange={e => setClause(e.target.value)}
                placeholder="Khoản (VD: Khoản 3)"
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box" }}
              />
              <Input
                value={article}
                onChange={e => setArticle(e.target.value)}
                placeholder="Điều (VD: Điều 40)"
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box" }}
              />
              <Input
                value={law}
                onChange={e => setLaw(e.target.value)}
                placeholder="Bộ luật (VD: BLHS 2015)"
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
              Mô tả chi tiết & Hướng dẫn thẩm định hồ sơ
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Mô tả hướng dẫn chi tiết cho Thẩm tra viên khi rà soát hồ sơ..."
              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 13, boxSizing: "border-box", resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "flex-end", gap: 10,
          padding: "14px 24px", borderTop: `1px solid ${BORDER}`, background: "#f8fafc"
        }}>
          <Button
            onClick={onClose}
            style={{ padding: "7px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontFamily: F, fontSize: 13 }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (!title.trim()) { alert("Vui lòng nhập tên quy định!"); return; }
              onSave({
                id: initialData?.id || "",
                title: title.trim(),
                point: point.trim(),
                clause: clause.trim(),
                article: article.trim(),
                law: law.trim(),
                desc: desc.trim(),
                active: initialData?.active !== false,
              });
            }}
            style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: 700 }}
          >
            Lưu quy định
          </Button>
        </div>
      </div>
    </div>
  );
}
