# LocalStorage Demo Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add same-machine `localStorage` persistence so the HCTP demo can run an end-to-end journey across reloads without a backend.

**Architecture:** Add one centralized `app/storage/demoStore.ts` module, then wire `app/App.tsx` to load seed data once and persist domain state changes. Lift the list rows and merge state out of `DanhSachDon` so both `Danh sách đơn` and `Hồ sơ kháng nghị` use the same persisted data.

**Tech Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, browser `localStorage`.

## Global Constraints

- Use the active `develop` branch as the source of truth.
- Persist same-machine demo data only; no export/import and no cross-machine support.
- Persist domain data, not transient UI state.
- Do not store PDF/file contents in `localStorage`; store OCR metadata only.
- Keep UI copy in Vietnamese.
- Keep the dense operational UI style already present in `app/App.tsx`.
- Do not edit `ui-hctp-demo-main/` unless explicitly asked.
- `npm run build` must pass after each implementation task.
- `npx tsc --noEmit` is a diagnostic only; it currently fails because dormant `app/components/ui/*` files import undeclared shadcn/Radix dependencies.

---

## Current Develop Branch Notes

- Branch: `develop`.
- Current baseline: `npm run build` passes with a chunk-size warning. The built JS chunk is about 543 kB after minification.
- Current baseline: `npx tsc --noEmit` fails on missing dormant UI dependencies such as `@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `react-hook-form`, `recharts`, and related libraries.
- `DanhSachDon` currently owns `rows` and `mergeState` internally, so the normal list and `Hồ sơ kháng nghị` create separate in-memory copies of `SAMPLE_ROWS`.
- `DocumentNumberingModal` now accepts `loaiVanBanMacDinh`, has `daTrinhDuyet`/`chanTrinhDuyet`, supports `CAP_THEO_TUNG_DON`, and builds one document per row for some document types.
- `PopupLuuSoVanBan` has a workflow status machine and an `onCreateToTrinh` prop, but the current call site does not pass `currentRole` or `onCreateToTrinh`.

## File Structure

- Create `app/storage/demoStore.ts`
  - Owns localStorage key, schema version, seed creation, safe load, safe save, reset, notification helper, and storage-related types.
- Modify `app/App.tsx`
  - Imports the store module.
  - Moves persisted seed literals out of `App`.
  - Initializes `rows`, `toTrinhList`, `notifications`, `currentRole`, `mergeState`, `documentNumbers`, and `ocrSessions` from the store.
  - Saves those domain states back to the store with one effect.
  - Passes lifted `rows` and `mergeState` into `DanhSachDon`.
  - Persists create/edit row, return row, merge row, OCR metadata, document numbering outcomes, proposal creation, approval updates, role changes, and notifications.
  - Adds a compact `Reset dữ liệu demo` control near the role switcher.
- Modify `app/components/DocumentNumberingModal.tsx`
  - Adds one result callback for `Lưu & Trình duyệt`.
  - Emits document-number metadata and selected row IDs to `App`.

---

### Task 1: Add Central Demo Store Module

**Files:**
- Create: `app/storage/demoStore.ts`

**Interfaces:**
- Produces:
  - `DEMO_STORE_KEY: "hctp.demo.v1"`
  - `DemoRole`
  - `DemoNotification`
  - `DemoMergeInfo`
  - `DemoDocumentNumber`
  - `DemoOcrSession`
  - `DemoStoreState<TRow, TProposal>`
  - `DemoSeed<TRow, TProposal>`
  - `createDemoSeed(seed)`
  - `loadDemoStore(seed)`
  - `saveDemoStore(state)`
  - `resetDemoStore(seed)`
  - `makeDemoNotification(text)`
- Consumes: no app imports, to avoid circular dependencies.

- [ ] **Step 1: Create the storage module**

Create `app/storage/demoStore.ts` with this content:

```ts
export const DEMO_STORE_VERSION = 1 as const;
export const DEMO_STORE_KEY = "hctp.demo.v1";

export type DemoRole = "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao";

export interface DemoNotification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

export interface DemoMergeInfo {
  ghepVoi?: string;
  pendingFrom?: { maDon: string; nguoiGui: string };
  pendingTo?: { maDon: string; nguoiGui: string };
}

export interface DemoDocumentNumber {
  id: string;
  docType: string;
  rowIds: number[];
  numbers: { nodeId: string; soVanBan: string; ngayLaySo: string; label: string }[];
  nguoiDuyet: string;
  nguoiKy: string;
  mucDoUuTien: string;
  status: "trinh_duyet" | "duyet" | "trinh_ky" | "da_ky" | "tu_choi";
  createdAt: string;
}

