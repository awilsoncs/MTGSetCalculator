//Constants
var COMMON_DIST = 0.4274;
var UNCOMMON_DIST = 0.2685;
var RARE_DIST = 0.2364;
var MYTHIC_DIST = 0.0672;
var CREATURES_PER_COLOR = [1, 0, 0, -1, 0];

var COLORBLOCK = "<li class='%color'><h4>%color: <span id='%rarity_%color_span'></span></h4> <ul> <li class='creatures'><h5>Creatures: <span id='%rarity_%color_creature_span'></span></h5></li><li class='noncreatures'><h5>Noncreatures: <span id='%rarity_%color_noncreature_span'></span></h5></li></ul></li>"

//Generate the list of spans
var rarities = ["Common", "Uncommon", "Rare", "Mythic"];
var colors = ["White", "Blue", "Black", "Red", "Green", "Other"];
var types = ["creature", "noncreature"];

var spans = new Array();
for ( var rarity in rarities ){
	spans.push(rarities[rarity] + "_span");
	for ( var color in colors ){
		spans.push(rarities[rarity] + "_" + colors[color] + "_span");
		for ( var type in types ){
			spans.push(rarities[rarity] + "_" + colors[color] + "_" + types[type] + "_span");
		}
	}
}

function calculate() {
	//Exclude basic lands, include an option later
	var setSize = document.getElementById("setsize").value - 20;
	var distributionMap = {};
	buildRarities();
	fillRarities();
	
	calculateRarity(setSize, distributionMap, "Common", COMMON_DIST);
	calculateRarity(setSize, distributionMap, "Uncommon", UNCOMMON_DIST);
	calculateRarity(setSize, distributionMap, "Rare", RARE_DIST);
	calculateRarity(setSize, distributionMap, "Mythic", MYTHIC_DIST);

	//Write the distributionMap to the page
	for (var id in spans) {
		if (distributionMap.hasOwnProperty(spans[id])) {
			var span = document.getElementById(spans[id]);
			while( span.firstChild ) {
		    	span.removeChild( span.firstChild );
			}
			span.appendChild( document.createTextNode( distributionMap[spans[id]] ) );
		}
	}
}

function calculateRarity(setSize, distributionMap, rarity, rarityDist, mode){
	var number = Math.floor( setSize * rarityDist );
	var numberPerColor = Math.floor( number / 5 );
	var numberOthers = number % 5;
	//Black is usually about half creatures at each rarity.
	var blackCreatures = Math.round( numberPerColor / 2 );
	distributionMap[rarity + "_span"] = number;
	//Work through all subsets except Other
	for( var i = 0; i < colors.length - 1; i++ ) {
		//Get creatures at this color
		var creatures = Math.min((CREATURES_PER_COLOR[i] + blackCreatures), numberPerColor);
		if (creatures < 1){
			creatures = 1;
		}
		var nonCreatures = numberPerColor - creatures;
		
		var span = rarity + "_" + colors[i] + "_span";
		var creatureSpan = rarity + "_" + colors[i] + "_creature_span";
		var nonCreatureSpan = rarity + "_" + colors[i] + "_noncreature_span";

		distributionMap[span] = numberPerColor;
		distributionMap[creatureSpan] = creatures;
		distributionMap[nonCreatureSpan] = nonCreatures;
	}
	distributionMap[rarity + "_Other_span"] = numberOthers;
	var otherCreatures = Math.round(numberOthers / 6);
	distributionMap[rarity + "_Other_creature_span"] = otherCreatures;
	distributionMap[rarity + "_Other_noncreature_span"] = numberOthers - otherCreatures;
}

function buildRarities(){
	var rarityBlock = "<div id='%rarity' class='span3'><h3>%raritys: <span id='%rarity_span'></span></h3><ul id='%rarity_list'></ul></div>";
	var r = /%rarity/g;
	document.getElementById("rarityContainer").innerHTML="";
	for (rarity in rarities){
		document.getElementById("rarityContainer").innerHTML+=rarityBlock.replace(r, rarities[rarity]);
	}
}

function fillRarities(){
	var r = /%rarity/g;
	var c = /%color/g;
	for(var rarity in rarities){
		document.getElementById(rarities[rarity] + "_list").innerHTML="";
		for(var color in colors){
			document.getElementById(rarities[rarity] + "_list").innerHTML+=COLORBLOCK.replace(r, rarities[rarity]).replace(c, colors[color]);
		}
	}
}