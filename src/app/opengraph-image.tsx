import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f3ec",
          color: "#191a17",
          fontFamily: "Arial",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
            <div
              style={{
                width: 58,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: "#111",
                color: "#fff",
              }}
            >
              P
            </div>
            PrivPulse
          </div>
          <div style={{ display: "flex", gap: 54, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 78, lineHeight: 0.96, letterSpacing: 0, fontWeight: 700 }}>
                DPDP-ready analytics for Indian businesses.
              </div>
              <div style={{ marginTop: 30, fontSize: 28, lineHeight: 1.35, color: "rgba(25,26,23,0.66)" }}>
                No cookies. Real-time dashboards. Rs. 199/month indie plan.
              </div>
            </div>
            <div
              style={{
                width: 360,
                height: 340,
                borderRadius: 12,
                background: "#111",
                padding: 24,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
                <span>mystore.in</span>
                <span style={{ color: "#8ee6ad" }}>Live</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {["18.4k", "42.1k"].map((value, index) => (
                  <div key={value} style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{index === 0 ? "Visitors" : "Pageviews"}</div>
                    <div style={{ display: "flex", marginTop: 8, fontSize: 34, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "flex-end", gap: 8, height: 150 }}>
                {[40, 72, 64, 105, 92, 132, 118, 146].map((height) => (
                  <div key={height} style={{ flex: 1, height, background: "#8ee6ad", borderRadius: "6px 6px 0 0" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
