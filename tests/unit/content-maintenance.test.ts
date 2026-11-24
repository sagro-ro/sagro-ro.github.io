import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readme = await readFile(new URL('../../README.md', import.meta.url), 'utf8');
const contentAudit = await readFile(new URL('../../docs/content-audit.md', import.meta.url), 'utf8');

describe('current supplied-locality maintenance guidance', () => {
  it('documents the five-field county model and supplied-list provenance instead of rich project stories', () => {
    expect(readme).toContain('### Update supplied implementation localities');
    expect(readme).toContain('13 supplied localities');
    expect(readme).toContain('slug`, `countyId`, `countyLabel`, `localities`, `sourceUrl');
    expect(readme).toMatch(/not independently verified/i);
    expect(readme).not.toContain('three documented projects');
    expect(readme).not.toContain('### Add a documented project');
    expect(readme).not.toContain('client label, county ID, system label, factual summary');
    expect(readme).not.toContain('source-derived quotation');
  });

  it('explicitly supersedes the historical project-source follow-up with the current supplied-list model', () => {
    expect(contentAudit).toMatch(/superseded/i);
    expect(contentAudit).toContain('six-county/13-locality');
    expect(contentAudit).toMatch(/No old statement in this audit supports or independently verifies the supplied localities/i);
  });
});
