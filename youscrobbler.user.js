// ==UserScript==
// @name          YouScrobbler
// @namespace     userscripts.org
// @author        http://www.lukash.de
// @description   Scrobbles the currently watching YouTube video to last.fm.
// @identifier    http://userscripts.org/scripts/source/119694.user.js
// @include       http://*.youtube.com/*
// @include       https://*.youtube.com/*
// @include       http://youtube.com/*
// @include       https://youtube.com/*
// @include       *//*.youtube.com/tv*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @downloadURL   https://raw.githubusercontent.com/floblik/YouScrobbler/master/youscrobbler.user.js
// @updateURL     http://youscrobbler.lukash.de/youscrobbler.meta.js
// @version       1.4.6
// @noframes
// @run-at        document-idle
// ==/UserScript==

/**
 * You can contact me on http://www.lukash.de/youscrobbler or on http://userscripts.org/scripts/show/119694 if you have got suggestions, bugs or other questions
 */

'use strict';

const VERSION = "1.4.6";
const APIKEY = "d2fcec004903116fe399074783ee62c7";

let lastFmAuthenticationUrl = "http://www.last.fm/api/auth";
let authenticationSessionUrl = "http://youscrobbler2.lukash.de/auth";
let scrobbleSongUrl = "http://youscrobbler2.lukash.de/scrobblesong/";

let currentURL = document.URL;
let loadgif = '<div class="us_loadgif"><img alt="loading" src="data:image/gif;base64,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" /></div>';
let BFather;
let TO1Helper = false;
let isGM;

let trackInfoFromDB = false;

/**
 * --- Content ---
 * 1. Initializing
 * 2. General Functions
 * 3. Appearance
 * 4. Scrobbling and Login
 * 5. Information request
 * 6. Miscellaneous
 * 7. Update
 */


/**
 * --- 1. Initializing ---
 */
function init() {	
	isGM = typeof GM_getValue != 'undefined' && typeof GM_getValue('a', 'b') != 'undefined';

	if (!isLoggedIn()) {
		tryGetAuthToken();
	}
	
	us_addButton();
}

function updateUrl () {
	return "http://youscrobbler.lukash.de/currentversion";
}

function us_reset () {
	setTimeout(function () {us_closebox();},0);
	trackInfoFromDB = false;
	currentURL = document.URL;
	document.getElementById("us_temp_info").setAttribute("us_video_id", getYouTubeVideoId());
	document.getElementById("us_temp_info").removeAttribute("artist");
	document.getElementById("us_temp_info").removeAttribute("track");
	document.getElementById("us_temp_info").removeAttribute("autoscrobbleerror");
	document.getElementById("us_temp_info").removeAttribute("scrobbled");
	document.getElementById("us_temp_info").setAttribute("us_leftToPlay", -1);
	document.getElementById("us_temp_info").removeAttribute("us_playstart");
	document.getElementById("us_temp_info").removeAttribute("is_full_album");
	document.getElementById("us_temp_info").removeAttribute("us_playstart_s");
	
	//save time page was loaded aka playstart time in ctime and gay format
	let time = new Date();
	let m = time.getUTCMonth()+1;
	let d = time.getUTCDate();
	if (m.toString().length == 1) {
	   m='0'+m;
	}
	if (d.toString().length == 1) {
	   d='0'+d;
	}
	us_saveTempData("us_playstart", time.getUTCFullYear()+'%2d'+m+'%2d'+d+'%20'+time.getUTCHours()+'%3a'+time.getUTCMinutes()+'%3a'+time.getUTCSeconds());
	us_saveTempData("us_playstart_s", Math.round(time.getTime()/1000));
	
	us_abortScrobbling();
	getTrackInfo();
	us_buttonStatus();
}

/**
 * --- 2. General Functions ---
 */
function initPreferences () {
	if (!us_getValue('us_boxpos')) {
		us_saveValue('us_boxpos',(screen.availWidth)/1.3+"px-"+70+"px");
	}
	if ((!us_getValue('us_color')) || (us_getValue('us_color')=="r")) {
		us_saveValue('us_color','red');
	}
	if (!us_getValue('database.id', 0)) {
		us_saveValue('database.id', "");
		us_saveValue('database.artist', "");
		us_saveValue('database.track', "");
	}
	if (!us_getValue('database_additional.id', 0)) {
		us_saveValue('database_additional.id', "");
		us_saveValue('database_additional.albumtitle', "");
		us_saveValue('database_additional.mbid', "");
	}
	if (!us_getValue("database.maxEntries", 0)) {
		us_saveValue("database.maxEntries", 5000);
	}
	if (!us_getValue("scrobble_at", 0)) {
		us_saveValue("scrobble_at", 75);
	}
	if (us_getValue("us_autoscrobble_active", "nf") == "nf") {
		us_saveValue("us_autoscrobble_active", 1);
	}
	if (us_getValue('asFailNotification', "nf") == "nf") {
		us_saveValue('asFailNotification', false);
	}
	if (us_getValue('scrobblingNotification', "nf") == "nf") {
		us_saveValue('scrobblingNotification', true);
	}
	if (us_getValue('us_autocorrect_tracks', "nf") == "nf") {
		us_saveValue('us_autocorrect_tracks', true);
	}
}

// Creates a <type id="id">
function createIdElement(type, id) {
	let el = document.createElement(type);
	el.setAttribute('id', id);
	return el;
}

function us_movebox(e) {
	if (us_getValue('us_drag')) {
		let el = document.getElementById('us_loginbox');
		el.style.left = (150+e.clientX-us_getValue('us_drag').split('-')[0])+"px";
		el.style.top = e.clientY-us_getValue('us_drag').split('-')[1]+"px";
	}
} 
function us_moveboxd(e) {
	let el = document.getElementById('us_loginbox');
	us_saveValue('us_drag',(e.clientX-el.offsetLeft)+"-"+(e.clientY-el.offsetTop));
} 
function us_moveboxu() {
	let el = document.getElementById('us_loginbox');
	us_saveValue('us_boxpos',el.style.left+"-"+el.style.top);
	us_saveValue('us_drag',false);
} 


