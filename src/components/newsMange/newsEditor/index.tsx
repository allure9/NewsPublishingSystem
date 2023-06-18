import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

type IProps = {
  children?: any
  getContent?: any
  content?: string
}

export default function Index(props: IProps) {
  const [editor, setEditor] = useState(null)
  const [html, setHtml] = useState('')
  // 工具栏配置
  const toolbarConfig = {}

  // 初始化默认配置
  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  }

  useEffect(() => {
    setHtml(props.content as string)
  }, [props.content])
  return (
    <div>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor as any}
        onChange={(editor) => {
          setHtml(editor.getHtml())
          props.getContent(editor.getHtml())
        }}
        mode="default"
        style={{ height: '500px', overflowY: 'hidden' }}
      />
    </div>
  )
}
