'use strict';

const querystring = require('querystring');

const {BadServerResponseError} = require('fetchres');
const fetch = require('./fetch/wrap')(require('node-fetch'));

module.exports = ({
	allocationId, sessionId, countryCodeTwoLetters, continentCode, referer, userAgent,
}) => {
	if(process.env.BARRIER_AMMIT !== 'true') {
		return Promise.resolve({});
	}

	const qs = {
		'allocation-id': allocationId,
	};
	const ammitUrl = `https://ammit-api.ft.com/uk?${querystring.stringify(qs)}`;
	return fetch(ammitUrl, {
		method: 'HEAD',
		headers: {
			'api-key': process.env.AMMIT_APIKEY,
			'ft-session-token': sessionId,
			'ft-ammit-country': countryCodeTwoLetters,
			'ft-ammit-continent-code': continentCode,
			referer,
			'user-agent': userAgent,
		},
	})
		.then(r => r.ok ? r : Promise.reject(new BadServerResponseError(r.status)))
		.then(res => ({
			abVars: res.headers.get('x-ft-ab'),
			allocation: res.headers.get('ft-allocation-id'),
		}));
};
