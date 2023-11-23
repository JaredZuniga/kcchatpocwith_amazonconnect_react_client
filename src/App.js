import './App.css';
import io from "socket.io-client";
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Chat} from './chat';

function App() {

  const apiURL = "https://miapiendpoint.com";
  const [url, setUrl] = useState("");
  const [connectionToken, setConnectionToken] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const connectToWebsocket = async() => {

    const response = await axios.post(apiURL+'/getws?DisplayName=eljosa&Content='+welcomeMessage);
    console.log(response);
    const {Url} = response.data.message['Websocket'];    
    const {ConnectionToken} = response.data.message['ConnectionCredentials'];
    setConnectionToken(ConnectionToken);
    setUrl(Url);
  }

  return (
    <div className="App">
      <h1>Kare chat app Amazon Connect + Lambda + React POC</h1>
      <h2>Type your first message to connect</h2>
      {url === "" ? <input value={welcomeMessage} onChange={(event) => setWelcomeMessage(event.target.value)} /> : <></>}
      {url === "" ? <button onClick={() => connectToWebsocket()}>Conectar ws</button> : <></>}
      {url === "" ? <h1>Disconnected</h1>: <Chat connectionToken={connectionToken} url={url} apiURL={apiURL} />}
    </div>
  );
}

export default App;