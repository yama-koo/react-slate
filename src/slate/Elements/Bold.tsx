import React from 'react'
import { RenderLeafProps } from 'slate-react'

export const BoldElement = ({ attributes, children }: RenderLeafProps) => {
  return (
    <span {...attributes} style={{ fontWeight: 'bold' }}>
      {children}
    </span>
  )
}
