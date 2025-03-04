export function isTronAddress(value: any): boolean {
  const regexTRON = /^T[a-zA-Z0-9]{33}$/;
  try {
    return regexTRON.test(value);
  } catch {
    return false;
  }
}