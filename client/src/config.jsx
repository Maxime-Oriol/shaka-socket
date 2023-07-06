import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const ConfigPanel = () => {
    const socket = io('http://localhost:3001')
    socket.connect()
    const queryRoom = useParams().room
    
    const [room, setRoom] = useState(localStorage.getItem('player-key'));
    const [inputRoom, setInputRoom] = useState(room)
    const [sharedConfig, setSharedConfig] = useState({
        title: "Big Buck Bunny",
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      })
    const [url, setUrl] = useState(sharedConfig.url)
    
    const examples = [
        {
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "Big Buck Bunny"
        }, {
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            title: "Elephants Dream"
        }, {
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            title: "Review Volkswagen GTI"
        }
    ]

    
    useEffect(() => {
        if (queryRoom != null && room != queryRoom) {
            setRoom(queryRoom);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('player-key', room)
        if (room != queryRoom) {
            document.location.href = "/config/"+room
        }
        socket.emit('join', room)
    }, [room])

    

    useEffect(() => {
        sendMeddsage()
    }, [sharedConfig])
    
    const sendMeddsage = () => {
        socket.emit('set_config', { room: room, data: sharedConfig})
    }

    
    const handleClick = (event) => {
        const id = parseInt(event.target.getAttribute('data-value'))
        const dataValue = examples[id];
        setUrl(dataValue.url)
        setSharedConfig({...sharedConfig, url: dataValue.url, title: dataValue.title})
    }

    const handleChange = (event) => {
        setUrl(event.target.value)
    }

    const handleApply = () => {
        setSharedConfig({...sharedConfig, url: url})
    }

    const handleApplyRoom = () => {
        setRoom(inputRoom)
    }

    const handleChangeRoom = () => {
        const newValue = document.getElementById('room').value
        setInputRoom(newValue)
    }

    return (
        <div className="config-panel">
            <div>
                <label htmlFor="room">Code config :</label>
                <input type="text" name="room" id="room" value={inputRoom} onChange={handleChangeRoom} />
                <button name="btn-save-room" id="btnSaveRoom" onClick={handleApplyRoom}>Apply</button>
            </div>
            <div>
                <label htmlFor="url">URL de la vidéo :</label>
                <input type="text" name="url" id="url" value={url} onChange={handleChange} />
                <button name="btn-save" id="btnSave" onClick={handleApply}>Apply</button>
            </div>
            <div className="shortcuts">
                <button name="short" onClick={handleClick} data-value="0">Bunny</button>
                <button name="short" onClick={handleClick} data-value="1">Elephant</button>
                <button name="short" onClick={handleClick} data-value="2">GTI Review</button>
            </div>
        </div>
    )
};

export default ConfigPanel;