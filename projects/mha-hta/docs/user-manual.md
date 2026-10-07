# ATS Web Application User Manual (CR12 onboarding, 21 Sep 2026)

Reference copy converted from `CR12_onboarding_Web Application User Manual_21_Sep_2026.docx` (author Dirga Putra). Text and tables only; `[image]` marks where the original has screenshots. Knowledge reference for testing MHA SPF; summary in `../context.md`.

Version Control
Document Information

| Prepared By | Jeremy Lee |
|---|---|
| Date Prepared | 1st August 2023 |
| Reviewed By | Stephanie Seow |
| Date Reviewed | 1st August 2023 |

Version History

| Date | Version No | Author | Reviewer | Description of Changes |
|---|---|---|---|---|
| 1st Aug 2023 | 1.0 | Jeremy Lee | Stephanie Seow | Creation of Document |

[image]
e-RFID Asset Tracking System (ATS)
Web Application User Guide
(This guide covers the Web Application only. For mobile application, please refer to
Mobile Application User Manual)

## Introduction

### Background

The Integrated Logistics Management System (iLMS) is currently being used for fixed asset management within MHA. The system poses several key constraints to managing assets such as no records of exact physical locations of fixed assets (i.e. Building, Level, Room), no asset verification module and transactions are tied to the cost centre level. These limitations lead to pain points such as having to:
Tag and maintain asset records manually (e.g. asset locations, photos using excel spread sheet.)
Conduct Fixed Asset Verification Exercise (FAVE) which is labour intensive using iLMS only.
Maintain sub-units’ transaction manually using excel spread sheet.
Therefore, the Enterprise Radio Frequency Identification (e-RFID) Asset Tracking System (ATS) is developed and introduced to ease and improve the overall fixed asset management process.
[image]
Figure 1 - Overview of ATS Asset Management Capabilities
The introduction of Enterprise Radio Frequency Identification (e-RFID) Asset Tracking System (ATS) helps to:
Digitalize the end-to-end asset management lifecycle: Further strengthening the governance of asset control.
Manage and maintain the full list of fixed assets and its relevant data: Reducing turnaround time to track the assets.
Streamline current processes in reporting and accounting of fixed assets during the annual FAVE and perform stocktake using RFID technology: Reducing manpower resources required for stocktake.
ATS shall perform the software functionalities stated below as part of the MHA/SPF asset management lifecycle:
Table 1 - Functions of ATS

| Modules | Software Functionalities |
|---|---|
| Asset Registration | Exact asset location (Building, Level, Room) <br> Assign asset ownership <br> RFID tag printing |
| Asset Assignment | Update asset location <br> Transfer asset ownership |
| Asset Verification | FAVE (Tracks open items) <br> Ad-hoc stocktake |
| Asset Retirement | Retire asset once it is updated in iLMS |

### External System Interfaces With ATS

[image]
Figure 2 - ATS and External Interfaces
Data from iLMS flows one-way to e-RFID ATS via a daily interface file. New updates from iLMS will be displayed on ATS on the next working day. For example, updates in iLMS on 1st Jan between 0000H and 2359H will be updated in ATS on 2nd Jan at 0000H as the updates will flow to ATS at every 0000H of the next day. The updated data include the following:
Asset Master Record (Asset ID, Description, Serial Number, NBV etc.)
Asset Capitalization (New Asset)
Asset Loan (Loan Details)
Asset Maintenance (for Vehicles – HOVR)
Asset Disposal (Retirement Date, Disposal Date)
Asset Transfer (Change in Cost Centre)

### Asset Status Definition

Every asset in ATS have their own statuses and the table below provides a definition of the asset status:
Table 2 - Asset Status Definition

| S/N | Asset Cycle Stage | Asset Status | Description |
|---|---|---|---|
| 1 | Registration | New | New asset in ATS <br> Existing asset in ATS, and transferred from other HTDs |
| 2 | Registration | Transfer | Transfer from one SPF cost centre to another SPF cost centre |
| 3 | Registration | Progress | Assigned to Fixed Asset Liaison Officer (FALO) to update asset location |
| 4 | Registration | Rejected | Asset should not be capitalized |
| 5 | Assignment / Verification | Available | Business as usual state |
| 6 | Assignment / Verification | Loan | For STO Loan |
| 7 | Assignment / Verification | Maintenance | Track ‘HOVR’ Status |
| 8 | Retirement | Retired | Track Date of Retirement |
| 9 | Retirement | Disposed | Track Date of Disposal |

### User Roles Definition

- In ATS, there is a pre-defined list of roles, and each role will be assigned with pre-defined access rights. For more details on role management information, please refer to Part E, Point 3 onwards.
Table 3 - User Roles Definition

| S/N | Role Name (Long) | Role Name (Short) | Remarks |
|---|---|---|---|
| 1 | Agency Administrator | Admin | SPF A&F HQ-Level |
| 2 | HQ Approving Officer | HQ AO | SPF A&F HQ-Level |
| 3 | HQ Fixed Asset Liaison Officer | HQ FALO | SPF A&F HQ-Level |
| 4 | Unit Approving Officer | UAO | Unit-Level |
| 5 | Unit Resource Officer | URO | Unit-Level |
| 6 | Unit Logistics Officer 1 | Logs1 | Unit-Level |
| 7 | Unit Fixed Asset Liaison Officer | FALO | Unit-Level |
| 8 | Unit Verification Team IC | VET IC | Unit-Level |
| 9 | Unit Stocktaker | Stocktaker | Unit-Level |
| 10 | Unit Enduser | Enduser | Unit-Level |

- Below is a reference of typical roles being assigned within units:
[image]
Figure 3 - Typical Roles Assigned Within Units

### ATS Function Overview

The figure below shows an overview of the modules and sub-modules in ATS web application:
[image]
Figure 4 - ATS Web Application Overview
Please refer to the following modules below to further understand the features that are hosted on the web application:
Dashboard (To be released soon)
Asset
Stocktake (Adhoc Stocktake to be released soon)
Report (More reports to be released soon)
Settings
User (Applicable to Agency Admin role only)

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

## Main Functions

### Asset Module

The Asset module consists of 7 sub modules:
- Asset Listing: To generate asset listing by cost centre, location, etc and to allow users to view the asset details.
- Asset Registration: To register or reject a new asset that was newly added/transferred in iLMS.
- Asset Assignment: To transfer asset to another assignee or update asset location.
- Asset Rejection: To reinstate wrongly rejected asset.
- Asset Retirement/Disposal: To track assets that are retired or scheduled for disposal.
- Asset Print Tag: To re-print eRFID asset tags for assets with faulty/missing tags.
- New Asset: To report potential assets that is not registered in ATS.

#### [Asset Listing] What are the assets in my unit?

- All asset details are viewable using Asset Listing. Assets Listing can be exported into Report using the Report module (See Part C).
- To display the full list of asset listing. Click on Asset, followed by Listing.
[image]
Figure 13 - ATS Side Menu, to select Listing
- The module will display the full list of assets along with the search bars and filter options.
[image]
Figure 14 - Asset Listing Page
- Asset is searchable by setting the filters accordingly or inputting the keywords such as Asset ID, Asset ID 2, Serial Number or Asset description. The pre-defined filters are displayed below:
[image]
Figure 15 - Filter Option 1 is Cost Centre
[image]
[image]
Figure 16 - FIlter Option 2 is Group/NPC/Base
[image]
Figure 17 - Filter Option 3 is Asset Category
[image]
Figure 18 - Filter Option 4 is Status
[image]
- Clicking on the asset will display the full asset details. Both Asset ID or Asset Description are clickable.
- clickable areaclickable area clickable areaclickable area [image]
Figure 19 - Clickable area in Asset Listing
- An example of Asset Details is shown below. It displays details such as the Asset ID, Asset Status, Serial No., Capitalized on information, Asset Category, Asset Description, Cost Centre and 6 tabs of additional data which comprise of Main Data, Location, Ownership, Loan, Maintenance and Retirement. Exact data information in each tab can be viewed in Figures 20 to 25.
[image]
Figure 20 - Asset Details Page with Main Data Tab
[image]
Figure 21 - Asset Details Page with Location Tab
[image]
Figure 22 - Asset Details Page with Ownership Tab
[image]
Figure 23 - Asset Details Page with Loan Tab
[image]
Figure 24 - Asset Details Page with Maintenance Tab
[image]
Figure 25 - Asset Details Page with Retirement Tab
- For uploading of photo images, user can click on the pen icon as shown in figure below.
[image]
[image]
Figure 26 - Asset Listing, Photo upload
- In this pop-up window, user will be able to update the image of the asset. There is a limit of 5 images per asset and user can select any one of the five images to set as the default photo. In addition, user can use the delete button to delete photo that is no longer relevant.
[image]
Figure 27 - Photo upload with existing image
- To upload an image, click on an empty slot followed by the pen icon. Browse the folder and choose the image. Please take note of the image format (.png, .jpg, .jpeg) allowed and the file size limit (<3MB) as stated. Click on Upload to complete the action.
[image]
Figure 28 – Adding image to Photo upload

