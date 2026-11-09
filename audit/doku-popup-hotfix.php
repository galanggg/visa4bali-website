<?php
/**
 * DOKU popup hotfix (2026-11-09). WPCode PHP snippet "DOKU popup JS hotfix (sandbox outage 2026-11)".
 *
 * Plugin woo-doku-jokul 1.3.12 prints its popup script from sandbox.doku.com on the payment page
 * (order-received?…&jokul=show). Since 2 Nov 2026 that URL serves an HTML "Service Maintenance" page,
 * so loadJokulCheckout() never exists and "Proceed to Payment" does nothing: no DOKU order was paid
 * from 2 to 8 Nov. The production copy on jokul.doku.com defines the same function. Loading it in
 * <head> lets the plugin's own inline openPopup() run unchanged.
 *
 * Remove this snippet when the plugin is updated: upstream dropped the sandbox script in 1.3.14.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// WPCode may evaluate a snippet twice in one request; a named callback is declared and hooked once.
if ( ! function_exists( 'v4b_doku_popup_js' ) ) {
	function v4b_doku_popup_js() {
		if ( ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'order-received' ) ) { return; }
		if ( ! isset( $_GET['jokul'] ) || 'show' !== $_GET['jokul'] ) { return; }
		echo '<script src="https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"></script>' . "\n";
	}
	add_action( 'wp_head', 'v4b_doku_popup_js', 1 );
}
