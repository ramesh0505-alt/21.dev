'use client';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ComponentMeta } from '@/types/registry';

export async function downloadComponentZip(component: ComponentMeta) {
  const zip = new JSZip();

  // Root folder for the component package
  const folder = zip.folder(component.slug);
  if (!folder) return;

  // 1. Add component source file
  const componentFileName = `${component.slug}.tsx`;
  folder.file(componentFileName, component.code?.component || '// Component source unavailable');

  // 2. Add demo file if available
  if (component.code?.demo) {
    folder.file(`${component.slug}.demo.tsx`, component.code.demo);
  }

  // 3. Add styles if available
  if (component.code?.styles) {
    folder.file('styles.css', component.code.styles);
  }

  // 4. Add index.ts
  const indexTsContent = `export * from './${component.slug}';\n${
    component.code?.demo ? `export * from './${component.slug}.demo';\n` : ''
  }`;
  folder.file('index.ts', indexTsContent);

  // 5. Add meta.json
  const metaClean = {
    id: component.id,
    name: component.name,
    slug: component.slug,
    category: component.category,
    section: component.section,
    description: component.description,
    tags: component.tags,
    framework: component.framework,
    stylingSystem: component.stylingSystem,
    dependencies: component.dependencies,
    version: component.version,
    status: component.status,
  };
  folder.file('meta.json', JSON.stringify(metaClean, null, 2));

  // 6. Add README.md with comprehensive installation instructions
  const readmeContent =
    component.code?.readme ||
    `# ${component.name}

${component.description}

## Installation

\`\`\`bash
pnpm add ${component.dependencies.join(' ')}
\`\`\`

## Usage

Copy \`${componentFileName}\` into your project's \`components/ui/\` directory.

\`\`\`tsx
import { ${component.name.replace(/\s+/g, '')} } from '@/components/ui/${component.slug}';

export default function Example() {
  return <${component.name.replace(/\s+/g, '')} />;
}
\`\`\`
`;
  folder.file('README.md', readmeContent);

  // 7. Add package.json with exact dependency specifications
  const packageJson = {
    name: `@ui-library/${component.slug}`,
    version: component.version,
    description: component.description,
    main: './index.ts',
    types: './index.ts',
    peerDependencies: {
      react: '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    dependencies: component.dependencies.reduce((acc, dep) => {
      acc[dep] = 'latest';
      return acc;
    }, {} as Record<string, string>),
  };
  folder.file('package.json', JSON.stringify(packageJson, null, 2));

  // Generate ZIP blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${component.slug}.zip`);
}