#### [Asset Registration] How to register my assets?

- When there is new fixed asset newly capitalized in iLMS, ATS will receive the data on the next working day onwards and user will be required to register the assets in ATS. Another scenario that requires registering of asset in ATS would be a request to transfer assets from one cost centre to another.
- There will be email notifications generated by the system and send to all LOGS1 and FALO highlighting the assets pending registration on every 1st and 15th of the month as a reminder. UAO and URO are included in the CC list for awareness.
- To begin registering of asset, click on Asset, followed by Registration.
[image]
Figure 29 - ATS Side Menu, to select Registration
- There are a total of 7 steps for Registering of Asset. To register an asset, select Register and click on Next.
[image]
- The 2nd step would be selection of asset to register. It will display the list of assets whose asset status is either NEW or TRANSFER. Upon selection of asset, the top will display the number of asset selected. Select the asset(s) to register and click Next.
- Do note that the checkbox beside the ASSET header is a select all function and this is available throughout ATS for any asset selection. System does not allow page selection currently.
[image]
[image]
- The 3rd step would be reviewing the asset selected. The review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- The 4th step requires user to fill in the Assign Asset (if applicable), Asset Location and Group/NPC/Base accordingly.
- For complete registration, Group/NPC/Base and Postal code will be mandatory and
- Either one of the fields for Block/Level/Room No./Remarks must be filled.
- For partial registration, Group/NPC/Base and Postal code will be mandatory while t
- he fields for Block/Level/Room No./Remarks can be left empty if user does not know the information. However, do note that if Block/Level/Room No./Remarks is left empty, the status of these assets will become PROGRESS and user will be required to complete the registration via Complete Register module.
- For the Assign Asset (Assignee) field, if the user left this field empty, asset will be assigned to the user.
- If the user assigned the asset to a FALO, then the asset will be assigned to the FALO after the register process is completed. In the case of partial registration, FALO will be required to follow-up via Complete Register module. When this happen, system will trigger an email notification and inform the assignee (FALO).
[image]
- The 5th step requires user to indicate the Asset Sensitivity. When Asset Sensitivity is set to YES, photo upload function will be disabled for this asset (See Part I, steps 6 to 8 for photo upload function).
[image]
- The 6th step is to indicate if the asset would require tag printing. If yes, then indicate RFID Tag Type as either ASSET or FILE. If no, then Tag Type will automatically be selected as NA. Click Next once done.
[image]
- If Tag Printing is selected as YES, a prompt to start tag printing will appear. Ensure printer is connected to the laptop if you want to start printing now.
- If selection is YES and printer is not connected, it will display the result of the Asset Registration followed by a list of asset tags that was not printed.
- If selection is NO, it will display the result of the Asset Registration only.
- To re-print the tags in the future, user can use the Print Tag module.
- The result of Asset Registration will be either Asset Registration Complete or Incomplete. If it is incomplete, it means owner must access the Complete Register to complete the process.
[image]
Figure 36 - Asset Registration, Register Step 6 confirmation

#### [Asset Registration] How to complete register for my assets?

- Owner of asset must perform Complete Register when partial registration took place during asset registration. This means during the registration process, the fields for Block/Level/Room No./Remarks was left empty due to lack of information and this requires the owner of the asset to complete the registration by filling in the missing information.
- To complete asset register process, click on Asset followed by Registration.
[image]
Figure 37 - ATS Side Menu, to select Registration
- There are a total of 5 steps to Complete Register. Select Complete Register and click on Next.
[image]
- The 2nd step is the selection of assets. After selecting Complete Register, all incomplete registered assets will be displayed here whose asset status is PROGRESS. Select the asset(s) to complete register and proceed.
[image]
- The 3rd step would be reviewing the asset selected. Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- Fill in location details. Group/NPC/Base and Postal code will be mandatory while either one of the Block/Level/Room No./Remarks must be filled.
Located near entrance.Located near entrance. [image]
- The following screen will be shown when the Asset Registration is completed. For tag printing of asset under partial registration, please use the Print Tag module.
- Once FALO complete the asset registration of the corresponding transaction and asset status changes from "Progress" to "AVAILABLE", system will trigger an email notification back to LOGS1. The objective is to alert the LOGS1 that action has been completed by the other party.
[image]
[image]

#### [Asset Registration] How to reject the assets?

- Rejection of asset is needed when asset is wrongly capitalized or when it is transferred to the wrong cost centre.
- To reject assets, click on Asset, followed by Registration.
[image]
Figure 43 - ATS Side Menu, to select Registration
- There are a total of 5 steps to Reject an asset. Select Reject and click on Next.
[image]
- The 2nd step would be selection of assets. It will display the list of assets whose asset status is either NEW or TRANSFER or PROGRESS. Select the asset(s) to register and click on Next.
[image]
- The 3rd step would be reviewing the asset selected. The Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- The 4th step would be inputting the reason. Select Reject Reason from the dropdown list.
[image]
If reason selected is Others, it is mandatory to insert the reason in the open text box. Note that there is a limit of 250 characters.
[image]
Figure 48 - Asset Registration, Reject Step 4, Others
- The 5th step is the result. The following screen will be shown when the assets are rejected.
[image]

#### [Asset Assignment] Where to view and act on the assignment transactions?

- The Assignment module is mainly used by the UAO (mainly to view only), URO, LOGS1 and FALO. Using this module, user can view the transaction and perform assignment of assets from one user to another based on pre-defined approval logic and updating of asset location by using relocate. These pre-defined approval logics are:
- Assignment from LOGS1 to LOGS1, will need approval from URO.
- Assignment from LOGS1 to FALO, will be auto approved by system.
- Assignment from FALO to FALO, will need approval from LOGS1.
- Assignment from FALO to LOGS1, will need approval from LOGS1.
- LOGS1 can assign upwards from FALO/Enduser to himself, will be auto approved by system.
- FALO can assign upwardsfrom Enduser to himself, will be auto approved by system.
- Relocation transactions will be auto approved.
- When assignment from LOGS1 to LOGS1 or FALO to FALO is created, it will trigger an email notification generated by the system and send to one level higher to seek for approval. Also system will trigger an email when the assignment is approved to alert that action has been completed by the approving officer.
- To view the assignment transactions. Click on Asset, followed by Assignment.
[image]
Figure 50 - ATS Side Menu, to select Assignment
- This page will display the list of assignment transactions captured. Please choose transaction status indicated as “Submitted” from the list and click on the pencil icon on the right to perform any actions to the existing transactions. All transactions are viewable using the pencil icon on the right.
[image]
Figure 51 - Asset Assignment, Main Page
- For URO/LOGS1, Approve/Reject button will be shown on the top right corner if the current transaction status is SUBMITTED and requires your action. Note that this is based on pre-defined approved logics discussed in Point 1.
[image]
Figure 52 - Asset Assignment, Transaction with Approve/Reject Button
- For the owner of assignment transaction, the Cancel button will be shown on the top right corner if the current transaction status is SUBMITTED. The status will be reflected as CANCELLED once action is confirmed.
[image]
[image]
Figure 53- Asset Assignment, Transaction with Cancel Button

