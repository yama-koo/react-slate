import React from 'react'
import { RenderElementProps } from 'slate-react'

export const DefaultElement = ({ attributes, children }: RenderElementProps) => {
  return <p {...attributes}>{children}</p>
}
