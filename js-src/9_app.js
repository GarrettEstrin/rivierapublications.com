/* init Jarallax */
$('.jarallax').jarallax({
    speed: 0.5,
    imgWidth: 1366,
    imgHeight: 768
})
$(function(){
    $('#vertical-ticker').totemticker({
        row_height	:	'100px',
        next		:	'#ticker-next',
        previous	:	'#ticker-previous',
        stop		:	'#stop',
        start		:	'#start',
        mousestop	:	true
    });
});
jQuery(document).ready(function($) {
    var welcomefade = $('#welcomefade');
    welcomefade.fadeOut(3500);
    $(".scroll").click(function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
    });
    $().UItoTop({ easingType: 'easeOutQuart' });
});
