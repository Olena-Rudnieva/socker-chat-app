import styles from './modalAddChat.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ModalAddChatProps {
  handleModalToggle: () => void;
}

interface AddChatInputs {
  firstName: string;
  lastName: string;
}

export const ModalAddChat = ({ handleModalToggle }: ModalAddChatProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddChatInputs>();

  const onSubmit: SubmitHandler<AddChatInputs> = (data) => {
    console.log('Дані форми:', data);
    handleModalToggle();

    //   axios
    //     .post(`${BASE_URL}/api/users/add`, data)
    //     .then(() => {
    //       navigate('/main');
    //     })
    //     .catch((error) => {
    //       console.error( error);
    //     });
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
