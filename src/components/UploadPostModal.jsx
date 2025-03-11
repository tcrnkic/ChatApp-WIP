import PostUpload from "./PostUpload";

const UploadPostModal = ({isOpen, requestClose}) => {
    return ( 
        <div className="fixed flex items-center justify-center  w-full bg-opacity-60 bg-gray-400 left-0 h-full top-0">
        <div className="w-96 bg-white rounded-lg relative overflow-hidden">
        <p className="text-center font-bold text-2xl pt-6">Upload your post!</p>
          <button onClick={requestClose} className="bg-red-400 px-2 py-1 absolute right-0 top-0 text-white" >X</button>
          <PostUpload/>
        </div>
      </div>
      
     );
}
 
export default UploadPostModal;