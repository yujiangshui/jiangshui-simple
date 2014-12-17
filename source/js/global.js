// global var
var G = {};
var share;

G.fadeInByOrder = function(selector,interval,callback){
    var i = 1,
        length = $(selector+' .fade').length + 1,
        intervala = interval || 100,
        callbacka = callback || function(){ return; };

    (function fadeInIt(){
        if ( i < length ) {
            $(selector+' .fade'+i).addClass('fade-in');
            i++;
            setTimeout( arguments.callee , intervala );
            if ( i === length) {
                callbacka();
            }
        }
    })();
};
G.getTLItemTops = function(){
	var tempArr = [];
	$('.timeline-item').each(function() {
		tempArr.push($(this).offset().top);
	});
	return tempArr;
};

G.justOnce1 = false;
G.justOnce2 = true;

;(function($) {


$(document).ready(function() {

	G.getWindowHeight = function() {
		return $(window).height();
	};
	G.getDocumentHeight = function() {
		return $(document).height();
	};
	G.windowHeight = G.getWindowHeight();
	G.documentHeight = G.getDocumentHeight();

	// works time line
	if( $('.timeline').length ){

		var topOffset = $('.section-menu').height();
		var footerPadding = $('.section-footer').outerHeight(true) + 120 + $('.need-work').height();
		G.timelineOffsetTop = $('.timeline-works').offset().top - topOffset;
		$('.line-block').css({top:topOffset});
		$('.need-work').css({'margin-top':(G.windowHeight/2) - footerPadding});

		G.timelineItemOffsets = G.getTLItemTops();

		$('.timeline-item').each(function() {
			var thisExcerptHeihgt = $(this).find('.timeline-excerpt').height();
			$(this).find('.timeline-detail p').height(thisExcerptHeihgt);
		});

	}

	// global ajax event trigger loading animation
	$(document).ajaxStart(function() {
		$('.loading').show();
		$('.loading-overlay').stop(true).fadeIn(200);
	}).ajaxStop(function() {
		$('.loading').hide();
		$('.loading-overlay').stop(true).fadeOut(200);
	});

	// header nav transition
	G.headerHeight = $('.section-header').outerHeight(true) + $('.section-menu').outerHeight(true) - $('.section-menu').height();
	G.navWidth = $('.section-menu .section').width();
	G.windowWidth = $(window).width();
	G.expendLength = ( G.windowWidth - G.navWidth );

	// back to top
	$('.back-to-top').click(function(event) {
		$('html,body').animate({scrollTop:0}, 200);
	});



});

$(window).load(function() {

	// obtain true document height
	G.documentHeight = G.getDocumentHeight();

	// obtain timelineitem offset when images loaded
	if( $('.timeline').length ){
		G.timelineItemOffsets = G.getTLItemTops();
	}

});

$(window).scroll(function(){

	var scrollt = $(window).scrollTop();

	// back to top
	if( scrollt > 200 ){
		$('.back-to-top').fadeIn(200);
	}else{
		$('.back-to-top').fadeOut(200);
	}

	// header nav transition
	var rate = scrollt / G.headerHeight;
	if ( scrollt < G.headerHeight && scrollt >= 0 ) {
		$('.section-menu .section').css({'max-width': G.navWidth + G.expendLength * rate});
		$('.section-menu').removeClass('fixed');
	}else if( scrollt > G.headerHeight && scrollt >= 0 ) {
		$('.section-menu').addClass('fixed');
	}

	// scroll load more
	var offset = 800;
	if ( $('.list-pagination').length ) {

		// scroll almost to bottom need load more
		if( scrollt > ( G.documentHeight - offset ) ){

			var url = $('.page-number.current').next('.page-number').attr('href');
			if ( url ) {
				if ( !G.justOnce1 ) {
					G.justOnce1 = true;

					$.ajax({
						type: 'GET',
						url: url
					})
					.done(function(data) {
						var listData = $("<div>").html(data).find('.list-blog').html();
						var pageData = $("<div>").html(data).find('.list-pagination').html();
						$('.list-blog').append(listData);
						$('.list-pagination').html(pageData);

						// get new data
						G.justOnce1 = false;
						G.documentHeight = G.getDocumentHeight();

					})
					.fail(function(e, txt) {
						G.justOnce1 = true;
						console.log(txt);
					});

				}
			}

		}

	}


	// timeline line
	if( $('.timeline').length ){

		var lineBlockHeight = G.windowHeight / 2 - 60;
		if ( scrollt > G.timelineOffsetTop && scrollt < ( G.timelineOffsetTop + lineBlockHeight ) ) {
			// line block more height
			$('.line-block').show().height( scrollt - G.timelineOffsetTop );
		}else if ( scrollt >= ( G.timelineOffsetTop + lineBlockHeight ) ){
			if ( G.justOnce2 ) {
				$('.line-block').height(lineBlockHeight);
				G.justOnce2 = false;
			}
		}else if ( scrollt <= G.timelineOffsetTop ) {
			$('.line-block').hide();
		}

		// timeline heightlight item
		if ( $('.timeline-item').length && scrollt > G.timelineOffsetTop ) {
			var lineBottomOffset = $('.line-block').offset().top + $('.line-block').height();
			for (var i = 0; i < G.timelineItemOffsets.length; i++) {
				if ( lineBottomOffset > G.timelineItemOffsets[i] && lineBottomOffset < G.timelineItemOffsets[i+1]) {
					$('.timeline-item').removeClass('current');
					$('.timeline-item:eq('+i+')').addClass('current');
				}else if ( lineBottomOffset < G.timelineItemOffsets[0] ){
					// scroll to first one
					$('.timeline-item').removeClass('current');
				}else if ( lineBottomOffset > G.timelineItemOffsets[G.timelineItemOffsets.length-1] ){
					// scroll to last one
					$('.timeline-item').removeClass('current');
					$('.timeline-item:eq('+ parseInt( G.timelineItemOffsets.length - 1 ) +')').addClass('current');
				}
			}
		}
	}

});

})(jQuery);