function GM_main () {
    window.us_stateChanged = function (state) {
		let playerNode;
		if (document.getElementById("c4-player")) {
			playerNode = document.getElementById("c4-player");
		} else {
			playerNode = document.getElementById("movie_player");
		}
		//get video ID
		let regex = /(\?|%3F|&|%26)v=[^?&#]*/gi;
		let removeRegex = /(\?|%3F|&|%26)v=/gi;
		let matches = document.URL.match(regex);
		let vidId;
		if(matches != null) {
			vidId = matches[0].replace(removeRegex, "");
		} else {
			matches = playerNode.getVideoUrl().match(regex);
			vidId = matches[0].replace(removeRegex, "");
		}
		if (state==1 && vidId != document.getElementById("us_temp_info").getAttribute("us_video_id")) {
			setTimeout(function () {document.getElementById("us_temp_info").setAttribute("us_reset_now", "1");}, 1);
		}
		switch (state) {
			case 1:
				document.getElementById("us_temp_info").setAttribute("video_is_playing", "1");
			break;
			case 0:
				document.getElementById("us_temp_info").setAttribute("video_end_reached", "yes");
				document.getElementById("us_temp_info").setAttribute("video_is_playing", "0");
			break;
			default:	
				document.getElementById("us_temp_info").setAttribute("video_is_playing", "0");
		}
		if (document.getElementById("us_temp_info").getAttribute("is_full_album") != "yes") {
			document.getElementById("us_temp_info").setAttribute("us_secs", playerNode.getDuration());
		}
    }
	
    window.onYouTubePlayerReady = function () {
		let playerNode;
        if (document.getElementById("c4-player")) {
			playerNode = document.getElementById("c4-player");
		} else {
			playerNode = document.getElementById("movie_player");
		}
        if (playerNode) {
				//Note, inside onYouTubePlayerReady ONLY, the YouTube API
                //seems to override addEventListener. Hence the nonstandard
                //parameters.
            
            playerNode.addEventListener ('onStateChange', 'us_stateChanged');
			document.getElementById("us_temp_info").setAttribute("us_secs", playerNode.getDuration());
        }
        else
            throw new Error("YouScrobbler: Player node not found!");
    }
	
	if (document.getElementById("us_temp_info").getAttribute("us_secs") == 0) {
		window.onYouTubePlayerReady()
	}
}

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    let D                                   = document;
    let scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    let targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
/**
 * Value Saving Method - Switcher
 * uses Greasemonkey GM_ or localStorage
 */
function us_saveValue(name, value) {
	if (isGM) {
		GM_setValue(name, value);
	} else {
		localStorage.setItem(name, value);
	}
}

/**
 * Value Getting Method - Switcher
 * uses Greasemonkey GM_ or localStorage
 */
function us_getValue(name, alternative) {
	if (isGM) {
		return (GM_getValue(name, alternative));
	} else {
		return (localStorage.getItem(name, alternative));
	}	
}

/**
 * Temporary save data
 * Saved in "us_temp_info" attributes
 */
function us_saveTempData(name, value) {
	document.getElementById("us_temp_info").setAttribute(name, value);
}

/**
 * Get temporary saved data
 * Saved in "us_temp_info" attributes
 */
function us_getTempData(name) {
	if (document.getElementById("us_temp_info").getAttribute(name)) {
		let value = document.getElementById("us_temp_info").getAttribute(name);
		return value;
	} else {
		return 0;
	}	
}


/**
 * --- 3. Appearance ---
 */

/**
 * Add the Scrobble Button to Video and Userpages
 */
function us_addButton() {
    us_saveValue('us_drag',false);
	let secs = 0;
	let time = new Date();
	let t = Math.round(time.getTime()/1000);
	let m = time.getUTCMonth()+1;
	let d = time.getUTCDate();
	if (m.toString().length == 1) {
       m='0'+m;
    }
    if (d.toString().length == 1) {
       d='0'+d;
    }
	let t2 = time.getUTCFullYear()+'%2d'+m+'%2d'+d+'%20'+time.getUTCHours()+'%3a'+time.getUTCMinutes()+'%3a'+time.getUTCSeconds();
	
    let style_el = document.createElement("style");
    let head = document.getElementsByTagName('head')[0];

    style_el.innerHTML =	'.us_box { border-radius: 5px; border: 5px solid #333; background: #fff;'+
					// by AshKyd
					'z-index:1000000; position: absolute; top: 70px; width: 300px; margin-left: -150px; }'+
					'.us_box h3 { cursor: move; padding: 4px 8px 4px 10px; margin: 0px; border-bottom: 1px solid #AAA; background-color: #EEE; }'+
					'.us_box h4 { margin-left: 5px; margin-bottom:0px}'+
					'#us_box_close { background-image: url(data:image/gif;base64,R0lGODlhDQANALMPAKurq7S0tOzs7MrKytfX14qKir6%2BvqWlpf7%2B%2Fnt7e5OTk56enpmZmYWFhYCAgP%2F%2F%2FyH5BAEAAA8ALAAAAAANAA0AAARd8EkxTDBDSIlI%2BGBAIBIBAMeJnsQjnEugMEqwnNRxGF0xGroBYEEcCTrEG2OpKBwFhdlyoWgae9VYoRDojQDbgKBBDhTIAHJDE3C43%2B8Ax5Co2xO8jevQSDQOGhIRADs%3D); width: 13px; height: 13px; float: right; margin-top: 1px; }'+
					'#us_box_settings { background-image: url(data:image/gif;base64,R0lGODlhDQANAPcAAAAAAHt7e4CAgIGBgYWFhYaGhoqKiouLi4yMjI2NjZOTk5mZmZqampubm5ycnJ6enp+fn6GhoaWlpaampqenp6ioqKmpqaqqqqurq6ysrK2trbCwsLKysrOzs7S0tLa2tre3t76+vr+/v8DAwMXFxcbGxsfHx8jIyMrKysvLy83NzdDQ0NTU1NXV1dfX19nZ2dzc3N3d3d7e3uDg4Ojo6Ovr6+zs7O3t7e/v7/7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAANAA0AAAicAP8JtIEihIcQKGwIFJjDhYeHED24yCHQBYYMGDJy8KABg4t/NjKK/ACDRYcNGAhKuCBSBY4XJ1JIQIFhgkgPMXDcqGHiAYYFDyJgECGDRgsTIxwsAPqAgogXM1ZkYBlBwQMPBhKQcFHCQgcIEQ4Y8GCDAAEEICowaPCggFmFHgTIZTBArlwPDEME2Ms3QAiKC21IIBCAgASFAgMCADs=); width: 13px; height: 13px; float: right; margin:1px 3px 0 0; }'+
					'#us_box_head > ul, #us_box_head li { float:right}'+
					'#us_box_head ul { list-style-type:none}'+
					'.us_settings_grp { height:50px; vertical-align:middle; padding-right:3px;padding-left:5px}'+
					'.us_settings_grp hr { background-color: #EEE; margin: 5px 8px; height: 1px;}'+
					'.us_settings_grp_left { width:155px}'+
					'.us_settings_grp_right { width:135px}'+
					'.us_settings_grp span { vertical-align:middle}'+
					'.us_settings_grp_heading { color:#777;font-size:100%;font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:4px;}'+
					'.us_settings_grp_database { cursor: help;}'+
					'#databaseMaxLength {width: 55px; }'+
					'#scrobble_at {width: 45px; }'+
					'#us_box_help { background-image: url(data:image/gif;base64,R0lGODlhDQANAKIAALKysomJisfHx%2F%2F%2F%2F5WWlujo6H5%2BfqOjoyH5BAAAAAAALAAAAAANAA0AAANCOFoi0EXJAqoFUbnDexUD1UWFx3QNkXJCRxBBkBLc%2B8ZMYNN37Os0wA8wEPowvySuaGg6nUQF4AmVLA4BQ%2BCQGSQAADs%3D); width: 13px; height: 13px; float: right; margin: 1px 3px 0 0; }'+
					'#us_loginbox_form { text-align: right; padding: 5px; }'+
					'.us_box input[type=text] { height: 16px; border: 1px solid #bbb; margin: 2px 15px 4px 2px; padding: 3px 4px; width: 170px;}'+
					'.us_box input[type=submit] { cursor:pointer; margin: 0 0 0 5px; padding: 0 4px 3px 4px; border-radius: 2px; font-size: 11px; font-weight: bold; color: white; height: 18px; border: 1px solid #3e3e3e; background-image: url(data:image/gif;base64,R0lGODlhAQAQAKIAAH5%2BflRUVFxcXGNjY2tra3Nzc3p6eoKCgiH5BAAAAAAALAAAAAABABAAAAMKeAdmVYSMIUS4CQA7); }'+
					'.us_box input[type=submit]:hover { background-image: url(data:image/gif;base64,R0lGODlhAQAQAPcAAIaGho6OjpWVlZ2dnaWlpaysrLCwsLS0tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAQAQAAAIFAAPHDBQoAABAgMGCBAQIACAhwEBADs=);}'+
					'.us_box input[type=submit]:active { padding: 1px 4px 2px 4px;}'+
					'.us_hidden { visibility: hidden; overflow: hidden; height: 0px; }'+
					'#us_hiddenform { margin: 0; pading-right: 10px;}'+
					'#us_hiddenform input[type=text] {margin-right:15px}'+
					'#us_quickchange { position:relative; bottom:40px; width:9px; height:15px; float:right; background-image: url(data:image/gif;base64,R0lGODlhCQAPAPcAAAAAAICAgIGBgYODg4SEhIeHh4iIiImJiYqKiouLi4yMjI6Ojo+Pj5CQkJGRkZeXl5iYmJmZmaCgoKKiogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAJAA8AAAhMAP8J/PdgoMEDAQoY/DcggEMBAxckgBAgAgIEAhlM+Bfg3wSMBjsuFChyZMmFJ0MubCCB4z8JDgQqIEAxQgICAx3qXJgggIGRBA0GBAA7); }'+
					'#us_quickchange:focus { background-color: #FFF; outline:none}'+
					'.us_clickable_formdesc {}'+
					'.us_loadgif { text-align: center; padding: 10px 0; }'+
					'.us_loadgif img { border-radius: 5px; border:3px solid #91998E; }'+
					'#us_more { font: normal normal bold 12pt/12pt Arial; color: #999; text-decoration: none; margin-right: 3px; }'+
					'#us_more:focus { background:none; outline:none }'+
					'.us_submitbuttons { background-color: #EEE; border-top: 1px solid #AAA; padding: 5px; width: 290px; height: 18px; margin-top: 5px; }'+
					'#scrobbleStatus_parent {float: left; height: 18px; margin-left: 15px; padding-left: 5px; padding-top: 2px; color:#888}'+
					'#us_autoscrobble {vertical-align:middle;}'+
					'.us_submitbuttons_box_left {float: left;}'+
					'.us_error { background-color: #F6D8D8; border: 1px solid #f28494; padding: 5px 3px 5px 3px; width: 90%; margin: 6px auto 10px; }'+
					'.us_done { background-color: #CCFF99; border: 1px solid #99CC00; padding: 5px 3px 5px 3px; width: 90%; margin: 5px auto; }'+
					'.us_infobox { z-index:1000000; background-color: #E8E8E8; border-radius: 5px; padding: 10px; position: fixed; right: 16px; bottom: 9px; border: 1px solid #000000; font-size: 10pt; }'+
					'.us_infobox div { color: #AAAAAA; margin: 1px 5px 0 0; float: left; }'+
					'.us_infobox div img { float: right; margin: -1px -6px 1px 8px; vertical-align: middle;}'+
					'.us_infobox .sep { color:#AAA; }'+
					'.us_trackinfo { color: #47D93D; font-weight: bold; padding-right: 8px; font-size: 11pt; vertical-align: middle;}'+
					'.us_box .us_center { padding: 10px; text-align: center; }'+
					'.us_box .us_left { padding: 10px; text-align: left; }'+
					'#us_submit { float: right; margin-bottom:5px;}'+
					'us_submitbuttons_box_left {border}'+
					'#us_scrobblebutton { float:right; cursor: pointer; margin-left:16px;}'+
					'#us_start_scrobblebutton {padding-left:3px!important}'+ //Feather check
					'#us_icon_small, #us_start_scrobblebutton_text { vertical-align: middle;}}'+ 
					'#fullAlbumIcon { float: left; height: 16px; width: 16px; cursor: help;}'+
					'#foundInDBIcon { float: left; height: 16px; width: 16px; cursor: help; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAR9JREFUOE+tk92KglAYRXuYeTUfIZUi8e9GykASQUEQBNFuvSgotETssfbMPuAZBmOcmIR99a21ksDF4h1PGIY4Ho/wfR/n8/nXkSFLR/6267qoqgp1XWPuIUOWjgw4joOyLHE6neZ8wZClIwO2baMoClyv19kAGbJ0ZMCyLOR5jtvtNhsgQ5aODJimiSzL0Pf9bIAMWToyYBgG0jQV1b+MLB0Z2Gw2iOP4pdGRgfV6jSiKXhodGVitVjgcDmJJkuDxeDwdbyNHRwZ0XUcQBGJt20JRFFwul8kfytvI0ZEBTdOw3+/Fuq4TgaZpJgHeRo6ODGy3W+x2O7FhGETgfr9PAryNnKqq34Ev8sPzPCyXS/GRUH423shwP97gP1/0J3OEY6rxN9R9AAAAAElFTkSuQmCC);}'+
					'#us_scrobble_on {font-weight:bold; color: #66CC00;} '+
					'#us_scrobble_failed {font-weight:bold; color: #D10404;} '+
					'#us_scrobble_statusbar {background-color: #66CC00; display: none; height: 2px; width: 0; opacity: 0.8; margin: 0px; padding-right: 1px; } '+
					'#us_loginbox .us_status_small {color: #999; font-size:80%}'+
					'.us_box, .us_infobox {visibility: visible; opacity: 1; transition: opacity 0.5s;}'+
					'.us_box_hidden {visibility: hidden; opacity: 0; transition: visibility 0s 0.5s, opacity 0.5s;}';
		   //us_start_scrobblebutton
    let button = createIdElement("span","us_scrobblebutton");

	button.innerHTML = '<img id="us_icon_small" style="margin-bottom: -3px;" src="'+us_icon()+'" alt="icon" /><input id="us_temp_info" video_is_playing="1" type="hidden" us_secs="'+secs+'" us_playstart_s="'+t+'" us_playstart="'+t2+'"/><input id="us_resetCore" type="button" style="display:none"/><a class="start" id="us_start_scrobblebutton"> <span id="us_start_scrobblebutton_text">Scrobble</span></a><span class="masthead-link-separator">|</span>';//postxanadus

	//Design check
	if (document.getElementsByTagName("ytd-searchbox")[0]) {
		BFather = document.getElementsByTagName("ytd-searchbox")[0];
		button.setAttribute("class", "yt-uix-button-group");
		button.style.marginLeft = "50px";
		button.style.padding = "6px 0 6px 0";
		button.style.border = "1px solid var(--yt-searchbox-legacy-button-border-color)";
		button.innerHTML = '<input id="us_temp_info" video_is_playing="1" type="hidden" us_secs="'+secs+'" us_playstart_s="'+t+'" us_playstart="'+t2+'"/><input id="us_resetCore" type="button" style="display:none"/><a style="border-radius:2px; 2px; 2px; 2px;padding-right:6px;padding-left:8px!important" class="yt-uix-button yt-uix-sessionlink start yt-uix-button-default" id="us_start_scrobblebutton"><img id="us_icon_small" src="'+us_icon()+'" alt="icon"/> <span id="us_start_scrobblebutton_text">Scrobble</span></a><div id="us_scrobble_statusbar"></div>';
		BFather.insertBefore(button, BFather.lastChild);
		
		document.getElementById("us_scrobble_statusbar").style.position = "relative";
		document.getElementById("us_scrobble_statusbar").style.top = "6px";
	} else if (document.getElementById("masthead-nav")) {
		BFather = document.getElementById("masthead-nav");
		BFather.insertBefore(button, BFather.firstChild);
	} else if (document.getElementById("yt-masthead-content")){
		BFather = document.getElementById("yt-masthead-content");
		button.setAttribute("class", "yt-uix-button-group");
		button.style.float = "right";
		button.style.marginLeft = "20px";
		button.style.marginTop = "3px";
		button.style.marginRight = "2px";
		button.style.borderTopRightRadius = "2px";
		button.style.borderBottomRightRadius = "2px";
		button.innerHTML = '<input id="us_temp_info" video_is_playing="1" type="hidden" us_secs="'+secs+'" us_playstart_s="'+t+'" us_playstart="'+t2+'"/><input id="us_resetCore" type="button" style="display:none"/><a style="border-radius:2px; 2px; 2px; 2px;padding-left:6px!important" class="yt-uix-button yt-uix-sessionlink start yt-uix-button-default" id="us_start_scrobblebutton"><img id="us_icon_small" src="'+us_icon()+'" alt="icon"/> <span id="us_start_scrobblebutton_text">Scrobble</span></a><div id="us_scrobble_statusbar"></div>';
		BFather.insertBefore(button, BFather.firstChild);
	} else if (document.getElementById("mh")){
		BFather = document.getElementById("mh");
		button.setAttribute("class", "ml");
		button.innerHTML = '<img id="us_icon_small" style="margin-bottom: -3px;" src="'+us_icon()+'" alt="icon" /><input id="us_temp_info" video_is_playing="1" type="hidden" us_secs="'+secs+'" us_playstart_s="'+t+'" us_playstart="'+t2+'"/><input id="us_resetCore" type="button" style="display:none"/><a class="start" id="us_start_scrobblebutton">Scrobble</a>';
		BFather.insertBefore(button, document.getElementById("se").nextSibling);
	} else {
		setTimeout(function () {us_addButton()}, 1000);
		
		return;
	}

	head.appendChild(style_el);
	
	us_buttonStatus();
	document.getElementById("us_temp_info").setAttribute("us_video_id", getYouTubeVideoId());
	addJS_Node (null, null, GM_main);
	setTimeout(function () {us_ajax_scanner()}, 1000);
	
	checkFirstRun();
}

function us_buttonStatus () {
	let secs = us_getTempData("us_secs");
	document.getElementById("us_start_scrobblebutton").style.opacity = 1;
	
    if (secs > 30) {
		document.getElementById('us_scrobblebutton').addEventListener('click', us_toggleBox, true);
		document.getElementById('us_scrobblebutton').title = "";
		document.getElementById("us_start_scrobblebutton").style.opacity = 1;
		//watched seconds till scrobbling
		let time_left_to_scrobble;
		if (us_getTempData("us_leftToPlay", false)==false || us_getTempData("us_leftToPlay") < 0){
			time_left_to_scrobble = parseInt(us_getTempData("us_secs")*(us_getValue("scrobble_at"))*0.01);
			us_saveTempData("us_leftToPlay", parseInt(time_left_to_scrobble));
		}
		tryAutoScrobble();
    } else {
		document.getElementById("us_start_scrobblebutton").style.opacity = 0.5;
		document.getElementById('us_scrobblebutton').removeEventListener('click', us_toggleBox);
		if(secs == 0) {
			document.getElementById('us_scrobblebutton').title = "There is no video to scrobble.";
		} else {
			document.getElementById('us_scrobblebutton').title = "Video is too short to be scrobbled.";
		}
    }

	if (secs == 0) {
		if (!getYouTubeVideoId()) {
			setTimeout(function () {us_buttonStatus();}, 5000);
		} else {
			setTimeout(function () {us_buttonStatus();}, 1000);
		}
	}
}


function us_icon() { 
	if (us_getValue('us_color') == 'red') {
		return "data:image/gif;base64,R0lGODlhEAAQAKIAAPNHLdYzINJbTN2rp%2FHSztCBerIRC%2Ff39yH5BAAAAAAALAAAAAAQABAAAANQSAXczoW8Sau9LwShA9AC52nFYR6ccKLgMWxmMBxwoc2dWsy2YQSGmc93IAQIppdPOMT9SgOfKioLFIHWqK9kIhhUK%2BDwN%2F5pyui0eq1dNxMAOw%3D%3D";
	}
	else {
		return "data:image/gif;base64,R0lGODlhEAAQAKIAACUlJVVVVT4%2BPvLy8pubm1RUVHFxccnJySH5BAAAAAAALAAAAAAQABAAAANQeBbczua8Sau9T4iiRdAF52nGYA5ccaLgQGymQAywoc2dasw2AAiAmc83OAgOppdPOMT9SgSfKioTFIHWqK9kOgBUK%2BDwN%2F5pyui0eq1dNxMAOw%3D%3D";
	} 
}
function us_toggleBox() {
	if (!document.getElementById('us_loginbox') || document.getElementById('us_loginbox').classList.contains('us_box_hidden')) {
		us_showBox(false);
	} else {
		us_closebox();
	}
}

// Show dialog window
// Contains either login form, or scrobble form
function us_showBox(justLoggedIn) {
	//check if scrobblerbox was dropped out of possible screen width and if reset
	if (us_getValue("us_boxpos").split('-')[0].split('px')[0] > screen.availWidth || us_getValue("us_boxpos").split('-')[0].split('px')[0] < 130 ) {
		us_saveValue('us_boxpos',(screen.availWidth)/1.3+"px-"+75+"px");
	}
	//either create loginbox
	if (!document.getElementById('us_loginbox')) {
		let loginbox = createIdElement("div","us_loginbox");
		loginbox.classList.add('us_box');
		loginbox.style.left = us_getValue('us_boxpos').split('-')[0];
		loginbox.style.top = us_getValue('us_boxpos').split('-')[1];
		document.body.insertBefore(loginbox, document.body.firstChild);
	} //or show it
	else if (document.getElementById('us_loginbox').classList.contains('us_box_hidden')) {
		let loginbox = document.getElementById('us_loginbox');
		loginbox.style.left = us_getValue('us_boxpos').split('-')[0];
		loginbox.style.top = us_getValue('us_boxpos').split('-')[1];
		loginbox.classList.remove('us_box_hidden');
	}
	if (!isLoggedIn()) {
		let cont = '<div id="us_loginbox_form">'+
		'<div class="us_error">You are currently not logged in!</div><br />'+
		'<span>Click Login below to authenticate your account</span><br/><br/>'+
		'<span style="font-style:italic;">Note: You will leave this site and be redirected here after having logged in to Last.FM </span><br/>'+
		'<br /></div><div class="us_submitbuttons"><input id="us_submit" value="Authenticate" type="submit" /></div>';
		us_boxcontent('Login to last.fm',cont);
		
		document.getElementById('us_submit').addEventListener('click', us_authenticate, false);
	} else {
		us_scrobbleform(justLoggedIn);
	}
	
}

/**
 * inserts the scrobbleform into the window
 */
function us_scrobbleform(justLoggedIn) {
	let messageText = "";
	let checkedText = "";
	let databaseFoundText = "";
	let scrobbleStatus = "";
	let feedback = getTrackInfo();
	
	let artist = decodeURIComponent(us_getTempData("artist"));
	let track = decodeURIComponent(us_getTempData("track"));
	let album = decodeURIComponent(us_getTempData("album"));
	if (artist==0 && track==0) {
		artist="";
		track="";
	}
	if (album == 0) album="";
	if (TO1Helper) {
		let restTime;
		if (us_getTempData("us_lefttoplay")) {
			restTime = us_getTempData("us_lefttoplay");
		} else {
			restTime = us_getTempData("us_secs");
		}
		scrobbleStatus = '<div id="scrobbleStatus_parent"> scrobble in <span id="scrobbleStatus" style="font-weight:bold">'+restTime+'</span> sec &nbsp;<a href="javascript:;" id="us_abortScrobbling" title="abort scrobbling">x</a></div>';
	}
	if (us_getTempData("scrobbled")==1) {
		scrobbleStatus = '<div id="scrobbleStatus_parent">scrobbled</div>';
	}
	if (justLoggedIn) {
		messageText = '<div class="us_done">Successfully logged in</div>';
	}
	let asE = us_getTempData("autoscrobbleError");
	if (asE) {
		if (asE == "failed") {
			messageText += '<div class="us_error">AutoScrobble failed. Please edit info.</div>';
		}
		if (asE == "noMusic") {
			messageText += '<div class="us_error">Track not found on <span style="font-style:italic">Last.fm</span></div>';
		}
		if (asE == "bad") {
			messageText += '<div class="us_error">Video title is not in a valid format to be scrobbled.</div>';
		}
	}
	if (us_getValue("us_autoscrobble_active", 0) == 1) {
		checkedText = " checked";
	}
	if (((feedback == "found")&&(trackInfoFromDB))) {
		databaseFoundText = '<div id="foundInDBIcon" title="Track information retrieved from personal database"></div>';
	}
	if (us_getTempData("is_full_album") == "yes") {
		databaseFoundText = '<div id="fullAlbumIcon" title="Video was recognized as a full album">Full Album: Track '+us_getTempData("full_album_track_nr")+' of '+us_getTempData("full_album_track_count")+'</div>';
	}
		
    let cont = '<div id="us_loginbox_form">'+databaseFoundText+messageText+'<form name="us_scrobbleform" onSubmit="return'+
                         ' false">Artist: <input type="text" name="artist" value="'+artist+'" /><br />' +
                         'Track: <input type="text" name="track" value="'+track+'" /><br/><a id="us_quickchange" title="Artist <-> Track" href="#"></a><a href="javascript:;" id="us_more" title="more options">+</a>'+
                         '<p id="us_hiddenform" class="us_hidden">Album title: <input type="text" name="album" value="'+album+'" /><br />'+
                         '</p>'+
                         '</form></div><div class="us_submitbuttons"><div class="us_submitbuttons_box_left" title="Activate automatic scrobbling?"><input id="us_autoscrobble" name="us_autoscrobble" type="checkbox"'+checkedText+'><label for="us_autoscrobble" style="vertical-align:middle;">Auto</label></div>'+scrobbleStatus+'<input id="us_submit" value="Scrobble" type="submit" />'+
                         '</div>';
    us_boxcontent('Scrobble to last.fm - '+us_getValue('us_username'),cont);
		
	document.getElementById('us_quickchange').addEventListener('click', us_quickchange, false);
    document.getElementById('us_submit').addEventListener('click', us_scrobblenp, false);
	document.getElementById('us_autoscrobble').addEventListener('click', function(){if (this.checked){us_saveValue("us_autoscrobble_active", 1)} else {us_saveValue("us_autoscrobble_active", 0)}}, false);
    document.getElementById('us_more').addEventListener('click', us_showmoreform, false);
	if (document.getElementById("us_abortScrobbling")) {
		document.getElementById("us_abortScrobbling").addEventListener('click', us_abortScrobbling, false);
	}
	if (us_getValue("us_more_options_show_or_hide") == "show") {
		us_showmoreform();
	} 	
}

//little box show info-messages
function us_infoBox(cont) {
    let inbox;
	if (!document.getElementById('us_infobox')) {
		inbox = createIdElement("div","us_infobox");
		inbox.classList.add('us_infobox');
		document.body.appendChild(inbox);
	}
	else {
		inbox = document.getElementById('us_infobox');
		inbox.classList.remove('us_box_hidden');
	}
	inbox.addEventListener("click", us_closeinfobox, false);
	inbox.style.cursor = "pointer";
	inbox.title = "Click to Close";
	inbox.innerHTML = cont;
}


//closes the box with fadeout effect
function us_closebox() {
	let object = document.getElementById('us_loginbox');
	object.classList.add('us_box_hidden');
}

//closes the info-box with fadeout effect
function us_closeinfobox() {
	let object = document.getElementById('us_infobox');
	object.classList.add('us_box_hidden');
}

//shows the optional data fields
function us_showmoreform() {
    let i1 = document.getElementById('us_hiddenform');
    let a = document.getElementById('us_more');

	if (i1.classList.contains('us_hidden')) {
		i1.classList.remove('us_hidden');
		a.innerHTML = '&#8722;';
		us_saveValue("us_more_options_show_or_hide", "show");
	}
	else {
		i1.classList.add('us_hidden');
		a.innerHTML = '+';
		us_saveValue("us_more_options_show_or_hide", "hide");
	}
}

/**
 * Fills window with title and content
 */
function us_boxcontent(title,content) {
	let loginbox = document.getElementById('us_loginbox');
	if (!loginbox) { return false; }
	if (loginbox.classList.contains('us_box_hidden')) {
		loginbox.style.classList.remove('us_box_hidden');
	}
	loginbox.innerHTML = '<h3 id="us_box_head">'+title+'<ul><li><a href="javascript:;" title="Close" id="us_box_close"></a></li><li><a href="javascript:;" title="Settings" id="us_box_settings"></a></li><li><a href="javascript:;" title="Help" id="us_box_help"></a></li></ul></h3>'+
	'<div>'+content+'</div>';
	document.getElementById('us_box_close').addEventListener('click', us_closebox, false);
	document.getElementById('us_box_settings').addEventListener('click', us_settings, false);
	document.getElementById('us_box_help').addEventListener('click', us_help, false);

	document.addEventListener('mousemove', us_movebox, false);
	document.getElementById('us_box_head').addEventListener('mousedown', us_moveboxd, false);
	document.getElementById('us_box_head').addEventListener('mouseup', us_moveboxu, false);
}

/**
 * Show the help-window
 */
function us_help() {
        let cont = 	'<p class="us_left">Documentation, Changelog and more can be found on the <a target="_blank" href="http://www.lukash.de/youscrobbler" title="YouScrobbler on lukash.de">YouScrobbler Website</a>.</p>'+
					'<h4>Feedback</h4><p class="us_left">Suggestions and other Questions can be posted in the <a target="_blank" href="http://www.last.fm/group/YouScrobbler/forum" title="YouScrobbler Forum">Forum</a>.</p>'+
					'<h4>Links</h4><p class="us_left"><a target="_blank" href="http://www.lukash.de/youscrobbler" title="YouScrobbler on lukash.de">YouScrobbles Website</a><br/><a target="_blank" href="http://www.last.fm/group/YouScrobbler" title="Last.fm Group">Last.fm Group</a><br/><a target="_blank" href="https://github.com/floblik/YouScrobbler" title="GitHub">GitHub repo</a><br/></p>';
        us_boxcontent('About - YouScrobbler '+VERSION,cont);
}
/**
 * Show the settings-window
 */
function us_settings() {
	let maxEntries = us_getValue("database.maxEntries", 5000);
	let cont =  '<div id="us_loginbox_form" style="text-align:left"><form name="us_settings_form" onSubmit="return false"><table style="table-layout:fixed"><tr><td class="us_settings_grp us_settings_grp_left">'+
				'<div class="us_settings_grp_heading">General</div><input type="checkbox" id="us_settings_asFailNotification" name="us_settings_asFailNotification"/><label for="us_settings_asFailNotification">error notification</label>'+
				'<br/><input type="checkbox" id="us_settings_scrobblingNotification" name="us_settings_scrobblingNotification"/><label for="us_settings_scrobblingNotification">scrobble notification</label>'+
				'<br/><hr/><label for="scrobble_at">scrobble at </label><select name="scrobble_at" id="scrobble_at"><option id="scrobble_at10" value="10">10</option><option id="scrobble_at25" value="25">25</option><option id="scrobble_at50" value="50">50</option><option id="scrobble_at75" value="75">75</option><option id="scrobble_at95" value="95">95</option></select><span>&#37;</span>'+
				'<br/><input type="checkbox" id="us_settings_autoCorrect" name="us_settings_autoCorrect"/><label for="us_settings_autoCorrect">last.fm auto correct</label></div><br/><hr/>'+
				'<div><input type="radio" id="us_settings_color_red" name="us_settings_color" value="red" /><label for="us_settings_color_red">Red</label><input type="radio" id="us_settings_color_black" name="us_settings_color" value="black" /><label for="us_settings_color_black">Black</label>'+ 
				'</td>'+
				'<td class="us_settings_grp us_settings_grp_right"><div class="us_settings_grp_heading us_settings_grp_database" title="Your custom edited track information">Database</div><span>Size: '+((us_getValue("database.id").split(" ").length) -1)+' / <select name="databaseMaxLength" id="databaseMaxLength"><option id="databaseMaxLength500" value="500">500</option><option id="databaseMaxLength5000" value="5000">5000</option><option id="databaseMaxLength-1" value="-1">unlimited</option></select></span>'+
				'<br/><br/><div class="us_settings_grp_heading">About</div>'+
				'<span>Version: '+VERSION+'</span><br/><span id="us_manualupdate"><a href="javascript:;" id="us_manualupdate_link">Check for Update</a></span></td></tr></table> '+
				'</form></div><div class="us_submitbuttons" style="text-align:right"><input type="submit" id="us_resetlogin" value="Reset Login" style="float:left"/></div>';
	
	us_boxcontent('Settings',cont);
	let us_settings_color = 'us_settings_color_' + us_getValue('us_color');
	document.getElementById(us_settings_color).setAttribute("checked", 'checked');
	if (us_getValue("asFailNotification", 0) || us_getValue("asFailNotification")=="yes"){document.getElementById('us_settings_asFailNotification').setAttribute("checked", 'checked');}
	if (us_getValue("scrobblingNotification")){document.getElementById('us_settings_scrobblingNotification').setAttribute("checked", 'checked');}
	if (us_getValue("us_autocorrect_tracks")){document.getElementById('us_settings_autoCorrect').setAttribute("checked", 'checked');}
	document.getElementById("databaseMaxLength"+maxEntries.toString()).selected = true;
	if (document.getElementById("scrobble_at"+us_getValue("scrobble_at", 75).toString())) {
		document.getElementById(("scrobble_at"+us_getValue("scrobble_at", 75).toString())).selected = true;
	} else {
		document.getElementById("scrobble_at75").selected = true;
	}
	document.getElementById('us_resetlogin').addEventListener('click', us_resetlogin, false);
	document.getElementById('us_manualupdate_link').addEventListener('click', function(){document.getElementById("us_manualupdate").innerHTML='<span class="us_status_small">checking</span>';updateCheck(true); }, false);		
	
	// Save settings
	document.getElementById('us_settings_color_red').addEventListener('change', function(){
		us_saveValue("us_color", "red");
		document.getElementById('us_icon_small').src = us_icon();
	});	
	document.getElementById('us_settings_color_black').addEventListener('change', function(){
		us_saveValue("us_color", "black");
		document.getElementById('us_icon_small').src = us_icon();
	}, false);	
	document.getElementById('us_settings_asFailNotification').addEventListener('change', function(){
		us_saveValue("asFailNotification", document.getElementById("us_settings_asFailNotification").checked);
	}, false);	
	document.getElementById('us_settings_autoCorrect').addEventListener('change', function(){
		us_saveValue("us_autocorrect_tracks", document.getElementById("us_settings_autoCorrect").checked);
	}, false);
	document.getElementById('us_settings_scrobblingNotification').addEventListener('change', function(){
		us_saveValue("scrobblingNotification", document.getElementById("us_settings_scrobblingNotification").checked);
	}, false);
	document.getElementById('databaseMaxLength').addEventListener('change', function(){
		let el = document.getElementById('databaseMaxLength');
		let text = el.options[el.selectedIndex].value;
		us_saveValue("database.maxEntries", text);
	}, false);	

	document.getElementById('scrobble_at').addEventListener('change', function(){
		let el = document.getElementById('scrobble_at');
		let text = el.options[el.selectedIndex].value;
		us_saveValue("scrobble_at", text);
	});	
}



/**
 * --- 4. Scrobbling and Login ---
 */

function isMusicVideo(infoResult){
	let artist = us_getTempData("artist").replace(' ', '+');
	let track = us_getTempData("track").replace(' ', '+');
	let url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + APIKEY + "&artist=" + artist + "&track=" + track + "&autocorrect=1&format=json";

	GM_xmlhttpRequest({
	method: "GET",
	url: url,
	onload: function(response) {
	  if(response.responseText){
		let json = JSON.parse(response.responseText);

		if (json["track"] && (json["track"]["name"] != us_getTempData("track") || json["track"]["artist"]["name"] != us_getTempData("artist")) && us_getValue("us_autocorrect_tracks") == "yes" && !json["error"]) {
			us_saveTempData("track", json["track"]["name"]);
			us_saveTempData("artist", json["track"]["artist"]["name"]);
		}
		if(json && json["track"] || trackInfoFromDB){
		  tryAutoScrobbleCallback(infoResult, true);
		  return true;
		} else
		if (json["error"]) {
			tryAutoScrobbleCallback("noMusic", false);
			return false;
		}
	  }
	  tryAutoScrobbleCallback(infoResult, false);
	  return false;
	},
	onerror: function(){
	  tryAutoScrobbleCallback(infoResult, false);
	  return false;
	},
	ontimeout: function(){
	  tryAutoScrobbleCallback(infoResult, false);
	  return false;
	}
	});
}

/**
 * Tries to AutoScrobble video if user is logged in, its a music video and the trackinfo was found
 */
function tryAutoScrobble () {
	if (us_getValue("us_autoscrobble_active", 0) == 1) {
		let response = getTrackInfo();
		if (us_getTempData("is_full_album") != "yes") {
			isMusicVideo(response);		
		}
	}
}

function tryAutoScrobbleCallback(response, musicVideo){
	if ((isLoggedIn())&&((trackInfoFromDB)||((response=="found")&&(musicVideo)))) {
		//save time page was loaded aka playstart time in ctime and gay format
		let time = new Date();
		let m = time.getUTCMonth()+1;
		let d = time.getUTCDate();
		if (m.toString().length == 1) {
		   m='0'+m;
		}
		if (d.toString().length == 1) {
		   d='0'+d;
		}
				
		us_saveTempData("us_playstart", time.getUTCFullYear()+'%2d'+m+'%2d'+d+'%20'+time.getUTCHours()+'%3a'+time.getUTCMinutes()+'%3a'+time.getUTCSeconds());
		us_saveTempData("us_playstart_s", Math.round(time.getTime()/1000));
		us_scrobble(decodeURIComponent(us_getTempData("artist")),decodeURIComponent(us_getTempData("track")),"","",0,0,1);
		return;
	} else if (response=="bad") {
		us_saveTempData("autoscrobbleError", "bad");
		scrobble_statusbar("failed");
	} else if (!musicVideo) {
		us_saveTempData("autoscrobbleError", "noMusic");
		scrobble_statusbar("failed");
	} else {
		us_saveTempData("autoscrobbleError", "failed");
		scrobble_statusbar("failed");
	}
	if (us_getValue("asFailNotification") || us_getValue("asFailNotification")=="yes") {
		us_showBox();
	}
}

function scrobble_statusbar(status) {
	if (status=="scrobble") {
		document.getElementById("us_scrobble_statusbar").style.backgroundColor = "#66CC00";
		document.getElementById("us_scrobble_statusbar").style.display = "block";
		
	} else if (status=="failed") {
		document.getElementById("us_scrobble_statusbar").style.width = "100%";
		document.getElementById("us_scrobble_statusbar").style.display = "block";
		document.getElementById("us_scrobble_statusbar").style.backgroundColor = "#CC181E";
	} else if (status=="hide") {
		document.getElementById("us_scrobble_statusbar").style.display = "none";
		document.getElementById("us_scrobble_statusbar").style.width = "0";
	}
	
}


/**
 * Redirects the user to Last FM to authenticate. When they allow they will 
 * be directed back and an authentication token will be added to the URL.
 * adapted from ScrobbleSmurf
 */
function us_authenticate() {
	let tokenRegex = /(\?|&)token=[^&?]*/gi;
	let currentURL = document.URL.replace(tokenRegex, "");
	if(currentURL.indexOf("?") === -1) {
		currentURL = currentURL.replace("&", "?");
	}
	let redirectURL = lastFmAuthenticationUrl + "?api_key=" + APIKEY +"&cb=" + currentURL;
	window.location.href = redirectURL;
}

/**
 * Attempts to get a Last FM token from the URL. If so authenticate the user.
 * adapted from ScrobbleSmurf and edited
 */
function tryGetAuthToken() {
	let url = currentURL;
	let tokenRegex = /(\?|&)token=[^]{32}/gi;
	let matches = url.match(tokenRegex);

	if(matches == null) {
		return;
	}
	let rawToken = matches[0];
	let token = rawToken.substring(7); //7, based on '?' or '&' and 'token='.

	GM_xmlhttpRequest({
		method: "GET",
		url: authenticationSessionUrl + "?token=" + token,
		headers: {
			"Accept": "text/html" 
		},
		onload: function(responseDetails) {
			let feedback = responseDetails.responseText;
			if ( ((feedback.indexOf("api-error"))==-1) && ((feedback.indexOf("token-error"))==-1) ) {
				let retrievedData = responseDetails.responseText.split(" - ");
				us_saveValue("us_username", retrievedData[0]);
				us_saveValue("us_sessionKey", retrievedData[1]);
				us_showBox(true);
			} else {
				us_showBox();
				us_resetlogin(feedback);
			}
		}
	});
}

/**
 * Srobbles a song using the saved track information
 */
function us_scrobble(artist,track,album,mbid,retry,queued,auto,full_album_scrobble) {
	let secs = us_getTempData("us_secs");
	if ((us_getTempData("scrobbled"))==1 && !queued) {
		us_saveTempData("us_leftToPlay", parseInt(us_getTempData("us_secs")*(us_getValue("scrobble_at"))*0.01));
		us_saveTempData("scrobbled", 0);
	}
	let args = "?artist=" + encodeURIComponent(artist) + "&sk=" + us_getValue("us_sessionKey") + 
	"&timestamp=" + us_getTempData("us_playstart_s") + "&track=" + encodeURIComponent(track) + "&duration=" + secs + "&yt_vid_id=" + getYouTubeVideoId();
	if (album != 0 && album != "") {
		args += "&album=" + encodeURIComponent(album);
	}
	if (mbid != 0 && mbid != "") {
		mbid==false;
		args +=  "&mbid=" + encodeURIComponent(mbid);
	}
	let time_left_to_scrobble = us_getTempData("us_leftToPlay");
	
    if (time_left_to_scrobble > 0) {
		TO1Helper = true;
		if (retry==0) {
			if (auto==1 && us_getValue("scrobblingNotification")) {
				us_infoBox('<div><span class="us_trackinfo"><span id="us_artist_display">'+artist+ '</span> <span class="sep"> - </span> <span id="us_track_display">' +track+'</span></span> '+time_left_to_scrobble+' s <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAGnRFWHRTb2Z0d2FyZQBQYWludC5ORVQgdjMuNS4xMDD0cqEAAAG4SURBVDhPdVNNS0JREL19mAV9LSRo4zqEfoK0FCKiKCyqRQuhFK2HEBRSEPmkTBCjRdHGZRD9idb2uRBavMC30EJwlW4iXnN0roxFA4d7OXPO3LlfSsbnd91z9p4xlq3Zu8Cr35EAhxw0LO+Ml8aTf9WaL0BMYzFZ3jfjdsQ07E0Tc3CcK0DLtlaAWLSmsVLVcZw9QjdhKW6HCwDNw8zloYG2XaT2VfOsWHNYGeYsoYugYBAF+pnrIWShhQdela4kDbRGcU7QZmBUFJgUPHACD7xq296orr8Fi0QOcxKrYHSLAmhfFnDBA69qVTrCvkcIsoPoPwXchBx5THibBShcnAS0OB0thXQBnA06G+Ic4JMFBkUCcOWrl80VKFKEPuYDPALedgG0Q4TeO7aRAL9mLYD3MO8jeHm+SwfY2sJWKaQPcYyTA0hkKim0fk3QV6gPGZiAB155jTeEXkJkx47d0iivVe4dXIA7N34/pEMCbgOt6i39xhS07YeEeG48yKecYKG8GayKrVxBAy08TbOOx/q9/EwXZvkAB3hMGKd5TH4maNnWGfiquY9TI2jN/PnO4JDr/M5K/QDEQYmHdixexAAAAABJRU5ErkJggg==" alt="queued" /></div>');
				window.setTimeout(function() { us_closeinfobox();}, 5000);
			} else if (us_getValue("scrobblingNotification")){
				us_boxcontent('Queued...','<div class="us_done">This will be scrobbled in '+time_left_to_scrobble+' seconds. </div>');
				window.setTimeout(function() { us_closebox(); }, 3000);
			}
		}
	}
    else {
		TO1Helper = false;
        if (queued != 1) {
			us_boxcontent('Scrobbling...',loadgif);
        }
		GM_xmlhttpRequest({
			method: "GET",
			url: scrobbleSongUrl + args,
			onload: function(responseDetails) { scrobbleFeedback (responseDetails, artist, track, queued, full_album_scrobble) },
			onerror: 	
				function() {GM_xmlhttpRequest({
					method: "GET",
					url: scrobbleSongUrl + args,
					onload: function(responseDetails) { scrobbleFeedback (responseDetails, artist, track, queued, full_album_scrobble) },
					onerror: function() {
						us_infoBox('<div class="us_error">Server error</div>');
						window.setTimeout(function() { us_closeinfobox(); }, 10000);
					}
				});}
		}); 
	}
}


 
/** 
 * Feedback on scrobbling
 */
function scrobbleFeedback (responseDetails, artist, track, queued, full_album_scrobble) {
	let feedback = responseDetails.responseText;
	us_saveTempData("scrobbled", 1);
	
	if ((feedback.indexOf('<lfm status="ok"'))!=-1) {
		TO1Helper=false;
		if (document.getElementById("scrobbleStatus_parent")) {
			document.getElementById("scrobbleStatus_parent").innerHTML = "scrobbled";
		}
		if (queued != 1) {
		   us_boxcontent('OK!','<div class="us_done"><span class="us_trackinfo"><span id="us_artist_display">'+artist+ '</span> <span class="sep">-</span> <span id="us_track_display">' +track+'</span></span> scrobbled.</div>');
		   window.setTimeout(function() { us_closebox(); }, 2000);
		}
		else {
			if (us_getValue('scrobblingNotification', 0)) {
			   us_infoBox('<div><span class="us_trackinfo">'+artist+' <span class="sep">-</span> '+track+'</span> scrobbled. <img src="data:image/gif;base64,R0lGODlhEAAQAKIAAO7w7qrZnHXGZnC6WJLJhE%2BpODGCLbrfsyH5BAAAAAAALAAAAAAQABAAAANhCLrcHmKUEZw6g4YtT8PEERBEcBCFtwyh4L5nsQTD8cLCURCKducKkgxQgACBAIIgYFAUXQ3CYNkkjgS8YIZUpdlYyQxlt9jRxBla9WLIKVlq1eJgMI8KBnnUwDdkLYAMCQA7" alt="done" /></div>');
			   window.setTimeout(function() { us_closeinfobox(); }, 3000);
			}
		}
	} else {	
			if (queued != 1) {
				us_boxcontent('Error','<div class="us_error">'+feedback+'</div>');
			}
			else {
				us_infoBox('<div class="us_error">Error: '+feedback+'</div>');
				window.setTimeout(function() { us_closeinfobox(); }, 10000);
			}
	}

	if (full_album_scrobble || us_getTempData("is_full_album") == "yes") {
		TO1Helper=true;
		us_saveTempData("scrobbled", 0);
		scrobble_statusbar("hide");
		
		us_closebox();
		
		let global_album = JSON.parse(us_getTempData("global_album"));
		let track_num = parseInt(us_getTempData("full_album_track_nr"));
		
		us_saveTempData("artist", global_album.tracks.track[track_num].artist.name);
		us_saveTempData("track", global_album.tracks.track[track_num].name);
		us_saveTempData("us_secs", global_album.tracks.track[track_num].duration);
		
		let album_left_to_play = global_album.tracks.track[track_num].duration - 1;
		us_saveTempData("us_leftToPlay", album_left_to_play);
		us_saveTempData("us_playstart", time.getUTCFullYear()+'%2d'+m+'%2d'+d+'%20'+time.getUTCHours()+'%3a'+time.getUTCMinutes()+'%3a'+time.getUTCSeconds());
		us_saveTempData("us_playstart_s", Math.round(time.getTime()/1000));
		
		track_num++;
		us_saveTempData("full_album_track_nr", track_num);
		
		us_scrobble(decodeURIComponent(us_getTempData("artist")), decodeURIComponent(us_getTempData("track")), decodeURIComponent(us_getTempData("album")), decodeURIComponent(us_getTempData("mbid")), 0, 1, 1, 1);
	}
}

/**
 * Temporary save track information from the form 
 */
function us_scrobblenp() {
	let formArtist = document.forms[0].elements[0].value;
	let formTrack = document.forms[0].elements[1].value;
	let formAlbum = document.forms[0].elements[2].value;
	if ((formArtist!="") && (formTrack!="")) {
		if (formArtist!=decodeURIComponent(us_getTempData("artist")) || formTrack!=decodeURIComponent(us_getTempData("track")) || formAlbum!=decodeURIComponent(us_getTempData("album"))) {
			saveDatabaseData(getYouTubeVideoId(), formArtist, formTrack, formAlbum);
		}
		us_saveTempData("artist", encodeURIComponent(formArtist));
		us_saveTempData("track", encodeURIComponent(formTrack));
		if (!formAlbum) { formAlbum = ''; } else {us_saveTempData("album", encodeURIComponent(formAlbum));}
		
		us_scrobble(decodeURIComponent(us_getTempData("artist")),decodeURIComponent(us_getTempData("track")),formAlbum,"",0,0,0);
	} //empty input
}

/**
 * Abort scrobbling process
 */
function us_abortScrobbling () {
	if (TO1Helper) {
		TO1Helper = false;
		if (document.getElementById("scrobbleStatus_parent")) {
			let element = document.getElementById("scrobbleStatus_parent");
			element.parentNode.removeChild(element);
		}
		
	}
	scrobble_statusbar("hide");
}

/**
 * Unset the saved login info + show login form, and maybe show errors
 */
function us_resetlogin(error) {
	us_saveValue('us_username','');
	us_saveValue('us_sessionKey','');
	let cont = '';
	let resetInfo = "";
	if (!error) {
		resetInfo = '<div class="us_done">Successfully reset the login credentials</div><br />';
	}
	if ((error != '[object MouseEvent]') && (error != '[object XPCNativeWrapper [object MouseEvent]]')) { cont = '<p class="us_error">Error: '+error+'</p>'; }
	cont = cont+'<div id="us_loginbox_form">'+
		resetInfo+
		'<span>Click Login below to authenticate your account</span><br/><br/>'+
		'<span style="font-style:italic;">Note: You will leave this site and be redirected here after having logged in to Last.FM </span><br/><br /></div><div class="us_submitbuttons"><input id="us_submit" value="Authenticate" type="submit" /></div>';
	us_boxcontent('Login to last.fm',cont);
	document.getElementById('us_submit').addEventListener('click', us_authenticate, false);
}



/**
 * --- 5. Information request ---
 */

/**
 * Check whether user credentials are stored or not.
 */
function isLoggedIn() {
	if((!us_getValue("us_username", 0)) || (!us_getValue("us_sessionKey", 0))) {
		return false;
	}
	return true;
}

/**
 * Gets the current YouTube video ID from the browser URL.
 * adapted from ScrobbleSmurf
 */
function getYouTubeVideoId () {
	let regex = /(\?|%3F|&|%26)v=[^?&#]*/gi;
	let removeRegex = /(\?|%3F|&|%26)v=/gi;
	let matches = document.URL.match(regex);	

	if(matches == null) {
		if (document.getElementById("c4-player")) {
			let playerNode  = document.getElementById("c4-player");
			matches = playerNode.getVideoUrl().match(regex);
		}
		return null;
	}
	let vidId = matches[0].replace(removeRegex, "");
	return vidId;
}

/**
 * Detects the track information from the video title and temporarily saves it
 */
function getTrackInfo(){
	let feedback;	

	if ((us_getTempData("artist")!=0) || (us_getTempData("track")!=0)) {
		feedback = "found";
	} else {
		let titleContentOriginal;
		if (location.href.indexOf("youtube.com/user/") != -1) {
			if (document.getElementById("playnav-curvideo-title")) {
				titleContentOriginal = document.getElementById("playnav-curvideo-title").getElementsByTagName("a")[0].textContent;
			} else if (document.getElementsByClassName("channels-featured-video-details tile")[0]) {
				titleContentOriginal = document.getElementsByClassName("channels-featured-video-details tile")[0].getElementsByTagName("a")[0].textContent;
			}
		} else {
			//Feather check
			if (document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0]) {
				titleContentOriginal = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].textContent;
			} else if (document.getElementById("eow-title")) {
				titleContentOriginal = document.getElementById("eow-title").textContent;
			} else if (document.getElementById("watch-headline-title")) {
				titleContentOriginal = document.getElementById("watch-headline-title").textContent;
			} else if (document.getElementById("vt")) {
				titleContentOriginal = document.getElementById("vt").textContent;
			}
		}

		//Retrieve track information from database
		if (getDatabaseData()==true) {
			feedback = "found";
			trackInfoFromDB = true;
		} else {
			//New detection of track information
			//remove (*) and/or [*] to remove unimportant data
			let titleContent = titleContentOriginal.replace(/ *\([^)]*\) */g, ' ');
			titleContent = titleContent.replace(/ *\[[^)]*\] */g, ' ');

			//remove HD info
			titleContent = titleContent.replace(/\W* HD( \W*)?/, '');
			titleContent = titleContent.replace(/\W* HQ( \W*)?/, '');
			
			//get remix info
			let remixInfo = titleContentOriginal.match(/\([^)]*(?:remix|mix|cover|version|edit|booty?leg)\)/i);

			let musicInfo = titleContent.split(" - ");
			if (musicInfo.length == 1) {
				musicInfo = titleContent.split("-");
			}
			if (musicInfo.length == 1) {
				musicInfo = titleContent.split("‎–");
			}
			if (musicInfo.length == 1) {
				musicInfo = titleContent.split(":");
			}
			if (musicInfo.length == 1) {
				musicInfo = titleContent.split(' "');
			}

			//format feat. info
			for (let i=0;i<musicInfo.length;i++) {
				musicInfo[i] = musicInfo[i].replace(/ feat. /, ' feat. ');
				musicInfo[i] = musicInfo[i].replace(/ feat /, ' feat. ');
				musicInfo[i] = musicInfo[i].replace(/ ft. /, ' feat. ');
				musicInfo[i] = musicInfo[i].replace(/ ft /, ' feat. ');
			}
			
			//remove " and ' from musicInfo
			for (let i=0;i<musicInfo.length;i++) {
				musicInfo[i] = musicInfo[i].replace(/^\s*"|"\s*$/g, '');
				musicInfo[i] = musicInfo[i].replace(/^\s*'|'\s*$/g, '');
			}

			if ((musicInfo.length == 1)||(musicInfo[0] == false) || (musicInfo[1] == false)) {
				musicInfo[0] = "";
				musicInfo[1] = "";
				feedback = "notFound";
			} else {				
				feedback = "found";
			}
			
			musicInfo[1] = musicInfo[1].replace(/(\.avi)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.wmv)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.mp4)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.mpeg4)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.mov)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.3gpp)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.flv)$/gi, '');
			musicInfo[1] = musicInfo[1].replace(/(\.webm)$/gi, '');
			
			//Full Album Video
			if (titleContentOriginal.match(/Full Album/i)) {
				musicInfo[1] = musicInfo[1].replace(/Full Album/i, '');
			} else {
				//move feat. info from artist to track
				if (musicInfo[0].match(/ feat.* .*/)) {
					musicInfo[1] = musicInfo[1] + musicInfo[0].match(/ feat.* .*/);
					musicInfo[0] = musicInfo[0].replace(/ feat.* .*/, '');
				}
				
				//add remix info
				if(remixInfo && remixInfo.length == 1){
				  musicInfo[1] += " " + remixInfo[0];
				}
			}
			
			//delete spaces
			musicInfo[0] = musicInfo[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			musicInfo[1] = musicInfo[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			
			
			if (us_getValue("us_autoscrobble_active", 0) == 1) {
				if ((musicInfo.length != 2)) {
					feedback = "bad";
				}
			}

			if (!us_getTempData("artist") && musicInfo[0] != 0) {
				us_saveTempData("artist", encodeURIComponent(musicInfo[0]));
			}
			
			if (!us_getTempData("track") && musicInfo[1] != 0) {
				us_saveTempData("track", encodeURIComponent(musicInfo[1]));
			}
		}
		
		//Full Album Video
		if (titleContentOriginal.match(/Full Album/i)) {
			us_saveTempData("is_full_album", "yes");
			getAlbumInfo();
		}
	}
	return feedback;
}

