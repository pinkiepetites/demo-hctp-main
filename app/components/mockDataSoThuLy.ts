const TODAY=new Date(2026,8,29);
const pad=n=>String(n).padStart(2,'0');
const fmt=d=>`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
const add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const norm=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
const it=(m,s)=>({m,s:s||''});
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function RNG(seed){const f=mulberry32(seed);return{f,int:(a,b)=>a+Math.floor(f()*(b-a+1)),pick:a=>a[Math.floor(f()*a.length)],w:arr=>{let v=f()*arr.reduce((s,x)=>s+x[1],0);for(const [k,w] of arr){if((v-=w)<0)return k}return arr[0][0]}}}

const UNITS=[
  {id:'D01',ten:'Tòa án nhân dân tối cao',p:null},
  {id:'CC_HN',ten:'TAND cấp cao tại Hà Nội',p:'D01'},
  {id:'T_HN',ten:'TAND TP. Hà Nội',p:'CC_HN'},
  {id:'KV1',ten:'TAND khu vực 1 – Hà Nội',p:'T_HN'},
  {id:'KV2',ten:'TAND khu vực 2 – Hà Nội',p:'T_HN'},
  {id:'CC_DN',ten:'TAND cấp cao tại Đà Nẵng',p:'D01'},
  {id:'T_DN',ten:'TAND TP. Đà Nẵng',p:'CC_DN'},
  {id:'CC_HCM',ten:'TAND cấp cao tại TP. Hồ Chí Minh',p:'D01'},
  {id:'T_HCM',ten:'TAND TP. Hồ Chí Minh',p:'CC_HCM'}
];
const HO=['Nguyễn','Trần','Lê','Phạm','Hoàng','Vũ','Đỗ','Bùi','Đặng','Ngô','Dương','Lý','Phan','Trịnh'];
const DEM_NAM=['Văn','Minh','Quốc','Đức','Thanh','Hữu','Công'],DEM_NU=['Thị','Thu','Ngọc','Thanh','Kim'];
const TEN_NAM=['An','Cường','Dũng','Hải','Long','Nam','Phúc','Quân','Sơn','Tuấn','Vương','Hùng','Khánh','Toàn'];
const TEN_NU=['Bình','Hà','Lan','Mai','Oanh','Hương','Trang','Yến','Linh','Nga','Vân Anh'];
const DIACHI=['Phường Ba Đình, TP. Hà Nội','Phường Hoàn Kiếm, TP. Hà Nội','Xã Sóc Sơn, TP. Hà Nội','Xã Gia Lâm, TP. Hà Nội','Phường Hải Châu, TP. Đà Nẵng','Xã Hòa Vang, TP. Đà Nẵng','Phường Bến Thành, TP. Hồ Chí Minh','Xã Củ Chi, TP. Hồ Chí Minh','Xã Tân Phú, tỉnh Đồng Nai','Phường Hồng Bàng, TP. Hải Phòng'];
const NGHE=['Lao động tự do','Nông dân','Kinh doanh','Công nhân','Không nghề nghiệp','Lái xe','Nhân viên văn phòng'];
const TOI=[{d:'173',t:'Trộm cắp tài sản',bh:1},{d:'174',t:'Lừa đảo chiếm đoạt tài sản',bh:1},{d:'134',t:'Cố ý gây thương tích',bh:1},{d:'251',t:'Mua bán trái phép chất ma túy'},{d:'249',t:'Tàng trữ trái phép chất ma túy'},{d:'260',t:'Vi phạm quy định về tham gia giao thông đường bộ',bh:1},{d:'321',t:'Đánh bạc'},{d:'355',t:'Lạm dụng chức vụ, quyền hạn chiếm đoạt tài sản',bh:1}];
const KHOAN=['khoản 1','khoản 2','điểm c khoản 2','điểm a khoản 3'];
const TP=['Nguyễn Văn Hạnh','Trần Thị Thu Hà','Lê Quang Minh','Phạm Thị Hồng','Đặng Văn Tùng'],HT=['Trần Thị Thu','Lê Văn Sơn','Bùi Thị Mận','Ngô Văn Bảy'];
const KSV=['Đỗ Quang Vinh','Hoàng Thị Lụa','Vũ Minh Tiến'],TK=['Phạm Thị Hòa','Nguyễn Thu Trang','Lý Văn Đạt'];
const DOAN_LS=['Đoàn Luật sư TP. Hà Nội','Văn phòng Luật sư Minh Pháp','Trung tâm Trợ giúp pháp lý Nhà nước','Công ty Luật TNHH Tín Việt'];
const KC_ND=['Xin giảm hình phạt','Xin hưởng án treo','Kêu oan, đề nghị tuyên không phạm tội','Kháng cáo tăng mức bồi thường','Đề nghị miễn trách nhiệm hình sự'];
const KN_ND=['Kháng nghị tăng hình phạt','Kháng nghị không cho hưởng án treo','Kháng nghị áp dụng sai điều luật'];
const TOA_ST=['TAND TP. Hà Nội','TAND khu vực 1 – Hà Nội','TAND khu vực 2 – Hà Nội','TAND TP. Đà Nẵng','TAND TP. Hồ Chí Minh'];
const TOA_PT=['TAND cấp cao tại Hà Nội','TAND cấp cao tại Đà Nẵng','TAND cấp cao tại TP. Hồ Chí Minh','TAND TP. Hà Nội'];
const QH=['Không quen biết','Quen biết xã hội','Hàng xóm','Người thân trong gia đình','Đồng nghiệp'];
const DB=['Thành thị','Nông thôn','Miền núi','Vùng sâu, vùng xa','Biên giới, hải đảo'];
function person(r,young){const nam=r.f()<.72;return{ten:`${r.pick(HO)} ${r.pick(nam?DEM_NAM:DEM_NU)} ${r.pick(nam?TEN_NAM:TEN_NU)}`,ns:young?r.int(2009,2010):r.int(1962,2006),gt:nam?'Nam':'Nữ',dc:r.pick(DIACHI),nn:young?'Học sinh':r.pick(NGHE),young}}
function hp(r){return r.pick([`${r.int(6,36)} tháng tù`,`${r.int(2,15)} năm tù`,`${r.int(12,36)} tháng tù cho hưởng án treo`,`Cải tạo không giam giữ ${r.int(6,24)} tháng`,`Phạt tiền ${r.int(2,9)}0.000.000 đồng`])}
const past=d=>d<=TODAY,clamp=d=>d>TODAY?TODAY:d;
function hdxx(r){return[it(r.pick(TP),'Thẩm phán – chủ tọa phiên tòa'),it(`${r.pick(HT)}, ${r.pick(HT)}`,'Hội thẩm nhân dân'),it(r.pick(KSV),'Kiểm sát viên'),it(r.pick(TK),'Thư ký phiên tòa')]}
const bcCell=bcs=>bcs.map(b=>it(`${b.ten} (${b.ns})`,`${b.gt} · ${b.nn} · ${b.dc} · Quốc tịch Việt Nam`));

/* Định nghĩa sổ = cây cột + trạng thái + bộ dựng dòng. Backend trả cây cột qua API /so-thu-ly/{maSo}/cau-truc */
const SO={
  HS_ST:{
    title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ ÁN HÌNH SỰ SƠ THẨM',units:['T_HN','KV1','KV2','T_DN','T_HCM'],
    cols:[
      {k:'tl',t:'Thụ lý hồ sơ',h:'Số, ngày tháng năm',w:170,fx:1},
      {k:'bc',t:'Họ tên bị cáo',h:'Năm sinh, nơi cư trú, giới tính, nghề nghiệp, quốc tịch',w:250,fx:1},
      {k:'tg',t:'Thời hạn tạm giam',h:'Nguyên nhân vi phạm (nếu có)',w:180},
      {k:'ct',t:'Cáo trạng',h:'Số, ngày; điều luật; tội danh',w:220},
      {k:'nt',t:'Người tham gia tố tụng',h:'Bị hại, nguyên đơn, bị đơn dân sự, người có QL, NV liên quan',w:220},
      {k:'bch',t:'Người bào chữa, bảo vệ quyền lợi đương sự',h:'Họ tên, địa chỉ hoặc đơn vị hành nghề',w:210},
      {t:'Giải quyết',c:[
        {k:'chs',t:'Chuyển hồ sơ vụ án',h:'Số, ngày',w:150},
        {k:'tdc',t:'Tạm đình chỉ',h:'Số, ngày',w:150},
        {t:'Trả hồ sơ cho Viện kiểm sát',c:[{k:'trs',t:'Số, ngày',w:150},{k:'trk',t:'Kết quả',h:'VKS chấp nhận / không',w:150}]},
        {k:'dc',t:'Đình chỉ',h:'Số, ngày',w:150},
        {k:'ph',t:'Tòa án phục hồi',h:'Số, ngày',w:150},
        {k:'ld',t:'Lý do',w:210}]},
      {t:'Xét xử',c:[
        {k:'nttt',t:'Người tiến hành tố tụng',h:'HĐXX, Kiểm sát viên, Thư ký',w:220},
        {k:'ycbs',t:'Tòa án yêu cầu VKS bổ sung tài liệu, chứng cứ',h:'Số, ngày',w:170},
        {k:'ba',t:'Bản án, quyết định sơ thẩm',h:'Số, ngày',w:150},
        {k:'qd',t:'Quyết định của bản án, QĐ sơ thẩm',h:'Điều luật, tội danh, hình phạt, hình phạt bổ sung',w:260}]},
      {t:'Người dưới 18 tuổi',c:[
        {k:'nt18',t:'Đặc điểm nhân thân bị cáo dưới 18 tuổi',w:200},
        {k:'hq18',t:'Hậu quả đối với người bị hại dưới 18 tuổi',w:200}]},
      {k:'qh',t:'Mối quan hệ bị cáo – bị hại',w:150},
      {k:'db',t:'Địa bàn phạm tội',h:'Nông thôn, thành thị, miền núi, vùng sâu, hải đảo',w:150},
      {t:'Sau xét xử sơ thẩm',c:[
        {k:'kc',t:'Kháng cáo',h:'Người kháng cáo, ngày, nội dung',w:210},
        {k:'kn',t:'Kháng nghị',h:'Số, ngày, nội dung',w:200},
        {k:'cpt',t:'Chuyển hồ sơ cho tòa phúc thẩm',h:'Ngày, tháng, năm',w:150},
        {k:'qpt',t:'Quyết định của tòa án cấp phúc thẩm',h:'Số, ngày, tóm tắt',w:220}]},
      {k:'gc',t:'Ghi chú',w:160}],
    status:{XX:['Đã xét xử','success'],CHUA:['Đang giải quyết','processing'],TDC:['Tạm đình chỉ','warning'],TRA:['Trả hồ sơ','purple'],DC:['Đình chỉ','default']},
    gen(r,d,no){
      const bcs=Array.from({length:r.w([[1,6],[2,3],[3,1]])},()=>person(r,r.f()<.08));
      const toi=r.pick(TOI),dieu=`${r.pick(KHOAN)} Điều ${toi.d} BLHS`;
      const st=r.w([['XX',5],['CHUA',3],['TDC',1],['TRA',1.2],['DC',.6]]);
      const bh=toi.bh?person(r,r.f()<.15):null;const x={_st:st};
      x.tl=[it(`Số ${no}/2026/TLST-HS`,fmt(d))];x.bc=bcCell(bcs);
      x.tg=bcs.filter(()=>r.f()<.55).map(b=>{const k=r.pick([30,45,60,90]);return it(`${b.ten}: ${k} ngày`,`${fmt(add(d,-3))} → ${fmt(add(d,k-3))}`)});
      x.ct=[it(`Số ${r.int(12,280)}/CT-VKS ngày ${fmt(add(d,-r.int(4,15)))}`,`${dieu} – Tội ${toi.t}`)];
      x.nt=bh?[it(`${bh.ten} (${bh.ns})`,`Bị hại · ${bh.dc}`)]:[];
      if(r.f()<.3)x.nt.push(it(person(r).ten,'Người có quyền lợi, nghĩa vụ liên quan'));
      if(r.f()<.6)x.bch=[it(`LS. ${person(r).ten}`,`${r.pick(DOAN_LS)} · bào chữa cho ${bcs[0].ten}`)];
      if(r.f()<.05)x.chs=[it(`QĐ số ${r.int(1,90)}/2026/HSST-QĐ`,`${fmt(clamp(add(d,7)))} · Chuyển tòa án có thẩm quyền`)];
      if(st==='XX'){const xd=clamp(add(d,r.int(15,45)));x.nttt=hdxx(r);x.ba=[it(`Số ${r.int(10,400)}/2026/HS-ST`,fmt(xd))];x.qd=bcs.map(b=>it(b.ten,`${dieu} – Tội ${toi.t}; ${hp(r)}`));
        if(r.f()<.35){const kd=add(xd,r.int(3,14));if(past(kd)){x.kc=[it(`${bcs[0].ten} · ${fmt(kd)}`,r.pick(KC_ND))];const cd=add(kd,5);if(past(cd)){x.cpt=[it(fmt(cd))];if(r.f()<.3)x.qpt=[it(`BA số ${r.int(10,300)}/2026/HS-PT · ${fmt(clamp(add(cd,30)))}`,'Giữ nguyên bản án sơ thẩm')]}}}
        if(r.f()<.08&&past(add(xd,10)))x.kn=[it(`QĐ KN số ${r.int(1,50)}/QĐ-VKS · ${fmt(add(xd,10))}`,r.pick(KN_ND))];}
      if(r.f()<.08)x.ycbs=[it(`CV số ${r.int(10,99)}/TA-HS`,`${fmt(clamp(add(d,10)))} · Bổ sung kết luận giám định`)];
      if(st==='TDC'){x.tdc=[it(`QĐ số ${r.int(1,60)}/2026/HSST-QĐ`,fmt(clamp(add(d,r.int(10,30)))))];x.ld=[it(r.pick(['Bị cáo bỏ trốn, đã ra quyết định truy nã','Bị cáo bị bệnh hiểm nghèo','Chờ kết quả giám định bổ sung']),'Căn cứ tạm đình chỉ')];if(r.f()<.3){x.ph=[it(`QĐ số ${r.int(1,40)}/2026/HSST-QĐ`,fmt(clamp(add(d,40))))];x.ld.push(it('Lý do tạm đình chỉ không còn','Căn cứ phục hồi'))}}
      if(st==='TRA'){x.trs=[it(`QĐ số ${r.int(1,60)}/2026/HSST-QĐ`,fmt(clamp(add(d,r.int(8,25)))))];x.trk=[r.f()<.7?it('VKS chấp nhận','Đã điều tra bổ sung'):it('VKS không chấp nhận','Giữ nguyên quyết định truy tố')];x.ld=[it(r.pick(['Thiếu chứng cứ chứng minh yếu tố cấu thành tội phạm','Có căn cứ bị can phạm tội khác hoặc có đồng phạm khác','Vi phạm nghiêm trọng thủ tục tố tụng']),'Căn cứ trả hồ sơ')]}
      if(st==='DC'){x.dc=[it(`QĐ số ${r.int(1,40)}/2026/HSST-QĐ`,fmt(clamp(add(d,r.int(10,30)))))];x.ld=[it(r.pick(['Bị hại rút yêu cầu khởi tố (Điều 155 BLTTHS)','Bị can chết','Hết thời hiệu truy cứu trách nhiệm hình sự']),'Căn cứ đình chỉ')]}
      const yg=bcs.filter(b=>b.young);if(yg.length)x.nt18=yg.map(b=>it(b.ten,r.pick(['Đang đi học; phạm tội lần đầu','Bỏ học sớm; bố mẹ ly hôn','Sống cùng ông bà; hoàn cảnh khó khăn'])));
      if(bh&&bh.young)x.hq18=[it(bh.ten,r.pick(['Tổn hại sức khỏe 12%','Ảnh hưởng tâm lý, phải điều trị','Thiệt hại tài sản 5.000.000 đồng']))];
      if(bh)x.qh=[it(r.pick(QH))];x.db=[it(r.pick(DB))];
      if(r.f()<.06)x.gc=[it(r.pick(['Vụ án trọng điểm','Xét xử lưu động','Phiên tòa rút kinh nghiệm']))];
      return x;}
  },
  HS_PT:{
    title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ ÁN HÌNH SỰ PHÚC THẨM',units:['CC_HN','CC_DN','CC_HCM','T_HN','T_DN','T_HCM'],
    cols:[
      {k:'tl',n:1,t:'Thụ lý hồ sơ',h:'Số, ngày tháng năm',w:170,fx:1},
      {k:'bc',n:3,t:'Họ tên bị cáo',h:'Năm sinh, nơi cư trú, nghề nghiệp',w:250,fx:1},
      {k:'bast',n:2,t:'Bản án, quyết định sơ thẩm',h:'Số, ngày; tòa án cấp sơ thẩm đã giải quyết',w:210},
      {k:'tg',n:4,t:'Thời hạn tạm giam',h:'Nguyên nhân vi phạm (nếu có)',w:170},
      {k:'nt',n:5,t:'Người tham gia tố tụng',h:'Bị hại, nguyên đơn, bị đơn dân sự, người có QL, NV liên quan',w:210},
      {k:'bch',n:6,t:'Người bào chữa, bảo vệ quyền lợi đương sự',h:'Họ tên, địa chỉ hoặc đơn vị hành nghề',w:200},
      {k:'kc',n:7,t:'Kháng cáo',h:'Người kháng cáo; ngày; nội dung',w:210},
      {k:'kn',n:8,t:'Kháng nghị',h:'Số, ngày; nội dung',w:200},
      {k:'tdc',n:9,t:'Tạm đình chỉ',h:'Số, ngày; lý do',w:160},
      {t:'Quyết định đình chỉ xét xử',c:[
        {k:'rkc',n:10,t:'Rút kháng cáo',h:'Ngày; trước hay tại phiên tòa',w:160},
        {k:'rkn',n:11,t:'Rút kháng nghị',h:'Ngày; trước hay tại phiên tòa',w:160},
        {k:'ldk',n:12,t:'Lý do khác',h:'Ngày, tháng, năm',w:140}]},
      {t:'Xét xử',c:[
        {k:'nttt',n:13,t:'Người tiến hành tố tụng',h:'HĐXX, Kiểm sát viên, Thư ký',w:220},
        {k:'bapt',n:14,t:'Bản án phúc thẩm',h:'Số, ngày',w:150},
        {k:'qdpt',n:15,t:'Quyết định của bản án phúc thẩm',h:'Điều luật, tội danh, hình phạt, hình phạt bổ sung',w:260},
        {t:'Lý do sửa, hủy',c:[{k:'sai',n:16,t:'Do cấp sơ thẩm sai',w:170},{k:'ttm',n:17,t:'Do có tình tiết mới',w:170}]},
        {k:'sbc',n:18,t:'Số bị cáo tòa chấp nhận kháng nghị của VKS',w:130},
        {k:'kt',n:19,t:'Khởi tố vụ án tại phiên tòa',h:'Số, ngày',w:140}]},
      {k:'gdt',n:20,t:'Quyết định GĐT, TT',h:'Số, ngày',w:150},
      {k:'al',n:21,t:'Áp dụng án lệ',h:'Số án lệ',w:160},
      {k:'gc',n:22,t:'Ghi chú',w:150}],
    status:{GN:['Giữ nguyên','success'],SUA:['Sửa bản án','warning'],HUY:['Hủy bản án','error'],DCX:['Đình chỉ xét xử','default'],CHUA:['Đang giải quyết','processing']},
    gen(r,d,no){
      const bcs=Array.from({length:r.w([[1,7],[2,3]])},()=>person(r));
      const toi=r.pick(TOI),dieu=`${r.pick(KHOAN)} Điều ${toi.d} BLHS`;
      const st=r.w([['GN',4],['SUA',2.5],['HUY',1],['DCX',1],['CHUA',3]]);const x={_st:st};const std=add(d,-r.int(30,60));
      x.tl=[it(`Số ${no}/2026/TLPT-HS`,fmt(d))];x.bast=[it(`Số ${r.int(10,400)}/2026/HS-ST · ${fmt(std)}`,r.pick(TOA_ST))];x.bc=bcCell(bcs);
      x.tg=bcs.filter(()=>r.f()<.5).map(b=>it(`${b.ten}: ${r.pick([45,60,90])} ngày`,'Tạm giam để xét xử phúc thẩm'));
      if(toi.bh){const bh=person(r);x.nt=[it(`${bh.ten} (${bh.ns})`,`Bị hại · ${bh.dc}`)]}
      if(r.f()<.6)x.bch=[it(`LS. ${person(r).ten}`,`${r.pick(DOAN_LS)} · bào chữa cho ${bcs[0].ten}`)];
      const hasKC=r.f()<.85,hasKN=!hasKC||r.f()<.2;
      if(hasKC)x.kc=bcs.map(b=>it(`${b.ten} · ${fmt(add(std,r.int(3,14)))}`,r.pick(KC_ND)));
      if(hasKN)x.kn=[it(`QĐ KN số ${r.int(1,60)}/QĐ-VKS · ${fmt(add(std,10))}`,r.pick(KN_ND))];
      if(r.f()<.05)x.tdc=[it(`QĐ số ${r.int(1,30)}/2026/HSPT-QĐ`,'Bị cáo bị bệnh hiểm nghèo')];
      if(st==='DCX'){const dd=fmt(clamp(add(d,r.int(10,30))));if(hasKC)x.rkc=[it(dd,r.pick(['Rút trước khi mở phiên tòa','Rút tại phiên tòa']))];else x.rkn=[it(dd,'Rút trước khi mở phiên tòa')]}
      if(st==='GN'||st==='SUA'||st==='HUY'){const xd=clamp(add(d,r.int(20,45)));x.nttt=hdxx(r);x.bapt=[it(`Số ${r.int(10,300)}/2026/HS-PT`,fmt(xd))];
        x.qdpt=st==='GN'?[it('Không chấp nhận kháng cáo, kháng nghị','Giữ nguyên bản án sơ thẩm')]:st==='SUA'?bcs.map(b=>it(b.ten,`Sửa bản án sơ thẩm: ${dieu}; ${hp(r)}`)):[it('Hủy bản án sơ thẩm',r.pick(['Chuyển hồ sơ cho VKS cùng cấp điều tra lại','Giao hồ sơ cho tòa sơ thẩm xét xử lại']))];
        if(st!=='GN'){if(r.f()<.6)x.sai=[it(r.pick(['Áp dụng sai điều luật','Đánh giá chứng cứ chưa đầy đủ','Vi phạm thủ tục tố tụng']))];else x.ttm=[it(r.pick(['Bị cáo đã bồi thường xong cho bị hại','Có thêm tình tiết giảm nhẹ mới']))]}
        if(hasKN)x.sbc=[it(String(r.int(0,bcs.length)))];
        if(r.f()<.03)x.kt=[it(`QĐ số ${r.int(1,9)}/2026/HSPT-QĐ`,fmt(xd))];
        if(r.f()<.05)x.al=[it('Án lệ số 01/2016/AL','Về hành vi giết người đang thi hành công vụ')];}
      return x;}
  },
  HS_GDTTT:{
    title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ ÁN HÌNH SỰ GIÁM ĐỐC THẨM, TÁI THẨM',units:['D01','CC_HN','CC_DN','CC_HCM'],
    cols:[
      {k:'tl',n:1,t:'Thụ lý hồ sơ',h:'Số, ngày tháng năm',w:170,fx:1},
      {k:'bc',n:3,t:'Họ tên bị cáo bị kháng nghị',h:'Năm sinh, nơi cư trú',w:250,fx:1},
      {k:'bakn',n:2,t:'Bản án, quyết định bị kháng nghị',h:'Số, ngày; điều luật; tội danh; hình phạt; tòa án đã giải quyết',w:260},
      {k:'tg',n:4,t:'Thời hạn tạm giam',w:150},
      {k:'tn',n:5,t:'Tại ngoại',w:140},
      {k:'nt',n:6,t:'Người tham gia tố tụng',h:'Bị hại, nguyên đơn, bị đơn dân sự, người có QL, NV liên quan',w:210},
      {t:'Kháng nghị',c:[
        {k:'can',n:7,t:'Chánh án kháng nghị',h:'Số, ngày; tóm tắt nội dung',w:230},
        {k:'vtn',n:8,t:'Viện trưởng kháng nghị',h:'Số, ngày; tóm tắt nội dung',w:230}]},
      {t:'Rút kháng nghị',c:[
        {k:'car',n:9,t:'Chánh án rút kháng nghị',h:'Số, ngày',w:170},
        {k:'vtr',n:10,t:'Viện trưởng rút kháng nghị',h:'Số, ngày',w:170}]},
      {t:'Giám đốc thẩm, tái thẩm',c:[
        {k:'nttt',n:11,t:'Người tiến hành tố tụng',h:'Hội đồng xét xử, Kiểm sát viên, Thư ký',w:230},
        {k:'qd',n:12,t:'Quyết định GĐT, TT',h:'Số, ngày',w:160},
        {k:'qdhd',n:13,t:'Quyết định của Hội đồng GĐT, TT',h:'Tóm tắt nội dung',w:240},
        {k:'ld',n:14,t:'Lý do',h:'Rút kháng nghị hoặc hủy, sửa',w:210}]},
      {k:'al',n:15,t:'Áp dụng án lệ',h:'Số án lệ',w:170},
      {k:'gc',n:16,t:'Ghi chú',w:150}],
    status:{CN:['Chấp nhận kháng nghị','success'],KCN:['Không chấp nhận KN','warning'],RUT:['Rút kháng nghị','default'],CHUA:['Đang giải quyết','processing']},
    gen(r,d,no){
      const bcs=Array.from({length:r.w([[1,7],[2,2]])},()=>person(r));
      const toi=r.pick(TOI),dieu=`${r.pick(KHOAN)} Điều ${toi.d} BLHS`;
      const st=r.w([['CN',3],['KCN',1.5],['RUT',1],['CHUA',3]]);const x={_st:st};const bad=add(d,-r.int(200,500));
      x.tl=[it(`Số ${no}/2026/TLGĐT-HS`,fmt(d))];
      x.bakn=[it(`BA số ${r.int(10,400)}/${bad.getFullYear()}/HS-PT · ${fmt(bad)}`,`${dieu} – Tội ${toi.t}; ${hp(r)}; ${r.pick(TOA_PT)}`)];
      x.bc=bcCell(bcs);
      if(r.f()<.35)x.tg=[it(`${bcs[0].ten}: 4 tháng`,'Theo quyết định của Hội đồng GĐT')];else x.tn=bcs.map(b=>it(b.ten,'Đang tại ngoại'));
      if(toi.bh){const bh=person(r);x.nt=[it(`${bh.ten} (${bh.ns})`,`Bị hại · ${bh.dc}`)]}
      const byCA=r.f()<.55;const nd=r.pick(['Đề nghị hủy BA phúc thẩm và sơ thẩm để điều tra lại','Đề nghị hủy BA phúc thẩm để xét xử phúc thẩm lại','Đề nghị sửa BA phúc thẩm về phần hình phạt']);
      const kn=[it(`QĐ KN số ${r.int(1,90)}/2026/KN-HS · ${fmt(add(d,-r.int(5,20)))}`,nd)];if(byCA)x.can=kn;else x.vtn=kn;
      if(st==='RUT'){const rr=[it(`QĐ số ${r.int(1,20)}/2026/QĐ-RKN`,fmt(clamp(add(d,r.int(10,30)))))];if(byCA)x.car=rr;else x.vtr=rr;x.ld=[it('Rút toàn bộ kháng nghị','Bản án bị kháng nghị có căn cứ, đúng pháp luật')]}
      if(st==='CN'||st==='KCN'){const xd=clamp(add(d,r.int(20,60)));
        x.nttt=[it(r.pick(['Hội đồng Thẩm phán TANDTC','Ủy ban Thẩm phán TAND cấp cao','Hội đồng GĐT gồm 3 thẩm phán']),'Chủ tọa: '+r.pick(TP)),it(r.pick(KSV),'Kiểm sát viên'),it(r.pick(TK),'Thư ký phiên tòa')];
        x.qd=[it(`QĐ GĐT số ${r.int(1,120)}/2026/HS-GĐT`,fmt(xd))];
        x.qdhd=st==='CN'?[it('Chấp nhận kháng nghị',nd.replace('Đề nghị ',''))]:[it('Không chấp nhận kháng nghị','Giữ nguyên bản án phúc thẩm')];
        x.ld=st==='CN'?[it(r.pick(['Áp dụng pháp luật không đúng','Vi phạm nghiêm trọng thủ tục tố tụng','Kết luận không phù hợp tình tiết khách quan']),'Căn cứ hủy, sửa')]:[it('Bản án có căn cứ, đúng pháp luật')];
        if(r.f()<.15)x.al=[it('Án lệ số 47/2021/AL','Về tình tiết “có tính chất côn đồ”')];}
      return x;}
  }
};

/* ===== Nhóm án dân sự (DS, HNGĐ, KDTM): mỗi giai đoạn 1 khuôn cột, tham số theo loại án ===== */
const CONGTY=['Công ty TNHH Thương mại Minh Phát','Ngân hàng TMCP Sài Gòn Thương Tín – CN Hà Nội','Công ty CP Xây dựng Hòa Bình','Công ty TNHH Sản xuất Tân Á','Công ty CP Đầu tư Hoàng Long','Công ty TNHH Vận tải Biển Đông'];
const CHUCVU=['Giám đốc','Tổng giám đốc','Người đại diện theo ủy quyền'];
const CIVIL={
  DS:{ma:'DS',ten:'DÂN SỰ',bd:'Bị đơn hoặc người liên quan trong việc dân sự',viec:'Việc dân sự',
    qh:['Tranh chấp hợp đồng vay tài sản','Tranh chấp quyền sử dụng đất','Tranh chấp thừa kế tài sản','Đòi tài sản','Tranh chấp hợp đồng mua bán tài sản','Yêu cầu bồi thường thiệt hại ngoài hợp đồng'],
    qhViec:['Yêu cầu tuyên bố một người mất tích','Yêu cầu công nhận kết quả hòa giải thành ngoài tòa án'],
    kq:['Chấp nhận toàn bộ yêu cầu khởi kiện của nguyên đơn','Chấp nhận một phần yêu cầu; buộc bị đơn trả 350.000.000 đồng','Không chấp nhận yêu cầu khởi kiện của nguyên đơn'],
    kc:['Kháng cáo toàn bộ bản án','Kháng cáo phần nghĩa vụ trả nợ','Kháng cáo phần án phí'],
    bpk:['Phong tỏa tài khoản','Cấm chuyển dịch quyền về tài sản','Kê biên tài sản đang tranh chấp']},
  HN:{ma:'HNGĐ',ten:'HÔN NHÂN VÀ GIA ĐÌNH',bd:'Bị đơn hoặc người liên quan trong việc hôn nhân và gia đình',viec:'Việc hôn nhân và gia đình',
    qh:['Ly hôn','Ly hôn','Ly hôn','Tranh chấp nuôi con sau ly hôn','Tranh chấp chia tài sản sau ly hôn','Yêu cầu cấp dưỡng'],
    qhViec:['Công nhận thuận tình ly hôn','Yêu cầu hủy kết hôn trái pháp luật'],
    kq:['Cho ly hôn; giao con chung cho nguyên đơn nuôi, bị đơn cấp dưỡng 3.000.000 đồng/tháng','Không chấp nhận yêu cầu ly hôn','Cho ly hôn; chia tài sản chung mỗi bên 1/2 giá trị nhà đất'],
    kc:['Kháng cáo phần nuôi con','Kháng cáo phần chia tài sản chung','Kháng cáo không đồng ý ly hôn'],
    bpk:['Buộc thực hiện trước một phần nghĩa vụ cấp dưỡng','Cấm chuyển dịch quyền về tài sản chung']},
  KT:{ma:'KDTM',ten:'KINH DOANH THƯƠNG MẠI',bd:'Bị đơn hoặc người liên quan trong việc kinh doanh thương mại',viec:'Việc kinh doanh thương mại',
    qh:['Tranh chấp hợp đồng mua bán hàng hóa','Tranh chấp hợp đồng tín dụng','Tranh chấp hợp đồng xây dựng','Tranh chấp giữa công ty với thành viên công ty'],
    qhViec:['Yêu cầu hủy phán quyết trọng tài thương mại'],
    kq:['Buộc bị đơn thanh toán 1.250.000.000 đồng tiền hàng và lãi chậm trả','Chấp nhận một phần yêu cầu; buộc trả nợ gốc 2.000.000.000 đồng','Tuyên bố hợp đồng vô hiệu, các bên hoàn trả cho nhau những gì đã nhận'],
    kc:['Kháng cáo toàn bộ bản án','Kháng cáo phần tiền lãi','Kháng cáo phần xử lý tài sản bảo đảm'],
    bpk:['Phong tỏa tài khoản tại ngân hàng','Kê biên tài sản bảo đảm']}
};
const LYHON=['Mâu thuẫn gia đình kéo dài, không thể hàn gắn','Chồng có hành vi bạo lực gia đình','Không còn tình cảm, đã sống ly thân','Một bên ngoại tình','Nghiện ma túy, rượu chè, cờ bạc'];
function party(r,L,role){
  if(L.ma==='LĐ'){if(role==='bd'&&r.f()<.8)return[it(r.pick(CONGTY),`${r.pick(DIACHI)} · Đại diện: ${person(r).ten} – ${r.pick(CHUCVU)}`)];const p=person(r);return[it(`${p.ten} (${p.ns})`,`${p.gt} · ${p.dc}`)]}
  if(L.ma==='KDTM'&&r.f()<.7)return[it(r.pick(CONGTY),`${r.pick(DIACHI)} · Đại diện: ${person(r).ten} – ${r.pick(CHUCVU)}`)];
  const p=person(r);return[it(`${p.ten} (${p.ns})`,p.dc)];
}
const tenNd=nd=>nd[0].m.replace(/ \(\d+\)$/,'');
function hdxxDS(r,pt){
  const tp=pt?[it(`${r.pick(TP)}, ${r.pick(TP)}, ${r.pick(TP)}`,'Thẩm phán (người đầu tiên là chủ tọa)')]:[it(r.pick(TP),'Thẩm phán – chủ tọa phiên tòa'),it(`${r.pick(HT)}, ${r.pick(HT)}`,'Hội thẩm nhân dân')];
  return[...tp,it(r.pick(KSV),'Đại diện Viện kiểm sát'),it(r.pick(TK),'Thư ký phiên tòa')];
}
const co=s=>[it('Có',s)];
function civilCols(L,gd){
  const kt=L.ma==='KDTM',hn=L.ma==='HNGĐ',ds=L.ma==='DS';
  const ph=L.ph||(kt?'Họ tên, địa chỉ; người đại diện, chức vụ, địa chỉ':'Họ tên, năm sinh, địa chỉ');
  const tl={k:'tl',n:1,t:'Thụ lý',h:'Số, ngày tháng năm',w:170,fx:1};
  const bv={k:'bv',t:'Người bảo vệ quyền, lợi ích hợp pháp của đương sự',h:hn&&gd==='PT'?'Họ tên, chức danh (nếu có)':'Họ tên, địa chỉ hoặc đơn vị hành nghề',w:210};
  if(gd==='ST'){
    let n=0;const N=o=>({...o,n:++n});
    return[
      N(tl),N({k:'nd',t:'Nguyên đơn hoặc người yêu cầu',h:ph,w:250,fx:1}),N({k:'bd',t:L.bd,h:ph,w:240}),
      N({k:'coq',t:'Đơn khởi kiện của cơ quan, tổ chức',w:150}),N({k:'nlq',t:'Người có quyền lợi, nghĩa vụ liên quan',h:ph,w:220}),N(bv),
      N({k:'qhtl',t:'Quan hệ pháp luật khi thụ lý',w:190}),
      ...(hn?[N({k:'lyhon',t:'Lý do xin ly hôn',w:200}),N({k:'socon',t:'Số con chưa thành niên',w:100})]:[]),
      {t:'Giải quyết',c:[
        N({k:'bpk',t:'Áp dụng biện pháp khẩn cấp tạm thời',h:'Số, ngày tháng năm',w:190}),
        N({k:'chs',t:'Chuyển hồ sơ vụ việc',h:'Số, ngày tháng năm và nơi nhận',w:180}),
        N({k:'tdc',t:'Tạm đình chỉ',h:'Số, ngày tháng năm',w:150}),
        N({k:'dc',t:'Đình chỉ',h:'Số, ngày tháng năm',w:150}),
        N({k:'ld',t:'Lý do',w:220}),
        ...(hn?[N({k:'hgdt',t:'Hòa giải đoàn tụ',w:150})]:[]),
        N({k:'cnt',t:'Công nhận sự thỏa thuận của đương sự',h:'Số, ngày tháng năm',w:190})]},
      {t:'Xét xử',c:[
        N({k:'hdxx',t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230}),
        N({k:'ba',t:'Bản án, quyết định sơ thẩm',h:'Số, ngày tháng năm',w:160}),
        N({k:'qhgq',t:'Quan hệ pháp luật tòa án đã giải quyết',w:190}),
        N({k:'tt',t:'Tóm tắt nội dung bản án, quyết định sơ thẩm',w:270}),
        N({k:'hcb',t:'Kết quả giải quyết yêu cầu hủy quyết định cá biệt',h:'Số, ngày tháng năm, cơ quan ban hành (nếu có)',w:210}),
        N({k:'al',t:'Áp dụng án lệ',h:'Số án lệ',w:150}),
        N({k:'rg',t:'Giải quyết theo thủ tục rút gọn',h:'Số, ngày tháng năm',w:160}),
        ...(ds?[N({k:'prk',t:'Tòa án tổ chức phiên tòa rút kinh nghiệm',w:150})]:[]),
        N({k:'nn',t:'Có yếu tố nước ngoài',w:130}),
        N({k:'viec',t:L.viec,w:130})]},
      {t:'Sau xét xử sơ thẩm',c:[
        N({k:'kc',t:'Kháng cáo',h:'Số, ngày tháng năm',w:210}),
        N({k:'kn',t:'Kháng nghị',h:'Số, ngày tháng năm',w:200}),
        N({k:'cpt',t:'Chuyển hồ sơ cho tòa án cấp phúc thẩm',h:'Ngày tháng năm',w:150}),
        N({k:'qpt',t:'Quyết định của tòa án cấp phúc thẩm',h:'Số, ngày tháng năm; tóm tắt phần quyết định',w:230})]},
      N({k:'gc',t:'Ghi chú',w:150})];
  }
  if(gd==='PT')return[
    tl,{k:'nd',n:3,t:'Nguyên đơn hoặc người yêu cầu',h:ph,w:250,fx:1},
    {k:'bast',n:2,t:'Bản án, quyết định của tòa án cấp sơ thẩm',h:'Số, ngày tháng năm và tên tòa án đã giải quyết',w:220},
    {k:'bd',n:4,t:L.bd,h:ph,w:240},{k:'nlq',n:5,t:'Người có quyền lợi, nghĩa vụ liên quan',h:ph,w:220},{...bv,n:6},{k:'qh',n:7,t:'Quan hệ pháp luật',w:190},
    {t:'Kháng cáo, kháng nghị',c:[{k:'kc',n:8,t:'Kháng cáo',h:'Ngày tháng năm',w:200},{k:'kn',n:9,t:'Kháng nghị',h:'Số, ngày tháng năm',w:190}]},
    {k:'bpk',n:10,t:'Áp dụng biện pháp khẩn cấp tạm thời',h:'Số, ngày tháng năm',w:180},
    {t:'Rút kháng cáo, kháng nghị – tạm đình chỉ, đình chỉ',c:[
      {k:'rkc',n:11,t:'Rút kháng cáo',h:'Ngày tháng năm',w:150},{k:'rkn',n:12,t:'Rút kháng nghị',h:'Số, ngày tháng năm',w:150},
      {k:'tdc',n:13,t:'Tạm đình chỉ',h:'Số, ngày tháng năm',w:150},{k:'dc',n:14,t:'Đình chỉ',h:'Số, ngày tháng năm',w:150},{k:'ld',n:15,t:'Lý do',w:210}]},
    {t:'Xét xử phúc thẩm',c:[
      {k:'hdxx',n:16,t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230},
      {k:'bapt',n:17,t:'Bản án, quyết định phúc thẩm',h:'Số, ngày tháng năm',w:160},
      {k:'qdpt',n:18,t:'Quyết định của tòa án cấp phúc thẩm',h:'Tóm tắt phần quyết định',w:260},
      {t:'Lý do sửa, hủy',c:[{k:'sai',n:19,t:'Do cấp sơ thẩm sai',w:170},{k:'khac',n:20,t:'Do có lý do khác',w:170}]},
      {k:'al',n:21,t:'Áp dụng án lệ',w:150},{k:'rg',n:22,t:'Giải quyết theo thủ tục rút gọn',h:'Số, ngày tháng năm',w:160}]},
    {k:'viec',n:23,t:L.viec,w:130},{k:'gdt',n:24,t:'Quyết định giám đốc thẩm, tái thẩm',h:'Số, ngày tháng năm',w:170},{k:'gc',n:25,t:'Ghi chú',w:150}];
  return[
    tl,{k:'nd',n:3,t:'Nguyên đơn hoặc người yêu cầu',h:ph,w:250,fx:1},
    {k:'bakn',n:2,t:'Bản án, quyết định bị kháng nghị',h:'Số, ngày tháng năm và tên tòa án đã giải quyết',w:240},
    {k:'bd',n:4,t:L.bd,h:ph,w:240},{k:'nlq',n:5,t:'Người có quyền lợi, nghĩa vụ liên quan',h:ph,w:220},
    {k:'hdxx',n:6,t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230},{k:'qh',n:7,t:'Quan hệ pháp luật',w:190},
    {t:'Kháng nghị',c:[{k:'can',n:8,t:'Chánh án kháng nghị',h:'Số, ngày tháng năm; tóm tắt nội dung',w:230},{k:'vtn',n:9,t:'Viện trưởng kháng nghị',h:'Số, ngày tháng năm; tóm tắt nội dung',w:230}]},
    {t:'Rút kháng nghị',c:[{k:'car',n:10,t:'Chánh án rút kháng nghị',h:'Số, ngày tháng năm',w:170},{k:'vtr',n:11,t:'Viện trưởng rút kháng nghị',h:'Số, ngày tháng năm',w:170}]},
    {t:'Giám đốc thẩm, tái thẩm',c:[
      {k:'qd',n:12,t:'Quyết định giám đốc thẩm, tái thẩm',h:'Số, ngày tháng năm',w:170},
      {k:'qdhd',n:13,t:'Quyết định của Hội đồng GĐT, TT',h:'Tóm tắt nội dung',w:250},
      {k:'ld',n:14,t:'Lý do',h:'Rút kháng nghị hoặc sửa, hủy',w:210}]},
    {k:'viec',n:15,t:L.viec,w:130},{k:'al',n:16,t:'Áp dụng án lệ',h:'Số án lệ',w:150},{k:'gc',n:17,t:'Ghi chú',w:150}];
}
function civilGen(L,gd){return function(r,d,no){
  const viec=r.f()<.15,qh=r.pick(viec?L.qhViec:L.qh),hn=L.ma==='HNGĐ';
  const x={};const nd=party(r,L);
  x.nd=nd;x.bd=party(r,L,'bd');if(r.f()<.3)x.nlq=party(r,L);if(viec)x.viec=co('Là việc, không phải vụ án');
  if(gd==='ST'){
    const st=r.w([['XX',4],['CNTT',2.5],['CHUA',3],['TDC',1],['DC',1.2]]);x._st=st;
    x.tl=[it(`Số ${no}/2026/TLST-${L.ma}`,fmt(d))];
    if(r.f()<.04)x.coq=co(hn?'Hội Liên hiệp Phụ nữ khởi kiện thay':'Cơ quan, tổ chức khởi kiện vì lợi ích người khác');
    if(r.f()<.4)x.bv=[it(`LS. ${person(r).ten}`,r.pick(DOAN_LS))];
    x.qhtl=[it(qh)];
    if(hn){if(qh==='Ly hôn')x.lyhon=[it(r.pick(LYHON))];x.socon=[it(String(r.int(0,3)))]}
    if(r.f()<.08)x.bpk=[it(`QĐ số ${r.int(1,60)}/2026/QĐ-BPKCTT`,`${fmt(clamp(add(d,r.int(1,10))))} · ${r.pick(L.bpk)}`)];
    if(r.f()<.04)x.chs=[it(`QĐ số ${r.int(1,40)}/2026/QĐST-${L.ma}`,`${fmt(clamp(add(d,12)))} · Chuyển ${r.pick(TOA_ST)}`)];
    const qd=()=>`QĐ số ${r.int(1,200)}/2026/QĐST-${L.ma}`,qdd=()=>fmt(clamp(add(d,r.int(15,60))));
    if(st==='TDC'){x.tdc=[it(qd(),qdd())];x.ld=[it(r.pick(['Đương sự là cá nhân chết, chưa có người kế thừa','Chờ kết quả giải quyết vụ việc khác có liên quan','Chờ kết quả giám định, định giá tài sản']),'Căn cứ tạm đình chỉ')]}
    if(st==='DC'){x.dc=[it(qd(),qdd())];
      if(hn&&qh==='Ly hôn'&&r.f()<.5){x.hgdt=[it('Hòa giải đoàn tụ thành',qdd())];x.ld=[it('Vợ chồng đã đoàn tụ, nguyên đơn rút đơn')]}
      else x.ld=[it(r.pick(['Nguyên đơn rút toàn bộ yêu cầu khởi kiện','Nguyên đơn được triệu tập hợp lệ lần thứ hai mà vẫn vắng mặt']),'Căn cứ đình chỉ')]}
    if(st==='CNTT')x.cnt=[it(qd(),hn&&qh==='Ly hôn'?`${qdd()} · Công nhận thuận tình ly hôn và sự thỏa thuận của các đương sự`:`${qdd()} · Công nhận sự thỏa thuận của các đương sự`)];
    if(st==='XX'){
      const xd=clamp(add(d,r.int(30,90)));x.hdxx=hdxxDS(r);x.ba=[it(`Số ${r.int(10,400)}/2026/${L.ma}-ST`,fmt(xd))];x.qhgq=[it(qh)];x.tt=[it(r.pick(L.kq))];
      if(!hn&&r.f()<.08)x.hcb=[it(`Hủy QĐ số ${r.int(100,999)}/QĐ-UBND ngày ${fmt(add(d,-400))}`,'UBND TP. Hà Nội – hủy một phần')];
      if(r.f()<.05)x.al=[it('Án lệ số 03/2016/AL','Về công nhận quyền sử dụng đất được tặng cho')];
      if(L.ma==='DS'&&r.f()<.06)x.prk=co('Phiên tòa trực tuyến rút kinh nghiệm');
      if(r.f()<.3){const kd=add(xd,r.int(5,15));if(past(kd)){x.kc=[it(`${tenNd(nd)} · ${fmt(kd)}`,r.pick(L.kc))];if(past(add(kd,10)))x.cpt=[it(fmt(add(kd,10)))]}}
      if(r.f()<.05&&past(add(xd,12)))x.kn=[it(`QĐ KN số ${r.int(1,30)}/QĐKNPT-VKS-${L.ma}`,fmt(add(xd,12)))];
    }
    if(r.f()<.06)x.rg=[it(`QĐ số ${r.int(1,30)}/2026/QĐ-RG`,fmt(clamp(add(d,5))))];
    if(r.f()<.05)x.nn=co(r.pick(['Đương sự cư trú tại Hoa Kỳ','Đương sự mang quốc tịch Hàn Quốc','Tài sản tranh chấp ở nước ngoài']));
    if(r.f()<.05)x.gc=[it(r.pick(['Vụ việc phức tạp, kéo dài','Có đơn khiếu nại kèm theo']))];
    return x;
  }
  if(gd==='PT'){
    const st=r.w([['GN',4],['SUA',2],['HUY',1],['DCX',1.5],['CHUA',3]]);x._st=st;const std=add(d,-r.int(30,60));
    x.tl=[it(`Số ${no}/2026/TLPT-${L.ma}`,fmt(d))];x.bast=[it(`Số ${r.int(10,400)}/2026/${L.ma}-ST · ${fmt(std)}`,r.pick(TOA_ST))];
    if(r.f()<.4)x.bv=[it(`LS. ${person(r).ten}`,r.pick(DOAN_LS))];x.qh=[it(qh)];
    const hasKC=r.f()<.85,hasKN=!hasKC||r.f()<.15;
    if(hasKC)x.kc=[it(`${tenNd(nd)} · ${fmt(add(std,r.int(3,14)))}`,r.pick(L.kc))];
    if(hasKN)x.kn=[it(`QĐ KN số ${r.int(1,40)}/QĐKNPT-VKS-${L.ma}`,fmt(add(std,12)))];
    if(r.f()<.05)x.bpk=[it(`QĐ số ${r.int(1,20)}/2026/QĐ-BPKCTT`,r.pick(L.bpk))];
    const qd=()=>`QĐ số ${r.int(1,150)}/2026/QĐPT-${L.ma}`,qdd=()=>fmt(clamp(add(d,r.int(15,45))));
    if(st==='DCX'){const dd=qdd();if(hasKC)x.rkc=[it(dd,r.pick(['Rút trước khi mở phiên tòa','Rút tại phiên tòa']))];else x.rkn=[it(`QĐ số ${r.int(1,20)}/QĐ-VKS`,dd)];
      x.dc=[it(qd(),dd)];x.ld=[it(hasKC?'Người kháng cáo rút toàn bộ kháng cáo':'Viện kiểm sát rút toàn bộ kháng nghị')]}
    if(st==='CHUA'&&r.f()<.15){x.tdc=[it(qd(),qdd())];x.ld=[it('Chờ kết quả giải quyết vụ việc khác có liên quan')]}
    if(st==='GN'||st==='SUA'||st==='HUY'){
      const xd=clamp(add(d,r.int(20,60)));x.hdxx=hdxxDS(r,true);x.bapt=[it(`Số ${r.int(10,300)}/2026/${L.ma}-PT`,fmt(xd))];
      x.qdpt=st==='GN'?[it('Không chấp nhận kháng cáo','Giữ nguyên bản án sơ thẩm')]:st==='SUA'?[it('Chấp nhận một phần kháng cáo','Sửa bản án sơ thẩm: '+r.pick(L.kq).toLowerCase())]:[it('Hủy bản án sơ thẩm','Giao hồ sơ cho tòa án cấp sơ thẩm giải quyết lại')];
      if(st!=='GN'){if(r.f()<.6)x.sai=[it(r.pick(['Thu thập chứng cứ chưa đầy đủ','Xác định sai quan hệ pháp luật','Vi phạm nghiêm trọng thủ tục tố tụng','Đưa thiếu người tham gia tố tụng']))];
        else x.khac=[it(r.pick(['Có chứng cứ mới tại phiên tòa phúc thẩm','Các đương sự thỏa thuận được tại phiên tòa']))]}
      if(r.f()<.05)x.al=[it('Án lệ số 06/2016/AL')];
    }
    if(r.f()<.03)x.gdt=[it(`QĐ GĐT số ${r.int(1,50)}/2026/${L.ma}-GĐT`,fmt(TODAY))];
    return x;
  }
  const st=r.w([['CN',3],['KCN',1.5],['RUT',1],['CHUA',3]]);x._st=st;const bad=add(d,-r.int(200,500));
  x.tl=[it(`Số ${no}/2026/TLGĐT-${L.ma}`,fmt(d))];x.bakn=[it(`BA số ${r.int(10,400)}/${bad.getFullYear()}/${L.ma}-PT · ${fmt(bad)}`,r.pick(TOA_PT))];x.qh=[it(qh)];
  const byCA=r.f()<.55,nd2=r.pick(['Đề nghị hủy BA phúc thẩm và sơ thẩm, giao xét xử sơ thẩm lại','Đề nghị hủy BA phúc thẩm để xét xử phúc thẩm lại','Đề nghị sửa BA phúc thẩm']);
  const kn=[it(`QĐ KN số ${r.int(1,90)}/2026/KN-${L.ma} · ${fmt(add(d,-r.int(5,20)))}`,nd2)];if(byCA)x.can=kn;else x.vtn=kn;
  if(st==='RUT'){const rr=[it(`QĐ số ${r.int(1,20)}/2026/QĐ-RKN`,fmt(clamp(add(d,r.int(10,30)))))];if(byCA)x.car=rr;else x.vtr=rr;x.ld=[it('Rút toàn bộ kháng nghị')]}
  if(st==='CN'||st==='KCN'){
    const xd=clamp(add(d,r.int(20,60)));
    x.hdxx=[it(r.pick(['Hội đồng Thẩm phán TANDTC','Ủy ban Thẩm phán TAND cấp cao','Hội đồng GĐT gồm 3 thẩm phán']),'Chủ tọa: '+r.pick(TP)),it(r.pick(KSV),'Đại diện Viện kiểm sát'),it(r.pick(TK),'Thư ký phiên tòa')];
    x.qd=[it(`QĐ GĐT số ${r.int(1,120)}/2026/${L.ma}-GĐT`,fmt(xd))];
    x.qdhd=st==='CN'?[it('Chấp nhận kháng nghị',nd2.replace('Đề nghị ',''))]:[it('Không chấp nhận kháng nghị','Giữ nguyên bản án phúc thẩm')];
    x.ld=st==='CN'?[it(r.pick(['Đánh giá chứng cứ không đầy đủ, khách quan','Áp dụng pháp luật không đúng','Vi phạm nghiêm trọng thủ tục tố tụng']),'Căn cứ hủy, sửa')]:[it('Bản án có căn cứ, đúng pháp luật')];
    if(r.f()<.15)x.al=[it('Án lệ số 16/2017/AL','Về hợp đồng chuyển nhượng quyền sử dụng đất')];
  }
  return x;
}}
const ST_STATUS={XX:['Đã xét xử','success'],CNTT:['Công nhận thỏa thuận','cyan'],CHUA:['Đang giải quyết','processing'],TDC:['Tạm đình chỉ','warning'],DC:['Đình chỉ','default']};
const PT_STATUS={GN:['Giữ nguyên','success'],SUA:['Sửa bản án','warning'],HUY:['Hủy bản án','error'],DCX:['Đình chỉ xét xử','default'],CHUA:['Đang giải quyết','processing']};
Object.entries(CIVIL).forEach(([k,L])=>{
  SO[k+'_ST']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} SƠ THẨM`,units:['T_HN','KV1','KV2','T_DN','T_HCM'],cols:civilCols(L,'ST'),status:ST_STATUS,gen:civilGen(L,'ST')};
  SO[k+'_PT']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} PHÚC THẨM`,units:['CC_HN','CC_DN','CC_HCM','T_HN','T_DN','T_HCM'],cols:civilCols(L,'PT'),status:PT_STATUS,gen:civilGen(L,'PT')};
  SO[k+'_GDTTT']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} GIÁM ĐỐC THẨM, TÁI THẨM`,units:['D01','CC_HN','CC_DN','CC_HCM'],cols:civilCols(L,'GDTTT'),status:SO.HS_GDTTT.status,gen:civilGen(L,'GDTTT')};
});


