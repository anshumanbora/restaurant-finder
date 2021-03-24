// TODO: get some linting tool to make codebase style uniform
import React, { PureComponent, createRef } from "react";
import SearchBar from "./SearchBar";
import SearchResultList from "./SearchList";
import "./Map.css";

export default class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.googleMapRef = React.createRef();
    this.state = {
      responseList: null,
      bounds: null,
      map: null,
      zoom: 14,
      center: {
        lat: 37.773972,
        lng: -122.431297,
      },
      markersList: [],
      favorites: null,
      searchTerm: null,
      mobileView: false,
      toggleMap: true,
      mapHeight: "800",
    };
  }

  // TODO change default location of map. Maybe make it more dynamic?
  // TODO remove locations from list if not inside bounds
  componentDidMount() {
    let that = this;
    setTimeout(() => {
      that.createGoogleMap();
    }, 200);
    window.addEventListener("resize", this.handleResize.bind(this));
    this.handleResize();
    // const height = document.getElementById('MapWrapperId').clientHeight;
    // let mapHeight = ''+height;
    // this.setState({ mapHeight });
  }
  componentDidUpdate() {
    console.log("did update", this.state.searchTerm);
    this.getPlaces();
  }

  saveFavorite = (favorites) => {
    this.setState({ favorites });
  };

  createGoogleMap = () => {
    let map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: this.state.zoom,
      center: this.state.center,
      disableDefaultUI: true,
    });
    map.addListener("center_changed", () => {
      let center = map.getCenter();
      this.handleCenterChange(center);
    });
    this.setState({ map: map });
  };
  handleCenterChange = () => {
    let responseList = null;
    this.setState({ responseList });
    this.getPlaces();
  };

  validateLocations = (locationList) => {
    let bounds = this.state.map.getBounds();
    let validatedResponse = [];
    for (let i = 0; i < locationList.length; i++) {
      let loc = locationList[i].geometry.location;
      if (
        loc.lat() < bounds.Sa.i &&
        loc.lat() > bounds.Sa.g &&
        loc.lng() < bounds.La.i &&
        loc.lng() > bounds.La.g
      ) {
        validatedResponse.push(locationList[i]);
      }
    }
    return validatedResponse;
  };
  getPlaces = () => {
    // TODO  Make this more modular. Break it in to maintainable components
    let { searchTerm, map, markersList } = this.state;
    //search empty and there are markers present
    //so just clear them
    if (map && searchTerm === "" && markersList) {
      this.handleMarkers();
    }
    if (map && searchTerm) {
      let request = {
        query: searchTerm,
        location: map.getCenter(),
        fields: [
          "name",
          "geometry",
          "place_id",
          "photos",
          "price_level",
          "rating",
          "user_ratings_total",
        ],
      };
      let service = new window.google.maps.places.PlacesService(this.state.map);
      service.textSearch(request, (results, status) => {
        if (status == "OK") {
          let validatedResults = this.validateLocations(results);
          if (validatedResults.length > 0) {
            this.handleMarkers(validatedResults, map);
          }
          this.setState({
            responseList: (
              <SearchResultList
                getFavorite={this.saveFavorite}
                responseList={validatedResults}
              />
            ),
          });
        }
      });
    }
  };
  handleMarkers = (locationList, map) => {
    let markersList = this.state.markersList;
    // Clearing existing markers before rendering new ones.
    // A future improvement would
    // be to break these into two functions, one more clearing and the other
    // for creating.
    if (markersList) {
      for (let i = 0; i < markersList.length; i++) {
        markersList[i].setMap(null);
      }
    }
    // Sike! No locations to mark so return from here
    if (!locationList) {
      return;
    }
    for (let i = 0; i < locationList.length; i++) {
      const pos = locationList[i].geometry.location;
      const name = locationList[i].name;
      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        title: name,
      });
      markersList.push(marker);
    }
    this.setState({ markersList: markersList });
    this.setMapOnAll(map);
  };
  setMapOnAll = (map) => {
    let markersList = this.state.markersList;
    if (markersList) {
      for (let i = 0; i < markersList.length; i++) {
        markersList[i].setMap(map);
      }
    }
  };

  handleSearch = (searchTerm) => {
    let responseList = null;
    this.setState({ searchTerm, responseList });
  };
  handleResize = () => {
    let mobileView = false;
    if (window.innerWidth < 865) {
      mobileView = true;
    }
    this.setState({ mobileView });
  };
  toggleMapInMobile = () => {
    let toggleMap = !this.state.toggleMap;
    this.setState({ toggleMap });
  };
  render() {
    let { responseList, mobileView, toggleMap, mapHeight, map } = this.state;
    let searchResultList = responseList ? responseList : <div></div>;
    let searchResultlistClass = "SearchListWrapper";
    let toggleButtonName = "";
    let toggleButtonClass = "Hide";
    let SearchListWidth = "100%";
    if (!responseList) {
      searchResultlistClass = "Hide";
    }
    if (mobileView) {
      toggleButtonClass = "ToggleButton Show";
      if (toggleMap) {
        searchResultlistClass = "SearchListWrapper Hide";
        toggleButtonName = "List";
      } else {
        searchResultlistClass = "SearchListWrapper";
        toggleButtonName = "Map";
        SearchListWidth = window.innerWidth + "px";
      }
    }
    let mobileToggleButton = (
      <button className={toggleButtonClass} onClick={this.toggleMapInMobile}>
        {toggleButtonName}
      </button>
    );

    return (
      <div className="TopLevelWrapper">
        <div>
          <SearchBar onSearch={this.handleSearch} />
        </div>
        <div id="MapWrapperId" className="SearchListAndMapWrapper">
          <div
            style={{ width: SearchListWidth }}
            className={searchResultlistClass}
          >
            {searchResultList}
          </div>
          <div
            id="google-map"
            ref={this.googleMapRef}
            style={{ width: "100%", height: { mapHeight } }}
            className="MapWrapper"
          ></div>
          {mobileToggleButton}
        </div>
      </div>
    );
  }
}
