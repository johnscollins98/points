export const getDateFilterObject = (
  start?: string | string[] | null,
  end?: string | string[] | null,
) => {
  const obj: { startDate?: Date; endDate?: Date } = {};
  if (typeof start === "string" && !isNaN(Date.parse(start))) {
    obj.startDate = new Date(start);
  }

  if (typeof end === "string" && !isNaN(Date.parse(end))) {
    obj.endDate = new Date(end);
  }

  return obj;
};
