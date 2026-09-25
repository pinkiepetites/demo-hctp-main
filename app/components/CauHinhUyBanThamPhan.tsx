import React, { useMemo, useState } from "react";
import {
  Alert, AutoComplete, Button, Card, Checkbox, ConfigProvider, DatePicker, Input, InputNumber,
  Modal, Popconfirm, Select, Table, Tabs, Tag, Tooltip, Typography, message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Clock, Eye, Pencil, Plus, Search, Send, Trash2, TriangleAlert, Info, Save,
} from "lucide-react";
import { DANH_SACH_THAM_PHAN } from "../gdt/hdxxConfig";

/* ─────────────────────────────────────────────────────────────────────────────
 * CẤU HÌNH ỦY BAN THẨM PHÁN
 *
 * Mỗi TAND cấp tỉnh có MỘT Ủy ban Thẩm phán, thành viên gồm hai phần:
 *   • Thành viên đương nhiên — Chánh án, các Phó Chánh án (Điều 57). Tự nạp theo
 *     chức vụ, không sửa được.
 *   • Thẩm phán được chỉ định — phần duy nhất được chọn, tổng không vượt số
 *     lượng Chánh án TANDTC đã duyệt.
 * Thành viên gắn theo KỲ hiệu lực (theo quyết định của Chánh án TANDTC). Kỳ đã
 * đóng không sửa được: biên bản phiên họp tra thành viên theo ngày họp.
 *
 * cap = "tinh"   → chỉ thấy và cấu hình Ủy ban của chính tòa mình.
 * cap = "toicao" → xem Ủy ban của tất cả tỉnh/thành (chỉ xem, không sửa).
 * ────────────────────────────────────────────────────────────────────────────*/

dayjs.extend(customParseFormat);

const RED = "#8b1a1a";
const MUTED = "#667085";
const { Text } = Typography;

const FMT = "DD/MM/YYYY";
const homNay = () => dayjs().format(FMT);

// ─── Kiểu dữ liệu ────────────────────────────────────────────────────────────

type DuongNhien = { id: string; ten: string; ngach: string; chucDanh: string; chucVu: string; chuTri?: boolean; ngayVao?: string; };
type ChiDinh = { id: string; ten: string; chucDanh: string; chucVu: string; donVi: string; ngayVao: string };
type UngVien = { id: string; ten: string; chucDanh: string; chucVu: string; donVi: string; soVu: number };

type Ky = {
  id: string;
  tuNgay: string;
  denNgay: string | null;       // null = đang mở
  soQD: string;
  ngayQD: string;
  soDuocDuyet: number;
  duongNhien: DuongNhien[];
  chiDinh: ChiDinh[];
};

type Nhap = {
  soQD: string;
  ngayQD: string | null;
  soDuocDuyet: number | null;
  duongNhien: DuongNhien[];
  chiDinh: ChiDinh[];
};

type UyBan = {
  toaAn: string;
  kyHienHanh: Ky;
  lichSu: Ky[];                 // các kỳ đã đóng, mới nhất trước
  nhap: Nhap | null;
  ungVien: UngVien[];           // thẩm phán của tòa, dùng cho modal chọn
};

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────

/** 34 tỉnh/thành sau sắp xếp đơn vị hành chính 2025. */
const TINH_THANH = [
  "thành phố Hà Nội", "thành phố Huế", "thành phố Hải Phòng", "thành phố Đà Nẵng",
  "Thành phố Hồ Chí Minh", "thành phố Cần Thơ",
  "tỉnh Lai Châu", "tỉnh Điện Biên", "tỉnh Sơn La", "tỉnh Lạng Sơn", "tỉnh Quảng Ninh",
  "tỉnh Thanh Hóa", "tỉnh Nghệ An", "tỉnh Hà Tĩnh", "tỉnh Cao Bằng", "tỉnh Tuyên Quang",
  "tỉnh Lào Cai", "tỉnh Thái Nguyên", "tỉnh Phú Thọ", "tỉnh Bắc Ninh", "tỉnh Hưng Yên",
  "tỉnh Ninh Bình", "tỉnh Quảng Trị", "tỉnh Quảng Ngãi", "tỉnh Gia Lai", "tỉnh Khánh Hòa",
  "tỉnh Lâm Đồng", "tỉnh Đắk Lắk", "tỉnh Đồng Nai", "tỉnh Tây Ninh", "tỉnh Vĩnh Long",
  "tỉnh Đồng Tháp", "tỉnh Cà Mau", "tỉnh An Giang",
].map(t => `TAND ${t}`);

export const TOA_AN_TINH_MAC_DINH = "TAND thành phố Hà Nội";

const TOA_CHUYEN_TRACH = [
  "Tòa Hình sự", "Tòa Dân sự", "Tòa Hành chính", "Tòa Kinh tế", "Tòa Lao động",
  "Tòa Gia đình và người chưa thành niên",
];

const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đỗ", "Bùi", "Ngô", "Đinh", "Đặng", "Phan", "Trịnh", "Cao", "Lý"];
const DEM = ["Văn", "Thị", "Minh", "Quốc", "Thanh", "Đức", "Thu", "Hồng", "Ngọc", "Quang"];
const TEN = ["An", "Bảo", "Hằng", "Tuấn", "Hải", "Sơn", "Mai", "Nam", "Lan", "Trung", "Huy", "Thu", "Điệp", "Ngọc", "Phong", "Hà", "Giang", "Khoa", "Linh", "Dũng"];

/** Sinh cố định theo chỉ số — không random để mỗi lần mở vẫn thấy đúng dữ liệu cũ. */
const tenTheo = (seed: number) =>
  `${HO[seed % HO.length]} ${DEM[(seed * 7 + 3) % DEM.length]} ${TEN[(seed * 13 + 5) % TEN.length]}`;

const p2 = (n: number) => String(n).padStart(2, "0");

