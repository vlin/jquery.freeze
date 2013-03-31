/**
 * table header freezer v 0.01
 * author: vlin
 * */
/*global document, window, jQuery, console*/
(function($) {
    'use strict';
    $.fn.freeze = function(options) {
        var opts = $.extend({
            marginTop: 0
        }, options || {}),
            freeze = [];

        this.each(function() {
            var parent = $(this),
                thead = parent.find('thead');
            if (thead.length === 0) {
                console.log('there is no <thead>');
                return false;
            }
            var cloneNode = parent.clone(!0),
                offset = parent.offset(),
                allChildren = thead.find('*');

            cloneNode.css({
                left: offset.left,
                top: opts.marginTop,
                width: parent.width(),
                display: 'none',
                position: 'fixed'
            })
                .removeAttr('id')
                .children(':not(thead)').remove();

            $.each(cloneNode.find('thead *'), function(i) {
                $(this).width(allChildren.eq(i).width());
            });

            freeze.push({
                node: cloneNode,
                offset: offset,
                height: thead.height(),
                parentHeight: parent.height()
            });

            $(document.body).append(cloneNode);
        });

        $(window).resize(function() {
            $(this).trigger('scroll');
        }).scroll(function() {
            var sTop = $(window).scrollTop();

            $.each(freeze, function(i, f) {
                var bottom = f.offset.top + f.parentHeight,
                    freezeLimit = bottom - f.height;

                if (sTop > f.offset.top && sTop <= freezeLimit) {
                    f.node.css({
                        position: 'fixed',
                        top: opts.marginTop,
                        display: 'table'
                    });
                } else if ((sTop > freezeLimit && sTop <= bottom)) {
                    f.node.css({
                        position: 'absolute',
                        top: freezeLimit,
                        display: 'table'
                    });
                } else {
                    f.node.hide();
                }
            });
        }).trigger('scroll');
    };
})(jQuery);