export type ComponentStatus = 'Inbox' | 'Reference' | 'Prototype' | 'Ready' | 'Deprecated';

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

export interface ComponentMeta {
  id: string;
  name: string;
  slug: string;
  category: string;
  section: SectionType;
  description: string;
  tags: string[];
  framework: string;
  stylingSystem: string;
  dependencies: string[];
  version: string;
  status: ComponentStatus;
  previewReference: string;
  sourceFileLocations: ComponentSourceFiles;
  createdAt: string;
  updatedAt: string;
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
  count?: number;
}