/* ===== Lao động: dùng khuôn nhóm án dân sự ===== */
CIVIL.LD={ma:'LĐ',ten:'LAO ĐỘNG',bd:'Bị đơn hoặc người liên quan trong việc lao động',viec:'Việc lao động',
  ph:'Họ tên, năm sinh, địa chỉ, giới tính, người tàn tật; người đại diện, chức vụ, địa chỉ',
  qh:['Tranh chấp về đơn phương chấm dứt hợp đồng lao động','Tranh chấp về kỷ luật lao động theo hình thức sa thải','Tranh chấp về tiền lương, trợ cấp thôi việc','Tranh chấp về bảo hiểm xã hội'],
  qhViec:['Yêu cầu tuyên bố hợp đồng lao động vô hiệu','Yêu cầu xét tính hợp pháp của cuộc đình công'],
  kq:['Buộc công ty nhận người lao động trở lại làm việc và bồi thường 6 tháng tiền lương','Buộc công ty trả trợ cấp thôi việc 85.000.000 đồng','Không chấp nhận yêu cầu khởi kiện của người lao động'],
  kc:['Kháng cáo toàn bộ bản án','Kháng cáo phần tiền bồi thường','Kháng cáo phần nhận trở lại làm việc'],
  bpk:['Cấm người sử dụng lao động đơn phương chấm dứt hợp đồng lao động','Tạm đình chỉ thi hành quyết định sa thải']};
{
  const L=CIVIL.LD,k='LD';
  SO[k+'_ST']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} SƠ THẨM`,units:['T_HN','KV1','KV2','T_DN','T_HCM'],cols:civilCols(L,'ST'),status:ST_STATUS,gen:civilGen(L,'ST')};
  SO[k+'_PT']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} PHÚC THẨM`,units:['CC_HN','CC_DN','CC_HCM','T_HN','T_DN','T_HCM'],cols:civilCols(L,'PT'),status:PT_STATUS,gen:civilGen(L,'PT')};
  SO[k+'_GDTTT']={title:`SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC ${L.ten} GIÁM ĐỐC THẨM, TÁI THẨM`,units:['D01','CC_HN','CC_DN','CC_HCM'],cols:civilCols(L,'GDTTT'),status:SO.HS_GDTTT.status,gen:civilGen(L,'GDTTT')};
}

