# Click-to-View Feature - Code Reference

## Component Hierarchy

```
Home.tsx (main page)
├── Avatar Container (clickable)
│   ├── Gradient Ring (rotating, on hover)
│   ├── Avatar Image
│   │   └── Discord Decoration (if enabled)
│   └── Camera Icon (appears on hover)
├── ...other profile elements
└── ProfileViewOverlay (portal, when isOverlayOpen=true)
    ├── Backdrop (semi-transparent + blur)
    ├── Modal Container (centered, scaled animation)
    │   ├── Close Button (top-right)
    │   ├── Image Container
    │   │   ├── Glow Border
    │   │   ├── Image (GIF/JPG)
    │   │   └── Loading Overlay (conditional)
    │   └── Help Text
    └── [Audio plays in background]
```

## CSS Classes Used

### Avatar Hover Effects
```tsx
className="relative inline-block mb-3 cursor-pointer group"
// ^       hover state via Tailwind group
```

### Rotating Gradient Ring
```tsx
className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-5"

animate={{ rotate: 360 }}
transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
```

### Avatar Image with Glow
```tsx
className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300"
// ^                                                             glow on hover
```

### Camera Icon Button
```tsx
className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full p-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
```

### Overlay Backdrop
```tsx
className="absolute inset-0 bg-black/60 backdrop-blur-sm"
// ^^                                                        60% opacity black + blur
```

### Modal Container
```tsx
className="relative z-10 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"

initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ 
  duration: 0.4,
  type: "spring",
  stiffness: 200,
  damping: 20
}}
```

### Image Glow Container
```tsx
className="relative w-full rounded-xl overflow-hidden bg-black/40"

{/* Glow effect */}
<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl pointer-events-none animate-pulse" />
```

### Image Display
```tsx
className="w-full h-auto object-cover rounded-xl relative z-10"

style={{
  aspectRatio: "auto",
  maxHeight: "70vh"
}}
```

### Loading Overlay
```tsx
className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl"

// Spinner animation
className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"
```

### Close Button
```tsx
className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"

whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
```

### Help Text
```tsx
className="text-center mt-4 text-white/60 text-sm"

initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.3 }}
```

## Event Handlers

### Avatar Click Handler
```typescript
const handleAvatarClick = (e: React.MouseEvent) => {
  e.stopPropagation();  // Prevent event bubbling
  if (mergedProfile?.viewImage) {
    setIsOverlayOpen(true);
  }
};
```

### Overlay Close Handler
```typescript
const onClose = () => {
  setIsOverlayOpen(false);
};
```

### Backdrop Click Handler
```tsx
onClick={onClose}  // Click outside to close
```

### Modal Content Click Handler
```tsx
onClick={(e) => e.stopPropagation()}  // Prevent closing on content click
```

## Animation Specifications

### Avatar Gradient Ring
```typescript
{
  type: "rotate",
  duration: 3,
  repeat: Infinity,
  ease: "linear"
}
```

### Overlay Fade-in
```typescript
{
  type: "tween",
  duration: 0.3
}
```

### Modal Scale & Entrance
```typescript
{
  type: "spring",
  stiffness: 200,
  damping: 20,
  duration: 0.4
}
// Creates bouncy, responsive feel
```

### Staggered Content
```typescript
{
  staggerChildren: 0.1,
  delayChildren: 0.2
}
```

## Responsive Breakpoints

### Mobile Considerations
```typescript
max-w-2xl        // Wide on desktop, full on mobile via mx-4
max-h-[90vh]     // 90% of viewport height
mx-4             // 1rem margin on sides
```

### Overflow Handling
```typescript
overflow-auto    // Scroll if content exceeds viewport
max-h-[90vh]     // Cap height to prevent overflow
```

## Color Palette

### Gradients Used
```
Cyan → Purple:  from-cyan-500 to-purple-500
Cyan → Purple → Pink: from-cyan-500/20 via-purple-500/20 to-pink-500/20
```

### Opacity Values
```
Backdrop:       black/60  (60% opacity)
Glow:          white/30  (30% opacity)
Close button:  black/50  (50% opacity)
Help text:     white/60  (60% opacity)
```

## Z-Index Stack

```
z-50  ← Overlay Container (absolute position)
z-20  ← Close Button, Camera Icon
z-10  ← Image, Avatar
z-5   ← Gradient Ring
z-0   ← Background elements
```

## State Management

### Home.tsx
```typescript
const [isOverlayOpen, setIsOverlayOpen] = useState(false);
// Controls visibility of ProfileViewOverlay component
```

### ProfileViewOverlay.tsx
```typescript
const [isLoading, setIsLoading] = useState(false);
// Controls loading spinner visibility

// Effect for handling open callback
useEffect(() => {
  if (isOpen) {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (onOpen) onOpen();
      if (onPlayAudio) onPlayAudio();
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }
}, [isOpen, onOpen, onPlayAudio]);
```

## Prop Flow

```
Home.tsx
├── mergedProfile?.viewImage → ProfileViewOverlay.viewImage
├── mergedProfile?.audio → ProfileViewOverlay.audio
├── isOverlayOpen → ProfileViewOverlay.isOpen
├── () => setIsOverlayOpen(false) → ProfileViewOverlay.onClose
└── audioRef.current.play() → ProfileViewOverlay.onPlayAudio
```

## Error Handling

### Image Load Failure
```typescript
// Handled by browser fallback
// If image 404: displays broken image icon
// No specific catch needed as img tag handles it
```

### Audio Play Failure
```typescript
if (onPlayAudio) {
  onPlayAudio().catch(err => console.error("Failed to play audio:", err));
}
// Silently fails if autoplay prevented by browser
```

### Missing Configuration
```typescript
if (mergedProfile?.viewImage) {
  // Only makes avatar clickable if image configured
}
// Gracefully disables feature if not configured
```

## Performance Optimizations

### Lazy Loading
```tsx
// Image only loads when overlay opens (not on page load)
{isOpen && <img src={viewImage} ... />}
```

### GPU Acceleration
```css
/* Transform and opacity animate on GPU */
transform: scale(0.9) translateY(20px)
opacity: 0
/* Browser uses GPU for these properties */
```

### Event Delegation
```typescript
e.stopPropagation()  // Prevents unnecessary event handling
```

## Accessibility Features

### Semantic HTML
```tsx
<motion.button>  // Proper button element
<motion.div role="dialog">  // Consider for ARIA
```

### Focus States
```tsx
whileFocus={{ ... }}  // Framer Motion focus states
outline-focus-visible  // Keyboard navigation indicator
```

### Reduced Motion
```typescript
// Framer Motion respects prefers-reduced-motion
// Users with motion sensitivity won't see animations
```

## Testing Points

```typescript
// Can test:
1. Avatar click triggers setIsOverlayOpen(true)
2. viewImage prop displays correctly
3. onClose triggers setIsOverlayOpen(false)
4. onPlayAudio called on open
5. Backdrop click closes overlay
6. X button closes overlay
7. Multiple open/close cycles work
8. Image loads with proper styling
```

## Integration Checklist

- [x] Component created (ProfileViewOverlay.tsx)
- [x] Schema updated (viewImage field added)
- [x] Home.tsx integrated (import, state, handlers, render)
- [x] Avatar enhanced (click, hover effects)
- [x] Environment variable added (.env)
- [x] Documentation created (3 files)
- [x] TypeScript types correct
- [x] No console errors
- [x] Responsive on mobile
- [x] Animations smooth

---

**Everything is ready to use! Just add your image and configure VITE_VIEW_IMAGE.**