/**
 * Fetch full album info from last.fm API
 */
function getAlbumInfo(){
	let artist = decodeURIComponent(us_getTempData("artist"));
	let albumName = decodeURIComponent(us_getTempData("track"));
	let url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + APIKEY + "&artist=" + artist.replace(' ', '+') + "&album=" + albumName.replace(' ', '+') + "&format=json";
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function(response) {
		  //console.log(response); //TODO: if Album not found -> reset
		  if(response.responseText){
			let json = JSON.parse(response.responseText);
			response = response.responseText;
			
			let album = json.album;
			
			if(album.artist == artist && album.name == albumName && album.tracks.track.length > 1){
				us_saveTempData("is_full_album", "yes");
				
				us_saveTempData("global_album", JSON.stringify(album));
				
				us_saveTempData("full_album_track_nr", 1);
				let track_num = us_getTempData("full_album_track_nr") - 1;

				us_saveTempData("full_album_track_count", album.tracks.track.length);
				
				us_saveTempData("us_secs", album.tracks.track[track_num].duration);
				
				let album_left_to_play = album.tracks.track[track_num].duration - 1;
				us_saveTempData("us_leftToPlay", album_left_to_play);
			
				us_saveTempData("artist", album.tracks.track[track_num].artist.name);
				us_saveTempData("track", album.tracks.track[track_num].name);	
				
				response = getTrackInfo();		
				isMusicVideo(response);	
			} else {
				us_saveTempData("is_full_album", 0);
			}
		  }
		},
		onerror: function(){
			//alert("failed");
		},
		ontimeout: function(){
		  //tryAutoScrobbleCallback(infoResult, false);
		}
	});
} 


