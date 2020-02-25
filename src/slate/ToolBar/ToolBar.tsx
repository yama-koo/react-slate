import React, { SFC } from 'react'

export const ToolBar: SFC = ({ children }) => {
  return <div>{children}</div>
}

export const Button = ({ text, toggleEvent }: { text: string; toggleEvent: () => void }) => {
  return (
    <button
      onMouseDown={e => {
        e.preventDefault()
        toggleEvent && toggleEvent()
      }}
    >
      {text}
    </button>
  )
}
