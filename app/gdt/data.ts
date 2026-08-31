export type TabId =
  | "tat-ca"
  | "cho-y-kien"
  | "don-cho-phe-duyet"
  | "ho-so-khang-nghi"
  | "da-co-vu-an"
  | "tra-lai";

export type VuAnAction =
  | "chuyen-vu-an"
  | "huy-ghep"
  | "them-vu-an"
  | "ghep-vu-an";

export type TrangThaiVuAn =
  | "don-cho-phe-duyet"
  | "da-co-vu-an"
  | "thong-bao-giai-quyet"
  | "chua-co-hs";

export type LoaiAn =
  | "Hình sự"
  | "Dân sự"
  | "Hành chính"
  | "Kinh doanh thương mại"
  | "Hôn nhân gia đình"
  | "Lao động"
  | "Sở hữu trí tuệ"
  | "Phá sản";

export type VuPhuTrach =
  | "Vụ GD, KT về hình sự"
  | "Vụ GDT, KT về dân sự"
  | "Tòa Hành chính"
  | "Tòa Kinh tế, gia đình và người chưa thành niên";

export const LOAI_AN_OPTIONS: LoaiAn[] = [
  "Hình sự",
  "Dân sự",
  "Hành chính",
  "Kinh doanh thương mại",
  "Hôn nhân gia đình",
  "Lao động",
  "Sở hữu trí tuệ",
  "Phá sản",
];

export const VU_OPTIONS: VuPhuTrach[] = [
  "Vụ GD, KT về hình sự",
  "Vụ GDT, KT về dân sự",
  "Tòa Hành chính",
  "Tòa Kinh tế, gia đình và người chưa thành niên",
];

export function getVuByLoaiAn(loaiAn: LoaiAn): VuPhuTrach {
  switch (loaiAn) {
    case "Hình sự":
      return "Vụ GD, KT về hình sự";
    case "Dân sự":
      return "Vụ GDT, KT về dân sự";
    case "Hành chính":
      return "Tòa Hành chính";
    default:
      return "Tòa Kinh tế, gia đình và người chưa thành niên";
  }
}

export interface LeaderOpinion {
  name: string;
  role: string;
  decision: "thuy-moi" | "khong-thu-ly";
  date: string;
}

export interface DonCase {
  id: number;
  type: "don" | "hskn";
  tabs: TabId[];
  loaiAn: LoaiAn;
  vu: VuPhuTrach;

  // Thông tin đơn (type=don)
  maDon?: string;
  soCV?: string;
  ngayCV?: string;
  thuLyMoi?: string;
  daThuLy?: boolean;

  // Thông tin đơn (type=hskn)
  maVanThuDen?: string;
  ngayVanThuDen?: string;
  soHSKN?: string;
  ngayHSKN?: string;
  thuLyXetXu?: string;

  // Chung
  thamPhan: string;
  capThamPhan: string;
  hinhThuc: string;
  tags: string[]; // "an-quoc-hoi" | "an-chi-dao" | "an-tvtn"

  // Đương sự
  nguoiKhieuNai?: string;
  biCao?: string;
  ndd?: string;
  nguoiKhangNghi?: string;

  // BA/QĐ
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;
  thoiHieu?: string;
  hoiDongThamPhanPhucTham?: string;
  thamPhanChuToaPhucTham?: string;

  // Vụ án
  maVuAn?: string;
  tenVuAn?: string;
  ttv?: string;
  trangThai: TrangThaiVuAn;
  trangThai2?: TrangThaiVuAn;
  vuAnActions?: VuAnAction[];

  // Kết quả giải quyết trước đó
  thongBaoBoSung?: string;
  ttvGiaiQuyet?: string;
  tpGiaiQuyet?: string;

  // Ý kiến lãnh đạo
  yKienLD?: LeaderOpinion[];

  // Nhận/Trả
  ngayNhan?: string;
  nguoiThaoTac?: string;
  ngayThaoTac?: string;
  nguoiTra?: string;
  ngayTra?: string;
  lyDoTraLai?: string;
}

export type ToTrinhScope = "case" | "submission";

export interface ToTrinh {
  id: string;
  title: string;
  scope: ToTrinhScope;
  targetId: string;
  authorId?: string;
  createdAt?: string;
  content?: string;
}

