var ran_documentready_pagejs = false;

$(function() {
  if (ran_documentready_pagejs == true) return;
  $(window).bind('resize', function() {
    var m = $('#digital_menucard');
    var display_height = m.css('height');
    var display_width = m.css('width');
    page_resize(display_width, display_height);
  }).trigger('resize');
  ran_documentready_pagejs = true;
});

function page_resize(display_width, display_height) {
  display_width = parseInt(display_width);
  display_height = parseInt(display_height);
  //console.log('called page_resize', display_width, display_height);
  var unit_height = 480;
  var unit_width = 800;
  var unit_fontsize = 85;
  
  
  //$('#digital_menucard').css('width', $(window).width());
  //$('#digital_menucard').css('height', $(window).height());
  
  var factor_height = display_height / unit_height;
  var factor_width = display_width / unit_width;
  
  //$('#digital_menucard').css('-webkit-transform', 'scale(2,2)');
  
  var scaled_fontsize = Math.floor(100 * factor_width);
  $(".page").css("font-size", scaled_fontsize + '%');
  $(".page").css('width', display_width);
  $(".page").css('height', display_height);
  
  var scalable_elements = $('.partial');
  //scalable_elements.push($('table'));
  $.each(scalable_elements, function(i, el) {
    el = $(el);
    var el_left = el.attr('left_orig');
    var el_top = el.attr('top_orig');
    //console.log('scaling', el_left);
    scaled_left = Math.floor(el_left * factor_width);
    scaled_top = Math.floor(el_top * factor_height);
    el.css('left', scaled_left + 'px');
    el.css('top', scaled_top + 'px');
  })
}

function render_digital_menucard_header() {
  var m = $('#digital_menucard');
  var header = create_dom_element('div',{id:'dm_header'}, '', m);
  var forwardbutton = create_dom_element('span',{id:'dmc_forward'},'FORWARD', header);
  var backbutton = create_dom_element('span',{id:'dmc_backward'},'BACKWARD', header);
  var submitbutton = create_dom_element('span',{id:'dmc_submit'},'SUBMIT', header);
  var detailbutton = create_dom_element('span',{id:'dmc_detail'},'DETAILS', header);
  var sumbutton = create_dom_element('span',{id:'dmc_sum'},'', header);
  forwardbutton.on('mousedown', function() {
    page_advance(+1);
  });
  backbutton.on('mousedown', function() {
    page_advance(-1);
  });
  detailbutton.on('mousedown', function() {
    toggle_digital_menucard(false);
  });
  submitbutton.on('mousedown', function() {
    route('table', submit_json.model.table_id, 'send');
  });
}

function toggle_digital_menucard(state) {
  if (state == true) {
    var m = $('#digital_menucard');
    if ( $('#digital_menucard #dm_header').length == 0 ) render_digital_menucard_header();
    var first_page = $('#digital_menucard .page')[0];
    var winheight = $(window).height() + 'px';
    var winwidth = $(window).width() + 'px';
    //m.css('width', winwidth);
    //m.css('height', winheight);
    $('#digital_menucard .page').css('width', m.css('width'));
    $('#digital_menucard .page').css('height', m.css('height'));
    console.log('toggling');
    page_resize(winwidth, winheight);
    $(first_page).show();
    m.show();
    $('#container').hide();
    
  } else {
    $('#digital_menucard').hide();
    $('#digital_menucard .page').hide();
    $('#container').show();
  }
}

var page_idx_current = 0;
function page_advance(count) {
  var pages = $('#digital_menucard .page');
  var count_pages = pages.length;
  var visible_page = $(pages[page_idx_current]);
  var next_page = $(pages[page_idx_current + count]);
  visible_page.hide();
  next_page.show();
}

function add_dmenucard_button() {
  if(_get('dmenucard.button_added')) return
  //if(!permissions.manage_customers) return
  opts = {id:'dmenucard_category_button', handlers:{'mousedown':function(){toggle_digital_menucard(true)}}, bgcolor:"50,50,50", bgimage:'/assets/category_customer.png', append_to:'#categories'};
  add_category_button(i18n.customers, opts);
  _set('dmenucard.button_added',true);
}