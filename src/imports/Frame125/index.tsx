import svgPaths from "./svg-k984wk8udr";

function Container1() {
  return (
    <div className="h-[15.833px] relative shrink-0 w-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.8333" preserveAspectRatio="none" viewBox="0 0 16.6667 15.8333" width="16.6667">
        <g id="Container">
          <path d={svgPaths.p3cd8b780} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#8b0000] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Background">
      <Container1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.45px] uppercase whitespace-nowrap">
        <p className="leading-[28px]">HỆ THỐNG ÁN</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Background />
        <Margin />
      </div>
    </div>
  );
}

function SidebarHeaderLogo() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Sidebar Header / Logo">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-px px-[24px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[28px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 28 18" width="28">
        <g id="Margin">
          <path d={svgPaths.p12a32500} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Trang chủ</p>
        </div>
      </div>
    </div>
  );
}

function ItemTrangChLink() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item - Trang ch → Link">
      <div aria-hidden className="absolute border-transparent border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[28px] pr-[24px] py-[12px] relative size-full">
          <Margin1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="Margin">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Quản lý đơn</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin2 />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[4.317px] relative shrink-0 w-[7px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="4.31667" preserveAspectRatio="none" viewBox="0 0 7 4.31667" width="7">
        <g id="Container">
          <path d={svgPaths.p1a9c9340} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Container4 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function ItemLink() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Item → Link">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Tiếp nhận đơn</p>
      </div>
    </div>
  );
}

function ItemLink1() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Item → Link">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Danh sách đơn</p>
      </div>
    </div>
  );
}

function ItemLink2() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Item → Link">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Phân công thẩm phán</p>
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col h-[100px] items-start px-[30px] relative shrink-0 w-[241px]" data-name="List">
      <ItemLink />
      <ItemLink1 />
      <ItemLink2 />
    </div>
  );
}

function ItemQunLyDn() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item - Quản lý đơn">
      <Container3 />
      <List1 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="h-[19px] relative shrink-0 w-[30px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="19" preserveAspectRatio="none" viewBox="0 0 30 19" width="30">
        <g id="Margin">
          <path d={svgPaths.p19ed9400} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Quản lý án GĐT/TT</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin3 />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[4.317px] relative shrink-0 w-[7px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="4.31667" preserveAspectRatio="none" viewBox="0 0 7 4.31667" width="7">
        <g id="Container">
          <path d={svgPaths.p1a9c9340} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Container8 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p2a26db00} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink3() {
  return (
    <div className="bg-[#fcfcfd] relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container11 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Nhận đơn và TL vụ án</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667" width="9.33333">
        <g id="Container">
          <path d={svgPaths.p1cf54bc0} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink4() {
  return (
    <div className="bg-[#fef2f2] relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container12 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Quản lý vụ án</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 10.5 11.6667" width="10.5">
        <g id="Container">
          <path d={svgPaths.pe355700} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink5() {
  return (
    <div className="bg-[#fcfcfd] relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container13 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Danh sách phân công TTV</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 10.5 11.6667" width="10.5">
        <g id="Container">
          <path d={svgPaths.pe355700} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container14 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Phân công Hội đồng xét xử</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.0833" preserveAspectRatio="none" viewBox="0 0 10.5 11.0833" width="10.5">
        <g id="Container">
          <path d={svgPaths.p3261c300} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink7() {
  return (
    <div className="bg-[#fcfcfd] relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container15 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Quản lý vụ xét xử GĐT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 11.6667 9.33333" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p30536580} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container16 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Quản lý khiếu nại</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 10.5 11.6667" width="10.5">
        <g id="Container">
          <path d={svgPaths.p25f99e00} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container17 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Danh sách vụ án phân côn...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 10.5 11.6667" width="10.5">
        <g id="Container">
          <path d={svgPaths.p25f99e00} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container18 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Án quốc hội</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 10.5 11.6667" width="10.5">
        <g id="Container">
          <path d={svgPaths.p25f99e00} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container19 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Án thời hiệu</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 11.6667 9.33333" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p1c659f80} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container20 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Công văn trao đổi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p29478120} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container22 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Quản lý án tử hình</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[4.317px] relative shrink-0 w-[7px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="4.31667" preserveAspectRatio="none" viewBox="0 0 7 4.31667" width="7">
        <g id="Container">
          <path d={svgPaths.p1a9c9340} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[8px] relative size-full">
          <Container21 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[11.725px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.725 11.6667" width="11.725">
        <g id="Container">
          <path d={svgPaths.p1a3bd300} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container24 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Cấu hình TTV báo cáo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function List2() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="List">
      <ItemLink3 />
      <ItemLink4 />
      <ItemLink5 />
      <ItemLink6 />
      <ItemLink7 />
      <ItemLink8 />
      <ItemLink9 />
      <ItemLink10 />
      <ItemLink11 />
      <ItemLink12 />
      <Item />
      <ItemLink13 />
    </div>
  );
}

function ItemQunLyAnGdtTt() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item - Quản lý án GĐT/TT">
      <Container7 />
      <List2 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 32 16" width="32">
        <g id="Margin">
          <path d={svgPaths.p2337ef60} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Công tác lãnh đạo</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin4 />
      <Container27 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[4.317px] relative shrink-0 w-[7px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="4.31667" preserveAspectRatio="none" viewBox="0 0 7 4.31667" width="7">
        <g id="Container">
          <path d={svgPaths.p1a9c9340} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Container26 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function ItemLink14() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Item → Link">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Phân công vụ án</p>
      </div>
    </div>
  );
}

function ItemLink15() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Item → Link">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Phê duyệt đề xuất</p>
      </div>
    </div>
  );
}

function List3() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col items-start px-[30px] relative shrink-0 w-[237px]" data-name="List">
      <ItemLink14 />
      <ItemLink15 />
    </div>
  );
}

function ItemCongTacLanhDo() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item - Công tác lãnh đạo">
      <Container25 />
      <List3 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <ItemTrangChLink />
      <ItemQunLyDn />
      <ItemQunLyAnGdtTt />
      <ItemCongTacLanhDo />
    </div>
  );
}

