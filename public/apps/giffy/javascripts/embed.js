var app = angular.module('embed', ['ngRoute', 'templates-main'])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/search',
        {
            templateUrl: 'search.tpl.html',
            controller: 'search.ctrl'
        });

    $routeProvider.otherwise({redirectTo: '/search'});

}]);

app.controller('search.ctrl', ['$scope', '$rootScope', 'search.service', '$log', '$http',
    function ($scope, $rootScope, searchService, $log, $http) {

        $scope.$watch('query', function(newValue, oldValue, $scope){

            console.log("in search:" + newValue);

            if (!newValue){
                return;
            }

            $http.get("https://api.giphy.com/v1/gifs/search?q=" + encodeURIComponent(newValue) + "&limit=12&api_key=dc6zaTOxFJmzC")
                .then(function(response){

                    console.log("data:" + response.data.data);
                    $scope.images = response.data.data;
                });
        });

        $scope.selectImage = function(selectedImage){

            osapi.jive.core.container.closeApp({
                data:{
                    display: {
                        type: "image",
                        previewImage: selectedImage.images.fixed_height.url,
                        label: selectedImage.images.fixed_height.url
                    },
                    target: {
                        type: "embed",
                        view: "embedded"
                    }
                }
            });
        };
    }
]);

app.factory('search.service',
    ['$q', '$log', function ($q, $log) {

        var config = {};

        var services = {};

        services.getCanApprove = function() {
            var deferred = $q.defer();

            return deferred.promise;
        };

        return services;
}]);


gadgets.util.registerOnLoadHandler(function() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['embed'], [{
            strictDi: true
        }]);
    });

    gadgets.window.adjustHeight(280);
    gadgets.window.adjustWidth(800);
    gadgets.window.setTitle("Giffy");
});


