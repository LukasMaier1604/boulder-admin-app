
import styles from './PageHeader.module.css';

const PageHeader = ({ title, action }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {action && (
        <button
          className={styles.actionButton}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </header>
  );
};

export default PageHeader;
