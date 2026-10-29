import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react-native";
import type { UploadedFile } from "@/components/standard_ui/form_fields/StandardFileUploadBox";

export default function HeadshotCropModalWeb({
  visible,
  imageUri,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onConfirm: (croppedFile: UploadedFile) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const VIEWPORT_SIZE = 240;

  useEffect(() => {
    if (visible) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [visible, imageUri]);

  // Window-level mouse listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!visible || !imageUri) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;

    if (!naturalWidth || !naturalHeight) return;

    const V = VIEWPORT_SIZE;
    const aspect = naturalWidth / naturalHeight;

    let baseW = V;
    let baseH = V;
    if (aspect > 1) {
      baseH = V;
      baseW = V * aspect;
    } else {
      baseW = V;
      baseH = V / aspect;
    }

    const displayedW = baseW * zoom;
    const displayedH = baseH * zoom;

    const viewX = (V - displayedW) / 2 + pan.x;
    const viewY = (V - displayedH) / 2 + pan.y;

    const ratio = displayedW / naturalWidth;

    const sx = Math.max(0, -viewX / ratio);
    const sy = Math.max(0, -viewY / ratio);
    const sWidth = Math.min(naturalWidth - sx, V / ratio);
    const sHeight = Math.min(naturalHeight - sy, V / ratio);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 512, 512);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedUri = URL.createObjectURL(blob);
        onConfirm({
          uri: croppedUri,
          name: `headshot_${Date.now()}.jpg`,
          type: "image/jpeg",
          size: blob.size,
        });
        onClose();
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-neutral-900">
                Adjust Profile Headshot
              </h3>
              <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                Drag photo to position your face within the circle
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Interactive Crop Viewport */}
          <div className="flex flex-col items-center justify-center py-2">
            <div
              className="relative overflow-hidden rounded-2xl bg-neutral-950 flex items-center justify-center select-none"
              style={{
                width: 290,
                height: 290,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* The underlying dragged image */}
              <img
                ref={imageRef}
                src={imageUri}
                alt="Profile candidate"
                onLoad={() => setImageLoaded(true)}
                draggable={false}
                style={{
                  maxWidth: "none",
                  maxHeight: "none",
                  width: VIEWPORT_SIZE,
                  height: VIEWPORT_SIZE,
                  objectFit: "cover",
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.05s ease-out",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />

              {/* Dimmed Vignette with Circular Cutout Mask */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle 120px at center, transparent 120px, rgba(0, 0, 0, 0.65) 121px)",
                }}
              />

              {/* Circular Border Ring */}
              <div
                className="absolute pointer-events-none rounded-full border-2 border-white/90 shadow-sm"
                style={{
                  width: VIEWPORT_SIZE,
                  height: VIEWPORT_SIZE,
                }}
              />

              {/* Move Indicator Badge */}
              <div className="absolute bottom-2.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <Move size={11} color="#FFFFFF" />
                <span className="text-[10px] font-bold text-white tracking-wide">
                  Drag to Move
                </span>
              </div>
            </div>
          </div>

          {/* Zoom & Control Bar */}
          <div className="mt-4 px-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-1.5">
              <span>Zoom</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF5500] cursor-pointer"
              />
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors ml-1"
                title="Reset Position"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCrop}
              disabled={!imageLoaded}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1E2933] font-bold text-sm text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Set Profile Photo</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
