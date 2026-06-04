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

export const initializeData = () => {
  if (getRoutes().length === 0) {
    const mockRoutes = [
      {
        id: 'route-1',
        name: 'Easy Start',
        grade: 'V0',
        gradeValue: 0,
        wallType: 'Vertical',
        location: 'Wall A',
        description: 'Perfect warm-up route',
        betaSteps: ['Use feet first', 'Move hips in', 'Reach to the top'],
        date: new Date().toISOString().split('T')[0],
        status: 'active',
      },
      {
        id: 'route-2',
        name: 'Crimpy Challenge',
        grade: 'V2',
        gradeValue: 2,
        wallType: 'Slab',
        location: 'Wall B',
        description: 'Requires good grip strength',
        betaSteps: ['Crimp the jugs', 'Lock arms', 'Dyno to the top'],
        date: new Date().toISOString().split('T')[0],
        status: 'active',
      },
      {
        id: 'route-3',
        name: 'The Overhang',
        grade: 'V4',
        gradeValue: 4,
        wallType: 'Overhang',
        location: 'Wall C',
        description: 'Strength endurance test',
        betaSteps: ['Work your way up the overhang', 'Use body tension', 'Power finish'],
        date: new Date().toISOString().split('T')[0],
        status: 'active',
      },
      {
        id: 'route-4',
        name: 'Cave Master',
        grade: 'V6',
        gradeValue: 6,
        wallType: 'Cave',
        location: 'Wall D',
        description: 'Expert level - requires technique and strength',
        betaSteps: ['Use dynamic movements', 'Precision placements', 'Full body engagement'],
        date: new Date().toISOString().split('T')[0],
        status: 'active',
      },
    ];
    setRoutes(mockRoutes);
  }

  if (getUsers().length === 0) {
    const mockUsers = [
      { id: 'user-1', name: 'Alice', level: 'Beginner', avatarColor: '#FF6B6B', sessionsCount: 12, climbedRoutes: [] },
      { id: 'user-2', name: 'Bob', level: 'Intermediate', avatarColor: '#4ECDC4', sessionsCount: 25, climbedRoutes: [] },
      { id: 'user-3', name: 'Charlie', level: 'Advanced', avatarColor: '#45B7D1', sessionsCount: 48, climbedRoutes: [] },
      { id: 'user-4', name: 'Diana', level: 'Expert', avatarColor: '#FFA07A', sessionsCount: 72, climbedRoutes: [] },
    ];
    setUsers(mockUsers);
  }

  if (getRouteStats().length === 0) {
    const mockStats = [
      { userId: 'user-1', routeId: 'route-1', attempts: 2, topped: true, date: new Date(Date.now() - 86400000).toISOString() },
      { userId: 'user-1', routeId: 'route-2', attempts: 5, topped: false, date: new Date(Date.now() - 172800000).toISOString() },
      { userId: 'user-2', routeId: 'route-1', attempts: 1, topped: true, date: new Date(Date.now() - 259200000).toISOString() },
      { userId: 'user-2', routeId: 'route-3', attempts: 8, topped: true, date: new Date(Date.now() - 345600000).toISOString() },
      { userId: 'user-3', routeId: 'route-3', attempts: 4, topped: true, date: new Date(Date.now() - 432000000).toISOString() },
      { userId: 'user-3', routeId: 'route-4', attempts: 12, topped: false, date: new Date(Date.now() - 518400000).toISOString() },
      { userId: 'user-4', routeId: 'route-4', attempts: 3, topped: true, date: new Date(Date.now() - 604800000).toISOString() },
    ];
    const stats = getRouteStats();
    if (stats.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ROUTE_STATS, JSON.stringify(mockStats));
    }
  }

  if (!getHallInfo()) {
    const mockHallInfo = {
      name: 'Boulder Heights Climbing Hall',
      address: { street: 'Klettererstraße 42', zip: '10115', city: 'Berlin' },
      contact: { phone: '+49 30 12345678', email: 'info@boulderheights.de', website: 'www.boulderheights.de' },
      description: 'Modern bouldering hall with over 100 routes, perfect for all skill levels.',
      hours: [
        { day: 'Montag', from: '09:00', to: '22:00' },
        { day: 'Dienstag', from: '09:00', to: '22:00' },
        { day: 'Mittwoch', from: '09:00', to: '22:00' },
        { day: 'Donnerstag', from: '09:00', to: '22:00' },
        { day: 'Freitag', from: '09:00', to: '23:00' },
        { day: 'Samstag', from: '10:00', to: '23:00' },
        { day: 'Sonntag', from: '10:00', to: '21:00' },
      ],
      prices: [
        { category: 'Erwachsene (Tageskarte)', price: '15' },
        { category: 'Studenten/Rentner', price: '12' },
        { category: '10er-Karte', price: '120' },
      ],
      news: [
        { date: new Date().toISOString().split('T')[0], text: 'Neue Anfängerrouten eingesetzt!' },
      ],
    };
    setHallInfo(mockHallInfo);
  }
};
