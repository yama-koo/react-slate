import React from 'react'
import { RenderLeafProps } from 'slate-react'
import { CodeInlineElement } from './Elements/Code'
import { BoldElement } from './Elements/Bold'

export const Leaf = (props: RenderLeafProps) => {
  const { attributes, leaf, children } = props
  if (leaf.code) {
    return <CodeInlineElement {...props} />
  }
  if (leaf.bold) {
    return <BoldElement {...props} />
  }
  return <span {...attributes}>{children}</span>
}