#### [Asset Assignment] How to create assignment transactions for assigning or relocating of assets?

- Assignment module can be used on multiple scenarios. This is especially when user is leaving the organisation, then user is required to perform asset assignment to other staying officers before leaving the organisation. If the transfer did not happen in time, system can allow same level user to perform the transfer of assets to themselves with approval. The pre-defined approval logics can be found in Part V, Point 1.
- Below are other common scenarios that require assignment module:
- Transferring of asset ownership between LOGS1
- Assigning of asset ownership from LOGS1 to FALO
- LOGS1 assigning back of asset ownership from FALO/Enduser to himself
- Transferring of asset ownership between FALO
- Assigning of asset ownership from FALO to LOGS1
- FALO assigning back of asset ownership from Enduser to himself
- Updating of asset location.
- To start off the process to create or start a new assignment transaction to transfer/assign assets. Click on Asset, followed by Assignment.
[image]
Figure 54 - ATS Side Menu, to select Assignment
- At the Main Page, click on “Create” to create new assignment transaction.
[image]
Figure 55 - Asset Assignment, Main Page
- There are a total of 5 steps for either Assign or Relocate (Figure 56) and there are a total of 6 steps for Assign & Relocate (Figure 57).
- Select either Assign or Relocate or Assign & Relocate and click on Next.
[image]
[image]
- The 2nd step will display the list of assets whose assets are not part of any ongoing transaction. Select the asset(s) by clicking on the checkboxes on the left and click on Next to proceed.
[image]
- At this step you can also filter the status. There’s an available, loan, maintenance or transfer
[image]
Figure 59 - Asset Assignment, Filter Status
[image]
- The 3rd step would be reviewing the asset selected. The Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- Moving on to the 4th step for Assign or Assign & Relocate, user can select the Role followed by the Assignee accordingly. For user using role as FALO, user can select FALO or ENDUSER for the role. For user using role as LOGS1, user can select LOGS1, FALO or ENDUSER for the role. Assignee will display a list of names who belong to the role selected. See Figure 60.
[image]
- Moving to the 4th step for Relocate or 5th step for Assign & Relocate, user must fill in the location details. Group/NPC/Base and Postal code are mandatory while either one of the Block/Level/Room No./Remarks must be filled.
[image]
- Moving to the last step (5th / 6th), transaction outcome will be displayed accordingly.
[image]
[image]

#### [ Asset Assignment] How to recall the asset?

- To recall the asset, you need change role to “LOGS1” first
[image]
- Then you can go to assign module then click “create” button
[image]
- Choose “Assign” type then click “Next” button
[image]
- Search the assets you want to recall. User can search the assets want to recall and User can use the filters to make their search easier. There are 6 filters can User use it: All Cost Centre, Asset Category, Assignee (LOGS1), Assignee (FALO), Group/NPC/Base and Status
[image]
- For example, we will recall the assets from “Gary Thong” then to make easier search the assets we can fill the assignee (LOGS1) filter with “Wong Pui Lai Annie” because we use account Cleary Teo and fill the Assignee (FALO) filter with “Gary Thong” then select the assets, then click “Next” button
[image]
- You can review the assets first, then you can click “Next” button
[image]
- After review the assets you can choose role to “Logistics Officer1” and user to yourself, because we use account “Wong Pui Lai Annie” then we select “Wong Pui Lai Annie”
[image]
- Then finish, after it approved the FALO ownership of that asset will be empty
[image]

#### [Asset Assignment] How to return the asset?

- To return the asset, you need change role to “Fixed Asset Liaison Officer (FALO)” first
[image]
- Then you can go to assign module then click “create” button
[image]
- Choose “Assign” type then click “Next” button
[image]
- Search the assets you want to return. User can search the assets want to recall and User can use the filters to make their search easier. There are 6 filters can User use it: All Cost Centre, Asset Category, Assignee (LOGS1), Assignee (FALO), Group/NPC/Base and Status
[image]
- For example, we will return the assets to “Wong Pui Lai Annie” then to make easier search the assets we can fill the assignee (LOGS1) filter with “Wong Pui Lai Annie” and fill the Assignee (FALO) filter with “Gary Thong” then select the assets, then click “Next” button
[image]
- You can review the assets first, then you can click “Next” button
[image]
- After reviewing the assets, you can choose role to “Logistics Officer1” and assignee to “Wong Pui Lai Annie”, because we want return the asset to “Wong Pui Lai Annie” then click “Submit” button
[image]
- Then finish, after it approved the FALO ownership of that asset will be empty
[image]

#### [Asset Rejection] How to reinstate rejected assets?

- Rejected asset can be reinstated if it was rejected erroneously during the registration process (See Part IV).
- To reinstate rejected asset, click on Asset, followed by Rejection.
[image]
Figure 64 - ATS Side Menu, to select Rejection
- There are a total of 5 steps for Reinstate. Select Reinstate followed by Next.
[image]
- The 2nd step will display the list of assets whose assets status is REJECTED. Select the asset(s) and click Next to proceed.
[image]
- The 3rd step would be reviewing the asset selected. The Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- Moving to the 4th step for inputting reason. Select Reason from the dropdown list for reinstatement.
[image]
If reason selected is Others, it is mandatory to insert the reason in open text box. Note that there is a limit of 250 characters.
[image]
Figure 69 - Asset Rejection, Reinstate Step 4, Others
- The 5th step will display the reinstatement outcome. User can click close or click on registration to proceed to continue with asset registration.
[image]

#### [Print Tag] How do I re-print my eRFID tag?

- To reprint RFID tag of existing assets, click on Asset followed by Print Tag.
[image]
Figure 71 - ATS Side Menu, to select Print Tag
- There are a total of 5 steps to reprint RFID Tag. To begin, choose "Reprint RFID Tag" and click on Next.
[image]
- The 2nd step will display the list of assets which the tag type is either ASSET or FILE. Select the asset(s) to reprint, then click Next.
[image]
- The 3rd step would be reviewing the asset selected. The Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- The 4th step is for user to input the reason for reprinting. There is a list of reasons to choose from the dropdown list. Examples of pre-defined reasons are Defaced, Faulty Tag, Lost, etc.
[image]
If reason selected is Others, it is mandatory to insert the reason in open text box. Note that there is a limit of 200 characters.
[image]
Figure 76 – Print Tag, Reprint RFID Tag Step 4, Others
The last step will display the outcome for tag re-printing.
[image]

#### [Asset Retirement/Disposal] How to view the retired assets and update the disposal date?

- When Date of Retirement is updated to an asset in iLMS, ATS will receive the information on the next working day and that asset status will be updated to Retired. When asset status has changed to retired, there is a need to indicate the disposal date once confirmed. However, if disposal date is provided in iLMS, then the updated disposal date will be overridden by iLMS.
- To view retired or disposed asset details, click on Asset, followed by Retirement/Disposal.
[image]
Figure 78 – ATS Side Menu, to select Retirement/Disposal
- This page will display the list of assets for asset status listed as DISPOSED or RETIRED. We can only update the disposal date for RETIRED assets. There is a pencil icon on the right to click on to update the disposal date. After that, the asset status will be changed to DISPOSED. There is no more action required for DISPOSED assets so there is no pencil icon in the Actions for DISPOSED assets.
[image]
Figure 79 – Asset Retirement/Disposal, Main Page
- Input the disposal date accordingly. If the disposal date is a future date, asset status will be updated to DISPOSED only upon the disposal date. If the disposal date is a past date, asset status will be updated to DISPOSED immediately. Click on Submit to proceed.
[image]
Figure 80 – Asset Retirement/Disposal, Update Disposal Date
- Update outcome will be displayed accordingly.
[image]
Figure 81 – Asset Retirement/Disposal, Update Success Message

#### [New Asset] How to view the reported new assets?

