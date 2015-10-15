var app = angular.module('embed', ['ngRoute', 'templates-main']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/search',
        {
            templateUrl: 'search.tpl.html',
            controller: 'search.ctrl'
        });

    $routeProvider.otherwise({redirectTo: '/search'});

}]);

app.controller('search.ctrl', ['$scope', '$rootScope', '$log', '$http',
    function ($scope, $rootScope, $log, $http) {

        $scope.$watch('query', function(newValue, oldValue, $scope){
            if (!newValue){
                return;
            }

            $http.get("https://api.giphy.com/v1/gifs/search?q=" + newValue.replace(/ /g, '+') + "&limit=22&api_key=dc6zaTOxFJmzC")
                .then(function(response){
                    if (response && response.data){
                        $scope.images = response.data.data;
                    }
                });
        });

        $scope.selectImage = function(selectedImage){
            osapi.jive.core.container.closeApp({
                data:{
                    display: {
                        type: "image",
                        previewImage: selectedImage.images.fixed_height_downsampled.url,
                        label: selectedImage.url
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

gadgets.util.registerOnLoadHandler(function() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['embed'], [{
            strictDi: true
        }]);
    });

    gadgets.window.adjustHeight(800);
    gadgets.window.adjustWidth(800);
    gadgets.window.setTitle("Giphy");
});


