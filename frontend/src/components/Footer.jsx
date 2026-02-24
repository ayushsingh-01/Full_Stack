import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'


function Footer() {
  const { theme } = useContext(ThemeContext)

  return (
    <footer style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#e0e0e0' : '#444',
      color: theme === 'light' ? '#333' : '#f0f0f0',
      textAlign: 'center'
    }}>
    </footer>
  )
}

export default Footer
