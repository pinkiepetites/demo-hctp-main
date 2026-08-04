import svgPaths from "./svg-y78w10grin";
import imgImage2 from "./ff1d113cee80a948cc05d656387792dca2734042.png";

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
    <div className="bg-[#fef2f2] relative shrink-0 w-full" data-name="Item → Link">
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

function HtmlBody() {
  return (
    <div className="content-stretch flex h-full isolate items-start relative shrink-0 w-[288px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <Frame1 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Container">
          <path d={svgPaths.p39e87d00} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 size-[12.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.25" preserveAspectRatio="none" viewBox="0 0 12.25 12.25" width="12.25">
        <g id="Container">
          <path d={svgPaths.p556a000} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[8.75px] relative shrink-0 w-[12.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.75" preserveAspectRatio="none" viewBox="0 0 12.25 8.75" width="12.25">
        <g id="Container">
          <path d={svgPaths.p3de617e0} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col items-start px-[4px] right-[-4px] rounded-[9999px] top-[-4px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[20px]">3</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="h-[14px] relative shrink-0 w-[12.253px]" data-name="Symbol">
        <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12.2526 14" width="12.2526">
          <path d={svgPaths.p2af93118} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </svg>
      </div>
      <Background1 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[10.498px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.25" preserveAspectRatio="none" viewBox="0 0 10.4979 12.25" width="10.4979">
        <g id="Container">
          <path d={svgPaths.p2f01080} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[13.125px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.25" preserveAspectRatio="none" viewBox="0 0 13.125 12.25" width="13.125">
        <g id="Container">
          <path d={svgPaths.p20f5d00} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container30 />
        <Container31 />
        <Container32 />
        <Container33 />
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function TopHeader() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[48px] items-center justify-end pb-px px-[16px] relative shrink-0 w-[1368px]" data-name="Top Header">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Container29 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Trang chủ</p>
      </div>
    </div>
  );
}

function Container37() {
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

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Quản lý án GĐT/TT</p>
      </div>
    </div>
  );
}

function Container39() {
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

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nhận đơn và TL vụ án</p>
      </div>
    </div>
  );
}

function Container41() {
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

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Danh sách</p>
      </div>
    </div>
  );
}

function NavBreadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Nav - Breadcrumbs">
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
      <Container41 />
      <Container42 />
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Tất cả (49)</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-[#8b0000] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8b0000] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">{`Chờ ý kiến LĐ (4) `}</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <a className="cursor-pointer relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Chưa có vụ án (5)</p>
        </div>
      </div>
    </a>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Hồ sơ kháng nghị (+3)</p>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Đã có vụ án (+37)</p>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-transparent border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Trả lại (2)</p>
        </div>
      </div>
    </div>
  );
}

function TabsSection() {
  return (
    <div className="content-stretch flex gap-[32px] items-start pb-px relative shrink-0 w-full" data-name="Tabs Section">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Người gửi đơn</p>
      </div>
    </div>
  );
}

function Container44() {
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

function Input() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container44 />
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
      <Input />
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

function Container46() {
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

function Input1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container46 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container45() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label1 />
      <Input1 />
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

function Container49() {
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

function Input2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container49 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container50() {
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

function Container48() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0 w-full" data-name="Container">
      <Input2 />
      <Container50 />
    </div>
  );
}

function Container47() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label2 />
      <Container48 />
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

function Image() {
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

function ImageClip() {
  return (
    <div className="absolute inset-[0_-0.67px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.34px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image />
      </div>
    </div>
  );
}

function Container52() {
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

function Options() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip />
          <Container52 />
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="col-4 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label3 />
      <Options />
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

function Container55() {
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

function Input3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-[205px]" data-name="Input">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[10px] pt-[9px] px-[13px] relative rounded-[inherit] size-full">
        <Container55 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container56() {
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

function Container54() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Input3 />
      <Container56 />
    </div>
  );
}

function Container53() {
  return (
    <div className="col-5 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Label4 />
      <Container54 />
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[205.667px]" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Thụ lý đơn</p>
      </div>
    </div>
  );
}

function Image1() {
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

function ImageClip1() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image1 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 w-[153px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Thụ lý đơn</p>
        </div>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative rounded-[4px] shrink-0 w-[205.667px]" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <ImageClip1 />
      <Container58 />
    </div>
  );
}

function Container57() {
  return (
    <div className="col-6 content-stretch flex flex-col gap-[4px] items-start justify-self-start relative row-1 self-start shrink-0" data-name="Container">
      <Label5 />
      <Options1 />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Số công văn chuyển</p>
      </div>
    </div>
  );
}

function Container59() {
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

function Input4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container59 />
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
      <Input4 />
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

function Container62() {
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

function Input5() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[13px] relative size-full">
          <Container62 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container63() {
  return <div className="h-[14px] relative shrink-0 w-[12.25px]" data-name="Container" />;
}

function Container61() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Input5 />
      <Container63 />
      <div className="h-[14px] relative shrink-0 w-[12.25px]" data-name="Symbol">
        <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12.25 14" width="12.25">
          <path d={svgPaths.p22c77900} fill="var(--fill-0, #9CA3AF)" id="Symbol" />
        </svg>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label7 />
      <Container61 />
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

function Image2() {
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

function ImageClip2() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image2 />
      </div>
    </div>
  );
}

function Container65() {
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

function Options2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip2 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label8 />
      <Options2 />
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

function ImageClip3() {
  return (
    <div className="absolute inset-[0_-0.67px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.34px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image3 />
      </div>
    </div>
  );
}

function Container67() {
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

function Options3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip3 />
          <Container67 />
        </div>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="col-4 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label9 />
      <Options3 />
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

function ImageClip4() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image4 />
      </div>
    </div>
  );
}

function Container69() {
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

function Options4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[13px] pr-[41px] py-[9px] relative size-full">
          <ImageClip4 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="col-5 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label10 />
      <Options4 />
    </div>
  );
}

function Label11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[11px] w-full">
        <p className="leading-[20px]">Ghép vụ án</p>
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

function ImageClip5() {
  return (
    <div className="absolute inset-[0_-0.66px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[119.33px] pr-[9px] py-[8px] relative rounded-[inherit] size-full">
        <Image5 />
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
          <p className="leading-[16px]">Ghép vụ án</p>
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
          <ImageClip5 />
          <Container71 />
        </div>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="col-6 content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label11 />
      <Options5 />
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[__58px_58px] relative size-full">
        <FilterRow />
        <Container45 />
        <Container47 />
        <Container51 />
        <Container53 />
        <Container57 />
        <FilterRow1 />
        <Container60 />
        <Container64 />
        <Container66 />
        <Container68 />
        <Container70 />
      </div>
    </div>
  );
}

function Container73() {
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

function Button6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <Container73 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Thu gọn</p>
      </div>
    </div>
  );
}

function Container75() {
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

function Button7() {
  return (
    <div className="bg-[#8b0000] content-stretch flex gap-[8px] items-center px-[16px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container75 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Tìm kiếm</p>
      </div>
    </div>
  );
}

function Container76() {
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

function Button8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container76 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Xóa bộ lọc</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container72() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-[8px] relative size-full">
        <Button6 />
        <Container74 />
      </div>
    </div>
  );
}

function FilterGrid() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[4px] shrink-0 w-full" data-name="Filter Grid">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[17px] relative size-full">
        <Container43 />
        <Container72 />
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[10.875px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.875 10.5" width="10.875">
        <g id="Container">
          <path d={svgPaths.p29097e80} fill="var(--fill-0, white)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#8b0000] col-1 content-stretch flex gap-[8px] items-center ml-0 mt-0 px-[16px] py-[7px] relative rounded-[4px] row-1 w-[93px]" data-name="Button">
      <Container77 />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Trả đơn</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[13.125px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.25" preserveAspectRatio="none" viewBox="0 0 13.125 12.25" width="13.125">
        <g id="Container">
          <path d={svgPaths.p20f5d00} fill="var(--fill-0, #4B5563)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center ml-[107px] mt-px px-[13px] py-[8px] relative rounded-[4px] row-1 w-[39px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container78 />
    </div>
  );
}

function Group2() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[1190px] mt-px place-items-start relative row-1">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Button11() {
  return <div className="bg-white col-1 h-[24.5px] ml-0 mt-0 relative rounded-[4px] row-1 w-[303.446px]" data-name="Button" />;
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group2 />
      <Button11 />
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center pb-[20.5px] pt-[12px] px-[12px] relative shrink-0 w-[51px]" data-name="Cell">
      <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center pb-[20.5px] pt-[12px] px-[12px] relative shrink-0 w-[53px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center uppercase whitespace-nowrap">
        <p className="leading-[16px]">STT</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center pb-[20.5px] pt-[12px] px-[12px] relative shrink-0 w-[268px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">THÔNG TIN ĐƠN</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-center p-[12px] relative shrink-0 w-[204px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] uppercase w-full">
        <p className="leading-[16px]">{`ĐƯƠNG SỰ & NGƯỜI Đứng đơn`}</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start pb-[20.5px] pt-[12px] px-[12px] relative shrink-0 w-[247px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="content-stretch flex flex-col items-center p-[12px] relative shrink-0 w-[211px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center uppercase w-full">
        <p className="leading-[16px]">Ý kiến lãnh đạo</p>
      </div>
    </div>
  );
}

function Cell6() {
  return (
    <div className="content-stretch flex flex-col items-center p-[12px] relative shrink-0 w-[187px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center uppercase w-[146px]">
        <p className="leading-[16px]">Thông tin NHẬN/TRẢ</p>
      </div>
    </div>
  );
}

function Cell7() {
  return (
    <div className="content-stretch flex flex-col items-center p-[12px] relative shrink-0 w-[125px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[12px] text-center uppercase whitespace-nowrap">
        <p className="leading-[16px]">THAO TÁC</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Cell />
        <Cell1 />
        <Cell2 />
        <Cell3 />
        <Cell4 />
        <Cell5 />
        <Cell6 />
        <Cell7 />
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

function Data() {
  return (
    <div className="content-stretch flex flex-col items-center px-[12px] py-[47.5px] relative shrink-0 w-[40px]" data-name="Data">
      <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-center px-[12px] py-[47.5px] relative shrink-0 w-[48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Mã đơn:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic text-black">{` 4984`}</span>
        </p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Hình thức:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` Đơn đề nghị GĐT/TT`}</span>
        </p>
      </div>
    </div>
  );
}

function Height() {
  return (
    <div className="flex h-[6.002px] items-center justify-center relative shrink-0 w-[0.001px]">
      <div className="-rotate-90 flex-none">
        <div className="content-stretch flex gap-[6px] items-center overflow-clip relative" data-name="height">
          <div className="relative shrink-0 size-[0.001px]" />
          <div className="relative shrink-0 size-[0.001px]" />
        </div>
      </div>
    </div>
  );
}

function Width() {
  return (
    <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-name="width">
      <div className="relative shrink-0 size-[0.001px]" />
      <div className="relative shrink-0 size-[0.001px]" />
    </div>
  );
}

function Dot() {
  return (
    <div className="bg-[#820014] content-stretch flex items-start overflow-clip relative rounded-[100px] shrink-0" data-name="dot">
      <Height />
      <Width />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-self-start leading-[0] place-items-start relative self-start shrink-0">
      <div className="[word-break:break-word] col-1 flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center ml-[22px] mt-[4px] not-italic relative row-1 text-[#8b0000] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Án tử hình</p>
      </div>
      <div className="col-1 content-stretch flex gap-[8px] items-center ml-[8px] mt-[10px] relative row-1" data-name="Badge/Status">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-start relative rounded-[100px] shrink-0" data-name="Badge/Dot">
          <Dot />
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#f8f4ff] col-1 gap-x-[10px] gap-y-[10px] grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[24px] ml-[93px] mt-0 px-[8px] py-[4px] relative rounded-[24px] row-1 w-[83px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#8b0000] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[82px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <Button12 />
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[292px]" data-name="Data">
      <Container79 />
      <Container80 />
      <Group1 />
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] pr-[12px] py-[39.5px] relative shrink-0 w-[185px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[143px] whitespace-pre-wrap">
        <p className="mb-0">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">{`Người khiếu nại: `}</span>
          <span className="leading-[16px]">Đỗ Tất Đạt</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p className="mb-0">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">Bị cáo:</span>
          <span className="leading-[16px]">{` Vũ Hòa Hảo`}</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">NĐĐ:</span>
          <span className="leading-[16px]">{` Võ Hoài Trâm`}</span>
        </p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Số BA:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` HKTT_0506_05 `}</span>
          <span className="leading-[16px]">{`Ngày: `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">04/06/2026</span>
        </p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Tại:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` Tòa án nhân dân khu vực 7 - Đà `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">Nẵng</span>
        </p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#f97316] text-[12px] w-full">
        <p className="leading-[16px]">Cấp xét xử: Sơ thẩm</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[254px]" data-name="Data">
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#e5e7eb] gap-x-[10px] gap-y-[10px] grid-cols-[repeat(1,fit-content(100%))] grid-rows-[repeat(1,fit-content(100%))] inline-grid px-[8px] py-[4px] relative rounded-[24px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center justify-self-start leading-[0] not-italic relative self-start shrink-0 text-[#374151] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Không thụ lý</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start ml-0 mt-[16px] relative row-1 w-[160.48px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[word-break:break-word] col-1 flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center ml-0 mt-0 not-italic relative row-1 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Bình - Vụ trưởng</p>
      </div>
      <Container84 />
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-white h-[15px] relative rounded-[24px] shrink-0 w-[16px]" data-name="Button">
      <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#e5e7eb] gap-x-[10px] gap-y-[10px] grid-cols-[repeat(1,fit-content(100%))] grid-rows-[repeat(1,fit-content(100%))] inline-grid px-[8px] py-[4px] relative rounded-[24px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center justify-self-start leading-[0] not-italic relative self-start shrink-0 text-[#374151] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Không thụ lý</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start ml-0 mt-[16px] relative row-1 w-[160.48px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[word-break:break-word] col-1 flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center ml-0 mt-0 not-italic relative row-1 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Văn Tiến - Phó CA</p>
      </div>
      <Container85 />
    </div>
  );
}

function Container86() {
  return <div className="h-[16px] relative shrink-0 w-full" data-name="Container" />;
}

function Data5() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[199px]" data-name="Data">
      <Button13 />
      <Group6 />
      <Button14 />
      <Button15 />
      <Group7 />
      <Container86 />
    </div>
  );
}

function Data6() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[24px] pr-[12px] py-[45.5px] relative shrink-0 w-[182px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p className="leading-[16px]">-</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 13.5 10.5" width="13.5">
        <g id="Container">
          <path d={svgPaths.p251d580} fill="var(--fill-0, #3B82F6)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="col-1 content-stretch flex items-center justify-center ml-0 mt-[3px] relative row-1" data-name="Button">
      <Container87 />
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Button16 />
      <div className="col-1 h-[17px] ml-[15.75px] mt-0 overflow-clip relative row-1 w-[20px]" data-name="plus-square">
        <div className="absolute inset-[17.97%]" data-name="bg">
          <svg className="absolute block inset-0 size-full" fill="none" height="10.8906" preserveAspectRatio="none" viewBox="0 0 12.8125 10.8906" width="12.8125">
            <path d={svgPaths.p233cb200} fill="var(--fill-0, white)" id="bg" />
          </svg>
        </div>
        <div className="absolute inset-[10.94%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.2812" preserveAspectRatio="none" viewBox="0 0 15.625 13.2812" width="15.625">
            <g id="Vector">
              <path d={svgPaths.pcce2b80} fill="#096DD9" />
              <path d={svgPaths.p37d40e00} fill="#096DD9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[49.5px] pt-[49px] px-[12px] relative shrink-0 w-[147px]" data-name="Data">
      <Group5 />
    </div>
  );
}

function TableRow() {
  return (
    <div className="content-stretch flex h-[176px] items-center justify-center mb-[-1px] relative shrink-0 w-full" data-name="Table Row 1">
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
      <Data5 />
      <Data6 />
      <Data7 />
    </div>
  );
}

function Data8() {
  return (
    <div className="content-stretch flex flex-col items-center px-[12px] py-[47.5px] relative shrink-0 w-[40px]" data-name="Data">
      <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="content-stretch flex flex-col items-center px-[12px] py-[47.5px] relative shrink-0 w-[48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
        <p className="leading-[16px]">2</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Mã đơn:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic text-black">{` 4985`}</span>
        </p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Hình thức:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` Đơn đề nghị GĐT/TT`}</span>
        </p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-[82px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[292px]" data-name="Data">
      <Container88 />
      <Container89 />
      <Container90 />
    </div>
  );
}

function Data11() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] pr-[12px] py-[39.5px] relative shrink-0 w-[185px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[143px] whitespace-pre-wrap">
        <p className="mb-0">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">{`Người khiếu nại : `}</span>
          <span className="leading-[16px]">Đỗ Tất Đạt</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p className="mb-0">
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">Bị cáo:</span>
          <span className="leading-[16px]">{` Vũ Hòa Hảo`}</span>
        </p>
        <p className="leading-[16px] mb-0">​</p>
        <p>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[16px] not-italic">NĐĐ:</span>
          <span className="leading-[16px]">{` Võ Hoài Trâm`}</span>
        </p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Số BA:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` HKTT_0506_05 `}</span>
          <span className="leading-[16px]">{`Ngày: `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">04/06/2026</span>
        </p>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p>
          <span className="leading-[16px]">Tại:</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">{` Tòa án nhân dân khu vực 7 - Đà `}</span>
          <span className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[16px] not-italic">Nẵng</span>
        </p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#f97316] text-[12px] w-full">
        <p className="leading-[16px]">Cấp xét xử: Sơ thẩm</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[254px]" data-name="Data">
      <Container91 />
      <Container92 />
      <Container93 />
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-[rgba(229,253,230,0.81)] gap-x-[10px] gap-y-[10px] grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] px-[8px] py-[4px] relative rounded-[24px] shrink-0 w-[77px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#16a34a] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center justify-self-start leading-[0] not-italic relative self-start shrink-0 text-[#16a34a] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Thụ lý mới</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start ml-0 mt-[16px] relative row-1 w-[160.48px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[word-break:break-word] col-1 flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center ml-0 mt-0 not-italic relative row-1 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Thị Bình - Vụ trưởng</p>
      </div>
      <Container94 />
    </div>
  );
}

function Button18() {
  return (
    <div className="bg-white h-[12px] relative rounded-[24px] shrink-0 w-[77px]" data-name="Button">
      <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-[#e5e7eb] gap-x-[10px] gap-y-[10px] grid-cols-[repeat(1,fit-content(100%))] grid-rows-[repeat(1,fit-content(100%))] inline-grid px-[8px] py-[4px] relative rounded-[24px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center justify-self-start leading-[0] not-italic relative self-start shrink-0 text-[#374151] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Không thụ lý</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start ml-0 mt-[16px] relative row-1 w-[160.48px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[12px] w-full">
        <p className="leading-[16px]">Đã duyệt - 10/07/2026</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[word-break:break-word] col-1 flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center ml-0 mt-0 not-italic relative row-1 text-[#1f2937] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nguyễn Văn Tiến - Phó CA</p>
      </div>
      <Container95 />
    </div>
  );
}

function Container96() {
  return <div className="h-[16px] relative shrink-0 w-full" data-name="Container" />;
}

function Data13() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[12px] relative shrink-0 w-[199px]" data-name="Data">
      <Button17 />
      <Group8 />
      <Button18 />
      <Button19 />
      <Group9 />
      <Container96 />
    </div>
  );
}

function Data14() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[24px] pr-[12px] py-[45.5px] relative shrink-0 w-[182px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p className="leading-[16px]">-</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 13.5 10.5" width="13.5">
        <g id="Container">
          <path d={svgPaths.p251d580} fill="var(--fill-0, #3B82F6)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="col-1 content-stretch flex items-center justify-center ml-0 mt-[3px] relative row-1" data-name="Button">
      <Container97 />
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Button20 />
      <div className="col-1 h-[17px] ml-[15.75px] mt-0 overflow-clip relative row-1 w-[20px]" data-name="plus-square">
        <div className="absolute inset-[17.97%]" data-name="bg">
          <svg className="absolute block inset-0 size-full" fill="none" height="10.8906" preserveAspectRatio="none" viewBox="0 0 12.8125 10.8906" width="12.8125">
            <path d={svgPaths.p233cb200} fill="var(--fill-0, white)" id="bg" />
          </svg>
        </div>
        <div className="absolute inset-[10.94%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.2812" preserveAspectRatio="none" viewBox="0 0 15.625 13.2812" width="15.625">
            <g id="Vector">
              <path d={svgPaths.pcce2b80} fill="#096DD9" />
              <path d={svgPaths.p37d40e00} fill="#096DD9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[49.5px] pt-[49px] px-[12px] relative shrink-0 w-[147px]" data-name="Data">
      <Group4 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Table Row 7">
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
      <Data12 />
      <Data13 />
      <Data14 />
      <Data15 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <TableRow />
      <TableRow1 />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Header />
        <Body />
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Hiển thị 1-5 trong tổng 5 bản ghi</p>
        </div>
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[8.75px] relative shrink-0 w-[5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.75" preserveAspectRatio="none" viewBox="0 0 5 8.75" width="5">
        <g id="Container">
          <path d={svgPaths.pbd47150} fill="var(--fill-0, #6B7280)" id="Symbol" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container100 />
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-[#8b0000] content-stretch flex flex-col items-center justify-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Container101() {
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

function Button23() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container101 />
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

function Container102() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Be_Vietnam_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">10 / trang</p>
        </div>
      </div>
    </div>
  );
}

function Options6() {
  return (
    <div className="bg-white content-stretch flex items-center pl-[13px] pr-[33px] py-[5px] relative rounded-[4px] shrink-0" data-name="Options">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[70px] pr-[9px] py-[4px] relative rounded-[inherit] size-full">
        <Image6 />
      </div>
      <Container102 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <Options6 />
    </div>
  );
}

function Container99() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button21 />
        <Button22 />
        <Button23 />
        <Margin5 />
      </div>
    </div>
  );
}

function TableFooterPagination() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table Footer/Pagination">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[12px] pt-[13px] px-[12px] relative size-full">
          <Container98 />
          <Container99 />
        </div>
      </div>
    </div>
  );
}

function DataTable() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Data Table">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Table />
        <TableFooterPagination />
      </div>
      <div aria-hidden className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_oklch(0_0_0/0.05)]" />
    </div>
  );
}

function PageContent() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] h-[1288px] items-start overflow-auto p-[16px] relative shrink-0" data-name="Page Content">
      <NavBreadcrumbs />
      <TabsSection />
      <FilterGrid />
      <Group3 />
      <DataTable />
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px overflow-clip relative" data-name="Main">
      <TopHeader />
      <PageContent />
    </div>
  );
}

function TlVAnChYKinLd() {
  return (
    <div className="content-stretch flex h-full items-start relative shrink-0 w-[1380px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="TL vụ án- Chờ ý kiến LĐ">
      <Main />
    </div>
  );
}

export default function ChXinYKin() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="Chờ xin ý kiến">
      <HtmlBody />
      <TlVAnChYKinLd />
    </div>
  );
}