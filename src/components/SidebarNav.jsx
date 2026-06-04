import { useState } from 'react';
import styles from './SidebarNav.module.css';

const SidebarNav = ({ activeMenu, onMenuChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'routen', label: 'Routen' },
    { id: 'hallen', label: 'Hallen-Info' },
    { id: 'auswertung', label: 'Auswertung' },
  ];

  const handleMenuClick = (menuId) => {
    onMenuChange(menuId);
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Boulder Admin</h1>
          </div>

          <ul className={styles.menu}>
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`${styles.menuItem} ${
                    activeMenu === item.id ? styles.active : ''
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <p className={styles.version}>v1.0.0</p>
        </div>
      </nav>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SidebarNav;
