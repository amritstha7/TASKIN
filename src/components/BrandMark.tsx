import React from 'react';

/** App logo mark: a bold "T" on a solid dark-orange rounded square. */
export const BrandMark: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ height: size, width: size, borderRadius: size * 0.28, backgroundColor: '#E04800' }}
    >
      <span className="font-black text-white" style={{ fontSize: size * 0.52, lineHeight: 1 }}>
        T
      </span>
    </div>
  );
};
