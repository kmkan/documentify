import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom as createRoomAPI, getRoom } from '../services/api';

export default function Home() {
  const [createRoomName, setCreateRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (createRoomName.trim()) {
      try {
        const room = await createRoomAPI(createRoomName);
        navigate(`/room/${room.roomId}`);
      } catch (error) {
        console.error('Failed to create room', error);
      }
    }
  };

  const handleJoin = async () => {
    if (joinRoomId.trim()) {
      try {
        const room = await getRoom(joinRoomId);
        if (room) {
          navigate(`/room/${room.roomId}`);
        } else {
          setError('Room does not exist.');
          setTimeout(() => setError(''), 3000);
        }
      } catch (err) {
        setError('Room does not exist.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Documentify</h1>
      <p style={styles.subtitle}>Collaborative Minimalistic Documents</p>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a Room Name"
          value={createRoomName}
          onChange={(e) => setCreateRoomName(e.target.value)}
        />
        <button style={styles.button} onClick={handleCreate}>Create Room</button>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <button style={styles.button} onClick={handleJoin}>Join Room</button>
      </div>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: '1rem',
  },  
  title: {
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '3rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },  
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    marginRight: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '250px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  divider: {
    margin: '1rem 0',
    color: '#999',
  },
  errorBanner: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontWeight: '600',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  divider: {
    width: '100%',
    maxWidth: '400px',
    margin: '1.5rem auto',
    border: 'none',
    borderTop: '1px solid #ddd',
  },
  title: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '3rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },  
};