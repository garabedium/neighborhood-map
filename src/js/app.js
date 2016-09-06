
var Model = {
  shops:[
    {title:'Bike House', foursquare_id: '55ce7fa6498eba4dad0a3907', location: {lat: -23.5630337, lng: -46.6908191}},
    {title:'Vela Bikes', foursquare_id: '', location: {lat: -23.5601576, lng: -46.6821728}},
    {title:'Avanti Bike', foursquare_id: '4e468a8762e148603b732c4a', location: {lat: -23.5999037, lng: -46.6667808}},
    {title:'Bike Tech Jardins', foursquare_id: '4bc619776c26b713e74cecf3', location: {lat: -23.5613691, lng: -46.6690169}},
    {title:'Pedal Urbano', foursquare_id: '4ccb248797d0224bdf6e57b8', location: {lat: -23.5477529, lng: -46.688361}},
    {title:'Ciclo Bianchini', foursquare_id: '4c4b3fec959220a176194e0f', location: {lat: -23.577449, lng: -46.642862}},
    {title:'Las Magrelas', foursquare_id: '55973b17498ec0e201f6c7ec', location: {lat: -23.5619013, lng: -46.6806354}},
  ]
};

// Global Variables
var map,
    mapOptions;

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
  } else if (input === 'foursquare'){
    console.log('something else')
  }
}

function ViewModel(){

  var self = this;

  self.appName = ko.observable('Neighborhood Map');
  self.shops = ko.observableArray(Model.shops);
  self.searchQuery = ko.observable('');

  // Show infoWindow on list view click
  self.setInfoWindow = function(){
      this.infowindow.setContent(this.title);
      //this.infowindow.setContent(self.shops.foursquare_data.location.address);
      this.infowindow.open(map, this.marker);
  };

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
        foursquareId = data.foursquare_id,
        position = data.location;

    var marker = new google.maps.Marker({
        map: map,
        title: title,
        //content: content,
        animation: google.maps.Animation.DROP,
        position: position
    });

        // Add properties to the model: marker, infowindow, ajax calls etc.
        data.marker = marker;
        data.infowindow = infowindow;
        data.ajax = new ajaxCall(foursquareId,i);

    // Click event to open infowindows and content
    marker.addListener('click', function() {
      infowindow.setContent(this.title + Model.shops[0].foursquare_data.name);
      infowindow.open(map, this);
    });

    bounds.extend(data.marker.position);

  }
    map.fitBounds(bounds);

}; //initMap

function ajaxCall(foursquareId,index){

    // Run ajax request only if a foursquare_id exists for the shop
    if (foursquareId !== ''){

      var xhr = new XMLHttpRequest();

      var apiBase = 'https://api.foursquare.com/v2/venues/',
          apiClientId = '&client_id=' + 'UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3',
          apiClientSecret = '&client_secret=' + 'XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1',
          apiVersion = '&v=' + 20130815,
          apiVenueId = ''+ foursquareId + '/?' + '',
          apiCall = ''+ apiBase + apiVenueId + apiClientId + apiClientSecret + apiVersion +'';

      xhr.open('GET', apiCall);
      xhr.onload = function() {
          if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);
                  data = data.response.venue;

                Model.shops[index].foursquare_data = data;
          }
          else {
              //alert('Request failed. Returned status of ' + xhr.status);
              apiFallback('foursquare');
          }
      };
      xhr.send();

    } else {
      // do nothing
    }

};



// ex call: https://api.foursquare.com/v2/venues/55973b17498ec0e201f6c7ec/?&client_id=UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3&client_secret=XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1&v=20130815
// tips: Model.shops[6].ajaxResponse.tips.groups[0].items[i].text
// hours: data.hours
// Get address and hours
// http://jsonviewer.stack.hu/#api.foursquare.com/v2/venues/55973b17498ec0e201f6c7ec/?&client_id=UAFFBB0O2TLTR0OFPRTCUIVPIWOQN14LCJLAQQUUNGQQYFR3&client_secret=XAZIFQIDGV5SIFNSLJVEPRHOPRO3WNCI0GUNXLZAIDPOSIS1&v=20130815

