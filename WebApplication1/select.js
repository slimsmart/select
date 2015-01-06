﻿/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="factory.ts" />
var ui;
(function (ui) {
    var selectTemplate = (function () {
        function selectTemplate(select, items) {
            this.select = select;

            this.container = $("<div class='ui-select-container'><a href=\"#\"><span></span></a></div>");
            this.container.insertBefore(select);

            var selectedOption = this.getSelectedOption(this.select);
            this.span = this.container.find("span");
            this.span.text(selectedOption.text());

            this.select.appendTo(this.container);
            this.select.hide();

            // Create a template
            this.wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            this.list = this.createListFromItems(items);

            this.wrap.append(this.list);
        }
        selectTemplate.prototype.getSelectedOption = function (select) {
            var selectedOption = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        };

        selectTemplate.prototype.createListFromItems = function (items) {
            var list = $("<ul class='ui-select-list'></ul>");
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            return list;
        };
        return selectTemplate;
    })();

    var select = (function () {
        function select(selectNode, options) {
            var _this = this;
            this._options = options;

            var select = $(selectNode);
            this._items = this.getItems(select);
            var template = new selectTemplate(select, this._items);

            var body = $("body");
            body.append(template.wrap);

            // events
            var a = template.container.find("a");
            a.click(function (e) {
                template.container.click();
                return false;
            });

            a.keydown(function (e) {
                return _this.handleKeys(e, template);
            });
            a.focus(function (e) {
                return _this.toggleFocus(template.container);
            });
            a.blur(function (e) {
                //this.toggleFocus(template.container);
                //this.reset(template);
            });

            template.container.click(function (e) {
                _this.toggleMenu(template);
                e.stopPropagation();
            });

            template.list.find("li").click(function (e) {
                var li = e.currentTarget;
                _this.selectItem(template, li);
            });

            $(document).click(function (e) {
                return _this.reset(template);
            });
        }
        select.prototype.handleKeys = function (e, template) {
            if (e.altKey && e.keyCode === 40) {
                this.toggleMenu(template);
            } else if (e.keyCode === 40) {
            }
        };

        select.prototype.reset = function (template) {
            template.wrap.hide();
            template.container.removeClass(this._options.containerActiveCssClass);
        };

        select.prototype.toggleFocus = function (container) {
            if (container.hasClass("focus")) {
                container.removeClass("focus");
            } else {
                container.addClass("focus");
            }
        };

        select.prototype.selectItem = function (template, listItem) {
            var index = $(listItem).attr("i");
            var item = this._items[index];
            template.select.val(item.value);
            var selectedOption = template.select.find("option:selected").first();
            template.span.text(selectedOption.text());
        };

        select.prototype.getItems = function (select) {
            var items = new Array();
            var options = select.find("option");
            options.each(function (index, element) {
                var item = {
                    text: this.innerText,
                    value: this.value,
                    index: index
                };
                items.push(item);
            });
            return items;
        };

        select.prototype.toggleMenu = function (template) {
            var wrap = template.wrap;
            var container = template.container;
            var span = template.span;

            if (wrap.is(":visible")) {
                wrap.hide();
                wrap.removeClass(this._options.menuActiveCssClass);
                container.removeClass(this._options.containerActiveCssClass);
                wrap.css({ position: "" });
            } else {
                var position = span.offset();
                var width = span.outerWidth();
                var height = span.outerHeight();

                //show the menu directly under
                wrap.css({
                    position: "absolute",
                    top: (position.top + height) + "px",
                    width: width,
                    left: (position.left) + "px"
                });

                var maxHeight = Math.min(window.innerHeight, this._options.maxHeight);
                if (wrap.height() > maxHeight) {
                    wrap.css({ height: maxHeight });
                    var style = wrap.attr("style");
                    style += " overflow-y: scroll";
                    wrap.attr("style", style);
                }
                wrap.addClass(this._options.menuActiveCssClass);
                container.addClass(this._options.containerActiveCssClass);
                wrap.show();
            }
        };
        return select;
    })();
    ui.select = select;
})(ui || (ui = {}));
//# sourceMappingURL=select.js.map
