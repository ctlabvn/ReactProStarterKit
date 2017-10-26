export const checkOrderAvailable = (outlet) => {  
  if(!outlet.online_order_setting)
    return false;
  const {do_takeaway, do_delivery, hours_open, published} = outlet.online_order_setting
  if(!published || !hours_open)
    return false;
  
	if (!do_delivery && !do_takeaway){
    return false;
  }
  return true;
}