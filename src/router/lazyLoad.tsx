import { lazy, Suspense } from 'react'

export default function lazyLoad(path: string) {
  const Compt = lazy(() => import(`../views${path}`))
  return (
    <Suspense fallback={<>加载中...</>}>
      <Compt></Compt>
    </Suspense>
  )
}
