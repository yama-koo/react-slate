import React from 'react'
import { RenderLeafProps } from 'slate-react'
import { CodeInlineElement } from './Elements/Code'
// import { BoldElement } from './Elements/Bold'

export const Leaf = (props: RenderLeafProps) => {
  const { leaf } = props
  if (leaf.code) {
    return <CodeInlineElement {...props} />
  }
  // if (leaf.bold) {
  //   return <BoldElement {...props} />
  // }
  // return <span {...attributes}>{children}</span>
  return <LeafElement {...props} />
}

const LeafElement = ({ attributes, leaf, children }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      style={{
        fontWeight: leaf.bold ? 'bold' : 'normal',
        borderBottom: leaf.underline ? 'solid 1px black' : '',
        backgroundColor: leaf.highlight ? '#ffff00' : '#ffffff',
      }}
    >
      {children}
    </span>
  )
}
