import ReactDOM from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import styles from './modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
}: ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <IoMdClose size="24" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
};
