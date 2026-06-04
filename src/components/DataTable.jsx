import { useState, useMemo } from 'react';
import styles from './DataTable.module.css';

const DataTable = ({ columns, data, onSort }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  const handleSort = (accessor) => {
    if (!columns.find(col => col.accessor === accessor)?.sortable) {
      return;
    }

    let direction = 'asc';
    if (sortConfig.key === accessor && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: accessor, direction });
    if (onSort) {
      onSort(accessor, direction);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [data, sortConfig]);

  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.accessor}
                className={column.sortable ? styles.sortable : ''}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                <div className={styles.headerContent}>
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className={styles.sortIndicator}>
                      {sortConfig.key === column.accessor ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : (
                        '⇅'
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(column => (
                <td key={`${rowIndex}-${column.accessor}`}>
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
