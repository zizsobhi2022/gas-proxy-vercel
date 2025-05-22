export default async function handler(req, res) {
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxnY3Oige4MBJffJeJQ2LPBbK_raIFXJw8E-C9-YipEVanEohXFSkQEEq79ZInMoPtzMQ/exec'; // <-- غيّر هذا
  let targetUrl = GAS_URL;
  let fetchOptions = { method: req.method, headers: { ...req.headers } };

  if (req.method === 'GET') {
    const params = new URLSearchParams(req.query).toString();
    targetUrl += '?' + params;
  } else if (req.method === 'POST') {
    fetchOptions.body = JSON.stringify(req.body);
    fetchOptions.headers['content-type'] = 'application/json';
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Proxy error', error: err.message });
  }
}
