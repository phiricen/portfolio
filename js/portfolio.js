$(function(){

	let portfolio_data = getPortfolioData();
	let portfolio_order = getPortfolioOrder();

	// Show data to DOM
	showData(portfolio_data, portfolio_order);

	$('.carousel').carousel({
		interval: 10000
	})

	initFilter();

});

function initFilter(){
	$('button[name="filter"]').click(onFilter);

	let filter_types = [
		'PHP',
		'CSS',
		'MySQL',
		'JavaScript',
		'Action Script 3'
	];

	for (let type in filter_types){
		let amount = $('.project[data-used-lang*="' + filter_types[type] + '"]').length;
		let el_button = $('button[name="filter"][value="'+filter_types[type]+'"]');
		el_button.html(el_button.text() + ' <small>( ' + amount + ' )</small>');
	}

	function onFilter(e){
		$('.project').map(function(el){
			let used_lang = this.getAttribute('data-used-lang');
			let target_lang = e.target.value;
			if (used_lang && used_lang.indexOf(target_lang) !== -1){
				this.classList.remove('d-none');
			}
			else {
				this.classList.add('d-none');
			}
		});
	}
}

/**
 * Get portfolio data
 * @returns Promise
 */
function getPortfolioData(){
	let result = $.ajax({
		url: './data/project-list.json',
		dataType: 'json',
		async: false,
	});
	return JSON.parse(result.responseText);
};

/**
 * Get portfolio order
 * @returns Promise
 */
function getPortfolioOrder(){
	let result = $.ajax({
		url: './data/project-order.json',
		dataType: 'json',
		async: false,
	});
	return JSON.parse(result.responseText);
};

/**
 * Show data to DOM
 */
function showData(data, order){
	order.forEach(function(code){
		let project = addProject(code, data[code]);
		document.getElementById('projects').appendChild(project);
	})
}

/**
 * Add a new project to DOM
 * @param data
 * @returns {Node}
 */
function addProject(code, data){
	let el = document.querySelector('.project').cloneNode(true);
	el.classList.remove('template');
	el.querySelector('a.title > b').innerHTML = data.title;
	el.querySelector('a.title').setAttribute('href', '#' + code);

	let el_feature_list = el.querySelector('.features');

	/**
	 * Carousel
	 */
	let el_carousel = el.querySelector('.carousel');
	el_carousel.id = 'carousel-' + code;
	$(el_carousel).find('[role="button"]').attr('href', '#' + el_carousel.id );
	$(el_carousel).find('[data-target]').attr('data-target',  '#' + el_carousel.id);
	for (let i in data.images) {
		let url = './image/' + code + '/' + data.images[i];

		let active = i == 0 ? 'active' : '';

		let carousel_item = $('<div class="carousel-item ' + active + '"><img class="d-block w-100" src="' + url + '"></div>');
		$(el).find('.carousel-inner').append(carousel_item);

		let carousel_indicator = $('<li data-target="#" data-slide-to="' + i + '" class="' + active + '"></li>');
		$(el).find('.carousel-indicators').append(carousel_indicator);
	}

	/**
	 * Status
	 * 製作年度
	 */
	if(data.url_status){
		let el_item = getListItem();
		let el_dd = el_item.querySelector('dd');
		el_item.querySelector('dt').innerHTML = 'サイト';

		if ( data.url_status === "public" ){
			el_dd.innerHTML = '<a href="' + data.url +'" target="_blank"><span>' + data.url  + '</span></a>';
			el_feature_list.append(el_item);
		}
		else if ( data.url_status === "download" ){
			el_dd.innerHTML = '<a href="' + data.url +'" target="_blank"><span>ダウンロード（音声なしバージョン）</span></a>';
			el_feature_list.append(el_item);
		}
		else {
			el_item.remove();
		}
	}

	/**
	 * Year
	 * 製作年度
	 */
	if (data.year){
		let el_item = getListItem();
		el_item.querySelector('dt').innerHTML = '製作年度';
		el_item.querySelector('dd').innerHTML = data.year;
		el_feature_list.append(el_item);
	}

	/**
	 * Client
	 * 依頼主・雇い主
	 */
	if (data.client){
		let el_item = getListItem();
		el_item.querySelector('dt').innerHTML = '依頼主・雇い主';
		el_item.querySelector('dd').innerHTML = data.client;
		el_feature_list.append(el_item);
	}

	/**
	 * language
	 * 利用言語
	 */
	if (data.language){
		let el_item = getListItem();
		el_item.querySelector('dt').innerHTML = '利用言語';
		el_item.querySelector('dd').innerHTML = data.language.join(', ');
		el_feature_list.append(el_item);

		el.setAttribute('data-used-lang', data.language.join(' '));
	}

	/**
	 * features
	 * 特徴
	 */
	if (data.features){
		let el_item = getListItem();
		el_item.querySelector('dt').innerHTML = '特徴';
		el_item.querySelector('dd').innerHTML = data.features.join(', ');
		el_feature_list.append(el_item);
	}

	/**
	 * description
	 * 説明
	 */
	if (data.description){
		let el_item = getListItem();
		el_item.querySelector('dt').innerHTML = '説明';
		el_item.querySelector('dd').innerHTML = data.description;
		el_feature_list.append(el_item);
	}

	el.querySelector('.list-item.template').remove();

	/**
	 * Get feature list item
	 * @returns {Node}
	 */
	function getListItem(){
		let el_item = el.querySelector('.list-item.template').cloneNode(true);
		el_item.classList.remove('list-item');
		el_item.classList.add('list-item');
		return el_item;
	}

	return el;
}

function backToTop(){
	window.scroll({
		top: 0,
		left: 0,
		behavior: 'smooth'
	});
}