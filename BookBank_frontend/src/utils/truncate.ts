export const truncateString = (str: string, maxLength: number = 100) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
};
