/**
 * Cloudinary High-Performance Image Optimization Pipeline
 * 
 * Generates dynamic, on-the-fly Cloudinary CDN transformations:
 * - Next-Gen AVIF / WebP automatic format negotiation (f_auto)
 * - Perceptual SSIM visual compression (q_auto:good)
 * - Container-constrained pixel limits (w_..., c_limit)
 * - Ultra-lightweight ~400-byte Low-Quality Image Placeholders (LQIP)
 * - Responsive srcset generation for Retina and mobile screens
 */

/**
 * Returns a Cloudinary-optimized URL for any image.
 * If the URL is not a Cloudinary upload, returns the original URL.
 * 
 * @param {string} url - Original image URL
 * @param {Object} options - Transformation options
 * @param {number} [options.width=900] - Target bounding width
 * @param {string} [options.quality='auto:good'] - Quality preset
 * @param {string} [options.crop='limit'] - Cloudinary crop mode
 * @param {boolean} [options.lqip=false] - Generate a 50px blurred LQIP placeholder
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return ''

  const {
    width = 900,
    quality = 'auto:good',
    crop = 'limit',
    lqip = false,
  } = options

  // Handle Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid double-injecting transformations if already present
    if (url.match(/\/upload\/(?:[a-z]_[a-z0-9:,_-]+\/)+/i)) {
      return url
    }

    const transform = lqip
      ? 'f_auto,q_auto:eco,w_50,c_limit,e_blur:500'
      : `f_auto,q_${quality},w_${width},c_${crop}`

    return url.replace('/upload/', `/upload/${transform}/`)
  }

  // Handle Unsplash CDN URLs
  if (url.includes('images.unsplash.com')) {
    const cleanUrl = url.split('?')[0]
    return lqip
      ? `${cleanUrl}?auto=format&fit=crop&w=50&q=20&blur=30`
      : `${cleanUrl}?auto=format&fit=crop&w=${width}&q=80`
  }

  return url
}

/**
 * Generates a responsive srcset string with multiple resolution stops
 * e.g., 450w for mobile, 800w for tablet, 1200w for Retina desktop
 * 
 * @param {string} url - Original image URL
 * @param {number[]} widths - Array of widths
 * @returns {string} HTML srcset value
 */
export function getResponsiveSrcSet(url, widths = [450, 800, 1200]) {
  if (!url || typeof url !== 'string') return ''
  if (!url.includes('res.cloudinary.com')) return ''

  return widths
    .map((w) => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ')
}
