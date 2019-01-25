var result = document.getElementById("result");
var list = document.getElementById("list");
var title = document.getElementById("title");
var speech = document.getElementById("partOfSpeech");
var noRes = document.getElementsByClassName("noRes")[0];

function dispNode(node, setting) {
    node.style.display = setting;
    }

    function setTextNode(node, text) {
    node.innerHTML = text;
}
window.onload = function() {
    dispNode(result,"none");
};
async function getData() {
    // Hide result div initially =>
    dispNode(result,"none");

    // Clear previous results, by setting text(innerHTML) of divs =>
    setTextNode(list, "");
    setTextNode(title, "");
    setTextNode(speech, "");
    setTextNode(noRes, "");

    // Getting value typed in by the user =>
    var word = document.getElementById("searchBox").value;

    // CASE 1: Nothing has been typed by the user
    if (word == "" || word == null) {
        setTextNode(
            document.getElementsByClassName("errorMsg")[0],
            "Please enter any word."
        );
    } else {
        // Build API URL =>
        var baseUrl = "https://dictionaryapi.com/api/v3/references/learners/json/";
        var apikey = "6b5f2059-92e7-4761-b787-d7ff3514ae73";
        var query = word;
        var url = baseUrl + query + "?key=" + apikey;

        // Fetch data from the built URL =>
        const def = await fetch(url);

        // Parse the data to JSON, jsonObj(camelCasing) =>
        const jsonObj = await def.json();

        //  Logging Json object to console, to check result =>
        console.log(jsonObj[0]);

        // CASE 2: No such word exists, fetch closest ones, also provided by the API =>
        if (typeof jsonObj[0] == "string") {
            // Suggested words is passed =>
            var sugg = jsonObj[0];

            // Iterate through the jsonObj, and build suggested words list =>
            for (var i = 1; i < jsonObj.length; i++) {
                sugg = sugg + ", " + jsonObj[i];
            }

            // Logging the suggested list =>
            console.log(sugg);

			// Set the results and reflect on page =>
			setTextNode( noRes, "Sorry! No results found. Did you mean any of " + sugg + "?");
			
        } else {
            // CASE 3: Legit word searched, and API returns data, parse JSON =>
            // Access part of speech =>
            var partOfSpeech = jsonObj[0].fl;
            console.log(typeof jsonObj[0]);

            // Access definitons =>
            var defs = [];
            defs = jsonObj[0].shortdef;

			// Build definition output string =>
            var output = "";
            for (var i = 0; i < defs.length; i++) {
                output = output + '<li class="define">' + defs[i] + "</li>";
			}
			
			// Set the results and reflect on page =>
			setTextNode(speech,partOfSpeech);
			setTextNode(list,output);
        }

		setTextNode(title,word);
		dispNode(result,"flex");
    }
}

// window.addEventListener("load",(e) => {
//     console.log("called");
// 	if ('serviceWorker' in navigator) {
// 		try {
// 			navigator.serviceWorker.register('./serviceworker.js');
// 			console.log('SW registered');
// 		} catch (error) {
// 			console.log('SW failed');

// 		}
// 	}
// });

window.addEventListener('load', async e => {
    console.log(navigator.onLine);
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceworker.js');
            console.log('SW registered');
        } catch (error) {
            console.log('SW failed');

        }
    }
   /* if(navigator.onLine){
        navigator.serviceWorker.controller.postMessage("online");
    }
    else
    {
        displayNotification('No Internet','Please connent to a network to search a new word');
        navigator.serviceWorker.controller.postMessage("offline");
    }
    // await getData();*/
});
