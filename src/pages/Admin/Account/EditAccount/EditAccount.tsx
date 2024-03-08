import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../Users/useUsers";
import style from "./edituserStyle.module.scss"
import { toast } from "react-toastify";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useGetAccount, useUpdateAccount } from "../useAccount";

export default function EditAccount() {
    const params = useParams();
    const navigate = useNavigate();
    const { account, loading } = useGetAccount(params.id || "");
    const { updateUser } = useUpdateAccount();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [rfid, setRfid] = useState("");
    const [section, setSection] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(import.meta.env.VITE_PROFILE_IMAGE);
    const [deleteImageUrl, setDeleteImageUrl] = useState<string>("");
    const [oldRfid, setOldRfid] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (account) {
            setEmail(account.email);
            setName(account.name);
            setRole(account.role);
            setRfid(account.rfid);
            setOldRfid(account.rfid);
            setImageUrl(account.image || import.meta.env.VITE_PROFILE_IMAGE);
            setSection(account.section || "");
            setDeleteImageUrl(account.image || "");
        }
    }, [account, setName, setRole, setRfid]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (!account || ["student", "admin"].includes(account.role) === null) {
        return (
            <div>
                <h1>User not found</h1>
                <button onClick={() => { navigate("/admin/account"); }}>
                    Back to table
                </button>
            </div>
        );
    }

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

        const toastForm = toast.loading("Updating user ...");
        const newUser: User = {
            id: params.id,
            name,
            rfid,
            role,
            section,
            image: imageUrl,
            room: "",
        };

        if (image) {
            const uploadImage = toast.loading("Image uploading ...", { progress: 0, autoClose: false });
            const storage = getStorage();
            const storageRef = ref(storage, `profile/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Handle the upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                id: params.id,
                name,
                rfid,
                role,
                section,
                image: url,
                room: "",
            };

            const res = await updateUser({ ...newUser as User, ...newUser });
            if (res.error) {
                toast.update(toastForm, {
                    render: res.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });

                return;
            }

            if (deleteImageUrl !== import.meta.env.VITE_PROFILE_IMAGE) {
                const deleteImageRef = ref(storage, deleteImageUrl);
                // Check if the file exists
                const old = await getDownloadURL(deleteImageRef);
                console.log(old === imageUrl, "old", url);
                await deleteObject(deleteImageRef);
            }

            toast.update(toastForm, {
                render: res.message,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            navigate("/admin/account");
        } else {
            const res = await updateUser({ ...newUser as User, ...newUser });
            toast.update(toastForm, {
                render: res.message,
                type: res.error ? "error" : "success",
                isLoading: false,
                autoClose: 2000,
            });

            if (res.ok)
                navigate("/admin/account");
        }
    };

    return (
        <div className={style.container}>
            <h1>Edit User</h1>
            <form
                className={style.form_add_user}
                onSubmit={handleSubmit}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                }}
            >
                <div className={style.input_image}>
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
                        <input id="email" name="email" type="text" defaultValue={email} disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input id="name" name="name" type="text" defaultValue={name} required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="rfid"> RFID:</label>
                        <input id="rfid" name="rfid" type="number" defaultValue={rfid} required
                            onChange={(e) => setRfid(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role" name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            defaultValue={role}
                            required >
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className={style.submit}>
                        <button onClick={() => navigate("/admin/account")}>Cancel</button>
                        <button type="submit" >Update User</button>
                    </div>
                </div>
            </form>
        </div>
    );
}