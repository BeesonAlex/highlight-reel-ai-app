/* eslint-disable func-names */
import { useState, useEffect } from 'react'
import { FileDrop } from 'react-file-drop' // https://github.com/sarink/react-file-drop
import VideoEditor from '@/components/ui/VideoEditor'
import axios, { AxiosRequestConfig } from 'axios'
import { getURL } from '@/utils/helpers'

function Editor() {

    const [file, setFile] = useState<File | undefined>()
    const [fileUrl, setFileUrl] = useState<string | undefined>()
    // Legacy FileURL for VideoEditor Component
    const [videoUrl, setVideoUrl] = useState<string | undefined>()
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    //Boolean state handling whether upload has occured or not
    const [isUpload, setIsUpload] = useState(true)

    //Stateful array handling storage of the start and end times of videos
    const [timings, setTimings] = useState([])

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
            await axios.post('/api/videos', data, config).then((res) => {
                setIsUpload(false)
            })
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
            setFileUrl(getURL()+ 'videos/' + files[0].name)
            //Legacy State Updaters for VideoEditor component
            let fileUrl = URL.createObjectURL(files[0])
            setVideoUrl(fileUrl)
        }
    }


    //Function handling file input as well as file drop library and rendering of those elements
    const renderUploader = () => {
        return (
            <div>
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

    //Function handling rendering the VideoEditor component and passing props to that child component
    const renderEditor = () => {
        console.log(fileUrl)
        return (
            // videoUrl --> URL of uploaded video
            <VideoEditor
                videoUrl={videoUrl}
                fileUrl={fileUrl}
                timings={timings}
                setTimings={setTimings}
            />
        )
    }

    return (
        <div className='editor-wrapper'>
            {/* Boolean to handle whether to render the file uploader or the video editor */}
            {isUpload ? renderUploader() : renderEditor()}
        </div>
    )
}

export default Editor