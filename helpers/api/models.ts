import { parse, parseISO } from "date-fns";

export type APIDate = string;
export type APITime = string;
export type APIDateTime = string;

export const parseTime = (time: APITime, date?: Date) =>
  parse(time, "HH:mm:ss", date ?? new Date(0));
export const parseDate = (date: APIDate) => parseISO(date);
export const parseDateTime = (date: APIDateTime) => parseISO(date);

export enum DayOfWeek {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

// User

export enum UserType {
  STUDENT = 1,
  STAFF = 2,
  GUEST = 3,
}

export type NestedUser = {
  id: number;
  first_name: string;
  last_name: string;
  type: UserType;
};

export type User = NestedUser & {
  email: string;
  picture_url: string;
  grad_year?: number;
  is_staff: boolean;
  is_superuser: boolean;
  memberships: NestedMembership[];
};

// Organization

export enum OrganizationType {
  GLOBAL = 1,
  CLASS = 2,
  CLUB = 3,
}

export enum ClubCategory {
  SERVICE = 1,
  COMPETITION = 2,
  INTEREST = 3,
}

export type NestedOrganization = {
  id: number;
  name: string;
  type: OrganizationType;
};

type BaseOrganization = NestedOrganization & {
  url: string;
  advisors: NestedUser[];
  admins: NestedUser[];
  day?: DayOfWeek;
  time?: APITime;
  link?: string;
  links: OrganizationLink[];
  ical_links: string[];
  description: string;
};

type NonClubOrganization = BaseOrganization & {
  category: undefined;
};

type ClubOrganization = BaseOrganization & {
  category: ClubCategory;
};

export type Organization = NonClubOrganization | ClubOrganization;

// OrganizationLink

export type OrganizationLink = {
  title: string;
  url: string;
};

// Poll

export enum PollType {
  SELECT = 1,
  SHORT_ANSWER = 2,
}

type BasePoll = {
  id: number;
  description: string;
};

type ShortAnswerPoll = BasePoll & { type: PollType.SHORT_ANSWER };

type SelectPoll = BasePoll & {
  type: PollType.SELECT;
  choices: string[];
  min_values: number;
  max_values: number;
};

export type NestedPoll = ShortAnswerPoll | SelectPoll;

// Membership

export type NestedMembership = {
  organization: NestedOrganization;
  points: number;
};

export type Membership = {
  organization: Organization;
  points: number;
};

// Period

export type NestedPeriod = {
  id: number;
  name: string;
  customizable: boolean;
};

// SchedulePeriod

export type NestedSchedulePeriod = {
  start: APITime;
  end: APITime;
  period: NestedPeriod;
};

// Schedule

export type NestedSchedule = {
  id: number;
  url: string;
  name: string;
  date: APIDate;
  periods: NestedSchedulePeriod[];
};

export type Schedule = NestedSchedule & {
  start: APIDate;
  end: APIDate;
  weekday: DayOfWeek[];
  priority: number;
};

// Post

export type Post = {
  id: number;
  url: string;
  organization: NestedOrganization;
  title: string;
  date: string;
  content: string;
  published: boolean;
  polls: NestedPoll[];
};

// Event

export enum EventSubmissionType {
  CODE = 1,
  FILE = 2,
}

export type Event = {
  id: number;
  url: string;
  organization: NestedOrganization;
  name: string;
  description?: string;
  start: APIDateTime;
  end: APIDateTime;
  points: number;
  submission_type: EventSubmissionType;
  claimed: boolean;
  leaderboard: { [key: string]: number };
};

// Prize

export type Prize = {
  id: number;
  url: string;
  organization: NestedOrganization;
  name: string;
  description: string;
  points: number;
};
