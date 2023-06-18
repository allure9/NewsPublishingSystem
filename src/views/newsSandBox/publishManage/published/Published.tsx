import React from 'react'
import NewsPublished from '../../../../components/newsPublished/NewsPublished'
import usePublish from '../../../../utils/usePublish'
import { Button } from 'antd'

export default function Published() {
  const { list, handleSunset } = usePublish(2)
  return (
    <div>
      <NewsPublished
        list={list}
        button={(id: number | string) => (
          <Button
            danger
            onClick={() => {
              handleSunset(id)
            }}
          >
            下线
          </Button>
        )}
      ></NewsPublished>
    </div>
  )
}
