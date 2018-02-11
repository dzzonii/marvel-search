$(function (){

	var localChars = function(){
		var localCharacters = localStorage.getItem('characters');
		localCharacters = JSON.parse(localCharacters);
		$.each(localCharacters, function(index){
	    	$('#root .characters-local').append('<li><img src="' + localCharacters[index].thumbnail.path + '/standard_xlarge.' + localCharacters[index].thumbnail.extension + '"><h5>' + localCharacters[index].name + '</h5></li>');
    	});
		console.log(localCharacters);
	}

	$('#search').keyup(function(){
		var searchField = $('#search').val();

		// Checks if search field is empty, so it renders items from localstorage and stops ajax request.
		if(!searchField){
			localChars();
			$('#root .search-result').empty();
			return;
		}

		var url = 'http://gateway.marvel.com/v1/public/characters?ts=1&limit=12&apikey=70e1fe2e617e3a6c5d8e4bb25b54a4bd&hash=4514584efd6c08c6f2a7a30fb0767fb5&nameStartsWith=' + searchField;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: "json",
			beforeSend: function() {
				$('#root span').show();
			},
			success: function (data) {
				$('#root span').hide();
		  		var characters = data.data.results;

		  		$('#root .search-result').empty();
			    $.each(data.data.results, function(index){
			    	$('#root .search-result').append('<li><img src="' + data.data.results[index].thumbnail.path + '/standard_xlarge.' + data.data.results[index].thumbnail.extension + '"><h5>' + data.data.results[index].name + '</h5></li>');
		    	});

			    localStorage.setItem('characters', JSON.stringify(characters));

				$('#root .characters-local').empty();

			}
		});
	});

	// $(document).ajaxStop(function() {
		// console.log(characters);
	// });

	localChars();

});
