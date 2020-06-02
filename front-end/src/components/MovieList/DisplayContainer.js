import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import SmallMovieCard from './SmallMovieCard';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

const List = styled.section`
  flex-direction: column;
  display: flex;
`;

const MoviesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  transform: ${p => `translate3d(${p.offset}px, 0px, 0px)`};
  transition: transform 0.6s;
  width: 98.5vw;
  overflow-x: auto;
  padding-top: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAdding: false };
  }

  render() {
    const { movies } = this.props;

    return (
      <List>
        <div style={{ overflow: 'hidden', padding: '0 10px 10px 10px' }}>
          <MoviesWrapper offset={this.state.listOffset}>
            {movies &&
              movies.map(movie => (
                  <SmallMovieCard
                    key={movie.id}
                    onTop={this.props.onTop}
                    func={this.props.func}
                    {...movie}
                  />
              ))}
          </MoviesWrapper>
        </div>
      </List>
    );
  }
}

export default MovieList;
