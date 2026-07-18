import { ImageResponse } from "next/og";

export const alt = "KairoMesh — GPU jobs that finish, even when hosts do not";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#080b10",
        color: "#f4f7f9",
        padding: "68px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, fontWeight: 650 }}>
        <div style={{ width: 38, height: 38, border: "2px solid #b8f36b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#b8f36b" }}>K</div>
        <span>Kairo<span style={{ color: "#b8f36b" }}>Mesh</span></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, lineHeight: 0.98, letterSpacing: "-5px", fontWeight: 590, maxWidth: 920 }}>GPU jobs that finish.</div>
        <div style={{ marginTop: 22, fontSize: 38, color: "#a9b5c3", letterSpacing: "-1.5px" }}>Even when hosts don&apos;t.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#7f8d9c", fontSize: 22 }}>
        <span>Checkpoint · recover · verify · settle</span>
        <span style={{ color: "#b8f36b" }}>Outcome cloud / demo</span>
      </div>
    </div>,
    size,
  );
}
