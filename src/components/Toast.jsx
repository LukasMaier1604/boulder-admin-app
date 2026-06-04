import { useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import styles from './Toast.module.css';

const Toast = ({ message, type, duration = 3000, onRemove }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onRemove, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onRemove]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <p className={styles.message}>{message}</p>
      </div>
      <button
        className={styles.close}
        onClick={onRemove}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
