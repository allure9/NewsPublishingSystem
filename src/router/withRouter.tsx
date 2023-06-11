import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

type IProps = {
  children?: any
}

export default function WithRouter(Component: any) {
  const push = useNavigate()
  const match = useParams()
  const location = useLocation()
  return function (props: IProps) {
    return (
      <Component {...props} history={{ push, match, location }}></Component>
    )
  }
}
