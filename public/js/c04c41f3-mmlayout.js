(function ( $ ) {
	'use strict';

	$( window ).on(
		'mmlayout/frontend/init',
		function () {
			qodefAddonsmmlayout.init();
			qodefAddonsmmlayoutPromoWidgets.init();

		}
	);

	var qodefAddonsmmlayout = {
		init: function () {
			var isEditMode = Boolean( mmlayoutFrontend.isEditMode() );

			if ( isEditMode ) {
				for ( var key in qodefAddonsCore.shortcodes ) {
					for ( var keyChild in qodefAddonsCore.shortcodes[key] ) {
						qodefAddonsmmlayout.reInitShortcode(
							key,
							keyChild
						);
					}
				}
			}
		},
		reInitShortcode: function ( key, keyChild ) {
			mmlayoutFrontend.hooks.addAction(
				'frontend/element_ready/' + key + '.default',
				function ( e ) {
					// Check if object doesn't exist and print the module where is the error.
					if ( typeof qodefAddonsCore.shortcodes[key][keyChild] === 'undefined' ) {
						console.log( keyChild );
					} else if ( typeof qodefAddonsCore.shortcodes[key][keyChild].initSlider === 'function' ) {
						var $sliders = e.find( '.qodef-qi-swiper-container' );
						if ( $sliders.length ) {
							$sliders.each(
								function () {
									qodefAddonsCore.shortcodes[key][keyChild].initSlider( $( this ) );
								}
							);
						}
					} else if ( typeof qodefAddonsCore.shortcodes[key][keyChild].initItem === 'function' && e.find( '.qodef-shortcode' ).length ) {
						qodefAddonsCore.shortcodes[key][keyChild].initItem( e.find( '.qodef-shortcode' ) );
					} else {
						qodefAddonsCore.shortcodes[key][keyChild].init();
					}
				}
			);
		},
	};

	var qodefAddonsmmlayoutPromoWidgets = {
		init: function () {
			if ( typeof mmlayout !== 'undefined' ) {
				mmlayout.hooks.addFilter(
					'panel/elements/regionViews',
					function ( panel ) {
						var qodeWidgetsPromoHandler,
							elementsView   = panel.elements.view,
							categoriesView = panel.categories.view;

						qodeWidgetsPromoHandler = {
							className: function () {
								var className = 'mmlayout-element-wrapper';
								if ( ! this.isEditable() ) {
									className += ' mmlayout-element--promotion';

									if ( this.isQodeWidget() ) {
										className += ' qodef-element--promotion';
									}
								}
								return className;
							},
							isQodeWidget: function () {

								if ( undefined !== this.model.get( 'name' ) ) {
									return 0 === this.model.get( 'name' ).indexOf( 'qi_' );
								}
							},
							getElementObj: function ( key ) {

								var widgetObj = mmlayout.config.promotionWidgets.find(
									function ( widget, index ) {
										if ( widget.name == key ) {
											return true;
										}
									}
								);

								return widgetObj;
							},
							onMouseDown: function () {
								var actionURL = mmlayout.config.elementPromotionURL.replace( '%s', this.model.get( 'name' ) ),
									title     = this.model.get( 'title' ),
									content   = sprintf(
										wp.i18n.__(
											'Use %s widget and dozens more pro features to extend your toolbox and build sites faster and better.',
											'qi-addons-for-mmlayout'
										),
										title
									),
									promotion = mmlayout.config.promotion.elements;

								if ( this.isQodeWidget() ) {
									var widgetObject = this.getElementObj( this.model.get( 'name' ) );
									if ( typeof widgetObject.helpUrl !== 'undefined' ) {
										actionURL = widgetObject.helpUrl;
									}

									content = sprintf(
										wp.i18n.__(
											'The %s comes with advanced professional functionalities and an even smoother website-making experience. %s Upgrade Qi Addons for mmlayout %s',
											'qi-addons-for-mmlayout'
										),
										title,
										'<a class="qodef-dialog-box-link" target="_blank" href="https://qodeinteractive.com/products/plugins/">',
										'</a>'
									);
								}

								mmlayout.promotion.showDialog(
									{
										// translators: %s: Widget Title.
										title: sprintf( wp.i18n.__( '%s Widget', 'qi-addons-for-mmlayout' ), title ),
										content: content,
										position: {
											blockStart: '-7',
										},
										targetElement: this.el,
										actionButton: {
											url: actionURL,
											text: promotion.action_button.text,
											classes: promotion.action_button.classes || ['mmlayout-button', 'go-pro']
										}
									}
								);
							}
						};

						panel.elements.view = elementsView.extend(
							{
								childView: elementsView.prototype.childView.extend( qodeWidgetsPromoHandler )
							}
						);

						panel.categories.view = categoriesView.extend(
							{
								childView: categoriesView.prototype.childView.extend(
									{
										childView: categoriesView.prototype.childView.prototype.childView.extend( qodeWidgetsPromoHandler )
									}
								)
							}
						);

						return panel;
					}
				);
			}
		},
	};

})( jQuery );
