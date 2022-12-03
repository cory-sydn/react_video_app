export default function formatDate(date) {
	const months = [
		"Jan",
		"Feb",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];

	const inputDate = date.split("-");

	return (
		inputDate[2] +
		"  " +
		months[Number.parseInt(inputDate[1])] +
		" " +
		inputDate[0]
	);
}