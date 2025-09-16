// Date formatting utilities for spectacle sessions

export const formatDateToFrench = (dateString: string): string => {
  const date = new Date(dateString);
  const dayNames = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName} ${day} ${month} ${year}`;
};

export const formatTime = (timeString: string): string => {
  return timeString; // Already in HH:MM format
};

export const formatLocation = (location: string): string => {
  // Convert location format from "CITY - VENUE" to "City, Venue"
  const parts = location.split(' - ');
  if (parts.length === 2) {
    const city = parts[0].toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    const venue = parts[1].toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    return `${city}, ${venue}`;
  }
  return location;
};
