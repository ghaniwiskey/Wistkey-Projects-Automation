# ATS web user manual: Introduction: background, external systems, asset statuses, roles, function overview

Part of the CR12 web user manual (21 Sep 2026); index and source: README.md.

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
