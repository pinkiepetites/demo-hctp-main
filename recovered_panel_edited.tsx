// ─── Tiếp nhận đơn liên thông (VBDH) panel ───────────────────────────────────
// Mẫu dữ liệu gói liên thông từ Văn bản điều hành — hiển thị phía trên
// danh sách đơn để cán bộ nắm được tình hình mà không cần chuyển màn.
const VBDH_SAMPLE: {
  packageId: string; sourceDocNo: string; senderUnit: string; subject: string;
  arrivalAt: string; components: number; officer: string;
  status: "can-xu-ly" | "mot-phan" | "hoan-tat"; priority: boolean;
}[] = [
  { packageId: "HCTP-2026-0041", sourceDocNo: "54/QĐ-UBND", senderUnit: "UBND TP. Hải Phòng",
    subject: "Tranh chấp quyền sử dụng đất — Nguyễn Văn Bình", arrivalAt: "18/08/2026 08:14",
    components: 3, officer: "Phạm Quốc Hưng", status: "can-xu-ly", priority: true },
  { packageId: "HCTP-2026-0040", sourceDocNo: "102/TB-TAND", senderUnit: "TAND tỉnh Hải Dương",
    subject: "Yêu cầu ly hôn — Trần Thị Lan", arrivalAt: "17/08/2026 14:30",
    components: 2, officer: "Nguyễn Hải Trâm", status: "mot-phan", priority: false },
  { packageId: "HCTP-2026-0039", sourceDocNo: "88/QĐ-STP", senderUnit: "Sở Tư pháp TP. Hải Phòng",
    subject: "Tranh chấp hợp đồng vay — Công ty TNHH ABC", arrivalAt: "17/08/2026 09:00",
    components: 4, officer: "Phạm Quốc Hưng", status: "mot-phan", priority: false },
  { packageId: "HCTP-2026-0038", sourceDocNo: "76/QĐ-UBND", senderUnit: "UBND huyện Thủy Nguyên",
    subject: "Khiếu kiện hành chính — Lê Minh Tuấn", arrivalAt: "16/08/2026 15:45",
    components: 2, officer: "Phạm Quốc Hưng", status: "hoan-tat", priority: false },
  { packageId: "HCTP-2026-0037", sourceDocNo: "70/QĐ-TAND", senderUnit: "TAND quận Hải An",
    subject: "Yêu cầu thi hành án — Vũ Thu Hà", arrivalAt: "15/08/2026 10:20",
    components: 1, officer: "Nguyễn Hải Trâm", status: "hoan-tat", priority: false },
];

