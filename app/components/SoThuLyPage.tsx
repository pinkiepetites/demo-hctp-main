import React, { useState, useMemo, useEffect } from 'react';
import './SoThuLy.css';
import { ConfigProvider, theme, Layout, Menu, Breadcrumb, Typography, Tabs, Card, Form, TreeSelect, Checkbox, DatePicker,
  Button, Space, Dropdown, Table, Tag, Input, Popover, Tooltip, Drawer, Descriptions, Empty, Result, App as AntApp, Row, Col,
  Badge, Avatar, Flex, Alert, Grid, Select, Segmented, Modal } from 'antd';
import * as icons from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
const I = icons;
import { SO, DATA, UNITS, norm, fmt } from './mockDataSoThuLy';
dayjs.locale('vi');
const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const BRAND = '#8c0011';
const DATE_FORMAT = 'DD/MM/YYYY';
const TODAY = dayjs('2026-09-29');

/* Token theo src/styles/theme/antd/antd-theme.ts */
const TOKEN = { colorPrimary: '#076ee5', borderRadius: 6, fontSizeSM: 11, fontFamily: "'Be Vietnam Pro', -apple-system, 'Segoe UI', Roboto, sans-serif" };
const components = dark => ({
  Card: { borderRadiusLG: 16 }, Table: { borderRadiusLG: 16 }, Tag: { borderRadiusSM: 4 },
  Form: { labelFontSize: 13, verticalLabelPadding: '0 0 4px' },
  Layout: { bodyBg: dark ? '#0f0f10' : '#f3f4f8', headerBg: BRAND, headerHeight: 64, headerPadding: '0 16px', siderBg: dark ? '#141414' : 'rgb(245,245,245)' },
  Menu: { itemMarginInline: 8, itemBorderRadius: 8, itemBg: 'transparent', subMenuItemBg: 'transparent',
    itemSelectedBg: dark ? 'rgba(255,77,79,.16)' : 'rgba(140,0,17,.08)', itemSelectedColor: dark ? '#ff7875' : BRAND },
});

/* ---------- đơn vị ---------- */
const U = Object.fromEntries(UNITS.map(u => [u.id, u]));
const desc = id => [id, ...UNITS.filter(u => u.p === id).flatMap(u => desc(u.id))];
const hasChild = id => UNITS.some(u => u.p === id);
const unitTree = p => UNITS.filter(u => u.p === p).map(u => ({ title: u.ten, value: u.id, children: unitTree(u.id) }));

/* ---------- danh mục sổ: menu cấp loại án, tab cấp giai đoạn ---------- */
const GD4 = l => [
  { key: `${l}_ST`, label: 'Sơ thẩm' }, { key: `${l}_PT`, label: 'Phúc thẩm' },
  { key: `${l}_GDTTT`, label: 'Giám đốc thẩm, tái thẩm' }, { key: `${l}_DON`, label: 'Đơn đề nghị GĐT, TT' }];
const LOAI = [
  { key: 'HS', label: 'Hình sự', ten: 'án hình sự', tabs: GD4('HS') },
  { key: 'DS', label: 'Dân sự', ten: 'án dân sự', tabs: GD4('DS') },
  { key: 'HN', label: 'Hôn nhân và gia đình', ten: 'án hôn nhân và gia đình', tabs: GD4('HN') },
  { key: 'KT', label: 'Kinh doanh, thương mại', ten: 'án kinh doanh, thương mại', tabs: GD4('KT') },
  { key: 'LD', label: 'Lao động', ten: 'án lao động', tabs: GD4('LD') },
  { key: 'HC', label: 'Hành chính', ten: 'án hành chính', tabs: GD4('HC') },
  { key: 'PS', label: 'Tuyên bố phá sản', ten: 'tuyên bố phá sản', tabs: [{ key: 'PS', label: 'Tuyên bố phá sản' }] },
  { key: 'XLHC', label: 'Biện pháp xử lý hành chính', ten: 'biện pháp xử lý hành chính', tabs: [{ key: 'XLHC', label: 'Biện pháp xử lý hành chính' }] },
  { key: 'THA', label: 'Thi hành án hình sự', ten: 'thi hành án hình sự', tabs: [
    { key: 'THA_TN', label: 'Người bị kết án phạt tù đang tại ngoại' }, { key: 'THA_QD', label: 'Ra quyết định thi hành án hình sự' }] },
];
const LOAI_MAP = Object.fromEntries(LOAI.map(l => [l.key, l]));
const findLoai = so => LOAI.find(l => l.tabs.some(t => t.key === so));

/* ---------- cây cột ---------- */
function numbered(cols) { let n = 0; const w = ns => ns.map(c => c.c ? { ...c, c: w(c.c) } : { ...c, n: c.n || ++n }); return w(cols); }
const leaves = ns => ns.flatMap(n => n.c ? leaves(n.c) : [n]);
const TONE = { total: ['#fdf0f1', BRAND], success: ['#f0f7f3', '#2e7d32'], processing: ['#e5effd', '#1976d2'], warning: ['#fff6e5', '#f57c00'], purple: ['#f3ecff', '#673ab7'], default: ['#f5f5f5', '#595959'], error: ['#fdecec', '#c62828'], cyan: ['#e6fffb', '#08979c'] };

function ColTitle({ n }) {
  return <div><span className="colno">{n.n}</span><div>{n.t}</div>{n.h && <div className="th-h">{n.h}</div>}</div>;
}
function StatusPill({ st }) { const ac = TONE[st[1]][1]; return <span className="pill" style={{ color: ac, background: ac + '14' }}><i style={{ background: ac }} />{st[0]}</span>; }
function CellList({ items }) {
  if (!items || !items.length) return <span className="empty-dash">—</span>;
  return <>{items.map((e, i) => <div className="ci" key={i}><div className="m">{e.m}</div>{e.s && <div className="s">{e.s}</div>}</div>)}</>;
}
const hiddenKey = so => 'soThuLy.cotAn.' + so;
const readHidden = so => { try { return new Set(JSON.parse(localStorage.getItem(hiddenKey(so))) || []); } catch (e) { return new Set(); } };
const writeHidden = (so, set) => { try { localStorage.setItem(hiddenKey(so), JSON.stringify([...set])); } catch (e) {} };