export const TOTRINHS: ToTrinh[] = [
  {
    id: "tt-1",
    title: "Tờ trình toàn vụ án VA26-010301",
    scope: "case",
    targetId: "VA26-010301",
    authorId: "Nguyễn Văn A",
    createdAt: "20/07/2026",
    content: "Tờ trình đề nghị xem xét toàn bộ vụ án VA26-010301",
  },
  {
    id: "tt-2",
    title: "Tờ trình theo đơn 5101",
    scope: "submission",
    targetId: "5101",
    authorId: "Lý Thái Phúc",
    createdAt: "22/07/2026",
    content: "Tờ trình liên quan đến đơn số 5101, đề nghị xử lý theo đơn giải quyết",
  },
];

export function getToTrinhsByCase(maVuAn: string): ToTrinh[] {
  return TOTRINHS.filter((t) => t.scope === "case" && t.targetId === maVuAn);
}

export function getToTrinhsBySubmission(maDonOrId: string): ToTrinh[] {
  return TOTRINHS.filter((t) => t.scope === "submission" && t.targetId === maDonOrId);
}

// ── Mock data: 8 loại án × 5 bản ghi, phân bổ 4 vụ ─────────────────────────

interface LoaiAnMeta {
  loaiAn: LoaiAn;
  vuAnTitles: string[];
}

