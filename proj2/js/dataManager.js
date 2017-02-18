function DataManager(){

	// Instance variables
	var dataUrl = "data/";
	var questionsCodebook = [];
	var questionsOrder = [];
	var countries = [];
	var population = [];
	var allAnswers = [];
	var answerDifferencesArray = [];
	var questionsInWave = [];

	// Loads all data
	this.loadData = function(){
		// Load the questions codebook
		$.getJSON(dataUrl + "questionsCodebook.json", function(json) {
			questionsCodebook = json.questions;
			questionsOrder = json.categories;
		});
		// Load the countries
		$.getJSON(dataUrl + "countries.json", function(json) {
			countries = json.countries;
		});
		// Load population
		$.getJSON(dataUrl + "population.json", function(json) {
	    	population = json;
		});
		// Load all the answers
		$.getJSON(dataUrl + "values.json", function(json) {
	    	allAnswers = json.all;
		});
	}

	// This function calculates the value differences from the origin country and returns the data
	this.calculateAllCountryDifferences = function(originCountry, wave){
		// Temporary arrays
		var originCountryAnswers = [];
		var totalCountryDifferencesArray = [];
		// Clear previous data
		answerDifferencesArray = [];
		tempOriginAnswerArray = [];
		questionsInWave = []; // Not used at the moment
		// First find the originCountry answers
		for(var questionId = 0; questionId < Object.keys(allAnswers[wave].questions).length; questionId++){
			if(allAnswers[wave].questions[questionId].answers[originCountry.name] != undefined){
				originCountryAnswers.push(allAnswers[wave].questions[questionId].answers[originCountry.name]);
				tempOriginAnswerArray.push({question: allAnswers[wave].questions[questionId].id, ans: allAnswers[wave].questions[questionId].answers[originCountry.name]});
			}
			else{
				originCountryAnswers.push("nodata");
				tempOriginAnswerArray.push({question: allAnswers[wave].questions[questionId].id, ans: "nodata"});
			}
		}
		// First index is the origin country
		totalCountryDifferencesArray.push({ name:originCountry.name, diff:0, pop: population[originCountry.name][wave], continent: originCountry.continent});
		answerDifferencesArray.push({ name:originCountry.name, questions:tempOriginAnswerArray});
		// Then we calculate the difference for each country
		for(var countryId = 0; countryId < countries.length; countryId++){
			// We aviod the origin country, as we already have it's data
			if(countries[countryId].name != originCountry.name) {
				// The total differnce
				var totalMeanDifference = 0;
				var countryQuestionAnswers = [];
				var boolCountryIsInWave = true;
				// Let's check each question
				for(var questionId = 0; questionId < questionsCodebook.length; questionId++){
					// If the question has been asked in this wave AND the origin country has answered this question in this wave 
					if(this.questionIsInWave(questionsCodebook[questionId].id, wave) && originCountryAnswers[questionId] != "nodata"){
						// If current country has answered this question in this wave 
						if(allAnswers[wave].questions[questionId].answers[countries[countryId].name] != undefined){
							// The question difference
							var questionMeanDifference = 0;
							var questionDifference = {};
							// Let's check each answer
							for(var answerId = 0; answerId < Object.keys(questionsCodebook[questionId].answers).length; answerId++){
								// If the question is actually a question, otherwise we don't need to calculate the difference
								if(questionsCodebook[questionId].type == "question"){
									// We add the absolute value of the difference
									questionMeanDifference += (originCountryAnswers[0] != undefined) ? Math.abs(originCountryAnswers[questionId][Object.keys(questionsCodebook[questionId].answers)[answerId]] - allAnswers[wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]]) : 0;
								}
								// We also store the difference for each answers
								var key = Object.keys(questionsCodebook[questionId].answers)[answerId];
								questionDifference[key] = (originCountryAnswers[0] != undefined) ? allAnswers[wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]] - originCountryAnswers[questionId][Object.keys(questionsCodebook[questionId].answers)[answerId]] : "nodata";
							}
							// Store the country answers and the differences to the origin country
							countryQuestionAnswers.push({ question:questionsCodebook[questionId].id, diff:questionDifference, ans:allAnswers[wave].questions[questionId].answers[countries[countryId].name] });
							// Then we divide with number of answers to get the question mean value difference
							if(questionsCodebook[questionId].type == "question"){
								questionMeanDifference = (questionMeanDifference / Object.keys(questionsCodebook[questionId].answers).length);
								totalMeanDifference += questionMeanDifference;
							}
						}
						else{
							// We must check if the wave lacks data about this question, otherwise this country is not in the current wave
							if(allAnswers[wave].questions[questionId].answers != "nodata") boolCountryIsInWave = false; 
						}
					}
					else{
						if(this.questionIsInWave(questionsCodebook[questionId].id, wave))
							countryQuestionAnswers.push({ question:questionsCodebook[questionId].id, diff:"nodata", ans:allAnswers[wave].questions[questionId].answers[countries[countryId].name] });
						else
							countryQuestionAnswers.push({ question:questionsCodebook[questionId].id, diff:"nodata", ans:"nodata" });
					}
				}
				// Then we divide with number of questions to get the total mean value difference
				totalMeanDifference = (boolCountryIsInWave && countryQuestionAnswers[0].diff == "nodata") ? "nodata" : (totalMeanDifference / questionsCodebook.length);
				// We try to get population data
				var countryPopulation;
				if(population[countries[countryId].name] == undefined){
					console.log("No population data for " + countries[countryId].name + "!!! Go and add it NAOW");
					countryPopulation = "nodata";
				}else{
					countryPopulation = (population[countries[countryId].name][wave] == null) ? "nodata" : population[countries[countryId].name][wave];
				}
				// Then add to our array of differences
				if(boolCountryIsInWave && this.countryIsInWave(countries[countryId].name, wave)){
					totalCountryDifferencesArray.push({ name:countries[countryId].name, diff:totalMeanDifference, pop: countryPopulation, continent: countries[countryId].continent});
					answerDifferencesArray.push({ name:countries[countryId].name, questions:countryQuestionAnswers});
				}
			}
		}
		// Then we return the data to the controller
		return totalCountryDifferencesArray;
	}

	// Called only AFTER the user has selected origin country, so we don't have to worry about that
	this.getAnswerDifferences = function(originCountry, compareCountry){
		var retArray = [];
		// First find origin country
		for(var i = 0; i < answerDifferencesArray.length; i++){
			if(answerDifferencesArray[i].name == originCountry){
				retArray.push(answerDifferencesArray[i]);
			}
		}
		// Then compareCountry
		for(var i = 0; i < answerDifferencesArray.length; i++){
			if(answerDifferencesArray[i].name == compareCountry){
				retArray.push(answerDifferencesArray[i]);
			}
		}
		return retArray;
	}

	this.getGroupAnswerDifferences = function(originCountry, groupCountriesArray){
		var retArray = [];
		// Fist we find the origin country
		for(var i = 0; i < answerDifferencesArray.length; i++){
			if(answerDifferencesArray[i].name == originCountry){
				retArray.push(answerDifferencesArray[i]);
				break;
			}
		}
		// Add a random non origin country with the diff array already defined
		for(var i = 0; i < answerDifferencesArray.length; i++){
			if(answerDifferencesArray[i].name != originCountry){
				retArray.push(answerDifferencesArray[i]);
				break;
			}
		}
 		// Then we find all countries in the group
		var groupAnswersArray = [];
		for(var i = 0; i < answerDifferencesArray.length; i++){
			if(groupCountriesArray.includes(answerDifferencesArray[i].name))
				groupAnswersArray.push(answerDifferencesArray[i]);
		}
		retArray[1].name = "Selected Group";
		// Then we take the mean difference value of the group
		for(var q = 0; q < questionsCodebook.length; q++){
			// For each question
			var qAnsArray = [];
			for(var a = 0; a < Object.keys(questionsCodebook[q].answers).length; a++){
				// For each answer
				var aAnsTot = 0;
				var aAnsMean = 0;
				var aAnsDiff = 0;
				for(var i = 0; i < groupAnswersArray.length; i++){
					aAnsTot += groupAnswersArray[i].questions[q].ans[Object.keys(questionsCodebook[q].answers)[a]];
				}
				aAnsMean = aAnsTot / groupAnswersArray.length;
				aAnsDiff = retArray[0].questions[q].ans[Object.keys(questionsCodebook[q].answers)[a]] - aAnsMean;
				retArray[1].questions[q].ans[Object.keys(questionsCodebook[q].answers)[a]] = aAnsMean;
				retArray[1].questions[q].diff[Object.keys(questionsCodebook[q].answers)[a]] = aAnsDiff;
			}

		}
		// Lastly we add all the selected countries answers if we need to display it somewhere
		retArray.push(groupAnswersArray);
		return retArray;
	}

	// Checks and returs if a question is in the current wave
	this.questionIsInWave = function(qID, wID){
		for(var i = 0; i < allAnswers[wID].questions.length; i++){
			if(allAnswers[wID].questions[i].id == qID && allAnswers[wID].questions[i].answers != "nodata") return true;
		}
		return false;
	}

	// Checks and returs if a country is in the current wave
	this.countryIsInWave = function(countryName, wID){
		//var isInWave = false;
		// If we are too fast and the data has not yet been loaded
		if(allAnswers[wID] == undefined){
			return undefined;
		}
		else{
			if(allAnswers[wID].questions[0] != undefined){
				return (allAnswers[wID].questions[0].answers[countryName] != undefined)
				/*
				for(var q = 0; q < allAnswers[wID].questions.length; q++){
					if(allAnswers[wID].questions[q].answers[countryName] != undefined){
						isInWave = true;
						break;
					} 
				}*/
			}
			else{ console.log("This wave has no questions?! Something must have gone wrong"); }
		}
		//return isInWave;
	}

	// Returns the questions in the currently selected wave
	this.getQuestionsInWave = function(){
		return questionsInWave;
	}

	// Returns the codebook
	this.getQuestionsCodebook = function(){
		return questionsCodebook;
	}

	// Returns the question order
	this.getQuestionsOrder = function(){
		return questionsOrder;
	}

	// Returns all answers
	this.getAllAnswers = function(){
		return allAnswers;
	}

	// Returns all countries
	this.getAllCountries = function(){
		return countries;
	}

	// Returns the population
	this.getPopulation = function(country, wave){
		// We make sure that we return the correct value if you either send in the country object or just the name
		return (country.name == undefined) ? population[country][wave] : population[country.name][wave];
	}

	// Return this instance to the controller
	return this;
}