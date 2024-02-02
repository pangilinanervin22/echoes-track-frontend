import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where, DocumentReference, writeBatch } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

export interface Schedule {
  day: string;
  room: string;
  section: string;
  start: string;
  end: string;
  subject: string;
  id?: string;
  room_ref?: DocumentReference;
}

export function useGetSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDB, "schedules"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setSchedules(data as Schedule[]);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return schedules;
}

export function useSchedule() {
  const [status, setStatus] = useState("idle");

  const addSchedule = async (name: string) => {
    setStatus("loading");

    try {
      await addDoc(collection(firebaseDB, "schedules"), { name });
      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, addSchedule };
}

export function useAddSchedule() {
  const [status, setStatus] = useState("idle");

  const addSchedule = async (schedule: Schedule) => {
    setStatus("loading");

    try {
      const q = query(collection(firebaseDB, "rooms"), where("name", "==", schedule.room));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert('No matching rooms found.');
        return;
      }

      schedule.room_ref = doc(firebaseDB, "rooms", querySnapshot.docs[0].id);
      await addDoc(collection(firebaseDB, "schedules"), schedule);
      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, addSchedule };
}

export function useGetSchedule(id: string) {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const docRef = doc(firebaseDB, "schedules", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSchedule(docSnap.data() as Schedule);
        } else {
          setError("Schedule not found");
        }
      } catch (error) {
        setError("An error occurred while fetching the schedule");
      }
    };

    getSchedule();
  }, [id]);

  return { schedule, error };
}

export function useUpdateSchedule() {
  const [status, setStatus] = useState("idle");

  const updateSchedule = async (id: string, schedule: Schedule) => {
    setStatus("loading");

    try {
      const q = query(collection(firebaseDB, "rooms"), where("name", "==", schedule.room));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert('Room not found');
        return;
      }

      schedule.room_ref = doc(firebaseDB, "rooms", querySnapshot.docs[0].id);
      const scheduleRef = doc(firebaseDB, "schedules", id);
      await updateDoc(scheduleRef, {
        day: schedule.day,
        room: schedule.room,
        section: schedule.section,
        start: schedule.start,
        end: schedule.end,
        subject: schedule.subject,
        room_ref: schedule.room_ref,
      });

      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, updateSchedule };
}


export function isScheduleValid(schedule: Schedule) {
  for (const key in schedule) {
    if (schedule[key as keyof Schedule] === "") {
      return false;
    }
  }
  return true;
}

export function useDeleteSchedule() {
  const [status, setStatus] = useState("idle");

  const deleteSchedule = async (id: string) => {
    setStatus("loading");

    try {
      const ref = doc(firebaseDB, "schedules", id);
      await deleteDoc(ref);

      setStatus("success");
    } catch (e) {
      console.log(e);
      setStatus("error");
    }
  };

  return { status, deleteSchedule };
}

// non-react hooks

export async function getSchedule(id: string) {
  const docRef = doc(firebaseDB, "schedules", id || "");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}