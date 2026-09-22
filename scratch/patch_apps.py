import re

# 1. Update app/toicao/AppToiCao.tsx
with open('app/toicao/AppToiCao.tsx', 'r', encoding='utf-8') as f:
    tc = f.read()

# Add imports at top
if 'import { KhoiTaiKhoanChung }' not in tc:
    tc = 'import { KhoiTaiKhoanChung } from "../components/KhoiTaiKhoanChung";\nimport { CapSwitcherPill } from "../components/CapSwitcherPill";\n' + tc

# Update Sidebar props in AppToiCao
tc = tc.replace(
    'const Sidebar = ({ activePage, onNav, currentRole = "can-bo", onDoiVaiTro, vanBanList = [] }: {',
    'const Sidebar = ({ activePage, onNav, currentRole = "can-bo", globalRoleKey, onDoiVaiTro, onChuyenCap, vanBanList = [] }: {\n  globalRoleKey?: string;\n  onChuyenCap?: (cap: "toicao" | "tinh") => void;'
)

# Insert CapSwitcherPill right after logo header
target_logo = '      </div>\n\n      {/* Nav items — cuộn riêng để khối tài khoản luôn nằm đáy */}'
replacement_logo = '      </div>\n      <CapSwitcherPill currentCap="toicao" onChuyenCap={onChuyenCap || (() => {})} />\n\n      {/* Nav items — cuộn riêng để khối tài khoản luôn nằm đáy */}'
if target_logo in tc:
    tc = tc.replace(target_logo, replacement_logo)

# Replace KhoiTaiKhoan in Sidebar
tc = tc.replace(
    '<KhoiTaiKhoan vaiTro={currentRole} onDoiVaiTro={onDoiVaiTro} />',
    '<KhoiTaiKhoanChung currentCap="toicao" currentRoleKey={globalRoleKey || ("toicao-" + currentRole)} onDoiVaiTro={onDoiVaiTro} />'
)

# Update AppToiCao declaration to accept props
tc = tc.replace(
    'export default function App() {',
    '''export interface AppToiCaoProps {
  activeRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  globalRoleKey?: string;
  onDoiVaiTro?: (roleKey: string) => void;
  onChuyenCap?: (cap: "toicao" | "tinh") => void;
}

export default function AppToiCao({
  activeRole = "can-bo",
  globalRoleKey,
  onDoiVaiTro,
  onChuyenCap
}: AppToiCaoProps = {}) {'''
)

# Sync currentRole with activeRole
tc = tc.replace(
    'const [currentRole, setCurrentRole] = useState<"can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an">("can-bo");',
    '''const [currentRole, setCurrentRole] = useState<"can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an">(activeRole || "can-bo");
  useEffect(() => {
    if (activeRole) setCurrentRole(activeRole);
  }, [activeRole]);'''
)

# Update Sidebar call in AppToiCao
tc = tc.replace(
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole} onDoiVaiTro={(v) => setCurrentRole(v as any)} vanBanList={vanBanList} />',
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole} globalRoleKey={globalRoleKey} onDoiVaiTro={onDoiVaiTro || ((v) => setCurrentRole(v as any))} onChuyenCap={onChuyenCap} vanBanList={vanBanList} />'
)

with open('app/toicao/AppToiCao.tsx', 'w', encoding='utf-8') as f:
    f.write(tc)

print('Updated app/toicao/AppToiCao.tsx')

# 2. Update app/tinh/AppTinh.tsx
with open('app/tinh/AppTinh.tsx', 'r', encoding='utf-8') as f:
    tinh = f.read()

# Replace Cán bộ nghiệp vụ with Công chức nghiên cứu in NHAN_VAI_TRO
tinh = tinh.replace('"can-bo-nghiep-vu": "Cán bộ nghiệp vụ"', '"can-bo-nghiep-vu": "Công chức nghiên cứu"')

# Add imports at top
if 'import { KhoiTaiKhoanChung }' not in tinh:
    tinh = 'import { KhoiTaiKhoanChung } from "../components/KhoiTaiKhoanChung";\nimport { CapSwitcherPill } from "../components/CapSwitcherPill";\n' + tinh

# Update Sidebar props in AppTinh
tinh = tinh.replace(
    'const Sidebar = ({ activePage, onNav, currentRole = "can-bo", onDoiVaiTro, vanBanList = [] }: {',
    'const Sidebar = ({ activePage, onNav, currentRole = "can-bo", globalRoleKey, onDoiVaiTro, onChuyenCap, vanBanList = [] }: {\n  globalRoleKey?: string;\n  onChuyenCap?: (cap: "toicao" | "tinh") => void;'
)

# Insert CapSwitcherPill right after logo header
target_logo_tinh = '      </div>\n\n      {/* Nav items — cuộn riêng để khối tài khoản luôn nằm đáy */}'
replacement_logo_tinh = '      </div>\n      <CapSwitcherPill currentCap="tinh" onChuyenCap={onChuyenCap || (() => {})} />\n\n      {/* Nav items — cuộn riêng để khối tài khoản luôn nằm đáy */}'
if target_logo_tinh in tinh:
    tinh = tinh.replace(target_logo_tinh, replacement_logo_tinh)

# Replace KhoiTaiKhoan in Sidebar
tinh = tinh.replace(
    '<KhoiTaiKhoan vaiTro={currentRole} onDoiVaiTro={onDoiVaiTro} />',
    '<KhoiTaiKhoanChung currentCap="tinh" currentRoleKey={globalRoleKey || ("tinh-" + currentRole)} onDoiVaiTro={onDoiVaiTro} />'
)

# Update AppTinh declaration to accept props
tinh = tinh.replace(
    'export default function App() {',
    '''export interface AppTinhProps {
  activeRole?: string;
  globalRoleKey?: string;
  onDoiVaiTro?: (roleKey: string) => void;
  onChuyenCap?: (cap: "toicao" | "tinh") => void;
}

export default function AppTinh({
  activeRole = "pho-vp",
  globalRoleKey,
  onDoiVaiTro,
  onChuyenCap
}: AppTinhProps = {}) {'''
)

# Sync currentRole with activeRole
tinh = tinh.replace(
    'const [currentRole, setCurrentRole] = useState<string>("pho-vp");',
    '''const [currentRole, setCurrentRole] = useState<string>(activeRole || "pho-vp");
  useEffect(() => {
    if (activeRole) setCurrentRole(activeRole);
  }, [activeRole]);'''
)

# Update Sidebar call in AppTinh
tinh = tinh.replace(
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole}\n          onDoiVaiTro={(v) => setCurrentRole(v as any)} vanBanList={vanBanList} />',
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole} globalRoleKey={globalRoleKey} onDoiVaiTro={onDoiVaiTro || ((v) => setCurrentRole(v as any))} onChuyenCap={onChuyenCap} vanBanList={vanBanList} />'
)
# Also single line variant
tinh = tinh.replace(
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole} onDoiVaiTro={(v) => setCurrentRole(v as any)} vanBanList={vanBanList} />',
    '<Sidebar activePage={view} onNav={(p) => setView(p as any)} currentRole={currentRole} globalRoleKey={globalRoleKey} onDoiVaiTro={onDoiVaiTro || ((v) => setCurrentRole(v as any))} onChuyenCap={onChuyenCap} vanBanList={vanBanList} />'
)

with open('app/tinh/AppTinh.tsx', 'w', encoding='utf-8') as f:
    f.write(tinh)

print('Updated app/tinh/AppTinh.tsx')
