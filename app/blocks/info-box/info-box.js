import $ from 'jquery';
import _ from 'underscore';

export default class InfoBox {

	constructor(el, options = {}) {
		const node = this;
		const defaults = {
			infoBox: '.js-info-box',
			container: '.js-container',
			slide: '.js-slide',
			slideActive: 'info-box__slide_state_active',
			slideShow: 'info-box__slide_state_show',
			linkShow: '.js-link-show',
			btnPprev: '.js-btn-prev',
			btnNext: '.js-btn-next',
			btnFind: '.js-btn-find'
		};

		const mustacheStyleSyntax = {
			evaluate: /\{\{(.+?)\}\}/g,
			interpolate: /\{\{=(.+?)\}\}/g,
			escape: /\{\{-(.+?)\}\}/g
		};

		node.$el = $(el);
		node.options = $.extend(true, {}, defaults, options);
		node.$infoBoxTpl = _.template(_.unescape(node.$el.find('#infoBoxTmp').html().trim()), mustacheStyleSyntax);
		$.getJSON(node.options.jsonUrl, $.proxy(node.onLoadSlides, node));

		// init DOM references
		node.$container = node.$el.find(node.options.container);
		node.$infoBox = node.$el.find(node.options.infoBox);
		node.$linkShow = node.$el.find(node.options.linkShow);
		node.$btnPprev = node.$el.find(node.options.btnPprev);
		node.$btnNext = node.$el.find(node.options.btnNext);
		node.$btnFind = node.$el.find(node.options.btnFind);
		node.currentSlide = 0;
		// биндим кнопку вперед/назад
		node.$btnPprev.on('click', $.proxy(node.prev, node)); // клик вперед слайд
		node.$btnNext.on('click', $.proxy(node.next, node)); // клик назад слайд
		node.$linkShow.on('click', $.proxy(node.toggleInfoBox, node)); // клик назад слайд
	}

	// Подгружаем данные в слайды с json
	onLoadSlides(data) {
		const node = this;
		node.$dataInfoBox = $(node.$infoBoxTpl({slides: data})); // считываем данные в переменную
		node.$container.append(node.$dataInfoBox); // добовляем в container
		node.$slide = node.$el.find(node.options.slide); // инициализируем слайд
		node.showSlide(node.currentSlide); // добовляем активный класс первому слайду
	}

	// slider
	prev() {
		const node = this;
		if (node.currentSlide > 0) {
			node.currentSlide -= 1;
		}
		// функция loop
		else if (node.options.loop === true) {
			if (node.currentSlide === 0) {
				node.currentSlide = node.$slide.length - 1;
			}
		}
		node.showSlide(node.currentSlide);
		node.$linkShow.html('show details');
	}

	next() {
		const node = this;
		if (node.currentSlide < node.$slide.length - 1) {
			node.currentSlide += 1;
		}
		// функция loop
		else if (node.options.loop === true) {
			if (node.currentSlide === node.$slide.length - 1) {
				node.currentSlide = 0;
			}
		}
		node.showSlide(node.currentSlide);
		node.$linkShow.html('show details');
	}


	showSlide(i) {
		const node = this;
		node.$slide.removeClass(node.options.slideActive);
		node.$slide.removeClass(node.options.slideShow);
		node.$slide.eq(i).addClass(node.options.slideActive);
	}

	toggleInfoBox() {
		const node = this;

		if (!node.$slide.eq(node.currentSlide).hasClass(node.options.slideShow)) {
			node.$slide.eq(node.currentSlide).addClass(node.options.slideShow);
			node.$linkShow.html('hide details');
		} else {
			node.$slide.eq(node.currentSlide).removeClass(node.options.slideShow);
			node.$linkShow.html('show details');
		}

	}

	readDataOptions(keys) {
		const node = this;
		const result = {};
		$.each(keys, function (i, key) {
			const val = node.$el.data(key);
			if (val !== void 0) {
				result[$.camelCase(key)] = val;
			}
		});
		return result;
	}
}


$.fn.infobox = function (options) {
	const pluginName = 'infobox';
	const args = arguments;

	return this.each(function (i, el) {

		let cached = $.data(el, pluginName);
		if (cached) {
			if (options && options.substring) {
				cached[options].apply(cached, [].splice.call(args, 1));
			}
			return true;
		} else if (options && options.substring) {
			throw new Error(pluginName + ' not available for this DOM element!');
		}

		cached = $(el);
		cached.data(pluginName, new InfoBox(cached, options));

		return true;

	});
};