- For user to report any potential fixed assets that are not identified in ATS, user can use this New Asset module. When such a scenario occurs, it will trigger an email notification generated by the system to all LOGS1 and Vet IC.
- To view reported new asset, Click on Asset, followed by New Asset.
[image]
Figure 82 – ATS Side Menu, to select New Asset
- This page will display the list of reported items that could potentially be a fixed asset. To view the details of the reported item, click on the pencil icon on the right in the Actions column shown below.
[image]
Figure 83 – New Asset, Main Page
- For URO/LOGS1/FALO, the Cancel and Close button will be shown on the top right corner if the status is OPEN. For other roles, only the Cancel button will be shown.
[image]
[image]
Figure 84 – New Asset, Details Page
- When the Close item button is selected, select the reason for closing the item. There is a list of reasons to choose from the dropdown list. For example, there is Asset Pending Capitalisation, Not an Asset, etc.
[image]
Figure 85 – New Asset, Reasons
If reason selected is Others, it is mandatory to insert the reason in open text box. Note that there is a limit of 200 characters.
[image]
Figure 86 – New Asset, Reasons, Others
- Once reason is filled and submitted, the case of reported new asset will be reflected as closed.
[image]
Figure 87 – New Asset, Closing Confirmation Message
- Or you can click cancel item
[image]
- When you click cancel item, select the reason for cancel the item. There is a list of reasons to choose from the dropdown list. For example, there is Mistaken as Asset, etc.
[image]
- Or you can select Others, it is mandatory to insert the reason in open text box. Note that there is a limit of 200 characters.
[image]
- Once reason is filled and submitted, the case of reported new asset will be reflected as cancelled.
[image]
[image]

#### [New Asset] How to report potential new assets?

- The New Asset module is for user to report any potential fixed assets that are not registered in ATS.
- To report potential new asset, click on Asset, followed by New Asset.
[image]
Figure 88 – ATS Side Menu, to select New Asset
- This page will display the list of reported items that could potentially be a fixed asset. To create/report a new asset, select the Create Button.
[image]
Figure 89 – New Asset, Main Page
- There are a total of 5 steps to report potential new assets. To begin, select “Report New Asset”, then click Next.
[image]
- The 2nd step is to fill in the relevant asset details with cost centre as the mandatory field. Click on Next to proceed.
[image]
- The 3rd step is to fill in the location details. Postal code is mandatory while either one of the Block/Level/Room No./Remarks must be filled. Click on Next to proceed.
[image]
- Moving to the 4th step, photo upload is required for new asset. This is mandatory as the photo will assist reviewer in identifying the item.
[image]
- The last step will display the result for potential new asset reported.
[image]

### Stocktake Module

- Stocktake module is used for annual FAVE which usually takes place in the Q3/Q4 of the year. When FAVE stocktake is generated, user can access the module to start working on the updates.
- The workflow of FAVE will begin with Agency Admin triggering the FAVE to be generated. Once generated, VET IC can assign stocktaker to the assets (Part I) and export the FAVE stocktake for reference (Part II). Stocktaker will then perform sighting using the ATS mobile application. Submitted result will be displayed in the FAVE module for VET IC to do the verification (Part III). System will perform checks on sighting results daily at 11pm and send Vet IC email notification once 100% sighting is detected. Once all assets are sighted, VET IC can proceed to submit the FAVE to the next level (URO) for approval which URO will receive a system triggered mail. UAO will review and approve the submission for URO and HQAO will review and approve the submission for UAO. ATS will generate email notifications to the next level of approval as a form of reminder until it reaches the last level of approval. The final agenda left to do after FAVE is to follow up on the open item raised during FAVE. Once the open item is addressed, user can use the Stocktake follow up module to indicate the completion for record purpose (Part IV).
- Users who can access the FAVE are HQAO, UAO, URO, LOGS1, FALO and VETIC. However, HQAO, UAO, URO, LOGS1 and FALO will mainly use it for viewing and only HQAO, UAO, URO can perform approvals upon FAVE submission.
- In ATS, FAVE prefix has a standard of FAVE Fyaa-bbcc. An example of the FAVE prefix is FAVE FY23-2001 for FY23.
- Aa is defined as the financial year. E.g. 23.
- Bb is defined as the pre-defined agency code. For SPF, it is 20.
- Cc is defined as the running number. It will reset and start with 01 for every financial year.

#### [FAVE] How to assign Stocktaker in FAVE? (VET IC Only)

- Function to be used by VET IC during FAVE to assign stocktaker to conduct stocktake for FAVE.
- To assign stocktaker, click on Stocktake, followed by FAVE.
[image]
Figure 95 – ATS Side Menu, to select FAVE
- Select the FAVE number by clicking on the pencil icon on the right in the Actions column.
[image]
[image]
Figure 96 – FAVE, Main Page
- Select ASSIGNMENT and the list of assets registered for the stocktake will be displayed.
[image]
[image]
Figure 97 – FAVE, Assignment Page
- Select Asset(s) then click “Assign Stocktaker” to assign the assets to specific stocktaker. However, assignment of stocktaker is not mandatory. Stocktaker can only see the list of assets assigned to him in the mobile application.
[image]
[image]
Figure 98 – FAVE, Assignment Page
- At select action part, you can choose to select current page, select all, deselect current page or deselect all. This makes easier for you to select assets
[image]
Figure 99 – FAVE, Assignment Page, Select Action
- Select the stocktaker from the dropdown list accordingly. Click on Submit to proceed.
AssigneeAssignee [image]
Figure 100 – FAVE, Assignment Page, Assign
- The stocktaker will be assigned to the selected asset once submitted is clicked.
[image]
Figure 101 – FAVE, Assignment Page, Assign Confirmation Message

#### [FAVE] How to export Stocktake from FAVE?

- Exporting of FAVE stocktake can be useful at the start of the FAVE to track the assets involved in the stocktake.
- To export FAVE report, click on Stocktake followed by FAVE.
[image]
Figure 102 – ATS Side Menu, to select FAVE
- Select the FAVE number by clicking on the pencil icon as shown below.
[image]
[image]
Figure 103 – FAVE, Main Page
- Click on the Export button to download the FAVE data.
[image]
Figure 104 – FAVE, Summary Page

#### [FAVE] How to update Stocktake details in FAVE? (VET IC and URO only)

- At the beginning of FAVE, updating of stocktake details can only be performed by VET IC using the web application. Once stocktaker submitted the sighting result via ATS mobile application, VET IC can use this function to view and make any updates if necessary.
- Once VET IC submitted the FAVE to URO for approval, URO will unlock the approval buttons and feature to update stocktake details.
- For HQAO, UAO and LOGS1, it will be used for monitoring and any changes will require the assistance of VET IC or URO to amend.
- To check or perform update for assets details captured during FAVE, click on Stocktake followed by FAVE.
[image]
Figure 105 – ATS Side Menu, to select FAVE
- Select the FAVE number to be updated by clicking on the pencil icon on the right in the Actions column.
[image]
[image]
Figure 106 – FAVE, Main Page
- Select DETAILS for the list of assets registered for the stocktake to be displayed.
[image]
Figure 107 – FAVE, Details Page
- Select Asset(s) by clicking on the checkbox(es) on the left. Click on “Update Result” to verify/update the details.
[image]
[image]
Figure 108 – FAVE, Details Page
- For single selection of asset in previous step, existing sighting results will be pre-loaded for user to perform verifications. For multiple selection of assets in previous step, default values will be loaded for users to perform updates. See both figures below for examples.
- User can make changes to 5 fields (Sighted Result, Asset Condition, HTD Follow-up, Correct Location, Remarks). Sighted Result and HTD Follow-up are mandatory fields and HTD Follow-up will be automatically mapped based on Sighted Result and Asset Condition’s input. The mapping is aligned to FSSC’s guideline.
[image]
[image]
Figure 109 – FAVE, Details Page, Update Result with Existing Values
[image]
Figure 110 – FAVE, Details Page, Update Result with Default Values
- After Submission, the stocktake result for the selected assets will be updated.
[image]
Figure 111 – FAVE, Details Page, Update Result, Confirmation Message
- ATS allows batch update of sighting result by using the Import Working Result. This is useful for items without RFID tags and user can use it to perform batch sighting updates instead of updating one by one. Sighting results will be defaulted to Sighted and condition will be defaulted to Working when using this function.
[image]
[image]
Figure 112 – FAVE, Details Page
- There are two buttons available in this function. Import Template allows user to download the template required to use this function and Excel file button allows user to upload the completed template. Once the file has been uploaded successfully, the table below will display the asset IDs that were uploaded. Press on Import button below to complete the process.
[image]
Figure 113 – FAVE, Details Page, Import Working Result
- The default state of template file display only Column A1 (LMSAssetID) which is the default header and user just need to update the Asset ID below the header (Column A2 onwards) as shown below. Reminder that sighting results will be defaulted to Sighted and condition will be defaulted to Working when using this function.
[image]
Figure 114 – FAVE, Details Page, Import Working, Import Template
- Once the file is selected, the asset ID should display accordingly on the screen. Click on Import button to complete the process and the successful message will be displayed.
[image]
Figure 115 – FAVE, Details Page, Import Working Result, Success
[FAVE] How can stocktaker update the stocktake results?

