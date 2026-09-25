import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_layout = """  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, borderRadius: 6 } }}>
      <div className="flex-1 overflow-y-auto" style={{ background: "#ffffff" }}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Tiêu đề */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#1a1d21" }}>Cấu hình Ủy ban Thẩm phán</h1>
            {uyBan && (dangNhap ? <Tag color="warning">Nháp</Tag> : <Tag color="success">Có hiệu lực</Tag>)}
            <span style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text type="secondary" style={{ fontSize: 12.5 }}>Tòa án</Text>
              {laToiCao ? (
                <Select showSearch value={toaChon} style={{ width: 300 }}
                  onChange={v => { setToaChon(v); setTab("hien_hanh"); }}
                  optionFilterProp="label"
                  options={[
                    { value: TAT_CA, label: "Tất cả tỉnh/thành" },
                    ...TINH_THANH.map(t => ({ value: t, label: t })),
                  ]} />
              ) : (
                // Cấp tỉnh chỉ cấu hình Ủy ban của chính tòa mình
                <Select value={toaChon} disabled style={{ width: 260 }} options={[{ value: toaChon, label: toaChon }]} />
              )}
            </div>
          </div>"""

new_layout = """  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, borderRadius: 3 } }}>
      <div className="bg-white border border-surface-container rounded-[3px] overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-container-high bg-surface-bright shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] text-on-surface-variant mb-0.5">Quản trị hệ thống / <span className="font-medium text-on-surface-variant">Cấu hình Ủy ban Thẩm phán</span></div>
              <div className="text-[15px] font-bold text-tertiary">Cấu hình Ủy ban Thẩm phán</div>
            </div>
            {uyBan && (dangNhap ? <Tag color="warning" style={{ margin: 0 }}>Nháp</Tag> : <Tag color="success" style={{ margin: 0 }}>Có hiệu lực</Tag>)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-on-surface-variant">Tòa án</span>
            {laToiCao ? (
              <Select showSearch value={toaChon} style={{ width: 300 }}
                onChange={v => { setToaChon(v); setTab("hien_hanh"); }}
                optionFilterProp="label"
                options={[
                  { value: TAT_CA, label: "Tất cả tỉnh/thành" },
                  ...TINH_THANH.map(t => ({ value: t, label: t })),
                ]} />
            ) : (
              // Cấp tỉnh chỉ cấu hình Ủy ban của chính tòa mình
              <Select value={toaChon} disabled style={{ width: 260 }} options={[{ value: toaChon, label: toaChon }]} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">"""

c = c.replace(old_layout, new_layout)
c = c.replace(old_layout.replace('\n', '\r\n'), new_layout.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
