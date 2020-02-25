import React, { useMemo, useState, useCallback, SFC, useRef, useEffect } from 'react'
import { createEditor, Node, Editor, Transforms, Range } from 'slate'
import {
  withReact,
  Editable,
  Slate,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
  ReactEditor,
} from 'slate-react'
import { withHistory } from 'slate-history'
import ReactDOM from 'react-dom'
import { withShortcuts } from './Plugins/withShortcuts'
import { BlockQuoteWrapperElement, BlockQuoteItemElement } from './Elements/BlockQuote'
import { ListItemElement, UlElement, OlElement } from './Elements/List'
import { CodeBlockElement } from './Elements/Code'
import { Leaf } from './leaf'
import { CheckBoxElement } from './Elements/Checkbox'
import { DefaultElement } from './Elements/Default'
// import { ToolBar, Button } from './ToolBar/ToolBar'

const LIST = ['ul', 'ol']

const isList = (type: string) => {
  return LIST.includes(type)
}

const Portal: SFC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}

const ToolBar: SFC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    if (!domSelection) {
      return
    }
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    if (!rect) {
      return
    }
    console.log('slate', rect)
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  })
  return (
    <Portal>
      <div
        style={{
          padding: '8px 7px 6px',
          position: 'absolute',
          zIndex: 1,
          top: '-10000px',
          left: '-10000px',
          marginTop: '-6px',
          opacity: 0,
          backgroundColor: '#222',
          borderRadius: '4px',
          transition: 'opacity 0.75s',
          whiteSpace: 'pre-wrap',
          margin: '0 -20px 10px',
          // padding: '10px 20px',
          fontSize: '14px',
          background: '#f8f8e8',
        }}
        ref={ref}
      >
        {/* <div
          style={{
            whiteSpace: 'pre-wrap',
            margin: '0 -20px 10px',
            padding: '10px 20px',
            fontSize: '14px',
            background: '#f8f8e8',
          }}
        > */}
        {children}
        {/* </div> */}
      </div>
    </Portal>
  )
}

const MarkButton = ({ editor, text, format }: { editor: Editor; text: string; format: string }) => {
  return (
    <button
      onMouseDown={e => {
        e.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {text}
    </button>
  )
}

const BlockButton = ({ editor, text, type }: { editor: Editor; text: string; type: string }) => {
  return (
    <button
      onMouseDown={e => {
        e.preventDefault()
        toggleBlock(editor, type)
      }}
    >
      {text}
    </button>
  )
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
        <Slate
          editor={editor}
          value={value}
          onChange={v => {
            setValue(v)
          }}
        >
          <ToolBar>
            <BlockButton editor={editor} text="H1" type="h1" />
            <BlockButton editor={editor} text="H3" type="h3" />
            <MarkButton editor={editor} text="B" format="bold" />
            <MarkButton editor={editor} text="C" format="code" />
            <BlockButton editor={editor} text="UL" type="ul" />
            <BlockButton editor={editor} text="OL" type="ol" />
            <MarkButton editor={editor} text="U" format="underline" />
            <MarkButton editor={editor} text="Hi" format="highlight" />
            <BlockButton editor={editor} text="[]" type="checkbox" />
            <BlockButton editor={editor} text="''" type="block-quote-wrapper" />
            <MarkButton editor={editor} text="S" format="strike" />
            <MarkButton editor={editor} text="I" format="italic" />
          </ToolBar>
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
