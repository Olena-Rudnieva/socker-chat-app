import styles from './modalConfirmDelete.module.css';

interface ModalConfirmDeleteProps {
  handleModalToggle: () => void;
  handleConfirmDelete: () => void;
}

export const ModalConfirmDelete = ({
  handleModalToggle,
  handleConfirmDelete,
}: ModalConfirmDeleteProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Delete Chat</h2>
      <p className={styles.message}>
        Are you sure you want to delete this chat?
      </p>
      <div className={styles.buttonGroup}>
        <button className={styles.confirmButton} onClick={handleConfirmDelete}>
          Delete
        </button>
        <button className={styles.cancelButton} onClick={handleModalToggle}>
          Cancel
        </button>
      </div>
    </div>
  );
};
