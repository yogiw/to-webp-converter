import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "WebP Converter - Convert images to WebP format";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f0f0f",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          WebP Converter
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Convert images to WebP format instantly in your browser
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["JPG", "PNG", "GIF", "BMP"].map((format) => (
            <div
              key={format}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                border: "1px solid #2a2a2a",
                color: "#a0a0a0",
                fontSize: 20,
              }}
            >
              {format}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 16px",
              color: "#22d3ee",
              fontSize: 24,
            }}
          >
            →
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              backgroundColor: "rgba(34, 211, 238, 0.15)",
              borderRadius: 8,
              border: "1px solid #22d3ee",
              color: "#22d3ee",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            WebP
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

