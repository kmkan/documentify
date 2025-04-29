import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom as createRoomAPI } from '../services/api';

export default function Home() {
  const [createRoomName, setCreateRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (createRoomName.trim()) {
      const roomId = generateRoomId(createRoomName);

      try {
        await createRoomAPI(roomId);  // 👈 call backend API here
        navigate(`/room/${roomId}`);
      } catch (error) {
        console.error('Failed to create room', error);
      }
    }
  };

  const handleJoin = () => {
    if (joinRoomId.trim()) {
      navigate(`/room/${joinRoomId}`);
    }
  };

  const generateRoomId = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Documentify</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Room Name"
          value={createRoomName}
          onChange={(e) => setCreateRoomName(e.target.value)}
        />
        <button style={styles.button} onClick={handleCreate}>Create</button>
      </div>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <button style={styles.button} onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '3rem',
  },
  form: {
    display: 'flex',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    marginRight: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
