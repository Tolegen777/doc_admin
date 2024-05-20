export const addCountsToData = (data: Array<any>) => {
  if (data?.length) {
    return data?.map((item, index) => ({
      ...item,
      count: index + 1
    }))
  }
  return []
}
