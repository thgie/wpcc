jQuery(function() {

    var comments = jQuery.parseJSON(wpccparams.comments)

    // for(var c in comments){
    //     var re = new RegExp(comments[c].re, 'g');
    //     var m;
    //
    //     jQuery(wpccparams.selectors).each(function(){
    //
    //         jQuery(this).html(function(_, html) {
    //             return html.replace(re, '$1' + '<span data-id="'+comments[c]['ids']+'" class="comment">'+comments[c]['count']+'</span>')
    //         });
    //
    //     })
    // }

    setTimeout(function(){
        jQuery('span.highlight').each(function(i, e){
            var ids = [],
                cont = jQuery('<div class="view-comment"></div>'),
                read = jQuery('<a href="javascript:void(0);" class="toggle-show" data-toggle-show><span class="closed">Weiterlesen</span><span class="open">Zuklappen</span><i class="fa fa-angle-down closed"></i><i class="fa fa-angle-up open"></i></a>');

            cont.data('id', "test")

            read.click(function(){
                jQuery(this).closest('.view-comment').toggleClass('show')
            })

            if(typeof jQuery(this).data('id') === 'number'){
                ids.push(jQuery(this).data('id'))
            } else {
                ids = jQuery(this).data('id').split(',')
            }

            for(id in ids){
                cont.html(
                    cont.html() + jQuery('#comment-'+ids[id]).outer()
                )
            }

            cont.find('.comment-header').append(read)

            cont.css({
		        display: 'none',
                position: 'absolute',
                top: jQuery(this).offset().top,
                left: jQuery(wpccparams.selectors).width() + jQuery(wpccparams.selectors).offset().left + 50
            })

            jQuery('body').append(cont)

	        cont.show()

            jQuery(this).click(function(){
                jQuery('.view-comment[data-id="'+jQuery(this).data('id')+'"]').toggleClass('show')
            })
        })
    }, 1000)

    jQuery(window).resize(function(){
        jQuery('.view-comment').css({
            left: jQuery(wpccparams.selectors).width() + jQuery(wpccparams.selectors).offset().left + 50
        })

    })

    jQuery('#show-comments').click(function(){
        jQuery('.view-comment').toggleClass('show')
    })

    /*jQuery('span.comment').on('click', function(){

        jQuery('#view-comment .comment-list').html('');

        // for(c in comments){

            var ids = []

            if(typeof jQuery(this).data('id') === 'number'){
                ids.push(jQuery(this).data('id'))
            } else {
                ids = jQuery(this).data('id').split(',')
            }

            for(id in ids){

                jQuery('#view-comment .comment-list').html(
                    jQuery('#view-comment .comment-list').html()
                    + jQuery('#comment-'+ids[id]).outer()
                )

                // if(ids[id].toString() === comments[c]['comment_ID'].toString()){
                //     jQuery('#view-comment p').html(
                //         jQuery('#view-comment p').html()+comments[c]['comment_content']+'<br>'
                //     )
                // }
            }
        // }

        jQuery('#view-comment')
        .removeClass('h')
        .css({
            top: jQuery(this).offset().top - jQuery('#view-comment').height() / 2,
            left: jQuery(wpccparams.selectors).offset().left
        })

    })*/

    jQuery('#view-comment button').on('click', function(){
        jQuery('#view-comment').addClass('h')
    })

    jQuery('body').on('mouseup', function(){

        var selector = window.getSelection().toString()

        if(selector.length){

            var re_chars = wpccparams.re_chars.split('')

            for(var c in re_chars){
                var char = re_chars[c],
                    last = selector.slice(-1),
                    last_two = selector.slice(-2);

                if(char === last){
                    selector = selector.substring(0, selector.length - 1);
                }

                if(char + ' ' === last_two){
                    selector = selector.substring(0, selector.length - 2);
                }
            }

            var re_string = "["+wpccparams.re_chars+"]([^"+wpccparams.re_chars+"]*?"+RegExp.quote(selector)+".*?["+wpccparams.re_chars+"])"
            var re = new RegExp(re_string, "g");
            var str = '.'+jQuery(wpccparams.selectors).text();
            var m;

            while ((m = re.exec(str)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                jQuery('#add-comment p#contextstring').text(m[1].trim())
                jQuery('#add-comment input[name=context]').val(m[1].trim())
            }

            selection = window.getSelection();
            range = selection.getRangeAt(0);
            rectangle = range.getBoundingClientRect();

            var _left = rectangle.left,
                _right = rectangle.right,
                _center = _left + (_right - _left) / 2,
                _top = jQuery(window).scrollTop() + rectangle.top + rectangle.height,
                _height = rectangle.height;

            jQuery('#add-comment').css({
                top: jQuery(window).scrollTop() + rectangle.top + rectangle.height -60,
                left: jQuery(wpccparams.selectors).offset().left
            })

            jQuery('#add-comment-btn').css({
                display: 'block',
                left: _right - jQuery('#add-comment-btn').width() / 2,
                top: _top - _height - jQuery('#add-comment-btn').height() - 3
            })
            jQuery('#add-comment-btn').removeClass('h')
            jQuery('#add-comment-btn').click(function(){
                jQuery('#add-comment').removeClass('h')
                jQuery('#add-comment-btn')
            })

            // jQuery('#add-comment textarea').val('').focus()
        } else {
            jQuery(wpccparams.selectors).find('.comment').show()
            jQuery('#add-comment-btn').css({
                display: 'none'
            })
        }
    });

    jQuery('body').on('keyup', function(e){
        if(e.keyCode === 27){
            jQuery('#add-comment').addClass('h')
            jQuery('#view-comment').addClass('h')
            jQuery('#add-comment-btn').css({
                display: 'none'
            })
        }
    })

    jQuery('#add-comment .close').on('click', function(){
        jQuery('#add-comment').addClass('h')
        jQuery('#view-comment').addClass('h')
        jQuery('#add-comment-btn').css({
            display: 'none'
        })
    })

    jQuery('body').on('click', function (e) {
        if(jQuery(e.target).closest('#add-comment, #add-comment-btn').length === 0){
            jQuery('#add-comment').addClass('h')
        }
    })
});

RegExp.quote = function(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

jQuery.fn.outer = function() {
  return jQuery('<div />').append(this.eq(0).clone()).html();
};

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