#### [FAVE] How to update a new location in Stocktake details in Fave

- First, follow the steps above on how to update Stocktake details in FAVE (VET IC and URO only) until you reach the update result section.
- If you want to change new location, you need a condition like this, Sighted Result is SIGHTED and correct location is incorrect location, then field for new location will be appear.
[image]
Figure 116 - FAVE, SIGHTED condition and incorrect location, new asset location will be appear
[image]
Figure 117 – FAVE, New Asset Location field appear
- After Submission, the stocktake result for the selected assets will be updated.
[image]
Figure 118 - FAVE, Details Page, Update Result, Confirmation Message

#### [Follow up] How to approve FAVE?

- If you want submit approval FAVE, then you can open the FAVE, then click fave item on the list
[image]
- Flows for approval is you need submit from VET(Verification Team IC/2IC) role first then URO (Unit Resource Officer), and last is UAO (Unit Approving Officer). Then you can click submit
[image]
- Then click yes on the dialog confirmation
[image]
- Once submit success then dialog success will be appear
[image]
- Then status SUBMITTED will be appear on the details
[image]
- If you use URO role then buttons Submit and Reject will be appear
[image]
- If you click submit, the flow will be same like VET role, but if you click Reject you need submit the reason, you select by drop down
[image]
- Or you can click others, It is mandatory to add remarks for this option
[image]
- Once rejected successful then the status on the details will be change to rejected
[image]
- Then every submit or reject or approval this will send email trigger, for example when Vet IC submit FAVE to URO or URO submit FAVE to UAO, Vet IC and URO must be in the email recipient/cc, this is including the rejection and approval.
[image]
- List of FAVE email triggers :
- - Vet IC submission: recipient is URO - URO submission: recipient is UAO and CC Vet IC
- - URO rejection or approval: recipient is Vet IC and CC URO
- - UAO rejection or approval: recipient is URO and CC UAO

#### [Follow up] How to follow up on outstanding Stocktake items?

- Once FAVE is submitted, there could be follow-up actions required. These items that require follow-up actions can be exported in a report format if required (See Part C).
- To view the follow-up actions required, click on Stocktake followed by Follow up.
[image]
Figure 119 – ATS Side Menu, to select Follow up
- There are a total of 4 steps for Stocktake Follow up. To begin, select “Close Item” and click on Next.
[image]
- The 2nd step will load the list of assets pending follow up. Choose the asset(s) by clicking on the checkbox(es) on the left. Click on Next to proceed.
[image]
[image]
- The 3rd step would be reviewing the asset selected. The Review tab will display the list of selected assets. If there is no issue, click on Next to proceed to the 4th step.
[image]
- Lastly, the follow up status of the selected asset will be closed.
[image]

#### [FAVE(HQ)] How to view and export Stocktake in FAVE(HQ)? (HQAO and HQFALO only)

- As HQAO and HQFALO are required to have the overview of FAVE for all cost centres along with information on cost and value, this module will be useful to them. Using FAVE(HQ) will achieve the objective.
- To export the stocktake listing at SPF-level, click on Stocktake followed by FAVE(HQ).
[image]
Figure 124 - ATS Side Menu, to select FAVE(HQ)
- Select the FAVE number by clicking on the pencil icon on the right in the Actions column.
[image]
[image]
Figure 125 – FAVE(HQ), Main Page
- Selecting the individual cost centre will display their respective data below in the overview page. For the Export button, it will allow user to download the FAVE(HQ) data based on the selected cost centre.
Select cost centre to view individual data here.Select cost centre to view individual data here. [image]
Figure 126 – FAVE(HQ), Overview Page

### Stocktake Adhoc Module

#### [Adhoc] How to create stocktake adhoc one-off?

- Function to be used by VET IC during FAVE to assign stocktaker to conduct stocktake for FAVE.
- To create Adhoc, click on Stocktake followed by Adhoc Setup
[image]
Figure 127 – Adhoc, Adhoc Setup
- Then click on create button
[image]
Figure 128 – Adhoc, Create Adhoc
- Then click one-off for Stocktake Frequency
[image]
- After that you can choose asset selection, you can choose manual or random asset, if you choose manual then you need to select the asset manual
[image]
[image]
- Fill the stocktake name and Remarks is optional then click next
[image]
- If you choose manual, then you need to select asset manual on the tab asset
[image]
- If you choose random, then you can click search button to start the random asset, or you can filter by Asset Category, Assignee, Group/NPC/Base, Status, Max Asset or Max Group/NPC/Base
[image]
- Then you click next button
[image]
- After that you can review the assets you have selected, then you can click submit button if already reviewed
[image]
- Then create stocktake adhoc is successfully
[image]
- Once you created adhoc, you can check the adhoc yo’ve created on Adhoc Listing
[image]

#### [Adhoc] How to create stocktake adhoc periodic?

- To create Adhoc, click on Stocktake followed by Adhoc Setup
[image]
Figure 129 – Adhoc, Adhoc Setup
- Then click on create button
[image]
Figure 130 – Adhoc, Create Adhoc
- Then click periodic for Stocktake Frequency
[image]
- After that you can choose asset selection, you can choose manual or random asset, if you choose manual then you need to select the asset manual but if you choose random asset then the assets will selected random
[image]
[image]
- You can choose recurrence type BI-ANNUALLY, MONTHLY, QUARTERYL or WEEKLY
[image]
- After you choose recurrence type then fill number of recurrence, start date, stocktake name and remarks is optional then click next button to the next step
[image]
- If you choose manual, then you need to select asset manual on the tab asset
[image]
- If you choose random, then you can click search button to start the random asset, or you can filter by Asset Category, Assignee, Group/NPC/Base, Status, Max Asset or Max Group/NPC/Base
[image]
- Then you click next button
[image]
- After that you can review the assets you have selected, then you can click submit button if already reviewed
[image]
- Then create stocktake adhoc is successfully
[image]
- Once you create adhoc, you can check the adhoc yo’ve created on Adhoc Listing

#### [Adhoc] How to update result Stocktake Adhoc?

- Open Adhoc Listing on Stocktake
[image]
- Click action icon to update stocktake adhoc
[image]
- Click details tab
[image]
- Select asset and click update result button
[image]
- You can update Sighted result or add remarks, once you finished you can click submit button to update result
[image]
- Update successfully
[image]

#### [Adhoc] How to Assign Stocktaker in Stocktake Adhoc?

- Open Adhoc Listing on Stocktake
[image]
- Click action icon to update stocktake adhoc
[image]
- Click assignment tab
[image]
- Select asset and click assign stocktaker
[image]
- Choose stocktaker want to assign the asset
[image]
- You can search the stocktaker and then click stocktaker
[image]
- After you choose the stocktaker you can click submit then the stocktaker has been assigned
[image]

