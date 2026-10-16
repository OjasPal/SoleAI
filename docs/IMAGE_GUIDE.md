# Footwear Product Photography & Asset Guide

This guide establishes the visual specification for product photography produced for the SoleAI D2C footwear storefront.

---

## 1. Composition & Camera Angle

- **Primary Angle**: Three-quarter hero profile angle (approx. 35° azimuth, 15° elevation above horizontal plane) showing the lateral silhouette, toe curve, collar depth, and outsole profile simultaneously.
- **Secondary Views**:
  - Direct lateral side profile (outsole level).
  - Overhead bird's-eye view (collar opening, footbed, toe box contour).
  - Outsole tread texture macro detail.
- **Focal Length**: 85mm to 105mm prime lens on 35mm full-frame equivalent to ensure zero perspective distortion and accurate scale rendering of toe and heel proportions.

---

## 2. Backdrop & Environment

- **Backdrop**: Seamless deep matte black sweep (#000000 to #040405) with zero specular sheen or texture reflections.
- **Ground Plane**: Faint diffused floor reflection under the outsole contact points (decaying within 15% of shoe height).
- **Lighting**:
  - Key light: Overhead softbox (strip light) casting a soft top edge highlight along the leather collar and tongue.
  - Rim light: Subtle neutral rim light separating the heel counter and outsole from the black background.
  - Fill light: Low-contrast diffused fill preserving texture depth in dark leathers and suede nap.
  - No dramatic color gels, neon halos, or artificial lens flares.

---

## 3. Crop & Framing Consistency

- **Aspect Ratio**: Exact 4:5 vertical ratio (width : height).
- **Subject Bounding**: The footwear item must occupy exactly 72% of the canvas width, centered horizontally with the outsole baseline resting at 28% from the bottom margin.
- **Orientation**: By default, left-facing shoe for primary catalog listing.

---

## 4. Technical File Specification

| Property | Value |
|---|---|
| **File Format** | WebP (85% quality factor, lossy) |
| **Resolution** | 2000px × 2500px |
| **Color Space** | sRGB IEC61966-2.1 |
| **Bit Depth** | 8-bit per channel |
| **Naming Convention** | `/products/<slug>-1.webp`, `/products/<slug>-2.webp` |
| **Fallback Asset** | Designed vector SVG silhouette fallback embedded in `ProductImage.tsx` |

---

## 5. Clean Background Policy

Never shoot with distracting lifestyle props, fake plants, colored studio pedestals, or harsh direct camera flash. Let the materials (pebble grain, pull-up nappa, waxed suede, EVA foam) convey quality.
