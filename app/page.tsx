import { Suspense } from "react";
import { ImageConverter } from "./components/image-converter";

function ConverterLoading() {
  return (
    <div className="converter-container">
      <header className="header">
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="logo-icon"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span>WebP Converter</span>
        </div>
        <p className="tagline">Loading converter...</p>
      </header>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<ConverterLoading />}>
        <ImageConverter />
      </Suspense>
    </main>
  );
}
