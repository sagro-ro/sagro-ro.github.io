const cleanups = new WeakMap<HTMLElement, () => void>();
const desktop = window.matchMedia('(min-width: 70rem)');

export function initSiteMenu(root: ParentNode = document): () => void {
  const toggle = root.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = root.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return () => {};
  const existing = cleanups.get(toggle);
  if (existing) return existing;

  let open = false;
  const getFocusable = () => [toggle, ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];

  const setOpen = (next: boolean, restoreFocus = false) => {
    open = next && !desktop.matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector<HTMLElement>('a[href]')?.focus();
    if (!open && restoreFocus) toggle.focus();
  };

  const onToggle = () => setOpen(!open);
  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = getFocusable();
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };
  const onMenuClick = (event: Event) => {
    if ((event.target as Element).closest('a[href]')) setOpen(false);
  };
  const onDesktopChange = () => { if (desktop.matches) setOpen(false); };

  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onDocumentKeydown);
  menu.addEventListener('click', onMenuClick);
  desktop.addEventListener('change', onDesktopChange);

  const cleanup = () => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onDocumentKeydown);
    menu.removeEventListener('click', onMenuClick);
    desktop.removeEventListener('change', onDesktopChange);
    setOpen(false);
    cleanups.delete(toggle);
  };
  cleanups.set(toggle, cleanup);
  return cleanup;
}
