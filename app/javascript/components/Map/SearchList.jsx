import React, { PureComponent } from "react";
import "./SearchList.css";
import StarRatings from "react-star-ratings";

export default class SearchResultList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: null,
    };
  }
  handleFavoriteClick = (placeId) => {
    // We use the localStorage API of the browser to store favarites places
    let favoriteList =
      JSON.parse(window.localStorage.getItem("favorites")) || [];
    if (favoriteList.includes(placeId)) {
      favoriteList.pop(placeId);
    } else {
      favoriteList.push(placeId);
    }
    window.localStorage.setItem("favorites", JSON.stringify(favoriteList));
    let restaurantList = this.createRestaurantList(this.props.responseList);
    this.setState({ restaurantList });
    this.props.getFavorite(favoriteList);
  };
  createStarRating(ratings) {
    return (
      <StarRatings
        rating={ratings}
        starRatedColor="rgb(218,165,32)"
        numberOfStars={5}
        starDimension="15px"
        starSpacing="1px"
        name="rating"
      />
    );
  }
  generateFavoriteIcon = (placeId) => {
    let favorites = JSON.parse(window.localStorage.getItem("favorites")) || [];
    if (favorites.includes(placeId)) {
      return (
        <svg
          onClick={() => this.handleFavoriteClick(placeId)}
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-heart-fill"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          />
        </svg>
      );
    }
    return (
      <svg
        onClick={() => this.handleFavoriteClick(placeId)}
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        className="bi bi-heart"
        viewBox="0 0 16 16"
      >
        <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
      </svg>
    );
  };
  generatePriceLevel = (priceLevel) => {
    let dollars = "$";
    if (priceLevel > 3) {
      dollars += "$$";
    } else if (priceLevel > 1) {
      dollars += "$";
    }
    return dollars;
  };
  generatePhoto = (photos) => {
    let photo = (
      <img
        width="100"
        height="100"
        alt="No images found"
        src="https://via.placeholder.com/50"
      ></img>
    );
    if (photos) {
      photo = <img src={photos[0].getUrl()} width="100" height="100"></img>;
    }
    return photo;
  };
  createUnitView = (restaurant) => {
    let photo = this.generatePhoto(restaurant.photos);
    let favoriteIcon = this.generateFavoriteIcon(restaurant.place_id);
    let userRatingTotal = restaurant.user_ratings_total
      ? restaurant.user_ratings_total
      : "No data";
    let startRating = this.createStarRating(restaurant.rating);
    let priceRating = this.generatePriceLevel(restaurant.price_level);
    let isOpen = restaurant.opening_hours
      ? restaurant.opening_hours.open_now
        ? "Yes"
        : "No"
      : "Not avialable";
    let openInfo = "Open now: " + isOpen;
    return (
      <div className="UnitView" key={restaurant.place_id}>
        <div className="RestaurantPhoto">{photo}</div>
        <div className="Information">
          <div className="RestaurantName">{restaurant.name}</div>
          <div className="Ratings">
            <div className="RestaurantRating">{startRating}</div>
            <div className="RestaurantTotalRating">({userRatingTotal})</div>
          </div>
          <div className="Details">
            <div className="PriceRating">{priceRating}</div>
            <div className="Bullet">&#9679;</div>
            <div className="OpenInfo">{openInfo}</div>
          </div>
        </div>
        <div className="Favorite">{favoriteIcon}</div>
      </div>
    );
  };
  createRestaurantList = (responseList) => {
    let listOfRestaurants = [];
    for (let i = 0; i < responseList.length; i++) {
      listOfRestaurants.push(this.createUnitView(responseList[i]));
    }
    return listOfRestaurants;
  };
  componentDidUpdate = (prevProps) => {
    // Prevent infinite calls to render by setting state only when
    // a new prop comes in
    if (prevProps.responseList !== this.props.responseList) {
      let restaurantList = this.createRestaurantList(this.props.responseList);
      this.setState({ restaurantList: restaurantList });
    }
  };
  componentDidMount = () => {
    let restaurantList = this.createRestaurantList(this.props.responseList);
    this.setState({ restaurantList });
  };
  render() {
    let { restaurantList } = this.state;
    if (restaurantList && restaurantList.length == 0) {
      return (
        <div className="SearchResultListContainer">
          "No results for this search. Try widening your map area or a different
          search term"
        </div>
      );
    }
    let listOfRestaurants = this.state.restaurantList;
    return <div className="SearchResultListContainer">{listOfRestaurants}</div>;
  }
}
