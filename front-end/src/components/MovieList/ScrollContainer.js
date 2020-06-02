import React from 'react';
import styled from 'styled-components';
import MovieCard from './MovieCard';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

const List = styled.section`
  padding: 25px 10px 25px 35px;
  flex-direction: column;
  display: flex;
`;

const MoviesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  transform: ${p => `translate3d(${p.offset}px, 0px, 0px)`};
  transition: transform 0.6s;
  width: 97.5vw;
  overflow-x: scroll;
  padding-top: 10px;
`;

const Title = styled.h2`
  color: #fff;
  text-align: left;
  height: 50px;
`;


class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listOffset: 0 };
  }

  componentDidMount() {}

  handleClick = direction => {
    console.log(direction);
    let listOffset;
    if (direction === 'right') {
      listOffset =
        this.state.listOffset > -3640 ? this.state.listOffset - 260 : 0;
    } else {
      listOffset =
        this.state.listOffset < 0 ? this.state.listOffset + 260 : -3640;
    }

    this.setState({ listOffset });
  };

  render() {
    const { movies, genres } = this.props;

    return (
      <List>
        <Title>{this.props.title}</Title>
        <div style={{ overflow: 'hidden', padding: '20px' }}>
          <MoviesWrapper offset={this.state.listOffset}>
            {movies &&
              movies.map(movie => <MovieCard {...movie} key={movie.idMovie} />)}
          </MoviesWrapper>
        </div>
      </List>
    );
  }
}

export default MovieList;
