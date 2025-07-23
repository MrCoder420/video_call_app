import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route,Routes } from 'react-router-dom'
import './App.css'
import LobbyScreen from './screens/LobbyScreen'
import RoomPage from './screens/RoomPage'

function App() {
 
  return (
    <>
    <Routes>

      <Route path="/" element={LobbyScreen()} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      {/* Add more routes as needed */}
    </Routes>
      
    </>
  )
}

export default App
