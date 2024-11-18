export function formatPhone(value: string) {
  const cleanedValue = value.replace(/\D/g, "");

  if (cleanedValue.length === 10) {
    return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(
      2,
      6
    )}-${cleanedValue.slice(6)}`;
  } else if (cleanedValue.length === 11) {
    return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(
      2,
      7
    )}-${cleanedValue.slice(7)}`;
  } else {
    return cleanedValue;
  }
}
