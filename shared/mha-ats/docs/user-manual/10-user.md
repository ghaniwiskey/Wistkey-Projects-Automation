# ATS web user manual: User module: user listing, role listing

Part of the CR12 web user manual (21 Sep 2026); index and source: README.md.

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
