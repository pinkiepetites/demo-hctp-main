const fs = require('fs');

function addUseState(filePath, matchText) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Just find the block defining the hooks and inject it
  content = content.replace(
    /const \[currentRole, setCurrentRole\] = useState/,
    'const [isSidebarOpen, setIsSidebarOpen] = useState(true);\n  const [currentRole, setCurrentRole] = useState'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

try {
  addUseState('app/tinh/AppTinh.tsx');
  addUseState('app/toicao/AppToiCao.tsx');
} catch (e) {
  console.error(e);
}
