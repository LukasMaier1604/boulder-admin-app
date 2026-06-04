import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SidebarNav from '../components/SidebarNav';
import { getHallInfo } from '../services/storage';
import { clearSession } from '../services/storage';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const hallInfo = getHallInfo();
  const hallName = hallInfo?.name || 'Main Hall';
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    const routes = {
      dashboard: '/dashboard',
      routen: '/routen',
      hallen: '/hallen-info',
      auswertung: '/auswertung',
    };
    navigate(routes[menuId] || '/dashboard');
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
