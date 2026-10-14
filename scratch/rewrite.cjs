const fs = require('fs');

const file = 'c:/Users/Gtel-Ict/Desktop/demo-hctp-main/app/gdt/QuanLyHoSoGiaoNhanView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the component name
content = content.replace(/function HoSoKhangNghiView/g, 'function QuanLyHoSoGiaoNhanView');
content = content.replace(/export default function SafeHoSoKhangNghiView/g, 'export default function SafeQuanLyHoSoGiaoNhanView');
content = content.replace(/<HoSoKhangNghiView /g, '<QuanLyHoSoGiaoNhanView ');

// We need to rewrite the main return statement.
// The main return statement starts at: return (\n    <ConfigProvider
const startIdx = content.indexOf('return (\n    <ConfigProvider');
const endIdx = content.lastIndexOf(');');

const newReturn = `return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, fontFamily: F, borderRadius: 6 } }}>
      <PageContainer 
        title="Quản lý hồ sơ giao nhận"
        header={{ breadcrumb: { items: [{title: 'Vụ án'}, {title: 'Giám đốc thẩm / Tái thẩm'}, {title: 'Quản lý hồ sơ giao nhận'}] } }}
        style={{ padding: 24 }}
      >
        <Card bordered={false} style={{ borderRadius: 8 }}>
          <Tabs
            defaultActiveKey="tong-hop"
            activeKey={tab}
            onChange={(k) => setTab(k)}
            items={[
              {
                key: "tong-hop",
                label: "Tổng hợp",
                children: (
                  <div>
                    <Radio.Group value={tongHopSubTab} onChange={e => setTongHopSubTab(e.target.value)} style={{ marginBottom: 16 }}>
                      <Radio.Button value="tat-ca">Tất cả ({(listTuHinhDen.length + listKNDen.length + listKNDi.length)})</Radio.Button>
                      <Radio.Button value="chua-nhan">Chưa tiếp nhận ({thuHinhChua})</Radio.Button>
                      <Radio.Button value="da-nhan">Đã tiếp nhận (0)</Radio.Button>
                      <Radio.Button value="da-tra">Đã trả lại (0)</Radio.Button>
                    </Radio.Group>
                    <Table 
                      columns={tongHopCols} 
                      dataSource={allRows} 
                      rowKey={r => r.loaiHoSo + r.id} 
                      pagination={{ pageSize: 10, showSizeChanger: true }}
                      size="middle"
                      scroll={{ y: "calc(100vh - 350px)" }}
                      bordered
                    />
                  </div>
                )
              },
              {
                key: "tu-hinh",
                label: "Hồ sơ tử hình",
                children: (
                  <div>
                    <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                      <Segmented 
                        options={[{label: 'Đến', value: 'den'}, {label: 'Đi', value: 'di'}]} 
                        value={tuHinhSubTab} 
                        onChange={(v) => setTuHinhSubTab(v)} 
                      />
                      <Space>
                        {tuHinhSubTab === 'den' && <Button type="primary" onClick={() => setShowNhapTay("tu-hinh")}>+ Thêm mới hồ sơ đến</Button>}
                        {tuHinhSubTab === 'den' && <Button style={{ color: "#0f7b52", borderColor: "#0f7b52" }}>✓ Nhận hồ sơ</Button>}
                        {tuHinhSubTab === 'den' && <Button danger onClick={() => setShowTraHoSo(true)}>↩ Trả hồ sơ</Button>}
                        {tuHinhSubTab === 'di' && <Button type="primary">Chuyển hồ sơ</Button>}
                        <Button>Xuất Excel</Button>
                      </Space>
                    </Space>
                    
                    <Radio.Group value="tat-ca" style={{ marginBottom: 16 }}>
                      <Radio value="tat-ca"><strong>Tất cả</strong> <Badge count={tuHinhSubTab === 'den' ? listTuHinhDen.length : 0} style={{ backgroundColor: RED }} /></Radio>
                      <Radio value="chua-xu-ly">{tuHinhSubTab === 'den' ? 'Chưa tiếp nhận' : 'Chưa chuyển'} <Badge count={tuHinhSubTab === 'den' ? thuHinhChua : 0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-xu-ly">{tuHinhSubTab === 'den' ? 'Đã tiếp nhận' : 'Đã chuyển'} <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-tra">Đã trả lại <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                    </Radio.Group>
                    
                    <Table 
                      rowSelection={tuHinhSubTab === 'den' ? { type: "checkbox" } : undefined}
                      columns={tuHinhCols} 
                      dataSource={tuHinhSubTab === 'den' ? listTuHinhDen : []} 
                      rowKey="id" 
                      pagination={{ pageSize: 10 }}
                      size="middle"
                      scroll={{ y: "calc(100vh - 400px)" }}
                      bordered
                    />
                  </div>
                )
              },
              {
                key: "cong-van",
                label: "Công văn trao đổi",
                children: (
                  <div>
                    <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                      <Segmented 
                        options={[{label: 'Đến', value: 'den'}, {label: 'Đi', value: 'di'}]} 
                        value={congVanSubTab} 
                        onChange={(v) => setCongVanSubTab(v)} 
                      />
                      <Space>
                        <Button type="primary">+ Thêm mới công văn</Button>
                        <Button style={{ color: "#0f7b52", borderColor: "#0f7b52" }}>✓ Nhận</Button>
                        <Button danger>↩ Trả lại</Button>
                        <Button>Xuất Excel</Button>
                      </Space>
                    </Space>
                    
                    <Radio.Group value="tat-ca" style={{ marginBottom: 16 }}>
                      <Radio value="tat-ca"><strong>Tất cả</strong> <Badge count={0} style={{ backgroundColor: RED }} /></Radio>
                      <Radio value="chua-xu-ly">Chưa tiếp nhận <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-xu-ly">Đã tiếp nhận <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-tra">Đã trả lại <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                    </Radio.Group>
                    
                    <Table 
                      rowSelection={{ type: "checkbox" }}
                      columns={[]} 
                      dataSource={[]} 
                      rowKey="id" 
                      pagination={{ pageSize: 10 }}
                      size="middle"
                      scroll={{ y: "calc(100vh - 400px)" }}
                      bordered
                    />
                  </div>
                )
              },
              {
                key: "khang-nghi",
                label: "Hồ sơ kháng nghị",
                children: (
                  <div>
                    <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                      <Segmented 
                        options={[{label: 'Đến', value: 'den'}, {label: 'Đi', value: 'di'}]} 
                        value={kNSubTab} 
                        onChange={(v) => setKNSubTab(v)} 
                      />
                      <Space>
                        {kNSubTab === "den" && <Button type="primary" onClick={() => setShowNhapTay("khang-nghi")}>Nhập tay (VKS/Khác)</Button>}
                        {kNSubTab === "den" && <Button style={{ color: "#0f7b52", borderColor: "#0f7b52" }} onClick={() => { const f = listKNDen.find(x => x.trangThai === "Chờ nhận"); if (f) handleNhanKNDen(f.id); }}>Nhận hồ sơ</Button>}
                        {kNSubTab === "den" && <Button danger onClick={() => setShowTraHoSo(true)}>Trả hồ sơ</Button>}
                        {kNSubTab === "di" && <Button type="default" onClick={() => onTaoCongVan?.()}>Tạo công văn chuyển</Button>}
                        {kNSubTab === "di" && <Button type="primary">Chuyển hồ sơ</Button>}
                        <Button>Xuất Excel</Button>
                      </Space>
                    </Space>

                    <Radio.Group value="tat-ca" style={{ marginBottom: 16 }}>
                      <Radio value="tat-ca"><strong>Tất cả</strong> <Badge count={kNSubTab === 'den' ? listKNDen.length : listKNDi.length} style={{ backgroundColor: RED }} /></Radio>
                      <Radio value="chua-xu-ly">{kNSubTab === 'den' ? 'Chưa tiếp nhận' : 'Chưa chuyển'} <Badge count={kNSubTab === 'den' ? knDenCho : 0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-xu-ly">{kNSubTab === 'den' ? 'Đã tiếp nhận' : 'Đã chuyển'} <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-tra">{kNSubTab === 'den' ? 'Đã trả lại' : 'Đã nhận lại'} <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                    </Radio.Group>

                    <Table 
                      rowSelection={{ type: "checkbox" }}
                      columns={kNSubTab === "den" ? knDenCols : knDiCols} 
                      dataSource={kNSubTab === "den" ? listKNDen : listKNDi} 
                      rowKey="id" 
                      pagination={{ pageSize: 10 }}
                      size="middle"
                      scroll={{ y: "calc(100vh - 400px)" }}
                      bordered
                    />
                  </div>
                )
              },
              {
                key: "xet-xu-lai",
                label: "Hồ sơ GĐT/TT xét xử lại",
                children: (
                  <div>
                    <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                      <Segmented 
                        options={[{label: 'Đi', value: 'di'}]} 
                        value="di" 
                      />
                      <Space>
                        <Button type="primary">Chuyển hồ sơ</Button>
                        <Button>Xuất Excel</Button>
                      </Space>
                    </Space>
                    
                    <Radio.Group value="tat-ca" style={{ marginBottom: 16 }}>
                      <Radio value="tat-ca"><strong>Tất cả</strong> <Badge count={listXetXuLai.length} style={{ backgroundColor: RED }} /></Radio>
                      <Radio value="chua-xu-ly">Chưa chuyển <Badge count={xxlChoXuLy} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-xu-ly">Đã chuyển <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                      <Radio value="da-nhan">Đã tiếp nhận <Badge count={0} color="#d9d9d9" style={{ color: '#000' }} /></Radio>
                    </Radio.Group>
                    
                    <Table 
                      columns={xxlCols} 
                      dataSource={listXetXuLai} 
                      rowKey="id" 
                      pagination={{ pageSize: 10 }}
                      size="middle"
                      scroll={{ y: "calc(100vh - 400px)" }}
                      bordered
                    />
                  </div>
                )
              }
            ]}
          />
        </Card>

        {showTuChoi && selectedRecord && <ModalTuChoiTiepNhan onClose={() => setShowTuChoi(false)} onConfirm={lyDo => handleTuChoiTuHinh(selectedRecord.id, lyDo)} />}
        {showNhapTay && <ModalNhapTayHoSoDen loaiHoSo={showNhapTay} onClose={() => setShowNhapTay(null)} onSave={data => {
          if (showNhapTay === "tu-hinh") {
            setListTuHinhDen(prev => [...prev, { id: data.id, maDon: \`TH-\${Date.now()}\`, soCongVan: data.soCongVan, ngayGui: data.ngayGui || "—", donViGui: data.tenDonVi, loaiDonVi: data.loaiDonVi, nguoiGui: data.nguoiGui, soBA: "—", toaRaBanAn: "—", tenBiAn: "—", trangThai: "Chưa tiếp nhận", ngayNhan: "--", nguoiNhan: "--" }]);
          } else {
            setListKNDen(prev => [...prev, { id: data.id, soHieuKN: data.soCongVan, ngayKN: data.ngayGui || "—", nguoiKN: data.nguoiGui, soBA: "—", toaRaBanAn: "—", donViGui: data.tenDonVi, ngayNhan: "--", nguoiNhan: "--", trangThai: "Chờ nhận" }]);
          }
          setShowNhapTay(null);
          alert("Đã lưu hồ sơ nhập tay!");
        }} />}
        {showTraHoSo && <ModalTraHoSo onClose={() => setShowTraHoSo(false)} onConfirm={lyDo => { setShowTraHoSo(false); alert("Đã trả lại hồ sơ.\\nLý do: " + lyDo); }} />}
        {showTrinhKy && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKy(false)} />}
      </PageContainer>
    </ConfigProvider>
  );`;

content = content.substring(0, startIdx) + newReturn + content.substring(endIdx + 2);

// Add state for new segments
content = content.replace('const [kNSubTab, setKNSubTab] = useState<"den" | "di">("den");', 'const [kNSubTab, setKNSubTab] = useState<"den" | "di">("den");\n  const [tuHinhSubTab, setTuHinhSubTab] = useState<"den" | "di">("den");\n  const [congVanSubTab, setCongVanSubTab] = useState<"den" | "di">("den");');
content = content.replace('const [tongHopSubTab, setTongHopSubTab] = useState("all");', 'const [tongHopSubTab, setTongHopSubTab] = useState("tat-ca");');

// Fix imports
content = content.replace('import { ConfigProvider, Table, Button, Tabs, Space, Tag, Input, Badge, Tooltip, Dropdown, MenuProps, Row, Col, Card, Statistic, Typography, Select } from "antd";', 'import { ConfigProvider, Table, Button, Tabs, Space, Tag, Input, Badge, Tooltip, Dropdown, MenuProps, Row, Col, Card, Statistic, Typography, Select, Segmented, Radio } from "antd";\nimport { PageContainer } from "@ant-design/pro-components";');

fs.writeFileSync(file, content);
