var firstRun = true;


// state 0 = click allergy bar
// state 1 = click no allergy bar
// state 2 = click allergy bar proportion
// state 3 = click no allergy bar proportion
// state 4 = click allergy or no allergy button
// state 5 = fill in more times likely
var state = 0;

var $allergyBar;
var $noAllergyBar;
var allergyBarColor1 = '#7CA1C4';
var allergyBarColor2 = '#CCC';
var noAllergyBarColor1 = '#7CA1C4';
var noAllergyBarColor2 = '#CCC';


var percentWithAllergies;
var	percentWithAllergiesAndOutgoing;
var	percentNoAllergiesAndOutgoing;
var chosenAnswer;
var correctAnswer;
var userTimesMoreLikely;
var correctTimesMoreLikely;

$(function() {
	$allergyBar = $('#allergyBar');
	$noAllergyBar = $('#noAllergyBar');

	createNumbers();
	rangeInteractions();
	instructionsState();
});

// Gives the correct instructions when a range is clicked 
function instructionsState() {
	$allergyBar.on("change", function () {
		if (state === 0) {
			state0Method();
			state++;
		}

		if (state === 2) {
			state2Method();
			state++;
		}
	});

	$noAllergyBar.on("change", function () {
		if (state === 1) {
			state1Method();
			state++;
		}

		if (state === 3) {
			state3Method();
			state++;
		}
	});

	$('body').on('click', 'button', function() {
		if (state === 4 && (this.id === 'allergiesButton' || this.id === 'noAllergiesButton')) {
			state4Method($(this));
			state++;
		}
		
		if (this.id === 'newProblem') {
			reset();
			state = 0;
		}
	});

	$('body').keypress(function (e) {
	  if (e.which == 13 && state === 5) {
	    state5Method();
	  }
	});

}

function state0Method() {
	setTimeout(function(){changeInstructionText('Nice! Now fill in the second range.')}, 250);
}

function state1Method() {
	setTimeout(function(){changeInstructionText(
		'Click in the first range to set the proportion of people with allergies who are outgoing.', 
		 null)}, 250);

	var allergyBarValue = parseInt($allergyBar.val()) / 1000;
	var newAllergyBarCss = {'float': 'left',
													'margin-left': '11%',
													'width': (allergyBarValue * 78) + '%'}
	$allergyBar.css(newAllergyBarCss);
	$allergyBar.val('0');

	var val = (0 - $allergyBar.attr('min')) / ($allergyBar.attr('max') - $allergyBar.attr('min'));
	allergyBarColor1 = '#123';
	allergyBarColor2 = '#7CA1C4';
	styleRange($allergyBar, val, allergyBarColor1, allergyBarColor2);
	$('#noAllergyDiv').css('margin-top', '54px');
}

function state2Method() {
	setTimeout(function(){changeInstructionText(
		'Click in the second range to set the proportion of people without allergies who are outgoing.', 
		 '')}, 250);

	var noAllergyBarValue = parseInt($noAllergyBar.val()) / 1000;
	var newNoAllergyBarCss = {'float': 'left',
													'margin-left': '11%',
													'width': (noAllergyBarValue * 78) + '%'}
	$noAllergyBar.css(newNoAllergyBarCss);
	$noAllergyBar.val('0');

	var val = (0 - $noAllergyBar.attr('min')) / ($noAllergyBar.attr('max') - $noAllergyBar.attr('min'));
	noAllergyBarColor1 = '#123';
	noAllergyBarColor2 = '#7CA1C4';
	styleRange($noAllergyBar, val, noAllergyBarColor1, noAllergyBarColor2);
}

function state3Method() {
	setTimeout(function(){changeInstructionText(
		"The person is more likely to have?" +
		"<div id='answerButtons'>" +
			"<button id='allergiesButton'>Allergies</button></div>" +
			"<button id='noAllergiesButton'>No Allergies</button></div>" +
		"</div>",
		 null)}, 250);
}

function state4Method(el) {
	chosenAnswer = el.text();
	setTimeout(function(){changeInstructionText(
		'How many more times likely?' +
		"<input id='timesLikelyNumber' type='number' value=1 step=.01 min=1 max=100>" +
	  'Press enter to submit')
	}, 250);
}

