import React from 'react'
import './index.css'

export default (props) => (
  <div className='frontend'>
    <div className='vertical-center-block container'>

      <div className='row m-0 text-center'>        
          <img width='150' src='/images/logo.png' />
          <div className='version mt-40'>Rudicaf - Kết nối đẳng cấp</div>        
      </div>

      <div className='row mt-40'>
        <div className='col-sm-6 text-right'>
          <a href='https://itunes.apple.com/us/app/rudicaf/id1172963800?mt=8'>
            <img width='150' src='/images/appstore.png' />
          </a>
        </div>
        <div className='col-sm-6 text-left pl-20'>
          <a href='https://play.google.com/store/apps/details?id=com.rudicaf.dating'>
            <img width='150' src='/images/google-store.png' />
          </a>
        </div>
      </div>      
    </div>  

    <div className='footer text-center'>
      Copyright © 2018 Rudicaf. All rights reserved.
    </div>

  </div>
)






