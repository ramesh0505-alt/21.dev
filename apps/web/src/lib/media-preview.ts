export interface ComponentMediaSlot {
  imageUrl: string;
  videoUrl?: string;
  duration?: string;
  caption: string;
}

// Curated high-res visual image and video demo assets for each component
export const COMPONENT_MEDIA_MAP: Record<string, ComponentMediaSlot> = {
  'clothing-rail': {
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clothes-hanging-on-a-rack-41584-large.mp4',
    duration: '0:14',
    caption: 'Interactive clothing rail showcase with tactile hangers and price tags',
  },
  'coffee-menu': {
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barista-pouring-coffee-into-a-cup-41539-large.mp4',
    duration: '0:18',
    caption: 'Dynamic coffee pouring selection with roast origins and notes',
  },
  'sushi-bar': {
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-making-sushi-in-a-kitchen-41489-large.mp4',
    duration: '0:12',
    caption: 'Conveyor sushi bar orbital layout with motorized plate rotation',
  },
  'lanyard-roster': {
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    duration: '0:10',
    caption: 'Team credential lanyard rack with dynamic spring physics and QR code flip',
  },
  'domino-gallery': {
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    duration: '0:15',
    caption: 'Cascading domino card stagger with 3D tilt perspective',
  },
  'polaroid-gallery': {
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop',
    duration: '0:20',
    caption: 'Vintage clothesline polaroid gallery with random pin tilts and string sag',
  },
  'card-stack': {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    duration: '0:16',
    caption: '3D stacked cards interface with tactile drag and peel gesture',
  },
  'hero-geometric': {
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-network-loop-42205-large.mp4',
    duration: '0:22',
    caption: 'High-impact landing hero with floating geometric facets and grain shaders',
  },
  'coverflow-carousel': {
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    duration: '0:12',
    caption: 'Apple-inspired 3D coverflow ring with angle falloff and depth reflection',
  },
  'bento-grid': {
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    duration: '0:14',
    caption: 'Modular bento feature grid with animated metrics and spotlight borders',
  },
  'floating-dock': {
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    duration: '0:08',
    caption: 'macOS-style magnification dock navigation bar with mouse proximity falloff',
  },
  'terminal-window': {
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop',
    duration: '0:30',
    caption: 'Developer command-line terminal window with interactive tabs and syntax typing',
  },
  'text-shimmer': {
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    duration: '0:06',
    caption: 'Kinetic shimmering linear text reveal with glowing light angle',
  },
  'animated-testimonials': {
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    duration: '0:12',
    caption: '3D animated review card stack with Gaussian blur scale transitions',
  },
  'status-badge': {
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    duration: '0:05',
    caption: 'Sub-millisecond status badge with live radar ping beacon',
  },
};

export function getComponentMedia(slug: string, name?: string): ComponentMediaSlot {
  if (COMPONENT_MEDIA_MAP[slug]) {
    return COMPONENT_MEDIA_MAP[slug];
  }

  // Fallback beautiful graphic media slot
  return {
    imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop`,
    duration: '0:10',
    caption: `${name || slug} visual component preview and interactive demonstration`,
  };
}
