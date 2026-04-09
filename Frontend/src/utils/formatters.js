export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "Time not set";

  const [startHours = "0", startMinutes = "0"] = startTime.split(":");
  const [endHours = "0", endMinutes = "0"] = endTime.split(":");

  const start = new Date();
  start.setHours(Number(startHours), Number(startMinutes), 0, 0);

  const end = new Date();
  end.setHours(Number(endHours), Number(endMinutes), 0, 0);

  return `${start.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};
