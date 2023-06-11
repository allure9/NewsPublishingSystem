import { useRoutes, Navigate } from 'react-router-dom'
import lazyLoad from './lazyLoad'
import AuthComponent from './authComponent'
import Index from '../views/newsSandBox/Index'

export default function Router() {
  const element = useRoutes([
    {
      path: '/login',
      element: lazyLoad('/login/Login'),
    },
    {
      path: '/',
      element: (
        <AuthComponent>
          <Index></Index>
        </AuthComponent>
      ),
      children: [
        {
          path: '',
          element: <Navigate to={'/home'}></Navigate>,
        },
        {
          // 主页
          path: 'home',
          element: (
            <AuthComponent>{lazyLoad('/newsSandBox/home/Home')}</AuthComponent>
          ),
        },
        {
          // 用户列表
          path: 'user-manage/list',
          element: (
            <AuthComponent>
              {lazyLoad('/newsSandBox/userManage/list/List')}
            </AuthComponent>
          ),
        },
        {
          // 角色列表
          path: 'right-manage/role/list',
          element: (
            <AuthComponent>
              {lazyLoad('/newsSandBox/rightManage/role/Role')}
            </AuthComponent>
          ),
        },
        {
          // 权限列表
          path: 'right-manage/right/list',
          element: (
            <AuthComponent>
              {lazyLoad('/newsSandBox/rightManage/right/Right')}
            </AuthComponent>
          ),
        },
        {
          // 草稿箱列表
          path: 'news-manage/draft',
          element: (
            <AuthComponent>
              {lazyLoad('/newsSandBox/newsManage/draft/Draft')}
            </AuthComponent>
          ),
        },
        {
          // 分类列表
          path: 'news-manage/category',
          element: (
            <AuthComponent>
              {lazyLoad('/newsSandBox/newsManage/category/Category')}
            </AuthComponent>
          ),
        },
        {
          // 403
          path: '*',
          element: lazyLoad('/newsSandBox/403/NoFound'),
        },
      ],
    },
  ])
  return element
}
