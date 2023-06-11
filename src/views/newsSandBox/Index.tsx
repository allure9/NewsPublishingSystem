import React from 'react'
import { Outlet } from 'react-router-dom'
import LayoutWrap from '../../layoutWrap/LayoutWrap'

type IProps = {
  children?: any
}

export default function Index(props: IProps) {
  return (
    <LayoutWrap>
      <Outlet />
    </LayoutWrap>
  )
}
