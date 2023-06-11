import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import 'antd/dist/reset.css'
import style from './App.scss'

function App() {
  return (
    <BrowserRouter>
      <Router></Router>
    </BrowserRouter>
  )
}

export default App
