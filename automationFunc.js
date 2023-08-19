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
	// * get the numbers application for getting the spreadsheet
	const numbersApp = Application('Numbers');

	// * get the table by opening the doc, the sheet and specific table
	// they are all 0-indexed so 0 is the recent doc, first sheet and first table and so forth (specific names can be added)
	const table = numbersApp.documents[0].sheets[0].tables[0];

	// * get the date the shortcut is being ran
	const currentDate = new Date();

	// * the name of the column search on, this is the Bill name column because we are updating based on the name
	const columnName = 'Bill';

	const updateBills = [];
	let updateMessage;

	if (!input || input.length === 0) {
		updateMessage = 'No bills provided to update.';
		updateBills.push(updateMessage);
		return updateBills;
	} else {

		// * get the column numerical value that we are searching with (Bill)
		const targetColumn = table.columns.byName(columnName);

		// * get which bills needs to be updated 
		// this is how it works with the shortcut
		const targetValues = input[0];
		// * if using apple automator and setting up a script there that uses the get specific text breaking up the bills with returns* //
		// const targetValues = input[0].split('\n');

		const rowLookupMap = createRowLookupMap(targetColumn);

		// * loop over the specific values that are being updated
		for (const targetValue of targetValues) {
			// * find the row of that value to do the updating
			let currentRow = rowLookupMap[targetValue];

			if (!currentRow) {
				updateMessage = `${targetValue} could not be found.`;
				updateBills.push(updateMessage);

			} else {
				// * get the current values of other data to work with
				const paymentFrequency = table.cells[`B${currentRow}`].value();
				const currentDueDate = table.cells[`C${currentRow}`].value();
				const paymentAmount = table.cells[`D${currentRow}`].value();
				const payoffBalance = table.cells[`E${currentRow}`].value();

				// * because the shortcut sends an update message want to be able to know what a bill is missing
				if (paymentFrequency === null || currentDueDate === null || paymentAmount === null) {
					const missingData = [];

					if (paymentFrequency === null) {
						missingData.push('Bill Frequency');
					}

					if (currentDueDate === null) {
						missingData.push('Due Date');
					}

					if (paymentAmount === null) {
						missingData.push('Payment');
					}

					updateMessage = `${targetValue} could not be updated due to missing data: ${missingData.join(', ')}.`;
					updateBills.push(updateMessage);
				} else {

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

							updateMessage = `${targetValue} due date updated to ${updatedDueDate.toLocaleString('default', {month: 'numeric', day: 'numeric', year: 'numeric'})} and balance updated to ${updatedPayoffBalance}.`;

							updateBills.push(updateMessage);
						} else {

							updateMessage = `${targetValue} due date updated to ${updatedDueDate.toLocaleString('default', {month: 'numeric', day: 'numeric', year: 'numeric'})}.`;

							updateBills.push(updateMessage);
						}
					} else {

						updateMessage = `${targetValue} due date (${currentDueDate.toLocaleString('default', {month: 'numeric', day: 'numeric', year: 'numeric'})}) has not passed yet.`;

						updateBills.push(updateMessage);
					}
				}
			}
		}
		// * should save the spreadsheet when done but it should still be open to check
		numbersApp.documents['Bland Family Expenses'].save();
		return updateBills;
	}
}
