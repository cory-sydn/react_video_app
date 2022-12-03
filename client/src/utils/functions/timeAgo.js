export default function timeAgo(time) {
  const date = new Date();
  const diff = date.getTime() - new Date(time).getTime();

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.41 * 12 ));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.41));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  const sec = Math.floor(diff / 1000 );

  if (years > 0) {
    return years === 1 ?  `${years} year ago` :  `${years} years ago`;
  }

  if (months > 0) {
    return months === 1 ?  `${months} month ago` :  `${months} months ago`;
  }

  if (weeks > 0) {
    return weeks === 1 ?  `${weeks} week ago` :  `${weeks} weeks ago`;
  }

  if (days > 0) {
    return days === 1 ?  `${days} day ago` :  `${days} days ago`;
  }

  if (hours > 0) {
    return hours === 1 ?  `${hours} hour ago` :  `${hours} hours ago`;
  }

  if (mins > 0) {
    return mins === 1 ?  `${mins} minute ago` :  `${mins} minutes ago`;
  }

  if (sec > 0) {
    return sec === 1 ?  `${sec} second ago` :  `${sec} seconds ago`;
  }
}