# YouScrobbler
Userscript for Firefox and Chrome for scrobbling to last.fm on YouTube - <a href="http://www.lukash.de/youscrobbler">YouScrobbler Homepage</a>

<b>UPDATE 2018: Endpoint on server taken offline</b>
<br/>
<b>NOT WORKING CURRENTLY - Feel free to adapt the code</b>

<h2>Key Features:</h2>

   track information detection,
   automatic or manual scrobbling,
   saving of manual trackinfo edits

<h2>Installation</h2>
Mozilla Firefox:

   Install the addon Violentmonkey
   Download YouScrobbler on the website or via GitHub and install in Violentmonkey.
   
   https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
    

Google Chrome:

  Install the addon Violentmonkey
  Download YouScrobbler on the website or via GitHub and install in Violentmonkey.
  
  https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
  

<h2>Features</h2>
Scrobbling
YouScrobbler starts scrobbling automatically if track couold be found on Last.fm. By default, Last.fm corrections are accepted. The time point on which the track is scrobbled can be customized.

Automatic Scrobbling

Videos only get automatically scrobbled if the trackinformation could be retrived.
If not a warning window will open so you have to edit the data manually. The behaviour can be changed in the YouScrobbler settings.

Automatic identification of trackinformation (Artist, Track)

YouScrobbler will try to analyze Artist and Track from the YouTube Video-Title.
So this must be in the format artist – track. The format artist-track is also supported.
The following characters get deleted: “ and ‘. Brackets(( & [) and their content get deleted, too.
Database saving

Whenever you edit the automatic detected trackinfromation or enter ones by yourself, this changes are saved in your personal database. This database is located on your computer and saves the right artist- and trackname of the corresponding YouTube videos.



server shutdown - 2018
initial release – 11/2011
