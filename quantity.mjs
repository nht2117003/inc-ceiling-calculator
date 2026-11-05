/**
 * Privacy-safe ceiling quantity rule for the public static calculator.
 * It intentionally contains no price, customer, quote, API, or admin data.
 */
export const PUBLIC_CEILING_BOARD_SPECS = Object.freeze({
  GYPSUM_9_5_900X1800: Object.freeze({ label: '석고보드 9.5T · 900×1,800mm', widthM: 0.9, lengthM: 1.8 }),
  GYPSUM_9_5_1200X2400: Object.freeze({ label: '석고보드 9.5T · 1,200×2,400mm', widthM: 1.2, lengthM: 2.4 }),
});

export function calculatePublicCeilingQuantity({ areaSquareMeters, boardSpec, layers, wasteRate }) {
  const errors = [];
  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters <= 0) errors.push('천장 면적은 0보다 큰 숫자로 입력하세요.');
  if (!Number.isInteger(layers) || ![1, 2].includes(layers)) errors.push('시공 겹수는 1겹 또는 2겹으로 선택하세요.');
  if (!Number.isFinite(wasteRate) || wasteRate < 0 || wasteRate > 0.3) errors.push('여유율은 0%~30% 범위에서 선택하세요.');
  const board = PUBLIC_CEILING_BOARD_SPECS[boardSpec];
  if (!board) errors.push('지원하지 않는 석고보드 규격입니다.');
  if (errors.length) return { ok: false, errors };

  const boardArea = board.widthM * board.lengthM;
  const theoreticalSheets = areaSquareMeters * layers * (1 + wasteRate) / boardArea;
  return {
    ok: true,
    areaSquareMeters,
    board,
    layers,
    wasteRate,
    boardArea,
    theoreticalSheets,
    quantity: Math.ceil(theoreticalSheets - 1e-9),
    formula: `면적 ${areaSquareMeters}㎡ × ${layers}겹 × (1+여유율 ${Math.round(wasteRate * 100)}%) ÷ 1장 면적 ${boardArea}㎡`,
    limitations: [
      '개구부, 단차, 곡면, 보강, 설비 간섭과 실제 도면 조건은 반영하지 않습니다.',
      '이 결과는 참고 수량이며 실제 발주 수량이나 최종 견적을 대신하지 않습니다.',
    ],
  };
}
