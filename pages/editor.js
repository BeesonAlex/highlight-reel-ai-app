/* eslint-disable func-names */
import {useState, useEffect} from 'react'
import {FileDrop} from 'react-file-drop' // https://github.com/sarink/react-file-drop
import VideoEditor from '@/components/ui/VideoEditor'

function Editor() {

	//Boolean state handling whether upload has occured or not
	const [isUpload, setIsUpload] = useState(true)

	//State handling storing of the video
	const [videoUrl, setVideoUrl] = useState('')
	const [videoBlob, setVideoBlob] = useState('')

	//Stateful array handling storage of the start and end times of videos
	const [timings, setTimings] = useState([])

	//Function handling file input as well as file drop library and rendering of those elements
	const renderUploader = () => {
		return (
			<div className={'wrapper'}>
				<input
					onChange={(e) => uploadFile(e.target.files)}
					type='file'
					className='hidden'
					id='up_file'
				/>
				<FileDrop
					onDrop={(e) => uploadFile(e)}
					onTargetClick={() => document.getElementById('up_file').click()}
				>
                    Click or drop your video here to edit!
				</FileDrop>
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