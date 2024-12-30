import { useEffect, useState } from 'react';
import './App.css';
import Guest from './components/Guest';

function App() {
  const [api, setAPI] = useState("");

  useEffect(() => {
    if (api){
      
    }
  }, [api])

  return (
    <Guest setAPI={setAPI}/>
  );
}

export default App;

