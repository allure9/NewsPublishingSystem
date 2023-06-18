import React from 'react'
import NewsPublished from '../../../../components/newsPublished/NewsPublished'
import usePublish from '../../../../utils/usePublish'
import { Button } from 'antd'

export default function Unpublished() {
  const { list, handlePublish } = usePublish(1)
  return (
    <div>
      <NewsPublished
        list={list}
        button={(id: number | string) => (
          <Button
            type="primary"
            onClick={() => {
              handlePublish(id)
            }}
          >
            发布
          </Button>
        )}
      ></NewsPublished>
    </div>
  )
}
