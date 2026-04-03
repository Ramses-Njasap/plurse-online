"use client";

const GridBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

      {/* Warm-neutral base */}
      <div className="absolute inset-0" style={{ background: "#FAFAF9" }} />

      {/* Fine dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(59, 130, 246, 0.12) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Primary glow — brand blue, top-center */}
      <div
        className="absolute"
        style={{
          top: "-15%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "680px", borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.09) 0%, rgba(96,165,250,0.05) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Secondary glow — sky blue, bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "-10%", left: "-8%",
          width: "640px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 72%)",
          filter: "blur(56px)",
        }}
      />

      {/* Tertiary glow — lighter blue, top-right */}
      <div
        className="absolute"
        style={{
          top: "-8%", right: "-6%",
          width: "560px", height: "420px", borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(147,197,253,0.08) 0%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Architectural hairline */}
      <div
        className="absolute inset-x-0"
        style={{
          top: "38vh", height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.1) 20%, rgba(59,130,246,0.15) 50%, rgba(59,130,246,0.1) 80%, transparent 100%)",
        }}
      />

      {/* Edge fades */}
      <div className="absolute inset-x-0 top-0" style={{ height: "200px", background: "linear-gradient(180deg, #FAFAF9 0%, transparent 100%)" }} />
      <div className="absolute inset-x-0 bottom-0" style={{ height: "280px", background: "linear-gradient(0deg,   #FAFAF9 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 left-0" style={{ width: "140px", background: "linear-gradient(90deg,  #FAFAF9 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 right-0" style={{ width: "140px", background: "linear-gradient(270deg, #FAFAF9 0%, transparent 100%)" }} />
    </div>
  );
};

export default GridBackground;