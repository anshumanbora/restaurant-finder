// TODO: get some linting tool to make codebase style uniform
import React, { PureComponent, createRef } from 'react'
import SearchBar from './SearchBar'
import SearchResultList from './SearchList'
import './Map.css'

const getATGoogleAPIKey = () => "AIzaSyDIKzjfQQCahwJ9yEr8gBU9TqJ3MvbPXyY"

export default class Map extends PureComponent {
    constructor(props){
        super(props);
        this.createGoogleMap = this.createGoogleMap.bind(this);
        this.getPlaces = this.getPlaces.bind(this);
        this.displayMarkers = this.displayMarkers.bind(this)
        this.state = {
            responseList : null,
            bounds : null,
            map: null,
            zoom: 14,
            markersList : null,
            favorites:null,
            searchTerm: null
        }
    }

    googleMapRef = React.createRef()
    // TODO change default location of map. Maybe make it more dynamic?
    // TODO remove locations from list if not inside bounds
    componentDidMount() {
        let that = this;
        setTimeout(()=>{
            that.createGoogleMap()    
        },200)       
    }
    componentDidUpdate(){
        this.getPlaces()
    }
    
    saveFavorite= (favorites) => {
        this.setState({favorites})
    }

    createGoogleMap(){
      let map = new window.google.maps.Map(this.googleMapRef.current, {
            zoom: this.state.zoom,
            center: {
                lat: 37.773972,
                lng: -122.431297,
            },
            disableDefaultUI: true,
        })
        map.addListener('center_changed', () => {
            let center = map.getCenter()
            this.handleCenterChange(center)
        });
        this.setState({map:map})
    }
    handleCenterChange = ()=> {
        let responseList = null;
        this.setState({responseList})
        this.clearMarkers();
        this.getPlaces();
    }
    getPlaces(){
        // TODO  Make this more modular. Break it in to maintainable components
        let {searchTerm, map} = this.state;
          if(map && searchTerm){  
            let request = {
                query: searchTerm,
                locationBias: {
                    radius: 10000,
                    center: map.getCenter()
                },
                fields: [
                    'name',
                    'geometry', 
                    'place_id',
                    'photos',
                    'price_level',
                    'rating',
                    'user_ratings_total'
                ],
            };
            let service = new window.google.maps.places.PlacesService(this.state.map);
            service.findPlaceFromQuery(request, (results,status)=>{
                if(status=="OK"){
                    //clear markers from old queries to avoid confusion
                    this.displayMarkers(results, map)
                    this.setState(
                        {
                            responseList:
                            <SearchResultList getFavorite={this.saveFavorite} responseList={results}/>
                        }
                    );
                }
            });
        }         
    }
    displayMarkers(locationList, map){
        let markersList = [];
        for(let i=0;i<locationList.length;i++){
            const pos = locationList[i].geometry.location
            const name = locationList[i].name
            // console.log("name:",name,",location:",pos)
            // TODO change icon of markers
            const marker = new window.google.maps.Marker({
                position: pos,
                map,
                title: name,
              });
            markersList.push(marker) 
        }
        this.setState({markersList:markersList})
        this.setMapOnAll(map)
    }
    setMapOnAll =(map)=>{
        let markersList = this.state.markersList
        if(markersList){
            for (let i = 0; i < markersList.length; i++) {
                markersList[i].setMap(map);
            }
        }        
    }
    clearMarkers() {
        this.setMapOnAll(null);
    }
    // TODO find a way to clear old markers. As things now
    // old markers are persisting even when it is being called
    // here
    flyToLocation = () =>{
        
    }
    handleSearch = (searchTerm)=>{
        let responseList = null;
        this.clearMarkers();
        this.setState({searchTerm, responseList});
    }    
    // TODO handle quick refresh of map. Quick refresh leads to the app crashing because the 
    //google object is not ready yet
    render() {
        let searchResultList = this.state.responseList?this.state.responseList:<div>No Results for this Area</div>
      return (
      <div className="TopLevelWrapper">
            <div>
                <SearchBar
                    onSearch={this.handleSearch}
                />
            </div>
            <div className="SearchListAndMapWrapper">
                <div className="SearchListWrapper">
                {searchResultList}
                </div>
                <div
                    id="google-map"
                    ref={this.googleMapRef}
                    style={{ width: '100%', height: '800px' }}>
                </div>
            </div>        
      </div>
      )
    }
  }

