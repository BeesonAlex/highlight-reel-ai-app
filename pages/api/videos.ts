import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import busboy from 'busboy';
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  }
}

const uploadVideoStream = async (req: NextApiRequest, res: NextApiResponse) => {
  const bb = busboy({headers: req.headers});

  bb.on('file', (_, file, info) => {
    const fileName = info.filename;
    const filePath = `./videos/${fileName}.mp4`

    const stream = fs.createWriteStream(filePath)

    file.pipe(stream)
  });

  bb.on('close', () => {
    res.writeHead(200, { Connection: "close"});
    res.end("Finished");
  })

  req.pipe(bb);
}

const getVideoStream = async (req: NextApiRequest, res: NextApiResponse) => {
  const range = req.headers.range;
  const CHUNK_SIZE_IN_BYTES = 10 ** 6;

  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoId = req.query.videoId;
  const videoPath = `./videos/${videoId}.mp4`;

  if (!videoPath) {
    res.status(404).send("Video not found");
  }

  const videoSizeInBytes = fs.statSync(videoPath).size;
  const chunkStart = Number(range?.replace(/\D/g, ""));
  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, videoSizeInBytes - 1);

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start: chunkStart, end: chunkEnd });

  videoStream.pipe(res);
}

export default function videosHandler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
  
      if (method === 'GET') {
        getVideoStream(req, res)
      }
  
      if (method === 'POST') {
        return uploadVideoStream(req, res)
      }

      return res.status(405).json({ message: `Method ${method} not allowed` });
    };