// ========================================================
// DEVUI DATABASE & REGISTRY SCHEMAS
// Authoritative definitions for Components, CMS & Taxonomy
// ========================================================

export type ComponentStatus = 'Inbox' | 'Reference' | 'Prototype' | 'Ready' | 'Deprecated';

export type ComponentType =
  | 'element'
  | 'section'
  | 'template'
  | 'animation'
  | 'effect'
  | '3d'
  | 'icon';

export type AccessibilityStatus = 'Compliant' | 'Partial' | 'Needs Review';

export interface ResponsiveSupport {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}

export type SectionType =
  | 'elements'
  | 'navigation'
  | 'sections'
  | 'media'
  | 'animations'
  | 'data-display'
  | 'product-kits';

export interface ComponentSourceFiles {
  component: string;
  demo?: string;
  test?: string;
  meta: string;
  readme?: string;
  styles?: string;
}

export interface PropApiDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface CustomizableProps {
  text?: string;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  borderRadius?: string;
  padding?: string;
  shimmer?: boolean;
  speed?: number;
  maxTilt?: number;
  glare?: boolean;
  status?: string;
}

export interface ComponentMedia {
  type: 'live' | 'image' | 'video';
  image?: string;
  video?: string;
  poster?: string;
}

export interface ComponentMeta {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  section: SectionType;
  type?: ComponentType;
  description: string;
  tags: string[];
  framework: string;
  stylingSystem: string;
  dependencies: string[];
  version: string;
  status: ComponentStatus;
  previewReference: string;
  sourceFileLocations: ComponentSourceFiles;
  thumbnail?: string;
  variants?: string[];
  responsiveSupport?: ResponsiveSupport;
  accessibilityStatus?: AccessibilityStatus;
  themeCompatibility?: string[];
  createdAt: string;
  updatedAt: string;
  media?: ComponentMedia;
  customizableProps?: CustomizableProps;
  propsApi?: PropApiDefinition[];
  accessibilityInfo?: string;
  similarSlugs?: string[];
  saveCount?: number;
  featured?: boolean;
  ranking?: number;
  code?: {
    component: string;
    demo?: string;
    readme?: string;
    styles?: string;
  };
}

export interface CategoryDefinition {
  name: string;
  slug: string;
  section: SectionType;
  description: string;
  icon?: string;
  count?: number;
}

export interface AdminSection {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  componentSlugs: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  framework: string;
  pages: string[];
  componentSlugs: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminTheme {
  id: string;
  name: string;
  slug: string;
  description: string;
  bg: string;
  surface: string;
  border: string;
  accent: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminIcon {
  id: string;
  name: string;
  category: 'Navigation' | 'Media' | 'Actions' | 'Interface' | 'Development' | 'Badges';
  tags: string[];
  svgContent: string;
  author?: string;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  createdAt: string;
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'sync' | 'export';
  resourceType: 'component' | 'section' | 'template' | 'theme' | 'icon' | 'category';
  resourceName: string;
  details?: string;
}

export interface AdminSyncDatabase {
  customComponents: ComponentMeta[];
  deletedComponents: string[];
  customIcons: AdminIcon[];
  deletedIcons: string[];
  customCategories: AdminCategory[];
  customSections?: AdminSection[];
  customTemplates?: AdminTemplate[];
  customThemes?: AdminTheme[];
  activityLog?: AdminActivity[];
  updatedAt: string;
}
