// ── Dữ liệu UBTP dùng chung + nhật ký chỉnh sửa (mục 3.4) ────────────────────
// Repo là FE thuần, chưa có API. Store này giữ dữ liệu ở module scope, ghi
// xuống localStorage nên không mất khi F5, và phát tín hiệu cho mọi component
// đang mở (màn phê duyệt của Phó Chánh án và tab "DS tham mưu" thấy cùng dữ liệu).
// Khi có API, chỉ cần thay phần đọc/ghi bên dưới, giao diện không phải sửa.

import { useEffect, useState } from "react";

export type LoaiHoiDong = "toan-the" | "tham-phan";

/** Một mục nhật ký chỉnh sửa. */
export type HDXXChange = {
  /** Thời điểm, dạng dd/mm/yyyy HH:mm */
  at: string;
  /** Người sửa */
  by: string;
  /** Nội dung sửa */
  what: string;
  /** Giá trị cũ */
  from: string;
  /** Giá trị mới */
  to: string;
};

export type HDXXEntry = {
  hoiDong: LoaiHoiDong;
  members: string[];
  /** id các vụ án đã bị bỏ khỏi danh sách */
  removed: number[];
  log: HDXXChange[];
};

const STORAGE_KEY = "gdt.hdxx.v1";

type Store = Record<string, HDXXEntry>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

let store: Store = readStore();

const listeners = new Set<() => void>();

function commit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Hết dung lượng hoặc bị chặn: vẫn giữ dữ liệu trong bộ nhớ phiên hiện tại.
  }
  listeners.forEach(fn => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Đọc dữ liệu UBTP của một danh sách; chưa có thì khởi tạo theo fallback. */
export function getEntry(id: string | number, fallback: Omit<HDXXEntry, "log">): HDXXEntry {
  const key = String(id);
  if (!store[key]) {
    store[key] = { ...fallback, removed: [...fallback.removed], members: [...fallback.members], log: [] };
  }
  return store[key];
}

function now(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function tenLoaiHoiDong(loai: LoaiHoiDong, soThanhVien: number): string {
  return loai === "toan-the" ? "Toàn thể Ủy ban Thẩm phán" : `Ủy ban Thẩm phán gồm ${soThanhVien} Thẩm phán`;
}

/**
 * So sánh trạng thái trước/sau, ghi các mục nhật ký tương ứng và lưu lại.
 * Trả về số mục nhật ký đã ghi thêm.
 */
export function saveEntry(
  id: string | number,
  prev: Omit<HDXXEntry, "log">,
  next: Omit<HDXXEntry, "log">,
  by = "Người dùng hiện tại",
  tenVuAn: Record<number, string> = {}
): number {
  const key = String(id);
  const current = store[key] || { ...prev, log: [] };
  const changes: HDXXChange[] = [];
  const at = now();

  // 1. Đổi loại hội đồng
  if (prev.hoiDong !== next.hoiDong) {
    changes.push({
      at,
      by,
      what: "Đổi loại hội đồng",
      from: tenLoaiHoiDong(prev.hoiDong, prev.members.length),
      to: tenLoaiHoiDong(next.hoiDong, next.members.length),
    });
  }

  // 2. Thêm / bỏ thẩm phán
  const added = next.members.filter(m => !prev.members.includes(m));
  const dropped = prev.members.filter(m => !next.members.includes(m));
  added.forEach(m => changes.push({ at, by, what: "Thêm thẩm phán", from: "–", to: m }));
  dropped.forEach(m => changes.push({ at, by, what: "Bỏ thẩm phán", from: m, to: "–" }));

  // 3. Bỏ vụ án khỏi danh sách
  const removedNew = next.removed.filter(x => !prev.removed.includes(x));
  const restored = prev.removed.filter(x => !next.removed.includes(x));
  removedNew.forEach(id =>
    changes.push({ at, by, what: "Bỏ vụ án khỏi danh sách", from: tenVuAn[id] || `Vụ án #${id}`, to: "–" })
  );
  restored.forEach(id =>
    changes.push({ at, by, what: "Khôi phục vụ án vào danh sách", from: "–", to: tenVuAn[id] || `Vụ án #${id}` })
  );

  store[key] = {
    hoiDong: next.hoiDong,
    members: [...next.members],
    removed: [...next.removed],
    log: [...changes, ...current.log],
  };
  commit();
  return changes.length;
}

/** Hook đọc entry và tự render lại khi store đổi. */
export function useHDXXEntry(id: string | number, fallback: Omit<HDXXEntry, "log">): HDXXEntry {
  const [entry, setEntry] = useState<HDXXEntry>(() => getEntry(id, fallback));
  useEffect(() => {
    setEntry(getEntry(id, fallback));
    return subscribe(() => setEntry({ ...getEntry(id, fallback) }));
    // fallback đổi theo từng dòng dữ liệu nên chỉ khoá theo id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [String(id)]);
  return entry;
}
