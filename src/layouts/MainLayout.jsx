import { useNavigate, useLocation } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav';
import { getHallInfo } from '../services/storage';
import { clearSession } from '../services/storage';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hallInfo = getHallInfo();
  const hallName = hallInfo?.name || 'Main Hall';

  // activeMenu wird aus der URL abgeleitet, nicht aus isoliertem State
  const routeToMenu = {
    '/dashboard': 'dashboard',
    '/routen': 'routen',
    '/hallen-info': 'hallen',
    '/auswertung': 'auswertung',
  };
  const activeMenu = routeToMenu[location.pathname] || 'dashboard';

  const menuToRoute = {
    dashboard: '/dashboard',
    routen: '/routen',
    hallen: '/hallen-info',
    auswertung: '/auswertung',
  };

  const handleMenuChange = (menuId) => {
    navigate(menuToRoute[menuId] || '/dashboard');
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <SidebarNav activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>
              Admin Center — {hallName}
            </h1>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
