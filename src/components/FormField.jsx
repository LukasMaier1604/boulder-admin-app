import React from 'react';
import styles from './FormField.module.css';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  placeholder,
  options,
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const containerClass = `${styles.container} ${error ? styles.error : ''}`;

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">
            {placeholder || 'Select an option'}
          </option>
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
        />
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default FormField;
