import { User } from '../../types';
import styles from './modalAddChat.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ModalAddChatProps {
  user: User | null;
  handleModalToggle: () => void;
  handleNewChat: (chatData: {
    firstName: string;
    lastName: string;
    userId: string;
  }) => void;
}

interface AddChatInputs {
  firstName: string;
  lastName: string;
  userId: string;
}

export const ModalAddChat = ({
  handleModalToggle,
  user,
  handleNewChat,
}: ModalAddChatProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddChatInputs>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const onSubmit: SubmitHandler<AddChatInputs> = async (data) => {
    if (user) {
      const chatData = {
        firstName: data.firstName,
        lastName: data.lastName,
        userId: user._id,
      };

      handleNewChat(chatData);
      handleModalToggle();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Add new chat</div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <label htmlFor="firstName">First Name</label>
          <input
            className={styles.input}
            id="firstName"
            {...register('firstName', { required: 'First Name is required' })}
          />
          {errors.firstName && (
            <p style={{ color: 'red' }}>{errors.firstName.message}</p>
          )}
        </div>

        <div className={styles.wrapper}>
          <label htmlFor="lastName">Last Name</label>
          <input
            className={styles.input}
            id="lastName"
            {...register('lastName', { required: 'Last Name is required' })}
          />
          {errors.lastName && (
            <p style={{ color: 'red' }}>{errors.lastName.message}</p>
          )}
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.button} type="submit">
            Add chat
          </button>
        </div>
      </form>
    </div>
  );
};
