var apiResult = [];
fetch('http://datamall2.mytransport.sg/ltaodataservice/ERPRates', {
        headers: {
            'AccountKey': 'Rw0Uw3VZSbWxftB7mWrZDA==',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        // mode: 'no-cors'
    })
    .then(response => {
        console.log(response.status);
        return response.json();
    })
    .then(data => {
        apiResult = data.value;
        sendToTabs(apiResult);
    })
    .catch(error => console.error(error));

function sendToTabs(data) {
    chrome.tabs.onActivated.addListener(tab => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            var activeTab = tabs[0];
            if (activeTab.url.match("https://www.google.com/maps/dir/*")) {
                chrome.scripting.executeScript({
                    target : {tabId : activeTab.id},
                    func: loadAPI
                })
                .then(() => {
                    console.log('func injected');
                    chrome.tabs.sendMessage(activeTab.id, {data: JSON.stringify(data)}, function(response) {
                        console.log(response);
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
            }
        });
    });
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
        libraries: "maps"
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });
}
