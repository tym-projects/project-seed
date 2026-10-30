'use client';

import type { BarVisualData, CircleVisualData, DecimalVisualData, FractionVisualData, GroupingVisualData, MathVisualSpec, MeasurementVisualData, PlaceValueVisualData, RectangleVisualData } from '@/lib/math-visuals';
import { isMathVisualDataValid } from '@/lib/math-visuals';

type MathVisualProps = { spec: MathVisualSpec };
const stroke = '#111827';
const muted = '#4b5563';
function Label({ x, y, children, mutedText = false }: { x: number; y: number; children: React.ReactNode; mutedText?: boolean }) { return <text x={x} y={y} fill={mutedText ? muted : stroke} fontSize="14" textAnchor="middle">{children}</text>; }

function FractionPartBar({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('FRACTION_PART_BAR', spec.data)) return null;
  const data = spec.data as FractionVisualData;
  const fraction = data.quantityFraction;
  if (!fraction) return <svg viewBox="0 0 420 120" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><Label x={210} y={45}>全量 {data.wholeAmount} {data.wholeUnit}</Label><Label x={210} y={78}>每份 {data.divisorFraction?.numerator}/{data.divisorFraction?.denominator} {data.containerUnit}</Label><Label x={210} y={105} mutedText>結果：未標示</Label></svg>;
  const width = 280 / fraction.denominator;
  return <svg viewBox="0 0 420 120" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><Label x={210} y={18}>已知分數</Label><rect x="70" y="38" width="280" height="36" fill="white" stroke={stroke} strokeWidth="2" />{Array.from({ length: fraction.denominator - 1 }, (_, index) => <line key={index} x1={70 + width * (index + 1)} y1="38" x2={70 + width * (index + 1)} y2="74" stroke={stroke} />)}{Array.from({ length: fraction.numerator }, (_, index) => <rect key={index} x={70 + width * index + 2} y="40" width={width - 4} height="32" fill="#f3f4f6" />)}<Label x={210} y={101} mutedText>結果：未標示</Label></svg>;
}

function CircleRadiusDiameter({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('CIRCLE_RADIUS_DIAMETER', spec.data)) return null;
  const data = spec.data as CircleVisualData;
  const values = data.secondaryRadius === undefined ? [data.radius ?? data.diameter!] : [data.radius!, data.secondaryRadius];
  const isDiameter = data.diameter !== undefined && data.radius === undefined;
  return <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">{values.map((value, index) => { const cx = values.length === 2 ? (index === 0 ? 130 : 290) : 210; const r = values.length === 2 ? 44 : 52; return <g key={`${value}-${index}`}><circle cx={cx} cy="78" r={r} fill="white" stroke={stroke} strokeWidth="2" /><circle cx={cx} cy="78" r="3" fill={stroke} /><line x1={isDiameter ? cx - r : cx} y1="78" x2={cx + r} y2="78" stroke={stroke} strokeWidth="2" /><Label x={isDiameter ? cx : cx + r / 2} y={68}>{isDiameter ? `直徑 ${value} ${data.unit}` : `半徑 ${value} ${data.unit}`}</Label>{index === 0 && data.contextLabel && <Label x={cx} y={135} mutedText>{data.contextLabel}</Label>}</g>; })}</svg>;
}

function GroupingArray({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('GROUPING_ARRAY', spec.data)) return null;
  const data = spec.data as GroupingVisualData;
  if (data.layout === 'neutral-unpartitioned') return <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><Label x={210} y={45}>{data.firstLabel ?? '已知數量'}：{data.firstQuantity}</Label><Label x={210} y={82}>{data.secondLabel ?? '已知數量'}：{data.secondQuantity}</Label><Label x={210} y={125} mutedText>分組結果未標示</Label></svg>;
  return <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">{Array.from({ length: data.groupCount! }, (_, index) => <g key={index}><rect x={40 + index * 92} y="45" width="74" height="48" fill="white" stroke={stroke} strokeWidth="2" /><Label x={77 + index * 92} y={73}>{data.perGroup}</Label></g>)}<Label x={210} y={125} mutedText>總數：未標示</Label></svg>;
}

