import React, { Component } from 'react';
import styled from 'styled-components';
import config from '../../config';
import { Button, Icon } from 'semantic-ui-react';
import Zoom from '@material-ui/core/Zoom';
import Fade from '@material-ui/core/Fade';
import { connect } from 'react-redux';
import * as movieActions from '../../store/actions/movie';

const Poster = styled.div`
  background-color: #fff;
  background: linear-gradient(
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url(${p => `${p.bg}`});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  position: absolute;
  transition: 0.8s;
  width: 100%;
  z-index: -2;
  opacity: ${p => (p.onTop ? '1' : '0.3')};
`;

const Content = styled.div`
  align-items: center;
  display: none;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 10px;
  position: absolute;
  text-align: center;
  width: 100%;

  ${Button} {
    margin: 5px 0;
  }
`;

const FrontContent = styled.div`
  align-items: center;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  text-align: center;
  width: 100%;

  ${Button} {
    margin: 5px 0;
  }
`;

const Delete = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  padding: 5.5px 0px 5px 4px;
  background: black;
  color: #fff;
  font-size: 11px;
  border-radius: 100%;
  transition: 0.6s;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05), 0 7px 20px rgba(0, 0, 0, 0.14);
`;

const Wrapper = styled.article`
  border: 2px solid transparent;
  color: #ddd;
  flex-shrink: 0;
  height: 160px;
  margin: 5px;
  position: relative;
  transition: border 0.2s;
  width: 100px;
  transition: all 0.6s;

  &:hover {
    border: 2px solid #ddd;

    ${Poster} {
      filter: blur(10px);
    }

    ${Content} {
      display: flex;
    }

    ${FrontContent} {
      display: none;
    }

    ${Delete} {
      transition: all 0.6s;
    }

    // &:before {
    //   background-color: linear-gradient(0deg,rgba(0,0,0,.8),transparent,transparent,transparent);
    //   content: '';
    //   height: 100%;
    //   left: 0;
    //   opacity: 0.5;
    //   position: absolute;
    //   top: 0;
    //   width: 100%;
    //   z-index: -1;
    // }
  }
`;

const CoverIcon = ({ data }) => {
  if (data === true) {
    return <Icon name="like" size="big" color="red" />;
  } else {
    return <Icon name="thumbs down outline" size="big" />;
  }
};
class SmallMovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      style: { opacity: 1, transform: 'rotateY(0)' }
    };
  }

  remove = movie => {
    // this.props.userMovieAction(newData, movie.token);
    console.log('yooooo', this.props);
    this.props.userMovieRemove(movie, this.props.token);
    // this.props.func(movie);
  };

  render() {
    const { title, poster_path, onTop, userAction } = this.props;

    return (
      <Wrapper style={this.state.style}>
        <FrontContent>
          <CoverIcon data={userAction} />
        </FrontContent>

        <Content>
          <h5>{title}</h5>
          <Delete
            onClick={() => {
              this.remove(this.props);
            }}
          >
            <Icon name="delete" size="big" />
          </Delete>
        </Content>

        <Poster bg={`${config.medium}${poster_path}`} onTop={onTop} />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.movieBrowser.movies,
    userMovies: state.userMovie.userMovies,
    authenticated: state.auth.token !== null,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => ({
  userMovieAction: (movie, token) =>
    dispatch(movieActions.userMovieAction(movie, token)),
  userMovieRemove: (movie, token) =>
    dispatch(movieActions.userMovieRemove(movie, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(SmallMovieCard);
