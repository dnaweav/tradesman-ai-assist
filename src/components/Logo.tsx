
import * as React from "react";

export function Logo({ size = 36 }: { size?: number }) {
  // Placeholder British trades van + speech bubble
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="block" fill="none">
      <rect x={4} y={12} width={38} height={18} rx={4} fill="#3b9fe6" />
      <rect x={12} y={18} width={12} height={9} rx={2} fill="#ffc000" />
      <circle cx={10} cy={32} r={3} fill="#333333" />
      <circle cx={34} cy={32} r={3} fill="#333333" />
      <rect x={26} y={19} width={11} height={4} rx={1} fill="#eaeaea" />
      <ellipse cx={41} cy={15} rx={3} ry={2.8} fill="#eaeaea" />
      <path d="M12 42c9-1 15 2 16-3" stroke="#333" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