/**
 * database track information
 */
function getDatabaseData () {
	let id = getYouTubeVideoId();
	if ((us_getValue("database.id", 0)!=0) && (us_getValue("database.id", 0).search(id) != -1)) {
		let ids = us_getValue("database.id", 0).split(" ");
		let artists = us_getValue("database.artist", 0).split(" ");
		let tracks = us_getValue("database.track", 0).split(" ");
		let index = 0;
		for (let i=0;i<ids.length;i++) {
			if (ids[i]==id) {
				index=i;
				i=ids.length;
			}
		}
		if (!us_getTempData("artist")) {
			us_saveTempData("artist", artists[index]);
		}
		if (!us_getTempData("track")) {
			us_saveTempData("track", tracks[index]);
		}
		ids.splice(ids.length,0,ids[index]);
		ids.splice(index,1);
		artists.splice(artists.length,0,artists[index]);
		artists.splice(index,1);
		tracks.splice(tracks.length,0,tracks[index]);
		tracks.splice(index,1);
		us_saveValue("database.id", ids.join(" "));
		us_saveValue("database.artist", artists.join(" "));
		us_saveValue("database.track", tracks.join(" "));
		//retrieve Album title
		if (us_getValue("database_additional.id", 0).search(id) != -1) {
			let Aids = us_getValue("database_additional.id", 0).split(" ");
			let albumtitles = us_getValue("database_additional.albumtitle", 0).split(" ");
			let index = 0;
			for (let i=0;i<Aids.length;i++) {
				if (Aids[i]==id) {
					index=i;
					i=Aids.length;
				}
			}
			if (!us_getTempData("album")) {
				us_saveTempData("album", albumtitles[index]);
			}
		}
		return true;
	}
	else {
		return false;
	}
}

