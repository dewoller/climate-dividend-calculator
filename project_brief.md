
Climate Dividend Calculator — Developer Specification

1. Overview

A single-page, responsive HTML application to calculate household net benefit from a “climate dividend” (carbon fee and dividend) scheme. Users adjust personal energy use and household makeup, and can optionally edit all background policy assumptions. Outputs update instantly, showing the net financial impact for the household, with a clear summary and table.

⸻

2. Core Features

Main Page
	•	Inputs (user-editable, default values):
	1.	Number of adults in household (default: 2)
	2.	Number of eligible children (default: 0)
	3.	Annual household electricity use, kWh (default: 5,000)
	4.	Annual household gas use, GJ (default: 20)
	5.	Annual household petrol use, L (default: 1,600)
	•	Outputs:
	•	Per-adult dividend (annual & monthly)
	•	Per-household dividend (annual & monthly)
	•	Total extra household cost (annual & monthly)
	•	Net annual benefit (annual & monthly)
	•	Presented as:
	•	Headline (e.g., “Your household’s net benefit is $2,210 per year.”)
	•	Narrative summary (e.g., “With these settings, your household receives a total annual dividend of $2,620 and pays an estimated $410 in extra costs, giving a net benefit of $2,210 per year.”)
	•	Table (showing all above figures in annual and monthly terms)
	•	Reset Behavior: All fields reset to defaults on page reload (no explicit reset button, no local storage).

⸻

Background Assumptions Tab (accessed via optional button/tab; hidden by default, but always editable)
	•	Editable fields, with default values:
	1.	Carbon Price (P): A$50/t CO₂-e
	2.	Total Covered Emissions (E): 466 Mt CO₂-e
	3.	Administrative Cost Rate (r): 0.10
	4.	Eligible Adult Population (N): 16,000,000
	5.	Child Share Factor (c): 0
	6.	Grid Emissions Factor (EFₑ): 0.0007 t/kWh
	7.	Gas Emissions Factor (EFg): 0.051 t/GJ
	8.	Petrol Emissions Factor (EFp): 0.0023 t/L
	9.	Pass-Through Rate — Electricity (PTₑ): 1
	10.	Pass-Through Rate — Gas (PTg): 1
	11.	Pass-Through Rate — Petrol (PTp): 1
	•	No extra help text/tooltips; show only clear labels and units.
	•	Changes update results instantly (live calculation).

⸻

Calculation Details Tab (read-only, hidden by default)
	•	Displays all intermediate calculations:
	•	Gross revenue, net revenue after admin, per-adult dividend, per-fuel extra costs, etc.
	•	No editable fields; display only.

⸻

3. Design and UX
	•	Single-page layout; all key inputs/outputs visible without scrolling.
	•	Tabs/buttons to switch between main calculator, background assumptions, and calculation details.
	•	Minimal, uncluttered interface; standard HTML, no color coding, no advanced styling.
	•	Responsive design for both desktop and mobile.
	•	Standard HTML form accessibility (labels, tab order, keyboard access).
	•	All outputs in AUD ($), using proper currency formatting.
	•	No download/print options; on-screen display only.
	•	No version/date in UI.
	•	No help popups/tooltips.
	•	No explicit reset button; defaults restored on reload.
	•	No language switching; English only.
	•	No data stored or shared. Privacy notice shown.
	•	Footer:

Model based on UNSW Australian Carbon Dividend Plan.  
Text, photos and graphics © Citizens’ Climate Lobby (CCL) Australia or used with permission. All rights reserved. Text available under Creative Commons NC SA licence.


	•	Privacy notice:

No data is saved or shared.



⸻

4. Architecture & Technology
	•	Frontend only: HTML, CSS, JS.
	•	External libraries (via CDN) permitted (e.g., Bootstrap for layout, but keep it minimal).
	•	No backend, no user accounts, no cookies/local storage.
	•	Modern browser support: Chrome, Firefox, Safari, Edge.
	•	No IE11 or legacy browser support.

⸻

5. Data Handling
	•	Inputs: All user data entered only in session, not persisted, not transmitted.
	•	Outputs: Calculated live in-browser only.
	•	No storage of personal data; see privacy notice.
	•	No analytics, tracking, or external API calls.

⸻

6. Calculation Logic

Background Calculations

Revenue and Dividend
	•	Gross revenue:
G = P \times E
	•	Net revenue:
R = G \times (1 - r)
	•	Annual dividend per adult:
D_{adult} = R / N
	•	Annual dividend per household:
D_{household} = (\text{adults} + c \times \text{children}) \times D_{adult}
	•	Monthly equivalents: divide annual by 12

Extra Household Cost

For each fuel:
	•	Extra cost per unit: \Delta p = P \times \text{EF} \times \text{PT}
	•	Annual cost: \Delta C = \text{Usage} \times \Delta p

Sum all (electricity, gas, petrol) for total extra cost.

Net Benefit
	•	Net benefit (annual): D_{household} - \text{Total extra cost}
	•	Net benefit (monthly): divide annual by 12

⸻

7. Error Handling
	•	Input validation: All inputs must be non-negative numbers; decimals allowed where appropriate.
	•	Show inline error (small red text) if value is invalid; block calculation until valid.
	•	Revert to default if user enters invalid value and leaves field.
	•	Handle division by zero gracefully in all calculations (e.g., if N set to zero, display “—” and prompt for correction).
	•	All outputs update instantly on any input change.

⸻

8. Testing Plan
	•	Functional testing:
	•	Test all combinations of user and background input changes.
	•	Verify calculations match sample scenarios (e.g., UNSW default example).
	•	Test live updating: any field change triggers output refresh.
	•	Test field validation and error messages.
	•	Test navigation between tabs/panels.
	•	Layout testing:
	•	Verify all content fits on a single screen on desktop and mobile.
	•	Check visibility and clarity of all outputs.
	•	Accessibility:
	•	Confirm standard keyboard navigation and form labels.
	•	Ensure readable font sizes on all devices.
	•	Browser compatibility:
	•	Test on latest Chrome, Firefox, Safari, Edge (desktop & mobile).
	•	Privacy:
	•	Confirm no data stored, cookies set, or network requests made after load.

⸻

9. Deliverables
	•	Standalone HTML file (or HTML + minimal CSS/JS files).
	•	Clear, readable code with comments for maintainability.
	•	Short inline documentation for calculation logic.
	•	All dependencies linked via CDN if used.
	•	Simple README if needed for future editing.

⸻

End of specification.
