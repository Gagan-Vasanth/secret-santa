import { useState } from 'react'
import Login from './components/Login' // eslint-disable-line no-unused-vars
import MagicalHat from './components/MagicalHat' // eslint-disable-line no-unused-vars
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handlePickComplete = () => {
    setTimeout(() => {
      // Reset after showing the result
      setUser(null)
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
