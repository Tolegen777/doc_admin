// -label and -value must be key of T
export const selectOptionsParser = <T>(data: T[], label: string, value: string) =>
  (data || []).map(item => ({
    label: item[label as keyof T] as string,
    value: item[value as keyof T] as number | string,
  }));
