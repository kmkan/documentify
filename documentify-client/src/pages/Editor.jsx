import { useParams } from 'react-router-dom';

export default function Editor() {
  const { roomId } = useParams();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Editing Room: {roomId}</h1>
      <textarea
        style={{ width: '100%', height: '80vh', fontSize: '1rem' }}
        placeholder="Start writing..."
      ></textarea>
    </div>
  );
}
