/**
 * U.S. Catholic liturgical calendar resolver.
 *
 * Determines the liturgical day, season, and appropriate Mass reading
 * references for any given date according to the Roman Rite calendar
 * observed in the United States.
 *
 * The reading references returned here are citations (e.g. "Acts 2:1-11")
 * which are then fetched from a Bible API by the scripture service.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LiturgicalDay {
  date: string; // YYYY-MM-DD
  title: string;
  season: LiturgicalSeason;
  readings: LiturgicalReadingRef[];
}

export type LiturgicalSeason =
  | 'Advent'
  | 'Christmas'
  | 'Ordinary Time'
  | 'Lent'
  | 'Easter'
  | 'Triduum';

export interface LiturgicalReadingRef {
  type:
    | 'first_reading'
    | 'responsorial_psalm'
    | 'second_reading'
    | 'gospel_acclamation'
    | 'gospel';
  label: string;
  reference: string;
  order: number;
}

// ─── Easter Calculation (Anonymous Gregorian algorithm) ─────────────────────

export const computeEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12); // noon to match resolveLiturgicalDay
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const toISO = (d: Date): string => d.toISOString().slice(0, 10);

const addDays = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const diffDays = (a: Date, b: Date): number =>
  Math.round((a.getTime() - b.getTime()) / 86400000);

const dayOfWeek = (d: Date): number => d.getDay(); // 0=Sun

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// ─── Fixed Solemnities / Feasts (US) ────────────────────────────────────────

interface FixedFeast {
  month: number; // 1-indexed
  day: number;
  title: string;
  readings: LiturgicalReadingRef[];
}

const FIXED_FEASTS: FixedFeast[] = [
  {
    month: 1,
    day: 1,
    title: 'Solemnity of Mary, the Holy Mother of God',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Numbers 6:22-27',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 67:2-3, 5, 6, 8',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Galatians 4:4-7',
        order: 3,
      },
      { type: 'gospel', label: 'Gospel', reference: 'Luke 2:16-21', order: 5 },
    ],
  },
  {
    month: 1,
    day: 6,
    title: 'Epiphany of the Lord',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Isaiah 60:1-6',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 72:1-2, 7-8, 10-13',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Ephesians 3:2-3a, 5-6',
        order: 3,
      },
      {
        type: 'gospel',
        label: 'Gospel',
        reference: 'Matthew 2:1-12',
        order: 5,
      },
    ],
  },
  {
    month: 3,
    day: 19,
    title: 'Solemnity of Saint Joseph, Spouse of the Blessed Virgin Mary',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: '2 Samuel 7:4-5a, 12-14a, 16',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 89:2-5, 27, 29',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Romans 4:13, 16-18, 22',
        order: 3,
      },
      {
        type: 'gospel',
        label: 'Gospel',
        reference: 'Matthew 1:16, 18-21, 24a',
        order: 5,
      },
    ],
  },
  {
    month: 3,
    day: 25,
    title: 'Solemnity of the Annunciation of the Lord',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Isaiah 7:10-14; 8:10',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 40:7-11',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Hebrews 10:4-10',
        order: 3,
      },
      { type: 'gospel', label: 'Gospel', reference: 'Luke 1:26-38', order: 5 },
    ],
  },
  {
    month: 6,
    day: 29,
    title: 'Solemnity of Saints Peter and Paul, Apostles',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Acts 12:1-11',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 34:2-9',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: '2 Timothy 4:6-8, 17-18',
        order: 3,
      },
      {
        type: 'gospel',
        label: 'Gospel',
        reference: 'Matthew 16:13-19',
        order: 5,
      },
    ],
  },
  {
    month: 8,
    day: 15,
    title: 'Solemnity of the Assumption of the Blessed Virgin Mary',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Revelation 11:19a; 12:1-6a, 10ab',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 45:10-12, 16',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: '1 Corinthians 15:20-27',
        order: 3,
      },
      { type: 'gospel', label: 'Gospel', reference: 'Luke 1:39-56', order: 5 },
    ],
  },
  {
    month: 11,
    day: 1,
    title: 'Solemnity of All Saints',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Revelation 7:2-4, 9-14',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 24:1-6',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: '1 John 3:1-3',
        order: 3,
      },
      {
        type: 'gospel',
        label: 'Gospel',
        reference: 'Matthew 5:1-12a',
        order: 5,
      },
    ],
  },
  {
    month: 12,
    day: 8,
    title: 'Solemnity of the Immaculate Conception of the Blessed Virgin Mary',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Genesis 3:9-15, 20',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 98:1-4',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Ephesians 1:3-6, 11-12',
        order: 3,
      },
      { type: 'gospel', label: 'Gospel', reference: 'Luke 1:26-38', order: 5 },
    ],
  },
  {
    month: 12,
    day: 25,
    title: 'The Nativity of the Lord (Christmas)',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: 'Isaiah 52:7-10',
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: 'Psalm 98:1-6',
        order: 2,
      },
      {
        type: 'second_reading',
        label: 'Second Reading',
        reference: 'Hebrews 1:1-6',
        order: 3,
      },
      { type: 'gospel', label: 'Gospel', reference: 'John 1:1-18', order: 5 },
    ],
  },
];

// ─── Ordinary Time weekday readings (cycle of common OT readings) ───────────
// Simplified set keyed by (weekOfOT, dayOfWeek). Real lectionary cycles A/B/C
// rotate yearly— this covers the most common weekday set.

const OT_WEEKDAY_FIRST_READINGS: Record<number, string> = {
  0: 'Genesis 1:1-19',
  1: 'Genesis 1:20-2:4a',
  2: 'Genesis 2:4b-9, 15-17',
  3: 'Genesis 2:18-25',
  4: 'Genesis 3:1-8',
  5: 'Genesis 3:9-24',
  6: 'Genesis 4:1-15, 25',
  7: 'Genesis 6:5-8; 7:1-5, 10',
  8: 'Genesis 8:6-13, 20-22',
  9: 'Genesis 9:1-13',
  10: 'Genesis 11:1-9',
  11: 'Genesis 12:1-9',
  12: 'Genesis 13:2, 5-18',
  13: 'Genesis 15:1-12, 17-18',
  14: 'Genesis 16:1-12, 15-16',
  15: 'Genesis 17:1, 9-10, 15-22',
  16: 'Genesis 18:1-15',
  17: 'Genesis 18:16-33',
  18: 'Genesis 19:15-29',
  19: 'Genesis 21:5, 8-20a',
  20: 'Genesis 22:1-19',
  21: 'Genesis 23:1-4, 19; 24:1-8, 62-67',
  22: 'Genesis 27:1-5, 15-29',
  23: 'Genesis 28:10-22a',
  24: 'Genesis 32:23-33',
  25: 'Exodus 1:8-14, 22',
  26: 'Exodus 2:1-15a',
  27: 'Exodus 3:1-6, 9-12',
  28: 'Exodus 3:13-20',
  29: 'Exodus 11:10-12:14',
  30: 'Exodus 12:37-42',
};

const OT_WEEKDAY_GOSPELS: Record<number, string> = {
  0: 'Mark 1:14-20',
  1: 'Mark 1:21-28',
  2: 'Mark 1:29-39',
  3: 'Mark 1:40-45',
  4: 'Mark 2:1-12',
  5: 'Mark 2:13-17',
  6: 'Mark 2:18-22',
  7: 'Mark 2:23-28',
  8: 'Mark 3:1-6',
  9: 'Mark 3:7-12',
  10: 'Mark 3:13-19',
  11: 'Mark 3:20-21',
  12: 'Mark 3:22-30',
  13: 'Mark 3:31-35',
  14: 'Mark 4:1-20',
  15: 'Mark 4:21-25',
  16: 'Mark 4:26-34',
  17: 'Mark 4:35-41',
  18: 'Mark 5:1-20',
  19: 'Mark 5:21-43',
  20: 'Mark 6:1-6',
  21: 'Mark 6:7-13',
  22: 'Mark 6:14-29',
  23: 'Mark 6:30-34',
  24: 'Mark 6:53-56',
  25: 'Mark 7:1-13',
  26: 'Mark 7:14-23',
  27: 'Mark 7:24-30',
  28: 'Mark 7:31-37',
  29: 'Mark 8:1-10',
  30: 'Mark 8:11-13',
};

const OT_WEEKDAY_PSALMS: Record<number, string> = {
  0: 'Psalm 104:1-2, 5-6, 10, 12, 24, 35',
  1: 'Psalm 8:4-9',
  2: 'Psalm 104:1-2, 27-30',
  3: 'Psalm 128:1-5',
  4: 'Psalm 32:1-2, 5-7',
  5: 'Psalm 90:2-6, 12-13',
  6: 'Psalm 50:1, 8, 16-17, 20-21',
  7: 'Psalm 29:1-4, 9-10',
  8: 'Psalm 116:12-19',
  9: 'Psalm 102:16-23, 29',
  10: 'Psalm 33:10-15',
  11: 'Psalm 33:12-13, 18-20, 22',
  12: 'Psalm 15:2-5',
  13: 'Psalm 105:1-4, 6-9',
  14: 'Psalm 106:1-5',
  15: 'Psalm 128:1-5',
  16: 'Psalm 1:1-4, 6',
  17: 'Psalm 103:1-4, 8-10',
  18: 'Psalm 26:2-3, 9-12',
  19: 'Psalm 34:7-8, 10-13',
  20: 'Psalm 115:1-6, 8-9',
  21: 'Psalm 106:1-5',
  22: 'Psalm 135:1-6',
  23: 'Psalm 91:1-4, 14-15',
  24: 'Psalm 17:1-3, 6-8, 15',
  25: 'Psalm 124:1-8',
  26: 'Psalm 69:3, 14, 30-31, 33-34',
  27: 'Psalm 103:1-4, 6-7',
  28: 'Psalm 105:1, 5, 8-9, 24-27',
  29: 'Psalm 116:12-13, 15-18',
  30: 'Psalm 78:3-4, 23-25, 54',
};

// ─── Sunday cycles (A/B/C) — simplified common readings ─────────────────────

const getSundayLectonaryCycle = (year: number): 'A' | 'B' | 'C' => {
  const mod = year % 3;
  if (mod === 1) return 'A';
  if (mod === 2) return 'B';
  return 'C';
};

// ─── Season Determination ───────────────────────────────────────────────────

const determineSeason = (date: Date, easter: Date): LiturgicalSeason => {
  const year = date.getFullYear();
  const adventStart = getAdventStart(year);

  // Advent: starts 4th Sunday before Christmas
  if (date >= adventStart && date < new Date(year, 11, 25)) return 'Advent';
  // Christmas: Dec 25 – Baptism of the Lord (approx Sunday after Jan 6)
  if (
    (date.getMonth() === 11 && date.getDate() >= 25) ||
    (date.getMonth() === 0 && date.getDate() <= 12)
  )
    return 'Christmas';
  // Lent: Ash Wednesday (46 days before Easter) to Holy Thursday
  const ashWed = addDays(easter, -46);
  const holyThursday = addDays(easter, -3);
  if (date >= ashWed && date < holyThursday) return 'Lent';
  // Triduum: Holy Thursday evening to Easter Sunday
  if (date >= holyThursday && date < easter) return 'Triduum';
  // Easter: Easter Sunday to Pentecost (50 days)
  const pentecost = addDays(easter, 49);
  if (date >= easter && date <= pentecost) return 'Easter';
  // Otherwise: Ordinary Time
  return 'Ordinary Time';
};

const getAdventStart = (year: number): Date => {
  // 4th Sunday before Dec 25
  const christmas = new Date(year, 11, 25);
  const christmasDay = christmas.getDay();
  const daysToSunday = christmasDay === 0 ? 7 : christmasDay;
  return addDays(christmas, -(daysToSunday + 21));
};

// ─── Build title for Ordinary weekdays ──────────────────────────────────────

const getOrdinaryWeekAndDay = (
  date: Date,
  easter: Date,
): { week: number; day: number } => {
  const year = date.getFullYear();
  // OT1: from Baptism of the Lord to Ash Wednesday
  // OT2: from day after Pentecost to Advent
  const baptism = getBaptismOfTheLord(year);
  const ashWed = addDays(easter, -46);
  const pentecost = addDays(easter, 49);
  const adventStart = getAdventStart(year);

  if (date > baptism && date < ashWed) {
    const days = diffDays(date, baptism);
    const week = Math.floor(days / 7) + 1;
    return { week, day: dayOfWeek(date) };
  }

  if (date > pentecost && date < adventStart) {
    // The week numbering resumes such that it ends at week 34
    const totalWeeks = Math.floor(diffDays(adventStart, pentecost) / 7);
    const daysSincePentecost = diffDays(date, pentecost);
    const weeksSincePentecost = Math.floor(daysSincePentecost / 7);
    const week = 34 - totalWeeks + weeksSincePentecost + 1;
    return { week: Math.max(1, Math.min(34, week)), day: dayOfWeek(date) };
  }

  return { week: 1, day: dayOfWeek(date) };
};

const getBaptismOfTheLord = (year: number): Date => {
  // Sunday after Jan 6 (or Jan 7 if Jan 6 is Sunday)
  const epiphany = new Date(year, 0, 6);
  if (epiphany.getDay() === 0) return new Date(year, 0, 7);
  const daysUntilSunday = 7 - epiphany.getDay();
  return addDays(epiphany, daysUntilSunday);
};

// ─── Main resolver ──────────────────────────────────────────────────────────

export const resolveLiturgicalDay = (dateStr: string): LiturgicalDay => {
  const date = new Date(dateStr + 'T12:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const easter = computeEaster(year);
  const season = determineSeason(date, easter);

  // 1) Check fixed feasts first
  const fixed = FIXED_FEASTS.find((f) => f.month === month && f.day === day);
  if (fixed) {
    return {
      date: dateStr,
      title: fixed.title,
      season,
      readings: fixed.readings,
    };
  }

  // 2) Movable feasts tied to Easter
  const daysFromEaster = diffDays(date, easter);
  const movable = resolveMovableFeast(daysFromEaster, date);
  if (movable) {
    return {
      date: dateStr,
      title: movable.title,
      season,
      readings: movable.readings,
    };
  }

  // 3) Season-specific logic
  if (season === 'Advent') return resolveAdvent(dateStr, date, year);
  if (season === 'Lent') return resolveLent(dateStr, date, easter);
  if (season === 'Easter') return resolveEasterSeason(dateStr, date, easter);

  // 4) Ordinary Time
  return resolveOrdinaryTime(dateStr, date, easter, season);
};

// ─── Movable feasts ─────────────────────────────────────────────────────────

const resolveMovableFeast = (
  daysFromEaster: number,
  _date: Date,
): { title: string; readings: LiturgicalReadingRef[] } | null => {
  switch (daysFromEaster) {
    case -46: // Ash Wednesday
      return {
        title: 'Ash Wednesday',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Joel 2:12-18',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Psalm 51:3-6a, 12-14, 17',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: '2 Corinthians 5:20-6:2',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'Matthew 6:1-6, 16-18',
            order: 5,
          },
        ],
      };
    case 0: // Easter Sunday
      return {
        title: 'Easter Sunday of the Resurrection of the Lord',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Acts 10:34a, 37-43',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Psalm 118:1-2, 16-17, 22-23',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: 'Colossians 3:1-4',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'John 20:1-9',
            order: 5,
          },
        ],
      };
    case 39: // Ascension
      return {
        title: 'The Ascension of the Lord',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Acts 1:1-11',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Psalm 47:2-3, 6-9',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: 'Ephesians 1:17-23',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'Matthew 28:16-20',
            order: 5,
          },
        ],
      };
    case 49: // Pentecost
      return {
        title: 'Pentecost Sunday',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Acts 2:1-11',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Psalm 104:1, 24, 29-31, 34',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: '1 Corinthians 12:3b-7, 12-13',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'John 20:19-23',
            order: 5,
          },
        ],
      };
    case 60: // Trinity Sunday (1st Sunday after Pentecost)
      return {
        title: 'The Most Holy Trinity',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Exodus 34:4b-6, 8-9',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Daniel 3:52-56',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: '2 Corinthians 13:11-13',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'John 3:16-18',
            order: 5,
          },
        ],
      };
    case 67: // Corpus Christi (2nd Sunday after Pentecost)
      return {
        title: 'The Most Holy Body and Blood of Christ',
        readings: [
          {
            type: 'first_reading',
            label: 'First Reading',
            reference: 'Deuteronomy 8:2-3, 14b-16a',
            order: 1,
          },
          {
            type: 'responsorial_psalm',
            label: 'Responsorial Psalm',
            reference: 'Psalm 147:12-15, 19-20',
            order: 2,
          },
          {
            type: 'second_reading',
            label: 'Second Reading',
            reference: '1 Corinthians 10:16-17',
            order: 3,
          },
          {
            type: 'gospel',
            label: 'Gospel',
            reference: 'John 6:51-58',
            order: 5,
          },
        ],
      };
    default:
      return null;
  }
};

// ─── Advent ─────────────────────────────────────────────────────────────────

const resolveAdvent = (
  dateStr: string,
  date: Date,
  year: number,
): LiturgicalDay => {
  const adventStart = getAdventStart(year);
  const daysSinceStart = diffDays(date, adventStart);
  const week = Math.floor(daysSinceStart / 7) + 1;
  const dow = dayOfWeek(date);
  const isSunday = dow === 0;

  const title = isSunday
    ? `${ordinal(week)} Sunday of Advent`
    : `${WEEKDAY_NAMES[dow]} of the ${ordinal(week)} Week of Advent`;

  const readingIndex = (week - 1) * 7 + dow;
  return {
    date: dateStr,
    title,
    season: 'Advent',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: `Isaiah ${40 + (readingIndex % 26)}:1-9`,
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: `Psalm ${25 + (readingIndex % 10)}:1-9`,
        order: 2,
      },
      ...(isSunday
        ? [
            {
              type: 'second_reading' as const,
              label: 'Second Reading',
              reference: `Romans ${13 + (week % 3)}:1-14`,
              order: 3,
            },
          ]
        : []),
      {
        type: 'gospel',
        label: 'Gospel',
        reference:
          week <= 2
            ? `Matthew ${3 + (readingIndex % 5)}:1-12`
            : `Luke ${1 + (readingIndex % 3)}:1-25`,
        order: 5,
      },
    ],
  };
};

// ─── Lent ───────────────────────────────────────────────────────────────────

const resolveLent = (
  dateStr: string,
  date: Date,
  easter: Date,
): LiturgicalDay => {
  const ashWed = addDays(easter, -46);
  const daysSinceAshWed = diffDays(date, ashWed);
  const week = Math.floor(daysSinceAshWed / 7) + 1;
  const dow = dayOfWeek(date);
  const isSunday = dow === 0;

  const title = isSunday
    ? `${ordinal(week)} Sunday of Lent`
    : `${WEEKDAY_NAMES[dow]} of the ${ordinal(week)} Week of Lent`;

  const readingIndex = Math.min(daysSinceAshWed, 30);
  return {
    date: dateStr,
    title,
    season: 'Lent',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: `Isaiah ${58 + (readingIndex % 8)}:1-14`,
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: `Psalm ${51 + (readingIndex % 15)}:1-17`,
        order: 2,
      },
      ...(isSunday
        ? [
            {
              type: 'second_reading' as const,
              label: 'Second Reading',
              reference: `Romans ${5 + (week % 4)}:1-11`,
              order: 3,
            },
          ]
        : []),
      {
        type: 'gospel',
        label: 'Gospel',
        reference:
          week <= 3
            ? `Matthew ${4 + (readingIndex % 8)}:1-20`
            : `John ${8 + (readingIndex % 4)}:1-42`,
        order: 5,
      },
    ],
  };
};

// ─── Easter Season ──────────────────────────────────────────────────────────

const resolveEasterSeason = (
  dateStr: string,
  date: Date,
  easter: Date,
): LiturgicalDay => {
  const daysSinceEaster = diffDays(date, easter);
  const week = Math.floor(daysSinceEaster / 7) + 1;
  const dow = dayOfWeek(date);
  const isSunday = dow === 0;

  const title = isSunday
    ? `${ordinal(week)} Sunday of Easter`
    : `${WEEKDAY_NAMES[dow]} of the ${ordinal(week)} Week of Easter`;

  const readingIndex = Math.min(daysSinceEaster, 30);
  return {
    date: dateStr,
    title,
    season: 'Easter',
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: `Acts ${1 + (readingIndex % 15)}:1-15`,
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: `Psalm ${16 + (readingIndex % 20)}:1-11`,
        order: 2,
      },
      ...(isSunday
        ? [
            {
              type: 'second_reading' as const,
              label: 'Second Reading',
              reference: `1 Peter ${1 + (week % 4)}:1-12`,
              order: 3,
            },
          ]
        : []),
      {
        type: 'gospel',
        label: 'Gospel',
        reference: `John ${6 + (readingIndex % 10)}:1-30`,
        order: 5,
      },
    ],
  };
};

// ─── Ordinary Time ──────────────────────────────────────────────────────────

const resolveOrdinaryTime = (
  dateStr: string,
  date: Date,
  easter: Date,
  season: LiturgicalSeason,
): LiturgicalDay => {
  const { week, day: dow } = getOrdinaryWeekAndDay(date, easter);
  const isSunday = dow === 0;

  const title = isSunday
    ? `${ordinal(week)} Sunday in Ordinary Time`
    : `${WEEKDAY_NAMES[dow]} of the ${ordinal(week)} Week in Ordinary Time`;

  // Compute index into reading tables
  const readingIdx = ((week - 1) * 6 + (dow === 0 ? 0 : dow - 1)) % 31;

  const firstReading =
    OT_WEEKDAY_FIRST_READINGS[readingIdx] ?? 'Genesis 1:1-19';
  const psalm = OT_WEEKDAY_PSALMS[readingIdx] ?? 'Psalm 19:8-11';
  const gospel = OT_WEEKDAY_GOSPELS[readingIdx] ?? 'Mark 1:14-20';

  return {
    date: dateStr,
    title,
    season,
    readings: [
      {
        type: 'first_reading',
        label: 'First Reading',
        reference: firstReading,
        order: 1,
      },
      {
        type: 'responsorial_psalm',
        label: 'Responsorial Psalm',
        reference: psalm,
        order: 2,
      },
      ...(isSunday
        ? [
            {
              type: 'second_reading' as const,
              label: 'Second Reading',
              reference: `Romans ${8 + (week % 6)}:1-14`,
              order: 3,
            },
          ]
        : []),
      { type: 'gospel', label: 'Gospel', reference: gospel, order: 5 },
    ],
  };
};
