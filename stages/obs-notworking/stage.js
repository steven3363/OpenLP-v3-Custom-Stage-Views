/******************************************************************************
 * OpenLP - Open Source Lyrics Projection                                      *
 * --------------------------------------------------------------------------- *
 * Copyright (c) 2008-2017 OpenLP Developers                                   *
 * --------------------------------------------------------------------------- *
 * This program is free software; you can redistribute it and/or modify it     *
 * under the terms of the GNU General Public License as published by the Free  *
 * Software Foundation; version 2 of the License.                              *
 *                                                                             *
 * This program is distributed in the hope that it will be useful, but WITHOUT *
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or       *
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for    *
 * more details.                                                               *
 *                                                                             *
 * You should have received a copy of the GNU General Public License along     *
 * with this program; if not, write to the Free Software Foundation, Inc., 59  *
 * Temple Place, Suite 330, Boston, MA 02111-1307 USA                          *
 ******************************************************************************/
window.OpenLP = {
  loadService: function (event) {
    $.getJSON(
      "/api/service/list",
      function (data, status) {
        for (idx in data.results.items) {
          idx = parseInt(idx, 10);
          if (data.results.items[idx]["selected"]) {
            // inserted for OBS control, I want to be able to read out the information
            OpenLP.currentTitle = data.results.items[idx]["title"];
            OpenLP.currentNotes = data.results.items[idx]["notes"];
            //OpenLP.currentText = data.results.items[idx]["text"];//better for hidden text
            //alert(OpenLP.currentTextm);
            OpenLP.currentPlugin = data.results.items[idx]["plugin"];
            // see CSS file
            $("#currentslide").attr("data-plugin", OpenLP.currentPlugin);
            break;
          }
        }
        OpenLP.updateSlide();
      }
    );
  },
  loadSlides: function (event) {
    $.getJSON(
      "/api/controller/live/text",
      function (data, status) {
        OpenLP.currentSlides = data.results.slides;
        OpenLP.currentSlide = 0;
        $.each(data.results.slides, function(idx, slide) {
          if (slide["selected"])
            OpenLP.currentSlide = idx;
        })
        OpenLP.loadService();
      }
    );
  },
  updateSlide: function() {
    // Show the current slide on top. Any trailing slides for the same verse
    // are shown too underneath in grey.
    // Then leave a blank line between following verses
    var slide = OpenLP.currentSlides[OpenLP.currentSlide];
    var text = "";
    // use title if available
    if (slide["title"]) {
        text = slide["title"];
    } else {
        text = slide["text"];
    }
    // use thumbnail if available
    if (slide["img"]) {
        text += "<br /><img src='" + slide["img"].replace("/thumbnails/", "/thumbnails320x240/") + "'><br />";
    }
    // use slide_notes if available
    if (slide["slide_notes"]) {
        text += '<br />' + slide["slide_notes"];
    }
    // for OBS, I like replacing new lines by forward slashes
    text = text.replace(/\n/g, " / ");
    $("#currentslide").html(text);

    OpenLP.obsRemote();
  },
  pollServer: function () {
  	
    $.getJSON(
      "/api/poll",
      function (data, status) {
      
       
        
        if (OpenLP.currentItem != data.results.item ||
            OpenLP.currentService != data.results.service) {
          OpenLP.currentItem = data.results.item;
          OpenLP.currentService = data.results.service;
          OpenLP.loadSlides();
          // also triggers loadService(), which triggers updateSlide()
        }
        else if (OpenLP.currentSlide != data.results.slide) {
          OpenLP.currentSlide = parseInt(data.results.slide, 10);
          var obsslide = OpenLP.currentSlides[OpenLP.currentSlide];
	  OpenLP.currentText = obsslide["text"];
          OpenLP.updateSlide();
        }
       //inserted for being able to control OBS by display style
       
        if(data.results.blank) {
          OpenLP.currentlyShowing = "blank";
        }
        else if(data.results.theme) {
          OpenLP.currentlyShowing = "theme";
        }
        else if(data.results.display) {
          OpenLP.currentlyShowing = "display";
        }
        else {
          OpenLP.currentlyShowing = "slides";
        }
        
        //get text of slide
        OpenLP.obsRemote();
      }
    );
  },
  obsRemote: function () {
    /*
    A list of all the information that could be useful to remote control OBS:
    pollServer() evaluates /api/poll, provides
    - OpenLP.currentlyShowing: blank|theme|display|slides
    loadService() evaluates /api/poll, provides
    - OpenLP.currentPlugin
    - OpenLP.currentTitle
    loadSlides() evaluates /api/controller/live/text, provides
    - OpenLP.currentSlides[OpenLP.currentSlide]["text"]
    - OpenLP.currentSlides[OpenLP.currentSlide]["html"]
    - OpenLP.currentSlides[OpenLP.currentSlide]["tag"]

    obs-websocket-js documentation at:
    https://github.com/haganbmj/obs-websocket-js

    obs-websocket controls can be found at:
    https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md
    
    This Code was modified from 
    https://forums.openlp.org/discussion/5336/tutorial-how-to-control-obs-via-openlp-custom-stage-view
    Thank you - 
    */

   	obs = new OBSWebSocket();
	

	//Change only these
	//connection settings
	obsAddress = "localhost:4444";
	obsPassword= "";
	defscene = "default";
	
	//MediaGroupScene
	mediascene="LowerThirds";

	//Song
	songscene="worship";
	songsource="openlplower";

	//bible
	bibscene="bible";
	bibsource="bibleright";

	//presentation  ****Dont  forget to uncomment bellow if you set these
	presscene="Scene-Name";
	pressource="source-Name";

	//image  ****Dont  forget to uncomment bellow if you set these
	imgscene="Scene-Name";
	imgsource="source-Name";
	
	//media  ****Dont  forget to uncomment bellow if you set these
	medscene="Scene-Name";
	medsource="source-Name";
	
	//custom  ****Dont  forget to uncomment bellow if you set these
	cusscene="Scene-Name";
	cussource="source-Name";


	//Add here extra scenes triggered in the text of a slide. Give a unique name
	//wor2scene="worship2";
	//wor2source="openlplower";
	

	//Do not edit bellow -only incomment as needed
	
	cursource = songsource;
	oldsource = songsource;
	
	//Open Connection
	obs.connect({address: obsAddress, password: obsPassword}) .then(() => {
		//putting in a switch to only excute one thing
		sceneset = false;
		
				
		//set visable state of all based on weather OpenLP is showing a slide or not
		obs.send('SetSceneItemProperties', {'scene-name': songscene , 'item': songsource, 'visible': (OpenLP.currentlyShowing == "slides")});
		obs.send('SetSceneItemProperties', {'scene-name': bibscene , 'item': bibsource, 'visible': (OpenLP.currentlyShowing == "slides")});
	
		
		//uncomment if you are using
//		obs.send('SetSceneItemProperties', {'scene-name': presscene , 'item': pressource, 'visible': (OpenLP.currentlyShowing == "slides")});
//		obs.send('SetSceneItemProperties', {'scene-name': medscene , 'item': medsource, 'visible': (OpenLP.currentlyShowing == "slides")});		
//		obs.send('SetSceneItemProperties', {'scene-name': imgscene , 'item': imgsource, 'visible': (OpenLP.currentlyShowing == "slides")});
//		obs.send('SetSceneItemProperties', {'scene-name': cusscene , 'item': cussource, 'visible': (OpenLP.currentlyShowing == "slides")});

//Extra scenes set visable -- one for each
		//obs.send('SetSceneItemProperties', {'scene-name': wor2scene , 'item': wor2source, 'visible': (OpenLP.currentlyShowing == "slides")});



		//get text of slide
		var obsslide = OpenLP.currentSlides[OpenLP.currentSlide];
		curText = obsslide["text"];
		
      		// use an item with the title "scenechange:replacethiswithscenename" to switch to OBS scene "replacethiswithscenename"
		if(preg = /scenechange:(.+)/i.exec(OpenLP.currentTitle)) {
		        obs.send('SetCurrentScene', {'scene-name': preg[1]});
		        sceneset = true;
		}
	      	// put "scenechange:replacethiswithscenename" into the notes of an item
		if(preg = /scenechange:(.+)/i.exec(OpenLP.currentNotes)) {
			obs.send('SetCurrentScene', {'scene-name': preg[1]});
			sceneset = true;
		}
		
		//Need a condition - only for songs
		//if (OpenLP.currentPlugin == "songs") {
		//	// put "scenechange:replacethiswithscenename" into the slide of an item (Wrap in a tag to hide)
		//	if (preg = /scenechange:(.+)/i.exec(OpenLP.currentText)) {
		//		obs.send('SetCurrentScene', {'scene-name': preg[1]});
		//		curscene = preg[1];
		//		sceneset = true;
		//	}			
      		//}
      			    
		//The following will change scenes based on the type of slide
		// Other plugin names are as follows : images, presentations, media, custom
     
		if (sceneset == false) {
      
		//If Plugin Songs
	 	if (OpenLP.currentPlugin == "songs")  {
      	 		newscene = songscene ;
      	 		oldsource = cursource ;
      	 		cursource = songsource ;
      	 	}
      
      		//If plug 'bibles'
		if (OpenLP.currentPlugin == "bibles")  {
      			//setting the new scene
			newscene = bibscene ; 
    			oldsource = cursource ;
      	    		cursource = bibsource ;
     		}
      
     		//Uncomment these for Other plugins
      
     		////If plugin 'presentations'
      
    		//if (OpenLP.currentPlugin == "presentations")  {
    		//      //setting the new scene
		//    newscene = presscene ; 
		//    oldsource = cursource ;
      		//    cursource = pressource ;
      		//}
      
      		////If plugin 'images'
      
	     	//if (OpenLP.currentPlugin == "images")  {
      		//      //setting the new scene
		//    newscene = imgscene ; 
		//    oldsource = cursource ;
      		//    cursource = imgsource ;
      		//}
      
      		////If plugin 'Media'
      
      		//if (OpenLP.currentPlugin == "custom")  {
      		//      //setting the new scene
		//    newscene = medscene ; 
		//    oldsource = cursource ;
      		//    cursource = medsource ;
      		//}
      		
      		////If plugin 'custom'
      
      		//if (OpenLP.currentPlugin == "custom")  {
      		//      //setting the new scene
		//    newscene = cusscene ; 
		//    oldsource = cursource ;
      		//    cursource = cussource ;
      		//}
      
    //Change scene	  
         obs.send('SetCurrentScene', {'scene-name': newscene});
    //make source visable
         //obs.send('SetSceneItemProperties', {'scene-name': newscene , 'item': cursource , 'visible': true} );
         //Make sure we show the slide in obs
         //obs.send('SetSceneItemProperties', {'item': cursource, 'visible': (OpenLP.currentlyShowing == "slides")});
         }
    });
  }
}
$.ajaxSetup({ cache: false });
setInterval("OpenLP.pollServer();", 750);
OpenLP.pollServer();
