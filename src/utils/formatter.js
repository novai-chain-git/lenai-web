import dayjs from 'dayjs';
export const formatDateTime = (date, formatTemplate = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return '';
  }
  return dayjs(date).format(formatTemplate);
};
