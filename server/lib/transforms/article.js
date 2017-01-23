'use strict';

const dateTransform = require('./extra/date');
const summaryTransform = require('./extra/summary');
const schemaHeadlineTransform = require('./extra/schema-headline');
const extractMainImage = require('./extra/extract-main-image');
const transformBody = require('./body');
const cheerio = require('cheerio');

module.exports = (contentItem, options) => transformBody(contentItem.bodyHTML, options)
	.then(transformedBody => {
		const $ = cheerio.load(transformedBody, {decodeEntities: false});
		contentItem.mainImageHtml = extractMainImage($);
		return $.html();
	})
	.then(transformedBody => {
		contentItem.htmlBody = transformedBody;
		contentItem.displayDate = dateTransform(contentItem.publishedDate, {classname: 'article-date'});
		contentItem.displaySummary = summaryTransform(contentItem);
		contentItem.schemaHeadline = schemaHeadlineTransform(contentItem);
		return contentItem;
	});
