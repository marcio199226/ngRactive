(function (window, Ractive) {
	'use strict';
    
    Ractive.adaptors.NgPromise = {
        filter: (object, keypath, ractive) => {
            return object instanceof Promise;
        },
        wrap: (ractive, object, keypath, prefixer) => {
            ractive.set('loading', true);
            
            var promiseWrapper = {
                resolved: data => {
                    ractive.set('loading', false);
                    ractive.set(keypath, data);
                },
                rejected: error => {
                    ractive.set('loading', false);
                    ractive.set(keypath, null); 
                },
                progress: prog => {
                    ractive.set('loading', true);
                    ractive.set('progress', prog);
                }
            }
            
            object.then(promiseWrapper.resolved, promiseWrapper.rejected, promiseWrapper.progress);
            
            return {
                get: () => {},
                set: (prop, val) => {},
                reset: (data) => {
                    return false;  
                },
                teardown: () => {
                    ractive.fire('promise:resolved');
                }
            }
        }
    }

})(window, Ractive);
