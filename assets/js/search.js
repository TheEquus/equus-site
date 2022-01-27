// based entirely on https://gist.github.com/cmod/5410eae147e4318164258742dd053993
window.addEventListener("load", function() {
  var fuse;
  var firstRun = true;
  var maininput = document.getElementById('searchInput');
  var save = document.getElementById("posts").innerHTML;

  maininput.value="";
  maininput.addEventListener("input", function() {loadSearch(maininput.value)});

  // Get JSON files
  function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
    httpRequest.open('GET', path);
    httpRequest.send();
  }

  // Prepare search results
  function loadSearch(input) {
    // Only update index.json once
    if (firstRun) {
      fetchJSONFile('/index.json', function(data){
        var options = {
          shouldSort: true,
          ignoreLocation: true,
          threshold: 0.3,
          minMatchCharLength: 1,
          keys: [
            'title',
            'permalink',
            'description',
            'contents'
          ]
        };
        fuse = new Fuse(data, options);
      });
      firstRun = false;
    };
    if (fuse) {
      executeSearch(input);
    }
  }

  // Do the searching
  function executeSearch(input) {
    if (input) {
      let results = fuse.search(input);
      let searchitems = '';
      if (results.length === 0) {
        searchitems = '';
      } else {
        for (let item in results) {
          let result = results[item].item;
          searchitems = searchitems + '<li><a href="' + result.permalink +
          '" title="' + result.title + ' (' + result.date + ')"><p>' + result.title +
          '</p><time datetime="' + result.date + '">' + result.date + '</time></a>'
        }
      }
      document.getElementById("posts").innerHTML = searchitems;
    } else {
      // restore original posts on empty input
      document.getElementById("posts").innerHTML = save;
    }
  }

});
