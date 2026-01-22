# Quick Setup Guide: Click-to-View Profile Feature

## What Was Added?

A new interactive overlay system that appears when users click the profile avatar. The overlay displays a custom GIF or JPG image and automatically plays the profile music.

## Files Modified/Created

### New Files
- `client/src/components/ProfileViewOverlay.tsx` - The overlay modal component
- `CLICK_TO_VIEW_FEATURE.md` - Complete feature documentation

### Modified Files
- `shared/schema.ts` - Added `viewImage` field to profile schema
- `client/src/pages/Home.tsx` - Integrated overlay component and avatar click handler
- `.env` - Added `VITE_VIEW_IMAGE` configuration

## Quick Start (3 Steps)

### Step 1: Prepare Your Image
Save your GIF or JPG image to:
```
client/public/assets/view-image.gif
```

Supported formats:
- GIF (recommended for animation)
- JPG/JPEG
- PNG
- WebP

### Step 2: Update Environment Variable
Edit `.env`:
```env
VITE_VIEW_IMAGE=/assets/view-image.gif
```

### Step 3: That's It!
When you start the app (`npm run dev`), clicking the avatar will open the overlay with your image and play the audio.

## Features Included

✅ **Interactive Avatar Click Detection**
- Avatar becomes clickable with visual feedback
- Rotating gradient ring animation on hover
- Camera icon appears on hover

✅ **Smooth Overlay Modal**
- Fade and scale animations
- Blur backdrop
- Click outside or X button to close

✅ **Auto-Play Audio**
- Music automatically plays when overlay opens
- Uses your existing audio configuration
- Respects browser autoplay policies

✅ **Responsive Design**
- Works on mobile and desktop
- Touch-friendly interactions
- Proper z-index layering

## Configuration Options

### In `.env` File:

```env
# Required: Path to your click-to-view image
VITE_VIEW_IMAGE=/assets/view-image.gif

# Already configured - uses this for audio:
VITE_AUDIO_SRC=/assets/audio.mp3
```

### Leave Empty to Disable:
```env
VITE_VIEW_IMAGE=
```

## Visual Behavior

### Avatar Hover State
- Rotating gradient border (cyan → purple → pink)
- Cyan/purple glow shadow
- Camera icon button appears
- Cursor changes to pointer

### Overlay Opening
- Smooth fade in (300ms)
- Scale animation (0.9 → 1)
- Centered on screen
- Semi-transparent dark backdrop

### Overlay Content
- Full-width image display
- Loading spinner during load
- Animated glow border
- Help text at bottom

## Testing

Start the development server:
```bash
npm run dev
```

Then:
1. Click the profile avatar
2. The overlay should fade in with your image
3. Audio should start playing (if browser allows autoplay)
4. Click outside or the X button to close

## Example Images

You can use:
- **Animated GIFs**: Loop forever, great for dynamic content
- **High-quality JPGs**: Full resolution artwork
- **Wide-angle photos**: Panoramic profile shots
- **Album artwork**: Music-related imagery
- **Custom graphics**: Designed overlays

## Customization

### Change Animation Speed
Edit `client/src/components/ProfileViewOverlay.tsx`:
```typescript
transition={{ 
  duration: 0.4,  // Change this value (in seconds)
  type: "spring",
  stiffness: 200,
  damping: 20
}}
```

### Change Glow Colors
Edit gradient in ProfileViewOverlay:
```typescript
className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
```

### Change Backdrop Darkness
```typescript
className="absolute inset-0 bg-black/60"  // Change 60 to 40-80
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not showing | Check path in `.env` and verify file exists in `client/public/assets/` |
| Click doesn't work | Verify `VITE_VIEW_IMAGE` is set in `.env` |
| Audio not playing | Check `VITE_AUDIO_SRC` exists, some browsers block autoplay without user interaction |
| Overlay looks wrong | Clear browser cache and rebuild with `npm run build` |

## Next Steps

- 🎨 Add your custom image to `client/public/assets/`
- ⚙️ Configure `VITE_VIEW_IMAGE` in `.env`
- 🧪 Test by running `npm run dev`
- 📱 Test on mobile devices
- 🚀 Deploy with `npm run build && npm run start`

## Support

For detailed documentation, see: `CLICK_TO_VIEW_FEATURE.md`

Questions? Check the feature documentation or review the component code:
- Component: `client/src/components/ProfileViewOverlay.tsx`
- Integration: `client/src/pages/Home.tsx` (search for "ProfileViewOverlay")