function uyBanHaNoi(): UyBan {
  const tp = DANH_SACH_THAM_PHAN;
  const laUyBan = (donVi: string) => donVi.startsWith("Ủy ban");
  const duongNhien: DuongNhien[] = tp
    .filter(t => t.chucVu !== "Thẩm phán")
    .map((t, i) => ({ id: t.id, ten: t.ten, ngach: "Thẩm phán bậc 1", chucDanh: "Thẩm phán TAND", chucVu: t.chucVu, chuTri: i === 0 }));
  const chiDinh: ChiDinh[] = tp
    .filter(t => t.chucVu === "Thẩm phán" && laUyBan(t.donVi))
    .map((t, i) => ({
      id: t.id, ten: t.ten, chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",
      donVi: TOA_CHUYEN_TRACH[i % TOA_CHUYEN_TRACH.length], ngayVao: "15/01/2026",
    }));
  const ungVien: UngVien[] = [
    ...chiDinh.map((c, i) => ({ id: c.id, ten: c.ten, chucDanh: c.chucDanh, chucVu: c.chucVu, donVi: c.donVi, soVu: 6 + (i * 5) % 11 })),
    ...tp.filter(t => t.chucVu === "Thẩm phán" && !laUyBan(t.donVi))
      .map((t, i) => ({ id: t.id, ten: t.ten, chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán", donVi: t.donVi, soVu: 7 + (i * 3) % 9 })),
  ];
  const soDuocDuyet = duongNhien.length + chiDinh.length;
  return {
    toaAn: TOA_AN_TINH_MAC_DINH,
    kyHienHanh: {
      id: "hn-3", tuNgay: "15/01/2026", denNgay: null, soQD: "412/QĐ-TANDTC", ngayQD: "05/01/2026",
      soDuocDuyet, duongNhien, chiDinh,
    },
    lichSu: [
      {
        id: "hn-2", tuNgay: "01/03/2025", denNgay: "14/01/2026", soQD: "187/QĐ-TANDTC", ngayQD: "20/02/2025",
        soDuocDuyet: soDuocDuyet - 2, duongNhien,
        chiDinh: chiDinh.slice(0, chiDinh.length - 2).map(c => ({ ...c, ngayVao: "01/03/2025" })),
      },
      {
        id: "hn-1", tuNgay: "10/06/2024", denNgay: "28/02/2025", soQD: "094/QĐ-TANDTC", ngayQD: "31/05/2024",
        soDuocDuyet: soDuocDuyet - 3, duongNhien: duongNhien.slice(0, 2),
        chiDinh: chiDinh.slice(1, chiDinh.length - 1).map(c => ({ ...c, ngayVao: "10/06/2024" })),
      },
    ],
    nhap: null,
    ungVien,
  };
}

function uyBanSinh(toaAn: string, idx: number): UyBan {
  const s = idx * 31 + 11;
  const soPho = 1 + (idx % 3);
  const soChiDinh = 3 + (idx * 5) % 5;
  const duongNhien: DuongNhien[] = Array.from({ length: soPho + 1 }, (_, i) => ({
    id: `${idx}-dn-${i}`, ten: tenTheo(s + i), ngach: i === 0 ? "Thẩm phán bậc 1" : "Thẩm phán bậc 2",
    chucDanh: "Thẩm phán TAND", chucVu: i === 0 ? "Chánh án" : "Phó Chánh án", chuTri: i === 0,
  }));
  const thang = 1 + (idx % 9);
  const tuNgay = `${p2(5 + idx % 20)}/${p2(thang)}/2026`;
  const chiDinh: ChiDinh[] = Array.from({ length: soChiDinh }, (_, i) => ({
    id: `${idx}-cd-${i}`, ten: tenTheo(s + 10 + i), chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",
    donVi: TOA_CHUYEN_TRACH[(idx + i) % TOA_CHUYEN_TRACH.length], ngayVao: tuNgay,
  }));
  const ungVien: UngVien[] = [
    ...chiDinh.map((c, i) => ({ ...c, soVu: 5 + (i * 7 + idx) % 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `${idx}-uv-${i}`, ten: tenTheo(s + 30 + i), chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",
      donVi: TOA_CHUYEN_TRACH[(idx * 3 + i) % TOA_CHUYEN_TRACH.length], soVu: 4 + (i * 5 + idx) % 13,
    })),
  ];
  const soDuocDuyet = duongNhien.length + soChiDinh + (idx % 4 === 0 ? 1 : 0);
  const soQD = String(100 + idx * 9).padStart(3, "0");
  return {
    toaAn,
    kyHienHanh: {
      id: `${idx}-2`, tuNgay, denNgay: null, soQD: `${soQD}/QĐ-TANDTC`, ngayQD: `01/${p2(thang)}/2026`,
      soDuocDuyet, duongNhien, chiDinh,
    },
    lichSu: [{
      id: `${idx}-1`, tuNgay: `${p2(1 + idx % 27)}/0${1 + idx % 9}/2024`,
      denNgay: dayjs(tuNgay, FMT).subtract(1, "day").format(FMT),
      soQD: `${String(20 + idx * 4).padStart(3, "0")}/QĐ-TANDTC`, ngayQD: `15/0${1 + idx % 9}/2024`,
      soDuocDuyet: soDuocDuyet - 1, duongNhien, chiDinh: chiDinh.slice(1),
    }],
    // Vài tỉnh đang lập kỳ mới, để tổng hợp ở tối cao có trạng thái khác nhau
    nhap: idx % 5 === 2
      ? { soQD: "", ngayQD: null, soDuocDuyet: null, duongNhien: duongNhien.slice(), chiDinh: chiDinh.slice() }
      : null,
    ungVien,
  };
}

function khoiTao(): Record<string, UyBan> {
  const kq: Record<string, UyBan> = {};
  TINH_THANH.forEach((t, i) => { kq[t] = t === TOA_AN_TINH_MAC_DINH ? uyBanHaNoi() : uyBanSinh(t, i); });
  return kq;
}

// ─── Thành phần nhỏ ──────────────────────────────────────────────────────────

const Nhan = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, fontWeight: 500, color: MUTED, marginBottom: 4 }}>{children}</div>
);

