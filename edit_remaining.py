import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update TabLichSu
old_tab_lich_su = """  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 180 }}>
            <Nhan>Trạng thái kỳ</Nhan>
            <Select allowClear placeholder="Tất cả" value={trangThai} onChange={setTrangThai} style={{ width: "100%" }}
              options={[{ value: "mo", label: "Có hiệu lực" }, { value: "dong", label: "Hết hiệu lực" }]} />
          </div>
          <div style={{ width: 160 }}>
            <Nhan>Hiệu lực từ ngày</Nhan>
            <DatePicker format={FMT} value={tuNgay} onChange={setTuNgay} style={{ width: "100%" }} />
          </div>
          <div style={{ width: 160 }}>
            <Nhan>Hiệu lực đến ngày</Nhan>
            <DatePicker format={FMT} value={denNgay} onChange={setDenNgay} style={{ width: "100%" }} />
          </div>
          <div style={{ width: 250 }}>
            <Nhan>Số quyết định</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Số QĐ của Chánh án TANDTC..."
              value={soQD} onChange={e => setSoQD(e.target.value)} />
          </div>
          <div style={{ width: 200 }}>
            <Nhan>Tên thẩm phán</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Tên thành viên Ủy ban..."
              value={tenTP} onChange={e => setTenTP(e.target.value)} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTrangThai(undefined); setTuNgay(null); setDenNgay(null); setSoQD(""); setTenTP(""); }}>Xóa lọc</Button>
        </div>
      </Card>

      <Card size="small" styles={{ body: { padding: 0 } }}
        headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Các kỳ hiệu lực của Ủy ban Thẩm phán <Text type="secondary" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>{uyBan.toaAn}</Text></>}>
        <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false}
          locale={{ emptyText: "Không có kỳ nào khớp điều kiện" }} />
      </Card>

      <Alert type="info" showIcon icon={<Clock size={16} />}
        title={<>Kỳ đã đóng <b>không sửa được</b>. Biên bản phiên họp tra thành viên theo ngày họp, nên thành viên của kỳ cũ phải giữ nguyên — kể cả khi cán bộ đã chuyển công tác hoặc đổi chức vụ.</>} />

      <ModalXemKy ky={xem} toaAn={uyBan.toaAn} onDong={() => setXem(null)} />
    </div>
  );"""

new_tab_lich_su = """  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select allowClear placeholder="Trạng thái kỳ" value={trangThai} onChange={setTrangThai} style={{ width: 150, height: 30 }}
            options={[{ value: "mo", label: "Có hiệu lực" }, { value: "dong", label: "Hết hiệu lực" }]} />
          
          <DatePicker format={FMT} value={tuNgay} onChange={setTuNgay} placeholder="Hiệu lực từ" style={{ width: 140, height: 30 }} />
          <DatePicker format={FMT} value={denNgay} onChange={setDenNgay} placeholder="Hiệu lực đến" style={{ width: 140, height: 30 }} />

          <div className="relative flex-1 max-w-[200px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={soQD} onChange={e => setSoQD(e.target.value)}
              placeholder="Số QĐ của Chánh án..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>

          <div className="relative flex-1 max-w-[200px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={tenTP} onChange={e => setTenTP(e.target.value)}
              placeholder="Tên thẩm phán..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>
          
          <button onClick={() => { setTrangThai(undefined); setTuNgay(null); setDenNgay(null); setSoQD(""); setTenTP(""); }}
            className="h-[30px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <div>
              Các kỳ hiệu lực của Ủy ban Thẩm phán <span className="text-outline text-[11.5px] ml-1 font-normal">{uyBan.toaAn}</span>
            </div>
          </div>
          <div>
            <Table rowKey="id" size="middle" columns={cot} dataSource={ds} pagination={false}
              locale={{ emptyText: "Không có kỳ nào khớp điều kiện" }} bordered={false} />
          </div>
        </div>
        
        <div className="p-4">
          <Alert type="info" showIcon icon={<Clock size={16} />}
            title={<span className="text-[13px]">Kỳ đã đóng <b>không sửa được</b>. Biên bản phiên họp tra thành viên theo ngày họp, nên thành viên của kỳ cũ phải giữ nguyên — kể cả khi cán bộ đã chuyển công tác hoặc đổi chức vụ.</span>} />
        </div>
      </div>

      <ModalXemKy ky={xem} toaAn={uyBan.toaAn} onDong={() => setXem(null)} />
    </div>
  );"""

# Update BangTongHop
old_bang_tong_hop = """  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 280 }}>
            <Nhan>Tìm tòa án</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Nhập tên tỉnh/thành..."
              value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          </div>
          <div style={{ width: 220 }}>
            <Nhan>Tình trạng</Nhan>
            <Select allowClear placeholder="Tất cả" value={trangThai} onChange={setTrangThai} style={{ width: "100%" }}
              options={[
                { value: "on_dinh", label: "Ổn định" },
                { value: "nhap", label: "Đang lập kỳ mới" },
              ]} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTuKhoa(""); setTrangThai(undefined); }}>Xóa lọc</Button>
        </div>
      </Card>

      <Card size="small" styles={{ body: { padding: 0 } }}
        headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Ủy ban Thẩm phán các tỉnh/thành <Text type="secondary" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
          {dsUyBan.length} Ủy ban · {tongTV} thành viên · {dsUyBan.filter(u => u.nhap).length} đang lập kỳ mới
        </Text></>}>
        <Table rowKey="toaAn" size="middle" columns={cot} dataSource={ds}
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: t => `${t} Ủy ban` }} />
      </Card>
    </div>
  );"""

new_bang_tong_hop = """  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
              placeholder="Nhập tên tỉnh/thành..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>
          
          <Select allowClear placeholder="Tình trạng" value={trangThai} onChange={setTrangThai} style={{ width: 180, height: 30 }}
            options={[
              { value: "on_dinh", label: "Ổn định" },
              { value: "nhap", label: "Đang lập kỳ mới" },
            ]} />
          
          <button onClick={() => { setTuKhoa(""); setTrangThai(undefined); }}
            className="h-[30px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <div>
              Ủy ban Thẩm phán các tỉnh/thành
              <span className="text-outline text-[11.5px] ml-2 font-normal">
                {dsUyBan.length} Ủy ban · {tongTV} thành viên · {dsUyBan.filter(u => u.nhap).length} đang lập kỳ mới
              </span>
            </div>
          </div>
          <div>
            <Table rowKey="toaAn" size="middle" columns={cot} dataSource={ds} bordered={false}
              pagination={{ pageSize: 10, showSizeChanger: false, showTotal: t => `${t} Ủy ban` }} />
          </div>
        </div>
      </div>
    </div>
  );"""

c = c.replace(old_tab_lich_su, new_tab_lich_su)
c = c.replace(old_tab_lich_su.replace('\n', '\r\n'), new_tab_lich_su.replace('\n', '\r\n'))
c = c.replace(old_bang_tong_hop, new_bang_tong_hop)
c = c.replace(old_bang_tong_hop.replace('\n', '\r\n'), new_bang_tong_hop.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
