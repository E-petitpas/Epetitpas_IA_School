import logoImage from 'figma:asset/b7df18b72ad1d5e938ab5d42e1cd5a1e681f4326.png';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white' | 'compact';
}

export function Logo({ size = 'md', showText = true, className = '', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const subtitleSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const getTextColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: 'text-white',
          secondary: 'text-blue-100'
        };
      case 'compact':
        return {
          primary: 'text-gray-700',
          secondary: 'text-orange-500'
        };
      default:
        return {
          primary: 'text-gray-800',
          secondary: 'text-orange-500'
        };
    }
  };

  const textColors = getTextColors();

  return (
    <div className={`flex items-center ${variant === 'compact' ? 'gap-2' : 'gap-3'} ${className}`}>
      <img 
        src={logoImage} 
        alt="E-petitpas IA School Logo" 
        className={`${sizeClasses[size]} object-contain ${variant === 'white' ? 'filter brightness-0 invert' : ''}`}
      />
      {showText && (
        <div className={`flex ${variant === 'compact' ? 'flex-row items-baseline gap-2' : 'flex-col'}`}>
          <span className={`font-bold ${textColors.primary} ${textSizeClasses[size]} leading-tight`}>
            {variant === 'compact' ? 'E-PETITPAS' : 'E-PETITPAS'}
          </span>
          <span className={`font-bold ${textColors.secondary} ${subtitleSizeClasses[size]} leading-tight`}>
            {variant === 'compact' ? 'IA' : 'IA SCHOOL'}
          </span>
        </div>
      )}
    </div>
  );
}