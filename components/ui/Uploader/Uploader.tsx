import React, { useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

export default function Uploader() {
    const [file, setFile] = useState<File | undefined>()
    const [fileUrl, setFileUrl] = useState<string | undefined>()
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        const data = new FormData()

        if (!file) return

        setSubmitting(true)
        data.append('file', file)

        const config: AxiosRequestConfig = {
            onUploadProgress: function (progressEvent: any) {
                const percentComplete = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                    )
                setProgress(percentComplete)
            },
        };

        try {
            await axios.post('/api/videos', data, config)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false);
            setProgress(0)
        }

    }

    function handleSetFile(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event?.target.files
        if(files?.length) {
            setFile(files[0])
            console.log(files[0])
            setFileUrl('/videos/' + files[0].name)
        }
    }

  return (
    <div className="editor-wrapper">
        <div className="editor">
        {error && <p>{error}</p>}
        {submitting && <p>{progress}</p>}
        <form action="POST">
            <div>
                <label htmlFor="file">File</label>
                <input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
            </div>
        </form>
        <button onClick={handleSubmit}>Upload Video</button>
    </div>
    </div>
  )
}
