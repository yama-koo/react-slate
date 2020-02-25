import React, { useMemo, useState, useCallback } from 'react'
import { createEditor, Node, Editor, Transforms } from 'slate'
import { withReact, Editable, Slate, RenderElementProps, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'
import { withShortcuts } from './Plugins/withShortcuts'
import { BlockQuoteWrapperElement, BlockQuoteItemElement } from './Elements/BlockQuote'
import { ListItemElement, UlElement, OlElement } from './Elements/List'
import { CodeBlockElement } from './Elements/Code'
import { Leaf } from './leaf'
import { CheckBoxElement } from './Elements/Checkbox'
import { DefaultElement } from './Elements/Default'
import { ToolBar, Button } from './ToolBar/ToolBar'

const LIST = ['ul', 'ol']

const isList = (type: string) => {
  return LIST.includes(type)
}

export const MySlate = () => {
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  // const editor = useMemo(() => withReact(withHistory(createEditor())), [])

  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph' }],
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
      case 'list':
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

  return (
    <div style={{ width: '60%' }}>
      <div style={{ width: '100%' }}>{JSON.stringify(value)}</div>
      <div
        style={{
          border: '#dedfe0 solid 1px',
          minHeight: '200px',
          width: '100%',
          display: 'inline-block',
        }}
      >
        {/* <ToolBar onMouseDown={handleOnMouseDown}> */}
        <ToolBar>
          <Button
            text="H1"
            toggleEvent={() => {
              toggleBlock(editor, 'h1')
            }}
          />
          <Button
            text="H3"
            toggleEvent={() => {
              toggleBlock(editor, 'h3')
            }}
          />
          <Button
            text="B"
            toggleEvent={() => {
              toggleMark(editor, 'bold')
            }}
          />
          <Button
            text="C"
            toggleEvent={() => {
              toggleMark(editor, 'code')
            }}
          />
          <Button
            text="UL"
            toggleEvent={() => {
              toggleBlock(editor, 'ul')
            }}
          />
          <Button
            text="OL"
            toggleEvent={() => {
              toggleBlock(editor, 'ol')
            }}
          />
          <Button
            text="U"
            toggleEvent={() => {
              toggleMark(editor, 'underline')
            }}
          />
          <Button
            text="Hi"
            toggleEvent={() => {
              toggleMark(editor, 'highlight')
            }}
          />
          <Button
            text="[]"
            toggleEvent={() => {
              toggleBlock(editor, 'checkbox')
            }}
          />
          <Button
            text="''"
            toggleEvent={() => {
              toggleBlock(editor, 'block-quote-wrapper')
            }}
          />
          <Button
            text="S"
            toggleEvent={() => {
              toggleMark(editor, 'strike')
            }}
          />
          <Button
            text="I"
            toggleEvent={() => {
              toggleMark(editor, 'italic')
            }}
          />
        </ToolBar>
        <Slate
          editor={editor}
          value={value}
          onChange={v => {
            setValue(v)
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {
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

const isMarkActive = (editor: Editor, format: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // const [match] = Editor.nodes(editor, {
  //   match: n => n[format] === true,
  //   universal: true,
  // })
  // return !!match

  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: Editor, type: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: n => n.type === type,
    universal: true,
  })
  return !!match
}

const toggleBlock = (editor: Editor, type: string) => {
  const isActive = isBlockActive(editor, type)
  const list = isList(type)

  if (list || type === 'block-quote-wrapper') {
    Transforms.unwrapNodes(editor, {
      match: n => n.type === type,
      split: true,
    })
  }

  const newType = () => {
    if (isActive) {
      return 'paragraph'
    }
    if (type === 'block-quote-wrapper') {
      return 'block-quote-item'
    }
    return list ? 'list' : type
  }

  Transforms.setNodes(editor, { type: newType() })

  if (list || type === 'block-quote-wrapper') {
    Transforms.wrapNodes(
      editor,
      { type, children: [] },
      { match: n => n.type === 'list' || n.type === 'block-quote-item' },
    )
  }
}
