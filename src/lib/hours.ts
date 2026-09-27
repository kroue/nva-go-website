import { site } from '../config/site';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** '17:30' → '5:30 PM' */
export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};

/** Current day-of-week and minutes-after-midnight in the shop's time zone. */
export const shopNow = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return { day: WEEKDAY_INDEX[get('weekday')] ?? 0, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
};

export interface OpenStatus {
  open: boolean;
  text: string;
}

export const getOpenStatus = (date = new Date()): OpenStatus => {
  const { day, minutes } = shopNow(date);
  const today = site.hours.find((h) => h.day === day);

  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, text: `Open now · until ${formatTime(today.close)}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { open: false, text: `Closed · opens today ${formatTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = site.hours.find((h) => h.day === d);
    if (next) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[d];
      return { open: false, text: `Closed · opens ${when} ${formatTime(next.open)}` };
    }
  }
  return { open: false, text: 'Closed' };
};

/** schema.org openingHoursSpecification, grouped by identical open/close times. */
export const openingHoursSpecification = () => {
  const groups = new Map<string, number[]>();
  for (const h of site.hours) {
    const key = `${h.open}-${h.close}`;
    groups.set(key, [...(groups.get(key) ?? []), h.day]);
  }
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((d) => DAY_NAMES[d]),
      opens,
      closes,
    };
  });
};
