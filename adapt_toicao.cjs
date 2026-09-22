const fs = require('fs');

// 1. Read Tinh's component
let tinhContent = fs.readFileSync('scratch_toicao_tiepnhan.tsx', 'utf8');

// 2. Read Toi cao's original component to extract DON_SAMPLE
let toicaoContent = fs.readFileSync('app/toicao/components/TiepNhanDonLienThong.tsx', 'utf8');

const sampleStart = toicaoContent.indexOf('const DON_SAMPLE: DonTiepNhan[] = [');
const sampleEnd = toicaoContent.indexOf('];', sampleStart) + 2;
const toicaoSample = toicaoContent.substring(sampleStart, sampleEnd);

// 3. Replace Tinh's DON_SAMPLE with Toi cao's DON_SAMPLE
const tinhSampleStart = tinhContent.indexOf('const DON_SAMPLE: DonTiepNhan[] = [');
const tinhSampleEnd = tinhContent.indexOf('];', tinhSampleStart) + 2;
const tinhSample = tinhContent.substring(tinhSampleStart, tinhSampleEnd);

tinhContent = tinhContent.replace(tinhSample, toicaoSample);

// 4. Replace terminology
// Tinh uses: "Phân loại", "cho-phan-loai", "da-phan-loai", "canBoPhanLoai"
// Toicao uses: "Phân công", "cho-phan-cong", "da-phan-cong", "canBoTiepNhan"

// Special handling for the type definition
tinhContent = tinhContent.replace(/canBoPhanLoai: string;/g, 'canBoTiepNhan: string;');
tinhContent = tinhContent.replace(/"cho-phan-loai" \| "da-phan-loai"/g, '"cho-phan-cong" | "da-phan-cong"');

// Replace standard terms
tinhContent = tinhContent.replace(/Phân loại/g, 'Phân công');
tinhContent = tinhContent.replace(/phân loại/g, 'phân công');
tinhContent = tinhContent.replace(/cho-phan-loai/g, 'cho-phan-cong');
tinhContent = tinhContent.replace(/da-phan-loai/g, 'da-phan-cong');
tinhContent = tinhContent.replace(/canBoPhanLoai/g, 'canBoTiepNhan');
tinhContent = tinhContent.replace(/Phân Công/g, 'Phân công'); // just in case

// Fix specific UI text that should say "Tối cao" or reflect the specific Toi cao rules if any.
// In Toi cao, assigning is "Phân công cán bộ xử lý" rather than "Phân loại đơn".
tinhContent = tinhContent.replace(/Phân công đơn/g, 'Phân công cán bộ xử lý');

// Write out to the Toi cao file
fs.writeFileSync('app/toicao/components/TiepNhanDonLienThong.tsx', tinhContent, 'utf8');
console.log('Successfully updated app/toicao/components/TiepNhanDonLienThong.tsx');
