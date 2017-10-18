import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { translate } from "react-i18next";
import './index.css'

@translate('translations')
export default class NotFound extends Component {

  render () {
    const { t } = this.props;  
    return (      
      <article>
        <div className="text-center mt-40">
          <img src="/images/404.png" alt="404 error" />
          <h1 className="errorTitle">
            <strong>404</strong>
            <br /> {t("LABEL.PAGE_NOT_FOUND")}
          </h1>
          <p >{t("LABEL.PAGE_NOT_EXIST")}
            <br/><br/>Goto <Link to='/' className="link">{t("LINK.HOME")}</Link>
          </p>
        </div>        
      </article>
    )
  }
}