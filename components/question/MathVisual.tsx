'use client';

import type { MathVisualSpec } from '@/lib/math-visuals';

type MathVisualProps = { spec: MathVisualSpec };
const stroke = '#111827';
const muted = '#4b5563';

function Label({ x, y, children, mutedText = false }: { x: number; y: number; children: React.ReactNode; mutedText?: boolean }) {
  return <text x={x} y={y} fill={mutedText ? muted : stroke} fontSize="14" textAnchor="middle">{children}</text>;
}

function FractionPartBar({ spec }: MathVisualProps) {
  const denominator = Number(spec.data.denominator);
  const numerator = Number(spec.data.numerator);
  const width = 280 / denominator;
  return (
    <svg viewBox="0 0 420 120" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      <Label x={210} y={18}>已知分數</Label>
      <rect x="70" y="38" width="280" height="36" fill="white" stroke={stroke} strokeWidth="2" />
      {Array.from({ length: denominator - 1 }, (_, index) => <line key={index} x1={70 + width * (index + 1)} y1="38" x2={70 + width * (index + 1)} y2="74" stroke={stroke} />)}
      {Array.from({ length: numerator }, (_, index) => <rect key={index} x={70 + width * index + 2} y="40" width={width - 4} height="32" fill="#f3f4f6" />)}
      <Label x={210} y={101} mutedText>商：未標示</Label>
    </svg>
  );
}

function CircleRadiusDiameter({ spec }: MathVisualProps) {
  const radius = Number(spec.data.radius ?? spec.data.firstRadius ?? 1);
  const diameter = Number(spec.data.diameter ?? spec.data.secondRadius ?? 0);
  const showTwo = spec.data.firstRadius !== undefined;
  const circles = showTwo ? [Number(spec.data.firstRadius), Number(spec.data.secondRadius)] : [radius];
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      {circles.map((value, index) => {
        const cx = showTwo ? (index === 0 ? 130 : 290) : 210;
        const r = showTwo ? 44 : 52;
        const isDiameter = diameter > 0 && !showTwo;
        return <g key={value}>
          <circle cx={cx} cy="78" r={r} fill="white" stroke={stroke} strokeWidth="2" />
          <circle cx={cx} cy="78" r="3" fill={stroke} />
          <line x1={cx} y1="78" x2={cx + r} y2="78" stroke={stroke} strokeWidth="2" />
          <Label x={cx + r / 2} y={68}>{isDiameter ? `直徑 ${diameter} 公分` : `半徑 ${value} 公分`}</Label>
        </g>;
      })}
    </svg>
  );
}

function RatioParts({ spec }: MathVisualProps) {
  const rows = [Number(spec.data.firstParts), Number(spec.data.secondParts)];
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      {rows.map((parts, row) => <g key={row}>
        <Label x={35} y={52 + row * 55}>{row === 0 ? String(spec.data.firstLabel) : String(spec.data.secondLabel)}</Label>
        {Array.from({ length: parts }, (_, index) => <rect key={index} x={80 + index * 75} y={34 + row * 55} width="66" height="30" fill="white" stroke={stroke} strokeWidth="2" />)}
        {row === 0 && <Label x={80 + (parts * 75) / 2 - 7} y={54}>8 顆</Label>}
      </g>)}
    </svg>
  );
}

function GroupingArray({ spec }: MathVisualProps) {
  const groupCount = Number(spec.data.groupCount ?? 2);
  const label = String(spec.data.perGroup ?? spec.data.firstQuantity ?? '');
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      {Array.from({ length: groupCount }, (_, index) => <g key={index}>
        <rect x={40 + index * 92} y="45" width="74" height="48" fill="white" stroke={stroke} strokeWidth="2" strokeDasharray={spec.data.layout === 'unpartitioned' ? '5 5' : undefined} />
        {spec.data.layout !== 'unpartitioned' && <Label x={77 + index * 92} y={73}>{label}</Label>}
      </g>)}
      {spec.data.layout === 'unpartitioned' && <><Label x={210} y={25}>36 枝</Label><Label x={210} y={125}>48 枝</Label></>}
    </svg>
  );
}

