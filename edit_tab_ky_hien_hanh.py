import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# I will replace the TabKyHienHanh wrapper and Cards.

old_tab = """  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tìm kiếm */}
      <Card size="small" style={{ marginBottom: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 240 }}>
            <Nhan>Tìm theo họ tên</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Nhập họ tên thẩm phán..."
              value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          </div>
          <div style={{ width: 240 }}>
            <Nhan>Đơn vị</Nhan>
            <Select allowClear placeholder="Tất cả đơn vị" value={donVi} onChange={setDonVi} style={{ width: "100%" }}
              options={[uyBan.toaAn, ...TOA_CHUYEN_TRACH].map(d => ({ value: d, label: d }))} />
          </div>
          <div style={{ width: 180 }}>
            <Nhan>Loại thành viên</Nhan>
            <Select allowClear placeholder="Tất cả" value={loaiTV} onChange={setLoaiTV} style={{ width: "100%" }}
              options={[{ value: "dn", label: "Thành viên đương nhiên" }, { value: "cd", label: "Được chỉ định" }]} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTuKhoa(""); setDonVi(undefined); setLoaiTV(undefined); }}>Xóa lọc</Button>
        </div>
      </Card>

      {/* Thông tin kỳ */}
      <Card size="small" title="Thông tin kỳ hiệu lực" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}
        extra={dangNhap ? <Tag color="warning">Nháp</Tag> : <TagTrangThaiKy ky={ky} />}>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", padding: "4px 0" }}>
          <TruongXem w={240} nhan="Tòa án" giaTri={uyBan.toaAn} />
          {dangNhap ? <>
            <div style={{ width: 280 }}>
              <Nhan>Số quyết định của Chánh án TANDTC</Nhan>
              <Input placeholder="VD: 428/QĐ-TANDTC" value={nhap!.soQD} onChange={e => suaNhap({ soQD: e.target.value })} />
            </div>
            <div style={{ width: 200 }}>
              <Nhan>Ngày quyết định</Nhan>
              <DatePicker format={FMT} style={{ width: "100%" }} placeholder="dd/mm/yyyy"
                value={nhap!.ngayQD ? dayjs(nhap!.ngayQD, FMT) : null}
                onChange={(d: Dayjs | null) => suaNhap({ ngayQD: d ? d.format(FMT) : null })} />
            </div>
            <div style={{ width: 220 }}>
              <Nhan>Số lượng thành viên được duyệt</Nhan>
              <InputNumber min={1} style={{ width: "100%" }} value={nhap!.soDuocDuyet}
                onChange={v => suaNhap({ soDuocDuyet: v == null ? null : Number(v) })} />
            </div>
          </> : <>
            <TruongXem w={280} nhan="Quyết định của Chánh án TANDTC" giaTri={`${ky.soQD} · ${ky.ngayQD}`} />
            <TruongXem w={220} nhan="Số lượng thành viên được duyệt" giaTri={`${ky.soDuocDuyet} thành viên`} />
            <TruongXem w={240} nhan="Kỳ hiệu lực" giaTri={kyHieuLuc(ky)} />
          </>}
        </div>
        {chiXem && nhap && (
          <Alert type="info" showIcon style={{ marginTop: 10 }}
            title="Tòa đang lập kỳ mới (nháp) — chưa có hiệu lực, chưa hiển thị ở đây." />
        )}
      </Card>

      {/* Thành viên đương nhiên */}
      <Card size="small" styles={{ body: { padding: 0 } }}
        headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Thành viên đương nhiên <Text type="secondary" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
          tự nạp theo chức vụ — Điều 57
        </Text></>}
        extra={dangNhap && <Button icon={<Plus size={14} />} onClick={() => setSuaDN("moi")}>Thêm thành viên đương nhiên</Button>}>
        {!chiXem && soChanhAn !== 1 && (
          <Alert type="warning" showIcon banner
            title={soChanhAn === 0 ? "Chưa có Chánh án trong thành viên đương nhiên." : `Đang có ${soChanhAn} người giữ chức vụ Chánh án — kiểm tra lại.`} />
        )}
        <BangDuongNhien ds={dnHien} toaAn={uyBan.toaAn}
          onSua={dangNhap ? r => setSuaDN(r) : undefined}
          onXoa={dangNhap ? id => datDuongNhien(ds => ds.filter(d => d.id !== id)) : undefined} />
      </Card>

      {/* Thẩm phán được chỉ định */}
      <Card size="small" styles={{ body: { padding: 0 } }} title="Thẩm phán được chỉ định" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}
        extra={dangNhap && <Button icon={<Plus size={14} />} onClick={() => setChonCD(true)}>Chọn thẩm phán chỉ định</Button>}>
        <BangChiDinh ds={cdHien} onBo={dangNhap ? id => datChiDinh(ds => ds.filter(c => c.id !== id)) : undefined} />
      </Card>

      {/* Footer Nháp */}
      {dangNhap && (
        <div style={{ position: "sticky", bottom: -16, zIndex: 10, background: "#f8fafc", padding: "16px 20px", display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #e2e8f0", margin: "16px -16px -16px -16px", borderRadius: "0 0 8px 8px" }}>
          <Button onClick={boQuaNhap}>Xóa nháp (Hủy)</Button>
          <Button onClick={luuNhap} loading={dangLuu}>Lưu nháp</Button>
          <Button type="primary" onClick={apDungKy} loading={dangLuu}>Phê duyệt (Áp dụng kỳ mới)</Button>
        </div>
      )}"""

