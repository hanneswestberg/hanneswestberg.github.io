var w = 600,
	h = 600;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['User'];

//Data
var participants = {};
participants["Aldor"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:9},
			{axis:"User",value:6},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:4},
			{axis:"UX",value:8}
]]
participants["Aragorn"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:6},
			{axis:"User",value:7},
			{axis:"Programming",value:3},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:4},
			{axis:"UX",value:8}
]]
participants["Arwen"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:3},
			{axis:"User",value:8},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:3},
			{axis:"UX",value:3}
]]
participants["Balin"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:6},
			{axis:"User",value:8},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:2},
			{axis:"UX",value:7}
]]
participants["Bereg"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:8},
			{axis:"User",value:6},
			{axis:"Programming",value:3},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:3},
			{axis:"UX",value:5}
]]
participants["Bifur"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:6},
			{axis:"User",value:10},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:7},
			{axis:"HCI",value:6},
			{axis:"UX",value:7}
]]
participants["Bilbo"] = [[
			{axis:"IVIS",value:6},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:7},
			{axis:"User",value:8},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:7},
			{axis:"HCI",value:7},
			{axis:"UX",value:8}
]]
participants["Bofur"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:5},
			{axis:"User",value:7},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:3},
			{axis:"UX",value:2}
]]
participants["Bombadil"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:2},
			{axis:"User",value:6},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:5},
			{axis:"UX",value:8}
]]
participants["Bombur"] = [[
			{axis:"IVIS",value:1},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:10},
			{axis:"User",value:7},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:3},
			{axis:"UX",value:6}
]]
participants["Borin"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:2},
			{axis:"Art",value:6},
			{axis:"User",value:6},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:4},
			{axis:"UX",value:10}
]]
participants["Boromir"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:1},
			{axis:"User",value:7},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:6},
			{axis:"UX",value:5}
]]
participants["Bounder"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:9},
			{axis:"Mathematics",value:9},
			{axis:"Art",value:3},
			{axis:"User",value:10},
			{axis:"Programming",value:10},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:3},
			{axis:"UX",value:9}
]]
participants["Celeborn"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:6},
			{axis:"User",value:8},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:6},
			{axis:"UX",value:7}
]]
participants["Damrod"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:6},
			{axis:"User",value:7},
			{axis:"Programming",value:1},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:3},
			{axis:"UX",value:8}
]]
participants["Deagol"] = [[
			{axis:"IVIS",value:1},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:5},
			{axis:"User",value:8},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:2}
]]
participants["Denethor"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:8},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:2},
			{axis:"User",value:8},
			{axis:"Programming",value:9},
			{axis:"Graphics",value:6},
			{axis:"HCI",value:3},
			{axis:"UX",value:6}
]]
participants["Dorlas"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:6},
			{axis:"User",value:5},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:5},
			{axis:"UX",value:6}
]]
participants["Dwalin"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:7},
			{axis:"User",value:7},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:5},
			{axis:"UX",value:5}
]]
participants["Eldarion"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:9},
			{axis:"Art",value:8},
			{axis:"User",value:8},
			{axis:"Programming",value:3},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:8},
			{axis:"UX",value:9}
]]
participants["Elendil"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:6},
			{axis:"User",value:7},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:6},
			{axis:"UX",value:5}
]]
participants["Elendur"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:2},
			{axis:"User",value:7},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:6},
			{axis:"UX",value:9}
]]
participants["Elrond"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:10},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:1},
			{axis:"User",value:6},
			{axis:"Programming",value:9},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:3},
			{axis:"UX",value:3}
]]
participants["Eomer"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:9},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:3},
			{axis:"User",value:9},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:7},
			{axis:"HCI",value:6},
			{axis:"UX",value:1}
]]
participants["Eothain"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:4},
			{axis:"User",value:9},
			{axis:"Programming",value:9},
			{axis:"Graphics",value:8},
			{axis:"HCI",value:4},
			{axis:"UX",value:3}
]]
participants["Eowyn"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:4},
			{axis:"User",value:4},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:6},
			{axis:"HCI",value:4},
			{axis:"UX",value:4}
]]
participants["Faramir"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:7},
			{axis:"User",value:9},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:6},
			{axis:"UX",value:6}
]]
participants["Ferny"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:4},
			{axis:"User",value:8},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:4},
			{axis:"UX",value:1}
]]
participants["Fili"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:4},
			{axis:"User",value:5},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:5},
			{axis:"UX",value:5}
]]
participants["Freda"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:9},
			{axis:"Art",value:7},
			{axis:"User",value:7},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:3},
			{axis:"UX",value:8}
]]
participants["Frodo"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:4},
			{axis:"User",value:6},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:4},
			{axis:"UX",value:3}
]]
participants["Galadriel"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:7},
			{axis:"User",value:8},
			{axis:"Programming",value:9},
			{axis:"Graphics",value:7},
			{axis:"HCI",value:8},
			{axis:"UX",value:5}
]]
participants["Gamgee"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:2},
			{axis:"User",value:7},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:4},
			{axis:"UX",value:3}
]]
participants["Gandalf"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:1},
			{axis:"User",value:9},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:6},
			{axis:"HCI",value:5},
			{axis:"UX",value:5}
]]
participants["Gimli"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:9},
			{axis:"User",value:7},
			{axis:"Programming",value:1},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:1}
]]
participants["Gollum"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:2},
			{axis:"Art",value:4},
			{axis:"User",value:9},
			{axis:"Programming",value:1},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:6}
]]
participants["Gorbag"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:5},
			{axis:"User",value:9},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:6},
			{axis:"UX",value:3}
]]
participants["Grimbold"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:5},
			{axis:"User",value:9},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:4}
]]
participants["Grishnakh"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:8},
			{axis:"Mathematics",value:6},
			{axis:"Art",value:2},
			{axis:"User",value:7},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:4},
			{axis:"UX",value:3}
]]
participants["Haldir"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:7},
			{axis:"User",value:8},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:2},
			{axis:"UX",value:2}
]]
participants["Haleth"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:4},
			{axis:"User",value:6},
			{axis:"Programming",value:3},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:4},
			{axis:"UX",value:5}
]]
participants["Hama"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:8},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:7},
			{axis:"User",value:9},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:8},
			{axis:"HCI",value:7},
			{axis:"UX",value:8}
]]
participants["Hardang"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:9},
			{axis:"User",value:7},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:3},
			{axis:"UX",value:8}
]]
participants["Idril"] = [[
			{axis:"IVIS",value:6},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:3},
			{axis:"Art",value:8},
			{axis:"User",value:10},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:5},
			{axis:"UX",value:5}
]]
participants["Irolas"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:2},
			{axis:"User",value:7},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:6},
			{axis:"UX",value:5}
]]
participants["Isildur"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:4},
			{axis:"User",value:8},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:5},
			{axis:"UX",value:5}
]]
participants["Kili"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:1},
			{axis:"User",value:6},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:5},
			{axis:"UX",value:8}
]]
participants["Legolas"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:7},
			{axis:"User",value:8},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:4},
			{axis:"UX",value:4}
]]
participants["Lindir"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:2},
			{axis:"User",value:7},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:4},
			{axis:"UX",value:4}
]]
participants["Lurtz"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:6},
			{axis:"User",value:8},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:4},
			{axis:"UX",value:5}
]]
participants["Madril"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:4},
			{axis:"User",value:9},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:7},
			{axis:"UX",value:5}
]]
participants["Maiar"] = [[
			{axis:"IVIS",value:6},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:7},
			{axis:"User",value:7},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:5},
			{axis:"UX",value:6}
]]
participants["Mauhur"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:8},
			{axis:"User",value:9},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:6},
			{axis:"UX",value:7}
]]
participants["Merry"] = [[
			{axis:"IVIS",value:5},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:8},
			{axis:"User",value:7},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:4},
			{axis:"UX",value:8}
]]
participants["Morwen"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:3},
			{axis:"User",value:10},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:7},
			{axis:"UX",value:5}
]]
participants["Nessa"] = [[
			{axis:"IVIS",value:1},
			{axis:"Statistics",value:1},
			{axis:"Mathematics",value:1},
			{axis:"Art",value:2},
			{axis:"User",value:2},
			{axis:"Programming",value:1},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:2}
]]
participants["Ohtar"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:1},
			{axis:"Art",value:3},
			{axis:"User",value:4},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:2},
			{axis:"UX",value:2}
]]
participants["Oin"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:5},
			{axis:"User",value:8},
			{axis:"Programming",value:9},
			{axis:"Graphics",value:7},
			{axis:"HCI",value:9},
			{axis:"UX",value:7}
]]
participants["Otho"] = [[
			{axis:"IVIS",value:6},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:6},
			{axis:"User",value:10},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:9},
			{axis:"UX",value:7}
]]
participants["Pelendur"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:3},
			{axis:"User",value:4},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:4},
			{axis:"UX",value:1}
]]
participants["Pippin"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:2},
			{axis:"Mathematics",value:2},
			{axis:"Art",value:8},
			{axis:"User",value:10},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:5},
			{axis:"UX",value:2}
]]
participants["Quickbeam"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:8},
			{axis:"User",value:8},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:3},
			{axis:"UX",value:3}
]]
participants["Rian"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:2},
			{axis:"User",value:8},
			{axis:"Programming",value:5},
			{axis:"Graphics",value:3},
			{axis:"HCI",value:4},
			{axis:"UX",value:4}
]]
participants["Sam"] = [[
			{axis:"IVIS",value:6},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:9},
			{axis:"User",value:8},
			{axis:"Programming",value:4},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:4},
			{axis:"UX",value:9}
]]
participants["Sauron"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:9},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:2},
			{axis:"User",value:9},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:3},
			{axis:"UX",value:3}
]]
participants["Shagrat"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:6},
			{axis:"User",value:7},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:4}
]]
participants["Sharku"] = [[
			{axis:"IVIS",value:2},
			{axis:"Statistics",value:7},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:4},
			{axis:"User",value:6},
			{axis:"Programming",value:1},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:8}
]]
participants["Smaug"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:4},
			{axis:"Mathematics",value:4},
			{axis:"Art",value:6},
			{axis:"User",value:10},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:5},
			{axis:"HCI",value:7},
			{axis:"UX",value:6}
]]
participants["Smeagol"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:7},
			{axis:"User",value:9},
			{axis:"Programming",value:3},
			{axis:"Graphics",value:2},
			{axis:"HCI",value:3},
			{axis:"UX",value:8}
]]
participants["Theoden"] = [[
			{axis:"IVIS",value:3},
			{axis:"Statistics",value:5},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:1},
			{axis:"User",value:9},
			{axis:"Programming",value:2},
			{axis:"Graphics",value:1},
			{axis:"HCI",value:1},
			{axis:"UX",value:3}
]]
participants["Theodred"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:8},
			{axis:"Mathematics",value:8},
			{axis:"Art",value:5},
			{axis:"User",value:9},
			{axis:"Programming",value:7},
			{axis:"Graphics",value:9},
			{axis:"HCI",value:8},
			{axis:"UX",value:4}
]]
participants["Thorin"] = [[
			{axis:"IVIS",value:7},
			{axis:"Statistics",value:6},
			{axis:"Mathematics",value:7},
			{axis:"Art",value:2},
			{axis:"User",value:10},
			{axis:"Programming",value:8},
			{axis:"Graphics",value:6},
			{axis:"HCI",value:7},
			{axis:"UX",value:7}
]]
participants["Ugluk"] = [[
			{axis:"IVIS",value:4},
			{axis:"Statistics",value:3},
			{axis:"Mathematics",value:5},
			{axis:"Art",value:5},
			{axis:"User",value:8},
			{axis:"Programming",value:6},
			{axis:"Graphics",value:4},
			{axis:"HCI",value:4},
			{axis:"UX",value:2}
]]
participants["Uruk"] = [[
	{axis:"IVIS",value:5},
	{axis:"Statistics",value:8},
	{axis:"Mathematics",value:7},
	{axis:"Art",value:7},
	{axis:"User",value:9},
	{axis:"Programming",value:9},
	{axis:"Graphics",value:8},
	{axis:"HCI",value:7},
	{axis:"UX",value:7}
]]

