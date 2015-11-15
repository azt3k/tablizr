;(function (root, factory) {

   // AMD. Register as an anonymous module depending on jQuery.
   if (typeof define === 'function' && define.amd) define(['jquery'], factory);

   // Node, CommonJS-like
   else if (typeof exports === 'object') module.exports = factory(require('jquery'));

   // Browser globals (root is window)
   else {
       factory(root.jQuery);
   }

}(this, function ($, undefined) {

   "use strict"

   $(function() {

        var pluginName = "tablizr",
            pluginVersion = "0.3.0",
            cssCache = {},
            styleAttrCache = {},
            defaults = {
                breakpoint: 767,
                sort: true,
                respond: true,
                respondStyle: 'split', // split || nosplit
                classSwitchOnly: false,
                sortHandler: null,
                onBeforeSort: null,
                onAfterSort: null,
                css : {
                    'pinned': {
                        'position': 'absolute',
                        'left': '0',
                        'top': '0',
                        'background': '#fff',
                        'width': '35%',
                        'overflow': 'hidden',
                        'overflow-x': 'auto'
                    },
                    'table-wrapper-nosplit': {
                        'overflow': 'scroll',
                        '-webkit-overflow-scrolling': 'touch',
                        'overflow-y': 'hidden'
                    },
                    'scrollable': {
                        'margin-left': '35%',
                        'overflow': 'scroll',
                        '-webkit-overflow-scrolling': 'touch',
                        'overflow-y': 'hidden'
                    },
                    'table-wrapper': {
                        'white-space': 'nowrap',
                        'position': 'relative',
                        'margin-bottom': '20px',
                        'overflow': 'hidden'
                    },
                    'sort-trigger': {
                        'cursor': 'pointer'
                    }
                }
            };

        function Plugin(element, options) {
            this.$element = $(element);
            this.settings = $.extend(true, {}, defaults, options);
            this.switched = false,
            this.init();
        }

        Plugin.prototype = {

            init: function() {

                var $elem = this.$element,
                    conf = this.settings,
                    id = $elem.attr('data-id');

                // add the class!
                $elem.addClass('tablizr');

                // ensure we have a uid - using data id because we need to clone the table in responsive mode
                if (!id) {
                    while (!id || $('[data-id="' + id +'"]').length) {
                        id = Math.floor(Math.random() * 1000) + 1;
                    }
                    $elem.attr('data-id', id);
                }

                // attach the desired behaviour
                if (conf.sort) this.attachSort($elem);
                if (conf.respond) this.attachResponsive();

            },

            flushCssCache: function(id) {
                if (id == undefined) cssCache = {};
                else cssCache[id] = undefined;
            },

            resetInlineStyles: function(id) {
                $('[data-id="' + id +'"]').attr('style', styleAttrCache[id]);
            },

            cssConf: function(type, base) {

                // vars
                var $elem = this.$element;
                var id = $elem.attr('data-id');

                // build the css cache
                if (cssCache[id] == undefined) {

                    // initalise the cache for this element
                    cssCache[id] = {};

                    // pinned container
                    cssCache[id]['pinned'] = $.extend({}, {

                    }, this.settings.css['pinned']);

                    // scrollable container
                    cssCache[id]['scrollable'] = $.extend({}, {

                    }, this.settings.css['scrollable']);

                    // table wrapper
                    cssCache[id]['table-wrapper'] = $.extend({}, {

                    }, this.settings.css['table-wrapper']);

                    // first child
                    cssCache[id]['first-child'] = $.extend({}, {

                    }, this.settings.css['first-child']);

                    // sort trigger
                    cssCache[id]['sort-trigger'] = $.extend({}, {

                    }, this.settings.css['sort-trigger']);

                    // no split
                    cssCache[id]['table-wrapper-nosplit'] = $.extend({}, {

                    }, this.settings.css['table-wrapper-nosplit']);

                }

                return base == undefined || !base
                    ? cssCache[id][type]
                    : $.extend({}, cssCache[id][base], cssCache[id][type]);

            },

            attachSort: function($elem) {

                // vars
                var self = this,
                    $rows = $elem.find('tr'),
                    $tbody = $elem.find('tbody'),
                    $headRow = $rows.first(),
                    $headings = $headRow.children('th, td');

                // ensure the headings are wrapped in a thead
                if (!$headRow.parent().is('thead'))
                    $headRow.wrap('<thead />');

                // ensure the rest of the rows are wrapped in a tbody
                if (!$tbody.length) {
                    $tbody = $('<tbody></tbody>');
                    $elem.append($tbody);
                }
                $rows.each(function(i) {
                    var $this = $(this);
                    if (i != 0 && !$this.parent().is('tbody')) $tbody.append($this.detach());
                });

                // attach the sort handler to each heading's click / tap event
                $headings.each(function(i) {

                    var $this = $(this);

                    if (!$this.is('.no-sort')) {

                        // need to add in some blocking so it doesn't fire more than once on
                        // i.e. click and tap - maybe look to see if tap exists and use that preferentially
                        // $this.off('tap.tablizr click.tablizr').on('tap.tablizr click.tablizr', function(e) {
                        $this.off('click.tablizr').on('click.tablizr', function(e) {
                            self.sort($elem, $this, i);
                        }).addClass('sort-trigger');

                        if (!self.settings.classSwitchOnly) {
                            $this.css(self.cssConf('sort-trigger'));
                        }
                    }

                });

            },

            sort: function($elem, $heading, col) {

                // on Before Sort
                if (typeof this.settings.onBeforeSort == 'function')
                    this.settings.onBeforeSort(this);

                // vars
                var $wrapper,
                    $table,
                    $th,
                    $og,
                    $tbody = $elem.find('tbody'),
                    $trs = $tbody.find('tr'),
                    self = this,
                    conf = this.settings,
                    sorter = conf.sortHandler,
                    isSorted = $heading.is('.sorted-asc, .sorted-desc'),
                    sortTo = $heading.is('.sorted-asc') ? 'desc' : 'asc';

                // Sort
                if (sorter && typeof sorter == 'function') {

                    sorter({
                        'el': $elem,
                        'rows': $trs,
                        'col': col,
                        'isSorted': isSorted,
                        'sortDirection': sortTo,
                        'tablizr': this
                    });

                } else {

                    // do the sort
                    $trs.sort(function(a,b) {

                        var an = self.extractVal($(a), col),
                            bn = self.extractVal($(b), col),
                            cmp = an.toLowerCase().localeCompare(bn.toLowerCase());

                        return (!isSorted || sortTo == 'asc') ? cmp : cmp * -1;

                    });

                    // apply the sort
                    this.applySort($trs, col, sortTo);
                }

            },

            applySort: function($tr, col, sortTo) {

                var $elem = this.$element,
                    conf = this.settings,
                    postCB = conf.onAfterSort,
                    $wrapper,
                    $heading,
                    $og,
                    $cp,
                    $cpNew;

                // ensure we are working with the original
                if ($elem.is('.pinned table'))
                    $elem = $elem.closest('.table-wrapper').find('.scrollable table');

                // handle class switching
                $heading = $($elem.find('tr').first().find('th, td')[col]);
                $elem.find('tr').first().find('td, th').removeClass('sorted-asc').removeClass('sorted-desc');
                $heading.addClass(sortTo == 'asc' ? 'sorted-asc' : 'sorted-desc');

                // check if it's in responsive mode
                if ($elem.is('.table-wrapper table')) {

                    // get elems
                    $wrapper = $elem.closest('.table-wrapper');
                    $og = $wrapper.find('.scrollable table');
                    $cp = $wrapper.find('.pinned table');

                    // apply the sort to the original
                    $tr.detach();
                    $og.find('tbody').html('').append($tr);

                    // handle the copy
                    $cpNew = $og.clone();
                    this.attachSort($cpNew);
                    $cp.replaceWith($cpNew);

                    // apply the styles
                    this.applyStyleFirstChild($og, $cpNew);
                    this.setCellHeights($og, $cpNew);

                } else {
                    $elem.find('tbody').append($tr.detach());
                }

                // after sort callback
                if (typeof postCB == 'function') postCB(this);

            },

            findHeading: function(col, $table) {
                var $elem = $($table.find('tr')[col]);
            },

            extractVal: function($row, col) {
                var $elem = $($row.find('td,th')[col]);
                var val = $elem.attr('data-sort');
                return val == undefined ? ($elem[0].textContent || $elem[0].innerText || "") : val;
            },

            extractCol: function(col) {

                // need a column to look up dogg
                if (col == undefined) return;

                // vars
                var $elem = this.$element,
                    $rows = $elem.find('tr');
                    stack = {};

                $rows.each(function(i) {
                    // dont look at the first row (it's the headings)
                    if (i != 0) {
                        var $cells = $elem.find('td');
                        stack[i] = $cells[col];
                    }
                });

                return $(stack);
            },

            attachResponsive: function() {

                var self = this;

                $(window).off("redraw.tablizr" + this.$element.attr('data-id')).on("redraw.tablizr",function(){
                    this.switched = false;
                    self.updateTables();
                });

                $(window).off("resize.tablizr" + this.$element.attr('data-id')).on("resize.tablizr",function(){
                    self.updateTables();
                });

                this.updateTables();
            },

            updateTables: function() {

                var $elem = this.$element,
                    conf = this.settings,
                    br = this.settings.breakpoint;


                if (($('body').dim('w') < br) && !this.switched) {

                    this.switched = true;

                    if (conf.splitStyle == 'split') {
                        if (this.settings.sort) this.attachSort(this.splitTable($elem));
                        else this.splitTable($elem);
                    } else {
                        this.noSplitTable($elem);
                    }

                    return true;

                } else if (this.switched && ($('body').dim('w') > br)) {

                    this.switched = false;

                    if (conf.splitStyle == 'split') {
                        this.unSplitTable($elem);
                    } else {
                        this.unNoSplitTable($elem);
                    }
                }
            },

            noSplitTable: function($og) {

                // do wrap first
                $og.wrap('<div class="table-wrapper-nosplit" />');

                // apply styles if needed
                if (!this.settings.classSwitchOnly) {
                    $og.closest('.table-wrapper-nosplit').css(this.cssConf('table-wrapper-nosplit'));
                }

                // apply awesome fix
                $og.closest('.table-wrapper-nosplit').gush({y: false});

                // is this necessary (yes)
                this.setCellHeights($og);

                return $og;

            },

            unNoSplitTable: function ($og) {
                $og.unwrap();
            },

            splitTable: function($og) {

                // do wrap first
                $og.wrap('<div class="table-wrapper" />');

                // set vars
                var $cp = $og.clone();

                // console.log(this.$element);

                // control visibility
                this.applyStyleFirstChild($og, $cp)

                // finish htmling
                $og.closest(".table-wrapper").append($cp);
                $cp.wrap('<div class="pinned" />');
                $og.wrap('<div class="scrollable" />');

                // apply styles if needed
                if (!this.settings.classSwitchOnly) {
                    $cp.closest('.pinned').css(this.cssConf('pinned'));
                    $og.closest('.scrollable').css(this.cssConf('scrollable'));
                    $og.closest('.table-wrapper').css(this.cssConf('table-wrapper'));
                }

                // apply awesome fix
                $og.closest('.scrollable').gush({y: false});

                // is this necessary (yes)
                this.setCellHeights($og, $cp);

                return $cp;

            },

            unSplitTable: function ($og) {
                $og.closest(".table-wrapper").find(".pinned").remove();
                $og.unwrap();
                $og.unwrap();
                $og.find('td:first-child, th:first-child').css('display', '');
            },

            applyStyleFirstChild: function($og, $cp) {
                $og.find('td, th').css('display', '');
                $og.find('td:first-child, th:first-child').css('display', 'none');
                $cp.find('td, th').css('display', '');
                $cp.find('td:not(:first-child), th:not(:first-child)').css('display', 'none');
            },

            setCellHeights: function($og, $cp) {

                var $tr = $og.find('tr'),
                    $tr_cp = $cp == undefined ? $([]) : $cp.find('tr'),
                    heights = [];

                $tr.each(function(index) {
                    heights[index] = $(this).dim('h');
                });

                $tr_cp.each(function(index) {
                    $(this).height(heights[index]);
                });

            }

        };

        $.fn[pluginName] = function(options) {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        };
    });

}));
