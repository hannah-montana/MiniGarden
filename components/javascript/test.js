var app = angular.module('carousel.demo', ['ngAnimate', 'ui.bootstrap']);

app.controller('CarouselDemoCtrl', ['$scope', function ($scope) {
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/300',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittens', 'Felines', 'Cuties'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }

  $scope.getActiveSlide = function () {
    var activeSlide = slides.filter(function (s) {
      return s.active;
    })[0];

    alert(slides.indexOf(activeSlide));

  };

  $scope.setActiveSlide = function (idx) {
    $scope.slides[idx].active=true;
  };

}]);


/*app.directive('carouselControls', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.goNext = function() {
        element.isolateScope().next();
      };
      scope.goPrev = function() {
        element.isolateScope().prev();
      };

    }
  };
});*/