### Report Module

- Report module will allow user to export data from ATS into excel format locally. The data can later be used for further tracking or analysis or reviewing purposes.

#### [Asset Listing (Detailed) Report] How to generate asset listing report?

- To generate the report to view the full list of assets of your unit, Click on Report followed by Asset Listing (Detailed).
[image]
Figure 131 - ATS Side Menu, to select Report, Asset Listing (Detailed)
- The page will load the list of assets. However, this list will exclude assets that are retired, disposed, or do not have a capitalization date. To view assets that are retired or disposed, user can use Asset Retirement Report. For the filters, user can filter by Cost Centre, Group/NPC/Base, Asset Category and Status.
[image]
Figure 132 - Report, Asset Listing (Detailed) Page
- User has the flexibility to either perform the filter here or can filter in the exported excel. Once user is ready to export, click “Export” at bottom right to export data into excel.
[image]
Figure 133 - Report, Asset Listing (Detailed), Export

#### [FAVE Stocktake Follow-up Report] How to generate FAVE stocktake follow-up report?

- To generate the FAVE stocktake follow-up in a report format. Click on Report, followed by Stocktake Follow up. The content of the report comes from FAVE where the item status was defined as OPEN.
[image]
Figure 134 - ATS Side Menu, to select Report, FAVE Stocktake (Follow up)
- Select Stocktake FAVE No. and Cost Centre. Click “Export” to export data into excel.
[image]
Figure 135 – Report, FAVE Stocktake Follow up Report
- After clicking "Export," the Excel file will be downloaded. In the Excel file, you can hover over the red section to view the static information.
[image]
Figure 136 – Report, Report follow up Excel file
[image]

### Settings Module

- Settings module allows the Agency Admin to have control over the application in terms of Cost Centre, Email triggers template, Announcement and FAVE generation. Only Groups can be managed by the individual UAO, URO, LOGS1.

#### [Cost Centre] How to update Cost Centre? (Admin only)

- To update the cost centre of users, click on Settings, followed by Cost Centre.
[image]
Figure 137 - ATS Side Menu, to select Cost Centre
- The list of cost centres will be displayed. Choose Cost Centre accordingly by clicking on the pencil icon on the right in the Actions column to edit.
[image]
Figure 138 - Cost Centre, Main Page
- Change the details where necessary (less Cost Centre Field), click “Update” once editing is completed.
[image]
Figure 139 - Cost Centre, Details Page
- Cost Centre is updated.
[image]
Figure 140 - Cost Centre, Update Confirmation Message

#### [Group] How to update Groupase? (U/NPCGroupAO, URO, LOGS1 only)

- Group/NPC/Base is used to define the individual units or NPCs tagged to a cost centre.
- To update Group/ NPC /Base, click on Settings, followed by Group.
[image]
Figure 141 - ATS Side Menu, to select Group
- The list of groups will be displayed. Choose Group accordingly by clicking on the pencil icon on the right in the Actions column to edit the groups.
[image]
Figure 142 - Group, Main Page
- Insert the details in the necessary fields, click “Update” once editing is done. Mandatory fields are Cost Centre, Name (Short) and Name (Long). There is a limit to the number of characters for each field:
- Name (Short): Limit to 25 characters only.
- Name (Long): Limit to 100 characters only.
- Description: Limit to 200 characters only.
[image]
Figure 143 - Group, Details Page
- Group is updated.
[image]
Figure 144 - Group, Update Confirmation Message

#### [Group] How to create NPC/Group/Base? (Admin only)

- To create NPC/Group/Base, click on Settings, followed by Group.
[image]
Figure 145 - ATS Side Menu, to select Group
- The list of Groups will be displayed. Click on Create on the top right to create a new group.
[image]
Figure 146 - Group, Main Page
- Input the details, click “Update” once done editing. Mandatory fields are Cost Centre, Name (Short) and Name (Long). There is a limit to the number of characters for each field:
- Name (Short): Limit to 25 characters only.
- Name (Long): Limit to 100 characters only.
- Description: Limit to 200 characters only.
[image]
Figure 147 - Group, Details Page
- Group is created.
[image]
Figure 148 - Group, Update Confirmation Message

#### [Email Template] How to update Email Template? (Admin only)

- ATS comes with pre-defined email triggers based on actions or schedules for routine reminders. The content of the email trigger can be managed by Agency Admin using this module.
- To update email template, Click on Settings, followed by Email Template.
[image]
Figure 149 - ATS Side Menu, to select Email Template
- The list of email templates will be displayed. Choose Email Template by clicking on the pencil icon on the right in the Actions column to edit.
[image]
Figure 150 - Email Template, Main PageFigure 150 - Email Template, Main Page [image]
- Type in the details in the relevant fields e.g. Template, Remarks, Email Subject and Email Content. Click on Update to proceed.
[image]
Figure 151 - Email Template, Details Page
- Email Template is updated.
[image]
Figure 152 - Email Template, Update Confirmation Message

#### [Announcement] How to update Announcement? (Admin only)

- Announcement allows the Agency admin to broadcast messages to alert users on information to lookout for. For instance, it can be maintenance notices or system malfunction or error alert notice
- To update announcement, Click on Settings, followed by Announcement.
[image]
Figure 153 - ATS Side Menu, to select Announcement
- Click on pencil icon to update either the Header or Footer. An example of Header and Footer is shown below. In the event of multiple Header or Footer created, the Announcement type filter can be used to display either Header or Footer only.
[image]
Figure 154 - Announcement, Main Page
[image]
Figure 155 - Example of Header and Footer
- Type in the Header or Footer message in the Content textbox. Click on Upload to proceed.
[image]
Figure 156 - Announcement, Details Page
- Announcement updated.
[image]
Figure 157 - Announcement, Update Confirmation Message

#### [Announcement] How to create Announcement? (Admin only)

- Announcement allows the Agency Admin to broadcast messages to alert users on information to lookout for. For instance, it can be maintenance messages or certain ongoing functionality issue.
- To create announcement, click on Settings, followed by Announcement.
[image]
Figure 158 - ATS Side Menu, to select Announcement
- Click Create on the top right corner.
[image]
Figure 159 - Announcement, Main Page
- Type in the Announcement message in the Content textbox. Next, input the start and end date that you wish to publish the announcement. Click on Upload to proceed.
- Refer to Part V, point 3 for example of header and footer.
[image]
Figure 160 - Announcement, Details Page
- Announcement is created.
[image]
Figure 161 - Announcement, Update Confirmation Message

#### [Master Setup] How to update Master Setup? (Admin only)

- Master Setup is the module used to generate FAVE. Agency Admin will input the date and system will trigger FAVE on 0000H of the input date. For example, if FAVE is required to be triggered on 30 Sep, then you need to select the date to be 30 Sep BEFORE 30 Sep. Hence, if user trigger on 29 Sep, it will work. But if user trigger on 30 Sep or later, it will not work as it is past the triggering time (0000H).
- To update Master Setup, select Settings, Master Setup.
[image]
Figure 162 - ATS Side Menu, to select Master Setup
- Input FAVE start date and click “Update” once editing is completed. FAVE will be triggered on the selected date at 0000H. If FAVE need to be triggered on 30 Sep, select the date to be 30 Sep.
[image]
Figure 163 - Master Setup, Main Page
- Master Setup is updated.
[image]
Figure 164 - Master Setup, Update Confirmation Message

### User Module

- The User module allows the Agency Admin to have control over the user and role Management. For example, updating of user account information or role assignment is part of this module.

#### [User Listing] How to update User Listing? (Admin only)

