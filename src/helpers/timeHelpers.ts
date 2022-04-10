const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getHours = (datetime: Date):string => { 
	let hours: number = datetime.getHours()
    let strHours: string
	if (hours == 0) strHours = "12"
    else if (hours < 10) strHours = lpad(hours)
    else strHours = hours.toString()
	return strHours
}

export const displayTime = (datetime: Date):string => {
    let date: number = datetime.getDate()
    let dayStr: string = String(date)
    const now: Date = new Date()

    if (date === now.getDate()) {
        dayStr = "Today"
    } else if (date === now.getDate() + 1) {
        dayStr = "Tomorrow"
    } else if (date === now.getDate() - 1) {
        dayStr = "Yesterday"
    } else {
        dayStr = `${MONTHS[datetime.getMonth()]} ${date}, ${datetime.getFullYear()}`
    }

    dayStr = `${dayStr} ${getHours(datetime)}:${lpad(datetime.getMinutes())}` 

    return dayStr 
}

export const displayTimeFromStr = (dtStr: string):string => {
    let dt = new Date(dtStr)
    return displayTime(dt)
} 

export const displayElapsed = (seconds: number):string => {
    if (seconds == 0) return "00:00:00"

    let hours = Math.floor(seconds / 3600);
    let remainder = seconds % 3600;
    let mins = Math.floor(remainder / 60);
    let secs = remainder % 60;

    return `${lpad(hours)}:${lpad(mins)}:${lpad(secs)}`
}
  
export const calculateElapsedSeconds = (start: Date, end=new Date()): number => {
    const milliDiff = end.getTime() - start.getTime(); // in ms
    return Math.round(milliDiff / 1000);
}

export function lpad(num: number): string {
    let formatted;
    if (num < 10) formatted = String(num).padStart(2, '0')
    else formatted = String(num)
    return formatted
}

export function calculateTargetEndTime(start: Date, targetDuration: number):Date {
    const end = new Date(start)
    end.setHours(start.getHours() + targetDuration)
    end.setMinutes(start.getMinutes())
    end.setSeconds(start.getSeconds())
    return end
}

export function dateIsInPast(date: Date) {
    const now = new Date()
    if (date < now) return true
    return false
}