import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'



function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
      color: theme === 'light' ? '#333' : '#f0f0f0',
      textAlign: 'center'
    }}>
      <h1>Context API Demo</h1>
      <button onClick={toggleTheme} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: theme === 'light' ? '#333' : '#f0f0f0',
        color: theme === 'light' ? '#f0f0f0' : '#333',
        border: 'none',
        borderRadius: '5px'
      }}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  )
}

export default Header
