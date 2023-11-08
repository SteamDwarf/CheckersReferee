import { FC, PropsWithChildren, useState } from 'react';
import { faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EditableField.module.css';

interface IEditableFieldProps extends PropsWithChildren {
    editComponent: React.ReactNode,
    onSave: () => void
}

export const EditableField:FC<IEditableFieldProps> = ({children, editComponent, onSave}) => {
    const [isEditing, setIsEditing] = useState(false);

    const save = () => {
        onSave();
        setIsEditing(false);
    }

    return (
      <div>
        {
            !isEditing
            ? (
                <div className={styles.fieldContainer}>
                    <FontAwesomeIcon 
                        className={styles.actionButton} 
                        icon={faPencil} 
                        onClick={() => setIsEditing(true)}
                    />
                    {children}
                </div>
            )
            : (
                <div className={styles.fieldContainer}>
                    <FontAwesomeIcon 
                        icon={faFloppyDisk}
                        className={styles.actionButton}
                        onClick={save}
                    />
                    {editComponent}
                </div>
            )
        }
      </div>
    )

}