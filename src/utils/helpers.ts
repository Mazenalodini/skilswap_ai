// Helper functions for the application

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
  return 'الآن';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=400`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner': return 'green';
    case 'intermediate': return 'yellow';
    case 'advanced': return 'orange';
    case 'expert': return 'red';
    default: return 'gray';
  }
};

export const getSkillLevelLabel = (level: string): string => {
  switch (level) {
    case 'beginner': return 'مبتدئ';
    case 'intermediate': return 'متوسط';
    case 'advanced': return 'متقدم';
    case 'expert': return 'خبير';
    default: return level;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online': return 'green';
    case 'available': return 'blue';
    case 'busy': return 'orange';
    case 'offline': return 'gray';
    default: return 'gray';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'online': return 'متصل الآن';
    case 'available': return 'متاح للعمل';
    case 'busy': return 'مشغول حالياً';
    case 'offline': return 'غير متصل';
    default: return status;
  }
};

export const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const generateUniqueId = (): string => {
  return crypto.randomUUID();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};