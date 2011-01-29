/**
*	@preserve jQuery password123: iPhone Style Passwords Plugin - v1.3 - 11/23/2010
*	http://timmywillison.com/samples/password123/
*	Copyright (c) 2010 timmy willison
*	Dual licensed under the MIT and GPL licences.
*	http://timmywillison.com/licence/
*/

// *Version: 1.3, Last updated: 11/23/2010*
// 
// Demo			- http://timmywillison.com/samples/password123/
// GitHub		- http://github.com/timmywil/password123
// Source		- http://github.com/timmywil/password123/raw/master/jquery.password123.js (14.3kb)
// (Minified)	- http://github.com/timmywil/password123/raw/master/jquery.password123.min.js (3.77kb)
// 
// License
// 
// Copyright (c) 2010 timmy willison,
// Dual licensed under the MIT and GPL licenses.
// http://timmywillison.com/licence/
// 
// Support and Testing
// 
// Versions of jQuery and browsers this was tested on.
// 
// jQuery Versions - 1.3.0-1.4.4
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-5,
//					 Chrome 4-6, Opera 9.6-10.5.
// 
// Release History
// 
// 1.3	 - (11/23/2010) Added Google Closure Compiler comments, common password field attribute
//				support when replacing fields, and no longer sends placeholder value when submitting the form.
// 1.2	 - (9/28/2010) Placeholders changed to only work with HTML5 placeholder attribute, 
//				'value' attribute now reserved for actual values
// 1.1	 - (7/5/2010) Add Placeholder functionality
// 1.0	 - (7/4/2010) Initial release
//
// See README for usage and placeholder explanation

