/* Global My Lottery Checker object */
var app = app || {};

$(document).ready(function() {

	app.initialContent = new app.InitialContent({});

	/* Views Instances */
	app.lastDraw,
	app.setOfNumbers,
	app.billboard,

	app.extra,
	app.extraBtn,
	app.extraInput,

	app.guaranteedBtn,
	app.guaranteedInput,
	app.guaranteedPrize;

	var interval = setInterval(function() {
		if (app.lottery.get('readyLastDraw')) {
			app.lottery.compare();
			app.lottery.compareExtra();

			if (app.lottery.get('sort') === 'lotto649') {
				app.lottery.compareGuaranteed();
			}

			init();
			clearInterval(interval);
		}
	}, 100);

	function init() {
		app.lottery.set( {'phrases': app.i18n.i18nTranslated[localStorage.require + '_phrases'] } );

		app.lastDraw = new app.LastDraw({
			model: app.lottery
		});

		app.setOfNumbers = new app.SetOfNumber({
			model: app.lottery
		});

		app.billboard = new app.Billboard({
			model: app.lottery
		});

		app.extra = new app.Extra({
			model: app.lottery
		});

		app.extraBtn = new app.ExtraBtn({
			model: app.lottery
		});

		app.extraInput = new app.ExtraInput({
			model: app.lottery
		});

		if (app.lottery.get('sort') === 'lotto649') {
			app.guaranteedBtn = new app.GuaranteedBtn({
				model: app.lottery
			});

			app.guaranteedInput = new app.GuaranteedInput({
				model: app.lottery
			});

			app.guaranteedPrize = new app.GuaranteedPrize({
				model: app.lottery
			});
		}

		app.i18n.translate();

	}
});