const LOAI_AN_META: LoaiAnMeta[] = [
  {
    loaiAn: "Hình sự",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN ANH & ĐỒNG PHẠM – Tội vi phạm quy định về quản lý, sử dụng tài sản Nhà nước gây thất thoát, lãng phí và Tội thiếu trách nhiệm gây hậu quả nghiêm trọng",
      "Vụ án TRẦN THỊ BẢO – Tội vận chuyển trái phép chất ma túy qua biên giới với số lượng đặc biệt lớn",
      "Vụ án PHẠM QUỐC CƯỜNG – Tội giết người có tính chất dã man và Tội cướp tài sản",
      "Vụ án NGUYỄN THỊ DUNG – Tội lừa đảo chiếm đoạt tài sản thông qua hình thức huy động vốn đa cấp trái phép",
      "Vụ án HOÀNG VĂN EM – Tội cố ý gây thương tích",
      "Vụ án ĐẶNG THỊ DƯƠNG – Tội lạm dụng chức vụ, quyền hạn chiếm đoạt tài sản Nhà nước",
      "Vụ án VŨ MINH KHOA – Tội sản xuất, buôn bán hàng giả là thuốc chữa bệnh, thuốc phòng bệnh quy mô lớn",
      "Vụ án LÊ ANH TUẤN – Tội cướp tài sản có tổ chức theo khoản 4 Điều 168 Bộ luật Hình sự",
      "Vụ án HOÀNG HOA THÁM – Tội đánh bạc và tổ chức đánh bạc qua mạng internet công nghệ cao",
      "Vụ án TRỊNH TIẾN ĐẠT – Tội đưa và nhận hối lộ xảy ra tại các Trung tâm đăng kiểm phương tiện cơ giới",
    ],
  },
  {
    loaiAn: "Dân sự",
    vuAnTitles: [
      "Vụ án TỔNG CÔNG TY CỔ PHẦN ĐẦU TƯ BẤT ĐỘNG SẢN & PHÁT TRIỂN ĐÔ THỊ – Tranh chấp hợp đồng hợp tác đầu tư xây dựng hạ tầng khu đô thị mới và bồi thường thiệt hại",
      "Vụ án NGUYỄN VĂN GIANG – Tranh chấp quyền sử dụng đất và yêu cầu hủy hợp đồng chuyển nhượng",
      "Vụ án TRẦN THỊ HÀ – Tranh chấp thừa kế di sản nhà đất và yêu cầu hủy Giấy chứng nhận quyền sử dụng đất cấp sai đối tượng",
      "Vụ án ĐỖ VĂN HÙNG – Tranh chấp hợp đồng vay tài sản và xử lý tài sản thế chấp",
      "Vụ án LÊ THỊ KHÁNH – Tranh chấp đòi lại tài sản và bồi thường thiệt hại ngoài hợp đồng",
      "Vụ án NGÔ MAI TRANG – Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất tại Hà Nội",
      "Vụ án LÊ VĂN HÙNG – Tranh chấp phân chia quyền sử dụng đất do cha mẹ để lại tại Hà Nội",
      "Vụ án PHẠM THỊ BÍCH NGỌC – Tranh chấp lối đi chung và ranh giới quyền sử dụng đất liền kề",
      "Vụ án BÙI THỊ LAN – Tranh chấp hợp đồng ủy quyền định đoạt nhà đất và tuyên bố giao dịch vô hiệu",
      "Vụ án TRẦN QUANG HUY – Tranh chấp hợp đồng đặt cọc mua bán căn hộ chung cư cao cấp",
    ],
  },
  {
    loaiAn: "Hành chính",
    vuAnTitles: [
      "Vụ án PHẠM VĂN LÂM – Khiếu kiện Quyết định thu hồi đất, Quyết định phê duyệt phương án bồi thường, hỗ trợ tái định cư và Quyết định cưỡng chế thu hồi đất của UBND tỉnh",
      "Vụ án NGUYỄN THỊ MINH – Khiếu kiện quyết định xử phạt vi phạm hành chính trong lĩnh vực xây dựng",
      "Vụ án TRẦN VĂN PHÚC – Khiếu kiện Quyết định cấp Giấy chứng nhận quyền sử dụng đất và hành vi không giải quyết thủ tục đăng ký biến động đất đai của Văn phòng ĐKĐĐ",
      "Vụ án LÊ THỊ QUỲNH – Khiếu kiện quyết định kỷ luật buộc thôi việc TTV",
      "Vụ án HOÀNG VĂN SƠN – Khiếu kiện quyết định thu hồi giấy phép xây dựng dự án thương mại",
      "Vụ án PHẠM VĂN CƯỜNG – Khiếu kiện Quyết định thu hồi đất và phương án bồi thường tái định cư huyện Yên Dũng",
      "Vụ án HOÀNG VĂN MINH – Khiếu kiện Quyết định xử phạt vi phạm hành chính trong lĩnh vực đất đai TP Nha Trang",
      "Vụ án ĐINH XUÂN BÁCH – Khiếu kiện Quyết định cưỡng chế thu hồi đất và giải tỏa mặt bằng huyện Mê Linh",
      "Vụ án CÔNG TY TNHH PHƯƠNG ĐÔNG – Khiếu kiện Quyết định ấn định thuế và xử phạt vi phạm hành chính về thuế của Cục Thuế",
      "Vụ án NGUYỄN TIẾN DŨNG – Khiếu kiện hành vi hành chính từ chối cấp Giấy phép kinh doanh môi trường",
    ],
  },
  {
    loaiAn: "Kinh doanh thương mại",
    vuAnTitles: [
      "Vụ án CÔNG TY TNHH TẬP ĐOÀN THƯƠNG MẠI & XUẤT NHẬP KHẨU TOÀN CẦU – Tranh chấp hợp đồng mua bán hàng hóa quốc tế, mở L/C và bảo lãnh ngân hàng thanh toán",
      "Vụ án NGUYỄN VĂN THẮNG – Tranh chấp hợp đồng đại lý phân phối độc quyền",
      "Vụ án CÔNG TY CP ĐẦU TƯ & NĂNG LƯỢNG SẠCH – Tranh chấp giữa công ty với cổ đông về Nghị quyết Đại hội đồng cổ đông và quyền quản lý điều hành doanh nghiệp",
      "Vụ án PHẠM THỊ UYÊN – Tranh chấp hợp đồng thi công xây dựng công trình cảng biển",
      "Vụ án VŨ VĂN VIỆT – Tranh chấp hợp đồng dịch vụ logistics và vận tải đa phương thức quốc tế",
      "Vụ án CÔNG TY CP XÂY LẮP DẦU KHÍ – Tranh chấp hợp đồng tín dụng trung và dài hạn có bảo lãnh ngân hàng",
      "Vụ án CÔNG TY CP ĐẦU TƯ HẢI PHÁT – Tranh chấp hợp đồng hợp tác góp vốn đầu tư dự án khu nghỉ dưỡng sinh thái",
      "Vụ án NGÂN HÀNG TMCP NGOẠI THƯƠNG VIỆT NAM – Tranh chấp hợp đồng thế chấp tài sản bảo đảm và thu hồi nợ xấu",
      "Vụ án CÔNG TY TNHH MINH PHÁT – Tranh chấp hợp đồng gia công hàng may mặc xuất khẩu sang thị trường EU",
      "Vụ án CÔNG TY CỔ PHẦN CÔNG NGHỆ Á CHÂU – Tranh chấp hợp đồng chuyển giao công nghệ tự động hóa dây chuyền sản xuất",
    ],
  },
  {
    loaiAn: "Hôn nhân gia đình",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN XUÂN & TRẦN THỊ YẾN – Ly hôn, tranh chấp quyền trực tiếp nuôi 3 con nhỏ và chia khối tài sản chung gồm nhiều bất động sản và cổ phần doanh nghiệp",
      "Vụ án ĐỖ VĂN ZŨNG – Tranh chấp quyền nuôi con và thay đổi mức cấp dưỡng",
      "Vụ án PHẠM THỊ ÁNH – Tranh chấp chia tài sản chung của vợ chồng sau khi ly hôn có yếu tố nước ngoài",
      "Vụ án HOÀNG VĂN BÌNH – Xác định cha cho con và quyền hưởng thừa kế",
      "Vụ án LÊ THỊ CẨM – Tranh chấp thay đổi người trực tiếp nuôi con sau ly hôn",
      "Vụ án TRẦN ĐÌNH KHANG – Ly hôn và phân chia tài sản là cổ phần tại tập đoàn tài chính",
      "Vụ án NGUYỄN THỊ THU HÀ – Yêu cầu hủy kết hôn trái pháp luật và phân chia tài sản độc lập",
      "Vụ án VŨ HỒNG PHÚC – Tranh chấp phân chia tài sản là quyền sử dụng đất tạo lập trong thời kỳ hôn nhân",
      "Vụ án ĐẶNG HOÀNG NAM – Yêu cầu cấp dưỡng nuôi con chưa thành niên sau khi cha mẹ ly hôn",
      "Vụ án BÙI THỊ NGỌC – Tranh chấp xác nhận quan hệ mẹ con và thừa kế tài sản có yếu tố nước ngoài",
    ],
  },
  {
    loaiAn: "Lao động",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN ĐÀO – Tranh chấp về đơn phương chấm dứt hợp đồng lao động trái pháp luật, bồi thường tiền lương và trợ cấp thôi việc tại Công ty Liên doanh Nước ngoài",
      "Vụ án TRẦN THỊ THỦY – Tranh chấp kỷ luật sa thải chuyên gia kỹ thuật cấp cao",
      "Vụ án LÊ VĂN GIÁP – Tranh chấp bồi thường chi phí đào tạo và cam kết làm việc tối thiểu 5 năm",
      "Vụ án PHẠM THỊ HƯƠNG – Tranh chấp quyền lợi bảo hiểm xã hội, bảo hiểm y tế và tiền lương ngừng việc",
      "Vụ án VŨ VĂN ÍCH – Tranh chấp bồi thường tai nạn lao động và bệnh nghề nghiệp nặng",
      "Vụ án NGUYỄN VĂN TOÀN – Tranh chấp đơn phương chấm dứt HĐLĐ và bồi thường tổn thất thu nhập tại Hà Nội",
      "Vụ án ĐÀO THỊ MAI – Tranh chấp bảo hộ thai sản và chấm dứt HĐLĐ đối với lao động nữ",
      "Vụ án LÝ THÀNH LONG – Tranh chấp thỏa thuận bảo mật thông tin và không cạnh tranh (NDA/NCA)",
      "Vụ án PHAN VĂN HẬU – Tranh chấp chế độ trợ cấp mất việc làm khi tái cơ cấu doanh nghiệp",
      "Vụ án HOÀNG MỸ HẠNH – Tranh chấp tiền lương làm thêm giờ ban đêm và ngày nghỉ lễ tết",
    ],
  },
  {
    loaiAn: "Sở hữu trí tuệ",
    vuAnTitles: [
      "Vụ án CÔNG TY CP TẬP ĐOÀN CÔNG NGHỆ & TRUYỀN THÔNG SỐ – Tranh chấp bản quyền tác giả phần mềm quản trị doanh nghiệp và yêu cầu bồi thường thiệt hại 50 tỷ đồng",
      "Vụ án NGUYỄN VĂN KHIÊM – Xử lý vi phạm nhãn hiệu hàng hóa trong ngành mỹ phẩm",
      "Vụ án CÔNG TY TNHH DƯỢC PHẨM & VẬT TƯ Y TẾ – Tranh chấp quyền sở hữu công nghiệp đối với Bằng hộ chiếu sáng chế thuốc chữa bệnh độc quyền",
      "Vụ án PHẠM THỊ LIÊN – Vi phạm kiểu dáng công nghiệp bao bì sản phẩm xuất khẩu",
      "Vụ án HOÀNG VĂN NAM – Tranh chấp quyền đối với giống cây trồng mới lai tạo",
      "Vụ án CÔNG TY CP GIẢI TRÍ ĐIỆN ẢNH VÀNG – Tranh chấp quyền tác giả đối với kịch bản phim điện ảnh",
      "Vụ án CÔNG TY TNHH PHẦN MỀM TRÍ TUỆ NHÂN TẠO – Tranh chấp bí mật kinh doanh mã nguồn thuật toán",
      "Vụ án DOANH NGHIỆP TƯ NHÂN GỐM SỨ MINH LONG – Xâm phạm quyền bảo hộ nhãn hiệu nổi tiếng",
      "Vụ án CÔNG TY CP THỜI TRANG QUỐC TẾ – Tranh chấp quyền tác giả mẫu thiết kế thời trang ứng dụng",
      "Vụ án CÔNG TY CÔNG NGHỆ SINH HỌC XANH – Tranh chấp quyền đăng ký sáng chế gen vi sinh vật",
    ],
  },
  {
    loaiAn: "Phá sản",
    vuAnTitles: [
      "Vụ án CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG & THƯƠNG MẠI ĐẠI VIỆT – Yêu cầu mở thủ tục phá sản doanh nghiệp, thanh lý tài sản và phân chia thứ tự ưu tiên thanh toán nợ",
      "Vụ án CÔNG TY TNHH PHÁT TRIỂN HẠ TẦNG – Phá sản doanh nghiệp vận tải hành khách",
      "Vụ án HỢP TÁC XÃ NÔNG NGHIỆP & DỊCH VỤ TỔNG HỢP XANH – Giải quyết yêu cầu mở thủ tục phá sản hợp tác xã theo đề nghị của nhóm chủ nợ",
      "Vụ án LÊ VĂN PHONG – Phá sản Doanh nghiệp tư nhân chuỗi siêu thị bán lẻ",
      "Vụ án PHẠM THỊ QUANG – Yêu cầu tuyên bố phá sản công ty chứng khoán",
      "Vụ án CÔNG TY CP BẤT ĐỘNG SẢN THĂNG LONG – Yêu cầu mở thủ tục phá sản do mất khả năng thanh toán trái phiếu",
      "Vụ án CÔNG TY TNHH THÉP VIỆT NHẬT – Yêu cầu tuyên bố phá sản và xử lý nợ có bảo đảm của các tổ chức tín dụng",
      "Vụ án TỔNG CÔNG TY NÔNG SẢN XUẤT KHẨU MIỀN TÂY – Tuyên bố phá sản và phân chia tài sản cho người lao động",
      "Vụ án CÔNG TY CP HÓA CHẤT & DẦU KHÍ ĐÔNG Á – Mở thủ tục phục hồi hoạt động kinh doanh trước khi phá sản",
      "Vụ án HỢP TÁC XÃ VẬN TẢI THỦY BỘ MIỀN TRUNG – Tuyên bố phá sản hợp tác xã và thanh lý tài sản tàu thuyền",
    ],
  },
];