;(function ($, window, undefined) {

	// Method / object references.
	var document = window.document,
		last,
		opts = {
		
			// You can use any html character code or
			// plain text character
			character: "&#8226;",
			
			// This is the delay(ms) for when the last
			// character will change
			delay: 2000,
			
			// Use any prefix you like for the new
			// field ids, but they will always be zero-indexed
			prefix: "iField",
			
			// Enable the override of the placeholder attribute
			placeholder: true,
			
			// With this classname, you can set placeholder
			// specific styles in your own css
			placeholderClass: 'place',
			
			// When true, this will mask the placeholder or initial value
			maskInitial: false
		};

	// Textchange event with a little extra
	$.event.special.textchange = {
		setup: function (data, namespaces) {
			$(this).bind('keyup.textchange', $.event.special.textchange.handler);
			$(this).bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
		}, 
		teardown: function (namespaces) {
			$(this).unbind('.textchange');
		}, 
		handler: function (event) {
			$.event.special.textchange.triggerIfChanged( $(this) );
		}, 
		delayedHandler: function (event) {
			var $element = $(this);
			
			setTimeout(function () {
				$.event.special.textchange.triggerIfChanged( $element );
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
					$element.data('value', v).prev('input').val( v );
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
	if ( $.attrFn ) $.attrFn['textchange'] = true;

	/**
	*	Gets the current cursor position in a textfield
	*	to determine where to delete/update a character.
	*	@param {Element} field The raw field to get the cursor pos from.
	*	@return {Number} The index for the position of the cursor. 
	*/
	function getCursorPosition( field ) {
		if ( field != null ) {
			// IE
			if ( document.selection ) {
				field.focus();
				var sel = document.selection.createRange();
				sel.moveStart( 'character', -field.value.length );
				return sel.text.length;
			}
			// Others
			else if ( field.selectionStart || field.selectionStart == '0' ) {
				return field.selectionStart;
			}
		}
		return -1;
	}
	
	/**
	*	Sets the cursor position to a previous state
	*	if the field was updated somewhere in the middle.
	*	@param {Element} field The raw field.
	*	@param {Number} pos The position to set to.
	*/
	function setCursorPosition( field, pos ) {
		if ( field != null ) {
			// IE
			if ( field.createTextRange ) {
				var range = field.createTextRange();
				range.move('character', pos);
				range.select();
			}
			// Others
			else if ( field.selectionStart ) {
				field.focus();
				field.setSelectionRange( pos, pos );
			}
			else {
				field.focus();
			}
		}
	}
	
	/**
	*	Replaces the password field with a hidden field
	*	and adds the new visible text field.
	*	@param {object} $f All of the jQuery fields this plugin is called with.
	*	@return {object} The new text fields.
	*	@private
	*/
	function replaceFields( $f ) {
		var $fields;
		$f.each(function (i, item) {
			var $field   = $(item),
				place    = $field.attr('placeholder') || undefined,
				field_id = opts.prefix + i,
				value    = $field.attr('value') || ( opts.placeholder ? place || '' : '' ),
				classes  = opts.placeholder && place !== undefined && (value === place || value === '') ?
								item.className + ' ' + opts.placeholderClass :
								item.className,
				attrs = { 'class': classes, 'id': field_id, 'value': value, 'placeholder': opts.placeholder ? undefined : place },
				standards = [ 'size', 'tabindex', 'readonly', 'disabled', 'maxlength' ];
			
			// Combine attrs with standard attrs
			for ( var i = 0; i < standards.length; i++ ) {
				attrs[ standards[i] ] = $field.attr( standards[i] );
			}

			// The main field
			var $newInput = $('<input type="text"/>')
				.attr( attrs )
				.insertAfter( $field )
				// If value was set, fill it in correctly
				.data({
					'value': $field.attr('value') || '',
					// Add placeholder data directly to the element
					'placeholder': place,
					// Add hidden field value to data for placeholder comparison
					// This to avoid sending the placeholder value when submitting the form
					'newVal': value
				});
			
			$fields = $fields ? $fields.add( newInput ) : $newInput;
			
			// The hidden field that will get sent with the form
			$('<input type="hidden"/>').attr({
				'name': $field.attr('name'),
				'id': item.id,
				'class': item.className,
				'disabled': $field.attr('disabled')
			}).replaceAll( $field )
				// Fill starting value with placeholder 
				// for later comparisons
				.val( value !== place ? value : '' );
			
		});
		return $fields;
	};
	
	/**
	*	Calls for the necessary adjustments when
	*	a field is changed
	*	@private
	*/
	function letterChange() {
		var $field = $(this),
			fv	   = $field.val();

		if (fv.length > $field.data('value').length) {
			
			// Apply fieldChance as normal
			$field.data('value', fieldChange( $field ));

		} else if (fv.length < $field.data('value').length) {
			
			// Clear the timeout for the last character
			window.clearTimeout( last );

			var $hidden = $field.prev('input'),
				old		= $hidden.val(),
				newVal;

			if ( fv.length < old.length - 1 ) newVal = old.substr( 0, fv.length );
			else {
				var cp = getCursorPosition( $field[0] );
				
				// Create the new value with the correct
				// character deleted
				newVal = old.length > cp + 1 && cp > -1 
					? old.slice(0, cp).concat(old.slice(cp + 1)) 
					: old.slice(0, cp);
			}
			
			// Update data and the hidden input
			$field.data({ 'value': fv, 'newVal': newVal });
			if ( newVal !== $field.data('placeholder') ) {
				$field.prev('input').val( newVal );
			}
		}
	}
	
	/**
	*	Updates the field with the dots as the user types,
	*	and sets the timeout for the last char.
	*	@param {object} $field The field that has changed.
	*	@return {string} The new value to set to field.data
	*	@private
	*/
	function fieldChange( $field ) {
	
		// Clear the timeout for the last character
		window.clearTimeout( last );
		var fv				 = $field.val(),
			len				 = fv.length,
			$hidden			 = $field.prev('input'),
			old				 = $hidden.val(),
			cp				 = getCursorPosition( $field[0] ),
			// HTML encode the character
			encodedCharacter = $('<div>'+opts.character+'</div>').text(),
			newVal;
		
		// Update the hidden value with the correct value
		// depending on cursor position
		newVal = old.length > cp + 1 && cp > -1 
			? old.substr(0, cp-1) + fv.charAt(cp-1) + old.substr(cp-1)
			: old + fv.charAt(len - 1);
		$field.data('newVal', newVal);
		if ( newVal !== $field.data('placeholder') ) {
			$hidden.val( newVal );
		}
		
		if ( len > 1 ) {
		
			// Loop through and change all characters
			for (var i = 0; i < len - 1; i++) {
				fv = fv.replace( fv.charAt(i), encodedCharacter );
			}
			
			// Update the field
			$field.val( fv );
		}
		if ( len > 0 ) {
		
			// Set the timeout for the last character
			last = setTimeout(function () {
				cp = getCursorPosition( $field[0] );
				fv = $field.val();
				fv = fv.replace( fv.charAt(len - 1), encodedCharacter );
				$field.val( fv ).data('value', fv);
				
				// Reset cursor position to what it was if not at end
				if ( cp != len )
					setCursorPosition( $field[0], cp );
			}, opts.delay);
		}
		
		// Reset cursor position to what it was if not at end
		if (cp != len)
			setCursorPosition( $field[0], cp );
		return fv;
	}
	
	/**
	*	Placeholder functionality
	*	@param {object} $fields The necessary fields to add placeholders.
	*/
	function bindPlaceholder ($fields) {
		$fields.each(function(i, item) {
			var $f		= $(item),
				$hidden = $f.prev('input'),
				place	= $f.data('placeholder');

			if ( place !== undefined ) {
				$f.focus(function() {

					// Compare the hidden value with the placeholder value
					if ( $f.data('newVal') === place ) {
						$f.val('').removeClass( opts.placeholderClass ).data('newVal', '');
						$hidden.val('');
					}
				}).blur(function() {
					// If it's empty, put the placeholder in as the value
					if (place !== undefined && $f.val() === '') {
						$f.val( place ).addClass( opts.placeholderClass ).data('newVal', place);

						// Mask the placeholder if needed
						if ( opts.maskInitial ) {
							$f.keyup();
						}
					}
				});
			} else {
				$f.keyup();
			}
		});
	}
	
	// Extend jQuery
	$.fn.password123 = function ( settings ) {
		
		// Add in settings to options
		opts = jQuery.extend( opts, settings );
		
		// Replace the fields with what we need
		// and store in var fields
		var $fields = replaceFields( this );
		
		// Bind textchange to the fields with
		// the letterChange function
		$fields.textchange( letterChange );
		
		// Add placeholder stuff
		if ( opts.placeholder ) {
			bindPlaceholder( $fields );
		}
		
		// Mask the placeholder or initial value if needed
		if ( opts.maskInitial ) {
			$fields.keyup();
		}

		// Return the new fields for chaining
		// since the password fields previously
		// selected are no longer there
		return $fields;
	};
})(jQuery, this);
