import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'


function Content() {
  const { theme } = useContext(ThemeContext)

  return (
    <main style={{
      padding: '40px',
      minHeight: '300px',
      backgroundColor: theme === 'light' ? '#fff' : '#222',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h2>React Context API</h2>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>
        This exmaple shows how Context API works:
      </p>
      <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
        <li><strong>createContext()</strong> - Creates a context object</li>
        <li><strong>Provider</strong> - Wraps components and provides the context value</li>
        <li><strong>useContext()</strong> - Hook to consume the context in any child component</li>
      </ul>
      {/* <p>
        Notice how both Header and Content components can access the theme
        without passing props through the component tree!
      </p> */}
    </main>
  )
}

export default Content