/* ===== Hành chính: khuôn riêng (người khởi kiện / người bị kiện, đối thoại, bồi thường) ===== */
const HC_BK=['Chủ tịch UBND TP. Hà Nội','UBND quận Thanh Xuân','Cục Thuế TP. Hà Nội','Sở Tài nguyên và Môi trường tỉnh Đồng Nai','Chủ tịch UBND phường Hoàn Kiếm','Chi cục Hải quan cửa khẩu cảng Hải Phòng'];
const HC_QH=['Khiếu kiện quyết định hành chính về quản lý đất đai','Khiếu kiện quyết định xử phạt vi phạm hành chính','Khiếu kiện quyết định bồi thường, hỗ trợ, tái định cư','Khiếu kiện hành vi hành chính trong cấp giấy chứng nhận quyền sử dụng đất','Khiếu kiện quyết định cưỡng chế thi hành quyết định hành chính'];
const HC_KQ=['Chấp nhận yêu cầu khởi kiện; hủy quyết định hành chính bị kiện','Bác yêu cầu khởi kiện của người khởi kiện','Chấp nhận một phần; buộc người bị kiện thực hiện nhiệm vụ, công vụ theo quy định'];
const HC_PH='Họ tên, địa chỉ; họ tên người đại diện, chức vụ, địa chỉ';
const nkk=r=>{if(r.f()<.25)return[it(r.pick(CONGTY),`${r.pick(DIACHI)} · Đại diện: ${person(r).ten} – ${r.pick(CHUCVU)}`)];const p=person(r);return[it(`${p.ten} (${p.ns})`,p.dc)]};
const nbk=r=>[it(r.pick(HC_BK),`Đại diện: ${person(r).ten} – ${r.pick(['Phó Chủ tịch','Chủ tịch','Cục trưởng','Giám đốc sở'])}`)];
const hcCols={
  ST:(()=>{let n=0;const N=o=>({...o,n:++n});return[
    N({k:'tl',t:'Thụ lý',h:'Số, ngày tháng năm',w:170,fx:1}),N({k:'nkk',t:'Người khởi kiện',h:HC_PH,w:250,fx:1}),N({k:'nbk',t:'Người bị khởi kiện',h:HC_PH,w:240}),
    N({k:'nlq',t:'Người có quyền lợi, nghĩa vụ liên quan',h:HC_PH,w:220}),N({k:'bv',t:'Người bảo vệ quyền, lợi ích hợp pháp của đương sự',h:'Họ tên, địa chỉ hoặc đơn vị hành nghề',w:210}),
    N({k:'qh',t:'Quan hệ pháp luật',w:220}),
    {t:'Giải quyết',c:[N({k:'bpk',t:'Áp dụng biện pháp khẩn cấp tạm thời',h:'Số, ngày tháng năm',w:190}),N({k:'chs',t:'Chuyển hồ sơ vụ án',h:'Số, ngày tháng năm và nơi nhận',w:180}),
      N({k:'tdc',t:'Tạm đình chỉ',h:'Số, ngày tháng năm',w:150}),N({k:'dc',t:'Đình chỉ',h:'Số, ngày tháng năm',w:150}),N({k:'ld',t:'Lý do',w:220})]},
    {t:'Xét xử',c:[N({k:'hdxx',t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230}),N({k:'ba',t:'Bản án sơ thẩm',h:'Số, ngày tháng năm',w:160}),
      N({k:'tt',t:'Tóm tắt nội dung bản án, quyết định của tòa án cấp sơ thẩm',w:270}),
      N({k:'kng',t:'Kiến nghị với cơ quan nhà nước xem xét trách nhiệm của cơ quan, người có thẩm quyền',w:240}),
      N({k:'dt',t:'Đối thoại',w:150}),N({k:'al',t:'Áp dụng án lệ',w:150}),N({k:'rg',t:'Giải quyết theo thủ tục rút gọn',h:'Số, ngày tháng năm',w:160}),
      N({k:'btth',t:'Giải quyết yêu cầu bồi thường thiệt hại',h:'Số tiền',w:170}),N({k:'nn',t:'Có yếu tố nước ngoài',w:130})]},
    {t:'Sau xét xử sơ thẩm',c:[N({k:'kc',t:'Kháng cáo',h:'Ngày tháng năm',w:210}),N({k:'kn',t:'Kháng nghị',h:'Số, ngày tháng năm',w:200}),
      N({k:'cpt',t:'Chuyển hồ sơ cho tòa phúc thẩm',h:'Ngày tháng năm',w:150}),N({k:'qpt',t:'Quyết định của tòa án cấp phúc thẩm',h:'Số, ngày tháng năm; tóm tắt phần quyết định',w:230})]},
    N({k:'gc',t:'Ghi chú',w:150})]})(),
  PT:[
    {k:'tl',n:1,t:'Thụ lý',h:'Số, ngày tháng năm',w:170,fx:1},{k:'nkk',n:3,t:'Người khởi kiện',h:HC_PH,w:250,fx:1},
    {k:'bast',n:2,t:'Bản án, quyết định sơ thẩm',h:'Số, ngày tháng năm và tên tòa án đã giải quyết',w:220},
    {k:'nbk',n:4,t:'Người bị kiện',h:HC_PH,w:240},{k:'nlq',n:5,t:'Người có quyền lợi, nghĩa vụ liên quan',h:HC_PH,w:220},
    {k:'bv',n:6,t:'Người bảo vệ quyền, lợi ích hợp pháp của đương sự',h:'Họ tên, chức danh (nếu là luật sư)',w:210},{k:'qh',n:7,t:'Quan hệ pháp luật',w:220},
    {t:'Kháng cáo, kháng nghị',c:[{k:'kc',n:8,t:'Kháng cáo',h:'Ngày tháng năm; tóm tắt nội dung',w:210},{k:'kn',n:9,t:'Kháng nghị',h:'Số, ngày tháng năm; tóm tắt nội dung',w:200}]},
    {k:'bpk',n:10,t:'Áp dụng biện pháp khẩn cấp tạm thời',h:'Số, ngày tháng năm',w:180},
    {t:'Rút kháng cáo, kháng nghị – tạm đình chỉ, đình chỉ',c:[{k:'rkc',n:11,t:'Rút kháng cáo',h:'Ngày tháng năm',w:150},{k:'rkn',n:12,t:'Rút kháng nghị',h:'Số, ngày tháng năm',w:150},
      {k:'tdc',n:13,t:'Tạm đình chỉ',h:'Số, ngày tháng năm',w:150},{k:'dc',n:14,t:'Đình chỉ',h:'Số, ngày tháng năm',w:150},{k:'ld',n:15,t:'Lý do',w:210}]},
    {t:'Xét xử phúc thẩm',c:[{k:'hdxx',n:16,t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230},{k:'bapt',n:17,t:'Bản án, quyết định phúc thẩm',h:'Số, ngày tháng năm',w:160},
      {k:'qdpt',n:18,t:'Quyết định của tòa án cấp phúc thẩm',h:'Tóm tắt phần quyết định',w:260},
      {t:'Lý do sửa, hủy',c:[{k:'sai',n:19,t:'Do cấp sơ thẩm quyết định không đúng pháp luật',w:180},{k:'ttm',n:20,t:'Do có tình tiết mới',w:170}]},
      {k:'al',n:21,t:'Áp dụng án lệ',w:150},{k:'rg',n:22,t:'Giải quyết theo thủ tục rút gọn',h:'Số, ngày tháng năm',w:160}]},
    {k:'gdt',n:23,t:'Kháng nghị giám đốc thẩm, tái thẩm',h:'Số, ngày tháng năm',w:170},{k:'gc',n:24,t:'Ghi chú',w:150}],
  GDTTT:[
    {k:'tl',n:1,t:'Thụ lý',h:'Số, ngày tháng năm',w:170,fx:1},{k:'nkk',n:3,t:'Người khởi kiện',h:HC_PH,w:250,fx:1},
    {k:'bakn',n:2,t:'Bản án, quyết định bị kháng nghị',h:'Số, ngày tháng năm và tên tòa án đã giải quyết',w:240},
    {k:'nbk',n:4,t:'Người bị khởi kiện',h:HC_PH,w:240},{k:'nlq',n:5,t:'Người có quyền lợi, nghĩa vụ liên quan',h:HC_PH,w:220},
    {k:'hdxx',n:6,t:'Hội đồng xét xử, đại diện VKS, thư ký phiên tòa',h:'Ghi đầy đủ họ tên',w:230},{k:'qh',n:7,t:'Quan hệ pháp luật',w:220},
    {t:'Kháng nghị',c:[{k:'can',n:8,t:'Chánh án kháng nghị',h:'Số, ngày tháng năm; tóm tắt nội dung',w:230},{k:'vtn',n:9,t:'Viện trưởng kháng nghị',h:'Số, ngày tháng năm; tóm tắt nội dung',w:230}]},
    {t:'Rút kháng nghị',c:[{k:'car',n:10,t:'Chánh án rút kháng nghị',h:'Số, ngày tháng năm',w:170},{k:'vtr',n:11,t:'Viện trưởng rút kháng nghị',h:'Số, ngày tháng năm',w:170}]},
    {t:'Giám đốc thẩm, tái thẩm',c:[{k:'qd',n:12,t:'Quyết định giám đốc thẩm, tái thẩm',h:'Số, ngày tháng năm',w:170},
      {k:'qdhd',n:13,t:'Quyết định của Hội đồng GĐT, TT',h:'Số, ngày tháng năm; tóm tắt nội dung',w:250},{k:'ld',n:14,t:'Lý do',h:'Rút kháng nghị hoặc sửa, hủy',w:210}]},
    {k:'al',n:15,t:'Áp dụng án lệ',h:'Số án lệ',w:150},{k:'gc',n:16,t:'Ghi chú',w:150}]
};
const fixMa=g=>{const f=t=>t.replace(/([\/-])DS(?=[-\s·]|$)/g,'$1HC');for(const k in g){if(Array.isArray(g[k]))g[k]=g[k].map(e=>({m:f(e.m),s:f(e.s)}))}return g};
function hcGen(gd){return function(r,d,no){
  const x={};x.nkk=nkk(r);x.nbk=nbk(r);if(r.f()<.3)x.nlq=nkk(r);const qh=r.pick(HC_QH);x.qh=[it(qh)];
  if(gd==='GDTTT'){const g=SO.DS_GDTTT.gen(r,d,no);Object.assign(g,{nkk:x.nkk,nbk:x.nbk,qh:x.qh});if(x.nlq)g.nlq=x.nlq;else delete g.nlq;delete g.nd;delete g.bd;delete g.viec;
    g.tl=[it(`Số ${no}/2026/TLGĐT-HC`,fmt(d))];return fixMa(g)}
  if(gd==='PT'){const g=SO.DS_PT.gen(r,d,no);Object.assign(g,{nkk:x.nkk,nbk:x.nbk,qh:x.qh});if(x.nlq)g.nlq=x.nlq;else delete g.nlq;delete g.nd;delete g.bd;delete g.viec;
    g.tl=[it(`Số ${no}/2026/TLPT-HC`,fmt(d))];if(g.khac){g.ttm=g.khac;delete g.khac}if(g.gdt)g.gdt=[it(`QĐ KN GĐT số ${r.int(1,40)}/2026/KN-HC`,fmt(TODAY))];
    if(g.kc)g.kc[0].s=r.pick(['Đề nghị hủy bản án sơ thẩm','Đề nghị chấp nhận yêu cầu khởi kiện']);return fixMa(g)}
  const st=r.w([['XX',4],['DTT',1.5],['CHUA',3],['TDC',1],['DC',1.2]]);x._st=st;
  x.tl=[it(`Số ${no}/2026/TLST-HC`,fmt(d))];if(r.f()<.4)x.bv=[it(`LS. ${person(r).ten}`,r.pick(DOAN_LS))];
  if(r.f()<.06)x.bpk=[it(`QĐ số ${r.int(1,30)}/2026/QĐ-BPKCTT`,'Tạm đình chỉ thi hành quyết định hành chính bị kiện')];
  const qd=()=>`QĐ số ${r.int(1,150)}/2026/QĐST-HC`,qdd=()=>fmt(clamp(add(d,r.int(15,60))));
  if(st!=='CHUA'||r.f()<.5)x.dt=[it(st==='DTT'?'Đối thoại thành':r.pick(['Đối thoại không thành','Không tiến hành đối thoại được']),qdd())];
  if(st==='DTT'){x.dc=[it(qd(),qdd())];x.ld=[it('Người bị kiện sửa đổi quyết định hành chính, người khởi kiện rút đơn','Công nhận kết quả đối thoại thành')]}
  if(st==='DC'){x.dc=[it(qd(),qdd())];x.ld=[it(r.pick(['Người khởi kiện rút đơn khởi kiện','Người bị kiện hủy bỏ quyết định hành chính bị kiện']),'Căn cứ đình chỉ')]}
  if(st==='TDC'){x.tdc=[it(qd(),qdd())];x.ld=[it('Cần đợi kết quả giải quyết của cơ quan khác','Căn cứ tạm đình chỉ')]}
  if(st==='XX'){const xd=clamp(add(d,r.int(30,90)));x.hdxx=hdxxDS(r);x.ba=[it(`Số ${r.int(10,300)}/2026/HC-ST`,fmt(xd))];x.tt=[it(r.pick(HC_KQ))];
    if(r.f()<.15)x.kng=[it('Kiến nghị Chủ tịch UBND TP. Hà Nội','Xem xét trách nhiệm cán bộ ban hành quyết định trái pháp luật')];
    if(r.f()<.2)x.btth=[it(`${r.int(50,900)}.000.000 đồng`,'Buộc người bị kiện bồi thường')];
    if(r.f()<.35){const kd=add(xd,r.int(5,15));if(past(kd)){x.kc=[it(`${x.nkk[0].m.replace(/ \(\d+\)$/,'')} · ${fmt(kd)}`,'Đề nghị sửa bản án sơ thẩm')];if(past(add(kd,10)))x.cpt=[it(fmt(add(kd,10)))]}}}
  if(r.f()<.05)x.rg=[it(`QĐ số ${r.int(1,20)}/2026/QĐ-RG`,fmt(clamp(add(d,5))))];
  if(r.f()<.04)x.nn=co('Người khởi kiện là người nước ngoài');
  return x;}}
