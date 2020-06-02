import React, { Component } from 'react';
import styled from 'styled-components';
import { urlTitle, isSaved, removeFromList } from '../../utils';
import config from '../../config';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as movieActions from '../../store/actions/movie';

const styles = {
  buttonGroup: {
    position: 'absolute',
    bottom: '40px',
    height: '40px'
  },
  toolTip: {
    borderRadius: '5px',
    opacity: 0.7,
    padding: '1em',
    position: 'absolute'
  }
};

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
`;

const Wrapper = styled.article`
  border: 2px solid transparent;
  color: #ddd;
  flex-shrink: 0;
  height: 320px;
  margin: 5px;
  position: relative;
  transition: border 0.2s;
  width: 200px;
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

class MidMovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: isSaved(props),
      style: { opacity: 1, transform: 'rotateY(0)' }
    };
  }

  like = (e, data) => {
    e.stopPropagation();

    if(data.authenticated){
      let newData = Object.assign({ userAction: true }, data);
      this.props.userMovieAction(newData, data.token);
      this.props.shuffleMovie(newData);
    }else{
      window.location.href = '/login'
    }
  };

  dislike = (e, data) => {
    e.stopPropagation();
    
    if(data.authenticated){
      let newData = Object.assign({ userAction: false }, data);
      this.props.userMovieAction(newData, data.token);
      this.props.shuffleMovie(newData);
    }else{
      window.location.href = '/login'
    }
  };

  jumpTo = (title, id) => {
    window.location.href = `/movie/${encodeURIComponent(
      urlTitle(title)
    )}/${id}`
  }

  remove = movie => {
    removeFromList(movie);
    this.setState({ isSaved: false });
    if (this.props.inFavorites) {
      this.setState(
        { style: { opacity: 0, transform: 'rotateY(70deg)' } },
        () => {
          setTimeout(() => {
            this.props.removeFromFavorites(movie.idMovie);
          }, 500);
        }
      );
    }
  };

  render() {
    const { title, vote_average, idMovie, poster_path } = this.props;

    let backgroundColor;
    if (vote_average >= 8) {
      backgroundColor = 'rgb(78, 173, 31)';
    } else if (vote_average <= 6) {
      backgroundColor = 'rgb(166, 173, 31)';
    } else {
      backgroundColor = '#aa2e85';
    }

    return (
      <Popup
        trigger={
          <Wrapper style={this.state.style}>
              <Rating style={{ backgroundColor }}>
                {/* {vote_average.toFixed(1)} */}
                {vote_average > 9.9 ? vote_average.toFixed(0) : vote_average.toFixed(1)}
              </Rating>
              <Content  onClick={() => this.jumpTo(title, idMovie)}>
                <h3>{title}</h3>
                <Button.Group style={styles.buttonGroup}>
                  <Button color="red" onClick={(e) => this.like(e, this.props)}>
                    <Icon name="heart" />
                    Like
                  </Button>
                  <Button.Or />
                  <Button color="grey" onClick={(e) => this.dislike(e, this.props)}>
                    <Icon name="thumbs down" />
                  </Button>
                </Button.Group>
              </Content>
              <Poster bg={`${config.medium}${poster_path}`} />
          </Wrapper>
        }
        position="top center"
        style={styles.toolTip}
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

export default connect(mapStateToProps, mapDispatchToProps)(MidMovieCard);