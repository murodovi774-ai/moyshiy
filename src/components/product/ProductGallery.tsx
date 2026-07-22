"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name?: string;
}

export default function ProductGallery({ images = [], name = "Mahsulot" }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/600"];

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-[32px] overflow-hidden bg-white/50 backdrop-blur-md border border-white/40 shadow-xl shadow-black/5 group">
        <motion.img
          key={selectedImage}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={displayImages[selectedImage]}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Zoom Trigger Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md border border-white/50 text-foreground hover:bg-white hover:scale-110 transition-all shadow-md"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedImage === idx
                  ? "border-primary scale-105 shadow-md shadow-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-[2001] max-w-4xl max-h-[85vh] w-full flex items-center justify-center"
            >
              <img
                src={displayImages[selectedImage]}
                alt={name}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
