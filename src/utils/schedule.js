// src/utils/schedule.js
import { reader } from '../lib/keystatic'; 

export async function getLiveShow() {
  const schedule = await reader.singletons.schedule.read();
  
  if (!schedule || !schedule.allSlots) return null;

  const now = new Date();
  // Using the naming convention we set up in your config (1-mon, 2-tue, etc.)
  const days = ['7-sun', '1-mon', '2-tue', '3-wed', '4-thu', '5-fri', '6-sat'];
  const currentDay = days[now.getDay()];
  
  // Format current time as HH:mm to match your input fields
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');

  // Find the slot for the right day and time
  const activeSlot = schedule.allSlots.find(slot => {
    // Note: This assumes you added an endTime to your schema 
    // If not, we can just find the one that matches the closest start time
    return slot.day === currentDay && 
           currentTime >= slot.startTime && 
           currentTime < (slot.endTime || "23:59");
  });

  if (!activeSlot || !activeSlot.show) return null;

  // Fetch the full show details (like title and genre) using the slug
  const showData = await reader.collections.shows.read(activeSlot.show);
  
  return {
    ...showData,
    startTime: activeSlot.startTime,
    endTime: activeSlot.endTime
  };
}