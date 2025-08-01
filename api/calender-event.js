// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const response = await axios.post("https://n8n-zgar.onrender.com/webhook/calender-event",{
//       data:'dinner 2025-08-01 10:30 1 hour'
//     });

//     return res.status(200).json({ message: 'Success', n8nResponse: response.data });
//   } catch (err) {
//     return res.status(500).json({ error: 'Failed to send to n8n', details: err.message });
//   }
// }





import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    const response = await axios.post("https://n8n-zgar.onrender.com/webhook/calender-event", {
      data,  // forward as { data: '...' }
    });

    return res.status(200).json({ message: 'Success', n8nResponse: response.data });
  } catch (err) {
    console.error("N8N error:", err.message);
    return res.status(500).json({ error: 'Failed to send to n8n', details: err.message });
  }
}






