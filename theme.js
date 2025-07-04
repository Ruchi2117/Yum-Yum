export const theme = {
  colors: {
    primary: '#FF6B6B',      // Red
    secondary: '#FFD93D',    // Yellow
    background: '#FFF9C4',   // Light yellow background
    surface: '#FFFFFF',      // White for cards/surfaces
    text: '#333333',        // Dark gray for text
    textLight: '#666666',   // Lighter gray for secondary text
    border: '#FFE082',      // Light yellow border
    success: '#4CAF50',     // Green for success messages
    error: '#F44336',       // Red for errors
    warning: '#FFC107',     // Yellow for warnings
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      color: '#333',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
    },
    body: {
      fontSize: 16,
      color: '#333',
    },
    caption: {
      fontSize: 14,
      color: '#666',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
  },
};

export default theme;
