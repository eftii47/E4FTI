import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import type { Profile } from "@shared/schema";

interface CustomCursorProps {
  config: Profile["cursor"];
  customImage?: string;
}

export function CustomCursor({ config, customImage }: CustomCursorProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  console.log('CustomCursor config:', config, 'customImage:', customImage);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Enable cursor tracking if custom image is provided or if config.enabled is true
    if (!customImage && !config.enabled) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        document.body.classList.add("hovering");
      } else {
        document.body.classList.remove("hovering");
      }
    };

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("hovering");
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };stomImage, cu
  }, [config.enabled, cursorX, cursorY]);

  // Always show custom cursor image if provided, regardless of config.enabled
  if (customImage && (customImage.endsWith('.gif') || customImage.endsWith('.png'))) {
    console.log('Rendering custom cursor image:', customImage);
    return (
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <img 
          src={customImage} 
          alt="cursor" 
          className="w-6 h-6 object-contain drop-shadow-lg" 
          style={{ imageRendering: 'auto' }}
        />
      </motion.div>
    );
  }

  if (!config.enabled) return null;

  if (config.style === "emoji") {
    return (
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-2xl select-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {config.emoji}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: config.primaryColor,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          borderColor: config.secondaryColor,
        }}
      />
    </>
  );
}
