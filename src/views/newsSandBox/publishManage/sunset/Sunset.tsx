import React from 'react'
import NewsPublished from '../../../../components/newsPublished/NewsPublished'
import usePublish from '../../../../utils/usePublish'
import { Button } from 'antd'

export default function Sunset() {
  const { list, handleDelete } = usePublish(3)
  return (
    <div>
      <NewsPublished
        list={list}
        button={(id: number | string) => (
          <Button
            danger
            onClick={() => {
              handleDelete(id)
            }}
          >
            删除
          </Button>
        )}
      ></NewsPublished>
    </div>
  )
}
