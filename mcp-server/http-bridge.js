#!/usr/bin/env node

import 'dotenv/config';
import http from 'http';
import { URL } from 'url';
import fetch from 'node-fetch';

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const PORT = process.env.PORT || 3001;

if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_DOMAIN) {
	console.error('Error: SHOPIFY_ACCESS_TOKEN and SHOPIFY_DOMAIN are required');
	process.exit(1);
}

const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/admin/api/2023-10/orders.json`;

const sendJson = (res, status, payload) => {
	res.writeHead(status, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	});
	res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		return res.end();
	}

	const url = new URL(req.url, `http://${req.headers.host}`);

	if (req.method === 'GET' && url.pathname === '/orders') {
		const limit = url.searchParams.get('limit') || '10';
		const status = url.searchParams.get('status');
		const email = url.searchParams.get('email');
		const processedAtMin = url.searchParams.get('processed_at_min');
		const processedAtMax = url.searchParams.get('processed_at_max');
		const fulfillmentStatus = url.searchParams.get('fulfillment_status');

		const params = new URLSearchParams({ limit });
		if (status) {
			params.set('status', status);
		}
		if (email) {
			params.set('email', email);
		}
		if (processedAtMin) {
			params.set('processed_at_min', processedAtMin);
		}
		if (processedAtMax) {
			params.set('processed_at_max', processedAtMax);
		}
		if (fulfillmentStatus) {
			params.set('fulfillment_status', fulfillmentStatus);
		}

		try {
			const shopifyRes = await fetch(`${SHOPIFY_API_URL}?${params.toString()}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
				},
			});

			if (!shopifyRes.ok) {
				const text = await shopifyRes.text();
				return sendJson(res, shopifyRes.status, {
					error: 'Shopify request failed',
					status: shopifyRes.status,
					body: text,
				});
			}

			const data = await shopifyRes.json();
			return sendJson(res, 200, { orders: data.orders || [] });
		} catch (error) {
			return sendJson(res, 500, { error: error.message || 'Unknown error' });
		}
	}

	sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
	console.log(`HTTP bridge listening on http://localhost:${PORT} (orders endpoint)`);
});
