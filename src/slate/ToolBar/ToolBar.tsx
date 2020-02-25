import React, { SFC } from 'react'

// export const ToolBar = ({ onMouseDown }: { onMouseDown: (type: string) => void }) => {
//   return (
//     <div>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('h1')
//         }}
//       >
//         H1
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('h3')
//         }}
//       >
//         H3
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('bold')
//         }}
//       >
//         B
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('code')
//         }}
//       >
//         C
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('ul')
//         }}
//       >
//         UL
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('ol')
//         }}
//       >
//         OL
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('underline')
//         }}
//       >
//         <span style={{ borderBottom: 'solid 1px black' }}>U</span>
//         {/* <span>U</span> */}
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('highlight')
//         }}
//       >
//         Hi
//       </button>
//       <button
//         onMouseDown={event => {
//           event.preventDefault()
//           onMouseDown('checkbox')
//         }}
//       >
//         []
//       </button>
//     </div>
//   )
// }

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
