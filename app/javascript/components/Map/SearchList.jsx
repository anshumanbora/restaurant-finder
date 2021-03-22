import React,{PureComponent} from "react";
import './SearchList.css'

export default class SearchResultList extends PureComponent{
    constructor(props){
        super(props)
    }
    handleFavoriteClick = () => {
        console.log("fav clicked");
    }
    createStarRating(ratings){
        // TODO: create star rating thingy
        let active_star = <img src="/static/assets/star.png" className="Rating--Star Rating--Star__active"></img>
        let passive_star =  <img src="/static/assets/star.png" className="Rating--Star"></img> 
        
        let stars = null;  
        if(ratings){
            let i=0;
            while(i<ratings){
                return (active_star)
                i+=1
            }
            while(i<ratings){
                ratingDiv.join(passive_star);
                i+=1
            }
        }

    let ratingDiv = <div className="Rating" aria-label="Rating of this item is 3 out of 5"></div>
        return 
    }
    createUnitView = (restaurant)=>{
        // TODO Maybe get the price from making individual
        // API call to place details request
        let photo=<img width="100" height="100" alt="No images found" src="https://via.placeholder.com/50"></img>
        if(restaurant.photos){
            photo = <img 
            src={restaurant.photos[0].getUrl()}
            width="100" height="100"
            ></img>
        }
        let favoriteIcon = <svg onClick={this.handleFavoriteClick} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
            <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg>
        let user_ratings_total = restaurant.user_ratings_total?restaurant.user_ratings_total:"No data"
        
        // let start_rating = this.createStarRating(restaurant.rating)
        return(
        <div className="UnitView"
        key={restaurant.place_id}>
            <div className="RestaurantPhoto">{photo}</div>
            <div className="RestaurantDetails">
                <div className="RestaurantName">{restaurant.name}</div>
                <div className="Ratings">
                    <div className="RestaurantRating">{restaurant.start_rating}</div>
                    <div className="RestaurantTotalRating">({user_ratings_total})</div>
                </div>
            </div>
            <div className="Favorite">{favoriteIcon}</div>
            
        </div>)
    }
    createRestaurantList = (responseList) =>{
        let listOfRestaurants = []
        for(let i=0;i<responseList.length;i++){
            listOfRestaurants.push(
                this.createUnitView(responseList[i])
                )
        }
        return listOfRestaurants;
    }
    render(){
        // console.log('inside list making')
        let listOfRestaurants = this.createRestaurantList(this.props.responseList)
        // console.log(list)
        return(
            <div className="SearchResultListContainer">
                {listOfRestaurants}
            </div>
        )
    }
}
