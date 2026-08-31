import React, { useState } from "react";
import { FileText, Calendar, X } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { TrinhKyModal } from "./TrinhKyModal";
import { XemBieuMauDuThaoModal } from "./TaoDuThaoModal";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";

export function ThemKetQuaModal({ onClose, detail }: { onClose: () => void; detail?: any }) {
  const isKhieuNai = detail?.isKhieuNai || detail?.entityWord === "Khiếu nại" || detail?.moduleLabel === "Quản lý khiếu nại" || (typeof detail?.maVuAn === "string" && detail.maVuAn.includes("KN")) || (typeof detail?.id === "string" && detail.id.includes("KN")) || (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"));
  type KetQua = "tra-loi" | "khang-nghi" | "xep-don" | "vks" | "chap-nhan" | "khong-chap-nhan";
  const [ketQua, setKetQua] = useState<KetQua>(isKhieuNai ? "chap-nhan" : "tra-loi");
  const [showTaiLieuHoSoModal, setShowTaiLieuHoSoModal] = useState(false);

  // Vụ án info summary
  const maVuAn = detail?.maVuAn || "VA26-00321";
  const tenVuAn = detail?.tenVuAn || "Vụ án Phan Văn Thành – bức cung";
  const tenBiCan = detail?.tenBiCan || detail?.biCao || "Phan Văn Thành";
  const toiDanh = detail?.toiDanh || "Bức cung";
  const soBA = detail?.soBA || "050526_CTH02";
  const ngayBA = detail?.ngayBA || "05/05/2026";
  const toaXetXu = detail?.toaXetXu || "Tòa án nhân dân khu vực 6 - Hà Nội";
  const giaiDoan = detail?.giaiDoan || "Giám đốc thẩm, tái thẩm";
  const toaAnGiaiQuyet = detail?.toaAnGiaiQuyet || "Tòa án nhân dân thành phố Hà Nội";
  const trangThai = detail?.trangThai || "Chưa có kết quả giải quyết đơn";

  // Section 1: Thông tin đơn
  const [donDataList, setDonDataList] = useState([
    {
      id: "don-1",
      label: "1. Đơn 09D732899 - Phạm Minh Tuấn",
      nguoi: ["Phạm Minh Tuấn", "Phạm Văn Nam"],
    },
    {
      id: "don-2",
      label: "2. Đơn 10D732900 - Trần Văn Hùng",
      nguoi: ["Trần Văn Hùng"],
    },
  ]);
  const [donCheckedList, setDonCheckedList] = useState<Record<string, boolean>>({
    "don-1": true,
    "don-1::Phạm Minh Tuấn": true,
    "don-2": true,
    "don-2::Trần Văn Hùng": true,
  });
  const [donExpanded, setDonExpanded] = useState<Record<string, boolean>>({});
  const [donOpen, setDonOpen] = useState(false);
  const [showAddNguoiModal, setShowAddNguoiModal] = useState(false);
  const [newNguoiTen, setNewNguoiTen] = useState("");
  const [newNguoiDonId, setNewNguoiDonId] = useState("don-1");

  const toggleDonCheck = (donId: string) => {
    setDonCheckedList(prev => {
      const next = { ...prev };
      const donObj = donDataList.find(d => d.id === donId);
      const currVal = !prev[donId];
      next[donId] = currVal;
      if (donObj) {
        donObj.nguoi.forEach(n => {
          next[`${donId}::${n}`] = currVal;
        });
      }
      return next;
    });
  };

  const toggleNguoiCheck = (donId: string, nguoiTen: string) => {
    setDonCheckedList(prev => {
      const next = { ...prev };
      const key = `${donId}::${nguoiTen}`;
      next[key] = !prev[key];
      const donObj = donDataList.find(d => d.id === donId);
      if (donObj) {
        const allChecked = donObj.nguoi.every(n => next[`${donId}::${n}`]);
        next[donId] = allChecked;
      }
      return next;
    });
  };

  const getSelectedDonSummary = () => {
    let countDon = 0;
    let countNguoi = 0;
    const selectedItems: string[] = [];

    donDataList.forEach(d => {
      const checkedNguoi = d.nguoi.filter(n => donCheckedList[`${d.id}::${n}`]);
      if (donCheckedList[d.id] || checkedNguoi.length > 0) {
        countDon++;
        checkedNguoi.forEach(n => {
          countNguoi++;
          selectedItems.push(`${n} (${d.label.split(" - ")[0]})`);
        });
      }
    });

    if (countDon === 0 && countNguoi === 0) return "Chọn đơn / người đứng đơn liên quan...";
    return `${countDon} đơn / ${countNguoi} người đứng đơn được chọn (${selectedItems.join(", ")})`;
  };

  const handleAddNewNguoiDungDon = () => {
    if (!newNguoiTen.trim()) {
      alert("Vui lòng nhập tên người đứng đơn!");
      return;
    }
    const name = newNguoiTen.trim();
    setDonDataList(prev => prev.map(d => {
      if (d.id === newNguoiDonId) {
        return { ...d, nguoi: [...d.nguoi, name] };
      }
      return d;
    }));
    setDonCheckedList(prev => ({
      ...prev,
      [`${newNguoiDonId}::${name}`]: true,
    }));
    setNewNguoiTen("");
    setShowAddNguoiModal(false);
  };

  // Section 2: Thông tin quyết định
  const biCaoOptions = Array.from(
    new Set([
      detail?.biCao,
      detail?.tenBiCan,
      "Phan Văn Thành (Bị cáo đầu vụ)",
      "Nguyễn Văn Minh (Bị cáo)",
      "Trần Đình Trọng (Bị cáo)",
      "Lê Văn Hùng (Bị cáo)",
    ].filter(Boolean))
  ) as string[];
  const [selectedBiCao, setSelectedBiCao] = useState(biCaoOptions[0] || "Phan Văn Thành (Bị cáo đầu vụ)");

  const DEFAULT_HOSO_DATA = [
    {
      id: "HS01",
      label: "📁 Hồ sơ vụ án sơ thẩm (Số 125/2023/HS-ST)",
      files: [
        "Bản án sơ thẩm số 125/2023/HS-ST ngày 15/10/2023",
        "Cáo trạng số 42/CT-VKSND thành phố Hà Nội ngày 20/08/2023",
        "Biên bản lấy lời khai bị cáo Phan Văn Thành",
        "Kết luận giám định pháp y thương tích số 88/GĐPY",
      ],
    },
    {
      id: "HS02",
      label: "📁 Hồ sơ chứng cứ & tài liệu bổ sung (Năm 2026)",
      files: [
        "Văn bản kiến nghị xem xét GĐT của Luật sư bào chữa",
        "Chứng cứ mới về thời điểm xảy ra sự việc (Video/Ảnh)",
        "Đơn trình bày bổ sung tình tiết giảm nhẹ của gia đình",
      ],
    },
    {
      id: "HS03",
      label: "📁 Hồ sơ mượn từ TAND khu vực 6 - Hà Nội (Mã mượn HS-LA/2026)",
      files: [
        "Quyết định cho mượn hồ sơ gốc số 14/QĐ-TANDLA",
        "Biên bản giao nhận hồ sơ ngày 10/01/2026",
      ],
    },
    {
      id: "HS04",
      label: "📁 Tiểu hồ sơ nghiên cứu của Công chức nghiên cứu",
      files: [
        "Báo cáo nghiên cứu hồ sơ của Công chức nghiên cứu Lý Thái Phúc",
        "Phiếu đề xuất hướng giải quyết kháng nghị GĐT",
      ],
    },
  ];

  const [hoSoOpen, setHoSoOpen] = useState(false);
  const [hoSoExpanded, setHoSoExpanded] = useState<Record<string, boolean>>({ HS01: true });
  const [hoSoCheckedList, setHoSoCheckedList] = useState<Record<string, boolean>>({
    HS01: true,
    "HS01::Bản án sơ thẩm số 125/2023/HS-ST ngày 15/10/2023": true,
    "HS01::Cáo trạng số 42/CT-VKSND thành phố Hà Nội ngày 20/08/2023": true,
  });

  const toggleHoSoCheck = (hoSoId: string) => {
    setHoSoCheckedList(prev => {
      const isChecked = !prev[hoSoId];
      const next = { ...prev, [hoSoId]: isChecked };
      const targetHoSo = DEFAULT_HOSO_DATA.find(h => h.id === hoSoId);
      if (targetHoSo) {
        targetHoSo.files.forEach(f => {
          next[`${hoSoId}::${f}`] = isChecked;
        });
      }
      return next;
    });
  };

  const toggleFileCheck = (hoSoId: string, fileName: string) => {
    setHoSoCheckedList(prev => {
      const key = `${hoSoId}::${fileName}`;
      const isChecked = !prev[key];
      const next = { ...prev, [key]: isChecked };
      const targetHoSo = DEFAULT_HOSO_DATA.find(h => h.id === hoSoId);
      if (targetHoSo) {
        const allChecked = targetHoSo.files.every(f => next[`${hoSoId}::${f}`]);
        next[hoSoId] = allChecked;
      }
      return next;
    });
  };

  const getSelectedHoSoSummary = () => {
    const selectedLabels: string[] = [];
    DEFAULT_HOSO_DATA.forEach(h => {
      if (hoSoCheckedList[h.id]) {
        selectedLabels.push(h.label.replace("📁 ", ""));
      } else {
        const checkedFiles = h.files.filter(f => hoSoCheckedList[`${h.id}::${f}`]);
        if (checkedFiles.length > 0) {
          selectedLabels.push(`${h.label.replace("📁 ", "")} (${checkedFiles.length} tài liệu)`);
        }
      }
    });
    if (selectedLabels.length === 0) return "-- Chọn hồ sơ kháng nghị --";
    return selectedLabels.join("; ");
  };

  const [ngayQuyetDinh, setNgayQuyetDinh] = useState("09/08/2026");
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [nguoiKy, setNguoiKy] = useState("Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [selectedVKS, setSelectedVKS] = useState("VKSND Tối cao");
  const [ngayXepDon, setNgayXepDon] = useState("09/08/2026");
  const [nguoiXepDon, setNguoiXepDon] = useState("Đặng Quốc Trung – Chánh án");

  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  // Section 3: Nơi nhận table
  const [noiNhanList, setNoiNhanList] = useState([
    { id: 1, noiNhan: "Khác", noiNhanChiTiet: "Như kính gửi", ghiChu: "–" },
    { id: 2, noiNhan: "Tòa án nhân dân", noiNhanChiTiet: "Đ/c Chánh án TAND thành phố Hà Nội", ghiChu: "để báo cáo" },
  ]);

  const [isAddingNoiNhan, setIsAddingNoiNhan] = useState(false);
  const [newNoiNhan, setNewNoiNhan] = useState("Khác");
  const [newChiTiet, setNewChiTiet] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNoiNhan, setEditNoiNhan] = useState("");
  const [editChiTiet, setEditChiTiet] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const handleStartEdit = (r: { id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }) => {
    setEditingId(r.id);
    setEditNoiNhan(r.noiNhan);
    setEditChiTiet(r.noiNhanChiTiet);
    setEditGhiChu(r.ghiChu);
  };

  const handleSaveEdit = (id: number) => {
    if (!editChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, noiNhan: editNoiNhan, noiNhanChiTiet: editChiTiet.trim(), ghiChu: editGhiChu.trim() || "–" }
          : item
      )
    );
    setEditingId(null);
  };

  const handleSaveNewNoiNhan = () => {
    if (!newChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        noiNhan: newNoiNhan,
        noiNhanChiTiet: newChiTiet.trim(),
        ghiChu: newGhiChu.trim() || "–",
      },
    ]);
    setIsAddingNoiNhan(false);
    setNewChiTiet("");
    setNewGhiChu("");
  };

  const handleDeleteNoiNhan = (id: number) => {
    setNoiNhanList(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const num = Math.floor(Math.random() * 900 + 100);
      const generated = `${num}/2026/${ketQua === "khang-nghi" ? "QĐ-TAHN" : "TB-TAHN"}`;
      setSoQuyetDinh(generated);
      setDaLaySo(true);
      alert(`Đã cấp số quyết định/văn bản thành công: ${generated}`);
    } else {
      setSoQuyetDinh("");
      setDaLaySo(false);
      alert("Đã hủy cấp số!");
    }
  };

  const handleSave = () => {
    alert("Đã lưu kết quả giải quyết văn bản đề nghị thành công!");
    onClose();
  };

  const inSt: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
  };
  const lblSt: React.CSSProperties = {
    fontSize: 12,
    color: "#333333",
    fontWeight: 600,
    fontFamily: F,
    display: "block",
    marginBottom: 4,
  };

  const RADIO_OPTIONS: { value: KetQua; label: string }[] = isKhieuNai ? [
    { value: "chap-nhan", label: "Chấp nhận khiếu nại" },
    { value: "khong-chap-nhan", label: "Không chấp nhận khiếu nại" },
    { value: "xep-don", label: "Xếp đơn" },
  ] : [
    { value: "khang-nghi", label: "Kháng nghị" },
    { value: "tra-loi", label: "Trả lời đơn" },
    { value: "xep-don", label: "Xếp đơn" },
    { value: "vks", label: "Viện kiểm sát đang giải quyết" },
  ];

  const isTraLoi = ketQua === "tra-loi";
  const isKhangNghi = ketQua === "khang-nghi";
  const isXepDon = ketQua === "xep-don";
  const isVks = ketQua === "vks";
  const showNoiNhan = isTraLoi || isVks || isKhangNghi || ketQua === "chap-nhan" || ketQua === "khong-chap-nhan";
  const VKS_OPTIONS = ["VKSND Tối cao", "VKSND thành phố Hà Nội", "VKSND khu vực 1 - Hà Nội", "VKSND khu vực 2 - Hà Nội"];

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 8, width: "min(920px, 96vw)", maxHeight: "94vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: F, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <FileText size={16} color={RED} style={{ marginRight: 8 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, flex: 1 }}>
              {isKhieuNai ? "Thêm kết quả giải quyết khiếu nại" : "Tạo kết quả giải quyết văn bản đề nghị"}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <X size={18} color={MUTED} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Info card */}
            <div
              style={{
                background: "#fafafa",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1fr 1fr",
                  gap: "8px 16px",
                  fontSize: 12,
                  fontFamily: F,
                  lineHeight: 1.5,
                }}
              >
                {/* Col 1 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>
                    <span style={{ color: "#333333" }}>Mã vụ án: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 700 }}>{maVuAn}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Tên vụ án: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{tenVuAn}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Tên bị can đầu vụ: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{tenBiCan}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Tội danh chính: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toiDanh}</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>
                    <span style={{ color: "#333333" }}>Số BA/QĐ: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{soBA}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Ngày ra BA/QĐ: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{ngayBA}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Tòa xét xử: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toaXetXu}</span>
                  </div>
                </div>

                {/* Col 3 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>
                    <span style={{ color: "#333333" }}>Giai đoạn: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{giaiDoan}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Tòa án giải quyết: </span>
                    <span style={{ color: "#1a5a96", fontWeight: 600 }}>{toaAnGiaiQuyet}</span>
                  </div>
                  <div>
                    <span style={{ color: "#333333" }}>Trạng thái: </span>
                    <span style={{ color: "#c0392b", fontWeight: 700 }}>{trangThai}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Thông tin đơn */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8b1a1a", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                <span>■ Thông tin đơn</span>
              </div>

              {!isKhieuNai && (
                <div>
                  {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <label style={lblSt}>
                      <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Đơn liên quan / Người đứng đơn
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddNguoiModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8b1a1a",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: F,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      + Thêm người đứng đơn
                    </button>
                  </div> */}

                  <div style={{ position: "relative" }}>
                    <div
                      onClick={() => setDonOpen(o => !o)}
                      style={{
                        ...inSt,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        userSelect: "none",
                        minHeight: 34,
                        background: "#fff",
                      }}
                    >
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#222222", fontWeight: 500 }}>
                        {getSelectedDonSummary()}
                      </span>
                      <span style={{ fontSize: 10, color: "#666666", marginLeft: 6 }}>{donOpen ? "▲" : "▼"}</span>
                    </div>

                    {donOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 300,
                          background: "#fff",
                          border: "1px solid #cccccc",
                          borderRadius: 4,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                          maxHeight: 280,
                          overflowY: "auto",
                          marginTop: 4,
                        }}
                      >
                        {donDataList.map(don => {
                          const isWholeDonChecked = !!donCheckedList[don.id];
                          const isExpanded = !!donExpanded[don.id];
                          const anyNguoiChecked = don.nguoi.some(n => donCheckedList[`${don.id}::${n}`]);
                          return (
                            <div key={don.id}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "8px 12px",
                                  borderBottom: "1px solid #e0e0e0",
                                  background: isWholeDonChecked || anyNguoiChecked ? "#fdf3f2" : "#fff",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isWholeDonChecked}
                                  ref={el => { if (el) el.indeterminate = !isWholeDonChecked && anyNguoiChecked; }}
                                  onChange={() => toggleDonCheck(don.id)}
                                  style={{ accentColor: "#8b1a1a", cursor: "pointer", flexShrink: 0 }}
                                />
                                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#222222" }}>
                                  {don.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={e => { e.stopPropagation(); setDonExpanded(p => ({ ...p, [don.id]: !p[don.id] })); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1a73e8", padding: "2px 4px" }}
                                >
                                  {isExpanded ? "▲ Thu gọn người đứng đơn" : `▼ Xem ${don.nguoi.length} người đứng đơn`}
                                </button>
                              </div>
                              {isExpanded && don.nguoi.map(nguoi => (
                                <div
                                  key={nguoi}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "6px 12px 6px 32px",
                                    borderBottom: "1px solid #f5f5f5",
                                    background: donCheckedList[`${don.id}::${nguoi}`] ? "#fff5f5" : "#fafafa",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!donCheckedList[`${don.id}::${nguoi}`] || isWholeDonChecked}
                                    onChange={() => toggleNguoiCheck(don.id, nguoi)}
                                    style={{ accentColor: "#8b1a1a", cursor: "pointer", flexShrink: 0 }}
                                  />
                                  <span style={{ fontSize: 12, color: "#222222" }}>👤 {nguoi}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid #e0e0e0", background: "#fafafa" }}>
                          <button
                            type="button"
                            onClick={() => { setShowAddNguoiModal(true); setDonOpen(false); }}
                            style={{ fontSize: 11, color: "#8b1a1a", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                          >
                            + Thêm mới người đứng đơn
                          </button>
                          <button
                            type="button"
                            onClick={() => setDonOpen(false)}
                            style={{ padding: "5px 16px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label style={lblSt}>
                  <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Kết quả giải quyết đơn
                </label>
                <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  {RADIO_OPTIONS.map(o => (
                    <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#222222" }}>
                      <input
                        type="radio"
                        name="ketqua-tkq"
                        checked={ketQua === o.value}
                        onChange={() => setKetQua(o.value)}
                        style={{ accentColor: "#8b1a1a", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: ketQua === o.value ? 700 : 400 }}>{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isKhangNghi && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={lblSt}>
                        <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Chọn Bị cáo
                      </label>
                      <select
                        value={selectedBiCao}
                        onChange={e => setSelectedBiCao(e.target.value)}
                        style={{ ...inSt, cursor: "pointer" }}
                      >
                        <option value="">-- Chọn bị cáo --</option>
                        {biCaoOptions.map(bc => (
                          <option key={bc} value={bc}>{bc}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Thông tin quyết định */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8b1a1a", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                <span>■ Thông tin quyết định</span>
              </div>

              {(isTraLoi || isKhangNghi || isVks || ketQua === "chap-nhan" || ketQua === "khong-chap-nhan") && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={lblSt}>Ngày quyết định</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          value={ngayQuyetDinh}
                          onChange={e => setNgayQuyetDinh(e.target.value)}
                          placeholder="Chọn ngày quyết định"
                          style={{ ...inSt, paddingRight: 28 }}
                        />
                        <Calendar size={14} color="#888888" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                      </div>
                    </div>

                    <div>
                      <label style={lblSt}>Số quyết định</label>
                      <input
                        type="text"
                        value={soQuyetDinh}
                        onChange={e => setSoQuyetDinh(e.target.value)}
                        placeholder="Nhập số quyết định"
                        style={inSt}
                      />
                    </div>

                    <div>
                      <label style={lblSt}>
                        <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Người ký ban hành
                      </label>
                      <select
                        value={nguoiKy}
                        onChange={e => setNguoiKy(e.target.value)}
                        style={{ ...inSt, cursor: "pointer" }}
                      >
                        <option value="Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội">Nguyễn Biên Thuỳ - Thẩm phán TAND thành phố Hà Nội</option>
                        <option value="Phan Văn Nam - Phó Chánh án TAND thành phố Hà Nội">Phan Văn Nam - Phó Chánh án TAND thành phố Hà Nội</option>
                        <option value="Đặng Quốc Trung – Chánh án">Đặng Quốc Trung – Chánh án</option>
                        <option value="Lê Minh Trí – Phó Chánh án">Lê Minh Trí – Phó Chánh án</option>
                        <option value="Lê Hoàng Nam - Trưởng phòng">Lê Hoàng Nam - Trưởng phòng</option>
                        <option value="Lý Thái Phúc - Công chức nghiên cứu">Lý Thái Phúc - Công chức nghiên cứu</option>
                      </select>
                    </div>

                    <div>
                      <label style={lblSt}>Ngày phát hành</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          value={ngayPhatHanh}
                          onChange={e => setNgayPhatHanh(e.target.value)}
                          placeholder="Chọn ngày phát hành"
                          style={{ ...inSt, paddingRight: 28 }}
                        />
                        <Calendar size={14} color="#888888" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                      </div>
                    </div>
                  </div>

                  {isVks && (
                    <div style={{ maxWidth: 380 }}>
                      <label style={lblSt}>
                        <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Viện kiểm sát đang giải quyết
                      </label>
                      <select
                        value={selectedVKS}
                        onChange={e => setSelectedVKS(e.target.value)}
                        style={{ ...inSt, cursor: "pointer" }}
                      >
                        {VKS_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label style={lblSt}>
                      <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>
                      {isKhangNghi
                        ? "Nội dung quyết định kháng nghị"
                        : isVks
                          ? "Nội dung chuyển Viện kiểm sát giải quyết"
                          : "Nội dung trả lời"}
                    </label>
                    <textarea
                      value={noiDung}
                      onChange={e => setNoiDung(e.target.value)}
                      placeholder={isKhangNghi ? "Nhập nội dung quyết định kháng nghị..." : "Nhập nội dung trả lời..."}
                      rows={3}
                      style={{ ...inSt, resize: "vertical", lineHeight: 1.5 }}
                    />
                  </div>
                </>
              )}

              {isXepDon && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={lblSt}>
                        <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Ngày xếp đơn
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          value={ngayXepDon}
                          onChange={e => setNgayXepDon(e.target.value)}
                          placeholder="Chọn ngày xếp đơn"
                          style={{ ...inSt, paddingRight: 28 }}
                        />
                        <Calendar size={14} color="#888888" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                      </div>
                    </div>

                    <div>
                      <label style={lblSt}>
                        <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Người quyết định xếp đơn
                      </label>
                      <select
                        value={nguoiXepDon}
                        onChange={e => setNguoiXepDon(e.target.value)}
                        style={{ ...inSt, cursor: "pointer" }}
                      >
                        <option value="Đặng Quốc Trung – Chánh án">Đặng Quốc Trung – Chánh án</option>
                        <option value="Lê Minh Trí – Phó Chánh án">Lê Minh Trí – Phó Chánh án</option>
                        <option value="Nguyễn Thị Bình – Trưởng phòng">Nguyễn Thị Bình – Trưởng phòng</option>
                        <option value="Lê Hoàng Nam - Trưởng phòng">Lê Hoàng Nam - Trưởng phòng</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={lblSt}>Lý do xếp đơn</label>
                    <textarea
                      value={noiDung}
                      onChange={e => setNoiDung(e.target.value)}
                      placeholder="Nhập lý do xếp đơn..."
                      rows={3}
                      style={{ ...inSt, resize: "vertical", lineHeight: 1.5 }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Section 3: Nơi nhận */}
            {showNoiNhan && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...lblSt, marginBottom: 0, fontWeight: 600 }}>
                    <span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Nơi nhận
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNoiNhan(true)}
                    style={{
                      background: "#8b1a1a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "5px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: F,
                      cursor: "pointer",
                    }}
                  >
                    + Thêm nơi nhận
                  </button>
                </div>

                <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                    <thead>
                      <tr style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <th style={{ ...TH_STYLE, width: 45, textAlign: "center" }}>STT</th>
                        <th style={{ ...TH_STYLE, width: 160 }}>Nơi nhận</th>
                        <th style={{ ...TH_STYLE, width: 220 }}>Nơi nhận chi tiết</th>
                        <th style={{ ...TH_STYLE }}>Ghi chú</th>
                        <th style={{ ...TH_STYLE, width: 90, textAlign: "center" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noiNhanList.map((r, idx) => (
                        <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}`, background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                          <td style={TD_STYLE}>
                            {editingId === r.id ? (
                              <select
                                value={editNoiNhan}
                                onChange={e => setEditNoiNhan(e.target.value)}
                                style={{ ...inSt, padding: "4px 8px" }}
                              >
                                <option value="Khác">Khác</option>
                                <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                                <option value="Viện kiểm sát">Viện kiểm sát</option>
                                <option value="Đương sự">Đương sự</option>
                              </select>
                            ) : (
                              r.noiNhan
                            )}
                          </td>
                          <td style={TD_STYLE}>
                            {editingId === r.id ? (
                              <input
                                type="text"
                                value={editChiTiet}
                                onChange={e => setEditChiTiet(e.target.value)}
                                style={{ ...inSt, padding: "4px 8px" }}
                              />
                            ) : (
                              r.noiNhanChiTiet
                            )}
                          </td>
                          <td style={TD_STYLE}>
                            {editingId === r.id ? (
                              <input
                                type="text"
                                value={editGhiChu}
                                onChange={e => setEditGhiChu(e.target.value)}
                                style={{ ...inSt, padding: "4px 8px" }}
                              />
                            ) : (
                              r.ghiChu
                            )}
                          </td>
                          <td style={{ ...TD_STYLE, textAlign: "center" }}>
                            {editingId === r.id ? (
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(r.id)}
                                  style={{ background: "none", border: "none", color: "#27ae60", fontWeight: 700, cursor: "pointer", fontSize: 11 }}
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 11 }}
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(r)}
                                  style={{ background: "none", border: "none", color: "#1a73e8", cursor: "pointer", fontSize: 11 }}
                                >
                                  ✏ Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNoiNhan(r.id)}
                                  style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 11 }}
                                >
                                  🗑 Xóa
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Add new inline row */}
                      {isAddingNoiNhan && (
                        <tr style={{ background: "#e8f5e9", borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{noiNhanList.length + 1}</td>
                          <td style={TD_STYLE}>
                            <select
                              value={newNoiNhan}
                              onChange={e => setNewNoiNhan(e.target.value)}
                              style={{ ...inSt, padding: "4px 8px" }}
                            >
                              <option value="Khác">Khác</option>
                              <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                              <option value="Viện kiểm sát">Viện kiểm sát</option>
                              <option value="Đương sự">Đương sự</option>
                            </select>
                          </td>
                          <td style={TD_STYLE}>
                            <input
                              type="text"
                              placeholder="Nhập nơi nhận chi tiết"
                              value={newChiTiet}
                              onChange={e => setNewChiTiet(e.target.value)}
                              style={{ ...inSt, padding: "4px 8px" }}
                            />
                          </td>
                          <td style={TD_STYLE}>
                            <input
                              type="text"
                              placeholder="Ghi chú"
                              value={newGhiChu}
                              onChange={e => setNewGhiChu(e.target.value)}
                              style={{ ...inSt, padding: "4px 8px" }}
                            />
                          </td>
                          <td style={{ ...TD_STYLE, textAlign: "center" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                              <button
                                type="button"
                                onClick={handleSaveNewNoiNhan}
                                style={{ background: "none", border: "none", color: "#27ae60", fontWeight: 700, cursor: "pointer", fontSize: 11 }}
                              >
                                Lưu
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAddingNoiNhan(false)}
                                style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 11 }}
                              >
                                Hủy
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
            >
              Lưu
            </button>
            {(isTraLoi || isVks || isKhangNghi) && (
              <button
                type="button"
                onClick={handleToggleLaySo}
                style={{
                  padding: "7px 20px",
                  background: daLaySo ? "#fdf3f2" : "#fff",
                  color: daLaySo ? "#c0392b" : TEXT,
                  border: `1px solid ${daLaySo ? "#f3c0bb" : BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: F,
                }}
              >
                {daLaySo ? "✕ Hủy cấp số" : "Lấy số"}
              </button>
            )}
            {(isTraLoi || isVks || isKhangNghi) && (
              <button
                type="button"
                onClick={() => setShowTrinhKy(true)}
                style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
              >
                Trình ký
              </button>
            )}
            {!isXepDon && (
              <button
                type="button"
                onClick={() => setShowBieuMau(true)}
                style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
              >
                Xem biểu mẫu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Xem / Quản lý tài liệu hồ sơ số hóa */}
      {showTaiLieuHoSoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 16px", background: "#8b1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>📁 Quản lý tài liệu hồ sơ số hóa - Vụ án {maVuAn}</span>
            <button onClick={() => setShowTaiLieuHoSoModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: F }}>
              <X size={16} /> Đóng xem hồ sơ
            </button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TaiLieuHoSoView vuAnId={maVuAn} tenVuAn={tenVuAn} onBack={() => setShowTaiLieuHoSoModal(false)} />
          </div>
        </div>
      )}

      {/* Modal Thêm người đứng đơn */}
      {/* {showAddNguoiModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 440, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", fontFamily: F }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#222222" }}>Thêm người đứng đơn</span>
              <button onClick={() => setShowAddNguoiModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={lblSt}><span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Chọn đơn thuộc người đứng đơn</label>
                <select value={newNguoiDonId} onChange={e => setNewNguoiDonId(e.target.value)} style={inSt}>
                  {donDataList.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lblSt}><span style={{ color: "#c0392b", marginRight: 3 }}>*</span>Họ và tên người đứng đơn</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên người đứng đơn"
                  value={newNguoiTen}
                  onChange={e => setNewNguoiTen(e.target.value)}
                  style={inSt}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowAddNguoiModal(false)} style={{ padding: "6px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
              <button onClick={handleAddNewNguoiDungDon} style={{ padding: "6px 18px", background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal Trình ký */}
      {showTrinhKy && (
        <TrinhKyModal
          onClose={() => setShowTrinhKy(false)}
          record={{
            loaiVB: ketQua === "khang-nghi" ? "Quyết định kháng nghị" : "Thông báo trả lời đơn",
            soHoSo: "01",
            donViSoan: "Tòa Hình sự - TAND thành phố Hà Nội",
          }}
        />
      )}

      {/* Modal Xem biểu mẫu */}
      {showBieuMau && (
        <XemBieuMauDuThaoModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          ketQua={ketQua === "khang-nghi" ? "khang-nghi" : "tra-loi"}
          soQuyetDinh={soQuyetDinh || "179/2026/TB-TA"}
          ngayQuyetDinh={ngayQuyetDinh || "09/08/2026"}
          nguoiKy={nguoiKy}
          noiDung={noiDung || "Căn cứ vào tài liệu, chứng cứ có trong hồ sơ vụ án..."}
        />
      )}
    </>
  );
}

// ── Modal Thêm quyết định hoãn thi hành án riêng biệt ────────────────────────
export function ThemQuyetDinhHoanModal({
  onClose,
  detail,
  onSave,
}: {
  onClose: () => void;
  detail?: any;
  onSave?: (data: any) => void;
}) {
  const maVuAn = detail?.maVuAn || "VA26-00321";
  const tenVuAn = detail?.tenVuAn || "Vụ án Phan Văn Thành – bức cung";
  const biCaoOptions = Array.from(
    new Set([
      detail?.biCao,
      detail?.tenBiCan,
      "Phan Văn Thành (Bị cáo đầu vụ)",
      "Nguyễn Văn Minh (Bị cáo)",
      "Trần Đình Trọng (Bị cáo)",
      "Lê Văn Hùng (Bị cáo)",
    ].filter(Boolean))
  ) as string[];

  const [selectedBiCao, setSelectedBiCao] = useState(biCaoOptions[0] || "Phan Văn Thành (Bị cáo đầu vụ)");
  const [tenQuyetDinh, setTenQuyetDinh] = useState("Quyết định tạm hoãn chấp hành án phạt tù");
  const [soQuyetDinh, setSoQuyetDinh] = useState("08/2026/QĐ-THTHA");
  const [ngayQuyetDinh, setNgayQuyetDinh] = useState("10/07/2026");
  const [nguoiKy, setNguoiKy] = useState("Đặng Quốc Trung – Chánh án TAND thành phố Hà Nội");
  const [thoiHan, setThoiHan] = useState("06 tháng");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("10/07/2026");
  const [coQuanTHA, setCoQuanTHA] = useState("Cơ quan THA hình sự Công an Thành phố Hà Nội");
  const [lyDo, setLyDo] = useState("Chờ kết quả xét xử theo thủ tục giám đốc thẩm đối với bản án hình sự phúc thẩm.");

  const [nnRows, setNnRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSND Tối cao", ghiChu: "để kiểm sát" },
    { id: 2, noiNhan: "Cơ quan THA", chiTiet: "Cơ quan THA hình sự Công an Thành phố Hà Nội", ghiChu: "để thi hành" },
    { id: 3, noiNhan: "Trại tạm giam", chiTiet: "Trại tạm giam Công an Thành phố Hà Nội", ghiChu: "để thực hiện" },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const inSt: React.CSSProperties = { padding: "8px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const lblSt: React.CSSProperties = { fontSize: 12, color: TEXT, fontWeight: 600, fontFamily: F, display: "block", marginBottom: 5 };

  const handleSave = () => {
    if (onSave) {
      onSave({
        stt: 1,
        biCao: selectedBiCao,
        tenQuyetDinh,
        soQuyetDinh,
        ngayQuyetDinh,
        nguoiKy,
        nguoiTao: "Lý Thái Phúc (Công chức nghiên cứu)",
      });
    }
    alert("Đã lưu quyết định hoãn thi hành án thành công!");
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "min(860px, 96vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: F, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <FileText size={16} color={RED} style={{ marginRight: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, flex: 1 }}>
            Thêm mới quyết định hoãn thi hành án
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: MUTED, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Info card */}
          <div style={{ background: "#e8f5e9", border: `1px solid #a5d6a7`, borderRadius: 6, padding: "10px 16px", marginBottom: 16, display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "6px 16px", fontSize: 11 }}>
            <div><span style={{ color: MUTED }}>Mã vụ án: </span><span style={{ color: "#1a5a96", fontWeight: 700 }}>{maVuAn}</span></div>
            <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>050526_CTH02</span></div>
            <div><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
            <div><span style={{ color: MUTED }}>Tên vụ án: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>{tenVuAn}</span></div>
            <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>05/05/2026</span></div>
            <div><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#1a5a96", fontWeight: 600 }}>Tòa án nhân dân thành phố Hà Nội</span></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
            <div>
              <label style={lblSt}><span style={{ color: RED }}>* </span>Tên Bị cáo</label>
              <select value={selectedBiCao} onChange={e => setSelectedBiCao(e.target.value)} style={{ ...inSt, cursor: "pointer" }}>
                {biCaoOptions.map(bc => (
                  <option key={bc} value={bc}>{bc}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lblSt}><span style={{ color: RED }}>* </span>Tên quyết định</label>
              <input value={tenQuyetDinh} onChange={e => setTenQuyetDinh(e.target.value)} placeholder="Nhập tên quyết định hoãn" style={inSt} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={lblSt}><span style={{ color: RED }}>* </span>Số quyết định</label>
              <input value={soQuyetDinh} onChange={e => setSoQuyetDinh(e.target.value)} placeholder="Nhập số QĐ" style={inSt} />
            </div>
            <div>
              <label style={lblSt}><span style={{ color: RED }}>* </span>Ngày ra quyết định</label>
              <input value={ngayQuyetDinh} onChange={e => setNgayQuyetDinh(e.target.value)} placeholder="dd/mm/yyyy" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Thời hạn hoãn</label>
              <input value={thoiHan} onChange={e => setThoiHan(e.target.value)} placeholder="VD: 06 tháng" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Ngày phát hành</label>
              <input value={ngayPhatHanh} onChange={e => setNgayPhatHanh(e.target.value)} placeholder="dd/mm/yyyy" style={inSt} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
            <div>
              <label style={lblSt}><span style={{ color: RED }}>* </span>Người ký ban hành</label>
              <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ ...inSt, cursor: "pointer" }}>
                <option value="Đặng Quốc Trung – Chánh án TAND thành phố Hà Nội">Đặng Quốc Trung – Chánh án TAND thành phố Hà Nội</option>
                <option value="Lê Minh Trí – Phó Chánh án TAND thành phố Hà Nội">Lê Minh Trí – Phó Chánh án TAND thành phố Hà Nội</option>
                <option value="Phạm Quốc Tuấn – Phó Chánh án TAND thành phố Hà Nội">Phạm Quốc Tuấn – Phó Chánh án TAND thành phố Hà Nội</option>
              </select>
            </div>
            <div>
              <label style={lblSt}>Cơ quan thi hành án</label>
              <input value={coQuanTHA} onChange={e => setCoQuanTHA(e.target.value)} placeholder="Nhập cơ quan THA" style={inSt} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lblSt}><span style={{ color: RED }}>* </span>Lý do / Nội dung hoãn thi hành án</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do và nội dung chi tiết của quyết định hoãn..." rows={3} style={{ ...inSt, resize: "vertical", lineHeight: 1.5 }} />
          </div>

          {/* Nơi nhận */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ ...lblSt, marginBottom: 0 }}><span style={{ color: RED }}>* </span>Nơi nhận</label>
              <button onClick={() => setAddingRow(true)} style={{ padding: "4px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>+ Thêm nơi nhận</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ ...TH_STYLE, width: 40, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_STYLE, width: 140 }}>Nơi nhận</th>
                  <th style={{ ...TH_STYLE }}>Nơi nhận chi tiết</th>
                  <th style={{ ...TH_STYLE, width: 140 }}>Ghi chú</th>
                  <th style={{ ...TH_STYLE, width: 70, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {nnRows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{i + 1}</td>
                    <td style={TD_STYLE}>{r.noiNhan}</td>
                    <td style={TD_STYLE}>{r.chiTiet}</td>
                    <td style={TD_STYLE}>{r.ghiChu}</td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <button onClick={() => setNnRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 11 }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
          <button onClick={handleSave} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
