'use strict';
var availableCourses = [
{
        title: 'Pine Valley Golf Club',
        placeID: 'ChIJB6XVuczSxokRdvQHd3QKESc',
        yrOpen: '1918',
        designer: 'George Crump & H.S. Colt',
        rank: '2nd',
        clickCount: 0,
        location: {
            lat: 39.7872,
            lng: -74.9717
        }
    }, {
        title: 'Shinnecock Hills Golf Club',
        placeID: 'ChIJ8xH7VUKT6IkRKIhnO0YTcrA',
        yrOpen: '1931',
        designer: 'William Flynn',
        rank: '4th',
        clickCount: 0,
        location: {
            lat: 40.8964,
            lng: -72.4406
        }
      },
   {
        title: 'Augusta National Golf Club',
        placeID: 'ChIJ7Xan6J_N-YgRFwW5YgE4m1E',
        yrOpen: '1933',
        designer: 'Alister Mackenzie & Bobby Jones',
        rank: '1st',
        clickCount: 0,
        location: {
            lat: 33.5021,
            lng: -82.0226
        }
    }, {
        title: 'Cypress Point Club',
        placeID: 'ChIJ2TGzAxXnjYAR2OyxYHT7j4s',
        yrOpen: '1928',
        designer: 'Alister Mackenzie',
        rank: '3rd',
        clickCount: 0,
        location: {
            lat: 36.5791272,
            lng: -121.9638452
        }
    }, {
        title: 'National Golf Links of America',
        placeID: 'ChIJgy66UwuT6IkRy0Kvdj_gIcM',
        yrOpen: '1911',
        designer: 'C.B. Macdonald',
        rank: '8th',
        clickCount: 0,
        location: {
            lat: 40.7195264,
            lng: -74.0089934
        }
    }, {
        title: 'Merion Golf Club',
        placeID: 'ChIJFUQC8WnAxokRnMsYFU9RVkk',
        yrOpen: '1912',
        designer: 'Hugh Wilson',
        rank: '5th',
        clickCount: 0,
        location: {
            lat: 40.0019,
            lng: -75.3118
        }
    }, {
        title: 'Oakmont Country Club',
        placeID: 'ChIJHZpKxqGUNIgRaIYteBDKAdk',
        yrOpen: '1903',
        designer: 'Henry Fownes',
        rank: '6th',
        clickCount: 0,
        location: {
            lat: 40.5259,
            lng: -79.8269
        }
    }, {
        title: 'Pebble Beach Golf Links',
        placeID: 'ChIJdYZu-gDnjYARjqanasXFetE',
        yrOpen: '1919',
        designer: 'Jack Neville & Douglas Grant',
        rank: '7th',
        clickCount: 0,
        location: {
            lat: 36.5688,
            lng: -121.9506
        }
    }, {
        title: 'Winged Foot Golf Club',
        placeID: 'ChIJ1YqpR4eRwokRTuazxMrnKiM',
        yrOpen: '1911',
        designer: 'A.W. Tillinghast',
        rank: '9th',
        clickCount: 0,
        location: {
            lat: 40.9577,
            lng: -73.7535
        }
    }, {
        title: 'Fishers Island Club',
        placeID: 'ChIJtTFDQqTi5YkRvi9Tc0j0_vA',
        yrOpen: '1923',
        designer: 'Seth Raynor & Charles Banks',
        rank: '10th',
        clickCount: 0,
        location: {
            lat: 41.2799,
            lng: -71.9488
        }
      }
];

var map;

    var Course = function(data) {
      var self = this;
        this.title = data.title;
        this.rank = data.rank;
        this.location = data.location;
        this.wikiLink = "";
        this.yrOpen = data.yrOpen;
        this.designer = data.designer;
        this.location = data.location;
        this.wikiInfo = "";
        this.visible = ko.observable(true);

// var wikiUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+ this.title +"&callback=?";
var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.title +  '&format=json';
// Assign handlers immediately after making the request,
// and remember the jqXHR object for this request
var showPopUp = false;
var jqxhr = $.ajax({
              type: "GET",
              url: wikiUrl,
              contentType: "application/jsonp; charset=utf-8; image/jpg",
              async: false,
              dataType: "jsonp"
            })
            .done(function(data, textStatus, jqXHR) {
              // var str = data.parse.title;
              // str = str.replace(/\s/g,'_');
              // self.wikiLink = "https://en.wikipedia.org/wiki/" + str;
              // self.wikiInfo = data.parse.text["*"];
              self.wikiLink = data[3] || 'No information available';
              self.wikiInfo = data[2] || 'No information available';
              console.log(data);
             })
            .fail(function() {
                if(!showPopUp){
                    alert( "Loading error. Please try again." );
                    showPopUp = true;
                }
            })

        this.infoWindow = new google.maps.InfoWindow({content: self.information});

        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

        this.marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.location),
                map: map,
                title: data.title,
                animation: google.maps.Animation.DROP,
                icon: iconBase + 'golf_maps.png'
        });

        this.showMarker = ko.computed(function() {
            if(this.visible() === true) {
                this.marker.setMap(map);
            } else {
                this.marker.setMap(null);
            }
            return true;
        }, this);

        this.marker.addListener('click', function(){
             self.information =
             '<div class="window">' +
             '<div class="wikiLink"><a href='+ self.wikiLink +'>' + data.title + "</a></div>" +
             '<div class="designer">Course Architect: '+ data.designer + "</div>" +
             '<div class="rank">Course Rank: '+ data.rank + "</div>" +
             '<div class="year">Year Opened: '+ data.yrOpen + "</div>" +
             '<div class="wikipedia">'+ self.wikiInfo + "</div></div>";


            self.infoWindow.setContent(self.information);
            self.infoWindow.open(map, this);

            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 3000);
        });

        this.bounce = function() {
            google.maps.event.trigger(self.marker, 'click');
        };

    };



              /*// Create a styles array to use with the map.*/
var styles = [
  {
    featureType: 'water',
    stylers: [
      { color: '#0009FF' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { weight: 6 }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#061F01' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -40 }
    ]
  },{
    featureType: 'transit.station',
    stylers: [
      { weight: 9 },
      { hue: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'on' },
      { color: '#f0e4d3' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -25 }
    ]
  }
];



    function viewModel() {
        var self = this;
        this.searchTerm = ko.observable("");
        this.courseList = ko.observableArray([]);

        map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                styles: styles,
                center: {lat: 39.8282, lng: -98.5795}
        });

        availableCourses.forEach(function(location){
            self.courseList.push( new Course(location));
        });

        this.filteredList = ko.computed( function() {
            return ko.utils.arrayFilter(self.courseList(), function(location) {
                var string = location.title.toLowerCase();
                var searchItem = self.searchTerm().toLowerCase();
                var searchedCourse = (string.search(searchItem) >= 0);
                location.visible(searchedCourse);
                return searchedCourse;
            });
        }, self);

    };

    //don't forget to add this line when using knockout or it will not work
function initMap() {
    ko.applyBindings(new viewModel());
}

function onError() {
    alert("Page failed to load.");
}
