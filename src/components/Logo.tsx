interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Left teal C */}
      <path
        d="M0 20 C0 8.95 8.95 0 20 0 L50 0 L50 25 L25 25 C22.24 25 20 27.24 20 30 L20 45 L50 45 L50 70 L20 70 C8.95 70 0 61.05 0 50 L0 20 Z"
        fill="hsl(173 80% 40%)"
      />
      
      {/* Right navy C */}
      <path
        d="M100 80 C100 91.05 91.05 100 80 100 L50 100 L50 75 L75 75 C77.76 75 80 72.76 80 70 L80 55 L50 55 L50 30 L80 30 C91.05 30 100 38.95 100 50 L100 80 Z"
        fill="hsl(215 85% 35%)"
      />
    </svg>
  );
};
