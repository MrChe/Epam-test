import svg4everybody from 'svg4everybody';
import $ from 'jquery';
import '../blocks/info-box/info-box';

$(() => {
	svg4everybody();
	$('.js-info-box').infobox({
		jsonUrl: 'assets/data/info_box.json',
		loop: true
	});
});
