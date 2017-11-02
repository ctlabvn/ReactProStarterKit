import React from "react";
// import { ORDER_TYPE } from "~/ui/utils";

// reactstrap
import { 
  FormGroup, 
  Label, 
  Input, 
  // DropdownItem 
} from "reactstrap";

export default ({
  input,
  label,
  meta: { touched, error, warning },
  checkedValue,
  orderTypes
}) => {
  // const checkedValue = orderTypes.length === 1 ? orderTypes[0].id : (input.value || ORDER_TYPE.DELIVERY);  
  return (
    <FormGroup check className="d-flex justify-content-between">
      {orderTypes.map((item, index) => (
        <Label check key={index} className="mr-4">
          <Input
            onChange={e => input.onChange(item.id)}
            type="radio"
            defaultChecked={item.id === checkedValue}          
            name="order_type"
            className="mr-2"
          />
          {item.title}
        </Label>
      ))}
    </FormGroup>
  );

}