
var Model = {
    shops:[
      {title:'Ipsum', content:'<p>Hello world</p>', location: {lat: 52.511, lng: 13.447}},
      {title:'Lorem', content:'<p>Hello gurl</p>', location: {lat: 52.549, lng: 13.422}},
      {title:'Solom', content:'<p>Hello pup</p>', location: {lat: 52.497, lng: 13.396}},
      {title:'Florem', content:'<p>Hello tinha</p>', location: {lat: 52.517, lng: 13.394}},
      {title:'Deplorem', content:'<p>Marhaba</p>', location: {lat: 52.530, lng: 13.400}}
    ],
    markers:[]
};

// Global Variables
var map, mapOptions;

function initApp(){
  // If gmaps API loads, start our map and apply bindings
  if (typeof google !== 'undefined'){
    initMap();
    ko.applyBindings(new ViewModel());
  } else {
    apiFallback('gmaps');
  }
};

function apiFallback(input){
  if (input === 'gmaps'){
    console.log('houston, where is texas?');
  } else {
    console.log('something else')
  }
}

function ViewModel(){
  var self = this;

  self.appName = ko.observable('Neighborhood Map');
  self.shops = ko.observableArray(Model.shops);
  self.searchQuery = ko.observable('');
  self.setInfoWindow = function(){
      this.infowindow.setContent(this.title + this.content);
      this.infowindow.open(map, this.marker);
  };

  // self.clearMarkers = function() {
  //       for (var i = 0; i < self.shops().length; i++) {
  //         self.shops().marker.setMap(null);
  //       }
  //   };

// Marker Search
//

  self.search = ko.pureComputed(function(){

    // not a fan of this solution even though it works:
    // return ko.utils.arrayFilter(self.shops(), function(loc){
    //   return loc.title.toLowerCase().indexOf( self.searchQuery().toLowerCase() ) >= 0;
    //   return alert('something');
    // });

  });

};

function initMap() {

    mapOptions = { mapTypeControl: false };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < Model.shops.length; i++) {

    var data =  Model.shops[i],
        title = data.title,
        content = data.content,
        position = data.location;

    var marker = new google.maps.Marker({
        map: map,
        title: title,
        content: content,
        animation: google.maps.Animation.DROP,
        position: position
    });

    // Add new 'marker' property in shops array with google maps marker object
    Model.shops[i].marker = marker;
    Model.shops[i].infowindow = infowindow;

    // Click event to open infowindows
    // Set infowindow content
    marker.addListener('click', function() {
      infowindow.setContent(this.title + this.content);
      infowindow.open(map, this);
    });

    bounds.extend(Model.shops[i].marker.position);

  }
    map.fitBounds(bounds);

    // var hideMarkers = document.getElementById('hide-markers');
    // var showMarkers = document.getElementById('show-markers');
    // hideMarkers.addEventListener('click', clearMarkers);
    // showMarkers.addEventListener('click', addMarkers);

    // function clearMarkers() {
    //   for (var i = 0; i < Model.shops.length; i++) {
    //     //Model.shops[i].marker.setMap(null);
    //     Model.shops[i].marker.setVisible(false);
    //   }
    // };

    // function addMarkers(){
    //   for (var i = 0; i < Model.shops.length; i++) {
    //     //Model.shops[i].marker.setMap(map);
    //     Model.shops[i].marker.setVisible(true);
    //   }
    // };

}; //initMap

// Open map infowindow when list item is clicked
// Marker already exists in the shops array
// Set event bind on link to build infowindow from list view




