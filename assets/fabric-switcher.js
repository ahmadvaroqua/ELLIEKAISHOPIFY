// NOTE: How to disable submit button until all validation passes
// http://www.plus2net.com/javascript_tutorial/form-submit.php

$(document).ready(function(){

  var shopify_handle = $.url('filename');

  //-------------------------------
  // Figure out if we are in dev or production mode
  var subdomain = $.url('sub');

  if (subdomain === 'shop-dev'){
    console.log("Development mode");
    var json_url = "http://dressingroom-dev.elliekai.com/products/";
  }
  else {
    console.log("Production mode");
    var json_url = "http://dressingroom.elliekai.com/products/";
  }

  //-------------------------------
  // Get product data from CRM via AJAX
  var request = $.getJSON(json_url + shopify_handle + ".json").done(function(data) {

    // -------------------------------
    // Need this global for filtering swatches by fabric later after the AJAX call
    json_data = data;

    // -------------------------------
    // Swatches
    for (var i = 0; i < data.patterns.length; i++) {
      $('#swatches').append("<a href='#' id='" + data.patterns[i].sku + "' --data-sku='" + data.patterns[i].sku + "' --data-fabric='" + data.patterns[i].fabric_type + "' --data-name='" + data.patterns[i].name + "' --data-swatch-index='" + (i + 1) + "'><img src='http://ellie-kai.s3.amazonaws.com/assets/fabrics-new-100x100/" + data.patterns[i].sku + ".jpg' alt='" + data.patterns[i].name + "'/></a>");
    }

    // If there are swatches, enforce validation, i.e. must pick one.
    if (data.patterns.length > 0){
  	  $('#add-to-cart').addClass("disabled-button");
  	  $('#add-to-cart').attr("disabled", "true");
  	  $("#pattern-name-display").html("Please select a fabric:");
    }

    // -------------------------------
    // Sizes
    var sizes = data.sizes;
    num_sizes = sizes.length

    for (var i = 0; i < sizes.length; i++) {
      var opt = document.createElement('option');
      opt.value = sizes[i].size;
      opt.text = sizes[i].size;
      $('#size').append(opt);
    }

    // Show size dropdown selector
    if (num_sizes > 1){
      $('#size-dropdown').show();
    }

    // -------------------------------
    // Fabrics
    var fabrics = data.fabrics;

    for (var i = 0; i < fabrics.length; i++) {
      var opt = document.createElement('option');
      opt.value = fabrics[i].fabric_type;
      opt.text = fabrics[i].fabric_type;
      $('#fabric').append(opt);
    }

    // -------------------------------
    // Lengths
    // NOTE: Don't want num_lengths to be a local variable, will need it with the fabric switcher
    // when showing the name of the swatch (fabric) / length
    var lengths = data.lengths;
    num_lengths = lengths.length
    // console.log("Number of lengths available: " + num_lengths);

    // Show the length dropdown selector only if there is more than one length option
    if (num_lengths > 1){
      $('#length-dropdown-selector').show();
    }

    for (var i = 0; i < lengths.length; i++) {
      var opt = document.createElement('option');
      opt.value = lengths[i].length;
      opt.text = lengths[i].length;
      $('#length').append(opt);
    }

    // -------------------------------
    // Buttons
    var buttons = data.buttons;
    num_buttons = buttons.length

    if (num_buttons > 1){
      $('#buttons-dropdown-selector').show();
    }

    for (var i = 0; i < buttons.length; i++) {
      var opt = document.createElement('option');
      opt.value = buttons[i].button;
      opt.text = buttons[i].button;
      $('#buttons').append(opt);
    }

  });

  request.done(function( msg ) {
    console.log("AJAX Request complete.");
  });

  request.fail(function( jqXHR, textStatus, errorThrown ) {
    console.log( "AJAX Request failed, textStatus: " + textStatus );
    console.log( "AJAX Request failed, errorThrown: " + errorThrown );
  });

  // End of AJAX call

  // -------------------------------
  // What happens when a size is picked
  $("#size").change(function(){
  	$("#size-validation-message").html("");
    validate_form();
  });

  // -------------------------------
  // What happens when a length is picked
  $("#length").change(function(){
  	$("#length-validation-message").html("");
    validate_form();
  });

  // -------------------------------
  // What happens when you click on a swatch
  $( "#swatches" ).on('click', 'a', function(event) {
    // Make the anchor tag not actually go anywhere
    event.preventDefault()

    // Set up some local variables
    var swatch_id = $(this).attr('id');
    var product_name = shopify_handle;
    var fabric_sku = $('#' + swatch_id).attr('--data-sku');
    var fabric_name = $('#' + swatch_id).attr('--data-fabric');
    var pattern_name = $('#' + swatch_id).attr('--data-name');

    // Update the hidden pattern and fabric fields
    $("#pattern").val(pattern_name);
    $("#fabric").val(fabric_name);
    $("#fabric_sku").val(fabric_sku);

    // Now remove the selected class if any swatch was picked before
    $("#swatches a").removeClass("selected")

    // Now highlight which swatch was picked
    $('#' + swatch_id).addClass('selected');

    // Update the pattern display so customer knows name of pattern
    $("#pattern-name-display").html(pattern_name + ' (' + fabric_name + ' / ' + fabric_sku + ')');

    // Update the product image with the new selected fabric from swatch
    $('#product_slider > ul > li').attr("data-thumb", "http://ellie-kai.s3.amazonaws.com/assets/products-304x480/" + product_name + "-" + fabric_sku +  ".jpg");
    $('#product_slider > ul > li > a').attr("href", "http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku +  ".jpg");
    $('#product_slider > ul > li > a > img').attr("src", "http://ellie-kai.s3.amazonaws.com/assets/products-304x480/" + product_name + "-" + fabric_sku +  ".jpg");

    // For zoom
    $('#product_slider > ul > li > a > img').attr("data-cloudzoom", "zoomImage: 'http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku + ".jpg', tintColor: '#ffffff', zoomPosition: 'inside'");

    // Validate form
    validate_form();

    // Need to rerun CloudZoom in order to pick changes to the DOM after rendering (like fabric swatch picking)
    $('.cloudzoom').CloudZoom();

  });

  //-------------------------------
  // Enable/Disable submit button
  function validate_form(){

    var fabric = $("#fabric").val();
    var size = $("#size").val();
    var length = $("#length").val();
    var local_errors = false;

    // Validate size
    if (num_sizes > 1 && !size){
  	  $("#size-validation-message").html("Please select a size:");
      local_errors = true;
    }

    // Validate length
    if (num_lengths > 1 && !length){
  	  $("#length-validation-message").html("Please select a length:");
      local_errors = true;
    }

    // Validate swatch
    if ($("#swatches").length && !fabric){
      local_errors = true;
    }

    // Show or hide submit button
    if (local_errors === true){
      $('#add-to-cart').addClass("disabled-button");
  	  $('#add-to-cart').attr("disabled");
    }
    else {
      $('#add-to-cart').removeClass("disabled-button");
  	  $('#add-to-cart').removeAttr("disabled");
    }

  }
  
  
  //-------------------------------
  // EKRETAINER > Dev > Add alternate images
  if ($('#alt-image-group').length){
    $("#product_slider").append($("#alt-image-group"));
  }   

});
