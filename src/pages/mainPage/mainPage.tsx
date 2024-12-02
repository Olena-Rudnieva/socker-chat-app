import { useEffect, useState } from 'react';
import { Chats, Header } from '../../components';
import { User } from '../../types';
import styles from './mainPage.module.css';
import axios from 'axios';
// import { io, Socket } from 'socket.io-client';

const MainPage = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [socket, setSocket] = useState<Socket | null>(null);

  // console.log('socket', socket);
  console.log('user', user);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios
        .get(`/api/users/${userId}`)
        .then((response) => {
          console.log('response.data', response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      // const newSocket = io('http://localhost:5001');
      // setSocket(newSocket);

      const data = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        room: `${user.firstName} ${user.lastName}`,
      };

      console.log('data', data);

      // newSocket.emit('joinRoom', data);

      // return () => {
      //   newSocket.disconnect();
      // };
    }
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftside}>
        <Header user={user} />
        <Chats />
      </div>
      <div className={styles.rightside}>
        {/* <ChatRoom socket={socket}/> */}
      </div>
    </div>
  );
};

export default MainPage;
