import { NextApiHandler } from 'next';
import axios, { AxiosRequestConfig, AxiosResponse}  from 'axios';

const GetVideoHotspots: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
      const { video } = req.body;
  
      try {
        const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4NmVlOWEzYjc1MjBiNDk0ZGY1NGZlMzJlM2U1YzRjYTY4NWM4OWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTU1OTQwNTU5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAzNDgwNzMyOTY2MzAwNDA0OTc0IiwiZW1haWwiOiJiZWVzb24uYWxleGFuZGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiaGsxa0hFdDZNTHdpN0lSakJxVjJQdyIsImlhdCI6MTY3OTE3NDU5OCwiZXhwIjoxNjc5MTc4MTk4fQ.RdZIxrlbM95JsYGdtxpnheu-DdfoACcNFJ75mfoVnRozxpYoDyiIJN92oLcM2Jqgs9uxXCx0FF0MpDBA_YcvRzPZDPBm2LKl4K2jqO7cG7en_qZJ_VelWIP73HWRfGPD8dHK-G_d2O4HHg4a7XZ4AgsXjhf888zATfyXeHMOineGWpNik-xzFwrqj5wznfjud37wvT9fiPlBXa7rxRXCdrDoW8ykzqRkkBVu4EWObYcBhpSL-y2rGEMIL-SoqEnWsPbb9xeKUayO0JS0R_LbdeoA2uxpX5b1sKKxKqP8VngDhQUDhT5wbFW0AzFMPsvZxCBh1bMDh9IIO8IZGSGGXA'
        const body = {
            'url': `${video}`,
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const config: AxiosRequestConfig = {
            method: 'post',
            url: 'https://video-interest-scoring-7dmujmyobq-uc.a.run.app',
            headers: headers,
            data: body
        }

        const response: AxiosResponse = await axios(config)
        const data = await response
  
        return res.status(200).json(data);
      } catch (err: any) {
        console.log(err);
        res
          .status(500)
          .json({ error: { statusCode: 500, message: err.message } });
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  };
  
  export default GetVideoHotspots;