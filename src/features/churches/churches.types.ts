export const CHURCH_SERVICE_TYPES = ["mass", "confession", "adoration"] as const;
export const NOTIFICATION_WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type ChurchServiceType = (typeof CHURCH_SERVICE_TYPES)[number];
export type NotificationWeekday = (typeof NOTIFICATION_WEEKDAYS)[number];
export type ChurchVerificationStatus = "verified" | "candidate" | "unknown";
export type ChurchScheduleStatus = "verified" | "pending" | "unavailable" | "unknown";

export type PostalCity = {
  isPrimary: boolean;
  label: string;
  name: string;
  overlapPercent: number;
  regionCode: string;
  status: string;
};

export type DioceseFilter = {
  id: string;
  matchStatus: string;
  name: string;
};

export type ResolvedPostalCode = {
  cities: PostalCity[];
  dioceseStatus: string;
  dioceses: DioceseFilter[];
  latitude: number;
  longitude: number;
  postalCode: string;
  primaryCity: string;
  regionCodes: string[];
  timezone: string;
};

export type ChurchSummary = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  countryCode: string;
  dioceseId: string | null;
  dioceseName: string | null;
  directoryVerificationStatus: ChurchVerificationStatus;
  distanceMiles: number | null;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  postalCode: string | null;
  regionName: string | null;
  scheduleStatus: ChurchScheduleStatus;
  timezone: string;
};

export type ChurchServiceTime = {
  endTime: string | null;
  id: string;
  serviceType: ChurchServiceType;
  startTime: string;
  weekday: NotificationWeekday;
};

export type ChurchDetails = ChurchSummary & {
  isActive: boolean;
  liveStatus: {
    adorationInProgress: boolean;
    confessionInProgress: boolean;
    massInProgress: boolean;
  };
  serviceTimes: ChurchServiceTime[];
};

export type ChurchSubscription = {
  church: ChurchSummary;
  churchId: string;
  notificationWeekdays: NotificationWeekday[];
  scheduleReady: boolean;
  serviceTypes: ChurchServiceType[];
};

export type UpcomingChurchService = {
  churchId: string;
  churchName: string;
  endsAt: string | null;
  id: string;
  serviceType: ChurchServiceType;
  startsAt: string;
  timezone: string;
};

export type ChurchMapMarker = {
  address: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
};

export type ChurchMapProps = {
  center: { latitude: number; longitude: number };
  dom?: import("expo/dom").DOMProps;
  markers: ChurchMapMarker[];
  onSelectChurch: (churchId: string) => Promise<void>;
  selectedChurchId?: string | null;
};

export type PaginationMeta = {
  hasMore: boolean;
  limit: number;
  nextOffset: number | null;
  offset: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type ChurchSearchInput = {
  city?: string;
  country?: string;
  diocese?: string;
  dioceseId?: string;
  limit?: number;
  offset?: number;
  postalCode?: string;
  q?: string;
  radiusMiles?: number;
};

export type ChurchSubscriptionPreferences = {
  notificationWeekdays: readonly NotificationWeekday[];
  serviceTypes: readonly ChurchServiceType[];
};

export type CreateChurchSubscriptionInput = ChurchSubscriptionPreferences & {
  churchId: string;
};

export type UpcomingChurchServicesInput = {
  churchId?: string;
  days?: number;
  limit?: number;
  offset?: number;
  serviceType?: ChurchServiceType;
};
