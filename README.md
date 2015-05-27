# YouScrobbler
Userscript for Firefox and Chrome for scrobbling to last.fm on YouTube - <a href="http://www.lukash.de/youscrobbler">YouScrobbler Homepage</a>


<h2>Key Features:</h2>

   track information detection,
   automatic or manual scrobbling,
   saving of manual trackinfo edits

<h2>Installation</h2>
Mozilla Firefox:

   Install the addon Greasemonkey (& restart Firefox for the addon to work).
   Download YouScrobbler on the website or via GitHub and install in Greasemonkey.
    

Google Chrome:

  Install the addon Tampermonkey
  Download YouScrobbler on the website or via GitHub and install in Tampermonkey.

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




initial release – 11/2011
