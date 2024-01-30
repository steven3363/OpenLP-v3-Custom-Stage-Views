/******************************************************************************
 * OpenLP - Open Source Lyrics Projection                                      *
 * --------------------------------------------------------------------------- *
 * Copyright (c) 2008-2021 OpenLP Developers                                   *
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
var intfadein = 300;
var intfadeout= 300;


window.OpenLP = { // Connect to the OpenLP Remote WebSocket to get pushed updates
     	myWebSocket: function (data, status) {
     	const host = window.location.hostname;
	const websocket_port = 4317;
	var curmode;
      
      	ws = new WebSocket(`ws://${host}:${websocket_port}`);
      	ws.onmessage = (event) => {
      	
      	const reader = new FileReader();
     	
     	reader.onload = () => {
        data = JSON.parse(reader.result.toString()).results;
        // set some global var
        //set the displaymode
        //This will determine if we show text.
        OpenLP.curStatus = 'live';
        //Showing Theme
        curmode = data.theme; 
        if (curmode==true) {
        	OpenLP.curStatus = 'theme';
        }
        //Showing Desktop
        curmode = data.display;
        if (curmode==true) {
        	OpenLP.curStatus = 'display';
        }
        //Showing Black
        curmode = data.blank;
        if (curmode==true) {
        	OpenLP.curStatus = 'blank';
        }
        
        
        
        if (OpenLP.currentItem != data.item ||
          OpenLP.currentService != data.service) {
        	//New item has been selected
          OpenLP.currentItem = data.item;
          OpenLP.currentService = data.service;
          
          OpenLP.loadSlides();
        }
        else if (OpenLP.currentSlide != data.slide) {
        	// New Slide has been selected
          OpenLP.currentSlide = parseInt(data.slide, 10);
          
          OpenLP.updateSlide();
          
        } else {
        	//catch all just reload
            OpenLP.loadService();    
        }
      };
    reader.readAsText(event.data);
    };
  },
  
  loadService: function (event) {
    $.getJSON(
      "/api/v2/service/items",
      function (data, status) {
        OpenLP.nextSong = "";
        
        
        
        data.forEach(function(item, index, array) {
          
          if (item.selected) {
            
            OpenLP.currentItem = item;
            OpenLP.curPlugin =data[index].plugin;

            if (OpenLP.curPlugin == 'songs' && OpenLP.curStatus == 'live') {
    		//hide the text if not slides
    		$("#songtitle").html(item.title);
    		} else {
    		$("#songtitle").html("");
    	    }
            
            OpenLP.updateSlide();
            
                      
          }
        });
        
        //
      }
    );
  },
  
  loadSlides: function (event) {
    $.getJSON(
      "/api/v2/controller/live-items",
      function (data, status) {
        OpenLP.currentSlides = data.slides;
        OpenLP.currentSlide = 0;
        
        $.each(data.slides, function(idx, slide) {
                    
          
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
 
    // use title as alternative 
    if (slide["text"]) {
        text = slide["text"];
    } else {
        text = slide["title"];
    }

    text = text.replace(/\n/g, "<br />");
          //  confirm(curStatus);
    if (OpenLP.curPlugin != 'songs'|| OpenLP.curStatus != 'live') {
    	//hide the text if not songs
    	text = "";
    	//set style to remove bg box
    	var element = document.querySelector("#bgslide");
  	element.classList.replace("slide", "slideclear");
    } else {	
    	//make sure correct background
    	var element = document.querySelector("#bgslide");
  	element.classList.replace("slideclear", "slide");
    	
    }

    if (OpenLP.curtext != text) {
    	OpenLP.curtext = text
	    $("#currentslide").fadeOut(intfadeout, function(){
      		
		      $("#currentslide").html(OpenLP.curtext);
      
    		}    
    	);
    	$("#currentslide").fadeIn(intfadein);
    }
   
  
  },
  
}
$.ajaxSetup({ cache: false });
//setInterval("OpenLP.updateClock();", 500);
OpenLP.myWebSocket();
