const formatDateFromMilliseconds = (milliseconds) => {
  const date = new Date(milliseconds * 1000);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export default formatDateFromMilliseconds;
