import React from 'react'

import { withInitialProps } from '/utils/initialProps'

const getInitialProps = async function (props) {
  return {}
}

export default withInitialProps(module.id, getInitialProps)(() => {
  return (
    <h1>index!</h1>
  )
})
