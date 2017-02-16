app.controller('myCtrl', function($scope, $http, $rootScope, $timeout){ 

  // Create the datamanager instance
  var dataManager = new DataManager();
  var currentData = [];
  var continentColorDictionary = {"europe":"#1f77b4", "asia":"#ff7f0e", "africa":"#2ca02c", "north america":"#9467bd", "south america":"#8c564b", "oceania":"#d62728"};


  // Instance variables
  $scope.selectedCountry = "";
  $scope.selectedCountryPopulation = "";
  $scope.originCountry = "";
  $scope.selectCountryValueDifference = "0 %";
  $scope.searchValue = "";
  $scope.currentWave = 5;
  $scope.filteredCountries = [];

  // Sets the data for the countries
  function loadData(){ 
    // We tell the dataManager to start loading the data, when jQuery has loaded
    defer(dataManager.loadData);
    // Then we start waiting
    waitUntilFinishedLoading();
    // We must check that we have the correct data
    function waitUntilFinishedLoading(){
      // Get the data
      $scope.countries = dataManager.getAllCountries();
      // Check if its there
      if ($scope.countries.length != 0){
        // Activate the slider when jquery has loaded
        defer(createWaveSlider);
        // Then we filter the countries to display
        filterCountriesByWave();
      }
      else{
        // Recusivly call this function until we have the correct data
        setTimeout(function() { waitUntilFinishedLoading() }, 50);
      }
    }
  }

  // Creates the slider, using jQuery
  function createWaveSlider(){
    $scope.waveSlider = $("#slider").slider({
        orientation:"vertical",
        value: 5,
        min: 0,
        max: 5,
        step: 1,
        slide: function(event, ui){
          $scope.changeWave(ui.value);
        }
    })
    .each(function() {
      var opt = $(this).data().uiSlider.options;
      var vals = opt.max - opt.min;
      for (var i = vals; i >= 0; i--) {
        var intervals = ["1981-1984", "1990-1994", "1995-1998", "1999-2004", "2005-2009", "2010-2014"];
        var el = $('<label class="sliderLabel">'+intervals[i] +'</label>').css('bottom',(-10 + i/vals*100)+'%');
        $("#slider").append(el);
      }
    });
  }

  // Filters all the countries by which are in the currently selected wave
  function filterCountriesByWave(){
    $scope.filteredCountries = [];
    for(var i = 0; i < $scope.countries.length-1; i++){
      if(dataManager.countryIsInWave($scope.countries[i].name, $scope.currentWave)) $scope.filteredCountries.push($scope.countries[i]);
    }
    $scope.$apply();
  }
  
  // Called when the user has selected origin country
  $scope.selectCountry = function(country){
  	// Internal references
  	$scope.originCountry = country;
  	$scope.selectedCountry = country;
  	// Generate the current data
  	currentData = dataManager.calculateAllCountryDifferences(country, $scope.currentWave);
    // Get population data
    $scope.selectedCountryPopulation = dataManager.getPopulation(country.name, $scope.currentWave);
    if($scope.selectedCountryPopulation == 0 || $scope.selectedCountryPopulation == "nodata") $scope.selectedCountryPopulation = "No data";
  	// Create the pie chart with the current data
  	createPieChart(currentData, true);
  	// Change view to visualization
  	document.getElementById('countryPicker').style.display = 'none';
  	document.getElementById('countryVisualizer').style.display = 'inline';
    // Check slider colors (which waves did the origin country participate in?)
    $scope.calculateColorForSliderLabels();
  }


   // Called when we go back from the country visualisation
   $scope.goBack = function(country){
  	removeAllDiffPlots();
    if(document.getElementById('pieChart') != undefined) removePieChart();
    $scope.originCountry = "";
    $scope.calculateColorForSliderLabels();
    // Change back view to country picker
  	document.getElementById('countryPicker').style.display = 'inline';
    document.getElementById('countryVisualizer').style.display = 'none';
  }


  // Called when the user hovers over an another country than the origin
  $scope.hoverOverCountryCompare = function(countryName){
  	// Update the reference
  	for(var i = 0; i < $scope.countries.length; i++){
  		if($scope.countries[i].name == countryName) $scope.selectedCountry = $scope.countries[i];
  	}
    $scope.selectedCountryPopulation = dataManager.getPopulation(countryName, $scope.currentWave);
    if($scope.selectedCountryPopulation == 0 || $scope.selectedCountryPopulation == "nodata") $scope.selectedCountryPopulation = "No data";
  	// Update the displayed values to correctly reflect the current country the user is hovering over
  	if(countryName != originCountry){
	  	for(var i = 0; i < currentData.length; i++){
	  		if(currentData[i].name == countryName){
          $scope.selectCountryValueDifference = (currentData[i].diff == "nodata" || currentData[i].diff == undefined || isNaN(currentData[i].diff)) ? "No data for " + $scope.originCountry.name : Number(currentData[i].diff).toFixed(2) + " %";
	  			removeAllDiffPlots();
	  			createDiffPlots(dataManager.getAnswerDifferences($scope.originCountry.name, countryName), dataManager.getQuestionsInWave());
	  		}
	  	}
  	}
  	// If the country that the user is hovering over is the origin country
  	else{
	  	removeAllDiffPlots();
      $scope.selectCountryValueDifference = "0 %";
  	}
  	// Apply the changes
  	$scope.$apply();
  }

  // Called when the user changes the interval in the slider. It filters out the correct data to display
  $scope.changeWave = function(waveID){
    $scope.currentWave = waveID;
    filterCountriesByWave();
    // If we are in the country select screen
    if($scope.originCountry == ""){
      $scope.$apply();
    }else{
      $scope.selectCountry(currentData[0]);
      $scope.hoverOverCountryCompare(originCountry);
    }
  }

  // Called when searching. The function finds any reference country or continent and filters them
  $scope.searchFilter = function(){
    if($scope.searchValue == "") return;
    var filteredData = [];
    filteredData.push(currentData[0]);
    for(var i = 0; i < currentData.length-1; i++){
      var found = true;
      if($scope.searchValue){
        found = false;
        if(currentData[i].continent.indexOf($scope.searchValue.toLowerCase()) != -1){
          found = true;
        }
        if(currentData[i].name.toLowerCase().indexOf($scope.searchValue.toLowerCase()) != -1){
          found = true;
        }
      }
      if (found) {
        filteredData.push(currentData[i]);
      }
    }
    createPieChart(filteredData, false);
  }

  // A CSS function that checks if value lacks any data
  $scope.checkIfNoData = function(myValue){
    return (myValue == 0 || myValue == "No data") ? { 'color':'#D3000C' } : { 'color':'#44862B' };
  }

  // Changes the color for the origin country if there is no data
  $scope.checkIfNoDataForOriginCountry = function(myValue){
    return (myValue.indexOf("No data") != -1) ? { 'color':'#D3000C' } : { 'color':'#FFCA00' };
  }

  $scope.getContinentColor = function(myValue){
    return {'color': continentColorDictionary[myValue]};
  }

  // Goes back to the root
  $scope.goBackToRoot = function(){
	 createPieChart(currentData, true);
  }

  // Returns the name of the selected country
  $scope.getSelectedCountry = function(){
  	return $scope.selectedCountry.name;
  }

  $scope.getPopulationData = function(){
    return dataManager.getAllCountries();
  }

  // Returns the answer data
  $scope.getAllAnswers = function(){
  	return dataManager.getAllAnswers();
  }

  // Checks if the question labels should be red or white
  $scope.calculateColorForSliderLabels = function(){
    $(".sliderLabel").remove();
    var opt = $scope.waveSlider.data().uiSlider.options;
    var vals = opt.max - opt.min;
    for (var i = vals; i >= 0; i--) {
      var ans = dataManager.getAllAnswers();
      var el = ($scope.originCountry == "") ? $('<label class="sliderLabel">'+ans[i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%') : dataManager.countryIsInWave($scope.originCountry.name, i) ? $('<label class="sliderLabel">'+ans[i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%') : $('<label class="sliderLabel" style="color: #D3000C">'+ans[i].interval+'<br><label class="sliderLabel" style="color: #D3000C; left:10px; position:absolute;">No Data</label></label>').css('bottom',(-10 + i/vals*100)+'%');
      $("#slider").append(el);
    }
  }

  // Waits until jQuery has loaded, then fires the method
  function defer(method) {
    if (window.jQuery)
      method();
    else
      setTimeout(function() { defer(method) }, 50);
  }

  // Let's load the data on start
  loadData();
});

