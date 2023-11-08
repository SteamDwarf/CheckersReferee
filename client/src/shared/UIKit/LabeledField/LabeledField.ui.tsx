import { FC, PropsWithChildren, memo } from "react"
import styles from './LabeledField.module.css';

interface ILabeledFieldProps extends PropsWithChildren{
    label: string,
    className?: string
    direction?: 'row' | 'column'
}

export const LabeledField:FC<ILabeledFieldProps> = memo(({children, label, direction='row', className}) => {
    const classes = `
      ${styles.field}
      ${direction === 'row' ? styles.inlineField : styles.blockField} 
      ${className ? className : ''}
    `

    return (
      <div className={classes}>
          <label className={styles.label}>{label}:</label>
          <div className={styles.value}>{children || 'Не указано'}</div>
      </div>
    )
})
