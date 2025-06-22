export const splitFullName = (full_name: string) => {
  return full_name
    .split(" ")
    .reduce<{ [key: string]: string }>((acc, item, index) => {
      const keys = ["first_name", "last_name", "middle_name"];
      if (keys[index]) {
        acc[keys[index]] = item;
      }
      return acc;
    }, {});
};
