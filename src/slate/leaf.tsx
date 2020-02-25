import React from 'react'
import { RenderLeafProps } from 'slate-react'
import { CodeInlineElement } from './Elements/Code'
// import { BoldElement } from './Elements/Bold'

export const Leaf = (props: RenderLeafProps) => {
  const { leaf } = props
  if (leaf.code) {
    return <CodeInlineElement {...props} />
  }
  // if (leaf.strike) {
  //   return <Strike {...props} />
  // }
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
        fontStyle: leaf.italic ? 'italic' : 'normal',
        // borderBottom: leaf.underline ? 'solid 1px black' : '',
        // textDecoration: leaf.underline ? 'underline' : 'none',
        textDecoration: `${leaf.underline ? 'underline' : ''} ${leaf.strike ? 'line-through' : ''}`,
        backgroundColor: leaf.highlight ? '#ffff00' : '',
      }}
    >
      {children}
    </span>
  )
}

// const Strike = ({ attributes, children, leaf }: RenderLeafProps) => {
//   return (
//     <span {...attributes} style={{ textDecoration: leaf.strike ? 'line-through' : 'none' }}>
//       {children}
//     </span>
//   )
// }