/* ---------- thẻ số liệu trên banner ---------- */
const TONE_ICON = { total: 'FileTextOutlined', success: 'CheckCircleOutlined', processing: 'ClockCircleOutlined', warning: 'PauseCircleOutlined',
  purple: 'RollbackOutlined', default: 'StopOutlined', error: 'CloseCircleOutlined', cyan: 'SafetyCertificateOutlined' };
const TONE_LIGHT = { total: '#fde68a', success: '#6ee7b7', processing: '#93c5fd', warning: '#fcd34d', purple: '#c4b5fd', default: '#cbd5e1', error: '#fca5a5', cyan: '#67e8f9' };
function HeroStats({ def, counts, total, active, onPick, totalLabel }) {
  const items = [{ k: null, label: totalLabel || 'Tổng số thụ lý', tone: 'total', v: total },
    ...Object.entries(def.status).map(([k, [l, c]]) => ({ k, label: l, tone: c, v: counts[k] || 0 }))];
  return <div className="hstats">{items.map(it => {
    const on = active === it.k, Ico = I[TONE_ICON[it.tone]], ac = TONE[it.tone][1];
    const pct = total ? Math.round(it.v * 100 / total) : 0;
    return <button key={it.k || 'all'} type="button" className={'hstat' + (on ? ' on' : '') + (it.k ? '' : ' total')}
      onClick={() => onPick(on && it.k ? null : it.k)} style={{ '--ac': ac, '--lt': TONE_LIGHT[it.tone] }}>
      <span className="hs-ico"><Ico /></span>
      <span className="hs-body">
        <span className="hs-v">{it.v}</span>
        <span className="hs-l">{it.label}</span>
        {it.k && <span className="hs-bar"><i style={{ width: pct + '%' }} /></span>}
      </span>
      {it.k && <span className="hs-pct">{pct}%</span>}
    </button>;
  })}</div>;
}

/* ---------- chi tiết vụ án (theo FlyoutDrawer) ---------- */
function ChiTietDrawer({ row, def, onClose, isMobile }) {
  const { message } = AntApp.useApp();
  if (!row) return null;
  const cols = numbered(def.cols);
  const [lb, color] = def.status[row._st];
  const item = c => ({ key: c.k, label: `${c.n}. ${c.t}`, children: <CellList items={row[c.k]} /> });
  return <ConfigProvider theme={{ token: { colorPrimary: BRAND, fontSize: 13 } }}>
    <Drawer open placement="right" width={isMobile ? '100%' : 'calc(100vw - 280px)'} maskClosable={false} destroyOnClose onClose={onClose}
      title={<span style={{ color: BRAND, fontWeight: 700 }}>Chi tiết – {def.label ? def.label(row) : row[def.cols[0].k][0].m}</span>}
      extra={<Tag color={color}>{lb}</Tag>}
      footer={<Flex justify="center" gap={8}><Button onClick={onClose}>Đóng</Button>
        <Button type="primary" icon={<I.FolderOpenOutlined />} onClick={() => message.info('Mô phỏng: mở màn hồ sơ vụ án')}>Mở hồ sơ vụ án</Button></Flex>}>
      <Descriptions className="drawer-sec" title="Thông tin thụ lý" bordered size="small" column={{ xs: 1, lg: 2 }}
        items={[{ key: 'dv', label: 'Đơn vị thụ lý', children: U[row._u].ten }, ...cols.filter(c => !c.c).map(item)]} />
      {cols.filter(c => c.c).map(g =>
        <Descriptions key={g.t} className="drawer-sec" title={g.t} bordered size="small" column={{ xs: 1, lg: 2 }} items={leaves(g.c).map(item)} />)}
    </Drawer>
  </ConfigProvider>;
}

/* ---------- bộ lọc: kỳ, phạm vi, lưu bộ lọc ---------- */
const KY_OPTS = [
  { value: 'ngay', label: 'Ngày' }, { value: 'tuan', label: 'Tuần' }, { value: 'thang', label: 'Tháng' }, { value: 'quy', label: 'Quý' },
  { value: 'nua1', label: '6 tháng đầu năm' }, { value: 'nua2', label: '6 tháng cuối năm' }, { value: 'nam', label: 'Năm' }, { value: 'tuy', label: 'Tùy chọn' }];
function kyRange(ky, a, custom) {
  a = a || TODAY;
  switch (ky) {
    case 'ngay': return [a.startOf('day'), a.endOf('day')];
    case 'tuan': return [a.startOf('week'), a.endOf('week')];
    case 'thang': return [a.startOf('month'), a.endOf('month')];
    case 'quy': { const s = a.month(Math.floor(a.month() / 3) * 3).startOf('month'); return [s, s.add(2, 'month').endOf('month')]; }
    case 'nua1': return [dayjs(`${a.year()}-01-01`), dayjs(`${a.year()}-06-30`)];
    case 'nua2': return [dayjs(`${a.year()}-07-01`), dayjs(`${a.year()}-12-31`)];
    case 'nam': return [a.startOf('year'), a.endOf('year')];
    default: return custom || [TODAY.startOf('month'), TODAY];
  }
}
const PHAM_OPTS = [
  { value: 'moi', label: 'Thụ lý mới trong kỳ', desc: 'Ngày thụ lý nằm trong kỳ' },
  { value: 'ton', label: 'Cũ chuyển sang', desc: 'Thụ lý trước kỳ, đầu kỳ chưa giải quyết xong' },
  { value: 'phai', label: 'Phải giải quyết (cũ + mới)', desc: 'Cũ chuyển sang và thụ lý mới trong kỳ' },
  { value: 'dagq', label: 'Đã giải quyết trong kỳ', desc: 'Có kết quả giải quyết trong kỳ' },
  { value: 'conlai', label: 'Còn lại chưa giải quyết', desc: 'Đến cuối kỳ chưa giải quyết xong' }];
