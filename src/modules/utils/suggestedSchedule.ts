/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
const getAvailableTimes = (startDayTime: string, endDayTime: string, bookTimes: any[]) => {
  let startDateTime: any = new Date(`2000-01-01T${startDayTime}`);
  const endDateTime = new Date(`2000-01-01T${endDayTime}`);

  // Initialize an array to store available times
  const availableTimes = [];

  // Loop through each booked time slot
  bookTimes.forEach((bookTime) => {
    const bookedStartTime = new Date(`2000-01-01T${bookTime.startTime}`);
    const bookedEndTime = new Date(`2000-01-01T${bookTime.endTime}`);

    // Check if booked time slot overlaps with available time range
    if (bookedStartTime < endDateTime && bookedEndTime > startDateTime) {
      // Adjust available time range based on booked time slot
      if (bookedStartTime > startDateTime) {
        availableTimes.push({
          startTime: startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: bookedStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        });
      }
      if (bookedEndTime < endDateTime) {
        startDateTime.setTime(bookedEndTime.getTime());
      } else {
        startDateTime = null; // No available time left
      }
    }
  });

  // Add remaining time after last booked slot if applicable
  if (startDateTime && startDateTime < endDateTime) {
    availableTimes.push({
      startTime: startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      endTime: endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    });
  }

  return availableTimes;
};

const bookTime = (durationInMinutes: any, availableTimes: any[]) => {
  const durationInMilliseconds = durationInMinutes * 60000; // Convert minutes to milliseconds

  // Loop through available time slots
  for (const timeSlot of availableTimes) {
    const startTime = new Date(`2000-01-01T${timeSlot.startTime}`);
    const endTime = new Date(`2000-01-01T${timeSlot.endTime}`);

    // Check if the duration fits within the current time slot
    if (endTime.getTime() - startTime.getTime() >= durationInMilliseconds) {
      // Calculate the end time of the booked slot
      const bookedEndTime = new Date(startTime.getTime() + durationInMilliseconds);

      // Update the start time of the next available slot
      timeSlot.startTime = bookedEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      // Return the booked time slot
      return {
        startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: bookedEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
    }
  }
  // No available time slot found to book
  return {};
};

const generateStudyPlan = (
  dayStartTime: string,
  dayEndTime: string,
  // lunchTime,
  tasks: any[],
  classes: any[],
  partTimeJobHours: any[]
) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule: any = {};

  weekDays.map((weekDay, index) => {
    const classTime: any[] = classes.filter((c) => c.day === index) || [];
    const partTimeJob = partTimeJobHours.find((p) => p.day === index) || {};

    const weekDayTasks: any[] = tasks.filter((t) => t.day === index) || [];

    const studyPlan = {
      day: weekDay,
      dayStartTime,
      dayEndTime,
      classTime,
      partTimeJob,
      weekDayTasks,
    };

    const bookedTime: any[] =
      classTime.map((c) => {
        return {
          startTime: c.startTime,
          endTime: c.endTime,
        };
      }) || [];

    const availableTimes = getAvailableTimes(dayStartTime, dayEndTime, bookedTime || []);

    if (partTimeJob) {
      const jobBookTime = bookTime(partTimeJob.duration * 60, availableTimes);
      bookedTime.push(jobBookTime);
      partTimeJob.startTime = jobBookTime.startTime;
      partTimeJob.endTime = jobBookTime.endTime;
    }

    if (weekDayTasks?.length) {
      weekDayTasks.sort((a, b) => b.priority - a.priority);
      weekDayTasks.map((task: any) => {
        const taskBookTime = bookTime(task.duration * 60, availableTimes);
        bookedTime.push(taskBookTime);
        task.startTime = taskBookTime.startTime;
        task.endTime = taskBookTime.endTime;
      });
    }
    schedule[weekDay] = studyPlan;
  });
  return schedule;
};

export default generateStudyPlan;
