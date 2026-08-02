export function DocsFooter() {
  return (
    <footer className="docs-footer mt-8 border-t pt-6 pb-2">
      <div className="flex flex-col gap-3 text-xs text-[var(--docs-muted-fg)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ProDocs · Documentation Platform</p>
        <p>
          Maintained by{" "}
          <span className="font-medium text-[var(--docs-fg)]">Linga Raj M</span>
          , Senior Technical Writer
        </p>
      </div>
    </footer>
  );
}
