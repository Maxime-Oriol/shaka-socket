import React, { useState, useRef, useEffect } from 'react';
import shaka from 'shaka-player';
import { io } from 'socket.io-client';

const VideoPlayer = () => {
    const videoRef = useRef(null)
    const [sharedConfig, setSharedConfig] = useState({
        title: "Big Buck Bunny",
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      })

    const socket = io('http://localhost:3001')
    socket.connect()
    const [room, setRoom] = useState(localStorage.getItem('player-key'));

    socket.on('receive_config', (data) => {
        setSharedConfig({...sharedConfig, ...data})
    })

    const loadMedia = () => {
        const player = new shaka.Player(videoRef.current);
        player.addEventListener('error', onError);
        player.load(sharedConfig.url).then(() => {

        }).catch(onError);
    }



    useEffect(() => {

        if (shaka.Player.isBrowserSupported()) {
            loadMedia()
        }

        if (localStorage.getItem('player-key') == undefined) {
            const key = Math.random().toString(36).substring(2,7);
            localStorage.setItem('player-key', key);
            setRoom(key)
        }

        return () => {
            //socket.disconnect()
        }
    }, []);

    useEffect(() => {
        socket.emit('join', room);
    }, [room])

    useEffect(() => {
        loadMedia()
    }, [sharedConfig])

    const handleChangeRoom = () => {
        const key = Math.random().toString(36).substring(2,7);
        localStorage.setItem('player-key', key);
        setRoom(key)
    }

    const onError = (error) => {
        console.error('Une erreur s\'est produite lors du chargement du lecteur Shaka :', error);
    }
    return (
        <div className="notorious-player">
            Code config : {room} &nbsp;&nbsp;&nbsp;<button name="btnChange" onClick={handleChangeRoom}>Change</button>
            <h1>{sharedConfig.title}</h1>
            <video ref={videoRef} width="640" height="360" controls />
        </div>
    );
}

export default VideoPlayer;