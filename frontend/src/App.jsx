import { useState } from 'react'
import Login from './components/Login'
import MagicalHat from './components/MagicalHat'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [pickComplete, setPickComplete] = useState(false)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handlePickComplete = (recipient) => {
    setPickComplete(true)
    setTimeout(() => {
      // Reset after showing the result
      setUser(null)
      setPickComplete(false)
    }, 5000)
  }

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MagicalHat user={user} onPickComplete={handlePickComplete} />
      )}
    </div>
  )
}

export default App
