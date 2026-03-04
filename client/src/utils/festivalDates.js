export const festivals = [
  {
    name: "Diwali",
    date: "2025-10-20",
    warning:
      "Diwali season — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Holi",
    date: "2026-03-14",
    warning:
      "Holi festival — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Eid-ul-Fitr",
    date: "2026-03-31",
    warning: "Eid — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Durga Puja",
    date: "2025-10-01",
    endDate: "2025-10-05",
    warning: "Durga Puja — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Christmas",
    date: "2025-12-25",
    warning:
      "Christmas holidays — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "New Year",
    date: "2026-01-01",
    warning: "New Year — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Dussehra",
    date: "2025-10-02",
    warning: "Dussehra — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Navratri",
    date: "2025-09-22",
    endDate: "2025-10-01",
    warning: "Navratri — expect surge pricing and limited seats. Book early!",
  },
  {
    name: "Ganesh Chaturthi",
    date: "2025-08-27",
    warning:
      "Ganesh Chaturthi — expect surge pricing and limited seats. Book early!",
  },
];

export function isNearFestival(targetDateStr) {
  if (!targetDateStr) return null;
  const targetDate = new Date(targetDateStr);

  for (const fest of festivals) {
    let start = new Date(fest.date);
    let end = fest.endDate ? new Date(fest.endDate) : new Date(fest.date);

    let bufferStart = new Date(start);
    bufferStart.setDate(bufferStart.getDate() - 3);

    let bufferEnd = new Date(end);
    bufferEnd.setDate(bufferEnd.getDate() + 3);

    if (targetDate >= bufferStart && targetDate <= bufferEnd) {
      return fest;
    }
  }
  return null;
}
