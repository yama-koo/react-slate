import React from 'react'
import { RenderElementProps } from 'slate-react'

export const CheckBoxElement = ({ attributes, children }: RenderElementProps) => {
  return (
    <p style={{ display: 'flex' }}>
      <input type="checkbox" {...attributes} />
      <span>{children}</span>
    </p>
  )
}
