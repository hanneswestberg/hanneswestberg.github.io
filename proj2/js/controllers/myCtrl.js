app.controller('myCtrl', function($scope, $http){ 


  var dataManager = new DataManager();
  var currentData = [];

  $scope.selectedCountry = "";
  $scope.originCountry = "";
  $scope.selectCountryValueDifference = "0 %";

  $http.get('data/countries.json')
  	.then(function(res){
  		$scope.countries = res.data.countries;
  })
  
  // Called when the user has selected origin country
  $scope.selectCountry = function(country){

  	// Internal references
  	$scope.originCountry = country;
  	$scope.selectedCountry = country;

  	// Generate the current data
  	currentData = dataManager.calculateAllCountryDifferences(country, 5);

  	// Create the pie chart with the current data
  	createPieChart(currentData, true);

  	// Change view to visualization
  	document.getElementById('countryPicker').style.display = 'none';
  	document.getElementById('countryVisualizer').style.display = 'inline';
    //document.getElementById('slider').style.display = 'inline';
  }

   // Called when we go back from the country visualisation
   $scope.goBack = function(country){

  	removeAllDiffPlots();

    if(document.getElementById('pieChart') != undefined) removePieChart();
    // Change back view to country picker
  	document.getElementById('countryPicker').style.display = 'inline';
    document.getElementById('countryVisualizer').style.display = 'none';
  	document.getElementById('slider').style.display = 'none';
  }

  // Called when the user hovers over an another country than the origin
  $scope.hoverOverCountryCompare = function(countryName){
  	// Update the reference
  	for(var i = 0; i < $scope.countries.length; i++){
  		if($scope.countries[i].name == countryName) $scope.selectedCountry = $scope.countries[i];
  	}

  	// Update the displayed values to correctly reflect the current country the user is hovering over
  	if(countryName != originCountry){
	  	for(var i = 0; i < currentData.length; i++){
	  		if(currentData[i].name == countryName){
	  			$scope.selectCountryValueDifference = Number(currentData[i].diff).toFixed(2) + " %";
	  			removeAllDiffPlots();
	  			createDiffPlots(dataManager.getAnswerDifferences($scope.originCountry.name, countryName), dataManager.getQuestionsCodebook());
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

  $scope.goBackToRoot = function(){
  	console.log("asd");
	createPieChart(currentData, true);
  }

  $scope.getSelectedCountry = function(){
  	return $scope.selectedCountry.name;
  }


  // Just returns the answer data
  $scope.getAllAnswers = function(){
  	return dataManager.getAllAnswers();
  }

});