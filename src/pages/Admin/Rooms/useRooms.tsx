import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';
import { Schedule } from '../Schedules/useSchedules';

export interface Room {
  id: string;
  name: string;
}

export function useGetRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDB, "rooms"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRooms(data as Room[]);
      setIsLoading(false); // Set loading to false after data is received
    });

    return () => unsubscribe();
  }, []);

  return { rooms: rooms.sort((a, b) => a.name.localeCompare(b.name)), isLoading };
}

export function useAddRoom() {

  const addRoom = async (name: string) => {

    try {

      const check = await verifyRoomExists(name);
      if (check) {
        return { error: true, message: "Room name already exists" };
      }

      await addDoc(collection(firebaseDB, "rooms"), { name });
      return { ok: true, message: "Room added successfully" };
    } catch (e) {
      console.log(e);
      return { error: true, message: "Error adding room" };
    }
  };

  return { addRoom };
}

export function useUpdateRoom() {
  const updateRoom = async (updatedRoom: Room) => {
    if (!updatedRoom || !updatedRoom.id) {
      return { error: true, message: "Invalid room id" };
    }

    const check = await verifyRoomExists(updatedRoom.name);
    if (check) {
      return { error: true, message: "Room name already exists" };
    }

    try {
      const roomRef = doc(firebaseDB, 'rooms', updatedRoom.id);
      await updateDoc(roomRef, { name: updatedRoom.name });
      console.log('Room updated', roomRef.id, roomRef, updatedRoom);

      const scheduleRef = query(collection(firebaseDB, 'schedules'), where('room_ref', '==', roomRef));
      const scheduleSnapshot = await getDocs(scheduleRef);

      scheduleSnapshot.forEach(async (scheduleDoc) => {
        console.log('Updating schedule', scheduleDoc.id, scheduleDoc.ref);
        await updateDoc(scheduleDoc.ref, { room: updatedRoom.name });
      });

      return { ok: true, message: "Room updated successfully" };
    } catch (e) {
      console.error(e);
      return { error: true, message: "Error updating room" };
    }
  };

  return { updateRoom };
}

export function useDeleteRoom() {
  const deleteRoom = async (id: string) => {

    try {
      const roomRef = doc(firebaseDB, "rooms", id);
      await deleteDoc(roomRef);

      const schedulesRef = collection(firebaseDB, 'schedules');
      const schedulesSnapshot = await getDocs(query(schedulesRef, where('room_ref', '==', roomRef)));

      const batch = writeBatch(firebaseDB);
      schedulesSnapshot.docs.forEach((scheduleDoc) => {
        const scheduleRef = doc(firebaseDB, 'schedules', scheduleDoc.id);
        batch.delete(scheduleRef);
      });

      await batch.commit();
      return { ok: true, message: `Room deleted successfully` };
    } catch (e) {
      return { error: true, message: "Error deleting room" };
    }
  };

  return { deleteRoom };
}

export function useGetRoomByName() {
  const [room, setRoom] = useState<Room | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const getRoomByName = async (roomName: string) => {
    try {
      const snapshot = await getDocs(collection(firebaseDB, "rooms"));
      const foundRoom = snapshot.docs.find((doc) => doc.data().name === roomName);

      if (foundRoom) {
        setRoom(foundRoom.data() as Room);

        const scheduleRef = query(collection(firebaseDB, 'schedules'), where('room_ref', '==', foundRoom.ref));
        const scheduleSnapshot = await getDocs(scheduleRef);
        const schedules = scheduleSnapshot.docs.map((scheduleDoc) => scheduleDoc.data() as Schedule);

        setSchedules(schedules);
      } else {
        console.log("No such room!");
      }
    } catch (e) {
      console.log(e);
    }

  };

  return { room, schedules, getRoomByName };
}

export function useGetRoomByNameRealTime() {
  const [room, setRoom] = useState<Room | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRoomByName = (roomName: string) => {
    setIsLoading(true);

    const unsubscribeFromRoom = onSnapshot(query(collection(firebaseDB, "rooms"), where('name', '==', roomName)),
      (snapshot) => {
        const foundRoom = snapshot.docs[0];

        if (foundRoom) {
          setRoom(foundRoom.data() as Room);

          const unsubscribeFromSchedules = onSnapshot(query(collection(firebaseDB, 'schedules'), where('room_ref', '==', foundRoom.ref)),
            (scheduleSnapshot) => {
              const schedules = scheduleSnapshot.docs.map((scheduleDoc) => scheduleDoc.data() as Schedule);
              setSchedules(schedules);
              setIsLoading(false);
            },
            (error) => {
              console.log(error);
              setIsLoading(false);
            }
          );

          // Clean up function to unsubscribe from schedules when room changes or component unmounts
          return () => unsubscribeFromSchedules();
        } else {
          console.log("No such room!");
          setIsLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
      }
    );

    // Clean up function to unsubscribe from room when component unmounts
    return () => unsubscribeFromRoom();
  };

  // Call getRoomByName whenever roomName changes
  useEffect(() => {
    const unsubscribe = getRoomByName(room?.name || '');
    return unsubscribe;
  }, [room?.name]);

  return { room, schedules, isLoading, getRoomByName };
}


export async function getRoomByName(roomName: string): Promise<{ room: Room | null, schedules: Schedule[] }> {
  try {
    const snapshot = await getDocs(collection(firebaseDB, "rooms"));
    const foundRoom = snapshot.docs.find((doc) => doc.data().name === roomName);

    if (foundRoom) {
      const room = foundRoom.data() as Room;

      const scheduleRef = query(collection(firebaseDB, 'schedules'), where('room_ref', '==', foundRoom.ref));
      const scheduleSnapshot = await getDocs(scheduleRef);
      const schedules = scheduleSnapshot.docs.map((scheduleDoc) => scheduleDoc.data() as Schedule);

      return { room, schedules };
    } else {
      console.log("No such room!");
      return { room: null, schedules: [] };
    }
  } catch (e) {
    console.log(e);
    return { room: null, schedules: [] };
  }
}

export async function verifyRoomExists(roomName: string): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(firebaseDB, "rooms"));
    const foundRoom = snapshot.docs.find((doc) => doc.data().name === roomName);

    return !!foundRoom;
  } catch (e) {
    console.log(e);
    return false;
  }
}