export const calculateOverdueDays = dueDate => {
  if (!dueDate) return 0;

  const due = new Date(dueDate);

  if (isNaN(due.getTime())) {
    console.log('Invalid Due Date:', dueDate);
    return 0;
  }

  const today = new Date();

  const dueDateOnly = Date.UTC(
    due.getUTCFullYear(),
    due.getUTCMonth(),
    due.getUTCDate()
  );

  const todayDateOnly = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const days = Math.floor(
    (todayDateOnly - dueDateOnly) / (1000 * 60 * 60 * 24)
  );

  console.log('Due Date:', dueDate);
  console.log('Calculated Overdue Days:', days);

  return Math.max(0, days);
};

export const formatDueDate = date => {
  if (!date) return '--';

  const dueDate = new Date(date);

  if (isNaN(dueDate.getTime())) return '--';

  const day = dueDate.getUTCDate();

  const suffix =
    day >= 11 && day <= 13
      ? 'th'
      : day % 10 === 1
      ? 'st'
      : day % 10 === 2
      ? 'nd'
      : day % 10 === 3
      ? 'rd'
      : 'th';

  const month = dueDate.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  const year = dueDate.getUTCFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};


