import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ label, value, icon, trend }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${styles[`trend-${trend.direction}`]}`}>
            <span className={styles.trendArrow}>
              {trend.direction === 'up' ? '▲' : '▼'}
            </span>
            <span className={styles.trendValue}>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
