import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile } from "@shared/schema";

interface ProfileViewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  viewImage?: string;
  viewMedia?: string;
  onOpen?: () => void;
  audio?: Profile["audio"];
  onPlayAudio?: () => Promise<void>;
}

export const ProfileViewOverlay = ({
  isOpen,
  onClose,
  viewImage,
  viewMedia,
  onOpen,
  audio,
  onPlayAudio
}: ProfileViewOverlayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Media paths
  const videoPath = viewMedia;
  const imagePath = viewImage;
  
  // Logic: Try video first, if it fails show image instead
  const showVideo = videoPath && !videoError;
  const showImage = (imagePath && !imageError) && (!showVideo || videoError);
  
  // Debug logging
  console.log("ProfileViewOverlay - videoPath:", videoPath, "imagePath:", imagePath, "showVideo:", showVideo, "showImage:", showImage, "videoError:", videoError, "imageError:", imageError);

  // Trigger audio play and animations when overlay opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        if (onOpen) {
          onOpen();
        }
        if (onPlayAudio) {
          onPlayAudio().catch(err => console.error("Failed to play audio:", err));
        }
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onOpen, onPlayAudio]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content Container */}
          <motion.div
            className="relative z-10 w-screen h-screen flex items-center justify-center cursor-pointer"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            onClick={() => {
              onClose();
              // Play audio when closing overlay
              if (onPlayAudio) {
                setTimeout(() => {
                  onPlayAudio().catch(err => console.error("Failed to play audio:", err));
                }, 300);
              }
            }}
          >
            {/* Media Container - supports both images and videos from either attribute */}
            {(videoPath || imagePath) && (
              <motion.div
                className="relative w-screen h-screen flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none animate-pulse" />
                
                {/* Video - try to load first, falls back to image on error */}
                {showVideo && (
                  <video
                    src={videoPath}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    onLoadedData={() => {
                      console.log('Video loaded:', videoPath);
                      setIsLoading(false);
                    }}
                    onLoadStart={() => {
                      console.log('Video loading:', videoPath);
                      setIsLoading(true);
                    }}
                    onError={(e) => {
                      console.error('Video error, falling back to image:', videoPath, e);
                      setVideoError(true);
                      setIsLoading(false);
                    }}
                  />
                )}
                
                {/* Image - shows if video is not present or if video failed to load */}
                {showImage && (
                  <img
                    src={imagePath}
                    alt="Profile View"
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={() => {
                      console.log('Image loaded:', imagePath);
                      setIsLoading(false);
                    }}
                    onLoadCapture={() => setIsLoading(true)}
                    onError={(e) => {
                      console.error('Image error:', imagePath, e);
                      setImageError(true);
                      setIsLoading(false);
                    }}
                  />
                )}

                {/* Floating "Click to Reveal" Text */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center"
                  >
                    <p className="text-white text-3xl font-bold drop-shadow-lg tracking-wider">
                      Click to Reveal
                    </p>
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-4 text-white/80 text-sm"
                    >
                      ↓
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Loading Overlay */}
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white text-sm font-medium">Loading...</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
