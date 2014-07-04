/**
 * Created by framelunch_s_3 on 2014/07/04.
 */
$('a[href^=#]').on('click.scroll', function() {
    var Hash = $(this.hash);
    if (Hash != null && Hash.get(0) != null) {
        var HashOffset = $(Hash).offset().top;
        $("html,body").animate({
            scrollTop: HashOffset
        }, 'fast');
    }
    return false;
});