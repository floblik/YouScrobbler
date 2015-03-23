# YouScrobbler
Userscript for Firefox and Chrome for scrobbling to last.fm on YouTube - <a href="http://www.lukash.de/youscrobbler">YouScrobbler Homepage</a>


<h2>Key Features:</h2>

   Track information is retrived from the video title and must match the Last.fm database
   Manual and automatic scrobbling
   Edits of track information are saved in your browser storage

<h2>Installation</h2>
Mozilla Firefox:

   Install the addon Greasemonkey (& restart Firefox for the addon to work)
   Download YouScrobbler by clicking on the download-button. A little Greasemonkey-window opens where you can install    YouScrobbler.
    

Google Chrome:

  Install the addon Tampermonkey
  Download YouScrobbler by clicking on the download-button. A Tampermonkey-window opens where you can install         YouScrobbler.

<h2>Features</h2>
Scrobbling
Videos get scrobbled at the point, you watched 50% of the video and automaticly only if the track is registered in the Last.fm database.
Automatic Scrobbling

Videos only get automaticly scrobbled if the video is in the category music and a/the Trackinformation could be found (of course).
If not a warning window will open so you have to edit the data manually. This behaviour can be changed in the YouScrobbler settings.
Automatic identification of trackinformation (Artist, Track)

YouScrobbler will try to analyze Artist and Track from the YouTube Video-Title.
So this must be in the format artist – track. The format artist-track is also supported.
The following characters get deleted: “ and ‘. Brackets(( & [) and their content get deleted, too.
Database saving

Whenever you edit the automatic detected trackinfromation or enter ones by yourself, this changes are saved in your personal database. This database is located on your computer and saves the right artist- and trackname of the corresponding youtube videos.


<h2>Changelog</h2>

    1.2.6 settings redone; notifications; albumtitle saving
    1.2.4 fixed scrobbling in chrome
    1.2.3 tweaked trackinformation algorithm, option to join beta-channel
    0.9.0 - initial release – 11/2011
