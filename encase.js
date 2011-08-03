function convert(method, conversion){
    var self = this;
    return function(){
        var args = [].slice.call(arguments,0);
        return conversion(method).apply(self,args);
    };
}