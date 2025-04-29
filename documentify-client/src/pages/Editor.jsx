import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoom, updateRoom } from '../services/api';

export default function Editor() {
  const { roomId } = useParams();
  const [document, setDocument] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Load document from backend
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
  }, [roomId]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveDocument();
    }, 3000);

    return () => clearInterval(interval);
  }, [document]); 

  const saveDocument = async () => {
    try {
      await updateRoom(roomId, document);
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Failed to save document', error);
      setSaveStatus('Failed to Save');
    }
  };

  const handleChange = (e) => {
    setDocument(e.target.value);
    setSaveStatus('Saving...');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Editing Room: {roomId}</h1>
      <textarea
        style={{ width: '100%', height: '80vh', fontSize: '1rem' }}
        value={document}
        onChange={handleChange}
      />
      <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>{saveStatus}</div>
    </div>
  );
}
