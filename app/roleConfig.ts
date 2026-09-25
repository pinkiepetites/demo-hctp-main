export type CapToaAn = "toicao" | "tinh";

export interface RoleDef {
  key: string;
  cap: CapToaAn;
  innerRole: string;
  label: string;
  donVi: string;
}

export const NHOM_VAI_TRO_TOICAO: RoleDef[] = [
  { key: "TC-HCTP-CB", cap: "toicao", innerRole: "can-bo", label: "Cán bộ xử lý đơn", donVi: "Hành chính Tư pháp" },
  { key: "TC-HCTP-TP", cap: "toicao", innerRole: "truong-phong", label: "Trưởng/Phó phòng xử lý đơn", donVi: "Hành chính Tư pháp" },
  { key: "TC-HCTP-CVP", cap: "toicao", innerRole: "pho-vp", label: "Chánh/Phó Chánh văn phòng", donVi: "Hành chính Tư pháp" },
  { key: "TC-HS-CBNV", cap: "toicao", innerRole: "hs-cbnv", label: "Cán bộ nghiệp vụ", donVi: "Vụ GĐKT Hình sự" },
  { key: "TC-HS-TTV", cap: "toicao", innerRole: "hs-ttv", label: "Thẩm tra viên", donVi: "Vụ GĐKT Hình sự" },
  { key: "TC-HS-PVT", cap: "toicao", innerRole: "hs-pvt", label: "Phó Vụ trưởng", donVi: "Vụ GĐKT Hình sự" },
  { key: "TC-HS-VT", cap: "toicao", innerRole: "hs-vt", label: "Vụ trưởng", donVi: "Vụ GĐKT Hình sự" },
  { key: "TC-DS-CBNV", cap: "toicao", innerRole: "ds-cbnv", label: "Cán bộ nghiệp vụ", donVi: "Vụ GĐKT Dân sự" },
  { key: "TC-DS-TTV", cap: "toicao", innerRole: "ds-ttv", label: "Thẩm tra viên", donVi: "Vụ GĐKT Dân sự" },
  { key: "TC-DS-PVT", cap: "toicao", innerRole: "ds-pvt", label: "Phó Vụ trưởng", donVi: "Vụ GĐKT Dân sự" },
  { key: "TC-DS-VT", cap: "toicao", innerRole: "ds-vt", label: "Vụ trưởng", donVi: "Vụ GĐKT Dân sự" },
  { key: "TC-HC-CBNV", cap: "toicao", innerRole: "hc-cbnv", label: "Cán bộ nghiệp vụ", donVi: "Vụ GĐKT Hành chính" },
  { key: "TC-HC-TTV", cap: "toicao", innerRole: "hc-ttv", label: "Thẩm tra viên", donVi: "Vụ GĐKT Hành chính" },
  { key: "TC-HC-PVT", cap: "toicao", innerRole: "hc-pvt", label: "Phó Vụ trưởng", donVi: "Vụ GĐKT Hành chính" },
  { key: "TC-HC-VT", cap: "toicao", innerRole: "hc-vt", label: "Vụ trưởng", donVi: "Vụ GĐKT Hành chính" },
  { key: "TC-KT-CBNV", cap: "toicao", innerRole: "kt-cbnv", label: "Cán bộ nghiệp vụ", donVi: "Vụ GĐKT KDTM-LĐ" },
  { key: "TC-KT-TTV", cap: "toicao", innerRole: "kt-ttv", label: "Thẩm tra viên", donVi: "Vụ GĐKT KDTM-LĐ" },
  { key: "TC-KT-PVT", cap: "toicao", innerRole: "kt-pvt", label: "Phó Vụ trưởng", donVi: "Vụ GĐKT KDTM-LĐ" },
  { key: "TC-KT-VT", cap: "toicao", innerRole: "kt-vt", label: "Vụ trưởng", donVi: "Vụ GĐKT KDTM-LĐ" },
  { key: "TC-THAMPHAN", cap: "toicao", innerRole: "tham-phan", label: "Thẩm phán", donVi: "Vụ GĐKT (các Vụ)" },
  { key: "TC-CA", cap: "toicao", innerRole: "chanh-an", label: "Chánh án / Phó Chánh án", donVi: "Lãnh đạo Tòa" },
];

export const NHOM_VAI_TRO_TINH: RoleDef[] = [
  { key: "TI-HCTP-CVP", cap: "tinh", innerRole: "pho-vp", label: "Chánh/Phó Chánh văn phòng", donVi: "Hành chính Tư pháp" },
  { key: "TI-HCTP-CBTL", cap: "tinh", innerRole: "can-bo-thu-ly", label: "Cán bộ thụ lý", donVi: "Hành chính Tư pháp" },
  { key: "TI-HCTP-TCD", cap: "tinh", innerRole: "can-bo-tiep-cong-dan", label: "Cán bộ tiếp công dân", donVi: "Hành chính Tư pháp" },
  { key: "TI-PCA", cap: "tinh", innerRole: "pho-chanh-an", label: "Phó Chánh án", donVi: "Lãnh đạo Tòa" },
  { key: "TI-CA", cap: "tinh", innerRole: "chanh-an", label: "Chánh án", donVi: "Lãnh đạo Tòa" },
  { key: "TI-GDKT-TP", cap: "tinh", innerRole: "lanh-dao-phong", label: "Trưởng phòng", donVi: "Phòng GĐKT" },
  { key: "TI-GDKT-PTP", cap: "tinh", innerRole: "pho-truong-phong", label: "Phó trưởng phòng", donVi: "Phòng GĐKT" },
  { key: "TI-GDKT-CCNC", cap: "tinh", innerRole: "can-bo-nghiep-vu", label: "Công chức nghiên cứu (CCNC)", donVi: "Phòng GĐKT" },
  { key: "TI-THAMPHAN", cap: "tinh", innerRole: "tham-phan", label: "Thẩm phán", donVi: "Phòng GĐKT" }
];

export const ALL_ROLES: RoleDef[] = [...NHOM_VAI_TRO_TOICAO, ...NHOM_VAI_TRO_TINH];

export function findRoleDef(key: string): RoleDef {
  const found = ALL_ROLES.find(r => r.key === key);
  if (found) return found;

  // Fallbacks for legacy keys
  if (key === "can-bo-tiep-cong-dan" || key === "can-bo-thu-ly" || key === "can-bo-nghiep-vu" || key === "lanh-dao-phong" || key === "pho-vp" || key === "chanh-an") {
    return ALL_ROLES.find(r => r.innerRole === key && r.cap === "tinh") || NHOM_VAI_TRO_TINH[0];
  }
  if (key === "can-bo" || key === "truong-phong" || key === "lanh-dao" || key === "pho-vp" || key === "chanh-an") {
    return ALL_ROLES.find(r => r.innerRole === key && r.cap === "toicao") || NHOM_VAI_TRO_TOICAO[0];
  }
  return NHOM_VAI_TRO_TOICAO[0];
}