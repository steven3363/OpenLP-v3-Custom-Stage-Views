# OpenLP V3 Custom-Stage-Views - Updated 12 March 2026
A collection of Custom Stage views for OpenLP v3

Tested with V3.1.6 linux should work with all versions of OpenLP v3 and with OBS 32.0.4 linux
#have had comments on Mac that the stage view flases in OBS. 

# Now with multi-view stage view ....

# Installation instructions

Download the 'stages' folder above and copy it to the data folder of your OpenLP folder. Please include all the files.

Insure the 'Remote Plugin' is enabled. 

To use in OBS you need to use the 'Browser Source'. Point them the stage view url with the folder name inside 'Stage'

EG: If you want to view the lower third you would point to the following link.

  http://{yourremote}:4316/stage/LowerThird

OBS web sockets is not working at the moment. Updates to come.
Update: I have modified the stage views so that OBS remote is not required - Each stage view will check and see the type matches and OpenLP is live. This means you can create one scene on OBS with your choice of view for Bibles or Songs and Esch stage view will dynamically hide themselves depending on what OpenLP is currently displaying.

Print song removed. 

Chords and video backgrounds are part of v3 so they have been removed

OBS Websockets taken from a community member here
https://forums.openlp.org/discussion/5336/tutorial-how-to-control-obs-via-openlp-custom-stage-view


# Current Stage Views


Bible - Left algined full page.

Bible_Centre - Centres the text on the page

Bible-CL - A lower third of bible verses

Bible-CL-shadow - A lower Third of bible veses with a semu transparent black backround

Bible-Right  - Right aligned full page bible view

LowerThird - 4 line lower third - transparent background

LowerThird-shadow -  A 4 line lower third with a semi transparent black background

OpenLPLive - Multi theme stage view - you can set one for song and one for bibles

OpenLPMain - A expermental view to replicate the main in house display.

txt-OpenLPCords - A tool to convert plain text chords to CordPro format for importing into OpenLP


# Updates:
# 12 Mar 2026
It has been awhile. I added 2 new stage views. 
OpenLPLive - Multi theme stage view - you can set one for song and one for bibles
OpenLPMain - A expermental view to replicate the main in house display.

These are a lttle diffent, they run as multiview syle - you set a them for ´Śongs´ and another for ´Bible´

Done via themeset.sh (linux tested and working) and themeset.bat (windows not tested) 
This must be run before using.  

In OBS or other streaming platform all you now need to do is add 1 stage view, 

OpenLPMain is an expermental stage view simular to OpenLPLive. At this stage it allows for a video background. 
in the ´css´ folder there is a video folder and you can change the openlp.mp4 video to one you like. Just make sure the name is the same. 

I eventually want this to mimic the output of the main displayout - as of writting there are issues in Wayland with video backgrounds. 

I hope to look at the theme names set by the song and set the background colour, image or video. May even try and support live webcams. 

Anyway enjoy!


# 30 Jan 2024
As of 30 January 2024 the following features of this collection

Bible - Left algined full page.

Bible_Centre - Centres the text on the page

Bible-CL - A lower third of bible verses

Bible-CL-shadow - A lower Third of bible veses with a semu transparent black backround

Bible-Right  - Right aligned full page bible view

LowerThird - 4 line lower third - transparent background

LowerThird-shadow -  A 4 line lower third with a semi transparent black background

txt-OpenLPCords - A tool to convert plain text chords to CordPro format for importing into OpenLP





Each stage view is ethier a bible voew or song view. They will be blank if the current slide is not the same type.
Each stage view will only display if OpenLP is set to 'LIVE' all other modes will return a blank page.




Thanks