var groups = {};
groups["Group 1"] = [
	"Bounder",
	"Hardang",
	"Pelendur",
	"Gorbag",
	"Shagrat",
	"Quickbeam",
	"Deagol",
	"Elendil"
]
groups["Group 2"] = [
	"Eothain",
	"Ferny",
	"Eowyn",
	"Sharku",
	"Morwen",
	"Balin",
	"Gimli",
	"Ugluk"
]
groups["Group 3"] = [
	"Uruk",
	"Bilbo",
	"Faramir",
	"Freda",
	"Haleth",
	"Bofur",
	"Kili",
	"Dwalin"
]
groups["Group 4"] = [
	"Oin",
	"Thorin",
	"Grishnakh",
	"Sam",
	"Aragorn",
	"Isildur",
	"Merry",
	"Bombadil"
]
groups["Group 5"] = [
	"Denethor",
	"Boromir",
	"Smaug",
	"Damrod",
	"Aldor",
	"Lindir",
	"Lurtz"
]
groups["Group 6"] = [
	"Elrond",
	"Madril",
	"Otho",
	"Haldir",
	"Smeagol",
	"Fili",
	"Gamgee"
]
groups["Group 7"] = [
	"Hama",
	"Theoden",
	"Sauron",
	"Nessa",
	"Ohtar",
	"Legolas",
	"Frodo"
]
groups["Group 8"] = [
	"Eomer",
	"Dorlas",
	"Bereg",
	"Pippin",
	"Gollum",
	"Grimbold",
	"Irolas"
]
groups["Group 9"] = [
	"Galadriel",
	"Maiar",
	"Bifur",
	"Eldarion",
	"Celeborn",
	"Rian",
	"Elendur"
]
groups["Group 10"] = [
	"Gandalf",
	"Mauhur",
	"Theodred",
	"Borin",
	"Bombur",
	"Arwen",
	"Idril"
]


//Options for the Radar chart, other than default
var mycfg = {
  radius: 2,
  w: w,
  h: h,
  maxValue: 10,
  levels: 10,
  ExtraWidthX: 600,
  ExtraWidthY: 200,
  TranslateX: 50,
  TranslateY: 100
}

//Call function to draw the Radar chart
//Will expect that data is in %'s

function CreateChart(part){
	if(groups.hasOwnProperty(part)){
		var groupPart = []
		groups[part].forEach(function(entry){
			groupPart.push(participants[entry][0]);
		});

		console.log(groupPart);
		console.log(participants["Uruk"]);
		RadarChart.draw("#chart", groupPart, mycfg);
	}

	if(participants.hasOwnProperty(part))
		RadarChart.draw("#chart", participants[part], mycfg);
}


////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg2 = d3.select('#chart')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
var text = svg2.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Skills");
		
//Initiate Legend	
var legend = svg2.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	

