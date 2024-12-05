import { ChatRoom, Chats, Header } from '../../components';
import styles from './mainPage.module.css';
import { useMainPage } from './hooks';

const MainPage = () => {
  const {
    user,
    chats,
    selectedChat,
    handleChatSelect,
    handleNewChat,
    setChats,
  } = useMainPage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftside}>
        <Header user={user} />
        <Chats
          user={user}
          chats={chats}
          handleChatSelect={handleChatSelect}
          handleNewChat={handleNewChat}
        />
      </div>
      <div className={styles.rightside}>
        <ChatRoom chat={selectedChat} user={user} setChats={setChats} />
      </div>
    </div>
  );
};

export default MainPage;
