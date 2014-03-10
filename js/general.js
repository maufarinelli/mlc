/**
* Format a string
*/
String.prototype.format = function(){
    var args = arguments;
    return this.replace(/\{(\d)\}/g, function(a,b){
        return typeof args[b] != 'undefined' ? args[b] : a;
    });
};


/**
 * The trim method returns the string stripped of whitespace from both ends. trim does not affect the value of the string itself.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}


/*
*
 attach the .compare method to Array's prototype to call it on any array */
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}


