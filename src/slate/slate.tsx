import React, { useMemo, useState, useCallback } from 'react'
import { createEditor, Node, Transforms, Editor, Text, Range, Point } from 'slate'
import {
  withReact,
  Editable,
  Slate,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from 'slate-react'
import { withHistory } from 'slate-history'

const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })
    return !!match
  },

  isCodeBlockActive(editor: Editor) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  isListActive(editor: Editor) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'list',
    })

    return !!match
  },

  toggleBoldMark(editor: Editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true },
    )
  },

  toggleCodeBlock(editor: Editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) },
    )
  },

  toggleList(editor: Editor) {
    const isActive = CustomEditor.isListActive(editor)
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
  },
}

export const MySlate = () => {
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Aline of text in a paragraph' }],
    },
  ])

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'list':
        return <ListElement {...props} />
      case 'ul':
        return <UlElement {...props} />
      case 'heading-one':
        return <h1 {...props.attributes}>{props.children}</h1>
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  return (
    <div style={{ width: '80%' }}>
      <div>{JSON.stringify(value)}</div>
      <div
        style={{
          border: '#dedfe0 solid 1px',
          minHeight: '200px',
          width: '100%',
          display: 'inline-block',
        }}
      >
        <Slate editor={editor} value={value} onChange={v => setValue(v)}>
          <div>
            <button
              onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
              }}
            >
              B
            </button>
            <button
              onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
              }}
            >
              C
            </button>
          </div>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {
              if (!event.ctrlKey) {
                return
              }
              switch (event.key) {
                case '`':
                  event.preventDefault()
                  CustomEditor.toggleCodeBlock(editor)
                  break
                case 'b':
                  event.preventDefault()
                  CustomEditor.toggleBoldMark(editor)
                  break
                case 'u':
                  event.preventDefault()
                  CustomEditor.toggleList(editor)
                  break
                default:
                  break
              }
            }}
          />
        </Slate>
      </div>
    </div>
  )
}

const CodeElement = (props: RenderElementProps) => {
  const { children } = props
  return (
    <pre>
      <code>{children}</code>
    </pre>
  )
}

const DefaultElement = (props: {
  attributes: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLParagraphElement> &
    React.HTMLAttributes<HTMLParagraphElement>
  children: React.ReactNode
}) => {
  const { attributes, children } = props
  return <p {...attributes}>{children}</p>
}

const Leaf = (props: RenderLeafProps) => {
  const { attributes, leaf, children } = props
  return (
    <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
      {children}
    </span>
  )
}

const ListElement = (props: RenderElementProps) => {
  const { attributes, children } = props
  return <li {...attributes}>{children}</li>
}

const UlElement = (props: RenderElementProps) => {
  const { attributes, children } = props
  return <ol {...attributes}>{children}</ol>
}

const SHORTCUTS: { [key: string]: string } = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
}

const withShortcuts = (editor: ReactEditor) => {
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

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === 'list-item',
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

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n => n.type === 'bulleted-list',
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
