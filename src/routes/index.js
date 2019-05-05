import React from 'react'

import { withInitialProps } from '/utils/initialProps'

const getInitialProps = async function (props) {
  return {}
}

export default withInitialProps(module.id, getInitialProps)(() => {
  return (
    <h3>Will get some jokes from <code>http://www.icndb.com/api/</code></h3>
  )
})
