app.controller('myCtrl', function($scope, $http, $rootScope, $timeout){ 

  // Create the datamanager instance
  var dataManager = new DataManager();
  var currentData = [];
  var continentColorDictionary = {"europe":"#1f77b4", "asia":"#ff7f0e", "africa":"#2ca02c", "north america":"#9467bd", "south america":"#8c564b", "oceania":"#d62728", "mixed":"#777777"};
  var groupCountrySelected = {"name":"Selected Group", "flag":"flag_unknown.png", "continent": "mixed"};

  // Instance variables
  $scope.showQuestionVisualizer = false;
  $scope.showCountryPicker = true;

  $scope.selectedCountriesGroup = [];
  $scope.selectedCountry = "";
  $scope.selectedCountryPopulation = "";

  $scope.originCountry = "";
  $scope.selectCountryValueDifference = "0 %";
  $scope.searchValue = "";
  $scope.currentWave = 5;
  $scope.filteredCountries = [];
  $scope.firstTimeSelectingCountry = true;

  $scope.abTestAsStandard = false;
  $scope.filterByWVSData = true;


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
    for(var i = 0; i < $scope.countries.length; i++){
      // If we are checking too fast and the data has not yet been set, we need to wait
      if(dataManager.countryIsInWave($scope.countries[i].name, $scope.currentWave) == undefined){
        $timeout(filterCountriesByWave, 100);
        break;
      }
      // Else send it to our filtered array
      else if(dataManager.countryIsInWave($scope.countries[i].name, $scope.currentWave)){
        $scope.filteredCountries.push($scope.countries[i]);
      }
    }
    $scope.safeApply();
  }
  
  // Called when we have either selected the country in the country picker or changed wave. Here we update our information about the countries
  $scope.selectCountry = function(country, isWaveChange){
  	// Internal references
  	$scope.originCountry = country;
    if(!isWaveChange)
      $scope.selectedCountry = country;
  	// Generate the current data
  	currentData = dataManager.calculateAllCountryDifferences(country, $scope.currentWave, $scope.filterByWVSData);
    // Get population data
    $scope.selectedCountryPopulation = dataManager.getPopulation($scope.selectedCountry.name, $scope.currentWave);
    if($scope.selectedCountryPopulation == 0 || $scope.selectedCountryPopulation == "nodata") $scope.selectedCountryPopulation = "No data";

  	// Create the pie chart with the current data
  	createPieChart(currentData, true);

    $scope.searchFilter();

  	// Change view to visualization
    $scope.showCountryPicker = false;
    // Check slider colors (which waves did the origin country participate in?)
    $scope.calculateColorForSliderLabels();
    // We select and find info about our selected country

    // If we have a group selected, but no countries in the group, we switch selected country to origin
    if($scope.selectedCountriesGroup.length <= 1 && $scope.selectedCountry.name.includes("Selected")){
      $scope.selectedCountry = $scope.originCountry;
    }
    $scope.hoverOverCountryCompare($scope.selectedCountry.name);
  }

   // Called when we go back from the country visualisation
   $scope.goBack = function(country){
    $(".nano-pane").remove();
    clearAllSelections();
    $scope.showQuestionVisualizer = false;
    if(document.getElementById('pieChart') != undefined) removePieChart();
    $scope.originCountry = "";
    $scope.selectedCountry = "";
    $scope.calculateColorForSliderLabels();
    // Change back view to country picker
    $scope.showCountryPicker = true;
  }


  // Called when the user hovers over an another country than the origin
  $scope.hoverOverCountryCompare = function(countryName){
    $scope.showQuestionVisualizer = true;
  	// Update the reference
  	for(var i = 0; i < $scope.countries.length; i++){
  		if($scope.countries[i].name == countryName) 
        $scope.selectedCountry = $scope.countries[i];
  	}
    // We update the population value of the selected country, unless we already have other countries selected, then we let the group function handle this
    if($scope.selectedCountriesGroup.length <= 1){
      $scope.selectedCountryPopulation = dataManager.getPopulation(countryName, $scope.currentWave);
      if($scope.selectedCountryPopulation == 0 || $scope.selectedCountryPopulation == "nodata") $scope.selectedCountryPopulation = "No data";
    }
  	// Update the displayed values to correctly reflect the current country the user is hovering over
  	if(countryName != $scope.originCountry.name){
	  	for(var i = 0; i < currentData.length; i++){
	  		if(currentData[i].name == countryName){
          $scope.selectCountryValueDifference = (currentData[i].diff == "nodata" || currentData[i].diff == undefined || isNaN(currentData[i].diff)) ? "No data for " + ((currentData[0].diff == "nodata") ? $scope.originCountry.name : $scope.selectedCountry.name ): Number(currentData[i].diff).toFixed(2) + " %";
          createDiffPlots(dataManager.getAnswerDifferences($scope.originCountry.name, countryName), dataManager.getQuestionsCodebook(), dataManager.getQuestionsOrder(), ($scope.abTestAsStandard == true) ? "ab": "diff", $scope.firstTimeSelectingCountry);
          $scope.firstTimeSelectingCountry = false;
          $(".nano").nanoScroller({
            sliderMaxHeight: 100,
            alwaysVisible: true
          });
	  		}
	  	}
  	}
  	// If the country that the user is hovering over is the origin country
  	else{
      createDiffPlots(dataManager.getAnswerDifferences($scope.originCountry.name, countryName), dataManager.getQuestionsCodebook(), dataManager.getQuestionsOrder(), ($scope.abTestAsStandard == true) ? "ab": "diff", $scope.firstTimeSelectingCountry);
      $scope.selectCountryValueDifference = "0 %";
      $scope.firstTimeSelectingCountry = false;
  	}
  	// Apply the changes
    $scope.safeApply();
  }

  // This function updates the UI to represent the selected group
  $scope.groupSelection = function(countryGroup){
    // If we have a valid selection
    if(countryGroup != undefined && countryGroup.length > 1){
      $scope.selectedCountry = groupCountrySelected;
      // We declare temporary variables and set standard names
      groupCountrySelected.name = countryGroup.length + " Selected Countries";
      groupCountrySelected.continent = "";
      var pop = 0;
      var continent = "";
      var valuesTot = 0;
      // Then we calculate the selected group's population, values differences and continent
      for(var n = 0; n < countryGroup.length; n++){
        for (var c = 0; c < currentData.length; c++){
          if(countryGroup[n] == currentData[c].name){
            if(groupCountrySelected.continent == "") groupCountrySelected.continent = currentData[c].continent;
            else if(groupCountrySelected.continent != currentData[c].continent) groupCountrySelected.continent = "mixed";
            if(currentData[c].pop != "nodata" && currentData[c].pop != undefined && !isNaN(currentData[c].pop)) 
              pop += currentData[c].pop;
            valuesTot += currentData[c].diff;
          }
        }
      }
      // Divide with total countries to get correct mean value
      valuesTot = (valuesTot / countryGroup.length);
      $scope.selectedCountryPopulation = pop;
      $scope.selectCountryValueDifference = (valuesTot == undefined || isNaN(valuesTot)) ? "No data for " + $scope.originCountry.name : Number(valuesTot).toFixed(2) + " %";
      // Apply the changes
      $scope.safeApply();
    }
  }


  // Called from pieChart, this is the selected group that we need to calculate the mean difference of
  $scope.selectGroupToFilter = function(countryGroup){
    $scope.selectedCountriesGroup = countryGroup;
    createDiffPlots(dataManager.getGroupAnswerDifferences($scope.originCountry.name, countryGroup), dataManager.getQuestionsCodebook(), dataManager.getQuestionsOrder(), ($scope.abTestAsStandard == true) ? "groupab": "group", $scope.firstTimeSelectingCountry);
  }

  // Called when the user changes the interval in the slider. It filters out the correct data to display
  $scope.changeWave = function(waveID){
    $scope.currentWave = waveID;
    filterCountriesByWave();
    //clearAllSelections("group");
    // If we are in the country select screen
    if($scope.originCountry == ""){
      $scope.safeApply();
    }else{
      $scope.selectCountry(currentData[0], true);
    }
  }

  // Called when searching. The function finds any reference country or continent and filters them
  $scope.searchFilter = function(){
    if($scope.searchValue == "") return;
    var nameArray = [];
    for(var i = 1; i < currentData.length; i++){
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
      if (found || $scope.searchValue.toLowerCase() == "all") {
        nameArray.push(currentData[i].name);
      }
    }
    selectSearchedCountries(nameArray);
  }

  // Toggles the option to filter the WVSData
  $scope.toggleFilterByWVSData = function(){
    $scope.filterByWVSData = !$scope.filterByWVSData;
    clearAllSelections("group", true);
    //$scope.searchValue = "";
    //$scope.selectedCountriesGroup = [];
    $scope.selectCountry(currentData[0], true);
    

    $scope.safeApply();
    //console.log("WVS filter is now " + $scope.abTestAsStandard);
  }

    // Toggles the option to filter the WVSData
  $scope.toggleABtestAsStandard = function(){
    $scope.abTestAsStandard = !$scope.abTestAsStandard;
    //console.log("ab standard is now " + $scope.abTestAsStandard);
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
    $scope.searchValue = "";
    clearAllSelections("group");
	  createPieChart(currentData, true);
    $scope.hoverOverCountryCompare($scope.originCountry.name);
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
      var el = ($scope.originCountry == "") ? $('<label class="sliderLabel">'+ans[i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%') : dataManager.countryIsInWave($scope.originCountry.name, i) ? $('<label class="sliderLabel">'+ans[i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%') : $('<label class="sliderLabel" style="color: #D3000C">'+ans[i].interval+'<br><label class="sliderLabel" style="color: #D3000C; left:0px; position:absolute;">No Value Data</label></label>').css('bottom',(-10 + i/vals*100)+'%');
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

  $scope.safeApply = function(fn) {
  var phase = this.$root.$$phase;
  if(phase == '$apply' || phase == '$digest') {
    if(fn && (typeof(fn) === 'function')) {
      fn();
    }
  } else {
    this.$apply(fn);
  }
};

  // Let's load the data on start
  loadData();
});

