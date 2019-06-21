<? include_once('../modules/header.php') ?>
    <? include_once('../modules/breadcrumbs.php') ?>

    <script>
        let mapStyle = [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {"saturation": -100},
                {"lightness": 45}
            ]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {"color": "#46bcec"},
                {"visibility": "on"}
            ]
        }],
        placeholder = 'images/ico/place-large.png',
        panByX = 150,
        panByY = 0;

        check();
        window.initMap = construct;

        function check() {
            let winWidth = document.body.clientWidth;

            if (winWidth <= 768) {
                panByX = 0;
                panByY = 0;
                placeholder = 'images/ico/place-small.png';
            } else if (winWidth <= 1024) {
                panByX = 0;
                panByY = 0;
                placeholder = 'images/ico/place-medium.png';
            } else if (winWidth <= 1366) {
                panByX = 0;
                panByY = 0;
                placeholder = 'images/ico/place-large.png';
            } else if (winWidth <= 1560) {
                panByX = 0;
                panByY = 0;
            }
        }

        function construct() {
            let map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: {lat: 55.79101, lng: 37.7162281},
                disableDefaultUI: true,
                styles: mapStyle
            }),
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(55.79101, 37.7162281),
                icon: placeholder,
                map: map,
                title: "ул. Преображенский вал, 25"
            });

            map.panBy(panByX,panByY);
        }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAW5waRqX6v-9byeN0ppkdgxdLG-8MotM4&callback=initMap"></script>

<? include_once('../modules/footer.php') ?>