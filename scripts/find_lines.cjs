const fs = require('fs');
const lines = fs.readFileSync('app/toicao/AppToiCao.tsx', 'utf8').split('\n');

const search = (str) => {
  const i = lines.findIndex(l => l.includes(str));
  console.log(`${str}: ${i + 1}`);
};

search('import { CapSwitcherPill }');
search('const DS_VAI_TRO');
search('const [view, setView] = useState');
search('activePage={view}');
search('view === "phancong"');
search('setQuanLyAnOpen(!quanLyAnOpen)');
search('setSidebarOpen(!sidebarOpen)');
