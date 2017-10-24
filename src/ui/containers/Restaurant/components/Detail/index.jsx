// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { translate } from "react-i18next";
// import { MyMapComponent, MyFancyComponent } from '~/ui/Map';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
//
// import api from "~/store/api";
// import "./index.css";
// import options from "./options";
//
//
// const ServicePointGoogleMap = withGoogleMap(({position}) => (
//   <GoogleMap
//     defaultZoom={12}
//     defaultCenter={position}
//   >
//     <Marker key='VietNam' defaultAnimation={2}
//             position={position}
//     />
//
//   </GoogleMap>
// ))
//
// @translate('translations')
// export default class extends Component {
//   render() {
//     const { t, outlet } = this.props;
//     const lat = outlet.lat;
//     const lng = outlet.long;
//     return (
//       <div className="row block bg-white mb-4 tab-content">
//         <h3 className="font-largest color-black w-100 mb-4">
//           <span className="font-weight-bold">{t('LABEL.FEES')}</span>
//         </h3>
//         <p>{outlet.online_order_setting && outlet.online_order_setting.delivery_fee}</p>
//
//         <h3 className="font-largest color-black w-100 mb-4">
//           <span className="font-weight-bold">{t('LABEL.MIN_MAX_ORDER_AMOUNT')}</span>
//         </h3>
//         <p>Min: {outlet.online_order_setting && outlet.online_order_setting.min_delivery_cost}</p>
//         <p>Max: {outlet.online_order_setting && outlet.online_order_setting.max_delivery_cost}</p>
//
//         <h3 className="font-largest color-black w-100 mb-4">
//           <span className="font-weight-bold">{t('LABEL.DELIVERING_HOURS')}</span>
//         </h3>
//         <p>{outlet.online_order_setting && outlet.online_order_setting.hours_delivery}</p>
//
//         <h3 className="font-largest color-black w-100 mb-4">
//           <span className="font-weight-bold">{t('LABEL.LOCAL_MAP')}</span>
//         </h3>
// 	      {lat && lng &&
//         <ServicePointGoogleMap
//           containerElement={
//             <div style={{ height: 400 }} />
// 		      }
//           mapElement={
//             <div style={{ height: `100%` }} />
// 		      }
//           position={{lat:+lat,lng:+lng}}
//         />
// 	      }
//       </div>
//     );
//   }
// }
