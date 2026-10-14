import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove Lập kỳ mới button from TabKyHienHanh
old_btn = """        </> : <>
          <Button icon={<Clock size={14} />} onClick={onXemLichSu}>Xem lịch sử các kỳ</Button>
          <span style={{ flex: 1 }} />
          {!chiXem && <Button type="primary" icon={<Plus size={14} />} onClick={lapKyMoi}>Lập kỳ mới</Button>}
        </>}"""
new_btn = """        </> : <>
          <Button icon={<Clock size={14} />} onClick={onXemLichSu}>Xem lịch sử các kỳ</Button>
          <span style={{ flex: 1 }} />
        </>}"""
c = c.replace(old_btn, new_btn)
c = c.replace(old_btn.replace('\n', '\r\n'), new_btn.replace('\n', '\r\n'))

# 2. Add lapKyMoi and tabBarExtraContent to CauHinhUyBanThamPhan
old_tabs = """  const dangNhap = !laToiCao && !!uyBan?.nhap;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, borderRadius: 6 } }}>"""

new_tabs = """  const dangNhap = !laToiCao && !!uyBan?.nhap;

  const lapKyMoi = () => {
    if (uyBan) {
      capNhat(u => ({
        ...u, nhap: {
          soQD: "", ngayQD: null, soDuocDuyet: null,
          duongNhien: u.kyHienHanh.duongNhien.slice(), chiDinh: u.kyHienHanh.chiDinh.slice(),
        },
      }));
      setTab("hien_hanh");
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: RED, borderRadius: 6 } }}>"""
c = c.replace(old_tabs, new_tabs)
c = c.replace(old_tabs.replace('\n', '\r\n'), new_tabs.replace('\n', '\r\n'))

old_render_tabs = """          {!uyBan ? (
            <BangTongHop dsUyBan={dsUyBan} onChon={t => { setToaChon(t); setTab("hien_hanh"); }} />
          ) : (
            <Tabs activeKey={tab} onChange={setTab}
              items={["""

new_render_tabs = """          {!uyBan ? (
            <BangTongHop dsUyBan={dsUyBan} onChon={t => { setToaChon(t); setTab("hien_hanh"); }} />
          ) : (
            <Tabs activeKey={tab} onChange={setTab}
              tabBarExtraContent={(!laToiCao && !dangNhap) ? <Button type="primary" icon={<Plus size={14} />} onClick={lapKyMoi}>Lập kỳ mới</Button> : undefined}
              items={["""
c = c.replace(old_render_tabs, new_render_tabs)
c = c.replace(old_render_tabs.replace('\n', '\r\n'), new_render_tabs.replace('\n', '\r\n'))


with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
