# Plan: Vietnamese Court Case Management Prototype

## Context
The user wants a clickable prototype of a Vietnamese court case management system ("Hệ thống án") based on 6 imported Figma screens. The screens share a common layout (left sidebar + main content) and represent different views/states of the "Nhận đơn và TL vụ án" module.

## Screens to implement

| Screen | Source Import | Description |
|--------|--------------|-------------|
| List – Chưa có vụ án | `ChưaCoVụAn/index.tsx` | Tab "Chưa có vụ án (5)" active |
| List – Chờ ý kiến LĐ | `ChờXinYKiến/index.tsx` | Tab "Chờ ý kiến LĐ (4)" active |
| List – Đã có vụ án | `DaCoVụAn/index.tsx` | Tab "Đã có vụ án (+37)" active |
| List – Hồ sơ kháng nghị | `HồSơKhangNghị/index.tsx` | Tab "Hồ sơ kháng nghị (+3)" active |
| Sub-page – Giao tiểu hồ sơ | `GiaoTiểuHồSơ/index.tsx` | Sub-tabs for file distribution |
| Form – Thêm hồ sơ KN chi tiết | `ThemHồSơKnChiTiết/index.tsx` | Detail form (image only) |

## Architecture

### App.tsx
A top-level router component that tracks `activeTab` state and renders the appropriate imported component. Navigation between tabs is wired by intercepting click events on the tab elements.

### Navigation strategy
Since the imported Figma components are static (no interactivity), wrap each import in a thin adapter component that:
1. Renders the import inside a `relative` container
2. Overlays invisible `<button>` elements (absolute positioned) over the tab labels to capture clicks
3. Calls `onTabChange(tab)` prop when clicked

This avoids modifying `imports/` files.

### State
```ts
type View = 'chua-co-vu-an' | 'cho-y-kien' | 'da-co-vu-an' | 'ho-so-khang-nghi' | 'giao-tieu-ho-so' | 'them-ho-so'
const [view, setView] = useState<View>('chua-co-vu-an')
```

### Component structure
```
App.tsx
  ├── ViewChuaCoVuAn    → renders ChưaCoVụAn import + tab overlay
  ├── ViewChoYKien      → renders ChờXinYKiến import + tab overlay
  ├── ViewDaCoVuAn      → renders DaCoVụAn import + tab overlay
  ├── ViewHoSoKhangNghi → renders HồSơKhangNghị import + tab overlay
  ├── ViewGiaoTieuHoSo  → renders GiaoTiểuHồSơ import + tab overlay
  └── ViewThemHoSo      → renders ThemHồSơKnChiTiết import + back button
```

### Tab bar positions (approximate, from screenshots)
All list views share the same tab bar at the top of the content area. Overlay buttons are positioned using percentage-based `left` values to hit each tab label. The "Giao tiểu hồ sơ" button in the DaCoVuAn view (dark red button in toolbar) also gets an overlay.

## Critical files to modify
- `src/app/App.tsx` — replace with the multi-view prototype
- `src/styles/fonts.css` — add Be Vietnam Pro + Inter from Google Fonts
- `src/styles/theme.css` — keep existing contract, no changes needed

## Implementation details
- Import each screen component: `import ChưaCoVụAn from "@/imports/ChưaCoVụAn"`
- The ThemHồSơKnChiTiết screen is image-based (the import renders a `<img>`); wrap it with a back-navigation overlay
- All screens fill `100vw × 100vh` with `overflow: auto`
- Font: `Be Vietnam Pro` (Bold + Regular) via Google Fonts

## Verification
1. App renders the Chưa có vụ án list by default
2. Clicking each tab label navigates to the correct screen
3. Clicking "Giao tiểu hồ sơ" button on Đã có vụ án navigates to that sub-view
4. Clicking back/close on the form view returns to list
5. All 6 screens are reachable and display correctly
