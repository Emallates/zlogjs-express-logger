# zlogjs-express-logger

log express request, response, locally or on a remote server.

[![Join the chat at https://gitter.im/Emallates/zlogjs-express-logger](https://badges.gitter.im/Emallates/zlogjs-express-logger.svg)](https://gitter.im/Emallates/zlogjs-express-logger?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Version][version-svg]][package-url]&nbsp;[![Build Status][travis-svg]][travis-url]</br>[![ISSUES][issues-url]][issues-url]&nbsp;[![FORKS][forks-url]][forks-url]&nbsp;[![STARS][stars-url]][stars-url]&nbsp;[![Downloads][downloads-image]][downloads-url]</br>[![License][license-image]][license-url]

[version-svg]: https://img.shields.io/npm/v/zlogjs-express-logger.svg?style=flat-square
[package-url]: https://npmjs.org/package/zlogjs-express-logger
[travis-svg]: https://img.shields.io/travis/Emallates/zlogjs-express-logger/master.svg?style=flat-square
[travis-url]: https://api.travis-ci.org/Emallates/zlogjs-express-logger.svg?branch=master
[issues-url]:https://img.shields.io/github/issues/Emallates/zlogjs-express-logger.svg?style=flat-square
[forks-url]:https://img.shields.io/github/forks/Emallates/zlogjs-express-logger.svg?style=flat-square
[stars-url]:https://img.shields.io/github/stars/Emallates/zlogjs-express-logger.svg?style=flat-square
[downloads-image]: https://img.shields.io/npm/dm/zlogjs-express-logger.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=zlogjs-express-logger
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/Emallates/zlogjs-express-logger/master/LICENSE

##DESCRIPTION
zlogjs-express-logger is a plugin for zlogjs-adapter to log native http server requests and responses.

<!--NO_HTML-->
Table of Contents
-----------------

1. [Installation](#installation)
1. [Configuration](#configuration)
    - [Skip](#skip)
	- [Tags](#tags)
1. [Log](#log)
	- [Global](#global)
	- [Specific](#specific)
1. [Issues and Suggestions](#issues-and-suggestions)
1. [License](#license)

<!--/NO_HTML-->

## Installation
```bash
npm install zlogjs-express-logger --save
```

## Configuration
As this logger is a plugin of [zlogjs-adapter](https://github.com/Emallates/zlogjs-adapter), you need to install [that](https://github.com/Emallates/zlogjs-adapter) first.
To log locally just put the value of mode `local` otherwise `remote`.
```javascript
var config = {
	collections:{
		adapter:{
			host:'host', port:'port',
			adapter:require('zlogjs-adapter'), plugin:'zlogjs-express-logger',
			appId:'appid', apiKey:'apikey',
			mode:'remote'
		}
	}
};
```
#### Skip
```javascript
var config = {
	collections:{
		adapter:{
			host:'host', port:'port',
			adapter:require('zlogjs-adapter'), plugin:'zlogjs-express-logger',
			appId:'appid', apiKey:'apikey',
			mode:'remote',
			SKIP:{
			  '/api1':true, 
			  '/api2':{CODE:204},
			  '/api4':{METHOD:'get'},
			  '/api6':{CODE:{'>':200,'<':300}}
			},
			SKIP_CODE:400
		}
	}
};
 
```
#### Tags
```javascript
var config = {
	collections:{
		adapter:{
		host:'host', port:'port',
		adapter:require('zlogjs-adapter'), plugin:'zlogjs-express-logger',
		appId:'appid', apiKey:'apikey',
		mode:'remote',
			TAGS:{
				"/api/a":"tag1",
				"/api/b":"tag1:tvalue",
				"/api/c":["tag1:tvalue","tag2:tvalue"],
				"/api/d":["tag1","tag2"],
				"/api/e":{"tag1":"tvalue","tag2":"tvalue"},
				"splitter":":"
			}
		}
	}
};
```

## Log
To start using this logger you need to construct it from [zlogjs-adapter](https://github.com/Emallates/zlogjs-adapter) and [enoa-client](https://github.com/Emallates/enoa-client).
Then you need to include it  as a middleware of the express application. 

#### Global
```javascript
var logger = require('enoa-client')(config).adapter.logger;
express_app.use(logger);
```

#### Specific
you need to add an additional header `x-man-zlogjs` to the request object if you manually log something
```javascript
//req.headers['x-man-zlogjs'] = true;
logger(req, res, CallbackFn);
```

## Issues and Suggestions
This is the first version of [zlogjs-express-logger](https://github.com/Emallates/zlogjs-express-logger), so we are looking forward to make this logger perfect. if there is any issue or you want to add new feature to the logger please feel free to raise it.

## License

**[MIT](./LICENSE)**
&copy; 2016 [Emallates](http://github.com/Emallates)