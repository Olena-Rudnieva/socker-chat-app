import { useForm, SubmitHandler } from 'react-hook-form';
import { Chat } from '../../types';
import styles from './modalEditChat.module.css';

interface ModalEditChatProps {
  chat: Chat | null;
  handleModalToggle: () => void;
  handleUpdateChat: (updatedChat: {
    firstName: string;
    lastName: string;
  }) => void;
}

interface EditChatInputs {
  firstName: string;
  lastName: string;
}

export const ModalEditChat = ({
  chat,
  handleModalToggle,
  handleUpdateChat,
}: ModalEditChatProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditChatInputs>({
    defaultValues: {
      firstName: chat?.firstName || '',
      lastName: chat?.lastName || '',
    },
  });

  const onSubmit: SubmitHandler<EditChatInputs> = (data) => {
    handleUpdateChat(data);
    handleModalToggle();
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Edit Chat</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.wrapper}>
          <label htmlFor="firstName">First Name</label>
          <input
            className={styles.input}
            {...register('firstName', { required: 'First Name is required' })}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div className={styles.wrapper}>
          <label htmlFor="lastName">Last Name</label>
          <input
            className={styles.input}
            {...register('lastName', { required: 'Last Name is required' })}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>

        <div className={styles.buttonWrapper}>
          <button className={styles.saveButton} type="submit">
            Save
          </button>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={handleModalToggle}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
