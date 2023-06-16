import React, { useEffect, useState } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import lazyLoad from './lazyLoad'
import AuthComponent from './authComponent'
import Index from '../views/newsSandBox/Index'
import childrenService from '../apis/children'
import menuService from '../apis/menu'

const LocalRouterMap: any = {
  '/home': {
    path: 'home',
    localPath: '/newsSandBox/home/Home',
  },
  '/user-manage/list': {
    path: 'user-manage/list',
    localPath: '/newsSandBox/userManage/list/List',
  },
  '/right-manage/role/list': {
    path: 'right-manage/role/list',
    localPath: '/newsSandBox/rightManage/role/Role',
  },
  '/right-manage/right/list': {
    path: 'right-manage/right/list',
    localPath: '/newsSandBox/rightManage/right/Right',
  },
  '/news-manage/add': {
    path: 'news-manage/add',
    localPath: '/newsSandBox/newsManage/add/Add',
  },
  '/news-manage/draft': {
    path: 'news-manage/draft',
    localPath: '/newsSandBox/newsManage/draft/Draft',
  },
  '/news-manage/category': {
    path: 'news-manage/category',
    localPath: '/newsSandBox/newsManage/category/Category',
  },
  '/audit-manage/audit': {
    path: 'audit-manage/audit',
    localPath: '/newsSandBox/newsManage/audit/Audit',
  },
  '/audit-manage/list': {
    path: 'audit-manage/list',
    localPath: '/newsSandBox/newsManage/list/AuditList',
  },
  '/publish-manage/unpublished': {
    path: 'publish-manage/unpublished',
    localPath: '/newsSandBox/publishManage/unpublished/Unpublished',
  },
  '/publish-manage/published': {
    path: 'publish-manage/published',
    localPath: '/newsSandBox/publishManage/published/Published',
  },
  '/publish-manage/sunset': {
    path: 'publish-manage/sunset',
    localPath: '/newsSandBox/publishManage/sunset/Sunset',
  },
}

type anyProps = {
  [propName: string]: any
}

export default function Router() {
  const [baseRoutes, setBaseRoutes] = useState([] as any)

  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)
  const checkRoute = (item: any) => {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    )
  }
  // 登录的用户有该权限
  const checkUserPermission = (item: any) => {
    return userInfo.role.rights.includes(item.key)
  }

  useEffect(() => {
    Promise.all([menuService.getRights(), childrenService.getChildren()]).then(
      (res) => {
        const BackRoteList = [...res[0].data, ...res[1].data]
        const authRoutes = BackRoteList.map((s: any) => {
          if (checkRoute(s) && checkUserPermission(s)) {
            return {
              path: LocalRouterMap[s.key]?.path,
              element: (
                <AuthComponent>
                  {lazyLoad(`${LocalRouterMap[s.key]?.localPath}`)}
                </AuthComponent>
              ),
            }
          }
          return {
            path: '*',
            element: lazyLoad('/newsSandBox/403/NoFound'),
          }
        })

        setBaseRoutes([
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
                // 403
                path: '*',
                element: lazyLoad('/newsSandBox/403/NoFound'),
              },
              ...authRoutes,
            ],
          },
        ])
      }
    )
  }, [])

  const element = useRoutes(baseRoutes)
  // const element = useRoutes([
  //   {
  //     path: '/login',
  //     element: lazyLoad('/login/Login'),
  //   },
  //   {
  //     path: '/',
  //     element: (
  //       <AuthComponent>
  //         <Index></Index>
  //       </AuthComponent>
  //     ),
  //     children: [
  //       {
  //         path: '',
  //         element: <Navigate to={'/home'}></Navigate>,
  //       },
  //       {
  //         // 主页
  //         path: 'home',
  //         element: (
  //           <AuthComponent>{lazyLoad('/newsSandBox/home/Home')}</AuthComponent>
  //         ),
  //       },
  //       {
  //         // 用户列表
  //         path: 'user-manage/list',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/userManage/list/List')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // 角色列表
  //         path: 'right-manage/role/list',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/rightManage/role/Role')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // 权限列表
  //         path: 'right-manage/right/list',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/rightManage/right/Right')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // 草稿箱列表
  //         path: 'news-manage/draft',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/newsManage/draft/Draft')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // 分类列表
  //         path: 'news-manage/category',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/newsManage/category/Category')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // add
  //         path: 'news-manage/add',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/newsManage/add/Add')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // audit
  //         path: 'news-manage/audit',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/newsManage/audit/Audit')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // list
  //         path: 'news-manage/list',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/newsManage/list/AuditList')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // published
  //         path: 'publish-manage/published',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/publishManage/published/Published')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // unpublished
  //         path: 'publish-manage/unpublished',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/publishManage/unpublished/Unpublished')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // sunset
  //         path: 'publish-manage/sunset',
  //         element: (
  //           <AuthComponent>
  //             {lazyLoad('/newsSandBox/publishManage/sunset/Sunset')}
  //           </AuthComponent>
  //         ),
  //       },
  //       {
  //         // 403
  //         path: '*',
  //         element: lazyLoad('/newsSandBox/403/NoFound'),
  //       },
  //     ],
  //   },
  // ])
  return element
}
