export const parseISODate = (isoDate: string | null): string => {
    if (!isoDate) {
      return "Not finished yet";
    }
    const date = new Date(isoDate);
  
    // const options = {
    //   year: "numeric",
    //   month: "numeric",
    //   day: "numeric",
    //   hour: "numeric",
    //   minute: "numeric",
    //   second: "numeric",
    // };
  
    return date.toLocaleString("en-US");
  };
  