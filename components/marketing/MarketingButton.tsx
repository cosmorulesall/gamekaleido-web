import Link from 'next/link';

type ButtonVariant = 'primary' | 'ghost' | 'subtle';

interface MarketingButtonProps {
  variant?: ButtonVariant;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'mk-btn-primary',
  ghost: 'mk-btn-ghost',
  subtle: 'mk-btn-subtle',
};

export function MarketingButton({
  variant = 'primary',
  href,
  disabled,
  onClick,
  children,
  className = '',
}: MarketingButtonProps) {
  const classes = `${variantClass[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
