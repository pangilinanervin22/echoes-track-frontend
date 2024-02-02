import { useState } from "react";
import { useAddRoom } from "./useRooms";
import addStylee from "./addRoomStyle.module.scss"

interface Props {
    changeStatus: (status: string) => void;
}

export default function AddRoom({ changeStatus }: Props) {
    const { addRoom, status } = useAddRoom();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        addRoom(name);
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
                        />
                        <div>

                        <button className={addStylee.addBtn} type="submit">Confirm</button>
                    <button className={addStylee.backBtn} onClick={() => { changeStatus("all") }}>
                        Back
                    </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


