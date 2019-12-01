function doGet(e) {

var source = e.parameter.source;
var dest = e.parameter.dest;
  var directions = Maps.newDirectionFinder()
     .setOrigin(source.trim())
     .setDestination(dest.trim())
     .setMode(Maps.DirectionFinder.Mode.DRIVING)
     .getDirections();
 var steps = directions.routes[0].legs[0].steps;
 var complete_route='';
 for(var i=0;i<steps.length;i++){
 complete_route+=(steps[i].html_instructions.replace(/(<([^>]+)>)/ig,""))+'\n';
 }

//complete_route = LanguageApp.translate(complete_route, 'en', 'ur'); 

return ContentService.createTextOutput(complete_route);

//return complete_route;
}


