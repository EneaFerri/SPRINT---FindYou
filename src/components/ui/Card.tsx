export const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`rounded-lg border border-slate-200 bg-white shadow-soft ${className}`}>
    {children}
  </section>
);
