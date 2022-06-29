import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';
import styles from './CSelect.module.scss';

export const CSelect = React.memo((props: any) => {
  const {
    name,
    label,
    placeholder = 'Seleccione un valor',
    // classNameLabel = 'form-label',
    // classNameSelect = 'form-control',
    // classNameDiv = 'form-group',
    options = [],
    valueName = '' ,
    ...rest
  } = props;

  const { register, formState } = useFormContext();
  return (
    <div className={`${styles.div} ${styles.error}`}>
      <label className={styles.label}>{label}</label>
      <select className={`${styles.select}`} {...register(name)} {...rest} >
        {options.map((value: any) => (
            <option key={value.id} value={value.id}>
              {value[`${valueName}`]}
            </option>
        ))}
      </select>
      <div className="message-error">
        <ErrorMessage errors={formState.errors} name={name} />
      </div>
    </div>
  );
}
);

CSelect.displayName = 'CSelect';
