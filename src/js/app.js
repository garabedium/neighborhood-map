
var Model = {
  shops:[
    {title:'Bike House', foursquare_id: '55ce7fa6498eba4dad0a3907', location: {lat: -23.5630337, lng: -46.6908191}},
    {title:'Vela Bikes', foursquare_id: '', location: {lat: -23.5601576, lng: -46.6821728}},
    {title:'Avanti Bike', foursquare_id: '4e468a8762e148603b732c4a', location: {lat: -23.5999037, lng: -46.6667808}},
    {title:'Bike Tech Jardins', foursquare_id: '4bc619776c26b713e74cecf3', location: {lat: -23.5613691, lng: -46.6690169}},
    {title:'Pedal Urbano', foursquare_id: '4ccb248797d0224bdf6e57b8', location: {lat: -23.5477529, lng: -46.688361}},
    {title:'Indy Bike Paraiso / Ciclo Bianchini', foursquare_id: '4c4b3fec959220a176194e0f', location: {lat: -23.577449, lng: -46.642862}},
    {title:'Las Magrelas', foursquare_id: '55973b17498ec0e201f6c7ec', location: {lat: -23.5619013, lng: -46.6806354}},
  ]
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
      //this.infowindow.setContent(this.title + this.content);
      this.infowindow.setContent(this.title);
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
        //content = data.content,
        position = data.location;

    var marker = new google.maps.Marker({
        map: map,
        title: title,
        //content: content,
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
      //infowindow.setContent(this.title + this.content);
      infowindow.setContent(this.title);
      infowindow.open(map, this);
    });

    bounds.extend(Model.shops[i].marker.position);

  }
    map.fitBounds(bounds);

}; //initMap


function shopReviews(){
  // Call foursquare api and push review data to Shops array as 'review' property

  //https://api.foursquare.com/v2/venues/search?client_id=UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3&client_secret=XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1&
  //v=20130815&ll=-23.5619013,-46.6806354&query=Las Magrelas
  //   Client id
  // UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3
  // Client secret
  // XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1

  var xhr = new XMLHttpRequest();

  var apiBase = 'https://api.foursquare.com/v2/venues/search?',
      apiClientId = '&client_id=' + 'UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3',
      apiClientSecret = '&client_secret=' + 'XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1',
      apiLatLng = '&ll=' + '-23.5619013,-46.6806354',
      apiVersion = '&v=' + 20130815,
      apiQuery = '&query=' + 'Las Magrelas',
      //apiVenueId = ''+ someVar +'',
      //apiParameters = '/hours',
      apiLimit = '&limit=' + 1;

  xhr.open('GET', ''+ apiBase + apiClientId + apiClientSecret + apiVersion + apiLatLng + apiQuery + apiLimit +'');
  xhr.onload = function() {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
              data = data.response.venues;
              console.log(data);
          data.forEach(function(item) {
            name = item.name;
            site = item.url;
            hours = item.hours;
            console.log(name + " - " + site + " - " + hours);
          });

      }
      else {
          alert('Request failed. Returned status of ' + xhr.status);
      }
  };
  xhr.send();

}; shopReviews();

