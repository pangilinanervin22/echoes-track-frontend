import React, { ChangeEvent, useState } from "react";
import { User } from "../../Users/useUsers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import style from "./Style.module.scss";
import { useAddAccount } from "../useAccount";

export default function AddUser() {
    const navigate = useNavigate();
    const { addAccount } = useAddAccount();
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(import.meta.env.VITE_PROFILE_IMAGE);
    const [role, setRole] = useState<string>("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files?.[0];
            const fileType = file.type;

            const validImageTypes = ['image/jpeg', 'image/png'];
            if (!validImageTypes.includes(fileType)) {
                toast.error("Invalid file type. Please select a PNG or JPG image.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target as HTMLFormElement);
        // Create a new user object

        if (image) {
            const uploadImage = toast.loading("Image uploading ...", { progress: 0, autoClose: false });
            const storage = getStorage();
            const storageRef = ref(storage, `profile/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Handle the upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    toast.update(uploadImage, {
                        render: `Uploading... ${progress.toFixed(2)}%`,
                        progress: progress,
                        isLoading: true,
                    });
                },
                (error) => {
                    // Handle unsuccessful uploads
                    alert(error);
                    toast.update(uploadImage, {
                        render: "Failed to upload image",
                        type: "error",
                        isLoading: false,
                        autoClose: 2000,
                    });
                },
                () => {
                    // Handle successful uploads on complete
                    toast.update(uploadImage, {
                        render: "Image uploaded successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000,
                    });
                }
            );

            await uploadTask;
            const url = await getDownloadURL(storageRef);
            const newUser: User = {
                name: formData.get("name") as string,
                rfid: formData.get("rfid") as string,
                role: formData.get("role") as string,
                image: url,
                section: formData.get("section") as string,
                room: "",
            };

            const res = await addAccount(newUser, email, password);
            toast.success(res.message, {
                type: res.ok ? "success" : "error",
                isLoading: false,
                autoClose: 2000,
            });

            if (res.ok)
                navigate("/admin/account");
        } else {
            // Call the addUser function to add the user
            const newUser: User = {
                name: formData.get("name") as string,
                rfid: formData.get("rfid") as string,
                role: formData.get("role") as string,
                image: imageUrl,
                room: "",
                section: formData.get("section") as string,
            };

            const res = await addAccount(newUser, email, password);
            toast.success(res.message, {
                type: res.ok ? "success" : "error",
                isLoading: false,
                autoClose: 2000,
            });

            if (res.ok)
                navigate("/admin/account");
        }
    };

    return (
        <div className={style.container}>
            <h1>Add User</h1>
            <form
                className={style.form_add_user}
                onSubmit={handleSubmit}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                }}
            >                <div className={style.input_image}>
                    <img
                        alt="Preview"
                        src={imageUrl}
                    />
                    <input id="img" name="img" type="file" onChange={handleImageChange} />
                    <label htmlFor="img" className={style.file_upload_button}>Upload Image</label>
                </div>
                <div className={style.input_information}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input id="email" name="email" type="email" required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input id="password" name="password" type="password" required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input id="name" name="name" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="rfid"> RFID:</label>
                        <input id="rfid" name="rfid" type="number" required />
                    </div>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role" name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required >
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className={style.submit}>
                        <button onClick={() => navigate("/admin/account")}>Cancel</button>
                        <button type="submit" >Add User</button>
                    </div>
                </div>
            </form>
        </div>
    );
}