function NavigationMenu() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Navigation Menu">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[16px] relative size-full">
          <List />
        </div>
      </div>
    </div>
  );
}

function AsideSidebar() {
  return (
    <div className="bg-white content-stretch flex flex-col h-full items-start pr-px relative shrink-0 w-[288px]" data-name="Aside - SIDEBAR">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <SidebarHeaderLogo />
      <NavigationMenu />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0">
      <AsideSidebar />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 z-[1]">
      <Frame />
    </div>
  );
}

function HtmlBody() {
  return (
    <div className="flex flex-row items-center self-stretch">
      <div className="content-stretch flex h-full isolate items-start relative shrink-0 w-[288px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
        <Frame1 />
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Trang chủ</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Be_Vietnam_Pro:Regular',sans-serif] gap-[4.01px] items-start leading-[0] not-italic pl-[4px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[16px]">/</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[16px]">{` Quản lý án GĐT/TT`}</p>
      </div>
    </div>
  );
}

function ItemMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Item:margin">
      <Item2 />
    </div>
  );
}

function Item3() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Be_Vietnam_Pro:Regular',sans-serif] gap-[4px] items-start leading-[0] not-italic pl-[4px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[16px]">/</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[16px]">{` Quản lý vụ án`}</p>
      </div>
    </div>
  );
}

function ItemMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Item:margin">
      <Item3 />
    </div>
  );
}

function Item4() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Be_Vietnam_Pro:Regular',sans-serif] gap-[7.35px] items-start leading-[0] not-italic pl-[4px] relative shrink-0 text-[12px] whitespace-nowrap" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0 text-[#6b7280]">
        <p className="leading-[16px]">/</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#1f2937]">
        <p className="leading-[16px]">Chi tiết vụ án</p>
      </div>
    </div>
  );
}

function ItemMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Item:margin">
      <Item4 />
    </div>
  );
}

function OrderedList() {
  return (
    <div className="content-stretch flex items-center relative self-stretch shrink-0" data-name="Ordered List">
      <Item1 />
      <ItemMargin />
      <ItemMargin1 />
      <ItemMargin2 />
    </div>
  );
}

function NavBreadcrumb() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Nav - Breadcrumb">
      <OrderedList />
    </div>
  );
}

function LinkSvg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Link → SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Link â SVG">
          <path d={svgPaths.p336347e0} id="Vector" stroke="var(--stroke-0, #4B5563)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] relative shrink-0" data-name="Link:margin">
      <LinkSvg />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] whitespace-nowrap">
        <p className="leading-[28px]">Chi tiết vụ án VA26-001793: Vụ án Khác - BIỆN TIỂU VY - BÙI LAN NHI</p>
      </div>
    </div>
  );
}

function CaseHeader() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="CaseHeader">
      <LinkMargin />
      <Heading />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">📋</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container29 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Thông tin vụ án</p>
      </div>
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link />
    </div>
  );
}

function ItemMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item5 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">📚</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container30 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Danh sách đơn</p>
      </div>
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link1 />
    </div>
  );
}

function ItemMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item6 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">👥</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container31 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Phân công</p>
      </div>
    </div>
  );
}

function Item7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link2 />
    </div>
  );
}

function ItemMargin5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item7 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">📁</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container32 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Hồ sơ</p>
      </div>
    </div>
  );
}

function Item8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link3 />
    </div>
  );
}

function ItemMargin6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item8 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">📄</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container33 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Tờ trình</p>
      </div>
    </div>
  );
}

function Item9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link4 />
    </div>
  );
}

function ItemMargin7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item9 />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['FreeSans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a80000] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">✔️</p>
        </div>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pb-[10px] pt-[8px] px-[8px] relative shrink-0" data-name="Link">
      <div aria-hidden className="absolute border-[#a80000] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container34 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a80000] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Giải quyết văn bản đề nghị</p>
      </div>
    </div>
  );
}

function Item10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link5 />
    </div>
  );
}

function ItemMargin8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item10 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">📂</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container35 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Tài liệu vụ án</p>
      </div>
    </div>
  );
}

function Item11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link6 />
    </div>
  );
}

function ItemMargin9() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item11 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">💾</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link">
      <Container36 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Hồ sơ lưu trữ</p>
      </div>
    </div>
  );
}

function Item12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative" data-name="Item">
      <Link7 />
    </div>
  );
}

function ItemMargin10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pr-[8px] relative self-stretch shrink-0" data-name="Item:margin">
      <Item12 />
    </div>
  );
}

function List4() {
  return (
    <div className="h-[34px] relative shrink-0 w-full" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <ItemMargin3 />
        <ItemMargin4 />
        <ItemMargin5 />
        <ItemMargin6 />
        <ItemMargin7 />
        <ItemMargin8 />
        <ItemMargin9 />
        <ItemMargin10 />
      </div>
    </div>
  );
}

function TabMenu() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0 w-full" data-name="TabMenu">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <List4 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['FreeSans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">ℹ️</p>
      </div>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Heading 2:margin">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Thông tin quyết định hoãn thi hành án</p>
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="image">
          <path d={svgPaths.pf079980} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#dc2626] mr-[-1px] relative rounded-[4px] shrink-0 size-[18px]" data-name="Input">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Image />
      </div>
      <div aria-hidden className="absolute border border-transparent border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function LabelMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Label:margin">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Quyết định hoãn thi hành án</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex items-center left-[7px] top-[-1px]" data-name="Container">
      <Input />
      <LabelMargin />
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[182.8px]" data-name="Margin">
      <Container39 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container38 />
      <Heading2Margin />
      <Margin5 />
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Nhập tên bị cáo</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[13px] py-[8px] relative size-full">
          <Container41 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p2aa1a600} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start right-[8px] top-[6px]" data-name="Button">
      <Svg />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[256px] z-[2]" data-name="Container">
      <Input1 />
      <Button />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">+</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#a80000] content-stretch flex gap-[3.99px] items-center px-[16px] py-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container42 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Thêm mới</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0 z-[1]" data-name="Button:margin">
      <Button1 />
    </div>
  );
}

function SearchAndAddHeader() {
  return (
    <div className="content-stretch flex isolate items-center justify-end pt-[8px] relative shrink-0 w-full" data-name="Search and Add Header">
      <Container40 />
      <ButtonMargin />
    </div>
  );
}

function Cell() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[92.2px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">STT</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[229.7px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Tên Bị cáo</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[201.89px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Tên quyết định</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[116.72px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Số QĐ</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[166.94px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Ngày ra QĐ</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[145.72px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người ký</p>
      </div>
    </div>
  );
}

function Cell6() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[153.86px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người tạo</p>
      </div>
    </div>
  );
}

function Cell7() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[138.97px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Thao tác</p>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] relative shrink-0 w-full" data-name="Header → Row">
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
      <Cell5 />
      <Cell6 />
      <Cell7 />
    </div>
  );
}

function RowData() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row → Data">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[16px] py-[40px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Chưa có quyết định hoãn thi hành án</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[69px] items-start pt-px relative shrink-0 w-full" data-name="Body">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <RowData />
    </div>
  );
}

function Table() {
  return (
    <div className="min-w-[1246px] relative shrink-0 w-[1246px]" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function EmptyStateTable() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Empty State Table">
      <div className="content-stretch flex flex-col items-start overflow-auto p-px relative rounded-[inherit] size-full">
        <Table />
      </div>
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function SuspensionSection() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pt-[7px] relative shrink-0 w-full" data-name="SuspensionSection">
      <Container37 />
      <SearchAndAddHeader />
      <EmptyStateTable />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['FreeSans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">✔️</p>
      </div>
    </div>
  );
}

function Heading2Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Heading 2:margin">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Kết quả giải quyết đơn</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Heading2Margin1 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">+</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#a80000] content-stretch flex gap-[3.99px] items-center px-[16px] py-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container45 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Thêm kết quả giải quyết</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button:margin">
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end pl-[8px] relative size-full">
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Trả lời đơn</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p11512400} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Button">
      <Svg1 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Button3 />
    </div>
  );
}

