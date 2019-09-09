$(() =>
{
	let offset = 0;
	loading = false;
	$(".account-dropdown").dropdown();
	$('.sidenav').sidenav( { edge: 'right', inDuration: 500, outDuration: 500 } );
	$.get('http://localhost:8181/tweets', (data) =>
	{
		if(data.Error)
		{
			// ToDo
		}
		else
		{
			data.Success.Data.forEach(tweet =>
			{
				$('#tweets').append(
					`<div class="row"><div class="s12 m12 l8"><div class="card"><div class="card-content">${tweet.text}</div><div class="card-action card-footer">Written by <i>${tweet.account.username}</i> at <i>${tweet.createdAt}</i>
							</div>
						</div>
					</div>
				</div>`
				);
			});
			$('#tweets').append('<div class="row" style="margin-top: 30px;" id="spinner"><div class="s12 m12 l8 center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-yellow-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>')
		}
	});
	$(window).scroll(() =>
	{
		if(!loading)
			if(($(document).height() - $(this).height() - 150 <= $(this).scrollTop()))
			{
				loading = true;
				offset += 10;
				$.get(`http://localhost:8181/tweets/${offset}`, (data) =>
				{
					console.log(data);
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
								$('#tweets').append(
									`<div class="row"><div class="s12 m12 l8"><div class="card"><div class="card-content">${tweet.text}</div><div class="card-action card-footer">Written by <i>${tweet.account.username}</i> at <i>${tweet.createdAt}</i>
											</div>
										</div>
									</div>
								</div>`
								);
							});
							$('#spinner').remove();
							$('#tweets').append('<div class="row" style="margin-top: 30px;" id="spinner"><div class="s12 m12 l8 center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-yellow-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>')
						}
						else
						{
							$('#spinner').remove();
						}
					}
					loading = false;
				});
			}
	});
});