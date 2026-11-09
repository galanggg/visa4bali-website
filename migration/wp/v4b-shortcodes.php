<?php
/**
 * Visa4Bali design B: data-driven parts of the new design, rendered from WooCommerce products.
 * Installed as a WPCode PHP snippet ("V4B design B shortcodes"). Source of truth: this file in the repo
 * (migration/wp/v4b-shortcodes.php); the CSS block between the markers is generated from
 * design/2026-10-b-lengkap/style.css by migration/wp/scope-css.py and scoped under .v4b, so it cannot touch old pages.
 *
 * Shortcodes:
 *   [v4b_finder]                       home visa finder (CSS-only tabs, no JS)
 *   [v4b_stays link="list"]            three stay groups with "from" price
 *   [v4b_visa_table group="…"]         shop table; no group = all three groups
 *   [v4b_related]                      up to three other visas from the current product's group
 *   [v4b_crumbs]                       product breadcrumb
 *   [v4b_product part="head|buy"]      single product: code, H1, short text, facts, inline buy box | sticky buy box
 *
 * Everything works without JavaScript: WP Rocket delays JS until the first interaction on this site.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// WPCode may evaluate a snippet twice in one request (activation test); declare everything once.
if ( ! function_exists( 'v4b_item' ) ) {

if ( ! defined( 'V4B_WA' ) ) {
	define( 'V4B_GROUPS', array( 'arriving-soon', 'already-in-bali', 'staying-longer' ) );
	define( 'V4B_WA', 'https://wa.me/6287862273133' );
	// Go-live switch. build.sh writes false; "LIVE=1 sh build.sh" writes true. Pushing the other build is the rollback.
	define( 'V4B_LIVE', false );
}

/* Stylesheet: loaded for editors always (to build and preview drafts), for visitors once V4B_LIVE is true (go-live). */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! V4B_LIVE && ! current_user_can( 'edit_pages' ) ) { return; }
	wp_register_style( 'v4b', false, array(), '1' );
	wp_enqueue_style( 'v4b' );
	wp_add_inline_style( 'v4b', v4b_css() );
}, 20 );

/* ShopLentor/WooLentor renders its global single-product template (woolentor_woo_template_tabs[singleproductpage] = 424)
   on every product, so Elementor Pro's Theme Builder template 2255 never gets a turn. Step WooLentor aside for design-B
   products only (categories arriving-soon / already-in-bali / staying-longer); every other product keeps 424.
   Until go-live those categories hold only draft/private products, so visitors see no change. */
add_filter( 'option_woolentor_woo_template_tabs', function ( $o ) {
	if ( is_array( $o ) && ! is_admin() && function_exists( 'is_product' ) && is_product()
		&& has_term( V4B_GROUPS, 'product_cat', get_queried_object_id() ) ) {
		$o['singleproductpage'] = '0';
	}
	return $o;
} );

/* Elementor Pro validates Tel fields server-side against [0-9()#&+*-=.]+ and rejects spaces, so the Contact form (2272)
   refused "+62 813 3701 8814", the way people write WhatsApp numbers. Sanitising runs before validation: drop the spaces. */
add_filter( 'elementor_pro/forms/sanitize/tel', function ( $value ) {
	return preg_replace( '/\s+/u', '', (string) $value );
} );

/* 301s for the old URLs, only once live. Retired products are Draft (kept whole), so without this their URLs would 404.
   Priority 1 runs before redirect_canonical's 404 guessing. Keep in sync with products-payload.json "retire". */
add_action( 'template_redirect', function () {
	if ( ! V4B_LIVE ) { return; }
	$map  = array(
		'/shop/'                                   => '/our-services/',
		'/product-category/arriving-soon/'         => '/our-services/#arriving-soon',
		'/product-category/already-in-bali/'       => '/our-services/#already-in-bali',
		'/product-category/staying-longer/'        => '/our-services/#staying-longer',
		'/product/offshore-business-visa-d212-ru/' => '/product/d1-multiple-entry-tourist-visa/',
		'/product/family-visa/'                    => '/product/family-kitas-offshore/',
		'/product/c12-d12-visa/'                   => '/product/d12-multiple-entry-visa-1-year/',
		'/product/remote-working-visa-e33g/'       => '/product/e33g-remote-worker-kitas/',
		'/product/visa4bali-onshore-ru/'           => '/our-services/',
	);
	$path = trailingslashit( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ) );
	if ( isset( $map[ $path ] ) ) {
		wp_safe_redirect( home_url( $map[ $path ] ), 301, 'Visa4Bali design B' );
		exit;
	}
}, 1 );

