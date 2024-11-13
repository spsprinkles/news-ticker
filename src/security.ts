import { ListSecurity, ListSecurityDefaultGroups } from "dattatable";
import { ContextInfo, SPTypes, Types } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * Security
 */
export class Security {
    private static _listSecurity: ListSecurity = null;

    // Current User
    private static _currentUser: Types.SP.User = null;
    static get CurrentUser(): Types.SP.User { return this._currentUser; }

    // Is Admin
    private static _isAdmin: boolean = false;
    static get IsAdmin(): boolean { return this._isAdmin; }

    // Is Owner
    private static _isOwner: boolean = false;
    static get IsOwner(): boolean { return this._isOwner; }

    // Initialization
    static init(): PromiseLike<void> {
        // Return a promise
        return new Promise(resolve => {
            // Create the list security
            this._listSecurity = new ListSecurity({
                listItems: [
                    {
                        listName: Strings.Lists.News,
                        groupName: ListSecurityDefaultGroups.Owners,
                        permission: SPTypes.RoleType.Administrator
                    },
                    {
                        listName: Strings.Lists.News,
                        groupName: ListSecurityDefaultGroups.Members,
                        permission: SPTypes.RoleType.Contributor
                    },
                    {
                        listName: Strings.Lists.News,
                        groupName: ListSecurityDefaultGroups.Visitors,
                        permission: SPTypes.RoleType.Reader
                    }
                ],
                onGroupsLoaded: () => {
                    // Set the flags
                    this._isAdmin = this._listSecurity.CurrentUser.IsSiteAdmin;
                    this._isOwner = this._listSecurity.isInGroup(ContextInfo.userId, ListSecurityDefaultGroups.Owners);

                    // Resolve the request
                    resolve();
                }
            });
        });
    }
}