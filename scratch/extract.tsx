type DonTrangThai = "cho-phan-cong" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoTiepNhan: string;
  trangThai: DonTrangThai;
  nguon: DonNguon;
  coDonLienQuan: boolean;
  donLienQuan?: { maDon: string; quanHe: string }[];
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyß╗àn V─ân B├¼nh",
    hinhThucDon: "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng", loaiAn: "H├ánh ch├¡nh", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [
      { maDon: "001025", quanHe: "Tr├╣ng sß╗æ/ng├áy BA, Q─É" },
      { maDon: "000876", quanHe: "Tr├╣ng ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín" },
    ],
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trß║ºn Thß╗ï Lan",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "D├ón sß╗▒", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "L├¬ Minh Tuß║Ñn",
    hinhThucDon: "Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t", loaiAn: "H├¼nh sß╗▒", canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng",
    trangThai: "da-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "V┼⌐ Thu H├á",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "Lao ─æß╗Öng", canBoTiepNhan: "Nguyß╗àn Hß║úi Tr├óm",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "C├│ y├¬u cß║ºu bß╗ò sung tr╞░ß╗¢c ─æ├│" }],
  },
  {
    maDon: "001250", ngayTiepNhan: "16/08/2026 10:20", nguoiLamDon: "C├┤ng ty TNHH ABC",
    hinhThucDon: "CV kiß║┐n nghß╗ï G─ÉT-TT", loaiAn: "Kinh doanh th╞░╞íng mß║íi", canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Ho├áng V─ân Nam",
    hinhThucDon: "CV chuyß╗ân ─æ╞ín", loaiAn: "H├ánh ch├¡nh", canBoTiepNhan: "Nguyß╗àn Hß║úi Tr├óm",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false,
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "─Éß║╖ng B├¡ch Ngß╗ìc",
    hinhThucDon: "─É╞ín kh├íc", loaiAn: "D├ón sß╗▒", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false,
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "V├╡ Quang Huy",
    hinhThucDon: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", loaiAn: "Kinh doanh th╞░╞íng mß║íi", canBoTiepNhan: "Trß║ºn V─ân Minh",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyß╗àn Thß╗ï Ph╞░╞íng",
    hinhThucDon: "CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT", loaiAn: "Lao ─æß╗Öng", canBoTiepNhan: "Ch╞░a ph├ón c├┤ng",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Li├¬n quan ─æß║┐n ─æ╞ín cß╗ºa c├┤ng ty TNHH ABC" }]
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "L├╜ ─Éß╗⌐c Trß╗ìng",
    hinhThucDon: "T├ái liß╗çu chß╗⌐ng cß╗⌐", loaiAn: "H├¼nh sß╗▒", canBoTiepNhan: "L├¬ Thß╗ï Hoa",
    trangThai: "da-phan-cong", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "T├ái liß╗çu bß╗ò sung cho vß╗Ñ L├¬ Minh Tuß║Ñn" }]
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; cls: string }> = {
  "cho-phan-cong": { label: "Chß╗¥ ph├ón c├┤ng", cls: "bg-[#fff4db] text-[#8b5e00] border-[#f5c842]" },
  "da-phan-cong":  { label: "─É├ú ph├ón c├┤ng",  cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#a9c9f4]" },
  "cho-xu-ly":     { label: "Chß╗¥ xß╗¡ l├╜",     cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#81c784]" },
  "tra-lai":       { label: "Trß║ú lß║íi",        cls: "bg-[#fdecea] text-[#8b1a1a] border-[#f5a3a3]" },
};

const NGUON_META_LT: Record<DonNguon, { label: string; cls: string }> = {
  VBDH: { label: "Hß╗ç thß╗æng v─ân bß║ún ─æiß╗üu h├ánh", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  DVTT: { label: "Cß╗òng dß╗ïch vß╗Ñ t╞░ ph├íp", cls: "bg-[#fce8e8] text-[#c92a2a] border-[#f8caca]" },
  DVC: { label: "Cß╗òng DVC Quß╗æc gia", cls: "bg-[#e6f4ea] text-[#1e8e3e] border-[#cce8d6]" },
  BuuDien: { label: "─É╞░ß╗¥ng b╞░u ─æiß╗çn", cls: "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]" },
  TrucTiep: { label: "Nß╗Öp trß╗▒c tiß║┐p", cls: "bg-[#f3e5f5] text-[#4a148c] border-[#e1bee7]" },
};

const CAN_BO_LIST_LT = ["Phß║ím Quß╗æc H╞░ng", "Nguyß╗àn Hß║úi Tr├óm", "Trß║ºn V─ân Minh", "L├¬ Thß╗ï Hoa"];

const PanelLienThong = ({ onChiTiet, currentRole = "can-bo" }: { onChiTiet?: (don: DonTiepNhan) => void, currentRole?: string }) => {
  const isTruongPhong = currentRole === "truong-phong";
  type TabKey = "tat-ca" | DonTrangThai;
  const [activeTab, setActiveTab] = useState<TabKey>(currentRole === "truong-phong" ? "tat-ca" : "cho-xu-ly");
  useEffect(() => { if (!isTruongPhong && (activeTab === "tat-ca" || activeTab === "cho-phan-cong" || activeTab === "da-phan-cong")) setActiveTab("cho-xu-ly"); }, [isTruongPhong]);
  const [rows, setRows] = useState(DON_SAMPLE);
  const [showDanhSachCanBo, setShowDanhSachCanBo] = useState(false);
  const [selectedCanBoPopup, setSelectedCanBoPopup] = useState(CAN_BO_LIST_LT[0]);

  const assignmentCounts = rows.reduce((acc, r) => {
    if (r.canBoTiepNhan && r.canBoTiepNhan !== "Ch╞░a ph├ón c├┤ng" && r.trangThai !== "tra-lai") {
      acc[r.canBoTiepNhan] = (acc[r.canBoTiepNhan] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  // Advanced filter state
  const [fNguon, setFNguon] = useState("");
  const [fNgayTu, setFNgayTu] = useState("");
  const [fNgayDen, setFNgayDen] = useState("");
  const [fNguoiDon, setFNguoiDon] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fCanBo, setFCanBo] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");

  // Popup state
  const [donLienQuanPopup, setDonLienQuanPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongAutoPopup, setPhanCongAutoPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongChiDinhPopup, setPhanCongChiDinhPopup] = useState<DonTiepNhan | null>(null);
  const [thayDoiPopup, setThayDoiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiPopup, setTraLaiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiLyDo, setTraLaiLyDo] = useState("");
  const [traLaiGhiChu, setTraLaiGhiChu] = useState("");
  const [chonCanBo, setChonCanBo] = useState("");
  const [phanCongResult] = useState({ canBo: "Nguyß╗àn Hß║úi Tr├óm", tyLe: "18%", uuTien: "C├│ BA/Q─É li├¬n quan ─æ├ú ─æ╞░ß╗úc c├ín bß╗Ö xß╗¡ l├╜" });

  const counts = useMemo(() => ({
    "tat-ca":        DON_SAMPLE.length,
    "cho-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "cho-phan-cong").length,
    "da-phan-cong":  DON_SAMPLE.filter(d => d.trangThai === "da-phan-cong").length,
    "cho-xu-ly":     DON_SAMPLE.filter(d => d.trangThai === "cho-xu-ly").length,
    "tra-lai":       DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
  }), [refreshKey]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "tat-ca",        label: `Tß║Ñt cß║ú (${counts["tat-ca"]})` },
    { key: "cho-phan-cong", label: `Chß╗¥ ph├ón c├┤ng (${counts["cho-phan-cong"]})` },
    { key: "da-phan-cong",  label: `─É├ú ph├ón c├┤ng (${counts["da-phan-cong"]})` },
    { key: "cho-xu-ly",     label: `Chß╗¥ xß╗¡ l├╜ (${counts["cho-xu-ly"]})` },
    { key: "tra-lai",       label: `Trß║ú lß║íi (${counts["tra-lai"]})` },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      if (activeTab !== "tat-ca" && d.trangThai !== activeTab) return false;
      if (fNguon && d.nguon !== fNguon) return false;
      if (fHinhThuc && d.hinhThucDon !== fHinhThuc) return false;
      if (fLoaiAn && d.loaiAn !== fLoaiAn) return false;
      if (fCanBo && d.canBoTiepNhan !== fCanBo) return false;
      if (fTrangThai && d.trangThai !== fTrangThai) return false;
      if (fNguoiDon && !d.nguoiLamDon.toLowerCase().includes(fNguoiDon.toLowerCase())) return false;
      if (q && ![d.maDon, d.nguoiLamDon, d.canBoTiepNhan].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, activeTab, search, fNguon, fHinhThuc, fLoaiAn, fCanBo, fTrangThai, fNguoiDon, refreshKey]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(d => d.maDon)));
  };

  const resetAdvanced = () => {
    setFNguon(""); setFNgayTu(""); setFNgayDen(""); setFNguoiDon("");
    setFHinhThuc(""); setFLoaiAn(""); setFCanBo(""); setFTrangThai("");
  };

  return (
    <div className="bg-white border border-[#ddd] rounded-[3px] overflow-hidden">
      {/* Popup: ─æ╞ín li├¬n quan */}
      {donLienQuanPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setDonLienQuanPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[480px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">─É╞ín li├¬n quan</div>
              <button onClick={() => setDonLienQuanPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            <div className="p-4">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-[#eee]">
                    {["─É╞ín", "Quan hß╗ç"].map(h => <th key={h} className="text-left px-2 py-2 text-[11px] font-semibold text-[#555] bg-[#fafafa]">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(donLienQuanPopup.donLienQuan ?? []).map(dl => (
                    <tr key={dl.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]">
                      <td className="px-2 py-2 font-semibold text-[#1a5a96] cursor-pointer hover:underline">{dl.maDon}</td>
                      <td className="px-2 py-2 text-[#555]">{dl.quanHe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Popup: ph├ón c├┤ng tß╗▒ ─æß╗Öng */}
      {phanCongAutoPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongAutoPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Kß║┐t quß║ú ph├ón c├┤ng</div>
              <button onClick={() => setPhanCongAutoPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-[#888]">─É╞ín:</div><div className="font-semibold text-[#1d2e4f]">{phanCongAutoPopup.maDon}</div>
                <div className="text-[#888]">C├ín bß╗Ö ─æ╞░ß╗úc ph├ón c├┤ng:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.canBo}</div>
                <div className="text-[#888]">Tß╗╖ lß╗ç ph├ón c├┤ng hiß╗çn tß║íi:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.tyLe}</div>
              </div>
              <div className="px-3 py-2 bg-[#fffbf0] border border-[#f5c842] rounded-[3px] text-[11px] text-[#7a5e00]">
                ╞»u ti├¬n: {phanCongResult.uuTien}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongAutoPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hß╗ºy</button>
                <button onClick={() => {
                  setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? { ...r, canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng", trangThai: "da-phan-cong" } : r));
                  setSelectedIds(new Set());
                  setPhanCongAutoPopup(null);
                }} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">X├íc nhß║¡n ph├ón c├┤ng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: ph├ón c├┤ng chß╗ë ─æß╗ïnh */}
      {phanCongChiDinhPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongChiDinhPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Chß╗ìn c├ín bß╗Ö tiß║┐p nhß║¡n</div>
              <button onClick={() => setPhanCongChiDinhPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">C├ín bß╗Ö HCTP</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">ΓÇö Chß╗ìn c├ín bß╗Ö HCTP ΓÇö</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (─Éang xß╗¡ l├╜: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="px-3 py-2 bg-[#f5f5f5] border border-[#eee] rounded-[3px] text-[11px] text-[#555]">
                Tß╗╖ lß╗ç ph├ón c├┤ng hiß╗çn tß║íi: Phß║ím Quß╗æc H╞░ng 22% | Nguyß╗àn Hß║úi Tr├óm 18% | Trß║ºn V─ân Minh 32% | L├¬ Thß╗ï Hoa 28%
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hß╗ºy</button>
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">X├íc nhß║¡n</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: thay ─æß╗òi ph├ón c├┤ng */}
      {thayDoiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setThayDoiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Thay ─æß╗òi ph├ón c├┤ng</div>
              <button onClick={() => setThayDoiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="text-[#555]">C├ín bß╗Ö hiß╗çn tß║íi: <span className="font-semibold text-[#1d2e4f]">{thayDoiPopup.canBoTiepNhan}</span></div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">C├ín bß╗Ö mß╗¢i</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">ΓÇö Chß╗ìn c├ín bß╗Ö HCTP ΓÇö</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (─Éang xß╗¡ l├╜: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hß╗ºy</button>
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">X├íc nhß║¡n</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: trß║ú lß║íi */}
      {traLaiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setTraLaiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[440px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Trß║ú lß║íi ─æ╞ín</div>
              <button onClick={() => setTraLaiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">L├╜ do trß║ú lß║íi <span className="text-[#8b1a1a]">*</span></div>
                <select value={traLaiLyDo} onChange={e => setTraLaiLyDo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">ΓÇö Chß╗ìn l├╜ do ΓÇö</option>
                  <option>Nhiß╗üu ─æ╞ín kh├íc bß║ún ├ín trong c├╣ng b├¼ ΓÇô y├¬u cß║ºu V─ân th╞░ t├ích ─æ╞ín</option>
                  <option>Thiß║┐u hß╗ô s╞í, t├ái liß╗çu ─æ├¡nh k├¿m</option>
                  <option>Kh├┤ng thuß╗Öc thß║⌐m quyß╗ün giß║úi quyß║┐t</option>
                  <option>L├╜ do kh├íc</option>
                </select>
              </div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Ghi ch├║</div>
                <textarea value={traLaiGhiChu} onChange={e => setTraLaiGhiChu(e.target.value)}
                  placeholder="Nhß║¡p nß╗Öi dung..."
                  className="w-full text-[12px] px-2 py-1.5 border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a] resize-none h-[64px]" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hß╗ºy</button>
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">X├íc nhß║¡n trß║ú lß║íi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div>
          <div className="text-[11px] text-[#888] mb-0.5">Quß║ún l├╜ ─æ╞ín / <span className="font-medium text-[#555]">Tiß║┐p nhß║¡n & ph├ón c├┤ng ─æ╞ín</span></div>
          <div className="text-[15px] font-bold text-[#1d2e4f]">Tiß║┐p nhß║¡n & ph├ón c├┤ng ─æ╞ín</div>
        </div>
        <div className="flex items-center gap-2">
          {isTruongPhong && (
            <button onClick={() => setShowDanhSachCanBo(true)}
              className="h-[28px] px-3 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium hover:bg-[#f0f6ff] transition-colors">
              Danh s├ích c├ín bß╗Ö
            </button>
          )}

          <button onClick={() => setRefreshKey(k => k + 1)}
            className="h-[28px] px-3 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1.5">
            <RefreshCw size={11} /> L├ám mß╗¢i
          </button>
        </div>
      </div>

      {showDanhSachCanBo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowDanhSachCanBo(false)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[900px] h-[600px] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between bg-[#fcfcfc] shrink-0">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Kiß╗âm so├ít tß║úi l╞░ß╗úng c├ín bß╗Ö tiß║┐p nhß║¡n</div>
              <button onClick={() => setShowDanhSachCanBo(false)} className="text-[#aaa] hover:text-[#333] text-[16px]">├ù</button>
            </div>
            
            <div className="flex-1 flex min-h-0">
              {/* Left pane: Danh s├ích c├ín bß╗Ö */}
              <div className="w-[280px] border-r border-[#ddd] flex flex-col bg-[#fafafa]">
                <div className="px-3 py-2 border-b border-[#ddd] font-semibold text-[12px] text-[#555]">Danh s├ích c├ín bß╗Ö</div>
                <div className="flex-1 overflow-y-auto">
                  {CAN_BO_LIST_LT.map(cb => {
                    const count = assignmentCounts[cb] || 0;
                    const isSelected = selectedCanBoPopup === cb;
                    return (
                      <div key={cb} 
                        onClick={() => setSelectedCanBoPopup(cb)}
                        className={`px-3 py-2.5 border-b border-[#eee] cursor-pointer flex justify-between items-center transition-colors
                          ${isSelected ? 'bg-[#e8f0fe] border-l-4 border-l-[#1a5a96]' : 'hover:bg-white border-l-4 border-l-transparent'}`}>
                        <div className="font-medium text-[12px] text-[#333]">{cb}</div>
                        <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[3px] ${count > 0 ? 'bg-[#1a5a96] text-white' : 'bg-[#e0e0e0] text-[#555]'}`}>
                          {count} ─æ╞ín
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right pane: Chi tiß║┐t ─æ╞ín */}
              <div className="flex-1 flex flex-col bg-white min-w-0">
                <div className="px-4 py-2 border-b border-[#ddd] font-semibold text-[12px] text-[#555] bg-white z-10 shadow-sm shrink-0 flex items-center justify-between">
                  <span>Chi tiß║┐t ─æ╞ín ─æang giß║úi quyß║┐t</span>
                  <span className="text-[#1a5a96] font-bold bg-[#f0f6ff] px-2 py-0.5 rounded-[4px]">{selectedCanBoPopup}</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-white">
                  {(() => {
                    const cbRows = rows.filter(r => r.canBoTiepNhan === selectedCanBoPopup && r.trangThai !== "tra-lai");
                    if (cbRows.length === 0) {
                      return <div className="text-[#888] italic text-[12px] text-center mt-10">C├ín bß╗Ö hiß╗çn kh├┤ng giß║úi quyß║┐t ─æ╞ín n├áo.</div>;
                    }
                    return (
                      <table className="w-full text-[11.5px] border-collapse">
                        <thead>
                          <tr className="bg-[#fcfcfc] sticky top-0 z-10 border-b border-[#eee]">
                            <th className="px-3 py-2 text-left font-semibold text-[#555] w-[40px]">STT</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Ng╞░ß╗¥i l├ám ─æ╞ín</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">M├ú ─æ╞ín</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">H├¼nh thß╗⌐c ─æ╞ín</th>
                            <th className="px-3 py-2 text-left font-semibold text-[#555]">Loß║íi ├ín</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cbRows.map((r, i) => (
                            <tr key={r.maDon} className="border-b border-[#f5f5f5] hover:bg-[#f9f9f9]">
                              <td className="px-3 py-2 text-center text-[#888]">{i + 1}</td>
                              <td className="px-3 py-2 font-bold text-[#333]">{r.nguoiLamDon}</td>
                              <td className="px-3 py-2 text-[#1a5a96] font-medium">{r.maDon}</td>
                              <td className="px-3 py-2">
                                <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#f5f5f5] text-[#555] border border-[#ddd]">
                                  {r.hinhThucDon}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">
                                  {r.loaiAn}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Tabs */}
      <div className="flex items-end border-b border-[#ddd] px-4 pt-0.5 gap-0 bg-white">
        {tabs.filter(t => isTruongPhong || (t.key !== "tat-ca" && t.key !== "cho-phan-cong" && t.key !== "da-phan-cong")).map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedIds(new Set()); }}
            className={`px-3.5 py-[8px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
              activeTab === t.key
                ? "border-[#8b1a1a] text-[#8b1a1a]"
                : "border-transparent text-[#555] hover:text-[#222]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="T├¼m theo sß╗æ ─æß║┐n, m├ú ─æ╞ín, ng╞░ß╗¥i l├ám ─æ╞ín..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a]" />
          </div>
          <button onClick={() => setShowAdvanced(v => !v)}
            className={`h-[30px] px-3 border rounded-[3px] text-[11.5px] transition-colors ${showAdvanced ? "border-[#8b1a1a] text-[#8b1a1a] bg-[#fdeaea]" : "border-[#ddd] text-[#555] bg-white hover:bg-[#f5f5f5]"}`}>
            N├óng cao
          </button>
          <button className="h-[30px] px-3 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616] transition-colors">
            T├¼m kiß║┐m
          </button>
          <button onClick={() => { setSearch(""); resetAdvanced(); }}
            className="h-[30px] px-3 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5] transition-colors">
            ─Éß║╖t lß║íi
          </button>
        </div>

        {/* Advanced filter */}
        {showAdvanced && (
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {[
              { label: "Nguß╗ôn tiß║┐p nhß║¡n", el: <select value={fNguon} onChange={e => setFNguon(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tß║Ñt cß║ú</option><option>VBDH</option><option>DVTT</option><option>DVC</option></select> },
              { label: "Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", el: <input value={fNguoiDon} onChange={e => setFNguoiDon(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" placeholder="Nhß║¡p t├¬n..." /> },
              { label: "Ng├áy tiß║┐p nhß║¡n tß╗½", el: <input type="date" value={fNgayTu} onChange={e => setFNgayTu(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" /> },
              { label: "─Éß║┐n ng├áy", el: <input type="date" value={fNgayDen} onChange={e => setFNgayDen(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]" /> },
              { label: "H├¼nh thß╗⌐c ─æ╞ín", el: <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tß║Ñt cß║ú</option><optgroup label="ΓÇö ─É╞ín"><option value="─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT">1. ─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT</option><option value="─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng">2. ─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng</option><option value="Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t">3. Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t</option><option value="─É╞ín kh├íc">4. ─É╞ín kh├íc</option></optgroup><optgroup label="ΓÇö C├┤ng v─ân"><option value="CV kiß║┐n nghß╗ï G─ÉT-TT">1. CV kiß║┐n nghß╗ï G─ÉT-TT</option><option value="CV chuyß╗ân ─æ╞ín">2. CV chuyß╗ân ─æ╞ín</option><option value="CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT">3. CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT</option><option value="CV kh├íc">4. CV kh├íc</option></optgroup><optgroup label="ΓÇö T├ái liß╗çu"><option value="T├ái liß╗çu chß╗⌐ng cß╗⌐">T├ái liß╗çu chß╗⌐ng cß╗⌐</option></optgroup></select> },
              { label: "Loß║íi ├ín", el: <select value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tß║Ñt cß║ú</option><option>H├ánh ch├¡nh</option><option>D├ón sß╗▒</option><option>H├¼nh sß╗▒</option><option>Lao ─æß╗Öng</option><option>Kinh doanh th╞░╞íng mß║íi</option></select> },
              { label: "C├ín bß╗Ö tiß║┐p nhß║¡n", el: <select value={fCanBo} onChange={e => setFCanBo(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tß║Ñt cß║ú</option>{CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb}</option>)}</select> },
              { label: "Trß║íng th├íi", el: <select value={fTrangThai} onChange={e => setFTrangThai(e.target.value)} className="w-full h-[28px] px-2 border border-[#ddd] rounded-[3px] text-[11.5px] focus:outline-none focus:border-[#8b1a1a]"><option value="">Tß║Ñt cß║ú</option><option value="cho-phan-cong">Chß╗¥ ph├ón c├┤ng</option><option value="da-phan-cong">─É├ú ph├ón c├┤ng</option><option value="cho-xu-ly">Chß╗¥ xß╗¡ l├╜</option><option value="tra-lai">Trß║ú lß║íi</option></select> },
            ].map(({ label, el }) => (
              <div key={label}>
                <div className="text-[10px] text-[#888] mb-0.5">{label}</div>
                {el}
              </div>
            ))}
          </div>
        )}
      </div>

            {isTruongPhong && (activeTab === "cho-phan-cong" || activeTab === "da-phan-cong") && (
        <div className="flex items-center justify-end gap-2 px-3 pb-2 pt-2 border-b border-[#ddd] bg-white">
          <button onClick={() => {
            if (selectedIds.size === 0) { alert("Vui l├▓ng chß╗ìn ├¡t nhß║Ñt mß╗Öt ─æ╞ín ─æß╗â ph├ón c├┤ng"); return; }
            setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? { ...r, canBoTiepNhan: "Phß║ím Quß╗æc H╞░ng", trangThai: "da-phan-cong" } : r));
            setSelectedIds(new Set());
          }}
            className="h-[28px] px-3 bg-[#1a5a96] text-white rounded-[3px] text-[11.5px] font-medium hover:bg-[#154b7e] transition-colors">
            Ph├ón c├┤ng tß╗▒ ─æß╗Öng
          </button>
          
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              if (selectedIds.size === 0) { alert("Vui l├▓ng chß╗ìn ├¡t nhß║Ñt mß╗Öt ─æ╞ín ─æß╗â ph├ón c├┤ng"); return; }
              setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? {
                ...r,
                canBoTiepNhan: val,
                trangThai: "da-phan-cong"
              } : r));
              setSelectedIds(new Set());
            }}
            className="w-[180px] h-[28px] px-2 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium focus:outline-none cursor-pointer"
          >
            <option value="" disabled hidden>Ph├ón c├┤ng chß╗ë ─æß╗ïnh...</option>
            {CAN_BO_LIST_LT.map(cb => {
                const count = assignmentCounts[cb] || 0;
                return <option key={cb} value={cb}>{cb} (─Éang xß╗¡ l├╜: {count})</option>
            })}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
              <th className="px-2.5 py-2 w-[32px]">
                <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} className="cursor-pointer" />
              </th>
              {["STT", "Nguß╗ôn", "M├ú ─æ╞ín", "Ng├áy tiß║┐p nhß║¡n", "Ng╞░ß╗¥i l├ám ─æ╞ín", "H├¼nh thß╗⌐c ─æ╞ín", "Loß║íi ├ín", "C├ín bß╗Ö tiß║┐p nhß║¡n", "Trß║íng th├íi", "Thao t├íc"].map(h => (
                <th key={h} className="text-left px-2.5 py-2 text-[11px] font-semibold text-[#555] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-[#aaa] italic text-[12px]">Kh├┤ng c├│ ─æ╞ín n├áo ph├╣ hß╗úp.</td></tr>
            ) : filtered.map((don, idx) => {
              const sm = TRANG_THAI_META[don.trangThai];
              const nm = NGUON_META_LT[don.nguon];
              return (
                <tr key={don.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]" onDoubleClick={() => onChiTiet?.(don)} title="K├¡ch ─æ├║p ─æß╗â xem chi tiß║┐t">
                  <td className="px-2.5 py-2.5 text-center">
                    <input type="checkbox" checked={selectedIds.has(don.maDon)} onChange={() => toggleSelect(don.maDon)} className="cursor-pointer" />
                  </td>
                  <td className="px-2.5 py-2.5 text-center font-medium text-[#555]">{idx + 1}</td>
                  <td className="px-2.5 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-[1px] rounded border text-[10.5px] font-medium ${nm.cls}`}>{nm.label}</span>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="font-semibold text-[#1a5a96]">{don.maDon}</div>
                    {don.coDonLienQuan && (
                      <button onClick={() => setDonLienQuanPopup(don)}
                        className="block mt-0.5 text-[9.5px] font-medium text-[#8b5e00] bg-[#fffbf0] border border-[#f5c842] rounded px-1.5 py-[1px] hover:bg-[#fff0bc] transition-colors cursor-pointer">
                        C├│ ─æ╞ín li├¬n quan
                      </button>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap text-[#555]">{don.ngayTiepNhan}</td>
                  <td className="px-2.5 py-2.5 text-[#333]">{don.nguoiLamDon}</td>
                  <td className="px-2.5 py-2.5 text-[#555]">{don.hinhThucDon}</td>
                  <td className="px-2.5 py-2.5 text-[#555]">{don.loaiAn}</td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap">
                    {isTruongPhong && (don.trangThai === "cho-phan-cong" || don.trangThai === "da-phan-cong" || don.trangThai === "cho-xu-ly") ? (
                      <select
                        value={don.canBoTiepNhan === "Ch╞░a ph├ón c├┤ng" ? "" : don.canBoTiepNhan}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRows(prev => prev.map(r => r.maDon === don.maDon ? {
                            ...r,
                            canBoTiepNhan: val || "Ch╞░a ph├ón c├┤ng",
                            trangThai: val ? "da-phan-cong" : "cho-phan-cong"
                          } : r));
                        }}
                        className="w-[140px] h-[26px] px-1 border border-[#ddd] rounded-[3px] text-[11px] focus:outline-none focus:border-[#8b1a1a]"
                      >
                        <option value="">-- Ch╞░a ph├ón c├┤ng --</option>
                        {CAN_BO_LIST_LT.map(cb => {
                           const count = assignmentCounts[cb] || 0;
                           return <option key={cb} value={cb}>{cb} ({count})</option>
                        })}
                      </select>
                    ) : (
                      <span className={don.canBoTiepNhan === "Ch╞░a ph├ón c├┤ng" ? "text-[#aaa] italic text-[11.5px]" : "text-[#333]"}>
                        {don.canBoTiepNhan}
                      </span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5">
                    <span className={`inline-flex items-center px-2 py-[2px] rounded-[10px] border text-[10.5px] font-semibold whitespace-nowrap ${sm.cls}`}>
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="flex items-center gap-1.5 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onChiTiet?.(don); }}
                        title="Chi tiß║┐t"
                        className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#555] hover:text-[#1a5a96] hover:border-[#1a5a96] hover:bg-[#f0f6ff] rounded-[3px] transition-colors">
                        <Eye size={13} />
                      </button>
                      {don.trangThai !== "tra-lai" && (
                        <button onClick={(e) => { e.stopPropagation(); setTraLaiPopup(don); }}
                          title="Trß║ú lß║íi"
                          className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#8b1a1a] hover:bg-[#fdeaea] rounded-[3px] transition-colors">
                          <CornerUpLeft size={13} />
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
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#eee] bg-[#fafafa]">
        <span className="text-[11.5px] text-[#888]">
          Hiß╗ân thß╗ï <b className="text-[#333]">{filtered.length}</b> / {rows.length} ─æ╞ín
          {selectedIds.size > 0 && <span className="ml-2 text-[#8b1a1a]">ΓÇö ─É├ú chß╗ìn {selectedIds.size}</span>}
        </span>
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ DanhSachDon screen ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const DanhSachDon = ({ onThemMoi, onBieuMau, onWordEditor, onEditRow, isTruongPhong, currentRole = "can-bo", onCreateToTrinh, onTaoVanBan, onXemVanBanDaTrinh, vanBanList, khangNghi, initialTab = 0, initialQuaHanOnly = false }: { onThemMoi: () => void; onBieuMau?: (row: typeof SAMPLE_ROWS[0], vbId?: string) => void; onWordEditor?: () => void; onEditRow?: (id: number) => void; isTruongPhong?: boolean;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  onCreateToTrinh?: (t: ToTrinh) => void;
  /** Popup "Tß║ío v─ân bß║ún & tr├¼nh k├╜" trß║ú kß║┐t quß║ú l├¬n App ─æß╗â ─æß║⌐y v├áo kho chung. */
  onTaoVanBan?: (kq: KetQuaTrinhDuyet) => void;
  /** Bß║Ñm "Xem v─ân bß║ún ─æ├ú tr├¼nh" ΓÇö sang m├án Danh s├ích v─ân bß║ún, lß╗ìc theo m├ú ─æ╞ín
   *  (chuß╗ùi rß╗ùng ngh─⌐a l├á tr├¼nh nhiß╗üu ─æ╞ín, kh├┤ng lß╗ìc theo m├ú n├áo). */
  onXemVanBanDaTrinh?: (maDon: string) => void;
  /** Kho v─ân bß║ún d├╣ng chung ΓÇö ─æß╗â biß║┐t ─æ╞ín n├áo ─æ├ú nß║▒m trong tß╗¥ tr├¼nh n├áo. */
  vanBanList?: VanBanTrinh[];
  khangNghi?: boolean;   // d├╣ng lß║íi nguy├¬n m├án Danh s├ích ─æ╞ín cho Hß╗ô s╞í kh├íng nghß╗ï
  /** Tab mß╗ƒ sß║╡n khi v├áo m├án ΓÇö d├╣ng khi ─æiß╗üu h╞░ß╗¢ng tß╗½ Trang chß╗º (panel "Ph├ón loß║íi ─æ╞ín nhß║¡n"). */
  initialTab?: number;
  /** Bß║¡t sß║╡n bß╗Ö lß╗ìc "Qu├í hß║ín giß║úi quyß║┐t" ΓÇö d├╣ng khi ─æiß╗üu h╞░ß╗¢ng tß╗½ Trang chß╗º
   *  (card "─É╞ín qu├í hß║ín giß║úi quyß║┐t"), lu├┤n ─æi k├¿m initialTab=0. */
  initialQuaHanOnly?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [fQuaHanOnly, setFQuaHanOnly] = useState(initialQuaHanOnly ?? false);
  const [showNumberingModal, setShowNumberingModal] = useState<number | null>(null);
  // Mß╗ƒ thß║│ng modal L╞░u sß╗æ v─ân bß║ún ß╗ƒ loß║íi "Y├¬u cß║ºu bß╗ò sung" cho ─æ├║ng mß╗Öt ─æ╞ín
  const [ycbsRowId, setYcbsRowId] = useState<number | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState<string>("");
  const [assignmentMode, setAssignmentMode] = useState<"none" | "ngau-nhien" | "chi-dinh">("none");
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const OFFICERS = ["Nguyß╗àn V─ân An", "Trß║ºn Thß╗ï B├¼nh", "L├¬ Thß╗ï H├á", "Phß║ím V─ân ─Éß╗⌐c", "Ho├áng Thß╗ï Thu"];
  const [rows, setRows] = useState<DanhSachDonRow[]>(SAMPLE_ROWS);

  // M├ú ─æ╞ín ΓåÆ m├┤ tß║ú v─ân bß║ún ─æang chß╗⌐a n├│. ─É╞░a thß║│ng v├áo hß╗ç thß╗æng "─æ╞ín kh├┤ng hß╗úp lß╗ç"
  // cß╗ºa popup lß║Ñy sß╗æ thay v├¼ dß╗▒ng mß╗Öt cß║únh b├ío song song vß╗¢i con sß╗æ ri├¬ng.
  const donTrungMap = useMemo(() => {
    const m: Record<string, string> = {};
    rows.forEach(r => {
      const vbs = timVanBanTheoDon(vanBanList ?? [], r.maDon);
      if (!vbs.length) return;
      // ╞»u ti├¬n bß║ún ─æ├ú c├│ sß╗æ ΓÇö cß╗Ñ thß╗â h╞ín vß╗¢i ng╞░ß╗¥i d├╣ng.
      const dd = vbs.find(v => v.soVanBan) ?? vbs[0];
      const ten = dd.soVanBan ?? "v─ân bß║ún ch╞░a cß║Ñp sß╗æ";
      m[r.maDon] = vbs.length > 1
        ? `${ten} (${TRANG_THAI_NHAN[dd.trangThai]}) v├á ${vbs.length - 1} v─ân bß║ún kh├íc`
        : `${ten} (${TRANG_THAI_NHAN[dd.trangThai]})`;
    });
    return m;
  }, [rows, vanBanList]);

  // ΓöÇΓöÇ State bß╗Ö lß╗ìc c╞í bß║ún ΓöÇΓöÇ
  const [fKeyword, setFKeyword] = useState("");
  const [fNguoiGui, setFNguoiGui] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fToaBA, setFToaBA] = useState("");
  const [fNgayNhapFrom, setFNgayNhapFrom] = useState("");
  const [fNgayNhapTo, setFNgayNhapTo] = useState("");
  // ΓöÇΓöÇ State bß╗Ö lß╗ìc n├óng cao ΓöÇΓöÇ
  const [fHinhThucNhan, setFHinhThucNhan] = useState("");
  const [fNguoiNhap, setFNguoiNhap] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  // C├íc ├┤ ß╗ƒ panel n├óng cao ch╞░a c├│ dß╗» liß╗çu ─æß╗â lß╗ìc ΓÇö gom 1 chß╗ù cho gß╗ìn
  const [advUI, setAdvUI] = useState<Record<string, string>>({});
  const ui = (k: string) => advUI[k] ?? "";
  const setUi = (k: string) => (v: string) => setAdvUI(p => ({ ...p, [k]: v }));

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const selectedPhanCongRows = rows.filter(row => selectedRows.includes(row.id) && row.isPhanCong);
  const selectedPhanCongCount = selectedPhanCongRows.length;

  const handleAssignment = (type: "ngau-nhien" | "chi-dinh") => {
    const invalidRows = selectedPhanCongRows.filter(r => r.toTrinhStatus === 'trinh_lanh_dao' || r.toTrinhStatus === 'da_ky');
    if (invalidRows.length > 0) {
      setAssignmentMode("none");
      setSelectedOfficer("");
      setAssignmentNotice("Kh├┤ng thß╗â ph├ón c├┤ng: ─É╞ín ─æ├ú nß║▒m trong tß╗¥ tr├¼nh (─æ├ú tr├¼nh l├únh ─æß║ío). Vui l├▓ng tß║ío tß╗¥ tr├¼nh thay ─æß╗òi ph├ón c├┤ng.");
      window.setTimeout(() => setAssignmentNotice(""), 4500);
      return;
    }

    if (type === "chi-dinh") {
      if (selectedRows.length === 0) {
        setAssignmentMode("none");
        setSelectedOfficer("");
        // setAssignmentNotice("Vui l├▓ng chß╗ìn ─æ╞ín tr╞░ß╗¢c khi ph├ón c├┤ng chß╗ë ─æß╗ïnh.");
        window.setTimeout(() => setAssignmentNotice(""), 4500);
        return;
      }
      if (selectedPhanCongCount === 0) {
        setAssignmentMode("none");
        setSelectedOfficer("");
        // setAssignmentNotice("Vui l├▓ng chß╗ìn ├¡t nhß║Ñt mß╗Öt ─æ╞ín ph├ón c├┤ng ─æß╗â ph├ón c├┤ng chß╗ë ─æß╗ïnh.");
        window.setTimeout(() => setAssignmentNotice(""), 4500);
        return;
      }
      setAssignmentMode("chi-dinh");
      setSelectedOfficer("");
      // setAssignmentNotice(`Chß╗ìn c├ín bß╗Ö ─æß╗â ph├ón c├┤ng chß╗ë ─æß╗ïnh cho ${selectedPhanCongCount} ─æ╞ín ─æ├ú chß╗ìn.`);
      return;
    }
    if (selectedRows.length === 0) {
      setAssignmentMode("none");
      setSelectedOfficer("");
      setAssignmentNotice("Vui l├▓ng chß╗ìn ─æ╞ín tr╞░ß╗¢c khi ph├ón c├┤ng ngß║½u nhi├¬n.");
      window.setTimeout(() => setAssignmentNotice(""), 4500);
      return;
    }
    setAssignmentMode("ngau-nhien");
    setSelectedOfficer("");
    setAssignmentNotice("Ph├ón c├┤ng ngß║½u nhi├¬n ─æ├ú ─æ╞░ß╗úc k├¡ch hoß║ít cho ─æ╞ín ─æ├ú chß╗ìn.");
    triggerNoti("Ph├ón c├┤ng ngß║½u nhi├¬n ─æ├ú ─æ╞░ß╗úc k├¡ch hoß║ít cho c├íc ─æ╞ín ─æ├ú chß╗ìn.");
    window.setTimeout(() => setAssignmentNotice(""), 4500);
  };
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showGhepDon, setShowGhepDon] = useState<number | null>(null);
  const [ghepDonChinh, setGhepDonChinh] = useState<number | null>(null);
  const [ghepSelected, setGhepSelected] = useState<GhepRow[]>([]);
  const [showTraLai, setShowTraLai] = useState(false);
  const [traLaiReason, setTraLaiReason] = useState("");
  const [showXacNhan, setShowXacNhan] = useState(false);
  // mergeState tracks per-row: pending (chß╗¥ c├ín bß╗Ö B x├íc nhß║¡n) hoß║╖c ─æ├ú gh├⌐p
  const [mergeState, setMergeState] = useState<Record<number, {
    ghepVoi?: string;
  }>>({
    // C├╣ng c├ín bß╗Ö (Ph├╣ng Tr├óm Anh): ─æ├ú gh├⌐p ngay, row 3 (7029) l├á ─æ╞ín ch├¡nh
    6: { ghepVoi: "7029" },
  });
  const [autoMergeMap, setAutoMergeMap] = useState<Record<number, string>>({});
  const [showConfirmRow, setShowConfirmRow] = useState<number | null>(null);
  const [showHuyGhep, setShowHuyGhep] = useState<number | null>(null);
  const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);
  const [showYeuCauBoSung, setShowYeuCauBoSung] = useState<number | null>(null);
  const [showDonTrung, setShowDonTrung] = useState<number | null>(null);
  const [showChuyenDon, setShowChuyenDon] = useState<number | null>(null);
  const [showHuySoThuLy, setShowHuySoThuLy] = useState<number | null>(null);
  const [showThemKetQua, setShowThemKetQua] = useState<number | null>(null);
  const [chuyenDonOfficer, setChuyenDonOfficer] = useState<string>("");
  const [chuyenDonReason, setChuyenDonReason] = useState<string>("");
  const [transferState, setTransferState] = useState<Record<number, {
    toOfficer: string;
    fromOfficer: string;
    reason: string;
    isGroup?: boolean;
    maDons?: string[];
  }>>({
    4: {
      toOfficer: "Ph├╣ng Tr├óm Anh",
      fromOfficer: "Nguyß╗àn Thß╗ï Lan",
      reason: "Chuyß╗ân giao hß╗ô s╞í do c├ín bß╗Ö c┼⌐ ─æi c├┤ng t├íc ─æß╗Öt xuß║Ñt",
      maDons: ["M├ú 7028"]
    }
  });

  /** Sinh N ─æ╞ín tr├╣ng tß╗½ ─æ╞ín gß╗æc. Mß╗ìi th├┤ng tin bß║ún ├ín giß╗» nguy├¬n ΓÇö ─æ├│ ch├¡nh l├á
   *  c├íi l├ám ch├║ng "tr├╣ng" nhau; chß╗ë m├ú ─æ╞ín, sß╗æ hiß╗çu v├á ng├áy l├á ri├¬ng.
   *  Trß║íng th├íi ─æß║╖t "─É├ú thß╗Ñ l├╜" + n╞íi chuyß╗ân "Nß╗Öi bß╗Ö" ─æß╗â c├íc ─æ╞ín n├áy ─æß╗º ─æiß╗üu kiß╗çn
   *  lß║¡p C├┤ng v─ân chuyß╗ân nß╗Öi bß╗Ö ngay (theo luß║¡t kiß╗âm tra ß╗ƒ popup lß║Ñy sß╗æ). */
  const taoDonTrung = (goc: DanhSachDonRow, dsDong: DongDonTrung[]) => {
    const maxMa = rows.reduce((m, r) => {
      const n = parseInt((r.maDon || "").replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 7000);
    const ddmmyyyy = (iso: string) => {
      if (!iso) return "";
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    };
    const moi: DanhSachDonRow[] = dsDong.map((d, i) => ({
      ...goc,
      id: Date.now() + i,
      maDon: `M├ú ${maxMa + i + 1}`,
      soHieuDon: d.soHieuDon || undefined,
      ngayNhap: ddmmyyyy(d.ngayNhan) || goc.ngayNhap,
      ngayTrenDon: ddmmyyyy(d.ngayTrenDon) || goc.ngayTrenDon,
      thongTinDon: {
        ...goc.thongTinDon,
        soCV: d.laCongVan ? d.soCV : "",
        ngayCV: d.laCongVan ? ddmmyyyy(d.ngayCV) : "",
        donViGui: d.trongNganh ? (d.donViGui || goc.thongTinDon.donViGui) : goc.thongTinDon.donViGui,
      },
      giaiQuyet: { ...goc.giaiQuyet, nhan: "─É├ú thß╗Ñ l├╜", color: "#2d4b74", coVanBan: false },
      thongTinChuyenDon: "Nß╗Öi bß╗Ö",
      trungVoiDon: goc.maDon.trim(),
      // ─É╞ín mß╗¢i sinh ch╞░a ─æi qua quy tr├¼nh n├áo cß╗ºa ─æ╞ín gß╗æc.
      toTrinhStatus: "none",
      traLai: undefined,
      processingHistory: undefined,
      daNhan: false,
    }));
    setRows(p => [...moi, ...p]);
    setShowDonTrung(null);
    triggerNoti(`─É├ú tß║ío ${moi.length} ─æ╞ín tr├╣ng tß╗½ ${goc.maDon.trim()}: ${moi.map(m => m.maDon).join(", ")}`);
  };
  const [showLuuSoVanBan, setShowLuuSoVanBan] = useState(false);
  const [showInDanhSach, setShowInDanhSach] = useState(false);
  const [historyRow, setHistoryRow] = useState<DanhSachDonRow | null>(null);
  const [trinhKyRow, setTrinhKyRow] = useState<DanhSachDonRow | null>(null);
  const [suaDon, setSuaDon] = useState(false);
  const [tachDon, setTachDon] = useState(false);
  const [tachSoDon, setTachSoDon] = useState("");
  // C├íc ─æiß╗üu kiß╗çn phß╗Ñ nß║▒m C├ÖNG khß╗æi t├¼m kiß║┐m, chß╗ë thu/mß╗ƒ chß╗⌐ kh├┤ng t├ích panel ri├¬ng
  const [moNangCao, setMoNangCao] = useState(false);
  // Mac dinh hien CA don lan ho so khang nghi; tich de chi con don
  const [chiDon, setChiDon] = useState(false);
  const [loaiVanBan, setLoaiVanBan] = useState("");
  const [loaiDon, setLoaiDon] = useState<"gdt" | "kn" | "tb">("gdt");

  // Filter specific states for conditional rendering
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fNoiChuyen, setFNoiChuyen] = useState("");
  const [fDonVi, setFDonVi] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");
  const [fThuLy, setFThuLy] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fAnTuHinhSelect, setFAnTuHinhSelect] = useState("");

  const canReturn = selectedRows.length > 0;

  const toggleRow = (id: number) =>
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  // Chß╗ìn tß║Ñt cß║ú = chß╗ìn tß║Ñt cß║ú d├▓ng ─ÉANG hiß╗ân thß╗ï, kh├┤ng phß║úi to├án bß╗Ö dß╗» liß╗çu
  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? filteredRows.map(r => r.id) : []);

  useEffect(() => {
    const groups = rows.reduce((acc: Record<string, DanhSachDonRow[]>, row) => {
      const caseKey = `${row.thongTinDon.soBaqd}|${row.ngayNhap}`;
      // ─É╞ín ─æang chß╗¥ ├╜ kiß║┐n L─É giß╗» nguy├¬n trß║íng th├íi theo kß║┐t luß║¡n cß╗ºa L─É,
      // kh├┤ng ─æß╗â nh├ún gh├⌐p ─æ╞ín tß╗▒ ─æß╗Öng ─æ├¿ l├¬n
      if (row.choYKienLD) return acc;
      if (!row.thongTinDon.soBaqd) return acc;
      // ─É╞ín sinh tß╗½ "Th├¬m ─æ╞ín tr├╣ng" KH├öNG tham gia gh├⌐p. Tr├╣ng l├á hß╗ç quß║ú cß╗ºa
      // viß╗çc gh├⌐p sau khi ─æ╞ín ─æ├ú chuyß╗ân, kh├┤ng phß║úi nguy├¬n nh├ón ΓÇö ─æß╗â ch├║ng lß╗ìt
      // v├áo nh├│m tß╗▒ gh├⌐p th├¼ nh├ún "─É├ú gh├⌐p vß╗¢iΓÇª" sß║╜ ─æ├¿ mß║Ñt trß║íng th├íi ─É├ú thß╗Ñ l├╜,
      // v├á sinh ra quan hß╗ç gh├⌐p v├▓ng giß╗»a c├íc ─æ╞ín vß╗æn ─æ├ú l├á bß║ún sao cß╗ºa nhau.
      if (row.trungVoiDon) return acc;
      acc[caseKey] = [...(acc[caseKey] || []), row];
      return acc;
    }, {});

    const nextAuto: Record<number, string> = {};
    Object.values(groups).forEach(group => {
      if (group.length <= 1) return;
      group.forEach(row => {
        const others = group.filter(r => r.id !== row.id).map(r => r.maDon).join(", ");
        nextAuto[row.id] = `─É├ú gh├⌐p vß╗¢i ${others}`;
      });
    });
    setAutoMergeMap(nextAuto);
  }, [rows]);

  // ─É╞ín thuß╗Öc tab "Chß╗¥ ├╜ kiß║┐n L─É" b├¬n m├án Nhß║¡n ─æ╞ín v├á TL vß╗Ñ ├ín: trß║íng th├íi
  // giß║úi quyß║┐t lß║Ñy theo kß║┐t luß║¡n cß╗ºa L├únh ─æß║ío. Thay ngay tß╗½ ─æ├óy ─æß╗â tab, bß╗Ö lß╗ìc
  // v├á cß╗Öt Th├┤ng tin giß║úi quyß║┐t c├╣ng ─ân theo mß╗Öt nguß╗ôn.
  const vLD = useKetLuanLD();
  const rowsLD = useMemo(() => rows.map(r => {
    if (!r.choYKienLD) return r;
    const nhan = layKetLuanLD(r.choYKienLD) ?? CHO_Y_KIEN_LD;
    return { ...r, giaiQuyet: { ...r.giaiQuyet, nhan, color: MAU_KET_LUAN_LD[nhan] } };
  }), [rows, vLD]);

  // ─É╞ín n├áo r╞íi v├áo trß║íng th├íi "Thß╗Ñ l├╜ mß╗¢i tr├╣ng TP" ΓåÆ ─æ╞ín li├¬n quan g├óy ra n├│.
  // T├¡nh tr├¬n rowsLD (─æ├ú ├íp kß║┐t luß║¡n cß╗ºa L├únh ─æß║ío) chß╗⌐ kh├┤ng phß║úi rows, ─æß╗â ─æ╞ín
  // vß╗½a ─æ╞░ß╗úc L─É kß║┐t luß║¡n "Thß╗Ñ l├╜ mß╗¢i" c┼⌐ng ─æ╞░ß╗úc ─æß╗æi chiß║┐u ngay.
  const trungTPMap = useMemo(() => {
    const m: Record<number, DanhSachDonRow> = {};
    rowsLD.forEach(r => {
      const lienQuan = donTrungThamPhan(r, rowsLD);
      if (lienQuan) m[r.id] = lienQuan;
    });
    return m;
  }, [rowsLD]);

  // ΓöÇΓöÇ Engine lß╗ìc ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  // Mß╗ìi ─æiß╗üu kiß╗çn cß╗Öng dß╗ôn vß╗¢i nhau (AND). ├ö rß╗ùng = bß╗Å qua ─æiß╗üu kiß╗çn ─æ├│.
  // T├ích khß╗Åi ─æiß╗üu kiß╗çn tab ─æß╗â sß╗æ ─æß║┐m tr├¬n tab phß║ún ├ính ─æ├║ng c├íc bß╗Ö lß╗ìc ─æang ├íp.
  const rowsByFilters = useMemo(() => rowsLD.filter(r => {
    const d = r.thongTinDon ?? ({} as DanhSachDonRow["thongTinDon"]);
    const trangThai = r.giaiQuyet?.nhan ?? "";

    // Chß╗ìn Loß║íi v─ân bß║ún l├á lß╗ìc lu├┤n theo ─æiß╗üu kiß╗çn hß╗úp lß╗ç cß╗ºa loß║íi ─æ├│ ΓÇö c├╣ng
    // mß╗Öt luß║¡t vß╗¢i m├án L╞░u sß╗æ v─ân bß║ún, n├¬n v├áo modal kh├┤ng c├▓n ─æ╞ín bß╗ï gß║ích ─æß╗Å.
    if (chiDon && r.laKhangNghi) return false;

    // Bß╗Ö lß╗ìc "Qu├í hß║ín giß║úi quyß║┐t" ΓÇö bß║¡t khi v├áo tß╗½ card cß║únh b├ío ß╗ƒ Trang chß╗º.
    if (fQuaHanOnly && r.quaHanNam === undefined) return false;

    if (lyDoKhongDuocLap(r, loaiVanBan, donTrungMap[r.maDon])) return false;

    // Tß╗½ kh├│a chung ΓÇö qu├⌐t c├íc tr╞░ß╗¥ng v─ân bß║ún ─æ├íng kß╗â
    if (fKeyword) {
      const pool = [r.nguoiGui, r.diaChi, r.maDon, r.loaiHinhThuc, r.nguoiNhap,
      d.soBaqd, d.toaXetXu, d.thuTuc, d.hinhThuc, d.soCV, d.loaiCV,
      d.donViGui, d.thamPhan, d.donViGiaiQuyet, trangThai, r.giaiQuyet?.stl];
      if (!pool.some(v => contains(v, fKeyword))) return false;
    }

    if (fNguoiGui && !contains(r.nguoiGui, fNguoiGui)) return false;
    if (fSoBA && !contains(d.soBaqd, fSoBA)) return false;
    if (fToaBA && d.toaXetXu !== fToaBA) return false;
    if (!inDateRange(r.ngayNhap, fNgayNhapFrom, fNgayNhapTo)) return false;

    if (fHinhThuc) {
      const muc = chuanHoaHinhThuc(fHinhThuc);
      if (chuanHoaHinhThuc(d.hinhThuc) !== muc && chuanHoaHinhThuc(r.loaiHinhThuc) !== muc) return false;
    }
    if (fHinhThucNhan && r.hinhThucTiepNhan !== fHinhThucNhan) return false;
    if (fLoaiAn && r.loaiAn !== fLoaiAn) return false;
    if (fNguoiNhap && r.nguoiNhap !== fNguoiNhap) return false;
    if (fNoiChuyen && r.thongTinChuyenDon !== fNoiChuyen) return false;
    if (fDonVi && r.donViChuyenDen !== fDonVi) return false;
    if (fNoiChuyen === "Nß╗Öi bß╗Ö" && ui("chuyenCaNhan") && r.caNhanChuyenDen !== ui("chuyenCaNhan")) return false;
    if (fThuLy && trangThai !== fThuLy) return false;
    if (!inDateRange(d.ngay, fNgayBA, fNgayBA)) return false;

    // "Trß║íng th├íi ─æ╞ín" l├á suy diß╗àn: ch╞░a ─æß╗º ─æiß╗üu kiß╗çn vs c├▓n lß║íi
    if (fTrangThai === "─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn" && trangThai !== "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn") return false;
    if (fTrangThai === "─É╞ín ─æß╗º ─æiß╗üu kiß╗çn" && trangThai === "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn") return false;

    return true;
  }), [rowsLD, chiDon, loaiVanBan, fKeyword, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fDonVi, advUI, fThuLy, fNgayBA, fTrangThai, fQuaHanOnly]);

  const filteredRows = useMemo(
    () => rowsByFilters.filter(TAB_MATCH[activeTab] ?? (() => true)),
    [rowsByFilters, activeTab]);

  // Cß╗Öt "Sß╗æ ─æ╞ín" l├á sß╗æ ─æ╞ín cß╗ºa tß╗½ng bß║ún ghi; tß╗òng cß╗ºa n├│ mß╗¢i l├á sß╗æ ─æ╞ín thß║¡t sß╗▒
  // ─æang xem. Cß╗Öng tr├¬n filteredRows n├¬n con sß╗æ lu├┤n ─ân theo bß╗Ö lß╗ìc + tab.
  const tongSoDon = useMemo(
    () => filteredRows.reduce((s, r) => s + (r.soDon ?? 0), 0),
    [filteredRows]);

  const tabs = [
    { label: "Tß╗òng sß╗æ", count: rowsByFilters.length },
    { label: "─É╞ín cß╗ºa t├┤i", count: rowsByFilters.filter(TAB_MATCH[1]).length },
    { label: "─É╞ín Thß╗Ñ l├╜", count: rowsByFilters.filter(TAB_MATCH[2]).length },
    { label: "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn", count: rowsByFilters.filter(TAB_MATCH[3]).length },
    { label: "Hß║┐t thß╗¥i hß║ín kh├íng nghß╗ï", count: rowsByFilters.filter(TAB_MATCH[4]).length },
    { label: "Kh├íc", count: rowsByFilters.filter(TAB_MATCH[5]).length },
    { label: "─É╞ín trß║ú lß║íi", count: rowsByFilters.filter(TAB_MATCH[6]).length },
  ];

  // Danh s├ích t├▓a cho ├┤ "T├▓a ra bß║ún ├ín" ΓÇö lß║Ñy tß╗½ ch├¡nh dß╗» liß╗çu
  const toaOptions = useMemo(
    () => [...new Set(rows.map(r => r.thongTinDon?.toaXetXu).filter(Boolean))].sort(),
    [rows]);

  // T├¬n c├ín bß╗Ö nhß║¡p bß╗ï tr├╣ng giß╗»a 2 ng╞░ß╗¥i kh├íc nhau ΓåÆ cß╗Öt Ng╞░ß╗¥i nhß║¡p/Sß╗¡a phß║úi
  // k├¿m ng├áy sinh th├¼ mß╗¢i ph├ón biß╗çt ─æ╞░ß╗úc.
  const tenCanBoTrungLap = useMemo(() => {
    const theoTen: Record<string, Set<string>> = {};
    const them = (ten?: string, ghiDe?: string) => {
      if (!ten) return;
      (theoTen[ten] ??= new Set()).add(ngaySinhTheoTen(ten, ghiDe));
    };
    rows.forEach(r => {
      them(r.nguoiNhap, r.nguoiNhapNgaySinh);
      them(r.nguoiSua, r.nguoiSuaNgaySinh);   // ng╞░ß╗¥i sß╗¡a c┼⌐ng c├│ thß╗â tr├╣ng t├¬n
    });
    return new Set(Object.keys(theoTen).filter(ten => theoTen[ten].size > 1));
  }, [rows]);
  const nguoiNhapOptions = useMemo(
    () => [...new Set(rows.map(r => r.nguoiNhap).filter(Boolean))].sort(),
    [rows]);

  const soBoLocDangApp = [fKeyword, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fThuLy, fNgayBA, fTrangThai, loaiVanBan].filter(Boolean).length
    + (chiDon ? 1 : 0) + (fQuaHanOnly ? 1 : 0);

  // M├┤ tß║ú bß╗Ö lß╗ìc ─æang ├íp ΓÇö in k├¿m l├¬n ─æß║ºu danh s├ích ─æß╗â biß║┐t bß║ún in lß║Ñy theo g├¼
  const moTaBoLoc = useMemo(() => {
    // Gß╗Öp cß║╖p tß╗½/─æß║┐n th├ánh mß╗Öt mß╗çnh ─æß╗ü ─æß╗ìc ─æ╞░ß╗úc thay v├¼ hai d├▓ng rß╗¥i:
    //   "Ng├áy nhß║¡p tß╗½ 01/07 ─æß║┐n 31/07" thay cho "Ng├áy nhß║¡p tß╗½: 01/07" + "Ng├áy nhß║¡p ─æß║┐n: 31/07"
    const khoang = (nhan: string, tu: string, den: string) =>
      tu && den ? `${nhan}: tß╗½ ${tu} ─æß║┐n ${den}`
        : tu ? `${nhan}: tß╗½ ${tu}`
        : den ? `${nhan}: ─æß║┐n ${den}` : "";
    return [
      activeTab > 0 ? `Nh├│m ─æ╞ín: ${tabs[activeTab]?.label ?? ""}` : "",
      fQuaHanOnly && "Chß╗ë hiß╗çn: Qu├í hß║ín giß║úi quyß║┐t",
      fKeyword && `Tß╗½ kh├│a: ${fKeyword}`,
      fNguoiGui && `Ng╞░ß╗¥i gß╗¡i: ${fNguoiGui}`,
      fSoBA && `Sß╗æ BA/Q─É: ${fSoBA}`,
      fToaBA && `T├▓a ra bß║ún ├ín: ${fToaBA}`,
      khoang("Ng├áy nhß║¡p", fNgayNhapFrom, fNgayNhapTo),
      fNgayBA && `Ng├áy bß║ún ├ín: ${fNgayBA}`,
      fHinhThuc && `H├¼nh thß╗⌐c ─æ╞ín: ${fHinhThuc}`,
      fHinhThucNhan && `H├¼nh thß╗⌐c tiß║┐p nhß║¡n: ${fHinhThucNhan}`,
      fLoaiAn && `Loß║íi ├ín: ${fLoaiAn}`,
      fNguoiNhap && `Ng╞░ß╗¥i nhß║¡p: ${fNguoiNhap}`,
      fNoiChuyen && `N╞íi chuyß╗ân ─æß║┐n: ${fNoiChuyen}`,
      fThuLy && `Thß╗Ñ l├╜ ─æ╞ín: ${fThuLy}`,
      fTrangThai && `Trß║íng th├íi ─æ╞ín: ${fTrangThai}`,
      loaiVanBan && `Loß║íi v─ân bß║ún: ${loaiVanBan}`,
    ].filter(Boolean) as string[];
  },
    [fKeyword, fNguoiGui, fSoBA, fToaBA, fNgayNhapFrom, fNgayNhapTo,
      fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap, fNoiChuyen, fThuLy,
      fNgayBA, fTrangThai, loaiVanBan, activeTab, tabs, fQuaHanOnly]);

  // Ti├¬u ─æß╗ü bß║ún in dß╗▒ng tß╗½ bß╗Ö lß╗ìc. Tab quyß║┐t ─æß╗ïnh phß║ºn l├╡i; loß║íi ├ín v├á trß║íng th├íi
  // nß╗æi th├¬m khi c├│. Bß║ún in t├ích khß╗Åi m├án h├¼nh n├¬n ti├¬u ─æß╗ü phß║úi tß╗▒ n├│i ─æ╞░ß╗úc
  // n├│ ─æang l├á danh s├ích g├¼.
  const TIEU_DE_TAB: Record<number, string> = {
    0: "DANH S├üCH ─É╞áN",
    1: "DANH S├üCH ─É╞áN Cß╗ªA T├öI",
    2: "DANH S├üCH ─É╞áN THß╗ñ L├¥",
    3: "DANH S├üCH ─É╞áN CH╞»A ─Éß╗ª ─ÉIß╗ÇU KIß╗åN",
    4: "DANH S├üCH ─É╞áN Hß║╛T THß╗£I Hß║áN KH├üNG NGHß╗è",
    5: "DANH S├üCH ─É╞áN KH├üC",
    6: "DANH S├üCH ─É╞áN TRß║ó Lß║áI",
  };
  const tieuDeIn = useMemo(() => {
    let t = khangNghi ? "DANH S├üCH Hß╗Æ S╞á KH├üNG NGHß╗è" : (TIEU_DE_TAB[activeTab] ?? "DANH S├üCH ─É╞áN");
    if (fLoaiAn) t += ` ΓÇô ├üN ${fLoaiAn.toUpperCase()}`;
    if (fTrangThai) t += ` ΓÇô ${fTrangThai.toUpperCase()}`;
    return t;
  }, [activeTab, fLoaiAn, fTrangThai, khangNghi]);

  const phuDeIn = useMemo(() => {
    const khoang = (nhan: string, tu: string, den: string) =>
      tu && den ? `${nhan} tß╗½ ${tu} ─æß║┐n ${den}`
        : tu ? `${nhan} tß╗½ ${tu}`
        : den ? `${nhan} ─æß║┐n ${den}` : "";
    const phan = [
      khoang("Ng├áy nhß║¡p", fNgayNhapFrom, fNgayNhapTo),
      fNgayBA && `Ng├áy bß║ún ├ín ${fNgayBA}`,
      selectedRows.length ? `${selectedRows.length} ─æ╞ín ─æ╞░ß╗úc chß╗ìn` : "",
    ].filter(Boolean);
    return phan.join(" ┬╖ ");
  }, [fNgayNhapFrom, fNgayNhapTo, fNgayBA, selectedRows]);

  // In danh s├ích: ╞░u ti├¬n c├íc d├▓ng ─æang t├¡ch, kh├┤ng t├¡ch th├¼ lß║Ñy to├án bß╗Ö kß║┐t quß║ú lß╗ìc
  const rowsDeIn = selectedRows.length
    ? filteredRows.filter(r => selectedRows.includes(r.id))
    : filteredRows;

  const xoaBoLoc = () => {
    setFKeyword(""); setFNguoiGui(""); setFSoBA("");
    setFToaBA(""); setFNgayNhapFrom(""); setFNgayNhapTo(""); setFHinhThuc("");
    setFHinhThucNhan(""); setFLoaiAn(""); setFNguoiNhap(""); setFNoiChuyen("");
    setFDonVi(""); setFThuLy(""); setFNgayBA(""); setFTrangThai("");
    setFAnTuHinhSelect(""); setLoaiVanBan(""); setAdvUI({}); setChiDon(false);
    setFQuaHanOnly(false);
  };

  // Sß╗æ ─æiß╗üu kiß╗çn ─æang ├íp ß╗ƒ phß║ºn thu gß╗ìn ΓÇö ─æß╗â ng╞░ß╗¥i d├╣ng biß║┐t c├│ g├¼ ─æang chß║íy ngß║ºm.
  // Ng├áy BA/Q─É, ─Éß╗ïa chß╗ë gß╗¡i ─æ╞ín/chi tiß║┐t, Trß║ú lß╗¥i ─æ╞ín giß╗¥ ─æ├ú hiß╗çn sß║╡n ß╗ƒ bß╗Ö lß╗ìc
  // c╞í bß║ún n├¬n kh├┤ng t├¡nh v├áo ─æ├óy nß╗»a ΓÇö t├¡nh sß║╜ khiß║┐n badge b├ío "c├│ ─æiß╗üu kiß╗çn
  // ß║⌐n" d├╣ ng╞░ß╗¥i d├╣ng ─æang nh├¼n thß║Ñy ngay tr├¬n m├án h├¼nh.
  const CAC_KHOA_DA_LEN_CO_BAN = new Set(["diaChiGui", "diaChiCT", "traLoiDon"]);
  const soDieuKienPhu = [fHinhThucNhan, fLoaiAn, fNguoiNhap, fNoiChuyen, fThuLy,
    fTrangThai, fDonVi, fAnTuHinhSelect]
    .concat(Object.entries(advUI).filter(([k]) => !CAC_KHOA_DA_LEN_CO_BAN.has(k)).map(([, v]) => v))
    .filter(Boolean).length;

  return (
    <div className="bg-[#eef1f5] min-h-full">
      <div className="p-3 space-y-3">

        {/* Title */}
        <h2 className="text-[15px] font-semibold text-[#222]">{khangNghi ? "Hß╗ô s╞í kh├íng nghß╗ï" : "Danh s├ích ─æ╞ín"}</h2>

        {/* Card */}
        <div className="bg-white border border-[#ddd] rounded-[3px]">

          {/* Tabs ΓÇö Hß╗ô s╞í kh├íng nghß╗ï chß╗ë c├│ mß╗Öt danh s├ích duy nhß║Ñt ΓåÆ kh├┤ng c├│ tabs. */}
          {!khangNghi && (
            <div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0">
              {tabs.map((t, i) => (
                t.label === "Kh├íc" ? null : (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"
                      }`}>
                    {t.label}
                  </button>
                )
              ))}

            </div>
          )}

          {/* "─É╞ín cß╗ºa t├┤i" filter notice */}
          {!khangNghi && activeTab === 1 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#eef1f5] border-b border-[#ddd] text-[12px] text-[#1d2e4f]">
              <Users size={13} className="flex-shrink-0" />
              <span>Hiß╗ân thß╗ï ─æ╞ín ─æ╞░ß╗úc giao cho tß║Ñt cß║ú c├ín bß╗Ö thuß╗Öc t├ái khoß║ún: <span className="font-semibold">Ph├╣ng Tr├óm Anh</span></span>
            </div>
          )}

          {/* ΓöÇΓöÇ Filter section ΓöÇΓöÇ */}
          <div className="border-b border-[#ddd] px-3 pt-3 pb-2">
            <div className="space-y-2">
              {/* Row 1 ΓÇö lu├┤n hiß╗çn, giß╗» tß╗½ kh├│a t├¼m kiß║┐m chung + h├¼nh thß╗⌐c ─æ╞ín.
                  Nh├ún b├¬n tr├íi ├┤ nhß║¡p (TRow) nh╞░ c├íc h├áng d╞░ß╗¢i, thay v├¼ nh├ún
                  nß║▒m tr├¬n. Kh├┤ng col-span ─æß╗â ─æß╗Ö rß╗Öng khß╗¢p ─æ├║ng cß╗Öt Ng╞░ß╗¥i gß╗¡i /
                  Sß╗æ BA/Q─É ß╗ƒ h├áng d╞░ß╗¢i; cß╗Öt 3 (thß║│ng h├áng ├┤ H├¼nh thß╗⌐c ─æ╞ín) giß╗¥
                  c├▓n trß╗æng n├¬n ─æß║╖t 2 checkbox v├áo ─æ├óy, c├╣ng h├áng lu├┤n. */}
              <div className="grid grid-cols-6 gap-x-7">
                <div className="col-span-2">
                  <TRow label="Tß╗½ kh├│a t├¼m kiß║┐m chung">
                    <TInp placeholder="Nhß║¡p bß║Ñt kß╗│ th├┤ng tin n├áo (ng╞░ß╗¥i gß╗¡i, nß╗Öi dung...)" value={fKeyword} onChange={e => setFKeyword(e.target.value)} />
                  </TRow>
                </div>
                <div className="col-span-2">
                  <TRow label="H├¼nh thß╗⌐c ─æ╞ín">
                    <TSel value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)}>
                      <option value="">Tß║Ñt cß║ú h├¼nh thß╗⌐c</option>{optionsHinhThucDon()}
                    </TSel>
                  </TRow>
                </div>
                <div className="col-span-2 flex flex-col justify-center gap-1 min-h-[30px]">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#333] cursor-pointer whitespace-nowrap" title="─É╞ín ─æ├ú giß║úi quyß║┐t xong tß╗½ t├▓a Cß║Ñp cao">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a] flex-shrink-0"
                      checked={ui("daGiaiQuyetCapCao") === "1"}
                      onChange={e => setUi("daGiaiQuyetCapCao")(e.target.checked ? "1" : "")} />
                    <span className="truncate">─É╞ín ─æ├ú giß║úi quyß║┐t xong tß╗½ t├▓a Cß║Ñp cao</span>
                  </label>
                  {/* Mß║╖c ─æß╗ïnh danh s├ích gß╗ôm Cß║ó ─æ╞ín v├á hß╗ô s╞í kh├íng nghß╗ï; t├¡ch ─æß╗â
                      chß╗ë c├▓n ─æ╞ín. R├║t gß╗ìn phß║ºn giß║úi th├¡ch trong ngoß║╖c th├ánh
                      tooltip (title) ─æß╗â kh├┤ng tr├án khß╗Åi cß╗Öt ΓÇö chß╗» ─æß║ºy ─æß╗º vß║½n
                      xem ─æ╞░ß╗úc khi r├¬ chuß╗Öt. */}
                  <label className="flex items-center gap-1.5 text-[11px] text-[#333] cursor-pointer whitespace-nowrap" title="Chß╗ë danh s├ích ─æ╞ín (kh├┤ng t├¡nh hß╗ô s╞í kh├íng nghß╗ï)">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a] flex-shrink-0"
                      checked={chiDon} onChange={e => setChiDon(e.target.checked)} />
                    Chß╗ë danh s├ích ─æ╞ín <span className="text-[#888]">(kh├┤ng t├¡nh...)</span>
                  </label>
                </div>
              </div>

              {/* Row 2-4 ΓÇö lu├┤n hiß╗çn, bß╗æ cß╗Ñc 6 cß╗Öt theo ─æ├║ng bß║ún mß║½u; c├íc tr╞░ß╗¥ng
                  n├áy tr╞░ß╗¢c nß║▒m trong khß╗æi "─Éiß╗üu kiß╗çn t├¼m kiß║┐m kh├íc" nay dß╗¥i l├¬n
                  ─æ├óy, kh├┤ng c├▓n lß║╖p lß║íi ß╗ƒ d╞░ß╗¢i. D├╣ng TRow/TInp cß╗í nhß╗Å (nh╞░ panel
                  n├óng cao) thay v├¼ FLbl/FInp cho gß╗ìn, ─æß╗í chiß║┐m chiß╗üu cao. */}
              <div className="grid grid-cols-6 gap-x-7 gap-y-2 mt-2">
                <TRow label="Ng╞░ß╗¥i gß╗¡i">
                  <TInp placeholder="Nhß║¡p t├¬n ng╞░ß╗¥i gß╗¡i" value={fNguoiGui} onChange={e => setFNguoiGui(e.target.value)} />
                </TRow>
                <TRow label="Sß╗æ BA/Q─É">
                  <TInp placeholder="Nhß║¡p sß╗æ bß║ún ├ín/Q─É" value={fSoBA} onChange={e => setFSoBA(e.target.value)} />
                </TRow>
                <TRow label="Ng├áy BA/Q─É">
                  <TDate value={fNgayBA} onChange={setFNgayBA} />
                </TRow>

                <TRow label="T├▓a ra BA/Q─É">
                  <TSel value={fToaBA} onChange={e => setFToaBA(e.target.value)}>
                    <option value="">Chß╗ìn t├▓a</option>{toaOptions.map(o => <option key={o} value={o}>{vietTatTAND(o)}</option>)}
                  </TSel>
                </TRow>
                <TRow label="Ng├áy nhß║¡p tß╗½">
                  <TDate value={fNgayNhapFrom} onChange={setFNgayNhapFrom} />
                </TRow>
                <TRow label="─Éß║┐n ng├áy">
                  <TDate value={fNgayNhapTo} onChange={setFNgayNhapTo} />
                </TRow>

                <div className="col-span-2">
                  <TRow label="─Éß╗ïa chß╗ë gß╗¡i ─æ╞ín">
                    <ComboNhapChon value={ui("diaChiGui")} onChange={setUi("diaChiGui")}
                      nhomGoiY={[{ nhom: "", items: TINH_TP }]}
                      placeholder="T├¼m hoß║╖c chß╗ìn tß╗ënh/huyß╗çn" chiTrongDanhMuc />
                  </TRow>
                </div>
                <div className="col-span-3">
                  <TRow label="─Éß╗ïa chß╗ë chi tiß║┐t">
                    <TInp value={ui("diaChiCT")} onChange={e => setUi("diaChiCT")(e.target.value)} />
                  </TRow>
                </div>
                <div className="col-span-1">
                  <TRow label="Trß║ú lß╗¥i ─æ╞ín">
                    <TSel value={ui("traLoiDon")} onChange={e => setUi("traLoiDon")(e.target.value)}>
                      <option value="">--- Tß║Ñt cß║ú ---</option><option>─É├ú trß║ú lß╗¥i</option><option>Ch╞░a trß║ú lß╗¥i</option>
                      <option>Ch╞░a x├íc ─æß╗ïnh</option>
                    </TSel>
                  </TRow>
                </div>
              </div>

              {/* C├íc ├┤ c├▓n lß║íi nß╗æi tiß║┐p ngay b├¬n d╞░ß╗¢i ΓÇö c├╣ng mß╗Öt khß╗æi t├¼m kiß║┐m,
                  kh├┤ng c├│ khung ri├¬ng hay ti├¬u ─æß╗ü phß╗Ñ, chß╗ë thu/mß╗ƒ cho ─æß╗í d├ái. */}
              <div className="mt-1 pt-2 border-t border-dashed border-[#e0e0e0]">
                <button onClick={() => setMoNangCao(m => !m)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a5a96] hover:underline mb-1">
                  <ChevronDown size={13} className={`transition-transform ${moNangCao ? "rotate-180" : ""}`} />
                  {moNangCao ? "Thu gß╗ìn ─æiß╗üu kiß╗çn t├¼m kiß║┐m" : "─Éiß╗üu kiß╗çn t├¼m kiß║┐m kh├íc"}
                  {!moNangCao && soDieuKienPhu > 0 && (
                    <span className="min-w-[16px] text-center bg-[#8b1a1a] text-white text-[10px] font-semibold px-1 py-[1px] rounded-full leading-[1.3]">
                      {soDieuKienPhu}
                    </span>
                  )}
                </button>
                  <div className={moNangCao ? "" : "hidden"}>
                  {/* ΓöÇΓöÇ L╞░ß╗¢i 6 cß╗Öt, xß║┐p theo H├ÇNG ΓöÇΓöÇ
                      Thß╗⌐ tß╗▒ do nghiß╗çp vß╗Ñ chß╗æt theo tß╗½ng h├áng ngang, n├¬n khß╗æi n├áy
                      l├á mß╗Öt l╞░ß╗¢i chß║úy theo h├áng: TRow thß╗⌐ n r╞íi v├áo cß╗Öt (n mod 6).
                      Nhß╗¥ vß║¡y c├íc bß╗Ö tr╞░ß╗¥ng ─æi liß╗ün nhau nß║▒m chung mß╗Öt d├▓ng ΓÇö
                      Nhß║¡n ─æ╞ín tß╗½ Γåö ─Éß║┐n ng├áy, Ng├áy thß╗Ñ l├╜ tß╗½ Γåö ─Éß║┐n ng├áy Γåö Sß╗æ thß╗Ñ l├╜,
                      N╞íi chuyß╗ân Γåö Chuyß╗ân ─æß║┐n, Ng├áy chuyß╗ân tß╗½ Γåö ─Éß║┐n ng├áy.
                      Sß╗æ BA/Q─É, Ng├áy BA/Q─É, ─Éß╗ïa chß╗ë gß╗¡i ─æ╞ín / chi tiß║┐t, Trß║ú lß╗¥i ─æ╞ín
                      ─æ├ú c├│ ß╗ƒ bß╗Ö lß╗ìc c╞í bß║ún n├¬n kh├┤ng lß║╖p lß║íi ß╗ƒ ─æ├óy. */}
                  <div className="grid grid-cols-6 gap-x-7 gap-y-2">
                    {/* H├áng 1 */}
                    <TRow label="Phß║ím vi t├¼m kiß║┐m">
                      <TSel value={ui("phamVi")} onChange={e => setUi("phamVi")(e.target.value)}>
                        <option value="">Tß║Ñt cß║ú</option>
                        <option>─É╞ín vß╗ï cß╗ºa t├┤i</option>
                        <option>To├án hß╗ç thß╗æng</option>
                      </TSel>
                    </TRow>
                    <TRow label="Nhß║¡n ─æ╞ín tß╗½">
                      <TDate value={ui("nhanDonTu")} onChange={setUi("nhanDonTu")} />
                    </TRow>
                    <TRow label="─Éß║┐n ng├áy">
                      <TDate value={ui("nhanDonDen")} onChange={setUi("nhanDonDen")} />
                    </TRow>
                    <TRow label="H├¼nh thß╗⌐c nhß║¡n">
                      <TSel value={fHinhThucNhan} onChange={e => setFHinhThucNhan(e.target.value)}>
                        <option value="">--- Tß║Ñt cß║ú ---</option>
                        <option>B╞░u ─æiß╗çn</option><option>─Éiß╗çn tß╗¡</option><option>Trß╗▒c tiß║┐p</option>
                        <option>Trß╗▒c tuyß║┐n</option><option>Nß╗Öi bß╗Ö</option><option>Tiß║┐p c├┤ng d├ón</option>
                      </TSel>
                    </TRow>
                    <TRow label="Ng╞░ß╗¥i nhß║¡p">
                      <TSel value={fNguoiNhap} onChange={e => setFNguoiNhap(e.target.value)}>
                        <option value="">...chß╗ìn...</option>
                        {nguoiNhapOptions.map(o => <option key={o}>{o}</option>)}
                      </TSel>
                    </TRow>
                    <TRow label="Sß╗æ CMND/CCCD">
                      <TInp value={ui("cccd")} onChange={e => setUi("cccd")(e.target.value)} />
                    </TRow>

                    {/* H├áng 2 */}
                    <div className="col-span-2">
                      <TRow label="T├¬n c╞í quan chuyß╗ân ─æ╞ín">
                        <TInp value={ui("coQuanChuyen")} onChange={e => setUi("coQuanChuyen")(e.target.value)} />
                      </TRow>
                    </div>
                    <TRow label="Sß╗æ CV/PC ─æß║┐n">
                      <TInp value={ui("soCVPC")} onChange={e => setUi("soCVPC")(e.target.value)} />
                    </TRow>
                    <TRow label="Ng├áy CV/PC">
                      <TDate value={ui("ngayCVPC")} onChange={setUi("ngayCVPC")} />
                    </TRow>
                    <div className="col-span-2">
                      <TRow label="Loß║íi c├┤ng v─ân">
                        <div className="grid grid-cols-[1fr_96px] gap-1.5">
                          <TSel value={ui("loaiCongVan")} onChange={e => setUi("loaiCongVan")(e.target.value)}>
                            <option value="">-- Chß╗ìn loß║íi c├┤ng v─ân --</option>
                            {LOAI_CONG_VAN_LE.map(o => <option key={o}>{o}</option>)}
                            {LOAI_CONG_VAN_NHOM.map(g => (
                              <optgroup key={g.label} label={g.label}>
                                {g.items.map(o => <option key={o}>{o}</option>)}
                              </optgroup>
                            ))}
                          </TSel>
                          <TInp value={ui("soCVChuyenDen")} onChange={e => setUi("soCVChuyenDen")(e.target.value)}
                            placeholder="Nhß║¡p sß╗æ" />
                        </div>
                      </TRow>
                    </div>

                    {/* H├áng 3 */}
                    <TRow label="Ng├áy thß╗Ñ l├╜ tß╗½">
                      <TDate value={ui("thuLyTu")} onChange={setUi("thuLyTu")} />
                    </TRow>
                    <TRow label="─Éß║┐n ng├áy">
                      <TDate value={ui("thuLyDen")} onChange={setUi("thuLyDen")} />
                    </TRow>
                    <TRow label="Sß╗æ thß╗Ñ l├╜">
                      <TInp value={ui("soThuLy")} onChange={e => setUi("soThuLy")(e.target.value)} />
                    </TRow>
                    <TRow label="Thß╗º tß╗Ñc giß║úi quyß║┐t">
                      <TSel value={ui("thuTuc")} onChange={e => setUi("thuTuc")(e.target.value)}>
                        <option value="">--Tß║Ñt cß║ú--</option>
                        <option>Gi├ím ─æß╗æc thß║⌐m</option><option>T├íi thß║⌐m</option>
                      </TSel>
                    </TRow>
                    <TRow label="Thß╗Ñ l├╜ ─æ╞ín">
                      <TSel value={fThuLy} onChange={e => setFThuLy(e.target.value)}>
                        <option value="">--Tß║Ñt cß║ú--</option>
                        <option>Thß╗Ñ l├╜ mß╗¢i</option><option>─É├ú thß╗Ñ l├╜</option>
                        <option>Chß╗¥ ├╜ kiß║┐n L├únh ─æß║ío</option><option>Kh├┤ng</option>
                      </TSel>
                    </TRow>
                    <TRow label="Loß║íi ├ín">
                      <TSel value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)}>
                        <option value="">Tß║Ñt cß║ú</option>
                        <option>H├¼nh sß╗▒</option><option>D├ón sß╗▒</option><option>H├ánh ch├¡nh</option>
                        <option>KDTM</option><option>HN-G─É</option><option>Lao ─æß╗Öng</option>
                      </TSel>
                    </TRow>

                    {/* H├áng 4 */}
                    <div className="col-span-2">
                      <TRow label="Thß║⌐m ph├ín">
                        <div className="grid grid-cols-[112px_1fr] gap-1.5">
                          <TSel value={ui("bacTP")} onChange={e => setUi("bacTP")(e.target.value)}>
                            <option>Thß║⌐m ph├ín bß║¡c 3</option>
                            <option>Thß║⌐m ph├ín TANDTC</option>
                          </TSel>
                          <TSel value={ui("tenTP")} onChange={e => setUi("tenTP")(e.target.value)}>
                            <option value="">--- Chß╗ìn ---</option>
                            <option>Nguyß╗àn Thß║┐ Lß╗ç - 20/10/1966</option>
                            <option>Ng├┤ Hß╗ông Ph├║c - 05/02/1970</option>
                            <option>Nguyß╗àn Nh╞░ Thß║»ng - 18/07/1973</option>
                          </TSel>
                        </div>
                      </TRow>
                    </div>
                    <TRow label="L├únh ─æß║ío chß╗ë ─æß║ío?">
                      <TSel value={ui("lanhDaoChiDao")} onChange={e => setUi("lanhDaoChiDao")(e.target.value)}>
                        <option value="">---Tß║Ñt cß║ú---</option><option>C├│</option><option>Kh├┤ng</option>
                      </TSel>
                    </TRow>
                    <TRow label="Trß║íi giam">
                      <ComboNhapChon value={ui("traiGiam")} onChange={setUi("traiGiam")}
                        nhomGoiY={[{ nhom: "", items: ["Kh├┤ng"] }, ...DON_VI_TRAI_GIAM]}
                        placeholder="T├¼m hoß║╖c chß╗ìn trß║íi giam" chiTrongDanhMuc />
                    </TRow>
                    <TRow label="├ün tß╗¡ h├¼nh">
                      <TSel value={fAnTuHinhSelect} onChange={e => setFAnTuHinhSelect(e.target.value)}>
                        <option value="">--- Tß║Ñt cß║ú ---</option><option>C├│</option><option>Kh├┤ng</option>
                      </TSel>
                    </TRow>


                    {/* H├áng 5 ΓÇö Nh├│m Kh├íng nghß╗ï */}
                    <div className="col-span-2">
                      <TRow label="Ng╞░ß╗¥i kh├íng nghß╗ï">
                        <TInp value={ui("nguoiKN")} onChange={e => setUi("nguoiKN")(e.target.value)} />
                      </TRow>
                    </div>
                    <div className="col-span-2">
                      <TRow label="Sß╗æ Q─ÉKN">
                        <TInp value={ui("soQDKN")} onChange={e => setUi("soQDKN")(e.target.value)} />
                      </TRow>
                    </div>
                    <div className="col-span-2">
                      <TRow label="Ng├áy Q─ÉKN">
                        <TDate value={ui("ngayQDKN")} onChange={setUi("ngayQDKN")} />
                      </TRow>
                    </div>

                    {/* H├áng 6 ΓÇö Nh├│m Chuyß╗ân ─æ╞ín & Trß║íng th├íi ─æ╞ín */}
                    <div className="col-span-1">
                      <TRow label="Trß║íng th├íi ─æ╞ín">
                        <TSel value={fTrangThai} onChange={e => setFTrangThai(e.target.value)}>
                          <option value="">--- Tß║Ñt cß║ú ---</option>
                          <option>─É╞ín ─æß╗º ─æiß╗üu kiß╗çn</option><option>─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn</option>
                        </TSel>
                      </TRow>
                    </div>
                    <div className="col-span-1">
                      <TRow label="N╞íi chuyß╗ân" bold>
                        <TSel value={fNoiChuyen} onChange={e => { setFNoiChuyen(e.target.value); setFDonVi(""); setAdvUI(p => ({ ...p, chuyenCaNhan: "", chuyenCATA: "" })); }}>
                          <option value="">--- Tß║Ñt cß║ú ---</option>
                          <option>Nß╗Öi bß╗Ö</option><option>T├▓a kh├íc</option><option>Ngo├ái t├▓a ├ín</option>
                        </TSel>
                      </TRow>
                    </div>
                    <div className={(fNoiChuyen === "Nß╗Öi bß╗Ö" || fNoiChuyen === "T├▓a kh├íc") ? "col-span-2" : "col-span-4"}>
                      <TRow label="Chuyß╗ân ─æß║┐n" bold>
                        <TSel value={fDonVi} onChange={e => setFDonVi(e.target.value)}>
                          <option value="">--- Tß║Ñt cß║ú ---</option>
                          <option>Vß╗Ñ Ph├íp chß║┐ v├á Quß║ún l├╜ khoa hß╗ìc</option>
                          <option>Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü h├¼nh sß╗▒</option>
                          <option>Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü d├ón sß╗▒</option>
                          <option>Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü h├ánh ch├¡nh</option>
                        </TSel>
                      </TRow>
                    </div>
                    {fNoiChuyen === "Nß╗Öi bß╗Ö" && (
                      <div className="col-span-2">
                        <TRow label="Chuyß╗ân ─æß║┐n c├í nh├ón">
                          <TSel value={ui("chuyenCaNhan")} onChange={e => setUi("chuyenCaNhan")(e.target.value)}>
                            <option value="">--- Tß║Ñt cß║ú ---</option>
                            {OFFICERS.map(o => <option key={o}>{o}</option>)}
                          </TSel>
                        </TRow>
                      </div>
                    )}
                    {fNoiChuyen === "T├▓a kh├íc" && (
                      <div className="col-span-2">
                        <TRow label="Chuyß╗ân tß╗¢i CA/TA?">
                          <TSel value={ui("chuyenCATA")} onChange={e => setUi("chuyenCATA")(e.target.value)}>
                            <option value="">--Tß║Ñt cß║ú--</option><option>C├│</option><option>Kh├┤ng</option>
                          </TSel>
                        </TRow>
                      </div>
                    )}

                    {/* H├áng 7 */}
                    <div className="col-span-2">
                      <TRow label="Ng├áy chuyß╗ân tß╗½">
                        <TDate value={ui("chuyenTu")} onChange={setUi("chuyenTu")} />
                      </TRow>
                    </div>
                    <div className="col-span-2">
                      <TRow label="Ng├áy chuyß╗ân ─æß║┐n">
                        <TDate value={ui("chuyenDen")} onChange={setUi("chuyenDen")} />
                      </TRow>
                    </div>
                    <div className="col-span-2">
                      <TRow label="Trß║íng th├íi chuyß╗ân">
                        <TSel value={ui("ttChuyen")} onChange={e => setUi("ttChuyen")(e.target.value)}>
                          <option value="">--- Tß║Ñt cß║ú ---</option>
                          <option>Ch╞░a chuyß╗ân</option><option>─É├ú chuyß╗ân</option><option>─É├ú nhß║¡n</option>
                        </TSel>
                      </TRow>
                    </div>
                  </div>
                  </div>
              </div>

              {/* Nh├│m n├║t nß║▒m cuß╗æi khß╗æi t├¼m kiß║┐m, sau to├án bß╗Ö ─æiß╗üu kiß╗çn lß╗ìc */}
              <div className="flex items-center justify-end gap-2 pt-2.5 mt-1 border-t border-[#e8e8e8]">
                <button
                  className="inline-flex items-center gap-1.5 h-[32px] px-5 rounded-[4px] bg-[#8b1a1a] hover:bg-[#6e1414] active:bg-[#5a1010] text-white text-[12px] font-semibold whitespace-nowrap shadow-sm transition-colors">
                  <Search size={13} />
                  T├¼m kiß║┐m
                </button>
                <button onClick={xoaBoLoc}
                  className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[4px] border border-[#ccc] bg-white text-[12px] text-[#555] whitespace-nowrap transition-colors hover:bg-[#f5f5f5] hover:border-[#bbb]">
                  <RotateCcw size={13} />
                  L├ám mß╗¢i
                  {soBoLocDangApp > 0 && (
                    <span className="ml-0.5 min-w-[16px] text-center bg-[#8b1a1a] text-white text-[10px] font-semibold px-1 py-[1px] rounded-full leading-[1.3]">
                      {soBoLocDangApp}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ΓöÇΓöÇ Action bar sau t├¼m kiß║┐m ΓöÇΓöÇ */}
          <div className="flex flex-col gap-0 border-b border-[#ddd]">
            {/* Loß║íi v─ân bß║ún ─æß╗⌐ng c├╣ng h├áng vß╗¢i nh├│m n├║t thao t├íc, hiß╗çn ß╗ƒ mß╗ìi tab */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#f5f5f5]">
              <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#333] whitespace-nowrap">Loß║íi v─ân bß║ún:</span>
                    <div className="relative">
                      <select
                        value={loaiVanBan}
                        onChange={e => {
                          setLoaiVanBan(e.target.value);
                          if (e.target.value !== "C├┤ng v─ân chuyß╗ân ─æ╞ín") setLoaiDon("gdt");
                        }}
                        className={`h-[30px] px-2 pr-7 text-[12px] border rounded-[3px] appearance-none min-w-[200px] transition-colors ${oLoc(loaiVanBan)} ${loaiVanBan ? "text-[#222]" : "text-[#aaa]"}`}
                      >
                        {/* disabled+hidden: chß╗ë l├ám nh├ún gß╗úi ├╜, kh├┤ng nß║▒m trong danh s├ích chß╗ìn */}
                        <option value="" disabled hidden>Chß╗ìn loß║íi v─ân bß║ún</option>
                        {/* text-[#222] ─æß╗â danh s├ích bung ra kh├┤ng bß╗ï x├ím l├óy tß╗½ select */}
                        {LOAI_VAN_BAN_FILTER.map(o => <option key={o} className="text-[#222]">{o}</option>)}
                      </select>
                      <ChevronDown size={11} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${loaiVanBan ? "text-[#888]" : "text-[#ccc]"}`} />
                    </div>
                    {/* X├│a nhanh bß╗Ö lß╗ìc Loß║íi v─ân bß║ún */}
                    {loaiVanBan && (
                      <button
                        onClick={() => { setLoaiVanBan(""); setLoaiDon("gdt"); }}
                        title="X├│a lß╗ìc loß║íi v─ân bß║ún"
                        aria-label="X├│a lß╗ìc loß║íi v─ân bß║ún"
                        className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[#888] hover:text-[#8b1a1a] hover:bg-[#f0e0e0] transition-colors">
                        <X size={14} />
                      </button>
                    )}
              </div>
              <div className="flex-1" />
              <BtnPrimary onClick={onThemMoi} className="h-[30px] text-[12px] px-3 gap-1">
                <Plus size={13} /> Th├¬m mß╗¢i
              </BtnPrimary>
              {/* Hiß╗çn ß╗ƒ mß╗ìi tab, kh├┤ng ri├¬ng tab "─É╞ín cß╗ºa t├┤i" */}
              <BtnPrimary
                onClick={() => setShowNumberingModal(selectedRows.length ? selectedRows[0] : 1)}
                disabled={filteredRows.length === 0}
                title={filteredRows.length === 0 ? "Kh├┤ng c├│ v─ân bß║ún hß╗úp lß╗ç ─æß╗â tr├¼nh duyß╗çt" : undefined}
                className="h-[30px] text-[12px] px-3 gap-1">
                <FileText size={13} /> L╞░u sß╗æ v─ân bß║ún v├á in b├ío c├ío
              </BtnPrimary>
              {activeTab > 1 && (
                <BtnPrimary onClick={() => setShowTraLai(true)} disabled={!canReturn} className="h-[30px] text-[12px] px-3 gap-1">
                  <RotateCcw size={13} /> Trß║ú lß║íi
                </BtnPrimary>
              )}
              {assignmentMode === "chi-dinh" && selectedPhanCongCount > 0 && (
                <div className="ml-4 flex flex-wrap items-center gap-2">
                  <div className="text-[12px] text-[#333] whitespace-nowrap">Chß╗ìn c├ín bß╗Ö:</div>
                  <div className="relative min-w-[220px]">
                    <select value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}
                      className="h-[30px] w-full px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                      <option value="">-- Chß╗ìn c├ín bß╗Ö --</option>
                      {OFFICERS.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                  <BtnPrimary onClick={() => {
                    if (!selectedOfficer) return;
                    const assignedMaDons = selectedPhanCongRows.map(r => r.maDon).join(", ");
                    setAssignmentNotice(`─É├ú chß╗ë ─æß╗ïnh ${selectedOfficer} cho ${selectedPhanCongCount} ─æ╞ín: ${assignedMaDons}.`);
                    triggerNoti(`─É├ú ph├ón c├┤ng ${selectedOfficer} cho ${selectedPhanCongCount} ─æ╞ín.`);
                    setAssignmentMode("none");
                    setSelectedOfficer("");
                    window.setTimeout(() => setAssignmentNotice(""), 4500);
                  }} disabled={!selectedOfficer} className="h-[30px] text-[12px] px-3 gap-1">
                    X├íc nhß║¡n
                  </BtnPrimary>
                </div>
              )}
              {assignmentNotice && (
                <div className="ml-4 rounded-[3px] bg-[#fff4e5] border border-[#f5c16b] px-3 py-2 text-[12px] text-[#8a5c00] max-w-[360px]">
                  {assignmentNotice}
                </div>
              )}
              <button onClick={() => setShowInDanhSach(true)} disabled={rowsDeIn.length === 0}
                title={selectedRows.length
                  ? `In ${selectedRows.length} ─æ╞ín ─æang chß╗ìn`
                  : "In to├án bß╗Ö ─æ╞ín ─æang hiß╗ân thß╗ï theo bß╗Ö lß╗ìc"}
                className="flex items-center gap-1.5 h-[30px] px-3 border border-[#1d2e4f] text-[#1d2e4f] hover:bg-[#eef1f5] disabled:opacity-40 disabled:hover:bg-transparent rounded-[3px] text-[12px] font-medium transition-colors">
                <Printer size={13} /> In danh s├ích
              </button>
              {/* <BtnSecondary className="h-[30px] text-[12px] px-3 gap-1">
                <Download size={13} /> Th├¬m tß╗½ ─æ╞ín
              </BtnSecondary> */}
            </div>

            {/* ΓöÇΓöÇ Radio group: chß╗ë hiß╗çn khi loß║íi v─ân bß║ún = C├┤ng v─ân chuyß╗ân ─æ╞ín ΓöÇΓöÇ */}
            {loaiVanBan === "C├┤ng v─ân chuyß╗ân ─æ╞ín" && (
              <div className="flex items-center gap-1 px-3 py-[6px] bg-[#fffaf7] border-t border-[#e8d9cc]">
                <span className="text-[12px] font-medium text-[#c0392b] mr-1 whitespace-nowrap">
                  Loß║íi ─æ╞ín<span className="ml-0.5 text-[#c0392b]">*</span>:
                </span>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="gdt"
                      checked={loaiDon === "gdt"}
                      onChange={() => setLoaiDon("gdt")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="kn"
                      checked={loaiDon === "kn"}
                      onChange={() => setLoaiDon("kn")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="tb"
                      checked={loaiDon === "tb"}
                      onChange={() => setLoaiDon("tb")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Chip bß╗Ö lß╗ìc "Qu├í hß║ín giß║úi quyß║┐t" ΓÇö chß╗ë hiß╗çn khi v├áo tß╗½ card cß║únh b├ío
              ß╗ƒ Trang chß╗º, c├│ n├║t bß╗Å lß╗ìc ri├¬ng v├¼ ─æ├óy kh├┤ng nß║▒m trong khß╗æi
              bß╗Ö lß╗ìc n├óng cao ph├¡a tr├¬n. */}
          {fQuaHanOnly && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#ddd] bg-[#fef2f2]">
              <AlertTriangle size={14} className="text-[#c0392b] flex-shrink-0" />
              <span className="text-[12px] text-[#c0392b]">
                ─Éang lß╗ìc: <b>Qu├í hß║ín giß║úi quyß║┐t</b> ({filteredRows.length} ─æ╞ín)
              </span>
              <button onClick={() => setFQuaHanOnly(false)} className="ml-auto text-[11px] text-[#1a5a96] hover:underline">
                Bß╗Å lß╗ìc
              </button>
            </div>
          )}

          {/* Tß╗òng sß╗æ bß║ún ghi ΓÇö ─æß║╖t ngay tr├¬n bß║úng, d╞░ß╗¢i thanh Loß║íi v─ân bß║ún, k├¿m
              sß╗æ ─æ╞ín ─æß╗â thß║Ñy quy m├┤ danh s├ích tr╞░ß╗¢c khi cuß╗Ön xuß╗æng bß║úng. */}
          <div className="flex items-center px-3 py-2 border-b border-[#ddd] bg-[#fafafa]">
            <span className="text-[12px] text-[#666]">
              Tß╗òng cß╗Öng <b className="text-[#1d2e4f]">{rows.length}</b> bß║ún ghi
              {!khangNghi && filteredRows.length > 0 && (
                <span className="text-[#999]"> ┬╖ <b className="text-[#1d2e4f]">{tongSoDon}</b> sß╗æ ─æ╞ín</span>
              )}
            </span>
          </div>

          {/* Table ΓÇö table-fixed + ─æß╗Ö rß╗Öng theo %, lu├┤n kh├¡t trong 1 trang thay v├¼
              cuß╗Ön ngang; nß╗Öi dung d├ái tß╗▒ xuß╗æng d├▓ng theo cß╗Öt thay v├¼ k├⌐o bß║úng rß╗Öng ra. */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[9px] text-center font-semibold text-[#333] w-[3%]">
                    <div className="flex items-center justify-center gap-1.5">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={filteredRows.length > 0 && selectedRows.length === filteredRows.length}
                        onChange={e => toggleAll(e.target.checked)} />
                      <span>STT</span>
                    </div>
                  </th>
                  {/* Cß╗Öt ng╞░ß╗¥i gß╗¡i ├┤m th├¬m H├¼nh thß╗⌐c ─æ╞ín + th├┤ng tin c├┤ng v─ân n├¬n
                      cß║ºn rß╗Öng h╞ín; cß╗Öt Th├┤ng tin ─æ╞ín nhß║╣ ─æi th├¼ thu lß║íi. */}
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[32%]">Th├┤ng tin ng╞░ß╗¥i gß╗¡i / ─æ╞ín vß╗ï gß╗¡i</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[26%]">Th├┤ng tin ─æ╞ín</th>
                  {khangNghi && <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[20%]">─É╞ín vß╗ï giß║úi quyß║┐t</th>}
                  {!khangNghi && (
                    <th className="border border-[#ddd] px-3 py-[9px] text-center font-semibold text-[#333] w-[5%]">
                      <div>Sß╗æ ─æ╞ín</div>
                      {filteredRows.length > 0 && (
                        <div className="font-normal text-[#666]">({tongSoDon})</div>
                      )}
                    </th>
                  )}
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[19%]">Th├┤ng tin giß║úi quyß║┐t</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[10%]">Ng╞░ß╗¥i nhß║¡p / Sß╗¡a</th>
                  <th className="border border-[#ddd] px-1 py-[9px] text-center font-semibold text-[#333] w-[5%]">Thao t├íc</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-[#ddd] px-3 py-10 text-center text-[#888]">
                      <div className="flex flex-col items-center gap-1.5">
                        <Search size={22} className="text-[#ccc]" />
                        <span className="text-[13px]">Kh├┤ng c├│ ─æ╞ín n├áo khß╗¢p bß╗Ö lß╗ìc.</span>
                        {/* N├¬u r├╡ v├¼ sao rß╗ùng: lß║Ñy l├╜ do cß╗ºa ch├¡nh ─æ╞ín ─æß║ºu ti├¬n bß╗ï
                            loß║íi, ─æß╗â c├ín bß╗Ö biß║┐t cß║ºn sß╗¡a g├¼ thay v├¼ t╞░ß╗ƒng lß╗ùi. */}
                        {loaiVanBan && (() => {
                          const lyDo = [...new Set(rowsLD.map(r => lyDoKhongDuocLap(r, loaiVanBan, donTrungMap[r.maDon])).filter(Boolean))];
                          if (!lyDo.length) return null;
                          return (
                            <span className="text-[12px] text-[#b45309] max-w-[560px] leading-relaxed">
                              Kh├┤ng ─æ╞ín n├áo ─æß╗º ─æiß╗üu kiß╗çn lß║¡p <b>{loaiVanBan}</b>. L├╜ do: {lyDo.join(" ┬╖ ")}.
                            </span>
                          );
                        })()}
                        {soBoLocDangApp > 0 && (
                          <button onClick={xoaBoLoc} className="text-[12px] text-[#1a5a96] hover:underline">L├ám mß╗¢i</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRows.map((row, i) => {
                  const d = row.thongTinDon ?? {};
                  const g = row.giaiQuyet ?? {};
                  // ─É╞ín li├¬n quan ─æ├ú cß║ºm thß║⌐m ph├ín ΓåÆ ─æ╞ín n├áy l├á "Thß╗Ñ l├╜ mß╗¢i tr├╣ng TP"
                  const trungTP = trungTPMap[row.id];
                  return (
                    <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                      {/* STT */}
                      <td className="border border-[#ddd] px-2 py-2.5 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                            onClick={(e) => e.stopPropagation()} />
                          <span>{i + 1}</span>
                        </div>
                      </td>

                      {/* Ng╞░ß╗¥i gß╗¡i */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        {(() => {
                          const diaChi = khangNghi ? donViKhangNghi(row.id).diaChi : row.diaChi;
                          const ngayTrenDon = row.ngayTrenDon || d.ngayCV;
                          return (
                            <div className="space-y-[5px] leading-[1.5] text-[12px]">
                              <div>
                                <span className="text-[#666]">{row.nguoiDungDon ? "Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín: " : "Ng╞░ß╗¥i gß╗¡i: "}</span>
                                <span className="font-semibold text-[#1a5a96] hover:underline cursor-pointer">
                                  {vietTatTAND(khangNghi ? donViKhangNghi(row.id).ten : (row.nguoiDungDon || row.nguoiGui))}
                                </span>
                              </div>
                              {diaChi && (
                                <div><span className="text-[#666]">─Éß╗ïa chß╗ë: </span><span className="font-semibold">{vietTatTAND(diaChi)}</span></div>
                              )}
                              {/* Tß╗½ng cß║╖p bß╗ìc nowrap ─æß╗â nh├ún kh├┤ng bß╗ï t├ích khß╗Åi gi├í trß╗ï khi xuß╗æng d├▓ng */}
                              {(ngayTrenDon || row.ngayNhap) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {ngayTrenDon && <span className="whitespace-nowrap"><span className="text-[#666]">Ng├áy tr├¬n ─æ╞ín: </span>{ngayTrenDon}</span>}
                                  {row.ngayNhap && <span className="whitespace-nowrap"><span className="text-[#666]">Ng├áy t├▓a nhß║¡n: </span>{row.ngayNhap}</span>}
                                </div>
                              )}
                              {(row.maDon || row.soHieuDon) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {row.maDon && <span className="whitespace-nowrap"><span className="text-[#666]">M├ú ─æ╞ín: </span><span className="font-semibold">{row.maDon}</span></span>}
                                  {row.soHieuDon && <span className="whitespace-nowrap"><span className="text-[#666]">Sß╗æ hiß╗çu: </span>{row.soHieuDon}</span>}
                                </div>
                              )}
                              {/* H├¼nh thß╗⌐c ─æ╞ín ΓÇö chuyß╗ân tß╗½ cß╗Öt Th├┤ng tin ─æ╞ín sang ─æ├óy,
                                  ─æß╗⌐ng cß║ính H├¼nh thß╗⌐c tiß║┐p nhß║¡n: cß║ú hai ─æß╗üu m├┤ tß║ú ─æ╞ín
                                  ─æß║┐n bß║▒ng ─æ╞░ß╗¥ng n├áo, kh├┤ng phß║úi nß╗Öi dung bß║ún ├ín. */}
                              {(row.thongTinDon?.hinhThuc || row.loaiHinhThuc) && (
                                <div>
                                  <span className="text-[#666]">H├¼nh thß╗⌐c ─æ╞ín: </span>
                                  <span className="font-semibold">{row.thongTinDon?.hinhThuc || row.loaiHinhThuc}</span>
                                </div>
                              )}
                              {/* C├┤ng v─ân chuyß╗ân ─æ╞ín ΓÇö chuyß╗ân tß╗½ cß╗Öt Th├┤ng tin ─æ╞ín sang
                                  ─æ├óy: n├│ n├│i vß╗ü ─æ╞░ß╗¥ng ─æi cß╗ºa ─æ╞ín tß╗¢i t├▓a, c├╣ng nh├│m vß╗¢i
                                  H├¼nh thß╗⌐c ─æ╞ín / H├¼nh thß╗⌐c tiß║┐p nhß║¡n. */}
                              {d.loaiCV && (
                                <div><span className="text-[#666]">Loß║íi CV: </span><span className="font-semibold">{d.loaiCV}</span></div>
                              )}
                              {(d.soCV || d.ngayCV) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {d.soCV && <span className="whitespace-nowrap"><span className="text-[#666]">Sß╗æ CV: </span>{d.soCV}</span>}
                                  {d.ngayCV && <span className="whitespace-nowrap"><span className="text-[#666]">Ng├áy CV: </span>{d.ngayCV}</span>}
                                </div>
                              )}
                              {/* H├¼nh thß╗⌐c tiß║┐p nhß║¡n ΓÇö tr╞░ß╗¢c l├á cß╗Öt ri├¬ng, gß╗Öp vß╗ü ─æ├óy
                                  v├¼ ─æ├óy l├á c├ích ng╞░ß╗¥i gß╗¡i ─æ╞░a ─æ╞ín tß╗¢i t├▓a. */}
                              {!khangNghi && row.hinhThucTiepNhan && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#666]">H├¼nh thß╗⌐c tiß║┐p nhß║¡n: </span>
                                  <span className={`inline-block px-2 py-[2px] rounded-sm text-[10px] font-medium border ${row.hinhThucTiepNhan === "Trß╗▒c tiß║┐p" ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                    : row.hinhThucTiepNhan === "B╞░u ─æiß╗çn" ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                                      : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                                    }`}>
                                    {row.hinhThucTiepNhan}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        {/* Tag ph├ón biß╗çt hß╗ô s╞í kh├íng nghß╗ï vß╗¢i ─æ╞ín th╞░ß╗¥ng ΓÇö hai loß║íi
                            n├áy giß╗¥ nß║▒m chung mß╗Öt danh s├ích. */}
                        {row.laKhangNghi && (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-[3px] rounded-[3px] border text-[10px] font-semibold leading-[1.4] bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]">
                            <Gavel size={10} className="flex-shrink-0" />
                            Hß╗ô s╞í kh├íng nghß╗ï
                          </div>
                        )}
                        {row.thoiHieu && (
                          <div className={`mt-1.5 inline-flex items-start gap-1 px-2 py-[3px] rounded-[3px] border text-[10px] font-medium leading-[1.4] ${THOI_HIEU[row.thoiHieu].cls}`}>
                            <AlertCircle size={10} className="flex-shrink-0 mt-[2px]" />
                            {THOI_HIEU[row.thoiHieu].nhan}
                          </div>
                        )}
                      </td>

                      {/* Th├┤ng tin ─æ╞ín */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        <div className="space-y-[5px] leading-[1.5] text-[12px]">
                          {/* Sß╗æ BA/Q─É ΓÇö ng├áy ΓÇö t├▓a gß╗Öp mß╗Öt d├▓ng. Kh├┤ng t├ích "Ng├áy" th├ánh
                              nh├ún ri├¬ng nß╗»a v├¼ b├¬n d╞░ß╗¢i c├▓n d├▓ng bß║ún ├ín gß╗æc, hai d├▓ng c├╣ng
                              cß║╖p nh├ún Sß╗æ/Ng├áy ─æß╗ìc ra nh╞░ bß╗ï lß║╖p. */}
                          {(d.soBaqd || d.ngay || d.toaXetXu) && (
                            <div>
                              <span className="text-[#666]">Sß╗æ BA/Q─É: </span>
                              <span className="font-semibold">{d.soBaqd || "ΓÇö"}</span>
                              {d.ngay && <span className="font-semibold italic"> ┬╖ {d.ngay}</span>}
                              {d.toaXetXu && <span className="font-semibold"> ┬╖ {vietTatTAND(d.toaXetXu)}</span>}
                            </div>
                          )}
                          {row.baGoc && (
                            <div>
                              <span className="text-[#666]">Bß║ún ├ín s╞í thß║⌐m gß╗æc: </span>
                              <span className="font-semibold">{row.baGoc.so}</span>
                              <span className="font-semibold italic"> ┬╖ {row.baGoc.ngay}</span>
                            </div>
                          )}
                          {d.thuTuc && <div><span className="text-[#666]">Thß╗º tß╗Ñc giß║úi quyß║┐t: </span><span className="font-semibold">{d.thuTuc}</span></div>}
                          {/* "H├¼nh thß╗⌐c ─æ╞ín" v├á th├┤ng tin c├┤ng v─ân chuyß╗ân ─æ╞ín (Sß╗æ CV /
                              Ng├áy CV / Loß║íi CV) ─æ├ú chuyß╗ân sang cß╗Öt Th├┤ng tin ng╞░ß╗¥i gß╗¡i ΓÇö
                              ch├║ng n├│i vß╗ü ─æ╞░ß╗¥ng ─æi cß╗ºa ─æ╞ín, kh├┤ng phß║úi nß╗Öi dung bß║ún ├ín. */}
                          {/* Tr├╣ng vß╗¢i "Ng╞░ß╗¥i gß╗¡i" ß╗ƒ cß╗Öt b├¬n cß║ính th├¼ bß╗Å, chß╗ë hiß╗çn khi thß╗▒c sß╗▒ kh├íc */}
                          {d.donViGui && norm(d.donViGui) !== norm(row.nguoiDungDon || row.nguoiGui) && (
                            <div><span className="text-[#666]">─É╞ín vß╗ï gß╗¡i: </span><span className="font-semibold">{vietTatTAND(d.donViGui)}</span></div>
                          )}
                          {/* Nh├ún giß╗» nguy├¬n "Thß║⌐m ph├ín"; chß╗ë chß╗⌐c danh trong ngoß║╖c
                              r├║t th├ánh "TP" cho vß╗½a cß╗Öt. */}
                          {d.thamPhan && <div><span className="text-[#666]">Thß║⌐m ph├ín: </span><span className="font-semibold text-[#333]">{vietTatChucDanhTP(thamPhanGon(vietTatTAND(d.thamPhan)))}</span></div>}
                          {/* ß╗₧ m├án Hß╗ô s╞í kh├íng nghß╗ï, ─æ╞ín vß╗ï giß║úi quyß║┐t t├ích th├ánh cß╗Öt ri├¬ng.
                              C├│ "(Sß╗æ: ...)" ngh─⌐a l├á ─æ├ú chuyß╗ân sang vß╗Ñ chuy├¬n m├┤n.
                              ─É╞ín ─æ├ú trß║ú lß║íi th├¼ kh├┤ng c├▓n "ch╞░a chuyß╗ân/─æ├ú chuyß╗ân" nß╗»a ΓÇö
                              thay bß║▒ng th├┤ng tin trß║ú ─æ╞ín cho khß╗Åi m├óu thuß║½n trß║íng th├íi. */}
                          {!khangNghi && row.giaiQuyet?.nhan === "Trß║ú lß║íi ─æ╞ín" ? (
                            <div>
                              <span className="font-semibold text-[#2980b9]">Trß║ú lß║íi ─æ╞ín</span>
                              {row.giaiQuyet.nguoiTra && (
                                <div><span className="text-[#666]">Ng╞░ß╗¥i trß║ú: </span><span className="font-semibold">{row.giaiQuyet.nguoiTra}</span></div>
                              )}
                              {row.giaiQuyet.ngayTra && (
                                <div><span className="text-[#666]">Ng├áy trß║ú: </span><span className="font-semibold">{row.giaiQuyet.ngayTra}</span></div>
                              )}
                            </div>
                          ) : !khangNghi && d.donViGiaiQuyet && (() => {
                            const daChuyen = daChuyenVu(row);
                            return (
                              <div>
                                <span className={daChuyen ? "font-semibold text-[#c0392b]" : "font-semibold text-[#1a5a96]"}>
                                  {daChuyen ? "─É├ú chuyß╗ân: " : "Ch╞░a chuyß╗ân: "}
                                </span>
                                <span className="font-semibold">{vietTatTAND(d.donViGiaiQuyet)}</span>
                              </div>
                            );
                          })()}
                          {/* Ng├áy chuyß╗ân = thß╗¥i ─æiß╗âm tß╗¥ tr├¼nh cß╗ºa ─æ╞ín ─æ╞░ß╗úc duyß╗çt,
                              lß║Ñy tß╗½ lß╗ïch sß╗¡ v─ân bß║ún chß╗⌐ kh├┤ng phß║úi tr╞░ß╗¥ng t─⌐nh. */}
                          {(() => {
                            const ngay = ngayDuyetToTrinh(vanBanList ?? [], row.maDon) ?? row.ngayChuyen;
                            return ngay
                              ? <div><span className="text-[#666]">Ng├áy chuyß╗ân: </span><span>{ngay}</span></div>
                              : null;
                          })()}
                          {row.ghiChu && <div><span className="text-[#666]">Ghi ch├║: </span><span>{row.ghiChu}</span></div>}
                        </div>
                      </td>

                      {/* ─É╞ín vß╗ï giß║úi quyß║┐t ΓÇö cß╗Öt ri├¬ng cß╗ºa m├án Hß╗ô s╞í kh├íng nghß╗ï */}
                      {khangNghi && (
                        <td className="border border-[#ddd] px-3 py-2.5 align-top">
                          {d.donViGiaiQuyet && <div className="text-[12px] text-[#333] leading-[1.5]">{vietTatTAND(d.donViGiaiQuyet)}</div>}
                          <div className="text-[11px] text-[#666] mt-1 leading-[1.5]">
                            <span className="text-[#888]">N╞íi nhß║¡n k├¿m: </span>{vietTatTAND(donViKhangNghi(row.id).noiNhan)}
                          </div>
                        </td>
                      )}

                      {/* Sß╗æ ─æ╞ín */}
                      {!khangNghi && (
                        <td className="border border-[#ddd] px-2 py-2.5 text-center font-medium align-top">{row.soDon || ""}</td>
                      )}


                      {/* Th├┤ng tin giß║úi quyß║┐t ΓÇö chß╗ë chß╗», kh├┤ng t├┤ nß╗ün m├áu, ─æß╗â mß║»t
                          kh├┤ng bß╗ï c├íc pill k├⌐o sß╗▒ ch├║ ├╜ khß╗Åi nß╗Öi dung xung quanh. */}
                      <td className="border border-[#ddd] px-3 py-2.5 leading-[1.5] align-top">
                        {khangNghi ? (() => {
                          const kn = ketQuaKhangNghi(row.id);
                          return (
                            <>
                              <span className="text-[12px] font-semibold text-[#333]">
                                {kn.trangThai}
                              </span>
                              {kn.ketQua && (
                                <div className="text-[12px] text-[#333] mt-1 leading-snug">
                                  <span className="text-[#888]">Kß║┐t quß║ú: </span>{kn.ketQua}
                                </div>
                              )}
                            </>
                          );
                        })() : (<>
                        {row.traLai ? (
                          <span className="text-[12px] font-semibold text-[#333]">
                            {row.traLai.status === "pendingApproval" ? "Trß║ú lß║íi - chß╗¥ TP duyß╗çt" : "─É├ú trß║ú lß║íi HCTP"}
                          </span>
                        ) : autoMergeMap[row.id] ? (
                          <span className="text-[12px] font-semibold text-[#333]">
                            {autoMergeMap[row.id]}
                          </span>
                        ) : row.waitingForProcessing ? (
                          <span
                            onClick={() => onEditRow?.(row.id)}
                            className="text-[12px] font-semibold text-[#333] cursor-pointer hover:underline"
                          >
                            Chß╗¥ xß╗¡ l├╜
                          </span>
                        ) : trungTP ? (
                          /* Vß║½n l├á Thß╗Ñ l├╜ mß╗¢i, nh╞░ng phß║úi n├│i th├¬m "tr├╣ng TP" ngay tr├¬n
                             nh├ún ΓÇö nß║┐u chß╗ë ghi Thß╗Ñ l├╜ mß╗¢i th├¼ c├ín bß╗Ö sß║╜ ─æem ─æi ph├ón c├┤ng
                             lß║íi, trong khi hß╗ô s╞í ─æ├ú ß╗ƒ tay thß║⌐m ph├ín cß╗ºa ─æ╞ín li├¬n quan. */
                          <>
                            <span className="text-[12px] font-semibold text-[#333]"
                              title={`C├╣ng bß║ún ├ín vß╗¢i ─æ╞ín ${trungTP.maDon.trim()} ΓÇö ─æ╞ín ─æ├│ ─æ├ú ph├ón c├┤ng thß║⌐m ph├ín v├á ─æ├ú chuyß╗ân vß╗Ñ`}>
                              Thß╗Ñ l├╜ mß╗¢i tr├╣ng TP
                            </span>
                            {g.stl && (
                              <div className="text-[12px] text-[#333] mt-1">
                                <span className="text-[#888]">Sß╗æ thß╗Ñ l├╜: </span>{g.stl}
                              </div>
                            )}
                            {g.ngayThuLy && (
                              <div className="text-[12px] text-[#333]">
                                <span className="text-[#888]">Ng├áy thß╗Ñ l├╜: </span>{g.ngayThuLy}
                              </div>
                            )}
                          </>
                        ) : g.nhan ? (
                          <>
                            <span className="text-[12px] font-semibold text-[#333]">
                              {g.nhan}
                            </span>
                            {g.nhan === "Thß╗Ñ l├╜ mß╗¢i" && g.stl && (
                              <div className="text-[12px] text-[#333] mt-1">
                                <span className="text-[#888]">Sß╗æ thß╗Ñ l├╜: </span>{g.stl}
                              </div>
                            )}
                            {g.nhan === "Thß╗Ñ l├╜ mß╗¢i" && g.ngayThuLy && (
                              <div className="text-[12px] text-[#333]">
                                <span className="text-[#888]">Ng├áy thß╗Ñ l├╜: </span>{g.ngayThuLy}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-[12px] font-medium text-[#888]">
                            Ch╞░a c├│
                          </span>
                        )}
                        {/* ─É╞ín sinh ra tß╗½ "Th├¬m ─æ╞ín tr├╣ng" ΓÇö ghi r├╡ nguß╗ôn gß╗æc ngay
                            d╞░ß╗¢i trß║íng th├íi, nß║┐u kh├┤ng nh├¼n bß║úng sß║╜ thß║Ñy mß║Ñy ─æ╞ín
                            giß╗æng hß╗çt nhau m├á kh├┤ng biß║┐t v├¼ sao. */}
                        {row.trungVoiDon && (
                          <div className="text-[12px] text-[#b45309] mt-1 leading-snug">
                            Tr├╣ng vß╗¢i ─æ╞ín <b className="font-medium">{row.trungVoiDon}</b>
                          </div>
                        )}
                        {/* Chß╗ë ─æ├¡ch danh ─æ╞ín li├¬n quan v├á thß║⌐m ph├ín ─æang giß╗» hß╗ô s╞í.
                            ─Éß╗â ngo├ái chuß╗ùi pill ß╗ƒ tr├¬n n├¬n d├╣ ─æ╞ín c├▓n d├¡nh nh├ún kh├íc
                            (─æ├ú gh├⌐p, chß╗¥ xß╗¡ l├╜...) th├¼ lß╗¥i nhß║»c n├áy vß║½n hiß╗çn. */}
                        {trungTP && (
                          <div className="text-[12px] text-[#b45309] mt-1 leading-snug">
                            Tr├╣ng TP vß╗¢i ─æ╞ín <b className="font-medium">{trungTP.maDon.trim()}</b>
                            {trungTP.thongTinDon?.thamPhan && (
                              <> ┬╖ {vietTatChucDanhTP(thamPhanGon(vietTatTAND(trungTP.thongTinDon.thamPhan)))}</>
                            )}
                          </div>
                        )}
                          {/* V─ân bß║ún tr├¼nh k├╜ cß╗ºa ─æ╞ín ΓÇö ─æß╗â phß║│ng ra ngo├ái, kh├┤ng
                              bß╗ìc thß║╗ nß╗ün nß╗»a. Mß╗ùi v─ân bß║ún mß╗Öt d├▓ng: chß║Ñm m├áu trß║íng
                              th├íi ┬╖ t├¬n loß║íi ┬╖ sß╗æ. Trß║íng th├íi ─æß╗ìc bß║▒ng M├ÇU CHß║ñM +
                              chß╗» nhß╗Å, kh├┤ng d├╣ng pill to chiß║┐m nguy├¬n mß╗Öt d├▓ng. */}
                          {/* Kß║┐t quß║ú kh├íng nghß╗ï ΓÇö thay cho cß╗Öt ri├¬ng ß╗ƒ m├án Hß╗ô s╞í
                              kh├íng nghß╗ï c┼⌐, chß╗ë hiß╗çn vß╗¢i bß║ún ghi l├á kh├íng nghß╗ï. */}
                          {row.laKhangNghi && row.khangNghi && (
                            <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#e8e8e8]">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${row.khangNghi.trangThai === "─É├ú x├⌐t xß╗¡" ? "bg-[#1a7a45]" : "bg-[#e67e22]"}`} />
                                <span className="text-[11px] font-medium text-[#1d2e4f]">{row.khangNghi.trangThai}</span>
                              </div>
                              {row.khangNghi.ketQua && (
                                <div className="text-[10px] text-[#777] mt-[1px] leading-snug">{row.khangNghi.ketQua}</div>
                              )}
                              <div className="text-[10px] text-[#888] mt-[1px]">N╞íi nhß║¡n k├¿m: {vietTatTAND(row.khangNghi.noiNhan)}</div>
                            </div>
                          )}
                          {(() => {
                            const dsVB = timVanBanTheoDon(vanBanList ?? [], row.maDon);
                            if (!dsVB.length) return null;
                            return (
                              <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#e8e8e8] space-y-1.5">
                                <div className="text-[10px] font-semibold text-[#888] uppercase tracking-wide">
                                  V─ân bß║ún tr├¼nh k├╜ ({dsVB.length})
                                </div>
                                {dsVB.map(vb => (
                                  <button key={vb.id} type="button" title={`${vb.soVanBan ? vb.soVanBan + " ΓÇö " : ""}${vb.loaiVanBan} ┬╖ ${TRANG_THAI_NHAN[vb.trangThai]}`}
                                    onClick={(e) => { e.stopPropagation(); onBieuMau?.(row, vb.id); }}
                                    className="group w-full text-left flex items-start gap-1.5 hover:bg-[#f4f8fd] rounded-[3px] px-1 -mx-1 py-0.5 transition-colors">
                                    <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[5px] ${CHAM_TRANG_THAI[vb.trangThai]}`} />
                                    <span className="min-w-0 flex-1 leading-snug">
                                      <span className="text-[11px] font-medium text-[#1d2e4f] group-hover:text-[#1a5a96]">
                                        {vb.soVanBan && <span className="font-mono">{vb.soVanBan} </span>}
                                        {vb.loaiVanBan}
                                      </span>
                                      <span className="text-[10px] text-[#888]"> ┬╖ {TRANG_THAI_NHAN[vb.trangThai]}</span>
                                      {!vb.soVanBan && (
                                        <span className="text-[10px] text-[#b45309]"> ┬╖ ch╞░a cß║Ñp sß╗æ</span>
                                      )}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            );
                          })()}
                          {/* Bß╗Å link "Danh s├ích v─ân bß║ún": ─æ╞ín c├│ v─ân bß║ún th├¼ ─æ├ú liß╗çt
                              k├¬ ─æß╗º ß╗ƒ khß╗æi tr├¬n v├á bß║Ñm ─æ╞░ß╗úc; ─æ╞ín ch╞░a c├│ th├¼ kh├┤ng hiß╗çn
                              g├¼. Lß╗æi v├áo m├án biß╗âu mß║½u vß║½n c├▓n ß╗ƒ menu Γï« ΓåÆ Xem biß╗âu mß║½u. */}
                          {(() => {
                            const normMaDon = (ma?: string) => (ma || "").trim().toLowerCase();
                            const isDonChinh = Object.values(mergeState).some(item => item.ghepVoi && normMaDon(item.ghepVoi) === normMaDon(row.maDon));
                            const donKems = isDonChinh 
                              ? rows.filter(r => mergeState[r.id]?.ghepVoi && normMaDon(mergeState[r.id].ghepVoi) === normMaDon(row.maDon))
                              : [];

                            return (
                              <div className="space-y-1 mt-1">
                                {mergeState[row.id]?.ghepVoi && (
                                  <div className="flex items-center gap-2 flex-wrap bg-[#f0f9ff] border border-[#bae6fd] p-1.5 rounded-sm">
                                    <div className="flex items-center gap-1 text-[11px] text-[#0369a1] font-semibold">
                                      <GitMerge size={11} className="flex-shrink-0" />
                                      <span>─É├ú gh├⌐p vß╗¢i ─æ╞ín {mergeState[row.id].ghepVoi!.startsWith("M├ú") ? mergeState[row.id].ghepVoi : `M├ú ${mergeState[row.id].ghepVoi}`}</span>
                                    </div>
                                    <button
                                      onClick={() => setShowHuyGhep(row.id)}
                                      className="flex items-center gap-0.5 px-1.5 py-[2px] rounded text-[10px] font-medium border border-[#c0392b] text-[#c0392b] hover:bg-[#fdecea] transition-colors whitespace-nowrap ml-auto">
                                      <X size={9} /> Hß╗ºy gh├⌐p
                                    </button>
                                  </div>
                                )}
                                
                                {isDonChinh && (
                                  <div className="flex flex-col gap-0.5 text-left bg-[#f0fdf4] border border-[#bbf7d0] p-1.5 rounded-sm">
                                    <div className="flex items-center gap-1 text-[11px] text-[#166534] font-semibold">
                                      <GitMerge size={11} className="flex-shrink-0" />
                                      <span>─É╞ín ch├¡nh nh├│m gh├⌐p</span>
                                    </div>
                                    <div className="text-[10px] text-[#444] leading-normal">
                                      <span className="font-medium text-[#666]">─É╞ín k├¿m:</span>{" "}
                                      {donKems.map((dk, idx) => (
                                        <span key={dk.id}>
                                          {idx > 0 && ", "}
                                          <span className="font-semibold underline text-[#1a5a96]" title={dk.nguoiGui}>{dk.maDon}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          {transferState[row.id] && (() => {
                            const ts = transferState[row.id];
                            return (
                              <div className="mt-1.5 p-1.5 bg-[#fef9c3] border border-[#fef08a] rounded-sm space-y-1">
                                <div className="flex items-center gap-1">
                                  <Clock size={11} className="text-[#856404] flex-shrink-0" />
                                  <span className="text-[10px] text-[#856404] font-semibold">
                                    Chß╗¥ x├íc nhß║¡n chuyß╗ân ─æ╞ín
                                  </span>
                                </div>
                                <div className="text-[9.5px] text-[#666] leading-tight">
                                  <div><span className="font-semibold">Tß╗½:</span> {ts.fromOfficer}</div>
                                  <div><span className="font-semibold">─Éß║┐n:</span> {ts.toOfficer}</div>
                                  <div><span className="font-semibold">L├╜ do:</span> {ts.reason}</div>
                                </div>
                                {ts.toOfficer === "Ph├╣ng Tr├óm Anh" && (
                                  <div className="flex gap-1 mt-1 pt-1 border-t border-[#fef08a]">
                                    <button
                                      onClick={() => {
                                        setRows(prevRows => {
                                          const targetMaDons = (ts.maDons || [row.maDon]).map(m => m.trim().toLowerCase());
                                          return prevRows.map(r => {
                                            const ma = (r.maDon || "").trim().toLowerCase();
                                            if (targetMaDons.includes(ma)) {
                                              const newHistory = [
                                                ...(r.processingHistory || []),
                                                {
                                                  date: new Date().toLocaleDateString("vi-VN"),
                                                  step: "─Éß╗ông ├╜ nhß║¡n ─æ╞ín",
                                                  actor: "Ph├╣ng Tr├óm Anh",
                                                  note: `─Éß╗ông ├╜ nhß║¡n quyß╗ün quß║ún l├╜ ─æ╞ín tß╗½ ${ts.fromOfficer}.`
                                                }
                                              ];
                                              return {
                                                ...r,
                                                nguoiNhap: "Ph├╣ng Tr├óm Anh",
                                                cuaToi: true,
                                                processingHistory: newHistory
                                              };
                                            }
                                            return r;
                                          });
                                        });
                                        setTransferState(prev => {
                                          const next = { ...prev };
                                          delete next[row.id];
                                          if (ts.maDons) {
                                            rows.forEach(r => {
                                              if (ts.maDons?.includes(r.maDon)) {
                                                delete next[r.id];
                                              }
                                            });
                                          }
                                          return next;
                                        });
                                        triggerNoti(`─É├ú x├íc nhß║¡n nhß║¡n ─æ╞ín ${row.maDon} tß╗½ c├ín bß╗Ö ${ts.fromOfficer}.`);
                                      }}
                                      className="px-1.5 py-[2px] rounded text-[9.5px] font-semibold bg-[#27ae60] text-white hover:bg-[#219653] transition-colors whitespace-nowrap">
                                      ─Éß╗ông ├╜ nhß║¡n
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRows(prevRows => {
                                          const targetMaDons = (ts.maDons || [row.maDon]).map(m => m.trim().toLowerCase());
                                          return prevRows.map(r => {
                                            const ma = (r.maDon || "").trim().toLowerCase();
                                            if (targetMaDons.includes(ma)) {
                                              return {
                                                ...r,
                                                processingHistory: [
                                                  ...(r.processingHistory || []),
                                                  {
                                                    date: new Date().toLocaleDateString("vi-VN"),
                                                    step: "Tß╗½ chß╗æi nhß║¡n ─æ╞ín",
                                                    actor: "Ph├╣ng Tr├óm Anh",
                                                    note: `Tß╗½ chß╗æi nhß║¡n quyß╗ün quß║ún l├╜ ─æ╞ín tß╗½ ${ts.fromOfficer}.`
                                                  }
                                                ]
                                              };
                                            }
                                            return r;
                                          });
                                        });
                                        setTransferState(prev => {
                                          const next = { ...prev };
                                          delete next[row.id];
                                          if (ts.maDons) {
                                            rows.forEach(r => {
                                              if (ts.maDons?.includes(r.maDon)) {
                                                delete next[r.id];
                                              }
                                            });
                                          }
                                          return next;
                                        });
                                        triggerNoti(`─É├ú tß╗½ chß╗æi nhß║¡n ─æ╞ín ${row.maDon} tß╗½ c├ín bß╗Ö ${ts.fromOfficer}.`);
                                      }}
                                      className="px-1.5 py-[2px] rounded text-[9.5px] font-semibold bg-[#c0392b] text-white hover:bg-[#a93226] transition-colors whitespace-nowrap">
                                      Tß╗½ chß╗æi
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </>)}
                      </td>

                      {/* Ng╞░ß╗¥i nhß║¡p / Sß╗¡a ΓÇö hai ─æß║ºu cß╗ºa v├▓ng ─æß╗¥i ─æ╞ín: ai lß║¡p ban
                          ─æß║ºu, ai ─æß╗Öng v├áo sau c├╣ng. Tr├╣ng t├¬n th├¼ k├¿m n─âm sinh
                          trong ngoß║╖c (chß╗» mß╗¥) ─æß╗â ph├ón biß╗çt. */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        {(() => {
                          const TenCB = ({ ten, ghiDe }: { ten?: string; ghiDe?: string }) => {
                            if (!ten) return null;
                            const nam = namSinh(ngaySinhTheoTen(ten, ghiDe));
                            return (
                              <span className="font-medium">
                                {ten}
                                {tenCanBoTrungLap.has(ten) && nam && (
                                  <span className="font-normal text-[#aaa]"> ({nam})</span>
                                )}
                              </span>
                            );
                          };
                          return (
                            <div className="space-y-[3px] leading-[1.5]">
                              {row.nguoiNhap && (
                                <>
                                  <div className="text-[12px]">
                                    <span className="text-[#888]">Nhß║¡p: </span>
                                    <TenCB ten={row.nguoiNhap} ghiDe={row.nguoiNhapNgaySinh} />
                                  </div>
                                  {row.ngayNhap && (
                                    <div className="text-[11px] text-[#666] whitespace-nowrap">
                                      {row.ngayNhap}{row.gioNhap ? ` ${row.gioNhap}` : ""}
                                    </div>
                                  )}
                                </>
                              )}
                              {row.nguoiSua && (
                                <div className="pt-[5px] mt-[5px] border-t border-dashed border-[#eee]">
                                  <div className="text-[12px]">
                                    <span className="text-[#888]">Sß╗¡a: </span>
                                    <TenCB ten={row.nguoiSua} ghiDe={row.nguoiSuaNgaySinh} />
                                  </div>
                                  {row.ngaySua && (
                                    <div className="text-[11px] text-[#666] whitespace-nowrap">
                                      {row.ngaySua}{row.gioSua ? ` ${row.gioSua}` : ""}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Thao t├íc */}
                      <td className="border border-[#ddd] px-2 py-2.5 text-center align-top">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === row.id ? null : row.id); }}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded border border-[#ddd] hover:bg-[#f0f0f0] text-[#555]">
                            <span className="text-[16px] leading-none tracking-tighter">┬╖┬╖┬╖</span>
                          </button>
                          {openMenu === row.id && (
                            <ActionMenu
                              onClose={() => setOpenMenu(null)}
                              onViewDetail={() => onEditRow?.(row.id)}
                              onEdit={() => onEditRow?.(row.id)}
                              // ─É╞ín tr├╣ng kh├┤ng gh├⌐p ─æ╞░ß╗úc ΓÇö ß║⌐n lu├┤n h├ánh ─æß╗Öng cho
                              // khß╗Åi mß╗¥i gß╗ìi mß╗Öt thao t├íc sß║╜ bß╗ï tß╗½ chß╗æi.
                              onGhepDon={row.trungVoiDon ? undefined
                                : () => { setGhepDonChinh(row.id); setShowGhepDon(row.id); setOpenMenu(null); }}
                              // Bß╗ò sung t├ái liß╗çu chß╗ë ├íp dß╗Ñng cho ─æ╞ín Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn
                              onBoSung={row.giaiQuyet?.nhan === "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn"
                                ? () => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }
                                : undefined}
                              onTaoYeuCau={() => { setShowYeuCauBoSung(row.id); setOpenMenu(null); }}
                              onDonTrung={() => { setShowDonTrung(row.id); setOpenMenu(null); }}
                              // Y├¬u cß║ºu bß╗ò sung chß╗ë lß║¡p cho ─æ╞ín Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn
                              onThemYCBS={row.giaiQuyet?.nhan === "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn"
                                ? () => { setYcbsRowId(row.id); setOpenMenu(null); }
                                : undefined}
                              onChuyenDon={() => { setShowChuyenDon(row.id); setOpenMenu(null); }}
                              onHuySoThuLy={row.giaiQuyet?.nhan === "Thß╗Ñ l├╜ mß╗¢i"
                                ? () => { setShowHuySoThuLy(row.id); setOpenMenu(null); }
                                : undefined}
                              onThemKetQua={() => { setShowThemKetQua(row.id); setOpenMenu(null); }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#ddd] bg-[#fafafa]">
            <span className="text-[12px] text-[#666]">
              {filteredRows.length === 0
                ? "Kh├┤ng c├│ bß║ún ghi n├áo"
                : <>Hiß╗ân thß╗ï 1-{filteredRows.length} trong tß╗òng <b className="text-[#1d2e4f]">{filteredRows.length}</b> bß║ún ghi</>}
              {soBoLocDangApp > 0 && filteredRows.length !== rows.length && (
                <span className="text-[#8b1a1a]"> (─æ├ú lß╗ìc tß╗½ {rows.length} bß║ún ghi)</span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">ΓÇ╣</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#8b1a1a] rounded bg-[#8b1a1a] text-white text-[12px]">1</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">2</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">ΓÇ║</button>
              <div className="relative ml-2">
                <select className="h-[28px] px-2 pr-6 text-[12px] border border-[#ddd] rounded bg-white appearance-none">
                  <option>10 / trang</option>
                  <option>20 / trang</option>
                  <option>50 / trang</option>
                </select>
                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Popup Hß╗ºy gh├⌐p ─æ╞ín */}
      {showHuyGhep !== null && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === showHuyGhep);
        const ghepVoi = mergeState[showHuyGhep]?.ghepVoi;
        if (!row || !ghepVoi) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[420px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Hß╗ºy gh├⌐p ─æ╞ín</span>
                <button onClick={() => setShowHuyGhep(null)} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px]">
                <p className="text-[#333]">Bß║ín c├│ chß║»c chß║»n muß╗æn hß╗ºy gh├⌐p ─æ╞ín <span className="font-semibold text-[#1d2e4f]">{row.maDon}</span> vß╗¢i ─æ╞ín <span className="font-semibold text-[#1d2e4f]">{ghepVoi}</span>?</p>
                <p className="text-[11px] text-[#888]">Sau khi hß╗ºy, hai ─æ╞ín sß║╜ ─æ╞░ß╗úc t├ích ─æß╗Öc lß║¡p v├á kh├┤ng c├▓n li├¬n kß║┐t vß╗¢i nhau.</p>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">L├╜ do hß╗ºy gh├⌐p <span className="text-red-500">*</span></label>
                  <textarea rows={3} placeholder="Nhß║¡p l├╜ do hß╗ºy gh├⌐p ─æ╞ín..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setShowHuyGhep(null)}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  Hß╗ºy
                </button>
                <button
                  onClick={() => {
                    setMergeState(prev => {
                      const next = { ...prev };
                      // X├│a merge state cß╗ºa ─æ╞ín hiß╗çn tß║íi
                      const { ghepVoi: _, ...rest } = next[showHuyGhep!] ?? {};
                      if (Object.keys(rest).length === 0) delete next[showHuyGhep!]; else next[showHuyGhep!] = rest;
                      // X├│a merge state cß╗ºa ─æ╞ín ─æß╗æi ß╗⌐ng nß║┐u c├│
                      const matchId = SAMPLE_ROWS.find(r => r.maDon === ghepVoi)?.id;
                      if (matchId != null) {
                        const { ghepVoi: _2, ...rest2 } = next[matchId] ?? {};
                        if (Object.keys(rest2).length === 0) delete next[matchId]; else next[matchId] = rest2;
                      }
                      return next;
                    });
                    const matchRow = SAMPLE_ROWS.find(r => r.maDon === ghepVoi);
                    triggerNoti(`─É╞ín [${row.maDon}] cß╗ºa ${row.nguoiGui} ─æ├ú hß╗ºy gh├⌐p vß╗¢i ─æ╞ín [${matchRow?.maDon || ghepVoi}] cß╗ºa ${matchRow?.nguoiGui || "kh├┤ng x├íc ─æß╗ïnh"}`);
                    setShowHuyGhep(null);
                  }}
                  className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                  X├íc nhß║¡n hß╗ºy gh├⌐p
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Y├¬u cß║ºu bß╗ò sung */}
      {showYeuCauBoSung !== null && (
        <PopupYeuCauBoSung donId={showYeuCauBoSung} onClose={() => setShowYeuCauBoSung(null)} />
      )}

      {/* Popup Bß╗ò sung t├ái liß╗çu */}
      {showBoSungTaiLieu !== null && (
        <PopupBoSungTaiLieu
          row={rows.find(r => r.id === showBoSungTaiLieu)}
          onClose={() => setShowBoSungTaiLieu(null)}
          // L╞░u kß║┐t quß║ú bß╗ò sung ΓçÆ cß║¡p nhß║¡t lu├┤n trß║íng th├íi ─æ╞ín ngo├ái danh s├ích
          onLuu={(kq) => {
            setRows(prev => prev.map(r => r.id === showBoSungTaiLieu
              ? {
                ...r,
                giaiQuyet: {
                  ...r.giaiQuyet,
                  nhan: kq === "du" ? "Thß╗Ñ l├╜ mß╗¢i" : "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn",
                  color: kq === "du" ? "#27ae60" : "#e67e22",
                },
              }
              : r));
            triggerNoti(kq === "du"
              ? "─É├ú ghi nhß║¡n bß╗ò sung t├ái liß╗çu ΓÇö ─æ╞ín chuyß╗ân sang Thß╗Ñ l├╜ mß╗¢i."
              : "─É├ú ghi nhß║¡n bß╗ò sung t├ái liß╗çu ΓÇö ─æ╞ín vß║½n ch╞░a ─æß╗º ─æiß╗üu kiß╗çn.");
          }}
        />
      )}
      {/* Popup Hß╗ºy sß╗æ thß╗Ñ l├╜ */}
      {showHuySoThuLy !== null && (() => {
        const row = rows.find(r => r.id === showHuySoThuLy);
        if (!row) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[480px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Cß║únh b├ío hß╗ºy sß╗æ thß╗Ñ l├╜</span>
                <button onClick={() => setShowHuySoThuLy(null)} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px] text-[#333] leading-relaxed">
                <div className="bg-[#fff3cd] border border-[#ffeeba] rounded px-3 py-2.5 text-[#856404] font-medium">
                  Hß╗ºy sß╗æ thß╗Ñ l├╜ sß║╜ l├ám mß║Ñt sß╗æ thß╗Ñ l├╜ cß╗ºa ─æ╞ín n├áy. Sß╗æ thß╗Ñ l├╜ n├áy chß╗ë c├│ thß╗â cß║Ñp cho ─æ╞ín thß╗Ñ l├╜ mß╗¢i kh├íc trong c├╣ng ng├áy h├┤m nay. Nß║┐u ─æß╗â qua ng├áy, sß╗æ thß╗Ñ l├╜ sß║╜ bß╗ï trß╗æng.
                </div>
                <p>
                  Sau khi hß╗ºy, ─æ╞ín <strong className="text-[#1d2e4f]">{row.maDon}</strong> sß║╜ chuyß╗ân sang trß║íng th├íi <strong>Kh├┤ng thß╗Ñ l├╜</strong>.
                </p>
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setShowHuySoThuLy(null)}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  Hß╗ºy bß╗Å
                </button>
                <button
                  onClick={() => {
                    setRows(prev => prev.map(r => {
                      if (r.id === row.id) {
                        const currentHistory = r.processingHistory || [];
                        const newHistory = [
                          ...currentHistory,
                          {
                            date: new Date().toLocaleDateString("vi-VN"),
                            step: "Hß╗ºy sß╗æ thß╗Ñ l├╜",
                            actor: "HCTP",
                            note: `Hß╗ºy sß╗æ thß╗Ñ l├╜ ${r.giaiQuyet?.stl || ""}. ─É╞ín chuyß╗ân sang trß║íng th├íi Kh├┤ng thß╗Ñ l├╜.`
                          }
                        ];
                        return {
                          ...r,
                          giaiQuyet: {
                            nhan: "Kh├┤ng thß╗Ñ l├╜",
                            color: "#c0392b",
                            stl: "",
                            coVanBan: false
                          },
                          processingHistory: newHistory
                        };
                      }
                      return r;
                    }));
                    triggerNoti(`─É╞ín ${row.maDon} ─æ├ú hß╗ºy sß╗æ thß╗Ñ l├╜ th├ánh c├┤ng v├á chuyß╗ân sang trß║íng th├íi Kh├┤ng thß╗Ñ l├╜.`);
                    setShowHuySoThuLy(null);
                  }}
                  className="h-[30px] px-4 bg-[#c0392b] hover:bg-[#a63022] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                  X├íc nhß║¡n hß╗ºy
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Th├¬m kß║┐t quß║ú giß║úi quyß║┐t */}
      {showThemKetQua !== null && (() => {
        const row = rows.find(r => r.id === showThemKetQua);
        if (!row) return null;
        return (
          <PopupThemKetQuaGiaiQuyet
            row={row}
            onClose={() => setShowThemKetQua(null)}
            onConfirm={(updated: any) => {
              setRows(prev => prev.map(r => r.id === row.id ? updated : r));
              triggerNoti(`─É├ú th├¬m kß║┐t quß║ú giß║úi quyß║┐t cho ─æ╞ín ${row.maDon} th├ánh c├┤ng.`);
              setShowThemKetQua(null);
            }}
          />
        );
      })()}

      {/* Popup Chuyß╗ân ─æ╞ín */}
      {showChuyenDon !== null && (() => {
        const row = rows.find(r => r.id === showChuyenDon);
        if (!row) return null;
        
        // Kiß╗âm tra xem ─æ╞ín n├áy c├│ phß║úi ─É╞ín k├¿m kh├┤ng
        const isDonKem = !!mergeState[row.id]?.ghepVoi;
        const normMaDon = (ma?: string) => (ma || "").trim().toLowerCase();
        const isDonChinh = Object.values(mergeState).some(item => item.ghepVoi && normMaDon(item.ghepVoi) === normMaDon(row.maDon));

        // Lß║Ñy tß║Ñt cß║ú c├íc ─æ╞ín k├¿m trong nh├│m nß║┐u ─æ├óy l├á ─æ╞ín ch├¡nh
        const nhomDonKem = isDonChinh 
          ? rows.filter(r => mergeState[r.id]?.ghepVoi && normMaDon(mergeState[r.id].ghepVoi) === normMaDon(row.maDon))
          : [];

        const allOfficers = ["Ph├╣ng Tr├óm Anh", "Nguyß╗àn V─ân An", "Trß║ºn Thß╗ï B├¼nh", "L├¬ Thß╗ï H├á", "Phß║ím V─ân ─Éß╗⌐c", "Ho├áng Thß╗ï Thu", "V┼⌐ V─ân Y├¬n", "Nguyß╗àn Thß╗ï Lan", "Nguyß╗àn Minh An"];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[480px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Chuyß╗ân quyß╗ün quß║ún l├╜ ─æ╞ín</span>
                <button onClick={() => { setShowChuyenDon(null); setChuyenDonOfficer(""); setChuyenDonReason(""); }} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px]">
                {isDonKem ? (
                  <div className="bg-[#fdecea] border border-[#f5c6cb] rounded px-3 py-2 text-[#721c24]">
                    <strong>Kh├┤ng cho ph├⌐p chuyß╗ân ─æ╞ín k├¿m!</strong> ─É╞ín <strong>{row.maDon}</strong> ─æang l├á ─æ╞ín k├¿m trong nh├│m. Bß║ín phß║úi thß╗▒c hiß╗çn <strong>Hß╗ºy gh├⌐p</strong> tr╞░ß╗¢c khi c├│ thß╗â chuyß╗ân ─æ╞ín n├áy ─æß╗Öc lß║¡p.
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 bg-[#f9f9f9] p-3 border border-[#eee] rounded-sm">
                      <div><span className="text-[#666]">M├ú ─æ╞ín cß║ºn chuyß╗ân: </span><span className="font-semibold text-[#1d2e4f]">{row.maDon}</span></div>
                      <div><span className="text-[#666]">Ng╞░ß╗¥i gß╗¡i: </span><span className="text-[#333]">{row.nguoiGui}</span></div>
                      <div><span className="text-[#666]">C├ín bß╗Ö xß╗¡ l├╜ hiß╗çn tß║íi: </span><span className="font-medium text-[#333]">{row.nguoiNhap}</span></div>
                      {isDonChinh && (
                        <div className="mt-2 pt-2 border-t border-[#e6e6e6]">
                          <span className="font-bold text-[#b45309]">Cß║únh b├ío chuyß╗ân nh├│m ─æ╞ín (BR-06):</span>
                          <p className="text-[11px] text-[#666] mt-0.5">
                            ─É╞ín n├áy l├á <strong>─É╞ín ch├¡nh</strong> cß╗ºa nh├│m. Khi chuyß╗ân, to├án bß╗Ö c├íc ─æ╞ín k├¿m d╞░ß╗¢i ─æ├óy sß║╜ ─æ╞░ß╗úc chuyß╗ân c├╣ng sang c├ín bß╗Ö mß╗¢i:
                          </p>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-[#555]">
                            {nhomDonKem.map(dk => (
                              <li key={dk.id}><strong>{dk.maDon}</strong> ({dk.nguoiGui})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">Chß╗ìn c├ín bß╗Ö nhß║¡n <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={chuyenDonOfficer} onChange={e => setChuyenDonOfficer(e.target.value)}
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                          <option value="">-- Chß╗ìn c├ín bß╗Ö nhß║¡n --</option>
                          {allOfficers.filter(name => name !== row.nguoiNhap).map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">L├╜ do chuyß╗ân ─æ╞ín <span className="text-red-500">*</span></label>
                      <textarea rows={3} value={chuyenDonReason} onChange={e => setChuyenDonReason(e.target.value)}
                        placeholder="Nhß║¡p l├╜ do chuyß╗ân quyß╗ün quß║ún l├╜ ─æ╞ín..." 
                        className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => { setShowChuyenDon(null); setChuyenDonOfficer(""); setChuyenDonReason(""); }}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  ─É├│ng
                </button>
                {!isDonKem && (
                  <button
                    onClick={() => {
                      if (!chuyenDonOfficer || !chuyenDonReason.trim()) return;
                      
                      const targetMaDons = [row.maDon, ...nhomDonKem.map(dk => dk.maDon)];

                      setTransferState(prev => {
                        const next = { ...prev };
                        next[row.id] = {
                          toOfficer: chuyenDonOfficer,
                          fromOfficer: row.nguoiNhap,
                          reason: chuyenDonReason,
                          isGroup: isDonChinh,
                          maDons: targetMaDons
                        };
                        nhomDonKem.forEach(dk => {
                          next[dk.id] = {
                            toOfficer: chuyenDonOfficer,
                            fromOfficer: dk.nguoiNhap,
                            reason: chuyenDonReason,
                            isGroup: false,
                            maDons: [dk.maDon]
                          };
                        });
                        return next;
                      });

                      const msg = isDonChinh 
                        ? `─É├ú gß╗¡i y├¬u cß║ºu chuyß╗ân to├án bß╗Ö nh├│m ─æ╞ín (─É╞ín ch├¡nh ${row.maDon} v├á ${nhomDonKem.length} ─æ╞ín k├¿m) sang c├ín bß╗Ö ${chuyenDonOfficer}. Chß╗¥ x├íc nhß║¡n.`
                        : `─É├ú gß╗¡i y├¬u cß║ºu chuyß╗ân ─æ╞ín ${row.maDon} sang c├ín bß╗Ö ${chuyenDonOfficer}. Chß╗¥ x├íc nhß║¡n.`;

                      triggerNoti(msg);
                      
                      setShowChuyenDon(null);
                      setChuyenDonOfficer("");
                      setChuyenDonReason("");
                    }}
                    disabled={!chuyenDonOfficer || !chuyenDonReason.trim()}
                    className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    X├íc nhß║¡n chuyß╗ân
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Gh├⌐p ─æ╞ín */}
      {showGhepDon !== null && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === showGhepDon);
        if (!row) return null;
        return (
          <PopupGhepDon
            donChinh={{ maDon: row.maDon, nguoiGui: row.nguoiGui, soBA: row.thongTinDon.soBaqd, ngayBA: row.thongTinDon.ngay, toaXetXu: row.thongTinDon.toaXetXu }}
            onClose={() => setShowGhepDon(null)}
            onNext={(sel) => { setGhepSelected(sel); setShowGhepDon(null); setShowXacNhan(true); }}

          />
        );
      })()}

      {/* Popup X├íc nhß║¡n gh├⌐p */}
      {showXacNhan && (() => {
        const row = rows.find(r => r.id === ghepDonChinh) ?? rows[0];
        return (
          <PopupXacNhanGhep
            donChinh={{ maDon: row.maDon, nguoiGui: row.nguoiGui, soBA: row.thongTinDon.soBaqd, ngayBA: row.thongTinDon.ngay, toaXetXu: row.thongTinDon.toaXetXu }}
            donGhep={ghepSelected}
            onClose={() => { setShowXacNhan(false); setGhepSelected([]); }}
            onConfirm={() => {
              // Gh├⌐p ngay lß║¡p tß╗⌐c (v├¼ chß╗ë ─æ╞░ß╗úc ph├⌐p gh├⌐p ─æ╞ín cß╗ºa c├╣ng c├ín bß╗Ö xß╗¡ l├╜)
              const donChinhRow = rows.find(r => r.id === ghepDonChinh) ?? rows[0];
              setMergeState(prev => {
                const next = { ...prev };
                ghepSelected.forEach(d => {
                  next[d.id] = { ghepVoi: donChinhRow.maDon };
                });
                return next;
              });
              triggerNoti(`─É╞ín [${ghepSelected.map(d => d.maDon).join("], [")}] ─æ├ú ─æ╞░ß╗úc gh├⌐p th├ánh c├┤ng v├áo ─æ╞ín ch├¡nh [${donChinhRow.maDon}].`);
              setShowXacNhan(false);
              setGhepSelected([]);
            }}
          />
        );
      })()}

      {/* Popup L╞░u sß╗æ v─ân bß║ún (NEW) */}
      {showNumberingModal !== null && (
        <DocumentNumberingModal
          isOpen={true}
          currentRole={currentRole}
          loaiVanBanMacDinh={loaiVanBan}
          // Ch╞░a tick d├▓ng n├áo th├¼ lß║Ñy to├án bß╗Ö ─æ╞ín ─æang hiß╗ân thß╗ï theo bß╗Ö lß╗ìc
          selectedRows={
            filteredRows.filter(r => selectedRows.includes(r.id)).length > 0
              ? filteredRows.filter(r => selectedRows.includes(r.id))
              : filteredRows
          }
          // Chß╗ë ghi v├áo kho ΓÇö KH├öNG ─æ├│ng modal ß╗ƒ ─æ├óy, ─æß╗â popup "Tr├¼nh duyß╗çt
          // th├ánh c├┤ng" cß╗ºa ch├¡nh modal c├▓n kß╗ïp hiß╗çn ra.
          onTrinhDuyet={(kq) => onTaoVanBan?.(kq)}
          // Sang m├án Danh s├ích v─ân bß║ún, lß╗ìc sß║╡n theo m├ú ─æ╞ín khi chß╗ë tr├¼nh 1 ─æ╞ín
          onXemVanBanDaTrinh={() => {
            const ds = filteredRows.filter(r => selectedRows.includes(r.id));
            const dsTrinh = ds.length > 0 ? ds : filteredRows;
            setShowNumberingModal(null);
            onXemVanBanDaTrinh?.(dsTrinh.length === 1 ? dsTrinh[0].maDon.trim() : "");
          }}
          onClose={() => setShowNumberingModal(null)}
          // Mß╗Öt ─æ╞ín c├│ thß╗â lß╗ìt v├áo nhiß╗üu v─ân bß║ún; lß║Ñy bß║ún c├│ sß╗æ l├ám ─æß║íi diß╗çn
          // (cß╗Ñ thß╗â h╞ín cho ng╞░ß╗¥i d├╣ng), k├¿m sß╗æ l╞░ß╗úng c├▓n lß║íi nß║┐u c├│.
          donTrung={donTrungMap}
        />
      )}

      {/* Th├¬m y├¬u cß║ºu bß╗ò sung tß╗½ menu thao t├íc ΓÇö mß╗ƒ thß║│ng modal L╞░u sß╗æ v─ân bß║ún
          ß╗ƒ loß║íi "Y├¬u cß║ºu bß╗ò sung", chß╗ë vß╗¢i ─æ├║ng ─æ╞ín vß╗½a chß╗ìn */}
      {ycbsRowId !== null && (() => {
        const donYcbs = rows.find(r => r.id === ycbsRowId);
        if (!donYcbs) return null;
        return (
          <DocumentNumberingModal
            isOpen={true}
            currentRole={currentRole}
            loaiVanBanMacDinh="Y├¬u cß║ºu bß╗ò sung"
            selectedRows={[donYcbs]}
            onTrinhDuyet={(kq) => onTaoVanBan?.(kq)}
            onXemVanBanDaTrinh={() => {
              setYcbsRowId(null);
              onXemVanBanDaTrinh?.(donYcbs.maDon.trim());
            }}
            onClose={() => setYcbsRowId(null)}
            donTrung={donTrungMap}
          />
        );
      })()}

      {/* In danh s├ích ─æ╞ín theo bß╗Ö lß╗ìc ─æang ├íp */}
      {showInDanhSach && (
        <PopupInDanhSachDon
          rows={rowsDeIn}
          moTaBoLoc={selectedRows.length ? [...moTaBoLoc, `${selectedRows.length} ─æ╞ín ─æ╞░ß╗úc chß╗ìn`] : moTaBoLoc}
          nguoiIn={nguoiTheoVaiTro(currentRole)}
          tieuDe={tieuDeIn}
          phuDe={phuDeIn}
          onDong={() => setShowInDanhSach(false)}
        />
      )}

      {/* Popup Th├¬m ─æ╞ín tr├╣ng */}
      {showDonTrung !== null && (() => {
        const goc = rows.find(r => r.id === showDonTrung);
        return goc ? (
          <PopupThemDonTrung donGoc={goc} onDong={() => setShowDonTrung(null)}
            onLuu={(ds) => taoDonTrung(goc, ds)} />
        ) : null;
      })()}

      {/* Popup L╞░u sß╗æ v─ân bß║ún */}
      {showLuuSoVanBan && (
        <PopupLuuSoVanBan
          rows={rows.filter(r => selectedRows.includes(r.id))}
          onClose={() => setShowLuuSoVanBan(false)}
          onXemBieuMau={() => { setShowLuuSoVanBan(false); onWordEditor?.(); }}
        />
      )}
      {historyRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[4px] shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
              <div>
                <div className="text-[14px] font-semibold text-[#1d2e4f]">Lß╗ïch sß╗¡ xß╗¡ l├╜ HCTP</div>
                <div className="text-[12px] text-[#666]">{historyRow.maDon} ┬╖ {historyRow.nguoiGui}</div>
              </div>
              <button onClick={() => setHistoryRow(null)} className="text-[#888] hover:text-[#333]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-112px)]">
              {historyRow.processingHistory?.map((item, idx) => (
                <div key={idx} className="rounded-[4px] bg-[#f8fafc] border border-[#d6e4ef] p-3">
                  <div className="text-[12px] text-[#1d2e4f] font-semibold">{item.date}</div>
                  <div className="text-[13px] font-medium text-[#333]">{item.step}</div>
                  <div className="text-[12px] text-[#555]">{item.actor}{item.note ? ` ┬╖ ${item.note}` : ""}</div>
                </div>
              )) ?? (
                  <div className="text-[12px] text-[#666]">Kh├┤ng c├│ lß╗ïch sß╗¡ xß╗¡ l├╜.</div>
                )}
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-[#e0e0e0]">
              <button onClick={() => setHistoryRow(null)}
                className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium">
                ─É├│ng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup tiß║┐n ─æß╗Ö tr├¼nh k├╜ ΓÇö timeline 4 b╞░ß╗¢c */}
      {trinhKyRow && (() => {
        const tk = tienDoTrinhKy(trinhKyRow);
        const soXong = tk.buocs.filter(b => b.trangThai === "xong").length;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-[4px] shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <div>
                  <div className="text-[14px] font-semibold text-[#1d2e4f]">Tiß║┐n ─æß╗Ö tr├¼nh k├╜ v─ân bß║ún</div>
                  <div className="text-[12px] text-[#666]">{trinhKyRow.maDon} ┬╖ {trinhKyRow.nguoiGui}</div>
                </div>
                <button onClick={() => setTrinhKyRow(null)} className="text-[#888] hover:text-[#333]"><X size={18} /></button>
              </div>

              {/* Kß║┐t quß║ú cuß╗æi + thanh tiß║┐n ─æß╗Ö */}
              <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] text-[#555]">Kß║┐t quß║ú hiß╗çn tß║íi:</span>
                  <span className={`inline-block px-2 py-[3px] rounded text-[11px] font-semibold border ${tk.cls}`}>
                    {tk.ketQua}
                  </span>
                  {tk.soVanBan && <span className="text-[12px] text-[#555]">┬╖ Sß╗æ VB: <span className="font-medium text-[#333]">{tk.soVanBan}</span></span>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-[6px] rounded-full bg-[#e4e9ef] overflow-hidden">
                    <div className="h-full bg-[#27ae60] transition-all"
                      style={{ width: `${(soXong / tk.buocs.length) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-[#666] whitespace-nowrap">{soXong}/{tk.buocs.length} b╞░ß╗¢c</span>
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-210px)]">
                {tk.buocs.map((b, i) => {
                  const mau = {
                    xong: { vien: "border-[#a9debb]", nen: "bg-[#e8f7ee]", chu: "text-[#1a7a45]", icon: <Check size={13} /> },
                    dang: { vien: "border-[#ffecb5]", nen: "bg-[#fff8e6]", chu: "text-[#856404]", icon: <Clock size={13} /> },
                    cho: { vien: "border-[#e0e0e0]", nen: "bg-white", chu: "text-[#999]", icon: <Clock size={13} /> },
                    tuchoi: { vien: "border-[#e6a5a0]", nen: "bg-[#fdecea]", chu: "text-[#c0392b]", icon: <X size={13} /> },
                  }[b.trangThai];
                  return (
                    <div key={i} className="flex gap-3">
                      {/* Cß╗Öt mß╗æc + ─æ╞░ß╗¥ng nß╗æi */}
                      <div className="flex flex-col items-center">
                        <div className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center flex-shrink-0 ${mau.vien} ${mau.nen} ${mau.chu}`}>
                          {mau.icon}
                        </div>
                        {i < tk.buocs.length - 1 && (
                          <div className={`w-[2px] flex-1 min-h-[26px] ${b.trangThai === "xong" ? "bg-[#a9debb]" : "bg-[#e4e4e4]"}`} />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[13px] font-medium ${b.trangThai === "cho" ? "text-[#999]" : "text-[#333]"}`}>
                            {i + 1}. {b.ten}
                          </span>
                          <span className={`text-[10px] px-1.5 py-[1px] rounded border ${mau.vien} ${mau.nen} ${mau.chu}`}>
                            {{ xong: "Ho├án th├ánh", dang: "─Éang xß╗¡ l├╜", cho: "Chß╗¥", tuchoi: "Trß║ú lß║íi" }[b.trangThai]}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#555] mt-0.5">
                          {b.vaiTro}: <span className="text-[#333]">{b.nguoi}</span>
                          {b.thoiGian && <span className="text-[#888]"> ┬╖ {b.thoiGian}</span>}
                        </div>
                        {b.ghiChu && <div className="text-[11px] text-[#c0392b] mt-0.5">{b.ghiChu}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end px-4 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setTrinhKyRow(null)}
                  className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium">
                  ─É├│ng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {showTraLai && (
        <PopupTraLaiDon
          count={selectedRows.length}
          reason={traLaiReason}
          onChangeReason={setTraLaiReason}
          isTruongPhong={!!isTruongPhong}
          onClose={() => { setShowTraLai(false); setTraLaiReason(""); }}
          onConfirm={() => {
            const nextRows = rows.map(row => selectedRows.includes(row.id)
              ? {
                ...row,
                traLai: {
                  status: isTruongPhong ? "returned" as const : "pendingApproval" as const,
                  reason: traLaiReason || "Kh├┤ng c├│ l├╜ do cß╗Ñ thß╗â",
                  by: isTruongPhong ? "Tr╞░ß╗ƒng ph├▓ng" : "C├ín bß╗Ö",
                },
              }
              : row
            );
            setRows(nextRows);
            setShowTraLai(false);
            setSelectedRows([]);
            setTraLaiReason("");
          }}
        />
      )}
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Popup L╞░u sß╗æ v─ân bß║ún ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const LOAI_VAN_BAN_OPTIONS = [
  "Giß║Ñy x├íc nhß║¡n",
  "Giß║Ñy x├íc nhß║¡n c╞í quan chuyß╗ân ─æ╞ín",
  "C├┤ng v─ân chuyß╗ân nß╗Öi bß╗Ö",
  "C├┤ng v─ân chuyß╗ân t├▓a kh├íc",
  "C├┤ng v─ân chuyß╗ân ngo├ái",
  "Trß║ú lß║íi ─æ╞ín",
  "Tß╗¥ tr├¼nh",
  "Tß╗¥ tr├¼nh x├⌐t xß╗¡ G─ÉT",
  "Th├┤ng b├ío ph├ón c├┤ng TP",
  "Tß╗¥ tr├¼nh thß╗Ñ l├╜ lß║íi",
  "Y├¬u cß║ºu bß╗ò sung",
];

const NGUOI_OPTIONS = ["Phß║ím V─ân Nha", "Nguyß╗àn V─ân Hiß╗ün", "Trß║ºn Thß╗ï Lan", "L├¬ V─ân ─Éß╗⌐c"];

const PopupLuuSoVanBan = ({ rows: initialRows, onClose, onXemBieuMau, currentRole = "can-bo", onCreateToTrinh }: {
  rows: typeof SAMPLE_ROWS;
  onClose: () => void;
  onXemBieuMau: () => void;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  onCreateToTrinh?: (t: ToTrinh) => void;
}) => {
  const [loai, setLoai] = useState("");
  const [nguoiDuyet, setNguoiDuyet] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [status, setStatus] = useState<"tao_van_ban" | "lay_so" | "trinh_duyet" | "duyet" | "trinh_ky" | "da_ky">("tao_van_ban");
  const [localRows, setLocalRows] = useState(initialRows);

  const [soToTrinh, setSoToTrinh] = useState("");
  const [nguoiDuyetRow, setNguoiDuyetRow] = useState<Record<number, string>>({});
  const [nguoiKyRow, setNguoiKyRow] = useState<Record<number, string>>({});

  const groupedRows = useMemo(() => {
    if (loai !== "Tß╗¥ tr├¼nh") return { "Tß║Ñt cß║ú": localRows };
    const groups: Record<string, typeof localRows> = {};
    localRows.forEach(row => {
      const tp = row.thongTinDon?.thamPhan || "Ch╞░a x├íc ─æß╗ïnh";
      if (!groups[tp]) groups[tp] = [];
      groups[tp].push(row);
    });
    return groups;
  }, [localRows, loai]);

  const removeRow = (id: number) => setLocalRows(prev => prev.filter(r => r.id !== id));

  // ─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn ─æ╞░a v├áo v─ân bß║ún ΓÇö bß╗Å h├áng loß║ít thay v├¼ x├│a tß╗½ng d├▓ng
  const invalidRows = useMemo(() => localRows.filter(r => lyDoKhongHopLe(r)), [localRows]);
  const removeInvalidRows = () => setLocalRows(prev => prev.filter(r => !lyDoKhongHopLe(r)));

  const BIEU_MAU_PER_ROW: Record<number, { ten: string; so: string }[]> = {
    1: [
      { ten: "Th├┤ng b├ío ph├ón c├┤ng Thß║⌐m ph├ín", so: "54682577/2026/TANDTC-TB" },
      { ten: "Tß╗¥ tr├¼nh thß╗Ñ l├╜ lß║íi", so: "107/2026/TTr-TANDTC-VP" },
    ],
    2: [
      { ten: "C├┤ng v─ân gß╗¡i nß╗Öi bß╗Ö", so: "545/2026/TANDTC-VP" },
    ],
    3: [
      { ten: "Th├┤ng b├ío ph├ón c├┤ng Thß║⌐m ph├ín", so: "54682578/2026/TANDTC-TB" },
      { ten: "Tß╗¥ tr├¼nh x├⌐t xß╗¡ G─ÉT", so: "108/2026/TTr-TANDTC-VP" },
    ],
    4: [
      { ten: "C├┤ng v─ân chuyß╗ân t├▓a kh├íc", so: "546/2026/TANDTC-VP" },
    ],
    5: [
      { ten: "Trß║ú lß║íi ─æ╞ín", so: "201/2026/TANDTC-VP" },
    ],
    6: [
      { ten: "Giß║Ñy x├íc nhß║¡n", so: "301/2026/TANDTC-GXN" },
    ],
  };

  const getSoCongVan = (rowId: number, idx: number) =>
    `${String(54682570 + rowId * 3 + idx).slice(-5)}/2026/TANDTC-CV`;

  const CONG_VAN_OPTIONS = [
    "Th├┤ng b├ío ph├ón c├┤ng Thß║⌐m ph├ín",
    "Tß╗¥ tr├¼nh thß╗Ñ l├╜ lß║íi",
    "Tß╗¥ tr├¼nh x├⌐t xß╗¡ G─ÉT",
    "C├┤ng v─ân chuyß╗ân nß╗Öi bß╗Ö",
    "C├┤ng v─ân chuyß╗ân t├▓a kh├íc",
    "C├┤ng v─ân chuyß╗ân ngo├ái",
    "Giß║Ñy x├íc nhß║¡n",
    "Trß║ú lß║íi ─æ╞ín",
    "Y├¬u cß║ºu bß╗ò sung",
  ];

  const [selectedCongVan, setSelectedCongVan] = useState<Record<number, string[]>>({});
  const [openDropRow, setOpenDropRow] = useState<number | null>(null);

  const toggleCongVan = (rowId: number, val: string) => {
    setSelectedCongVan(prev => {
      const cur = prev[rowId] ?? [];
      return { ...prev, [rowId]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  const SelectField = ({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder: string, disabled?: boolean }) => (
    <div className="flex-1">
      <label className="block text-[12px] font-medium text-[#333] mb-1">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          className={`w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8] ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}>
          <option value="">{placeholder}</option>
          {(label === "Loß║íi v─ân bß║ún" ? LOAI_VAN_BAN_OPTIONS : NGUOI_OPTIONS).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[960px] max-h-[90vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <FileText size={15} />
            <span className="text-[14px] font-semibold">L╞░u v─ân bß║ún & in b├ío c├ío</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Fields row */}
          <div className="flex items-end gap-3">
            <SelectField label="Loß║íi v─ân bß║ún" value={loai} onChange={setLoai} placeholder="Chß╗ìn loß║íi v─ân bß║ún" disabled={status === "da_ky"} />
            <SelectField label="Ng╞░ß╗¥i duyß╗çt" value={nguoiDuyet} onChange={setNguoiDuyet} placeholder="Chß╗ìn ng╞░ß╗¥i duyß╗çt" disabled={status === "da_ky"} />
            <SelectField label="Ng╞░ß╗¥i k├╜" value={nguoiKy} onChange={setNguoiKy} placeholder="Chß╗ìn ng╞░ß╗¥i k├╜" disabled={status === "da_ky"} />
            {loai === "Tß╗¥ tr├¼nh" && (
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-[#333] mb-1">Sß╗æ tß╗¥ tr├¼nh</label>
                <input type="text" value={soToTrinh} onChange={e => setSoToTrinh(e.target.value)} disabled={status === "da_ky"}
                  className={`w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] ${status === "da_ky" ? "bg-gray-100 text-gray-500" : "bg-white"}`}
                  placeholder="Nhß║¡p sß╗æ tß╗¥ tr├¼nh..." />
              </div>
            )}
            <div className="flex-shrink-0">
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#2980b9] hover:bg-[#1a6a9a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Printer size={13} /> In v─ân bß║ún
              </button>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold text-[#333]">
                Danh s├ích c├┤ng v─ân ({localRows.length})
              </p>
              <div className="flex items-center gap-2">
                {status === "tao_van_ban" && (
                  <button onClick={() => setStatus("lay_so")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Save size={12} /> Tß║ío v─ân bß║ún
                  </button>
                )}
                {status === "lay_so" && (
                  <button onClick={() => setStatus("trinh_duyet")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <ArrowDownToLine size={12} /> Lß║Ñy sß╗æ
                  </button>
                )}
                {status === "trinh_duyet" && (
                  <button onClick={() => setStatus("duyet")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Send size={12} /> Tr├¼nh duyß╗çt
                  </button>
                )}
                {status === "duyet" && (
                  <button onClick={() => setStatus("trinh_ky")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Check size={12} /> Duyß╗çt
                  </button>
                )}
                {status === "trinh_ky" && (
                  <button onClick={() => { setStatus("da_ky"); if (onCreateToTrinh) { onCreateToTrinh({ id: String(Math.floor(Math.random() * 1000) + 100), tenVuAn: "-", noiDung: "Tß╗¥ tr├¼nh ph├ón c├┤ng", loai: "Tß╗¥ tr├¼nh", nguoiDeXuat: "Ph├│ Ch├ính V─ân Ph├▓ng", ngayDeXuat: new Date().toLocaleString("vi-VN"), trangThai: "Chß╗¥ duyß╗çt", yKienLanhDao: "", danhSachDon: initialRows }); } }} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <PenLine size={12} /> Tr├¼nh k├╜
                  </button>
                )}
                {status === "da_ky" && (
                  <div className="flex items-center gap-1.5 h-[28px] px-3 border border-[#27ae60] text-[#27ae60] rounded-[3px] text-[11px] font-bold">
                    <Check size={12} /> ─É├ú k├╜
                  </div>
                )}
              </div>
            </div>
            {/* Cß║únh b├ío ─æ╞ín kh├┤ng hß╗úp lß╗ç + bß╗Å tß║Ñt cß║ú bß║▒ng 1 n├║t */}
            {invalidRows.length > 0 && (
              <div className="flex items-start gap-2 px-3 py-2 mb-3 bg-[#fdecea] border border-[#e57373] rounded-[3px] text-[12px] text-[#8b1a1a]">
                <AlertCircle size={14} className="flex-shrink-0 mt-[1px]" />
                <div className="min-w-0">
                  <div>
                    <b>{invalidRows.length}/{localRows.length}</b> ─æ╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn ─æ╞░a v├áo v─ân bß║ún.
                  </div>
                  <div className="text-[11px] text-[#a94442] mt-0.5">
                    {[...new Set(invalidRows.map(r => lyDoKhongHopLe(r)))].join(" ┬╖ ")}
                  </div>
                </div>
                <button
                  onClick={removeInvalidRows}
                  className="ml-auto flex-shrink-0 inline-flex items-center gap-1 h-[26px] px-2.5 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[11px] font-semibold transition-colors whitespace-nowrap">
                  <Trash2 size={11} /> Bß╗Å {invalidRows.length} ─æ╞ín kh├┤ng hß╗úp lß╗ç
                </button>
              </div>
            )}

            {localRows.length === 0 ? (
              <div className="border border-[#ddd] rounded-[3px] py-8 text-center text-[12px] text-[#999]">
                Ch╞░a c├│ ─æ╞ín n├áo
              </div>
            ) : (
              <div className="space-y-4">
                {(Object.entries(groupedRows) as [string, typeof localRows][]).map(([groupName, gRows]) => (
                  <div key={groupName}>
                    {loai === "Tß╗¥ tr├¼nh" && (
                      <div className="bg-[#e8f0fe] text-[#1a5a96] font-semibold text-[13px] px-3 py-1.5 rounded-t-[3px] border border-[#c5d8f8] border-b-0">
                        Thß║⌐m ph├ín: {groupName} ({gRows.length} ─æ╞ín)
                      </div>
                    )}
                    <table className="w-full border-collapse text-[12px]">
                      <thead>
                        <tr className="bg-[#f5f5f5]">
                          <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[36px]">STT</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[90px]">Sß╗æ c├┤ng v─ân</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Th├┤ng tin ng╞░ß╗¥i gß╗¡i</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Th├┤ng tin ─æ╞ín</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Ng╞░ß╗¥i duyß╗çt</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Ng╞░ß╗¥i k├╜</th>
                          <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[90px]">Thao t├íc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gRows.map((row: (typeof localRows)[0], i: number) => {
                          const d = row.thongTinDon;
                          const lyDo = lyDoKhongHopLe(row);
                          return (
                            <tr key={row.id} className={`align-top ${lyDo ? "bg-[#fdf3f2]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                              <td className="border border-[#ddd] px-2 py-2 text-center">
                                <div>{i + 1}</div>
                                {lyDo && <AlertCircle size={12} className="mx-auto mt-1 text-[#c0392b]" />}
                              </td>
                              <td className="border border-[#ddd] px-3 py-2">
                                {loai === "Tß╗¥ tr├¼nh" ? (
                                  <span className="text-[#999] font-bold">ΓÇö</span>
                                ) : status !== "tao_van_ban" && status !== "lay_so" ? (
                                  <div className="space-y-1.5">
                                    <div className="font-medium text-[#1d2e4f] text-[11px] mb-1">{getSoCongVan(row.id, i)}</div>
                                    {/* Combobox chß╗ìn c├┤ng v─ân k├¿m theo (cho loß║íi kh├íc Tß╗¥ tr├¼nh) */}
                                    <div className="relative">
                                      <button
                                        onClick={() => setOpenDropRow(openDropRow === row.id ? null : row.id)}
                                        className="flex items-center justify-between w-full h-[26px] px-2 border border-[#ccc] rounded-[3px] bg-white text-[11px] text-[#333] hover:border-[#1a73e8] transition-colors">
                                        <span className="truncate text-[#666]">
                                          {(selectedCongVan[row.id] ?? []).length === 0
                                            ? "V─ân bß║ún k├¿m theo..."
                                            : `${(selectedCongVan[row.id] ?? []).length} v─ân bß║ún`}
                                        </span>
                                        <ChevronDown size={10} className="shrink-0 text-[#888] ml-1" />
                                      </button>
                                      {openDropRow === row.id && (
                                        <div className="absolute left-0 top-[28px] z-50 bg-white border border-[#ccc] rounded-[3px] shadow-lg w-[220px]">
                                          {CONG_VAN_OPTIONS.map(opt => (
                                            <label key={opt}
                                              className="flex items-center gap-2 px-2 py-[5px] hover:bg-[#f0f7ff] cursor-pointer text-[11px] text-[#333]">
                                              <input type="checkbox"
                                                className="w-[12px] h-[12px] accent-[#8b1a1a] shrink-0"
                                                checked={(selectedCongVan[row.id] ?? []).includes(opt)}
                                                onChange={() => toggleCongVan(row.id, opt)} />
                                              {opt}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {(selectedCongVan[row.id] ?? []).map((cv, ci) => (
                                      <button key={ci} onClick={onXemBieuMau}
                                        className="flex items-center gap-1 text-left w-full group mt-1">
                                        <FileText size={10} className="text-[#2980b9] shrink-0" />
                                        <span className="text-[10px] text-[#2980b9] group-hover:underline leading-snug truncate">{cv}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[#999]">ΓÇö</span>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-3 py-2">
                                {loai === "Tß╗¥ tr├¼nh" ? (
                                  <div className="space-y-1.5">
                                    <div className="font-semibold text-[#8b1a1a]">Tß╗¥ tr├¼nh</div>
                                    <div className="relative">
                                      <button
                                        onClick={() => setOpenDropRow(openDropRow === row.id ? null : row.id)}
                                        className="flex items-center justify-between w-full h-[26px] px-2 border border-[#ccc] rounded-[3px] bg-[#fffaf7] text-[11px] text-[#333] hover:border-[#8b1a1a] transition-colors">
                                        <span className="truncate text-[#666]">
                                          {(selectedCongVan[row.id] ?? []).length === 0
                                            ? "V─ân bß║ún k├¿m theo..."
                                            : `${(selectedCongVan[row.id] ?? []).length} v─ân bß║ún`}
                                        </span>
                                        <ChevronDown size={10} className="shrink-0 text-[#888] ml-1" />
                                      </button>
                                      {openDropRow === row.id && (
                                        <div className="absolute left-0 top-[28px] z-50 bg-white border border-[#ccc] rounded-[3px] shadow-lg w-[220px]">
                                          {CONG_VAN_OPTIONS.map(opt => (
                                            <label key={opt}
                                              className="flex items-center gap-2 px-2 py-[5px] hover:bg-[#fff5f5] cursor-pointer text-[11px] text-[#333]">
                                              <input type="checkbox"
                                                className="w-[12px] h-[12px] accent-[#8b1a1a] shrink-0"
                                                checked={(selectedCongVan[row.id] ?? []).includes(opt)}
                                                onChange={() => toggleCongVan(row.id, opt)} />
                                              {opt}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {(selectedCongVan[row.id] ?? []).map((cv, ci) => (
                                      <button key={ci} onClick={onXemBieuMau}
                                        className="flex items-center gap-1 text-left w-full group mt-1">
                                        <FileText size={10} className="text-[#8b1a1a] shrink-0" />
                                        <span className="text-[10px] text-[#8b1a1a] group-hover:underline leading-snug truncate">{cv}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="font-medium text-[#1a5a96] leading-snug">{row.nguoiGui}</div>
                                    <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{row.diaChi}</div>
                                  </>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-3 py-2">
                                <div className="space-y-[2px] leading-snug">
                                  {lyDo && (
                                    <div className="mb-1">
                                      <span className="inline-flex items-center gap-1 bg-[#fdecea] text-[#8b1a1a] border border-[#e57373] text-[10px] font-bold px-1.5 py-[2px] rounded-sm">
                                        <AlertCircle size={10} /> Kh├┤ng hß╗úp lß╗ç
                                      </span>
                                      <span className="ml-1.5 text-[11px] text-[#a94442]">{lyDo}</span>
                                    </div>
                                  )}
                                  <div><span className="text-[#888]">Th├┤ng tin giß║úi quyß║┐t: </span><span>{row.giaiQuyet.nhan || "ΓÇö"}</span></div>
                                  <div><span className="text-[#888]">Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín: </span><span>{row.nguoiGui}</span></div>
                                  <div><span className="text-[#888]">Ng├áy tr├¬n ─æ╞ín: </span><span>{d.ngayCV}</span></div>
                                  <div><span className="text-[#888]">Ng├áy nhß║¡n: </span><span>{row.ngayNhap}</span></div>
                                  <div><span className="text-[#888]">M├ú ─æ╞ín: </span><span className="font-medium text-[#1a5a96]">{row.maDon}</span></div>
                                  <div><span className="text-[#888]">H├¼nh thß╗⌐c: </span><span>{d.hinhThuc}</span></div>
                                  <div><span className="text-[#888]">Sß╗æ BA/Q─É: </span><span>{d.soBaqd}</span></div>
                                  <div><span className="text-[#888]">Ng├áy: </span><span>{d.ngay}</span></div>
                                  <div><span className="text-[#888]">Thß╗º tß╗Ñc giß║úi quyß║┐t: </span><span>{d.thuTuc}</span></div>
                                  <div><span className="text-[#888]">Thß║⌐m ph├ín: </span><span>{d.thamPhan || "ΓÇö"}</span></div>
                                  <div className="mt-1">
                                    <span className="inline-block px-1.5 py-[1px] rounded text-[10px] bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">Ch╞░a chuyß╗ân</span>
                                    <span className="text-[#888] ml-1 text-[11px]">{d.donViGiaiQuyet}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                {loai === "Tß╗¥ tr├¼nh" ? (
                                  <select
                                    value={nguoiDuyetRow[row.id] ?? nguoiDuyet}
                                    onChange={(e) => setNguoiDuyetRow({ ...nguoiDuyetRow, [row.id]: e.target.value })}
                                    className="w-full h-[26px] px-1 text-[11px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                                  >
                                    <option value="">Chß╗ìn ng╞░ß╗¥i duyß╗çt...</option>
                                    {NGUOI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <div className="text-[11px] text-[#555]">{nguoiDuyet || "ΓÇö"}</div>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                {loai === "Tß╗¥ tr├¼nh" ? (
                                  <select
                                    value={nguoiKyRow[row.id] ?? nguoiKy}
                                    onChange={(e) => setNguoiKyRow({ ...nguoiKyRow, [row.id]: e.target.value })}
                                    className="w-full h-[26px] px-1 text-[11px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                                  >
                                    <option value="">Chß╗ìn ng╞░ß╗¥i k├╜...</option>
                                    {NGUOI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <div className="text-[11px] text-[#555]">{nguoiKy || "ΓÇö"}</div>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                <div className="flex flex-col items-center gap-1">
                                  {/* Xem biß╗âu mß║½u */}
                                  <button
                                    onClick={onXemBieuMau}
                                    className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8] hover:bg-[#d0e3fc] transition-colors whitespace-nowrap">
                                    <Eye size={11} /> Xem biß╗âu mß║½u
                                  </button>
                                  {/* X├│a */}
                                  <button
                                    onClick={() => removeRow(row.id)}
                                    className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                    <Trash2 size={11} /> X├│a
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          {/* N├║t sau khi l╞░u */}
          {status !== "tao_van_ban" ? (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <ArrowDownToLine size={13} /> Lß║Ñy sß╗æ
              </button>
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Send size={13} /> Tr├¼nh k├╜
              </button>
            </div>
          ) : <div />}
          <div className="flex items-center gap-2">
            <BtnSecondary onClick={onClose}>Hß╗ºy</BtnSecondary>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupTraLaiDon = ({
  count,
  reason,
  onChangeReason,
  isTruongPhong,
  onClose,
  onConfirm,
}: {
  count: number;
  reason: string;
  onChangeReason: (value: string) => void;
  isTruongPhong: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [suaDon, setSuaDon] = useState(false);
  const [tachDon, setTachDon] = useState(false);
  const [tachSoDon, setTachSoDon] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[480px] max-w-full border border-[#bbb]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
          <div>
            <div className="text-[15px] font-semibold text-[#1d2e4f]">Trß║ú lß║íi ─æ╞ín</div>
            <div className="text-[12px] text-[#555]">─Éang trß║ú lß║íi {count} ─æ╞ín ─æ├ú chß╗ìn</div>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]"><X size={16} /></button>
        </div>
        <div className="px-4 py-4 space-y-4 text-[12px]">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-[12px] text-[#333]">
              <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" checked={suaDon} onChange={() => setSuaDon(prev => !prev)} />
              Sß╗¡a ─æ╞ín
            </label>
            <label className="flex flex-col gap-2 text-[12px] text-[#333]">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-[14px] h-[14px] accent-[#8b1a1a]"
                  checked={tachDon}
                  onChange={() => {
                    setTachDon(prev => {
                      const nextState = !prev;
                      if (!nextState) setTachSoDon("");
                      return nextState;
                    });
                  }}
                />
                T├ích ─æ╞ín
              </span>
              {tachDon && (
                <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                  <label className="text-[12px] text-[#333]">Sß╗æ ─æ╞ín muß╗æn t├ích</label>
                  <input
                    type="text"
                    value={tachSoDon}
                    onChange={e => setTachSoDon(e.target.value)}
                    placeholder="Nhß║¡p sß╗æ ─æ╞ín"
                    className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
              )}
            </label>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">L├╜ do trß║ú lß║íi <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={e => onChangeReason(e.target.value)}
              rows={5}
              className="w-full border border-[#ccc] rounded-[3px] px-2 py-2 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none"
              placeholder="Nhß║¡p l├╜ do trß║ú lß║íi ─æ╞ín..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#e0e0e0]">
          <button onClick={onClose}
            className="h-[34px] px-4 border border-[#ccc] text-[#444] rounded-[3px] text-[12px] hover:bg-[#f5f5f5]">
            Hß╗ºy
          </button>
          <button
            disabled={!reason.trim()}
            onClick={onConfirm}
            className="h-[34px] px-4 rounded-[3px] text-[12px] font-medium text-white bg-[#8b1a1a] hover:bg-[#6e1414] disabled:bg-[#ccc] disabled:cursor-not-allowed"
          >
            X├íc nhß║¡n trß║ú lß║íi
          </button>
        </div>
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Prototype: Luß╗ông Gh├⌐p ─æ╞ín ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const PROTO_STEPS_TH1 = [
  { label: "Trß║íng th├íi ban ─æß║ºu" },
  { label: "Popup Gh├⌐p ─æ╞ín" },
  { label: "Popup X├íc nhß║¡n" },
  { label: "Kß║┐t quß║ú gh├⌐p" },
];

const PROTO_STEPS_TH2 = [
  { label: "Trß║íng th├íi ban ─æß║ºu" },
  { label: "Popup Gh├⌐p ─æ╞ín" },
  { label: "Popup X├íc nhß║¡n" },
  { label: "Chß╗¥ B x├íc nhß║¡n" },
  { label: "B x├íc nhß║¡n" },
  { label: "Kß║┐t quß║ú gh├⌐p" },
];

function protoStepDesc(step: number, th: 1 | 2): string {
  if (th === 1) return ([
    "C├ín bß╗Ö A quß║ún l├╜ cß║ú 2 ─æ╞ín: 7031 (Thß╗Ñ l├╜ mß╗¢i) v├á 7025 (Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn).",
    "A nhß║Ñn ┬╖┬╖┬╖ ΓåÆ Gh├⌐p ─æ╞ín tr├¬n ─æ╞ín 7031. Popup hiß╗ân thß╗ï danh s├ích ─æ╞ín ─æß╗º ─æiß╗üu kiß╗çn gh├⌐p.",
    "A chß╗ìn ─æ╞ín 7025 v├á nhß║Ñn Tiß║┐p tß╗Ñc. V├¼ c├╣ng c├ín bß╗Ö n├¬n chß╗ë cß║ºn A x├íc nhß║¡n.",
    "Gh├⌐p ho├án tß║Ñt. ─É╞ín 7025 xuß║Ñt hiß╗çn trong Danh s├ích ─æ╞ín thß╗Ñ l├╜ k├¿m cß╗ºa ─æ╞ín 7031.",
  ] as string[])[step] ?? "";
  return ([
    "C├ín bß╗Ö A c├│ ─æ╞ín 7031 (Thß╗Ñ l├╜ mß╗¢i). C├ín bß╗Ö B c├│ ─æ╞ín 7025 (Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn).",
    "A nhß║Ñn ┬╖┬╖┬╖ ΓåÆ Gh├⌐p ─æ╞ín tr├¬n ─æ╞ín 7031. Popup hiß╗ân thß╗ï ─æ╞ín 7025 cß╗ºa c├ín bß╗Ö B.",
    "A x├íc nhß║¡n gh├⌐p. Hß╗ç thß╗æng gß╗¡i y├¬u cß║ºu tß╗¢i c├ín bß╗Ö B ΓÇö chß╗¥ B x├íc nhß║¡n.",
    "A thß║Ñy 'Chß╗¥ B x├íc nhß║¡n'. C├ín bß╗Ö B thß║Ñy n├║t 'X├íc nhß║¡n gh├⌐p ─æ╞ín' tr├¬n ─æ╞ín 7025.",
    "B nhß║Ñn n├║t x├íc nhß║¡n ΓåÆ popup x├íc nhß║¡n cß╗ºa B hiß╗çn ra ─æß╗â B ─æß╗ông ├╜ hoß║╖c tß╗½ chß╗æi.",
    "Gh├⌐p ho├án tß║Ñt. Cß║ú A v├á B ─æß╗üu thß║Ñy nh├ún '─É├ú gh├⌐p vß╗¢i...' v├á Danh s├ích ─æ╞ín thß╗Ñ l├╜ k├¿m.",
  ] as string[])[step] ?? "";
}

function protoBRNotes(step: number, th: 1 | 2): { br: string; text: string }[] {
  if (step === 0) return [
    { br: "BR-01 TH3", text: "─É╞ín ch├¡nh ß╗ƒ trß║íng th├íi Thß╗Ñ l├╜ mß╗¢i c├│ thß╗â gh├⌐p vß╗¢i ─æ╞ín Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn." },
    { br: "BR-02", text: "Popup chß╗ë hiß╗ân thß╗ï ─æ╞ín ch╞░a ─æß╗º ─æiß╗üu kiß╗çn v├á ch╞░a ─æ╞░ß╗úc gh├⌐p vß╗¢i bß║Ñt kß╗│ ─æ╞ín n├áo." },
  ];
  if (step === 1) return [
    { br: "BR-02", text: "Danh s├ích trong popup lß╗ìc theo: ch╞░a ─æß╗º ─æiß╗üu kiß╗çn + ch╞░a ─æ╞░ß╗úc gh├⌐p." },
  ];
  if (step === 2) return [
    { br: "BR-03", text: th === 1 ? "TH1: C├╣ng c├ín bß╗Ö ΓÇö chß╗ë cß║ºn x├íc nhß║¡n cß╗ºa c├ín bß╗Ö A, gh├⌐p ngay." : "TH2: Kh├íc c├ín bß╗Ö ΓÇö cß║ºn c├ín bß╗Ö B x├íc nhß║¡n tr╞░ß╗¢c mß╗¢i ho├án tß║Ñt gh├⌐p." },
  ];
  if (step >= 3) return [
    { br: "BR-04", text: "Trß║íng th├íi ─æ╞ín ch├¡nh kh├┤ng ─æß╗òi (Thß╗Ñ l├╜ mß╗¢i). ─É╞ín k├¿m giß╗» nguy├¬n trß║íng th├íi Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn." },
    { br: "BR-04", text: "─É╞ín k├¿m gß║»n nh├ún '─É├ú gh├⌐p vß╗¢i [m├ú]' v├á hiß╗ân thß╗ï trong Danh s├ích ─æ╞ín thß╗Ñ l├╜ k├¿m cß╗ºa ─æ╞ín ch├¡nh." },
  ];
  return [];
}

const ProtoRow = ({
  maDon, nguoiGui, ngayNhap, trangThai, trangThaiColor = "#888", extra, showAction = false,
}: {
  maDon: string; nguoiGui: string; ngayNhap: string;
  trangThai: string; trangThaiColor?: string;
  extra?: React.ReactNode; showAction?: boolean;
}) => (
  <div className="border border-[#ddd] rounded-[3px] p-2.5 bg-white text-[12px]">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className="font-semibold text-[#1d2e4f] text-[11px]">M├ú {maDon}</span>
          <span className="px-1.5 py-[1px] rounded text-[9px] font-medium text-white"
            style={{ backgroundColor: trangThaiColor }}>{trangThai}</span>
        </div>
        <div className="text-[#444] text-[11px] leading-snug mb-0.5">{nguoiGui}</div>
        <div className="text-[#aaa] text-[10px]">Nhß║¡p: {ngayNhap}</div>
        {extra && <div className="mt-1.5">{extra}</div>}
      </div>
      {showAction && (
        <button className="w-[24px] h-[24px] flex items-center justify-center rounded border border-[#ddd] hover:bg-[#f0f0f0] text-[#555] text-[12px] flex-shrink-0">┬╖┬╖┬╖</button>
      )}
    </div>
  </div>
);

const ProtoMergeBadge = ({ maDon }: { maDon: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#27ae60] bg-[#eafaf1] text-[10px] font-medium text-[#27ae60]">
    <GitMerge size={10} /> ─É├ú gh├⌐p vß╗¢i {maDon}
  </span>
);

const PrototypeGhepDon = () => {
  const [th, setTh] = useState<1 | 2>(2);
  const [step, setStep] = useState(0);

  const steps = th === 1 ? PROTO_STEPS_TH1 : PROTO_STEPS_TH2;
  const maxStep = steps.length - 1;

  const goStep = (s: number) => setStep(Math.max(0, Math.min(maxStep, s)));
  const handleTHChange = (t: 1 | 2) => { setTh(t); setStep(0); };

  const showPopupGhep = step === 1;
  const showPopupXacNhan = step === 2;
  const showPopupBConfirm = th === 2 && step === 4;

  // TH1: A controls both dons
  // TH2: A has 7031, B has 7025
  const aDonMerged = th === 1 ? step >= 3 : step >= 5;
  const aDonPending = th === 2 && step >= 3 && step <= 4;
  const bDonMerged = step >= 5;
  const bDonPending = th === 2 && step >= 3 && step <= 4;

  const renderARows = () => (
    <>
      <ProtoRow maDon="7031" nguoiGui="T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh"
        ngayNhap="21/07/2026" trangThai="Thß╗Ñ l├╜ mß╗¢i" trangThaiColor="#e67e22" showAction
        extra={
          aDonMerged ? (
            <div className="space-y-2">
              <ProtoMergeBadge maDon="7025" />
              <div className="border border-[#b0d4e8] rounded-[3px] bg-[#f0f7ff] p-2">
                <div className="font-semibold text-[#1d2e4f] text-[11px] mb-1.5 flex items-center gap-1">
                  <List size={11} /> Danh s├ích ─æ╞ín thß╗Ñ l├╜ k├¿m
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#e0e0e0] rounded px-2 py-1 text-[11px]">
                  <GitMerge size={11} className="text-[#27ae60]" />
                  <span className="font-medium text-[#333]">M├ú 7025</span>
                  <span className="text-[#666]">ΓÇö Nguyß╗àn Thß╗ï Hoa</span>
                  <span className="ml-auto px-1.5 py-[1px] rounded text-[9px] bg-[#e67e22] text-white font-medium">Ch╞░a ─æß╗º ─ÉK</span>
                </div>
              </div>
            </div>
          ) : aDonPending ? (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404]">
              <Clock size={10} /> ─É├ú gß╗¡i y├¬u cß║ºu gh├⌐p ┬╖ Chß╗¥ B x├íc nhß║¡n
            </span>
          ) : undefined
        }
      />
      {/* TH1: A also has don 7025 */}
      {th === 1 && (
        <ProtoRow maDon="7025" nguoiGui="Nguyß╗àn Thß╗ï Hoa"
          ngayNhap="18/07/2026" trangThai="Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn" trangThaiColor="#e67e22"
          extra={aDonMerged ? <ProtoMergeBadge maDon="7031" /> : undefined}
        />
      )}
    </>
  );

  const renderBRows = () => (
    <ProtoRow maDon="7025" nguoiGui="Nguyß╗àn Thß╗ï Hoa"
      ngayNhap="18/07/2026" trangThai="Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn" trangThaiColor="#e67e22"
      extra={
        bDonMerged ? <ProtoMergeBadge maDon="7031" /> :
          bDonPending ? (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404]">
                <GitMerge size={10} /> ─Éang ─æ╞░ß╗úc y├¬u cß║ºu gh├⌐p vß╗¢i 7031
              </span>
              <button onClick={() => goStep(4)}
                className="flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404] hover:bg-[#ffe69c] transition-colors w-fit">
                <Check size={10} /> X├íc nhß║¡n gh├⌐p ─æ╞ín
              </button>
            </div>
          ) : undefined
      }
    />
  );

  const renderPopupGhep = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[500px] border border-[#bbb]">
        <div className="flex items-center justify-between bg-[#1d2e4f] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <GitMerge size={13} /> Gh├⌐p ─æ╞ín
          </div>
          <button onClick={() => goStep(0)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 pt-2 pb-1 bg-[#f9f9f9] border-b border-[#eee]">
          <p className="text-[11px] text-[#555] mb-0.5">─É╞ín ch├¡nh</p>
          <p className="text-[12px] font-semibold text-[#1d2e4f]">M├ú 7031 ΓÇö T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh</p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] text-[#555] mb-1.5">Chß╗ìn ─æ╞ín ─æß╗â gh├⌐p v├áo (ch╞░a ─æß╗º ─æiß╗üu kiß╗çn, ch╞░a ─æ╞░ß╗úc gh├⌐p):</p>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="border border-[#ddd] px-2 py-[5px] w-7"><input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a]" /></th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">M├ú</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Ng╞░ß╗¥i gß╗¡i</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Ng├áy nhß║¡p</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Trß║íng th├íi</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "7025", nguoi: "Nguyß╗àn Thß╗ï Hoa", ngay: "18/07", checked: true },
                { id: "7022", nguoi: "TAND tß╗ënh V─⌐nh Ph├║c", ngay: "15/07", checked: false },
                { id: "7019", nguoi: "Trß║ºn V─ân B├¼nh", ngay: "12/07", checked: false },
              ].map((r, i) => (
                <tr key={i} className={r.checked ? "bg-[#fdeaea]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                  <td className="border border-[#ddd] px-2 py-[5px] text-center">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a]" defaultChecked={r.checked} />
                  </td>
                  <td className="border border-[#ddd] px-2 py-[5px] font-medium text-[#1a5a96]">{r.id}</td>
                  <td className="border border-[#ddd] px-2 py-[5px]">{r.nguoi}</td>
                  <td className="border border-[#ddd] px-2 py-[5px] text-[#888]">{r.ngay}</td>
                  <td className="border border-[#ddd] px-2 py-[5px]">
                    <span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Ch╞░a ─æß╗º ─ÉK</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-[#1d2e4f] mt-1.5 font-medium">─É├ú chß╗ìn 1 ─æ╞ín ─æß╗â gh├⌐p.</p>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(0)}>Hß╗ºy</BtnSecondary>
          <BtnPrimary onClick={() => goStep(2)}><GitMerge size={12} /> Tiß║┐p tß╗Ñc</BtnPrimary>
        </div>
      </div>
    </div>
  );

  const renderPopupXacNhan = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[460px] border border-[#bbb]">
        <div className="flex items-center justify-between bg-[#1d2e4f] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <Check size={13} /> X├íc nhß║¡n gh├⌐p ─æ╞ín
          </div>
          <button onClick={() => goStep(1)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 py-3 space-y-2 text-[12px]">
          <div className={`px-3 py-2 rounded border text-[11px] font-medium ${th === 1 ? "bg-[#e8f5e9] border-[#81c784] text-[#2e7d32]" : "bg-[#fff3cd] border-[#ffc107] text-[#856404]"}`}>
            {th === 1 ? "Γ£ô TH1: C├╣ng 1 c├ín bß╗Ö ΓÇö Chß╗ë cß║ºn x├íc nhß║¡n cß╗ºa c├ín bß╗Ö A ─æß╗â gh├⌐p ngay" : "ΓÜá TH2: 2 c├ín bß╗Ö kh├íc nhau ΓÇö Sau khi A x├íc nhß║¡n, c├ín bß╗Ö B cß║ºn x├íc nhß║¡n ─æß╗â ho├án tß║Ñt"}
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">─É╞ín ch├¡nh</p>
            <span className="font-semibold text-[#1d2e4f]">M├ú 7031</span>
            <span className="text-[#666] ml-2 text-[11px]">T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh</span>
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-white">
            <p className="text-[11px] text-[#888] mb-0.5">─É╞ín ─æ╞░ß╗úc gh├⌐p v├áo</p>
            <span className="font-semibold text-[#1a5a96]">M├ú 7025</span>
            <span className="text-[#666] ml-2 text-[11px]">Nguyß╗àn Thß╗ï Hoa ΓÇö Ch╞░a ─æß╗º ─ÉK</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(1)}>Hß╗ºy</BtnSecondary>
          <BtnPrimary onClick={() => goStep(th === 1 ? 3 : 3)}><Check size={12} /> X├íc nhß║¡n gh├⌐p ─æ╞ín</BtnPrimary>
        </div>
      </div>
    </div>
  );

  const renderPopupBConfirm = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[420px] border border-[#2980b9]">
        <div className="flex items-center justify-between bg-[#2980b9] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <GitMerge size={13} /> X├íc nhß║¡n gh├⌐p ─æ╞ín (C├ín bß╗Ö B)
          </div>
          <button onClick={() => goStep(3)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 py-3 space-y-2 text-[12px]">
          <div className="bg-[#fff3cd] border border-[#ffc107] rounded px-3 py-2 text-[11px] font-medium text-[#856404]">
            C├ín bß╗Ö A gß╗¡i y├¬u cß║ºu gh├⌐p ─æ╞ín cß╗ºa bß║ín v├áo ─æ╞ín ch├¡nh. Bß║ín c├│ muß╗æn x├íc nhß║¡n?
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">─É╞ín ch├¡nh (C├ín bß╗Ö A)</p>
            <span className="font-semibold text-[#1d2e4f]">M├ú 7031</span>
            <span className="text-[#666] ml-2 text-[11px]">T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh</span>
            <div className="mt-0.5"><span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Thß╗Ñ l├╜ mß╗¢i</span></div>
          </div>
          <div className="border border-[#2980b9] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">─É╞ín cß╗ºa bß║ín (C├ín bß╗Ö B)</p>
            <span className="font-semibold text-[#2980b9]">M├ú 7025</span>
            <span className="text-[#666] ml-2 text-[11px]">Nguyß╗àn Thß╗ï Hoa</span>
            <div className="mt-0.5"><span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Ch╞░a ─æß╗º ─ÉK</span></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(3)}>Tß╗½ chß╗æi</BtnSecondary>
          <BtnPrimary onClick={() => goStep(5)}><Check size={12} /> X├íc nhß║¡n gh├⌐p ─æ╞ín</BtnPrimary>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#eef1f5] min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#ddd] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-[14px] font-semibold text-[#222]">Prototype ┬╖ Luß╗ông Gh├⌐p ─æ╞ín</h2>
          <p className="text-[11px] text-[#888]">M├┤ phß╗Ång t╞░╞íng t├íc theo SRS ΓÇö BR-01 ─æß║┐n BR-04</p>
        </div>
        <div className="flex items-center gap-1 bg-[#f0f0f0] rounded-[4px] p-[3px]">
          {([1, 2] as const).map(t => (
            <button key={t} onClick={() => handleTHChange(t)}
              className={`px-3 py-[5px] rounded-[3px] text-[12px] font-medium transition-all ${th === t ? "bg-white shadow text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}>
              {t === 1 ? "TH1: C├╣ng c├ín bß╗Ö" : "TH2: Kh├íc c├ín bß╗Ö"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 gap-4 p-4 overflow-auto">
        {/* Step navigator */}
        <div className="w-[185px] flex-shrink-0 space-y-3">
          <div className="bg-white border border-[#ddd] rounded-[4px] overflow-hidden">
            <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#ddd]">
              <span className="text-[12px] font-semibold text-[#333]">C├íc b╞░ß╗¢c</span>
            </div>
            <div className="p-2 space-y-0.5">
              {steps.map((s, i) => (
                <button key={i} onClick={() => goStep(i)}
                  className={`w-full text-left px-2 py-[7px] rounded-[3px] text-[12px] flex items-center gap-2 transition-colors ${step === i ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#555] hover:bg-[#f5f5f5]"}`}>
                  <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${step === i ? "bg-[#8b1a1a] text-white" : i < step ? "bg-[#27ae60] text-white" : "bg-[#e0e0e0] text-[#888]"}`}>
                    {i < step ? "Γ£ô" : i + 1}
                  </span>
                  <span className="leading-tight text-[11px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => goStep(step - 1)} disabled={step === 0}
              className="flex-1 py-[6px] text-[11px] border border-[#ccc] rounded-[3px] bg-white text-[#555] hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed">ΓåÉ Tr╞░ß╗¢c</button>
            <button onClick={() => goStep(step + 1)} disabled={step === maxStep}
              className="flex-1 py-[6px] text-[11px] bg-[#1d2e4f] text-white rounded-[3px] hover:bg-[#16253d] disabled:opacity-40 disabled:cursor-not-allowed">Tiß║┐p ΓåÆ</button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 space-y-3 min-w-0 flex flex-col">
          {/* Step description */}
          <div className="bg-[#1d2e4f] rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">{step + 1}</span>
            <div>
              <p className="text-white font-semibold text-[12px]">{steps[step].label}</p>
              <p className="text-white/70 text-[11px] mt-0.5 leading-snug">{protoStepDesc(step, th)}</p>
            </div>
          </div>

          {/* Dual panel */}
          <div className="relative flex gap-3 flex-1" style={{ minHeight: 280 }}>
            {/* A panel */}
            <div className="flex-1 bg-white border border-[#ddd] rounded-[4px] p-3">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#eee]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1d2e4f] flex-shrink-0" />
                <span className="text-[12px] font-bold text-[#1d2e4f]">C├ín bß╗Ö A</span>
                {th === 1 && <span className="text-[9px] bg-[#eee] text-[#666] px-1.5 py-[1px] rounded-full ml-1">Quß║ún l├╜ cß║ú 2 ─æ╞ín</span>}
              </div>
              <div className="space-y-2">{renderARows()}</div>
            </div>

            {/* B panel (TH2) */}
            {th === 2 && (
              <div className="flex-1 bg-white border border-[#2980b9]/40 rounded-[4px] p-3">
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#eee]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2980b9] flex-shrink-0" />
                  <span className="text-[12px] font-bold text-[#2980b9]">C├ín bß╗Ö B</span>
                </div>
                <div className="space-y-2">{renderBRows()}</div>
              </div>
            )}

            {showPopupGhep && renderPopupGhep()}
            {showPopupXacNhan && renderPopupXacNhan()}
            {showPopupBConfirm && renderPopupBConfirm()}
          </div>

          {/* BR notes */}
          <div className="bg-white border border-[#ddd] rounded-[4px] p-3 flex-shrink-0">
            <p className="text-[11px] font-semibold text-[#333] mb-1.5">Quy tß║»c nghiß╗çp vß╗Ñ ├íp dß╗Ñng</p>
            <div className="space-y-1">
              {protoBRNotes(step, th).map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="font-bold text-[#8b1a1a] flex-shrink-0 min-w-[70px]">{n.br}</span>
                  <span className="text-[#555]">{n.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// C├íc loß║íi h├¼nh thß╗⌐c ─æ╞░ß╗úc coi l├á "─É╞ín" ΓåÆ hiß╗çn block Th├┤ng tin ─æ╞ín
const LOAI_DON = new Set([
  "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT",
  "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng",
  "Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t",
  "─É╞ín kh├íc",
]);
const LOAI_KHANG_NGHI = "";

// ΓöÇΓöÇΓöÇ Word Editor ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const WordEditor = ({ onBack }: { onBack: () => void }) => {
  const [content, setContent] = useState(`Cß╗ÿNG H├ÆA X├â Hß╗ÿI CHß╗ª NGH─¿A VIß╗åT NAM
─Éß╗Öc lß║¡p - Tß╗▒ do - Hß║ính ph├║c
ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

T├ÆA ├üN NH├éN D├éN Tß╗ÉI CAO
Sß╗æ: ____/2026/TANDTC-VP

TH├öNG B├üO
Vß╗ü viß╗çc ph├ón c├┤ng Thß║⌐m ph├ín xem x├⌐t ─æ╞ín ─æß╗ü nghß╗ï gi├ím ─æß╗æc thß║⌐m, t├íi thß║⌐m

K├¡nh gß╗¡i: ...

C─ân cß╗⌐ Bß╗Ö luß║¡t Tß╗æ tß╗Ñng d├ón sß╗▒ n─âm 2015;
C─ân cß╗⌐ Luß║¡t Tß╗ò chß╗⌐c T├▓a ├ín nh├ón d├ón n─âm 2014;

T├▓a ├ín nh├ón d├ón tß╗æi cao th├┤ng b├ío ph├ón c├┤ng Thß║⌐m ph├ín nh╞░ sau:

1. Thß║⌐m ph├ín ─æ╞░ß╗úc ph├ón c├┤ng: ...
2. Nhiß╗çm vß╗Ñ: Xem x├⌐t ─æ╞ín ─æß╗ü nghß╗ï gi├ím ─æß╗æc thß║⌐m sß╗æ ...
3. Thß╗¥i hß║ín giß║úi quyß║┐t: ...

N╞íi nhß║¡n:
- Nh╞░ tr├¬n;
- L╞░u VP.

                                    TL. CH├üNH ├üN
                                    KT. CH├üNH V─éN PH├ÆNG
                                    PH├ô CH├üNH V─éN PH├ÆNG

                                    (─æ├ú k├╜)

                                    Phß║ím V─ân Nha`);

  return (
    <div className="flex flex-col h-full bg-[#eef1f5]">
      {/* Toolbar */}
      <div className="bg-white border-b border-[#ddd] px-4 py-2 flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-[#1a5a96] hover:underline mr-2">
          <ChevronRight size={13} className="rotate-180" /> Quay lß║íi
        </button>
        <div className="h-4 w-px bg-[#ddd] mr-1" />
        {["B", "I", "U"].map(f => (
          <button key={f} className="w-[26px] h-[26px] rounded border border-[#ccc] text-[12px] font-bold hover:bg-[#f0f0f0] flex items-center justify-center">
            {f}
          </button>
        ))}
        <div className="h-4 w-px bg-[#ddd] mx-1" />
        <select className="h-[26px] px-1 text-[12px] border border-[#ccc] rounded-[2px] bg-white">
          <option>Times New Roman</option><option>Arial</option>
        </select>
        <select className="h-[26px] px-1 text-[12px] border border-[#ccc] rounded-[2px] bg-white w-[52px]">
          {[10, 11, 12, 13, 14].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <ArrowDownToLine size={12} /> Lß║Ñy sß╗æ
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Send size={12} /> Tr├¼nh k├╜
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#2980b9] hover:bg-[#1a6a9a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Download size={12} /> Tß║úi xuß╗æng
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#162440] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Save size={12} /> L╞░u
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-auto flex justify-center py-6 px-4">
        <div className="bg-white shadow-md w-[794px] min-h-[1123px] relative">
          {/* Page margin area */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="absolute inset-0 w-full h-full resize-none p-[80px] text-[13px] font-['Times_New_Roman',serif] leading-relaxed text-[#222] focus:outline-none bg-transparent"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          />
        </div>
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Danh s├ích biß╗âu mß║½u ─æ╞ín ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const DanhSachBieuMau = ({
  row, onBack, vanBanList, setVanBanList, currentRole = "can-bo", vbId,
}: {
  row: typeof SAMPLE_ROWS[0];
  onBack: () => void;
  /** Kho v─ân bß║ún d├╣ng chung. Tr╞░ß╗¢c ─æ├óy m├án n├áy ─æß╗ìc mß╗Öt mß║úng hardcode 3 d├▓ng
   *  n├¬n bß║Ñm tß╗½ ─æ╞ín n├áo c┼⌐ng ra c├╣ng kß║┐t quß║ú v├á kh├┤ng bao giß╗¥ thß║Ñy v─ân bß║ún
   *  vß╗½a tß║ío. Giß╗¥ lß╗ìc thß║¡t theo ─æ╞ín ─æang mß╗ƒ. */
  vanBanList?: VanBanTrinh[];
  setVanBanList?: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole?: string;
  /** V─ân bß║ún cß╗Ñ thß╗â ─æ╞░ß╗úc bß║Ñm ß╗ƒ m├án Danh s├ích ─æ╞ín ΓÇö chß╗ë hiß╗çn ─æ├║ng d├▓ng n├áy,
   *  kh├┤ng hiß╗çn cß║ú kho v─ân bß║ún cß╗ºa ─æ╞ín. */
  vbId?: string | null;
}) => {
  const vanBanTheoDon = timVanBanTheoDon(vanBanList ?? [], row.maDon);
  const vanBanCuaDon = vbId ? vanBanTheoDon.filter(v => v.id === vbId) : vanBanTheoDon;
  // Panel chi tiß║┐t mß╗ƒ NGAY Tß║áI ─É├éY thay v├¼ nhß║úy sang m├án kh├íc ΓÇö giß╗» nguy├¬n bß╗æi
  // cß║únh "t├┤i ─æang xem v─ân bß║ún cß╗ºa ─æ╞ín M├ú 7031". Nß║┐u ─æß║┐n tß╗½ n├║t "v─ân bß║ún tr├¼nh
  // k├╜" ß╗ƒ Danh s├ích ─æ╞ín (─æ├ú c├│ vbId), mß╗ƒ panel ngay, khß╗Åi bß║»t bß║Ñm th├¬m lß║ºn nß╗»a.
  const [chonId, setChonId] = useState<string | null>(vbId ?? null);
  const chon = (vanBanList ?? []).find(v => v.id === chonId) ?? null;
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);
  const d = row.thongTinDon;
  const infoLeft = [
    { label: "Sß╗æ bß║ún ├ín", value: d.soBaqd },
    { label: "Ng├áy bß║ún ├ín", value: d.ngay },
    { label: "T├▓a x├⌐t xß╗¡", value: d.toaXetXu ?? "ΓÇö" },
    { label: "M├ú ─æ╞ín", value: row.maDon },
  ];
  const infoRight = [
    { label: "Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", value: row.nguoiGui },
    { label: "─Éß╗ïa chß╗ë ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", value: row.diaChi },
    { label: "N╞íi chuyß╗ân ─æß║┐n", value: "Nß╗Öi bß╗Ö" },
    { label: "─É╞ín vß╗ï chuyß╗ân ─æß║┐n", value: d.donViGiaiQuyet },
  ];

  return (
    <div className="bg-[#eef1f5] min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#ddd] px-4 py-3">
        <div className="flex items-center gap-2 text-[13px] text-[#666] mb-2">
          <span className="hover:text-[#1a5a96] cursor-pointer" onClick={onBack}>Trang chß╗º</span>
          <ChevronRight size={12} />
          <span className="hover:text-[#1a5a96] cursor-pointer" onClick={onBack}>Quß║ún l├╜ ─æ╞ín</span>
          <ChevronRight size={12} />
          <span className="text-[#333]">Danh s├ích biß╗âu mß║½u ─æ╞ín</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#555] hover:text-[#222] p-1 rounded hover:bg-[#f0f0f0]">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="text-[16px] font-semibold text-[#222]">Danh s├ích biß╗âu mß║½u</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Th├┤ng tin ─æ╞ín */}
        <div className="bg-white border border-[#ddd] rounded-[4px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee]">
            <span className="text-[13px] font-semibold text-[#333]">Th├┤ng tin ─æ╞ín</span>
            <span className="px-3 py-[3px] rounded-full border border-[#e67e22] text-[12px] font-medium text-[#e67e22]">
              ΓÇó {row.giaiQuyet.nhan}
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#eee]">
            <table className="w-full text-[13px]">
              <tbody>
                {infoLeft.map(({ label, value }) => (
                  <tr key={label} className="border-b border-[#f5f5f5] last:border-0">
                    <td className="px-4 py-2.5 text-[#888] w-[160px] whitespace-nowrap">{label}</td>
                    <td className="px-4 py-2.5 font-medium text-[#222]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full text-[13px]">
              <tbody>
                {infoRight.map(({ label, value }) => (
                  <tr key={label} className="border-b border-[#f5f5f5] last:border-0">
                    <td className="px-4 py-2.5 text-[#1a5a96] w-[200px] whitespace-nowrap">{label}</td>
                    <td className="px-4 py-2.5 font-medium text-[#222]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#ccc] rounded-[3px] bg-white overflow-hidden h-[32px]">
            <input type="text" placeholder="Nhß║¡p tß╗½ kh├│a t├¼m kiß║┐m"
              className="px-3 text-[12px] outline-none w-[220px] h-full" />
            <button className="w-[32px] h-[32px] bg-[#8b1a1a] flex items-center justify-center text-white flex-shrink-0">
              <Search size={13} />
            </button>
          </div>
          <div className="flex-1" />
          <BtnPrimary className="text-[12px] py-[5px] px-3 gap-1.5">
            <FileText size={13} /> Nhß║¡p hß╗ôi quyß║┐t ─æß╗ïnh c┼⌐
          </BtnPrimary>
          <BtnPrimary className="text-[12px] py-[5px] px-3 gap-1.5">
            <Plus size={13} /> Th├¬m biß╗âu mß║½u
          </BtnPrimary>
          <button className="w-[32px] h-[32px] border border-[#ccc] rounded-[3px] bg-white flex items-center justify-center text-[#555] hover:bg-[#f5f5f5]">
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#ddd] rounded-[4px] overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[50px]">STT</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">T├¬n quyß║┐t ─æß╗ïnh</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Sß╗æ Q─É</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] whitespace-nowrap">Ng├áy ra Q─É</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[190px]">Tiß║┐n tr├¼nh</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Ng╞░ß╗¥i k├╜</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Trß║íng th├íi</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Ng╞░ß╗¥i tß║ío</th>
                <th className="px-3 py-2.5 text-center font-semibold text-[#333]">Thao t├íc</th>
              </tr>
            </thead>
            <tbody>
              {vanBanCuaDon.map((vb, i) => {
                const nguoiKy = vb.luongKy.find(b => b.vaiTro === "ky");
                return (
                  <tr key={vb.id} onClick={() => setChonId(vb.id)}
                    className={`border-b border-[#f0f0f0] hover:bg-[#f0f7ff] cursor-pointer ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                    <td className="px-3 py-2.5 text-[#1a5a96] font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#222]">{vb.loaiVanBan}</td>
                    <td className="px-3 py-2.5">
                      {vb.soVanBan
                        ? <span className="text-[#1a5a96] hover:underline font-mono text-[12px]">{vb.soVanBan}</span>
                        : <span className="text-[#888] italic text-[12px]">ΓÇö ch╞░a sß╗æ ΓÇö</span>}
                    </td>
                    <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">
                      {vb.ngayBanHanh ?? vb.ngayCapSo ?? "ΓÇö"}
                    </td>
                    <td className="px-3 py-2.5"><TienTrinhGon vb={vb} /></td>
                    <td className="px-3 py-2.5 font-medium text-[#333]">{nguoiKy?.nguoi ?? "ΓÇö"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border ${TRANG_THAI_CLS[vb.trangThai]}`}>
                        {TRANG_THAI_NHAN[vb.trangThai]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#555]">{vb.nguoiTao}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={(e) => { e.stopPropagation(); setChonId(vb.id); }} title="Xem chi tiß║┐t & lß╗ïch sß╗¡"
                        className="text-[#555] hover:text-[#8b1a1a] transition-colors">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vanBanCuaDon.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center">
                  <FileText size={24} className="mx-auto mb-2 text-[#ccc]" />
                  <div className="text-[13px] text-[#666]">─É╞ín {row.maDon.trim()} ch╞░a c├│ v─ân bß║ún n├áo.</div>
                  <div className="text-[12px] text-[#888] mt-1">
                    Lß║¡p v─ân bß║ún tß╗½ m├án Danh s├ích ─æ╞ín ΓÇö n├║t ΓÇ£L╞░u sß╗æ v─ân bß║ún v├á in b├ío c├íoΓÇ¥.
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#eee] text-[12px] text-[#666] gap-2">
            <span>Hiß╗ân thß╗ï {vanBanCuaDon.length ? `1-${vanBanCuaDon.length}` : "0"} / {vanBanCuaDon.length}</span>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">ΓÇ╣</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#8b1a1a] rounded bg-[#8b1a1a] text-white">1</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">ΓÇ║</button>
          </div>
        </div>
      </div>

      {/* Panel chi tiß║┐t mß╗ƒ tß║íi chß╗ù ΓÇö kh├┤ng rß╗¥i khß╗Åi bß╗æi cß║únh ─æ╞ín ─æang xem */}
      {chon && setVanBanList && (
        <PanelChiTiet vb={chon} nguoiDung={nguoiDung} chucVu={chucVu}
          danhSach={vanBanList ?? []}
          onCapNhat={(vbMoi) => setVanBanList(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v))}
          onClose={() => setChonId(null)} />
      )}
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Ph├ón c├┤ng Thß║⌐m ph├ín ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const LOAI_AN_OPTIONS = [
  "H├¼nh sß╗▒", "D├ón sß╗▒", "H├ánh ch├¡nh", "Kinh doanh th╞░╞íng mß║íi",
  "H├┤n nh├ón gia ─æ├¼nh", "Lao ─æß╗Öng", "Sß╗ƒ hß╗»u tr├¡ tuß╗ç", "Ph├í sß║ún",
];

const PHANCONG_SAMPLE: {
  id: number; soThuLy: string; ngayThuLy: string; nguoiDungDon: string; diaChi: string;
  soBA: string; ngayBA: string; toaBA: string; loaiAn: string; hinhThuc: string; thamPhan: string; capGiaiQuyet: "toicao" | "bac3";
  /** Sß╗æ tß╗¥ tr├¼nh ph├ón c├┤ng ─æ├ú lß║¡p cho ─æ╞ín n├áy. C├│ gi├í trß╗ï = thß║⌐m ph├ín ─æ├ú ─æ╞░ß╗úc
   *  chß╗æt trong v─ân bß║ún tr├¼nh k├╜, c├ín bß╗Ö kh├┤ng tß╗▒ ─æß╗òi ß╗ƒ m├án n├áy ─æ╞░ß╗úc nß╗»a. */
  toTrinh?: string;
}[] = [
    { id: 1, soThuLy: "01/2026/G─ÉT-HS", ngayThuLy: "05/07/2026", nguoiDungDon: "Nguyß╗àn V─ân An", diaChi: "Sß╗æ 12 L├¬ Duß║⌐n, H├á Nß╗Öi", soBA: "15/2023/HS-PT", ngayBA: "12/03/2023", toaBA: "TAND tß╗ënh Bß║»c Ninh", loaiAn: "H├¼nh sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 2, soThuLy: "02/2026/G─ÉT-DS", ngayThuLy: "08/07/2026", nguoiDungDon: "Trß║ºn Thß╗ï B├¼nh", diaChi: "45 Trß║ºn H╞░ng ─Éß║ío, TP.HCM", soBA: "08/2022/DS-PT", ngayBA: "20/06/2022", toaBA: "TAND tß╗ënh V─⌐nh Ph├║c", loaiAn: "D├ón sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "Nguyß╗àn Thß╗ï Lan", capGiaiQuyet: "toicao", toTrinh: "TTr-118/2026" },
    { id: 3, soThuLy: "03/2026/G─ÉT-KDTM", ngayThuLy: "10/07/2026", nguoiDungDon: "C├┤ng ty TNHH Minh ─Éß╗⌐c", diaChi: "18 Nguyß╗àn Huß╗ç, ─É├á Nß║╡ng", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cß║Ñp cao tß║íi HN", loaiAn: "Kinh doanh th╞░╞íng mß║íi", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "Trß║ºn V─ân H├╣ng", capGiaiQuyet: "toicao", toTrinh: "TTr-119/2026" },
    { id: 4, soThuLy: "04/2026/TT-HC", ngayThuLy: "14/07/2026", nguoiDungDon: "L├¬ V─ân C╞░ß╗¥ng", diaChi: "72 ─Éinh Ti├¬n Ho├áng, Huß║┐", soBA: "21/2021/HC-PT", ngayBA: "05/09/2021", toaBA: "TAND tß╗ënh H├á Nam", loaiAn: "H├ánh ch├¡nh", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "Trß║ºn V─ân H├╣ng", capGiaiQuyet: "bac3" },
    { id: 5, soThuLy: "05/2026/G─ÉT-L─É", ngayThuLy: "16/07/2026", nguoiDungDon: "Phß║ím Thß╗ï Dung", diaChi: "33 B├á Triß╗çu, Hß║úi Ph├▓ng", soBA: "07/2023/L─É-PT", ngayBA: "18/04/2023", toaBA: "TAND tß╗ënh Quß║úng Ninh", loaiAn: "Lao ─æß╗Öng", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "Trß║ºn V─ân H├╣ng", capGiaiQuyet: "toicao" },
    { id: 6, soThuLy: "06/2026/G─ÉT-DS", ngayThuLy: "18/07/2026", nguoiDungDon: "Ho├áng V─ân Th├íi", diaChi: "20 Cß║ºu Giß║Ñy, H├á Nß╗Öi", soBA: "45/2024/DS-PT", ngayBA: "10/01/2025", toaBA: "TAND TP H├á Nß╗Öi", loaiAn: "D├ón sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 7, soThuLy: "07/2026/TT-HS", ngayThuLy: "19/07/2026", nguoiDungDon: "L├¬ Thß╗ï Hß╗ông", diaChi: "150 Nguyß╗àn Tr├úi, TP.HCM", soBA: "12/2023/HS-PT", ngayBA: "22/08/2023", toaBA: "TAND TP HCM", loaiAn: "H├¼nh sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 8, soThuLy: "08/2026/G─ÉT-HNG─É", ngayThuLy: "21/07/2026", nguoiDungDon: "─Éinh Tuß║Ñn T├ái", diaChi: "55 L├íng Hß║í, H├á Nß╗Öi", soBA: "09/2023/HNG─É-PT", ngayBA: "05/05/2023", toaBA: "TAND tß╗ënh Th├íi B├¼nh", loaiAn: "H├┤n nh├ón gia ─æ├¼nh", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "L├¬ Thß╗ï Mai", capGiaiQuyet: "bac3", toTrinh: "TTr-124/2026" },
    { id: 9, soThuLy: "09/2026/TT-KDTM", ngayThuLy: "22/07/2026", nguoiDungDon: "C├┤ng ty Cß╗ò phß║ºn Alpha", diaChi: "T├▓a nh├á Bitexco, TP.HCM", soBA: "56/2024/KDTM-PT", ngayBA: "11/12/2024", toaBA: "TAND cß║Ñp cao tß║íi TP.HCM", loaiAn: "Kinh doanh th╞░╞íng mß║íi", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 10, soThuLy: "10/2026/G─ÉT-HC", ngayThuLy: "23/07/2026", nguoiDungDon: "V┼⌐ Trß╗ìng Phß╗Ñng", diaChi: "Sß╗æ 8 Tr├áng Thi, H├á Nß╗Öi", soBA: "19/2021/HC-PT", ngayBA: "15/07/2021", toaBA: "TAND tß╗ënh Hß║úi D╞░╞íng", loaiAn: "H├ánh ch├¡nh", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "Phß║ím V─ân ─Éß╗⌐c", capGiaiQuyet: "bac3" },
    { id: 11, soThuLy: "11/2026/G─ÉT-DS", ngayThuLy: "24/07/2026", nguoiDungDon: "B├╣i Thß╗ï Yß║┐n", diaChi: "K─ÉT Times City, H├á Nß╗Öi", soBA: "22/2022/DS-PT", ngayBA: "09/09/2022", toaBA: "TAND tß╗ënh Nam ─Éß╗ïnh", loaiAn: "D├ón sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 12, soThuLy: "12/2026/TT-L─É", ngayThuLy: "25/07/2026", nguoiDungDon: "Tr╞░╞íng Quang S├íng", diaChi: "KCN S├│ng Thß║ºn, B├¼nh D╞░╞íng", soBA: "04/2024/L─É-PT", ngayBA: "20/02/2024", toaBA: "TAND tß╗ënh B├¼nh D╞░╞íng", loaiAn: "Lao ─æß╗Öng", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "Ho├áng Thß╗ï Thu", capGiaiQuyet: "toicao" },
    { id: 13, soThuLy: "13/2026/G─ÉT-HS", ngayThuLy: "26/07/2026", nguoiDungDon: "Nguyß╗àn Hß║úi Long", diaChi: "Th├┤n 4, x├ú H├▓a Tiß║┐n, ─Éß║»k Lß║»k", soBA: "31/2023/HS-PT", ngayBA: "17/10/2023", toaBA: "TAND tß╗ënh ─Éß║»k Lß║»k", loaiAn: "H├¼nh sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 14, soThuLy: "14/2026/TT-DS", ngayThuLy: "27/07/2026", nguoiDungDon: "L├╜ Mß╗╣ Ch├óu", diaChi: "Chß╗ú Nß╗òi, Cß║ºn Th╞í", soBA: "11/2021/DS-PT", ngayBA: "03/04/2021", toaBA: "TAND TP Cß║ºn Th╞í", loaiAn: "D├ón sß╗▒", hinhThuc: "─Éß╗ü nghß╗ï TT", thamPhan: "Nguyß╗àn Thß╗ï Lan", capGiaiQuyet: "bac3" },
    { id: 15, soThuLy: "15/2026/G─ÉT-KDTM", ngayThuLy: "28/07/2026", nguoiDungDon: "Ng├ón h├áng Th╞░╞íng mß║íi ABC", diaChi: "Quß║¡n 1, TP.HCM", soBA: "77/2024/KDTM-PT", ngayBA: "05/01/2025", toaBA: "TAND cß║Ñp cao tß║íi TP.HCM", loaiAn: "Kinh doanh th╞░╞íng mß║íi", hinhThuc: "─Éß╗ü nghß╗ï G─ÉT", thamPhan: "", capGiaiQuyet: "toicao" },
  ];

const THAM_PHAN_OPTIONS = [
  "Nguyß╗àn Thß╗ï Lan", "Trß║ºn V─ân H├╣ng", "L├¬ Thß╗ï Mai", "Phß║ím V─ân ─Éß╗⌐c", "Ho├áng Thß╗ï Thu",
];

const PhanCongThamPhan = ({ initialTab = 0, onOpenThamPhanPopup, currentRole = "can-bo" }: {
  initialTab?: 0 | 1 | 2; onOpenThamPhanPopup?: () => void; currentRole?: string;
}) => {
  const [tab, setTab] = useState<0 | 1 | 2>(initialTab);
  // Ng╞░ß╗¥i duyß╗çt tß╗¥ tr├¼nh ph├ón c├┤ng l├á Tr╞░ß╗ƒng ph├▓ng ΓÇö b╞░ß╗¢c "duyet" ─æß║ºu ti├¬n cß╗ºa
  // luongToTrinhPhanCong(). Chß╗ë vai tr├▓ n├áy mß╗¢i ─æ╞░ß╗úc ─æß╗òi thß║⌐m ph├ín sau khi ─æ╞ín
  // ─æ├ú nß║▒m trong tß╗¥ tr├¼nh; c├íc vai tr├▓ c├▓n lß║íi chß╗ë xem.
  const laNguoiDuyetToTrinh = currentRole === "truong-phong";
  const [showLyDoPopup, setShowLyDoPopup] = useState<{ show: boolean, thamPhan: string }>({ show: false, thamPhan: "" });
  const [lyDoChiDinh, setLyDoChiDinh] = useState("");
  const [capTP, setCapTP] = useState<"tatca" | "toicao" | "bac3">("tatca");
  const [loaiAnFilter, setLoaiAnFilter] = useState<string[]>([]);
  const [hinhThucFilter, setHinhThucFilter] = useState("");
  const [rows, setRows] = useState(PHANCONG_SAMPLE);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editFormMap, setEditFormMap] = useState<Record<number, { ngaySua: string; lyDo: string }>>({});
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const startEdit = (id: number) => {
    setEditingRow(id);
    setEditFormMap(prev => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { ngaySua: new Date().toISOString().split("T")[0], lyDo: "" } };
    });
  };
  const [assignMap, setAssignMap] = useState<Record<number, string>>(
    Object.fromEntries(PHANCONG_SAMPLE.map(r => [r.id, r.thamPhan]))
  );
  const ASSIGN_WARNING_THRESHOLD = 3;
  const assignmentCounts = Object.values(assignMap).reduce((acc, tp) => {
    if (!tp) return acc;
    acc[tp] = (acc[tp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const hasHighLoad = (tp: string) => tp && (assignmentCounts[tp] ?? 0) >= ASSIGN_WARNING_THRESHOLD;
  const optionLabel = (tp: string) => tp + (assignmentCounts[tp] ? ` (${assignmentCounts[tp]} ─æ╞ín)` : "");

  const toggleLoaiAn = (v: string) =>
    setLoaiAnFilter(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filtered = rows.filter(r => {
    if (capTP !== "tatca" && r.capGiaiQuyet !== capTP) return false;
    if (loaiAnFilter.length > 0 && !loaiAnFilter.includes(r.loaiAn)) return false;
    if (hinhThucFilter && !r.hinhThuc.includes(hinhThucFilter)) return false;
    if (tab === 0) return !assignMap[r.id];
    if (tab === 1) return !assignMap[r.id];
    return !!assignMap[r.id];
  });

  const handleRandomAssign = () => {
    if (filtered.length === 0) return;
    const newAssign = { ...assignMap };
    filtered.forEach(r => {
      const randomTP = THAM_PHAN_OPTIONS[Math.floor(Math.random() * THAM_PHAN_OPTIONS.length)];
      newAssign[r.id] = randomTP;
    });
    setAssignMap(newAssign);
    // triggerNoti("─É├ú ph├ón c├┤ng ngß║½u nhi├¬n cho tß║Ñt cß║ú ─æ╞ín trong danh s├ích."); // TriggerNoti is not imported directly, it's global or passed? Wait, triggerNoti is defined in App.tsx globally?
  };

  const handleBulkAssign = (tp: string) => {
    if (!tp) return;
    if (selectedRows.length === 0) {
      alert("Vui l├▓ng chß╗ìn ├¡t nhß║Ñt mß╗Öt ─æ╞ín ─æß╗â ph├ón c├┤ng.");
      return;
    }
    const newAssign = { ...assignMap };
    selectedRows.forEach(id => newAssign[id] = tp);
    setAssignMap(newAssign);
    setSelectedRows([]);
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map(r => r.id));
    }
  };

  const tabs = ["DS ch╞░a ph├ón c├┤ng ngß║½u nhi├¬n", "DS ch╞░a ph├ón c├┤ng chß╗ë ─æß╗ïnh", "Quß║ún l├╜ kß║┐t quß║ú ph├ón c├┤ng"];

  // Tß╗ôn ─æß╗ìng ch╞░a ph├ón c├┤ng ΓÇö ─æß║┐m tr├¬n TO├ÇN Bß╗ÿ danh s├ích, kh├┤ng theo bß╗Ö lß╗ìc.
  // ─É├óy l├á con sß╗æ "c├▓n bao nhi├¬u viß╗çc phß║úi l├ám", bß╗Ö lß╗ìc chß╗ë l├á c├ích nh├¼n tß║ím
  // thß╗¥i n├¬n kh├┤ng ─æ╞░ß╗úc l├ám n├│ nhß╗Å ─æi. Phß║ºn ─æang hiß╗ân thß╗ï n├│i ri├¬ng ß╗ƒ vß║┐ sau.
  const soChuaPhanCong = rows.filter(r => !assignMap[r.id]).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* Tabs */}
      <div className="bg-white rounded-[4px] border border-[#ddd] overflow-hidden">
        <div className="flex border-b border-[#ddd]">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => { setTab(i as 0 | 1 | 2); setSelectedRows([]); }}
              className={`px-4 py-[9px] text-[13px] font-medium transition-colors border-b-2 -mb-px
                ${tab === i ? "border-[#8b1a1a] text-[#8b1a1a] bg-white" : "border-transparent text-[#666] hover:text-[#333] bg-[#fafafa]"}`}>
              {t}
            </button>
          ))}
          {/* Nhß║»c tß╗ôn ─æß╗ìng ΓÇö chß╗ë ß╗ƒ 2 tab ch╞░a ph├ón c├┤ng, v├¼ ─æ├│ l├á n╞íi c├ín bß╗Ö
              ─æang xß╗¡ l├╜ viß╗çc n├áy. Tab Quß║ún l├╜ kß║┐t quß║ú kh├┤ng cß║ºn. */}
          {tab !== 2 && (
            <div className="ml-auto flex items-center pr-4">
              {soChuaPhanCong > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-[3px] text-[11px] font-medium bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  C├▓n <b className="font-bold">{soChuaPhanCong}</b> vß╗Ñ ├ín ch╞░a ─æ╞░ß╗úc ph├ón c├┤ng
                  {/* Bß╗Ö lß╗ìc ─æang cß║»t bß╗¢t th├¼ n├│i r├╡, nß║┐u kh├┤ng con sß╗æ tr├¬n nh├ún
                      v├á sß╗æ d├▓ng d╞░ß╗¢i bß║úng lß╗çch nhau m├á kh├┤ng r├╡ v├¼ sao. */}
                  {filtered.length !== soChuaPhanCong && (
                    <span className="font-normal text-[#8a6d3b]">┬╖ ─æang hiß╗ân thß╗ï {filtered.length}</span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-[3px] text-[11px] font-medium bg-[#e8f7ee] text-[#1a7a45] border border-[#a9debb]">
                  <Check size={12} className="flex-shrink-0" />
                  ─É├ú ph├ón c├┤ng hß║┐t
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bß╗Ö lß╗ìc ΓÇö D├ÖNG CHUNG cho cß║ú 3 tab. Tr╞░ß╗¢c ─æ├óy chß╗ë tab Quß║ún l├╜ kß║┐t quß║ú
            mß╗¢i c├│ ─æß╗º ├┤ lß╗ìc, hai tab ch╞░a ph├ón c├┤ng chß╗ë c├│ mß╗ùi radio Cß║Ñp thß║⌐m
            ph├ín; c├╣ng mß╗Öt danh s├ích ─æ╞ín m├á mß╗ùi tab lß╗ìc ─æ╞░ß╗úc mß╗Öt kiß╗âu th├¼ c├ín bß╗Ö
            phß║úi nhß║úy sang tab kh├íc mß╗¢i t├¼m ─æ╞░ß╗úc ─æ╞ín cß║ºn ph├ón c├┤ng. */}
        <div className="p-4 space-y-3">
            {/* Cß║Ñp thß║⌐m ph├ín */}
            <div className="flex items-center gap-5">
              {[["tatca", "Tß║Ñt cß║ú"], ["toicao", "Thß║⌐m ph├ín tß╗æi cao"], ["bac3", "Thß║⌐m ph├ín bß║¡c 3"]].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <input type="radio" name="capTP" className="accent-[#8b1a1a]"
                    checked={capTP === val} onChange={() => setCapTP(val as "tatca" | "toicao" | "bac3")} />
                  <span className={capTP === val ? "font-semibold text-[#8b1a1a]" : "text-[#444]"}>{label}</span>
                </label>
              ))}
            </div>

            {/* Row 1: T├¬n t├▓a, Ng├áy nhß║¡p, H├¼nh thß╗⌐c, Ng╞░ß╗¥i nhß║¡p */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">T├¬n t├▓a ├ín</label>
                <div className="relative">
                  <select className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option>T├▓a ├ín nh├ón d├ón tß╗æi cao</option>
                    <option>TAND cß║Ñp cao tß║íi HN</option>
                    <option>TAND cß║Ñp cao tß║íi TP.HCM</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">Ng├áy nhß║¡p ─æ╞ín</label>
                <div className="flex items-center gap-1">
                  <input type="date" className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                  <span className="text-[#888] text-[11px]">ΓÇö</span>
                  <input type="date" className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">H├¼nh thß╗⌐c</label>
                <div className="relative">
                  <select value={hinhThucFilter} onChange={e => setHinhThucFilter(e.target.value)}
                    className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option value="">Tß║Ñt cß║ú h├¼nh thß╗⌐c</option>
                    {optionsHinhThucDonPhanCong()}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1">Ng╞░ß╗¥i nhß║¡p ─æ╞ín</label>
                <div className="relative">
                  <select className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                    <option value="">-- Chß╗ìn ng╞░ß╗¥i nhß║¡p ─æ╞ín --</option>
                    {["V┼⌐ V─ân Y├¬n", "L├¬ Thß╗ï H├á", "Ph├╣ng Tr├óm Anh"].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loß║íi ├ín checkboxes */}
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5">Loß║íi ├ín</label>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {LOAI_AN_OPTIONS.map(la => (
                  <label key={la} className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#333]">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={loaiAnFilter.includes(la)} onChange={() => toggleLoaiAn(la)} />
                    {la}
                  </label>
                ))}
              </div>
            </div>


        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[4px] border border-[#ddd] overflow-hidden">
        <div className="px-4 py-[9px] border-b border-[#ddd] flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#1d2e4f]">Danh s├ích ph├ón c├┤ng</span>
          {tab === 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh s├ích thß║⌐m ph├ín</span>
              </button>
              <button onClick={() => { handleRandomAssign(); alert("─É├ú ph├ón c├┤ng ngß║½u nhi├¬n th├ánh c├┤ng!"); }} className="flex items-center justify-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                <Users size={12} /> Ph├ón c├┤ng ngß║½u nhi├¬n
              </button>
            </div>
          )}
          {tab === 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh s├ích thß║⌐m ph├ín</span>
              </button>
              <span className="text-[12px] font-medium text-[#555]">Chß╗ë ─æß╗ïnh cho:</span>
              <div className="relative w-[180px]">
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) setShowLyDoPopup({ show: true, thamPhan: e.target.value }); e.target.value = ""; }}
                  className="w-full h-[28px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]"
                >
                  <option value="">-- Chß╗ìn thß║⌐m ph├ín --</option>
                  {THAM_PHAN_OPTIONS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          )}
          {tab === 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh s├ích thß║⌐m ph├ín</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                <Search size={12} />
                <span className="leading-none">T├¼m kiß║┐m</span>
              </button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {tab === 1 && (
                  <th className="border border-[#ddd] px-2 py-[6px] text-center w-[30px]">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={selectedRows.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[36px]">STT</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[130px]">Sß╗æ thß╗Ñ l├╜</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[95px]">Ng├áy thß╗Ñ l├╜</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Th├┤ng tin ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Th├┤ng tin BA/Q─É ─æß╗ü nghß╗ï G─ÉT, TT</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[130px]">Loß║íi ├ín</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">H├¼nh thß╗⌐c ─æ╞ín</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[160px]">Thß║⌐m ph├ín</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={tab === 1 ? 9 : 8} className="border border-[#ddd] px-4 py-10 text-center text-[#999]">Kh├┤ng c├│ dß╗» liß╗çu</td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                  {tab === 1 && (
                    <td className="border border-[#ddd] px-2 py-2 text-center">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </td>
                  )}
                  <td className="border border-[#ddd] px-2 py-2 text-center text-[#666]">{i + 1}</td>
                  <td className="border border-[#ddd] px-3 py-2 font-medium text-[#1a5a96]">{row.soThuLy}</td>
                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{row.ngayThuLy}</td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <div className="font-medium text-[#1d2e4f] leading-snug">{row.nguoiDungDon}</div>
                    <div className="text-[11px] text-[#888] mt-0.5 leading-snug">{row.diaChi}</div>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <div className="space-y-[2px] leading-snug">
                      <div><span className="text-[#888]">Sß╗æ BA: </span><span className="font-medium">{row.soBA}</span></div>
                      <div><span className="text-[#888]">Ng├áy: </span><span>{row.ngayBA}</span></div>
                      <div><span className="text-[#888]">T├▓a xx: </span><span>{row.toaBA}</span></div>
                    </div>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <span className="inline-block px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">{row.loaiAn}</span>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{row.hinhThuc}</td>
                  <td className="border border-[#ddd] px-3 py-2">
                    {tab === 2 ? (
                      /* ─É╞ín ─æ├ú c├│ tß╗¥ tr├¼nh: thß║⌐m ph├ín ─æ├ú ─æ╞░ß╗úc chß╗æt trong v─ân bß║ún
                         tr├¼nh k├╜. Sß╗¡a ß╗ƒ ─æ├óy sß║╜ khiß║┐n hß╗ô s╞í v├á tß╗¥ tr├¼nh ─æ├ú tr├¼nh
                         n├│i hai chuyß╗çn kh├íc nhau, n├¬n kh├│a lß║íi ΓÇö trß╗½ ng╞░ß╗¥i duyß╗çt
                         tß╗¥ tr├¼nh, v├¼ hß╗ì ch├¡nh l├á ng╞░ß╗¥i c├│ thß║⌐m quyß╗ün b├íc/─æß╗òi. */
                      row.toTrinh && !laNguoiDuyetToTrinh ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-medium ${assignMap[row.id] ? "text-[#27ae60]" : "text-[#999]"}`}>
                              {assignMap[row.id] || "ΓÇö"}
                            </span>
                            <Ban size={11} className="text-[#b45309] flex-shrink-0" />
                          </div>
                          <div className="text-[10px] text-[#b45309] leading-snug"
                            title="─É├ú lß║¡p tß╗¥ tr├¼nh ΓÇö chß╗ë ng╞░ß╗¥i duyß╗çt tß╗¥ tr├¼nh mß╗¢i ─æß╗òi ─æ╞░ß╗úc thß║⌐m ph├ín.">
                            <b className="font-semibold">{row.toTrinh.replace(/^TTr-/, "Sß╗æ tß╗¥ tr├¼nh-")}</b>
                          </div>
                        </div>
                      ) : editingRow === row.id ? (
                        <div className="space-y-2 min-w-[220px]">
                          {(() => {
                            const currentEditForm = editFormMap[row.id] ?? { ngaySua: new Date().toISOString().split("T")[0], lyDo: "" };
                            return (
                              <>
                          {/* Thß║⌐m ph├ín mß╗¢i */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Thß║⌐m ph├ín</label>
                            <div className="relative">
                              <select value={assignMap[row.id] ?? ""}
                                onChange={e => setAssignMap(p => ({ ...p, [row.id]: e.target.value }))}
                                className="w-full h-[26px] px-2 pr-6 text-[11px] border border-[#1a73e8] rounded-[3px] bg-white appearance-none focus:outline-none">
                                <option value="">-- Chß╗ìn thß║⌐m ph├ín --</option>
                                {THAM_PHAN_OPTIONS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                              </select>
                              <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                            </div>
                          </div>
                          {/* Ng├áy sß╗¡a */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Ng├áy sß╗¡a</label>
                            <input type="date" value={currentEditForm.ngaySua}
                              onChange={e => setEditFormMap(p => ({ ...p, [row.id]: { ...(p[row.id] ?? { ngaySua: "", lyDo: "" }), ngaySua: e.target.value } }))}
                              className="w-full h-[26px] px-2 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                          </div>
                          {/* L├╜ do ΓÇö Bß║«T BUß╗ÿC. ─Éß╗òi thß║⌐m ph├ín giß╗»a chß╗½ng l├á thay ─æß╗òi
                              c├│ hß╗ç quß║ú tß╗æ tß╗Ñng, hß╗ô s╞í phß║úi giß║úi tr├¼nh ─æ╞░ß╗úc v├¼ sao. */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">
                              L├╜ do sß╗¡a ph├ón c├┤ng <span className="text-[#8b1a1a]">*</span>
                            </label>
                            <textarea value={currentEditForm.lyDo}
                              onChange={e => setEditFormMap(p => ({ ...p, [row.id]: { ...(p[row.id] ?? { ngaySua: "", lyDo: "" }), lyDo: e.target.value } }))}
                              placeholder="Nhß║¡p l├╜ do..."
                              rows={2}
                              className={`w-full px-2 py-1 text-[11px] border rounded-[3px] focus:outline-none resize-none
                                ${currentEditForm.lyDo.trim().length >= 10 ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
                            {currentEditForm.lyDo.trim().length < 10 && (
                              <div className="text-[10px] text-[#8b1a1a] mt-0.5 leading-snug">
                                Nhß║¡p l├╜ do ─æß╗â l╞░u (tß╗æi thiß╗âu 10 k├╜ tß╗▒).
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 pt-0.5">
                            <button
                              disabled={currentEditForm.lyDo.trim().length < 10}
                              title={currentEditForm.lyDo.trim().length < 10 ? "Nhß║¡p l├╜ do sß╗¡a ph├ón c├┤ng ─æß╗â l╞░u" : undefined}
                              onClick={() => setEditingRow(null)}
                              className={`flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-white transition-colors
                                ${currentEditForm.lyDo.trim().length < 10 ? "bg-[#b7d3c0] cursor-not-allowed" : "bg-[#27ae60] hover:bg-[#1e8449]"}`}>
                              <Check size={10} /> L╞░u
                            </button>
                            <button onClick={() => setEditingRow(null)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#666] hover:bg-[#f0f0f0] transition-colors">
                              <X size={10} /> Hß╗ºy
                            </button>
                          </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-medium ${assignMap[row.id] ? "text-[#27ae60]" : "text-[#999]"}`}>
                              {assignMap[row.id] || "ΓÇö"}
                            </span>
                            <button onClick={() => startEdit(row.id)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#1a5a96] hover:bg-[#e8f0fe] transition-colors whitespace-nowrap">
                              <Pencil size={10} /> Sß╗¡a
                            </button>
                          </div>
                          {/* Ng╞░ß╗¥i duyß╗çt vß║½n sß╗¡a ─æ╞░ß╗úc, nh╞░ng phß║úi biß║┐t m├¼nh ─æang
                              ─æß╗Öng v├áo ─æ╞ín ─æ├ú nß║▒m trong tß╗¥ tr├¼nh n├áo. */}
                          {row.toTrinh && (
                            <div className="text-[10px] text-[#b45309] leading-snug">
                              ─É├ú lß║¡p tß╗¥ tr├¼nh <b className="font-semibold">{row.toTrinh}</b> ΓÇö bß║ín ─æß╗òi ─æ╞░ß╗úc vß╗¢i quyß╗ün duyß╗çt tß╗¥ tr├¼nh.
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="text-[#999]">ΓÇö</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* L├╜ do ph├ón c├┤ng chß╗ë ─æß╗ïnh ΓÇö Bß║«T BUß╗ÿC.
          Ph├ón c├┤ng chß╗ë ─æß╗ïnh kh├┤ng qua bß╗æc th─âm ngß║½u nhi├¬n n├¬n phß║úi ghi r├╡ c─ân cß╗⌐,
          nß║┐u kh├┤ng hß╗ô s╞í kh├┤ng giß║úi tr├¼nh ─æ╞░ß╗úc v├¼ sao chß╗ìn ─æ├║ng thß║⌐m ph├ín ─æ├│.
          State showLyDoPopup ─æ├ú c├│ sß║╡n tß╗½ tr╞░ß╗¢c nh╞░ng popup ch╞░a bao giß╗¥ ─æ╞░ß╗úc
          render ΓÇö chß╗ìn thß║⌐m ph├ín xong kh├┤ng c├│ g├¼ hiß╗çn ra. */}
      {showLyDoPopup.show && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50"
          onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}>
          <div className="bg-white rounded-[6px] w-[520px] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold">L├╜ do ph├ón c├┤ng chß╗ë ─æß╗ïnh</div>
              <button onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}
                className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4">
              <div className="text-[12px] leading-relaxed mb-3.5">
                <span className="text-[#666]">Chß╗ë ─æß╗ïnh cho: </span>
                <b className="text-[#333]">{showLyDoPopup.thamPhan}</b><br />
                <span className="text-[#666]">├üp dß╗Ñng cho: </span>
                <b className="text-[#333]">
                  {selectedRows.length > 0 ? `${selectedRows.length} vß╗Ñ ├ín ─æ├ú chß╗ìn` : "ch╞░a chß╗ìn vß╗Ñ ├ín n├áo"}
                </b>
              </div>

              <label className="block text-[11px] font-medium mb-1.5">
                L├╜ do ph├ón c├┤ng <span className="text-[#8b1a1a]">*</span>
              </label>
              <textarea value={lyDoChiDinh} onChange={e => setLyDoChiDinh(e.target.value)} rows={4} autoFocus
                placeholder="V├¡ dß╗Ñ: Thß║⌐m ph├ín ─æ├ú thß╗Ñ l├╜ vß╗Ñ ├ín li├¬n quan, bß║úo ─æß║úm t├¡nh li├¬n tß╗Ñc trong giß║úi quyß║┐tΓÇª"
                aria-describedby="loi-ly-do-chi-dinh"
                className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
                  ${lyDoChiDinh.trim() ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
              {!lyDoChiDinh.trim() && (
                <div id="loi-ly-do-chi-dinh" className="text-[11px] mt-1 text-[#8b1a1a]">
                  Nhß║¡p l├╜ do ph├ón c├┤ng ─æß╗â tiß║┐p tß╗Ñc.
                </div>
              )}

              <div className="mt-3.5 bg-[#fef3e2] border border-[#fcd48a] text-[#b45309] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>Ph├ón c├┤ng chß╗ë ─æß╗ïnh kh├┤ng qua bß╗æc th─âm ngß║½u nhi├¬n ΓÇö l├╜ do sß║╜ ─æ╞░ß╗úc l╞░u v├áo hß╗ô s╞í vß╗Ñ ├ín.</div>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2">
              <button onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}
                className="h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Huß╗╖
              </button>
              <button
                disabled={!lyDoChiDinh.trim() || selectedRows.length === 0}
                title={selectedRows.length === 0 ? "Chß╗ìn ├¡t nhß║Ñt mß╗Öt vß╗Ñ ├ín trong bß║úng" : undefined}
                onClick={() => {
                  setAssignMap(p => {
                    const n = { ...p };
                    selectedRows.forEach(id => { n[id] = showLyDoPopup.thamPhan; });
                    return n;
                  });
                  setShowLyDoPopup({ show: false, thamPhan: "" });
                  setLyDoChiDinh("");
                  setSelectedRows([]);
                }}
                className={`h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
                  ${!lyDoChiDinh.trim() || selectedRows.length === 0
                    ? "bg-[#d9c4c4] cursor-not-allowed" : "bg-[#8b1a1a] hover:bg-[#6e1414]"}`}>
                X├íc nhß║¡n ph├ón c├┤ng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Popup Bß╗ï c├ío ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const PopupBiCao = ({ onClose }: { onClose: () => void }) => {
  const [phanLoai, setPhanLoai] = useState<"canhan" | "tochuc">("canhan");
  const [khongCoCCCD, setKhongCoCCCD] = useState(false);
  const [isDangVien, setIsDangVien] = useState(false);
  const [coTienAn, setCoTienAn] = useState(false);
  const [diaChiTruoc, setDiaChiTruoc] = useState(false);

  const FLbl = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
    <label className="block text-[11px] font-medium text-[#555] mb-1">
      {children}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
  const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full h-[28px] border border-[#ccc] rounded-[3px] px-2 text-[12px] text-[#222] focus:outline-none focus:border-[#1a73e8]" />
  );
  const FSel = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      <select className="w-full h-[28px] border border-[#ccc] rounded-[3px] px-2 pr-6 text-[12px] text-[#222] appearance-none focus:outline-none focus:border-[#1a73e8] bg-white">
        {children}
      </select>
      <ChevronDown size={9} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );
  const Row2 = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  );
  const Row3 = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">{children}</div>
  );
  const SectionHdr = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[11px] font-semibold text-[#1d2e4f] uppercase tracking-wide pt-2 pb-1 border-b border-[#e0e0e0] mb-2">{children}</div>
  );
  const Chk = ({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) => (
    <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333]">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-[13px] h-[13px] accent-[#1d2e4f]" />
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[4px] shadow-xl w-[820px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
          <span className="text-[13px] font-semibold text-[#1d2e4f]">Th├¬m bß╗ï c├ío</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] transition-colors"><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 text-[12px]">

          {/* Ph├ón loß║íi */}
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-medium text-[#555]">Ph├ón loß║íi ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px]">
              <input type="radio" name="phanloai" value="canhan" checked={phanLoai === "canhan"} onChange={() => setPhanLoai("canhan")} className="accent-[#1d2e4f]" />
              C├í nh├ón
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px]">
              <input type="radio" name="phanloai" value="tochuc" checked={phanLoai === "tochuc"} onChange={() => setPhanLoai("tochuc")} className="accent-[#1d2e4f]" />
              C╞í quan/tß╗ò chß╗⌐c
            </label>
          </div>

          {/* T╞░ c├ích tham gia */}
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <FLbl req>T╞░ c├ích tham gia tß╗æ tß╗Ñng</FLbl>
              <FSel>
                <option value="">-- Chß╗ìn --</option>
                <option>Bß╗ï c├ío</option>
                <option>Bß╗ï hß║íi</option>
                <option>Nguy├¬n ─æ╞ín d├ón sß╗▒</option>
                <option>Bß╗ï ─æ╞ín d├ón sß╗▒</option>
                <option>Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi v├á ngh─⌐a vß╗Ñ li├¬n quan</option>
              </FSel>
            </div>
          </div>

          {/* Th├┤ng tin con ng╞░ß╗¥i */}
          <SectionHdr>Th├┤ng tin con ng╞░ß╗¥i</SectionHdr>
          <div className="flex gap-4">
            {/* ß║ónh */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[80px] h-[100px] border border-dashed border-[#ccc] rounded-[3px] flex flex-col items-center justify-center text-[#bbb] cursor-pointer hover:border-[#1a73e8] transition-colors text-center px-1">
                <Upload size={18} className="text-[#ccc]" />
                <span className="text-[10px] mt-1 leading-tight">ß║ónh ch├ón dung</span>
              </div>
            </div>
            {/* Basic fields */}
            <div className="flex-1 space-y-3">
              <Row2>
                <div><FLbl req>Hß╗ì v├á t├¬n</FLbl><FInp placeholder="Nhß║¡p hß╗ì v├á t├¬n" /></div>
                <div><FLbl>Ng├áy sinh</FLbl><FInp type="date" /></div>
              </Row2>
              <Row2>
                <div>
                  <FLbl>Giß╗¢i t├¡nh</FLbl>
                  <FSel><option value="">-- Giß╗¢i t├¡nh --</option><option>Nam</option><option>Nß╗»</option><option>Kh├íc</option></FSel>
                </div>
                <div className="flex items-end pb-1">
                  <Chk checked={khongCoCCCD} onChange={setKhongCoCCCD}>Kh├┤ng c├│ c─ân c╞░ß╗¢c</Chk>
                </div>
              </Row2>
              {!khongCoCCCD && (
                <Row3>
                  <div><FLbl>Sß╗æ c─ân c╞░ß╗¢c</FLbl><FInp placeholder="Sß╗æ CCCD" /></div>
                  <div><FLbl>Ng├áy cß║Ñp CCCD</FLbl><FInp type="date" /></div>
                  <div><FLbl>N╞íi cß║Ñp CCCD</FLbl><FInp placeholder="N╞íi cß║Ñp" /></div>
                </Row3>
              )}
            </div>
          </div>

          <Row3>
            <div><FLbl>D├ón tß╗Öc</FLbl><FSel><option value="">-- D├ón tß╗Öc --</option><option>Kinh</option><option>T├áy</option><option>Th├íi</option><option>Kh├íc</option></FSel></div>
            <div><FLbl>T├┤n gi├ío</FLbl><FSel><option value="">-- T├┤n gi├ío --</option><option>Kh├┤ng</option><option>Phß║¡t gi├ío</option><option>C├┤ng gi├ío</option><option>Kh├íc</option></FSel></div>
            <div><FLbl>Quß╗æc tß╗ïch</FLbl><FSel><option value="">-- Quß╗æc tß╗ïch --</option><option>Viß╗çt Nam</option><option>Kh├íc</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Nghß╗ü nghiß╗çp</FLbl><FSel><option value="">-- Nghß╗ü nghiß╗çp --</option><option>C├┤ng nh├ón</option><option>N├┤ng d├ón</option><option>C├ín bß╗Ö</option><option>Kh├íc</option></FSel></div>
            <div><FLbl>Nghß╗ü nghiß╗çp r├╡</FLbl><FInp placeholder="M├┤ tß║ú cß╗Ñ thß╗â" /></div>
            <div><FLbl>Chß╗⌐c vß╗Ñ/quyß╗ün hß║ín</FLbl><FSel><option value="">-- Chß╗ìn --</option><option>Kh├┤ng c├│</option><option>C├ín bß╗Ö</option><option>L├únh ─æß║ío</option></FSel></div>
          </Row3>
          <Row3>
            <div className="col-span-2"><FLbl>N╞íi l├ám viß╗çc</FLbl><FInp placeholder="T├¬n c╞í quan, ─æ╞ín vß╗ï" /></div>
            <div><FLbl>Ngoß║íi ngß╗»</FLbl><FSel><option value="">-- Ngoß║íi ngß╗» --</option><option>Kh├┤ng</option><option>Tiß║┐ng Anh</option><option>Kh├íc</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Tr├¼nh ─æß╗Ö v─ân h├│a</FLbl><FSel><option value="">-- Chß╗ìn --</option><option>Tiß╗âu hß╗ìc</option><option>THCS</option><option>THPT</option></FSel></div>
            <div><FLbl>Tr├¼nh ─æß╗Ö ─æ├áo tß║ío</FLbl><FSel><option value="">-- Chß╗ìn --</option><option>Kh├┤ng c├│</option><option>Trung cß║Ñp</option><option>Cao ─æß║│ng</option><option>─Éß║íi hß╗ìc</option><option>Sau ─æß║íi hß╗ìc</option></FSel></div>
            <div><FLbl>Th├ánh phß║ºn gia ─æ├¼nh</FLbl><FSel><option value="">-- Chß╗ìn --</option><option>B├¼nh th╞░ß╗¥ng</option><option>Ch├¡nh s├ích</option><option>Kh├íc</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Sß╗æ ─æiß╗çn thoß║íi</FLbl><FInp placeholder="Sß╗æ ─æiß╗çn thoß║íi" /></div>
            <div><FLbl>Email</FLbl><FInp type="email" placeholder="Email" /></div>
            <div><FLbl>Sß╗æ fax</FLbl><FInp placeholder="Sß╗æ fax" /></div>
          </Row3>

          <div className="flex items-center gap-6 pt-1">
            <Chk checked={isDangVien} onChange={setIsDangVien}>L├á ─æß║úng vi├¬n</Chk>
            {isDangVien && (
              <div className="w-52">
                <FSel><option value="">-- Ph├ón loß║íi ─æß║úng vi├¬n --</option><option>─Éß║úng vi├¬n ch├¡nh thß╗⌐c</option><option>─Éß║úng vi├¬n dß╗▒ bß╗ï</option></FSel>
              </div>
            )}
            <Chk checked={coTienAn} onChange={setCoTienAn}>C├│ tiß╗ün ├ín tiß╗ün sß╗▒</Chk>
          </div>

          {/* Danh s├ích giß║Ñy tß╗¥ */}
          <SectionHdr>Danh s├ích giß║Ñy tß╗¥</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "Loß║íi giß║Ñy tß╗¥", "Sß╗æ", "Ng├áy cß║Ñp", "N╞íi cß║Ñp", "Thao t├íc"].map(h => (
                    <th key={h} className="px-3 py-[6px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={6} className="text-center text-[#aaa] py-4 italic">Ch╞░a c├│ giß║Ñy tß╗¥. Nhß║Ñn Th├¬m giß║Ñy tß╗¥ ─æß╗â bß╗ò sung.</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <FLbl>Ghi ch├║</FLbl>
            <textarea rows={2} placeholder="Ghi ch├║..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
          </div>

          {/* ─Éß╗ïa danh */}
          <SectionHdr>─Éß╗ïa danh tr╞░ß╗¢c s├ít nhß║¡p</SectionHdr>
          <Chk checked={diaChiTruoc} onChange={setDiaChiTruoc}>─Éß╗ïa chß╗ë tr╞░ß╗¢c s├ít nhß║¡p</Chk>

          {(["N╞íi sinh", "Qu├¬ qu├ín", "N╞íi ─æ─âng k├¡ HKTT", "N╞íi tß║ím tr├║", "N╞íi ß╗ƒ hiß╗çn tß║íi"] as const).map(label => (
            <div key={label}>
              <div className="text-[11px] font-medium text-[#444] mb-1.5">{label}</div>
              <div className={`grid gap-x-4 gap-y-2 ${diaChiTruoc ? "grid-cols-4" : "grid-cols-3"}`}>
                {diaChiTruoc && <div><FLbl>Quß║¡n/Huyß╗çn</FLbl><FInp placeholder="Quß║¡n/Huyß╗çn" /></div>}
                <div><FLbl>Ph╞░ß╗¥ng/X├ú</FLbl><FSel><option value="">-- Ph╞░ß╗¥ng/X├ú --</option></FSel></div>
                <div><FLbl>Tß╗ënh/Th├ánh phß╗æ</FLbl><FSel><option value="">-- Tß╗ënh/TP --</option><option>H├á Nß╗Öi</option><option>TP. Hß╗ô Ch├¡ Minh</option><option>Bß║»c Ninh</option></FSel></div>
                <div><FLbl>Quß╗æc gia</FLbl><FSel><option value="">-- Quß╗æc gia --</option><option>Viß╗çt Nam</option></FSel></div>
              </div>
            </div>
          ))}

          {/* Th├┤ng tin quan hß╗ç */}
          <SectionHdr>Th├┤ng tin quan hß╗ç</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "Hß╗ì t├¬n", "Ng├áy sinh", "Giß╗¢i t├¡nh", "CCCD/CMT", "Quan hß╗ç", "N╞íi ß╗ƒ hiß╗çn nay", "Ch├║ th├¡ch", "Thao t├íc"].map(h => (
                    <th key={h} className="px-2 py-[5px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={9} className="text-center text-[#aaa] py-4 italic">Kh├┤ng c├│ dß╗» liß╗çu</td></tr>
              </tbody>
            </table>
          </div>

          {/* Th├┤ng tin tß╗Öi danh */}
          <SectionHdr>Th├┤ng tin tß╗Öi danh</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "─Éiß╗üu", "Khoß║ún", "─Éiß╗âm", "Bß╗Ö luß║¡t TTHS", "Tß╗Öi danh ch├¡nh", "Thao t├íc"].map(h => (
                    <th key={h} className="px-3 py-[5px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={7} className="text-center text-[#aaa] py-4 italic">Kh├┤ng c├│ dß╗» liß╗çu</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#999] italic">Chß╗ìn mß╗Öt tß╗Öi danh ─æß╗â xem hoß║╖c th├¬m h├¼nh phß║ít.</p>

          {/* Th├┤ng tin thß╗æng k├¬ */}
          <SectionHdr>Th├┤ng tin thß╗æng k├¬</SectionHdr>
          <div className="flex items-center gap-6">
            <Chk checked={false} onChange={() => { }}>─Éß║ºu vß╗Ñ</Chk>
            <Chk checked={false} onChange={() => { }}>Trß║╗ vß╗ï th├ánh ni├¬n</Chk>
            <Chk checked={false} onChange={() => { }}>T├íi phß║ím, t├íi phß║ím nguy hiß╗âm</Chk>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
          <BtnSecondary onClick={onClose}>Hß╗ºy</BtnSecondary>
          <BtnPrimary>L╞░u</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Popup Danh s├ích Thß║⌐m ph├ín ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const THAM_PHAN_DATA = [
  {
    id: 1, hoTen: "Nguyß╗àn Thß╗ï Lan", bac: "Thß║⌐m ph├ín TANDTC", donang: [
      { maVu: "15/2024/G─ÉT-HS", loai: "H├¼nh sß╗▒", tenVu: "Nguyß╗àn V─ân An ΓÇö kh├íng nghß╗ï bß║ún ├ín 12/2022/HS-PT" },
      { maVu: "08/2024/G─ÉT-DS", loai: "D├ón sß╗▒", tenVu: "Trß║ºn Thß╗ï B├¼nh kiß╗çn tranh chß║Ñp ─æß║Ñt ─æai" },
      { maVu: "21/2024/G─ÉT-HC", loai: "H├ánh ch├¡nh", tenVu: "L├¬ V─ân C╞░ß╗¥ng kiß╗çn UBND tß╗ënh V─⌐nh Ph├║c" },
    ]
  },
  {
    id: 2, hoTen: "Phß║ím V─ân ─Éß╗⌐c", bac: "Thß║⌐m ph├ín TANDTC", donang: [
      { maVu: "03/2024/G─ÉT-KDTM", loai: "KDTM", tenVu: "C├┤ng ty Minh ─Éß╗⌐c kiß╗çn ─æß╗æi t├íc vi phß║ím hß╗úp ─æß╗ông" },
      { maVu: "19/2024/G─ÉT-HS", loai: "H├¼nh sß╗▒", tenVu: "Ho├áng V─ân Em ΓÇö ─æß╗ü nghß╗ï gi├ím ─æß╗æc thß║⌐m" },
    ]
  },
  {
    id: 3, hoTen: "Trß║ºn Thß╗ï H╞░╞íng", bac: "Thß║⌐m ph├ín TANDTC", donang: [
      { maVu: "07/2024/G─ÉT-DS", loai: "D├ón sß╗▒", tenVu: "Nguyß╗àn Thß╗ï Ph╞░╞íng ΓÇö tranh chß║Ñp thß╗½a kß║┐" },
      { maVu: "11/2024/G─ÉT-HN", loai: "H├┤n nh├ón G─É", tenVu: "V┼⌐ V─ân Giang xin ly h├┤n, chia t├ái sß║ún" },
      { maVu: "25/2024/G─ÉT-HS", loai: "H├¼nh sß╗▒", tenVu: "─Éinh Thß╗ï Hoa ΓÇö k├¬u oan ├ín tß╗¡ h├¼nh" },
      { maVu: "31/2024/G─ÉT-L─É", loai: "Lao ─æß╗Öng", tenVu: "C├┤ng ty ABC kiß╗çn tranh chß║Ñp lao ─æß╗Öng" },
    ]
  },
  {
    id: 4, hoTen: "L├¬ Minh Tuß║Ñn", bac: "Thß║⌐m ph├ín bß║¡c 3", donang: [
      { maVu: "02/2024/G─ÉT-HC", loai: "H├ánh ch├¡nh", tenVu: "Tr╞░╞íng V─ân Inh kiß╗çn UBND huyß╗çn Gia L├óm" },
    ]
  },
  {
    id: 5, hoTen: "─Éß╗ù Thß╗ï Kim Oanh", bac: "Thß║⌐m ph├ín bß║¡c 3", donang: [
      { maVu: "14/2024/G─ÉT-DS", loai: "D├ón sß╗▒", tenVu: "B├╣i V─ân Khoa ΓÇö tranh chß║Ñp hß╗úp ─æß╗ông vay" },
      { maVu: "22/2024/G─ÉT-KDTM", loai: "KDTM", tenVu: "Doanh nghiß╗çp Long Ph├ít kiß╗çn ─æß╗æi t├íc" },
    ]
  },
];

const LOAI_COLOR: Record<string, string> = {
  "H├¼nh sß╗▒": "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]",
  "D├ón sß╗▒": "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]",
  "H├ánh ch├¡nh": "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]",
  "KDTM": "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]",
  "H├┤n nh├ón G─É": "bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]",
  "Lao ─æß╗Öng": "bg-[#f0fdf4] text-[#166534] border-[#86efac]",
};

const PopupThamPhan = ({ onClose }: { onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("");

  const filtered = THAM_PHAN_DATA.filter(tp => {
    const matchName = tp.hoTen.toLowerCase().includes(search.toLowerCase());
    const matchLoai = !filterLoai || tp.donang.some(d => d.loai === filterLoai);
    return matchName && matchLoai;
  });

  const loaiOptions = Array.from(new Set(THAM_PHAN_DATA.flatMap(tp => tp.donang.map(d => d.loai))));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[4px] shadow-xl w-[860px] max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-[#1d2e4f]" />
            <span className="text-[13px] font-semibold text-[#1d2e4f]">Danh s├ích thß║⌐m ph├ín ─æang giß║úi quyß║┐t vß╗Ñ viß╗çc</span>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] transition-colors"><X size={16} /></button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
          <div className="relative flex-1 max-w-[280px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="T├¼m theo t├¬n thß║⌐m ph├ín..."
              className="w-full h-[30px] pl-7 pr-3 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>
          <div className="relative">
            <select value={filterLoai} onChange={e => setFilterLoai(e.target.value)}
              className="h-[30px] pl-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
              <option value="">-- Tß║Ñt cß║ú loß║íi ├ín --</option>
              {loaiOptions.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
          </div>
          <span className="text-[11px] text-[#888] ml-auto">{filtered.length} thß║⌐m ph├ín</span>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0] w-[180px]">Thß║⌐m ph├ín</th>
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0] w-[120px]">Bß║¡c</th>
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0]">Vß╗Ñ viß╗çc ─æang giß║úi quyß║┐t</th>
                <th className="px-4 py-[8px] text-center font-semibold text-[#333] w-[90px]">Tß╗òng sß╗æ ─æ╞ín</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tp, idx) => (
                <tr key={tp.id} className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <div className="font-medium text-[#1d2e4f]">{tp.hoTen}</div>
                  </td>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <span className="inline-block px-2 py-[3px] rounded-sm text-[10px] font-medium bg-[#eef1f5] text-[#1d2e4f] border border-[#c5cfe0]">{tp.bac}</span>
                  </td>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <div className="space-y-1.5">
                      {tp.donang.filter(d => !filterLoai || d.loai === filterLoai).map(d => (
                        <div key={d.maVu} className="flex items-start gap-2">
                          <span className={`flex-shrink-0 inline-block px-1.5 py-[2px] rounded-sm text-[10px] font-medium border ${LOAI_COLOR[d.loai] ?? "bg-[#f5f5f5] text-[#555] border-[#ddd]"}`}>
                            {d.loai}
                          </span>
                          <span className="text-[#333] leading-snug">
                            <span className="font-medium text-[#555] mr-1">{d.maVu}</span>
                            {d.tenVu}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-center">
                    <span className={`inline-flex items-center justify-center w-[32px] h-[32px] rounded-full text-[13px] font-bold border-2 ${tp.donang.length >= 4 ? "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]" : tp.donang.length >= 2 ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]" : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
                      {tp.donang.length}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center text-[#aaa] italic py-8">Kh├┤ng t├¼m thß║Ñy thß║⌐m ph├ín ph├╣ hß╗úp</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e0e0e0] bg-[#fafafa] text-[11px] text-[#888]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#e8f7ee] border-2 border-[#a9debb] inline-block" /> 1 ─æ╞ín</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#fef3e2] border-2 border-[#fcd48a] inline-block" /> 2ΓÇô3 ─æ╞ín</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#fde8e8] border-2 border-[#f5b7b7] inline-block" /> Tß╗½ 4 ─æ╞ín trß╗ƒ l├¬n</span>
          </div>
          <button onClick={onClose} className="h-[28px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">─É├│ng</button>
        </div>
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Popup L├únh ─æß║ío ph├¬ duyß╗çt ├╜ kiß║┐n ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const PopupLanhDaoPheDuyetYkien = ({ onClose, initialLoaiDeXuat }: { onClose: () => void; initialLoaiDeXuat?: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [rutGon, setRutGon] = useState(false);
  const [docType, setDocType] = useState(initialLoaiDeXuat || "Tß╗¥ tr├¼nh ph├ón c├┤ng");
  const [toTrinhExpanded, setToTrinhExpanded] = useState(true);
  const [d1Expanded, setD1Expanded] = useState(true);
  const [d2Expanded, setD2Expanded] = useState(true);
  const [d3Expanded, setD3Expanded] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState("to-trinh-1");
  const [showLichSuYKien, setShowLichSuYKien] = useState(false);
  const isToTrinh = docType.toLowerCase().includes("tß╗¥ tr├¼nh") || docType.toLowerCase().includes("to trinh");

  return (
    <>
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[8px] shadow-2xl w-[1300px] max-w-[95vw] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee] flex-shrink-0">
          <div className="flex flex-col">
            <div className="text-[11px] text-[#666] flex items-center gap-1 font-medium">
              <span>Trang chß╗º</span> / <span>C├┤ng t├íc l├únh ─æß║ío</span> / <span>Ph├¬ duyß╗çt ─æß╗ü xuß║Ñt</span> / <span className="font-semibold text-[#8b1a1a]">├¥ kiß║┐n l├únh ─æß║ío</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#1d2e4f] mt-1">L├únh ─æß║ío ph├¬ duyß╗çt ├╜ kiß║┐n</h2>
            <div className="text-[12px] text-[#888] font-semibold mt-0.5">VA26-001201 - Vß╗Ñ giß║úi quyß║┐t ─æ╞ín 5777</div>
          </div>
          <button onClick={onClose} className="h-[32px] px-3 bg-white border border-[#ccc] hover:bg-gray-50 text-[12px] font-medium rounded text-[#333] flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Quay lß║íi
          </button>
        </div>

        {/* Body: Split Layout */}
        <div className="flex-1 overflow-hidden flex flex-row">

          {/* LEFT: Processing Panel */}
          <div className="w-[50%] border-r border-[#eee] overflow-y-auto p-5 bg-[#fbfbfb] flex flex-col">


            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#eee] mb-4 flex-shrink-0">
              {["├¥ kiß║┐n l├únh ─æß║ío", isToTrinh ? "Th├┤ng tin tß╗¥ tr├¼nh" : "Th├┤ng tin v─ân bß║ún"].map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`pb-2 text-[14px] font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#333]"
                    }`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col border border-[#eee] bg-white rounded-[4px] p-4 shadow-sm min-h-[350px]">
              {activeTab === 0 && (
                isToTrinh ? (
                  // ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Tß╗£ TR├îNH LAYOUT ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                  <div className="flex flex-col h-full flex-1">
                    {/* Collapsible Accordion Header */}
                    <div className="border border-[#e2e8f0] rounded-[6px] bg-white mb-3 shadow-sm overflow-hidden flex-shrink-0">
                      <div className="p-3 bg-white flex items-center justify-between border-b border-[#eee]">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#1d2e4f] flex items-center gap-1">
                            <ChevronDown size={14} /> Tß╗¥ tr├¼nh ph├ón c├┤ng thß║⌐m ph├ín - Sß╗æ 112/2026/TTr-TANDTC-VP
                          </span>
                          <span className="text-[11px] text-[#666] ml-4.5">TLM: 5467614 - Ng├áy TL: 18/06/2026</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white space-y-3">
                        {/* Light blue proposal opinion box */}
                        <div className="bg-[#eaf4fe] border border-[#bee2ff] rounded-[4px] p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] font-bold text-[#1a5a96]">├¥ kiß║┐n ─æß╗ü xuß║Ñt | Ph├│ ch├ính v─ân ph├▓ng - Nguyß╗àn Mß║ính H├╣ng</span>
                            <button onClick={() => setShowLichSuYKien(true)} className="text-[11px] text-[#1a5a96] hover:underline font-medium flex items-center gap-0.5">
                              <HistoryIcon size={11} /> Xem diß╗àn biß║┐n
                            </button>
                          </div>
                          <div className="text-[12px] text-[#333] font-medium">
                            ─Éß╗ông ├╜, tr├¼nh Ph├│ Ch├ính ├ín Nguyß╗àn Hß║úi Tr├óm
                          </div>
                        </div>

                        {/* Leadership opinion content textarea */}
                        <div className="border border-[#e2e8f0] rounded-[4px] p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-bold text-[#333]">├¥ kiß║┐n l├únh ─æß║ío</span>
                            <button className="text-[#888] hover:text-[#555]"><RotateCcw size={13} /></button>
                          </div>
                          <div className="border-t border-dashed border-[#e2e8f0] pt-2">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-red-500 font-bold text-[12px]">*</span>
                              <span className="text-[11px] font-semibold text-[#666]">Nß╗Öi dung ├╜ kiß║┐n l├únh ─æß║ío</span>
                            </div>
                            <textarea
                              defaultValue="L├únh ─æß║ío ─æß╗ü xuß║Ñt ├╜ kiß║┐n:"
                              className="w-full p-2.5 text-[12px] border border-[#ccc] rounded-[4px] focus:outline-none focus:border-[#8b1a1a] min-h-[90px] resize-none"
                            />
                            <div className="text-right text-[10px] text-[#888] mt-1">24 / 4000</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f0f5fa] rounded-[6px] border border-[#d6e4f0] overflow-hidden mt-auto flex-shrink-0">
                      <div className="px-4 py-2 bg-[#e6eff8] border-b border-[#d6e4f0] text-[13px] font-bold text-[#1d2e4f]">
                        ─Éß╗ü xuß║Ñt tr├¼nh tiß║┐p
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-6 bg-white">
                        <div>
                          <label className="block text-[12px] text-[#666] mb-1.5 font-medium">Cß║Ñp tr├¼nh tiß║┐p</label>
                          <div className="relative">
                            <select className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                              <option value="">Chß╗ìn cß║Ñp tr├¼nh tiß║┐p</option>
                              <option value="1">L├únh ─æß║ío t├▓a</option>
                              <option value="2">Ch├ính ├ín</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] text-[#666] mb-1.5 font-medium">Ng╞░ß╗¥i ─æß╗ü xuß║Ñt tr├¼nh</label>
                          <div className="relative">
                            <select className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                              <option value="">Chß╗ìn ng╞░ß╗¥i ─æß╗ü xuß║Ñt tr├¼nh</option>
                              <option value="1">Nguyß╗àn V─ân A</option>
                              <option value="2">Trß║ºn Thß╗ï B</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-[#eee] bg-white flex items-center justify-end gap-2 flex-wrap">
                        <button className="h-[32px] px-3 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">
                          Chß╗ënh sß╗¡a Word
                        </button>
                        <button className="h-[32px] px-3 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">
                          L╞░u
                        </button>
                        <button className="h-[32px] px-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[4px] text-[12px] font-medium transition-colors shadow-sm">
                          L╞░u v├á k├╜
                        </button>
                        <button className="h-[32px] px-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[4px] text-[12px] font-medium transition-colors shadow-sm">
                          L╞░u v├á k├╜ logic
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ NORMAL SIGNING LAYOUT ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                  <div className="flex flex-col h-full flex-1 justify-between">
                    <div>
                      <label className="block text-[13px] font-bold text-[#1d2e4f] mb-2">├¥ kiß║┐n chß╗ë ─æß║ío / Ph├¬ duyß╗çt</label>
                      <textarea
                        placeholder="Nhß║¡p ├╜ kiß║┐n chß╗ë ─æß║ío hoß║╖c nhß║¡n x├⌐t cß╗ºa L├únh ─æß║ío ─æß╗æi vß╗¢i v─ân bß║ún/quyß║┐t ─æß╗ïnh n├áy..."
                        className="w-full p-3 text-[13px] border border-[#ccc] rounded-[4px] focus:outline-none focus:border-[#8b1a1a] min-h-[140px] resize-none"
                      />
                    </div>

                    <div className="bg-[#fcfcfc] border border-[#e2e8f0] p-4 rounded-[6px] mt-4">
                      <div className="text-[12px] text-[#555] mb-2 font-medium">Th├┤ng tin k├╜ sß╗æ:</div>
                      <div className="text-[13px] text-[#333]">Ng╞░ß╗¥i k├╜: <span className="font-semibold">Phß║ím V─ân Nha</span> (Ph├│ Ch├ính V─ân ph├▓ng)</div>
                    </div>

                    <div className="px-4 py-3 border-t border-[#eee] bg-white flex items-center justify-end gap-3 mt-6">
                      <button className="h-[32px] px-4 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[13px] font-medium transition-colors">
                        Chß╗ënh sß╗¡a Word
                      </button>
                      <button className="h-[32px] px-4 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[13px] font-medium transition-colors">
                        L╞░u ├╜ kiß║┐n
                      </button>
                      <button className="h-[32px] px-4 bg-[#27ae60] hover:bg-[#219653] text-white rounded-[4px] text-[13px] font-medium transition-colors shadow-sm">
                        K├╜ sß╗æ ph├¬ duyß╗çt
                      </button>
                      <button className="h-[32px] px-4 bg-[#7f8c8d] hover:bg-[#6c7a89] text-white rounded-[4px] text-[13px] font-medium transition-colors shadow-sm">
                        Trß║ú lß║íi v─ân bß║ún
                      </button>
                    </div>
                  </div>
                )
              )}
              {activeTab === 1 && (
                <div className="flex flex-col h-full flex-1 gap-4 overflow-y-auto">
                  <div className="border border-[#e2e8f0] rounded-[6px] p-4 bg-white shadow-sm flex flex-col flex-1">
                    <div className="text-[12px] font-bold text-[#1d2e4f] mb-2 uppercase tracking-wider">Cß║Ñu tr├║c t├ái liß╗çu tr├¼nh k├╜</div>
                    <div className="text-[11px] text-[#666] mb-3 italic">
                      L╞░u ├╜: Mß╗Öt tß╗¥ tr├¼nh bao gß╗ôm nhiß╗üu danh s├ích ─æ╞ín ─æß╗ü xuß║Ñt. Mß╗ùi Thß║⌐m ph├ín thuß╗Öc mß╗Öt Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra cß║Ñu th├ánh mß╗Öt danh s├ích ri├¬ng biß╗çt.
                    </div>

                    <div className="border border-[#eee] rounded-[4px] bg-white overflow-hidden text-[12px] flex-1">

                      {/* LEVEL 1: Tß╗¥ tr├¼nh duy nhß║Ñt */}
                      <div className="flex flex-col">
                        <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2.5 px-3 cursor-pointer ${selectedNodeId === "to-trinh-1" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                          onClick={() => setSelectedNodeId("to-trinh-1")}
                        >
                          <button onClick={(e) => { e.stopPropagation(); setToTrinhExpanded(!toTrinhExpanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                            {toTrinhExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <FileText size={15} className="text-[#8b1a1a] mr-2 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1d2e4f]">{docType} ph├ón c├┤ng TP - Sß╗æ 112/2026/TTr-TANDTC-VP</span>
                            <span className="text-[9px] text-[#666]">Sß╗æ l╞░ß╗úng: 3 Danh s├ích | 4 ─É╞ín tr├¼nh duyß╗çt</span>
                          </div>
                        </div>

                        {toTrinhExpanded && (
                          <div className="flex flex-col">

                            {/* LEVEL 2: Danh s├ích 1 (Thß║⌐m ph├ín B├╣i Ngß╗ìc L├óm - Vß╗Ñ G─ÉKT D├ón sß╗▒) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-1" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-1")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD1Expanded(!d1Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d1Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh s├ích ─æ╞ín - TP. B├╣i Ngß╗ìc L├óm (Vß╗Ñ G─ÉKT D├ón sß╗▒)</span>
                                <span className="text-[9px] text-[#666]">─É╞ín vß╗ï chuyß╗ân ─æß║┐n: TAND tß╗ënh Bß║»c Ninh</span>
                              </div>

                            </div>

                            {d1Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: C├íc ─É╞ín thuß╗Öc Danh s├ích 1 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7031" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7031")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT (7031) - B├╣i Ph╞░╞íng Thß║úo</span>
                                    <span className="text-[10px] text-[#666]">M├ú thß╗Ñ l├╜: VA26-001201 | Ng├áy nhß║¡n: 18/06/2026</span>
                                  </div>

                                </div>
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7034" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7034")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT (7034) - L├¬ V─ân D</span>
                                    <span className="text-[10px] text-[#666]">M├ú thß╗Ñ l├╜: VA26-001204 | Ng├áy nhß║¡n: 21/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                            {/* LEVEL 2: Danh s├ích 2 (Thß║⌐m ph├ín B├╣i Ngß╗ìc L├óm - Vß╗Ñ G─ÉKT H├¼nh sß╗▒) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-2" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-2")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD2Expanded(!d2Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d2Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh s├ích ─æ╞ín - TP. B├╣i Ngß╗ìc L├óm (Vß╗Ñ G─ÉKT H├¼nh sß╗▒)</span>
                                <span className="text-[9px] text-[#666]">─É╞ín vß╗ï chuyß╗ân ─æß║┐n: TAND tß╗ënh Lß║íng S╞ín</span>
                              </div>

                            </div>

                            {d2Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: C├íc ─É╞ín thuß╗Öc Danh s├ích 2 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7033" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7033")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT (7033) - Trß║ºn Thß╗ï B</span>
                                    <span className="text-[10px] text-[#666]">M├ú thß╗Ñ l├╜: VA26-001203 | Ng├áy nhß║¡n: 20/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                            {/* LEVEL 2: Danh s├ích 3 (Thß║⌐m ph├ín Nguyß╗àn V─ân C - Vß╗Ñ G─ÉKT H├ánh ch├¡nh) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-3" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-3")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD3Expanded(!d3Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d3Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh s├ích ─æ╞ín - TP. Nguyß╗àn V─ân C (Vß╗Ñ G─ÉKT H├ánh ch├¡nh)</span>
                                <span className="text-[9px] text-[#666]">─É╞ín vß╗ï chuyß╗ân ─æß║┐n: TAND tß╗ënh Bß║»c Giang</span>
                              </div>

                            </div>

                            {d3Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: C├íc ─É╞ín thuß╗Öc Danh s├ích 3 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7032" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7032")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT (7032) - Nguyß╗àn V─ân A</span>
                                    <span className="text-[10px] text-[#666]">M├ú thß╗Ñ l├╜: VA26-001202 | Ng├áy nhß║¡n: 19/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Document Preview Panel */}
          <div className="w-[50%] bg-[#f0f0f0] overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
            {/* Toolbar */}
            <div className="w-full max-w-[520px] flex items-center justify-between bg-white border border-[#ccc] rounded px-3 py-2 shadow-sm flex-shrink-0">
              <span className="text-[12px] font-bold text-[#1d2e4f] flex items-center gap-1.5">
                <FileText size={14} className="text-[#1a5a96]" /> Xem tr╞░ß╗¢c t├ái liß╗çu ({
                  selectedNodeId.startsWith("to-trinh-") ? "Tß╗¥ tr├¼nh" : selectedNodeId.startsWith("danh-sach-") ? "Danh s├ích phß╗Ñ lß╗Ñc" : "Chi tiß║┐t ─É╞ín"
                })
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Ph├│ng to"><ZoomIn size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Thu nhß╗Å"><ZoomOut size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Xoay"><RotateCcw size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Tß║úi vß╗ü"><Download size={14} className="text-[#666]" /></button>
              </div>
            </div>

            {selectedNodeId.startsWith("to-trinh-") ? (
              /* Mß║¬U PREVIEW Tß╗£ TR├îNH */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-7 relative min-h-[580px] font-serif text-[11px] leading-relaxed text-[#000]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center w-[160px]">
                    <div className="text-[10px] font-normal uppercase">T├ÆA ├üN NH├éN D├éN Tß╗ÉI CAO</div>
                    <div className="text-[10px] font-bold uppercase underline decoration-solid underline-offset-4">V─éN PH├ÆNG</div>
                    <div className="text-[9px] mt-2">Sß╗æ: /TTr-TANDTC-VP</div>
                  </div>
                  <div className="text-center w-[250px]">
                    <div className="text-[10px] font-bold uppercase">Cß╗ÿNG H├ÆA X├â Hß╗ÿI CHß╗ª NGH─¿A VIß╗åT NAM</div>
                    <div className="text-[10px] font-bold underline decoration-solid underline-offset-4">─Éß╗Öc lß║¡p - Tß╗▒ do - Hß║ính ph├║c</div>
                    <div className="text-[9.5px] italic mt-2">H├á Nß╗Öi, ng├áy..... th├íng..... n─âm 2026</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6 space-y-1">
                  <div className="text-[12px] font-bold uppercase">Tß╗£ TR├îNH</div>
                  <div className="text-[11px] font-bold max-w-[400px] mx-auto leading-normal">
                    Vß╗ü viß╗çc thß╗Ñ l├╜ ─æ╞ín v├á ph├ón c├┤ng Thß║⌐m ph├ín giß║úi quyß║┐t ─æ╞ín ─æß╗ü nghß╗ï xem x├⌐t lß║íi quyß║┐t ─æß╗ïnh, bß║ún ├ín ─æ├ú c├│ hiß╗çu lß╗▒c ph├íp luß║¡t theo tr├¼nh tß╗▒ gi├ím ─æß╗æc thß║⌐m, t├íi thß║⌐m
                  </div>
                </div>

                {/* Recipient */}
                <div className="mb-4">
                  <span className="font-bold">K├¡nh tr├¼nh:</span> ─Éß╗ông ch├¡ Ch├ính ├ín T├▓a ├ín nh├ón d├ón tß╗æi cao
                </div>

                {/* Body */}
                <div className="space-y-3 text-justify text-[10.5px]">
                  <p>
                    V─ân ph├▓ng T├▓a ├ín nh├ón d├ón tß╗æi cao nhß║¡n v├á thß╗Ñ l├╜ c├íc ─æ╞ín ─æß╗ü nghß╗ï, kiß║┐n nghß╗ï, th├┤ng b├ío cß╗ºa c├┤ng d├ón, tß╗ò chß╗⌐c gß╗¡i T├▓a ├ín nh├ón d├ón tß╗æi cao ─æß╗â ─æß╗ü nghß╗ï xem x├⌐t lß║íi quyß║┐t ─æß╗ïnh, bß║ún ├ín ─æ├ú c├│ hiß╗çu lß╗▒c ph├íp luß║¡t theo tr├¼nh tß╗▒ gi├ím ─æß╗æc thß║⌐m v├á dß╗▒ kiß║┐n ph├ón c├┤ng c├íc Thß║⌐m ph├ín T├▓a ├ín nh├ón d├ón giß║úi quyß║┐t ─æ╞ín
                  </p>
                  <p>
                    Sau khi xem x├⌐t c├íc ─æ╞ín ─æß╗ü nghß╗ï, kiß║┐n nghß╗ï theo thß╗º tß╗Ñc gi├ím ─æß╗æc thß║⌐m, V─ân ph├▓ng nhß║¡n thß║Ñy c├íc ─æ╞ín ─æß╗ü nghß╗ï, kiß║┐n nghß╗ï n├¬u tr├¬n ─æ├ú ─æß╗º ─æiß╗üu kiß╗çn thß╗Ñ l├╜ theo quy ─æß╗ïnh. C─ân cß╗⌐ v├áo kß║┐t quß║ú ph├ón c├┤ng kh├ích quan theo tß╗ò Thß║⌐m ph├ín chuy├¬n s├óu; sß╗æ l╞░ß╗úng vß╗Ñ ├ín m├á c├íc Thß║⌐m ph├ín ─æang xem x├⌐t giß║úi quyß║┐t; c├íc vß╗Ñ ├ín c├│ c├╣ng nguy├¬n ─æ╞ín, bß╗ï ─æ╞ín; c├│ c├╣ng ng╞░ß╗¥i khß╗ƒi kiß╗çn, ng╞░ß╗¥i bß╗ï kiß╗çn.
                  </p>
                  <p>
                    V─ân ph├▓ng T├▓a ├ín nh├ón d├ón tß╗æi cao b├ío c├ío v├á k├¡nh ─æß╗ü nghß╗ï ─æß╗ông ch├¡ Ch├ính ├ín T├▓a ├ín nh├ón d├ón tß╗æi cao giß║úi quyß║┐t (c├│ danh s├ích k├¿m theo).
                  </p>
                  <p className="italic">K├¡nh tr├¼nh ─Éß╗ông ch├¡./.</p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-start mt-10 pt-4 border-t border-dashed border-[#eee]">
                  <div className="text-[9px] leading-relaxed">
                    <span className="font-bold block">N╞íi nhß║¡n:</span>
                    - Nh╞░ k├¡nh tr├¼nh;<br />
                    - L╞░u: HCTP.
                  </div>
                  <div className="text-center w-[200px] text-[9.5px]">
                    <div className="font-bold">KT. CH├üNH V─éN PH├ÆNG</div>
                    <div className="font-bold uppercase">PH├ô CH├üNH V─éN PH├ÆNG</div>
                    <div className="h-[45px]"></div>
                    <div className="font-bold text-[#1d2e4f] text-[11px] underline">Phß║ím V─ân Nha</div>
                  </div>
                </div>
              </div>
            ) : selectedNodeId.startsWith("danh-sach-") ? (
              /* Mß║¬U DANH S├üCH */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-5 relative min-h-[580px] font-sans text-[10px] text-[#000]">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-center">
                    <div className="text-[8px] uppercase">T├ÆA ├üN NH├éN D├éN Tß╗ÉI CAO</div>
                    <div className="text-[8.5px] font-bold uppercase underline underline-offset-2">V─éN PH├ÆNG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8.5px] font-bold uppercase">Cß╗ÿNG H├ÆA X├â Hß╗ÿI CHß╗ª NGH─¿A VIß╗åT NAM</div>
                    <div className="text-[8px] font-bold underline underline-offset-2">─Éß╗Öc lß║¡p - Tß╗▒ do - Hß║ính ph├║c</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-4 space-y-1">
                  <div className="font-bold uppercase text-[10.5px]">
                    Danh s├ích ─æ╞ín vß╗Ñ ├ín {selectedNodeId === "danh-sach-1" ? "D├ón sß╗▒" : selectedNodeId === "danh-sach-2" ? "H├¼nh sß╗▒" : "H├ánh ch├¡nh"} thß╗Ñ l├╜
                  </div>
                  <div className="font-bold text-[9.5px]">
                    v├á ph├ón c├┤ng Thß║⌐m ph├ín {selectedNodeId === "danh-sach-3" ? "Nguyß╗àn V─ân C" : "B├╣i Ngß╗ìc L├óm"} theo d├╡i, giß║úi quyß║┐t
                  </div>
                  <div className="text-[8.5px] italic text-[#444]">
                    (K├¿m theo tß╗¥ tr├¼nh sß╗æ 112/TTr-TANDTC-VP ng├áy 27/01/2026 cß╗ºa V─ân ph├▓ng T├▓a ├ín nh├ón d├ón tß╗æi cao)
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto my-3">
                  <table className="w-full border-collapse border border-black text-[8px] leading-tight">
                    <thead>
                      <tr className="bg-[#f2f2f2]">
                        <th className="border border-black p-1 text-center w-[20px]" rowSpan={2}>STT</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Sß╗æ thß╗Ñ l├╜</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Ng├áy thß╗Ñ l├╜</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Ng╞░ß╗¥i ─æß╗ü nghß╗ï, kiß║┐n nghß╗ï, th├┤ng b├ío</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>─Éß╗ïa chß╗ë</th>
                        <th className="border border-black p-1 text-center" colSpan={3}>Q─É/BA ─æß╗ü nghß╗ï xem x├⌐t theo thß╗º tß╗Ñc G─ÉT/TT</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Sß╗æ ─æ╞ín</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Thß║⌐m ph├ín giß║úi quyß║┐t</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Ghi ch├║</th>
                      </tr>
                      <tr className="bg-[#f2f2f2]">
                        <th className="border border-black p-1 text-center">Sß╗æ BA/Q─É</th>
                        <th className="border border-black p-1 text-center">Ng├áy BA/Q─É</th>
                        <th className="border border-black p-1 text-center">T├▓a ├ín X├⌐t xß╗¡</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedNodeId === "danh-sach-1" ? (
                        <>
                          <tr>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 text-center">07</td>
                            <td className="border border-black p-1 text-center">27/01/2026</td>
                            <td className="border border-black p-1">
                              B├╣i Ph╞░╞íng Thß║úo (Do TAND tß╗ënh Bß║»c Ninh chuyß╗ân ─æß║┐n theo C├┤ng v─ân sß╗æ 11111 ng├áy 26/01/2026)
                            </td>
                            <td className="border border-black p-1">Chi tiß║┐t Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín CTH0123, TP. Bß║»c Ninh, tß╗ënh Bß║»c Ninh</td>
                            <td className="border border-black p-1 text-center">27012026_01_DS</td>
                            <td className="border border-black p-1 text-center">27/01/2026</td>
                            <td className="border border-black p-1">T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh</td>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 font-medium">B├╣i Ngß╗ìc L├óm</td>
                            <td className="border border-black p-1">L╞░u ├╜ kiß╗âm tra kß╗╣ t├ái liß╗çu ─æ├¡nh k├¿m</td>
                          </tr>
                          <tr>
                            <td className="border border-black p-1 text-center">2</td>
                            <td className="border border-black p-1 text-center">08</td>
                            <td className="border border-black p-1 text-center">28/01/2026</td>
                            <td className="border border-black p-1">
                              L├¬ V─ân D (Tß╗▒ nß╗Öp trß╗▒c tiß║┐p tß║íi Ban tiß║┐p c├┤ng d├ón)
                            </td>
                            <td className="border border-black p-1">Sß╗æ 45, ─É╞░ß╗¥ng L├╜ Th├íi Tß╗ò, TP. Bß║»c Ninh</td>
                            <td className="border border-black p-1 text-center">28012026_02_DS</td>
                            <td className="border border-black p-1 text-center">20/01/2026</td>
                            <td className="border border-black p-1">T├▓a ├ín nh├ón d├ón TP. Bß║»c Ninh</td>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 font-medium">B├╣i Ngß╗ìc L├óm</td>
                            <td className="border border-black p-1">T├ái liß╗çu bß╗ò sung ─æß║ºy ─æß╗º</td>
                          </tr>
                        </>
                      ) : selectedNodeId === "danh-sach-2" ? (
                        <tr>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 text-center">09</td>
                          <td className="border border-black p-1 text-center">29/01/2026</td>
                          <td className="border border-black p-1">
                            Trß║ºn Thß╗ï B (Chuyß╗ân ─æ╞ín tß╗½ Viß╗çn kiß╗âm s├ít nh├ón d├ón tß╗æi cao theo C├┤ng v─ân 2222)
                          </td>
                          <td className="border border-black p-1">ß║ñp Lß╗Öc B├¼nh, huyß╗çn Lß╗Öc B├¼nh, tß╗ënh Lß║íng S╞ín</td>
                          <td className="border border-black p-1 text-center">29012026_03_HS</td>
                          <td className="border border-black p-1 text-center">15/01/2026</td>
                          <td className="border border-black p-1">T├▓a ├ín nh├ón d├ón huyß╗çn Lß╗Öc B├¼nh</td>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 font-medium">B├╣i Ngß╗ìc L├óm</td>
                          <td className="border border-black p-1">─É╞ín k├¿m chß╗⌐ng cß╗⌐ ngoß║íi phß║ím mß╗¢i</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 text-center">10</td>
                          <td className="border border-black p-1 text-center">30/01/2026</td>
                          <td className="border border-black p-1">
                            Nguyß╗àn V─ân A (Do TAND tß╗ënh Bß║»c Giang chuyß╗ân ─æß║┐n theo C├┤ng v─ân sß╗æ 33333 ng├áy 29/01/2026)
                          </td>
                          <td className="border border-black p-1">X├ú D─⌐nh Kß║┐, th├ánh phß╗æ Bß║»c Giang, tß╗ënh Bß║»c Giang</td>
                          <td className="border border-black p-1 text-center">30012026_04_HC</td>
                          <td className="border border-black p-1 text-center">25/01/2026</td>
                          <td className="border border-black p-1">T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Giang</td>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 font-medium">Nguyß╗àn V─ân C</td>
                          <td className="border border-black p-1">Khiß║┐u nß║íi Q─ÉHC cß╗ºa UBND tß╗ënh</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-8">
                  <div className="text-center w-[180px] text-[8.5px]">
                    <div className="font-bold uppercase">CH├üNH V─éN PH├ÆNG</div>
                    <div className="h-[40px]"></div>
                    <div className="font-bold underline">Nguyß╗àn T╞░ß╗¥ng Linh</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mß║¬U ─É╞áN */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-8 relative min-h-[580px] font-serif text-[11px] leading-relaxed text-[#000]">
                {/* Top note */}
                <div className="absolute right-6 top-4 text-[9px] font-mono text-gray-500 italic">YLBS. ─æ╞ín</div>

                {/* Header */}
                <div className="flex flex-col items-end mb-6">
                  <div className="text-center w-[260px] leading-tight">
                    <div className="font-bold uppercase text-[9.5px]">Cß╗ÿNG H├ÆA X├â Hß╗ÿI CHß╗ª NGH─¿A VIß╗åT NAM</div>
                    <div className="font-bold text-[9.5px] underline decoration-solid underline-offset-4">─Éß╗Öc lß║¡p - Tß╗▒ do - Hß║ính ph├║c</div>
                    <div className="italic text-[9px] mt-2">D╞░╞íng Minh Ch├óu, ng├áy 25 th├íng 02 n─âm 2026</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6 space-y-1">
                  <div className="text-[12px] font-bold uppercase tracking-wide">─É╞áN ─Éß╗Ç NGHß╗è</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider">THEO THß╗ª Tß╗ñC GI├üM ─Éß╗ÉC THß║¿M</div>
                  <div className="text-[10px] italic">
                    ─Éß╗æi vß╗¢i Bß║ún ├ín sß╗æ: {
                      selectedNodeId === "don-7031" ? "120/2026/DS-PT ng├áy 26-01-2026 cß╗ºa T├▓a ├ín nh├ón d├ón tß╗ënh T├óy Ninh" :
                        selectedNodeId === "don-7032" ? "134/2026/HC-PT ng├áy 15-02-2026 cß╗ºa T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Giang" :
                          selectedNodeId === "don-7033" ? "88/2026/HS-PT ng├áy 10-01-2026 cß╗ºa T├▓a ├ín nh├ón d├ón tß╗ënh Lß║íng S╞ín" :
                            "412/2026/DS-PT ng├áy 18-02-2026 cß╗ºa T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh"
                    }.
                  </div>
                </div>

                {/* Recipient */}
                <div className="mb-4 pl-4 space-y-1 text-[10.5px]">
                  <div><span className="font-bold italic">K├¡nh gß╗¡i:</span> - Ch├ính ├ín T├▓a ├ín nh├ón d├ón tß╗æi cao.</div>
                  <div className="pl-13">- Viß╗çn tr╞░ß╗ƒng Viß╗çn kiß╗âm s├ít nh├ón d├ón tß╗æi cao.</div>
                </div>

                {/* Body details */}
                <div className="space-y-2.5 text-[10.5px] text-justify leading-relaxed">
                  <p>
                    T├┤i t├¬n: <span className="font-bold">{
                      selectedNodeId === "don-7031" ? "B├╣i Ph╞░╞íng Thß║úo (ß╗ºy quyß╗ün Nguyß╗àn V─ân Lß╗Ña)" :
                        selectedNodeId === "don-7032" ? "Nguyß╗àn V─ân A" :
                          selectedNodeId === "don-7033" ? "Trß║ºn Thß╗ï B" : "L├¬ V─ân D"
                    }</span>, sinh n─âm 1972; ─æß╗ïa chß╗ë: ß║ñp Ph╞░ß╗¢c T├ón 3, x├ú D╞░╞íng Minh Ch├óu, tß╗ënh T├óy Ninh.
                  </p>
                  <p>Sß╗æ ─æiß╗çn thoß║íi di ─æß╗Öng: 0786.453.749</p>
                  <p>
                    L├á ng╞░ß╗¥i khß╗ƒi kiß╗çn trong vß╗Ñ ├ín <span className="italic">ΓÇ£Y├¬u cß║ºu tuy├¬n bß╗æ hß╗úp ─æß╗ông chuyß╗ân nh╞░ß╗úng quyß╗ün sß╗¡ dß╗Ñng ─æß║Ñt v├┤ hiß╗çuΓÇ¥</span>.
                  </p>
                  <p>
                    Nay t├┤i l├ám ─æ╞ín n├áy y├¬u cß║ºu Ch├ính ├ín T├▓a ├ín nh├ón d├ón tß╗æi cao; Viß╗çn tr╞░ß╗ƒng Viß╗çn kiß╗âm s├ít nh├ón d├ón tß╗æi cao xem x├⌐t lß║íi Bß║ún ├ín s╞í thß║⌐m v├á bß║ún ├ín ph├║c thß║⌐m:
                  </p>
                  <p>
                    + Bß║ún ├ín ph├║c thß║⌐m sß╗æ: 120/2026/DS-PT ng├áy 26-01-2026 cß╗ºa T├▓a ├ín nh├ón d├ón tß╗ënh T├óy Ninh v├á bß║ún ├ín s╞í thß║⌐m sß╗æ: 122/2025/DS-ST ng├áy 22-9-2025 cß╗ºa T├▓a ├ín nh├ón d├ón khu vß╗▒c 11-T├óy Ninh vß╗¢i nhß╗»ng nß╗Öi dung v├á nhß║¡n ─æß╗ïnh nh╞░ sau:
                  </p>

                  <div className="border-t border-[#eee] pt-2 mt-4">
                    <span className="font-bold block mb-1">Vß╗ü vß║Ñn ─æß╗ü tr╞░ß╗¢c khi t├┤i khß╗ƒi kiß╗çn:</span>
                    <p className="text-[10px] text-[#444] italic">
                      Th├íng 4 n─âm 2024, t├┤i c├│ khß╗ƒi kiß╗çn ├┤ng Phß║ím V─ân Bß╗æn v├á b├á Nguyß╗àn Thß╗ï ─É├áo sß╗æ tiß╗ün 700.000.000 ─æß╗ông. ─Éß║┐n ng├áy 21-8-2024, T├▓a ├ín nh├ón d├ón huyß╗çn D╞░╞íng Minh Ch├óu x├⌐t xß╗¡ vß╗Ñ ├ín bß║▒ng bß║ún ├ín d├ón sß╗▒ s╞í thß║⌐m sß╗æ: 118/2024/DS-ST buß╗Öc c├íc b├¬n thß╗▒c thi tr├ích nhiß╗çm...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {showLichSuYKien && (
      <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
        <div className="bg-white rounded-[8px] shadow-2xl border border-[#d0d0d0] w-[560px] max-w-[95vw] max-h-[85vh] flex flex-col overflow-hidden">
          <div className="flex items-start justify-between px-5 py-4 border-b border-[#eee] flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#222]">Lß╗ïch sß╗¡ cho ├╜ kiß║┐n</span>
              <span className="text-[11px] text-[#888] mt-0.5">─É╞ín: TLMT-10 | Ng╞░ß╗¥i gß╗¡i: Trß║ºn V─ân H├╣ng | Ng├áy nhß║¡n: 22/05/2026</span>
            </div>
            <button onClick={() => setShowLichSuYKien(false)} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                    <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px] border-r border-[#e0e0e0]">Ng├áy</th>
                    <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px] border-r border-[#e0e0e0]">Ng╞░ß╗¥i cho ├╜ kiß║┐n</th>
                    <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px]">Nß╗Öi dung ├╜ kiß║┐n</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ngay: "15/05/2026", nguoi: "Nguyß╗àn V─ân B", chucVu: "Vß╗Ñ tr╞░ß╗ƒng", noiDung: "Trß║ú lß╗¥i ─æ╞ín" },
                    { ngay: "10/05/2026", nguoi: "Trß║ºn V─ân C", chucVu: "Thß║⌐m tra vi├¬n", noiDung: "Trß║ú lß╗¥i ─æ╞ín" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-[#eee] last:border-b-0">
                      <td className="px-3 py-2.5 text-[#888] align-top whitespace-nowrap border-r border-[#eee]">{r.ngay}</td>
                      <td className="px-3 py-2.5 align-top border-r border-[#eee]">
                        <span className="font-bold text-[#222]">{r.nguoi} ({r.chucVu})</span>
                      </td>
                      <td className="px-3 py-2.5 text-[#555] align-top">{r.noiDung}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end px-5 py-3 border-t border-[#eee] bg-[#fafafa] flex-shrink-0">
            <button onClick={() => setShowLichSuYKien(false)} className="h-[32px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">─É├│ng</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

// ΓöÇΓöÇΓöÇ Main App ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export default function App() {
  // Nß║┐u URL c├│ #don=... th├¼ tab n├áy mß╗ƒ thß║│ng m├án ─æ╞ín (giß╗æng Th├¬m mß╗¢i) vß╗¢i dß╗»
  // liß╗çu cß╗ºa ─æ╞ín ─æ├│ ─æ├ú ─æ╞░ß╗úc ─æiß╗ün sß║╡n.
  const [isLienThongMode, setIsLienThongMode] = useState(false);
  const [activeDonLienThong, setActiveDonLienThong] = useState<DonTiepNhan | null>(null);
  const [donChiTietTabMoi] = useState<DonLienQuan | null>(docDonTuHash);
  const [view, setView] = useState<"home" | "list" | "lienthong" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet">(donChiTietTabMoi ? "form" : "list");

  // ΓöÇΓöÇΓöÇ KHO V─éN Bß║óN D├ÖNG CHUNG ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  // Mß╗Öt nguß╗ôn sß╗▒ thß║¡t duy nhß║Ñt cho cß║ú ba m├án cß╗ºa module Quß║ún l├╜ v─ân bß║ún:
  //   ┬╖ Danh s├ích v─ân bß║ún (c├ín bß╗Ö)
  //   ┬╖ Ph├¬ duyß╗çt ─æß╗ü xuß║Ñt        (l├únh ─æß║ío)
  //   ┬╖ Sß╗ò v─ân bß║ún ─æi            (v─ân th╞░)
  // Popup "Tß║ío v─ân bß║ún & tr├¼nh k├╜" ─æß║⌐y bß║ún ghi mß╗¢i v├áo ─æ├óy. Tr╞░ß╗¢c kia mß╗ùi m├án
  // c├│ kho ri├¬ng n├¬n tß║ío v─ân bß║ún xong kh├┤ng m├án n├áo thß║Ñy ΓÇö ─æ├│ l├á l├╜ do gß╗Öp.
  const [vanBanList, setVanBanList] = useState<VanBanTrinh[]>(DU_LIEU_MAU);
  // D├▓ng vß╗½a tß║ío, ─æß╗â highlight khi nhß║úy sang m├án Danh s├ích v─ân bß║ún.
  const [vbVuaTao, setVbVuaTao] = useState<string | null>(null);

  /** ─É├│ng v├▓ng phß║ún hß╗ôi: popup "Tß║ío v─ân bß║ún & tr├¼nh k├╜" ΓåÆ kho chung ΓåÆ m├án c├ín bß╗Ö.
   *  Dropdown ng╞░ß╗¥i duyß╗çt/k├╜ trß║ú vß╗ü chuß╗ùi "T├¬n - Chß╗⌐c vß╗Ñ - Ng├áy sinh". */
  const tachNguoi = (s: string) => {
    const [nguoi, chucVu] = s.split(" - ");
    return { nguoi: (nguoi ?? s).trim(), chucVu: (chucVu ?? "L├únh ─æß║ío").trim() };
  };
  const taoVanBanTuModal = (kq: KetQuaTrinhDuyet) => {
    const luongKy: BuocKy[] = [];
    if (kq.nguoiDuyet) {
      const n = tachNguoi(kq.nguoiDuyet);
      luongKy.push({ thuTu: 1, nguoi: n.nguoi, chucVu: n.chucVu, vaiTro: "duyet" });
    }
    if (kq.nguoiKy) {
      const n = tachNguoi(kq.nguoiKy);
      luongKy.push({ thuTu: luongKy.length + 1, nguoi: n.nguoi, chucVu: n.chucVu, vaiTro: "ky" });
    }
    // Tß╗¥ tr├¼nh ph├ón c├┤ng c├▓n mß╗Öt b╞░ß╗¢c nß╗»a sau k├╜ sß╗æ: Ch├ính ├ín/Ph├│ Ch├ính ├ín b├║t ph├¬
    if (laToTrinhPhanCong(kq.loaiVanBan)) {
      const b = luongToTrinhPhanCong().find(x => x.vaiTro === "but_phe")!;
      luongKy.push({ ...b, thuTu: luongKy.length + 1 });
    }
    const nguoiTao = kq.nguoiTao || nguoiTheoVaiTro(currentRole).nguoi;
    const vb = taoTuModal({ ...kq, nguoiTao, luongKy });
    // Bß║Ñm "Tr├¼nh duyß╗çt" ngh─⌐a l├á tß║ío XONG v├á tr├¼nh lu├┤n ΓÇö kh├┤ng dß╗½ng ß╗ƒ Nh├íp.
    const daTrinh = luongKy.length ? apTrinhDuyet(vb, nguoiTao, "C├ín bß╗Ö", kq.yKienTrinh) : vb;
    setVanBanList(ds => [daTrinh, ...ds]);
    setVbVuaTao(daTrinh.id);
    addNotification(`─É├ú tr├¼nh ${daTrinh.soVanBan ?? "v─ân bß║ún"} ΓÇö ─æang chß╗¥ ${luongKy[0]?.nguoi ?? "duyß╗çt"}`);
  };
  /** Tß╗½ Danh s├ích ─æ╞ín bß║Ñm chip "─É├ú c├│ trong 545/ΓÇª" ΓåÆ mß╗ƒ thß║│ng panel v─ân bß║ún ─æ├│. */
  const [moVanBanId, setMoVanBanId] = useState<string | null>(null);
  const moVanBan = (id: string) => { setMoVanBanId(id); setView("van_ban_trinh_ky"); };

  /** Bß║Ñm "Xem v─ân bß║ún ─æ├ú tr├¼nh" ß╗ƒ popup Tr├¼nh duyß╗çt th├ánh c├┤ng ΓÇö n├║t "─É├│ng" cß╗ºa
   *  popup kh├┤ng ─æiß╗üu h╞░ß╗¢ng, c├ín bß╗Ö ß╗ƒ lß║íi Danh s├ích ─æ╞ín. */
  const [locMaDonVanBan, setLocMaDonVanBan] = useState<string | null>(null);
  const xemVanBanDaTrinh = (maDon: string) => {
    setLocMaDonVanBan(maDon || null);
    setView("van_ban_trinh_ky");
  };

  const [currentRole, setCurrentRole] = useState<"can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an">("can-bo");
  const [notifications, setNotifications] = useState<{ id: number, text: string, time: string, read: boolean }[]>([
    { id: 1, text: "─É╞ín 7031 ─æ├ú ─æ╞░ß╗úc ph├ón c├┤ng cho c├ín bß╗Ö Nguyß╗àn V─ân An", time: "08:30", read: false }
  ]);
  const [showNoti, setShowNoti] = useState(false);
  const addNotification = (text: string) => {
    setNotifications(prev => [{
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev]);
  };

  useEffect(() => {
    const handler = (e: any) => addNotification(e.detail);
    notiEmitter.addEventListener('notify', handler);
    return () => notiEmitter.removeEventListener('notify', handler);
  }, []);

  const [bieuMauRow, setBieuMauRow] = useState<typeof SAMPLE_ROWS[0] | null>(null);
  // D├▓ng "V─ân bß║ún tr├¼nh k├╜" cß╗Ñ thß╗â m├á c├ín bß╗Ö bß║Ñm v├áo ß╗ƒ m├án Danh s├ích ─æ╞ín ΓÇö
  // m├án Danh s├ích biß╗âu mß║½u chß╗ë hiß╗çn ─æ├║ng d├▓ng n├áy, kh├┤ng hiß╗çn cß║ú kho v─ân bß║ún
  // cß╗ºa ─æ╞ín.
  const [bieuMauVbId, setBieuMauVbId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [phanCongTab, setPhanCongTab] = useState<0 | 1 | 2>(0);
  // Tab mß╗ƒ sß║╡n ß╗ƒ Danh s├ích ─æ╞ín khi nhß║Ñn ─æ├║p 1 trß║íng th├íi trong panel "Ph├ón loß║íi
  // ─æ╞ín nhß║¡n" tr├¬n Trang chß╗º.
  const [danhSachDonTab, setDanhSachDonTab] = useState(0);
  // Bß║¡t sß║╡n bß╗Ö lß╗ìc "Qu├í hß║ín giß║úi quyß║┐t" khi bß║Ñm v├áo card cß║únh b├ío c├╣ng t├¬n
  // tr├¬n Trang chß╗º ΓÇö lu├┤n ─æi k├¿m danhSachDonTab = 0 (Tß╗òng sß╗æ).
  const [danhSachDonQuaHanOnly, setDanhSachDonQuaHanOnly] = useState(false);
  // Tab mß╗ƒ sß║╡n ß╗ƒ Danh s├ích v─ân bß║ún khi bß║Ñm "Xem chi tiß║┐t" ß╗ƒ card "─É╞ín cß╗ºa t├┤i"
  // tr├¬n Trang chß╗º.
  const [vanBanTrinhKyTab, setVanBanTrinhKyTab] = useState<TabDS>("all");
  // Tab mß╗ƒ sß║╡n ß╗ƒ m├án Ph├¬ duyß╗çt v├á ─æß╗ü xuß║Ñt khi bß║Ñm "Xem chi tiß║┐t" ß╗ƒ card
  // "T├ái liß╗çu cß║ºn duyß╗çt" / "T├ái liß╗çu ─æ├ú duyß╗çt" tr├¬n Trang chß╗º.
  const [pheDuyetTab, setPheDuyetTab] = useState<TabPD>("cho_duyet");
  const [showPopup, setShowPopup] = useState(false);
  const [showBiCaoPopup, setShowBiCaoPopup] = useState(false);
  // Danh s├ích bß╗ï c├ío (├ín h├¼nh sß╗▒) ΓÇö ─æiß╗ün tß╗▒ ─æß╗Öng sau khi tra cß╗⌐u bß║ún ├ín
  const [biCao, setBiCao] = useState<(NguoiTuBanAn & { id: number })[]>([]);
  const [quanHePhapLuat, setQuanHePhapLuat] = useState("");
  // ─É├ính dß║Ñu c├íc d├▓ng do hß╗ç thß╗æng ─æiß╗ün, ─æß╗â c├ín bß╗Ö biß║┐t cß║ºn r├á lß║íi
  const [nguoiTuDong, setNguoiTuDong] = useState(false);
  const [showThamPhanPopup, setShowThamPhanPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  // ΓöÇΓöÇ Luß╗ông OCR ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  const [ocrFile, setOcrFile] = useState<OcrFile | null>(null);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("chua");
  const [showOcrConfirm, setShowOcrConfirm] = useState(false);
  const [showOcrProgress, setShowOcrProgress] = useState(false);
  const [showOcrCancel, setShowOcrCancel] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);
  // runId t─âng mß╗ùi lß║ºn chß║íy ΓÇö timer cß╗ºa job c┼⌐ tß╗▒ bß╗Å qua kß║┐t quß║ú sau khi hß╗ºy
  const ocrRunId = useRef(0);
  const ocrTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [showTraLaiForm, setShowTraLaiForm] = useState(false);
  const [traLaiReason, setTraLaiReason] = useState("");
  const [congVans, setCongVans] = useState<CongVan[]>([]);
  const [hinhThuc, setHinhThuc] = useState(
    donChiTietTabMoi
      ? (/kiß║┐n nghß╗ï/i.test(donChiTietTabMoi.hinhThuc) ? "CV kiß║┐n nghß╗ï G─ÉT-TT" : "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT")
      : "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT");
  const [loaiDonChuyenDon, setLoaiDonChuyenDon] = useState("─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT");
  const isDon = LOAI_DON.has(hinhThuc);
  const isKhangNghi = hinhThuc === LOAI_KHANG_NGHI;
  const isDonKhieuNaiTuPhap = hinhThuc === "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng" || (hinhThuc === "CV chuyß╗ân ─æ╞ín" && loaiDonChuyenDon === "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng");
  const isDonKhac = hinhThuc === "─É╞ín kh├íc";
  const isCVKemDon = hinhThuc === "CV chuyß╗ân ─æ╞ín";
  // CV kiß║┐n nghß╗ï: bß║ún th├ón ─æ╞ín l├á c├┤ng v─ân ΓçÆ chß╗ë c├│ ─æ├║ng Mß╗ÿT c├┤ng v─ân, nhß║¡p
  // thß║│ng tr├¬n form thay v├¼ bß║úng danh s├ích + popup th├¬m.
  const isCVKienNghi = hinhThuc === "CV kiß║┐n nghß╗ï G─ÉT-TT";
  const secOffset = isCVKemDon ? 1 : 0;
  const [loaiDonKhieuNai, setLoaiDonKhieuNai] = useState("");
  const [yKienChiDaoCV, setYKienChiDaoCV] = useState("Kh├┤ng");
  const [loaiAnForm, setLoaiAnForm] = useState("");
  const [anTuHinh, setAnTuHinh] = useState(false);
  const [showPDF, setShowPDF] = useState(true);
  const [xinGiamAnTuHinh, setXinGiamAnTuHinh] = useState(false);
  const [keuOanAnTuHinh, setKeuOanAnTuHinh] = useState(false);
  const [xinThiHanhAnSom, setXinThiHanhAnSom] = useState(false);
  const [khongCoGDT, setKhongCoGDT] = useState(false);
  const [coNoiDungToCao, setCoNoiDungToCao] = useState(false);
  const [xinHoanThiHanhAn, setXinHoanThiHanhAn] = useState(false);
  // Sß╗æ hiß╗çu v├á hai mß╗æc ng├áy cß╗ºa ch├¡nh l├í ─æ╞ín. "Ng├áy t├▓a nhß║¡n" v├á "Ng├áy ghi tr├¬n
  // ─æ╞ín" l├á hai mß╗æc kh├íc nhau ΓÇö mß╗Öt l├á l├║c ─æ╞ín tß╗¢i t├▓a, mß╗Öt l├á ng├áy ng╞░ß╗¥i gß╗¡i
  // ─æß╗ü tr├¬n ─æ╞ín ΓÇö v├á cß╗Öt Th├┤ng tin ng╞░ß╗¥i gß╗¡i ß╗ƒ Danh s├ích ─æ╞ín in cß║ú hai, n├¬n
  // phß║úi nhß║¡p cß║ú hai chß╗⌐ kh├┤ng suy ─æ╞░ß╗úc c├íi n├áy tß╗½ c├íi kia.
  const [soHieuDon, setSoHieuDon] = useState("");
  const [ngayToaNhan, setNgayToaNhan] = useState("");
  const [ngayGhiTrenDon, setNgayGhiTrenDon] = useState("");
  // H├¼nh thß╗⌐c nhß║¡n + th├┤ng tin b├¼ th╞░ (chß╗ë d├╣ng cho Trß╗▒c tiß║┐p / B╞░u ─æiß╗çn)
  const [hinhThucNhan, setHinhThucNhan] = useState("");
  const [biThu, setBiThu] = useState({ ma: "", ngayDau: "", nguoiGui: "", sdt: "", diaChi: "" });
  const canBiThu = hinhThucNhan === "Trß╗▒c tiß║┐p" || hinhThucNhan === "B╞░u ─æiß╗çn";
  // Tra m├ú b├¼ th╞░ trong kho dß╗» liß╗çu b╞░u ch├¡nh, khß╗¢p th├¼ tß╗▒ ─æiß╗ün c├íc tr╞░ß╗¥ng c├▓n lß║íi
  const traBiThu = (ma: string) => {
    const kq = KHO_BI_THU[ma.trim().toUpperCase()];
    setBiThu(p => kq ? { ...p, ma, ...kq } : { ...p, ma });
  };
  const [xulychuynhuong, setXulychuynhuong] = useState(false);
  const [trangThaiDon, setTrangThaiDon] = useState("");
  const [thuLyDon, setThuLyDon] = useState("");
  const [vuTruong, setVuTruong] = useState("");
  const [lyDoKhongDu, setLyDoKhongDu] = useState("");
  const [noiChuyenDen, setNoiChuyenDen] = useState("");
  const [donViChuyenDen, setDonViChuyenDen] = useState("");
  const [showDonViChuyenDenDD, setShowDonViChuyenDenDD] = useState(false);
  const [caNhanChuyenDen, setCaNhanChuyenDen] = useState("");
  const [lyDoLuuTheoDoi, setLyDoLuuTheoDoi] = useState("");
  const [lyDoTraLai, setLyDoTraLai] = useState("");
  const [yeuCauTraLai, setYeuCauTraLai] = useState("");
  // Popup sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín (mß╗Ñc 5)
  const [showSuaKetQuaXuLy, setShowSuaKetQuaXuLy] = useState(false);
  const [xemChiTietHistory, setXemChiTietHistory] = useState<any>(null);

  // ─É╞ín chuyß╗ân sang T├▓a kh├íc / Ngo├ái t├▓a ├ín th├¼ TAND tß╗æi cao kh├┤ng thß║⌐m ─æß╗ïnh
  // nß╗Öi dung ΓÇö c╞í quan nhß║¡n mß╗¢i l├á n╞íi cß║ºn th├┤ng tin bß║ún ├ín. Bß║»t c├ín bß╗Ö nhß║¡p ─æß╗º
  // ß╗ƒ ─æ├óy chß╗ë tß║ío dß╗» liß╗çu ch├⌐p tay kh├┤ng ai d├╣ng, n├¬n bß╗Å dß║Ñu bß║»t buß╗Öc.
  // ├ö vß║½n hiß╗çn v├á vß║½n nhß║¡p ─æ╞░ß╗úc nß║┐u c├ín bß╗Ö c├│ sß║╡n th├┤ng tin.
  const chuyenDiNoiKhac = noiChuyenDen === "T├▓a kh├íc" || noiChuyenDen === "Ngo├ái t├▓a ├ín";
  const [chanhAnHoacToaAn, setChanhAnHoacToaAn] = useState("T├▓a ├ín");
  const [coBanAnLienQuan, setCoBanAnLienQuan] = useState(false);
  const [coCongVanPhucDap, setCoCongVanPhucDap] = useState(false);
  const [baSearched, setBaSearched] = useState(!!donChiTietTabMoi);
  const [selectedVuAnGoc, setSelectedVuAnGoc] = useState<number | null>(null);
  // ─Éß╗ü nghß╗ï xem x├⌐t: mß║╖c ─æß╗ïnh chß╗ìn bß║ún ├ín ─æang tra cß╗⌐u (id=0)
  const [deNghiBanAn, setDeNghiBanAn] = useState<number | null>(0);
  const [deNghiKetQua, setDeNghiKetQua] = useState<number | null>(null);
  // Kß║┐t quß║ú giß║úi quyß║┐t li├¬n quan ΓÇö th├¬m qua popup
  const [thongBaoTraLoi, setThongBaoTraLoi] = useState<{ id: number; loaiKQ: string; soTB: string; ngayTB: string; toaAn: string }[]>([
    { id: 9001, loaiKQ: "Th├┤ng b├ío trß║ú lß╗¥i ─æ╞ín", soTB: "142/TB-TANDTC", ngayTB: "15/09/2024", toaAn: "T├▓a ├ín nh├ón d├ón cß║Ñp cao tß║íi H├á Nß╗Öi" },
    { id: 9002, loaiKQ: "Th├┤ng b├ío VKS ─æang giß║úi quyß║┐t", soTB: "87/TB-VKSTC", ngayTB: "03/12/2024", toaAn: "Viß╗çn kiß╗âm s├ít nh├ón d├ón tß╗æi cao" },
  ]);
  const [showThemTB, setShowThemTB] = useState(false);
  // ─É╞ín li├¬n quan th├¬m tay ΓÇö gß╗Öp chung vß╗¢i kß║┐t quß║ú tra cß╗⌐u ─æß╗â hiß╗çn ra bß║úng ngo├ái
  const [donLienQuanThem, setDonLienQuanThem] = useState<DonLienQuan[]>([]);
  const [showThemDonLQ, setShowThemDonLQ] = useState(false);
  const [suaDonLQ, setSuaDonLQ] = useState<DonLienQuan | null>(null);
  // ─É╞ín thß╗Ñ l├╜ k├¿m ΓÇö th├¬m qua popup, hiß╗çn lu├┤n ra bß║úng ngo├ái
  const [donThuLyKem, setDonThuLyKem] = useState<DonThuLyKem[]>([]);
  const [showThemDonKem, setShowThemDonKem] = useState(false);
  // Bß║ún ├ín/quyß║┐t ─æß╗ïnh li├¬n quan th├¬m tay
  const [banAnThem, setBanAnThem] = useState<BanAnLienQuan[]>([]);
  const [showThemBanAn, setShowThemBanAn] = useState(false);
  // Id d├▓ng ─æang sß╗¡a cß╗ºa tß╗½ng bß║úng ß╗ƒ m├án Th├¬m mß╗¢i (null = ─æang th├¬m mß╗¢i)
  const [suaCongVanId, setSuaCongVanId] = useState<number | null>(null);
  const [suaBanAnId, setSuaBanAnId] = useState<number | null>(null);
  const [suaDonKemId, setSuaDonKemId] = useState<number | null>(null);
  const [suaKetQuaId, setSuaKetQuaId] = useState<number | null>(null);
  // Nguy├¬n ─æ╞ín / ng╞░ß╗¥i khß╗ƒi kiß╗çn
  const [nguyenDon, setNguyenDon] = useState<NguoiDungDon[]>([]);
  const [showThemNguyenDon, setShowThemNguyenDon] = useState(false);
  // Bß╗ï ─æ╞ín / ng╞░ß╗¥i bß╗ï kiß╗çn
  const [biDon, setBiDon] = useState<NguoiDungDon[]>([]);
  const [showThemBiDon, setShowThemBiDon] = useState(false);
  // Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan
  const [nguoiLienQuan, setNguoiLienQuan] = useState<NguoiDungDon[]>([]);
  const [showThemNguoiLQ, setShowThemNguoiLQ] = useState(false);
  // Id ng╞░ß╗¥i ─æang sß╗¡a cß╗ºa 3 danh s├ích ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng
  const [suaNguyenDonId, setSuaNguyenDonId] = useState<number | null>(null);
  const [suaBiDonId, setSuaBiDonId] = useState<number | null>(null);
  const [suaNguoiLQId, setSuaNguoiLQId] = useState<number | null>(null);
  const [loaiQDBa, setLoaiQDBa] = useState("Bß║ún ├ín");
  const [thuTucGQ, setThuTucGQ] = useState(donChiTietTabMoi?.thuTuc ?? "");   // Thß╗º tß╗Ñc giß║úi quyß║┐t ΓÇö bß║»t buß╗Öc
  const [hanhViBiKhieuNai, setHanhViBiKhieuNai] = useState("");
  const [khieuNaiToCaoHanhVi, setKhieuNaiToCaoHanhVi] = useState(false);
  const NHAN_SO_NGAY_BA: Record<string, [string, string]> = {
    "Bß║ún ├ín": ["Sß╗æ bß║ún ├ín", "Ng├áy bß║ún ├ín"],
    "Quyß║┐t ─æß╗ïnh": ["Sß╗æ quyß║┐t ─æß╗ïnh", "Ng├áy quyß║┐t ─æß╗ïnh"],
    "C├┤ng v─ân": ["Sß╗æ c├┤ng v─ân", "Ng├áy c├┤ng v─ân"],
    "Th├┤ng b├ío": ["Sß╗æ th├┤ng b├ío", "Ng├áy th├┤ng b├ío"],
    "H├ánh vi": ["Sß╗æ v─ân bß║ún", "Ng├áy v─ân bß║ún"],
  };
  const [selectedYcbsKey, setSelectedYcbsKey] = useState<string | null>(null);
  // ─É╞ín gß╗æc ─æ╞░ß╗úc chß╗ìn l├ám ─æ╞ín bß╗ò sung ΓÇö nguß╗ôn ─æß╗â ─æiß╗ün ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín xuß╗æng mß╗Ñc Th├┤ng tin ─æ╞ín
  const [donGocBoSung, setDonGocBoSung] = useState<DonLienQuan | null>(null);
  const chonLamDonBoSung = (r: DonLienQuan, khoa: string) => {
    setSelectedYcbsKey(khoa);
    setDonGocBoSung(r);
    addNotification(`─É├ú li├¬n kß║┐t ─æ╞ín bß╗ò sung vß╗¢i ${r.maDon} v├á ─æiß╗ün ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín: ${r.nguoiGui}.`);
  };
  const [donTrungKey, setDonTrungKey] = useState<string | null>(null);
  const [donTrungGoc, setDonTrungGoc] = useState<DonLienQuan | null>(null);
  const chonLamDonTrung = (r: DonLienQuan, khoa: string) => {
    // Chuß║⌐n h├│a so s├ính hinhThuc: bß╗Å qua k├╜ tß╗▒ ph├ón c├ích (/ vs -), khoß║úng trß║»ng, chß╗» hoa/th╞░ß╗¥ng
    const norm = (s: string) => s.toLowerCase().replace(/[/\-\s]+/g, '');
    if (norm(r.hinhThuc) !== norm(hinhThuc)) {
      addNotification(`Kh├┤ng thß╗â li├¬n kß║┐t: H├¼nh thß╗⌐c cß╗ºa ─æ╞ín ─æ╞░ß╗úc chß╗ìn (${r.hinhThuc}) kh├┤ng khß╗¢p vß╗¢i H├¼nh thß╗⌐c ─æ╞ín hiß╗çn tß║íi (${hinhThuc}).`);
      return;
    }
    setDonTrungKey(khoa);
    setDonTrungGoc(r);
    // Clone all details from the selected record into the new ticket state fields
    if (r.soBA) setBaForm(prev => ({ ...prev, soBA: r.soBA || "" }));
    if (r.ngayBA) setBaForm(prev => ({ ...prev, ngayBA: r.ngayBA ? r.ngayBA.split("/").reverse().join("-") : "" }));
    addNotification(`─É├ú li├¬n kß║┐t ─æ╞ín tr├╣ng vß╗¢i ${r.maDon} v├á sao ch├⌐p to├án bß╗Ö th├┤ng tin.`);
  };
  const loaiQDBaOptions = ["Bß║ún ├ín", "Quyß║┐t ─æß╗ïnh"];
  const loaiQDBaEffective = loaiQDBaOptions.includes(loaiQDBa) ? loaiQDBa : loaiQDBaOptions[0];
  const laHanhVi = false;
  const [nhanSoBA, nhanNgayBA] = NHAN_SO_NGAY_BA[loaiQDBaEffective] ?? NHAN_SO_NGAY_BA["Bß║ún ├ín"];
  const [baForm, setBaForm] = useState({
    soBA: donChiTietTabMoi?.soBA ?? "",
    ngayBA: donChiTietTabMoi?.ngayBA ? donChiTietTabMoi.ngayBA.split("/").reverse().join("-") : "",
    toaBA: "",
    capXetXu: "",
    thoiHieuGiaiQuyet: "" as ThoiHieuKey | "",
  });
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set());
  const editingRow = SAMPLE_ROWS.find(r => r.id === editingRowId) ?? null;

  // Sß╗¡a ─æ╞ín: mß╗Ñc 5 lß║Ñy theo kß║┐t quß║ú xß╗¡ l├╜ cß╗ºa lß║ºn nhß║¡p/sß╗¡a gß║ºn nhß║Ñt ΓÇö cß║ú bß╗Ö
  // tr╞░ß╗¥ng (kh├┤ng chß╗ë "N╞íi chuyß╗ân ─æß║┐n") ─æß╗ìc tß╗½ rawData cß╗ºa log lß╗ïch sß╗¡ mß╗¢i
  // nhß║Ñt, ─æß╗â mß╗ƒ popup "Sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín" thß║Ñy ngay dß╗» liß╗çu ─æ├ú l╞░u thay v├¼
  // trß╗æng tr╞ín. ─É╞ín ch╞░a c├│ log (hoß║╖c log seed kh├┤ng c├│ rawData) th├¼ r╞íi vß╗ü
  // suy luß║¡n c┼⌐ tß╗½ giaiQuyet/thongTinChuyenDon.
  useEffect(() => {
    if (!editingRow) return;
    const lastRaw = editingRow.processingHistory?.length
      ? editingRow.processingHistory[editingRow.processingHistory.length - 1].rawData
      : null;
    if (lastRaw) {
      setNoiChuyenDen(lastRaw.noiChuyenDen ?? "");
      setDonViChuyenDen(lastRaw.donViChuyenDen ?? "");
      setCaNhanChuyenDen(lastRaw.caNhanChuyenDen ?? "");
      setTrangThaiDon(lastRaw.trangThaiDon ?? "");
      setThuLyDon(lastRaw.thuLyDon ?? "");
      setLyDoKhongDu(lastRaw.lyDoKhongDu ?? "");
      setLyDoTraLai(lastRaw.lyDoTraLai ?? "");
      setYeuCauTraLai(lastRaw.yeuCauTraLai ?? "");
      setLyDoLuuTheoDoi(lastRaw.lyDoLuuTheoDoi ?? "");
      setChanhAnHoacToaAn(lastRaw.chanhAnHoacToaAn ?? "T├▓a ├ín");
      setVuTruong(lastRaw.vuTruong ?? "");
      return;
    }
    const nhan = editingRow.giaiQuyet?.nhan;
    if (nhan === "Trß║ú lß║íi ─æ╞ín") setNoiChuyenDen("Trß║ú lß║íi ─æ╞ín");
    else if (nhan === "L╞░u theo d├╡i") setNoiChuyenDen("L╞░u theo d├╡i");
    else if (editingRow.thongTinChuyenDon) setNoiChuyenDen(editingRow.thongTinChuyenDon);
  }, [editingRowId]);

  // Sau khi ─æ├ú l╞░u kß║┐t quß║ú xß╗¡ l├╜ lß║ºn ─æß║ºu (─æ├║ng 1 lß║ºn log), c├íc tr╞░ß╗¥ng mß╗Ñc 5
  // hiß╗çn gi├í trß╗ï ─æ├ú l╞░u nh╞░ng kho├í lß║íi kh├┤ng cho g├╡ trß╗▒c tiß║┐p nß╗»a ΓÇö muß╗æn sß╗¡a
  // phß║úi bß║Ñm "Sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín" (mß╗ƒ popup ri├¬ng). Ch╞░a nhß║¡p lß║ºn n├áo th├¼
  // vß║½n ─æß╗â mß╗ƒ cho g├╡ tß╗▒ do nh╞░ b├¼nh th╞░ß╗¥ng.
  const chiXemKetQuaLanDau = !!editingRow?.processingHistory && editingRow.processingHistory.length === 1;

  const OCR_MOCK: Record<string, string> = {
    nguoiGui: "Nguyß╗àn V─ân An",
    ngayNhan: "2024-03-15",
    loaiQDBa: "Bß║ún ├ín",
    soBA: "15/2021/HC-ST",
    ngayBA: "2021-05-10",
    toaXetXu: "TAND tß╗ënh Bß║»c Ninh",
    capXetXu: "S╞í thß║⌐m",
    loaiAn: "H├ánh ch├¡nh",
    quanHe: "Tranh chß║Ñp h├ánh ch├¡nh vß╗ü ─æß║Ñt ─æai",
  };

  // Sß╗¡a ─æ╞ín ─æ├ú c├│: giß╗» nguy├¬n h├ánh vi c┼⌐ ΓÇö highlight sß║╡n c├íc tr╞░ß╗¥ng OCR.
  // Th├¬m mß╗¢i: chß╗ë ─æiß╗ün sau khi OCR chß║íy xong (xem startOcr b├¬n d╞░ß╗¢i).
  useEffect(() => {
    if (view === "form" && editingRowId !== null) setOcrFields(new Set(Object.keys(OCR_MOCK)));
          if (activeDonLienThong && activeDonLienThong.nguon === "VBDH") {
             setHinhThuc(activeDonLienThong.hinhThucDon);
             setLoaiAnForm(activeDonLienThong.loaiAn);
             if (activeDonLienThong.nguoiLamDon) {
               setNguyenDon([{ 
                 id: Date.now(), tuCach: "C├í nh├ón", lienHeChinh: true,
                 hoTen: activeDonLienThong.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: "" 
               }]);
             }
          }
  }, [view, editingRowId]);

  // ─Éß╗òi th├ánh true ─æß╗â demo nh├ính "OCR thß║Ñt bß║íi".
  const OCR_DEMO_FAIL = false;
  // Mß╗æc thß╗¥i gian m├┤ phß╗Ång job OCR (ms): tß║úi xong ΓåÆ OCR xong ΓåÆ tr├¡ch xuß║Ñt xong.
  const OCR_TIMINGS = [1000, 4500, 6800];

  const clearOcrTimers = () => {
    ocrTimers.current.forEach(clearTimeout);
    ocrTimers.current = [];
  };

  const startOcr = () => {
    clearOcrTimers();
    const runId = ++ocrRunId.current;
    const alive = () => ocrRunId.current === runId;

    setOcrStatus("dang");
    setOcrStep(0);
    setOcrFields(new Set());
    setShowOcrConfirm(false);
    setShowOcrProgress(true);
    setShowPDF(true);

    ocrTimers.current.push(
      setTimeout(() => { if (alive()) setOcrStep(1); }, OCR_TIMINGS[0]),
      setTimeout(() => { if (alive()) setOcrStep(2); }, OCR_TIMINGS[1]),
      setTimeout(() => {
        if (!alive()) return;
        setShowOcrProgress(false);
        if (OCR_DEMO_FAIL) {
          setOcrStatus("thatbai");
          addNotification(`OCR thß║Ñt bß║íi cho t├ái liß╗çu ${ocrFile?.name ?? ""}. Vui l├▓ng thß╗▒c hiß╗çn OCR lß║íi.`);
        } else {
          setOcrStatus("thanhcong");
          setOcrFields(new Set(Object.keys(OCR_MOCK)));
          if (activeDonLienThong && activeDonLienThong.nguon === "VBDH") {
             setHinhThuc(activeDonLienThong.hinhThucDon);
             setLoaiAnForm(activeDonLienThong.loaiAn);
             if (activeDonLienThong.nguoiLamDon) {
               setNguyenDon([{ 
                 id: Date.now(), tuCach: "C├í nh├ón", lienHeChinh: true,
                 hoTen: activeDonLienThong.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: "" 
               }]);
             }
          }
          addNotification(`OCR th├ánh c├┤ng cho t├ái liß╗çu ${ocrFile?.name ?? ""}. Dß╗» liß╗çu ─æ├ú ─æ╞░ß╗úc tr├¡ch xuß║Ñt.`);
        }
      }, OCR_TIMINGS[2]),
    );
  };

  // Dß╗½ng hß║│n job: t─âng runId n├¬n mß╗ìi timer c├▓n treo ─æß╗üu bß╗ï v├┤ hiß╗çu.
  const cancelOcr = () => {
    ocrRunId.current++;
    clearOcrTimers();
    setOcrStatus("dahuy");
    setOcrStep(0);
    setShowOcrCancel(false);
    setShowOcrProgress(false);
    addNotification("─É├ú hß╗ºy qu├í tr├¼nh OCR. Bß║ín c├│ thß╗â thß╗▒c hiß╗çn OCR lß║íi bß║Ñt cß╗⌐ l├║c n├áo.");
  };

  // Mß╗ƒ lß║íi luß╗ông OCR tß╗½ ─æß║ºu (chß╗ìn file mß╗¢i).
  const reOcr = () => {
    ocrRunId.current++;
    clearOcrTimers();
    setOcrStep(0);
    setShowUploadPopup(true);
  };

  // Dß╗ìn timer khi unmount ─æß╗â tr├ính setState tr├¬n component ─æ├ú gß╗í.
  useEffect(() => clearOcrTimers, []);

  const OcrWrap = ({ fieldKey, children }: { fieldKey: string; children: React.ReactNode }) => {
    const isOcr = ocrFields.has(fieldKey);
    return (
      <div className={`relative transition-all ${isOcr ? "rounded-[3px] bg-[#fffbeb]" : ""}`}>
        {children}
        {isOcr && (
          <span title="OCR ┬╖ Tr├¡ch xuß║Ñt tß╗▒ ─æß╗Öng, vui l├▓ng kiß╗âm tra lß║íi" className="absolute top-0 right-0 flex items-center gap-0.5 text-[#b45309] text-[9px] font-bold leading-none z-10 whitespace-nowrap cursor-default">
            <AlertCircle size={9} /> OCR
          </span>
        )}
      </div>
    );
  };

  const BA_SEARCH_RESULTS_GOC = [
    { id: 1, vuAn: "Nguyß╗àn V─ân An kiß╗çn UBND tß╗ënh Bß║»c Ninh", loai: "Bß║ún ├ín", giaiDoan: "S╞í thß║⌐m", soBA: "15/2021/HC-ST", ngayBA: "10/05/2021", toaAn: "TAND tß╗ënh Bß║»c Ninh", isDuplicate: false, nguon: "QLA" },
    { id: 2, vuAn: "Nguyß╗àn V─ân An kiß╗çn UBND tß╗ënh Bß║»c Ninh", loai: "Bß║ún ├ín", giaiDoan: "Ph├║c thß║⌐m", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tß╗ënh Bß║»c Ninh", isDuplicate: true, nguon: "Kho sß╗æ h├│a" },
    { id: 3, vuAn: "Nguyß╗àn V─ân An v├á cß╗Öng sß╗▒ ΓÇö tranh chß║Ñp ─æß║Ñt ─æai", loai: "Bß║ún ├ín", giaiDoan: "Ph├║c thß║⌐m", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tß╗ënh Bß║»c Ninh", isDuplicate: true, nguon: "Th├¬m mß╗¢i" },
    { id: 4, vuAn: "Nguyß╗àn V─ân An kiß╗çn UBND tß╗ënh Bß║»c Ninh", loai: "Quyß║┐t ─æß╗ïnh", giaiDoan: "Gi├ím ─æß╗æc thß║⌐m", soBA: "15/2024/G─ÉT-HC", ngayBA: "20/01/2024", toaAn: "TAND tß╗ënh Bß║»c Ninh", isDuplicate: true, nguon: "QLA" },
  ];

  // Bß║úng = kß║┐t quß║ú tra cß╗⌐u (sau khi bß║Ñm Tra cß╗⌐u) + c├íc bß║ún ├ín th├¬m tay.
  // Bß║ún ├ín th├¬m tay hiß╗çn ─æ╞░ß╗úc ngay cß║ú khi ch╞░a tra cß╗⌐u.
  const BA_SEARCH_RESULTS = [
    ...(baSearched ? BA_SEARCH_RESULTS_GOC : []),
    ...banAnThem,
  ];

  // ─É╞ín cß╗ºa c├╣ng vß╗Ñ ├ín ΓÇö hiß╗çn ra sau khi bß║Ñm "Tra cß╗⌐u" ─æß╗â c├ín bß╗Ö biß║┐t vß╗Ñ n├áy ─æ├ú
  // c├│ nhß╗»ng ─æ╞ín n├áo v├áo tr╞░ß╗¢c.
  const DON_LIEN_QUAN_RESULTS = [
    {
      id: 1,
      maDon: "M├ú 6512", ngayNhan: "15/06/2023",
      nguoiGui: "Nguyß╗àn V─ân An", diaChi: "Ph╞░ß╗¥ng V├╡ C╞░ß╗¥ng, Tß╗ënh Bß║»c Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT", thuTuc: "Gi├ím ─æß╗æc thß║⌐m",
      trangThai: "─É├ú thß╗Ñ l├╜", color: "#27ae60", stl: "54682310",
      nguoiNhap: "V┼⌐ V─ân Y├¬n", ngayNhap: "15/06/2023",
    },
    {
      id: 2,
      maDon: "M├ú 6874", ngayNhan: "02/11/2023",
      nguoiGui: "Nguyß╗àn V─ân An", diaChi: "Ph╞░ß╗¥ng V├╡ C╞░ß╗¥ng, Tß╗ënh Bß║»c Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT", thuTuc: "Gi├ím ─æß╗æc thß║⌐m",
      trangThai: "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn", color: "#e67e22", stl: "",
      nguoiNhap: "Ph├╣ng Tr├óm Anh", ngayNhap: "02/11/2023",
      ycbsSo: "Sß╗æ 089/TB-TA, 15/11/2023",
      ycbsLyDo: "Thiß║┐u t├ái liß╗çu chß╗⌐ng minh quyß╗ün sß╗¡ dß╗Ñng ─æß║Ñt hß╗úp ph├íp",
      ycbsDonBoSung: "M├ú 6912",
      ycbsDonBoSungLoai: "T├ái liß╗çu chß╗⌐ng cß╗⌐",
      ycbsDonBoSungNgay: "20/11/2023",
      ycbsDonBoSungGhiChu: "─É├ú nß╗Öp sß╗ò ─æß╗Å bß║ún sao y",
      ycbsSo2: "Sß╗æ 095/TB-TA, 25/11/2023",
      ycbsLyDo2: "Thiß║┐u giß║Ñy ß╗ºy quyß╗ün hß╗úp lß╗ç cß╗ºa c├íc ─æß╗ông sß╗ƒ hß╗»u",
      ycbsDonBoSung2: "",
    },
    {
      id: 3,
      maDon: "M├ú 7105", ngayNhan: "20/01/2024",
      nguoiGui: "T├▓a ├ín nh├ón d├ón tß╗ënh Bß║»c Ninh", diaChi: "Ph╞░ß╗¥ng Ph╞░╞íng S╞ín, Tß╗ënh Bß║»c Ninh",
      soBA: "15/2024/G─ÉT-HC", ngayBA: "20/01/2024",
      hinhThuc: "CV Kiß║┐n nghß╗ï G─ÉT, TT", thuTuc: "Gi├ím ─æß╗æc thß║⌐m",
      trangThai: "Thß╗Ñ l├╜ mß╗¢i", color: "#2980b9", stl: "54682455", ngayThuLy: "22/01/2024",
      nguoiNhap: "V┼⌐ V─ân Y├¬n", ngayNhap: "20/01/2024",
    },
    {
      id: 4,
      maDon: "M├ú 7188", ngayNhan: "03/02/2024",
      nguoiGui: "Nguyß╗àn Thß╗ï Hoa", diaChi: "Ph╞░ß╗¥ng Ninh X├í, Tß╗ënh Bß║»c Ninh",
      soBA: "15/2024/G─ÉT-HC", ngayBA: "20/01/2024",
      hinhThuc: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", thuTuc: "Gi├ím ─æß╗æc thß║⌐m",
      trangThai: "Thß╗Ñ l├╜ mß╗¢i", color: "#2980b9", stl: "54682460", ngayThuLy: "05/02/2024",
      daChuyenVu: true, trangThaiVu: "Xß║┐p ─æ╞ín",
      thamPhan: "TP. Nguyß╗àn Minh Tuß║Ñn",
      nguoiNhap: "V┼⌐ V─ân Y├¬n", ngayNhap: "03/02/2024",
    },
    {
      id: 5,
      maDon: "M├ú 7210", ngayNhan: "10/02/2024",
      nguoiGui: "L├¬ V─ân Bß╗æn", diaChi: "Ph╞░ß╗¥ng Suß╗æi Hoa, Tß╗ënh Bß║»c Ninh",
      soBA: "15/2024/G─ÉT-HC", ngayBA: "20/01/2024",
      hinhThuc: "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT", thuTuc: "Gi├ím ─æß╗æc thß║⌐m",
      trangThai: "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn", color: "#e67e22",
      nguoiNhap: "Ph├╣ng Tr├óm Anh", ngayNhap: "10/02/2024",
      // Kh├┤ng c├│ YCBS nh╞░ng vß║½n c├│ ─æ╞ín bß╗ò sung
    },
  ];

  /** ─Éiß╗ün ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng theo bß║ún ├ín ─æang khai tr├¬n m├án h├¼nh.
   *  Gß╗ìi khi bß║Ñm Tra cß╗⌐u v├á khi ─æß╗òi Loß║íi ├ín sau l├║c ─æ├ú tra cß╗⌐u ΓÇö v├¼ bß╗Ö vai tr├▓
   *  cß╗ºa ├ín h├¼nh sß╗▒ (bß╗ï c├ío) kh├íc hß║│n c├íc loß║íi ├ín c├▓n lß║íi. */
  const dienNguoiThamGia = (loaiAn: string) => {
    const bo = NGUOI_THEO_LOAI_AN[loaiAn];
    if (!bo) {                       // loß║íi ├ín ch╞░a c├│ dß╗» liß╗çu mß║½u ΓÇö kh├┤ng ─æß╗Ñng g├¼
      setNguoiTuDong(false);
      return 0;
    }
    const danh = (ds: NguoiTuBanAn[] | undefined, tuCach: string): NguoiDungDon[] =>
      (ds ?? []).map((n, i) => ({
        id: Date.now() + i + Math.round(n.hoTen.length),
        lienHeChinh: false, hoTen: n.hoTen, tuCach,
        diaChi: n.diaChi, sdt: "ΓÇö", namSinh: n.namSinh, thongKe: [],
      }));

    if (loaiAn === "H├¼nh sß╗▒") {
      setBiCao((bo.biCao ?? []).map((n, i) => ({ ...n, id: Date.now() + i })));
      setNguyenDon([]); setBiDon([]); setNguoiLienQuan([]); setQuanHePhapLuat("");
      setNguoiTuDong(true);
      return (bo.biCao ?? []).length;
    }
    setBiCao([]);
    setQuanHePhapLuat(bo.quanHe ?? "");
    setNguyenDon(danh(bo.nguyenDon, "Nguy├¬n ─æ╞ín"));
    setBiDon(danh(bo.biDon, "Bß╗ï ─æ╞ín"));
    setNguoiLienQuan(danh(bo.lienQuan, "Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan"));
    setNguoiTuDong(true);
    return (bo.nguyenDon?.length ?? 0) + (bo.biDon?.length ?? 0) + (bo.lienQuan?.length ?? 0);
  };

  const traCuuBanAn = () => {
    setBaSearched(true);
    setSelectedVuAnGoc(null);
    const n = dienNguoiThamGia(loaiAnForm);
    addNotification(n > 0
      ? `─É├ú tra cß╗⌐u bß║ún ├ín v├á ─æiß╗ün sß║╡n ${n} ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng. Vui l├▓ng kiß╗âm tra lß║íi.`
      : "─É├ú tra cß╗⌐u bß║ún ├ín. Ch╞░a lß║Ñy ─æ╞░ß╗úc ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng ΓÇö vui l├▓ng chß╗ìn Loß║íi ├ín hoß║╖c nhß║¡p tay.");
  };

  // Bß║úng ─æ╞ín li├¬n quan = kß║┐t quß║ú tra cß╗⌐u (nß║┐u ─æ├ú bß║Ñm Tra cß╗⌐u) + c├íc ─æ╞ín th├¬m tay
  const donLienQuanRows: DonLienQuan[] = [
    ...(baSearched ? DON_LIEN_QUAN_RESULTS : []),
    ...donLienQuanThem,
  ];

  const selectedBaResult = BA_SEARCH_RESULTS.find(r => r.id === selectedVuAnGoc) ?? null;
  const hasGiamDocThamResult = selectedBaResult?.giaiDoan === "Gi├ím ─æß╗æc thß║⌐m";

  const delCV = (id: number) => setCongVans(p => p.filter(c => c.id !== id));

  // "5. Xß╗¡ l├╜ ─æ╞ín" ΓÇö Thao t├íc/Nß╗Öi dung cß╗ºa d├▓ng Lß╗ïch sß╗¡ dß╗▒ng linh hoß║ít theo
  // ─æ├║ng nhß╗»ng g├¼ ─æang chß╗ìn tr├¬n form (n╞íi chuyß╗ân, l├╜ do, ─æ╞ín ─æß╗º ─æiß╗üu kiß╗çn...).
  const thaoTacXuLy = () =>
    noiChuyenDen === "Nß╗Öi bß╗Ö" || noiChuyenDen === "T├▓a kh├íc" || noiChuyenDen === "Ngo├ái t├▓a ├ín"
      ? "Chuyß╗ân ─æ╞ín" : noiChuyenDen;

  const noiDungXuLy = () => {
    if (noiChuyenDen === "Nß╗Öi bß╗Ö") {
      return [
        donViChuyenDen && `Chuyß╗ân ─æß║┐n: ${donViChuyenDen}`,
        caNhanChuyenDen && `C├í nh├ón: ${caNhanChuyenDen}`,
        trangThaiDon && `Trß║íng th├íi: ${trangThaiDon}`,
        trangThaiDon === "─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn" && lyDoKhongDu && `L├╜ do: ${lyDoKhongDu}`,
        hasGiamDocThamResult
          ? (vuTruong && `Vß╗Ñ tr╞░ß╗ƒng: ${vuTruong}`)
          : (trangThaiDon === "─É╞ín ─æß╗º ─æiß╗üu kiß╗çn" && thuLyDon && `Thß╗Ñ l├╜: ${thuLyDon}`),
      ].filter(Boolean).join(" ┬╖ ");
    }
    if (noiChuyenDen === "T├▓a kh├íc") {
      return [donViChuyenDen && `Chuyß╗ân ─æß║┐n: ${donViChuyenDen}`, `H├¼nh thß╗⌐c: ${chanhAnHoacToaAn}`]
        .filter(Boolean).join(" ┬╖ ");
    }
    if (noiChuyenDen === "Ngo├ái t├▓a ├ín") {
      return donViChuyenDen ? `Chuyß╗ân ─æß║┐n: ${donViChuyenDen}` : "";
    }
    if (noiChuyenDen === "Trß║ú lß║íi ─æ╞ín") {
      return [lyDoTraLai && `L├╜ do: ${lyDoTraLai}`, yeuCauTraLai && `Y├¬u cß║ºu: ${yeuCauTraLai}`]
        .filter(Boolean).join(" ┬╖ ");
    }
    if (noiChuyenDen === "L╞░u theo d├╡i") {
      return lyDoLuuTheoDoi ? `L├╜ do: ${lyDoLuuTheoDoi}` : "";
    }
    return "";
  };

  // Ghi thß║│ng l├¬n bß║ún ghi trong SAMPLE_ROWS ΓÇö Danh s├ích ─æ╞ín v├á form Sß╗¡a ─æß╗üu ─æß╗ìc
  // lß║íi mß║úng n├áy tß╗½ ─æß║ºu mß╗ùi lß║ºn chuyß╗ân view n├¬n lß║ºn mß╗ƒ Sß╗¡a kß║┐ tiß║┐p thß║Ñy ngay.
  const luuLichSuXuLy = () => {
    if (!editingRow || !noiChuyenDen) return;
    if (editingRow.processingHistory && editingRow.processingHistory.length > 0) return;

    const t = new Date();
    const ngay = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
    
    const rawData = {
      noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
      thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
      chanhAnHoacToaAn, vuTruong
    };
    
    editingRow.processingHistory = [
      ...(editingRow.processingHistory ?? []),
      { date: ngay, step: thaoTacXuLy(), actor: nguoiTheoVaiTro(currentRole).nguoi, note: noiDungXuLy(), rawData },
    ];
  };

  return (
    <div className="min-h-screen bg-[#eef1f5] font-['Be_Vietnam_Pro',system-ui,sans-serif] text-[13px] text-[#222]">

      {/* ΓöÇΓöÇ Top navigation bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <div className="bg-[#1d2e4f] text-white flex items-center h-[46px] px-3 gap-3 shadow-md">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-[30px] h-[30px] bg-white/20 rounded flex items-center justify-center">
            <Menu size={16} />
          </div>
          <div>
            <div className="text-[10px] text-white/70 leading-none">T├ÆA ├üN NH├éN D├éN Tß╗ÉI CAO</div>
            <div className="text-[12px] font-bold leading-none">Hß╗å THß╗ÉNG QUß║óN L├¥ ├üN</div>
          </div>
        </div>
        <div className="h-5 w-px bg-white/30" />
        <span className="text-[13px] font-semibold text-white/90 flex items-center gap-1.5">
          <FileText size={14} />
          {donChiTietTabMoi
            ? `Chi tiß║┐t ─æ╞ín ${donChiTietTabMoi.maDon}`
            : view === "list"
            ? "Danh s├ích ─æ╞ín"
            : view === "prototype"
                ? "Prototype: Luß╗ông Gh├⌐p ─æ╞ín"
                : view === "bieumau"
                  ? "Danh s├ích biß╗âu mß║½u ─æ╞ín"
                  : view === "wordeditor"
                    ? "Chß╗ënh sß╗¡a biß╗âu mß║½u"
                    : editingRow
                      ? `Sß╗¡a ─æ╞ín ${editingRow.maDon}`
                      : "Th├¬m mß╗¢i ─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT"}
        </span>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNoti(!showNoti)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white relative">
              <Bell size={16} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#e74c3c] rounded-full border border-[#1d2e4f]" />
              )}
            </button>
            {showNoti && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-[4px] shadow-lg border border-[#ddd] z-50 text-[#333] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#f9f9f9] border-b border-[#eee]">
                  <span className="font-semibold text-[13px]">Th├┤ng b├ío</span>
                  <button onClick={() => setNotifications(p => p.map(n => ({ ...n, read: true })))} className="text-[11px] text-[#1a5a96] hover:underline">─É├ính dß║Ñu ─æ├ú ─æß╗ìc</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[#888] text-[12px]">Kh├┤ng c├│ th├┤ng b├ío n├áo</div>
                  ) : notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`p-3 border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] cursor-pointer transition-colors ${!n.read ? 'bg-[#f0f7ff]' : ''}`}>
                      <p className="text-[12px] leading-snug">{n.text}</p>
                      <span className="text-[10px] text-[#888] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Tab chi tiß║┐t chß╗ë ─æß╗â xem ΓÇö kh├┤ng c├│ L╞░u/Hß╗ºy/Trß║ú lß║íi */}
          {donChiTietTabMoi ? (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <button type="button" onClick={() => window.close()}
                className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                <X size={13} /> ─É├│ng tab
              </button>
            </div>
          ) : view === "form" && (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              {editingRowId === null && <OcrStatusBadge status={ocrStatus} />}
              {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && ocrFields.size > 0 && (
                <button onClick={() => setOcrFields(new Set())}
                  className="flex items-center gap-1 h-[28px] px-2 rounded-[3px] border border-white/20 text-white/80 hover:bg-white/10 text-[11px] transition-colors">
                  <X size={10} /> X├│a highlight
                </button>
              )}
              {/* Kh├┤ng d├╣ng BtnSecondary ß╗ƒ ─æ├óy: nß╗ün trß║»ng mß║╖c ─æß╗ïnh cß╗ºa n├│ chß╗æng
                  lß║íi c├íc lß╗¢p ghi ─æ├¿ n├¬n n├║t bß╗ï trß║»ng-tr├¬n-trß║»ng, mß║Ñt chß╗». */}
              <button type="button" onClick={() => setShowTraLaiForm(true)}
                className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                <RotateCcw size={13} /> Trß║ú lß║íi
              </button>
              <button type="button" onClick={() => setView("list")}
                className="inline-flex items-center h-[28px] px-4 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                Hß╗ºy
              </button>
              <BtnPrimary onClick={() => {
                luuLichSuXuLy();
                addNotification(`─É╞ín ${editingRow?.maDon || "7031"} ─æ├ú ─æ╞░ß╗úc th├¬m mß╗¢i bß╗ƒi c├ín bß╗Ö Nguyß╗àn V─ân An`);
                setView("list");
              }}>L╞░u</BtnPrimary>
            </div>
          )}
        </div>
      </div>

      {/* ΓöÇΓöÇ Body: Sidebar + content ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <div className="flex" style={{ height: "calc(100vh - 46px)" }}>

        {/* Sidebar */}
        <Sidebar activePage={view} currentRole={currentRole} onNav={(page) => { setView(page as any); }}
          onDoiVaiTro={(v) => setCurrentRole(v as any)} vanBanList={vanBanList} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chß╗º</span>
            <ChevronRight size={12} />
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Quß║ún l├╜ ─æ╞ín</span>
            <ChevronRight size={12} />
            {donChiTietTabMoi
              ? <span className="text-[#333]">Chi tiß║┐t ─æ╞ín {donChiTietTabMoi.maDon}</span>
              : view === "home"
              ? <span className="text-[#333]">Tß╗òng quan</span>
              : view === "list"
                ? <span className="text-[#333]">Danh s├ích ─æ╞ín</span>
                : view === "prototype"
                    ? <>
                      <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh s├ích ─æ╞ín</span>
                      <ChevronRight size={12} />
                      <span className="text-[#333]">Prototype: Gh├⌐p ─æ╞ín</span>
                    </>
                    : view === "bieumau"
                      ? <>
                        <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh s├ích ─æ╞ín</span>
                        <ChevronRight size={12} />
                        <span className="text-[#333]">Danh s├ích biß╗âu mß║½u ─æ╞ín</span>
                      </>
                      : view === "wordeditor"
                        ? <>
                          <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh s├ích ─æ╞ín</span>
                          <ChevronRight size={12} />
                          <span className="text-[#333]">Chß╗ënh sß╗¡a biß╗âu mß║½u</span>
                        </>
                        : view === "phancong"
                          ? <span className="text-[#333]">Ph├ón c├┤ng thß║⌐m ph├ín</span>
                          : view === "phe_duyet"
                            ? <>
                              <span className="text-[#1a5a96] hover:underline cursor-pointer">C├┤ng t├íc l├únh ─æß║ío</span>
                              <ChevronRight size={12} />
                              <span className="text-[#333]">Ph├¬ duyß╗çt ─æß╗ü xuß║Ñt</span>
                            </>
                        : view === "van_ban_trinh_ky"
                          ? <>
                              <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh s├ích ─æ╞ín</span>
                              <ChevronRight size={12} />
                              <span className="text-[#333]">Danh s├ích v─ân bß║ún</span>
                            </>
                          : view === "hieu_suat_chi_tiet"
                            ? <>
                                <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("home")}>Hiß╗çu suß║Ñt c├ín bß╗Ö kß╗│ n├áy</span>
                                <ChevronRight size={12} />
                                <span className="text-[#333]">Xem chi tiß║┐t</span>
                              </>
                            : <>
                          <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh s├ích ─æ╞ín</span>
                          <ChevronRight size={12} />
                          <span className="text-[#333]">Th├¬m mß╗¢i</span>
                        </>
            }
          </div>

          {/* Home view */}
          {view === "home" && (
            <div className="flex-1 overflow-y-auto">
              <Dashboard onXemChiTietHieuSuat={() => setView("hieu_suat_chi_tiet")}
                onXemPheDuyet={(tab) => { setPheDuyetTab(tab ?? "cho_duyet"); setView("phe_duyet"); }}
                onXemDanhSachDon={(tab) => { setDanhSachDonTab(tab); setDanhSachDonQuaHanOnly(false); setView("list"); }}
                onXemDonQuaHan={() => { setDanhSachDonTab(0); setDanhSachDonQuaHanOnly(true); setView("list"); }}
                onXemDanhSachVanBan={(tab) => { setVanBanTrinhKyTab(tab ?? "ChoDuyet"); setView("van_ban_trinh_ky"); }}
                vanBanList={vanBanList} currentRole={currentRole} />
            </div>
          )}

          {/* Hiß╗çu suß║Ñt c├ín bß╗Ö kß╗│ n├áy ΓÇö Xem chi tiß║┐t */}
          {view === "hieu_suat_chi_tiet" && (
            <div className="flex-1 overflow-y-auto">
              <HieuSuatCanBoChiTiet currentRole={currentRole} onBack={() => setView("home")} />
            </div>
          )}

          {/* Ph├¬ duyß╗çt ─æß╗ü xuß║Ñt view */}
          {view === "phe_duyet" && (
            <PheDuyetDeXuat danhSach={vanBanList} setDanhSach={setVanBanList} currentRole={currentRole} initialTab={pheDuyetTab} />
          )}

          {/* Danh s├ích v─ân bß║ún ΓÇö h├áng ─æß╗úi c├í nh├ón cß╗ºa c├ín bß╗Ö (lß╗ìc mß║╖c ─æß╗ïnh: ng╞░ß╗¥i tß║ío = t├┤i).
              ─Éß╗òi vai tr├▓ ß╗ƒ g├│c phß║úi m├án h├¼nh sß║╜ thß║Ñy quyß╗ün sß╗¡a ─æß╗òi theo:
              chß╗ë ng╞░ß╗¥i ─æang giß╗» v─ân bß║ún mß╗¢i ─æ╞░ß╗úc sß╗¡a. */}
          {view === "van_ban_trinh_ky" && (
            <VanBanTrinhKyCuaToi danhSach={vanBanList} setDanhSach={setVanBanList}
              currentRole={currentRole} highlightId={vbVuaTao}
              openId={moVanBanId} onDaMo={() => setMoVanBanId(null)}
              locMaDon={locMaDonVanBan} initialTab={vanBanTrinhKyTab} />
          )}

          {/* Tiß║┐p nhß║¡n ─æ╞ín li├¬n th├┤ng */}
          {view === "lienthong" && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#eef1f5]">
              <PanelLienThong currentRole={currentRole} onChiTiet={(don) => {
                  setEditingRowId(null);
                  setView("form");
                  setActiveDonLienThong(don);
                  setIsLienThongMode(true);
                  setShowPDF(true); // Always show 2 panels for Lien Thong
                  ocrRunId.current++;
                  clearOcrTimers();
                  // Fake PDF file so the left panel shows viewer instead of upload
                  setOcrFile({ name: don.maDon + ".pdf", sizeMB: 1.2 }); 
                  setOcrStatus("chua");
                  setOcrStep(0);
                  setOcrFields(new Set());
                  
                  if (don.nguon === "VBDH") {
                    setHinhThucNhan("VBDH");
                    setShowUploadPopup(false);
                    // Empty initially, requires OCR
                    setHinhThuc("");
                    setLoaiAnForm("");
                    setNguyenDon([]);
                  } else {
                    setHinhThucNhan(don.nguon === "DVTT" ? "─Éiß╗çn tß╗¡" : don.nguon === "BuuDien" ? "B╞░u ─æiß╗çn" : "Trß╗▒c tiß║┐p");
                    setShowUploadPopup(false);
                    // Pre-fill everything immediately
                    setHinhThuc(don.hinhThucDon);
                    setLoaiAnForm(don.loaiAn);
                    if (don.nguoiLamDon) {
                      setNguyenDon([{ 
                        id: Date.now(), tuCach: "C├í nh├ón", lienHeChinh: true,
                        hoTen: don.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: "" 
                      }]);
                    } else {
                      setNguyenDon([]);
                    }
                  }
                  
                  if (don.ngayTiepNhan) {
                    const parts = don.ngayTiepNhan.split(' ')[0].split('/');
                    if (parts.length === 3) {
                      setNgayToaNhan(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                  }
                }} />
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachDon
                currentRole={currentRole}
                initialTab={danhSachDonTab}
                initialQuaHanOnly={danhSachDonQuaHanOnly}
                onTaoVanBan={taoVanBanTuModal}
                onXemVanBanDaTrinh={xemVanBanDaTrinh}
                vanBanList={vanBanList}
                onThemMoi={() => {
                  setEditingRowId(null);
                  setView("form");
                  setIsLienThongMode(false);
                  setShowPDF(false);
                  // Th├¬m mß╗¢i lu├┤n bß║»t ─æß║ºu bß║▒ng luß╗ông nhß║¡p PDF ΓåÆ OCR.
                  ocrRunId.current++;
                  clearOcrTimers();
                  setOcrFile(null);
                  setOcrStatus("chua");
                  setOcrStep(0);
                  setOcrFields(new Set());
                  setShowUploadPopup(true);
                }}
                onBieuMau={(r, vbId) => { setBieuMauRow(r); setBieuMauVbId(vbId ?? null); setView("bieumau"); }}
                onWordEditor={() => setView("wordeditor")}
                onEditRow={(id) => { setEditingRowId(id); setView("form"); setIsLienThongMode(false); }}
                isTruongPhong={false}
              />
            </div>
          )}

          {/* Hß╗ô s╞í kh├íng nghß╗ï view ΓÇö d├╣ng lß║íi m├án Danh s├ích ─æ╞ín, kh├íc cß╗Öt Th├┤ng tin giß║úi quyß║┐t */}
          {/* Nhß║¡n ─æ╞ín v├á TL vß╗Ñ ├ín ΓÇö module Quß║ún l├╜ ├ín G─ÉT/TT */}
          {view === "nhandon_tl" && (
            <div className="flex-1 overflow-y-auto">
              <NhanDonTLVuAn />
            </div>
          )}

          {/* Cß║Ñu h├¼nh ph├ón c├┤ng Thß║⌐m ph├ín ΓÇö quy tß║»c ph├ón c├┤ng + nghß╗ë ph├⌐p */}
          {view === "cauhinh_pctp" && (
            <div className="flex-1 overflow-y-auto">
              <CauHinhPhanCongTP />
            </div>
          )}

          {/* Biß╗âu mß║½u view */}
          {view === "bieumau" && bieuMauRow && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachBieuMau row={bieuMauRow} vbId={bieuMauVbId}
                onBack={() => { setView("list"); setBieuMauVbId(null); }}
                vanBanList={vanBanList} setVanBanList={setVanBanList} currentRole={currentRole} />
            </div>
          )}

          {/* Word editor view */}
          {view === "wordeditor" && (
            <div className="flex-1 overflow-y-auto">
              <WordEditor onBack={() => setView("list")} />
            </div>
          )}

          {/* Ph├ón c├┤ng thß║⌐m ph├ín view */}
          {view === "phancong" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <PhanCongThamPhan initialTab={phanCongTab} currentRole={currentRole}
                onOpenThamPhanPopup={() => setShowThamPhanPopup(true)} />
            </div>
          )}

          {/* Form view: 2-panel */}
          <div className={`flex flex-1 overflow-hidden ${view === "form" ? "" : "hidden"}`}>

            {/* LEFT: Form panel */}
            <div className={`${showPDF ? "w-[58%]" : "w-full"} min-w-[540px] overflow-y-auto bg-[#eef1f5] transition-all`}>
              <div className="p-3 space-y-3">

                {/* Banner trß║íng th├íi OCR ΓÇö chß╗ë ß╗ƒ luß╗ông Th├¬m mß╗¢i */}
                {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && editingRowId === null && ocrStatus !== "thanhcong" && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-[3px] text-[12px] border ${ocrStatus === "dang" ? "bg-[#fffbeb] border-[#f59e0b] text-[#92400e]"
                    : ocrStatus === "thatbai" ? "bg-[#fdecea] border-[#e57373] text-[#8b1a1a]"
                      : "bg-[#f5f7fa] border-[#ccd3dd] text-[#4a5568]"}`}>
                    <OcrStatusBadge status={ocrStatus} />
                    <span className="truncate">
                      {ocrStatus === "dang"
                        ? <>─Éang tr├¡ch xuß║Ñt dß╗» liß╗çu tß╗½ <b>{ocrFile?.name}</b>. Bß║ín c├│ thß╗â tiß║┐p tß╗Ñc nhß║¡p tay, hß╗ç thß╗æng sß║╜ th├┤ng b├ío khi xong.</>
                        : ocrStatus === "thatbai"
                          ? <>Kh├┤ng tr├¡ch xuß║Ñt ─æ╞░ß╗úc dß╗» liß╗çu tß╗½ <b>{ocrFile?.name}</b>. Vui l├▓ng thß╗▒c hiß╗çn OCR lß║íi hoß║╖c nhß║¡p tay.</>
                          : ocrStatus === "dahuy"
                            ? <>─É├ú hß╗ºy OCR cho <b>{ocrFile?.name}</b>. Dß╗» liß╗çu ch╞░a ─æ╞░ß╗úc tr├¡ch xuß║Ñt tß╗▒ ─æß╗Öng.</>
                            : <>Ch╞░a c├│ t├ái liß╗çu OCR. Tß║úi l├¬n file PDF ─æß╗â hß╗ç thß╗æng tß╗▒ tr├¡ch xuß║Ñt dß╗» liß╗çu.</>}
                    </span>
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      {ocrStatus === "dang" ? (
                        <>
                          <button onClick={() => setShowOcrProgress(true)}
                            className="h-[24px] px-2 rounded-[3px] border border-black/20 hover:bg-black/5 text-[11px] font-medium transition-colors">Xem tiß║┐n tr├¼nh</button>
                          <button onClick={() => setShowOcrCancel(true)}
                            className="h-[24px] px-2 rounded-[3px] border border-black/20 hover:bg-black/5 text-[11px] font-medium transition-colors">Hß╗ºy OCR</button>
                        </>
                      ) : (
                        <button onClick={reOcr}
                          className="inline-flex items-center gap-1 h-[24px] px-2 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[11px] font-medium transition-colors">
                          <RefreshCw size={11} /> {ocrStatus === "chua" ? "Thß╗▒c hiß╗çn OCR" : "Thß╗▒c hiß╗çn OCR lß║íi"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* OCR notice banner */}
                {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && ocrFields.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#fffbeb] border border-[#f59e0b] rounded-[3px] text-[12px] text-[#92400e]">
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[10px] font-bold px-1.5 py-[2px] rounded-sm">OCR</span>
                    <span>C├íc tr╞░ß╗¥ng ─æ╞░ß╗úc ─æ├ính dß║Ñu ─æ├ú ─æ╞░ß╗úc tr├¡ch xuß║Ñt tß╗▒ ─æß╗Öng tß╗½ t├ái liß╗çu. Vui l├▓ng kiß╗âm tra v├á x├íc nhß║¡n lß║íi th├┤ng tin.</span>
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      {editingRowId === null && ocrStatus === "thanhcong" && (
                        <button onClick={reOcr} className="inline-flex items-center gap-1 h-[24px] px-2 rounded-[3px] border border-[#f59e0b] hover:bg-[#fef3c7] text-[11px] font-medium transition-colors">
                          <RefreshCw size={11} /> Thß╗▒c hiß╗çn OCR lß║íi
                        </button>
                      )}
                      <button onClick={() => setOcrFields(new Set())} className="text-[#92400e] hover:text-[#78350f]"><X size={13} /></button>
                    </div>
                  </div>
                )}

                {/* 1. Th├┤ng tin chung */}
                <Section title="1. Th├┤ng tin chung">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Lbl req>H├¼nh thß╗⌐c nhß║¡n</Lbl>
                      <Sel disabled={isLienThongMode} value={hinhThucNhan} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHinhThucNhan(e.target.value)}>
                        <option value="">-- Chß╗ìn h├¼nh thß╗⌐c nhß║¡n --</option>
                        <option>B╞░u ─æiß╗çn</option>
                        <option>─Éiß╗çn tß╗¡</option>
                        <option>Trß╗▒c tiß║┐p</option>
                        <option>Nß╗Öi bß╗Ö</option>
                        <option>Tiß║┐p c├┤ng d├ón</option>
                      </Sel>
                    </div>
                     <div>
                      <Lbl req>H├¼nh thß╗⌐c ─æ╞ín</Lbl>
                      <div className="relative">
                        <select disabled={isLienThongMode} value={hinhThuc} onChange={e => setHinhThuc(e.target.value)}
                          className="w-full h-[30px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none">
                          <option value="">-- Chß╗ìn h├¼nh thß╗⌐c --</option>
                          <optgroup label="ΓÇö ─É╞ín">
                            <option value="─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT">1. ─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT</option>
                            <option value="─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng">2. ─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng</option>
                            <option value="Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t">3. Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t</option>
                            <option value="─É╞ín kh├íc">4. ─É╞ín kh├íc</option>
                          </optgroup>
                          <optgroup label="ΓÇö C├┤ng v─ân">
                            <option value="CV kiß║┐n nghß╗ï G─ÉT-TT">1. CV kiß║┐n nghß╗ï G─ÉT-TT</option>
                            <option value="CV chuyß╗ân ─æ╞ín">2. CV chuyß╗ân ─æ╞ín</option>
                            <option value="CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT">3. CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT</option>
                            <option value="CV kh├íc">4. CV kh├íc</option>
                          </optgroup>
                          <optgroup label="ΓÇö T├ái liß╗çu">
                            <option value="T├ái liß╗çu chß╗⌐ng cß╗⌐">T├ái liß╗çu chß╗⌐ng cß╗⌐</option>
                          </optgroup>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <Lbl req>Thß╗º tß╗Ñc giß║úi quyß║┐t</Lbl>
                      <Sel value={thuTucGQ} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setThuTucGQ(e.target.value)}>
                        <option value="">-- Chß╗ìn --</option>
                        <option>Gi├ím ─æß╗æc thß║⌐m</option>
                        <option>T├íi thß║⌐m</option>
                        <option>Gi├ím ─æß╗æc thß║⌐m + T├íi thß║⌐m</option>
                        <option>Ch╞░a x├íc ─æß╗ïnh</option>
                      </Sel>
                    </div>
                    {/* Sß╗æ hiß╗çu ─æ╞ín: do N╞áI Gß╗¼I ─æ├ính tr├¬n ─æ╞ín, kh├íc m├ú ─æ╞ín do hß╗ç
                        thß╗æng sinh ΓÇö kh├┤ng bß║»t buß╗Öc v├¼ ─æ╞ín cß╗ºa c├┤ng d├ón th╞░ß╗¥ng
                        kh├┤ng c├│ sß╗æ hiß╗çu n├áo.
                        H├¼nh thß╗⌐c C├┤ng v─ân th├¼ bß╗Å hß║│n: c├┤ng v─ân ─æ├ú c├│ sß╗æ c├┤ng v─ân
                        v├á ng├áy c├┤ng v─ân ri├¬ng ß╗ƒ mß╗Ñc Th├┤ng tin c├┤ng v─ân, hai cß║╖p
                        tr╞░ß╗¥ng song song chß╗ë g├óy nhß║¡p nhß║ºm. */}
                    {isDon && (
                      <div>
                        <Lbl>Sß╗æ hiß╗çu ─æ╞ín</Lbl>
                        <Inp placeholder="Sß╗æ hiß╗çu n╞íi gß╗¡i ghi tr├¬n ─æ╞ín" value={soHieuDon}
                          onChange={e => setSoHieuDon(e.target.value)} />
                      </div>
                    )}
                    {/* Ng├áy t├▓a nhß║¡n ΓÇö mß╗æc ─æß╗â t├¡nh thß╗¥i hiß╗çu, n├¬n bß║»t buß╗Öc.
                        Nß╗æi v├áo OCR: bß║ún tr├¡ch xuß║Ñt c├│ sß║╡n ng├áy nhß║¡n th├¼ ─æiß╗ün lu├┤n,
                        c├ín bß╗Ö chß╗ë viß╗çc so├ít lß║íi. */}
                    <OcrWrap fieldKey="ngayNhan">
                      <div>
                        <Lbl req>Ng├áy t├▓a nhß║¡n</Lbl>
                        <Inp type="date"
                          value={ngayToaNhan || (ocrFields.has("ngayNhan") ? OCR_MOCK.ngayNhan : "")}
                          onChange={e => setNgayToaNhan(e.target.value)} />
                      </div>
                    </OcrWrap>
                    {/* Ng├áy ghi tr├¬n ─æ╞ín ΓÇö ng╞░ß╗¥i gß╗¡i tß╗▒ ─æß╗ü, lu├┤n c├│ tr├¬n ─æ╞ín n├¬n
                        bß║»t buß╗Öc; kh├┤ng mß║╖c ─æß╗ïnh theo h├┤m nay v├¼ ─æ╞ín gß╗¡i b╞░u ─æiß╗çn
                        th╞░ß╗¥ng ─æß╗ü tr╞░ß╗¢c ng├áy t├▓a nhß║¡n cß║ú tuß║ºn.
                        C├┤ng v─ân d├╣ng "Ng├áy c├┤ng v─ân" ß╗ƒ mß╗Ñc Th├┤ng tin c├┤ng v─ân. */}
                    {isDon && (
                      <div>
                        <Lbl req>Ng├áy ghi tr├¬n ─æ╞ín</Lbl>
                        <Inp type="date" value={ngayGhiTrenDon}
                          onChange={e => setNgayGhiTrenDon(e.target.value)} />
                      </div>
                    )}
                    {/* Th├┤ng tin b├¼ th╞░ ΓÇö chß╗ë vß╗¢i Trß╗▒c tiß║┐p / B╞░u ─æiß╗çn.
                        Nhß║¡p m├ú b├¼ th╞░ sß║╜ tß╗▒ ─æiß╗ün phß║ºn c├▓n lß║íi tß╗½ hß╗ç thß╗æng b╞░u ch├¡nh. */}
                    {canBiThu && (
                      <div className="col-span-3 border border-[#d6e4f0] bg-[#f7fbff] rounded-[4px] p-3 mb-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[12px] font-semibold text-[#1a5a96]">Th├┤ng tin b├¼ th╞░</span>
                          <span className="text-[11px] text-[#888]">ΓÇö nhß║¡p m├ú b├¼ th╞░ ─æß╗â lß║Ñy dß╗» liß╗çu tß╗½ hß╗ç thß╗æng b╞░u ch├¡nh</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                          <div>
                            <Lbl>M├ú b├¼ th╞░</Lbl>
                            <Inp placeholder="VD: BT2026001" value={biThu.ma}
                              onChange={e => traBiThu(e.target.value)} />
                          </div>
                          <div>
                            <Lbl req>Ng├áy tr├¬n dß║Ñu b╞░u ─æiß╗çn</Lbl>
                            <Inp type="date" value={biThu.ngayDau}
                              onChange={e => setBiThu(p => ({ ...p, ngayDau: e.target.value }))}
                              className={biThu.ngayDau ? "" : "border-[#e57373]"} />
                          </div>
                          <div>
                            <Lbl>Hß╗ì t├¬n ng╞░ß╗¥i gß╗¡i</Lbl>
                            <Inp placeholder="Nhß║¡p hß╗ì t├¬n ng╞░ß╗¥i gß╗¡i" value={biThu.nguoiGui}
                              onChange={e => setBiThu(p => ({ ...p, nguoiGui: e.target.value }))} />
                          </div>
                          <div>
                            <Lbl>Sß╗æ ─æiß╗çn thoß║íi</Lbl>
                            <Inp placeholder="Nhß║¡p sß╗æ ─æiß╗çn thoß║íi" value={biThu.sdt}
                              onChange={e => setBiThu(p => ({ ...p, sdt: e.target.value }))} />
                          </div>
                          <div className="col-span-2">
                            <Lbl>─Éß╗ïa chß╗ë</Lbl>
                            <Inp placeholder="Nhß║¡p ─æß╗ïa chß╗ë" value={biThu.diaChi}
                              onChange={e => setBiThu(p => ({ ...p, diaChi: e.target.value }))} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Radio group cho CV chuyß╗ân ─æ╞ín */}
                    {hinhThuc === "CV chuyß╗ân ─æ╞ín" && (
                      <div className="col-span-3 flex items-center gap-1 px-3 py-[6px] bg-[#fffaf7] border border-[#e8d9cc] rounded mb-1">
                        <span className="text-[12px] font-medium text-[#c0392b] mr-1 whitespace-nowrap">
                          Loß║íi ─æ╞ín<span className="ml-0.5 text-[#c0392b]">*</span>:
                        </span>
                        <div className="flex items-center gap-5">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT"
                              checked={loaiDonChuyenDon === "─É╞ín ─æß╗ü nghß╗ï G─ÉT-TT"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">─É╞ín ─æß╗ü nghß╗ï G─ÉT/TT</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng"
                              checked={loaiDonChuyenDon === "─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">─É╞ín khiß║┐u nß║íi tß╗æ c├ío trong tß╗æ tß╗Ñng</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t"
                              checked={loaiDonChuyenDon === "Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">Th├┤ng b├ío ph├ít hiß╗çn vi phß║ím ph├íp luß║¡t</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* C├íc checkbox th├¬m khi hinhThuc === "CV kh├íc" */}
                    {hinhThuc === "CV kh├íc" && (
                      <div className="flex flex-col gap-2 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={coBanAnLienQuan} onChange={e => setCoBanAnLienQuan(e.target.checked)} />
                          C├│ bß║ún ├ín/quyß║┐t ─æß╗ïnh li├¬n quan
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={coCongVanPhucDap} onChange={e => setCoCongVanPhucDap(e.target.checked)} />
                          C├│ c├┤ng v─ân ph├║c ─æ├íp
                        </label>
                      </div>
                    )}
                  </div>
                </Section>
                  {/* 2. Th├┤ng tin bß║ún ├ín ─æß╗ü nghß╗ï */}
                  {(hinhThuc !== "CV kh├íc" || coBanAnLienQuan) && (
                    <Section title="2. Th├┤ng tin bß║ún ├ín ─æß╗ü nghß╗ï" defaultOpen={!isDonKhac}>
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-x-4 items-end">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loß║íi Q─É/BA</Lbl>
                            <Sel value={loaiQDBaEffective} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLoaiQDBa(e.target.value)}>
                              {loaiQDBaOptions.map(o => <option key={o}>{o}</option>)}
                            </Sel>
                          </div>
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loß║íi ├ín</Lbl>
                            <Sel value={ocrFields.has("loaiAn") && !loaiAnForm ? "H├ánh ch├¡nh" : loaiAnForm} onChange={e => {
                              setLoaiAnForm(e.target.value);
                              if (e.target.value !== "H├¼nh sß╗▒") setAnTuHinh(false);
                              // ─É├ú tra cß╗⌐u rß╗ôi mß╗¢i ─æß╗òi loß║íi ├ín ΓåÆ ─æiß╗ün lß║íi ─æ├║ng bß╗Ö vai tr├▓
                              if (baSearched) dienNguoiThamGia(e.target.value);
                            }}>
                              <option value="">-- Chß╗ìn --</option>
                              <option>H├¼nh sß╗▒</option>
                              <option>D├ón sß╗▒</option>
                              <option>H├ánh ch├¡nh</option>
                              <option>Kinh doanh th╞░╞íng mß║íi</option>
                              <option>H├┤n nh├ón gia ─æ├¼nh</option>
                              <option>Lao ─æß╗Öng</option>
                              <option>Sß╗ƒ hß╗»u tr├¡ tuß╗ç</option>
                              <option>Ph├í sß║ún</option>
                            </Sel>
                          </div>
                          {isDonKhieuNaiTuPhap && (
                            <div className="col-span-2 flex flex-col gap-1 justify-end">
                              <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loß║íi ─æ╞ín / Nß╗Öi dung khiß║┐u kiß╗çn</Lbl>
                              <div className="flex items-center gap-5 h-[30px]">
                                {["─É╞ín khiß║┐u nß║íi", "─É╞ín tß╗æ c├ío"].map(opt => (
                                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                    <input type="radio" name="loaiDonKhieuNai" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                      checked={loaiDonKhieuNai === opt}
                                      onChange={() => setLoaiDonKhieuNai(opt)} />
                                    {opt}
                                  </label>
                                ))}
                                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] border-l pl-4 border-[#ddd]">
                                  <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                    checked={khieuNaiToCaoHanhVi}
                                    onChange={e => setKhieuNaiToCaoHanhVi(e.target.checked)} />
                                  Khiß║┐u nß║íi/tß╗æ c├ío h├ánh vi
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Nß║┐u t├¡ch chß╗ìn Khiß║┐u nß║íi/tß╗æ c├ío h├ánh vi th├¼ hiß╗ân thß╗ï textarea */}
                        {isDonKhieuNaiTuPhap && khieuNaiToCaoHanhVi && (
                          <div>
                            <Lbl req>Nß╗Öi dung h├ánh vi bß╗ï khiß║┐u nß║íi/Tß╗æ c├ío</Lbl>
                            <textarea rows={3} placeholder="Nhß║¡p h├ánh vi bß╗ï khiß║┐u nß║íi/tß╗æ c├ío..."
                              value={hanhViBiKhieuNai} onChange={e => setHanhViBiKhieuNai(e.target.value)}
                              className={`w-full border rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none ${hanhViBiKhieuNai ? "border-[#ccc]" : "border-[#e57373]"}`} />
                          </div>
                        )}

                        <div className="grid grid-cols-4 gap-x-3 items-end">
                          <OcrWrap fieldKey="soBA">
                            <div>
                              <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>{nhanSoBA}</Lbl>
                              <Inp placeholder={`Nhß║¡p ${nhanSoBA.toLowerCase()}`} value={baForm.soBA || (ocrFields.has("soBA") ? OCR_MOCK.soBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, soBA: e.target.value }))} />
                            </div>
                          </OcrWrap>
                          <OcrWrap fieldKey="ngayBA">
                            <div>
                              <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>{nhanNgayBA}</Lbl>
                              <Inp type="date" value={baForm.ngayBA || (ocrFields.has("ngayBA") ? OCR_MOCK.ngayBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, ngayBA: e.target.value }))} />
                            </div>
                          </OcrWrap>
                          <OcrWrap fieldKey="toaXetXu">
                            <div>
                              <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>T├▓a ra bß║ún ├ín</Lbl>
                              <Inp placeholder="Nhß║¡p t├¬n t├▓a" value={baForm.toaBA || (ocrFields.has("toaXetXu") ? OCR_MOCK.toaXetXu : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, toaBA: e.target.value }))} />
                            </div>
                          </OcrWrap>
                          <div className="flex-1">
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Cß║Ñp x├⌐t xß╗¡</Lbl>
                            <Sel value={baForm.capXetXu || (ocrFields.has("capXetXu") ? OCR_MOCK.capXetXu : "")} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBaForm(p => ({ ...p, capXetXu: e.target.value }))}>
                              <option value="">-- Chß╗ìn --</option>
                              <option>S╞í thß║⌐m</option>
                              <option>Ph├║c thß║⌐m</option>
                              <option>Gi├ím ─æß╗æc thß║⌐m</option>
                              <option>T├íi thß║⌐m</option>
                            </Sel>
                          </div>
                          <div className="flex items-end gap-2 mt-1">
                            <button onClick={traCuuBanAn}
                              className="flex-shrink-0 flex items-center gap-1.5 h-[30px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[12px] font-medium transition-colors whitespace-nowrap">
                              <Search size={12} /> Tra cß╗⌐u
                            </button>

                          </div>
                        </div>
                        <div className="border border-[#ddd] rounded-[3px] px-3 py-2.5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-[6px] h-[6px] rounded-full bg-[#8b1a1a] flex-shrink-0" />
                            <span className="text-[13px] font-semibold text-[#222]">Th├┤ng tin</span>
                          </div>
                          <Lbl>Thß╗¥i hiß╗çu giß║úi quyß║┐t</Lbl>
                          <div className="flex items-center gap-6 flex-wrap">
                            {THOI_HIEU_FORM_OPTIONS.map(opt => (
                              <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                                <input type="radio" name="thoiHieuGiaiQuyetForm" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                  checked={baForm.thoiHieuGiaiQuyet === opt.value}
                                  onChange={() => setBaForm(p => ({ ...p, thoiHieuGiaiQuyet: opt.value }))} />
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        </div>
                        {loaiAnForm === "H├¼nh sß╗▒" && (
                          <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                            <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                              checked={xulychuynhuong} onChange={e => {
                                setXulychuynhuong(e.target.checked);
                                if (e.target.checked) {
                                  setAnTuHinh(false);
                                  setXinGiamAnTuHinh(false);
                                  setKeuOanAnTuHinh(false);
                                  setXinThiHanhAnSom(false);
                                }
                              }} />
                            ├üp dß╗Ñng biß╗çn ph├íp XLCH
                          </label>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-[#444]">Danh s├ích bß║ún ├ín/quyß║┐t ─æß╗ïnh li├¬n quan</span>
                            <BtnAdd onClick={() => setShowThemBanAn(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                          </div>
                          {BA_SEARCH_RESULTS.length === 0 ? (
                            <Tbl headers={["STT", "─Éß╗ü nghß╗ï xem x├⌐t", "Vß╗Ñ ├ín", "Nguß╗ôn vß╗Ñ ├ín", "Loß║íi BA/Q─É", "Giai ─æoß║ín", "Sß╗æ bß║ún ├ín", "Ng├áy ra bß║ún ├ín", "T├▓a ├ín ra bß║ún ├ín", "Trß║íng th├íi bß║ún ├ín", "Thao t├íc"]} emptyMsg="Ch╞░a c├│ dß╗» liß╗çu" />
                          ) : (
                            <table className="w-full border-collapse text-[12px]">
                              <thead>
                                <tr className="bg-[#f5f5f5]">
                                  {["STT", "─Éß╗ü nghß╗ï xem x├⌐t", "Vß╗Ñ ├ín", "Nguß╗ôn vß╗Ñ ├ín", "Loß║íi BA/Q─É", "Giai ─æoß║ín", "Sß╗æ bß║ún ├ín", "Ng├áy ra bß║ún ├ín", "T├▓a ├ín ra bß║ún ├ín", "Trß║íng th├íi bß║ún ├ín", "Thao t├íc"].map(h => (
                                    <th key={h} className={`border border-[#ddd] px-3 py-[6px] font-semibold text-[#333] whitespace-nowrap ${h === "Thao t├íc" ? "text-center w-[76px]" : "text-left"}`}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {BA_SEARCH_RESULTS.map((r, i) => (
                                  <tr key={r.id} className={`align-top ${selectedVuAnGoc === r.id ? "bg-[#e8f7ee]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                    <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                    <td className="border border-[#ddd] px-3 py-2 text-center">
                                      {/* C├╣ng name vß╗¢i bß║úng kß║┐t quß║ú giß║úi quyß║┐t:
                                          chß╗ë ─æ╞░ß╗úc ─æß╗ü nghß╗ï xem x├⌐t 1 bß║ún ├ín HOß║╢C
                                          1 kß║┐t quß║ú giß║úi quyß║┐t, kh├┤ng ─æ╞░ß╗úc cß║ú hai */}
                                      <input type="radio" name="deNghiXemXet"
                                        className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                        checked={deNghiBanAn === r.id}
                                        onChange={() => { setDeNghiBanAn(r.id); setDeNghiKetQua(null); }} />
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2 text-[#1a5a96]">{r.vuAn}</td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-semibold ${
                                        r.nguon === "QLA"
                                          ? "bg-[#e0f2fe] text-[#0369a1]"
                                          : r.nguon === "Kho sß╗æ h├│a"
                                          ? "bg-[#fef3c7] text-[#d97706]"
                                          : "bg-[#f3f4f6] text-[#374151]"
                                      }`}>
                                        {r.nguon}
                                      </span>
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.loai}</td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      <span className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-medium border ${r.giaiDoan === "S╞í thß║⌐m" ? "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" : "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"}`}>
                                        {r.giaiDoan}
                                      </span>
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2 font-medium">{r.soBA}</td>
                                    <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.ngayBA}</td>
                                    <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.toaAn}</td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      {/* Bß║ún ├ín th├¬m tay c├│ cß╗¥ daGiaiQuyet ri├¬ng;
                                          dß╗» liß╗çu tra cß╗⌐u th├¼ suy theo giai ─æoß║ín. */}
                                      {(() => {
                                        const xong = "daGiaiQuyet" in r ? (r as BanAnLienQuan).daGiaiQuyet : r.giaiDoan !== "S╞í thß║⌐m";
                                        return (
                                          <span className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-medium border ${xong
                                            ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                            : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                                            }`}>
                                            {xong ? "─É├ú giß║úi quyß║┐t" : "─Éang giß║úi quyß║┐t"}
                                          </span>
                                        );
                                      })()}
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      <div className="flex items-center justify-center gap-0.5">
                                        {/* D├▓ng th├¬m tay: sß╗¡a ngay trong popup.
                                            D├▓ng tß╗½ Kho sß╗æ h├│a: chß╗ë ─æß╗ò ng╞░ß╗úc l├¬n
                                            form Th├┤ng tin bß║ún ├ín ─æß╗â chß╗ënh, v├¼ bß║ún
                                            ghi gß╗æc nß║▒m ß╗ƒ kho, kh├┤ng sß╗¡a tß║íi ─æ├óy. */}
                                        {r.nguon === "Th├¬m mß╗¢i" ? (
                                          <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sß╗¡a"
                                            onClick={() => { setSuaBanAnId(r.id); setShowThemBanAn(true); }} />
                                        ) : r.nguon === "Kho sß╗æ h├│a" ? (
                                          <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sß╗¡a tr├¬n form Th├┤ng tin bß║ún ├ín"
                                            onClick={() => {
                                              setLoaiQDBa(r.loai);
                                              setBaForm(p => ({
                                                ...p,
                                                soBA: r.soBA,
                                                ngayBA: r.ngayBA.split("/").reverse().join("-"),
                                                toaBA: r.toaAn,
                                                capXetXu: r.giaiDoan
                                              }));
                                            }} />
                                        ) : null}
                                        {r.nguon === "Th├¬m mß╗¢i" && (
                                          <ActionBtn icon={<Trash2 size={14} />} color="red" title="X├│a"
                                            onClick={() => {
                                              setBanAnThem(p => p.filter(x => x.id !== r.id));
                                              if (deNghiBanAn === r.id) setDeNghiBanAn(null);
                                            }} />
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>

                        {/* Danh s├ích kß║┐t quß║ú giß║úi quyß║┐t li├¬n quan */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-semibold text-[#444]">Danh s├ích kß║┐t quß║ú giß║úi quyß║┐t li├¬n quan</span>
                              <span className="text-[11px] text-[#888] italic">
                                ΓÇö chß╗ë ─æ╞░ß╗úc ─æß╗ü nghß╗ï xem x├⌐t 1 bß║ún ├ín/quyß║┐t ─æß╗ïnh hoß║╖c 1 kß║┐t quß║ú giß║úi quyß║┐t
                              </span>
                            </div>
                            <BtnAdd onClick={() => setShowThemTB(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                          </div>
                          <Tbl headers={["STT", "─Éß╗ü nghß╗ï xem x├⌐t", "Loß║íi kß║┐t quß║ú", "Sß╗æ kß║┐t quß║ú", "Ng├áy", "T├▓a ├ín", "Thao t├íc"]}
                            emptyMsg="Ch╞░a c├│ dß╗» liß╗çu">
                            {thongBaoTraLoi.length > 0 ? thongBaoTraLoi.map((tb, i) => (
                              <tr key={tb.id} className={deNghiKetQua === tb.id ? "bg-[#e8f7ee]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                <Td center>{i + 1}</Td>
                                <Td center>
                                  <input type="radio" name="deNghiXemXet"
                                    className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                    checked={deNghiKetQua === tb.id}
                                    onChange={() => { setDeNghiKetQua(tb.id); setDeNghiBanAn(null); }} />
                                </Td>
                                <Td>{tb.loaiKQ}</Td>
                                <Td>{tb.soTB}</Td>
                                <Td>{tb.ngayTB}</Td>
                                <Td>{tb.toaAn}</Td>
                                <Td center>
                                  <div className="flex items-center justify-center gap-0.5">
                                    <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sß╗¡a"
                                      onClick={() => { setSuaKetQuaId(tb.id); setShowThemTB(true); }} />
                                    <ActionBtn icon={<Trash2 size={14} />} color="red" title="X├│a"
                                      onClick={() => {
                                        setThongBaoTraLoi(p => p.filter(x => x.id !== tb.id));
                                        if (deNghiKetQua === tb.id) setDeNghiKetQua(null);
                                      }} />
                                  </div>
                                </Td>
                              </tr>
                            )) : undefined}
                          </Tbl>
                        </div>

                        {/* Danh s├ích ─æ╞ín li├¬n quan */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-[#444]">Danh s├ích ─æ╞ín li├¬n quan</span>
                          </div>
                          {donLienQuanRows.length === 0 ? (
                            <Tbl
                              headers={["STT", "Th├┤ng tin ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", "Th├┤ng tin ─æ╞ín", "Ng╞░ß╗¥i nhß║¡p", "Trß║íng th├íi"]}
                              emptyMsg="Ch╞░a c├│ dß╗» liß╗çu"
                            />
                          ) : (
                            <table className="w-full border-collapse text-[12px]">
                              <thead>
                                <tr className="bg-[#f5f5f5]">
                                  {/* "Th├┤ng tin ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín" / "Th├┤ng tin ─æ╞ín" ─æß╗òi size cho nhau theo y├¬u cß║ºu */}
                                  {["STT", "Th├┤ng tin ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", "Th├┤ng tin ─æ╞ín", "Ng╞░ß╗¥i nhß║¡p", "Trß║íng th├íi"].map(h => (
                                    <th key={h} className={`border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] whitespace-nowrap ${
                                      h === "Th├┤ng tin ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín" ? "w-[270px]" : h === "Th├┤ng tin ─æ╞ín" ? "w-[447px]" : ""}`}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {donLienQuanRows.map((r, i) => (
                                  <tr key={r.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                    <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      {/* span chß╗⌐ kh├┤ng phß║úi button: button kh├┤ng kß║┐ thß╗½a
                                          font cß╗ºa bß║úng n├¬n chß╗» bß╗ï to h╞ín c├íc cß╗Öt kh├íc */}
                                      <span onClick={() => moTabChiTietDon(r)}
                                        title="Mß╗ƒ chi tiß║┐t ─æ╞ín ß╗ƒ tab mß╗¢i"
                                        className="font-medium text-[#1a5a96] underline cursor-pointer">
                                        {r.maDon}
                                      </span>
                                      <div className="text-[#333] leading-snug mt-0.5">{r.nguoiGui}</div>
                                      <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{r.diaChi}</div>
                                      <div className="text-[11px] text-[#666] mt-0.5 whitespace-nowrap">Ng├áy nhß║¡n: {r.ngayNhan}</div>
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      <div className="space-y-[2px] leading-snug">
                                        <div><span className="text-[#555]">Sß╗æ BA/Q─É: </span><span className="font-medium">{r.soBA || "ΓÇö"}</span></div>
                                        <div><span className="text-[#555]">Ng├áy BA/Q─É: </span><span>{r.ngayBA || "ΓÇö"}</span></div>
                                        <div><span className="text-[#555]">H├¼nh thß╗⌐c: </span><span>{r.hinhThuc || "ΓÇö"}</span></div>
                                        <div><span className="text-[#555]">Thß╗º tß╗Ñc giß║úi quyß║┐t: </span><span>{r.thuTuc || "ΓÇö"}</span></div>
                                      </div>
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      <div className="text-[#333]">{r.nguoiNhap}</div>
                                      <div className="text-[11px] text-[#666]">{r.ngayNhap}</div>
                                    </td>
                                    <td className="border border-[#ddd] px-3 py-2">
                                      {r.trangThai ? (
                                        <div className="flex flex-col items-start gap-1.5">
                                          <span className="text-[11px] font-semibold text-[#333] whitespace-nowrap">
                                            {r.trangThai}
                                          </span>
                                          {/* Thß╗Ñ l├╜ mß╗¢i: k├¿m Sß╗æ thß╗Ñ l├╜/Ng├áy thß╗Ñ l├╜; nß║┐u ─æ╞ín ─æ├ú
                                              chuyß╗ân sang vß╗Ñ chuy├¬n m├┤n, n├¬u th├¬m trß║íng th├íi vß╗Ñ
                                              (1 trong 4 loß║íi) ΓÇö hß╗ô s╞í kh├┤ng c├▓n nß║▒m ß╗ƒ kh├óu thß╗Ñ l├╜
                                              nß╗»a n├¬n phß║úi n├│i r├╡ n├│ ─æang ß╗ƒ ─æ├óu. */}
                                          {r.trangThai === "Thß╗Ñ l├╜ mß╗¢i" && (
                                            <div className="flex flex-col items-start gap-1 mt-1">
                                              {donTrungKey === `${r.id}-trung` ? (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1a7a45]">
                                                  <Check size={9} /> tr├╣ng vß╗¢i ─æ╞ín {r.maDon}
                                                </span>
                                              ) : (
                                                <button type="button" onClick={() => chonLamDonTrung(r, `${r.id}-trung`)}
                                                  title="Lß║Ñy ─æ╞ín n├áy l├ám ─æ╞ín tr├╣ng"
                                                  className="px-1.5 py-[1px] rounded-sm border border-[#8b1a1a] text-[#8b1a1a] text-[9px] font-semibold hover:bg-[#fdecea] transition-colors">
                                                  Chß╗ìn l├ám ─æ╞ín tr├╣ng
                                                </button>
                                              )}
                                              {(r.stl || r.ngayThuLy || (r.daChuyenVu && r.trangThaiVu)) && (
                                                <div className="text-left w-[218px] space-y-[2px] leading-snug mt-1">
                                                  {r.stl && <div><span className="text-[#888]">Sß╗æ thß╗Ñ l├╜: </span><span className="text-[#333]">{r.stl}</span></div>}
                                                  {r.ngayThuLy && <div><span className="text-[#888]">Ng├áy thß╗Ñ l├╜: </span><span className="text-[#333]">{r.ngayThuLy}</span></div>}
                                                  {r.daChuyenVu && r.trangThaiVu && (
                                                    <div><span className="text-[#888]">Trß║íng th├íi vß╗Ñ: </span><span className="font-medium text-[#333]">{r.trangThaiVu}</span></div>
                                                  )}
                                                  {r.daChuyenVu && r.thamPhan && (
                                                    <div><span className="text-[#888]">Thß║⌐m ph├ín: </span><span className="font-medium text-[#333]">{r.thamPhan}</span></div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          {/* C├íc lß║ºn YCBS ΓÇö gß╗Öp hai lß║ºn v├áo mß╗Öt v├▓ng lß║╖p, mß╗ùi lß║ºn
                                              g├│i trong 2 d├▓ng: "YCBS n ┬╖ sß╗æ ┬╖ kß║┐t quß║ú" v├á ├╜ kiß║┐n
                                              l├únh ─æß║ío trong ─æ╞ín. Bß╗Å khung nß╗ün, chß╗ë c├▓n vß║ích ─æß╗Å
                                              mß║únh b├¬n tr├íi. */}
                                          {r.trangThai === "Ch╞░a ─æß╗º ─æiß╗üu kiß╗çn" && (() => {
                                            const ycbss = [
                                              { i: 1, so: r.ycbsSo, lyDo: r.ycbsLyDo },
                                              { i: 2, so: r.ycbsSo2, lyDo: r.ycbsLyDo2 },
                                            ].filter(x => x.so || x.lyDo);
                                            
                                            const bsList = [
                                              { ma: r.ycbsDonBoSung, loai: r.ycbsDonBoSungLoai, ngay: r.ycbsDonBoSungNgay, ghiChu: r.ycbsDonBoSungGhiChu },
                                              { ma: r.ycbsDonBoSung2, loai: r.ycbsDonBoSung2Loai, ngay: r.ycbsDonBoSung2Ngay, ghiChu: r.ycbsDonBoSung2GhiChu },
                                              { ma: r.boSungKhongYcbsMa, loai: r.boSungKhongYcbsLoai, ngay: r.boSungKhongYcbsNgay, ghiChu: r.boSungKhongYcbsGhiChu }
                                            ].filter(x => x.ma);
                                            
                                            const standaloneDonChon = selectedYcbsKey === `${r.id}-alone`;

                                            return (
                                              <div className="text-left w-[218px] mt-1 space-y-2 border-l-2 border-[#f3c0bb] pl-2">
                                                {/* Danh s├ích YCBS (chß╗ë hiß╗çn Sß╗æ v├á L├╜ do, kh├┤ng gß║»n n├║t chß╗ìn BS) */}
                                                {ycbss.length > 0 && (
                                                  <div className="space-y-1.5">
                                                    {ycbss.map(l => (
                                                      <div key={l.i} className="leading-snug">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                          <span className="px-1 rounded-sm bg-[#fdecea] text-[#c0392b] text-[9px] font-bold">
                                                            YCBS {l.i}
                                                          </span>
                                                          {l.so && <span className="font-mono text-[10px] text-[#333]" title="Sß╗æ, ng├áy TB">{l.so}</span>}
                                                        </div>
                                                        {l.lyDo && (
                                                          <div title={l.lyDo} className="text-[10px] text-[#777] mt-[2px] line-clamp-2">
                                                            <span className="text-[#888]">L├╜ do: </span>{l.lyDo}
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                
                                                {/* Danh s├ích ─É╞ín/t├ái liß╗çu bß╗ò sung (liß╗çt k├¬ ─æß╗Öc lß║¡p) */}
                                                {bsList.length > 0 && (
                                                  <div className="space-y-1">
                                                    {bsList.map((bs, idx) => (
                                                      <div key={idx} className="w-full bg-[#f9f9f9] border border-[#eee] p-1.5 rounded-sm">
                                                        <div className="text-[10px] text-[#1a7a45] mb-0.5">
                                                          ΓåÆ <span className="font-semibold">{bs.loai || "─É╞ín bß╗ò sung"}</span>: <span className="underline font-medium">{bs.ma}</span>
                                                        </div>
                                                        {bs.ngay && <div className="text-[9.5px] text-[#555]"><span className="text-[#888]">Ng├áy BS:</span> {bs.ngay}</div>}
                                                        {bs.ghiChu && <div className="text-[9.5px] text-[#555] italic line-clamp-2" title={bs.ghiChu}><span className="text-[#888] not-italic">Ghi ch├║:</span> {bs.ghiChu}</div>}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}

                                                {/* N├║t h├ánh ─æß╗Öng Chß╗ìn l├ám ─æ╞ín BS (chß╗ë 1 n├║t cho cß║ú ─æ╞ín) */}
                                                <div className="pt-0.5">
                                                  {standaloneDonChon ? (
                                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1a7a45]">
                                                      <Check size={9} /> ─æ├ú li├¬n kß║┐t
                                                    </span>
                                                  ) : (
                                                    <button type="button" onClick={() => chonLamDonBoSung(r, `${r.id}-alone`)}
                                                      title="Chß╗ìn l├ám ─æ╞ín bß╗ò sung cho ─æ╞ín n├áy"
                                                      className="px-1.5 py-[1px] rounded-sm border border-[#8b1a1a] text-[#8b1a1a] text-[9px] font-semibold hover:bg-[#fdecea] transition-colors">
                                                      Chß╗ìn l├ám ─æ╞ín BS
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      ) : (
                                        <span className="text-[#999]">ΓÇö</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* 3. Th├┤ng tin ─æ╞ín (chß╗ë CV chuyß╗ân ─æ╞ín: hiß╗çn th├¬m khß╗æi Th├┤ng tin ─æ╞ín tr╞░ß╗¢c Th├┤ng tin c├┤ng v─ân) */}
                  {isCVKemDon && (
                    <Section title="3. Th├┤ng tin ─æ╞ín">
                      <DonFields don={donChiTietTabMoi} dienTuDon={donGocBoSung} />
                    </Section>
                  )}

                  {/* 3/4. Th├┤ng tin ─æ╞ín / c├┤ng v─ân / kh├íng nghß╗ï */}
                  <Section
                    title={isKhangNghi ? "3. Quyß║┐t ─æß╗ïnh kh├íng nghß╗ï" : isDon ? "3. Th├┤ng tin ─æ╞ín" : `${3 + secOffset}. Th├┤ng tin c├┤ng v─ân`}
                    extra={!isDon && !isCVKienNghi ? <BtnAdd onClick={() => setShowPopup(true)}><Plus size={12} /> Th├¬m mß╗¢i</BtnAdd> : undefined}
                  >
                    <div className="space-y-4">
                      {isKhangNghi ? (
                        /* ΓöÇΓöÇ Hß╗ô s╞í kh├íng nghß╗ï G─ÉT,TT: th├┤ng tin Q─ÉKN ΓöÇΓöÇ */
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold text-[#1d2e4f]">Th├┤ng tin Quyß║┐t ─æß╗ïnh kh├íng nghß╗ï</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div>
                              <Lbl req>Sß╗æ Q─ÉKN</Lbl>
                              <Inp placeholder="Nhß║¡p sß╗æ quyß║┐t ─æß╗ïnh kh├íng nghß╗ï" />
                            </div>
                            <div>
                              <Lbl req>Ng├áy Q─ÉKN</Lbl>
                              <Inp type="date" />
                            </div>
                            <div>
                              <Lbl>Ng╞░ß╗¥i kh├íng nghß╗ï</Lbl>
                              <Inp placeholder="Nhß║¡p t├¬n ng╞░ß╗¥i kh├íng nghß╗ï" />
                            </div>
                            <div>
                              <Lbl req>Chß╗ìn ng╞░ß╗¥i kh├íng nghß╗ï</Lbl>
                              <Sel>
                                <option value="">-- Chß╗ìn --</option>
                                <option>Ch├ính ├ín TAND Tß╗æi cao</option>
                                <option>Viß╗çn tr╞░ß╗ƒng VKSND Tß╗æi cao</option>
                                <option>Ch├ính ├ín TAND Cß║Ñp cao</option>
                                <option>Viß╗çn tr╞░ß╗ƒng VKSND Cß║Ñp cao</option>
                              </Sel>
                            </div>
                            <div>
                              <Lbl req>Ng├áy nhß║¡n Q─ÉKN</Lbl>
                              <Inp type="date" />
                            </div>
                          </div>
                          <div>
                            <Lbl req>Nß╗Öi dung ─æ╞ín</Lbl>
                            <textarea rows={4} placeholder="Nhß║¡p nß╗Öi dung ─æ╞ín..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                          </div>
                        </div>
                      ) : isDon ? (
                        /* ΓöÇΓöÇ H├¼nh thß╗⌐c ─É╞ín: hiß╗çn 3 tr╞░ß╗¥ng + bß║úng ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín ΓöÇΓöÇ */
                        <DonFields don={donChiTietTabMoi} dienTuDon={donGocBoSung} />
                      ) : (
                        /* ΓöÇΓöÇ H├¼nh thß╗⌐c C├┤ng v─ân ΓöÇΓöÇ */
                        <>
                          {/* CV kiß║┐n nghß╗ï: nhß║¡p thß║│ng mß╗Öt c├┤ng v─ân tr├¬n form.
                              C├íc loß║íi c├▓n lß║íi giß╗» bß║úng danh s├ích + popup v├¼ c├│ thß╗â
                              k├¿m nhiß╗üu c├┤ng v─ân. */}
                          {isCVKienNghi ? (
                            <PopupCongVan
                              nhung
                              banDau={congVans[0]}
                              onClose={() => {}}
                              onSave={(cv) => setCongVans([cv])}
                            />
                          ) : <>
                          <Tbl
                            headers={["STT", "Loß║íi c├┤ng v─ân", "Sß╗æ c├┤ng v─ân", "Ng├áy c├┤ng v─ân", "C├┤ng v─ân ch├¡nh", "─É╞ín vß╗ï gß╗¡i", "Thao t├íc"]}
                            emptyMsg="Ch╞░a c├│ c├┤ng v─ân"
                          >
                            {congVans.length > 0 ? congVans.map((cv, i) => (
                              <tr key={cv.id} className={i % 2 === 1 ? "bg-[#fafafa]" : ""}>
                                <Td center>{i + 1}</Td>
                                <Td>{cv.loai}</Td>
                                <Td>{cv.so}</Td>
                                <Td>{cv.ngay}</Td>
                                <Td center>
                                  <input
                                    type="checkbox"
                                    checked={cv.congVanChinh ?? false}
                                    onChange={() => {
                                      setCongVans(prev => prev.map(item => ({
                                        ...item,
                                        congVanChinh: item.id === cv.id
                                      })));
                                    }}
                                    className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                  />
                                </Td>
                                <Td>{cv.donVi}</Td>
                                <Td center>
                                  <div className="flex items-center justify-center gap-1">
                                    <ActionBtn icon={<Edit2 size={14} />} color="blue" title="Sß╗¡a"
                                      onClick={() => { setSuaCongVanId(cv.id); setShowPopup(true); }} />
                                    <ActionBtn icon={<Trash2 size={14} />} color="red" onClick={() => delCV(cv.id)} title="X├│a" />
                                  </div>
                                </Td>
                              </tr>
                            )) : undefined}
                          </Tbl>
                          {congVans.length === 0 && (
                            <p className="text-center text-[#999] italic text-[13px] py-2">
                              Ch╞░a c├│ c├┤ng v─ân. Nhß║Ñn "Th├¬m mß╗¢i" ─æß╗â th├¬m.
                            </p>
                          )}
                          </>}

                          {/* ├¥ kiß║┐n chß╗ë ─æß║ío d├╣ng chung cho mß╗ìi loß║íi c├┤ng v─ân */}
                          {!isCVKemDon && <>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Lbl>├¥ kiß║┐n chß╗ë ─æß║ío</Lbl>
                              </div>
                              <Sel value={yKienChiDaoCV} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYKienChiDaoCV(e.target.value)}>
                                <option>Kh├┤ng</option>
                                {NGUOI_CHI_DAO.map(n => <option key={n}>{n}</option>)}
                              </Sel>
                            </div>
                            {yKienChiDaoCV !== "Kh├┤ng" && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Lbl req>Nß╗Öi dung chß╗ë ─æß║ío</Lbl>
                                  <a href="#" onClick={e => e.preventDefault()} className="text-[12px] text-[#1a73e8] hover:underline">[Gß╗úi ├╜]</a>
                                </div>
                                <textarea rows={3} placeholder="Nhß║¡p nß╗Öi dung chß╗ë ─æß║ío" className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                              </div>
                            )}
                          </>}
                        </>
                      )}
                    </div>
                  </Section>


                  {/* 4. ─É╞ín thß╗Ñ l├╜ k├¿m */}
                  {hinhThuc !== "CV kh├íc" && (
                    <Section
                      title={`${4 + secOffset}. ─É╞ín thß╗Ñ l├╜ k├¿m`}
                      extra={<BtnAdd onClick={() => setShowThemDonKem(true)}><Plus size={12} /> Th├¬m mß╗¢i</BtnAdd>}
                    >
                      <Tbl headers={["STT", "Sß╗æ ─æ╞ín", "Ng├áy tiß║┐p nhß║¡n", "Ng├áy ghi tr├¬n ─æ╞ín", "Loß║íi v─ân bß║ún", "Thao t├íc"]}
                        emptyMsg="Ch╞░a c├│ ─æ╞ín thß╗Ñ l├╜ k├¿m">
                        {donThuLyKem.length > 0 ? donThuLyKem.map((dk, i) => (
                          <tr key={dk.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                            <Td center>{i + 1}</Td>
                            <Td><span className="font-medium text-[#1a5a96]">{dk.soHieu || "ΓÇö ch╞░a c├│ sß╗æ ΓÇö"}</span></Td>
                            <Td>{dk.ngayNhan}</Td>
                            <Td>{dk.ngayGhi || "ΓÇö"}</Td>
                            <Td>
                              <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium border ${dk.laCongVan
                                ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                                : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"}`}>
                                {dk.laCongVan ? "C├┤ng v─ân" : "─É╞ín"}
                              </span>
                            </Td>
                            <Td center>
                              <div className="flex items-center justify-center gap-0.5">
                                <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sß╗¡a"
                                  onClick={() => { setSuaDonKemId(dk.id); setShowThemDonKem(true); }} />
                                <ActionBtn icon={<Trash2 size={14} />} color="red" title="X├│a"
                                  onClick={() => setDonThuLyKem(p => p.filter(x => x.id !== dk.id))} />
                              </div>
                            </Td>
                          </tr>
                        )) : undefined}
                      </Tbl>
                    </Section>
                  )}

                  {/* 5. Xß╗¡ l├╜ ─æ╞ín / c├┤ng v─ân */}
                  <Section title={`${5 + secOffset}. ${["CV kh├íc", "CV kiß║┐n nghß╗ï G─ÉT-TT", "CV chuyß╗ân kiß║┐n nghß╗ï G─ÉT-TT", "CV chuyß╗ân ─æ╞ín"].includes(hinhThuc) ? "Xß╗¡ l├╜ c├┤ng v─ân" : "Xß╗¡ l├╜ ─æ╞ín"}`}
                    extra={
                      <button type="button" onClick={() => setShowSuaKetQuaXuLy(true)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-[#f5f5f5] text-[#333] text-[12px] font-medium px-3 py-[3px] rounded-[3px] border border-[#ccc] transition-colors whitespace-nowrap">
                        <PenLine size={12} className="text-[#1a5a96]" /> Sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín
                      </button>
                    }
                  >
                    {/* Gß╗Öp to├án bß╗Ö checkbox cß╗ºa mß╗Ñc Xß╗¡ l├╜ ─æ╞ín vß╗ü mß╗Öt chß╗ù.
                      Xin ho├ún thi h├ánh ├ín: mß╗ìi loß║íi ├ín / h├¼nh thß╗⌐c ─æ╞ín, trß╗½ ─É╞ín kh├íc v├á CV kh├íc.
                      ├ün tß╗¡ h├¼nh v├á ├üp dß╗Ñng biß╗çn ph├íp XLCH: chß╗ë vß╗¢i ├ín H├¼nh sß╗▒. */}
                    <div className="flex items-center gap-6 flex-wrap mb-2">
                      {!["─É╞ín kh├íc", "CV kh├íc"].includes(hinhThuc) && (
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={xinHoanThiHanhAn} onChange={e => setXinHoanThiHanhAn(e.target.checked)} />
                          Xin ho├ún thi h├ánh ├ín
                        </label>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                        <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                          checked={coNoiDungToCao} onChange={e => setCoNoiDungToCao(e.target.checked)} />
                        C├│ nß╗Öi dung tß╗æ c├ío
                      </label>
                      {loaiAnForm === "H├¼nh sß╗▒" && (
                        <>
                          <label className={`flex items-center gap-2 cursor-pointer text-[13px] whitespace-nowrap ${xulychuynhuong ? "text-[#aaa] cursor-not-allowed opacity-60" : "text-[#333]"}`}>
                            <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                              disabled={xulychuynhuong}
                              checked={!xulychuynhuong && anTuHinh}
                              onChange={e => { setAnTuHinh(e.target.checked); if (!e.target.checked) { setXinGiamAnTuHinh(false); setKeuOanAnTuHinh(false); setXinThiHanhAnSom(false); } }} />
                            ├ün tß╗¡ h├¼nh
                          </label>
                        </>
                      )}
                    </div>

                    {/* T├╣y chß╗ìn con cß╗ºa ├ün tß╗¡ h├¼nh */}
                    {loaiAnForm === "H├¼nh sß╗▒" && !xulychuynhuong && anTuHinh && (
                      <div className="flex items-center gap-5 flex-wrap mb-3 pl-6 py-2 bg-[#fffbeb] border border-dashed border-[#fcdad5] rounded-[4px]">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#b45309] font-medium whitespace-nowrap">
                          <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            checked={keuOanAnTuHinh} onChange={e => setKeuOanAnTuHinh(e.target.checked)} />
                          K├¬u oan ├ín tß╗¡ h├¼nh
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                          <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                            checked={xinGiamAnTuHinh} onChange={e => setXinGiamAnTuHinh(e.target.checked)} />
                          Xin ├ón giß║úm ├ín tß╗¡ h├¼nh
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                          <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                            checked={xinThiHanhAnSom} onChange={e => setXinThiHanhAnSom(e.target.checked)} />
                          Xin thi h├ánh ├ín sß╗¢m
                        </label>
                      </div>
                    )}

                    {coNoiDungToCao && (
                      <div className="mb-3">
                        <Lbl req>Nß╗Öi dung tß╗æ c├ío</Lbl>
                        <textarea rows={3} placeholder="Nhß║¡p nß╗Öi dung tß╗æ c├ío..."
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {/* N╞íi chuyß╗ân ─æß║┐n ΓÇö gß╗Öp thay cho "Kß║┐t quß║ú xß╗¡ l├╜" tr╞░ß╗¢c ─æ├óy, k├¿m
                          lu├┤n 2 gi├í trß╗ï Trß║ú lß║íi ─æ╞ín / L╞░u theo d├╡i v├áo chung mß╗Öt ├┤ chß╗ìn.
                          Lß║ºn ─æß║ºu nhß║¡p (ch╞░a c├│ log hoß║╖c mß╗¢i c├│ ─æ├║ng 1 lß║ºn) vß║½n hiß╗çn c├íc
                          tr╞░ß╗¥ng n├áy (─æ├ú ─æiß╗ün sß║╡n gi├í trß╗ï ─æ├ú l╞░u) ΓÇö bß║úng Lß╗ïch sß╗¡ chß╗ë thay
                          thß║┐ chß╗ù n├áy tß╗½ lß║ºn sß╗¡a thß╗⌐ 2 trß╗ƒ ─æi. */}
                      {(!editingRow?.processingHistory || editingRow.processingHistory.length <= 1) && (
                        <>
                          <div>
                            <Lbl>N╞íi chuyß╗ân ─æß║┐n</Lbl>
                        <Sel value={noiChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => {
                          setNoiChuyenDen(e.target.value);
                          setDonViChuyenDen("");
                          setCaNhanChuyenDen("");
                        }}>
                          <option value="">-- Chß╗ìn --</option>
                          <option>Nß╗Öi bß╗Ö</option>
                          <option>T├▓a kh├íc</option>
                          <option>Ngo├ái t├▓a ├ín</option>
                          <option>Trß║ú lß║íi ─æ╞ín</option>
                          <option>L╞░u theo d├╡i</option>
                        </Sel>
                      </div>

                      {/* Nß║┐u chß╗ìn Trß║ú lß║íi ─æ╞ín */}
                      {noiChuyenDen === "Trß║ú lß║íi ─æ╞ín" && (
                        <>
                          <div>
                            <Lbl req>L├╜ do trß║ú lß║íi</Lbl>
                            <Sel value={lyDoTraLai} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoTraLai(e.target.value)}>
                              <option value="">-- Chß╗ìn l├╜ do --</option>
                              <option>─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn xß╗¡ l├╜</option>
                              <option>Kh├┤ng thuß╗Öc thß║⌐m quyß╗ün giß║úi quyß║┐t</option>
                              <option>─É├ú hß║┐t thß╗¥i hß║ín giß║úi quyß║┐t</option>
                              <option>L├╜ do kh├íc</option>
                            </Sel>
                          </div>
                          <div>
                            <Lbl>Y├¬u cß║ºu</Lbl>
                            <Inp placeholder="Nhß║¡p y├¬u cß║ºu trß║ú lß║íi ─æ╞ín..." value={yeuCauTraLai} disabled={chiXemKetQuaLanDau}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYeuCauTraLai(e.target.value)} />
                          </div>
                        </>
                      )}

                      {/* Nß║┐u chß╗ìn L╞░u theo d├╡i */}
                      {noiChuyenDen === "L╞░u theo d├╡i" && (
                        <div className="col-span-2">
                          <Lbl req>L├╜ do l╞░u theo d├╡i</Lbl>
                          <textarea rows={2} placeholder="Nhß║¡p l├╜ do l╞░u theo d├╡i ─æ╞ín th╞░..."
                            value={lyDoLuuTheoDoi} disabled={chiXemKetQuaLanDau} onChange={e => setLyDoLuuTheoDoi(e.target.value)}
                            className="w-full border border-[#ccc] rounded-[3px] px-2.5 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none disabled:bg-[#f5f5f5] disabled:text-[#888]" />
                        </div>
                      )}

                      {/* Sub-logic cß╗ºa Nß╗Öi bß╗Ö */}
                      {noiChuyenDen === "Nß╗Öi bß╗Ö" && (
                        <>
                          <div>
                            <Lbl req>─É╞ín vß╗ï chuyß╗ân ─æß║┐n</Lbl>
                            <Sel value={donViChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => {
                              setDonViChuyenDen(e.target.value);
                              setCaNhanChuyenDen("");
                            }}>
                              <option value="">-- Chß╗ìn ─æ╞ín vß╗ï --</option>
                              <option>Vß╗Ñ Ph├íp chß║┐ v├á Quß║ún l├╜ khoa hß╗ìc</option>
                              <option>Hß╗Öi ─æß╗ông Thß║⌐m ph├ín TANDTC</option>
                              <option>Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü h├¼nh sß╗▒</option>
                              <option>Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü kinh doanh, th╞░╞íng mß║íi, ph├í sß║ún, lao ─æß╗Öng, gia ─æ├¼nh v├á ng╞░ß╗¥i ch╞░a th├ánh ni├¬n</option>
                              <option>Vß╗Ñ Thi ─æua - Khen th╞░ß╗ƒng</option>
                              <option>Vß╗Ñ Tß╗ò chß╗⌐c - C├ín bß╗Ö</option>
                              <option>Thanh tra T├▓a ├ín nh├ón d├ón tß╗æi cao</option>
                              <option>Vß╗Ñ Gi├ím ─æß╗æc, kiß╗âm tra vß╗ü d├ón sß╗▒</option>
                              <option>Vß╗Ñ Gi├ím ─æß╗æc, kiß╗âm tra vß╗ü h├ánh ch├¡nh</option>
                              <option>Vß╗Ñ Tß╗òng hß╗úp</option>
                              <option>Vß╗Ñ Hß╗úp t├íc quß╗æc tß║┐</option>
                              <option>Vß╗Ñ C├┤ng t├íc ph├¡a Nam</option>
                            </Sel>
                          </div>
                          {donViChuyenDen && (
                            <div>
                              <Lbl>Chuyß╗ân ─æß║┐n c├í nh├ón</Lbl>
                              <Sel value={caNhanChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => setCaNhanChuyenDen(e.target.value)}>
                                <option value="">-- Chß╗ìn c├í nh├ón --</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng - {donViChuyenDen}</option>
                                <option>Ph├│ vß╗Ñ tr╞░ß╗ƒng - {donViChuyenDen}</option>
                                <option>Thß║⌐m tra vi├¬n - {donViChuyenDen}</option>
                              </Sel>
                            </div>
                          )}
                        </>
                      )}

                      {/* Sub-logic cß╗ºa T├▓a kh├íc */}
                      {noiChuyenDen === "T├▓a kh├íc" && (
                        <>
                          <div className="relative">
                            <Lbl req>─É╞ín vß╗ï chuyß╗ân ─æß║┐n</Lbl>
                            <Inp
                              placeholder="Nhß║¡p hoß║╖c t├¼m kiß║┐m t├▓a ├ín..."
                              value={donViChuyenDen}
                              disabled={chiXemKetQuaLanDau}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDonViChuyenDen(e.target.value); setShowDonViChuyenDenDD(true); }}
                              onFocus={() => setShowDonViChuyenDenDD(true)}
                              onBlur={() => setTimeout(() => setShowDonViChuyenDenDD(false), 180)}
                            />
                            {showDonViChuyenDenDD && (() => {
                              const goiY = TOA_KHAC_OPTIONS.filter(t => contains(t, donViChuyenDen));
                              if (!goiY.length) return null;
                              return (
                                <div className="absolute z-50 top-full left-0 right-0 bg-white border border-[#ddd] rounded-[3px] shadow-lg mt-0.5 max-h-[220px] overflow-y-auto">
                                  {goiY.map(t => (
                                    <button key={t} type="button"
                                      onMouseDown={() => { setDonViChuyenDen(t); setShowDonViChuyenDenDD(false); }}
                                      className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#f0f7ff] border-b border-[#f0f0f0] last:border-0">
                                      {t}
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                          <div>
                            <Lbl req>Chuyß╗ân ─æß║┐n</Lbl>
                            <div className="flex items-center gap-4 h-[30px]">
                              {["T├▓a ├ín", "Ch├ính ├ín"].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                  <input type="radio" name="chanhAnHoacToaAnOpt" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                                    checked={chanhAnHoacToaAn === opt}
                                    disabled={chiXemKetQuaLanDau}
                                    onChange={() => setChanhAnHoacToaAn(opt)} />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Sub-logic cß╗ºa Ngo├ái t├▓a ├ín */}
                      {noiChuyenDen === "Ngo├ái t├▓a ├ín" && (
                        <div className="col-span-2">
                          <Lbl req>─É╞ín vß╗ï chuyß╗ân ─æß║┐n (C╞í quan/─É╞ín vß╗ï ngo├ái t├▓a ├ín)</Lbl>
                          <Inp
                            value={donViChuyenDen}
                            disabled={chiXemKetQuaLanDau}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonViChuyenDen(e.target.value)}
                            placeholder="Nhß║¡p t├¬n c╞í quan/─æ╞ín vß╗ï ngo├ái t├▓a..."
                          />
                        </div>
                      )}

                      {noiChuyenDen === "Nß╗Öi bß╗Ö" && hinhThuc !== "CV kh├íc" && hinhThuc !== "─É╞ín kh├íc" && (
                        <>
                          <div>
                            <Lbl req>Trß║íng th├íi ─æ╞ín</Lbl>
                            <Sel value={trangThaiDon} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrangThaiDon(e.target.value)}>
                              <option value="">-- Chß╗ìn --</option>
                              <option>─É╞ín ─æß╗º ─æiß╗üu kiß╗çn</option>
                              <option>─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn</option>
                            </Sel>
                          </div>
                          {hasGiamDocThamResult ? (
                            <div>
                              <Lbl req>Chß╗ìn vß╗Ñ tr╞░ß╗ƒng</Lbl>
                              <Sel value={vuTruong} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVuTruong(e.target.value)}>
                                <option value="">-- Chß╗ìn vß╗Ñ tr╞░ß╗ƒng --</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng Vß╗Ñ Ph├íp chß║┐ v├á Quß║ún l├╜ khoa hß╗ìc</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü h├¼nh sß╗▒</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü d├ón sß╗▒</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü h├ánh ch├¡nh</option>
                                <option>Vß╗Ñ tr╞░ß╗ƒng Vß╗Ñ Gi├ím ─æß╗æc kiß╗âm tra vß╗ü kinh doanh, th╞░╞íng mß║íi, ph├í sß║ún, lao ─æß╗Öng, gia ─æ├¼nh v├á ng╞░ß╗¥i ch╞░a th├ánh ni├¬n</option>
                              </Sel>
                            </div>
                          ) : trangThaiDon !== "─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn" ? (
                            <div>
                              <Lbl req>Thß╗Ñ l├╜ ─æ╞ín</Lbl>
                              <Sel value={thuLyDon} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setThuLyDon(e.target.value)}>
                                <option value="">-- Chß╗ìn --</option>
                                <option>Thß╗Ñ l├╜ mß╗¢i</option>
                                <option>─É├ú thß╗Ñ l├╜</option>
                                {/* Chß╗ë ─æß╗òi nh├ún ß╗ƒ nh├ính Kß║┐t quß║ú xß╗¡ l├╜ = "Chuyß╗ân ─æ╞ín" ΓÇö
                                    field "Thß╗Ñ l├╜ ─æ╞ín" chß╗ë render cho nh├ính n├áy. */}
                                <option>Xin ├╜ kiß║┐n l├únh ─æß║ío</option>
                                <option>Kh├┤ng</option>
                              </Sel>
                            </div>
                          ) : (
                            <div>
                              <Lbl req>L├╜ do kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn</Lbl>
                              <Sel value={lyDoKhongDu} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoKhongDu(e.target.value)}>
                                <option value="">-- Chß╗ìn l├╜ do --</option>
                                <option>Thiß║┐u Bß║ún ├ín/quyß║┐t ─æß╗ïnh c├│ hiß╗çu lß╗▒c ph├íp luß║¡t</option>
                                <option>Thiß║┐u th├┤ng tin c─ân c╞░ß╗¢c c├┤ng d├ón</option>
                                <option>Viß║┐t lß║íi ─æ╞ín</option>
                                <option>L├╜ do kh├íc</option>
                              </Sel>
                            </div>
                          )}
                          {!hasGiamDocThamResult && trangThaiDon === "─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn" && lyDoKhongDu === "L├╜ do kh├íc" && (
                            <div className="col-span-2">
                              <Lbl req>L├╜ do kh├íc</Lbl>
                              <textarea rows={2} placeholder="Nhß║¡p l├╜ do kh├íc..." disabled={chiXemKetQuaLanDau} className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none disabled:bg-[#f5f5f5] disabled:text-[#888]" />
                            </div>
                          )}
                          {!hasGiamDocThamResult && trangThaiDon === "─É╞ín ─æß╗º ─æiß╗üu kiß╗çn" && thuLyDon === "Thß╗Ñ l├╜ mß╗¢i" && (
                            <div>
                              <Lbl req>Sß╗æ thß╗Ñ l├╜</Lbl>
                              <Inp placeholder="Nhß║¡p sß╗æ thß╗Ñ l├╜" disabled={chiXemKetQuaLanDau} />
                            </div>
                          )}
                          {!hasGiamDocThamResult && trangThaiDon === "─É╞ín ─æß╗º ─æiß╗üu kiß╗çn" && thuLyDon === "Thß╗Ñ l├╜ mß╗¢i" && (
                            <div>
                              <Lbl req>Ng├áy thß╗Ñ l├╜</Lbl>
                              <Inp type="date" disabled={chiXemKetQuaLanDau} />
                            </div>
                          )}
                        </>
                      )}
                      {hinhThuc !== "CV kh├íc" && hinhThuc !== "─É╞ín kh├íc" && (
                        <div className="col-span-2">
                          <Lbl>Thß║⌐m quyß╗ün ─æ╞ín</Lbl>
                          <div className="flex items-center gap-5 h-[30px]">
                            {[["bac3", "Thß║⌐m ph├ín bß║¡c 3"], ["toicao", "Thß║⌐m ph├ín tß╗æi cao"]].map(([val, label]) => (
                              <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                <input type="radio" name="thamQuyenDon" value={val} disabled={chiXemKetQuaLanDau} className="accent-[#8b1a1a]" />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                          <div className="col-span-2 flex items-end">
                            {/* N├║t Danh s├ích thß║⌐m ph├ín ─æ├ú ─æ╞░ß╗úc chuyß╗ân sang m├án h├¼nh Ph├ón c├┤ng thß║⌐m ph├ín */}
                          </div>
                        </>
                      )}

                      {/* Lß╗ïch sß╗¡ ΓÇö chß╗ë hiß╗çn tß╗½ lß║ºn sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ thß╗⌐ 2 trß╗ƒ ─æi, khi ─æ├ú
                          c├│ tß╗½ 2 lß║ºn log trß╗ƒ l├¬n (log cß║ú lß║ºn ─æß║ºu lß║½n c├íc lß║ºn sß╗¡a sau). */}
                      {editingRow?.processingHistory && editingRow.processingHistory.length > 1 && (
                        <div className="col-span-2 mt-1">
                          <Lbl>Lß╗ïch sß╗¡</Lbl>
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f5f5f5]">
                                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Nß╗Öi dung</th>
                                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[180px]">Thao t├íc</th>
                                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[140px]">Ng╞░ß╗¥i tß║ío</th>
                                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Ng├áy chuyß╗ân ─æ╞ín</th>
                                <th className="border border-[#ddd] px-3 py-[6px] text-center font-semibold text-[#333] w-[80px]">Chi tiß║┐t</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editingRow.processingHistory.map((item, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                  <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.note || item.step}</td>
                                  <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.step}</td>
                                  <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.actor}</td>
                                  <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.date}</td>
                                  <td className="border border-[#ddd] px-3 py-[6px] text-center">
                                    <button type="button" title="Xem chi tiß║┐t"
                                      onClick={() => setXemChiTietHistory({
                                        ...(item.rawData ?? {}),
                                        date: item.date, actor: item.actor, step: item.step, note: item.note,
                                      })}
                                      className="text-[#1a5a96] hover:underline font-medium text-[12px]">
                                      Xem chi tiß║┐t
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </Section>

                  {/* Th├┤ng tin c├┤ng v─ân ph├║c ─æ├íp */}
                  {hinhThuc === "CV kh├íc" && coCongVanPhucDap && (
                    <Section title="6. Th├┤ng tin c├┤ng v─ân ph├║c ─æ├íp">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Lbl req>Sß╗æ c├┤ng v─ân ph├║c ─æ├íp</Lbl>
                          <Inp placeholder="Nhß║¡p sß╗æ c├┤ng v─ân ph├║c ─æ├íp" />
                        </div>
                        <div>
                          <Lbl req>Ng├áy c├┤ng v─ân ph├║c ─æ├íp</Lbl>
                          <Inp type="date" />
                        </div>
                        <div className="col-span-2">
                          <Lbl req>Tr├¡ch yß║┐u</Lbl>
                          <textarea
                            className="w-full min-h-[80px] p-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-y"
                            placeholder="Nhß║¡p tr├¡ch yß║┐u c├┤ng v─ân ph├║c ─æ├íp"
                          />
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* C├íc th├ánh phß║ºn chß╗ë d├ánh cho ─É╞ín */}
                  {hinhThuc !== "CV kh├íc" && (
                    <>
                      {/* 6. Ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng */}
                      {(
                        <Section title={`${6 + secOffset}. Ng╞░ß╗¥i tham gia tß╗æ tß╗Ñng`}>
                          <div className="space-y-4">
                            {/* ─Éiß╗ün tß╗▒ ─æß╗Öng sau khi Tra cß╗⌐u bß║ún ├ín ΓÇö n├¬u r├╡ ─æß╗â c├ín bß╗Ö r├á lß║íi */}
                            {nguoiTuDong && (
                              <div className="flex items-start gap-2 rounded-[4px] bg-[#fffbeb] border border-[#fcd48a] px-3 py-2 text-[12px] text-[#b45309] leading-relaxed">
                                <AlertCircle size={14} className="flex-shrink-0 mt-[2px]" />
                                <span>
                                  Th├┤ng tin d╞░ß╗¢i ─æ├óy lß║Ñy tß╗▒ ─æß╗Öng tß╗½ bß║ún ├ín vß╗½a tra cß╗⌐u. Vui l├▓ng kiß╗âm tra,
                                  sß╗¡a hoß║╖c bß╗ò sung tr╞░ß╗¢c khi l╞░u.
                                </span>
                              </div>
                            )}
                            {loaiAnForm !== "H├¼nh sß╗▒" && <>
                              <div>
                                <Lbl>Quan hß╗ç ph├íp luß║¡t</Lbl>
                                <Inp placeholder="Nhß║¡p quan hß╗ç ph├íp luß║¡t" value={quanHePhapLuat}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuanHePhapLuat(e.target.value)} />
                              </div>

                              {/* Nguy├¬n ─æ╞ín / ng╞░ß╗¥i khß╗ƒi kiß╗çn */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-semibold text-[#444]">Nguy├¬n ─æ╞ín / ng╞░ß╗¥i khß╗ƒi kiß╗çn</span>
                                  <BtnAdd onClick={() => setShowThemNguyenDon(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                                </div>
                                <Tbl headers={["Hß╗ì v├á t├¬n", "N─âm sinh", "─Éß╗ïa chß╗ë", "Thao t├íc"]} emptyMsg="Ch╞░a c├│ th├┤ng tin">
                                  {nguyenDon.length > 0 ? nguyenDon.map((n, i) => (
                                    <HangNguoiThamGia key={n.id} n={n} i={i}
                                      onSua={() => { setSuaNguyenDonId(n.id); setShowThemNguyenDon(true); }}
                                      onXoa={() => setNguyenDon(p => p.filter(x => x.id !== n.id))} />
                                  )) : undefined}
                                </Tbl>
                              </div>

                              {/* Bß╗ï ─æ╞ín / ng╞░ß╗¥i bß╗ï kiß╗çn */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-semibold text-[#444]">Bß╗ï ─æ╞ín / ng╞░ß╗¥i bß╗ï kiß╗çn</span>
                                  <BtnAdd onClick={() => setShowThemBiDon(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                                </div>
                                <Tbl headers={["Hß╗ì v├á t├¬n", "N─âm sinh", "─Éß╗ïa chß╗ë", "Thao t├íc"]} emptyMsg="Ch╞░a c├│ th├┤ng tin">
                                  {biDon.length > 0 ? biDon.map((n, i) => (
                                    <HangNguoiThamGia key={n.id} n={n} i={i}
                                      onSua={() => { setSuaBiDonId(n.id); setShowThemBiDon(true); }}
                                      onXoa={() => setBiDon(p => p.filter(x => x.id !== n.id))} />
                                  )) : undefined}
                                </Tbl>
                              </div>

                              {/* Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-semibold text-[#444]">Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan</span>
                                  <BtnAdd onClick={() => setShowThemNguoiLQ(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                                </div>
                                <Tbl headers={["Hß╗ì v├á t├¬n", "N─âm sinh", "─Éß╗ïa chß╗ë", "Thao t├íc"]} emptyMsg="Ch╞░a c├│ dß╗» liß╗çu">
                                  {nguoiLienQuan.length > 0 ? nguoiLienQuan.map((n, i) => (
                                    <tr key={n.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                      <Td>
                                        <span className="font-medium text-[#1a5a96]">{n.hoTen}</span>
                                        {n.thongKe.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {n.thongKe.map(tk => (
                                              <span key={tk} className="inline-block px-1.5 py-[1px] rounded text-[10px] bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">{tk}</span>
                                            ))}
                                          </div>
                                        )}
                                      </Td>
                                      <Td>{n.namSinh}</Td>
                                      <Td>{n.diaChi}</Td>
                                      <Td center>
                                        <div className="flex items-center justify-center gap-0.5">
                                          <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sß╗¡a"
                                            onClick={() => { setSuaNguoiLQId(n.id); setShowThemNguoiLQ(true); }} />
                                          <ActionBtn icon={<Trash2 size={14} />} color="red" title="X├│a"
                                            onClick={() => setNguoiLienQuan(p => p.filter(x => x.id !== n.id))} />
                                        </div>
                                      </Td>
                                    </tr>
                                  )) : undefined}
                                </Tbl>
                              </div>
                            </>}

                            {/* H├¼nh sß╗▒: Danh s├ích bß╗ï c├ío + Danh s├ích th├┤ng tin khiß║┐u nß║íi */}
                            {loaiAnForm === "H├¼nh sß╗▒" && <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-semibold text-[#444]">Danh s├ích bß╗ï c├ío</span>
                                  <BtnAdd onClick={() => setShowBiCaoPopup(true)}><Plus size={12} /> Th├¬m</BtnAdd>
                                </div>
                                <Tbl
                                  headers={["Hß╗ì v├á t├¬n", "N─âm sinh", "─Éß╗ïa chß╗ë", "Tß╗Öi danh", "Thao t├íc"]}
                                  emptyMsg="Ch╞░a c├│ bß╗ï c├ío"
                                >
                                  {biCao.length > 0 ? biCao.map((n, i) => (
                                    <tr key={n.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                      <Td><span className="font-medium text-[#1a5a96]">{n.hoTen}</span></Td>
                                      <Td>{n.namSinh}</Td>
                                      <Td>{n.diaChi}</Td>
                                      <Td>
                                        {n.toiDanh ?? "ΓÇö"}
                                        {n.dieuKhoan && (
                                          <span className="text-[#666]"> ({n.dieuKhoan})</span>
                                        )}
                                      </Td>
                                      <Td center>
                                        <button onClick={() => setBiCao(p => p.filter(x => x.id !== n.id))}
                                          className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                          <Trash2 size={11} /> X├│a
                                        </button>
                                      </Td>
                                    </tr>
                                  )) : undefined}
                                </Tbl>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-semibold text-[#444]">Danh s├ích th├┤ng tin khiß║┐u nß║íi</span>
                                  <BtnAdd><Plus size={12} /> Th├¬m</BtnAdd>
                                </div>
                                <Tbl
                                  headers={["Ng╞░ß╗¥i ─æß╗⌐ng ─æ╞ín", "Khiß║┐u nß║íi cho bß╗ï c├ío", "Nß╗Öi dung khiß║┐u nß║íi", "Thao t├íc"]}
                                  emptyMsg="Ch╞░a c├│ th├┤ng tin khiß║┐u nß║íi"
                                />
                              </div>
                            </>}
                          </div>
                        </Section>
                      )}
                    </>
                  )}

                  {/* Bottom action bar */}
                  <div className="flex justify-end gap-2 pb-2 pt-1">
                    <BtnSecondary>Hß╗ºy</BtnSecondary>
                    {thuLyDon !== "─É├ú thß╗Ñ l├╜" && thuLyDon !== "Thß╗Ñ l├╜ mß╗¢i" && (
                      <button className="flex items-center gap-1.5 h-[30px] px-3 border border-[#1d2e4f] text-[#1d2e4f] hover:bg-[#eef1f5] rounded-[3px] text-[12px] font-medium transition-colors">
                        <Save size={13} /> L╞░u nh├íp
                      </button>
                    )}
                    <BtnPrimary>L╞░u</BtnPrimary>
                  </div>

              </div>
            </div>

            {/* RIGHT: PDF Viewer panel */}
            {showPDF && <div className="flex-1 flex flex-col bg-[#404040] border-l border-[#333]">
              {/* PDF toolbar */}
              <div className="bg-[#323232] flex items-center justify-between px-3 py-[7px] border-b border-[#555] gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowPDF(false)}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded" title="ß║¿n t├ái liß╗çu">
                    <ChevronRight size={15} />
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[12px] px-3 py-[4px] rounded-[3px] border border-[#6e1414] transition-colors">
                    <Upload size={13} /> Tß║úi l├¬n
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded">
                    <Download size={14} />
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded">
                    <Printer size={14} />
                  </button>
                </div>
                <span className="text-white/70 text-[12px] flex-1 text-center truncate">
                  Don_de_nghi_GDT_TT_mau.pdf
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><ZoomOut size={14} /></button>
                  <span className="text-white/80 text-[12px] min-w-[40px] text-center">100%</span>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><ZoomIn size={14} /></button>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <span className="text-white/60 text-[12px]">1 / 3</span>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><RotateCcw size={14} /></button>
                </div>
              </div>

              {/* PDF page display */}
              <div className="flex-1 overflow-auto flex flex-col items-center py-6 gap-4">
                {/* Page 1 */}
                <div className="bg-white shadow-xl" style={{ width: "595px", minHeight: "842px" }}>
                  <div className="p-[72px] text-[#111]">
                    <div className="text-center mb-8">
                      <p className="text-[11px] font-medium">Cß╗ÿNG H├ÆA X├â Hß╗ÿI CHß╗ª NGH─¿A VIß╗åT NAM</p>
                      <p className="text-[11px] underline decoration-1">─Éß╗Öc lß║¡p - Tß╗▒ do - Hß║ính ph├║c</p>
                      <p className="text-[11px] mt-1 italic">---------------</p>
                      <p className="text-[14px] font-bold uppercase mt-5">─É╞áN ─Éß╗Ç NGHß╗è</p>
                      <p className="text-[12px] font-semibold">Xem x├⌐t lß║íi bß║ún ├ín, quyß║┐t ─æß╗ïnh cß╗ºa T├▓a ├ín ─æ├ú c├│</p>
                      <p className="text-[12px] font-semibold">hiß╗çu lß╗▒c ph├íp luß║¡t theo thß╗º tß╗Ñc gi├ím ─æß╗æc thß║⌐m</p>
                    </div>

                    <div className="text-[11px] space-y-3 leading-relaxed">
                      <p>K├¡nh gß╗¡i: <span className="font-semibold">T├ÆA ├üN NH├éN D├éN Tß╗ÉI CAO</span></p>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">Hß╗ì v├á t├¬n:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">─Éß╗ïa chß╗ë:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">─Éiß╗çn thoß║íi:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>

                      <p className="font-semibold mt-4">I. Nß╗ÿI DUNG Vß╗ñ VIß╗åC:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <p className="font-semibold mt-4">II. L├¥ DO ─Éß╗Ç NGHß╗è XEM X├ëT THEO THß╗ª Tß╗ñC GI├üM ─Éß╗ÉC THß║¿M:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <p className="font-semibold mt-4">III. Y├èU Cß║ªU:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <div className="mt-8 flex justify-between">
                        <div className="text-center">
                          <p className="font-semibold">X├üC NHß║¼N Cß╗ªA ─Éß╗èA PH╞»╞áNG</p>
                          <p className="italic text-[10px]">(K├╜ t├¬n, ─æ├│ng dß║Ñu)</p>
                        </div>
                        <div className="text-center">
                          <p>H├á Nß╗Öi, ng├áy .... th├íng .... n─âm .....</p>
                          <p className="font-semibold">NG╞»ß╗£I L├ÇM ─É╞áN</p>
                          <p className="italic text-[10px]">(K├╜ v├á ghi r├╡ hß╗ì t├¬n)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/40 text-[11px]">Trang 1 / 3</p>
              </div>
            </div>}
            {!showPDF && (
              <div className="flex-shrink-0 border-l border-[#ccc] bg-[#f5f5f5] flex items-start pt-3">
                <button onClick={() => setShowPDF(true)} title="Hiß╗çn t├ái liß╗çu"
                  className="flex flex-col items-center gap-1 px-2 py-2 text-[#555] hover:text-[#1d2e4f] hover:bg-[#e8edf5] rounded-[3px] transition-colors">
                  <ChevronLeft size={15} />
                  <span className="text-[10px] font-medium [writing-mode:vertical-rl] rotate-180">T├ái liß╗çu</span>
                </button>
              </div>
            )}
          </div>{/* end form 2-panel */}
        </div>{/* end main content area */}
      </div>{/* end body flex */}

      {/* Popup bß╗ï c├ío */}
      {showBiCaoPopup && <PopupBiCao onClose={() => setShowBiCaoPopup(false)} />}

      {/* Popup danh s├ích thß║⌐m ph├ín */}
      {showThamPhanPopup && <PopupThamPhan onClose={() => setShowThamPhanPopup(false)} />}


      {/* Chuyß╗ân vai tr├▓ ─æ├ú nß║▒m trong khß╗æi t├ái khoß║ún ß╗ƒ cuß╗æi sidebar */}

      {/* Popup */}
      {showPopup && (
        <PopupCongVan
          banDau={congVans.find(c => c.id === suaCongVanId)}
          onClose={() => { setShowPopup(false); setSuaCongVanId(null); }}
          onSave={cv => setCongVans(p =>
            p.some(c => c.id === cv.id) ? p.map(c => c.id === cv.id ? cv : c) : [...p, cv])}
        />
      )}
      {showUploadPopup && (
        <PopupUploadFile
          onClose={() => setShowUploadPopup(false)}
          onUpload={(f) => {
            setOcrFile(f);
            setShowUploadPopup(false);
            setShowOcrConfirm(true);
          }}
        />
      )}
      {showOcrConfirm && ocrFile && (
        <PopupOcrConfirm
          file={ocrFile}
          onBack={() => { setShowOcrConfirm(false); setShowUploadPopup(true); }}
          onStart={startOcr}
        />
      )}
      {showOcrProgress && (
        <PopupOcrProgress
          step={ocrStep}
          onCancel={() => setShowOcrCancel(true)}
          // ─É├│ng popup nh╞░ng job vß║½n chß║íy nß╗ün ΓÇö hß╗ô s╞í giß╗» trß║íng th├íi "─Éang OCR".
          onClose={() => setShowOcrProgress(false)}
        />
      )}
      {showOcrCancel && (
        <PopupOcrCancelConfirm
          onBack={() => setShowOcrCancel(false)}
          onConfirm={cancelOcr}
        />
      )}
      {showTraLaiForm && (
        <PopupTraLaiDon
          count={1}
          reason={traLaiReason}
          onChangeReason={setTraLaiReason}
          isTruongPhong={false}
          onClose={() => { setShowTraLaiForm(false); setTraLaiReason(""); }}
          onConfirm={() => { addNotification("─É├ú trß║ú lß║íi ─æ╞ín th├ánh c├┤ng."); setShowTraLaiForm(false); setTraLaiReason(""); }}
        />
      )}
      {showThemTB && (
        <PopupThemThongBao
          key={suaKetQuaId ?? "moi"}
          banDau={thongBaoTraLoi.find(x => x.id === suaKetQuaId)}
          onDong={() => { setShowThemTB(false); setSuaKetQuaId(null); }}
          onThem={(tb) => {
            setThongBaoTraLoi(p => suaKetQuaId
              ? p.map(x => x.id === suaKetQuaId ? { ...x, ...tb } : x)
              : [...p, { id: Date.now(), ...tb }]);
            setShowThemTB(false);
            setSuaKetQuaId(null);
          }}
        />
      )}
      {/* D├╣ng CHUNG mß╗Öt popup cho th├¬m mß╗¢i v├á sß╗¡a ΓÇö c├╣ng bß╗Ö tr╞░ß╗¥ng, chß╗ë kh├íc
          nguß╗ôn dß╗» liß╗çu ─æß║ºu v├áo v├á c├ích ghi kß║┐t quß║ú. key ├⌐p remount ─æß╗â form nß║íp
          lß║íi state khi ─æß╗òi bß║ún ghi ─æang sß╗¡a. */}
      {(showThemDonLQ || suaDonLQ) && (
        <PopupThemDonLienQuan
          key={suaDonLQ?.id ?? "them-moi"}
          banGhi={suaDonLQ}
          onDong={() => { setShowThemDonLQ(false); setSuaDonLQ(null); }}
          onThem={(d) => {
            if (suaDonLQ) {
              setDonLienQuanThem(p => p.map(x => x.id === suaDonLQ.id ? { ...x, ...d } : x));
              setSuaDonLQ(null);
            } else {
              setDonLienQuanThem(p => [...p, { id: Date.now(), ...d }]);
              setShowThemDonLQ(false);
            }
          }}
        />
      )}
      {showThemDonKem && (
        <PopupThemDonKem
          key={suaDonKemId ?? "moi"}
          banDau={donThuLyKem.find(x => x.id === suaDonKemId)}
          onDong={() => { setShowThemDonKem(false); setSuaDonKemId(null); }}
          onThem={(d) => {
            setDonThuLyKem(p => suaDonKemId
              ? p.map(x => x.id === suaDonKemId ? { ...x, ...d } : x)
              : [...p, { id: Date.now(), ...d }]);
            setShowThemDonKem(false);
            setSuaDonKemId(null);
          }}
        />
      )}
      {showThemBanAn && (
        <PopupThemBanAn
          key={suaBanAnId ?? "moi"}
          banDau={banAnThem.find(x => x.id === suaBanAnId)}
          onDong={() => { setShowThemBanAn(false); setSuaBanAnId(null); }}
          onThem={(b) => {
            setBanAnThem(p => suaBanAnId
              ? p.map(x => x.id === suaBanAnId ? { ...x, ...b } : x)
              : [...p, { id: Date.now(), nguon: "Th├¬m mß╗¢i", ...b }]);
            setShowThemBanAn(false);
            setSuaBanAnId(null);
          }}
        />
      )}
      {showThemNguyenDon && (
        <PopupThemNguoiDungDon
          tieuDe="Th├¬m nguy├¬n ─æ╞ín/ng╞░ß╗¥i khß╗ƒi kiß╗çn"
          tuCachMacDinh="Nguy├¬n ─æ╞ín"
          coThongKe
          key={suaNguyenDonId ?? "moi"}
          banDau={nguyenDon.find(x => x.id === suaNguyenDonId)}
          onDong={() => { setShowThemNguyenDon(false); setSuaNguyenDonId(null); }}
          onLuu={(n) => {
            setNguyenDon(p => suaNguyenDonId
              ? p.map(x => x.id === suaNguyenDonId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemNguyenDon(false);
            setSuaNguyenDonId(null);
          }}
        />
      )}
      {showThemBiDon && (
        <PopupThemNguoiDungDon
          tieuDe="Th├¬m bß╗ï ─æ╞ín/ng╞░ß╗¥i bß╗ï kiß╗çn"
          tuCachMacDinh="Bß╗ï ─æ╞ín"
          coThongKe
          key={suaBiDonId ?? "moi"}
          banDau={biDon.find(x => x.id === suaBiDonId)}
          onDong={() => { setShowThemBiDon(false); setSuaBiDonId(null); }}
          onLuu={(n) => {
            setBiDon(p => suaBiDonId
              ? p.map(x => x.id === suaBiDonId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemBiDon(false);
            setSuaBiDonId(null);
          }}
        />
      )}
      {showThemNguoiLQ && (
        <PopupThemNguoiDungDon
          tieuDe="Th├¬m ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan"
          tuCachMacDinh="Ng╞░ß╗¥i c├│ quyß╗ün lß╗úi, ngh─⌐a vß╗Ñ li├¬n quan"
          coThongKe
          key={suaNguoiLQId ?? "moi"}
          banDau={nguoiLienQuan.find(x => x.id === suaNguoiLQId)}
          onDong={() => { setShowThemNguoiLQ(false); setSuaNguoiLQId(null); }}
          onLuu={(n) => {
            setNguoiLienQuan(p => suaNguoiLQId
              ? p.map(x => x.id === suaNguoiLQId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemNguoiLQ(false);
            setSuaNguoiLQId(null);
          }}
        />
      )}
      {/* Popup Sß╗¡a kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín ΓÇö mß╗ƒ tß╗½ n├║t tr├¬n header Section 5 */}
      {showSuaKetQuaXuLy && (
        <PopupSuaKetQuaXuLyDon
          banDau={{
            noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
            thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
            chanhAnHoacToaAn, vuTruong,
          }}
          onClose={() => setShowSuaKetQuaXuLy(false)}
          onSave={(data) => {
            setNoiChuyenDen(data.noiChuyenDen);
            setDonViChuyenDen(data.donViChuyenDen);
            setCaNhanChuyenDen(data.caNhanChuyenDen);
            setTrangThaiDon(data.trangThaiDon);
            setThuLyDon(data.thuLyDon);
            setLyDoKhongDu(data.lyDoKhongDu);
            setLyDoTraLai(data.lyDoTraLai);
            setYeuCauTraLai(data.yeuCauTraLai);
            setLyDoLuuTheoDoi(data.lyDoLuuTheoDoi);
            setChanhAnHoacToaAn(data.chanhAnHoacToaAn);
            setVuTruong(data.vuTruong);
            
            if (editingRow) {
              const t = new Date();
              const ngay = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
              const step = data.noiChuyenDen === "Nß╗Öi bß╗Ö" || data.noiChuyenDen === "T├▓a kh├íc" || data.noiChuyenDen === "Ngo├ái t├▓a ├ín" ? "Chuyß╗ân ─æ╞ín" : data.noiChuyenDen;
              
              let note = "";
              if (data.noiChuyenDen === "Nß╗Öi bß╗Ö") {
                note = [
                  data.donViChuyenDen && `Chuyß╗ân ─æß║┐n: ${data.donViChuyenDen}`,
                  data.caNhanChuyenDen && `C├í nh├ón: ${data.caNhanChuyenDen}`,
                  data.trangThaiDon && `Trß║íng th├íi: ${data.trangThaiDon}`,
                  data.trangThaiDon === "─É╞ín kh├┤ng ─æß╗º ─æiß╗üu kiß╗çn" && data.lyDoKhongDu && `L├╜ do: ${data.lyDoKhongDu}`,
                  hasGiamDocThamResult
                    ? (data.vuTruong && `Vß╗Ñ tr╞░ß╗ƒng: ${data.vuTruong}`)
                    : (data.trangThaiDon === "─É╞ín ─æß╗º ─æiß╗üu kiß╗çn" && data.thuLyDon && `Thß╗Ñ l├╜: ${data.thuLyDon}`),
                ].filter(Boolean).join(" ┬╖ ");
              } else if (data.noiChuyenDen === "T├▓a kh├íc") {
                note = [data.donViChuyenDen && `Chuyß╗ân ─æß║┐n: ${data.donViChuyenDen}`, `H├¼nh thß╗⌐c: ${data.chanhAnHoacToaAn}`].filter(Boolean).join(" ┬╖ ");
              } else if (data.noiChuyenDen === "Ngo├ái t├▓a ├ín") {
                note = data.donViChuyenDen ? `Chuyß╗ân ─æß║┐n: ${data.donViChuyenDen}` : "";
              } else if (data.noiChuyenDen === "Trß║ú lß║íi ─æ╞ín") {
                note = [data.lyDoTraLai && `L├╜ do: ${data.lyDoTraLai}`, data.yeuCauTraLai && `Y├¬u cß║ºu: ${data.yeuCauTraLai}`].filter(Boolean).join(" ┬╖ ");
              } else if (data.noiChuyenDen === "L╞░u theo d├╡i") {
                note = data.lyDoLuuTheoDoi ? `L├╜ do: ${data.lyDoLuuTheoDoi}` : "";
              }

              const newEntry = {
                date: ngay,
                step,
                actor: nguoiTheoVaiTro(currentRole).nguoi,
                note,
                rawData: data
              };
              editingRow.processingHistory = [...(editingRow.processingHistory ?? []), newEntry];
            }
            
            setShowSuaKetQuaXuLy(false);
          }}
        />
      )}
      {/* Popup Chi tiß║┐t kß║┐t quß║ú xß╗¡ l├╜ ─æ╞ín ΓÇö mß╗ƒ tß╗½ n├║t Xem tr├¬n lß╗ïch sß╗¡ */}
      {xemChiTietHistory && (
        <PopupChiTietKetQuaXuLy
          data={xemChiTietHistory}
          onClose={() => setXemChiTietHistory(null)}
        />
      )}
    </div>
  );
