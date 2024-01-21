import { useState } from "react";
import { useAddRoom } from "./useRooms";

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
        <div>
            <button onClick={() => { changeStatus("all") }}>
                back to list
            </button>
            <h1>Add Room</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" about=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}


