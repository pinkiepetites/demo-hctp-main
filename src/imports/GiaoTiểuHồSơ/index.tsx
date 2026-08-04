import svgPaths from "./svg-rvjpwo30gz";

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
    <a className="bg-[#fef2f2] cursor-pointer relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[8px] relative size-full">
          <Container11 />
          <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] text-left whitespace-nowrap">
            <p className="leading-[20px]">Nhận đơn và TL vụ án</p>
          </div>
        </div>
      </div>
    </a>
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
    <div className="relative shrink-0 w-full" data-name="Item → Link">
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
    <div className="relative shrink-0 w-full" data-name="Item → Link">
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

function HtmlBody1() {
  return (
    <div className="content-stretch flex h-full isolate items-start relative shrink-0 w-[288px] z-[1]" style={{ backgroundImage: "linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <Frame1 />
    </div>
  );
}

function HtmlBody() {
  return (
    <div className="content-stretch flex h-[932px] isolate items-start relative shrink-0 w-[288px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <HtmlBody1 />
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="21" preserveAspectRatio="none" viewBox="0 0 21 21" width="21">
        <g id="image">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip() {
  return (
    <div className="absolute inset-[0_0.5px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[257.5px] pr-[9px] py-[8.5px] relative rounded-[inherit] size-full">
        <Image />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-full">
          <p className="leading-[20px]">Chọn người giao của VP HCTP</p>
        </div>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function NgiK() {
  return (
    <div className="col-2 content-stretch flex flex-col items-start justify-self-end relative row-1 self-start shrink-0 w-[286px]" data-name="Người k">
      <Options />
    </div>
  );
}

function Image1() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="21" preserveAspectRatio="none" viewBox="0 0 21 21" width="21">
        <g id="image">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip1() {
  return (
    <div className="absolute inset-[0_0.5px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[257.5px] pr-[9px] py-[8.5px] relative rounded-[inherit] size-full">
        <Image1 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-full">
          <p className="leading-[20px]">Chọn người nhận Vụ GĐ,KT</p>
        </div>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip1 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function NgiK1() {
  return (
    <div className="col-3 content-stretch flex flex-col items-start justify-self-end relative row-1 self-start shrink-0 w-[283px]" data-name="Người k">
      <Options1 />
    </div>
  );
}

function Image2() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="21" preserveAspectRatio="none" viewBox="0 0 21 21" width="21">
        <g id="image">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip2() {
  return (
    <div className="absolute inset-[0_0.5px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[257.5px] pr-[9px] py-[8.5px] relative rounded-[inherit] size-full">
        <Image2 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-full">
          <p className="leading-[20px]">Chọn TTV nhận</p>
        </div>
      </div>
    </div>
  );
}

function Options2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip2 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function NgiK2() {
  return (
    <div className="col-4 content-stretch flex flex-col items-start justify-self-end relative row-1 self-start shrink-0 w-[283px]" data-name="Người k">
      <Options2 />
    </div>
  );
}

function Container29() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[41px] relative shrink-0 w-full" data-name="Container">
      <NgiK />
      <NgiK1 />
      <NgiK2 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Trang chủ</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[8.75px] relative shrink-0 w-[5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.75" preserveAspectRatio="none" viewBox="0 0 5 8.75" width="5">
        <g id="Container">
          <path d={svgPaths.p2c328e40} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Quản lý án GĐT/TT</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[8.75px] relative shrink-0 w-[5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.75" preserveAspectRatio="none" viewBox="0 0 5 8.75" width="5">
        <g id="Container">
          <path d={svgPaths.p2c328e40} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nhận đơn và TL vụ án</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[8.75px] relative shrink-0 w-[5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.75" preserveAspectRatio="none" viewBox="0 0 5 8.75" width="5">
        <g id="Container">
          <path d={svgPaths.p2c328e40} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Giao tiểu hồ sơ</p>
      </div>
    </div>
  );
}

function NavBreadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] h-[42px] items-center relative shrink-0 w-full" data-name="Nav - Breadcrumbs">
      <Container33 />
      <Container34 />
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] whitespace-pre">{`Chưa nhận Tiểu hồ  sơ`}</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Đã nhận Tiểu hồ sơ</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Chưa giao tiểu hồ sơ</p>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-[#8b0000] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8b0000] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Đã giao tiểu hồ sơ</p>
        </div>
      </div>
    </div>
  );
}

function TabsSection() {
  return (
    <div className="content-stretch flex gap-[32px] items-start pb-px px-[20px] relative shrink-0 w-[1336.456px]" data-name="Tabs Section">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-white h-[70px] relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-row items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function ModalContainer() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[932px] items-start left-0 max-w-[1725px] overflow-clip rounded-[2px] shadow-[0px_25px_50px_-12px_oklch(0_0_0/0.25)] top-0 w-[1392px]" data-name="ModalContainer">
      <NavBreadcrumbs />
      <TabsSection />
      <Footer />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Hiển thị 1-1 trong tổng 1 bản ghi</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="SVG">
          <path d={svgPaths.p3f953000} id="Vector" stroke="var(--stroke-0, #4B5563)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-start p-[4px] relative rounded-[4px] shrink-0" data-name="Button">
      <Svg />
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[24px]" data-name="Border">
      <div aria-hidden className="absolute border border-[#dc2626] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#dc2626] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">1</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start pl-[8px] relative shrink-0 w-[32px]" data-name="Margin">
      <Border />
    </div>
  );
}

function ButtonSvg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Button → SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Button â SVG">
          <path d={svgPaths.p43eff00} id="Vector" stroke="var(--stroke-0, #4B5563)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] pr-[4px] py-[4px] relative shrink-0" data-name="Button:margin">
      <ButtonSvg />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Button4 />
      <Margin6 />
      <ButtonMargin />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[16px] relative shrink-0" data-name="Margin">
      <Container41 />
    </div>
  );
}

function Image3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">
          <p className="leading-[24px]">10 / trang</p>
        </div>
      </div>
    </div>
  );
}

function Options3() {
  return (
    <div className="bg-white content-stretch flex items-center pl-[9px] pr-[33px] py-[5px] relative rounded-[4px] shrink-0" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[66px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image3 />
      </div>
      <Container42 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[16px] relative shrink-0" data-name="Margin">
      <Options3 />
    </div>
  );
}

function PaginationInfo() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Pagination Info">
      <Container40 />
      <Margin5 />
      <Margin7 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#800000] content-stretch flex flex-col items-center justify-center px-[24px] py-[9px] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">Lưu</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#17a2b8] content-stretch flex flex-col items-center justify-center px-[24px] py-[9px] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">In danh sách</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Button:margin">
      <Button6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[25px] py-[9px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Đóng</p>
      </div>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Button:margin">
      <Button7 />
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Action Buttons">
      <Button5 />
      <ButtonMargin1 />
      <ButtonMargin2 />
    </div>
  );
}

function Footer1() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-between left-[13px] p-[16px] top-[780.31px] w-[1374px]" data-name="Footer">
      <PaginationInfo />
      <ActionButtons />
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[60px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">STT</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[200px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Thông tin đơn</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[150px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full whitespace-pre-wrap">
        <p className="leading-[19.5px] mb-0">{`Đương sự và `}</p>
        <p className="leading-[19.5px]">người đứng đơn</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[16px] pr-[17px] py-[12px] relative shrink-0 w-[190px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px] mb-0">Thông tin BA/QĐ đề nghị</p>
        <p className="leading-[19.5px]">GĐT,TT</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[135px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px] mb-0 whitespace-pre">{`Người giao `}</p>
        <p className="leading-[19.5px] whitespace-pre">{`VPHCTP `}</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[135px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px] mb-0 whitespace-pre">{`Người nhận `}</p>
        <p className="leading-[19.5px] whitespace-pre">{`Vụ GĐ,KT `}</p>
      </div>
    </div>
  );
}