function saveDatabaseData(id, artist, track, album) {
	//Edit existing entry
	if ((us_getValue("database.id", 0)!=0) && (us_getValue("database.id", 0).search(id) != -1)) {
		let ids = us_getValue("database.id", 0).split(" ");
		let artists = us_getValue("database.artist", 0).split(" ");
		let tracks = us_getValue("database.track", 0).split(" ");				
		let index = 0;
		for (let i=0;i<ids.length;i++) {
			if (ids[i]==id) {
				index=i;
				i=ids.length;
			}
		}
		ids.splice(ids.length,0,ids[index]);
		ids.splice(index,1);
		artists.splice(artists.length,0,encodeURIComponent(artist));
		artists.splice(index,1);
		tracks.splice(tracks.length,0,encodeURIComponent(track));
		tracks.splice(index,1);
		us_saveValue("database.id", ids.join(" "));
		us_saveValue("database.artist", artists.join(" "));
		us_saveValue("database.track", tracks.join(" "));
	} else {
	//New entry
		let ids = us_getValue("database.id", 0).split(" ");
		if ((us_getValue("database.maxEntries", 5000)=="-1")||(ids.length<us_getValue("database.maxEntries", 5000))) {
			//New Entry
			us_saveValue("database.id", (us_getValue("database.id", 0)+" "+id));
			us_saveValue("database.artist", (us_getValue("database.artist", 0)+" "+encodeURIComponent(artist)));
			us_saveValue("database.track", (us_getValue("database.track", 0)+" "+encodeURIComponent(track)));
		} else {
			//Already maximum number of entries -> delete oldest and insert new
			let artists = us_getValue("database.artist", 0).split(" ");
			let tracks = us_getValue("database.track", 0).split(" ");
			ids.splice(ids.length,0,id);
			ids.splice(0,1);
			artists.splice(artists.length,0,encodeURIComponent(artist));
			artists.splice(0,1);
			tracks.splice(tracks.length,0,encodeURIComponent(track));
			tracks.splice(0,1);
			us_saveValue("database.id", ids.join(" "));
			us_saveValue("database.artist", artists.join(" "));
			us_saveValue("database.track", tracks.join(" "));
		}
	}
	
	//Save additional information about the track (Album title)
	if (album!=0) {
		if ((us_getValue("database_additional.id", 0)!=0) && (us_getValue("database_additional.id", 0).search(id) != -1)) {
			let Aids = us_getValue("database_additional.id", 0).split(" ");
			let albumtitles = us_getValue("database_additional.albumtitle", 0).split(" ");
			let index = 0;
			for (let i=0;i<Aids.length;i++) {
				if (Aids[i]==id) {
					index=i;
					i=Aids.length;
				}
			}
			Aids.splice(Aids.length,0,id);
			Aids.splice(index,1);
			albumtitles.splice(albumtitles.length,0,encodeURIComponent(album));
			albumtitles.splice(index,1);
			us_saveValue("database_additional.id", Aids.join(" "));
			us_saveValue("database_additional.albumtitle", albumtitles.join(" "));
		} else {
			us_saveValue("database_additional.id", us_getValue("database_additional.id", "") + " " + encodeURIComponent(id));
			us_saveValue("database_additional.albumtitle", us_getValue("database_additional.albumtitle", "") + " " + encodeURIComponent(album));
		}		
	}
}



