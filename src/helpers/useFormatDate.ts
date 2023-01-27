export const yyyy_mm_dd = (date: Date | null, character: string = "-") => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthFormat = (month < 9 ? "0" : "") + (month + 1);
  const day = date.getDate();
  const dayFormat = (day < 10 ? "0" : "") + day;
  return `${year}${character}${monthFormat}${character}${dayFormat}`;
};

export const dd_mm_yyyy = (date: Date | null, character: string = "-") => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthFormat = (month < 9 ? "0" : "") + (month + 1);
  const day = date.getDate();
  const dayFormat = (day < 10 ? "0" : "") + day;
  return `${dayFormat}${character}${monthFormat}${character}${year}`;
};
