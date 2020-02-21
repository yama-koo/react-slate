import React from 'react'
import { RenderLeafProps } from 'slate-react'
import { Editor, Transforms, Text } from 'slate'

export const BoldElement = ({ attributes, children }: RenderLeafProps) => {
  return (
    <span {...attributes} style={{ fontWeight: 'bold' }}>
      {children}
    </span>
  )
}
