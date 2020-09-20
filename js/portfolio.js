$(function(){

	let portfolio_data = getPortfolioData();
	let portfolio_order = getPortfolioOrder();

	// Show data to DOM
	showData(portfolio_data, portfolio_order);

	$('.carousel').carousel({
		interval: 10000
	})

	return;
	$('.categories label').click(onFilt);

	function onFilt(){
		var selecteds = [];
		$.each($('.categories input:checked'), function(){
			selecteds.push($(this).val());
		});
		$.each($('.project'), function(){
			var matched = false;
			var langs = $(this).attr('used-langs');
			for ( var i = 0 ; i < selecteds.length; i++ ){
				if ( langs.indexOf(selecteds[i]) > -1 ){
					matched = true;
					/*
					$.each($(this).find('.wall.lang').children(), function(){
						if($(this).text() == selecteds[i]){
							console.log('AA');
						}
					});
					*/
				}
			}
			if(matched){
				$(this).addClass('matched');
			}
			else {
				$(this).removeClass('matched');
				$(this).find('.wall.lang').removeClass('matched');
			}
		});
		$('.p-ball').remove();
		$.each($('.project.matched'), function(i){
			$(this).css('opacity',0).delay(i*500).animate({opacity:1}, 500);
		});
	}
});

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

/*
    function addProject($p){
        $private_site = 'プライベート　サイト　(　面接の時ご説明させていただきます　)';
    	$private_site = 'プライベート　サイト';
    	$href = isset($p->url) ? ' href="'.$p->url.'" target="_blank"' : '';
    	$langs = '';
		if(isset($p->language)){
			foreach ($p->language as $key => $l) {
				$langs.= $key == 0 ? '' : ' ';
				$langs.= $l;
			}
		}
    	$html = '<div id="'.$p->code.'" class="project row matched" used-langs="'.$langs.'" img-idx="1">';
        $html.=     '<div class="col-md-6">';
        $html.=        '<div class="preview">';

        $amt = 0;
        $images = array();
        do {
            $amt++;
            $png = "image/".$p->code."/".$amt.".png";
            $jpg = "image/".$p->code."/".$amt.".jpg";
            if(is_file($png)){
                array_push($images, $png);
            }
            else if(is_file($jpg)){
                array_push($images, $jpg);
            }
        }
        while(is_file($png)||is_file($jpg));

        $html.=             '<div class="dots">';
        foreach ($images as $i => $img) {
            $html.= '<a class="dot" dot-id="'.($i+1).'"></a>';
        }
        $html.=             '</div>';
        $html.=             '<div class="images">';
        $html.=                 '<div class="thumbnail">';
        foreach ($images as $i => $img) {
            $hidden = $i == 0 ? '' : ' hidden';
            $html.= '<a class="'.$hidden.'" href="'.$img.'" target="_blank" title="クリックで拡大表示">';
            $html.=     '<img src="'.$img.'" />';
            $html.= '</a>';
        }
        $html.=                '</div>';
        $html.=             '</div>';
        $html.=         '</div>';
    	$html.= 	'</div>';
    	$html.= 	'<div class="col-md-6 content">';
        $html.=         '<div class="title"><a href="#'.$p->code.'" class="title">'.$p->title.'</a></div>';

        if(isset($p->url_status)){
            $html.= '<div class="wall">';
            $html.=     '<div class="title brick">サイト</div>';
            if ( $p->url_status == "public" ){
                $html.= '<a class="value brick" href="'.$p->url.'" target="_blank"><span>'.$p->url.'</span></a>';
            }
            else if ( $p->url_status == "private" ){
            	$html.=	'<a class="value brick private"><span>'.$private_site.'</span></a>';
            }
            else if ( $p->url_status == "download" ){
            	$html.=	'<a class="value brick" href="'.$p->url.'" target="_blank">ダウンロード（音声なしバージョン）</a>';
            }
            $html.= '</div>';
        }

    	if(isset($p->year)){
	    	$html.= '<div class="wall">';
	    	$html.= 	'<div class="title brick">制作年代</div>';
	    	$html.= 	'<div class="value brick">'.$p->year.'</div>';
	    	$html.= '</div>';
    	}
    	if(isset($p->client)){
	    	$html.= '<div class="wall">';
	    	$html.= 	'<div class="title brick">依頼主・雇い主</div>';
	    	$html.= 	'<div class="value brick">'.$p->client.'</div>';
	    	$html.= '</div>';
    	}
    	if(isset($p->language)){
	    	$html.= '<div class="wall lang">';
	    	$html.= 	'<div class="title brick">利用言語</div>';
	    	$html.= 	'<div class="value brick">';
	    	foreach ( $p->language as $k=> $l ) {
	    		$html.= $k == 0 ? '' : '<span>, </span>';
	    		$html.= '<span>'.$l.'</span>';
	    	}
	    	$html.= 	'</div>';
	    	$html.= '</div>';
    	}
    	if(isset($p->special)){
	    	$html.= '<div class="wall">';
	    	$html.= 	'<div class="title brick">開発機能</div>';
	    	$html.= 	'<div class="value brick">';
	    	foreach ( $p->special as $s ) {
	    		$html.= '<p>'.$s.'</p>';
	    	}
	    	$html.=		'</div>';
	    	$html.= '</div>';
    	}
    	if(isset($p->description)){
	    	$html.= '<div class="wall">';
	    	$html.= 	'<div class="title brick">紹介</div>';
	    	$html.= 	'<div class="value brick"><span>'.$p->description.'</span></div>';
	    	$html.= '</div>';
    	}
    	$html.= 	'</div>';
    	$html.= '</div>';
    	return $html;
    }
 */