import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

import styles from './CButton.module.scss';

export const CButton = React.memo((props: any) => {
  const {
    label,
    loading = false,
    disable = false,
    colorSpinner = "#f1f0eb",
    classNameDiv = "",
    classNameButton = "",
    ...rest
  } = props;

  return (
    <div className={classNameDiv}>
      <button
        className={`${classNameButton} ${(disable || loading) && styles.disable}`}
        disabled={disable || loading}
        {...rest}
      >
        {loading ? (
          <BeatLoader color={colorSpinner} loading={true} size={15} />
        ) : (
          label
        )}
      </button>
    </div>
  );
});

CButton.displayName = "CButton";
