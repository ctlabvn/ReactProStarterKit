import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";

// reactstrap
import { 
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, Input, InputGroupAddon, 
} from "reactstrap";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import Dropdown from "~/ui/components/Dropdown";

import "./index.css";
import options from "./options";

@translate("translations")
@connect(state => ({
  isHome: state.routing.location.pathname === "/"
}))
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  renderLoginModal() {
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>Login</ModalHeader>
        <ModalBody>

        <InputGroup>
          <Input placeholder="username" />
          <InputGroupAddon>@example.com</InputGroupAddon>
        </InputGroup>

        <InputGroup className="mt-2">
          <Input placeholder="password" />
          <InputGroupAddon>
            <i className="fa fa-key" aria-hidden="true"/>
          </InputGroupAddon>
        </InputGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={this.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  render() {
    const { t, i18n, isHome } = this.props;
    return (
      <footer
        className={classNames("footer text-center menu-bottom", {
          "fixed-bottom": isHome
        })}
      >
        <Menu className="text-uppercase">
          <MenuItem
            title={
              <Dropdown
                className="dropup"
                title={t(`languages.${i18n.language}`)}
              >
                {options.locales.map(item => (
                  <a key={item} onClick={() => i18n.changeLanguage(item)}>
                    {t(`languages.${item}`)}
                  </a>
                ))}
              </Dropdown>
            }
          />
          <MenuItem link="/about" title={t('link.footer.about_us')} />
          <MenuItem link="/about" title={t('link.footer.technology')} />
          <MenuItem link="/about" title={t('link.footer.join_us')} />
          <MenuItem
            onClick={this.toggle}
            title={
              <button
                type="button"
                className="btn btn-outline-danger btn-sm text-uppercase"
              >
	              {t('link.footer.login')}
              </button>
            }
          />
        </Menu>
        <Menu className="bottom">
          {options.items.map((item, index) => (
            <MenuItem key={index} link={item.link} title={item.title} />
          ))}
        </Menu>
        {this.renderLoginModal()}
      </footer>
    );
  }
}