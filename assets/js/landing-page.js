	(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });
    
    // Subscribing
    $('#subscribe-form').submit(function(event) {
    		event.preventDefault();
    		
    		var string = $('#subscribe').html();
    		if (string == "Subscribed!") {
    			return;
    		}
    		
    		var name = $('#name');
    		var email = $('#email');
    		
    		// validation
    		if(isNameBlank(name.val()) == false) {
    			notValid(name, 'name');
    			return;
    		} else {
    			valid(name);
    		}
    		if(isEmail(email.val()) == false) {
    			notValid(email, 'email');
    			return;
    		} else {
    			valid(email);
    		}
    		if ($('#errorMessage').is(":visible")) {
			$('#errorMessage').hide(100);
		}
    		
    		var url = "http://api.dealers-app.com/subscribers/";
    		$('#subscribe').html('Saving...');
    		$.ajax
			({
			  type: "POST",
			  url: url,
			  data: {
			  	'full_name' : name.val(),
			  	'email' : email.val()
			  },
			  headers: {
    				'Authorization': 'Basic ' + btoa('ubuntu' + ':' + '090909deal')
  			  }
			})
			.done(successFn) 
			.fail(errorFn);   		
    });
    
    function isNameBlank(name) {
		if (name.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
    function isEmail(email) {
  		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  		return regex.test(email);
	}
	
	function notValid(element, type) {
		element.css("background-color", "#FCBDBB").css("border-color", "#FF3B30");
		var em = $('#errorMessage');
		if (type == 'name') {
			em.html("Please enter your name");
		} else if (type == 'email') {
			em.html("Please enter a valid email");
		}
		if (em.is(":hidden")) {
			em.show(100);
		}
	}
	
	function valid(element) {
		element.css("background-color", "white").css("border-color", "#ccc");
	}
    
    function successFn(result) {
    		console.log("Email saved successfuly");
		console.log(result);
		
		var sb = $('#subscribe');
    		sb.css('background-color', '#3DD151');
    		sb.html("Subscribed!");
    		$('#name').hide(500);
    		$('#email').hide(500);
    }
    
    function errorFn(result) {
    		console.log("Failed to save email");
		console.log(result);
    		
		var sb = $('#subscribe');
    		$('#subscribe').css('background-color', '#FF3B30');
    		sb.html("Try Again...");
    }

    // Initialize WOW.js Scrolling Animations
    if ($(window).width() >= 768) {
    		new WOW().init();
	}
})(jQuery); // End of use strict