const TruongXem = ({ nhan, giaTri, w }: { nhan: string; giaTri: React.ReactNode; w: number }) => (
  <div style={{ width: w }}>
    <Nhan>{nhan}</Nhan>
    <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: "32px" }}>{giaTri}</div>
  </div>
);

const TagTrangThaiKy = ({ ky }: { ky: Ky }) =>
  ky.denNgay ? <Tag>Hết hiệu lực</Tag> : <Tag color="success">Có hiệu lực</Tag>;

const kyHieuLuc = (ky: Ky) => ky.denNgay ? `${ky.tuNgay} — ${ky.denNgay}` : `Từ ${ky.tuNgay} — đang mở`;

const TongDuocDuyet = ({ tong, duocDuyet }: { tong: number; duocDuyet: number | null }) => {
  const vuot = duocDuyet != null && tong > duocDuyet;
  return (
    <Tag color={duocDuyet == null ? "default" : vuot ? "error" : "success"}
      style={{ fontWeight: 700, fontSize: 12.5, padding: "3px 10px", marginInlineEnd: 0 }}>
      Tổng {tong} / {duocDuyet ?? "?"} được duyệt
    </Tag>
  );
};

// ─── Bảng thành viên ─────────────────────────────────────────────────────────

const cotSTT = { title: "STT", width: 56, align: "center" as const, render: (_: unknown, __: unknown, i: number) => <Text type="secondary">{i + 1}</Text> };

const CHUC_VU_DUONG_NHIEN = ["Chánh án", "Phó Chánh án Thường trực", "Phó Chánh án"];
const NGACH = ["Thẩm phán bậc 1", "Thẩm phán bậc 2", "Thẩm phán bậc 3"];

/** Thành viên đương nhiên nạp theo chức vụ nhưng VẪN SỬA ĐƯỢC: khi Chánh án /
 *  Phó Chánh án thay đổi mà dữ liệu nhân sự chưa kịp đồng bộ, tòa tự cập nhật
 *  tại đây thay vì phải chờ sửa phần mềm. */
function BangDuongNhien({ ds, toaAn, onSua, onXoa }: {
  ds: DuongNhien[]; toaAn: string;
  onSua?: (r: DuongNhien) => void;
  onXoa?: (id: string) => void;
}) {
  const cot: ColumnsType<DuongNhien> = [
    cotSTT,
    {
      title: "Họ tên", dataIndex: "ten", width: 240,
      render: (v, r) => <div><div style={{ fontWeight: 600 }}>{v}</div><Text type="secondary" style={{ fontSize: 12 }}>{r.ngach}</Text></div>,
    },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },
    { title: "Đơn vị", width: 200, render: (_, r) => (r as any).donVi || toaAn },
    { title: "Ngày vào ủy ban", width: 140, render: (_, r) => r.ngayVao || "-" },
    {
      title: "Loại thành viên",
      render: (_, r) => <>
        <Tag color="blue">Thành viên đương nhiên</Tag>
        {r.chuTri && <Tag color="success">Chủ trì phiên họp</Tag>}
      </>,
    },
  ];
  if (onSua && onXoa) cot.push({
    title: "", width: 96, align: "center",
    render: (_, r) => (
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        <Tooltip title="Sửa thành viên">
          <Button size="small" aria-label="Sửa thành viên" icon={<Pencil size={14} />} onClick={() => onSua(r)} />
        </Tooltip>
        <Popconfirm title={`Bỏ ${r.ten} khỏi thành viên đương nhiên?`} okText="Bỏ" cancelText="Không"
          onConfirm={() => onXoa(r.id)}>
          <Tooltip title="Bỏ khỏi Ủy ban">
            <Button danger size="small" aria-label="Bỏ khỏi Ủy ban" icon={<Trash2 size={14} />} />
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  });
  return <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false}
    locale={{ emptyText: "Chưa có thành viên đương nhiên" }} />;
}

/** Thêm / sửa một thành viên đương nhiên. Họ tên gõ tự do hoặc chọn từ danh sách
 *  thẩm phán của tòa — Chánh án mới có thể điều động từ nơi khác nên chưa có sẵn. */
function ModalDuongNhien({ banGhi, ungVien, onDong, onLuu }: {
  banGhi: DuongNhien | "moi" | null;
  ungVien: UngVien[];
  onDong: () => void;
  onLuu: (r: DuongNhien) => void;
}) {
  const cu = banGhi && banGhi !== "moi" ? banGhi : null;
  const [ten, setTen] = useState(cu?.ten ?? "");
  const [ngach, setNgach] = useState(cu?.ngach ?? "Thẩm phán bậc 1");
  const [chucVu, setChucVu] = useState<string | undefined>(cu?.chucVu);
  const [chuTri, setChuTri] = useState(!!cu?.chuTri);

  const luuDuoc = !!ten.trim() && !!chucVu;
  const khopTen = ungVien.filter(u => u.ten.toLowerCase().includes(ten.trim().toLowerCase()));

  return (
    <Modal open={!!banGhi} onCancel={onDong} width={520}
      title={cu ? "Sửa thành viên đương nhiên" : "Thêm thành viên đương nhiên"}
      okText={cu ? "Cập nhật" : "Thêm"} cancelText="Hủy" okButtonProps={{ disabled: !luuDuoc }}
      onOk={() => onLuu({
        id: cu?.id ?? `dn-${Date.now()}`,
        ten: ten.trim(), ngach, chucVu: chucVu!, chuTri,
      })}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
        <div>
          <Nhan>Họ tên *</Nhan>
          <AutoComplete value={ten} onChange={setTen} style={{ width: "100%" }}
            placeholder="Nhập hoặc chọn thẩm phán..."
            options={khopTen.map(u => ({ value: u.ten, label: `${u.ten} — ${u.donVi}` }))} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Nhan>Chức vụ *</Nhan>
            <Select value={chucVu} onChange={setChucVu} placeholder="Chọn chức vụ" style={{ width: "100%" }}
              options={CHUC_VU_DUONG_NHIEN.map(c => ({ value: c, label: c }))} />
          </div>
          <div style={{ flex: 1 }}>
            <Nhan>Ngạch thẩm phán</Nhan>
            <Select value={ngach} onChange={setNgach} style={{ width: "100%" }}
              options={NGACH.map(c => ({ value: c, label: c }))} />
          </div>
        </div>
        <Checkbox checked={chuTri} onChange={e => setChuTri(e.target.checked)}>
          Chủ trì phiên họp <Text type="secondary" style={{ fontSize: 12 }}>(chỉ một người — chọn người này sẽ bỏ người cũ)</Text>
        </Checkbox>
      </div>
    </Modal>
  );
}

