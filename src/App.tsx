import React, { SFC } from 'react'
import { MySlate } from './slate/slate'
import HoveringMenuExample from './examples/hovering-toolbar'

export const App: SFC = () => {
  return (
    <div
      className="App"
      style={{
        width: '100%',
        height: '100%',
        padding: '100px',
        boxSizing: 'border-box',
      }}
    >
      <MySlate />
      <HoveringMenuExample />
    </div>
  )
}
