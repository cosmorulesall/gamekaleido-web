interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function PaperCard({ children, className = '', hover = true }: PaperCardProps) {
  return (
    <div className={`mk-card ${hover ? 'mk-card-hover' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
