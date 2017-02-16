app.controller('myCtrl', function($scope, $http, $rootScope, $timeout){ 


  var dataManager = new DataManager();
  var currentData = [];

  $scope.selectedCountry = "";
  $scope.selectedCountryPopulation = "";
  $scope.originCountry = "";
  $scope.selectCountryValueDifference = "0 %";
  $scope.searchValue = "";

  $scope.currentWave = 5;
  $scope.filteredCountries = [];

  $http.get('data/countries.json')
  	.then(function(res){
  		$scope.countries = res.data.countries;
      $scope.filterCountriesByWave();
  });


  // Filters all the countries by which are in the currently selected wave
  $scope.filterCountriesByWave = function(){
    $scope.filteredCountries = [];
    for(var i = 0; i < $scope.countries.length-1; i++){
      if(dataManager.countryIsInWave($scope.countries[i].name, $scope.currentWave)) $scope.filteredCountries.push($scope.countries[i]);
    }
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
    // Apply the changes
    //$scope.$apply();
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
          if(currentData[i].diff == "nodata" || currentData[i].diff == undefined || isNaN(currentData[i].diff)){
            $scope.selectCountryValueDifference = "No data for " + $scope.originCountry.name;
          }else{
            $scope.selectCountryValueDifference = Number(currentData[i].diff).toFixed(2) + " %";
          }

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

  $scope.changeWave = function(waveID){
    $scope.currentWave = waveID;
    $scope.filterCountriesByWave();

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
    var css;
    if(myValue == 0 || myValue == "No data"){
      css = { 'color':'#D3000C' };
      return css;
    }
    else {
      css = { 'color':'#44862B' };
      return css;
    }
  }

  $scope.checkIfNoDataForOriginCountry = function(myValue){
    var css;
    if(myValue.indexOf("No data") != -1){
      css = { 'color':'#D3000C' };
      return css;
    }
    else {
      css = { 'color':'#FFCA00' };
      return css;
    }
}

  // Goes back to the root
  $scope.goBackToRoot = function(){
	 createPieChart(currentData, true);
  }

  // Returns the name of the selected country
  $scope.getSelectedCountry = function(){
  	return $scope.selectedCountry.name;
  }

  // Just returns the answer data
  $scope.getAllAnswers = function(){
  	return dataManager.getAllAnswers();
  }

  // SLIDER //
  // Activate the slider when the data has loaded
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
      var el = "";

      el = $('<label class="sliderLabel">'+intervals[0] +'</label>').css('bottom',(-10 + i/vals*100)+'%');
      $("#slider").append(el);
    }
  });


  $scope.calculateColorForSliderLabels = function(){
    $(".sliderLabel").remove();

    var opt = $scope.waveSlider.data().uiSlider.options;
    var vals = opt.max - opt.min;
    
    for (var i = vals; i >= 0; i--) {
      var ans = dataManager.getAllAnswers();
      var el = "";

      // We have no country selected, go back to standard settings
      if($scope.originCountry == ""){
        el = $('<label class="sliderLabel">'+ans[0][i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%');
      }
      else{
        el = dataManager.countryIsInWave($scope.originCountry.name, i) ? $('<label class="sliderLabel">'+ans[0][i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%') : $('<label class="sliderLabel" style="color: #D3000C">'+ans[0][i].interval+'</label>').css('bottom',(-10 + i/vals*100)+'%');
      }

      $("#slider").append(el);
    }
  }

});

