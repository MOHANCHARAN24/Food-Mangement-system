export const formatCurrency = (amount, locale = 'en-IN', currency = 'INR') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch (error) {
    return `₹${amount}`;
  }
};

export const formatDateTime = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export default {
  formatCurrency,
  formatDateTime,
};
