import { nextPhotoIndex } from './gallery-state';

const activeGalleries = new WeakMap<HTMLElement, () => void>();

export function initCountyGallery(root: HTMLElement): () => void {
  activeGalleries.get(root)?.();

  const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  const openers = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-gallery-open]'));
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
  const counter = root.querySelector<HTMLElement>('[data-gallery-counter]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-gallery-close]');
  const previousButton = root.querySelector<HTMLButtonElement>('[data-gallery-previous]');
  const nextButton = root.querySelector<HTMLButtonElement>('[data-gallery-next]');
  if (!dialog || !counter || !closeButton || !previousButton || !nextButton
    || openers.length === 0 || openers.length !== slides.length) return () => undefined;

  let currentIndex = 0;
  let opener: HTMLAnchorElement | undefined;
  let previousOverflow = '';

  const selectPhoto = (index: number) => {
    currentIndex = index;
    for (const [slideIndex, slide] of slides.entries()) slide.hidden = slideIndex !== index;
    counter.textContent = `${index + 1} / ${slides.length}`;
  };
  const move = (direction: number) => {
    selectPhoto(nextPhotoIndex(currentIndex, direction, slides.length));
  };
  const close = () => dialog.close();
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };
  const handleBackdrop = (event: MouseEvent) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  };
  const restoreFocus = () => {
    document.body.style.overflow = previousOverflow;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };
  const openerListeners: Array<{ anchor: HTMLAnchorElement; listener: (event: MouseEvent) => void }> = [];
  for (const anchor of openers) {
    const listener = (event: MouseEvent) => {
      if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
        || typeof dialog.showModal !== 'function') return;
      const index = Number(anchor.dataset.galleryOpen);
      if (!Number.isInteger(index) || !slides[index]) return;
      event.preventDefault();
      opener = anchor;
      selectPhoto(index);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    };
    anchor.addEventListener('click', listener);
    openerListeners.push({ anchor, listener });
  }
  const previousPhoto = () => move(-1);
  const nextPhoto = () => move(1);
  previousButton.addEventListener('click', previousPhoto);
  nextButton.addEventListener('click', nextPhoto);
  closeButton.addEventListener('click', close);
  dialog.addEventListener('keydown', handleKeydown);
  dialog.addEventListener('click', handleBackdrop);
  dialog.addEventListener('close', restoreFocus);

  const cleanup = () => {
    for (const { anchor, listener } of openerListeners) anchor.removeEventListener('click', listener);
    previousButton.removeEventListener('click', previousPhoto);
    nextButton.removeEventListener('click', nextPhoto);
    closeButton.removeEventListener('click', close);
    dialog.removeEventListener('keydown', handleKeydown);
    dialog.removeEventListener('click', handleBackdrop);
    dialog.removeEventListener('close', restoreFocus);
    if (dialog.open) {
      dialog.close();
      restoreFocus();
    }
    activeGalleries.delete(root);
  };
  activeGalleries.set(root, cleanup);
  return cleanup;
}