// Owner 2026-11-09: one price format everywhere, "Rp 750.000"; WooCommerce is set to the same at go-live.
function v4b_rp( $n ) { return 'Rp ' . number_format( (float) $n, 0, ',', '.' ); }
function v4b_meta( $id, $key ) { return (string) get_post_meta( $id, $key, true ); }
function v4b_wa( $visa ) { return V4B_WA . '?text=' . rawurlencode( "Hello Visa4Bali, I'd like to ask about " . $visa ); }

/** One visa as the design needs it. Prices come from WooCommerce, so changing a price in Woo changes the site. */
function v4b_item( $p ) {
	if ( is_numeric( $p ) || $p instanceof WP_Post ) { $p = wc_get_product( $p ); }
	if ( ! $p ) { return null; }
	$id   = $p->get_id();
	$item = array(
		'id'    => $id,
		'p'     => $p,
		'code'  => v4b_meta( $id, 'v4b_code' ),
		'name'  => v4b_meta( $id, 'v4b_short_name' ) ?: $p->get_name(),
		'title' => v4b_meta( $id, 'v4b_title' ) ?: $p->get_name(),
		'label' => $p->get_name(),
		'url'   => get_permalink( $id ),
		'stay'  => v4b_meta( $id, 'v4b_stay' ),
		'time'  => v4b_meta( $id, 'v4b_time' ),
		'from'  => (bool) v4b_meta( $id, 'v4b_from' ),
		'extra' => v4b_meta( $id, 'v4b_extra' ),
		'incl'  => v4b_meta( $id, 'v4b_buy_incl' ),
		'chat'  => $p->is_type( 'external' ),
		'type'  => $p->get_type(),
		'price' => (float) $p->get_regular_price(),
		'fast'  => null,
		'vid'   => 0,
		'buy'   => '',
	);
	if ( $p->is_type( 'variable' ) ) {
		$item['price'] = (float) $p->get_variation_regular_price( 'min' );
		$public        = array();
		foreach ( $p->get_children() as $vid ) {
			$v = wc_get_product( $vid );
			if ( ! $v || 'publish' !== $v->get_status() ) { continue; }
			$public[] = $v;
			$opt      = strtolower( (string) $v->get_attribute( 'processing' ) );
			if ( 'regular' === $opt ) { $item['price'] = (float) $v->get_regular_price(); $item['vid'] = $vid; }
			if ( 'faster' === $opt ) {
				$item['fast'] = array( 'price' => (float) $v->get_regular_price(), 'time' => v4b_meta( $id, 'v4b_fast_time' ), 'vid' => $vid );
			}
		}
		/* Older products (VOA ext 342, C1 ext 346, D1 ext 1572, D12 ext 1575) are variable with ONE public variation
		   (their "Fast" variations are private). WooCommerce only adds a variable product with its variation, so the
		   button carries variation_id + its attributes: ?add-to-cart=342&variation_id=343&attribute_type=Regular. */
		if ( ! $item['fast'] && 1 === count( $public ) ) {
			$item['price'] = (float) $public[0]->get_regular_price();
			$item['buy']   = add_query_arg( rawurlencode_deep( array_merge(
				array( 'add-to-cart' => $id, 'variation_id' => $public[0]->get_id(), 'quantity' => 1 ),
				$public[0]->get_variation_attributes()
			) ), get_permalink( $id ) );
		}
	}
	return $item;
}

