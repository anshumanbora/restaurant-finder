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
            zoom: this.props.zoom
        }
    }

    googleMapRef = React.createRef()
    
    componentDidMount() {
        const location = {
            lat: 41.4566,
            lng: 93.4332,
          }
        let that = this;
        setTimeout(()=>{
            that.createGoogleMap()  
            that.getPlaces(location)    
        },200)  
        
    }
    componentDidUpdate(){
        console.log('componentDidUpdate');
    }
    static getDerivedStateFromProps(props,state){
        let newState = state;
        console.log("getDerivedStateFromProps")
        return newState;
    }
    handleMapClick= () => {
        console.log('click')
    }
    createGoogleMap(){
      let map = new window.google.maps.Map(this.googleMapRef.current, {
        zoom: this.state.zoom,
        center: {
          lat: 41.345456,
          lng: -93.12433,
        },
        disableDefaultUI: true,
      })
      map.addListener('center_changed', () => {
        let bounds = map.getBounds()
        let center = map.getCenter()
     this.handleCenterChange(bounds, center)
    });
      this.setState({map:map})
    //   console.log('creating new map and setting state map')
    }
    handleCenterChange = (bounds, center)=> {
        let newLocation = {
            lat: center.lat(),
            lng: center.lng()
        }
        // console.log("calling getplaces")
        this.getPlaces(newLocation)
    }
    getPlaces(location){
        // TODO 1. pagination to get more places(look into it)
        // TODO 2. Get nearby query from bounding box instead of center of the map
        const request = {
            radius: 1000,
            type: ['restaurant'],
            location: location
          };
            
          if(this.state.map){
            console.log("1 getting nearby places for location:",location)
            let service = new window.google.maps.places.PlacesService(this.state.map);
            service.nearbySearch(request,(results,status)=>{
                console.log(status)
            if(status=="OK"){
                console.log(results);
                this.displayMarkers(results, this.state.map,location)
                this.setState({responseList:<SearchResultList responseList={results}/>})
            }
          })
          }
          else {
            console.log("2 getting nearby places for location:",location)
        
              let that = this
              setTimeout(()=>{
                  let service = new window.google.maps.places.PlacesService(that.state.map);
                  service.nearbySearch(request,(results,status)=>{
                  if(status=="OK"){
                      console.log(results);
                      that.displayMarkers(results, that.state.map,location)
                      that.setState({responseList:<SearchResultList responseList={results}/>})
                  }
                })         
                },1000)
          }
          
    }
    displayMarkers(locationList, map, location){
        
        for(let i=0;i<locationList.length;i++){
            const pos = locationList[i].geometry.location
            const name = locationList[i].name
            // console.log("name:",name,",location:",pos)
            // TODO change icon of markers
            new window.google.maps.Marker({
                position: pos,
                map,
                title: name,
              });
        }
    }
    handleSearch = (searchTerm)=>{
        // console.log('This came from child:', searchTerm)
    }    
    // TODO handle quick refresh of map. Quick refresh leads to the app crashing because the 
    //google object is not ready yet
    render() {
        // console.log(this.state.map)
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

