import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './loginForm.module.css';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';

axios.defaults.baseURL = BASE_URL;

interface LoginFormInputs {
  firstName: string;
  lastName: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log('Дані форми:', data);
    axios
      .post(`${BASE_URL}/api/users/add`, data)
      .then((response) => {
        const { id } = response.data;
        localStorage.setItem('userId', id);
        navigate('/main');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
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

      <button className={styles.button} type="submit">
        Join
      </button>
    </form>
  );
};
