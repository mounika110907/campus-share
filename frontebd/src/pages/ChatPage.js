import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const currentUser = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverUser, setReceiverUser] = useState(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);

  const findReceiver = async () => {
    if (!receiverEmail.trim()) {
      setErrorMsg('Please enter receiver email');
      setReceiverUser(null);
      setMessages([]);
      return;
    }

    if (receiverEmail.trim().toLowerCase() === currentUser?.email?.toLowerCase()) {
      setErrorMsg('You cannot chat with yourself');
      setReceiverUser(null);
      setMessages([]);
      return;
    }

    try {
      setLoadingUser(true);
      const res = await API.get(`/auth/find-user?email=${encodeURIComponent(receiverEmail.trim())}`);
      setReceiverUser(res.data);
      setErrorMsg('');
    } catch (error) {
      setReceiverUser(null);
      setMessages([]);
      setErrorMsg(error.response?.data?.message || 'User not found');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;

    try {
      const res = await API.get(`/chat/${userId}`);
      setMessages(res.data);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error loading messages');
    }
  };

  const sendMessage = async () => {
    if (!receiverUser?._id) {
      setErrorMsg('Find a valid user first');
      return;
    }

    if (!text.trim()) {
      setErrorMsg('Please type a message');
      return;
    }

    try {
      const res = await API.post('/chat', {
        receiverId: receiverUser._id,
        text: text.trim()
      });

      socket.emit('send_message', res.data);
      setText('');
      setErrorMsg('');
      fetchMessages(receiverUser._id);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error sending message');
    }
  };

  useEffect(() => {
    if (receiverUser?._id) {
      fetchMessages(receiverUser._id);
    }
  }, [receiverUser]);

  useEffect(() => {
    socket.on('receive_message', () => {
      if (receiverUser?._id) {
        fetchMessages(receiverUser._id);
      }
    });

    return () => socket.off('receive_message');
  }, [receiverUser]);

  return (
    <div>
      <Navbar />

      <div className="form-page">
        <div className="chat-page">
          <h2>Chat</h2>

          <div className="chat-search-row">
            <input
              type="email"
              placeholder="Enter receiver email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
            />
            <button type="button" onClick={findReceiver}>
              Find User
            </button>
          </div>

          {loadingUser && <p>Finding user...</p>}

          {receiverUser && (
            <div className="chat-user-box">
              <p><strong>Name:</strong> {receiverUser.name}</p>
              <p><strong>Email:</strong> {receiverUser.email}</p>
              <p><strong>Department:</strong> {receiverUser.department}</p>
            </div>
          )}

          {errorMsg && <p className="chat-error">{errorMsg}</p>}

          <div className="chat-box">
            {messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages.map((msg) => {
                const isMine =
                  (msg.sender?._id || msg.sender) === currentUser?._id;

                return (
                  <div
                    key={msg._id}
                    className={isMine ? 'message my-message' : 'message other-message'}
                  >
                    <small>
                      {isMine ? 'You' : msg.sender?.name || 'User'}
                    </small>
                    <div>{msg.text}</div>
                  </div>
                );
              })
            )}
          </div>

          <div className="chat-input-row">
            <input
              placeholder="Type message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;