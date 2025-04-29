import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoom, updateRoom } from '../services/api';
import socket from '../services/socket';

export default function Editor() {
  const { roomId } = useParams();
  const [document, setDocument] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [userCount, setUserCount] = useState(1); 

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const room = await getRoom(roomId);
        setDocument(room.document || '');
      } catch (error) {
        console.error('Failed to load room', error);
      }
    };
  
    fetchDocument();
  
    socket.emit('join-room', roomId);
  
    socket.on('receive-changes', (newDocument) => {
      setDocument(newDocument);
    });
  
    socket.on('user-count', (count) => {
      setUserCount(count);
    });
  
    return () => {
      socket.off('receive-changes');
      socket.off('user-count');
    };
  }, [roomId]);  

  const handleChange = (e) => {
    const newDoc = e.target.value;
    setDocument(newDoc);
    setSaveStatus('Saving...');
    socket.emit('send-changes', { roomId, document: newDoc });
  
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
  
    const timeout = setTimeout(() => {
      saveDocument();
    }, 500);
  
    setSaveTimeout(timeout);
  };  

  const saveDocument = async () => {
    try {
      await updateRoom(roomId, document);
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Failed to save document', error);
      setSaveStatus('Failed to Save');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.roomName}>{roomId}</div>
          <div style={styles.usersOnline}>
            {userCount} {userCount === 1 ? 'user' : 'users'} online
          </div>
        </div>
        <div style={styles.saveStatus}>{saveStatus}</div>
      </div>
      <textarea
        style={styles.textarea}
        value={document}
        onChange={handleChange}
        placeholder="Start writing..."
      />
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    maxWidth: '100vw',
    maxHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },  
  header: {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
  roomName: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
  },  
  saveStatus: {
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem',
    color: 'black', 
    fontStyle: 'normal',
  },  
  textarea: {
    flex: 1,
    width: '100%',
    padding: '2rem',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
    resize: 'none',
    backgroundColor: '#f9f9f9',
    color: '#333',
    overflow: 'auto',    
  },  
};