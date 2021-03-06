/* global $, _, define, require, exports, module */
;(function(){

	"use strict";

	var config = {
		element: document.body,
		url: 'data.json'
	};

	var template = {

		comment: function (data) {

			var author = data.author ? '<a class="author" href="#">' + data.author + '</a>' : ''
			  , date = data.age ? '<span class="date">' + pretty(+new Date - data.age) + '</span>' : ''
			  , comment = data.posttext ? '<span class="comment">' + data.posttext + '</span>' : ''
			  , template = '<li data-id="<%= id %>"><%= comment %><span class="credit"><%= author %><%= date %></span>';

			return _.template(template, {
				id: data.id
			  , author: author
			  , date: date
			  , comment: comment
			});

		},

		topic: function (data) {

			var title = data.topictitle ? '<li class="title">' + data.topictitle + '</li>' : ''
			  , template = '<ul class="tree"><%= title %><%= tree %></ul>'
			  , branches = arrayToTree(data.responses)
			  , branchesHtml = treeToHtml(branches);

			return _.template(template, {
				id: data.id
			  , title: title
			  , tree: branchesHtml
			});

		},

		tree: function (html) {

			return html;

		}

	};

	function render (data) {

		// append HTML

		var html = template.tree(
			_.reduce(data.topics, function (accumulator, datum) {
				return accumulator += template.topic(datum);
			}, '')
		);

		config.element.innerHTML += html;

		// toggle comment visibility on click
		$('li').on('click', function () {
			$(this).next('li').toggleClass('hide');
		});

	}

	function error (err) {
		console.error(err);
	}


	function initialize() {

		// fetch data
		$.ajax(config.url)
		.done(render)
		.fail(error);

	}

	initialize();

	// helpers
	
	function treeToHtml (tree) {

		var html = '';

		_recurse(tree);

		return html;

		function _recurse (branch) {

			var children = branch.children;

			html += template.comment(branch);

			if (children.length) {
				html += '<ul>';
				_.each (children, _recurse);
				html += '</ul>';
			} else {
				html += '</li>';
			}
		}

	}
	
	function arrayToTree (array) {

		var map = {}
		  , tree;

		_.each(array, function (datum) {

			datum.children = [];
			map[datum.id] = datum;

			if (datum.parentid === 0) {
				tree = datum;
			} else {
				map[datum.parentid].children.push(datum);
			}
			
		});

		return tree;

	}


})();