const KCKN_OPTS = [
  { value: 'all', label: 'Tất cả' }, { value: 'co', label: 'Có kháng cáo hoặc kháng nghị' },
  { value: 'kc', label: 'Có kháng cáo' }, { value: 'kn', label: 'Có kháng nghị' }, { value: 'khong', label: 'Không kháng cáo, kháng nghị' }];
const savedKey = so => 'soThuLy.boLoc.' + so;
const readSaved = so => { try { return JSON.parse(localStorage.getItem(savedKey(so))) || []; } catch (e) { return []; } };
const writeSaved = (so, v) => { try { localStorage.setItem(savedKey(so), JSON.stringify(v)); } catch (e) {} };

/* ---------- màn Sổ thụ lý theo loại án ---------- */
function SoThuLyPage({ loai, soId, setSoId, dark }) {
  const { message } = AntApp.useApp();
  const screens = Grid.useBreakpoint();
  const [form] = Form.useForm();
  const unitWatch = Form.useWatch('unit', form);
  const isHS = soId.startsWith('HS_'), isCivil = /^(DS|HN|KT|LD)_/.test(soId), isST = /_ST$/.test(soId);
  const ndLabel = isHS ? 'Tội danh' : soId === 'PS' ? 'Ngành kinh tế' : 'Quan hệ pháp luật';
  const init = { unit: 'D01', sub: true, ky: 'thang', anchor: TODAY, range: [TODAY.startOf('month'), TODAY], pham: 'moi',
    tp: [], nd: [], kq: [], viec: 'all', kckn: 'all', dd: [] };
  const mkApplied = v => ({ ...init, ...v, sub: !!v.sub && hasChild(v.unit), range: kyRange(v.ky, v.anchor, v.range) });
  const [applied, setApplied] = useState(() => mkApplied(init));
  const [advOpen, setAdvOpen] = useState(false);
  const [saved, setSaved] = useState(() => readSaved(soId));
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const kyWatch = Form.useWatch('ky', form) || 'thang';
  const anchorWatch = Form.useWatch('anchor', form);
  const rangeWatch = Form.useWatch('range', form);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [q, setQ] = useState('');
  const [pg, setPg] = useState({ current: 1, pageSize: 20 });
  const [hidden, setHidden] = useState(() => readHidden(soId));
  const [row, setRow] = useState(null);
  const [fs, setFs] = useState(false);
  const def = SO[soId];

  const reload = () => { setLoading(true); setTimeout(() => setLoading(false), 450); };
  useEffect(() => { setHidden(readHidden(soId)); setSaved(readSaved(soId)); setStatus(null); setQ(''); setPg(p => ({ ...p, current: 1 }));
    form.setFieldsValue({ tp: [], nd: [], kq: [], viec: 'all', kckn: 'all', dd: [] });
    setApplied(a => ({ ...a, tp: [], nd: [], kq: [], viec: 'all', kckn: 'all', dd: [] })); reload(); }, [soId]);

  const commit = v => { setApplied(mkApplied(v)); setStatus(null); setPg(p => ({ ...p, current: 1 })); reload(); };
  const apply = () => form.validateFields().then(v => {
    const [f, t] = kyRange(v.ky, v.anchor, v.range);
    if (t.diff(f, 'day') > 366) { message.warning('Khoảng thời gian tối đa là 1 năm'); return; }
    commit(v);
  });
  const reset = () => { form.setFieldsValue(init); commit(init); setQ(''); };
  const quick = patch => { const v = { ...form.getFieldsValue(true), tp: [], nd: [], kq: [], viec: 'all', kckn: 'all', dd: [], ...patch }; form.setFieldsValue(v); commit(v); };
  const removeTag = (field, val) => {
    const cur = form.getFieldValue(field);
    const next = Array.isArray(cur) ? cur.filter(x => x !== val) : 'all';
    form.setFieldValue(field, next); commit({ ...form.getFieldsValue(true), [field]: next });
  };
  const doSave = () => {
    const name = saveName.trim(); if (!name) { message.warning('Vui lòng nhập tên bộ lọc'); return; }
    const v = form.getFieldsValue(true);
    const item = { name, v: { ...v, anchor: v.anchor && v.anchor.format('YYYY-MM-DD'), range: v.range && v.range.map(d => d.format('YYYY-MM-DD')) } };
    const next = [...saved.filter(s => s.name !== name), item]; setSaved(next); writeSaved(soId, next);
    setSaveOpen(false); setSaveName(''); message.success(`Đã lưu bộ lọc "${name}"`);
  };
  const loadSaved = s => { const v = { ...init, ...s.v, anchor: dayjs(s.v.anchor), range: s.v.range ? s.v.range.map(d => dayjs(d)) : init.range }; form.setFieldsValue(v); commit(v); };
  const delSaved = name => { const next = saved.filter(s => s.name !== name); setSaved(next); writeSaved(soId, next); };

  const scoped = useMemo(() => {
    if (!def) return [];
    const units = new Set(applied.sub ? desc(applied.unit) : [applied.unit]);
    const f = applied.range[0].startOf('day').toDate(), t = applied.range[1].endOf('day').toDate();
    const inScope = r => {
      const moi = r._d >= f && r._d <= t, ton = r._d < f && (!r._dgq || r._dgq >= f);
      switch (applied.pham) {
        case 'moi': return moi;
        case 'ton': return ton;
        case 'phai': return moi || ton;
        case 'dagq': return r._d <= t && !!r._dgq && r._dgq >= f && r._dgq <= t;
        case 'conlai': return r._d <= t && (!r._dgq || r._dgq > t);
        default: return moi;
      }
    };
    const order = UNITS.map(u => u.id);
    return DATA[soId].filter(r => units.has(r._u) && inScope(r))
      .sort((a, b) => order.indexOf(a._u) - order.indexOf(b._u) || a._d - b._d);
  }, [soId, applied]);
  const tpOpts = useMemo(() => [...new Set(scoped.map(r => r._tp))].sort().map(v => ({ value: v, label: v })), [scoped]);
  const ndOpts = useMemo(() => [...new Set(scoped.map(r => r._nd).filter(Boolean))].sort().map(v => ({ value: v, label: v })), [scoped]);
  const base = useMemo(() => scoped.filter(r =>
    (!applied.tp.length || applied.tp.includes(r._tp)) &&
    (!applied.nd.length || applied.nd.includes(r._nd)) &&
    (!applied.kq.length || applied.kq.includes(r._st)) &&
    (applied.viec === 'all' || (applied.viec === 'viec') === r._f.viec) &&
    (applied.kckn === 'all' || (applied.kckn === 'kc' && r._f.kc) || (applied.kckn === 'kn' && r._f.kn) || (applied.kckn === 'co' && (r._f.kc || r._f.kn)) || (applied.kckn === 'khong' && !r._f.kc && !r._f.kn)) &&
    applied.dd.every(k => r._f[k])), [scoped, applied]);
  const counts = useMemo(() => base.reduce((m, r) => (m[r._st] = (m[r._st] || 0) + 1, m), {}), [base]);
  const list = useMemo(() => {
    const k = norm(q.trim());
    return base.filter(r => (!status || r._st === status) && (!k || r._text.includes(k)));
  }, [base, status, q]);

  const DD_OPTS = [
    isHS && { value: 'u18', label: 'Có người dưới 18 tuổi' },
    isHS && { value: 'tg', label: 'Bị cáo đang tạm giam' },
    def && leaves(def.cols).some(c => c.k === 'nn') && { value: 'nn', label: 'Có yếu tố nước ngoài' },
    def && leaves(def.cols).some(c => c.k === 'rg') && { value: 'rg', label: 'Thủ tục rút gọn' },
    { value: 'qh', label: 'Quá hạn luật định' },
    { value: 'td', label: 'Án trọng điểm, án điểm' },
    { value: 'cd', label: 'Án Quốc hội, ban chỉ đạo quan tâm' },
  ].filter(Boolean);
  const advCount = applied.tp.length + applied.nd.length + applied.kq.length + applied.dd.length + (applied.viec !== 'all') + (applied.kckn !== 'all');
  const tags = [
    ...applied.tp.map(v => ({ f: 'tp', v, label: `Thẩm phán: ${v}` })),
    ...applied.nd.map(v => ({ f: 'nd', v, label: `${ndLabel}: ${v}` })),
    ...applied.kq.map(v => ({ f: 'kq', v, label: `Kết quả: ${def ? def.status[v][0] : v}` })),
    ...(applied.viec !== 'all' ? [{ f: 'viec', v: applied.viec, label: applied.viec === 'viec' ? 'Chỉ việc' : 'Chỉ vụ án' }] : []),
    ...(applied.kckn !== 'all' ? [{ f: 'kckn', v: applied.kckn, label: KCKN_OPTS.find(o => o.value === applied.kckn).label }] : []),
    ...applied.dd.map(v => ({ f: 'dd', v, label: (DD_OPTS.find(o => o.value === v) || { label: v }).label })),
  ];
  const exportSo = ({ key }) => {
    const loc = key === 'loc';
    const name = `${loc ? 'DanhSach' : 'SoThuLy'}_${soId}_${applied.range[0].format('DDMMYYYY')}_${applied.range[1].format('DDMMYYYY')}.${loc ? 'xlsx' : key}`;
    message.loading({ content: 'Đang tạo tệp…', key: 'xuat' });
    setTimeout(() => message.success({ content: `Đã tạo tệp ${name} (${loc ? list.length : scoped.length} dòng${loc ? ', theo bộ lọc' : ', theo mẫu in'}) – mô phỏng`, key: 'xuat', duration: 4 }), 900);
  };

  const columns = useMemo(() => {
    if (!def) return [];
    const conv = (n, g = 0) => {
      if (n.c) { const ch = n.c.map(c => conv(c, g)).filter(Boolean); return ch.length ? { key: n.t, title: n.t, className: 'grp-h g' + g, children: ch } : null; }
      if (!n.fx && hidden.has(n.k)) return null;
      return { key: n.k, dataIndex: n.k, width: n.w, fixed: n.fx ? 'left' : undefined, title: <ColTitle n={n} />,
        render: (v, r) => n.k === def.cols[0].k
          ? <><CellList items={v} /><StatusPill st={def.status[r._st]} /></>
          : <CellList items={v} /> };
    };
    let gi = 0; const all = numbered(def.cols).map(n => conv(n, n.c ? (gi++ % 6) : 0)).filter(Boolean);
    const stt = { key: 'stt', title: 'STT', width: 60, align: 'center', fixed: 'left', render: (_, __, i) => (pg.current - 1) * pg.pageSize + i + 1 };
    const unitsInData = [...new Set(base.map(r => r._u))];
    const donVi = applied.sub ? [{ key: 'dv', title: 'Đơn vị thụ lý', dataIndex: '_u', width: 180, render: v => U[v].ten,
      filters: unitsInData.map(u => ({ text: U[u].ten, value: u })), onFilter: (v, r) => r._u === v }] : [];
    const act = { key: 'act', title: 'Thao tác', width: 80, align: 'center', fixed: 'right',
      render: (_, r) => <Tooltip title="Xem chi tiết"><Button type="text" className="eye-btn" icon={<I.EyeOutlined />} onClick={e => { e.stopPropagation(); setRow(r); }} /></Tooltip> };
    return [stt, ...all.filter(c => c.fixed), ...donVi, ...all.filter(c => !c.fixed), act];
  }, [def, hidden, pg, applied, base]);
  const scrollX = def ? leaves(numbered(def.cols)).filter(c => c.fx || !hidden.has(c.k)).reduce((s, c) => s + c.w, 150 + (applied.sub ? 180 : 0)) : 0;

  const colSetting = def && <div className="colset">
    <Flex justify="space-between" align="center"><Text strong>Cột hiển thị</Text>
      <Button type="link" size="small" onClick={() => { const s = new Set(); setHidden(s); writeHidden(soId, s); }}>Hiển thị tất cả</Button></Flex>
    {numbered(def.cols).map(n => {
      const one = l => <Checkbox key={l.k} checked={!!l.fx || !hidden.has(l.k)} disabled={!!l.fx}
        onChange={e => { const s = new Set(hidden); e.target.checked ? s.delete(l.k) : s.add(l.k); setHidden(s); writeHidden(soId, s); }}>
        {l.n}. {l.t}{l.fx ? ' (cố định)' : ''}</Checkbox>;
      return n.c ? <div key={n.t}><div className="gh">{n.t}</div>{leaves(n.c).map(one)}</div> : one(n);
    })}
  </div>;

  const donViText = `${U[applied.unit].ten}${applied.sub ? ' và các đơn vị cấp dưới' : ''}`;
  const { token } = theme.useToken();
  const tabLabel = (loai.tabs.find(t => t.key === soId) || {}).label;
  const nCot = def ? leaves(numbered(def.cols)).filter(c => c.fx || !hidden.has(c.k)).length : 0;

  return <div className="pg">
    <section className="hero">
      <div className="hero-deco" aria-hidden="true"><I.BankOutlined /></div>
      <Breadcrumb className="hero-crumb" items={[{ title: <I.HomeOutlined /> }, { title: 'Báo cáo' }, { title: 'Sổ thụ lý' }, { title: loai.label }]} />
      <Flex align="center" gap={16} wrap className="hero-title">
        <div className="hero-icon"><I.BookOutlined /></div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1>Sổ thụ lý {loai.ten}</h1>
          <div className="hero-sub">{def ? def.title : `${tabLabel} – chờ biểu mẫu nghiệp vụ`}</div>
        </div>
        <Dropdown trigger={['click']} disabled={!def} menu={{ onClick: exportSo, items: [
          { type: 'group', label: 'Sổ theo mẫu in (đơn vị, kỳ, phạm vi)' },
          { key: 'xlsx', icon: <I.FileExcelOutlined style={{ color: '#217346' }} />, label: 'Excel (.xlsx)' },
          { key: 'docx', icon: <I.FileWordOutlined style={{ color: '#2b579a' }} />, label: 'Word (.docx)' },
          { key: 'pdf', icon: <I.FilePdfOutlined style={{ color: '#c62828' }} />, label: 'PDF (.pdf) – bản in' },
          { type: 'divider' },
          { key: 'loc', icon: <I.FilterOutlined />, label: 'Danh sách theo bộ lọc hiện tại (.xlsx)' }] }}>
          <Button size="large" className="hero-btn" icon={<I.CloudDownloadOutlined />}>Xuất sổ <I.DownOutlined style={{ fontSize: 10 }} /></Button>
        </Dropdown>
      </Flex>
      {loai.tabs.length > 1 && <div className="htabs" role="tablist">{loai.tabs.map(t =>
        <button key={t.key} role="tab" aria-selected={t.key === soId} className={'htab' + (t.key === soId ? ' on' : '')} onClick={() => setSoId(t.key)}>
          {t.label}{!SO[t.key] && <span className="htab-wait">chờ mẫu</span>}
        </button>)}</div>}
      {def && <HeroStats def={def} totalLabel={({ moi: 'Tổng số thụ lý', ton: 'Tổng số cũ chuyển sang', phai: 'Tổng số phải giải quyết', dagq: 'Tổng số đã giải quyết', conlai: 'Tổng số còn lại' })[applied.pham]} counts={counts} total={base.length} active={status} onPick={k => { setStatus(k); setPg(p => ({ ...p, current: 1 })); }} />}
    </section>

    <Card className="pg-card float" styles={{ body: { padding: '14px 20px 12px' } }}>
      <Form form={form} layout="vertical" initialValues={init} onFinish={apply}>
        <div className="fbar">
          <div className="fbar-ico"><I.FilterOutlined /></div>
          <Form.Item label="Đơn vị" name="unit" rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]} 
            extra={<Form.Item name="sub" valuePropName="checked" noStyle><Checkbox disabled={!hasChild(unitWatch)} style={{ marginTop: 6 }}>Gồm đơn vị cấp dưới</Checkbox></Form.Item>}>
            <TreeSelect treeData={unitTree(null)} treeDefaultExpandAll showSearch treeNodeFilterProp="title" placeholder="Chọn đơn vị" suffixIcon={<I.ApartmentOutlined />} />
          </Form.Item>
          <Form.Item label={(def && def.dateLabel) ? `Kỳ (theo ${def.dateLabel.toLowerCase()})` : 'Kỳ báo cáo'}
            extra={<Text type="secondary" style={{ fontSize: 12 }}><I.CalendarOutlined /> {kyWatch === 'tuy'
              ? 'Chọn khoảng ngày, tối đa 1 năm'
              : (() => { const [a, b] = kyRange(kyWatch, anchorWatch, rangeWatch); return `${a.format(DATE_FORMAT)} – ${b.format(DATE_FORMAT)}`; })()}</Text>}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="ky" noStyle><Select options={KY_OPTS} style={{ width: 170 }} popupMatchSelectWidth={false} /></Form.Item>
              {kyWatch === 'tuy'
                ? <Form.Item name="range" noStyle rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
                    <RangePicker style={{ flex: 1 }} format={DATE_FORMAT} placeholder={['Từ ngày', 'Đến ngày']} allowClear={false} /></Form.Item>
                : <Form.Item name="anchor" noStyle>
                    <DatePicker style={{ flex: 1 }} allowClear={false}
                      picker={kyWatch === 'ngay' ? 'date' : kyWatch === 'tuan' ? 'week' : kyWatch === 'thang' ? 'month' : kyWatch === 'quy' ? 'quarter' : 'year'}
                      format={kyWatch === 'ngay' ? DATE_FORMAT : kyWatch === 'tuan' ? (v => `${v.startOf('week').format('DD/MM')} – ${v.endOf('week').format('DD/MM/YYYY')}`)
                        : kyWatch === 'thang' ? 'MM/YYYY' : kyWatch === 'quy' ? (v => `Quý ${Math.floor(v.month() / 3) + 1}/${v.year()}`) : 'YYYY'} /></Form.Item>}
            </Space.Compact>
          </Form.Item>
          <Form.Item label={<Space size={4}>Phạm vi vụ việc<Tooltip title={<div>{PHAM_OPTS.map(o => <div key={o.value}><b>{o.label}:</b> {o.desc}</div>)}</div>}><I.QuestionCircleOutlined style={{ opacity: .6 }} /></Tooltip></Space>}
            name="pham">
            <Select options={PHAM_OPTS.map(o => ({ value: o.value, label: o.label }))} />
          </Form.Item>
          <Form.Item label=" ">
            <Space>
              <Button icon={<I.ReloadOutlined />} onClick={reset}>Xóa lọc</Button>
              <Button type="primary" htmlType="submit" icon={<I.SearchOutlined />}>Xem sổ</Button>
            </Space>
          </Form.Item>
        </div>

        {advOpen && <div className="adv">
          <Row gutter={[16, 4]}>
            <Col xs={24} md={12} xl={6}><Form.Item label="Thẩm phán giải quyết" name="tp">
              <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Tất cả" options={tpOpts} /></Form.Item></Col>
            <Col xs={24} md={12} xl={6}><Form.Item label={ndLabel} name="nd">
              <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Tất cả" options={ndOpts} showSearch /></Form.Item></Col>
            <Col xs={24} md={12} xl={6}><Form.Item label="Kết quả giải quyết" name="kq">
              <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Tất cả" options={def ? Object.entries(def.status).map(([k, [l]]) => ({ value: k, label: l })) : []} /></Form.Item></Col>
            {isST && <Col xs={24} md={12} xl={6}><Form.Item label="Kháng cáo, kháng nghị" name="kckn"><Select options={KCKN_OPTS} /></Form.Item></Col>}
            {isCivil && <Col xs={24} md={12} xl={6}><Form.Item label="Loại" name="viec">
              <Segmented block options={[{ value: 'all', label: 'Tất cả' }, { value: 'vu', label: 'Vụ án' }, { value: 'viec', label: 'Việc' }]} /></Form.Item></Col>}
            <Col xs={24}><Form.Item label="Đặc điểm" name="dd" style={{ marginBottom: 8 }}>
              <Checkbox.Group className="dd-group" options={DD_OPTS} /></Form.Item></Col>
          </Row>
          <Flex justify="flex-end" gap={8}>
            <Button size="small" onClick={() => { form.setFieldsValue({ tp: [], nd: [], kq: [], viec: 'all', kckn: 'all', dd: [] }); }}>Xóa bộ lọc nâng cao</Button>
            <Button size="small" type="primary" ghost htmlType="submit">Áp dụng</Button>
          </Flex>
        </div>}
      </Form>

      <Flex className="fquick" gap={8} wrap align="center">
        <Text type="secondary" style={{ fontSize: 12.5 }}><I.ThunderboltOutlined /> Xem nhanh:</Text>
        <button type="button" className="qchip" onClick={() => quick({ ky: 'thang', anchor: TODAY, pham: 'moi' })}>Thụ lý trong tháng</button>
        <button type="button" className="qchip" onClick={() => quick({ pham: 'conlai' })}>Còn tồn chưa giải quyết</button>
        <button type="button" className="qchip" onClick={() => quick({ pham: 'dagq' })}>Đã giải quyết trong kỳ</button>
        <button type="button" className="qchip" onClick={() => quick({ pham: 'phai', dd: ['qh'] })}>Quá hạn luật định</button>
        {isST && <button type="button" className="qchip" onClick={() => quick({ kckn: 'co' })}>Có kháng cáo, kháng nghị</button>}
        {isHS && <button type="button" className="qchip" onClick={() => quick({ dd: ['u18'] })}>Có người dưới 18 tuổi</button>}
        <button type="button" className="qchip" onClick={() => quick({ ky: 'tuan', anchor: TODAY, pham: 'moi' })}>Thụ lý trong tuần</button>
        <button type="button" className="qchip" onClick={() => quick({ ky: 'nam', anchor: TODAY, pham: 'moi' })}>Thụ lý trong năm</button>
        <div style={{ flex: 1 }} />
        <Badge count={advCount} size="small" color="#b3202d">
          <Button size="small" type={advOpen ? 'primary' : 'default'} ghost={advOpen} icon={advOpen ? <I.UpOutlined /> : <I.SlidersOutlined />} onClick={() => setAdvOpen(!advOpen)}>{advOpen ? 'Thu gọn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}</Button>
        </Badge>
        <Dropdown trigger={['click']} menu={{ items: [
          ...(saved.length ? saved.map(s => ({ key: 's:' + s.name, label: <Flex justify="space-between" gap={16} style={{ minWidth: 220 }}><span>{s.name}</span>
              <I.DeleteOutlined style={{ opacity: .5 }} onClick={e => { e.stopPropagation(); delSaved(s.name); }} /></Flex>, onClick: () => loadSaved(s) }))
            : [{ key: 'none', disabled: true, label: 'Chưa có bộ lọc đã lưu' }]),
          { type: 'divider' },
          { key: 'save', icon: <I.SaveOutlined />, label: 'Lưu bộ lọc hiện tại…', onClick: () => setSaveOpen(true) }] }}>
          <Button size="small" icon={<I.StarOutlined />}>Bộ lọc đã lưu ({saved.length})</Button>
        </Dropdown>
      </Flex>

      {tags.length > 0 && <Flex className="ftags" gap={6} wrap align="center">
        <Text type="secondary" style={{ fontSize: 12.5 }}>Đang lọc:</Text>
        {tags.map(t => <Tag key={t.f + t.v} closable bordered={false} color="red" onClose={e => { e.preventDefault(); removeTag(t.f, t.v); }}>{t.label}</Tag>)}
        <Button type="link" size="small" onClick={() => quick({})}>Xóa tất cả</Button>
      </Flex>}

      <Modal title="Lưu bộ lọc" open={saveOpen} onOk={doSave} onCancel={() => setSaveOpen(false)} okText="Lưu" cancelText="Huỷ" destroyOnClose>
        <Text type="secondary">Lưu đơn vị, kỳ, phạm vi và bộ lọc nâng cao hiện tại để dùng lại cho sổ này.</Text>
        <Input autoFocus style={{ marginTop: 12 }} placeholder="Ví dụ: Vụ tồn của Thẩm phán Hạnh" value={saveName} onChange={e => setSaveName(e.target.value)} onPressEnter={doSave} maxLength={60} />
      </Modal>
    </Card>

    {!def ? <Card className="pg-card"><Result icon={<I.FileSearchOutlined style={{ color: token.colorTextQuaternary }} />} title="Chức năng đang được phát triển"
        subTitle={`Sổ “${tabLabel}” đang chờ biểu mẫu nghiệp vụ. Khi có mẫu, sổ dùng chung bộ lọc và bảng như các sổ đã có.`}
        extra={<Button type="primary" onClick={() => { location.hash = 'HS_ST'; }}>Xem ví dụ: Hình sự sơ thẩm</Button>} /></Card>
    : <Card className={'pg-card' + (fs ? ' fs' : '')} styles={{ body: { padding: '16px 20px 8px' } }}>
        <Flex gap={12} wrap align="center" justify="space-between" style={{ marginBottom: 14 }}>
          <Flex gap={10} align="center" wrap style={{ minWidth: 0 }}>
            <span className="tc-bar" />
            <div>
              <Flex gap={8} align="center" wrap>
                <Text strong style={{ fontSize: 15.5 }}>{def.listTitle || 'Danh sách vụ việc thụ lý'}</Text>
                <span className="count-pill">{list.length} bản ghi</span>
                {status && <Tag closable bordered={false} color={def.status[status][1]} onClose={() => setStatus(null)} style={{ marginInlineEnd: 0 }}>{def.status[status][0]}</Tag>}
              </Flex>
              <Text type="secondary" style={{ fontSize: 12.5 }}>
                <I.CalendarOutlined /> {applied.range[0].format(DATE_FORMAT)} – {applied.range[1].format(DATE_FORMAT)}
                <span className="sep">•</span><I.BankOutlined /> {donViText}<span className="sep">•</span><I.AimOutlined /> {PHAM_OPTS.find(o => o.value === applied.pham).label}</Text>
            </div>
          </Flex>
          <Flex gap={8} wrap align="center">
            <Input allowClear prefix={<I.SearchOutlined style={{ color: token.colorTextTertiary }} />} placeholder="Nhập từ khóa tìm kiếm..." className="q-input"
              style={{ width: screens.md ? 280 : '100%' }} value={q} onChange={e => { setQ(e.target.value); setPg(p => ({ ...p, current: 1 })); }} />
            <Popover trigger="click" placement="bottomRight" content={colSetting}>
              <Tooltip title="Cột hiển thị"><Button icon={<I.SettingOutlined />}>{nCot}/{leaves(def.cols).length}</Button></Tooltip>
            </Popover>
            <Tooltip title="Làm mới"><Button icon={<I.ReloadOutlined />} onClick={reload} /></Tooltip>
            <Tooltip title={fs ? 'Thoát toàn màn hình' : 'Toàn màn hình'}><Button icon={fs ? <I.FullscreenExitOutlined /> : <I.FullscreenOutlined />} onClick={() => setFs(!fs)} /></Tooltip>
          </Flex>
        </Flex>
        <Table className="so-table" rowKey="_id" bordered size="small" loading={loading} columns={columns} dataSource={list}
          scroll={{ x: scrollX, y: fs ? 'calc(100vh - 200px)' : 'calc(100vh - 260px)' }}
          onRow={r => ({ onClick: () => setRow(r) })}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /> }}
          pagination={{ ...pg, size: 'default', showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [10, 20, 50, 100],
            showTotal: (t, r) => `Hiển thị ${r[0]}-${r[1]} trong tổng ${t} bản ghi`, onChange: (current, pageSize) => setPg({ current, pageSize }) }} />
      </Card>}
    {def && <ChiTietDrawer row={row} def={def} onClose={() => setRow(null)} isMobile={!screens.md} />}
  </div>;
}

