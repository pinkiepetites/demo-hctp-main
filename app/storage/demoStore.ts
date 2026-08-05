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
