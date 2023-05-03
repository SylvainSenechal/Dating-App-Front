import { useState, useEffect } from 'react';
import { envData } from './App';
import { get, getQuery, post, put, deleteReq } from "./utils/Requests";


const ImageUploader = ({ token, userInfos, setNeedReloadUser }) => {
	const [showCanvas, setShowCanvas] = useState(false)
	const [drawnImage, setDrawnImage] = useState()
	const [mouse, setMouse] = useState({x: 0, y: 0})
	const [pose, setPose] = useState({x: 0, y: 0})
	const [userImages, setUserImages] = useState([]);

	const handleChangeFile = event => {
		const imageFile = event.target.files[0]
    const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target.result;
			img.onload = () => {
				const canvas = document.getElementById('canvasImage')
				canvas.width = 400
				canvas.height = 600
				setDrawnImage(img)
				setShowCanvas(true)
				setPose({x: 0, y: 0})
				const canvasBackground = document.getElementById('containerImage')
				canvasBackground.style.display = "flex"
			};
		};
		reader.readAsDataURL(imageFile);
	}

	const handleSubmitFile = async event => {
		const canvas = document.getElementById('canvasImage')
		canvas.toBlob(async blob => {
			const formData = new FormData()
			formData.append('file', blob)
			const result = await fetch(`${envData.apiURL}/photos`, {
				method: 'POST',
				headers: { 
					'Authorization': `Bearer ${token}` 
				},
				body: formData
			})
			const readableResult = await result.json()
			console.log(readableResult)
			setNeedReloadUser(true)
		})
	}

	const handleDeletePhoto = async photo_url => {
		const photo_uuid = photo_url.split('/')[3]
		console.log(photo_uuid)
		try {
      const result = await deleteReq(`/photos/${photo_uuid}`, token)
			setNeedReloadUser(true)
    } catch (error) {
      console.log("delete user infos error : " + error);
    }
	}

	const fixCanvasImage = e => {
		setShowCanvas(false)
		const canvas = document.getElementById('canvasImage')
		const canvasBeforeSubmit = document.getElementById('canvasBeforeSubmit')
		canvasBeforeSubmit.width = 120
		canvasBeforeSubmit.height = 180
		canvasBeforeSubmit.getContext('2d').drawImage(canvas, 0, 0, 120, 180)
		const canvasBackground = document.getElementById('containerImage')
		canvasBackground.style.display = "none"
	}

	document.onmousemove = e => {
		if (showCanvas) {
			const targetButtonAdjust = document.getElementById('buttonImage')
			const rect = targetButtonAdjust.getBoundingClientRect();
			const x = rect.left + 10 - e.clientX;
			const y = rect.top + 10 - e.clientY;
			let dx = 0
			let dy = 0
			if (Math.abs(x) > 20) {
				dx = x > 0 ? 1 : - 1
			}
			if (Math.abs(y) > 20) {
				dy = y > 0 ? 1 : - 1
			} 
			setMouse({x: dx, y: dy})
		}
	}

	useEffect(() => {
    const interval = setInterval(() => {
			let newX = Math.min(Math.max(-100, pose.x + mouse.x), 1500)
			let newY = Math.min(Math.max(-100, pose.y + mouse.y), 700)
			if (showCanvas) {
				setPose({x: newX, y: newY})
			}
    }, 16);
    return () => clearInterval(interval)
  }, [pose, showCanvas]);

	useEffect(() => {
		if (showCanvas) {
			const canvas = document.getElementById('canvasImage')
			let ctx = canvas.getContext('2d')
			ctx.canvas.width = 400
			ctx.canvas.height = 600
			ctx.drawImage(
				drawnImage,
				pose.x,
				pose.y,
				400,
				600,
				0,
				0,
				400,
				600
			);
		}
	}, [showCanvas, pose])

	useEffect(() => {
		console.log(userInfos)
		if (userInfos.photo_display_orders !== null && userInfos.photo_urls !== null) {
			const orders = userInfos.photo_display_orders.split(',')
			const urls = userInfos.photo_urls.split(',')
			let sorted_urls = []
			for (let i = 0; i < urls.length; i++) {
				sorted_urls.push(urls[orders[i] - 1])
			}
			setUserImages(sorted_urls)
		}
	}, [userInfos])

	const [draggedImage, setDraggedImage] = useState()

	const drag = event => {
		setDraggedImage(event.target)
	}

	const onDragOver = event => {
		// event.target.className = 'aah'
		event.preventDefault()
	}

	const onDrop = async event => {
		try {
			let img1 = draggedImage.src
			let img2 = event.target.src
			const photo_uuid1 = img1.split('/')[3]
			const photo_uuid2 = img2.split('/')[3]
			if (photo_uuid1 !== photo_uuid2) {
				const result = await post(`/photos/switch_photos`, token, {
					photo_uuid1: photo_uuid1,
					photo_uuid2: photo_uuid2,
				});
				event.target.src = img1
				draggedImage.src = img2
				setNeedReloadUser(true)
			}
			setDraggedImage()
    } catch (error) {
      console.log("update user infos error : " + error);
    }


	}

	const renderProfileImage = () => {
		let images = []
		for (let i = 0; i < 6; i++) {
			if (i < userImages.length) {
				images.push(
					<div className='profileImageHolder'>
					<img
							draggable="true"
							onDragStart={drag}
							onDragOver={onDragOver}
							onDrop={onDrop}
							className='profileImage'
							src={userImages[i]}
					/>
					<button id='deletePhotoButton' onClick={() => handleDeletePhoto(userImages[i])}> Delete </button>
					</div>
				)
			} else if (i === userImages.length) {
				images.push(
					<div id='canvasPickBackground' className='profileImageHolder'>
						<canvas id='canvasBeforeSubmit'> </canvas>
						<input id='pickImage' type="file" name="file" accept="image/jpeg, image/png, image/jpg" onChange={handleChangeFile} />
						<div className='photoNumber'> + </div>
						<button id='saveImage' onClick={handleSubmitFile}> Save </button>
					</div>
				)
			} else {
				images.push(
					<div className='profileImageHolder'>
						<div className='photoNumber'> {i + 1} </div>
					</div>
				)
			}

		}
		return images
	}

	return (
		<div>
			<div id='containerImage'>
				<div> Move your mouse around the button to center your image </div>
				<div> When you like the image, click the green button to select it </div>
				<button id='buttonImage' onClick={fixCanvasImage}> </button>
				<canvas id="canvasImage"></canvas>
			</div>
			<div id='listImageProfile'>
				{renderProfileImage()}
			</div>
		</div>
	)
}

export default ImageUploader;