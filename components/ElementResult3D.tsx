"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AtomicModel3D from "./AtomicModel3D";

interface ElementResultProps {
  element: {
    number: number;
    symbol: string;
    name: string;
    category: string;
    application: string;
    fact: string;
    visualLabel: string;
    tone: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ElementResult3D({ element, isOpen, onClose }: ElementResultProps) {
  const [show3D, setShow3D] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="element-result-backdrop is-open"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(10,30,45,.55)",
          opacity: 1,
          visibility: "visible",
        }}
      />

      {/* Modal */}
      <aside
        className={`element-result ${element.tone} is-open`}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          bottom: "auto",
          zIndex: 210,
          width: "min(580px, calc(100% - 20px))",
          maxHeight: "min(92dvh, 820px)",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(0,10,20,.4)",
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
          visibility: "visible",
          pointerEvents: "auto",
          transition: "transform .3s cubic-bezier(.22,1,.36,1), opacity .25s ease",
          backgroundColor:
            element.tone === "ink"
              ? "#38546c"
              : element.tone === "gold"
                ? "#fff5d9"
                : element.tone === "mint"
                  ? "#e5f7ed"
                  : "#f1edfb",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          className="element-result-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 3,
            margin: 0,
            width: "44px",
            height: "44px",
            border: "none",
            borderRadius: "50%",
            color: element.tone === "ink" ? "#fff" : "inherit",
            background: element.tone === "ink" ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.08)",
            fontSize: "15px",
            lineHeight: 1,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <X width={20} height={20} />
        </button>

        {/* Content (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            color: element.tone === "ink" ? "#fff" : "inherit",
          }}
        >
          {/* Header: Number + Category */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span
              style={{
                width: "34px",
                height: "34px",
                display: "grid",
                placeItems: "center",
                borderRadius: "10px",
                color: "#fff",
                background: element.tone === "ink" ? "rgba(255,255,255,.2)" : "#2878C8",
                fontSize: "10px",
                fontWeight: "900",
              }}
            >
              {element.number}
            </span>
            <small
              style={{
                padding: "7px 9px",
                borderRadius: "999px",
                color: element.tone === "ink" ? "#bde8ef" : "#2878C8",
                background: element.tone === "ink" ? "rgba(255,255,255,.1)" : "rgba(36,87,130,.09)",
                fontSize: "8px",
                fontWeight: "900",
              }}
            >
              {element.category}
            </small>
          </div>

          {/* Symbol + 3D Toggle */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" }}>
              <div
                style={{
                  color: element.tone === "ink" ? "#fff" : "#2878C8",
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: "78px",
                  fontWeight: "800",
                  lineHeight: 0.9,
                  letterSpacing: "-0.06em",
                }}
              >
                {element.symbol}
              </div>

              {/* 3D Toggle Button */}
              <button
                onClick={() => setShow3D(!show3D)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: `2px solid ${element.tone === "ink" ? "#5fa8d6" : "#2878C8"}`,
                  background: show3D
                    ? element.tone === "ink"
                      ? "rgba(93,168,214,.2)"
                      : "rgba(40,120,200,.15)"
                    : "transparent",
                  color: element.tone === "ink" ? "#bde8ef" : "#2878C8",
                  fontSize: "12px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all .2s ease",
                  marginBottom: "12px",
                }}
              >
                {show3D ? "📦 Model" : "🔘 3D"}
              </button>
            </div>

            {/* 3D Model Container */}
            {show3D && (
              <div
                style={{
                  marginTop: "20px",
                  height: "240px",
                  borderRadius: "12px",
                  border: `1px solid ${element.tone === "ink" ? "rgba(93,168,214,.3)" : "rgba(40,120,200,.15)"}`,
                  overflow: "hidden",
                }}
              >
                <AtomicModel3D
                  element={{
                    symbol: element.symbol,
                    number: element.number,
                    name: element.name,
                  }}
                  isVisible={show3D}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <h3
            style={{
              margin: "18px 0 10px",
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "23px",
              lineHeight: 1.2,
              color: element.tone === "ink" ? "#fff" : "inherit",
            }}
          >
            {element.name} có mặt ở đâu?
          </h3>

          {/* Application */}
          <p
            style={{
              padding: "14px 15px",
              color: element.tone === "ink" ? "#eef7fa" : "#294c61",
              borderLeft: `4px solid ${element.tone === "ink" ? "#83ceda" : "#4d9eb0"}`,
              borderRadius: "0 13px 13px 0",
              background: element.tone === "ink" ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.72)",
              fontFamily: "var(--font-heading), Arial, sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: 1.55,
              margin: 0,
              marginBottom: "16px",
            }}
          >
            <span style={{ display: "block", marginBottom: "4px", fontSize: "8px", fontWeight: "900", letterSpacing: ".11em", textTransform: "uppercase" }}>
              ỨNG DỤNG THỰC TẾ
            </span>
            {element.application}
          </p>

          {/* Fact Card */}
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              display: "flex",
              gap: "11px",
              borderRadius: "15px",
              background: element.tone === "ink" ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.65)",
              border: `1px solid ${element.tone === "ink" ? "rgba(255,255,255,.12)" : "rgba(36,87,130,.11)"}`,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                flex: "0 0 auto",
                display: "grid",
                placeItems: "center",
                borderRadius: "10px",
                color: element.tone === "ink" ? "#bde8ef" : "#2878C8",
                background: element.tone === "ink" ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.72)",
              }}
            >
              🧪
            </div>
            <div>
              <strong
                style={{
                  display: "block",
                  marginBottom: "3px",
                  color: element.tone === "ink" ? "#fff" : "#17324D",
                  fontWeight: "700",
                }}
              >
                Em có biết?
              </strong>
              <p
                style={{
                  margin: 0,
                  color: element.tone === "ink" ? "#d5e2e9" : "#496274",
                  fontSize: "10px",
                  lineHeight: 1.5,
                }}
              >
                {element.fact}
              </p>
            </div>
          </div>

          {/* Hint */}
          <small
            style={{
              marginTop: "18px",
              paddingTop: "18px",
              display: "block",
              color: element.tone === "ink" ? "#bde8ef" : "#2878C8",
              fontSize: "9px",
              fontWeight: "800",
            }}
          >
            Chọn một ô khác để tiếp tục khám phá →
          </small>
        </div>
      </aside>
    </>
  );
}
