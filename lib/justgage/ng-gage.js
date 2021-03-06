angular.module('ngJustGage', [])
  .directive('justGage', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {
        id: '@',
        class: '@',
        min: '=',
        max: '=',
        value: '@',
        options: '='
      },
      template: '<div id="{{id}}-justgage" class="{{class}}"></div>',
      link: function (scope, element, attrs) {
        $timeout(function () {
          var scoreVal = Math.min(Math.max(Math.round(scope.value*10 + 50),0),100);
          var options = {
            id: scope.id + '-justgage',
            min: scope.min || -5,
            max: scope.max || 5,
            value: scope.value,
            titleLabel: String(scoreVal).concat(":"),
            titleLabel2: String(100-scoreVal)
          };

          if (scope.options) {
              for (var key in scope.options) {
                  options[key] = scope.options[key];
              }
          }

          var graph = new JustGage(options);

          scope.$watch('max', function (updatedMax) {
            if (updatedMax !== undefined) {
              graph.refresh(scope.value, updatedMax);
            }
          }, true);

          scope.$watch('value', function (updatedValue) {
            if (updatedValue !== undefined) {
              graph.refresh(updatedValue);
            }
          }, true);
        });
      }
    };
  }]);
