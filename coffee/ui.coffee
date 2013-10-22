angular.module 'PainterApp', []

angular.module('PainterApp').controller 'PainterCtrl', ($scope) ->
    $scope.painter = {
        images: [
            {url: "img/02.jpg"},
            {url: "img/03.jpg"},
            {url: "img/04.jpg"},
            {url: "img/05.jpg"},
            {url: "img/07.jpg"},
            {url: "img/08.jpg"}
        ]
    }
    $scope.removeImage = (index) ->
        $scope.painter.images.splice(index, 1)
    $scope.addImage = ->
        $scope.painter.images.push { url: '' }

angular.module('PainterApp').directive 'canvasPainter', ->
    (scope, element, attrs) ->
        scope.start = ->
            startPainter element[0], scope.painter.images, (myPainter) ->
                scope.painter = {}
                scope.painter.minSize = myPainter.PS.getValue('Brush.minSize')
                scope.painter.maxSize = myPainter.PS.getValue('Brush.maxSize')
                scope.$watch('painter.maxSize', ()->
                    myPainter.PS.channels['Brush.maxSize'].value = 7
                )

                scope.$watch('painter.minSize', ()->
                    myPainter.PS.channels['Brush.minSize'].value = 7
                )

                scope.$apply()
