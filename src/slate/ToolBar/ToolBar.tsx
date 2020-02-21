import React from 'react'

export const ToolBar = ({ onMouseDown }: { onMouseDown: (type: string) => void }) => {
  return (
    <div>
      <button
        onMouseDown={event => {
          event.preventDefault()
          onMouseDown('Bold')
        }}
      >
        B
      </button>
      <button
        onMouseDown={event => {
          event.preventDefault()
          onMouseDown('Code')
        }}
      >
        C
      </button>
      <button
        onMouseDown={event => {
          event.preventDefault()
          onMouseDown('Ul')
        }}
      >
        UL
      </button>
      <button
        onMouseDown={event => {
          event.preventDefault()
          onMouseDown('Ol')
        }}
      >
        OL
      </button>
    </div>
  )
}
