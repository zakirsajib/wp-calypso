/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' ),
	connect = require( 'react-redux' ).connect,
	find = require( 'lodash/find' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var activated = require( 'state/themes/actions' ).activated,
	Button = require( 'components/button' ),
	config = require( 'config' ),
	Dispatcher = require( 'dispatcher' ),
	Card = require( 'components/card' ),
	Main = require( 'components/main' ),
	analytics = require( 'analytics' ),
	getReceiptById = require( 'state/receipts/selectors' ).getReceiptById,
	isDomainMapping = require( 'lib/products-values' ).isDomainMapping,
	isDomainRegistration = require( 'lib/products-values' ).isDomainRegistration,
	isChargeback = require( 'lib/products-values' ).isChargeback,
	isBusiness = require( 'lib/products-values' ).isBusiness,
	isFreeTrial = require( 'lib/products-values' ).isFreeTrial,
	isGoogleApps = require( 'lib/products-values' ).isGoogleApps,
	isJetpackPlan = require( 'lib/products-values' ).isJetpackPlan,
	isJetpackPremium = require( 'lib/products-values' ).isJetpackPremium,
	isJetpackBusiness = require( 'lib/products-values' ).isJetpackBusiness,
	isPlan = require( 'lib/products-values' ).isPlan,
	isPremium = require( 'lib/products-values' ).isPremium,
	isSiteRedirect = require( 'lib/products-values' ).isSiteRedirect,
	isTheme = require( 'lib/products-values' ).isTheme,
	getPrimaryDomain = require( 'lib/domains' ).getPrimaryDomain,
	isSubdomain = require( 'lib/domains' ).isSubdomain,
	fetchReceipt = require( 'state/receipts/actions' ).fetchReceipt,
	refreshSitePlans = require( 'state/sites/plans/actions' ).refreshSitePlans,
	i18n = require( 'lib/mixins/i18n' ),
	PurchaseDetail = require( './purchase-detail' ),
	paths = require( 'my-sites/upgrades/paths' );

/**
 * Module variables
 */
var BusinessPlanDetails,
	ChargebackDetails,
	DomainMappingDetails,
	DomainRegistrationDetails,
	GenericDetails,
	GoogleAppsDetails,
	JetpackBusinessPlanDetails,
	JetpackPremiumPlanDetails,
	PremiumPlanDetails,
	SiteRedirectDetails;

function getPurchases( props ) {
	return props.receipt.data.purchases;
}

var CheckoutThankYou = React.createClass( {
	componentDidMount: function() {
		this.redirectIfThemePurchased();
		this.refreshSitesAndSitePlansIfPlanPurchased();

		if ( this.props.receiptId && ! this.props.receipt.hasLoadedFromServer && ! this.props.receipt.isRequesting ) {
			this.props.fetchReceipt( this.props.receiptId );
		}

		analytics.tracks.recordEvent( 'calypso_checkout_thank_you_view' );
	},

	componentWillReceiveProps: function() {
		this.redirectIfThemePurchased();
		this.refreshSitesAndSitePlansIfPlanPurchased();
	},

	refreshSitesAndSitePlansIfPlanPurchased: function() {
		if ( this.props.receipt.hasLoadedFromServer && getPurchases( this.props ).some( isPlan ) ) {
			// Refresh selected site plans if the user just purchased a plan
			this.props.refreshSitePlans( this.props.selectedSite.ID );

			// Refresh the list of sites to update the `site.plan` property
			// needed to display the plan name on the right of the `Plans` menu item
			Dispatcher.handleViewAction( {
				type: 'FETCH_SITES'
			} );
		}
	},

	isDataLoaded: function() {
		return ! this.props.receiptId || this.props.receipt.hasLoadedFromServer;
	},

	redirectIfThemePurchased: function() {
		if ( this.props.receipt.hasLoadedFromServer && getPurchases( this.props ).every( isTheme ) ) {
			this.props.activatedTheme( getPurchases( this.props )[ 0 ].meta, this.props.selectedSite );
			page.redirect( '/design/' + this.props.selectedSite.slug );
			return;
		}
	},

	thankYouHeader: function() {
		if ( ! this.isDataLoaded() ) {
			return <h1 className="checkout__thank-you-header">{ this.translate( 'Loading…' ) }</h1>;
		}

		if ( this.freeTrialWasPurchased() ) {
			return (
				<h1 className="checkout__thank-you-header">
					{
						this.translate( 'Your 14 day free trial starts today!' )
					}
				</h1>
			);
		}
		return <h1 className="checkout__thank-you-header">{ this.translate( 'Thank you for your purchase!' ) }</h1>
	},

	thankYouSubHeader: function() {
		var productName,
			headerText;

		if ( ! this.isDataLoaded() ) {
			return <h2 className="checkout__thank-you-subheader">{ this.translate( 'Loading…' ) }</h2>;
		}

		productName = this.getSingleProductName();

		if ( this.freeTrialWasPurchased() && productName ) {
			headerText = this.translate( 'We hope you enjoy %(productName)s. What\'s next? Take it for a spin!', {
				args: {
					productName: productName
				}
			} );
		} else if ( productName ) {
			headerText = this.translate( 'You will receive an email confirmation shortly for your purchase of ' +
				"%(productName)s. What's next?", {
					args: {
						productName: productName
					}
				}
			);
		} else {
			headerText = this.translate( 'You will receive an email confirmation shortly. What\'s next?' );
		}

		return <h2 className="checkout__thank-you-subheader">{ headerText }</h2>
	},

	getSingleProductName() {
		if ( this.props.receiptId && getPurchases( this.props ).length ) {
			return getPurchases( this.props )[ 0 ].productNameShort;
		}

		return null;
	},

	render: function() {
		var classes = classNames( 'checkout__thank-you', {
			'is-placeholder': ! this.isDataLoaded()
		} );

		return (
			<Main className={ classes }>
				<Card>
					<div className="thank-you-message">
						<span className="receipt-icon"></span>
						{ this.thankYouHeader() }
						{ this.thankYouSubHeader() }
					</div>
					{ this.productRelatedMessages() }
				</Card>

				<div className="get-support">
					<h3>{ this.translate( 'Questions? Need Help?' ) }</h3>
					{ this.supportRelatedMessages() }
				</div>
			</Main>
		);
	},

	freeTrialWasPurchased: function() {
		if ( ! this.props.receiptId ) {
			return false;
		}

		return getPurchases( this.props ).some( isFreeTrial );
	},

	jetpackPlanWasPurchased: function() {
		if ( ! this.props.receiptId ) {
			return false;
		}

		return getPurchases( this.props ).some( isJetpackPlan );
	},

	productRelatedMessages: function() {
		var selectedSite = this.props.selectedSite,
			purchases,
			componentClass,
			domain;

		if ( ! this.isDataLoaded() ) {
			return (
				<div>
					<PurchaseDetail isPlaceholder />
					<PurchaseDetail isPlaceholder />
					<PurchaseDetail isPlaceholder />
				</div>
			);
		}

		if ( this.props.receiptId ) {
			purchases = getPurchases( this.props );

			if ( purchases.some( isJetpackPremium ) ) {
				componentClass = JetpackPremiumPlanDetails;
			} else if ( purchases.some( isJetpackBusiness ) ) {
				componentClass = JetpackBusinessPlanDetails;
			} else if ( purchases.some( isPremium ) ) {
				componentClass = PremiumPlanDetails;
			} else if ( purchases.some( isBusiness ) ) {
				componentClass = BusinessPlanDetails;
			} else if ( purchases.some( isGoogleApps ) ) {
				domain = find( purchases, isGoogleApps ).meta;

				componentClass = GoogleAppsDetails;
			} else if ( purchases.some( isDomainRegistration ) ) {
				domain = find( purchases ).meta;

				componentClass = DomainRegistrationDetails;
			} else if ( purchases.some( isDomainMapping ) ) {
				domain = find( purchases, isDomainMapping ).meta;

				componentClass = DomainMappingDetails;
			} else if ( purchases.some( isSiteRedirect ) ) {
				domain = find( purchases, isSiteRedirect ).meta;

				componentClass = SiteRedirectDetails;
			} else if ( purchases.some( isChargeback ) ) {
				componentClass = ChargebackDetails;
			} else {
				componentClass = GenericDetails;
			}
		} else {
			componentClass = GenericDetails;
		}

		return (
			<div>
				{ React.createElement( componentClass, {
					selectedSite: selectedSite,
					isFreeTrial: this.freeTrialWasPurchased(),
					locale: i18n.getLocaleSlug(),
					domain: domain
				} ) }
			</div>
		);
	},

	supportRelatedMessages: function() {
		var localeSlug = i18n.getLocaleSlug();

		if ( ! this.isDataLoaded() ) {
			return <p>{ this.translate( 'Loading…' ) }</p>;
		}

		if ( this.jetpackPlanWasPurchased() ) {
			return (
				<p>
					{ this.translate(
						'Check out our {{supportDocsLink}}support docs{{/supportDocsLink}} ' +
						'or {{contactLink}}contact us{{/contactLink}}.',
						{
							components: {
								supportDocsLink: <a href={ 'http://jetpack.me/support/' } target="_blank" />,
								contactLink: <a href={ 'http://jetpack.me/contact-support/' } target="_blank" />
							}
						}
					) }
				</p>
			);
		}

		return (
			<p>
				{ this.translate(
					'Check out our {{supportDocsLink}}support docs{{/supportDocsLink}}, ' +
					'search for tips and tricks in {{forumLink}}the forum{{/forumLink}}, ' +
					'or {{contactLink}}contact us{{/contactLink}}.',
					{
						components: {
							supportDocsLink: <a href={ 'http://' + localeSlug + '.support.wordpress.com' } target="_blank" />,
							forumLink: <a href={ 'http://' + localeSlug + '.forums.wordpress.com' } target="_blank" />,
							contactLink: <a href={ '/help/contact' } />
						}
					}
				) }
			</p>
		);
	}
} );

PremiumPlanDetails = React.createClass( {
	render: function() {
		var adminUrl = this.props.selectedSite.URL + '/wp-admin/',
			customizeLink = config.isEnabled( 'manage/customize' ) ? '/customize/' + this.props.selectedSite.slug : adminUrl + 'customize.php?return=' + encodeURIComponent( window.location.href ),
			showGetFreeDomainTip = ! this.props.isFreeTrial;

		return (
			<ul className="purchase-details-list">
				{ showGetFreeDomainTip
				? <PurchaseDetail
						additionalClass="get-free-domain"
						title={ this.translate( 'Get a free domain' ) }
						description={ this.translate( 'WordPress.com Premium includes a free domain for your site.' ) }
						buttonText={ this.translate( 'Add Free Domain' ) }
						href={ '/domains/add/' + this.props.selectedSite.slug } />
					: null
				}

				{ ! showGetFreeDomainTip
				? <PurchaseDetail
						additionalClass="ads-have-been-removed"
						title={ this.translate( 'Ads have been removed!' ) }
						description={ this.translate( 'WordPress.com ads will not show up on your blog.' ) }
						buttonText={ this.translate( 'View Your Site' ) }
						href={ this.props.selectedSite.URL }
						target="_blank" />
					: null
				}

				<PurchaseDetail
					additionalClass="customize-fonts-and-colors"
					title={ this.translate( 'Customize Fonts & Colors' ) }
					description={ this.translate( 'You now have access to full font and CSS editing capabilites.' ) }
					buttonText={ this.translate( 'Customize Your Site' ) }
					href={ customizeLink }
					target={ config.isEnabled( 'manage/customize' ) ? undefined : '_blank' } />

				<PurchaseDetail
					additionalClass="upload-to-videopress"
					title={ this.translate( 'Upload to VideoPress' ) }
					description={ this.translate( "Uploading videos to your blog couldn't be easier." ) }
					buttonText={ this.translate( 'Start Using VideoPress' ) }
					href={ this.props.selectedSite.URL + '/wp-admin/media-new.php' }
					target="_blank" />
			</ul>
		);
	}
} );

JetpackPremiumPlanDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="akismet"
					title={ this.translate( 'Akismet' ) }
					description={ this.translate( 'Say goodbye to comment spam' ) }
					buttonText={ this.translate( 'Start using Akismet' ) }
					href="https://support.wordpress.com/setting-up-premium-services/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="vaultpress"
					title={ this.translate( 'VaultPress' ) }
					description={ this.translate( 'Backup your site' ) }
					buttonText={ this.translate( 'Start using VaultPress' ) }
					href="https://support.wordpress.com/setting-up-premium-services/"
					target="_blank" />
			</ul>
		);
	}
} );

