// ── Ghi nhớ bước "Duyệt thụ lý & cấp số thụ lý" ───────────────────────────────
// Repo là FE thuần, chưa có API. Bước duyệt là nơi DUY NHẤT sinh ra số thụ lý —
// thứ không tính lại được từ dữ liệu mẫu. Nếu chỉ giữ trong state của màn, F5 là
// mất: đơn lùi về "Chờ duyệt thụ lý" và lần duyệt sau cấp lại số cũ.
//
// Store này chỉ ghi phần đó, không nhân bản cả danh sách đơn:
//   id đơn → { trạng thái, số thụ lý, ngày thụ lý, mốc nhật ký }
// Dữ liệu mẫu vẫn là nguồn của mọi thứ khác; lúc khởi tạo chỉ VẼ LẠI các đơn đã
// duyệt, nên Trang chủ / Tiếp nhận đơn không phải đọc store này.
// Khi có API, chỉ thay phần đọc/ghi bên dưới, giao diện không phải sửa.

export interface BanGhiDuyetThuLy {
  /** Trạng thái sau khi duyệt — "Thụ lý mới". */
  nhan: string;
  /** Màu chấm trạng thái, đi kèm `nhan` để không phải tra lại bảng màu ở nơi đọc. */
  color: string;
  /** Số thụ lý cấp được. */
  soThuLy: string;
  /** Ngày thụ lý (dd/mm/yyyy). */
  ngayThuLy: string;
  /** Mốc nhật ký ghi vào lịch sử xử lý của đơn. */
  mocLichSu: { date: string; step: string; actor: string; note?: string };
}

const STORAGE_KEY = "tinh.duyet-thu-ly.v1";

type Store = Record<string, BanGhiDuyetThuLy>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

let store: Store = readStore();

function commit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Hết dung lượng hoặc bị chặn: bước duyệt vẫn có tác dụng trong phiên hiện tại.
  }
}

/** Ghi kết quả duyệt của một lần bấm nút, khóa theo id đơn. Trả về chính bản
 *  ghi đã lưu để bên gọi dùng tiếp — cập nhật trên màn và giá trị vẽ lại sau khi
 *  tải phải là cùng một đối tượng, không chép lần hai. */
export function ghiDuyetThuLy(banGhi: Record<number, BanGhiDuyetThuLy>): Record<number, BanGhiDuyetThuLy> {
  Object.entries(banGhi).forEach(([id, b]) => { store[id] = b; });
  commit();
  return banGhi;
}

/** Toàn bộ bản ghi đã duyệt, dạng id đơn → kết quả. */
export function docDuyetThuLy(): Store {
  return store;
}

/** Vẽ lại các đơn đã duyệt lên trên dữ liệu gốc. Trả về mảng MỚI, không sửa
 *  `rows` — đó là hằng mẫu dùng chung cho mọi màn, sửa vào là mọi màn đổi theo. */
export const apDuyetThuLy = <T extends {
  id: number;
  giaiQuyet: { nhan: string; color: string; stl: string; ngayThuLy?: string };
  processingHistory?: { date: string; step: string; actor: string; note?: string }[];
}>(rows: T[]): T[] => {
  if (!Object.keys(store).length) return rows;
  return rows.map(r => {
    const b = store[String(r.id)];
    if (!b) return r;
    return {
      ...r,
      giaiQuyet: { ...r.giaiQuyet, nhan: b.nhan, color: b.color, stl: b.soThuLy, ngayThuLy: b.ngayThuLy },
      processingHistory: [...(r.processingHistory ?? []), b.mocLichSu],
    };
  });
};