const THAM_PHAN_LIST = [
  "Đỗ Tất Thống",
  "Lê Thị Hoa",
  "Trần Minh Hải",
  "Nguyễn Thị Lan",
  "Cao Thị Mai",
  "Phạm Quốc Khánh",
  "Vũ Xuân Hiển",
  "Nguyễn Như Thắng",
  "Hoàng Thị Thu",
  "Lê Quang Vinh",
];
const CAP_THAM_PHAN_LIST = ["TPB3", "TPB2", "TPTC", "TPB1", "TPB3", "TPTC", "TPB2", "TPB1", "TPB3", "TPTC"];
/** Tòa đã ra bản án bị đề nghị GĐT/TT. Tòa đang đăng nhập là TAND thành phố Hà
 *  Nội nên chỉ có chính tòa này (phúc thẩm) và các TAND khu vực thuộc Hà Nội
 *  (sơ thẩm). Bản trước là danh mục của TANDTC — trải khắp các tỉnh, và có cả
 *  một mục vô nghĩa "TAND khu vực 1 - Hà Nội tại thành phố Hồ Chí Minh". */
const TOA_LIST = [
  "Tòa án nhân dân thành phố Hà Nội",
  "Tòa án nhân dân khu vực 1 - Hà Nội",
  "Tòa án nhân dân khu vực 2 - Hà Nội",
  "Tòa án nhân dân khu vực 3 - Hà Nội",
  "Tòa án nhân dân khu vực 4 - Hà Nội",
  "Tòa án nhân dân khu vực 5 - Hà Nội",
  "Tòa án nhân dân khu vực 6 - Hà Nội",
];
const NKN_LIST = [
  "Tổng Công ty Cổ phần Xây dựng & Khoáng sản Thương mại Miền Bắc",
  "Phạm Văn Tú",
  "Công ty TNHH Đầu tư & Phát triển Hạ tầng Giao thông Đô thị",
  "Trần Văn Khoa",
  "Vũ Thanh Tùng",
  "Nguyễn Thị Lan",
  "Phạm Văn Cường",
  "Lê Anh Tuấn",
  "Công ty Cổ phần Đầu tư Hải Phát",
  "Đặng Thị Dương",
];
const BICAO_LIST = [
  "Ủy ban nhân dân thành phố Thủ Đức (Người bị kiện)",
  "Hoàng Thị Minh",
  "Công ty Cổ phần Tập đoàn Quốc tế Á Châu",
  "Lý Thị Hồng",
  "Đỗ Hữu Bình",
  "Nguyễn Hữu Đức",
  "UBND huyện Yên Dũng",
  "Ngô Văn Quyết",
  "Nguyễn Thanh Sơn",
  "Hoàng Ngọc Hoa",
];
const NDD_LIST = [
  "Luật sư Trần Hữu Nam – Văn phòng Luật sư Trí Đức (Đoàn Luật sư TP. Hà Nội)",
  "Nguyễn Quốc Bảo",
  "Võ Thành Nhân",
  "Đặng Hoàng Nam",
  "Hoàng Mỹ Linh",
  "Luật sư Phan Thị Lan",
  "UBND Thành phố Hà Nội",
  "Luật sư Đặng Minh Tuấn",
  "Luật sư Vũ Ngọc Hùng",
  "Lập Thái Phúc",
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function buildCase(loaiIdx: number, recIdx: number, globalId: number): DonCase {
  const meta = LOAI_AN_META[loaiIdx];
  const loaiAn = meta.loaiAn;
  const vu = getVuByLoaiAn(loaiAn);
  const maVuAn = `VA26-${String(loaiIdx + 1).padStart(2, "0")}${pad2(recIdx + 1)}01`;
  const maDon = String(5100 + globalId);
  const thamPhan = THAM_PHAN_LIST[recIdx % THAM_PHAN_LIST.length];
  const capThamPhan = CAP_THAM_PHAN_LIST[recIdx % CAP_THAM_PHAN_LIST.length];
  const toa = TOA_LIST[recIdx % TOA_LIST.length];
  const nguoiKhieuNai = NKN_LIST[recIdx % NKN_LIST.length];
  const biCao = BICAO_LIST[recIdx % BICAO_LIST.length];
  const ndd = NDD_LIST[recIdx % NDD_LIST.length];
  const tenVuAn = meta.vuAnTitles[recIdx] || `Vụ án ${loaiAn} số ${recIdx + 1}`;
  const soCV = String(10 + recIdx + loaiIdx);
  const ngayCV = `${pad2((recIdx % 28) + 1)}/06/2026`;
  const SHORT_MAP: Record<string, string> = {
    "Hình sự": "HS",
    "Dân sự": "DS",
    "Hành chính": "HC",
    "Kinh doanh thương mại": "KDTM",
    "Hôn nhân gia đình": "HNGĐ",
    "Lao động": "LĐ",
    "Sở hữu trí tuệ": "SHTT",
    "Phá sản": "PS",
  };
  const shortCode = SHORT_MAP[loaiAn] || "HS";
  const capCode = recIdx % 3 === 0 ? "PT" : "ST";
  const soBA = `${pad2(recIdx + 1)}06/${shortCode}-${capCode}`;
  const ngayBA = `${pad2((recIdx % 28) + 1)}/06/2026`;
  const thuLyMoi = String(2330000 + globalId);

  // Phân bổ số lượng tag linh hoạt (1, 2-3, 4 label)
  let caseTags: string[] = [];
  if (loaiAn === "Hình sự") {
    if (recIdx % 5 === 0) caseTags = ["an-quoc-hoi", "an-chi-dao", "an-tvtn"];
    else if (recIdx % 5 === 1) caseTags = ["an-chi-dao", "an-quoc-hoi"];
    else if (recIdx % 5 === 2) caseTags = ["an-tvtn"];
    else if (recIdx % 5 === 3) caseTags = [];
    else caseTags = ["an-chi-dao"];
  } else {
    if (recIdx % 5 === 0) caseTags = ["an-quoc-hoi", "an-chi-dao"];
    else if (recIdx % 5 === 1) caseTags = ["an-chi-dao", "an-quoc-hoi"];
    else if (recIdx % 5 === 2) caseTags = ["an-chi-dao"];
    else if (recIdx % 5 === 3) caseTags = ["an-quoc-hoi"];
    else caseTags = ["an-chi-dao"];
  }

  let thoiHieu: string;
  if (loaiAn === "Hình sự") {
    thoiHieu = recIdx % 2 === 0 ? "1 năm" : "Không xác định thời hiệu";
  } else {
    thoiHieu = recIdx % 2 === 0 ? "3 năm" : "5 năm";
  }

  const base = {
    id: globalId,
    loaiAn,
    vu,
    thamPhan,
    capThamPhan,
    tags: caseTags,
    nguoiKhieuNai,
    biCao,
    ndd,
    soBA,
    ngayBA,
    toa,
    capXetXu: recIdx % 3 === 0 ? "Phúc thẩm" : "Sơ thẩm",
    thoiHieu,
  };

  // Phân bổ trường hợp trình Lãnh đạo & Trạng thái để test Badge màu
  const leadershipOptions = [
    { name: "Nguyễn Hòa Bình", role: "Chánh án TAND thành phố Hà Nội", decision: "thuy-moi" as const, date: "10/07/2026" },
    { name: "Nguyễn Văn Tiến", role: "Phó Chánh án TAND thành phố Hà Nội", decision: "khong-thu-ly" as const, date: "11/07/2026" },
    { name: "Nguyễn Thị Bình", role: "Trưởng phòng Vụ GD, KT I", decision: "thuy-moi" as const, date: "12/07/2026" },
    { name: "Trần Văn Hải", role: "Phó Trưởng phòng Vụ GD, KT I", decision: "khong-thu-ly" as const, date: "13/07/2026" },
    { name: "Đỗ Tất Thống", role: "Thẩm phán TAND thành phố Hà Nội", decision: "thuy-moi" as const, date: "14/07/2026" },
  ];

  const statusOptions: TrangThaiVuAn[] = [
    "don-cho-phe-duyet",
    "da-co-vu-an",
    "thong-bao-giai-quyet",
    "chua-co-hs",
    "don-cho-phe-duyet",
  ];

  const ttvList = ["Nguyễn Văn A", "Phạm Thị Minh", "Lê Văn Hùng", "Trịnh Đức Minh", "Hoàng Văn Tuấn"];

  const tpBac3List = ["Nguyễn Biên Thuỳ", "Trần Minh Đức", "Lê Văn Minh", "Chu Thị Thu Hiền", "Nguyễn Thị Hoa"];

  switch (recIdx % 5) {
    case 0:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "cho-y-kien", "don-cho-phe-duyet"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn đề nghị GĐT/TT",
        maVuAn,
        tenVuAn,
        thamPhan: tpBac3List[recIdx % tpBac3List.length],
        capThamPhan: "TPB3",
        ttv: ttvList[0],
        trangThai: statusOptions[0],
        yKienLD: [leadershipOptions[0], leadershipOptions[1]],
      };
    case 1:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "don-cho-phe-duyet"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn khiếu nại tư pháp tố tụng",
        maVuAn,
        tenVuAn,
        thamPhan: tpBac3List[(recIdx + 1) % tpBac3List.length],
        capThamPhan: "TPB3",
        ttv: ttvList[1],
        trangThai: statusOptions[1],
        vuAnActions: ["ghep-vu-an", "them-vu-an"],
        yKienLD: [leadershipOptions[1]],
        ...(recIdx % 2 === 1 && loaiIdx % 2 === 0 ? { daThuLy: true } : {}),
      };
    case 2:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "da-co-vu-an"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn đề nghị GĐT/TT",
        maVuAn,
        tenVuAn,
        thamPhan: tpBac3List[(recIdx + 2) % tpBac3List.length],
        capThamPhan: "TPB3",
        ttv: ttvList[2],
        trangThai: statusOptions[2],
        vuAnActions: ["chuyen-vu-an", "huy-ghep"],
        ngayNhan: `${10 + (recIdx % 10)}/6/2026`,
        yKienLD: [leadershipOptions[2]],
        daThuLy: true,
      };
    case 3:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "da-co-vu-an", "ho-so-khang-nghi"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "CV kiến nghị GĐT/TT",
        maVuAn,
        tenVuAn,
        thamPhan: tpBac3List[(recIdx + 3) % tpBac3List.length],
        capThamPhan: "TPB3",
        ttv: ttvList[3],
        trangThai: statusOptions[3],
        yKienLD: [leadershipOptions[3]],
        daThuLy: true,
      };
    default:
      const lyDoTraOptions = [
        "Đơn không thuộc thẩm quyền giải quyết theo thủ tục giám đốc thẩm, tái thẩm",
        "Người nộp đơn không có quyền khiếu nại theo quy định của Bộ luật Tố tụng",
        "Hết thời hiệu đề nghị xem xét bản án, quyết định theo thủ tục giám đốc thẩm",
        "Đơn trùng lặp, đã có thông báo trả lời giải quyết xong trước đó",
        "Hồ sơ đề nghị không bổ sung đủ các tài liệu, chứng cứ theo yêu cầu",
      ];
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "tra-lai"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn báo phát hiện vi phạm PL",
        maVuAn,
        tenVuAn,
        trangThai: statusOptions[4],
        thongBaoBoSung: "Thông báo trả lời đơn số 1",
        ttvGiaiQuyet: "Nguyễn Văn An",
        tpGiaiQuyet: "Đào Văn Nam",
        nguoiTra: "Trần Quốc Hải",
        ngayTra: `${14 + (recIdx % 10)}/6/2026`,
        lyDoTraLai: lyDoTraOptions[loaiIdx % lyDoTraOptions.length],
        yKienLD: [leadershipOptions[4]],
      };
  }
}