function BangChiDinh({ ds, onBo }: { ds: ChiDinh[]; onBo?: (id: string) => void }) {
  const cot: ColumnsType<ChiDinh> = [
    cotSTT,
    { title: "Họ tên", dataIndex: "ten", width: 240, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },
    { title: "Đơn vị", dataIndex: "donVi", width: 200 },
    { title: "Ngày vào ủy ban", dataIndex: "ngayVao", width: 140 },
    { title: "Loại thành viên", render: () => <Tag color="cyan">Thẩm phán được chỉ định</Tag> },
  ];
  
  if (onBo) {
    cot.push({
      title: "", width: 60, align: "center",
      render: (_, r) => (
        <Tooltip title="Bỏ khỏi Ủy ban">
          <Button danger size="small" aria-label="Bỏ khỏi Ủy ban" icon={<Trash2 size={14} />} onClick={() => onBo(r.id)} />
        </Tooltip>
      ),
    });
  }
  return (
    <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false}
      locale={{ emptyText: "Chưa chỉ định thẩm phán nào" }} />
  );
}

// ─── Modal chọn thẩm phán ────────────────────────────────────────────────────

function ModalChonThamPhan({ open, uyBan, daChon, conNhan, onDong, onThem }: {
  open: boolean;
  uyBan: UyBan;
  daChon: string[];              // id đã nằm trong Ủy ban (nháp)
  conNhan: number | null;        // null = chưa có số được duyệt
  onDong: () => void;
  onThem: (ds: UngVien[]) => void;
}) {
  const [tuKhoa, setTuKhoa] = useState("");
  const [donVi, setDonVi] = useState<string>();
  const [chon, setChon] = useState<React.Key[]>([]);

  const ds = uyBan.ungVien.filter(u =>
    (!donVi || u.donVi === donVi) &&
    (!tuKhoa.trim() || u.ten.toLowerCase().includes(tuKhoa.trim().toLowerCase())));

  const vuot = conNhan != null && chon.length > conNhan;

  const dong = () => { setChon([]); setTuKhoa(""); setDonVi(undefined); onDong(); };

  const cot: ColumnsType<UngVien> = [
    { title: "Họ tên", dataIndex: "ten", render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 140 },
    { title: "Đơn vị", dataIndex: "donVi", width: 220 },
    {
      title: "Số vụ đang giữ", width: 150,
      render: (_, r) => daChon.includes(r.id) ? <Tag>Đã trong Ủy ban</Tag> : `${r.soVu} vụ`,
    },
  ];

  return (
    <Modal open={open} onCancel={dong} width={880}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 32 }}>
          <span>Chọn Thẩm phán vào Ủy ban Thẩm phán</span>
          <span style={{ flex: 1 }} />
          {conNhan != null && (
            <Text type={conNhan - chon.length <= 0 ? "danger" : "secondary"} style={{ fontSize: 12, fontWeight: 500 }}>
              còn nhận thêm được {Math.max(0, conNhan - chon.length)} người
            </Text>
          )}
        </div>
      }
      footer={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Text strong>Đã chọn {chon.length} thẩm phán</Text>
          {vuot && <Tag color="error">Sẽ vượt số lượng được duyệt</Tag>}
          <span style={{ flex: 1 }} />
          <Button onClick={dong}>Hủy</Button>
          <Button type="primary" disabled={chon.length === 0}
            onClick={() => { onThem(uyBan.ungVien.filter(u => chon.includes(u.id))); dong(); }}>
            Thêm vào Ủy ban
          </Button>
        </div>
      }>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Tìm theo họ tên..."
          value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} style={{ width: 280 }} />
        <Select allowClear placeholder="Tất cả đơn vị" value={donVi} onChange={setDonVi} style={{ width: 260 }}
          options={TOA_CHUYEN_TRACH.map(d => ({ value: d, label: d }))} />
      </div>
      <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false} scroll={{ y: 360 }}
        rowSelection={{
          selectedRowKeys: [...daChon, ...chon],
          getCheckboxProps: r => ({ disabled: daChon.includes(r.id) }),
          onChange: keys => setChon(keys.filter(k => !daChon.includes(String(k)))),
        }} />
    </Modal>
  );
}

// ─── Modal xem thành viên của một kỳ ─────────────────────────────────────────

function ModalXemKy({ ky, toaAn, onDong }: { ky: Ky | null; toaAn: string; onDong: () => void }) {
  return (
    <Modal open={!!ky} onCancel={onDong} width={1000} footer={<Button onClick={onDong}>Đóng</Button>}
      title={ky && <>Thành viên Ủy ban Thẩm phán · {kyHieuLuc(ky)}</>}>
      {ky && <>
        <div style={{ display: "flex", gap: 28, marginBottom: 16, flexWrap: "wrap" }}>
          <TruongXem w={240} nhan="Tòa án" giaTri={toaAn} />
          <TruongXem w={280} nhan="Quyết định của Chánh án TANDTC" giaTri={`${ky.soQD} · ${ky.ngayQD}`} />
          <TruongXem w={200} nhan="Số lượng được duyệt" giaTri={`${ky.soDuocDuyet} thành viên`} />
          <TruongXem w={140} nhan="Trạng thái" giaTri={<TagTrangThaiKy ky={ky} />} />
        </div>
        <Text strong>Thành viên đương nhiên</Text>
        <div style={{ margin: "8px 0 16px" }}><BangDuongNhien ds={ky.duongNhien} toaAn={toaAn} /></div>
        <Text strong>Thẩm phán được chỉ định</Text>
        <div style={{ marginTop: 8 }}><BangChiDinh ds={ky.chiDinh} /></div>
      </>}
    </Modal>
  );
}