/** Products of one design-B category, in menu order. Editors also see drafts, so the new design can be built before go-live. */
function v4b_items( $group, $exclude = 0 ) {
	$status = current_user_can( 'edit_products' ) ? array( 'publish', 'draft', 'private' ) : array( 'publish' );
	$q      = new WP_Query( array(
		'post_type'      => 'product',
		'post_status'    => $status,
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
		'post__not_in'   => $exclude ? array( $exclude ) : array(),
		'tax_query'      => array( array( 'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $group ) ),
		'no_found_rows'  => true,
	) );
	return array_values( array_filter( array_map( 'v4b_item', $q->posts ) ) );
}

function v4b_group( $slug ) {
	$t = get_term_by( 'slug', $slug, 'product_cat' );
	return array( 'id' => $slug, 'label' => $t ? $t->name : $slug, 'blurb' => $t ? $t->description : '' );
}

function v4b_featured( $items ) {
	$f = array_values( array_filter( $items, function ( $v ) { return $v['p']->is_featured(); } ) );
	return $f ?: array_slice( $items, 0, 3 );
}

function v4b_price_html( $v ) {
	return ( $v['from'] ? '<small>From</small>' : '' ) . esc_html( v4b_rp( $v['price'] ) )
		. ( $v['extra'] ? '<small>' . esc_html( $v['extra'] ) . '</small>' : '' )
		. ( $v['fast'] ? '<small>Faster ' . esc_html( v4b_rp( $v['fast']['price'] ) ) . '</small>' : '' );
}

function v4b_time_html( $v ) {
	return esc_html( $v['time'] ) . ( $v['fast'] ? '<small>Faster: ' . esc_html( $v['fast']['time'] ) . '</small>' : '' );
}

/** Row button: Ask us (external → WhatsApp), Apply online (variable → product page to pick Regular/Faster, simple → add to basket). */
function v4b_act( $v, $cls ) {
	if ( $v['chat'] ) {
		return '<a class="' . $cls . '-act ' . $cls . '-chat" href="' . esc_url( $v['p']->get_product_url() ) . '">Ask us</a>';
	}
	if ( $v['buy'] ) {
		return '<a class="' . $cls . '-act ' . $cls . '-buy" href="' . esc_url( $v['buy'] ) . '" rel="nofollow" aria-label="' . esc_attr( 'Add ' . $v['label'] . ' to your basket' ) . '">Apply online</a>';
	}
	if ( $v['p']->is_type( 'variable' ) ) {
		return '<a class="' . $cls . '-act ' . $cls . '-buy" href="' . esc_url( $v['url'] ) . '">Apply online</a>';
	}
	return sprintf(
		'<a class="%1$s-act %1$s-buy add_to_cart_button ajax_add_to_cart" href="%2$s" data-quantity="1" data-product_id="%3$d" rel="nofollow" aria-label="%4$s">Apply online</a>',
		$cls, esc_url( $v['p']->add_to_cart_url() ), $v['id'], esc_attr( 'Add ' . $v['label'] . ' to your basket' )
	);
}

// Shortcodes sit inside a .v4b container (page section or template root); a second .v4b would repaint the background.
function v4b_wrap( $html ) { return '<div class="v4b-sc">' . $html . '</div>'; }

/* ---------- [v4b_visa_table] ---------- */
function v4b_row( $v ) {
	return '<div class="pt-row"><span class="pt-code' . ( strlen( $v['code'] ) > 5 ? ' long' : '' ) . '">' . esc_html( $v['code'] ) . '</span>'
		. '<span class="pt-name"><a href="' . esc_url( $v['url'] ) . '">' . esc_html( $v['name'] ) . '</a></span>'
		. '<span class="pt-stay"><i>Stay</i>' . esc_html( $v['stay'] ) . '</span>'
		. '<span class="pt-time"><i>Processing</i>' . v4b_time_html( $v ) . '</span>'
		. '<span class="pt-price num">' . v4b_price_html( $v ) . '</span>' . v4b_act( $v, 'pt' ) . '</div>';
}

add_shortcode( 'v4b_visa_table', function ( $a ) {
	$a      = shortcode_atts( array( 'group' => '' ), $a );
	$groups = $a['group'] ? array( $a['group'] ) : V4B_GROUPS;
	$html   = '';
	foreach ( $groups as $slug ) {
		$g     = v4b_group( $slug );
		$html .= '<section class="pt-group" id="' . esc_attr( $slug ) . '"><header class="pt-head"><h2 class="pt-title">' . esc_html( $g['label'] )
			. '</h2><p class="pt-blurb">' . esc_html( $g['blurb'] ) . '</p></header><div class="pt-rows">'
			. implode( '', array_map( 'v4b_row', v4b_items( $slug ) ) ) . '</div></section>';
	}
	return v4b_wrap( '<div class="ptable">' . $html . '</div>' );
} );

add_shortcode( 'v4b_related', function () {
	$id    = get_the_ID();
	$group = v4b_meta( $id, 'v4b_group' );
	if ( ! $group ) { return ''; }
	$rows = array_slice( v4b_items( $group, $id ), 0, 3 );
	return v4b_wrap( '<div class="pt-rows">' . implode( '', array_map( 'v4b_row', $rows ) ) . '</div>' );
} );

/* ---------- [v4b_finder]: radio tabs switch lists with :has(), no JS ---------- */
add_shortcode( 'v4b_finder', function ( $a ) {
	$a     = shortcode_atts( array( 'legend' => 'Where are you now?' ), $a );
	$asks  = array( 'arriving-soon' => "I haven't flown in yet", 'already-in-bali' => "I'm here and need more time", 'staying-longer' => 'I want to live or work here' );
	$tabs  = '';
	$lists = '';
	foreach ( V4B_GROUPS as $i => $slug ) {
		$g     = v4b_group( $slug );
		$tabs .= '<label class="pk-opt"><input type="radio" name="v4b-pick" value="' . $i . '"' . ( 0 === $i ? ' checked' : '' ) . '><span class="pk-opt-label">'
			. esc_html( $g['label'] ) . '</span><span class="pk-opt-ask">' . esc_html( $asks[ $slug ] ) . '</span></label>';
		$rows = '';
		foreach ( v4b_featured( v4b_items( $slug ) ) as $v ) {
			$rows .= '<li class="pk-row"><span class="pk-code">' . esc_html( $v['code'] ) . '</span><span class="pk-main"><b class="pk-name"><a href="' . esc_url( $v['url'] ) . '">'
				. esc_html( $v['name'] ) . '</a></b><span class="pk-meta">' . esc_html( $v['stay'] . ' · ' . $v['time'] ) . '</span></span><span class="pk-price num">'
				. v4b_price_html( $v ) . '</span>' . v4b_act( $v, 'pk' ) . '</li>';
		}
		$lists .= '<ul class="pk-list" data-g="' . $i . '">' . $rows . '</ul>';
	}
	return v4b_wrap( '<div class="bar v4b-finder"><div class="pk-tabs"><p class="pk-legend" id="v4b-pick-l">' . esc_html( $a['legend'] ) . '</p><div class="pk-opts" role="radiogroup" aria-labelledby="v4b-pick-l">'
		. $tabs . '</div></div>' . $lists . '<p class="pk-foot">Not sure which one? <a href="' . esc_url( v4b_wa( 'a visa' ) ) . '">Ask us</a> or <a href="/our-services/">see all visas</a>.</p></div>' );
} );

/* ---------- [v4b_stays] ---------- */
add_shortcode( 'v4b_stays', function ( $a ) {
	$a    = shortcode_atts( array( 'link' => '' ), $a );
	$html = '';
	foreach ( V4B_GROUPS as $slug ) {
		$g     = v4b_group( $slug );
		$items = v4b_items( $slug );
		if ( ! $items ) { continue; }
		$from = min( array_map( function ( $v ) { return $v['price']; }, $items ) );
		$rows = '';
		foreach ( v4b_featured( $items ) as $v ) {
			$n     = preg_replace( '/, .*$/', '', $v['name'] );
			$rows .= '<li>' . esc_html( ( false === strpos( $n, $v['code'] ) ? $v['code'] . ' ' : '' ) . $n ) . '<span>' . esc_html( $v['stay'] ) . '</span></li>';
		}
		$list  = 'list' === $a['link'];
		$html .= '<div class="stay"><h3>' . esc_html( $g['label'] ) . '</h3><p class="from num">From ' . esc_html( v4b_rp( $from ) ) . '</p><p>' . esc_html( $g['blurb'] ) . '</p>'
			. ( $list ? '' : '<ul>' . $rows . '</ul>' ) . '<a href="' . esc_url( ( $list ? '' : '/our-services/' ) . '#' . $slug ) . '">' . ( $list ? 'See the list' : 'See prices' ) . ' →</a></div>';
	}
	return v4b_wrap( '<div class="stays">' . $html . '</div>' );
} );

/* ---------- [v4b_crumbs] ---------- */
add_shortcode( 'v4b_crumbs', function () {
	$v = v4b_item( get_the_ID() );
	if ( ! $v ) { return ''; }
	$g = v4b_group( v4b_meta( $v['id'], 'v4b_group' ) );
	$label = false !== strpos( $v['name'], $v['code'] ) ? $v['name'] : $v['code'] . ' ' . $v['name'];
	return v4b_wrap( '<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol><li><a href="/">Home</a></li><li><a href="/our-services/">Visas &amp; prices</a></li>'
		. '<li class="crumb-mid"><a href="/our-services/#' . esc_attr( $g['id'] ) . '">' . esc_html( $g['label'] ) . '</a></li><li aria-current="page">' . esc_html( $label ) . '</li></ol></div></nav>' );
} );

/* ---------- [v4b_product part="head|buy"] ---------- */
function v4b_icon( $name ) {
	$paths = array(
		'shield' => '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
		'pin'    => '<path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
		'tick'   => '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
		'chat'   => '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
	);
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $paths[ $name ] . '</svg>';
}

/** Price + buttons. Variable products post the checked variation_id straight to WooCommerce, no JS needed.
    WooCommerce 9 refuses a variable product without variation_id ("Please choose product options"), so the radio
    carries the variation id itself; WooCommerce fills the Processing attribute from the variation. */
function v4b_buy_core( $v, $inline ) {
	$visa = $v['code'] . ', ' . $v['name'];
	if ( $v['chat'] ) {
		return '<p class="buy-label">' . ( $v['from'] ? 'Price from' : 'Price' ) . '</p><p class="buy-price num">' . esc_html( v4b_rp( $v['price'] ) ) . '</p>'
			. ( $v['extra'] ? '<p class="buy-incl">' . esc_html( $v['extra'] ) . '</p>' : '' )
			. ( $v['incl'] ? '<p class="buy-incl">' . esc_html( $v['incl'] ) . '</p>' : '' )
			. '<a class="btn btn-k" href="' . esc_url( $v['p']->get_product_url() ) . '">' . v4b_icon( 'chat' ) . 'Ask us</a>'
			. '<p class="buy-why">We check your documents with you on WhatsApp before you pay.</p>';
	}
	$ask = '<a class="btn btn-o" href="' . esc_url( v4b_wa( $visa ) ) . '">Ask us first</a>';
	if ( $v['fast'] ) {
		$opts = array( array( 'Regular', $v['time'], $v['price'], $v['vid'] ), array( 'Faster', $v['fast']['time'], $v['fast']['price'], $v['fast']['vid'] ) );
		$html = '<form class="v4b-buy-form" method="post" action="' . esc_url( $v['url'] ) . '" enctype="multipart/form-data"><fieldset class="speed"><legend>Processing</legend>';
		foreach ( $opts as $i => $o ) {
			$html .= '<label><input type="radio" name="variation_id" value="' . (int) $o[3] . '" data-speed="' . esc_attr( $o[0] ) . '"' . ( $i ? '' : ' checked' ) . ' required><span><b>' . esc_html( $o[0] ) . '</b>'
				. esc_html( $o[1] ) . '</span><span class="num">' . esc_html( v4b_rp( $o[2] ) ) . '</span></label>';
		}
		$html .= '</fieldset><p class="buy-label">Price</p><p class="buy-price num"><span class="v4b-p-regular">' . esc_html( v4b_rp( $v['price'] ) )
			. '</span><span class="v4b-p-faster">' . esc_html( v4b_rp( $v['fast']['price'] ) ) . '</span></p>'
			. ( $v['incl'] ? '<p class="buy-incl">' . esc_html( $v['incl'] ) . '</p>' : '' )
			. '<input type="hidden" name="add-to-cart" value="' . $v['id'] . '"><input type="hidden" name="product_id" value="' . $v['id'] . '"><input type="hidden" name="quantity" value="1">'
			. '<button type="submit" class="btn btn-k">Apply online</button>' . $ask . '</form>';
		return $html;
	}
	$btn = $v['buy']
		? '<a class="btn btn-k" href="' . esc_url( $v['buy'] ) . '" rel="nofollow">Apply online</a>'
		: sprintf( '<a class="btn btn-k add_to_cart_button ajax_add_to_cart" href="%1$s" data-quantity="1" data-product_id="%2$d" rel="nofollow">Apply online</a>', esc_url( $v['p']->add_to_cart_url() ), $v['id'] );
	return '<p class="buy-label">' . ( $v['from'] ? 'Price from' : 'Price' ) . '</p><p class="buy-price num">' . esc_html( v4b_rp( $v['price'] ) ) . '</p>'
		. ( $v['incl'] ? '<p class="buy-incl">' . esc_html( $v['incl'] ) . '</p>' : '' )
		. $btn . $ask;
}

add_shortcode( 'v4b_product', function ( $a ) {
	$a = shortcode_atts( array( 'part' => 'head', 'id' => 0 ), $a );
	$v = v4b_item( $a['id'] ? (int) $a['id'] : get_the_ID() );
	if ( ! $v ) { return ''; }
	if ( 'buy' === $a['part'] ) {
		$html = '<aside class="buy" aria-label="Price and apply">' . v4b_buy_core( $v, false )
			. '<ul><li>' . v4b_icon( 'shield' ) . 'Payments go to VISA4BALI only, never to a personal account.</li>'
			. '<li>' . v4b_icon( 'pin' ) . 'A real office in Balangan, open Monday to Friday, 08:00–17:00.</li>'
			. '<li>' . v4b_icon( 'tick' ) . ( $v['chat'] ? 'One person handles your case from start to finish.' : 'Updates on WhatsApp from the person handling your case.' ) . '</li></ul>'
			. '<p class="buy-help' . ( $v['chat'] ? '' : ' num' ) . '">' . ( $v['chat'] ? 'We reply on WhatsApp, Monday to Friday' : 'Questions? +62 878 6227 3133' ) . '</p></aside>';
		return v4b_wrap( $html );
	}
	$facts = '';
	for ( $n = 1; $n <= 3; $n++ ) {
		$l = v4b_meta( $v['id'], "v4b_fact{$n}_label" );
		if ( ! $l ) { continue; }
		$note   = v4b_meta( $v['id'], "v4b_fact{$n}_note" );
		$facts .= '<div><dt>' . esc_html( $l ) . '</dt><dd>' . esc_html( v4b_meta( $v['id'], "v4b_fact{$n}_value" ) ) . ( $note ? '<small>' . esc_html( $note ) . '</small>' : '' ) . '</dd></div>';
	}
	$short = $v['p']->get_short_description();
	return v4b_wrap( '<div class="pd-head"><span class="pd-code">' . esc_html( $v['code'] ) . '</span><h1>' . esc_html( $v['title'] ) . '</h1>'
		. ( $short ? '<div class="pd-short">' . wp_kses_post( $short ) . '</div>' : '' )
		. '<dl class="facts">' . $facts . '</dl><div class="buy buy-inline">' . v4b_buy_core( $v, true ) . '</div></div>' );
} );

function v4b_css() {
	return <<<'CSS'
/*V4B-CSS-START*/
/*V4B-CSS-END*/
CSS;
}

} // end function_exists guard