function Cell8() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[40px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">STT</p>
      </div>
    </div>
  );
}

function Cell9() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[78.67px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Mã đơn</p>
      </div>
    </div>
  );
}

function Cell10() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[150px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Số quyết định</p>
      </div>
    </div>
  );
}

function Cell11() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[140px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Ngày quyết định</p>
      </div>
    </div>
  );
}

function Cell12() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[140px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Ngày phát hành</p>
      </div>
    </div>
  );
}

function Cell13() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[192.48px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người duyệt</p>
      </div>
    </div>
  );
}

function Cell14() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[192.48px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người ký</p>
      </div>
    </div>
  );
}

function Cell15() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[190.3px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người tạo</p>
      </div>
    </div>
  );
}

function Cell16() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[118.61px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Thao tác</p>
      </div>
    </div>
  );
}

function HeaderRow1() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] relative shrink-0 w-full" data-name="Header → Row">
      <Cell8 />
      <Cell9 />
      <Cell10 />
      <Cell11 />
      <Cell12 />
      <Cell13 />
      <Cell14 />
      <Cell15 />
      <Cell16 />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[40px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[78.67px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">1531</p>
        <p className="leading-[16px]">​</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[150px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">179/2026/TB-TA</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[140px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">09/07/2026</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[140px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Chưa cập nhật</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 09/07/2026</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Bình - Vụ trưởng</p>
      </div>
      <Container47 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Hoa - TPB3</p>
      </div>
      <Container48 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Chưa có hiệu lực</p>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Hoa - TPB3</p>
      </div>
      <Container49 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] w-full">
        <p className="leading-[16px]">Nguyễn Cao Thắng</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[10px] w-full">
        <p className="leading-[16px]">09/07/2026 14:48:08</p>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[12.5px] relative shrink-0 w-[190.3px]" data-name="Data">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p17ac3700} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p395b5600} id="Vector_2" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Svg2 />
    </div>
  );
}

function Data8() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.5px] pt-[18.5px] px-[16px] relative shrink-0 w-[118.61px]" data-name="Data">
      <Button4 />
    </div>
  );
}

function Row() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Data />
        <Data1 />
        <Data2 />
        <Data3 />
        <Data4 />
        <Data5 />
        <Data6 />
        <Data7 />
        <Data8 />
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[40px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">2</p>
        </div>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[78.67px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">1234</p>
        </div>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[150px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">179/2026/TB-TA</p>
        </div>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[140px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">09/07/2026</p>
        </div>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[140px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Chưa cập nhật</p>
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Nguyễn Thị Bình</p>
        </div>
        <Container52 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[176px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã có hiệu lực - 09/07/2026</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[20px] pt-[20.5px] px-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Nguyễn Thị Hoa - TPB3</p>
        </div>
        <Container53 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] w-full">
        <p className="leading-[16px]">Nguyễn Cao Thắng</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[10px] w-full">
        <p className="leading-[16px]">09/07/2026 14:00:38</p>
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[190.3px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[12px] relative size-full">
        <Container54 />
        <Container55 />
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p17ac3700} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p395b5600} id="Vector_2" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Svg3 />
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[118.61px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pb-[22px] pt-[18.5px] px-[16px] relative size-full">
        <Button5 />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center pt-px relative size-full">
        <Data9 />
        <Data10 />
        <Data11 />
        <Data12 />
        <Data13 />
        <Data14 />
        <Data15 />
        <Data16 />
        <Data17 />
      </div>
    </div>
  );
}

function Body1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Body">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Row />
      <Row2 />
    </div>
  );
}

function Table1() {
  return (
    <div className="min-w-[1246px] relative shrink-0 w-[1246px]" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <HeaderRow1 />
        <Body1 />
      </div>
    </div>
  );
}

function PopulatedTable() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Populated Table">
      <div className="content-stretch flex flex-col items-start overflow-auto p-px relative rounded-[inherit] size-full">
        <Table1 />
      </div>
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Kháng nghị</p>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p11512400} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Button">
      <Svg4 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Button6 />
    </div>
  );
}

function Cell17() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[40px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">STT</p>
      </div>
    </div>
  );
}

