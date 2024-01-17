import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

export interface Room {
  id: string;
  name: string;
}

export function useGetRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDB, "rooms"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRooms(data as Room[]);
    });

    return () => unsubscribe();
  }, []);

  return rooms.sort((a, b) => a.name.localeCompare(b.name));
}

export function useAddRoom() {
  const [status, setStatus] = useState("idle");

  const addRoom = async (name: string) => {
    setStatus("loading");

    try {
      await addDoc(collection(firebaseDB, "rooms"), { name });
      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, addRoom };
}

export function useUpdateRoom() {
  const [status, setStatus] = useState('idle');

  const updateRoom = async (updatedRoom: Room) => {
    if (!updatedRoom || !updatedRoom.id) {
      console.error('Room or room ID is undefined');
      return;
    }

    setStatus('loading');

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

      setStatus('success');
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  return { status, updateRoom };
}

export function useDeleteRoom() {
  const [status, setStatus] = useState("idle");

  const deleteRoom = async (id: string) => {
    setStatus("loading");

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
      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, deleteRoom };
}