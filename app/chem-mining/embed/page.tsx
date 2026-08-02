"use client";

import dynamic from "next/dynamic";

const MiningGame2D = dynamic(() => import("@/components/MiningGame2D"), {
  ssr: false,
  loading: () => <div className="embed-loading">Đang tải game 2D…</div>,
});

export default function ChemistryMiningEmbedPage() {
  return (
    <main className="mining-embed">`r`n      <MiningGame2D compact />
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #e8f5fb; }
        body { font-family: "Be Vietnam Pro", system-ui, sans-serif; color: #0b365e; }
        .mining-embed { min-height: 100dvh; padding: 18px; background: radial-gradient(circle at 50% 0, #fff0c7, #e8f5fb 58%); }
        .embed-loading { min-height: 480px; display: grid; place-items: center; color: #526c80; }
        .mining-embed canvas { display: block; width: 100% !important; height: auto !important; aspect-ratio: 12 / 7; }
        @media (max-width: 560px) {
          .mining-embed { padding: 12px 8px; }
          .mining-embed canvas { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </main>
  );
}