function Cell18() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[78.67px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Mã đơn</p>
      </div>
    </div>
  );
}

function Cell19() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[150px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Số quyết định</p>
      </div>
    </div>
  );
}

function Cell20() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[140px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Ngày quyết định</p>
      </div>
    </div>
  );
}

function Cell21() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[140px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Ngày phát hành</p>
      </div>
    </div>
  );
}

function Cell22() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[192.48px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người duyệt</p>
      </div>
    </div>
  );
}

function Cell23() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[192.48px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người ký</p>
      </div>
    </div>
  );
}

function Cell24() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[190.3px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Người tạo</p>
      </div>
    </div>
  );
}

function Cell25() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start px-[16px] py-[8px] relative shrink-0 w-[118.61px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12.8px] whitespace-nowrap">
        <p className="leading-[19.2px]">Thao tác</p>
      </div>
    </div>
  );
}

function HeaderRow2() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] relative shrink-0 w-full" data-name="Header → Row">
      <Cell17 />
      <Cell18 />
      <Cell19 />
      <Cell20 />
      <Cell21 />
      <Cell22 />
      <Cell23 />
      <Cell24 />
      <Cell25 />
    </div>
  );
}

function Data18() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[40px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[78.67px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">1532, 1432</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[150px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">179/2026/KN-HS</p>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[140px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">09/07/2026</p>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[140px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Chưa cập nhật</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 09/07/2026</p>
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Bình - Vụ trưởng</p>
      </div>
      <Container57 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Hoa - TPTC</p>
      </div>
      <Container58 />
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Chưa có hiệu lực</p>
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[20.5px] relative shrink-0 w-[192.48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Văn Quảng - Phó CA</p>
      </div>
      <Container59 />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] w-full">
        <p className="leading-[16px]">Nguyễn Cao Thắng</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[10px] w-full">
        <p className="leading-[16px]">09/07/2026 14:48:08</p>
      </div>
    </div>
  );
}

function Data25() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] py-[12.5px] relative shrink-0 w-[190.3px]" data-name="Data">
      <Container60 />
      <Container61 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p17ac3700} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p395b5600} id="Vector_2" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Svg5 />
    </div>
  );
}

function Data26() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.5px] pt-[18.5px] px-[16px] relative shrink-0 w-[118.61px]" data-name="Data">
      <Button7 />
    </div>
  );
}

function Row1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Data18 />
        <Data19 />
        <Data20 />
        <Data21 />
        <Data22 />
        <Data23 />
        <Data24 />
        <Data25 />
        <Data26 />
      </div>
    </div>
  );
}

function Body2() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Body">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Row1 />
    </div>
  );
}

function Table2() {
  return (
    <div className="min-w-[1246px] relative shrink-0 w-[1246px]" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <HeaderRow2 />
        <Body2 />
      </div>
    </div>
  );
}

function PopulatedTable1() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Populated Table">
      <div className="content-stretch flex flex-col items-start overflow-auto p-px relative rounded-[inherit] size-full">
        <Table2 />
      </div>
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Hiển thị 1-2 trong tổng 2 bản ghi</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-50 p-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">{`<`}</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#a80000] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[24px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start pl-[4px] relative shrink-0 w-[28px]" data-name="Button:margin">
      <Button9 />
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-50 p-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">{`>`}</p>
      </div>
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Button:margin">
      <Button10 />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Button8 />
      <ButtonMargin2 />
      <ButtonMargin3 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <Container63 />
    </div>
  );
}

function Pagination() {
  return (
    <div className="content-stretch flex items-center justify-end pt-[8px] relative shrink-0 w-full" data-name="Pagination">
      <Container62 />
      <Margin6 />
    </div>
  );
}

function ResolutionResultSection() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pt-[16px] relative shrink-0 w-full" data-name="ResolutionResultSection">
      <Container43 />
      <ButtonMargin1 />
      <Container46 />
      <PopulatedTable />
      <Container56 />
      <PopulatedTable1 />
      <Pagination />
    </div>
  );
}

function AsideSidebar1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-[256px]" data-name="Aside - Sidebar">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TabGiiQuytVanBnDNgh() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[889px] items-start pb-[372.62px] pt-[16px] px-[16px] relative shrink-0 w-[1280px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(252, 252, 252) 0%, rgb(252, 252, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Tab giải quyết văn bản đề nghị">
      <NavBreadcrumb />
      <CaseHeader />
      <TabMenu />
      <SuspensionSection />
      <ResolutionResultSection />
      <AsideSidebar1 />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="content-stretch flex items-center relative size-full">
      <HtmlBody />
      <TabGiiQuytVanBnDNgh />
    </div>
  );
}