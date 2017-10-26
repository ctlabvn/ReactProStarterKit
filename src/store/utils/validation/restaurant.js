export const checkOrderAvailable = (outlet) => {
	return
		!!outlet.online_order_setting &&
		outlet.online_order_setting.published &&
		(outlet.online_order_setting.do_delivery || outlet.online_order_setting.do_takeaway);
}