export interface DemoOcrSession {
  id: string;
  fileName: string;
  sizeMB: number;
  status: "thanhcong" | "thatbai" | "dahuy";
  extractedFields: string[];
  createdAt: string;
}

export interface DemoStoreState<TRow = unknown, TProposal = unknown> {
  version: typeof DEMO_STORE_VERSION;
  rows: TRow[];
  toTrinhList: TProposal[];
  notifications: DemoNotification[];
  currentRole: DemoRole;
  mergeState: Record<number, DemoMergeInfo>;
  documentNumbers: DemoDocumentNumber[];
  ocrSessions: DemoOcrSession[];
  updatedAt: string;
}

export interface DemoSeed<TRow = unknown, TProposal = unknown> {
  rows: TRow[];
  toTrinhList: TProposal[];
  notifications: DemoNotification[];
  currentRole: DemoRole;
  mergeState: Record<number, DemoMergeInfo>;
  documentNumbers?: DemoDocumentNumber[];
  ocrSessions?: DemoOcrSession[];
}

let memoryState: DemoStoreState<any, any> | null = null;

const nowIso = () => new Date().toISOString();

const hasLocalStorage = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const createDemoSeed = <TRow, TProposal>(
  seed: DemoSeed<TRow, TProposal>,
): DemoStoreState<TRow, TProposal> => ({
  version: DEMO_STORE_VERSION,
  rows: clone(seed.rows),
  toTrinhList: clone(seed.toTrinhList),
  notifications: clone(seed.notifications),
  currentRole: seed.currentRole,
  mergeState: clone(seed.mergeState),
  documentNumbers: clone(seed.documentNumbers ?? []),
  ocrSessions: clone(seed.ocrSessions ?? []),
  updatedAt: nowIso(),
});

const normalizeStore = <TRow, TProposal>(
  value: unknown,
  seed: DemoSeed<TRow, TProposal>,
): DemoStoreState<TRow, TProposal> | null => {
  if (!isObject(value) || value.version !== DEMO_STORE_VERSION) return null;

  const seeded = createDemoSeed(seed);
  return {
    ...seeded,
    rows: Array.isArray(value.rows) ? (value.rows as TRow[]) : seeded.rows,
    toTrinhList: Array.isArray(value.toTrinhList)
      ? (value.toTrinhList as TProposal[])
      : seeded.toTrinhList,
    notifications: Array.isArray(value.notifications)
      ? (value.notifications as DemoNotification[])
      : seeded.notifications,
    currentRole:
      value.currentRole === "can-bo" ||
      value.currentRole === "truong-phong" ||
      value.currentRole === "pho-vp" ||
      value.currentRole === "lanh-dao"
        ? value.currentRole
        : seeded.currentRole,
    mergeState: isObject(value.mergeState)
      ? (value.mergeState as Record<number, DemoMergeInfo>)
      : seeded.mergeState,
    documentNumbers: Array.isArray(value.documentNumbers)
      ? (value.documentNumbers as DemoDocumentNumber[])
      : seeded.documentNumbers,
    ocrSessions: Array.isArray(value.ocrSessions)
      ? (value.ocrSessions as DemoOcrSession[])
      : seeded.ocrSessions,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : seeded.updatedAt,
  };
};

