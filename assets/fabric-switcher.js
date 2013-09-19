$(document).ready(function(){

  var shopify_handle = $.url('filename');

  //$.getJSON("http://dressingroom-dev.elliekai.com/products/" + shopify_handle + ".json", function(data) {
  $.getJSON("http://dressingroom.elliekai.com/products/" + shopify_handle + ".json", function(data) {

    // -------------------------------
    // Need this global for filtering swatches by fabric later
    // after the AJAX call
    json_data = data;

    // -------------------------------
    // Swatches
    for (var i = 0; i < data.patterns.length; i++) {
      $('#swatches').append("<a href='#' id='" + data.patterns[i].sku + "' --data-sku='" + data.patterns[i].sku + "' --data-fabric='" + data.patterns[i].fabric_type + "' --data-name='" + data.patterns[i].name + "' --data-swatch-index='" + (i + 1) + "'><img src='http://ellie-kai.s3.amazonaws.com/assets/fabrics-new-100x100/" + data.patterns[i].sku + ".jpg' alt='" + data.patterns[i].name + "'/></a>");

    }

    // -------------------------------
    // Sizes
    var sizes = data.sizes;

    for (var i = 0; i < sizes.length; i++) {
      var opt = document.createElement('option');
      opt.value = sizes[i].size;
      opt.text = sizes[i].size;
      $('#size').append(opt);
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
    var lengths = data.lengths;
    var num_lengths = lengths.length
    console.log("Number of lengths available: " + num_lengths);

    for (var i = 0; i < lengths.length; i++) {
      var opt = document.createElement('option');
      opt.value = lengths[i].length;
      opt.text = lengths[i].length;
      $('#length').append(opt);
    }

  });

  // End of AJAX call

  /*
  // -------------------------------
  // When the fabric changes, log it
  $("#fabric").change(function() {

    //console.log($(this).val());
    //console.log(json_data);

    filtered = $.fn.filterJSON( json_data.patterns , {
      property: ["fabric_type"],
      wrapper: true,
      value: $(this).val(),
      checkContains: false,
      startsWith: true,
      matchCase: false,
      avoidDuplicates: true
    });

    //console.log(filtered);
    //console.log("filtered.length: " + filtered.length);

    // Empty the swatches first
    $('#swatches').empty();

    // Now repopulate with whatever fabric was chosen
    for (var i = 0; i < filtered.length; i++) {
      $('#swatches').append("<a href='#' id='" + filtered[i].sku + "' --data-sku='" + filtered[i].sku + "' --data-fabric='" + filtered[i].fabric_type + "' --data-name='" + filtered[i].name + "' --data-swatch-index='" + (i + 1) + "'><img src='http://ellie-kai.s3.amazonaws.com/assets/fabrics-new-100x100/" + filtered[i].sku + ".jpg' alt='" + filtered[i].name + "' /></a>");
    }

  });
  */

  // -------------------------------
  // What happens when you click on a swatch
  $( "#swatches" ).on('click', 'a', function(event) {
    event.preventDefault()

    var swatch_id = $(this).attr('id');
    var product_name = shopify_handle;

    var fabric_sku = $('#' + swatch_id).attr('--data-sku');
    var fabric_name = $('#' + swatch_id).attr('--data-fabric');
    var pattern_name = $('#' + swatch_id).attr('--data-name');

    // Update the Fabric dropdown

    // Update the hidden pattern and fabric fields
    $("#pattern").val(pattern_name);
    $("#fabric").val(fabric_name);

    // Now remove the selected class if any swatch was picked before
    $("#swatches a").removeClass("selected")

    // Update the pattern display so customer knows name of pattern
    $("#pattern-name-display").html(pattern_name + ' (' + fabric_name + ')');

    $('#product_slider > ul > li').attr("data-thumb", "http://ellie-kai.s3.amazonaws.com/assets/products-304x480/" + product_name + "-" + fabric_sku +  ".jpg");

    $('#product_slider > ul > li > a').attr("href", "http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku +  ".jpg");

    $('#product_slider > ul > li > a > img').attr("src", "http://ellie-kai.s3.amazonaws.com/assets/products-304x480/" + product_name + "-" + fabric_sku +  ".jpg");

    $('#product_slider > ul > li > a > img').attr("data-cloudzoom", "zoomImage: 'http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku +  ".jpg tintColor: '#ffffff'");

    $('.cloudzoom-zoom > img').attr("src", "http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku + ".jpg");
    $('.cloudzoom-blank > img').attr("src", "http://ellie-kai.s3.amazonaws.com/assets/products-600x947/" + product_name + "-" + fabric_sku + ".jpg");

    // Now highlight which swatch was picked
    $('#' + swatch_id).addClass('selected');

  });

});
