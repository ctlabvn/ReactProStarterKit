import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import {spacing, typography, zIndex} from 'material-ui/styles'

import config from '~/ui/shared/config'
import ActionDashboard from 'material-ui/svg-icons/action/dashboard'

import { Link } from 'react-router-dom'

const SelectableList = makeSelectable(List)

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,    
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightBold,
    backgroundColor: '#367fa9',
    paddingLeft: spacing.desktopGutter,
    marginBottom: 0,
  },
  menu: {
    paddingLeft: 50,
    color: '#fff',
  },
  subMenu:{
    color: '#fff',
  },
  subHeader: {
    backgroundColor: '#1a2226',
    color: '#6f6f6f',
  }
}

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,      
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  state={
    currentLink: '',
  }

  componentDidMount() {   
  }  

  handleRequestChangeLink = (event, value) => {    
    this.setState({
      currentLink:value
    })
    // this.context.router.push(value)
  }

  handleTouchTapHeader = () => {    
    this.context.router.push('/admin')    
  }

  render() {
    const {      
      docked,      
      open,      
    } = this.props

    return (
      <Drawer
        containerClassName="drawer"
        docked={docked}
        open={open}        
        containerStyle={{zIndex: zIndex.drawer - 100}}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          {config.authorName}
        </div>
        
        <SelectableList
          value={this.state.currentLink}
          onChange={this.handleRequestChangeLink}
        >
          <Subheader style={styles.subHeader}>MAIN MENU</Subheader>
          <Divider />
          <ListItem            
            leftIcon={<ActionDashboard color={styles.menu.color}/>}
            innerDivStyle={styles.menu}
            primaryText="Management"
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[              
              <ListItem 
                innerDivStyle={styles.subMenu} 
                primaryText="Event Management" 
                value="events"
                containerElement={<Link to="/admin/events" />} />,
            ]}
          />          
        </SelectableList>
      </Drawer>
    )
  }
}

export default AppNavDrawer