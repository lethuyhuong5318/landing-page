"use client";

import dynamic from "next/dynamic";

const ChemistrySimulation3D = dynamic(() => import("@/components/ChemistrySimulation3D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px",
        background: "linear-gradient(135deg, rgba(181,220,232,0.08), rgba(107,182,212,0.08))",
        borderRadius: "20px",
        color: "#5ba3d0",
        fontWeight: "700",
        fontSize: "14px",
      }}
    >
      ⏳ Đang tải mô phỏng...
    </div>
  ),
});

export default function ChemistrySimulationPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e8f0ff)",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
            color: "#1a3a52",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "900",
              color: "#5ba3d0",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "16px",
            }}
          >
            🧪 Mô phỏng 3D
          </div>
          <h1
            style={{
              fontSize: "44px",
              fontWeight: "800",
              margin: "0 0 16px",
              backgroundImage: "linear-gradient(135deg, #5ba3d0, #2a7ab8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Phản Ứng Điện Hoá Học
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#4a7a9f",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Khám phá quá trình ion di chuyển và kim loại bám trên điện cực trong một mô phỏng 3D
            chuyên nghiệp. Dễ hiểu, dễ quan sát, dễ học.
          </p>
        </div>

        {/* Main Simulation */}
        <div
          style={{
            marginBottom: "60px",
          }}
        >
          <ChemistrySimulation3D width={1000} height={700} />
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              🎨 Thiết Kế Tinh Tế
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Màu sắc pastel dịu mắt, không chói, tạo cảm giác mềm mại và chuyên nghiệp như một
              phòng thí nghiệm hiện đại.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              💎 Chất Liệu Thực Tế
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Cốc thủy tinh mờ, dung dịch trong suốt, kim loại có phản xạ, ion động và bóng đổ
              mềm tạo chiều sâu.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              ⚡ Tương Tác Mượt Mà
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Ion chuyển động nhẹ nhàng, dung dịch dao động tinh tế, không hiệu ứng chói hay rối,
              dễ tập trung học.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              🎓 Giáo Dục Rõ Ràng
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Các thành phần được phân biệt rõ ràng: dung dịch, ion, kim loại, lớp bám. Phục vụ
              học tập trước hết.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              📱 Responsive Toàn Màn Hình
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Hoạt động tốt trên máy tính để bàn, tablet và điện thoại. Không méo hình, không
              mất chi tiết.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(91,163,208,0.15)",
              borderRadius: "16px",
              color: "#1a3a52",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              🚀 Hiệu Suất Cao
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#4a7a9f",
                margin: 0,
              }}
            >
              Render mượt 60 FPS, tải nhanh, sử dụng WebGL tối ưu. Tính toán ion mịn và ánh
              sáng chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(91,163,208,0.08), rgba(181,220,232,0.08))",
            border: "1px solid rgba(91,163,208,0.2)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "60px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              margin: "0 0 20px",
              color: "#1a3a52",
            }}
          >
            Về Mô Phỏng Này
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              lineHeight: "1.7",
            }}
          >
            <div style={{ color: "#4a7a9f" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px", color: "#1a3a52" }}>
                Cốc & Dung Dịch
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Thiết kế như thủy tinh cao cấp với độ trong suốt vừa phải. Dung dịch có gradient nhẹ
                tạo chiều sâu, không phẳng lì.
              </p>
            </div>
            <div style={{ color: "#4a7a9f" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px", color: "#1a3a52" }}>
                Ion & Chuyển Động
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                15 ion chuyển động tự nhiên, mềm mại. Có glow nhẹ để dễ theo dõi nhưng không gây chói
                hay phiền.
              </p>
            </div>
            <div style={{ color: "#4a7a9f" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px", color: "#1a3a52" }}>
                Ánh Sáng Chuyên Nghiệp
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Hệ thống 3 loại ánh sáng: chính, phụ, và môi trường. Bóng đổ mềm không cứng. Cảm
                giác studio.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "40px",
            borderTop: "1px solid rgba(91,163,208,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "16px",
              color: "#1a3a52",
            }}
          >
            Muốn Học Thêm Về Điện Hóa?
          </h2>
          <p style={{ fontSize: "15px", color: "#4a7a9f", marginBottom: "24px" }}>
            Tham gia các khóa học trực tiếp hoặc trực tuyến với Cô Trâm để nắm vững lý thuyết và
            thực hành.
          </p>
          <a
            href="/hoc-hoa"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #5ba3d0, #2a7ab8)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "800",
              fontSize: "15px",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 8px 20px rgba(91,163,208,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "translateY(-2px)";
              (e.target as HTMLElement).style.boxShadow = "0 12px 28px rgba(91,163,208,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "translateY(0)";
              (e.target as HTMLElement).style.boxShadow = "0 8px 20px rgba(91,163,208,0.3)";
            }}
          >
            Khám Phá Khóa Học →
          </a>
        </div>
      </div>
    </div>
  );
}
