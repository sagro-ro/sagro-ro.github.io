const activeReveals = new WeakMap<ParentNode, () => void>();

export function initReveals(root: ParentNode = document): () => void {
  activeReveals.get(root)?.();

  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) || elements.length === 0) {
    return () => undefined;
  }

  for (const element of elements) element.dataset.revealPending = 'true';

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target as HTMLElement;
      element.dataset.revealPending = 'false';
      observer.unobserve(element);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  for (const element of elements) observer.observe(element);

  const cleanup = () => {
    observer.disconnect();
    for (const element of elements) delete element.dataset.revealPending;
    activeReveals.delete(root);
  };
  activeReveals.set(root, cleanup);
  return cleanup;
}
