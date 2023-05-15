const ZONE_TO_COORDS = {
    'BMC': [{lat: 1.3005263362230397, lng: 103.85583275268641},
        {lat: 1.2999092030454833, lng: 103.8621207006758},
        {lat: 1.3029124666264758, lng: 103.85365918418863},
        {lat: 1.3012176721253224, lng: 103.8548903518221},
        {lat: 1.2997512511638774, lng: 103.8565549973619},
        {lat: 1.298158616349834, lng: 103.85791932683249},
        {lat: 1.2960356710080247, lng: 103.85972242588532},
        {lat: 1.2960572079900348, lng: 103.86245504096738},
        {lat: 1.2930136137382038, lng: 103.84396608286198}],
    'AY1': [{lat: 1.286646614437966, lng: 103.7967555427439}]
};

if (document.readyState !== 'loading') {
    console.log('dom loaded');
    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('dom loaded');
        main();
    });
}

function main() {
    var apiResult = [];
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        apiResult = JSON.parse(message.data);
        if (apiResult != null && apiResult != undefined && apiResult.length > 0) {
            sendResponse({message: 'API data received successfully'});
            loadAPI().then(() => {
                processData(apiResult);
            })
        }
    });

    function processData(apiResult) {
        var testingResult = [];
        for(let i = 0; i < apiResult.length; i++) {
            if (new Date(apiResult[i].EffectiveDate).getTime() > new Date().getTime()) {
                continue;
            }
            if (apiResult[i].ZoneID == 'AY1' || apiResult[i].ZoneID == 'BMC') {
                testingResult.push(apiResult[i]);
            }
        }
        console.log(testingResult);

        checkRoutes(testingResult);
    }
}

function checkRoutes(ERPList) {
    var omnibox = document.querySelector('#omnibox-directions');
    var juLCidInputs = omnibox.querySelectorAll('.JuLCid input');

    var origin = juLCidInputs[0].getAttribute('aria-label');
    var words = origin.split(' ');
    origin = words.slice(2, -1).join(' ');
    var destination = juLCidInputs[1].getAttribute('aria-label');
    var words = destination.split(' ');
    destination = words.slice(1, -1).join(' ');

    console.log(origin);
    console.log(destination);

    calculateRouteCosts(origin, destination, ERPList);
}

function calculateRouteCosts(origin, destination, ERPList) {
    console.log(google.maps.importLibrary);
    google.maps.importLibrary('maps').then(() => {
        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING // Change the travel mode as needed (DRIVING, WALKING, BICYCLING, TRANSIT)
        };
        console.log(directionsService);
    })

    // directionsService.route(request, function(response, status) {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //         var routes = response.routes;
    //         console.log(routes);
    //     } else {
    //         console.error('Error:', status);
    //     }
    // });

}

async function loadAPI() {
    const foo = (g) => {
        var h, a, k, p = "The Google Maps JavaScript API",
        c = "google",
        l = "importLibrary",
        q = "__ib__",
        m = document,
        b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
        r = new Set,
        e = new URLSearchParams,
        u = () => h || (h = new Promise(async (f, n) => {
        await(a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => h = n(Error(p + " could not load."));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a)
        }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    };

    foo({
        key: "AIzaSyCm77Fg5y6QruUhBnbRSk2vDKTMS_HFI60",
        v: "weekly",
        libraries: "routes"
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });
}
