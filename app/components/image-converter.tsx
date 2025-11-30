"use client";

import { useState, useCallback, useRef } from "react";
import JSZip from "jszip";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  status: "pending" | "converting" | "done" | "error";
  originalSize: number;
  convertedSize: number | null;
}

interface ConversionSettings {
  quality: number;
  scale: number;
}

export function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 100,
    scale: 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      convertedBlob: null,
      convertedUrl: null,
      status: "pending" as const,
      originalSize: file.size,
      convertedSize: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const convertImage = async (imageFile: ImageFile): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ ...imageFile, status: "error" });
          return;
        }

        const scaleFactor = settings.scale / 100;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const convertedUrl = URL.createObjectURL(blob);
              resolve({
                ...imageFile,
                convertedBlob: blob,
                convertedUrl,
                convertedSize: blob.size,
                status: "done",
              });
            } else {
              resolve({ ...imageFile, status: "error" });
            }
          },
          "image/webp",
          settings.quality / 100
        );
      };

      img.onerror = () => {
        resolve({ ...imageFile, status: "error" });
      };

      img.src = imageFile.preview;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setIsConverting(true);

    // Mark all as converting
    setImages((prev) =>
      prev.map((img) =>
        img.status === "pending" ? { ...img, status: "converting" } : img
      )
    );

    const updatedImages = await Promise.all(
      images.map(async (img) => {
        if (img.status === "done") return img;
        return await convertImage(img);
      })
    );

    setImages(updatedImages);
    setIsConverting(false);
  };

  const downloadSingle = (image: ImageFile) => {
    if (!image.convertedUrl) return;

    const link = document.createElement("a");
    link.href = image.convertedUrl;
    const originalName = image.file.name.replace(/\.[^/.]+$/, "");
    link.download = `${originalName}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = async () => {
    const convertedImages = images.filter(
      (img) => img.status === "done" && img.convertedBlob
    );
    if (convertedImages.length === 0) return;

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0]);
      return;
    }

    const zip = new JSZip();

    convertedImages.forEach((img) => {
      if (img.convertedBlob) {
        const originalName = img.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${originalName}.webp`, img.convertedBlob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted-images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
        if (image.convertedUrl) URL.revokeObjectURL(image.convertedUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview);
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
    });
    setImages([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasConvertedImages = images.some((img) => img.status === "done");
  const hasPendingImages = images.some((img) => img.status === "pending");

  return (
    <div className="converter-container">
      {/* Header */}
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
        <p className="tagline">Convert images to WebP format instantly in your browser</p>
      </header>

      {/* Settings Panel */}
      <div className="settings-panel">
        <div className="setting-group">
          <label htmlFor="quality">
            <span className="setting-label">Quality</span>
            <span className="setting-value">{settings.quality}%</span>
          </label>
          <input
            type="range"
            id="quality"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                quality: parseInt(e.target.value),
              }))
            }
            className="slider"
          />
        </div>

        <div className="setting-group">
          <label htmlFor="scale">
            <span className="setting-label">Scale</span>
            <span className="setting-value">{settings.scale}%</span>
          </label>
          <input
            type="range"
            id="scale"
            min="10"
            max="100"
            value={settings.scale}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                scale: parseInt(e.target.value),
              }))
            }
            className="slider"
          />
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`dropzone ${isDragging ? "dragging" : ""} ${images.length > 0 ? "has-images" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden-input"
        />
        <div className="dropzone-content">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="upload-icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="dropzone-text">
            <span className="highlight">Drop images here</span> or click to browse
          </p>
          <p className="dropzone-hint">Supports JPG, PNG, GIF, BMP, and more</p>
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="image-list-container">
          <div className="list-header">
            <h2>{images.length} image{images.length !== 1 ? "s" : ""}</h2>
            <button onClick={clearAll} className="clear-btn">
              Clear All
            </button>
          </div>

          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <button
                  onClick={() => removeImage(image.id)}
                  className="remove-btn"
                  aria-label="Remove image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="image-preview">
                  <img
                    src={image.convertedUrl || image.preview}
                    alt={image.file.name}
                  />
                </div>

                <div className="image-info">
                  <p className="image-name" title={image.file.name}>
                    {image.file.name}
                  </p>
                  <div className="image-sizes">
                    <span className="original-size">{formatSize(image.originalSize)}</span>
                    {image.convertedSize && (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="converted-size">{formatSize(image.convertedSize)}</span>
                        <span className={`savings ${image.convertedSize < image.originalSize ? "positive" : "negative"}`}>
                          {image.convertedSize < image.originalSize ? "-" : "+"}
                          {Math.abs(Math.round((1 - image.convertedSize / image.originalSize) * 100))}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="image-status">
                  {image.status === "pending" && (
                    <span className="status pending">Ready</span>
                  )}
                  {image.status === "converting" && (
                    <span className="status converting">
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
                      </svg>
                      Converting...
                    </span>
                  )}
                  {image.status === "done" && (
                    <button
                      onClick={() => downloadSingle(image)}
                      className="download-single-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </button>
                  )}
                  {image.status === "error" && (
                    <span className="status error">Error</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && (
        <div className="actions">
          {hasPendingImages && (
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="convert-btn"
            >
              {isConverting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
                  </svg>
                  Converting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                  Convert to WebP
                </>
              )}
            </button>
          )}

          {hasConvertedImages && (
            <button onClick={downloadAll} className="download-all-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download All {images.filter((img) => img.status === "done").length > 1 ? "(ZIP)" : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

