export type CapToaAn = "toicao" | "tinh";

export interface RoleDef {
  key: string;
  cap: CapToaAn;
  innerRole: string;
  label: string;
  donVi: string;
}

export const NHOM_VAI_TRO_TOICAO: RoleDef[] = [
  {
    key: "toicao-can-bo",
    cap: "toicao",
    innerRole: "can-bo",
    label: "Cán bộ",
    donVi: "Phòng Tiếp nhận và Xử lý công dân - TAND Tối cao",
  },
  {
    key: "toicao-truong-phong",
    cap: "toicao",
    innerRole: "truong-phong",
    label: "Trưởng phòng",
    donVi: "Phòng Tiếp nhận và Xử lý công dân - TAND Tối cao",
  },
  {
    key: "toicao-pho-vp",
    cap: "toicao",
    innerRole: "pho-vp",
    label: "Phó / Chánh Văn phòng",
    donVi: "Văn phòng TAND Tối cao",
  },
  {
    key: "toicao-lanh-dao",
    cap: "toicao",
    innerRole: "lanh-dao",
    label: "Lãnh đạo Tòa",
    donVi: "TAND Tối cao",
  },
  {
    key: "toicao-chanh-an",
    cap: "toicao",
    innerRole: "chanh-an",
    label: "Chánh án / Phó Chánh án",
    donVi: "TAND Tối cao",
  },
];

export const NHOM_VAI_TRO_TINH: RoleDef[] = [
  {
    key: "tinh-can-bo-tiep-cong-dan",
    cap: "tinh",
    innerRole: "can-bo-tiep-cong-dan",
    label: "Cán bộ tiếp công dân",
    donVi: "TAND TP Hà Nội",
  },
  {
    key: "tinh-can-bo-thu-ly",
    cap: "tinh",
    innerRole: "can-bo-thu-ly",
    label: "Cán bộ thụ lý",
    donVi: "TAND TP Hà Nội",
  },
  {
    key: "tinh-can-bo-nghiep-vu",
    cap: "tinh",
    innerRole: "can-bo-nghiep-vu",
    label: "Công chức nghiên cứu",
    donVi: "TAND TP Hà Nội",
  },
  {
    key: "tinh-lanh-dao-phong",
    cap: "tinh",
    innerRole: "lanh-dao-phong",
    label: "Lãnh đạo phòng",
    donVi: "TAND TP Hà Nội",
  },
  {
    key: "tinh-pho-vp",
    cap: "tinh",
    innerRole: "pho-vp",
    label: "Phó / Chánh Văn phòng",
    donVi: "TAND TP Hà Nội",
  },
  {
    key: "tinh-chanh-an",
    cap: "tinh",
    innerRole: "chanh-an",
    label: "Chánh án / Phó Chánh án",
    donVi: "TAND TP Hà Nội",
  },
];

export const ALL_ROLES: RoleDef[] = [...NHOM_VAI_TRO_TOICAO, ...NHOM_VAI_TRO_TINH];

export function findRoleDef(key: string): RoleDef {
  // Support matching by full key or innerRole + cap
  const found = ALL_ROLES.find(r => r.key === key);
  if (found) return found;

  // Fallbacks for legacy keys
  if (key === "can-bo-tiep-cong-dan" || key === "can-bo-thu-ly" || key === "can-bo-nghiep-vu" || key === "lanh-dao-phong") {
    return ALL_ROLES.find(r => r.innerRole === key && r.cap === "tinh") || NHOM_VAI_TRO_TINH[0];
  }
  if (key === "can-bo" || key === "truong-phong" || key === "lanh-dao") {
    return ALL_ROLES.find(r => r.innerRole === key && r.cap === "toicao") || NHOM_VAI_TRO_TOICAO[0];
  }
  return NHOM_VAI_TRO_TOICAO[0];
}
