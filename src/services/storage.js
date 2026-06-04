const STORAGE_KEYS = {
  SESSION: 'boulder_admin_session',
  ROUTES: 'boulder_admin_routes',
  HALL_INFO: 'boulder_admin_hall_info',
  USERS: 'boulder_admin_users',
  ROUTE_STATS: 'boulder_admin_route_stats',
};

export const getSession = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

export const setSession = (session) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const getRoutes = () => {
  try {
    const routes = localStorage.getItem(STORAGE_KEYS.ROUTES);
    return routes ? JSON.parse(routes) : [];
  } catch (error) {
    console.error('Error retrieving routes:', error);
    return [];
  }
};

export const setRoutes = (routes) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  } catch (error) {
    console.error('Error saving routes:', error);
  }
};

export const getHallInfo = () => {
  try {
    const hallInfo = localStorage.getItem(STORAGE_KEYS.HALL_INFO);
    return hallInfo ? JSON.parse(hallInfo) : null;
  } catch (error) {
    console.error('Error retrieving hall info:', error);
    return null;
  }
};

export const setHallInfo = (info) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HALL_INFO, JSON.stringify(info));
  } catch (error) {
    console.error('Error saving hall info:', error);
  }
};

export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error retrieving users:', error);
    return [];
  }
};

export const setUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const getRouteStats = () => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.ROUTE_STATS);
    return stats ? JSON.parse(stats) : [];
  } catch (error) {
    console.error('Error retrieving route stats:', error);
    return [];
  }
};

export const addRouteStat = (stat) => {
  try {
    const stats = getRouteStats();
    stats.push({
      ...stat,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.ROUTE_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error adding route stat:', error);
  }
};
