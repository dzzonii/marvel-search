$(function (){
	// Variable for API json data
	var characters;
	// Function for loading all bookmarked characters from LocalStorage
	var localChars = function(){
		$('.content .characters-local').empty();
		for (var i = 0; i < localStorage.length; i++) {
		    var key = localStorage.key(i); // get key by index

		    if (key.indexOf("character") >= 0) { // if key contains string
		        var elem = localStorage.getItem(key); // get value by key
				parseElem = JSON.parse(elem);

		        $('.content .characters-local').append('<li data-key="'+ key +'"><div class="img-container"><img src="' + parseElem.thumbnail.path + '/standard_xlarge.' + parseElem.thumbnail.extension + '"></div><h5>' + parseElem.name + '</h5><button class="remove">X</button></li>');
		    }
		}
	};
	localChars();

	var removeLocal = function(){
		$('.content .characters-local .remove').click(function(){
			var keyRemoval = $(this).closest('li').attr('data-key');
			localStorage.removeItem(keyRemoval);
    		location.reload();
		});
	};
	removeLocal();

	$('#search').keyup(function(){
		setTimeout(function() {

			var searchField = $('#search').val();

			// Checks if search field is empty, so it renders items from localstorage and stops ajax request.
			if(!searchField){
				$('.content .search-result').empty();
				localChars();
				removeLocal();
				return;
			}

			var url = 'http://gateway.marvel.com/v1/public/characters?ts=1&limit=12&apikey=70e1fe2e617e3a6c5d8e4bb25b54a4bd&hash=4514584efd6c08c6f2a7a30fb0767fb5&nameStartsWith=' + searchField;

			$.ajax({
				type: 'GET',
				url: url,
				dataType: "json",
				beforeSend: function() {
					$('.search-box .loading').show();
				},
				success: function (data) {
					$('.search-box .loading').hide();
					$('.content .characters-local').empty();
			  		characters = data.data.results;

			  		$('.content .search-result').empty();
				    $.each(data.data.results, function(index){
				    	// Check if item is already bookmarked
				    	var alreadyMarked = '';
				    	for (var i = 0; i < localStorage.length; i++) {
						    var key = localStorage.key(i);
							var stringID = JSON.stringify(data.data.results[index].id);
						    if (key.indexOf(stringID) >= 0) { 
						        alreadyMarked = 'class="marked"';
						    }
						}

				    	$('.content .search-result').append('<li data-index="'+ index +'" '+ alreadyMarked +'><div class="img-container"><img src="' + data.data.results[index].thumbnail.path + '/standard_xlarge.' + data.data.results[index].thumbnail.extension + '"></div><h5>' + data.data.results[index].name + '</h5><button class="mark">+</button><span>Added</span></li>');
			    	});
				}
			});

        }, 500);

	});

	var bookmarkedChar = '';
	var parsedObject = [];

	$(document).ajaxStop(function() {
		// Bookmarking on + button
		$('.content .search-result li .mark').click(function(){
			var charItem = $(this).closest('li');
			charItem.addClass('marked');

			var charIndex = charItem.attr('data-index');
			bookmarkedChar = JSON.stringify(characters[charIndex]);

			localStorage.setItem('character' + characters[charIndex].id, bookmarkedChar);



			var retrievedObject = localStorage.getItem('character' + characters[charIndex].id);
			parsedObject = JSON.parse(retrievedObject);

			charItem.find('span').show();
			
		});

	});

});
