import { ReactEditor } from 'slate-react'
import { Editor, Point, Transforms, Range } from 'slate'

const SHORTCUTS: { [key: string]: string } = {
  '*': 'ul-item',
  '-': 'ul-item',
  '+': 'ul-item',
  '1.': 'ol-item',
  '>': 'block-quote-item',
  '[]': 'checkbox',
  '```': 'code-block',
  '`': 'code-inline',
  '#': 'h1',
  '##': 'h2',
  '###': 'h3',
  '####': 'h4',
  '#####': 'h5',
  '######': 'h6',
}

export const withShortcuts = (editor: ReactEditor) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = text => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)
        Transforms.delete(editor)
        Transforms.setNodes(editor, { type }, { match: n => Editor.isBlock(editor, n) })

        if (type === 'ul-item') {
          const list = { type: 'ul', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === 'ul-item',
          })
        }
        if (type === 'ol-item') {
          const list = { type: 'ol', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === 'ol-item',
          })
        }
        if (type === 'block-quote-item') {
          const list = { type: 'block-quote-wrapper', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === 'block-quote-item',
          })
        }
        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, { type: 'paragraph' })

          // if (block.type === 'ul-item') {
          //   Transforms.unwrapNodes(editor, {
          //     match: n => n.type === 'ul',
          //   })
          // }
          if (block.type === 'ol-item') {
            Transforms.unwrapNodes(editor, {
              match: n => n.type === 'ol',
            })
          }
          if (block.type === 'block-quote-item') {
            Transforms.unwrapNodes(editor, {
              match: n => n.type === 'block-quote-wrapper',
            })
          }
          return
        }
      }
      deleteBackward(...args)
    }
  }

  return editor
}
