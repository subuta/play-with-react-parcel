import React from 'react'
import { Helmet } from 'react-helmet'

import _ from 'lodash'
import fetch from 'isomorphic-unfetch'

import { withInitialProps } from '/utils/initialProps'

const getInitialProps = async function (props) {
  const id = _.get(props, 'match.params.id')
  const jokes = await fetch(`http://api.icndb.com/jokes/${id}`).then((res) => res.json())
  const value = _.get(jokes, 'value')
  return { id: value.id, joke: value.joke }
}

export default withInitialProps(module.id, getInitialProps)((props) => {
  const { joke } = props
  return (
    <>
      <Helmet>
        <title>{joke}</title>
        <meta name='description' content={joke} />
      </Helmet>

      <h3>{joke}</h3>
    </>
  )
})
