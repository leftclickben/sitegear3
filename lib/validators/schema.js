/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, JaySchema) {
	"use strict";

	module.exports = function (schema) {
		var js = new JaySchema(module.exports.loaders.local),
			mapErrorMessage = function (error) {
				return error.message || 'Constraint "' + error.constraintName + '" broken by "' + error.testedValue + '", expected "' + error.constraintValue + '"' + (error.desc ? ' (' + error.desc + ')' : '');
			};
		return function (data, callback) {
			js.validate(data, schema, function (errors) {
				if (errors && errors.length > 0) {
					var messages = _.map(errors, mapErrorMessage);
					callback(new Error('Received ' + errors.length + ' errors from JSON schema validator: [[ ' + messages.join(' ]]; [[ ') + ' ]]'));
				} else {
					callback();
				}
			});
		};
	};

	module.exports.loaders = {
		local: function (ref, callback) {
			if (module.exports.localSchema.hasOwnProperty(ref)) {
				callback(null, module.exports.localSchema[ref]);
			}
			callback(new Error('Attempted to load unknown local schema with ref "' + ref + '"'));
		}
	};

	module.exports.localSchema = {
		"http://json-schema.org/address": {
		    "description": "An Address following the convention of http://microformats.org/wiki/hcard",
		    "type": "object",
		    "properties": {
		        "post-office-box": { "type": "string" },
		        "extended-address": { "type": "string" },
		        "street-address": { "type": "string" },
		        "locality":{ "type": "string", "required": true },
		        "region": { "type": "string", "required": true },
		        "postal-code": { "type": "string" },
		        "country-name": { "type": "string", "required": true}
		    },
		    "dependencies": {
		        "post-office-box": "street-address",
		        "extended-address": "street-address"
		    }
		},
		"http://json-schema.org/calendar": {
		    "description": "A representation of an event",
		    "type": "object",
		    "properties": {
		        "dtstart": {
		            "format": "date-time",
		            "type": "string",
		            "description": "Event starting time",
		            "required": true
		        },
		        "dtend": {
		            "format": "date-time",
		            "type": "string",
		            "description": "Event ending time"
		        },
		        "summary": { "type": "string", "required": true },
		        "location": { "type": "string" },
		        "url": { "type": "string", "format": "uri" },
		        "duration": {
		            "format": "time",
		            "type": "string",
		            "description": "Event duration"
		        },
		        "rdate": {
		            "format": "date-time",
		            "type": "string",
		            "description": "Recurrence date"
		        },
		        "rrule": {
		            "type": "string",
		            "description": "Recurrence rule"
		        },
		        "category": { "type": "string" },
		        "description": { "type": "string" },
		        "geo": { "$ref": "http: //json-schema.org/geo" }
		    }
		},
		"http://json-schema.org/card": {
		    "$schema": "http://json-schema.org/draft-03/schema#",
		    "description": "A representation of a person, company, organization, or place",
		    "type": "object",
		    "properties": {
		        "fn": {
		            "description": "Formatted Name",
		            "type": "string"
		        },
		        "familyName": { "type": "string", "required": true },
		        "givenName": { "type": "string", "required": true },
		        "additionalName": { "type": "array", "items": { "type": "string" } },
		        "honorificPrefix": { "type": "array", "items": { "type": "string" } },
		        "honorificSuffix": { "type": "array", "items": { "type": "string" } },
		        "nickname": { "type": "string" },
		        "url": { "type": "string", "format": "uri" },
		        "email": {
		            "type": "object",
		            "properties": {
		                "type": { "type": "string" },
		                "value": { "type": "string", "format": "email" }
		            }
		        },
		        "tel": {
		            "type": "object",
		            "properties": {
		                "type": { "type": "string" },
		                "value": { "type": "string", "format": "phone" }
		            }
		        },
		        "adr": { "$ref": "http://json-schema.org/address" },
		        "geo": { "$ref": "http://json-schema.org/geo" },
		        "tz": { "type": "string" },
		        "photo": { "type": "string" },
		        "logo": { "type": "string" },
		        "sound": { "type": "string" },
		        "bday": { "type": "string", "format": "date" },
		        "title": { "type": "string" },
		        "role": { "type": "string" },
		        "org": {
		            "type": "object",
		            "properties": {
		                "organizationName": { "type": "string" },
		                "organizationUnit": { "type": "string" }
		            }
		        }
		    }
		},
		"http://json-schema.org/geo": {
			"description": "A geographical coordinate",
			"type": "object",
			"properties": {
				"latitude": { "type": "number" },
				"longitude": { "type": "number" }
			}
		}
	};
}(require('lodash'), require('jayschema')));
