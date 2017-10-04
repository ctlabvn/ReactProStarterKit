import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

export default class NotFound extends Component {

  render () {    
    return (      
      <article>
        <div className="text-center mt-40">
          <img src="/images/404.png" alt="404 error" />
          <h1 className="errorTitle">
            <strong>404</strong>
            <br /> Page Not Found 
          </h1>
          <p >We're sorry, the page you were looking for doesn't exist anymore.
            <br/><br/>Goto <Link to='/' className="link">Home</Link>
          </p>
        </div>        
      </article>
    )
  }
}