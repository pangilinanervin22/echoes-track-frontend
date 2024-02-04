import { useState } from "react";
import { useAddRoom } from "./useRooms";
import addStylee from "./addRoomStyle.module.scss"
import { toast } from "react-toastify";

interface Props {
    changeStatus: (status: string) => void;
}

export default function AddRoom({ changeStatus }: Props) {
    const { addRoom } = useAddRoom();
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastSubmit = toast.loading("Adding room...");

        const res = await addRoom(name);
        toast.update(toastSubmit, {
            render: res.message,
            type: res.error ? "error" : "success",
            isLoading: false,
            autoClose: 2000
        });

        if (res.ok)
            changeStatus("all");
    }

    return (
        <div className={addStylee.mainContainer}>
            <div className={addStylee.center}>
                <div className={addStylee.anotherCenter}>
                    <h1>Add Room</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Name" about=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <div>
                            <div className={addStylee.flex}>
                                <button className={addStylee.addBtn} type="submit">Confirm</button>
                                <button className={addStylee.backBtn} onClick={() => { changeStatus("all") }}>
                                    Back to room
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