export const CASES: DonCase[] = LOAI_AN_META.flatMap((meta, loaiIdx) =>
  Array.from({ length: meta.vuAnTitles.length }, (_, recIdx) =>
    buildCase(loaiIdx, recIdx, loaiIdx * 10 + recIdx + 1),
  ),
);

export const TAB_CONFIG = [
  { id: "tat-ca", label: "Tất cả" },
  { id: "cho-y-kien", label: "Chờ xin ý kiến" },
  { id: "don-cho-phe-duyet", label: "Đơn chờ phê duyệt" },
  // { id: "ho-so-khang-nghi", label: "Hồ sơ kháng nghị" },
  { id: "da-co-vu-an", label: "Đã có vụ án" },
  { id: "tra-lai", label: "Trả lại" },
] as const;

export function filterCasesByRole(cases: DonCase[], userRole?: string): DonCase[] {
  if (!userRole || userRole === "toan-bo") return cases;
  if (userRole === "vu-1" || userRole === "hinh-su") return cases.filter((c) => c.loaiAn === "Hình sự");
  if (userRole === "vu-2" || userRole === "dan-su") return cases.filter((c) => c.loaiAn === "Dân sự");
  if (userRole === "vu-3" || userRole === "kdtm-ld")
    return cases.filter(
      (c) =>
        c.loaiAn === "Kinh doanh thương mại" ||
        c.loaiAn === "Phá sản" ||
        c.loaiAn === "Lao động" ||
        c.loaiAn === "Hôn nhân gia đình" ||
        c.loaiAn === "Sở hữu trí tuệ"
    );
  if (userRole === "vu-4" || userRole === "hanh-chinh") return cases.filter((c) => c.loaiAn === "Hành chính");
  return cases;
}