function Cell6() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[135px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Ngày Vụ nhận</p>
      </div>
    </div>
  );
}

function Cell7() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[135px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">{`TTV nhận `}</p>
      </div>
    </div>
  );
}

function Cell8() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pl-[16px] pr-[17px] pt-[21.25px] relative shrink-0 w-[135px]" data-name="Cell">
      <div aria-hidden className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Ngày TTV nhận</p>
      </div>
    </div>
  );
}

function Cell9() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[22.25px] pt-[21.25px] px-[16px] relative shrink-0 w-[95px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Ghi chú</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Cell />
        <Cell1 />
        <Cell2 />
        <Cell3 />
        <Cell4 />
        <Cell5 />
        <Cell6 />
        <Cell7 />
        <Cell8 />
        <Cell9 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Row />
    </div>
  );
}

function DataStt() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-px pb-[126px] pl-[16px] pr-[17px] pt-[16px] right-[1313px] top-[-1px]" data-name="Data - STT">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">1</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p>
            <span className="leading-[19.5px]">Mã đơn:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 6966`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p className="mb-0">
            <span className="leading-[19.5px]">CV chuyển:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 514 -`}</span>
          </p>
          <p className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px]">20/07/2026</p>
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p>
            <span className="leading-[19.5px]">Thụ lý mới:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 54682424`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p className="mb-0">
            <span className="leading-[19.5px]">Hình thức:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` CV kiến nghị`}</span>
          </p>
          <p className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px]">GĐT, TT</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#16a34a] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pl-[10px] relative size-full">
        <Container43 />
        <Container44 />
        <Container45 />
        <Container46 />
      </div>
    </div>
  );
}

function DataThongTinDn() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[58px] pl-[16px] pr-[17px] py-[16.5px] right-[1116px] top-[-1px]" data-name="Data - Thông tin đơn">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <VerticalBorder />
    </div>
  );
}

function DataNgiDNgh() {
  return (
    <div className="absolute content-stretch flex flex-col h-[153px] items-start left-[258px] pb-[106.75px] pl-[16px] pr-[17px] pt-[16.25px] right-[966px] top-[-1px]" data-name="Data - Người đề ngh">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[0px] w-[134px] whitespace-pre-wrap">
        <p className="mb-0 text-[12px] text-black">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">{`Người khiếu nại: `}</span>
          <span className="leading-[16px]">Đỗ Tất Đạt</span>
        </p>
        <p className="leading-[19.5px] mb-0 text-[12px]">​</p>
        <p className="mb-0 text-[12px] text-black">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">Bị cáo:</span>
          <span className="leading-[16px]">{` Vũ Hòa Hảo`}</span>
        </p>
        <p className="leading-[19.5px] mb-0 text-[12px]">​</p>
        <p className="text-[12px] text-black">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">NĐĐ:</span>
          <span className="leading-[16px]">{` NGUYỄN TRUNG HÒA`}</span>
        </p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="[word-break:break-word] h-[39px] leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center left-0 top-[9.5px]">
        <p>
          <span className="leading-[19.5px]">Số BA:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` CVKN_GDT `}</span>
        </p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center left-[129.12px] top-[9.5px]">
        <p className="leading-[19.5px]">Ngày:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center left-0 top-[29px]">
        <p className="leading-[19.5px]">20/07/2026</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
        <p>
          <span className="leading-[19.5px]">Tại:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` Tòa án nhân dân cấp cao `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">tại Hà Nội</span>
        </p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#fff3cd] content-stretch flex items-start px-[9px] py-[3px] relative rounded-[4px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ffeeba] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#856404] text-[11px] whitespace-nowrap">
        <p className="leading-[16.5px]">Cấp xét xử: Sơ thẩm</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph />
        <Container48 />
        <BackgroundBorder />
      </div>
    </div>
  );
}

function DataThongTinBaQ() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[408px] pb-[37px] pl-[16px] pr-[17px] pt-[16.5px] right-[774px] top-[-1px]" data-name="Data - Thông tin BA/Q">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container47 />
    </div>
  );
}

function IconWrapper() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiGiao() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[600px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[640px] top-0" data-name="Data - Người giao">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[122px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người giao
            </p>
          </div>
          <IconWrapper />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function IconWrapper1() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiNhn() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1007px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[232px] top-[3px]" data-name="Data - Người nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[130px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người nhận
            </p>
          </div>
          <IconWrapper1 />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
          <p className="leading-[normal]">dd/mm/yyyy</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[30px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[14px] pt-[13px] px-[13px] relative size-full">
          <Container50 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Svg1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="SVG">
      <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end p-[2px] relative size-full">
          <div className="relative shrink-0 size-[12px]" data-name="Vector">
            <div className="absolute inset-[-5.56%]">
              <svg className="block size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                <path d={svgPaths.p1f159560} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute bottom-[-5.5px] content-stretch flex items-center right-0 top-[5.5px] w-[16px]" data-name="Container">
      <Svg1 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[30px] relative shrink-0 w-[119px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input />
        <Container51 />
      </div>
    </div>
  );
}

function DataNgayNhn() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1146px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[97px] top-[3px]" data-name="Data - Ngày nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container49 />
    </div>
  );
}

function Container52() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
          <p className="leading-[normal]">Nhập ghi chú</p>
        </div>
      </div>
    </div>
  );
}

function DataGhiChInput() {
  return (
    <div className="absolute bg-white h-[33px] left-[1277px] right-[13px] rounded-[6px] top-[17px]" data-name="Data - Ghi ch → Input">
      <div className="content-stretch flex items-start justify-center overflow-clip pb-[14px] pt-[13px] px-[13px] relative rounded-[inherit] size-full">
        <Container52 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Container54() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
          <p className="leading-[normal]">dd/mm/yyyy</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[30px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[14px] pt-[13px] px-[13px] relative size-full">
          <Container54 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Svg2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="SVG">
      <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end p-[2px] relative size-full">
          <div className="relative shrink-0 size-[12px]" data-name="Vector">
            <div className="absolute inset-[-5.56%]">
              <svg className="block size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                <path d={svgPaths.p1f159560} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute bottom-[-5.5px] content-stretch flex items-center right-0 top-[5.5px] w-[16px]" data-name="Container">
      <Svg2 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[30px] relative shrink-0 w-[117px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input1 />
        <Container55 />
      </div>
    </div>
  );
}

function DataNgayNhn1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[145px] items-start left-[871px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[368px] top-0" data-name="Data - Ngày nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container53 />
    </div>
  );
}

function IconWrapper2() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiNhn1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[734px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[505px] top-0" data-name="Data - Người nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[123px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người nhận
            </p>
          </div>
          <IconWrapper2 />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function BodyRow() {
  return (
    <div className="h-[162px] mb-[-1px] relative shrink-0 w-full" data-name="Body → Row">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <DataStt />
      <DataThongTinDn />
      <DataNgiDNgh />
      <DataThongTinBaQ />
      <DataNgiGiao />
      <DataNgiNhn />
      <DataNgayNhn />
      <DataGhiChInput />
      <DataNgayNhn1 />
      <DataNgiNhn1 />
    </div>
  );
}

function DataStt1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-px pb-[126px] pl-[16px] pr-[17px] pt-[16px] right-[1313px] top-[-1px]" data-name="Data - STT">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">2</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p>
            <span className="leading-[19.5px]">Mã đơn:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 6966`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p className="mb-0">
            <span className="leading-[19.5px]">CV chuyển:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 514 -`}</span>
          </p>
          <p className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px]">20/07/2026</p>
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p>
            <span className="leading-[19.5px]">Thụ lý mới:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` 54682424`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
          <p className="mb-0">
            <span className="leading-[19.5px]">Hình thức:</span>
            <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` CV kiến nghị`}</span>
          </p>
          <p className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px]">GĐT, TT</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#16a34a] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pl-[10px] relative size-full">
        <Container56 />
        <Container57 />
        <Container58 />
        <Container59 />
      </div>
    </div>
  );
}

function DataThongTinDn1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[58px] pl-[16px] pr-[17px] py-[16.5px] right-[1116px] top-[-1px]" data-name="Data - Thông tin đơn">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <VerticalBorder1 />
    </div>
  );
}

function DataNgiDNgh1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[128px] items-start left-[258px] pb-[106.75px] pl-[16px] pr-[17px] pt-[16.25px] right-[966px] top-[-1px]" data-name="Data - Người đề ngh">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[131px] whitespace-pre-wrap">
        <p className="mb-0">
          <span className="leading-[16px]">{`Người khiếu nại                                          : `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic text-black">Đỗ Tất Đạt</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p className="mb-0">
          <span className="leading-[16px]">Bị cáo:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic text-black">{` Vũ Hòa Hảo`}</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p>
          <span className="leading-[16px]">NĐĐ:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic text-black">{` NGUYỄN TRUNG HÒA`}</span>
        </p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="[word-break:break-word] h-[39px] leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center left-0 top-[9.5px]">
        <p>
          <span className="leading-[19.5px]">Số BA:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` CVKN_GDT `}</span>
        </p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center left-[129.12px] top-[9.5px]">
        <p className="leading-[19.5px]">Ngày:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center left-0 top-[29px]">
        <p className="leading-[19.5px]">20/07/2026</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[13px] w-full">
        <p>
          <span className="leading-[19.5px]">Tại:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">{` Tòa án nhân dân cấp cao `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[19.5px] not-italic">tại Hà Nội</span>
        </p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#fff3cd] content-stretch flex items-start px-[9px] py-[3px] relative rounded-[4px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ffeeba] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#856404] text-[11px] whitespace-nowrap">
        <p className="leading-[16.5px]">Cấp xét xử : Sơ thẩm</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph1 />
        <Container61 />
        <BackgroundBorder1 />
      </div>
    </div>
  );
}

function DataThongTinBaQ1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[128px] items-start left-[408px] pb-[37px] pl-[16px] pr-[17px] pt-[16.5px] right-[774px] top-[-1px]" data-name="Data - Thông tin BA/Q">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container60 />
    </div>
  );
}

function IconWrapper3() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiGiao1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[600px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[638px] top-0" data-name="Data - Người giao">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[119px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người giao
            </p>
          </div>
          <IconWrapper3 />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
          <p className="leading-[normal]">dd/mm/yyyy</p>
        </div>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[30px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[14px] pt-[13px] px-[13px] relative size-full">
          <Container63 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Svg3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="SVG">
      <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end p-[2px] relative size-full">
          <div className="relative shrink-0 size-[12px]" data-name="Vector">
            <div className="absolute inset-[-5.56%]">
              <svg className="block size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                <path d={svgPaths.p1f159560} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute bottom-[-5.5px] content-stretch flex items-center right-0 top-[5.5px] w-[16px]" data-name="Container">
      <Svg3 />
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[30px] relative shrink-0 w-[124px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input2 />
        <Container64 />
      </div>
    </div>
  );
}

function DataNgayNhn2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1138px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[101px] top-[-2px]" data-name="Data - Ngày nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container62 />
    </div>
  );
}

function Container65() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] w-[79px]">
          <p className="leading-[normal]">Nhập ghi chú</p>
        </div>
      </div>
    </div>
  );
}

function DataGhiChInput1() {
  return (
    <div className="absolute bg-white h-[33px] left-[1280px] right-[5px] rounded-[6px] top-[17px]" data-name="Data - Ghi ch → Input">
      <div className="content-stretch flex items-start justify-center overflow-clip pb-[14px] pt-[13px] px-[13px] relative rounded-[inherit] size-full">
        <Container65 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Container67() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
          <p className="leading-[normal]">dd/mm/yyyy</p>
        </div>
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[30px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[14px] pt-[13px] px-[13px] relative size-full">
          <Container67 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function Svg4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="SVG">
      <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end p-[2px] relative size-full">
          <div className="relative shrink-0 size-[12px]" data-name="Vector">
            <div className="absolute inset-[-5.56%]">
              <svg className="block size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                <path d={svgPaths.p1f159560} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute bottom-[-5.5px] content-stretch flex items-center right-0 top-[5.5px] w-[16px]" data-name="Container">
      <Svg4 />
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[30px] relative shrink-0 w-[123px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input3 />
        <Container68 />
      </div>
    </div>
  );
}

function DataNgayNhn3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[120px] items-start left-[866px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[373px] top-px" data-name="Data - Ngày nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <Container66 />
    </div>
  );
}

function IconWrapper4() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiNhn2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[127px] items-start left-[732px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] right-[507px] top-0" data-name="Data - Người nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[123px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người nhận
            </p>
          </div>
          <IconWrapper4 />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function BodyRow1() {
  return (
    <div className="h-[162px] relative shrink-0 w-full" data-name="Body → Row">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <DataStt1 />
      <DataThongTinDn1 />
      <DataNgiDNgh1 />
      <DataThongTinBaQ1 />
      <DataNgiGiao1 />
      <DataNgayNhn2 />
      <DataGhiChInput1 />
      <DataNgayNhn3 />
      <DataNgiNhn2 />
    </div>
  );
}

function MainTableSectionTable() {
  return (
    <div className="absolute content-stretch flex flex-col h-[444.156px] items-start left-0 min-w-[1200px] overflow-auto top-[342.22px] w-[1374px]" data-name="Main - TableSection → Table">
      <Header />
      <BodyRow />
      <BodyRow1 />
    </div>
  );
}

function IconWrapper5() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[10px]" data-name="icon-wrapper">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.25" preserveAspectRatio="none" viewBox="0 0 10 11.25" width="10">
        <g id="icon-wrapper">
          <path d={svgPaths.p25f1fd70} fill="var(--fill-0, black)" fillOpacity="0.85" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function DataNgiNhn3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1002px] pb-[103.5px] pl-[5px] pr-[13px] pt-[16.5px] top-[568.26px] w-[135px]" data-name="Data - Người nhận">
      <div aria-hidden className="absolute border-[#f3f4f6] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-white relative rounded-[2px] shrink-0 w-[122px]" data-name="Dropdown-Trigger">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[16px] py-[5px] relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="Text/Text">
            <p className="[word-break:break-word] font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.45)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              Chọn người nhận
            </p>
          </div>
          <IconWrapper5 />
        </div>
        <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[0px_2px_0px_0px_oklch(0_0_0/0.02)]" />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">{`Người đứng  đơn`}</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Người gửi đơn</p>
        </div>
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container70 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function FilterRow() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Filter Row 1">
      <Label />
      <Input4 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Số bản án/quyết định</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Số bản án/quyết định</p>
        </div>
      </div>
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container72 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container71() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label1 />
      <Input5 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Ngày bản án/quyết định</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Vui lòng chọn</p>
        </div>
      </div>
    </div>
  );
}

function Input6() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container75 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[14px] relative shrink-0 w-[12.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12.25 14" width="12.25">
        <g id="Container">
          <path d={svgPaths.p22c77900} fill="var(--fill-0, #9CA3AF)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0 w-full" data-name="Container">
      <Input6 />
      <Container76 />
    </div>
  );
}

function Container73() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label2 />
      <Container74 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Tòa ra bản án/quyết định</p>
      </div>
    </div>
  );
}

function Image4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip3() {
  return (
    <div className="absolute inset-[0_-0.67px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.34px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image4 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Vui lòng chọn</p>
        </div>
      </div>
    </div>
  );
}

function Options4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip3 />
          <Container78 />
        </div>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="col-4 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label3 />
      <Options4 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Ngày nhận đơn</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Vui lòng chọn</p>
        </div>
      </div>
    </div>
  );
}

function Input7() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container81 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[14px] relative shrink-0 w-[12.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12.25 14" width="12.25">
        <g id="Container">
          <path d={svgPaths.p22c77900} fill="var(--fill-0, #9CA3AF)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Input7 />
      <Container82 />
    </div>
  );
}

function Container79() {
  return (
    <div className="col-5 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label4 />
      <Container80 />
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Thụ lý đơn</p>
      </div>
    </div>
  );
}

function Image5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip4() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image5 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Thụ lý đơn</p>
        </div>
      </div>
    </div>
  );
}

function Options5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip4 />
          <Container84 />
        </div>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="col-6 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label5 />
      <Options5 />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">{`Số  công văn chuyển`}</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Số công văn chuyển</p>
        </div>
      </div>
    </div>
  );
}

function Input8() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container85 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function FilterRow1() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Filter Row 2">
      <Label6 />
      <Input8 />
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Ngày công văn chuyển</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pt-[2px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[normal]">Ngày công văn chuyển</p>
        </div>
      </div>
    </div>
  );
}

function Input9() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container88 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[14px] relative shrink-0 w-[12.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12.25 14" width="12.25">
        <g id="Container">
          <path d={svgPaths.p22c77900} fill="var(--fill-0, #9CA3AF)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Input9 />
      <Container89 />
    </div>
  );
}

function Container86() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label7 />
      <Container87 />
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Thẩm phán</p>
      </div>
    </div>
  );
}

function Image6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip5() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image6 />
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Chọn cán bộ giải quyết</p>
        </div>
      </div>
    </div>
  );
}

function Options6() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip5 />
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label8 />
      <Options6 />
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Loại án</p>
      </div>
    </div>
  );
}

function Image7() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip6() {
  return (
    <div className="absolute inset-[0_-0.67px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.34px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image7 />
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Loại án</p>
        </div>
      </div>
    </div>
  );
}

function Options7() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip6 />
          <Container93 />
        </div>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="col-4 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label9 />
      <Options7 />
    </div>
  );
}

function Label10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Giao tiểu hồ sơ</p>
      </div>
    </div>
  );
}

function Image8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip7() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image8 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Giao tiểu hồ sơ</p>
        </div>
      </div>
    </div>
  );
}

function Options8() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip7 />
          <Container95 />
        </div>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="col-5 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label10 />
      <Options8 />
    </div>
  );
}

function Label11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Thẩm tra viên</p>
      </div>
    </div>
  );
}

function Image9() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="image">
          <path d="M5.4 7.2L9 10.8L12.6 7.2" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip8() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image9 />
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">TTV giải quyết</p>
        </div>
      </div>
    </div>
  );
}

function Options9() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip8 />
          <Container97 />
        </div>
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="col-6 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label11 />
      <Options9 />
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[__58px_58px] relative size-full">
        <FilterRow />
        <Container71 />
        <Container73 />
        <Container77 />
        <Container79 />
        <Container83 />
        <FilterRow1 />
        <Container86 />
        <Container90 />
        <Container92 />
        <Container94 />
        <Container96 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="h-[6px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 10.5 6" width="10.5">
        <g id="Container">
          <path d={svgPaths.p10eeb7e0} fill="var(--fill-0, #2563EB)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <Container99 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Thu gọn</p>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Container">
          <path d={svgPaths.pe2f1180} fill="var(--fill-0, white)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#8b0000] content-stretch flex gap-[8px] items-center px-[16px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container101 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Tìm kiếm</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[10.875px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.875 10.5" width="10.875">
        <g id="Container">
          <path d={svgPaths.pf896b80} fill="var(--fill-0, #4B5563)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container102 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Xóa bộ lọc</p>
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container98() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-[8px] relative size-full">
        <Button8 />
        <Container100 />
      </div>
    </div>
  );
}

function FilterGrid() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start left-0 p-[17px] rounded-[4px] top-0 w-[1348px]" data-name="Filter Grid">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container69 />
      <Container98 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[29px] top-0">
      <FilterGrid />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[2px] top-[86px]">
      <Footer1 />
      <MainTableSectionTable />
      <DataNgiNhn3 />
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <ModalContainer />
      <Group1 />
    </div>
  );
}

function GiaoTiuHS1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[932px] items-start px-[18px] py-[290px] relative shrink-0 w-[1392px]" data-name="Giao tiểu hồ sơ">
      <Container29 />
      <Group2 />
    </div>
  );
}

export default function GiaoTiuHS() {
  return (
    <div className="content-stretch flex items-end relative size-full" data-name="Giao tiểu hồ sơ">
      <HtmlBody />
      <GiaoTiuHS1 />
    </div>
  );
}