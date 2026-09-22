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
      {/* Popup Sửa kết quả xử lý đơn — mở từ nút trên header Section 5 */}
      {showSuaKetQuaXuLy && (
        <PopupSuaKetQuaXuLyDon
          banDau={{
            noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
            thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
            chanhAnHoacToaAn, vuTruong,
          }}
          onClose={() => setShowSuaKetQuaXuLy(false)}
          onSave={(data) => {
            setNoiChuyenDen(data.noiChuyenDen);
            setDonViChuyenDen(data.donViChuyenDen);
            setCaNhanChuyenDen(data.caNhanChuyenDen);
            setTrangThaiDon(data.trangThaiDon);
            setThuLyDon(data.thuLyDon);
            setLyDoKhongDu(data.lyDoKhongDu);
            setLyDoTraLai(data.lyDoTraLai);
            setYeuCauTraLai(data.yeuCauTraLai);
            setLyDoLuuTheoDoi(data.lyDoLuuTheoDoi);
            setChanhAnHoacToaAn(data.chanhAnHoacToaAn);
            setVuTruong(data.vuTruong);

            if (editingRow) {
              const t = new Date();
              const ngay = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
              const step = data.noiChuyenDen === "Nội bộ" || data.noiChuyenDen === "Tòa khác" || data.noiChuyenDen === "Ngoài tòa án" ? "Chuyển đơn" : data.noiChuyenDen;

              let note = "";
              if (data.noiChuyenDen === "Nội bộ") {
                note = [
                  data.donViChuyenDen && `Chuyển đến: ${data.donViChuyenDen}`,
                  data.caNhanChuyenDen && `Cá nhân: ${data.caNhanChuyenDen}`,
                  data.trangThaiDon && `Trạng thái: ${data.trangThaiDon}`,
                  data.trangThaiDon === "Đơn không đủ điều kiện" && data.lyDoKhongDu && `Lý do: ${data.lyDoKhongDu}`,
                  hasGiamDocThamResult
                    ? (data.vuTruong && `Vụ trưởng: ${data.vuTruong}`)
                    : (data.trangThaiDon === "Đơn đủ điều kiện" && data.thuLyDon && `Thụ lý: ${data.thuLyDon}`),
                ].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Tòa khác") {
                note = [data.donViChuyenDen && `Chuyển đến: ${data.donViChuyenDen}`, `Hình thức: ${data.chanhAnHoacToaAn}`].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Ngoài tòa án") {
                note = data.donViChuyenDen ? `Chuyển đến: ${data.donViChuyenDen}` : "";
              } else if (data.noiChuyenDen === "Trả lại đơn") {
                note = [data.lyDoTraLai && `Lý do: ${data.lyDoTraLai}`, data.yeuCauTraLai && `Yêu cầu: ${data.yeuCauTraLai}`].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Lưu theo dõi") {
                note = data.lyDoLuuTheoDoi ? `Lý do: ${data.lyDoLuuTheoDoi}` : "";
              }

              const newEntry = {
                date: ngay,
                step,
                actor: nguoiTheoVaiTro(currentRole).nguoi,
                note,
                rawData: data
              };
              editingRow.processingHistory = [...(editingRow.processingHistory ?? []), newEntry];
            }

            setShowSuaKetQuaXuLy(false);
          }}
        />
      )}
      {/* Popup Chi tiết kết quả xử lý đơn — mở từ nút Xem trên lịch sử */}
      {xemChiTietHistory && (
        <PopupChiTietKetQuaXuLy
          data={xemChiTietHistory}
          onClose={() => setXemChiTietHistory(null)}
        />
      )}
    </div>
  );
}
