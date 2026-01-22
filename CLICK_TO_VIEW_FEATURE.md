# Click-to-View Profile Overlay Feature

## Overview
The click-to-view overlay feature allows users to click on the profile avatar to reveal a modal overlay with a custom GIF or JPG image and automatically play the profile audio. This creates an interactive "reveal" effect similar to guns.lol profiles.

## Features
- **Interactive Avatar**: The avatar becomes clickable with visual hover feedback
- **Animated Overlay**: Smooth fade and scale animations for the modal
- **Auto-play Audio**: Music automatically plays when the overlay opens
- **Custom Image Support**: Supports GIF, JPG, and other image formats
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Close Functionality**: Users can close the overlay by clicking outside or pressing the X button

## Configuration

### 1. Environment Variable
Add the following to your `.env` file:

```env
# Path to your GIF or JPG image (supports relative paths)
VITE_VIEW_IMAGE=/assets/view-image.gif
```

### 2. Place Your Image
Store your GIF or JPG image in the `client/public/assets/` directory:

```
client/public/assets/
├── view-image.gif          # Your click-to-view image
├── album-cover.jpg         # Profile avatar
└── ...other assets
```

### 3. Audio Configuration
The feature automatically uses your existing audio configuration:

```env
VITE_AUDIO_SRC=/assets/audio.mp3
```

When the overlay opens, it will play the audio specified in your profile configuration.

## Database Schema

The profile schema now includes a `viewImage` field:

```typescript
viewImage: text("view_image").default(""), // GIF or JPG for click-to-view overlay
```

This can be stored in the PostgreSQL database or configured via environment variables.

## Component Structure

### ProfileViewOverlay Component
Located in: `client/src/components/ProfileViewOverlay.tsx`

**Props:**
```typescript
interface ProfileViewOverlayProps {
  isOpen: boolean;              // Controls overlay visibility
  onClose: () => void;          // Callback when overlay closes
  viewImage?: string;           // URL to the image to display
  onOpen?: () => void;          // Optional callback when overlay opens
  audio?: Profile["audio"];     // Audio configuration
  onPlayAudio?: () => Promise<void>;  // Callback to play audio
}
```

### Integration in Home.tsx
The overlay is integrated into the main Home component with:

- **State Management**: `isOverlayOpen` tracks overlay visibility
- **Handler**: `handleAvatarClick()` opens the overlay when avatar is clicked
- **Visual Indicators**: 
  - Rotating gradient ring on hover
  - Camera icon button appears on hover
  - Cyan/purple glow effect on avatar

## Visual Effects

### Hover Effects
When hovering over the avatar:
- Rotating gradient border (cyan → purple → pink)
- Cyan glow shadow effect
- Camera icon appears at bottom-right
- Cursor changes to pointer

### Overlay Animation
When opening:
- Smooth opacity fade-in
- Scale animation (0.9 → 1)
- Backdrop blur effect
- Staggered content animation

### Interactive Elements
- **Close Button**: Top-right X button with hover scale effect
- **Backdrop Click**: Click outside to close
- **Loading State**: Spinner and "Loading..." text during initial load

## Usage Examples

### Basic Setup
```env
VITE_VIEW_IMAGE=/assets/your-image.gif
VITE_AUDIO_SRC=/assets/your-music.mp3
```

### Advanced: Using Different Images
You can serve different images based on user or profile:

```typescript
// In environment variables
VITE_VIEW_IMAGE=/assets/animated-profile.gif
```

### Disable Feature
Simply leave `VITE_VIEW_IMAGE` empty:

```env
VITE_VIEW_IMAGE=
```

The avatar will remain interactive but won't open the overlay.

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with backdrop-filter support

## Performance Notes
- Images are lazy-loaded only when overlay opens
- Animations use GPU-accelerated properties (transform, opacity)
- Backdrop blur is handled by native CSS backdrop-filter
- No additional dependencies beyond existing (Framer Motion, Lucide Icons)

## Customization

### Modify Overlay Styling
Edit `client/src/components/ProfileViewOverlay.tsx`:

```typescript
// Change animation speed
transition={{ duration: 0.4, ... }}

// Adjust backdrop blur
className="absolute inset-0 bg-black/60 backdrop-blur-sm"

// Customize glow colors
className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
```

### Modify Avatar Indicators
Edit avatar section in `Home.tsx`:

```typescript
// Change camera icon to different icon
<Camera className="w-3 h-3 text-white" />

// Adjust glow intensity
className="group-hover:shadow-cyan-500/50"
```

## Troubleshooting

### Image Not Loading
- Check image path is relative to `client/public/`
- Verify image format (GIF, JPG, PNG supported)
- Check browser console for 404 errors

### Audio Not Playing
- Ensure `VITE_AUDIO_SRC` is configured
- Check browser's autoplay policy (some browsers require user interaction)
- Audio may fail silently if blocked by browser restrictions

### Overlay Not Opening
- Verify `VITE_VIEW_IMAGE` is configured
- Check browser console for JavaScript errors
- Ensure avatar click handler is not prevented by parent elements

## Future Enhancements
- Video support for overlay (MP4, WebM)
- Swipe gestures for mobile
- Keyboard navigation (arrow keys to close)
- Custom animations per profile
- Gallery mode (multiple images)
