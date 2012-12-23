ga-track-external
=================

Track external links, files and mailto links.

ga-track-external should be included at the bottom of the page after your Google Analytics code. By default it will track external links, mailto's and files that match the default **extensions** regex.

Usage:
```javascript
<script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-XXXXXX-XX']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
</script>

<script type='text/javascript' src='/includes/ga-track-external.js'></script>
<script>gtrack.init();</script>

```

## Options

<dl>
  <dt><a href='#trackingmode'>trackingMode</a></dt>
  <dd>Track links as page views or events.</dd>
  <dt><a href='#extensions'>extensions</a></dt>
  <dd>Custom file extensions.</dd>  
  <dt><a href='#hostregex'>hostRegex</a></dt>
  <dd>A custom regex to match what is considered a 'local' link. Great for subdomains.</dd>  
  <dt><a href='#trackexternallinks'>trackExternalLinks</a></dt>
  <dd>Toggle external link tracking.</dd>
  <dt><a href='#trackfiles'>trackFiles</a></dt>
  <dd>Toggle file tracking, matched by 'extensions' option.</dd>  
  <dt><a href='#trackmailtos'>trackMailtos</a></dt>
  <dd>Toggle mailto link tracking.</dd>
  <dt><a href='#bindevents'>bindEvents</a></dt>
  <dd>Toggle event binding.</dd>  
</dl>

## trackingMode

Defaults to ```event```.

### event
When trackingMode is set to "event", external, mailto & file links will be tracked as events:  
Mailto: ```Event (Category: "Mailto", Action: [Email address])```  
External: ```Event (Category: "External", Action: [External URL])```  
File: ```Event (Category: "File", Action: [File URL])```

```
gtrack.init({
    trackingMode: "event"
});
```

### page
In page mode external links, mailto & file links will be tracked as page views with the following URL structure.  
Mailto: ```/mailto/[Email address]```  
External: ```/external/[External URL]```  
File: ```/file/[File URL]```

```
gtrack.init({
    trackingMode: "page"
});
```

## extensions

Defaults to ```docx?|xlsx?|pptx?|txt|vsd|vxd|eps|jpg|png|gif|svg|pdf|zip|tar|rar|gz|dmg|js|css|exe|wma|mov|avi|wmv|mp3```

File downloads are tracked by matching the file extension to a regex list of file extensions.

You can specify your own list of extensions when you're initialising the script. Note that the string is included
in a regex ```/(?:extensions)($|\&)/``` so you'll have to be careful how the string is formed. The safest bet is just to separate the extensions with a pipe | as shown in the example below.
```
gtrack.init({
    extensions: "zip|rar|gz"
});
```

## hostRegex
Defaults to ```^location.host$``` (the current domain)

Customise what is considered a local domain. Perfect when you don't want subdomains to be counted as external links.

For example to consider these domains: ```www.example.com```, ```example.com```, ```subdomain.example.com``` as 'local' specify the hostRegex as ```example\.com$```

```javascript
gtrack.init({
    hostRegex: "example\.com"
});
```
> Note: hostRegex can also be a RegExp object.

## trackExternalLinks
Toggles external link tracking. Defaults to ```true``` (external link tracking on).

```javascript
gtrack.init({
    trackExternalLinks: false
});
```

## trackFiles
Toggles file tracking. Defaults to ```true``` (file tracking on).

```javascript
gtrack.init({
    trackFiles: false
});
```

## trackMailtos
Toggles mailto link tracking. Defaults to ```true``` (mailto link tracking on).

```javascript
gtrack.init({
    trackMailtos: false
});
```

## bindEvents
> true or false

Toggles event binding. Defaults to ```true```.

> You shouldn't need to change this unless you're doing something weird.

```javascript
gtrack.init({
    bindEvents: false
});
```
