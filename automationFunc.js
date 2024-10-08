// debugger;

// * creates a lookup object to be able to use for the cells row number to optimize the search as the spreadsheet gets bigger
function createRowLookupMap(column) {
	const rowLookup = {};

	for (const cell of column.cells()) {
		const cellValue = cell.value();

		if (cellValue != null) {
			rowLookup[cellValue] = cell.row().address();
		}
	}

	return rowLookup;
}

// * the actual JS function that does the search and updating of the cells
// the name run and input is the default set when adding JS to the shortcut
function run(input) {
	const currentDate = new Date();

	const updatedBillsInfo = [];
	let updateMessage;

	if (!input || input.length === 0) {
		return 'Error: No bills provided to update';
	}

	// Launch numbers in background to keep the user experience clean
	const numbersApp = Application('Numbers');
	numbersApp.includeStandardAdditions = true;
	const table = numbersApp.documents['Sample Bill Spreadsheet Shortcut'].sheets['Shared Bills'].tables[0];
	const columnName = 'Bill';
	const targetColumn = table.columns.byName(columnName);

	// * get which bills needs to be updated 
	// this is how it works with the shortcut
	const targetValues = input[0];

	// * apple automator method to get the values
	// const targetValues = input[0].split('\n');

	const rowLookupMap = createRowLookupMap(targetColumn);

	// * loop over the specific values that are being updated
	for (const targetValue of targetValues) {
		let currentRow = rowLookupMap[targetValue];
		// * find the row of that value to do the updating
		if (!currentRow) {
			return `Error: ${targetValue} could not be found.`;
		}

		// * create an array of the row data to find any missing data
		const billRowData = [
			{value: table.cells[`B${currentRow}`].value(), label: 'Bill Frequency'},
			{value: table.cells[`C${currentRow}`].value(), label: 'Due Date'},
			{value: table.cells[`D${currentRow}`].value(), label: 'Payment'},
			{value: table.cells[`E${currentRow}`].value(), label: 'Payoff Balance'}
		]

		const missingData = billRowData.filter(cell => cell.value === null && cell.label !== 'Payoff Balance').map(cell => cell.label)

		// * because the shortcut sends an update message want to be able to know what a bill is missing
		if (missingData.length > 0) {
			return `Error: ${targetValue} could not be updated due to missing data: ${missingData.join(', ')}.`;
		}

		const currentDueDate = billRowData[1].value
		// * need the date to be the numerical short hand to do the math with
		let month = currentDueDate.getMonth();
		let day = currentDueDate.getDate();
		let year = currentDueDate.getFullYear();

		// * makes sure the shortcut can be ran whenever but it will only update a bill if the date it is ran is after the listed due date
		if (currentDate >= currentDueDate) {
			let updatedDueDate;

			switch (paymentFrequency) {
				case 'Monthly':
					month = (month + 1) % 12;
					if (month > 11) {
						year++;
					}
					updatedDueDate = new Date(year, month, day);
					break;
				case 'Quarterly':
					month = (month + 3) % 12;
					if (month > 11) {
						year++;
					}
					updatedDueDate = new Date(year, month, day);
					break;
				case 'Semi-Annually':
					month = (month + 6) % 12;
					if (month > 11) {
						year++;
					}
					updatedDueDate = new Date(year, month, day);
					break;
				case 'Annually':
					year++;
					updatedDueDate = new Date(year, month, day);
			}

			table.cells[`C${currentRow}`].value = updatedDueDate;

			// * not all the bills have a balance so checked for if the balance isn't null to do the logic that is specific to those bills
			if (payoffBalance != null) {
				const updatedPayoffBalance = payoffBalance - paymentAmount;

				// this needed to be a template literal for the spreadsheet to register that this was a number and keep it's format
				table.cells[`E${currentRow}`].value = `${updatedPayoffBalance}`;

				updateMessage = `${targetValue} due date updated to ${updatedDueDate.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })} and balance updated to ${updatedPayoffBalance}.`;

				updatedBillsInfo.push(updateMessage);
			} else {

				updateMessage = `${targetValue} due date updated to ${updatedDueDate.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}.`;

				updatedBillsInfo.push(updateMessage);
			}
		} else {

			updateMessage = `${targetValue} due date (${currentDueDate.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}) has not passed yet.`;

			updatedBillsInfo.push(updateMessage);
		}

		// * should save the spreadsheet when done but it should still be open to check
		numbersApp.documents['Sample Bill Spreadsheet Shortcut'].save();
		return updatedBillsInfo;
	}
}
