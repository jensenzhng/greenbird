import React, { useEffect, useState } from 'react';

function Stream() {
    const [currentControl, setCurrentControl] = useState(undefined);
    const [socket, setSocket] = useState(undefined);
    
    //dummy data; using webcam to simulate streaming from the drone
    const stream = () => {
        let constraints = { 
            audio: false, 
            video: { 
                width: '100%', 
                // height: 'auto'
            } 
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(mediaStream => {
                let video = document.querySelector('video');

                video.srcObject = mediaStream;
                video.onloadedmetadata = e => {
                    video.play();
                }
            })
            .catch(err => {
                console.log(err.name + ": " + err.message);
            })
    }

    const setUpWebsocket = async () => {
        const ws = new WebSocket('ws://greenbird-12.herokuapp.com/');
        await setSocket(ws);
    }

    const checkKeyDown = (e) => {
        if (e.keyCode === 37) {
            console.log('left');
            socket.send('Pressed Left');
        } else if (e.keyCode === 38) {
            console.log('up');
            socket.send('Pressed Up');
        } else if (e.keyCode === 39) {
            console.log('right');
            socket.send('Pressed Right');
        } else if (e.keyCode === 40) {
            console.log('down');
            socket.send('Pressed Down');
        } else if (e.keyCode === 87) {
            console.log('w');
            socket.send('Pressed W');
        } else if (e.keyCode === 65) {
            console.log('a');
            socket.send('Pressed A');
        } else if (e.keyCode === 83) {
            console.log('s');
            socket.send('Pressed S');
        } else if (e.keyCode === 68) {
            console.log('d');
            socket.send('Pressed D');
        }

    }

    const checkKeyUp = (e) => {
        socket.send('No control currently')
    }

    const detectKeyPresses = () => {
        document.addEventListener("keydown", checkKeyDown, false);
        document.addEventListener("keyup", checkKeyUp, false);
    }

    useEffect(() => {
        async function init() {
            await setUpWebsocket();
        }
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!socket) return;

        console.log(socket);
        socket.addEventListener('open', function (event) {
            socket.send('Hello Server!');
        });

        socket.onmessage = function (event) {
            let msg = JSON.parse(event.data);
            console.log(msg);
            setCurrentControl(msg)
        };
        detectKeyPresses();
        stream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    return ( 
        <>
            {/* <div className="video-stream">
                <video autoPlay={true} id="videoElement" className='w-screen h-screen '></video>
            </div> */}
            <div className="currentKey">
                    <h2>
                        {currentControl?.msg}
                    </h2>
            </div>
        </>
     );
}

export default Stream;