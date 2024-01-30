# OpenLP V3 Custom-Stage-Views
A collection of Custom Stage views for OpenLP v3

Twsted with V3.1 rc4 should work with all versions of OpenLP v3

# Installation instructions

Download the 'stages' folder above and copy it to the data folder of your OpenLP folder. Please include all the files.

Insure the 'Remote Plugin' is enabled. 

To use in OBS you need to use the 'Browser Source'. Point them the stage view url with the folder name inside 'Stage'

EG: If you want to view the lower third you would point to the following link.

  http://{yourremote}:4316/stage/LowerThird
  

OBS web sockets is not working at the moment. Updates to come.
Update: I have modified the stage views so that OBS remote is not required - Each stage view will check and see the type matches and OPenLP is live. This means you can create one scene on OBS with your choice od view for Bibles or Songs and Esch stage view will dynamically hide themselves depending on what OpenLP is currently displaying.


Print song removed. 

Chords and video backgrounds are part of v3 so they have been removed


OBS Websockets taken from a community member here
https://forums.openlp.org/discussion/5336/tutorial-how-to-control-obs-via-openlp-custom-stage-view


Updates:

As of 30 January 2024 the following features of this collection

Bible - Left algined full page.
Bible_Centre - Centres the text on the page
Bible-CL - A lower third dusplay of bible verses
Bible-CL-shadow - A lower Third of bible veses with a semu transparent black backround
Bible-Right  - Right aligned full page bible view
LowerThird - 4 line lower third - transparent background
LowerThird-shadow -  A 4 line lower third with a semi transparent black background
txt-OpenLPCords - A tool to convert plain text chords to CordPro format for importing into OpenLP

Each stage view is ethier a bible voew or song view. They will be blank if the current slide is not the same type.
Each stage view will only display if OpenLP is set to 'LIVE' all other modes will return a blank page.




Thanks
