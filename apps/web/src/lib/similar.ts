import { registry } from '@/registry';
import { ComponentMeta } from '@/types/registry';

export function getSimilarComponents(slug: string, limit = 4): ComponentMeta[] {
  const current = registry.find((c) => c.slug === slug);
  if (!current) return [];

  const others = registry.filter((c) => c.slug !== slug);

  // Score components by similarity
  const scored = others.map((comp) => {
    let score = 0;

    // 1. Same category is highest signal (+10 points)
    if (comp.category.toLowerCase() === current.category.toLowerCase()) {
      score += 10;
    }

    // 2. Same section (+5 points)
    if (comp.section === current.section) {
      score += 5;
    }

    // 3. Shared tags (+2 points each)
    const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));
    for (const tag of comp.tags) {
      if (currentTags.has(tag.toLowerCase())) {
        score += 2;
      }
    }

    // 4. Shared dependencies (+1 point each)
    const currentDeps = new Set(current.dependencies.map((d) => d.toLowerCase()));
    for (const dep of comp.dependencies) {
      if (currentDeps.has(dep.toLowerCase())) {
        score += 1;
      }
    }

    return { comp, score };
  });

  // Sort by highest score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.comp);
}
