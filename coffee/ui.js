// Generated by CoffeeScript 1.6.3
angular.module('PainterApp', ['uiSlider']);

angular.module('PainterApp').controller('PainterCtrl', function($scope) {
  $scope.painter = {
    images: [
      {
        url: "img/02.jpg"
      }, {
        url: "img/03.jpg"
      }, {
        url: "img/04.jpg"
      }, {
        url: "img/05.jpg"
      }, {
        url: "img/07.jpg"
      }, {
        url: "img/08.jpg"
      }
    ]
  };
  $scope.brushTypes = ['circle', 'scircle', 'square', 'weird', 'sort'];
  $scope.brushMovements = ['Random', 'Static'];
  $scope.removeImage = function(index) {
    return $scope.painter.images.splice(index, 1);
  };
  return $scope.addImage = function() {
    return $scope.painter.images.push({
      url: ''
    });
  };
});

angular.module('PainterApp').directive('canvasPainter', function() {
  return function(scope, element, attrs) {
    window.$s = scope;
    return scope.start = function() {
      return startPainter(element[0], scope.painter.images, function(myPainter) {
        var list, name, _fn, _i, _len;
        scope.painter = {
          hasLoaded: true
        };
        list = myPainter.PS.getAllChannels();
        _fn = function(name) {
          myPainter.PS.subscribe(name, 'gui', function(value) {
            scope.painter[name] = value;
            return scope.$apply();
          });
          scope.painter[name] = myPainter.PS.getValue(name);
          if (name === 'brushMinSize' || name === 'brushMaxSize') {
            return scope.$watch('painter.' + name, function() {
              return myPainter.PS.setValue(name, 'gui', +scope.painter[name]);
            });
          } else {
            return scope.$watch('painter.' + name, function() {
              return myPainter.PS.setValue(name, 'gui', scope.painter[name]);
            });
          }
        };
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          name = list[_i];
          _fn(name);
        }
        return scope.$apply();
      });
    };
  };
});