/**
 * --- 6. Miscellaneous ---
 */
/**
 * 
 *
 */
function us_ajax_scanner () {
	let leftToPlay = parseInt(us_getTempData("us_leftToPlay"));
	let secs = parseInt(us_getTempData("us_secs"));
	let scrobble_at = parseInt(us_getValue("scrobble_at"));
	
	if (!getYouTubeVideoId()) {
		us_saveTempData("us_reset_now", "1");
		
		setTimeout(function () {us_ajax_scanner()}, 5000);
	} else {
		setTimeout(function () {us_ajax_scanner()}, 1000);
		
		if (us_getTempData("video_is_playing", 0) == 1 && us_getTempData("us_reset_now")!="1" && leftToPlay >= 1 && !us_getTempData("autoscrobleerror")) {
			us_saveTempData("us_leftToPlay", parseInt(leftToPlay-1));
			if (document.getElementById("scrobbleStatus")) {
				document.getElementById("scrobbleStatus").innerHTML = leftToPlay-1;
			}

			if (TO1Helper) {
				scrobble_statusbar("scrobble");
				if (us_getTempData("is_full_album") == "yes") {
					document.getElementById("us_scrobble_statusbar").style.width = Math.round(100-100*((leftToPlay-1)/(secs*(100)*0.01)))+"%";
				} else {
					document.getElementById("us_scrobble_statusbar").style.width = Math.round(100-100*((leftToPlay-1)/(secs*((scrobble_at)*0.01))))+"%";
				}
			}
		}

		if (us_getTempData("video_end_reached") == "yes" && us_getTempData("video_is_playing", 0) == 1) {
			us_saveTempData("us_reset_now", "1");
			us_saveTempData("video_end_reached", 0);
		}
		
		leftToPlay = us_getTempData("us_leftToPlay");
		if (leftToPlay <= 0 && us_getTempData("scrobbled") != 1 && TO1Helper && secs > 30) {
			leftToPlay = 0;
			TO1Helper=false;
			if (document.getElementById("scrobbleStatus")) {
				document.getElementById("scrobbleStatus_parent").innerHTML = "submitting...";
			}
			us_scrobble(decodeURIComponent(us_getTempData("artist")), decodeURIComponent(us_getTempData("track")), decodeURIComponent(us_getTempData("album")), decodeURIComponent(us_getTempData("mbid")), 0, 1, 1);
		}
		//check for reset -> ajax youtube change
		if (us_getTempData("us_reset_now")=="1") {
			us_saveTempData("us_reset_now", "0");
			us_reset();
		}
	}
}

