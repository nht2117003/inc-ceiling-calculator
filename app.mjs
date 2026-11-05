import { calculatePublicCeilingQuantity } from './quantity.mjs';
import { OFFICIAL_INC_HOME_URL } from './public-links.mjs';

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function inputModel() {
  return {
    areaSquareMeters: Number($('area').value),
    boardSpec: $('board-spec').value,
    layers: Number($('layers').value),
    wasteRate: Number($('waste-rate').value),
  };
}

function render(result) {
  if (!result.ok) {
    $('result').innerHTML = `<h2>입력 확인 필요</h2><ul>${result.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>`;
    return;
  }
  $('result').innerHTML = `<h2>계산 결과</h2><div class="result-number"><span>석고보드 참고 수량</span><strong>${result.quantity}장</strong></div><dl><div><dt>천장 면적</dt><dd>${result.areaSquareMeters}㎡</dd></div><div><dt>적용 보드</dt><dd>${escapeHtml(result.board.label)}</dd></div><div><dt>시공 겹수</dt><dd>${result.layers}겹</dd></div><div><dt>여유율</dt><dd>${Math.round(result.wasteRate * 100)}%</dd></div></dl><p class="formula">${escapeHtml(result.formula)} = ${result.theoreticalSheets.toFixed(2)}장 → 장 단위 올림</p><ul class="caution">${result.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

if (OFFICIAL_INC_HOME_URL) {
  $('inc-home').outerHTML = `<p id="inc-home"><a href="${escapeHtml(OFFICIAL_INC_HOME_URL)}" rel="noopener">주식회사 아이엔씨 공식 홈페이지</a></p>`;
}

$('calculator-form').addEventListener('submit', (event) => {
  event.preventDefault();
  render(calculatePublicCeilingQuantity(inputModel()));
});
