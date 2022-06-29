import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';
import styles from './CInput.module.scss';

export const CInput = React.memo(
  (props: any) => {
    const {
      name = '',
      label,
      placeholder,
      classNameLabel = 'form-label',
      classNameInput = 'form-control',
      classNameDiv = 'form-group',
      ...rest
    } = props;

    const { register, formState } = useFormContext();

    return (
      <div className={classNameDiv}>
        <label className={classNameLabel}>{label}</label>
        <input
          autoComplete="off"
          className={`
            ${classNameInput} 
            ${formState.errors[name] && styles.borderError}
          `}
          placeholder={placeholder}
          {...register(name)}
          {...rest}
        ></input>
        <div className={styles.msgError}>
          <ErrorMessage errors={formState.errors} name={name} />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.formState?.isDirty === nextProps.formState?.isDirty
);

CInput.displayName = 'CInput';
