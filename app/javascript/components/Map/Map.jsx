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
      favorites: null,
      searchTerm: null,
      mobileView: false,
      toggleMap: true,
      mapHeight: "800",
      markersList: []
    };
  }
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
  componentDidUpdate(prevProps, prevState) {
    let {bounds, searchTerm} = this.state;
    if(prevState.bounds!==bounds || prevState.searchTerm !== searchTerm){
        this.getPlaces();
    }
  }

  saveFavorite = (favorites) => {
    this.setState({ favorites });
  };
    // Creating a new map object here   
  createGoogleMap = () => {
    let map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: this.state.zoom,
      center: this.state.center,
      disableDefaultUI: true,
    });
    // Adding listener to watchout for map pans and scroll
    map.addListener("center_changed", () => {
      this.handleCenterChange();
    });
    // Persiting this to state so that it is available for 
    // the rest of the class members
    this.setState({ map: map });
  };
  handleCenterChange = () => {
    let responseList = null;
    let {map} = this.state;
    let bounds = map.getBounds()
    this.setState({ responseList, bounds });
  };
    // Checks if a list of locations are inside the
    // bounds of the map. Invalid locations are
    // discarded  
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
  // Function to interact with the google places API
  getPlaces = () => {
    let { searchTerm, map, markersList } = this.state;
    if (map && !searchTerm && markersList) {
        //search empty and there are markers present
        //so just clear them
        this.clearMarkers(markersList)
        this.setState({markersList:[]})
        return;
    }
    if (map && searchTerm) {
      // clearing markers on map before starting with a new request
      // we don't have the set markersList to [] becuase we are 
      // initiating it with fresh values down the line here.
      // We avoid using setState here to prevent a race condition of updating 
      // the markersList state.  
      this.clearMarkers(markersList);
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
          // If we have at least one or more valid locations inside the bounds,
          // mark them on the map.
          if (validatedResults.length > 0) {
            this.handleMarkers(validatedResults);
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
  handleMarkers = (locationList) => {
    let {map} = this.state;
    let markersList = [];
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
    this.setState({markersList})
    this.setMapOnAll(markersList);
  };
  // All markers created, now make them visible on the map
  setMapOnAll = (markersList) => {
    let map = this.state.map;
    if (markersList) {
      for (let i = 0; i < markersList.length; i++) {
        markersList[i].setMap(map);
      }
    }
  };
  clearMarkers = (markersList)=>{
    if (markersList) {
      for (let i = 0; i < markersList.length; i++) {
        markersList[i].setMap(null);
      }
    }
  }
  handleSearch = (searchTerm) => {
    let responseList = null;
    this.setState({ searchTerm, responseList });
  };
  // Function to help switch to and from mobile view
  handleResize = () => {
    let mobileView = false;
    if (window.innerWidth < 865) {
      mobileView = true;
    }
    this.setState({ mobileView });
  };
  // Toggle between map and list view for small screen sizes
  toggleMapInMobile = () => {
    let toggleMap = !this.state.toggleMap;
    this.setState({ toggleMap });
  };
  render() {
    let { responseList, mobileView, toggleMap, mapHeight } = this.state;
    let searchResultList = responseList ? responseList : <div></div>;
    let searchResultlistClass = "SearchListWrapper";
    let mapClass = "MapWrapper";
    let toggleButtonName = "";
    let toggleButtonClass = "Hide";
    let SearchListWidth = "100%";
    if (!responseList) {
      searchResultlistClass = "Hide";
    }
    if (mobileView && responseList) {
      toggleButtonClass = "ToggleButton Show";
      if (toggleMap) {
        searchResultlistClass = "SearchListWrapper Hide";
        toggleButtonName = "List";
      } else {
        searchResultlistClass = "SearchListWrapper";
        toggleButtonName = "Map";
        mapClass = "Hide"
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
            className={mapClass}
          ></div>
          {mobileToggleButton}
        </div>
      </div>
    );
  }
}