BusinessPlanDetails = React.createClass( {
	render: function() {
		var showGetFreeDomainTip = ! this.props.isFreeTrial;

		return (
			<ul className="purchase-details-list">
				{ showGetFreeDomainTip
				? <PurchaseDetail
						additionalClass="get-free-domain"
						title={ this.translate( 'Get a free domain' ) }
						description={ this.translate( 'WordPress.com Business includes a free domain for your site.' ) }
						buttonText={ this.translate( 'Add Free Domain' ) }
						href={ '/domains/add/' + this.props.selectedSite.slug } />
				: <PurchaseDetail
						additionalClass="live-chat"
						title={ this.translate( 'Start a Live Chat' ) }
						description={ this.translate( 'Have a question? Chat live with WordPress.com Happiness Engineers.' ) }
						buttonText={ this.translate( 'Talk to an Operator' ) }
						href="//support.wordpress.com/live-chat/"
						target="_blank" />
				}

				<PurchaseDetail
					additionalClass="unlimited-premium-themes"
					title={ this.translate( 'Browse Themes' ) }
					description={ this.translate( 'Browse our collection of beautiful and amazing themes for your site.' ) }
					buttonText={ this.translate( 'Find a New Theme' ) }
					href={ '/design/' + this.props.selectedSite.slug } />

				<PurchaseDetail
					additionalClass="connect-google-analytics"
					title={ this.translate( 'Integrate Google Analytics' ) }
					description={ this.translate( 'Connect your site to your existing Google Analytics account.' ) }
					buttonText={ this.translate( 'Connect Google Analytics' ) }
					href={ '/settings/analytics/' + this.props.selectedSite.slug } />
			</ul>
		);
	}
} );

JetpackBusinessPlanDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="akismet"
					title={ this.translate( 'Akismet' ) }
					description={ this.translate( 'Say goodbye to comment spam' ) }
					buttonText={ this.translate( 'Start using Akismet' ) }
					href="https://support.wordpress.com/setting-up-premium-services/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="vaultpress"
					title={ this.translate( 'VaultPress' ) }
					description={ this.translate( 'Backup your site' ) }
					buttonText={ this.translate( 'Start using VaultPress' ) }
					href="https://support.wordpress.com/setting-up-premium-services/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="polldaddy"
					title={ this.translate( 'PollDaddy' ) }
					description={ this.translate( 'Create surveys and polls' ) }
					buttonText={ this.translate( 'Start using PollDaddy' ) }
					href="https://support.wordpress.com/setting-up-premium-services/"
					target="_blank" />
			</ul>
		);
	}
} );

DomainMappingDetails = React.createClass( {
	getInitialState: function() {
		return {
			primaryDomain: null
		};
	},

	componentWillMount: function() {
		getPrimaryDomain( this.props.selectedSite.ID, function( error, data ) {
			if ( ! error && data ) {
				this.setState( { primaryDomain: data.domain } );
			}
		}.bind( this ) );
	},

	render: function() {
		var primaryDomainDescription,
			supportDoc;

		if ( isSubdomain( this.props.domain ) ) {
			supportDoc = 'https://support.wordpress.com/domains/map-subdomain/';
		} else {
			supportDoc = 'https://support.wordpress.com/domains/map-existing-domain/';
		}

		if ( this.state.primaryDomain === this.props.domain ) {
			primaryDomainDescription = this.translate( '%(domain)s is your primary domain. Do you want to change it?', { args: { domain: this.props.domain } } );
		} else {
			primaryDomainDescription = this.translate( 'Want this to be your primary domain for this site?' );
		}

		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="important"
					title={ this.translate( 'Important!' ) }
					description={ this.translate( "Your domain mapping won't work until you update the DNS settings." ) }
					buttonText={ this.translate( 'Learn More' ) }
					href={ supportDoc }
					target="_blank" />

				<PurchaseDetail
					additionalClass="your-primary-domain"
					title={ this.translate( 'Your Primary Domain' ) }
					description={ primaryDomainDescription }
					buttonText={ this.translate( 'Update Settings' ) }
					href={ getDomainManagementUrl( this.props.selectedSite, this.props.domain ) } />

				{ ! isPlan( this.props.selectedSite.plan ) ? <PurchaseDetail
					additionalClass="upgrade-now"
					title={ this.translate( 'Upgrade Now' ) }
					description={ this.translate( 'Take your blog to the next level by upgrading to one of our plans.' ) }
					buttonText={ this.translate( 'View Plans' ) }
					href={ '/plans/' + this.props.selectedSite.slug } /> : null }
			</ul>
		);
	}
} );

DomainRegistrationDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="important"
					title={ this.translate( 'Important!' ) }
					description={ this.translate( 'It can take up to 72 hours for your domain setup to complete.' ) }
					buttonText={ this.translate( 'Learn More' ) }
					href="//support.wordpress.com/domains/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="your-primary-domain"
					title={ this.translate( 'Your Primary Domain' ) }
					description={ this.translate( 'Want this to be your primary domain for this site?' ) }
					buttonText={ this.translate( 'Update Settings' ) }
					href={ getDomainManagementUrl( this.props.selectedSite, this.props.domain ) } />

				{ ! isPlan( this.props.selectedSite.plan ) ? <PurchaseDetail
					additionalClass="upgrade-now"
					title={ this.translate( 'Upgrade Now' ) }
					description={ this.translate( 'Take your blog to the next level by upgrading to one of our plans.' ) }
					buttonText={ this.translate( 'View Plans' ) }
					href={ '/plans/' + this.props.selectedSite.slug } /> : null }
			</ul>
		);
	}
} );

GoogleAppsDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="google-apps-details"
					title={ this.translate( 'Google Apps Setup' ) }
					description={ this.translate( 'You will receive an email shortly with your login information.' ) }
					buttonText={ this.translate( 'More about Google Apps' ) }
					href="https://support.wordpress.com/add-email/adding-google-apps-to-your-site/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="important"
					title={ this.translate( 'Important!' ) }
					description={ this.translate( 'It can take up to 72 hours for your domain setup to complete.' ) }
					buttonText={ this.translate( 'Learn More' ) }
					href="//support.wordpress.com/domains/"
					target="_blank" />

				<PurchaseDetail
					additionalClass="your-primary-domain"
					title={ this.translate( 'Your Primary Domain' ) }
					description={ this.translate( 'Want this to be your primary domain for this site?' ) }
					buttonText={ this.translate( 'Update Settings' ) }
					href={ getDomainManagementUrl( this.props.selectedSite, this.props.domain ) } />
			</ul>
		);
	}
} );

SiteRedirectDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="redirect-now-working"
					title={ this.translate( 'Redirect now working' ) }
					description={ this.translate( 'Visitors to your site will be redirected to your chosen target.' ) }
					buttonText={ this.translate( 'Test Redirect' ) }
					href={ this.props.selectedSite.URL }
					target="_blank" />

				<PurchaseDetail
					additionalClass="change-redirect-settings"
					title={ this.translate( 'Change redirect settings' ) }
					description={ this.translate( 'You can disable the redirect or change the target at any time.' ) }
					buttonText={ this.translate( 'My Domains' ) }
					href={ getDomainManagementUrl( this.props.selectedSite ) } />
			</ul>
		);
	}
} );

ChargebackDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<PurchaseDetail
					additionalClass="important"
					title={ this.translate( 'Important!' ) }
					description={ this.translate( 'The chargeback fee has been paid and you can now use the full features of your site.' ) }
					buttonText={ this.translate( 'Write a Post' ) }
					href={ '/post/' + this.props.selectedSite.slug } />

				{ ! isPlan( this.props.selectedSite.plan ) ? <PurchaseDetail
					additionalClass="upgrade-now"
					title={ this.translate( 'Upgrade Now' ) }
					description={ this.translate( 'Take your blog to the next level by upgrading to one of our plans.' ) }
					buttonText={ this.translate( 'View Plans' ) }
					href={ '/plans/' + this.props.selectedSite.slug } /> : null }
			</ul>
		);
	}
} );

GenericDetails = React.createClass( {
	render: function() {
		return (
			<ul className="purchase-details-list">
				<Button href={ this.props.selectedSite.URL } primary>
					{ this.translate( 'Back to my site' ) }
				</Button>
			</ul>
		);
	}
} );

function getDomainManagementUrl( selectedSite, domain ) {
	let url;

	if ( config.isEnabled( 'upgrades/domain-management/list' ) ) {
		if ( domain ) {
			url = paths.domainManagementEdit( selectedSite.domain, domain );
		} else {
			url = paths.domainManagementList( selectedSite.domain );
		}
	} else {
		url = '/my-domains/' + selectedSite.ID;
	}

	return url;
}

module.exports = connect(
	function mapStateToProps( state, props ) {
		return {
			receipt: getReceiptById( state, props.receiptId )
		};
	},
	function mapDispatchToProps( dispatch ) {
		return {
			activatedTheme: function( meta, selectedSite ) {
				dispatch( activated( meta, selectedSite, 'calypstore', true ) );
			},
			fetchReceipt: function( receiptId ) {
				dispatch( fetchReceipt( receiptId ) );
			},
			refreshSitePlans: function( siteId ) {
				dispatch( refreshSitePlans( siteId ) );
			}
		};
	}
)( CheckoutThankYou );