- The User Listing module allows user to update the user’s unit, email, contact number or the status of the account. The status will be updated when the user no longer needs to have access to ATS. For instance, changing of appointment or leaving the organization will result in updating of reviewing or updating of the user status.
- To update user listing, click on User, followed by User Listing.
[image]
Figure 165 - ATS Side Menu, to select User Listing
- The page will display the list of users, the roles mapped, login ID, unit and status. Select user by clicking on the pencil icon on the right in the Actions column to edit.
[image]
Figure 166 - User Listing, Main Page
- Input the details and click Update once done. Web Login ID will be WOG login ID while Mobile Login ID will be full NRIC.
- The mandatory fields are Web Login ID, Mobile Login ID, Name, Status and Unit. Web Login ID is the user WOG login ID while Mobile Login ID is the user SPFONE account ID which is likely NRIC. The Unit dropdown allows multiple selections for each user.
- Mobile Phone number is needed when user is tagged to Agency Admin role as Agency Admin role requires 2FA to be enabled.
- Roles tab will display all the roles that the user is assigned to. However, to update roles assignment, it is managed under Role Listing (Part III onwards).
[image]
Figure 167 - User Listing, Details Page
- User details are updated.
[image]
Figure 168 - User Listing, Update Confirmation Message

#### [User Listing] How to create user in User Listing? (Admin only)

- This module is required for Agency Admin to create user in ATS.
- To create user, click on User, followed by User Listing.
[image]
Figure 169 - ATS Side Menu, to select User Listing
- The page will display the list of users, the roles mapped, login ID, unit and status. Select user by clicking on the pencil icon on the right in the Actions column to edit. To create a new user, click the Create button.
[image]
Figure 170 - User Listing, Main Page
- Input the details and click Update once done. Web Login ID will be WOG login ID while Mobile Login ID will be full NRIC.
- The mandatory fields are Web Login ID, Mobile Login ID, Name, Unit and Status. Web Login ID is the user WOG login ID while Mobile Login ID is the user SPFONE account ID which is likely NRIC. The Unit dropdown allows multiple selections for each user.
- Mobile Phone number is required when user is tagged to Agency Admin role as Agency Admin role requires 2FA to be enabled.
- Roles tab will display all the roles that the user is assigned to. However, to update roles assignment, it is managed under Role Listing (Part III onwards).
[image]
- User is created.
[image]
Figure 171 - User Listing, Update Confirmation Message

#### [User Listing] How to delete user in User Listing? (Admin and HTA only)

- This module is required for Agency Admin to delete user in HTA, remember the delete user only can do in the HTA only.
- To delete user, click on User, followed by User Listing.
[image]
- The page will display the list of users, the roles mapped, login ID, unit and status. Select user by clicking on the pencil icon on the right in the Actions column to edit. To create a new user, click the Create button.
[image]
- Then you can click delete button to delete user
[image]
- User deleted

#### [Role Listing] How to update Role Listing configuration? (Admin only)

- The Role listing configuration is needed for Agency Admin to manage the role. Configuration includes setting the activeness of the role, to determine if the role requires 2FA login or whether the role requires access to all units.
- To update role listing configuration, click on User, followed by Role Listing.
[image]
Figure 172 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Agency Admin, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 173 - Role Listing, Main Page
- Click Edit Role on the left of the page.
[image]
Figure 174 - Role Listing, Functions Page
- Input the details and click Submit once ready.
- (Enabling of two step authentication is only applicable for Agency Admin role since admin role is considered a privileged account)
[image]
Figure 175 - Role Listing, Details Page, Edit Role
- The role is updated.
[image]
Figure 176 - Role Listing, Update Confirmation Message

#### [Role Listing] How to view Role Access Rights? (Admin, HQAO, HQFALO only)

- All roles are assigned with their unique access rights to the modules in ATS. Agency Admin, HQAO and HQ FALO are given the rights to view the access rights of the roles in ATS.
- To view role access rights, click on User, followed by Role Listing.
[image]
Figure 177 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Agency Admin, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 178 - Role Listing, Main Page
- At the Functions tab, the role’s access rights will be displayed. Expand the module further to give lower level of rights. Do note that access rights are tagged to role and not individual user.
[image]
Figure 179 - Role Listing, Functions Page
- Updates to Role access rights are only applicable via backend. Need to contact Vendor for assistance.

#### [Role Listing] How to assign user to specific role in Role Listing? (Admin only)

- When there is new request to assign user to new role due to changes in posting or new employment, the function is needed to be used by Agency Admin to perform the updates.
- To assign user to a role, click on User, followed by Role Listing.
[image]
Figure 180 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Agency Admin, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 181 - Role Listing, Main Page
- Click Users tab.
[image]
Figure 182 - Role Listing, Functions Page
- The list of users tagged to the role will be displayed. Click Add User to add user to the role.
[image]
Figure 183 - Role Listing, User Page
- Type in the textbox to search for the user name. Click on the checkbox on the left and click on Submit to add the user name.
[image]
Figure 184 - Role Listing, User Page, Add User
- User is added to the specific role.
[image]
Figure 185 - Role Listing, Update Confirmation Message

#### [Role Listing] How to remove user from specific role in Role Listing? (Admin only)

- When there is new request to remove users from role due to changes in posting, the function is needed to be used by Agency Admin to perform the updates.
- Click on User, followed by Role Listing.
[image]
Figure 186 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly which the user belongs to e.g. Agency Admin, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 187 - Role Listing, Main Page
- Click Users tab.
[image]
Figure 188 - Role Listing, Functions Page
- The list of users tagged to the role will be displayed. Type in the textbox on top to search for the username. Click the remove icon as shown below to remove the specific user from the role.
[image]
Figure 189 - Role Listing, User Page
- User is removed from the specific role.
[image]
Figure 190 - Role Listing, Update Confirmation Message

#### [Role Listing] How to perform mass assigning of users to specific role in Role Listing? (Admin only)

- Function of mass assigning of users to specific role is critical prior to FAVE. Since VET IC and stocktaker are different every year, Agency Admin will need to assign the VET IC and stocktaker role to prepare for FAVE.
- To perform the mass assigning of roles, click on User, followed by Role Listing.
[image]
Figure 191 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. VET IC, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 192 - Role Listing, Main Page
- Click Users tab.
[image]
Figure 193 - Role Listing, Functions Page
- The list of users tagged to the role will be displayed. Click Import User to import a list of users in excel format.
[image]
Figure 194 - Role Listing, Users Page, Import User button
- Select Excel file and navigate to the specific excel file in directory. Once loaded, click Import Template to import the selected excel file.
[image]
Figure 195 - Role Listing, Details Page, Import User

#### [Role Listing] How to add validity to specific role in Role Listing? (Admin only)

- This is an additional feature to provide Agency Admin the ability to control the validity of a role. This will be useful to control the role for VET IC and Stocktaker for FAVE.
- To add a validity to the role, click on User, followed by Role Listing.
[image]
Figure 196 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Vet IC, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 197 - Role Listing, Main Page
- Select Periods tab and click "Add Period” button.
[image]
Figure 198 - Role Listing, Periods Page
- Input the details and click Submit button once done. The Role will be automatically unusable if the role does not have a valid period. Valid period means current date is within Start and End date range.
[image]
Figure 199 - Role Listing, Periods Page, Add Period
- Period is successfully saved.
[image]
Figure 200 - Role Listing, Periods Page, Add Period Confirmation Message

#### [Role Listing] How to edit validity of specific role in Role Listing? (Admin only)

- This is an additional feature to provide Agency Admin the ability to control the validity of a role. This will be useful to control the role for VET IC and Stocktaker for FAVE.
- To edit validity of the role, click on User, followed by Role Listing.
[image]
Figure 201 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Vet IC, by clicking on the pencil icon in the Actions column.
[image]
Figure 202 - Role Listing, Main Page
- Select Periods tab and click the pencil icon as shown below.
[image]
Figure 203 - Role Listing, Periods Page
- Input the details and click Submit once done. The Role will be automatically unusable if the role does not have a valid period. Valid period means current date is within Start and End date range.
[image]
Figure 204 - Role Listing, Periods Page, Add Period
- Period is successfully saved.
[image]
Figure 205 - Role Listing, Periods Page, Add Period Confirmation Message

#### [Role Listing] How to remove validity from specific role in Role Listing? (Admin only)

