"use client";

import dynamic from "next/dynamic";

const MiningGame3D = dynamic(() => import("@/components/MiningGame3D"), {
  ssr: false,
  loading: () => <div className="embed-loading">Đang tải game 3D…</div>,
});

export default function ChemistryMiningEmbedPage() {
  return (
    <main className="mining-embed">
      <header>
        <span>GAME HỌC TẬP THREE.JS</span>
        <h1>Đào Hóa Trị 3D</h1>
        <p>Thu thập tinh thể, đọc ký hiệu và ghi nhớ hóa trị qua tương tác trực quan.</p>
      </header>
      <MiningGame3D width={960} height={560} difficulty="normal" />
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #0a1f2e; }
        body { font-family: "Be Vietnam Pro", system-ui, sans-serif; color: #fff; }
        .mining-embed { min-height: 100dvh; padding: 18px; background: radial-gradient(circle at 50% 0, #163f5b, #0a1f2e 58%); }
        .mining-embed > header { max-width: 960px; margin: 0 auto 14px; }
        .mining-embed > header span { color: #64dcff; font-size: 11px; font-weight: 900; letter-spacing: .12em; }
        .mining-embed > header h1 { margin: 5px 0 2px; font-size: clamp(24px, 5vw, 38px); }
        .mining-embed > header p { margin: 0; color: #b9d9eb; font-size: 13px; line-height: 1.55; }
        .embed-loading { min-height: 480px; display: grid; place-items: center; color: #b9d9eb; }
        .mining-embed canvas { display: block; width: 100% !important; height: auto !important; aspect-ratio: 12 / 7; }
        @media (max-width: 560px) {
          .mining-embed { padding: 12px 8px; }
          .mining-embed > header { padding: 0 5px; }
          .mining-embed > header p { font-size: 12px; }
          .mining-embed canvas { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </main>
  );
}
