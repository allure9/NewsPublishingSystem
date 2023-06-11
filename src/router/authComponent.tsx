import React from 'react'
import { Navigate } from 'react-router-dom'

interface IProps {
  children?: any
}

const AuthComponent: React.FC<IProps> = (props) => {
  const isAuth = true
  return isAuth ? props.children : <Navigate to={'/login'}></Navigate>
}
export default AuthComponent
