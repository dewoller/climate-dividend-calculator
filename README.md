# Climate Dividend Calculator

A single-page HTML/CSS/JS application to calculate household net benefit from a carbon fee and dividend scheme. This calculator allows users to estimate how a carbon pricing policy would affect their household finances, based on their energy usage patterns and household composition.

## Overview

The Climate Dividend Calculator helps users understand the financial impact of a carbon fee and dividend policy. The calculator:

- Estimates the per-adult dividend based on carbon price and emissions
- Calculates extra costs for household electricity, gas, and petrol
- Determines the net financial benefit (or cost) for the household
- Shows results in both annual and monthly terms
- Allows users to adjust all background policy assumptions

## How to Run

Simply open `index.html` in a modern web browser. No installation is required, and no data is stored or transmitted.

## File Structure

- **index.html**: The main HTML structure with tabs for the calculator, background assumptions, and calculation details
- **styles.css**: Styling for the application, making it responsive for different screen sizes
- **calculator.js**: Core calculation logic and mathematical functions based on the carbon fee and dividend model
- **app.js**: DOM manipulation, user interface interactions, and form validation

## Calculation Logic Source

Model based on the UNSW Australian Carbon Dividend Plan. The calculator implements the mathematical model for calculating dividends, costs, and net benefits based on user inputs and policy parameters.

## Features

- **Three-tab interface**: Main calculator, background assumptions, and calculation details
- **Real-time updates**: All calculations update instantly when any input changes
- **Input validation**: Prevents invalid input and provides helpful error messages
- **Graceful error handling**: Handles edge cases like division by zero
- **Responsive design**: Works on both desktop and mobile devices
- **Privacy-friendly**: No data storage or external requests

## Using the Calculator

1. Enter your household information and energy usage in the main calculator tab
2. View your projected net benefit or cost in the output section
3. Optionally, adjust the background policy assumptions to explore different scenarios
4. View calculation details for a breakdown of how figures are derived

## Data Privacy

This calculator operates entirely in your browser. No data is saved in cookies or local storage, and no information is transmitted over the internet. Your inputs are processed locally and reset when you reload the page.

## Browser Support

The calculator works in all modern browsers, including:
- Chrome
- Firefox
- Safari
- Edge

Internet Explorer is not supported.

## Development

To modify or extend the calculator:
1. Edit HTML, CSS, and JavaScript files using any text editor
2. Test in a browser by opening index.html
3. No build process is required

## License

Text, photos, and graphics © Citizens' Climate Lobby (CCL) Australia or used with permission. All rights reserved. Text available under Creative Commons NC SA license.
