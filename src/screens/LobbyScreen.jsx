import { useCallback, useState,useEffect } from 'react'
import { useSocket } from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'
const LobbyScreen = () => {


    const [email,setEmail]=useState('')
    const [room,setRoom]=useState('')
    const socket = useSocket()
    console.log('socket:', socket)
    const navigate = useNavigate()



   const handlesubitform = useCallback((e) => {
  e.preventDefault();
  socket.emit('roomjoin', { email, room });

  console.log('email:', email);
  console.log('room:', room);
}, [email, room, socket]); // ✅ added dependencies



const handlejoinRoom = useCallback((data) => {
  const {email, room} = data;
  navigate(`/room/${room}`);

},[navigate])





useEffect(() => {

    socket.on('roomjoin', handlejoinRoom);
return ()=> {

    socket.off('roomjoin', handlejoinRoom);


}

    },[socket, handlejoinRoom]);


    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                padding: "40px 32px",
                width: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    boxShadow: "0 4px 16px rgba(33,147,176,0.2)"
                }}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" fill="#fff"/>
                        <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z" fill="#fff"/>
                        <rect x="17" y="10" width="5" height="4" rx="1.5" fill="#2193b0"/>
                        <polygon points="22,12 17,10 17,14" fill="#6dd5ed"/>
                    </svg>
                </div>
                <h1 style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#1e3c72",
                    marginBottom: 8,
                    letterSpacing: 1
                }}>Join a Video Call</h1>
                <p style={{
                    color: "#555",
                    marginBottom: 24,
                    fontSize: "1rem",
                    textAlign: "center"
                }}>
                    Enter your email and room number to join the call.
                </p>
                <form onSubmit={handlesubitform} style={{width: "100%"}}>
                    <div style={{marginBottom: 16}}>
                        <label htmlFor='email' style={{
                            display: "block",
                            marginBottom: 6,
                            color: "#1e3c72",
                            fontWeight: 500
                        }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #b0c4de",
                                fontSize: "1rem",
                                outline: "none"
                            }}
                            required
                        />
                    </div>
                    <div style={{marginBottom: 24}}>
                        <label htmlFor='room' style={{
                            display: "block",
                            marginBottom: 6,
                            color: "#1e3c72",
                            fontWeight: 500
                        }}>Room Number</label>
                        <input
                            type="text"
                            id="room"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                            placeholder="Enter room number"
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #b0c4de",
                                fontSize: "1rem",
                                outline: "none"
                            }}
                            required
                        />
                    </div>
                    <button type="submit" style={{
                        width: "100%",
                        padding: "12px 0",
                        background: "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(33,147,176,0.15)",
                        transition: "background 0.2s"
                    }}>
                        Join Room
                    </button>
                </form>
            </div>
        </div>
    )

}

export default LobbyScreen