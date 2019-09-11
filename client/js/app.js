$(() =>
{
	$('#error').modal();
	$('#login').modal();
	$('#register').modal();
	addSpinnerToTOM();
	const API_URL = 'http://localhost:8181/';

	let offset = 0;
	let loading = false;
	let end = false;
	$(".account-dropdown").dropdown();
	$('.sidenav').sidenav( { edge: 'right', inDuration: 500, outDuration: 500 } );
	$.get(`${API_URL}tweets`, (data) =>
	{
		if(data.Error)
		{
			// ToDo
		}
		else
		{
			deleteSpinnerFromDOM();
			data.Success.Data.forEach(tweet =>
			{
				addTweetToDOM(tweet.text, tweet.account.username, tweet.createdAt);
			});
			addSpinnerToTOM();
		}
	})
	.catch(() =>
	{
		$('#error').modal('open');
		deleteSpinnerFromDOM();
	});
	$(window).scroll(() =>
	{
		if(!loading && !end)
			if(($(document).height() - $(this).height() - 150 <= $(this).scrollTop()))
			{
				loading = true;
				offset += 10;
				$.get(`${API_URL}tweets/${offset}`, (data) =>
				{
					if(data.Error)
					{
						// ToDo
					}
					else
					{
						if(data.Success.Data.length > 0)
						{
							data.Success.Data.forEach(tweet =>
							{
								addTweetToDOM(tweet.text, tweet.account.username, tweet.createdAt);
							});
							deleteSpinnerFromDOM();
						}
						else
						{
							end = true;
							offset -= 10;
							deleteSpinnerFromDOM();
						}
					}
					loading = false;
				});
			}
	});

	$(".login").on("click", () =>
	{
		openLogin();
	});

	$(".register").on("click", () =>
	{
		openRegistration();
	});
	function addSpinnerToTOM()
	{
		$('#tweets').append('<div class="row" style="margin-top: 30px;" id="spinner"><div class="s12 m12 l8 center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-yellow-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>')
	}

	function addTweetToDOM(tweet, createdBy, createdAt)
	{
		$('#tweets').append(
			`<div class="row"><div class="col s12 m12 l12"><div class="card"><div class="card-content">${tweet}</div><div class="card-action card-footer">Written by <i>${createdBy}</i> at <i>${createdAt}</i>
					</div>
				</div>
			</div>
		</div>`
		);
	}
	function deleteSpinnerFromDOM()
	{
		$('#spinner').remove();
	}

	function openLogin()
	{
		$('#login').modal('open');
	}

	function openRegistration()
	{
		$('#register').modal('open');
	}
});