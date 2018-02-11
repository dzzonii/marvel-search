$(function (){

	var characters;
	var localCharacters;

	var localChars = function(){
		$('#root .characters-local').empty();
		for (var i = 0; i < localStorage.length; i++) {
		    var key = localStorage.key(i); // get key by index

		    if (key.indexOf("character") >= 0) { // if starts with _#
		        var elem = localStorage.getItem(key); // get value by key
				parseElem = JSON.parse(elem);
		        // console.log(parseElem); // print it out / do something else
		        $('#root .characters-local').append('<li data-key="'+ key +'"><img src="' + parseElem.thumbnail.path + '/standard_xlarge.' + parseElem.thumbnail.extension + '"><h5>' + parseElem.name + '</h5><button class="remove">X</button></li>');
		    }
		}
	};
	localChars();

	var removeLocal = function(){
		$('#root .characters-local .remove').click(function(){
			var keyRemoval = $(this).closest('li').attr('data-key');
			// console.log(keyRemoval);
			localStorage.removeItem(keyRemoval);
    		location.reload();
		});
	};
	removeLocal();

	$('#search').keyup(function(){
		var searchField = $('#search').val();

		// Checks if search field is empty, so it renders items from localstorage and stops ajax request.
		if(!searchField){
			localChars();
    		location.reload();
			return;
		}

		var url = 'http://gateway.marvel.com/v1/public/characters?ts=1&limit=12&apikey=70e1fe2e617e3a6c5d8e4bb25b54a4bd&hash=4514584efd6c08c6f2a7a30fb0767fb5&nameStartsWith=' + searchField;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: "json",
			beforeSend: function() {
				$('#root .loading').show();
			},
			success: function (data) {
				$('#root .loading').hide();
				$('#root .characters-local').empty();
		  		characters = data.data.results;

		  		$('#root .search-result').empty();
			    $.each(data.data.results, function(index){
			    	// Check if item is already bookmarked
			    	var alreadyMarked = '<span></span>';
			    	for (var i = 0; i < localStorage.length; i++) {
					    var key = localStorage.key(i);
						var stringID = JSON.stringify(data.data.results[index].id);
					    if (key.indexOf(stringID) >= 0) { 
					        var alreadyMarked = '<span>Marked</span>';
					    }
					}

			    	$('#root .search-result').append('<li data-index="'+ index +'"><img src="' + data.data.results[index].thumbnail.path + '/standard_xlarge.' + data.data.results[index].thumbnail.extension + '"><h5>' + data.data.results[index].name + '</h5><button class="mark">bookmark</button>'+ 	alreadyMarked +'</li>');
		    	});


			}
		});

	});


			var bookmarkedChar = '';
			var parsedObject = [];

	$(document).ajaxStop(function() {
		$('#root .search-result li .mark').click(function(){
			var charItem = $(this).closest('li');

			var charIndex = charItem.attr('data-index');
			bookmarkedChar = JSON.stringify(characters[charIndex]);

			localStorage.setItem('character' + characters[charIndex].id, bookmarkedChar);



			var retrievedObject = localStorage.getItem('character' + characters[charIndex].id);
			parsedObject = JSON.parse(retrievedObject);

			charItem.find('span').text('MARK!!');
			
		});

	});

});
