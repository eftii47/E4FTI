import type { Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Github, Twitter, Instagram, Youtube, Twitch, 
  Linkedin, Facebook, Mail, Globe, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {links.map((link, i) => {
        const Icon = iconMap[link.platform.toLowerCase()] || Globe;
        return (
          <motion.a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive group relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">{link.platform}</span>
            <Icon 
              size={16} 
              className={cn(
                "transition-colors",
                link.platform.toLowerCase() === "twitter" ? "text-sky-400" :
                link.platform.toLowerCase() === "youtube" ? "text-red-500" :
                link.platform.toLowerCase() === "instagram" ? "text-pink-500" :
                link.platform.toLowerCase() === "discord" ? "text-indigo-400" :
                link.platform.toLowerCase() === "spotify" ? "text-green-500" :
                link.platform.toLowerCase() === "twitch" ? "text-purple-400" :
                link.platform.toLowerCase() === "github" ? "text-white" : "text-white/70"
              )} 
            />
          </motion.a>
        );
      })}
    </div>
  );
}
