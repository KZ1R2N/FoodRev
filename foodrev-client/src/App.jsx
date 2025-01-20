import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router'
import Header from './shared/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <Header></Header>
    <Outlet></Outlet>
    </div>

  )
}

export default App
