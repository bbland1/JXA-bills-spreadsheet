# Automatic Update Shortcut for Numbers Spreadsheet
This shortcut and script creates an efficient bill management process utilizing a Numbers document and apple's schortcut. By automating the process of updating the due dates and balances of any selected bill. When executed, the shortcut presents a list of bills, allowing users to select one, multiple, or all bills for updating. That information is passed through the shortcut to the Javascript to preform the updates.

*It can only be ran on an Apple computer, JXA is not able to be used on phones. I am not sure about iPads.*

## What it does
Upon input reception, the script performs the following operations:

#### Data Preparation:
  - The specified sheet is accessed, and the script verifies the presence of input data.
  - Utilizing the known bill column, the script constructs a lookup map to expedite bill row identification.
#### Iteration and Data Capture:
  - The script iterates through the list of selected bills to locate their respective rows within the sheet.
  - Current bill data, including due date, pay frequency, payment amount, and balance, is extracted and stored.
    ##### Data Validation:
      - For each bill, if any data points (due date, pay frequency, or payment amount) are null, appropriate messages are generated and   appended to an end message array.
#### Date and Balance Adjustment:
  - If the due date is before the current date, the script evaluates the pay frequency and increments the due date accordingly.
  - If a balance exists, the payment amount is subtracted from the balance, and the updated balance is set in the spreadsheet.
#### Document Update and Response:
  - The Numbers document is saved to persist the changes made.
  - The script generates a response containing the updates made, facilitating communication with external processes (e.g., shortcuts sends message).

## Getting it work on your computers
Apple computers have an application called shortcuts. In shortcuts you can utilize apple's script editor/automator by using the `Run Javasctipt for automation` (you can also use Applescript or shell scripts, depending on what you want).

<details>
  <summary>Importing the shortcut from shared sample link</summary>
  1. Click this iCloud link and click add shortcut
  - https://www.icloud.com/shortcuts/bf019df510ff4df58384066abf5d8750

  <img width="307" alt="Screenshot 2023-08-19 at 1 54 35 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/82233ee5-5dbb-4718-9c45-b45d77a62b7c">

  - If you know the information for the import questions you can fill them out now or they can be editied after the import

    <img width="207" alt="Screenshot 2023-08-19 at 1 57 38 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/f500a2d3-d199-4e13-b966-c39cac46d241">

2. Right click the shortcut and click edit

<img width="228" alt="Screenshot 2023-08-19 at 1 10 18 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/97af8c7b-f909-4e35-9ce7-62ef12b8b5c4">

3. Edit the list values to be the ones in the spreadsheet

<img width="337" alt="Screenshot 2023-08-19 at 1 10 40 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/fdd9bb75-d79b-4b4b-89a3-180f90f572e3">

4. Edit the value of the spreadsheet to open to the one you are using

<img width="337" alt="Screenshot 2023-08-19 at 1 10 54 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/92a42818-8b0f-4d95-b1ba-e5134ca0561a">

5. Add the proper recipent to the send message

<img width="337" alt="Screenshot 2023-08-19 at 1 11 19 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/a12e93d7-fe73-49e6-8fc6-d9c6e0739d1c">

6. Click the information button in the upper right hand corner

<img width="267" alt="Screenshot 2023-08-19 at 1 11 37 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/422c6193-83f7-4a50-8f77-355b52d6c73d">

7. Make sure the settings match the screenshot to allow the proper access of the shortcut steps to your items

<img width="267" alt="Screenshot 2023-08-19 at 1 11 57 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/0d6cdec8-74ae-45bb-8437-07d468d3f0ec">
</details>

<details>
  <summary>How to make the shortcut yourself</summary>
  1. Open Shortcuts.
  2. Click `New Shortcut` in the upper right hand corner.
  3. From `scripting` select (in this order):
    - `List`
    - `Choose from List`
    - `Add to Variable`
    - `Open Spreadsheet`
    - `Run Javasctipt for Mac Automation`
    - `Send Message`
  4. Add the bills needed to be selected from the list to the list values.
  5. Set the choose from list to select from the list you made if is not set.
  6. Set the chosen item to the variable named as you want.
  7. set the spreadsheet to be opened to the specifc spreadsheet you will use.
  8. Copy the JS from [automationFunc.js](./automationFunc.js) and replace the deafult text in the `Run Javasctipt for Mac Automation` spot.
  9. Set the message to be sent when updated and the recipent to who you want.
</details>

## Demo
A video showing the spreadsheet at first, closing it and then running the shortcut that automaticall opens the spreadsheet again and updates thate values.



https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/eadfb570-4eba-4ab4-add2-bb17229176be




The message sent from the screen shot about the bills selected
<img width="688" alt="Screenshot 2023-08-19 at 2 21 54 AM" src="https://github.com/bbland1/JXA-bills-spreadsheet/assets/104288486/bab931fc-6918-4c7a-97fa-c5daa306017b">

    
