"use client";

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAssetPath } from "../basePath";

const MiningGame2D = dynamic(() => import("@/components/MiningGame2D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px",
        background: "linear-gradient(135deg, rgba(0,217,255,0.05), rgba(157,78,221,0.05))",
        borderRadius: "16px",
        color: "#00d9ff",
        fontWeight: "700",
        fontSize: "16px",
      }}
    >
      ⏳ Đang tải game...
    </div>
  ),
});

// Note: Move metadata to layout.tsx if needed for SEO

export default function ChemMiningPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1f2e, #1a2f4e)",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              color: "#00d9ff",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            ⛏️ Trò chơi giáo dục 2D
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              margin: "0 0 12px",
              backgroundImage: "linear-gradient(135deg, #00d9ff, #9d4edd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Đào Hóa Trị 2D
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#a8d5ff",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Canh móc, kéo đúng nguyên tố và ghi nhớ hóa trị qua từng lượt chơi 2D nhẹ, rõ nét.
          </p>
        </div>

        {/* Game Container */}
        <div
          style={{
            marginBottom: "60px",
          }}
        >
          <MiningGame2D />
        </div>

        {/* Info Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "60px",
          }}
        >
          <div
            style={{
              padding: "24px",
              background: "rgba(0,217,255,0.08)",
              border: "1px solid rgba(0,217,255,0.3)",
              borderRadius: "16px",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              🎮 Cách chơi
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#a8d5ff",
                margin: 0,
              }}
            >
              Bấm hoặc nhấn Space để thả móc cẩu xuống khu vực khai thác. Thu thập tất cả tinh thể khoáng trong giới hạn thời gian.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              background: "rgba(157,78,221,0.08)",
              border: "1px solid rgba(157,78,221,0.3)",
              borderRadius: "16px",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              🧪 Học hóa
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#c9a8ff",
                margin: 0,
              }}
            >
              Mỗi tinh thể là một nguyên tố khác nhau. Tìm hiểu ký hiệu, tên gọi và tính chất của chúng qua gameplay.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.3)",
              borderRadius: "16px",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              ⭐ Combo & Điểm
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#a8d5ff",
                margin: 0,
              }}
            >
              Tăng combo bằng cách thu thập liên tục. Mỗi combo cao sẽ cộng thêm điểm thưởng!
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div
          style={{
            marginTop: "60px",
            padding: "32px",
            background: "linear-gradient(135deg, rgba(0,217,255,0.1), rgba(157,78,221,0.1))",
            border: "1px solid rgba(0,217,255,0.2)",
            borderRadius: "16px",
            color: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginTop: 0,
              marginBottom: "16px",
              color: "#00d9ff",
            }}
          >
            💡 Mẹo chơi
          </h2>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              paddingLeft: "0",
              margin: 0,
              listStyle: "none",
            }}
          >
            <li style={{ fontSize: "14px", lineHeight: "1.6", color: "#a8d5ff" }}>
              <strong style={{ color: "#fff" }}>🎯 Tập trung:</strong> Hãy theo dõi các tinh thể sáng để nắm bắt chúng dễ dàng hơn.
            </li>
            <li style={{ fontSize: "14px", lineHeight: "1.6", color: "#a8d5ff" }}>
              <strong style={{ color: "#fff" }}>⚡ Tốc độ:</strong> Nhanh chóng thu thập các tinh thể để giữ combo cao.
            </li>
            <li style={{ fontSize: "14px", lineHeight: "1.6", color: "#a8d5ff" }}>
              <strong style={{ color: "#fff" }}>🧬 Học tập:</strong> Sau mỗi lượt chơi, hãy xem lại các ký hiệu hóa học.
            </li>
            <li style={{ fontSize: "14px", lineHeight: "1.6", color: "#a8d5ff" }}>
              <strong style={{ color: "#fff" }}>📱 Responsive:</strong> Game hoạt động tốt trên cả máy tính, tablet và điện thoại.
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            padding: "32px",
          }}
        >
          <p style={{ fontSize: "16px", color: "#a8d5ff", marginBottom: "20px" }}>
            Muốn học thêm về hóa học? Tham gia các khóa học trực tiếp của Cô Trâm!
          </p>
          <a
            href="/hoc-hoa"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #00d9ff, #00e5ff)",
              color: "#0a1f2e",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "800",
              fontSize: "15px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Khám phá các khóa học →
          </a>
        </div>
      </div>
    </div>
  );
}
