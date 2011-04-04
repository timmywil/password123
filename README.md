*Version: 1.5, Last updated: 2/1/2011*
 
Demo				 - <a href="http://timmywillison.com/samples/password123/">http://timmywillison.com/samples/password123/</a><br/>
Testing			 - <a href="http://timmywillison.com/samples/password123/qunit/test/">http://timmywillison.com/samples/password123/qunit/test/</a><br/>
GitHub			 - <a href="http://github.com/timmywil/password123">http://github.com/timmywil/password123</a><br/>
Source			 - <a href="http://github.com/timmywil/password123/raw/master/jquery.password123.js">http://github.com/timmywil/password123/raw/master/jquery.password123.js (13.8kb)</a><br/>
(Minified)	 - <a href="http://github.com/timmywil/password123/raw/master/jquery.password123.min.js">http://github.com/timmywil/password123/raw/master/jquery.password123.min.js (5.2kb)</a><br/>

Sites Using password123
-----------------------
[mailchimp.com](http://mailchimp.com)

License

Copyright (c) 2011 timmy willison,<br/>
Dual licensed under the MIT and GPL licenses.<br/>
<a href="http://timmywillison.com/licence/">http://timmywillison.com/licence/</a><br/>

Support and Testing

Versions of jQuery and browsers this was tested on.

jQuery Versions - 1.3.2-1.5<br/>
Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-5,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chrome 4-6, Opera 9.6-10.5.

Release History

1.5   - (2/1/2011) Added widget-style option method<br/>
1.4		- (2/1/2011) Restructured plugin, added destroy method, added tests<br/>
1.3		- (11/23/2010) Added Google Closure Compiler comments, common password field attribute<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;support when replacing fields, and no longer sends placeholder value when submitting the form.<br/>
1.2		- (9/28/2010) Placeholders changed to only work with HTML5 placeholder attribute,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'value' attribute now reserved for actual values<br/>
1.1		- (7/5/2010) Add Placeholder functionality<br/>
1.0		- (7/4/2010) Initial release

<h1>Usage</h1>

<pre>
$('input:password').password123();
</pre>

<h3>Placeholders</h3>
For placeholders, just use the HTML5 placeholder attribute:

<pre>
&lt;input type=&quot;password&quot; placeholder=&quot;password&quot;&gt;
</pre>

This will work in all browsers and you can keep placeholders specific to certain elements.

Then assign styles to your placeholder class ('which you can change with options'):
<pre>
.place {
		color: #999;
}
</pre>

This allows for more flexibility than browser defaults, though most of the time you'll just want to have the placeholder be a lighter color.

<h3>Options</h3>

<pre>
$('input:password').password123({
								
		// You can use any html character code or
		// plain text character
		character: "&amp;#8226;",
	
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
		
});
</pre>

<h3>Methods</h3>

<h5>Destroy</h5>
<pre>
	var $input = $('input:password');
	$('#checkbox').change(function() {
		if (this.checked) {
			$input = $input.password123();
		} else { 
			$input = $input.password123("destroy");
		}
	});
</pre>

<h5>Option (Getter/Setter)</h5>
<pre>
	// Set
	$('#iField0').password123("option", "delay", 3000);
	$('#iField0').password123("option", "placeholder", false);
	
	// Get
	var prefix = $('#iField0').password123("option", "prefix");
</pre>
