export const getBoolean = (value: string | boolean): boolean => {
  return value === true || value === 'true' || value === 'on' || value === '1'
}
