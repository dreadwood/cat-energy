var map;
    function initMap() {
      map = new google.maps.Map(document.querySelector('.map__google'), {
        center: { lat: 59.938647, lng: 30.323080 },
        zoom: 17,
        disableDefaultUI: true,
        styles: [
          {
            "featureType": "poi.business",
            "stylers": [{"visibility": "off"}]
          }
        ]
      });

      map.panBy(0, -53);

      var image = {
        url: 'img/map-pin.png',
        size: new google.maps.Size(124, 106)
        // ,
        // origin: new google.maps.Point(0, 0),
        // anchor: new google.maps.Point(17, 34),
        // scaledSize: new google.maps.Size(55, 53)
      };

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(59.938647, 30.323080),
        icon: image,
        map: map, // где располагается
        title: 'Кэт энерджи', // подпись
        animation: google.maps.Animation.DROP // анимация падания
      });
    }