new_tab = """  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
              placeholder="Nhập họ tên thẩm phán..."
              className="w-full h-[30px] pl-7 pr-2 text-[12px] border border-surface-container rounded-[3px] focus:outline-none focus:border-error" />
          </div>
          <Select allowClear placeholder="Tất cả đơn vị" value={donVi} onChange={setDonVi} style={{ width: 180, height: 30 }}
            options={[uyBan.toaAn, ...TOA_CHUYEN_TRACH].map(d => ({ value: d, label: d }))} />
          <Select allowClear placeholder="Tất cả loại TV" value={loaiTV} onChange={setLoaiTV} style={{ width: 180, height: 30 }}
            options={[{ value: "dn", label: "Thành viên đương nhiên" }, { value: "cd", label: "Được chỉ định" }]} />
          
          <button onClick={() => { setTuKhoa(""); setDonVi(undefined); setLoaiTV(undefined); }}
            className="h-[30px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Thông tin kỳ */}
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <span>Thông tin kỳ hiệu lực</span>
            {dangNhap ? <Tag color="warning" style={{ margin: 0 }}>Nháp</Tag> : <TagTrangThaiKy ky={ky} />}
          </div>
          <div className="p-4 bg-white">
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", padding: "4px 0" }}>
              <TruongXem w={240} nhan="Tòa án" giaTri={uyBan.toaAn} />
              {dangNhap ? <>
                <div style={{ width: 280 }}>
                  <Nhan>Số quyết định của Chánh án TANDTC</Nhan>
                  <Input placeholder="VD: 428/QĐ-TANDTC" value={nhap!.soQD} onChange={e => suaNhap({ soQD: e.target.value })} />
                </div>
                <div style={{ width: 200 }}>
                  <Nhan>Ngày quyết định</Nhan>
                  <DatePicker format={FMT} style={{ width: "100%" }} placeholder="dd/mm/yyyy"
                    value={nhap!.ngayQD ? dayjs(nhap!.ngayQD, FMT) : null}
                    onChange={(d: Dayjs | null) => suaNhap({ ngayQD: d ? d.format(FMT) : null })} />
                </div>
                <div style={{ width: 220 }}>
                  <Nhan>Số lượng thành viên được duyệt</Nhan>
                  <InputNumber min={1} style={{ width: "100%" }} value={nhap!.soDuocDuyet}
                    onChange={v => suaNhap({ soDuocDuyet: v == null ? null : Number(v) })} />
                </div>
              </> : <>
                <TruongXem w={280} nhan="Quyết định của Chánh án TANDTC" giaTri={`${ky.soQD} · ${ky.ngayQD}`} />
                <TruongXem w={220} nhan="Số lượng thành viên được duyệt" giaTri={`${ky.soDuocDuyet} thành viên`} />
                <TruongXem w={240} nhan="Kỳ hiệu lực" giaTri={kyHieuLuc(ky)} />
              </>}
            </div>
            {chiXem && nhap && (
              <Alert type="info" showIcon style={{ marginTop: 10 }}
                title="Tòa đang lập kỳ mới (nháp) — chưa có hiệu lực, chưa hiển thị ở đây." />
            )}
          </div>
        </div>

        {/* Thành viên đương nhiên */}
        <div className="border-b border-surface-container bg-white">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <div>
              Thành viên đương nhiên
              <span className="text-outline text-[11.5px] ml-2 font-normal">tự nạp theo chức vụ — Điều 57</span>
            </div>
            {dangNhap && (
              <button onClick={() => setSuaDN("moi")} className="h-[28px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors flex items-center gap-1.5">
                <Plus size={12} /> Thêm thành viên
              </button>
            )}
          </div>
          <div>
            {!chiXem && soChanhAn !== 1 && (
              <Alert type="warning" showIcon banner
                title={soChanhAn === 0 ? "Chưa có Chánh án trong thành viên đương nhiên." : `Đang có ${soChanhAn} người giữ chức vụ Chánh án — kiểm tra lại.`} />
            )}
            <BangDuongNhien ds={dnHien} toaAn={uyBan.toaAn}
              onSua={dangNhap ? r => setSuaDN(r) : undefined}
              onXoa={dangNhap ? id => datDuongNhien(ds => ds.filter(d => d.id !== id)) : undefined} />
          </div>
        </div>

        {/* Thẩm phán được chỉ định */}
        <div className="border-b border-surface-container bg-white mb-20">
          <div className="px-4 py-2 border-b border-surface-container font-semibold text-[12px] text-on-surface-variant bg-[#fcfcfc] flex items-center justify-between">
            <span>Thẩm phán được chỉ định</span>
            {dangNhap && (
              <button onClick={() => setChonCD(true)} className="h-[28px] px-3 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors flex items-center gap-1.5">
                <Plus size={12} /> Chọn thẩm phán
              </button>
            )}
          </div>
          <div>
            <BangChiDinh ds={cdHien} onBo={dangNhap ? id => datChiDinh(ds => ds.filter(c => c.id !== id)) : undefined} />
          </div>
        </div>
      </div>

      {/* Footer Nháp */}
      {dangNhap && (
        <div className="px-4 py-3 border-t border-surface-container bg-surface-bright flex justify-end gap-2 shrink-0">
          <button onClick={boQuaNhap} className="h-[30px] px-4 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">Xóa nháp (Hủy)</button>
          <button onClick={luuNhap} disabled={dangLuu} className="h-[30px] px-4 border border-surface-container bg-white text-on-surface-variant rounded-[3px] text-[11.5px] hover:bg-surface-container-low transition-colors">Lưu nháp</button>
          <button onClick={apDungKy} disabled={dangLuu} className="h-[30px] px-4 bg-error text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616] transition-colors font-medium">Phê duyệt (Áp dụng kỳ mới)</button>
        </div>
      )}"""

c = c.replace(old_tab, new_tab)
c = c.replace(old_tab.replace('\n', '\r\n'), new_tab.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
