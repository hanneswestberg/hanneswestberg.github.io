var DataManager = function(){

	// All data goes here
	// 1: Load the questions codebook
	var dataUrl = "data/";
	var questionsCodebook = [];
	$.getJSON(dataUrl + "questionsCodebook.json", function(json) {
		for(var i = 0; i < json.questions.length; i++){
    		questionsCodebook.push(json.questions[i]);
		}
	});

	var countries = [];
	$.getJSON(dataUrl + "countries.json", function(json) {
		for(var i = 0; i < json.countries.length; i++){
			countries.push(json.countries[i])
		}
	});

	// 2: Load all the answers
	var allAnswers = [];
	$.getJSON(dataUrl + "values.json", function(json) {
    	allAnswers.push(json.all);
	});

	var answerDifferencesArray = [];
	// Index c : Countries
		// Index q : Questions
			// Index 0 : Differences
				// Index a : Answer Differences
			// Index 2 : Country
				// Index a : Answers


	this.getQuestionsCodebook = function(){
		return questionsCodebook;
	}

	this.getAllAnswers = function(){
		return allAnswers;
	}

	// This function calculates the value differences from the origin country and returns the data
	this.calculateAllCountryDifferences = function(originCountry, wave){
		var originCountryAnswers = [];
		var totalCountryDifferencesArray = [];

		answerDifferencesArray = [];

		// First find the originCountry answers
		for(var questionId = 0; questionId < Object.keys(allAnswers[0][wave].questions).length; questionId++){
			originCountryAnswers.push(allAnswers[0][wave].questions[questionId].answers[originCountry.name]);
		}

		// Then we calculate the difference for each country
		for(var countryId = 0; countryId < countries.length; countryId++){

			// The total differnce
			var totalMeanDifference = 0;

			var countryQuestionAnswers = [];

			// Let's check each question
			for(var questionId = 0; questionId < questionsCodebook.length; questionId++){
				
				// The question difference
				var questionMeanDifference = 0;
				var questionDifference = {};

				// Let's check each answer
				for(var answerId = 0; answerId < Object.keys(questionsCodebook[questionId].answers).length; answerId++){

					// We add the absolute value of the difference
					questionMeanDifference += Math.abs(originCountryAnswers[0][Object.keys(questionsCodebook[questionId].answers)[answerId]] - allAnswers[0][wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]]);

					var key = Object.keys(questionsCodebook[questionId].answers)[answerId];
					questionDifference[key] = allAnswers[0][wave].questions[questionId].answers[countries[countryId].name][Object.keys(questionsCodebook[questionId].answers)[answerId]] - originCountryAnswers[0][Object.keys(questionsCodebook[questionId].answers)[answerId]];
				}

				countryQuestionAnswers.push({ question:questionsCodebook[questionId].id, diff:questionDifference, ans:allAnswers[0][wave].questions[questionId].answers[countries[countryId].name] });

				// Then we divide with number of answers to get the mean value
				questionMeanDifference = (questionMeanDifference / Object.keys(questionsCodebook[questionId].answers).length);
				totalMeanDifference += questionMeanDifference;
			}

			totalMeanDifference = (totalMeanDifference / questionsCodebook.length);

			// Then add to our array of differences
			totalCountryDifferencesArray.push({ name:countries[countryId].name, diff:totalMeanDifference, pop: 1000, continent: countries[countryId].continent});
		
			answerDifferencesArray.push({ name:countries[countryId].name, questions:countryQuestionAnswers});
		}

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

		//console.log(retArray);
		return retArray;
	}

	return this;
}