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
  proposalId?: string;
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
let lastDemoNotificationId = 0;

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

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === "string");

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every(item => typeof item === "number" && Number.isFinite(item));

const isObjectArray = (value: unknown): value is Record<string, unknown>[] =>
  Array.isArray(value) && value.every(isObject);

const hasSeedItemShape = <T>(value: unknown, seedItems: T[]) => {
  if (!isObjectArray(value)) return false;

  const seedObjects = seedItems.filter(
    (item): item is T & Record<string, unknown> => isObject(item),
  );
  return seedObjects.length === 0 || value.every(item =>
    seedObjects.some(seedItem =>
      Object.keys(seedItem).every(key => Object.prototype.hasOwnProperty.call(item, key)),
    ),
  );
};

const isNotification = (value: unknown): value is DemoNotification =>
  isObject(value) &&
  typeof value.id === "number" && Number.isFinite(value.id) &&
  typeof value.text === "string" &&
  typeof value.time === "string" &&
  typeof value.read === "boolean";

const isMergeEndpoint = (value: unknown) =>
  isObject(value) && typeof value.maDon === "string" && typeof value.nguoiGui === "string";

const isMergeInfo = (value: unknown): value is DemoMergeInfo =>
  isObject(value) &&
  (value.ghepVoi === undefined || typeof value.ghepVoi === "string") &&
  (value.pendingFrom === undefined || isMergeEndpoint(value.pendingFrom)) &&
  (value.pendingTo === undefined || isMergeEndpoint(value.pendingTo));

const isMergeState = (value: unknown): value is Record<number, DemoMergeInfo> =>
  isObject(value) &&
  Object.keys(value).every(key => /^\d+$/.test(key)) &&
  Object.values(value).every(isMergeInfo);

const isDocumentNumberEntry = (value: unknown) =>
  isObject(value) &&
  typeof value.nodeId === "string" &&
  typeof value.soVanBan === "string" &&
  typeof value.ngayLaySo === "string" &&
  typeof value.label === "string";

const isDocumentNumber = (value: unknown): value is DemoDocumentNumber =>
  isObject(value) &&
  typeof value.id === "string" &&
  (value.proposalId === undefined || typeof value.proposalId === "string") &&
  typeof value.docType === "string" &&
  isNumberArray(value.rowIds) &&
  Array.isArray(value.numbers) && value.numbers.every(isDocumentNumberEntry) &&
  typeof value.nguoiDuyet === "string" &&
  typeof value.nguoiKy === "string" &&
  typeof value.mucDoUuTien === "string" &&
  ["trinh_duyet", "duyet", "trinh_ky", "da_ky", "tu_choi"].includes(value.status as string) &&
  typeof value.createdAt === "string";

const isOcrSession = (value: unknown): value is DemoOcrSession =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.fileName === "string" &&
  typeof value.sizeMB === "number" && Number.isFinite(value.sizeMB) &&
  ["thanhcong", "thatbai", "dahuy"].includes(value.status as string) &&
  isStringArray(value.extractedFields) &&
  typeof value.createdAt === "string";

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
    rows: hasSeedItemShape(value.rows, seed.rows) ? (value.rows as TRow[]) : seeded.rows,
    toTrinhList: hasSeedItemShape(value.toTrinhList, seed.toTrinhList)
      ? (value.toTrinhList as TProposal[])
      : seeded.toTrinhList,
    notifications: Array.isArray(value.notifications) && value.notifications.every(isNotification)
      ? (value.notifications as DemoNotification[])
      : seeded.notifications,
    currentRole:
      value.currentRole === "can-bo" ||
      value.currentRole === "truong-phong" ||
      value.currentRole === "pho-vp" ||
      value.currentRole === "lanh-dao"
        ? value.currentRole
        : seeded.currentRole,
    mergeState: isMergeState(value.mergeState)
      ? (value.mergeState as Record<number, DemoMergeInfo>)
      : seeded.mergeState,
    documentNumbers: Array.isArray(value.documentNumbers) && value.documentNumbers.every(isDocumentNumber)
      ? (value.documentNumbers as DemoDocumentNumber[])
      : seeded.documentNumbers,
    ocrSessions: Array.isArray(value.ocrSessions) && value.ocrSessions.every(isOcrSession)
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
  try {
    const raw = window.localStorage.getItem(DEMO_STORE_KEY);
    if (!raw) {
      saveDemoStore(seeded);
      return seeded;
    }

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

export const makeDemoNotification = (text: string): DemoNotification => {
  const id = Math.max(Date.now(), lastDemoNotificationId + 1);
  lastDemoNotificationId = id;

  return {
    id,
    text,
    time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    read: false,
  };
};
