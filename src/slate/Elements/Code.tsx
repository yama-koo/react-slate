import React from 'react'
import { RenderElementProps, RenderLeafProps } from 'slate-react'

export const CodeBlockElement = ({ children }: RenderElementProps) => {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  )
}

export const CodeInlineElement = ({ attributes, children }: RenderLeafProps) => {
  return (
    <span {...attributes}>
      {/* <pre> */}
      <code style={{ backgroundColor: '#e0e0e0' }}>{children}</code>
      {/* </pre> */}
    </span>
  )
}
