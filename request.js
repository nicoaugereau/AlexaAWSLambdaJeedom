import { stringify } from 'querystring'; 
import { Agent, request as _request } from 'https';

/**
 * Send an HTTPS request and receive a response
 */
export default function request(opts, queryParams) {
	return new Promise((resolve, reject) => {

		var postData = stringify(queryParams);

		opts.method = 'POST';
		opts.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		};
		opts.agent = new Agent({keepAlive: true});

		const req = _request(opts, (res) => {
			let body = '';
			res.on('data', (d) => {
				body += d;
			});
			res.on('end', () => {
				if (res.statusCode !== 200) 
					return reject(new Error(`Unsuccessful request [${res.statusCode}]`));
				return (opts.json) ? resolve(JSON.parse(body)) : resolve(body);
			});
			res.on('error', (err) => {
				return reject(err);
			});
		});
		
		req.on('error', (err) => {
			return reject(err);
		});
		req.write(postData);
		req.end();

	});
};