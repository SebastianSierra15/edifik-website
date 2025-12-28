export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-premium-borderColor bg-premium-background py-6 text-premium-textSecondary dark:border-premium-borderColorHover dark:bg-premium-secondaryDark dark:text-premium-textPlaceholder">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 text-sm">
        <span className="text-center text-premium-textPrimary dark:text-premium-textSecondary">
          &copy; {currentYear} EdifiK - AdministraciÃ³n. Todos los derechos
          reservados.
        </span>
      </div>
    </footer>
  );
}
