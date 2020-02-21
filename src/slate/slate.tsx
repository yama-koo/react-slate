import React, { useMemo, useState, useCallback } from 'react'
import { createEditor, Node, Editor, Transforms, Text } from 'slate'
import { withReact, Editable, Slate, RenderElementProps, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'
import { withShortcuts } from './Plugins/withShortcuts'
import { BlockQuoteWrapperElement, BlockQuoteItemElement } from './Elements/BlockQuote'
import { ListItemElement, UlElement, OlElement } from './Elements/List'
import { CodeBlockElement } from './Elements/Code'
import { Leaf } from './leaf'
import { CheckBoxElement } from './Elements/Checkbox'
import { DefaultElement } from './Elements/Default'
import { ToolBar } from './ToolBar/ToolBar'

export const MySlate = () => {
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Aline of text in a paragraph' }],
    },
    // {
    //   type: 'ul',
    //   children: [
    //     { type: 'ul-item', children: [{ text: 'Aline of text in a paragraph' }] },
    //     { type: 'ul-item', children: [{ text: 'aaaa' }] },
    //     { type: 'ul-item', children: [{ text: 'bbbb' }] },
    //     { type: 'ul-item', children: [{ text: 'cccc' }] },
    //   ],
    // },
  ])

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code-block':
        return <CodeBlockElement {...props} />
      case 'ul':
        return <UlElement {...props} />
      case 'ol':
        return <OlElement {...props} />
      case 'ul-item':
      case 'ol-item':
        return <ListItemElement {...props} />
      case 'h1':
        return <h1 {...props.attributes}>{props.children}</h1>
      case 'h2':
        return <h2 {...props.attributes}>{props.children}</h2>
      case 'h3':
        return <h3 {...props.attributes}>{props.children}</h3>
      case 'h4':
        return <h4 {...props.attributes}>{props.children}</h4>
      case 'h5':
        return <h5 {...props.attributes}>{props.children}</h5>
      case 'h6':
        return <h6 {...props.attributes}>{props.children}</h6>
      case 'block-quote-wrapper':
        return <BlockQuoteWrapperElement {...props} />
      case 'block-quote-item':
        return <BlockQuoteItemElement {...props} />
      case 'checkbox':
        return <CheckBoxElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  const handleOnMouseDown = (type: string) => {
    switch (type) {
      case 'Bold':
        toggleBoldMark(editor)
        break
      case 'Code':
        toggleCodeMark(editor)
        break
      case 'Ul':
        toggleUlMark(editor)
        break
      default:
        break
    }
  }

  // console.log(editor.children)
  return (
    <div style={{ width: '60%' }}>
      <div>{JSON.stringify(value)}</div>
      <div
        style={{
          border: '#dedfe0 solid 1px',
          minHeight: '200px',
          width: '100%',
          display: 'inline-block',
        }}
      >
        <ToolBar onMouseDown={handleOnMouseDown} />
        <Slate editor={editor} value={value} onChange={v => setValue(v)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {
              // if (!event.ctrlKey) {
              //   return
              // }
              // console.log(event.key)
              switch (event.key) {
                // case '`':
                //   event.preventDefault()
                //   CustomEditor.toggleCodeBlock(editor)
                //   break
                // case 'b':
                //   event.preventDefault()
                //   CustomEditor.toggleBoldMark(editor)
                //   break
                // case 'u':
                //   event.preventDefault()
                //   CustomEditor.toggleList(editor)
                //   break
                // case 'Enter':
                //   console.log(event.key)
                //   event.preventDefault()
                //   Transforms.insertText(editor, '')
                //   // editor.insertNode({ text: '', type: 'paragraph' })
                //   break
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

const isBoldMarkActive = (editor: Editor) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: n => n.bold === true,
    universal: true,
  })
  return !!match
}

const toggleBoldMark = (editor: Editor) => {
  const isActive = isBoldMarkActive(editor)
  Transforms.setNodes(
    editor,
    { bold: isActive ? null : true },
    { match: n => Text.isText(n), split: true },
  )
}

const isCodeInlineActive = (editor: Editor) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: n => n.code === true,
    universal: true,
  })

  return !!match
}

const toggleCodeMark = (editor: Editor) => {
  const isActive = isCodeInlineActive(editor)
  Transforms.setNodes(
    editor,
    { code: isActive ? null : true },
    { match: n => Text.isText(n), split: true },
  )
}

const isUlActive = (editor: Editor) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: n => n.type === 'ul-item',
    universal: true,
  })

  return !!match
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleUlMark = (editor: Editor) => {
  const isActive = isUlActive(editor)

  // console.log(editor)
  Transforms.unwrapNodes(editor, {
    match: n => {
      // console.log(n, n.type === 'ul')
      return n.type === 'ul'
    },
    split: true,
  })

  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : 'ul-item' },
    { match: n => Editor.isBlock(editor, n) },
  )
  // console.log(editor)
  if (!isActive) {
    Transforms.wrapNodes(
      editor,
      { type: 'ul', children: [] },
      {
        match: n => {
          // console.log(n)
          console.log(n.type === 'ul-item')
          return n.type === 'ul-item'
        },
        split: true,
      },
    )
  }
}
