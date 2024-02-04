import { Room, useUpdateRoom } from "./useRooms";
import addStylee from "./addRoomStyle.module.scss"

interface Props {
    room: Room;
    changeStatus: (status: string) => void;
}

export default function EditRoom({ room, changeStatus }: Props) {
    const { updateRoom } = useUpdateRoom();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = (event.currentTarget.elements.namedItem("name") as HTMLInputElement)?.value;

        updateRoom({ id: room.id, name });
        changeStatus("all")
    };

    if (status === 'loading')
        return <div>Loading...</div>

    if (room.name === undefined)
        return <div>Room not found</div>

    return (
        <div className={addStylee.mainContainer}>
            <div className={addStylee.center}>
                <div className={addStylee.anotherCenter}>
                <h1>Edit Room</h1>
                <form onSubmit={handleSubmit}>
                    <input id="name" type="text" placeholder="Name"
                        min={1} max={100}
                        required
                        defaultValue={room.name} />
                        <div>
                            <div className={addStylee.flex}>
                        <button className={addStylee.addBtn} type="submit">Update</button>
                        <button className={addStylee.backBtn} onClick={() => { changeStatus("all") }}>
                            back to rooms
                        </button>
                            </div>
                        </div>
                </form>
                </div>
            </div>
        </div>
    )
}

