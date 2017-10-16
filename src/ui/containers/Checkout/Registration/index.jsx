import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


export default class extends React.Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
        </FormGroup>
        
        <FormGroup check>
          <Label check>
            <Input type="checkbox" />{' '}
            Tick this box if you would not like to receive Deliveroo marketing offers and promotions via email and text
          </Label>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    )
  }
}