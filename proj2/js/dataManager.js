var DataManager = function(){

	var dataUrl = "data/";
	var questionsCodebook = [];
	var countries = [];
	var population = [];
	var allAnswers = [];
	var answerDifferencesArray = [];
	var questionsInWave = [];


	this.loadData = function(){
		// All data goes here
		// Load the questions codebook
		$.getJSON(dataUrl + "questionsCodebook.json", function(json) {
			for(var i = 0; i < json.questions.length; i++){
	    		questionsCodebook.push(json.questions[i]);
			}
		});

		// Load the countries
		$.getJSON(dataUrl + "countries.json", function(json) {
			for(var i = 0; i < json.countries.length; i++){
				countries.push(json.countries[i]);
			}
		});

		// Load population
		$.getJSON(dataUrl + "population.json", function(json) {
	    	population = json;
		});

		// Load all the answers
		$.getJSON(dataUrl + "values.json", function(json) {
	    	allAnswers.push(json.all);
		});

		window.allAnswers = allAnswers;
	}

	this.getQuestionsCodebook = function(){
		return questionsCodebook;
	}

	this.getAllAnswers = function(){
		return allAnswers;
	}

	this.getPopulation = function(country, wave){
		// We make sure that we return the correct value if you either send in the country object or just the name
		return (country.name == undefined) ? population[country][wave] : population[country.name][wave];
	}

	// This function calculates the value differences from the origin country and returns the data
	this.calculateAllCountryDifferences = function(originCountry, wave){
		var originCountryAnswers = [];
		var totalCountryDifferencesArray = [];

		answerDifferencesArray = [];
		tempOriginAnswerArray = [];
		questionsInWave = [];

		// First find the originCountry answers
		for(var questionId = 0; questionId < Object.keys(allAnswers[0][wave].questions).length; questionId++){
			if(allAnswers[0][wave].questions[questionId].answers[originCountry.name] != undefined){
				originCountryAnswers.push(allAnswers[0][wave].questions[questionId].answers[originCountry.name]);
				tempOriginAnswerArray.push({question: allAnswers[0][wave].questions[questionId].id, ans: allAnswers[0][wave].questions[questionId].answers[originCountry.name]});
			}
			else{
				originCountryAnswers.push("nodata");
				tempOriginAnswerArray.push({question: allAnswers[0][wave].questions[questionId].id, ans: "nodata"});
			}
		}

		// First index is the origin country
		totalCountryDifferencesArray.push({ name:originCountry.name, diff:0, pop: population[originCountry.name][wave], continent: originCountry.continent});
		answerDifferencesArray.push({ name:originCountry.name, questions:tempOriginAnswerArray});

		// Then we calculate the difference for each country
		for(var countryId = 0; countryId < countries.length; countryId++){

			if(countries[countryId].name != originCountry.name) {

				// The total differnce
				var totalMeanDifference = 0;
				var countryQuestionAnswers = [];
				var boolCountryIsInWave = true;

				// Let's check each question
				for(var questionId = 0; questionId < questionsCodebook.length; questionId++){

					// If the question has been asked in this wave AND the origin country has answered this question in this wave 
					if(this.questionIsInWave(questionsCodebook[questionId].id, wave)){
						if(!questionsInWave.includes(questionsCodebook[questionId]) && originCountryAnswers[questionId] != "nodata")
							questionsInWave.push(questionsCodebook[questionId]);

						// If current country has answered this question in this wave 
						if(boolCountryIsInWave && allAnswers[0][wave].questions[questionId].answers[countries[countryId].name] != undefined){
							
							// If the origin country has answered this question in this wave
							//if(){}
							// The question difference
							var questionMeanDifference = 0;
							var questionDifference = {};

							// Let's check each answer
							for(var answerId = 0; answerId < Object.keys(questionsCodebook[questionId].answers).length; answerId++){

								// We add the absolute value of the difference
								questionMeanDifference += (originCountryAnswers[0] != undefined) ? Math.abs(originCountryAnswers[questionId][Object.keys(questionsCodebook[questionId].answers)[answerId]] - allAnswers[0][wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]]) : 0;

								var key = Object.keys(questionsCodebook[questionId].answers)[answerId];
								questionDifference[key] = (originCountryAnswers[0] != undefined) ? allAnswers[0][wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]] - originCountryAnswers[questionId][Object.keys(questionsCodebook[questionId].answers)[answerId]] : "nodata";
							}

							countryQuestionAnswers.push({ question:questionsCodebook[questionId].id, diff:questionDifference, ans:allAnswers[0][wave].questions[questionId].answers[countries[countryId].name] });

							// Then we divide with number of answers to get the mean value
							questionMeanDifference = (questionMeanDifference / Object.keys(questionsCodebook[questionId].answers).length);
							totalMeanDifference += questionMeanDifference;
						}
						else{ boolCountryIsInWave = false; }
					}
				}

				totalMeanDifference = (totalMeanDifference / questionsCodebook.length);

				var countryPopulation;
				if(population[countries[countryId].name] == undefined){
					console.log("No population data for " + countries[countryId].name + "!!! Go and add it NAOW");
					countryPopulation = "nodata";
				}else{
					countryPopulation = (population[countries[countryId].name][wave] == null) ? "nodata" : population[countries[countryId].name][wave];
				}

				// Then add to our array of differences
				if(boolCountryIsInWave){
					totalCountryDifferencesArray.push({ name:countries[countryId].name, diff:totalMeanDifference, pop: countryPopulation, continent: countries[countryId].continent});
					answerDifferencesArray.push({ name:countries[countryId].name, questions:countryQuestionAnswers});
				}
			}
		}
		//console.log(population);
		//console.dir(totalCountryDifferencesArray);
		//console.log(answerDifferencesArray);
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

	this.getQuestionsInWave = function(){
		return questionsInWave;
	}

	this.questionIsInWave = function(qID, wID){
		for(var i = 0; i < allAnswers[0][wID].questions.length; i++){
			if(allAnswers[0][wID].questions[i].id == qID) return true;
		}
		return false;
	}

	this.countryIsInWave = function(countryName, wID){
		// Let's just check if the country has answered the first question in the wave
		if(allAnswers[0][wID].questions[0] != undefined){
			return (allAnswers[0][wID].questions[0].answers[countryName] != undefined)
		}
		else{ console.log("This wave has no questions?! Something must have gone wrong"); }
	}


	this.whenAvailable = function(name, callback) {
	// Store the interval id
    var intervalId = window.setInterval(function() {
        if (window[name]) {
        		// Clear the interval id
        		window.clearInterval(intervalId);
            // Call back
            callback(window[name]);
        }
    }, 10);
	}

	this.loadData();
	return this;
}