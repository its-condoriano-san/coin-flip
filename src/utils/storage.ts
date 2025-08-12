export const getStoredValue = <T extends string>(
  key: string,
  defaulValue: T
): T => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return storedValue as T;
  } else {
    localStorage.setItem(key, defaulValue);
    return defaulValue;
  }
};
