const allRoles = {
  user: ['getUsers', 'manageUsers', 'manageUserPreferences', 'getUserPreferences', 'getSuggestedSchedule'],
  admin: ['getUsers', 'manageUsers'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