function state5Method() {
	timesMoreLikely = $('#timesLikelyNumber').val();
	setTimeout(function(){changeInstructionText(
		'Answers: ' +
		chosenAnswer + ', ' +
		timesMoreLikely + ' times more likely. Correct Answers:' +
		correctAnswer + ', ' +
		correctTimesMoreLikely + ' more likely'
		)}, 
	250);
	$('body').append($('#interactiveDiv').clone().attr('id', 'interactiveDiv2'));
	$('#interactiveDiv2').prepend('<p> Correct Bars: </p>');
	$('#interactiveDiv2 #allergyBar').width(78 * (percentWithAllergies/100) + '%');
	$('#interactiveDiv2 #allergyBar').width(78 * (percentWithAllergies/100)  + '%');
	styleRange($('#interactiveDiv2 #allergyBar'), (percentWithAllergiesAndOutgoing/100), allergyBarColor1, allergyBarColor2);

	$('#interactiveDiv2 #noAllergyBar').width(78 * (percentWihoutAllergies/100) + '%');
	$('#interactiveDiv2 #noAllergyBar').width(78 * (percentWihoutAllergies/100) + '%');
	styleRange($('#interactiveDiv2 #noAllergyBar'), (percentNoAllergiesAndOutgoing/100), noAllergyBarColor1, noAllergyBarColor2);
}

function changeInstructionText(text, style = null) {
	$('#instructionsDiv').html(text);

	if (style) {
		$('#instructionsDiv').css(style);
	}
}

// Watches for changes in the ranges and upgrades background
function rangeInteractions() {
	$allergyBar.on("change mousemove", function () {
    var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    styleRange($(this), val, allergyBarColor1, allergyBarColor2);
	});

	$noAllergyBar.on("change mousemove", function () {
    var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    styleRange($(this), val, noAllergyBarColor1, noAllergyBarColor2);
	});
}

function styleRange (el, val, color1, color2) {
	el.css('background-image',
         '-webkit-gradient(linear, left top, right top, '
         + 'color-stop(' + val + ', '+ color1 + '), '
         + 'color-stop(' + val + ', '+ color2 + ')'
         + ')'
         );
}

function reset () {
	$('#interactiveDiv2').remove();
	changeInstructionText('Click on the first range with the percent of people who have allergies.');
	allergyBarColor1 = '#7CA1C4';
  allergyBarColor2 = '#CCC';
  noAllergyBarColor1 = '#7CA1C4';
  noAllergyBarColor2 = '#CCC';
  $allergyBar.val(0);
  $noAllergyBar.val(0);
  $allergyBar.css('width', '78%');
  $noAllergyBar.css('width', '78%');
  styleRange($allergyBar, 0, allergyBarColor1, allergyBarColor2);
  styleRange($noAllergyBar, 0, noAllergyBarColor1, noAllergyBarColor2);
  createNumbers();
}


// Creates scenario numbers
function createNumbers() {
	percentWithAllergies = 30;
	percentWithAllergiesAndOutgoing = 60;
	percentNoAllergiesAndOutgoing = 40;
	correctAnswer = 'No Allergies';
	correctTimesMoreLikely = 1.5;

	if (!firstRun) {
		percentWithAllergies = Math.round(Math.random() * 90) + 10;
		percentWihoutAllergies = 100 - percentWithAllergies;
		percentWithAllergiesAndOutgoing = Math.round(Math.random() * 100);
		percentNoAllergiesAndOutgoing = Math.round(Math.random() * 100);
		var totalOutgoingAllergyPeeps = percentWithAllergies * percentWithAllergiesAndOutgoing;
		var totalOutgoingWithoutAllergyPeeps = percentWihoutAllergies * percentNoAllergiesAndOutgoing;

		if (totalOutgoingAllergyPeeps > totalOutgoingWithoutAllergyPeeps) {
			correctAnswer = 'Allergies'
			correctTimesMoreLikely = round(totalOutgoingAllergyPeeps/totalOutgoingWithoutAllergyPeeps, 2);
		} else {
			correctAnswer = 'No Allergies';
			correctTimesMoreLikely = round(totalOutgoingWithoutAllergyPeeps/totalOutgoingAllergyPeeps, 2);
		}

	}

	// Fill these values in the html
	$('#withAllergies').html(percentWithAllergies);
	$('#outgoingAllergiests').html(percentWithAllergiesAndOutgoing);
	$('#outgoingNormal').html(percentNoAllergiesAndOutgoing);
	firstRun = false;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}