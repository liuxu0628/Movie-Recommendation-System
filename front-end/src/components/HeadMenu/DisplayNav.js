import React from 'react';
import styled from 'styled-components';
import { media } from '../../utils';
import { Link } from 'react-router-dom';
import Search from './Search';
import { Grid, Button, Dropdown, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';
import { withRouter } from 'react-router-dom';
import { ReactComponent as SiteLogo } from '../../assets/images/clapperboard.svg';
import DisplayContainer from '../MovieList/DisplayContainer';

const styles = {
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
  navRow: {
    display: 'flex'
  },
  accountItem: {
    position: 'absolute',
    right: '0',
    top: '0',
    padding: '23px 30px'
  },
  algoButton: {
    // position: 'absolute',
    // left: '0',
    // right: '0',
    // // width: '100%',
    // margin: '20px auto',
    // display: 'flex',
    // justifyContent: 'center'
  }
};

const Wrapper = styled.nav`
  background: ${p =>
    p.onTop ? '#495285' : 'linear-gradient(#495285, 50%, transparent);'};
  color: #fff;
  height: 272px;
  position: fixed;
  top: 0;
  transition: background-color 0.8s;
  width: 100%;
  z-index: 100;

  ul {
    display: flex;
    margin: 0;
    padding: 30px 30px;
    align-items: center;
    z-index: 1000;
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
  z-index: 1000;

  svg {
    height: 64px;
    width: 50px;
  }

  &:hover {
    color: white;
  }

  margin-left: 40px;
`;

const Logo = () => (
  <LogoWrapper href="/">
    <SiteLogo />
  </LogoWrapper>
);

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onTop: true,
      isOpen: false,
      algo: 1
    };
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

  algo = e => {
    console.log('$$$$$$$$', e);
  };

  render() {
    const { authenticated, username } = this.props;
    const fixed = true;

    return (
      <div>
        <Wrapper onTop={this.state.onTop}>
          <Grid.Row style={styles.navRow}>
            <Logo />
            <ul>
              <NavItem>
                <Link to="/movies">Movies</Link>
              </NavItem>
              <NavItem>
                <Link to="/about">About</Link>
              </NavItem>
            </ul>

            <Search style={styles.searchBar} />

            <AccountItem style={styles.algoButton}>
              <Button.Group size="large" >
                <Button
                  onClick={() => {
                    this.setState({ algo: 1 }, () => this.props.algo(1));
                  }}
                  color={this.state.algo === 1 ? 'green' : ''}
                >
                  Algo One
                </Button>
                <Button.Or />
                <Button
                  onClick={() => {
                    this.setState({ algo: 2 }, () => this.props.algo(2));
                  }}
                  color={this.state.algo === 2 ? 'green' : ''}
                >
                  Algo Two
                </Button>
              </Button.Group>
            </AccountItem>

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
              <ul style={styles.accountItem}>
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
          </Grid.Row>

          <Grid.Row>
            <DisplayContainer
              movies={this.props.movies}
              onTop={this.state.onTop}
              func={this.props.func}
            />
          </Grid.Row>
        </Wrapper>
      </div>
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
