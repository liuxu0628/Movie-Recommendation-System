import React from 'react';
import styled from 'styled-components';
import { media } from '../../utils';
import { Link } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Icon
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';
import { withRouter } from 'react-router-dom';
import { ReactComponent as SiteLogo } from '../../assets/images/clapperboard.svg';

let styles = {
  headerLink: {
    height: '100%'
  },
  userIcon: {
    position: 'relative',
    top: '0px',
    left: '0px',
    fontSize: '30px',
    margin: '0 10px'
  },
  userName: {
    fontSize: '25px'
  },
  accountItem: {
    position: 'absolute',
    right: '0',
    top: '0',
    height: '100%'
}
};

const Wrapper = styled.nav`
  background-color: ${p => (p.onTop ? 'transparent' : '#495285')};
  color: #fff;
  display: flex;
  height: ${p => (p.onTop ? 'auto' : '100px')};
  position: fixed;
  top: 0;
  transition: background-color 0.4s;
  width: 100%;
  z-index: 100;

  ul {
    display: flex;
    margin: 0;
    padding: 30px 30px;
    align-items: center;

    ${media.tablet`display: none;`};
  }
`;

const NavItem = styled.li`
  border-bottom: 3px solid transparent;
  list-style-type: none;
  margin: 0 20px;
  transition: border 0.3s;

  &:hover {
    border-bottom: 3px solid #9067c6;
  }

  a {
    color: #fff;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
  }
`;

const AccountItem = styled.li`
  list-style-type: none;
  margin: 0 20px;
  align-items: center;
  display: flex;
`;

const LogoWrapper = styled.a`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 24px;
  text-decoration: none;

  svg {
    height: 64px;
    width: 50px;
  }

  &:hover {
    color: white;
  }

  margin-left: 40px;
`;

const Menu = styled.div`
  align-items: flex-end;
  display: none;
  flex-direction: column;
  position: fixed;
  right: 0;
  height: 100%;
  background-color: #000;
  transform: ${p =>
    p.isOpen ? 'translate3d(0px, 0px, 0px)' : 'translate3d(100%, 0px, 0px)'};
  transition: transform 0.8s;
  ${media.tablet`display: flex;`};

  ${Icon} {
    padding: 15px;
  }

  ${NavItem} {
    font-size: 20px;
    margin: 20px 50px;
  }
`;

const Logo = () => (
  <LogoWrapper href="/">
    <SiteLogo />
  </LogoWrapper>
);

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { onTop: true, isOpen: false };
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUnMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    window.scrollY === 0
      ? this.setState({ onTop: true })
      : this.setState({ onTop: false });
  };

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { authenticated, username } = this.props;
    const fixed = true;

    return (
      <Wrapper onTop={this.state.onTop}>
        <Logo />

        <ul>
          <NavItem>
            <Link to="/movies">Movies</Link>
          </NavItem>
          <NavItem>
            <Link to="/about">About</Link>
          </NavItem>
        </ul>


        {authenticated ? (
          <ul style={styles.accountItem}>
            <AccountItem>
              <Icon
                name="user circle"
                inverted={!fixed}
                size="large"
                style={styles.userIcon}
              />
              <Dropdown
                text={username}
                style={styles.userName}
                clearable
                labeled
                item
                simple
              >
                <Dropdown.Menu>
                  <Dropdown.Item>My Profile</Dropdown.Item>
                  <Dropdown.Item>My Favourites</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.logout()}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </AccountItem>
          </ul>
        ) : (
          <ul  style={styles.accountItem}>
            <AccountItem>
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
            </AccountItem>
          </ul>
        )}
      </Wrapper>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));
