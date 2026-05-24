import React from 'react';

/**
 * Premium, minimalistic, professional loading spinner.
 * Features a dual-ring orbital animation with a breathing center dot
 * and clean, elegant status typography. Fully theme-aware.
 */
const AILoader = ({ size = 'default', text = 'Loading...', variant = 'pulse' }) => {
  const dimensions = {
    small: { outer: 28, inner: 20, dot: 4, stroke: 2 },
    default: { outer: 44, inner: 32, dot: 6, stroke: 2.5 },
    large: { outer: 60, inner: 44, dot: 8, stroke: 3 },
  };

  const textSizes = {
    small: 'text-[9px]',
    default: 'text-[10px]',
    large: 'text-[11px]',
  };

  const d = dimensions[size] || dimensions.default;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes loaderOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loaderOrbitReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes loaderBreathe {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes loaderTextFade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .loader-orbit-outer {
          animation: loaderOrbit 1.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .loader-orbit-inner {
          animation: loaderOrbitReverse 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .loader-breathe {
          animation: loaderBreathe 2s ease-in-out infinite;
        }
        .loader-text-pulse {
          animation: loaderTextFade 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative flex items-center justify-center" style={{ width: d.outer, height: d.outer }}>
        {/* Outer ring — clockwise */}
        <svg
          className="loader-orbit-outer absolute inset-0"
          width={d.outer}
          height={d.outer}
          viewBox={`0 0 ${d.outer} ${d.outer}`}
          fill="none"
        >
          <circle
            cx={d.outer / 2}
            cy={d.outer / 2}
            r={(d.outer - d.stroke) / 2}
            stroke="var(--primary)"
            strokeWidth={d.stroke}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * (d.outer - d.stroke) * 0.3} ${Math.PI * (d.outer - d.stroke) * 0.7}`}
            opacity="0.9"
          />
        </svg>

        {/* Inner ring — counter-clockwise */}
        <svg
          className="loader-orbit-inner absolute"
          width={d.inner}
          height={d.inner}
          viewBox={`0 0 ${d.inner} ${d.inner}`}
          fill="none"
          style={{ top: (d.outer - d.inner) / 2, left: (d.outer - d.inner) / 2 }}
        >
          <circle
            cx={d.inner / 2}
            cy={d.inner / 2}
            r={(d.inner - d.stroke) / 2}
            stroke="var(--primary)"
            strokeWidth={d.stroke * 0.75}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * (d.inner - d.stroke) * 0.25} ${Math.PI * (d.inner - d.stroke) * 0.75}`}
            opacity="0.35"
          />
        </svg>

        {/* Center breathing dot */}
        <div
          className="loader-breathe rounded-full"
          style={{
            width: d.dot,
            height: d.dot,
            backgroundColor: 'var(--primary)',
          }}
        />
      </div>

      {text && (
        <p className={`${textSizes[size]} loader-text-pulse font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default AILoader;