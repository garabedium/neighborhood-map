
// Data
var Model = {
  shops:[
    {title:'Bike House', foursquare_id: '55ce7fa6498eba4dad0a3907', location: {lat: -23.5630337, lng: -46.6908191}},
    {title:'Avanti Bike', foursquare_id: '4e468a8762e148603b732c4a', location: {lat: -23.5999037, lng: -46.6667808}},
    {title:'Bike Tech Jardins', foursquare_id: '4bc619776c26b713e74cecf3', location: {lat: -23.5613691, lng: -46.6690169}},
    {title:'Pedal Urbano', foursquare_id: '4ccb248797d0224bdf6e57b8', location: {lat: -23.5477529, lng: -46.688361}},
    {title:'Indy Bike Paraiso', foursquare_id: '4c4b3fec959220a176194e0f', location: {lat: -23.577449, lng: -46.642862}},
    {title:'Las Magrelas', foursquare_id: '55973b17498ec0e201f6c7ec', location: {lat: -23.5619013, lng: -46.6806354}},
  ]
};

// Sort shops array A-Z
Model.shops.sort(function (first, second) { return first.title > second.title ? 1 : -1 });

// Global Variables
var map,
    mapOptions,
    infowindow,
    bounds,
    geocoder,
    defaultIcon,
    activeIcon;

    defaultIcon = 'https://www.google.com/mapfiles/marker.png';
    activeIcon = 'https://www.google.com/mapfiles/marker_green.png';

  // If gmaps API loads, start our map and apply Knockout bindings
  // Else, show the user an error message
  function initApp(){
    if (typeof google !== 'undefined'){
      initMap();
      ko.applyBindings(new ViewModel());
    } else {
      errorHandler('gmaps');
    }
  };

  function errorHandler(input){
    var errorWrapper = document.getElementById('errors'),
        errorMaps = document.getElementById('error-map'),
        errorFoursquare = document.getElementById('error-foursquare');

        // Show the error wrapper
        errorWrapper.className="";

      if (input === 'gmaps'){
        errorMaps.className="error";
      } else if (input === 'foursquare'){
        errorFoursquare.className="error";
      }
  };

  function ViewModel(){

    var self = this;

    self.shops = ko.observableArray(Model.shops);
    self.searchQuery = ko.observable('');

    // Show infoWindow on list view click
    self.setInfoWindow = function(){
        setInfoWindowContent(this.marker);
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

          // Run ajax call which fetches foursquare data
          // and stores in foursquare_data object
          new ajaxCall(foursquareId,i);

      var marker = new google.maps.Marker({
          map: map,
          title: title,
          animation: google.maps.Animation.DROP,
          position: position,
          icon: defaultIcon
      });

          // Add properties to the model: marker, infowindow
          data.marker = marker;
          data.infowindow = infowindow;

      // Click marker to open infowindow
      marker.addListener('click', function() {
        setInfoWindowContent(this);
      });

      bounds.extend(data.marker.position);

    }
      map.fitBounds(bounds);

  };

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
                errorHandler('foursquare');
            }
        };
        xhr.send();

      } else {
        // do nothing
      }

  };

  function setInfoWindowContent(input){

    // Reset marker color
    // Then highlight our current marker
    function resetMarkerColor(){
      for (var i = 0; i < Model.shops.length; i++) {
         Model.shops[i].marker.setIcon(defaultIcon);
      }
    }; resetMarkerColor();

    input.setIcon(activeIcon);

    google.maps.event.addListener(infowindow,'closeclick',function(){
      input.setIcon(defaultIcon);
    });

    var infoWindowTemplate = document.createElement('div'),
        contentList = document.createElement('ul');
        infoWindowTemplate.className = "window-content";

    var markerData = [
      {data: input.title},
      {label: 'Address', data: input.foursquare_data.location.address},
      {label: 'Rating', data: input.foursquare_data.rating},
    ];

    // Check if hours parent is undefined
    // If it's defined, grab hours.status and add it to markerData
    // This prevents fatal errors in addInfoWindowContent
    if (input.foursquare_data.hours !== undefined){
      var newObject = {label: 'Status', data: input.foursquare_data.hours.status};
      markerData.push(newObject);
    }

    function addInfoWindowContent(){
      markerData.forEach(function(item, i){

        var label = item.label,
            data = item.data,
            labelData = '';

          if (data !== undefined){

            if (i == 0){
              labelData = '<h2>' + data + '</h2>';
            } else {
              labelData = '<strong>' + label + '</strong>' + ": " + data;
            }

            contentItem = document.createElement('li');
            contentItem.innerHTML = labelData;

            contentList.appendChild(contentItem);
            infoWindowTemplate.appendChild(contentList);

          } else {
            // do nothing
          }

        });
    }; addInfoWindowContent();

      infowindow.setContent(infoWindowTemplate);
      infowindow.open(map, input);
  }