// ─── Tab: Kỳ hiện hành ───────────────────────────────────────────────────────

function TabKyHienHanh({ uyBan, chiXem, capNhat, onXemLichSu }: {
  uyBan: UyBan;
  chiXem: boolean;
  capNhat: (f: (u: UyBan) => UyBan) => void;
  onXemLichSu: () => void;
}) {
  const [tuKhoa, setTuKhoa] = useState("");
  const [donVi, setDonVi] = useState<string>();
  const [loaiTV, setLoaiTV] = useState<"dn" | "cd">();
  const [moChon, setMoChon] = useState(false);
  const [suaDN, setSuaDN] = useState<DuongNhien | "moi" | null>(null);

  const ky = uyBan.kyHienHanh;
  const nhap = uyBan.nhap;
  const dangNhap = !!nhap && !chiXem;

  const duongNhien = dangNhap ? nhap!.duongNhien : ky.duongNhien;
  const chiDinh = dangNhap ? nhap!.chiDinh : ky.chiDinh;
  const duocDuyet = dangNhap ? nhap!.soDuocDuyet : ky.soDuocDuyet;
  const tong = duongNhien.length + chiDinh.length;
  const vuot = duocDuyet != null && tong > duocDuyet;

  const khop = (ten: string, dv: string) =>
    (!tuKhoa.trim() || ten.toLowerCase().includes(tuKhoa.trim().toLowerCase())) && (!donVi || dv === donVi);
  const dnHien = loaiTV === "cd" ? [] : duongNhien.filter(d => khop(d.ten, uyBan.toaAn));
  const cdHien = loaiTV === "dn" ? [] : chiDinh.filter(c => khop(c.ten, c.donVi));

  const suaNhap = (p: Partial<Nhap>) => capNhat(u => ({ ...u, nhap: { ...u.nhap!, ...p } }));

  /** Sửa đương nhiên: đang nháp thì sửa nháp, không thì sửa thẳng kỳ hiện hành
   *  (trường hợp Chánh án / Phó Chánh án đổi giữa kỳ). */
  const datDuongNhien = (f: (ds: DuongNhien[]) => DuongNhien[]) => capNhat(u => u.nhap
    ? { ...u, nhap: { ...u.nhap, duongNhien: f(u.nhap.duongNhien) } }
    : { ...u, kyHienHanh: { ...u.kyHienHanh, duongNhien: f(u.kyHienHanh.duongNhien) } });

  const luuDuongNhien = (r: DuongNhien) => {
    datDuongNhien(ds => {
      const moi = ds.some(d => d.id === r.id) ? ds.map(d => d.id === r.id ? r : d) : [...ds, r];
      return r.chuTri ? moi.map(d => d.id === r.id ? d : { ...d, chuTri: false }) : moi;
    });
    setSuaDN(null);
  };
  const soChanhAn = duongNhien.filter(d => d.chucVu === "Chánh án").length;

  const lapKyMoi = () => capNhat(u => ({
    ...u, nhap: {
      soQD: "", ngayQD: null, soDuocDuyet: null,
      duongNhien: u.kyHienHanh.duongNhien.slice(), chiDinh: u.kyHienHanh.chiDinh.slice(),
    },
  }));

  const thieu = dangNhap ? [
    !nhap!.soQD.trim() && "số quyết định",
    !nhap!.ngayQD && "ngày quyết định",
    nhap!.soDuocDuyet == null && "số lượng được duyệt",
  ].filter(Boolean) as string[] : [];
  const lapDeNghiDuoc = dangNhap && thieu.length === 0 && !vuot;

  /** Kỳ mới có hiệu lực từ hôm nay; kỳ cũ đóng vào hôm qua và chuyển sang lịch sử. */
  const lapDeNghi = () => capNhat(u => {
    const n = u.nhap!;
    const tuNgay = homNay();
    const kyCu: Ky = { ...u.kyHienHanh, denNgay: dayjs().subtract(1, "day").format(FMT) };
    const idCu = new Set(u.kyHienHanh.chiDinh.map(c => c.id));
    return {
      ...u,
      nhap: null,
      lichSu: [kyCu, ...u.lichSu],
      kyHienHanh: {
        id: `${u.toaAn}-${Date.now()}`, tuNgay, denNgay: null, soQD: n.soQD.trim(), ngayQD: n.ngayQD!,
        soDuocDuyet: n.soDuocDuyet!, duongNhien: n.duongNhien,
        chiDinh: n.chiDinh.map(c => idCu.has(c.id) ? c : { ...c, ngayVao: tuNgay }),
      },
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Bộ lọc */}
      <Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 240 }}>
            <Nhan>Tìm theo họ tên</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Nhập họ tên thẩm phán..."
              value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          </div>
          <div style={{ width: 240 }}>
            <Nhan>Đơn vị</Nhan>
            <Select allowClear placeholder="Tất cả đơn vị" value={donVi} onChange={setDonVi} style={{ width: "100%" }}
              options={[uyBan.toaAn, ...TOA_CHUYEN_TRACH].map(d => ({ value: d, label: d }))} />
          </div>
          <div style={{ width: 180 }}>
            <Nhan>Loại thành viên</Nhan>
            <Select allowClear placeholder="Tất cả" value={loaiTV} onChange={setLoaiTV} style={{ width: "100%" }}
              options={[{ value: "dn", label: "Thành viên đương nhiên" }, { value: "cd", label: "Được chỉ định" }]} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTuKhoa(""); setDonVi(undefined); setLoaiTV(undefined); }}>Xóa lọc</Button>
        </div>
      </Card>

      {/* Thông tin kỳ */}
      <Card size="small" title="Thông tin kỳ hiệu lực" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}
        extra={dangNhap ? <Tag color="warning">Nháp</Tag> : <TagTrangThaiKy ky={ky} />}>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", padding: "4px 0" }}>
          <TruongXem w={240} nhan="Tòa án" giaTri={uyBan.toaAn} />
          {dangNhap ? <>
            <div style={{ width: 280 }}>
              <Nhan>Số quyết định của Chánh án TANDTC</Nhan>
              <Input placeholder="VD: 428/QĐ-TANDTC" value={nhap!.soQD} onChange={e => suaNhap({ soQD: e.target.value })} />
            </div>
            <div style={{ width: 200 }}>
              <Nhan>Ngày quyết định</Nhan>
              <DatePicker format={FMT} style={{ width: "100%" }} placeholder="dd/mm/yyyy"
                value={nhap!.ngayQD ? dayjs(nhap!.ngayQD, FMT) : null}
                onChange={(d: Dayjs | null) => suaNhap({ ngayQD: d ? d.format(FMT) : null })} />
            </div>
            <div style={{ width: 220 }}>
              <Nhan>Số lượng thành viên được duyệt</Nhan>
              <InputNumber min={1} style={{ width: "100%" }} value={nhap!.soDuocDuyet}
                onChange={v => suaNhap({ soDuocDuyet: v == null ? null : Number(v) })} />
            </div>
          </> : <>
            <TruongXem w={280} nhan="Quyết định của Chánh án TANDTC" giaTri={`${ky.soQD} · ${ky.ngayQD}`} />
            <TruongXem w={220} nhan="Số lượng thành viên được duyệt" giaTri={`${ky.soDuocDuyet} thành viên`} />
            <TruongXem w={240} nhan="Kỳ hiệu lực" giaTri={kyHieuLuc(ky)} />
          </>}
        </div>
        {chiXem && nhap && (
          <Alert type="info" showIcon style={{ marginTop: 10 }}
            title="Tòa đang lập kỳ mới (nháp) — chưa có hiệu lực, chưa hiển thị ở đây." />
        )}
      </Card>

      {/* Thành viên đương nhiên */}
      <Card size="small" styles={{ body: { padding: 0 } }}
        headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Thành viên đương nhiên <Text type="secondary" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
          tự nạp theo chức vụ — Điều 57
        </Text></>}
        extra={dangNhap && <Button icon={<Plus size={14} />} onClick={() => setSuaDN("moi")}>Thêm thành viên đương nhiên</Button>}>
        {!chiXem && soChanhAn !== 1 && (
          <Alert type="warning" showIcon banner
            title={soChanhAn === 0 ? "Chưa có Chánh án trong thành viên đương nhiên." : `Đang có ${soChanhAn} người giữ chức vụ Chánh án — kiểm tra lại.`} />
        )}
        <BangDuongNhien ds={dnHien} toaAn={uyBan.toaAn}
          onSua={dangNhap ? r => setSuaDN(r) : undefined}
          onXoa={dangNhap ? id => datDuongNhien(ds => ds.filter(d => d.id !== id)) : undefined} />
      </Card>

      {/* Thẩm phán được chỉ định */}
      <Card size="small" styles={{ body: { padding: 0 } }} title="Thẩm phán được chỉ định" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}
        extra={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TongDuocDuyet tong={tong} duocDuyet={duocDuyet} />
            {dangNhap && <Button icon={<Plus size={14} />} onClick={() => setMoChon(true)}>Thêm thẩm phán</Button>}
          </div>
        }>
        <BangChiDinh ds={cdHien}
          onBo={dangNhap ? id => suaNhap({ chiDinh: nhap!.chiDinh.filter(c => c.id !== id) }) : undefined} />
      </Card>

      {dangNhap && vuot && (
        <Alert type="error" showIcon icon={<TriangleAlert size={16} />}
          title={`Vượt ${tong - duocDuyet!} thành viên so với ${nhap!.soQD ? `quyết định số ${nhap!.soQD}` : "số được duyệt"} (${duocDuyet} thành viên). Bỏ bớt thẩm phán hoặc sửa lại số lượng được duyệt trước khi lập đề nghị.`} />
      )}

      {/* Thao tác */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {dangNhap ? <>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {thieu.length > 0
              ? `Còn thiếu: ${thieu.join(", ")}.`
              : <>Nút <b>Lập đề nghị</b> chỉ bật khi có đủ số/ngày quyết định và tổng thành viên không vượt số được duyệt.</>}
          </Text>
          <span style={{ flex: 1 }} />
          <Button icon={<Save size={14} />} onClick={() => message.success("Đã lưu bản nháp!")}>
            Lưu nháp
          </Button>
          <Popconfirm title="Hủy bản nháp kỳ mới?" okText="Hủy nháp" cancelText="Không"
            onConfirm={() => capNhat(u => ({ ...u, nhap: null }))}>
            <Button danger>Hủy nháp</Button>
          </Popconfirm>
          <Button type="primary" icon={<Send size={14} />} disabled={!lapDeNghiDuoc} onClick={lapDeNghi}>
            Lập đề nghị
          </Button>
        </> : <>
          <Button icon={<Clock size={14} />} onClick={onXemLichSu}>Xem lịch sử các kỳ</Button>
          <span style={{ flex: 1 }} />
        </>}
      </div>

      {!chiXem && (
        <ModalDuongNhien key={suaDN === "moi" ? "moi" : suaDN?.id ?? "dong"} banGhi={suaDN}
          ungVien={uyBan.ungVien} onDong={() => setSuaDN(null)} onLuu={luuDuongNhien} />
      )}

      {dangNhap && (
        <ModalChonThamPhan open={moChon} uyBan={uyBan}
          daChon={[...nhap!.chiDinh, ...nhap!.duongNhien].map(c => c.id)}
          conNhan={duocDuyet == null ? null : duocDuyet - tong}
          onDong={() => setMoChon(false)}
          onThem={ds => suaNhap({
            chiDinh: [...nhap!.chiDinh, ...ds.map(u => ({ id: u.id, ten: u.ten, chucDanh: u.chucDanh, donVi: u.donVi, ngayVao: "" }))],
          })} />
      )}
    </div>
  );
}