/**
 * Quickchange artist <-> track in scrobble-form
 */
function us_quickchange() {
	let artist = document.forms[0].elements[0].value;
	document.forms[0].elements[0].value = document.forms[0].elements[1].value;
	document.forms[0].elements[1].value = artist;
}

/**
 * Checks if its first run or if updated
 */
function checkFirstRun () {
	let localVersion = us_getValue("us_local_version", 0);
	if (localVersion == 0) {
		initPreferences();
		us_showBox();
		let cont = '<div id="us_loginbox_form">'+
		'<h4>Welcome to YouScrobbler!</h4><br/>'+
		'<span>Join the <a target="_blank" href="http://www.last.fm/group/YouScrobbler">Last.fm Group</a> to stay up to date.</span><br/><br/>'+
		'<span>Description and documentation can be found on the <a target="_blank" href="http://www.lukash.de/youscrobbler">Homepage</a>.</span><br/><br/>'+
		'</div><div class="us_submitbuttons"><input id="us_submit" value="Next" type="submit" /></div>';
		us_boxcontent('First Run',cont);
		document.getElementById('us_submit').addEventListener('click', us_showBox, false);
		us_saveValue("us_local_version", VERSION);
	} else if (localVersion < VERSION) {
		initPreferences();
		us_showBox();
		let cont = '<div id="us_loginbox_form">'+
		'<div class="us_done">Welcome to YouScrobbler  '+VERSION+'.</div><br/>'+
		'<span>Changelog can be found on the <a target="_blank" href="http://www.lukash.de/youscrobbler">Web page</a>.</span><br/>'+
		'<br/>'+
		'<br/>'+
		'<h4>Join the <a target="_blank" href="http://www.last.fm/group/YouScrobbler" title="Last.fm Group">Last.fm Group</a> to stay tuned</h4>'+
		'<br /></div><div class="us_submitbuttons"><input id="us_submit" value="Close" type="submit" /></div>';
		us_boxcontent('Successfully Updated',cont);
		document.getElementById('us_submit').addEventListener('click', us_closebox, false);
		us_saveValue("us_local_version", VERSION);
	}
}


