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
            zoom: 13,
            markersList : [],
            favorites:[],
            searchTerm: null
        }
    }

    googleMapRef = React.createRef()
    
    componentDidMount() {
        const location = {
            lat: 41.586,
            lng: -93.625,
          }
        let that = this;
        setTimeout(()=>{
            that.createGoogleMap()  
            that.getPlaces(location)    
        },200)  
        
    }
    componentDidUpdate(){
        // console.log('componentDidUpdate');
        this.getPlaces()
    }
    static getDerivedStateFromProps(props,state){
        let newState = state;
        // console.log("getDerivedStateFromProps")
        return newState;
    }
    saveFavorite= (favorites) => {
        this.setState({favorites})
    }

    createGoogleMap(){
      let map = new window.google.maps.Map(this.googleMapRef.current, {
        zoom: this.state.zoom,
        center: {
            lat: 41.586,
            lng: -93.625,
        },
        disableDefaultUI: true,
      })
      map.addListener('center_changed', () => {
        let bounds = map.getBounds()
        let center = map.getCenter()
     this.handleCenterChange(bounds, center)
    });
      this.setState({map:map})
    //   console.log('creating new map and setting state map', map)
    }
    handleCenterChange = (bounds, center)=> {
        let newLocation = {
            lat: center.lat(),
            lng: center.lng()
        }
        this.clearMarkers()
        // console.log("calling getplaces")
        this.getPlaces()
    }
    getPlaces(){
        // TODO 1. pagination to get more places(look into it)
        // TODO 2. Get nearby query from bounding box instead of center of the map
        // TODO 3. Make this more modular. Break it in to maintainable components
        
        let {searchTerm, map} = this.state;
          if(this.state.map){
            if(searchTerm){
                let request = {
                    query: searchTerm,
                    locationBias: {
                        radius: 1000,
                        center: map.getCenter()
                    },
                    fields: ['name', 'geometry', 'place_id','photos','price_level','rating','user_ratings_total'],
                };
                let service = new window.google.maps.places.PlacesService(this.state.map);
                service.findPlaceFromQuery(request, (results,status)=>{
                    console.log(searchTerm, status, results)
                    if(status=="OK"){
                        // this.displayMarkers(results, map, location)
                        this.setState({responseList:<SearchResultList getFavorite={this.saveFavorite} responseList={results}/>})
                    }
                });
            }
        }         
    }
    displayMarkers(locationList, map, location){
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
        // console.log("Markers created, map", map)
        this.setMapOnAll(map)
    }
    setMapOnAll =(map)=>{
        let markersList = this.state.markersList
        for (let i = 0; i < markersList.length; i++) {
            markersList[i].setMap(map);
        }
    }
    clearMarkers() {
        this.setMapOnAll(null);
    }

    handleSearch = (searchTerm)=>{
        this.setState({searchTerm})
    }    
    // TODO handle quick refresh of map. Quick refresh leads to the app crashing because the 
    //google object is not ready yet
    render() {
        // console.log("markers",this.state.markersList)
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

