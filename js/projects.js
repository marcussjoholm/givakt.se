(function() {

'use strict';

// TODO
// ====

var pager = {
	animEnd: function() {
		this.animEndCalls++;
		if (this.animEndCalls >= 2 || this.pageInView === false) {
			var temp = this.pageIn;
			this.pageIn = this.pageOut;
			this.pageOut = temp;
			this.isAnimating = false;
			this.pageInView = true;
			this.animEndCalls = 0;
		}
	},
	setDefaults: function() {
		this.isAnimating = false;
		this.pageInView = false;
		this.pageIn = '.project-page-1';
		this.pageOut = '.project-page-2';
		this.direction = 'next';
		this.index = 0;
		this.projectsCount = 6;
		this.animEndCalls = 0;
		this.oldBodyTop = 0;
	},
	init: function() {
		this.setDefaults();
		console.log(pager);
	}
};

var prepareDiv = function() {
	// PRELOAD IMAGES HERE
	console.timeEnd('Load images');
	$(pager.pageIn + ' h1').text(projects[pager.index].title);
	$(pager.pageIn + ' p').text(projects[pager.index].desc);
	for (var i = 0; i < projects[pager.index].imgs.length; i++) {
		$(pager.pageIn + ' .img-' + i).attr('src', projects[pager.index].imgs[i]);
	}

	if (pager.direction === 'next') {
		moveIn('project-moveFromRight');
		if (pager.pageInView) {
			moveOut('project-moveToLeft');
		}
	} else {
		moveIn('project-moveFromLeft');
		if (pager.pageInView) {
			moveOut('project-moveToRight');
		}
	}
};


var preloadImages = function(imgArr, callback) {
	console.log(imgArr);
	var all = imgArr.length,
			remaining = all,
			progressbar = $('.progress-bar'),
			img;

	var finish = function() {
		remaining = remaining - 1;
		var loadPercent = parseInt(((all - remaining )* 100 / all), 10);
		progressbar.css('width', loadPercent + '%');
		if (remaining <= 0) {
			callback();
			window.setTimeout(function() {
				progressbar.css('width', '0%');
				progressbar.css('display', 'none');
			}, 200);
		}
	};

	progressbar.css('display', 'block');
	for (var i = 0; i < imgArr.length; i++) {
		img = new Image();
		img.onload = finish;
		img.src = imgArr[i];
	}
};


var indexHandler = function() {
	if (pager.direction === 'next') {
		pager.index = (pager.index + 1) % pager.projectsCount;
	} else {
		pager.index = (pager.index - 1) % pager.projectsCount;
	}
	console.log(pager.index);
};


var moveIn = function(inClass) {
	$(pager.pageIn).addClass('project-current ' + inClass).on('webkitAnimationEnd', function() {
		$('body').addClass('noscroll');
		if (!pager.pageInView) {
			$('.project-controls').addClass('active');
		}
		$(pager.pageIn).addClass('scroll');
		$(pager.pageIn).off('webkitAnimationEnd');
		$(pager.pageIn).removeClass(inClass);
		pager.animEnd();
	});
};


var moveOut = function(outClass, isTimeToExit) {
	$(pager.pageOut).addClass(outClass).on('webkitAnimationEnd', function() {
		$(pager.pageOut).off('webkitAnimationEnd');
		$(pager.pageOut).removeClass('project-current ' + outClass);
		pager.animEnd();
		if (isTimeToExit) {
			$('.project-stage').removeClass('active');
			pager.setDefaults();
		}
	});
	if (isTimeToExit) {
		$('.project-controls').removeClass('active');
	}
};


var nextPage = function() {
	if (pager.isAnimating) {
		return false;
	}
	pager.isAnimating = true;
	$(pager.pageOut).removeClass('scroll');

	if (pager.direction !== 'next') {
		$(pager.pageIn).removeClass('project-moveFromLeft project-moveToRight');
		$(pager.pageOut).removeClass('project-moveFromLeft project-moveToRight');
		pager.direction = 'next';
	}

	if (pager.pageInView) {
		indexHandler();
	}
	console.time('Load images');
	preloadImages(projects[pager.index].imgs, prepareDiv);
};


var prevPage = function() {
	if (pager.isAnimating) {
		return false;
	}
	pager.isAnimating = true;
	$(pager.pageOut).removeClass('scroll');

	if (pager.direction !== 'prev') {
		$(pager.pageIn).removeClass('project-moveFromRight project-moveToLeft');
		$(pager.pageOut).removeClass('project-moveFromRight project-moveToLeft');
		pager.direction = 'prev';
	}

	if (pager.pageInView) {
		indexHandler();
	}
	console.time('Load images');
	preloadImages(projects[pager.index].imgs, prepareDiv);
};


var closePage = function() {
	$('body').removeClass('noscroll');
	moveOut('project-moveToRight', true);
};


$(document).ready(function() {

	pager.init();

	$('.project-thumb').on('click', function() {
		pager.index = $(this).data('project-id');
		$('.project-stage').addClass('active');
		nextPage();
	});

	$('.project-stage span').on('click', function() {
		if ($(this).hasClass('next-project')) {
			nextPage();
		} else if ($(this).hasClass('prev-project')) {
			prevPage();
		} else if ($(this).hasClass('exit-project')) {
			closePage();
		}
	});

	$(window).on('keydown', function(e) {
		if (pager.pageInView) {
			switch (e.keyCode) {
				case 39:
					nextPage();
					break;
				case 37:
					prevPage();
					break;
				case 27:
					closePage();
					break;
			}
		}
	});

});

var projects = [
	{
		'tags': ['webb','kommunikation'],
		'id': 0,
		'title': 'Glasvasen',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. YOLO et semiotics fashion axe vinyl, chambray veniam street art organic sartorial. Portland scenester salvia cred labore, squid seitan delectus elit aliquip skateboard bitters. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown. Pinterest fugiat brunch DIY semiotics, photo booth gluten-free anim accusamus non lo-fi aliqua.',
		'thumbnail': 'project-1-thumb.png',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9914335/85a4f5646d83aee8f9be2ba22699d7b2.jpg',
			'http://interfacelift.com/wallpaper/D47cd523/03337_bluemountains_2560x1440.jpg',
			'http://interfacelift.com/wallpaper/D47cd523/03333_spinout_1600x900.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/fe85d75e6354687cae3176b2d9393e17.jpg'
		],
		'link': 'www.glasvasen.se'
	},
	{
		'tags': ['redaktionellt','kommunikation'],
		'id': 1,
		'title': 'Skåneleden',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown.',
		'thumbnail': 'project-2-thumb.jpg',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9914335/ef7d78e17d05574406af63fb9b8a351c.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/a2a25308a9674492c2f374bb6863552c.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/600dd106c07a8802b928b0c20fc90542.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/b575ac736d0291a2e424f94ee09c6f2e.jpg'
		],
		'link': 'www.skaneleden.se'
	},
	{
		'tags': ['webb','redaktionellt'],
		'id': 2,
		'title': 'Skånska Landskap',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. YOLO et semiotics fashion axe vinyl, chambray veniam street art organic sartorial. Portland scenester salvia cred labore, squid seitan delectus elit aliquip skateboard bitters. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown. Pinterest fugiat brunch DIY semiotics, photo booth gluten-free anim accusamus non lo-fi aliqua.',
		'thumbnail': 'project-3-thumb.png',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/d83ccb154536767bdcf3cfb83d780569.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/832b6840d0ec922534b0d3782ac44494.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/569357280ab89a7101fc57b99cc3abd9.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/2185eeac11335fffc72d23b34a24a72e.jpg'
		],
		'link': 'www.skanskalandskap.se'
	},
	{
		'tags': ['redaktionellt','kommunikation'],
		'id': 3,
		'title': 'Purity Vodka',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown.',
		'thumbnail': 'project-4-thumb.jpg',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/c96b27e0924edcb0d30575cc328d873d.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/44f3474b597969306df90e7728133656.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/12497f8e8884efab80c2ba95c6731e58.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/f2d6560c20561e20ac2ed7a33495e8de.jpg'
		],
		'link': 'www.purityvodka.com'
	},
	{
		'tags': ['webb','redaktionellt'],
		'id': 4,
		'title': 'VASYD',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. YOLO et semiotics fashion axe vinyl, chambray veniam street art organic sartorial. Portland scenester salvia cred labore, squid seitan delectus elit aliquip skateboard bitters. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown. Pinterest fugiat brunch DIY semiotics, photo booth gluten-free anim accusamus non lo-fi aliqua.',
		'thumbnail': 'project-5-thumb.jpg',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/10341033/34acc911836aedc3ef885b40f41ee153.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/3618063dca40c2d0aa23cf2a9f0aaffa.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/3276a8c560c8f5b117036ed77c3eeb1f.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/1484ef216279dc5657f16dddb2dfa2e3.jpg'
		],
		'link': 'www.vasyd.se'
	},
	{
		'tags': ['webb','kommunikation'],
		'id': 5,
		'title': 'Malmö Live',
		'desc': 'Flannel vero odio, aesthetic veniam umami Austin voluptate consequat. Ugh Portland mlkshk scenester wayfarers. Culpa Terry Richardson exercitation ennui, sapiente actually single-origin coffee irony pariatur brunch. 8-bit sint consectetur, ad Wes Anderson Schlitz Pinterest Cosby sweater chambray stumptown.',
		'thumbnail': 'project-6-thumb.jpg',
		'imgs': [
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/75ba6e334b6ec686927b43cf647fc043.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/df64b83d0e95577ff2e6af72b24fc30a.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/40461bd14a1ff8a78a30ea5ba14fe7c5.jpg',
			'http://behance.vo.llnwd.net/profiles23/1068649/projects/9493217/7ee3a198347fa20e96d4a330b4061da7.jpg'
		],
		'link': 'www.malmolive.se'
	}
];

}());