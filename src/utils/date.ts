const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const maskDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const formatIsoDateToDisplay = (value: string) => {
  if (!value) {
    return '';
  }

  if (DISPLAY_DATE_PATTERN.test(value)) {
    return value;
  }

  if (ISO_DATE_PATTERN.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const parseDisplayDateToIso = (value: string) => {
  if (ISO_DATE_PATTERN.test(value)) {
    return value;
  }

  const match = value.trim().match(DISPLAY_DATE_PATTERN);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const candidate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    candidate.getUTCFullYear() !== Number(year)
    || candidate.getUTCMonth() + 1 !== Number(month)
    || candidate.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
};