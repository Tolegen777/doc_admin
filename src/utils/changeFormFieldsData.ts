import { FormInitialFieldsParamsType } from "../types/common.ts";

export function changeFormFieldsData<T extends object>(
  initialFields: FormInitialFieldsParamsType[],
  data: T,
) {
  return initialFields.map((item) => {
    if (item.name in data) {
      return {
        name: item.name,
        value: data[item.name as keyof T],
      };
    }

    return item;
  });
}
