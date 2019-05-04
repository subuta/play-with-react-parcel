import React from 'react'

import { Link } from 'react-router-dom'

export default ({ children }) => {
  return (
    <div>
      <header>
        <Link to='/hoge'>/hoge</Link>
        <Link to='/fuga'>/fuga</Link>
        <Link to='/piyo'>/piyo</Link>
      </header>

      {children}
    </div>
  )
}