const VBDH_STATUS_META = {
  "can-xu-ly": { label: "Cần xử lý", cls: "bg-[#fff4db] text-[#8b5e00] border-[#f5c842]" },
  "mot-phan":  { label: "Một phần", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#a9c9f4]" },
  "hoan-tat":  { label: "Hoàn tất",  cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#81c784]" },
};

const PanelLienThong = () => {
  const [activeVbdhTab, setActiveVbdhTab] = useState<"can-xu-ly"|"mot-phan"|"hoan-tat"|"all">("can-xu-ly");
  const [vbdhSearch, setVbdhSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = useMemo(() => {
    const q = vbdhSearch.trim().toLowerCase();
    return VBDH_SAMPLE.filter(p => {
      const matchTab = activeVbdhTab === "all" || p.status === activeVbdhTab;
      const matchQ = !q || [p.packageId, p.sourceDocNo, p.senderUnit, p.subject, p.officer]
        .some(s => s.toLowerCase().includes(q));
      return matchTab && matchQ;
    });
  }, [activeVbdhTab, vbdhSearch, refreshKey]);

  const counts = useMemo(() => ({
    "can-xu-ly": VBDH_SAMPLE.filter(p => p.status === "can-xu-ly").length,
    "mot-phan":  VBDH_SAMPLE.filter(p => p.status === "mot-phan").length,
    "hoan-tat":  VBDH_SAMPLE.filter(p => p.status === "hoan-tat").length,
    all:         VBDH_SAMPLE.length,
  }), [refreshKey]);

  const tabs: { key: typeof activeVbdhTab; label: string }[] = [
    { key: "can-xu-ly", label: `Cần xử lý (${counts["can-xu-ly"]})` },
    { key: "mot-phan",  label: `Một phần (${counts["mot-phan"]})` },
    { key: "hoan-tat",  label: `Hoàn tất (${counts["hoan-tat"]})` },
    { key: "all",       label: `Tất cả (${counts.all})` },
  ];

  return (
    <div className="bg-white border border-[#ddd] rounded-[3px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-r from-[#8b1a1a] to-[#a83232] text-white">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-wide">Tiếp nhận đơn liên thông</span>
          {counts["can-xu-ly"] > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-[#FAB01C] text-[#3d2800] text-[11px] font-bold rounded-full">
              {counts["can-xu-ly"]}
            </span>
          )}
          <span className="text-[11px] text-[#ffd8d8] font-normal">— gói từ Văn bản điều hành</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshKey(k => k + 1); }}
            title="Làm mới danh sách"
            className="flex items-center gap-1 h-[26px] px-2.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium rounded-[3px] border border-white/30 transition-colors"
          >
            <RefreshCw size={11} /> Làm mới
          </button>

      {/* Stat bar */}
<>
        <div className="flex items-center gap-0 border-b border-[#eee] bg-[#fafafa]">
          {[
            { label: "Cần xử lý", count: counts["can-xu-ly"], color: "#8b1a1a", bg: "#fef2f2" },
            { label: "Một phần",  count: counts["mot-phan"],  color: "#1a5a96", bg: "#f0f6ff" },
            { label: "Hoàn tất",  count: counts["hoan-tat"],  color: "#1b5e20", bg: "#f0faf2" },
            { label: "Tổng gói",  count: counts.all,          color: "#333",    bg: "#f5f5f5" },
          ].map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center py-2 border-r border-[#eee] last:border-r-0"
              style={{ background: s.bg }}>
              <span className="text-[18px] font-bold leading-none" style={{ color: s.color }}>{s.count}</span>
              <span className="text-[10px] text-[#888] mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

<>
        <>
          {/* Note */}
          <div className="flex items-start gap-2 px-3 py-2 bg-[#fffbf0] border-b border-[#f5e4b2] text-[11px] text-[#7a5e00]">
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5 text-[#d49e00]" />
            <span>
              Gói VBDH là giao dịch nguồn, không đồng nghĩa với một đơn. Kết quả được ghi theo từng thành phần và tổng hợp ở cấp gói.
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-end border-b border-[#ddd] px-3 pt-1 gap-0">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveVbdhTab(t.key)}
                className={`px-3 py-[6px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeVbdhTab === t.key
                    ? "border-[#8b1a1a] text-[#8b1a1a]"
                    : "border-transparent text-[#555] hover:text-[#222]"
                }`}>
                {t.label}
              </button>
            ))}
            {/* Search */}
            <div className="ml-auto flex items-center gap-1 pb-1">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#aaa]" />
                <input
                  value={vbdhSearch}
                  onChange={e => setVbdhSearch(e.target.value)}
                  placeholder="Tìm mã gói, số đơn, người gửi..."
                  className="h-[26px] pl-6 pr-2 text-[11.5px] border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a] w-[220px]"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr>
                  {["Ưu tiên", "Mã gói / Phiên bản", "Số VB nguồn / Đơn vị gửi", "Nội dung", "Ngày đến", "Thành phần", "Cán bộ NV", "Trạng thái", "Thao tác"].map(h => (
                    <th key={h} className="text-left px-2.5 py-2 bg-[#f5f5f5] border-b border-[#ddd] text-[11px] font-semibold text-[#555] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-3 py-6 text-center text-[#aaa] italic text-[12px]">
                    Không có gói nào phù hợp.
                  </td></tr>
                ) : filtered.map(pkg => {
                  const sm = VBDH_STATUS_META[pkg.status];
                  return (
                    <tr key={pkg.packageId} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6] cursor-pointer">
                      <td className="px-2.5 py-2 text-center">
                        {pkg.priority
                          ? <span className="inline-flex items-center justify-center w-[18px] h-[18px] bg-[#8b1a1a] text-white text-[10px] font-bold rounded-sm">!</span>
                          : <span className="text-[#ddd]">—</span>}
                      </td>
                      <td className="px-2.5 py-2">
                        <span className="font-semibold text-[#1a5a96]">{pkg.packageId}</span>
                      </td>
                      <td className="px-2.5 py-2">
                        <div className="font-medium text-[#222]">{pkg.sourceDocNo}</div>
                        <div className="text-[10.5px] text-[#888] mt-0.5">{pkg.senderUnit}</div>
                      </td>
                      <td className="px-2.5 py-2 max-w-[220px]">
                        <span className="line-clamp-2 text-[#333]">{pkg.subject}</span>
                      </td>
                      <td className="px-2.5 py-2 whitespace-nowrap text-[#555]">{pkg.arrivalAt}</td>
                      <td className="px-2.5 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-[22px] h-[22px] bg-[#f0f0f0] text-[#555] text-[11px] font-semibold rounded-full">
                          {pkg.components}
                        </span>
                      </td>
                      <td className="px-2.5 py-2 whitespace-nowrap">
                        <span className={pkg.officer === "Chưa giao" ? "text-[#aaa] italic" : "text-[#333]"}>
                          {pkg.officer}
                        </span>
                      </td>
                      <td className="px-2.5 py-2">
                        <span className={`inline-flex items-center px-2 py-[2px] rounded-[10px] border text-[10.5px] font-semibold whitespace-nowrap ${sm.cls}`}>
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-2.5 py-2">
                        <div className="flex items-center gap-1">
                          <button className="h-[24px] px-2 border border-[#ddd] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[11px] font-medium transition-colors whitespace-nowrap">
                            Chi tiết
                          </button>
                          {pkg.status === "can-xu-ly" && (
                            <button className="h-[24px] px-2 border border-[#8b1a1a] bg-[#8b1a1a] text-white hover:bg-[#7a1616] rounded-[3px] text-[11px] font-medium transition-colors whitespace-nowrap">
                              Tiếp nhận
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#eee] bg-[#fafafa]">
            <span className="text-[11.5px] text-[#888]">Tìm thấy <b className="text-[#333]">{filtered.length}</b> gói</span>
            <button className="text-[11.5px] text-[#1a5a96] hover:underline font-medium">
              Xem toàn bộ danh sách liên thông →
            </button>
          </div>
        </>
    </div>
  );
};

