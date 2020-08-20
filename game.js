Array.prototype.shuffle = function(){
	var newArr = [];

	this.forEach(function(f){
		newArr.splice( Math.floor( Math.random()*newArr.length ), 0, f );
	});
	
	l = newArr.length;
	for(x=0; x<l; x++){
		this.splice( x, 1, newArr[x] );
	}
};
jQuery.prototype.shuffle = Array.prototype.shuffle;
jQuery.prototype.forEach = function(f){
	for(x=0; x<this.length; x++){
		f( this[x], x );
	}
};

var sprites = [];
var decks = [];
var colors = [ 'blue', 'black', 'yellow', 'green' ];
var texts = [ '6', '7', '8', '9', '10', 'U', 'O', 'K', 'A' ];
var player = 'player1';

colors.forEach(function(f){
	texts.forEach(function(n){
		var sprite = document.createElement('div');
		sprite.classList.add('sprite');
		sprite.classList.add(f+'-card');
		sprite.innerHTML = n;
		//sprites[n+'-'+f] = tmp;
		$XE.easy('flip-in-x').apply( sprite );
		sprites.push( sprite );
	});
});

sprites.shuffle();
decks = sprites.splice( 0, 1 );

function prepare(){
	place_card = decks[0];
	player1 = sprites.splice( 0, 5 );
	player2 = sprites.splice( 0, 5 );
	market = sprites.splice( 0, 5 );

	$('#card-place').append( place_card );
	window.currentCard = place_card;
	window.cardCount = 1;
	window.cardPicked = 0;

	player1.forEach(function(f){
		f.onclick = fromPlayer;
		$('#player1').append( f );
	});

	player2.forEach(function(f){
		f.onclick = fromPlayer;
		$('#player2').append( f );
	});

	market.forEach(function(f){
		f.onclick = fromMarket;
		$('#card-deck').append( f );
	});

	setTimeout(function(){
		$XE.control( '.sprite' ).start();
	}, 900);
	setTimeout(function(){
		$('#dialog').toggleClass('hide');
	}, 1300);
}

function fromPlayer(){
	Card = '';

	if( this.parentElement.id!=window.player ){
		return;
	}

	if( window.currentCard.innerHTML=='7' && this.innerHTML=='7' && !window.Picking && !window.justPicked ){
		Card = window.currentCard.innerHTML;
	} else if( window.mustPick ){
		return;
	}

	if( this.innerHTML!='U' && window.currentCard.innerHTML!='U' && window.currentCard.classList[1]!=this.classList[1] && window.currentCard.innerHTML!=this.innerHTML ){
		return;
	}

	window.currentCard = this;
	window.cardCount = 1;
	window.cardPicked = 0;
	this.onclick = null;
	$('#card-place').append( this );
	window.player = { 'player1': 'player2', 'player2': 'player1' }[window.player];
	window.justPicked = false;

	msg = window.player+'\'s turn';

	if( this.innerHTML=='7' ){
		window.mustPick = true;
		window.justPicked = true;
		window.cardCount = (Card=='7') ? 4 : 2;
		msg = window.player+' should pick '+( Card=='7' ? 'four' : 'two' )+' cards';
	}
	
	if( this.innerHTML=='U' ){
		window.player = { 'player1': 'player2', 'player2': 'player1' }[window.player];
	} else {
		showDialog(msg);
	}
}

function fromMarket(){
	this.onclick = fromPlayer;
	$('#'+window.player).append( this );
	l = $('#card-deck>*').length;
	if( window.cardPicked >= window.cardCount-1 ){
		window.mustPick = false;
		window.Picking = false;
		window.cardCount = 1;
		window.cardPicked = 0;
		window.player = { 'player1': 'player2', 'player2': 'player1' }[window.player];
		if( l>0 ) showDialog(window.player+'\'s turn');
	} else {
		window.Picking = true;
		window.cardPicked++;
	}

	if( l==0 ){
		calculateScore();
	}
}

function showDialog( msg ){
	$('#dialog>div>h3').text(msg);
	$('#dialog').toggleClass('hide');
	setTimeout(function(){
		$('#dialog').toggleClass('hide');
	}, 1300);
}

function calculateScore(){
	$('#dialog>div>h3').text('new game');
	$('#dialog').toggleClass('hide');

	$('#player1').html();
	$('#player2').html();
	$('#card-deck').html();
	$('#card-place').html();

	sprites = $('.sprite:not(#card-place>*:last-child)');
	sprites.shuffle();
	decks[0] = $('#card-place>*:last-child')[0];

	setTimeout(function(){
		prepare();
	}, 1000);
}

prepare();