SO.HC_ST={title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC HÀNH CHÍNH SƠ THẨM',units:['T_HN','T_DN','T_HCM'],cols:hcCols.ST,
  status:{XX:['Đã xét xử','success'],DTT:['Đối thoại thành','cyan'],CHUA:['Đang giải quyết','processing'],TDC:['Tạm đình chỉ','warning'],DC:['Đình chỉ','default']},gen:hcGen('ST')};
SO.HC_PT={title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC HÀNH CHÍNH PHÚC THẨM',units:['CC_HN','CC_DN','CC_HCM'],cols:hcCols.PT,status:PT_STATUS,gen:hcGen('PT')};
SO.HC_GDTTT={title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT CÁC VỤ VIỆC HÀNH CHÍNH GIÁM ĐỐC THẨM, TÁI THẨM',units:['D01','CC_HN','CC_DN','CC_HCM'],cols:hcCols.GDTTT,status:SO.HS_GDTTT.status,gen:hcGen('GDTTT')};

/* ===== Tuyên bố phá sản: 40 cột, lọc theo ngày nhận đơn ===== */
SO.PS={
  title:'SỔ THỤ LÝ VÀ KẾT QUẢ GIẢI QUYẾT YÊU CẦU TUYÊN BỐ PHÁ SẢN',units:['T_HN','T_DN','T_HCM'],dateLabel:'Ngày nhận đơn',listTitle:'Danh sách đơn yêu cầu mở thủ tục phá sản',label:r=>r.dn[0].m,
  cols:[
    {k:'nhan',n:1,t:'Ngày nhận đơn',w:160,fx:1},
    {k:'dn',n:3,t:'Doanh nghiệp, hợp tác xã bị yêu cầu tuyên bố phá sản',h:'Tên, địa chỉ, người đại diện, ngày thành lập, loại hình, vốn nước ngoài, niêm yết, tổ chức tín dụng',w:280,fx:1},
    {k:'nnd',n:2,t:'Người nộp đơn',h:'Họ tên, địa chỉ, tư cách pháp lý (Điều 5)',w:230},
    {k:'mn',n:4,t:'Mã ngành chính',w:170},{k:'tp',n:5,t:'Thẩm phán được phân công giải quyết',w:170},
    {t:'Xử lý đơn yêu cầu mở thủ tục phá sản',c:[{k:'cd',n:6,t:'Chuyển đơn cho tòa án khác',h:'Số, ngày tháng năm',w:170},{k:'trd',n:7,t:'Quyết định trả lại đơn',h:'Số, ngày tháng năm; lý do',w:210}]},
    {t:'Đề nghị xem xét lại, kiến nghị việc trả lại đơn',c:[
      {k:'dnnd',n:8,t:'Đề nghị của người nộp đơn',h:'Họ tên, ngày đề nghị',w:180},{k:'knvks',n:9,t:'Kiến nghị của VKS',h:'Số, ngày tháng năm',w:150},
      {t:'Quyết định giải quyết',c:[{k:'gntrd',n:10,t:'Giữ nguyên QĐ trả lại đơn',h:'Số, ngày tháng năm',w:160},{k:'huytrd',n:11,t:'Hủy QĐ trả lại đơn',h:'Số, ngày tháng năm',w:160}]}]},
    {k:'tld',n:12,t:'Thụ lý đơn',h:'Số, ngày tháng năm',w:170},{k:'tlh',n:13,t:'Thụ lý vụ án bị hủy và yêu cầu giải quyết lại',h:'Số, ngày tháng năm',w:180},
    {t:'Quyết định của thẩm phán',c:[{k:'kmo',n:14,t:'Không mở thủ tục phá sản',h:'Số, ngày tháng năm; lý do',w:210},{k:'mo',n:15,t:'Mở thủ tục phá sản',h:'Số, ngày tháng năm',w:170}]},
    {k:'qtv',n:16,t:'Quản tài viên, doanh nghiệp quản lý, thanh lý tài sản',h:'Tên; số, ngày văn bản chỉ định',w:230},
    {k:'bpk',n:17,t:'QĐ áp dụng, thay đổi, hủy bỏ biện pháp khẩn cấp tạm thời',h:'Tên loại QĐ; số, ngày; lý do (nếu có)',w:220},
    {t:'Đình chỉ tiến hành thủ tục phá sản',c:[
      {k:'dcso',n:18,t:'Số, ngày; lý do đình chỉ',w:210},
      {t:'Đề nghị xem xét lại, kiến nghị',c:[{k:'dcdn',n:19,t:'Đề nghị',h:'Ngày, người đề nghị',w:170},{k:'dckn',n:20,t:'Kiến nghị của VKS',h:'Số, ngày tháng năm',w:150}]},
      {t:'Quyết định giải quyết đề nghị, kiến nghị',c:[{k:'dcgn',n:21,t:'Giữ nguyên QĐ đình chỉ',h:'Số, ngày tháng năm',w:160},{k:'dchuy',n:22,t:'Hủy QĐ đình chỉ, giao thẩm phán tiếp tục giải quyết',h:'Số, ngày tháng năm',w:190}]}]},
    {t:'Phục hồi hoạt động kinh doanh',c:[
      {k:'cnph',n:23,t:'QĐ công nhận nghị quyết của hội nghị chủ nợ về phương án phục hồi',h:'Số, ngày; tóm tắt nội dung',w:230},
      {k:'sdph',n:24,t:'QĐ sửa đổi, bổ sung phương án phục hồi',h:'Số, ngày; tóm tắt nội dung',w:200},
      {k:'dcph',n:25,t:'QĐ đình chỉ thủ tục phục hồi',h:'Số, ngày; lý do (Điều 95 LPS)',w:200}]},
    {t:'Tuyên bố phá sản',c:[
      {k:'rg',n:26,t:'Theo thủ tục rút gọn',h:'Số, ngày tháng năm',w:160},{k:'hnkt',n:27,t:'QĐ khi hội nghị chủ nợ không thành',h:'Số, ngày tháng năm',w:170},
      {k:'nq',n:28,t:'QĐ theo nghị quyết của hội nghị chủ nợ',h:'Số, ngày tháng năm',w:170},
      {t:'QĐ sau khi có nghị quyết về phương án phục hồi',c:[{k:'kxd',n:29,t:'Không xây dựng được phương án',h:'Số, ngày tháng năm',w:160},
        {k:'ktq',n:30,t:'Không thông qua được phương án',h:'Số, ngày tháng năm',w:160},{k:'kth',n:31,t:'Không thực hiện được phương án',h:'Số, ngày tháng năm',w:160}]}]},
    {k:'tctd',n:32,t:'Quyết định đối với tổ chức tín dụng',h:'Số, ngày tháng năm',w:170},
    {k:'cam',n:33,t:'Người bị cấm đảm nhiệm chức vụ',h:'Họ tên, chức vụ, thời hạn bị cấm',w:210},
    {k:'nvts',n:34,t:'Tổng giá trị nghĩa vụ về tài sản của doanh nghiệp (Điều 51)',w:190},
    {k:'tsth',n:35,t:'Tổng giá trị tài sản thu hồi để phân chia (Điều 54)',w:190},
    {t:'Tòa án cấp trên',c:[{k:'kn',n:36,t:'Đề nghị, kháng nghị các quyết định lên tòa án cấp trên',h:'Ngày tháng năm, loại quyết định',w:220},
      {k:'cht',n:37,t:'Chuyển hồ sơ cho tòa án cấp trên',h:'Ngày tháng năm',w:160},{k:'qdct',n:38,t:'QĐ giải quyết đề nghị, kháng nghị của tòa án cấp trên',h:'Số, ngày; kết quả',w:220}]},
    {k:'qhan',n:39,t:'Quá hạn luật định',w:150},{k:'gc',n:40,t:'Ghi chú',w:150}],
  status:{XEM:['Đang xem xét đơn','processing'],TRA:['Trả lại đơn','default'],KMO:['Không mở thủ tục','warning'],MO:['Đã mở thủ tục','purple'],DC:['Đình chỉ','error'],PH:['Phục hồi kinh doanh','cyan'],TB:['Đã tuyên bố phá sản','success']},
  gen(r,d,no){
    const st=r.w([['XEM',2],['TRA',1],['KMO',.8],['MO',3],['DC',1],['PH',1],['TB',2.2]]);const x={_st:st};
    const cty=r.pick(['Công ty CP Xây dựng Thăng Long','Công ty TNHH May mặc Phương Nam','Công ty TNHH Vận tải Hưng Thịnh','HTX Nông nghiệp Tân Tiến','Công ty CP Bất động sản Hòa Phát Land','Công ty TNHH Thiết bị Minh Khang']);
    const gd=person(r).ten,qd=t=>`QĐ số ${r.int(1,99)}/2026/QĐ-${t}`,dd=n=>fmt(clamp(add(d,n)));
    x.nhan=[it(fmt(d))];
    x.dn=[it(cty,`${r.pick(DIACHI)} · Đại diện: ${gd} – Giám đốc · Thành lập ${r.int(2005,2020)} · ${r.pick(['Công ty TNHH','Công ty cổ phần','Hợp tác xã'])}${r.f()<.15?' · Có vốn đầu tư nước ngoài':''}`)];
    x.nnd=[it(r.f()<.4?r.pick(CONGTY):person(r).ten,r.pick(['Chủ nợ không có bảo đảm (khoản 1 Điều 5)','Người lao động (khoản 2 Điều 5)','Người đại diện theo pháp luật của doanh nghiệp (khoản 3 Điều 5)','Cổ đông sở hữu từ 20% cổ phần (khoản 5 Điều 5)']))];
    x.mn=[it(r.pick(['4100 – Xây dựng nhà các loại','4659 – Bán buôn máy móc, thiết bị','1410 – May trang phục','4933 – Vận tải hàng hóa bằng đường bộ','6810 – Kinh doanh bất động sản']))];
    x.tp=[it(r.pick(TP))];
    if(r.f()<.04)x.cd=[it(qd('CĐ'),`${dd(7)} · Chuyển ${r.pick(TOA_ST)}`)];
    if(st==='TRA'){x.trd=[it(qd('TLĐ'),`${dd(10)} · ${r.pick(['Người nộp đơn không có quyền nộp đơn','Không sửa đổi, bổ sung đơn theo yêu cầu','Không nộp lệ phí, tạm ứng chi phí phá sản'])}`)];
      if(r.f()<.4){x.dnnd=[it(x.nnd[0].m,dd(15))];if(r.f()<.5)x.gntrd=[it(qd('GQĐN'),dd(25))];else x.huytrd=[it(qd('GQĐN'),dd(25))]}}
    if(st!=='XEM'&&st!=='TRA')x.tld=[it(`Số ${no}/2026/TLPS`,dd(r.int(5,20)))];
    if(r.f()<.03)x.tlh=[it(`Số ${no}/2026/TLPS-L`,dd(20))];
    if(st==='KMO')x.kmo=[it(qd('KMTTPS'),`${dd(40)} · Doanh nghiệp không mất khả năng thanh toán`)];
    if(['MO','DC','PH','TB'].includes(st)){
      x.mo=[it(qd('MTTPS'),dd(35))];
      x.qtv=[it(r.pick(['Công ty Quản lý, thanh lý tài sản Việt Tín','Quản tài viên Nguyễn Minh Đức','Công ty Hợp danh Quản lý tài sản Sài Gòn']),`Chỉ định theo QĐ ngày ${dd(36)}`)];
      if(r.f()<.15)x.bpk=[it('QĐ áp dụng BPKCTT',`${dd(38)} · Phong tỏa tài khoản của doanh nghiệp`)];
      x.nvts=[it(`${r.int(3,120)}.${r.int(100,999)}.000.000 đồng`)];}
    if(st==='DC'){x.dcso=[it(qd('ĐCTTPS'),`${dd(60)} · ${r.pick(['Người nộp đơn rút đơn yêu cầu','Doanh nghiệp không còn mất khả năng thanh toán'])}`)];
      if(r.f()<.3){x.dcdn=[it(dd(66),'Chủ nợ đề nghị xem xét lại')];x.dcgn=[it(qd('GQĐN'),dd(80))]}}
    if(st==='PH'){x.cnph=[it(qd('CNNQ'),`${dd(70)} · Phục hồi hoạt động kinh doanh trong 3 năm`)];if(r.f()<.3)x.sdph=[it(qd('SĐPA'),`${dd(90)} · Gia hạn thời gian trả nợ`)]}
    if(st==='TB'){const k=r.pick(['rg','hnkt','nq','kxd','ktq','kth']);x[k]=[it(qd('TBPS'),dd(r.int(60,90)))];
      x.cam=[it(`${gd} – Giám đốc`,'Cấm đảm nhiệm chức vụ 3 năm')];x.tsth=[it(`${r.int(1,40)}.${r.int(100,999)}.000.000 đồng`)];
      if(r.f()<.25){x.kn=[it(dd(95),r.pick(['Chủ nợ đề nghị xem xét lại QĐ tuyên bố phá sản','VKS kháng nghị QĐ tuyên bố phá sản']))];x.cht=[it(dd(100))];if(r.f()<.5)x.qdct=[it(qd('GQĐN-PT'),'Giữ nguyên quyết định tuyên bố phá sản')]}}
    if(r.f()<.06)x.tctd=[it(qd('TCTD'),'Áp dụng thủ tục đối với tổ chức tín dụng')];
    if(st==='XEM'&&r.f()<.3)x.qhan=[it('Quá hạn luật định','Chưa ra QĐ mở / không mở thủ tục phá sản')];
    return x;}
};
const addD=add,clampD=clamp;
const DATA={};
Object.entries(SO).forEach(([key,so],si)=>{
  const r=RNG(1234+si*97),base=[],start=new Date(2026,0,5),span=Math.round((TODAY-start)/864e5);
  for(let i=0;i<220;i++)base.push({u:r.pick(so.units),d:add(start,r.int(0,span))});
  base.sort((a,b)=>a.u.localeCompare(b.u)||a.d-b.d);
  const cnt={};
  DATA[key]=base.map((b,i)=>{cnt[b.u]=(cnt[b.u]||0)+1;const row=so.gen(r,b.d,cnt[b.u]);row._u=b.u;row._d=b.d;row._id=key+'-'+i;
    row._text=norm(Object.entries(row).filter(([k])=>k[0]!=='_').map(([,v])=>v.map(e=>e.m+' '+e.s).join(' ')).join(' '));
    const pc=(row.nttt||row.hdxx||[]).find(e=>/Thẩm phán|Chủ tọa/.test(e.s));row._tp=row.tp?row.tp[0].m:pc?(pc.s.startsWith('Chủ tọa')?pc.s.replace('Chủ tọa: ',''):pc.m.split(',')[0]):r.pick(TP);
    const td=[row.ct,row.bakn,row.qd].filter(Boolean).flat().map(e=>e.s).join(' ').match(/Tội ([^;]+)/);
    row._nd=td?td[1].trim():(row.qhtl||row.qh||row.mn||[])[0]?.m;
    row._f={u18:!!(row.nt18||row.hq18),tg:!!row.tg&&row.tg.length>0,nn:!!row.nn,rg:!!row.rg,kc:!!row.kc,kn:!!row.kn,viec:!!row.viec,qh:!!row.qhan||r.f()<.08,td:r.f()<.06,cd:r.f()<.03};
    row._dgq=['CHUA','TDC','XEM','MO','PH'].includes(row._st)?null:clampD(addD(b.d,r.int(10,80)));
    return row});
});

export { SO, DATA, UNITS, norm, fmt };
