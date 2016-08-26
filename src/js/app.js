
var Model = {
    shops:[
      {title:'Ipsum', content:'<p>Hello world</p>', location: {lat: 52.511, lng: 13.447}},
      {title:'Lorem', content:'<p>Hello gurl</p>', location: {lat: 52.549, lng: 13.422}},
      {title:'Solom', content:'<p>Hello pup</p>', location: {lat: 52.497, lng: 13.396}},
      {title:'Florem', content:'<p>Hello tinha</p>', location: {lat: 52.517, lng: 13.394}},
      {title:'Deplorem', content:'<p>Marhaba</p>', location: {lat: 52.530, lng: 13.400}}
    ]//,
    //markers:[]
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

  // self.search = function(){
  //   var searchVal = self.searchQuery().toLowerCase();
  //     Model.shops.forEach(function(item){
  //       item.marker.setVisible(false);
  //       if (item.title.toLowerCase().indexOf(searchVal) >= 0){
  //         self.shops.push(item);
  //       }
  //     });
  //};

  self.search = ko.pureComputed(function(){

    return ko.utils.arrayFilter(self.shops(), function(item){

      // Check if searchQuery matches shop array title
      var match = item.title.toLowerCase().indexOf(self.searchQuery().toLowerCase()) >= 0;

      // Show marker
      item.marker.setVisible(match);

      return match;

    });

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

    // Add marker and infowindow properties to shops array
    // For easy access to marker and infowindow outside of initMap()
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

}; //initMap



