import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) => {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brofind-red text-white hover:bg-red-700 shadow-sm',
    secondary: 'bg-brofind-blue text-white hover:bg-blue-900 shadow-sm',
    ghost: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
    danger: 'bg-red-50 text-brofind-red ring-1 ring-red-100 hover:bg-red-100',
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
