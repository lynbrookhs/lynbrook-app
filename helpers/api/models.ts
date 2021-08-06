export type APIDate = string;
export type APITime = string;
export type APIDateTime = string;

enum DayOfWeek {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

// User

export type NestedUser = {
  id: number;
  first_name: string;
  last_name: string;
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

enum OrganizationType {
  GLOBAL = 1,
  CLASS = 2,
  CLUB = 3,
}

export type NestedOrganization = {
  id: number;
  name: string;
};

export type Organization = NestedOrganization & {
  url: string;
  type: OrganizationType;
  advisors: NestedUser[];
  admins: NestedUser[];
  day?: DayOfWeek;
  time?: APITime;
  link?: string;
};

// Poll

enum PollType {
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

export type Event = {
  id: number;
  url: string;
  organization: NestedOrganization;
  name: string;
  description: string;
  start: APIDateTime;
  end: APIDateTime;
  points: number;
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
