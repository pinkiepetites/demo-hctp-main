const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.from, r.to);
    }
    fs.writeFileSync(filePath, content);
}

// 1. roleConfig.ts
replaceInFile('app/roleConfig.ts', [
    {
        from: /\{ key: "TI-HCTP-CBTL", cap: "tinh", innerRole: "can-bo-thu-ly", label: "Cán bộ thụ lý", donVi: "Hành chính Tư pháp" \},/g,
        to: '{ key: "TI-HCTP-CBTL", cap: "tinh", innerRole: "can-bo-thu-ly", label: "Cán bộ tiếp nhận & thụ lý", donVi: "Hành chính Tư pháp" },'
    },
    {
        from: /\n\s*\{ key: "TI-HCTP-TCD", cap: "tinh", innerRole: "can-bo-tiep-cong-dan", label: "Cán bộ tiếp công dân", donVi: "Hành chính Tư pháp" \},/g,
        to: ''
    },
    {
        from: /key === "can-bo-tiep-cong-dan" \|\| /g,
        to: ''
    }
]);

// 2. AppSidebar.tsx
replaceInFile('app/components/AppSidebar.tsx', [
    {
        from: /if \(currentRole !== "can-bo-tiep-cong-dan" && currentRole !== "can-bo-thu-ly"\) \{/g,
        to: 'if (true) {'
    },
    {
        from: /"pho-vp", "can-bo-phan-loai", "can-bo-thu-ly", "can-bo-tiep-cong-dan"/g,
        to: '"pho-vp", "can-bo-phan-loai", "can-bo-thu-ly"'
    }
]);

// 3. AppTinh.tsx
replaceInFile('app/tinh/AppTinh.tsx', [
    {
        from: /"can-bo-tiep-cong-dan": "Cán bộ tiếp công dân",\n\s*/g,
        to: ''
    },
    {
        from: /"can-bo-thu-ly": "Cán bộ thụ lý",/g,
        to: '"can-bo-thu-ly": "Cán bộ tiếp nhận & thụ lý",'
    },
    {
        from: /\{currentRole !== "can-bo-tiep-cong-dan" && currentRole !== "can-bo-thu-ly" && \(/g,
        to: '{true && ('
    },
    {
        from: /"pho-vp", "can-bo-phan-loai", "can-bo-thu-ly", "can-bo-tiep-cong-dan"/g,
        to: '"pho-vp", "can-bo-phan-loai", "can-bo-thu-ly"'
    }
]);

console.log("Done");
