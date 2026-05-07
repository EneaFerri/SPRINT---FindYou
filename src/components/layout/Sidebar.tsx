export const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <aside className="flex min-h-0 flex-col gap-4 lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto lg:pr-1">
    {children}
  </aside>
);
