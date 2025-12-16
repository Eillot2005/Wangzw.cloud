// 浪漫情侣主题配置
export const theme = {
  colors: {
    primary: '#ff6b9d',      // 粉红色
    secondary: '#c44569',    // 暖红色
    accent: '#ffa8d5',       // 浅粉色
    purple: '#9c88ff',       // 紫色
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientPink: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
    gradientPurple: 'linear-gradient(135deg, #9c88ff 0%, #667eea 100%)',
    background: '#1a1a2e',   // 深色背景
    backgroundLight: '#16213e', // 浅深色背景
    card: '#0f1932',         // 卡片背景
    text: '#f5f5f5',         // 主文字颜色
    textSecondary: '#c5c5c5', // 次要文字
    border: 'rgba(255, 107, 157, 0.2)', // 边框
    shadow: '0 8px 32px rgba(255, 107, 157, 0.2)', // 阴影
    shadowHover: '0 12px 48px rgba(255, 107, 157, 0.3)',
  },
  
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
    full: '50%',
  },
  
  animation: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

export type Theme = typeof theme;
