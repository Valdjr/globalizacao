(function($) {
	"use strict"

	///////////////////////////
	// Preloader
	$(window).on('load', function() {
		$("#preloader").delay(600).fadeOut();
		listarForum();
	});

	///////////////////////////
	// Scrollspy
	$('body').scrollspy({
		target: '#nav',
		offset: $(window).height() / 2
	});

	///////////////////////////
	// Smooth scroll
	$("#nav .main-nav a[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 600);
	});

	$('#back-to-top').on('click', function(){
		$('body,html').animate({
			scrollTop: 0
		}, 600);
	});

	$('#veja-mais').on('click', function(){
		$('body,html').animate({
			scrollTop: 900
		}, 600);
	});

	///////////////////////////
	// Btn nav collapse
	$('#nav .nav-collapse').on('click', function() {
		$('#nav').toggleClass('open');
	});

	///////////////////////////
	// Mobile dropdown
	$('.has-dropdown a').on('click', function() {
		$(this).parent().toggleClass('open-drop');
	});

	///////////////////////////
	// On Scroll
	$(window).on('scroll', function() {
		var wScroll = $(this).scrollTop();

		// Fixed nav
		wScroll > 1 ? $('#nav').addClass('fixed-nav') : $('#nav').removeClass('fixed-nav');

		// Back To Top Appear
		wScroll > 700 ? $('#back-to-top').fadeIn() : $('#back-to-top').fadeOut();
	});

	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'image'
	});

	///////////////////////////
	// Owl Carousel
	$('#about-slider').owlCarousel({
		items:1,
		loop:true,
		margin:15,
		nav: true,
		navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
		dots : true,
		autoplay : true,
		animateOut: 'fadeOut'
	});

	$('#testimonial-slider').owlCarousel({
		loop:true,
		margin:15,
		dots : true,
		nav: false,
		autoplay : true,
		responsive:{
			0: {
				items:1
			},
			992:{
				items:2
			}
		}
	});

})(jQuery);

function showModal(id, acao, nome, comentario) {
	$('#modalid').val(id);
	$('#modalacao').val(acao);
	$('#modalnome').val(nome);
	$('#modalcomentario').val(comentario);
	$('#myModal').modal();
}

function enviarCaptcha() {
	$.ajax({
		url: 'validar.php',
		method: 'post',
		data: {palavra: $('#palavra').val(), id: $('#modalid').val(), nome: $('#modalnome').val(), comentario: $('#modalcomentario').val(), acao: $('#modalacao').val()}
	}).done(function (result){
		console.log(result);
		result = JSON.parse(result);
		if(result) {
			$('#erroCaptcha').hide();
			$('#myModal').modal('hide');
			atualizarCaptcha();
			listarForum();
		} else {
			$('#erroCaptcha').show();
		}
	});
}

function atualizarCaptcha() {
	$('#captcha').attr('src','captcha.php?l=150&a=50&tf=20&ql=5');
}

function listarForum() {
	$.ajax({
		url: 'listarforum.php',
		method: 'post',
		data: {pesquisa: $('#pesquisaForum').val()}
	}).done(function (data){
		data = JSON.parse(data);

		positivos = data.positivos;
		negativos = data.negativos;

		$('#conteudoPositivo').html("");
		$('#conteudoNegativo').html("");

		positivos.forEach(function (elem, ind) {
			var up = $('<i class="fa fa-chevron-up" style="font-size: 15px;position: inherit; color: #6195FF;"></i>');
			var down = $('<i class="fa fa-chevron-down" style="font-size: 15px;position: inherit; color: #6195FF;"></i>');
			var button1 = $('<button  data-toggle="modal" onclick="showModal('+ elem.id +',1)">').addClass('btn').append(up);
			var sinal = elem.votos > 0 ? '+' : '';
			var span1 = $('<span>').html(" " + sinal + elem.votos + " ");
			var button2 = $('<button data-toggle="modal" onclick="showModal('+ elem.id +',2)">').addClass('btn').append(down);
			var div1 = $('<div>').addClass('team-content').css('float','right').append(button1).append(span1).append(button2);
			var nome = $('<span>').append($('<strong>').html(elem.nome == "" ? 'Anônimo' : elem.nome));
			nome.append($('<small>').html(" "+dataAtualFormatada(elem.data_comentario)));
			var divNomeBotoes = $('<div>').append(nome).append(div1);
			var span2 = $('<span>').html(elem.comentario);
			var div2 = $('<div>').addClass('service').append(divNomeBotoes).append($('<br>')).append(span2);
			$('#conteudoPositivo').append(div2);
		});

		negativos.forEach(function (elem, ind) {
			var up = $('<i class="fa fa-chevron-up" style="font-size: 15px;position: inherit; color: #6195FF;"></i>');
			var down = $('<i class="fa fa-chevron-down" style="font-size: 15px;position: inherit; color: #6195FF;"></i>');
			var button1 = $('<button data-toggle="modal" onclick="showModal('+ elem.id +',1)">').addClass('btn').append(up);
			var span1 = $('<span>').html(" " + elem.votos + " ");
			var button2 = $('<button  data-toggle="modal" onclick="showModal('+ elem.id +',2)">').addClass('btn').append(down);
			var div1 = $('<div>').addClass('team-content').css('float','right').append(button1).append(span1).append(button2);
			var nome = $('<span>').append($('<strong>').html(elem.nome == "" ? 'Anônimo' : elem.nome));
			nome.append($('<small>').html(" "+dataAtualFormatada(elem.data_comentario)));
			var divNomeBotoes = $('<div>').append(nome).append(div1);
			var span2 = $('<span>').html(elem.comentario);
			var div2 = $('<div>').addClass('service').append(divNomeBotoes).append($('<br>')).append(span2);
			$('#conteudoNegativo').append(div2);
		});
	});
}

function dataAtualFormatada(a){
    var data = new Date(a),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}