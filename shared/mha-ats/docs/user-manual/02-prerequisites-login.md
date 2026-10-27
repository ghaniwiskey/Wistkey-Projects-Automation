# ATS web user manual: Prerequisites and login (HTA and SPF login pages)

Part of the CR12 web user manual (21 Sep 2026); index and source: README.md.

## Prerequisites to use ATS

Below are the requirements needed for ATS to run successfully:
- Operating System - Windows 8 or later
- Intranet - This application requires to be in the SPF Intranet VPN
- Zebra Printer Drivers
- Valid WOG ID (For account login)
- Valid account created in ATS (To be created by Agency Admin until IDMS is ready)
- Zebra Printer (For eRFID Tag printing)
- eRFID Scanner (For stocktaking)
Following point 3 above, the drivers must first be installed in the WOG laptop before it works with the Printer. Please refer to the steps below for installation guide:
- Click on Windows button and type “Software Centre” and launch the program.
[image]
Figure 5 - Software Centre Icon
- Click on the Applications tab and search for “Zebra”. Click and install the following program:
- SPF_BrowserPrint_1.3.1.445
- SPF_Zdesigner ZT411R Printer_8.6.5.26125
[image]
Figure 6 - Search and download drivers for printer installation
- For verification, click on the Installation status tab and search for “Zebra”. The following program status will be displayed as Installed:
- SPF_BrowserPrint_1.3.1.445
- SPF_Zdesigner ZT411R Printer_8.6.5.26125
[image]
Figure 7 - Verify Installation Status
- Launch the BrowserPrint.exe program from the following path:
- C:\Program Files (x86)\Zebra Technologies\Zebra Browser Print
[image]
Figure 8 - BrowserPrint icon
The following must be configured to initialise the Zebra ZT411 printer (each time) before printing the RFID tags in the ATS web application:
- Launch the BrowserPrint.exe program from the following path:
- C:\Program Files (x86)\Zebra Technologies\Zebra Browser Print
- Ensure that printer is powered up and USB cable is connected to the laptop.
- Click on the pointed arrow at the bottom right hand corner of the Windows taskbar to show the hidden icons. Right click on the Browser Print icon and select Settings.
- At Browser Print Settings, click Change and the “Select Default Device” will appear.
- Select the printer connected and Click on Set. The printer ID should appear in the Default Devices section.
[image]
Figure 9 - Zebra Printer Configuration

## Getting Started

### Login Page

#### HTA Login Page

- On the onboarding, you need to select an agency from list below:
- Remarks:
- - every agency has a different database

| Agency Name | Agency URL: |
|---|---|
| HTA | https://ats.hta.gov.sg/Account/Login (PROD) https://uat-ats.hta.gov.sg/Account/Login (UAT) |

- Single Sign On login feature is available on the web application where clicking on “WOG SSO” will redirect users straight to the dashboard. The main functions of the application are accessible though the left menu panel.
- Please be reminded to keep a lookout for Announcement as it contains important information released by the system administrator such as maintenance schedule or system availability updates.
[image]
- Then you can input username and password
[image]
- Once user log in, it will display the dashboard page below. At the top, you can see your current role, officer name and last login information. User can end the session by clicking on the logout button. [image]
[image]
- If you want to switch to the other roles that you are assigned to, you can click on the dropdown list from “Role” at the top right corner.
[image]

#### SPF Login Page

- On the onboarding, you need to select an agency from list below:
- Remarks:
- - every agency has a different database

| Agency Name | Agency URL: |
|---|---|
| SPF | https://ats.intranet.spf.gov.sg/Account/Login (PROD) <br> https://ats.intranet.spf.uat/Account/Login (UAT) |

- Single Sign On login feature is available on the web application where clicking on “WOG SSO” will redirect users straight to the dashboard. The main functions of the application are accessible though the left menu panel.
- Please be reminded to keep a lookout for Announcement at the header and footer as it contains important information released by the system administrator such as maintenance schedule or system availability updates.
[image]
Figure 10 - ATS Login Page
- Then you can input username and password
[image]
- Once user log in, it will display the dashboard page below. At the top, you can see your current role, officer name and last login information. User can end the session by clicking on the logout button.
[Officer Name][Officer Name] [image]
Figure 11 - ATS Dashboard view
- And if you choose SPF agency then the logo SPF will be appeared on the dashboard
[image]
- If you want to switch to the other roles that you are assigned to, you can click on the dropdown list from “Role” at the top right corner.
[image]
Figure 12 - ATS Role Switching
