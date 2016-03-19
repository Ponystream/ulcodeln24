ulcodeIn24.controller('MapController', ['$scope', '$http', 'villeCurrent', function($scope, $http, villeCurrent){

    villeCurrent.ville = "Nancy";
    $scope.theme = "";
    $scope.markers = [];
    var map = L.map('map');
    var circle = L.circle();

    var getCoord = function(){
        // on récupère la position de la ville souhaitée
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+villeCurrent.ville, false);
        xhr.send();
        var response = JSON.parse(xhr.response);
        if(response.status == "OK"){
            console.log(response);
            //villeCurrent.ville = response.results[0].address_components[2].short_name;
            villeCurrent.lat = response.results[0].geometry.location.lat;
            console.log(villeCurrent.lat);
            villeCurrent.lon = response.results[0].geometry.location.lng;
            console.log(villeCurrent.lon);
            return true;
        }else{
            return false;
        }
    };

    var init = function(){
        // on affiche la carte
        map.remove();
        map = L.map('map').setView([villeCurrent.lat, villeCurrent.lon], 15);
        marker = L.marker([villeCurrent.lat, villeCurrent.lon]).addTo(map);
        marker.bindPopup(villeCurrent.ville).openPopup();

        //Ajout d'un layer de carte
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    };

    $scope.afficheTransport = function (){
        omnivore.kml('web/kml/Arrets.kml').addTo(map);

    };

    $scope.$watch('range', function(newvalue){
        map.removeLayer(circle);
        circle = L.circle([villeCurrent.lat, villeCurrent.lon], $scope.range*100, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
    });

    // on click on submit Place search button
    var submit = document.getElementById("submitPlace");
    submit.onclick = function(){
        villeCurrent.ville = document.getElementById("inputPlace").value;
        if(villeCurrent.ville == ""){
            alert("Veuillez saisir un nom de ville");
        }else{
            if(getCoord()){
                init();
            }else{
                alert("ville inconnue");
            }
        }
    };

    var addMarkers = function(){
        if($scope.markers != []){
            $scope.markers.forEach(function(mark){
                marker = L.marker([mark.geometry.location.lat, mark.geometry.location.lng]).addTo(map);
                marker.bindPopup(mark.name).openPopup();
            })
        }
    };

    // on click on submit Place search button
    var submitTheme = document.getElementById("submitTheme");
    submitTheme.onclick = function(){
        $scope.theme = document.getElementById("inputTheme").value;
        if($scope.theme == ""){
            alert("Veuillez saisir un theme");
        }else{
            if(villeCurrent.ville != []){
                console.log(villeCurrent.ville);
                $http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+villeCurrent.lat+"%2C"+villeCurrent.lon+"&radius="+$scope.range*10+"&name="+$scope.theme+"&key=AIzaSyD1Lsn0Qz9Tmaij6ET1yukF5vhEXC5FQVM").
                success(function(data, status, headers, config) {
                    data.results.forEach(function(value) {
                        $scope.markers.push(value);
                    });
                    console.log($scope.markers);
                    addMarkers();
                }).
                error(function(data, status, headers, config) {
                    $scope.error = true;
                });
            }else{
                alert("Veuillez renseigner une ville");
            }
        }
    };

    var meLocaliser = function () {
        
    }

    getCoord();
    init();
    //photoLayer.add(photos).addTo(map);
    //map.fitBounds(photoLayer.getBounds());

}]);