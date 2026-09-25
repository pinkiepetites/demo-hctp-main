import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_tabs = """          {!uyBan ? (
            <BangTongHop dsUyBan={dsUyBan} onChon={t => { setToaChon(t); setTab("hien_hanh"); }} />
          ) : (
            <Tabs activeKey={tab} onChange={setTab} tabBarStyle={{ borderBottom: "2px solid #f0f0f0", marginBottom: 20 }}
              tabBarExtraContent={(!laToiCao && !dangNhap) ? <Button type="primary" icon={<Plus size={14} />} onClick={lapKyMoi}>Lập kỳ mới</Button> : undefined}
              items={[
                {
                  key: "hien_hanh", label: "Kỳ hiện hành",
                  children: <TabKyHienHanh key={toaChon} uyBan={uyBan} chiXem={laToiCao} capNhat={capNhat}
                    onXemLichSu={() => setTab("lich_su")} />,
                },
                { key: "lich_su", label: "Lịch sử các kỳ", children: <TabLichSu key={toaChon} uyBan={uyBan} /> },
              ]} />
          )}"""

new_tabs = """          {!uyBan ? (
            <BangTongHop dsUyBan={dsUyBan} onChon={t => { setToaChon(t); setTab("hien_hanh"); }} />
          ) : (
            <div className="flex flex-col h-full gap-3">
              {/* Tabs */}
              <div className="flex items-end border-b border-surface-container px-4 pt-0.5 gap-0 bg-white -mx-4 -mt-4">
                {[
                  { key: "hien_hanh", label: "Kỳ hiện hành" },
                  { key: "lich_su", label: "Lịch sử các kỳ" },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`px-3.5 py-[8px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px outline-none ${tab === t.key
                      ? "border-error text-error bg-transparent"
                      : "border-transparent text-on-surface-variant hover:text-on-surface bg-transparent"
                      }`}>
                    {t.label}
                  </button>
                ))}
                <div className="flex-1 flex justify-end pb-1">
                  {(!laToiCao && !dangNhap) && (
                    <button onClick={lapKyMoi} className="h-[28px] px-3 bg-error text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616] flex items-center gap-1.5 transition-colors">
                      <Plus size={14} /> Lập kỳ mới
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {tab === "hien_hanh" && (
                  <TabKyHienHanh key={toaChon} uyBan={uyBan} chiXem={laToiCao} capNhat={capNhat} onXemLichSu={() => setTab("lich_su")} />
                )}
                {tab === "lich_su" && (
                  <TabLichSu key={toaChon} uyBan={uyBan} />
                )}
              </div>
            </div>
          )}"""

c = c.replace(old_tabs, new_tabs)
c = c.replace(old_tabs.replace('\n', '\r\n'), new_tabs.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