function PlaceValueColumns({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('PLACE_VALUE_COLUMNS', spec.data)) return null;
  const data = spec.data as PlaceValueVisualData;
  const rows = data.addends ? data.addends.map((value) => String(value).padStart(4, '0').split('').map(Number)) : [data.digits!];
  return <svg viewBox="0 0 420 190" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">{data.places.split('').map((place, index) => <g key={place}><Label x={74 + index * 86} y={28}>{place}</Label>{rows.map((row, rowIndex) => <g key={rowIndex}><rect x={38 + index * 86} y={38 + rowIndex * 48} width="72" height="40" fill="white" stroke={stroke} strokeWidth="2" />{row[index] !== undefined && <Label x={74 + index * 86} y={64 + rowIndex * 48}>{row[index]}</Label>}</g>)}</g>)}<Label x={210} y={rows.length > 1 ? 165 : 125} mutedText>進位與答案留白</Label></svg>;
}

function MeasurementRelation({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('MEASUREMENT_RELATION', spec.data)) return null;
  const data = spec.data as MeasurementVisualData;
  const format = (value: { centimeters: number; millimeters: number }) => `${value.centimeters} 公分 ${value.millimeters} 毫米`;
  return <svg viewBox="0 0 420 170" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">{data.showMeasurements ? <><rect x="35" y="32" width="165" height="45" fill="white" stroke={stroke} strokeWidth="2" /><Label x={117} y={60}>{format(data.firstMeasurement)}</Label>{data.secondMeasurement && <><rect x="220" y="32" width="165" height="45" fill="white" stroke={stroke} strokeWidth="2" /><Label x={302} y={60}>{format(data.secondMeasurement)}</Label></>}</> : <><rect x="55" y="45" width="120" height="45" fill="white" stroke={stroke} strokeWidth="2" /><rect x="245" y="45" width="120" height="45" fill="white" stroke={stroke} strokeWidth="2" /></>}<Label x={210} y={data.showMeasurements ? 105 : 67}>1 公分 = 10 毫米</Label><Label x={210} y={data.showMeasurements ? 140 : 125} mutedText>合計結果：未標示</Label></svg>;
}

function DecimalMeasureSegments({ spec }: MathVisualProps) {
  if (!isMathVisualDataValid('DECIMAL_MEASURE_SEGMENTS', spec.data)) return null;
  const data = spec.data as DecimalVisualData;
  return <svg viewBox="0 0 420 140" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><line x1="40" y1="65" x2="380" y2="65" stroke={stroke} strokeWidth="4" /><Label x={210} y={35}>總長 {data.total} {data.unit}</Label><rect x="80" y="80" width="95" height="22" fill="white" stroke={stroke} strokeWidth="2" /><Label x={127} y={97}>每段 {data.segment} {data.unit}</Label><Label x={300} y={97} mutedText>段數與餘長未知</Label></svg>;
}

function RectangleDimensions({ spec }: MathVisualProps) { if (!isMathVisualDataValid('RECTANGLE_DIMENSIONS', spec.data)) return null; const data = spec.data as RectangleVisualData; return <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><rect x="95" y="42" width="230" height="65" fill="white" stroke={stroke} strokeWidth="2" /><Label x={210} y={32}>長 {data.length} {data.unit}</Label><Label x={345} y={78}>寬 {data.width} {data.unit}</Label></svg>; }
function BarModel({ spec }: MathVisualProps) { if (!isMathVisualDataValid('BAR_MODEL', spec.data)) return null; const data = spec.data as BarVisualData; return <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2"><Label x={95} y={35}>{data.firstLabel}</Label><rect x="40" y="45" width="180" height="32" fill="white" stroke={stroke} strokeWidth="2" /><Label x={130} y={67}>{data.firstQuantity}</Label><Label x={315} y={35}>{data.secondLabel}</Label><rect x="230" y="45" width="150" height="32" fill="white" stroke={stroke} strokeWidth="2" /><Label x={305} y={67}>{data.secondQuantity}</Label><rect x="115" y="95" width="190" height="30" fill="white" stroke={stroke} strokeWidth="2" strokeDasharray="5 5" /><Label x={210} y={115} mutedText>{data.resultLabel}</Label></svg>; }

export function MathVisual({ spec }: MathVisualProps) { switch (spec.type) { case 'FRACTION_PART_BAR': return <FractionPartBar spec={spec} />; case 'CIRCLE_RADIUS_DIAMETER': return <CircleRadiusDiameter spec={spec} />; case 'GROUPING_ARRAY': return <GroupingArray spec={spec} />; case 'PLACE_VALUE_COLUMNS': return <PlaceValueColumns spec={spec} />; case 'MEASUREMENT_RELATION': return <MeasurementRelation spec={spec} />; case 'DECIMAL_MEASURE_SEGMENTS': return <DecimalMeasureSegments spec={spec} />; case 'RECTANGLE_DIMENSIONS': return <RectangleDimensions spec={spec} />; case 'BAR_MODEL': return <BarModel spec={spec} />; default: return null; } }
