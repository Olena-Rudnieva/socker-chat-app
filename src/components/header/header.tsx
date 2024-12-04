import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import axios from 'axios';
import { User } from '../../types';

const BASE_URL = import.meta.env.VITE_API_URL;

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post(`${BASE_URL}/api/users/logout`)
      .then(() => {
        localStorage.removeItem('userId');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.image}>
          <img src="/user.png" alt="Avatar" />
        </div>
        {user && (
          <p>
            {user.firstName} {user.lastName}
          </p>
        )}
      </div>
      <button className={styles.button} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};
