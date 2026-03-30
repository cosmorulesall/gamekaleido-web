interface BrassDividerProps {
  className?: string;
}

export function BrassDivider({ className = '' }: BrassDividerProps) {
  return <hr className={`mk-divider ${className}`.trim()} />;
}