export const loadDemoStore = <TRow, TProposal>(
  seed: DemoSeed<TRow, TProposal>,
): DemoStoreState<TRow, TProposal> => {
  if (!hasLocalStorage()) {
    if (!memoryState) memoryState = createDemoSeed(seed);
    return clone(memoryState);
  }

  const seeded = createDemoSeed(seed);
  const raw = window.localStorage.getItem(DEMO_STORE_KEY);
  if (!raw) {
    saveDemoStore(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeStore(parsed, seed);
    if (!normalized) {
      console.warn(`[${DEMO_STORE_KEY}] Unsupported or invalid store version. Resetting demo data.`);
      saveDemoStore(seeded);
      return seeded;
    }
    return normalized;
  } catch (error) {
    console.warn(`[${DEMO_STORE_KEY}] Could not parse stored demo data. Resetting demo data.`, error);
    saveDemoStore(seeded);
    return seeded;
  }
};

export const saveDemoStore = <TRow, TProposal>(
  state: DemoStoreState<TRow, TProposal>,
) => {
  const next = { ...state, updatedAt: nowIso() };
  memoryState = clone(next);

  if (!hasLocalStorage()) return;

  try {
    window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn(`[${DEMO_STORE_KEY}] Could not persist demo data. Using in-memory state only.`, error);
  }
};

export const resetDemoStore = <TRow, TProposal>(
  seed: DemoSeed<TRow, TProposal>,
): DemoStoreState<TRow, TProposal> => {
  const next = createDemoSeed(seed);
  memoryState = clone(next);

  if (hasLocalStorage()) {
    try {
      window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn(`[${DEMO_STORE_KEY}] Could not reset localStorage. Using in-memory state only.`, error);
    }
  }

  return next;
};

export const makeDemoNotification = (text: string): DemoNotification => ({
  id: Date.now(),
  text,
  time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  read: false,
});
```

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 3: Commit**

```bash
git add app/storage/demoStore.ts
git commit -m "feat: add local demo storage module"
```

---

### Task 2: Wire App-Level Persistent State

**Files:**
- Modify: `app/App.tsx`

**Interfaces:**
- Consumes:
  - `loadDemoStore(seed)`
  - `saveDemoStore(state)`
  - `makeDemoNotification(text)`
  - store types from `app/storage/demoStore.ts`
- Produces:
  - App-level state for `rows`, `toTrinhList`, `notifications`, `currentRole`, `mergeState`, `documentNumbers`, and `ocrSessions`.

- [ ] **Step 1: Add imports**

In `app/App.tsx`, add this import below the existing component imports:

```ts
import {
  type DemoDocumentNumber,
  type DemoMergeInfo,
  type DemoNotification,
  type DemoOcrSession,
  type DemoRole,
  loadDemoStore,
  makeDemoNotification,
  resetDemoStore,
  saveDemoStore,
} from "./storage/demoStore";
```

- [ ] **Step 2: Make list row type exportable**

Change:

```ts
interface DanhSachDonRow {
```

to:

```ts
export interface DanhSachDonRow {
```

- [ ] **Step 3: Move the current `toTrinhList` seed out of `App`**

In the current `App`, the `useState<ToTrinh[]>(...)` initializer contains ten
entries from `TT-2026-001` through `TT-2026-010`. Move that exact array literal,
unchanged, above `export default function App()` and name it
`INITIAL_TO_TRINH_LIST: ToTrinh[]`. After the move, the old `useState` call must
no longer contain an inline array; Step 5 replaces it with the persisted store
initializer.

- [ ] **Step 4: Add seed constants after `SAMPLE_ROWS`**

Add:

```ts
const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  { id: 1, text: "Đơn 7031 đã được phân công cho cán bộ Nguyễn Văn An", time: "08:30", read: false },
];

const INITIAL_MERGE_STATE: Record<number, DemoMergeInfo> = {
  6: { ghepVoi: "7029" },
  1: { pendingTo: { maDon: "7027", nguoiGui: "Nguyễn Thị Hoa" } },
  5: { pendingFrom: { maDon: "7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh" } },
};

const DEMO_SEED = {
  rows: SAMPLE_ROWS,
  toTrinhList: INITIAL_TO_TRINH_LIST,
  notifications: INITIAL_NOTIFICATIONS,
  currentRole: "can-bo" as DemoRole,
  mergeState: INITIAL_MERGE_STATE,
  documentNumbers: [] as DemoDocumentNumber[],
  ocrSessions: [] as DemoOcrSession[],
};
```

- [ ] **Step 5: Initialize persistent state in `App`**

At the top of `App`, replace the current `toTrinhList`, `currentRole`, and `notifications` initializers with:

```ts
const [initialDemoStore] = useState(() =>
  loadDemoStore<DanhSachDonRow, ToTrinh>(DEMO_SEED),
);

const [rows, setRows] = useState<DanhSachDonRow[]>(initialDemoStore.rows);
const [toTrinhList, setToTrinhList] = useState<ToTrinh[]>(initialDemoStore.toTrinhList);
const [currentRole, setCurrentRole] = useState<DemoRole>(initialDemoStore.currentRole);
const [notifications, setNotifications] = useState<DemoNotification[]>(initialDemoStore.notifications);
const [mergeState, setMergeState] = useState<Record<number, DemoMergeInfo>>(initialDemoStore.mergeState);
const [documentNumbers, setDocumentNumbers] = useState<DemoDocumentNumber[]>(initialDemoStore.documentNumbers);
const [ocrSessions, setOcrSessions] = useState<DemoOcrSession[]>(initialDemoStore.ocrSessions);
```

- [ ] **Step 6: Persist the store from one effect**

Add this effect after the state declarations above:

```ts
useEffect(() => {
  saveDemoStore<DanhSachDonRow, ToTrinh>({
    version: 1,
    rows,
    toTrinhList,
    notifications,
    currentRole,
    mergeState,
    documentNumbers,
    ocrSessions,
    updatedAt: new Date().toISOString(),
  });
}, [rows, toTrinhList, notifications, currentRole, mergeState, documentNumbers, ocrSessions]);
```

- [ ] **Step 7: Use store notification helper**

Replace `addNotification` with:

```ts
const addNotification = (text: string) => {
  setNotifications(prev => [makeDemoNotification(text), ...prev]);
};
```

- [ ] **Step 8: Point edit lookup at persisted rows**

Replace:

```ts
const editingRow = SAMPLE_ROWS.find(r => r.id === editingRowId) ?? null;
```

with:

```ts
const editingRow = rows.find(r => r.id === editingRowId) ?? null;
```

- [ ] **Step 9: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 10: Commit**

```bash
git add app/App.tsx app/storage/demoStore.ts
git commit -m "feat: persist app demo state"
```

---

### Task 3: Lift List Rows And Merge State Out Of `DanhSachDon`

**Files:**
- Modify: `app/App.tsx`

**Interfaces:**
- Consumes:
  - `rows`
  - `setRows`
  - `mergeState`
  - `setMergeState`
- Produces:
  - `DanhSachDon` no longer seeds its own list data.
  - `Danh sách đơn` and `Hồ sơ kháng nghị` share the same persisted rows and merge state.

- [ ] **Step 1: Add props to `DanhSachDon`**

Change the component signature to include persisted data props:

```ts
const DanhSachDon = ({
  rows,
  setRows,
  mergeState,
  setMergeState,
  onThemMoi,
  onBieuMau,
  onWordEditor,
  onEditRow,
  isTruongPhong,
  currentRole = "can-bo",
  onCreateToTrinh,
  khangNghi,
}: {
  rows: DanhSachDonRow[];
  setRows: React.Dispatch<React.SetStateAction<DanhSachDonRow[]>>;
  mergeState: Record<number, DemoMergeInfo>;
  setMergeState: React.Dispatch<React.SetStateAction<Record<number, DemoMergeInfo>>>;
  onThemMoi: () => void;
  onBieuMau?: (row: DanhSachDonRow) => void;
  onWordEditor?: () => void;
  onEditRow?: (id: number) => void;
  isTruongPhong?: boolean;
  currentRole?: DemoRole;
  onCreateToTrinh?: (t: ToTrinh) => void;
  khangNghi?: boolean;
}) => {
```

- [ ] **Step 2: Remove local row and merge state seed**

Delete these local declarations inside `DanhSachDon`:

```ts
const [rows, setRows] = useState<DanhSachDonRow[]>(SAMPLE_ROWS);
```

and:

```ts
const [mergeState, setMergeState] = useState<Record<number, {
  ghepVoi?: string;
  pendingFrom?: { maDon: string; nguoiGui: string };
  pendingTo?: { maDon: string; nguoiGui: string };
}>>({
  6: { ghepVoi: "7029" },
  1: { pendingTo: { maDon: "7027", nguoiGui: "Nguyễn Thị Hoa" } },
  5: { pendingFrom: { maDon: "7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh" } },
});
```

- [ ] **Step 3: Pass lifted state to normal list**

In the `view === "list"` render, add these props:

```tsx
rows={rows}
setRows={setRows}
mergeState={mergeState}
setMergeState={setMergeState}
```

- [ ] **Step 4: Pass lifted state to `Hồ sơ kháng nghị`**

In the `view === "khangnghi"` render, add the same props:

```tsx
rows={rows}
setRows={setRows}
mergeState={mergeState}
setMergeState={setMergeState}
```

- [ ] **Step 5: Pass proposal callback into the old save-number popup**

In the `showLuuSoVanBan` call site, change:

```tsx
<PopupLuuSoVanBan
  rows={rows.filter(r => selectedRows.includes(r.id))}
  onClose={() => setShowLuuSoVanBan(false)}
  onXemBieuMau={() => { setShowLuuSoVanBan(false); onWordEditor?.(); }}
/>
```

to:

```tsx
<PopupLuuSoVanBan
  rows={rows.filter(r => selectedRows.includes(r.id))}
  currentRole={currentRole}
  onCreateToTrinh={onCreateToTrinh}
  onClose={() => setShowLuuSoVanBan(false)}
  onXemBieuMau={() => { setShowLuuSoVanBan(false); onWordEditor?.(); }}
/>
```

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 7: Commit**

```bash
git add app/App.tsx
git commit -m "feat: share persisted list state"
```

---

### Task 4: Persist Row Create, Edit, Return, And Merge Actions

**Files:**
- Modify: `app/App.tsx`

**Interfaces:**
- Consumes:
  - lifted `rows`
  - lifted `mergeState`
  - OCR state from `App`
- Produces:
  - Saved form data creates or updates a persisted `DanhSachDonRow`.
  - Return and merge actions continue to work through lifted state.

- [ ] **Step 1: Add row metadata fields**

Extend `DanhSachDonRow` with optional OCR metadata:

```ts
  ocr?: {
    fileName: string;
    sizeMB: number;
    status: "thanhcong" | "thatbai" | "dahuy";
    extractedFields: string[];
    savedAt: string;
  };
```

- [ ] **Step 2: Add form-to-row helpers inside `App`**

Add these helpers near `selectedBaResult`:

```ts
const isoToVNDate = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
};

const nextRowId = () => Math.max(0, ...rows.map(r => r.id)) + 1;

const ocrValue = (key: string, fallback = "") =>
  ocrFields.has(key) ? OCR_MOCK[key] ?? fallback : fallback;

const buildSavedRow = (): DanhSachDonRow => {
  const existing = editingRowId !== null ? rows.find(r => r.id === editingRowId) : null;
  const id = existing?.id ?? nextRowId();
  const now = new Date();
  const ngayNhap = now.toLocaleDateString("vi-VN");
  const gioNhap = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const soBA = baForm.soBA || ocrValue("soBA");
  const ngayBA = baForm.ngayBA || ocrValue("ngayBA");
  const toaBA = baForm.toaBA || ocrValue("toaXetXu");
  const capXetXu = baForm.capXetXu || ocrValue("capXetXu");
  const nguoiGui = ocrValue("nguoiGui", existing?.nguoiGui ?? "Người gửi demo");
  const loaiAn = loaiAnForm || ocrValue("loaiAn");

  return {
    ...(existing ?? {}),
    id,
    nguoiGui,
    diaChi: existing?.diaChi ?? "Địa chỉ demo",
    maDon: existing?.maDon ?? `Mã ${7031 + id}`,
    loaiHinhThuc: hinhThuc || existing?.loaiHinhThuc || "Đơn đề nghị",
    loaiHinhThucColor: hinhThuc.includes("CV") ? "#e67e22" : "#8b1a1a",
    thongTinDon: {
      soBaqd: soBA,
      ngay: ngayBA ? isoToVNDate(ngayBA) : existing?.thongTinDon?.ngay ?? "",
      toaXetXu: toaBA,
      thuTuc: existing?.thongTinDon?.thuTuc ?? "Giám đốc thẩm",
      hinhThuc,
      soCV: existing?.thongTinDon?.soCV ?? "",
      ngayCV: existing?.thongTinDon?.ngayCV ?? "",
      loaiCV: hinhThuc,
      donViGui: nguoiGui,
      thamPhan: existing?.thongTinDon?.thamPhan ?? "",
      donViGiaiQuyet: existing?.thongTinDon?.donViGiaiQuyet ?? "Chưa quyết",
    },
    daNhan: existing?.daNhan ?? true,
    soDon: existing?.soDon ?? 1,
    hinhThucTiepNhan: existing?.hinhThucTiepNhan ?? "Trực tiếp",
    giaiQuyet: existing?.giaiQuyet ?? {
      nhan: trangThaiDon || "Thụ lý mới",
      color: "#27ae60",
      stl: "",
      coVanBan: false,
    },
    processingHistory: [
      ...(existing?.processingHistory ?? []),
      {
        date: ngayNhap,
        step: existing ? "Cập nhật đơn demo" : "Tạo mới đơn demo",
        actor: "HCTP",
        note: capXetXu ? `Cấp xét xử: ${capXetXu}` : undefined,
      },
    ],
    nguoiNhap: existing?.nguoiNhap ?? "Nguyễn Văn An",
    ngayNhap: existing?.ngayNhap ?? ngayNhap,
    gioNhap: existing?.gioNhap ?? gioNhap,
    thongTinChuyenDon: noiChuyenDen
      ? (noiChuyenDen as DanhSachDonRow["thongTinChuyenDon"])
      : existing?.thongTinChuyenDon,
    loaiAn: loaiAn || existing?.loaiAn,
    ocr: ocrFile && ocrFields.size > 0 ? {
      fileName: ocrFile.name,
      sizeMB: ocrFile.sizeMB,
      status: ocrStatus === "thanhcong" ? "thanhcong" : "dahuy",
      extractedFields: Array.from(ocrFields),
      savedAt: now.toISOString(),
    } : existing?.ocr,
  };
};

const saveCurrentRow = () => {
  const row = buildSavedRow();
  setRows(prev => {
    const exists = prev.some(r => r.id === row.id);
    return exists ? prev.map(r => r.id === row.id ? row : r) : [row, ...prev];
  });
  addNotification(`Đơn ${row.maDon} đã được ${editingRowId === null ? "thêm mới" : "cập nhật"} bởi cán bộ Nguyễn Văn An`);
  setEditingRowId(null);
  setView("list");
};
```

- [ ] **Step 3: Use row save helper**

Replace the current top-bar save button:

```tsx
<BtnPrimary onClick={() => { addNotification(`Đơn ${editingRow?.maDon || "7031"} đã được thêm mới bởi cán bộ Nguyễn Văn An`); setView("list"); }}>Lưu</BtnPrimary>
```

with:

```tsx
<BtnPrimary onClick={saveCurrentRow}>Lưu</BtnPrimary>
```

- [ ] **Step 4: Persist old proposal creation through one handler**

Add this helper in `App`:

```ts
const addToTrinh = (t: ToTrinh) => {
  setToTrinhList(prev => [t, ...prev]);
  const ids = new Set((t.danhSachDon ?? []).map((row: any) => row.id).filter(Boolean));
  if (ids.size > 0) {
    setRows(prev => prev.map(row => ids.has(row.id) ? { ...row, toTrinhStatus: "trinh_lanh_dao" } : row));
  }
  addNotification(`Đã tạo ${t.loai} và trình duyệt.`);
};
```

Replace both `onCreateToTrinh={(t) => setToTrinhList([t, ...toTrinhList])}` call sites with:

```tsx
onCreateToTrinh={addToTrinh}
```

- [ ] **Step 5: Make old popup proposal IDs stable enough for reload demos**

Inside `PopupLuuSoVanBan`, replace the random ID creation inside the `status === "trinh_ky"` button with:

```ts
const id = `TT-${Date.now()}`;
onCreateToTrinh({
  id,
  tenVuAn: initialRows[0]?.thongTinDon?.soBaqd || "-",
  noiDung: loai || "Tờ trình phân công",
  loai: loai || "Tờ trình",
  nguoiDeXuat: "Phó Chánh Văn Phòng",
  ngayDeXuat: new Date().toLocaleString("vi-VN"),
  trangThai: "Chờ duyệt",
  yKienLanhDao: "",
  danhSachDon: initialRows,
});
```

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 7: Commit**

```bash
git add app/App.tsx
git commit -m "feat: persist row demo actions"
```

---

### Task 5: Persist OCR And Document Numbering Outcomes

**Files:**
- Modify: `app/App.tsx`
- Modify: `app/components/DocumentNumberingModal.tsx`

**Interfaces:**
- Consumes:
  - `setOcrSessions`
  - `setDocumentNumbers`
  - `addToTrinh`
  - `setRows`
- Produces:
  - OCR session metadata persisted after OCR completion.
  - Document-numbering submit event persisted into `documentNumbers`, `toTrinhList`, affected row statuses, and notifications.

- [ ] **Step 1: Persist OCR success metadata**

In `startOcr`, inside the success branch after `setOcrFields(new Set(Object.keys(OCR_MOCK)));`, add:

```ts
setOcrSessions(prev => [{
  id: `ocr-${Date.now()}`,
  fileName: ocrFile?.name ?? "",
  sizeMB: ocrFile?.sizeMB ?? 0,
  status: "thanhcong",
  extractedFields: Object.keys(OCR_MOCK),
  createdAt: new Date().toISOString(),
}, ...prev]);
```

In the failure branch after the failure notification, add:

```ts
setOcrSessions(prev => [{
  id: `ocr-${Date.now()}`,
  fileName: ocrFile?.name ?? "",
  sizeMB: ocrFile?.sizeMB ?? 0,
  status: "thatbai",
  extractedFields: [],
  createdAt: new Date().toISOString(),
}, ...prev]);
```

In `cancelOcr`, after the cancel notification, add:

```ts
setOcrSessions(prev => [{
  id: `ocr-${Date.now()}`,
  fileName: ocrFile?.name ?? "",
  sizeMB: ocrFile?.sizeMB ?? 0,
  status: "dahuy",
  extractedFields: [],
  createdAt: new Date().toISOString(),
}, ...prev]);
```

- [ ] **Step 2: Add modal result type**

In `app/components/DocumentNumberingModal.tsx`, add this interface near `DocumentNumberingModalProps`:

```ts
export interface DocumentNumberingSubmitResult {
  id: string;
  docType: string;
  selectedRows: any[];
  rowIds: number[];
  numbers: { nodeId: string; soVanBan: string; ngayLaySo: string; label: string }[];
  nguoiDuyet: string;
  nguoiKy: string;
  mucDoUuTien: string;
  createdAt: string;
}
```

- [ ] **Step 3: Add modal callback prop**

Change `DocumentNumberingModalProps` to include:

```ts
  onSubmitDocument?: (result: DocumentNumberingSubmitResult) => void;
```

Change the component signature to:

```ts
export default function DocumentNumberingModal({
  isOpen,
  onClose,
  currentRole,
  selectedRows,
  loaiVanBanMacDinh,
  onSubmitDocument,
}: DocumentNumberingModalProps) {
```

- [ ] **Step 4: Emit result when cán bộ clicks `Lưu & Trình duyệt`**

Inside `DocumentNumberingModal`, add:

```ts
const submitForApproval = () => {
  if (soDonKhongHopLe > 0) {
    setChanTrinhDuyet(true);
    return;
  }

  const numbers = treeData
    .filter(n => n.soVanBan)
    .map(n => ({
      nodeId: n.id,
      soVanBan: n.soVanBan!,
      ngayLaySo: n.ngayLaySo ?? "",
      label: n.name,
    }));

  setDaTrinhDuyet(true);
  onSubmitDocument?.({
    id: `doc-${Date.now()}`,
    docType,
    selectedRows,
    rowIds: selectedRows.map((row: any) => row.id).filter(Boolean),
    numbers,
    nguoiDuyet,
    nguoiKy,
    mucDoUuTien,
    createdAt: new Date().toISOString(),
  });
};
```

Replace the cán bộ button `onClick` body with:

```tsx
onClick={submitForApproval}
```

- [ ] **Step 5: Handle document submit in `App`**

In `App`, import the result type:

```ts
import DocumentNumberingModal, {
  type DocumentNumberingSubmitResult,
} from "./components/DocumentNumberingModal";
```

Replace the existing default import line for `DocumentNumberingModal`.

Add this handler near `addToTrinh`:

```ts
const handleDocumentNumberingSubmit = (result: DocumentNumberingSubmitResult) => {
  setDocumentNumbers(prev => [{
    id: result.id,
    docType: result.docType,
    rowIds: result.rowIds,
    numbers: result.numbers,
    nguoiDuyet: result.nguoiDuyet,
    nguoiKy: result.nguoiKy,
    mucDoUuTien: result.mucDoUuTien,
    status: "trinh_duyet",
    createdAt: result.createdAt,
  }, ...prev]);

  const proposal: ToTrinh = {
    id: `TT-${Date.now()}`,
    tenVuAn: result.selectedRows[0]?.thongTinDon?.soBaqd || result.selectedRows[0]?.maDon || "-",
    noiDung: result.docType,
    loai: result.docType,
    nguoiDeXuat: "Vũ Văn Yên",
    ngayDeXuat: new Date(result.createdAt).toLocaleString("vi-VN"),
    trangThai: "Chờ duyệt",
    yKienLanhDao: "",
    danhSachDon: result.selectedRows,
  };

  addToTrinh(proposal);
  addNotification(`Đã lưu và trình duyệt ${result.docType}.`);
};
```

- [ ] **Step 6: Pass callback into `DocumentNumberingModal`**

At the `showNumberingModal` call site, add:

```tsx
onSubmitDocument={handleDocumentNumberingSubmit}
```

- [ ] **Step 7: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 8: Commit**

```bash
git add app/App.tsx app/components/DocumentNumberingModal.tsx
git commit -m "feat: persist document numbering outcomes"
```

---

### Task 6: Add Reset Demo Control

**Files:**
- Modify: `app/App.tsx`

**Interfaces:**
- Consumes:
  - `resetDemoStore(DEMO_SEED)`
  - all persisted state setters
- Produces:
  - A same-machine reset button near the role switcher.

- [ ] **Step 1: Add reset helper in `App`**

Add:

```ts
const resetDemoData = () => {
  const ok = window.confirm("Reset toàn bộ dữ liệu demo về trạng thái ban đầu?");
  if (!ok) return;

  const reset = resetDemoStore<DanhSachDonRow, ToTrinh>(DEMO_SEED);
  setRows(reset.rows);
  setToTrinhList(reset.toTrinhList);
  setCurrentRole(reset.currentRole);
  setMergeState(reset.mergeState);
  setDocumentNumbers(reset.documentNumbers);
  setOcrSessions(reset.ocrSessions);
  setNotifications([
    makeDemoNotification("Đã reset dữ liệu demo về trạng thái ban đầu."),
    ...reset.notifications,
  ]);
  setEditingRowId(null);
  setBieuMauRow(null);
  setShowNoti(false);
  setView("list");
};
```

- [ ] **Step 2: Add button to role switcher**

Replace the fixed role switcher block with this structure:

```tsx
<div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg border border-gray-200 z-[9999] text-xs flex items-center gap-2">
  <label className="font-bold text-gray-700">Vai trò:</label>
  <select value={currentRole} onChange={e => setCurrentRole(e.target.value as DemoRole)} className="border p-1 rounded">
    <option value="can-bo">Cán bộ</option>
    <option value="truong-phong">Trưởng phòng</option>
    <option value="pho-vp">Phó / Chánh VP</option>
    <option value="lanh-dao">Lãnh đạo Tòa</option>
  </select>
  <button
    type="button"
    onClick={resetDemoData}
    className="border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fdeaea] rounded px-2 py-1 font-semibold"
  >
    Reset dữ liệu demo
  </button>
</div>
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS. The existing chunk-size warning can remain.

- [ ] **Step 4: Commit**

```bash
git add app/App.tsx
git commit -m "feat: add demo data reset control"
```

---

### Task 7: End-To-End Verification

**Files:**
- Modify only if verification exposes a defect:
  - `app/App.tsx`
  - `app/components/DocumentNumberingModal.tsx`
  - `app/storage/demoStore.ts`

**Interfaces:**
- Consumes all implemented state and persistence changes.
- Produces verified same-machine demo flow.

- [ ] **Step 1: Build verification**

Run: `npm run build`

Expected: PASS. Record the chunk-size warning as pre-existing/accepted.

- [ ] **Step 2: TypeScript diagnostic**

Run: `npx tsc --noEmit`

Expected: FAIL on the known dormant `app/components/ui/*` missing dependency errors. If new errors mention `app/App.tsx`, `app/storage/demoStore.ts`, or `app/components/DocumentNumberingModal.tsx`, fix them before continuing.

- [ ] **Step 3: Start dev server**

Run: `npm run dev`

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 4: Manual browser verification**

In the browser:

1. Open the app.
2. Confirm seed rows appear in `Danh sách đơn`.
3. Switch role to `Trưởng phòng`.
4. Reload the page.
5. Confirm the selected role remains `Trưởng phòng`.
6. Open notifications, mark all as read, reload, and confirm read state persists.
7. Open `Danh sách đơn`, select rows, run `Lưu số văn bản & In báo cáo`, choose people, click `Lấy số`, then click `Lưu & Trình duyệt`.
8. Reload and confirm a new proposal exists in `Phê duyệt đề xuất`.
9. Switch to `Hồ sơ kháng nghị` and confirm the same row data is visible with kháng nghị-specific columns.
10. Create or edit one form row, click `Lưu`, reload, and confirm the row remains.
11. Run `Reset dữ liệu demo`, accept confirm, and verify seed role, rows, proposals, notifications, merge state, document numbers, and OCR sessions return to initial values.

- [ ] **Step 5: Commit verification fixes only if needed**

If fixes were needed:

```bash
git add app/App.tsx app/components/DocumentNumberingModal.tsx app/storage/demoStore.ts
git commit -m "fix: stabilize local demo persistence"
```

If no fixes were needed, do not create an empty commit.