/* ---------- khung ứng dụng (antdex layout: side menu + header đỏ thẫm) ---------- */
function Shell({ dark, setDark }) {
  const { message } = AntApp.useApp();
  const screens = Grid.useBreakpoint();
  const fromHash = () => { const h = location.hash.slice(1); return findLoai(h) ? h : 'HS_ST'; };
  const [soId, setSoIdState] = useState(fromHash);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { const f = () => setSoIdState(fromHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const setSoId = k => { history.replaceState(null, '', '#' + k); setSoIdState(k); };
  const loai = findLoai(soId);

  const menuItems = [
    { key: 'home', icon: <I.HomeOutlined />, label: 'Trang chủ' },
    { key: 'don', icon: <I.InboxOutlined />, label: 'Quản lý đơn' },
    { key: 'vuan', icon: <I.FolderOpenOutlined />, label: 'Quản lý vụ án' },
    { key: 'baocao', icon: <I.BarChartOutlined />, label: 'Báo cáo', children: [
      { key: 'sothuly', icon: <I.BookOutlined />, label: 'Sổ thụ lý', children: LOAI.map(l => ({ key: 'loai:' + l.key, label: l.label })) },
      { key: 'thongke', icon: <I.PieChartOutlined />, label: 'Báo cáo thống kê' }] },
    { key: 'cauhinh', icon: <I.SettingOutlined />, label: 'Cấu hình' },
  ];
  const onMenu = ({ key }) => {
    if (key.startsWith('loai:')) { setSoId(LOAI_MAP[key.slice(5)].tabs[0].key); if (!screens.lg) setCollapsed(true); }
    else message.info('Mockup chỉ minh họa phân hệ Sổ thụ lý');
  };
  const hbtn = (icon, tip, onClick, cls = '') => <Tooltip title={tip}><Button type="text" className={'hbtn ' + cls} icon={icon} size="large" onClick={onClick || (() => message.info('Mô phỏng'))} /></Tooltip>;

  return <Layout style={{ minHeight: '100vh' }} className={dark ? 'dark' : ''}>
    <Header className="app-header">
      {hbtn(collapsed ? <I.MenuUnfoldOutlined /> : <I.MenuFoldOutlined />, collapsed ? 'Mở menu' : 'Thu gọn menu', () => setCollapsed(!collapsed))}
      <div className="logo"><div className="emblem"><I.BankOutlined /></div><span className="long">HỆ THỐNG QUẢN LÝ ÁN</span></div>
      <Tag color="gold" style={{ marginLeft: 4 }}>MOCKUP</Tag>
      <div className="sp" />
      {hbtn(<I.SearchOutlined />, 'Tìm kiếm', null, 'hide-sm')}
      {hbtn(<I.AppstoreOutlined />, 'Ứng dụng', null, 'hide-sm')}
      {hbtn(<Badge count={3} size="small"><I.BellOutlined style={{ color: '#fff' }} /></Badge>, 'Thông báo')}
      {hbtn(dark ? <I.SunOutlined /> : <I.MoonOutlined />, dark ? 'Giao diện sáng' : 'Giao diện tối', () => setDark(!dark))}
      <Flex align="center" gap={8} style={{ marginLeft: 8 }}>
        <Avatar style={{ background: '#fff', color: BRAND }} icon={<I.UserOutlined />} />
        <div className="who">Nguyễn Văn A<br /><small>Tòa án nhân dân tối cao</small></div>
      </Flex>
    </Header>
    <Layout>
      <Sider width={280} collapsedWidth={screens.md ? 64 : 0} collapsible trigger={null} collapsed={collapsed} breakpoint="lg"
        onBreakpoint={b => setCollapsed(b)} style={{ position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflow: 'auto', borderRight: `1px solid ${dark ? '#303030' : 'rgba(0,0,0,.06)'}` }}>
        <Menu className="side-menu" mode="inline" items={menuItems} selectedKeys={['loai:' + loai.key]}
          defaultOpenKeys={['baocao', 'sothuly']} onClick={onMenu} style={{ borderInlineEnd: 0, paddingTop: 8 }} />
      </Sider>
      <Layout>
        <Content style={{ padding: '16px 20px', minWidth: 0 }}>
          <ConfigProvider theme={{ token: { colorPrimary: dark ? '#e04352' : '#b3202d', borderRadius: 8 } }}><SoThuLyPage key={loai.key} loai={loai} soId={soId} setSoId={setSoId} dark={dark} /></ConfigProvider>
        </Content>
        <Footer style={{ textAlign: 'center', padding: '12px 16px', fontSize: 12 }}>© 2026 Tòa án nhân dân tối cao · Hệ thống quản lý án · Mockup giao diện, dữ liệu giả lập</Footer>
      </Layout>
    </Layout>
  </Layout>;
}

function Root() {
  const [dark, setDark] = useState(false);
  return <ConfigProvider locale={antd.locales && antd.locales.vi_VN}
    theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: TOKEN, components: components(dark) }}>
    <AntApp message={{ maxCount: 3 }}><Shell dark={dark} setDark={setDark} /></AntApp>
  </ConfigProvider>;
}

export default function SoThuLy() {
  const [dark, setDark] = useState(false);
  const fromHash = () => { const h = window.location.hash.slice(1); return findLoai(h) ? h : 'HS_ST'; };
  const [soId, setSoIdState] = useState(fromHash);
  useEffect(() => { const f = () => setSoIdState(fromHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const setSoId = (k: string) => { window.history.replaceState(null, '', '#' + k); setSoIdState(k); };
  const loai = findLoai(soId);

  return (
    <div className={dark ? 'dark' : ''}>
        <SoThuLyPage key={loai.key} loai={loai} soId={soId} setSoId={setSoId} dark={dark} />
    </div>
  );
}
