import { projects, type Project } from '../data/projects';
import { getMarkerPosition } from '../lib/map-geometry';
import { getProjectSlugFromHash } from './project-fragment';

const activeMaps = new WeakMap<HTMLElement, () => void>();

export function initProjectMap(root: HTMLElement): () => void {
  activeMaps.get(root)?.();

  const mapControls = root.querySelector<HTMLElement>('[data-map-controls]');
  const listControls = root.querySelector<HTMLElement>('[data-project-list-controls]');
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-project-slug]'));
  const stories = Array.from(root.querySelectorAll<HTMLElement>('[data-project-story]'));
  const status = root.querySelector<HTMLElement>('[data-map-status]');
  if (!mapControls || !listControls || !status || buttons.length === 0 || stories.length === 0) {
    return () => undefined;
  }

  const availableProjects: Array<{ project: Project; leftPercent: number; topPercent: number }> = [];
  for (const project of projects) {
    const path = root.querySelector<SVGPathElement>(`[data-county-id="${project.countyId}"]`);
    if (!path) return () => undefined;
    const position = getMarkerPosition(path.getBBox(), 613, 433);
    if (!position) return () => undefined;
    availableProjects.push({ project, ...position });
  }

  const availableSlugs = availableProjects.map(({ project }) => project.slug);
  const firstSlug = availableProjects[0].project.slug;
  const selectedProject = (slug: string | undefined) => projects.find((project) => project.slug === slug);
  const listeners: Array<{ button: HTMLButtonElement; listener: () => void }> = [];
  let selectedSlug: string | undefined;
  let alignmentFrame: number | undefined;

  const alignStory = (slug: string) => {
    if (alignmentFrame !== undefined) cancelAnimationFrame(alignmentFrame);
    alignmentFrame = requestAnimationFrame(() => {
      alignmentFrame = undefined;
      stories.find((story) => story.id === `proiect-${slug}`)?.scrollIntoView({ block: 'start' });
    });
  };
  const select = (slug: string, announce = true) => {
    const project = selectedProject(slug);
    if (!project || !availableProjects.some((available) => available.project.slug === slug)) return;
    selectedSlug = slug;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.projectSlug === slug));
    for (const story of stories) story.hidden = story.id !== `proiect-${slug}`;
    for (const path of root.querySelectorAll<SVGPathElement>('[data-county-id]')) {
      path.toggleAttribute('data-selected-county', path.dataset.countyId === project.countyId);
    }
    if (announce) status.textContent = `Localități selectate: ${project.countyLabel} — ${project.localities.join(', ')}.`;
  };

  const mapButtons = new Map<string, HTMLButtonElement>();
  for (const button of mapControls.querySelectorAll<HTMLButtonElement>('button[data-project-slug]')) {
    const slug = button.dataset.projectSlug;
    const available = availableProjects.find(({ project }) => project.slug === slug);
    if (!slug || !available) continue;
    button.style.left = `${available.leftPercent}%`;
    button.style.top = `${available.topPercent}%`;
    button.hidden = false;
    mapButtons.set(slug, button);
  }
  if (mapButtons.size !== projects.length) return () => undefined;

  for (const button of buttons) {
    const listener = () => {
      if (button.dataset.projectSlug) select(button.dataset.projectSlug);
    };
    button.addEventListener('click', listener);
    listeners.push({ button, listener });
  }

  const handleHashChange = () => {
    const fragmentSlug = getProjectSlugFromHash(window.location.hash, availableSlugs);
    if (!fragmentSlug && window.location.hash) return;
    const nextSlug = fragmentSlug ?? firstSlug;
    select(nextSlug);
    alignStory(nextSlug);
  };

  mapControls.hidden = false;
  listControls.hidden = false;
  root.dataset.mapReady = 'true';
  const initialFragmentSlug = getProjectSlugFromHash(window.location.hash, availableSlugs);
  select(initialFragmentSlug ?? firstSlug, false);
  if (initialFragmentSlug) alignStory(initialFragmentSlug);
  window.addEventListener('hashchange', handleHashChange);

  const cleanup = () => {
    window.removeEventListener('hashchange', handleHashChange);
    if (alignmentFrame !== undefined) cancelAnimationFrame(alignmentFrame);
    alignmentFrame = undefined;
    for (const { button, listener } of listeners) button.removeEventListener('click', listener);
    for (const button of buttons) button.setAttribute('aria-pressed', 'false');
    for (const button of mapButtons.values()) {
      button.hidden = true;
      button.style.removeProperty('left');
      button.style.removeProperty('top');
    }
    for (const story of stories) story.hidden = false;
    for (const path of root.querySelectorAll<SVGPathElement>('[data-selected-county]')) {
      path.removeAttribute('data-selected-county');
    }
    mapControls.hidden = true;
    listControls.hidden = true;
    if (selectedSlug) status.textContent = '';
    delete root.dataset.mapReady;
    activeMaps.delete(root);
  };
  activeMaps.set(root, cleanup);
  return cleanup;
}
