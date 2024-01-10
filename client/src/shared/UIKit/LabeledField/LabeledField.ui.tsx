import { FC, PropsWithChildren, memo, useCallback } from "react"
import styles from './LabeledField.module.css';
import { FieldTypes } from "shared/types";
import { formatDate } from "shared/lib/dateFormater";

interface ILabeledFieldProps{
    label: string,
    children?: string,
    type?: FieldTypes
    className?: string
    direction?: 'row' | 'column'
}

export const LabeledField:FC<ILabeledFieldProps> = memo(({children, label, direction='row', className, type}) => {
    const classes = `
      ${styles.field}
      ${direction === 'row' ? styles.inlineField : styles.blockField} 
      ${className ? className : ''}
    `

    const prepareChildren = useCallback((children: string | undefined) => {
        if(type === FieldTypes.date && children) return formatDate(children);
        if(children) return children;
        return 'Не указано';
    }, [type])

    return (
      <div className={classes}>
          <label className={styles.label}>{label}:</label>
          <div className={styles.value}>{prepareChildren(children)}</div>
      </div>
    )
})
