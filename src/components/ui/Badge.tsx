type PriorityLevel = 'high' | 'medium' | 'low';

const priorityClasses: Record<PriorityLevel, string> = {
  high: 'bg-brofind-red text-white',
  medium: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  low: 'bg-sky-100 text-brofind-blue ring-1 ring-sky-200',
};

export const Badge = ({
  children,
  tone = 'neutral',
  priority,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'blue';
  priority?: PriorityLevel;
}) => {
  const toneClass = {
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    success: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
    warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    blue: 'bg-blue-100 text-brofind-blue ring-1 ring-blue-200',
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        priority ? priorityClasses[priority] : toneClass
      }`}
    >
      {children}
    </span>
  );
};
