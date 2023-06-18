import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import { Provider } from 'react-redux'
import 'antd/dist/reset.css'
import style from './App.scss'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Router></Router>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
