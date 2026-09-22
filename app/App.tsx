import React, { useState, useEffect, useMemo } from "react";
import AppToiCao from "./toicao/AppToiCao";
import AppTinh from "./tinh/AppTinh";
import {
  type CapToaAn,
  findRoleDef,
  NHOM_VAI_TRO_TOICAO,
  NHOM_VAI_TRO_TINH,
} from "./roleConfig";

export default function RootApp() {
  const [currentRoleKey, setCurrentRoleKey] = useState<string>(() => {
    return localStorage.getItem("hctp_role_key") || "toicao-can-bo";
  });

  const activeDef = useMemo(() => findRoleDef(currentRoleKey), [currentRoleKey]);
  const currentCap: CapToaAn = activeDef.cap;

  // Track last used role for each cap for seamless switching
  const [lastToiCaoRole, setLastToiCaoRole] = useState<string>(() => {
    return localStorage.getItem("hctp_last_toicao_role") || "toicao-can-bo";
  });
  const [lastTinhRole, setLastTinhRole] = useState<string>(() => {
    return localStorage.getItem("hctp_last_tinh_role") || "tinh-can-bo-tiep-cong-dan";
  });

  const handleDoiVaiTro = (roleKey: string) => {
    const def = findRoleDef(roleKey);
    setCurrentRoleKey(def.key);
    localStorage.setItem("hctp_role_key", def.key);
    localStorage.setItem("hctp_cap", def.cap);

    if (def.cap === "toicao") {
      setLastToiCaoRole(def.key);
      localStorage.setItem("hctp_last_toicao_role", def.key);
    } else {
      setLastTinhRole(def.key);
      localStorage.setItem("hctp_last_tinh_role", def.key);
    }
  };

  const handleChuyenCap = (cap: CapToaAn) => {
    if (cap === currentCap) return;
    if (cap === "toicao") {
      handleDoiVaiTro(lastToiCaoRole || "toicao-can-bo");
    } else {
      handleDoiVaiTro(lastTinhRole || "tinh-can-bo-tiep-cong-dan");
    }
  };

  useEffect(() => {
    localStorage.setItem("hctp_role_key", currentRoleKey);
    localStorage.setItem("hctp_cap", currentCap);
  }, [currentRoleKey, currentCap]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#f4f6f9]">
      {currentCap === "toicao" ? (
        <AppToiCao
          key="app-toicao"
          activeRole={activeDef.innerRole as any}
          globalRoleKey={activeDef.key}
          onDoiVaiTro={handleDoiVaiTro}
          onChuyenCap={handleChuyenCap}
        />
      ) : (
        <AppTinh
          key="app-tinh"
          activeRole={activeDef.innerRole}
          globalRoleKey={activeDef.key}
          onDoiVaiTro={handleDoiVaiTro}
          onChuyenCap={handleChuyenCap}
        />
      )}
    </div>
  );
}
