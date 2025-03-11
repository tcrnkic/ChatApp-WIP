import { useState } from "react";
import { auth, db, storage } from "../firebase-config";
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const PostUpload = () => {
    const [postText, setPostText] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadTask, setUploadTask] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            console.error("No image selected");
            return;
        }

        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        setUploadTask(uploadTask);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error during post submission:", error);
                setProgress(0);
            },
            () => {
                // Upload complete
                getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                    const postsRef = collection(db, 'posts');
                    addDoc(postsRef, {
                        text: postText,
                        imageUrl,
                        createdAt: serverTimestamp(),
                        user: auth.currentUser.displayName,
                        pfp: auth.currentUser.photoURL,
                        uid: auth.currentUser.uid
                    });

                    setPostText('');
                    setImage(null);
                    setImagePreview(null);
                    setProgress(0);
                    setUploadTask(null);
                });
            }
        );
    }

    return (
        <div className="my-8 px-4">
            <form onSubmit={handlePostSubmit} className="flex flex-col bg-white p-4 rounded-lg shadow-md">
                {imagePreview && (
                    <img src={imagePreview} alt="Image Preview" className="w-96 h-72 object-cover rounded-sm mb-4" />
                )}

                <textarea
                    placeholder="Write your description..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md mb-4"
                />

                <input
                    required
                    accept="image/jpeg, image/png"
                    type="file"
                    onChange={handleImageChange}
                    className="mb-4"
                />

                {uploadTask && (
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                    Upload Progress
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-teal-600">
                                    {`${Math.round(progress)}%`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex relative pt-1">
                                <div className="flex flex-col space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full">
                                        <div
                                            className="w-full h-2 bg-teal-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition duration-300"
                >
                    Post
                </button>
            </form>
        </div>
    );
}

export default PostUpload;
