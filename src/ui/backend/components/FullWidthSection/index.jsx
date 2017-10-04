import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ClearFix from 'material-ui/internal/ClearFix'
import spacing from 'material-ui/styles/spacing'
import withWidth, {SMALL, LARGE} from 'material-ui/utils/withWidth'

const desktopGutter = spacing.desktopGutter;

class FullWidthSection extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.object,
    contentType: PropTypes.string,
    style: PropTypes.object,
    useContent: PropTypes.bool,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    useContent: false,
    contentType: 'div',
  };

  getStyles() {
    return {
      root: {
        paddingLeft: 300,
        paddingRight:40,
        paddingTop: desktopGutter * 2,
        paddingBottom: desktopGutter * 2,
        boxSizing: 'border-box',
      },
      content: {
        maxWidth: 1200,
        margin: '0 auto',
      },      
    };
  }

  render() {
    const {      
      useContent,
      contentType,      
      width,
      ...other
    } = this.props;

    const styles = this.getStyles();

    let content;
    if (useContent) {
      content =
        React.createElement(
          contentType,
          {style: styles.content},
          this.props.children
        );
    } else {
      content = this.props.children;
    }

    return (
      <ClearFix
        {...other}
        style={styles.root}
      >
        {content}
      </ClearFix>
    );
  }
}

export default withWidth()(FullWidthSection);