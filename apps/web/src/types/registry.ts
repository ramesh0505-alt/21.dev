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
