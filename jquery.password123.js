/*!
 * jQuery password123: iPhone Style Passwords Plugin - v1.0 - 7/4/2010
 * http://timmywillison.com/samples/password123/password123.html
 * 
 * Copyright (c) 2010 timmy willison
 * Dual licensed under the MIT and GPL licences.
 * http://timmywillison.com/licence/
 */

// *Version: 1.0, Last updated: 7/4/2010*
// 
// Demo         - http://timmywillison.com/samples/password123/
// GitHub       - http://github.com/timmywil/jquery-password123
// Source       - http://github.com/timmywil/jquery-password123/raw/master/jquery.password123.js (9kb)
// (Minified)   - http://github.com/timmywil/jquery-password123/raw/master/jquery.password123.min.js (3kb)
// 
// License
// 
// Copyright (c) 2010 timmy willison,
// Dual licensed under the MIT and GPL licenses.
// http://timmywillison.com/license/
// 
// Support and Testing
// 
// Versions of jQuery and browsers this was tested on.
// 
// jQuery Versions - 1.3.0-1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-5,
//                   Chrome 4-5, Opera 9.6-10.5.
// 
// Release History
// 
// 1.0   - (7/4/2010) Initial release

(function ($, window, document, undefined) {

    // Method / object references.
    var $fields, 
        last, 
        opts = {
        
            // You can use any html character code or
            // plain text character
            character: "&#8226;",
            
            // This is the delay for when the last
            // character will change
            delay: 2000,
            
            // Use any prefix you like for the new
            // field ids, but they will always be zero-indexed
            prefix: "iField"
        };

    // =========================================== 
    // ! Text Change Event (with a little extra)   
    // =========================================== 
    $.event.special.textchange = {
        setup: function (data, namespaces) {
            $(this).bind('keyup.textchange', $.event.special.textchange.handler);
            $(this).bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
        }, 
        teardown: function (namespaces) {
            $(this).unbind('.textchange');
        }, 
        handler: function (event) {
            $.event.special.textchange.triggerIfChanged($(this));
        }, 
        delayedHandler: function (event) {
            var $element = $(this);
            setTimeout(function () {
                $.event.special.textchange.triggerIfChanged($element);
            }, 25);
        }, 
        triggerIfChanged: function ($element) {
            var v = $element.val(),
                encodedCharacter = $('<div>'+opts.character+'</div>').text();
            if ($element.val() !== $element.data('lastValue')) {
                // Check if something larger than one letter was pasted into the field
                if (v.length > 1 && v.indexOf(encodedCharacter) === -1) {
                    // If so, we need to save it before it disappears,
                    // but continue with triggering the field change
                    // by taking the last letter off
                    v = v.substr(0, v.length-1);
                    $element.data('value', v).prev('input').val(v);
                }
                $element.trigger('textchange', $element.data('lastValue'));
                $element.data('lastValue', $element.val());
            }
        }
    };
    // Shortcut to bind like other jQuery event bind shortcuts
    $.fn['textchange'] = function (fn) {
        return fn ? this.bind('textchange', fn) : this.trigger('textchange');
    };
    if ($.attrFn) $.attrFn['textchange'] = true;

    // Gets the current cursor position in a textfield
    // to determine where to delete/update a character.
    function getCursorPosition(field) {
        if (field != null) {
            // IE
            if (document.selection) {
                field.focus();
                var sel = document.selection.createRange();
                sel.moveStart('character', -field.value.length);
                return sel.text.length;
            }
            // Others
            else if (field.selectionStart || field.selectionStart == '0') return field.selectionStart;
            // Something went wrong.
            else return -1;
        }
    }
    
    // Sets the cursor position to a previous state
    // if the field was updated somewhere in the middle
    function setCursorPosition(field, pos) {
        if (field != null) {
            // IE
            if (field.createTextRange) {
                var range = field.createTextRange();
                range.move('character', pos);
                range.select();
            }
            // Others
            else if (field.selectionStart) {
                field.focus();
                field.setSelectionRange(pos, pos);
            }
            // Something's wrong. Just focus on it.
            else
                field.focus();
        }
    }
    
    // Replaces the password field with a hidden field
    // and adds the new visible text field
    function replaceFields(f) {
        var fields = [];
        $(f).each(function (i, tem) {

            var field = $(tem),
                field_id = opts.prefix + i;

            $('<input type="text"/>').attr({
                'class': field.attr('class'),
                'id': field_id,
                'value': field.attr('value')
            }).insertAfter(field);

            fields.push(document.getElementById(field_id));

            $('<input type="hidden"/>').attr({
                'name': field.attr('name'),
                'id': field.attr('id'),
                'class': field.attr('class')
            }).replaceAll(field);

        });
        return $(fields).data('value', '');
    };

    // Calls for the necessary adjustments
    // when a field is changed
    function letterChange() {
        var $field = $(this);
        var fv = $field.val();
        if (fv.length > $field.data('value').length) {
        
            $field.data('value', fieldChange($field));

        } else if (fv.length < $field.data('value').length) {

            window.clearTimeout(last);

            var hidden = $field.prev('input'),
                old = hidden.val(),
                newVal;

            if (fv.length < old.length - 1) newVal = old.substr(0, fv.length);
            else {
                var cp = getCursorPosition($field[0]);
                newVal = old.length > cp + 1 && cp > -1 
                    ? old.slice(0, cp).concat(old.slice(cp + 1)) 
                    : old.slice(0, cp);
            }

            $field.data('value', fv).prev('input').val(newVal);
        }
    }

    // Updates the field with the dots as the user types,
    // sets the timeout for the last char,
    // and returns the new value to set to field.data
    function fieldChange($field) {
        window.clearTimeout(last);
        var fv = $field.val(),
            len = fv.length,
            hidden = $field.prev('input'),
            encodedCharacter = $('<div>'+opts.character+'</div>').text(),
            old = hidden.val(),
            cp = getCursorPosition($field[0]),
            newVal;
        
        // Update the hidden value with the correct value
        // depending on cursor position
        newVal = old.length > cp + 1 && cp > -1 
            ? old.substr(0, cp-1) + fv.charAt(cp-1) + old.substr(cp-1)
            : old + fv.charAt(len - 1);
        
        hidden.val(newVal);
        
        if (len > 1) {
            for (var i = 0; i < len - 1; i++) {
                fv = fv.replace(fv.charAt(i), encodedCharacter);
            }
            $field.val(fv);
        }
        if (len > 0) {
            last = setTimeout(function () {
                cp = getCursorPosition($field[0]);
                fv = $field.val();
                fv = fv.replace(fv.charAt(len - 1), encodedCharacter);
                $field.val(fv).data('value', fv);
                if (cp != len)
                    setCursorPosition($field[0], cp);
            }, opts.delay);
        }
        if (cp != len)
            setCursorPosition($field[0], cp);
        return fv;
    }
    
    // Extend jQuery
    $.fn.password123 = function (settings) {
    
        // Add in settings to options
        opts = jQuery.extend(opts, settings);
        
        // Replace the fields with what we need
        // and store in var fields
        $fields = replaceFields(this);
        
        // Bind textchange to the fields with
        // the letterChange function
        $fields.textchange(letterChange);
        
        // Trigger keyup rather than textchange
        // in case there were default values
        // already in the fields
        $fields.keyup();
        
        // Return the new fields for chaining
        return $fields;
    };
})(jQuery, this, document);