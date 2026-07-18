import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KairoMesh Mission Control",
    short_name: "KairoMesh",
    description: "GPU jobs with checkpoint recovery and tamper-evident receipts.",
    start_url: "/",
    display: "standalone",
    background_color: "#080b10",
    theme_color: "#080b10",
  };
}
