export function LumaSpin({ size = 65 }: { size?: number }) {
  const half = Math.round(size * 0.538) // ~35px at 65px
  return (
    <div className='relative aspect-square' style={{ width: size }}>
      <span className='absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-white/30 animate-luma-spin' />
      <span className='absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-white/30 animate-luma-spin [animation-delay:-1.25s]' />
      <style>{`
        @keyframes luma-spin {
          0%    { inset: 0 ${half}px ${half}px 0; }
          12.5% { inset: 0 ${half}px 0 0; }
          25%   { inset: ${half}px ${half}px 0 0; }
          37.5% { inset: ${half}px 0 0 0; }
          50%   { inset: ${half}px 0 0 ${half}px; }
          62.5% { inset: 0 0 0 ${half}px; }
          75%   { inset: 0 0 ${half}px ${half}px; }
          87.5% { inset: 0 0 ${half}px 0; }
          100%  { inset: 0 ${half}px ${half}px 0; }
        }
        .animate-luma-spin { animation: luma-spin 2.5s infinite; }
      `}</style>
    </div>
  )
}
