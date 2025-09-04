// E-petitpas IA School Design System Constants

export const BRAND_COLORS = {
  // Primary Brand Colors
  blue: {
    50: '#EBF8FF',
    100: '#BEE3F8', 
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE', // Primary Blue
    600: '#2C5282',
    700: '#2A4365',
    800: '#1A365D',
    900: '#153E75'
  },
  orange: {
    50: '#FFFAF0',
    100: '#FEEBC8',
    200: '#FBD38D', 
    300: '#F6AD55',
    400: '#ED8936',
    500: '#DD6B20', // Primary Orange
    600: '#C05621',
    700: '#9C4221',
    800: '#7B341E',
    900: '#652B19'
  },
  green: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391', 
    400: '#48BB78',
    500: '#38A169', // Primary Green
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532'
  },
  navy: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C', // Primary Navy
    900: '#171923'
  }
} as const;

export const DESIGN_TOKENS = {
  // Border Radius - More rounded for playful feel
  borderRadius: {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px  
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    full: '9999px'
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem'   // 48px
  },
  
  // Shadows for depth
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
} as const;

// Utility functions for consistent styling
export const getGradient = (colorFrom: keyof typeof BRAND_COLORS, colorTo: keyof typeof BRAND_COLORS) => {
  return `bg-gradient-to-r from-${colorFrom}-500 to-${colorTo}-500`;
};

export const getHoverGradient = (colorFrom: keyof typeof BRAND_COLORS, colorTo: keyof typeof BRAND_COLORS) => {
  return `hover:from-${colorFrom}-600 hover:to-${colorTo}-600`;
};

export const getBorderColor = (color: keyof typeof BRAND_COLORS, shade: number = 200) => {
  return `border-${color}-${shade}`;
};

export const getBackgroundColor = (color: keyof typeof BRAND_COLORS, shade: number = 50) => {
  return `bg-${color}-${shade}`;
};

export const getTextColor = (color: keyof typeof BRAND_COLORS, shade: number = 700) => {
  return `text-${color}-${shade}`;
};

// Component class presets
export const COMPONENT_STYLES = {
  button: {
    primary: `${getGradient('blue', 'green')} ${getHoverGradient('blue', 'green')} text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg`,
    secondary: `${getGradient('orange', 'blue')} ${getHoverGradient('orange', 'blue')} text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg`,
    outline: `border-2 ${getBorderColor('blue')} ${getTextColor('blue')} hover:${getBackgroundColor('blue')} font-medium rounded-xl px-6 py-3 transition-all duration-200`
  },
  card: {
    default: `bg-white ${getBorderColor('blue', 100)} border rounded-xl shadow-sm p-6`,
    gradient: `bg-gradient-to-br from-white to-blue-50 ${getBorderColor('blue', 200)} border rounded-xl shadow-sm p-6`
  }
} as const;