import { SectionType } from '@/types/registry';

export interface CategoryInfo {
  name: string;
  slug: string;
  section: SectionType;
  description: string;
}

export const CATEGORIES_BY_SECTION: Record<SectionType, CategoryInfo[]> = {
  elements: [
    { name: 'Buttons', slug: 'buttons', section: 'elements', description: 'Interactive clickable trigger primitives and button variations.' },
    { name: 'Button groups', slug: 'button-groups', section: 'elements', description: 'Cohesive collections of connected actions.' },
    { name: 'Links', slug: 'links', section: 'elements', description: 'Hyperlink styles with animated underlines and indicator icons.' },
    { name: 'Inputs', slug: 'inputs', section: 'elements', description: 'Single-line data entry fields with floating labels and validation.' },
    { name: 'Textareas', slug: 'textareas', section: 'elements', description: 'Multi-line auto-expanding text input areas.' },
    { name: 'Selects', slug: 'selects', section: 'elements', description: 'Custom styled option picker dropdowns.' },
    { name: 'Checkboxes', slug: 'checkboxes', section: 'elements', description: 'Boolean state selectors and multichoice groups.' },
    { name: 'Radio buttons', slug: 'radio-buttons', section: 'elements', description: 'Single-selection toggle lists.' },
    { name: 'Toggles', slug: 'toggles', section: 'elements', description: 'Smooth animated binary switches.' },
    { name: 'Sliders', slug: 'sliders', section: 'elements', description: 'Continuous and stepped numeric range inputs.' },
    { name: 'Cards', slug: 'cards', section: 'elements', description: 'Content surface containers with 3D tilt, bento, and spotlights.' },
    { name: 'Avatars', slug: 'avatars', section: 'elements', description: 'User profile image wrappers and fallbacks.' },
    { name: 'Badges', slug: 'badges', section: 'elements', description: 'Pill tags, live pings, and metadata labels.' },
    { name: 'Lists', slug: 'lists', section: 'elements', description: 'Structured vertical sequences with drag and reordering.' },
    { name: 'Tables', slug: 'tables', section: 'elements', description: 'Grid-based relational data presentation.' },
    { name: 'Charts', slug: 'charts', section: 'elements', description: 'SVG data visualizations and analytics sparklines.' },
    { name: 'Tooltips', slug: 'tooltips', section: 'elements', description: 'Contextual floating helper popups on hover.' },
    { name: 'Dropdowns', slug: 'dropdowns', section: 'elements', description: 'Contextual popover menu options.' },
    { name: 'Accordions', slug: 'accordions', section: 'elements', description: 'Collapsible vertical content disclosure panels.' },
    { name: 'Modals', slug: 'modals', section: 'elements', description: 'High-focus overlay dialogues with animated backdrops.' },
    { name: 'Dialogs', slug: 'dialogs', section: 'elements', description: 'Accessible alert and confirmation prompts.' },
    { name: 'Toasts', slug: 'toasts', section: 'elements', description: 'Ephemeral non-blocking status notifications.' },
    { name: 'Alerts', slug: 'alerts', section: 'elements', description: 'Prominent inline warning, error, and info callouts.' },
    { name: 'Loaders', slug: 'loaders', section: 'elements', description: 'Progress spinners, skeletons, and pulse bars.' },
    { name: 'Progress indicators', slug: 'progress-indicators', section: 'elements', description: 'Percentage meters and stepped progress flows.' },
    { name: 'Empty states', slug: 'empty-states', section: 'elements', description: 'Clean illustrations and instructions for empty views.' },
  ],
  navigation: [
    { name: 'Navigation bars', slug: 'navigation-bars', section: 'navigation', description: 'Top headers, floating docks, and primary nav.' },
    { name: 'Sidebars', slug: 'sidebars', section: 'navigation', description: 'Vertical multi-tier collapsible application menus.' },
    { name: 'Menus', slug: 'menus', section: 'navigation', description: 'Multi-level contextual flyout menus.' },
    { name: 'Tabs', slug: 'tabs', section: 'navigation', description: 'Animated sliding indicator view switchers.' },
    { name: 'Breadcrumbs', slug: 'breadcrumbs', section: 'navigation', description: 'Hierarchical navigation trail indicators.' },
    { name: 'Pagination', slug: 'pagination', section: 'navigation', description: 'Multi-page data navigation controls.' },
  ],
  sections: [
    { name: 'Hero sections', slug: 'hero-sections', section: 'sections', description: 'High-impact landing page introductions.' },
    { name: 'Feature sections', slug: 'feature-sections', section: 'sections', description: 'Product capability showcase layouts.' },
    { name: 'Pricing sections', slug: 'pricing-sections', section: 'sections', description: 'Tiered subscription comparison tables.' },
    { name: 'Testimonials', slug: 'testimonials', section: 'sections', description: 'Customer quotes, reviews, and social proof.' },
    { name: 'FAQ', slug: 'faq', section: 'sections', description: 'Frequently asked questions accordions.' },
    { name: 'Headers', slug: 'headers', section: 'sections', description: 'Marketing site and documentation headers.' },
    { name: 'Footers', slug: 'footers', section: 'sections', description: 'Site indexes, legal links, and social icon footers.' },
  ],
  media: [
    { name: 'Image galleries', slug: 'image-galleries', section: 'media', description: 'Responsive media showcase matrices.' },
    { name: 'Carousels', slug: 'carousels', section: 'media', description: 'Touch and swipe horizontal slider feeds.' },
    { name: 'Image grids', slug: 'image-grids', section: 'media', description: 'Masonry and balanced visual layouts.' },
    { name: 'Product galleries', slug: 'product-galleries', section: 'media', description: 'E-commerce zoom and thumbnail switchers.' },
    { name: 'Video components', slug: 'video-components', section: 'media', description: 'Custom player frames and background loopers.' },
    { name: 'Lightboxes', slug: 'lightboxes', section: 'media', description: 'Full-screen zoomable media overlays.' },
  ],
  animations: [
    { name: 'Text animations', slug: 'text-animations', section: 'animations', description: 'Gradient shimmers, typewriter, and word reveals.' },
    { name: 'Scroll animations', slug: 'scroll-animations', section: 'animations', description: 'Viewport triggered parallax and entrance effects.' },
    { name: 'Hover animations', slug: 'hover-animations', section: 'animations', description: 'Spring physics, scale, and magnetic effects.' },
    { name: 'Cursor effects', slug: 'cursor-effects', section: 'animations', description: 'Custom cursor trails and magnetic attraction.' },
    { name: 'Background effects', slug: 'background-effects', section: 'animations', description: 'Noise grain overlays, grids, and dot patterns.' },
    { name: 'Page transitions', slug: 'page-transitions', section: 'animations', description: 'Seamless route enter/exit layout animations.' },
    { name: 'Loading animations', slug: 'loading-animations', section: 'animations', description: 'Tactile skeleton loaders and particle spinners.' },
    { name: '3D effects', slug: '3d-effects', section: 'animations', description: 'Three.js / WebGL canvas particle scenes.' },
  ],
  'data-display': [
    { name: 'Statistics', slug: 'statistics', section: 'data-display', description: 'KPI cards with delta trends and sparklines.' },
    { name: 'Timelines', slug: 'timelines', section: 'data-display', description: 'Vertical chronological activity logs.' },
    { name: 'Data tables', slug: 'data-tables', section: 'data-display', description: 'Sortable, filterable developer grids.' },
    { name: 'Charts', slug: 'charts', section: 'data-display', description: 'Interactive time-series visualizations.' },
    { name: 'Terminal interfaces', slug: 'terminal-interfaces', section: 'data-display', description: 'Command line emulators and shell outputs.' },
  ],
  'product-kits': [
    { name: 'E-commerce', slug: 'e-commerce', section: 'product-kits', description: 'Storefront product cards, cart sliders, checkout.' },
    { name: 'SaaS', slug: 'saas', section: 'product-kits', description: 'Dashboard headers, API key managers, usage meters.' },
    { name: 'Portfolio', slug: 'portfolio', section: 'product-kits', description: 'Developer project showcases and bio modules.' },
    { name: 'Restaurant', slug: 'restaurant', section: 'product-kits', description: 'Digital menu, reservations, and location card.' },
    { name: 'Dashboard', slug: 'dashboard', section: 'product-kits', description: 'Full analytics cockpit layouts.' },
    { name: 'Landing pages', slug: 'landing-pages', section: 'product-kits', description: 'Complete high-conversion one-page kits.' },
  ],
};

export const ALL_CATEGORIES: CategoryInfo[] = Object.values(CATEGORIES_BY_SECTION).flat();

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return ALL_CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}
