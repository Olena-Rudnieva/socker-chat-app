import { LoginForm } from '../../components';
import styles from './loginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.section}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
