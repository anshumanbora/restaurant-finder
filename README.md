# README

## AllTrails at Lunch

### Overview

This is a react app to find places to eat on a map.

#### Supported features

1. Users have the ability to search for cuisines, names of restaurants or just the kind of food they are interested in.
2. The results of their searches would be displayed in two ways. The location would be marked on the map using a dropped pin. The details about the results would show up as a list of cards.
3. They can save their favorite places. The restaurants which are marked favorite are persisted in the browsers localStorage and as long as they don't clear their caches they should be able to find their favorite restaurants when looking through their options.
4. Once they have put in a search term in the Search bar, new places would pop up on the map as they move and
interact with the map.
5. The app is responsive and should work for screens of all sizes.(Tested on a browser only)

### The Code
Majority of the React code could be found under `app/javascript/components`.
Since I'm very new to Rails and took help from a tutorial to setup the Rails part.
Here are a few tutorials that came handy:
*  [Tutorial 1](https://guides.rubyonrails.org/getting_started.html)

*  [Tutorial 2](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-project-with-a-react-frontend)

#### Tools & Technologies
1. Ruby on Rails
2. React JS
3. Google Places API

 
### Running it Locally

  

#### Prerequisites
Make sure you have the following installed on your system:
* Ruby `2.6.3`
* Node `v14.9.0`, npm `6.14.8`, yarn `1.22.10`
* psql (PostgreSQL) `13.2`
note : I had setup the psql initially hoping to work on some API integration but I didn't have the bandwidth to cover it under the list of implemented features.

#### Commands
1. Installing React packages
`yarn install`
2. Starting the server
`rails s --binding=127.0.0.1`

At this point the app should be running on `http://localhost:3000`.
In case you want to play around with the code, please use prettier to format the code:
`yarn prettier --write "app/javascript/components/*/*"`

### Video Walkthrough
[Link](https://youtu.be/3TFCroREs6Y)
###  Goals discussion
- When it comes to the main tasks, I think I did a decent enough job in achieving the basic functionalities described under supported features above.

#### Shortcomings
 - I kind of underestimated some aspects of the google maps API (e.g. markers) and took too much time making it to work. This led to loss of a significant amount of time I had previously allocated for working on the CSS/styling. As, a result the end result of the app is not as good as I had hoped for. My background is in the sciences but I like to believe that I have an eye for the creative/design side of things. And I would be lying if I would grade this anything higher than 5/10 in terms of design.
 - I was really looking forward to getting my feet wet with designing some cool backend stuff with Rails but couldn't find the time to do so. 
 Here is what my rough idea was for implementing a backend API for saving favorites. 
	- Table
	  - Table name : Users
	  - Attributes : (PK) username - text, favorites - text [ ]
	Since the length of the favorites array should be pretty small, keeping it as an attribute in the same table should ensure that the read/write time is really fast for queries.        
	 - API endpoints
		  -  user (Create, Delete, Update)
		  -  favorites/user   (Get, Set)
- I was also not able to do the stretch goals of labelling the center of the map after a reverse Geocoding call to the google API and multiple languages adaptability due to my limited bandwidth. I have worked with The Geocoding API before and I assume the potential implementation should be straightforward.  