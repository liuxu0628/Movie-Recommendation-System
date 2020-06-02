import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye } from '@fortawesome/free-regular-svg-icons';
import { urlTitle, removeFromList } from '../../utils';
import config from '../../config';
import { GenericButton, Button } from './Button';
import * as movieActions from '../../store/actions/movie';
import { connect } from 'react-redux';
import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Poster = styled.div`
  background-color: #fff;
  background-image: url(${p => `${p.bg}`});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  position: absolute;
  transition: filter 0.4s;
  width: 100%;
  z-index: -2;
`;

const Rating = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 6px 8px;
  background: #aa2e85;
  color: #fff;
  font-size: 11px;
  border-radius: 100%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05), 0 7px 20px rgba(0, 0, 0, 0.14);
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

const Wrapper = styled.article`
  border: 2px solid transparent;
  color: #ddd;
  flex-shrink: 0;
  height: 400px;
  margin: 5px;
  position: relative;
  transition: border 0.2s;
  width: 250px;
  transition: all 0.6s;
  cursor: pointer;

  &:hover {
    border: 2px solid #ddd;

    ${Poster} {
      filter: blur(10px);
    }

    ${Content} {
      display: flex;
    }

    &:before {
      background-color: #000;
      content: '';
      height: 100%;
      left: 0;
      opacity: 0.5;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: -1;
    }
  }
`;

const style = {
  toolTip: {
    borderRadius: '5px',
    opacity: 0.7,
    padding: '1em',
    position: 'absolute',
    top: '-50px'
  }
};

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { opacity: 1, transform: 'rotateY(0)' }
    };
  }

  add = (e, movie) => {
    e.stopPropagation();
    let idMovie = movie.idMovie ? movie.idMovie : movie.id
    let newData = Object.assign({ userAction: true, idMovie }, movie);
    this.props.userMovieAction(newData, this.props.token);
    
  };

  remove = movie => {
    removeFromList(movie);
    this.setState({ isSaved: false });
    if (this.props.inFavorites) {
      this.setState(
        { style: { opacity: 0, transform: 'rotateY(70deg)' } },
        () => {
          setTimeout(() => {
            this.props.removeFromFavorites(movie.id);
          }, 500);
        }
      );
    }
  };

  jumpTo = (title, id) => {
    window.location.href = `/movie/${encodeURIComponent(
      urlTitle(title)
    )}/${id}`;
  };

  render() {

    const { title, vote_average, poster_path, userMovies } = this.props;
    const idMovie = this.props.idMovie ? this.props.idMovie : this.props.id


    let backgroundColor;
    if (vote_average >= 8) {
      backgroundColor = 'rgb(78, 173, 31)';
    } else if (vote_average <= 6) {
      backgroundColor = 'rgb(166, 173, 31)';
    } 
    else {
      backgroundColor = '#aa2e85';
    }

    return (
      <Popup
        trigger={
          <Wrapper
            style={this.state.style}
            onClick={() => this.jumpTo(title, idMovie)}
          >
            <Rating style={{ backgroundColor }}>
              {vote_average > 9.9 ? vote_average.toFixed(0) : vote_average.toFixed(1)}
              {/* {vote_average.toFixed(1)} */}
            </Rating>
            <Content>
              <h3>{title}</h3>
              {this.props.authenticated ? (
                userMovies.map(m=>(parseInt(m.idMovie))).includes(idMovie) ?
                <GenericButton
                  title="Favorite"
                  icon={<Icon name="star"/>}
                  onClick={e => this.add(e, this.props)}
                /> :
                <GenericButton
                  title="Favorite"
                  icon={<Icon name="star outline"/>}
                  onClick={e => this.add(e, this.props)}
                />
                  
              ) : (
                <GenericButton
                  title="Favorite"
                  icon={<Icon name="star outline"/>}
                  onClick={e => {
                    e.stopPropagation();
                    window.location.href = '/login';
                  }}
                />
              )}
            </Content>
            <Poster bg={`${config.medium}${poster_path}`} />
          </Wrapper>
        }
        position="bottom center"
        style={style.toolTip}
      >
        <Popup.Header>Click to view more</Popup.Header>
      </Popup>
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
  userMovieAction: (movie, token) => dispatch(movieActions.userMovieAction(movie, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
