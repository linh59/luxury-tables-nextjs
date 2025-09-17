export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  TableToken: 'TableToken'
} as const

export const Role = {
  Admin: 'Admin',
  Employee: 'Employee',
} as const

export const RoleValues = [Role.Admin, Role.Employee] as const

export const StoreStatusAPI = {
  active: 'active',
  request_active: 'request_active',
} as const;

export const StoreStatusAPIValues = Object.values(StoreStatusAPI);
export type StoreStatusAPIType = (typeof StoreStatusAPIValues)[number];

// UI filter (thêm all)
export const StoreStatusUIValues = ['all', ...StoreStatusAPIValues] as const;
export type StoreStatusUIType = (typeof StoreStatusUIValues)[number];

// Date Filter
export const DateFilter = {
  all: 'all',
  today: 'today',
  week: 'week',
  custom: 'custom',
} as const;

export const DateFilterValues = Object.values(DateFilter);
export type DateFilterType = (typeof DateFilterValues)[number];

// Sort Direction
export const SortDirOption = {
  desc: 'desc',
  asc: 'asc',
} as const;

export const SortDirOptionValues = Object.values(SortDirOption) ;
export type SortDirType = (typeof SortDirOptionValues)[number];


export const urlMerchant = "/v1/merchant"
