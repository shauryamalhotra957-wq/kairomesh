export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "kairomesh-web",
      version: "0.1.0",
      mode: "demonstration",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
