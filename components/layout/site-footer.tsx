export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10">
        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
          © {new Date().getFullYear()} Affan Khan
        </span>
      </div>
    </footer>
  );
}
