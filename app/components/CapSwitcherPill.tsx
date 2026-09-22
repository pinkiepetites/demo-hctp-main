import React from "react";
import { Segmented, ConfigProvider } from "antd";
import { type CapToaAn } from "../roleConfig";

export const CapSwitcherPill: React.FC<{
  currentCap: CapToaAn;
  onChuyenCap: (cap: CapToaAn) => void;
}> = ({ currentCap, onChuyenCap }) => {
  return (
    <div className="mx-2 my-2">
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              itemSelectedBg: currentCap === "toicao" ? "#8b1a1a" : "#1a5a96",
              itemSelectedColor: "#fff",
              itemColor: "#555",
              itemHoverColor: "#111",
              trackPadding: 2,
            },
          },
        }}
      >
        <Segmented
          block
          size="small"
          value={currentCap}
          onChange={(val) => onChuyenCap(val as CapToaAn)}
          options={[
            {
              label: <span className="text-[11px] font-medium whitespace-nowrap px-1">TAND Tối cao</span>,
              value: "toicao",
            },
            {
              label: <span className="text-[11px] font-medium whitespace-nowrap px-1">TAND Cấp tỉnh</span>,
              value: "tinh",
            },
          ]}
        />
      </ConfigProvider>
    </div>
  );
};