- This is an additional feature to provide Agency Admin the ability to control the validity of a role. This will be useful to control the role for VET IC and Stocktaker for FAVE.
- To remove validity from the role, click on User, followed by Role Listing.
[image]
Figure 206 - ATS Side Menu, to select Role Listing
- The page will display the list of roles created. Choose the role accordingly e.g. Agency Admin, by clicking on the pencil icon on the right in the Actions column.
[image]
Figure 207 - Role Listing, Main Page
- Select Periods tab and click the Bin icon as shown below.
[image]
Figure 208 - Role Listing, Periods Page
- The selected period will be deleted and role will exist indefinitely.

### Dashboard

[image]

#### [Dashboard] Inbox Action Items

- Action Items, this section will display all notifications requiring direct action from the user. These will be determined by checking the email trigger recipients. If the user is in the "To:" field of the email, the notification will appear in this section.
- On this list action items, you can click item you want to take action
[image]
- Once you clicked the action item you will be direct to the relevant page, for example you click [FAVE] ATS: Fave Report Pending Clearance then you will be direct to Fave Page or you click [Assignment] then you will be direct to Assignment page
[image]
- Then you can do the action you need, upon performing the action, the liner will be removed from the action item.

#### [Dashboard] Inbox Informative

"Informative": This section will contain notifications that do not require immediate action but are for the user's information. If the user is in the "cc:" field of the email, the notification will be placed in this section.
[image]

#### [Dashboard] Summary

- The summary is contain asset overview, you can see all the information from the assets
[image]
- You can hover the pie chart to take a look detail information from the chart
[image]
- You can click the asset overview to view detailed information, including a bar chart for asset details.
[image]

## Hardware Support Q&A

- In summary, these are the mandatory steps for printer set up:
- Connecting the printer to the laptop with the drivers installed
- Load RFID Tag Labels
- Load RFID Ribbon
- Print a test label
- Calibrate ribbon and media sensors
- Retest the label to confirm
- Some common issues encountered and recommended resolutions are:
- If printing issues are observed such as:
- Skipped labels
- Vertical image/label drift
- Ribbon out or media out errors
- VOID issues
- Faded Prints
- Perform the Steps in A and B to ensure Media and Ribbon are properly loaded. Next, perform Steps in C and D to ensure the sensor settings are still intact.

### Inserting the Media into the Printer

- Raise the media door. [image]
Figure 209 - Open media doorFigure 209 - Open media door [image]
- Remove and discard any tags or labels that are torn or dirty or that are held by adhesives or tape.
Figure 210 - Unwanted parts of the tagFigure 210 - Unwanted parts of the tag [image]
- Figure 211 - Media supply guideFigure 211 - Media supply guidePull out the media supply guide as far as it goes. [image]
[image]
- Insert roll media into the printer.
Figure 212 - Tag positionFigure 212 - Tag position [image]

| Type of media | Instructions |
|---|---|
| Roll media | Place the roll of media on the media supply hanger. Push the roll as far back as it will go. |

- Open the printhead assembly by rotating the printhead-open lever upward. Can adjust both left and right printheads for optimum ink transfer for your unit. [image]
Figure 213 - Printhead open leverFigure 213 - Printhead open lever [image]
- Figure 214 - Media guide sliderFigure 214 - Media guide sliderSlide the media guide all the way out. [image]
- CAUTION: HOT SURFACE: The printhead may be hot and could cause severe burns. Allow the printhead to cool. [image]
- From the media hanger (1), feed the media under the dancer assembly (2), through the media sensor (3), and under the printhead assembly (4). Slide the media back until it touches the inside back wall of the media sensor.
Figure 215 - Positioning of tags through the printerFigure 215 - Positioning of tags through the printer [image]
4 3 2 1
- Figure 216 - Media guide sliderFigure 216 - Media guide sliderSlide in the media guide until it just touches the edge of the media. [image]
- Ensure Ribbon is loaded and rotate the printhead-open lever downward until it locks the printhead in place. [image]
Figure 217 - Printhead open leverFigure 217 - Printhead open lever [image]
- Figure 218 - Close media doorFigure 218 - Close media doorClose the media door. [image]

### Loading the Ribbon

- Raise the media door. [image]
- Figure 219 - Open media doorFigure 219 - Open media door [image]
- CAUTION: HOT SURFACE: The printhead may be hot and can cause severe burns. Allow the printhead to cool. [image]
- Open the printhead assembly by rotating the printhead-open lever upward. [image]
Figure 220 - Printhead open leverFigure 220 - Printhead open lever [image]
- Place the roll of ribbon on the ribbon supply spindle with the loose end of the ribbon unrolling as shown. Push the roll back all the way in so that the printer can detect the presence of the roll of ribbon.
Figure 221 - Ribbon positionFigure 221 - Ribbon position [image]
- Bring the ribbon under the printhead assembly and around its left side, as shown.
Figure 222 - Position of ribbon through printerFigure 222 - Position of ribbon through printer [image]
- Wrap the ribbon tracking as far back as it can under the printhead assembly. Wrap the ribbon around the ribbon take-up spindle. Rotate the spindle several turns in the direction shown to tighten and align the ribbon.
Figure 223 - Wrap ribbon around spindleFigure 223 - Wrap ribbon around spindle [image]
- Rotate the printhead-open lever downward until it locks the printhead in place. We should hear one click if the print head is closed completely.
[image]
Figure 224 - Close printhead open lever
- Close the media door.
[image]
Figure 225 - Close media door

### Calibrating the Ribbon and Media Sensors

- Printer calibration adjusts the sensitivity of the media and ribbon sensors. It also helps ensure proper alignment of the image being printed and optimise print quality.
- Perform calibration in the following situations:
- when switched to a different size or type of ribbon or media.
- The printer experiences any of the following issues:
- skips labels
- the printed image wanders/drifts either side to side or up and down
- ribbon is not being detected when it is installed or when it runs out
- non-continuous labels are being treated as continuous
- Performing Auto Calibration:
- YSet the printer to perform an auto calibration (CALIBRATE) or a short calibration (SHORT CAL) using the POWER UP ACTION or HEAD CLOSE ACTION parameters.
- CALIBRATE—Adjusts sensor levels and thresholds, determines the label length, and feeds the media to the next web.
- SHORT CAL—Sets the media and web thresholds without adjusting sensor gain, determines the label length, and feeds the media to the next web.
- Performing Manual Sensor Calibration:
- To manually calibrate the printer if there are issues with the print output.
- Figure 226 -Printer Calibration Figure 226 -Printer Calibration Touch Print > Sensors > Manual Calibration. [image]
- Touch Start Calibration.
- Follow the steps in the calibration procedure as prompted.
- IMPORTANT: Follow the calibration procedure exactly as presented. Press and Hold
- CANCEL at any step in the procedure to cancel the calibration process.
- When calibration is complete, press PAUSE to exit pause mode and enable printing.
- Ensure that country code is updated by going to Menu > RFID > RFID> RFID Country Code > Select Singapore.
- Performing Calibration of Left and Right Printhead:
- For optimum ink transfer, it is advised to set the Left printhead to Gear 2 while Right printhead to remain as Gear 1 as shown below.
[image]
Figure 227 – Optimum Printhead Calibration

### Adjusting the Sensor Position

- The transmissive media sensor assembly consists of two parts:
- Light source (lower part of the media sensor)
- Light sensor (upper part of the media sensor) The media passes between these two parts.
- Adjust the position of the sensor only if the printer cannot detect the top of the labels. If that occurs, the printer display will showa "media out error" despite media being loaded.
- For non-continuous media with a notch or hole, the sensor must be positioned directly at the notch or hole.
- Remove the ribbon so you can see the media path clearly.
- Load the media so that the green light from the media sensor is shining through a gap, notch, or hole.
Figure 228 - Green light media sensorFigure 228 - Green light media sensor [image]
- If necessary, slide the media sensor horizontally using the media sensor adjustment.
Figure 229 - Media sensor sliderFigure 229 - Media sensor slider [image]
