import { useState } from 'react';
import axios from 'axios';
import useWebSocket, { ReadyState } from 'react-use-websocket';


export const Chat = ({url, connectionToken, apiURL}) => {

    const [allMessages, setAllMessages] = useState([]);

    const [isWritting, setIsWritting] = useState(false);

    const [input, setInput] = useState("")

    const { sendJsonMessage ,  readyState } = useWebSocket(url, {
        onOpen: () => {
          sendJsonMessage({"topic":"aws/subscribe","content":{"topics":["aws/chat"]}})
        },
        onMessage: (message) => {

            const messageInfo = JSON.parse(message.data);
            const {content} = messageInfo;

            if(typeof(content)==="string"){

                const parsedContent = JSON.parse(content);

                let {ContentType} = parsedContent;

                if(ContentType === "application/vnd.amazonaws.connect.event.typing") {
                    setIsWritting(true);
                } else if (ContentType === "text/plain") {
                    setIsWritting(false);
                    let msgString = parsedContent.DisplayName+": "+parsedContent.Content;
                    setAllMessages(oldMessages => [...oldMessages, msgString])
                }
            }
        },
        onError: (error) => {
            console.log(error);
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });


    const send = async () => {
        try {
            const body = {
                connectionToken,
                message: input
            }
            setInput("");
            await axios.post(apiURL+"/send/", body);
        }catch(exception) {
            console.log(exception);
        }
    }
    return (
        <div>
            {readyState ? <h1>Connected</h1> : <h1>loading ...</h1> }
            <ul>
            {
                    allMessages.map(
                    (msg, index) => <li key={index}>{msg}</li>
                   )
            }
            </ul>
            <input value={input} onChange={({target}) => setInput(target.value)} />
            <button onClick={()=>send()}>submit</button>
            {isWritting ? <p>KC esta escribiendo</p> : <></>}
        </div>
    )

}