// ─── Tab: Lịch sử các kỳ ─────────────────────────────────────────────────────

function TabLichSu({ uyBan }: { uyBan: UyBan }) {
  const [trangThai, setTrangThai] = useState<"mo" | "dong">();
  const [tuNgay, setTuNgay] = useState<Dayjs | null>(null);
  const [denNgay, setDenNgay] = useState<Dayjs | null>(null);
  const [soQD, setSoQD] = useState("");
  const [tenTP, setTenTP] = useState("");
  const [xem, setXem] = useState<Ky | null>(null);

  const tatCa = [uyBan.kyHienHanh, ...uyBan.lichSu];
  const ds = tatCa.filter(k => {
    if (trangThai === "mo" && k.denNgay) return false;
    if (trangThai === "dong" && !k.denNgay) return false;
    if (soQD.trim() && !k.soQD.toLowerCase().includes(soQD.trim().toLowerCase())) return false;
    if (tenTP.trim()) {
      const tk = tenTP.trim().toLowerCase();
      if (!k.duongNhien.some(d => d.ten.toLowerCase().includes(tk)) &&
          !k.chiDinh.some(c => c.ten.toLowerCase().includes(tk))) return false;
    }
    // Kỳ giao với khoảng lọc thì giữ lại
    const bd = dayjs(k.tuNgay, FMT), kt = k.denNgay ? dayjs(k.denNgay, FMT) : dayjs();
    if (tuNgay && kt.isBefore(tuNgay, "day")) return false;
    if (denNgay && bd.isAfter(denNgay, "day")) return false;
    return true;
  });

  const cot: ColumnsType<Ky> = [
    cotSTT,
    { title: "Kỳ hiệu lực", width: 240, render: (_, k) => <span style={{ fontWeight: 600 }}>{kyHieuLuc(k)}</span> },
    { title: "Căn cứ — QĐ Chánh án TANDTC", width: 280, render: (_, k) => `${k.soQD} · ${k.ngayQD}` },
    { title: "Số lượng được duyệt", dataIndex: "soDuocDuyet", width: 170 },
    { title: "Thành viên thực tế", render: (_, k) => `${k.duongNhien.length} thành viên đương nhiên + ${k.chiDinh.length} chỉ định` },
    { title: "Trạng thái", width: 140, render: (_, k) => <TagTrangThaiKy ky={k} /> },
    {
      title: "", width: 70, align: "center",
      render: (_, k) => (
        <Tooltip title="Xem thành viên kỳ này">
          <Button size="small" aria-label="Xem thành viên kỳ này" icon={<Eye size={14} />} onClick={() => setXem(k)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select allowClear placeholder="Trạng thái kỳ" value={trangThai} onChange={setTrangThai} style={{ width: 150, height: 30 }}
            options={[{ value: "mo", label: "Có hiệu lực" }, { value: "dong", label: "Hết hiệu lực" }]} />
          
          <DatePicker format={FMT} value={tuNgay} onChange={setTuNgay} placeholder="Hiệu lực từ" style={{ width: 140, height: 30 }} />
          <DatePicker format={FMT} value={denNgay} onChange={setDenNgay} placeholder="Hiệu lực đến" style={{ width: 140, height: 30 }} />

          <div className="relative flex-1 max-w-[200px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={soQD} onChange={e => setSoQD(e.target.value)}
              placeholder="Số QĐ của Chánh án..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>

          <div className="relative flex-1 max-w-[200px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={tenTP} onChange={e => setTenTP(e.target.value)}
              placeholder="Tên thẩm phán..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>
          
          <button onClick={() => { setTrangThai(undefined); setTuNgay(null); setDenNgay(null); setSoQD(""); setTenTP(""); }}
            className="h-[30px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <div>
              Các kỳ hiệu lực của Ủy ban Thẩm phán <span className="text-outline text-[11.5px] ml-1 font-normal">{uyBan.toaAn}</span>
            </div>
          </div>
          <div>
            <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false}
              locale={{ emptyText: "Không có kỳ nào khớp điều kiện" }} bordered={false} />
          </div>
        </div>
        
        <div className="p-4">
          <Alert type="info" showIcon icon={<Clock size={16} />}
            title={<span className="text-[13px]">Kỳ đã đóng <b>không sửa được</b>. Biên bản phiên họp tra thành viên theo ngày họp, nên thành viên của kỳ cũ phải giữ nguyên — kể cả khi cán bộ đã chuyển công tác hoặc đổi chức vụ.</span>} />
        </div>
      </div>

      <ModalXemKy ky={xem} toaAn={uyBan.toaAn} onDong={() => setXem(null)} />
    </div>
  );
}

// ─── Tổng hợp các tỉnh (chỉ tối cao) ─────────────────────────────────────────

function BangTongHop({ dsUyBan, onChon }: { dsUyBan: UyBan[]; onChon: (toaAn: string) => void }) {
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState<"on_dinh" | "nhap">();

  const ds = dsUyBan.filter(u => {
    if (tuKhoa.trim() && !u.toaAn.toLowerCase().includes(tuKhoa.trim().toLowerCase())) return false;
    if (trangThai === "nhap" && !u.nhap) return false;
    if (trangThai === "on_dinh" && u.nhap) return false;
    return true;
  });

  const cot: ColumnsType<UyBan> = [
    cotSTT,
    {
      title: "Tòa án", dataIndex: "toaAn", width: 260,
      render: v => <a onClick={() => onChon(v)} style={{ fontWeight: 600, color: RED }}>{v}</a>,
    },
    { title: "Kỳ hiện hành", width: 210, render: (_, u) => kyHieuLuc(u.kyHienHanh) },
    { title: "QĐ Chánh án TANDTC", width: 230, render: (_, u) => `${u.kyHienHanh.soQD} · ${u.kyHienHanh.ngayQD}` },
    { title: "Được duyệt", width: 110, align: "center", render: (_, u) => u.kyHienHanh.soDuocDuyet },
    {
      title: "Thành viên thực tế", width: 200,
      render: (_, u) => `${u.kyHienHanh.duongNhien.length} thành viên đương nhiên + ${u.kyHienHanh.chiDinh.length} chỉ định`,
    },
    {
      title: "Trạng thái", width: 190,
      render: (_, u) => <>
        <Tag color="success">Có hiệu lực</Tag>
        {u.nhap && <Tag color="warning">Đang lập kỳ mới</Tag>}
      </>,
    },
    {
      title: "", width: 70, align: "center",
      render: (_, u) => (
        <Tooltip title="Xem chi tiết Ủy ban">
          <Button size="small" aria-label="Xem chi tiết Ủy ban" icon={<Eye size={14} />} onClick={() => onChon(u.toaAn)} />
        </Tooltip>
      ),
    },
  ];

  const tongTV = dsUyBan.reduce((s, u) => s + u.kyHienHanh.duongNhien.length + u.kyHienHanh.chiDinh.length, 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
              placeholder="Nhập tên tỉnh/thành..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>
          
          <Select allowClear placeholder="Tình trạng" value={trangThai} onChange={setTrangThai} style={{ width: 180, height: 30 }}
            options={[
              { value: "on_dinh", label: "Ổn định" },
              { value: "nhap", label: "Đang lập kỳ mới" },
            ]} />
          
          <button onClick={() => { setTuKhoa(""); setTrangThai(undefined); }}
            className="h-[30px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <div>
              Ủy ban Thẩm phán các tỉnh/thành
              <span className="text-outline text-[11.5px] ml-2 font-normal">
                {dsUyBan.length} Ủy ban · {tongTV} thành viên · {dsUyBan.filter(u => u.nhap).length} đang lập kỳ mới
              </span>
            </div>
          </div>
          <div>
            <Table rowKey="toaAn" size="middle" columns={cot} dataSource={ds} bordered={false}
              pagination={{ pageSize: 10, showSizeChanger: false, showTotal: t => `${t} Ủy ban` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MÀN CHÍNH
// ═════════════════════════════════════════════════════════════════════════════

const TAT_CA = "__tat_ca__";

export default function CauHinhUyBanThamPhan({ cap, toaAn = TOA_AN_TINH_MAC_DINH }: {
  cap: "tinh" | "toicao";
  /** Tòa của người đăng nhập — chỉ dùng ở cấp tỉnh. */
  toaAn?: string;
}) {
  const [duLieu, setDuLieu] = useState<Record<string, UyBan>>(khoiTao);
  const [toaChon, setToaChon] = useState<string>(cap === "tinh" ? toaAn : TAT_CA);
  const [tab, setTab] = useState("hien_hanh");

  const laToiCao = cap === "toicao";
  const uyBan = toaChon === TAT_CA ? null : duLieu[toaChon];
  const dsUyBan = useMemo(() => TINH_THANH.map(t => duLieu[t]), [duLieu]);

  const capNhat = (f: (u: UyBan) => UyBan) =>
    setDuLieu(p => ({ ...p, [toaChon]: f(p[toaChon]) }));

  const dangNhap = !laToiCao && !!uyBan?.nhap;

  const lapKyMoi = () => {
    if (uyBan) {
      capNhat(u => ({
        ...u, nhap: {
          soQD: "", ngayQD: null, soDuocDuyet: null,
          duongNhien: u.kyHienHanh.duongNhien.slice(), chiDinh: u.kyHienHanh.chiDinh.slice(),
        },
      }));
      setTab("hien_hanh");
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, borderRadius: 3 } }}>
      <div className="bg-white border border-surface-container rounded-[3px] overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] text-on-surface-variant mb-0.5">Quản trị hệ thống / <span className="font-medium text-on-surface-variant">Cấu hình Ủy ban Thẩm phán</span></div>
              <div className="text-[15px] font-bold text-tertiary">Cấu hình Ủy ban Thẩm phán</div>
            </div>
            {uyBan && (dangNhap ? <Tag color="warning" style={{ margin: 0 }}>Nháp</Tag> : <Tag color="success" style={{ margin: 0 }}>Có hiệu lực</Tag>)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-on-surface-variant">Tòa án</span>
            {laToiCao ? (
              <Select showSearch value={toaChon} style={{ width: 300 }}
                onChange={v => { setToaChon(v); setTab("hien_hanh"); }}
                optionFilterProp="label"
                options={[
                  { value: TAT_CA, label: "Tất cả tỉnh/thành" },
                  ...TINH_THANH.map(t => ({ value: t, label: t })),
                ]} />
            ) : (
              // Cấp tỉnh chỉ cấu hình Ủy ban của chính tòa mình
              <Select value={toaChon} disabled style={{ width: 260 }} options={[{ value: toaChon, label: toaChon }]} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">

          {laToiCao && (
            <Alert type="info" showIcon icon={<Info size={16} />}
              title="Chế độ xem của TANDTC: theo dõi Ủy ban Thẩm phán của các TAND cấp tỉnh. Việc lập kỳ mới do từng tòa thực hiện." />
          )}

          {!uyBan ? (
            <BangTongHop dsUyBan={dsUyBan} onChon={t => { setToaChon(t); setTab("hien_hanh"); }} />
          ) : (
            <div className="flex flex-col h-full gap-3">
              {/* Tabs */}
              <div className="flex items-end border-b border-surface-container px-4 pt-0.5 gap-0 bg-white -mx-4 -mt-4">
                {[
                  { key: "hien_hanh", label: "Kỳ hiện hành" },
                  { key: "lich_su", label: "Lịch sử các kỳ" },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`px-3.5 py-[8px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px outline-none ${tab === t.key
                      ? "border-error text-error bg-transparent"
                      : "border-transparent text-on-surface-variant hover:text-on-surface bg-transparent"
                      }`}>
                    {t.label}
                  </button>
                ))}
                <div className="flex-1 flex justify-end pb-1">
                  {(!laToiCao && !dangNhap) && (
                    <button onClick={lapKyMoi} className="h-[28px] px-3 bg-error text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616] flex items-center gap-1.5 transition-colors">
                      <Plus size={14} /> Lập kỳ mới
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {tab === "hien_hanh" && (
                  <TabKyHienHanh key={toaChon} uyBan={uyBan} chiXem={laToiCao} capNhat={capNhat} onXemLichSu={() => setTab("lich_su")} />
                )}
                {tab === "lich_su" && (
                  <TabLichSu key={toaChon} uyBan={uyBan} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
