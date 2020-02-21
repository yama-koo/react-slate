import React from 'react'
import { RenderElementProps } from 'slate-react'

export const BlockQuoteWrapperElement = ({ attributes, children }: RenderElementProps) => {
  return (
    <p {...attributes} style={{ backgroundColor: '#f0f0f0', display: 'flex' }}>
      <span style={{ backgroundColor: '#dedfe0', width: '4px' }} />
      <span style={{ padding: '4px' }}>{children}</span>
    </p>
  )
}

export const BlockQuoteItemElement = ({ attributes, children }: RenderElementProps) => {
  return <p {...attributes}>{children}</p>
}
