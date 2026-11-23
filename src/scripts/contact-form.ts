import { getEnquiryType } from '../lib/enquiry';
import { normalizeFormEndpoint, validateEnquiry, type EnquiryErrors, type EnquiryInput } from '../lib/contact-validation';

const labels: Record<keyof EnquiryInput, string> = {
  type: 'Tip solicitare',
  name: 'Nume și prenume',
  phone: 'Telefon',
  email: 'Adresă de e-mail',
  county: 'Județ',
  message: 'Mesaj',
  consent: 'Acord pentru prelucrarea datelor',
  website: 'Verificare formular',
};

const activeForms = new WeakMap<HTMLFormElement, () => void>();

export function initContactForm(form: HTMLFormElement): () => void {
  activeForms.get(form)?.();

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const summary = form.querySelector<HTMLElement>('[data-error-summary]');
  const summaryList = form.querySelector<HTMLUListElement>('[data-error-summary-list]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!submitButton || !submitLabel || !summary || !summaryList || !status) return () => undefined;

  const selectedType = getEnquiryType(new URL(window.location.href).searchParams);
  const selectedRadio = form.querySelector<HTMLInputElement>(`input[name="tip"][value="${selectedType}"]`);
  if (selectedRadio) selectedRadio.checked = true;

  let pending = false;
  let attempted = false;
  let disposed = false;
  let controller: AbortController | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const readInput = (): EnquiryInput => {
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '');
    return {
      type: value('tip') as EnquiryInput['type'],
      name: value('nume'),
      phone: value('telefon'),
      email: value('email'),
      county: value('judet'),
      message: value('mesaj'),
      consent: data.get('consent') === 'yes',
      website: value('website'),
    };
  };

  const applyErrors = (errors: EnquiryErrors, focusSummary = false) => {
    for (const key of Object.keys(labels) as Array<keyof EnquiryInput>) {
      const fieldId = ({ name: 'nume', phone: 'telefon', county: 'judet', message: 'mesaj', consent: 'acord' } as Partial<Record<keyof EnquiryInput, string>>)[key] ?? key;
      const errorId = `eroare-${fieldId}`;
      for (const error of form.querySelectorAll<HTMLElement>(`[data-error-for="${key}"]`)) {
        if (error.id === errorId) error.textContent = errors[key] ?? '';
      }
      for (const field of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${key}"]`)) {
        field.setAttribute('aria-invalid', String(Boolean(errors[key])));
        const descriptionIds = new Set((field.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
        if (errors[key]) descriptionIds.add(errorId);
        else descriptionIds.delete(errorId);
        if (descriptionIds.size > 0) field.setAttribute('aria-describedby', [...descriptionIds].join(' '));
        else field.removeAttribute('aria-describedby');
      }
    }

    const entries = Object.entries(errors) as Array<[keyof EnquiryInput, string]>;
    summaryList.replaceChildren();
    for (const [key, message] of entries.filter(([key]) => key !== 'website')) {
      const item = document.createElement('li');
      item.textContent = labels[key] === 'Verificare formular' ? message : `${labels[key]}: ${message}`;
      summaryList.append(item);
    }
    summary.hidden = entries.length === 0;
    if (focusSummary && entries.length > 0) summary.focus();
  };

  const onEdit = () => {
    if (!attempted || pending || disposed) return;
    applyErrors(validateEnquiry(readInput()));
  };

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (pending || disposed) return;
    const input = readInput();
    const errors = validateEnquiry(input);
    if (Object.keys(errors).length > 0) {
      attempted = true;
      applyErrors(errors, true);
      status.dataset.state = 'error';
      status.textContent = 'Verifică informațiile din formular înainte de trimitere.';
      return;
    }

    const endpoint = normalizeFormEndpoint(form.dataset.endpoint);
    if (!endpoint) {
      status.dataset.state = 'error';
      status.textContent = 'Formularul nu este conectat. Folosește numărul de telefon sau adresa de e-mail afișate.';
      return;
    }

    attempted = true;
    pending = true;
    applyErrors({});
    submitButton.disabled = true;
    submitLabel.textContent = 'Se trimite…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Se trimite solicitarea…';

    controller = new AbortController();
    const requestController = controller;
    const configuredTimeout = Number(form.dataset.timeoutMs);
    const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 12000;
    timer = setTimeout(() => requestController.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        signal: requestController.signal,
        body: JSON.stringify({
          type: input.type,
          name: input.name.trim(),
          phone: input.phone.trim(),
          email: input.email.trim(),
          county: input.county.trim(),
          message: input.message.trim(),
          consent: input.consent,
          website: input.website,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Enquiry transport failed');
      if (disposed) return;
      form.reset();
      attempted = false;
      applyErrors({});
      status.dataset.state = 'success';
      status.textContent = 'Solicitarea a fost trimisă. Îți mulțumim pentru informații.';
      status.focus();
    } catch {
      if (disposed) return;
      status.dataset.state = 'error';
      status.textContent = requestController.signal.aborted
        ? 'Trimiterea a durat prea mult. Nu am primit confirmarea; poți încerca din nou. Datele completate sunt păstrate.'
        : 'Nu am putut trimite solicitarea. Verifică conexiunea sau încearcă din nou. Datele completate sunt păstrate.';
      status.focus();
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      if (controller === requestController) controller = null;
      if (!disposed) {
        pending = false;
        submitButton.disabled = !endpoint;
        submitLabel.textContent = 'Trimite solicitarea';
        form.removeAttribute('aria-busy');
      }
    }
  };

  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);

  const cleanup = () => {
    disposed = true;
    controller?.abort();
    if (timer !== undefined) clearTimeout(timer);
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('input', onEdit);
    form.removeEventListener('change', onEdit);
    form.removeAttribute('aria-busy');
    submitLabel.textContent = 'Trimite solicitarea';
    activeForms.delete(form);
  };
  activeForms.set(form, cleanup);
  return cleanup;
}
