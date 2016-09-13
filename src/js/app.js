
var Model = {
  shops:[
    {title:'Bike House', foursquare_id: '55ce7fa6498eba4dad0a3907', location: {lat: -23.5630337, lng: -46.6908191}},
    //{title:'Vela Bikes', foursquare_id: '', location: {lat: -23.5601576, lng: -46.6821728}},
    {title:'Avanti Bike', foursquare_id: '4e468a8762e148603b732c4a', location: {lat: -23.5999037, lng: -46.6667808}},
    {title:'Bike Tech Jardins', foursquare_id: '4bc619776c26b713e74cecf3', location: {lat: -23.5613691, lng: -46.6690169}},
    {title:'Pedal Urbano', foursquare_id: '4ccb248797d0224bdf6e57b8', location: {lat: -23.5477529, lng: -46.688361}},
    {title:'Indy Bike Paraiso', foursquare_id: '4c4b3fec959220a176194e0f', location: {lat: -23.577449, lng: -46.642862}},
    {title:'Las Magrelas', foursquare_id: '55973b17498ec0e201f6c7ec', location: {lat: -23.5619013, lng: -46.6806354}},
  ]
};

// Global Variables
var map,
    mapOptions,
    infowindow,
    bounds,
    geocoder;

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

  self.appName = ko.observable('SP Bike Shopper');
  self.shops = ko.observableArray(Model.shops);
  self.searchQuery = ko.observable('');

  // Show infoWindow on list view click
  self.setInfoWindow = function(){
      this.infowindow.setContent(this.title + this.marker.foursquare_data.location.address);
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

    infowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    geocoder = new google.maps.Geocoder();

  for (var i = 0; i < Model.shops.length; i++) {

    var data =  Model.shops[i],
        title = data.title,
        foursquareId = data.foursquare_id,
        position = data.location;

        // GeoCode expirments
          var latlng = {lat: parseFloat(position.lat), lng: parseFloat(position.lng)};
          geocoder.geocode({'location': latlng}, function(results,status){
          if (status === 'OK') {
            if (results[1]) {
              //console.log(results[1]);
            } else {
              //window.alert('No results found');
            }
          } else {
            //window.alert('Geocoder failed due to: ' + status);
          }
          });

        // Run ajax call which fetches foursquare data
        // and stores in foursquare_data object
        new ajaxCall(foursquareId,i);

    var marker = new google.maps.Marker({
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        position: position
    });

        // Add properties to the model: marker, infowindow
        data.marker = marker;
        data.infowindow = infowindow;

    // Click marker to open infowindow
    marker.addListener('click', function() {
      setInfoWindowContent(this);
      //console.log(this);
      // var rating = this.foursquare_data.rating;

      // function checkData(input){
      //     if (input === undefined){
      //       return "No data here.";
      //     } else {
      //       return input;
      //     }
      // };

      // infoWindowContent = '<div class="window-content">'+
      //                       '<h2>' + this.title + '</h2>' +
      //                       'Address: ' + this.foursquare_data.location.address + '<br/>' +
      //                       //'Neighborhood: ' +
      //                       //'Status: ' + this.foursquare_data.hours.status + '<br/>' +
      //                       // Website
      //                       'Rating: ' + checkData(rating) +
      //                     '</div>';
      // infowindow.setContent(infoWindowContent);
      // infowindow.open(map, this);

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

                Model.shops[index].marker.foursquare_data = data;
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

function setInfoWindowContent(input){

  var infoWindowTemplate = document.createElement('div');
      infoWindowTemplate.className = "window-content";

  var markerData = [
    {data: input.title},
    {label: 'Address', data: input.foursquare_data.location.address},
    {label: 'Rating', data: input.foursquare_data.rating},
  ];

  if (input.foursquare_data.hours !== undefined){
    //console.log(input.foursquare_data.hours.status);
    var newObject = {label: 'Status', data: input.foursquare_data.hours.status};
    markerData.push(newObject);
  }

  function addInfoWindowContent(){

    markerData.forEach(function(item){

      var label = item.label,
          data = item.data,
          labelData = '';

        if (data !== undefined){

          if (label === undefined){
            labelData = data;
          } else {
            labelData = label + " " + data;
          }

          contentItem = document.createElement('li');
          contentItem.innerHTML = labelData;

          infoWindowTemplate.appendChild(contentItem);

        } else {
          // do nothing
        }

      });

  }; addInfoWindowContent();

    infowindow.setContent(infoWindowTemplate);
    infowindow.open(map, input);
}

// [] - Style infowindow
// [] - Use Geocoder to get Shop neighborhood via maps API:         //console.log(geocoder.geocode({position}));
// - How to make infowindow setcontent modular (use for both listview and event marker)



