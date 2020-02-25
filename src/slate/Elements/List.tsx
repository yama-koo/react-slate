import React from 'react'
import { RenderElementProps } from 'slate-react'
import { Editor, Transforms } from 'slate'

const isListActive = (editor: Editor) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: n => n.type === 'list',
  })

  return !!match
}

export const toggleList = (editor: Editor) => {
  const isActive = isListActive(editor)
  Transforms.setNodes(
    editor,
    { type: isActive ? null : 'list' },
    {
      match: n => {
        return Editor.isBlock(editor, n)
      },
    },
  )

  Transforms.wrapNodes(editor, { type: 'ul', children: [] }, { match: n => n.type === 'list' })
}

export const ListItemElement = ({ attributes, children }: RenderElementProps) => {
  return (
    <li {...attributes}>
      <p>{children}</p>
    </li>
  )
}

export const UlElement = ({ attributes, children }: RenderElementProps) => {
  return <ul {...attributes}>{children}</ul>
}

export const OlElement = ({ attributes, children }: RenderElementProps) => {
  return <ol {...attributes}>{children}</ol>
}
