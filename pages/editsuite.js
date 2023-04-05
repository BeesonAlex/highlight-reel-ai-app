/* eslint-disable func-names */
import { useState, useEffect } from 'react'
import { FileDrop } from 'react-file-drop' // https://github.com/sarink/react-file-drop
import VideoEditor from '@/components/ui/VideoEditor'

function Editor() {

    const [file, setFile] = useState()
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    //Boolean state handling whether upload has occured or not
    const [isUpload, setIsUpload] = useState(true)

    //State handling storing of the video
    const [videoUrl, setVideoUrl] = useState('')
    const [videoBlob, setVideoBlob] = useState('')

    //Stateful array handling storage of the start and end times of videos
    const [timings, setTimings] = useState([])

    async function handleSubmit() {
        console.log('submitting')
        const data = new FormData()

        if (!file) return

        setSubmitting(true)
        data.append('file', file)

        const config = {
            onUploadProgress: function (progressEvent) {
                const percentComplete = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                setProgress(percentComplete)
            },
        };

        try {
            await axios.post('/api/upload', data, config)
            console.log(progress)
        } catch (error) {
            setError(error.message)
        } finally {
            setSubmitting(false);
            setProgress(0)
        }

    }

    function handleSetFile(event) {
        const files = event.target.files
        if (files?.length) {
            setFile(files[0])
        }
        handleSubmit()
    }


    //Function handling file input as well as file drop library and rendering of those elements
    const renderUploader = () => {
        return (
            <div className={'wrapper'}>
                {error && <p>{error}</p>}
                {submitting && <p>{progress}</p>}
                <form action="POST">
                    <input
                        onChange={handleSetFile}
                        type='file'
                        className='hidden'
                        id='file'
                        accept=".mp4"
                    />
                    <FileDrop
                        onDrop={handleSetFile}
                        onTargetClick={() => document.getElementById('file').click()}
                    >
                        Click or drop your video here to edit!
                    </FileDrop>
                </form>
            </div>
        )
    }

    //Function handling rendering the VideoEditor component and passing props to that child component
    const renderEditor = () => {
        return (
            // videoUrl --> URL of uploaded video
            <VideoEditor
                videoUrl={videoUrl}
                videoBlob={videoBlob}
                setVideoUrl={setVideoUrl}
                timings={timings}
                setTimings={setTimings}
            />
        )
    }

    //Function handling the file upload file logic
    const uploadFile = async (fileInput) => {
        console.log(fileInput[0])
        let fileUrl = URL.createObjectURL(fileInput[0])
        setIsUpload(false)
        setVideoUrl(fileUrl)
        setVideoBlob(fileInput[0])
    }

    return (
        <div className='editor-wrapper'>
            {/* Boolean to handle whether to render the file uploader or the video editor */}
            {isUpload ? renderUploader() : renderEditor()}
        </div>
    )
}

export default Editor