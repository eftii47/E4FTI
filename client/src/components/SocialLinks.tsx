import type { Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Github, Twitter, Instagram, Youtube, Twitch, 
  Linkedin, Facebook, Mail, Globe, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Map platform names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  discord: Disc,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  twitch: Twitch,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
  website: Globe,
};

interface SocialLinksProps {
  links: Profile["socialLinks"];
}

interface SocialIconImageProps {
  platform: string;
  fallback: React.ElementType;
}

function SocialIconImage({ platform, fallback: Fallback }: SocialIconImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const platformLower = platform.toLowerCase();
    const formats = ['png', 'jpg'];
    let found = false;

    // Try each format sequentially
    const tryNextFormat = (index: number) => {
      if (index >= formats.length || found) {
        return;
      }

      const url = `/assets/${platformLower}.${formats[index]}`;
      const img = new Image();
      
      img.onload = () => {
        if (mounted && !found) {
          found = true;
          setImageUrl(url);
        }
      };
      
      img.onerror = () => {
        if (mounted && !found) {
          tryNextFormat(index + 1);
        }
      };
      
      img.src = url;
    };

    tryNextFormat(0);

    return () => {
      mounted = false;
    };
  }, [platform]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={platform}
        className="w-5 h-5 object-contain"
      />
    );
  }

  // Only show custom icons, no fallback
  return null;
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <div className="flex flex-row gap-3">
      {links.map((link, i) => {
        const Icon = iconMap[link.platform.toLowerCase()] || Globe;
        return (
          <motion.a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "interactive relative inline-flex items-center justify-center",
              "w-7 h-7 rounded-full transition-all duration-200",
              "hover:scale-110 hover:-translate-y-1",
              "active:scale-95"
            )}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Glow effect background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-white/5 opacity-0 hover:opacity-100 transition-opacity blur-sm" />
            
            {/* Icon container with glow */}
            <div className="relative z-10 flex items-center justify-center text-white/80 hover:text-white transition-colors">
              <SocialIconImage platform={link.platform} fallback={Icon} />
            </div>

            {/* Subtle glow ring on hover */}
            <div className="absolute inset-0 rounded-full border border-white/0 hover:border-white/30 transition-all" />
            
            <span className="sr-only">{link.platform}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
