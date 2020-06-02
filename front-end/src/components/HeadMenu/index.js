import React from 'react';
import {
  Button,
  Container,
  Menu,
  Input,
  Image,
  Icon,
  Dropdown
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import logo1 from '../../assets/images/movie_logo.png';
import logo2 from '../../assets/images/movie_logo2.png';
import MovieFilter from '../../components/MovieFilter';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';
import { withRouter } from 'react-router-dom';

let styles = {
  headerLink: {
    height: '100%'
  },
  userIcon: {
    position: 'relative',
    top: '12px',
    left: '10px'
  }
};

const InputExampleIconProps = () => (
  <Input
    icon={{ name: 'search', circular: true, link: true }}
    placeholder="Search..."
  />
);

class HeadMenu extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  triggerChildDrawer = open => {
    this.child.toggleDrawer(open);
  };

  render() {
    const { fixed, authenticated, username } = this.props;
    return (
      <Menu
        fixed={fixed ? 'top' : null}
        inverted={!fixed}
        pointing={!fixed}
        secondary={!fixed}
        size="large"
      >
        <MovieFilter onRef={ref => (this.child = ref)} />

        <Container>
          <Link to="/">
            <Menu.Item style={styles.headerLink} header>
              <Icon name="video layout" />
            </Menu.Item>
          </Link>
          <Link to="/">
            <Menu.Item style={styles.headerLink} header>
              Home
            </Menu.Item>
          </Link>
          <Link to="/movies">
            <Menu.Item style={styles.headerLink} header>
              Movies
            </Menu.Item>
          </Link>
          <Link to="/about">
            <Menu.Item style={styles.headerLink} header>
              About
            </Menu.Item>
          </Link>
          <Menu.Item
            style={styles.headerLink}
            header
            onClick={() => {
              this.triggerChildDrawer(true);
            }}
            onHover={() => {
              this.triggerChildDrawer(true);
            }}
          >
            <Icon name="search layout" />
          </Menu.Item>

          {authenticated ? (
            <Menu.Menu position="right">
              <Icon
                name="user circle"
                inverted={!fixed}
                size="large"
                style={styles.userIcon}
              />
              <Dropdown text={username} clearable labeled item simple>
                <Dropdown.Menu>
                  <Dropdown.Item>My Profile</Dropdown.Item>
                  <Dropdown.Item>My Favourites</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.logout()}>
                    Logout
                  </Dropdown.Item>
                  {/* <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>List Item</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : (
            <Menu.Item position="right">
              <Button as="a" href="/login" inverted={!fixed}>
                Log in
              </Button>

              <Button
                as="a"
                href="/signup"
                inverted={!fixed}
                primary={fixed}
                style={{ marginLeft: '0.5em' }}
              >
                Sign Up
              </Button>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeadMenu)
);
