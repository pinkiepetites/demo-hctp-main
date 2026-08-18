
const rows = [
  // New Mock Data for 9 forms
  {id:"9-FORM-01",status:"received",received:"15/08/2026",applicationKind:"Đơn đề nghị GĐT/TT",p1:["Người đề nghị","Trần Văn A"],p2:["Người bị đề nghị","Nguyễn Văn B"],name:"Yêu cầu Giám đốc thẩm vụ án dân sự",domain:"Dân sự"},
  {id:"9-FORM-02",status:"received",received:"15/08/2026",applicationKind:"Đơn khiếu nại tố cáo trong tố tụng",p1:["Người khiếu nại","Lê Thị B"],p2:["Người bị khiếu nại","Nguyễn Văn C"],name:"Khiếu nại quyết định tố tụng",domain:"Hình sự"},
  {id:"9-FORM-03",status:"received",received:"15/08/2026",applicationKind:"Thông báo phát hiện vi phạm pháp luật",p1:["Cơ quan báo tin","Thanh tra tỉnh"],p2:["Người bị tố cáo","Công ty X"],name:"Thông báo vi phạm pháp luật đất đai",domain:"Hành chính"},
  {id:"9-FORM-04",status:"received",received:"15/08/2026",applicationKind:"Đơn khác",p1:["Người gửi","Ngô Thị E"],p2:["Người nhận","Tòa án"],name:"Đơn kiến nghị phản ánh",domain:"Lao động"},
  {id:"9-FORM-05",status:"received",received:"15/08/2026",applicationKind:"Công văn kiến nghị GĐT/TT",p1:["Viện kiểm sát","VKSND tỉnh"],p2:["Bị cáo","Trần Văn D"],name:"Kiến nghị xem xét bản án hình sự",domain:"Dân sự"},
  {id:"9-FORM-06",status:"received",received:"15/08/2026",applicationKind:"Công văn chuyển đơn",p1:["Cơ quan chuyển","Đoàn ĐBQH"],p2:["Đương sự","Phạm Văn D"],name:"Chuyển đơn khiếu nại của công dân",domain:"Dân sự"},
  {id:"9-FORM-07",status:"received",received:"15/08/2026",applicationKind:"Công văn chuyển kiến nghị",p1:["Cơ quan chuyển","Văn phòng Chính phủ"],p2:["Người liên quan","Lê Văn E"],name:"Chuyển kiến nghị cử tri",domain:"Dân sự"},
  {id:"9-FORM-08",status:"received",received:"15/08/2026",applicationKind:"Công văn khác",p1:["Đơn vị gửi","UBND tỉnh"],p2:["Đơn vị nhận","TAND tỉnh"],name:"Công văn phối hợp cung cấp tài liệu",domain:"Hành chính"},
  {id:"9-FORM-09",status:"received",received:"15/08/2026",applicationKind:"Tài liệu chứng cứ",p1:["Đương sự","Nguyễn Văn C"],p2:["Tòa án","Thẩm phán"],name:"Nộp bổ sung chứng cứ vụ án tranh chấp",domain:"Kinh doanh và thương mại"},
    {
      id:"54684011",samplePurpose:"READY_FOR_ACCEPTANCE",received:"25/07/2026",
      name:"Khiếu kiện quyết định xử phạt vi phạm hành chính trong hoạt động thương mại",
      type:"Đơn hành chính",domain:"Hành chính",
      applicationKind:"lawsuit",channel:"Trực tuyến",
      p1:["NKK","Công ty Cổ phần Công nghệ Sao Việt"],
      p2:["NBK","Chủ tịch UBND phường Hồng Bàng"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"-",
      processingJurisdiction:true,processingApplicationValid:true,processingSupplementResolved:true,
      participants:[
        {key:"p1",roleCode:"NKK",name:"Công ty Cổ phần Công nghệ Sao Việt",isCaseNamePerson:true},
        {key:"p2",roleCode:"NBK",name:"Chủ tịch UBND phường Hồng Bàng",isCaseNamePerson:true}
      ]
    },
    {
      id:"54684013",samplePurpose:"MULTI_PARTY_MULTI_REQUEST",received:"31/07/2026",
      name:"Tranh chấp hợp đồng góp vốn và yêu cầu hoàn trả tài sản",
      type:"Đơn dân sự",domain:"Dân sự",applicationKind:"lawsuit",channel:"Dịch vụ công",
      p1:["NKK","Nguyễn Văn Minh"],p2:["NBK","Công ty TNHH Đầu tư An Phát"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      processingProcedure:"undetermined",
      processingJurisdiction:true,processingApplicationValid:true,processingSupplementResolved:true,
      participants:[
        {key:"p1",roleCode:"NKK",name:"Nguyễn Văn Minh",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Trần Thị Lan",isCaseNamePerson:false},
        {key:"p1-3",roleCode:"NKK",name:"Lê Quốc Bảo",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Công ty TNHH Đầu tư An Phát",isCaseNamePerson:true}
      ],
      createDraft:{
        receipt:{
          channel:"Dịch vụ công",sentDate:"2026-07-30",applicationDate:"2026-07-29",
          receivedDate:"2026-07-31",number:"54684013",officer:"Phạm Quốc Hưng"
        },
        application:{
          domain:"Dân sự",kind:"Đơn khởi kiện",statisticRelation:"DS_TRANH_CHAP_HOP_DONG",
          legalRelation:"Tranh chấp hợp đồng góp vốn và yêu cầu hoàn trả tài sản",
          content:"Ba người khởi kiện yêu cầu giải quyết hợp đồng góp vốn, hoàn trả vốn góp và bồi thường thiệt hại."
        },
        voterList:null,
        parties:[
          {ptype:"cn",ten:"Nguyễn Văn Minh",dinhdanh:"CCCD: 031086001234",tucach:"Người khởi kiện",tucachs:["Người khởi kiện"],diachi:"Phường Hồng Bàng, thành phố Hải Phòng",dd:true,onlineService:true},
          {ptype:"cn",ten:"Trần Thị Lan",dinhdanh:"CCCD: 031089005678",tucach:"Người khởi kiện",tucachs:["Người khởi kiện"],diachi:"Phường Lê Chân, thành phố Hải Phòng",dd:false,onlineService:true},
          {ptype:"cn",ten:"Lê Quốc Bảo",dinhdanh:"CCCD: 031082009876",tucach:"Người khởi kiện",tucachs:["Người khởi kiện"],diachi:"Phường Ngô Quyền, thành phố Hải Phòng",dd:false,onlineService:false},
          {ptype:"dn",ten:"Công ty TNHH Đầu tư An Phát",dinhdanh:"Mã định danh điện tử: 0202187654",tucach:"Người bị kiện",tucachs:["Người bị kiện"],diachi:"Phường Hải An, thành phố Hải Phòng",dd:true,details:{organization:true}}
        ],
        requests:[
          {
            yc:"Yêu cầu tuyên Hợp đồng góp vốn số 08/2025/HĐGV vô hiệu",
            qhStat:"DS_TRANH_CHAP_HOP_DONG",qh:"Tranh chấp hợp đồng góp vốn",
            ng:"Nguyễn Văn Minh",
            fee:{declaredAmount:0,amount:0,currency:"VND",valuationDocument:"Hợp đồng góp vốn số 08/2025/HĐGV"}
          },
          {
            yc:"Yêu cầu Công ty TNHH Đầu tư An Phát hoàn trả 1.200.000.000 đồng tiền góp vốn",
            qhStat:"DS_TRANH_CHAP_HOP_DONG",qh:"Yêu cầu hoàn trả tài sản",
            ng:"Nguyễn Văn Minh",
            fee:{declaredAmount:1200000000,amount:1200000000,currency:"VND",jointPeople:["Trần Thị Lan"],valuationDocument:"Hợp đồng góp vốn và chứng từ chuyển tiền"}
          },
          {
            yc:"Yêu cầu bồi thường 350.000.000 đồng do chậm hoàn trả vốn góp",
            qhStat:"DS_BOI_THUONG_THIET_HAI",qh:"Yêu cầu bồi thường thiệt hại",
            ng:"Lê Quốc Bảo",
            fee:{declaredAmount:350000000,amount:350000000,currency:"VND",jointPeople:[],valuationDocument:"Bảng xác định thiệt hại và tài liệu chứng minh"}
          }
        ],
        family:null,
        administrative:{qd:[],hv:[],cb:[],bt:[]},
        documents:[
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Văn Minh",nhan:"Phạm Quốc Hưng",ten:"Đơn khởi kiện",file:"Don_khoi_kien_54684013.pdf"},
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Trần Thị Lan",nhan:"Phạm Quốc Hưng",ten:"Hợp đồng góp vốn và chứng từ chuyển tiền",file:"Hop_dong_gop_von_08_2025.pdf"},
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Lê Quốc Bảo",nhan:"Phạm Quốc Hưng",ten:"Bảng xác định thiệt hại",file:"Bang_xac_dinh_thiet_hai.pdf"}
        ]
      }
    },
    {
      id:"54684014",samplePurpose:"FAMILY_FEE_REDUCTION_AFTER_NOTICE",received:"31/07/2026",
    name:"Tranh chấp ly hôn, nuôi con, cấp dưỡng và chia tài sản chung",
      type:"Đơn hôn nhân và gia đình",domain:"Hôn nhân và gia đình",applicationKind:"lawsuit",channel:"Trực tuyến",
      p1:["NKK","Nguyễn Thị Thu Hà"],p2:["NBK","Trần Văn Nam"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"10 ngày",
      processingProcedure:"standard",
      processingJurisdiction:true,processingApplicationValid:true,processingSupplementResolved:true,
      participants:[
        {key:"p1",roleCode:"NKK",name:"Nguyễn Thị Thu Hà",isCaseNamePerson:true},
        {key:"p2",roleCode:"NBK",name:"Trần Văn Nam",isCaseNamePerson:true}
      ],
      createDraft:{
        receipt:{
          channel:"Trực tuyến",sentDate:"2026-07-30",applicationDate:"2026-07-30",
          receivedDate:"2026-07-31",number:"54684014",officer:"Phạm Quốc Hưng"
        },
        application:{
          domain:"Hôn nhân và gia đình",kind:"Đơn khởi kiện",
          statisticRelation:"Tranh chấp ly hôn, nuôi con, cấp dưỡng và chia tài sản chung",
          legalRelation:"Tranh chấp ly hôn, nuôi con, cấp dưỡng và chia tài sản chung",
          content:"Người khởi kiện yêu cầu ly hôn, trực tiếp nuôi con, yêu cầu cấp dưỡng và chia tài sản chung của vợ chồng."
        },
        voterList:null,
        parties:[
          {
            ptype:"cn",ten:"Nguyễn Thị Thu Hà",dinhdanh:"CCCD: 031090001468",
            tucach:"Người khởi kiện",tucachs:["Người khởi kiện"],
            diachi:"Phường Lê Chân, thành phố Hải Phòng",dd:true,onlineService:true,
            details:{}
          },
          {
            ptype:"cn",ten:"Trần Văn Nam",dinhdanh:"CCCD: 031087006821",
            tucach:"Người bị kiện",tucachs:["Người bị kiện"],
            diachi:"Phường Ngô Quyền, thành phố Hải Phòng",dd:true,onlineService:false
          }
        ],
        requests:[
          {
            yc:"Yêu cầu ly hôn, giao con chung cho Nguyễn Thị Thu Hà trực tiếp nuôi và buộc Trần Văn Nam cấp dưỡng 5.000.000 đồng/tháng",
            qhStat:"Tranh chấp ly hôn, nuôi con và cấp dưỡng",qh:"Tranh chấp ly hôn, nuôi con và cấp dưỡng",
            ng:"Nguyễn Thị Thu Hà",
            fee:{declaredAmount:0,amount:0,currency:"VND",jointPeople:[],valuationDocument:"Giấy chứng nhận kết hôn và giấy khai sinh của con"}
          },
          {
            yc:"Yêu cầu chia tài sản chung là quyền sử dụng đất và nhà ở trị giá 1.200.000.000 đồng; phần yêu cầu của Nguyễn Thị Thu Hà là 600.000.000 đồng",
            qhStat:"Tranh chấp chia tài sản chung của vợ chồng khi ly hôn",qh:"Tranh chấp chia tài sản chung của vợ chồng khi ly hôn",
            ng:"Nguyễn Thị Thu Hà",
            fee:{declaredAmount:600000000,amount:600000000,currency:"VND",jointPeople:[],valuationDocument:"Hợp đồng chuyển nhượng và chứng thư thẩm định giá tài sản"}
          }
        ],
        family:{
          marriageContent:"Nguyễn Thị Thu Hà yêu cầu được ly hôn với Trần Văn Nam do mâu thuẫn kéo dài, mục đích hôn nhân không đạt được.",
          hasChildren:true,
          children:[
            {name:"Trần Gia Bảo",gender:"Nam",birthDate:"2017-09-12",custodian:"Nguyễn Thị Thu Hà"}
          ],
          support:[
            {type:"Có yêu cầu",child:"Trần Gia Bảo",frequency:"Hàng tháng",amount:"5000000",payer:"Trần Văn Nam"}
          ],
          hasAssets:true,assetResolution:"Yêu cầu Tòa án giải quyết",
          assetRequest:"Chia quyền sử dụng đất và nhà ở tại phường Lê Chân, thành phố Hải Phòng; giá trị kê khai 1.200.000.000 đồng, Nguyễn Thị Thu Hà yêu cầu được nhận phần trị giá 600.000.000 đồng.",
          hasDebt:true,
          debtRequest:"Xác định khoản vay 120.000.000 đồng tại Ngân hàng TMCP A là nghĩa vụ chung; mỗi bên chịu 60.000.000 đồng."
        },
        administrative:{qd:[],hv:[],cb:[],bt:[]},
        documents:[
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Thị Thu Hà",nhan:"Phạm Quốc Hưng",ten:"Đơn khởi kiện ly hôn",file:"Don_khoi_kien_ly_hon_54684014.pdf"},
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Thị Thu Hà",nhan:"Phạm Quốc Hưng",ten:"Giấy chứng nhận kết hôn",file:"Giay_chung_nhan_ket_hon_54684014.pdf"},
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Thị Thu Hà",nhan:"Phạm Quốc Hưng",ten:"Giấy khai sinh của con chung",file:"Giay_khai_sinh_Tran_Gia_Bao.pdf"},
          {ngay:"31/07/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Thị Thu Hà",nhan:"Phạm Quốc Hưng",ten:"Tài liệu về tài sản chung và chứng thư thẩm định giá",file:"Tai_lieu_tai_san_chung_54684014.pdf"},
          {ngay:"02/08/2026",tucach:"Người khởi kiện",bangiao:"Nguyễn Thị Thu Hà",nhan:"Nguyễn Hải Trâm",ten:"Đơn đề nghị giảm tiền tạm ứng án phí và tài liệu chứng minh",file:"Don_de_nghi_giam_va_xac_nhan_UBND_54684014.pdf"}
        ]
      }
    },
    {id:"54682214",demoScenario:"HG-01",externalMediator:true,received:"14/07/2026",name:"Tranh chấp hợp đồng vay tài sản",type:"Đơn dân sự",domain:"Dân sự",applicationKind:"lawsuit",channel:"Trực tiếp",p1:["NKK","Vũ Ngọc Minh"],p2:["NBK","Vũ Thu Thủy"],judge:"Nguyễn Hải Trâm",hg:true,status:"dang-hoa-giai",deadline:"12 ngày"},
    {id:"54683002",demoScenario:"HG-02",received:"15/07/2026",name:"Tranh chấp ly hôn và nuôi con",type:"Đơn hôn nhân và gia đình",domain:"Hôn nhân và gia đình",applicationKind:"lawsuit",channel:"Bưu điện",p1:["NKK","Nguyễn Thị Mai"],p2:["NBK","Trần Quốc Hùng"],judge:"Nguyễn Hải Trâm",hg:true,status:"dang-hoa-giai",deadline:"12 ngày"},
    {id:"54683003",demoScenario:"HG-03",received:"16/07/2026",name:"Tranh chấp đơn phương chấm dứt hợp đồng lao động",type:"Đơn lao động",domain:"Lao động",applicationKind:"lawsuit",channel:"Dịch vụ công",p1:["NKK","Nguyễn Văn Hòa"],p2:["NBK","Công ty TNHH Đông Hải"],judge:"Trần Thu Hà",hg:true,status:"dang-hoa-giai",deadline:"12 ngày"},
    {id:"54683004",demoScenario:"HG-04",received:"17/07/2026",name:"Tranh chấp hợp đồng mua bán hàng hóa",type:"Đơn kinh doanh và thương mại",domain:"Kinh doanh và thương mại",applicationKind:"lawsuit",channel:"Trong hệ thống tòa án",p1:["NKK","Công ty CP Minh Phát"],p2:["NBK","Công ty TNHH An Khang"],judge:"Nguyễn Hải Trâm",hg:true,status:"cho-xu-ly",deadline:"-"},
    {id:"54683005",demoScenario:"HG-05",received:"18/07/2026",name:"Tranh chấp hợp đồng thuê nhà",type:"Đơn dân sự",domain:"Dân sự",applicationKind:"lawsuit",channel:"Trực tiếp",p1:["NKK","Đỗ Minh Quân"],p2:["NBK","Lê Thu Phương"],judge:"Trần Thu Hà",hg:true,status:"hoa-giai-khong-thanh",deadline:"-"},
    {id:"54682501",demoScenario:"HG-06",received:"19/07/2026",name:"Yêu cầu công nhận thuận tình ly hôn",type:"Đơn hôn nhân và gia đình",domain:"Hôn nhân và gia đình",applicationKind:"request",channel:"Trực tuyến",p1:["NYC","Lê Minh Anh"],p2:["NYC","Phạm Hoàng Nam"],judge:"Nguyễn Hải Trâm",hg:true,status:"hoa-giai-thanh",deadline:"-"},
    {id:"54683007",demoScenario:"DT-01",externalMediator:true,received:"20/07/2026",name:"Khiếu kiện quyết định thu hồi đất",type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trực tuyến",p1:["NKK","Phạm Văn Long"],p2:["NBK","UBND phường Hồng Bàng"],judge:"Nguyễn Hải Trâm",hg:true,status:"dang-doi-thoai",deadline:"12 ngày"},
    {id:"54683008",demoScenario:"DT-02",received:"21/07/2026",name:"Khiếu kiện quyết định xử phạt vi phạm hành chính",type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trực tiếp",p1:["NKK","Trần Văn Toàn"],p2:["NBK","UBND phường Lê Chân"],judge:"Nguyễn Hải Trâm",hg:true,status:"dang-doi-thoai",deadline:"12 ngày"},
    {id:"54682453",demoScenario:"DT-03",received:"22/07/2026",name:"Khiếu kiện quyết định giải quyết khiếu nại",type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trực tuyến",p1:["NKK","Nguyễn Văn Nguyên"],p2:["NBK","UBND phường X"],judge:"Nguyễn Hải Trâm",hg:true,status:"doi-thoai-thanh",deadline:"-"},
    {id:"54683010",demoScenario:"DT-04",received:"23/07/2026",name:"Khiếu kiện hành vi hành chính trong cấp giấy chứng nhận",type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Bưu điện",p1:["NKK","Hoàng Thị Lan"],p2:["NBK","Văn phòng đăng ký đất đai Khu vực 1"],judge:"Nguyễn Hải Trâm",hg:true,status:"cho-xu-ly",deadline:"-",applicationWithdrawal:true,applicationWithdrawalDate:"31/07/2026"},
    {
      id:"54683011",demoScenario:"HG-MULTI-LAWSUIT",received:"24/07/2026",
      name:"Tranh chấp hợp đồng góp vốn",type:"Đơn kinh doanh và thương mại",domain:"Kinh doanh và thương mại",
      applicationKind:"lawsuit",channel:"Trực tiếp",p1:["NKK","Nguyễn Văn An"],p2:["NBK","Công ty TNHH Minh Hải"],
      judge:"Nguyễn Hải Trâm",hg:true,status:"dang-hoa-giai",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Nguyễn Văn An",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Trần Thị Bình",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Công ty TNHH Minh Hải",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Công ty Cổ phần Đông Phương",isCaseNamePerson:false}
      ]
    },
    {
      id:"54683012",demoScenario:"HG-MULTI-REQUEST",received:"25/07/2026",
      name:"Yêu cầu không công nhận bản án, quyết định kinh doanh, thương mại của Tòa án nước ngoài có yêu cầu thi hành tại Việt Nam",
      type:"Đơn kinh doanh và thương mại",domain:"Kinh doanh và thương mại",
      applicationKind:"request",channel:"Trực tuyến",p1:["NYC","Công ty Cổ phần Việt Thịnh"],p2:["NBYC","Công ty Global Commerce Ltd."],
      judge:"Trần Thu Hà",hg:true,status:"dang-hoa-giai",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NYC",name:"Công ty Cổ phần Việt Thịnh",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NYC",name:"Công ty TNHH Thương mại Á Châu",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBYC",name:"Công ty Global Commerce Ltd.",isCaseNamePerson:false},
        {key:"p2-2",roleCode:"NBYC",name:"Pacific Investment Pte. Ltd.",isCaseNamePerson:false}
      ]
    },
    // ✅ 10 đơn thực hành sạch: chưa phát sinh biểu mẫu hoặc dữ liệu Hòa giải/Đối thoại.
    // Khi người dùng ban hành văn bản đầu tiên, trạng thái chuyển từ Chờ xử lý
    // sang Đang hòa giải hoặc Đang đối thoại theo đúng loại án.
    {
      id:"54684001",manualFlow:true,received:"29/07/2026",
      name:"Tranh chấp hợp đồng đặt cọc chuyển nhượng quyền sử dụng đất",
      type:"Đơn dân sự",domain:"Dân sự",applicationKind:"lawsuit",channel:"Trực tiếp",
      p1:["NKK","Nguyễn Thị Thanh Hương"],p2:["NBK","Trần Văn Khánh"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Nguyễn Thị Thanh Hương",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Hoàng Minh Đức",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Trần Văn Khánh",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Lê Thị Thu",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684002",manualFlow:true,received:"29/07/2026",
      name:"Tranh chấp ly hôn, quyền nuôi con và chia tài sản chung",
      type:"Đơn hôn nhân và gia đình",domain:"Hôn nhân và gia đình",applicationKind:"lawsuit",channel:"Trực tuyến",
      p1:["NKK","Phạm Thị Mai Hoa"],p2:["NBK","Lê Quốc Bảo"],
      judge:"Trần Thu Hà",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Phạm Thị Mai Hoa",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Phạm Minh Anh",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Lê Quốc Bảo",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Lê Thị Hồng",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684003",manualFlow:true,received:"29/07/2026",
      name:"Tranh chấp tiền lương và trợ cấp khi chấm dứt hợp đồng lao động",
      type:"Đơn lao động",domain:"Lao động",applicationKind:"lawsuit",channel:"Dịch vụ công",
      p1:["NKK","Đặng Minh Tuấn"],p2:["NBK","Công ty TNHH May Mặc Hải Đăng"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Đặng Minh Tuấn",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Nguyễn Thị Hạnh",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Công ty TNHH May Mặc Hải Đăng",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Công ty Cổ phần Nhân lực Á Châu",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684004",manualFlow:true,received:"29/07/2026",
      name:"Tranh chấp hợp đồng cung ứng dịch vụ logistics",
      type:"Đơn kinh doanh và thương mại",domain:"Kinh doanh và thương mại",applicationKind:"lawsuit",channel:"Trong hệ thống tòa án",
      p1:["NKK","Công ty Cổ phần Vận tải Đại Dương"],p2:["NBK","Công ty TNHH Xuất nhập khẩu Phú Thành"],
      judge:"Trần Thu Hà",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Công ty Cổ phần Vận tải Đại Dương",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Công ty TNHH Kho vận Đông Bắc",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Công ty TNHH Xuất nhập khẩu Phú Thành",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Công ty Cổ phần Thương mại Nam Hải",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684005",manualFlow:true,received:"29/07/2026",
      name:"Yêu cầu tuyên bố một người mất năng lực hành vi dân sự",
      type:"Đơn dân sự",domain:"Dân sự",applicationKind:"request",channel:"Bưu điện",
      p1:["NYC","Vũ Thị Ngọc Lan"],p2:["NBYC","Vũ Văn Thành"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NYC",name:"Vũ Thị Ngọc Lan",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NYC",name:"Vũ Minh Hoàng",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBYC",name:"Vũ Văn Thành",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBYC",name:"Vũ Thị Thanh Mai",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684006",manualFlow:true,received:"29/07/2026",
      name:"Khiếu kiện quyết định thu hồi giấy chứng nhận quyền sử dụng đất",
      type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trực tiếp",
      p1:["NKK","Bùi Văn Nam"],p2:["NBK","UBND phường Ngô Quyền"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Bùi Văn Nam",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Bùi Thị Hương",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"UBND phường Ngô Quyền",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Chủ tịch UBND phường Ngô Quyền",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684007",manualFlow:true,received:"29/07/2026",
      name:"Khiếu kiện quyết định xử phạt vi phạm hành chính trong lĩnh vực xây dựng",
      type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trực tuyến",
      p1:["NKK","Đỗ Thị Thu Hà"],p2:["NBK","Chủ tịch UBND phường Hồng Bàng"],
      judge:"Trần Thu Hà",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Đỗ Thị Thu Hà",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Nguyễn Văn Phúc",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Chủ tịch UBND phường Hồng Bàng",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"UBND phường Hồng Bàng",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684008",manualFlow:true,received:"29/07/2026",
      name:"Khiếu kiện hành vi không cấp giấy phép xây dựng",
      type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Dịch vụ công",
      p1:["NKK","Nguyễn Hoàng Long"],p2:["NBK","UBND phường Lê Chân"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Nguyễn Hoàng Long",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Trần Thị Ngọc",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"UBND phường Lê Chân",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Phòng Quản lý đô thị phường Lê Chân",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684009",manualFlow:true,received:"29/07/2026",
      name:"Khiếu kiện quyết định áp dụng biện pháp cưỡng chế tháo dỡ công trình",
      type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Bưu điện",
      p1:["NKK","Hoàng Văn Dũng"],p2:["NBK","Chủ tịch UBND phường Hải An"],
      judge:"Trần Thu Hà",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Hoàng Văn Dũng",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Hoàng Thị Lý",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"Chủ tịch UBND phường Hải An",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"UBND phường Hải An",isCaseNamePerson:false}
      ]
    },
    {
      id:"54684010",manualFlow:true,received:"29/07/2026",
      name:"Khiếu kiện quyết định giải quyết khiếu nại về bồi thường, hỗ trợ tái định cư",
      type:"Đơn hành chính",domain:"Hành chính",applicationKind:"lawsuit",channel:"Trong hệ thống tòa án",
      p1:["NKK","Lê Thị Thu Trang"],p2:["NBK","UBND phường Kiến An"],
      judge:"Nguyễn Hải Trâm",hg:false,status:"cho-xu-ly",deadline:"12 ngày",
      participants:[
        {key:"p1",roleCode:"NKK",name:"Lê Thị Thu Trang",isCaseNamePerson:true},
        {key:"p1-2",roleCode:"NKK",name:"Phạm Văn Hùng",isCaseNamePerson:false},
        {key:"p2",roleCode:"NBK",name:"UBND phường Kiến An",isCaseNamePerson:true},
        {key:"p2-2",roleCode:"NBK",name:"Chủ tịch UBND phường Kiến An",isCaseNamePerson:false}
      ]
    }
  ];
rows.forEach((record, index) => {
  if (!record) return;
  if (!record.p1) {
    console.log(`Index ${index} (ID: ${record.id}) is missing p1!`);
  }
  if (!record.p2) {
    console.log(`Index ${index} (ID: ${record.id}) is missing p2!`);
  }
});
console.log("Check complete.");
