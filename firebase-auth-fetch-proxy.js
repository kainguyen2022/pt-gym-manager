// Keep Firebase Auth API calls on the app origin. Some embedded/mobile
// browsers block the cross-origin POST made after the Google callback.
(function proxyFirebaseAuthRequests() {
    var originalFetch = window.fetch.bind(window);
    var authProxies = [
        ['https://identitytoolkit.googleapis.com/', '/__/identitytoolkit/'],
        ['https://securetoken.googleapis.com/', '/__/securetoken/']
    ];

    window.fetch = function(input, init) {
        var requestUrl = typeof input === 'string'
            ? input
            : (input instanceof URL ? input.toString() : input && input.url);
        var proxy = authProxies.find(function(entry) {
            return requestUrl && requestUrl.startsWith(entry[0]);
        });

        if (!proxy) return originalFetch(input, init);

        var proxyUrl = proxy[1] + requestUrl.slice(proxy[0].length);
        if (typeof Request !== 'undefined' && input instanceof Request) {
            return originalFetch(new Request(proxyUrl, input), init);
        }
        return originalFetch(proxyUrl, init);
    };
})();
