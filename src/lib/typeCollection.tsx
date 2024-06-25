export type UserData = {
  id?: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  role?: {
    id?: number;
    name?: string;
  };
};

export type ChannelData = {
  id?: number;
  name?: string;
  isActive?: boolean;
  userId?: number;
};

export type ProgramData = {
  start?: string;
  size?: string;
  filters?: string;
  filtersFn?: string;
  globalFilter?: string;
  sorting?: string;
};

export type PermissionData = {
  name: string;
  action: string;
  subject: string;
  inverted?: boolean;
  conditions?: any;
  fields?: any;
  reason?: string;
};
