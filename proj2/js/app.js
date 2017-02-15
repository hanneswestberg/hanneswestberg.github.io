var app = angular.module('myApp', ['filters']);

angular.module('filters', []).
filter('textOrNumber', function ($filter) {
    return function (input, fractionSize) {
        if (isNaN(input)) {
            return input;
        } else {
            return $filter('number')(input, fractionSize);
        };
    };
});

