# ATS web user manual: Stocktake module: FAVE, follow up, FAVE(HQ)

Part of the CR12 web user manual (21 Sep 2026); index and source: README.md.

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
