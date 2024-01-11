export default function Rooms() {
    return (
        <>
            <h1>hello world</h1>
            <h1>hELLO JOJI</h1>
            <div>
                {RoomList.map((room) => (
                    <div>
                        <h1>{room.name}</h1>
                    </div>
                ))}
            </div>
        </>
    )
}

interface Room {
    id: string
    name: string
    schedules: any
}

const RoomList: Room[] = [
    {
        id: "1",
        name: "Room 1",
        schedules: [
            {
                id: "1",
                name: "Schedule 1",
                start: "2021-10-01T09:00:00",
                end: "2021-10-01T10:00:00",
                room: "1",
            },
            {
                id: "2",
                name: "Schedule 2",
                start: "2021-10-01T10:00:00",
                end: "2021-10-01T11:00:00",
                room: "1",
            },
        ],
    },
    {
        id: "2",
        name: "Room 2",
        schedules: [
            {
                id: "3",
                name: "Schedule 3",
                start: "2021-10-01T09:00:00",
                end: "2021-10-01T10:00:00",
                room: "2",
            },
            {
                id: "4",
                name: "Schedule 4",
                start: "2021-10-01T10:00:00",
                end: "2021-10-01T11:00:00",
                room: "2",
            },
        ],
    },
]