'use strict';

const stripIndent = require('common-tags/lib/stripIndent');

module.exports = stripIndent`
<html>
    <head>
        <link rel="stylesheet" href="/assets/css/materialize.min.css">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <h1>Welcome</h1>
				<p>
				    This playground allows you to
				    view and test content that has been accelerated using Edge Side Includes (ESI)
				    in realtime.
				</p>

				<blockquote>
                    Today is <esi:vars>$strftime($time(), '%A %B %d, %Y')</esi:vars>
                </blockquote>

                <p>Visit <a href="http://esi-examples.akamai.com/">http://esi-examples.akamai.com/</a> for more code examples.</p>

            </div>
        </div>
    </body>
</html>
`;
