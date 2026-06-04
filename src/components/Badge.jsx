import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ label, variant = 'default' }) => {
  return (
    <span className={`${styles.badge} ${styles[`variant-${variant}`]}`}>
      {label}
    </span>
  );
};

export default Badge;
