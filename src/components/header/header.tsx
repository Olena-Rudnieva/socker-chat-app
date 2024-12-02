import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import axios from 'axios';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('/api/users/logout').then(() => {
      navigate('/');
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.image}>
          <img src="https://via.placeholder.com/40" alt="Avatar" />
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
