import DOMPurify from 'dompurify';

export interface ExportDocTopic {
  title: string;
  body?: string | null;
}

export interface ExportDocOptions {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  logoUrl?: string | null;
  topics: ExportDocTopic[];
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Abre a janela de impressão do navegador com o conteúdo do treinamento
 * formatado para PDF ("Salvar como PDF" no diálogo de impressão).
 */
export const exportDocToPdf = ({ title, subtitle, meta, logoUrl, topics }: ExportDocOptions) => {
  const today = new Date().toLocaleDateString('pt-BR');

  const body = topics
    .map((t) => {
      const clean = DOMPurify.sanitize(t.body || '', { USE_PROFILES: { html: true } });
      return `<section class="topic">
        <h2>${escapeHtml(t.title)}</h2>
        <div class="rich">${clean || '<p class="empty">Sem conteúdo.</p>'}</div>
      </section>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<title>${escapeHtml(title)} — Treinamento</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
         color: #1f2937; margin: 0; padding: 32px 36px; line-height: 1.6; }
  header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #c9a227;
           padding-bottom: 16px; margin-bottom: 24px; }
  header img { width: 64px; height: 64px; object-fit: contain; }
  h1 { font-size: 26px; margin: 0; color: #0f2a4a; }
  .sub { font-size: 13px; color: #6b7280; margin-top: 4px; }
  .topic { page-break-inside: avoid; margin-bottom: 26px; }
  h2 { font-size: 17px; color: #0f2a4a; border-left: 4px solid #c9a227; padding-left: 10px; margin: 0 0 10px; }
  .rich img { max-width: 100%; height: auto; }
  .rich table { width: 100%; border-collapse: collapse; }
  .rich td, .rich th { border: 1px solid #d1d5db; padding: 6px 8px; }
  .rich ul { list-style: disc; padding-left: 22px; }
  .rich ol { list-style: decimal; padding-left: 22px; }
  .rich iframe, .rich video { display: none; }
  .empty { color: #9ca3af; font-style: italic; }
  footer { margin-top: 28px; border-top: 1px solid #e5e7eb; padding-top: 10px;
           font-size: 11px; color: #9ca3af; }
  @page { margin: 14mm; }
</style></head>
<body>
  <header>
    ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="" />` : ''}
    <div>
      <h1>${escapeHtml(title)}</h1>
      <div class="sub">${[subtitle, meta].filter(Boolean).map((s) => escapeHtml(String(s))).join(' · ')}</div>
    </div>
  </header>
  ${body || '<p class="empty">Nenhum conteúdo disponível.</p>'}
  <footer>Pride Corretora — material de treinamento · exportado em ${today}</footer>
</body></html>`;

  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) {
    alert('Permita pop-ups neste site para exportar o PDF.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  const doPrint = () => setTimeout(() => win.print(), 400);
  if (win.document.readyState === 'complete') doPrint();
  else win.onload = doPrint;
};
