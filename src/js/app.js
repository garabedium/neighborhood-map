
var Model = {
    shops:[
      {title:'Ipsum', content:'<p>Hello world</p>', location: {lat: 52.511, lng: 13.447}},
      {title:'Lorem', content:'<p>Hello gurl</p>', location: {lat: 52.549, lng: 13.422}},
      {title:'Solom', content:'<p>Hello pup</p>', location: {lat: 52.497, lng: 13.396}},
      {title:'Florem', content:'<p>Hello tinha</p>', location: {lat: 52.517, lng: 13.394}},
      {title:'Deplorem', content:'<p>Marhaba</p>', location: {lat: 52.530, lng: 13.400}}
      //{title:'Testem', content:'<p>Testor</p>', location: {lat: 52.30, lng: 13.388}}
    ],
    markers:[]
};

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
    console.log('houston, something something');
  } else {
    console.log('something else')
  }
}

 var places = [
  {"title" : "apple"},
  {"title" : "lemon"},
  {"title" : "orange"}
];

function ViewModel(){
  var self = this;

  self.appName = ko.observable('Neighborhood Map');
  self.locations = ko.observableArray(Model.shops);
  self.searchQuery = ko.observable('');

  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.locations(), function(loc){
      return loc.title.toLowerCase().indexOf(self.searchQuery().toLowerCase()) >= 0;
    });
  });

};

function initMap() {

    var map, mapOptions;

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

    // Push marker to blank markers array
    Model.markers.push(marker);

    // Click event to open infowindows
    marker.addListener('click', function() {
      infowindow.setContent(this.title + this.content);
      infowindow.open(map, this);
    });

    bounds.extend(Model.markers[i].position);

  }
    map.fitBounds(bounds);
};





