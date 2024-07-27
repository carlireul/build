const FileUpload = ({onFileSelectSuccess, onFileSelectError}) => {

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file.size > 8500000)
			onFileSelectError({ error: `File size cannot exceed more than 5MB, ${file.size}` });
		// TODO: file type validation
		else onFileSelectSuccess(file);
	}

	return (
		<span className="file-uploader">
			<input type="file" id="audiofile" onChange={handleFileInput} />
		</span>
				)

}

export default FileUpload