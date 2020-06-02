import React, { Component } from 'react';
import styled from 'styled-components';
import config from '../../config';
import { GenreButton1 } from '../../components/MovieList/Button';
import CreditsList from '../../components/MovieList/CreditsList';
import Gallery from '../../components/MovieList/Gallery';
import { media } from '../../utils';
import { connect } from 'react-redux';
import * as movieActions from '../../store/actions/movie';
import Nav from '../../components/HeadMenu/Nav';
import { Grid, Icon, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './index.css';
import ScrollContainer from '../../components/MovieList/ScrollContainer';

const Background = styled.div`
  background-image: url(${p => `${config.large}${p.bg}`});
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 85vh;
  position: relative;
  top: 0;
  width: 100%;
  z-index: 0;

  &:before {
    background: linear-gradient(
      to bottom,
      rgba(57, 73, 171, 0.1) 0%,
      rgba(17, 17, 17, 1) 77%
    );
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: -1;
  }
`;

const Wrapper = styled.main`
  align-items: center;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const MovieWrapper = styled.section`
  padding: 20px 40px;
  margin-top: -35%;
  flex-wrap: wrap;
  display: flex;
`;

const Info = styled.div`
  padding: 0 20px;
  margin: 0 10px;
  flex: 1;
  flex-direction: column;
  display: flex;
  z-index: 10;
`;

const Poster = styled.div`
  background-image: url(${p => `${config.medium}${p.bg}`});
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 500px;
  margin: 0 20px;
  width: 300px;
  z-index: 10;

  ${media.tablet`height: 300px; width: 200px;`};
`;

const Title = styled.h1`
  color: #fff;
  font-size: 56px;
  margin: 0 0 10px 0;
`;

const Description = styled.p`
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.25px;
  line-height: 30px;
  margin-top: 30px;
  max-width: 600px;
`;

const Credits = styled.section`
  display: flex;
  max-width: 1150px;
  padding: 0 30px;
  width: 100%;
  z-index: 10;
`;

const Stat = styled.div`
  font-size: 32px;
  display: flex;
  margin-bottom: 15px;
  color: #fff;
  ${media.tablet`font-size: 24px;`}

  svg {
    margin: 0 10px 0 0;
  }
  p {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 15px;
    font-weight: 600;
    flex: 1;

    &:first-of-type {
      margin-left: 0;
    }
  }

  .smallSpan {
    font-weight: 400;
    font-size: 14px;
    color: #ff00ab;
    margin: 0 0 0 15px;
  }

  .revenueIcon {
    margin-right: 20px;
  }
`;

class MovieDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { movieDetail: null };
  }

  async componentDidMount() {
    const movieId = this.props.match.params.id;
    const { getMovieDetail } = this.props;

    await getMovieDetail(movieId);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.movieDetail !== this.props.movieDetail) {
      this.setState({ movieDetail: this.props.movieDetail });
    }
  }

  render() {
    const { movieDetail } = this.props;

    let isLoading =
      (movieDetail && movieDetail.isFetching) || !movieDetail.movie;

    if (isLoading) {
      return (
        <Dimmer active>
          {/* <Loader>Loading</Loader> */}
          <PacmanLoader size={50} color={'#ff00ab'} loading={true} />
        </Dimmer>
      );
    }

    return (
      <Wrapper>
        <Nav />
        <Background
          bg={
            movieDetail.movie.backdrop_path
              ? movieDetail.movie.backdrop_path
              : movieDetail.movie.poster_path
          }
        />
        <MovieWrapper>
          <Poster bg={movieDetail.movie.poster_path} />
          <Info>
            <Title>{movieDetail.movie.title}</Title>
            <p>
              {movieDetail.movie.release_date.slice(0, 4)} -{' '}
              {movieDetail.movie.runtime} min
            </p>
            <div>
              {movieDetail.movie.genres.slice(0, 3).map(genre => (
                <GenreButton1 title={genre.name} key={genre.name} />
              ))}
            </div>
            <Description>{movieDetail.movie.overview}</Description>

            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <Grid.Row>
                    <Icon name="star" className="statIcon" />
                    <span className="statInfo">
                      {movieDetail.movie.vote_average.toFixed(1)}
                    </span>
                  </Grid.Row>
                  <Grid.Row>
                    <span className="smallSpan">Average Rate</span>
                  </Grid.Row>
                </Grid.Column>

                <Grid.Column>
                  <Grid.Row>
                    <Icon name="hotjar" className="statIcon" />
                    <span className="statInfo">
                      {movieDetail.movie.popularity}
                    </span>
                  </Grid.Row>
                  <Grid.Row>
                    <span className="smallSpan">Popularity</span>
                  </Grid.Row>
                </Grid.Column>

                {/* <Grid.Column>
                  <Grid.Row>
                    <Icon
                      name="money bill alternate outline icon"
                      className="revenueIcon"
                    />
                    <span className="statInfo">{movieDetail.movie.revenue}</span>
                  </Grid.Row>
                  <Grid.Row>
                    <span className="smallSpan">Revenue</span>
                  </Grid.Row>
                </Grid.Column> */}
              </Grid.Row>
            </Grid>
          </Info>
        </MovieWrapper>

        <Credits>
          <CreditsList
            credits={movieDetail && movieDetail.credits.cast}
            title="Cast"
          />
          <CreditsList
            credits={movieDetail && movieDetail.credits.crew}
            title="Crew"
          />
        </Credits>

        <Gallery images={movieDetail && movieDetail.images} />

        {movieDetail.recommendations.results.length > 0 && (
          <ScrollContainer
            title="Recommended movies"
            movies={movieDetail.recommendations.results}
          />
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    genres: state.movieBrowser.genres,
    movieDetail: state.movieDetail
  };
};

const mapDispatchToProps = dispatch => ({
  getMovieDetail: idMovie => dispatch(movieActions.getMovieDetail(idMovie))
});

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetail);
