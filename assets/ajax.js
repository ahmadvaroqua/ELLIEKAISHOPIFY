$(document).ready(function(){
  console.warn("Test");

  request = $.get('http://ellie-kai.s3.amazonaws.com/assets/avery-dress.json', function(data) {
    console.warn("Simple AJAX is true.");
    console.warn(data);
  });

  request.fail(function( jqXHR, textStatus, errorThrown ) {
    console.warn( "Request jqXHR: " + jqXHR );
    console.warn( "Request failed: " + textStatus );
    console.warn( "errorThrown: " + errorThrown );
  });

});
