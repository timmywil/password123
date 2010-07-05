/*
*   iphone_passwords.js
*   timmy willison
*   6/3/10
*/

(function($, window, undefined) {
  
  var fields,
  last=false,
  str_name = 'name',
  str_id = 'id',
  str_class = 'class',
  str_value = 'value',
  str_input = 'input',
  iPassword = {
  
    opts : function() {
    },
    
    init : function() {
      
      fields = iPassword.replaceFields('#password');
      if(fields.length)
        var go = fields.keypress(iPassword.letterChange);
      
      
      // Just for example page
      $('#content form').submit(function(e){
        if(e)
          e.preventDefault();
        var v = $('#password').val();
        if(v.length > 0) {
          $('div.show-value').slideUp(250, function(){
            $(this).text('Value To Send: ' + v).slideDown(250);
          });
        } else
          $('div.show-value').slideUp(250, function(){
            $(this).text('Value To Send: None Entered').slideDown(250);
          });
        return false;
      });
      
    },
    
    // Replaces the password field with a hidden field
    // and adds the new visible text field
    replaceFields : function( f ) {
      var fields = [];
      $(f).each( function( i, tem ) {
      
        var field = $(tem),
          field_id = 'iField'+i;
        
        $('<input type="text"/>')
          .attr({
            str_class: field.attr( str_class ),
            str_id: field_id
          })
          .insertAfter( field );
        
        fields.push( document.getElementById( field_id ) );
        
        $('<input type="hidden"/>')
          .attr({
            str_name: field.attr( str_name ),
            str_id: field.attr( str_id ),
            str_class: field.attr( str_class )
          })
          .replaceAll( field );
        
      });
      return $(fields).data('value', '');
    },
    
    // Listens for a change in a field and
    // and calls for the necessary adjustments
    letterChange : function() {
      fields.each( function( i, tem ) {
      
        var field = $(tem),
            fv = field.val();
            
        if( fv.length > field.data( str_value ).length ) {
        
          field.data( str_value, iPassword.fieldsChange( field ) );
          
        } else if( fv.length < field.data( str_value ).length ) {
        
          if( last )
            window.clearTimeout( last );
            
          var hidden = field.prev( str_input ),
              old = hidden.val(),
              newVal;
          
          if( fv.length < old.length-1 )
            newVal = old.substr( 0, fv.length );
          else {
            var cp = iPassword.getCursorPosition( field[ 0 ] );
            newVal = old.length > cp + 1 && cp > -1 ? old.slice(0, cp).concat(old.slice(cp+1)) : old.slice(0, cp);
          }
            
          field.data( str_value, fv ).prev( str_input ).val( newVal );
          
        }
      });
    },
    
    // Updates the field with the dots as the user types,
    // sets the timeout for the last char,
    // and returns the new value to set to field.data
    fieldsChange : function( field ) {
      if( last )
        window.clearTimeout( last );
      var fv = field.val(),
          len = fv.length,
          hidden = field.prev( str_input ),
          newVal = hidden.val() + fv.charAt( len-1 );
      hidden.val( newVal );
      if( len > 1 ) {
        for( var i=0; i<len-1; i++ ) {
          fv = fv.replace( fv.charAt( i ), '•' );
        }
        field.val( fv );
      }
      if(len > 0) {
        last = setTimeout( function() {
          fv = field.val();
          fv = fv.replace( fv.charAt( len-1 ), '•' );
          field.val( fv ).data( str_value, fv );
        }, 2000);
      }
      return fv;
    },
    
    // Gets the current cursor position in a textfield
    // to determine where to delete a character
    getCursorPosition : function(field) {
      
      // IE
      if (document.selection) { 
      
        field.focus ();
        var sel = document.selection.createRange();
        sel.moveStart ('character', -field.value.length);
        return sel.text.length;
        
      }
      // OTHERS
      else if (field.selectionStart || field.selectionStart == '0')
        return field.selectionStart;

      // Something went wrong
      else
        return -1;
      
    }
      
  };
    
  $(document).ready(iPassword.init);
})(jQuery, this);