function PlaceValueColumns({ spec }: MathVisualProps) {
  const digits = (spec.data.digits as readonly number[]) ?? [];
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      {String(spec.data.places).split('').map((place, index) => <g key={place}>
        <rect x={38 + index * 86} y="38" width="72" height="46" fill="white" stroke={stroke} strokeWidth="2" />
        <Label x={74 + index * 86} y={28}>{place}</Label>
        {digits[index] !== undefined && <Label x={74 + index * 86} y={68}>{digits[index]}</Label>}
      </g>)}
      <Label x={210} y={125} mutedText>答案欄留白</Label>
    </svg>
  );
}

function MeasurementRelation({ spec }: MathVisualProps) {
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      <rect x="55" y="45" width="120" height="45" fill="white" stroke={stroke} strokeWidth="2" />
      <rect x="245" y="45" width="120" height="45" fill="white" stroke={stroke} strokeWidth="2" />
      <Label x={115} y={73}>1 公分</Label>
      <Label x={305} y={73}>10 個 1 毫米</Label>
      <line x1="180" y1="67" x2="240" y2="67" stroke={stroke} strokeWidth="2" />
      <Label x={210} y={55}>=</Label>
      <Label x={210} y={125} mutedText>題目數值的合計留白</Label>
    </svg>
  );
}

function DecimalMeasureSegments({ spec }: MathVisualProps) {
  return (
    <svg viewBox="0 0 420 140" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      <line x1="40" y1="65" x2="380" y2="65" stroke={stroke} strokeWidth="4" />
      <Label x={210} y={35}>總長 {String(spec.data.total)} {String(spec.data.unit)}</Label>
      <rect x="80" y="80" width="95" height="22" fill="white" stroke={stroke} strokeWidth="2" />
      <Label x={127} y={97}>每段 {String(spec.data.segment)} {String(spec.data.unit)}</Label>
      <Label x={300} y={97} mutedText>完整段數與餘長未知</Label>
    </svg>
  );
}

function RectangleDimensions({ spec }: MathVisualProps) {
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      <rect x="95" y="42" width="230" height="65" fill="white" stroke={stroke} strokeWidth="2" />
      <Label x={210} y={32}>長 {String(spec.data.length)} {String(spec.data.unit)}</Label>
      <Label x={345} y={78}>寬 {String(spec.data.width)} {String(spec.data.unit)}</Label>
    </svg>
  );
}

function BarModel({ spec }: MathVisualProps) {
  return (
    <svg viewBox="0 0 420 150" role="img" aria-label={spec.accessibilityLabel} className="mt-5 h-auto w-full rounded-xl border border-gray-200 bg-white p-2">
      <Label x={95} y={35}>{String(spec.data.firstLabel)}</Label>
      <rect x="40" y="45" width="180" height="32" fill="white" stroke={stroke} strokeWidth="2" />
      <Label x={130} y={67}>{String(spec.data.firstQuantity)}</Label>
      <Label x={315} y={35}>{String(spec.data.addedLabel)}</Label>
      <rect x="230" y="45" width="150" height="32" fill="white" stroke={stroke} strokeWidth="2" />
      <Label x={305} y={67}>{String(spec.data.addedQuantity)}</Label>
      <rect x="115" y="95" width="190" height="30" fill="white" stroke={stroke} strokeWidth="2" strokeDasharray="5 5" />
      <Label x={210} y={115} mutedText>{String(spec.data.totalLabel)}</Label>
    </svg>
  );
}

export function MathVisual({ spec }: MathVisualProps) {
  switch (spec.type) {
    case 'FRACTION_PART_BAR': return <FractionPartBar spec={spec} />;
    case 'CIRCLE_RADIUS_DIAMETER': return <CircleRadiusDiameter spec={spec} />;
    case 'RATIO_PARTS': return <RatioParts spec={spec} />;
    case 'GROUPING_ARRAY': return <GroupingArray spec={spec} />;
    case 'PLACE_VALUE_COLUMNS': return <PlaceValueColumns spec={spec} />;
    case 'MEASUREMENT_RELATION': return <MeasurementRelation spec={spec} />;
    case 'DECIMAL_MEASURE_SEGMENTS': return <DecimalMeasureSegments spec={spec} />;
    case 'RECTANGLE_DIMENSIONS': return <RectangleDimensions spec={spec} />;
    case 'BAR_MODEL': return <BarModel spec={spec} />;
    default: return null;
  }
}
