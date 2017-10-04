import React from 'react'
import { Link } from 'react-router-dom'

const Item = ({ adminPath, id, name }) => {
  return (
    <Link className='tag-link' to={`${adminPath}/posts?tag-id=${id}`} >
      {name}
    </Link>
  )
}

export default Item
