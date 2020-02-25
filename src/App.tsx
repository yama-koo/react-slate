import React, { SFC } from 'react'
import { MySlate } from './slate/slate'

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
    </div>
  )
}
