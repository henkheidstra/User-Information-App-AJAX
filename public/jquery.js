$(document).ready(() => {


  $('#searchBar').keyup(() => {
    let input = $('#searchBar').val().toLowerCase();
    setTimeout(function() {
      $.ajax({
          type: "POST",
          url: '/search',
          data: {
            user: input
          },
        })
        .done((response) => {
          $('#users').empty();

          if (input === undefined || (input).length === 0) {
            $('#users').empty();
          } else {
            $.each(response, (index, user) => {
              $('#users').append(`<li>${user.firstname} ${user.lastname}</li>`);
            })
          };

          $('li').click(function() {
            $('#searchBar').val($(this).text());
            $('#users').empty();
            $('#searchBar').focus();
          });
        })
    }, 300);
  })
});