/**
 * --- 7. Update ---
 *
 * Edited version of Script Update Checker (http://userscripts.org/scripts/show/20145)
 */
function updateCheck(forced)
{
	let update_interval = 86400000;
	if ((forced) || ((parseInt(us_getValue('us_last_update', '0')) + update_interval) <= parseInt(((new Date()).getTime())))) { // Checks every day (24 h * 60 m * 60 s * 1000 ms)
		try
		{
			GM_xmlhttpRequest(
			{
				method: 'GET',
				url: updateUrl(),
				onload: function(resp)
				{
					let local_version, remote_version, response;
					response=resp.responseText;
					us_saveValue('us_last_update', new Date().getTime()+'');
					remote_version=response.split(" ")[0];
					local_version=VERSION;
					let scriptDownloadUrl = "http://youscrobbler.lukash.de/youscrobbler_"+remote_version.replace(/\./g, "")+".user.js";
					if (remote_version > local_version)
					{
						let cont =  '<div id="us_loginbox_form"><span>YouScrobbler '+ String(remote_version) +' is available.</span><br/>'+
									'<span>Changes are applied after new page load.</span><br/>'+
									'<br/>'+
									'Problem updating?<br/>'+
									'Try via Greasemonkey (Addons/UserScripts)'+
									'</div><div class="us_submitbuttons"><input id="us_submit" value="Install Update" type="submit" /></div>';
						us_boxcontent('Update available',cont);
						document.getElementById('us_submit').addEventListener('click', function(){window.open(scriptDownloadUrl, "_blank");}, false);
					}
					else if (forced) {
						document.getElementById("us_manualupdate").firstChild.innerHTML = "No Update available";
					}
				},
				onerror: function () {
					if ((forced)) {
						let cont =  '<div id="us_loginbox_form"><div class="us_error">Checking for an update has failed. Try again later.</div><br/>'+
									'<br/>'+
									'<br/>'+
									'</div><div class="us_submitbuttons"><input id="us_submit" value="Check again" type="submit" /></div>';
						us_showBox();
						us_boxcontent('Checking for update failed',cont);
						document.getElementById('us_submit').addEventListener('click', function(){updateCheck(true);}, false);
					} else {
						us_infoBox('<div class="us_error">Checking for update failed</div>');
						window.setTimeout(function() { us_closeinfobox(); }, 5000);
					}
				}
			});
		}
		catch (err)
		{
			if ((forced)) {
						let cont =  '<div id="us_loginbox_form"><div class="us_error">Checking for an Updated has failed. Try again later.<br/>Error:<br/>'+
									err+'</div><br/>'+
									'<br/>'+
									'<br/>'+
									'</div><div class="us_submitbuttons"><input id="us_submit" value="Check again" type="submit" /></div>';
						us_showBox();
						us_boxcontent('Checking for update failed',cont);
						document.getElementById('us_submit').addEventListener('click', function(){updateCheck(true);}, false);
			} else {
				us_infoBox('<div class="us_error">Checking for update failed: '+err+'</div>');
				window.setTimeout(function() { us_closeinfobox(); }, 5000);
			}
		}
	}
}


if (window.top === window.self) {
	init();

	updateCheck(false);
}