export function getCasesByTab(tab: TabId, userRole?: string): DonCase[] {
  const tabCases = CASES.filter((c) => c.tabs.includes(tab));
  return filterCasesByRole(tabCases, userRole);
}

export function countByTab(tab: TabId, userRole?: string): string {
  const n = getCasesByTab(tab, userRole).length;
  return String(n);
}

export function getCasesByLoaiAn(loaiAn: LoaiAn): DonCase[] {
  return CASES.filter((c) => c.loaiAn === loaiAn);
}

export function getCasesByVu(vu: VuPhuTrach): DonCase[] {
  return CASES.filter((c) => c.vu === vu);
}

// ─── Danh bạ nhân sự của tòa án đang đăng nhập (TAND thành phố Hà Nội) ───────
// Các ô tìm kiếm "Thẩm phán", "TTV giải quyết", "Lãnh đạo phụ trách"
// đều đổ từ đây, thay vì mỗi màn gõ một danh sách riêng — trước đây cùng một ô
// ở hai màn lại ra hai bộ tên khác nhau.

/** Thẩm phán của tòa án đang đăng nhập. */
export const THAM_PHAN_TOA = [
  "Nguyễn Biên Thuỳ",
  "Trần Minh Đức",
  "Lê Văn Minh",
  "Chu Thị Thu Hiền",
  "Trần Thị Lan",
  "Lê Hoàng Nam",
];

/** TTV của phòng tại tòa án đang đăng nhập. */
export const THAM_TRA_VIEN_PHONG = [
  "Lý Thái Phúc",
  "Vũ Biêu Thư",
  "Trần Thị Mai",
  "Vũ Xuân Hiển",
  "Đỗ Thị Thu Hằng",
  "Nguyễn Minh Tú",
];

/** Lãnh đạo phụ trách = Trưởng phòng và các Phó Trưởng phòng của phòng. */
export const LANH_DAO_PHU_TRACH = [
  "Nguyễn Văn Hùng – Trưởng phòng",
  "Nguyễn Thị Thu Hương – Phó Trưởng phòng",
  "Trần Quốc Hành – Phó Trưởng phòng",
];
